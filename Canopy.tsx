import {memo,useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {groundHeight} from './terrain';
import {canopyLayout,sunShaftSpots,CANOPY_COLORS} from './canopyLayout';
import type {Puff} from './canopyLayout';
import {weatherForWorld,atmosphereForWorld} from './weather';
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
 useFrame(()=>{const m=mesh.current;if(!m)return;const w=weatherForWorld(game),strength=(low?.012:.018)*(1-w.overcast*.92)*Math.max(0,w.daylight-.15)*(1-atmosphereForWorld(game).rain);m.visible=strength>.002&&!game.flying&&game.mode!=='building';if(!m.visible)return;
  material.opacity=strength;material.color.set(w.sun);axis.set(w.sunX,w.sunY,w.sunZ).normalize();lean.setFromUnitVectors(up,axis);const spots=sunShaftSpots(game.player,low);
  spots.forEach((s,i)=>{o.position.set(s.x,groundHeight(s),s.z).addScaledVector(axis,8);o.quaternion.copy(lean);o.scale.set(s.fade,1,s.fade);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.count=spots.length;m.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={mesh} args={[undefined,material,49]} frustumCulled={false} visible={false}><cylinderGeometry args={[.2,.95,17,8,1,true]}/></instancedMesh>;
}
