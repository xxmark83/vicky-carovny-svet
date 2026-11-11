import {memo,useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {groundHeight} from './terrain';
import {canopyLayout,sunShaftSpots,CANOPY_COLORS} from './canopyLayout';
import type {Puff} from './canopyLayout';
import {weatherForWorld,atmosphereForWorld} from './weather';
import {skyGradient} from './ambienceRates';
import {SHRINES,NEW_GLADES} from './map';
import {FOREST_COTTAGES} from './forestPlaces';
// 3.8.0 forest decoration: blossom, moss and vines as one faceted puff, instanced and culled by distance.
const Cell=memo(function Cell({puffs,geometry,material,meshRef}:{puffs:Puff[];geometry:THREE.BufferGeometry;material:THREE.Material;meshRef:(m:THREE.InstancedMesh|null)=>void}){const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const m=ref.current!,o=new THREE.Object3D(),c=new THREE.Color();puffs.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.rotation.set(0,i*1.7,0);o.scale.set(p.size,p.size*p.flat,p.size);o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,c.set(CANOPY_COLORS[p.color]));});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere();},[puffs]);
 return <instancedMesh ref={m=>{ref.current=m;meshRef(m);}} args={[geometry,material,puffs.length]} receiveShadow/>;});
export function Canopy({game,low}:{game:Game;low:boolean}){
 const cells=useMemo(()=>canopyLayout(game.layout.obstacles,low),[game.layout,low]),geometry=useMemo(()=>new THREE.IcosahedronGeometry(.5,0),[]),material=useMemo(()=>new THREE.MeshLambertMaterial({emissive:'#3a2030',emissiveIntensity:.25}),[]),meshes=useRef<(THREE.InstancedMesh|null)[]>([]);
 useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);
 useFrame(({camera})=>{const reach=low?90:game.flying||game.mode==='intro'?260:170;cells.forEach((c,i)=>{const m=meshes.current[i];if(m)m.visible=Math.hypot(c.x-camera.position.x,c.z-camera.position.z)<reach;});});
 return <>{cells.map((c,i)=><Cell key={c.key} puffs={c.puffs} geometry={geometry} material={material} meshRef={m=>{meshes.current[i]=m;}}/>)}</>;
}
// Soft beams of sunlight between the trunks. They lean with the sun and fade under cloud, in rain and at dusk.
export function SunShafts({game,low}:{game:Game;low:boolean}){
 const mesh=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]),axis=useMemo(()=>new THREE.Vector3(),[]),up=useMemo(()=>new THREE.Vector3(0,1,0),[]),lean=useMemo(()=>new THREE.Quaternion(),[]);
 const material=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffe9b2',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}),[]);useEffect(()=>()=>material.dispose(),[material]);
 useFrame(()=>{const m=mesh.current;if(!m)return;const w=weatherForWorld(game),strength=(low?.012:.018)*(1+skyGradient(w).dusk*.9)*(1-w.overcast*.92)*Math.max(0,w.daylight-.15)*(1-atmosphereForWorld(game).rain);m.visible=strength>.002&&!game.flying&&game.mode!=='building';if(!m.visible)return;
  material.opacity=strength;material.color.set(w.sun);axis.set(w.sunX,w.sunY,w.sunZ).normalize();lean.setFromUnitVectors(up,axis);const spots=sunShaftSpots(game.player,low);
  spots.forEach((s,i)=>{o.position.set(s.x,groundHeight(s),s.z).addScaledVector(axis,8);o.quaternion.copy(lean);o.scale.set(s.fade,1,s.fade);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.count=spots.length;m.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[undefined,material,49]} frustumCulled={false} visible={false}><cylinderGeometry args={[.2,.95,17,8,1,true]}/></instancedMesh>;
}

// 3.16.0: at night cottage windows spill warm light, awakened shrines shine and the big mushrooms of the glades glow.
export function NightGlow({game}:{game:Game}){
 const spots=useMemo(()=>{const list:{x:number;y:number;z:number;size:number;color:string;shrine?:number}[]=[];for(const h of FOREST_COTTAGES)list.push({x:h.x,y:groundHeight(h)+1.9,z:h.z,size:5.2,color:'#ffb85c'});SHRINES.forEach((p,i)=>list.push({x:p.x,y:groundHeight(p)+2,z:p.z,size:3.4,color:'#9dffd0',shrine:i}));for(const p of NEW_GLADES)if(p.kind===0||p.kind===3)for(let i=0;i<9;i++){const x=p.x+Math.sin(i*2.4)*5,z=p.z+Math.cos(i*2.4)*5;list.push({x,y:groundHeight({x,z})+1.3,z,size:1.9,color:p.kind===0?'#ff9ec4':'#8ff0dc'});}return list;},[]);
 const mesh=useRef<THREE.InstancedMesh>(null),o=useMemo(()=>new THREE.Object3D(),[]),tone=useMemo(()=>new THREE.Color(),[]),night=useRef(0),material=useMemo(()=>new THREE.MeshBasicMaterial({transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({clock},dt)=>{const m=mesh.current;if(!m)return;night.current=THREE.MathUtils.damp(night.current,Math.max(skyGradient(weatherForWorld(game)).night,atmosphereForWorld(game).glow*.6),1.2,Math.min(dt,.1));m.visible=night.current>.03;if(!m.visible)return;material.opacity=night.current*.2;
  spots.forEach((s,i)=>{const lit=s.shrine===undefined||game.shrines.has(s.shrine)?1:.25;o.position.set(s.x,s.y,s.z);o.scale.setScalar(s.size*lit*(.94+Math.sin(clock.elapsedTime*1.9+i)*.06));o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,tone.set(s.color));});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[undefined,material,spots.length]} frustumCulled={false} visible={false}><icosahedronGeometry args={[.5,2]}/></instancedMesh>;
}
