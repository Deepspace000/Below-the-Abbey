/* ==========================================================================
   THE PALE SPIRE: AMBIENCE (package 6). Made with tone() and nz() like the vault and Sale. pspTick is hooked next to blsTick. Outdoors: a low wind through arches and a faint glass chime; halls: a slow pad of open fifths and a far
   music box playing a wrong waltz; kitchens: a cold crackle and a copper drip; chapel: a held organ note and a candle hush; rest rooms: quiet; dungeons: drips, chains, a far moan, rat patter; cistern: running water.
   ========================================================================== */
const PSS={n:{}};
const pssDue=(k,lo,hi,now)=>{const N=PSS.n;if(N[k]===undefined){N[k]=now+Math.random()*hi*.6;return false}if(now<=N[k])return false;N[k]=now+lo+Math.random()*(hi-lo);return true};
function pssWind(v){if(!AC||G.mute)return;nz(3.2,.04*v,'lowpass',200,520,0);nz(2.6,.018*v,'bandpass',700,1100,.4)}
function pssChime(v){if(!AC||G.mute)return;const f=1800+Math.random()*1400;for(const m of [1,1.5,2.01]){tone(f*m,f*m*.995,1.6,'sine',.014*v/m,0)}}
function pssBell(v){if(!AC||G.mute)return;const f=110;tone(f,f*.99,3.4,'sine',.06*v,0);tone(f*2.4,f*2.38,2.2,'sine',.02*v,0);tone(f*3.9,f*3.9,1.2,'sine',.008*v,0)}
function pssPad(v){if(!AC||G.mute)return;for(const f of [110,164.8,220,329.6])tone(f,f*1.001,5.5,'sine',.012*v,0)}
function pssWaltz(v){if(!AC||G.mute)return;const nt=[523,392,440,415,523,392,466,392],t0=[0,.34,.68,1.1,1.44,1.78,2.2,2.54];nt.forEach((f,i)=>{tone(f,f*.99,.28,'triangle',.011*v,t0[i]);tone(f*2,f*1.99,.18,'sine',.005*v,t0[i])})}
function pssCrackle(v){if(!AC||G.mute)return;for(let i=0;i<8;i++)nz(.03,.02*v,'highpass',3500,3000,i*.07+Math.random()*.05)}
function pssDrip(v){if(!AC||G.mute)return;const f=900+Math.random()*700;tone(f,f*.6,.12,'sine',.03*v,0);tone(f*.7,f*.5,.14,'sine',.012*v,.1)}
function pssCopper(v){if(!AC||G.mute)return;tone(1250,1180,.5,'sine',.02*v,0);tone(1880,1800,.3,'sine',.01*v,0)}
function pssOrgan(v){if(!AC||G.mute)return;for(const f of [65.4,98,130.8])tone(f,f,4.2,'sawtooth',.008*v,0);nz(4,.004*v,'lowpass',600,500,0)}
function pssHush(v){if(!AC||G.mute)return;nz(2.2,.012*v,'bandpass',1500,900,0)}
function pssChain(v){if(!AC||G.mute)return;for(let i=0;i<4;i++)tone(1900+Math.random()*900,1500,.06,'triangle',.02*v,i*(.1+Math.random()*.05))}
function pssMoan(v){if(!AC||G.mute)return;const f=170+Math.random()*60;tone(f,f*.8,1.6,'sine',.02*v,0);tone(f*1.5,f*1.2,1.4,'triangle',.008*v,.2)}
function pssRats(v){if(!AC||G.mute)return;for(let i=0;i<7;i++)nz(.04,.016*v,'bandpass',3000,2200,i*.09+Math.random()*.04)}
function pssWater(v){if(!AC||G.mute)return;nz(2.8,.03*v,'bandpass',1200,1800,0);nz(2.4,.015*v,'highpass',3000,4000,.2)}
function pspTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!pspIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime,id=LEVEL,L=LEVELS[LEVEL],P=G.P,I=n=>pssDue(n,0,0,now);
  if(typeof PSPK!=='undefined'&&PSPK.restIn)return;    // warm rooms are quiet
  const D=(k,lo,hi)=>pssDue(k+id,lo,hi,now);
  if(L&&L.outdoor){if(D('w',10,22))pssWind(.7+Math.random()*.4);if(D('c',20,40))pssChime(.6+Math.random()*.4);if(D('b',50,90))pssBell(.5);return}
  if(id===9721||id===9722||id===9723){if(D('w',12,26))pssWind(.4);if(D('c',24,50))pssChime(.3);return}
  if(id===9731||id===9732){if(D('w',14,30))pssWind(.3);return}
  if(id===9740){if(D('p',16,28))pssPad(1);if(D('m',40,75))pssWaltz(1);if(D('h',22,44))pssHush(.6);return}
  if(id===9750){if(D('k',6,14))pssCrackle(.8);if(D('d',9,18))pssCopper(.8);return}
  if(id===9760){if(P.x>=42&&P.y>=34){if(D('o',14,26))pssOrgan(1);if(D('h',10,20))pssHush(.8)}else if(D('h',12,26))pssHush(.7);return}
  if(id>=9780&&id<=9800){if(D('d',3,7))pssDrip(.6+Math.random()*.4);if(D('c',12,26))pssChain(.7);if(D('m',26,50))pssMoan(.6);if(D('r',14,30))pssRats(.8);if(id===9790&&D('wt',6,12))pssWater(.8);return}
  if(D('p',20,40))pssPad(.6)}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{pspTick()}catch(e){console.error('psp tick',e)}}}
