import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {SHRINES,distance} from './map';
import {groundHeight} from './terrain';
import {Cubes,boxGeometry} from './Voxel';
import type {Block} from './world';
import {useHeroFadeMaterial} from './OcclusionMaterial';
const COLORS=['#ff5e9c','#ffab4c','#ffe65e','#78d786','#4bcfe9','#9f8de9','#e998ee'];
export function ForestShowpieces({game,low}:{game:Game;low:boolean}){const rainbow=useRef<THREE.Group>(null),petals=useRef<THREE.InstancedMesh>(null),garden=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]),color=useMemo(()=>new THREE.Color(),[]),fade=useHeroFadeMaterial(game);
 const sculptures=useMemo(()=>{const b:Block[]=[],add=(x:number,y:number,z:number,s:Block['s'],c:string)=>b.push({p:[x,groundHeight({x,z})+y,z],s,c});
 // An oversized ring of petals frames the shrine from above and below, without closing its approach.
 const p=SHRINES[0];for(const side of [-1,1]){const x=p.x+side*9,z=p.z-5;add(x,1.3,z,[.22,2.6,.22],'#5c9e45');for(let j=0;j<8;j++){const a=j*Math.PI/4;add(x+Math.sin(a)*.68,2.7+Math.cos(a)*.6,z,[.75,.65,.35],j%2?'#fff1ad':'#ffc2d9');}add(x,2.7,z+.22,[.52,.52,.22],'#efc24d');add(x-side*.5,1.3,z,[.9,.15,.5],'#8fbe4d');}
 // Open 9m arch: no new collision objects on the mission route.
 for(const side of [-1,1]){for(let y=0;y<6;y++)add(side*5.5,y+.5,-277,[.55,1,.7],y%2?'#b8ba8f':'#9da889');for(let j=0;j<6;j++){const x=side*(5.2-j*.8);add(x,6+j*.2,-277,[1.1,.55,.8],'#bbc1a0');add(x,6.4+j*.2,-277,[.85,.28,1],'#78a34c');}for(let j=0;j<9;j++)add(side*5.4,.5+j*.65,-276.5,[.5,.16,.4],j%3?'#f6aad2':'#fff0b4');}
 return b;},[]);
 const rainbowMaterial=useMemo(()=>COLORS.map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.34,toneMapped:false,depthWrite:false,side:THREE.DoubleSide})),[]);useEffect(()=>()=>rainbowMaterial.forEach(m=>m.dispose()),[rainbowMaterial]);
 useFrame(()=>{const t=game.mode==='intro'?game.introTime:game.elapsed+game.portalTime,visible=game.mode==='intro'||distance(game.player,{x:17,z:-42})<85;rainbow.current!.visible=visible;rainbow.current!.rotation.y=Math.sin(t*.12)*.04;let n=0,gn=0;
 for(let i=0;i<(low?28:56);i++){const a=i*2.399+t*.15,r=3.8+i%9*.62,p=SHRINES[0],x=p.x+Math.sin(a)*r,z=p.z+Math.cos(a)*r;o.position.set(x,groundHeight({x,z})+.8+i%4*.4+Math.sin(t+i)*.16,z);o.rotation.set(t*.4,i,t*.35);o.scale.set(.12,.035,.22);o.updateMatrix();petals.current!.setMatrixAt(n,o.matrix);petals.current!.setColorAt(n++,color.set(game.shrines.has(0)?'#fff2a6':i%2?'#ffc6e1':'#fff3d7'));}
 petals.current!.count=n;petals.current!.instanceMatrix.needsUpdate=true;if(petals.current!.instanceColor)petals.current!.instanceColor.needsUpdate=true;
 for(let i=0;i<(low?28:60);i++){const a=i*2.399+t*.18,r=4+i%9*.85,x=Math.sin(a)*r,z=-286+Math.cos(a)*r;o.position.set(x,groundHeight({x,z})+1+i%6*.6+Math.sin(t*1.5+i)*.3,z);o.rotation.set(t,i,0);o.scale.setScalar((i%3?.045:.075)*(game.mode==='won'?1.4:1));o.updateMatrix();garden.current!.setMatrixAt(gn,o.matrix);garden.current!.setColorAt(gn++,color.set(i%2?'#ffe4a0':'#ffb7d7'));}garden.current!.count=gn;garden.current!.instanceMatrix.needsUpdate=true;if(garden.current!.instanceColor)garden.current!.instanceColor.needsUpdate=true;
 });return <><Cubes blocks={sculptures} material={fade}/><group ref={rainbow} position={[17,1.4,-41]}>{COLORS.map((c,i)=><mesh key={c} material={rainbowMaterial[i]}><ringGeometry args={[4.8+i*.18,4.98+i*.18,48,1,0,Math.PI]}/></mesh>)}</group><instancedMesh ref={petals} args={[boxGeometry,undefined,56]} frustumCulled={false}><meshBasicMaterial vertexColors={false} transparent opacity={.8} depthWrite={false}/></instancedMesh><instancedMesh ref={garden} args={[boxGeometry,undefined,60]} frustumCulled={false}><meshBasicMaterial toneMapped={false}/></instancedMesh></>;}
