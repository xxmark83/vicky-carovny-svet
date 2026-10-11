import {SCENES} from './adventure';
import { CHEST, GEMS, OBSTACLES, PATH, SHRINES, distance, groundHeight, pathDistance, random, NEW_GLADES, WORLD_BOUNDS } from './game';
import type { Vec } from './game';
export type Block={p:[number,number,number];s:[number,number,number];c:string;r?:number};
export type Surface='grass'|'earth'|'bark'|'leaf'|'stone'|'decor';
export type WorldChunk={key:string;surface:Surface;blocks:Block[]};
export function createLandscape(low=false):WorldChunk[]{
 const chunks=new Map<string,WorldChunk>();const rng=random(12026);
 const add=(surface:Surface,p:[number,number,number],s:[number,number,number],c:string,r=0)=>{const key=`${Math.floor(p[0]/28)}:${Math.floor(p[2]/28)}:${surface}`;if(!chunks.has(key))chunks.set(key,{key,surface,blocks:[]});chunks.get(key)!.blocks.push({p,s,c,r});};
 for(const [i,o] of OBSTACLES.entries()){
  if(o.kind==='rock'&&o.x===17&&o.z===-52)continue;const y=groundHeight(o),theme=SCENES.findIndex(p=>distance(p,o)<p.r+9);
  if(o.kind==='rock'){add('stone',[o.x,y+o.height*.4,o.z],[o.radius*1.4,o.height,o.radius*1.3],['#79877f','#8e9a8b','#6d7b75'][i%3],o.variant);add('grass',[o.x,y+o.height*.9,o.z],[o.radius*1.35,.24,o.radius*1.25],'#668e33');continue;}
  const h=o.height*(o.variant===2?.7:1);const trunk=o.variant===4?1.05:.75;add('bark',[o.x,y+h*.39,o.z],[trunk,h*.78,trunk],theme===1||theme===4?'#eee8d3':o.variant===1?'#b49a6d':'#b2824e');
  for(let j=0;j<(low?2:4);j++){const a=j*1.6+o.variant;add('bark',[o.x+Math.sin(a)*.65,y+.17,o.z+Math.cos(a)*.65],[.3,.35,1.8],'#80522f',a);}
  const colors=theme===7?['#e89dc0','#d77bb0','#eeb5cc']:theme===1?['#b4cb73','#c4d48a','#93b95c']:theme===4?['#8bb796','#a2c6a3','#74a888']:theme===6?['#6499a3','#78aca9','#6d9d85']:o.variant===3?['#ca72a3','#df92b8','#ac5287']:o.variant===2?['#6d9e28','#8fb83e','#547c27']:['#397b30','#57973b','#80ac43'];
  const leafSize=low?1.4:.9,rx=o.variant===2?2.3:3.1+(i%4)*.18,ry=o.variant===2?3.6:2.3+(i%3)*.25;
  for(let iy=-2;iy<=2;iy++)for(let ix=-3;ix<=3;ix++)for(let iz=-3;iz<=3;iz++){
   const px=ix*leafSize,pz=iz*leafSize,py=iy*leafSize;const bend=Math.sin(iy*.9+i)*.42;const norm=((px-bend)**2+(pz-Math.cos(i)*.35)**2)/(rx*rx)+py*py/(ry*ry);if(norm>1.12||norm<.48||rng()<.08)continue;
   add('leaf',[o.x+px,y+h*.72+py+1,o.z+pz],[leafSize*1.02,leafSize*1.02,leafSize*1.02],colors[Math.floor(rng()*3)]);
  }
  add('leaf',[o.x,y+h*.72+3,o.z],[leafSize,leafSize,leafSize],colors[1]);
  if(!low){add('bark',[o.x+1,y+h*.64,o.z],[2.6,.35,.4],'#875731',.35);add('bark',[o.x-.8,y+h*.7,o.z+.5],[2.1,.3,.4],'#875731',-.4);for(let j=0;j<3;j++){const a=j*2.1+i;add('leaf',[o.x+Math.sin(a)*2.15,y+h*.7+.5+j*.35,o.z+Math.cos(a)*2.15],[2.2,1.6,2.1],colors[j]);}}
 }
 // Dense wildflower strips hug both sides of the path; decorative plants never block controls.
 const plant=(p:Vec,i:number)=>{if(p.z>-43&&p.z<-12&&Math.abs(p.x-(18+Math.sin((p.z+38)/1.45*.35)*2))<2)return;if(distance(p,{x:10,z:-98})<3.8||p.z<-146&&p.z>-158||distance(p,CHEST)<5||SHRINES.some(s=>distance(s,p)<2.8))return;const y=groundHeight(p);const a=rng()*Math.PI;const h=.35+rng()*.6;
  if(i%4===0){const c=['#fff5c5','#ff9cc1','#9acbef','#ffd25c','#df72af'][i%5];add('decor',[p.x,y+h*.5,p.z],[.07,h,.07],'#437b28');add('decor',[p.x,y+h,p.z],[.37,.12,.37],c);add('decor',[p.x,y+h+.075,p.z],[.12,.08,.12],'#f5ca4e');if(!low){add('decor',[p.x+.21,y+h-.03,p.z],[.13,.12,.2],c);add('decor',[p.x-.21,y+h-.03,p.z],[.13,.12,.2],c);}}
  else if(i%9===0){add('decor',[p.x,y+.24,p.z],[.13,.48,.13],'#e7d7aa');add('decor',[p.x,y+.48,p.z],[.65,.2,.63],i%2?'#ec847b':'#dca94c');add('decor',[p.x-.13,y+.59,p.z+.05],[.16,.035,.16],'#fff0c4');}
  else{add('leaf',[p.x,y+h*.35,p.z],[.13,h*.7,.12],'#3e752d');for(let j=0;j<(low?2:3);j++)add('leaf',[p.x+Math.sin(a+j*2.1)*.2,y+h*.35,p.z+Math.cos(a+j*2.1)*.2],[.17,.13,.75],['#7aaa38','#58942f','#8eb941'][i%3],a+j*2.1);}
 };
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),nx=(b.z-a.z)/len,nz=-(b.x-a.x)/len;for(let d=0;d<len;d+=low?1.2:.65)for(const side of [-1,1])for(let k=0;k<(low?2:3);k++){const off=2.6+k*.75+rng()*.35;plant({x:a.x+(b.x-a.x)*d/len+nx*side*off,z:a.z+(b.z-a.z)*d/len+nz*side*off},Math.floor(rng()*10000));}}
 for(let i=0;i<(low?1750:4000);i++){const p={x:WORLD_BOUNDS.minX+rng()*175,z:24-rng()*342};if(pathDistance(p)>2.4)plant(p,i);}
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),nx=(b.z-a.z)/len,nz=-(b.x-a.x)/len;for(let d=2;d<len;d+=low?7:4)for(const side of [-1,1]){const p={x:a.x+(b.x-a.x)*d/len+nx*side*(4.8+rng()*1.3),z:a.z+(b.z-a.z)*d/len+nz*side*(4.8+rng()*1.3)};if(GEMS.some(g=>distance(g,p)<3)||SHRINES.some(g=>distance(g,p)<5)||distance(p,CHEST)<9||p.z<-145&&p.z>-160)continue;const y=groundHeight(p),h=.7+rng()*.9;add('leaf',[p.x,y+h*.5,p.z],[1.8,h,1.6],side>0?'#6e9b33':'#4d872f');add('leaf',[p.x+.4,y+h,p.z],[1.2,.7,1.3],'#81aa39');}}
 // Leafy understory fills the wide gaps while keeping gems and shrine clearings readable.
 for(let i=0;i<(low?525:950);i++){const p={x:WORLD_BOUNDS.minX+rng()*175,z:24-rng()*342};if(SCENES.some(m=>distance(m,p)<5)||pathDistance(p)<4.2||GEMS.some(g=>distance(g,p)<2.5)||SHRINES.some(g=>distance(g,p)<4)||distance(p,CHEST)<8||p.z<-145&&p.z>-160)continue;const y=groundHeight(p);add('leaf',[p.x,y+.55,p.z],[1.5,.95,1.4],i%3?'#477c29':'#719b31');add('leaf',[p.x+.5,y+.9,p.z],[.9,.6,1],'#699d36');}
 for(let i=0;i<100;i++){const a=i*2.399,r=6+(i%9)*.9;plant({x:CHEST.x+Math.sin(a)*r,z:CHEST.z+Math.cos(a)*r},i*4);}
 for(const p of SHRINES)for(let i=0;i<16;i++){const a=i*Math.PI/8;plant({x:p.x+Math.sin(a)*4.5,z:p.z+Math.cos(a)*4.5},i*4);}
 return [...chunks.values()];
}

export function gladeBlocks():Block[]{const b:Block[]=[];const add=(x:number,y:number,z:number,s:[number,number,number],c:string)=>b.push({p:[x,y,z],s,c});for(const p of NEW_GLADES){const h=groundHeight(p);if(p.kind===0||p.kind===3){ // Fallen tree and a ring of oversized spotted mushrooms.
 add(p.x,h+.8,p.z,[8,1.6,1.6],'#8c623d');add(p.x+4.05,h+.8,p.z,[.08,1.35,1.35],'#e5be7c');for(let i=0;i<9;i++){const x=p.x+Math.sin(i*2.4)*5,z=p.z+Math.cos(i*2.4)*5,y=groundHeight({x,z});add(x,y+.6,z,[.4,1.2,.4],'#e5dab2');add(x,y+1.3,z,[1.5,.4,1.5],p.kind===0?'#e696ad':'#72c4b0');add(x+.25,y+1.53,z+.2,[.3,.05,.3],'#fff2cf');}}
 else if(p.kind===1||p.kind===4){ // Ancient stone circle and giant ferns.
 for(let i=0;i<7;i++){const x=p.x+Math.sin(i*Math.PI*2/7)*5,z=p.z+Math.cos(i*Math.PI*2/7)*5,y=groundHeight({x,z});add(x,y+1.4,z,[1,2.8,1.2],'#82978c');add(x,y+2.85,z,[1.2,.2,1.3],'#74a24e');}for(let i=0;i<12;i++){const a=i*2.4,x=p.x+Math.sin(a)*7,z=p.z+Math.cos(a)*7,y=groundHeight({x,z});add(x,y+.8,z,[.16,1.6,.16],'#486f2c');for(let j=0;j<4;j++){b.push({p:[x,y+.6+j*.23,z],s:[2-j*.3,.14,.45],c:'#81b244',r:a+j*.6});}}}
 else{ // Small lookout terraces and lantern poles.
 for(let i=0;i<3;i++)add(p.x,h+.35+i*.4,p.z-i*1.4,[8-i*1.5,.7,4],'#9caa90');for(const side of [-1,1]){add(p.x+side*4,h+2,p.z,[.3,4,.3],'#987344');add(p.x+side*4,h+3.7,p.z,[.8,.9,.8],'#ffe7a1');}for(let i=0;i<7;i++)add(p.x-3+i,h+1.7,p.z-3,[.2,1.3,.2],'#d2ad72');}
 }return b;}
