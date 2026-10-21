/* ==========================================================================
   LOOK UP AND DOWN, EVERYWHERE. hgt_engine.js already tilts the view in the Hollow Grasslands cities (Page Up / Page Down, the right stick on a pad,
   Home to level). This file turns that on for every level and adds three more ways to look:
     mouse   hold the RIGHT button on the 3D view and drag up (look up) or down; or press V to switch "mouse look" on: then the height of the pointer
             over the 3D view is the angle (pointer at the top of the view looks up, at the bottom looks down), clicks still work as before
     pad     the right stick: left and right turn (as before), up and down look
     touch   drag two fingers up or down on the 3D view; or drag one finger on the look slider, a thin strip at the right edge of the 3D view that appears
             once the screen has been touched (tap the strip's middle to level the view)
   Outside the cities the view levels itself again after the party moves or turns (looking is a glance, not a stance). Home, or a tap on the
   middle of the slider, levels it at once. The tilt is in rows of the picture, like HGTE.pitchT (up to about 100 rows up and 35 down).
   ========================================================================== */
HGTE.pitchOn=()=>true;
const LK={on:false,hover:false,touch:false,rdrag:null,pts:{},two:null,strip:null,lx:-99,ly:-99,pos:''};
const LK_VIEW={x:0,y:0,w:420,h:210},LK_STRIP={x:403,y:34,w:14,h:140};
const lkPlay=()=>G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&!(G.inv&&G.inv.open)&&!G.loot&&!G.overview&&!(typeof TP!=='undefined'&&TP);
const lkIn=(x,y)=>x>=LK_VIEW.x&&x<LK_VIEW.x+LK_VIEW.w&&y>=LK_VIEW.y&&y<LK_VIEW.y+LK_VIEW.h;
const lkInStrip=(x,y)=>x>=LK_STRIP.x-4&&x<=LK_STRIP.x+LK_STRIP.w+4&&y>=LK_STRIP.y&&y<=LK_STRIP.y+LK_STRIP.h;
const lkSet=v=>{HGTE.pitchT=Math.max(-55,Math.min(125,v))};
/* looking left and right: the right button drag also swings the view sideways (up to about 80 degrees each way) without turning the party; the direction is inverted by default (drag left, the view swings right, like dragging the scene itself), and Menu > Gameplay can switch it to follow the drag; it settles back when the party steps or turns */
let LKYAW=0,LKYAWT=0;const lkYaw=v=>{LKYAWT=Math.max(-1.4,Math.min(1.4,v))};
addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
  if(e.key==='v'||e.key==='V'){if(!lkPlay())return;LK.hover=!LK.hover;if(!LK.hover)HGTE.pitchT=0;msg(LK.hover?'Mouse look on: the height of the pointer over the view tilts it. Press V to switch it off.':'Mouse look off.','#b8d8f0');e.preventDefault();e.stopImmediatePropagation()}
},true);
/* the right button drags the view up and down; two fingers do the same on a touch screen; the strip is a slider for one finger */
cv.addEventListener('pointerdown',e=>{
  const [x,y]=toDesign(e);
  if(e.pointerType==='touch')LK.touch=true;
  if(!lkPlay())return;
  if(e.pointerType==='mouse'&&e.button===2&&lkIn(x,y)){LK.rdrag={x,y,p:HGTE.pitchT,w:LKYAWT};try{cv.setPointerCapture(e.pointerId)}catch(_){}e.stopImmediatePropagation();e.preventDefault();return}
  if(e.pointerType==='touch'){
    LK.pts[e.pointerId]=[x,y];
    if(lkInStrip(x,y)&&!LK.two){LK.strip={id:e.pointerId};lkStrip(y,true);try{cv.setPointerCapture(e.pointerId)}catch(_){}e.stopImmediatePropagation();e.preventDefault();return}
    const ids=Object.keys(LK.pts);
    if(ids.length===2&&ids.every(k=>lkIn(LK.pts[k][0],LK.pts[k][1]))){LK.two={y:(LK.pts[ids[0]][1]+LK.pts[ids[1]][1])/2,p:HGTE.pitchT};PTR=null;e.stopImmediatePropagation()}}
},true);
function lkStrip(y,first){const t=(y-LK_STRIP.y)/LK_STRIP.h; // top of the strip = up, bottom = down, middle = level
  const mid=.5,v=t<mid?(mid-t)/mid*100:-(t-mid)/mid*35;
  if(first&&Math.abs(t-mid)<.06){HGTE.pitchT=0;return}
  lkSet(v)}
cv.addEventListener('pointermove',e=>{
  const [x,y]=toDesign(e);LK.lx=x;LK.ly=y;
  if(LK.rdrag){lkSet(LK.rdrag.p+(LK.rdrag.y-y)*2.2);lkYaw(LK.rdrag.w+(G.flags&&G.flags.lookXNormal?(LK.rdrag.x-x):(x-LK.rdrag.x))*.014);e.stopImmediatePropagation();return}
  if(e.pointerType==='touch'&&LK.pts[e.pointerId]){
    LK.pts[e.pointerId]=[x,y];
    if(LK.strip&&LK.strip.id===e.pointerId){lkStrip(y,false);e.stopImmediatePropagation();return}
    if(LK.two){const ids=Object.keys(LK.pts);if(ids.length>=2){const my=(LK.pts[ids[0]][1]+LK.pts[ids[1]][1])/2;lkSet(LK.two.p+(LK.two.y-my)*1.3)}e.stopImmediatePropagation()}}
},true);
const lkUp=e=>{if(LK.rdrag&&e.pointerType==='mouse')LK.rdrag=null;if(LK.strip&&LK.strip.id===e.pointerId)LK.strip=null;delete LK.pts[e.pointerId];if(Object.keys(LK.pts).length<2)LK.two=null};
addEventListener('pointerup',lkUp,true);addEventListener('pointercancel',lkUp,true);
/* the pointer's height is the angle while mouse look is on; the view levels itself after a step or a turn (not in the cities, where the tilt stays) */
{const _cv=climbView;climbView=function(cx,cy,dX,dY){
  try{
    if(LK.hover&&lkPlay()&&LK.ly>=0&&lkIn(LK.lx,LK.ly)){const t=(LK.ly-LK_VIEW.y)/LK_VIEW.h;const mid=.5;HGTE.pitchT=t<mid?(mid-t)/mid*80:-(t-mid)/mid*30}
    const pos=(G.P?G.P.x+','+G.P.y+','+G.P.f:'');
    if(pos!==LK.pos){if(LK.pos&&!LK.hover&&!LK.rdrag&&!LK.two&&!LK.strip&&!(typeof hgtAny==='function'&&hgtAny(LEVEL)))HGTE.pitchT=0;if(LK.pos&&!LK.rdrag)LKYAWT=0;LK.pos=pos}
    LKYAW+=(LKYAWT-LKYAW)*.3;if(Math.abs(LKYAWT-LKYAW)<.002)LKYAW=LKYAWT
  }catch(e){}
  return _cv.apply(this,arguments)}}
addEventListener('keydown',e=>{if(e.key==='Home'){LK.hover=false;LKYAWT=0}});
/* the slider, drawn only after the first touch */
(function(){const _h=uwHud;uwHud=function(){_h();try{
  if(!LK.touch||!lkPlay())return;
  const S=LK_STRIP,p=HGTE.pitch||0,t=p>=0?.5-p/100*.5:.5+(-p/35)*.5;
  ctx.save();ctx.globalAlpha=.55;ctx.fillStyle='rgba(20,14,8,.7)';ctx.fillRect(S.x,S.y,S.w,S.h);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.strokeRect(S.x+.5,S.y+.5,S.w-1,S.h-1);
  ctx.fillStyle='#e8d8a0';ctx.font='8px serif';ctx.textAlign='center';ctx.fillText('▲',S.x+S.w/2,S.y+10);ctx.fillText('▼',S.x+S.w/2,S.y+S.h-3);
  ctx.fillStyle='#c8a860';ctx.fillRect(S.x+2,S.y+S.h/2,S.w-4,1);
  ctx.globalAlpha=.95;ctx.fillStyle='#f0e0a8';const ky=S.y+12+(S.h-24)*Math.max(0,Math.min(1,t));ctx.fillRect(S.x+1,ky-3,S.w-2,6);
  ctx.restore()}catch(e){}}})();
