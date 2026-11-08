/* ==========================================================================
   THE PALE KING'S SIZE (v3.878). He used to be drawn at his full great size (2.6 high) all the time, so up close his head was above the top of the view, as if he floated over the party.
   Now he stands at the great size while the party crosses the hall, and when it comes within about five squares, or he is hurt, he comes down to a human size that fits the window
   (the same fit as other creatures) over about a second and a half, and stays there for the fight.
   ========================================================================== */
{const _fs=fitScale;fitScale=function(t,def,base){
  const v=_fs.apply(this,arguments);
  if(t!=='psf6_king')return v;
  const e=G.enemies.find(q=>q.t==='psf6_king');if(!e)return v;
  const d=Math.hypot((e.rx!==undefined?e.rx:e.x)-G.C.x,(e.ry!==undefined?e.ry:e.y)-G.C.y);
  if(e._kS===undefined&&(d<=5.5||(e.maxhp&&e.hp<e.maxhp)))e._kS=G.time;
  const k=e._kS===undefined?0:Math.min(1,(G.time-e._kS)/1.5),s=k*k*(3-2*k);
  return 1+(Math.min(v,.5)-1)*s}}
