import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const schemaUrl = dataModule((await compile('../db/authSchema.ts')).replace('"drizzle-orm/sqlite-core"',JSON.stringify(import.meta.resolve('drizzle-orm/sqlite-core'))));
const mailUrl=dataModule(await compile('../app/lib/mailProvider.ts'));
const accountMailUrl=dataModule((await compile('../app/lib/accountMailProvider.ts')).replace('"./mailProvider"',JSON.stringify(mailUrl)));
const { accountMailConfiguration, sendAccountMail } = await import(accountMailUrl);
let source=await compile('../app/lib/emailAuth.ts');
for(const name of ['better-auth/minimal','better-auth/adapters/drizzle','drizzle-orm/d1']) source=source.replace(JSON.stringify(name),JSON.stringify(import.meta.resolve(name)));
source=source.replace('"../../db/authSchema"',JSON.stringify(schemaUrl)).replace('"./mailProvider"',JSON.stringify(mailUrl)).replace('"./accountMailProvider"',JSON.stringify(accountMailUrl));
const { createEmailAuth }=await import(dataModule(source));
test('Brevo account mail fails closed independently of newsletter configuration', () => {
 const base={ACCOUNT_MAIL_PROVIDER:'brevo',BREVO_API_KEY:'test-only-key',ACCOUNT_MAIL_FROM:'sender@example.org',ACCOUNT_MAIL_DELIVERY_ENABLED:'true',MAIL_SITE_ORIGIN:'https://pioneer-global-resources.hiayun.chatgpt.site',MAIL_DELIVERY_ENABLED:'false'};
 assert.equal(accountMailConfiguration(base).enabled,true);
 assert.equal(accountMailConfiguration({...base,BREVO_API_KEY:'',RESEND_API_KEY:'other-provider-key'}).enabled,false);
 assert.equal(accountMailConfiguration({...base,ACCOUNT_MAIL_FROM:'sender@example.org\nBcc: other@example.org'}).enabled,false);
 assert.equal(accountMailConfiguration({...base,MAIL_SITE_ORIGIN:'https://attacker.example'}).enabled,false);
 assert.equal(accountMailConfiguration({...base,ACCOUNT_MAIL_DELIVERY_ENABLED:'false',MAIL_DELIVERY_ENABLED:'true'}).enabled,false);
 assert.equal(accountMailConfiguration({...base,ACCOUNT_MAIL_PROVIDER:'typo'}).enabled,false);
});
test('Brevo acceptance, malformed responses and rejection remain distinct', async () => {
 const config={provider:'brevo',key:'test-only-key',from:'sender@example.org',origin:'https://pioneer-global-resources.hiayun.chatgpt.site'};
 const id='account-verify-7de73b8e-8224-4d2e-88e1-f24606f3b754',payload={from:config.from,to:['test@example.org'],subject:'Verify',text:'https://example.org/?a=1&b=2 <script>',headers:{}};
 assert.equal(await sendAccountMail(config,id,payload,async (_url,options)=>{const body=JSON.parse(options.body);assert.equal(body.headers.idempotencyKey,id.slice(-36));assert.ok(body.htmlContent.includes('&amp;'));assert.ok(!body.htmlContent.includes('<script>'));return Response.json({messageId:'<accepted@example.org>'},{status:201});}),'<accepted@example.org>');
 await assert.rejects(sendAccountMail(config,id,payload,async()=>Response.json({})),{code:'provider_response_uncertain'});
 await assert.rejects(sendAccountMail(config,id,payload,async()=>new Response('{}',{status:403})),{code:'provider_http_403',retryable:false});
 await assert.rejects(sendAccountMail(config,id,payload,async()=>new Response('{}',{status:429,headers:{'retry-after':'120'}})),{code:'provider_http_429',retryable:true,retryAfter:120000});
});
async function database() {
 const sqlite=new DatabaseSync(':memory:');for(const name of (await readdir(new URL('../drizzle/',import.meta.url))).filter(x=>x.endsWith('.sql')).sort()) sqlite.exec(await readFile(new URL(`../drizzle/${name}`,import.meta.url),'utf8'));
 const statement=(sql,args=[])=>({bind(...values){return statement(sql,values)},async raw(){const query=sqlite.prepare(sql);query.setReturnArrays(true);return query.all(...args)},async all(){return {success:true,results:sqlite.prepare(sql).all(...args),meta:{}}},async run(){sqlite.prepare(sql).run(...args);return {success:true,results:[],meta:{}}}});
 return {sqlite,db:{prepare:statement}};
}
const origin='http://localhost:3000', runtime={PIONEER_AUTH_SECRET:'test-only-secret-longer-than-thirty-two-characters'};
function request(path,body,cookie) {return new Request(origin+'/api/auth/'+path,{method:body?'POST':'GET',headers:{origin,'content-type':'application/json','cf-connecting-ip':'127.0.0.1',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});}
function cookieOf(response){return response.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ')}
test('email auth stores a password hash, rejects forged sessions and revokes a real session on sign-out',async()=>{
 const {sqlite,db}=await database();const auth=createEmailAuth(db,runtime,origin);const password='Test-only-valid-password-2026';
 const signup=await auth.handler(request('sign-up/email',{name:'Unit test',email:'auth-unit@example.org',password}));assert.equal(signup.status,200);const cookie=cookieOf(signup);assert.ok(cookie);
 const hash=sqlite.prepare('select password from pioneer_auth_accounts').get().password;assert.notEqual(hash,password);assert.ok(hash.length>64);assert.equal(sqlite.prepare('select email_verified from pioneer_auth_users').get().email_verified,0);
 const session=await auth.handler(request('get-session',null,cookie));assert.ok((await session.json()).user.id);
 const forged=await auth.handler(request('get-session',null,'pioneer.session_token=fake.signature'));assert.equal(await forged.json(),null);
 const out=await auth.handler(request('sign-out',{},cookie));assert.equal(out.status,200);assert.equal(await (await auth.handler(request('get-session',null,cookie))).json(),null);sqlite.close();
});
test('email sign-in enforces database-backed rate limiting and untrusted callback URLs are refused',async()=>{
 const {sqlite,db}=await database();const auth=createEmailAuth(db,runtime,origin);
 for(let i=0;i<5;i++) assert.equal((await auth.handler(request('sign-in/email',{email:'unknown@example.org',password:'invalid-password-2026'}))).status,401);
 assert.equal((await auth.handler(request('sign-in/email',{email:'unknown@example.org',password:'invalid-password-2026'}))).status,429);
 assert.ok(sqlite.prepare('select count(*) as n from pioneer_auth_rate_limits').get().n>0);
 const cross=new Request(origin+'/api/auth/sign-up/email',{method:'POST',headers:{origin:'https://untrusted.example','content-type':'application/json'},body:JSON.stringify({email:'csrf@example.org',password:'valid-test-password-2026',name:'CSRF'})});assert.equal((await auth.handler(cross)).status,403);
 const callback=await auth.handler(request('sign-up/email',{email:'redirect@example.org',password:'valid-test-password-2026',name:'Redirect',callbackURL:'https://untrusted.example'}));assert.equal(callback.status,403);assert.equal(sqlite.prepare('select count(*) as n from pioneer_auth_users').get().n,0);sqlite.close();
});
test('authentication requires a configured secret and an explicitly allowed site origin',async()=>{
 const {sqlite,db}=await database();assert.throws(()=>createEmailAuth(db,{},origin),/not configured/);assert.throws(()=>createEmailAuth(db,runtime,'https://untrusted.example'),/Invalid authentication origin/);sqlite.close();
});

for (const mailProvider of ['resend', 'brevo']) test(`controlled ${mailProvider} account emails send at signup, verify ownership and reset passwords once while revoking old sessions`,async()=>{
 const {sqlite,db}=await database();const site='https://pioneer-global-resources.hiayun.chatgpt.site';const originalFetch=globalThis.fetch;let sent=[];
 globalThis.fetch=async (url,options)=>{assert.equal(url,mailProvider==='brevo'?'https://api.brevo.com/v3/smtp/email':'https://api.resend.com/emails');const payload=JSON.parse(options.body);if(mailProvider==='brevo'){assert.equal(options.headers['api-key'],'test-only-brevo-key');assert.equal(payload.sender.email,'sender@example.org');assert.match(payload.headers.idempotencyKey,/^[a-f0-9-]{36}$/);sent.push({text:payload.textContent});return Response.json({messageId:'<controlled@example.org>'});}sent.push(payload);return Response.json({id:'test-provider-id'});};
 const configured={...runtime,RESEND_API_KEY:'test-only-mail-key',MAIL_FROM:'pioneer@example.org',MAIL_SITE_ORIGIN:site,MAIL_DELIVERY_ENABLED:'true',ACCOUNT_MAIL_PROVIDER:mailProvider,BREVO_API_KEY:'test-only-brevo-key',ACCOUNT_MAIL_FROM:'sender@example.org',ACCOUNT_MAIL_DELIVERY_ENABLED:'true'};
 const auth=createEmailAuth(db,configured,site);
 const req=(path,body,cookie)=>new Request(site+'/api/auth/'+path,{method:body?'POST':'GET',headers:{origin:site,'content-type':'application/json','cf-connecting-ip':'192.0.2.40',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});
 try {
  const email='verify-unit@example.org',password='Test-only-initial-password';const signup=await auth.handler(req('sign-up/email',{email,password,name:'Verify test'}));assert.equal(signup.status,200);const cookie=cookieOf(signup);assert.ok(cookie.includes('__Secure-pioneer.session_token='));assert.match(signup.headers.get('set-cookie'), /HttpOnly/i);assert.match(signup.headers.get('set-cookie'), /SameSite=Lax/i);assert.match(signup.headers.get('set-cookie'), /Secure/i);assert.equal(sent.length,1);
  assert.equal((await auth.handler(req('send-verification-email',{email,callbackURL:site+'/login'},cookie))).status,200);assert.equal(sent.length,2);
  const verifyURL=sent[1].text.match(/https:\/\/[^\s]+/)[0];const verified=await auth.handler(new Request(verifyURL,{headers:{cookie}}));assert.equal(verified.status,302);assert.equal(sqlite.prepare('select email_verified from pioneer_auth_users').get().email_verified,1);
  assert.equal((await auth.handler(req('get-session',null,cookie)).then(x=>x.json())).user.emailVerified,true);
  assert.equal((await auth.handler(req('request-password-reset',{email,redirectTo:site+'/reset-password'}))).status,200);assert.equal(sent.length,3);
  const resetURL=sent[2].text.match(/https:\/\/[^\s]+/)[0];const callback=await auth.handler(new Request(resetURL));assert.equal(callback.status,302);const token=new URL(callback.headers.get('location')).searchParams.get('token');assert.ok(token);
  const newPassword='Test-only-updated-password';assert.equal((await auth.handler(req('reset-password',{token,newPassword}))).status,200);
  assert.equal(await auth.handler(req('get-session',null,cookie)).then(x=>x.json()),null);
  assert.equal((await auth.handler(req('reset-password',{token,newPassword}))).status,400);
  assert.equal((await auth.handler(req('sign-in/email',{email,password}))).status,401);assert.equal((await auth.handler(req('sign-in/email',{email,password:newPassword}))).status,200);
 } finally {globalThis.fetch=originalFetch;sqlite.close();}
});
