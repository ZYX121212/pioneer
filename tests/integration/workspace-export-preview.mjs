import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin=process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(origin).hostname),'Local preview only');
const user='export-test-'+randomUUID(), other='export-other-'+randomUUID();
const headers=id=>id?{'oai-authenticated-user-id':id,'oai-authenticated-user-email':id+'@example.org'}:{};
const get=(id,query='?version=1',extra={})=>fetch(origin+'/api/workspace/export'+query,{headers:{...headers(id),...extra}});
const state={project:{name:'Private export test',oneLine:'',targetUser:'',currentRisk:'Backup completeness',nextAction:'Read backup',updatedAt:new Date().toISOString(),stage:'idea',goals:['learning']},archive:[],decisions:[],completions:['first-user-interview'],shortlist:['y-combinator'],tasks:[{id:'task-1',text:'Verify file content',due:'2026-10-10',done:false,createdAt:new Date().toISOString()}]};
test('actual D1 export attaches the authenticated saved version, isolates accounts and rejects stale previews',async()=>{
 const save=await fetch(origin+'/api/workspace',{method:'PUT',headers:{...headers(user),origin,'content-type':'application/json'},body:JSON.stringify({version:0,state})});assert.equal(save.status,200);
 const before=await (await fetch(origin+'/api/workspace',{headers:headers(user)})).json();
 const response=await get(user);assert.equal(response.status,200);assert.match(response.headers.get('content-disposition'),/^attachment; filename="pioneer-workspace.json"$/);assert.match(response.headers.get('cache-control'),/private, no-store/);assert.equal(response.headers.get('x-content-type-options'),'nosniff');assert.match(response.headers.get('content-type'),/^application\/json/);
 const backup=await response.json();assert.equal(backup.schemaVersion,1);assert.equal(backup.version,1);assert.deepEqual(backup.state,before.state);assert.equal(backup.updatedAt,before.updatedAt);assert.ok(Number.isFinite(Date.parse(backup.exportedAt)));assert.ok(!Object.hasOwn(backup,'userId'));
 const isolated=await get(other,'?version=0');assert.equal(isolated.status,200);assert.equal((await isolated.json()).state.project,null);
 assert.equal((await get(null)).status,401);assert.equal((await get(user,'')).status,400);assert.equal((await get(user,'?version=-1')).status,400);assert.equal((await get(user,'?version=9007199254740992')).status,400);
 assert.equal((await get(user,'?version=1',{origin:'https://other.example'})).status,403);assert.equal((await get(user,'?version=1',{'sec-fetch-site':'cross-site'})).status,403);
 const edited=await fetch(origin+'/api/workspace',{method:'PUT',headers:{...headers(user),origin,'content-type':'application/json'},body:JSON.stringify({version:1,state:{...state,shortlist:['y-combinator','station-f']}})});assert.equal(edited.status,200);
 const stale=await get(user);assert.equal(stale.status,409);assert.equal(stale.headers.get('content-disposition'),null);assert.equal((await stale.json()).code,'version_conflict');
 for (const [lang, message] of [['zh','工作台资料已更新'],['en','Your workspace has changed']]) { const page=await get(user,'?version=1&lang='+lang,{accept:'text/html'});assert.equal(page.status,409);assert.match(page.headers.get('content-type'),/^text\/html/);const html=await page.text();assert.ok(html.includes(message));assert.ok(!html.includes(state.project.name));assert.equal(page.headers.get('content-disposition'),null); }
 const after=await (await fetch(origin+'/api/workspace',{headers:headers(user)})).json();assert.equal(after.version,2);assert.deepEqual(after.state.shortlist,['y-combinator','station-f']);
});
