import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {mountainMeshData,mountainHeight} from './mountains';
import {WORLD_BOUNDS,random} from './map';
import type {Block} from './world';
import {Cubes} from './Voxel';
export function MountainRange(){const trees=useMemo(()=>{const b:Block[]=[],r=random(1794),w=WORLD_BOUNDS;for(let i=0;i<2000;i++){const x=w.minX-28+r()*(w.maxX-w.minX+56),z=w.minZ-28+r()*(w.maxZ-w.minZ+56),d=Math.max(w.minX-x,x-w.maxX,w.minZ-z,z-w.maxZ);if(d<7||d>26)continue;const y=mountainHeight(x,z),h=4+r()*4;b.push({p:[x,y+h*.3,z],s:[.35,h*.6,.35],c:'#6b5439'});for(let j=0;j<4;j++)b.push({p:[x,y+h*(.42+j*.16),z],s:[3.4-j*.75,h*.26,3.4-j*.75],c:j%2?'#456c3f':'#365c37'});}return b;},[]);const material=useMemo(()=>{const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});m.onBeforeCompile=s=>{s.vertexShader='varying vec3 ridgeWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nridgeWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');s.fragmentShader='varying vec3 ridgeWorld;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float grain=fract(sin(dot(floor(ridgeWorld*1.8),vec3(12.9,78.2,31.4)))*43758.5);
diffuseColor.rgb*=0.89+grain*0.18;
vec3 cliffNormal=normalize(cross(dFdx(ridgeWorld),dFdy(ridgeWorld)));float cliff=1.0-smoothstep(.42,.8,abs(cliffNormal.y));
float band=step(.82,fract(ridgeWorld.y*.13+sin(ridgeWorld.x*.09)*.12));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.29,.32,.31),cliff*.7);diffuseColor.rgb*=1.0-band*cliff*.18;`);};m.customProgramCacheKey=()=> 'mountain-cliffs-20';return m;},[]);const geometry=useMemo(()=>{const data=mountainMeshData(),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(data.positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(data.colors,3));g.computeVertexNormals();g.computeBoundingSphere();return g;},[]);useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);return <><mesh geometry={geometry} material={material} receiveShadow/><Cubes blocks={trees} castShadow={false}/></>;}
