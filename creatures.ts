import type {Block} from './world';
const PAL:Record<string,string>={w:'#f6f6f6',k:'#222',o:'#f07818',p:'#f58fb4',h:'#8d5a2b',f:'#fff',P:'#ffb3c9',D:'#ec7aa0',n:'#8a3355',c:'#fff1d6',K:'#5a4650',d:'#c9731a',e:'#f7b24d',g:'#ffd23f',r:'#ff5d73',y:'#ffe14d',b:'#4dabf7',G:'#5bd66b',L:'#2fa84a',B:'#3f78e0',N:'#2a55b5',T:'#62d6a5',u:'#b57bff',v:'#8a5a2c',z:'#dff3ff'};
const COW=['..h......h..','..wwkkwwww..','oowwkkwwkwoo','opwwwwwwwwpo','oowkfwwfkwoo','..wkkwwkkw..','..wwwwwwww..','..woooooow..','..wodoodow..','..woooooow..','...wwppww...','.....pp.....','pppppppppppp','wwwwwwwwwwww','pppppppppppp','wwwwwwwwwwww','kk.ww..ww.kk','...kk..kk...'];
const PAN=['kkk....','kkkwwww','.wwwwww','.wkkkkw','.wkfkkw','.wkkkkw','.wpwwwp','.wwwwww','..wwwww','kkkkkkk','kkkwwww','kkkwwww','.kwwwww','..wwwww','..wwwww','.kkwwww','.kkk...'];
const BLU=['..BBBBB','.BBBBBB','PBTTTBB','PBTkkTB','PBTkfTB','PBTkkTB','PBBBBBN','.BBBBNN','..BTTTT','...BBBB','.BBTTTT','BBBTTTT','BBBTTTT','.BBTTTT','.BBBBBB','BBBB...','NNNN...'];
const PIG=['PP.....','DPPPPPP','.PPPPPP','.PPkfPP','.PPkkPP','.PPPPPP','.PPDDDD','.PPDnDD','.PPDDDD','..PPPPP','.PPPPPP','DPPPPPP','.PPPPPP','.PPPPPP','.PPD...','.DD....'];
const SHP=['..ccccc','.cccccc','cccKKKK','ccKfKKK','ccKKKKK','cccKKKp','.cccKKK','.cccccc','ccccccc','ccccccc','ccccccc','.cccccc','..ccccc','..KK...','..KK...'];
const BUN=['...wwp.','...wwp.','...wwp.','...wwp.','..wwwww','.wwwwww','.wkfwww','.wwwwww','.wwwwwp','.wwwwww','..wwwww','.wwwwww','wwwwwww','wwwwwww','.wwwwww','.ww....'];
const CAT=['cp.pp.','ee.eee','eeeeee','eeekcc','eepccc','eeeccp','eeeccc','.eeccc','.ecccc','.ecccc','.ecccc','.ecccc','.eeccc','.eeecc','.eeeee','.eeeee','..eee.','..ccc.'];
export const ANIMAL_KINDS=['cow','panda','blue','pig','sheep','bunny','cat'] as const;
export type AnimalKind=typeof ANIMAL_KINDS[number];
export const ANIMAL_NAMES:Record<AnimalKind,string>={cow:'Kravička',panda:'Panda',blue:'Modrý kamarát',pig:'Prasiatko',sheep:'Ovečka',bunny:'Zajačik',cat:'Mačička'};
// User supplied voxel characters, rebuilt as surface cubes at Vicky's world scale.
export function creatureBlocks(kind:number):Block[]{const original=[COW,PAN,BLU,PIG,SHP,BUN,CAT][kind%7],rows=kind%7===0?original:original.map(r=>r+[...r].reverse().join(''));const cell=.115,width=rows[0].length,b:Block[]=[];const occupied=(x:number,y:number,z:number)=>{const r=rows[y];return Math.abs(z)<=2&&r&&r[x]&&r[x]!=='.';};for(let y=0;y<rows.length;y++)for(let x=0;x<width;x++){const ch=rows[y][x];if(!ch||ch==='.')continue;for(let z=-2;z<=2;z++){if([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].every(([a,c,d])=>occupied(x+a,y+c,z+d)))continue;b.push({p:[(x-(width-1)/2)*cell,(rows.length-y-.5)*cell,z*cell],s:[cell,cell,cell],c:PAL[ch]||'#eee'});}}return b;}

// Calm closed eyes, a smile and a small heart replace the enchanted expression.
// The imported silhouette and its original .115 m cubes stay the same.
export function happyCreatureBlocks(kind:number):Block[]{
 const b=creatureBlocks(kind),eye=[1.55,1.5,1.45,1.25,1.25,1.15,1.65][kind%7];
 const face=b.filter(v=>!(v.p[2]>.2&&Math.abs(v.p[0])<.44&&Math.abs(v.p[1]-eye)<.15&&['#222','#5a4650'].includes(v.c)));
 for(const side of [-1,1]){for(let i=0;i<3;i++)face.push({p:[side*.23+(i-1)*.06,eye+(i===1?.04:0),.302],s:[.065,.045,.045],c:'#524b50'});face.push({p:[side*.36,eye-.13,.303],s:[.12,.07,.045],c:'#f3a2bd'});}
 for(let i=0;i<5;i++)face.push({p:[(i-2)*.055,eye-.28+Math.abs(i-2)*.025,.306],s:[.06,.04,.045],c:'#bc627b'});
 const top=Math.max(...b.map(v=>v.p[1]))+.4;
 for(const [x,y] of [[-1,1],[1,1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,-1],[0,-1],[1,-1],[0,-2]])face.push({p:[x*.07,top+y*.07,0],s:[.075,.075,.075],c:y===1?'#ffe5f0':'#f68cbb'});
 return face;
}
