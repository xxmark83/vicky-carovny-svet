import type {Game} from './game';
export function guardianCue(g:Game){
 const e=g.enemies[12];
 if(e.hp<=0)return {kind:'free',text:'Strážca je slobodný!',color:'#a7ed9a'} as const;
 if(g.rootsActive)return {kind:'roots',text:g.desert?'Mečom rozbi 3 pečate':'Mečom rozbi 3 korene',color:'#d9b7ff'} as const;
 if(e.windup>0)return e.attackKind==='wave'?{kind:'jump',text:'Vlna! Skoč alebo ustúp',color:'#8de4ff'} as const:{kind:'dodge',text:'Úder! Uhni z kruhu',color:'#ffc082'} as const;
 if(e.stunned>0)return {kind:'hit',text:'Teraz! Mávni mečom',color:'#ffdf77'} as const;
 return {kind:'ready',text:'Strážca pokladu',color:'#fff0bc'} as const;
}
