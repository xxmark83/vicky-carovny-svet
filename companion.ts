import type {Game} from './game';
import {CAVE} from './adventure';
import {attackRadius,distance} from './map';
import type {Vec} from './map';
import {findRoute} from './navigation';
export function updateWolf(g:Game,dt:number){
 let goal:Vec={x:g.player.x+Math.cos(g.player.yaw)*1.9-Math.sin(g.player.yaw)*2,z:g.player.z-Math.sin(g.player.yaw)*1.9-Math.cos(g.player.yaw)*2};
 const boss=g.enemies[12];g.wolfSafe=null;
 if(g.petTime>0){g.wolfMood='pet';g.wolf.yaw=Math.atan2(g.player.x-g.wolf.x,g.player.z-g.wolf.z);return;}
 if(!g.inCave&&boss.hp>0&&boss.windup>0&&distance(g.player,boss)<13){const a=Math.atan2(g.player.x-boss.x,g.player.z-boss.z);const radius=attackRadius(boss)+2;goal={x:boss.x+Math.sin(a)*radius,z:boss.z+Math.cos(a)*radius};g.wolfSafe=goal;g.wolfMood='protect';}
 else if(!g.inCave&&!g.secretFound&&!g.flying&&distance(g.player,CAVE.entry)<22){goal={x:CAVE.entry.x-2,z:CAVE.entry.z+3};g.wolfMood='sniff';if(!g.wolfClue){g.wolfClue=true;g.say('Vlk: Haf! Za vodopádom cítim niečo čarovné…','wolf');}}
 else if(g.flying&&distance(g.player,g.wolf)>30){g.wolfMood='wait';return;}
 else if(g.flying)g.wolfMood='wait';
 if(!g.canMove(goal)){let free:Vec|undefined;for(let radius=1;radius<=4&&!free;radius++)for(let i=0;i<12;i++){const p={x:goal.x+Math.sin(i*Math.PI/6)*radius,z:goal.z+Math.cos(i*Math.PI/6)*radius};if(g.canMove(p)){free=p;break;}}if(!free)return;goal=free;}
 const d=distance(g.wolf,goal);if(d<.5){if(g.wolfMood==='sniff')g.wolf.yaw=Math.atan2(CAVE.entry.x-g.wolf.x,CAVE.entry.z-g.wolf.z);return;}
 const clear=(a:Vec,b:Vec)=>{const len=distance(a,b);for(let t=1;t<=Math.ceil(len/.65);t++){const f=Math.min(1,t*.65/len);if(!g.canMove({x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f}))return false;}return true;};
 if(clear(g.wolf,goal)){g.wolfPath=[];}
 else if(g.elapsed>=g.wolfPlanAt&&(distance(goal,g.wolfGoal)>3||!g.wolfPath.length)){g.wolfPath=findRoute(g.wolf,goal,p=>g.canMove(p));g.wolfPlanAt=g.elapsed+1.2;g.wolfGoal={...goal};}
 while(g.wolfPath.length&&distance(g.wolf,g.wolfPath[0])<.35)g.wolfPath.shift();const next=g.wolfPath[0]||goal;const a=Math.atan2(next.x-g.wolf.x,next.z-g.wolf.z);g.wolf.yaw=a;const speed=Math.min(distance(g.wolf,next),dt*(g.flying?6:7));g.move(g.wolf,Math.sin(a)*speed,Math.cos(a)*speed);
}
