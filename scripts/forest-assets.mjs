// Original stylized scenery. Metres, Y up, origin at the ground; no external assets.
import * as T from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
export function sceneryGeometry(kind=0,lod=false){
 const parts=[],color=new T.Color();
 const add=(g,c)=>{g=g.index?g.toNonIndexed():g;const n=g.getAttribute('position').count;g.deleteAttribute('uv');color.set(c);const colors=new Float32Array(n*3);for(let i=0;i<n;i++)colors.set([color.r,color.g,color.b],i*3);g.setAttribute('color',new T.BufferAttribute(colors,3));parts.push(g);};
 const limb=(a,b,r,c)=>{const from=new T.Vector3(...a),to=new T.Vector3(...b),dir=to.clone().sub(from),g=new T.CylinderGeometry(r*.5,r,dir.length(),lod?5:7,1);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize()));g.translate(...from.add(to).multiplyScalar(.5).toArray());add(g,c);};
 const blob=(p,s,c,seed)=>{const g=new T.IcosahedronGeometry(1,lod?0:1),v=g.getAttribute('position');for(let i=0;i<v.count;i++){const f=1+.12*Math.sin(v.getX(i)*4+v.getY(i)*3+seed);v.setXYZ(i,v.getX(i)*f,v.getY(i)*f,v.getZ(i)*f);}g.computeVertexNormals();g.scale(...s);g.rotateY(seed);g.translate(...p);add(g,c);};
 if(kind===3){blob([0,.45,0],[1.3,.85,1.05],'#88968b',1);blob([-.55,.75,.1],[.7,.16,.8],'#7c9a4e',3);}
 else {
 const cherry=kind===2,birch=kind===1,bark=birch?'#dedac2':cherry?'#74524d':'#806245';
 limb([0,0,0],[.32,5.7,-.15],.42,bark);limb([.32,5.7,-.15],[.05,9,0],.22,bark);
 for(let i=0;i<6;i++){const a=i*2.399;limb([Math.sin(a)*.9,.02,Math.cos(a)*.9],[0,.65,0],.17,bark);}
 const tones=cherry?['#df9cbd','#efb7cf','#cf86b3','#f6cbd5']:birch?['#8eb661','#b0c775','#749c51','#c4d589']:['#548c40','#77a64d','#91b55b','#4a7c3a'];
 for(let i=0;i<(lod?6:11);i++){
 const a=i*2.399+.3,y=4.2+i*.34,r=cherry?2.5:birch?1.9:2.3,end=[Math.sin(a)*r,y+1,Math.cos(a)*r];
 if(!lod)limb([.2,y-1.4,-.1],end,.14,bark);
 blob([end[0],end[1]+.35,end[2]],[cherry?2:1.75,1.05+(i%3)*.12,1.6],tones[i%4],i+.3);
 if(!lod)for(let j=0;j<3;j++){const t=a+j*2.1,rr=1.25;blob([end[0]+Math.sin(t)*rr,end[1]+.15+(j%2)*.5,end[2]+Math.cos(t)*rr],[.75,.48,.85],tones[(i+j+1)%4],i+j);}
 }
 if(birch&&!lod)for(let i=0;i<9;i++){const g=new T.BoxGeometry(.16,.08,.04);g.translate(.12+Math.sin(i)*.11,1+i*.49,.35);add(g,'#777b6b');}
 }
 const merged=mergeGeometries(parts,false);merged.deleteAttribute('normal');const indexed=mergeVertices(merged,1e-4);indexed.computeVertexNormals();parts.forEach(g=>g.dispose());merged.dispose();indexed.computeBoundingBox();indexed.computeBoundingSphere();return indexed;
}
