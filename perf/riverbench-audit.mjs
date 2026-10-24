// npm run build && node --expose-gc perf/riverbench-audit.mjs DATA_DIR OUTPUT.json [runs=5] [fullRuns=2]
// DATA_DIR contains assist-iot-weather.jelly.gz (1.2) and assist-iot-weather-v1.1.jelly.gz.
// Downloads stay outside the repository. Cases run sequentially in fresh processes.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { cpus, totalmem, platform, release } from 'node:os';
import { resolve, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { createGunzip, gzipSync, gunzipSync } from 'node:zlib';
import { Reader } from 'protobufjs/minimal.js';
import { eu } from '../src/generated/proto/rdf_pb.mjs';
const { Parser, Writer, StreamParser, PhysicalStreamType, RdfStreamType, ColumnEncoder, JellyConformanceError, SparqlParser, SparqlWriter } = await import(process.env.JELLY_BENCH_MODULE ?? new URL('../dist/index.mjs', import.meta.url).href);
import { verifyMessageOutput } from './message-workload.mjs';

const proto = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
const caseLabel = (kind,name) => kind==='sample' ? name.startsWith('write')||name.startsWith('sparql')?name:name.replace(':1.1',':legacy') : `${kind==='full'?'full stream':'full gunzip'} ${name==='1.1'?'legacy':name}`;
const script = new URL(import.meta.url).pathname;
const filenames = { '1.2': 'assist-iot-weather.jelly.gz', '1.1': 'assist-iot-weather-v1.1.jelly.gz' };
const median = values => { const sorted=[...values].sort((a,b)=>a-b), middle=Math.floor(sorted.length/2); return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2; };
function summary(samples, statements) {
 const times=samples.map(s=>s.ms);
 return { medianMs: median(times), minMs: Math.min(...times), maxMs: Math.max(...times), statementsPerSecond: statements/(median(times)/1000), samples };
}
function memory() { return { ...process.memoryUsage(), maxRssBytes: process.resourceUsage().maxRSS*1024 }; }
function write(messages, version, messageSize, preserveMessages=true) {
 const options=version===3 ? {version,physicalType:PhysicalStreamType.TRIPLES,messageSize,streamType:preserveMessages?RdfStreamType.MESSAGES:RdfStreamType.FLAT}
   : {version,physicalType:PhysicalStreamType.TRIPLES,messageSize};
 const w=new Writer(options);
 if(preserveMessages) for(const message of messages) w.addMessage(message);
 else for(const message of messages) for(const quad of message) w.addQuad(quad);
 let bytes; w.end((error,output)=>{if(error)throw error;bytes=output;});return bytes;
}
async function prepare(dir, version, target=100000) {
 const file=join(dir,filenames[version]);
 const chunks=[]; let sampleRows=0, sampleFrames=0, rows=0,frames=0, messageBoundaries=0,rawBytes=0,maxRows=0,firstOptions;
 let carry=Buffer.alloc(0);
 const sourceHash=createHash('sha256');
 for await(const b of createReadStream(file)) sourceHash.update(b);
 const rawHash=createHash('sha256');
 for await(const chunk of createReadStream(file).pipe(createGunzip())) {
  rawBytes+=chunk.length;rawHash.update(chunk);
  const bytes=carry.length?Buffer.concat([carry,chunk]):chunk;
  const reader=Reader.create(bytes);let consumed=0;
  while(reader.pos<reader.len){
   const start=reader.pos;let size;try{size=reader.uint32();}catch{break;}
   if(reader.pos+size>reader.len)break;
   const end=reader.pos+size;
   const f=proto.decode(reader,size);
   assert.equal(reader.pos,end);frames++;
   for(const r of f.rows) if(r.options) firstOptions??=JSON.parse(JSON.stringify(r.options));
   const n=f.columns?.rowCount??f.rows.reduce((n,r)=>n+Number(Boolean(r.triple||r.quad)),0);
   rows+=n;maxRows=Math.max(maxRows,n);messageBoundaries+=f.columns?.messageLengths?.length??0;
   if(sampleRows<target){chunks.push(Buffer.from(bytes.subarray(start,end)));sampleRows+=n;sampleFrames++;}
   consumed=end;
  }
  carry=Buffer.from(bytes.subarray(consumed));
 }
 assert.equal(carry.length,0,'Truncated source');
 const sample=Buffer.concat(chunks);writeFileSync(join(dir,`sample-${version}.jelly`),sample);
 const compressed=readFileSync(file);
 return {file,compressedBytes:compressed.length,compressedSha256:sourceHash.digest('hex'),rawBytes,rawSha256:rawHash.digest('hex'),rows,frames,messageBoundaries,maxRows,firstOptions,sampleRows,sampleFrames,sampleBytes:sample.length};
}
async function fullCase(dir,version,rounds,decompressOnly=false){
 const samples=[];let expected;
 for(let i=0;i<rounds;i++){
  globalThis.gc?.();const before=memory();let rows=0,messages=0,bytes=0;
  const start=performance.now();
  if(decompressOnly){for await(const chunk of createReadStream(join(dir,filenames[version])).pipe(createGunzip()))bytes+=chunk.length;}
  else {
   const parser=new StreamParser({delimited:true});
   parser.on('message',()=>messages++);
   // Count without retaining quads or introducing an async hop per statement.
   await new Promise((resolve,reject)=>{
    const source=createReadStream(join(dir,filenames[version]));const gzip=createGunzip();
    source.on('error',reject);gzip.on('error',reject);parser.on('error',reject);
    parser.on('data',()=>rows++);parser.on('end',resolve);source.pipe(gzip).pipe(parser);
   });
  }
  const ms=performance.now()-start;const after=memory();
  expected??={rows,messages,bytes};assert.deepEqual({rows,messages,bytes},expected);
  samples.push({ms,rows,messages,bytes,before,after});
 }
 return {case:caseLabel(decompressOnly?'gunzip':'full',version), sourceProtocol:version==='1.1'?1:3, ...summary(samples,expected.rows)};
}
async function sampleCase(dir,name,rounds){
 if(name.includes('fastfit')) {
  // Audit-only prototype: preserve batch working-set checks without copying the
  // whole accumulated lookup table into a Set for every statement.
  ColumnEncoder.prototype.fit=function(names,datatypes){
   const fits=()=>[names,datatypes].every((values,i)=>{
    const table=this.tables[i],limit=i===0?this.lookup.maxNames:this.lookup.maxDatatypes;
    let missing=0;for(const value of new Set(values))if(!table.has(value))missing++;
    return table.size+missing<=limit;
   });
   if(!fits())this.flush();
   if(!fits())throw new JellyConformanceError('A single statement does not fit in the configured lookup tables');
  };
 }
 const source12=readFileSync(join(dir,'sample-1.2.jelly'));
 const source11=readFileSync(join(dir,'sample-1.1.jelly'));
 const ref=new Parser().parseMessages(source12);
 const count=ref.reduce((n,m)=>n+m.length,0);
 const [kind,ver,sizeString]=name.split(':');const version=ver==='1.1'?2:3;
 let bytes,operation,validate;
 if(kind.startsWith('sparql')) {
  const quads=ref.flat();
  const encode=()=>{
   const writer=new SparqlWriter({frameSize:Number(sizeString)});writer.startSelect(['s','p','o']);
   for(const q of quads)writer.addBinding({s:q.subject,p:q.predicate,o:q.object});return writer.end();
  };
  bytes=encode();
  const verify=output=>{
   assert.equal(output.length,1);assert.equal(output[0].complete,true);assert.equal(output[0].bindings.length,count);
   for(let i=0;i<count;i++)for(const [v,slot] of [['s','subject'],['p','predicate'],['o','object']])assert.ok(quads[i][slot].equals(output[0].bindings[i].get(v)));
  };
  verify(new SparqlParser().parse(bytes));
  operation=kind==='sparql-write'?encode:()=>new SparqlParser().parse(bytes);
  validate=kind==='sparql-write'?output=>assert.equal(output.length,bytes.length):output=>assert.equal(output[0].bindings.length,count);
 }else if(kind==='parse'||kind==='messages'||kind==='gunzip-parse'||kind==='protobuf'){
  bytes=ver==='1.1'?source11:source12;
  if(kind==='protobuf') operation=()=>{const r=Reader.create(bytes);let rows=0;while(r.pos<r.len){const f=proto.decode(r,r.uint32());rows+=f.columns?.rowCount??f.rows.reduce((n,x)=>n+Number(Boolean(x.triple||x.quad)),0);}return rows;};
  else if(kind==='messages') operation=()=>new Parser().parseMessages(bytes);
  else if(kind==='gunzip-parse'){bytes=gzipSync(bytes);operation=()=>new Parser().parse(gunzipSync(bytes));}
  else operation=()=>new Parser().parse(bytes);
  validate=output=>assert.equal(kind==='protobuf'?output:kind==='messages'?output.reduce((n,m)=>n+m.length,0):output.length,count);
 }else{
  const preserve=kind.startsWith('write-messages');const size=Number(sizeString);
  operation=()=>write(ref,version,size,preserve);
  bytes=operation();
  if(preserve)verifyMessageOutput(ref,new Parser({messages:true}).parse(bytes));
  else {const output=new Parser().parse(bytes);let i=0;for(const m of ref)for(const q of m)assert.ok(q.equals(output[i++]),'Ordered term mismatch');assert.equal(output.length,count);}
  validate=output=>assert.equal(output.length,bytes.length);
 }
 if(kind!=='protobuf'&&!kind.startsWith('sparql')&&!name.startsWith('write')){
  const output=kind==='messages'?operation().flat():operation();
  let i=0;for(const m of ref)for(const q of m)assert.ok(q.equals(output[i++]),'Ordered term mismatch');assert.equal(output.length,count);
 }
 // Data equivalence is checked outside timing, including all terms and message boundaries.
 const other=new Parser({messages:true}).parse(source11);verifyMessageOutput(ref,other);
 for(let i=0;i<2;i++)validate(operation());
 const samples=[];
 for(let i=0;i<rounds;i++){
  globalThis.gc?.();const before=memory();const start=performance.now();let output=operation();const ms=performance.now()-start;
  const after=memory();validate(output);samples.push({ms,before,after});output=undefined;
 }
 return {case:caseLabel('sample',name),sourceProtocol:kind.startsWith('sparql')?undefined:name.startsWith('write')?undefined:ver==='1.1'?1:3,outputProtocol:kind.startsWith('sparql')?1:name.startsWith('write')?version:undefined,statements:count,messages:ref.length,inputOrOutputBytes:bytes.length,inputOrOutputSha256:createHash('sha256').update(bytes).digest('hex'),gzipBytes:name.includes('write')?gzipSync(bytes).length:undefined,...summary(samples,count)};
}
if(process.argv[2]==='--worker'){
 const [dir,kind,name,rounds]=process.argv.slice(3);
 const result=kind==='full'?await fullCase(dir,name,Number(rounds)):kind==='gunzip'?await fullCase(dir,name,Number(rounds),true):await sampleCase(dir,name,Number(rounds));
 console.log(JSON.stringify(result));
}else{
 const [dataDir,outputFile,runsArg='5',fullArg='2']=process.argv.slice(2).filter(arg=>arg!=='--resume');
 if(!dataDir||!outputFile)throw new Error('Usage: node --expose-gc perf/riverbench-audit.mjs DATA_DIR OUTPUT.json [runs=5] [fullRuns=2]');
 const dir=resolve(dataDir),runs=Number(runsArg),fullRuns=Number(fullArg);
 if(!Number.isInteger(runs)||runs<1||!Number.isInteger(fullRuns)||fullRuns<1)throw new Error('Run counts must be positive integers');
 const previous=process.argv.includes('--resume')?JSON.parse(readFileSync(outputFile,'utf8')):undefined;
 const result=previous??{sourceUrls:{'1.2':'https://w3id.org/riverbench/datasets/assist-iot-weather/dev/files/jelly_full.2.jelly.gz',legacy:'https://w3id.org/riverbench/datasets/assist-iot-weather/dev/files/jelly_full.jelly.gz'},date:new Date().toISOString(),node:process.version,cpu:cpus()[0].model,logicalCpus:cpus().length,totalMemoryBytes:totalmem(),platform:`${platform()} ${release()}`,commit:spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout?.trim() ?? 'unknown',runs,fullRuns,sources:[],results:[]};
 const save=()=>writeFileSync(outputFile,JSON.stringify(result,null,2)+'\n');
 for(const v of previous?[]:['1.2','1.1']){console.error(`Inspecting ${v} and extracting a complete-message prefix`);result.sources.push(await prepare(dir,v));save();}
 for(const [kind,name,n] of [
  ...['1.2','1.1'].flatMap(v=>[['gunzip',v,fullRuns],['full',v,fullRuns]]),
  ...['1.2','1.1'].flatMap(v=>['protobuf','parse','messages','gunzip-parse'].map(k=>['sample',`${k}:${v}`,runs])),
  ...['1.2','1.1'].flatMap(v=>[['sample',`write-messages:${v}:250`,runs],...['250','1000','4000'].map(s=>['sample',`write-flat:${v}:${s}`,runs])]),
  ['sample','write-messages-fastfit:1.2:250',runs], ['sample','write-flat-fastfit:1.2:4000',runs],
  ['sample','sparql-parse:1.0:250',runs], ['sample','sparql-write:1.0:250',runs], ['sample','sparql-write:1.0:4000',runs],
 ]){
  const caseName=caseLabel(kind,name);
  if(result.results.some(row=>row.case===caseName))continue;
  console.error(`Running ${kind}/${name}`);
  const worker=spawnSync(process.execPath,['--expose-gc',script,'--worker',dir,kind,name,String(n)],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(worker.error||worker.status!==0||!worker.stdout.trim()){result.failure={kind,name,status:worker.status,stderr:worker.stderr,error:worker.error?.message};save();throw new Error(worker.error?.message||worker.stderr||`Worker exited ${worker.status}`);}
  const row=JSON.parse(worker.stdout);result.results.push(row);save();console.error(`${row.case}: ${row.medianMs.toFixed(1)} ms`);
 }
 console.log(`Saved ${outputFile}`);
}
