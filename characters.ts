export type CharacterKind='vicky'|'chicken';
export const CHARACTER_SAVE='vikousek-character-v1';
export function characterKind(value:unknown):CharacterKind{return value==='chicken'?'chicken':'vicky';}
