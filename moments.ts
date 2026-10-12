import type {Game} from './game';
import {CAVE} from './adventure';
import {distance,SHRINES,FLIGHT_Y} from './map';
import {creatureBlocks} from './creatures';
import type {Vec} from './map';
export type LandingMoment=Vec&{age:number};
export function revealPassage(g:Game){if(g.passageOpen)return;g.passageOpen=true;g.passageReveal=6;g.wolfClue=true;g.wolfMood='happy';g.wolfMoodTime=2;g.react('surprise',2);g.burst(CAVE.entry,'#d1ed91',24);g.say('Vikoušek: Haf, haf! Vlk našel tajný průchod za vodopádem!','secret');g.messageUntil=g.elapsed+6;}
export function updateMoments(g:Game,dt:number){
 if(g.mode!=='playing')return;
 g.passageReveal=Math.max(0,g.passageReveal-dt);g.shrinePulse=g.shrinePulse.map(t=>Math.max(0,t-dt));
 if(g.auriLanding){const previous=g.auriLanding.age;g.auriLanding.age+=dt;if(previous<1.5&&g.auriLanding.age>=1.5){g.burst(g.auriLanding,'#ffe3a0',20);g.wolfMood='happy';g.wolfMoodTime=2;}if(g.flying&&g.auriLanding.age<5.5)g.auriLanding.age=5.5;if(g.auriLanding.age>=8)g.auriLanding=null;}
 if(g.inCave||g.flying||g.landing)return;
 const danger=g.enemies.some(e=>e.hp>0&&distance(e,g.player)<9);
 if(!g.passageOpen&&distance(g.player,CAVE.entry)<20&&!danger&&(distance(g.wolf,{x:CAVE.entry.x-2,z:CAVE.entry.z+3})<2||distance(g.player,CAVE.entry)<5))revealPassage(g);
 if(!g.auriMet&&g.shrines.size===3&&g.player.z<-258&&g.player.z>-281&&!danger){
  const a=g.cameraYaw;let spot:Vec|undefined;
  for(const side of [1,-1]){for(const forward of [7,5,9]){const p={x:g.player.x+Math.cos(a)*side*2-Math.sin(a)*forward,z:g.player.z-Math.sin(a)*side*2-Math.cos(a)*forward};if(g.canMove(p)&&!g.enemies.some(e=>e.hp>0&&distance(e,p)<7)){spot=p;break;}}if(spot)break;}
  if(spot){g.auriMet=true;g.auriLanding={...spot,age:0};g.projectiles=[];g.crowdAttacks=[];g.react('joy',2);g.wolfMood='happy';g.wolfMoodTime=4;g.say('Auri: Vikoušku, vrátila jsi mi tři světla! Děkuji vám oběma. Teď společně osvobodíme strážce pokladu.','story');g.messageUntil=g.elapsed+7;}
 }
}
export function momentSanctuary(g:Game){return !!g.auriLanding&&g.auriLanding.age<6&&distance(g.player,g.auriLanding)<10;}
// The curse flakes away from the actual volume while the happy animal remains.
export function releaseCurse(g:Game,p:Vec&{yaw?:number},kind?:number,air=false){
 const blocks=kind===undefined?null:creatureBlocks(kind),c=Math.cos(p.yaw||0),s=Math.sin(p.yaw||0),base=air?FLIGHT_Y:g.floor(p);
 for(let i=0;i<28;i++){const b=blocks?.[Math.floor(i/28*blocks.length)],x=b?.p[0]??Math.sin(i*2.4)*.45,z=b?.p[2]??Math.cos(i*2.4)*.35,y=b?.p[1]??.65+(i%7)*.2;const rx=x*c+z*s,rz=z*c-x*s,life=.55+(i%4)*.12;g.particles.push({x:p.x+rx,z:p.z+rz,y:base+y,vx:rx*3+Math.sin(i*2.4)*1.2,vz:rz*3+Math.cos(i*2.4)*1.2,vy:1.4+i%3*.5,life,max:life,color:i%5===0?'#ffe8a0':i%2?'#b897df':'#755795',size:.115,gravity:2});}
 if(g.particles.length>160)g.particles.splice(0,g.particles.length-160);
}
export const BLOOM_RADIUS=12;
export function bloomStrength(g:Game,p:Vec){let sum=0;SHRINES.forEach((s,i)=>{if(g.shrines.has(i))sum+=Math.max(0,1-distance(s,p)/BLOOM_RADIUS)*(.35+.65*g.shrinePulse[i]/8);});return sum;}
