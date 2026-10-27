import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
// Opt-in diagnostics only; never occupies the child's normal playfield.
export function RenderMetrics(){const sample=useRef({time:0,frames:0,slow:0});useFrame(({gl},dt)=>{if(!location.search.includes('qa=1')||document.hidden||dt>.5)return;const s=sample.current;s.time+=dt;s.frames++;if(dt>.034)s.slow++;if(s.time>=3){const el=document.getElementById('render-metrics');if(el)el.textContent=JSON.stringify({fps:Math.round(s.frames/s.time),slowFrames:s.slow,drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,geometries:gl.info.memory.geometries,textures:gl.info.memory.textures,backend:'WebGL2'});s.time=0;s.frames=0;s.slow=0;}},2);return null;}
