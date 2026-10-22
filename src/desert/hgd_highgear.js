/* ==========================================================================
   HIGH LEVEL GEAR IN THE SHOPS (prefix hgdhg / HGDHG). The weapon shops of the eight maze towns now also sell every weapon of level 50 and over, and the armour shops every piece of armour of level 50 and over (helmets, chests, arms, legs and shields), one of each,
   in order of level, on top of the usual stock. The lists are read from ITEMDEF when a shop is opened, so gear added later is picked up too.
   ========================================================================== */
const HGDHG={MIN:50};
function hgdhgList(kind){
  const armour=['head','chest','arms','legs','shield','feet','cloak'],ids=Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];if(!d||!(d.lvl>=HGDHG.MIN)||!((d.price||0)>0))return false;return kind==='arms'?d.k==='weapon':armour.includes(d.k)});
  return ids.sort((a,b)=>(ITEMDEF[a].lvl-ITEMDEF[b].lvl)||(ITEMDEF[a].price-ITEMDEF[b].price))}
{const _s=hgds2Stock;hgds2Stock=function(kind,town){const rows=_s.apply(this,arguments);
  if(kind!=='arms'&&kind!=='armour')return rows;
  try{const have=new Set(rows.map(r=>r[0]));for(const id of hgdhgList(kind))if(!have.has(id))rows.push([id,1])}catch(e){console.error('hgdhg',e)}
  return rows}}
// the level 60 and over weapons all cost between 8000 and 9000 gold, dearer with level and power
{const P={hgsting:8000,hgmandible:8200,hgsunblade:8400,hgl70dagger:8500,hgl70axe:8600,hgl70staff:8700,hgl70bow:8800,hgl70mace:8900,hgl70sword:9000};for(const id in P)if(ITEMDEF[id])ITEMDEF[id].price=P[id]}
