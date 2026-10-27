import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {Cubes} from './Voxel';
import {PATH,SHRINES,groundHeight,distance} from './game';
import {CASTLE,CASCADES} from './valleyLayout';
import {forestTexture} from './forestTextures';
import type {Block} from './world';
// Authored framing props follow existing collision-safe banks and paths.
export function ValleyComposition(){
 const kit=useMemo(()=>{const grain=forestTexture('stone'),wood=forestTexture('planks');return {grain,wood,stone:new THREE.MeshStandardMaterial({map:grain,bumpMap:grain,bumpScale:.12,roughness:.93}),timber:new THREE.MeshStandardMaterial({map:wood,roughness:.86}),rounded:new RoundedBoxGeometry(1,1,1,2,.15),rock:new THREE.IcosahedronGeometry(.7,1)};},[]);useEffect(()=>()=>Object.values(kit).forEach(a=>a.dispose()),[kit]);
 const decor=useMemo(()=>{const walls:Block[]=[],fences:Block[]=[],moss:Block[]=[];
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],length=distance(a,b),dx=(b.x-a.x)/length,dz=(b.z-a.z)/length;
 if(i%3!==1)continue;for(let d=8;d<length-6;d+=3){const x=a.x+dx*d-dz*5.2,z=a.z+dz*d+dx*5.2,y=groundHeight({x,z});if(SHRINES.some(p=>distance(p,{x,z})<7))continue;walls.push({p:[x,y+.35,z],s:[1.2,.65,1.5],c:'#a0aaa0',r:Math.atan2(dx,dz)});moss.push({p:[x,y+.68,z],s:[1.25,.12,1.5],c:'#81a358',r:Math.atan2(dx,dz)});}
 }
 for(const c of CASCADES)for(const side of [-1,1])for(let i=0;i<6;i++){const x=c.x+side*(c.width*.6+3+i%2*2),z=c.z-3-i*1.2;walls.push({p:[x,c.bottom+(c.top-c.bottom)*.5,z],s:[3.5+(i%2),c.top-c.bottom,4],c:i%2?'#9da99b':'#83988f',r:i*.18*side});moss.push({p:[x,c.top+.2,z],s:[4,.6,4],c:'#73984e'});}
 const y=groundHeight(CASTLE);for(const side of [-1,1])for(let i=0;i<9;i++){walls.push({p:[CASTLE.x+side*(13.5+i*.55),y-1.5-i*1.6,CASTLE.z+3-i*.9],s:[5,5,7],c:i%2?'#a8b4a6':'#83968b',r:side*.2});moss.push({p:[CASTLE.x+side*(14+i*.55),y+1-i*1.6,CASTLE.z+3-i*.9],s:[5,.45,6],c:'#88a85b'});}
 // Buttresses and cornices give the castle a readable silhouette from the valley.
 for(const x of [-11,-5,5,11])for(const h of [3,8,13])walls.push({p:[CASTLE.x+x,y+h,CASTLE.z-6.9],s:[.55,3.8,.75],c:'#eddfc8'});
 for(const p of SHRINES)for(const side of [-1,1])for(let i=0;i<4;i++)fences.push({p:[p.x+side*(4+i*.75),groundHeight({x:p.x+side*(4+i*.75),z:p.z+3})+.6,p.z+3],s:[.14,1.2,.14],c:'#b59764'});
 return {walls,fences,moss};},[]);
 return <><Cubes blocks={decor.walls} geometry={kit.rounded} material={kit.stone}/><Cubes blocks={decor.fences} material={kit.timber}/><Cubes blocks={decor.moss} geometry={kit.rock} castShadow={false}/></>;
}
