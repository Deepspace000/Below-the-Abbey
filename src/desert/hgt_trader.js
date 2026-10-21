/* ==========================================================================
   THE BUBBLE-SELLER OF EXSCE. Orrim sells Bubble Helms (diving helms made of one great glass bubble; they are what the party needs to go down into the pools of the cities)
   and Swift Shoes (not cheap: while the party is in the Hollow Grasslands or one of its cities, each pair worn adds to the party's walking speed, up to 20 percent when every living hero wears them).
   Names start with hgtt.
   ========================================================================== */
ITEMDEF.bubblehelm={n:'Bubble Helm',k:'head',t:'Helm',ic:'bubblehelm',c:'#c8b8f0',armor:2,price:300,dive:1,sw:.3,d:'One great glass bubble with a brass collar that fits over the head. Worn in the helmet slot it lets a hero breathe underwater for four minutes. Air comes back from bubble vents.'};
ITEMDEF.swiftshoes={n:'Swift Shoes',k:'legs',t:'Legs',ic:'swiftshoes',c:'#e8d0e8',armor:2,price:2600,sw:.3,hgSwift:1,d:'Light shoes of pearl shell and soft leather, with small wings at the heel. In the Hollow Grasslands and its cities the party walks faster, up to 20 percent faster when every hero wears a pair.'};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('bubblehelm','swiftshoes');
/* the speed bonus: the camera glide speed in the walking code is multiplied by this */
function hgttSpeedMul(){
  const n=LEVEL;if(!((n>=470&&n<=474)||hgtAny(n)))return 1;
  const live=G.heroes.filter(h=>h.alive);if(!live.length)return 1;
  let w=0;for(const h of live){const it=h.eq&&h.eq.legs;if(it&&idef(it).hgSwift)w++}
  return 1+.2*w/live.length}
/* Orrim stands near the south gate plaza of Exsce (level 481) */
khNpc('hgt_bubbler','Orrim, the bubble-seller','hg_npc5',d=>hgAskAdd(say('Orrim taps a glass bubble the size of a head with one finger and holds it out. "'+(typeof hgLvl==='function'&&hgLvl()<4?hgGarble('Bubble helms. They go over the head. They let you breathe under water for four minutes. I also have swift shoes.',hgLvl()):'Bubble helms. They go over the head. They let you breathe under water for four minutes. I also have swift shoes.')+'"',[['Trade.',()=>{openShop(G.talk.d,[['bubblehelm',8],['swiftshoes',6]],'Orrim, the bubble-seller');return null}],['Leave.',()=>null]])));
function hgttPlace(){
  const L=LEVELS[481];if(!L||L._hgttDone||!L.terrace)return;L._hgttDone=1;
  const W=L.rows[0].length,h=L.terrace.h,occ=new Set((L.decor||[]).map(d=>Math.floor(d.x)+','+Math.floor(d.y)));
  let best=null;const sx=75,sy=140;
  for(let r=0;r<14&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r&&!best;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=sx+dx,y=sy+dy;if(x<2||y<2||x>=W-2||y>=L.rows.length-2||L.rows[y][x]!=='.'||occ.has(x+','+y))continue;
    if(typeof hgtnBlocked==='function'&&hgtnBlocked(L,x,y))continue;
    let flat=true;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ax,ny=y+ay;if(L.rows[ny][nx]!=='.'||Math.abs(h[ny*W+nx]-h[y*W+x])>.01){flat=false;break}}
    if(flat)best=[x,y]}
  if(!best)return;const d={k:'hg_npc5',x:best[0],y:best[1],block:false,walk:true,npc:'hgt_bubbler',sc:1};
  L.decor.push(d);if(typeof G!=='undefined'&&G.decor&&G.decor!==L.decor&&LEVEL===481){G.decor.push(d);if(typeof buildDecorMap==='function')buildDecorMap()}}
{const _u=update;update=function(dt){try{if(LEVEL===481&&G.state==='play')hgttPlace()}catch(e){console.error('hgtt',e)}return _u.apply(this,arguments)}}

/* ---------- the market stalls of the four cities sell fruit and vegetables: tap a stall (or walk into it) to buy. Each stall has one of six ranges, so the markets together sell a spread ---------- */
const HGT_PRODUCE=[
  ['Orchard stall',[['apple',9],['figs',7],['blackberries',8],['rosehips',6],['dates',7]]],
  ['Berry and nut stall',[['blackberries',9],['rosehips',7],['nuts',8],['chestnuts',6],['figs',5],['dates',6]]],
  ['Root stall',[['potato',10],['wildgarlic',8],['hgroot',6],['watercress',7],['edmoss',6]]],
  ['Mushroom stall',[['cavemushroom',9],['chanterelle',7],['puffball',8],['wildgarlic',6],['truffle',1]]],
  ['Pond greens stall',[['watercress',9],['hgkelp',7],['hgroot',6],['edmoss',7],['lychee',5]]],
  ['Fruit and vegetable stall',[['apple',7],['potato',8],['figs',5],['wildgarlic',6],['cavemushroom',6],['blackberries',6]]]];
HGT_PRODUCE.forEach(([name,stock],i)=>{
  khNpc('hgt_stall'+i,name,'hg_npc5',d=>{const l=typeof hgLvl==='function'?hgLvl():4,hello='Fresh from the terraces today. Take what you like.';
    return say('The stallholder nods at the baskets. "'+(l<4?hgGarble(hello,l):hello)+'"'+(l<4?hgFoot(l):''),[['Buy.',()=>{openShop(G.talk.d,stock,name);return null}],['Leave.',()=>null]])})});
function hgttStalls(){
  const L=LEVELS[LEVEL];if(!L||!L.decor||L._hgttStalls||!(LEVEL>=481&&LEVEL<=484))return;L._hgttStalls=1;let i=0,fr=0;
  for(const d of L.decor){if(!/^hgtb_stall_/.test(d.k)||d.npc)continue;
    const v=/coral_fruit/.test(d.k)?(fr++%2):/sage_herbs/.test(d.k)?2:/yellow_bread/.test(d.k)?5:(i++%6);d.npc='hgt_stall'+v;d.block=true}
  if(typeof buildDecorMap==='function')buildDecorMap()}
{const _u2=update;update=function(dt){try{if(G.state==='play')hgttStalls()}catch(e){console.error('hgtt stalls',e)}return _u2.apply(this,arguments)}}
