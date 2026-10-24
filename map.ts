import {forestPoint,FOREST_BOUNDS,FOREST_FLIGHT_Y} from './valleyLayout';
import {FOREST_LEVEL} from './levelConfig';
export type Vec = { x: number; z: number };
export const PATH: Vec[] = [{x:0,z:16},{x:0,z:-27},{x:-30,z:-52},{x:-40,z:-88},{x:0,z:-109},{x:32,z:-139},{x:32,z:-169},{x:-22,z:-201},{x:-38,z:-239},{x:0,z:-265},{x:0,z:-303}].map(forestPoint);
export const GEMS: Vec[] = [{x:11,z:-24},{x:-24,z:-39},{x:-54,z:-75},{x:-21,z:-94},{x:20,z:-117},{x:48,z:-163},{x:5,z:-190},{x:-46,z:-218},{x:-16,z:-259},{x:16,z:-286}].map(forestPoint);
export const SHRINES: Vec[] = [{x:-40,z:-87},{x:32,z:-171},{x:-38,z:-240}].map(forestPoint);
export const SHRINE_NAMES=['Světlo kořenů','Píseň potoka','Srdce lesa'];
export const SHRINE_STORIES=['Vikoušek: První světlo je zpátky! Auri, už zase vesele létáš. Pojďme k potoku.','Vikoušek: Slyšíš, jak potok zpívá? Za mostem čeká poslední světlo.','Vikoušek: Auri znovu září! Ještě osvobodíme strážce zlatého pokladu.'];
export const ZONES=['Světlušková mýtina','Háje starých dubů','Stříbrný potok','Šeptající les','Zahrada pokladů'];
export const zoneIndex=(z:number)=>z>forestPoint({x:0,z:-55}).z?0:z>forestPoint({x:0,z:-110}).z?1:z>forestPoint({x:0,z:-180}).z?2:z>forestPoint({x:0,z:-250}).z?3:4;
export const attackRadius=(e:{type:number;attackKind:string})=>e.type===2?(e.attackKind==='wave'?5.5:2.8):2.1;
export const CHEST: Vec = forestPoint({x:0,z:-303});
export const HEALS: Vec[] = [{x:-10,z:-25},{x:-34,z:-65},{x:-20,z:-102},{x:22,z:-136},{x:22,z:-171},{x:-15,z:-198},{x:-32,z:-245},{x:8,z:-281}].map(forestPoint);
export const distance = (a:Vec,b:Vec) => Math.hypot(a.x-b.x,a.z-b.z);
export function segmentDistance(p:Vec,a:Vec,b:Vec) {const dx=b.x-a.x,dz=b.z-a.z; const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);}
export function pathDistance(p:Vec){return Math.min(...PATH.slice(1).map((b,i)=>segmentDistance(p,PATH[i],b)));}
export function random(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export const ENEMY_HOMES:Vec[]=[{x:8,z:-25},{x:-22,z:-43},{x:-45,z:-80},{x:-35,z:-90},{x:16,z:-119},{x:39,z:-164},{x:27,z:-178},{x:1,z:-191},{x:-42,z:-234},{x:-31,z:-244},{x:-12,z:-262},{x:9,z:-286},{x:0,z:-295}].map(forestPoint);

export const WALK_SPEED=2.6*1.4;
export const FLIGHT_SPEED=10;
export const WORLD_BOUNDS=FOREST_BOUNDS;
export const CREATIVE_MEADOW={x:-28,z:7,r:16,gate:{x:-15,z:15}};
export const MEADOWS=[{x:24,z:-18,r:13,name:'Květinový vršek'},{x:-18,z:-65,r:12,name:'Motýlí louka'},{x:10,z:-98,r:13,name:'Výhled na háj'},{x:-9,z:-130,r:12,name:'Zelený svah'},{x:4,z:-181,r:13,name:'Březová louka'},{x:27,z:-214,r:13,name:'Slunečná stráň'},{x:-3,z:-249,r:12,name:'Mechové údolí'},{x:-23,z:-281,r:11,name:'Zahrada Auriho'}].map(forestPoint);

export const FLIGHT_Y=FOREST_FLIGHT_Y;
export const INTRO_SECONDS=FOREST_LEVEL.introSeconds;
export const NEW_GLADES=[{x:-77,z:-25,r:8,kind:0},{x:77,z:-68,r:9,kind:1},{x:-77,z:-116,r:8,kind:2},{x:77,z:-188,r:9,kind:3},{x:-77,z:-257,r:8,kind:4},{x:77,z:-285,r:8,kind:5}].map(forestPoint).map(p=>({...p,x:p.kind===3||p.kind===5?p.x+30:p.x}));
