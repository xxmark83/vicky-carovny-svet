// Development-only compatibility smoke. This is not the gameplay renderer.
import * as T from 'three/webgpu';
import {color,mix,positionWorld,sin,time} from 'three/tsl';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const result=document.getElementById('result')!;
async function run(){
 const forced=new URLSearchParams(location.search).get('backend')==='webgl';
 const renderer=new T.WebGPURenderer({antialias:true,forceWebGL:forced});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;await renderer.init();document.body.append(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#a9d6e6');scene.add(new T.HemisphereLight('#dcecff','#4b653b',1.5));const sun=new T.DirectionalLight('#fff1c6',2.8);sun.position.set(20,35,12);scene.add(sun);
 const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,200);camera.position.set(20,15,28);camera.lookAt(0,4,0);
 const ground=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardNodeMaterial({color:'#91ae59',roughness:.9}));ground.rotation.x=-Math.PI/2;scene.add(ground);
 const loader=new GLTFLoader();for(const [kind,name] of ['oak','birch','cherry'].entries()){const gltf=await loader.loadAsync(`/models/${name}.glb`),mesh=gltf.scene.getObjectByName('near') as T.Mesh;const trees=new T.InstancedMesh(mesh.geometry,new T.MeshStandardNodeMaterial({vertexColors:true,roughness:.9}),18),o=new T.Object3D();for(let i=0;i<18;i++){o.position.set(-25+(i%6)*10+kind*2,0,-20-Math.floor(i/6)*10+kind*3);o.rotation.y=i*2.399;o.updateMatrix();trees.setMatrixAt(i,o.matrix);}scene.add(trees);}
 const water=new T.MeshStandardNodeMaterial({roughness:.25,metalness:.2});water.colorNode=mix(color('#237d91'),color('#a2ede2'),sin(positionWorld.x.mul(2).add(time)).mul(.5).add(.5));const pool=new T.Mesh(new T.PlaneGeometry(15,18),water);pool.rotation.x=-Math.PI/2;pool.position.set(1,.05,0);scene.add(pool);
 let hookCalled=false;const legacy=new T.MeshStandardMaterial({color:'#ef7a9a'});legacy.onBeforeCompile=()=>{hookCalled=true;};const legacyMesh=new T.Mesh(new T.SphereGeometry(1.2,16,12),legacy);legacyMesh.position.set(0,1.3,8);scene.add(legacyMesh);
 let frames=0,start=0;const details={requested:forced?'WebGL fallback':'WebGPU',actualBackend:renderer.backend.constructor.name,legacyGlslHookCalled:false,tslWater:true,modelsLoaded:true,frames:0,fps:0,status:'sampling'};
 await renderer.setAnimationLoop(now=>{if(!start)start=now;renderer.render(scene,camera);frames++;details.legacyGlslHookCalled=hookCalled;details.frames=frames;details.fps=Math.round(frames/Math.max(.001,(now-start)/1000));details.status=frames>=180?'passed smoke; legacy GLSL parity NOT passed':'sampling';result.textContent=JSON.stringify(details,null,2);if(frames>=180)renderer.setAnimationLoop(null);});
}
run().catch(e=>{result.textContent=JSON.stringify({status:'failed',error:String(e)});});
