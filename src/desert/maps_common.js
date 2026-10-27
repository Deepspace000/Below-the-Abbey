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
function mplFit(W,H,pad){pad=pad||(LEVEL>=440&&LEVEL<=459?14:4);const A=MPL.AREA,s=Math.min((A.w-2*pad)/W,(A.h-2*pad)/H,LEVEL>=440&&LEVEL<=459?9:1e9),ox=A.x+(A.w-W*s)/2,oy=A.y+(A.h-H*s)/2;return {s,ox,oy,X:c=>ox+c*s,Y:c=>oy+c*s}}
/* a ruled box for the key, notes, etc. in the side margins */
function mplPanel(x,a,b,w,h){const S=x.canvas.width/DW;let snap=null;try{snap=x.getImageData(Math.round((a-2)*S),Math.round((b-2)*S),Math.round((w+4)*S),Math.round((h+4)*S))}catch(e){}(MPL.pan=MPL.pan||[]).push({x,a,b,w,h,S,snap});x.save();x.fillStyle='rgba(240,230,196,.55)';x.fillRect(a,b,w,h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.strokeRect(a,b,w,h);x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(a+1.8,b+1.8,w-3.6,h-3.6);x.restore()}
/* notes in a side margin: lines wrapped to w, starting at (a,b); returns the y after the last */
/* a panel that was meant to hold notes is taken away again (the picture under it is put back) */
function mplUnpanel(x,a,b){const L=MPL.pan||[];for(let i=L.length-1;i>=0;i--){const p=L[i];if(p.x===x&&a>=p.a-3&&a<=p.a+p.w&&b>=p.b-12&&b<=p.b+p.h){if(p.snap)x.putImageData(p.snap,Math.round((p.a-2)*p.S),Math.round((p.b-2)*p.S));L.splice(i,1);return}}}
/* the maps carry no notes to the player: this keeps the layout arithmetic and draws nothing */
function mplNotes(x,notes,a,b,w,sz,gap){mplUnpanel(x,a,b);sz=sz||6.4;gap=gap||5;for(const n of notes){for(const l of mplWrap(x,n,w,sz))b+=sz+2.4;b+=gap}return b}
/* install: draws the cached sheet for the listed levels in place of the plain map, with the party's arrow and the buttons on top.
   cfg = {name, levels:[ids], draw(c,x,L,api), fit(L)->mplFit result (optional; must match what draw() used, so the arrow lands right), foot, tint}
   draw(c,x,L,api) paints everything except the border (added after) onto context x (480x320). api = {parchment,border,title,compass,text,notes,panel,fit,I,wrap}.
   The sheet is built once per level and kept in MPL.CACHE. */
/* ---- marginalia: small pen-and-ink drolleries in the margins of the parchment (monsters, beasts, folk at work), added by the marginalia_*.js files.
   mpmgAdd(levels, fn(x, L)) registers a drawing for those levels; fn paints onto the 480x320 sheet context x (sheet coordinates, before the border is added). ---- */
const MPMG={by:{}};
function mpmgAdd(levels,fn){for(const l of levels)(MPMG.by[l]=MPMG.by[l]||[]).push(fn)}
function mpmgDraw(x,lv){const L=LEVELS[lv];for(const fn of (MPMG.by[lv]||[])){x.save();try{fn(x,L)}catch(e){console.error('marginalia',lv,e)}x.restore()}}
/* the foot line says only who the arrow is; the kind of hint that used to follow it is left out (the Pilgrim's Path distances and Khemetra's legend stay) */
function mplFoot(f){return f&&/ km /.test(f)?f:''}
function mplInstall(cfg){
  const _do=drawOverview;
  drawOverview=function(){
    if(!cfg.levels.includes(LEVEL)||G.world||G.teleMode||!LEVELS[LEVEL])return _do.apply(this,arguments);
    BTNS=[];veil(.95);
    const key=LEVEL+':'+cfg.name;let c=MPL.CACHE[key];
    if(!c){c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
      try{mplParchment(x,cfg.tint);cfg.draw(c,x,LEVELS[LEVEL],{parchment:mplParchment,border:mplBorder,title:mplTitle,compass:mplCompass,text:mplText,notes:mplNotes,panel:mplPanel,fit:mplFit,I:MPLI,wrap:mplWrap});mpmgDraw(x,LEVEL);mplBorder(x)}catch(e){console.error(e)}
      MPL.CACHE[key]=c;{const ks=Object.keys(MPL.CACHE);while(ks.length>3){const o=ks.shift();if(o!==key){const oc=MPL.CACHE[o];delete MPL.CACHE[o];if(oc)oc.width=oc.height=0}}}} // only the three newest sheets are kept (each is a big canvas, and the iPad runs short of canvas memory)
    const L=LEVELS[LEVEL],a=cfg.fit?cfg.fit(L):mplFit(L.rows[0].length,L.rows.length);
    MPL.reveal=!!cfg.reveal;
    mplPaint(c,MPL.S,MPL.AREA,cx=>a.X(cx),cy=>a.Y(cy),cfg.foot)}}
/* ---- zoom and pan: the same controls as the plain map (+ and - buttons, Fit, mouse wheel, pinch, drag), drawn from the large cached sheet so it stays sharp ---- */
const MPLZ={max:6};
const mplZoom=()=>Math.max(1,Math.min(MPLZ.max,(G.mz||12)/12));
/* paints sheet c (drawn at S times the screen size) with the current zoom and pan inside `area`, the party's arrow (X,Y give the party's place on the sheet), the buttons and the foot line */
function mplPaint(c,S,area,X,Y,foot){
  BTNS=[];veil(.95);
  if(G.mplLv!==LEVEL||G.mplKey!==c){G.mplLv=LEVEL;G.mplKey=c;G.mz=12;G.panX=0;G.panY=0}
  const z=mplZoom();G.panMinX=-area.w*(z-1);G.panMinY=-area.h*(z-1);G.panX=Math.max(G.panMinX,Math.min(0,G.panX||0));G.panY=Math.max(G.panMinY,Math.min(0,G.panY||0));
  MPL.view={lv:LEVEL,area,X,Y,z:0,sx0:0,sy0:0};
  BTNS.push({id:'mplarea',x:area.x,y:area.y,w:area.w,h:area.h,up:true,drag:'map'});
  ctx.imageSmoothingQuality='high';ctx.drawImage(c,0,0,DW,DH);
  const sx0=area.x-G.panX/z,sy0=area.y-G.panY/z;
  if(z>1.001){ctx.save();ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);ctx.clip();ctx.drawImage(c,sx0*S,sy0*S,area.w/z*S,area.h/z*S,area.x,area.y,area.w,area.h);ctx.restore()}
  const FL=LEVELS[LEVEL],fg=MPL.reveal?mplFogFor(area,X,Y,FL,true):mplFogOn(FL)?mplFogFor(area,X,Y,FL):null;
  if(fg){ctx.save();ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);ctx.clip();ctx.globalAlpha=1;ctx.imageSmoothingQuality='high';ctx.drawImage(fg.cv,(sx0-area.x)*fg.fs,(sy0-area.y)*fg.fs,area.w/z*fg.fs,area.h/z*fg.fs,area.x,area.y,area.w,area.h);ctx.restore()}
  Object.assign(MPL.view,{z,sx0,sy0});if(typeof mpplDraw==='function')try{mpplDraw()}catch(e){console.error('mpplDraw',e)}
  const px=area.x+(X(G.C.x+.5)-sx0)*z,py=area.y+(Y(G.C.y+.5)-sy0)*z;
  if(px>area.x-4&&px<area.x+area.w+4&&py>area.y-4&&py<area.y+area.h+4){ctx.save();ctx.translate(px,py);ctx.rotate((G.C.a||0)+Math.PI/2);ctx.fillStyle='#ffe36a';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
  ctx.fillStyle='rgba(30,22,16,.85)';ctx.fillRect(0,DH-17,DW,17);txt(mplFoot(foot),238,DH-8.5,7.5,'#e0d8bc','left',true,undefined,236);
  MPL.me=()=>{const cxs=X(G.C.x+.5),cys=Y(G.C.y+.5);G.panX=(area.w/2)-(cxs-area.x)*z;G.panY=(area.h/2)-(cys-area.y)*z;G.panX=Math.max(G.panMinX,Math.min(0,G.panX));G.panY=Math.max(G.panMinY,Math.min(0,G.panY))};
  btnText('mzin','+',22,303,18,17);btnText('mzout','-',42,303,18,17);btnText('mzfit','Fit',62,303,28,17);btnText('mplme','Me',92,303,26,17);
  if(typeof mpplButtons==='function')try{mpplButtons()}catch(e){console.error('mpplButtons',e)}
  btnText('worldmap','World map',328,5,80,20);btnText('ovexit','Exit',414,5,60,20)}
/* while one of these maps is open, zooming (buttons, wheel, pinch) zooms the framed drawing about the point under the pointer */
{const _s=setMapZoom;setMapZoom=function(ncs,ax,ay){
  const V=MPL.view;if(!V||!G.overview||G.world||V.lv!==LEVEL)return _s.apply(this,arguments);
  const A=V.area,z0=mplZoom(),z1=ncs<=0?1:Math.max(1,Math.min(MPLZ.max,ncs/12));
  ax=Math.max(A.x,Math.min(A.x+A.w,ax));ay=Math.max(A.y,Math.min(A.y+A.h,ay));
  const sx=A.x+(-G.panX+(ax-A.x))/z0,sy=A.y+(-G.panY+(ay-A.y))/z0;G.mz=z1*12;
  G.panX=Math.max(-A.w*(z1-1),Math.min(0,(ax-A.x)-(sx-A.x)*z1));G.panY=Math.max(-A.h*(z1-1),Math.min(0,(ay-A.y)-(sy-A.y)*z1))}}
{const _h=handleBtn;handleBtn=function(id){if(id==='mplme'&&MPL.view&&G.overview&&!G.world){if(MPL.me)MPL.me();return}return _h.apply(this,arguments)}}

/* ---- fog of war: a drifting cloud over the parts of an outdoor map the party has not walked near. It is soft and see-through, so the edges of the land still show. ---- */
/* which levels have fog: the outdoor ones, except Greendale (no enemies, nothing to fear) and the Pilgrim's Path, which stay clear */
function mplFogOn(L){return !!(L&&L.outdoor&&L.rows&&LEVEL!==32&&LEVEL!==44&&![3,13,33,290,300,301,302,303,304,305,496].includes(LEVEL)&&!(LEVEL>=400&&LEVEL<=434)&&!(G.flags&&G.flags.noFog))}
const MPLF={arr:{},flags:null,ver:0,t:0,cache:null,sig:'',tex:null};
function mplFogArr(){
  if(MPLF.flags!==G.flags){MPLF.arr={};MPLF.flags=G.flags;MPLF.cache=null}
  const L=LEVELS[LEVEL];if(!L||!L.rows)return null;const W=L.rows[0].length,H=L.rows.length;let a=MPLF.arr[LEVEL];
  if(!a||a.length!==W*H){a=new Uint8Array(W*H);const s=G.flags&&G.flags.mplFog&&G.flags.mplFog[LEVEL];
    if(s){try{const b=atob(s);for(let i=0;i<a.length;i++)a[i]=(b.charCodeAt(i>>3)>>(i&7))&1}catch(e){}}MPLF.arr[LEVEL]=a}
  return a}
function mplFogSave(a){let s='';for(let i=0;i<a.length;i+=8){let v=0;for(let k=0;k<8&&i+k<a.length;k++)if(a[i+k])v|=1<<k;s+=String.fromCharCode(v)}
  const F=G.flags;if(!F)return;F.mplFog=F.mplFog||{};F.mplFog[LEVEL]=btoa(s)}
/* every moment the party is on an outdoor level, the ground round it counts as explored */
{const _u=update;update=function(dt){
  if(G.state==='play'&&G.P&&G.flags){const L=LEVELS[LEVEL];
    if(mplFogOn(L)&&G.time>=MPLF.t){MPLF.t=G.time+.25;
      const a=mplFogArr();if(a){const W=L.rows[0].length,H=L.rows.length,px=Math.round(G.C?G.C.x:G.P.x),py=Math.round(G.C?G.C.y:G.P.y),R=8;let ch=0;
        for(let y=Math.max(0,py-R);y<=Math.min(H-1,py+R);y++)for(let x=Math.max(0,px-R);x<=Math.min(W-1,px+R);x++)if(!a[y*W+x]&&Math.hypot(x-px,y-py)<=R){a[y*W+x]=1;ch++}
        if(ch){MPLF.ver++;MPLF.dirty=LEVEL}}}
    if(MPLF.dirty&&G.time>=(MPLF.sv||0)){MPLF.sv=G.time+3;const a=MPLF.arr[MPLF.dirty];if(a&&MPLF.dirty===LEVEL)mplFogSave(a);MPLF.dirty=0}}
  return _u.apply(this,arguments)}}
function mplCloudTex(){
  if(MPLF.tex)return MPLF.tex;const N=256,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),d=x.createImageData(N,N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){let v=0,a=1,f=1/48;for(let o=0;o<4;o++){v+=a*mplTile(i*f,j*f,N*f,o);a*=.5;f*=2}v/=1.875;const w=Math.max(0,Math.min(1,(v-.28)*1.7)),k=(j*N+i)*4;
    d.data[k]=196+w*50;d.data[k+1]=208+w*40;d.data[k+2]=224+w*28;d.data[k+3]=130+w*125}
  x.putImageData(d,0,0);return MPLF.tex=c}
function mplTile(x,y,P,o){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),m=Math.round(P),h=(i,j)=>hash2(((i%m)+m)%m,((j%m)+m)%m,91+o);
  return (h(x0,y0)*(1-sx)+h(x0+1,y0)*sx)*(1-sy)+(h(x0,y0+1)*(1-sx)+h(x0+1,y0+1)*sx)*sy}
/* outdoor fog of war: a solid bank of the same hand-drawn clouds as the world map, over the ground the party has not walked near. */
function mplFogClouds(a,W,H,area,X,Y){
  const fs=4,fw=Math.ceil(area.w*fs),fh=Math.ceil(area.h*fs),cv=document.createElement('canvas');cv.width=fw;cv.height=fh;const x=cv.getContext('2d');
  const x0=X(0),y0=Y(0),cs=X(1)-x0,bx=(x0-area.x)*fs,by=(y0-area.y)*fs;
  // the solid ground of the bank: every unexplored cell, a little blurred at the edge
  const m=document.createElement('canvas');m.width=W;m.height=H;const mx=m.getContext('2d'),id=mx.createImageData(W,H);
  for(let i=0;i<W*H;i++){id.data[i*4]=212;id.data[i*4+1]=203;id.data[i*4+2]=178;id.data[i*4+3]=a[i]?0:255}mx.putImageData(id,0,0);
  x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(m,bx,by,W*cs*fs,H*cs*fs);
  if(!MPLF.spr&&typeof mpWorldCloudSprites==='function'){try{const all=mpWorldCloudSprites();MPLF.spr=[0,1,5,6].map(k=>all[k]).filter(Boolean)}catch(e){MPLF.spr=[]}}
  const spr=MPLF.spr||[];if(!spr.length)return cv;
  const cov=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&!a[cy*W+cx];
  const near=(cx,cy,r)=>{for(let k=0;k<8;k++){const an=k*Math.PI/4;if(!cov(Math.round(cx+Math.cos(an)*r),Math.round(cy+Math.sin(an)*r)))return true}return false};
  const items=[],st=9;
  for(let gy=0;gy*st<area.h+st;gy++)for(let gx=0;gx*st<area.w+st;gx++){
    const px=area.x+gx*st+(hash2(gx,gy,401)-.5)*st*1.1,py=area.y+gy*st+(hash2(gx,gy,402)-.5)*st*1.1,cx=Math.floor((px-x0)/cs),cy=Math.floor((py-y0)/cs);
    if(!cov(cx,cy))continue;
    const edge=near(cx,cy,Math.max(1.5,10/cs));let w=(edge?22:52)*(.7+.6*hash2(gx,gy,403));
    if(!edge&&near(cx,cy,w*.4/cs))w*=.5;
    items.push([py,px,w,Math.floor(hash2(gx,gy,404)*spr.length),hash2(gx,gy,405)<.5])}
  items.sort((p,q)=>p[0]-q[0]);
  for(const [py,px,w,k,fl] of items){const sp=spr[k],h=w*sp.height/sp.width;x.save();x.translate((px-area.x)*fs,(py-area.y)*fs);if(fl)x.scale(-1,1);x.drawImage(sp,-w*fs/2,-h*fs*.62,w*fs,h*fs);x.restore()}
  return cv}
/* the cloud sheet for this level and view: rebuilt when the explored ground changes */
function mplFogFor(area,X,Y,L,seenMode){
  const W=L.rows[0].length,H=L.rows.length,fs=2;let a,key;
  if(seenMode){a=new Uint8Array(W*H);let n=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(G.seen&&G.seen[y]&&G.seen[y][x]){a[y*W+x]=1;n++}
    // what has been walked past, and the rooms beside the way, show; the rest of a dungeon stays covered
    const b=new Uint8Array(a);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(a[y*W+x])for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H)b[yy*W+xx]=1}
    a=b;key=LEVEL+':seen:'+n+':'+area.x+area.w}
  else{a=mplFogArr();if(!a)return null;key=LEVEL+':'+MPLF.ver+':'+area.x+area.w}
  if(MPLF.cache&&MPLF.cache.key===key)return MPLF.cache;
  if(!seenMode){ // outdoor fog: banks of hand-drawn clouds, solid. While walking it is only redrawn about once a second.
    const c0=MPLF.cache;if(c0&&c0.lv===LEVEL&&c0.aw===area.x+area.w&&G.time-c0.t<1&&G.time>=c0.t)return c0;
    const cv=mplFogClouds(a,W,H,area,X,Y);return MPLF.cache={key,cv,fs:4,dense:false,lv:LEVEL,aw:area.x+area.w,t:G.time}}
  const fw=Math.ceil(area.w*fs),fh=Math.ceil(area.h*fs),cv=document.createElement('canvas');cv.width=fw;cv.height=fh;const x=cv.getContext('2d');
  const m=document.createElement('canvas');m.width=W;m.height=H;const mx=m.getContext('2d'),id=mx.createImageData(W,H);
  for(let i=0;i<W*H;i++){id.data[i*4+3]=a[i]?0:255;id.data[i*4]=255}mx.putImageData(id,0,0);
  x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  // the mask is blown up with smoothing and blurred twice, so the edge of the cloud is a soft drift and not a row of squares
  const bx=(X(0)-area.x)*fs,by=(Y(0)-area.y)*fs,bw=(X(W)-X(0))*fs,bh=(Y(H)-Y(0))*fs,sm=document.createElement('canvas');sm.width=Math.ceil(fw/4);sm.height=Math.ceil(fh/4);const sx=sm.getContext('2d');sx.imageSmoothingEnabled=true;
  sx.drawImage(m,bx/4,by/4,bw/4,bh/4);const sm2=document.createElement('canvas');sm2.width=Math.ceil(fw/8);sm2.height=Math.ceil(fh/8);const s2=sm2.getContext('2d');s2.imageSmoothingEnabled=true;s2.drawImage(sm,0,0,sm2.width,sm2.height);
  sx.clearRect(0,0,sm.width,sm.height);sx.drawImage(sm2,0,0,sm.width,sm.height);x.drawImage(sm,0,0,fw,fh);
  x.globalCompositeOperation='source-in';x.fillStyle=seenMode?'#cdbb8e':x.createPattern(mplCloudTex(),'repeat');x.fillRect(0,0,fw,fh);
  return MPLF.cache={key,cv,fs,dense:!!seenMode}}
