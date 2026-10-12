import type {Game} from './game';
import {WALK_SPEED} from './map';
export function heroPose(g:Game){
 const speed=Math.min(1,g.heroSpeed/WALK_SPEED),phase=g.heroGait;
 const run=Math.sin(phase)*.62*speed;
 const quiet=!g.walking&&!g.flying&&!g.landing&&g.attackTime===0&&g.swordCharge===0;
 const salute=quiet&&g.heroGesture==='shrine'?Math.sin(Math.min(1,(2.4-g.heroGestureTime)/2.4)*Math.PI):0;
 const wave=quiet&&g.heroGesture==='gem'?Math.sin(Math.min(1,(1.4-g.heroGestureTime)/1.4)*Math.PI):0;
 const lookWolf=quiet&&(g.wolfMood==='sniff'||g.wolfMood==='pet'||g.guide.until>g.elapsed);
 const worldYaw=Math.atan2(g.wolf.x-g.player.x,g.wolf.z-g.player.z),relative=Math.atan2(Math.sin(worldYaw-g.player.yaw),Math.cos(worldYaw-g.player.yaw));
 return {speed,run,salute,wave,look:lookWolf?Math.max(-.55,Math.min(.55,relative)):0};
}
