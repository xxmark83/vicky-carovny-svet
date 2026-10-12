import type {Game} from './game';
import {distance} from './map';
export function updatePersonality(g:Game,dt:number){
 g.meadowTime+=dt;
 const safe=!g.enemies.some(e=>e.hp>0&&distance(e,g.player)<13)&&!g.crowd.some(e=>e.hp>0&&!e.air&&distance(e,g.player)<6);
 const idle=!g.walking&&!g.flying&&!g.landing&&g.player.y===0&&g.attackTime===0&&!g.swordHeld&&!g.petTime&&g.guide.until<=g.elapsed;
 g.friendIdle=idle&&safe?g.friendIdle+dt:0;
 if(g.mode==='building'&&g.build.cells.length){const a=g.meadowTime*.24,goal={x:-28+Math.sin(a)*12,z:7+Math.cos(a)*12},d=distance(goal,g.wolf);if(d>.8){g.wolf.yaw=Math.atan2(goal.x-g.wolf.x,goal.z-g.wolf.z);g.move(g.wolf,Math.sin(g.wolf.yaw)*Math.min(d,dt*2.2),Math.cos(g.wolf.yaw)*Math.min(d,dt*2.2));}g.wolfMood='sniff';return;}
 if(g.friendIdle>8&&g.friendIdle<11&&g.wolfMoodTime===0){g.wolfMood='roll';g.wolfMoodTime=.1;}
 if(g.friendIdle>15&&g.friendIdle<19&&g.wolfMoodTime===0){g.wolfMood='play';g.wolfMoodTime=.1;const a=g.elapsed*1.2,goal={x:g.player.x+Math.sin(a)*3.3,z:g.player.z+Math.cos(a)*3.3};g.wolf.yaw=Math.atan2(goal.x-g.wolf.x,goal.z-g.wolf.z);g.move(g.wolf,Math.sin(g.wolf.yaw)*dt*2.5,Math.cos(g.wolf.yaw)*dt*2.5);}
 if(g.friendIdle>23)g.friendIdle=0;
}
