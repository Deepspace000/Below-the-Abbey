/* ==========================================================================
   THE WORLD MAP: THE BLIGHTED ROAD, SALE, THE PALE LANDS AND THE VIOLET TOWER (prefix wmb / WMB). Last map file in the injection order (after maps_world_west.js).
   The whole planned western part of the game is on the world map now, built or not (NEXT_PART_PLAN.md): the road west from Wenlock's west gate through the ten places of the
   Blighted Lands (levels 84 to 90), the town of Sale (90) at its end, and beyond it the Pale Lands (100) with the Pale Spire.
   One table, WMB_PLACES. A place is BUILT when one of its level ids exists (LEVELS or a KH_LAZY stub): then it behaves like any other place on the map (picture, level, you-are-here,
   the Go to area list and teleporters, all through its `lv`). Until then it is a "not yet open" marker: faint name, a small padlock, no levels, so it cannot be jumped to or
   travelled to. To open a place later, just register its level ids (the table says which: 9600 + 10 * n and the nine after it, see NEXT_PART_PLAN.md); nothing here changes.
   Sale: another builder makes the town itself and may add its own WORLD_LOCS entry or atlas row named 'Sale'; wmbSync() (run when the map is first made) adopts that entry and
   drops this placeholder, so the name is never listed twice.
   ========================================================================== */
const WMB={marks:null,ref:null,pts:null};
/* the ids of a place: its main level and the nine after it (rooms, cellars, floors). Sale and the Pale Lands have no ids yet: their builders put them in `ids`. */
const wmbRange=b=>Array.from({length:10},(_,i)=>b+i);
/* k, name on the map, full name (atlas), rating shown while unbuilt, x, y, level ids, kind of place, pictures [picture, across, down, size, size is width], note for the atlas */
const WMB_PLACES=[
  {k:'bl_toll',n:'Toll House',full:'The Toll House of the Road Wardens',r:'84',x:-392,y:304,ids:wmbRange(9610),ic:'trees',pic:[['i_town',0,0,10]],note:'dead hedges and the Wardens’ toll house, just outside the west gate'},
  {k:'bl_ashen',n:'Ashenfold Farm',full:'Ashenfold Farm',r:'85',x:-438,y:282,ids:wmbRange(9620),ic:'trees',pic:[['l_hamlet',0,0,19,1]],note:'a gothic farmhouse, walking scarecrows, a barn and a cellar'},
  {k:'bl_church',n:'Church of the Hollow Saint',full:'The Church of the Hollow Saint',r:'86',x:-484,y:306,ids:wmbRange(9630),ic:'abbey',pic:[['i_abbey',0,0,13]],note:'an unholy church with inverted bells'},
  {k:'bl_gallow',n:'Gallowmere',full:'Gallowmere',r:'86',x:-530,y:278,ids:wmbRange(9640),ic:'trees',pic:[['l_drowned',0,0,20,1]],note:'a drowned fen village with gibbet trees, reached by a causeway'},
  {k:'bl_bone',n:'Bone Orchard',full:'The Bone Orchard',r:'87',x:-574,y:306,ids:wmbRange(9650),ic:'trees',pic:[['i_oaks',0,0,13]],note:'white trees, a field of crypts and the Reaper-Farmer'},
  {k:'bl_lantern',n:'Lanternrest Waystation',full:'Lanternrest Waystation',r:'87',x:-600,y:262,ids:wmbRange(9660),ic:'castle',pic:[['i_castle',0,0,14]],note:'the walled fort of the Oldhaven garrison, the one safe place on the road'},
  {k:'bl_vault',n:'Vault of Maldrake',full:'The Vault of Maldrake',r:'88-89',x:-552,y:222,ids:wmbRange(9670),ic:'crypt',pic:[['i_crypt',0,0,14]],note:'a crypt of many floors under a hill of barrows'},
  {k:'bl_abbey',n:'Hollowbell Abbey',full:'Hollowbell Abbey',r:'88',x:-596,y:186,ids:wmbRange(9680),ic:'abbey',pic:[['l_monastery',0,0,20,1]],note:'a ruined monastery and a plague bell'},
  {k:'bl_rookery',n:'Rookery Mill',full:'The Rookery Mill',r:'89',x:-642,y:212,ids:wmbRange(9690),ic:'trees',pic:[['l_ruin',0,0,18,1]],note:'a windmill and a court of crows'},
  {k:'bl_bridge',n:'Pale Bridge',full:'The Pale Bridge and the Gate of Sale',r:'90',x:-692,y:228,ids:wmbRange(9700),ic:'castle',pic:[['i_castle',0,0,12]],note:'the last bridge before Sale, held by a pale knight'},
  {k:'sale',n:'Sale',full:'Sale',r:'90',x:-746,y:246,ids:[],ic:'town',pic:[['i_town',0,0,22]],note:'a grim gothic town of the undead'},
  {k:'palespire',n:'The Pale Spire',full:'The Pale Spire',r:'100',x:-906,y:150,ids:[],ic:'castle',pic:[['i_spire',0,0,44]],note:'a vast castle, climbed to the top',pale:1},
  {k:'palelands',n:'The Pale Lands',full:'The Pale Lands',r:'100',x:-904,y:236,ids:[],ic:'trees',pic:[],note:'the dimension of the Pale Sovereign',pale:1,region:1}];
/* the Blighted Road, in order, from Wenlock's west gate to Sale, and the track on to the Pale Spire */
const WMB_ROAD=['westgate','bl_toll','bl_ashen','bl_church','bl_gallow','bl_bone','bl_lantern','bl_vault','bl_abbey','bl_rookery','bl_bridge','sale'];
const wmbHas=id=>!!((typeof LEVELS!=='undefined'&&LEVELS[id])||(typeof KH_LAZY!=='undefined'&&KH_LAZY[id]));
const wmbBuilt=l=>!!(l&&l.lv&&l.lv.length);
function wmbBuild(){
  if(typeof WORLD_LOCS==='undefined'||typeof WMN_SPEC==='undefined')return;
  for(const P of WMB_PLACES){
    if(P.region||WORLD_LOCS.some(l=>l.k===P.k))continue;   // the Pale Lands are a country: a name on the map, not a marker
    const o={k:P.k,n:P.n,x:P.x,y:P.y,ic:P.ic,bl:P,planned:P.r,get lv(){return P.ids.filter(wmbHas)}};   // lv is looked up each time: a place opens by itself once its levels exist
    WORLD_LOCS.push(o);WMN_SPEC[P.k]=P.pic}
  // the Violet Tower: the foot of it (level 460) is built, and stands beside the Orange Spire, where the story puts it
  const oc=WORLD_LOCS.find(l=>l.k==='orangecastle');
  if(oc&&!WORLD_LOCS.some(l=>l.k==='violettower')){const i=oc.lv.indexOf(460);if(i>=0)oc.lv.splice(i,1);
    WORLD_LOCS.push({k:'violettower',n:'The Violet Tower',lv:[460],x:66,y:322,ic:'castle',violet:1});WMN_SPEC.violettower=[['i_spire',0,0,21]]}
  const R=(a)=>{if(!WORLD_ROADS.some(r=>r.join()===a.join()))WORLD_ROADS.push(a)};
  R(WMB_ROAD);R(['sale','palespire']);R(['orangecastle','violettower']);
  if(typeof WMN_REG!=='undefined'){if(!WMN_REG.some(q=>q[0]==='The Blighted Lands')){WMN_REG.push(['The Blighted Lands',-514,246,14]);WMN_REG.push(['The Pale Lands',-904,236,17])}}
  if(typeof QWORLD_ID!=='undefined'){}}
wmbBuild();
/* Sale (and anything else) that another builder has registered under the same name: use that entry, at this place, and drop the placeholder */
function wmbSync(){
  const mine=WORLD_LOCS.find(l=>l.k==='sale'&&l.bl);
  const other=WORLD_LOCS.find(l=>l!==mine&&l.n==='Sale');
  if(mine&&other){const i=WORLD_LOCS.indexOf(mine);if(i>=0)WORLD_LOCS.splice(i,1);other.x=mine.x;other.y=mine.y;if(!other.ic)other.ic='town';if(!WMN_SPEC[other.k])WMN_SPEC[other.k]=mine.bl.pic;other.bl=mine.bl;
    for(const r of WORLD_ROADS)for(let i=0;i<r.length;i++)if(r[i]==='sale')r[i]=other.k;
    for(let i=WORLD_ROADS.length-1;i>=0;i--){const r=WORLD_ROADS[i];if(r.every(k=>k===r[0]))WORLD_ROADS.splice(i,1)}   // a road from Sale to Sale (the builder's own road to the placeholder)
    WMB.saleKey=other.k}
  // a place of the table that has no entry (a builder removed it): nothing to do
}
{const _mi=mpWorldInit;mpWorldInit=function(){try{wmbSync()}catch(e){console.error('wmb sync',e)}WMB.marks=null;WMB.pts=null;return _mi.apply(this,arguments)}}
/* planned levels show on the map until real ones exist */
{const _lr=locRating;locRating=function(loc){const r=_lr.apply(this,arguments);return r||(loc&&loc.planned&&!loc.region?loc.planned:null)}}
/* the area names of Sale's quests, once its builder uses them, are not known here; quest dots follow QWORLD_ID in the other files */

/* ---------- pictures: the painted places, faded and greyed for the blight, pale for the Pale Lands, violet for the Violet Tower; a padlock on a place that is not open ---------- */
function wmbLock(c,x,y,s){
  c.save();c.translate(x,y);c.scale(s,s);c.lineJoin='round';
  c.fillStyle='rgba(236,222,176,.9)';c.beginPath();c.arc(0,0,6.2,0,6.3);c.fill();
  c.strokeStyle='#2a1a0c';c.lineWidth=1.1;c.beginPath();c.arc(0,-1.6,2.5,Math.PI,0);c.stroke();
  c.fillStyle='#8a6a2a';c.strokeStyle='#2a1a0c';c.lineWidth=.8;c.fillRect(-3.1,-1.2,6.2,4.8);c.strokeRect(-3.1,-1.2,6.2,4.8);
  c.fillStyle='#2a1a0c';c.beginPath();c.arc(0,1,.8,0,6.3);c.fill();c.restore()}
{const _ico=wmnIco;wmnIco=function(l){
  if(l.violet){ctx.save();ctx.filter='hue-rotate(250deg) saturate(1.25) brightness(.95)';_ico(l);ctx.restore();return}
  if(!l.bl){_ico(l);return}
  const P=l.bl,open=wmbBuilt(l),L=wmnLay(l);
  if(P.region)return;   // the Pale Lands are a country, not a picture: the veil and the name
  ctx.save();
  ctx.filter=P.pale?'grayscale(.85) brightness(1.22) contrast(.9)':'grayscale(.5) sepia(.2) brightness(.94)';
  if(!open)ctx.globalAlpha=.62;
  _ico(l);ctx.restore();
  if(!open&&L){const ib=L.ib;wmbLock(ctx,ib[2]-4,ib[1]+9,.55)}}}
/* the names of places that are not open are faint */
{const _lab=wmnLabel;wmnLabel=function(l,v,txtH){
  if(l.bl&&!wmbBuilt(l)){ctx.save();ctx.globalAlpha=.55;_lab.call(this,l,false,txtH);ctx.restore();return}
  _lab.apply(this,arguments)}}
/* the key gets two more rows */
{const _kr=wmnKeyRows;wmnKeyRows=function(c){const r=_kr.apply(this,arguments);
  r.push(['Not yet open',(a,b)=>wmbLock(c,a+2,b+.5,.62)]);
  r.push(['Blighted road',(a,b)=>{c.strokeStyle='rgba(42,26,12,.85)';c.lineWidth=3.6;c.beginPath();c.moveTo(a-6,b);c.lineTo(a+6,b);c.stroke();c.strokeStyle='#8a8a74';c.lineWidth=2.2;c.stroke()}]);return r}}

/* ---------- the ground: grey-green blight along the road, dead trees, hills, grave markers, the fen, the orchard, and the pale veil of the Pale Lands ---------- */
function wmbMakeMarks(){
  const M=mpWorldM,H=hash2,K=WMB;K.ref=WMN.lay;K.marks=[];K.road=null;
  const a=WORLD_LOCS.find(l=>l.k==='westgate'),sk=WMB.saleKey||'sale',b=WORLD_LOCS.find(l=>l.k===sk);
  if(M.rd&&a&&b)K.road=M.rd.find(r=>Math.hypot(r.pts[0][0]-a.x,r.pts[0][1]-a.y)<4&&Math.hypot(r.pts[r.pts.length-1][0]-b.x,r.pts[r.pts.length-1][1]-b.y)<4)||null;
  const sa=WORLD_LOCS.find(l=>l.k==='palespire');K.track=(M.rd&&b&&sa)?M.rd.find(r=>Math.hypot(r.pts[0][0]-b.x,r.pts[0][1]-b.y)<4&&Math.hypot(r.pts[r.pts.length-1][0]-sa.x,r.pts[r.pts.length-1][1]-sa.y)<4)||null:null;
  const out=K.marks,ok=(x,y,d)=>M.isLand(x,y)&&!wmnBlocked(x,y,d);
  const roadAt=(x,y)=>{if(!K.road)return 99;let m=99;for(const p of K.road.pts){const d=Math.hypot(p[0]-x,p[1]-y);if(d<m)m=d}return m};
  if(K.road){const p=K.road.pts;let acc=0,n=0;
    for(let i=1;i<p.length;i++){acc+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);if(acc<5)continue;acc=0;n++;
      for(let t=0;t<2;t++){const h1=H(n,t,811),h2=H(n,t,812),h3=H(n,t,813),side=h1<.5?-1:1,off=8+h2*26,x=p[i][0]+side*off*.6+(h3-.5)*10,y=p[i][1]+side*off*.8;
        if(x>-372||!ok(x,y,6)||roadAt(x,y)<6)continue;
        const r=h3;out.push(r<.58?['t',x,y,5+h2*4.5]:r<.72?['g',x,y,(h1*20)|0]:r<.93?['h',x,y,.7+h2*.4,(h1*1000)|0]:['c',x,y])}}}
  // the Pale Lands: white dead trees and little swirls of mist
  for(let i=0;i<70;i++){const h1=H(i,1,821),h2=H(i,2,821),x=-904+(h1-.5)*250,y=190+(h2-.5)*190;if(x<-1040||x>-790||!ok(x,y,6))continue;out.push(['p',x,y,5+H(i,3,821)*4])}
  // Gallowmere: a fen with reeds; the Bone Orchard: pale trees in rows
  const fen=WORLD_LOCS.find(l=>l.k==='bl_gallow');if(fen)K.fen=[fen.x,fen.y+7];
  const orc=WORLD_LOCS.find(l=>l.k==='bl_bone');
  if(orc)for(let i=0;i<4;i++)for(let j=0;j<3;j++){const x=orc.x+30+i*7,y=orc.y-6+j*7;if(ok(x,y,3))out.push(['o',x,y])}
  if(fen)for(let i=0;i<26;i++){const h1=H(i,1,831),h2=H(i,2,831),x=fen.x+(h1-.5)*62,y=fen.y+7+(h2-.5)*24;if(((x-fen.x)/31)**2+((y-fen.y-7)/12)**2<1&&!wmnBlocked(x,y,2))out.push(['r',x,y])}}
function wmbGround(V,z){
  const c=ctx,M=mpWorldM;if(!M.rd||!WMN.ok)return;
  if(!WMB.marks||WMB.ref!==WMN.lay){try{wmbMakeMarks()}catch(e){WMB.marks=[];console.error('wmb marks',e)}}
  const K=WMB,sp=WORLD_LOCS.find(l=>l.k==='palespire');
  // the blighted ground: a grey-green wash along the road, laid in three widths so that its edge is soft
  if(K.road&&K.road.pts.length>2){const p=K.road.pts;c.save();c.clip(M.landP);c.lineJoin='round';c.lineCap='round';
    for(const [w,al] of [[78,.06],[54,.07],[32,.08]]){c.strokeStyle=`rgba(74,90,62,${al})`;c.lineWidth=w;c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}c.restore()}
  // the road itself, inked and greyed
  for(const [rd,w] of [[K.road,3.6],[K.track,2.4]]){if(!rd)continue;const p=rd.pts;c.save();c.lineJoin='round';c.lineCap='round';
    c.strokeStyle='rgba(42,26,12,.62)';c.lineWidth=Math.max(w+1.4,2/z);c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
    c.strokeStyle='rgba(150,146,120,.85)';c.lineWidth=Math.max(w-.4,1.2/z);c.stroke();c.restore()}
  // the Pale Lands: a veil of pale mist over the whole far west, thickest round the Spire
  if(sp&&V.x0<-760&&V.x1>-1100){c.save();c.clip(M.landP);
    for(const [cx,cy,rx,ry,al] of [[-904,200,170,150,.34],[-900,160,95,85,.3],[-960,236,90,60,.18]]){c.save();c.translate(cx,cy);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(232,228,244,${al})`);g.addColorStop(.6,`rgba(226,222,238,${al*.55})`);g.addColorStop(1,'rgba(226,222,238,0)');c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()}
    c.strokeStyle='rgba(120,116,150,.28)';c.lineWidth=mpWorldLw(.5);for(let i=0;i<14;i++){const h1=hash2(i,1,841),h2=hash2(i,2,841),x=-904+(h1-.5)*230,y=190+(h2-.5)*170,r=5+hash2(i,3,841)*8;if(wmnBlocked(x,y,r*.5))continue;c.beginPath();for(let a=0;a<Math.PI*2.6;a+=.2){const rr=r*.18+a*r*.16;a?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.7):c.moveTo(x+rr,y)}c.stroke()}
    c.restore()}
  if(K.fen){const [fx,fy]=K.fen;c.save();c.fillStyle='rgba(72,100,100,.32)';c.strokeStyle='rgba(42,26,12,.35)';c.lineWidth=mpWorldLw(.4);c.beginPath();c.ellipse(fx,fy,32,12.5,0,0,6.3);c.fill();c.stroke();
    c.fillStyle='rgba(150,186,180,.3)';c.beginPath();c.ellipse(fx-4,fy-1,19,6.5,0,0,6.3);c.fill();c.restore()}
  for(const m of K.marks){const x=m[1],y=m[2];if(x<V.x0||x>V.x1||y<V.y0||y>V.y1)continue;
    if(m[0]==='t'||m[0]==='p'){const h=m[3],pale=m[0]==='p';c.strokeStyle=pale?'rgba(255,255,255,.9)':'rgba(48,34,22,.85)';c.lineWidth=mpWorldLw(pale?.7:.5);
      if(pale){c.save();c.strokeStyle='rgba(90,88,116,.55)';c.lineWidth=mpWorldLw(1.5);c.beginPath();c.moveTo(x,y);c.lineTo(x,y-h);c.stroke();c.restore();c.strokeStyle='rgba(250,250,255,.95)'}
      c.beginPath();c.moveTo(x,y);c.lineTo(x,y-h);c.moveTo(x,y-h*.55);c.lineTo(x-h*.34,y-h*.85);c.moveTo(x,y-h*.4);c.lineTo(x+h*.36,y-h*.7);c.moveTo(x,y-h);c.lineTo(x+h*.16,y-h*1.18);c.moveTo(x,y-h*.85);c.lineTo(x-h*.14,y-h*1.08);c.stroke()}
    else if(m[0]==='g'){wmnDraw(c,'grv'+m[3],x,y,6.5,false)}
    else if(m[0]==='h'){c.save();c.filter='grayscale(.6) brightness(.95)';wmnItem(c,[3,x,y,m[3],m[4]],z);c.restore()}
    else if(m[0]==='c'){c.strokeStyle='rgba(42,26,12,.85)';c.lineWidth=mpWorldLw(.5);c.fillStyle='#b8a47a';c.fillRect(x-2.4,y-2.2,4.8,2.2);c.strokeRect(x-2.4,y-2.2,4.8,2.2);c.beginPath();c.arc(x-1.3,y+.2,.9,0,6.3);c.arc(x+1.3,y+.2,.9,0,6.3);c.stroke()}
    else if(m[0]==='o'){c.strokeStyle='rgba(48,34,22,.75)';c.lineWidth=mpWorldLw(.4);c.beginPath();c.moveTo(x,y);c.lineTo(x,y-2.2);c.stroke();c.fillStyle='rgba(240,236,220,.95)';c.beginPath();c.arc(x,y-3.2,1.25,0,6.3);c.fill();c.stroke()}
    else if(m[0]==='r'){c.strokeStyle='rgba(50,70,50,.8)';c.lineWidth=mpWorldLw(.35);c.beginPath();c.moveTo(x,y);c.lineTo(x-.5,y-2.6);c.moveTo(x+.7,y);c.lineTo(x+1,y-2.2);c.stroke()}}}
{const _cr=mpWorldCreatures;mpWorldCreatures=function(V,z){try{wmbGround(V,z)}catch(e){console.error('wmb ground',e)}_cr.apply(this,arguments)}}
/* the names of the two lands, and the road's own name written along it */
{const _n=mpWorldNames;mpWorldNames=function(V,z){_n.apply(this,arguments);
  try{const c=ctx,fx=(s,x,y,sz,col,halo)=>{c.save();c.font=`${sz}px ${FTITLE}`;if('letterSpacing' in c)c.letterSpacing='1.5px';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=3.4;c.strokeStyle=halo;c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore()};
    fx('The Blighted Lands',-514,246,14,'rgba(52,64,44,.92)','rgba(226,216,176,.62)');
    fx('The Pale Lands',-904,236,17,'rgba(96,92,128,.9)','rgba(240,238,248,.6)')}catch(e){console.error('wmb names',e)}}}

/* ---------- the atlas: a page of the road, in the style of the other unreached places (names scrambled and faint until the party has been there) ---------- */
{const _ad=wmwAtlasData;wmwAtlasData=function(){const d=_ad.apply(this,arguments);
  const named=nm=>d.some(g=>g.rows.some(r=>{const ids=Array.isArray(r[0])?r[0]:[r[0]];return (r[1]||(ids.length?WMW_LEVELNAME(ids[0]):''))===nm}));
  const row=P=>[P.ids.filter(wmbHas).length?P.ids.filter(wmbHas):[],P.full,P.note,P.r];
  const road=WMB_PLACES.filter(P=>P.k.startsWith('bl_')),rows=road.map(row);
  if(!named('Sale')&&!WORLD_LOCS.some(l=>l.n==='Sale'&&!l.bl))rows.push(row(WMB_PLACES.find(P=>P.k==='sale')));
  const grp=[{t:'The Blighted Road, west of Wenlock',sw:'graves',rows}];
  const pale=WMB_PLACES.filter(P=>P.pale).map(row);grp.push({t:'The Pale Lands',sw:'wenlock',rows:pale});
  const i=d.findIndex(g=>g.t==='Under the Well of Wenlock');d.splice(i<0?1:i,0,...grp);return d}}
