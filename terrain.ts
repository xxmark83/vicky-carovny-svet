import {CHEST,GEMS,SHRINES,CREATIVE_MEADOW} from './map';
import type {Vec} from './map';
export const TERRAIN_CELL=1.25;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const cache=new Map<string,number>();
const flats=[{...CREATIVE_MEADOW,inner:16,outer:23},{x:0,z:12,inner:7,outer:26},{...CHEST,inner:12,outer:25},...GEMS.map(p=>({...p,inner:2.2,outer:8})),...SHRINES.map(p=>({...p,inner:5,outer:13})),{x:17,z:-37,inner:13,outer:23}];
// A fixed lattice gives both render modes identical hills and collision heights.
export function terrainBlockHeight(ix:number,iz:number):number{
 const key=`${ix}:${iz}`;const hit=cache.get(key);if(hit!==undefined)return hit;
 const x=ix*TERRAIN_CELL,z=iz*TERRAIN_CELL;
 let h=4.4+2.6*Math.sin((z+12)/36)+1.8*Math.cos((x-14)/23)+1.3*Math.sin((x+z)/19);
 h+=7*Math.exp(-((x-48)**2/600+(z+73)**2/1600));
 h+=8*Math.exp(-((x+47)**2/500+(z+196)**2/1500));
 h+=5*Math.exp(-((x-41)**2/700+(z+260)**2/1100));
 let weight=smooth((Math.abs(z+152)-6)/13);
 for(const p of flats)weight=Math.min(weight,smooth((Math.hypot(x-p.x,z-p.z)-p.inner)/(p.outer-p.inner)));
 const pondWeight=smooth((Math.hypot(x-10,z+98)-3.4)/3.6);h=Math.round((Math.max(0,h)*weight*pondWeight+5.5*(1-pondWeight))*4)/4;
 cache.set(key,h);return h;
}
export function groundHeight(p:Vec):number{
 const x=p.x/TERRAIN_CELL,z=p.z/TERRAIN_CELL,ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz;
 const a=terrainBlockHeight(ix,iz),b=terrainBlockHeight(ix+1,iz),c=terrainBlockHeight(ix,iz+1),d=terrainBlockHeight(ix+1,iz+1);
 return a+(b-a)*fx+(c-a)*fz+(a-b-c+d)*fx*fz;
}

// Match the visible stair tops for feet; gameplay keeps its smooth walking height.
export function standingHeight(p:Vec){if(p.x>=12.3&&p.x<=22&&p.z>=-29&&p.z<=-26)return Math.max(.4,groundHeight(p));if(p.z<-148&&p.z>-156&&Math.abs(p.x-32)<=5.3)return .285;return Math.max(groundHeight(p),terrainBlockHeight(Math.round(p.x/TERRAIN_CELL),Math.round(p.z/TERRAIN_CELL)));}
