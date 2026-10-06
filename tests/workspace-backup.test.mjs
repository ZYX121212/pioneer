import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), { compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022} }).outputText;
const url = code => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const modelUrl = url(await compile('../app/lib/workspaceModel.ts'));
const model = await import(modelUrl);
const backup = await import(url((await compile('../app/lib/workspaceBackup.ts')).replace('"./workspaceModel"',JSON.stringify(modelUrl))));
const time = '2026-10-06T02:00:00Z';
const project = name => ({ name, oneLine:'',targetUser:'',currentRisk:'',nextAction:'',updatedAt:time });
const entry = (id,content='Research evidence') => ({id,guide:'first-user-interview',type:'interview',title:'Research',summary:'Observed needs',content,savedAt:time});
test('exported backups round trip every workspace collection while ignoring account and version metadata',()=>{
 const state = { ...model.emptyWorkspace(), project:project('Restored project'), archive:[entry('evidence-1')], decisions:[{guide:'first-user-interview',decision:'continue',reason:'Evidence supports the need',savedAt:time}], completions:['first-user-interview'], shortlist:['y-combinator'], tasks:[{id:'task-1',text:'Interview founders',due:'2026-10-10',done:false,createdAt:time}] };
 assert.deepEqual(backup.parseWorkspaceBackup(JSON.stringify({schemaVersion:1,version:999,userId:'other-account',exportedAt:time,state})),model.validateWorkspace(state));
 assert.deepEqual(backup.parseWorkspaceBackup(JSON.stringify(state)),model.validateWorkspace(state));
});
test('merging preserves existing project and duplicate records, adds distinct records and is repeatable',()=>{
 const current = {...model.emptyWorkspace(),project:project('Existing'),archive:[entry('same','Original')],shortlist:['y-combinator']};
 const imported = {...model.emptyWorkspace(),project:project('Backup'),archive:[entry('same','Changed'),entry('new')],shortlist:['y-combinator','station-f']};
 const combined = backup.mergeWorkspaceBackup(current,imported);
 assert.equal(combined.project.name,'Existing');assert.equal(combined.archive[0].content,'Original');assert.equal(combined.archive.length,2);
 assert.deepEqual(combined.shortlist,['y-combinator','station-f']);assert.deepEqual(backup.mergeWorkspaceBackup(combined,imported),combined);
 assert.equal(backup.mergeWorkspaceBackup(model.emptyWorkspace(),imported).project.name,'Backup');assert.equal(current.archive.length,1);
});
test('malformed, unrecognized, future-version and over-capacity backups fail before saving',()=>{
 for(const value of ['broken','{}','[]','null',JSON.stringify({schemaVersion:2,state:model.emptyWorkspace()}),JSON.stringify({state:{...model.emptyWorkspace(),tasks:[{id:'task-1',text:'Task',due:'2026-02-30',done:false,createdAt:time}]}})]) assert.throws(()=>backup.parseWorkspaceBackup(value));
 assert.throws(()=>backup.parseWorkspaceBackup(' '.repeat(backup.backupByteLimit+1)));
 const live={...model.emptyWorkspace(),archive:Array.from({length:40},(_,i)=>entry('live-'+i))};
 assert.throws(()=>backup.mergeWorkspaceBackup(live,{...model.emptyWorkspace(),archive:[entry('extra')]}));assert.equal(live.archive.length,40);
});
test('legacy file exports migrate supported fields and reject corrupt originals',()=>{
 const raw={'pioneer:founder-project-v1':JSON.stringify(project('Legacy')),'pioneer:founder-archive-v1':JSON.stringify([entry('legacy')]),'pioneer:guide-progress-v1':'["first-user-interview"]','pioneer:guide-decisions-v1':null};
 const parsed=backup.parseWorkspaceBackup(JSON.stringify(raw));assert.equal(parsed.project.name,'Legacy');assert.equal(parsed.archive.length,1);assert.deepEqual(parsed.shortlist,[]);
 assert.throws(()=>backup.parseWorkspaceBackup(JSON.stringify({...raw,'pioneer:founder-archive-v1':'broken'})));
 assert.equal(backup.parseWorkspaceBackup(JSON.stringify({...raw,'pioneer:founder-project-v1':JSON.stringify(project(''))})).project,null);
});
