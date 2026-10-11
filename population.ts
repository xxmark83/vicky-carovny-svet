import type {Game} from './game';
import {ANIMAL_KINDS} from './creatures';
import {WORLD_BOUNDS,FLIGHT_Y,distance,random,SHRINES,CHEST,segmentDistance} from './map';
import type {Vec} from './map';
export const GROUND_ROAMERS=70;
export const GROUND_TOTAL=13+GROUND_ROAMERS;
export const AIR_TOTAL=GROUND_TOTAL*6;
export type Roamer=Vec&{id:number;kind:number;air:boolean;hp:number;goal:Vec;yaw:number;cooldown:number;windup:number;gait:number;stuck:number;turn:number};
export type SwordBall=Vec&{y:number;vx:number;vz:number;life:number};
export function createCrowd(free:(p:Vec)=>boolean):Roamer[]{const r=random(76315),pick=(air:boolean):Vec=>{for(let i=0;i<300;i++){const p={x:WORLD_BOUNDS.minX+4+r()*167,z:-310+r()*330};if(air||free(p))return p;}return {x:0,z:12};};return Array.from({length:GROUND_ROAMERS+AIR_TOTAL},(_,id)=>{const air=id>=GROUND_ROAMERS;return {...pick(air),id,kind:id%ANIMAL_KINDS.length,air,hp:2,goal:pick(air),yaw:0,cooldown:6+id%9,windup:0,gait:0,stuck:0,turn:id%2?1:-1};});}
function nextGoal(e:Roamer,g:Game){const r=random(e.id*1531+Math.floor(g.elapsed*17));for(let i=0;i<40;i++){const p={x:WORLD_BOUNDS.minX+4+r()*167,z:WORLD_BOUNDS.minZ+7+r()*330};if(e.air||g.canMove(p)){e.goal=p;return;}}e.goal={x:0,z:12};}
function release(g:Game,e:Roamer,amount:number){e.hp=Math.max(0,e.hp-amount);if(e.hp===0){g.burst(e,'#ffdda0',8);if(e.air)g.particles.slice(-8).forEach(p=>p.y=FLIGHT_Y+1);g.health=Math.min(5,g.health+.12);g.soundEvent='defeat';g.eventId++;}e.windup=0;e.cooldown=6;}
export function attackCrowd(g:Game,radius:number,amount:number){if(g.inCave)return;g.crowd.filter(e=>!e.air&&e.hp>0&&distance(e,g.player)<radius).sort((a,b)=>distance(a,g.player)-distance(b,g.player)).slice(0,amount===1?2:12).forEach(e=>release(g,e,amount));}
export function shootBall(g:Game){const enemy=g.crowd.filter(e=>e.air&&e.hp>0&&distance(e,g.player)<32).sort((a,b)=>distance(a,g.player)-distance(b,g.player))[0];const a=enemy?Math.atan2(enemy.x-g.player.x,enemy.z-g.player.z):g.player.yaw;g.player.yaw=a;g.swordBalls.push({x:g.player.x+Math.sin(a)*1.2,z:g.player.z+Math.cos(a)*1.2,y:g.flightY+1,vx:Math.sin(a)*25,vz:Math.cos(a)*25,life:2.2});if(g.swordBalls.length>16)g.swordBalls.shift();}
export function updateCrowd(g:Game,dt:number){if(g.inCave){g.swordBalls=[];return;}
 const air=g.flying&&g.flightY>FLIGHT_Y-1;
 const sanctuary=SHRINES.some(p=>distance(p,g.player)<6)||distance(g.player,CHEST)<19||distance(g.player,{x:0,z:12})<10;
 const storyThreat=g.enemies.some(e=>e.hp>0&&distance(e,g.player)<11);
 const active=(!g.landing&&(air||!sanctuary&&!storyThreat)?g.crowd.filter(e=>e.hp>0&&e.air===air&&distance(e,g.player)<(air?11:5)).sort((a,b)=>distance(a,g.player)-distance(b,g.player)).slice(0,2):[]);
 for(const e of g.crowd){if(e.hp<=0)continue;e.cooldown=Math.max(0,e.cooldown-dt);const d=distance(e,g.player),threat=active.includes(e);if(e.windup>0){e.windup=Math.max(0,e.windup-dt);if(e.windup===0){if(threat&&d<(e.air?4:2.6))g.damage(e.air);e.cooldown=7;}continue;}
 if(threat&&e.cooldown===0&&d<(e.air?4:2.6)){e.windup=1.5;continue;}
 if(distance(e,e.goal)<3||e.stuck>2.5){nextGoal(e,g);e.stuck=0;}
 let goal=threat?g.player:e.goal;
 // All animals can cross the map; ground travellers use the existing bridge.
 if(!e.air&&(e.z<-152)!==(goal.z<-152)){goal={x:32,z:e.z<-152?-144:-160};if(Math.abs(e.x-32)>3&&Math.abs(e.z+152)>9)goal={x:32,z:e.z<-152?-163:-141};}
 const a=Math.atan2(goal.x-e.x,goal.z-e.z),speed=(e.air?2.3+e.kind*.2:1.3+e.kind*.08)*(threat?1.1:1);const step=Math.min(distance(e,goal),dt*speed);const old={x:e.x,z:e.z};
 if(e.air){e.x+=Math.sin(a)*step;e.z+=Math.cos(a)*step;}
 else{for(const off of [0,.45*e.turn,-.45*e.turn,.9*e.turn,-.9*e.turn,1.5*e.turn]){const p={x:e.x+Math.sin(a+off)*step,z:e.z+Math.cos(a+off)*step};if(g.canMove(p)){e.x=p.x;e.z=p.z;break;}}}
 const travelled=distance(old,e);if(travelled<step*.2)e.stuck+=dt;else{e.stuck=Math.max(0,e.stuck-dt);e.yaw=Math.atan2(e.x-old.x,e.z-old.z);e.gait+=travelled*4;}
 e.x=Math.max(WORLD_BOUNDS.minX+1,Math.min(WORLD_BOUNDS.maxX-1,e.x));e.z=Math.max(WORLD_BOUNDS.minZ+1,Math.min(WORLD_BOUNDS.maxZ-1,e.z));
 }
 for(const p of g.swordBalls){const old={x:p.x,z:p.z};p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;const candidates=g.crowd.filter(e=>e.air&&e.hp>0&&segmentDistance(e,old,p)<1.25&&Math.abs(p.y-(FLIGHT_Y+1))<2);if(candidates.length){release(g,candidates[0],1);p.life=0;}}
 g.swordBalls=g.swordBalls.filter(p=>p.life>0);
}
