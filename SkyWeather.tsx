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
// 3.18.0: soft clouds drift across the dome and thicken with the weather, the sun has a disc, and on clear forest nights a slow aurora sways in the north.
const SKY_FRAGMENT=`varying vec3 dir;uniform vec3 horizon;uniform vec3 zenith;uniform vec3 sunColor;uniform vec3 sunDir;uniform float glow;uniform float dusk;uniform float time;uniform float cover;uniform float grey;uniform float night;uniform float aurora;uniform float disc;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<OCTAVES;i++){v+=a*noise(p);p=p*2.03+vec2(17.0,9.0);a*=0.5;}return v;}
void main(){vec3 d=normalize(dir);float h=smoothstep(0.02,0.62,d.y);vec3 c=mix(horizon,zenith,h*h*(3.0-2.0*h)*0.9);float low=1.0-smoothstep(0.0,0.42,d.y);c+=vec3(1.0,0.52,0.18)*dusk*low*low*0.55;float s=max(dot(d,sunDir),0.0);c+=sunColor*(pow(s,10.0)*0.35+pow(s,90.0)*0.9)*glow;c+=sunColor*smoothstep(0.9986,0.9993,s)*disc*1.5;
if(aurora>0.01&&d.y>0.0){float x=atan(d.x,-d.z),base=0.15+0.06*sin(x*2.0+time*0.07),band=pow(0.5+0.5*sin(x*3.0+time*0.16+sin(x*7.0-time*0.11)*0.6),3.0),rise=smoothstep(base,base+0.05,d.y)*(1.0-smoothstep(base+0.05,base+0.5,d.y)),rays=0.62+0.38*sin(x*58.0+sin(time*0.5+x*9.0)*2.0);c+=mix(vec3(0.25,1.0,0.6),vec3(0.75,0.4,1.0),smoothstep(base,base+0.42,d.y))*band*rise*rays*aurora*smoothstep(-0.25,0.45,-d.z)*0.85;}
if(d.y>0.015){vec2 uv=d.xz/(d.y+0.5)*1.5+time*vec2(0.012,0.005);float n=fbm(uv),dens=smoothstep(1.0-cover,1.36-cover,n);
#ifdef LIT_CLOUDS
float lit=clamp((n-fbm(uv+sunDir.xz*0.16))*2.0+0.78,0.0,1.0);
#else
float lit=0.85;
#endif
vec3 bright=mix(vec3(1.0),sunColor,0.35)+vec3(0.9,0.36,0.2)*dusk*0.55,shade=mix(zenith,vec3(0.86,0.9,0.97),0.72);vec3 cc=mix(mix(shade,bright,lit),vec3(0.66,0.69,0.74)*(0.75+lit*0.25),grey);cc=mix(cc,cc*vec3(0.3,0.34,0.55),night*0.82);c=mix(c,cc,dens*smoothstep(0.015,0.2,d.y)*0.93);}
gl_FragColor=vec4(c,1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
function SkyDome({game,low}:{game:Game;low:boolean}){
 const mesh=useRef<THREE.Mesh>(null),target=useMemo(()=>new THREE.Color(),[]);
 const material=useMemo(()=>new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,defines:low?{OCTAVES:3}:{OCTAVES:4,LIT_CLOUDS:''},uniforms:{horizon:{value:new THREE.Color('#acd8ed')},zenith:{value:new THREE.Color('#5d9fe0')},sunColor:{value:new THREE.Color('#fff1c1')},sunDir:{value:new THREE.Vector3(0,.4,-1)},glow:{value:.3},dusk:{value:0},time:{value:0},cover:{value:.42},grey:{value:0},night:{value:0},aurora:{value:0},disc:{value:1}},
  vertexShader:'varying vec3 dir;void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:SKY_FRAGMENT}),[low]);
 useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera,scene},delta)=>{const m=mesh.current;if(!m)return;m.position.copy(camera.position);const dt=Math.min(delta,.1),w=weatherForWorld(game),g=skyGradient(w),u=material.uniforms,ease=Math.min(1,dt*1.5);
  if(scene.background instanceof THREE.Color)u.horizon.value.copy(scene.background);u.zenith.value.lerp(target.set(g.zenith),ease);u.sunColor.value.set(w.sun);u.glow.value=THREE.MathUtils.damp(u.glow.value,g.glow,1.5,dt);u.dusk.value=THREE.MathUtils.damp(u.dusk.value,g.dusk,1.2,dt);
  // Clouds keep drifting in the menu and the film; a pause holds them still.
  if(game.mode!=='paused')u.time.value+=dt;u.cover.value=THREE.MathUtils.damp(u.cover.value,(game.desert?.47:.52)+w.overcast*.36,1,dt);u.grey.value=THREE.MathUtils.damp(u.grey.value,w.overcast*.85,1,dt);u.night.value=THREE.MathUtils.damp(u.night.value,g.night,1.2,dt);u.aurora.value=THREE.MathUtils.damp(u.aurora.value,game.desert?0:g.night,.6,dt);u.disc.value=(1-u.night.value)*(1-w.overcast*.9);
  u.sunDir.value.set(game.player.x+w.sunX*4-camera.position.x,230+w.daylight*80-camera.position.y,game.player.z-600-camera.position.z).normalize();});
 return <mesh ref={mesh} material={material} frustumCulled={false} renderOrder={-1000}><sphereGeometry args={[900,24,12]}/></mesh>;
}
// 3.16.0: stars, a moon and now and then a shooting star, only while the sun is at its lowest.
function NightSky({game,low}:{game:Game;low:boolean}){
 const group=useRef<THREE.Group>(null),moon=useRef<THREE.Group>(null),streak=useRef<THREE.Mesh>(null),night=useRef(0),shot=useRef({wait:14,t:9,x:0,y:0,z:0});
 const stars=useMemo(()=>{const r=random(1602),n=low?140:320,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=r()*Math.PI*2,e=Math.asin(.12+r()*.86);p[i*3]=Math.cos(a)*Math.cos(e)*820;p[i*3+1]=Math.sin(e)*820;p[i*3+2]=Math.sin(a)*Math.cos(e)*820;}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return g;},[low]);
 const dots=useMemo(()=>new THREE.PointsMaterial({color:'#fff8e2',size:2.4,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false}),[]),pale=useMemo(()=>new THREE.MeshBasicMaterial({color:'#fff6d8',transparent:true,opacity:0,fog:false,toneMapped:false,depthWrite:false}),[]),halo=useMemo(()=>new THREE.MeshBasicMaterial({color:'#cfd8ff',transparent:true,opacity:0,fog:false,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>{stars.dispose();dots.dispose();pale.dispose();halo.dispose();},[stars,dots,pale,halo]);
 useFrame(({camera,clock},dt)=>{const g=group.current;if(!g)return;const w=weatherForWorld(game);night.current=THREE.MathUtils.damp(night.current,skyGradient(w).night,1.2,Math.min(dt,.1));const n=night.current;g.visible=n>.02;if(!g.visible)return;g.position.copy(camera.position);
  dots.opacity=n*(.75+Math.sin(clock.elapsedTime*1.7)*.12);pale.opacity=n;halo.opacity=n*.16;moon.current!.position.set(-w.sunX*5-140,300,-560);
  const s=shot.current;s.wait-=dt;if(s.wait<=0&&n>.7){s.wait=18+Math.random()*26;s.t=0;s.x=-300+Math.random()*500;s.y=330+Math.random()*120;s.z=-600;}s.t+=dt;const m=streak.current!;m.visible=s.t<.9;if(m.visible){m.position.set(s.x+s.t*260,s.y-s.t*110,s.z);(m.material as THREE.MeshBasicMaterial).opacity=Math.sin(s.t/.9*Math.PI)*n;}});
 return <group ref={group} visible={false} renderOrder={-900}><points geometry={stars} material={dots} frustumCulled={false}/><group ref={moon}><mesh material={pale}><sphereGeometry args={[26,20,14]}/></mesh><mesh material={halo}><sphereGeometry args={[60,16,12]}/></mesh></group><mesh ref={streak} visible={false} rotation={[0,0,-.4]}><boxGeometry args={[46,1.4,1.4]}/><meshBasicMaterial color="#ffffff" transparent opacity={0} fog={false} depthWrite={false} toneMapped={false}/></mesh></group>;
}
export function SkyWeather({game,low}:{game:Game;low:boolean}){return <><SkyDome game={game} low={low}/><NightSky game={game} low={low}/><Rain game={game} low={low}/><Rainbow game={game}/></>;}
