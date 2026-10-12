import {useMemo,useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {Game} from './game';
import {happyCreatureBlocks} from './creatures';
import {animalMaterial} from './animalMotion';
import {voxelGeometry} from './PopulationView';
function Visitor({game,kind,index}:{game:Game;kind:number;index:number}){const ref=useRef<THREE.Mesh>(null),geometry=useMemo(()=>voxelGeometry(happyCreatureBlocks(kind)),[kind]),joint=useMemo(()=>animalMaterial(kind,false),[kind]);useEffect(()=>()=>{geometry.dispose();joint.material.dispose();},[geometry,joint]);useFrame(()=>{const t=game.meadowTime+index*9,a=t*.15+index*2.1,p={x:-28+Math.sin(a)*12.8,z:7+Math.cos(a)*12.8};if(game.canMove(p)){ref.current!.position.set(p.x,game.standing(p),p.z);ref.current!.rotation.y=Math.atan2(Math.cos(a),-Math.sin(a));}joint.pose.value.set(t*4,1,0,0);ref.current!.visible=game.build.cells.length>0;});return <mesh ref={ref} geometry={geometry} material={joint.material} castShadow/>;}
export function MeadowFriends({game}:{game:Game}){return <>{[5,4,6].map((kind,index)=><Visitor key={kind} game={game} kind={kind} index={index}/>)}</>;}
