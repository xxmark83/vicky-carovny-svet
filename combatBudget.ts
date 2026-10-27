import type {Game} from './game';
import {distance} from './map';
// The population is unchanged. Warnings take turns so a child can read one attack.
export const CHILD_COMBAT={groundAttackers:1,airAttackers:2,minimumWarning:1.1,hurtGrace:2.2};
export function storyAttackSlot(g:Game,id:number){
 const busy=g.enemies.find(e=>e.hp>0&&(e.windup>0||e.charge>0));
 if(busy)return busy.id===id;
 if(g.projectiles.length||g.crowdAttacks.length||g.invulnerable>0)return false;
 const nearest=g.enemies.filter(e=>e.hp>0&&e.stunned===0&&e.cooldown===0&&distance(e,g.player)<12).sort((a,b)=>distance(a,g.player)-distance(b,g.player)||a.id-b.id)[0];
 return nearest?.id===id;
}
