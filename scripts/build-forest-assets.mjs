import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {writeFile,mkdir} from 'node:fs/promises';
import {sceneryGeometry} from './forest-assets.mjs';
// GLTFExporter uses the browser FileReader API for binary packaging.
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
await mkdir('public/models',{recursive:true});
const manifest={format:'glTF 2.0',author:'Vikousek project',license:'Original project artwork',units:'metres',up:'Y',origin:'ground',models:[]};
for(let kind=0;kind<4;kind++){
 const name=['oak','birch','cherry','moss-rock'][kind],root=new T.Group();root.name=name;
 for(const lod of [false,true]){const g=sceneryGeometry(kind,lod),mesh=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.9}));mesh.name=lod?'far':'near';root.add(mesh);}
 const bin=await new GLTFExporter().parseAsync(root,{binary:true});await writeFile(`public/models/${name}.glb`,Buffer.from(bin));
 manifest.models.push({name,bytes:bin.byteLength,nearTriangles:root.children[0].geometry.index.count/3,farTriangles:root.children[1].geometry.index.count/3});
 root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
}
await writeFile('public/models/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
