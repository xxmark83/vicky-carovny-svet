import type {Game} from './game';
import {attackRadius,distance} from './map';
import {enemyKind} from './adventure';
export function updateCombat(g:Game,dt:number,grounded:boolean){
 if(!grounded||g.inCave){for(const e of g.enemies){e.windup=0;e.impact=0;e.charge=0;}g.projectiles=[];return;}
 for(const p of g.projectiles){p.life-=dt;if(p.kind==='bolt'){p.x+=p.vx*dt;p.z+=p.vz*dt;if(distance(p,g.player)<.7&&Math.abs(g.floor(g.player)+g.player.y+.9-p.y)<1.3){g.damage();p.life=0;}}else{p.previousRadius=p.radius;p.radius+=dt*3.4;const d=distance(p,g.player);if(!p.hit&&d>=p.previousRadius-.55&&d<=p.radius+.55){p.hit=true;g.damage();}}}g.projectiles=g.projectiles.filter(p=>p.life>0&&p.radius<8);
 for(const e of g.enemies){if(e.hp<=0)continue;e.hit=Math.max(0,e.hit-dt);e.guard=Math.max(0,e.guard-dt);e.stunned=Math.max(0,e.stunned-dt);e.impact=Math.max(0,e.impact-dt);const d=distance(e,g.player),kind=enemyKind(e);
  if(kind==='guardian'&&d<17&&!g.bossMet){g.bossMet=true;g.say('Vicky: To je strážca pokladu! Vlk, ukáž mi bezpečné miesto.','boss');}
  if(e.stunned>0)continue;
  if(e.charge>0){e.charge=Math.max(0,e.charge-dt);const before={x:e.x,z:e.z};g.move(e,e.aim.x*8.5*dt,e.aim.z*8.5*dt);if(distance(e,g.player)<1.3)g.damage();if(distance(e,before)<dt||e.charge===0){e.charge=0;e.stunned=1.4;e.cooldown=2.5;}continue;}
  if(e.windup>0){e.windup=Math.max(0,e.windup-dt);if(e.windup===0){
   if(e.attackKind==='charge')e.charge=.85;
   else if(e.attackKind==='bolt')g.projectiles.push({x:e.x,z:e.z,y:g.floor(e)+1.15,vx:e.aim.x*6.3,vz:e.aim.z*6.3,life:2.7,kind:'bolt',radius:0,previousRadius:0,hit:false});
   else if(kind==='blue')g.projectiles.push({x:e.x,z:e.z,y:g.floor(e)+.2,vx:0,vz:0,life:2.4,kind:'wave',radius:.2,previousRadius:0,hit:false});
   else if(distance(e,g.player)<attackRadius(e)&&Math.abs(g.floor(e)-g.floor(g.player))<2.5)g.damage();
   e.impact=.45;e.cooldown=kind==='guardian'?(g.bossPhase===2?2:2.6):kind==='skeleton'?2.7:kind==='blue'?3.3:2.2;
  }continue;}
  if(d>22)continue;e.cooldown=Math.max(0,e.cooldown-dt);const yaw=Math.atan2(g.player.x-e.x,g.player.z-e.z);if(kind==='panda')e.yaw+=Math.atan2(Math.sin(yaw-e.yaw),Math.cos(yaw-e.yaw))*Math.min(1,dt*1.8);else e.yaw=yaw;
  const trigger=kind==='cow'?8:kind==='skeleton'?11:kind==='blue'?8:kind==='guardian'&&e.cycle%2===1?6:kind==='guardian'?2.6:kind==='panda'?2.5:1.9;
  if(d<trigger&&e.cooldown===0){e.attackKind=kind==='cow'?'charge':kind==='skeleton'?'bolt':kind==='blue'||kind==='guardian'&&e.cycle%2===1?'wave':'strike';e.windupMax=e.attackKind==='charge'?1.15:e.attackKind==='bolt'?1.15:e.attackKind==='wave'?1.4:kind==='guardian'?1.05:kind==='panda'?1.1:.8;e.windup=e.windupMax;e.aim={x:Math.sin(yaw),z:Math.cos(yaw)};e.cycle++;}
  else if(e.hit===0){let direction=1,speed=kind==='guardian'?1:kind==='cow'?1.2:kind==='panda'?1.05:1.55;if(kind==='skeleton'){if(d<4.5)direction=-1;else if(d<7)direction=0;}else if(d<1.7)direction=0;const a=distance(e,e.home)>16?Math.atan2(e.home.x-e.x,e.home.z-e.z):yaw;g.move(e,Math.sin(a)*speed*direction*dt,Math.cos(a)*speed*direction*dt);}
  if(d<1.1&&d>.01)g.move(e,-Math.sin(e.yaw)*dt,-Math.cos(e.yaw)*dt);
  if(distance(e,g.wolf)<2.4&&d<7&&g.wolfCooldown===0){g.hitEnemy(e,.5,'wolf');g.wolfCooldown=2;g.wolfMood='protect';g.wolfMoodTime=.7;}
 }
 if(g.projectiles.length>24)g.projectiles.splice(0,g.projectiles.length-24);
}
