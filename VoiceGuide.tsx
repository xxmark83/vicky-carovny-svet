import {useEffect,useRef} from 'react';
import type {Game} from './game';
// Optional OS-local voice only. No recordings, remote speech requests or microphone access.
export function VoiceGuide({game,enabled}:{game:Game;enabled:boolean}){
 const seen=useRef(0),owner=useRef<Game>(game);
 useEffect(()=>{if(owner.current!==game){owner.current=game;seen.current=0;}if(!('speechSynthesis' in window))return;
  if(!enabled||game.mode!=='playing'){window.speechSynthesis.cancel();return;}
  if(!game.voiceHintId||seen.current===game.voiceHintId)return;seen.current=game.voiceHintId;
  const voices=window.speechSynthesis.getVoices().filter(v=>v.localService),voice=voices.find(v=>v.lang.startsWith('sk'))||voices.find(v=>v.lang.startsWith('cs'));
  if(!voice)return;const utterance=new SpeechSynthesisUtterance(game.voiceHint);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.88;utterance.volume=.7;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
 },[enabled,game,game.mode,game.voiceHintId]);
 useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);return null;
}
