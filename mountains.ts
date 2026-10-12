import {WORLD_BOUNDS} from './map';
import {groundHeight} from './terrain';
// A continuous ridge surrounds the playable rectangle, including all four corners.
// Its foot begins just outside the collision boundary; the crest is above flight.
export const RIDGE_DISTANCE=72;
export function mountainHeight(x:number,z:number){
 const b=WORLD_BOUNDS,cx=Math.max(b.minX,Math.min(b.maxX,x)),cz=Math.max(b.minZ,Math.min(b.maxZ,z));
 const d=Math.max(b.minX-x,x-b.maxX,b.minZ-z,z-b.maxZ,0);
 if(d===0)return groundHeight({x:cx,z:cz})-.15;
 const peaks=9*Math.sin(x*.071+z*.045)+6*Math.sin(z*.12-x*.09)+4*Math.cos(x*.21+z*.17);
 const ridge=94+peaks,outer=82+peaks*.7;
 const smooth=(n:number)=>{const t=Math.min(1,Math.max(0,n));return t*t*(3-2*t);};
 const base=groundHeight({x:cx,z:cz});
 let h=d<RIDGE_DISTANCE?base+(ridge-base)*Math.pow(smooth(d/RIDGE_DISTANCE),1.3):ridge+(outer-ridge)*smooth((d-RIDGE_DISTANCE)/35);
 // Small rock strata break the slopes without the old repeated pyramid steps.
 const along=Math.abs(x-cx)>Math.abs(z-cz)?z:x;
 const folded=Math.pow(Math.abs(Math.sin(along*.083+Math.sin(along*.028)*1.8)),3);
 // Eroded gullies, broad shoulders and projecting buttresses between the wooded foot and crest.
 if(d<72)h+=(folded*15-5)*Math.sin(Math.PI*d/72)**2+Math.sin(along*.21+d*.16)*Math.min(3,d*.12)*Math.sin(Math.PI*d/72);
 h+=Math.sin(x*.3+z*.23)*Math.sin(d*.18)*Math.min(2.4,d*.15);
 if(d>105)h*=1-.3*smooth((d-105)/35);
 return Math.max(base,Math.round(h*2)/2);
}
export function mountainMeshData(){
 const positions:number[]=[],colors:number[]=[],step=3,b=WORLD_BOUNDS;
 const shade=(x:number,y:number,z:number)=>{const snow=y>92+Math.sin(x*.11+z*.14)*5,green=y<26+Math.sin(z*.08)*6;
 const c=snow?[.72,.8,.84]:green?[.07,.18,.065]:y<50?[.14,.23,.15]:[.25,.3,.3];
 const v=.93+Math.sin(x*.41+z*.33)*.045;return c.map(n=>n*v);};
 const add=(points:number[][])=>{for(const v of points){positions.push(...v);colors.push(...shade(v[0],v[1],v[2]));}};
 // No faces or hidden box interiors inside the playable map.
 for(let z=b.minZ-123;z<b.maxZ+123;z+=step)for(let x=b.minX-123;x<b.maxX+123;x+=step){
 if(x>=b.minX&&x+step<=b.maxX&&z>=b.minZ&&z+step<=b.maxZ)continue;
 const a=[x,mountainHeight(x,z),z],c=[x+step,mountainHeight(x+step,z+step),z+step],d=[x,mountainHeight(x,z+step),z+step],e=[x+step,mountainHeight(x+step,z),z];
 add([a,d,c,a,c,e]);}
 return {positions,colors};
}
