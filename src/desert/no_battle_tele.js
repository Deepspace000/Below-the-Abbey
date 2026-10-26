/* ==========================================================================
   NO TELEPORTING IN A BATTLE. A fight is on when a living creature is within 3 squares of the party, or an alerted one within 7 (the same rule the Bogeyman uses).
   While it is on, the teleport stones (teleportTo and the maze stones), and the Potion of Escape refuse, with a message. The party must win, or get away, first.
   ========================================================================== */
function inBattle(){
  try{const P=G.P;return (G.enemies||[]).some(q=>{if(q.hp<=0||q.dying)return false;const m=Math.abs(q.x-P.x)+Math.abs(q.y-P.y);return m<=3||(q.alert&&m<=7)})}catch(e){return false}
}
function nbtRefuse(){msg('You cannot teleport while a fight is on. Win it, or get away, first.','#d09a80');return false}
if(typeof teleportTo==='function'){const _t=teleportTo;teleportTo=function(){if(inBattle()){G.teleMode=false;return nbtRefuse()}return _t.apply(this,arguments)}}
if(typeof hgdtGo==='function'){const _h=hgdtGo;hgdtGo=function(){if(inBattle())return nbtRefuse();return _h.apply(this,arguments)}}
if(typeof useHeal==='function'){const _u=useHeal;useHeal=function(hi,idx){
  try{if(inBattle()){const i=idx<0?bestPotionIndex(hi):idx,it=G.bag[i];if(it&&idef(it).escape)return nbtRefuse()}}catch(e){}
  return _u.apply(this,arguments)}}
