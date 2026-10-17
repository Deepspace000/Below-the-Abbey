/* ==========================================================================
   STONE TELEPORTERS. Every map has one. Standing on it wakes it; a woken teleporter can carry the party to any other
   woken teleporter. They show on the world map, where a tap on one travels there (while standing on a teleporter).
   ========================================================================== */
function teleSpot(n){
  const L=LEVELS[n];if(!L)return null;if(L._tele)return L._tele;if(L.tele)return L._tele=L.tele;
  const rows=L.rows,H=rows.length,W=rows[0].length,st=L.start;
  const solid=new Set((L.decor||[]).filter(d=>d.block!==false).map(d=>d.x+','+d.y)),bad=new Set(solid); // solid scenery and people cannot be walked through, so the stone is never put behind them
  const tb=typeof terrFor==='function'?terrFor(n):null;if(tb)for(let q=0;q<tb.block.length;q++)if(tb.block[q]){const k=(q%tb.W)+','+((q/tb.W)|0);solid.add(k);bad.add(k)}
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
/* which place on the world map a level belongs to: the rooms of Khemetra and Ironhill, and any room behind a door, belong to the town round them */
function teleLocOf(n,d){
  const L=WORLD_LOCS.find(l=>l.lv.includes(n));if(L)return L;
  if(n>=199&&n<=270)return WORLD_LOCS.find(l=>l.k==='scoria');
  if(n>=271&&n<=274)return WORLD_LOCS.find(l=>l.k==='ironhill');
  if((d||0)>4)return null;
  const lv=LEVELS[n],p=lv&&lv.portals&&lv.portals[0];
  return p&&p.to!==undefined&&p.to!==n?teleLocOf(p.to,(d||0)+1):null;
}
function teleLevelsAt(loc){return Object.keys(G.flags.teles||{}).map(Number).filter(n=>G.flags.teles[n]&&(loc.lv.includes(n)||teleLocOf(n)===loc))}
function teleActive(n){return !!(G.flags.teles&&G.flags.teles[n])}
function teleOn(){return !!(G.tele&&G.P.x===G.tele.x&&G.P.y===G.tele.y&&G.state==='play')}
/* nothing else may stand on the teleporter's square: whatever is there moves to the nearest free square, or is removed if the room is too full */
function clearTeleSquare(sp){
  const L=LEVELS[LEVEL],rows=L&&L.rows;if(!rows)return;
  const taken=(x,y)=>G.decor.some(d=>d.x===x&&d.y===y&&!d.found)||G.items.some(i=>!i.taken&&i.x===x&&i.y===y)||G.enemies.some(e=>e.hp>0&&e.x===x&&e.y===y)||(x===sp.x&&y===sp.y);
  const free=(x,y)=>rows[y]&&rows[y][x]==='.'&&G.grid[y]&&G.grid[y][x]===0&&!taken(x,y)&&!(L.portals||[]).some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<2);
  const spot=()=>{for(let r=1;r<=3;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=sp.x+dx,y=sp.y+dy;if(free(x,y))return [x,y]}return null};
  for(const d of G.decor){if(d.x!==sp.x||d.y!==sp.y||d.tele||d.found)continue;
    if(d.npc&&!d.deco&&d.block){const q=spot();if(q){d.x=q[0];d.y=q[1]}else{d.found=true;d.block=false;d.hidden=true}continue}
    const q=spot();if(q){d.x=q[0];d.y=q[1]}else{d.found=true;d.block=false;d.hidden=true;d.deco=true}}
  for(const i of G.items)if(!i.taken&&i.x===sp.x&&i.y===sp.y){const q=spot();if(q){i.x=q[0];i.y=q[1]}else i.taken=true}
  for(const e of G.enemies)if(e.hp>0&&e.x===sp.x&&e.y===sp.y){const q=spot();if(q){e.x=q[0];e.y=q[1];e.rx=q[0];e.ry=q[1]}}
}
function placeTeleporter(){ // called when a level is built: one stone in every map
  G.tele=null;if(LEVELS[LEVEL]&&LEVELS[LEVEL].noTele)return; // the Pilgrim’s Path has only a few, hidden
  const sp=teleSpot(LEVEL);if(!sp)return;
  clearTeleSquare(sp);
  G.decor.push({k:'teleporter',x:sp.x,y:sp.y,block:false,walk:true,loot:false,shop:false,tele:true});
  G.tele={x:sp.x,y:sp.y,n:LEVEL};
}
function teleStep(nx,ny){
  if(!G.tele||nx!==G.tele.x||ny!==G.tele.y)return;
  const F=G.flags;F.teles=F.teles||{};
  if(!F.teles[LEVEL]){F.teles[LEVEL]=1;sfx('level');msg('The stone hums, and runes of pale light run round its rim. This teleporter is awake. Press T to travel.','#a8d8ff')}
  else msg('A woken teleporter. Press T, or tap Teleport, to travel to another.','#a8d8ff');
}
/* the journey: a blue-white swirl closes round the party, a sudden black, a swirl opening on the new place, and its name */
var TP=null;
function teleportTo(n){
  if(TP)return;
  // after a reload the far places are not built yet: build the room first, and let the golden city load before travelling to it
  if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();
  if(LEVELS[44]&&LEVELS[44].stub&&(n===44||(n>=199&&n<=274))&&typeof khEnter==='function'){G.teleMode=false;G.overview=false;G.world=false;khEnter(()=>teleportTo(n));return}
  const sp=teleSpot(n);if(!sp||!teleActive(n)){msg('The stone does not answer.','#d09a80');return}
  const L=LEVELS[n];let f=0;for(let k=0;k<4;k++){const c=(L.rows[sp.y+DIRS[k][1]]||'')[sp.x+DIRS[k][0]];if(c==='.'){f=k;break}}
  G.teleMode=false;G.overview=false;G.world=false;
  TP={ph:'out',t:0,n,sp,f,name:L.teleName||L.label||L.name};
  sfx('level');
}
const TP_OUT=1.2,TP_BLACK=.45,TP_IN=1.3,TP_NAME=3.4;
function tpTick(dt){
  if(!TP)return;TP.t+=dt;
  if(TP.ph==='out'&&TP.t>=TP_OUT){
    TP.ph='black';TP.t=0;
    const q=TP;goToLevel(q.n,{x:q.sp.x,y:q.sp.y,f:q.f});TP=q; // goToLevel starts a new level; the effect carries on over it
    G.msgs=[];
  }else if(TP.ph==='black'&&TP.t>=TP_BLACK){TP.ph='in';TP.t=0;sfx('level')}
  else if(TP.ph==='in'&&TP.t>=TP_NAME)TP=null;
}
function tpSwirl(a,rot,tight){
  const cx=210,cy=105;
  ctx.save();
  const g=ctx.createRadialGradient(cx,cy,2,cx,cy,170);g.addColorStop(0,'rgba(235,248,255,'+(.7*a)+')');g.addColorStop(.45,'rgba(120,180,255,'+(.4*a)+')');g.addColorStop(1,'rgba(10,20,60,'+(.75*a)+')');
  ctx.fillStyle=g;ctx.fillRect(0,0,420,210);
  ctx.lineCap='round';
  for(let arm=0;arm<5;arm++){
    for(let pass=0;pass<2;pass++){
      ctx.beginPath();
      for(let r=4;r<230;r+=4){const an=arm*TAU/5+rot+r*tight*(pass?1.12:1),x=cx+Math.cos(an)*r*1.5,y=cy+Math.sin(an)*r*.78;if(r===4)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
      ctx.strokeStyle=pass?'rgba(255,255,255,'+(.55*a)+')':'rgba(120,190,255,'+(.62*a)+')';ctx.lineWidth=pass?2.4:9;ctx.stroke();
    }
  }
  ctx.restore();
}
function drawTport(){
  if(!TP)return;
  if(TP.ph==='out'){const p=TP.t/TP_OUT,e=p*p;tpSwirl(Math.min(1,e*1.1+.05),TP.t*(3+p*14),.016+p*.02)}
  else if(TP.ph==='black'){ctx.fillStyle='#000';ctx.fillRect(0,0,420,210)}
  else{
    const p=Math.min(1,TP.t/TP_IN),a=1-p;
    if(a>0){ctx.fillStyle='rgba(0,0,0,'+(.85*a*a)+')';ctx.fillRect(0,0,420,210);tpSwirl(a,-TP.t*(12-p*9),.036-p*.018)}
    const fi=clamp(TP.t/.7,0,1),fo=clamp((TP_NAME-TP.t)/.9,0,1),al=Math.min(fi,fo);
    if(al>0){ctx.save();ctx.globalAlpha=al;ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,78,420,50);
      txt(TP.name,210,96,15,'#e8f4ff','center',true);txt('The party arrives.',210,114,8,'#a8d8ff','center',true);ctx.restore()}
  }
}
function openTeleMap(){G.overview=true;G.world=true;G.wv=wvDefault();G.teleMode=true;G.wnote=null}
function teleFromMap(k){
  const loc=WORLD_LOCS.find(l=>l.k===k);if(!loc)return;
  if(!teleOn()){G.wnote={text:'Stand on a woken teleporter to travel.',t:G.time};return}
  const lv=teleLevelsAt(loc);if(!lv.length)return;
  const go=lv.filter(v=>v!==LEVEL);
  if(!go.length){G.wnote={text:'You are already here.',t:G.time};return}
  if(go.length===1){teleportTo(go[0]);return}
  G.overview=false;G.world=false;G.teleMode=false;
  G.talk={d:{k:'teleporter'},n:{name:'Teleporter'},node:say('Which stone in '+loc.n+'?',go.map(v=>[(LEVELS[v]&&(LEVELS[v].teleName||LEVELS[v].label||LEVELS[v].name))||LEVEL_NAMES[v]||'Level '+v,()=>{teleportTo(v);return null}]).concat([['Stay here.',()=>null]])),t:G.time,btns:[]};G.hold=null;G.queued=null;
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
