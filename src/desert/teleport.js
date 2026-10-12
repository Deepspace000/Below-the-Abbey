/* ==========================================================================
   STONE TELEPORTERS. Every map has one. Standing on it wakes it; a woken teleporter can carry the party to any other
   woken teleporter. They show on the world map, where a tap on one travels there (while standing on a teleporter).
   ========================================================================== */
function teleSpot(n){
  const L=LEVELS[n];if(!L)return null;if(L._tele)return L._tele;if(L.tele)return L._tele=L.tele;
  const rows=L.rows,H=rows.length,W=rows[0].length,st=L.start;
  const solid=new Set((L.decor||[]).filter(d=>d.block!==false).map(d=>d.x+','+d.y)),bad=new Set(solid); // solid scenery and people cannot be walked through, so the stone is never put behind them
  for(const e of L.enemies||[])bad.add(e.x+','+e.y);
  for(const it of L.items||[])bad.add(it.x+','+it.y);
  const nearDoor=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const c=(rows[y+dy]||'')[x+dx];if(c&&c!=='.'&&/[0-9]/.test(c))return true}return false};
  const seen=new Set([st.x+','+st.y]),q=[[st.x,st.y,0]],cells=[];let far=null,maxD=0;
  while(q.length){
    const [x,y,d]=q.shift();far=[x,y];if(d>maxD)maxD=d;
    if(!bad.has(x+','+y)&&!nearDoor(x,y))cells.push([x,y,d]);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(nx<0||ny<0||nx>=W||ny>=H||seen.has(k)||rows[ny][nx]!=='.'||solid.has(k))continue;seen.add(k);q.push([nx,ny,d+1])}
  }
  // hidden but reachable: well away from the arrival point, tucked into a nook (walls or scenery on several sides), so the player has to search
  const walls=(x,y)=>{let n=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const c=(rows[y+dy]||'')[x+dx];if(!c||c!=='.'||solid.has((x+dx)+','+(y+dy)))n++}return n};
  const minD=Math.max(5,Math.floor(maxD*.45)),maxOk=Math.max(minD+2,Math.floor(maxD*.9));
  let pool=cells.filter(c=>c[2]>=minD&&c[2]<=maxOk),best=null,bs=-1;
  if(!pool.length)pool=cells.filter(c=>c[2]>=3);
  for(const [x,y,d] of pool){const sc=walls(x,y)*10+((x*73+y*151+n*31)%7);if(sc>bs){bs=sc;best={x,y}}}
  if(!best)best=far?{x:far[0],y:far[1]}:{x:st.x,y:st.y};
  return L._tele=best;
}
function teleActive(n){return !!(G.flags.teles&&G.flags.teles[n])}
function teleOn(){return !!(G.tele&&G.P.x===G.tele.x&&G.P.y===G.tele.y&&G.state==='play')}
function placeTeleporter(){ // called when a level is built: one stone in every map
  const sp=teleSpot(LEVEL);G.tele=null;if(!sp)return;
  for(const d of G.decor)if(d.block&&!d.npc&&d.x===sp.x&&d.y===sp.y){d.found=true;d.block=false}
  G.decor.push({k:'teleporter',x:sp.x,y:sp.y,block:false,walk:true,loot:false,shop:false,tele:true});
  G.tele={x:sp.x,y:sp.y,n:LEVEL};
}
function teleStep(nx,ny){
  if(!G.tele||nx!==G.tele.x||ny!==G.tele.y)return;
  const F=G.flags;F.teles=F.teles||{};
  if(!F.teles[LEVEL]){F.teles[LEVEL]=1;sfx('level');msg('The stone hums, and runes of pale light run round its rim. This teleporter is awake. Press T to travel.','#a8d8ff')}
  else msg('A woken teleporter. Press T, or tap Teleport, to travel to another.','#a8d8ff');
}
function teleportTo(n){
  const sp=teleSpot(n);if(!sp||!teleActive(n))return;
  const L=LEVELS[n];let f=0;for(let k=0;k<4;k++){const c=(L.rows[sp.y+DIRS[k][1]]||'')[sp.x+DIRS[k][0]];if(c==='.'){f=k;break}}
  G.teleMode=false;G.overview=false;G.world=false;sfx('level');
  goToLevel(n,{x:sp.x,y:sp.y,f});
  msg('The stone flares, and the party stands in '+(L.label||L.name)+'.','#a8d8ff');
}
function openTeleMap(){G.overview=true;G.world=true;G.wv=wvDefault();G.teleMode=true;G.wnote=null}
function teleFromMap(k){
  const loc=WORLD_LOCS.find(l=>l.k===k);if(!loc)return;
  if(!teleOn()){G.wnote={text:'Stand on a woken teleporter to travel.',t:G.time};return}
  const lv=loc.lv.filter(teleActive);if(!lv.length)return;
  const go=lv.filter(v=>v!==LEVEL);
  if(!go.length){G.wnote={text:'You are already here.',t:G.time};return}
  if(go.length===1){teleportTo(go[0]);return}
  G.overview=false;G.world=false;G.teleMode=false;
  G.talk={d:{k:'teleporter'},n:{name:'Teleporter'},node:say('Which stone in '+loc.n+'?',go.map(v=>[LEVELS[v].label||LEVELS[v].name,()=>{teleportTo(v);return null}]).concat([['Stay here.',()=>null]])),t:G.time,btns:[]};G.hold=null;G.queued=null;
}
/* the stone itself, painted: a round dais of old grey stone with a ring of runes that wakes to a pale blue light */
function dsTeleStone(frame){
  const W=180,H=100;
  return mkCanvas(W,H,(x)=>{
    const on=frame>0,pulse=on?.6+.4*Math.sin(frame*1.6):0;
    {const S=pc(W,H),s=S.getContext('2d');s.fillStyle='rgba(0,0,0,.5)';s.beginPath();s.ellipse(90,78,76,12,0,0,TAU);s.fill();x.drawImage(pBlur(S,4),0,0)}
    if(on){const g=x.createRadialGradient(90,52,6,90,52,86);g.addColorStop(0,'rgba(190,230,255,'+(.55*pulse+.2)+')');g.addColorStop(1,'rgba(120,180,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
    pForm(x,W,H,t=>{t.beginPath();t.ellipse(90,62,76,24,0,0,TAU)},t=>{const g=t.createLinearGradient(14,30,166,90);g.addColorStop(0,'#8c8a82');g.addColorStop(.5,'#6a685f');g.addColorStop(1,'#3a3832');return g},
      s=>{s.fillStyle='rgba(255,255,240,.25)';s.beginPath();s.ellipse(70,50,46,9,-.1,0,TAU);s.fill();s.fillStyle='rgba(20,18,14,.45)';s.beginPath();s.ellipse(120,74,50,10,.1,0,TAU);s.fill()},
      {blur:3,rim:.6,rimW:7,grain:.18,seed:21,shadow:.3,sx:0,sy:4,fine:f=>{f.strokeStyle='rgba(30,26,20,.5)';f.lineWidth=1.4;for(let i=0;i<14;i++){const a=i/14*TAU;f.beginPath();f.moveTo(90+Math.cos(a)*60,62+Math.sin(a)*19);f.lineTo(90+Math.cos(a)*76,62+Math.sin(a)*24);f.stroke()}}});
    // the raised inner disc
    pForm(x,W,H,t=>{t.beginPath();t.ellipse(90,56,54,16,0,0,TAU)},t=>{const g=t.createLinearGradient(40,40,140,72);g.addColorStop(0,'#a8a69c');g.addColorStop(1,'#56544c');return g},
      s=>{s.fillStyle='rgba(255,255,240,.3)';s.beginPath();s.ellipse(76,50,30,6,-.1,0,TAU);s.fill()},{blur:2,rim:.5,rimW:5,grain:.16,seed:22});
    // the runes round the disc, dark when asleep and bright when awake
    for(let i=0;i<10;i++){const a=i/10*TAU+.3,px=90+Math.cos(a)*40,py=56+Math.sin(a)*11,s=1+Math.sin(a)*.2;
      x.save();x.translate(px,py);x.scale(s,s*.5);
      x.strokeStyle=on?'rgba(210,240,255,'+(.55+.45*pulse)+')':'rgba(40,36,30,.8)';x.lineWidth=on?2.6:2;x.lineCap='round';
      x.beginPath();if(i%3===0){x.moveTo(-4,-6);x.lineTo(4,6);x.moveTo(4,-6);x.lineTo(-4,6)}else if(i%3===1){x.moveTo(0,-7);x.lineTo(0,7);x.moveTo(-5,-2);x.lineTo(5,-2)}else{x.arc(0,0,5,0,TAU)}x.stroke();x.restore()}
    if(on){const g=x.createRadialGradient(90,54,2,90,54,26);g.addColorStop(0,'rgba(255,255,255,'+(.8*pulse+.2)+')');g.addColorStop(1,'rgba(150,210,255,0)');x.fillStyle=g;x.beginPath();x.ellipse(90,54,26,9,0,0,TAU);x.fill()}
  });
}
function makeTeleSprites(){for(let f=0;f<=4;f++)IMG['tele'+f]=dsTeleStone(f);NPC_H.teleporter=.62}
