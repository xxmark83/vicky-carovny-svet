import type {Block} from './world';
export const ANIMAL_KINDS=['cow','panda','blue','pig','sheep','bunny','cat'] as const;
export type AnimalKind=typeof ANIMAL_KINDS[number];
export const ANIMAL_NAMES:Record<AnimalKind,string>={cow:'Kravička',panda:'Panda',blue:'Modrý kamarát',pig:'Prasiatko',sheep:'Ovečka',bunny:'Zajačik',cat:'Mačička'};
export const ANIMAL_CELL=.115;
const cache=new Map<string,Block[]>();
// Reinterpret the supplied characters as sculpted volumes, on the same small
// voxel lattice as before. Full volumes let the renderer discard hidden faces.
function sculpt(kind:number,happy:boolean):Block[]{
 const voxels=new Map<string,{x:number;y:number;z:number;c:string}>(),put=(x:number,y:number,z:number,c:string)=>voxels.set(`${x}:${y}:${z}`,{x,y,z,c});
 const box=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,c:string|((x:number,y:number,z:number)=>string),round=false)=>{const cx=(x0+x1)/2,cy=(y0+y1)/2,cz=(z0+z1)/2;for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++){if(round&&((x-cx)/((x1-x0)/2+.7))**4+((y-cy)/((y1-y0)/2+.7))**4+((z-cz)/((z1-z0)/2+.7))**4>1.6)continue;put(x,y,z,typeof c==='string'?c:c(x,y,z));}};
 const white='#f2efe0',black='#30363e',pink='#efa3ba',orange='#d79a51';
 const legs=(x:number,z0:number,z1:number,top:number,c:string,hoof:string)=>{for(const side of [-1,1])for(const z of [z0,z1]){box(side*x-1,side*x+1,1,top,z-1,z+1,c);box(side*x-1,side*x+1,0,1,z-1,z+2,hoof);}};
 const face=(y:number,z:number,x=2,sideZ?:number,sideX=4)=>{for(const side of [-1,1]){if(happy){for(let i=-1;i<=1;i++)put(side*x+i,y+(i===0?1:0),z,black);put(side*(x+1),y-1,z,pink);}else{box(side*x,side*x,y,y+1,z,z,black);put(side*x,y+1,z+1,'#fff8eb');}if(sideZ!==undefined){if(happy){for(let i=-1;i<=1;i++)put(side*sideX,y+(i===0?1:0),sideZ+i,black);put(side*sideX,y-1,sideZ+1,pink);}else{put(side*sideX,y,sideZ,black);put(side*sideX,y+1,sideZ,black);put(side*(sideX+1),y+1,sideZ,white);}}}
  if(happy)for(let i=-1;i<=1;i++)put(i,y-3+Math.abs(i),z+1,'#bd6886');};
 if(kind===0){ // Dairy cow: long belly, four hooves, muzzle, horns, both-side patches.
  box(-4,4,5,11,-6,3,(x,y,z)=>((x+2)**2+(z+3)**2<8||x>1&&z>0&&y>7)?black:white,true);legs(3,-4,2,6,white,black);
  box(-3,3,10,15,3,8,white,true);box(-3,3,9,12,8,10,pink,true);put(-2,11,11,'#a36279');put(2,11,11,'#a36279');
  for(const side of [-1,1]){box(side*5-1,side*5+1,13,14,4,5,white);put(side*5,14,6,pink);box(side*2,side*2,16,17,5,6,'#d7b779');box(side*3,side*3,17,17,5,6,'#ead5a3');}box(0,0,6,10,-8,-7,white);box(-1,1,5,6,-9,-8,black);face(13,9,2,6,4);
 }else if(kind===1){ // Panda: rounded belly and separate arms/ears, not an extruded sprite.
  box(-4,4,4,10,-3,3,white,true);box(-4,4,8,10,-3,3,black,true);for(const side of [-1,1]){box(side*5-1,side*5+1,5,9,-1,2,black,true);box(side*2-1,side*2+1,0,3,-2,3,black,true);box(side*4-1,side*4+1,16,17,-1,1,black,true);}box(-4,4,11,16,-3,3,white,true);
  for(const side of [-1,1])box(side*2-1,side*2+1,12,14,4,4,black);box(-2,2,10,12,4,5,white,true);put(0,12,6,black);face(13,5,2,1,5);
 }else if(kind===2){
  box(-3,3,3,10,-3,3,'#4498d2',true);box(-2,2,4,8,4,4,'#83daca');box(-4,4,11,16,-3,3,'#539edb',true);box(-3,3,11,14,4,4,'#8de0ce');
  for(const side of [-1,1]){box(side*5-1,side*5,6,9,-1,1,'#448ac2',true);box(side*2-1,side*2+1,0,2,-1,3,'#356bb0',true);put(side*3,17,0,'#78c5ed');}face(13,5,2,1,5);
 }else if(kind===3){
  box(-4,4,4,9,-5,3,'#ed9ab7',true);legs(3,-3,2,4,'#e993b0','#b86c91');box(-3,3,8,12,2,7,'#f4b2c5',true);box(-2,2,8,10,8,9,'#dc7fa1',true);put(-1,9,10,'#99556e');put(1,9,10,'#99556e');for(const side of [-1,1])box(side*3-1,side*3,13,14,3,4,pink);for(const [y,z] of [[7,-6],[8,-7],[9,-6],[9,-5]])put(1,y,z,'#d87f9e');face(11,8,2,5,4);
 }else if(kind===4){
  box(-4,4,4,11,-5,3,'#e9e1cb',true);for(let i=0;i<12;i++)box(-3+i%4*2,-2+i%4*2,10+(i%2),12+(i%2),-4+Math.floor(i/4)*3,-3+Math.floor(i/4)*3,i%2?'#f7edda':'#ddd5be',true);legs(3,-3,2,4,'#65585d','#4d4750');box(-3,3,8,12,3,7,'#63585d',true);box(-4,-3,10,11,4,5,'#a48a8e');box(3,4,10,11,4,5,'#a48a8e');box(-1,1,9,10,8,8,'#ad8d8c');face(11,8,2,5,4);box(-1,1,7,8,-7,-6,white);
 }else if(kind===5){
  box(-3,3,3,8,-4,2,white,true);box(-3,3,8,12,1,6,white,true);for(const side of [-1,1]){box(side*2-1,side*2+1,13,17,2,3,white,true);box(side*2,side*2,14,16,4,4,pink);box(side*3-1,side*3+1,0,2,-2,3,white,true);box(side*2,side*2,4,6,4,5,white);}box(-1,1,4,6,-6,-5,white,true);put(0,9,7,pink);face(11,7,2,4,4);
 }else{
  box(-3,3,4,8,-5,3,orange,true);legs(2,-3,2,4,orange,'#f5dfb5');box(-3,3,9,12,3,7,'#dfa45e',true);box(-2,2,8,10,8,8,'#f2ddb6');put(0,10,9,'#c57f89');for(const side of [-1,1]){box(side*3-1,side*3,13,14,4,5,orange);put(side*3,13,6,pink);for(let z=-4;z<3;z+=3)box(side*3,side*3,6,7,z,z,'#ae723c');}for(let i=0;i<8;i++)box(1,2,6+Math.floor(i*.65),6+Math.floor(i*.65),-6-Math.floor(i*.4),-6-Math.floor(i*.4),i%3?'#d79a51':'#aa733c');face(11,8,2,5,4);
 }
 if(happy){const top=Math.max(...[...voxels.values()].map(v=>v.y))+4;for(const [x,y] of [[-1,1],[1,1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,-1],[0,-1],[1,-1],[0,-2]])put(x,top+y,0,y===1?'#ffe7f1':'#ed91b5');}
 return [...voxels.values()].map(v=>({p:[v.x*ANIMAL_CELL,(v.y+.5)*ANIMAL_CELL,v.z*ANIMAL_CELL],s:[ANIMAL_CELL,ANIMAL_CELL,ANIMAL_CELL],c:v.c}));
}
export function creatureBlocks(kind:number):Block[]{kind=((kind%7)+7)%7;const key=`${kind}:false`;if(!cache.has(key))cache.set(key,sculpt(kind,false));return cache.get(key)!;}
export function happyCreatureBlocks(kind:number):Block[]{kind=((kind%7)+7)%7;const key=`${kind}:true`;if(!cache.has(key))cache.set(key,sculpt(kind,true));return cache.get(key)!;}

export function shellBlocks(blocks:Block[]){const key=(p:number[])=>p.map((v,i)=>Math.round(v/ANIMAL_CELL-(i===1?.5:0))).join(':');const filled=new Set(blocks.map(b=>key(b.p)));return blocks.filter(b=>[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].some(d=>!filled.has(key(b.p.map((v,i)=>v+d[i]*ANIMAL_CELL)))));}
