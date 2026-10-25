// JELLY_BENCH_MODULE=/path/to/baseline/index.mjs node --expose-gc perf/riverbench-allocations.mjs DATA_DIR CASE OUTPUT.json [rounds=10]
// CASE: parse, messages, discard, sparql-parse, write-messages, write-flat-4000, sparql-write-250, retention-rdf, retention-sparql.
// V8 sampling includes objects collected by minor and major GC. Estimates are
// sampled allocation volume, not retained heap or exact object byte counts.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { Session } from 'node:inspector';
import { performance, PerformanceObserver, constants } from 'node:perf_hooks';
import { setImmediate, setTimeout } from 'node:timers/promises';
import { join } from 'node:path';
import { Reader } from 'protobufjs/minimal.js';
const moduleUrl=process.env.JELLY_BENCH_MODULE??new URL('../dist/index.mjs',import.meta.url).href;
const { Parser, Writer, SparqlWriter, SparqlParser, Decoder, StreamParser, SparqlStreamParser, DataFactory:f }=await import(moduleUrl);
const [dir,mode,outputFile,roundsArg='10']=process.argv.slice(2);
if(!dir||!mode||!outputFile)throw new Error('Usage: node --expose-gc perf/riverbench-allocations.mjs DATA_DIR CASE OUTPUT.json [rounds=10]');
if(!globalThis.gc)throw new Error('Run with --expose-gc');
const rounds=Number(roundsArg);assert.ok(Number.isInteger(rounds)&&rounds>0);
const bytes=readFileSync(join(dir,'sample-1.2.jelly'));
const messages=new Parser().parseMessages(bytes),quads=messages.flat();
function write(messageMode,batch=250){
 const writer=new Writer({version:3,physicalType:1,streamType:messageMode?1:0,messageSize:batch});
 if(messageMode)for(const m of messages)writer.addMessage(m);else writer.addQuads(quads);
 let output;writer.end((e,b)=>{if(e)throw e;output=b;});return output;
}
function writeSparql(){const writer=new SparqlWriter();writer.startSelect(['s','p','o']);for(const q of quads)writer.addBinding({s:q.subject,p:q.predicate,o:q.object});return writer.end();}
function discard(){const decoder=new Decoder(),reader=Reader.create(bytes);let count=0;while(reader.pos<reader.len){const n=reader.uint32();for(const message of decoder.decodePayloadMessages(reader,n))count+=message.length;}for(const message of decoder.finishMessages())count+=message.length;return count;}
async function retention(sparql){
 const frames=[];const count=50000;
 const writer=sparql?new SparqlWriter({streamType:1},b=>frames.push(b)):new Writer({write:b=>frames.push(b),end:cb=>cb?.(null)},{version:3,physicalType:1,streamType:1});
 const b=f.blankNode('b'),p=f.namedNode('urn:p');
 for(let i=0;i<count;i++)if(sparql){writer.startSelect(['b']);writer.addBinding({b});writer.endResult();}else writer.addMessage([f.quad(b,p,b)]);
 if(sparql)writer.end();else writer.end();
 const parser=sparql?new SparqlStreamParser():new StreamParser();let seen=0;
 parser.on('data',event=>{if(!sparql||event.type==='binding')seen++;});
 parser.on('error',error=>{throw error;});
 const samples=[];
 for(let i=0;i<frames.length;i++){
  parser.write(frames[i]);
  if(i===999||i===frames.length-1){await setImmediate();globalThis.gc();await setImmediate();globalThis.gc();samples.push({scopes:i+1,heapUsed:process.memoryUsage().heapUsed,rss:process.memoryUsage().rss});}
 }
 assert.equal(seen,count);
 // Keep the decoder and source buffers reachable across both checkpoints.
 assert.equal(parser.destroyed,false);assert.equal(frames.length,count);parser.end();
 return {mode,scopes:count,samples,heapGrowthBytes:samples[1].heapUsed-samples[0].heapUsed};
}
if(mode.startsWith('retention-')){
 const result=await retention(mode==='retention-sparql');writeFileSync(outputFile,JSON.stringify({node:process.version,moduleUrl,...result},null,2)+'\n');
}else{
 const sparqlBytes=mode==='sparql-parse'?writeSparql():undefined;
 const operations={parse:()=>new Parser().parse(bytes).length,messages:()=>new Parser().parseMessages(bytes).reduce((n,m)=>n+m.length,0),discard,
  'sparql-parse':()=>new SparqlParser().parse(sparqlBytes)[0].bindings.length,
  'write-messages':()=>write(true).length,'write-flat-4000':()=>write(false,4000).length,'sparql-write-250':()=>writeSparql().length};
 const operation=operations[mode];assert.ok(operation,`Unknown case ${mode}`);
 const expected=operation();operation();globalThis.gc();await setImmediate();
 const entries=[];const observer=new PerformanceObserver(list=>entries.push(...list.getEntries()));observer.observe({entryTypes:['gc']});
 const session=new Session();session.connect();const post=(method,params={})=>new Promise((resolve,reject)=>session.post(method,params,(e,r)=>e?reject(e):resolve(r)));
 await post('HeapProfiler.enable');await post('HeapProfiler.startSampling',{samplingInterval:65536,includeObjectsCollectedByMajorGC:true,includeObjectsCollectedByMinorGC:true});
 const start=performance.now();let checksum=0;for(let i=0;i<rounds;i++)checksum+=operation();const elapsedMs=performance.now()-start;
 await setTimeout(30);observer.disconnect();const {profile}=await post('HeapProfiler.stopSampling');session.disconnect();assert.equal(checksum,expected*rounds);
 writeFileSync(join(dir,`${mode}-${process.env.JELLY_BENCH_VARIANT??(process.env.JELLY_BENCH_MODULE?'baseline':'after')}.heapprofile`),JSON.stringify(profile));
 const sites=[];let estimatedAllocatedBytes=0;
 function visit(node){estimatedAllocatedBytes+=node.selfSize;if(node.selfSize){const frame=node.callFrame;sites.push({function:frame.functionName||'(anonymous)',file:frame.url,line:frame.lineNumber+1,estimatedBytes:node.selfSize});}for(const child of node.children??[])visit(child);}visit(profile.head);
 sites.sort((a,b)=>b.estimatedBytes-a.estimatedBytes);
 const gc=entries.filter(e=>e.startTime>=start&&e.startTime<start+elapsedMs);const kinds={};
 for(const e of gc){const kind=e.detail.kind===constants.NODE_PERFORMANCE_GC_MINOR?'minor':e.detail.kind===constants.NODE_PERFORMANCE_GC_MAJOR?'major':'other';const row=kinds[kind]??={count:0,durationMs:0};row.count++;row.durationMs+=e.duration;}
 writeFileSync(outputFile,JSON.stringify({node:process.version,moduleUrl,mode,rounds,statementsPerRound:quads.length,elapsedMs,estimatedAllocatedBytes,estimatedBytesPerRound:estimatedAllocatedBytes/rounds,gc:{count:gc.length,durationMs:gc.reduce((n,e)=>n+e.duration,0),kinds},sites:sites.slice(0,25)},null,2)+'\n');
}
