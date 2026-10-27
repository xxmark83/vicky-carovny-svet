import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
type XYZ=[number,number,number];
// Original lightweight sculpt, inspired by the supplied rooster's silhouette and colours.
export function chickenGeometry(){
 const parts:Record<string,THREE.BufferGeometry[]>={body:[],head:[],eyes:[],pupils:[],wing:[],leg:[],foot:[],tail:[]};
 const add=(kind:string,geometry:THREE.BufferGeometry,tone:string,p:XYZ=[0,0,0],scale:XYZ=[1,1,1],rotate:XYZ=[0,0,0])=>{
  const g=geometry.index?geometry.toNonIndexed():geometry; if(g!==geometry)geometry.dispose();
  g.deleteAttribute('uv');g.scale(...scale);g.rotateX(rotate[0]);g.rotateY(rotate[1]);g.rotateZ(rotate[2]);g.translate(...p);
  const c=new THREE.Color(tone),n=g.getAttribute('position').count,colors=new Float32Array(n*3);for(let i=0;i<n;i++)colors.set([c.r,c.g,c.b],i*3);g.setAttribute('color',new THREE.BufferAttribute(colors,3));parts[kind].push(g);
 };
 const oval=(kind:string,p:XYZ,s:XYZ,c:string,r:XYZ=[0,0,0])=>add(kind,new THREE.SphereGeometry(1,12,9),c,p,s,r);
 oval('body',[0,1.02,-.13],[.43,.49,.6],'#155b61');oval('body',[0,.95,.22],[.34,.38,.36],'#20717a');
 // Layered breast plumage and a long orange neck, rather than a cuboid costume.
 oval('body',[0,1.56,.13],[.20,.64,.21],'#e79027');
 for(let ring=0;ring<6;ring++)for(let i=0;i<9;i++){const a=i*Math.PI*2/9,wide=.19+(5-ring)*.025;oval('body',[Math.sin(a)*wide,1.19+ring*.12,Math.cos(a)*wide+.13],[.058,.25-ring*.018,.048],['#efa133','#d47519','#ffba48'][i%3],[Math.cos(a)*-.18,0,Math.sin(a)*.18]);}
 for(let i=0;i<22;i++){const a=i*2.399;oval('body',[Math.sin(a)*.35,.89+(i%4)*.11,-.15+Math.cos(a)*.44],[.10,.22,.065],['#14606b','#258881','#163f51','#247b65'][i%4],[.1,a,.1]);}
 oval('head',[0,.14,.1],[.235,.27,.23],'#d99935');
 oval('head',[0,.48,-.02],[.095,.36,.25],'#df343d',[.15,0,0]);
 for(let i=0;i<4;i++)oval('head',[0,.67+Math.sin(i*.8)*.07,-.25+i*.15],[.075,.24,.10],'#f04a4b',[-.35+i*.12,0,0]);
 for(const side of [-1,1]){
  oval('head',[side*.13,-.08,.35],[.075,.27,.065],'#e93b45',[.12,0,side*.07]);
  oval('eyes',[side*.22,.19,.28],[.23,.31,.20],'#b45869');
  oval('eyes',[side*.24,.24,.35],[.215,.28,.20],'#fff5de');
  oval('pupils',[side*.25+(side>0?.025:-.025),.26+(side>0?.025:-.02),.535],[.073,.10,.032],'#1a3438');
  oval('pupils',[side*.25-.019,.30,.565],[.024,.035,.013],'#ffffff');
 }
 add('head',new THREE.ConeGeometry(.145,.32,8),'#ffc24f',[0,.09,.52],[1,1,1],[Math.PI/2,0,0]);
 oval('head',[0,-.015,.49],[.12,.065,.14],'#b86a1e');
 oval('wing',[.015,-.04,0],[.16,.35,.38],'#16505a',[.1,0,-.15]);
 for(let i=0;i<7;i++)oval('wing',[.09,-.14-i*.035,-.22+i*.07],[.075,.27,.10],i%2?'#247d7d':'#1a6570',[.14,0,-.15+i*.02]);
 add('leg',new THREE.CylinderGeometry(.055,.065,.48,8),'#ec9b32',[0,-.24,0]);
 for(let i=0;i<5;i++)oval('leg',[0,-.1-i*.07,.012],[.062,.019,.064],'#ffd067');
 oval('foot',[0,-.015,.07],[.095,.075,.16],'#f5b344');
 for(let i=-1;i<=1;i++){oval('foot',[i*.12,-.025,.22],[.065,.055,.22],'#f6b441',[0,i*.35,0]);oval('foot',[i*.17,-.02,.405],[.035,.03,.07],'#f7e5a7',[0,i*.35,0]);}
 oval('foot',[0,-.01,-.10],[.05,.05,.15],'#e69c32');
 // Curved feather ribbons form the long, sweeping fan tail.
 for(let feather=0;feather<9;feather++){
  const spread=(feather-4)/4,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(spread*.3,.65,-.5),new THREE.Vector3(spread*.65,.75,-1.2),new THREE.Vector3(spread*.8,-.25,-1.7+Math.abs(spread)*.3)]),positions:number[]=[],ids:number[]=[];
  for(let i=0;i<=18;i++){const t=i/18,v=curve.getPoint(t),width=Math.pow(Math.sin(t*Math.PI),.65)*(.09+(feather%3)*.018);for(const edge of [-1,0,1])positions.push(v.x+edge*width,v.y+(edge===0?.025:0),v.z);}
  for(let i=0;i<18;i++)for(let j=0;j<2;j++){const a=i*3+j;ids.push(a,a+3,a+1,a+1,a+3,a+4);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(ids);g.computeVertexNormals();add('tail',g,['#143c57','#247d78','#19544d','#347e65'][feather%4]);
 }
 const result=Object.fromEntries(Object.entries(parts).map(([kind,items])=>{const g=mergeGeometries(items)!;items.forEach(p=>p.dispose());g.computeBoundingSphere();g.computeBoundingBox();return [kind,g];})) as Record<keyof typeof parts,THREE.BufferGeometry>;
 return result;
}
