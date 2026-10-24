import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {FOREST_COTTAGES,FOREST_GARDENS,CHERRY_TREES} from './forestPlaces';
import {groundHeight} from './terrain';
import {random,distance} from './map';
import type {Block} from './world';
import {Cubes,boxGeometry} from './Voxel';
import {Sign} from './Scenery';
import {forestTexture} from './forestTextures';
import {useHeroFadeMaterial} from './OcclusionMaterial';

type Craft='stone'|'planks'|'bark'|'roof'|'leaf'|'decor';
function villageBlocks(){
 const b=Object.fromEntries((['stone','planks','bark','roof','leaf','decor'] as Craft[]).map(k=>[k,[] as Block[]])) as Record<Craft,Block[]>;
 const add=(k:Craft,p:Block['p'],s:Block['s'],c:string,r=0)=>b[k].push({p,s,c,r});
 for(const [index,h] of FOREST_COTTAGES.entries()){
  const y=Math.max(...[-3,0,3].flatMap(x=>[-2.6,0,2.6].map(z=>groundHeight({x:h.x+x,z:h.z+z}))))+.12;
  const a=(k:Craft,x:number,dy:number,z:number,s:Block['s'],c:string)=>add(k,[h.x+x,y+dy,h.z+z],s,c);
  const bottom=Math.min(...[-3,3].flatMap(x=>[-2.6,2.6].map(z=>groundHeight({x:h.x+x,z:h.z+z}))))-.1;
  a('stone',0,-(y-bottom)/2,0,[7,y-bottom+.1,6.1],'#a2aea0');
  a('planks',0,.09,0,[6.7,.18,5.8],'#c8aa74');
  for(const side of [-1,1]){
   a('stone',side*3,1.65,0,[.38,3.3,5.3],index%2?'#b8c2b1':'#b5bbb1');
   a('bark',side*3,1.75,2.6,[.48,3.5,.48],'#8b6645');a('bark',side*3,1.75,-2.6,[.48,3.5,.48],'#8b6645');
   a('stone',side*2.1,1.6,2.6,[1.45,3.2,.35],'#bdc5b7');
   a('bark',side*1.7,1.7,2.88,[1.2,1.5,.12],'#795d41');
   a('decor',side*1.7,1.78,2.97,[.9,1.15,.035],'#a8dce1');
   a('planks',side*1.7,1.78,3,[.08,1.2,.055],'#fff1c2');a('planks',side*1.7,1.78,3,[.95,.08,.055],'#fff1c2');
   a('planks',side*1.7,.89,3.1,[1.35,.4,.45],'#b38d5b');
   for(let j=0;j<4;j++){a('leaf',side*1.7-.42+j*.28,1.17,3.1,[.22,.25,.28],'#74a345');a('decor',side*1.7-.42+j*.28,1.33,3.1,[.18,.1,.18],j%2?'#ffb0cf':'#ffeab0');}
  }
  a('stone',0,1.65,-2.6,[6,3.3,.4],'#b4c0ad');a('stone',0,2.9,2.6,[1.55,.6,.35],'#bfccb9');
  a('bark',0,3.3,0,[6.6,.3,5.7],'#8e6745');
  a('planks',0,1.35,2.76,[1.25,2.55,.12],'#b7925e');a('decor',.38,1.24,2.86,[.13,.13,.1],'#eed392');
  // Layered gable roofs have visible eaves and a smaller grain than the wall stones.
  for(let step=0;step<7;step++)a('roof',0,3.55+step*.29,0,[7.9-step*.95,.36,6.5],h.roof);
  a('planks',0,3.2,2.97,[6.9,.17,.25],'#ddbd83');
  a('stone',1.7,4.6,-1.3,[.85,2.3,.8],'#a9b5a8');a('stone',1.7,5.8,-1.3,[1,.18,1],'#c0caba');
  // Small stoops stay outside the solid house footprint; adventure paths remain level.
  a('stone',0,-.02,3.4,[1.9,.16,.8],'#b6bdab');
  for(const side of [-1,1]){a('bark',side*.82,2.5,3.02,[.12,.5,.14],'#775737');a('decor',side*.82,2.4,3.13,[.26,.35,.25],'#ffe5a1');}
 }
 for(const g of FOREST_GARDENS){
  for(let row=0;row<5;row++)for(let col=0;col<7;col++){
   const x=g.x-2.1+col*.7,z=g.z-2+row*.9,y=groundHeight({x,z});
   add('stone',[x,y+.035,z],[.68,.07,.86],row%2?'#896c44':'#80623e');
   if(col===3){add('decor',[x,y+.095,z],[.35,.07,.82],'#7ac6d5');continue;}
   const h=.28+(row%3)*.06;add('leaf',[x,y+h*.5+.08,z],[.1,h,.1],'#70a83b');
   for(const side of [-1,1])add('leaf',[x+side*.1,y+h*.7,z],[.35,.09,.16],row%2?'#89ba44':'#b2c75d',side*.4);
   if(row%2===0)add('decor',[x,y+h+.08,z],[.13,.18,.13],'#e8c967');
  }
  for(let i=0;i<8;i++)for(const side of [-1,1]){const x=g.x-2.8+i*.8,z=g.z+side*2.9;add('planks',[x,groundHeight({x,z})+.12,z],[.76,.24,.18],'#bba06a');}
 }
 // Reed beds and textured riprap give the existing river a readable shoreline.
 for(let i=0;i<135;i++){
  const x=-76+i*1.15;if(Math.abs(x-32)<7)continue;
  for(const side of [-1,1]){const z=-152+side*(4.4+(i%3)*.23),y=groundHeight({x,z});
   add('stone',[x,y+.12,z],[.7,.25,.65],i%3?'#a8b7a1':'#8d9b91');
   if(i%2===0){add('leaf',[x,y+.55,z],[.1,1.1,.1],'#719648');add('decor',[x,y+1.05,z],[.17,.35,.17],'#bca66e');}
  }
 }
 // Original beehives, tucked into the cherry groves; no attacks or collection requirement.
 for(const p of [{x:38,z:4},{x:-29,z:-278}]){const y=groundHeight(p);add('bark',[p.x,y+.6,p.z],[.22,1.2,.22],'#8a6741');for(let i=0;i<4;i++)add('planks',[p.x,y+1+i*.22,p.z],[1.1-Math.abs(i-1.5)*.17,.24,.85],'#d9b46a');add('decor',[p.x,y+1.23,p.z+.44],[.3,.14,.02],'#554633');}
 return b;
}

export function ForestVillage({game,low}:{game:Game;low:boolean}){
 const base=useHeroFadeMaterial(game),blocks=useMemo(villageBlocks,[]);
 const mats=useMemo(()=>Object.fromEntries((Object.keys(blocks) as Craft[]).map(k=>{const m=base.clone();m.onBeforeCompile=base.onBeforeCompile;m.customProgramCacheKey=()=>`village-${k}-24`;m.map=forestTexture(k==='decor'?'leaf':k);m.roughness=k==='decor'?.65:1;return [k,m];})) as Record<Craft,THREE.MeshStandardMaterial>,[base,blocks]);
 useEffect(()=>()=>Object.values(mats).forEach(m=>{m.map?.dispose();m.dispose();}),[mats]);
 const blooms=useRef<THREE.InstancedMesh>(null),petals=useRef<THREE.InstancedMesh>(null),bees=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]),c=useMemo(()=>new THREE.Color(),[]);
 const seeds=useMemo(()=>{const r=random(2411);return Array.from({length:56},()=>({a:r()*Math.PI*2,r:2+r()*2,y:r()}));},[]);
 useFrame(()=>{
  const t=game.mode==='intro'?game.introTime:game.elapsed+game.portalTime;let n=0;
  for(let gi=0;gi<FOREST_GARDENS.length;gi++){
   const g=FOREST_GARDENS[gi],strength=game.gardenBloom?.index===gi?Math.min(1,Math.max(0,(game.gardenBloom.until-t)/3)):0;
   for(let i=0;i<18;i++){const x=g.x-2.1+(i%6+(i%6>=3?1:0))*.7,z=g.z-1.6+Math.floor(i/6)*1.7;
    o.position.set(x,groundHeight({x,z})+.43+strength*.28,z);o.scale.set(.12+strength*.24,.06+strength*.08,.12+strength*.24);o.rotation.set(0,i,0);o.updateMatrix();blooms.current!.setMatrixAt(n,o.matrix);blooms.current!.setColorAt(n++,c.set(strength>.01?(i%2?'#ffd976':'#ffaad1'):'#95ac4f'));
   }
  }
  blooms.current!.count=n;blooms.current!.instanceMatrix.needsUpdate=true;if(blooms.current!.instanceColor)blooms.current!.instanceColor.needsUpdate=true;
  n=0;
  for(let i=0;i<(low?20:56);i++){
   const tree=CHERRY_TREES[i%CHERRY_TREES.length],s=seeds[i];if(distance(tree,game.player)>70&&game.mode!=='intro'&&game.mode!=='menu')continue;
   const phase=(t*.13+s.y)%1,x=tree.x+Math.sin(s.a+phase)*s.r,z=tree.z+Math.cos(s.a+phase)*s.r;
   o.position.set(x,groundHeight(tree)+7*(1-phase)+.3,z);o.rotation.set(t*.3+i,i,t+i);o.scale.set(.14,.025,.21);o.updateMatrix();petals.current!.setMatrixAt(n++,o.matrix);
  }
  petals.current!.count=n;petals.current!.instanceMatrix.needsUpdate=true;
  for(let i=0;i<6;i++){const p=i<3?{x:38,z:4}:{x:-29,z:-278},a=t*1.8+i*2.1;o.position.set(p.x+Math.sin(a)*1.3,groundHeight(p)+1.8+Math.sin(t*3+i)*.3,p.z+Math.cos(a)*1.1);o.rotation.set(0,-a,0);o.scale.set(.16,.12,.23);o.updateMatrix();bees.current!.setMatrixAt(i,o.matrix);}bees.current!.instanceMatrix.needsUpdate=true;
 });
 return <>{(Object.keys(blocks) as Craft[]).map(k=><Cubes key={k} blocks={blocks[k]} material={mats[k]} castShadow={!low||k!=='leaf'}/>)}
  <Sign text="Vesnička u potoka" color="#e8ce8d" position={[27,groundHeight({x:27,z:-135}),-135]}/>
  <Sign text="Růžový háj" color="#f4b4ce" position={[-13,groundHeight({x:-13,z:-275}),-275]}/>
  {FOREST_GARDENS.map((p,i)=><Sign key={i} text="Klepni a zalij zahrádku" color="#b8df94" position={[p.x-3,groundHeight({x:p.x-3,z:p.z+3}),p.z+3]}/>)}
  <instancedMesh ref={blooms} args={[boxGeometry,undefined,36]} frustumCulled={false}><meshStandardMaterial roughness={.85}/></instancedMesh>
  <instancedMesh ref={petals} args={[boxGeometry,undefined,56]} frustumCulled={false}><meshStandardMaterial color="#ffc4df" side={THREE.DoubleSide} roughness={.8}/></instancedMesh>
  <instancedMesh ref={bees} args={[boxGeometry,undefined,6]} frustumCulled={false}><meshStandardMaterial color="#efd36f" roughness={.9}/></instancedMesh>
 </>;
}
