// Local-only manual QA harness; no story/build storage and no production entrypoint.
import {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Scene from '../Scene';
import {Game} from '../game';
import type {Input} from '../game';
import {CASTLE,CASCADES,BRIDGE} from '../valleyLayout';
import {CAVE} from '../adventure';
function Review(){
 const [g,setGame]=useState(()=>new Game()),[low,setLow]=useState(false),[,refresh]=useState(0),[error,setError]=useState('');const input=useRef<Input>({x:0,z:0,attack:false,jump:false,magic:false,interact:false});
 useEffect(()=>{const t=setInterval(()=>refresh(n=>n+1),500);return()=>clearInterval(t);},[]);
 const place=(name:string)=>{const q=new Game(undefined,name==='desert'?'desert':'forest');q.character=g.character;q.mode='playing';q.invulnerable=100000;const p=name==='castle'?{x:CASTLE.x,z:CASTLE.z+38}:name==='bridge'?{x:BRIDGE.x,z:BRIDGE.z+26}:name==='waterfall'?{x:CASCADES[1].x-28,z:CASCADES[1].z+28}:name==='cave'?CAVE.spawn:{x:0,z:12};Object.assign(q.player,p,{y:0,vy:0});Object.assign(q.wolf,{x:p.x-2,z:p.z+2});if(name==='cave')q.inCave=true;if(name==='flight'){q.toggleFlight();q.flightY=q.flightPlane;q.player.y=q.flightY-q.floor(q.player);}setGame(q);};
 const status={level:g.level,character:g.character,mode:g.mode,x:g.player.x,z:g.player.z,y:g.player.y,floor:g.floor(g.player),canWalk:g.canMove(g.player),health:g.health,diamonds:g.gems.size,shrines:g.shrines.size,guards:g.defeated,flying:g.flying,landing:g.landing,low,error};
 return <><div id="scene"><Scene game={g} input={input} low={low} onReady={()=>{}} onError={()=>setError('renderer lost')} onSlow={()=>{}}/></div><div id="panel">{['entrance','bridge','waterfall','castle','cave','flight','desert'].map(n=><button key={n} onClick={()=>place(n)}>{n}</button>)}<button onClick={()=>{g.character=g.character==='vicky'?'chicken':'vicky';refresh(n=>n+1);}}>Postava</button><button onClick={()=>setLow(v=>!v)}>Kvalita</button><button onClick={()=>{g.mode=g.mode==='paused'?'playing':'paused';refresh(n=>n+1);}}>Pauza</button><button onClick={()=>{g.toggleFlight();refresh(n=>n+1);}}>Let / přistát</button><button onClick={()=>{input.current.attackTap=true;}}>Meč</button><button onClick={()=>{g.cameraYaw+=.5;}}>Otočit</button><button onClick={()=>{g.gems=new Set(g.layout.gems.map((_,i)=>i));g.shrines=new Set([0,1,2]);g.enemies.forEach(e=>e.hp=0);Object.assign(g.player,g.layout.chest);g.interact();refresh(n=>n+1);}}>Finále</button><pre id="qa-status">{JSON.stringify(status)}</pre></div><output id="render-metrics">Měření…</output></>;
}
createRoot(document.getElementById('root')!).render(<Review/>);
