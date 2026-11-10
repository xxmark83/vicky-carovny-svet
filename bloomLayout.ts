import {PATH,GEMS,SHRINES,CHEST,MEADOWS,WORLD_BOUNDS,random,distance,pathDistance} from './map';
import type {Vec} from './map';
import {reservedForestPlace} from './forestPlaces';
import {valleyWaterSurface,BRIDGE} from './valleyLayout';
import {inBuildLot} from './building';
import {groundHeight} from './terrain';
// 3.7.0 forest only: drifts of blossoms hug the trail and fill the meadows. Decoration; never an obstacle.
export const BLOOM_COLORS=['#ff7fb6','#ff4f9a','#fff4f0','#b98cf0','#ffd95a','#7fc4ff','#ffa9d6'];
export const BLOOM_CELL=32;
export type Bloom={x:number;y:number;z:number;size:number;yaw:number;color:number;tall:boolean};
const open=(p:Vec)=>{const b=WORLD_BOUNDS;return p.x>b.minX+1&&p.x<b.maxX-1&&p.z>b.minZ+1&&p.z<b.maxZ-1&&!inBuildLot(p,2)&&valleyWaterSurface(p)===undefined&&Math.abs(p.z-BRIDGE.z)>12&&distance(p,CHEST)>6&&!reservedForestPlace(p,1)&&!GEMS.some(g=>distance(p,g)<1.6)&&!SHRINES.some(s=>distance(p,s)<4)&&Math.hypot(p.x-25,p.z+46)>5&&pathDistance(p)>2.5&&Math.abs(groundHeight({x:p.x+1,z:p.z})-groundHeight({x:p.x-1,z:p.z}))<1.6&&Math.abs(groundHeight({x:p.x,z:p.z+1})-groundHeight({x:p.x,z:p.z-1}))<1.6;};
export function bloomLayout(low=false){const rng=random(70700),cells=new Map<string,Bloom[]>();
 const cluster=(c:Vec,count:number,spread:number)=>{const color=Math.floor(rng()*BLOOM_COLORS.length),tall=rng()<.22;for(let i=0;i<count;i++){const a=rng()*Math.PI*2,r=Math.sqrt(rng())*spread,p={x:c.x+Math.cos(a)*r,z:c.z+Math.sin(a)*r};if(!open(p))continue;const key=`${Math.floor(p.x/BLOOM_CELL)}:${Math.floor(p.z/BLOOM_CELL)}`;let list=cells.get(key);if(!list)cells.set(key,list=[]);list.push({x:p.x,y:groundHeight(p),z:p.z,size:.75+rng()*.6,yaw:rng()*Math.PI*2,color:rng()<.8?color:Math.floor(rng()*BLOOM_COLORS.length),tall});}};
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;
  for(let d=0;d<len;d+=low?2.4:1)for(const side of [-1,1])for(let n=0;n<(low?1:2);n++){const offset=side*(2.9+Math.pow(rng(),1.7)*6.5),along=d+rng();cluster({x:a.x+dx*along-dz*offset,z:a.z+dz*along+dx*offset},low?3:4,.75);}}
 for(const m of MEADOWS)for(let n=0;n<(low?14:42);n++){const a=rng()*Math.PI*2,r=Math.sqrt(rng())*m.r;cluster({x:m.x+Math.cos(a)*r,z:m.z+Math.sin(a)*r},low?3:4,.9);}
 return [...cells.entries()].map(([key,blooms])=>{const [cx,cz]=key.split(':').map(Number);return {key,x:(cx+.5)*BLOOM_CELL,z:(cz+.5)*BLOOM_CELL,blooms};});}
// The glass of every ValleyLanterns post, repeated here so its glow can be drawn without touching that scenery.
export function lanternLights(){const lights:{x:number;y:number;z:number}[]=[];for(let i=1;i<PATH.length;i++){const a=PATH[i-1],p=PATH[i],len=distance(a,p);for(let d=4;d<len;d+=18){const t=d/len,x=a.x+(p.x-a.x)*t+(i%2?4.5:-4.5),z=a.z+(p.z-a.z)*t;lights.push({x,y:groundHeight({x,z})+2.7,z});}}return lights;}
