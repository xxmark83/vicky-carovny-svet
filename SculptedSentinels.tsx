import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import type {Enemy} from './game';
const sphere=new THREE.SphereGeometry(1,16,10),bone=new THREE.CapsuleGeometry(.085,.48,3,7);
function Part({p,s,c}:{p:[number,number,number];s:[number,number,number];c:string}){return <mesh position={p} scale={s} geometry={sphere} castShadow receiveShadow><meshStandardMaterial color={c} roughness={.87}/></mesh>;}
// Shared rig for the original green woodland spirit and friendly bone sentinel.
export function SculptedSentinel({game,enemy,calm=false}:{game:Game;enemy:Enemy;calm?:boolean}){
 const legs=useRef<(THREE.Group|null)[]>([]),arms=useRef<(THREE.Group|null)[]>([]);const skeleton=enemy.type===1;
 useFrame(()=>{const phase=enemy.gait,speed=enemy.hp<=0?0:1;legs.current.forEach((g,i)=>{if(g)g.rotation.x=Math.sin(phase+i*Math.PI)*.28*speed;});arms.current.forEach((g,i)=>{if(g)g.rotation.x=enemy.windup>0?-.85:Math.sin(phase+i*Math.PI)*.18;});});
 const skin=skeleton?'#e6ddc7':calm?'#a6cf79':'#78a94e',dark=skeleton?'#796e68':'#31543e';
 return <group>
 <Part p={[0,1,0]} s={skeleton?[.18,.44,.17]:[.38,.48,.28]} c={skin}/>
 {skeleton&&[.8,1,1.2].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]} scale={[1,.65,1]}><torusGeometry args={[.28,.055,5,12]}/><meshStandardMaterial color={skin}/></mesh>)}
 {[-1,1].map((side,i)=><group key={side}><group ref={el=>{legs.current[i]=el;}} position={[side*.2,.63,0]}>{skeleton?<mesh geometry={bone} position={[0,-.25,0]} castShadow><meshStandardMaterial color={skin}/></mesh>:<Part p={[0,-.23,0]} s={[.16,.3,.17]} c="#79718e"/>}<Part p={[0,-.52,.1]} s={[.19,.11,.28]} c={skeleton?'#d3c9b5':'#61734b'}/></group><group ref={el=>{arms.current[i]=el;}} position={[side*.42,1.29,0]}><Part p={[0,-.28,.02]} s={skeleton?[.085,.36,.085]:[.15,.36,.16]} c={skin}/><Part p={[0,-.57,.06]} s={[.12,.12,.13]} c={skin}/></group></group>)}
 <Part p={[0,1.78,0]} s={skeleton?[.42,.4,.33]:[.46,.45,.38]} c={skin}/>
 {[-1,1].map(side=><group key={side}><Part p={[side*.18,1.8,.31]} s={[.115,calm?.035:.135,.055]} c={dark}/>{!skeleton&&!calm&&<><Part p={[side*.18,1.8,.36]} s={[.05,.07,.018]} c="#f5de91"/><Part p={[side*.16,1.83,.38]} s={[.02,.027,.008]} c="#fff9df"/></>}{!skeleton&&<Part p={[side*.43,1.91,-.02]} s={[.17,.11,.15]} c="#8db75b"/>}</group>)}
 <Part p={[0,1.59,.34]} s={[skeleton?.07:.12,.035,.028]} c={dark}/>
 {!skeleton&&[-1,1].map(side=><mesh key={side} position={[side*.19,2.15,0]} rotation={[0,side*.5,-side*.25]}><coneGeometry args={[.13,.42,7]}/><meshStandardMaterial color={calm?'#c1d780':'#a3bd68'}/></mesh>)}
 {calm&&<Part p={[0,2.43,0]} s={[.1,.1,.06]} c="#f1a9cb"/>}
 {game.desert&&<Part p={[0,2.12,0]} s={[.42,.09,.36]} c="#d8b77b"/>}
 </group>;
}
