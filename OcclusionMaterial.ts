import {useMemo,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
// Apply the same near-camera clearing to authored flowers/arches as to the forest.
export function useHeroFadeMaterial(game:Game){const hero=useMemo(()=>({value:new THREE.Vector3()}),[]);const active=useMemo(()=>({value:1}),[]);const material=useMemo(()=>{const m=new THREE.MeshStandardMaterial({roughness:.9});m.onBeforeCompile=s=>{s.uniforms.fadeHero=hero;s.uniforms.fadeActive=active;s.vertexShader='varying vec3 decorWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
vec4 decor=vec4(transformed,1.0);
#ifdef USE_INSTANCING
decor=instanceMatrix*decor;
#endif
decorWorld=(modelMatrix*decor).xyz;`);s.fragmentShader='varying vec3 decorWorld; uniform vec3 fadeHero; uniform float fadeActive;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
vec3 axis=cameraPosition-fadeHero;float t=dot(decorWorld-fadeHero,axis)/max(dot(axis,axis),0.01);float gap=distance(decorWorld,fadeHero+axis*t);
float corridor=(1.0-smoothstep(1.2,2.8,gap))*smoothstep(0.02,0.14,t)*(1.0-smoothstep(0.9,1.06,t))*step(fadeHero.y-1.5,decorWorld.y);float nearFade=1.0-smoothstep(1.0,3.5,distance(decorWorld,cameraPosition));float coverage=1.0-max(corridor,nearFade)*fadeActive*0.88;if((mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y)*5.0,16.0)+0.5)/16.0>coverage)discard;`);};m.customProgramCacheKey=()=> 'scenic-occlusion-22';return m;},[hero,active]);useFrame((_,dt)=>{active.value=THREE.MathUtils.damp(active.value,game.mode==='intro'?0:1,8,dt);if(game.mode==='menu')hero.value.set(3.7,2.1,9.5);else hero.value.set(game.player.x,game.floor(game.player)+game.player.y+1.2,game.player.z);});useEffect(()=>()=>material.dispose(),[material]);return material;}
