import * as THREE from 'three';
import {random} from './map';
export type ForestTexture='grass'|'earth'|'bark'|'leaf'|'stone'|'decor'|'planks'|'roof';

// Original pixel artwork, generated once and shared by each instanced material.
export function forestTexture(kind:ForestTexture){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
 const c=canvas.getContext('2d')!,r=random(kind.length*327+kind.charCodeAt(0));
 const rect=(x:number,y:number,w:number,h:number,v:number)=>{c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(x,y,w,h);};
 rect(0,0,64,64,235);
 for(let y=0;y<64;y+=2)for(let x=0;x<64;x+=2)rect(x,y,2,2,212+Math.floor(r()*42));
 if(kind==='grass'||kind==='leaf'||kind==='decor')for(let i=0;i<150;i++){const x=Math.floor(r()*32)*2,y=Math.floor(r()*32)*2;rect(x,y,2,2+Math.floor(r()*3)*2,i%4?237:174);if(i%3===0)rect(x+2,y-2,2,4,250);}
 if(kind==='bark')for(let x=0;x<64;x+=8){rect(x,0,2,64,150);rect(x+2,0,2,64,246);for(let y=0;y<64;y+=12){rect(x+2+Math.floor(r()*3),y,2,5,180);rect(x+3,y+5,3,2,204);}}
 if(kind==='planks'||kind==='roof'){
  const h=kind==='roof'?8:16;
  for(let y=0;y<64;y+=h){rect(0,y,64,1,139);rect(0,y+1,64,1,252);for(let x=0;x<64;x+=16){const offset=(y/h)%2?8:0;rect(x+offset,y,1,h,172);for(let j=0;j<4;j++)rect(x+2+r()*12,y+3+r()*(h-4),3+r()*8,1,191+Math.floor(r()*32));}}
 }
 if(kind==='stone'){
  rect(0,0,64,64,167);
  for(let y=0;y<64;y+=16)for(let x=0;x<64;x+=16){const off=(y/16)%2?8:0,v=207+Math.floor(r()*40);for(const wrap of [-64,0,64]){rect(x+off+wrap+1,y+1,14,14,v);rect(x+off+wrap+2,y+2,12,2,252);rect(x+off+wrap+12,y+4,2,10,v-35);for(let k=0;k<4;k++)rect(x+off+wrap+3+r()*8,y+5+r()*7,2,2,v-20);}}
 }
 if(kind==='earth')for(let i=0;i<100;i++)rect(Math.floor(r()*32)*2,Math.floor(r()*32)*2,2+r()*4,2,155+Math.floor(r()*65));
 // Gentle surface grain suits the rounded scenery; building blocks retain their own pixel textures.
 if(kind==='leaf'){rect(0,0,64,64,244);for(let i=0;i<95;i++)rect(r()*64,r()*64,1+r()*3,1+r()*2,218+Math.floor(r()*32));}
 const t=new THREE.CanvasTexture(canvas);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
