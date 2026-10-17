/* ==========================================================================
   THE OLD SHRINES. Sixteen beautiful old shrines stand in quiet corners of the land, from the first woods to the far deserts. Visiting one logs it in the Shrine
   Logbook (Menu, More, Collection). Abbot Anselm at Saint Elen's Monastery gives the quest to find them all. The last one brings an achievement,
   and every hero's intelligence rises.
   ========================================================================== */
for(let i=0;i<8;i++){loadImg('shr_'+i,'assets/shr_'+i+'.png');NPC_H['shr_'+i]=[1.25,1.2,1.5,1.25,1.2,1.5,1.4,1.25][i]}
const SHRINES=[ // [id, name, level, picture, what is written there]
 ['thorn','The Shrine of the First Light',2,0,'Candles burn here that nobody lights. The saint in the niche holds her hands out, palm up, as if waiting for rain.'],
 ['gandrick','The Woodcutters’ Shrine',7,3,'A bell on a post, and ribbons from a hundred woodcutters. Ring it once before you fell a tree, the ribbons say.'],
 ['road','The Wayfarers’ Stone',10,2,'A pillar carved with spirals, and an iron lantern. Travellers have left their names scratched low on the stone.'],
 ['moor','The Moor Saint',19,5,'A pilgrim with a staff stands in a little spired chapel. Heather has grown over the steps, and the lamp has been lit lately.'],
 ['grave','The Gravekeeper’s Niche',20,0,'A shrine for those with no grave. A hundred small stones lie in the alcove, one for each name nobody remembers.'],
 ['pass','The Pass Shrine',22,6,'A standing stone arch with a blue rune that glows when the wind turns. The mountain folk say it keeps the snow off the road.'],
 ['green','The Green Sun',32,1,'A golden sun in a round niche, and the flowers are always fresh. Greendale children leave a bun here on feast days.'],
 ['sand','The Sandwalkers’ Shrine',41,4,'A moon canopy over a mossy altar, far from any water. Somebody has dug a channel to bring it a little spring.'],
 ['sut','The Shrine of the Red Road',43,7,'Gold roof and red pillars, and a bowl of clean water in the dust. Nobody knows who fills it.'],
 ['blue','The Blue Dune Shrine',60,2,'A pillar carved with spirals, half buried in blue sand. The lantern on it has never gone out.'],
 ['white','The White Shrine',63,1,'A sun disc worn smooth by wind. In the evening the whole niche glows pale gold.'],
 ['golden','The Shrine in the Erg',61,5,'A spired shrine in a sea of dunes, and a statue with a staff that points north. Pilgrims have always followed it.'],
 ['violet','The Violet Shrine',62,6,'A rune arch ringed with ferns, in the middle of a purple desert. The ferns should not grow here.'],
 ['flat','The Shrine on the Flats',64,3,'A bell and a thatched roof, the only roof for a day’s walk. The bell has a small crack, and still sounds sweet.'],
 ['oak','The Oakwood Altar',311,4,'A mossy altar under a moon canopy among the oaks. The woodwardens leave acorns here in autumn.'],
 ['path','The Pilgrim’s Rest',410,0,'A small shrine with a saint and candles, half way up the mountain on the pilgrim’s road. A good place to sit.']];
const SHR_BY_LEVEL={};for(const s of SHRINES)SHR_BY_LEVEL[s[2]]=s;
const shrineData=()=>{const F=G.flags;return F.shrines||(F.shrines={})};
const shrineCount=()=>SHRINES.filter(s=>shrineData()[s[0]]).length;
QUESTS.shrines={title:'The Old Shrines',who:'Abbot Anselm',desc:'Abbot Anselm says there are sixteen old shrines in the land, kept by nobody and visited by few, from the first woods to the far deserts. Find them and stand before each one. They are logged in the Shrine Logbook (Menu, More, Collection). Come back to the Abbot when you have seen them all.',need:16,goal:shrineCount,reward:{gold:1500,xp:8000}};
QAREA.shrines='Saint Elen’s Monastery';
for(const [id,name,lv,pic,text] of SHRINES){
  khNpc('shr_'+id,name,'gate',()=>{
    const first=!shrineData()[id];shrineData()[id]=1;if(first){try{collFound('shrine_'+id)}catch(e){};sfx('level');msg(`Shrine logged: ${name} (${shrineCount()} of 16).`,'#ffe9a0')}
    shrineCheck();
    return say(`${text}${first?'':' (You have visited this shrine before.)'}`,[BYE])});
}
function shrineCheck(){const F=G.flags;if(F.shrinesDone||shrineCount()<SHRINES.length)return;
  if(qSt('shrines')!=='active'&&qSt('shrines')!=='done'){return}
  F.shrinesDone=1;if(qSt('shrines')==='active')G.quests.shrines.ready=1;
  G.heroes.forEach(h=>{h.int=(h.int||0)+3});
  msg('ACHIEVEMENT: Keeper of the Old Shrines. Every hero grows wiser: intelligence +3.','#ffe36a');sfx('win')}
repWrap('mon_abbot',()=>qSt('shrines')===null,'About the old shrines',()=>say('There are sixteen old shrines in the land. Nobody keeps them and nobody forgets them. Visit them all, and the land will teach you something. Will you go and look?',[['We will find them all.',()=>{qAccept('shrines');shrineCheck();return say('Go well. They are in quiet places, on the roads and in the wilds, as far as the deserts. Your Shrine Logbook, in the Collection menu, will show which you have found.',[BYE])}],BYE]));
repWrap('mon_abbot',()=>qSt('shrines')==='active'&&qReady('shrines'),'I have seen every shrine',()=>{const rw=rewardText('shrines');qTurnIn('shrines');shrineCheck();return say(`Sixteen shrines. Then you have walked further than I have. Reward: ${rw}. And the achievement is yours: you carry something of every one of them.`,[BYE])});
/* ---------- placing them: a quiet corner of each level ---------- */
function shrinePlace(n){
  const s=SHR_BY_LEVEL[n],L=LEVELS[n];if(!s||!L||L._shr||!L.rows||L.khRoom)return;L._shr=1;
  const H=L.rows.length,W=L.rows[0].length,tb=typeof terrFor==='function'?terrFor(n):null,blocked=new Uint8Array(W*H);
  if(tb)for(let i=0;i<W*H;i++)blocked[i]=tb.block[i]?1:0;
  const hz=[];for(const d of (L.decor||[])){if(d.x<0||d.y<0||d.x>=W||d.y>=H)continue;if(d.block)blocked[d.y*W+d.x]=1;if(d.npc||d.enter||d.k==='chest')hz.push([d.x,d.y])}
  for(const e of (L.enemies||[]))hz.push([e.x,e.y]);for(const it of (L.items||[]))hz.push([it.x,it.y]);
  try{const t=teleSpot(n);if(t)hz.push([t.x,t.y])}catch(e){}
  for(let y=0;y<H;y++){const r=L.rows[y]||'';for(let x=0;x<W;x++){const c=r[x];if(c&&c!=='.'&&/[0-9]/.test(c))hz.push([x,y])}}
  const st=L.start||{x:1,y:1},dist=new Int32Array(W*H).fill(-1),q=[st.y*W+st.x];dist[q[0]]=0;
  for(let h=0;h<q.length;h++){const i=q[h],x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<1||ny<1||nx>=W-1||ny>=H-1)continue;const j=ny*W+nx;if(dist[j]>=0||blocked[j]||(L.rows[ny][nx]!=='.'))continue;dist[j]=dist[i]+1;q.push(j)}}
  const small=W*H<6000;let best=null,bs=-1;
  const M=small?3:14;
  for(let y=M;y<H-M;y++)for(let x=M;x<W-M;x++){const i=y*W+x;if(dist[i]<(small?12:30)||blocked[i]||L.rows[y][x]!=='.')continue;
    let mh=99;for(const [hx,hy] of hz){const d=Math.max(Math.abs(hx-x),Math.abs(hy-y));if(d<mh){mh=d;if(mh<(small?4:9))break}}if(mh<(small?4:9))continue;
    let near=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(blocked[(y+dy)*W+x+dx])near++;
    if(tb&&typeof terrH==='function'){const h0=terrH(x+.5,y+.5);let fl=true;for(const [dx,dy] of [[3,0],[-3,0],[0,3],[0,-3],[2,2],[-2,-2],[2,-2],[-2,2]])if(Math.abs(terrH(x+dx+.5,y+dy+.5)-h0)>.3){fl=false;break}if(!fl)continue} // flat ground only, or the shrine sinks into a slope
    const sc=Math.min(mh,20)+near*.2+hash2(x,y,n+77)*5;if(sc>bs){bs=sc;best=[x,y]}}
  if(!best)return;
  L.decor.push({k:'shr_'+s[3],x:best[0],y:best[1],block:true,npc:'shr_'+s[0],sc:1});
  L._shrXY=best;
}
const SHR_IDS=SHRINES.map(s=>s[0]);
COLL.shrines={title:'SHRINE LOGBOOK',noun:'shrine',items:()=>SHRINES.map(s=>({id:'shrine_'+s[0],name:s[1].replace(/^The /,''),value:0,glyph:'memorial'})),blurb:'Sixteen old shrines stand in quiet places. Stand before one to log it. Abbot Anselm at Saint Elen’s has the quest.'};
COLL_KIND.shrine_='shrines';
{const _g=goToLevel;goToLevel=function(n,e){try{if(SHR_BY_LEVEL[n]){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();shrinePlace(n)}for(const s of SHRINES){const im=IMG['shr_'+s[3]];if(im&&!IMG['icn_shrine_'+s[0]])IMG['icn_shrine_'+s[0]]=im}}catch(x){console.error(x)}return _g.apply(this,arguments)}}
