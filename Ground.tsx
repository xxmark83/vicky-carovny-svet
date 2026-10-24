import {villageTrailDistance} from './forestPlaces';
import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {groundHeight} from './terrain';
import {pathDistance,WORLD_BOUNDS} from './map';
import {BRIDGE} from './valleyLayout';
export type GroundChunk={key:string;positions:number[];colors:number[];uvs:number[]};
// Smooth shared terrain, chunked for view culling. No hidden cube interiors.
export function groundMeshData(){const chunks=new Map<string,GroundChunk>(),color=new THREE.Color(),step=2;
 const b=WORLD_BOUNDS;
 const add=(key:string,verts:number[][],c:string)=>{let a=chunks.get(key);if(!a){a={key,positions:[],colors:[],uvs:[]};chunks.set(key,a);}color.set(c);for(const i of [0,1,2,0,2,3]){a.positions.push(...verts[i]);a.colors.push(color.r,color.g,color.b);a.uvs.push(verts[i][0]/4,verts[i][2]/4);}};
 for(let z=b.minZ-2;z<b.maxZ+2;z+=step)for(let x=b.minX-2;x<b.maxX+2;x+=step){const p={x:x+1,z:z+1},h=groundHeight(p),path=Math.min(pathDistance(p),villageTrailDistance(p));const key=`${Math.floor(x/32)}:${Math.floor(z/32)}`;
 const variation=Math.sin(x*.13+z*.17)*.025;
 color.set(path<2.3?'#c5a574':h>100?'#789e62':'#79aa50');color.offsetHSL(variation,0,variation);
 const a=[x,groundHeight({x,z}),z],d=[x,groundHeight({x,z:z+step}),z+step],c=[x+step,groundHeight({x:x+step,z:z+step}),z+step],e=[x+step,groundHeight({x:x+step,z}),z];
 // Hide the ground cap under the suspended bridge to keep the ravine visible.
 if(Math.abs(p.x-BRIDGE.x)<5.3&&Math.abs(p.z-BRIDGE.z)<7)continue;
 add(key+':grass',[a,d,c,e],`#${color.getHexString()}`);
 }return [...chunks.values()];}
export function Ground({materials}:{materials:Record<'grass'|'earth',THREE.Material>}){const chunks=useMemo(()=>groundMeshData().map(c=>{const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(c.positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(c.colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(c.uvs,2));geometry.computeVertexNormals();geometry.computeBoundingSphere();return {key:c.key,geometry};}),[]);const material=useMemo(()=>{const m=materials.grass.clone();m.onBeforeCompile=materials.grass.onBeforeCompile;m.customProgramCacheKey=materials.grass.customProgramCacheKey;m.vertexColors=true;return m;},[materials]);useEffect(()=>()=>{chunks.forEach(c=>c.geometry.dispose());material.dispose();},[chunks,material]);return <>{chunks.map(c=><mesh key={c.key} geometry={c.geometry} material={material} receiveShadow/>)}</>;}
