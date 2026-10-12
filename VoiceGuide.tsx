import {useEffect,useRef,useState} from 'react';
import type {Game} from './game';
import {introCaption} from './cinematic';
import {chooseCzechVoice,spokenText} from './speech';
// Prefer a Czech voice on the device. Never substitute a Slovak or English narrator.
export function VoiceGuide({game,enabled,introSound=false,volume=.5,onSpeaking}:{game:Game;enabled:boolean;introSound?:boolean;volume?:number;onSpeaking:(speaking:boolean)=>void}){
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),seen=useRef(''),owner=useRef(game),notify=useRef(onSpeaking),session=useRef(0);
 notify.current=onSpeaking;
 const introTitle=game.mode==='intro'?introCaption(game.introTime,game.level).title:'';
 useEffect(()=>{if(!('speechSynthesis' in window))return;const update=()=>setVoices(window.speechSynthesis.getVoices());update();window.speechSynthesis.addEventListener('voiceschanged',update);return()=>window.speechSynthesis.removeEventListener('voiceschanged',update);},[]);
 useEffect(()=>{
  if(!('speechSynthesis' in window))return;
  if(owner.current!==game){owner.current=game;seen.current='';session.current++;window.speechSynthesis.cancel();notify.current(false);}
  const intro=game.mode==='intro'&&introSound,allowed=volume>0&&(intro||enabled&&['playing','won'].includes(game.mode));
  if(!allowed){session.current++;window.speechSynthesis.cancel();notify.current(false);return;}
  const id=intro?`intro-${introTitle}`:`hint-${game.voiceHintId}`;
  if(seen.current===id||!intro&&!game.voiceHintId)return;
  const voice=chooseCzechVoice(voices);if(!voice)return;
  seen.current=id;const token=++session.current;window.speechSynthesis.cancel();notify.current(false);
  const u=new SpeechSynthesisUtterance(spokenText(intro?introTitle:game.voiceHint));u.voice=voice;u.lang='cs-CZ';u.rate=intro?1:.94;u.pitch=1.04;u.volume=Math.min(1,volume*1.4);
  const finish=()=>{if(session.current===token)notify.current(false);};u.onstart=()=>{if(session.current===token)notify.current(true);};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);
 },[enabled,game,game.mode,game.voiceHintId,introTitle,introSound,volume,voices]);
 useEffect(()=>()=>{session.current++;if('speechSynthesis' in window)window.speechSynthesis.cancel();notify.current(false);},[]);
 return null;
}
export function CzechVoiceStatus(){
 const [voice,setVoice]=useState<string|null>(null);
 useEffect(()=>{if(!('speechSynthesis' in window))return;const update=()=>setVoice(chooseCzechVoice(window.speechSynthesis.getVoices())?.name??null);update();window.speechSynthesis.addEventListener('voiceschanged',update);return()=>window.speechSynthesis.removeEventListener('voiceschanged',update);},[]);
 return <p className="small-copy">{voice?`Český hlas: ${voice}.`:'Český hlas není dostupný. Přidej český hlas v nastavení zařízení; všechny pokyny zůstávají i na obrazovce.'}</p>;
}
