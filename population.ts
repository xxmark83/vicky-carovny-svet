import {BRIDGE} from './valleyLayout';
import {meadowSanctuary} from './building';
import {momentSanctuary,releaseCurse} from './moments';
import type {Game} from './game';
import {ANIMAL_KINDS} from './creatures';
import {WORLD_BOUNDS,distance,random,segmentDistance} from './map';
import type {Vec} from './map';
export const GROUND_ROAMERS=70;
export const GROUND_TOTAL=13+GROUND_ROAMERS;
export const AIR_TOTAL=GROUND_TOTAL*6;
export type Roamer=Vec&{id:number;kind:number;air:boolean;hp:number;goal:Vec;yaw:number;cooldown:number;windup:number;windupMax:number;gait:number;stuck:number;turn:number;aim:Vec;rush:number;stun:number;hit:number;guard:number;freed:number;school:number};
export type SwordBall=Vec&{y:number;vx:number;vz:number;life:number;power:number};
export type CrowdAttack=Vec&{air:boolean;kind:'bolt'|'wave';vx:number;vz:number;life:number;radius:number;previousRadius:number};
export function createCrowd(free:(p:Vec)=>boolean,bounds=WORLD_BOUNDS):Roamer[]{const r=random(76315),pick=(air:boolean):Vec=>{for(let i=0;i<300;i++){const p={x:bounds.minX+4+r()*(bounds.maxX-bounds.minX-8),z:bounds.minZ+8+r()*(bounds.maxZ-bounds.minZ-16)};if(air||!meadowSanctuary(p)&&free(p))return p;}return {x:0,z:12};};return Array.from({length:GROUND_ROAMERS+AIR_TOTAL},(_,id)=>{const air=id>=GROUND_ROAMERS;return {...pick(air),id,kind:id%ANIMAL_KINDS.length,air,hp:2,goal:pick(air),yaw:0,cooldown:6+id%9,windup:0,windupMax:1.5,gait:0,stuck:0,turn:id%2?1:-1,aim:{x:0,z:1},rush:0,stun:0,hit:0,guard:0,freed:0,school:-1};});}
function nextGoal(e:Roamer,g:Game){const r=random(e.id*1531+Math.floor(g.elapsed*17));for(let i=0;i<40;i++){const p={x:g.bounds.minX+4+r()*(g.bounds.maxX-g.bounds.minX-8),z:g.bounds.minZ+8+r()*(g.bounds.maxZ-g.bounds.minZ-16)};if(e.air||!meadowSanctuary(p)&&g.canMove(p)){e.goal=p;return;}}e.goal={x:0,z:12};}
function release(g:Game,e:Roamer,amount:number){
 if(e.kind===1&&!e.air&&amount===1){const front=Math.cos(Math.atan2(g.player.x-e.x,g.player.z-e.z)-e.yaw);if(front>.35){amount=.35;e.guard=.5;}else if(front<-.25)amount=2;}
 g.emitSound(e.guard>0?'shield':'impact');
 e.hp=Math.max(0,e.hp-amount);e.hit=.28;e.rush=0;e.stun=.3;e.windup=0;e.cooldown=6;
 if(e.hp===0){e.freed=5;releaseCurse(g,e,e.kind,e.air);g.react('joy',1.5);g.wolfMood='happy';g.wolfMoodTime=1.5;g.burst(e,'#ffd5e8',12);if(e.air)g.particles.slice(-12).forEach(p=>p.y=g.flightPlane+1);g.health=Math.min(5,g.health+.12);g.emitSound('defeat');g.emitSound('animal',g.desert&&e.kind<3?e.kind+7:e.kind);}
 else{g.burst(e,e.guard>0?'#abd9ee':'#fff0ae',5);if(e.air)g.particles.slice(-5).forEach(p=>p.y=g.flightPlane+1);}
}
export function attackCrowd(g:Game,radius:number,amount:number){if(g.inCave)return;g.crowd.filter(e=>!e.air&&e.hp>0&&distance(e,g.player)<radius).sort((a,b)=>distance(a,g.player)-distance(b,g.player)).slice(0,amount===1?2:12).forEach(e=>release(g,e,amount));}
export function shootBall(g:Game,power=1){const enemy=g.crowd.filter(e=>e.air&&e.hp>0&&distance(e,g.player)<32).sort((a,b)=>distance(a,g.player)-distance(b,g.player))[0];const a=enemy?Math.atan2(enemy.x-g.player.x,enemy.z-g.player.z):g.player.yaw;g.player.yaw=a;g.swordBalls.push({x:g.player.x+Math.sin(a)*1.2,z:g.player.z+Math.cos(a)*1.2,y:g.flightY+1,vx:Math.sin(a)*25,vz:Math.cos(a)*25,life:2.2,power});if(g.swordBalls.length>16)g.swordBalls.shift();}
function travel(e:Roamer,g:Game,a:number,step:number,dash=false,dt=.05){const old={x:e.x,z:e.z};for(const off of e.air?[0]:dash?[0]:[0,.45*e.turn,-.45*e.turn,.9*e.turn,-.9*e.turn,1.5*e.turn]){const p={x:e.x+Math.sin(a+off)*step,z:e.z+Math.cos(a+off)*step};if(p.x<=g.bounds.minX+1||p.x>=g.bounds.maxX-1||p.z<=g.bounds.minZ+1||p.z>=g.bounds.maxZ-1)continue;if(e.air||g.canMove(p)&&(!meadowSanctuary(p)||meadowSanctuary(e)&&distance(p,{x:-28,z:7})>distance(e,{x:-28,z:7}))){Object.assign(e,p);break;}}
 const moved=distance(old,e);if(moved<step*.2)e.stuck+=dt;else{e.stuck=0;if(e.kind!==1||dash)e.yaw=Math.atan2(e.x-old.x,e.z-old.z);e.gait+=moved*4;}return {old,moved};}
function spacingGrid(g:Game){const cells=new Map<string,Roamer[]>(),key=(e:Roamer,x=Math.floor(e.x/3),z=Math.floor(e.z/3))=>`${e.air}:${x}:${z}`;for(const e of g.crowd)if(e.hp>0){const k=key(e);if(!cells.has(k))cells.set(k,[]);cells.get(k)!.push(e);}return (e:Roamer)=>{let x=0,z=0;const cx=Math.floor(e.x/3),cz=Math.floor(e.z/3);for(let ix=cx-1;ix<=cx+1;ix++)for(let iz=cz-1;iz<=cz+1;iz++)for(const other of cells.get(key(e,ix,iz))||[]){if(other===e)continue;const d=distance(e,other),space=e.air?2.8:2.1;if(d>.01&&d<space){const f=(space-d)/space;x+=(e.x-other.x)/d*f;z+=(e.z-other.z)/d*f;}}return {x,z};};}
export function updateCrowd(g:Game,dt:number){
 if(g.inCave){g.swordBalls=[];g.crowdAttacks=[];return;}const separation=spacingGrid(g);
 const air=g.flying&&g.flightY>g.flightPlane-1,layerReady=!g.landing&&(!g.flying||air);
 const sanctuary=meadowSanctuary(g.player)||momentSanctuary(g)||g.layout.shrines.some(p=>distance(p,g.player)<6)||distance(g.player,g.layout.chest)<19||distance(g.player,{x:0,z:12})<10;
 const storyThreat=g.enemies.some(e=>e.hp>0&&distance(e,g.player)<11);
 // Reserve the two slots for warnings already on screen before choosing newcomers.
 const active=layerReady&&(air||!sanctuary&&!storyThreat)?g.crowd.filter(e=>e.hp>0&&e.air===air&&distance(e,g.player)<(e.windup>0||e.rush>0?20:air?11:5)).sort((a,b)=>Number(b.windup>0||b.rush>0)-Number(a.windup>0||a.rush>0)||distance(a,g.player)-distance(b,g.player)).slice(0,2):[];
 for(const e of g.crowd){
  e.freed=Math.max(0,e.freed-dt);e.hit=Math.max(0,e.hit-dt);e.guard=Math.max(0,e.guard-dt);e.stun=Math.max(0,e.stun-dt);
  if(e.hp<=0){if(e.freed>3.5)e.yaw=Math.atan2(g.player.x-e.x,g.player.z-e.z);else if(e.freed>0){const a=Math.atan2(e.x-g.player.x,e.z-g.player.z);travel(e,g,a,dt*(e.kind===5?2.1:1.8),false,dt);}continue;}
  e.cooldown=Math.max(0,e.cooldown-dt);const d=distance(e,g.player),threat=active.includes(e);
  if(!threat){e.windup=0;e.rush=0;}if(!e.air&&meadowSanctuary(e)){e.windup=0;e.rush=0;const a=Math.atan2(e.x+28,e.z-7);travel(e,g,a,dt*2,false,dt);continue;}if(e.stun>0)continue;
  if(e.rush>0){e.rush=Math.max(0,e.rush-dt);const a=Math.atan2(e.aim.x,e.aim.z),speed=e.kind===0?8:e.kind===5?7:5;const {old,moved}=travel(e,g,a,speed*dt,true,dt);if(segmentDistance(g.player,old,e)<(e.air?1.7:1.2)){g.damage(e.air);e.rush=0;}if(moved<speed*dt*.4||e.rush===0){e.stun=e.kind===0?1.3:.65;e.rush=0;e.cooldown=7;}continue;}
  if(e.windup>0){e.windup=Math.max(0,e.windup-dt);if(e.windup===0){
   if([0,3,5,6].includes(e.kind))e.rush=e.kind===0?.85:e.kind===5?.45:.55;
   else if(e.kind===2||e.kind===4){const bolt=e.kind===2;g.crowdAttacks.push({x:e.x,z:e.z,air:e.air,kind:bolt?'bolt':'wave',vx:bolt?e.aim.x*5:0,vz:bolt?e.aim.z*5:0,life:bolt?2.5:1.3,radius:bolt?.3:.2,previousRadius:0});if(g.crowdAttacks.length>8)g.crowdAttacks.shift();}
   else if(d<(e.air?3:2.4))g.damage(e.air);
   e.cooldown=7;
  }continue;}
  const range=e.kind===0||e.kind===2?7:e.kind===5?4.5:e.kind===6?4.2:e.air?4:2.6;
  if(threat&&e.cooldown===0&&d<range){e.windupMax=e.kind===5?1.25:e.kind===2?1.6:1.5;e.windup=e.windupMax;e.aim={x:(g.player.x-e.x)/Math.max(d,.01),z:(g.player.z-e.z)/Math.max(d,.01)};e.yaw=Math.atan2(e.aim.x,e.aim.z);continue;}
  if(e.air){const group=Math.floor((e.id-GROUND_ROAMERS)/14),stage=Math.floor((g.elapsed+group*7)/26);if(e.school!==stage){const r=random(group*991+stage*8191+51),slot=(e.id-GROUND_ROAMERS)%14,angle=slot*Math.PI*2/14;e.goal={x:Math.max(g.bounds.minX+7,Math.min(g.bounds.maxX-7,g.bounds.minX+20+r()*(g.bounds.maxX-g.bounds.minX-40)+Math.sin(angle)*6)),z:Math.max(g.bounds.minZ+10,Math.min(g.bounds.maxZ-10,g.bounds.minZ+25+r()*(g.bounds.maxZ-g.bounds.minZ-50)+Math.cos(angle)*6))};e.school=stage;}}
  else if(distance(e,e.goal)<3||e.stuck>2.5){nextGoal(e,g);e.stuck=0;}
  let goal:Vec=threat?g.player:e.goal;
  // Keep walking/flying bodies out of Vikoušek's silhouette. Only a warned dash
  // crosses this space; it is never a hidden contact attack.
  if(d<(e.air?3:2.2)){const a=Math.atan2(e.x-g.player.x,e.z-g.player.z);goal={x:g.player.x+Math.sin(a)*(e.air?3.4:2.6),z:g.player.z+Math.cos(a)*(e.air?3.4:2.6)};}
  // Cats circle; pigs weave; pandas keep a slow, readable front shield.
  if(threat&&e.kind===6&&d<4.5){const a=Math.atan2(e.x-g.player.x,e.z-g.player.z)+e.turn*.65;goal={x:g.player.x+Math.sin(a)*3,z:g.player.z+Math.cos(a)*3};}
  if(!g.desert&&!e.air&&(e.z<BRIDGE.z)!==(goal.z<BRIDGE.z)){goal={x:BRIDGE.x,z:BRIDGE.z+(e.z<BRIDGE.z?10:-10)};if(Math.abs(e.x-BRIDGE.x)>3&&Math.abs(e.z-BRIDGE.z)>9)goal={x:BRIDGE.x,z:BRIDGE.z+(e.z<BRIDGE.z?-14:14)};}
  const push=separation(e),length=Math.max(.1,distance(e,goal));let a=Math.atan2((goal.x-e.x)/length+push.x*.85,(goal.z-e.z)/length+push.z*.85);if(e.kind===3)a+=Math.sin(g.elapsed*3+e.id)*.45;
  let speed=(e.air?2.3+e.kind*.2:1.3+e.kind*.08)*(threat?1.1:1);
  if(e.kind===1)speed*=.65;if(e.kind===5)speed*=.3+Math.max(0,Math.sin(g.elapsed*7+e.id))*1.8;
  travel(e,g,a,Math.min(distance(e,goal),dt*speed),false,dt);
  if(e.kind===1){const target=threat?Math.atan2(g.player.x-e.x,g.player.z-e.z):a;e.yaw+=Math.atan2(Math.sin(target-e.yaw),Math.cos(target-e.yaw))*Math.min(1,dt*2);}
 }
 for(const p of g.swordBalls){const old={x:p.x,z:p.z};p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;const candidates=g.crowd.filter(e=>e.air&&e.hp>0&&segmentDistance(e,old,p)<(p.power>1?1.8:1.25)&&Math.abs(p.y-(g.flightPlane+1))<2).sort((a,b)=>distance(a,old)-distance(b,old));if(candidates.length){release(g,candidates[0],p.power);p.life=0;}}
 g.swordBalls=g.swordBalls.filter(p=>p.life>0);
 for(const p of g.crowdAttacks){if(!layerReady||p.air!==air){p.life=0;continue;}p.life-=dt;const old={x:p.x,z:p.z};if(p.kind==='bolt'){p.x+=p.vx*dt;p.z+=p.vz*dt;if(segmentDistance(g.player,old,p)<.65){g.damage(p.air);p.life=0;}}
  else{p.previousRadius=p.radius;p.radius+=dt*3;const d=distance(p,g.player);if(d>p.previousRadius-.5&&d<p.radius+.5){g.damage(p.air);p.life=0;}}
 }
 g.crowdAttacks=g.crowdAttacks.filter(p=>p.life>0);
}
