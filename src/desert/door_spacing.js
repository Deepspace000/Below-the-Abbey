/* ==========================================================================
   HOUSE DOORS AWAY FROM SHOPS AND EXITS. In a town, a house door never stands close to a shop, an inn, a church, a hall, an exit or any other public door: it must be at least
   5 squares away (by the count of steps), so it is always clear which door is which. A house door that is too close is closed up: it becomes the plain wall of its building.
   This is done once when the town is loaded, from the level's own rows, so it is the same on every visit. Doors of the places with names that are not houses (shops, inns,
   halls, quays, gates, caves) are never touched. Last in the injection order.
   ========================================================================== */
const DS_MIN=5;
const DS_HOUSE=/(House|Billet|Study|Workshop|Cottage|Hut)$/i;
function dsDoors(L){
  const out=[];if(!L||!L.rows||!L.chars&&!L.portals)return out;
  const ch=L.chars||{};
  for(let y=0;y<L.rows.length;y++){const r=L.rows[y];for(let x=0;x<r.length;x++){
    const c=r[x];let to=null,idx=null;const v=ch[c];
    if(typeof v==='number'&&typeof KH_DOOR!=='undefined'&&KH_DOOR[v])to=KH_DOOR[v].lvl;
    else if(typeof v==='number'&&v>=30&&v<100&&L.portals&&L.portals[v-30])idx=v-30;
    else if(/[0-9]/.test(c)&&L.portals&&L.portals[+c])idx=+c;
    if(idx!==null)to=L.portals[idx].to;
    if(to===null)continue;
    const nm=LEVEL_NAMES[to]||(LEVELS[to]&&LEVELS[to].name)||'';
    out.push({x,y,c,to,nm,house:DS_HOUSE.test(nm)&&!/^The /.test(nm)})}}
  return out}
function dsFix(n){
  const L=LEVELS[n];if(!L||L._dsDone||!L.rows)return;L._dsDone=1;
  try{
    const ds=dsDoors(L);if(ds.length<4)return;
    const pub=ds.filter(d=>!d.house),ch=L.chars||{};
    let closed=0;
    for(const h of ds){if(!h.house)continue;
      if(!pub.some(p=>Math.abs(p.x-h.x)+Math.abs(p.y-h.y)<DS_MIN))continue;
      const row=L.rows[h.y],wall=c=>c!==undefined&&c!=='.'&&c!==h.c&&typeof ch[c]==='number'&&!(typeof KH_DOOR!=='undefined'&&KH_DOOR[ch[c]])&&!(ch[c]>=30&&ch[c]<100);
      const w=wall(row[h.x+1])?row[h.x+1]:wall(row[h.x-1])?row[h.x-1]:null;
      if(!w)continue;
      L.rows[h.y]=row.slice(0,h.x)+w+row.slice(h.x+1);closed++;
      if(L.decor)for(const d of L.decor)if(d.x===h.x&&d.y===h.y&&(d.enter||/door|glow/i.test(d.k||'')))d.sc=.0001}
    if(closed)(L._dsClosed=closed);
  }catch(e){console.error('dsFix',n,e)}
}
{const _ll=loadLevel;loadLevel=function(n){try{dsFix(n)}catch(e){console.error(e)}return _ll.apply(this,arguments)}}
