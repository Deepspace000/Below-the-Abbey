/* ==========================================================================
   THE SOUND OF YARRIM. Made in the browser, no recordings.
   The wind comes in off the sea: the recorded wind of the engine in index.html, swelling and dropping, and a whistle that rides on
   top of its gusts and shrills when the party is in one of the narrow lanes between the cottages.
   And the shanty: a slow, soothing sea song of the Drowned Lantern, a soft flute over warm pads and a low drone, no stamping or clapping, which
   spills out of the inn into the lanes, louder near the door and faint down on the pier. Until Rafe has his last verse, the
   tune stops short on the fifth note of the scale and starts again, as if it were holding its breath. After that, it comes home.
   ========================================================================== */
Object.assign(WIND_AMT,{290:.85,300:.7,301:.7,302:.8,303:.9,304:.55});   // the wind of the sea, in Yarrim and on the isles
const YRS={bus:null,lp:null,wet:null,nextT:0,step:0,pass:false,wh:null,whT:0,lastOn:false,vol:0,done:null};
const yrsHz=m=>440*Math.pow(2,(m-69)/12);
const YRS_BPM=66,YRS_STEP=60/YRS_BPM/2;   // eighth notes, slow and lilting: a lullaby tempo, not a jig
/* the tune, D dorian. [step, MIDI note, length in eighths] */
const YRS_VA=[[0,62,2],[2,65,2],[4,69,2],[6,69,1],[7,67,1],[8,65,2],[10,64,2],[12,62,4],[16,62,2],[18,65,2],[20,69,2],[22,72,2],[24,71,2],[26,69,2],[28,67,4],
  [32,69,2],[34,69,2],[36,72,2],[38,74,2],[40,72,2],[42,69,2],[44,67,2],[46,65,2],[48,64,2],[50,65,2],[52,67,2],[54,64,2],[56,62,6]];
const YRS_VB=[[0,69,2],[2,69,2],[4,72,2],[6,69,2],[8,67,2],[10,65,2],[12,64,2],[14,62,2],[16,65,2],[18,67,2],[20,69,2],[22,71,2],[24,72,4],[28,69,4],
  [32,74,2],[34,72,2],[36,71,2],[38,69,2],[40,67,2],[42,69,2],[44,65,2],[46,67,2],[48,64,2],[50,62,2],[52,64,2],[54,65,2],[56,67,6]];
const YRS_CH=[[0,69,1],[1,69,1],[2,69,2],[4,69,2],[6,72,2],[8,74,4],[12,72,2],[14,69,2],[16,67,2],[18,69,2],[20,71,2],[22,67,2]];   // "haul away for Yarrim, boys"; the last bar is added below
const YRS_CHORDS={Dm:[[62,65,69],38,45],C:[[60,64,67],36,43],G:[[55,59,62],43,50],Am:[[57,60,64],45,52]};
const YRS_PROG_A=['Dm','Dm','C','Dm','Dm','C','G','Dm'],YRS_PROG_B=['Dm','C','Dm','Dm','C','Dm','G','Dm'],YRS_PROG_C=['Dm','C','G','Am'];
/* a pass through the song is: verse A (8 bars), chorus (4), verse B (8), chorus (4) */
function yrsSong(finished){
  const S=[],add=(step,midi,len,part)=>{(S[step]=S[step]||[]).push({midi,len,part})};
  const mel=(list,base)=>list.forEach(([s,m,l])=>add(base+s,m,l,'lead'));
  const comp=(prog,base)=>prog.forEach((c,i)=>{
    const [tri,b1,b2]=YRS_CHORDS[c],o=base+i*8;
    add(o,tri,8,'pad');add(o,b1,8,'bass');   // one warm chord and one low note to the bar
  });
  for(const [a,b,prog] of [[0,YRS_VA,YRS_PROG_A],[12*8,YRS_VB,YRS_PROG_B]]){mel(b,a);comp(prog,a)}
  for(const base of [64,64+96]){
    mel(YRS_CH,base);
    if(finished){add(base+24,69,3,'lead');add(base+27,67,1,'lead');add(base+28,65,2,'lead');add(base+30,62,2,'lead')}   // the last line comes home to the tonic
    else add(base+24,69,6,'lead');                                                                                     // the song has no last verse, so it stops on the fifth
    comp(YRS_PROG_C,base);
  }
  return S;
}
let YRS_SONG=yrsSong(false),YRS_SONG_DONE=yrsSong(true);
const YRS_LEN=192;
function yrsBus(){
  if(YRS.bus)return;
  YRS.bus=AC.createGain();YRS.bus.gain.value=0;YRS.lp=AC.createBiquadFilter();YRS.lp.type='lowpass';YRS.lp.frequency.value=5200;YRS.lp.Q.value=.5;
  YRS.bus.connect(YRS.lp);YRS.lp.connect(MASTER);
  // a little room: a short tail of decaying noise
  const len=Math.floor(AC.sampleRate*2.4),ir=AC.createBuffer(2,len,AC.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2)}
  const cv=AC.createConvolver();cv.buffer=ir;YRS.wet=AC.createGain();YRS.wet.gain.value=.4;YRS.lp.connect(cv);cv.connect(YRS.wet);YRS.wet.connect(MASTER);
}
const yrsEnv=(g,t,peak,a,dur,r)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,Math.max(t+a,t+dur-r));g.gain.linearRampToValueAtTime(0,t+dur+.02)};
function yrsLead(t,midi,dur){ // a soft flute: a sine and a quiet triangle, a slow breath in, a long fade, a little vibrato that comes in late
  const f=yrsHz(midi),o1=AC.createOscillator(),o2=AC.createOscillator(),lp=AC.createBiquadFilter(),g=AC.createGain(),vib=AC.createOscillator(),vg=AC.createGain();
  o1.type='sine';o2.type='triangle';o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=4;
  vib.frequency.value=4.6;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*.004,t+Math.min(.7,dur*YRS_STEP));vib.connect(vg);vg.connect(o1.frequency);vg.connect(o2.frequency);
  lp.type='lowpass';lp.frequency.value=1700;lp.Q.value=.4;
  const d=dur*YRS_STEP;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.085,t+.12);g.gain.setValueAtTime(.085,t+Math.max(.12,d*.7));g.gain.linearRampToValueAtTime(0,t+d+.55);
  o1.connect(lp);o2.connect(lp);lp.connect(g);g.connect(YRS.bus);
  const e=t+d+.65;o1.start(t);o2.start(t);vib.start(t);o1.stop(e);o2.stop(e);vib.stop(e);
}
function yrsPad(t,notes,len){ // warm chords that swell in slowly and fade out slowly, like a held breath of the sea
  const d=len*YRS_STEP,lp=AC.createBiquadFilter(),g=AC.createGain();lp.type='lowpass';lp.frequency.value=1200;lp.Q.value=.3;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+1.4);g.gain.setValueAtTime(.05,t+Math.max(1.4,d-.6));g.gain.linearRampToValueAtTime(0,t+d+1.6);
  lp.connect(g);g.connect(YRS.bus);
  for(const n of notes)for(const dt of [-5,5]){const o=AC.createOscillator();o.type=dt<0?'sine':'triangle';o.frequency.value=yrsHz(n);o.detune.value=dt;o.connect(lp);o.start(t);o.stop(t+d+1.7)}
}
function yrsBass(t,midi,len){ // one low, round note under each bar
  const f=yrsHz(midi),o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
  o.type='sine';o.frequency.value=f;lp.type='lowpass';lp.frequency.value=420;
  const d=len*YRS_STEP;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.35);g.gain.setValueAtTime(.12,t+Math.max(.35,d-1));g.gain.linearRampToValueAtTime(0,t+d+.8);
  o.connect(lp);lp.connect(g);g.connect(YRS.bus);o.start(t);o.stop(t+d+.9);
}
function yrsPlay(t,ev){
  for(const e of ev){
    if(e.part==='lead')yrsLead(t,e.midi,e.len);
    else if(e.part==='pad')yrsPad(t,e.midi,e.len);
    else if(e.part==='bass')yrsBass(t,e.midi,e.len);
  }
}
/* how loud the shanty is where the party stands: full inside the Drowned Lantern, muffled through the walls of the other houses,
   and in the lanes it falls off from the inn door at the west end of the main lane to the pier and the beaches */
function yrsLoudness(){
  if(LEVEL===291)return {v:1.15,lp:9000};
  if(LEVEL>=292&&LEVEL<=299)return {v:.28,lp:650};
  if(LEVEL!==290)return {v:0,lp:7000};
  const inn=YR.plan&&YR.plan.special&&YR.plan.special.inn,ix=inn?inn.front[0]:49,iy=inn?inn.front[1]:38,d=Math.hypot(G.P.x-ix,(G.P.y-iy)*1.2);
  const v=d<7?1:d<32?1-.62*(d-7)/25:.32-Math.min(.2,(d-32)*.012);
  return {v:Math.max(.1,v),lp:d<10?7500:d<30?5200:3300};
}
/* the whistle of the wind in the lanes, riding on the gusts of the wind engine */
function yrsWindTick(now,on){
  if(!YRS.wh){
    const mk=q=>{const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;s.loopStart=Math.random()*.5;bp.type='bandpass';bp.Q.value=q;g.gain.value=0;s.connect(bp);bp.connect(g);g.connect(MASTER);s.start();return {bp,g}};
    YRS.wh=[mk(22),mk(30)];
  }
  const e=typeof WIND!=='undefined'?WIND.env:.3,t=G.time;
  let lane=.35;
  if(LEVEL===290){const gr=G.grid;let w=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const r=gr[G.P.y+dy];if(r&&r[G.P.x+dx]>0)w++}lane=.3+.28*w}
  const a=on?lane*e*e:0;
  YRS.wh[0].bp.frequency.setTargetAtTime(520+330*Math.sin(t*.21+1.3)+620*e,now,.4);YRS.wh[0].g.gain.setTargetAtTime(a*.2,now,.35);
  YRS.wh[1].bp.frequency.setTargetAtTime(1080+420*Math.sin(t*.17+.4)+900*e,now,.4);YRS.wh[1].g.gain.setTargetAtTime(a*.08,now,.45);
}
function yarSoundTick(){
  if(!AC||!NB||!MASTER)return;
  const now=AC.currentTime,outdoors=LEVEL===290||LEVEL===291||(LEVEL>=292&&LEVEL<=299);
  const play=G.state==='play'&&!G.mute&&outdoors;
  yrsWindTick(now,G.state==='play'&&!G.mute&&SNDOPT.amb&&(LEVEL===290||LEVEL===300||LEVEL===301||LEVEL===302||LEVEL===303||LEVEL===304||(LEVEL>=400&&LEVEL<=423)));
  if(!YRS.bus){if(!play||!SNDOPT.music)return;yrsBus()}
  const L=play&&SNDOPT.music?yrsLoudness():{v:0,lp:7000};
  YRS.bus.gain.setTargetAtTime(L.v*.9*SNDOPT.music,now,.9);YRS.lp.frequency.setTargetAtTime(L.lp,now,.5);
  if(!(play&&SNDOPT.music&&L.v>0)){YRS.lastOn=false;return}
  const song=(G.flags&&G.flags.yrShanty)?YRS_SONG_DONE:YRS_SONG;
  if(!YRS.lastOn||YRS.nextT<now-.5){YRS.lastOn=true;YRS.nextT=now+.15;if(YRS.step>=YRS_LEN)YRS.step=0}   // starting again, or the page was asleep for a while
  while(YRS.nextT<now+.7){
    const ev=song[YRS.step];if(ev)yrsPlay(YRS.nextT,ev);
    YRS.nextT+=YRS_STEP;YRS.step=(YRS.step+1)%YRS_LEN;
  }
}
