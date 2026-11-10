import {CREATIVE_MEADOW,distance} from './map';
import type {Vec} from './map';
import {SHARED_FRIENDS} from './friends';
import type {Friends} from './friends';
export const BUILD_SAVE='vicky-creative-meadow-v1';
export const BUILD_LOT={x:-37,z:-2,size:18,height:8,limit:600};
export const BUILD_KINDS=[{name:'Tráva',color:'#80b849',icon:'🌱'},{name:'Dřevo',color:'#bd8d53',icon:'🪵'},{name:'Kámen',color:'#98a9ad',icon:'🪨'},{name:'Růžová',color:'#f29fc4',icon:'💗'},{name:'Květiny',color:'#eac55e',icon:'🌼'},{name:'Hvězda',color:'#f6aad4',icon:'⭐'},{name:'Voda',color:'#5cc3e8',icon:'💧'},{name:'Cihla',color:'#c9684f',icon:'🧱'},{name:'Mráček',color:'#f4f7fb',icon:'☁️'},{name:'Kouzlo',color:'#8d6fd1',icon:'🔮'},{name:'Zlato',color:'#f2c230',icon:'🪙'},{name:'Slunce',color:'#f59a3c',icon:'☀️'}];
// Friends bring cubes as gifts: the adventure feeds the building, which is where children return.
export const FRIEND_GIFTS=[{kind:6,friends:1},{kind:7,friends:2},{kind:8,friends:3},{kind:9,friends:5},{kind:10,friends:7}];
export const STAR_KIND=5,SUN_KIND=11;
export const giftAt=(friends:number)=>FRIEND_GIFTS.find(g=>g.friends===friends)?.kind??-1;
export type BuildCell={x:number;y:number;z:number;kind:number};
export type BuildSave={version:1;cells:BuildCell[]};
export const cellKey=(p:Pick<BuildCell,'x'|'y'|'z'>)=>`${p.x}:${p.y}:${p.z}`;
export const inBuildLot=(p:Vec,pad=0)=>p.x>=BUILD_LOT.x-pad&&p.x<BUILD_LOT.x+BUILD_LOT.size+pad&&p.z>=BUILD_LOT.z-pad&&p.z<BUILD_LOT.z+BUILD_LOT.size+pad;
export const meadowSanctuary=(p:Vec)=>distance(p,CREATIVE_MEADOW)<19;
const validCell=(p:BuildCell)=>p&&[p.x,p.y,p.z,p.kind].every(Number.isInteger)&&p.x>=0&&p.x<BUILD_LOT.size&&p.z>=0&&p.z<BUILD_LOT.size&&p.y>=0&&p.y<BUILD_LOT.height&&p.kind>=0&&p.kind<BUILD_KINDS.length;
const neighbors=(p:BuildCell)=>[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].map(([x,y,z])=>({...p,x:p.x+x,y:p.y+y,z:p.z+z}));
// Every structure must connect back to the ground; unsupported cubes return to the basket.
export function supportedCells(cells:BuildCell[]){const map=new Map(cells.map(c=>[cellKey(c),c])),seen=new Set<string>(),queue=cells.filter(c=>c.y===0);for(const c of queue)seen.add(cellKey(c));for(let i=0;i<queue.length;i++)for(const n of neighbors(queue[i])){const k=cellKey(n);if(!seen.has(k)&&map.has(k)){seen.add(k);queue.push(map.get(k)!);}}return cells.filter(c=>seen.has(cellKey(c)));}
export function validateBuild(v:unknown):v is BuildSave{if(!v||typeof v!=='object')return false;const s=v as BuildSave;return s.version===1&&Array.isArray(s.cells)&&s.cells.length<=BUILD_LOT.limit&&s.cells.every(validCell)&&new Set(s.cells.map(cellKey)).size===s.cells.length&&supportedCells(s.cells).length===s.cells.length;}
export class CreativeBuild {
 cells:BuildCell[]=[];starUnlocked=false;sunUnlocked=false;friends:Friends=SHARED_FRIENDS;
 unlocked(kind:number){const gift=FRIEND_GIFTS.find(g=>g.kind===kind);return kind===STAR_KIND?this.starUnlocked:kind===SUN_KIND?this.sunUnlocked:gift?this.friends.size>=gift.friends:kind>=0&&kind<STAR_KIND;}
 // The next present is shown as a wrapped teaser so the child always sees one reachable goal.
 nextGift(){const g=FRIEND_GIFTS.find(g=>this.friends.size<g.friends);return g?{kind:g.kind,missing:g.friends-this.friends.size}:null;}
 lockedNotice(kind:number){const gift=FRIEND_GIFTS.find(g=>g.kind===kind);return kind===STAR_KIND?'Hvězdnou kostku najdeš v Auriho pokladu.':kind===SUN_KIND?'Sluneční kostku najdeš v pokladu Zlaté pouště.':gift?`Tuhle kostku ti přinese kamarád. Osvoboď ještě ${gift.friends-this.friends.size}.`:'';}pan={x:0,z:0};inspiration=false;selected=0;erase=false;hover:BuildCell|null=null;yaw=0;zoom=1;revision=0;storageError=false;notice='Vyber kostku a klepni na louku.';history:BuildCell[][]=[];
 constructor(saved?:unknown){if(validateBuild(saved))this.cells=saved.cells.map(c=>({...c}));}
 panBy(dx:number,dz:number){this.pan.x=Math.max(-7,Math.min(7,this.pan.x+dx));this.pan.z=Math.max(-7,Math.min(7,this.pan.z+dz));this.hover=null;}
 resetView(){this.pan={x:0,z:0};this.yaw=0;this.zoom=1;this.hover=null;}
 save():BuildSave{return {version:1,cells:this.cells.map(c=>({...c}))};}
 at(p:Pick<BuildCell,'x'|'y'|'z'>){return this.cells.find(c=>cellKey(c)===cellKey(p));}
 canPlace(p:BuildCell){return validCell(p)&&this.unlocked(p.kind)&&this.cells.length<BUILD_LOT.limit&&!this.at(p)&&(p.y===0||neighbors(p).some(n=>this.at(n)));}
 private remember(){this.history.push(this.cells.map(c=>({...c})));if(this.history.length>50)this.history.shift();}
 place(p:BuildCell){if(!this.canPlace(p)){this.notice=validCell(p)&&!this.unlocked(p.kind)?this.lockedNotice(p.kind):this.cells.length>=BUILD_LOT.limit?'Košík je plný. Zkus gumu nebo krok zpátky.':p.y>=BUILD_LOT.height?'Věž už dosáhla na obláčky. Stav vedle.':p.x<0||p.z<0||p.x>=18||p.z>=18?'Stavíme jen na zelené louce.':this.at(p)?'Tady už kostka stojí. Klepni na její vršek.':'Kostka potřebuje volné místo a oporu.';return false;}this.remember();this.cells=[...this.cells,{...p}];this.revision++;this.notice='Šikovné ruce, Vikoušku!';return true;}
 remove(p:BuildCell){if(!this.at(p))return false;this.remember();const left=this.cells.filter(c=>cellKey(c)!==cellKey(p));this.cells=supportedCells(left);this.revision++;this.notice=this.cells.length<left.length?'Kostky bez opory se vrátily do košíku.':'Kostka je zpátky v košíku.';return true;}
 undo(){const last=this.history.pop();if(!last)return;this.cells=last;this.revision++;this.notice='Poslední krok je zpátky.';}
 blocksColumn(p:Vec){if(!inBuildLot(p,.4))return false;return this.cells.some(c=>Math.abs(p.x-(BUILD_LOT.x+c.x+.5))<1&&Math.abs(p.z-(BUILD_LOT.z+c.z+.5))<1);}
 blocksWalking(p:Vec){if(!inBuildLot(p,.4))return false;return this.cells.some(c=>c.y<2&&Math.abs(p.x-(BUILD_LOT.x+c.x+.5))<.85&&Math.abs(p.z-(BUILD_LOT.z+c.z+.5))<.85);}
}
// Optional picture guide, never inserts or replaces the child's saved cubes.
export const HOUSE_BLUEPRINT:BuildCell[]=(()=>{const b:BuildCell[]=[];for(let x=6;x<=11;x++)for(let z=6;z<=11;z++)for(let y=0;y<3;y++){if(x!==6&&x!==11&&z!==6&&z!==11)continue;if(z===11&&[8,9].includes(x)&&y<2)continue;if(y===1&&(x===6||x===11)&&[8,9].includes(z))continue;b.push({x,y,z,kind:1});}for(let y=3;y<=6;y++)for(let x=5+y-3;x<=12-(y-3);x++)for(let z=5;z<=12;z++)b.push({x,y,z,kind:3});return b;})();
