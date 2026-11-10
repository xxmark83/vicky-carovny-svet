import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {random} from './game';
import type {Game} from './game';
import {atmosphereForWorld,weatherForWorld} from './weather';
import {skyGradient} from './ambienceRates';
// 3.5.0 decoration only: nothing here touches collisions, the story clock or saved games.
const RAIN_BOX=26,RAIN_HEIGHT=17;
function Rain({game,low}:{game:Game;low:boolean}){
 const total=low?360:800,mesh=useRef<THREE.InstancedMesh>(null),strength=useRef(0),o=useMemo(()=>new THREE.Object3D(),[]);
 const drops=useMemo(()=>{const r=random(311);return Array.from({length:800},()=>({x:r()*RAIN_BOX,z:r()*RAIN_BOX,phase:r()*RAIN_HEIGHT,speed:13+r()*5}));},[]);
 const material=useMemo(()=>new THREE.MeshBasicMaterial({color:'#e3f1ff',transparent:true,opacity:0,depthWrite:false}),[]);useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera,clock},dt)=>{const m=mesh.current;if(!m)return;strength.current=THREE.MathUtils.damp(strength.current,atmosphereForWorld(game).rain,1.5,Math.min(dt,.1));const s=strength.current;m.visible=s>.02;if(!m.visible)return;
  const t=clock.elapsedTime,count=Math.max(1,Math.round(total*Math.min(1,s*1.3))),wrap=(v:number,c:number)=>((v-c)%RAIN_BOX+RAIN_BOX)%RAIN_BOX-RAIN_BOX/2+c;
  // Drops right in front of the lens would look like thick bars, so the nearest ones are hidden.
  // Drops keep their place in the world while the box of rain travels with the camera.
  for(let i=0;i<count;i++){const d=drops[i],fall=(t*d.speed+d.phase)%RAIN_HEIGHT;o.position.set(wrap(d.x,camera.position.x)+fall*.07,camera.position.y+RAIN_HEIGHT*.55-fall,wrap(d.z,camera.position.z));o.rotation.set(0,0,.07);const near=Math.hypot(o.position.x-camera.position.x,o.position.z-camera.position.z);o.scale.set(near<4.5?0:.028,.7,.028);o.updateMatrix();m.setMatrixAt(i,o.matrix);}
  m.count=count;m.instanceMatrix.needsUpdate=true;material.opacity=.5*Math.min(1,s*1.5);});
 return <instancedMesh ref={mesh} args={[undefined,undefined,total]} material={material} frustumCulled={false} visible={false}><boxGeometry/></instancedMesh>;
}
const BANDS=['#ff5a5a','#ff9d42','#ffe35c','#7fdc6b','#5cc8f2','#6f86ee','#b07be6'];
function rainbowGeometry(){const segments=64,inner=.86,positions:number[]=[],colors:number[]=[],index:number[]=[],c=new THREE.Color();
 for(let band=0;band<=BANDS.length;band++){const radius=1-(1-inner)*band/BANDS.length;for(let i=0;i<=segments;i++){const a=Math.PI*i/segments;positions.push(Math.cos(a)*radius,Math.sin(a)*radius,0);c.set(BANDS[Math.min(band,BANDS.length-1)]);
  // The outer and inner rims and both feet dissolve into the sky.
  const edge=band===0||band===BANDS.length?0:1,foot=Math.min(1,Math.sin(a)/.3);colors.push(c.r,c.g,c.b,edge*foot);}}
 for(let band=0;band<BANDS.length;band++)for(let i=0;i<segments;i++){const a=band*(segments+1)+i,b=a+segments+1;index.push(a,b,a+1,a+1,b,b+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));g.setIndex(index);return g;}
function Rainbow({game}:{game:Game}){
 const mesh=useRef<THREE.Mesh>(null),strength=useRef(0),geometry=useMemo(rainbowGeometry,[]);
 const material=useMemo(()=>new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false,side:THREE.DoubleSide}),[]);
 useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);
 useFrame((_,dt)=>{const m=mesh.current;if(!m)return;strength.current=THREE.MathUtils.damp(strength.current,atmosphereForWorld(game).rainbow,1.2,Math.min(dt,.1));m.visible=strength.current>.02;if(!m.visible)return;
  // It stands in front of the far hills, over the path ahead; near trees still cover it. After the victory a small one arches over the treasure.
  if(game.mode==='won'){const c=game.layout.chest;m.position.set(c.x,game.floor(c)-.3,c.z-2.6);m.scale.setScalar(6.4);}
  else{const p=game.player,size=64*(window.innerWidth/window.innerHeight<.9?.62:1);m.position.set(p.x+24,game.floor(p)-size*.15,Math.max(p.z-140,game.bounds.minZ-30));m.scale.setScalar(size);}
  material.opacity=strength.current*.78;});
 return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} visible={false} renderOrder={-1}/>;
}
// 3.6.0: the flat sky colour becomes a dome that deepens overhead and glows softly around the sun. Its horizon is the fog colour.
function SkyDome({game}:{game:Game}){
 const mesh=useRef<THREE.Mesh>(null),target=useMemo(()=>new THREE.Color(),[]);
 const material=useMemo(()=>new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{horizon:{value:new THREE.Color('#acd8ed')},zenith:{value:new THREE.Color('#5d9fe0')},sunColor:{value:new THREE.Color('#fff1c1')},sunDir:{value:new THREE.Vector3(0,.4,-1)},glow:{value:.3}},
  vertexShader:'varying vec3 dir;void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:`varying vec3 dir;uniform vec3 horizon;uniform vec3 zenith;uniform vec3 sunColor;uniform vec3 sunDir;uniform float glow;
void main(){vec3 d=normalize(dir);float h=smoothstep(0.02,0.62,d.y);vec3 c=mix(horizon,zenith,h*h*(3.0-2.0*h)*0.9);float s=max(dot(d,sunDir),0.0);c+=sunColor*(pow(s,10.0)*0.35+pow(s,90.0)*0.9)*glow;gl_FragColor=vec4(c,1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`}),[]);
 useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera,scene},dt)=>{const m=mesh.current;if(!m)return;m.position.copy(camera.position);const w=weatherForWorld(game),g=skyGradient(w),u=material.uniforms,ease=Math.min(1,dt*1.5);
  if(scene.background instanceof THREE.Color)u.horizon.value.copy(scene.background);u.zenith.value.lerp(target.set(g.zenith),ease);u.sunColor.value.set(w.sun);u.glow.value=THREE.MathUtils.damp(u.glow.value,g.glow,1.5,dt);
  u.sunDir.value.set(game.player.x+w.sunX*4-camera.position.x,230+w.daylight*80-camera.position.y,game.player.z-600-camera.position.z).normalize();});
 return <mesh ref={mesh} material={material} frustumCulled={false} renderOrder={-1000}><sphereGeometry args={[900,24,12]}/></mesh>;
}
export function SkyWeather({game,low}:{game:Game;low:boolean}){return <><SkyDome game={game}/><Rain game={game} low={low}/><Rainbow game={game}/></>;}
