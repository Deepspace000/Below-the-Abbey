/* ==========================================================================
   THE SOUND OF THE WITCH'S WOOD (levels 520 to 523; prefix wws / WWS). Made in the browser, no recordings: a low cold wind in the dead branches, the odd caw of a crow, the creak of an old bough
   or a rope, a drip, and, far off and rarely, a thin cackle that is gone before you are sure. In the cottage the wind goes quiet and a fire pops; in the kitchen a pot bubbles. Same helpers as
   the sound of Wenlock (tone, nz).
   ========================================================================== */
if(typeof WIND_AMT!=='undefined'){WIND_AMT[520]=.34;WIND_AMT[521]=.04;WIND_AMT[522]=.03;WIND_AMT[523]=.04}
const WWS={nextCrow:0,nextCreak:0,nextCackle:0,nextDrip:0,nextBubble:0,nextPop:0};
function wwsCrow(vol){if(!AC||G.mute)return;const n=1+((Math.random()*3)|0),f=520+Math.random()*160;for(let i=0;i<n;i++){tone(f,f*.7,.2,'sawtooth',.03*vol,i*.34);nz(.2,.012*vol,'bandpass',1500,1000,i*.34+.02)}}   // a harsh, falling caw, once to three times
function wwsCreak(vol){if(!AC||G.mute)return;const f=110+Math.random()*60;tone(f,f*1.5,.5,'sawtooth',.022*vol,0);tone(f*1.5,f*1.1,.4,'sawtooth',.018*vol,.35);nz(.6,.01*vol,'bandpass',400,300,0)}   // wood complaining
function wwsCackle(vol){if(!AC||G.mute)return;let t=0;for(let i=0;i<7;i++){const f=480+Math.random()*120+(i%2?90:0);tone(f,f*.82,.1,'sawtooth',.018*vol*(1-i*.08),t);t+=.13+Math.random()*.03}nz(.9,.006*vol,'bandpass',2200,1400,0)}   // thin and far, a witch laughing at the end of a long corridor
function wwsDrip(vol){if(!AC||G.mute)return;const f=900+Math.random()*700;tone(f,f*.6,.12,'sine',.03*vol,0);tone(f*.7,f*.5,.14,'sine',.012*vol,.1)}
function wwsBubble(vol){if(!AC||G.mute)return;for(let i=0;i<3;i++)tone(200+Math.random()*160,420+Math.random()*200,.1,'sine',.03*vol,i*.11)}
function wwsPop(vol){if(!AC||G.mute)return;nz(.06,.04*vol,'bandpass',1800,1200,0);nz(.3,.012*vol,'lowpass',500,300,.05)}
function wwsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!wwIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime;
  if(LEVEL===WW.ID){
    if(now>WWS.nextCrow){WWS.nextCrow=now+9+Math.random()*16;wwsCrow(.5+Math.random()*.5)}
    if(now>WWS.nextCreak){WWS.nextCreak=now+14+Math.random()*24;wwsCreak(.5+Math.random()*.5)}
    if(now>WWS.nextCackle){WWS.nextCackle=now+55+Math.random()*80;const d=LEVELS[WW.ID]&&LEVELS[WW.ID]._ww?Math.abs(G.P.x-27)+Math.abs(G.P.y-4):40;wwsCackle(Math.max(.3,Math.min(1,1.4-d/60)))}
    if(now>WWS.nextDrip){WWS.nextDrip=now+5+Math.random()*9;wwsDrip(.5+Math.random()*.5)}
  }else{
    if(now>WWS.nextPop){WWS.nextPop=now+3+Math.random()*6;wwsPop(.5+Math.random()*.5)}
    if(LEVEL!==WW.CELLAR&&now>WWS.nextBubble){WWS.nextBubble=now+.8+Math.random()*.9;const near=G.decor.some(d=>d.k==='ww_cauldron'&&Math.abs(d.x-G.P.x)+Math.abs(d.y-G.P.y)<7);if(near)wwsBubble(.7)}
    if(now>WWS.nextCreak){WWS.nextCreak=now+11+Math.random()*16;wwsCreak(.45)}
    if(LEVEL===WW.CELLAR&&now>WWS.nextDrip){WWS.nextDrip=now+3+Math.random()*5;wwsDrip(.8)}
  }
}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{wwsTick()}catch(e){console.error('wws',e)}}}
