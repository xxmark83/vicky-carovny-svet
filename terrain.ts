import {CHEST,GEMS,SHRINES,CREATIVE_MEADOW,MEADOWS,ENEMY_HOMES,pathDistance,distance} from './map';
import {reservedForestPlace,forestTreeClearing} from './forestPlaces';
import type {Vec} from './map';
import {BRIDGE,CASTLE,valleyElevation,valleyWaterSurface,onValleyFootbridge,valleyBankHeight} from './valleyLayout';
export const TERRAIN_CELL=2;
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
const cache=new Map<string,number>();
// 3.11.0: knolls and hollows a few metres across break up the open forest floor. They change height only; where one
// may walk is decided elsewhere and stays the same. They fade to nothing at the trail, goals, meadows, village and cave.
export const RELIEF_HEIGHT=3;
export function forestRelief(p:Vec):number{const {x,z}=p,route=pathDistance(p);let w=smooth((route-4)/12)*smooth((-z-16)/35);if(w<=0)return 0;
 for(const q of [CHEST,...GEMS,...SHRINES])w=Math.min(w,smooth((distance(p,q)-6)/10));
 for(const m of MEADOWS)w=Math.min(w,smooth((distance(p,m)-m.r)/10));
 // Guardians fight on level ground, so their warning rings never sink into a slope.
 for(const e of ENEMY_HOMES)w=Math.min(w,smooth((distance(p,e)-7)/9));
 w=Math.min(w,smooth((Math.hypot(x-22,z+48)-22)/12),smooth((distance(p,CREATIVE_MEADOW)-23)/10));
 if(w<=0)return 0;w*=reservedForestPlace(p,3)||forestTreeClearing(p,2)?0:reservedForestPlace(p,6)?.33:reservedForestPlace(p,9)?.66:1;
 return w*(2.3*Math.sin(x/9.5+1.3*Math.sin(z/14))*Math.cos(z/11.5+.7*Math.sin(x/16))+.7*Math.sin((x-z)/5.3)*Math.sin((x+z)/6.7));}
// The route rises through authored terraces; local hills fade near objectives and walking lanes.
export function terrainBlockHeight(ix:number,iz:number,relief=true):number{
 const key=`${ix}:${iz}:${relief?1:0}`,hit=cache.get(key);if(hit!==undefined)return hit;
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
 let h=base+Math.max(0,hills)*weight*smooth((-z-16)/35)+(relief?forestRelief(p):0);
 // A real cross-valley ravine, with one broad bridge supported above its river.
 const ravine=1-smooth((Math.abs(z-BRIDGE.z)-5)/8);
 if(Math.abs(x-BRIDGE.x)>5.3)h-=ravine*14;
 const approach=(1-smooth((Math.abs(z-BRIDGE.z)-14)/14))*(1-smooth((Math.abs(x-BRIDGE.x)-5.3)/3));h=h*(1-approach)+valleyElevation(BRIDGE.z)*approach;
 h=valleyBankHeight(p,h);
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
// The ground as it was before 3.11.0. Tree and rock placement keeps deciding by it, so every obstacle stays exactly where it was.
export function legacyGroundHeight(p:Vec):number{
 const x=p.x/TERRAIN_CELL,z=p.z/TERRAIN_CELL,ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz;
 const a=terrainBlockHeight(ix,iz,false),b=terrainBlockHeight(ix+1,iz,false),c=terrainBlockHeight(ix,iz+1,false),d=terrainBlockHeight(ix+1,iz+1,false);
 return a+(b-a)*fx+(c-a)*fz+(a-b-c+d)*fx*fz;
}
export function standingHeight(p:Vec){const bridge=onValleyFootbridge(p);if(bridge)return bridge.y+.28;return Math.abs(p.x-BRIDGE.x)<=5.3&&Math.abs(p.z-BRIDGE.z)<9?valleyElevation(BRIDGE.z)+.28:groundHeight(p);}
