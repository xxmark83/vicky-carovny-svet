import {useEffect,useMemo} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {Vector2} from 'three';
// Restrained magic highlights, without gameplay blur. Low quality keeps the direct renderer.
export function CinematicFinish({enabled}:{enabled:boolean}){
 const {gl,scene,camera,size}=useThree();
 useEffect(()=>{const before=gl.info.autoReset;gl.info.autoReset=false;return()=>{gl.info.autoReset=before;};},[gl]);
 const chain=useMemo(()=>{if(!enabled)return null;const composer=new EffectComposer(gl);composer.setPixelRatio(Math.min(gl.getPixelRatio(),1.25));const render=new RenderPass(scene,camera),bloom=new UnrealBloomPass(new Vector2(256,256),.22,.65,1.08),output=new OutputPass();composer.addPass(render);composer.addPass(bloom);composer.addPass(output);return {composer,render,bloom,output};},[enabled,gl,scene,camera]);
 useEffect(()=>{chain?.composer.setSize(size.width,size.height);},[chain,size.width,size.height]);
 useEffect(()=>()=>{if(chain){chain.bloom.dispose();chain.output.dispose();chain.composer.dispose();}},[chain]);
 useFrame((_,dt)=>{gl.info.reset();if(chain)chain.composer.render(dt);else gl.render(scene,camera);},1);return null;
}
