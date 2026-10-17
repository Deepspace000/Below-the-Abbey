/* ==========================================================================
   IMPACTS. A real thump when a blow lands (Kenney's Impact Sounds, CC0: assets/snd), and a red ink splat with the damage number: on the creature that was hit, and
   on the portrait of a hero who is hurt. A hero's splat takes the colour of what ails them: green when poisoned, and other shades for the other afflictions.
   ========================================================================== */
const IMP_N={m:5,h:5};
function impLoad(){if(!AC||impLoad.done)return;impLoad.done=1;for(const [k,pre] of [['m','impactPunch_medium_00'],['h','impactPunch_heavy_00']])for(let i=0;i<IMP_N[k];i++)fetch('assets/snd/'+pre+i+'.ogg?v='+VERSION).then(r=>r.arrayBuffer()).then(b=>AC.decodeAudioData(b)).then(buf=>{SMP['imp_'+k+i]=buf}).catch(()=>{})}
function impPlay(heavy,rate,vol){
  if(!AC||G.mute||!SNDOPT.combat)return false;impLoad();const k=heavy?'h':'m',b=SMP['imp_'+k+Math.floor(Math.random()*IMP_N[k])];if(!b)return false;
  const s=AC.createBufferSource(),g=AC.createGain();s.buffer=b;s.playbackRate.value=rate*(.94+Math.random()*.12);g.gain.value=vol*SNDOPT.combat;s.connect(g);g.connect(MASTER);s.start();return true}
let IMP_QUIET=0; // the old synthesised hit and hurt sounds stay silent while a real thump is playing
{const _s=sfx;sfx=function(n){if((n==='hit'||n==='hurt')&&IMP_QUIET>G.time-.25&&AC)return;return _s.apply(this,arguments)}}
const AFFL_TINT={poisoned:['#58d048','#1a6a14'],foodpoison:['#a0d040','#4a6a10'],bleeding:['#d01830','#6a0814'],fever:['#f09a30','#9a4a10'],frostbitten:['#8ad0f0','#2a6a9a'],haunted:['#a88ae8','#4a3a8a'],cursed:['#9a4ab8','#4a1a60'],graverot:['#8a9a40','#3a4a14'],tomblung:['#a0a890','#4a5040'],stung:['#e8c040','#8a6a10'],sunstroke:['#f0d860','#a08a20'],shaken:['#d8cccc','#7a6a6a'],sleepless:['#6a7ad0','#2a3a7a'],hangover:['#c8a860','#6a5a24'],fleas:['#b08060','#5a3a24'],poorly:['#80b890','#305a40'],dehydrated:['#d8b078','#8a6a34'],sandblind:['#e0b870','#8a6a30'],exhausted:['#a8a8b8','#505060']};
function impTint(hi){const o=afflList().filter(e=>(e.hi===hi||e.hi===-1)&&AFFL_TINT[e.id]);if(!o.length)return ['#e83a2a','#8a1410'];const p=o.find(e=>e.id==='poisoned')||o[0];return AFFL_TINT[p.id]}
function drawSplat(cx,cy,R,n,tint,seed,alpha){
  ctx.save();ctx.globalAlpha=alpha;let s=(seed*7919+13)%2147483647||13;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  const g=ctx.createRadialGradient(cx-R*.1,cy-R*.15,R*.1,cx,cy,R*1.3);g.addColorStop(0,tint[0]);g.addColorStop(1,tint[1]);
  ctx.beginPath();for(let i=0;i<=26;i++){const a=i/26*TAU,rr=R*(1+(rnd()-.5)*.55);const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();
  ctx.fillStyle=g;ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='rgba(30,4,4,.9)';ctx.stroke();
  for(let i=0;i<7;i++){const a=rnd()*TAU,d=R*1.05+rnd()*R*.45;ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,1+rnd()*2,0,TAU);ctx.fillStyle=tint[1];ctx.fill();ctx.stroke()}
  ctx.fillStyle='rgba(255,255,255,.28)';ctx.beginPath();ctx.ellipse(cx-R*.35,cy-R*.4,R*.3,R*.17,-.5,0,TAU);ctx.fill();
  ctx.font=`bold ${Math.round(R*.95)}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='rgba(30,4,4,.95)';ctx.strokeText(n,cx,cy+1);ctx.fillStyle='#fff4e8';ctx.fillText(n,cx,cy+1);ctx.restore()}
const HSPL=[],HEAL=[];
const GOLD_TINT=['#fff070','#c88a10'];
{const _af=addFloat;addFloat=function(x,y,text,col,hcrit){
  const T=String(text);
  if(/^\+\d+$/.test(T)&&y>=240){ // a heal on a hero: the part of the red that is healed turns ice blue, then drains away
    let bi=0,bd=1e9;for(let i=0;i<4;i++){const dx=Math.abs(portraitX(i)+19-x);if(dx<bd){bd=dx;bi=i}}const h=G.heroes[bi];
    if(h&&bd<24){const amt=+T.slice(1);if(hcrit){HSPL[bi]={t:0,n:'+'+amt,tint:GOLD_TINT,seed:amt*13+bi};IMP_QUIET=G.time}const oldM=clamp(1-(h.hp-amt)/h.max,0,1),newM=clamp(1-h.hp/h.max,0,1);if(oldM>newM+.005)HEAL[bi]={t:0,oldM,newM}}}
  if(col==='#ffd76a'&&/^\d+$/.test(T)){ // a hit on a creature: a splat where it stands, and a thump
    const d=+T,crit=!!G._critFlag;G._critFlag=false;const big=d>=40||crit;IMP_QUIET=G.time;impPlay(big,crit?.9:1,big?.95:.8);G.floats.push({x,y,text:T,col,t:0,splat:1,crit,R:crit?Math.min(19,10+d*.1):Math.min(15,7+d*.1),seed:d*31+Math.floor(x)});return}
  if(col==='#ff6a5a'&&/^-\d+$/.test(T)){ // a hit on a hero: a splat on the portrait, coloured by what ails them
    let bi=0,bd=1e9;for(let i=0;i<4;i++){const dx=Math.abs(portraitX(i)+19-x);if(dx<bd){bd=dx;bi=i}}
    const d=-T;IMP_QUIET=G.time;impPlay(d>=15,.82,.95);HSPL[bi]={t:0,n:String(d),tint:impTint(bi),seed:d*17+bi};return}
  return _af.apply(this,arguments)}}
{const _df=drawFloats;drawFloats=function(dt){
  for(let i=G.floats.length-1;i>=0;i--){const f=G.floats[i];if(!f.splat)continue;f.t+=dt;if(f.t>.75){G.floats.splice(i,1);continue}
    drawSplat(f.x+(f.seed%7-3)*3,f.y+24+f.t*8,f.R*(1+(f.t<.1?.2:0)),f.text,f.crit?GOLD_TINT:['#e83a2a','#8a1410'],f.seed,clamp(1.2-f.t*1.6,0,1))} // low on the body, drifting down, gone before it could reach the face
  const keep=G.floats.filter(f=>f.splat);G.floats=G.floats.filter(f=>!f.splat);_df.apply(this,arguments);G.floats=G.floats.concat(keep)}}
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);try{if(G.state!=='play'||G.inv.open)return;
  // a heal in progress: the healed band shows the old red, turns ice blue, then fades as the red settles lower
  for(let i=0;i<4;i++){const e=HEAL[i];if(!e)continue;e.t+=dt||.016;if(e.t>1.5){HEAL[i]=null;continue}
    const x=portraitX(i),y0=232,w=38,hh=58,top=y0+hh-e.oldM*hh,bot=y0+hh-e.newM*hh,k=clamp(e.t/.45,0,1),fade=e.t<.55?1:clamp(1-(e.t-.55)/.9,0,1);
    ctx.save();ctx.beginPath();ctx.rect(x,y0,w,hh);ctx.clip();const rr=190+(130-190)*k,gg=20+(225-20)*k,bb=16+(255-16)*k;
    ctx.globalAlpha=fade;ctx.fillStyle=`rgba(${rr|0},${gg|0},${bb|0},.78)`;ctx.fillRect(x,top,w,bot-top);
    ctx.fillStyle=`rgba(210,245,255,${.55*k})`;ctx.fillRect(x,top,w,1.4);
    if(e.t>.3&&e.t<.9){ctx.globalAlpha=.5*(1-Math.abs(e.t-.6)/.3);ctx.fillStyle='#e8fbff';for(let q=0;q<5;q++)ctx.fillRect(x+4+((q*7+Math.floor(e.t*20)*3)%30),top+((q*5)%Math.max(2,bot-top)),1.5,1.5)}
    ctx.restore()}
  // the portrait fills with red from the bottom as a hero is hurt: the state of the party at a glance
  for(let i=0;i<4;i++){const h=G.heroes[i];if(!h||!h.alive||G.cut&&0)continue;const miss=clamp(1-h.hp/h.max,0,1);if(miss<=.01)continue;const x=portraitX(i),y0=232,w=38,hh=58,fh=hh*miss;
    ctx.save();ctx.beginPath();ctx.rect(x,y0,w,hh);ctx.clip();const g=ctx.createLinearGradient(0,y0+hh-fh,0,y0+hh);g.addColorStop(0,'rgba(190,20,16,.40)');g.addColorStop(1,'rgba(120,6,6,.62)');ctx.fillStyle=g;ctx.fillRect(x,y0+hh-fh,w,fh);
    ctx.fillStyle='rgba(255,90,70,.55)';ctx.fillRect(x,y0+hh-fh,w,1.2);ctx.restore()}
  for(let i=0;i<4;i++){const h=HSPL[i];if(!h)continue;h.t+=dt||.016;if(h.t>1.6){HSPL[i]=null;continue}
    drawSplat(portraitX(i)+19,(G.state==='play'?268:232)-Math.min(h.t,.3)*6,10+Math.max(0,.25-h.t)*24,h.n,h.tint,h.seed,clamp(1.9-h.t,0,1))}}catch(e){}}}
/* ==========================================================================
   BOWS AND SPELLS. A bow twangs and its arrow whooshes away (with a streak across the view), and a spell that hits bursts on its target: a fiery explosion with a deep boom, or
   a shatter of ice. The thump of the hit follows.
   ========================================================================== */
function sndBow(){if(!AC||G.mute||!SNDOPT.combat)return;SFXM=SNDOPT.combat;tone(240,150,.2,'triangle',.22);tone(620,330,.11,'sine',.14);tone(120,90,.12,'sine',.18,.01);nz(.32,.2,'bandpass',500,4200);nz(.12,.12,'highpass',2500,6000)}
function sndBoom(frost){if(!AC||G.mute||!SNDOPT.combat)return;SFXM=SNDOPT.combat;
  if(frost){tone(110,45,.35,'sine',.3);[3136,3951,4699,5274].forEach((f,i)=>tone(f,f*.97,.28,'sine',.07,.02+i*.035));nz(.25,.22,'highpass',3500,7000);return}
  tone(90,30,.55,'sine',.5);tone(160,50,.35,'sawtooth',.12);nz(.6,.55,'lowpass',2200,90);nz(.35,.25,'bandpass',900,200);for(let i=0;i<4;i++)nz(.08,.12,'highpass',2500,6000)}
const FXS=[];
{const _ha=heroAttack;heroAttack=function(i){let shot=null;try{const w=heroWeapon(G.heroes[i]);if(w&&w.ranged>1){const f=frontEnemy(w.ranged);if(f){shot=f.e;sndBow();FXS.push({kind:'arrow',t:0,x0:210,y0:206,e:f.e})}}}catch(e){}return _ha.apply(this,arguments)}}
let SPELL_KIND=null,SPELL_T=0;
{const _s2=sfx;sfx=function(n){if((n==='fire'||n==='frost')&&G.state==='play'&&!G.cut){SPELL_KIND=n;SPELL_T=performance.now()}return _s2.apply(this,arguments)}}
{const _af2=addFloat;addFloat=function(x,y,text,col,hc){
  if(col==='#ffd76a'&&/^\d+$/.test(String(text))&&SPELL_KIND&&performance.now()-SPELL_T<700){const frost=SPELL_KIND==='frost';SPELL_KIND=null;
    FXS.push({kind:frost?'ice':'blast',t:0,x,y,seed:Math.floor(x*7+y)});sndBoom(frost)}
  return _af2.apply(this,arguments)}}
{const _ui3=ui;ui=function(dt){_ui3.apply(this,arguments);try{if(G.state!=='play'||G.inv.open)return;const d=dt||.016;
  for(let i=FXS.length-1;i>=0;i--){const f=FXS[i];f.t+=d;
    if(f.kind==='arrow'){const T=.16;if(f.t>T+.05){FXS.splice(i,1);continue}const e=f.e,tx=e&&e.sx?e.sx:210,ty=e&&e.sy?e.sy:100,p=clamp(f.t/T,0,1),x1=f.x0+(tx-f.x0)*p,y1=f.y0+(ty-f.y0)*p,x0=f.x0+(tx-f.x0)*Math.max(0,p-.35),y0=f.y0+(ty-f.y0)*Math.max(0,p-.35);
      ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.lineCap='round';ctx.strokeStyle='rgba(230,220,190,.85)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();continue}
    const T=.6;if(f.t>T){FXS.splice(i,1);continue}const p=f.t/T,cx=f.x,cy=f.y+8;let s=(f.seed*7919+5)%2147483647||5;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation='lighter';
    if(f.kind==='blast'){const R=10+p*38,a=1-p;let g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,`rgba(255,250,200,${a})`);g.addColorStop(.35,`rgba(255,170,40,${a*.9})`);g.addColorStop(1,'rgba(200,40,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
      ctx.strokeStyle=`rgba(255,200,120,${a*.8})`;ctx.lineWidth=2.5*(1-p)+.5;ctx.beginPath();ctx.arc(cx,cy,R*1.15,0,TAU);ctx.stroke();
      for(let k=0;k<14;k++){const an=rnd()*TAU,dd=R*(.5+rnd()*.9);ctx.fillStyle=`rgba(255,${150+rnd()*90|0},40,${a})`;ctx.beginPath();ctx.arc(cx+Math.cos(an)*dd,cy+Math.sin(an)*dd-p*8,1+rnd()*2.4*(1-p),0,TAU);ctx.fill()}}
    else{const R=8+p*30,a=1-p;let g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,`rgba(235,252,255,${a})`);g.addColorStop(.5,`rgba(120,200,255,${a*.7})`);g.addColorStop(1,'rgba(60,120,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
      for(let k=0;k<12;k++){const an=k/12*TAU+rnd()*.3,d1=R*(.3+p*.9),d2=d1+6+rnd()*9;ctx.strokeStyle=`rgba(200,240,255,${a})`;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*d1,cy+Math.sin(an)*d1);ctx.lineTo(cx+Math.cos(an)*d2,cy+Math.sin(an)*d2);ctx.stroke()}}
    ctx.restore()}}catch(e){}}}
/* a miss: a lazy swing through empty air, a rising and falling whoosh with no thump at all; a missed arrow thunks into the wall behind instead */
let BOW_T=0;
function sndMiss(){if(!AC||G.mute||!SNDOPT.combat)return;SFXM=SNDOPT.combat;
  if(performance.now()-BOW_T<400){tone(170,80,.09,'triangle',.22,.05);nz(.05,.2,'bandpass',1800,700,.05);tone(90,60,.12,'sine',.12,.06);return} // an arrow into the wall
  nz(.3,.22,'bandpass',350,1700);nz(.3,.18,'bandpass',1700,300,.14);tone(260,140,.28,'sine',.05,.02);nz(.05,.07,'highpass',3000,5000,.34)}
{const _s3=sfx;sfx=function(n){if(n==='miss'&&AC&&!G.mute)return sndMiss();return _s3.apply(this,arguments)}}
{const _ha2=heroAttack;heroAttack=function(i){try{const w=heroWeapon(G.heroes[i]);if(w&&w.ranged>1)BOW_T=performance.now()}catch(e){}return _ha2.apply(this,arguments)}}
