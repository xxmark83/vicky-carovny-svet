import {DESERT_BOUNDS as WORLD_BOUNDS} from './valleyLayout';
import {useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import type {Block} from './world';
import {random,distance} from './map';
import {DESERT_SHRINES,DESERT_SECRET,DESERT_SCENES,DESERT_PATH,desertHeight,desertPathDistance} from './desert';
import {Cubes,Box,boxGeometry} from './Voxel';
import {Sign} from './Scenery';
import {useHeroFadeMaterial} from './OcclusionMaterial';
import {Dunes} from './DesertWeather';
import {DesertPlants,Mesas,Oasis,DesertFires} from './DesertScenery';
import type {Peak} from './DesertScenery';
function desertBlocks(){const decor:Block[]=[],peaks:Peak[]=[];const r=random(22371),add=(b:Block)=>decor.push(b);
 // 3.18.0: the ground itself is the smooth Dunes surface. The old column loop drew one random colour per column; those draws are kept so later decorations stay in place.
 for(let x=WORLD_BOUNDS.minX;x<WORLD_BOUNDS.maxX;x+=2.5)for(let z=WORLD_BOUNDS.minZ;z<WORLD_BOUNDS.maxZ;z+=2.5)if(desertPathDistance({x:x+1.25,z:z+1.25})>=2.5)r();
 // 3.19.0: cacti and rocks are drawn rounded by DesertPlants, the mountain wall by Mesas and the palms by the new Oasis.
 for(let i=0;i<10;i++)add({p:[52,desertHeight({x:52,z:-117})+i*1.6+.8,-117],s:[29-i*2.5,1.6,29-i*2.5],c:i%2?'#e1b267':'#f0cc86'});
 add({p:[52,19.8,-117],s:[3,2,3],c:'#ffe9a1'});
 for(let i=0;i<56;i++){const edge=i<20?0:i<40?1:i<48?2:3,progress=edge<2?(i%20)/19:(i%8)/7,x=edge===0?-103:edge===1?103:-106+progress*212,z=edge<2?37-progress*370:edge===2?43:-333,peak=58+r()*27,width=21+r()*12;peaks.push({x,z,peak,width});}
 // Monumental layered red rocks and wind arches, away from the main walkable lane.
 for(const side of [-1,1])for(let i=0;i<4;i++){const x=side*(59+i%2*9),z=-140-i*12,h=7+i*2;for(let j=0;j<6;j++)add({p:[x,desertHeight({x,z})+j*h/6+h/12,z],s:[7-j*.7,h/6,8-j*.75],c:j%2?'#d78f79':'#f0b58b'});}
 for(const p of DESERT_PATH.slice(1,-1))for(const side of [-1,1]){const x=p.x+side*5,z=p.z+4,y=desertHeight({x,z});add({p:[x,y+1.3,z],s:[.25,2.6,.25],c:'#a37b4d'});add({p:[x,y+2.7,z],s:[.65,.6,.65],c:'#ffe4a3'});}
 // A small caravan camp, a wind gate and a flowering third oasis create distinct silhouettes.
 for(const side of [-1,1]){const x=-22+side*5,z=-205,y=desertHeight({x,z});add({p:[x,y+3,z],s:[1.2,6,1.6],c:'#e6c38c'});add({p:[x,y+6.4,z],s:[2,.6,2.2],c:'#f6d5a0'});for(let j=0;j<5;j++)add({p:[x+side*(.4+j*.25),y+5-j*.45,z],s:[.65,.5,.15],c:j%2?'#8bcbd3':'#ebc8ea'});}
 add({p:[-22,8,-205],s:[12,1,2.2],c:'#edd3a1'});
 for(const side of [-1,1]){const x=-18+side*4,z=-12,y=desertHeight({x,z});add({p:[x,y+1.3,z],s:[.2,2.6,.2],c:'#aa7d4b'});add({p:[x,y+1.3,z-4],s:[.2,2.6,.2],c:'#aa7d4b'});}add({p:[-18,3,-14],s:[9,.3,5],c:'#e9a2b8'});for(let i=0;i<5;i++)add({p:[-21+i*1.5,.25,-15],s:[1.2,.5,1.2],c:i%2?'#f4d184':'#79c9c2'});
 for(let i=0;i<12;i++){const a=i*2.4,x=-26+Math.sin(a)*11,z=-240+Math.cos(a)*11,y=desertHeight({x,z});add({p:[x,y+.5,z],s:[.1,1,.1],c:'#5ba276'});add({p:[x,y+1,z],s:[1,.22,1],c:i%2?'#eaa6cc':'#ffdf87'});}
 // Sun temple is an open frame: its central lane and treasure remain unobstructed.
 for(const side of [-1,1])for(const z of [-279,-289,-308]){const x=side*10,y=desertHeight({x,z});add({p:[x,y+4,z],s:[2,8,2],c:'#e6c38a'});add({p:[x,y+8,z],s:[3,.7,3],c:'#ffe3a5'});for(let j=0;j<4;j++)add({p:[x,y+1+j*1.6,z+1.02],s:[1.4,.2,.08],c:'#69bfb4'});}
 add({p:[0,10,-279],s:[23,1.3,2.8],c:'#e9c57f'});add({p:[0,11.3,-279],s:[14,1.2,3],c:'#f8d990'});add({p:[0,12.5,-279],s:[5,1.2,3],c:'#ffeeb1'});
 for(let i=0;i<45;i++){const x=-70+r()*140,z=18-r()*325;if(DESERT_SHRINES.some(p=>distance(p,{x,z})<12))continue;const y=desertHeight({x,z});add({p:[x,y+.2,z],s:[.6,.4,.6],c:i%3?'#c8a76a':'#e6a1bc'});}
 return {decor,peaks};
}
function OasisFlowers({game,index}:{game:Game;index:number}){const p=DESERT_SHRINES[index],flowers=useRef<THREE.Group>(null);useFrame(()=>{flowers.current!.visible=game.shrines.has(index);});
 return <group ref={flowers}>{Array.from({length:18},(_,i)=>{const a=i*2.4,x=p.x+Math.sin(a)*5.8,z=p.z+Math.cos(a)*5.8;return <group key={i} position={[x,desertHeight({x,z}),z]}><Box p={[0,.45,0]} s={[.08,.9,.08]} c="#589854"/><Box p={[0,.92,0]} s={[.55,.15,.55]} c={i%2?'#f3adc8':'#ffecaa'}/><Box p={[0,1,0]} s={[.16,.1,.16]} c="#f5c352"/></group>;})}</group>;
}
export function DesertWorld({game,low}:{game:Game;low:boolean}){const landscape=useMemo(()=>desertBlocks(),[]),material=useHeroFadeMaterial(game),secret=useRef<THREE.Group>(null);useFrame(()=>{secret.current!.visible=!game.secretFound;secret.current!.rotation.y=game.elapsed;});return <><Dunes low={low}/><Mesas peaks={landscape.peaks}/><DesertPlants game={game} low={low}/><DesertFires game={game}/><Cubes blocks={landscape.decor} material={material}/>{DESERT_SHRINES.map((_,i)=><group key={i}><Oasis game={game} index={i} low={low}/><OasisFlowers game={game} index={i}/></group>)}{DESERT_SCENES.map(p=><Sign key={p.name} text={p.name} color={p.color} position={[p.x-4,desertHeight({x:p.x-4,z:p.z+5}),p.z+5]}/>)}<group position={[DESERT_SECRET.x,desertHeight(DESERT_SECRET),DESERT_SECRET.z]}><Box p={[0,.2,0]} s={[3,.4,3]} c="#d7aa68"/><group ref={secret} position={[0,1,0]}><mesh><torusGeometry args={[.55,.15,4,12]}/><meshStandardMaterial color="#ffdb70" emissive="#d9a535" emissiveIntensity={.5}/></mesh><mesh><octahedronGeometry args={[.25,0]}/><meshBasicMaterial color="#a8f8df"/></mesh></group><Sign text="Vlk tu něco cítí" color="#ffdf90" position={[-3,0,2]}/></group></>;}
export function DesertGuide({game}:{game:Game}){const paws=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]),{camera}=useThree(),dust=useRef<THREE.InstancedMesh>(null);useFrame(()=>{let n=0;if(game.mode==='playing'&&!game.flying&&game.guide.until>game.elapsed){let last=game.player;for(const p of game.guide.path){if(distance(p,game.player)>11||n>=80)break;if(distance(last,p)<1.6)continue;const a=Math.atan2(p.x-last.x,p.z-last.z);for(const side of [-1,1]){o.position.set(p.x+Math.cos(a)*side*.22,game.floor(p)+.12,p.z-Math.sin(a)*side*.22);o.rotation.set(0,a,0);o.scale.set(.2,.035,.3);o.updateMatrix();paws.current!.setMatrixAt(n++,o.matrix);}last={...game.player,...p};}}paws.current!.count=n;paws.current!.instanceMatrix.needsUpdate=true;(paws.current!.material as THREE.MeshBasicMaterial).opacity=Math.min(.85,Math.max(0,(game.guide.until-game.elapsed)/2));let count=0;for(let i=0;i<36;i++){const t=game.elapsed+game.introTime,x=camera.position.x-15+i%6*6+Math.sin(t*.2+i)*2,z=camera.position.z-10-Math.floor(i/6)*8,y=game.floor({x,z})+1.5+Math.sin(t+i)*.8;o.position.set(x,y,z);o.scale.set(.04,.04,.08);o.updateMatrix();dust.current!.setMatrixAt(count++,o.matrix);}dust.current!.count=count;dust.current!.instanceMatrix.needsUpdate=true;});return <><instancedMesh ref={paws} args={[boxGeometry,undefined,80]} frustumCulled={false}><meshBasicMaterial color="#ffd25c" transparent opacity={.85} depthWrite={false}/></instancedMesh><instancedMesh ref={dust} args={[boxGeometry,undefined,36]} frustumCulled={false}><meshBasicMaterial color="#ffeac3" transparent opacity={.25} depthWrite={false}/></instancedMesh></>;}
