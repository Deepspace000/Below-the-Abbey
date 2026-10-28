/* ==========================================================================
   STORMCLOUDS OVER THE WENLOCK GRAVEYARD (level 530 only; the crypt, the mazes, Wenlock and the wood keep their own looks).
   Sky: a 1024 by 256 panorama of three parallax cloud banks (bruise purple far, slate middle, blue-black near). The banks are
   painted once into small baked pictures (noise, shaded, rim-lit on their upper edges) and slid past each other, a few columns of
   the panorama per frame into a back buffer that is swapped in whole (no seams, about 1 ms a frame). The engine's sky code reads
   GYS_PAN in place of the overcast picture (one test in index.html, line with ovcLv).
   Light: a greenish-grey dusk (weatherNow) and a cool multiply wash over the view.
   Lightning: every 6 to 20 seconds, a double flicker (about 230 ms), sheet glow inside the clouds, sometimes a jagged fork, then a
   rolling thunder 1 to 3 seconds later. The flash lifts the ambient light and the lamps for that moment (render3D wrapper; nothing is saved).
   Rain only in the stretches when the storm is brewing: thin streaks, low count, soft rain loop. A light wind and a few drifting leaves.
   Everything is keyed on LEVEL===530 and G.state==='play'; it touches no combat, save data or gameplay.
   Notes: tools/gy_storm/NOTES.md
   ========================================================================== */
const GYS={ID:530,ready:false,next:0,strike:null,thunderQ:[],thunders:0,sounds:0,strikes:0,pt:0,rainSrc:null,rainG:null,rain:0,f:0,
  force:null,hold:null,off:false,   // test hooks: force the rain (1 or -1 for none), hold the flash at a point in time (ms), switch the whole effect off
  V0:28,V1:158,L:null,pan:null,back:null,pan32:null,back32:null,col:0,cpf:64,ms:0,cyc:null,br:null,
  reduced:(()=>{try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){return false}})(),
  CAL:130,RAINT:150,CYC:330};   // calm for 130 s, then 150 s of rain (20 s of it fading in and out), then 50 s of calm again
const gysOn=()=>!GYS.off&&typeof LEVEL!=='undefined'&&LEVEL===GYS.ID&&G.state==='play';
const gysSm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
/* ---- the cloud banks: tileable value noise, shaded and rim-lit, packed as 0xAABBGGRR; built once on the first visit ---- */
function gysNoise(seed,cx,cy,oct,pers){   // 512 columns (wrapping) by 256 rows, values about 0..1
  const W=512,H=256;let s=seed>>>0;const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
  const out=new Float32Array(W*H);let amp=(1-pers)/(1-Math.pow(pers,oct));
  for(let o=0;o<oct;o++){
    const nx=cx<<o,ny=(cy<<o)+1,g=new Float32Array(nx*(ny+1));for(let i=0;i<g.length;i++)g[i]=rnd();
    const X0=new Int32Array(W),X1=new Int32Array(W),FX=new Float32Array(W);
    for(let x=0;x<W;x++){const p=x*nx/W,i=Math.floor(p),f=p-i;X0[x]=i%nx;X1[x]=(i+1)%nx;FX[x]=f*f*(3-2*f)}
    for(let y=0;y<H;y++){const p=y*(ny-1)/H,j=Math.floor(p),f=p-j,fy=f*f*(3-2*f),r0=j*nx,r1=(j+1)*nx,ro=y*W;
      for(let x=0;x<W;x++){const a=g[r0+X0[x]],b=g[r0+X1[x]],c=g[r1+X0[x]],d=g[r1+X1[x]],fx=FX[x];
        out[ro+x]+=amp*((a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy)}}
    amp*=pers}
  return out}
/* the palette is written as the colour wanted on the screen; gysP divides out what the engine and the overlay do to the sky on the way (ambient .83 x .92, the warm
   tint, the cool wash), so that the picture comes out as written */
const gysP=(r,g,b)=>[Math.min(255,r/.638),Math.min(255,g/.633),Math.min(255,b/.546)];
const GYS_SPEC=[ // far (bruise purple, low on the horizon), middle (slate), near (blue-black, heavy)
  {seed:7311,cx:24,cy:7,oct:4,th:.50,sc:.40,alp:.80,core:gysP(66,50,86),rim:gysP(126,110,144),env:v=>.25+.75*gysSm(60,140,v)},
  {seed:1907,cx:18,cy:6,oct:5,th:.44,sc:.44,alp:.92,core:gysP(52,60,76),rim:gysP(112,126,138),env:v=>.55+.45*gysSm(40,100,v)-.25*gysSm(135,170,v)},
  {seed:4421,cx:14,cy:5,oct:5,th:.37,sc:.48,alp:.98,core:gysP(24,28,44),rim:gysP(90,106,122),env:v=>1-.5*gysSm(105,168,v)}];
function gysBake(sp){
  const n=gysNoise(sp.seed,sp.cx,sp.cy,sp.oct,.56),W=1024,H=256,d=new Float32Array(W*H),E=new Float32Array(H);
  for(let y=0;y<H;y++)E[y]=sp.env(y);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const h=x>>1,a=n[y*512+h],b=n[y*512+((h+1)&511)],v=(x&1)?(a+b)*.5:a;d[y*W+x]=Math.min(1,Math.max(0,(v-sp.th)/sp.sc*E[y]))}
  const out=new Uint32Array(W*H),c=sp.core,rc=sp.rim;
  for(let y=4;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,dd=d[i];if(dd<.012)continue;
    const a=Math.min(1,dd*1.7)*sp.alp,sh=1.28-.62*dd,rim=Math.min(1,Math.max(0,(dd-d[i-4*W])*2.8))*.85;
    const cr=c[0]*sh,cg=c[1]*sh,cb=c[2]*sh,r=Math.min(255,cr+(rc[0]-cr)*rim),g=Math.min(255,cg+(rc[1]-cg)*rim),b=Math.min(255,cb+(rc[2]-cb)*rim);   // the lit edge is blended in, never added (nothing burns out)
    out[i]=((a*255)<<24|((b|0)<<16)|((g|0)<<8)|(r|0))>>>0}
  return out}
const GYS_BASE=[gysP(34,40,58),gysP(40,48,64),gysP(60,72,86),gysP(92,108,102),gysP(126,142,124),gysP(130,146,128)],GYS_BV=[20,60,90,125,152,172];
function gysBuild(){
  if(GYS.ready)return;const N=1024*256;
  GYS.L=GYS_SPEC.map(gysBake);
  const br={r:new Float32Array(256),g:new Float32Array(256),b:new Float32Array(256)};   // the sky between the clouds: blue-black overhead, a sick green glow low down
  for(let v=0;v<256;v++){let j=0;while(j<GYS_BV.length-2&&v>GYS_BV[j+1])j++;const f=Math.min(1,Math.max(0,(v-GYS_BV[j])/(GYS_BV[j+1]-GYS_BV[j])));
    br.r[v]=GYS_BASE[j][0]+(GYS_BASE[j+1][0]-GYS_BASE[j][0])*f;br.g[v]=GYS_BASE[j][1]+(GYS_BASE[j+1][1]-GYS_BASE[j][1])*f;br.b[v]=GYS_BASE[j][2]+(GYS_BASE[j+1][2]-GYS_BASE[j][2])*f}
  GYS.br=br;GYS.pan=new Uint8ClampedArray(N*4);GYS.back=new Uint8ClampedArray(N*4);GYS.pan32=new Uint32Array(GYS.pan.buffer);GYS.back32=new Uint32Array(GYS.back.buffer);
  for(let v=0;v<256;v++){const c=0xFF000000|((br.b[v]|0)<<16)|((br.g[v]|0)<<8)|(br.r[v]|0);GYS.pan32.fill(c>>>0,v*1024,v*1024+1024)}
  gysCycle(0);gysCompose(GYS.pan32,0,1024);GYS.back32.set(GYS.pan32);GYS.col=0;GYS.ready=true;self.GYS_PAN=GYS.pan}
/* the layers' positions for one pass over the panorama: drift (each bank at its own speed), a slow billow up and down, and a shear */
function gysCycle(t){
  const C=GYS.cyc||(GYS.cyc={ox:[0,0,0],w:[new Int32Array(1024),new Int32Array(1024),new Int32Array(1024)],sh:[new Int32Array(256),new Int32Array(256),new Int32Array(256)]});
  const spd=[8,5.5,2],amp=[3,5,8],sha=[4,7,11],TAU=6.2832;   // the engine slides the whole panorama round at 11 px/s; the banks lag behind it by different amounts, so the near bank (2) goes by fastest and the far one (8) slowest
  for(let q=0;q<3;q++){C.ox[q]=Math.floor(t*spd[q]);const w=C.w[q],s=C.sh[q];
    for(let x=0;x<1024;x++)w[x]=Math.round(amp[q]*Math.sin(t*(.05+.02*q)+x*TAU*(3+q)/1024+q));
    for(let v=0;v<256;v++)s[v]=Math.round(sha[q]*Math.sin(t*.04*(q+1)+v*.055*(q+1)+q*2))}}
function gysCompose(O,c0,c1){
  const C=GYS.cyc,L0=GYS.L[0],L1=GYS.L[1],L2=GYS.L[2],BR=GYS.br.r,BG=GYS.br.g,BB=GYS.br.b,V0=GYS.V0,V1=GYS.V1,K=1/255,
    o0=C.ox[0],o1=C.ox[1],o2=C.ox[2],S0=C.sh[0],S1=C.sh[1],S2=C.sh[2],W0=C.w[0],W1=C.w[1],W2=C.w[2];
  for(let x=c0;x<c1;x++){const w0=W0[x],w1=W1[x],w2=W2[x];
    for(let v=V0;v<=V1;v++){
      let r=BR[v],g=BG[v],b=BB[v],p,a,k;
      p=L0[(v-w0)*1024+((x-o0+S0[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      p=L1[(v-w1)*1024+((x-o1+S1[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      p=L2[(v-w2)*1024+((x-o2+S2[v])&1023)];a=p>>>24;if(a!==0){k=a*K;r+=((p&255)-r)*k;g+=(((p>>8)&255)-g)*k;b+=(((p>>16)&255)-b)*k}
      O[v*1024+x]=(0xFF000000|((b|0)<<16)|((g|0)<<8)|(r|0))>>>0}}}
/* one slice of the next panorama per frame (the number of columns follows how fast the machine is); when the last slice is done the buffers swap */
function gysPanoStep(){
  const t0=performance.now();
  if(GYS.col===0)gysCycle(G.time);
  const c1=Math.min(1024,GYS.col+GYS.cpf);gysCompose(GYS.back32,GYS.col,c1);GYS.col=c1;
  if(c1>=1024){GYS.col=0;let o=GYS.pan;GYS.pan=GYS.back;GYS.back=o;o=GYS.pan32;GYS.pan32=GYS.back32;GYS.back32=o;self.GYS_PAN=GYS.pan}
  const dt=performance.now()-t0;GYS.ms=GYS.ms*.9+dt*.1;
  if(dt>1.8&&GYS.cpf>32)GYS.cpf-=16;else if(dt<.8&&GYS.cpf<256)GYS.cpf+=16}
/* ---- lightning: the shape of the flash in time (0 to 1), the strike, the fork ---- */
function gysPulse(ms){   // two quick flickers, about 230 ms in all
  if(ms<0||ms>250)return 0;
  if(GYS.reduced)return ms<200?Math.sin(Math.PI*ms/200)*.5:0;
  const tri=(a,b,c,p)=>ms<a||ms>c?0:ms<b?(ms-a)/(b-a)*p:(c-ms)/(c-b)*p;
  return Math.max(tri(0,25,75,.62),tri(105,130,230,1),ms>230?(250-ms)/20*.08:0)}
function gysStrike(opt){
  const t=G.time,o=opt||{},far=o.far!==undefined?o.far:Math.random(),C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0);
  const az=o.az!==undefined?o.az:(Math.random()<.7?LA+(Math.random()-.5)*2.1:Math.random()*Math.PI*2);
  const fork=o.fork!==undefined?o.fork:Math.random()<.55,seed=(Math.random()*1e6)|0;
  GYS.strike={t0:t,az,far,fork,seed,amp:(1-.35*far)*(GYS.reduced?.7:1),pts:null};GYS.strikes++;
  const delay=o.delay!==undefined?o.delay:1+far*2;   // far strikes: later and quieter thunder
  GYS.thunderQ.push({at:t+delay,vol:.2*(1-.55*far),far});
  GYS.next=t+6+Math.random()*14}
function gysFlash(){const s=GYS.strike;if(!s)return 0;const ms=GYS.hold!==null?GYS.hold:(G.time-s.t0)*1000;if(GYS.hold===null&&ms>300)GYS.strike=null;return gysPulse(ms)*s.amp}
function gysFork(s,x,y0,y1){   // a jagged bolt with a few branches; the points are made once per strike
  if(s.pts)return s.pts;let sd=s.seed||1;const r=()=>{sd=(sd*1664525+1013904223)>>>0;return sd/4294967296},segs=[];
  const P=(x0,y,w,main,d)=>{let px=x0,py=y;const n=main?11:5;for(let i=0;i<n;i++){const nx=px+(r()-.5)*w*(main?1:1.4)+(main?0:d*3),ny=Math.min(py+(y1-y0)/(main?10:7)*(.7+r()*.6),y1);segs.push([px,py,nx,ny,main?1:.5]);px=nx;py=ny;if(py>=y1)break;if(main&&i>2&&i<8&&r()<.3)P(px,py,w*.6,false,r()<.5?-1:1)}};
  P(x,y0,26,true,0);s.pts=segs;return segs}
/* ---- sound: a rolling rumble with a slow start (nothing sudden), and the rain loop ---- */
function gysRumble(vol){
  GYS.sounds++;if(!AC||G.mute||!SNDOPT.amb||!NB||!MASTER)return;vol*=SNDOPT.amb*(typeof SFXM==='number'?SFXM:1)*4;const t0=AC.currentTime;   // x4: low-passed noise is quiet
  const layer=(delay,f0,f1,a,att,dur)=>{const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),t=t0+delay;s.buffer=NB;s.loop=true;f.type='lowpass';f.Q.value=.9;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol*a,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(MASTER);s.start(t,Math.random()*.9);s.stop(t+dur+.1)};
  layer(0,260,60,1,.45,3.2);layer(.5+Math.random()*.3,200,45,.8,.6,3.6);layer(1.3+Math.random()*.5,150,40,.55,.7,3.4);
  const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(58,t0);o.frequency.exponentialRampToValueAtTime(32,t0+3.4);g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol*.12,t0+.7);g.gain.exponentialRampToValueAtTime(.0001,t0+3.4);o.connect(g);g.connect(MASTER);o.start(t0);o.stop(t0+3.5)}
function gysRainSound(rain,dt){
  const want=gysOn()&&!G.mute&&SNDOPT.amb&&AC&&MASTER&&typeof SMP!=='undefined'&&SMP.rain_loop?rain*.1*SNDOPT.amb:0;
  if(!GYS.rainSrc){if(want<=.001)return;const s=AC.createBufferSource(),g=AC.createGain();s.buffer=SMP.rain_loop;s.loop=true;g.gain.value=0;s.connect(g);g.connect(MASTER);s.start();GYS.rainSrc=s;GYS.rainG=g}
  const g=GYS.rainG.gain,cur=g.value,nv=cur+(want-cur)*Math.min(1,dt/1.5);g.value=nv;
  if(want<=.001&&nv<.002){try{GYS.rainSrc.stop()}catch(e){}try{GYS.rainSrc.disconnect();GYS.rainG.disconnect()}catch(e){}GYS.rainSrc=GYS.rainG=null}}
/* ---- the update: strikes, thunder, the rain cycle, the rain sound ---- */
{const _u=update;update=function(dt){
  try{
    if(gysOn()){
      const t=G.time;
      if(!GYS.next)GYS.next=t+5+Math.random()*8;
      if(t>GYS.next&&!GYS.strike)gysStrike();
      for(let i=GYS.thunderQ.length-1;i>=0;i--)if(t>=GYS.thunderQ[i].at){const q=GYS.thunderQ.splice(i,1)[0];GYS.thunders++;gysRumble(q.vol)}
      GYS.pt+=Math.min(dt||0,.2);
      const c=GYS.pt%GYS.CYC,a=c-GYS.CAL;
      GYS.rain=GYS.force!==null?(GYS.force>=0?1:0):gysSm(0,20,a)*(1-gysSm(GYS.RAINT-20,GYS.RAINT,a));
      if(GYS.rain<.01)GYS.rain=0;
    }else{GYS.rain=0;GYS.strike=null;GYS.thunderQ.length=0;GYS.next=0;GYS.f=0}
    gysRainSound(GYS.rain,Math.min(dt||0,.2));
  }catch(e){console.error('GYS',e)}
  return _u.apply(this,arguments)}}
if(typeof WIND_AMT!=='undefined'&&!WIND_AMT[GYS.ID])WIND_AMT[GYS.ID]=.55;   // a light wind
/* ---- the colour of the air: a greenish-grey dusk instead of the warm mist ---- */
{const _w=weatherNow;weatherNow=function(){const w=_w.apply(this,arguments);
  if(LEVEL===GYS.ID&&!GYS.off&&w&&w.id==='fog')return Object.assign({},w,{n:'Stormclouds',fog:.022,haze:.34,mix:.44,col:[112,130,118],text:'Heavy stormclouds are piling over the graveyard. The air is green and still, and thunder walks about somewhere beyond the yews.'});
  return w}}
/* ---- the sky, the ground and the lamps: the next slice of the panorama; in a flash the light is raised for that frame and put back after ---- */
{const _r=render3D;render3D=function(){
  if(!gysOn())return _r.apply(this,arguments);
  if(!GYS.ready)try{gysBuild()}catch(e){console.error('GYS build',e)}
  const f=gysFlash();GYS.f=f;
  if(GYS.ready)gysPanoStep();
  const a0=G.amb;
  G.amb=(a0||0)*.9+f*.4;
  if(f>0)for(const L of LIGHTS){if(L.kI0===undefined)L.kI0=L.kI||1;L.kI=L.kI0*(1+.9*f)}   // the crypt doors and the ghost-lights glow in the flash
  else for(const L of LIGHTS)if(L.kI0!==undefined){L.kI=L.kI0;L.kI0=undefined}
  try{return _r.apply(this,arguments)}finally{G.amb=a0}}}
/* ---- the picture: cool wash, brow, sheet glow, fork, rain, leaves (all inside the 3D view, over the sprites) ---- */
{const _d=drawWorld;drawWorld=function(){
  const r=_d.apply(this,arguments);
  if(gysOn())try{gysOverlay()}catch(e){console.error('GYS overlay',e)}
  return r}}
function gysOverlay(){
  const t=G.time,f=GYS.f||0,hh=typeof HH==='number'?HH:105,s=GYS.strike;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb(214,226,218)';ctx.fillRect(0,0,420,210);   // cooler, greener, a little darker
  let g;
  ctx.globalCompositeOperation='lighter';
  if(f>.01){   // the clouds light up from inside, and a cold wash lies over the yard
    const C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0);
    g=ctx.createLinearGradient(0,0,0,210);g.addColorStop(0,`rgba(132,152,210,${.26*f})`);g.addColorStop(.55,`rgba(104,128,176,${.12*f})`);g.addColorStop(1,`rgba(84,104,144,${.06*f})`);ctx.fillStyle=g;ctx.fillRect(0,0,420,210);
    if(s){const d=((s.az-LA)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI,inView=Math.abs(d)<1.3,bx=210*(1+Math.tan(Math.max(-1.3,Math.min(1.3,d)))/PL);
      const gx=Math.max(-60,Math.min(480,bx)),rr=130+80*(1-s.far),rg=ctx.createRadialGradient(gx,hh*.38,4,gx,hh*.38,rr);rg.addColorStop(0,`rgba(190,205,255,${.5*f})`);rg.addColorStop(.5,`rgba(130,150,215,${.2*f})`);rg.addColorStop(1,'rgba(90,110,170,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,420,hh+20);
      if(s.fork&&inView){const segs=gysFork(s,bx,0,hh-14),ph=GYS.hold!==null?GYS.hold:(t-s.t0)*1000,vis=ph<85||(ph>105&&ph<235)?1:.35;
        ctx.lineCap='round';ctx.lineJoin='round';
        for(const [w,col] of [[6,`rgba(120,140,255,${.14*vis*f})`],[3,`rgba(190,205,255,${.4*vis*f})`],[1.2,`rgba(246,248,255,${.95*vis})`]])
          for(const main of [1,.5]){ctx.strokeStyle=col;ctx.lineWidth=w*main;ctx.beginPath();for(const sg of segs)if(sg[4]===main){ctx.moveTo(sg[0],sg[1]);ctx.lineTo(sg[2],sg[3])}ctx.stroke()}}}
  }
  ctx.globalCompositeOperation='source-over';
  if(GYS.rain>0)gysRain(GYS.rain,t);
  gysLeaves(t);
  ctx.restore()}
function gysRain(a,t){   // thin slanted streaks, at most 76 of them, no splashes
  const n=Math.round((GYS.reduced?40:76)*a);if(n<1)return;
  ctx.lineWidth=.8;
  for(let b=0;b<2;b++){ctx.strokeStyle=b?'rgba(176,192,206,.15)':'rgba(196,210,222,.24)';ctx.beginPath();
    for(let i=b;i<n;i+=2){const sp=300+hash2(i,1,81)*180,ln=7+hash2(i,2,82)*6,ph=hash2(i,4,84)*260,pos=ph+t*sp,cyc=Math.floor(pos/260),y=(pos%260)-25,x=hash2(i,cyc,85)*480-30-y*.22;ctx.moveTo(x,y);ctx.lineTo(x-ln*.22,y+ln)}
    ctx.stroke()}}
function gysLeaves(t){   // a few dry leaves blown across the view now and then (each is on screen for about half of its cycle)
  const n=GYS.reduced?2:6;
  for(let i=0;i<n;i++){
    const per=9+hash2(i,7,91)*9,u=((t+hash2(i,8,92)*per)%per)/per,life=.5;if(u>life)continue;const k=u/life,
      x=440-k*500+Math.sin(k*9+i)*10,y=100+hash2(i,9,93)*90+Math.sin(k*13+i*2)*14+k*18;
    ctx.save();ctx.translate(x,y);ctx.rotate(k*14+i);ctx.fillStyle=['#74603a','#8a5a2c','#66683a'][i%3];ctx.globalAlpha=.75*Math.min(1,k*8,(1-k)*8);ctx.fillRect(-2,-1,4,2.2);ctx.restore()}}
