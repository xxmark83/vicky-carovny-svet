import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {boxGeometry} from './Voxel';
// 3.15.0: rewards the child can see. Decoration only; the game, its saves and its tests never read any of this.
type Bit={kind:'flower'|'coin'|'confetti'|'spark';x:number;y:number;z:number;vx:number;vy:number;vz:number;life:number;max:number;size:number;spin:number;color:THREE.Color};
const CAP=420,tint=(list:string[])=>list.map(c=>new THREE.Color(c));
const PETALS=tint(['#ff7fb6','#ffd95a','#fff4f0','#b98cf0','#7fc4ff']),PARTY=tint(['#ff6fa8','#ffd447','#6fd3ff','#8be07a','#c08bff','#ffffff']),GOLD=tint(['#ffd75a','#f1ac24','#ffe9a0']),STEM=new THREE.Color('#4f8a36');
const backOut=(v:number)=>{const t=Math.min(1,Math.max(0,v))-1;return 1+2.2*t*t*t+1.2*t*t;};
// A diamond icon flies from where the gem was to the counter in the corner.
function flyToCounter(from:{x:number;y:number}){const target=document.querySelector('.counters span'),host=document.body;if(!target||typeof document.body.animate!=='function')return;const to=target.getBoundingClientRect(),el=document.createElement('div');el.textContent='💎';el.setAttribute('aria-hidden','true');el.style.cssText=`position:fixed;left:0;top:0;z-index:40;font-size:34px;pointer-events:none;filter:drop-shadow(0 0 10px #7fe6ff);will-change:transform`;host.appendChild(el);const mid={x:(from.x+to.left)/2,y:Math.min(from.y,to.top)-90};
 const run=el.animate([{transform:`translate(${from.x-17}px,${from.y-17}px) scale(.6)`,opacity:.2},{transform:`translate(${mid.x}px,${mid.y}px) scale(1.5)`,opacity:1,offset:.45},{transform:`translate(${to.left}px,${to.top-6}px) scale(.7)`,opacity:1}],{duration:850,easing:'cubic-bezier(.3,.1,.3,1)'});const done=()=>{el.remove();(target as HTMLElement).animate?.([{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:320});};run.onfinish=done;run.oncancel=()=>el.remove();}
export function Rewards({game,low}:{game:Game;low:boolean}){
 const mesh=useRef<THREE.InstancedMesh>(null),flash=useRef<THREE.Mesh>(null),bits=useRef<Bit[]>([]),seen=useRef({game,hp:game.enemies.map(e=>e.hp),gems:new Set(game.gems),won:0,next:0,flash:0}),o=useMemo(()=>new THREE.Object3D(),[]),v=useMemo(()=>new THREE.Vector3(),[]);
 const glow=useMemo(()=>new THREE.MeshBasicMaterial({color:'#fff3c0',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);useEffect(()=>()=>glow.dispose(),[glow]);
 useFrame(({camera,size},delta)=>{const m=mesh.current;if(!m)return;const list=bits.current,r=(n=1)=>(Math.random()-.5)*n,pick=(c:THREE.Color[])=>c[Math.floor(Math.random()*c.length)],add=(b:Bit)=>{if(list.length>=CAP)list.shift();list.push(b);};
  if(seen.current.game!==game){list.length=0;seen.current={game,hp:game.enemies.map(e=>e.hp),gems:new Set(game.gems),won:0,next:0,flash:0};}
  const s=seen.current,dt=game.mode==='paused'?0:Math.min(delta,.1),q=low?.5:1;
  // A freed friend: a burst of light and a ring of flowers springing up around it.
  game.enemies.forEach((e,i)=>{if(s.hp[i]>0&&e.hp<=0&&game.mode==='playing'){const ground=game.floor(e);s.flash=1;flash.current?.position.set(e.x,ground+1.1,e.z);for(let k=0;k<Math.round(14*q);k++){const a=k/Math.round(14*q)*Math.PI*2+r(.3),d=1.5+Math.random()*1.1,x=e.x+Math.sin(a)*d,z=e.z+Math.cos(a)*d;add({kind:'flower',x,y:game.floor({x,z}),z,vx:0,vy:0,vz:0,life:7+Math.random()*2,max:9,size:.2+Math.random()*.12,spin:-k*.045,color:pick(PETALS)});}for(let k=0;k<Math.round(26*q);k++)add({kind:'spark',x:e.x,y:ground+1.2,z:e.z,vx:r(7),vy:2+Math.random()*5,vz:r(7),life:.9,max:.9,size:.09,spin:r(9),color:pick(PARTY)});}s.hp[i]=e.hp;});
  // A collected diamond flies to the counter.
  for(const id of game.gems)if(!s.gems.has(id)){s.gems.add(id);const g=game.layout.gems[id];if(g&&game.mode==='playing'){v.set(g.x,game.floor(g)+1.2,g.z).project(camera);if(v.z<1)flyToCounter({x:(v.x*.5+.5)*size.width,y:(-v.y*.5+.5)*size.height});}}if(s.gems.size>game.gems.size)s.gems=new Set(game.gems);
  // Victory: coins spill from the chest, confetti falls and fireworks bloom overhead.
  if(game.mode==='won'){const c=game.layout.chest,ground=game.floor(c);s.won+=dt;s.next-=dt;if(s.won<3.5)for(let k=0;k<Math.round(28*q*dt*10)/10+(Math.random()<28*q*dt%1?1:0);k++)add({kind:'coin',x:c.x+r(1.2),y:ground+1.5,z:c.z+r(.8),vx:r(5),vy:4+Math.random()*4.5,vz:1+Math.random()*3.5,life:6,max:6,size:.17,spin:r(14),color:pick(GOLD)});
   if(s.won<16&&Math.random()<22*q*dt)add({kind:'confetti',x:c.x+r(16),y:ground+7+Math.random()*4,z:c.z+r(12)+3,vx:r(1),vy:-1.1-Math.random()*.8,vz:r(1),life:7,max:7,size:.13,spin:r(8),color:pick(PARTY)});
   if(s.won<24&&s.next<=0){s.next=.55+Math.random()*.6;const x=c.x+r(26),y=ground+11+Math.random()*7,z=c.z-4+r(16),color=pick(PARTY);for(let k=0;k<Math.round(34*q);k++){const a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1),sp=5+Math.random()*3;add({kind:'spark',x,y,z,vx:Math.sin(b)*Math.cos(a)*sp,vy:Math.cos(b)*sp,vz:Math.sin(b)*Math.sin(a)*sp,life:1.5,max:1.5,size:.2,spin:r(9),color});}}}
  else{s.won=0;s.next=0;}
  if(flash.current){s.flash=Math.max(0,s.flash-dt*2.2);flash.current.visible=s.flash>0;flash.current.scale.setScalar(.6+(1-s.flash)*5);glow.opacity=s.flash*.55;}
  let n=0;const put=(color:THREE.Color)=>{o.updateMatrix();if(n<CAP){m.setMatrixAt(n,o.matrix);m.setColorAt(n,color);n++;}};
  for(let i=list.length-1;i>=0;i--){const b=list[i];b.life-=dt;if(b.life<=0){list.splice(i,1);continue;}const age=b.max-b.life,out=Math.min(1,b.life/.8);
   if(b.kind==='flower'){const grow=backOut((age+b.spin)/.45)*out,h=b.size*2.6*grow;if(grow<=0)continue;o.rotation.set(0,b.x*3,0);o.position.set(b.x,b.y+h/2,b.z);o.scale.set(.035,h,.035);put(STEM);o.position.set(b.x,b.y+h,b.z);o.scale.set(b.size*grow,b.size*.45*grow,b.size*grow);put(b.color);continue;}
   b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
   if(b.kind==='coin'){b.vy-=13*dt;const ground=game.floor(b)+.06;if(b.y<ground){b.y=ground;b.vy=Math.abs(b.vy)*.38;b.vx*=.6;b.vz*=.6;if(b.vy<.6){b.vy=0;b.spin=0;}}o.position.set(b.x,b.y,b.z);o.rotation.set(age*b.spin,age*b.spin*.6,0);o.scale.set(b.size*out,b.size*.22*out,b.size*out);}
   else if(b.kind==='confetti'){b.vx+=Math.sin(age*3+b.spin)*1.2*dt;o.position.set(b.x,b.y,b.z);o.rotation.set(age*b.spin,age*b.spin*.7,age*2);o.scale.set(b.size*out,.015,b.size*.6*out);}
   else{b.vy-=3.2*dt;b.vx*=1-.9*dt;b.vz*=1-.9*dt;o.position.set(b.x,b.y,b.z);o.rotation.set(age*b.spin,age*b.spin,0);o.scale.setScalar(b.size*Math.min(1,b.life/b.max*1.6));}
   put(b.color);}
  m.count=n;m.visible=n>0;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;});
 return <><instancedMesh ref={mesh} args={[boxGeometry,undefined,CAP]} frustumCulled={false} visible={false}><meshBasicMaterial toneMapped={false}/></instancedMesh><mesh ref={flash} visible={false} material={glow}><icosahedronGeometry args={[1,2]}/></mesh></>;
}
