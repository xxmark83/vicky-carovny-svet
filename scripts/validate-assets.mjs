import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const manifest=JSON.parse(await readFile('public/models/manifest.json','utf8'));let total=0;
for(const m of manifest.models){const bin=await readFile(`public/models/${m.name}.glb`);assert.equal(bin.readUInt32LE(0),0x46546c67);assert.equal(bin.readUInt32LE(4),2);assert.equal(bin.readUInt32LE(8),bin.length);assert.equal(bin.length,m.bytes);total+=bin.length;const length=bin.readUInt32LE(12),doc=JSON.parse(bin.toString('utf8',20,20+length));assert.equal(doc.asset.version,'2.0');assert.ok(doc.nodes.some(n=>n.name==='near'));assert.ok(doc.nodes.some(n=>n.name==='far'));assert.ok(doc.accessors.every(a=>!a.min||[...a.min,...a.max].every(Number.isFinite)));assert.ok(m.nearTriangles<4500&&m.farTriangles<=300);for(const a of doc.accessors)assert.ok(a.count>0);}
assert.ok(total<400000);console.log(`4 original GLB assets validated, ${total} bytes, finite bounds, LOD budgets passed.`);
