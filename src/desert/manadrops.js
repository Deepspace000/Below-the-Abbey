/* ==========================================================================
   MANA POTIONS ON THE FLOOR. Mana no longer comes back by itself, so every area has a few mana draughts lying about for the party to find: three to six, by the size of the area,
   (one in a small den, two in a small place, three to six in the rest), spread out over the ground that can be walked to from the start (never by a door, never on scenery, a creature's post or another item). The kind goes with the area's level:
   the Mana Draught in the early places, the Greater Mana Draught in the middle ones, and in the high ones mostly Greater with now and then a Superior (which fills the whole bar).
   The places are picked from the number of the area and nothing else, so they are the same on every visit and in every save. They go on the END of the area's list of floor items,
   after the herbs, so a save made before this change still finds every item it knew where it was. The tiny rooms (shops, houses) get none, and neither does the open sea.
   ========================================================================== */
const MANA_DROP_MIN_FLOOR=60;
function manaDrop(n){
  const L=LEVELS[n];if(!L||L._manaDrop||!L.rows||!L.rows.length||!Array.isArray(L.items))return;L._manaDrop=1;
  if(n>=330&&n<=343)return;                                   // the open sea
  const H=L.rows.length,W=L.rows[0].length,st=L.start||{x:1,y:1},rows=L.rows;
  const cell=(x,y)=>x>=0&&y>=0&&x<W&&y<H?rows[y][x]:'#';
  // the ground that can be walked to from the start (floor, and doors that open)
  const seen=new Uint8Array(W*H),q=new Int32Array(W*H);let qh=0,qt=0;
  const push=(x,y)=>{const c=cell(x,y);if(c!=='.'&&c!=='D'&&c!=='t')return;const i=y*W+x;if(seen[i])return;seen[i]=1;q[qt++]=i};
  push(st.x,st.y);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])push(st.x+dx,st.y+dy);
  while(qh<qt){const i=q[qh++],x=i%W,y=(i/W)|0;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,c=cell(nx,ny);if(c==='.'||c==='D')push(nx,ny)}}
  const taken=new Set(),block=new Set();
  for(const o of [...L.items,...(L.enemies||[])])if(o)taken.add(o.x+','+o.y);
  for(const d of ((typeof DECOR_SPAWNS!=='undefined'&&LEVEL===n&&DECOR_SPAWNS)||L.decor||[])){ // solid scenery, people and containers: the square itself (flowers and other things that can be walked over do not count)
    if(d&&(d.block||d.npc||(typeof CONTAINERS!=='undefined'&&CONTAINERS.includes(d.k))||d.shop))block.add(d.x+','+d.y)}
  for(const p of (L.portals||[]))if(p)for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)block.add((p.x+dx)+','+(p.y+dy));
  const tb=typeof terrFor==='function'?terrFor(n):null;
  const cand=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    if(!seen[y*W+x]||rows[y][x]!=='.')continue;
    const k=x+','+y;if(taken.has(k)||block.has(k))continue;
    if(tb&&tb.block&&tb.block[y*tb.W+x])continue;
    if(Math.abs(x-st.x)+Math.abs(y-st.y)<4)continue;
    let door=false;for(let dy=-2;dy<=2&&!door;dy++)for(let dx=-2;dx<=2;dx++){const c=cell(x+dx,y+dy);if(c==='D'||/[0-9]/.test(c)){door=true;break}} // not by a door
    if(door)continue;
    cand.push([x,y])}
  let reach=0;for(let i=0;i<W*H;i++)if(seen[i]&&rows[(i/W)|0][i%W]==='.')reach++; // how many floor squares can be walked to: the sizes below go by this, which no item or scenery changes
  const lived=(L.enemies||[]).length>0; // a small place with creatures in it (a den, a burrow) gets one; a shop or a house gets none
  if(!lived)return;                                            // only places with creatures in them: no potions on the floor of shops, houses and towns
  if(reach<MANA_DROP_MIN_FLOOR&&reach<12)return;
  const cnt=reach<MANA_DROP_MIN_FLOOR?1:reach<150?2:Math.max(3,Math.min(6,2+Math.round(reach/450)));
  const rating=(typeof gotoRate==='function'?gotoRate(n):0)||(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[n])||L.diff||n;
  const placed=[];
  // each square has its own number for each potion (from its place and the area only), and the potion goes on the square with the lowest number that is far enough from the others:
  // so a different list of squares (an item put somewhere by another part of the game) cannot move the potions
  for(let k=0;k<cnt;k++){
    let best=null;
    for(const need of [12,7,3]){let bs=2;
      for(const c of cand){const sc=hash2(c[0]*131+k*7919,c[1]*17+n,977+k);if(sc>=bs)continue;if(!placed.every(p=>Math.abs(p[0]-c[0])+Math.abs(p[1]-c[1])>=need))continue;bs=sc;best=c}
      if(best)break}
    if(!best)continue;placed.push(best);
    const id=rating<35?'manadraught':rating<65?(k%2?'greatermana':'manadraught'):(k===0&&cnt>=4&&hash2(n,k,983)<.6?'supermana':'greatermana');
    L.items.push({k:id,x:best[0],y:best[1]})}
}
// every area, whichever way it is entered (a new game, a door, a loaded save), gets its mana potions once, after the herbs
{const _ll=loadLevel;loadLevel=function(n){_ll.apply(this,arguments);try{if(typeof herbPlace==='function')herbPlace(LEVEL,false);manaDrop(LEVEL)}catch(e){console.error(e)}}}
// a save made before this change knows fewer floor items than the area has now: what it knew still applies (the new ones are on the end)
{const _as=applyLevelState;applyLevelState=function(s){
  try{if(s&&Array.isArray(s.items)&&s.items.length!==G.items.length){const pad=s.items.slice(0,G.items.length);while(pad.length<G.items.length)pad.push(0);s=Object.assign({},s,{items:pad})}} // (a save from 3.624 may know potions that a place without creatures no longer has)
  catch(e){console.error(e)}
  return _as.call(this,s)}}
