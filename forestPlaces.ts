import {forestPoint} from './valleyLayout';
import {distance,pathDistance,segmentDistance} from './map';
import type {Vec} from './map';

// Authored places share their footprints with collision, vegetation and landing.
export const FOREST_COTTAGES=[
 {x:30,z:-18,roof:'#c29150',name:'Domeček u vodopádu'},
 {x:13,z:-139,roof:'#c09a65',name:'Rybářský domeček'},
 {x:51,z:-140,roof:'#b8796c',name:'Domeček zahradnice'},
 {x:64,z:-169,roof:'#bd80a1',name:'Růžový domeček'},
].map(forestPoint).map((p,i)=>i===3?{...p,x:108,z:-282}:p);
export const FOREST_GARDENS=[{x:9,z:-5},{x:59,z:-130}].map(forestPoint);
export const VILLAGE_TRAILS=[
 [{x:0,z:-12},{x:30,z:-13.4}],
 [{x:32,z:-139},{x:13,z:-134.4}],
 [{x:32,z:-139},{x:51,z:-135.4}],
 [{x:32,z:-169},{x:64,z:-164.4}],
].map(pair=>pair.map(forestPoint)).map((pair,i)=>i===3?[pair[0],{x:108,z:-277.4}]:pair);
export const villageTrailDistance=(p:Vec)=>Math.min(...VILLAGE_TRAILS.map(([a,b])=>segmentDistance(p,a,b)));
export const CHERRY_TREES=Array.from({length:26},(_,i)=>{
 const center=i<12?{x:37,z:0}:{x:-23,z:-281},a=i*2.39996,r=5+(i%4)*2;
 return forestPoint({x:center.x+Math.sin(a)*r,z:center.z+Math.cos(a)*r});
}).filter(p=>pathDistance(p)>5&&!FOREST_COTTAGES.some(h=>distance(h,p)<8));
export function cottageBlocked(p:Vec,pad=.38){return FOREST_COTTAGES.some(h=>Math.abs(p.x-h.x)<3.5+pad&&Math.abs(p.z-h.z)<3.05+pad);}
export function reservedForestPlace(p:Vec,pad=0){return villageTrailDistance(p)<2.2+pad||FOREST_COTTAGES.some(h=>Math.abs(p.x-h.x)<6+pad&&Math.abs(p.z-h.z)<6.2+pad)||FOREST_GARDENS.some(g=>Math.abs(p.x-g.x)<4+pad&&Math.abs(p.z-g.z)<4+pad);}
export function nearbyGarden(p:Vec){return FOREST_GARDENS.findIndex(g=>distance(g,p)<3.8);}

export function forestTreeClearing(p:Vec,pad=0){return reservedForestPlace(p,pad)||[{x:32,z:-138,rx:24,rz:13},{x:58,z:-166,rx:18,rz:10}].map(forestPoint).some(c=>((p.x-c.x)/(c.rx+pad))**2+((p.z-c.z)/(c.rz+pad))**2<1);}
