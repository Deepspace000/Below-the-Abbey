/* ==========================================================================
   THE DEEPER HOLLOW, STAGE 2: THE PEOPLE (prefix hgdp / HGDP). Eight towns (safe, one per biome), four lone enclaves (a room or clearing each) and eight shopkeepers' stalls;
   twelve quest givers; sixteen signed danger zones full of underground creatures (slugs, jellies, worms, big bugs, spiders, beetles). The people stay in the safe places and often warn about
   the danger zones. They speak the Hollow tongue of the grasslands plus a deep dialect of maze words, learned by asking about a word heard twice (glossary: Grassland Tongue).
   Runs after the maze is built (wraps hgdBuild of hgd_maze.js).
   ========================================================================== */
/* ---------- the creatures of the deep (pictures already in the game) ---------- */
Object.assign(ENEMY_DEF,{
  hgdslug:{name:'Hollow Slug',hp:150,dmg:[9,16],hit:.74,w:1.3,img:'hgtb_pearlslug',xp:150,gold:[0,10],speed:1,verb:'smears'},
  hgdjelly:{name:'Hollow Jelly',hp:110,dmg:[10,17],hit:.78,w:1.2,img:'hgtb_creamjelly',xp:160,gold:[0,10],speed:1,verb:'stings'},
  hgdworm:{name:'Hollow Worm',hp:190,dmg:[11,19],hit:.78,w:1.5,img:'hgtb_jadeeel',xp:210,gold:[0,14],speed:1,verb:'bites'},
  hgdbug:{name:'Big Bug',hp:230,dmg:[12,21],hit:.8,w:1.7,img:'hg_ins6',xp:240,gold:[0,16],speed:1,verb:'impales'},
  hgdspider:{name:'Cave Spider',hp:170,dmg:[10,18],hit:.8,w:1.3,img:'hgtb_spindlespider',xp:200,gold:[0,12],speed:1,verb:'bites'},
  hgdbeetle:{name:'Lantern Beetle',hp:200,dmg:[9,17],hit:.76,w:1.2,img:'hgtb_lanternbeetle',xp:190,gold:[0,12],speed:1,verb:'butts'}});
const HGDP_KIND={hgdslug:'slug',hgdjelly:'jelly',hgdworm:'worm',hgdbug:'bug',hgdspider:'spider',hgdbeetle:'beetle'};
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0&&HGDP_KIND[e.t]){const k='hgdk_'+HGDP_KIND[e.t];G.flags[k]=(G.flags[k]||0)+1}
  if(was&&e.hp<=0&&e.t==='hgdwarden')G.flags.hgdWardenDead=1}}
/* ---------- the deep dialect: words of the maze, learned by asking ---------- */
const HGDP_WORDS=['maze','corridor','hedge','key','gem','door','secret','danger','safe','slug','jelly','worm','bug','lantern','honey','shell','sand','stone','treasure','lost','turn','path','sign','pond','tree','atrium','warden','quarter','town','shop','map','dark'];
const HGDP_CON='xcsrngdxcsrxcsngdltmz',HGDP_VOW='aeeoaeio';
const HGD_LEX={};
for(const w of HGDP_WORDS){let s=0;for(let i=0;i<w.length;i++)s=(s*31+w.charCodeAt(i)+7)|0;const n=Math.max(3,Math.min(7,w.length));let o='',vv=0,cc=0;
  for(let i=0;i<n;i++){const r=hash2(s,i*7+n,91);let v=r<.36;if(vv>=1&&hash2(s,i*5+n,92)>.1)v=false;else if(cc>=3)v=true;else if(i===0&&r<.25)v=false;
    const p=hash2(s,i*13+n,93);o+=v?HGDP_VOW[(p*HGDP_VOW.length)|0]:HGDP_CON[(p*HGDP_CON.length)|0];if(v){vv++;cc=0}else{cc++;vv=0}}
  HGD_LEX[w]=o}
const hgdKnown=w=>!!(G.flags.hgdWords&&G.flags.hgdWords[w]);
// the text as the party hears it: a deep word not yet learned is its Hollow word; each word counts once for a text
function hgdSay(text,noCount){
  const F=G.flags,S=F.hgdSeen||(F.hgdSeen={}),cnt={};
  return text.replace(/[A-Za-z]+/g,w=>{const k=w.toLowerCase();let b=k;
    if(!Object.prototype.hasOwnProperty.call(HGD_LEX,b)){if(k.endsWith('s')&&Object.prototype.hasOwnProperty.call(HGD_LEX,k.slice(0,-1)))b=k.slice(0,-1);else return w}
    if(hgdKnown(b))return w;
    if(!noCount&&!cnt[b]){cnt[b]=1;S[b]=(S[b]||0)+1}
    const o=HGD_LEX[b]+(b!==k?'x':'');return w[0]===w[0].toUpperCase()?o[0].toUpperCase()+o.slice(1):o})}
const hgdCands=()=>{const S=G.flags.hgdSeen||{};return Object.keys(S).filter(w=>S[w]>=2&&!hgdKnown(w)).sort((a,b)=>S[b]-S[a]||(a<b?-1:1)).slice(0,4)};
// a dialogue node of the deep people: plain is the English; opts a list of options; again() makes the node afresh (after a word is learned)
function hgdNode(plain,opts,again){
  const nd=say(hgdSay(plain),opts.slice());
  if(hgdCands().length)nd.opts.splice(Math.max(0,nd.opts.length-1),0,['Ask about a word.',()=>say('Which word?',hgdCands().map(w=>[HGD_LEX[w],()=>hgdPuzzle(w,again||(()=>nd))]).concat([['Never mind.',()=>nd]]))]);
  return nd}
function hgdPuzzle(w,again){
  const pool=HGDP_WORDS.filter(k=>k!==w&&!hgdKnown(k)).sort(()=>Math.random()-.5).slice(0,2),all=[w].concat(pool).sort(()=>Math.random()-.5),opts=[],node=say('They point and say the word again: "'+HGD_LEX[w]+'". What does it mean?',opts);
  all.forEach(o=>opts.push([o,()=>{if(o!==w)return say('They shake their head. That is not what it means. Try again.',opts);
    (G.flags.hgdWords||(G.flags.hgdWords={}))[w]=1;msg('You learned: '+HGD_LEX[w]+' = '+w+'.','#a8e8c0');return again()}]));
  opts.push(['Never mind.',()=>again()]);return node}
/* the glossary page also lists the words of the deep dialect */
{const _gk=hgGlossKnown;hgGlossKnown=function(){return _gk.apply(this,arguments).concat(Object.keys(G.flags.hgdWords||{})).sort()}}
/* ---------- the quests ---------- */
const HGDP_T=['Hedgefoot','Cairnhold','Combwick','Nacre Landing','Dunewell','Blue Lantern','Tessera','Gildmere']; // one town in each of the eight biomes
const HGDP_FOLK=[['hg_npc1','Warden Pell'],['hg_npc2','Mother Brask'],['hg_npc3','Tuck the Lamplighter'],['hg_npc4','Old Orm'],['hg_npc5','Seeker Yll'],['hg_npc1','Ferrik the Mender'],['hg_npc2','Nessa Longstep'],['hg_npc3','Brother Dun'],['hg_npc4','Hob the Tileman'],['hg_npc5','Ostrel the Gilder'],['hg_npc1','Madam Voss'],['hg_npc2','Quill the Surveyor']];
// id, giver index, town/enclave index (0..7 towns, 8..11 enclaves), kind, needs, title, offer text, done text
const HGDP_QS=[
 ['dq1',0,0,'fetch',{item:'hgdlantern',n:1},'The Lost Lantern','The old hedge lantern was lost when a slug nest swallowed the lower path. Bring it back from the danger beyond the signs, and the whole town can see its way again.','The lantern! Look at the glass, not even cracked. Take this, and thank you.'],
 ['dq2',1,1,'kill',{kind:'slug',n:6},'Slugs in the Stone','Hollow slugs have eaten through the stone corridors, and the walls are soft where they crawl. Kill 6 of them.','The walls are stiff again. You have done the town a great kindness.'],
 ['dq3',2,2,'fetch',{item:'hgcomb',n:4},'Comb for the Queen\'s Feast','We keep the honey feast every year in the honeycomb quarter. We are short of 4 pieces of honeycomb. There is some lying in the open corridors.','Honeycomb, and good comb too. The feast is saved.'],
 ['dq4',3,3,'kill',{kind:'jelly',n:5},'Jellies in the Shell Galleries','Hollow jellies float through the shell galleries and sting whoever they touch. Kill 5 of them, and be careful, they are slow but they hurt.','Five jellies gone! The galleries can breathe again.'],
 ['dq5',4,4,'fetch',{item:'hgpond',n:3},'Water for the Well','The sandstone quarter is dry. Bring 3 flasks of pond water from the ponds in the atriums, and the well-keeper will refill the well.','Pond water! The well is full again. Drink deep.'],
 ['dq6',5,5,'kill',{kind:'worm',n:4},'Worms in the Blue Quarter','Hollow worms have tunnelled under the Blue Quarter and lamps keep going out. Kill 4 of them.','The lamps burn steadily again. The Blue Quarter thanks you.'],
 ['dq7',6,6,'fetch',{item:'hgdshard',n:5},'Shards for the Mosaic','A great mosaic was smashed by something large. Bring back 5 mosaic shards from the danger beyond the signs.','All five shards, and they fit together. The mosaic will be whole again.'],
 ['dq8',7,7,'fetch',{item:'hgjelly',n:2},'Jelly for the Gilder','The gilder needs 2 jars of royal jelly to mix the gold paint. Bring them, and be paid in gold.','Royal jelly! The gold will shine again.'],
 ['dq9',8,8,'kill',{kind:'bug',n:5},'Big Bugs at the Door','Big bugs have been scratching at the door of my room. Kill 5 of them, so a person can sleep.','Quiet at last. Take this, with my thanks.'],
 ['dq10',9,9,'fetch',{item:'hgroot',n:4},'Roots for the Pot','The old woman in the clearing needs 4 water-lily roots for her soup. They grow in the pond corridors.','Water-lily roots! The soup will be fit for a warden.'],
 ['dq11',10,10,'visit',{n:4},'The Road of Towns','The surveyor wants the maze walked, from town to town. Visit 4 of the eight towns of the maze, and tell her what you saw.','Four towns walked. I will mark them on the map. Good work.'],
 ['dq12',11,11,'warden',{n:1},'The Warden in the Dark','The Hollowed Warden sits in the great atrium at the top of the maze, and the corruption comes from it. Kill it, and the maze can breathe.','The warden is dead! The maze will heal. We are in your debt.']];
for(const [id,i,,kind,need,title,offer,done] of HGDP_QS){const g=HGDP_FOLK[i];
  const goal=kind==='fetch'?()=>bagCount(need.item):kind==='kill'?q=>(G.flags['hgdk_'+need.kind]||0)-(q.base||0):kind==='visit'?()=>Object.keys(G.flags.hgdVisited||{}).length:()=>G.flags.hgdWardenDead?1:0;
  QUESTS[id]={title,who:g[1],desc:offer,need:need.n,goal,reward:{gold:300+i*60,xp:1500+i*220,items:i%3===0?['potion3']:i%3===1?['hgcomb','hgjelly']:['potion3','hgjelly']}};
  if(kind==='fetch')QUESTS[id].take={[need.item]:need.n};
  if(kind==='kill')QUESTS[id].cnt='hgdk_'+need.kind;
  QAREA[id]='The Deeper Hollow'}
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes('The Deeper Hollow'))QAREA_ORDER.push('The Deeper Hollow');
ITEMDEF.hgdlantern={n:'Lost Lantern',k:'quest',t:'Quest item',ic:'ore',c:'#e8c060',stack:0,price:0,d:'The old lantern of Hedgefoot. The glass is whole.',sw:.5};
ITEMDEF.hgdshard={n:'Mosaic Shard',k:'quest',t:'Quest item',ic:'ore',c:'#60a8e8',stack:1,price:0,d:'A piece of a smashed mosaic, bright blue.',sw:.2};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('hgdlantern','hgdshard');
/* ---------- the people talk ---------- */
const HGDP_WARN=['Stay out of the signed places. Whatever lives in there has not seen a friendly face in a long time.','If you see a sign, turn back. The signs are put up by people who did not.','The danger is the same in every quarter: past the signs, the creatures are thick, and they do not stop.','We keep to the safe corridors, and the safe corridors keep us.','Never walk the maze at night without a lantern, and never past a sign.'];
const HGDP_GOSS=['The maze changes its walls as you go deeper. Hedge, then stone, then honeycomb, then shell, and on up.','Every town has its own way of doing things, but we all agree about the danger.','A secret door is only a door that has not been found yet. They say the quarters are full of them.','There is treasure hidden in the corners of the maze, and also a good deal of death.','A key is worth more than a sword here. Half the doors in the maze are locked.'];
const HGDP_SHOPS={ // town index -> [name, stock, speech]
  0:['Marl, the Hedgefoot grocer',[['bread',6],['cheese',4],['water',6],['hgcomb',6],['hggrubs',5],['torch',4],['potion',4]],'Everything for the road into the maze. Mind the signs.'],
  1:['Dwen, the stone-smith',[['hgsting',1],['hgmandible',1],['hgbarb',1],['hgcarapace',1],['ar_hgchit_h',1],['ar_hgchit_c',1],['ar_hgchit_a',1],['ar_hgchit_l',1]],'Chitin and wax, worked into proper gear. Nothing but the best for the danger ahead.'],
  2:['Sela, the comb-seller',[['hgcomb',10],['hgjelly',6],['hggrubs',6]],'Honey and jelly, fresh from the combs.'],
  3:['Pearla, the shell-trader',[['hgkelp',6],['hgroot',6],['hgpond',6],['bubblehelm',2]],'From the shell galleries: kelp, roots and water.'],
  4:['Hask, the well-keeper',[['water',8],['hgpond',8],['dates',6],['antidote',4]],'Water is worth more than gold in the sandstone quarter.'],
  5:['Ilse, the apothecary',[['potion2',4],['healdraught',4],['manadraught',4],['greatermana',2],['antidote',4],['salve',4]],'Healing, and mana for those who need it.'],
  6:['Tomm, the tile-trader',[['potion3',3],['greaterheal',3],['superiorheal',2],['manadraught',4]],'Tiles, glue, and potions for the tired.'],
  7:['Orbin, the gold-trader',[['potion3',4],['superiorheal',3],['elixir',1],['greatermana',3],['supermana',2]],'The finest. Gold only.']};
/* ---------- the zones, the people and the creatures: placed on the built level ---------- */
const HGDP_DANGER=[['The Slug Run','slug'],['The Jelly Pits','jelly'],['The Worm Warrens','worm'],['The Bug Nest','bug'],['Spider Hollow','spider'],['The Beetle Pits','beetle'],['The Black Drip','slug'],['The Gnaw Halls','worm'],['The Pale Dark','jelly'],['The Hollow Throat','bug'],['The Mire Cut','slug'],['The Silk Tangle','spider'],['The Lantern Pit','beetle'],['The Mixed Dark','mixed'],['The Quiet Gnawing','worm'],['The Sting Gallery','jelly']];
const HGDP_KINDS={slug:['hgdslug','hgdslug','hgdgrub'],jelly:['hgdjelly','hgdjelly','hgdswarm'],worm:['hgdworm','hgdworm','hgdgrub'],bug:['hgdbug','hgdbug','hgdguard'],spider:['hgdspider','hgdspider','hgdswarm'],beetle:['hgdbeetle','hgdbeetle','hgdguard'],mixed:['hgdslug','hgdjelly','hgdworm','hgdbug','hgdspider','hgdbeetle']};
khNpc('hgd_sign','A warning sign','gate',()=>{const d=G.talk&&G.talk.d,z=d&&d.zone!==undefined?L_ZONES()[d.zone]:null;return say(hgdSay('DANGER. '+(z?z.name:'The danger')+' lies ahead. '+(z?'Slugs, jellies, worms and bugs':'Creatures')+' live beyond this sign, and they do not stop. Turn back.'),[BYE])});
const L_ZONES=()=>{const L=LEVELS[HGD.ID];return L&&L._hgdp?L._hgdp.zones.filter(z=>z.type==='danger'):[]};
function hgdpBuild(L){
  if(L._hgdp)return;const M=L._hgdm,W=M.W,H=M.H,rows=L.rows,rnd=hgdmRng(475002),bio=M.bio,kind=M.kind;
  const open=(x,y)=>rows[y]&&rows[y][x]==='.',used=new Set();
  for(const d of L.decor)used.add(d.x+','+d.y);
  const zones=[],safeHit=(x,y,m)=>zones.some(z=>z.type==='safe'&&Math.hypot(z.x-x,z.y-y)<=z.r+(m||0));
  // eight towns: the biggest open place of each biome nearest its middle (atriums first)
  const byB=b=>M.spots.filter(s=>s.type===3&&!s.boss&&bio[s.y*W+s.x]===b);
  const town=[];
  for(let b=0;b<8;b++){let c=byB(b);if(!c.length)c=M.spots.filter(s=>s.type>=1&&!s.boss&&bio[s.y*W+s.x]===b&&Math.hypot(s.x-M.sx,s.y-M.sy)>(b===0?16:0));
    if(b===0)c=M.spots.filter(s=>s.type>=1&&!s.boss&&bio[s.y*W+s.x]===0&&Math.hypot(s.x-M.sx,s.y-M.sy)>=14).sort((p,q)=>Math.hypot(p.x-M.sx,p.y-M.sy)-Math.hypot(q.x-M.sx,q.y-M.sy));
    const s=c.sort((p,q)=>(b===0?0:(q.cells-p.cells)))[0]||M.spots.find(z=>bio[z.y*W+z.x]===b);town.push(s);
    zones.push({type:'safe',x:s.x,y:s.y,r:13,name:HGDP_T[b],town:b})}
  // the start is safe too
  zones.push({type:'safe',x:M.sx,y:M.sy,r:9,name:'The Foot of the Maze'});
  // four lone enclaves: a room or clearing away from every town
  const encl=[];const ENN=['The Quiet Room','The Lamp Clearing','The Pond Enclave','The Reading Room','The Rest Stop','The Sleeping Nook','The Lantern Landing','The Mossy Corner','The Waiting Room','The Safe Hollow'];
  for(const s of M.spots.filter(z=>(z.type===1||z.type===2)&&!z.boss).sort(()=>rnd()-.5)){if(encl.length>=10)break;if(zones.some(z=>z.type==='safe'&&Math.hypot(z.x-s.x,z.y-s.y)<24))continue;if(encl.some(e=>Math.hypot(e.x-s.x,e.y-s.y)<32))continue;encl.push(s);zones.push({type:'safe',x:s.x,y:s.y,r:7,name:ENN[encl.length-1],enclave:encl.length-1})}
  // sixteen signed danger zones, far from safe places and from each other
  const dz=[];let tries=0;
  while(dz.length<HGDP_DANGER.length&&tries++<9000){const x=6+((rnd()*(W-12))|0),y=6+((rnd()*(H-12))|0),R=10+((rnd()*6)|0);
    if(!open(x,y)||Math.hypot(x-M.sx,y-M.sy)<R+26||safeHit(x,y,R+9)||dz.some(z=>Math.hypot(z.x-x,z.y-y)<z.r+R+8))continue;
    const b=bio[y*W+x];dz.push({type:'danger',x,y,r:R,name:HGDP_DANGER[dz.length][0],mon:HGDP_DANGER[dz.length][1],biome:b})}
  dz.forEach(z=>zones.push(z));
  const top=M.spots.find(s=>s.boss);zones.push({type:'danger',x:top.x,y:top.y,r:13,name:'The Black Hall',mon:'mixed',boss:true,biome:7});
  // creatures only in the danger zones: the scattered ones from stage 1 are removed
  L.enemies=L.enemies.filter(e=>e.t==='hgdwarden');
  const dzs=zones.filter(z=>z.type==='danger');
  dzs.forEach((z,zi)=>{const cells=[];for(let y=Math.max(2,z.y-z.r);y<=Math.min(H-3,z.y+z.r);y++)for(let x=Math.max(2,z.x-z.r);x<=Math.min(W-3,z.x+z.r);x++)if(open(x,y)&&Math.hypot(x-z.x,y-z.y)<=z.r&&!used.has(x+','+y)&&!safeHit(x,y,4))cells.push([x,y]);
    const n=Math.max(10,Math.min(24,(cells.length/14)|0)),ks=HGDP_KINDS[z.mon];z.n=0;
    for(let k=0;k<n&&cells.length;k++){const j=(rnd()*cells.length)|0,c=cells.splice(j,1)[0];used.add(c[0]+','+c[1]);L.enemies.push({t:ks[(rnd()*ks.length)|0],x:c[0],y:c[1]});z.n++}
    // the signs: on the corridors that cross the edge of the zone, a few, well spaced
    const edge=[];for(let y=Math.max(2,z.y-z.r-1);y<=Math.min(H-3,z.y+z.r+1);y++)for(let x=Math.max(2,z.x-z.r-1);x<=Math.min(W-3,z.x+z.r+1);x++){const d=Math.hypot(x-z.x,y-z.y);if(d>=z.r+.4&&d<z.r+1.5&&open(x,y)&&!used.has(x+','+y)&&!(kind[y*W+x]))edge.push([x,y,Math.atan2(y-z.y,x-z.x)])}
    edge.sort((p,q)=>p[2]-q[2]);const sg=[];for(const e of edge){if(sg.length>=7)break;if(sg.every(s=>Math.hypot(s[0]-e[0],s[1]-e[1])>=6)){sg.push(e);used.add(e[0]+','+e[1]);const kp=KH_KEEPERS.hgd_sign;L.decor.push({k:khFaceKey(kp.face),x:e[0],y:e[1],block:false,walk:true,npc:'hgd_sign',zone:zi,sc:.8})}}
    z.signs=sg.length});
  // quest items placed in the right zones
  const inZone=zi=>{const z=dzs[zi];const c=[];for(let y=z.y-z.r;y<=z.y+z.r;y++)for(let x=z.x-z.r;x<=z.x+z.r;x++)if(open(x,y)&&Math.hypot(x-z.x,y-z.y)<=z.r-2&&!used.has(x+','+y)&&!safeHit(x,y,3))c.push([x,y]);return c};
  const nearZ=(biome)=>{let b=dzs.findIndex(z=>z.biome===biome&&!z.boss);return b<0?0:b};
  {const zi=nearZ(0),c=inZone(zi);if(c.length){const p=c[(rnd()*c.length)|0];used.add(p[0]+','+p[1]);L.items.push({k:'hgdlantern',x:p[0],y:p[1]})}}
  {const zi=nearZ(6),c=inZone(zi);for(let k=0;k<7&&c.length;k++){const p=c.splice((rnd()*c.length)|0,1)[0];used.add(p[0]+','+p[1]);L.items.push({k:'hgdshard',x:p[0],y:p[1]})}}
  // food and finds in the quiet corridors and clearings (never in the zones)
  const quiet=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++)if(open(x,y)&&!used.has(x+','+y)&&!dzs.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+1))quiet.push([x,y]);
  for(const it of ['hgcomb','hgcomb','hgcomb','hgcomb','hgpond','hgpond','hgpond','hgpond','hgroot','hgroot','hgroot','hgroot','hgjelly','hgjelly','hgjelly','hgkelp','hgkelp'])for(let k=0;k<2;k++){const p=quiet.splice((rnd()*quiet.length)|0,1)[0];if(!p)break;used.add(p[0]+','+p[1]);L.items.push({k:it,x:p[0],y:p[1]})}
  // the people
  const place=(z,img,npc,name,dx,dy)=>{const cands=[];for(let r=0;r<8&&!cands.length;r++)for(let y=z.y-r;y<=z.y+r;y++)for(let x=z.x-r;x<=z.x+r;x++){if(Math.max(Math.abs(x-z.x),Math.abs(y-z.y))!==r)continue;if(!open(x,y)||used.has(x+','+y))continue;let all=true;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if(!open(x+ax,y+ay)||used.has((x+ax)+','+(y+ay))&&!(ax===0&&ay===0))all=false;if(all)cands.push([x,y])}
    const c=cands[((dx*3+dy*5)&15)%Math.max(1,cands.length)]||cands[0];if(!c)return null;used.add(c[0]+','+c[1]);L.decor.push({k:img,x:c[0],y:c[1],block:true,npc,sc:1});return c};
  const folk=[],safeZ=zones.filter(z=>z.type==='safe');
  const towns=safeZ.filter(z=>z.town!==undefined),encls=safeZ.filter(z=>z.enclave!==undefined);
  // quest givers: eight in the towns, four in the enclaves
  HGDP_QS.forEach(([id,gi,zi],qi)=>{const z=zi<8?towns[zi]:encls[zi-8];if(!z)return;const g=HGDP_FOLK[gi],npc='hgd_q'+qi;
    const c=place(z,g[0],npc,g[1],qi,1);if(c)folk.push({npc,qi,zone:z.name})});
  // shopkeepers in the towns
  for(const b in HGDP_SHOPS){const z=towns[b];if(!z)continue;const c=place(z,'hg_npc'+(1+(b%5)),'hgd_shop'+b,HGDP_SHOPS[b][0],+b+3,2);if(c)folk.push({npc:'hgd_shop'+b,shop:+b,zone:z.name})}
  encls.slice(4).forEach((z,i)=>{const npc='hgd_rest'+i,c=place(z,'hg_npc'+(1+(i%5)),npc,'A traveller',i+7,3);if(c)folk.push({npc,rest:i,zone:z.name})});
  L._hgdp={zones,towns:towns.map(z=>z.name),folk,dzs:dzs.length}}
const HGDP_REST=['Sit a while. This is a safe place, and the safe places are few.','I have walked three quarters of the maze, and I keep to the safe places. So should you.','If a wall is a shade off from its neighbours, walk into it. Half the secrets of this place are hidden that way.','There is a door ahead that wants a key, and another that wants a gem. I have never found either. Ask in the towns.','The towns sell keys, and some of the shops sell gems. They are not cheap.'];
for(let i=0;i<6;i++)khNpc('hgd_rest'+i,'A traveller','hg_npc'+(1+(i%5)),d=>{const nodeFn=()=>hgdNode(HGDP_REST[i%HGDP_REST.length]+' '+HGDP_WARN[i%HGDP_WARN.length],[['Anything else?',()=>hgdNode(HGDP_GOSS[(i+1)%HGDP_GOSS.length],[BYE],nodeFn)],BYE],nodeFn);return nodeFn()});
// the quest givers and shopkeepers speak
HGDP_QS.forEach(([id,gi,zi,kind,need,title,offer,done],qi)=>{const g=HGDP_FOLK[gi],npc='hgd_q'+qi;
  khNpc(npc,g[1],g[0],d=>{const F=G.flags,more=()=>nodeFn(),zn=()=>{const L=LEVELS[HGD.ID],dz=L&&L._hgdp?L._hgdp.zones.filter(z=>z.type==='danger'):[];const me=G.talk&&G.talk.d;let b=dz[0],bd=1e9;for(const z of dz){const dd=Math.hypot(z.x-(me?me.x:0),z.y-(me?me.y:0));if(dd<bd){bd=dd;b=z}}return b?b.name:'the danger zones'};
    const nodeFn=()=>{const st=qSt(id);
      if(st==='done')return hgdNode(done+' '+HGDP_WARN[qi%HGDP_WARN.length]+' Stay out of '+zn()+'.',[['Anything else?',()=>hgdNode(HGDP_GOSS[qi%HGDP_GOSS.length],[BYE],nodeFn)],BYE],nodeFn);
      if(qReady(id))return hgdNode('You have it all. '+(kind==='visit'?'Four towns, then.':'Well done.'),[['Here you go.',()=>{const rw=rewardText(id);qTurnIn(id);return hgdNode(done+' Reward: '+rw+'.',[BYE],nodeFn)}],BYE],nodeFn);
      if(st==='active')return hgdNode(QUESTS[id].desc+' ('+qGoal(id)+' of '+QUESTS[id].need+'.) '+HGDP_WARN[(qi+1)%HGDP_WARN.length],[BYE],nodeFn);
      return hgdNode(offer+' '+HGDP_WARN[qi%HGDP_WARN.length],[['We will help.',()=>{qAccept(id);return hgdNode('Good. '+HGDP_GOSS[qi%HGDP_GOSS.length],[BYE],nodeFn)}],['Not now.',()=>null]],nodeFn)};
    return nodeFn()},{q:[id]})});
for(const b in HGDP_SHOPS){const [name,stock,speech]=HGDP_SHOPS[b];
  khNpc('hgd_shop'+b,name,'hg_npc'+(1+(b%5)),d=>{const nodeFn=()=>hgdNode(speech+' '+HGDP_WARN[(+b+2)%HGDP_WARN.length],[['Trade.',()=>{openShop(G.talk.d,stock,name);return null}],['Anything else?',()=>hgdNode(HGDP_GOSS[(+b)%HGDP_GOSS.length],[BYE],nodeFn)],BYE],nodeFn);return nodeFn()})}
// visiting the towns (for the surveyor), and the wardens' words
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID&&G.state==='play'){const L=LEVELS[HGD.ID];if(L&&L._hgdp){const F=G.flags;for(const z of L._hgdp.zones)if(z.type==='safe'&&z.town!==undefined&&Math.hypot(z.x-G.P.x,z.y-G.P.y)<=z.r){F.hgdVisited=F.hgdVisited||{};if(!F.hgdVisited[z.name]){F.hgdVisited[z.name]=1;msg('You reach '+z.name+'.','#a8e8c0')}}}}}catch(e){}return _u.apply(this,arguments)}}
// build the people when the maze is built
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);if(!had&&LEVELS[HGD.ID])try{hgdpBuild(LEVELS[HGD.ID])}catch(e){console.error('hgdp',e)}}}
