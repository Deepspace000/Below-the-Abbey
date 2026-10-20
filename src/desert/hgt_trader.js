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
  const n=LEVEL;if(!((n>=470&&n<=474)||(n>=480&&n<=489)||(n>=4850&&n<=4949)))return 1;
  const live=G.heroes.filter(h=>h.alive);if(!live.length)return 1;
  let w=0;for(const h of live){const it=h.eq&&h.eq.legs;if(it&&idef(it).hgSwift)w++}
  return 1+.2*w/live.length}
/* Orrim stands near the south gate plaza of Exsce (level 481) */
khNpc('hgt_bubbler','Orrim, the bubble-seller','hg_npc5',d=>say('Orrim taps a glass bubble the size of a head with one finger and holds it out. "Bubble helms. They go over the head. They let you breathe under water for four minutes. I also have swift shoes."',[['Trade.',()=>{openShop(G.talk.d,[['bubblehelm',8],['swiftshoes',6]],'Orrim, the bubble-seller');return null}],['Leave.',()=>null]]));
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
