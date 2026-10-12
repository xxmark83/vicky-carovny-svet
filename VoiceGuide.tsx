import {useEffect,useRef} from 'react';
import type {Game} from './game';
import {introCaption} from './cinematic';
// OS-local Slovak/Czech voice only, with no microphone or external speech service.
export function VoiceGuide({game,enabled,introSound=false,volume=.5}:{game:Game;enabled:boolean;introSound?:boolean;volume?:number}){
 const seen=useRef(''),owner=useRef<Game>(game),introTitle=game.mode==='intro'?introCaption(game.introTime).title:'';
 useEffect(()=>{if(owner.current!==game){owner.current=game;seen.current='';}if(!('speechSynthesis' in window))return;const intro=game.mode==='intro'&&introSound;
  if(!intro&&(!enabled||game.mode!=='playing')){window.speechSynthesis.cancel();return;}
  const id=intro?introTitle:`hint-${game.voiceHintId}`;if(seen.current===id||!intro&&!game.voiceHintId)return;
  const voices=window.speechSynthesis.getVoices().filter(v=>v.localService),voice=voices.find(v=>v.lang.startsWith('sk'))||voices.find(v=>v.lang.startsWith('cs'));if(!voice)return;seen.current=id;
  const utterance=new SpeechSynthesisUtterance(intro?introTitle:game.voiceHint);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=intro?.98:.88;utterance.volume=Math.min(1,volume*1.4);window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
 },[enabled,game,game.mode,game.voiceHintId,introTitle,introSound,volume]);
 useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);return null;
}
