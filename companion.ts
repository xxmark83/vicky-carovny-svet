import {DESERT_SECRET} from './desert';
import type {Game} from './game';
import {CAVE} from './adventure';
import {attackRadius,distance} from './map';
import type {Vec} from './map';
import {findRoute} from './navigation';
export function updateWolf(g:Game,dt:number){
 const motion=Math.hypot(g.velocity.x,g.velocity.z);if(motion>.3){const a=Math.atan2(g.velocity.x,g.velocity.z);g.wolfHeading+=Math.atan2(Math.sin(a-g.wolfHeading),Math.cos(a-g.wolfHeading))*Math.min(1,dt*4);}
 let goal:Vec={x:g.player.x+Math.cos(g.wolfHeading)*1.9-Math.sin(g.wolfHeading)*2,z:g.player.z-Math.sin(g.wolfHeading)*1.9-Math.cos(g.wolfHeading)*2};
 const boss=g.enemies[12];g.wolfSafe=null;
 if(g.wolfMood==='roll'||g.wolfMood==='play')return;if(g.petTime>0){g.wolfMood='pet';g.wolf.yaw=Math.atan2(g.player.x-g.wolf.x,g.player.z-g.wolf.z);return;}
 if(!g.inCave&&boss.hp>0&&boss.windup>0&&distance(g.player,boss)<13){const a=Math.atan2(g.player.x-boss.x,g.player.z-boss.z);const radius=attackRadius(boss)+2;goal={x:boss.x+Math.sin(a)*radius,z:boss.z+Math.cos(a)*radius};g.wolfSafe=goal;g.wolfMood='protect';}
 else if(g.desert&&!g.secretFound&&!g.flying&&distance(g.player,DESERT_SECRET)<18){goal={x:DESERT_SECRET.x+2,z:DESERT_SECRET.z+2};g.wolfMood='sniff';if(!g.wolfClue){g.wolfClue=true;g.say('Vlk: Haf! V písku je něco zlatého…','wolf');}}else if(!g.desert&&!g.inCave&&!g.passageOpen&&!g.flying&&distance(g.player,CAVE.entry)<22){goal={x:CAVE.entry.x-2,z:CAVE.entry.z+3};g.wolfMood='sniff';if(!g.wolfClue){g.wolfClue=true;g.say('Vlk: Haf! Za vodopádem cítím něco kouzelného…','wolf');}}
 else if(!g.flying&&g.guide.until>g.elapsed&&g.guide.path.length){goal=g.guide.path.find(p=>distance(p,g.player)>3)||g.guide.path.at(-1)!;g.wolfMood='sniff';}
 else if(g.flying&&distance(g.player,g.wolf)>30){g.wolfMood='wait';return;}
 else if(g.flying)g.wolfMood='wait';
 if(!g.canMove(goal)){let free:Vec|undefined;for(let radius=1;radius<=4&&!free;radius++)for(let i=0;i<12;i++){const p={x:goal.x+Math.sin(i*Math.PI/6)*radius,z:goal.z+Math.cos(i*Math.PI/6)*radius};if(g.canMove(p)){free=p;break;}}if(!free)return;goal=free;}
 const d=distance(g.wolf,goal);if(d<.8){if(g.wolfMood==='sniff'){const p=g.guide.until>g.elapsed?g.target():g.desert?DESERT_SECRET:CAVE.entry;g.wolf.yaw=Math.atan2(p.x-g.wolf.x,p.z-g.wolf.z);}return;}
 const clear=(a:Vec,b:Vec)=>{const len=distance(a,b);for(let t=1;t<=Math.ceil(len/.65);t++){const f=Math.min(1,t*.65/len);if(!g.canMove({x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f}))return false;}return true;};
 if(clear(g.wolf,goal)){g.wolfPath=[];}
 else if(g.elapsed>=g.wolfPlanAt&&(distance(goal,g.wolfGoal)>3||!g.wolfPath.length)){g.wolfPath=findRoute(g.wolf,goal,p=>g.canMove(p),8000,!g.desert);g.wolfPlanAt=g.elapsed+1.2;g.wolfGoal={...goal};}
 while(g.wolfPath.length&&distance(g.wolf,g.wolfPath[0])<.35)g.wolfPath.shift();const next=g.wolfPath[0]||goal;const a=Math.atan2(next.x-g.wolf.x,next.z-g.wolf.z);g.wolf.yaw+=Math.atan2(Math.sin(a-g.wolf.yaw),Math.cos(a-g.wolf.yaw))*Math.min(1,dt*8);const speed=Math.min(distance(g.wolf,next),dt*Math.min(g.flying?6:7,Math.max(.3,(d-.6)*3)));g.move(g.wolf,Math.sin(a)*speed,Math.cos(a)*speed);
}
