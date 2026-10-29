/* ==========================================================================
   THE PALE SPIRE, PACKAGE 1: THE GATE (prefix psg / PSG). Levels 9720 The Pale Approach (outdoor causeway and barbican), 9721 The Great Gatehouse, 9722 The Winch Loft, 9723 The Porter's Lodge (rest room).
   Numbers (ids, sizes, link squares) come from PSP in ps_ids.js; nothing here repeats them. Notes: tools/PALE_SPIRE_NOTES.md (section Package 1).
   Pictures: painted pieces are IMG['ps_<name>'] (assets/ps, manifest.json); until a piece is painted psgPic() gives a toned stand-in made from an existing picture.
   Part A: ids, items, creatures, pictures, loading, look and light, doors, the interior maker psgMake. Part B: the interiors. Part C: the approach. Part D: people, quests, objects.
   ========================================================================== */
const PSG={ids:[9720,9721,9722,9723],ready:false,loading:null,man:null,_art:0};
const psgIs=n=>n>=9720&&n<=9729;
const psgF=()=>typeof pspF==='function'?pspF():(G.flags.psp||(G.flags.psp={}));
for(const id of PSG.ids){const l=pspLevel(id);if(l){LEVEL_NAMES[id]=l.name;LEVEL_RATING[id]=l.lvl}}
/* ---------- things carried ---------- */
ITEMDEF.pshorn={n:"The Warden's Horn",k:'quest',t:'Quest item',ic:'amulet',c:'#c8c4b8',stack:1,price:0,sw:.4,d:"A long horn of dull horn and tarnished silver, the kind a Road Warden blew to call the watch. It lay on a table in the Winch Loft beside the man who carried it. Captain Dyrwen Harrow of the Road Wardens is in the dungeons of the Pale Spire and would like it back."};
ITEMDEF.pstoken={n:"Pilgrim's Token",k:'quest',t:'Quest item',ic:'ring',c:'#b8b4d0',stack:1,price:0,sw:.05,d:"A small thing left by a pilgrim on the way to the Pale Spire: a ribbon, a button, a bent coin. Nine of them are needed to settle the cairn on the Pale Approach. Merrick Dole the porter will want them."};
ITEMDEF.pskeyring={n:"The Gate Captain's Key Ring",k:'quest',t:'Quest item',ic:'key',c:'#c0c4d8',stack:1,price:0,sw:.3,d:"A heavy ring of iron keys, each tagged with a number. It hung at the belt of the Gate Captain. Merrick Dole the porter has wanted it for years."};
/* ---------- the creatures (pictures: painted ps_<name> when it exists, else a toned stand-in) ---------- */
Object.assign(ENEMY_DEF,{
  psguard:{name:'Pale Guard',hp:84,dmg:[10,16],hit:.87,w:.62,img:'psg_e_guard',xp:34,gold:[0,0],speed:1,verb:'cuts',ps:1},
  pshalberd:{name:'Pale Halberdier',hp:128,dmg:[14,22],hit:.85,w:.7,img:'psg_e_halberd',xp:46,gold:[0,0],speed:.7,verb:'hews',ps:1},
  psarcher:{name:'Pale Archer',hp:70,dmg:[10,16],hit:.88,w:.6,img:'psg_e_archer',xp:38,gold:[0,0],speed:1,ranged:3,verb:'looses an arrow at',ps:1},
  pssentinel:{name:'Veiled Sentinel',hp:150,dmg:[14,22],hit:.86,w:.8,img:'psg_e_sentinel',xp:60,gold:[0,0],speed:1,verb:'strikes',ps:1,still:1,glow:.15,wake:'The veiled statue lifts its head. The cloth over its face does not move, but it is looking at you.'},
  psgatecaptain:{name:'The Gate Captain',hp:520,dmg:[16,26],hit:.9,w:.85,img:'psg_e_captain',xp:1100,gold:[0,0],speed:1,verb:'cleaves',boss:true,aboveParty:0,ps:1,still:1,glow:.25,wake:'The Gate Captain raises his halberd. "None pass the inner gate," he says, in a voice like a door closing.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('psgatecaptain');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('psgatecaptain');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.psgatecaptain=[4200,5200];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^ps(guard|halberd|archer|sentinel)/,'shaken',.12],[/^psgatecaptain/,'shaken',.25]);
/* ---------- pictures ---------- */
/* a picture by name: the painted ps_<name> if loaded, else a toned stand-in made once from src (an IMG key) with a canvas filter */
/* painted = loaded from assets/ps (the kit's own stand-ins, made by pspStand, carry the flag _ps) */
const psgPainted=name=>!!(IMG['ps_'+name]&&!IMG['ps_'+name]._ps);
function psgPic(name,src,filter,h){
  const k='ps_'+name;if(psgPainted(name))return k;
  const sk='psg_s_'+name;if(IMG[sk])return sk;
  if(!src||!IMG[src])return IMG.crate?'crate':k;
  if(!bl3Tint(sk,src,filter||'saturate(.2) brightness(1.25)',h))return src;
  if(h)NPC_H[sk]=h;return sk}
const PSG_PALE='saturate(.14) brightness(1.32) contrast(.95)';
function psgArt(){
  if(PSG._art)return;PSG._art=1;
  try{gyAlias()}catch(e){}
  const E=(key,name,src,filter,h)=>{const k='ps_c_'+name;if(psgPainted('c_'+name)){IMG[key]=IMG[k]}else bl3Tint(key,src,filter||PSG_PALE,h);
    const t=Object.keys(ENEMY_DEF).find(t=>ENEMY_DEF[t].img===key),im=IMG[key];if(t&&im)ENEMY_DEF[t].w=+(h*im.width/im.height).toFixed(2);if(im)NPC_H[key]=h};
  E('psg_e_guard','psguard','kh_ohsold1_0',PSG_PALE+' hue-rotate(215deg)',1.12);
  E('psg_e_halberd','pshalberd','kh_ohsold1_2',PSG_PALE+' hue-rotate(215deg)',1.3);
  E('psg_e_archer','psarcher','kh_ohsold1_4',PSG_PALE+' hue-rotate(215deg)',1.1);
  E('psg_e_sentinel','pssentinel','gy_angel','saturate(.1) brightness(1.5) contrast(.9) hue-rotate(200deg)',1.7);
  E('psg_e_captain','psgatecaptain','gyp_boss_2','saturate(.15) brightness(1.4) hue-rotate(215deg)',1.7);
  if(psgPainted('p_porter')&&KH_KEEPERS.psg_porter){KH_KEEPERS.psg_porter.face='ps_p_porter';NPC_H.ps_p_porter=NPC_H.ps_p_porter||1.0}
  psgFloors()}
/* floors made from the engine's own stone and grass, drained of colour and given a violet cast */
function psgTone(out,src,gain,tint,sat){
  if(FLOORS[out])return out;const b=FLOORS[src];if(!b)return src;const d=new Uint8ClampedArray(b.length);
  for(let i=0;i<d.length;i+=4){const l=b[i]*.3+b[i+1]*.59+b[i+2]*.11;
    for(let c=0;c<3;c++)d[i+c]=Math.min(255,(l+(b[i+c]-l)*sat)*gain*tint[c]);d[i+3]=255}
  FLOORS[out]=d;return out}
function psgFloors(){
  if(PSG._fl)return;PSG._fl=1;try{gyFloors()}catch(e){}
  psgTone('psf_grass','gyf_grass',1.05,[.98,1.03,1.0],.3);        // 0 pale grey-green lawn
  psgTone('psf_gravel','gyf_gravel',1.5,[1.0,.99,1.08],.1);        // 1 white gravel
  psgTone('psf_flag','gyf_flag',1.35,[1.0,.99,1.1],.1);            // 2 pale flagstones
  psgTone('psf_cobble','gyf_cobble',1.0,[1.0,.88,.95],.35);         // 3 the approach: cobbles with a red cast
  psgTone('psf_slate','gyf_slate',.9,[.95,.93,1.12],.15);           // 4 dark slate
  psgTone('psf_dust','gyf_dirt',1.2,[1.0,.96,1.0],.2);              // 5 pale dust
  psgTone('psf_flagdark','gyf_flag',.85,[.95,.93,1.1],.12);         // 6 darker flags
  if(!FLOORS.psf_grate&&FLOORS.psf_slate){const b=FLOORS.psf_slate,N=Math.round(Math.sqrt(b.length/4)),d=new Uint8ClampedArray(b);   // the murder-hole floor: a grating over a dark drop
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,bar=(x%16<3)||(y%16<3),v=bar?120:12;d[i]=v*.9;d[i+1]=v*.9;d[i+2]=v*1.15}
    FLOORS.psf_grate=d}}
/* ---------- loading ---------- */
async function psgLoadOwn(){
  try{PSG.man=await (await fetch('assets/ps/manifest.json?v='+VERSION)).json()}catch(e){PSG.man={}}
  await Promise.all(Object.keys(PSG.man||{}).map(k=>IMG['ps_'+k]?0:loadImg('ps_'+k,'assets/ps/'+PSG.man[k].file).catch(()=>0)));
  for(const k of Object.keys(PSG.man||{}))if(PSG.man[k].h_cells)NPC_H['ps_'+k]=PSG.man[k].h_cells}
function psgLoad(){
  if(PSG.loading)return PSG.loading;
  PSG.loading=Promise.all([typeof wlLoad==='function'?wlLoad():0,typeof khLoadAssets==='function'?khLoadAssets():0,psgLoadOwn()]).then(()=>{try{psgArt()}catch(e){console.error('psgArt',e)}PSG.ready=true}).catch(e=>{console.error('psgLoad',e);PSG.ready=true});
  return PSG.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(psgIs(n)&&!PSG.ready){if(!PSG._wait){PSG._wait=1;try{msg('The Pale Lands come into view...','#d8d8f0')}catch(e){}psgLoad().then(()=>{PSG._wait=0;goToLevel(n,entry)})}return}
  if(psgIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('psg build',n,e)}
  const r=_g.call(this,n,entry);
  try{if(psgIs(n)&&typeof psgArrive==='function')psgArrive(n)}catch(e){console.error('psgArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(psgIs(n)&&!PSG.ready){if(!PSG._wait){PSG._wait=1;psgLoad().then(()=>{PSG._wait=0;jumpToLevel(n,target)})}return}
  if(psgIs(n)&&target<100)target=100;
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&psgIs(sv.level)&&!PSG.ready){if(!PSG._wait){PSG._wait=1;psgLoad().then(()=>{PSG._wait=0;restore(sv)})}return}
  if(sv&&psgIs(sv.level)&&!LEVELS[sv.level]&&KH_LAZY[sv.level])try{KH_LAZY[sv.level]()}catch(e){console.error('psg restore',e)}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(psgIs(LEVEL)&&typeof psgArrive==='function')psgArrive(LEVEL)}catch(e){console.error('psg restoreNow',e)}return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||psgIs(n)}}
/* ---------- the look: a storm sky of red and violet over the approach, still air indoors ---------- */
{const _w=weatherNow;weatherNow=function(){
  if(psgIs(LEVEL)){const L=LEVELS[LEVEL];
    if(L&&L.outdoor)return {id:'fog',n:'Violet storm glow',fog:.01,haze:.4,dark:.95,mix:.4,col:[150,96,156],fx:'fog',text:'A low sky of violet cloud with a red glow under it, and no wind on the ground. Ash-pale motes fall very slowly. The road ahead is lit by small lamps.'};
    return null}
  return _w.apply(this,arguments)}}
/* the sky engine of the Blighted Road (blight_sky.js) paints the storm over 9720; keep it dry */
{const _u=update;update=function(dt){try{if(typeof BKS!=='undefined'){if(LEVEL===9720&&G.state==='play'){if(!BKS.force||BKS._psg){BKS.force=[0,0];BKS._psg=1}}else if(BKS._psg){BKS.force=null;BKS._psg=0}}}catch(e){}return _u.apply(this,arguments)}}
{const _dw=drawWeatherFx;drawWeatherFx=function(){_dw.apply(this,arguments);
  try{if(psgIs(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor&&G.state==='play'){const t=G.time;ctx.save();ctx.fillStyle='rgba(230,220,245,.55)';
    for(let i=0;i<46;i++){const x=((i*61+t*5+Math.sin(t*.4+i)*9)%440)-10,y=((i*37+t*9*(1+(i%4)*.2))%230)-10;ctx.fillRect(x,y,1.4+(i%3)*.5,1.4+(i%3)*.5)}ctx.restore()}}catch(e){}}}
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(psgIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psg;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=V.kI||(L.outdoor?1.2:1.35);l.range2=V.range2||(L.outdoor?80:110);l.calm=true}
      if(V.torches&&V.torch){gyFlames();const T=V.torch;
        for(const [x,y,f,nar] of V.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}}catch(e){console.error('psg lights',e)}
  return r}}
/* chests: potions, mana, gear, a ring and gold, as strong as the rating of the place */
{const _lf=lootFor;lootFor=function(d){
  if(psgIs(LEVEL)&&d&&CONTAINERS.includes(d.k)){
    const r=q=>hash2(d.x,d.y,700+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<2;q++)add(potionFor(r(10+q)),1);add('supermana',1);if(r(2)<.5)add('elixir',1);
    const a=typeof armourDrop==='function'?armourDrop(r(20)):null;if(a&&r(6)<.7)add(a);
    if(typeof ringFor==='function'&&r(3)<.4)add(ringFor(r(4),100));
    d.gold=(d.goldAmt||0)||3400+Math.floor(r(5)*2600);return items}
  return _lf.apply(this,arguments)}}
/* ---------- doors: a link of PSP.LINKS as a door tile ---------- */
function psgDoorFor(l){
  return {lvl:l.to,psg:1,name:l.name,get at(){if(!LEVELS[l.to]&&KH_LAZY[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}return {x:l.land[0],y:l.land[1],f:l.land[2]}}}}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psg){
    if(d.say){sfx('locked');msg(d.say,'#c8c8e0');return true}
    if(!LEVELS[d.lvl]&&!KH_LAZY[d.lvl]){sfx('locked');msg('This way is not open yet.','#c8c8e0');return true}
    sfx('door');goToLevel(d.lvl,d.at);return true}
  return _k.apply(this,arguments)}}
/* ---------- the interior maker (the vault's vtMake, with tall pale walls) ---------- */
const PSG_SPEC={};
function psgArchTile(WH,tag,RG){
  return gyTile('texGrey_0',WH,{gain:RG.gain,rgb:RG.rgb,tag:'psarch'+tag,draw:(x,w,h)=>{
    x.beginPath();x.moveTo(24,h);x.lineTo(24,h*.46);x.quadraticCurveTo(24,h*.12,64,h*.05);x.quadraticCurveTo(104,h*.12,104,h*.46);x.lineTo(104,h);x.closePath();
    const g=x.createLinearGradient(0,h*.05,0,h);g.addColorStop(0,'#5a4a98');g.addColorStop(.6,'#a89ad8');g.addColorStop(1,'#d8d0f0');x.fillStyle=g;x.fill();
    x.fillStyle='#16141e';x.fillRect(26,h*.17,76,6);for(let i=0;i<9;i++){const px=28+i*9;x.fillRect(px,h*.17,3,h*.12);x.beginPath();x.moveTo(px-1,h*.29);x.lineTo(px+4,h*.29);x.lineTo(px+1.5,h*.33);x.fill()}   // the raised portcullis: its teeth hang under the arch
    x.strokeStyle='#2c2a40';x.lineWidth=5;x.stroke()}})}
function psgSlitTile(WH,RG,kind){
  return gyTile('texGrey_1',WH,{gain:RG.gain,rgb:RG.rgb,tag:'psslit'+kind,draw:(x,w,h)=>{
    if(kind==='win'){x.beginPath();x.moveTo(44,h-62);x.lineTo(44,h-132);x.quadraticCurveTo(44,h-170,64,h-186);x.quadraticCurveTo(84,h-170,84,h-132);x.lineTo(84,h-62);x.closePath();
      const g=x.createLinearGradient(0,h-186,0,h-62);g.addColorStop(0,'#3a2a70');g.addColorStop(1,'#8a70c8');x.fillStyle=g;x.fill();x.strokeStyle='#d8d4ec';x.lineWidth=4;x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(64,h-186);x.lineTo(64,h-62);x.moveTo(44,h-118);x.lineTo(84,h-118);x.stroke()}
    else{x.fillStyle='#0c0a16';x.fillRect(60,h-132,8,70);const g=x.createLinearGradient(0,h-132,0,h-62);g.addColorStop(0,'rgba(170,150,240,.0)');g.addColorStop(1,'rgba(190,170,255,.55)');x.fillStyle=g;x.fillRect(62,h-132,4,70)}}})}
/* the landing squares of the links that arrive in a level (the far halves of PSP.LINKS) */
function PSG_LANDS(id){return PSP.LINKS.filter(l=>l.to===id).map(l=>l.land)}
function psgMake(id){
  if(LEVELS[id])return LEVELS[id];
  const S=PSG_SPEC[id];if(!S)throw new Error('psg: no plan for '+id);
  psgArt();
  const W=S.W,H=S.H,WH=S.wh||2.5,hs=(a,b,c)=>hash2(a,b,c+id),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(const r of S.rects)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)g[y][x]='.';
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const RG={gain:S.gain||1.5,rgb:S.rgb||[1.0,.98,1.14]};
  const wt=v=>ch(gyTile('texGrey_'+v,WH,RG)),VAR=[0,3,5,1,2,4,0,3].map(wt),SLIT=ch(psgSlitTile(WH,RG,'slit')),WIN=ch(psgSlitTile(WH,RG,'win'));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    if(!near(x,y)){s+=VAR[0];continue}
    s+=VAR[(hs(x,y,6)*VAR.length)|0]}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),miss=[],V={lcol,col:S.lcol,torch:S.torch,id,kI:S.kI,range2:S.range2};
  const reserved=new Set(),doorSq=[];
  for(const [x,y,k] of (S.wins||[]))if(g[y]&&g[y][x]==='#')put(x,y,k==='win'?WIN:SLIT);
  for(const D of S.doors){
    const l=pspLinkAt(id,D.x,D.y);if(!l)throw new Error('psg '+id+': no link at '+D.x+','+D.y);
    const inner=[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>[D.x+a,D.y+b]).find(([x,y])=>open(x,y));if(!inner)throw new Error('psg '+id+': door '+D.x+','+D.y+' has no floor');
    let gid;
    if(D.kind==='arch')gid=psgArchTile(WH,'a',RG);
    else if(D.kind==='stair')gid=gyTile('texGrey_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.2,rgb:RG.rgb,tag:'psstair'});
    else{const TM=ohTiles(),dt=TM.make('door','wlgrey',WH);gid=KH_NEXT_GID++;T_TILE[gid]=dt.tex}
    {const base=gid;gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[gid]=GY.col[base]}   // one tile id per door (cached art tiles are shared)
    KH_DOOR[gid]=psgDoorFor(l);put(D.x,D.y,ch(gid));doorSq.push([D.x,D.y]);reserved.add(inner[0]+','+inner[1])}
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const raw=(k,x,y,d)=>{d=d||{};if(!open(x,y)){miss.push(k+'@'+x+','+y);return null}
    const o={k,x,y,block:d.block!==undefined?!!d.block:true};if(!o.block){o.walk=true;o.deco=true}
    for(const f of ['sc','npc','hidden','lk','glow','bob','ox','oy','wd','pic','txt','goldAmt'])if(d[f]!==undefined)o[f]=d[f];
    if(d.npc){o.deco=false;o.walk=false;if(o.block)o.solid=1}
    decor.push(o);occ.add(x+','+y);return o};
  const dec=(a,x,y,o)=>raw(GYA[a]?'gy_'+a:a,x,y,o);
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y)=>{if(!open(x,y)||(occ.has(x+','+y)&&!reserved.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:S.diff});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill(S.floorDef||'0'));
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const C={id,S,W,H,open,free,dec,raw,put:(r,x,y,o)=>raw('crate',x,y,o),sign,foe,light,setF,decor,enemies,lights,lcol,occ,V,miss,reserve:(x,y)=>occ.add(x+','+y),
    prop:(name,x,y,o)=>{try{wlinProp(C,name,x,y,o)}catch(e){miss.push('prop '+name)}},
    person:(npcId,x,y,sc)=>{const kp=KH_KEEPERS[npcId];if(!kp){miss.push('person '+npcId);return null}return raw(khFaceKey(kp.face),x,y,{block:false,npc:npcId,sc:sc||kp.sc||1})}};
  S.dress(C);
  for(const l of PSG_LANDS(id)){for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&Math.abs(d.x-l[0])<=1&&Math.abs(d.y-l[1])<=1)decor.splice(i,1)}
    for(let i=enemies.length-1;i>=0;i--)if(Math.abs(enemies[i].x-l[0])<=3&&Math.abs(enemies[i].y-l[1])<=3)enemies.splice(i,1)}
  const torches=[];
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));cand.push({x,y,f,nar,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.h-b.h);
   for(const c of cand){const gp=c.nar?3.6:3.0;if(torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp))continue;torches.push([c.x,c.y,c.f,c.nar?1:0])}}
  V.torches=S.noTorch?[]:torches;
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||5.4))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=S.lcol}}}
  const fl=S.floors||['psf_flag','psf_flagdark','wl2f0','psf_cobble','psf_grate','psf_dust','psf_slate'];
  const floorSet=fl.map(n=>FLOORS[n]?n:(FLOORS.psf_flag?'psf_flag':'cobble'));
  const name=pspLevel(id).name;
  const L={rows,chars,fmap:fm.map(r=>r.join('')),floorSet,floor:floorSet[0],floor2:floorSet[1],ceil:S.ceil||'gyc_1',ceilH:WH,start:S.start,enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.1:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name,label:name,diff:S.diff,mapNames:S.names||[],_psg:V};
  LEVELS[id]=L;LEVEL_NAMES[id]=name;LEVEL_RATING[id]=S.diff;
  if(miss.length)console.warn('psg '+id+' missed: '+miss.join(' '));
  return L}
for(const id of [9721,9722,9723])pspRegister(id,((n)=>()=>psgMake(n))(id));
/* ==========================================================================
   PART B: THE INTERIORS (9721 gatehouse, 9722 winch loft, 9723 porter's lodge). Coordinates: x across, y down.
   ========================================================================== */
const PSG_COL={silver:[.9,1.0,1.55],violet:[.8,.62,1.4],warm:[1.5,1.05,.55]};
const PSG_TORCH_S={fl:3,col:[.85,.95,1.6],name:'silver',css:'#dfe8ff'},PSG_TORCH_V={fl:2,col:[.62,.42,.9],name:'violet',css:'#b48cff'};
/* ===== 9721 THE GREAT GATEHOUSE: the passage (x 19 to 21), the west guardroom (door to the lodge at 9,24), the east guardroom (stair to the loft at 34,9) ===== */
PSG_SPEC[9721]={W:40,H:32,diff:100,start:{x:20,y:27,f:0},wh:2.6,lcol:PSG_COL.silver,torch:PSG_TORCH_S,amb:.12,
  rects:[[19,3,21,28],[4,10,16,23],[17,11,18,12],[17,20,18,21],[24,10,37,23],[22,11,23,12],[22,20,23,21]],
  wins:[[38,13,'slit'],[38,16,'slit'],[38,19,'slit'],[3,13,'slit'],[3,17,'slit'],[28,9,'slit'],[24,9,'slit'],[8,9,'slit'],[13,9,'slit']],
  doors:[{x:20,y:2,kind:'arch'},{x:20,y:29,kind:'arch'},{x:34,y:9,kind:'stair'},{x:9,y:24,kind:'door'}],
  names:[{t:'The Passage',x:20,y:14,k:'place'},{t:'The West Guardroom',x:10,y:16,k:'place'},{t:'The East Guardroom',x:30,y:16,k:'place'},{t:'The Inner Portcullis',x:20,y:14,k:'place'}],
  dress(C){const {dec,raw,sign,foe,light,prop}=C;
    // the passage: plaques on the walls, a portcullis raised high in the dark, murder holes in the roof (plaques, nothing blocks the way)
    sign(19,5,[-1,0],'THE GREAT GATEHOUSE','Castle of the Pale Sovereign');sign(21,5,[1,0],'NO ARMS BEYOND THE INNER GATE','By order of the Gate Captain');
    sign(19,8,[-1,0],'MURDER HOLES ABOVE','Do not stand under them');sign(21,8,[1,0],'MURDER HOLES ABOVE','Do not stand under them');
    sign(19,24,[-1,0],'MURDER HOLES ABOVE','Do not stand under them');sign(21,24,[1,0],'MURDER HOLES ABOVE','Do not stand under them');
    sign(19,26,[-1,0],'THE OUTER GATE','Closed at dusk. It has not been dusk for years.');
    raw('gy_igate2',20,14,{block:false,bob:1.25,sc:1.1});
    for(const [x,y,w] of [[19,10,[-1,0]],[21,10,[1,0]],[19,18,[-1,0]],[21,18,[1,0]],[19,22,[-1,0]],[21,22,[1,0]]])raw('wl2_hall_0',x,y,{block:false,wd:w,pic:1,bob:.5});
    light(20,7,PSG_COL.silver);light(20,13,PSG_COL.violet);light(20,19,PSG_COL.violet);light(20,25,PSG_COL.silver);
    foe('psgatecaptain',20,15);foe('psguard',19,18);foe('psguard',21,8);foe('psguard',20,22);
    // the west guardroom: racks, a table with benches, bunks, a cold hearth, barrels
    for(const x of [5,7,14,16])prop('weaponrack',x,10);prop('shields',10,10,{bob:.3});prop('cothearth',12,10);
    prop('longtable',9,15);dec('bench',9,17,{block:false,sc:1});dec('bench',9,13,{block:false,sc:1});
    for(const y of [12,14,19])prop('bed',4,y);prop('shields',4,16,{bob:.3});
    raw('barrel',16,22,{});raw('crate',15,22,{sc:.9});raw('sacks',16,14,{});raw('barrel',16,21,{sc:.9});
    for(const [x,y] of [[7,13],[13,13],[7,19],[14,18]])light(x,y,PSG_COL.silver);
    foe('psguard',6,16);foe('psguard',13,16);foe('pshalberd',12,13);foe('psarcher',5,14);
    // the east guardroom: racks, mannequins, a duty table, the stair up
    for(const x of [25,27,30,37])prop('weaponrack',x,10);prop('mannequin',26,12,{});prop('mannequin',36,12,{});
    prop('counciltable',29,16);dec('bench',29,18,{block:false});dec('bench',29,14,{block:false});
    prop('mannequin',37,22);prop('mannequin',25,22);raw('barrel',37,15,{});raw('crate',37,17,{sc:.9});
    raw('chest',31,22,{});
    for(const [x,y] of [[28,13],[32,13],[28,20],[34,20]])light(x,y,PSG_COL.silver);
    foe('psguard',27,14);foe('pshalberd',31,19);foe('psarcher',36,16);foe('psarcher',36,19);foe('psguard',27,21);
    C.setF(4,10,16,23,'1');C.setF(24,10,37,23,'1');
    sign(33,10,[0,-1],'STAIR TO THE WINCH LOFT','Winch and chains. Guards at work.');
    sign(8,23,[0,1],"PORTER'S LODGE",'Knock before you enter')}};
/* ===== 9722 THE WINCH LOFT: the great winch, the murder-hole floor, the Warden's Horn on the table beside the dead warden ===== */
PSG_SPEC[9722]={W:28,H:24,diff:100,start:{x:4,y:12,f:1},wh:2.8,lcol:PSG_COL.violet,torch:PSG_TORCH_V,amb:.1,floorDef:'2',
  rects:[[3,4,25,19]],
  wins:[[26,6,'win'],[26,9,'win'],[26,12,'win'],[26,15,'win'],[26,18,'win'],[10,3,'slit'],[16,3,'slit'],[22,3,'slit']],
  doors:[{x:2,y:12,kind:'stair'}],
  names:[{t:'The Winch Loft',x:14,y:12,k:'place'},{t:'The Murder-Hole Floor',x:15,y:11,k:'place'},{t:"The Warden's Table",x:9,y:17,k:'place'}],
  dress(C){const {dec,raw,sign,foe,light,prop,setF}=C;
    setF(10,8,19,15,'4');setF(3,4,25,19,'2');setF(10,8,19,15,'4');
    sign(14,4,[0,-1],'THE MURDER HOLES','They open on the passage below');sign(5,4,[0,-1],'THE WINCH LOFT','Keep the chains clear');
    // the great winch at the east end, chains hanging from the roof beams
    prop('spinwheel',23,11,{h:2.4});
    for(const [x,y] of [[22,9],[22,14],[24,13]])raw('hl_p_chains',x,y,{block:false,sc:1.2});
    raw('wm_chain',9,6,{block:false});raw('wm_chain',20,6,{block:false,sc:1.1});raw('hl_p_chains',6,8,{block:false});
    // the table and the dead Road Warden: his bones, his coat, and his horn
    prop('counciltable',8,17);raw('gy_bones',6,18,{block:false,sc:1.6});raw('gy_bones',11,18,{block:false,sc:1});
    raw('gy_bell',9,16,{npc:'psg_horn',sc:1.5,block:true});
    sign(9,19,[0,1],'A ROAD WARDEN',"His horn is on the table");
    raw('chest',24,6,{});raw('barrel',24,18,{});raw('crate',23,18,{sc:.9});raw('sacks',4,6,{});raw('barrel',4,18,{sc:.9});
    prop('weaponrack',16,19);prop('weaponrack',18,19);
    for(const [x,y] of [[8,6],[15,6],[21,16],[8,13],[17,17]])light(x,y,PSG_COL.violet);
    foe('psguard',13,6);foe('psguard',20,17);foe('pshalberd',15,17);foe('pshalberd',19,12)}};
/* ===== 9723 THE PORTER'S LODGE (rest room): warm candlelight, a bed, a stove with a kettle, a chest of potions, Merrick Dole ===== */
PSG_SPEC[9723]={W:24,H:20,diff:100,start:{x:12,y:4,f:2},wh:2.2,lcol:PSG_COL.warm,noTorch:true,amb:.5,floorDef:'2',slits:false,lampGap:4.6,gain:1.25,rgb:[1.1,.98,.9],
  rects:[[3,3,20,16]],wins:[[7,2,'win'],[17,2,'win'],[2,8,'win'],[21,8,'win']],
  doors:[{x:12,y:2,kind:'door'}],
  names:[{t:"The Porter's Lodge",x:12,y:9,k:'place'}],
  dress(C){const {dec,raw,sign,light,prop}=C;
    prop('cothearth',18,3);prop('bed',4,4,{npc:'psg_bed'});prop('cot',6,4,{});
    prop('dresser',4,10,{});prop('dresser',4,12,{});prop('pietable',14,10,{});dec('bench',14,12,{block:false});dec('bench',14,8,{block:false});
    prop('rocker',17,6,{});prop('clock',20,10,{});prop('coatrack',9,3,{});
    raw('chest',19,15,{});raw('barrel',4,15,{});raw('sacks',5,15,{});raw('hl_p_candle',9,14,{sc:.9});raw('hl_p_candle',16,14,{sc:.9});
    for(const [x,y,c] of [[5,6,PSG_COL.warm],[10,10,PSG_COL.warm],[17,8,PSG_COL.warm],[8,14,PSG_COL.warm],[13,5,PSG_COL.warm]])light(x,y,c);
    sign(10,16,[0,1],"THE PORTER'S LODGE",'Rest here. Nothing hostile comes in.');
    C.person('psg_porter',11,9)}};
/* ==========================================================================
   PART C: THE PALE APPROACH (9720, outdoor, 80 by 72). A cobbled causeway (x 35 to 45) climbs from the south edge (the Pale Door, y 70) to the barbican (y 9 to 28) and the Great Gate (the iron gate, tiles 39 to 41 at y 8).
   Low parapets (x 34 and 46) hold it between cliffs; two bays widen it (the Guards' Rest, y 55 to 63, and the Waymark Terrace, y 40 to 50), each with a hidden nook (a chest). Nothing else is walkable.
   The look follows tools/PALE_SPIRE_REFERENCES.md (ref11 and ref9): violet and red storm sky, red iron gate, cobbles, roses on the parapets, a bastion with three arches, conical towers.
   The big fronts (the gate and the barbican) are billboards: the painted ps_gate_great and ps_barbican_front when they exist, otherwise a front drawn in code (psgFront).
   ========================================================================== */
const PSG_P={shade:'#46406a',dark:'#6a6884',mid:'#a8a8c0',light:'#cfd0de',trim:'#dfe6f2',roof:'#3c3a52',roofHi:'#5a5878',red:'#9a1c30',redHi:'#d84058',glow:'#f08a48'};
/* a front drawn in code, straight on: ashlar courses, cones, battlements, arches. Used until the painted pieces are cut. */
function psgAshlar(x,x0,y0,w,h,seed){
  const g=x.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,PSG_P.light);g.addColorStop(.55,PSG_P.mid);g.addColorStop(1,PSG_P.dark);x.fillStyle=g;x.fillRect(x0,y0,w,h);
  x.strokeStyle='rgba(50,44,86,.42)';x.lineWidth=1.6;
  for(let r=0,y=y0;y<y0+h;r++,y+=22){x.beginPath();x.moveTo(x0,y);x.lineTo(x0+w,y);x.stroke();
    for(let xx=x0+((r%2)*30+hash2(r,seed,5)*14|0);xx<x0+w;xx+=62+((hash2(r,xx|0,6)*18)|0)){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,Math.min(y+22,y0+h));x.stroke()}}
  x.fillStyle='rgba(28,20,60,.22)';x.fillRect(x0,y0,w,6)}
function psgCone(x,cx,base,r,hh,seed){
  const g=x.createLinearGradient(cx-r,0,cx+r,0);g.addColorStop(0,PSG_P.roofHi);g.addColorStop(.6,PSG_P.roof);g.addColorStop(1,'#26243a');
  x.fillStyle=g;x.beginPath();x.moveTo(cx-r-6,base);x.lineTo(cx,base-hh);x.lineTo(cx+r+6,base);x.closePath();x.fill();
  x.strokeStyle='rgba(10,8,24,.45)';x.lineWidth=1.4;for(let y=base-14;y>base-hh+10;y-=14){const f=(base-y)/hh,hw=(r+6)*(1-f);x.beginPath();x.moveTo(cx-hw,y);x.lineTo(cx+hw,y);x.stroke()}
  x.fillStyle=PSG_P.trim;x.fillRect(cx-1.5,base-hh-22,3,24);x.beginPath();x.arc(cx,base-hh-22,4,0,6.3);x.fill();
  x.fillStyle='#6a1830';x.beginPath();x.moveTo(cx+2,base-hh-20);x.lineTo(cx+34,base-hh-12);x.lineTo(cx+2,base-hh-4);x.fill()}
function psgWin(x,cx,cy,w,h,lit){
  x.beginPath();x.moveTo(cx-w/2,cy+h/2);x.lineTo(cx-w/2,cy-h/6);x.quadraticCurveTo(cx-w/2,cy-h/2,cx,cy-h/2);x.quadraticCurveTo(cx+w/2,cy-h/2,cx+w/2,cy-h/6);x.lineTo(cx+w/2,cy+h/2);x.closePath();
  const g=x.createLinearGradient(0,cy-h/2,0,cy+h/2);if(lit){g.addColorStop(0,'#f6b060');g.addColorStop(1,'#c8482c')}else{g.addColorStop(0,'#2a2250');g.addColorStop(1,'#5a4a98')}
  x.fillStyle=g;x.fill();x.strokeStyle=PSG_P.trim;x.lineWidth=3;x.stroke();x.beginPath();x.moveTo(cx,cy-h/2);x.lineTo(cx,cy+h/2);x.stroke()}
function psgMerlons(x,x0,y,w,h,col){x.fillStyle=col||PSG_P.mid;for(let xx=x0;xx<x0+w-14;xx+=34)x.fillRect(xx,y-h,20,h)}
function psgIronGate(x,x0,y0,w,h){   // the red wrought-iron gate in a pointed arch (x0..x0+w), seen straight on
  x.save();x.beginPath();x.moveTo(x0,y0+h);x.lineTo(x0,y0+h*.4);x.quadraticCurveTo(x0,y0+h*.06,x0+w/2,y0);x.quadraticCurveTo(x0+w,y0+h*.06,x0+w,y0+h*.4);x.lineTo(x0+w,y0+h);x.closePath();
  const g=x.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#2a1230');g.addColorStop(1,'#7a3050');x.fillStyle=g;x.fill();x.clip();
  x.strokeStyle=PSG_P.red;x.lineWidth=4;for(let xx=x0+8;xx<x0+w;xx+=14){x.beginPath();x.moveTo(xx,y0+h);x.lineTo(xx,y0);x.stroke();x.fillStyle=PSG_P.redHi;x.beginPath();x.moveTo(xx-4,y0+14);x.lineTo(xx,y0+2);x.lineTo(xx+4,y0+14);x.fill()}
  x.lineWidth=5;for(const f of [.32,.62,.88]){x.beginPath();x.moveTo(x0,y0+h*f);x.lineTo(x0+w,y0+h*f);x.stroke()}
  x.lineWidth=3;x.beginPath();x.arc(x0+w/2,y0+h*.5,w*.2,0,6.3);x.stroke();x.restore();
  x.strokeStyle=PSG_P.trim;x.lineWidth=7;x.beginPath();x.moveTo(x0,y0+h);x.lineTo(x0,y0+h*.4);x.quadraticCurveTo(x0,y0+h*.06,x0+w/2,y0);x.quadraticCurveTo(x0+w,y0+h*.06,x0+w,y0+h*.4);x.lineTo(x0+w,y0+h);x.stroke()}
function psgDrawGate(x,W,H){   // 1040 by 640, ground at the bottom edge; 40 pixels to a square; the gate (3 squares) is at x 460 to 580
  x.clearRect(0,0,W,H);
  psgAshlar(x,0,440,W,200,1);psgMerlons(x,0,440,W,26,PSG_P.mid);
  for(const [tx,tw] of [[50,230],[760,230]]){const cx=tx+tw/2;
    psgAshlar(x,tx,250,tw,390,tx);x.fillStyle=PSG_P.shade;x.fillRect(tx-10,238,tw+20,16);psgMerlons(x,tx-10,238,tw+20,0);
    psgCone(x,cx,238,tw/2+8,200,tx);
    for(const wy of [320,420,520])psgWin(x,cx,wy,34,56,hash2(tx,wy,3)>.3);
    x.fillStyle='rgba(20,14,40,.5)';x.fillRect(tx+tw-8,250,8,390)}
  psgAshlar(x,290,310,460,330,3);x.fillStyle=PSG_P.shade;x.fillRect(284,300,472,14);psgMerlons(x,284,300,472,22,PSG_P.mid);
  psgAshlar(x,410,160,220,150,4);x.fillStyle=PSG_P.trim;x.beginPath();x.moveTo(396,164);x.lineTo(520,48);x.lineTo(644,164);x.lineTo(630,164);x.lineTo(520,64);x.lineTo(410,164);x.fill();
  x.fillStyle=PSG_P.roof;x.beginPath();x.moveTo(404,166);x.lineTo(520,56);x.lineTo(636,166);x.closePath();x.fill();
  x.fillStyle=PSG_P.trim;x.beginPath();x.arc(520,226,36,0,6.3);x.fill();x.fillStyle='#6a3a98';x.beginPath();x.arc(520,226,29,0,6.3);x.fill();x.strokeStyle=PSG_P.trim;x.lineWidth=3;for(let a=0;a<8;a++){x.beginPath();x.moveTo(520,226);x.lineTo(520+Math.cos(a*.785)*29,226+Math.sin(a*.785)*29);x.stroke()}
  for(const cx of [336,704]){psgAshlar(x,cx-30,230,60,80,cx);psgCone(x,cx,230,30,120,cx)}
  for(const [wx,wy] of [[350,400],[690,400],[400,500],[640,500],[350,560],[690,560]])psgWin(x,wx,wy,26,46,hash2(wx,wy,9)>.25);
  x.fillStyle='#4a1a58';for(const bx of [372,668]){x.fillRect(bx-9,320,18,90);x.beginPath();x.moveTo(bx-9,410);x.lineTo(bx,430);x.lineTo(bx+9,410);x.fill()}
  psgIronGate(x,460,448,120,192);
  x.fillStyle='rgba(250,120,70,.18)';x.fillRect(470,440,100,6)}
function psgDrawBarbican(x,W,H){   // 1120 by 440, ground at the bottom edge; the middle arch (5 squares) is x 460 to 660
  x.clearRect(0,0,W,H);
  psgAshlar(x,150,170,W-300,270,7);psgMerlons(x,150,170,W-300,24,PSG_P.mid);
  for(const tx of [10,970]){const cx=tx+70;psgAshlar(x,tx,210,140,230,tx);x.fillStyle=PSG_P.shade;x.fillRect(tx-8,200,156,14);psgCone(x,cx,200,70,160,tx);
    psgWin(x,cx,300,26,46,true);x.fillStyle='#0c0a16';x.fillRect(cx-3,340,6,60)}
  for(const sx of [160,800]){for(let s=0;s<8;s++){const sy=440-s*34;psgAshlar(x,sx+(sx<400?s*17:(150-s*17)-0),sy-34,sx<400?150-s*17:150-(0),34,s+sx)}
    x.fillStyle='rgba(20,14,40,.25)';x.fillRect(sx,170,150,8)}
  x.fillStyle='#16101e';
  for(const ax of [330,670]){x.beginPath();x.moveTo(ax,440);x.lineTo(ax,300);x.quadraticCurveTo(ax,240,ax+60,236);x.quadraticCurveTo(ax+120,240,ax+120,300);x.lineTo(ax+120,440);x.closePath();x.fill();
    x.strokeStyle=PSG_P.red;x.lineWidth=3;for(let gx=ax+10;gx<ax+120;gx+=16){x.beginPath();x.moveTo(gx,440);x.lineTo(gx,250);x.stroke()}
    x.strokeStyle=PSG_P.trim;x.lineWidth=6;x.beginPath();x.moveTo(ax,440);x.lineTo(ax,300);x.quadraticCurveTo(ax,240,ax+60,236);x.quadraticCurveTo(ax+120,240,ax+120,300);x.lineTo(ax+120,440);x.stroke()}
  const g=x.createLinearGradient(0,200,0,440);g.addColorStop(0,'#3a2060');g.addColorStop(1,'#a08cd0');
  x.beginPath();x.moveTo(460,440);x.lineTo(460,280);x.quadraticCurveTo(460,200,560,190);x.quadraticCurveTo(660,200,660,280);x.lineTo(660,440);x.closePath();x.fillStyle=g;x.fill();
  x.fillStyle='#16141e';for(let i=0;i<11;i++){const px=470+i*18;x.fillRect(px,222,4,50);x.beginPath();x.moveTo(px-2,272);x.lineTo(px+6,272);x.lineTo(px+2,282);x.fill()}x.fillRect(466,222,188,6);
  x.strokeStyle=PSG_P.trim;x.lineWidth=10;x.beginPath();x.moveTo(460,440);x.lineTo(460,280);x.quadraticCurveTo(460,200,560,190);x.quadraticCurveTo(660,200,660,280);x.lineTo(660,440);x.stroke();
  x.fillStyle=PSG_P.trim;x.fillRect(536,168,48,16);x.fillStyle=PSG_P.red;x.fillRect(546,140,28,40)}
function psgFront(name,w,h,draw,pxPerSq){
  const k='ps_'+name;if(psgPainted(name))return k;const sk='psg_s_'+name;if(IMG[sk])return sk;
  const c=document.createElement('canvas');c.width=w*pxPerSq;c.height=h*pxPerSq;draw(c.getContext('2d'),c.width,c.height);IMG[sk]=c;return sk}
/* the red iron gate as three wall tiles: the picture cut in three slices (gyTile takes the pieces named gyp_*) */
function psgGateTile(WH,i){
  if(!IMG.gyp_psgate){if(psgPainted('gate_iron'))IMG.gyp_psgate=IMG.ps_gate_iron;else{const c=document.createElement('canvas');c.width=384;c.height=Math.round(384*WH/3);const x=c.getContext('2d');x.fillStyle='#14101c';x.fillRect(0,0,c.width,c.height);psgIronGate(x,40,c.height*.14,304,c.height*.86);IMG.gyp_psgate=c}}
  return gyTile('texGrey_0',WH,{fac:{img:'psgate',i,n:3},gain:1.2,rgb:[1,.98,1.1],tag:'psgate',emit:.5})}
function psgBuildApproach(){
  if(LEVELS[9720])return LEVELS[9720];
  psgArt();
  const W=80,H=72,C=blKit({id:9720,W,H,name:'The Pale Approach',lvl:100,start:{x:40,y:66,f:0}}),{rows,block,ch}=C;
  const RGc={gain:1.35,rgb:[1.0,.96,1.1]};
  const cl=[ch(gyTile('texBlack_3',3.8,{gain:.7,rgb:[.95,.82,1.12],tag:'pscliff0'})),ch(gyTile('texGrey_3',3.8,{gain:.62,rgb:[.95,.82,1.1],tag:'pscliff1'})),ch(gyTile('texBlack_2',3.8,{gain:.66,rgb:[1,.84,1.1],tag:'pscliff2'}))];
  const par=ch(gyTile('texGrey_2',.8,{gain:1.45,rgb:[1.0,.96,1.1],tag:'psparapet'}));
  const wall=[0,3,5,1].map(v=>ch(gyTile('texGrey_'+v,3.4,RGc))),slit=ch(psgSlitTile(3.4,RGc,'slit')),front=ch(gyTile('texGrey_2',4.6,RGc));
  const hs=C.hs;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){rows[y][x]=cl[(hs(x,y,3)*3)|0];block[y*W+x]=1}
  const carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){rows[y][x]='.';block[y*W+x]=0}};
  const setW=(x0,y0,x1,y1,pick)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){rows[y][x]=pick(x,y);block[y*W+x]=1}};
  // the ground
  carve(35,29,45,69);carve(27,55,53,63);carve(25,40,55,50);carve(21,57,26,60);carve(56,43,60,46);carve(29,9,51,26);carve(38,27,42,28);
  C.setF(0,0,W-1,H-1,'3');C.setF(29,9,51,28,'2');C.setF(38,9,42,28,'3');C.setF(25,40,55,50,'2');C.setF(27,55,53,63,'2');C.setF(35,40,45,50,'3');C.setF(35,55,45,63,'3');C.setF(21,57,26,60,'5');C.setF(56,43,60,46,'5');C.setF(34,9,44,11,'3');
  // parapets along the causeway where it is not a bay, and the barbican's walls
  for(let y=29;y<=69;y++)for(const x of [34,46])if(!(rows[y][x]==='.')){rows[y][x]=par;block[y*W+x]=1}
  setW(27,9,28,26,(x,y)=>(y%5===2&&x===28)?slit:wall[(hs(x,y,5)*4)|0]);setW(52,9,53,26,(x,y)=>(y%5===2&&x===52)?slit:wall[(hs(x,y,6)*4)|0]);
  setW(27,27,37,28,(x,y)=>wall[(hs(x,y,7)*4)|0]);setW(43,27,53,28,(x,y)=>wall[(hs(x,y,8)*4)|0]);
  setW(27,3,53,8,(x,y)=>y===8&&x>=29&&x<=51?front:wall[(hs(x,y,9)*4)|0]);
  for(let i=0;i<3;i++){rows[8][39+i]=ch(psgGateTile(4.6,i));block[8*W+39+i]=1}
  // the way back to the Pale Door (south edge): an arch, plainly shut until that door is built
  {const l=pspLinkAt(9720,40,70),gid=psgArchTile(2.4,'s',RGc),d=psgDoorFor(l);Object.defineProperty(d,'say',{get(){const q=pspLevel(9710);return q&&q.built?null:'The way back to Sale is far behind you.'}});KH_DOOR[gid]=d;
    setW(38,70,42,71,(x,y)=>wall[(hs(x,y,10)*4)|0]);rows[70][40]=ch(gid);block[70*W+40]=1}
  const gate39=pspLinkAt(9720,40,8);
  // the gate door: three tiles, all go to the gatehouse (the contract square is (40,8))
  for(let i=0;i<3;i++){const c=rows[8][39+i],gid=C.chars[c];KH_DOOR[gid]=psgDoorFor(gate39)}
  // the fronts: billboards in front of the gate wall and the barbican's outer wall
  const gk=psgFront('gate_great',26,16,psgDrawGate,40),bk=psgFront('barbican_front',28,11,psgDrawBarbican,40);
  C.sky.push({x:40.5,y:9.15,k:gk,w:26,z:0,big:1});C.sky.push({x:40.5,y:29.15,k:bk,w:28,z:0,big:1});
  // light: red lamps along the causeway, violet in the bays, silver in the barbican
  const RED=[1.7,.5,.58],VIO=[.95,.62,1.5],SIL=[.95,1.0,1.4];
  for(let y=64;y>=31;y-=6){for(const x of [35,45]){C.dec('gy_lantern',x,y,{block:false});C.light(x,y,y>46?RED:VIO)}}
  for(const [x,y] of [[29,13],[51,13],[29,22],[51,22],[40,12],[40,24],[34,17],[46,17]]){C.dec('gy_lantern',x,y,{block:false,sc:.95});C.light(x,y,SIL)}
  for(const [x,y] of [[28,52],[52,52],[28,59],[52,59],[26,45],[54,45],[22,58],[58,44]])C.light(x,y,VIO);
  // roses climbing the parapets, dead white trees, statues, banners
  const rose=['gy_rose','gy_rose'],treeK=psgPic('tree','gy_dead','saturate(.12) brightness(1.9) contrast(.9)',3.0);
  for(let y=33;y<=67;y+=2)for(const x of [35,45]){if(C.free(x,y)&&(y-31)%6!==0){const d=C.dec('gy_rose',x,y,{block:false,sc:1.5});if(d){d.ox=x<40?-.15:.15}}}
  for(let y=34;y<=66;y+=4)for(const x of [36,44])if(y<53||y>56)C.DB(treeK,x,y,{sc:1+hs(x,y,4)*.3});
  const kneel=psgPic('st_guard','w_candleknight','saturate(.12) brightness(1.5) hue-rotate(210deg)',1.25);
  for(const [x,y] of [[31,57],[49,57],[31,61],[49,61],[28,42],[52,42],[28,48],[52,48],[32,14],[48,14],[32,20],[48,20]])C.DB(kneel,x,y,{sc:1});
  const ban=psgPic('banner','mw_banner','saturate(.55) hue-rotate(245deg) brightness(.85)',2.3);
  for(const [x,y] of [[30,10],[50,10],[30,24],[50,24],[43,34],[37,34]])C.DB(ban,x,y,{sc:1});
  // the people and the things
  C.dec('gy_igate2',40,28,{block:false,bob:1.3,sc:1.0});
  C.grave(36,62,'psg_waymark',['THE PALE SPIRE','CASTLE OF THE','PALE SOVEREIGN'],{h:1.25,npc:'psg_waymark'});
  C.thing('gy_mound','psg_cairn',31,46,{sc:1.6});
  for(const [dx,dy,k] of [[-1,0,'bl_stone1'],[1,1,'bl_lean'],[0,-1,'bl_stone2']])C.D(k,31+dx,46+dy,{block:true,sc:.7});
  const TOK=[[36,64,'gy_ring'],[44,60,'gy_locket'],[28,58,'gy_rose'],[23,59,'gy_book'],[50,48,'gy_bell'],[58,44,'ww_ribbon'],[30,20,'ww_boot'],[50,12,'gy_ring'],[45,25,'ww_crumbs']];
  TOK.forEach(([x,y,k],i)=>{const q=C.near(x,y,2,false);if(q)C.dec(k,q[0],q[1],{block:true,npc:'psg_tok'+i,sc:1.7})});
  C.dec('chest',22,58,{block:true});C.dec('chest',59,45,{block:true});C.dec('chest',51,25,{block:true});
  for(const [x,y] of [[26,57],[26,60],[55,43],[55,46]])C.DB(treeK,x,y,{sc:1.1});
  // creatures: guards on the causeway, halberdiers at the bays, archers and sentinels in the barbican and beside the road
  C.foes([['psguard',37,58],['psguard',43,53],['psguard',38,46],['psguard',43,40],['psguard',40,34],['psguard',36,18],['psguard',44,12],['pshalberd',42,50],['pshalberd',36,36],['pshalberd',40,22],
    ['psarcher',31,16],['psarcher',49,16],['psarcher',31,23],['psarcher',49,23],['pssentinel',30,59],['pssentinel',51,44],['pssentinel',32,12]]);
  const lv=C.finish({start:{x:40,y:66,f:0},col:[.95,.62,1.5]});
  lv.floorSet=['psf_grass','psf_gravel','psf_flag','psf_cobble','psf_slate','psf_dust','psf_flagdark'].map(n=>FLOORS[n]?n:'cobble');lv.floor=lv.floorSet[0];lv.day=.5;lv.amb=.95;
  lv._psg={lcol:C.lcol,col:[.95,.62,1.5],torches:null,kI:1.3,range2:90};
  lv.mapNames=[{t:'The Pale Approach',x:40,y:60,k:'place'},{t:'The Guards\' Rest',x:40,y:59,k:'place'},{t:'The Waymark Terrace',x:40,y:45,k:'place'},{t:'The Barbican',x:40,y:17,k:'place'},{t:'The Great Gate',x:40,y:9,k:'place'}];
  return lv}
pspRegister(9720,()=>psgBuildApproach());
/* ==========================================================================
   PART D: PEOPLE, QUESTS AND OBJECTS. Flags in G.flags.psp: tok (bitmask of the nine pilgrims' tokens taken), horn (the Warden's Horn taken), cap (Gate Captain dead), ring (key ring taken), sketch (given),
   seen9720 .. seen9723 (first arrival lines). Quests psq1 The Pilgrims' Offerings and psq2 The Captain's Key Ring, both given by Merrick Dole (psg_porter).
   ========================================================================== */
ITEMDEF.pssketch={n:"Merrick's Sketch of the Castle",k:'quest',t:'Lore',ic:'book',c:'#c8c0a8',stack:1,price:0,sw:.05,d:"A porter's sketch on the back of a ledger page. The gatehouse is at the bottom, then the Court of Statues, then the great house. The Great Hall is in the middle of the north range, the kitchens and armoury are in the west wing, the chapel, cloister and library are in the east wing, and the dungeons run down under the kitchens. The upper floors are marked: LOCKED, KEYS WITH THE SACRISTAN."};
const psgTok=()=>{let m=psgF().tok|0,n=0;for(let i=0;i<9;i++)if(m&(1<<i))n++;return n};
const PSG_TOK_NAMES=['a blue hair ribbon','a horn button','a bent silver penny','a child\'s wooden bird','a cracked clay whistle','a small iron key','a scrap of red cloth with a name sewn on it','a pewter pilgrim badge','a lock of grey hair tied with thread'];
bl3Q('psq1',"The Pilgrims' Offerings",'Merrick Dole, the porter',[
  ['Find the nine tokens that pilgrims left on the Pale Approach and in the barbican (the cairn on the road shows where to start), and bring them to Merrick Dole the porter in his lodge in the gatehouse.',()=>bagCount('pstoken')>=9,['psg_cairn','psg_tok0','psg_tok1','psg_tok2','psg_tok3','psg_tok4','psg_tok5','psg_tok6','psg_tok7','psg_tok8']]],
  {gold:3000,xp:20000,items:['potion6','potion6']},{take:{pstoken:9}});
bl3Q('psq2',"The Captain's Key Ring",'Merrick Dole, the porter',[
  ['Defeat the Gate Captain in the passage of the Great Gatehouse, and bring his key ring to Merrick Dole the porter.',()=>bagCount('pskeyring')>=1,['psgatecaptain']]],
  {gold:4000,xp:25000,items:['potion6','potion6','potion6']},{take:{pskeyring:1}});
for(const q of ['psq1','psq2'])QAREA[q]=PSP.REGION;
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx});   // where the quest ring points
  QRF.T.psq1={give:[N(9723,'psg_porter')],act:[N(9720,'psg_cairn','psg_tok0','psg_tok1','psg_tok2','psg_tok3','psg_tok4','psg_tok5','psg_tok6','psg_tok7','psg_tok8')],ready:[N(9723,'psg_porter')]};
  QRF.T.psq2={give:[N(9723,'psg_porter')],act:[E(9721,/^psgatecaptain$/)],ready:[N(9723,'psg_porter')]}}
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes(PSP.REGION))QAREA_ORDER.push(PSP.REGION);
if(typeof QWORLD!=='undefined'&&!QWORLD[PSP.REGION])QWORLD[PSP.REGION]='wenlock';
const PSG_Q={
  psq1:{offer:"There is a cairn on the road below the gate. Pilgrims left things on it for luck, and for the dead, for as long as there have been pilgrims. None of the pilgrims who left them came back. Nine of the small things are lying about on the road and in the barbican now, where they fell or were kicked, and it troubles me that they are lying in the dirt. Would you gather them and bring them to me? I will put them back on the cairn myself, when the road is quiet.",
    accept:"Thank you. Look along the road, in the barbican and behind the dead trees. They are small, so look low. The cairn is on the west side of the road, a little way up from where you came in.",
    remind:()=>'You have '+bagCount('pstoken')+' of the nine tokens. Look along the road and in the barbican. The cairn is on the west side of the road.',
    ready:"That is nine. I counted them twice. Look at them: a ribbon, a button, somebody's whistle. Somebody was very fond of each of these.",
    thanks:"Thank you. I will set them on the cairn tonight. You have earned the chapel's directions, too: from the courtyard, go through the Great Door, then east through the Banqueting Hall to the wing with the cloister. The chapel is at the far end, behind the garth. Mind the choir. Here, take this, from the gatehouse stores.",
    after:"The tokens are back on the cairn. I go down to look at them every evening, if the road is quiet. It is very seldom quiet."},
  psq2:{offer:"There is a thing I would ask, if you are going to be fighting him anyway. The Gate Captain has the key ring of the gatehouse: the guardrooms, the stores, the lodge, the loft, the lot. I was porter here for thirty years and I have not touched my own keys since he took them. He stands in the passage, under the inner portcullis, and he does not let anyone by. Bring me the ring, if you can.",
    accept:"Thank you. He is slow, but he hits like a falling door. He wakes when you come within two paces of him. Do not stand in the middle of the passage and hope.",
    remind:()=>bagCount('pskeyring')>0?'You have the key ring. Bring it to me, in the lodge.':'The Gate Captain stands in the passage of the gatehouse, under the inner portcullis. He keeps the key ring on his belt.',
    ready:"That is my ring. Number one is the lodge. Number two is the loft. Number three, I never found out. Thank you.",
    thanks:"Thank you. I shall sleep with it under the pillow. Take these, from the stores. They are not much, but nobody else is going to use them.",
    after:"The key ring hangs on its nail again. It is the first time in years that a thing has been where it ought to be."}};
const PSG_PORTER_FACE='kh_ohfolk6_2';
khNpc('psg_porter','Merrick Dole, the porter',PSG_PORTER_FACE,d=>psgPorterTalk(),{sc:1});
{const dsc=Object.getOwnPropertyDescriptor(QGIVER,'psg_porter');
  Object.defineProperty(QGIVER,'psg_porter',{enumerable:true,configurable:true,get(){const l=[];for(const q of ['psq1','psq2'])if(qSt(q)!=='done')l.push(q);return l.length?l:null}})}
function psgPorterTalk(){
  const F=psgF(),opts=[];
  for(const q of ['psq1','psq2']){const st=qSt(q);if(st==='done')continue;
    if(qReady(q))return qNode(q,PSG_Q[q]);
    opts.push([st==='active'?(q==='psq1'?'About the pilgrims\' tokens.':'About the key ring.'):(q==='psq1'?'Is something troubling you?':'Do you need anything fetched?'),()=>qNode(q,PSG_Q[q])])}
  const back=()=>psgPorterTalk();
  const intro=F.metPorter?"Back again. The kettle is on, and the bed is made. Nothing comes in here. Ask what you like.":"(An old man in a porter's coat, with a ring of small tin tags at his belt and a kettle on the stove, looks up from his chair.) You are alive. I had stopped expecting that. I am Merrick Dole, porter of this gate. I stayed when the rest went up the stairs, or were taken, and nobody has told me to stop. Sit down. Nothing hostile comes into this room. I do not know why, and I have decided not to ask.";
  F.metPorter=1;
  return say(intro,[
    ...opts,
    ['Rest in the lodge.',()=>{G.talk=null;try{restParty(true)}catch(e){console.error(e)}return say('You sleep in the porter\'s bed and on his floor, and wake warm. The kettle is on again. Everyone is healed and fed.',[BYE])}],
    ['What is this place?',()=>say("The Pale Spire, the castle of the Pale Sovereign. You are in the gatehouse, at the front. Behind it is the Court of Statues, which is not a nice name for a nice place. Beyond that is the great house itself: the Great Hall in the middle of the north range, the kitchens and armoury in the west wing, the cloister, chapel and library in the east wing, and the dungeons under the kitchens. The upper floors are locked. The keys went to the sacristan, and nobody has told me where he put them.",[['Back.',back],BYE])],
    ['Who holds the gatehouse?',()=>say("The pale guards, and the halberdiers, and the archers in the slits. They were soldiers once. Now they stand where they stand and do what they did, and the Gate Captain is the worst of them, because he remembers his orders best. He keeps the passage. The two guardrooms open off it, and the stair in the east one goes up to the winch loft, where the portcullis chains are. There is a dead man in the loft who was a Road Warden. I have not had the heart to move him.",[['Back.',back],BYE])],
    [F.sketch?'About that sketch.':'Do you know the way?',()=>{
      if(F.sketch)return say("It is the best I can do. The gatehouse is the bottom of the page. Do not trust the upper floors, I have never seen them.",[['Back.',back],BYE]);
      F.sketch=1;if(!bagAdd(mkItem('pssketch')))G.items.push({k:'pssketch',x:G.P.x,y:G.P.y,taken:false});
      sfx('key');return say("I know the ground floor, from thirty years of carrying messages. I have drawn it for you on a page of the ledger. Take it. It shows which wing is which, and where the stairs go down.",[['Back.',back],BYE])}],
    BYE])}
khNpc('psg_bed','A bed','chest',()=>say("A narrow bed with a patched grey blanket. It is clean. The porter says anyone may sleep in it.",[['Rest.',()=>{G.talk=null;try{restParty(true)}catch(e){console.error(e)}return say('You sleep, and the room is quiet and warm. Everyone is healed and fed.',[BYE])}],BYE]));
khNpc('psg_horn',"The Warden's Horn",'gy_bell',d=>{const F=psgF();
  if(F.horn)return say('The place on the table where the horn lay.',[BYE]);
  return say("A long horn of dull horn and tarnished silver lies on the table, beside the bones of the man who carried it. He wore the grey cloak of a Road Warden, and the cloak is still on the chair. The horn is his.",[['Take the horn.',()=>{F.horn=1;if(d){d.found=true;d.hidden=true}if(!bagAdd(mkItem('pshorn')))G.items.push({k:'pshorn',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg("You take the Warden's Horn.",'#ffe36a');return null}],BYE])});
bl3Hide(9722,'psg_horn',()=>!!psgF().horn);
for(let i=0;i<9;i++){const bit=1<<i;
  khNpc('psg_tok'+i,"A pilgrim's token",'gy_ring',d=>{const F=psgF();
    if((F.tok|0)&bit)return say('Nothing here now.',[BYE]);
    return say('Lying in the dirt is '+PSG_TOK_NAMES[i]+'. It was left for luck on the way to the Pale Spire.',[["Pick it up.",()=>{F.tok=(F.tok|0)|bit;if(d){d.found=true;d.hidden=true}if(!bagAdd(mkItem('pstoken')))G.items.push({k:'pstoken',x:G.P.x,y:G.P.y,taken:false});
      sfx('key');msg("You pick up a pilgrim's token ("+psgTok()+' of 9).','#ffe36a');if(qSt('psq1')==='active')yrStep("You have "+bagCount('pstoken')+' of the nine tokens.');return null}],BYE])});
  bl3Hide(9720,'psg_tok'+i,()=>!!((psgF().tok|0)&bit))}
khNpc('psg_cairn','A cairn of pilgrims\' offerings','bl_stone1',()=>{
  const n=bagCount('pstoken');
  return say("A tall heap of stones beside the road, with a board leaning on it. The board says: FOR THOSE WHO WENT UP. Ribbons and buttons and little carved things were left here by pilgrims, and many have fallen off and lie scattered along the road and in the barbican. "+(qSt('psq1')==='done'?"The cairn has been tidied.":qSt('psq1')==='active'?"You carry "+n+" of the nine tokens that belong on it.":"Merrick Dole the porter would know more. His lodge is in the gatehouse, at the end of the road."),[BYE])});
/* the Gate Captain: his key ring, and the Warden's Horn if it has not been taken */
bl3Kill('psgatecaptain',e=>{const F=psgF();if(F.cap)return;F.cap=1;F.ring=1;bl3Give('pskeyring');
  let t="The Gate Captain goes down on one knee, and then on his face, and the key ring slides off his belt. You take the Gate Captain's Key Ring.";
  if(!F.horn){F.horn=1;bl3Give('pshorn');t+=" The Warden's Horn was hanging beside it, and you take that as well."}
  try{msg(t,'#ffe36a');sfx('win')}catch(x){}});
/* arrival lines (first visit to each place) */
const PSG_ARR={9720:'The Pale Approach. A cobbled causeway climbs between low walls to an iron gate under a red and violet sky. Small lamps burn along it.',9721:'The Great Gatehouse. The passage is cold and long, and a portcullis hangs high in the dark.',9722:'The Winch Loft. Chains as thick as a leg run into the floor.',9723:"The Porter's Lodge. It is warm, and it smells of tea. Nothing hostile comes in here."};
function psgArrive(n){
  try{bl3Apply(n)}catch(e){console.error(e)}
  const F=psgF(),k='seen'+n;if(!F[k]){F[k]=1;try{msg(PSG_ARR[n],n===9723?'#f0c890':'#d0c8f0')}catch(e){}}}
