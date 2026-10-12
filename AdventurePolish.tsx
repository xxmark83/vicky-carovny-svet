import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {weatherForWorld} from './weather';
import * as THREE from 'three';
import type {Game} from './game';
import {GEMS,SHRINES,CHEST,distance} from './map';
import {groundHeight,standingHeight} from './terrain';
import {VISTAS,vistaBlocks} from './vistas';
import {Cubes,boxGeometry} from './Voxel';
import {useHeroFadeMaterial} from './OcclusionMaterial';
export function AdventurePolish({game,low}:{game:Game;low:boolean}){
 const {camera}=useThree();const haze=useRef<(THREE.Mesh|null)[]>([]);
 const mist=useMemo(()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{tone:{value:new THREE.Color('#ffecc6')},strength:{value:.09}},vertexShader:`varying vec2 mistUV;void main(){mistUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`varying vec2 mistUV;uniform vec3 tone;uniform float strength;void main(){float soft=pow(max(0.0,1.0-length((mistUV-.5)*2.0)),1.5);gl_FragColor=vec4(tone,soft*strength);}`}),[]);
 const material=useHeroFadeMaterial(game),blocks=useMemo(()=>VISTAS.map((_,i)=>vistaBlocks(i)),[]);
 const paws=useRef<THREE.InstancedMesh>(null),rings=useRef<(THREE.Mesh|null)[]>([]),o=useMemo(()=>new THREE.Object3D(),[]);
 const nature=useRef<THREE.InstancedMesh>(null),glow=useMemo(()=>new THREE.MeshStandardMaterial({color:'#ffe58a',emissive:'#ffda73',emissiveIntensity:.7,roughness:.75}),[]);
 const gold=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffd25c',transparent:true,opacity:.9,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>{glow.dispose();gold.dispose();mist.dispose();},[glow,gold,mist]);
 useFrame(()=>{
  const t=game.elapsed+game.portalTime,w=weatherForWorld(game);mist.uniforms.tone.value.set(w.sun);mist.uniforms.strength.value=(low?.055:.09)*(1-w.overcast*.45);haze.current.forEach((m,i)=>{if(!m)return;m.visible=!game.flying&&distance(VISTAS[i],game.player)<58;m.quaternion.copy(camera.quaternion);});let n=0;
  if(game.mode==='playing'&&!game.flying&&!game.landing&&game.guide.until>game.elapsed){
   // The route follows collision-safe A*, so the hint does not point through trunks or water.
   let last={x:game.player.x,z:game.player.z};for(const p of game.guide.path){if(distance(last,p)<1.7)continue;if(distance(game.player,p)>11||n>84)break;const yaw=Math.atan2(p.x-last.x,p.z-last.z),side=Math.floor(n/4)%2?1:-1;
    for(const [dx,dz,sx,sz] of [[0,0,.22,.28],[-.13,.23,.085,.11],[0,.28,.085,.11],[.13,.23,.085,.11]]){o.position.set(p.x+Math.cos(yaw)*(side*.22+dx)+Math.sin(yaw)*dz,(game.inCave?0:standingHeight(p))+.14,p.z-Math.sin(yaw)*(side*.22+dx)+Math.cos(yaw)*dz);o.rotation.set(0,yaw,0);o.scale.set(sx,.025,sz);o.updateMatrix();paws.current!.setMatrixAt(n++,o.matrix);}last=p;
   }
  }paws.current!.count=n;paws.current!.instanceMatrix.needsUpdate=true;
  [...GEMS,...SHRINES].forEach((p,i)=>{const active=i<GEMS.length?!game.gems.has(i):!game.shrines.has(i-GEMS.length),d=distance(p,game.player),ring=rings.current[i]!;ring.visible=game.mode==='playing'&&!game.flying&&!game.inCave&&active&&d<7;ring.scale.setScalar(1+Math.sin(t*3+i)*.1);(ring.material as THREE.MeshBasicMaterial).opacity=.2+Math.max(0,Math.sin(t*3+i))*.25;});
  // Persistent living flowers after victory, with a spreading three-second reveal.
  let count=0;for(let i=0;i<(low?40:80);i++){const a=i*2.4,r=5+i%9*.7;if(game.mode!=='won'||r>game.finaleBloom*12)continue;const x=CHEST.x+Math.sin(a)*r,z=CHEST.z+Math.cos(a)*r,y=groundHeight({x,z});o.rotation.set(0,a,0);o.position.set(x,y+.65,z);o.scale.set(.1,1.2,.1);o.updateMatrix();nature.current!.setMatrixAt(count++,o.matrix);o.position.y=y+1.25+Math.sin(t*2+i)*.025;o.scale.set(.48,.14,.48);o.updateMatrix();nature.current!.setMatrixAt(count++,o.matrix);}
  nature.current!.count=count;nature.current!.instanceMatrix.needsUpdate=true;
 });
 return <>{VISTAS.map((p,i)=><mesh key={`mist-${i}`} ref={el=>{haze.current[i]=el;}} position={[p.x,groundHeight({x:p.x,z:p.z-10})+2,p.z-10]} material={mist}><planeGeometry args={[24,7]}/></mesh>)}{blocks.map((b,i)=><Cubes key={i} blocks={b} material={material}/>)}<instancedMesh ref={paws} args={[boxGeometry,gold,96]} frustumCulled={false}/>{[...GEMS,...SHRINES].map((p,i)=><mesh key={i} ref={el=>{rings.current[i]=el;}} position={[p.x,groundHeight(p)+.11,p.z]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[i<GEMS.length?1.05:2.6,i<GEMS.length?1.16:2.74,32]}/><meshBasicMaterial color={i<GEMS.length?'#7ae7ff':'#ffe18e'} transparent depthWrite={false}/></mesh>)}<instancedMesh ref={nature} args={[boxGeometry,glow,160]} frustumCulled={false}/></>;
}
