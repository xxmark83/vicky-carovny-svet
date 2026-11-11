import {PATH,SHRINES,GEMS,CHEST,distance,pathDistance,random} from './map';
import type {Vec} from './map';
import {BRIDGE,CASTLE} from './valleyLayout';
import {reservedForestPlace} from './forestPlaces';
import {groundHeight} from './terrain';
// 3.17.0 forest only. Mighty old trees reach across the trail with lanterns and flowering vines; rose-covered stone gates
// mark the way to each shrine. Decoration: the old trunks are drawn around trees that already block walking, and the gate
// columns are as slender as the lantern posts, so nothing new stands in the way.
type Tree={x:number;z:number;kind:string;radius:number;height:number};
export type Arch={a:Vec&{y:number},b:Vec&{y:number},lanterns:{x:number;y:number;z:number}[],tint:number};
export type Gate={x:number;y:number;z:number;yaw:number};
const along=(d:number)=>{let left=d;for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b);if(left<=len){const t=left/len;return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,dx:(b.x-a.x)/len,dz:(b.z-a.z)/len};}left-=len;}return null;};
export const boughPoint=(arch:Arch,t:number)=>{const lift=Math.sin(t*Math.PI)*2.6;return {x:arch.a.x+(arch.b.x-arch.a.x)*t,y:arch.a.y+(arch.b.y-arch.a.y)*t+7.6+lift,z:arch.a.z+(arch.b.z-arch.a.z)*t};};
export function archLayout(obstacles:Tree[]){const trees=obstacles.filter(o=>o.kind==='tree'),arches:Arch[]=[],rng=random(31700);
 for(let d=34;;d+=44){const p=along(d);if(!p)break;if(Math.abs(p.z-BRIDGE.z)<26||distance(p,CASTLE)<70||distance(p,CHEST)<40||SHRINES.some(s=>distance(s,p)<16)||GEMS.some(g=>distance(g,p)<5)||reservedForestPlace(p,8))continue;
  const side=(sign:number)=>{let best:Tree|undefined,score=Infinity;for(const t of trees){const rx=t.x-p.x,rz=t.z-p.z,across=(-p.dz*rx+p.dx*rz)*sign,forward=p.dx*rx+p.dz*rz,off=pathDistance(t);if(across<4.8||across>10||Math.abs(forward)>7||off<4.8)continue;const s=Math.abs(forward)+across*.6;if(s<score){score=s;best=t;}}return best;};
  const a=side(1),b=side(-1);if(!a||!b)continue;const arch:Arch={a:{x:a.x,z:a.z,y:groundHeight(a)},b:{x:b.x,z:b.z,y:groundHeight(b)},lanterns:[],tint:Math.floor(rng()*4)};
  for(const t of [.34,.66]){const q=boughPoint(arch,t);arch.lanterns.push({x:q.x,y:q.y-2.3,z:q.z});}arches.push(arch);}
 return arches;}
export const GATE_HALF_WIDTH=3.3;
export function gateLayout():Gate[]{return SHRINES.map(s=>{let best={d:Infinity,x:s.x,z:s.z,dx:0,dz:-1};for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len,t=Math.max(0,Math.min(len,(s.x-a.x)*dx+(s.z-a.z)*dz)),x=a.x+dx*t,z=a.z+dz*t,d=Math.hypot(s.x-x,s.z-z);if(d<best.d){const back=Math.max(0,t-11),useBack=t>=11;best={d,x:useBack?a.x+dx*back:a.x+dx*Math.min(len,t+11),z:useBack?a.z+dz*back:a.z+dz*Math.min(len,t+11),dx,dz};}}return {x:best.x,y:groundHeight(best),z:best.z,yaw:Math.atan2(best.dx,best.dz)};});}
