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
