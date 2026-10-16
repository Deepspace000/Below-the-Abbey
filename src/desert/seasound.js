/* ==========================================================================
   THE SOUND OF THE SEA. Made in the browser, no recordings: surf that swells and hisses back, gulls crying near and far, and the
   creak of rigging and the knock of halyards against masts when the party is near the water and the boats. Quieter inland.
   ========================================================================== */
const SEAS={src:null,t:0,last:0,nextGull:0,nextCreak:0,nextClink:0,nextLap:0,p:Math.random()*6.3,prox:.3,proxT:0};
function seaProx(){ // 1 at the water's edge, falling to .15 deep inland
  const T=TERRS[LEVEL];if(!T)return .5;const x=G.P.x+.5,y=G.P.y+.5;
  for(let k=0;k<6;k++){const r=[2,5,9,14,22,32][k];for(let a=0;a<8;a++){const xx=Math.round(x+Math.cos(a*.785)*r),yy=Math.round(y+Math.sin(a*.785)*r);if(xx<1||yy<1||xx>=T.W-1||yy>=T.H-1)continue;if(T.h[yy*T.W+xx]<-.1)return Math.max(.15,1-k*.16)}}
  return .15;
}
function seaRigging(){ // how close the party is to the boats and the pier
  if(LEVEL===290)return clamp((G.P.x-46)/12,0,1);
  const L=LEVELS[LEVEL];if(!L||!L.start||!SEA[LEVEL])return 0;
  return clamp(1-Math.hypot(G.P.x-L.start.x,G.P.y-L.start.y)/16,0,1);
}
function gullCry(a){
  const t=AC.currentTime,pan=Math.random()*2-1,vol=(.035+.09*a)*4*(.5+Math.random()*.5)*SFXM,n=2+((Math.random()*3)|0);let base=1500+Math.random()*650;
  const out=AC.createGain();out.gain.value=vol;
  if(AC.createStereoPanner){const pn=AC.createStereoPanner();pn.pan.value=pan;out.connect(pn);pn.connect(MASTER)}else out.connect(MASTER);
  let at=t;
  for(let i=0;i<n;i++){
    const d=.27+Math.random()*.34,f0=base*(1+.12*Math.random()),f1=f0*(.58+.1*Math.random());
    const o=AC.createOscillator(),bp=AC.createBiquadFilter(),hp=AC.createBiquadFilter(),g=AC.createGain(),vib=AC.createOscillator(),vg=AC.createGain();
    o.type='sawtooth';o.frequency.setValueAtTime(f0*.85,at);o.frequency.linearRampToValueAtTime(f0*1.1,at+d*.2);o.frequency.exponentialRampToValueAtTime(f1,at+d); // a quick rise and a long fall: "keow"
    vib.frequency.value=34+Math.random()*8;vg.gain.value=f0*.05;vib.connect(vg);vg.connect(o.frequency);
    bp.type='bandpass';bp.frequency.value=f0*1.35;bp.Q.value=1.5;hp.type='highpass';hp.frequency.value=700;
    g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(1,at+.025);g.gain.exponentialRampToValueAtTime(.001,at+d);
    o.connect(hp);hp.connect(bp);bp.connect(g);g.connect(out);o.start(at);vib.start(at);o.stop(at+d+.05);vib.stop(at+d+.05);
    at+=d*.9+.05+Math.random()*.08;base*=.96;
  }
}
function rigCreak(v){ // wood and rope working against each other: a slow groan with a stick-and-slip flutter
  const t=AC.currentTime,d=.5+Math.random()*.9,o=AC.createOscillator(),lfo=AC.createOscillator(),lg=AC.createGain(),am=AC.createGain(),bp=AC.createBiquadFilter(),g=AC.createGain();
  const f=100+Math.random()*90;o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*(1.15+Math.random()*.5),t+d);
  lfo.type='square';lfo.frequency.value=13+Math.random()*10;lg.gain.value=.5;am.gain.value=.5;lfo.connect(lg);lg.connect(am.gain);
  bp.type='bandpass';bp.frequency.setValueAtTime(480+Math.random()*300,t);bp.frequency.linearRampToValueAtTime(850+Math.random()*450,t+d);bp.Q.value=7;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*.7*SFXM,t+.09);g.gain.linearRampToValueAtTime(v*.42*SFXM,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(am);am.connect(bp);bp.connect(g);g.connect(MASTER);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05);
}
function rigClink(v){ // a halyard slapping the mast: two quick taps, wood and a little metal
  const j=Math.random();
  nz(.05,.25*v,'bandpass',900+j*300,500,0);tone(1800+j*700,1300,.08,'triangle',.14*v,0);
  if(Math.random()<.6){nz(.045,.18*v,'bandpass',800,450,.13+Math.random()*.1);tone(1500+j*500,1100,.07,'triangle',.1*v,.13)}
}
function seaSoundTick(){
  if(!AC||!NB)return;
  const now=AC.currentTime,dt=Math.min(.5,Math.max(0,now-SEAS.last));SEAS.last=now;
  const uw=typeof uwLv==='function'&&uwLv(LEVEL),on=G.state==='play'&&!G.mute&&SNDOPT.amb&&yarSea(LEVEL)&&!uw;
  if(typeof uwSoundTick==='function')uwSoundTick(now,dt,uw&&G.state==='play'&&!G.mute&&SNDOPT.amb);
  if(!SEAS.src){
    const mk=(type,f,q)=>{const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;s.loopStart=Math.random()*.5;fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(MASTER);s.start();return {s,f:fl,g}};
    SEAS.src=mk('lowpass',400,.7);SEAS.hush=mk('bandpass',2600,.5);SEAS.deep=mk('lowpass',160,.6);
  }
  SEAS.t+=dt;
  if(now>SEAS.proxT){SEAS.prox=on?seaProx():0;SEAS.proxT=now+.6}
  const a=on?SEAS.prox:0;
  const ph=SEAS.t*.62+SEAS.p+.8*Math.sin(SEAS.t*.19);
  const w=Math.max(0,Math.sin(ph)),wave=w*w,hs=Math.max(0,Math.sin(ph-.9)); // a wave builds, breaks, and hisses back up the sand
  SEAS.src.g.gain.setTargetAtTime(a*(.08+.5*wave),now,.35);SEAS.src.f.frequency.setTargetAtTime(240+760*wave,now,.3);
  SEAS.hush.g.gain.setTargetAtTime(a*(.015+.15*hs*hs),now,.4);SEAS.hush.f.frequency.setTargetAtTime(2200+1400*hs,now,.4);
  SEAS.deep.g.gain.setTargetAtTime(a*.22,now,1.2); // the long low roar of the open water
  if(!on)return;
  if(now>SEAS.nextGull){SEAS.nextGull=now+(2.5+Math.random()*7)/(.5+a);gullCry(Math.max(.25,a))}
  const rg=seaRigging();
  if(rg>.05){
    if(now>SEAS.nextCreak){SEAS.nextCreak=now+3+Math.random()*7;rigCreak(rg)}
    if(now>SEAS.nextClink){SEAS.nextClink=now+1.2+Math.random()*3.5;rigClink(rg)}
    if(now>SEAS.nextLap){SEAS.nextLap=now+2+Math.random()*3;nz(.5,.22*rg,'bandpass',1300,600,0)} // water slapping the hulls
  }
}

/* ---- under the water: a low hush, bubbles, and now and then a far-off whale ---- */
const UWSND={src:null,next:0,whale:0,vb:0};
function uwBubbles(n,vol,spread){
  for(let i=0;i<n;i++){const d=Math.random()*(spread||.3),f=260+Math.random()*520;tone(f,f*(1.7+Math.random()*.8),.07+Math.random()*.08,'sine',vol*(.5+Math.random()*.5),d)}
}
function uwWhale(){
  const t=AC.currentTime,vol=.045*SFXM,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter(),pn=AC.createStereoPanner?AC.createStereoPanner():null,d=4+Math.random()*3,b=70+Math.random()*40;
  o.type='sine';o2.type='sine';o.frequency.setValueAtTime(b,t);o.frequency.linearRampToValueAtTime(b*2.3,t+d*.4);o.frequency.linearRampToValueAtTime(b*1.5,t+d*.75);o.frequency.linearRampToValueAtTime(b*1.9,t+d);
  o2.frequency.setValueAtTime(b*2.01,t);o2.frequency.linearRampToValueAtTime(b*4.6,t+d*.4);o2.frequency.linearRampToValueAtTime(b*3,t+d*.75);o2.frequency.linearRampToValueAtTime(b*3.8,t+d);
  f.type='lowpass';f.frequency.value=600;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+d*.25);g.gain.linearRampToValueAtTime(vol*.7,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
  const mix=AC.createGain();mix.gain.value=.35;o2.connect(mix);mix.connect(f);o.connect(f);f.connect(g);if(pn){pn.pan.value=Math.random()*2-1;g.connect(pn);pn.connect(MASTER)}else g.connect(MASTER);
  o.start(t);o2.start(t);o.stop(t+d+.1);o2.stop(t+d+.1);
}
function uwSoundTick(now,dt,on){
  if(!UWSND.src){
    const mk=(type,f,q)=>{const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;s.loopStart=Math.random()*.5;fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(MASTER);s.start();return {s,f:fl,g}};
    UWSND.src=mk('lowpass',150,.7);UWSND.hiss=mk('bandpass',900,.6);
  }
  const a=on?1:0,sw=.5+.5*Math.sin(now*.31)*Math.sin(now*.11+1);
  UWSND.src.g.gain.setTargetAtTime(a*(.28+.1*sw),now,.6);UWSND.hiss.g.gain.setTargetAtTime(a*(.03+.035*sw),now,.8);UWSND.hiss.f.frequency.setTargetAtTime(600+500*sw,now,.8);
  if(!a)return;
  if(now>UWSND.next){UWSND.next=now+1.5+Math.random()*4;uwBubbles(2+((Math.random()*5)|0),.06,.5)}
  if(G.uw&&G.uw.vent&&now>UWSND.vb){UWSND.vb=now+.22;uwBubbles(5,.1,.25)} // standing in a vent: a rush of bubbles
  if(now>UWSND.whale){UWSND.whale=now+30+Math.random()*40;if(Math.random()<.8)uwWhale()}
}
