import {PATH,GEMS,SHRINES,CHEST,WORLD_BOUNDS,random,distance,pathDistance} from './map';
import {reservedForestPlace} from './forestPlaces';
import {valleyWaterSurface,BRIDGE} from './valleyLayout';
import {inBuildLot} from './building';
import {groundHeight} from './terrain';
import type {Vec} from './map';

// The final art pass covers the full authored valley; runtime cells cull nearby detail.
export const FOREST_LOOK_BOUNDS={...WORLD_BOUNDS};
export function inForestLook(p:Vec){const b=FOREST_LOOK_BOUNDS;return p.x>b.minX&&p.x<b.maxX&&p.z>b.minZ&&p.z<b.maxZ;}
export type LookPlacement={x:number;y:number;z:number;size:number;yaw:number;kind:number;pitch?:number};
export function forestLookLayout(low=false){
 const rng=random(31024),stones:LookPlacement[]=[],plants:LookPlacement[]=[],rocks:LookPlacement[]=[];
 for(let i=1;i<PATH.length;i++){
  const a=PATH[i-1],b=PATH[i],len=distance(a,b),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;
  for(let d=.7;d<len;d+=1.05)for(let row=-2;row<=2;row++){
   const offset=row*.86+(rng()-.5)*.1,x=a.x+dx*(d+(row%2)*.45)-dz*offset,z=a.z+dz*(d+(row%2)*.45)+dx*offset;
   if(!inForestLook({x,z})||reservedForestPlace({x,z},-.5)||Math.abs(z-BRIDGE.z)<12||valleyWaterSurface({x,z})!==undefined)continue;
   stones.push({x,y:groundHeight({x,z})+.025,z,size:.83+rng()*.1,yaw:(rng()-.5)*.18,kind:Math.floor(rng()*5)});
  }
 }
 const protectedPlace=(p:Vec)=>inBuildLot(p,2)||valleyWaterSurface(p)!==undefined||Math.abs(p.z-BRIDGE.z)<12||distance(p,CHEST)<6||reservedForestPlace(p,1)||GEMS.some(g=>distance(p,g)<2)||SHRINES.some(s=>distance(p,s)<4)||Math.hypot(p.x-25,p.z+46)<5;
 // Groups follow the trail rather than a random carpet over the whole map.
 for(let i=1;i<PATH.length;i++){
  const a=PATH[i-1],b=PATH[i],len=distance(a,b),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;
  for(let d=0;d<len;d+=low?2.5:1.6)for(const side of [-1,1])for(let row=0;row<(low?1:3);row++){
   const offset=side*(2.8+row*1.05+rng()*.8),x=a.x+dx*d-dz*offset,z=a.z+dz*d+dx*offset,p={x,z};
   if(!inForestLook(p)||protectedPlace(p))continue;
   if(Math.abs(groundHeight({x:x+1,z})-groundHeight({x:x-1,z}))>1.8)continue;
   plants.push({x,y:groundHeight(p),z,size:.85+rng()*.85,yaw:rng()*Math.PI*2,kind:Math.floor(rng()*9)});
  }
 }
 // Small mossy banks frame the cave, leaving the existing secret entrance open.
 for(let i=0;i<64;i++){
  const side=i%2?1:-1,z=-5-rng()*65,x=side*(4.7+rng()*3.3)+((z<-30)?(z+30)*.75:0),p={x,z};
  if(!inForestLook(p)||protectedPlace(p)||pathDistance(p)<3.6)continue;
  rocks.push({x,y:groundHeight(p)-.05,z,size:.45+rng()*.8,yaw:rng()*6.28,kind:i%3});
 }
 return {stones,plants,rocks};
}
