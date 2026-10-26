/* ==========================================================================
   THE SOUND OF WENLOCK (prefix wls / WLS). Made in the browser, no recordings. A light wind (WIND_AMT), birdsong that comes and goes (blackbird phrases,
   sparrow chirps, a distant cuckoo in the morning), a church bell that tolls the hour from far off, and a blacksmith's hammer on the anvil that
   is loud near the forge and fades down the street.
   ========================================================================== */
WIND_AMT[496]=.28;
const WLS={nextBird:0,nextHammer:0,hour:-1,bellQ:[],nextCuckoo:0};
function wlsBird(vol){
  if(!AC||G.mute)return;
  const r=Math.random(),base=2100+Math.random()*1500;
  if(r<.45){const n=3+((Math.random()*5)|0);for(let i=0;i<n;i++)tone(base*(1+Math.random()*.3),base*(.8+Math.random()*.5),.07+Math.random()*.05,'sine',.05*vol,i*(.09+Math.random()*.04))}   // a sparrow, chirrup chirrup
  else if(r<.8){const m=[0,3,5,7,5,3,10,8];let t=0;for(let i=0;i<4+((Math.random()*4)|0);i++){const f=base*.55*Math.pow(2,m[(Math.random()*m.length)|0]/12);tone(f,f*(1.02+Math.random()*.1),.14+Math.random()*.14,'sine',.06*vol,t);t+=.13+Math.random()*.16}}   // a blackbird, slow and fluting
  else{tone(base*1.2,base*1.5,.06,'sine',.05*vol,0);tone(base*1.5,base*1.1,.1,'sine',.05*vol,.1);tone(base*1.1,base*1.4,.07,'sine',.05*vol,.24)}                                 // a robin
}
function wlsBell(strokes){for(let i=0;i<strokes;i++){const d=i*2.6;tone(196,190,2.4,'sine',.07,d);tone(392,388,1.8,'sine',.03,d);tone(588,584,1.2,'sine',.015,d)}}   // far off, soft, a low bell with a little shimmer
function wlsHammer(vol){nz(.05,.16*vol,'bandpass',2400,1800,0);tone(1850,1500,.14,'triangle',.07*vol,0);tone(1190,1100,.2,'sine',.05*vol,.01);nz(.04,.09*vol,'bandpass',3000,2200,.45);tone(2050,1650,.12,'triangle',.05*vol,.45)}
function wlsForgeDist(){
  const f=typeof WL_DOORS!=='undefined'&&WL_DOORS.find(d=>d.kind==='smith');if(!f)return 99;
  return Math.hypot(G.P.x-f.front.x,(G.P.y-f.front.y)*1.1);
}
function wlSoundTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||LEVEL!==WL.ID)return;
  const now=AC.currentTime,hr=(G.clock%1440)/60,day=hr>5&&hr<20;
  // birds: more in the morning and evening, none in the deep of night
  if(SNDOPT.amb&&day&&now>WLS.nextBird){WLS.nextBird=now+2.2+Math.random()*(hr>6&&hr<10?4:8);wlsBird(.5+Math.random()*.5)}
  // the hammer: rings from the forge by day, loud in the street in front of it
  if(SNDOPT.amb&&hr>7&&hr<18&&now>WLS.nextHammer){const d=wlsForgeDist();WLS.nextHammer=now+.9+Math.random()*.5;if(d<26)wlsHammer(Math.max(.1,1-d/26)*1.1)}
  // the church bell tolls the hour
  const h=Math.floor(G.clock/60)%24;
  if(WLS.hour<0)WLS.hour=h;
  else if(h!==WLS.hour){WLS.hour=h;if(SNDOPT.amb)wlsBell(Math.max(1,h%12||12))}
}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{wlSoundTick()}catch(e){console.error('wls',e)}}}
