import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const cache = new Map();
async function moduleUrl(file) {
 if (cache.has(file)) return cache.get(file);
 let source = ts.transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
 for (const match of [...source.matchAll(/from "(\.[^"]+)"/g)]) {
  const resolved = path.resolve(path.dirname(file), `${match[1]}.ts`); const dependency = await moduleUrl(resolved); source = source.replace(JSON.stringify(match[1]), JSON.stringify(dependency));
 }
 const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`; cache.set(file, url); return url;
}
const lib = name => moduleUrl(fileURLToPath(new URL(`../app/lib/${name}.ts`, import.meta.url))).then(url => import(url));
const provider = await lib('mailProvider'), newsletter = await lib('newsletterService'), service = await lib('mailService'), content = await lib('mailContent');
async function database() {
 const sqlite = new DatabaseSync(':memory:');
 for (const name of (await readdir(new URL('../drizzle/', import.meta.url))).filter(n => n.endsWith('.sql')).sort()) sqlite.exec(await readFile(new URL(`../drizzle/${name}`, import.meta.url), 'utf8'));
 const wrap = (sql, args = []) => ({ bind(...values) { return wrap(sql, values); }, async first() { return sqlite.prepare(sql).get(...args) ?? null; }, async all() { return { results: sqlite.prepare(sql).all(...args), success: true, meta: {} }; }, async run() { const r = sqlite.prepare(sql).run(...args); return { success: true, results: [], meta: { changes: Number(r.changes) } }; } });
 return { db: { prepare: wrap }, sqlite };
}
const config = { key: 're_controlled_test', from: 'founders@pioneer.example', origin: 'https://pioneer-global-resources.hiayun.chatgpt.site' };
const now = new Date('2026-10-05T04:00:00Z');
const edition = content.buildMailEdition('weekly', '', config.origin, now);
const alice = { id: 'alice', email: 'alice@example.org' }, bob = { id: 'bob', email: 'bob@example.org' };
const prefs = { language: 'en', weekly: true, cases: false };
const count = (status, name) => status.counts.find(row => row.status === name)?.n ?? 0;
test('mail configuration fails closed and content uses current bilingual sources with deadline expiry', () => {
 assert.equal(provider.mailConfiguration({}).enabled, false);
 const env = { RESEND_API_KEY: config.key, MAIL_FROM: config.from, MAIL_SITE_ORIGIN: config.origin, MAIL_DELIVERY_ENABLED: 'true' };
 assert.equal(provider.mailConfiguration(env).enabled, true);
 assert.equal(provider.mailConfiguration({ ...env, MAIL_SITE_ORIGIN: 'https://attacker.example' }).enabled, false);
 assert.equal(provider.mailConfiguration({ ...env, MAIL_FROM: 'a@b.example\nBcc: x@b.example' }).enabled, false);
 assert.equal(provider.mailConfiguration({ ...env, MAIL_DELIVERY_ENABLED: 'false' }).enabled, false);
 assert.match(edition.en.text, /ycombinator.com\/apply/); assert.match(edition.zh.text, /官方来源核验/);
 assert.throws(() => content.buildMailEdition('weekly', '', config.origin, new Date('2026-10-12T00:00:00+08:00')));
 const guide = content.buildMailEdition('cases', 'first-user-interview', config.origin, now); assert.match(guide.en.text, /\/en\/knowledge\/first-user-interview/); assert.equal(guide.topic, 'cases');
});
test('queue admits only confirmed matching topics, saves bilingual payload and prevents repeated edition membership', async () => {
 const { db, sqlite } = await database(); await newsletter.saveNewsletter(db, alice, 0, prefs); await newsletter.saveNewsletter(db, bob, 0, { language: 'zh', weekly: false, cases: true }); await newsletter.registerNewsletterInterest(db, 'legacy@example.org', 'zh', '/', 'legacy');
 const preview = await service.campaignPreview(db, edition); assert.deepEqual(preview.recipients.map(row => ({...row})), [{ language: 'en', n: 1 }]);
 assert.equal((await service.enqueueCampaign(db, edition, config, 'owner', now)).added, 1); assert.equal((await service.enqueueCampaign(db, edition, config, 'owner', now)).added, 0);
 const payload = JSON.parse(sqlite.prepare('SELECT payload FROM mail_deliveries').get().payload); assert.deepEqual(payload.to, [alice.email]); assert.match(payload.text, /unsubscribe#token=[a-f0-9]{64}/); assert.match(payload.text, /\/en\/notifications/);
 assert.equal((await service.campaignPreview(db, { ...edition, en: { ...edition.en, text: 'Changed later' } })).edition.en.text, edition.en.text);
 sqlite.close();
});
test('queued mail is cancelled when preferences change or verified opportunity window expires', async () => {
 for (const changed of ['unsubscribe', 'language', 'expiry']) {
  const { db, sqlite } = await database(); const saved = await newsletter.saveNewsletter(db, alice, 0, prefs); await service.enqueueCampaign(db, edition, config, 'owner', now);
  if (changed === 'unsubscribe') await newsletter.unsubscribeNewsletter(db, alice, saved.version);
  if (changed === 'language') await newsletter.saveNewsletter(db, alice, saved.version, { ...prefs, language: 'zh' });
  let calls = 0; const result = await service.drainCampaign(db, edition.id, config, changed === 'expiry' ? new Date(edition.validUntil) : now, async () => { calls++; return Response.json({ id: 'provider-id' }); });
  assert.equal(calls, 0); assert.equal(count(result, 'cancelled'), 1); sqlite.close();
 }
});
test('uncertain network retry reuses exact payload/key, never repeats accepted sends, and confirms delivery separately', async () => {
 const { db, sqlite } = await database(); await newsletter.saveNewsletter(db, alice, 0, prefs); await service.enqueueCampaign(db, edition, config, 'owner', now);
 const seen = []; let first = true;
 const fake = async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); seen.push({ key: options.headers['Idempotency-Key'], body: options.body }); if (first) { first = false; throw new Error('Accepted remotely, connection lost'); } return Response.json({ id: 'provider-id' }); };
 const retry = await service.drainCampaign(db, edition.id, config, now, fake); assert.equal(count(retry, 'retry'), 1);
 const accepted = await service.drainCampaign(db, edition.id, config, new Date(now.getTime() + 60_001), fake); assert.equal(count(accepted, 'accepted'), 1); assert.deepEqual(seen[0], seen[1]);
 await service.drainCampaign(db, edition.id, config, new Date(now.getTime() + 120_000), fake); assert.equal(seen.length, 2);
 const delivered = await service.inspectCampaign(db, edition.id, config, async (url, options) => { assert.equal(url, 'https://api.resend.com/emails/provider-id'); assert.equal(options.method, undefined); return Response.json({ id: 'provider-id', last_event: 'delivered' }); });
 assert.equal(count(delivered, 'delivered'), 1); const api = await service.campaignStatus(db, edition.id); assert.ok(!JSON.stringify(api).includes(alice.email)); assert.ok(!JSON.stringify(api).includes('#token=')); sqlite.close();
});
test('provider retry limits preserve waiting time and uncertain attempts stop before idempotency expires', async () => {
 const { db, sqlite } = await database(); await newsletter.saveNewsletter(db, alice, 0, prefs); await service.enqueueCampaign(db, edition, config, 'owner', now);
 let calls = 0; const fake = async () => { calls++; return new Response('{}', { status: 429, headers: { 'retry-after': '120' } }); };
 await service.drainCampaign(db, edition.id, config, now, fake); await service.drainCampaign(db, edition.id, config, new Date(now.getTime() + 60_000), fake); assert.equal(calls, 1);
 const blocked = await service.drainCampaign(db, edition.id, config, new Date(now.getTime() + 23 * 60 * 60 * 1000), fake); assert.equal(calls, 1); assert.equal(count(blocked, 'uncertain'), 1); sqlite.close();
});
test('concurrent send requests atomically claim a recipient once and permanent failures are not retried', async () => {
 const { db, sqlite } = await database(); await newsletter.saveNewsletter(db, alice, 0, prefs); await service.enqueueCampaign(db, edition, config, 'owner', now);
 let release, entered; const started = new Promise(resolve => entered = resolve); const pending = new Promise(resolve => release = resolve); let calls = 0;
 const fake = async () => { calls++; entered(); await pending; return Response.json({ id: 'provider-id' }); };
 const first = service.drainCampaign(db, edition.id, config, now, fake); await started; const second = await service.drainCampaign(db, edition.id, config, now, fake); assert.equal(count(second, 'sending'), 1); release(); await first; assert.equal(calls, 1); sqlite.close();
 const other = await database(); await newsletter.saveNewsletter(other.db, alice, 0, prefs); await service.enqueueCampaign(other.db, edition, config, 'owner', now); let failures = 0; const reject = async () => { failures++; return new Response('{}', { status: 403 }); };
 const failed = await service.drainCampaign(other.db, edition.id, config, now, reject); assert.equal(count(failed, 'failed'), 1); await service.drainCampaign(other.db, edition.id, config, new Date(now.getTime() + 60_000), reject); assert.equal(failures, 1); other.sqlite.close();
});
test('lost request lease can resume within idempotency window, and provider status errors preserve accepted evidence', async () => {
 const { db, sqlite } = await database(); await newsletter.saveNewsletter(db, alice, 0, prefs); await service.enqueueCampaign(db, edition, config, 'owner', now);
 sqlite.prepare("UPDATE mail_deliveries SET status='sending', attempts=1, first_attempt_at=?, lease_until=?").run(now.getTime(), now.getTime()+60_000);
 let calls=0; const send = async () => { calls++; return Response.json({id:'provider-id'}); };
 await service.drainCampaign(db, edition.id, config, new Date(now.getTime()+30_000), send); assert.equal(calls,0);
 const accepted = await service.drainCampaign(db, edition.id, config, new Date(now.getTime()+60_001), send); assert.equal(count(accepted,'accepted'),1);
 const inspected = await service.inspectCampaign(db, edition.id, config, async()=>new Response('{}',{status:503})); assert.equal(count(inspected,'accepted'),1); assert.equal(inspected.deliveries[0].error,'provider_status_unavailable'); sqlite.close();
});

test('larger confirmed audience is processed through bounded batches without omitting later recipients', async () => {
 const { db, sqlite } = await database();
 for(let i=0;i<21;i++)await newsletter.saveNewsletter(db,{id:`founder-${i}`,email:`founder-${i}@example.org`},0,{...prefs,language:i%2?'zh':'en'});
 assert.equal((await service.enqueueCampaign(db,edition,config,'owner',now)).added,20);assert.equal((await service.enqueueCampaign(db,edition,config,'owner',now)).added,1);assert.equal((await service.enqueueCampaign(db,edition,config,'owner',now)).added,0);
 const keys=new Set();let calls=0;const result=await service.drainCampaign(db,edition.id,config,now,async(_url,options)=>{calls++;keys.add(options.headers['Idempotency-Key']);return Response.json({id:`provider-${calls}`});});
 assert.equal(calls,3);assert.equal(keys.size,3);assert.equal(count(result,'accepted'),3);assert.equal(count(result,'queued'),18);sqlite.close();
});
test('explicit failure recovery reopens only rejected requests and never revives uncertain outcomes', async () => {
 const { db, sqlite } = await database();await newsletter.saveNewsletter(db,alice,0,prefs);await newsletter.saveNewsletter(db,bob,0,prefs);await service.enqueueCampaign(db,edition,config,'owner',now);
 sqlite.prepare("UPDATE mail_deliveries SET status='failed', error='provider_http_403', first_attempt_at=? WHERE subscriber_id=(SELECT id FROM newsletter_subscribers WHERE user_id='alice')").run(now.getTime());
 sqlite.prepare("UPDATE mail_deliveries SET status='uncertain', error='retry_window_closed', first_attempt_at=? WHERE subscriber_id=(SELECT id FROM newsletter_subscribers WHERE user_id='bob')").run(now.getTime());
 const later=new Date(now.getTime()+25*60*60*1000);const recovered=await service.retryFailedCampaign(db,edition.id,later);assert.equal(recovered.requeued,1);assert.equal(count(recovered,'uncertain'),1);
 let calls=0;const result=await service.drainCampaign(db,edition.id,config,later,async()=>{calls++;return Response.json({id:'provider-id'});});assert.equal(calls,1);assert.equal(count(result,'accepted'),1);assert.equal(count(result,'uncertain'),1);sqlite.close();
});

test('status refresh follows later provider events after delivery and preserves honest evidence on inspection failure', async () => {
 const { db, sqlite } = await database();await newsletter.saveNewsletter(db,alice,0,prefs);await service.enqueueCampaign(db,edition,config,'owner',now);await service.drainCampaign(db,edition.id,config,now,async()=>Response.json({id:'provider-id'}));
 const delivered=await service.inspectCampaign(db,edition.id,config,async()=>Response.json({id:'provider-id',last_event:'delivered'}));assert.equal(count(delivered,'delivered'),1);assert.ok(delivered.deliveries[0].checked_at);
 const bounced=await service.inspectCampaign(db,edition.id,config,async()=>Response.json({id:'provider-id',last_event:'bounced'}));assert.equal(count(bounced,'undeliverable'),1);
 const unavailable=await service.inspectCampaign(db,edition.id,config,async()=>{throw new Error('offline');});assert.equal(count(unavailable,'undeliverable'),1);assert.equal(unavailable.deliveries[0].error,'provider_status_unavailable');sqlite.close();
});
