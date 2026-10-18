/* ==========================================================================
   POWER ANIMATIONS. A power looks and sounds different to a plain attack: a glowing blade sweep for the sword powers, claws, fists, arrows, fire, ice,
   lightning, holy light, shock rings, poison clouds, shadow, heal flashes and warding auras. The kind is chosen from the power's name and type.
   Everything is drawn over the view as light, so it needs no pictures. heroSpecial is wrapped: the target and the party's health are noted first,
   and the animation starts only if the power was really used.
   ========================================================================== */
const PFX=[];
const PFX_RULES=[ // [pattern on the power name, kind]; the first match wins
 [/resurrect|rise/i,'rise'],[/heal|hands|purify|wholeness|eat anything|mend|restor|elixir|blessing|life/i,'heal'],
 [/shield|ward|aura|banner|standard|courage|armor|wall|mirror|bark|sanctuary|mantra of peace|avatar|frenzy ?$|peace/i,'aura'],
 [/smite|wrath|judg|holy|divine|turn undead|angel|light|sacred/i,'holy'],
 [/meteor|fireball|fire|flame|breath|burn|inferno/i,'fire'],[/frost|nova|ice|freez|blizzard/i,'ice'],
 [/lightning|chain|storm|lance|disintegr|rift|banish|time stop|surge/i,'bolt'],
 [/arrow rain|rain of|storm|volley/i,'rain'],[/arrow|shot|rapid|triple|perfect|piercing|pinning|dragonbone|snipe/i,'arrow'],
 [/roar|shout|cry|wail|bleat|howl|challenge|earthshatter|shatter|stampede|charge|quake|thunder/i,'shock'],
 [/poison|cloud|wasp|venom|swarm|smoke|bomb/i,'gas'],
 [/whirlwind|flurry|cleave|thousand|cyclone/i,'spin'],[/claw|rend|bear|bloodlust|savage|maul|rake/i,'claw'],
 [/fist|palm|pressure|punch|butt|strike|stomp/i,'fists'],
 [/vanish|shadow|night|terror|death|assassin|mark|nerve|garrote|heist|pickpocket|befuddle|polymorph|hold|confus/i,'shadow']];
function pfxKind(P){
  for(const [re,k] of PFX_RULES)if(re.test(P.name||''))return k;
  const t=P.type;if(t==='melee'||t==='twin'||t==='backstab'||t==='multi'||t==='drain')return 'slash';
  if(t==='shot'||t==='ranged'||t==='volley')return 'arrow';if(t==='aoe')return 'shock';if(t==='buff')return 'aura';if(t==='healx'||t==='revive')return 'heal';
  if(t==='daze')return 'shock';
  return 'slash';
}
const PFX_TINT={slash:'#ffffff',heal:'#9affb0',rise:'#ffe9a0',aura:'#ffe9a0',holy:'#fff4c0',fire:'#ff9a30',ice:'#a8e8ff',bolt:'#b8c8ff',rain:'#e8e0c0',arrow:'#f4eed0',shock:'#ffd88a',gas:'#9ae060',spin:'#ffffff',claw:'#ff6a50',fists:'#ffd070',shadow:'#a070e0'};
function pfxSound(k){
  if(!AC||G.mute||!SNDOPT.combat)return;SFXM=SNDOPT.combat;
  if(k==='slash'||k==='spin'||k==='claw'){nz(.14,.3,'bandpass',900,6000,.02);nz(.1,.18,'highpass',4000,8000,.1);tone(1500,3200,.22,'sine',.06,.03);return}
  if(k==='heal'||k==='rise'||k==='aura'){[523,659,784,1047].forEach((f,i)=>tone(f,f,.5,'sine',.1,i*.06));return}
  if(k==='holy'){tone(392,392,.7,'sine',.1);tone(784,784,.7,'sine',.08,.03);nz(.4,.15,'highpass',3000,6000,.05);return}
  if(k==='bolt'){nz(.25,.4,'highpass',2000,8000);tone(120,40,.3,'sawtooth',.2);return}
  if(k==='fire'){sndBoom(false);return}if(k==='ice'){sndBoom(true);return}
  if(k==='arrow'||k==='rain'){sndBow();return}
  if(k==='shock'){tone(80,35,.5,'sine',.4);nz(.4,.3,'lowpass',1600,100);return}
  if(k==='gas'){nz(.6,.2,'bandpass',700,300);return}
  if(k==='fists'){for(let i=0;i<3;i++){tone(180,60,.1,'sine',.3,i*.07);nz(.06,.18,'lowpass',2200,300,i*.07)}return}
  if(k==='shadow'){tone(300,70,.5,'sawtooth',.1);nz(.4,.14,'bandpass',500,150);return}
}
function pfxTargets(P,pre){
  const out=[];const ar=Array.isArray(P.aim)||P.aim==='all'||P.type==='aoe'||P.type==='daze';
  if(ar){for(const e of G.enemies){if(e.hp<=0&&!e.flash)continue;if(!e.sx)continue;if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=(P.range||(Array.isArray(P.aim)?P.aim[1]:6)))out.push([e.sx,e.sy-8])}}
  else if(pre)out.push([pre.sx||210,(pre.sy||110)-8]);
  if(!out.length)out.push([210,100]);
  return out.slice(0,5);
}
{const _hs=heroSpecial;heroSpecial=function(i){
  let P=null,pre=null,hp0=null;
  try{if(G.state==='play'){P=curPower(i);if(P&&P.type!=='spell'&&!P.pas){const f=frontEnemy(P.range||(Array.isArray(P.aim)?4:4));pre=f&&f.e;hp0=G.heroes.map(h=>h.hp)}}}catch(e){P=null}
  const r=_hs.apply(this,arguments);
  try{if(r&&P&&hp0&&P.act!==false){const k=pfxKind(P),col=P.col||PFX_TINT[k]||'#fff';
    pfxSound(k);
    if(k==='heal'||k==='rise'||k==='aura'){const who=[];G.heroes.forEach((h,j)=>{if(h.alive&&(k==='aura'||h.hp>hp0[j]||k==='rise'))who.push(j)});if(!who.length)who.push(i);for(const j of who)PFX.push({k,t:0,x:portraitX(j)+19,y:250,col,seed:j*13+3,hud:1});if(k==='rise')PFX.push({k:'holy',t:0,x:210,y:100,col,seed:5})}
    else{const T=pfxTargets(P,pre);T.forEach((p,n)=>PFX.push({k,t:-n*.07,x:p[0],y:p[1],col,seed:Math.floor(p[0]*3+p[1]+n*11),tw:T.length>1}))}}}catch(e){console.error(e)}
  return r}}
/* a crescent blade sweep: the glow fills in along the arc and then fades */
function pfxCrescent(cx,cy,R,a0,a1,th,col,alpha){
  const N=18;ctx.beginPath();for(let n=0;n<=N;n++){const a=a0+(a1-a0)*n/N,w=Math.sin(n/N*Math.PI);ctx.lineTo(cx+Math.cos(a)*(R+th*w),cy+Math.sin(a)*(R+th*w)*.8)}
  for(let n=N;n>=0;n--){const a=a0+(a1-a0)*n/N;ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R*.8)}ctx.closePath();ctx.fillStyle=col;ctx.globalAlpha=alpha;ctx.fill();ctx.globalAlpha=1}
/* painted, ragged effect pictures (assets/fx_*.png, light on black, so they are added over the view) */
const PFX_IMG={slash:'slash',spin:'slash',claw:'claw',fire:'fire',bolt:'bolt',holy:'holy',ice:'ice',gas:'gas',shadow:'shadow',heal:'heal',rise:'heal',aura:'heal'};
for(const n of new Set(Object.values(PFX_IMG)))loadImg('fx_'+n,'assets/fx_'+n+'.png');
function pfxPicture(f,p,rnd){
  const im=IMG['fx_'+PFX_IMG[f.k]];if(!im||!im.width)return false;const k=f.k,x=f.x,y=f.y;
  const inn=Math.min(1,p*5),out=Math.max(0,1-Math.max(0,p-.45)/.55),al=inn*out;
  let sz=(k==='heal'||k==='aura'||k==='rise')?46:k==='holy'?86:k==='bolt'?80:k==='ice'||k==='fire'?(f.tw?54:76):k==='gas'||k==='shadow'?64:60;
  const grow=.55+p*.65,jx=(rnd()-.5)*(k==='slash'||k==='claw'?3:1.4),jy=(rnd()-.5)*2;
  const draw=(rot,mul,al2)=>{ctx.save();ctx.translate(x+jx,y+jy);ctx.rotate(rot);ctx.globalAlpha=Math.max(0,Math.min(1,al2));const w=sz*grow*mul;ctx.drawImage(im,-w/2,-w/2,w,w);ctx.restore()};
  const sd=f.seed||1,rot0=(sd%7-3)*.08;
  if(k==='spin'){for(let n=0;n<3;n++)draw(p*5+n*2.1,1-n*.12,al*.9)}
  else if(k==='claw'){draw(rot0-.1,1,al);draw(rot0-.1,.8,al*.5)}
  else if(k==='slash'){draw(rot0,1.15,al);draw(rot0+.12,.7,al*.7)}
  else if(k==='holy'){draw(0,1.1,al);draw(0,.6,al*.6)}
  else if(k==='aura'){draw(0,1.4,al*.7);draw(p*2,1,al*.5)}
  else draw(rot0*2+p*(k==='gas'||k==='shadow'?1.2:.3),1,al);
  /* ragged extras: torn sparks and little shards so it never looks clean */
  const col=PFX_TINT[k]||'#fff',n=k==='slash'||k==='claw'?9:6;ctx.lineCap='butt';
  for(let m=0;m<n;m++){const an=rnd()*TAU,d1=(8+rnd()*20)*(.4+p),d2=d1+3+rnd()*9;ctx.strokeStyle=hexA(col,out*(.5+rnd()*.5));ctx.lineWidth=.8+rnd()*1.6;const mx=x+Math.cos(an)*d1,my=y+Math.sin(an)*d1*.8;ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo((mx+x+Math.cos(an)*d2)/2+(rnd()-.5)*4,(my+y+Math.sin(an)*d2*.8)/2+(rnd()-.5)*4);ctx.lineTo(x+Math.cos(an)*d2,y+Math.sin(an)*d2*.8);ctx.stroke()}
  return true}
function pfxDraw(f,p,rnd){
  if(pfxPicture(f,p,rnd))return;
  const x=f.x,y=f.y,a=1-p,k=f.k,col=f.col;
  if(k==='slash'||k==='spin'||k==='claw'){
    const reveal=Math.min(1,p*3),fade=Math.max(0,1-Math.max(0,p-.35)/.65);
    const swings=k==='claw'?[[-.5,.15],[-.25,.15],[0,.15]]:k==='spin'?[[0,1.6]]:[[1,0]];
    if(k==='slash'){const L=44,N=16; // a blade sweep through the target, upper right to lower left, drawn along a bowed line
      const pt=(t,off)=>{const bx=x+L-2*L*t,by=y-L*.9+1.8*L*t,bow=Math.sin(t*Math.PI)*10;return [bx+bow*.7+off*.7,by-bow*.7+off*.7]};
      for(const [tt,c,al] of [[9,'rgba(255,190,100,1)',.35*fade],[5,'rgba(255,238,190,1)',.65*fade],[1.8,'rgba(255,255,255,1)',fade]]){
        ctx.beginPath();for(let n=0;n<=N;n++){const t=reveal*n/N,w=Math.sin(Math.min(1,t/Math.max(reveal,.01)*.5+.15)*Math.PI)*tt*(.3+.7*t);const q=pt(t,-w);n?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])}
        for(let n=N;n>=0;n--){const t=reveal*n/N,w=Math.sin(Math.min(1,t/Math.max(reveal,.01)*.5+.15)*Math.PI)*tt*(.3+.7*t);const q=pt(t,w);ctx.lineTo(q[0],q[1])}
        ctx.closePath();ctx.fillStyle=c;ctx.globalAlpha=al;ctx.fill();ctx.globalAlpha=1}
      const q=pt(reveal,0),g=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],12);g.addColorStop(0,'rgba(255,255,255,'+fade+')');g.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q[0],q[1],12,0,TAU);ctx.fill()}
    else if(k==='spin'){const R=34;for(let n=0;n<2;n++){const a0=p*TAU*1.4+n*Math.PI;for(const [tt,c,al] of [[10,'rgba(255,220,150,1)',.4*fade],[3,'rgba(255,255,255,1)',fade]])pfxCrescent(x,y,R,a0,a0+1.6,tt,c,al)}}
    else{for(const [dx] of swings){const sx=x+dx*60-4,sy0=y-34;ctx.strokeStyle=`rgba(255,${110+rnd()*60|0},80,${fade})`;ctx.lineCap='round';ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(sx-14,sy0);ctx.quadraticCurveTo(sx-4,sy0+reveal*30,sx+12,sy0+reveal*68);ctx.stroke();ctx.strokeStyle=`rgba(255,235,210,${fade})`;ctx.lineWidth=1.1;ctx.stroke()}}
    for(let n=0;n<8;n++){const an=rnd()*TAU,d=p*(16+rnd()*30);ctx.fillStyle=`rgba(255,240,200,${a})`;ctx.beginPath();ctx.arc(x+Math.cos(an)*d,y+Math.sin(an)*d*.8,.8+rnd()*1.4*a,0,TAU);ctx.fill()}
    return}
  if(k==='heal'||k==='rise'||k==='aura'){
    const R=6+p*26,g=ctx.createRadialGradient(x,y,0,x,y,R+10);g.addColorStop(0,`rgba(255,255,230,${a*.8})`);g.addColorStop(.5,hexA(col,a*.5));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R+10,0,TAU);ctx.fill();
    ctx.strokeStyle=hexA(col,a*.9);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.stroke();
    for(let n=0;n<(k==='aura'?10:14);n++){const bx=x+(rnd()-.5)*34,by=y+18-p*(40+rnd()*26),s=1+rnd()*2;ctx.fillStyle=`rgba(255,255,230,${a*(.5+rnd()*.5)})`;ctx.fillRect(bx-s/2,by-s*1.5,s,s*3);ctx.fillRect(bx-s*1.5,by-s/2,s*3,s)} // little crosses of light rising
    if(k==='aura'){ctx.strokeStyle=hexA(col,a*.6);ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,R*1.5,0,TAU);ctx.stroke()}
    return}
  if(k==='holy'){const w=14*(1-p*.5),g=ctx.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'rgba(255,240,170,0)');g.addColorStop(.5,`rgba(255,252,220,${a})`);g.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=g;ctx.fillRect(x-w,0,w*2,y+10);
    const R=6+p*30;ctx.strokeStyle=`rgba(255,240,180,${a})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+6,R,R*.35,0,0,TAU);ctx.stroke();
    for(let n=0;n<10;n++){const bx=x+(rnd()-.5)*40,by=y+6-p*(30+rnd()*40);ctx.fillStyle=`rgba(255,250,210,${a})`;ctx.fillRect(bx,by,1.4,3)}return}
  if(k==='fire'){const R=10+p*(f.tw?28:40),g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,250,200,${a})`);g.addColorStop(.4,`rgba(255,150,30,${a*.9})`);g.addColorStop(1,'rgba(200,40,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();
    for(let n=0;n<16;n++){const an=rnd()*TAU,d=R*(.3+rnd()*.9);ctx.fillStyle=`rgba(255,${120+rnd()*100|0},30,${a})`;ctx.beginPath();ctx.arc(x+Math.cos(an)*d,y+Math.sin(an)*d-p*14,1+rnd()*2.4*a,0,TAU);ctx.fill()}return}
  if(k==='ice'){const R=8+p*(f.tw?24:34),g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(240,254,255,${a})`);g.addColorStop(.5,`rgba(120,200,255,${a*.7})`);g.addColorStop(1,'rgba(60,120,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();
    for(let n=0;n<12;n++){const an=n/12*TAU,d1=R*(.3+p*.7),d2=d1+8+rnd()*10;ctx.strokeStyle=`rgba(210,244,255,${a})`;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*d1,y+Math.sin(an)*d1);ctx.lineTo(x+Math.cos(an)*d2,y+Math.sin(an)*d2);ctx.stroke()}return}
  if(k==='bolt'){const fl=p<.5?1:0,al=Math.max(0,1-p*1.4);for(let b=0;b<2;b++){let px=x+(rnd()-.5)*24,py=0;ctx.beginPath();ctx.moveTo(px,py);while(py<y){py+=10+rnd()*10;px=x+(rnd()-.5)*(24*(1-py/Math.max(y,1)))+(rnd()-.5)*8;ctx.lineTo(px,Math.min(py,y))}
      ctx.strokeStyle=hexA(col,al*.7);ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${al})`;ctx.lineWidth=1.6;ctx.stroke()}
    const R=8+p*22,g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,255,255,${al})`);g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();return}
  if(k==='arrow'||k==='rain'){const n=k==='rain'?14:3;for(let m=0;m<n;m++){const d=m*(k==='rain'?.03:.05),pp=clamp((p-d)*2.4,0,1);if(pp<=0||pp>=1)continue;const ax=x+(k==='rain'?(rnd()-.5)*70:(m-1)*6),ty=y+(rnd()-.5)*10,ay=k==='rain'?ty-130*(1-pp):y+70*(1-pp)*(1),ex=k==='rain'?ax-6*(1-pp):ax-(m-1)*5*(1-pp);
      ctx.strokeStyle=`rgba(255,246,210,.95)`;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(ex,ay);ctx.lineTo(ax,k==='rain'?ay+(k==='rain'?18:0):ay-16);ctx.stroke();ctx.strokeStyle=hexA(col,.4);ctx.lineWidth=4;ctx.stroke()}
    if(p>.35){const q=(p-.35)/.65;ctx.fillStyle=`rgba(255,240,190,${1-q})`;for(let n=0;n<8;n++){const an=rnd()*TAU;ctx.fillRect(x+Math.cos(an)*q*22,y+Math.sin(an)*q*18,1.6,1.6)}}return}
  if(k==='shock'){for(let r=0;r<3;r++){const q=clamp(p*1.4-r*.18,0,1);if(q<=0)continue;ctx.strokeStyle=hexA(col,(1-q)*.9);ctx.lineWidth=3*(1-q)+.6;ctx.beginPath();ctx.ellipse(x,y+14,q*(f.tw?36:70),q*(f.tw?12:24),0,0,TAU);ctx.stroke()}
    for(let n=0;n<10;n++){const an=rnd()*TAU,d=p*(20+rnd()*40);ctx.fillStyle=`rgba(230,200,150,${a})`;ctx.fillRect(x+Math.cos(an)*d,y+14+Math.sin(an)*d*.4-p*8,2,2)}return}
  if(k==='gas'){for(let n=0;n<14;n++){const an=rnd()*TAU,d=rnd()*(14+p*28),R=8+rnd()*10+p*10,gx=x+Math.cos(an)*d,gy=y+Math.sin(an)*d*.6-p*10,g=ctx.createRadialGradient(gx,gy,0,gx,gy,R);g.addColorStop(0,hexA(col,a*.5));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,R,0,TAU);ctx.fill()}return}
  if(k==='fists'){for(let n=0;n<7;n++){const q=clamp(p*2.2-n*.1,0,1);if(q<=0||q>=1)continue;const fx=x+(rnd()-.5)*44,fy=y+(rnd()-.5)*34;ctx.fillStyle=`rgba(255,235,170,${1-q})`;ctx.beginPath();ctx.arc(fx,fy,3+q*9,0,TAU);ctx.fill();ctx.strokeStyle=`rgba(255,200,90,${1-q})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(fx,fy,4+q*13,0,TAU);ctx.stroke()}return}
  if(k==='shadow'){for(let n=0;n<12;n++){const an=rnd()*TAU+p*3,d=(14+p*20)*(.4+rnd()*.7),R=6+rnd()*9,gx=x+Math.cos(an)*d,gy=y+Math.sin(an)*d*.7,g=ctx.createRadialGradient(gx,gy,0,gx,gy,R);g.addColorStop(0,`rgba(90,40,150,${a*.75})`);g.addColorStop(1,'rgba(20,0,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,R,0,TAU);ctx.fill()}
    ctx.strokeStyle=`rgba(210,180,255,${a})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-20,y+14);ctx.lineTo(x+20,y-14);ctx.stroke();return}
  const R=8+p*34,g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();
}
function hexA(c,a){c=String(c);if(c[0]!=='#'||c.length<7)return `rgba(255,255,255,${Math.max(0,a)})`;return `rgba(${parseInt(c.slice(1,3),16)},${parseInt(c.slice(3,5),16)},${parseInt(c.slice(5,7),16)},${Math.max(0,Math.min(1,a))})`}
const PFX_LEN={slash:.5,spin:.7,claw:.5,heal:.8,rise:1.1,aura:.9,holy:.8,fire:.7,ice:.7,bolt:.5,arrow:.45,rain:.9,shock:.8,gas:.9,fists:.7,shadow:.8};
{const _ui4=ui;ui=function(dt){_ui4.apply(this,arguments);try{if(G.state!=='play'||G.inv.open||!PFX.length)return;const d=dt||.016;
  for(let i=PFX.length-1;i>=0;i--){const f=PFX[i];f.t+=d;if(f.t<0)continue;const T=PFX_LEN[f.k]||.6;if(f.t>T){PFX.splice(i,1);continue}
    const p=f.t/T;let s=(f.seed*7919+5)%2147483647||5;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    ctx.save();if(!f.hud){ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip()}ctx.globalCompositeOperation='lighter';pfxDraw(f,p,rnd);ctx.restore()}}catch(e){}}}
