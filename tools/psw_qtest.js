async()=>{
 const log=[];const ok=(c,m)=>log.push((c?'ok   ':'FAIL ')+m);
 await pswLoad();
 for(const id of [9750,9760]){
  const L=pswMake(id),W=L.rows[0].length,H=L.rows.length;
  ok(L.rows.every(r=>r.length===W),id+' rows rectangular '+W+'x'+H);
  ok(L._psw.miss.length===0,id+' nothing missed: '+L._psw.miss.slice(0,8).join(' '));
  const blocked=new Set();for(const d of L.decor)if(d.block)blocked.add(d.x+','+d.y);
  const pass=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!blocked.has(x+','+y);
  // links: door tile, landing, twins
  for(const lk of pspLinksFrom(id)){
    if(lk.prov&&!lk.lock)continue;
    const c=L.rows[lk.at[1]][lk.at[0]],gid=c!=='.'&&L.chars[c],kd=gid&&KH_DOOR[gid];
    ok(!!kd,id+' door tile at '+lk.at+' ('+lk.name+')');
    if(lk.lock)ok(kd&&kd.psw==='lock','  is a locked stair door');
    const [lx,ly]=lk.land;let clear=true;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!pass(lx+dx,ly+dy))clear=false;
    ok(clear,'  landing '+lk.land+' has a clear 3x3');
    const tw=PSP.LINKS.find(t=>t.from===lk.to&&t.to===id);ok(!!tw,'  has a twin from '+lk.to);
  }
  // reachability from every arrival, with the lever
  const arrivals=PSP.LINKS.filter(l=>l.to===id).map(l=>({x:l.land[0],y:l.land[1]}));
  const un=new Set();
  for(const a of arrivals){const r=pswReach(id,a,true);ok(r.unreached.length===0,id+' from '+a.x+','+a.y+' every floor square reached (thru lever): unreached '+r.unreached.length+' '+JSON.stringify(r.unreached.slice(0,5)))}
  const r0=pswReach(id,arrivals[0],false);
  if(id===9760){ok(r0.unreached.length>0&&r0.unreached.every(([x,y])=>x>=58&&x<=68&&y>=22&&y<=32),'9760 without the lever only the sacristy is unreachable ('+r0.unreached.length+' squares)')}
  else ok(r0.unreached.length===0,'9750 all reachable without any key');
  // doors, npcs, pickups reachable
  const R=pswReach(id,arrivals[0],true);
  const nb=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>R.seen.has((x+a)+','+(y+b)));
  for(const d of L.decor)if(d.npc&&!R.seen.has(d.x+','+d.y)&&!nb(d.x,d.y))ok(false,id+' npc '+d.npc+' at '+d.x+','+d.y+' cannot be reached');
  for(const lk of pspLinksFrom(id)){if(lk.prov&&!lk.lock)continue;ok(nb(lk.at[0],lk.at[1])||R.seen.has(lk.at[0]+','+lk.at[1]),id+' door '+lk.at+' can be reached')}
  // corridor width: every passable square belongs to a 2x2 passable block
  const narrow=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!pass(x,y))continue;let w=false;for(const [a,b] of [[0,0],[-1,0],[0,-1],[-1,-1]])if(pass(x+a,y+b)&&pass(x+a+1,y+b)&&pass(x+a,y+b+1)&&pass(x+a+1,y+b+1))w=true;if(!w&&R.seen.has(x+','+y))narrow.push([x,y])}
  ok(narrow.length===0,id+' passable squares narrower than 2: '+narrow.length+' '+JSON.stringify(narrow.slice(0,12)));
  // duplicates and overlaps
  const seen={},dups=[];for(const d of L.decor){if(d.k==='sign_gy')continue;const k=d.x+','+d.y;if(seen[k]&&(seen[k].block||d.block))dups.push(k+' '+seen[k].k+'+'+d.k);seen[k]=d}
  ok(dups.length===0,id+' no two blocking props on one square: '+dups.slice(0,6).join(' | '));
  const es={},ed=[];for(const e of L.enemies){const k=e.x+','+e.y;if(es[k]||blocked.has(k))ed.push(k+' '+e.t);es[k]=1}
  ok(ed.length===0,id+' no creature stacked or inside a prop: '+ed.join(' '));
  // creatures away from landings and rest rooms
  const bad=[];for(const e of L.enemies){for(const a of arrivals)if(Math.hypot(e.x-a.x,e.y-a.y)<4)bad.push(e.t+'@'+e.x+','+e.y+' near arrival');for(const r of L._psw.rests)if(e.x>=r.x0-3&&e.x<=r.x1+3&&e.y>=r.y0-3&&e.y<=r.y1+3)bad.push(e.t+'@'+e.x+','+e.y+' near '+r.name)}
  ok(bad.length===0,id+' no creature near an arrival or a rest room: '+bad.join(' '));
  // each prop key resolves to a picture
  const nopic=[...new Set(L.decor.filter(d=>d.k!=='sign_gy'&&!IMG[d.k]).map(d=>d.k))];ok(nopic.length===0,id+' every prop has a picture: '+nopic.join(' '));
  ok(L.enemies.every(e=>ENEMY_DEF[e.t]),id+' every creature type is defined: '+[...new Set(L.enemies.filter(e=>!ENEMY_DEF[e.t]).map(e=>e.t))].join(' '));
  ok(L.decor.filter(d=>d.npc).every(d=>NPCS[d.npc]),id+' every npc has a root: '+[...new Set(L.decor.filter(d=>d.npc&&!NPCS[d.npc]).map(d=>d.npc))].join(' '));
  log.push('info '+id+' decor '+L.decor.length+' creatures '+L.enemies.length+' torches '+L._psw.torches.length);
 }
 ok(!!ITEMDEF.pskey2,'item pskey2 defined');
 for(const q of ['psq20','psq21','psq22','psq23'])ok(!!QUESTS[q],'quest '+q+' defined');
 return log}
