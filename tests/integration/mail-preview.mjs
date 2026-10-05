import assert from 'node:assert/strict';
import test from 'node:test';
const origin = process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(origin).hostname), 'Local preview only');
const admin = process.env.PIONEER_TEST_ADMIN_EMAIL ?? 'mail-admin-preview@example.org';
const headers = { origin, 'content-type': 'application/json', 'oai-authenticated-user-id': 'mail-admin-test', 'oai-authenticated-user-email': admin };
test('actual mail API enforces administrator access, previews both languages and refuses unconfigured delivery', async () => {
 assert.equal((await fetch(`${origin}/api/admin/mail`)).status,403);
 const unauthorized = await fetch(`${origin}/api/admin/mail`,{headers:{...headers,'oai-authenticated-user-email':'other@example.org'}}); assert.equal(unauthorized.status,403);
 const response=await fetch(`${origin}/api/admin/mail`,{headers}); assert.equal(response.status,200); const state=await response.json(); assert.equal(state.enabled,false); assert.ok(state.missing.includes('RESEND_API_KEY'));
 const post = body=>fetch(`${origin}/api/admin/mail`,{method:'POST',headers,body:JSON.stringify(body)});
 const preview=await post({action:'preview',topic:'weekly'});assert.equal(preview.status,200);const data=await preview.json();assert.match(data.edition.en.text,/ycombinator.com/);assert.match(data.edition.zh.text,/官方来源核验/);
 assert.equal((await post({action:'enqueue',topic:'weekly',editionId:data.edition.id,confirmed:true})).status,503);
 assert.equal((await post({action:'send',id:data.edition.id,confirmed:true})).status,503);
 assert.equal((await post({action:'unknown'})).status,400);
 const cross=await fetch(`${origin}/api/admin/mail`,{method:'POST',headers:{...headers,origin:'https://other.example'},body:JSON.stringify({action:'preview',topic:'weekly'})});assert.equal(cross.status,403);
 const after=await(await fetch(`${origin}/api/admin/mail`,{headers})).json();assert.equal(after.campaigns.length,state.campaigns.length);
 const page=await fetch(`${origin}/admin/mail`,{headers});assert.equal(page.status,200);const html=await page.text();assert.match(html,/通知发布与投递/);assert.match(html,/noindex/);
});
