/* ==========================================================================
   VERMIN CIRCLES (prefix hgvz / HGVZ): the dashed red circles on the maze map are challenges. Stepping into one shows a counter at the top of the 3D view (THE SLUG RUN  14 vermin left);
   kill every creature that belongs to the circle and the place is free of vermin: a banner, a reward (a potion or a weapon, gold, experience), an achievement, a green ring on the map, thanks from the maze people.
   Clearing every circle of a level gives a master reward. This file holds the engine (shared with the Underlevel, hgd_verminu.js) and the circles of the surface maze (level 475):
   the old danger zones, six more large ones, twelve small ones, and two in the water (a lake, and the Flooded Quarter).
   A circle's creatures carry the tag .vz (the circle id) in L.enemies; a live enemy takes it from L.enemies[e.id] when the level is entered, and cleared circles are removed from G.enemies then.
   Cleared ids: G.flags.hgdVz = {id:1}; names for the gossip: G.flags.hgdVzN; pending shopkeeper thanks: G.flags.hgdVzTh.
   ========================================================================== */
const HGVZ={arr:null,lv:0,len:-1,cur:null,cnt:{},bq:[],bt:0,px:0,py:0,lt:-9,ct:-9,told:{}};
const hgvzF=()=>G.flags.hgdVz||(G.flags.hgdVz={});
const hgvzZones=lv=>{const L=LEVELS[lv];return L&&L._hgvz?L._hgvz:[]};
const hgvzThe=n=>/^The /.test(n)?'the '+n.slice(4):n;
const hgvzList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
/* ---------- rewards ---------- */
const HGVZ_CFG={
  s:{large:{gold:[400,500,600,700,800],xm:3,pot:[['potion4',2],['elixir',1],['superiorheal',2],['supermana',2],['potion4',1],['elixir',1]],wlv:[15,35],wp:[1500,5000]},
     small:{gold:[150,200,250,300],xm:1,pot:[['potion3',1],['greaterheal',1],['manadraught',1],['antidote',1]]},
     water:[{items:['gem_diamond'],gold:500,xm:2},{items:['gem_emerald','superiorheal'],gold:500,xm:2}],
     all:{item:'ar_wyrm_c',gold:2000},allName:'Scourge of the Hollow',allText:'The Deeper Hollow is free of vermin'},
  u:{large:{gold:[1000],xm:4,pot:[['elixir',1],['supermana',2],['superiorheal',2],['potion4',3],['elixir',2]],wlv:[40,60],wp:[4000,8000]},
     small:{gold:[400],xm:1.5,pot:[['potion4',1],['supermana',1],['superiorheal',1],['elixir',1]]},
     water:[{items:['gem_blackopal','gem_diamond'],gold:1500,xm:3}],
     all:{item:'ar_god_c',gold:4000},allName:'Scourge of the Underlevel',allText:'The Underlevel is free of vermin'}};
function hgvzWeapons(c){const o=[];for(const id in ITEMDEF){const d=ITEMDEF[id];if(d&&d.k==='weapon'&&!d.rar&&!/^hg/.test(id)&&d.lvl>=c.wlv[0]&&d.lvl<=c.wlv[1]&&d.price>=c.wp[0]&&d.price<=c.wp[1])o.push(id)}return o.sort()}
// the reward of the j-th zone of a tier ('large','small','water') on a level kind ('s' or 'u')
function hgvzReward(kind,tier,j){
  const C=HGVZ_CFG[kind];
  if(tier==='water')return Object.assign({},C.water[j%C.water.length]);
  const c=C[tier];let items=[];
  if(tier==='large'&&j%2===1){const w=hgvzWeapons(c);if(w.length)items=[w[((j>>1)*7+j)%w.length]]}
  if(!items.length){const p=c.pot[(tier==='large'?j>>1:j)%c.pot.length];for(let k=0;k<p[1];k++)items.push(p[0])}
  return {items,gold:c.gold[j%c.gold.length],xm:c.xm}}
/* ---------- the engine: tagging, counting, clearing ---------- */
function hgvzCount(){const c={};for(const e of G.enemies)if(e.vz&&e.hp>0)c[e.vz]=(c[e.vz]||0)+1;return c}
function hgvzTag(){const L=LEVELS[LEVEL],S=L.enemies;for(const e of G.enemies)if(!e._vzc){e._vzc=1;const s=S[e.id];if(s&&s.vz&&s.t===e.t)e.vz=s.vz}}
function hgvzSync(){
  const L=LEVELS[LEVEL];if(!L||!L._hgvz||!G.enemies)return false;const F=hgvzF();
  if(HGVZ.arr!==G.enemies||HGVZ.lv!==LEVEL){
    hgvzTag();if(Object.keys(F).length)G.enemies=G.enemies.filter(e=>!(e.vz&&F[e.vz])); // cleared circles stay empty
    HGVZ.arr=G.enemies;HGVZ.lv=LEVEL;HGVZ.ct=-9;HGVZ.cur=null;hgvzTold()}
  else if(HGVZ.len!==G.enemies.length)hgvzTag();
  HGVZ.len=G.enemies.length;return true}
function hgvzCheckAll(){
  const F=hgvzF(),c=hgvzCount();HGVZ.cnt=c;
  for(const z of hgvzZones(LEVEL))if(!F[z.id]&&!(c[z.id]>0))hgvzClear(z)}
function hgvzMapBust(){try{if(typeof HGDMP!=='undefined')for(const k of Object.keys(HGDMP.cache))delete HGDMP.cache[k];G.mplKey=null}catch(e){}}
function hgvzGossipLine(z){
  const n=hgvzThe(z.name),N=z.name,u=z.lv===476,i=Object.keys(hgvzF()).length;
  const A=u?[
    'Someone has cleared '+n+' under the maze. Whatever lived down there is quiet now. Thank you, whoever you are.',
    'They say '+n+', down in the dark, is free of vermin. I did not think anyone would ever do it.',
    'A party went down the ladder and emptied '+n+'. I would shake their hands, if I could find them.']
  :[
    'Someone has cleared '+N+'! My cousin walks there again. Thank you, whoever you are.',
    'They say '+n+' is free of vermin now. Whoever did it, the corridors are quieter tonight.',
    'I heard '+n+' is empty. A party came through and left nothing alive. We owe them a drink.',
    'The traders use the way past '+n+' again. Bless whoever swung the sword.',
    'My brother lost a boot in '+n+' last year. He went back for it this week. Thank you.',
    'Nothing crawls in '+n+' any more. The whole quarter is saying thank you.'];
  return A[i%A.length]}
function hgvzTold(){
  const N=hgvzF().hgdVzN||G.flags.hgdVzN;if(!N)return;
  for(const id in N){if(HGVZ.told[id])continue;HGVZ.told[id]=1;const z={name:N[id],lv:/^vzu/.test(id)?476:475},line=hgvzGossipLine(z);
    if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push(line);if(typeof HGDK_SAY!=='undefined')HGDK_SAY.push(line)}}
function hgvzGive(rw){
  const got={};
  for(const id of rw.items||[]){const d=ITEMDEF[id];if(!d)continue;let nm=d.n;if(bagAdd(mkItem(id)));else{G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false});nm+=' (on the floor)'}got[nm]=(got[nm]||0)+1}
  const parts=Object.keys(got).map(k=>got[k]>1?k+' x'+got[k]:k);
  if(rw.gold){G.gold+=rw.gold;parts.push(rw.gold+' gold')}
  if(rw.xp&&typeof giveXP==='function')giveXP(rw.xp);
  return parts}
function hgvzBanner(l1,l2,col){HGVZ.bq.push({l1,l2,col:col||'#ffe36a'})}
function hgvzClear(z){
  const F=hgvzF();if(F[z.id])return;F[z.id]=1;(G.flags.hgdVzN||(G.flags.hgdVzN={}))[z.id]=z.name;if(HGVZ.cur===z)HGVZ.cur=null;
  const rw=Object.assign({},z.rw);rw.xp=Math.round((rw.xm||0)*enemyStat(z.lv===HGDU.ID?'hgusl3':'hgdslug').xp);const parts=hgvzGive(rw),NM=z.name.toUpperCase();
  hgvzBanner(NM+' IS FREE OF VERMIN','Reward: '+parts.join(', ')+(rw.xp?'  (+'+rw.xp+' xp)':''));
  sfx('win');msg(z.name+' is free of vermin.','#a8e8a0');msg('Reward: '+parts.join(', ')+(rw.xp?' and '+rw.xp+' experience':'')+'.','#ffe36a');msg('Achievement: '+z.name+' cleared.','#ffd76a');
  hgvzMapBust();hgvzTold();
  // the nearest town's shopkeeper and the nearest quest giver thank the party the next time they talk to them
  try{const L=LEVELS[HGD.ID];if(z.lv===HGD.ID&&L&&L._hgdp){const P=L._hgdp,TH=G.flags.hgdVzTh||(G.flags.hgdVzTh={}),add=npc=>{if(npc){(TH[npc]||(TH[npc]=[])).push(z.name)}};
      let bz=null,bd=1e9;for(const s of P.zones)if(s.type==='safe'&&s.town!==undefined){const d=Math.hypot(s.x-z.x,s.y-z.y);if(d<bd){bd=d;bz=s}}
      if(bz){const f=P.folk.find(f=>f.shop!==undefined&&f.zone===bz.name);if(f)add(f.npc)}
      let bq=null;bd=1e9;for(const f of P.folk)if(f.qi!==undefined){const s=P.zones.find(q=>q.name===f.zone);if(!s)continue;const d=Math.hypot(s.x-z.x,s.y-z.y);if(d<bd){bd=d;bq=f}}
      if(bq)add(bq.npc)}}catch(e){console.warn('hgvz thanks',e)}
  hgvzMaster(z.lv)}
function hgvzMaster(lv){
  const kind=lv===HGD.ID?'s':'u',C=HGVZ_CFG[kind],F=hgvzF(),Z=hgvzZones(lv),key='hgdVzAll'+kind;
  if(F[key]||!Z.length||!Z.every(z=>F[z.id]))return;F[key]=1;
  let it=C.all.item;if(!ITEMDEF[it]){const c=Object.keys(ITEMDEF).filter(i=>/^ar_.*_c$/.test(i)&&!ITEMDEF[i].rar).sort((a,b)=>ITEMDEF[b].lvl-ITEMDEF[a].lvl);it=c[0]}
  const parts=hgvzGive({items:[it],gold:C.all.gold});
  hgvzBanner(C.allText.toUpperCase(),C.allName+'.  Reward: '+parts.join(', '),'#ffd76a');
  msg(C.allText+'.','#ffe36a');msg('Reward: '+parts.join(', ')+'.','#ffe36a');msg('Achievement: '+C.allName+'.','#ffd76a');
  sfx('win');setTimeout(()=>{try{sfx('level')}catch(e){}},900);hgvzMapBust()}
// kills: a creature of a circle dying is checked at once; everything else is checked four times a second
{const _he=hurtEnemy;hurtEnemy=function(e){const was=e&&e.hp>0,r=_he.apply(this,arguments);try{if(was&&e.hp<=0&&e.vz&&hgvzSync())hgvzCheckAll()}catch(x){console.warn('hgvz',x)}return r}}
{const _u=update;update=function(dt){
  try{if((LEVEL===HGD.ID||LEVEL===HGDU.ID)&&G.state==='play'&&G.P&&hgvzSync()){
    if(G.time-HGVZ.ct>.25||G.time<HGVZ.ct){HGVZ.ct=G.time;hgvzCheckAll()}
    const F=hgvzF();let best=null,bd=9;
    for(const z of hgvzZones(LEVEL)){if(F[z.id])continue;const d=Math.hypot(G.P.x-z.x,G.P.y-z.y)/z.r;if(d<=1&&d<bd){bd=d;best=z}}
    if(best&&!F['s_'+best.id]&&(HGVZ.cnt[best.id]||0)>0){F['s_'+best.id]=1;msg('Challenge: '+best.name+'. '+HGVZ.cnt[best.id]+' vermin live here. Kill them all to free the place.','#e8a070')}
    HGVZ.cur=best}}catch(e){console.warn('hgvz update',e)}
  return _u.apply(this,arguments)}}
// the thanks of the shopkeepers and quest givers
{const _st=startTalk;startTalk=function(d){const r=_st.apply(this,arguments);
  try{const TH=G.flags.hgdVzTh,l=TH&&d&&d.npc&&TH[d.npc];if(l&&l.length&&G.talk&&G.talk.node&&G.talk.d===d){G.talk.node.text='Thank you for freeing '+(l.length>3?hgvzList(l.slice(0,3).map(hgvzThe).concat([(l.length-3)+' other places'])):hgvzList(l.map(hgvzThe)))+' of vermin! '+G.talk.node.text;delete TH[d.npc]}}catch(e){}return r}}
// the achievements page
{const _al=achList;achList=function(){const r=_al.apply(this,arguments);
  try{const F=hgvzF();for(const [lv,head,all,key] of [[HGD.ID,'Vermin cleared in the Deeper Hollow','Scourge of the Hollow','hgdVzAlls'],[HGDU.ID,'Vermin cleared in the Underlevel','Scourge of the Underlevel','hgdVzAllu']]){const Z=hgvzZones(lv);if(!Z.length)continue;
      const n=Z.filter(z=>F[z.id]).length;r.out.push({h:head+' ('+n+' of '+Z.length+')'});for(const z of Z.slice().sort((a,b)=>(a.tier==='large'?0:a.tier==='water'?1:2)-(b.tier==='large'?0:b.tier==='water'?1:2)))r.out.push({n:z.name,s:!!F[z.id]});r.out.push({n:all,s:!!F[key]})}}catch(e){console.warn('hgvz ach',e)}return r}}
/* ---------- the counter and the banner ---------- */
const hgvzHit=(a,b)=>a.x<b.x+b.w+1&&b.x<a.x+a.w+1&&a.y<b.y+b.h+1&&b.y<a.y+a.h+1;
// the places on the 3D view (420 x 210) that already hold something
function hgvzBusy(extra){
  const B=[{x:176,y:0,w:80,h:18},{x:2,y:2,w:24,h:24}];
  try{if(frontEnemy(4)){B.push({x:26,y:2,w:232,h:28},{x:28,y:30,w:124,h:84},{x:6,y:38,w:18,h:168})}}catch(e){}
  try{if(G.uw)B.push({x:128,y:16,w:164,h:38})}catch(e){}
  try{if(typeof teleOn==='function'&&!TP&&teleOn()&&teleActive(LEVEL))B.push({x:160,y:30,w:100,h:20})}catch(e){}
  try{const ids=new Set(afflList().map(e=>e.id));if(ids.size){const c=Math.min(8,ids.size),r=Math.ceil(ids.size/8);B.push({x:420-6-c*21,y:2,w:c*21+4,h:r*22+2})}}catch(e){}
  try{let y=22;for(const b of G.lvlBanners.slice(-2)){const h=24+(Math.ceil(b.changes.length/2)+(b.powers.length?1:0))*11;B.push({x:40,y,w:340,h});y+=h+4}}catch(e){}
  try{const now=G.time,ms=G.msgs.filter(m=>now-m.t<6).slice(-3);let n=0;for(const m of ms)n+=wrapMsg(m.text,VW-24,10).length;n=Math.min(5,n);if(n)B.push({x:4,y:VH-10-n*12,w:VW-8,h:n*12+6})}catch(e){}
  if(extra)B.push(extra);return B}
function hgvzDraw(){
  if(G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview)return;
  // the banner: one at a time, six seconds each
  let bn=null,brect=null;
  if(HGVZ.bq.length){const b=HGVZ.bq[0];if(!b.t)b.t=G.time;if(G.time-b.t>6)HGVZ.bq.shift();else{bn=b;
    let by=76;const lb=hgvzBusy().filter(r=>r.w===340);if(lb.some(r=>hgvzHit(r,{x:40,y:by,w:340,h:50})))by=124;brect={x:40,y:by,w:340,h:50}}}
  if(bn){const age=G.time-bn.t,a=Math.max(0,Math.min(1,age*3,(6-age)*1.5)),x=brect.x,y=brect.y,w=brect.w,h=brect.h;
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(10,8,5,.92)';rrect(ctx,x,y,w,h,6);ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=goldG(x,y,w,h);rrect(ctx,x,y,w,h,6);ctx.stroke();
    txt(bn.l1,x+w/2,y+17,13,bn.col,'center',true,undefined,w-20);txt(bn.l2,x+w/2,y+37,8.5,'#c8e8b0','center',true,undefined,w-20);ctx.restore()}
  // the counter
  const z=HGVZ.cur;if(!z||G.state!=='play'){HGVZ.lt=-9;return}
  const n=HGVZ.cnt[z.id]||0,label=z.name.toUpperCase()+'   '+n+' vermin left';
  ctx.save();ctx.font=(9*1.08)+'px '+FUI;const tw=ctx.measureText(label).width;ctx.restore();
  const w=Math.max(120,Math.ceil(tw+30)),h=22,B=hgvzBusy(brect);
  const C=[[420-w-4,4],[420-w-4,28],[210-w/2,22],[210-w/2,46],[4,4],[4,118],[420-w-4,118],[210-w/2,118],[4,90]];
  let tx=C[0][0],ty=C[0][1];for(const c of C){const r={x:c[0],y:c[1],w,h};if(!B.some(b=>hgvzHit(r,b))){tx=c[0];ty=c[1];break}}
  const dt=Math.max(0,Math.min(.1,G.time-HGVZ.lt));
  if(G.time-HGVZ.lt>.5||HGVZ.lt<0){HGVZ.px=tx;HGVZ.py=ty}else{const k=1-Math.exp(-dt*9);HGVZ.px+=(tx-HGVZ.px)*k;HGVZ.py+=(ty-HGVZ.py)*k}
  HGVZ.lt=G.time;HGVZ.tx=tx;HGVZ.ty=ty;HGVZ.w=w;
  const x=HGVZ.px,y=HGVZ.py,tot=Math.max(1,z.n||n),fr=Math.max(0,Math.min(1,1-n/tot));
  ctx.save();ctx.fillStyle='rgba(8,6,4,.82)';rrect(ctx,x,y,w,h,5);ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=goldG(x,y,w,h);rrect(ctx,x,y,w,h,5);ctx.stroke();
  // a small skull
  {const sx=x+10,sy=y+8;ctx.fillStyle='#d9cfb6';ctx.beginPath();ctx.arc(sx,sy-.5,4,0,TAU);ctx.fill();ctx.fillRect(sx-2.4,sy+1.5,4.8,3);ctx.fillStyle='#2a0a0a';ctx.beginPath();ctx.arc(sx-1.6,sy-.8,1.1,0,TAU);ctx.arc(sx+1.6,sy-.8,1.1,0,TAU);ctx.fill()}
  txt(z.name.toUpperCase(),x+19,y+8,9,'#e0c898','left',true);txt(n+' vermin left',x+w-6,y+8,9,'#f0907a','right',true);
  ctx.fillStyle='rgba(30,12,10,.9)';ctx.fillRect(x+7,y+15,w-14,3.5);ctx.fillStyle=fr>.66?'#8ad07a':fr>.33?'#e0c050':'#d05040';ctx.fillRect(x+7,y+15,(w-14)*fr,3.5);ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=.7;ctx.strokeRect(x+7,y+15,w-14,3.5);
  ctx.restore()}
{const _d=drawLevelBanners;drawLevelBanners=function(){_d.apply(this,arguments);try{hgvzDraw()}catch(e){console.warn('hgvz draw',e)}}}
/* ==========================================================================
   THE SURFACE CIRCLES (level 475)
   ========================================================================== */
const HGVZ_BIO=['Hedge','Stone','Comb','Shell','Sand','Blue','Tile','Gilt'];
const HGVZ_LARGE=[['The Wasp Alley','bug'],['Beetle Row','beetle'],['The Pale Burrows','worm'],['Spider Gully','spider'],['The Mud Nest','slug'],['The Crawling Court','mixed']];
const HGVZ_SMALLK=['slug','jelly','worm','bug','spider','beetle','slug','jelly','worm','spider','beetle','bug'];
const HGVZ_KNAME={slug:'Slug',jelly:'Jelly',worm:'Worm',bug:'Bug',spider:'Spider',beetle:'Beetle',mixed:'Mixed'};
function hgvzSurface(L){
  if(L._hgvz||!L._hgdp||!L._hgdl)return;
  const M=L._hgdm,W=M.W,H=M.H,P=L._hgdp,rows=L.rows,fm=L.fmap,rnd=hgdmRng(475130),bio=M.bio;
  const dry=(x,y)=>x>=2&&y>=2&&x<W-2&&y<H-2&&rows[y][x]==='.'&&!(fm&&(fm[y][x]==='5'||fm[y][x]==='6'));
  const blk=new Set(),occ=new Set(),bad=new Set(),mark=(s,x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)s.add((x+i)+','+(y+j))};
  for(const d of L.decor){const k=d.x+','+d.y;occ.add(k);if(d.block)blk.add(k);if(d.npc||d.k==='chest'||d.k==='hg_chestweed')mark(bad,d.x,d.y,2)}
  for(const i of L.items)occ.add(i.x+','+i.y);for(const e of L.enemies)occ.add(e.x+','+e.y);
  if(L._hgdu)for(const l of L._hgdu.ladders){mark(bad,l.ax,l.ay,3);mark(bad,l.x,l.y,3)}
  if(L._hgdv)for(const a of L._hgdv.agents)mark(bad,a.house[0],a.house[1],3);
  const lakes=L._hgdl.lakes,mask=hgdlMask(L),near=(k,m,x,y,r)=>x+r>=k.x0-m&&x-r<=k.x1+m&&y+r>=k.y0-m&&y-r<=k.y1+m;
  for(const k of lakes)for(const pz of (k.plazas||(k.plaza?[k.plaza]:[])))for(const c of pz)mark(bad,c[0],c[1],6);
  // the cells the party can walk to from the start
  const reach=new Uint8Array(W*H),q=[[L.start.x,L.start.y]];reach[L.start.y*W+L.start.x]=1;
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||reach[ny*W+nx]||!dry(nx,ny)||blk.has(nx+','+ny))continue;reach[ny*W+nx]=1;q.push([nx,ny])}}
  const zones=P.zones,all=()=>zones.filter(z=>z.type==='danger'),safeNear=(x,y,m)=>zones.some(z=>z.type==='safe'&&Math.hypot(z.x-x,z.y-y)<=z.r+m);
  const out=[];let li=0,si=0;
  const finish=(z,tier,j)=>{z.vz=true;z.tier=tier;z.small=tier==='small';z.water=tier==='water';z.lv=HGD.ID;z.rw=hgvzReward('s',tier,j);out.push(z)};
  // the old danger zones: their creatures are counted by position
  const KINDS=t=>t==='mixed'?['hgdslug','hgdjelly','hgdworm','hgdbug','hgdspider','hgdbeetle','hgdgrub','hgdswarm','hgdguard','hgdwarden']:HGDP_KINDS[t].concat(t==='bug'||t==='beetle'?[]:[]);
  all().forEach((z,i)=>{z.id='vzo'+i;z.mon=z.mon||'mixed';const ks=new Set(z.boss?KINDS('mixed'):KINDS(z.mon));let n=0;
    for(const e of L.enemies)if(!e.vz&&ks.has(e.t)&&Math.hypot(e.x-z.x,e.y-z.y)<=z.r){e.vz=z.id;n++}z.n=n;if(n>0)finish(z,'large',li++)});
  // placing new ground circles: a site, then its creatures on free walkable squares
  const cellsOf=(x,y,R)=>{const c=[];for(let j=y-R;j<=y+R;j++)for(let i=x-R;i<=x+R;i++){if(i<2||j<2||i>=W-2||j>=H-2||Math.hypot(i-x,j-y)>R)continue;const k=i+','+j;if(reach[j*W+i]&&!occ.has(k)&&!bad.has(k)&&!mask[j*W+i]&&!safeNear(i,j,3))c.push([i,j])}return c};
  const site=(R,gap,minCells,startD)=>{for(let t=0;t<7000;t++){const x=8+((rnd()*(W-16))|0),y=8+((rnd()*(H-16))|0);
      if(!reach[y*W+x]||Math.hypot(x-M.sx,y-M.sy)<R+startD||safeNear(x,y,R+3)||lakes.some(k=>near(k,4,x,y,R))||all().some(z=>Math.hypot(z.x-x,z.y-y)<z.r+R+gap))continue;
      const cs=cellsOf(x,y,R);if(cs.length>=minCells)return {x,y,cs}}return null};
  const fill=(z,cs,n,kinds)=>{let got=0;const sp=[];for(let t=0;t<n&&cs.length;t++){let ci=(rnd()*cs.length)|0;
      for(let a=0;a<6&&sp.some(s=>Math.abs(s[0]-cs[ci][0])+Math.abs(s[1]-cs[ci][1])<2);a++)ci=(rnd()*cs.length)|0;
      const c=cs.splice(ci,1)[0];sp.push(c);occ.add(c[0]+','+c[1]);L.enemies.push({t:kinds[(rnd()*kinds.length)|0],x:c[0],y:c[1],vz:z.id});got++}z.n=got};
  // six more large circles
  let lj=0;for(const [name,mon] of HGVZ_LARGE){const R=9+((rnd()*4)|0),n=12+((rnd()*9)|0),s=site(R,6,n*2,26);if(!s)continue;
    const z={type:'danger',x:s.x,y:s.y,r:R,name,mon,biome:bio[s.y*W+s.x],id:'vz'+(lj++)};zones.push(z);fill(z,s.cs,n,HGDP_KINDS[mon]);if(z.n>=8)finish(z,'large',li++);else{zones.pop();L.enemies=L.enemies.filter(e=>e.vz!==z.id)}}
  // twelve small circles
  let sj=0;const used=new Set(out.map(z=>z.name));
  for(let k=0;k<12;k++){const R=4+((rnd()*2)|0),n=5+((rnd()*3)|0),s=site(R,3,n+4,14);if(!s)continue;const mon=HGVZ_SMALLK[k];
    let name=HGVZ_BIO[bio[s.y*W+s.x]]+' '+HGVZ_KNAME[mon]+' Nest';for(let a=2;used.has(name);a++)name=HGVZ_BIO[bio[s.y*W+s.x]]+' '+HGVZ_KNAME[mon]+' Nest '+a;used.add(name);
    const z={type:'danger',x:s.x,y:s.y,r:R,name,mon,biome:bio[s.y*W+s.x],id:'vzs'+(sj++)};zones.push(z);fill(z,s.cs,n,HGDP_KINDS[mon]);if(z.n>=4)finish(z,'small',si++);else{zones.pop();L.enemies=L.enemies.filter(e=>e.vz!==z.id)}}
  // the water: the south-west lake, and the Flooded Quarter
  const WK=new Set(['hgwcroc','hgweel','hgwsnake']),inC=(cx,cy,R)=>L.enemies.filter(e=>WK.has(e.t)&&!e.vz&&Math.hypot(e.x-cx,e.y-cy)<=R);
  let wj=0;const addW=(name,cx,cy,R,id)=>{const es=inC(cx,cy,R);if(es.length<4)return false;const z={type:'danger',x:cx,y:cy,r:R,name,mon:'water',biome:bio[cy*W+cx],id,n:es.length};for(const e of es)e.vz=id;zones.push(z);finish(z,'water',wj++);return true};
  {const ks=lakes.filter(k=>!k.wm),sw=ks.slice().sort((a,b)=>(b.y0+b.y1)-(a.y0+a.y1)||(a.x0+a.x1)-(b.x0+b.x1))[0];
   if(sw)addW('The Reed Lake Hunters',(sw.x0+sw.x1)>>1,(sw.y0+sw.y1)>>1,9,'vzw0')}
  {const fq=lakes.find(k=>k.wm);if(fq){let best=null,bs=1e9;for(let y=fq.y0+4;y<=fq.y1-4;y+=2)for(let x=fq.x0+4;x<=fq.x1-4;x+=2){if(!mask[y*W+x])continue;const c=inC(x,y,10).length;if(c<8)continue;const sc=Math.abs(c-18)+Math.hypot(x-(fq.x0+fq.x1)/2,y-(fq.y0+fq.y1)/2)*.02;if(sc<bs){bs=sc;best=[x,y]}}
   if(best)addW('The Flooded Quarter Hunters',best[0],best[1],10,'vzw1')}}
  L._hgvz=out;L._hgvzBuilt=out.length}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdl&&L._hgdlDone)try{hgvzSurface(L)}catch(e){console.error('hgvz',e)}}}
// the map: a cleared circle is named in the green of the safe places, with (cleared) after its name
{const _n=hgdmpNames;hgdmpNames=function(vi){const out=_n.apply(this,arguments);try{const F=G.flags.hgdVz,L=LEVELS[HGD.ID];if(F&&L&&L._hgvz)for(const o of out)if(o.k==='danger'){const z=L._hgvz.find(q=>q.name===o.t);if(z&&F[z.id]){o.k='encl';o.t=o.t+' (cleared)'}}}catch(e){}return out}}
