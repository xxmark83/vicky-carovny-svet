export type CzechVoice={lang:string;name:string;localService:boolean;default:boolean};
export function chooseCzechVoice<T extends CzechVoice>(voices:T[]):T|undefined{
 return voices.filter(v=>/^cs(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>rank(b)-rank(a))[0];
}
function rank(v:CzechVoice){return (v.localService?100:0)+(/zuzana|vlasta|terez|natural|neural|premium|enhanced/i.test(v.name)?20:0)+(v.default?1:0);}
export function spokenText(text:string){return text.replace(/^(Vikoušek|Auri|Vlk):\s*/,'').replace(/\b10\b/g,'deset').replace(/\b3\b/g,'tři').replace(/\b13\b/g,'třináct');}
export function milestoneSpeech(sound:string,gems:number){return ['shrine','secret','win','boss','takeoff','story'].includes(sound)||sound==='gem'&&(gems===1||gems===10);}
