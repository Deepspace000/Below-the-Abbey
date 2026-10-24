/* ==========================================================================
   ONE CREATURE TO A SQUARE. No two living creatures ever stand on the same square.
   1. A creature's turn that would end on a square another creature holds (a walk, a flutter, a leap or a teleport of any kind) is undone: it stays where it was.
   2. After every round, on every arrival and when a save is loaded, any creatures that do share a square (a spawn, a summon, an old save) are spread out: the later one
      moves to the nearest square that is open floor with no solid scenery, no creature and not the party's.
   Last in the injection order.
   ========================================================================== */
function nsFree(x,y,self){
  if(x<0||y<0||x>=MW||y>=MH||!G.grid[y]||G.grid[y][x]!==0)return false;
  if(x===G.P.x&&y===G.P.y)return false;
  for(const e of G.enemies)if(e!==self&&e.hp>0&&e.x===x&&e.y===y)return false;
  return !G.decor.some(d=>d.block&&!d.found&&!d.npc&&d.x===x&&d.y===y);
}
function nsUnstack(){
  try{
    if(!G.enemies||!G.grid)return;
    const seen=new Map();
    for(const e of G.enemies){
      if(!(e.hp>0))continue;const k=e.y*MW+e.x;
      if(!seen.has(k)){seen.set(k,e);continue}
      let best=null;
      for(let r=1;r<10&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=e.x+dx,y=e.y+dy;
        if(nsFree(x,y,e)&&!seen.has(y*MW+x)){best=[x,y];break}}
      if(best){e.x=best[0];e.y=best[1];e.rx=best[0];e.ry=best[1];seen.set(best[1]*MW+best[0],e)}
    }
  }catch(err){console.error('nsUnstack',err)}
}
{const _ea=enemyAct;enemyAct=function(e){
  const x0=e.x,y0=e.y,r=_ea.apply(this,arguments);
  try{if((e.x!==x0||e.y!==y0)&&G.enemies.some(o=>o!==e&&o.hp>0&&o.x===e.x&&o.y===e.y)){e.x=x0;e.y=y0}}catch(err){console.error(err)}
  return r}}
{const _fr=finishRound;finishRound=function(){nsUnstack();return _fr.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(){const r=_g.apply(this,arguments);nsUnstack();return r}}
{const _as=applyEnemyState;applyEnemyState=function(){const r=_as.apply(this,arguments);nsUnstack();return r}}
