import {memo,useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Game} from './game';
import {bloomLayout,lanternLights,BLOOM_COLORS} from './bloomLayout';
import type {Bloom} from './bloomLayout';
import {weatherForWorld,atmosphereForWorld} from './weather';
// 3.7.0 forest decoration. One small flower with three grass blades, instanced by the thousand and culled by distance.
// Vertex colour is a mask, not a paint: r = petal (takes the instance colour), g = golden heart, b = shade of green.
function bloomGeometry(){const parts:THREE.BufferGeometry[]=[],paint=(g:THREE.BufferGeometry,r:number,gr:number,b:number)=>{const n=g.attributes.position.count,c=new Float32Array(n*3);for(let i=0;i<n;i++){c[i*3]=r;c[i*3+1]=gr;c[i*3+2]=b;}g.setAttribute('color',new THREE.BufferAttribute(c,3));const plain=g.index?g.toNonIndexed():g;plain.deleteAttribute('uv');parts.push(plain);};
 const stem=new THREE.CylinderGeometry(.012,.018,.5,3,1,true);stem.translate(0,.25,0);paint(stem,0,0,.5);
 for(let i=0;i<5;i++){const petal=new THREE.SphereGeometry(.5,4,2);petal.scale(.2,.05,.22);petal.translate(0,0,.17);petal.rotateX(-.3);petal.rotateY(i*Math.PI*2/5);petal.translate(0,.5,0);paint(petal,1,0,0);}
 const heart=new THREE.SphereGeometry(.075,4,2);heart.translate(0,.53,0);paint(heart,0,1,0);
 for(let i=0;i<3;i++){const a=i*2.1+.4,h=.3+i*.09,blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.05,0,0,.05,0,0,.03,h,.12],3));blade.computeVertexNormals();blade.rotateY(a);blade.translate(Math.sin(a)*.13,0,Math.cos(a)*.13);paint(blade,0,0,.25+i*.3);}
 const g=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());g.computeVertexNormals();return g;}
const Cell=memo(function Cell({blooms,geometry,material,meshRef}:{blooms:Bloom[];geometry:THREE.BufferGeometry;material:THREE.Material;meshRef:(m:THREE.InstancedMesh|null)=>void}){const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const m=ref.current!,o=new THREE.Object3D(),c=new THREE.Color();blooms.forEach((b,i)=>{o.position.set(b.x,b.y-.02,b.z);o.rotation.set(0,b.yaw,0);o.scale.set(b.size*1.35,b.size*(b.tall?1.45:1.1),b.size*1.35);o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,c.set(BLOOM_COLORS[b.color]));});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere();},[blooms]);
 return <instancedMesh ref={m=>{ref.current=m;meshRef(m);}} args={[geometry,material,blooms.length]} receiveShadow/>;});
export function Blooms({game,low}:{game:Game;low:boolean}){
 const cells=useMemo(()=>bloomLayout(low),[low]),geometry=useMemo(bloomGeometry,[]),meshes=useRef<(THREE.InstancedMesh|null)[]>([]),sway=useMemo(()=>({value:0}),[]),heroAt=useMemo(()=>({value:new THREE.Vector3(0,-999,0)}),[]);
 const material=useMemo(()=>{const m=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});m.onBeforeCompile=s=>{s.uniforms.bloomSway=sway;s.uniforms.bloomHero=heroAt;s.vertexShader='uniform float bloomSway;uniform vec3 bloomHero;\n'+s.vertexShader.replace('#include <color_vertex>',`#if defined( USE_COLOR ) && defined( USE_INSTANCING_COLOR )
vec3 leafGreen=vec3(0.16,0.36,0.10)*(0.7+color.b);vColor=mix(mix(leafGreen,instanceColor*1.25,color.r),vec3(1.0,0.78,0.22),color.g);
#endif`).replace('#include <begin_vertex>',`#include <begin_vertex>
#ifdef USE_INSTANCING
float bloomPhase=bloomSway+instanceMatrix[3].x*0.7+instanceMatrix[3].z*0.5;transformed.x+=sin(bloomPhase)*0.09*position.y;transformed.z+=cos(bloomPhase*0.8)*0.06*position.y;
// 3.14.0: blossoms and grass part before the heroine and spring back behind her.
vec2 bloomAway=instanceMatrix[3].xz-bloomHero.xz;float bloomNear=1.0-smoothstep(0.35,1.9,length(bloomAway));if(bloomNear>0.0&&abs(instanceMatrix[3].y-bloomHero.y)<2.5){vec3 bloomPush=vec3(normalize(bloomAway+vec2(0.0001)).x,0.0,normalize(bloomAway+vec2(0.0001)).y)*bloomNear*position.y*1.5;float bloomScale=dot(instanceMatrix[0].xyz,instanceMatrix[0].xyz);transformed+=transpose(mat3(instanceMatrix))*bloomPush/bloomScale;transformed.y*=1.0-bloomNear*0.45;}
#endif`);};m.customProgramCacheKey=()=> 'vikousek-blooms-314';return m;},[sway]);
 useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);
 // Blossoms this small vanish in the distance anyway, so far cells are simply not drawn.
 useFrame(({camera},dt)=>{if(game.mode==='playing'&&!game.flying&&!game.landing)heroAt.value.set(game.player.x,game.floor(game.player)+game.player.y,game.player.z);else heroAt.value.y=-999;if(game.mode!=='paused')sway.value+=Math.min(dt,.1)*(1.1+atmosphereForWorld(game).rain*1.2);const reach=low?70:game.flying||game.mode==='intro'?150:105;cells.forEach((c,i)=>{const m=meshes.current[i];if(m)m.visible=Math.hypot(c.x-camera.position.x,c.z-camera.position.z)<reach;});});
 return <>{cells.map((c,i)=><Cell key={c.key} blooms={c.blooms} geometry={geometry} material={material} meshRef={m=>{meshes.current[i]=m;}}/>)}</>;
}
// A warm halo around each trail lantern: faint by day, generous at dusk and under heavy cloud.
export function LanternGlow({game}:{game:Game}){
 const lights=useMemo(lanternLights,[]),mesh=useRef<THREE.InstancedMesh>(null),material=useMemo(()=>new THREE.MeshBasicMaterial({color:'#ffb24d',transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),[]);
 useEffect(()=>()=>material.dispose(),[material]);
 useLayoutEffect(()=>{const m=mesh.current!,o=new THREE.Object3D();lights.forEach((l,i)=>{o.position.set(l.x,l.y,l.z);o.scale.setScalar(1);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.instanceMatrix.needsUpdate=true;},[lights]);
 useFrame(({clock})=>{const w=weatherForWorld(game),dark=Math.max(atmosphereForWorld(game).glow,w.overcast*.6);material.opacity=(.04+dark*.11)*(.93+Math.sin(clock.elapsedTime*2.3)*.07);});
 return <instancedMesh ref={mesh} args={[undefined,material,lights.length]} frustumCulled={false}><icosahedronGeometry args={[.8,2]}/></instancedMesh>;
}
