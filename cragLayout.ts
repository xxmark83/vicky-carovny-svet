import {CASTLE,BRIDGE,FOREST_BOUNDS,valleyElevation} from './valleyLayout';
import {random} from './map';
import {groundHeight} from './terrain';
// 3.9.0 forest only. A craggy wall with two waterfalls rises behind the castle, beyond the edge of the walkable world.
// The stone dressing of the bridge sits outside its railings. Decoration; never an obstacle.
export type Crag={x:number;y:number;z:number;w:number;h:number;d:number;yaw:number;tone:number;green:boolean};
export const CRAG_TONES=['#8e9b97','#a3aba3','#7b8c8c','#b4b8ab'];
export const CRAG_FALLS=[-36,36].map(dx=>({x:CASTLE.x+dx,z:FOREST_BOUNDS.minZ-3.5,width:7,height:34}));
export function cragLayout(){const rng=random(39000),crags:Crag[]=[],base=groundHeight(CASTLE);
 for(let row=0;row<4;row++)for(let i=0;i<15;i++){const x=CASTLE.x-84+i*12+(rng()-.5)*5,z=FOREST_BOUNDS.minZ-9-row*6.5-rng()*2,centre=1-Math.min(1,Math.abs(x-CASTLE.x)/90),h=(14+row*9+rng()*8)*(.55+centre*.6),nearFall=CRAG_FALLS.some(f=>Math.abs(x-f.x)<f.width*.5+3.5);
  if(nearFall&&row===0)continue;crags.push({x,y:base+h/2-2,z,w:11+rng()*5,h,d:8+rng()*4,yaw:(rng()-.5)*.5,tone:Math.floor(rng()*CRAG_TONES.length),green:rng()<.6});}
 return crags;}
export const BRIDGE_HALF_WIDTH=5.25;
export function bridgeDress(){const y=valleyElevation(BRIDGE.z),stones:{x:number;y:number;z:number;w:number;h:number;d:number;tone:number}[]=[],lamps:{x:number;y:number;z:number}[]=[];
 for(const side of [-1,1]){const x=BRIDGE.x+side*(BRIDGE_HALF_WIDTH+.35);for(let i=0;i<14;i++){const z=BRIDGE.z-10.2+i*1.56;stones.push({x,y:y+.55,z,w:.7,h:1.1,d:1.5,tone:i%4});if(i%2===0)stones.push({x,y:y+1.3,z,w:.74,h:.4,d:.8,tone:(i+2)%4});}
  for(const z of [BRIDGE.z-10.6,BRIDGE.z+10.6]){stones.push({x,y:y+1.1,z,w:1.1,h:2.6,d:1.1,tone:3});lamps.push({x,y:y+2.75,z});}}
 const arches=[-6.6,0,6.6].map(dz=>({x:BRIDGE.x,y:y-3.3,z:BRIDGE.z+dz,radius:2.9}));return {stones,lamps,arches,y};}
