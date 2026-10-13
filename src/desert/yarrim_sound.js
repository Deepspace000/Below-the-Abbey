/* ==========================================================================
   THE SOUND OF YARRIM. Made in the browser, no recordings.
   The wind comes in off the sea: the recorded wind of the engine in index.html, swelling and dropping, and a whistle that rides on
   top of its gusts and shrills when the party is in one of the narrow lanes between the cottages.
   And the shanty: a jig-time sea song of the Drowned Lantern, played on a fiddle and a squeezebox with a stamp and a clap, which
   spills out of the inn into the lanes, louder near the door and faint down on the pier. Until Rafe has his last verse, the
   tune stops short on the fifth note of the scale and starts again, as if it were holding its breath. After that, it comes home.
   ========================================================================== */
Object.assign(WIND_AMT,{290:.85,300:.7,301:.7,302:.8,303:.9,304:.55});   // the wind of the sea, in Yarrim and on the isles
const YRS={bus:null,lp:null,wet:null,nextT:0,step:0,pass:false,wh:null,whT:0,lastOn:false,vol:0,done:null};
const yrsHz=m=>440*Math.pow(2,(m-69)/12);
const YRS_BPM=108,YRS_STEP=60/YRS_BPM/2;   // eighth notes; four to a beat of a bar of eight
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
    add(o,b1,3,'bass');add(o+4,b2,3,'bass');add(o+2,tri,1,'stab');add(o+6,tri,1,'stab');
    add(o,0,1,'stamp');add(o+4,0,1,'stamp');add(o+2,0,1,'clap');add(o+6,0,1,'clap');
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
  YRS.bus=AC.createGain();YRS.bus.gain.value=0;YRS.lp=AC.createBiquadFilter();YRS.lp.type='lowpass';YRS.lp.frequency.value=7000;YRS.lp.Q.value=.5;
  YRS.bus.connect(YRS.lp);YRS.lp.connect(MASTER);
  // a little room: a short tail of decaying noise
  const len=Math.floor(AC.sampleRate*1.1),ir=AC.createBuffer(2,len,AC.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  const cv=AC.createConvolver();cv.buffer=ir;YRS.wet=AC.createGain();YRS.wet.gain.value=.22;YRS.lp.connect(cv);cv.connect(YRS.wet);YRS.wet.connect(MASTER);
}
const yrsEnv=(g,t,peak,a,dur,r)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,Math.max(t+a,t+dur-r));g.gain.linearRampToValueAtTime(0,t+dur+.02)};
function yrsLead(t,midi,dur){ // the fiddle: two saws, a bow that bites a little at the start, a vibrato that comes in late
  const f=yrsHz(midi),o1=AC.createOscillator(),o2=AC.createOscillator(),lp=AC.createBiquadFilter(),g=AC.createGain(),vib=AC.createOscillator(),vg=AC.createGain();
  o1.type=o2.type='sawtooth';o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=8;
  vib.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*.011,t+Math.min(.35,dur));vib.connect(vg);vg.connect(o1.frequency);vg.connect(o2.frequency);
  lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(1900,t+.12);lp.Q.value=.9;
  yrsEnv(g,t,.1,.025,dur*YRS_STEP*.94,.07);
  o1.connect(lp);o2.connect(lp);lp.connect(g);g.connect(YRS.bus);
  const e=t+dur*YRS_STEP*.94+.1;o1.start(t);o2.start(t);vib.start(t);o1.stop(e);o2.stop(e);vib.stop(e);
  const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),ng=AC.createGain();s.buffer=NB;bp.type='bandpass';bp.frequency.value=2600;bp.Q.value=.8;ng.gain.setValueAtTime(.05,t);ng.gain.exponentialRampToValueAtTime(.001,t+.07);s.connect(bp);bp.connect(ng);ng.connect(YRS.bus);s.start(t);s.stop(t+.09); // the bow
}
function yrsStab(t,notes){ // the squeezebox: reedy chords on the off-beats
  const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;lp.Q.value=.6;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+.3);
  lp.connect(g);g.connect(YRS.bus);
  for(const n of notes)for(const dt of [-7,6]){const o=AC.createOscillator();o.type='square';o.frequency.value=yrsHz(n);o.detune.value=dt;o.connect(lp);o.start(t);o.stop(t+.34)}
}
function yrsBass(t,midi,len){
  const f=yrsHz(midi),o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
  o.type='triangle';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2;lp.type='lowpass';lp.frequency.value=700;
  const d=len*YRS_STEP;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(YRS.bus);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05);
}
function yrsStamp(t){ // a boot on a plank
  const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(48,t+.11);
  g.gain.setValueAtTime(.34,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(YRS.bus);o.start(t);o.stop(t+.18);
  const s=AC.createBufferSource(),lp=AC.createBiquadFilter(),ng=AC.createGain();s.buffer=NB;lp.type='lowpass';lp.frequency.value=520;ng.gain.setValueAtTime(.22,t);ng.gain.exponentialRampToValueAtTime(.001,t+.07);s.connect(lp);lp.connect(ng);ng.connect(YRS.bus);s.start(t);s.stop(t+.09);
}
function yrsClap(t){ // two palms, one just after the other
  for(const dt of [0,.018]){const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;bp.type='bandpass';bp.frequency.value=1500+dt*9000;bp.Q.value=1.1;
    g.gain.setValueAtTime(.15,t+dt);g.gain.exponentialRampToValueAtTime(.001,t+dt+.075);s.connect(bp);bp.connect(g);g.connect(YRS.bus);s.start(t+dt);s.stop(t+dt+.09)}
}
function yrsPlay(t,ev){
  for(const e of ev){
    if(e.part==='lead')yrsLead(t,e.midi,e.len);
    else if(e.part==='stab')yrsStab(t,e.midi);
    else if(e.part==='bass')yrsBass(t,e.midi,e.len);
    else if(e.part==='stamp')yrsStamp(t);
    else if(e.part==='clap')yrsClap(t);
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
  yrsWindTick(now,G.state==='play'&&!G.mute&&SNDOPT.amb&&(LEVEL===290||LEVEL===300||LEVEL===301||LEVEL===302||LEVEL===303||LEVEL===304));
  if(!YRS.bus){if(!play||!SNDOPT.music)return;yrsBus()}
  const L=play&&SNDOPT.music?yrsLoudness():{v:0,lp:7000};
  YRS.bus.gain.setTargetAtTime(L.v*1.4*SNDOPT.music,now,.9);YRS.lp.frequency.setTargetAtTime(L.lp,now,.5);
  if(!(play&&SNDOPT.music&&L.v>0)){YRS.lastOn=false;return}
  const song=(G.flags&&G.flags.yrShanty)?YRS_SONG_DONE:YRS_SONG;
  if(!YRS.lastOn||YRS.nextT<now-.5){YRS.lastOn=true;YRS.nextT=now+.15;if(YRS.step>=YRS_LEN)YRS.step=0}   // starting again, or the page was asleep for a while
  while(YRS.nextT<now+.7){
    const ev=song[YRS.step];if(ev)yrsPlay(YRS.nextT,ev);
    YRS.nextT+=YRS_STEP;YRS.step=(YRS.step+1)%YRS_LEN;
  }
}
