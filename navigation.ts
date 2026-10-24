import {BRIDGE} from './valleyLayout';
import {distance,PATH} from './map';
import type {Vec} from './map';
// A bounded weighted A* with a binary heap; favors progress over the shortest path. Used by the wolf and occasional child-friendly guidance.
export function findRoute(start:Vec,goal:Vec,canMove:(p:Vec)=>boolean,maxNodes=8000,viaBridge=true):Vec[]{
 if(viaBridge&&distance(start,goal)>85){
  const nearest=(p:Vec)=>PATH.reduce((best,q,i)=>distance(p,q)<distance(p,PATH[best])?i:best,0),a=nearest(start),b=nearest(goal);
  if(a!==b){const dir=b>a?1:-1,stops:Vec[]=[];for(let i=a;i!==b+dir;i+=dir)stops.push(PATH[i]);stops.push(goal);const result:Vec[]=[];let previous=start;for(const p of stops){const leg=findRoute(previous,p,canMove,maxNodes,false);if(!leg.length)return [];result.push(...leg);previous=p;}return result;}
 }
 if(viaBridge&&((start.z>BRIDGE.z+7&&goal.z<BRIDGE.z-7)||(goal.z>BRIDGE.z+7&&start.z<BRIDGE.z-7))){const a={x:BRIDGE.x,z:BRIDGE.z+(start.z>BRIDGE.z?14:-14)},b={x:BRIDGE.x,z:BRIDGE.z+(start.z>BRIDGE.z?-14:14)};const first=findRoute(start,a,canMove,maxNodes,false),middle=findRoute(a,b,canMove,maxNodes,false),last=findRoute(b,goal,canMove,maxNodes,false);return first.length&&middle.length&&last.length?[...first,...middle,...last]:[];}
 if(distance(start,goal)<1.8&&Array.from({length:6},(_,i)=>({x:start.x+(goal.x-start.x)*(i+1)/6,z:start.z+(goal.z-start.z)*(i+1)/6})).every(canMove))return [{...goal}];
 const step=1.25,origin={x:Math.round(start.x/step),z:Math.round(start.z/step)},end={x:Math.round(goal.x/step),z:Math.round(goal.z/step)},key=(p:Vec)=>`${p.x}:${p.z}`;
 type Node=Vec&{f:number;g:number};const heap:Node[]=[];const push=(n:Node)=>{heap.push(n);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p].f<=n.f)break;heap[i]=heap[p];i=p;}heap[i]=n;};const pop=()=>{const n=heap[0],last=heap.pop()!;if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return n;};
 push({...origin,g:0,f:distance(origin,end)*1.35});const costs=new Map([[key(origin),0]]),parents=new Map<string,Vec>();let found:Vec|undefined;
 for(let count=0;heap.length&&count<maxNodes;count++){const current=pop();if(current.g>(costs.get(key(current))??Infinity))continue;if(distance(current,end)<1.5){found=current;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const n={x:current.x+dx,z:current.z+dz};if(!canMove({x:n.x*step,z:n.z*step})||!canMove({x:(current.x+dx*.5)*step,z:(current.z+dz*.5)*step}))continue;const g=current.g+Math.hypot(dx,dz);if(g>=(costs.get(key(n))??Infinity))continue;costs.set(key(n),g);parents.set(key(n),current);push({...n,g,f:g+distance(n,end)*1.35});}}
 if(!found)return [];const path:Vec[]=[found];while(key(path[0])!==key(origin)){const p=parents.get(key(path[0]));if(!p)return [];path.unshift(p);}const result=path.slice(1).map(p=>({x:p.x*step,z:p.z*step})),last=result.at(-1)||start;
 if(canMove(goal)&&Array.from({length:8},(_,i)=>({x:last.x+(goal.x-last.x)*(i+1)/8,z:last.z+(goal.z-last.z)*(i+1)/8})).every(canMove))result.push({...goal});return result;
}
