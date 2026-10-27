import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {introHeroAt,introCastIndex} from './cinematic';
import {heroPose} from './heroMotion';
import {chickenGeometry} from './chickenGeometry';
import {Sword} from './Sword';
export function ChickenHero({game,hero=false}:{game:Game;hero?:boolean}){
 const root=useRef<THREE.Group>(null),body=useRef<THREE.Group>(null),head=useRef<THREE.Group>(null),eyes=useRef<THREE.Group>(null),pupils=useRef<THREE.Mesh>(null),tail=useRef<THREE.Group>(null),wings=useRef<(THREE.Group|null)[]>([]),legs=useRef<(THREE.Group|null)[]>([]),feet=useRef<(THREE.Group|null)[]>([]),ring=useRef<THREE.Mesh>(null);
 const geometry=useMemo(chickenGeometry,[]),material=useMemo(()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.58,metalness:.08,side:THREE.DoubleSide}),[]),eyeMaterial=useMemo(()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.24}),[]);
 useEffect(()=>()=>{Object.values(geometry).forEach(g=>g.dispose());material.dispose();eyeMaterial.dispose();},[geometry,material,eyeMaterial]);
 useFrame(({clock},delta)=>{
  const dt=Math.min(delta,.08),t=game.mode==='menu'?clock.elapsedTime:game.mode==='intro'?game.introTime:game.elapsed+game.portalTime,pose=heroPose(game),speed=pose.speed,phase=game.heroGait,joy=game.mode==='won'||game.heroReaction==='joy',shot=game.mode==='intro'?introHeroAt(t,window.innerWidth/window.innerHeight<.9,game.level):null,air=game.flying||game.landing||!!shot?.flying;
  const compression=Math.sin(Math.min(1,game.landingTime/.45)*Math.PI)*.12;
  root.current!.scale.set(.72*(1+compression),.72*(1-compression),.72*(1+compression));
  if(shot){root.current!.position.set(...shot.position);root.current!.rotation.set(.1,shot.yaw,0);root.current!.visible=introCastIndex(t)<0;}
  else if(hero){root.current!.position.set(4.8,.05,9.8);root.current!.scale.setScalar(1.25);root.current!.rotation.set(0,.4,0);root.current!.visible=true;}
  else{const floor=game.inCave?0:air?game.floor(game.player):game.standing(game.player);root.current!.position.set(game.player.x,floor+game.player.y+Math.abs(Math.sin(phase))*.06*speed+(joy?Math.abs(Math.sin(t*5))*.18:0),game.player.z);const yaw=game.mode==='won'?Math.sin(t*2)*.5:game.player.yaw,diff=Math.atan2(Math.sin(yaw-root.current!.rotation.y),Math.cos(yaw-root.current!.rotation.y));root.current!.rotation.y+=diff*(1-Math.exp(-dt*14));root.current!.rotation.x=air?.18:-speed*.05;root.current!.rotation.z=game.hurtFlash>0?Math.sin(t*30)*.05:Math.sin(phase)*speed*.035;root.current!.visible=game.invulnerable===0||air||game.mode!=='playing'||Math.sin(t*25)>-.6;}
  if(game.mode==='paused')return;
  body.current!.rotation.x=air?-.2:Math.sin(phase*2)*speed*.035;
  head.current!.rotation.set(air?-.12:Math.sin(phase)*speed*.12,THREE.MathUtils.damp(head.current!.rotation.y,hero?Math.sin(t*.65)*.15:pose.look,5,dt),joy?Math.sin(t*3)*.12:Math.sin(t*1.7)*.025);
  eyes.current!.scale.y=t%4.1>4.0?.08:1;pupils.current!.position.x=Math.sin(t*.8)*.025;
  tail.current!.rotation.y=Math.sin(phase)*speed*.12+Math.sin(t*1.3)*.04;tail.current!.rotation.x=air?-.25:Math.sin(t*2)*.03;
  legs.current.forEach((leg,i)=>{leg!.rotation.x=air?.7:Math.sin(phase+(i?Math.PI:0))*speed*.85;feet.current[i]!.rotation.x=air?-.8:Math.max(0,Math.sin(phase+(i?Math.PI:0)))*speed*.3;});
  wings.current.forEach((wing,i)=>{const side=i?1:-1;wing!.rotation.set(-Math.sin(phase)*speed*.25,0,side*(air?1.2+Math.sin(t*11)*.35:joy?.55+Math.sin(t*7)*.3:.10));});
  const right=wings.current[1]!;if(game.swordCharge>.25)right.rotation.set(-1.25-game.swordCharge*.4,0,-.2);if(game.attackTime>0){const swing=Math.sin((1-game.attackTime/game.attackDuration)*Math.PI);right.rotation.set(-1.7*swing,swing*.4,-1.1*swing);}
  ring.current!.visible=game.flying;
 },-2);
 return <group ref={root}>
  <group ref={body}><mesh geometry={geometry.body} material={material} castShadow receiveShadow/>
   <group ref={head} position={[0,1.93,.12]}><mesh geometry={geometry.head} material={material} castShadow/><group ref={eyes} position={[0,.22,0]}><mesh geometry={geometry.eyes} position={[0,-.22,0]} material={eyeMaterial}/><mesh ref={pupils} geometry={geometry.pupils} position={[0,-.22,0]} material={eyeMaterial}/></group></group>
   <group ref={tail} position={[0,1.05,-.5]}><mesh geometry={geometry.tail} material={material} castShadow/></group>
   {[-1,1].map((side,i)=><group key={side} ref={el=>{wings.current[i]=el;}} position={[side*.41,1.18,-.05]}><mesh geometry={geometry.wing} material={material} scale={[side,1,1]} castShadow/>{side===1&&<group position={[.12,-.2,.36]} rotation={[.12,.12,-.22]} scale={.75}><Sword game={game}/></group>}</group>)}
  </group>
  {[-1,1].map((side,i)=><group key={side} ref={el=>{legs.current[i]=el;}} position={[side*.2,.57,0]}><mesh geometry={geometry.leg} material={material} castShadow/><group ref={el=>{feet.current[i]=el;}} position={[0,-.48,0]}><mesh geometry={geometry.foot} material={material} castShadow/></group></group>)}
  <mesh ref={ring} visible={false} position={[0,.6,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.83,.03,4,24]}/><meshBasicMaterial color="#ffdc7d"/></mesh>
 </group>;
}
