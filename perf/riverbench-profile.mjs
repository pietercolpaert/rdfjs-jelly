// node --expose-gc perf/riverbench-profile.mjs DATA_DIR OUTPUT.json [rounds=20]
// Raw Chrome/V8 CPU profiles are written to DATA_DIR, summaries to OUTPUT.json.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { Session } from 'node:inspector';
import { join } from 'node:path';
const { Parser, Writer, SparqlWriter, RdfStreamType, PhysicalStreamType } = await import(process.env.JELLY_BENCH_MODULE ?? new URL('../dist/index.mjs', import.meta.url).href);
const [dir,outputFile,roundsArg='20']=process.argv.slice(2);
if(!dir||!outputFile)throw new Error('Usage: node --expose-gc perf/riverbench-profile.mjs DATA_DIR OUTPUT.json [rounds=20]');
const bytes=readFileSync(join(dir,'sample-1.2.jelly'));
const messages=new Parser().parseMessages(bytes);const quads=messages.flat();
const tasks={
 parse:()=>new Parser().parse(bytes),
 'write-messages':()=>{
  const w=new Writer({version:3,physicalType:PhysicalStreamType.TRIPLES,streamType:RdfStreamType.MESSAGES});
  for(const m of messages)w.addMessage(m);let out;w.end((e,b)=>{if(e)throw e;out=b;});return out;
 },
 'write-flat-4000':()=>{
  const w=new Writer({version:3,physicalType:PhysicalStreamType.TRIPLES,messageSize:4000});
  w.addQuads(quads);let out;w.end((e,b)=>{if(e)throw e;out=b;});return out;
 },
 'sparql-write-250':()=>{
  const w=new SparqlWriter();w.startSelect(['s','p','o']);for(const q of quads)w.addBinding({s:q.subject,p:q.predicate,o:q.object});return w.end();
 },
};
const results=[];
for(const [name,run]of Object.entries(tasks)){
 run();globalThis.gc?.();
 const session=new Session();session.connect();
 const post=(method,params={})=>new Promise((resolve,reject)=>session.post(method,params,(error,value)=>error?reject(error):resolve(value)));
 await post('Profiler.enable');await post('Profiler.setSamplingInterval',{interval:1000});await post('Profiler.start');
 const rounds=name==='write-flat-4000'?Math.min(Number(roundsArg),5):Number(roundsArg);
 let checksum=0;for(let i=0;i<rounds;i++)checksum+=run().length;
 const {profile}=await post('Profiler.stop');session.disconnect();assert.ok(checksum>0);
 writeFileSync(join(dir,`${name}.cpuprofile`),JSON.stringify(profile));
 const parents=new Map(),nodes=new Map(profile.nodes.map(n=>[n.id,n]));
 for(const node of profile.nodes)for(const child of node.children??[])parents.set(child,node.id);
 const self=new Map(),inclusive=new Map();
 for(const id of profile.samples){self.set(id,(self.get(id)??0)+1);let at=id;while(at!==undefined){inclusive.set(at,(inclusive.get(at)??0)+1);at=parents.get(at);}}
 const top=[...self].sort((a,b)=>b[1]-a[1]).slice(0,20).map(([id,n])=>{const f=nodes.get(id).callFrame;return {function:f.functionName||'(anonymous)',file:f.url,line:f.lineNumber+1,selfPercent:n/profile.samples.length*100,inclusivePercent:inclusive.get(id)/profile.samples.length*100};});
 results.push({name,rounds,durationMs:(profile.endTime-profile.startTime)/1000,totalSamples:profile.samples.length,top});
 console.error(`Profiled ${name}`);
}
writeFileSync(outputFile,JSON.stringify({rounds:Number(roundsArg),statements:quads.length,results},null,2)+'\n');
