import {ForestLook} from './ForestLook';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {Landscape,CloudSky} from './Forest';
import {Water} from './Water';
import type {WaterPatch} from './Water';
import {Box,Cubes} from './Voxel';
import {PATH,SHRINES,CHEST,groundHeight,distance} from './game';
import type {Game} from './game';
import type {Block} from './world';
import {BRIDGE,CASTLE,valleyElevation,forestPoint,CASCADES,VALLEY_FOOTBRIDGES} from './valleyLayout';
import {Sign} from './Scenery';

function RoyalCastle(){const y=groundHeight(CASTLE);return <group position={[CASTLE.x,y,CASTLE.z]}>
 <mesh position={[0,-.5,-12]} receiveShadow castShadow><cylinderGeometry args={[26,30,1,32]}/><meshStandardMaterial color="#b6b9a6" roughness={.95}/></mesh>
 <Box p={[0,9,-15]} s={[23,18,15]} c="#f0dac4"/><Box p={[0,19,-15]} s={[25,2,17]} c="#fff0d4"/>
 <mesh position={[0,24,-15]} rotation={[0,Math.PI/4,0]} castShadow><coneGeometry args={[17,8,4]}/><meshStandardMaterial color="#d882ac" roughness={.6}/></mesh>
 {[3,8,13,18].map(h=><Box key={h} p={[0,h,-7.38]} s={[23.2,.25,.22]} c="#fff0d6"/>)}
 {[-9,-6,6,9].flatMap(x=>[5,11,16].map(h=><group key={`${x}:${h}`}><mesh position={[x,h,-7.25]}><capsuleGeometry args={[.65,1.6,4,8]}/><meshStandardMaterial color="#6c9ab0" roughness={.3}/></mesh><Box p={[x,h-1.35,-7.15]} s={[1.7,.22,.6]} c="#f9e3c2"/></group>))}
 {[-18,-9,0,9,18].map((x,i)=>{const h=i===2?37:i%2?29:23,z=i===2?-20:i%2?-15:-8;return <group key={x} position={[x,0,z]}>
 <mesh position={[0,h*.42,0]} castShadow receiveShadow><cylinderGeometry args={[i===2?4:3,i===2?4.8:3.6,h*.84,12]}/><meshStandardMaterial color={i%2?'#f4e1ca':'#e2cdb9'} roughness={.8}/></mesh>
 <mesh position={[0,h*.84,0]} castShadow><cylinderGeometry args={[4,3.6,1.1,12]}/><meshStandardMaterial color="#fff0d2"/></mesh>
 <mesh position={[0,h*.84+4.5,0]} castShadow><coneGeometry args={[i===2?6:4.8,9,12]}/><meshStandardMaterial color={i%2?'#b84c94':'#e28db8'} roughness={.48} metalness={.08}/></mesh>
 <mesh position={[0,h*.84+9.8,0]}><sphereGeometry args={[.35,8,6]}/><meshStandardMaterial color="#ffdb86" metalness={.5} roughness={.3}/></mesh>
 {[5,11,17,23].filter(a=>a<h*.8).map(a=><group key={a}><mesh position={[0,a,3.15]}><capsuleGeometry args={[.65,1.5,4,8]}/><meshStandardMaterial color="#698ca4" roughness={.3}/></mesh><Box p={[0,a+.2,3.75]} s={[.12,2.4,.12]} c="#f9ddb2"/></group>)}
 </group>;})}
 <mesh position={[0,3.3,-6.8]}><capsuleGeometry args={[2,3,4,12]}/><meshStandardMaterial color="#71566f"/></mesh>
 {[-1,1].map(side=><group key={side}><Box p={[side*9,1.5,5]} s={[7,3,7]} c="#b5b9a4"/><Box p={[side*9,3.1,5]} s={[7.3,.3,7.3]} c="#95b968"/>{Array.from({length:5},(_,i)=><mesh key={i} position={[side*9+(i%3-1)*1.6,3.6,4+Math.floor(i/3)*1.7]}><sphereGeometry args={[.65,8,6]}/><meshStandardMaterial color={i%2?'#ef9ec8':'#fff0b2'}/></mesh>)}</group>)}
 <Sign text="Auriho zámek" color="#ffcf86" position={[-5,.2,12]}/>
 </group>;}
function ValleyWaters({low}:{low:boolean}){const rockGeometry=useMemo(()=>new THREE.DodecahedronGeometry(.7,1),[]);useEffect(()=>()=>rockGeometry.dispose(),[rockGeometry]);const mist=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);const patches=useMemo(()=>{const p:WaterPatch[]=[];for(const c of CASCADES){p.push({p:[c.x,(c.top+c.bottom)/2,c.z],w:c.width,h:c.top-c.bottom,fall:true},{p:[c.x,c.top+.05,c.z-8],w:c.width+2,h:16},{p:[c.x,c.bottom+.1,c.z+9],w:c.width+7,h:18});}
 // A continuous visible watercourse between each cascade, descending with the valley.
 for(let i=0;i<CASCADES.length-1;i++){const a=CASCADES[i],b=CASCADES[i+1],n=26;for(let j=0;j<n;j++){const t=j/n;p.push({p:[a.x+(b.x-a.x)*t,a.bottom+(b.top-a.bottom)*t+.04,a.z+18+(b.z-a.z-27)*t],w:8,h:Math.abs(b.z-a.z)/n+2});}}
 p.push({p:[0,valleyElevation(BRIDGE.z)-12.8,BRIDGE.z],w:400,h:10});
 return p;},[]);const rocks=useMemo(()=>{const b:Block[]=[];for(const c of CASCADES)for(let i=0;i<18;i++){const side=i%2?1:-1,x=c.x+side*(c.width*.55+(i%3)*2.1),z=c.z-3-Math.floor(i/6)*3,h=c.top-c.bottom+5; b.push({p:[x,c.bottom+h*.45,z],s:[5.5,h,6],c:['#889b94','#a1aaa0','#788c8b'][i%3],r:side*.15});b.push({p:[x,c.top+1,z],s:[6,1.8,6],c:'#6b9c4b'});}return b;},[]);
 useFrame(({clock})=>{let n=0;for(const c of CASCADES)for(let i=0;i<(low?12:28);i++){const t=(clock.elapsedTime*.16+i*.137)%1;o.position.set(c.x+Math.sin(i*2.4+t)*c.width*.65,c.bottom+.5+t*3.5,c.z+2+t*6);o.scale.setScalar(.5+Math.sin(t*Math.PI)*1.7);o.updateMatrix();mist.current!.setMatrixAt(n++,o.matrix);}mist.current!.count=n;mist.current!.instanceMatrix.needsUpdate=true;});
 return <><Cubes blocks={rocks} geometry={rockGeometry}/><Water patches={patches}/><instancedMesh ref={mist} args={[undefined,undefined,112]} frustumCulled={false}><icosahedronGeometry args={[1,1]}/><meshBasicMaterial color="#d9fbf6" transparent opacity={.09} depthWrite={false}/></instancedMesh></>;
}
function ValleyBridge(){const y=valleyElevation(BRIDGE.z),blocks=useMemo(()=>{const b:Block[]=[];for(let i=0;i<26;i++)b.push({p:[BRIDGE.x,y+.1,BRIDGE.z-10+i*.8],s:[10.5,.35,.76],c:i%2?'#b78e59':'#cfab72'});for(const side of [-1,1]){for(let i=0;i<6;i++){const z=BRIDGE.z-10+i*4;b.push({p:[BRIDGE.x+side*4.9,y+1.2,z],s:[.32,2.3,.32],c:'#89643f'});}for(const h of [.85,1.9])b.push({p:[BRIDGE.x+side*4.9,y+h,BRIDGE.z],s:[.18,.17,21],c:'#d7b781'});for(const z of [BRIDGE.z-8,BRIDGE.z+8]){b.push({p:[BRIDGE.x+side*4.6,y-6.5,z],s:[1.6,13,2],c:'#a4afa0'});}}return b;},[y]);return <Cubes blocks={blocks}/>;}
function Footbridges(){return <>{VALLEY_FOOTBRIDGES.map(p=><group key={p.z} position={[p.x,p.y,p.z]}>{Array.from({length:27},(_,i)=><Box key={i} p={[-13+i,0,0]} s={[.96,.35,5.7]} c={i%2?'#b78f5d':'#d0af7b'}/>)}{[-1,1].map(side=><group key={side}><Box p={[0,1.3,side*2.6]} s={[27,.16,.16]} c="#dfc58d"/>{[-12,-6,0,6,12].map(x=><Box key={x} p={[x,.7,side*2.6]} s={[.2,1.5,.2]} c="#997246"/>)}</group>)}</group>)}</>;}
function ValleyLanterns(){const blocks=useMemo(()=>{const b:Block[]=[];for(let i=1;i<PATH.length;i++){const a=PATH[i-1],p=PATH[i],len=distance(a,p);for(let d=4;d<len;d+=18){const t=d/len,x=a.x+(p.x-a.x)*t+(i%2?4.5:-4.5),z=a.z+(p.z-a.z)*t,y=groundHeight({x,z});b.push({p:[x,y+1.7,z],s:[.2,3.4,.2],c:'#81603d'},{p:[x,y+3.1,z],s:[.85,.13,.85],c:'#9b7341'},{p:[x,y+2.7,z],s:[.55,.65,.55],c:'#ffe4a0'},{p:[x,y+2.3,z],s:[.8,.14,.8],c:'#9b7341'});}}return b;},[]);const glow=useMemo(()=>new THREE.MeshStandardMaterial({color:'#fff4cf',emissive:'#ffbc55',emissiveIntensity:1.8,roughness:.4}),[]);useEffect(()=>()=>glow.dispose(),[glow]);return <><Cubes blocks={blocks.filter(b=>b.c!=='#ffe4a0')}/><Cubes blocks={blocks.filter(b=>b.c==='#ffe4a0')} material={glow} castShadow={false}/></>;}
function CaveCascade({low}:{low:boolean}){
 const p=useMemo(()=>forestPoint({x:17,z:-40}),[]),y=groundHeight(p);
 const geometry=useMemo(()=>new THREE.IcosahedronGeometry(.65,2),[]),mossGeometry=useMemo(()=>new THREE.IcosahedronGeometry(.6,1),[]);
 const material=useMemo(()=>new THREE.MeshStandardMaterial({color:'#9daaa1',roughness:.97}),[]);
 useEffect(()=>()=>{geometry.dispose();mossGeometry.dispose();material.dispose();},[geometry,mossGeometry,material]);
 const rocks=useMemo(()=>{const back=forestPoint({x:17,z:-52}),b:Block[]=[{p:[back.x,groundHeight(back)+7.3,back.z],s:[9,16,11],c:'#869990',r:.2}];for(const side of [-1,1])for(let i=0;i<8;i++)b.push({p:[p.x+side*(3.4+i*.36),y+2.5+i*.85,p.z-3.2-i*.45],s:[3.8+(i%3)*.45,5.1+(i%2),4.6],c:i%2?'#9eaaa1':'#7d9089',r:side*i*.17});for(let i=0;i<5;i++)b.push({p:[p.x-4+i*2,y+9.6+Math.sin(i)*.35,p.z-6],s:[3.9,2,4.8],c:'#879c8c',r:i*.25});return b;},[p,y]);
 const moss=useMemo(()=>rocks.filter((_,i)=>i%2===0).map(b=>({...b,p:[b.p[0],b.p[1]+b.s[1]*.5-.15,b.p[2]] as Block['p'],s:[b.s[0]*1.08,.45,b.s[2]*.9] as Block['s'],c:'#7f9e47'})),[rocks]);
 const water=useMemo(()=>[{p:[p.x,y+4.7,p.z-1.1] as [number,number,number],w:5.5,h:8.8,fall:true},{p:[p.x,y+.05,p.z+3] as [number,number,number],w:7,h:7}],[p,y]);
 return <><Cubes blocks={rocks} geometry={geometry} material={material}/><Cubes blocks={moss} geometry={mossGeometry}/><Water patches={water} storybook/><CaveSpray x={p.x} y={y} z={p.z} low={low}/></>;
}
function CaveSpray({x,y,z,low}:{x:number;y:number;z:number;low:boolean}){
 const ref=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d')!,g=ctx.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(236,255,249,.5)');g.addColorStop(.4,'rgba(236,255,249,.2)');g.addColorStop(1,'rgba(236,255,249,0)');ctx.fillStyle=g;ctx.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);},[]);useEffect(()=>()=>texture.dispose(),[texture]);
 useFrame(({camera,clock})=>{const mesh=ref.current!;let n=0;for(let i=0;i<(low?14:36);i++){const t=(clock.elapsedTime*.22+i*.137)%1;o.position.set(x+Math.sin(i*2.4)*2.6,y+.2+Math.sin(t*Math.PI)*1.6,z-.5+t*3.2);o.quaternion.copy(camera.quaternion);o.scale.setScalar(.35+Math.sin(t*Math.PI)*1.6);o.updateMatrix();mesh.setMatrixAt(n++,o.matrix);}mesh.count=n;mesh.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={ref} args={[undefined,undefined,36]} frustumCulled={false}><planeGeometry/><meshBasicMaterial map={texture} transparent depthWrite={false} opacity={.65}/></instancedMesh>;
}
export function ValleyWorld({game,low}:{game:Game;low:boolean}){return <><Landscape game={game} low={low}/><ForestLook game={game} low={low}/><CloudSky game={game}/><RoyalCastle/><ValleyWaters low={low}/><ValleyBridge/><Footbridges/><ValleyLanterns/><CaveCascade low={low}/>{SHRINES.map((p,i)=><Sign key={i} text={['Světlo údolí','Píseň vodopádů','Zámecká zahrada'][i]} position={[p.x+5,groundHeight(p),p.z-4]} color="#e7c88a"/>)}<Sign text="Cesta k Auriho zámku" position={[5,0,2]} color="#f4cf8c"/><Sign text="Zámecká zahrada" position={[CHEST.x+6,groundHeight(CHEST),CHEST.z+9]} color="#f4b5d7"/></>;}
