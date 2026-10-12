import {soundLayers} from './soundDesign';
import type {SoundEvent} from './soundDesign';
export function synthesizeEffect(ctx:BaseAudioContext,output:AudioNode,noise:AudioBuffer,event:SoundEvent,variation=0,offset=0){
 for(const layer of soundLayers(event,variation)){
  const t=ctx.currentTime+offset+layer.at,end=t+layer.length,gain=ctx.createGain();let source:OscillatorNode|AudioBufferSourceNode;let filter:BiquadFilterNode|undefined;
  if(layer.voice==='noise'){const s=ctx.createBufferSource();s.buffer=noise;source=s;filter=ctx.createBiquadFilter();filter.type=layer.filter??'bandpass';filter.Q.value=.7;filter.frequency.setValueAtTime(layer.from,t);filter.frequency.exponentialRampToValueAtTime(layer.to,end);source.connect(filter);filter.connect(gain);}
  else{const s=ctx.createOscillator();source=s;s.type=layer.voice;s.frequency.setValueAtTime(layer.from,t);s.frequency.exponentialRampToValueAtTime(layer.to,end);source.connect(gain);}
  gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(layer.gain,t+.007);gain.gain.exponentialRampToValueAtTime(layer.gain*.35,t+layer.length*.45);gain.gain.exponentialRampToValueAtTime(.0001,end);gain.connect(output);source.start(t);source.stop(end+.025);source.onended=()=>{source.disconnect();filter?.disconnect();gain.disconnect();};
 }
}
