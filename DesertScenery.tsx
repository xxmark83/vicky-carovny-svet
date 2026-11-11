import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Game} from './game';
import {random} from './map';
import {DESERT_OBSTACLES,DESERT_SHRINES,desertDune} from './desert';
import {useHeroFadeMaterial} from './OcclusionMaterial';
import {atmosphereForWorld,sandForWorld} from './weather';
// 3.19.0 decoration only: the things that stand on the dunes get the rounded look of the forest.
// Every cactus, rock and palm stays exactly where it was and blocks exactly what it blocked before.
const tmp=new THREE.Color(),mat=new THREE.Matrix4(),quat=new THREE.Quaternion(),euler=new THREE.Euler();
type Paint=(x:number,y:number,z:number,c:THREE.Color)=>void;
// Colours every vertex from its own position, before the piece is moved into the world.
function tint(g:THREE.BufferGeometry,paint:Paint){const p=g.getAttribute('position'),a=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){paint(p.getX(i),p.getY(i),p.getZ(i),tmp);a[i*3]=tmp.r;a[i*3+1]=tmp.g;a[i*3+2]=tmp.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));g.deleteAttribute('uv');return g;}
// One colour per triangle, chosen from the triangle's centre: crisp facets for rock.
function facet(source:THREE.BufferGeometry,paint:Paint){const g=source.index?source.toNonIndexed():source,p=g.getAttribute('position'),a=new Float32Array(p.count*3);for(let i=0;i<p.count;i+=3){paint((p.getX(i)+p.getX(i+1)+p.getX(i+2))/3,(p.getY(i)+p.getY(i+1)+p.getY(i+2))/3,(p.getZ(i)+p.getZ(i+1)+p.getZ(i+2))/3,tmp);for(let k=0;k<3;k++){a[(i+k)*3]=tmp.r;a[(i+k)*3+1]=tmp.g;a[(i+k)*3+2]=tmp.b;}}g.setAttribute('color',new THREE.BufferAttribute(a,3));g.deleteAttribute('uv');g.computeVertexNormals();return g;}
const place=(g:THREE.BufferGeometry,x:number,y:number,z:number,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx)=>g.applyMatrix4(mat.compose(new THREE.Vector3(x,y,z),quat.setFromEuler(euler.set(rx,ry,rz)),new THREE.Vector3(sx,sy,sz)));
const wobble=(x:number,y:number,z:number,seed:number)=>{const v=Math.sin(x*12.9898+y*78.233+z*37.719+seed)*43758.5453;return v-Math.floor(v);};
const merged=(parts:THREE.BufferGeometry[])=>{const g=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());g.computeBoundingSphere();return g;};

// Cacti: ribbed round columns with elbowed arms and a flower on every tip.
const CACTUS=[['#3d8c5c','#62b97c'],['#35805a','#57ab78'],['#47996a','#74c889']],PETALS=['#f7a3c4','#ffd76e','#fff3f6','#ff8fb0'];
function cactusParts(o:{x:number;z:number;height:number;variant:number},low:boolean){
 const parts:THREE.BufferGeometry[]=[],base=desertDune(o)-.15,h=o.height,[dark,light]=CACTUS[o.variant%3].map(c=>new THREE.Color(c)),turn=o.x*1.3+o.z*.7,radial=low?6:8,ribs=radial/2;
 const column=(r:number,from:number,to:number,x:number,z:number,sideways=0)=>{const g=tint(new THREE.CapsuleGeometry(r,Math.max(.05,to-from-r*2),low?2:3,radial),(px,_y,pz,c)=>{c.copy(dark).lerp(light,.5+.5*Math.cos(Math.atan2(pz,px)*ribs));});return sideways?place(g,x,from,z,0,-sideways,Math.PI/2):place(g,x,(from+to)/2,z);};
 const flower=(x:number,y:number,z:number,n:number)=>{const petal=new THREE.Color(PETALS[n%PETALS.length]);parts.push(place(tint(new THREE.SphereGeometry(.24,6,4),(_x,py,_z,c)=>{c.copy(petal).lerp(new THREE.Color('#ffe28a'),py>.12?.8:0);}),x,y+.05,z,0,0,0,1,.55,1));};
 const barrel=o.variant%5===0,trunk=barrel?.44:.33;parts.push(column(trunk,base,base+h,o.x,o.z));flower(o.x,base+h,o.z,o.variant);
 const arms=barrel?0:o.variant%5===2||o.variant%5===4?1:2;
 for(let k=0;k<arms;k++){const a=turn+k*Math.PI+(k?.5:0),dx=Math.cos(a),dz=Math.sin(a),at=base+h*(.34+k*.14),reach=.66,top=at+h*(.34-k*.06);
  const elbow=tint(new THREE.CapsuleGeometry(.2,reach,low?2:3,radial),(px,_y,pz,c)=>{c.copy(dark).lerp(light,.5+.5*Math.cos(Math.atan2(pz,px)*ribs));});
  parts.push(place(elbow,o.x+dx*reach*.5,at,o.z+dz*reach*.5,0,-a,Math.PI/2),column(.2,at-.2,top,o.x+dx*reach,o.z+dz*reach));flower(o.x+dx*reach,top,o.z+dz*reach,o.variant+k+1);}
 return parts;
}
// Rocks: stacked sandstone boulders with coloured strata.
const STRATA=['#d78766','#e5ab81','#c97a5e','#eab98d'].map(c=>new THREE.Color(c)),ROCK_TOP=new THREE.Color('#f8d9a6');
function rockParts(o:{x:number;z:number;radius:number;height:number;variant:number}){
 const base=desertDune(o)-.2,seed=o.x*3.1+o.z*1.7,h=o.height,r=o.radius;
 const boulder=(scale:[number,number,number],x:number,y:number,z:number,spin:number,s:number)=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){const x0=Math.round(p.getX(i)*50)/50,y0=Math.round(p.getY(i)*50)/50,z0=Math.round(p.getZ(i)*50)/50,k=.84+wobble(x0,y0,z0,s)*.3;p.setXYZ(i,x0*k,y0*k,z0*k);}
  place(g,x,y,z,0,spin,0,...scale);return facet(g,(_x,py,_z,c)=>{const t=(py-base)/h;c.copy(t>.86?ROCK_TOP:STRATA[Math.abs(Math.floor((py-base)/1.15+o.variant))%STRATA.length]).offsetHSL(0,0,(wobble(_x,py,_z,s)-.5)*.05);});};
 return [boulder([r*1.12,h*.6,r],o.x,base+h*.45,o.z,seed,seed),boulder([r*.7,h*.36,r*.66],o.x+Math.cos(seed)*r*.3,base+h*.86,o.z+Math.sin(seed)*r*.3,seed*2,seed+7),boulder([r*.5,h*.2,r*.45],o.x-Math.cos(seed)*r*.85,base+h*.14,o.z-Math.sin(seed)*r*.6,seed*3,seed+13)];
}
export function DesertPlants({game,low}:{game:Game;low:boolean}){
 const material=useHeroFadeMaterial(game);material.vertexColors=true;
 // Bands along the trail, so whole stretches behind the camera are skipped.
 const bands=useMemo(()=>{const soft=new Map<number,THREE.BufferGeometry[]>(),hard=new Map<number,THREE.BufferGeometry[]>();
  for(const o of DESERT_OBSTACLES){if(o.variant===9)continue;const key=Math.floor(-o.z/60),into=o.kind==='rock'?hard:soft;if(!into.has(key))into.set(key,[]);into.get(key)!.push(...(o.kind==='rock'?rockParts(o):cactusParts(o,low)));}
  return [...soft.values(),...hard.values()].map(merged);},[low]);
 useEffect(()=>()=>bands.forEach(g=>g.dispose()),[bands]);
 return <>{bands.map((g,i)=><mesh key={i} geometry={g} material={material} castShadow receiveShadow/>)}</>;
}

// The far wall of the desert: terraced sandstone mesas instead of stacked cubes. Same places, same heights.
const CLIFF=['#c7866d','#d79576','#b9735f','#e0a585'].map(c=>new THREE.Color(c)),CLIFF_TOP=new THREE.Color('#f1cda2');
export type Peak={x:number;z:number;peak:number;width:number};
export function Mesas({peaks}:{peaks:Peak[]}){
 const geometry=useMemo(()=>merged(peaks.map((m,n)=>{const g=new THREE.CylinderGeometry(1,1,1,10,8),p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){const t=p.getY(i)+.5,x=p.getX(i),z=p.getZ(i),round=Math.hypot(x,z);if(round<.01){p.setY(i,t*m.peak);continue;}
   // Ledges every quarter of the height, each a little rougher than the last.
   const a=Math.round(Math.atan2(z,x)*10/(Math.PI*2)),level=Math.round(t*8),step=.6*Math.floor(t*4)/4+.4*t,radius=m.width*.48*(1-.62*step)*(.9+wobble(a,level,n,n*5.1)*.2);p.setXYZ(i,x/round*radius,t*m.peak,z/round*radius);}
  place(g,m.x,-1,m.z,0,n*1.7,0);return facet(g,(_x,py,_z,c)=>{const t=py/m.peak;c.copy(t>.84?CLIFF_TOP:CLIFF[Math.abs(Math.floor(py/7.5+n))%CLIFF.length]).offsetHSL(0,0,(wobble(_x,py,_z,n)-.5)*.045);});})),[peaks]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial vertexColors roughness={1}/></mesh>;
}

// Palms: a leaning ringed trunk and a crown of arched fronds that sways in the wind.
function crownGeometry(low:boolean){const parts:THREE.BufferGeometry[]=[],mid=new THREE.Color('#9ad873'),rim=new THREE.Color('#3d9a5e'),dry=new THREE.Color('#d7c56a'),steps=low?4:6;
 const frond=(angle:number,length:number,lift:number,droop:number,shade:number)=>{const positions:number[]=[],colors:number[]=[],index:number[]=[];
  for(let s=0;s<=steps;s++){const t=s/steps,along=.15+length*t,y=length*(lift*t-droop*t*t),w=.5*Math.pow(1-t,.55)*Math.min(1,t*5+.3);
   for(const side of [-1,0,1]){positions.push(along,y+(side?-.1:.07),side*w);tmp.copy(side?rim:mid).lerp(dry,t>.8?(t-.8)*2:0).offsetHSL(0,0,shade);colors.push(tmp.r,tmp.g,tmp.b);}
   if(s<steps){const a=s*3;index.push(a,a+1,a+3,a+1,a+4,a+3,a+1,a+2,a+4,a+2,a+5,a+4);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(index);g.rotateY(angle);g.computeVertexNormals();return g;};
 for(let j=0;j<8;j++)parts.push(frond(j*Math.PI/4+.2,3.3+j%3*.3,.3,.66,j%2?-.03:.02));
 for(let j=0;j<5;j++)parts.push(frond(j*Math.PI*2/5+.6,2.2,.7,.5,.05));
 for(let j=0;j<3;j++)parts.push(place(tint(new THREE.SphereGeometry(.22,6,5),(_x,py,_z,c)=>{c.set('#8a5a33').offsetHSL(0,0,py*.25);}),Math.cos(j*2.1)*.28,-.3,Math.sin(j*2.1)*.28));
 return merged(parts);}
function oasisPalms(p:{x:number;z:number}){return Array.from({length:11},(_,i)=>{const a=i*2.4,r=7+i%3*1.4,x=p.x+Math.sin(a)*r,z=p.z+Math.cos(a)*r,h=5+i%3,lean=.7+i%4*.3,dir=a+1.1;return {x,z,y:desertDune({x,z}),h,lx:Math.cos(dir)*lean,lz:Math.sin(dir)*lean,phase:i*1.9};});}
const BARK=['#ad8153','#c59960'].map(c=>new THREE.Color(c));
function trunkGeometry(palms:ReturnType<typeof oasisPalms>){return merged(palms.map(t=>{const g=new THREE.CylinderGeometry(.2,.34,t.h+.3,7,8),p=g.getAttribute('position');tint(g,(_x,py,_z,c)=>{c.copy(BARK[Math.abs(Math.round((py/(t.h+.3)+.5)*8))%2]);});
 for(let i=0;i<p.count;i++){const k=p.getY(i)/(t.h+.3)+.5;p.setX(i,p.getX(i)+t.lx*k*k);p.setZ(i,p.getZ(i)+t.lz*k*k);}g.computeVertexNormals();return place(g,t.x,t.y+t.h/2-.15,t.z);}));}

const WATER_VERTEX=`varying vec2 vUv;
#include <fog_pars_vertex>
void main(){vUv=uv;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`;
// A pond with a wavy shore, rings that travel outward, foam at the edge and glints of sky. Dry, it is a patch of damp sand.
const WATER_FRAGMENT=`uniform float time;uniform float fill;uniform float light;varying vec2 vUv;
#include <common>
#include <fog_pars_fragment>
void main(){vec2 q=vUv*2.0-1.0;float r=length(q),a=atan(q.y,q.x),shore=0.86+0.07*sin(a*3.0+1.0)+0.04*sin(a*7.0);
float depth=smoothstep(shore,0.0,r);vec3 c=mix(vec3(0.56,0.93,0.86),vec3(0.1,0.55,0.74),depth);
float ring=sin(r*26.0-time*2.2+sin(a*4.0+time*0.6))*0.5+0.5;c+=ring*ring*0.07;
c+=smoothstep(0.82,1.0,sin(q.x*17.0+time*1.3)*sin(q.y*19.0-time*1.1))*0.35;
c=mix(c,vec3(1.0),smoothstep(shore-0.1,shore-0.02,r)*(0.6+0.4*sin(a*24.0+time*1.5))*0.45);
c=mix(vec3(0.72,0.58,0.38),c*light,fill);gl_FragColor=vec4(c,(1.0-smoothstep(shore-0.05,shore,r))*mix(0.3,0.93,fill));
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
}`;
const REEDS=20;
export function Oasis({game,index,low}:{game:Game;index:number;low:boolean}){
 const p=DESERT_SHRINES[index],pond={x:p.x+4,z:p.z-3},grove=useRef<THREE.Group>(null),crowns=useRef<(THREE.Mesh|null)[]>([]),reeds=useRef<THREE.InstancedMesh>(null),fill=useRef(game.shrines.has(index)?1:0),o=useMemo(()=>new THREE.Object3D(),[]);
 const palms=useMemo(()=>oasisPalms(p),[p]),trunks=useMemo(()=>trunkGeometry(palms),[palms]),crown=useMemo(()=>crownGeometry(low),[low]);
 const bark=useHeroFadeMaterial(game),leaf=useHeroFadeMaterial(game);bark.vertexColors=true;leaf.vertexColors=true;leaf.side=THREE.DoubleSide;
 const water=useMemo(()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{time:{value:0},fill:{value:0},light:{value:1}}]),vertexShader:WATER_VERTEX,fragmentShader:WATER_FRAGMENT}),[]);
 const stems=useMemo(()=>{const r=random(1901+index),away=Math.atan2(3,-4);return Array.from({length:REEDS},()=>{let a=r()*Math.PI*2;if(Math.abs(Math.atan2(Math.sin(a-away),Math.cos(a-away)))<.8)a+=Math.PI;const d=3.7+r()*.9;return {x:pond.x+Math.cos(a)*d,z:pond.z+Math.sin(a)*d,h:.7+r()*.9,phase:r()*6};});},[index,pond.x,pond.z]);
 useEffect(()=>()=>{trunks.dispose();},[trunks]);useEffect(()=>()=>{crown.dispose();},[crown]);useEffect(()=>()=>{water.dispose();},[water]);
 useFrame(({clock},delta)=>{const dt=Math.min(delta,.1),t=clock.elapsedTime,gust=sandForWorld(game);fill.current=THREE.MathUtils.damp(fill.current,game.shrines.has(index)?1:0,1.6,dt);const f=fill.current;
  // A dry grove droops a little; water lifts it again.
  if(grove.current)grove.current.scale.y=.8+.2*f;water.uniforms.time.value=t;water.uniforms.fill.value=f;water.uniforms.light.value=1-.4*atmosphereForWorld(game).glow;
  palms.forEach((palm,i)=>{const m=crowns.current[i];if(!m)return;const sway=.035+gust*.09;m.rotation.set(Math.sin(t*1.2+palm.phase)*sway+(1-f)*.22,palm.phase,Math.cos(t*.9+palm.phase)*sway+gust*.08,'YXZ');});
  const m=reeds.current;if(m){m.visible=f>.03;if(m.visible){stems.forEach((s,i)=>{o.position.set(s.x,.02+s.h*f/2,s.z);o.rotation.set(Math.sin(t*1.5+s.phase)*(.06+gust*.12),0,Math.cos(t*1.2+s.phase)*(.06+gust*.12));o.scale.set(1,s.h*f,1);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.instanceMatrix.needsUpdate=true;}}});
 return <><group ref={grove}><mesh geometry={trunks} material={bark} castShadow receiveShadow/>{palms.map((palm,i)=><mesh key={i} ref={el=>{crowns.current[i]=el;}} geometry={crown} material={leaf} position={[palm.x+palm.lx,palm.y+palm.h,palm.z+palm.lz]} castShadow/>)}</group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[pond.x,.09,pond.z]} material={water}><circleGeometry args={[4.3,40]}/></mesh>
  <instancedMesh ref={reeds} args={[undefined,undefined,REEDS]} frustumCulled={false} visible={false}><coneGeometry args={[.07,1,5]}/><meshStandardMaterial color="#5fae62" roughness={.9}/></instancedMesh></>;
}

// Fire bowls burn on the six temple pillars and the capstone of the pyramid glows; both grow at dusk. Flames sway slowly and never flash.
const PILLARS=[-1,1].flatMap(side=>[-279,-289,-308].map(z=>({x:side*10,z})));
export function DesertFires({game}:{game:Game}){
 const flames=useRef<THREE.InstancedMesh>(null),halos=useRef<THREE.InstancedMesh>(null),cap=useRef<THREE.Mesh>(null),o=useMemo(()=>new THREE.Object3D(),[]);
 const bowls=useMemo(()=>PILLARS.map(p=>({...p,y:desertDune(p)+8.35})),[]),warm=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffb45c',transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>warm.dispose(),[warm]);
 useFrame(({clock})=>{const t=clock.elapsedTime,dark=atmosphereForWorld(game).glow,f=flames.current,h=halos.current;if(!f||!h)return;
  bowls.forEach((b,i)=>{for(let k=0;k<2;k++){const lick=1+Math.sin(t*(3.1+k)+i*1.7+k)*.16;o.position.set(b.x+Math.sin(t*2.3+i+k*2)*.05,b.y+.55+.35*lick*(k?.6:1),b.z);o.rotation.set(0,t*.5+i,Math.sin(t*1.9+i)*.08);o.scale.set(k?.26:.42,(k?.75:1.15)*lick,k?.26:.42);o.updateMatrix();f.setMatrixAt(i*2+k,o.matrix);f.setColorAt(i*2+k,tmp.set(k?'#fff0a8':'#ff9a3c'));}
   o.position.set(b.x,b.y+.8,b.z);o.rotation.set(0,0,0);o.scale.setScalar(1.6+Math.sin(t*2.2+i)*.12);o.updateMatrix();h.setMatrixAt(i,o.matrix);});
  f.instanceMatrix.needsUpdate=true;if(f.instanceColor)f.instanceColor.needsUpdate=true;h.instanceMatrix.needsUpdate=true;warm.opacity=.07+dark*.25;
  if(cap.current){(cap.current.material as THREE.MeshBasicMaterial).opacity=.1+dark*.3+Math.sin(t*1.3)*.03;cap.current.scale.setScalar(2.6+Math.sin(t*.9)*.2);}});
 return <>{bowls.map((b,i)=><mesh key={i} position={[b.x,b.y+.1,b.z]} castShadow><cylinderGeometry args={[.62,.36,.42,10]}/><meshStandardMaterial color="#b9884a" roughness={.6} metalness={.35}/></mesh>)}
  <instancedMesh ref={flames} args={[undefined,undefined,bowls.length*2]} frustumCulled={false}><coneGeometry args={[.5,1,7]}/><meshBasicMaterial toneMapped={false} transparent opacity={.92}/></instancedMesh>
  <instancedMesh ref={halos} args={[undefined,warm,bowls.length]} frustumCulled={false}><icosahedronGeometry args={[1,1]}/></instancedMesh>
  <mesh ref={cap} position={[52,20,-117]}><icosahedronGeometry args={[1,2]}/><meshBasicMaterial color="#ffe39a" transparent opacity={.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/></mesh></>;
}
