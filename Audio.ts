import {coalesceSounds} from './soundDesign';
import type {SoundEvent,SoundKind} from './soundDesign';
import {synthesizeEffect} from './effectSynth';
import type {Game} from './game';
import {pathDistance} from './map';
import {MUSIC_STEP_SECONDS,scoreStep} from './soundtrack';
export class Sounds {
 ctx:AudioContext|null=null;enabled=true;music=true;volume=.5;
 private master:GainNode|null=null;private effects:GainNode|null=null;private band:GainNode|null=null;private wind:GainNode|null=null;private stream:GainNode|null=null;private noise:AudioBuffer|null=null;
 private nextStep=0;private nextBird=0;private nextWing=0;private nextNote=0;private note=0;private wasActive=false;
 unlock(){if(!this.ctx){const ctx=this.ctx=new AudioContext();const master=this.master=ctx.createGain(),effects=this.effects=ctx.createGain(),band=this.band=ctx.createGain(),limiter=ctx.createDynamicsCompressor();master.gain.value=0;limiter.threshold.value=-14;limiter.knee.value=18;limiter.ratio.value=4;master.connect(limiter);limiter.connect(ctx.destination);effects.connect(master);band.connect(master);
 const buffer=this.noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 for(const [kind,hz] of [['wind',650],['stream',2400]] as const){const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=hz;gain.gain.value=0;noise.connect(filter);filter.connect(gain);gain.connect(effects);noise.start();if(kind==='wind')this.wind=gain;else this.stream=gain;}}
 if(this.ctx.state==='suspended')void this.ctx.resume().catch(()=>{});}
 private tone(f:number,delay:number,duration:number,level:number,type:OscillatorType='sine',end?:number,music=false){if(!this.ctx||!this.master)return;const c=this.ctx,t=c.currentTime+Math.max(0,delay),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,level),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect((music?this.band:this.effects)!);o.start(t);o.stop(t+duration+.03);o.onended=()=>{o.disconnect();g.disconnect();};}
 private percussion(delay:number,hat:boolean,accent=false){if(!this.ctx||!this.noise||!this.band)return;const c=this.ctx,t=c.currentTime+Math.max(0,delay),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type='highpass';f.frequency.value=hat?6500:1400;g.gain.setValueAtTime(hat?.012:accent?.06:.04,t);g.gain.exponentialRampToValueAtTime(.0001,t+(hat?.045:.12));s.connect(f);f.connect(g);g.connect(this.band);s.start(t);s.stop(t+.16);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
 speaking=false;private focusUntil=0;private variation=0;private effectAt=new Map<SoundKind,number>();
 play(kind:SoundKind,animal?:number){this.playEvents([{kind,animal}]);}
 playEvents(events:SoundEvent[]){if(!this.enabled||!this.ctx||!this.effects||!this.noise||this.ctx.state!=='running')return;
  const now=this.ctx.currentTime;if(events.length)this.focusUntil=now+.25;
  for(const event of coalesceSounds(events)){const previous=this.effectAt.get(event.kind)??-Infinity;if(now-previous<.065)continue;this.effectAt.set(event.kind,now);synthesizeEffect(this.ctx,this.effects,this.noise,event,this.variation++);}
 }

 tick(g:Game){if(!this.ctx||!this.master)return;const now=this.ctx.currentTime,active=!document.hidden&&['menu','intro','playing','won','building'].includes(g.mode);this.master.gain.setTargetAtTime(active?this.volume:0,now,.1);this.effects!.gain.setTargetAtTime(this.enabled?1.3:0,now,.04);this.band!.gain.setTargetAtTime(this.music?(this.speaking?.20:now<this.focusUntil?.48:g.mode==='building'?.55:.75):0,now,.08);
 this.wind?.gain.setTargetAtTime(g.inCave?.012:g.flying?.025:.012,now,.5);const waterfall=Math.hypot(g.player.x-17,g.player.z+42),river=Math.abs(g.player.z+152);this.stream?.gain.setTargetAtTime(g.inCave?.035:Math.max(0,1-(g.desert?Math.min(...g.layout.shrines.filter((_,i)=>g.shrines.has(i)).map(p=>Math.hypot(p.x-g.player.x,p.z-g.player.z))):Math.min(waterfall,river))/25)*.055,now,.7);
 if(!active||!this.music){this.nextNote=now;this.wasActive=false;}else{if(!this.wasActive||this.nextNote<now-.3){this.nextNote=now+.025;}this.wasActive=true;
 const action=g.mode==='intro'||g.flying||g.enemies.some(e=>e.hp>0&&Math.hypot(e.x-g.player.x,e.z-g.player.z)<12)||g.crowdAttacks.length>0;
 while(this.nextNote<now+.22){const delay=this.nextNote-now,s=scoreStep(this.note++,action);for(const n of s.notes){const f=440*2**((n.midi+(g.desert?2:0)-69)/12);this.tone(f,delay,n.length,n.gain,n.voice==='bass'||n.voice==='flute'?'triangle':'sine',undefined,true);if(n.voice==='bell')this.tone(f*2,delay,n.length*.4,n.gain*.18,'sine',undefined,true);}if(s.kick)this.tone(110,delay,.15,.095,'sine',48,true);if(s.snare)this.percussion(delay,false);if(s.hat)this.percussion(delay,true);if(s.accent)this.percussion(delay,false,true);this.nextNote+=MUSIC_STEP_SECONDS;}}
 if(!this.enabled||!active||g.mode!=='playing')return;
 if(g.walking&&!g.flying&&!g.landing&&g.player.y<.1&&now>this.nextStep){this.nextStep=now+.3;const wood=river<9,stone=g.inCave||g.shrines.size>0&&pathDistance(g.player)<1;this.tone(wood?115:stone?280:180,0,.07,wood?.08:.035,'triangle',wood?65:90);}
 if(!g.inCave&&now>this.nextBird){this.nextBird=now+6+Math.random()*8;this.tone(1600,0,.16,.025,'sine',2300);this.tone(2100,.24,.2,.02,'sine',1400);}
 if(!g.inCave&&now>this.nextWing){this.nextWing=now+2.8;this.tone(85,0,.35,.012,'triangle',55);this.tone(95,.45,.35,.01,'triangle',60);}}
 dispose(){void this.ctx?.close();this.ctx=null;this.wasActive=false;}
}
