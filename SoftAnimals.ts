import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// Seven shared sculpted meshes. Body-part centers retain the existing nearby joint animation.
export function softAnimalGeometry(kind:number,happy=false){
 const parts:THREE.BufferGeometry[]=[];
 const add=(p:[number,number,number],s:[number,number,number],tone:string,round=true)=>{
  const g=(round?new THREE.SphereGeometry(1,12,8):new THREE.ConeGeometry(1,2,8)).toNonIndexed();g.scale(...s);g.translate(...p);
  const n=g.getAttribute('position').count,c=new THREE.Color(tone),colors=new Float32Array(n*3),centers=new Float32Array(n*3);
  for(let i=0;i<n;i++){colors.set([c.r,c.g,c.b],i*3);centers.set(p,i*3);}g.setAttribute('color',new THREE.BufferAttribute(colors,3));g.setAttribute('cubeCenter',new THREE.BufferAttribute(centers,3));parts.push(g);
 };
 const fur=kind===0?'#f1e8d7':kind===1?'#eee9df':kind===2?'#74cfe9':kind===3?'#f0b7bf':kind===4?'#fff2de':kind===5?'#e9d4bc':'#e2b88c';
 const dark=kind===0?'#66594c':kind===1?'#3e434b':kind===2?'#398bb7':kind===3?'#d18d9e':kind===4?'#b4a58f':kind===5?'#c3ab95':'#a67a57';
 const tall=kind===0||kind===1||kind===2,headY=tall?1.48:1.2,headZ=kind===1||kind===2?.14:.47;
 add([0,.79,-.12],[kind===1?.48:.43,kind===1?.51:.36,kind===0?.69:.58],fur);
 if(kind===1){add([0,.9,-.14],[.49,.21,.51],dark);add([0,1.12,-.1],[.43,.22,.43],fur);}
 if(kind===0){for(const side of [-1,1]){add([side*.35,.89,-.25],[.14,.23,.27],dark);add([side*.26,.97,.2],[.15,.15,.16],dark);}}
 if(kind===4){for(let i=0;i<16;i++){const a=i*2.4;add([Math.sin(a)*.36,.8+(i%3-1)*.14,-.15+Math.cos(a)*.44],[.25,.24,.26],i%3?'#fff5e3':'#e8decb');}}
 for(const side of [-1,1])for(const z of [-.44,.3]){add([side*.26,.37,z],[.15,.32,.17],kind===1?dark:fur);add([side*.26,.12,z+.07],[.19,.13,.25],kind===0?'#615d57':kind===1?dark:'#f9eee0');}
 if(kind===2){add([0,1.14,.04],[.48,.48,.39],fur);add([0,1.2,.38],[.28,.29,.08],'#a8ecf3');}
 add([0,headY,headZ],[kind===1?.46:.4,kind===5?.34:.39,kind===0?.4:.34],fur);
 if(kind===0||kind===3){add([0,headY-.16,headZ+.31],[kind===0?.34:.29,.2,.18],kind===0?'#e6b3ad':'#f3a5b3');for(const side of [-1,1])add([side*.12,headY-.14,headZ+.47],[.045,.043,.018],'#9b6e75');}
 else add([0,headY-.18,headZ+.26],[.23,.15,.16],kind===2?'#b8f0f4':'#fff1dd');
 for(const side of [-1,1]){
  if(kind===5){add([side*.19,1.79,headZ-.03],[.11,.44,.12],fur);add([side*.19,1.81,headZ+.075],[.055,.29,.025],'#e2aeb2');}
  else if(kind===6){add([side*.28,headY+.31,headZ-.04],[.16,.23,.13],fur,false);add([side*.28,headY+.34,headZ+.07],[.08,.12,.02],'#e3aaaa',false);}
  else {add([side*.42,headY+.12,headZ-.03],[.21,.12,.12],kind===1?dark:fur);}
  if(kind===0)add([side*.25,headY+.4,headZ-.05],[.075,.18,.075],'#e6cf9f',false);
  if(kind===1){add([side*.3,headY+.32,headZ],[.17,.18,.13],dark);add([side*.18,headY+.03,headZ+.29],[.15,.16,.06],dark);}
  const ex=side*.16,ez=headZ+(kind===0||kind===3?.29:.315);
  add([ex,headY+.055,ez],[.095,happy?.035:.12,.04],'#fff9ef');add([ex,headY+.05,ez+.035],[.052,happy?.018:.077,.025],kind===2?'#21596d':'#3c3435');
  if(!happy)add([ex-side*.015,headY+.085,ez+.058],[.021,.025,.009],'#fffdf5');
  add([side*.28,headY-.08,ez-.03],[.065,.04,.017],kind===2?'#b6e7f5':'#e8a5ae');
 }
 if(kind!==0&&kind!==3)add([0,headY-.14,headZ+.42],[.065,.045,.03],kind===2?'#2b7591':'#6c5657');
 add([0,headY-.23,headZ+.37],[.07,.018,.018],happy?'#bb6d86':'#976b76');
 if(kind===2){for(let i=0;i<5;i++){const a=i*1.26;add([Math.sin(a)*.34,1.91+(i%2)*.08,headZ+Math.cos(a)*.24],[.12,.29,.12],i%2?'#b9f6ff':'#4eacd7',false);}}
 if(kind===3)add([0,.87,-.73],[.1,.1,.17],dark);
 else if(kind===5)add([0,.84,-.67],[.19,.19,.19],'#fff8ed');
 else if(kind===6){for(let i=0;i<5;i++)add([Math.sin(i*.38)*.24,.83+i*.12,-.65-i*.12],[.12,.13,.16],i%2?dark:fur);}
 else add([0,.76,-.75],[.1,.13,.2],dark);
 if(happy){add([0,2.35,headZ],[.11,.11,.06],'#f5b2d1');}
 const result=mergeGeometries(parts,false)!;parts.forEach(g=>g.dispose());result.computeBoundingSphere();return result;
}
