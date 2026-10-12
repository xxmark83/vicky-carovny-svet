// A small, independent level contract: future worlds supply their own route and palette.
export type LevelPresentation={id:string;title:string;introSeconds:number;tempo:number;palette:{water:string;flowers:string;garden:string};objectives:{diamonds:number;shrines:number};reward:string};
export const FOREST_LEVEL:LevelPresentation={id:'forest',title:'Čarovný les',introSeconds:60,tempo:116,palette:{water:'#8ae5f2',flowers:'#fff0a4',garden:'#f8a6d5'},objectives:{diamonds:10,shrines:3},reward:'Hviezdna kocka'};
export const DEFAULT_PREFERENCES={sound:true,music:true,quality:'high' as 'high'|'low',volume:.5};
export const REWARD_SAVE='vicky-forest-reward-v1';
