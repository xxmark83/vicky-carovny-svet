import {forestPoint} from './valleyLayout';
import {memo,useEffect,useMemo,useRef,useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {distance} from './map';
import {OBSTACLES} from './game';
import {groundHeight as height} from './terrain';
import {CHERRY_TREES} from './forestPlaces';
import {SCENES} from './adventure';
import type {Block} from './world';
import {Cubes} from './Voxel';
import type {Game} from './game';

type Asset={near:THREE.BufferGeometry;far:THREE.BufferGeometry};
let assetRequest:Promise<Asset[]>|undefined;
function loadAssets(){return assetRequest??=Promise.all(['oak','birch','cherry','moss-rock'].map(async name=>{
 const gltf=await new GLTFLoader().loadAsync(`/models/${name}.glb`),near=gltf.scene.getObjectByName('near') as THREE.Mesh,far=gltf.scene.getObjectByName('far') as THREE.Mesh;
 gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){const m=o.material;for(const v of Array.isArray(m)?m:[m])v.dispose();}});
 return {near:near.geometry,far:far.geometry};
}));}
function fallbackAsset():Asset{const a=new THREE.CylinderGeometry(.18,.35,6,6),b=new THREE.IcosahedronGeometry(2.8,0);a.translate(0,3,0);b.translate(0,7,0);const g=mergeGeometries([a.toNonIndexed(),b])!;g.setAttribute('color',new THREE.Float32BufferAttribute(Array.from({length:g.getAttribute('position').count},()=>[.23,.4,.14]).flat(),3));a.dispose();b.dispose();return {near:g,far:g};}
function TreeCell({blocks,asset,material,low}:{blocks:Block[];asset:Asset;material:THREE.Material;low:boolean}){const group=useRef<THREE.Group>(null),near=useRef<THREE.Group>(null),far=useRef<THREE.Group>(null);const center=useMemo(()=>{const b=blocks[0];return new THREE.Vector3(b.p[0],b.p[1]+4,b.p[2]);},[blocks]);
 useFrame(({camera})=>{const d=camera.position.distanceTo(center);group.current!.visible=d<650;near.current!.visible=d<(low?45:90);far.current!.visible=!near.current!.visible;});
 return <group ref={group}><group ref={near}><Cubes blocks={blocks} geometry={asset.near} material={material}/></group><group ref={far}><Cubes blocks={blocks} geometry={asset.far} material={material} castShadow={false}/></group></group>;
}
export const AuthoredForest=memo(function AuthoredForest({game,material,low}:{game:Game;material:THREE.MeshStandardMaterial;low:boolean}){
 const [assets,setAssets]=useState<Asset[]>(),fallback=useMemo(fallbackAsset,[]);
 useEffect(()=>{let mounted=true;loadAssets().then(a=>{if(mounted)setAssets(a);}).catch(()=>{/* Original local geometry remains playable if a model fails to load. */});return()=>{mounted=false;};},[]);
 useEffect(()=>()=>fallback.near.dispose(),[fallback]);
 const treeMaterial=useMemo(()=>{const m=material.clone();m.map=null;m.vertexColors=true;m.roughness=.87;m.onBeforeCompile=material.onBeforeCompile;m.customProgramCacheKey=()=> 'forest-authored-v32';return m;},[material]);useEffect(()=>()=>treeMaterial.dispose(),[treeMaterial]);
 const chunks=useMemo(()=>{const cells=new Map<string,{kind:number;blocks:Block[]}>();for(const [i,o] of OBSTACLES.entries()){
 if(o.kind==='rock'&&distance(o,forestPoint({x:17,z:-52}))<.01)continue;const theme=SCENES.findIndex(p=>distance(p,o)<p.r+9),kind=o.kind==='rock'?3:theme===7||CHERRY_TREES.some(p=>distance(p,o)<.1)?2:theme===1||theme===4?1:0;
 const key=`${Math.floor(o.x/40)}:${Math.floor(o.z/40)}:${kind}`,h=o.height*(o.variant===2?.7:1),wide=.83+(i%5)*.07;
 if(!cells.has(key))cells.set(key,{kind,blocks:[]});cells.get(key)!.blocks.push({p:[o.x,height(o),o.z],s:o.kind==='rock'?[o.radius*.7,o.height/1.5,o.radius*.7]:[wide,h/8.4,wide],c:i%3?'#ffffff':'#e6edc9',r:i*2.399});
 }return [...cells.entries()];},[]);
 // game is an explicit lifecycle boundary; saved coordinates/colliders remain authoritative.
 return <group visible={!game.desert}>{chunks.map(([key,c])=><TreeCell key={key} blocks={c.blocks} asset={assets?.[c.kind]??fallback} material={treeMaterial} low={low}/>)}</group>;
});
