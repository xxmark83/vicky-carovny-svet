import {memo,useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {forestLookLayout} from './forestLookLayout';
import type {LookPlacement} from './forestLookLayout';
import {groundHeight} from './terrain';
import type {Game} from './game';
import {random} from './map';

function surfaceGrain(){
 const size=128,data=new Uint8Array(size*size*4),rng=random(310);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=155+Math.sin(x*.24+Math.sin(y*.16)*2)*13+Math.cos(y*.31+x*.08)*9+rng()*32,i=(y*size+x)*4;
  data[i]=data[i+1]=data[i+2]=n;data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
// A curved leaf with a raised midrib: it catches sunlight from multiple angles.
function leafGeometry(){const g=new THREE.BufferGeometry(),v:number[]=[],uv:number[]=[],ids:number[]=[];
 for(let i=0;i<=6;i++){const t=i/6,width=Math.sin(t*Math.PI)*.24;for(const side of [-1,0,1]){v.push(width*side,t*.19+Math.sin(t*Math.PI)*.08*(side===0?1:.3),t);uv.push(side*.5+.5,t);}}
 for(let i=0;i<6;i++)for(let j=0;j<2;j++){const a=i*3+j;ids.push(a,a+3,a+1,a+1,a+3,a+4);}
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ids);g.computeVertexNormals();return g;}
function fernGeometry(){const leaf=leafGeometry(),parts:THREE.BufferGeometry[]=[];
 for(let frond=0;frond<5;frond++){
  const yaw=frond*Math.PI*2/5;
  for(let i=1;i<=6;i++)for(const side of [-1,1]){
   const t=i/7,length=(1-t)*.38+.06,o=new THREE.Object3D();
   o.position.set(Math.sin(yaw)*t*.85,Math.sin(t*2.1)*.65,Math.cos(yaw)*t*.85);
   o.rotation.set(-.23,yaw+side*(1.05-t*.4),side*.15);o.scale.set(length*1.45,length,length);o.updateMatrix();parts.push(leaf.clone().applyMatrix4(o.matrix));
  }
 }
 const merged=mergeGeometries(parts)!;parts.forEach(g=>g.dispose());leaf.dispose();return merged;}
function grassGeometry(){const parts:THREE.BufferGeometry[]=[],leaf=leafGeometry();for(let i=0;i<9;i++){const g=leaf.clone();g.scale(.2,.8,.8+(i%3)*.17);g.rotateX(-1.05+(i%3)*.15);g.rotateY(i*2.399);parts.push(g);}const result=mergeGeometries(parts)!;parts.forEach(g=>g.dispose());leaf.dispose();return result;}
function flowerGeometry(){const petal=new THREE.SphereGeometry(1,8,5),parts:THREE.BufferGeometry[]=[];
 for(let i=0;i<7;i++){const a=i*Math.PI*2/5,g=petal.clone();g.scale(.12,.045,.24);g.rotateY(a);g.translate(Math.sin(a)*.16,.65,Math.cos(a)*.16);parts.push(g);}
 const g=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());petal.dispose();return g;}
function rockGeometry(){const g=new THREE.IcosahedronGeometry(.75,2),p=g.getAttribute('position'),colors:number[]=[],color=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),noise=1+.09*Math.sin(x*11+z*5)*Math.sin(y*8-z*7);p.setXYZ(i,x*noise,y*noise*.8,z*noise);color.set(y>.24?'#86a651':y>.1?'#8c9970':'#8b9690');color.multiplyScalar(.88+.1*Math.sin(x*10+y*6));colors.push(color.r,color.g,color.b);}
 g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;}
function DetailCell({items,game,children}:{items:LookPlacement[];game:Game;children:React.ReactNode}){
 const ref=useRef<THREE.Group>(null),center=items[0];useFrame(({camera})=>{const x=camera.position.x-center.x,z=camera.position.z-center.z;ref.current!.visible=x*x+z*z<(game.flying?115:85)**2;});return <group ref={ref}>{children}</group>;
}
function Instances({items,geometry,material,slope=false,colors,scale=[1,1,1]}:{items:LookPlacement[];geometry:THREE.BufferGeometry;material:THREE.Material;slope?:boolean;colors?:string[];scale?:[number,number,number]}){
 const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const mesh=ref.current;if(!mesh)return;const o=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),normal=new THREE.Vector3(),color=new THREE.Color();
  items.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.quaternion.identity();if(slope){normal.set(groundHeight({x:p.x-.3,z:p.z})-groundHeight({x:p.x+.3,z:p.z}),.6,groundHeight({x:p.x,z:p.z-.3})-groundHeight({x:p.x,z:p.z+.3})).normalize();o.quaternion.setFromUnitVectors(up,normal);}o.rotateY(p.yaw);o.rotateX(p.pitch??0);o.scale.set(p.size*scale[0],p.size*scale[1],p.size*scale[2]);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);if(colors)mesh.setColorAt(i,color.set(colors[p.kind%colors.length]));});mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();
 },[items,slope,colors,scale]);return items.length?<instancedMesh ref={ref} args={[geometry,material,items.length]} receiveShadow/>:null;
}
export const ForestLook=memo(function ForestLook({game,low}:{game:Game;low:boolean}){
 const root=useRef<THREE.Group>(null),data=useMemo(()=>forestLookLayout(low),[low]);
 const assets=useMemo(()=>{
  const grain=surfaceGrain(),stone=new THREE.MeshStandardMaterial({color:'#d7c5a1',roughness:.88,bumpMap:grain,bumpScale:.1}),green=new THREE.MeshStandardMaterial({color:'#7bac45',roughness:.82,side:THREE.DoubleSide,bumpMap:grain,bumpScale:.025,emissive:'#52792a',emissiveIntensity:.09}),petals=new THREE.MeshStandardMaterial({roughness:.68,side:THREE.DoubleSide}),gold=new THREE.MeshStandardMaterial({color:'#ffc957',roughness:.8}),rock=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.97,bumpMap:grain,bumpScale:.14});
  const cobble=new RoundedBoxGeometry(1,.11,1.05,2,.07);const cp=cobble.getAttribute('position');for(let i=0;i<cp.count;i++){const x=cp.getX(i),z=cp.getZ(i);cp.setX(i,x*(1+.065*Math.sin(z*8+x*4)));cp.setZ(i,z*(1+.055*Math.cos(x*9+z*3)));}cobble.computeVertexNormals();const fern=fernGeometry(),flower=flowerGeometry(),leaf=leafGeometry(),center=new THREE.SphereGeometry(.085,8,5);center.translate(0,.68,0);const stem=new THREE.CylinderGeometry(.018,.025,.62,4);stem.translate(0,.31,0);
  return {grain,stone,green,petals,gold,rock,cobble,fern,flower,leaf,center,stem,grass:grassGeometry(),boulder:rockGeometry()};
 },[]);
 const cells=useMemo(()=>{const cells=new Map<string,{stones:LookPlacement[];rocks:LookPlacement[];plants:LookPlacement[]}>();for(const name of ['stones','rocks','plants'] as const)for(const p of data[name]){const key=`${Math.floor(p.x/40)}:${Math.floor(p.z/40)}`;if(!cells.has(key))cells.set(key,{stones:[],rocks:[],plants:[]});cells.get(key)![name].push(p);}return [...cells.entries()];},[data]);
 useEffect(()=>()=>Object.values(assets).forEach(a=>a.dispose()),[assets]);
 return <group ref={root}>{cells.map(([key,c])=>{const ferns=c.plants.filter(p=>p.kind<3),flowers=c.plants.filter(p=>p.kind>=3&&p.kind<7),leaves=c.plants.filter(p=>p.kind>=7),items=[...c.stones,...c.rocks,...c.plants];return <DetailCell key={key} items={items} game={game}>
  <Instances items={c.stones} geometry={assets.cobble} material={assets.stone} slope colors={['#d9c8aa','#b9b9a0','#e8d8b5','#b8a58b','#d0c5b2']}/>
  <Instances items={c.rocks} geometry={assets.boulder} material={assets.rock} scale={[1.4,1,1.2]}/>
  <Instances items={ferns} geometry={assets.fern} material={assets.green}/>
  <Instances items={flowers} geometry={assets.flower} material={assets.petals} colors={['#fff4c8','#f2a3c8','#c4aff1','#ffe29b']}/>
  <Instances items={flowers} geometry={assets.center} material={assets.gold}/>
  <Instances items={flowers} geometry={assets.stem} material={assets.green}/>
  <Instances items={leaves} geometry={assets.grass} material={assets.green} colors={['#8cb64e','#6e9d3a','#b3c96c']}/>
 </DetailCell>;})}</group>;
});
