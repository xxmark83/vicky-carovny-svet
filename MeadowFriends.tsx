import {useMemo,useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {happyCreatureBlocks} from './creatures';
import {animalMaterial} from './animalMotion';
import {voxelGeometry} from './PopulationView';
import {FOREST_FRIENDS,meadowVisitor,visitorSpot} from './friends';
function Visitor({game,kind}:{game:Game;kind:number}){const ref=useRef<THREE.Mesh>(null),geometry=useMemo(()=>voxelGeometry(happyCreatureBlocks(kind)),[kind]),joint=useMemo(()=>animalMaterial(kind,false),[kind]);useEffect(()=>()=>{geometry.dispose();joint.material.dispose();},[geometry,joint]);useFrame(()=>{const mesh=ref.current!;mesh.visible=meadowVisitor(game,kind);if(!mesh.visible)return;const p=visitorSpot(kind,game.meadowTime);if(game.canMove(p)){mesh.position.set(p.x,game.standing(p),p.z);mesh.rotation.y=p.yaw;}joint.pose.value.set(p.t*4,1,0,0);});return <mesh ref={ref} geometry={geometry} material={joint.material} castShadow visible={false}/>;}
export function MeadowFriends({game}:{game:Game}){return <>{Array.from({length:FOREST_FRIENDS},(_,kind)=><Visitor key={kind} game={game} kind={kind}/>)}</>;}
