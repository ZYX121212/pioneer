import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin = process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname), 'Local preview only');
const email = `email-auth-${randomUUID()}@example.org`, password = `Test-only-${randomUUID()}`;
let sessionCookie;
const testIp = `192.0.2.${Math.floor(Math.random() * 254) + 1}`;
function cookies(response) { return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; '); }
function auth(path, body, cookie, override = {}) { return fetch(`${origin}/api/auth/${path}`, { method: 'POST', headers: { origin, 'content-type': 'application/json', 'cf-connecting-ip': testIp, ...(cookie ? { cookie } : {}), ...override }, body: JSON.stringify(body) }); }
function workspace(cookie, method='GET', body, extra = {}) { return fetch(`${origin}/api/workspace`, { method, headers: { origin, 'content-type': 'application/json', 'cf-connecting-ip': testIp, ...(cookie ? { cookie } : {}), ...extra }, body: body ? JSON.stringify(body) : undefined }); }
const state = { project: { name: 'Email account project', oneLine: '', targetUser: '', currentRisk: 'Observe customers', nextAction: 'Interview two users', stage: 'idea', goals: ['customers'], updatedAt: new Date().toISOString() }, archive: [], decisions: [], completions: [], shortlist: ['y-combinator'], tasks: [] };
test('email registration, password login and real D1 workspace isolate identities without ChatGPT', async () => {
  assert.equal((await auth('sign-up/email', { email, password: 'short', name: 'Local test' })).status, 400);
  const registered = await auth('sign-up/email', { email, password, name: 'Local test' }); assert.equal(registered.status, 200); sessionCookie = cookies(registered); assert.ok(sessionCookie.includes('pioneer.session_token='));
  const body=await registered.json(); assert.equal(body.user.emailVerified,false);
  assert.equal((await auth('sign-in/email', { email, password: 'incorrect-password' })).status, 401);
  const login = await auth('sign-in/email', { email: email.toUpperCase(), password }); assert.equal(login.status,200); const cookie=cookies(login); assert.ok(cookie);
  assert.equal((await workspace()).status,401);
  const saved=await workspace(cookie,'PUT',{version:0,state,userId:'other-owner'}); assert.equal(saved.status,200); assert.equal((await saved.json()).version,1);
  assert.equal((await (await workspace(cookie)).json()).state.project.name,state.project.name);
  const legacy=await workspace(null,'GET',null,{'oai-authenticated-user-id':'legacy-same-email','oai-authenticated-user-email':email}); assert.equal((await legacy.json()).state.project,null);
  const accountB=await auth('sign-up/email',{email:`other-${randomUUID()}@example.org`,password,name:'Other local test'}); assert.equal(accountB.status,200); assert.equal((await (await workspace(cookies(accountB))).json()).state.project,null);
  const newsletter=await fetch(origin+'/api/newsletter',{headers:{cookie}}); assert.equal(newsletter.status,403); assert.equal((await newsletter.json()).code,'email_verification_required');
  assert.equal((await fetch(origin+'/api/admin/mail',{headers:{cookie}})).status,403);
  const page=await fetch(origin+'/workspace',{headers:{cookie}}); const html=await page.text();assert.equal(page.status,200);assert.ok(html.includes('账号设置 / 退出登录'));assert.ok(html.includes('资源清单与对比'));assert.ok(!html.includes('使用邮箱登录'));
  const changed=await auth('change-password',{currentPassword:password,newPassword:password+'-new',revokeOtherSessions:true},cookie);assert.equal(changed.status,200);
  assert.equal((await workspace(sessionCookie)).status,401);
  assert.equal((await auth('sign-in/email',{email,password})).status,401);
  const newLogin=await auth('sign-in/email',{email,password:password+'-new'});assert.equal(newLogin.status,200);sessionCookie=cookies(newLogin);
  const out=await auth('sign-out',{},sessionCookie);assert.equal(out.status,200);assert.equal((await workspace(sessionCookie)).status,401);
});
test('account endpoints reject cross-origin, missing origin, oversized input, reserved actions and tampered cookies', async () => {
  assert.equal((await auth('sign-in/email',{email,password},null,{origin:'https://other.example'})).status,403);
  const missing=await fetch(origin+'/api/auth/sign-in/email',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});assert.equal(missing.status,403);
  assert.equal((await auth('sign-up/email',{name:'x'.repeat(9000),email,password})).status,413);
  assert.equal((await auth('delete-user',{})).status,404);
  assert.equal((await fetch(origin+'/api/auth/sign-out')).status,405);
  assert.equal((await workspace('pioneer.session_token=forged.signature')).status,401);
});
test('bilingual sign-in pages expose email first and retain optional ChatGPT sign-in', async () => {
  for(const [path,label] of [['/login','邮箱登录'],['/en/login','Sign in with email']]) { const response=await fetch(origin+path+'?return_to=https://other.example');const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes(label));assert.ok(html.includes('type="email"'));assert.ok(html.includes('type="password"'));assert.ok(html.includes('return_to=%2F'));assert.ok(!html.includes('return_to=https')); }
});
