import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin=process.env.PIONEER_PREVIEW_URL??'http://localhost:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(origin).hostname),'Local preview only');
const key=()=>randomUUID().replaceAll('-','');
const post=(path,body,agent)=>fetch(`${origin}${path}`,{method:'POST',headers:{origin,'content-type':'application/json','user-agent':agent},body:JSON.stringify(body)});
const payload=()=>({resourceType:'program',resourceName:'Local quota fixture',resourceUrl:`https://local-quota-fixture.org/${randomUUID()}`,whyUseful:'Controlled fixture for verifying bounded contribution intake under concurrent requests.',submitterName:'Local fixture',submitterEmail:'local-fixture@example.org',relationship:'community',language:'en',idempotencyKey:key()});
test('actual D1 simultaneous submissions cannot exceed five per hour and retries cannot change saved input',async()=>{
 const agent=`Submission-quota-${randomUUID()}`;
 const inputs=Array.from({length:10},payload);
 const responses=await Promise.all(inputs.map(body=>post('/api/submissions',body,agent)));
 assert.equal(responses.filter(response=>response.status===201).length,5);
 assert.equal(responses.filter(response=>response.status===429).length,5);
 const index=responses.findIndex(response=>response.status===201);
 const first=await responses[index].json();
 const repeated=await post('/api/submissions',inputs[index],agent);assert.equal(repeated.status,200);assert.equal((await repeated.json()).reviewToken,first.reviewToken);
 assert.equal((await post('/api/submissions',{...inputs[index],resourceName:'Changed resource with same retry'},agent)).status,409);
 const receipt=await(await fetch(`${origin}/api/submissions?token=${first.reviewToken}`)).json();assert.equal(receipt.name,inputs[index].resourceName);
});
test('actual D1 corrections persist once on parallel retries, reject changed retries and enforce concurrent quota',async()=>{
 // Use a real curated slug discovered through the resource page index in the repo.
 const {readFile}=await import('node:fs/promises');const source=await readFile(new URL('../../app/data/resources.ts',import.meta.url),'utf8');
 const slug=source.match(/slug:\s*"([^"]+)"/)?.[1];assert.ok(slug);
 const agent=`Report-quota-${randomUUID()}`;
 const base={resourceKey:slug,reason:'incorrect',details:'Controlled local correction, not a production recommendation.',idempotencyKey:key()};
 const repeats=await Promise.all(Array.from({length:8},()=>post('/api/reports',base,agent)));
 assert.equal(repeats.filter(response=>response.status===201).length,1);assert.equal(repeats.filter(response=>response.status===200).length,7);
 assert.equal((await post('/api/reports',{...base,details:'Changed data with the same retry capability'},agent)).status,409);
 const remaining=await Promise.all(Array.from({length:8},()=>post('/api/reports',{...base,idempotencyKey:key()},agent)));
 assert.equal(remaining.filter(response=>response.status===201).length,4);assert.equal(remaining.filter(response=>response.status===429).length,4);
 assert.equal((await post('/api/reports',base,agent)).status,200);
 assert.equal((await post('/api/reports',{...base,idempotencyKey:'invalid'},agent)).status,400);
 const malformed=await fetch(`${origin}/api/reports`,{method:'POST',headers:{origin,'content-type':'application/json'},body:'invalid'});assert.equal(malformed.status,400);
 const large=await post('/api/reports',{...base,details:'x'.repeat(13000)},agent);assert.equal(large.status,413);
});
