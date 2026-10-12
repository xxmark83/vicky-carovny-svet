import type {Game} from './game';
export function guardianCue(g:Game){
 const e=g.enemies[12];
 if(e.hp<=0)return {kind:'free',text:'Strážce je svobodný!',color:'#a7ed9a'} as const;
 if(g.rootsActive)return {kind:'roots',text:g.desert?'Mečem rozbij 3 pečeti':'Mečem rozbij 3 kořeny',color:'#d9b7ff'} as const;
 if(e.windup>0)return e.attackKind==='wave'?{kind:'jump',text:'Vlna! Skoč nebo ustup',color:'#8de4ff'} as const:{kind:'dodge',text:'Úder! Uhni z kruhu',color:'#ffc082'} as const;
 if(e.stunned>0)return {kind:'hit',text:'Teď! Mávni mečem',color:'#ffdf77'} as const;
 return {kind:'ready',text:'Strážce pokladu',color:'#fff0bc'} as const;
}
