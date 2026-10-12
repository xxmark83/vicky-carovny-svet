import {FOREST_LEVEL} from './levelConfig';
export const MUSIC_STEP_SECONDS=60/FOREST_LEVEL.tempo/4;
export type MusicNote={midi:number;length:number;gain:number;voice:'bell'|'flute'|'bass'|'chord'};
// Original 16-bar adventure theme. No samples, downloads, or copyrighted recordings.
const melody=[76,0,79,0,81,79,76,74,72,0,76,0,79,0,0,0,74,0,77,0,79,77,74,72,71,0,74,0,77,0,0,0,76,0,79,81,84,0,83,81,79,0,76,0,74,76,79,0,77,0,81,0,79,77,76,74,72,0,0,0,72,76,79,0];
const roots=[48,53,45,55,48,53,55,48,57,53,48,55,53,50,55,48];
export function scoreStep(step:number,action:boolean){const bar=Math.floor(step/16)%16,beat=step%16,root=roots[bar],minor=root===45||root===57||root===50;const notes:MusicNote[]=[];const m=melody[step%melody.length];if(m)notes.push({midi:m+(bar>=8?12:0),length:MUSIC_STEP_SECONDS*(beat%4===0?2.8:1.35),gain:action?.047:.037,voice:bar>=8?'flute':'bell'});
 if(beat%4===0)notes.push({midi:root+(beat===8?7:0),length:.21,gain:.07,voice:'bass'});
 if(beat===0)for(const offset of [12,minor?15:16,19])notes.push({midi:root+offset,length:1.7,gain:.011,voice:'chord'});
 if(action&&beat%2===1)notes.push({midi:root+24+[0,7,12,7][Math.floor(beat/2)%4],length:.12,gain:.012,voice:'bell'});
 return {notes,kick:beat===0||beat===8||action&&beat===11,snare:beat===4||beat===12,hat:beat%2===0,accent:bar%4===3&&beat===14};}
