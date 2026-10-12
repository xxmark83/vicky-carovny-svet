import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {GuardianBody} from './GuardianBody';
import {creatureBlocks} from './creatures';
import {animalMaterial} from './animalMotion';
import {INTRO_CAST,introCastIndex} from './cinematic';
import type {Game} from './game';
import type {Block} from './world';
import {voxelGeometry} from './PopulationView';
function castBlocks(index:number):Block[]{if(index<7)return creatureBlocks(index);const skeleton=index>7,c=skeleton?'#e5ddbd':'#75b044',b:Block[]=[{p:[0,1.7,0],s:[.85,.8,.7],c},{p:[0,.95,0],s:[.6,.7,.4],c:skeleton?'#c7c5ad':'#6198a5'}];for(const side of [-1,1]){b.push({p:[side*.2,.3,0],s:[.22,.6,.3],c},{p:[side*.5,.9,0],s:[.18,.8,.2],c},{p:[side*.2,1.75,.36],s:[.17,.2,.04],c:'#263f2c'},{p:[side*.2,.06,.12],s:[.3,.13,.5],c});}if(index===9)for(const x of [-.3,0,.3])b.push({p:[x,2.2,0],s:[.2,.3,.7],c:'#ffd976'});if(skeleton)for(let y=.7;y<1.3;y+=.2)b.push({p:[0,y,.22],s:[.75,.07,.17],c:'#fff1dc'});return b;}
export function LevelIntro({game}:{game:Game}){const {camera}=useThree(),stage=useRef<THREE.Group>(null),cast=useRef<THREE.Group>(null),sparkles=useRef<THREE.InstancedMesh>(null),v=useMemo(()=>new THREE.Vector3(),[]),o=useMemo(()=>new THREE.Object3D(),[]);
 const geometry=useMemo(()=>INTRO_CAST.map((_,i)=>voxelGeometry(castBlocks(i))),[]),joints=useMemo(()=>INTRO_CAST.map((_,i)=>animalMaterial(Math.min(i,6),false)),[]);
 useEffect(()=>{joints.forEach(j=>{j.material.depthTest=false;j.material.depthWrite=false;});cast.current?.traverse(o=>{if(o instanceof THREE.Mesh){o.renderOrder=20;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.depthTest=false;m.depthWrite=false;}}});return()=>{geometry.forEach(g=>g.dispose());joints.forEach(j=>j.material.dispose());};},[geometry,joints]);
 useFrame(()=>{const t=game.introTime,index=introCastIndex(t);stage.current!.visible=index>=0;if(index<0)return;camera.getWorldDirection(v);stage.current!.position.copy(camera.position).addScaledVector(v,12);stage.current!.position.y-=2.6;stage.current!.quaternion.copy(camera.quaternion);const local=t-18-index*2.5,pop=Math.min(1,local*4),bounce=Math.sin(pop*Math.PI)*.14;
 cast.current!.children.forEach((g,i)=>{g.visible=i===index;if(i===index){const hop=index===5?Math.abs(Math.sin(local*7))*.35:index===3?Math.sin(local*5)*.07:Math.abs(Math.sin(local*4))*.08;g.position.y=hop;g.rotation.y=Math.sin(local*2)*.38;g.rotation.z=index===3?Math.sin(local*6)*.09:0;g.scale.setScalar((pop+bounce)*(index===9?1.5:1.7));joints[i].pose.value.set(local*9,1,Math.sin(local*2)*.5+.5,0);}});
 for(let i=0;i<24;i++){const a=i*2.4+t*.8,r=1.1+(i%5)*.23;o.position.set(Math.sin(a)*r,.2+(i%4)*.6+Math.sin(t*3+i)*.16,Math.cos(a)*.7);o.scale.setScalar(.035+(i%3)*.013);o.rotation.set(t,i,t);o.updateMatrix();sparkles.current!.setMatrixAt(i,o.matrix);}sparkles.current!.instanceMatrix.needsUpdate=true;
 },0);
 return <group ref={stage} visible={false}><group ref={cast}>{geometry.map((g,i)=>i===9?<group key={i}><GuardianBody game={game} enemy={game.enemies[12]}/></group>:<mesh key={i} geometry={g} material={joints[i].material} renderOrder={20}/>)}</group><instancedMesh ref={sparkles} args={[undefined,undefined,24]} renderOrder={21} frustumCulled={false}><boxGeometry/><meshBasicMaterial color="#ffe990" depthTest={false} depthWrite={false}/></instancedMesh></group>;
}
