// Authored world units. The entrance and creative meadow retain their old coordinates.
export type Point={x:number;z:number};
export const FOREST_BOUNDS={minX:-200,maxX:200,minZ:-520,maxZ:30};
export const DESERT_BOUNDS={minX:-87.5,maxX:87.5,minZ:-318,maxZ:28};
export const FOREST_FLIGHT_Y=140;
export const DESERT_FLIGHT_Y=40;
export const VALLEY_REVISION=3;
export function forestPoint<T extends Point>(p:T):T{
 const t=Math.min(1,Math.max(0,(-p.z-15)/65));
 return {...p,x:p.x*(1+.9*t),z:p.z>=-30?p.z:-30+(p.z+30)*1.65};
}
export const BRIDGE=forestPoint({x:32,z:-152});
export const CASTLE=forestPoint({x:0,z:-309});
export const VALLEY_TERRACES=[{z:30,y:0},{z:-45,y:0},{z:-100,y:12},{z:-190,y:27},{z:-275,y:46},{z:-365,y:67},{z:-455,y:88},{z:-490,y:95},{z:-540,y:95}];
export function valleyElevation(z:number){
 for(let i=1;i<VALLEY_TERRACES.length;i++){const a=VALLEY_TERRACES[i-1],b=VALLEY_TERRACES[i];if(z>=b.z){const t=Math.max(0,Math.min(1,(a.z-z)/(a.z-b.z))),s=t*t*(3-2*t);return a.y+(b.y-a.y)*s;}}
 return 95;
}

export const CASCADES=[{x:76,z:-442,top:98,bottom:70,width:15},{x:91,z:-332,top:70,bottom:45,width:19},{x:76,z:-260,top:45,bottom:23,width:16},{x:40,z:-112,top:23,bottom:9,width:12}].map(c=>({...c,x:c.x+60}));
// Shared water footprint for bed shaping, vegetation exclusion and safe landing.
export function valleyWaterSurface(p:Point):number|undefined{
 for(const c of CASCADES){if(Math.abs(p.x-c.x)<c.width*.5+3){if(p.z>=c.z&&p.z<c.z+18)return c.bottom+.1;if(p.z<c.z&&p.z>c.z-16)return c.top+.05;}}
 for(let i=0;i<CASCADES.length-1;i++){const a=CASCADES[i],b=CASCADES[i+1],t=(p.z-a.z-18)/(b.z-a.z-27);if(t>=0&&t<=1&&Math.abs(p.x-(a.x+(b.x-a.x)*t))<4)return a.bottom+(b.top-a.bottom)*t+.04;}
 return undefined;
}

export const VALLEY_FOOTBRIDGES=[{x:83.5,z:-375,y:70},{x:83.5,z:-295,y:45},{x:58,z:-145,y:23}].map(b=>({...b,x:b.x+60}));
export const onValleyFootbridge=(p:Point)=>VALLEY_FOOTBRIDGES.find(b=>Math.abs(p.x-b.x)<13&&Math.abs(p.z-b.z)<2.8);

export function castleBlocked(p:Point,pad=.38){return Math.abs(p.x-CASTLE.x)<12+pad&&p.z<CASTLE.z-6&&p.z>CASTLE.z-25;}

export const valleyCliffBlocked=(p:Point)=>CASCADES.some(c=>p.z<c.z+1&&p.z>c.z-14&&Math.abs(p.x-c.x)>c.width*.5&&Math.abs(p.x-c.x)<c.width*.5+12);

export function valleyBankHeight(p:Point,original:number){
 const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};let h=original;
 for(let i=0;i<CASCADES.length-1;i++){const a=CASCADES[i],b=CASCADES[i+1],t=(p.z-a.z-18)/(b.z-a.z-27);if(t<0||t>1)continue;const dx=Math.abs(p.x-(a.x+(b.x-a.x)*t)),weight=1-smooth((dx-11)/21);const target=a.bottom+(b.top-a.bottom)*t+.8;h=h*(1-weight)+target*weight;}
 for(const c of CASCADES){const dx=Math.abs(p.x-c.x),side=1-smooth((dx-c.width*.5-13)/22);if(p.z>=c.z&&p.z<c.z+50){const fade=1-smooth((p.z-c.z-30)/20),w=side*fade;h=h*(1-w)+(c.bottom+.8)*w;}else if(p.z<c.z&&p.z>c.z-32){const fade=1-smooth((c.z-p.z-15)/17),w=side*fade;h=h*(1-w)+(c.top-.1)*w;}}
 return h;
}
