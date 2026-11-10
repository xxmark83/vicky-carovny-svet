import {CREATIVE_MEADOW} from './map';
// Kamarádi: every freed animal stays with the child for good. The story save
// is cleared after the treasure, so this collection lives under its own key and
// is the reason to come back: empty album places and a meadow that fills up.
export const FRIENDS_SAVE='vikousek-friends-v1';
export const FRIEND_CAST=[
 {name:'Kravička',icon:'🐮'},{name:'Panda',icon:'🐼'},{name:'Modrý kamarád',icon:'💙'},{name:'Prasátko',icon:'🐷'},{name:'Ovečka',icon:'🐑'},{name:'Zajíček',icon:'🐰'},{name:'Kočička',icon:'🐱'},
 {name:'Velbloud',icon:'🐪'},{name:'Pouštní liška',icon:'🦊'},{name:'Kouzelný skarabeus',icon:'🪲'}
] as const;
export const FOREST_FRIENDS=7;
// Same numbering as the animal voices: the first three desert kinds are their own animals.
export const friendId=(kind:number,desert:boolean)=>{const k=((kind%FOREST_FRIENDS)+FOREST_FRIENDS)%FOREST_FRIENDS;return desert&&k<3?k+FOREST_FRIENDS:k;};
export type FriendsSave={version:1;freed:number[]};
export function validateFriends(v:unknown):v is FriendsSave{if(!v||typeof v!=='object')return false;const s=v as FriendsSave;return s.version===1&&Array.isArray(s.freed)&&s.freed.length===FRIEND_CAST.length&&s.freed.every(n=>Number.isInteger(n)&&n>=0);}
export class Friends{
 freed:number[]=FRIEND_CAST.map(()=>0);revision=0;
 constructor(saved?:unknown){this.load(saved);}
 load(saved?:unknown){if(validateFriends(saved))this.freed=[...saved.freed];}
 has(id:number){return this.freed[id]>0;}
 get size(){return this.freed.filter(n=>n>0).length;}
 get complete(){return this.size===FRIEND_CAST.length;}
 // Returns true only the first time, so the game celebrates a new friend once.
 add(id:number){if(!(id in this.freed))return false;const first=this.freed[id]===0;this.freed[id]=Math.min(9999,this.freed[id]+1);this.revision++;return first;}
 save():FriendsSave{return {version:1,freed:[...this.freed]};}
}
// One collection for the whole app: both worlds and the meadow share it.
export const SHARED_FRIENDS=new Friends();
// The first visitors still come to admire any building; freed friends live here for good.
const ADMIRERS=[5,4,6];
export const meadowVisitor=(game:{friends:Friends;build:{cells:unknown[]}},kind:number)=>game.friends.has(kind)||ADMIRERS.includes(kind)&&game.build.cells.length>0;
// Each friend strolls its own ring so seven animals never form one queue.
export function visitorSpot(kind:number,time:number){const t=time+kind*9,a=t*(.11+kind%3*.03)*(kind%2?-1:1)+kind*2*Math.PI/FOREST_FRIENDS,r=12.8+kind%3*.9;return {x:CREATIVE_MEADOW.x+Math.sin(a)*r,z:CREATIVE_MEADOW.z+Math.cos(a)*r,yaw:Math.atan2(Math.cos(a),-Math.sin(a))+(kind%2?Math.PI:0),t};}
