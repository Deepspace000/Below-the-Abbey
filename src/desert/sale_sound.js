/* ==========================================================================
   THE SOUND OF SALE (prefix sas / SAS). Made in the browser and from the game's own samples: a cold wind (WIND_AMT), the bell of the Belfry tolling by itself (church_bell1 and 2, low and slow), the hour,
   crows cawing from the posts, a low ghostly note now and then, the creak of a gibbet chain in the square. Cellars, the crypt and the belfry: slow drips and a hollow hum.
   ========================================================================== */
WIND_AMT[600]=.36;
const SAS={nextCrow:0,nextBell:0,nextNote:0,nextCreak:0,nextDrip:0,hour:-1};
function sasCaw(vol){
  if(!AC||G.mute)return;const f=360+Math.random()*140,n=2+((Math.random()*3)|0);
  for(let i=0;i<n;i++){const d=i*(.23+Math.random()*.05);tone(f*(1+(Math.random()-.5)*.1),f*.78,.17,'sawtooth',.045*vol,d);nz(.07,.05*vol,'bandpass',1300,900,d)}}
function sasBell(vol){playSmp('church_bell1',.5*vol,.7);setTimeout(()=>playSmp('church_bell2',.4*vol,.68),3000)}
function sasNote(vol){if(!AC||G.mute)return;const b=130+Math.random()*60;tone(b,b*.8,2.6,'sine',.05*vol,0);tone(b*1.5,b*1.2,2.4,'sine',.025*vol,.15);tone(b*2.01,b*1.6,1.8,'sine',.012*vol,.3)}
function sasCreak(vol){if(!AC||G.mute)return;const f=190+Math.random()*60;tone(f,f*1.25,.35,'sawtooth',.03*vol,0);tone(f*1.4,f*1.1,.3,'sawtooth',.02*vol,.45);nz(.1,.03*vol,'bandpass',900,600,.05)}
function sasDrip(vol){if(!AC||G.mute)return;const f=900+Math.random()*500;tone(f,f*.5,.12,'sine',.05*vol,0);tone(f*.7,f*.35,.2,'sine',.015*vol,.09)}
function saSoundTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!saIs(LEVEL))return;
  const now=AC.currentTime;
  if(LEVEL===SA.ID){
    if(SNDOPT.amb&&now>SAS.nextCrow){SAS.nextCrow=now+7+Math.random()*14;sasCaw(.5+Math.random()*.5)}
    if(SNDOPT.amb&&now>SAS.nextBell){SAS.nextBell=now+38+Math.random()*50;sasBell(.8)}
    if(SNDOPT.amb&&now>SAS.nextNote){SAS.nextNote=now+14+Math.random()*22;sasNote(.6+Math.random()*.4)}
    if(SNDOPT.amb&&now>SAS.nextCreak){const d=Math.hypot(G.P.x-38,G.P.y-33);SAS.nextCreak=now+4+Math.random()*7;if(d<20)sasCreak(Math.max(.1,1-d/20))}
    const h=Math.floor(G.clock/60)%24;if(SAS.hour<0)SAS.hour=h;else if(h!==SAS.hour){SAS.hour=h;if(SNDOPT.amb){const k=Math.max(1,h%12||12);for(let i=0;i<k;i++)setTimeout(()=>playSmp('church_bell1',.45,.72),i*2600)}}
  }else{
    if(SNDOPT.amb&&now>SAS.nextDrip){SAS.nextDrip=now+1.6+Math.random()*4;sasDrip(.5+Math.random()*.5)}
    if(SNDOPT.amb&&now>SAS.nextNote&&LEVEL<7000){SAS.nextNote=now+16+Math.random()*20;sasNote(.35)}
  }
}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{saSoundTick()}catch(e){console.error('sas',e)}}}
