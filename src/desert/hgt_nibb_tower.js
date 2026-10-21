/* ==========================================================================
   THE BELL TOWER OF LANTERNS (Nibb, level 484): a treasure chest and a stone at the top of the tower, and a stone at its foot. Stepping on one stone carries the party to the other,
   with the same blue swirl as the teleporters (teleport.js). A stone is entered by stepping on it; the party arrives on the cell beside the other stone, so it does not go straight back.
   Names start with HGTBT.
   ========================================================================== */
const HGTBT={top:{chest:[130,21],stone:[130,19],arrive:[129,19],f:2},base:{stone:[124,29],arrive:[125,29],f:1}};
function hgtbtPlace(){
  if(LEVEL!==484)return;const L=LEVELS[484];if(!L||!L.decor||!L.terrace||L._btDone)return;
  const W=L.rows[0].length,h=L.terrace.h,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!L.decor.some(d=>d.block!==false&&Math.floor(d.x)===x&&Math.floor(d.y)===y);
  const ok=[HGTBT.top.chest,HGTBT.top.stone,HGTBT.top.arrive,HGTBT.base.stone,HGTBT.base.arrive].every(([x,y])=>open(x,y));
  L._btDone=1;if(!ok){console.warn('bell tower cells are not free');return}
  const add=[{k:'hg_chestjelly',x:HGTBT.top.chest[0],y:HGTBT.top.chest[1],block:true,sc:1,gold:1800,contents:[{id:'hgjelly',n:2},{id:'truffle',n:2},{id:'potion',n:4}]},
    {k:'teleporter',x:HGTBT.top.stone[0],y:HGTBT.top.stone[1],block:false,walk:true,loot:false,shop:false,btStone:'top'},
    {k:'teleporter',x:HGTBT.base.stone[0],y:HGTBT.base.stone[1],block:false,walk:true,loot:false,shop:false,btStone:'base'}];
  for(const d of add)L.decor.push(d);if(G.decor&&G.decor!==L.decor)for(const d of add)G.decor.push(d);
  if(typeof buildDecorMap==='function')buildDecorMap();
  if(L.lights)for(const p of [HGTBT.top.stone,HGTBT.base.stone])L.lights.push([p[0],p[1],0])}
function hgtbtGo(from){
  if(typeof TP!=='undefined'&&TP)return;
  const to=from==='base'?HGTBT.top:HGTBT.base,name=from==='base'?'The top of the Bell Tower of Lanterns':'The foot of the Bell Tower of Lanterns';
  TP={ph:'out',t:0,n:484,sp:{x:to.arrive[0],y:to.arrive[1]},f:to.f,name};sfx('level')}
{const _ts=teleStep;teleStep=function(nx,ny){
  if(LEVEL===484){for(const w of ['top','base']){const s=HGTBT[w].stone;if(nx===s[0]&&ny===s[1]){hgtbtGo(w);return}}}
  return _ts.apply(this,arguments)}}
{const _u4=update;update=function(dt){try{if(G.state==='play'&&LEVEL===484)hgtbtPlace()}catch(e){console.error('hgtbt',e)}return _u4.apply(this,arguments)}}
