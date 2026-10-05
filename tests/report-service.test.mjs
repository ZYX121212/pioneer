import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const source = ts.transpileModule(await readFile(new URL('../app/lib/reportService.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const { saveResourceReport } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
async function database() {
 const sqlite = new DatabaseSync(':memory:');
 for (const file of (await readdir(new URL('../drizzle/',import.meta.url))).filter(file=>file.endsWith('.sql')).sort()) {
   if (file.startsWith('0008_')) sqlite.prepare("INSERT INTO resource_reports (resource_key,reason,details,requester_hash) VALUES ('legacy','broken','Legacy report preserved','legacy')").run();
   sqlite.exec(await readFile(new URL(`../drizzle/${file}`,import.meta.url),'utf8'));
 }
 const wrap=(query,args=[])=>({bind(...values){return wrap(query,values)},async first(){return sqlite.prepare(query).get(...args)??null}});
 return {sqlite,db:{prepare:wrap}};
}
const draft={key:'a'.repeat(32),resourceKey:'resource-1',reason:'incorrect',details:'Specific updated source evidence',requester:'local-fixture'};
test('report retries persist once, reject changed data and preserve legacy migration records',async()=>{
 const {sqlite,db}=await database();
 assert.equal(sqlite.prepare("SELECT idempotency_key FROM resource_reports WHERE resource_key='legacy'").get().idempotency_key,null);
 const outcomes=await Promise.all(Array.from({length:10},()=>saveResourceReport(db,draft)));
 assert.equal(outcomes.filter(outcome=>outcome==='saved').length,1);
 assert.equal(outcomes.filter(outcome=>outcome==='replayed').length,9);
 assert.equal(await saveResourceReport(db,{...draft,details:'Changed correction with same key'}),'conflict');
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM resource_reports WHERE idempotency_key=?').get(draft.key).n,1);
 assert.equal(sqlite.prepare('SELECT details FROM resource_reports WHERE idempotency_key=?').get(draft.key).details,draft.details);
 sqlite.close();
});
test('parallel corrections share an atomic five-per-hour quota, while saved retries remain readable',async()=>{
 const {sqlite,db}=await database();
 const outcomes=await Promise.all(Array.from({length:10},(_,i)=>saveResourceReport(db,{...draft,key:String(i).padStart(32,'0')})));
 assert.equal(outcomes.filter(outcome=>outcome==='saved').length,5);
 assert.equal(outcomes.filter(outcome=>outcome==='limited').length,5);
 assert.equal(await saveResourceReport(db,{...draft,key:'0'.repeat(32)}),'replayed');
 sqlite.prepare("UPDATE resource_reports SET created_at=datetime('now','-2 hours') WHERE requester_hash=?").run(draft.requester);
 assert.equal(await saveResourceReport(db,draft),'saved');
 const plan=sqlite.prepare("EXPLAIN QUERY PLAN SELECT COUNT(*) FROM resource_reports WHERE requester_hash=? AND created_at>=datetime('now','-1 hour')").all(draft.requester);
 assert.ok(plan.some(row=>row.detail.includes('idx_reports_requester_created')));
 sqlite.close();
});
