/* ==========================================================================
   SPELL ANIMATIONS (spellfx.js). Every spell of the magic users has its own animation, built from a small effect system:
   a charge glow at the caster, a projectile (or a strike from above, a wave, a beam, a stream, a rain...) and an impact on each foe that is hit, with a flash,
   a painted burst, particles, hit-stop, a little shake, a tint on the creature and the damage number landing at the moment of impact.
   Healing and buffs glow on the heroes' portraits. The damage and the turn flow are not touched: heroSpecial is wrapped, the result is read afterwards
   (who lost health, who gained a status, who was healed) and the pictures are played from that. Notes: tools/spellfx/SPELLFX_NOTES.md
   Settings: localStorage 'abbeySpellFx' = 'off' | 'low' | 'full' (SPFX.set('low')); it also lightens itself when the frame rate drops.
   ========================================================================== */
const SPFX={lvl:2,slow:0,fx:[],obj:[],fl:[],tint:new Map(),spr:new WeakMap(),held:new Map(),stop:0,live:0,cap:null,ew:.016,npt:0,stat:{ms:0,n:0,max:0},errs:0};
try{const v=localStorage.getItem('abbeySpellFx');if(v==='off'||v==='0')SPFX.lvl=0;else if(v==='low'||v==='1')SPFX.lvl=1}catch(e){}
SPFX.set=function(v){SPFX.lvl=v==='off'||v===0?0:v==='low'||v===1?1:2;try{localStorage.setItem('abbeySpellFx',['off','low','full'][SPFX.lvl])}catch(e){}};
SPFX.q=()=>SPFX.lvl===1?.45:SPFX.slow?.65:1;
const sR=(a,b)=>a+Math.random()*(b-a),sN=n=>Math.max(1,Math.round(n*SPFX.q())),sE=u=>1-(1-u)*(1-u),sCl=clamp;
/* ---- the colours of each element: [core, mid, dark] ---- */
const SPPAL={fire:['#fff0b8','#ff8a24','#a82400'],ruin:['#ffe6ff','#ff4a80','#601060'],frost:['#f4ffff','#8fd4ff','#3a78d8'],bolt:['#ffffff','#a8c0ff','#4060d0'],arcane:['#f4e8ff','#a478ff','#5030b0'],poison:['#eaffc8','#7ade40','#2a7a10'],holy:['#fffbe4','#ffd860','#d09020'],shadow:['#d0b0ff','#7a3cc0','#240a40'],earth:['#e8d0a0','#a88050','#503018'],nature:['#d8ffa8','#5ac040','#20601a'],blood:['#ffc0b0','#e03030','#801010'],gold:['#fffbd8','#ffd040','#c08010'],shout:['#fff0c8','#ffa848','#c04010'],smoke:['#e0e0e8','#9a9aa8','#585864'],disint:['#e4fff0','#70ffb0','#1a9a60'],chaos:['#ffffff','#ff70e0','#6040ff'],wind:['#ffffff','#d8f0e8','#88a8a0'],steel:['#ffffff','#d8e4f4','#8090a8'],deep:['#ffd8d0','#e02828','#701010'],smash:['#fff4d8','#ffc060','#a05020'],bash:['#fff0d0','#d8b878','#806040'],wood:['#f6e8b8','#c8a060','#6a4a20']};
/* ---- cached sprites ---- */
const SPS={};
function spCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function spRGB(c){c=String(c);if(c[0]!=='#'||c.length<7)return [255,255,255];return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]}
function spGlow(col){const k='g'+col;let s=SPS[k];if(s)return s;s=SPS[k]=spCv(48,48);const g=s.getContext('2d'),q=g.createRadialGradient(24,24,0,24,24,24);
  q.addColorStop(0,'rgba(255,255,255,.9)');q.addColorStop(.2,hexA(col,.85));q.addColorStop(.55,hexA(col,.3));q.addColorStop(1,hexA(col,0));g.fillStyle=q;g.fillRect(0,0,48,48);return s}
function spSoft(col,a){const k='s'+col+a;let s=SPS[k];if(s)return s;s=SPS[k]=spCv(64,64);const g=s.getContext('2d'),q=g.createRadialGradient(32,32,0,32,32,32);
  q.addColorStop(0,hexA(col,a));q.addColorStop(.55,hexA(col,a*.55));q.addColorStop(1,hexA(col,0));g.fillStyle=q;g.fillRect(0,0,64,64);return s}
function spStar(col){const k='t'+col;let s=SPS[k];if(s)return s;s=SPS[k]=spCv(40,40);const g=s.getContext('2d');g.drawImage(spGlow(col),4,4,32,32);
  g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.moveTo(20,0);g.lineTo(22.2,17.8);g.lineTo(40,20);g.lineTo(22.2,22.2);g.lineTo(20,40);g.lineTo(17.8,22.2);g.lineTo(0,20);g.lineTo(17.8,17.8);g.closePath();g.fill();return s}
const SPTG={fire:['#fff6c8','#ff9a22','#c02800'],ruin:['#ffe6f4','#ff3a78','#601060'],green:['#f4ffc8','#7ade40','#1a6a10'],ice:['#ffffff','#80d0ff','#2060c0'],violet:['#ffe0ff','#c050ff','#4010a0']};
function spTongue(pal){const k='f'+pal;let s=SPS[k];if(s)return s;s=SPS[k]=spCv(44,88);const g=s.getContext('2d'),P=SPTG[pal]||SPTG.fire;
  const path=()=>{g.beginPath();g.moveTo(22,2);g.bezierCurveTo(29,26,41,46,38,64);g.bezierCurveTo(35,84,9,84,6,64);g.bezierCurveTo(3,46,15,26,22,2);g.closePath()};
  g.filter='blur(1.4px)';let q=g.createLinearGradient(0,2,0,84);q.addColorStop(0,hexA(P[0],.95));q.addColorStop(.35,hexA(P[1],.95));q.addColorStop(1,hexA(P[2],.55));path();g.fillStyle=q;g.fill();
  g.save();g.translate(22,66);g.scale(.52,.62);g.translate(-22,-66);q=g.createLinearGradient(0,2,0,84);q.addColorStop(0,'rgba(255,255,240,1)');q.addColorStop(.6,hexA(P[0],.9));q.addColorStop(1,hexA(P[1],.5));path();g.fillStyle=q;g.fill();g.restore();return s}
function spVig(rgb){const k='v'+rgb;let s=SPS[k];if(s)return s;s=SPS[k]=spCv(210,105);const g=s.getContext('2d'),q=g.createRadialGradient(105,52,28,105,52,128);q.addColorStop(0,`rgba(${rgb},0)`);q.addColorStop(.55,`rgba(${rgb},.35)`);q.addColorStop(1,`rgba(${rgb},1)`);g.fillStyle=q;g.fillRect(0,0,210,105);return s}
/* the painted effect pictures (assets/fx_*.png) with their square edges faded away */
function spPic(name,mode){const k='p'+name+(mode||'');if(SPS[k])return SPS[k];const im=IMG['fx_'+name];if(!im||!im.width)return null;const c=spCv(160,160),g=c.getContext('2d');g.drawImage(im,0,0,160,160);g.globalCompositeOperation='destination-in';
  if(mode==='shaft'){let q=g.createLinearGradient(0,0,160,0);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(.2,'#000');q.addColorStop(.8,'#000');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,160,160);q=g.createLinearGradient(0,0,0,160);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(.14,'#000');q.addColorStop(.8,'#000');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,160,160)}
  else{const q=g.createRadialGradient(80,80,0,80,80,80);q.addColorStop(0,'#000');q.addColorStop(.58,'#000');q.addColorStop(.97,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,160,160)}
  return SPS[k]=c}
/* ---- particles (a fixed pool, nothing is allocated while a spell plays) ---- */
const SP_N=620,SPP=[];let spHead=0;
const PK={GLOW:0,SMOKE:1,STREAK:2,SPARK:3,SHARD:4,ROCK:5,EMBER:6,MOTE:7,DRIP:8,BUB:9,COIN:10,LEAF:11,TONGUE:12};
for(let i=0;i<SP_N;i++)SPP.push({a:0,k:0,x:0,y:0,vx:0,vy:0,t:0,l:1,r0:1,r1:1,c:'#fff',g:0,h:0,rot:0,vr:0,al:1,dr:0});
function pAdd(k,x,y,vx,vy,life,r0,r1,c,g,h){SPFX.pnew=1;const p=SPP[spHead];spHead=(spHead+1)%SP_N;p.a=1;p.k=k;p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.t=0;p.l=life;p.r0=r0;p.r1=r1;p.c=c;p.g=g||0;p.h=h||0;p.rot=sR(0,TAU);p.vr=0;p.al=1;p.dr=0;return p}
function sBurst(n,k,x,y,s0,s1,l0,l1,r0,r1,c,g,a0,a1,h){n=sN(n);for(let i=0;i<n;i++){const a=sR(a0===undefined?0:a0,a1===undefined?TAU:a1),s=sR(s0,s1);pAdd(k,x,y,Math.cos(a)*s,Math.sin(a)*s,sR(l0,l1),r0,sR(r1*.7,r1),c,g||0,h)}}
const SP_ADD=new Set([0,2,3,6,7,8,9,12]);
function spPtsUpdate(dt){let n=0;for(let i=0;i<SP_N;i++){const p=SPP[i];if(!p.a)continue;p.t+=dt;if(p.t>=p.l){p.a=0;continue}n++;p.vy+=p.g*dt;if(p.dr){const d=Math.max(0,1-p.dr*dt);p.vx*=d;p.vy*=d}p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt}SPFX.npt=n}
function spPtsDraw(h,add){
  for(let i=0;i<SP_N;i++){const p=SPP[i];if(!p.a||p.h!==h||SP_ADD.has(p.k)!==add)continue;const u=p.t/p.l,r=p.r0+(p.r1-p.r0)*u;
    switch(p.k){
      case 0:{const a=p.al*(1-u)*(1-u*.3);ctx.globalAlpha=a;ctx.drawImage(spGlow(p.c),p.x-r,p.y-r,r*2,r*2);break}
      case 6:{const a=(1-u)*(.55+.45*Math.sin(p.t*38+p.rot));ctx.globalAlpha=Math.max(0,a);ctx.drawImage(spGlow(p.c),p.x-r,p.y-r,r*2,r*2);break}
      case 1:{const a=(u<.15?u/.15:1)*(1-u)*.62;ctx.globalAlpha=a;ctx.drawImage(spSoft(p.c,.9),p.x-r,p.y-r,r*2,r*2);break}
      case 2:{ctx.globalAlpha=(1-u)*.95;ctx.strokeStyle=p.c;ctx.lineWidth=p.r0;ctx.lineCap='round';const L=.05;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*L,p.y-p.vy*L);ctx.stroke();break}
      case 3:{ctx.globalAlpha=1-u;ctx.fillStyle=p.c;ctx.fillRect(p.x-r/2,p.y-r/2,r,r);break}
      case 4:{ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*1.6);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-r*1.5);ctx.lineTo(r*.5,0);ctx.lineTo(0,r*1.1);ctx.lineTo(-r*.5,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();break}
      case 5:{ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*2);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r,-r*.2);ctx.lineTo(-r*.3,-r);ctx.lineTo(r*.8,-r*.6);ctx.lineTo(r,r*.4);ctx.lineTo(0,r);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();break}
      case 7:{const a=(1-u)*(.6+.4*Math.sin(p.t*22+p.rot*3));ctx.globalAlpha=Math.max(0,a);ctx.drawImage(spStar(p.c),p.x-r,p.y-r,r*2,r*2);break}
      case 8:{ctx.globalAlpha=(1-u)*.9;ctx.strokeStyle=p.c;ctx.lineWidth=1.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y-p.r0);ctx.stroke();break}
      case 9:{ctx.globalAlpha=(u>.85?(1-u)/.15:1)*.8;ctx.strokeStyle=p.c;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.stroke();ctx.globalAlpha*=.35;ctx.fillStyle=p.c;ctx.fill();break}
      case 10:{ctx.globalAlpha=Math.min(1,(1-u)*2);ctx.fillStyle='#ffd24a';ctx.strokeStyle='#7a5000';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(p.x,p.y,r,r*Math.abs(Math.cos(p.t*14+p.rot))+.5,0,0,TAU);ctx.fill();ctx.stroke();break}
      case 11:{ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*2);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.beginPath();ctx.ellipse(0,0,r,r*.45,0,0,TAU);ctx.fill();ctx.restore();break}
      case 12:{const gr=u<.25?.55+u*1.8:1.0-(u-.25)*.9,a=Math.min(1,(1-u)*1.5);ctx.save();ctx.globalAlpha=a;ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx)+Math.PI/2);const w=r*.9*gr,hh=r*2.1*gr;ctx.drawImage(spTongue(p.c),-w/2,-hh*.72,w,hh);ctx.restore();break}
    }}
  ctx.globalAlpha=1}
/* ---- flashes, shake, hit-stop ---- */
function spFlash(rgb,a,d,edge,delay,normal){if(SPFX.fl.length>8)SPFX.fl.shift();SPFX.fl.push({c:rgb,a,d,t:-(delay||0),e:edge?1:0,n:normal?1:0})}
function spShake(a){if(typeof G!=='undefined')G.shake=Math.max(G.shake||0,a)}
function spStop(s){if(SPFX.lvl)SPFX.stop=Math.max(SPFX.stop,Math.min(.1,s))}
function spFlashDraw(dt){
  for(let i=SPFX.fl.length-1;i>=0;i--){const f=SPFX.fl[i];f.t+=dt;if(f.t>f.d){SPFX.fl.splice(i,1);continue}if(f.t<0)continue;const k=1-f.t/f.d,a=f.a*k*k;
    ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation=f.n?'source-over':'lighter';ctx.globalAlpha=Math.min(1,a);
    if(f.e)ctx.drawImage(spVig(f.c),0,0,420,210);else{ctx.fillStyle=`rgb(${f.c})`;ctx.fillRect(0,0,420,210)}ctx.restore()}}
/* ---- objects: rings, painted bursts, bolts, shafts of light, tendrils, claws, vines, marks ... (each has its own age) ---- */
function sObj(o){o.t=0;if(SPFX.obj.length>60)SPFX.obj.shift();SPFX.obj.push(o);return o}
const SPTMP=[];
function spBoltPts(x0,y0,x1,y1,seed,det){let s=(seed*7919+13)%2147483647||13;const r=()=>(s=(s*16807)%2147483647)/2147483647,pts=SPTMP;pts.length=0;pts.push(x0,y0);
  const n=Math.max(4,Math.round(Math.hypot(x1-x0,y1-y0)/det));for(let i=1;i<n;i++){const u=i/n,sp=(1-Math.abs(u-.5)*1.4)*16+3;pts.push(x0+(x1-x0)*u+(r()-.5)*sp,y0+(y1-y0)*u+(r()-.5)*sp*.5)}pts.push(x1,y1);return pts}
function spStrokePts(pts,col,w,al){ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.stroke()}
function spBolt(x0,y0,x1,y1,seed,al,col,thick){const pts=spBoltPts(x0,y0,x1,y1,seed,9);ctx.lineJoin='round';ctx.lineCap='round';
  spStrokePts(pts,hexA(col||'#8aa8ff',1),(thick||1)*6.5,al*.45);spStrokePts(pts,'#cfe0ff',(thick||1)*3,al*.8);spStrokePts(pts,'#ffffff',(thick||1)*1.5,al);
  // a branch or two
  if(pts.length>10){for(let b=0;b<2;b++){const i=2*(2+((seed*3+b*5)%(Math.max(1,(pts.length>>1)-4)))),bx=pts[i],by=pts[i+1],ex=bx+((b?1:-1)*(18+(seed%9)*2)),ey=by+22+(seed%7)*3,p2=spBoltPts(bx,by,ex,ey,seed+b+1,8);spStrokePts(p2,'#cfe0ff',1.6,al*.65);spStrokePts(p2,'#ffffff',.8,al*.8)}}}
function spObjDraw(o,h){
  const u=o.t/o.d;if(u>=1)return false;
  const e=o.e,ex=e&&e.sx?sCl(e.sx,10,410):o.x,ey=e&&e.sy?sCl(e.sy,20,195):o.y;
  switch(o.k){
    case 'ring':{const r=o.r1*sE(u),ry=r*o.fl;ctx.globalAlpha=Math.min(1,(1-u)*(o.a||1));ctx.strokeStyle=o.c;ctx.lineWidth=o.w*(1-u)+.5;ctx.beginPath();ctx.ellipse(o.x,o.y,Math.max(.5,r),Math.max(.5,ry),0,0,TAU);ctx.stroke();break}
    case 'pic':{const im=spPic(o.n);if(!im)break;const s=o.s*(o.g0+(1-o.g0)*sE(Math.min(1,u*2.6)))*(1+u*.22),a=(u<.08?u/.08:1)*Math.pow(1-u,1.25);ctx.save();ctx.globalAlpha=Math.min(1,a*(o.a||1));ctx.translate(o.x,o.y);ctx.rotate(o.rot||0);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();break}
    case 'shaft':{const im=spPic('holy','shaft');if(!im)break;const w=o.w*(.7+.3*Math.sin(u*Math.PI)),y0=o.y0,hh=o.y-y0+22,a=Math.min(1,u*9)*Math.pow(1-u,1.1);ctx.globalAlpha=Math.min(1,a);ctx.drawImage(im,o.x-w/2,y0,w,hh);ctx.globalAlpha=a*.6;ctx.drawImage(spGlow('#fff2b0'),o.x-w*.4,o.y-w*.25,w*.8,w*.5);break}
    case 'bolt':{const fi=Math.floor(o.t*28),a=(u<.7?1:(1-u)/.3)*(fi%3===2?.55:1);spBolt(o.x+((o.seed%5)-2)*3,-6,o.x,o.y,o.seed+fi,a,'#8aa8ff',o.z||1);break}
    case 'arc':{const fi=Math.floor(o.t*30),a=(u<.6?1:(1-u)/.4);const pts=spBoltPts(o.x0,o.y0,o.x1,o.y1,o.seed+fi,8);ctx.lineJoin='round';spStrokePts(pts,'rgba(120,150,255,1)',5,a*.45);spStrokePts(pts,'#ffffff',1.5,a);break}
    case 'star':{const r=o.r*(.4+.6*sE(u)),a=(1-u),n=6;ctx.strokeStyle=o.c||'#e0c8ff';ctx.lineWidth=1.6;ctx.globalAlpha=a;ctx.beginPath();for(let i=0;i<n;i++){const an=o.rot+u*2.2+i*TAU/n;ctx.moveTo(o.x+Math.cos(an)*r*.25,o.y+Math.sin(an)*r*.25);ctx.lineTo(o.x+Math.cos(an)*r,o.y+Math.sin(an)*r)}ctx.stroke();
      ctx.beginPath();for(let i=0;i<=n;i++){const an=o.rot-u*1.4+i*TAU/n*2;ctx.lineTo(o.x+Math.cos(an)*r*.7,o.y+Math.sin(an)*r*.7)}ctx.stroke();break}
    case 'tend':{const n=o.n,tx=o.rev?o.tx:ex,ty=o.rev?o.ty:ey;let seed=o.seed;const p=Math.min(1,u*2.6),a=Math.min(1,(1-u)*1.6);for(let i=0;i<n;i++){seed=(seed*16807)%2147483647;const sx=(seed%420),sy=seed%2?210:((seed>>3)%210),side=seed%3===0,bx=side?(seed%2?0:420):sx,by=side?sy:(seed%2?210:0),cx=(bx+tx)/2+(((seed>>5)%60)-30),cy=(by+ty)/2+(((seed>>7)%60)-30);
        const sx0=o.rev?tx:bx,sy0=o.rev?ty:by,ex1=o.rev?bx:tx,ey1=o.rev?by:ty;ctx.beginPath();ctx.moveTo(sx0,sy0);const N=12;for(let q=1;q<=N*p;q++){const t=q/N,mx=(1-t)*(1-t)*sx0+2*(1-t)*t*cx+t*t*ex1,my=(1-t)*(1-t)*sy0+2*(1-t)*t*cy+t*t*ey1;ctx.lineTo(mx+Math.sin(t*9+o.t*10+i)*3,my+Math.cos(t*7+i)*2)}
        ctx.globalAlpha=a*.8;ctx.strokeStyle='#1c0634';ctx.lineWidth=4*(1-u*.5);ctx.stroke();ctx.globalAlpha=a*.7;ctx.strokeStyle='#8a50e0';ctx.lineWidth=1.2;ctx.stroke()}break}
    case 'slash':{const p=Math.min(1,u*4),a=Math.min(1,(1-u)*1.5);ctx.lineCap='round';for(let i=0;i<o.n;i++){const ox=(i-(o.n-1)/2)*o.sp,x0=o.x+ox-o.len*.5,y0=o.y-o.len*.8,x1=o.x+ox+o.len*.5,y1=o.y+o.len*.8,px=x0+(x1-x0)*p,py=y0+(y1-y0)*p;
        ctx.globalAlpha=a*.55;ctx.strokeStyle=o.c;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=a;ctx.strokeStyle='#fff';ctx.lineWidth=2.2;ctx.stroke()}break}
    case 'roots':{const p=sE(Math.min(1,u*2.4)),a=u>.65?1-(u-.65)/.35:1;for(let i=0;i<5;i++){const bx=o.x+(i-2)*(10+o.z*5),hh=(34+(i%3)*10)*o.z*p;ctx.beginPath();ctx.moveTo(bx,o.y+18*o.z);for(let q=1;q<=10;q++){const t=q/10;ctx.lineTo(bx+Math.sin(t*7+i*2)*(6*o.z)*t,o.y+18*o.z-hh*t)}
        ctx.globalAlpha=a;ctx.strokeStyle='#1d3a12';ctx.lineWidth=4.2*o.z;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#5aa83a';ctx.lineWidth=1.6*o.z;ctx.stroke()}break}
    case 'crack':{const p=Math.min(1,u*4),a=u>.6?1-(u-.6)/.4:1;ctx.lineCap='round';ctx.lineJoin='round';for(let i=0;i<7;i++){const an=-Math.PI*(.1+.8*i/6)+.0,L=(34+(i%3)*14)*o.z*p;ctx.beginPath();ctx.moveTo(o.x,o.y+14*o.z);let px=o.x,py=o.y+14*o.z;for(let q=1;q<=4;q++){px+=Math.cos(an)*L/4+(((i*7+q*13)%7)-3)*1.4;py+=-Math.sin(an)*L/4*.5+2;ctx.lineTo(px,py)}ctx.globalAlpha=a;ctx.strokeStyle='#150c06';ctx.lineWidth=2.4;ctx.stroke();ctx.globalAlpha=a*.7;ctx.strokeStyle='#ff9a40';ctx.lineWidth=.8;ctx.stroke()}break}
    case 'swarm':{const n=Math.round(14*SPFX.q()),a=Math.min(1,(1-u)*2.2);ctx.fillStyle='#f0c020';for(let i=0;i<n;i++){const an=o.t*(7+i%3)+i*1.9,rr=(14+(i*5)%16)*o.z;ctx.globalAlpha=a;ctx.fillRect(ex+Math.cos(an)*rr-1,ey+Math.sin(an*1.3)*rr*.7-1,2.4,2.4);ctx.globalAlpha=a*.8;ctx.fillStyle='#3a2800';ctx.fillRect(ex+Math.cos(an)*rr-1,ey+Math.sin(an*1.3)*rr*.7+1,2.4,1);ctx.fillStyle='#f0c020'}break}
    case 'chains':{const a=Math.min(1,(1-u)*1.7),p=sE(Math.min(1,u*5));ctx.strokeStyle='#ffe070';ctx.lineWidth=2.4;for(let i=0;i<4;i++){const yy=ey-o.z*28+i*o.z*16*p+ (1-p)*-40;ctx.globalAlpha=a;ctx.beginPath();ctx.ellipse(ex,yy,o.z*(22-i*2)*(.8+.2*Math.sin(o.t*8+i)),o.z*6,0,0,TAU);ctx.stroke();ctx.globalAlpha=a*.4;ctx.lineWidth=5;ctx.stroke();ctx.lineWidth=2.4}break}
    case 'rift':{const a=Math.min(1,u*5)*Math.min(1,(1-u)*4),R=o.r*(.35+.65*Math.min(1,u*3));ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a*.9;ctx.fillStyle='#07000f';ctx.beginPath();ctx.ellipse(ex,ey,R*.55,R*.9,0,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';
      for(let i=0;i<4;i++){ctx.globalAlpha=a*.8;ctx.strokeStyle=i%2?'#a060ff':'#e0c0ff';ctx.lineWidth=2-.3*i;ctx.beginPath();for(let q=0;q<=14;q++){const t=q/14,an=o.t*7+i*TAU/4+t*5,rr=R*(1-t*.8);ctx.lineTo(ex+Math.cos(an)*rr*.6,ey+Math.sin(an)*rr)}ctx.stroke()}break}
    case 'clock':{const a=Math.min(1,u*6)*Math.min(1,(1-u)*2.5),R=o.r*(.6+.4*sE(Math.min(1,u*3)));ctx.strokeStyle='#d8e8ff';ctx.lineWidth=2;ctx.globalAlpha=a;ctx.beginPath();ctx.arc(o.x,o.y,R,0,TAU);ctx.stroke();ctx.lineWidth=1;ctx.beginPath();ctx.arc(o.x,o.y,R*.86,0,TAU);ctx.stroke();ctx.lineWidth=1.4;ctx.beginPath();for(let i=0;i<12;i++){const an=i*TAU/12;ctx.moveTo(o.x+Math.cos(an)*R*.86,o.y+Math.sin(an)*R*.86);ctx.lineTo(o.x+Math.cos(an)*R*.74,o.y+Math.sin(an)*R*.74)}ctx.stroke();
      const hand=(an,L,w)=>{ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x+Math.cos(an)*R*L,o.y+Math.sin(an)*R*L);ctx.stroke()};hand(-1.2+u*14*(1-u*.6),.7,2);hand(-1.2+u*1.4,.48,3);ctx.globalAlpha=a*.35;ctx.drawImage(spGlow('#a0c0ff'),o.x-R*1.4,o.y-R*1.4,R*2.8,R*2.8);break}
    case 'mark':{spMark(o,u,ex,ey);break}
    case 'band':{const a=(u<.15?u/.15:1)*(1-u);ctx.strokeStyle=o.c;ctx.lineWidth=2;for(let i=0;i<3;i++){const uu=(u*1.3+i/3)%1,yy=o.y+26-uu*58,ww=17+Math.sin(uu*Math.PI)*5;ctx.globalAlpha=a*Math.sin(uu*Math.PI)*.9;ctx.beginPath();ctx.ellipse(o.x,yy,ww,4.5,0,0,TAU);ctx.stroke()}break}
    case 'column':{const a=Math.min(1,u*8)*(1-u),w=o.w*(.6+.4*sE(u));const q=ctx.createLinearGradient(0,o.y-70,0,o.y+30);q.addColorStop(0,hexA(o.c,0));q.addColorStop(.5,hexA(o.c,.55));q.addColorStop(1,hexA(o.c,.1));ctx.globalAlpha=a;ctx.fillStyle=q;ctx.fillRect(o.x-w/2,o.y-70,w,100);ctx.drawImage(spGlow(o.c),o.x-w,o.y-w*.6,w*2,w*1.2);break}
    case 'ghost':{if(typeof portraitImg!=='function')break;const im=portraitImg(o.j);if(!im)break;const a=Math.min(1,u*5)*(1-u)*.5,x=portraitX(o.j),y=o.y-30,sw=Math.min(im.width,im.height*(38/58)),sx=(im.width-sw)/2;ctx.save();ctx.beginPath();ctx.rect(x-14,y,66,58);ctx.clip();ctx.globalAlpha=a;for(const dx of [-9,9]){ctx.drawImage(im,sx,0,sw,im.height,x+dx*Math.sin(Math.min(1,u*2)*1.57),y,38,58)}ctx.restore();break}
    case 'blade':{ctx.lineCap='round';for(let i=0;i<o.n;i++){const lt=o.t-i*o.gap;if(lt<0)continue;const pr=Math.min(1,lt/.07),a=lt<.07?1:Math.max(0,1-(lt-.07)/.18);if(a<=0)continue;
        const dir=(i%2?-1:1),L=o.len*(1+(i%3)*.12),cx=o.x+(i-(o.n-1)/2)*o.sp*.5,cy=o.y+((i%3)-1)*o.sp*.4,x0=cx-dir*L*.5,y0=cy-L*.62,x1=cx+dir*L*.5,y1=cy+L*.62,px=x0+(x1-x0)*pr,py=y0+(y1-y0)*pr,qx=x0+(x1-x0)*Math.max(0,pr-.7),qy=y0+(y1-y0)*Math.max(0,pr-.7);
        ctx.globalAlpha=a*.45;ctx.strokeStyle=o.c;ctx.lineWidth=9*o.w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=a*.8;ctx.strokeStyle='#ffffff';ctx.lineWidth=3.4*o.w;ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(px,py);ctx.stroke();ctx.lineWidth=1.6*o.w;ctx.globalAlpha=a;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=a;ctx.drawImage(spGlow('#ffffff'),px-8,py-8,16,16)}break}
    case 'cres':{const pr=Math.min(1,u*3.2),a=Math.pow(1-u,1.2),N=18,R=o.r,a0=-2.5,a1=-2.5+3.1*pr;for(const [th,c,al] of [[16,o.c,.5],[7,'#ffffff',.95]]){ctx.beginPath();for(let n=0;n<=N;n++){const an=a0+(a1-a0)*n/N,w=Math.sin(n/N*Math.PI);ctx.lineTo(o.x+Math.cos(an)*(R+th*w),o.y+Math.sin(an)*(R+th*w)*.8)}for(let n=N;n>=0;n--){const an=a0+(a1-a0)*n/N;ctx.lineTo(o.x+Math.cos(an)*R,o.y+Math.sin(an)*R*.8)}ctx.closePath();ctx.fillStyle=c;ctx.globalAlpha=a*al;ctx.fill()}break}
    case 'drop':{const a=Math.pow(1-u,2),g=ctx.createLinearGradient(0,o.y-120,0,o.y+6);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.7,'rgba(255,248,224,1)');g.addColorStop(1,'rgba(255,230,170,0)');ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(o.x-5-8*u,o.y-120,10+16*u,126);break}
    case 'spikes':{const gr=Math.min(1,u*6),a=u>.55?1-(u-.55)/.45:1;for(let i=0;i<o.n;i++){const bx=o.x+(i-(o.n-1)/2)*13*o.z,by=o.y+17*o.z+(u>.55?(u-.55)*18:0),h=(30+(i%3)*15)*o.z*gr,w=5.5*o.z,g=ctx.createLinearGradient(0,by-h,0,by);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(170,225,255,.95)');g.addColorStop(1,'rgba(70,140,230,.7)');ctx.globalAlpha=a;ctx.fillStyle=g;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(bx-w,by);ctx.lineTo(bx+(i%2?1:-1)*1.2,by-h);ctx.lineTo(bx+w,by);ctx.closePath();ctx.fill();ctx.stroke()}break}
    case 'stuck':{const a=u<.7?1:1-(u-.7)/.3,j=u<.12?Math.sin(u*160)*1.2:0,c=Math.cos(o.ang),sn=Math.sin(o.ang),L=22*o.z+8,hx=o.x+j,hy=o.y,tx=hx-c*L,ty=hy-sn*L;ctx.lineCap='round';ctx.globalAlpha=a;ctx.strokeStyle='#e8cc90';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(hx,hy);ctx.stroke();ctx.fillStyle='#ff8a70';for(const sd of [1,-1]){ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+c*7+sn*3.4*sd,ty+sn*7-c*3.4*sd);ctx.lineTo(tx+c*8,ty+sn*8);ctx.closePath();ctx.fill()}break}
    case 'net':{const a=Math.min(1,u*6)*(u>.6?1-(u-.6)/.4:1),R=36*o.z;ctx.strokeStyle='#e8d8b0';ctx.lineWidth=1;ctx.globalAlpha=a;ctx.beginPath();for(let i=-3;i<=3;i++){ctx.moveTo(ex+i*R/3,ey-R);ctx.lineTo(ex+i*R/3+Math.sin(i)*3,ey+R);ctx.moveTo(ex-R,ey+i*R/3);ctx.lineTo(ex+R,ey+i*R/3+Math.cos(i)*3)}ctx.stroke();ctx.beginPath();ctx.ellipse(ex,ey,R*1.05,R*1.1,0,0,TAU);ctx.stroke();break}
    case 'orb':{const a=Math.min(1,u*4)*(1-u*.4),yy=o.y+(o.y1-o.y)*sE(u),xx=o.x+(o.x1-o.x)*sE(u),r=14+u*26;ctx.globalAlpha=a;ctx.drawImage(spGlow('#ffe890'),xx-r,yy-r,r*2,r*2);ctx.drawImage(spStar('#fff6c0'),xx-r*.5,yy-r*.5,r,r);break}
  }
  ctx.globalAlpha=1;return true}
/* status marks that float over a foe: hold, sleep, fear, curse, blind, confuse, slow, exposed, bleeding */
function spMark(o,u,ex,ey){
  const top=o.top||34,x=ex+(o.off||0),y=ey-top,a=(u<.12?u/.12:1)*(u>.7?(1-u)/.3:1),m=o.m;ctx.globalAlpha=a;ctx.lineCap='round';
  if(m==='hold'){ctx.strokeStyle='#bcd8ff';ctx.lineWidth=2.2;for(let i=0;i<2;i++){ctx.save();ctx.translate(x+(i?5:-5),y);ctx.rotate(.5*(i?1:-1)+Math.sin(o.t*5)*.15);ctx.beginPath();ctx.ellipse(0,0,8,4.6,0,0,TAU);ctx.stroke();ctx.restore()}ctx.globalAlpha=a*.5;ctx.drawImage(spGlow('#80b0ff'),x-16,y-16,32,32)}
  else if(m==='sleep'){ctx.font='bold 11px Georgia,serif';ctx.textAlign='center';ctx.fillStyle='#cfe0ff';for(let i=0;i<3;i++){const uu=(u*1.5+i*.28)%1;ctx.globalAlpha=a*Math.sin(uu*Math.PI);ctx.font=`bold ${8+i*3}px Georgia,serif`;ctx.fillText(i===1?'z':'Z',x+uu*16+i*3,y-uu*20+6)}}
  else if(m==='fear'){ctx.strokeStyle='#e8b0ff';ctx.lineWidth=2;for(let i=-1;i<=1;i++){const j=Math.sin(o.t*40+i)*1.2;ctx.beginPath();ctx.moveTo(x+i*7+j,y-8);ctx.lineTo(x+i*7+j*.5,y+2);ctx.stroke();ctx.fillStyle='#e8b0ff';ctx.fillRect(x+i*7+j*.4-1,y+6,2.2,2.2)}}
  else if(m==='curse'){ctx.strokeStyle='#b060e8';ctx.lineWidth=1.8;const r=8+Math.sin(o.t*6)*1;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.beginPath();for(let i=0;i<3;i++){const an=o.t*2+i*TAU/3;ctx.moveTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.lineTo(x+Math.cos(an+TAU/3*1)*r,y+Math.sin(an+TAU/3)*r)}ctx.stroke();ctx.globalAlpha=a*.5;ctx.drawImage(spGlow('#8030c0'),x-18,y-18,36,36)}
  else if(m==='blind'){ctx.strokeStyle='#d0d0e0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,9,5,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-9,y+7);ctx.lineTo(x+9,y-7);ctx.stroke()}
  else if(m==='confuse'){for(let i=0;i<3;i++){const an=o.t*6+i*TAU/3;ctx.globalAlpha=a;ctx.drawImage(spStar('#f090f0'),x+Math.cos(an)*11-5,y+Math.sin(an)*4-5,10,10)}}
  else if(m==='slow'){ctx.strokeStyle='#a8c8ff';ctx.lineWidth=2;for(let i=0;i<2;i++){const yy=y-4+i*7+(u*6);ctx.beginPath();ctx.moveTo(x-6,yy-3);ctx.lineTo(x,yy+3);ctx.lineTo(x+6,yy-3);ctx.stroke()}}
  else if(m==='vuln'){const r=16-6*Math.min(1,u*4);ctx.strokeStyle='#ff5040';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x,ey,r,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-r-4,ey);ctx.lineTo(x-r+5,ey);ctx.moveTo(x+r+4,ey);ctx.lineTo(x+r-5,ey);ctx.moveTo(x,ey-r-4);ctx.lineTo(x,ey-r+5);ctx.moveTo(x,ey+r+4);ctx.lineTo(x,ey+r-5);ctx.stroke()}
  else if(m==='bleed'){ctx.fillStyle='#e03030';for(let i=0;i<3;i++){const uu=(u*1.6+i*.3)%1;ctx.globalAlpha=a*(1-uu);ctx.beginPath();ctx.ellipse(x+(i-1)*7,y+uu*22,1.6,2.6,0,0,TAU);ctx.fill()}}
  ctx.globalAlpha=1}
/* ---- sounds: small synthesised sounds (same approach as the game's own), short and soft, scaled by the Combat volume ---- */
function spSnd(k,d){
  if(!AC||G.mute||!SNDOPT.combat||!SPFX.lvl)return;SFXM=SNDOPT.combat;d=d||0;
  switch(k){
    case 'whoosh':nz(.34,.2,'bandpass',260,2400,d);tone(180,620,.3,'sawtooth',.045,d);break;
    case 'boom':tone(100,34,.5,'sine',.5,d);tone(170,56,.3,'sawtooth',.1,d);nz(.5,.5,'lowpass',2200,90,d);nz(.3,.22,'bandpass',900,200,d);for(let i=0;i<4;i++)nz(.07,.1,'highpass',2600,6000,d+.05+Math.random()*.3);break;
    case 'crack':tone(120,48,.3,'sine',.28,d);[3136,3951,4699,5274].forEach((f,i)=>tone(f,f*.96,.26,'sine',.06,d+.01+i*.03));nz(.2,.2,'highpass',4000,8000,d);nz(.06,.14,'highpass',6000,9000,d+.14);break;
    case 'thunder':nz(.12,.5,'highpass',1500,6000,d);nz(.9,.38,'lowpass',520,60,d+.04);tone(64,30,.8,'sine',.3,d+.02);tone(1800,200,.14,'sawtooth',.07,d);break;
    case 'zap':tone(1900,260,.14,'sawtooth',.09,d);nz(.12,.2,'highpass',2500,7000,d);break;
    case 'arcane':tone(300,900,.36,'sine',.1,d);tone(450,1350,.34,'triangle',.06,d+.02);nz(.3,.07,'bandpass',1500,4500,d);break;
    case 'poison':for(let i=0;i<4;i++)tone(280+Math.random()*260,640,.08,'sine',.08,d+i*.06);nz(.45,.12,'bandpass',900,300,d);break;
    case 'chime':tone(784,784,.7,'sine',.1,d);tone(1175,1175,.62,'sine',.07,d+.04);tone(1568,1568,.55,'sine',.05,d+.08);nz(.4,.05,'highpass',3500,6500,d);break;
    case 'shadow':tone(210,52,.6,'sawtooth',.07,d);nz(.5,.1,'lowpass',800,100,d);tone(90,60,.5,'sine',.15,d);break;
    case 'rumble':tone(70,30,.55,'sine',.5,d);nz(.45,.42,'lowpass',900,70,d);for(let i=0;i<3;i++)tone(240,90,.07,'triangle',.12,d+.05+i*.06);break;
    case 'wind':nz(.5,.22,'bandpass',500,2600,d);nz(.4,.14,'highpass',2500,6000,d+.1);break;
    case 'claw':nz(.14,.28,'bandpass',900,6000,d);nz(.1,.18,'highpass',4000,8000,d+.07);tone(1500,3000,.18,'sine',.05,d);break;
    case 'ping':tone(1318,1318,.3,'sine',.09,d);tone(1760,1760,.3,'sine',.05,d+.03);nz(.1,.12,'highpass',3000,6000,d);break;
    case 'poof':nz(.4,.25,'bandpass',600,200,d);nz(.2,.12,'lowpass',1200,200,d);break;
    case 'heal':[523,659,784,1047].forEach((f,i)=>tone(f,f,.5,'sine',.08,d+i*.07));break;
    case 'aura':[392,523,659,784].forEach((f,i)=>tone(f,f*1.01,.55,'triangle',.06,d+i*.08));nz(.5,.05,'highpass',3000,6000,d);break;
    case 'ice':tone(120,48,.3,'sine',.25,d);[2093,2637,3136,3951].forEach((f,i)=>tone(f,f*.98,.5,'sine',.05,d+.02+i*.045));nz(.2,.2,'highpass',4500,8000,d);nz(.06,.14,'highpass',6000,9000,d+.16);break;
    case 'cold':nz(.4,.07,'highpass',5000,9000,d);tone(1568,2093,.4,'sine',.04,d);tone(2349,2637,.35,'sine',.03,d+.08);break;
    case 'clang':nz(.1,.28,'highpass',3000,9000,d);tone(2400,1800,.18,'triangle',.07,d);tone(3200,2800,.14,'sine',.04,d+.01);tone(120,70,.1,'sine',.15,d);break;
    case 'thud':tone(95,36,.38,'sine',.5,d);nz(.3,.4,'lowpass',1400,90,d);nz(.07,.25,'bandpass',1200,400,d);break;
    case 'swoosh':nz(.22,.22,'bandpass',500,3200,d);break;
    case 'thunk':tone(190,90,.1,'triangle',.3,d);nz(.07,.25,'bandpass',900,300,d);tone(900,600,.06,'square',.04,d);break;
    case 'twang':tone(240,150,.18,'triangle',.2,d);tone(620,330,.1,'sine',.12,d);nz(.2,.15,'bandpass',600,3600,d);break;
    case 'coin':for(let i=0;i<3;i++)tone(1800+i*300,1800+i*300,.12,'sine',.07,d+i*.07);break;
  }}
const SPSND={steel:'clang',deep:'clang',smash:'thud',bash:'thud',wood:'thunk',fire:'boom',ruin:'boom',frost:'ice',bolt:'thunder',arcane:'arcane',poison:'poison',holy:'chime',shadow:'shadow',earth:'rumble',nature:'wind',blood:'claw',gold:'ping',shout:'rumble',smoke:'poof',disint:'zap',chaos:'zap',wind:'wind'};
{const _pfs=pfxSound;pfxSound=function(){if(SPFX.cap)return;return _pfs.apply(this,arguments)}}
{const _sb=sndBoom;sndBoom=function(){if(SPFX.cap)return;return _sb.apply(this,arguments)}}
const SPIMPPLAY=impPlay;{impPlay=function(h,r,v){if(SPFX.cap){SPFX.cap.imp.push([h,r,v]);return true}return SPIMPPLAY.apply(this,arguments)}}
/* ---- the impact of each element on a foe (x,y is the middle of the creature, z its size on screen) ---- */
const SPIMP={},SPFLASH={fire:1,ruin:1,frost:.2,bolt:.8,holy:.3,arcane:.4,poison:.3,shadow:.4};
const SPKEYS=['hold','sleep','fear','curse','blind','confuse','vuln','slow','bleed'];
const rgbOf=h=>spRGB(h).join(',');
function spRing(x,y,r1,d,c,w,a,fl,h){sObj({k:'ring',x,y,r1,d,c,w,a:a||1,fl:fl===undefined?1:fl,h:h||0})}
SPIMP.fire=function(x,y,z,b,fx,tg,main){
  const ru=fx.el==='ruin',m=main?1:.45,bb=Math.min(1,b);
  spFlash(ru?'255,170,225':'255,216,150',(.62+.2*bb)*m,main?.12:.08);if(main)spFlash(ru?'210,60,150':'255,120,40',.45,.26,1);
  sObj({k:'pic',n:'fire',x,y,s:128*z*(1+.25*bb)*(main?1:.8),d:.7,g0:.3,rot:sR(-.3,.3)});sObj({k:'pic',n:'fire',x:x+sR(-6,6)*z,y:y+4*z,s:86*z,d:.5,g0:.2,a:.8,rot:sR(2.6,3.7)});
  pAdd(PK.GLOW,x,y,0,0,.45,30*z,100*z*(1+.2*bb),ru?'#ff3a90':'#ff7a20',0);
  spRing(x,y,70*z,.34,ru?'#ff9ae0':'#ffe0a8',3,.75,1);spRing(x,y+18*z,86*z,.44,'#ff9040',2,.5,.28);
  for(let i=sN(main?13:7);i>0;i--){const a=-Math.PI/2+sR(-1.35,1.35),s=sR(60,150)*z,r=sR(20,38)*z,p=pAdd(PK.TONGUE,x+sR(-8,8)*z,y+10*z,Math.cos(a)*s,Math.sin(a)*s,sR(.4,.7),r,r,ru?'ruin':'fire',-45);p.dr=2}
  sBurst(main?18:9,PK.STREAK,x,y,120,320,.3,.55,1.6,1.6,'#ffc060',260);
  for(let i=sN(main?14:7);i>0;i--)pAdd(PK.EMBER,x+sR(-22,22)*z,y+sR(-10,16)*z,sR(-24,24),sR(-34,-95),sR(.8,1.4),sR(3,5.5),sR(.8,1.5),ru?'#ff6aa0':'#ff8a2a',-22);
  for(let i=sN(main?10:5);i>0;i--)pAdd(PK.SMOKE,x+sR(-14,14)*z,y+sR(-10,10)*z,sR(-16,16),sR(-26,-58),sR(.9,1.3),12*z,sR(34,50)*z,'#1e1814',-6);
  if(main){spShake(.34+.3*bb);spStop(.05+.03*bb)}
  SPFX.tint.set(tg.e,{m:ru?'ruin':'fire',t:0,d:1.1})};
SPIMP.ruin=SPIMP.fire;
SPIMP.frost=function(x,y,z,b,fx,tg,main){const m=main?1:.5,bb=Math.min(1,b);
  spFlash('218,243,255',.75*m,.1);if(main)spFlash('130,200,255',.4,.26,1);
  sObj({k:'pic',n:'ice',x,y,s:120*z*(main?1:.8),d:.64,g0:.45,rot:sR(-.15,.15)});sObj({k:'pic',n:'ice',x,y:y+4*z,s:82*z,d:.5,g0:.3,a:.7,rot:sR(3,3.4)});
  pAdd(PK.GLOW,x,y,0,0,.42,26*z,92*z,'#9ad8ff',0);
  spRing(x,y,66*z,.32,'#d4f2ff',3.2,.9,1);spRing(x,y+18*z,86*z,.46,'#8fd0ff',2,.6,.28);
  for(let i=sN(main?16:9);i>0;i--){const a=sR(0,TAU),s=sR(80,230)*z,r=sR(8,16)*z,p=pAdd(PK.SHARD,x,y,Math.cos(a)*s,Math.sin(a)*s-40,sR(.55,.95),r,r,i%2?'#cfeeff':'#a8dcff',300);p.vr=sR(-10,10)}
  for(let i=sN(8);i>0;i--)pAdd(PK.SMOKE,x+sR(-14,14)*z,y+sR(-6,14)*z,sR(-24,24),sR(-40,-8),sR(.8,1.2),10*z,sR(30,46)*z,'#e8f4ff',-6);
  sBurst(18,PK.MOTE,x,y,10,90,.5,1,4,6,'#f0fbff',0);sBurst(10,PK.STREAK,x,y,100,260,.2,.4,1.4,1.4,'#dff4ff',200);
  if(main&&(bb>.35||fx.o.sp))sObj({k:'spikes',x,y,z,n:7,d:.75});
  if(main){spShake(.26+.2*bb);spStop(.06+.03*bb)}SPFX.tint.set(tg.e,{m:'frost',t:0,d:1.45})};
SPIMP.bolt=function(x,y,z,b,fx,tg,main){const m=main?1:.5,bb=Math.min(1,b);
  spFlash('226,236,255',.9*m,.09);spFlash('170,190,255',.5*m,.1,0,.12);if(main)spFlash('120,150,255',.3,.25,1);
  if(!tg.noTop)sObj({k:'bolt',x,y,d:.34,seed:Math.floor(x*3+y)&255,z:Math.max(.8,z*.9)});
  sObj({k:'pic',n:'bolt',x,y,s:64*z,d:.3,g0:.7,a:.7,rot:sR(-.2,.2)});spRing(x,y,40*z,.22,'#cfe0ff',2.4,.9,1);
  sBurst(14,PK.STREAK,x,y,120,310,.18,.38,1.4,1.4,'#d4e4ff',120);sBurst(6,PK.GLOW,x,y,0,30,.3,.45,10*z,26*z,'#8aa8ff',0);
  if(main){spShake(.3+.2*bb);spStop(.05+.02*bb)}SPFX.tint.set(tg.e,{m:'bolt',t:0,d:.5})};
SPIMP.arcane=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('190,150,255',.48*m,.13);if(main)spFlash('130,80,255',.3,.26,1);
  sObj({k:'star',x,y,r:38*z,d:.55,rot:sR(0,TAU),c:'#e0c8ff'});spRing(x,y,60*z,.4,'#c9a8ff',3,.9,1);spRing(x,y,38*z,.28,'#ffffff',2,.8,1);
  sBurst(2,PK.GLOW,x,y,0,0,.38,.4,18*z,70*z,'#a478ff',0);sBurst(14,PK.MOTE,x,y,15,80,.5,.95,4,5.5,'#e8d8ff',0);
  if(main)spShake(.14);SPFX.tint.set(tg.e,{m:'arcane',t:0,d:.75})};
SPIMP.poison=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('150,255,110',.22*m,.14);sObj({k:'pic',n:'gas',x,y,s:84*z,d:.9,g0:.5,a:.9,rot:sR(-.3,.3)});
  for(let i=sN(9);i>0;i--)pAdd(PK.SMOKE,x+sR(-18,18)*z,y+sR(-12,14)*z,sR(-14,14),sR(-34,-8),sR(.8,1.2),8*z,sR(24,34)*z,'#58c030',-4);
  for(let i=sN(8);i>0;i--)pAdd(PK.BUB,x+sR(-24,24)*z,y+sR(-10,16)*z,sR(-6,6),sR(-44,-18),sR(.6,1.05),sR(1.5,3),sR(3,6),'#b8ff80',-6);
  for(let i=sN(6);i>0;i--)pAdd(PK.DRIP,x+sR(-18,18)*z,y-14*z,0,sR(60,110),sR(.4,.55),sR(5,9),0,'#9aff58',160);
  if(main)spShake(.1);SPFX.tint.set(tg.e,{m:'poison',t:0,d:1.25})};
SPIMP.holy=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('255,240,186',.55*m,.13);if(main)spFlash('255,214,120',.3,.3,1);
  sObj({k:'shaft',x,y,y0:0,w:66*z,d:.72});spRing(x,y+16*z,58*z,.5,'#ffe27a',2.2,.9,.3);spRing(x,y,40*z,.3,'#fff6c8',2,.7,1);
  sBurst(2,PK.GLOW,x,y,0,0,.45,.5,20*z,72*z,'#ffd860',0);
  for(let i=sN(18);i>0;i--)pAdd(PK.MOTE,x+sR(-26,26)*z,y+sR(0,18)*z,sR(-6,6),sR(-65,-25),sR(.8,1.35),sR(3,5),sR(3,5),'#fff2b0',0);
  if(main)spShake(.1);SPFX.tint.set(tg.e,{m:'holy',t:0,d:.85})};
SPIMP.shadow=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('34,0,68',.42*m,.5,1,0,1);if(main)spFlash('120,60,200',.16,.2);
  sObj({k:'tend',x,y,e:tg.e,n:sN(6),d:.6,seed:Math.floor(x+y*7)+3});spRing(x,y,50*z,.38,'#8a58d8',2.4,.8,1);
  for(let i=sN(8);i>0;i--)pAdd(PK.SMOKE,x+sR(-16,16)*z,y+sR(-10,12)*z,sR(-18,18),sR(-30,-6),sR(.7,1.1),8*z,sR(22,32)*z,'#3a1066',-4);
  sBurst(10,PK.MOTE,x,y,10,70,.5,1,3.5,5,'#b890ff',0);if(main)spShake(.12);SPFX.tint.set(tg.e,{m:'shadow',t:0,d:.95})};
SPIMP.earth=function(x,y,z,b,fx,tg,main){const bb=Math.min(1,b);
  for(let i=sN(9);i>0;i--)pAdd(PK.SMOKE,x+sR(-20,20)*z,y+sR(6,22)*z,sR(-30,30),sR(-30,-6),sR(.7,1.05),8*z,sR(24,34)*z,'#8a7050',-4);
  for(let i=sN(9);i>0;i--){const a=-Math.PI*sR(.08,.92),s=sR(80,210)*z,p=pAdd(PK.ROCK,x,y+10*z,Math.cos(a)*s,Math.sin(a)*s,sR(.55,.9),sR(3.5,7.5)*z,sR(3.5,7.5)*z,['#8a6a44','#6e5236','#9a7a54'][i%3],480);p.vr=sR(-12,12)}
  sObj({k:'crack',x,y,z,d:.8});spRing(x,y+16*z,78*z,.4,'#d8b888',2.4,.7,.28);spFlash('210,180,120',.14,.1);
  if(main){spShake(.5+.3*bb);spStop(.06+.02*bb)}};
SPIMP.nature=function(x,y,z,b,fx,tg,main){
  spFlash('130,255,100',.18,.14);spRing(x,y+16*z,60*z,.45,'#8aff60',2,.7,.28);sBurst(2,PK.GLOW,x,y+6*z,0,0,.4,.45,14*z,48*z,'#7aff60',0);
  for(let i=sN(10);i>0;i--){const a=sR(0,TAU),s=sR(30,110)*z,p=pAdd(PK.LEAF,x,y,Math.cos(a)*s,Math.sin(a)*s-40,sR(.6,1),sR(3,5),sR(3,5),['#6ac040','#4a9a30','#9ae060'][i%3],140);p.vr=sR(-10,10)}if(main)spShake(.12)};
SPIMP.blood=function(x,y,z,b,fx,tg,main){
  spFlash('255,170,150',.25*(main?1:.5),.08);sObj({k:'slash',x,y,n:fx.sl||3,sp:9*z,len:34*z,c:'#ff6a50',d:.38});
  sBurst(10,PK.SPARK,x,y,60,180,.4,.7,2.2,2.2,'#e03030',300);sBurst(5,PK.STREAK,x,y,100,240,.2,.35,1.2,1.2,'#ffd0c0',200);
  if(main){spShake(.2);spStop(.04)}};
SPIMP.shout=function(x,y,z,b,fx,tg,main){spRing(x,y,44*z,.28,'#ffd88a',3,.9,1);spRing(x,y+16*z,70*z,.4,'#ffa848',2,.6,.28);
  sBurst(6,PK.SMOKE,x,y+12*z,20,60,.5,.8,6*z,18*z,'#a89070',-4,-Math.PI,0);sBurst(8,PK.SPARK,x,y,40,130,.3,.5,2,2,'#ffdca0',100);if(main)spShake(.16)};
SPIMP.smoke=function(x,y,z,b,fx,tg,main){for(let i=sN(10);i>0;i--)pAdd(PK.SMOKE,x+sR(-22,22)*z,y+sR(-14,16)*z,sR(-20,20),sR(-26,-4),sR(.9,1.4),12*z,sR(30,44)*z,'#8c8c9a',-3);if(main)spShake(.06)};
SPIMP.gold=function(x,y,z,b,fx,tg,main){spFlash('255,232,150',.3*(main?1:.5),.08);spRing(x,y,36*z,.26,'#ffe070',2.6,.9,1);sBurst(8,PK.STREAK,x,y,80,190,.22,.38,1.6,1.6,'#fff0a0',120);sBurst(8,PK.SPARK,x,y,40,130,.3,.5,2,2,'#ffd040',160);
  if(main){spShake(.12);spStop(.03)}};
SPIMP.disint=function(x,y,z,b,fx,tg,main){spFlash('175,255,205',.5*(main?1:.5),.1);sBurst(2,PK.GLOW,x,y,0,0,.4,.45,16*z,56*z,'#70ffb0',0);spRing(x,y,46*z,.3,'#9affc8',2.4,.9,1);
  for(let i=sN(22);i>0;i--)pAdd(PK.SPARK,x+sR(-18,18)*z,y+sR(-20,20)*z,sR(-14,14),sR(-60,-10),sR(.5,.95),2.2,2.2,'#aaffcc',-30);for(let i=sN(5);i>0;i--)pAdd(PK.SMOKE,x+sR(-14,14)*z,y+sR(-10,10)*z,sR(-10,10),sR(-26,-8),sR(.6,.9),8*z,24*z,'#4a6a58',-4);
  if(main){spShake(.22);spStop(.04)}SPFX.tint.set(tg.e,{m:'disint',t:0,d:.6})};
SPIMP.chaos=function(x,y,z,b,fx,tg,main){const cs=['#ff4080','#40c0ff','#ffe040','#80ff60','#c060ff'];spFlash(rgbOf(cs[Math.floor(Math.random()*5)]),.45,.12);
  for(let i=0;i<3;i++)spRing(x,y,(40+i*14)*z,.3+i*.06,cs[(i*2+Math.floor(x))%5],2.4,.9,1);
  for(let i=sN(18);i>0;i--){const a=sR(0,TAU),s=sR(40,200)*z;pAdd(PK.GLOW,x,y,Math.cos(a)*s,Math.sin(a)*s,sR(.3,.6),sR(5,9)*z,2,cs[i%5],0)}for(let i=sN(8);i>0;i--)pAdd(PK.MOTE,x+sR(-20,20),y+sR(-20,20),sR(-30,30),sR(-60,-10),sR(.5,.9),5,5,cs[(i+2)%5],0);
  if(main){spShake(.22);spStop(.04)}};
SPIMP.wind=function(x,y,z,b,fx,tg,main){for(let i=sN(10);i>0;i--)pAdd(PK.STREAK,x-50*z+sR(-10,10),y+sR(-24,24)*z,sR(260,420),sR(-30,30),sR(.25,.4),1.4,1.4,'#e8f8f0',0);for(let i=sN(6);i>0;i--){const p=pAdd(PK.LEAF,x+sR(-30,30),y+sR(-20,20),sR(80,200),sR(-60,0),sR(.5,.9),3,3,'#8ac060',60);p.vr=sR(-12,12)}if(main)spShake(.12)};
SPIMP.steel=function(x,y,z,b,fx,tg,main){const n=fx.o.n||2,m=main?1:.5;
  spFlash('238,244,255',.42*m,.07);sObj({k:'blade',x,y,n,gap:.045,len:62*z,sp:14*z,c:'#cfe0ff',w:Math.max(.8,z),d:.5});
  sBurst(8,PK.STREAK,x,y,100,270,.18,.34,1.4,1.4,'#ffffff',160);sBurst(6,PK.SPARK,x,y,60,170,.25,.45,2,2,'#ffe9a8',260);
  if(main){spShake(.14+.04*n);if(n>=3)spStop(.03)}SPFX.tint.set(tg.e,{m:'steel',t:0,d:.2+.05*n})};
SPIMP.deep=function(x,y,z,b,fx,tg,main){const m=main?1:.5,dk=fx.o.dark,c=dk?'#a868ff':'#ff3030';
  spFlash(dk?'200,150,255':'255,80,70',.4*m,.1);spFlash('255,255,255',.3*m,.05);
  sObj({k:'blade',x,y,n:fx.o.n||1,gap:.06,len:(fx.o.long?92:76)*z,sp:16*z,c,w:Math.max(1,1.5*z),d:.55});
  sBurst(12,PK.SPARK,x,y,60,200,.4,.7,2.2,2.2,dk?'#8a40e0':'#c01818',300);sBurst(6,PK.STREAK,x,y,100,260,.2,.36,1.3,1.3,'#ffffff',200);
  if(main){spShake(.3);spStop(.06)}SPFX.tint.set(tg.e,{m:'deep',t:0,d:.4,dk:dk?1:0})};
SPIMP.crescent=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('255,242,214',.45*m,.09);sObj({k:'cres',x,y,r:58*z,d:.36,c:'#ffe9b0'});
  sBurst(12,PK.STREAK,x,y,110,300,.2,.4,1.6,1.6,'#fff2c0',200);for(let i=sN(4);i>0;i--)pAdd(PK.SMOKE,x+sR(-14,14)*z,y+sR(6,18)*z,sR(-24,24),sR(-20,-4),sR(.5,.8),8*z,26*z,'#8a7a60',-4);
  if(main){spShake(.36);spStop(.05)}SPFX.tint.set(tg.e,{m:'steel',t:0,d:.25})};
SPIMP.smash=function(x,y,z,b,fx,tg,main){const m=main?1:.5,big=fx.o.big;
  spFlash('255,238,205',(.5+(big?.15:0))*m,.1);sObj({k:'drop',x,y,d:.24});sObj({k:'crack',x,y,z:z*(big?1.25:1),d:.85});spRing(x,y+16*z,(big?96:76)*z,.42,'#ffd890',2.6,.75,.28);spRing(x,y,50*z,.26,'#fff2d0',3,.8,1);
  for(let i=sN(big?10:7);i>0;i--)pAdd(PK.SMOKE,x+sR(-22,22)*z,y+sR(6,22)*z,sR(-34,34),sR(-34,-6),sR(.7,1.05),9*z,sR(26,38)*z,'#8a7556',-4);
  for(let i=sN(big?8:5);i>0;i--){const a=-Math.PI*sR(.1,.9),s=sR(70,190)*z,p=pAdd(PK.ROCK,x,y+12*z,Math.cos(a)*s,Math.sin(a)*s,sR(.5,.8),sR(3,6)*z,sR(3,6)*z,['#8a6a44','#6e5236','#9a7a54'][i%3],460);p.vr=sR(-12,12)}
  sBurst(10,PK.STREAK,x,y,100,280,.2,.4,1.6,1.6,'#ffe6b0',220);
  if(main){spShake(.5+(big?.25:0));spStop(.07)}SPFX.tint.set(tg.e,{m:'steel',t:0,d:.25})};
SPIMP.bash=function(x,y,z,b,fx,tg,main){const m=main?1:.5;
  spFlash('255,236,200',.32*m,.08);spRing(x,y,56*z,.3,'#ffe0a0',3,.9,1);spRing(x,y+16*z,78*z,.4,'#d8b878',2,.6,.28);
  for(let i=sN(6);i>0;i--)pAdd(PK.SMOKE,x+sR(-18,18)*z,y+sR(6,20)*z,sR(-30,30),sR(-26,-6),sR(.6,.9),8*z,sR(22,32)*z,'#9a8a68',-4);sBurst(8,PK.SPARK,x,y,60,170,.3,.5,2,2,'#ffdca0',200);
  if(main){spShake(.3);spStop(.05)}};
SPIMP.wood=function(x,y,z,b,fx,tg,main){const n=fx.o.n||1,m=main?1:.5;
  spFlash('255,240,210',.2*m,.06);for(let i=sN(10);i>0;i--){const a=sR(0,TAU),s=sR(50,180)*z,p=pAdd(PK.ROCK,x,y,Math.cos(a)*s,Math.sin(a)*s-30,sR(.35,.6),sR(1.6,3)*z,sR(1.6,3)*z,'#c8a060',380);p.vr=sR(-18,18)}
  sBurst(6,PK.SPARK,x,y,60,170,.25,.4,1.8,1.8,'#ffe9a8',200);for(let i=sN(3);i>0;i--)pAdd(PK.SMOKE,x,y,sR(-14,14),sR(-18,-4),sR(.4,.6),5*z,16*z,'#a8946a',-3);
  spRing(x,y,28*z,.2,'#f0dcaa',2,.8,1);
  const dx=x-fx.a0.x,dy=y-fx.a0.y,ang=Math.atan2(dy,dx);if(fx.dl!=='net')for(let k=0;k<n;k++)sObj({k:'stuck',x:x+(k-(n-1)/2)*6*z,y:y+(k-(n-1)/2)*4*z,ang,z,d:.95});
  if(main){spShake(.12);spStop(.03)}};
/* the little extras of each way of delivering a spell */
const SPDLX={
  smite(x,y,z,fx,tg){sObj({k:'blade',x,y,n:1,gap:0,len:70*z,sp:0,c:'#ffe27a',w:Math.max(1,1.3*z),d:.45});sObj({k:'cres',x,y,r:52*z,d:.32,c:'#fff2b0'})},
  net(x,y,z,fx,tg){sObj({k:'net',x,y,z,d:.9})},
  roots(x,y,z,fx,tg){sObj({k:'roots',x,y,z,d:.9})},
  swarm(x,y,z,fx,tg){sObj({k:'swarm',e:tg.e,x,y,z,d:.9})},
  chains(x,y,z,fx,tg){sObj({k:'chains',e:tg.e,x,y,z,d:.8})},
  rift(x,y,z,fx,tg){sObj({k:'rift',e:tg.e,x,y,r:52*z,d:.8});for(let i=sN(14);i>0;i--){const a=sR(0,TAU),R=sR(40,70)*z;pAdd(PK.MOTE,x+Math.cos(a)*R,y+Math.sin(a)*R*.7,-Math.cos(a)*R/.45,-Math.sin(a)*R*.7/.45,.45,3.5,3.5,i%2?'#c090ff':'#ffffff',0)}},
  poly(x,y,z,fx,tg){spFlash('255,240,200',.3,.1);sBurst(9,PK.SMOKE,x,y,20,80,.6,.9,10*z,30*z,'#d8d0e0',-6);sBurst(14,PK.MOTE,x,y,30,110,.6,1,4,6,'#ffe9a0',-40);spRing(x,y,48*z,.3,'#fff0c0',2.4,.9,1)},
  steal(x,y,z,fx,tg){for(let i=sN(8);i>0;i--){const g=320,life=sR(.5,.7),tx=sR(40,76),ty=sR(222,230);pAdd(PK.COIN,x+sR(-10,10),y+sR(-8,8),(tx-x)/life,(ty-y-.5*g*life*life)/life,life,3.2,3.2,'#ffd24a',g,1)}spSnd('coin',0);spRing(x,y,34*z,.25,'#ffe070',2.2,.9,1)},
  sleep(x,y,z,fx,tg){spRing(x,y,50*z,.7,'#a8c0ff',1.6,.6,1);spRing(x,y,34*z,.5,'#c8d8ff',1.4,.5,1)}
};
function spSize(e){const s=SPFX.spr.get(e);if(s&&s.tY&&s.img&&s.img.width){const sw=F*s.w/s.tY*(1+(s.lunge||0)*.28);return {sw,sh:sw*s.img.height/s.img.width,s}}
  const d=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y),sw=sCl(F*.6/Math.max(.8,d),20,260);return {sw,sh:sw,s:null}}
const spZ=e=>{const q=spSize(e);return sCl(Math.max(q.sw,q.sh*.8)/88,.55,1.8)};
function spImpact(fx,tg){
  const e=tg.e,x=e.sx?sCl(e.sx,12,408):210,y=e.sy?sCl(e.sy,24,192):100,z=spZ(e),main=tg.n===0,b=tg.b;
  spRelease(tg,fx.el);
  if(fx.dl==='poly')SPDLX.poly(x,y,z,fx,tg);
  else{(SPIMP[fx.el]||SPIMP.arcane)(x,y,z,main?b:b*.6,fx,tg,main);if(SPDLX[fx.dl])SPDLX[fx.dl](x,y,z,fx,tg)}
  if(fx.dl==='chain'&&tg.n>0&&tg.prev){const p=tg.prev;sObj({k:'arc',x0:p.sx||210,y0:p.sy||100,x1:x,y1:y,seed:tg.n*17,d:.24})}
  if(fx.dl==='drain'&&main){for(let i=sN(14);i>0;i--){const life=sR(.45,.7),pp=spPort(fx.i);pAdd(PK.MOTE,x+sR(-14,14)*z,y+sR(-10,10)*z,(pp.x-x)/life,(pp.y-y)/life,life,3.5,3.5,i%2?'#c090ff':'#ff90d0',0,1)}}
  const ms=tg.marks,sz=spSize(e),top=sCl(sz.sh*.5+8,20,64);
  for(let i=0;i<ms.length&&i<3;i++)sObj({k:'mark',m:ms[i],e,x,y,off:(i-(Math.min(3,ms.length)-1)/2)*18,top,d:1});
  const fn=fx.o.n||4;
  if(fx.dl==='flurry'&&main){for(let n=1;n<=fn;n++)fx.q.push({t:fx.t+n*(fn>6?.045:.07),f:()=>{SPIMP.gold(x+sR(-14,14)*z,y+sR(-14,14)*z,z*.7,0,fx,tg,false);spShake(.1)}});fx.q.push({t:fx.t+(fn+1)*(fn>6?.045:.07),f:()=>{spRing(x,y,86*z,.4,'#ffe27a',3.4,.95,1);spRing(x,y+16*z,100*z,.5,'#ffd060',2,.6,.28);spFlash('255,235,170',.4,.1);spShake(.34);spStop(.05)}})}
  if((fx.dl==='crescent'||fx.dl==='bash')&&main&&fx.o.n>1)for(let n=1;n<fx.o.n;n++)fx.q.push({t:fx.t+n*.13,f:()=>{SPIMP[fx.el](x,y,z*.95,0,fx,tg,false);spShake(.2)}});
}
function spRelease(tg,el){
  if(tg.rel)return;tg.rel=1;const e=tg.e,c=(SPFX.held.get(e)||1)-1;if(c>0)SPFX.held.set(e,c);else SPFX.held.delete(e);
  if(e.hp>0||e.dying>0)e.flash=Math.max(e.flash||0,SPFLASH[el]===undefined?.5:SPFLASH[el]);
  for(const f of tg.fl){if(f.splat)f.R=Math.min(24,f.R*(1+.6*Math.min(1,tg.b)));G.floats.push(f)}tg.fl.length=0;
  if(tg.imp){for(const a of tg.imp.slice(0,3))SPIMPPLAY(a[0],a[1],a[2]);tg.imp=null}}
/* ---- party effects: heal, buffs, cleanse, raise the dead (on the portraits) ---- */
function spPort(j){const y=G.inv&&G.inv.open?238:232;return {x:portraitX(j)+19,y:y+30,top:y}}
function spParty(j,kind,col,bs){
  const p=spPort(j),x=p.x,y=p.y,c=col||'#ffe9a0';
  if(kind==='heal'){spRing(x,y,34,.6,'#9affb0',2.6,.9,.5,1);spRing(x,y+6,22,.45,'#ffe9a0',1.8,.8,.5,1);sObj({k:'pic',n:'heal',x,y,s:60,d:.85,g0:.7,a:.45,h:1});{const gp=pAdd(PK.GLOW,x,y,0,0,.55,12,34,'#9affb0',0,1);gp.al=.5}
    for(let i=sN(18);i>0;i--)pAdd(PK.MOTE,x+sR(-17,17),y+sR(8,26),sR(-5,5),sR(-80,-34),sR(.7,1.2),sR(2.5,4.5),sR(2.5,4.5),['#9affb0','#ffe9a0','#ffffff'][i%3],0,1)}
  else if(kind==='cleanse'){sObj({k:'band',x,y,c:'#d8f4ff',d:.8,h:1});spRing(x,y,30,.5,'#bfeaff',2,.8,.5,1);for(let i=sN(12);i>0;i--)pAdd(PK.MOTE,x+sR(-17,17),y+sR(8,26),sR(-4,4),sR(-70,-30),sR(.6,1),sR(2.5,4),sR(2.5,4),i%2?'#d8f4ff':'#ffffff',0,1)}
  else if(kind==='rise'){sObj({k:'column',x,y,c:'#ffd860',w:44,d:1.0,h:1});spRing(x,y+14,38,.7,'#ffe27a',2.6,.9,.45,1);spRing(x,y,26,.5,'#fff6c8',2,.8,.45,1);sBurst(2,PK.GLOW,x,y,0,0,.7,.75,16,56,'#ffd860',0,undefined,undefined,1);
    for(let i=sN(22);i>0;i--)pAdd(PK.MOTE,x+sR(-18,18),y+sR(8,30),sR(-6,6),sR(-95,-40),sR(.8,1.4),sR(3,5),sR(3,5),i%2?'#fff2b0':'#ffd860',0,1)}
  else{ // a buff: the style says how it looks
    const st=bs||'ward';
    if(st==='rage'){for(let i=sN(10);i>0;i--)pAdd(PK.TONGUE,x+sR(-15,15),y+sR(14,28),sR(-8,8),sR(-90,-40),sR(.5,.8),sR(11,18),sR(11,18),'fire',-30,1);sBurst(2,PK.GLOW,x,y,0,0,.6,.65,14,44,'#ff4030',0,undefined,undefined,1);spRing(x,y,30,.5,'#ff7050',2.4,.9,.5,1)}
    else if(st==='mirror'){sObj({k:'ghost',j,y,d:.9,h:1});sObj({k:'band',x,y,c:'#9ac8ff',d:.8,h:1});for(let i=sN(10);i>0;i--)pAdd(PK.MOTE,x+sR(-22,22),y+sR(-22,22),sR(-8,8),sR(-30,-5),sR(.6,1),3,4,'#d0e4ff',0,1)}
    else if(st==='bless'){sObj({k:'shaft',x,y,y0:y-66,w:46,d:.85,h:1});sObj({k:'band',x,y,c:'#ffe27a',d:.85,h:1});for(let i=sN(14);i>0;i--)pAdd(PK.MOTE,x+sR(-17,17),y+sR(0,26),sR(-5,5),sR(-60,-25),sR(.8,1.2),sR(2.5,4),sR(2.5,4),i%2?'#fff2b0':'#ffd860',0,1)}
    else if(st==='vanish'){for(let i=sN(10);i>0;i--)pAdd(PK.SMOKE,x+sR(-16,16),y+sR(-16,20),sR(-12,12),sR(-30,-8),sR(.6,.95),8,sR(20,28),'#2a1a40',-3,1);for(let i=sN(10);i>0;i--)pAdd(PK.MOTE,x+sR(-18,18),y+sR(-20,24),sR(-10,10),sR(-40,-10),sR(.5,.9),3,4,'#b890ff',0,1);spRing(x,y,26,.45,'#8a58d8',2,.7,.5,1)}
    else if(st==='bark'){for(let i=sN(10);i>0;i--){const p2=pAdd(PK.LEAF,x+sR(-18,18),y+sR(10,28),sR(-14,14),sR(-60,-25),sR(.7,1.1),sR(3,5),sR(3,5),['#6ac040','#4a9a30','#9ae060'][i%3],0,1);p2.vr=sR(-8,8)}sObj({k:'band',x,y,c:'#8aa860',d:.8,h:1});spRing(x,y,28,.5,'#9ac060',2,.8,.5,1)}
    else if(st==='banner'){sObj({k:'band',x,y,c:'#ffd860',d:.85,h:1});sObj({k:'band',x,y:y-6,c:'#fff0b0',d:.7,h:1});for(let i=sN(12);i>0;i--)pAdd(PK.MOTE,x+sR(-18,18),y+sR(4,28),sR(-4,4),sR(-70,-30),sR(.7,1.1),sR(3,4.5),sR(3,4.5),'#ffe070',0,1)}
    else{sObj({k:'band',x,y,c,d:.85,h:1});spRing(x,y,30,.55,c,2.4,.9,.5,1);sBurst(2,PK.GLOW,x,y,0,0,.5,.55,12,40,c,0,undefined,undefined,1);for(let i=sN(14);i>0;i--)pAdd(PK.MOTE,x+sR(-18,18),y+sR(6,28),sR(-5,5),sR(-65,-28),sR(.7,1.1),sR(2.5,4),sR(2.5,4),i%2?c:'#ffffff',0,1)}}
}
/* ---- the spell book: how each spell looks. [element, delivery, buff style] ---- */
const SPREG={
 'pw:Power Strike':['smash','smash'],'pw:Cleave':['smash','crescent',0,{n:2}],'pw:Battle Cry':['shout','wave','rage',{amb:1}],'pw:Shield Wall':[0,0,'ward'],'pw:Skullsplitter':['smash','smash',0,{big:1}],"pw:Titan's Fury":['smash','smash',0,{big:1}],'pw:Worldsplitter':['smash','smash',0,{big:1}],
 'pw:Rage Blow':['smash','smash'],'pw:Bloodlust':[0,0,'rage'],pw_thunderous_roar:['shout','wave'],'pw:Savage Roar':['shout','wave'],'pw:Skull Cleaver':['smash','smash',0,{big:1}],'pw:Whirlwind':['smash','crescent',0,{n:1}],'pw:Avatar of Ruin':['smash','smash',0,{big:1}],"pw:Mountain's Wrath":['smash','smash',0,{big:1}],
 'pw:Smite':['holy','smite'],'pw:Divine Shield':[0,0,'bless'],'pw:Righteous Blow':['holy','smite'],'pw:Holy Wrath':['holy','sky'],'pw:Judgment':['holy','smite'],'pw:Sunbrand':['holy','smite'],'pw:Lay on Hands':[0,0,'heal'],
 'pw:Aimed Shot':['wood','arrow',0,{n:1}],'pw:Pinning Shot':['wood','arrow',0,{n:1,pin:1}],'pw:Rapid Fire':['wood','arrow',0,{n:3}],"pw:Hunter's Mark":[0,0,'bark'],'pw:Heartseeker':['wood','arrow',0,{n:1,long:1}],'pw:Arrow Storm':['wood','rain'],'pw:Killing Shot':['wood','arrow',0,{n:1,long:1}],
 'pw:Volley':['wood','arrow',0,{n:2}],'pw:Piercing Shot':['wood','arrow',0,{n:1,long:1}],'pw:Triple Shot':['wood','arrow',0,{n:3}],'pw:Arrow Rain':['wood','rain'],'pw:Perfect Shot':['wood','arrow',0,{n:1,long:1}],'pw:Starfall Shot':['gold','rain'],
 'pw:Twin Stab':['steel','strike',0,{n:2}],'pw:Smoke Bomb':['smoke','burst'],'pw:Flurry':['steel','strike',0,{n:3}],'pw:Death Mark':['deep','strike',0,{n:1,long:1}],'pw:Shadowstrike':['deep','strike',0,{n:2,dark:1}],'pw:Sense Traps':['gold','scan'],'pw:Moonless Kill':['deep','strike',0,{n:1,dark:1,long:1}],
 'pw:Backstab':['deep','strike',0,{n:1}],'pw:Vanish':[0,0,'vanish'],'pw:Nerve Strike':['steel','strike',0,{n:1}],'pw:Assassinate':['deep','strike',0,{n:1,long:1}],'pw:Needle in the Dark':['deep','strike',0,{n:1,dark:1}],"pw:Reaper's Kiss":['deep','strike',0,{n:2,dark:1}],
 'pw:Palm Strike':['gold','punch'],'pw:Flurry of Blows':['gold','flurry',0,{n:4}],'pw:Stunning Fist':['gold','punch'],'pw:Dragon Kick':['smash','smash'],'pw:Fist of the Mountain':['smash','smash',0,{big:1}],'pw:Hundred-Fold Palm':['gold','flurry',0,{n:8}],
 'pw:Headbutt':['bash','bash'],'pw:Charge':['bash','bash'],'pw:Rampage':['bash','bash',0,{n:3}],'pw:Legend of the Mountain':['smash','smash',0,{big:1}],'pw:Avalanche of Horns':['smash','smash',0,{big:1}],
 pw_arcane_ruin:['arcane','lance'],pw_starfall:['arcane','rain'],pw_soul_rend:['shadow','burst'],pw_annihilating_ray:['ruin','beam'],pw_hallowed_fire:['holy','sky'],pw_sunlance:['holy','lance'],pw_dawn_of_judgement:['holy','sky'],
 'pw:Frost Nova':['frost','blizzard'],
 w10:['shout','wave'],w20:[0,0,'ward'],w30:['blood','slash'],w40:[0,0,'banner'],w50:['shout','wave'],
 b10:['shout','wave'],b20:['blood','slash'],b30:[0,0,'rage'],b40:['earth','wave'],b50:[0,0,'rage'],
 p10:[0,0,'heal'],p20:['holy','chains'],p30:[0,0,'bless'],p40:['holy','sky'],p50:['holy','sky','bless'],
 r10:['nature','roots'],r20:[0,0,'bark'],r30:['poison','arrow'],r40:['poison','swarm'],r50:['nature','roots'],
 a10:['fire','arrow'],a20:['gold','arrow'],a30:['gold','rain'],a40:['shadow','arrow'],a50:['holy','arrow'],
 t10:['gold','steal'],t20:['smoke','burst'],t30:['poison','slash'],t40:['arcane','burst'],t50:['gold','steal'],
 s10:['blood','slash'],s20:['blood','mark'],s30:['shadow','wave'],s40:['poison','burst'],s50:['shadow','slash'],
 m10:['arcane','burst'],m20:['arcane','poly'],m30:[0,0,'mirror'],m40:['disint','beam'],m50:['arcane','time'],m30b:['arcane','lance'],
 z10:['shadow','wave'],z20:['arcane','poly'],z30:['chaos','burst'],z40:['fire','breath'],z50:['shadow','rift'],z30b:['bolt','chain'],
 c10:[0,0,'cleanse'],c20:['holy','wave'],c30:[0,0,'bless'],c40:['holy','sky'],c50:[0,0,'rise'],c40h:[0,0,'heal'],c30b:['holy','sky'],
 k10:['gold','punch'],k20:[0,0,'heal'],k30:['arcane','punch'],k40:['arcane','sleep'],k50:['gold','flurry'],
 g10:['shout','wave'],g20:[0,0,'heal'],g30:['arcane','poly'],g40:['earth','burst'],g50:['earth','wave'],
 'sp:fire':['fire','ball'],'sp:frost':['frost','ball'],'sp:light':['holy','light'],
 'pw:Fireball':['fire','ball'],'pw:Chain Lightning':['bolt','chain'],'pw:Meteor':['fire','meteor'],'pw:Mage Armor':[0,0,'ward'],
 'pw:Siphon':['shadow','drain'],'pw:Lightning Storm':['bolt','sky'],'pw:Cataclysm':['ruin','meteor'],
 'pw:Blessing':[0,0,'bless'],'pw:Mend':[0,0,'heal'],'pw:Revive':[0,0,'rise'],'pw:Greater Heal':[0,0,'heal'],'pw:Divine Intervention':[0,0,'rise'],'pw:Heal':[0,0,'heal']};
/* a spell that has no entry (one added later) gets a look from its name, its colour and what it does */
function spWeapon(info){
  const n=(info.name||'').toLowerCase(),c=info.cls,t=info.type,area=Array.isArray(info.aim),rng=info.range||3;
  const dark=/shadow|dark|night|moon|reaper|needle|kiss|vanish|death|silent|grave|void|murder/.test(n);
  if(t==='sense')return {el:'gold',dl:'scan',bs:null};
  if(t==='buff'||t==='heal'||t==='healx'||t==='revive'){
    if(/cry|shout|roar/.test(n))return {el:'shout',dl:'wave',bs:'rage',o:{amb:1},amb:true};
    return {el:null,dl:null,bs:/shield|ward|wall|armor|guard|aegis/.test(n)?'ward':/cry|rage|blood|fury|frenzy|roar|lust/.test(n)?'rage':/holy|divine|bless|light/.test(n)?'bless':/vanish|shadow|cloak|hide|mist/.test(n)?'vanish':c==='Ranger'||c==='Archer'?'bark':c==='Paladin'||c==='Priest'?'bless':'banner'}}
  if(t==='daze')return /smoke|bomb|fog|mist/.test(n)||c==='Thief'?{el:'smoke',dl:'burst',bs:null}:{el:'shout',dl:'wave',bs:null};
  if(t==='aoe'){if(c==='Ranger'||c==='Archer')return {el:'wood',dl:'rain',bs:null};if(c==='Paladin')return {el:'holy',dl:'sky',bs:null};if(c==='Monk')return {el:'gold',dl:'flurry',bs:null,o:{n:3}};return {el:'smash',dl:'crescent',bs:null,o:{n:1}}}
  if(t==='shot'||t==='volley'||t==='ranged'){const el=/fire|flame|burn|ember/.test(n)?'fire':/poison|venom|toxic/.test(n)?'poison':/shadow|dark|cursed|black/.test(n)?'shadow':/holy|sun|dawn|star/.test(n)?'holy':'wood';
    return {el,dl:/net|snare|trap/.test(n)?'net':'arrow',bs:null,o:{n:t==='volley'?2:t==='ranged'?3:(/rapid|triple|multi|volley|barrage/.test(n)?3:1),long:/pierc|perfect|kill|heart|snipe|star|true|deadeye/.test(n)||rng>=5}}}
  if(/knife|knives|dagger|throw/.test(n))return {el:'steel',dl:'knives',bs:null,o:{n:5}};
  if(c==='Thief'||c==='Assassin')return dark||c==='Assassin'&&/stab|assassin|kill|death/.test(n)?{el:'deep',dl:'strike',bs:null,o:{n:t==='multi'?2:1,dark,long:/kill|death|assassin|patient/.test(n)}}:{el:'steel',dl:'strike',bs:null,o:{n:t==='multi'?3:2}};
  if(c==='Paladin')return {el:'holy',dl:'smite',bs:null};
  if(c==='Monk')return t==='multi'||/flurry|hundred|thousand/.test(n)?{el:'gold',dl:'flurry',bs:null,o:{n:t==='multi'?4:7}}:/mountain|kick|dragon/.test(n)?{el:'smash',dl:'smash',bs:null}:{el:'gold',dl:'punch',bs:null};
  if(c==='Goat')return /legend|avalanche|mountain|horns/.test(n)?{el:'smash',dl:'smash',bs:null,o:{big:1}}:{el:'bash',dl:'bash',bs:null,o:{n:t==='multi'?3:1}};
  if(t==='multi'||/whirl|cleave|sweep|swing|spin|arc/.test(n))return {el:'smash',dl:'crescent',bs:null,o:{n:t==='multi'?2:1}};
  return {el:'smash',dl:'smash',bs:null,o:/split|titan|ruin|wrath|fury|mountain|legend|crush|skull|doom|world/.test(n)?{big:1}:null}}
function spAuto(info){
  if(!SPCASTERS.includes(info.cls)&&SPWT.concat(['buff','heal','healx','revive']).includes(info.type)&&!/frost|ice|icicle|blizzard|freez|glacier|winter|hail/i.test(info.name||''))return spWeapon(info);
  const n=(info.name||'').toLowerCase(),ks=(info.fx||[]).map(f=>f[0]),has=k=>ks.includes(k),aim=info.aim,ally=aim==='party'||aim==='self'||aim==='dead'||aim==='front|ally';
  const foeFx=ks.some(k=>!['buff','heal','healpct','cleanse','revive','feed'].includes(k));
  if(ally&&!foeFx||info.type==='buff'||info.type==='healx'||info.type==='revive'||info.type==='heal')return {el:null,dl:null,bs:has('revive')||info.type==='revive'?'rise':has('heal')||has('healpct')||info.type==='healx'||info.type==='heal'?'heal':has('cleanse')?'cleanse':'ward'};
  let el='arcane';
  if(/fire|flame|burn|inferno|meteor|dragon|ember|blaze|scorch/.test(n)||has('burn'))el='fire';
  else if(/frost|ice|icicle|spike|freez|blizzard|glacier|winter|hail|cold|snow|nova|chill/.test(n))el='frost';
  else if(/lightning|thunder|storm|bolt|shock|spark/.test(n))el='bolt';
  else if(/holy|smite|divine|sacred|light|angel|radiant|bless|undead|wrath/.test(n))el='holy';
  else if(/poison|venom|toxic|cloud|plague|acid|wasp|swarm/.test(n)||has('poison'))el='poison';
  else if(/shadow|dark|night|death|curse|drain|siphon|terror|fear|wail|doom|void/.test(n)||has('fear')||has('curse'))el='shadow';
  else if(/earth|stone|rock|quake|shatter|stampede|charge|boulder/.test(n))el='earth';
  else if(/root|thorn|forest|vine|bark|nature|entangle/.test(n))el='nature';
  else if(/rend|claw|slash|stab|garrote|bleed|blade|cut/.test(n)||has('bleed'))el='blood';
  else if(/roar|shout|bleat|cry|howl/.test(n))el='shout';
  else if(/wind|gale|gust|tornado|cyclone/.test(n))el='wind';
  else if(/smoke|fog|mist/.test(n))el='smoke';
  const area=Array.isArray(aim)||aim==='all';let dl='burst';
  if(['fire','frost','arcane','poison','shadow','disint','gold'].includes(el))dl=has('hold')||has('poly')?'burst':'ball';
  if(el==='frost'&&area)dl='blizzard';if(el==='bolt')dl=area?'chain':'sky';if(el==='holy')dl='sky';if(el==='blood')dl=area?'burst':'slash';if(el==='nature')dl='roots';if(el==='shout'||el==='earth'&&area)dl='wave';
  if(has('poly'))dl='poly';if(has('steal'))dl='steal';
  return {el,dl,bs:null,o:/spike|icicle/.test(n)?{sp:1}:null}}
function spReg(info){const r=SPREG[info.id];return r?{el:r[0]||null,dl:r[1]||null,bs:r[2]||null,o:r[3]||null,amb:!!(r[3]&&r[3].amb)}:spAuto(info)}
/* ---- reading the cast: which spell, who is hit ---- */
const SPCASTERS=['Mage','Sorcerer','Priest'];
const SPWT=['melee','multi','butt','twin','backstab','shot','volley','ranged','aoe','daze','sense','drain'];
function spInfo(i){
  const P=curPower(i);if(!P||P.pas||P.act===false)return null;const cls=HERO_DEF[i].cls,t=P.type;let id,name=P.name,aim=P.aim,fx=P.fx,range=P.range||4;
  if(t==='mx')id=P.mx;
  else if(t==='spell'){const sp=specialInfo(i);if(!sp.spell)return null;const S=SPELLS[sp.spell];id='sp:'+sp.spell;name=S.n;range=S.range||3;aim=S.self?'self':'front'}
  else{
    id='pw:'+P.name;
    if(t==='aoe'||t==='daze')aim=['area',P.range||3];
    else if(t==='drain'){aim='front';range=1}
    else if(['melee','multi','butt','twin','backstab'].includes(t)){aim='front';range=1}
    else if(t==='shot'||t==='volley'||t==='ranged'){aim='front';range=P.range||3}
    else if(['buff','heal','healx','revive','sense'].includes(t))aim='party';
    else return null}
  return {id,name,aim,fx,col:P.col,range,type:t,cls}}
function spPreTargets(info){const aim=info.aim,out=[];
  if(aim==='front'||aim==='front|ally'){const f=frontEnemy(info.range||4);if(f)out.push(f.e)}
  else if(aim==='all'||Array.isArray(aim)){const n=aim==='all'?8:aim[1];for(const e of G.enemies)if(e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=n&&hasLOS(G.P.x,G.P.y,e.x,e.y))out.push(e)}
  return out}
function spStat(e){const s=e.st||{};return [s.hold|0,s.sleep|0,s.fear|0,s.curse|0,s.blind|0,s.confuse|0,s.vuln|0,s.slow|0,s.bleed?s.bleed.n|0:0,s.poison?s.poison.n|0:0,s.burn?s.burn.n|0:0,e.poly?1:0]}
function spSnap(info){const S={en:new Map(),hp:G.heroes.map(h=>h.hp),al:G.heroes.map(h=>h.alive),bf:G.buffs?G.buffs.slice():[],pre:spPreTargets(info)};
  for(const e of G.enemies)if(e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=12)S.en.set(e,{hp:e.hp,st:spStat(e)});return S}
const SPDL={ // [charge, travel, stagger]
 ball:[.16,.26,.05],meteor:[.14,.4,.06],arrow:[.08,.15,.045],lance:[.12,.12,.045],drain:[.12,.18,.04],beam:[.14,.06,.03],breath:[.12,.24,.04],rain:[.1,.22,.035],
 sky:[.14,.1,.05],wave:[.1,.12,.06],chain:[.14,.06,.09],burst:[.1,.05,.03],slash:[.08,.05,.04],roots:[.1,.06,.04],poly:[.1,.05,.04],punch:[.08,.05,.04],rift:[.12,.1,.05],steal:[.08,.05,.03],mark:[.08,.05,.03],swarm:[.1,.05,.03],chains:[.1,.08,.04],flurry:[.08,.05,.04],sleep:[.1,.05,.03],time:[.1,.12,.03],light:[.1,.3,0]};
Object.assign(SPDL,{strike:[.03,.04,.05],smash:[.08,.05,.06],bash:[.06,.05,.06],crescent:[.05,.04,.05],smite:[.08,.05,.05],knives:[.05,.22,.04],blizzard:[.12,.1,.05],net:[.06,.05,.05],scan:[.1,.1,0]});
const SPNOCH=new Set(['strike','smash','bash','crescent','smite','punch','flurry','slash','knives','net','scan','burst','poly','steal','mark','roots','swarm','chains','sleep']);
const SPPROJ=new Set(['ball','meteor','arrow','lance','drain','beam','breath','rain','knives']),SPOWN=new Set(['beam','breath','rain','knives']),SPSHARE=new Set(['ball','meteor','arrow','lance','drain']);
function spSrc(i){return {x:210+(i-1.5)*26,y:196}}
function spAfter(i,info,pre,pf,fs,f0,cap){
  if(PFX.length>pf)PFX.length=pf;if(FXS.length>fs)FXS.length=fs;try{SPELL_KIND=null}catch(e){}
  const reg=spReg(info),P=reg.el?SPPAL[reg.el]:SPPAL.holy;
  const list=[];
  for(const [e,s0] of pre.en){const d=s0.hp-e.hp,st=spStat(e),ms=[];for(let k=0;k<9;k++)if(st[k]>s0.st[k])ms.push(SPKEYS[k]);const ch=d>0||ms.length||st[9]>s0.st[9]||st[10]>s0.st[10]||st[11]>s0.st[11];if(ch)list.push({e,dmg:Math.max(0,d),marks:ms,dead:e.hp<=0})}
  if(!list.length&&reg.el)for(const e of pre.pre)list.push({e,dmg:0,marks:[],dead:e.hp<=0});
  list.sort((a,b)=>(Math.abs(a.e.x-G.P.x)+Math.abs(a.e.y-G.P.y))-(Math.abs(b.e.x-G.P.x)+Math.abs(b.e.y-G.P.y)));
  const foes=reg.el&&reg.dl!=='light'?list.slice(0,7):[];
  const fx={i,info,el:reg.el,dl:reg.dl,bs:reg.bs,o:reg.o||{},t:0,tg:[],q:[],n:0,src:spSrc(i),a0:{x:spSrc(i).x+(i<2?-70:70),y:206},tc:0,end:.4,col:info.col};
  const dl=SPDL[reg.dl]||SPDL.burst;fx.tc=dl[0];let tMain=fx.tc+dl[1];
  foes.forEach((o,n)=>{const e=o.e;
    const tg={e,n,dmg:o.dmg,marks:o.marks,fl:[],imp:n===0?cap.imp:null,b:Math.min(1.5,o.dmg/60+(o.dead?.3:0)),proj:(n===0&&SPPROJ.has(reg.dl))||SPOWN.has(reg.dl),did:0,rel:0,prev:n>0?foes[n-1].e:null,noTop:reg.dl==='chain'&&n>0};
    tg.ti=SPSHARE.has(reg.dl)&&n>0?tMain+.04+(n-1)*dl[2]:fx.tc+dl[1]+n*dl[2];if(n===0)tMain=tg.ti;
    if(e.flash>0)e.flash=0;SPFX.held.set(e,(SPFX.held.get(e)||0)+1);fx.tg.push(tg)});
  if(!foes.length&&cap.imp.length)for(const a of cap.imp.slice(0,2))SPIMPPLAY(a[0],a[1],a[2]);
  for(const tg of fx.tg)if(tg.e.chilled>0)tg.e.chillK=reg.el==='frost'?'ice':'daze';
  const fl=G.floats.splice(f0);
  for(const f of fl){if(f.y<215&&fx.tg.length){let best=fx.tg[0],bd=1e9;for(const tg of fx.tg){const d=Math.abs((tg.e.sx||210)-f.x);if(d<bd){bd=d;best=tg}}best.fl.push(f)}else G.floats.push(f)}
  fx.end=Math.max(.3,...fx.tg.map(t=>t.ti+.05),fx.tc+.05);
  const heal=[],rise=[];G.heroes.forEach((h,j)=>{if(h.alive&&pre.al[j]===false)rise.push(j);else if(h.alive&&h.hp>pre.hp[j])heal.push(j)});
  const bj=new Set();for(const b of G.buffs||[])if(!pre.bf.includes(b)){if(b.hi<0)G.heroes.forEach((h,j)=>h.alive&&bj.add(j));else bj.add(b.hi)}
  const hasCl=(info.fx||[]).some(f=>f[0]==='cleanse'),pt=reg.dl==='drain'?tMain+.2:0;
  const party=[];rise.forEach(j=>party.push([j,'rise']));heal.forEach(j=>party.push([j,reg.bs==='rise'?'rise':'heal']));bj.forEach(j=>party.push([j,'buff']));
  if(hasCl&&!heal.length&&!bj.size)livingHeroes().forEach(j=>party.push([j,'cleanse']));
  const run=()=>{for(const [j,k] of party)spParty(j,k,info.col||'#ffe9a0',reg.bs)};
  if(party.length){if(pt>0)fx.q.push({t:pt,f:run});else run();spSnd(party.some(p=>p[1]==='buff')?'aura':'heal',pt);if(party.some(p=>p[1]==='rise'))spSnd('chime',pt+.05)}
  if(foes.length||reg.dl==='light'||reg.amb||reg.dl==='scan'){
    const pp=spPort(i);if(!SPNOCH.has(reg.dl)){pAdd(PK.GLOW,pp.x,pp.top+4,0,-18,.4,10,30,P[1],0,1);
    if(fx.tc>.09)spFlash(rgbOf(P[1]),reg.el==='frost'?.3:.24,.16,1)}
    if(reg.dl==='light')spSpecialLight(fx);
    else if(['ball','meteor','breath','lance','drain'].includes(reg.dl))spSnd('whoosh',0);
    if(reg.el==='frost'&&!SPNOCH.has(reg.dl))spSnd('cold',0);if(reg.dl==='arrow'||reg.dl==='rain')spSnd('twang',0);if(reg.dl==='knives')spSnd('swoosh',0);if(reg.amb)spSnd('rumble',0);
    if(foes.length&&SPSND[reg.el])spSnd(SPSND[reg.el],tMain);
    if(['wave','time','rift','blizzard','scan'].includes(reg.dl))spWaveStart(fx);
  }
  if(!foes.length&&!party.length&&reg.dl!=='light'&&!fx.q.length)return;
  SPFX.fx.push(fx);SPFX.live=1;
}
function spSpecialLight(fx){const pp=spPort(fx.i);sObj({k:'orb',x:pp.x,y:pp.top,x1:210,y1:70,d:.9,h:1});spFlash('255,240,190',.38,.6,1,.2);for(let i=sN(16);i>0;i--)pAdd(PK.MOTE,sR(40,380),sR(20,150),sR(-6,6),sR(8,28),sR(.8,1.4),3,5,'#fff2b0',0);spSnd('chime',.15)}
function spBlizzard(fx){
  spFlash('205,228,255',.22,.9,1,0,0);
  for(let i=0;i<7;i++)fx.q.push({t:i*.06,f:()=>{const q=SPFX.q();for(let k=Math.round(16*q);k>0;k--)pAdd(PK.GLOW,-10,sR(10,200),sR(260,430),sR(-45,45),sR(.6,.9),sR(2,4),sR(1,2),k%2?'#ffffff':'#bfe4ff',0);for(let k=Math.round(3*q);k>0;k--)pAdd(PK.STREAK,-10,sR(10,200),sR(520,780),sR(-30,30),sR(.3,.45),1.2,1.2,'#e8f6ff',0)}})}
function spWaveStart(fx){const P=SPPAL[fx.el]||SPPAL.shout,s=fx.src;
  if(fx.dl==='time'){fx.q.push({t:fx.tc,f:()=>{sObj({k:'clock',x:210,y:98,r:70,d:.8});spFlash('200,215,255',.4,.2);spRing(210,100,230,.5,'#c8d8ff',3,.8,.6)}});return}
  if(fx.dl==='rift')return;
  if(fx.dl==='scan'){fx.q.push({t:0,f:()=>{spRing(210,104,240,.6,'#ffe9a0',3,.8,.5);spRing(210,104,150,.5,'#fff6c8',2,.6,.5);for(let i=sN(14);i>0;i--)pAdd(PK.MOTE,sR(40,380),sR(30,170),sR(-8,8),sR(-30,-6),sR(.6,1),3,4,'#fff2b0',0)}});return}
  if(fx.dl==='blizzard')spBlizzard(fx);
  fx.q.push({t:0,f:()=>{spRing(s.x,s.y,300,.5,P[1],4.5,.9,.22);spRing(s.x,s.y,260,.55,P[0],2.4,.7,.22)}});fx.q.push({t:.09,f:()=>spRing(s.x,s.y,250,.5,P[1],3,.6,.2)})}
function spCharge(fx,dt){
  const P=SPPAL[fx.el]||SPPAL.arcane,s=fx.src,p=sCl(fx.t/Math.max(.05,fx.tc),0,1),r=4+14*p;
  ctx.globalAlpha=.6+.4*Math.sin(fx.t*55)*.5;ctx.drawImage(spGlow(P[1]),s.x-r*2.2,s.y-r*2.2,r*4.4,r*4.4);ctx.globalAlpha=1;ctx.drawImage(spGlow(P[0]),s.x-r,s.y-r,r*2,r*2);
  if(fx.el==='frost'&&fx.n<150&&Math.random()<.85*SPFX.q()){pAdd(PK.MOTE,s.x+sR(-20,20),s.y-sR(34,70),sR(-6,6),sR(55,100),sR(.28,.42),3,3,'#e8fbff',0);fx.n++}
  if(fx.n<150&&Math.random()<.9*SPFX.q()){const a=sR(0,TAU),R=sR(24,36);pAdd(PK.SPARK,s.x+Math.cos(a)*R,s.y+Math.sin(a)*R*.8,-Math.cos(a)*R/.1,-Math.sin(a)*R*.8/.1,.1,2.2,2.2,P[0],0);fx.n++}}
function spBody(fx,x,y,s,ang){
  const el=fx.el,P=SPPAL[el]||SPPAL.arcane;ctx.globalAlpha=.85;ctx.drawImage(spGlow(P[1]),x-s*2.4,y-s*2.4,s*4.8,s*4.8);
  if(el==='fire'||el==='ruin'){for(let k=0;k<3;k++){ctx.save();ctx.globalAlpha=.95;ctx.translate(x,y);ctx.rotate(ang-Math.PI/2+(k-1)*.42+Math.sin(fx.t*40+k*2)*.1);const w=s*1.35,h=s*(3.4+(k%2)*.9);ctx.drawImage(spTongue(el==='ruin'?'ruin':'fire'),-w/2,-h*.72,w,h);ctx.restore()}}
  else if(el==='frost'){for(let k=0;k<3;k++){ctx.save();ctx.globalAlpha=.9;ctx.translate(x,y);ctx.rotate(ang-Math.PI/2+(k-1)*.4+Math.sin(fx.t*34+k*2)*.08);const w=s*1.25,h=s*(3.2+(k%2)*.8);ctx.drawImage(spTongue('ice'),-w/2,-h*.72,w,h);ctx.restore()}
    ctx.save();ctx.globalAlpha=1;ctx.translate(x,y);ctx.rotate(fx.t*12);ctx.fillStyle='#f0ffff';ctx.strokeStyle='#ffffff';ctx.lineWidth=.8;for(let k=0;k<3;k++){ctx.rotate(TAU/3);ctx.beginPath();ctx.moveTo(0,-s*1.5);ctx.lineTo(s*.4,-s*.2);ctx.lineTo(0,s*.3);ctx.lineTo(-s*.4,-s*.2);ctx.closePath();ctx.fill();ctx.stroke()}ctx.restore()}
  else if(el==='arcane'||el==='shadow'||el==='disint'||el==='poison'){for(let k=0;k<2;k++){const a=fx.t*16+k*Math.PI,r=s*1.2;ctx.globalAlpha=.9;ctx.drawImage(spGlow(P[0]),x+Math.cos(a)*r-s*.4,y+Math.sin(a)*r*.7-s*.4,s*.8,s*.8)}}
  ctx.globalAlpha=1;ctx.drawImage(spGlow(P[0]),x-s*1.3,y-s*1.3,s*2.6,s*2.6);ctx.drawImage(spGlow('#ffffff'),x-s*.7,y-s*.7,s*1.4,s*1.4)}
function spTrail(fx,x,y,s,ang,big){
  if(fx.n>150)return;const q=SPFX.q()*(big?1.5:1),el=fx.el,bx=-Math.cos(ang),by=-Math.sin(ang),em=k=>Math.random()<k*q;
  if(el==='fire'||el==='ruin'){
    for(let k=0;k<2;k++)if(em(1)){pAdd(PK.GLOW,x+sR(-1,1)*s*.4,y+sR(-1,1)*s*.4,bx*30+sR(-12,12),by*30+sR(-12,12)-18,sR(.22,.36),s*.9,s*.25,el==='ruin'?'#ff4a80':'#ff8a24',0);fx.n++}
    if(em(.5)){pAdd(PK.SMOKE,x+sR(-3,3),y+sR(-3,3),bx*10,by*10-22,sR(.45,.7),s*.35,s*1.05,'#3a3028',-8);fx.n++}
    if(em(.75)){pAdd(PK.STREAK,x,y,bx*sR(120,230)+sR(-60,60),by*sR(120,230)+sR(-60,60),sR(.15,.28),1.3,1.3,'#ffd070',200);fx.n++}
    if(em(.4)){pAdd(PK.EMBER,x,y,sR(-20,20),sR(-30,10),sR(.4,.7),2.4,.8,'#ffa040',-10);fx.n++}}
  else if(el==='frost'){if(em(1)){pAdd(PK.GLOW,x,y,bx*20,by*20,sR(.2,.32),s*.8,s*.2,'#9ae0ff',0);fx.n++}if(em(.9)){pAdd(PK.MOTE,x+sR(-4,4),y+sR(-4,4),bx*20+sR(-20,20),by*20+sR(-20,20),sR(.3,.5),3,3,'#ffffff',0);fx.n++}if(em(.25)){const p=pAdd(PK.SHARD,x,y,bx*40+sR(-30,30),by*40+sR(-10,40),sR(.3,.5),4,4,'#cfeeff',200);p.vr=sR(-8,8);fx.n++}}
  else if(el==='shadow'){if(em(1)){pAdd(PK.SMOKE,x,y,bx*14,by*14,sR(.4,.6),s*.6,s*1.4,'#240a40',-6);fx.n++}if(em(.8)){pAdd(PK.GLOW,x,y,bx*20,by*20,sR(.2,.3),s*.7,s*.2,'#8a50e0',0);fx.n++}}
  else if(el==='poison'){if(em(1)){pAdd(PK.GLOW,x,y,bx*20,by*20,sR(.2,.32),s*.8,s*.2,'#7ade40',0);fx.n++}if(em(.5)){pAdd(PK.BUB,x+sR(-4,4),y+sR(-4,4),bx*10,-18,sR(.4,.7),1.5,3.5,'#b8ff80',-4);fx.n++}if(em(.4)){pAdd(PK.DRIP,x,y,0,60,.3,5,0,'#9aff58',160);fx.n++}}
  else{const c=P0(el);if(em(1)){pAdd(PK.GLOW,x,y,bx*24,by*24,sR(.2,.32),s*.8,s*.2,c[1],0);fx.n++}if(em(.8)){pAdd(PK.MOTE,x+sR(-3,3),y+sR(-3,3),bx*20+sR(-20,20),by*20+sR(-20,20),sR(.3,.5),3,3,c[0],0);fx.n++}}}
const P0=el=>SPPAL[el]||SPPAL.arcane;
function spArrowDraw(x,y,ang,len,P,al,long){
  const c=Math.cos(ang),sn=Math.sin(ang),tx=x-c*len,ty=y-sn*len;ctx.lineCap='round';
  ctx.globalAlpha=al*.5;ctx.strokeStyle='#ffffff';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(x-c*(long?110:56),y-sn*(long?110:56));ctx.lineTo(tx,ty);ctx.stroke(); // the thin motion line
  if(long){ctx.globalAlpha=al*.35;ctx.strokeStyle=P[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-c*80,y-sn*80);ctx.lineTo(x,y);ctx.stroke()}
  ctx.globalAlpha=al;ctx.strokeStyle='#f0d8a0';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke(); // the shaft
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(x+c*5,y+sn*5);ctx.lineTo(x-c*3+sn*2.6,y-sn*3-c*2.6);ctx.lineTo(x-c*3-sn*2.6,y-sn*3+c*2.6);ctx.closePath();ctx.fill(); // the head
  ctx.fillStyle='#ff8a70';for(const sd of [1,-1]){ctx.beginPath();ctx.moveTo(tx+c*1,ty+sn*1);ctx.lineTo(tx+c*7+sn*3.6*sd,ty+sn*7-c*3.6*sd);ctx.lineTo(tx+c*8,ty+sn*8);ctx.closePath();ctx.fill()} // the fletching
  ctx.globalAlpha=1}
function spProj(fx,tg,dt){
  const e=tg.e,tx=e.sx?sCl(e.sx,12,408):210,ty=e.sy?sCl(e.sy,24,192):100,D=fx.dl,P=P0(fx.el),z=spZ(e),p=sCl((fx.t-fx.tc)/Math.max(.02,tg.ti-fx.tc),0,1);
  if(D==='ball'||D==='drain'||D==='meteor'){
    const met=D==='meteor',x0=met?tx+80:fx.src.x,y0=met?-30:fx.src.y,q=Math.pow(p,met?1.7:1.45),x=x0+(tx-x0)*q,y=y0+(ty-y0)*q,ang=Math.atan2(ty-y0,tx-x0),s=met?(10+28*q)*Math.max(.9,z):(6+19*q)*Math.max(.85,z);
    spBody(fx,x,y,s,ang);spTrail(fx,x,y,s,ang,met)}
  else if(D==='arrow'||D==='lance'){
    const lan=D==='lance',n=lan?1:(fx.o.n||1),long=!!fx.o.long||lan,x0=fx.a0.x,y0=fx.a0.y;
    for(let k=0;k<n;k++){const off=(k-(n-1)/2),pk=sCl(p*1.08-k*.03,0,1);if(pk<=0)continue;const sx=x0+off*16,sy=y0,ex=tx+off*6*z,ey=ty+off*4*z,x=sx+(ex-sx)*pk,y=sy+(ey-sy)*pk,ang=Math.atan2(ey-sy,ex-sx);
      if(lan){ctx.lineCap='round';const qt=Math.max(0,pk-.5);ctx.strokeStyle=P[1];ctx.globalAlpha=.55;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(sx+(ex-sx)*qt,sy+(ey-sy)*qt);ctx.lineTo(x,y);ctx.stroke();ctx.strokeStyle='#fff';ctx.globalAlpha=1;ctx.lineWidth=2.6;ctx.stroke();ctx.globalAlpha=.9;ctx.drawImage(spGlow(P[1]),x-9,y-9,18,18);ctx.globalAlpha=1}
      else{spArrowDraw(x,y,ang,18+6*z,P,1,long);if(fx.el!=='wood')spTrail(fx,x,y,4,ang,false)}
      if(fx.n<150&&Math.random()<.5*SPFX.q()){pAdd(PK.SPARK,x,y,sR(-30,30),sR(-30,30),.22,1.8,1.8,P[0],0);fx.n++}}}
  else if(D==='knives'){
    const n=fx.o.n||5,x0=fx.a0.x,y0=fx.a0.y;
    for(let k=0;k<n;k++){const off=(k-(n-1)/2),pk=sCl(p*1.1-k*.04,0,1);if(pk<=0)continue;const sx=x0+off*10,ex=tx+off*7*z,ey=ty+off*5*z,x=sx+(ex-sx)*pk,y=y0+(ey-y0)*pk,ang=Math.atan2(ey-y0,ex-sx),sp=fx.t*38+k*1.7;
      ctx.lineCap='round';ctx.strokeStyle='#ffffff';ctx.globalAlpha=.55;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-Math.cos(ang)*48,y-Math.sin(ang)*48);ctx.lineTo(x,y);ctx.stroke();
      ctx.save();ctx.translate(x,y);ctx.rotate(sp);ctx.scale(1.5,1.5);ctx.globalAlpha=1;ctx.fillStyle='#f4f8ff';ctx.strokeStyle='#9ab0d0';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,-6.5);ctx.lineTo(2.2,0);ctx.lineTo(0,3);ctx.lineTo(-2.2,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d8a050';ctx.fillRect(-1,3,2,3.4);ctx.restore();
      if(fx.n<150&&Math.random()<.4*SPFX.q()){pAdd(PK.SPARK,x,y,sR(-20,20),sR(-20,20),.2,1.6,1.6,'#ffffff',0);fx.n++}}ctx.globalAlpha=1}
  else if(D==='rain'){
    const wood=fx.el==='wood';
    for(let i=0;i<4;i++){const pp=sCl(p*1.2-i*.07,0,1);if(pp<=0||pp>=1)continue;const ax=tx+(i-1.5)*10,ay=ty-160*(1-pp);
      if(wood)spArrowDraw(ax,ay,Math.PI/2+.1,16,P,1,false);else{ctx.strokeStyle=P[0];ctx.lineWidth=1.6;ctx.globalAlpha=.95;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax-5*(1-pp),ay-20);ctx.lineTo(ax,ay);ctx.stroke();ctx.strokeStyle=P[1];ctx.globalAlpha=.45;ctx.lineWidth=4;ctx.stroke()}}ctx.globalAlpha=1}
  else if(D==='breath'){
    if(tg.n<4&&fx.n<150){const dx=tx-fx.src.x,dy=ty-fx.src.y,sp=Math.hypot(dx,dy)/.2,a=Math.atan2(dy,dx),q=SPFX.q();
      for(let k=0;k<2;k++)if(Math.random()<q){const aa=a+sR(-.12,.12),s2=sp*sR(.8,1.2);pAdd(PK.TONGUE,fx.src.x,fx.src.y,Math.cos(aa)*s2,Math.sin(aa)*s2,sR(.2,.28),sR(14,22),sR(18,28),'fire',0);fx.n++}
      if(Math.random()<.8*q){pAdd(PK.GLOW,fx.src.x,fx.src.y,Math.cos(a)*sp*.9+sR(-30,30),Math.sin(a)*sp*.9+sR(-30,30),.22,10,18,'#ff8a24',0);fx.n++}}}
  else if(D==='sky'&&fx.el==='holy'){const g=ctx.createLinearGradient(tx,0,tx,ty);g.addColorStop(0,'rgba(255,240,180,0)');g.addColorStop(1,`rgba(255,240,180,${.55*p})`);ctx.fillStyle=g;ctx.fillRect(tx-1-3*p,0,2+6*p,ty)}}
function spBeam(fx,dt){
  const u=(fx.t-fx.tc)/.3,a=u<.2?u/.2:1-(u-.2)/.8,P=P0(fx.el);ctx.lineCap='round';
  for(const tg of fx.tg){const e=tg.e,tx=e.sx?sCl(e.sx,12,408):210,ty=e.sy?sCl(e.sy,24,192):100,w=1+.25*Math.sin(fx.t*90);
    ctx.strokeStyle=P[1];ctx.globalAlpha=a*.45;ctx.lineWidth=11*w;ctx.beginPath();ctx.moveTo(fx.src.x,fx.src.y);ctx.lineTo(tx,ty);ctx.stroke();
    ctx.strokeStyle=P[0];ctx.globalAlpha=a*.9;ctx.lineWidth=4*w;ctx.stroke();ctx.strokeStyle='#fff';ctx.globalAlpha=a;ctx.lineWidth=1.6;ctx.stroke();
    ctx.globalAlpha=a;ctx.drawImage(spGlow(P[1]),tx-18,ty-18,36,36);
    if(fx.n<150&&Math.random()<.6*SPFX.q()){const f=Math.random();pAdd(PK.SPARK,fx.src.x+(tx-fx.src.x)*f,fx.src.y+(ty-fx.src.y)*f,sR(-30,30),sR(-40,10),.3,2,2,P[0],0);fx.n++}}
  ctx.globalAlpha=1}
function spFxStep(fx,dt){
  fx.t+=dt;const t=fx.t;
  for(let i=0;i<fx.q.length;i++)if(fx.q[i].t<=t){const o=fx.q.splice(i,1)[0];i--;o.f()}
  if(fx.el&&fx.dl!=='light'&&t<fx.tc&&!SPNOCH.has(fx.dl))spCharge(fx,dt);
  if(fx.dl==='beam'&&fx.el&&t>=fx.tc&&t<fx.tc+.3)spBeam(fx,dt);
  for(const tg of fx.tg){if(t>=fx.tc&&t<tg.ti&&tg.proj&&fx.dl!=='beam')spProj(fx,tg,dt);if(!tg.did&&t>=tg.ti){tg.did=1;spImpact(fx,tg)}}
  return t<fx.end||fx.q.length>0}
/* ---- the tint on a creature that was hit: white flash, then burning, frozen, shocked, poisoned... ---- */
const SPSMALL=new WeakMap(),SILC=spCv(256,256),SILG=SILC.getContext('2d');
function spSmall(img){let c=SPSMALL.get(img);if(c)return c;const k=Math.min(1,250/Math.max(img.width,img.height));c=spCv(Math.max(2,Math.round(img.width*k)),Math.max(2,Math.round(img.height*k)));c.getContext('2d').drawImage(img,0,0,c.width,c.height);SPSMALL.set(img,c);return c}
function spPaint(sz,e,col,al,comp,ox,oy,cl){
  if(al<=.01)return;const sm=spSmall(sz.s.img),w=sm.width,h=sm.height;SILG.globalCompositeOperation='source-over';SILG.clearRect(0,0,256,256);SILG.drawImage(sm,0,0);SILG.globalCompositeOperation='source-in';SILG.fillStyle=col;SILG.fillRect(0,0,w,h);
  ctx.globalCompositeOperation=comp;ctx.globalAlpha=Math.min(1,al);if(cl!==undefined&&cl<1){ctx.drawImage(SILC,0,h*(1-cl),w,h*cl,e.sx-sz.sw/2+(ox||0),e.sy-sz.sh*.45+sz.sh*(1-cl)+(oy||0),sz.sw,sz.sh*cl)}else ctx.drawImage(SILC,0,0,w,h,e.sx-sz.sw/2+(ox||0),e.sy-sz.sh*.45+(oy||0),sz.sw,sz.sh)}
function spTintEmit(e,tn,sz){
  if(!e.sx)return;const q=SPFX.q(),sw=sz.sw,sh=sz.sh,m=tn.m,rx=()=>e.sx+sR(-.32,.32)*sw,ry=()=>e.sy+sR(-.3,.34)*sh,k=Math.max(.6,sw/110);
  if((m==='fire'||m==='ruin')&&tn.t<tn.d*.8&&Math.random()<.9*q){const sz2=sR(8,13)*k;pAdd(PK.TONGUE,rx(),ry(),sR(-8,8),sR(-70,-40),sR(.28,.42),sz2,sz2,m==='ruin'?'ruin':'fire',-50);if(Math.random()<.45)pAdd(PK.EMBER,rx(),ry(),sR(-12,12),sR(-60,-30),sR(.5,.9),2.5,.8,'#ff9a3a',-10)}
  else if(m==='poison'&&Math.random()<.35*q)pAdd(PK.BUB,rx(),ry()+sh*.2,0,sR(-30,-15),sR(.5,.8),1.5,3.5,'#b8ff80',-4);
  else if(m==='frost'&&Math.random()<.3*q)pAdd(PK.MOTE,rx(),ry(),sR(-5,5),sR(-10,10),sR(.4,.7),3,3,'#e8fbff',0);
  else if(m==='holy'&&Math.random()<.3*q)pAdd(PK.MOTE,rx(),ry(),sR(-4,4),sR(-30,-10),sR(.5,.8),3,3,'#fff2b0',0)}
function spTintDraw(dt){
  for(const [e,tn] of SPFX.tint){
    tn.t+=dt;if(tn.t>=tn.d||(e.hp<=0&&!(e.dying>0))){SPFX.tint.delete(e);continue}
    const sz=spSize(e),t=tn.t,u=t/tn.d,m=tn.m;if(e.sx===undefined)continue;spTintEmit(e,tn,sz);if(!sz.s||!sz.s.img)continue;
    if(m==='fire'||m==='ruin'){const ru=m==='ruin';
      if(t<.1)spPaint(sz,e,'#ffffff',.95*(1-t/.1*.35),'lighter');
      else spPaint(sz,e,ru?'rgb(255,60,150)':'rgb(255,110,30)',.5*(1-(t-.1)/(tn.d-.1))*(.82+.18*Math.sin(t*45)),'lighter');
      if(t>.05)spPaint(sz,e,'rgb(20,8,2)',.4*Math.pow(1-u,.8),'source-over')}
    else if(m==='steel')spPaint(sz,e,'#ffffff',.85*(1-u),'lighter');
    else if(m==='deep'){spPaint(sz,e,tn.dk?'rgb(150,90,230)':'rgb(255,50,40)',.6*(1-u),'lighter');if(t<.06)spPaint(sz,e,'#ffffff',.7,'lighter')}
    else if(m==='frost'){
      const k=u<.7?1:1-(u-.7)/.3,gr=sCl((t-.06)/.28,0,1);
      if(t<.06)spPaint(sz,e,'#ffffff',.9,'lighter');
      else{spPaint(sz,e,'rgb(120,200,255)',.5*k,'lighter',0,0,gr);spPaint(sz,e,'rgb(214,238,255)',.3*k,'source-over',0,0,gr)}
      if(!tn.pts){tn.pts=[];for(let i=0;i<9;i++)tn.pts.push([sR(-.36,.36),sR(-.4,.38),sR(.7,1.2)])}
      ctx.globalCompositeOperation='lighter';const z=spZ(e);for(let i=0;i<tn.pts.length;i++){const q=tn.pts[i],sc=sCl((t-.1-i*.02)/.2,0,1)*(u>.64?Math.max(0,1-(u-.64)/.08):1);if(sc<=0)continue;ctx.globalAlpha=k*.95;const r=(7+4*q[2])*z*sc;ctx.drawImage(spStar('#d8f0ff'),e.sx+q[0]*sz.sw-r,e.sy+q[1]*sz.sh-r,r*2,r*2)}
      if(t<tn.d*.85&&Math.random()<.2*SPFX.q())pAdd(PK.SMOKE,e.sx+sR(-.1,.1)*sz.sw,e.sy-sz.sh*.4,sR(-6,6),sR(-24,-10),sR(.6,.9),4*z,sR(12,18)*z,'#e0f0ff',-2);
      if(u>.64&&!tn.cr){tn.cr=1;for(let i=sN(10);i>0;i--){const q=tn.pts[i%9],s2=sR(20,70),p=pAdd(PK.SHARD,e.sx+q[0]*sz.sw,e.sy+q[1]*sz.sh,sR(-1,1)*s2,sR(-40,20),sR(.5,.8),sR(4,9)*z,sR(4,9)*z,'#cfeeff',280);p.vr=sR(-9,9)}spPaint(sz,e,'#ffffff',.7,'lighter');spSnd('crack',0)}}
    else if(m==='bolt'){const fl=Math.floor(t*34),a=(1-u)*(fl%2?.6:.95);
      for(let k=0;k<4;k++)spPaint(sz,e,'#dce8ff',a*(t<.1?.5:.25),'lighter',(k%2?1:-1)*(1.6+Math.random()*1.4),(k<2?1:-1)*(1.2+Math.random()*1.4));
      spPaint(sz,e,'#ffffff',a*(t<.1?.8:.3),'lighter',(Math.random()-.5)*3,(Math.random()-.5)*2)}
    else if(m==='arcane')spPaint(sz,e,'rgb(170,110,255)',.55*(.5+.5*Math.sin(t*16))*(1-u*.5),'lighter');
    else if(m==='poison'){spPaint(sz,e,'rgb(110,230,70)',.4*(1-u*.5)*(.75+.25*Math.sin(t*9)),'lighter');spPaint(sz,e,'rgb(50,130,30)',.2*(1-u),'source-over')}
    else if(m==='holy')spPaint(sz,e,'rgb(255,238,170)',.62*(1-u),'lighter');
    else if(m==='shadow'){spPaint(sz,e,'rgb(36,4,66)',.55*(1-u*.6),'source-over');spPaint(sz,e,'rgb(140,80,230)',.22*(1-u),'lighter')}
    else if(m==='disint')spPaint(sz,e,'rgb(150,255,200)',.55*(1-u),'lighter')}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
/* ---- the frame: advance everything, then draw (normal-blended things first, then the light) ---- */
const SPNORM=new Set(['tend','roots','crack','swarm','rift']);
function spAbort(){for(const fx of SPFX.fx)for(const tg of fx.tg)spRelease(tg,fx.el);SPFX.fx.length=0;SPFX.obj.length=0;SPFX.fl.length=0;SPFX.tint.clear();SPFX.held.clear();for(const p of SPP)p.a=0;SPFX.live=0}
function spChillDraw(dt){
  for(const e of G.enemies){if(!(e.chilled>0)||e.hp<=0||SPFX.tint.has(e)||SPFX.held.has(e)||!e.sx)continue;const sz=spSize(e);if(!sz.s||!sz.s.img)continue;
    if(e.chillK==='daze'){const zz=spZ(e);ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const an=G.time*5+i*2.1;ctx.globalAlpha=.9;ctx.drawImage(spStar('#ffe9a0'),e.sx+Math.cos(an)*15*zz-5,e.sy-sz.sh*.5-2+Math.sin(an)*4-5,10,10)}ctx.globalAlpha=1;continue}
    spPaint(sz,e,'rgb(130,205,255)',.3+.07*Math.sin(G.time*5+e.seed),'lighter');spPaint(sz,e,'rgb(214,238,255)',.12,'source-over');
    if(Math.random()<.04*SPFX.q())pAdd(PK.MOTE,e.sx+sR(-.3,.3)*sz.sw,e.sy+sR(-.3,.3)*sz.sh,0,sR(-8,8),sR(.4,.7),3,3,'#e8fbff',0)}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
function spChillOnly(dt){
  if(G.state!=='play'||G.cut||!SPFX.lvl||(G.inv&&G.inv.open)||G.menu||G.overview||G.map)return;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();spChillDraw(dt);ctx.restore();
  if(SPFX.npt||SPFX.pnew){spPtsUpdate(dt);ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation='lighter';spPtsDraw(0,true);ctx.restore();SPFX.pnew=0}}
function spFrame(dt){
  const S=SPFX;
  if(!S.live&&(S.npt>0||S.pnew))S.live=1;
  if(!S.live){if(S.chill)spChillOnly(dt);return}
  S.ew+=(Math.min(dt,.1)-S.ew)*.04;S.slow=S.ew>.036?1:S.ew<.026?0:S.slow;
  if(G.state!=='play'||G.cut||!S.lvl||(G.inv&&G.inv.open)||G.menu||G.overview||G.map){spAbort();return}
  const w0=performance.now();
  spPtsUpdate(dt);for(let i=S.obj.length-1;i>=0;i--){const o=S.obj[i];o.t+=dt;if(o.t>=o.d)S.obj.splice(i,1)}
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation='source-over';
  spPtsDraw(0,false);for(const o of S.obj)if(!o.h&&SPNORM.has(o.k))spObjDraw(o,0);
  spTintDraw(dt);spChillDraw(dt);
  ctx.globalCompositeOperation='lighter';for(const o of S.obj)if(!o.h&&!SPNORM.has(o.k))spObjDraw(o,0);
  for(let i=S.fx.length-1;i>=0;i--){if(!spFxStep(S.fx[i],dt))S.fx.splice(i,1)}
  spPtsDraw(0,true);ctx.restore();
  spFlashDraw(dt);
  ctx.save();ctx.globalCompositeOperation='source-over';spPtsDraw(1,false);ctx.globalCompositeOperation='lighter';for(const o of S.obj)if(o.h)spObjDraw(o,1);spPtsDraw(1,true);ctx.restore();
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  S.live=(S.fx.length||S.obj.length||S.tint.size||S.fl.length||S.npt>0||S.pnew)?1:0;S.pnew=0;
  const ms=performance.now()-w0;S.stat.ms+=ms;S.stat.n++;if(ms>S.stat.max)S.stat.max=ms}
/* ---- the hooks ---- */
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);try{if(SPFX.lvl)SPFX.chill=!!(G.enemies&&G.state==='play'&&G.enemies.some(e=>e.chilled>0&&e.hp>0));spFrame(dt||.016)}catch(e){if(SPFX.errs++<5)console.error('spellfx',e);if(SPFX.errs>20){try{spAbort()}catch(x){}}}}}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);if(SPFX.live||SPFX.chill)for(let i=0;i<L.length;i++){const s=L[i];if(s.e)SPFX.spr.set(s.e,s)}return L}}
{const _up=update;update=function(dt){ // hit-stop: the world slows for a moment at the impact; a creature waiting for the impact does not start to fall yet
  let hd=null;if(SPFX.held.size){hd=[];for(const e of SPFX.held.keys())hd.push(e,e.dying)}
  if(SPFX.stop>0){SPFX.stop-=dt;dt*=.07}
  const r=_up.call(this,dt);
  if(hd)for(let i=0;i<hd.length;i+=2){const e=hd[i];if(e.hp<=0&&hd[i+1]>0)e.dying=hd[i+1]}
  return r}}
{const _hs=heroSpecial;heroSpecial=function(i){
  if(!SPFX.lvl||G.state!=='play'||G.cut)return _hs.apply(this,arguments);
  let info=null,pre=null;try{info=spInfo(i);if(info)pre=spSnap(info)}catch(e){info=null}
  if(!info||!pre)return _hs.apply(this,arguments);
  const pf=PFX.length,fs=FXS.length,f0=G.floats.length;SPFX.cap={imp:[]};let r,cap;
  try{r=_hs.apply(this,arguments)}finally{cap=SPFX.cap;SPFX.cap=null}
  if(!r)return r;
  try{spAfter(i,info,pre,pf,fs,f0,cap)}catch(e){console.error('spellfx',e)}
  return r}}
