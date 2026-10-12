// Original layered effects, generated locally. Short transients leave room for narration.
export type SoundKind='swing'|'charged'|'shot'|'chargedShot'|'impact'|'shield'|'defeat'|'animal'|'root'|'gem'|'magic'|'shrine'|'win'|'hurt'|'heal'|'jump'|'boss'|'secret'|'ring'|'story'|'wolf'|'takeoff'|'land';
export type SoundEvent={kind:SoundKind;animal?:number};
export type SoundLayer={voice:OscillatorType|'noise';from:number;to:number;at:number;length:number;gain:number;filter?:BiquadFilterType};
const tone=(from:number,to:number,at:number,length:number,gain:number,voice:OscillatorType='sine'):SoundLayer=>({voice,from,to,at,length,gain});
const air=(from:number,to:number,at:number,length:number,gain:number,filter:BiquadFilterType='bandpass'):SoundLayer=>({voice:'noise',from,to,at,length,gain,filter});
const sparkle=(notes:number[],gain=.085,step=.065)=>notes.map((f,i)=>tone(f,f*1.002,i*step,.24,gain));
export function soundLayers(event:SoundEvent,variation=0):SoundLayer[]{
 const pitch=1+(variation%3-1)*.025;
 const plans:Record<Exclude<SoundKind,'animal'>,SoundLayer[]>={
 swing:[air(700,3200,0,.16,.19),tone(350,120,.012,.13,.09,'triangle'),tone(1080,620,.045,.16,.045)],
 charged:[air(450,4500,0,.25,.22),tone(180,750,0,.19,.12,'triangle'),tone(880,440,.06,.25,.09),...sparkle([1320,1760],.06,.06).map(n=>({...n,at:n.at+.13}))],
 shot:[tone(420,1500,0,.075,.12,'triangle'),tone(1500,450,.055,.22,.105),air(2400,700,.02,.13,.08),tone(1900,2300,.12,.1,.035)],
 chargedShot:[tone(180,900,0,.15,.13,'triangle'),tone(1800,400,.08,.28,.12),air(3800,800,.04,.24,.13),...sparkle([1320,1760,2093],.065,.05).map(n=>({...n,at:n.at+.1}))],
 impact:[tone(680,240,.035,.12,.14,'triangle'),air(1800,400,.035,.09,.11),tone(1100,1650,.075,.16,.065)],
 shield:[tone(420,370,.025,.22,.09,'triangle'),tone(1070,1040,.026,.3,.08),tone(1580,1530,.026,.22,.035)],
 defeat:[air(1800,5500,.07,.22,.12),...sparkle([523,784,1047,1568],.10,.07).map(n=>({...n,at:n.at+.08})),tone(220,660,.04,.25,.075,'triangle')],
 root:[air(700,200,.025,.18,.16,'lowpass'),tone(210,90,.025,.16,.12,'triangle'),...sparkle([784,1175],.06,.055).map(n=>({...n,at:n.at+.08}))],
 gem:sparkle([1047,1568,2093],.09,.06),magic:[air(300,3500,0,.45,.13),tone(160,880,0,.4,.10,'triangle'),...sparkle([440,660,880,1320],.08,.09)],
 shrine:[air(500,3000,.05,.6,.075),...sparkle([392,494,587,784,988,1175],.09,.11)],
 win:[...sparkle([523,659,784,1047,1319,1568],.11,.13),tone(262,262,0,.7,.07,'triangle'),tone(392,392,.4,.6,.055)],
 hurt:[tone(280,150,0,.17,.1,'triangle'),tone(420,260,.06,.15,.045)],heal:sparkle([440,660,880],.08,.08),
 jump:[tone(220,580,0,.17,.075,'triangle')],boss:[tone(196,196,0,.25,.09,'triangle'),tone(147,147,.15,.28,.08,'triangle'),tone(294,392,.3,.3,.065)],
 secret:sparkle([523,784,988,1568],.09,.12),ring:sparkle([784,1047,1568],.085,.09),story:sparkle([392,587],.065,.1),
 wolf:[tone(190,300,0,.10,.065,'triangle'),tone(280,120,.075,.14,.055,'triangle'),air(500,250,.01,.12,.035,'lowpass')],
 takeoff:[air(300,2400,0,.5,.10),tone(180,880,0,.45,.075,'triangle'),...sparkle([660,988],.05,.11).map(n=>({...n,at:n.at+.2}))],
 land:[air(650,180,0,.17,.09,'lowpass'),tone(150,65,0,.14,.08,'triangle'),...sparkle([659,784],.045,.07).map(n=>({...n,at:n.at+.08}))],
 };
 if(event.kind==='animal'){
  // Cheerful stylized animal replies: moo, panda hum, bubbles, oink, baa, hop and meow.
  const voices:SoundLayer[][]=[
   [tone(140,190,.24,.28,.065,'triangle'),tone(190,130,.49,.26,.055,'triangle'),tone(280,260,.26,.4,.02)],
   [tone(230,300,.24,.19,.055,'triangle'),tone(300,200,.42,.2,.045,'triangle')],
   [tone(430,860,.24,.12,.055),tone(660,1320,.4,.12,.055)],
   [tone(270,170,.24,.10,.055,'triangle'),tone(290,150,.4,.11,.055,'triangle'),air(700,450,.25,.09,.025)],
   [tone(370,325,.24,.36,.055,'triangle'),tone(740,650,.25,.34,.022,'triangle')],
   [tone(650,1000,.24,.09,.05),tone(850,1250,.4,.09,.05)],
   [tone(520,780,.24,.18,.055,'triangle'),tone(780,320,.4,.28,.055,'triangle')],
   [tone(175,250,.24,.25,.06,'triangle'),tone(250,135,.47,.3,.055,'triangle')],
   [tone(650,1050,.24,.18,.045,'triangle'),tone(1050,500,.4,.2,.045,'triangle')],
   [tone(700,1500,.24,.12,.045),tone(900,1800,.4,.14,.045)],
  ];return (voices[event.animal??2]??voices[2]).map(n=>({...n,from:n.from*pitch,to:n.to*pitch}));
 }
 return plans[event.kind].map(n=>({...n,from:n.from*pitch,to:n.to*pitch}));
}
export class SoundQueue {
 private pending:SoundEvent[]=[];
 emit(kind:SoundKind,animal?:number){this.pending.push({kind,animal});if(this.pending.length>64)this.pending.splice(0,this.pending.length-64);}
 drain(){const events=this.pending;this.pending=[];return events;}
 clear(){this.pending=[];}
}
// One audible cue per kind in a frame, including one animal reply, even for area attacks.
export function coalesceSounds(events:SoundEvent[]){const kinds=new Set<SoundKind>();return events.filter(e=>{if(kinds.has(e.kind))return false;kinds.add(e.kind);return true;});}
