import {pathDistance,random} from './map';
import {groundHeight} from './terrain';
// 3.8.0 forest only: trees near the trail gain blossom in their crowns, a mossy foot and a flowering vine. Decoration; never an obstacle.
export const CANOPY_COLORS=['#ffb1d4','#ff8cc2','#fff1f5','#d9b3ff','#5f9a3c','#7db04a','#4f8636'];
export const CANOPY_CELL=32;
export type Puff={x:number;y:number;z:number;size:number;flat:number;color:number};
type Tree={x:number;z:number;kind:string;radius:number;height:number};
export function canopyLayout(obstacles:Tree[],low=false){const cells=new Map<string,Puff[]>(),add=(p:Puff)=>{const key=`${Math.floor(p.x/CANOPY_CELL)}:${Math.floor(p.z/CANOPY_CELL)}`;let list=cells.get(key);if(!list)cells.set(key,list=[]);list.push(p);};
 obstacles.forEach((o,index)=>{if(o.kind!=='tree')return;const d=pathDistance(o);if(d>(low?10:16))return;const rng=random(9100+index*17),ground=groundHeight(o);
  add({x:o.x,y:ground+.05,z:o.z,size:1.5+rng()*.7,flat:.3,color:4+Math.floor(rng()*3)});
  if(rng()<.4){const tint=Math.floor(rng()*4);for(let i=0;i<(low?6:13);i++){const a=rng()*Math.PI*2,r=1+rng()*2.2;add({x:o.x+Math.cos(a)*r,y:ground+o.height*(.6+rng()*.32),z:o.z+Math.sin(a)*r,size:.9+rng()*.8,flat:.8,color:rng()<.8?tint:Math.floor(rng()*4)});}}
  if(!low&&d<9&&rng()<.7){const turn=rng()*6.28,dir=rng()<.5?1:-1,tint=Math.floor(rng()*4);for(let i=0;i<10;i++){const a=turn+dir*i*.85;add({x:o.x+Math.cos(a)*.42,y:ground+.45+i*.36,z:o.z+Math.sin(a)*.42,size:.2+rng()*.1,flat:1,color:i%3===1?tint:5});}}
 });return [...cells.entries()].map(([key,puffs])=>{const [cx,cz]=key.split(':').map(Number);return {key,x:(cx+.5)*CANOPY_CELL,z:(cz+.5)*CANOPY_CELL,puffs};});}
// World-anchored spots where a sunbeam falls through the leaves, so the beams stay put while the heroine walks past.
export const SHAFT_GRID=13;
export function sunShaftSpots(center:{x:number;z:number},low=false){const spots:{x:number;z:number;fade:number}[]=[],cx=Math.round(center.x/SHAFT_GRID),cz=Math.round(center.z/SHAFT_GRID);for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const gx=cx+i,gz=cz+j,h=Math.abs(Math.sin(gx*127.1+gz*311.7)*43758.5453)%1;if(h>(low?.14:.28))continue;const x=gx*SHAFT_GRID+(h*7.3%1-.5)*8,z=gz*SHAFT_GRID+(h*13.7%1-.5)*8,fade=Math.min(1,Math.max(0,(34-Math.hypot(x-center.x,z-center.z))/12));if(fade>0&&pathDistance({x,z})>1.5)spots.push({x,z,fade});}return spots;}
