export type LevelId='forest'|'desert';
export type LevelPresentation={id:LevelId;number:number;title:string;introSeconds:number;tempo:number;palette:{water:string;flowers:string;garden:string};objectives:{diamonds:number;shrines:number};reward:string};
export const FOREST_LEVEL:LevelPresentation={id:'forest',number:1,title:'Kouzelný les',introSeconds:60,tempo:116,palette:{water:'#8ae5f2',flowers:'#fff0a4',garden:'#f8a6d5'},objectives:{diamonds:10,shrines:3},reward:'Hvězdná kostka'};
export const DESERT_LEVEL:LevelPresentation={id:'desert',number:2,title:'Zlatá poušť',introSeconds:60,tempo:116,palette:{water:'#64e1dc',flowers:'#f5a9cf',garden:'#ffd279'},objectives:{diamonds:10,shrines:3},reward:'Sluneční srdce'};
export const levelInfo=(id:LevelId)=>id==='desert'?DESERT_LEVEL:FOREST_LEVEL;
export const storySaveKey=(id:LevelId)=>id==='desert'?'vicky-desert-save-v1':'vicky-forest-save-v1';
export const DEFAULT_PREFERENCES={sound:true,music:true,quality:'high' as 'high'|'low',volume:.5};
export const REWARD_SAVE='vicky-forest-reward-v1';
export const DESERT_REWARD_SAVE='vicky-desert-reward-v1';
