/* ==========================================================================
   QUEST MARKS ON THE AREA MAPS. On every area map, each person who has a quest to give carries a gold ! (a quest to take) and each person a finished quest can be handed to a green ? (the same marks
   as over their heads), with their name under the mark, so a quest giver can be found on the map. Laid over the cached map each time it is shown, so they follow the quests. Last in the injection order.
   ========================================================================== */
/* everything already written on the map while it is painted (shop marks, people, titles) is noted, so a name never lands on it */
const QREC={on:false,r:[]};
{const P=CanvasRenderingContext2D.prototype,_f=P.fillText;P.fillText=function(t,x,y,mw){
  if(QREC.on&&this===ctx){try{const f=parseFloat(String(this.font).match(/([\d.]+)px/)[1]);let w=this.measureText(String(t)).width;if(mw&&w>mw)w=mw;let x0=x;const al=this.textAlign;if(al==='center')x0=x-w/2;else if(al==='right'||al==='end')x0=x-w;
    const bl=this.textBaseline;let y0=y-f;if(bl==='middle')y0=y-f/2;else if(bl==='top'||bl==='hanging')y0=y;QREC.r.push([x0,y0,x0+w,y0+f])}catch(e){}}
  return _f.apply(this,arguments)}}
{const _mp=mplPaint;mplPaint=function(c,S,area,X,Y,foot){
  QREC.r=[];QREC.on=true;let r;try{r=_mp.apply(this,arguments)}finally{QREC.on=false}
  try{if(typeof questMark!=='function'||!G.decor)return r;
    const z=mplZoom();ctx.save();ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);ctx.clip();
    const placed=QREC.r.slice(),list=[];
    const obst=[];for(const fn of (window.QOBST||[])){try{for(const b of fn(area,z)){placed.push(b);obst.push(b)}}catch(e){}} // marks other layers draw later (the shops of the Deeper Hollow)
    for(const d of G.decor){if(!d.npc||!QGIVER[d.npc]||d.found||d.hidden)continue;const m=questMark(d);if(!m)continue;
      const sx=area.x+(X(d.x+.5)-area.x)*z+(G.panX||0),sy=area.y+(Y(d.y+.5)-area.y)*z+(G.panY||0);const up=obst.some(q=>sx>=q[0]&&sx<=q[2]&&sy>=q[1]&&sy<=q[3])?9:0,sy2=sy-up;list.push([d,m,sx,sy2]);placed.push([sx-5.4,sy2-12.2,sx+5.4,sy2-2.4])} // every mark is an obstacle for every name
    for(const [d,m,sx,sy] of list){
      ctx.beginPath();ctx.arc(sx,sy-7,4.6,0,6.283);ctx.fillStyle='rgba(20,12,6,.92)';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=m===2?'#7ad88a':'#ffd24a';ctx.stroke();
      ctx.fillStyle=m===2?'#7ad88a':'#ffd24a';ctx.font=`bold 7px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(m===2?'?':'!',sx,sy-6.6);
      ctx.beginPath();ctx.moveTo(sx-1.6,sy-3);ctx.lineTo(sx+1.6,sy-3);ctx.lineTo(sx,sy-.4);ctx.closePath();ctx.fill();
      const nm=((NPCS[d.npc]&&NPCS[d.npc].name)||'').split(',')[0];if(nm){ctx.font=`bold 5.6px ${FUI}`;const w=ctx.measureText(nm).width;let ly=null;
      for(const off of [3.6,-15.4,10.6,-22.4]){const bx=[sx-w/2-1,sy+off-3,sx+w/2+1,sy+off+3.2];if(!placed.some(p=>bx[0]<p[2]&&bx[2]>p[0]&&bx[1]<p[3]&&bx[3]>p[1])){placed.push(bx);ly=sy+off;break}}
      if(ly!==null){ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle='rgba(238,226,190,.92)';ctx.strokeText(nm,sx,ly);ctx.fillStyle='#2a1a0c';ctx.fillText(nm,sx,ly)}}}
    ctx.restore()}catch(e){console.error('questmarks',e)}
  return r}}
