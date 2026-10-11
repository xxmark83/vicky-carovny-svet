import type {Game,Input} from './game';
import {distance,FLIGHT_Y} from './map';
import {attackCrowd,shootBall} from './population';

export const CHARGE_SECONDS=1.05;
// A tap responds immediately. Holding the SAME control repeatedly releases a
// charged strike: a child never has to time a release or find another button.
export function updateSword(g:Game,dt:number,input:Input,tap:boolean){
 if(input.attackCancel||g.landing||(g.flying&&g.flightY<FLIGHT_Y-1)){g.cancelSword();input.attackCancel=false;return;}
 const pressed=tap||input.attack&&!g.swordHeld;
 g.swordHeld=input.attack;
 if(pressed)g.swordBuffer=.22;
 else g.swordBuffer=Math.max(0,g.swordBuffer-dt);
 if(!input.attack)g.swordCharge=0;
 if(input.attack)g.swordCharge=Math.min(CHARGE_SECONDS,g.swordCharge+dt);
 const power=input.attack&&g.swordCharge>=CHARGE_SECONDS;
 if(g.attackCooldown>0||!power&&g.swordBuffer===0)return;
 g.swordBuffer=0;
 if(power)g.swordCharge=0;
 g.attackPower=power?3:1;g.attackDuration=power?.48:.32;
 g.attackTime=g.attackDuration;g.attackCooldown=power?.6:.4;g.swingId++;
 g.react('determined',.65);
 if(g.flying)shootBall(g,power?3:1);
 else{
  const radius=power?5.5:3.8;
  const near=(g.inCave?[]:g.enemies).filter(e=>e.hp>0&&distance(e,g.player)<radius).sort((a,b)=>distance(a,g.player)-distance(b,g.player));
  const root=(g.inCave?[]:g.roots).find(r=>r.hp>0&&distance(r,g.player)<radius);
  const animal=(g.inCave?[]:g.crowd).filter(e=>!e.air&&e.hp>0&&distance(e,g.player)<radius).sort((a,b)=>distance(a,g.player)-distance(b,g.player))[0];
  const aim=root||near[0]||animal;
  if(aim)g.player.yaw=Math.atan2(aim.x-g.player.x,aim.z-g.player.z);
  near.slice(0,power?4:2).forEach(e=>g.hitEnemy(e,power?3:1,power?'charged':'sword'));
  if(!g.inCave)g.roots.forEach((r,i)=>{if(r.hp>0&&distance(r,g.player)<radius)g.hitRoot(i,power?2:1);});
  attackCrowd(g,radius,power?3:1);
  g.projectiles=g.projectiles.filter(p=>p.kind!=='bolt'||distance(p,g.player)>radius);
  g.crowdAttacks=g.crowdAttacks.filter(p=>distance(p,g.player)>radius);
 }
 if(power){g.burst(g.player,'#fff0a6',20);if(g.flying)g.particles.slice(-20).forEach(p=>p.y=g.flightY+1);}
 g.soundEvent=power?'charged':'swing';g.eventId++;
}
