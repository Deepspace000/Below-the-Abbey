/* ==========================================================================
   THE DEEPER HOLLOW, STAGE 3: SECRETS (prefix hgds / HGDS). Secret doors (a wall of a slightly different shade: walk into it), hidden treasure chambers at the ends of dead-end
   corridors, doors that need a coloured key (red, blue, green, gold) and doors that need a gem (ruby, sapphire, emerald, amber, amethyst, pearl; the gem is spent).
   Runs after the people are placed (wraps hgdBuild again). Keys and gems come from vault chests, quest rewards, the danger zones and the shops.
   ========================================================================== */
const HGDS_KEYS=[['red','Red Key','#d03a2a',[255,50,40]],['blue','Blue Key','#3a6ad0',[60,120,255]],['green','Green Key','#3aa04a',[60,200,90]],['gold','Gold Key','#e0b030',[255,200,50]]];
const HGDS_GEMS=[['ruby','Ruby','#e02848',[255,40,80]],['sapphire','Sapphire','#2858e0',[50,100,255]],['emerald','Emerald','#28b060',[40,220,110]],['amber','Amber','#e89820',[255,160,30]],['amethyst','Amethyst','#9a48d8',[170,80,255]],['pearl','Pearl','#f0e8e0',[245,240,235]]];
for(const [k,n,c] of HGDS_KEYS){ITEMDEF['hgdkey_'+k]={n,k:'quest',t:'Key',ic:'ore',c,stack:1,price:120,d:'A '+n.toLowerCase()+' for a locked door in the deeper Hollow maze. It is used up in the lock.',sw:.2}}
for(const [k,n,c] of HGDS_GEMS){ITEMDEF['hgdgem_'+k]={n,k:'quest',t:'Gem',ic:'ore',c,stack:1,price:400,d:'A cut '+n.toLowerCase()+'. It fits the hollow of a gem door in the deeper Hollow maze, and is used up there. A trader would pay well for it.',sw:.2}}
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...HGDS_KEYS.map(k=>'hgdkey_'+k[0]),...HGDS_GEMS.map(g=>'hgdgem_'+g[0]));
// rewards and shops hand out keys and gems too
for(const [id,k] of [['dq3','red'],['dq6','blue'],['dq9','green'],['dq11','gold']])if(QUESTS[id])QUESTS[id].reward.items=(QUESTS[id].reward.items||[]).concat(['hgdkey_'+k]);
if(typeof HGDP_SHOPS!=='undefined'){HGDP_SHOPS[2][1].push(['hgdkey_red',3]);HGDP_SHOPS[6][1].push(['hgdkey_blue',3],['hgdkey_green',3]);HGDP_SHOPS[7][1].push(['hgdkey_gold',3],['hgdgem_pearl',1]);HGDP_SHOPS[3][1].push(['hgdkey_green',2])}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('A door with a gem set in it wants that gem, and takes it. Keys are used up the same way. Save them for the good doors.','The walls of a secret door are a shade off from the rest. Walk into one and see.','Dead ends are not always dead. Some have a door that is not a door.');
const hgdpTex=n=>{const i=IMG['art_tex_hgdp_'+n];return i&&i.width?i:null};
/* ---------- the looks of the doors (drawn in code: walls and doors may be) ---------- */
function hgdsTexSecret(i){const P=hgdpTex('secret');if(P){const key='hgds_sec'+i;if(IMG[key])return key;const b=IMG[HGDM.biomes[i].wall];IMG[key]=mkCanvas(128,128,(x,w,h)=>{if(b)x.drawImage(b,0,0,w,h);x.globalCompositeOperation='multiply';x.globalAlpha=.75;x.drawImage(P,0,0,w,h)});return key} // the wall of its biome, with a hairline seam in the shape of a door and a few scuffs: it can be spotted by a careful eye
  const key='hgds_sec'+i;if(IMG[key])return key;const b=IMG[HGDM.biomes[i].wall];
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#777';x.fillRect(0,0,w,h)}
    x.fillStyle='rgba(255,230,170,.10)';x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(18,10,4,.7)';x.lineWidth=1.8;x.lineJoin='round';x.beginPath();x.moveTo(34,h);x.lineTo(34,30);x.quadraticCurveTo(34,14,64,14);x.quadraticCurveTo(94,14,94,30);x.lineTo(94,h);x.stroke();
    x.strokeStyle='rgba(255,240,200,.45)';x.lineWidth=1;x.beginPath();x.moveTo(36,h);x.lineTo(36,30);x.quadraticCurveTo(36,16,64,16);x.stroke();
    x.fillStyle='rgba(18,10,4,.45)';for(const [a,c] of [[44,100],[80,112],[56,70],[72,44]]){x.beginPath();x.ellipse(a,c,2.4,1.2,0,0,6.3);x.fill()}});
  return key}
function hgdsTexKey(k){const P=hgdpTex('doorkey');if(P){const key='hgds_key'+k[0];if(IMG[key])return key;IMG[key]=mkCanvas(128,128,(x,w,h)=>{x.drawImage(P,0,0,w,h);x.globalAlpha=.55;x.fillStyle=k[2];x.fillRect(0,58,w,14);x.globalAlpha=1;x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=1.2;x.strokeRect(.6,58,w-1.2,14)});return key} // a banded wooden door with an iron lock plate and a stripe of the key's colour
  const key='hgds_key'+k[0];if(IMG[key])return key;const col=k[2];
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#4a2c18');g.addColorStop(.5,'#6a4426');g.addColorStop(1,'#42281a');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(20,10,4,.55)';x.lineWidth=1.4;for(let i=1;i<6;i++){x.beginPath();x.moveTo(i*w/6,0);x.lineTo(i*w/6,h);x.stroke()}
    x.fillStyle='#2a2a30';for(const y of [22,100]){x.fillRect(0,y,w,10);x.fillStyle='#9a9aa4';for(let a=8;a<w;a+=18){x.beginPath();x.arc(a,y+5,1.6,0,6.3);x.fill()}x.fillStyle='#2a2a30'}
    x.fillStyle=col;x.fillRect(0,56,w,16);x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=1.4;x.strokeRect(.7,56,w-1.4,16);
    x.fillStyle='#22222a';x.strokeStyle='#c8c8d0';x.lineWidth=1.6;x.beginPath();x.arc(64,64,17,0,6.3);x.fill();x.stroke();
    x.fillStyle='#d8d8e0';x.beginPath();x.arc(64,60,4.4,0,6.3);x.fill();x.fillRect(62,60,4,13);
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
function hgdsTexGem(g){const P=hgdpTex('gem');if(P){const key='hgds_gem'+g[0];if(IMG[key])return key;const hue={ruby:0,sapphire:230,emerald:130,amber:40,amethyst:280,pearl:0}[g[0]];IMG[key]=mkCanvas(128,128,(x,w,h)=>{x.filter=g[0]==='pearl'?'grayscale(1) brightness(1.5) contrast(.9)':'hue-rotate('+hue+'deg) saturate(1.1)';x.drawImage(P,0,0,w,h);x.filter='none'});return key} // a carved stone slab with a golden ring and a large cut gem that glows in its own colour
  const key='hgds_gem'+g[0];if(IMG[key])return key;const col=g[2],rgb=g[3];
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{x.fillStyle='#6a665e';x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(20,16,10,.55)';x.lineWidth=1.4;for(const y of [32,64,96]){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}for(const [y,a] of [[0,48],[32,80],[64,40],[96,88]]){x.beginPath();x.moveTo(a,y);x.lineTo(a,y+32);x.stroke()}
    const rg=x.createRadialGradient(64,64,6,64,64,60);rg.addColorStop(0,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',.55)');rg.addColorStop(1,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0)');x.fillStyle=rg;x.fillRect(0,0,w,h);
    x.strokeStyle='#d8b440';x.lineWidth=4;x.beginPath();x.arc(64,64,36,0,6.3);x.stroke();x.strokeStyle='#7a5a18';x.lineWidth=1.2;x.beginPath();x.arc(64,64,38.5,0,6.3);x.stroke();x.beginPath();x.arc(64,64,33.5,0,6.3);x.stroke();
    const pts=[[64,34],[88,52],[88,76],[64,94],[40,76],[40,52]];x.fillStyle=col;x.strokeStyle='#201810';x.lineWidth=1.6;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1;x.beginPath();x.moveTo(40,52);x.lineTo(64,64);x.lineTo(88,52);x.moveTo(64,64);x.lineTo(64,94);x.stroke();
    x.fillStyle='rgba(255,255,255,.65)';x.beginPath();x.moveTo(52,46);x.lineTo(62,40);x.lineTo(58,52);x.closePath();x.fill();
    x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
/* ---------- placing them ---------- */
function hgdsBuild(L){
  if(L._hgds)return;const M=L._hgdm,W=M.W,H=M.H,rows=L.rows.map(r=>r.split('')),rnd=hgdmRng(475003),kind=M.kind,bio=M.bio;
  const open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set();for(const d of L.decor)occ.add(d.x+','+d.y);for(const i of L.items)occ.add(i.x+','+i.y);for(const e of L.enemies)occ.add(e.x+','+e.y);
  const deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
  const nb=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b));
  // tiles: a secret wall per biome (a shade off), the four key doors, the six gem doors
  const TM=ohTiles(),base=L.chars,chars=L.chars,wchB=i=>String.fromCharCode(0x2e0+i);let nextCh=0x300;
  const mk=(style,img,tint,contrast)=>{OH_STY[style]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:img,door:img,win:img,alt:img,zoom:1,contrast:contrast||1.05,tint});const ch=String.fromCharCode(nextCh++);chars[ch]=TM.make('plain',style,2.7).gid;return ch};
  const secretCh=HGDM.biomes.map((b,i)=>mk('hgdm_sec'+i,hgdsTexSecret(i),[255,255,255,0],1.0));
  const keyCh=HGDS_KEYS.map(k=>mk('hgdm_key'+k[0],hgdsTexKey(k),[255,255,255,0],1.0));
  const gemCh=HGDS_GEMS.map(g=>mk('hgdm_gem'+g[0],hgdsTexGem(g),[255,255,255,0],1.0));
  const doors={};
  // dead-end chains: from a dead end back along the corridor to a junction
  const chains=[];const seenE=new Set();
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!open(x,y)||kind[y*W+x]||deg(x,y)!==1||occ.has(x+','+y))continue;
    const ch=[[x,y]];let px=x,py=y,cx=nb(x,y)[0][0],cy=nb(x,y)[0][1];
    while(deg(cx,cy)===2&&!kind[cy*W+cx]&&ch.length<12){ch.push([cx,cy]);const nn=nb(cx,cy).filter(([a,b])=>!(a===px&&b===py))[0];px=cx;py=cy;cx=nn[0];cy=nn[1]}
    // ch[0] is the dead end, ch[last] touches the junction (cx,cy) or an open place
    if(ch.length<3||ch.some(c=>occ.has(c[0]+','+c[1])))continue;chains.push(ch)}
  chains.sort(()=>rnd()-.5);
  const taken=[],apart=ch=>taken.every(t=>Math.hypot(t[0][0]-ch[0][0],t[0][1]-ch[0][1])>=11);
  const pick=(minLen,n)=>{const out=[];for(const ch of chains){if(out.length>=n)break;if(ch.length<minLen||!apart(ch))continue;taken.push(ch);out.push(ch)}return out};
  const gemC=pick(5,6),keyC=pick(4,12),secC=pick(3,40);
  const chests=[];
  const seal=(ch,type,idx,tier,give)=>{const door=ch[ch.length-1],ch0=ch[0];
    const cc=type==='secret'?secretCh[bio[door[1]*W+door[0]]]:type==='key'?keyCh[idx]:gemCh[idx];
    rows[door[1]][door[0]]=cc;doors[door[0]+','+door[1]]={type,idx};
    const k=['hg_chestjelly','hg_chestwax','hg_chestweed'][(tier+idx)%3];
    const d={k,x:ch0[0],y:ch0[1],block:true,hgdTier:tier,hgdGive:give||[]};L.decor.push(d);chests.push(d)};
  gemC.forEach((ch,i)=>seal(ch,'gem',i,4,[]));
  keyC.forEach((ch,i)=>seal(ch,'key',i%4,3,[]));
  // the vault chests that carry keys and gems for the other doors: every colour of key twice, and three gems
  const give=[];for(let k=0;k<4;k++)give.push('hgdkey_'+HGDS_KEYS[k][0],'hgdkey_'+HGDS_KEYS[k][0]);give.push('hgdgem_ruby','hgdgem_emerald','hgdgem_amethyst','hgdgem_sapphire');
  secC.forEach((ch,i)=>seal(ch,'secret',0,i%3===0?2:1,i<give.length?[give[i]]:[]));
  // secret shortcuts: a wall between two far-apart corridors (by walking distance from the start)
  const dist=new Int32Array(W*H).fill(-1),q=[[L.start.x,L.start.y]];dist[L.start.y*W+L.start.x]=0;
  const blk=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(!open(nx,ny)||dist[ny*W+nx]>=0)continue;dist[ny*W+nx]=dist[y*W+x]+1;q.push([nx,ny])}}
  const sc=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const c=rows[y][x];if(c==='.'||c.charCodeAt(0)<0x2e0||c.charCodeAt(0)>=0x2e8)continue;
    for(const [a,b] of [[1,0],[0,1]]){const p=[x-a,y-b],r=[x+a,y+b];if(!open(...p)||!open(...r)||kind[p[1]*W+p[0]]||kind[r[1]*W+r[0]])continue;const dd=Math.abs(dist[p[1]*W+p[0]]-dist[r[1]*W+r[0]]);if(dd>=60)sc.push([x,y,dd])}}
  sc.sort(()=>rnd()-.5);const sct=[];for(const s of sc){if(sct.length>=40)break;if(sct.every(t=>Math.hypot(t[0]-s[0],t[1]-s[1])>=12)&&!doors[s[0]+','+s[1]]){sct.push(s);rows[s[1]][s[0]]=secretCh[bio[s[1]*W+s[0]]];doors[s[0]+','+s[1]]={type:'secret',idx:0}}}
  L.rows=rows.map(r=>r.join(''));
  L._hgds={doors,chests:chests.length,chains:{gem:gemC.length,key:keyC.length,secret:secC.length},shortcuts:sct.length}}
/* ---------- opening them: walk into the wall, door or locked door ---------- */
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID){const L=LEVELS[LEVEL],dd=L&&L._hgds&&L._hgds.doors[nx+','+ny];
    if(dd){const F=G.flags,op=F.hgdOpen||(F.hgdOpen={}),kk=nx+','+ny;if(op[kk])return false;
      const open=()=>{op[kk]=1;G.grid[ny][nx]=0;sfx('door');later(300,endRound)};
      if(dd.type==='secret'){G.shake=.3;msg('The wall gives way. A hidden door grinds open.','#ffe9a0');open();return true}
      const id=dd.type==='key'?'hgdkey_'+HGDS_KEYS[dd.idx][0]:'hgdgem_'+HGDS_GEMS[dd.idx][0],nm=ITEMDEF[id].n;
      if(bagCount(id)>0){bagRemove(id,1);msg(dd.type==='key'?'The '+nm.toLowerCase()+' turns, and is used up. The door swings open.':'The '+nm.toLowerCase()+' fits the hollow in the door, and is spent. The door swings open.','#ffe070');open();return true}
      sfx('locked');msg(dd.type==='key'?'The door is locked. It needs a '+nm.toLowerCase()+'.':'A hollow is cut in the door, shaped for a '+nm.toLowerCase()+'. The door needs one.','#d09a80');return true}}}catch(e){console.warn('hgds',e)}
  return _db.apply(this,arguments)}}
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID&&G.state==='play'&&G.flags.hgdOpen){for(const k in G.flags.hgdOpen){const p=k.split(',');if(G.grid[+p[1]]&&G.grid[+p[1]][+p[0]]!==0)G.grid[+p[1]][+p[0]]=0}}}catch(e){}return _u.apply(this,arguments)}}
/* ---------- the chests ---------- */
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL===HGD.ID&&d&&d.hgdTier){const r=k=>hash2(d.x,d.y,700+k),it=[],add=(id,n)=>it.push({id,n:ITEMDEF[id]&&ITEMDEF[id].stack?(n||1):1}),t=d.hgdTier;
    for(const g of (d.hgdGive||[]))add(g,1);
    if(t===1){add(['potion2','hgjelly','hgcomb','manadraught'][(r(1)*4)|0],2);d.gold=80+Math.floor(r(2)*160)}
    else if(t===2){add('potion3',2);add(['manadraught','greatermana','hgjelly'][(r(3)*3)|0],2);if(r(4)<.5)add(HG_GEAR[(r(5)*HG_GEAR.length)|0]);d.gold=250+Math.floor(r(6)*300)}
    else if(t===3){add('potion4',2);add('greatermana',2);add(HG_GEAR[(r(7)*HG_GEAR.length)|0]);if(r(8)<.6)add('hgcrystal');d.gold=600+Math.floor(r(9)*600)}
    else{add('potion5',2);add('supermana',2);add(HG_GEAR[(r(10)*HG_GEAR.length)|0]);add('hgcrystal');add(HGDS_GEMS[(r(11)*6)|0][0]&&'hgdgem_'+HGDS_GEMS[(r(12)*6)|0][0]);d.gold=1500+Math.floor(r(13)*1500)}
    return it}
  return _lf.apply(this,arguments)}}
// the danger zones hold a few gems on the ground
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L)try{hgdsBuild(L);
  // three gems lying in danger zones
  const dz=L._hgdp.zones.filter(z=>z.type==='danger'&&!z.boss),rnd=hgdmRng(475004),open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  ['hgdgem_ruby','hgdgem_emerald','hgdgem_amber','hgdgem_amethyst','hgdgem_pearl','hgdgem_sapphire'].slice(0,3).forEach((g,i)=>{const z=dz[(i*5+2)%dz.length];for(let t=0;t<400;t++){const x=z.x-z.r+((rnd()*2*z.r)|0),y=z.y-z.r+((rnd()*2*z.r)|0);if(open(x,y)&&Math.hypot(x-z.x,y-z.y)<=z.r-3&&!occ.has(x+','+y)){L.items.push({k:g,x,y});occ.add(x+','+y);break}}})
  }catch(e){console.error('hgds',e)}}}
