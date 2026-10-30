/* ==========================================================================
   WILD PLACES, REBUILT AS HILLS AND ROCK PILES (prefix wdh / WDH). The caves and old ruins of wilds.js used to stand as a big box of wall, five squares wide and
   three and a half high, that looked like a bunker. Now each entrance is a small painted hill with a door set into it (assets/wd_hill0-3.png), with trees growing
   all round it, and the dead trees (the thicket that has to be burned) across the way in. In the deserts it is a pile of rocks with a door in it (assets/wd_rock0-3.png)
   and no trees. The hill is one blocking sprite with an enter link (like the desert burrows), two invisible blockers keep the party from walking through its sides.
   The way out of the place, the thicket, the ? marks and the interiors are the ones in wilds.js, which this file only re-places.
   ========================================================================== */
for(const n of ['wd_hill0','wd_hill1','wd_hill2','wd_hill3','wd_rock0','wd_rock1','wd_rock2','wd_rock3'])loadImg(n,'assets/'+n+'.png');
for(let i=0;i<4;i++){NPC_H['wd_hill'+i]=1.9;NPC_H['wd_rock'+i]=1.5}   // the hill is about a person and a half high, two and a half squares wide; the rock pile a little lower and wider
const WDH_DESERT=new Set([41,60,61,62,63,64]); // the outdoor maps that are desert
{const _wp=wdPlace;wdPlace=function(L,n,id,kind,tint,seed){
  const sp=wdSpot(L,n,seed);if(!sp)return false;const [x,y]=sp,lp=wdIsLP(n),cave=kind==='cave',sid=wdSeedId(id);
  const nt=L.decor.reduce((c,d)=>c+(wdTreeKey(d)&&(d.sc===undefined||d.sc>.01)&&Math.abs(d.x-x)<=14&&Math.abs(d.y-y)<=14?1:0),0);
  const desert=WDH_DESERT.has(n)&&!(n===41&&nt>=12);   // the Sand Road runs from forest into dunes: where it is still forest, a hill among trees
  const pic=desert?'wd_rock'+((hash2(sid,3,811)*4)|0):'wd_hill'+(cave?[1,0,1,3][(hash2(sid,3,812)*4)|0]:[2,3,0,2][(hash2(sid,3,813)*4)|0]);
  const at=cave?{x:8,y:16,f:0}:{x:16,y:22,f:0};
  L.decor=L.decor||[];const Q=L._wdhQ||(L._wdhQ=[]);   // the new sprites are added after everything else in wdPrep, so the saved states of the burned thickets (kept by position in the list) still line up
  // where the party stands to knock (the thicket is on this square), the squares the hill covers, and the sides that are closed off
  const door=lp?[x-1,y]:[x,y+1],side=lp?[[x,y-1],[x,y+1]]:[[x-1,y],[x+1,y]];
  const free=(d)=>!d.npc&&!d.loot&&!d.shop&&!d.enter&&d.k!=='lever';
  const covered=(d)=>(d.x===x&&d.y===y)||side.some(q=>q[0]===d.x&&q[1]===d.y)||(lp?(d.x===x-1&&d.y===y)||(d.x===x-2&&d.y===y):(d.x===x&&d.y>=y+1&&d.y<=y+3));
  for(const d of L.decor)if(free(d)&&covered(d)&&!(d.x===door[0]&&d.y===door[1])){d.block=false;d.sc=.0001;d.pfCut=1}   // nothing grows where the hill stands or on the way up to it
  for(const d of L.decor)if(free(d)&&d.x===door[0]&&d.y===door[1]&&!wdTreeKey(d)){d.block=false;d.sc=.0001;d.pfCut=1}   // a pillar, rock or bush on the door square would still shut the way after the thicket is burned
  Q.push({k:pic,x,y,block:true,enter:{to:id,x:at.x,y:at.y,f:at.f},wdh:1});
  for(const q of side)Q.push({k:'pstump',x:q[0],y:q[1],block:true,sc:.0001,wdh:1}); // invisible: the hill is wider than its own square
  // more trees round it: copies of the trees that grow nearby, in the clear squares beside, behind and in front of the hill (never on the way to the door)
  if(!desert){
    const tpl=L.decor.filter(d=>wdTreeKey(d)&&(d.sc===undefined||d.sc>.01)&&Math.abs(d.x-x)<=14&&Math.abs(d.y-y)<=14);
    if(tpl.length){
      const used=new Set(L.decor.concat(Q).filter(d=>d.sc===undefined||d.sc>.01||d.block).map(d=>d.x+','+d.y).concat((L.enemies||[]).map(e=>e.x+','+e.y),(L.items||[]).map(i=>i.x+','+i.y))),cnt=8+((hash2(sid,4,814)*6)|0);let made=0; // never on a creature or an item lying on the ground
      for(let t=0;t<90&&made<cnt;t++){
        const dx=((hash2(t,sid,815)*13)|0)-6,dy=((hash2(t,sid,816)*10)|0)-5,tx=x+dx,ty=y+dy;
        if(Math.abs(dx)<=1&&Math.abs(dy)<=1)continue;                                   // not on the hill
        if(lp?(ty===y&&tx<x&&tx>=x-4):(tx===x&&ty>y&&ty<=y+4))continue;                  // the way to the door stays clear
        if((L.rows[ty]||'')[tx]!=='.'||used.has(tx+','+ty))continue;
        const tp=tpl[(hash2(t,sid,817)*tpl.length)|0];if(L.decor.some(d=>d.x===tx&&d.y===ty&&d.k===tp.k))continue;used.add(tx+','+ty);made++; // not the same tree twice on one square (a hidden one may still lie there)
        Q.push({k:tp.k,x:tx,y:ty,block:tp.block,walk:tp.walk,sc:(tp.sc||1)*(.9+hash2(t,sid,818)*.25),ox:(hash2(t,sid,819)-.5)*.5,oy:(hash2(t,sid,820)-.5)*.4,wdh:1})}}}
  {const n0=L.decor.length;wdThicket(L,n,door[0],door[1],id);
   if(desert)for(let i=n0;i<L.decor.length;i++){const d=L.decor[i];d.block=false;d.sc=.0001;d.pfCut=1}}   // no dead trees in the deserts, so the rock pile is walked straight into (the sprites stay in the list, so saved games still line up)
  (L._wd=L._wd||[]).push(lp?{x,y,id,w:1}:{x,y,id});
  WD_ENT[id]={n,x:door[0],y:door[1],f:lp?3:2};
  return true}}
{const _wpr=wdPrep;wdPrep=function(n){const L=LEVELS[n],r=_wpr.apply(this,arguments);
  if(L&&L._wdhQ&&!L._wdhDone){L._wdhDone=1;for(const d of L._wdhQ)L.decor.push(d);L._wdhQ=null}
  if(L&&!L._wdhTidy&&L.rows&&L.decor){L._wdhTidy=1;try{wdhTidy(L,n)}catch(e){console.error(e)}}
  return r}}
/* ---------- the tidy pass (the castle standard) for the Pilgrim's Path and the Oakwood: nothing stands where it cannot be reached ---------- */
const wdhMine=n=>wdIsLP(n)||n===311||n===304||n===305||(n>=6800&&n<6813)||(n>=7100&&n<7129)||(n>=wdRuinId(311,0)&&n<wdRuinId(311,4))||(n>=wdRuinId(LP.BASE,0)&&n<wdRuinId(LP.BASE+LP.N,0));
function wdhGrid(L,n){ // the squares the party can stand on: open floor, not too steep or wet, with nothing solid on it (the dead trees of a thicket count as solid until they are burned)
  const W=L.rows[0].length,H=L.rows.length,tb=TERRS[n]&&TERRS[n].block,solid=new Uint8Array(W*H);
  for(const d of L.decor)if(d.block&&!d.found&&Number.isInteger(d.x)&&Number.isInteger(d.y)&&d.x>=0&&d.y>=0&&d.x<W&&d.y<H)solid[d.y*W+d.x]=1;
  const ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!(tb&&tb[y*W+x])&&!solid[y*W+x];
  const seen=new Uint8Array(W*H),q=[];const st=L.start||{x:1,y:1};
  const push=(x,y)=>{if(ok(x,y)&&!seen[y*W+x]){seen[y*W+x]=1;q.push(y*W+x)}};push(st.x,st.y);
  for(let i=0;i<q.length;i++){const x=q[i]%W,y=(q[i]/W)|0;push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1)}
  return {W,H,ok,seen,solid}}
function wdhTidy(L,n){
  if(!wdhMine(n)&&!WD_OUT.includes(n))return;
  const W=L.rows[0].length,H=L.rows.length,R=wdhGrid(L,n);
  // a creature never stands in a tree, on a rock or in a wall: it steps to the nearest open square
  const taken=new Set((L.enemies||[]).map(e=>e.x+','+e.y));
  for(const e of L.enemies||[]){if(R.ok(e.x,e.y))continue;let best=null;
    for(let r=1;r<=4&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=e.x+dx,y=e.y+dy;if(R.ok(x,y)&&!taken.has(x+','+y)){best=[x,y];break}}
    if(best){taken.delete(e.x+','+e.y);e.x=best[0];e.y=best[1];taken.add(best[0]+','+best[1])}}
  // the Oakwood and the older outdoor maps: a hidden cave or ruin whose door stands in a pocket walled in by living oaks gets a narrow way cut to it through the trees (the dead trees across the door stay, to be burned)
  if(WD_OUT.includes(n)){const tree=d=>!d.npc&&!d.enter&&wdTreeKey(d)&&!/^gtree/.test(d.k)&&d.block;
    for(const q of L._wd||[]){const e=WD_ENT[q.id];if(!e||e.n!==n)continue;const S=wdhGrid(L,n);if(S.seen[e.y*W+e.x]||[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>S.seen[(e.y+b)*W+e.x+a]&&S.ok(e.x+a,e.y+b)))continue;
      const at=new Map();for(const d of L.decor)if(d.block&&!d.found){const k=d.y*W+d.x;if(!at.has(k))at.set(k,[]);at.get(k).push(d)}
      const cost=i=>{const x=i%W,y=(i/W)|0;if(L.rows[y][x]!=='.')return -1;const l=at.get(i);if(!l)return 1;return l.every(tree)?8:-1};
      const dist=new Float64Array(W*H).fill(1e9),prev=new Int32Array(W*H).fill(-1),hp=[]; // Dijkstra with a little binary heap of [cost, square]
      const hpush=(c,i)=>{hp.push([c,i]);let a=hp.length-1;while(a>0){const p=(a-1)>>1;if(hp[p][0]<=hp[a][0])break;[hp[p],hp[a]]=[hp[a],hp[p]];a=p}};
      const hpop=()=>{const t=hp[0],l=hp.pop();if(hp.length){hp[0]=l;let a=0;for(;;){let b=a*2+1;if(b>=hp.length)break;if(b+1<hp.length&&hp[b+1][0]<hp[b][0])b++;if(hp[a][0]<=hp[b][0])break;[hp[a],hp[b]]=[hp[b],hp[a]];a=b}}return t};
      for(let i=0;i<W*H;i++)if(S.seen[i]){dist[i]=0;hpush(0,i)}
      const goal=e.y*W+e.x;
      while(hp.length){const [dc,i]=hpop();if(dc>dist[i])continue;if(i===goal)break;
        const x=i%W,y=(i/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<1||ny<1||nx>=W-1||ny>=H-1)continue;const j=ny*W+nx,c=j===goal?1:cost(j);if(c<0)continue;if(dist[i]+c<dist[j]){dist[j]=dist[i]+c;prev[j]=i;hpush(dist[j],j)}}}
      for(let i=prev[goal];i>=0&&!S.seen[i];i=prev[i]){for(const d of at.get(i)||[])if(tree(d)){d.block=false;d.sc=.0001;d.pfCut=1}}}}
}
/* items lying on the ground that the herbs and the mana potions of other parts of the game put in a walled-in pocket of the woods move to the nearest square the party can reach.
   This runs after every other part of the game has placed its items (it wraps loadLevel last), and only moves them, so saved games still line up. */
setTimeout(()=>{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);try{const L=LEVELS[n];if(L&&wdhMine(n)&&L.items&&L.items.length&&L._wdhItems!==L.items.length){L._wdhItems=L.items.length;wdhReachItems(L,n)}}catch(e){console.error(e)}return r}},0);
function wdhReachItems(L,n){
  const R=wdhGrid(L,n),W=R.W,H=R.H,busy=new Set(L.items.map(i=>i.x+','+i.y));for(let i=0;i<W*H;i++)if(R.solid[i])busy.add((i%W)+','+((i/W)|0));
  for(const d of L.decor)if(d.npc||d.enter)busy.add(d.x+','+d.y);
  for(const it of L.items){if(R.seen[it.y*W+it.x])continue;
    const vis=new Uint8Array(W*H),q=[it.y*W+it.x];vis[q[0]]=1;let got=-1;
    for(let i=0;i<q.length&&got<0;i++){const x=q[i]%W,y=(q[i]/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(vis[j])continue;vis[j]=1;if(R.seen[j]&&!busy.has(nx+','+ny)){got=j;break}q.push(j)}}
    if(got>=0){busy.delete(it.x+','+it.y);it.x=got%W;it.y=(got/W)|0;busy.add(it.x+','+it.y)}}
}
/* walking into a hill or rock pile goes in (the desert levels do this already, in desertBump; the older outdoor maps need it here) */
{const _dm=doMove;doMove=function(rel){
  try{if(LEVEL<41&&G.state==='play'&&!G.cut&&!G.talk){const dir=DIRS[(G.P.f+rel)%4],nx=G.P.x+dir[0],ny=G.P.y+dir[1],d=G.decor.find(q=>q.enter&&/^wd_(hill|rock)/.test(q.k)&&q.x===nx&&q.y===ny&&!q.found);
    if(d){sfx('door');goToLevel(d.enter.to,{x:d.enter.x,y:d.enter.y,f:d.enter.f});return}}}catch(e){console.error(e)}
  return _dm.apply(this,arguments)}}
