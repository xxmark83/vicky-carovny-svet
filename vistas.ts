import {groundHeight} from './terrain';
import {SHRINES,random,pathDistance,distance} from './map';
import type {Block} from './world';
export const VISTAS=[{x:17,z:-31,name:'Vodopád dúhových kvapiek'},{...SHRINES[0],name:'Lúka troch svetiel'},{x:0,z:-282,name:'Auriho záhrada'}];
// Authored foreground/midground frames. All substantial shapes stay outside mission lanes.
export function vistaBlocks(index:number):Block[]{
 const center=VISTAS[index],b:Block[]=[],r=random(1919+index);
 const add=(x:number,y:number,z:number,s:[number,number,number],c:string)=>b.push({p:[x,groundHeight({x,z})+y,z],s,c});
 const flower=(x:number,z:number,c:string,h=.65)=>{add(x,h/2,z,[.065,h,.065],'#4c8e39');for(const [dx,dz] of [[.15,0],[-.15,0],[0,.15],[0,-.15]])add(x+dx,h,z+dz,[.23,.09,.23],c);add(x,h+.055,z,[.14,.1,.14],'#ffda58');};
 const blossom=(x:number,z:number,h:number,c:string)=>{add(x,h/2,z,[.62,h,.62],'#a27a4c');for(let j=0;j<12;j++){const a=j*2.4;add(x+Math.sin(a)*(1+j%2*.65),h-.5+j%3*.65,z+Math.cos(a)*(1+j%2*.65),[1.7,1,1.7],j%3?c:'#ffd2e5');}};
 const bank=(x:number,z:number,n:number)=>{for(let j=0;j<n;j++){const px=x+j*.9,pz=z+Math.sin(j*.8)*.6;add(px,.22,pz,[1.2,.5,1],'#93a593');add(px,.5,pz,[1.2,.12,.95],'#8fbc51');}};
 if(index===0){bank(7,-38,5);bank(23,-34,4);for(let i=0;i<12;i++){const z=-36+i*.95;flower(12+Math.sin(i)*.5,z,i%2?'#fff6d5':'#f3aad6');flower(23+Math.cos(i)*.8,z,'#b7dcff');}
  // A low garden footbridge crosses the existing waterfall stream; the center remains wide.
  for(let i=0;i<14;i++)b.push({p:[12.6+i*.69,.27,-27.5],s:[.66,.24,3],c:i%2?'#ba8c50':'#d6ac69'});
  for(const z of [-29,-26]){for(const x of [12.5,17,21.5])add(x,.85,z,[.16,1.5,.16],'#906437');add(17,1.55,z,[9.3,.12,.12],'#d8b578');}
  blossom(26,-36,5.7,'#eea3c5');blossom(8,-24,4.7,'#b4cf74');
 }
 if(index===1){for(const side of [-1,1]){for(let i=0;i<7;i++){const x=center.x+side*(6.4+i*.7),z=center.z-7+i*.85;add(x,.25,z,[1.2,.5,1.1],'#a3b297');add(x,.55,z,[1.15,.14,1.05],'#95bf56');flower(x,z,side<0?'#fff3b3':'#e9b5ed',.9);}blossom(center.x+side*8,center.z-8,6,side<0?'#b7d881':'#e8a1c9');}
  for(let i=0;i<80;i++){const a=i*2.4,rad=5.5+r()*5.5,x=center.x+Math.sin(a)*rad,z=center.z+Math.cos(a)*rad;if(pathDistance({x,z})>2.2)flower(x,z,['#ffe386','#fff5df','#efb6d4','#bddeff'][i%4],.45+r()*.5);}
 }
 if(index===2){for(const side of [-1,1]){for(let i=0;i<3;i++)blossom(side*(10+i*2),-281-i*9,5.5+i*.7,i%2?'#eba2cc':'#f8b8d9');bank(side<0?-15:8,-288,7);for(let j=0;j<18;j++)flower(side*(5.6+(j%4)*.55),-277-j*.9,j%3?'#fff4ce':'#ffaed8',.7);}
  for(const side of [-1,1])for(let j=0;j<3;j++){const x=side*8,z=-290-j*5;add(x,1.5,z,[.22,3,.22],'#a17a4b');add(x,2.8,z,[.65,.2,.65],'#98713e');add(x,2.4,z,[.42,.6,.42],'#ffdc8c');}
 }
 return b.filter(p=>p.s.every(n=>n>0)&&p.p.every(Number.isFinite)&&!(index>0&&SHRINES.some(s=>distance({x:p.p[0],z:p.p[2]},s)<3.8)));
}
