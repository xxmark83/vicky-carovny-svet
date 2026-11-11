import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {random} from './map';
import {archLayout,gateLayout,boughPoint,GATE_HALF_WIDTH} from './archLayout';
import type {Arch} from './archLayout';
import {weatherForWorld,atmosphereForWorld} from './weather';
import {skyGradient} from './ambienceRates';
// 3.17.0 forest decoration; see archLayout.ts for why none of it blocks walking.
const BLOSSOM=['#ffb1d4','#ff8cc2','#fff1f5','#d9b3ff'],LEAF=['#5f9a3c','#7db04a','#4f8636'],ROSE=['#ff5f8f','#ff86ad','#ffd0df','#e23f72'];
function boughGeometry(arch:Arch){const points=Array.from({length:13},(_,i)=>{const p=boughPoint(arch,i/12);return new THREE.Vector3(p.x,p.y,p.z);});return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.42,6,false);}
export function Arches({game,low}:{game:Game;low:boolean}){
 const arches=useMemo(()=>archLayout(game.layout.obstacles),[game.layout]),gates=useMemo(gateLayout,[]),boughs=useMemo(()=>arches.map(boughGeometry),[arches]);
 const bark=useMemo(()=>new THREE.MeshStandardMaterial({color:'#6b4a2c',roughness:1,flatShading:true}),[]),stone=useMemo(()=>new THREE.MeshStandardMaterial({color:'#a9ada2',roughness:.95,flatShading:true}),[]),lamp=useMemo(()=>new THREE.MeshStandardMaterial({color:'#fff4cf',emissive:'#ffbc55',emissiveIntensity:1.8,roughness:.4}),[]),halo=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffb24d',transparent:true,opacity:.05,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>{boughs.forEach(g=>g.dispose());},[boughs]);useEffect(()=>()=>{bark.dispose();stone.dispose();lamp.dispose();halo.dispose();},[bark,stone,lamp,halo]);
 // Leaves, blossom, hanging vines and roses share one instanced puff.
 const puffs=useMemo(()=>{const r=random(31701),list:{x:number;y:number;z:number;sx:number;sy:number;c:string}[]=[],n=low?.5:1;
  for(const arch of arches){for(let i=0;i<Math.round(26*n);i++){const p=boughPoint(arch,r());list.push({x:p.x+(r()-.5)*2.6,y:p.y+.3+(r()-.3)*1.6,z:p.z+(r()-.5)*2.6,sx:1.5+r()*1.3,sy:1+r()*.6,c:r()<.3?BLOSSOM[arch.tint]:LEAF[Math.floor(r()*3)]});}
   for(let v=0;v<Math.round(7*n);v++){const p=boughPoint(arch,.12+r()*.76),len=1.2+r()*2.2;for(let k=0;k<5;k++)list.push({x:p.x+Math.sin(k*1.3)*.08,y:p.y-.4-k/4*len,z:p.z+Math.cos(k*1.7)*.08,sx:.22,sy:.3,c:k%2?BLOSSOM[(arch.tint+v)%4]:LEAF[1]});}
   for(const t of [arch.a,arch.b])for(let i=0;i<Math.round(9*n);i++){const a=r()*6.28;list.push({x:t.x+Math.cos(a)*(.95+r()*.2),y:t.y+.4+r()*5.5,z:t.z+Math.sin(a)*(.95+r()*.2),sx:.45+r()*.35,sy:.4,c:r()<.4?BLOSSOM[arch.tint]:LEAF[Math.floor(r()*3)]});}}
  for(const g of gates){const cx=Math.cos(g.yaw),sz=-Math.sin(g.yaw);for(let i=0;i<Math.round(46*n);i++){const t=i/Math.round(46*n),u=(t-.18)/.64,up=t<.18?t/.18*3.4:t>.82?(1-t)/.18*3.4:3.4+Math.sin(u*Math.PI)*GATE_HALF_WIDTH,off=t<.18?-GATE_HALF_WIDTH:t>.82?GATE_HALF_WIDTH:-Math.cos(u*Math.PI)*GATE_HALF_WIDTH;list.push({x:g.x+cx*off+(r()-.5)*.5,y:g.y+up+(r()-.5)*.4,z:g.z+sz*off+(r()-.5)*.5,sx:.3+r()*.3,sy:.3,c:r()<.55?ROSE[Math.floor(r()*4)]:LEAF[Math.floor(r()*3)]});}}
  return list;},[arches,gates,low]);
 const mesh=useRef<THREE.InstancedMesh>(null);useLayoutEffect(()=>{const m=mesh.current!,o=new THREE.Object3D(),c=new THREE.Color();puffs.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.rotation.set(0,i*1.9,0);o.scale.set(p.sx,p.sx*p.sy,p.sx);o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,c.set(p.c));});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere();},[puffs]);
 useFrame(()=>{const w=weatherForWorld(game);halo.opacity=.04+Math.max(skyGradient(w).night,atmosphereForWorld(game).glow,w.overcast*.6)*.12;});
 return <><instancedMesh ref={mesh} args={[undefined,undefined,Math.max(1,puffs.length)]} frustumCulled={false} receiveShadow><icosahedronGeometry args={[.5,0]}/><meshLambertMaterial emissive="#2a1a22" emissiveIntensity={.25}/></instancedMesh>
  {arches.map((arch,i)=><group key={i}>{[arch.a,arch.b].map((t,j)=><group key={j} position={[t.x,t.y,t.z]}><mesh position={[0,4.3,0]} material={bark} castShadow receiveShadow><cylinderGeometry args={[.62,1.02,8.6,9]}/></mesh>{[0,1,2,3,4].map(k=><mesh key={k} position={[Math.cos(k*1.26)*.85,.35,Math.sin(k*1.26)*.85]} rotation={[Math.sin(k*1.26)*.7,0,-Math.cos(k*1.26)*.7]} material={bark}><coneGeometry args={[.42,1.5,5]}/></mesh>)}</group>)}
   <mesh geometry={boughs[i]} material={bark} castShadow/>
   {arch.lanterns.map((l,j)=><group key={j} position={[l.x,l.y,l.z]}><mesh position={[0,1.15,0]}><cylinderGeometry args={[.025,.025,2.1,4]}/><meshStandardMaterial color="#3d3226"/></mesh><mesh material={lamp}><boxGeometry args={[.46,.58,.46]}/></mesh><mesh position={[0,.42,0]}><coneGeometry args={[.44,.36,4]}/><meshStandardMaterial color="#8a6a45"/></mesh><mesh material={halo}><icosahedronGeometry args={[.75,2]}/></mesh></group>)}</group>)}
  {gates.map((g,i)=><group key={i} position={[g.x,g.y,g.z]} rotation={[0,g.yaw,0]}>{[-1,1].map(side=><group key={side} position={[side*GATE_HALF_WIDTH,0,0]}><mesh position={[0,1.7,0]} material={stone} castShadow receiveShadow><cylinderGeometry args={[.27,.33,3.4,7]}/></mesh><mesh position={[0,.18,0]} material={stone}><cylinderGeometry args={[.45,.5,.36,7]}/></mesh></group>)}<mesh position={[0,3.4,0]} material={stone} castShadow><torusGeometry args={[GATE_HALF_WIDTH,.3,6,18,Math.PI]}/></mesh></group>)}</>;
}
