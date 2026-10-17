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
{const _af=addFloat;addFloat=function(x,y,text,col){
  const T=String(text);
  if(/^\+\d+$/.test(T)&&y>=240){ // a heal on a hero: the part of the red that is healed turns ice blue, then drains away
    let bi=0,bd=1e9;for(let i=0;i<4;i++){const dx=Math.abs(portraitX(i)+19-x);if(dx<bd){bd=dx;bi=i}}const h=G.heroes[bi];
    if(h&&bd<24){const amt=+T.slice(1),oldM=clamp(1-(h.hp-amt)/h.max,0,1),newM=clamp(1-h.hp/h.max,0,1);if(oldM>newM+.005)HEAL[bi]={t:0,oldM,newM}}}
  if(col==='#ffd76a'&&/^\d+$/.test(T)){ // a hit on a creature: a splat where it stands, and a thump
    const d=+T,big=d>=40;IMP_QUIET=G.time;impPlay(big,1,big?.9:.8);G.floats.push({x,y,text:T,col,t:0,splat:1,R:Math.min(24,11+d*.25),seed:d*31+Math.floor(x)});return}
  if(col==='#ff6a5a'&&/^-\d+$/.test(T)){ // a hit on a hero: a splat on the portrait, coloured by what ails them
    let bi=0,bd=1e9;for(let i=0;i<4;i++){const dx=Math.abs(portraitX(i)+19-x);if(dx<bd){bd=dx;bi=i}}
    const d=-T;IMP_QUIET=G.time;impPlay(d>=15,.82,.95);HSPL[bi]={t:0,n:String(d),tint:impTint(bi),seed:d*17+bi};return}
  return _af.apply(this,arguments)}}
{const _df=drawFloats;drawFloats=function(dt){
  for(let i=G.floats.length-1;i>=0;i--){const f=G.floats[i];if(!f.splat)continue;f.t+=dt;if(f.t>1.1){G.floats.splice(i,1);continue}
    drawSplat(f.x,f.y-4-f.t*10,f.R*(1+Math.min(.25,f.t*2)*(f.t<.12?1:0)),f.text,['#e83a2a','#8a1410'],f.seed,clamp(1.5-f.t,0,1))}
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
