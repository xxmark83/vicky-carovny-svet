import {FLIGHT_Y} from './map';
import {MEADOWS} from './map';
export const SCENES=MEADOWS.map((p,i)=>({...p,name:['Kvetinový vŕšok','Brezový háj','Jazierko svetlušiek','Machové korene','Strieborná čistinka','Slnečná vyhliadka','Hubové údolie','Ružová záhrada'][i],color:['#f9ca65','#e9ecd0','#75d9db','#9cc774','#b4e1c4','#ffdb80','#c5a0ee','#efa0c9'][i]}));
export const CAVE={entry:{x:17,z:-40},exit:{x:17,z:-46},treasure:{x:17,z:-59},spawn:{x:17,z:-48}};
export const FLIGHT_RINGS=[{x:24,z:-18,y:FLIGHT_Y+1},{x:-9,z:-130,y:FLIGHT_Y+1},{x:27,z:-214,y:FLIGHT_Y+1}];
export const ROOTS=[{x:-5.2,z:-292},{x:5.2,z:-292},{x:0,z:-301}];
export const ENCOUNTERS=[{...SCENES[0],text:'Auri: Vicky, les sa bojí tieňov. Tri svätyne mu vrátia odvahu. Ja vám budem svietiť z oblohy.'},{...SCENES[3],text:'Auri: Za potokom spia ďalšie svetlá. Tvoj vlk vycíti tajomstvá, ktoré z cesty nevidno.'},{...SCENES[7],text:'Auri: Už sme blízko! Ak strážca vytvorí korene, zlom ich mečom. Spolu otvoríme zlatý poklad.'}];
export type EnemyKind='green'|'skeleton'|'cow'|'panda'|'blue'|'guardian';
export function enemyKind(e:{id:number;type:number}):EnemyKind{return e.type===2?'guardian':e.id%3===1?(['cow','panda','blue'] as const)[Math.floor(e.id/3)%3]:e.type===1?'skeleton':'green';}
export const ENEMY_NAMES:Record<EnemyKind,string>={green:'Zelená príšerka',skeleton:'Kostlivec',cow:'Zakliata kravička',panda:'Zakliata panda',blue:'Modrý strážca',guardian:'Kostlivý strážca'};
export const ENEMY_TIPS:Record<EnemyKind,string>={green:'Vyjdi z kruhu, potom švihni mečom.',skeleton:'Uhni svetelnej strele alebo ju zruš mečom.',cow:'Odíď bokom z čiary. Po rozbehu je bezbranná.',panda:'Obíď štít a zasiahni chrbát. Pomôže aj kúzlo.',blue:'Preskoč prichádzajúci modrý kruh.',guardian:'Uhni úderu, preskoč vlnu. V druhej fáze zlom tri korene.'};
