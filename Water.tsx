import {useEffect,useMemo} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
export type WaterPatch={p:[number,number,number];w:number;h:number;fall?:boolean};
// One animated material and one merged mesh per body of water, including its cascades.
export function Water({patches,storybook=false}:{patches:WaterPatch[];storybook?:boolean}){
 const time=useMemo(()=>({value:0}),[]),geometry=useMemo(()=>{const pos:number[]=[],uv:number[]=[],flow:number[]=[];for(const a of patches){const [x,y,z]=a.p,verts=a.fall?[[x-a.w/2,y-a.h/2,z],[x+a.w/2,y-a.h/2,z],[x+a.w/2,y+a.h/2,z],[x-a.w/2,y+a.h/2,z]]:[[x-a.w/2,y,z-a.h/2],[x-a.w/2,y,z+a.h/2],[x+a.w/2,y,z+a.h/2],[x+a.w/2,y,z-a.h/2]];for(const i of [0,1,2,0,2,3]){pos.push(...verts[i]);flow.push(a.fall?1:0,a.fall?a.p[1]-a.h/2:a.p[1],a.h);uv.push(i===2||i===3?a.w:0,i===1||i===2?a.h:0);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('waterFlow',new THREE.Float32BufferAttribute(flow,3));g.computeVertexNormals();return g;},[patches]);
 const material=useMemo(()=>{const m=new THREE.MeshStandardMaterial({color:'#249fbd',metalness:.22,roughness:.25,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false});m.onBeforeCompile=s=>{s.uniforms.waterTime=time;s.vertexShader='varying vec3 waterWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nwaterWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');s.fragmentShader='uniform float waterTime;\nvarying vec3 waterWorld;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float ripple=sin(waterWorld.x*2.1+waterWorld.z*1.6+waterTime*1.4)*sin(waterWorld.z*3.2-waterTime*1.8);
 float foam=pow(max(0.0,sin(waterWorld.x*5.0+waterWorld.y*1.5+waterWorld.z*2.5-waterTime*3.0)),18.0)*0.33;
 diffuseColor.rgb=mix(diffuseColor.rgb*vec3(0.7,0.91,1.03),vec3(0.34,0.8,0.79),ripple*0.12+0.1+foam);`);};if(storybook){
 m.color.set('#78c9c2');m.metalness=.12;m.roughness=.19;m.opacity=.94;
 m.onBeforeCompile=s=>{
  s.uniforms.waterTime=time;
  s.vertexShader='attribute vec3 waterFlow; varying vec3 waterWorld; varying vec3 flowData;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nwaterWorld=(modelMatrix*vec4(transformed,1.0)).xyz;flowData=waterFlow;');
  s.fragmentShader='uniform float waterTime; varying vec3 waterWorld; varying vec3 flowData;\n'+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float falling=flowData.x;
   float wave=sin(waterWorld.x*2.7+waterWorld.z*1.8+waterTime*1.1)*sin(waterWorld.z*3.9-waterTime*1.7);
   float ribbons=pow(.5+.5*sin(waterWorld.x*7.0+sin(waterWorld.y*.5+waterTime*2.0)),6.0);
   float streak=pow(.5+.5*sin(waterWorld.y*2.6+waterWorld.x*.7+waterTime*7.0),12.0)*ribbons;
   float impact=falling*(1.0-smoothstep(0.0,1.4,waterWorld.y-flowData.y));
   vec3 pool=mix(vec3(.045,.32,.34),vec3(.15,.58,.55),.5+.5*wave);
   vec3 curtain=mix(vec3(.28,.66,.68),vec3(.81,.95,.91),ribbons*.68+streak*.25+impact*.5);
   diffuseColor.rgb=mix(pool,curtain,falling);
   diffuseColor.a=mix(.93,.78+ribbons*.2,falling);`);
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   float sx=sin(waterWorld.x*2.7+waterWorld.z*1.8+waterTime*1.1);
   float sz=cos(waterWorld.z*3.9-waterTime*1.7);
   normal=normalize(normal+vec3(sx*.1,sz*.08,0.0)*(1.0-flowData.x));`);
  s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   float fresnel=pow(1.0-max(0.0,dot(normal,normalize(vViewPosition))),3.0);
   totalEmissiveRadiance+=vec3(.12,.24,.28)*fresnel*(1.0-flowData.x);
   float sparkle=pow(max(0.0,sin(waterWorld.x*12.0+waterTime)*cos(waterWorld.z*16.0-waterTime*1.8)),36.0);
   totalEmissiveRadiance+=vec3(.5,.44,.25)*sparkle*(1.0-flowData.x);`);
 };
 }
 m.customProgramCacheKey=()=> storybook?'vikousek-story-water-31':'vicky-water-17';return m;},[time,storybook]);
 useFrame(({clock})=>{time.value=clock.elapsedTime;});useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);return <mesh geometry={geometry} material={material} receiveShadow/>;
}
