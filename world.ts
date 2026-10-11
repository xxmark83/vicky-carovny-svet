import {SCENES} from './adventure';
import { CHEST, GEMS, OBSTACLES, PATH, SHRINES, distance, groundHeight, pathDistance, random } from './game';
import type { Vec } from './game';
export type Block={p:[number,number,number];s:[number,number,number];c:string;r?:number};
export type Surface='grass'|'earth'|'bark'|'leaf'|'stone'|'decor';
export type WorldChunk={key:string;surface:Surface;blocks:Block[]};
export function createLandscape(low=false):WorldChunk[]{
 const chunks=new Map<string,WorldChunk>();const rng=random(12026);
 const add=(surface:Surface,p:[number,number,number],s:[number,number,number],c:string,r=0)=>{const key=`${Math.floor(p[0]/28)}:${Math.floor(p[2]/28)}:${surface}`;if(!chunks.has(key))chunks.set(key,{key,surface,blocks:[]});chunks.get(key)!.blocks.push({p,s,c,r});};
 for(const [i,o] of OBSTACLES.entries()){
  const y=groundHeight(o),theme=SCENES.findIndex(p=>distance(p,o)<p.r+9);
  if(o.kind==='rock'){add('stone',[o.x,y+o.height*.4,o.z],[o.radius*1.4,o.height,o.radius*1.3],['#79877f','#8e9a8b','#6d7b75'][i%3],o.variant);add('grass',[o.x,y+o.height*.9,o.z],[o.radius*1.35,.24,o.radius*1.25],'#668e33');continue;}
  const h=o.height*(o.variant===2?.7:1);const trunk=o.variant===4?1.05:.75;add('bark',[o.x,y+h*.39,o.z],[trunk,h*.78,trunk],theme===1||theme===4?'#eee8d3':o.variant===1?'#b49a6d':'#b2824e');
  for(let j=0;j<(low?2:4);j++){const a=j*1.6+o.variant;add('bark',[o.x+Math.sin(a)*.65,y+.17,o.z+Math.cos(a)*.65],[.3,.35,1.8],'#80522f',a);}
  const colors=theme===7?['#e89dc0','#d77bb0','#eeb5cc']:theme===1?['#b4cb73','#c4d48a','#93b95c']:theme===4?['#8bb796','#a2c6a3','#74a888']:theme===6?['#6499a3','#78aca9','#6d9d85']:o.variant===3?['#ca72a3','#df92b8','#ac5287']:o.variant===2?['#6d9e28','#8fb83e','#547c27']:['#2e6e2d','#438832','#589c3e'];
  const leafSize=low?1.45:.95,rx=o.variant===2?2.4:3.2,ry=o.variant===2?3.3:2.5;
  for(let iy=-2;iy<=2;iy++)for(let ix=-3;ix<=3;ix++)for(let iz=-3;iz<=3;iz++){
   const px=ix*leafSize,pz=iz*leafSize,py=iy*leafSize;const norm=(px*px+pz*pz)/(rx*rx)+py*py/(ry*ry);if(norm>1.12||norm<.48||rng()<.08)continue;
   add('leaf',[o.x+px,y+h*.72+py+1,o.z+pz],[leafSize*1.02,leafSize*1.02,leafSize*1.02],colors[Math.floor(rng()*3)]);
  }
  add('leaf',[o.x,y+h*.72+3,o.z],[leafSize,leafSize,leafSize],colors[1]);
  if(!low){add('bark',[o.x+1,y+h*.64,o.z],[2.6,.35,.4],'#875731',.35);add('bark',[o.x-.8,y+h*.7,o.z+.5],[2.1,.3,.4],'#875731',-.4);}
 }
 // Dense wildflower strips hug both sides of the path; decorative plants never block controls.
 const plant=(p:Vec,i:number)=>{if(distance(p,{x:10,z:-98})<3.8||p.z<-146&&p.z>-158||distance(p,CHEST)<5||SHRINES.some(s=>distance(s,p)<2.8))return;const y=groundHeight(p);const a=rng()*Math.PI;const h=.35+rng()*.6;
  if(i%4===0){const c=['#fff5c5','#ff9cc1','#9acbef','#ffd25c','#df72af'][i%5];add('decor',[p.x,y+h*.5,p.z],[.07,h,.07],'#437b28');add('decor',[p.x,y+h,p.z],[.37,.12,.37],c);add('decor',[p.x,y+h+.075,p.z],[.12,.08,.12],'#f5ca4e');if(!low){add('decor',[p.x+.21,y+h-.03,p.z],[.13,.12,.2],c);add('decor',[p.x-.21,y+h-.03,p.z],[.13,.12,.2],c);}}
  else if(i%9===0){add('decor',[p.x,y+.24,p.z],[.13,.48,.13],'#e7d7aa');add('decor',[p.x,y+.48,p.z],[.65,.2,.63],i%2?'#ec847b':'#dca94c');add('decor',[p.x-.13,y+.59,p.z+.05],[.16,.035,.16],'#fff0c4');}
  else{add('leaf',[p.x,y+h*.35,p.z],[.13,h*.7,.12],'#3e752d');for(let j=0;j<(low?2:3);j++)add('leaf',[p.x+Math.sin(a+j*2.1)*.2,y+h*.35,p.z+Math.cos(a+j*2.1)*.2],[.17,.13,.75],['#7aaa38','#58942f','#8eb941'][i%3],a+j*2.1);}
 };
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),nx=(b.z-a.z)/len,nz=-(b.x-a.x)/len;for(let d=0;d<len;d+=low?1.2:.65)for(const side of [-1,1])for(let k=0;k<(low?2:3);k++){const off=2.6+k*.75+rng()*.35;plant({x:a.x+(b.x-a.x)*d/len+nx*side*off,z:a.z+(b.z-a.z)*d/len+nz*side*off},Math.floor(rng()*10000));}}
 for(let i=0;i<(low?1400:3200);i++){const p={x:rng()*144-72,z:24-rng()*345};if(pathDistance(p)>2.4)plant(p,i);}
 for(let i=1;i<PATH.length;i++){const a=PATH[i-1],b=PATH[i],len=distance(a,b),nx=(b.z-a.z)/len,nz=-(b.x-a.x)/len;for(let d=2;d<len;d+=low?7:4)for(const side of [-1,1]){const p={x:a.x+(b.x-a.x)*d/len+nx*side*(4.8+rng()*1.3),z:a.z+(b.z-a.z)*d/len+nz*side*(4.8+rng()*1.3)};if(GEMS.some(g=>distance(g,p)<3)||SHRINES.some(g=>distance(g,p)<5)||distance(p,CHEST)<9||p.z<-145&&p.z>-160)continue;const y=groundHeight(p),h=.7+rng()*.9;add('leaf',[p.x,y+h*.5,p.z],[1.8,h,1.6],side>0?'#6e9b33':'#4d872f');add('leaf',[p.x+.4,y+h,p.z],[1.2,.7,1.3],'#81aa39');}}
 // Leafy understory fills the wide gaps while keeping gems and shrine clearings readable.
 for(let i=0;i<(low?420:760);i++){const p={x:rng()*144-72,z:24-rng()*345};if(SCENES.some(m=>distance(m,p)<5)||pathDistance(p)<4.2||GEMS.some(g=>distance(g,p)<2.5)||SHRINES.some(g=>distance(g,p)<4)||distance(p,CHEST)<8||p.z<-145&&p.z>-160)continue;const y=groundHeight(p);add('leaf',[p.x,y+.55,p.z],[1.5,.95,1.4],i%3?'#477c29':'#719b31');add('leaf',[p.x+.5,y+.9,p.z],[.9,.6,1],'#699d36');}
 for(let i=0;i<100;i++){const a=i*2.399,r=6+(i%9)*.9;plant({x:CHEST.x+Math.sin(a)*r,z:CHEST.z+Math.cos(a)*r},i*4);}
 for(const p of SHRINES)for(let i=0;i<16;i++){const a=i*Math.PI/8;plant({x:p.x+Math.sin(a)*4.5,z:p.z+Math.cos(a)*4.5},i*4);}
 return [...chunks.values()];
}
