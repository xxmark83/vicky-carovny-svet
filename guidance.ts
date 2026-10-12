import type {Game} from './game';
import {distance,SHRINES,GEMS,CHEST} from './map';
import type {Vec} from './map';
import {findRoute} from './navigation';
export type GuideState={idle:number;wander:number;key:string;best:number;until:number;retry:number;cooldown:number;path:Vec[]};
export const newGuide=():GuideState=>({idle:0,wander:0,key:'',best:Infinity,until:0,retry:0,cooldown:0,path:[]});
export function guidanceDanger(g:Game){return g.enemies.some(e=>e.hp>0&&distance(e,g.player)<10)||g.crowd.some(e=>e.hp>0&&!e.air&&distance(e,g.player)<5);}
export function guideTarget(g:Game):Vec&{label:string}{
 const target=g.target();
 // A sleeping shrine cannot be activated until its own guards are free.
 const shrine=SHRINES.findIndex((p,i)=>!g.shrines.has(i)&&distance(p,target)<.1);
 if(shrine>=0){const guards=g.enemies.filter(e=>e.hp>0&&distance(e.home,SHRINES[shrine])<15).sort((a,b)=>distance(g.player,a)-distance(g.player,b));if(guards.length)return {...guards[0],label:'Vysloboď zvieratko'};}
 return target;
}
export function hintFor(g:Game,target:Vec&{label:string}){
 if(g.flying)return 'Diamanty sú dole. Pristaň na čistinke.';
 if(g.rootsActive)return 'Rozbi tri žiariace korene mečom.';
 if(GEMS.some((p,i)=>!g.gems.has(i)&&distance(p,target)<.1))return 'Poď za labkami k modrému diamantu.';
 if(SHRINES.some((p,i)=>!g.shrines.has(i)&&distance(p,target)<.1))return distance(g.player,target)<4?'Stlač Rozsvietiť a prebuď svetlo.':'Poď za labkami. Rozsvietime svätyňu.';
 if(distance(target,CHEST)<.1)return distance(g.player,target)<4?'Stlač Otvoriť poklad. Dokázala si to!':'Poklad čaká! Poď za zlatými labkami.';
 return g.inCave?'Vlk ti ukáže cestu jaskyňou.':'Poď za vlkom. Zvieratko potrebuje pomoc.';
}
export function updateGuidance(g:Game,dt:number){
 const s=g.guide;s.cooldown=Math.max(0,s.cooldown-dt);
 const target=guideTarget(g),key=`${target.label}:${Math.round(target.x/3)}:${Math.round(target.z/3)}`,d=distance(g.player,target);
 if(s.key!==key){s.key=key;s.best=d;s.wander=0;s.until=0;s.path=[];}
 if(d<s.best-2){s.best=d;s.wander=0;}else s.wander+=dt;
 s.idle=g.walking||g.attackTime>0||g.swordHeld?0:s.idle+dt;
 const danger=guidanceDanger(g);
 if(danger||g.landing||g.petTime>0||g.auriLanding||(!g.inCave&&!g.passageOpen&&distance(g.player,{x:17,z:-40})<22)){s.until=0;s.path=[];s.idle=0;s.wander=0;return;}
 if(s.until>g.elapsed&&g.elapsed>=s.retry&&!g.flying){s.retry=g.elapsed+1.5;s.path=findRoute(g.player,target,p=>g.canMove(p),4000);}
 if(s.until<=g.elapsed){s.path=[];if((s.idle>=12||s.wander>=35)&&s.cooldown===0&&g.messageUntil<g.elapsed){
  s.path=g.flying?[]:findRoute(g.player,target,p=>g.canMove(p),6000);s.retry=g.elapsed+1.5;
  if(s.path.length||g.flying){s.until=g.elapsed+9;s.cooldown=32;s.idle=0;s.wander=0;g.voiceHint=hintFor(g,target);g.voiceHintId++;g.say(g.voiceHint,'wolf');}
 }}
 while(s.path.length&&distance(g.player,s.path[0])<1.5)s.path.shift();
}
