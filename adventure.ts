import {forestPoint} from './valleyLayout';
import {FLIGHT_Y} from './map';
import {MEADOWS} from './map';
export const SCENES=MEADOWS.map((p,i)=>({...p,name:['Květinový vršek','Březový háj','Jezírko světlušek','Mechové kořeny','Stříbrná mýtina','Slunečná vyhlídka','Houbové údolí','Růžová zahrada'][i],color:['#f9ca65','#e9ecd0','#75d9db','#9cc774','#b4e1c4','#ffdb80','#c5a0ee','#efa0c9'][i]}));
export const CAVE={entry:forestPoint({x:17,z:-40}),exit:{x:17,z:-46},treasure:{x:17,z:-59},spawn:{x:17,z:-48}};
export const FLIGHT_RINGS=[{x:24,z:-18,y:FLIGHT_Y+1},{x:-9,z:-130,y:FLIGHT_Y+1},{x:27,z:-214,y:FLIGHT_Y+1}].map(forestPoint);
export const ROOTS=[{x:-5.2,z:-292},{x:5.2,z:-292},{x:0,z:-301}].map(forestPoint);
export const ENCOUNTERS=[{...SCENES[0],text:'Auri: Vikoušku, les se bojí stínů. Tři svatyně mu vrátí odvahu. Já vám budu svítit z oblohy.'},{...SCENES[3],text:'Auri: Za potokem spí další světla. Tvůj vlk vycítí tajemství, která z cesty neuvidíš.'},{...SCENES[7],text:'Auri: Už jsme blízko! Až strážce vytvoří kořeny, rozbij je mečem. Společně otevřeme zlatý poklad.'}];
export type EnemyKind='green'|'skeleton'|'cow'|'panda'|'blue'|'guardian';
export function enemyKind(e:{id:number;type:number}):EnemyKind{return e.type===2?'guardian':e.id%3===1?(['cow','panda','blue'] as const)[Math.floor(e.id/3)%3]:e.type===1?'skeleton':'green';}
export const ENEMY_NAMES:Record<EnemyKind,string>={green:'Zelená příšerka',skeleton:'Kostlivec',cow:'Zakletá kravička',panda:'Zakletá panda',blue:'Modrý strážce',guardian:'Kostlivý strážce'};
export const ENEMY_TIPS:Record<EnemyKind,string>={green:'Vyjdi z kruhu, potom švihni mečem.',skeleton:'Uhni světelné střele nebo ji odraz mečem.',cow:'Ustup stranou z čáry. Po rozběhu je bezbranná.',panda:'Obejdi štít a zasáhni záda. Pomůže i kouzlo.',blue:'Přeskoč přicházející modrý kruh.',guardian:'Uhni úderu a přeskoč vlnu. Ve druhé fázi rozbij tři kořeny.'};
