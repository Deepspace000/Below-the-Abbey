/* ==========================================================================
   QUEST RINGS FIX. Every main quest shows a ring on the local map when it is picked in the quest log, at each stage: not taken yet (the giver), under way (the place to go to,
   one ring on each thing left to do) and ready to hand in (the giver again). On another level the ring sits on the door that leads there, with "Go to ..." under it, or on the
   world map. Test harness: tools/qrings (python tools/qrings/run_rings.py), report tools/qrings/QRINGS_REPORT.md. Last in the injection order.

   HOW A QUEST GETS A RING (for later builders): add an entry to QRF.T below, QRF.T.<questId> = {give:[...], act:[...], ready:[...]} (ready defaults to give, give defaults to act).
   A spec says where, on which level: N(level,'npcId',...) a person or thing by its decor id, E(level,/enemy type/) every creature of that type still alive, I(level,'itemId') a thing
   lying on the ground, K(level,'decor kind'), X(level,x,y) a fixed square, CH(level,'X') the exit squares of the level, F(level,fn) a function returning [{x,y}].
   Add {via:{<level>:[x,y]}} to a spec when the way there is not an ordinary door (a ladder, a boat, a teleporter): the ring then sits at [x,y] on that level.
   The game's own spots (QUESTS.<id>.spot) are used when an entry has no live spot on the level. Never put an em dash in a text here.
   ========================================================================== */
const QRF={T:{},LOC:{}};
{
const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),I=(l,id)=>({lvl:l,item:id}),K=(l,k)=>({lvl:l,kind:k}),X=(l,x,y)=>({lvl:l,xy:[x,y]}),CH=(l,c)=>({lvl:l,ch:c}),F=(l,fn)=>({lvl:l,fn});
const T=QRF.T;
/* ---- Act 1: the western lands ---- */
T.gandrick={give:[N(5,'corbin')],act:[E(8,/^gandrick$/)],ready:[N(5,'corbin')]};
T.ironhill={act:[N(14,'halbrecht')]};
T.mines={give:[N(14,'halbrecht')],act:[E(18,/^(rat|bat|skel)$/)],ready:[N(14,'halbrecht')]};
T.overseer={give:[N(13,'bryn')],act:[E(18,/^overseer$/)],ready:[N(13,'bryn')]};
T.escape={act:[N(21,'jailer'),E(21,/^halbrecht$/)]};
T.pass={give:[N(13,'rowan')],act:[CH(22,'X')]};
/* ---- Act 2: Greendale and Khemetra (the palace is level 199, the shipwright 213, the boarded house 235, the cisterns 260, the study 261, the sea tunnel 266) ---- */
T.scoria={give:[N(34,'marigold')],act:[N(261,'kh_ishkander')]};
[['kh_c1',103,'khart1'],['kh_c2',108,'khart2'],['kh_c3',120,'khart3'],['kh_c4',128,'khart4'],['kh_c5',134,'khart5'],['kh_c6',141,'khart6'],['kh_c7',146,'khart7']].forEach(([q,l,it])=>{T[q]={give:[N(199,'kh_neferet')],act:[I(l,it)],ready:[N(199,'kh_neferet')]}});
T.kh_seal={give:[N(199,'kh_vizier')],act:[N(235,'kh_sealchest')],ready:[N(199,'kh_vizier')]};
T.yar2={give:[N(199,'kh_vizier')],act:[N(260,'yar_keychest')],ready:[N(199,'kh_vizier')]};
T.kh_sea={give:[N(213,'kh_captain')],act:[X(266,3,2)],ready:[N(213,'kh_captain')]};
T.yar3={give:[N(213,'kh_captain')],act:[E(289,/^skel$/)],ready:[N(213,'kh_captain')]};
/* ---- Act 3: Yarrim and the islands ---- */
T.yar4={give:[N(292,'yr_harbour')],act:[N(290,'yr_crate')],ready:[N(292,'yr_harbour')]};
T.yar5={give:[N(292,'yr_harbour')],act:[E(297,/^rat$/)],ready:[N(292,'yr_harbour')]};
T.yar6={give:[N(298,'yr_orsa')]};
T.yar7={give:[N(290,'yr_menkaure')]};
T.vq1={give:[N(300,'sb_maeve')],act:[E(300,/^(bandit|archer)$/)],ready:[N(300,'sb_maeve')]};
T.vq2={give:[N(301,'ib_aldous')],act:[N(301,'ib_bell')],ready:[N(301,'ib_aldous')]};
T.vq3={give:[N(302,'ci_ketra')],act:[N(302,'ci_crystal'),E(302,/^cinder$/)],ready:[N(302,'ci_ketra')]};
T.vq4={give:[N(303,'ll_isolde')],act:[N(303,'ll_altar')],ready:[N(303,'ll_isolde')]};
/* ---- Act 4: the Kraken and Oldhaven (330 is the open Narrow Sea, its islands are decor named sea_land_<level>) ---- */
T.vq5={give:[N(290,'yr_menkaure')],act:[N(330,'sea_land_oh'),N(290,'yr_ship')],ready:[N(304,'yr_ship')]};
const harp=n=>({lvl:n.lvl,npc:['kg_harp'],cat:n.cat});
T.kg0={give:[N(290,'yr_menkaure')],act:[N(330,'sea_land_338','sea_land_337','sea_land_341','sea_land_303'),harp({lvl:338,cat:1}),harp({lvl:337,cat:2}),harp({lvl:341,cat:3}),harp({lvl:323,cat:4})],ready:[N(290,'yr_menkaure')]};
T.kg1={give:[N(302,'ci_ketra')],act:[harp({lvl:338,cat:1}),N(330,'sea_land_338')],ready:[N(302,'ci_ketra')]};
T.kg2={give:[N(300,'sb_maeve')],act:[harp({lvl:337,cat:2}),N(330,'sea_land_337')],ready:[N(300,'sb_maeve')]};
T.kg3={give:[N(301,'ib_aldous')],act:[harp({lvl:341,cat:3}),N(330,'sea_land_341')],ready:[N(301,'ib_aldous')]};
T.kg4={give:[N(303,'ll_isolde')],act:[harp({lvl:323,cat:4}),N(303,'uw_dive_303')],ready:[N(303,'ll_isolde')]};
T.sd2={give:[N(290,'yr_menkaure')],act:[X(330,560,300)],ready:[N(290,'yr_menkaure')]};
T.vq6={give:[N(305,'oh_cap')],act:[N(306,'oh_king')],ready:[N(306,'oh_king')]};
/* ---- Act 5: Oldhaven (305), the Oakwood (311) ---- */
T.oq0={give:[N(305,'oh_cap')],act:[N(305,'oh_x_weigher','oh_x_ringer','oh_x_baker','oh_x_fool')],ready:[N(305,'oh_cap')]};
T.sg1={give:[N(305,'oh_cap')],act:[E(305,/^ashguard$/)],ready:[N(305,'oh_cap')]};
T.sg2={give:[N(6074,'oh_sergeant')]};
T.sg3={give:[N(305,'oh_s_mason')]};
T.sg4={give:[N(305,'oh_s_cats')]};
T.sg5={give:[N(305,'oh_cap')],act:[N(305,'oh_s_falc','oh_s_tobias','oh_s_boy')],ready:[N(305,'oh_cap')]};
T.sg6={give:[N(6074,'oh_sergeant')],act:[N(305,'oh_s_fam1','oh_s_fam2','oh_s_fam3','oh_s_fam4')],ready:[N(6074,'oh_sergeant')]};
T.sg7={give:[N(305,'oh_x_baker')]};
T.sg8={give:[N(305,'oh_cap')],act:[E(305,/^ashguard$/)],ready:[N(305,'oh_cap')]};
T.oa1={give:[N(305,'oh_cap')],act:[N(311,'oa_hale')],ready:[N(305,'oh_cap')]};
T.oa2={give:[N(311,'oa_hale')],act:[E(311,/^wolf$/)],ready:[N(311,'oa_hale')]};
T.oa3={give:[N(311,'oa_master')],act:[I(311,'acorn')],ready:[N(311,'oa_master')]};
T.oa4={give:[N(311,'oa_wizard')],act:[I(311,'herb')],ready:[N(311,'oa_wizard')]};
T.oa6={give:[N(311,'oa_hale')],act:[E(311,/^ashguard$/)],ready:[N(311,'oa_hale')]};
T.oa7={give:[N(311,'oa_master')]};
T.oa5={give:[N(311,'oa_wren')]};
T.oa8={give:[N(311,'oa_ysolt')]};
T.oa9={give:[N(311,'oa_ysolt')]};
T.ad1={give:[N(305,'oh_cap')]};
/* ---- Act 6: back to the Abbey ---- */
T.ad2={give:[N(305,'oh_cap')],act:[N(1,'ab_door')]};
T.ad3={give:[N(1,'ab_door')],act:[N(363,'ab_sevrin')]};
T.ad4={give:[N(363,'ab_sevrin')],act:[E(363,/^hollowabbot$/)],ready:[N(363,'ab_sevrin')]};
T.hc1={give:[N(363,'ab_sevrin')],act:[N(444,'hl_vance0'),N(449,'hl_vance1'),N(454,'hl_vance2')],ready:[N(363,'ab_sevrin')]};
T.hc2={give:[N(459,'hl_wizard')]};
/* ---- Act 7: the Hollow Grasslands (hives 471 to 474, Exsce 481, Glorm 483, Nibb 484) and the Deeper Hollow (475) ---- */
[['hgb1',471,'hgbook1'],['hgb2',472,'hgbook2'],['hgb3',473,'hgbook3'],['hgb4',474,'hgbook4']].forEach(([q,l,it])=>{T[q]={give:[N(481,'hg_aldous')],act:[I(l,it)],ready:[N(481,'hg_aldous')]}});
T.hgrescue={give:[N(481,'hg_aldous')],act:[N(474,'hgbound')],ready:[N(481,'hg_aldous')]};
T.dh1={give:[N(481,'hg_aldous')],act:[N(483,'hgd_moth')],ready:[N(483,'hgd_moth')]};
T.dh2={give:[N(483,'hgd_moth')]};
const hive=/^hg(larva|swarm\d|wasp|golem)$/;
T.dh3={give:[N(484,'hgd_whale')],act:[E(471,hive),E(472,hive),E(473,hive),E(474,hive)],ready:[N(484,'hgd_whale')]};
T.dq11={give:[N(475,'hgd_q10')],act:[F(475,()=>{const v=G.flags.hgdVisited||{},o=[];for(let i=0;i<8;i++)if(!v[i])for(const d of G.decor)if(d.npc==='hgd_church'+i&&!d.found)o.push({x:d.x,y:d.y});return o})],ready:[N(475,'hgd_q10')]};
T.dq12={give:[N(475,'hgd_q11')],act:[E(475,/^hgdwarden$/)],ready:[N(475,'hgd_q11')]};
T.hgsph={give:[N(475,'hgd_cinder')],act:[E(475,/^hgmini\d$/)],ready:[N(475,'hgd_cinder')]};
/* ---- Act 8: the Black Swill and the way west (the Underlevel is 476, the Maze of Gardens 490, Wenlock 496) ---- */
T.bsw1={give:[N(475,'hgd_cinder')],act:[E(476,/^bsw$/)],ready:[N(475,'hgd_cinder')]};
T.wk1={give:[F(475,()=>typeof bswGateCell==='function'?[bswGateCell()]:[])],act:[X(490,45,3)]};
T.wk2={give:[X(490,45,3)],act:[X(490,45,3),X(496,45,52)]};
T.wk3={give:[N(496,'wlo_mayor')]};
/* ---- the Wenlock graveyard (530 yard, 531 crypt, 532 to 535 the four mazes) and Lady Aldith's chain ---- */
T.gyq1={give:[N(531,'gyo_ghost')],act:()=>QRF.gyDone('gyq1')?[E(532,/^gyvane$/)]:[N(532,'gyo_keychest'),N(530,'gyo_door0')],ready:[N(531,'gyo_ghost')]};
T.gyq2={give:[N(531,'gyo_ghost')],act:()=>QRF.gyDone('gyq2')?[E(533,/^gygrimsby$/)]:[N(533,'gyo_lever'),N(533,'gyo_riddle'),N(530,'gyo_door1')],ready:[N(531,'gyo_ghost')]};
T.gyq3={give:[N(531,'gyo_ghost')],act:()=>QRF.gyDone('gyq3')?[E(534,/^gyaldric$/)]:[E(534,/^gy(wraith|banshee|shade)$/),N(530,'gyo_door2')],ready:[N(531,'gyo_ghost')]};
T.gyq4={give:[N(531,'gyo_ghost')],act:()=>QRF.gyDone('gyq4')?[E(535,/^gymorwenna$/)]:[N(535,'gyo_trapchest'),N(530,'gyo_door3')],ready:[N(531,'gyo_ghost')]};
T.gyq5={give:[N(531,'gyo_ghost')],act:[N(530,'gyo_grave')],ready:[N(531,'gyo_ghost')]};
/* ---- the Witch's Wood (520 wood, 521 parlour, 522 cellar, 523 kitchen); the givers live in Wenlock (496) ---- */
T.wwq1={give:[N(496,'wwo_marrow')],act:[N(520,'wwo_boot','wwo_ribbon','wwo_crumbs')],ready:[N(496,'wwo_marrow')]};
T.wwq2={give:[N(496,'wlo_gran')],act:[N(496,'wlo_friar','wlo_smith')],ready:[N(496,'wlo_gran')]};
T.wwq3={give:[N(496,'wlo_gravedigger')],act:[N(520,'wwo_hagstone','wwo_rowan')],ready:[N(496,'wlo_gravedigger')]};
T.wwq4={give:[N(496,'wlo_friar')],act:[N(520,'wwo_totem1','wwo_totem2','wwo_totem3')],ready:[N(496,'wlo_friar')]};
T.wwq5={give:[N(496,'wlo_watch')],act:[E(520,/^wwabom$/)],ready:[N(496,'wlo_watch')]};
T.wwq6={give:[N(496,'wwo_marrow')],act:[N(522,'wwo_cage1','wwo_cage2','wwo_cage3')],ready:[N(496,'wwo_marrow')]};
T.wwq7={give:[N(496,'wlo_mayor')],act:[N(521,'wwo_grisselda')],ready:[N(496,'wlo_mayor')]};
T.wwq8={give:[N(496,'wlo_gran')],act:[N(523,'wwo_recipe')],ready:[N(496,'wlo_gran')]};
T.wwq9={give:[N(496,'wlo_gran')],act:[N(520,'wwo_smock1','wwo_smock2','wwo_smock3')],ready:[N(496,'wlo_gran')]};
/* ---- the monastery and the shell (side lines that the quest log marks as main) ---- */
T.mq1={give:[N(430,'mon_abbot')],act:[N(430,'mon_herb','mon_cellar','mon_bees','mon_bell')],ready:[N(430,'mon_abbot')]};
T.mq2={give:[N(430,'mon_herb')]};
T.shell={give:[N(301,'ib_aldous')],act:[N(320,'uw_shellpc'),N(321,'uw_shellpc'),N(322,'uw_shellpc'),N(323,'uw_shellpc')],ready:[N(301,'ib_aldous')]};
}
/* ==== the engine ==== */
QRF.gyDone=q=>{const F=typeof gyF==='function'?gyF():null;if(!F)return false;return q==='gyq1'?!!(F.key||F.dead[0]):q==='gyq2'?!!(F.lev||F.dead[1]):q==='gyq3'?((F.k3|0)>=8||!!F.dead[2]):!!(F.seal||F.dead[3])};
QRF.stage=id=>{const s=qSt(id);return s===null?'give':s==='done'?'ready':qReady(id)?'ready':'act'};
QRF.specs=(id,stg)=>{const e=QRF.T[id];if(!e)return null;const pick=k=>{let a=e[k];if(typeof a==='function')a=a();return a};
  return (stg==='give'?pick('give')||pick('act'):stg==='ready'?pick('ready')||pick('give')||pick('act'):pick('act')||pick('give'))||[]};
QRF.live=sp=>{ // the squares of one spec on the level the party is on
  const o=[];if(sp.lvl!==LEVEL)return o;
  if(sp.npc)for(const d of G.decor||[])if(d.npc&&sp.npc.includes(d.npc)&&!d.found&&(sp.cat===undefined||d.cat===sp.cat))o.push({x:d.x,y:d.y});
  if(sp.en)for(const e of G.enemies||[])if(e.hp>0&&!e.dying&&sp.en.test(e.t))o.push({x:Math.round(e.x),y:Math.round(e.y)});
  if(sp.item)for(const it of G.items||[])if(!it.taken&&it.k===sp.item)o.push({x:it.x,y:it.y});
  if(sp.kind)for(const d of G.decor||[])if(d.k===sp.kind&&!d.found)o.push({x:d.x,y:d.y});
  if(sp.xy)o.push({x:sp.xy[0],y:sp.xy[1]});
  if(sp.ch){const L=LEVELS[LEVEL];if(L&&L.rows)L.rows.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]===sp.ch)o.push({x,y})})}
  if(sp.fn){try{for(const p of sp.fn()||[])o.push(p)}catch(e){}}
  if(o.length>12){const px=G.C?G.C.x:0,py=G.C?G.C.y:0;o.sort((a,b)=>Math.hypot(a.x-px,a.y-py)-Math.hypot(b.x-px,b.y-py));o.length=12}
  return o};
QRF.levels=specs=>{const o=[];for(const s of specs)if(!o.includes(s.lvl))o.push(s.lvl);return o};
QRF.spots=function(id){
  if(!QRF.T[id])return null;const stg=QRF.stage(id);const specs=QRF.specs(id,stg);if(!specs.length)return null;
  const q=QUESTS[id],t=q.title,kind=stg==='ready'?'ready':'goal',out=[],push=(p,tt)=>out.push({x:p.x,y:p.y,kind,t:tt||t,q:id});
  for(const sp of specs)for(const p of QRF.live(sp))push(p);
  if(!out.length&&stg==='act'&&QRF.levels(specs).includes(LEVEL)){ // all that was to find here is found: back to the one to report to
    const r=QRF.specs(id,'ready');for(const sp of r)for(const p of QRF.live(sp))push(p)}
  if(out.length)return out;
  const ls=QRF.levels(specs).filter(l=>l!==LEVEL);if(!ls.length)return out;
  for(const Lt of ls){let d=null;for(const sp of specs)if(sp.lvl===Lt&&sp.via&&sp.via[LEVEL])d={x:sp.via[LEVEL][0],y:sp.via[LEVEL][1]};
    if(!d)try{d=questDoorTo(Lt)}catch(e){}
    if(d){const nm=(LEVEL_NAMES[Lt]||'').replace(/^The /,'the ');push(d);push(d,'Go to '+nm);return out}}
  return out};
{const _qs=questSpots;questSpots=function(){
  const out=_qs.apply(this,arguments);
  try{const F=G.qFocus;
    if(F&&qSt(F.id)==='done'&&QRF.T[F.id])G.qFocus=null;
    for(const id in QRF.T){const st=qSt(id),foc=G.qFocus&&G.qFocus.id===id&&G.qFocus.lvl===LEVEL;if(!(st==='active'||(foc&&st!=='done')))continue;
      const mine=QRF.spots(id);if(mine===null)continue;
      for(let i=out.length-1;i>=0;i--)if(out[i].q===id)out.splice(i,1);
      for(const m of mine)out.push(m)}
  }catch(e){console.error('qrings',e)}
  return out}}
{const _tl=questTargetLevel;questTargetLevel=function(id){
  try{if(QRF.T[id]){const sp=QRF.specs(id,QRF.stage(id));if(sp&&sp.length){const ls=QRF.levels(sp);return ls.includes(LEVEL)?LEVEL:ls[0]}}}catch(e){console.error('qrings',e)}
  return _tl.apply(this,arguments)}}
{const _wl=questWorldLoc;questWorldLoc=function(id){let l=_wl.apply(this,arguments);
  try{if(!l){const Lt=questTargetLevel(id),k=QRF.LOC[Lt];if(k)l=WORLD_LOCS.find(z=>z.k===k)||null}}catch(e){}
  return l}}
{const _sh=questShow;questShow=function(id){
  if(QRF.T[id]&&qSt(id)==='done'){G.qFocus=null;G.qNote={t:G.time,text:'"'+QUESTS[id].title+'" is done.'};return}
  return _sh.apply(this,arguments)}}
{const _dw=drawWorldMap;drawWorldMap=function(){const r=_dw.apply(this,arguments);
  try{const F=G.qFocus;if(F&&F.loc&&QRF.T[F.id]){const fl=WORLD_LOCS.find(z=>z.k===F.loc),Lt=questTargetLevel(F.id);
    if(fl&&Lt!==null&&LEVEL_NAMES[Lt]){ctx.save();ctx.font=`italic bold 8px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.lineJoin='round';const tt='Go to '+LEVEL_NAMES[Lt].replace(/^The /,'the '),yy=fl.y+48;
      ctx.strokeStyle='rgba(236,222,176,.95)';ctx.strokeText(tt,fl.x,yy);ctx.fillStyle='#5a2a08';ctx.fillText(tt,fl.x,yy);ctx.restore()}}}catch(e){}
  return r}}
/* ---- safety net: if a level's own map throws while it is drawn (the game would freeze), a plain map of the level with the quest rings is drawn instead, once per frame ---- */
QRF.plain=function(){
  const L=LEVELS[LEVEL];if(!L||!L.rows)return;const W=L.rows[0].length,H=L.rows.length,s=Math.max(.6,Math.min((DW-24)/W,(DH-60)/H));
  if(!QRF._pc||QRF._pc.lv!==LEVEL){const c=document.createElement('canvas');c.width=Math.ceil(W*s);c.height=Math.ceil(H*s);const x=c.getContext('2d');x.fillStyle='#d8c8a0';x.fillRect(0,0,c.width,c.height);x.fillStyle='#4a3a28';
    for(let y=0;y<H;y++){const r=L.rows[y];for(let xx=0;xx<W;xx++)if(r[xx]!=='.')x.fillRect(xx*s,y*s,s+.4,s+.4)}QRF._pc={lv:LEVEL,c}}
  const ox=(DW-W*s)/2,oy=34;if(ctx.reset)ctx.reset();ctx.save();ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle='#e8dcb8';ctx.fillRect(0,0,DW,DH);ctx.drawImage(QRF._pc.c,ox,oy);
  ctx.font=`bold 11px ${FUI}`;ctx.textAlign='center';ctx.fillStyle='#2a1a0c';ctx.fillText(LEVEL_NAMES[LEVEL]||'',DW/2,18);
  try{drawQuestRings(ox,oy,s)}catch(e){}
  if(G.C){ctx.fillStyle='#e8c020';ctx.strokeStyle='#2a1a0c';ctx.beginPath();ctx.arc(ox+(G.C.x+.5)*s,oy+(G.C.y+.5)*s,3,0,6.3);ctx.fill();ctx.stroke()}
  ctx.restore();BTNS.push({id:'ovexit',x:DW-60,y:4,w:54,h:16,up:true});ctx.save();ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle='rgba(60,40,20,.85)';ctx.fillRect(DW-60,4,54,16);ctx.fillStyle='#f0e0b0';ctx.font=`bold 9px ${FUI}`;ctx.textAlign='center';ctx.fillText('Close',DW-33,15);ctx.restore()};
{const _do=drawOverview;drawOverview=function(){try{return _do.apply(this,arguments)}catch(e){if(!QRF._warned){QRF._warned=1;console.error('the map of this level failed, a plain map is shown:',e)}try{QRF.plain()}catch(e2){}}}}
