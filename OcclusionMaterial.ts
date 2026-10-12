import {useMemo,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
// Apply the same near-camera clearing to authored flowers/arches as to the forest.
export function useHeroFadeMaterial(game:Game){const hero=useMemo(()=>({value:new THREE.Vector3()}),[]);const material=useMemo(()=>{const m=new THREE.MeshStandardMaterial({roughness:.9});m.onBeforeCompile=s=>{s.uniforms.fadeHero=hero;s.vertexShader='varying vec3 decorWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
vec4 decor=vec4(transformed,1.0);
#ifdef USE_INSTANCING
decor=instanceMatrix*decor;
#endif
decorWorld=(modelMatrix*decor).xyz;`);s.fragmentShader='varying vec3 decorWorld; uniform vec3 fadeHero;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
vec3 axis=cameraPosition-fadeHero;float t=dot(decorWorld-fadeHero,axis)/max(dot(axis,axis),0.01);float gap=distance(decorWorld,fadeHero+axis*t);
if((distance(decorWorld,cameraPosition)<3.2||(t>0.04&&t<1.03&&gap<2.1&&decorWorld.y>fadeHero.y-1.5))&&mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y)*2.0,5.0)>0.0)discard;`);};m.customProgramCacheKey=()=> 'scenic-occlusion-18';return m;},[hero]);useFrame(()=>{if(game.mode==='menu')hero.value.set(3.7,2.1,9.5);else hero.value.set(game.player.x,game.floor(game.player)+game.player.y+1.2,game.player.z);});useEffect(()=>()=>material.dispose(),[material]);return material;}
