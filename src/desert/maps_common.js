/* ==========================================================================
   AREA MAPS, shared tools. Every area map is a hand-drawn illuminated parchment, drawn once into an off-screen sheet from the real level data and cached, with the
   party's arrow and the buttons laid on top each time the map opens. Medieval manuscript style: aged vellum, gold leaf, lapis blue, vermilion and verdigris, a
   framed border with corner medallions, a title cartouche with an illuminated initial, a compass rose, small pen-and-ink icons, a key, and a few notes.
   An area file calls mplInstall({name, levels:[...], draw(c,x,L,api)}) and the rest is done here. Names start with mpl, so they cannot clash.
   The screen is DW x DH (480 x 320). The framed drawing area is MPL.AREA = {x:92,y:30,w:296,h:262}; the left and right margins (0..92 and 388..480) are for the
   title, notes and key. See hollowgrass_map.js for a finished example in a different (older) style.
   ========================================================================== */
const MPL={AREA:{x:92,y:30,w:296,h:262},INK:'#2a1a0c',GOLD:'#c9a227',GOLD2:'#f0d878',LAPIS:'#274a9a',VERM:'#b8321e',VERD:'#3a7a5a',CACHE:{},S:3};
/* aged vellum with stains, optionally tinted ([r,g,b] added, e.g. cool or warm) */
function mplParchment(x,tint){
  tint=tint||[0,0,0];const g=x.createLinearGradient(0,0,0,DH),f=(a,b,c)=>`rgb(${Math.max(0,Math.min(255,a+tint[0]))},${Math.max(0,Math.min(255,b+tint[1]))},${Math.max(0,Math.min(255,c+tint[2]))})`;
  g.addColorStop(0,f(226,208,160));g.addColorStop(1,f(206,184,134));x.fillStyle=g;x.fillRect(0,0,DW,DH);
  x.save();x.globalAlpha=.14;for(let i=0;i<170;i++){x.fillStyle=i%3?'#6a4a28':'#f4ead0';x.beginPath();x.ellipse(hash2(i,1,7)*DW,hash2(i,2,7)*DH,5+hash2(i,3,7)*30,3+hash2(i,4,7)*14,hash2(i,5,7)*3,0,Math.PI*2);x.fill()}x.restore();
  const v=x.createRadialGradient(DW/2,DH/2,DH*.3,DW/2,DH/2,DW*.62);v.addColorStop(0,'rgba(80,50,20,0)');v.addColorStop(1,'rgba(80,50,20,.38)');x.fillStyle=v;x.fillRect(0,0,DW,DH)}
/* text with a pale halo so it reads over drawing */
function mplText(x,t,a,b,sz,col,al,font){x.save();x.font=`bold ${sz}px ${font||FUI}`;x.textAlign=al||'center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3;x.strokeStyle='rgba(238,226,190,.92)';x.strokeText(t,a,b);x.fillStyle=col||MPL.INK;x.fillText(t,a,b);x.restore()}
/* wrap text into lines no wider than w px at size sz */
function mplWrap(x,t,w,sz){x.save();x.font=`${sz}px ${FUI}`;const o=[];let l='';for(const wd of t.split(' ')){const m=l?l+' '+wd:wd;if(x.measureText(m).width>w&&l){o.push(l);l=wd}else l=m}if(l)o.push(l);x.restore();return o}
/* the border: double gold rule, a row of small gold studs, corner medallions in lapis and vermilion */
function mplBorder(x){
  const m=3,W=DW-6,H=DH-6;x.save();
  x.lineWidth=5;x.strokeStyle=MPL.LAPIS;x.strokeRect(m+2,m+2,W-4,H-4);x.lineWidth=2.4;x.strokeStyle=MPL.GOLD;x.strokeRect(m,m,W,H);x.lineWidth=1.2;x.strokeStyle=MPL.INK;x.strokeRect(m+5.2,m+5.2,W-10.4,H-10.4);x.strokeRect(m-1.2,m-1.2,W+2.4,H+2.4);
  x.fillStyle=MPL.GOLD2;for(let i=14;i<W-8;i+=9){for(const y of [m+2,m+H-2]){x.beginPath();x.arc(i,y,1.35,0,6.3);x.fill()}}for(let j=14;j<H-8;j+=9){for(const xx of [m+2,m+W-2]){x.beginPath();x.arc(xx,j,1.35,0,6.3);x.fill()}}
  for(const [cx,cy] of [[m+2,m+2],[m+W-2,m+2],[m+2,m+H-2],[m+W-2,m+H-2]]){x.fillStyle=MPL.GOLD;x.beginPath();x.arc(cx,cy,9,0,6.3);x.fill();x.strokeStyle=MPL.INK;x.lineWidth=1;x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(cx,cy,5.6,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.LAPIS;x.beginPath();x.arc(cx,cy,2.6,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(cx,cy,.9,0,6.3);x.fill()}
  x.restore()}
/* title in the top left: a gold-leaf illuminated initial in a lapis square with vermilion inner rule, then the rest of the title and a subtitle */
function mplTitle(x,title,sub,ax,ay){
  ax=ax||12;ay=ay||12;const ini=title[0],rest=title.slice(1);
  x.save();x.fillStyle=MPL.LAPIS;x.fillRect(ax,ay,22,22);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(ax,ay,22,22);x.strokeStyle=MPL.VERM;x.lineWidth=.8;x.strokeRect(ax+2.5,ay+2.5,17,17);
  x.fillStyle=MPL.GOLD2;x.font=`20px ${FTITLE}`;x.textAlign='center';x.textBaseline='middle';x.fillText(ini,ax+11,ay+12);
  x.fillStyle=MPL.GOLD;for(const [a,b] of [[ax+3,ay+3],[ax+19,ay+3],[ax+3,ay+19],[ax+19,ay+19]]){x.beginPath();x.arc(a,b,1.1,0,6.3);x.fill()}
  x.fillStyle=MPL.INK;x.font=`15px ${FTITLE}`;x.textAlign='left';x.fillText(rest,ax+26,ay+13);
  if(sub)mplText(x,sub,ax,ay+32,7,'#5a3a1c','left');x.restore()}
/* compass rose with a vermilion north point */
function mplCompass(x,cx,cy,r){
  x.save();x.translate(cx,cy);x.strokeStyle=MPL.INK;x.lineWidth=1;x.fillStyle='rgba(240,230,196,.85)';x.beginPath();x.arc(0,0,r,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(0,0,r*.72,0,6.3);x.stroke();
  for(let k=0;k<4;k++){x.save();x.rotate(k*Math.PI/2);x.fillStyle=k===0?MPL.VERM:MPL.LAPIS;x.beginPath();x.moveTo(0,-r*1.18);x.lineTo(r*.2,0);x.lineTo(-r*.2,0);x.closePath();x.fill();x.stroke();x.restore()}
  x.save();x.rotate(Math.PI/4);x.fillStyle=MPL.GOLD;for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.moveTo(0,-r*.82);x.lineTo(r*.1,0);x.lineTo(-r*.1,0);x.closePath();x.fill()}x.restore();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(0,-r*1.18,2,0,6.3);x.fill();x.stroke();x.restore();mplText(x,'N',cx,cy-r*1.18-6,8,MPL.VERM)}
/* simple pen-and-ink icons, drawn at (a,b), size s (1 = about 10 px) */
const MPLI={
  tree(x,a,b,s,col){s=s||1;x.fillStyle='#5a3a1c';x.fillRect(a-.7*s,b-2*s,1.4*s,3*s);x.fillStyle=col||MPL.VERD;x.strokeStyle=MPL.INK;x.lineWidth=.7;for(const [dx,dy,r] of [[0,-5,3.6],[-2,-3.4,2.4],[2,-3.4,2.4]]){x.beginPath();x.arc(a+dx*s,b+dy*s,r*s,0,6.3);x.fill();x.stroke()}},
  pine(x,a,b,s){s=s||1;x.fillStyle='#2f5a3c';x.strokeStyle=MPL.INK;x.lineWidth=.7;for(let k=0;k<3;k++){x.beginPath();x.moveTo(a-(4-k)*s,b-k*3*s);x.lineTo(a,b-(k*3+4.4)*s);x.lineTo(a+(4-k)*s,b-k*3*s);x.closePath();x.fill();x.stroke()}},
  mountain(x,a,b,s){s=s||1;x.fillStyle='#9a8a74';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-8*s,b);x.lineTo(a-1*s,b-10*s);x.lineTo(a+3*s,b-6*s);x.lineTo(a+5*s,b-8*s);x.lineTo(a+10*s,b);x.closePath();x.fill();x.stroke();x.fillStyle='#f4efe4';x.beginPath();x.moveTo(a-3.2*s,b-6.6*s);x.lineTo(a-1*s,b-10*s);x.lineTo(a+.8*s,b-7.6*s);x.lineTo(a-.6*s,b-6.4*s);x.lineTo(a-1.8*s,b-7.2*s);x.closePath();x.fill()},
  house(x,a,b,s,roof){s=s||1;x.fillStyle='#e8dcc0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-4*s,b-3*s,8*s,6*s);x.strokeRect(a-4*s,b-3*s,8*s,6*s);x.fillStyle=roof||MPL.VERM;x.beginPath();x.moveTo(a-5.4*s,b-3*s);x.lineTo(a,b-8.4*s);x.lineTo(a+5.4*s,b-3*s);x.closePath();x.fill();x.stroke();x.fillStyle='#5a3a1c';x.fillRect(a-1*s,b,2*s,3*s)},
  church(x,a,b,s){s=s||1;MPLI.house(x,a,b,s,MPL.LAPIS);x.fillStyle='#e8dcc0';x.fillRect(a+3*s,b-9*s,4*s,12*s);x.strokeRect(a+3*s,b-9*s,4*s,12*s);x.fillStyle=MPL.LAPIS;x.beginPath();x.moveTo(a+2.4*s,b-9*s);x.lineTo(a+5*s,b-14*s);x.lineTo(a+7.6*s,b-9*s);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a+5*s,b-14*s);x.lineTo(a+5*s,b-17*s);x.moveTo(a+3.8*s,b-15.6*s);x.lineTo(a+6.2*s,b-15.6*s);x.stroke()},
  tower(x,a,b,s){s=s||1;x.fillStyle='#cfc6ae';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-3*s,b-11*s,6*s,13*s);x.strokeRect(a-3*s,b-11*s,6*s,13*s);for(const k of [-3,-.8,1.4]){x.fillRect(a+k*s,b-13*s,1.6*s,2*s);x.strokeRect(a+k*s,b-13*s,1.6*s,2*s)}x.fillStyle='#3a2a1c';x.fillRect(a-.6*s,b-6*s,1.2*s,3*s)},
  castle(x,a,b,s){s=s||1;MPLI.tower(x,a-7*s,b,s*.8);MPLI.tower(x,a+7*s,b,s*.8);x.fillStyle='#d8cfb8';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-8*s,b-6*s,16*s,8*s);x.strokeRect(a-8*s,b-6*s,16*s,8*s);x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-6*s);x.lineTo(a,b-12*s);x.lineTo(a+5*s,b-10*s);x.lineTo(a,b-8.5*s);x.fill();x.fillStyle='#3a2a1c';x.beginPath();x.arc(a,b+2*s,2.2*s,Math.PI,0);x.fill()},
  wave(x,a,b){x.strokeStyle='rgba(30,70,110,.7)';x.lineWidth=.7;x.beginPath();x.moveTo(a-3,b);x.quadraticCurveTo(a-1.5,b-2,a,b);x.quadraticCurveTo(a+1.5,b+2,a+3,b);x.stroke()},
  skull(x,a,b,s){s=s||1;x.fillStyle='#efe8d8';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(a,b-1*s,3*s,0,6.3);x.fill();x.stroke();x.fillRect(a-1.8*s,b+1*s,3.6*s,2*s);x.fillStyle=MPL.INK;x.beginPath();x.arc(a-1.2*s,b-1*s,.8*s,0,6.3);x.arc(a+1.2*s,b-1*s,.8*s,0,6.3);x.fill()},
  cross(x,a,b,s){s=s||1;x.strokeStyle=MPL.INK;x.lineWidth=1.4*s;x.beginPath();x.moveTo(a,b-5*s);x.lineTo(a,b+4*s);x.moveTo(a-2.6*s,b-2*s);x.lineTo(a+2.6*s,b-2*s);x.stroke()},
  star(x,a,b,s,col){s=s||1;x.fillStyle=col||MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();for(let k=0;k<10;k++){const r=(k%2?1.8:4.2)*s,an=-Math.PI/2+k*Math.PI/5;k?x.lineTo(a+Math.cos(an)*r,b+Math.sin(an)*r):x.moveTo(a+Math.cos(an)*r,b+Math.sin(an)*r)}x.closePath();x.fill();x.stroke()}};
/* fit a W x H cell grid into the framed area: returns {s, ox, oy, X(cx), Y(cy)} */
function mplFit(W,H,pad){pad=pad||4;const A=MPL.AREA,s=Math.min((A.w-2*pad)/W,(A.h-2*pad)/H),ox=A.x+(A.w-W*s)/2,oy=A.y+(A.h-H*s)/2;return {s,ox,oy,X:c=>ox+c*s,Y:c=>oy+c*s}}
/* a ruled box for the key, notes, etc. in the side margins */
function mplPanel(x,a,b,w,h){x.save();x.fillStyle='rgba(240,230,196,.55)';x.fillRect(a,b,w,h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.strokeRect(a,b,w,h);x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(a+1.8,b+1.8,w-3.6,h-3.6);x.restore()}
/* notes in a side margin: lines wrapped to w, starting at (a,b); returns the y after the last */
function mplNotes(x,notes,a,b,w,sz,gap){sz=sz||6.4;gap=gap||5;for(const n of notes){for(const l of mplWrap(x,n,w,sz)){mplText(x,l,a,b,sz,'#3a2a1c','left');b+=sz+2.4}b+=gap}return b}
/* install: draws the cached sheet for the listed levels in place of the plain map, with the party's arrow and the buttons on top.
   cfg = {name, levels:[ids], draw(c,x,L,api), fit(L)->mplFit result (optional; must match what draw() used, so the arrow lands right), foot, tint}
   draw(c,x,L,api) paints everything except the border (added after) onto context x (480x320). api = {parchment,border,title,compass,text,notes,panel,fit,I,wrap}.
   The sheet is built once per level and kept in MPL.CACHE. */
function mplInstall(cfg){
  const _do=drawOverview;
  drawOverview=function(){
    if(!cfg.levels.includes(LEVEL)||G.world||G.teleMode||!LEVELS[LEVEL])return _do.apply(this,arguments);
    BTNS=[];veil(.95);
    const key=LEVEL+':'+cfg.name;let c=MPL.CACHE[key];
    if(!c){c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
      try{mplParchment(x,cfg.tint);cfg.draw(c,x,LEVELS[LEVEL],{parchment:mplParchment,border:mplBorder,title:mplTitle,compass:mplCompass,text:mplText,notes:mplNotes,panel:mplPanel,fit:mplFit,I:MPLI,wrap:mplWrap});mplBorder(x)}catch(e){console.error(e)}
      MPL.CACHE[key]=c}
    ctx.imageSmoothingQuality='high';ctx.drawImage(c,0,0,DW,DH);
    const L=LEVELS[LEVEL],a=cfg.fit?cfg.fit(L):mplFit(L.rows[0].length,L.rows.length),px=a.X(G.C.x+.5),py=a.Y(G.C.y+.5);
    ctx.save();ctx.translate(px,py);ctx.rotate((G.C.a||0)+Math.PI/2);ctx.fillStyle='#ffe36a';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle='rgba(30,22,16,.85)';ctx.fillRect(0,DH-17,DW,17);txt(cfg.foot||'You are the yellow arrow.',DW/2,DH-8.5,7.5,'#e0d8bc','center',true);
    btnText('worldmap','World map',328,5,80,20);btnText('ovexit','Exit',414,5,60,20)}}
