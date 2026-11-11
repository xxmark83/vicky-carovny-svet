import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {random} from './map';
import {boxGeometry} from './Voxel';
import {atmosphereForWorld,sandForWorld} from './weather';
import {DESERT_PATH,DESERT_SHRINES,desertDune,desertPathDistance} from './desert';
import {DESERT_BOUNDS} from './valleyLayout';
// 3.18.0 decoration only: the desert's own weather. Nothing here touches collisions, the story clock or saved games.
// The wind blows east and a little north, across the trail.
const WIND={x:.94,z:-.34},WIND_YAW=Math.atan2(WIND.x,WIND.z);
const live=(game:Game)=>game.mode==='playing'||game.mode==='won';

// Smooth dunes replace the stepped columns: one continuous surface with wind ripples and a few glints in the sand.
export function Dunes({low}:{low:boolean}){
 const geometry=useMemo(()=>{
  const step=low?2.5:1.25,x0=-112,x1=112,z0=-342,z1=52,nx=Math.round((x1-x0)/step),nz=Math.round((z1-z0)/step);
  const positions=new Float32Array((nx+1)*(nz+1)*3),colors=new Float32Array((nx+1)*(nz+1)*3),index:number[]=[];
  const hollow=new THREE.Color('#dcae6c'),crest=new THREE.Color('#f6dba8'),path=new THREE.Color('#f8e2b4'),c=new THREE.Color();
  for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){
   const x=x0+ix*step,z=z0+iz*step,h=desertDune({x,z}),i=(iz*(nx+1)+ix)*3;
   positions[i]=x;positions[i+1]=h;positions[i+2]=z;
   const grain=Math.sin(x*.31+z*.17)*.03+Math.sin(x*.07-z*.11)*.04,road=1-Math.min(1,Math.max(0,(desertPathDistance({x,z})-1.6)/1.8));
   c.copy(hollow).lerp(crest,Math.min(1,Math.max(0,h/5.2+grain))).lerp(path,road*.8);colors[i]=c.r;colors[i+1]=c.g;colors[i+2]=c.b;}
  for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){const a=iz*(nx+1)+ix,b=a+nx+1;index.push(a,b,a+1,a+1,b,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('color',new THREE.BufferAttribute(colors,3));g.setIndex(index);g.computeVertexNormals();return g;
 },[low]);
 const material=useMemo(()=>{
  const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.94,metalness:0});
  m.onBeforeCompile=shader=>{
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vSand;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSand=position;');
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vSand;').replace('#include <color_fragment>',`#include <color_fragment>
float ripple=sin(vSand.x*2.4+sin(vSand.z*0.33)*2.3+vSand.y*2.6)*0.5+0.5;diffuseColor.rgb*=0.93+0.1*ripple;
vec2 cell=floor(vSand.xz*11.0);diffuseColor.rgb+=step(0.9965,fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453))*0.22;`);
  };
  m.customProgramCacheKey=()=>'dunes';return m;
 },[]);
 useEffect(()=>()=>{geometry.dispose();},[geometry]);useEffect(()=>()=>{material.dispose();},[material]);
 return <mesh geometry={geometry} material={material} receiveShadow/>;
}

// Streaks of sand skim the dunes. A light breeze is always there; a gust fills the air.
const BOX=46;
function SandWind({game,low}:{game:Game;low:boolean}){
 const total=low?200:480,mesh=useRef<THREE.InstancedMesh>(null),strength=useRef(0),o=useMemo(()=>new THREE.Object3D(),[]);
 const grains=useMemo(()=>{const r=random(1801);return Array.from({length:480},()=>({x:r()*BOX,z:r()*BOX,y:.12+r()*r()*5.5,speed:8+r()*9,length:.5+r()*1.2,phase:r()*6.28}));},[]);
 const material=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffe9c4',transparent:true,opacity:0,depthWrite:false}),[]);useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera},delta)=>{const m=mesh.current;if(!m)return;const dt=Math.min(delta,.1),open=game.mode!=='menu'&&game.mode!=='building';
  strength.current=THREE.MathUtils.damp(strength.current,open?.16+.84*sandForWorld(game):0,1.2,dt);const s=strength.current;m.visible=s>.02;if(!m.visible)return;
  const t=game.elapsed+game.introTime+game.portalTime,count=Math.max(1,Math.round(total*Math.min(1,s))),wrap=(v:number,c:number)=>((v-c)%BOX+BOX)%BOX-BOX/2+c;
  for(let i=0;i<count;i++){const g=grains[i],travel=t*g.speed*(.55+s*.7),x=wrap(g.x+WIND.x*travel,camera.position.x),z=wrap(g.z+WIND.z*travel,camera.position.z);
   o.position.set(x,desertDune({x,z})+g.y+Math.sin(t*1.7+g.phase)*.22,z);o.rotation.set(0,WIND_YAW,0);const near=Math.hypot(x-camera.position.x,z-camera.position.z);o.scale.set(near<3?0:.022,.022,g.length*(.45+s*.8));o.updateMatrix();m.setMatrixAt(i,o.matrix);}
  m.count=count;m.instanceMatrix.needsUpdate=true;material.opacity=.14+.24*s;});
 return <instancedMesh ref={mesh} args={[boxGeometry,material,total]} frustumCulled={false} visible={false}/>;
}

// Three small whirlwinds wander the open sand beside the trail. They are only air and sand: the heroine can walk right through.
const DEVIL_HOMES=[2,5,8].map((n,i)=>{const p=DESERT_PATH[Math.min(n,DESERT_PATH.length-1)],side=i%2?-1:1;return {x:Math.max(DESERT_BOUNDS.minX+16,Math.min(DESERT_BOUNDS.maxX-16,p.x+side*19)),z:p.z-6};});
function DustDevils({game,low}:{game:Game;low:boolean}){
 const per=low?22:40,mesh=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);
 useFrame(({camera})=>{const m=mesh.current;if(!m)return;const t=game.elapsed+game.introTime+game.portalTime,gust=sandForWorld(game);let n=0;
  DEVIL_HOMES.forEach((home,d)=>{const cx=home.x+Math.sin(t*.19+d*2.1)*8,cz=home.z+Math.cos(t*.15+d*1.3)*8;if(Math.hypot(cx-camera.position.x,cz-camera.position.z)>150)return;const floor=desertDune({x:cx,z:cz}),tall=6.5+gust*2.5+Math.sin(t*.4+d)*.8;
   for(let k=0;k<per;k++){const h=(k/per+t*.33)%1,angle=k*2.4+t*(7-h*3),radius=.22+h*h*(1.7+gust*.6)+Math.sin(t*3+k)*.07,lean=h*h*Math.sin(t*.5+d)*1.3,size=(.13+h*.24)*Math.sqrt(Math.sin(h*Math.PI));
    o.position.set(cx+Math.cos(angle)*radius+lean,floor+.1+h*tall,cz+Math.sin(angle)*radius);o.rotation.set(angle,angle*1.3,0);o.scale.setScalar(size);o.updateMatrix();m.setMatrixAt(n++,o.matrix);}});
  m.count=n;m.visible=n>0;m.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[boxGeometry,undefined,per*DEVIL_HOMES.length]} frustumCulled={false}><meshBasicMaterial color="#c79b63" transparent opacity={.7} depthWrite={false}/></instancedMesh>;
}

// Tumbleweeds roll and hop downwind past the heroine, faster in a gust.
type Weed={x:number;z:number;y:number;vy:number;roll:number;size:number};
function Tumbleweeds({game,low}:{game:Game;low:boolean}){
 const total=low?2:4,mesh=useRef<THREE.InstancedMesh>(null),weeds=useRef<Weed[]>([]),owner=useRef(game),o=useMemo(()=>new THREE.Object3D(),[]);
 useFrame((_,delta)=>{const m=mesh.current;if(!m)return;if(owner.current!==game){owner.current=game;weeds.current=[];}const list=weeds.current,p=game.player,dt=game.mode==='playing'?Math.min(delta,.1):0,gust=sandForWorld(game),speed=2.4+gust*5.5;
  if(live(game)&&list.length<total&&Math.random()<dt*.7){const across=(Math.random()-.5)*44,back=24+Math.random()*10;list.push({x:p.x-WIND.x*back-WIND.z*across,z:p.z-WIND.z*back+WIND.x*across,y:0,vy:0,roll:0,size:.42+Math.random()*.3});}
  let n=0;for(let i=list.length-1;i>=0;i--){const w=list[i];w.x+=WIND.x*speed*dt;w.z+=WIND.z*speed*dt;w.vy-=9*dt;w.y+=w.vy*dt;if(w.y<=0){w.y=0;if(dt>0)w.vy=1.2+Math.random()*(1.6+gust*2);}w.roll+=speed*dt/w.size;
   if(!live(game)||Math.hypot(w.x-p.x,w.z-p.z)>42){list.splice(i,1);continue;}
   o.position.set(w.x,desertDune(w)+w.size+w.y,w.z);o.rotation.set(w.roll,WIND_YAW,0,'YXZ');o.scale.setScalar(w.size);o.updateMatrix();m.setMatrixAt(n++,o.matrix);}
  m.count=n;m.visible=n>0;m.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[undefined,undefined,total]} frustumCulled={false} visible={false}><icosahedronGeometry args={[1,2]}/><meshBasicMaterial color="#8d6a3d" wireframe/></instancedMesh>;
}

// The trail lanterns warm up at dusk, and restored oasis water twinkles.
function DesertGlow({game}:{game:Game}){
 const halos=useRef<THREE.InstancedMesh>(null),glints=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);
 const lamps=useMemo(()=>DESERT_PATH.slice(1,-1).flatMap(p=>[-1,1].map(side=>{const x=p.x+side*5,z=p.z+4;return {x,y:desertDune({x,z})+2.7,z};})),[]);
 const sparkles=useMemo(()=>{const r=random(1802);return DESERT_SHRINES.flatMap((p,shrine)=>Array.from({length:9},()=>{const a=r()*Math.PI*2,d=Math.sqrt(r())*3.5;return {shrine,x:p.x+4+Math.cos(a)*d,z:p.z-3+Math.sin(a)*d,y:desertDune({x:p.x+4,z:p.z-3})+.13,phase:r()*6.28,rate:1.6+r()*2};}));},[]);
 const warm=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffc66b',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);useEffect(()=>()=>warm.dispose(),[warm]);
 useFrame(({clock})=>{const t=clock.elapsedTime,dark=atmosphereForWorld(game).glow,h=halos.current,g=glints.current;
  if(h){h.visible=dark>.02;if(h.visible){lamps.forEach((l,i)=>{o.position.set(l.x,l.y,l.z);o.rotation.set(0,0,0);o.scale.setScalar(1.25+Math.sin(t*2.1+i)*.1);o.updateMatrix();h.setMatrixAt(i,o.matrix);});h.instanceMatrix.needsUpdate=true;warm.opacity=dark*.3;}}
  if(g){let n=0;for(const s of sparkles){if(!game.shrines.has(s.shrine))continue;const pulse=Math.max(0,Math.sin(t*s.rate+s.phase));o.position.set(s.x,s.y,s.z);o.rotation.set(0,t*.6+s.phase,0);o.scale.set(.5*pulse*pulse,.02,.07);o.updateMatrix();g.setMatrixAt(n++,o.matrix);o.rotation.y+=Math.PI/2;o.updateMatrix();g.setMatrixAt(n++,o.matrix);}g.count=n;g.visible=n>0;g.instanceMatrix.needsUpdate=true;}});
 return <><instancedMesh ref={halos} args={[undefined,warm,lamps.length]} frustumCulled={false} visible={false}><icosahedronGeometry args={[1,1]}/></instancedMesh><instancedMesh ref={glints} args={[boxGeometry,undefined,sparkles.length*2]} frustumCulled={false} visible={false}><meshBasicMaterial color="#f4fffb" toneMapped={false}/></instancedMesh></>;
}
export function DesertWeather({game,low}:{game:Game;low:boolean}){return <><SandWind game={game} low={low}/><DustDevils game={game} low={low}/><Tumbleweeds game={game} low={low}/><DesertGlow game={game}/></>;}
