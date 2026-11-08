/* ==========================================================================
   NEW GAME PLUS WEAPONS (v3.880). In New Game Plus the creatures stand at their old level plus the offset (G.flags.ngOff, the party's level when it began again, minus 1), so a level 5 sword from the first
   journey would do nothing. Now every weapon has the damage of a weapon whose level is its own level plus the same offset: its damage (and the spell power of staves and wands) is multiplied by
   P(level + offset) / P(level), where P is the damage the best ordinary sword of a level does (read from the game's own sword ladder, and carried on past level 110 at the slope of its last stretch).
   The first values are kept (d._b), so a second New Game Plus is worked out from the original, not on top of the first, and a plain new game goes back to them.
   ========================================================================== */
let NGW_ON=0,NGW_P=null;
function ngwLevel(d){return d.lvl||(d.price?Math.max(1,Math.min(100,Math.round(Math.sqrt(d.price)/1.2))):1)}
function ngwCurve(){
  if(NGW_P)return NGW_P;
  const pts=new Map();
  for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='weapon'||d.t!=='Sword'||d.rar||d.pg||d.sup||!d.price||!d.lvl||!d.dmg)continue;
    const b=d._b||d.dmg,p=(b[0]+b[1])/2*(1+(d.hit||0));if(!pts.has(d.lvl)||pts.get(d.lvl)<p)pts.set(d.lvl,p)}
  // the best so far (never going down), a point for every level
  const L=[...pts.keys()].sort((a,b)=>a-b),pl=[];let best=0;
  for(const l of L){best=Math.max(best,pts.get(l));pl.push([l,best])}
  pl.unshift([0,Math.max(4,pl[0][1]*.5)]);
  const last=pl[pl.length-1],prev=pl.filter(q=>q[0]<=last[0]-20).pop()||pl[0],slope=(last[1]-prev[1])/Math.max(1,last[0]-prev[0]);
  NGW_P=l=>{if(l<=0)return pl[0][1];if(l>=last[0])return last[1]+slope*(l-last[0]);
    for(let i=1;i<pl.length;i++)if(l<=pl[i][0]){const a=pl[i-1],b=pl[i];return a[1]+(b[1]-a[1])*(l-a[0])/Math.max(1,b[0]-a[0])}return last[1]};
  return NGW_P}
function ngWeapons(){
  const off=Math.max(0,typeof ngEff==='function'?ngEff():0);
  if(off===NGW_ON)return;
  const P=ngwCurve();
  for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='weapon'||!d.dmg)continue;
    if(!d._b)d._b={dmg:d.dmg.slice(),magic:d.magic};
    const f=off?Math.max(1,P(ngwLevel(d)+off)/Math.max(1,P(ngwLevel(d)))):1;
    d.dmg=[Math.max(1,Math.round(d._b.dmg[0]*f)),Math.max(1,Math.round(d._b.dmg[1]*f))];
    if(d._b.magic)d.magic=Math.round(d._b.magic*f)}
  NGW_ON=off;try{if(typeof TP_CACHE!=='undefined')for(const k in TP_CACHE)delete TP_CACHE[k]}catch(e){}}
{const _g=goToLevel;goToLevel=function(){try{ngWeapons()}catch(e){console.error('ngWeapons',e)}return _g.apply(this,arguments)}}
if(typeof ngBegin==='function'){const _nb=ngBegin;ngBegin=function(){const r=_nb.apply(this,arguments);try{ngWeapons();msg('Every weapon has the strength of a weapon '+((G.flags.ngOff)|0)+' levels higher.','#ffe36a')}catch(e){console.error(e)}return r}}
