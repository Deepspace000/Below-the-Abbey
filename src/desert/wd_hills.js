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
  const sp=wdSpot(L,n,seed);if(!sp)return false;const [x,y]=sp,lp=wdIsLP(n),cave=kind==='cave';
  const nt=L.decor.reduce((c,d)=>c+(wdTreeKey(d)&&(d.sc===undefined||d.sc>.01)&&Math.abs(d.x-x)<=14&&Math.abs(d.y-y)<=14?1:0),0);
  const desert=WDH_DESERT.has(n)&&!(n===41&&nt>=12);   // the Sand Road runs from forest into dunes: where it is still forest, a hill among trees
  const pic=desert?'wd_rock'+((hash2(id,3,811)*4)|0):'wd_hill'+(cave?[1,0,1,3][(hash2(id,3,812)*4)|0]:[2,3,0,2][(hash2(id,3,813)*4)|0]);
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
      const used=new Set(L.decor.concat(Q).filter(d=>d.sc===undefined||d.sc>.01||d.block).map(d=>d.x+','+d.y)),cnt=8+((hash2(id,4,814)*6)|0);let made=0;
      for(let t=0;t<90&&made<cnt;t++){
        const dx=((hash2(t,id,815)*13)|0)-6,dy=((hash2(t,id,816)*10)|0)-5,tx=x+dx,ty=y+dy;
        if(Math.abs(dx)<=1&&Math.abs(dy)<=1)continue;                                   // not on the hill
        if(lp?(ty===y&&tx<x&&tx>=x-4):(tx===x&&ty>y&&ty<=y+4))continue;                  // the way to the door stays clear
        if((L.rows[ty]||'')[tx]!=='.'||used.has(tx+','+ty))continue;
        const tp=tpl[(hash2(t,id,817)*tpl.length)|0];used.add(tx+','+ty);made++;
        Q.push({k:tp.k,x:tx,y:ty,block:tp.block,walk:tp.walk,sc:(tp.sc||1)*(.9+hash2(t,id,818)*.25),ox:(hash2(t,id,819)-.5)*.5,oy:(hash2(t,id,820)-.5)*.4,wdh:1})}}}
  {const n0=L.decor.length;wdThicket(L,n,door[0],door[1],id);
   if(desert)for(let i=n0;i<L.decor.length;i++){const d=L.decor[i];d.block=false;d.sc=.0001;d.pfCut=1}}   // no dead trees in the deserts, so the rock pile is walked straight into (the sprites stay in the list, so saved games still line up)
  (L._wd=L._wd||[]).push(lp?{x,y,id,w:1}:{x,y,id});
  WD_ENT[id]={n,x:door[0],y:door[1],f:lp?3:2};
  return true}}
{const _wpr=wdPrep;wdPrep=function(n){const L=LEVELS[n],r=_wpr.apply(this,arguments);
  if(L&&L._wdhQ&&!L._wdhDone){L._wdhDone=1;for(const d of L._wdhQ)L.decor.push(d);L._wdhQ=null}
  return r}}
/* walking into a hill or rock pile goes in (the desert levels do this already, in desertBump; the older outdoor maps need it here) */
{const _dm=doMove;doMove=function(rel){
  try{if(LEVEL<41&&G.state==='play'&&!G.cut&&!G.talk){const dir=DIRS[(G.P.f+rel)%4],nx=G.P.x+dir[0],ny=G.P.y+dir[1],d=G.decor.find(q=>q.enter&&/^wd_(hill|rock)/.test(q.k)&&q.x===nx&&q.y===ny&&!q.found);
    if(d){sfx('door');goToLevel(d.enter.to,{x:d.enter.x,y:d.enter.y,f:d.enter.f});return}}}catch(e){console.error(e)}
  return _dm.apply(this,arguments)}}
