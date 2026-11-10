import {useEffect,useMemo} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {Vector2} from 'three';
// Restrained magic highlights, without gameplay blur. Low quality keeps the direct renderer.
// 3.6.0 storybook grade: slightly richer colour and a soft darkening toward the corners. No blur.
const GRADE={uniforms:{tDiffuse:{value:null},saturation:{value:1.14},vignette:{value:.26}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform sampler2D tDiffuse;uniform float saturation;uniform float vignette;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);float l=dot(c.rgb,vec3(0.2126,0.7152,0.0722));c.rgb=max(mix(vec3(l),c.rgb,saturation),0.0);vec2 q=vUv-0.5;c.rgb*=1.0-vignette*smoothstep(0.18,0.75,dot(q,q)*2.0);gl_FragColor=c;}'};
export function CinematicFinish({enabled}:{enabled:boolean}){
 const {gl,scene,camera,size}=useThree();
 useEffect(()=>{const before=gl.info.autoReset;gl.info.autoReset=false;return()=>{gl.info.autoReset=before;};},[gl]);
 const chain=useMemo(()=>{if(!enabled)return null;const composer=new EffectComposer(gl);composer.setPixelRatio(Math.min(gl.getPixelRatio(),1.25));const render=new RenderPass(scene,camera),bloom=new UnrealBloomPass(new Vector2(256,256),.22,.65,1.08),grade=new ShaderPass(GRADE),output=new OutputPass();composer.addPass(render);composer.addPass(bloom);composer.addPass(grade);composer.addPass(output);return {composer,render,bloom,grade,output};},[enabled,gl,scene,camera]);
 useEffect(()=>{chain?.composer.setSize(size.width,size.height);},[chain,size.width,size.height]);
 useEffect(()=>()=>{if(chain){chain.bloom.dispose();chain.grade.dispose();chain.output.dispose();chain.composer.dispose();}},[chain]);
 useFrame((_,dt)=>{gl.info.reset();if(chain)chain.composer.render(dt);else gl.render(scene,camera);},1);return null;
}
