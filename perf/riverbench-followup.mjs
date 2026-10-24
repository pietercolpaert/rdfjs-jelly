// npm run build && node perf/riverbench-followup.mjs DATA_DIR BASELINE_MODULE OUTPUT.json
// The baseline must be a saved, bundled dist/index.mjs with dependencies resolvable.
// Runs fresh worker processes sequentially; no timed cases run concurrently.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { resolve, join } from 'node:path';
const [dirArg,baselineArg,outputFile]=process.argv.slice(2);
if(!dirArg||!baselineArg||!outputFile)throw new Error('Usage: node perf/riverbench-followup.mjs DATA_DIR BASELINE_MODULE OUTPUT.json');
const dir=resolve(dirArg),baseline=resolve(baselineArg),after=new URL('../dist/index.mjs',import.meta.url).pathname;
const root=new URL('..',import.meta.url).pathname;
const result={date:new Date().toISOString(),node:process.version,cpu:cpus()[0].model,
 modules:Object.fromEntries([['baseline',baseline],['after',after]].map(([name,file])=>[name,{file,sha256:createHash('sha256').update(readFileSync(file)).digest('hex')}])),timings:[],allocations:[],retention:[]};
const save=()=>writeFileSync(outputFile,JSON.stringify(result,null,2)+'\n');
function run(script,args,variant){
 const child=spawnSync(process.execPath,['--expose-gc',join(root,'perf',script),...args],{env:{...process.env,JELLY_BENCH_VARIANT:variant,...(variant==='baseline'?{JELLY_BENCH_MODULE:baseline}:{JELLY_BENCH_MODULE:after})},encoding:'utf8',maxBuffer:8*1024*1024});
 if(child.error||child.status!==0)throw new Error(child.error?.message||child.stderr||`Worker exited ${child.status}`);
 return child.stdout;
}
let index=0;
for(const name of ['parse:1.2','messages:1.2','write-messages:1.2:250','write-flat:1.2:4000','sparql-parse:1.0:250','sparql-write:1.0:250','sparql-write:1.0:4000','full']){
 const row={case:name};
 for(const variant of index++%2?['after','baseline']:['baseline','after']){
  console.error(`Timing ${name} ${variant}`);
  row[variant]=JSON.parse(run('riverbench-audit.mjs',['--worker',dir,name==='full'?'full':'sample',name==='full'?'1.2':name,name==='full'?'2':'7'],variant));
 }
 if(name!=='full')assert.equal(row.baseline.inputOrOutputSha256,row.after.inputOrOutputSha256,'Input/writer bytes changed');
 row.speedup=row.baseline.medianMs/row.after.medianMs;result.timings.push(row);save();
}
for(const name of ['parse','messages','discard','sparql-parse','write-messages','write-flat-4000','sparql-write-250']){
 const row={case:name};
 for(const variant of ['baseline','after']){
  console.error(`Allocations ${name} ${variant}`);
  const file=join(dir,`allocation-${variant}-${name}.json`);
  run('riverbench-allocations.mjs',[dir,name,file,name==='write-flat-4000'?'3':'10'],variant);
  row[variant]=JSON.parse(readFileSync(file));
 }
 result.allocations.push(row);save();
}
for(const name of ['retention-rdf','retention-sparql']){
 const row={case:name};
 for(const variant of ['baseline','after']){
  console.error(`Retention ${name} ${variant}`);
  const file=join(dir,`${variant}-${name}.json`);run('riverbench-allocations.mjs',[dir,name,file],variant);row[variant]=JSON.parse(readFileSync(file));
 }
 result.retention.push(row);save();
}
console.log(`Saved ${outputFile}`);
