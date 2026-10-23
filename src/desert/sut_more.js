/* ==========================================================================
   MORE FOES IN THE TOMB OF SUT, AND SKELETONS THAT HIT MORE OFTEN (prefix sutm).
   1. Four more skeletons and two more mummies stand in the Hall of Eternity, the big hall in the middle of the Tomb of Sut (level 42). They are spread
      out in a zigzag from the south end to the north end, five or more squares apart, so they do not all wake at once, and none is near the way in or
      beside a passage mouth. The skeleton kind the tomb already uses is dskeleton; the mummies use the tomb's own level 16.
   2. Skeletons missed a lot. Every creature kind named Skeleton (skel and dskeleton) gets 0.12 added to its hit chance (about 0.72 and 0.74 before).
   ========================================================================== */
(function sutMore(){
  // skeletons hit more often (done once, whatever the number of times this file runs)
  for(const k of Object.keys(ENEMY_DEF)){const d=ENEMY_DEF[k];if(d&&d.name==='Skeleton'&&!d.sutmHit){d.hit=Math.min(.95,Math.round((d.hit+.12)*100)/100);d.sutmHit=1}}
  // the extra foes in the Hall of Eternity
  const L=LEVELS[42];if(!L||!L.enemies||!L.rows)return;
  const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
  const taken=new Set(L.enemies.concat(L.decor||[],L.items||[]).map(e=>e.x+','+e.y));
  const solid=new Set((L.decor||[]).filter(d=>d.block).map(d=>d.x+','+d.y));
  const plan=[['dskeleton',44,41,15],['mummy',52,41,16],['dskeleton',48,36,15],['dskeleton',43,31,15],['dskeleton',53,31,15],['mummy',48,30,16]];
  for(const [t,x,y,lvl] of plan){
    if(!L.enemies.some(e=>e.sutm&&e.x===x&&e.y===y)&&open(x,y)&&!solid.has(x+','+y)&&!taken.has(x+','+y)){L.enemies.push({t,x,y,lvl,sutm:1});taken.add(x+','+y)}
  }
})();
