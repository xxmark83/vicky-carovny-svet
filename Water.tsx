import {useEffect,useMemo} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
export type WaterPatch={p:[number,number,number];w:number;h:number;fall?:boolean};
// One animated material and one merged mesh per body of water, including its cascades.
export function Water({patches}:{patches:WaterPatch[]}){
 const time=useMemo(()=>({value:0}),[]),geometry=useMemo(()=>{const pos:number[]=[],uv:number[]=[];for(const a of patches){const [x,y,z]=a.p,verts=a.fall?[[x-a.w/2,y-a.h/2,z],[x+a.w/2,y-a.h/2,z],[x+a.w/2,y+a.h/2,z],[x-a.w/2,y+a.h/2,z]]:[[x-a.w/2,y,z-a.h/2],[x-a.w/2,y,z+a.h/2],[x+a.w/2,y,z+a.h/2],[x+a.w/2,y,z-a.h/2]];for(const i of [0,1,2,0,2,3]){pos.push(...verts[i]);uv.push(i===2||i===3?a.w:0,i===1||i===2?a.h:0);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;},[patches]);
 const material=useMemo(()=>{const m=new THREE.MeshStandardMaterial({color:'#249fbd',metalness:.22,roughness:.25,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false});m.onBeforeCompile=s=>{s.uniforms.waterTime=time;s.vertexShader='varying vec3 waterWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nwaterWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');s.fragmentShader='uniform float waterTime;\nvarying vec3 waterWorld;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float ripple=sin(waterWorld.x*2.1+waterWorld.z*1.6+waterTime*1.4)*sin(waterWorld.z*3.2-waterTime*1.8);
 float foam=pow(max(0.0,sin(waterWorld.x*5.0+waterWorld.y*1.5+waterWorld.z*2.5-waterTime*3.0)),18.0)*0.33;
 diffuseColor.rgb=mix(diffuseColor.rgb*vec3(0.7,0.91,1.03),vec3(0.34,0.8,0.79),ripple*0.12+0.1+foam);`);};m.customProgramCacheKey=()=> 'vicky-water-17';return m;},[time]);
 useFrame(({clock})=>{time.value=clock.elapsedTime;});useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);return <mesh geometry={geometry} material={material} receiveShadow/>;
}
