/* ==========================================================================
   GAP DUNGEONS: eight small optional side dungeons that fill the ratings which had no creatures (22, 52, 54, 92, 94, 96, 98).
   Each has its own entrance on an existing outdoor map (a painted hill or rock pile with a door, the same art as the wild places), three to five rooms,
   8 to 14 ordinary creatures of the neighbouring areas, one named boss (the object of a side quest, see gapquests.js) and a chest or two.
   They are for grinding: every ordinary creature comes back each time the party goes in again (see gapRespawn below). The boss comes back too until its quest is
   handed in. The chests are opened once.
   Ids 7310 to 7317. Nothing here is a main quest, and nothing in the story waits on these places.
     7310 The Old Quarry (22)         Ironhill Road        quest gap1, Mason Hale in Ironhill
     7311 The Weeping Well (22)       Ironhill Moor        quest gap2, Brother Tarn in Ironhill
     7312 The Smugglers' Hold (52)     Saltbarrow           quest gap3, Tilda Reef in Saltbarrow
     7313 The Bellfounders' Cellar (54) The Isle of Bells   quest gap4, Brother Corwen on the Isle of Bells
     7314 The Sexton's Burrow (92)      The Barrow Hill      quest gap5, Ivo Dray at Lanternrest
     7315 The Ringers' Undercroft (94)  Hollowbell Abbey     quest gap6, Sister Agnes at Hollowbell
     7316 The Mill Race (96)           The Rookery Mill     quest gap7, Reeve Orla Pike at the Pale Bridge
     7317 The Toll Vaults (98)         The Pale Bridge      quest gap8, Gatewarden Fenn in Sale
   ========================================================================== */
const GAPD={};            // level id -> spec
const GAP_HOSTS={};       // host level id -> [specs]
const gapRng=(seed)=>{let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=(t+Math.imul(t^t>>>7,61|t))^t;return((t^t>>>14)>>>0)/4294967296}};

/* the boss of each dungeon is a named copy of an ordinary creature, stronger and carrying a set purse */
function gapBossDef(spec){
  const b=spec.boss,base=ENEMY_DEF[b.base];
  ENEMY_DEF[b.t]=Object.assign({},base,{name:b.name,hp:Math.round(base.hp*(b.hpx||3)),dmg:[Math.round(base.dmg[0]*1.25),Math.round(base.dmg[1]*1.3)],xp:Math.round(base.xp*(b.xpx||5)),
    gold:b.gold||[150,300],boss:true,aboveParty:0,named:1,w:(base.w||.5)*1.12,gap:1});
  delete ENEMY_DEF[b.t].humanoid;
}

/* the map of one dungeon: rooms joined by passages, the way out in the bottom wall of the first room, the boss in the farthest room */
function gapBuild(spec){
  const R=gapRng(spec.id*31+7),W=spec.W||35,H=spec.H||25,g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rooms=[],cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'};
  const ew=5+((R()*3)|0),sx=2+((R()*(W-ew-4))|0);rooms.push({x0:sx,y0:H-5,x1:sx+ew-1,y1:H-2});
  for(let t=0;t<800&&rooms.length<spec.rooms;t++){
    const w=4+((R()*4)|0),h=4+((R()*3)|0),x0=1+((R()*(W-w-2))|0),y0=1+((R()*(H-h-9))|0);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;
    rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1});
  }
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  rooms.forEach(cut);
  for(let i=1;i<rooms.length;i++){
    let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);
    for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+R()*5;if(d<bd){bd=d;bj=j}}
    const [bx,by]=mid(rooms[bj]),hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)g[y][x]='.'},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)g[y][x]='.'};
    if(R()<.5){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}
  }
  const e0=rooms[0],start={x:mid(e0)[0],y:H-2};
  const bfs=(blocked)=>{const d=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0||blocked.has(nx+','+ny))continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}return d};
  const d0=bfs(new Set());
  // the boss room is the room whose middle is the farthest walk from the start; the chest room is the next farthest
  const order=rooms.map((r,i)=>({i,d:d0[mid(r)[1]*W+mid(r)[0]]})).sort((a,b)=>b.d-a.d);
  const bossRoom=rooms[order[0].i],chestRoom=rooms[(order[1]||order[0]).i];
  // the wall: a plain run of the dungeon's wall glyph, with a few of the odd glyph where the style asks for it
  const rows=g.map((r,y)=>r.map((c,x)=>c==='#'?((spec.alt&&R()<.04)?spec.alt:spec.wall):c).join(''));
  rows[H-1]=rows[H-1].slice(0,start.x)+'0'+rows[H-1].slice(start.x+1);
  const blocked=new Set(),used=new Set([start.x+','+start.y]),decor=[],enemies=[],lights=[];
  const okBlock=(x,y)=>{const k=x+','+y;if(g[y][x]!=='.'||used.has(k)||blocked.has(k))return false;blocked.add(k);const d=bfs(blocked);for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++)if(g[yy][xx]==='.'&&!blocked.has(xx+','+yy)&&d[yy*W+xx]<0){blocked.delete(k);return false}return true};
  const put=(k,x,y,o)=>{if(!okBlock(x,y))return false;used.add(x+','+y);decor.push(Object.assign({k,x,y,block:true},o||{}));return true};
  const corner=(r,which)=>{const xs=[r.x0,r.x1,r.x0,r.x1][which],ys=[r.y0,r.y0,r.y1,r.y1][which];return [xs,ys]};
  // the boss
  const [bx,by]=mid(bossRoom);used.add(bx+','+by);enemies.push({t:spec.boss.t,x:bx,y:by});
  // the chests: one in the boss room (the better one), one in the next room
  const chests=[];
  for(let w=0;w<4&&!chests.some(c=>c.boss);w++){const [cx,cy]=corner(bossRoom,w);if(put('chest',cx,cy)){chests.push({x:cx,y:cy,boss:1})}}
  if(chestRoom!==bossRoom)for(let w=0;w<4&&chests.length<2;w++){const [cx,cy]=corner(chestRoom,w);if(put('chest',cx,cy)){chests.push({x:cx,y:cy,boss:0})}}
  // a little furniture in the corners of the other rooms, never in the way
  rooms.forEach((r,i)=>{if(i===0||r===bossRoom||r===chestRoom)return;const w=(R()*4)|0,[cx,cy]=corner(r,w);put(spec.junk[(i+w)%spec.junk.length],cx,cy)});
  // the creatures: spread over every room but the first, and the passages
  const cells=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'&&!used.has(x+','+y)&&d0[y*W+x]>=8&&Math.abs(x-bx)+Math.abs(y-by)>=4)cells.push([x,y]);
  const pool=[];for(const [t,w] of spec.pool)for(let i=0;i<w;i++)pool.push(t);
  let n=0;
  for(let t=0;t<4000&&n<spec.n&&cells.length;t++){
    const c=cells[(R()*cells.length)|0];
    if(enemies.some(e=>Math.abs(e.x-c[0])+Math.abs(e.y-c[1])<3))continue;
    enemies.push({t:pool[(R()*pool.length)|0],x:c[0],y:c[1]});n++;
  }
  for(const r of rooms){const [mx,my]=mid(r);lights.push([mx,my])}
  for(let y=2;y<H-1;y+=6)for(let x=2;x<W-1;x+=6)if(g[y][x]==='.')lights.push([x,y]);
  return {rows,decor,enemies,lights,start:{x:start.x,y:start.y,f:0},chests,bossAt:[bx,by]};
}

/* find a clear, reachable square near a hint on an outdoor map for an entrance (needs room to stand in front of it) or for a person */
function gapSpot(L,n,hint,opt){
  opt=opt||{};
  const W=L.rows[0].length,H=L.rows.length;let R=null;
  try{if(typeof wdhGrid==='function')R=wdhGrid(L,n)}catch(e){}
  const dec=(x,y,r)=>(L.decor||[]).some(d=>Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r&&(d.block||d.npc||d.enter)&&(d.sc===undefined||d.sc>.05));
  const foe=(x,y,r)=>(L.enemies||[]).some(e=>Math.abs(e.x-x)<=r&&Math.abs(e.y-y)<=r)||(L.items||[]).some(i=>Math.abs(i.x-x)<=r&&Math.abs(i.y-y)<=r);
  const open=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&L.rows[y][x]==='.'&&(!R||R.ok(x,y));
  const rr=opt.clear===undefined?1:opt.clear;
  for(let r=0;r<=40;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
    const x=hint[0]+dx,y=hint[1]+dy;if(!open(x,y)||dec(x,y,rr)||foe(x,y,rr))continue;
    if(R&&!R.seen[y*W+x])continue;
    if(opt.entrance){ // a square to stand on in front of it, itself reachable and free; and the squares beside the door itself free of blockers
      let out=null;for(const [ox,oy,f] of [[0,1,2],[1,0,1],[-1,0,3],[0,-1,0]]){const px=x+ox,py=y+oy;if(open(px,py)&&!dec(px,py,0)&&!(R&&!R.seen[py*W+px])){out={x:px,y:py,f};break}}
      if(!out)continue;
      let clearAll=true;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(!open(x+a,y+b))clearAll=false;
      if(!clearAll&&r<30)continue;
      return {x,y,out};
    }
    return {x,y};
  }
  return null;
}

const GAP_SPECS=[
 {id:7310,host:10,hint:[30,6],name:'The Old Quarry',r:22,wall:'#',alt:'%',floor:null,ceil:null,amb:null,tex:'cave',torchGap:4.2,entry:'wd_hill1',rooms:4,n:10,
  pool:[['skel',4],['bat',3],['rat',2],['wolf',1]],junk:['barrel','crate'],
  boss:{t:'gapquarry',base:'guard',name:'Garrick Slate, the Quarry Captain',hpx:4,xpx:5,gold:[120,200]},q:'gap1',
  gear:['ar_iron_c','potion3'],gold:260,gear2:['ar_iron_h','potion3'],gold2:140},
 {id:7311,host:19,hint:[20,12],name:'The Weeping Well',r:22,wall:'#',alt:'%',floor:'mosscobble',ceil:'tomb',amb:.34,tex:'tomb',torchGap:4.2,entry:'wd_hill0',rooms:4,n:11,
  pool:[['spectre',5],['skel',3],['bat',2]],junk:['barrel','coffin'],
  boss:{t:'gapwidow',base:'spectre',name:'The Drowned Widow',hpx:5,xpx:6,gold:[120,200]},q:'gap2',
  gear:['st_dirk','potion3'],gold:280,gear2:['ar_iron_a','potion3'],gold2:150},
 {id:7312,host:300,hint:[62,40],name:"The Smugglers' Hold",r:52,inside:1,wall:'#',alt:'%',floor:'cobble',ceil:'beam',amb:.4,tex:'in',torchGap:4.2,entry:'wd_rock1',rooms:4,n:12,
  pool:[['bandit',5],['archer',2],['assassin',1],['rat',2],['scorpion',1]],junk:['barrel','crate'],
  boss:{t:'gapsmuggler',base:'assassin',name:'Gorse Blackwater, the Smuggler Captain',hpx:4,xpx:5,gold:[250,450]},q:'gap3',
  gear:['gf_wd52','potion5'],gold:700,gear2:['ar_sun_a','potion4'],gold2:350},
 {id:7313,host:301,hint:[60,40],name:"The Bellfounders' Cellar",r:54,inside:1,wall:'#',alt:'%',floor:'cobble',ceil:'tomb',amb:.36,tex:'in',entry:'wd_rock2',rooms:4,n:11,
  pool:[['spectre',6],['skel',3],['bat',1]],junk:['barrel','coffin'],
  boss:{t:'gapfounder',base:'spectre',name:'The Last Bellfounder',hpx:5,xpx:6,gold:[250,450]},q:'gap4',
  gear:['gf_mc54','potion5'],gold:760,gear2:['ar_sun_c','potion4'],gold2:380},
 {id:7314,host:9670,hint:[50,20],name:"The Sexton's Burrow",r:92,wall:'#',alt:'%',floor:'mosscobble',ceil:'tomb',amb:.3,tex:'in',entry:'wd_rock0',rooms:5,n:13,
  pool:[['gyskel',4],['gyghoul',3],['gywraith',2],['gybmage',1],['gypike',2]],junk:['coffin','barrel'],
  boss:{t:'gapsexton',base:'gypike',name:'The Sexton Beneath',hpx:6,xpx:7,gold:[500,800]},q:'gap5',
  gear:['ar_star_c','potion6'],gold:1500,gear2:['gh_sw90','potion6'],gold2:700},
 {id:7315,host:9680,hint:[56,48],name:"The Ringers' Undercroft",r:94,wall:'w',floor:'cobble',ceil:'beam',amb:.36,tex:'in',entry:'wd_rock3',rooms:4,n:12,
  pool:[['blbrother',4],['blringer',2],['blshade',3],['blcrow',3]],junk:['coffin','barrel'],
  boss:{t:'gapprior',base:'blbrother',name:'Prior Anselm the Silent',hpx:6,xpx:7,gold:[500,800]},q:'gap6',
  gear:['gh_sw94','potion6'],gold:1600,gear2:['ar_star_a','elixir'],gold2:750},
 {id:7316,host:9690,hint:[18,50],name:'The Mill Race',r:96,wall:'w',floor:'wood',ceil:'beam',amb:.42,tex:'in',entry:'wd_rock1',rooms:4,n:12,
  pool:[['blcrow',3],['blscare',3],['blhusk',3],['blghoul',2],['blpicker',2]],junk:['barrel','crate'],
  boss:{t:'gapmiller',base:'blscare',name:"The Miller's Wife",hpx:6,xpx:7,gold:[500,800]},q:'gap7',
  gear:['ar_star_l','potion6'],gold:1700,gear2:['gh_ax94','elixir'],gold2:800},
 {id:7317,host:9700,hint:[22,50],name:'The Toll Vaults',r:98,wall:'#',alt:'%',floor:'mosscobble',ceil:'tomb',amb:.28,tex:'in',entry:'wd_rock2',rooms:5,n:14,
  pool:[['bldeadwarden',4],['blhound',3],['blshade',2],['blhusk',3],['blghoul',2]],junk:['barrel','coffin'],
  boss:{t:'gaptoll',base:'bldeadwarden',name:'The Tollmaster Below',hpx:7,xpx:8,gold:[600,900]},q:'gap8',
  gear:['gh_sw98','elixir'],gold:1900,gear2:['ar_star_h','supermana'],gold2:900}
];

function gapMakeLevel(spec){
  gapBossDef(spec);
  const B=gapBuild(spec);
  const L={rows:B.rows,start:B.start,enemies:B.enemies,items:[],decor:B.decor,lights:B.lights,secrets:[],name:spec.name,label:spec.name,diff:spec.r,
    portals:[{to:spec.host,x:0,y:0,f:0,tex:spec.tex}],day:0,noExtras:true,gap:spec.id};
  if(spec.floor)L.floor=spec.floor;if(spec.ceil)L.ceil=spec.ceil;if(spec.amb!=null)L.amb=spec.amb;if(spec.torchGap)L.torchGap=spec.torchGap;
  spec.chestsAt=B.chests;
  LEVELS[spec.id]=L;LEVEL_NAMES[spec.id]=spec.name;LEVEL_RATING[spec.id]=spec.r;
  GAPD[spec.id]=spec;
  return L;
}
for(const s of GAP_SPECS){
  if(LEVELS[s.id]||LEVEL_NAMES[s.id]!==undefined)throw new Error('gap dungeon id '+s.id+' is taken');
  gapMakeLevel(s);(GAP_HOSTS[s.host]=GAP_HOSTS[s.host]||[]).push(s);
}

/* the entrance on the host map, placed when the host is built (most of them are built the first time they are entered) */
function gapPlaceEntrance(L,n,spec){
  if(L._gapE&&L._gapE[spec.id])return;
  const sp=gapSpot(L,n,spec.hint,{entrance:true,clear:1});
  if(!sp){console.error('gap: no place for the entrance of',spec.name,'on',n);return}
  (L._gapE=L._gapE||{})[spec.id]=sp;
  const D=LEVELS[spec.id];
  D.portals[0]={to:n,x:sp.out.x,y:sp.out.y,f:sp.out.f,tex:spec.tex};
  L.decor=L.decor||[];
  L.decor.push({k:spec.entry,x:sp.x,y:sp.y,block:true,enter:{to:spec.id,x:D.start.x,y:D.start.y,f:0},gapEnt:spec.id});
  spec.at={host:n,x:sp.x,y:sp.y};
}
function gapPatchHost(n){
  const L=LEVELS[n];if(!L)return;
  for(const s of GAP_HOSTS[n]||[])gapPlaceEntrance(L,n,s);
}
for(const n of Object.keys(GAP_HOSTS).map(Number)){
  if(LEVELS[n]){
    gapPatchHost(n);
  }else if(KH_LAZY[n]){
    const o=KH_LAZY[n];KH_LAZY[n]=function(){const r=o.apply(this,arguments);try{gapPatchHost(n)}catch(e){console.error('gap host',n,e)}return r}
  }
}

/* chests: the gear and the gold are set */
{const _lf=lootFor;lootFor=function(d){
  const sp=GAPD[LEVEL];
  if(sp&&d.k==='chest'){
    const c=(sp.chestsAt||[]).find(q=>q.x===d.x&&q.y===d.y);
    if(c){const ids=(c.boss?sp.gear:sp.gear2).filter(i=>ITEMDEF[i]);d.gold=c.boss?sp.gold:sp.gold2;return ids.map(id=>({id,n:ITEMDEF[id].stack?2:1}))}
  }
  return _lf.apply(this,arguments)}}

/* grinding: every ordinary creature is back each time the party walks in. The boss is back too until the quest is handed in; after that it stays down. */
{const _aes=applyEnemyState;applyEnemyState=function(s){
  const sp=GAPD[LEVEL];
  if(!sp)return _aes.apply(this,arguments);
  if(typeof qSt==='function'&&qSt(sp.q)==='done')G.enemies=G.enemies.filter(e=>e.t!==sp.boss.t);   // once the quest is handed in the boss is gone for good
  // nothing else is remembered: every ordinary creature stands there again
}}

/* the world map: a small cave mark with the dungeon's name beside the place it opens from. The map's own layout (wmnSpread) pushes overlapping places apart, and a new place would shove
   its neighbours about, so these marks are kept out of that: the layout runs without them, then each mark takes the nearest clear spot to its host (clear of every picture, name and title,
   and of the other marks). Positions are in world map coordinates; GAP_WORLD is only the first guess. */
const GAP_WORLD={7310:[214,160],7311:[334,152],7312:[788,88],7313:[850,128],7314:[-540,238],7315:[-610,200],7316:[-656,226],7317:[-706,242]};
if(typeof WORLD_LOCS!=='undefined'&&typeof wmnSpread==='function'){
  for(const s of GAP_SPECS){const p=GAP_WORLD[s.id];if(p&&!WORLD_LOCS.some(l=>l.k==='gap'+s.id))WORLD_LOCS.push({k:'gap'+s.id,n:s.name,lv:[s.id],x:p[0],y:p[1],ic:'cave',sc:.42,gap:s.id,host:s.host,inside:s.inside,dy:s.id===7313?-26:0})}
  const _wsp=wmnSpread;
  wmnSpread=function(){
    const mine=WORLD_LOCS.filter(l=>l.gap);for(const g of mine){if(g._x0===undefined){g._x0=g.x;g._y0=g.y}}
    for(const g of mine)WORLD_LOCS.splice(WORLD_LOCS.indexOf(g),1);
    let r;try{r=_wsp.apply(this,arguments)}finally{for(const g of mine)WORLD_LOCS.push(g)}
    try{
      const boxOf=l=>{const sh=wmnShape(l),nsz=6.6*wmnSc(l);ctx.save();ctx.font=`bold ${nsz}px ${FUI}`;const w=ctx.measureText(l.n).width+(typeof locRating==='function'&&!G.flags.autoScaleOn?24*wmnSc(l):0);ctx.restore();
        return [Math.min(sh.ib[0]-l.x,-w/2-2),sh.ib[1]-l.y,Math.max(sh.ib[2]-l.x,w/2+2),sh.ib[3]-l.y+12+4]};
      const occ=[];
      for(const l of WORLD_LOCS)if(!l.gap){const b=boxOf(l);occ.push([l.x+b[0],l.y+b[1],l.x+b[2],l.y+b[3],l])}
      for(const t of WMN_REG){ctx.save();ctx.font=`${t[3]}px ${FTITLE}`;const w=ctx.measureText(t[0]).width+t[0].length*1.5+6;ctx.restore();occ.push([t[1]-w/2-6,t[2]-t[3]*.7-6,t[1]+w/2+6,t[2]+t[3]*.7+6])}
      for(const l of mine){
        const hl=WORLD_LOCS.find(q=>!q.gap&&q.lv&&q.lv.includes(l.host)),hx=hl?hl.x:l._x0,hy=hl?hl.y:l._y0,b=boxOf(l),inside=!!(hl&&l.inside);let best=null;
        const ORDER=[...Array(48).keys()].map(k=>k/48*Math.PI*2);if(l.pref!==undefined)ORDER.sort((u,v)=>{const d=q=>{const t=Math.abs(q-l.pref)%(Math.PI*2);return Math.min(t,Math.PI*2-t)};return d(u)-d(v)}); // pref: the direction a mark likes to sit in (south for the places under Oldhaven)
        for(let rad=0;rad<=140&&!best;rad+=1.5)for(let a=0;a<48&&!best;a++){
          const ang=ORDER[a],x=Math.round((hx+Math.cos(ang)*rad*1.4)*2)/2,y=Math.round((hy+Math.sin(ang)*rad)*2)/2,bx=[x+b[0]-1,y+b[1]-1,x+b[2]+1,y+b[3]+1];
          if(x<-1000||x>1450||y<20||y>380)continue;
          if(inside){ // on an island: the mark stands on the island's own picture, clear of its name and of everything else
            const ib=wmnShape(hl).ib;if(x<ib[0]+4||x>ib[2]-4||y<ib[1]+10||y>ib[3]-8)continue;
            if(occ.some(q=>q[4]!==hl&&wmnHit(bx,q)))continue;
            if(wmnHit(bx,[hl.x-70,ib[3]-3,hl.x+70,ib[3]+16]))continue;best=[x,y,bx];continue}
          if(occ.some(q=>wmnHit(bx,q)))continue;best=[x,y,bx]}
        if(best){l.x=best[0];l.y=best[1]+(l.dy||0);occ.push(best[2])}else{l.x=l._x0;l.y=l._y0}
      }
    }catch(e){console.error('gap marks',e)}
    return r};
}
