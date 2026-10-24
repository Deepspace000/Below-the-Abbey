/* ==========================================================================
   QUEST MARKS ON THE AREA MAPS. On every area map, each person who has a quest to give carries a gold ! (a quest to take) and each person a finished quest can be handed to a green ? (the same marks
   as over their heads), with their name under the mark, so a quest giver can be found on the map. Laid over the cached map each time it is shown, so they follow the quests. Last in the injection order.
   ========================================================================== */
{const _mp=mplPaint;mplPaint=function(c,S,area,X,Y,foot){
  const r=_mp.apply(this,arguments);
  try{if(typeof questMark!=='function'||!G.decor)return r;
    const z=mplZoom();ctx.save();ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);ctx.clip();
    const placed=[];
    for(const d of G.decor){if(!d.npc||!QGIVER[d.npc]||d.found||d.hidden)continue;const m=questMark(d);if(!m)continue;
      const sx=area.x+(X(d.x+.5)-area.x)*z+(G.panX||0),sy=area.y+(Y(d.y+.5)-area.y)*z+(G.panY||0);
      ctx.beginPath();ctx.arc(sx,sy-7,4.6,0,6.283);ctx.fillStyle='rgba(20,12,6,.92)';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=m===2?'#7ad88a':'#ffd24a';ctx.stroke();
      ctx.fillStyle=m===2?'#7ad88a':'#ffd24a';ctx.font=`bold 7px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(m===2?'?':'!',sx,sy-6.6);
      ctx.beginPath();ctx.moveTo(sx-1.6,sy-3);ctx.lineTo(sx+1.6,sy-3);ctx.lineTo(sx,sy-.4);ctx.closePath();ctx.fill();
      const nm=((NPCS[d.npc]&&NPCS[d.npc].name)||'').split(',')[0];if(nm){ctx.font=`bold 5.6px ${FUI}`;const w=ctx.measureText(nm).width;let ly=null;
      for(const off of [3.6,-15.4,10.6,-22.4]){const bx=[sx-w/2-1,sy+off-3,sx+w/2+1,sy+off+3.2];if(!placed.some(p=>bx[0]<p[2]&&bx[2]>p[0]&&bx[1]<p[3]&&bx[3]>p[1])){placed.push(bx);ly=sy+off;break}}
      if(ly!==null){ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle='rgba(238,226,190,.92)';ctx.strokeText(nm,sx,ly);ctx.fillStyle='#2a1a0c';ctx.fillText(nm,sx,ly)}}}
    ctx.restore()}catch(e){console.error('questmarks',e)}
  return r}}
