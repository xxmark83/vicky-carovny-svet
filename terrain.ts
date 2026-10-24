import {CHEST,GEMS,SHRINES,CREATIVE_MEADOW,pathDistance,distance} from './map';
import type {Vec} from './map';
import {BRIDGE,CASTLE,valleyElevation,valleyWaterSurface,onValleyFootbridge} from './valleyLayout';
export const TERRAIN_CELL=2;
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
const cache=new Map<string,number>();
// The route rises through authored terraces; local hills fade near objectives and walking lanes.
export function terrainBlockHeight(ix:number,iz:number):number{
 const key=`${ix}:${iz}`,hit=cache.get(key);if(hit!==undefined)return hit;
 const x=ix*TERRAIN_CELL,z=iz*TERRAIN_CELL,p={x,z};
 const base=valleyElevation(z),route=pathDistance(p);
 let hills=5+4*Math.sin(z/37)*Math.cos(x/31)+3*Math.sin((x+z)/23);
 hills+=22*Math.exp(-((x+105)**2/1100+(z+170)**2/2500));
 hills+=27*Math.exp(-((x-125)**2/1800+(z+345)**2/2500));
 hills+=17*Math.exp(-((x+100)**2/1800+(z+440)**2/2100));
 let weight=smooth((route-5)/17);
 for(const q of [CHEST,...GEMS,...SHRINES])weight=Math.min(weight,smooth((distance(p,q)-5)/9));
 // Village plots stay on gentle, shared terrain rather than isolated zero-height holes.
 if(distance(p,CREATIVE_MEADOW)<23||distance(p,{x:0,z:12})<20)weight=0;
 let h=base+Math.max(0,hills)*weight*smooth((-z-16)/35);
 // A real cross-valley ravine, with one broad bridge supported above its river.
 const ravine=1-smooth((Math.abs(z-BRIDGE.z)-5)/8);
 if(Math.abs(x-BRIDGE.x)>5.3)h-=ravine*14;
 if(Math.abs(x-BRIDGE.x)<=5.3&&Math.abs(z-BRIDGE.z)<9)h=valleyElevation(BRIDGE.z);
 const water=valleyWaterSurface(p);if(water!==undefined)h=water-.8;
 const royal=1-smooth((distance(p,CASTLE)-30)/18);h=h*(1-royal)+95*royal;
 const footbridge=onValleyFootbridge(p);if(footbridge)h=footbridge.y;
 h=Math.max(0,h);cache.set(key,h);return h;
}
export function groundHeight(p:Vec):number{
 const x=p.x/TERRAIN_CELL,z=p.z/TERRAIN_CELL,ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz;
 const a=terrainBlockHeight(ix,iz),b=terrainBlockHeight(ix+1,iz),c=terrainBlockHeight(ix,iz+1),d=terrainBlockHeight(ix+1,iz+1);
 return a+(b-a)*fx+(c-a)*fz+(a-b-c+d)*fx*fz;
}
export function standingHeight(p:Vec){const bridge=onValleyFootbridge(p);if(bridge)return bridge.y+.28;return Math.abs(p.x-BRIDGE.x)<=5.3&&Math.abs(p.z-BRIDGE.z)<9?valleyElevation(BRIDGE.z)+.28:groundHeight(p);}
