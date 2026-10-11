import {useMemo} from 'react';
import type {Block} from './world';
import {Box,Cubes} from './Voxel';
export function Sword(){const blocks:Block[]=useMemo(()=>{const b:Block[]=[];for(let i=0;i<8;i++){b.push({p:[0,.2+i*.13,0],s:[.21,.135,.12],c:i%2?'#f6be27':'#ffda56'});b.push({p:[-.16,.2+i*.13,0],s:[.1,.135,.13],c:'#a78c35'});b.push({p:[.16,.2+i*.13,0],s:[.1,.135,.13],c:'#bba244'});}b.push({p:[0,1.3,0],s:[.2,.15,.12],c:'#ffdf69'},{p:[0,.08,0],s:[.65,.16,.19],c:'#bca141'},{p:[-.33,.13,0],s:[.15,.25,.2],c:'#dfbe49'},{p:[.33,.13,0],s:[.15,.25,.2],c:'#dfbe49'},{p:[0,-.13,0],s:[.14,.35,.15],c:'#554635'},{p:[0,-.34,0],s:[.24,.16,.2],c:'#bca141'});return b;},[]);return <group rotation={[0,0,-.2]}><Cubes blocks={blocks}/><Box p={[0,.75,.075]} s={[.08,1.1,.035]} c="#fff0a0" glow={1.1}/></group>;}
