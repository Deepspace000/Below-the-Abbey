/* ==========================================================================
   THE FOUR HIVES, part two: each hive has its own hue of honey (HG_HONEY in hollowgrass.js: clover, heather, deep amber, buckwheat) in its walls, floor, lights and map colour; the language books
   glow on their lecterns and show on the maps; the three new rescues (see hg_rescue.js). Last in the injection order.
   ========================================================================== */
/* the floor of a hive: the wooden floor in the hive's honey hue (made once) */
function hgHoneyFloor(i){
  const K='hgfloor'+i;
  if(!FLOORS[K]&&FLOORS.wood){const src=FLOORS.wood,m=new Uint8ClampedArray(src.length),f=HG_HONEY[i].flr;
    for(let p=0;p<src.length;p+=4){const l=src[p]*.3+src[p+1]*.59+src[p+2]*.11+14;m[p]=l*f[0];m[p+1]=l*f[1];m[p+2]=l*f[2];m[p+3]=src[p+3]}
    FLOORS[K]=m}
  try{if(typeof MAP_FLOOR!=='undefined')MAP_FLOOR[K]=HG_HONEY[i].map}catch(e){}
  return FLOORS[K]?K:'wood'}
/* the lights of a hive burn in its honey colour */
{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);try{if(LEVEL>=471&&LEVEL<=474){const c=HG_HONEY[LEVEL-471].lcol;for(const l of LIGHTS){l.col=c;l.calm=true}}}catch(e){console.error(e)}return r}}
/* THE BOOKS: the lectern of each hive carries a big halo in the hive's honey glow, pulsing gently (six frames of the painted lectern, with the halo laid behind it), a light of its own colour,
   a message when the party first sees it and when it is taken, and a gold mark on the maps. */
const HG_BK=['The Primer of Ripples','The Book of Small Courtesies','The Grammar of the Deep Water','The Queen’s Dictionary'];
function hgGlowFrames(h){
  const K='hg_lecternglow'+h,src=IMG.hg_lecternglow;
  if(IMG[K+'_f5']||!src||!src.width)return !!IMG[K+'_f5'];
  const w=src.width,hh=src.height,X=Math.round(w*.85),T=Math.round(hh*.5),W2=w+2*X,H2=hh+T,g=HG_HONEY[h].glow;
  for(let f=0;f<6;f++){
    const c=document.createElement('canvas');c.width=W2;c.height=H2;const x=c.getContext('2d'),p=.5+.5*Math.sin(f/6*6.2832),cx=W2/2,cy=T+hh*.3,R=(w*1.15)*(.88+.14*p);
    x.globalCompositeOperation='lighter';
    let gr=x.createRadialGradient(cx,cy,0,cx,cy,R);gr.addColorStop(0,`rgba(${g[0]},${g[1]},${g[2]},${.85+.15*p})`);gr.addColorStop(.4,`rgba(${g[0]},${g[1]},${g[2]},${.4+.2*p})`);gr.addColorStop(1,`rgba(${g[0]},${g[1]},${g[2]},0)`);
    x.fillStyle=gr;x.fillRect(0,0,W2,H2);
    // rays
    for(let k=0;k<8;k++){const a=k/8*6.2832+f*.05,L=R*(.9+.2*((k*5+f)%3)/3);x.save();x.translate(cx,cy);x.rotate(a);const rg=x.createLinearGradient(0,0,L,0);rg.addColorStop(0,`rgba(${g[0]},${g[1]},${g[2]},${.18+.1*p})`);rg.addColorStop(1,`rgba(${g[0]},${g[1]},${g[2]},0)`);x.fillStyle=rg;x.beginPath();x.moveTo(0,-3);x.lineTo(L,-1);x.lineTo(L,1);x.lineTo(0,3);x.fill();x.restore()}
    x.globalCompositeOperation='source-over';x.drawImage(src,X,T);
    x.globalCompositeOperation='lighter';gr=x.createRadialGradient(cx,cy,0,cx,cy,w*.4);gr.addColorStop(0,`rgba(255,250,225,${.05+.07*p})`);gr.addColorStop(1,'rgba(255,250,225,0)');x.fillStyle=gr;x.fillRect(0,0,W2,H2);
    IMG[K+'_f'+f]=c;if(f===0)IMG[K]=c}
  NPC_H[K]=NPC_H.hg_lecternglow*H2/hh;return true}
function hgBookSet(n){
  const L=LEVELS[n];if(!L||!L.decor)return;const h=n-471,lec=L.decor.find(d=>/^hg_lecternglow/.test(d.k));if(!lec)return;
  if(hgGlowFrames(h)){lec.k='hg_lecternglow'+h;lec.fr=1.1;lec.lift=.95;lec.sc=1.2}else setTimeout(()=>{try{if(LEVEL===n){hgBookSet(n);G.decor.forEach(d=>{if(d.x===lec.x&&d.y===lec.y&&/^hg_lecternglow/.test(d.k)){d.k=lec.k;d.fr=lec.fr;d.lift=lec.lift;d.sc=lec.sc}})}}catch(e){}},400)}
{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);try{if(LEVEL>=471&&LEVEL<=474){hgBookSet(LEVEL);const L=LEVELS[LEVEL],lec=L.decor.find(d=>/^hg_lecternglow/.test(d.k));if(lec&&G.decor){const g=G.decor.find(d=>d.x===lec.x&&d.y===lec.y&&/^hg_lecternglow/.test(d.k));if(g){g.k=lec.k;g.fr=lec.fr;g.lift=lec.lift;g.sc=lec.sc}}}}catch(e){console.error(e)}return r}}
/* the first sight of the book, from down the tunnel, and the moment it is taken */
function hgBookSight(){
  if(LEVEL<471||LEVEL>474||G.state!=='play'||G.talk)return;
  const h=LEVEL-471,F=G.flags,k='hgBkSeen'+h;if(F[k])return;
  const lec=G.decor.find(d=>/^hg_lecternglow/.test(d.k));if(!lec)return;
  if(Math.hypot(lec.x-G.P.x,lec.y-G.P.y)<=8&&hasLOS(lec.x,lec.y,G.P.x,G.P.y)){F[k]=1;msg('A book glows on its lectern: '+HG_BK[h]+'. This is the book Aldous wants.','#ffe36a')}}
{const _dm=doMove;doMove=function(rel){const r=_dm.apply(this,arguments);try{hgBookSight()}catch(e){}return r}}
{const _dt=doTurn;doTurn=function(d){const r=_dt.apply(this,arguments);try{hgBookSight()}catch(e){}return r}}
{const _ba=bagAdd;bagAdd=function(it){const r=_ba.apply(this,arguments);try{const m=r&&it&&/^hgbook([1-4])$/.exec(it.id);if(m)msg(HG_BK[+m[1]-1]+'. This is the book Aldous wants.','#ffe36a')}catch(e){}return r}}
/* the marks on the maps: a gold star where the book lies (once seen, or while its quest is open) and a green ring on each villager still to be freed (once seen) */
function hgMarkList(){
  const out=[];if(LEVEL<471||LEVEL>474||!G.decor||!G.seen)return out;
  const h=LEVEL-471,seen=(x,y)=>G.seen[y]&&G.seen[y][x];
  const lec=G.decor.find(d=>/^hg_lecternglow/.test(d.k)),bk=G.items.find(i=>i.k==='hgbook'+(h+1));
  if(lec&&bk&&!bk.taken&&(seen(lec.x,lec.y)||qSt('hgb'+(h+1))==='active'))out.push({k:'book',x:lec.x,y:lec.y});
  for(const d of G.decor)if(d.npc==='hgbound'&&!d.found&&seen(d.x,d.y))out.push({k:'cap',x:d.x,y:d.y});
  return out}
function hgMarkDraw(px,py,m,s){
  const pulse=.6+.4*Math.sin(G.time*5);ctx.save();ctx.lineJoin='round';
  if(m.k==='book'){ctx.fillStyle='#ffd24a';ctx.strokeStyle='#3a2208';ctx.lineWidth=Math.max(.8,s*.18);ctx.beginPath();for(let k=0;k<8;k++){const r=k%2?s*.55:s*1.5,a=k*Math.PI/4-Math.PI/2;ctx.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r)}ctx.closePath();ctx.globalAlpha=.55+.45*pulse;ctx.fill();ctx.globalAlpha=1;ctx.stroke()}
  else{ctx.strokeStyle='#7ae07a';ctx.fillStyle='#e8fbe0';ctx.lineWidth=Math.max(1,s*.28);ctx.globalAlpha=pulse;ctx.beginPath();ctx.arc(px,py,s*1.05,0,6.283);ctx.stroke();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(px,py,s*.42,0,6.283);ctx.fill()}
  ctx.restore()}
{const _dq=drawQuestMarks;drawQuestMarks=function(ox,oy,cs,big,rad){_dq.apply(this,arguments);try{for(const m of hgMarkList()){if(rad&&(Math.abs(m.x-G.C.x)>rad||Math.abs(m.y-G.C.y)>rad))continue;hgMarkDraw(ox+(m.x+.5)*cs,oy+(m.y+.5)*cs,m,Math.max(2.6,cs*.8))}}catch(e){}}}
{const _mp=mplPaint;mplPaint=function(c,S,area,X,Y,foot){const r=_mp.apply(this,arguments);try{if(LEVEL>=471&&LEVEL<=474&&G.decor){const z=mplZoom();ctx.save();ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);ctx.clip();
  for(const m of hgMarkList())hgMarkDraw(area.x+(X(m.x+.5)-area.x)*z+(G.panX||0),area.y+(Y(m.y+.5)-area.y)*z+(G.panY||0),m,3.4);ctx.restore()}}catch(e){console.error(e)}return r}}
