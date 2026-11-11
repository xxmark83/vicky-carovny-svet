import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {boxGeometry} from './Voxel';
import {pathDistance} from './map';
import {weatherForWorld,atmosphereForWorld} from './weather';
import {ambienceRates,AMBIENCE_CAP} from './ambienceRates';
// 3.6.0 decoration only. These particles live in the view; the game, its saves and its tests never see them.
type Mote={kind:'dust'|'splash'|'pollen'|'leaf'|'sparkle'|'print';x:number;y:number;z:number;vx:number;vy:number;vz:number;life:number;max:number;size:number;spin:number;color:THREE.Color};
const C={path:new THREE.Color('#b9a57c'),grass:new THREE.Color('#9fb878'),sand:new THREE.Color('#d6bf88'),stone:new THREE.Color('#aab4b8'),splash:new THREE.Color('#e6f4ff'),pollen:new THREE.Color('#fff6cf'),gem:new THREE.Color('#bff3ff'),gold:new THREE.Color('#ffe08a'),print:new THREE.Color('#3f6f2c'),shrine:new THREE.Color('#c9ffd6'),leaves:['#8fbf4a','#c9c24a','#ffb3d1','#ff8fc0','#fff0f6','#ffc1dd'].map(c=>new THREE.Color(c))};
export function Ambience({game,low}:{game:Game;low:boolean}){
 const mesh=useRef<THREE.InstancedMesh>(null),motes=useRef<Mote[]>([]),due=useRef({dust:0,splash:0,pollen:0,leaf:0,sparkle:0}),last=useRef({game,y:0,vy:0}),spark=useRef(0),step=useRef({x:game.player.x,z:game.player.z,side:1}),o=useMemo(()=>new THREE.Object3D(),[]);
 useFrame(({camera},delta)=>{const m=mesh.current;if(!m)return;const list=motes.current;if(last.current.game!==game){list.length=0;last.current={game,y:0,vy:0};}
  const dt=game.mode==='paused'?0:Math.min(delta,.1),p=game.player,ground=game.floor(p),grounded=!game.flying&&!game.landing&&p.y<.06,w=weatherForWorld(game),a=atmosphereForWorld(game),forestAir=!game.desert&&!game.inCave;
  const rates=ambienceRates({mode:game.mode,walking:game.walking,grounded,speed:game.heroSpeed,rain:a.rain,daylight:w.daylight,forestAir,low});
  const add=(mote:Mote)=>{if(list.length>=AMBIENCE_CAP)list.shift();list.push(mote);},r=(n=1)=>(Math.random()-.5)*n;
  const feet=game.inCave?C.stone:game.desert?C.sand:pathDistance(p)<2.3?C.path:C.grass;
  const puff=(spread:number,lift:number)=>add({kind:'dust',x:p.x+r(.5),y:ground+.08,z:p.z+r(.5),vx:r(spread),vy:lift*(.5+Math.random()*.5),vz:r(spread),life:.55,max:.55,size:.06+Math.random()*.05,spin:r(6),color:feet});
  // A soft ring of dust marks every landing from a jump.
  if(game.mode==='playing'&&grounded&&last.current.y>.25&&last.current.vy<-2)for(let i=0;i<(low?6:12);i++)puff(3.4,.9);last.current.y=p.y;last.current.vy=p.vy;
  // Golden sparks fly from the blade during every swing.
  if(game.mode==='playing'&&game.attackTime>0){spark.current+=(low?18:36)*dt;while(spark.current>=1){spark.current-=1;const fx=Math.sin(p.yaw),fz=Math.cos(p.yaw);add({kind:'sparkle',x:p.x+fx*1.1+r(1.4),y:ground+p.y+1.1+r(1),z:p.z+fz*1.1+r(1.4),vx:fx*1.5+r(2),vy:1+Math.random()*1.5,vz:fz*1.5+r(2),life:.45,max:.45,size:.07+Math.random()*.06,spin:r(10),color:C.gold});}}
  // 3.14.0: pressed footprints follow her through the grass and slowly spring back.
  if(game.mode==='playing'&&grounded&&feet===C.grass){const s=step.current;if(Math.hypot(p.x-s.x,p.z-s.z)>.55){s.side=-s.side;const sx=Math.cos(p.yaw)*.16*s.side,sz=-Math.sin(p.yaw)*.16*s.side;add({kind:'print',x:p.x+sx,y:ground+.03,z:p.z+sz,vx:0,vy:0,vz:0,life:low?2.5:4.5,max:low?2.5:4.5,size:.2,spin:p.yaw,color:C.print});s.x=p.x;s.z=p.z;}}else{step.current.x=p.x;step.current.z=p.z;}
  const d=due.current;for(const key of ['dust','splash','pollen','leaf','sparkle'] as const){d[key]+=rates[key]*dt;while(d[key]>=1){d[key]-=1;
   if(key==='dust')puff(1.1,1.3);
   else if(key==='splash'){const x=p.x+r(20),z=p.z+r(20);add({kind:'splash',x,y:game.floor({x,z})+.05,z,vx:0,vy:0,vz:0,life:.4,max:.4,size:.3+Math.random()*.25,spin:0,color:C.splash});}
   else if(key==='pollen')add({kind:'pollen',x:camera.position.x+r(24),y:camera.position.y+r(7)+1,z:camera.position.z+r(24),vx:.25+r(.3),vy:r(.12),vz:r(.3),life:5,max:5,size:.035+Math.random()*.03,spin:r(2),color:C.pollen});
   else if(key==='leaf'){const x=p.x+r(26),z=p.z+r(26);add({kind:'leaf',x,y:game.floor({x,z})+5+Math.random()*4,z,vx:.5+r(.6),vy:-.9-Math.random()*.5,vz:r(.6),life:6,max:6,size:.13+Math.random()*.07,spin:r(5),color:C.leaves[Math.floor(Math.random()*C.leaves.length)]});}
   else{const gems=game.layout.gems.filter((g,i)=>!game.gems.has(i)&&Math.hypot(g.x-p.x,g.z-p.z)<34),shrines=game.inCave?[]:game.layout.shrines.filter((s,i)=>game.shrines.has(i)&&Math.hypot(s.x-p.x,s.z-p.z)<40),chest=!game.inCave&&Math.hypot(game.layout.chest.x-p.x,game.layout.chest.z-p.z)<40?[{g:game.layout.chest,color:C.gold,h:1.6,w:2.2}]:[],spots=[...chest,...gems.map(g=>({g,color:C.gem,h:1.2,w:1.1})),...shrines.map(g=>({g,color:C.shrine,h:.6,w:2.6}))];if(spots.length){const s=spots[Math.floor(Math.random()*spots.length)];add({kind:'sparkle',x:s.g.x+r(s.w),y:game.floor(s.g)+s.h+r(.8),z:s.g.z+r(s.w),vx:0,vy:.5+Math.random()*.5,vz:0,life:.9,max:.9,size:.05+Math.random()*.05,spin:r(8),color:s.color});}}
  }}
  let n=0;for(let i=list.length-1;i>=0;i--){const q=list[i];q.life-=dt;if(q.life<=0){list.splice(i,1);continue;}const age=1-q.life/q.max,t=q.max-q.life;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;
   if(q.kind==='dust'){q.vy-=1.6*dt;q.vx*=1-2*dt;q.vz*=1-2*dt;}
   else if(q.kind==='leaf'){q.vx+=Math.sin(t*2+q.spin)*.9*dt;if(q.y<game.floor(q)+.06){q.y=game.floor(q)+.06;q.vx=q.vy=q.vz=0;q.life=Math.min(q.life,.8);}}
   else if(q.kind==='pollen')q.y+=Math.sin(t*1.3+q.spin)*.1*dt;
   // Everything swells in gently and shrinks away, so nothing pops.
   const fade=Math.min(1,age*6)*Math.min(1,q.life/(q.max*.45)),s=q.size*fade;o.position.set(q.x,q.y,q.z);
   if(q.kind==='print'){o.rotation.set(0,q.spin,0);o.scale.set(q.size*.7,.02,q.size*1.25*Math.min(1,q.life/(q.max*.5)));}
   else if(q.kind==='splash'){const ring=q.size*(.4+age*2.2);o.rotation.set(0,q.x,0);o.scale.set(ring,.05*(1-age)+.01,ring);}
   else if(q.kind==='leaf'){o.rotation.set(t*q.spin*.4,t*q.spin*.3,Math.sin(t*2+q.spin)*.9);o.scale.set(s,s*.12,s*.7);}
   else if(q.kind==='sparkle'){const tw=.6+.4*Math.sin(t*18+q.spin);o.rotation.set(t*q.spin,t*q.spin,0);o.scale.setScalar(s*tw);}
   else{o.rotation.set(t*q.spin,t*q.spin*.7,0);o.scale.setScalar(q.kind==='dust'?s*(1+age*1.6):s);}
   o.updateMatrix();m.setMatrixAt(n,o.matrix);m.setColorAt(n,q.color);n++;}
  m.count=n;m.visible=n>0;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[boxGeometry,undefined,AMBIENCE_CAP]} frustumCulled={false} visible={false}><meshBasicMaterial transparent opacity={.82} depthWrite={false} toneMapped={false}/></instancedMesh>;
}

// 3.14.0: butterflies and small birds rest among the flowers ahead and take wing when the heroine comes close.
type Critter={x:number;y:number;z:number;vx:number;vy:number;vz:number;bird:boolean;flying:number;phase:number;color:THREE.Color};
const WINGS=['#ffb347','#ff7fb6','#8fd3ff','#fff1a8','#c79bff'].map(c=>new THREE.Color(c)),FEATHERS=['#7a5a3c','#5f86b8','#c8553d'].map(c=>new THREE.Color(c));
export const CRITTER_FLEE=3.4;
export function Critters({game,low}:{game:Game;low:boolean}){
 const total=low?5:10,mesh=useRef<THREE.InstancedMesh>(null),list=useRef<Critter[]>([]),owner=useRef(game),o=useMemo(()=>new THREE.Object3D(),[]);
 useFrame(({clock},delta)=>{const m=mesh.current;if(!m)return;if(owner.current!==game){owner.current=game;list.current=[];}const c=list.current,p=game.player,dt=game.mode==='paused'?0:Math.min(delta,.1),t=clock.elapsedTime,open=game.mode==='playing'&&!game.inCave&&!game.desert&&!game.flying;
  if(open&&c.length<total&&Math.random()<dt*1.5){const a=Math.random()*Math.PI*2,r=7+Math.random()*9,x=p.x+Math.sin(a)*r,z=p.z+Math.cos(a)*r;if(game.canMove({x,z})&&pathDistance({x,z})>2.6){const bird=Math.random()<.3;c.push({x,y:game.floor({x,z})+(bird?.12:.45+Math.random()*.3),z,vx:0,vy:0,vz:0,bird,flying:0,phase:Math.random()*6,color:(bird?FEATHERS:WINGS)[Math.floor(Math.random()*(bird?FEATHERS.length:WINGS.length))]});}}
  let n=0;for(let i=c.length-1;i>=0;i--){const q=c[i],d=Math.hypot(q.x-p.x,q.z-p.z);
   if(!q.flying&&open&&d<CRITTER_FLEE){q.flying=.001;const k=Math.max(d,.2),speed=q.bird?5.5:2.6;q.vx=(q.x-p.x)/k*speed;q.vz=(q.z-p.z)/k*speed;q.vy=q.bird?3.2:1.4;}
   if(q.flying){q.flying+=dt;q.x+=(q.vx+Math.sin(t*5+q.phase)*(q.bird?.3:1.4))*dt;q.z+=(q.vz+Math.cos(t*4+q.phase)*(q.bird?.3:1.4))*dt;q.y+=q.vy*dt;}
   if(!open||d>26||q.flying>(q.bird?3:4.5)){c.splice(i,1);continue;}
   const fade=q.flying?Math.min(1,((q.bird?3:4.5)-q.flying)*2):1,flap=Math.sin(t*(q.flying?(q.bird?22:16):q.bird?0:3)+q.phase)*(q.flying?.9:q.bird?0:.55),yaw=q.flying?Math.atan2(q.vx,q.vz):q.phase,size=(q.bird?.3:.2)*fade;
   for(const side of [-1,1]){o.position.set(q.x,q.y,q.z);o.rotation.set(0,yaw,side*(.25+flap),'YXZ');o.translateX(side*size*.5);o.scale.set(size,.02,size*(q.bird?.5:.8));o.updateMatrix();m.setMatrixAt(n,o.matrix);m.setColorAt(n,q.color);n++;}
   if(q.bird){o.position.set(q.x,q.y,q.z);o.rotation.set(0,yaw,0);o.scale.set(.1*fade,.1*fade,.24*fade);o.updateMatrix();m.setMatrixAt(n,o.matrix);m.setColorAt(n,q.color);n++;}}
  m.count=n;m.visible=n>0;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[boxGeometry,undefined,total*3]} frustumCulled={false} visible={false}><meshBasicMaterial toneMapped={false}/></instancedMesh>;
}
