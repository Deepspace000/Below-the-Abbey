/* ==========================================================================
   THE WEATHER ICON. A small painted picture of the weather over the party sits in the top strip of the 3D view, toward the middle of the top (just right of the Menu tab),
   apart from the affliction icons in the top right corner. Tapping it says what the weather is doing. Pictures: assets/wx_<kind>.png. Names start wxh.
   ========================================================================== */
let wxhLoaded=false;
function wxhKind(w){if(w.id==='clear'){const h=(G.clock%1440)/60;return (h<6||h>=20)?'night':'clear'}return w.id}
function wxhDraw(){
  if(G.cut||G.talk||G.menu||G.inv.open||G.loot||G.overview)return;
  const w=typeof weatherNow==='function'?weatherNow():null;if(!w)return;
  if(!wxhLoaded){wxhLoaded=true;for(const k of ['clear','night','rain','storm','fog','snow','frost','heat','haze'])loadImg('wx_'+k,'assets/wx_'+k+'.png')}
  const im=IMG['wx_'+wxhKind(w)],S=18,x=266,y=4;
  ctx.save();ctx.fillStyle='rgba(10,8,5,.72)';rrect(ctx,x-1.5,y-1.5,S+3,S+3,3);ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#c9ba8e';rrect(ctx,x-1.5,y-1.5,S+3,S+3,3);ctx.stroke();
  if(im&&im.width)ctx.drawImage(im,x,y,S,S);else txt(w.n[0],x+S/2,y+S/2+.5,9,'#e8dcb4','center',true);
  ctx.restore();btn('wxhud',x,y,S,S)}
{const _a=afflHud;afflHud=function(){_a.apply(this,arguments);wxhDraw()}}
{const _h=handleBtn;handleBtn=function(id){
  if(id==='wxhud'){const w=weatherNow();if(w)msg(w.n+'. '+(w.text||''),'#e8d8a0');return}
  return _h.apply(this,arguments)}}
