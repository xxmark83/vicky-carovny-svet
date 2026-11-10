// 3.6.0 view-only ambience: how many small particles appear each second, and how the sky is tinted. No gameplay state.
export type AmbienceInput={mode:string;walking:boolean;grounded:boolean;speed:number;rain:number;daylight:number;forestAir:boolean;low:boolean};
export const AMBIENCE_CAP=240;
export function ambienceRates(i:AmbienceInput){const q=i.low?.5:1,play=i.mode==='playing';return {dust:play&&i.walking&&i.grounded?(6+Math.min(6,Math.max(0,i.speed)))*q:0,splash:play?i.rain*26*q:0,pollen:(play||i.mode==='menu')&&i.forestAir?(1-i.rain)*Math.max(0,i.daylight-.2)*7*q:0,leaf:play&&i.forestAir?(1.6+i.rain*.6)*q:0,sparkle:play?4*q:0};}
const mix=(a:string,b:string,p:number)=>{const av=parseInt(a.slice(1),16),bv=parseInt(b.slice(1),16),t=Math.min(1,Math.max(0,p));return '#'+[16,8,0].map(s=>Math.round(((av>>s)&255)*(1-t)+((bv>>s)&255)*t).toString(16).padStart(2,'0')).join('');};
// The horizon keeps the existing fog colour, so distant hills still melt into it; only the sky overhead deepens.
export function skyGradient(w:{daylight:number;overcast:number}){const clear=mix(mix('#8577c4','#7fa0d8',(w.daylight-.2)/.3),'#3f8fe0',(w.daylight-.5)/.3);return {zenith:mix(clear,'#8d98a6',w.overcast*.75),glow:(1-w.overcast*.85)*(.22+.2*(1-w.daylight))};}
