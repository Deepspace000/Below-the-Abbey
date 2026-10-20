/* ==========================================================================
   NARROW STAIRS STAY CLEAR (owner rule). Nothing stands on a narrow stair in the terraced cities: no lamps, plants, ornaments, props, creatures or townsfolk.
   A stair cell is an open cell with a neighbour of different height (0.1 to 0.55); the stair is NARROW when its width across the climb is 3 cells or less.
   hgtnCells(L) returns the set of 'x,y' keys of narrow stair cells (cached on L._hgtNarrow, a Set); hgtnClear(L) removes decor and lights on them.
   Other systems (life, creatures, lamps, mazes) must test `hgtnBlocked(L,x,y)` before placing anything. It runs once per level load for levels 480 to 489 and the interiors.
   Quest givers, shops, doors and portals (decor with npc, shop, enter) are never removed. Names start with hgtn.
   ========================================================================== */
function hgtnCells(L){
  if(!L||!L.terrace||!L.rows)return new Set();
  if(L._hgtNarrow)return L._hgtNarrow;
  const H=L.rows.length,W=L.rows[0].length,h=L.terrace.h,S=new Set();
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.';
  const dh=(a,b)=>Math.abs(h[a]-h[b]);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!open(x,y))continue;const i=y*W+x;
    for(const [ax,ay] of [[1,0],[0,1]]){ // the climb runs along this axis if the neighbours along it differ in height
      const nx=x+ax,ny=y+ay,px=x-ax,py=y-ay;
      const up=open(nx,ny)&&dh(i,ny*W+nx)>=.1&&dh(i,ny*W+nx)<=.55,dn=open(px,py)&&dh(i,py*W+px)>=.1&&dh(i,py*W+px)<=.55;
      if(!up&&!dn)continue;
      // width across the climb: contiguous open cells at about the same height perpendicular to the axis
      let w=1;for(const sg of [-1,1]){for(let k=1;k<=4;k++){const sx=x+(ay?sg*k:0),sy=y+(ax?sg*k:0);if(open(sx,sy)&&dh(i,sy*W+sx)<.12)w++;else break}}
      if(w<=3)S.add(x+','+y);
    }
  }
  return L._hgtNarrow=S;
}
const hgtnBlocked=(L,x,y)=>hgtnCells(L).has(Math.floor(x)+','+Math.floor(y));
function hgtnClear(L){
  if(!L||L._hgtClr||!L.terrace)return;L._hgtClr=1;const S=hgtnCells(L);if(!S.size)return;
  const keep=d=>d.npc||d.shop||d.enter||d.door||d.exitDoor,f=d=>S.has(Math.floor(d.x)+','+Math.floor(d.y));
  if(L.decor)for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(!keep(d)&&f(d))L.decor.splice(i,1)}
  if(typeof G!=='undefined'&&G.decor&&G.decor!==L.decor)for(let i=G.decor.length-1;i>=0;i--){const d=G.decor[i];if(!keep(d)&&f(d))G.decor.splice(i,1)}
  for(const key of ['lights','lightList','lamps']){const a=L[key];if(Array.isArray(a))for(let i=a.length-1;i>=0;i--){const e=a[i],x=Array.isArray(e)?e[0]:e&&e.x,y=Array.isArray(e)?e[1]:e&&e.y;if(x!==undefined&&S.has(Math.floor(x)+','+Math.floor(y)))a.splice(i,1)}}
  if(typeof buildDecorMap==='function'&&typeof G!=='undefined'&&G.decor)buildDecorMap();
}
{const _u=update;update=function(dt){try{const n=LEVEL;if((typeof hgtAny==='function'&&hgtAny(n)||n===480)&&G.state==='play'&&LEVELS[n]&&!LEVELS[n]._hgtClr){hgtnClear(LEVELS[n]);if(typeof hgtnAfter==='function')hgtnAfter(n)}}catch(e){console.error('hgtn',e)}return _u.apply(this,arguments)}}
