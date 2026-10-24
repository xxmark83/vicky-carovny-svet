import * as THREE from 'three';
// Same sculpted voxel bodies; joints only deform nearby animals, in one shared draw call.
export function animalMaterial(kind:number,instanced:boolean){const pose={value:new THREE.Vector4(0,1,0,0)},m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78});const heads=[[1.05,.3,1.2,.42],[1.24,-1,1.25,0],[1.2,-1,1.22,0],[.86,.18,.95,.3],[.85,.28,.95,.36],[.86,.05,.95,.18],[.94,.26,1.02,.38]][kind];
 const code=`vec4 ap=${instanced?'animalPose':'animalPoseUniform'};float detail=ap.y;float phase=ap.x;float prepare=ap.z;float flinch=ap.w;float head=float(cubeCenter.y>${heads[0].toFixed(3)}&&cubeCenter.z>${heads[1].toFixed(3)});float headX=${kind===0?'.58':kind===3?'.24':'.1'}*prepare+flinch*.16;float headY=sin(phase*.24)*.1*(1.0-prepare);vec3 pivot=vec3(0.0,${heads[2]},${heads[3]});mat3 headTurn=mat3(cos(headY),0.0,-sin(headY),0.0,1.0,0.0,sin(headY),0.0,cos(headY))*mat3(1.0,0.0,0.0,0.0,cos(headX),sin(headX),0.0,-sin(headX),cos(headX));`;
 m.onBeforeCompile=s=>{s.uniforms.animalPoseUniform=pose;s.vertexShader=`attribute vec3 cubeCenter;${instanced?'attribute vec4 animalPose;':'uniform vec4 animalPoseUniform;'}\n`+s.vertexShader;
 s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>\n{${code}if(head>.5)objectNormal=mix(objectNormal,headTurn*objectNormal,detail);}`);
 s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\n{${code}
 if(cubeCenter.y<${kind===1||kind===2?'.4':'.56'}&&abs(cubeCenter.x)>.12){float step=sin(phase+sign(cubeCenter.x)*1.57+sign(cubeCenter.z)*1.57);transformed.z+=step*.09;transformed.y+=max(0.0,step)*.065;}
 if(head>.5)transformed=mix(transformed,pivot+headTurn*(transformed-pivot),detail);
 ${kind===1?`if(abs(cubeCenter.x)>.46&&cubeCenter.y>.5&&cubeCenter.y<1.16){transformed.z+=detail*prepare*.32;transformed.y+=detail*prepare*.28;}`:''}
 ${kind===5?`if(cubeCenter.y>1.48){transformed.z+=detail*sin(phase*.65+sign(cubeCenter.x))*.07;}if(cubeCenter.y<.4){transformed.z+=detail*sin(phase)*.09;}`:''}
 ${kind===0||kind===6?`if(cubeCenter.z<-.66){transformed.x+=detail*sin(phase*.7)*.12;}`:''}
 transformed.x+=detail*flinch*sin(cubeCenter.y*3.0)*.045;
 }`);};m.customProgramCacheKey=()=>`animal-joints-20-${kind}-${instanced}`;return {material:m,pose};}
export function animalBodyMotion(kind:number,gait:number,windup:number,hit:number,happy:number,air:boolean){return {hop:happy>0?Math.abs(Math.sin((5-happy)*7))*.34:air?Math.sin(gait*.3)*.1:kind===5?Math.max(0,Math.sin(gait))*.28:Math.abs(Math.sin(gait))*(kind===1?.035:.055),lean:kind===0?windup*.1:kind===5?-windup*.14:0,roll:kind===1?Math.sin(gait)*.045:kind===3?Math.sin(gait*.7)*.035:hit*Math.sin(hit*45)*.25};}
