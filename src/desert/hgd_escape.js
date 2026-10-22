/* ==========================================================================
   THE POTION OF ESCAPE (prefix hgdes / HGDES). Drunk anywhere in the Underlevel (level 476), it takes the whole party up to the surface of the maze, to the foot of the nearest ladder down. Drunk anywhere else it
   does nothing and is not used up. Sold by the potion sellers of the Deeper Hollow, and lying in the dead ends of the Underlevel (a few near the ladders down).
   ========================================================================== */
ITEMDEF.hgescape={n:'Potion of Escape',k:'potion',t:'Potion',ic:'potion',c:'#8fd8ff',escape:1,price:700,minLvl:1,d:'Drink it in the Underlevel and the whole party is carried up to the surface of the maze, at the foot of a ladder down. It does nothing anywhere else, and is not used up.',sw:.32};
{const _h=useHeal;useHeal=function(hi,idx){
  try{if(idx<0)idx=bestPotionIndex(hi);const it=G.bag[idx];
    if(it&&idef(it).escape){
      if(LEVEL!==HGDU.ID){msg('The Potion of Escape only works in the Underlevel. Keep it for when you are down there.','#c8b8e0');return false}
      bagTake(idx);sfx('potion');
      const SU=LEVELS[HGD.ID]&&LEVELS[HGD.ID]._hgdu;if(!SU||!SU.ladders.length){msg('The potion fizzles.','#c8b8e0');return false}
      // the ladder nearest to where the party stands
      let bi=0,bd=1e9;SU.ladders.forEach((l,i)=>{const d=Math.hypot(l.ax-G.P.x,l.ay-G.P.y);if(d<bd){bd=d;bi=i}});
      try{if(G.flags.hgdOcean)G.flags.hgdOcean.on=false}catch(e){}
      hgduGo(bi,false);
      msg(HERO_DEF[hi].name+' drinks the Potion of Escape. The dark rushes past, and the party stands in the light at the foot of a ladder, back on the surface of the maze.','#9ae0ff');
      return true}}catch(e){console.error('hgdes',e)}
  return _h.apply(this,arguments)}}
// the potion sellers of the maze keep it
{const _os=openShop;openShop=function(d,stock,name){
  try{if(LEVEL===HGD.ID&&!d.contents&&stock.some(r=>/potion/.test(r[0]))&&!stock.some(r=>r[0]==='hgescape'))stock=stock.concat([['hgescape',4]])}catch(e){}
  return _os.call(this,d,stock,name)}}
// the dead ends of the Underlevel hold a few
function hgdesPlace(L){
  if(L._hgdes)return L._hgdes;const rows=L.rows,H=rows.length,W=rows[0].length,rnd=hgdmRng(476555),open=(x,y)=>rows[y]&&rows[y][x]==='.'&&!(typeof hgoWater==='function'&&hgoWater(x,y));
  const occ=new Set(L.enemies.concat(L.decor,L.items||[]).map(e=>e.x+','+e.y)),lad=(L._hgdu&&L._hgdu.ladders)||[],res=[],cand=[];
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!open(x,y)||occ.has(x+','+y))continue;const deg=[[0,-1],[1,0],[0,1],[-1,0]].filter(d=>open(x+d[0],y+d[1])).length;if(deg===1)cand.push([x,y,rnd()])}
  cand.sort((a,b)=>a[2]-b[2]);
  // two close to each ladder down (a way out near the way in), the rest scattered far apart
  for(const l of lad){let n=0;for(const c of cand){const d=Math.hypot(c[0]-l.ax,c[1]-l.ay);if(d>=9&&d<=24&&!res.some(r=>Math.abs(r.x-c[0])+Math.abs(r.y-c[1])<8)){res.push({k:'hgescape',x:c[0],y:c[1],taken:false});if(++n>=1)break}}}
  for(const c of cand){if(res.length>=lad.length+8)break;if(res.some(r=>Math.abs(r.x-c[0])+Math.abs(r.y-c[1])<24))continue;res.push({k:'hgescape',x:c[0],y:c[1],taken:false})}
  return L._hgdes=res}
{const _u=update;update=function(dt){
  try{if(LEVEL===HGDU.ID&&G.state==='play'){const L=LEVELS[HGDU.ID];if(L&&L._hgdo){
      const res=hgdesPlace(L),F=G.flags;F.hgdesTaken=F.hgdesTaken||{};
      if(G.items!==G._hgdesItems){G._hgdesItems=G.items;for(const r of res){const key=r.x+','+r.y;if(F.hgdesTaken[key])continue;if(!G.items.some(i=>i.k==='hgescape'&&i.x===r.x&&i.y===r.y))G.items.push({k:'hgescape',x:r.x,y:r.y,taken:false,hgdes:key})}}
      for(const i of G.items)if(i.hgdes&&i.taken&&!F.hgdesTaken[i.hgdes])F.hgdesTaken[i.hgdes]=1}}}catch(e){console.error('hgdes upd',e)}
  return _u.apply(this,arguments)}}
// painted icons (assets/icn_<id>.png): the six level 70 fire weapons, the Sunfire Blade and the Potion of Escape
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('hgl70sword','hgl70mace','hgl70axe','hgl70bow','hgl70staff','hgl70dagger','hgsunblade','hgescape');
