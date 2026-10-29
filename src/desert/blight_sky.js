/* ==========================================================================
   STORM SKIES OVER THE BLIGHTED LANDS (the ten places of the Blighted Road 9610 to 9709, the Vault of Maldrake surface 9670, Sale outdoors 600).
   Notes: tools/polish/blight_sky_NOTES.md.  The Wenlock graveyard storm (gy_storm.js, level 530) is not touched; this file reuses only its
   helpers gysNoise, gysP, gysSm, gysFork, gysPulse, gysRumble.
   Sky: a 1024 by 256 panorama of three parallax cloud banks. The cloud noise is made once (three density fields); each place colours it with its own
   look (seeded by the level number): 0 heavy grey overcast, 1 dark rolling thunderheads, 2 bruised grey-purple; about a third also get a red tinge
   (dusk glow low on the horizon, red-brown underlight, red lightning). One slice of the next panorama is composed per frame (about 1 ms), swapped whole.
   The engine reads BKSKY_PAN when BKSKY_LV===LEVEL (one test in index.html, the line with ovcLv).
   Weather: on every arrival the dice are rolled again; wet and dry spells of 50 to 150 s follow each other (about half of the time it rains), each wet spell
   with its own strength (drizzle to downpour), faded in and out over 15 s. Lightning and thunder in all weathers, more in a downpour.
   Rain: three depth layers of streaks (far, middle, near: different length, speed, alpha), wind and gusts, ripples and splashes on the ground, wet sheen,
   horizon mist, lamps tint the near streaks. Sound: the rain loop plus a high hiss, thunder from gy_storm's rumble. No allocation per frame.
   ========================================================================== */
const BKS={off:false,lv:0,ready:false,pan:null,back:null,pan32:null,back32:null,col:0,cpf:64,ms:0,V0:28,V1:158,
  dens:null,L:null,br:null,cyc:null,look:0,red:0,vis:0,
  t:0,wet:0,wetT:0,segEnd:0,segStr:0,segWet:false,fade:15,rain:0,   // weather clock
  next:0,strike:null,thunderQ:[],strikes:0,thunders:0,f:0,hold:null,force:null,   // test hooks: force=[wet 0/1, strength], hold=flash ms
  rainSrc:null,rainG:null,hissSrc:null,hissG:null,hissF:null,lampK:0,lampN:0,fr:0,wind:0,
  reduced:(()=>{try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){return false}})()};
const bksIs=n=>(n>=9610&&n<=9709)||n===600;
/* a room of the road above ground (not the Vault's floors, not a cellar or a crypt): the rain is heard through the roof */
function bksIndoor(){
  if(BKS.off||typeof LEVEL==='undefined'||G.state!=='play'||!BKS.arrived||!(LEVEL>=9610&&LEVEL<=9709)||(LEVEL>=9671&&LEVEL<=9678))return false;
  const L=LEVELS[LEVEL];if(!L||L.outdoor)return false;
  if(L._bksIn===undefined){let nm='';try{nm=String((typeof blNameOf==='function'&&blNameOf(LEVEL))||L.name||(typeof LEVEL_NAMES!=='undefined'&&LEVEL_NAMES[LEVEL])||'')}catch(e){}L._bksIn=!/cellar|crypt|vault|tomb|pit|undercroft|catacomb|ossuary/i.test(nm)}
  return L._bksIn}
const bksOn=()=>!BKS.off&&typeof LEVEL!=='undefined'&&G.state==='play'&&bksIs(LEVEL)&&!!LEVELS[LEVEL]&&!!LEVELS[LEVEL].outdoor;
/* ---- the look of a place, from its number (a vault, and the road's red places, are fixed so the red skies are surely there) ---- */
function bksSeed(n){let s=(n*2654435761)>>>0;s^=s>>>15;s=Math.imul(s,2246822519)>>>0;s^=s>>>13;return s>>>0}
const BKS_RED={9610:0,9620:0,9630:1,9640:0,9650:1,9660:0,9670:1,9680:0,9690:1,9700:0,600:0};   // 1 = red tinge (about a third of the places)
function bksLookOf(n){const s=bksSeed(n);
  const red=BKS_RED[n]!==undefined?BKS_RED[n]:((s>>>9)%3===0?1:0);
  return {look:s%3,red:red?.78+((s>>>12)%5)*.05:0,th:((s>>>16)%9-4)*.012,drift:.8+((s>>>20)%7)*.08,shift:(s>>>4)%1024,rate:(s>>>24)%3}}
/* the three looks (colours as wanted on screen, gysP divides out the engine's tint). red mixes toward the red variant */
const BKS_LOOKS=[
  {nm:'overcast',th:[.30,.28,.26],core:[[92,94,98],[76,79,84],[56,59,65]],rim:[[142,146,150],[128,132,138],[104,110,118]],base:[[54,58,66],[74,78,84],[102,106,106],[130,134,128]],hor:[150,154,146]},
  {nm:'thunderheads',th:[.46,.40,.34],core:[[56,56,70],[38,40,54],[18,20,30]],rim:[[116,118,140],[98,104,126],[84,92,112]],base:[[26,28,42],[42,46,60],[70,78,84],[104,112,106]],hor:[124,132,122]},
  {nm:'bruised',th:[.38,.34,.30],core:[[88,70,98],[66,58,84],[38,34,56]],rim:[[150,128,160],[124,114,148],[98,92,124]],base:[[46,38,62],[66,56,84],[98,86,110],[126,112,128]],hor:[140,128,138]}];
const BKS_RED_CORE=[[120,62,58],[92,46,50],[52,26,34]],BKS_RED_RIM=[[250,140,80],[226,116,70],[176,84,56]],BKS_RED_BASE=[[70,30,44],[128,50,46],[206,84,52],[244,118,60]];
const bksMixC=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const BKS_SPEC=[{seed:5101,cx:24,cy:7,oct:4,sc:.40,env:v=>.35+.65*gysSm(50,130,v)},{seed:6203,cx:18,cy:6,oct:5,sc:.42,env:v=>.6+.4*gysSm(40,100,v)-.2*gysSm(140,172,v)},{seed:7307,cx:14,cy:5,oct:5,sc:.46,env:v=>1-.45*gysSm(110,170,v)}];
/* the density fields: made once (a few hundred ms on the first visit), 1024 by 256, values 0..1 before the threshold */
function bksDensities(){
  if(BKS.dens)return;
  BKS.dens=BKS_SPEC.map(sp=>{const n=gysNoise(sp.seed,sp.cx,sp.cy,sp.oct,.56),W=1024,H=256,d=new Float32Array(W*H);
    for(let y=0;y<H;y++){const E=sp.env(y);for(let x=0;x<W;x++){const h=x>>1,a=n[y*512+h],b=n[y*512+((h+1)&511)],v=(x&1)?(a+b)*.5:a;d[y*W+x]=v}}
    return d})}
/* colour the three banks for a look: packed 0xAABBGGRR, the lit edge blended in */
function bksBake(q,lk){
  const sp=BKS_SPEC[q],v=BKS.dens[q],W=1024,H=256,out=BKS.L[q]||(BKS.L[q]=new Uint32Array(W*H)),E=new Float32Array(H),L=BKS_LOOKS[lk.look],th=L.th[q]+lk.th;
  const dd=new Float32Array(W*H);
  for(let y=0;y<H;y++)E[y]=sp.env(y);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)dd[y*W+x]=Math.min(1,Math.max(0,(v[y*W+x]-th)/sp.sc*E[y]));
  const cc=gysP.apply(null,bksMixC(L.core[q],BKS_RED_CORE[q],lk.red)),rc=gysP.apply(null,bksMixC(L.rim[q],BKS_RED_RIM[q],lk.red)),alp=[.88,.94,.98][q];
  out.fill(0);
  for(let y=4;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,d=dd[i];if(d<.012)continue;
    const a=Math.min(1,d*1.7)*alp,sh=1.26-.58*d,rim=Math.min(1,Math.max(0,(d-dd[i-4*W])*2.6))*.7;
    const cr=cc[0]*sh,cg=cc[1]*sh,cb=cc[2]*sh,r=Math.min(255,cr+(rc[0]-cr)*rim),g=Math.min(255,cg+(rc[1]-cg)*rim),b=Math.min(255,cb+(rc[2]-cb)*rim);
    out[i]=((a*255)<<24|((b|0)<<16)|((g|0)<<8)|(r|0))>>>0}}
const BKS_BV=[20,60,100,150];
function bksBuild(lv){   // (re)make the sky for this place: one bake pass per bank, the buffers are reused
  const lk=bksLookOf(lv),L=BKS_LOOKS[lk.look];BKS.look=lk.look;BKS.red=lk.red;BKS.lk=lk;
  bksDensities();if(!BKS.L)BKS.L=[null,null,null];
  for(let q=0;q<3;q++)bksBake(q,lk);
  const br=BKS.br||(BKS.br={r:new Float32Array(256),g:new Float32Array(256),b:new Float32Array(256)});
  const base=L.base.map((c,i)=>gysP.apply(null,bksMixC(c,BKS_RED_BASE[i],lk.red)));
  for(let v=0;v<256;v++){let j=0;while(j<BKS_BV.length-2&&v>BKS_BV[j+1])j++;const f=Math.min(1,Math.max(0,(v-BKS_BV[j])/(BKS_BV[j+1]-BKS_BV[j])));
    br.r[v]=base[j][0]+(base[j+1][0]-base[j][0])*f;br.g[v]=base[j][1]+(base[j+1][1]-base[j][1])*f;br.b[v]=base[j][2]+(base[j+1][2]-base[j][2])*f}
  const N=1024*256;
  if(!BKS.pan){BKS.pan=new Uint8ClampedArray(N*4);BKS.back=new Uint8ClampedArray(N*4);BKS.pan32=new Uint32Array(BKS.pan.buffer);BKS.back32=new Uint32Array(BKS.back.buffer)}
  for(let v=0;v<256;v++){const c=0xFF000000|((br.b[v]|0)<<16)|((br.g[v]|0)<<8)|(br.r[v]|0);BKS.pan32.fill(c>>>0,v*1024,v*1024+1024)}
  BKS.shift=lk.shift;bksCycle(0);bksCompose(BKS.pan32,0,1024);BKS.back32.set(BKS.pan32);BKS.col=0;BKS.ready=true;BKS.lv=lv;
  // ground tints for this place (made once per arrival: three gradients)
  bksGround(lk,L)}
function bksCycle(t){
  const lk=BKS.lk||{drift:1},C=BKS.cyc||(BKS.cyc={ox:[0,0,0],w:[new Int32Array(1024),new Int32Array(1024),new Int32Array(1024)],sh:[new Int32Array(256),new Int32Array(256),new Int32Array(256)]});
  const spd=[7*lk.drift,5*lk.drift,1.8*lk.drift],amp=[3,5,8],sha=[4,7,11],TAU=6.2832;
  for(let q=0;q<3;q++){C.ox[q]=Math.floor(t*spd[q])+(BKS.shift||0)*(q+1);const w=C.w[q],s=C.sh[q];
    for(let x=0;x<1024;x++)w[x]=Math.round(amp[q]*Math.sin(t*(.05+.02*q)+x*TAU*(3+q)/1024+q));
    for(let v=0;v<256;v++)s[v]=Math.round(sha[q]*Math.sin(t*.04*(q+1)+v*.055*(q+1)+q*2))}}
function bksCompose(O,c0,c1){
  const C=BKS.cyc,L0=BKS.L[0],L1=BKS.L[1],L2=BKS.L[2],BR=BKS.br.r,BG=BKS.br.g,BB=BKS.br.b,V0=BKS.V0,V1=BKS.V1,K=1/255,
    o0=C.ox[0],o1=C.ox[1],o2=C.ox[2],S0=C.sh[0],S1=C.sh[1],S2=C.sh[2],W0=C.w[0],W1=C.w[1],W2=C.w[2];
  for(let x=c0;x<c1;x++){const w0=W0[x],w1=W1[x],w2=W2[x];
    for(let v=V0;v<=V1;v++){
      let r=BR[v],g=BG[v],b=BB[v],p,a,k;
      p=L0[(v-w0)*1024+((x-o0+S0[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      p=L1[(v-w1)*1024+((x-o1+S1[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      p=L2[(v-w2)*1024+((x-o2+S2[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      O[v*1024+x]=(0xFF000000|((b|0)<<16)|((g|0)<<8)|(r|0))>>>0}}}
function bksPanoStep(){
  const t0=performance.now();
  if(BKS.col===0)bksCycle(G.time);
  const c1=Math.min(1024,BKS.col+BKS.cpf);bksCompose(BKS.back32,BKS.col,c1);BKS.col=c1;
  if(c1>=1024){BKS.col=0;let o=BKS.pan;BKS.pan=BKS.back;BKS.back=o;o=BKS.pan32;BKS.pan32=BKS.back32;BKS.back32=o;self.BKSKY_PAN=BKS.pan}
  const dt=performance.now()-t0;BKS.ms=BKS.ms*.9+dt*.1;
  if(dt>1.8&&BKS.cpf>32)BKS.cpf-=16;else if(dt<.8&&BKS.cpf<256)BKS.cpf+=16}
/* ---- the weather clock: wet and dry spells, about half and half ---- */
function bksArrive(lv){   // the dice for this visit (the weather of the last 25 seconds is kept: a trip through a door does not change it)
  if(BKS.arrived&&G.time-(BKS.lastT||-99)>=0&&G.time-(BKS.lastT||-99)<25){BKS.strike=null;BKS.thunderQ.length=0;BKS.next=6+Math.random()*10;return}
  BKS.arrived=1;BKS.t=0;BKS.segWet=Math.random()<.5;BKS.segStr=BKS.segWet?bksStrength():0;BKS.segEnd=BKS.segWet?40+Math.random()*90:30+Math.random()*80;BKS.wet=BKS.segWet?BKS.segStr:0;BKS.wetT=BKS.wet;
  BKS.strike=null;BKS.thunderQ.length=0;BKS.next=6+Math.random()*10}
function bksStrength(){return Math.random()<.4?.2+Math.random()*.25:.55+Math.random()*.45}   // drizzle, or rain, or a downpour
function bksWeather(dt){
  BKS.t+=dt;BKS.lastT=G.time;
  if(BKS.t>=BKS.segEnd){BKS.t=0;BKS.segWet=!BKS.segWet;BKS.segStr=BKS.segWet?bksStrength():0;BKS.segEnd=BKS.segWet?50+Math.random()*100:50+Math.random()*100}
  const k=Math.min(1,dt/BKS.fade*3);BKS.wetT=BKS.segStr;BKS.wet+=(BKS.wetT-BKS.wet)*k;
  let r=BKS.force?BKS.force[0]*BKS.force[1]:BKS.wet;if(r<.02)r=0;BKS.rain=r}
/* ---- lightning (same shapes as the graveyard's; red places flash red-white) ---- */
function bksStrike(opt){
  const t=G.time,o=opt||{},far=o.far!==undefined?o.far:Math.random(),C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0);
  const az=o.az!==undefined?o.az:(Math.random()<.7?LA+(Math.random()-.5)*2.1:Math.random()*Math.PI*2);
  const fork=o.fork!==undefined?o.fork:Math.random()<.5,seed=(Math.random()*1e6)|0;
  BKS.strike={t0:t,az,far,fork,seed,amp:(1-.35*far)*(BKS.reduced?.7:1),pts:null};BKS.strikes++;
  BKS.thunderQ.push({at:t+(o.delay!==undefined?o.delay:1+far*2.2),vol:.2*(1-.55*far)});
  const lk=BKS.lk||{rate:1},lookK=BKS.look===1?.6:BKS.look===0?1.3:1,wetK=1.25-.75*BKS.rain;   // thunderheads strike more often, rain brings more
  BKS.next=t+(7+Math.random()*16)*lookK*wetK}
function bksFlash(){const s=BKS.strike;if(!s)return 0;const ms=BKS.hold!==null?BKS.hold:(G.time-s.t0)*1000;if(BKS.hold===null&&ms>300)BKS.strike=null;return gysPulse(ms)*s.amp}
/* ---- sound ---- */
function bksSound(dt){
  const rain=BKS.rain,want=(bksOn()||BKS.in)&&!G.mute&&SNDOPT.amb&&AC&&MASTER&&typeof SMP!=='undefined'&&SMP.rain_loop&&rain>0?1:0;
  if(!BKS.rainSrc){if(!want)return;
    const s=AC.createBufferSource(),g=AC.createGain(),lp=AC.createBiquadFilter();s.buffer=SMP.rain_loop;s.loop=true;g.gain.value=0;lp.type='lowpass';lp.frequency.value=BKS.in?520:16000;s.connect(lp);lp.connect(g);g.connect(MASTER);s.start();BKS.rainSrc=s;BKS.rainG=g;BKS.rainF=lp;
    if(NB){const h=AC.createBufferSource(),f=AC.createBiquadFilter(),hg=AC.createGain();h.buffer=NB;h.loop=true;f.type='highpass';f.frequency.value=3200;hg.gain.value=0;h.connect(f);f.connect(hg);hg.connect(MASTER);h.start(0,Math.random()*.8);BKS.hissSrc=h;BKS.hissG=hg}}
  const a=(want?1:0)*SNDOPT.amb,m=typeof MUSICV==='number'?1:1,wl=want?rain:0,
    tg=wl*.07*a*(BKS.in?.7:1),th=BKS.in?0:wl*wl*.05*a,k=Math.min(1,dt/1.4);
  try{if(BKS.rainF)BKS.rainF.frequency.value+=((BKS.in?520:16000)-BKS.rainF.frequency.value)*Math.min(1,dt/.5)}catch(e){}
  const g=BKS.rainG.gain;g.value+= (tg-g.value)*k;try{BKS.rainSrc.playbackRate.value=.82+.2*rain}catch(e){}
  if(BKS.hissG)BKS.hissG.gain.value+=(th-BKS.hissG.gain.value)*k;
  if(!want&&g.value<.002){try{BKS.rainSrc.stop();BKS.rainSrc.disconnect();BKS.rainG.disconnect();if(BKS.rainF)BKS.rainF.disconnect()}catch(e){}
    try{if(BKS.hissSrc){BKS.hissSrc.stop();BKS.hissSrc.disconnect();BKS.hissG.disconnect()}}catch(e){}
    BKS.rainSrc=BKS.rainG=BKS.rainF=BKS.hissSrc=BKS.hissG=null}}
/* ---- update: arrival, strikes, thunder, the weather clock, the sounds ---- */
{const _u=update;update=function(dt){
  try{
    if(bksOn()){
      BKS.in=0;
      if(BKS.lv!==LEVEL){BKS.arr=LEVEL;BKS.ready=false}   // the sky is rebuilt in render3D (it is a few hundred ms: once per arrival)
      const t=G.time,d=Math.min(dt||0,.2);
      if(BKS.ready){
        if(BKS.newLv){BKS.newLv=false;bksArrive(LEVEL)}
        if(t>BKS.next&&!BKS.strike)bksStrike();
        for(let i=BKS.thunderQ.length-1;i>=0;i--)if(t>=BKS.thunderQ[i].at){const q=BKS.thunderQ.splice(i,1)[0];BKS.thunders++;gysRumble(q.vol)}
        bksWeather(d)}
    }else{
      if(bksIndoor()){BKS.in=1;bksWeather(Math.min(dt||0,.2))}else{BKS.in=0;BKS.rain=0}
      BKS.strike=null;BKS.thunderQ.length=0;BKS.f=0;if(self.BKSKY_LV)self.BKSKY_LV=0;if(BKS.lv)BKS.lv=0}
    bksSound(Math.min(dt||0,.2));
  }catch(e){console.error('BKS',e)}
  return _u.apply(this,arguments)}}
/* ---- the air: grey green haze as the kit has it, thicker and wetter in the rain, brown-red in the red places ---- */
{const _w=weatherNow;weatherNow=function(){const w=_w.apply(this,arguments);
  if(!w||BKS.off||!bksIs(LEVEL)||!LEVELS[LEVEL]||!LEVELS[LEVEL].outdoor||!BKS.ready)return w;
  const r=BKS.rain,rd=BKS.red||0;
  const col=w.col?[w.col[0]*(1-.08*r)+(rd*26),w.col[1]*(1-.09*r)-(rd*20),w.col[2]*(1-.07*r)-(rd*22)]:[110,122,116];
  return Object.assign({},w,{fog:(w.fog||.016)+.005*r,haze:Math.min(.5,(w.haze||.34)+.04*r+.03*rd),mix:Math.min(.6,(w.mix||.5)+.025*r),col,
    text:r>.05?(r>.55?'Rain is coming down hard on the dead road, and the sky is the colour of old iron.':'A thin cold rain is drifting over the dead road.'):w.text})}}
/* ---- the sky, the light, the lamps: the next slice; the flash lifts the light for that frame ---- */
{const _r=render3D;render3D=function(){
  if(!bksOn()){if(self.BKSKY_LV)self.BKSKY_LV=0;return _r.apply(this,arguments)}
  if(BKS.lv!==LEVEL||!BKS.ready){try{bksBuild(LEVEL);BKS.newLv=true;self.BKSKY_PAN=BKS.pan}catch(e){console.error('BKS build',e);BKS.off=true;return _r.apply(this,arguments)}}
  self.BKSKY_LV=LEVEL;
  const f=bksFlash();BKS.f=f;
  bksPanoStep();
  const a0=G.amb;
  G.amb=(a0||0)*(1-.06*BKS.rain)+f*.4;
  if(f>0)for(const L of LIGHTS){if(L.kI0===undefined)L.kI0=L.kI||1;L.kI=L.kI0*(1+.9*f)}
  else for(const L of LIGHTS)if(L.kI0!==undefined){L.kI=L.kI0;L.kI0=undefined}
  try{return _r.apply(this,arguments)}finally{G.amb=a0}}}
/* ---- the picture over the 3D view ---- */
{const _d=drawWorld;drawWorld=function(){
  const r=_d.apply(this,arguments);
  if(bksOn()&&BKS.ready)try{bksOverlay()}catch(e){console.error('BKS overlay',e)}
  return r}}
/* per-place gradients (kept, not rebuilt per frame) */
const BKS_G={wash:null,sheen:null,mist:null,lk:null};
function bksGround(lk,L){
  const hh=typeof HH==='number'?HH:105,rd=lk.red;
  BKS_G.lk=lk;bksSprites(rd?1:0);
  let g=ctx.createLinearGradient(0,hh-6,0,210);   // wet darkening on the ground (multiply): lighter at the horizon, darker near
  g.addColorStop(0,'rgb(244,246,246)');g.addColorStop(1,`rgb(${156+rd*24|0},${164-rd*10|0},${176-rd*28|0})`);BKS_G.wash=g;
  g=ctx.createLinearGradient(0,hh,0,210);   // the sky mirrored in the wet ground (lighter)
  const sr=rd?[190,96,70]:[150,164,174];g.addColorStop(0,`rgba(${sr[0]},${sr[1]},${sr[2]},0)`);g.addColorStop(.14,`rgba(${sr[0]},${sr[1]},${sr[2]},.42)`);g.addColorStop(.4,`rgba(${sr[0]},${sr[1]},${sr[2]},.28)`);g.addColorStop(1,`rgba(${sr[0]},${sr[1]},${sr[2]},0)`);BKS_G.sheen=g;
  g=ctx.createLinearGradient(0,hh-46,0,hh+30);   // mist on the horizon
  const mc=rd?'150,118,108':'148,158,158';g.addColorStop(0,`rgba(${mc},0)`);g.addColorStop(.6,`rgba(${mc},.09)`);g.addColorStop(1,`rgba(${mc},0)`);BKS_G.mist=g}
/* ---- rain: three layers of streaks, ripples, sheen. All particles are in typed arrays made once. ---- */
const BKS_NF=190,BKS_NM=110,BKS_NN=14,BKS_NR=90,BKS_NP=22;
const BKS_P=(()=>{let s=90210;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296},mk=n=>{const a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=rnd();return a};
  return {fx:mk(BKS_NF),fp:mk(BKS_NF),fl:mk(BKS_NF),mx:mk(BKS_NM),mp:mk(BKS_NM),ml:mk(BKS_NM),nx:mk(BKS_NN),np:mk(BKS_NN),nl:mk(BKS_NN),rx:mk(BKS_NR),ry:mk(BKS_NR),rp:mk(BKS_NR),rt:mk(BKS_NR),sw:mk(24),pd:mk(BKS_NP),px:mk(BKS_NP)}})();
function bksLamp(){   // how lamp-lit the party's spot is (checked a few times a second)
  if((BKS.fr++&7)!==0)return BKS.lampK;
  let best=0,bx=0,by=0;const C=G.C;
  for(let i=0;i<LIGHTS.length;i++){const L=LIGHTS[i];if(L.lamp===false)continue;const dx=L.x-C.x,dy=L.y-C.y,d2=dx*dx+dy*dy;if(d2<64){const k=1-d2/64;if(k>best){best=k;bx=L.x;by=L.y}}}
  const LL=LEVELS[LEVEL]&&LEVELS[LEVEL].lights;if(LL)for(let i=0;i<LL.length;i++){const e=LL[i];if(!e||e.length<2)continue;const dx=e[0]+.5-C.x,dy=e[1]+.5-C.y,d2=dx*dx+dy*dy;if(d2<64){const k=1-d2/64;if(k>best){best=k;bx=e[0]+.5;by=e[1]+.5}}}
  BKS.lampK+=(best-BKS.lampK)*.5;
  BKS.lbx=-999;if(best>0){const LA=C.a+(typeof LKYAW==='number'?LKYAW:0),d=((Math.atan2(by-C.y,bx-C.x)-LA)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;if(Math.abs(d)<1.2)BKS.lbx=210*(1+Math.tan(d)/PL)}
  return BKS.lampK}
/* near lamps, props and roofs for the wet extras: refreshed a few times a second */
function bksScan(){
  if(BKS.scanF&&(BKS.fr&7)!==1)return;BKS.scanF=1;
  const C=G.C,LAm=BKS.lamps||(BKS.lamps=[]),PR=BKS.props||(BKS.props=[]),RF=BKS.roofs||(BKS.roofs=[]);LAm.length=0;PR.length=0;RF.length=0;
  for(let i=0;i<LIGHTS.length;i++){const L=LIGHTS[i];if(L.lamp===false)continue;const dx=L.x-C.x,dy=L.y-C.y,d2=dx*dx+dy*dy;if(d2<110&&LAm.length<24)LAm.push([L.x,L.y,d2])}
  const LL=LEVELS[LEVEL]&&LEVELS[LEVEL].lights;if(LL)for(let i=0;i<LL.length;i++){const e=LL[i];if(!e||e.length<2)continue;const dx=e[0]+.5-C.x,dy=e[1]+.5-C.y,d2=dx*dx+dy*dy;if(d2<110&&LAm.length<24)LAm.push([e[0]+.5,e[1]+.5,d2])}
  LAm.sort((a,b)=>a[2]-b[2]);LAm.length=Math.min(LAm.length,4);
  const dc=G.decor;for(let i=0;i<dc.length&&PR.length<40;i++){const d=dc[i];if(d.found||!d.block||d.walk)continue;const dx=d.x+.5-C.x,dy=d.y+.5-C.y,d2=dx*dx+dy*dy;if(d2>40||d2<2.2)continue;const h=(NPC_H[d.k]||0)*(d.sc||1);if(h<.5||h>2.8)continue;PR.push([d.x+.5,d.y+.5,h,d2])}
  PR.sort((a,b)=>a[3]-b[3]);PR.length=Math.min(PR.length,7);
  const sk=LEVELS[LEVEL]&&LEVELS[LEVEL].sky;if(sk)for(let i=0;i<sk.length&&RF.length<30;i++){const e=sk[i];if(!e||e.big||!e.z||e.z<1)continue;const dx=e.x-C.x,dy=e.y-C.y,d2=dx*dx+dy*dy;if(d2<150&&d2>3)RF.push([e.x,e.y,e.w||2,e.z,d2])}
  RF.sort((a,b)=>a[4]-b[4]);RF.length=Math.min(RF.length,5)}
function bksWetExtras(R,t,f,rd,hh){
  const S=BKS_S,P=BKS_P,C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0),FE=F*EYE,TW=Math.PI*2;bksScan();
  let i,j;
  // glints: pale dashes twinkling on the wet road
  ctx.globalCompositeOperation='lighter';
  for(i=0;i<16;i++){const d=P.ry[i+20],dd=d*d*.8+.2*d,sc=.5+dd*1.3,y=hh+7+dd*(210-hh-12),x=P.rx[i+30]*440-10,a=.5+.5*Math.sin(t*(1.1+P.rp[i]*1.6)+i*2.3);if(a<.2)continue;ctx.globalAlpha=Math.min(.7,a*.5*R*(1+f));ctx.drawImage(S.glint,x,y,16*sc*2.2,3*sc)}
  // lamp reflections: a warm smear under every lamp in view, broken by ripples
  for(const L of BKS.lamps){const dx=L[0]-C.x,dy=L[1]-C.y,ang=Math.atan2(dy,dx),d=((ang-LA)%TW+Math.PI*3)%TW-Math.PI;if(Math.abs(d)>1.15)continue;
    const z=Math.sqrt(L[2])*Math.cos(d);if(z<.6)continue;const sx=210*(1+Math.tan(d)/PL),yb=hh+FE/z;if(yb>=214)continue;
    const w=Math.max(7,Math.min(56,130/z)),len=Math.min(140,(214-yb)*.95+6),al=Math.min(.95,R*1.9*(1-z/13)*(1+f*.6));if(al<.03)continue;
    const n=5,sh=len/n;
    for(j=0;j<n;j++){const off=Math.sin(t*2.6+j*1.7+L[0]*3)*w*.12*(j+1)/n,ww=w*(1+j*.14);ctx.globalAlpha=al*(1-j*.13)*(.8+.2*Math.sin(t*5+j*2.1+L[1]));ctx.drawImage(S.smear,0,j*64/n,32,64/n+.5,sx-ww/2+off,yb+j*sh,ww,sh+.5)}}
  // splashes on the tops of props and on the eaves of roofs
  ctx.globalCompositeOperation='source-over';
  const crown=(sx,y,sc,seed)=>{const k=(((t*3.1+seed*.37)%1)*4)|0;ctx.globalAlpha=Math.min(.8,R*.8);ctx.drawImage(S.ring,k*26,0,26,11,sx-13*sc,y-9*sc,26*sc,11*sc)};
  for(const q of BKS.props){const dx=q[0]-C.x,dy=q[1]-C.y,d=((Math.atan2(dy,dx)-LA)%TW+Math.PI*3)%TW-Math.PI;if(Math.abs(d)>1.1)continue;const z=Math.sqrt(q[3])*Math.cos(d);if(z<.8)continue;
    const sx=210*(1+Math.tan(d)/PL),y=hh+F*(EYE-q[2])/z,sc=Math.max(.3,Math.min(1.1,.5+.5/z)),hw=q[2]*.22*F/z;
    for(j=0;j<3;j++)crown(sx+(j-1)*hw*.8+Math.sin(j*7+q[0])*2,y+ ((j*5)%3),sc,j*3+q[1])}
  for(const q of BKS.roofs){const dx=q[0]-C.x,dy=q[1]-C.y,d=((Math.atan2(dy,dx)-LA)%TW+Math.PI*3)%TW-Math.PI;if(Math.abs(d)>1.15)continue;const z=Math.sqrt(q[4])*Math.cos(d);if(z<1)continue;
    const sx=210*(1+Math.tan(d)/PL),y=hh+F*(EYE-q[3])/z,sc=Math.max(.35,Math.min(1.1,.5+.6/z)),hw=q[2]*.5*F/z;
    for(j=0;j<4;j++)crown(sx+(j-1.5)*hw*.55,y+2,sc,j*5+q[0]+q[1])}
  ctx.globalAlpha=1}
function bksOverlay(){
  const t=G.time,f=BKS.f||0,hh=typeof HH==='number'?HH:105,s=BKS.strike,R=BKS.rain,rd=BKS.red||0,lk=BKS.lk;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  // the storm tint: a cool wash (a touch of brown in a red place)
  ctx.globalCompositeOperation='multiply';ctx.fillStyle=rd?`rgb(${234+rd*8|0},${228-rd*8|0},${228-rd*12|0})`:'rgb(230,234,236)';ctx.fillRect(0,0,420,210);
  if(R>0.02){   // wet ground: darker, the wash fades in with the rain
    ctx.globalAlpha=Math.min(1,R*1.1);ctx.fillStyle=BKS_G.wash;ctx.fillRect(0,hh-6,420,210-hh+6);ctx.globalAlpha=1}
  let g;
  ctx.globalCompositeOperation='lighter';
  if(f>.01){
    const C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0),c1=rd?[255,196,176]:[190,205,255],c2=rd?[216,120,96]:[130,150,215];
    g=ctx.createLinearGradient(0,0,0,210);g.addColorStop(0,`rgba(${c2[0]},${c2[1]},${c2[2]},${.26*f})`);g.addColorStop(.55,`rgba(${c2[0]*.8|0},${c2[1]*.8|0},${c2[2]*.8|0},${.12*f})`);g.addColorStop(1,`rgba(${c2[0]*.6|0},${c2[1]*.6|0},${c2[2]*.6|0},${.06*f})`);ctx.fillStyle=g;ctx.fillRect(0,0,420,210);
    if(s){const d=((s.az-LA)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI,inView=Math.abs(d)<1.3,bx=210*(1+Math.tan(Math.max(-1.3,Math.min(1.3,d)))/PL);
      const gx=Math.max(-60,Math.min(480,bx)),rr=130+80*(1-s.far),rg=ctx.createRadialGradient(gx,hh*.38,4,gx,hh*.38,rr);rg.addColorStop(0,`rgba(${c1[0]},${c1[1]},${c1[2]},${.5*f})`);rg.addColorStop(.5,`rgba(${c2[0]},${c2[1]},${c2[2]},${.2*f})`);rg.addColorStop(1,`rgba(${c2[0]*.7|0},${c2[1]*.7|0},${c2[2]*.7|0},0)`);ctx.fillStyle=rg;ctx.fillRect(0,0,420,hh+20);
      if(s.fork&&inView){const segs=gysFork(s,bx,0,hh-14),ph=BKS.hold!==null?BKS.hold:(t-s.t0)*1000,vis=ph<85||(ph>105&&ph<235)?1:.35;
        ctx.lineCap='round';ctx.lineJoin='round';
        for(const [w,col] of [[6,`rgba(${c2[0]},${c2[1]},${c2[2]},${.14*vis*f})`],[3,`rgba(${c1[0]},${c1[1]},${c1[2]},${.4*vis*f})`],[1.2,`rgba(250,248,252,${.95*vis})`]])
          for(const main of [1,.5]){ctx.strokeStyle=col;ctx.lineWidth=w*main;ctx.beginPath();for(const sg of segs)if(sg[4]===main){ctx.moveTo(sg[0],sg[1]);ctx.lineTo(sg[2],sg[3])}ctx.stroke()}}}
  }
  ctx.globalCompositeOperation='source-over';
  if(R>0.02){
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=BKS_G.sheen;ctx.globalAlpha=Math.min(1,R*1.2)*(1+f*1.5);ctx.fillRect(0,hh,420,210-hh);ctx.globalAlpha=1;
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=Math.min(1,R*.8);ctx.fillStyle=BKS_G.mist;ctx.fillRect(0,hh-46,420,76);ctx.globalAlpha=1;
    bksRain(R,t,f,rd);if(BKS_S.smear&&!BKS.xOff)bksWetExtras(R,t,f,rd,hh)}
  ctx.restore()}
/* sprites: streaks, ring and crown frames, puddles, glow, gust sheet; drawn once per arrival into small offscreen canvases, then only blitted */
const BKS_S={rd:-1};
function bksCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function bksStreak(w,h,rgb,core,halo){   // vertical streak: transparent tail, bright head (bottom); halo columns for the near layer
  const c=bksCv(w,h),g=c.getContext('2d'),m=(w-1)>>1;
  const grad=(a)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,`rgba(${rgb},0)`);q.addColorStop(.55,`rgba(${rgb},${a*.5})`);q.addColorStop(1,`rgba(${rgb},${a})`);return q};
  if(halo){g.fillStyle=grad(halo);g.fillRect(m-2,0,5,h)}
  g.fillStyle=grad(core);g.fillRect(m,0,1,h);return c}
function bksSprites(rd){
  if(BKS_S.rd===rd)return;BKS_S.rd=rd;
  const cool=rd?'244,170,148':'196,210,224',warm='255,214,150';
  BKS_S.far=bksStreak(3,16,rd?'226,150,130':'176,190,204',.45,0);
  BKS_S.mid=bksStreak(3,26,cool,.8,0);
  BKS_S.nearC=bksStreak(9,96,cool,.7,.2);BKS_S.nearW=bksStreak(9,96,warm,.85,.26);
  // ring atlas: 8 frames of 26 by 14: a flat ring growing and fading, and a crown of droplets early on
  const at=bksCv(26*8,14),g=at.getContext('2d');BKS_S.ring=at;
  for(let k=0;k<8;k++){const u=(k+.5)/8,r=1+u*11,cx=k*26+13,cy=10,al=Math.pow(1-u,1.2);
    g.strokeStyle=`rgba(${rd?'240,206,190':'228,238,246'},${.9*al})`;g.lineWidth=1;g.beginPath();g.ellipse(cx,cy,r,r*.32,0,0,6.2832);g.stroke();
    if(u<.5){const hgt=(1-u*1.6)*5*Math.sin(Math.min(1,u*5)*1.57+.3);g.strokeStyle=`rgba(${rd?'240,206,190':'232,240,248'},${.85*(1-u*1.6)})`;g.beginPath();
      g.moveTo(cx-1,cy);g.lineTo(cx-2.5-u*3,cy-hgt);g.moveTo(cx,cy);g.lineTo(cx,cy-hgt*1.3);g.moveTo(cx+1,cy);g.lineTo(cx+2.5+u*3,cy-hgt);g.stroke();
      g.fillStyle=`rgba(255,255,255,${.7*(1-u*1.6)})`;g.fillRect(cx-3-u*4,cy-hgt-1,1,1);g.fillRect(cx+3+u*4,cy-hgt-1,1,1)}}
  // puddle: a flat patch holding the sky
  const pu=bksCv(64,18),pg=pu.getContext('2d'),gr=pg.createRadialGradient(32,9,1,32,9,32);
  gr.addColorStop(0,rd?'rgba(200,110,80,.55)':'rgba(170,186,198,.5)');gr.addColorStop(.6,rd?'rgba(150,80,64,.25)':'rgba(130,146,158,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');
  pg.save();pg.scale(1,.28);pg.fillStyle=gr;pg.fillRect(0,-20,64,128);pg.restore();BKS_S.pud=pu;
  // lamp glow: warm soft mist round a lit lamp
  const gl=bksCv(128,128),lg=gl.getContext('2d'),gg=lg.createRadialGradient(64,64,2,64,64,64);gg.addColorStop(0,'rgba(255,214,150,.55)');gg.addColorStop(.35,'rgba(255,190,120,.22)');gg.addColorStop(1,'rgba(255,170,100,0)');lg.fillStyle=gg;lg.fillRect(0,0,128,128);BKS_S.glow=gl;
  // gust sheet: a soft slanted band of rain haze
  const sh=bksCv(160,64),sg=sh.getContext('2d'),sl=sg.createLinearGradient(0,0,160,0);sl.addColorStop(0,'rgba(190,204,216,0)');sl.addColorStop(.5,'rgba(190,204,216,.5)');sl.addColorStop(1,'rgba(190,204,216,0)');sg.fillStyle=sl;sg.fillRect(0,0,160,64);BKS_S.sheet=sh;
  // lamp reflection: a warm vertical smear for the wet road (bright at the lamp's foot, fading toward the viewer, narrow waist)
  const sm=bksCv(32,64),sg2=sm.getContext('2d'),hg=sg2.createLinearGradient(0,0,32,0);hg.addColorStop(0,'rgba(255,200,130,0)');hg.addColorStop(.38,'rgba(255,206,140,.5)');hg.addColorStop(.5,'rgba(255,230,180,1)');hg.addColorStop(.62,'rgba(255,206,140,.5)');hg.addColorStop(1,'rgba(255,200,130,0)');
  sg2.fillStyle=hg;sg2.fillRect(0,0,32,64);sg2.globalCompositeOperation='destination-in';const vg=sg2.createLinearGradient(0,0,0,64);vg.addColorStop(0,'rgba(0,0,0,1)');vg.addColorStop(.35,'rgba(0,0,0,.55)');vg.addColorStop(1,'rgba(0,0,0,0)');sg2.fillStyle=vg;sg2.fillRect(0,0,32,64);BKS_S.smear=sm;
  // glint: a thin pale dash on the wet ground
  const gn=bksCv(16,3),gq=gn.getContext('2d'),gh=gq.createLinearGradient(0,0,16,0);gh.addColorStop(0,'rgba(220,232,244,0)');gh.addColorStop(.5,rd?'rgba(250,210,190,.9)':'rgba(236,244,252,.9)');gh.addColorStop(1,'rgba(220,232,244,0)');gq.fillStyle=gh;gq.fillRect(0,1,16,1);gq.fillStyle=gh;gq.globalAlpha=.3;gq.fillRect(0,0,16,3);BKS_S.glint=gn;
  // spray where the rain meets the horizon haze: small soft puffs
  const sp=bksCv(24,10),pp=sp.getContext('2d'),sgr=pp.createRadialGradient(12,5,0,12,5,12);sgr.addColorStop(0,'rgba(196,208,218,.5)');sgr.addColorStop(1,'rgba(196,208,218,0)');pp.save();pp.scale(1,.42);pp.fillStyle=sgr;pp.fillRect(0,0,24,24);pp.restore();BKS_S.spray=sp}
function bksRain(R,t,f,rd){
  const P=BKS_P,lamp=bksLamp(),S=BKS_S,hh=typeof HH==='number'?HH:105,gh=210-hh-6,
    gu=Math.sin(t*.8+Math.sin(t*.23)*2),gust=gu>0?gu*gu:0,
    wind=-.22-.08*Math.sin(t*1.3)-.05*Math.sin(t*2.9+1)-(.2+.2*R)*gust,gk=1+.4*gust,fl=1+f*2.2,ra=Math.min(1,R*1.5)*fl,gs=1+.15*gust;
  let n,i,x,y,pos,cyc,ln;
  if(!S.far||S.rd!==(rd?1:0))return;
  ctx.globalCompositeOperation='source-over';
  // puddles on the road, spread in perspective, flickering slowly
  for(i=0;i<BKS_NP;i++){const d=P.pd[i],dd=1-(1-d)*(1-d),sc=.35+dd*1.3,py=hh+10+dd*(gh-6),px=P.px[i]*470-25+Math.sin(t*.3+i)*2;
    ctx.globalAlpha=Math.min(.95,(.6+.2*Math.sin(t*1.7+i*2))*Math.min(1,R*1.3)*(1+f*1.5));ctx.drawImage(S.pud,px-32*sc,py-9*sc,64*sc,18*sc)}
  // horizon spray: the rain breaking into the haze
  for(i=0;i<18;i++){const ph=(t*1.3+P.sw[i%24])%1,a=Math.sin(ph*3.1416),px=((P.sw[(i+5)%24]*7+i*.137)%1)*440-10;if(a<.1)continue;ctx.globalAlpha=Math.min(1,R)*a*.7;const sc=.7+P.sw[(i+9)%24]*.8;ctx.drawImage(S.spray,px,hh-3-P.sw[(i+2)%24]*6,24*sc,10*sc)}
  // streaks: one shear per layer, then plain blits
  ctx.save();ctx.transform(1,0,wind,1,0,0);
  n=Math.min(BKS_NF,Math.round(BKS_NF*R*gk));ctx.globalAlpha=Math.min(1,.7*fl);
  for(i=0;i<n;i++){pos=P.fp[i]*260+t*(170+P.fl[i]*60)*gs;cyc=Math.floor(pos/260);y=pos-cyc*260-25;x=((P.fx[i]+cyc*.618)%1)*470-25-y*wind;ln=8+P.fl[i]*8;ctx.drawImage(S.far,x,y,3,ln)}
  n=Math.min(BKS_NM,Math.round(BKS_NM*R*gk));for(i=0;i<n;i++){ctx.globalAlpha=Math.min(1,(.45+.5*P.mx[i])*fl);pos=P.mp[i]*260+t*(360+P.ml[i]*110)*gs;cyc=Math.floor(pos/260);y=pos-cyc*260-25;x=((P.mx[i]+cyc*.382)%1)*470-25-y*wind;ln=18+P.ml[i]*12;ctx.drawImage(S.mid,x,y,3,ln)}
  n=Math.min(BKS_NN,Math.round(BKS_NN*R*gk));const wk=Math.min(1,lamp*1.3);
  for(i=0;i<n;i++){pos=P.np[i]*340+t*(760+P.nl[i]*240)*gs;cyc=Math.floor(pos/340);y=pos-cyc*340-110;x=((P.nx[i]+cyc*.7548)%1)*480-30-y*wind;ln=64+P.nl[i]*30;
    if(wk<.98){ctx.globalAlpha=Math.min(1,(.55+.2*P.nl[i])*fl*(1-wk));ctx.drawImage(S.nearC,x,y,9,ln)}
    if(wk>.02){ctx.globalAlpha=Math.min(1,.7*fl*wk);ctx.drawImage(S.nearW,x,y,9,ln)}}
  ctx.restore();
  // a gust sheet: a soft band of thick rain sweeping across, slanted with the wind
  if(gust>.08){const sx=((t*90)%700)-200;ctx.globalAlpha=Math.min(.5,gust*.28*R);ctx.save();ctx.transform(1,0,wind*.9,1,0,0);ctx.drawImage(S.sheet,sx,0,200,210);ctx.restore()}
  // warm mist round the lamp that lights the party
  if(lamp>.04&&BKS.lbx>-200){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.8,lamp*.55*Math.min(1,.4+R)*fl);const sc=70+60*lamp;ctx.drawImage(S.glow,BKS.lbx-sc,hh-18-sc*.6,sc*2,sc*1.5);ctx.globalCompositeOperation='source-over'}
  // ripples and crowns on the road, spread in perspective (more and bigger near the camera)
  const m=Math.round(BKS_NR*(.4+.6*R));
  for(i=0;i<m;i++){const per=.5+P.rp[i]*.5,ph=t/per+P.rt[i]*7;cyc=Math.floor(ph);const u=ph-cyc;if(u>.97)continue;const d=(P.ry[i]+cyc*.7548)%1,dd=1-(1-d)*(1-d),sc=(.5+dd*1.1)*(.65+.7*((P.rt[i]*13+cyc*.37)%1));
    y=hh+8+dd*gh;x=((P.rx[i]+cyc*.618)%1)*440-10;const k=(u*8)|0;ctx.globalAlpha=Math.min(1,ra*(.3+.3*dd));ctx.drawImage(S.ring,k*26,0,26,14,x-13*sc,y-10*sc,26*sc,14*sc)}
  ctx.globalAlpha=1}
