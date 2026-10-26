/* ==========================================================================
   THE SOUND OF THE MAZE OF GARDENS (level 490; prefix gms / GMS). Made in the browser, no recordings: a light wind, birdsong all day (blackbird, robin, sparrow, a thrush, the
   far cry of a peacock now and then), bees near the hives and a gentle trickle of water near every fountain. Same helpers as the sound of Wenlock (tone, nz).
   ========================================================================== */
if(typeof WIND_AMT!=='undefined')WIND_AMT[490]=.12;
const GMS={nextBird:0,nextPeacock:0,nextWater:0,nextBee:0};
function gmsBird(vol){
  if(!AC||G.mute)return;
  if(typeof wlsBird==='function'&&Math.random()<.6)return wlsBird(vol);
  const base=1800+Math.random()*1800,r=Math.random();
  if(r<.5){for(let i=0;i<5+((Math.random()*5)|0);i++){const f=base*(1+((i%3)-1)*.18);tone(f,f*(1.08+Math.random()*.1),.05+Math.random()*.04,'sine',.045*vol,i*.07)}}   // a thrush, short bright phrases
  else{for(let i=0;i<10;i++)tone(base*(1+i*.04),base*(1.1+i*.04),.05,'sine',.03*vol,i*.045)}   // a trill rising
}
function gmsPeacock(vol){tone(560,640,.22,'sawtooth',.03*vol,0);tone(640,520,.3,'sawtooth',.03*vol,.2);nz(.3,.015*vol,'bandpass',1200,900,.1)}   // far off, a harsh two note call
function gmsWater(vol){for(let i=0;i<5;i++)nz(.08,.03*vol,'bandpass',1800+Math.random()*2400,1600,i*.07+Math.random()*.04)}
function gmsNear(keys,r){let best=99;for(const d of G.decor){if(!keys.test(d.k))continue;const q=Math.hypot(d.x-G.P.x,(d.y-G.P.y));if(q<best)best=q}return best<r?1-best/r:0}
function gmsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||LEVEL!==GM.ID||!SNDOPT.amb)return;
  const now=AC.currentTime,hr=(G.clock%1440)/60,day=hr>5&&hr<21;
  if(day&&now>GMS.nextBird){GMS.nextBird=now+1.6+Math.random()*(hr>6&&hr<10?3:6);gmsBird(.5+Math.random()*.5)}
  if(day&&now>GMS.nextPeacock){GMS.nextPeacock=now+22+Math.random()*30;gmsPeacock(.5+Math.random()*.4)}
  if(now>GMS.nextWater){GMS.nextWater=now+.55+Math.random()*.2;const v=gmsNear(/^gm_(fountain|birdbath|pondrim)$/,12);if(v>0)gmsWater(v*1.2)}
  if(day&&now>GMS.nextBee){GMS.nextBee=now+1.2+Math.random()*.8;const v=gmsNear(/^gm_(skep|bee|lavender)$/,8);if(v>0)tone(190+Math.random()*30,200,.9,'sawtooth',.012*v,0)}
}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{gmsTick()}catch(e){console.error('gms',e)}}}
