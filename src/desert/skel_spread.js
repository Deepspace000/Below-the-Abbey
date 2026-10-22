/* ==========================================================================
   SKELETONS FARTHER FROM THE WOLVES (prefix sks). On the abbey grounds and the Thornwood (level 2) the wolves' cutscene starts when the party passes x 17, and a skeleton's own cutscene starts when one is seen within nine squares, so the two
   came one straight after the other. The two skeletons nearest the way in (at x 25 and x 30) are moved east to about x 40 and x 44, so the skeletons' cutscene comes well after the wolves' (the others stay where they were).
   ========================================================================== */
{const L=LEVELS[2];if(L&&L.enemies&&L.rows){
  const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',occ=new Set(L.enemies.concat(L.decor||[],L.items||[]).map(e=>e.x+','+e.y));
  const moves=[[25,12,40,12],[30,5,44,6]];
  for(const [fx,fy,tx,ty] of moves){const e=L.enemies.find(q=>q.t==='skel'&&q.x===fx&&q.y===fy);if(!e)continue;
    let done=false;for(let r=0;r<8&&!done;r++)for(let dy=-r;dy<=r&&!done;dy++)for(let dx=-r;dx<=r&&!done;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=tx+dx,y=ty+dy;if(!open(x,y)||occ.has(x+','+y))continue;occ.delete(fx+','+fy);e.x=x;e.y=y;if(e.rx!==undefined){e.rx=x;e.ry=y}occ.add(x+','+y);done=true}}}}
