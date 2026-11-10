import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {Water} from './Water';
import type {WaterPatch} from './Water';
import {groundHeight} from './terrain';
import {CASTLE} from './valleyLayout';
import {cragLayout,bridgeDress,CRAG_TONES,CRAG_FALLS,BRIDGE_HALF_WIDTH} from './cragLayout';
import {weatherForWorld,atmosphereForWorld} from './weather';
// 3.9.0 forest decoration: the castle now stands before a rock wall with two waterfalls, its towers fly pennants,
// and the valley bridge is dressed in stone. No collisions are added or changed.
function Rocks({list}:{list:{x:number;y:number;z:number;w:number;h:number;d:number;yaw?:number;tone:number}[]}){const mesh=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const m=mesh.current!,o=new THREE.Object3D(),c=new THREE.Color();list.forEach((r,i)=>{o.position.set(r.x,r.y,r.z);o.rotation.set(0,r.yaw??0,0);o.scale.set(r.w,r.h,r.d);o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,c.set(CRAG_TONES[r.tone]));});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere();},[list]);
 return <instancedMesh ref={mesh} args={[undefined,undefined,list.length]} castShadow receiveShadow><dodecahedronGeometry args={[.62,1]}/><meshStandardMaterial roughness={.95} flatShading/></instancedMesh>;}
function Crag({low}:{low:boolean}){const crags=useMemo(cragLayout,[]),base=groundHeight(CASTLE),mist=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);
 const caps=useMemo(()=>crags.filter(c=>c.green).map(c=>({x:c.x,y:c.y+c.h*.5,z:c.z,w:c.w*.8,h:2.2,d:c.d*.8,yaw:c.yaw,tone:0})),[crags]);
 const water=useMemo(()=>{const p:WaterPatch[]=[];for(const f of CRAG_FALLS)p.push({p:[f.x,base+f.height/2,f.z],w:f.width,h:f.height,fall:true},{p:[f.x,base+.25,f.z+1.2],w:f.width+5,h:4});return p;},[base]);
 const capMesh=useRef<THREE.InstancedMesh>(null);useLayoutEffect(()=>{const m=capMesh.current!,q=new THREE.Object3D();caps.forEach((r,i)=>{q.position.set(r.x,r.y,r.z);q.rotation.set(0,r.yaw,0);q.scale.set(r.w,r.h,r.d);q.updateMatrix();m.setMatrixAt(i,q.matrix);});m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();},[caps]);
 useFrame(({clock})=>{const m=mist.current;if(!m)return;let n=0;for(const f of CRAG_FALLS)for(let i=0;i<(low?6:14);i++){const t=(clock.elapsedTime*.14+i*.173)%1;o.position.set(f.x+Math.sin(i*2.4+t)*f.width*.7,base+.6+t*4,f.z+1.5+t*3);o.scale.setScalar(.8+Math.sin(t*Math.PI)*2.2);o.updateMatrix();m.setMatrixAt(n++,o.matrix);}m.count=n;m.instanceMatrix.needsUpdate=true;});
 return <><Rocks list={crags}/><instancedMesh ref={capMesh} args={[undefined,undefined,caps.length]} receiveShadow><dodecahedronGeometry args={[.62,1]}/><meshStandardMaterial color="#6f9f4c" roughness={1} flatShading/></instancedMesh><Water patches={water}/>
  <instancedMesh ref={mist} args={[undefined,undefined,28]} frustumCulled={false}><icosahedronGeometry args={[.5,1]}/><meshBasicMaterial color="#f2fbff" transparent opacity={.22} depthWrite={false}/></instancedMesh></>;}
// Pennants on the five towers of RoyalCastle; the tower table repeats that component's own numbers.
function Pennants(){const flags=useRef<(THREE.Group|null)[]>([]),base=groundHeight(CASTLE),geometry=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,.7,0,0,-.7,0,3.2,0,0],3));g.computeVertexNormals();return g;},[]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 const towers=useMemo(()=>[-18,-9,0,9,18].map((x,i)=>{const h=i===2?37:i%2?29:23,z=i===2?-20:i%2?-15:-8;return {x:CASTLE.x+x,y:base+h*.84+10.1,z:CASTLE.z+z,color:i%2?'#ff7fb6':'#ffd95a'};}),[base]);
 useFrame(({clock})=>{flags.current.forEach((f,i)=>{if(f){f.rotation.y=Math.sin(clock.elapsedTime*1.7+i)*.35+.4;f.rotation.z=Math.sin(clock.elapsedTime*3.1+i*2)*.08;}});});
 return <>{towers.map((t,i)=><group key={i} position={[t.x,t.y,t.z]}><mesh position={[0,1.6,0]}><cylinderGeometry args={[.07,.07,3.6,5]}/><meshStandardMaterial color="#e9d7a8"/></mesh><group ref={el=>{flags.current[i]=el;}} position={[0,2.7,0]}><mesh geometry={geometry}><meshStandardMaterial color={t.color} side={THREE.DoubleSide} roughness={.7}/></mesh></group></group>)}</>;}
function StoneBridge({game}:{game:Game}){const dress=useMemo(bridgeDress,[]),glow=useMemo(()=>new THREE.MeshStandardMaterial({color:'#fff4cf',emissive:'#ffbc55',emissiveIntensity:1.8,roughness:.4}),[]),halo=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffb24d',transparent:true,opacity:.05,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>{glow.dispose();halo.dispose();},[glow,halo]);useFrame(()=>{const w=weatherForWorld(game);halo.opacity=.04+Math.max(atmosphereForWorld(game).glow,w.overcast*.6)*.11;});
 return <><Rocks list={dress.stones}/>{dress.arches.map((a,i)=><group key={i} position={[a.x,a.y,a.z]}>{[-1,1].map(side=><mesh key={side} position={[side*(BRIDGE_HALF_WIDTH+.1),0,0]} rotation={[0,Math.PI/2,0]} castShadow><torusGeometry args={[a.radius,.42,5,14,Math.PI]}/><meshStandardMaterial color="#a3aba3" roughness={.95} flatShading/></mesh>)}</group>)}
  {dress.lamps.map((l,i)=><group key={i} position={[l.x,l.y,l.z]}><mesh material={glow}><boxGeometry args={[.5,.6,.5]}/></mesh><mesh position={[0,.45,0]}><coneGeometry args={[.5,.45,4]}/><meshStandardMaterial color="#8a6a45"/></mesh><mesh material={halo}><icosahedronGeometry args={[.6,2]}/></mesh></group>)}</>;}
export function CastleCrag({game,low}:{game:Game;low:boolean}){return <><Crag low={low}/><Pennants/><StoneBridge game={game}/></>;}
