/* ==========================================================================
   THE UNDERLEVEL, FINISHED (prefix bsu / BSU), level 476. The last pass over the Underlevel and its sea, run after every other builder (it wraps hgduBuild last):
   1. the corridors carry about 230 pieces of existing painted decor (bones, rubble, roots, old crates and barrels, chained posts, cobwebs on the walls, seated skeletons, eight small shrines with candles), and wet patches of floor;
   2. the Black Swill's island has a pale flagstone floor of its own (the old floor was black rock), real broken columns instead of thin wall pillars, braziers and lights, and a slime pool under the boss;
   3. the sea horrors keep at least 3 squares from every landing, dock and anchored boat (placed that way, and held there while they swim);
   4. the docks and landings have mooring posts, lanterns, crates, barrels, ropes and beached boats;
   5. the air: dripping water (a sound and a falling drop) and a low drifting mist on the floor;
   6. two small quests: Tolland, a stranded boatman on a small island (bsu1), and Brother Orrin and the candles of the shrines (bsu2).
   Deterministic (hgdmRng 476321). Exposes L._bsu for testing.
   ========================================================================== */
const BSU={ID:476,ZONE:3.6};
Object.assign(NPC_H,{art_wm_crate:.5,art_wm_crate_lid:.46,art_wm_barrel:.58,art_wm_bucket:.36,art_wm_chain:1.05,art_wm_web:.6,art_wm_shrine:.95,art_wm_skeleton:.5,art_wm_cage_lantern:.5,art_wm_boat:.62,art_dbones:.3,art_wm_candelabra:.7});
ENEMY_DEF.bsw.w=3.5; // it used to be taller than the cave and looked as if it hung in the air; now it sits on the island floor
/* ---------- floors made in code: pale flagstones for the island, wet floor for the puddles ---------- */
function bsuFloors(L){
  if(typeof FLOORS==='undefined')return;const hs=(x,y,s)=>{let h=(x*374761393+y*668265263+s*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296};
  if(!FLOORS.bsw_flag){const P=[];for(let i=0;i<14;i++)P.push([hs(i,1,61)*128,hs(i,2,61)*128]);const d=new Uint8ClampedArray(128*128*4);
    for(let y=0;y<128;y++)for(let x=0;x<128;x++){let d1=1e9,d2=1e9,id=0;for(let i=0;i<P.length;i++){let dx=Math.abs(x-P[i][0]),dy=Math.abs(y-P[i][1]);if(dx>64)dx=128-dx;if(dy>64)dy=128-dy;const q=Math.hypot(dx,dy);if(q<d1){d2=d1;d1=q;id=i}else if(q<d2)d2=q}
      const e=d2-d1,n=hs(x,y,5),v=(88+hs(id,3,9)*30+n*10)*(e<1.6?.4:e<3?1.12:1),o=(y*128+x)*4;d[o]=v;d[o+1]=v*.95;d[o+2]=v*.86;d[o+3]=255}
    FLOORS.bsw_flag=d}
  if(!FLOORS.hgu_wet){const b=FLOORS[L.floor]||FLOORS.dirt;if(b){const d=new Uint8ClampedArray(b.length),T=Math.PI*2;
      for(let y=0;y<128;y++)for(let x=0;x<128;x++){const o=(y*128+x)*4,lum=(b[o]+b[o+1]+b[o+2])/3,s=Math.sin(T*(x*2/128)+1.6*Math.sin(T*(y*3/128)))*Math.sin(T*(y*2/128)+1.2*Math.sin(T*(x*3/128)+.5)),gl=Math.max(0,s-.35)*95;
        d[o]=lum*.42+gl*.55;d[o+1]=lum*.5+gl*.72;d[o+2]=lum*.72+8+gl;d[o+3]=255}
      FLOORS.hgu_wet=d}}}
/* ---------- the places the horrors keep away from ---------- */
function bsuPts(L){
  if(L._bsuPts)return L._bsuPts;const O=L._hgdo,B=L._bsw,p=[];
  for(const d of O.docks){p.push([d.wx,d.wy],[d.bx,d.by])}for(const l of O.landings){p.push([l.wx,l.wy],[l.x,l.y])}for(const b of O.boats)p.push([b[0],b[1]]);
  if(B){p.push([B.boat[0],B.boat[1]],[B.landing.x,B.landing.y])}return L._bsuPts=p}
function bsuNear(x,y){
  const L=LEVELS[BSU.ID];if(!L||!L._hgdo)return 99;let m=99;
  for(const q of bsuPts(L)){const d=Math.hypot(q[0]-x,q[1]-y);if(d<m)m=d}
  try{const F=G.flags&&G.flags.hgdOcean;if(F&&F.boats)for(const q of F.boats){if(!q)continue;const d=Math.hypot(q[0]-x,q[1]-y);if(d<m)m=d}}catch(e){}
  return m}
{const _t=terrStepOK;terrStepOK=function(x0,y0,x1,y1){
  try{if(LEVEL===BSU.ID&&typeof HGO_CUR!=='undefined'&&HGO_CUR&&/^hgo/.test(HGO_CUR.t)){const a=bsuNear(x0,y0),b=bsuNear(x1,y1);if(b<BSU.ZONE&&b<=a)return false}}catch(e){}
  return _t.apply(this,arguments)}}
function bsuClearHorrors(L){ // a horror that was placed close to a landing is moved to the nearest water that is far enough from every landing
  const O=L._hgdo,W=201,H=201,ix=(x,y)=>y*W+x,occ=new Set(L.enemies.map(e=>e.x+','+e.y));let moved=0;
  for(const e of L.enemies){if(!/^hgo/.test(e.t)||bsuNear(e.x,e.y)>=BSU.ZONE+.2)continue;
    let best=null;for(let r=2;r<=16&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=e.x+dx,y=e.y+dy;
      if(x<1||y<1||x>=W-1||y>=H-1||!O.wm[ix(x,y)]||occ.has(x+','+y)||bsuNear(x,y)<BSU.ZONE+.8)continue;best=[x,y];break}
    if(best){occ.delete(e.x+','+e.y);e.x=best[0];e.y=best[1];occ.add(best[0]+','+best[1]);moved++}}
  return moved}
/* ---------- the build ---------- */
function bsuBuild(L){
  if(L._bsu)return;const O=L._hgdo,B=L._bsw;if(!O)return;
  const W=201,H=201,ix=(x,y)=>y*W+x,rnd=hgdmRng(476321),rows=L.rows.map(r=>r.split('')),fm=L.fmap.map(r=>r.split('')),DV=[[0,-1],[1,0],[0,1],[-1,0]];
  bsuFloors(L);L.floorSet=L.floorSet.slice();L.floorSet[4]='hgu_wet';if(FLOORS.bsw_flag)L.floorSet[5]='bsw_flag';
  const land=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&rows[y][x]==='.'&&!O.wm[ix(x,y)];
  const info={lk:{},shrines:[],docks:0,landings:0,pieces:0,puddles:0,horrors:0,counts:{}};
  const add=(k,x,y,o)=>{o=o||{};const e={k,x,y,hx:1,block:!!o.block,walk:!o.block,deco:true,sc:o.sc||1};if(o.ox)e.ox=o.ox;if(o.oy)e.oy=o.oy;if(o.bob!==undefined)e.bob=o.bob;if(o.npc)e.npc=o.npc;if(o.wd){e.wd=o.wd;e.pic=1;e.block=false;e.walk=true}L.decor.push(e);info.pieces++;const c=o.cat||'misc';info.counts[c]=(info.counts[c]||0)+1;return e};
  const light=(x,y,k)=>{(L.lights||(L.lights=[])).push([x,y]);info.lk[x+','+y]=k||.4}; // k: how strong the light is (a candle or a lantern is a small light)
  /* ---- 1. the island ---- */
  if(B){const cx=B.cx,cy=B.cy,R=B.R;
    for(let y=cy-13;y<=cy+13;y++)for(let x=cx-13;x<=cx+13;x++){if(x<1||y<1||x>=W-1||y>=H-1)continue;const d=Math.hypot(x-cx,y-cy);
      if(d<R+1.5&&O.isle[ix(x,y)]&&!O.wm[ix(x,y)])fm[y][x]=d<2.4?'4':'5';else if(d<R&&land(x,y)&&fm[y][x]==='0')fm[y][x]='5'}
    // the six pillars were wall squares, which looked like thin dark slivers: they become broken stone columns standing on the floor
    const pil=[];for(const [px,py] of B.pillars){rows[py][px]='.';fm[py][px]='5';add('art_hgxrock5',px,py,{block:true,sc:2.5,cat:'column'});pil.push([px,py])}
    // braziers and lights round the island, and by the landing
    const ring=[];for(let k=0;k<6;k++){const a=k*Math.PI/3+Math.PI/6,x=Math.round(cx+Math.cos(a)*4.6),y=Math.round(cy+Math.sin(a)*4.6);if(land(x,y)&&O.isle[ix(x,y)]){add('brazier',x,y,{block:true,sc:.7,cat:'brazier'});light(x,y,.9);ring.push([x,y])}}
    for(const [px,py] of pil)light(px,py,.6);
    light(cx,cy-3,.7);light(cx-3,cy+3,.7);light(cx+3,cy+3,.7);light(B.landing.x,B.landing.y,.6);
    info.island={braziers:ring.length,pillars:pil.length}}
  /* ---- 2. the docks and landings: posts, lanterns, crates, barrels, ropes and boats ---- */
  const water=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&O.wm[ix(x,y)]===1;
  const dress=(wx,wy,lx,ly,full,both)=>{ // (wx,wy) the water square beside the shore, (lx,ly) the shore square
    const dx=Math.sign(lx-wx),dy=Math.sign(ly-wy);if(!dx&&!dy)return;const px=-dy,py=dx;
    const cell=k=>{const x=lx+dx*k,y=ly+dy*k;return land(x,y)?[x,y]:null};
    const c0=cell(0),c1=cell(1),c2=cell(2);
    if(c0){add('art_wm_chain',c0[0],c0[1],{ox:px*.4,oy:py*.4,sc:.85,cat:'post'});add('art_wm_cage_lantern',c0[0],c0[1],{ox:-px*.4,oy:-py*.4,sc:.75,cat:'lantern'});light(c0[0],c0[1])}
    if(c1){add('art_wm_crate',c1[0],c1[1],{ox:px*.38,oy:py*.38,sc:.8,cat:'crate'});if(full||rnd()<.5)add('art_wm_barrel',c1[0],c1[1],{ox:-px*.38,oy:-py*.38,sc:.8,cat:'crate'});if(full)add('art_wm_chain',c1[0],c1[1],{ox:-px*.4,oy:-py*.4,sc:.9,cat:'post'})}
    if(c2&&full){add('art_wm_bucket',c2[0],c2[1],{ox:px*.3,oy:py*.3,sc:1,cat:'rope'});add('art_wm_crate_lid',c2[0],c2[1],{ox:-px*.3,oy:-py*.3,sc:1,cat:'crate'})}
    else if(c1&&!full)add('art_wm_bucket',c1[0],c1[1],{ox:px*.1,oy:py*.1+(dy?0:0),sc:.9,cat:'rope'});
    // a rowing boat drawn up in the water two squares along the shore (the party's own boats are the ones that move)
    for(const s of both?[1,-1]:[1]){const bx=wx+px*2*s,by=wy+py*2*s;if(water(bx,by)&&water(bx+dx*-0,by)&&L.decor.every(d=>!(d.x===bx&&d.y===by)))add('art_wm_boat',bx,by,{sc:1,bob:-.2,cat:'boat'})}};
  for(const d of O.docks){dress(d.wx,d.wy,d.bx,d.by,true,true);info.docks++}
  for(const l of O.landings){dress(l.wx,l.wy,l.x,l.y,false,false);info.landings++}
  if(B){ // the island landing: a post on each side of the way up, and a lantern
    const lx=B.landing.x,ly=B.landing.y;add('art_wm_chain',lx,ly,{ox:-.42,sc:.85,cat:'post'});add('art_wm_chain',lx,ly,{ox:.42,sc:.85,cat:'post'});add('art_wm_cage_lantern',lx,ly-1,{ox:.4,sc:.75,cat:'lantern'});add('art_wm_crate',lx,ly-1,{ox:-.4,sc:.75,cat:'crate'});add('art_wm_bucket',lx,ly-2,{ox:.3,sc:.9,cat:'rope'});light(lx,ly-1,.4);
    for(const s of [1,-1]){const bx=B.boat[0]+2*s,by=B.boat[1];if(water(bx,by))add('art_wm_boat',bx,by,{sc:1,bob:-.2,cat:'boat'})}}
  /* ---- 3. the horrors keep away from every landing ---- */
  info.horrors=bsuClearHorrors(L);
  /* ---- 4. the corridors ---- */
  const occ=new Set(L.decor.concat(L.items||[],L.enemies).map(d=>d.x+','+d.y));
  const keepPts=(O.keep||[]).map(k=>[k.x,k.y,k.lad?7:4]),pts=bsuPts(L);
  const open=(x,y)=>land(x,y),deg=(x,y)=>DV.filter(d=>open(x+d[0],y+d[1])).length;
  const wallDirs=(x,y)=>DV.filter(d=>!open(x+d[0],y+d[1])&&rows[y+d[1]]&&rows[y+d[1]][x+d[0]]!=='.');
  const room=(x,y)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(!open(x+i,y+j))return false;return true};
  const cand=[];for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(!open(x,y)||O.isle[ix(x,y)]||occ.has(x+','+y))continue;if(fm[y][x]!=='0')continue;
    if(keepPts.some(k=>Math.hypot(k[0]-x,k[1]-y)<k[2]))continue;if(pts.some(q=>Math.hypot(q[0]-x,q[1]-y)<4))continue;cand.push([x,y])}
  for(let i=cand.length-1;i>0;i--){const j=(rnd()*(i+1))|0;const t=cand[i];cand[i]=cand[j];cand[j]=t}
  const placed=[],free=(x,y,g)=>!occ.has(x+','+y)&&placed.every(p=>Math.abs(p[0]-x)>=g||Math.abs(p[1]-y)>=g);
  const take=(n,pred,mk,g)=>{let c=0;for(const [x,y] of cand){if(c>=n)break;if(!free(x,y,g||2)||!pred(x,y))continue;if(mk(x,y)!==false){occ.add(x+','+y);placed.push([x,y]);c++}}return c};
  const pick=a=>a[(rnd()*a.length)|0],off=()=>+((rnd()-.5)*.56).toFixed(2),towards=(x,y,k)=>{const w=wallDirs(x,y);if(!w.length)return {ox:off(),oy:off()};const d=pick(w);return {ox:d[0]*k+(d[1]?off()*.6:0),oy:d[1]*k+(d[0]?off()*.6:0)}};
  // shrines first (they need dead ends or rooms, spaced far apart): a small shrine, two candles in front of it, and a flickering light
  {const sites=[];const want=8;
    for(const gap of [34,26,20,14]){for(const [x,y] of cand){if(sites.length>=want)break;if(occ.has(x+','+y))continue;
        const dg=deg(x,y);if(dg!==1)continue;const nb=DV.find(d=>open(x+d[0],y+d[1]));if(!nb)continue;const fx=x+nb[0],fy=y+nb[1];if(occ.has(fx+','+fy)||fm[fy][fx]!=='0')continue;
        if(sites.some(s=>Math.hypot(s.x-x,s.y-y)<gap))continue;sites.push({x,y,fx,fy,nb})}if(sites.length>=want)break}
    sites.forEach((s,i)=>{const px=-s.nb[1],py=s.nb[0],q=i<3?'bsu_shr'+(i+1):null;
      add('art_wm_shrine',s.x,s.y,{block:true,sc:1,npc:q||undefined,cat:'shrine'});occ.add(s.x+','+s.y);occ.add(s.fx+','+s.fy);placed.push([s.x,s.y],[s.fx,s.fy]);
      add('art_hgxprop2',s.fx,s.fy,{ox:px*.3,oy:py*.3,sc:1.15,cat:'candle'});add('art_hgxprop2',s.fx,s.fy,{ox:-px*.3,oy:-py*.3,sc:1,cat:'candle'});
      if(i%2===0)add('art_hgxprop0',s.fx-s.nb[0]*0,s.fy,{ox:s.nb[0]*.28,oy:s.nb[1]*.28,sc:1.2,cat:'bones'});
      light(s.fx,s.fy,.3);info.shrines.push({x:s.x,y:s.y,fx:s.fx,fy:s.fy,q:q})})}
  take(30,(x,y)=>true,(x,y)=>add(pick(['art_hgxprop0','art_dbones','art_hgxprop0','art_hgxprop13']),x,y,{sc:+(1.2+rnd()*.5).toFixed(2),ox:off(),oy:off(),cat:'bones'}),3);
  take(34,(x,y)=>wallDirs(x,y).length>0,(x,y)=>{const t=pick(['art_hgxrock6','art_hgxrock3','art_hgxrock6','art_hgxrock0']);const o=towards(x,y,.3);return add(t,x,y,{sc:t==='art_hgxrock0'?.8:+(1.1+rnd()*.4).toFixed(2),ox:o.ox,oy:o.oy,cat:'rubble'})},3);
  take(24,(x,y)=>wallDirs(x,y).length>0,(x,y)=>{const o=towards(x,y,.3);return add('art_hgxprop12',x,y,{sc:+(1.3+rnd()*.4).toFixed(2),ox:o.ox,oy:o.oy,cat:'root'})},4);
  take(30,(x,y)=>deg(x,y)<=2||room(x,y),(x,y)=>{const t=pick(['art_wm_crate','art_wm_crate_lid','art_wm_barrel','art_wm_bucket','art_hgxprop6','art_wm_crate','art_hgxprop1']);const rm=room(x,y)&&rnd()<.35&&/crate|barrel/.test(t);const o=towards(x,y,.3);
    return add(t,x,y,{block:rm,sc:/hgxprop/.test(t)?1.3:1,ox:rm?0:o.ox,oy:rm?0:o.oy,cat:'crate'})},3);
  take(14,(x,y)=>wallDirs(x,y).length>0&&deg(x,y)>=2,(x,y)=>{const o=towards(x,y,.36);return add('art_wm_chain',x,y,{sc:.95,ox:o.ox,oy:o.oy,cat:'chain'})},5);
  take(16,(x,y)=>deg(x,y)===1||room(x,y),(x,y)=>{const o=towards(x,y,.2);add('art_wm_skeleton',x,y,{sc:1,ox:o.ox,oy:o.oy,cat:'skeleton'});if(rnd()<.6){const f=DV.find(d=>open(x+d[0],y+d[1]));if(f&&free(x+f[0],y+f[1],1)){add('art_hgxprop0',x+f[0],y+f[1],{sc:1.2,ox:off(),oy:off(),cat:'bones'});occ.add((x+f[0])+','+(y+f[1]))}}},4);
  // cobwebs hang on the wall faces, in corners and dead ends
  take(30,(x,y)=>wallDirs(x,y).length>0&&deg(x,y)<=2,(x,y)=>{const d=pick(wallDirs(x,y));return add('art_wm_web',x,y,{wd:[d[0],d[1]],bob:.5,cat:'web'})},3);
  /* ---- 5. wet patches of floor (puddles) ---- */
  {let n=0;for(let t=0;t<2600&&n<46;t++){const x=6+((rnd()*(W-12))|0),y=6+((rnd()*(H-12))|0);if(!open(x,y)||O.isle[ix(x,y)]||fm[y][x]!=='0'||keepPts.some(k=>Math.hypot(k[0]-x,k[1]-y)<3)||pts.some(q=>Math.hypot(q[0]-x,q[1]-y)<3))continue;
      fm[y][x]='4';for(const d of DV)if(open(x+d[0],y+d[1])&&fm[y+d[1]][x+d[0]]==='0'&&rnd()<.55)fm[y+d[1]][x+d[0]]='4';if(rnd()<.5){const d=pick(DV),e=pick(DV);const a=x+d[0]+e[0],b=y+d[1]+e[1];if(open(a,b)&&fm[b][a]==='0')fm[b][a]='4'}n++}info.puddles=n}
  /* ---- 6. the quests: the boatman on a small island, the hermit among the shrines ---- */
  try{bsuPlaceQuests(L,rows,fm,add,light,land,water,info,rnd)}catch(e){console.error('bsu quests',e)}
  L.rows=rows.map(r=>r.join(''));L.fmap=fm.map(r=>r.join(''));
  L._bsu=info}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L&&L._hgdo)try{bsuBuild(L)}catch(e){console.error('bsuBuild',e)}}}
/* the candles and lanterns are small lights: dimmer and shorter than the lamps at the ladders */
{const _s=setupLights;setupLights=function(){_s.apply(this,arguments);
  try{const U=LEVEL===BSU.ID&&LEVELS[BSU.ID]&&LEVELS[BSU.ID]._bsu;if(U&&U.lk)for(const l of LIGHTS){if(!l.free)continue;const k=U.lk[(l.x-.5)+','+(l.y-.5)];if(k){l.kI=k;l.range2=k>=.8?64:k>=.6?42:k>=.4?24:14}}}catch(e){}}}
/* ---------- the air: dripping water and a low mist ---------- */
const BSUA={mist:null,next:0,drops:[]};
function bsuMistImg(){
  if(BSUA.mist)return BSUA.mist;const c=document.createElement('canvas');c.width=512;c.height=64;const x=c.getContext('2d'),r=hgdmRng(4761);
  for(let i=0;i<24;i++){const px=r()*512,py=16+r()*32,rx=40+r()*70,ry=6+r()*9;for(const o of [-512,0,512]){const g=x.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,'rgba(190,200,215,.55)');g.addColorStop(1,'rgba(190,200,215,0)');x.save();x.translate(px+o,py);x.scale(1,ry/rx);x.fillStyle=g;x.fillRect(-rx,-rx,2*rx,2*rx);x.restore()}}
  return BSUA.mist=c}
function bsuAirOn(){return LEVEL===BSU.ID&&G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&!(G.inv&&G.inv.open)&&!G.loot&&!G.overview&&!(typeof TP!=='undefined'&&TP)}
function bsuDrip(){
  const t=G.time;if(t<BSUA.next)return;BSUA.next=t+2.2+Math.random()*5;
  BSUA.drops.push({x:24+Math.random()*372,y:128+Math.random()*52,t0:t});if(BSUA.drops.length>6)BSUA.drops.shift();
  try{if(AC&&!G.mute&&SNDOPT.amb){const f=1500+Math.random()*900;tone(f,f*.62,.07,'sine',.05,.3);tone(f*.8,f*.5,.06,'sine',.022,.42)}}catch(e){}}
function bsuAtmos(){
  if(!bsuAirOn())return;const t=G.time;bsuDrip();
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  const m=bsuMistImg(),pr=typeof hgoProx==='function'?hgoProx():0;
  for(const [sp,y,al,sc] of [[5,112,.2,1.15],[-3.4,126,.15,1.4],[8,142,.12,1.7]]){const a=Math.min(.34,al+.08*pr),w=512*sc,h=64*sc,x0=-(((t*sp)%512)+512)%512*sc;ctx.globalAlpha=a;for(let k=-1;k<=2;k++)ctx.drawImage(m,x0+k*w,y,w,h*.8)}
  ctx.globalAlpha=1;
  for(const d of BSUA.drops){const a=t-d.t0;if(a<.3){const yy=20+(d.y-20)*(a/.3)*(a/.3);ctx.strokeStyle='rgba(200,215,230,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(d.x,yy-5);ctx.lineTo(d.x,yy);ctx.stroke()}
    else if(a<.8){const k=(a-.3)/.5;ctx.strokeStyle='rgba(190,205,225,'+(.5*(1-k)).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(d.x,d.y,2+k*9,.6+k*2.2,0,0,6.3);ctx.stroke()}}
  ctx.restore()}
{const _h=uwHud;uwHud=function(){_h.apply(this,arguments);try{bsuAtmos()}catch(e){}}}
/* ---------- the quests ---------- */
const BSUD1=khQD("Tolland, boatman. I was ferrying a sack of salt across the Black Sea when something took my oar and my boat with it. I swam here and I have been on this rock since. The torches ran out days ago, and it is very dark. Bring me 4 torches and I will pay you what I have, which is more than you would think. I put a good deal away over the years.",
  'Four torches. Thank you. The island is out on the Black Sea, so you will have come by boat. Keep it moored.',
  (n,m)=>'I need 4 torches. You have '+Math.min(n||0,m)+'. Bring the rest and I will pay you.',
  'Four torches! I can see my own hands again.',
  'Light at last. Here is what I put away. I will wait for a boat to come by, and sit here in the light until it does.',
  'The torches burn well. I will not be going anywhere until a boat comes.',"Here are your torches.");
QUESTS.bsu1={title:'Torches for the Boatman',who:'Tolland, a stranded boatman',desc:'Tolland the boatman is stuck on a small island in the Black Sea, in the dark, because his torches ran out. Bring him 4 torches. The island is out on the sea near the first dock, so a boat is needed.',need:4,goal:()=>bagCount('torch'),take:{torch:4},reward:{gold:4000,xp:25000,items:['potion6']}};
QAREA.bsu1='The Deeper Hollow';
khNpc('bsu_boatman','Tolland, a stranded boatman','fisher',d=>qNode('bsu1',BSUD1),{sc:1,q:['bsu1']});
const BSUD2=khQD("I am Brother Orrin. Years ago I came down with a sack of candles to light the little shrines along these corridors, so that nobody dies in the dark without one light near. My knees have gone and I cannot walk the corridors now. Will you light the candles at three of the shrines for me? Each one is a small stone shrine at a dead end, with two candles in front of it. Touch the shrine and it will be lit.",
  'Thank you. The three shrines are in different parts of the Underlevel, each at the end of a dead-end corridor. The quest log says where the next one is.',
  (n,m)=>(n||0)+' of '+m+' shrines are lit. The others are at the ends of dead-end corridors. Touch a shrine to light it.',
  'You have lit all three. I can see them from here, I think. A very small glow.',
  'Three lights, and nobody has to die in the dark now. Here is what the pilgrims left in the box. I have no use for it.',
  'The candles are burning. I will sit here and watch the glow.',"All three are lit.");
{const F=()=>G.flags,names=['first','second','third'];
  const where=n=>{const L=LEVELS[BSU.ID],s=L&&L._bsu&&L._bsu.shrines.find(q=>q.q==='bsu_shr'+n);if(!s)return 'in a dead end somewhere in the Underlevel';const v=s.y<67?'north':s.y>133?'south':'',h=s.x<67?'west':s.x>133?'east':'';const r=(v&&h)?v+'-'+h:v||h||'centre';
    return 'in a dead-end corridor in the '+r+' of the Underlevel';};
  const q={title:'Candles for the Shrines',who:'Brother Orrin, a hermit',need:3,goal:()=>[1,2,3].reduce((n,i)=>n+(F()['bsuShr'+i]?1:0),0),reward:{gold:5000,xp:30000,items:['potion6','potion6']}};
  Object.defineProperty(q,'desc',{enumerable:true,get(){const i=[1,2,3].find(i=>!F()['bsuShr'+i]);return i?'Light the candles at the '+names[i-1]+' of three shrines: a small stone shrine with two candles in front of it, '+where(i)+'. Touch the shrine to light it.':'Go back to Brother Orrin. All three shrines are lit.'}});
  Object.defineProperty(q,'targets',{enumerable:false,get(){const i=[1,2,3].find(i=>!F()['bsuShr'+i]);return i?['bsu_shr'+i]:[]}});
  QUESTS.bsu2=q;QAREA.bsu2='The Deeper Hollow';
  khNpc('bsu_orrin','Brother Orrin, a hermit','monk',d=>qNode('bsu2',BSUD2),{sc:1,q:['bsu2']});
  [1,2,3].forEach(i=>khNpc('bsu_shr'+i,'A small shrine','art_wm_shrine',d=>{const f=F();
    if(qSt('bsu2')==='active'&&!f['bsuShr'+i]){f['bsuShr'+i]=1;yrStep('You light the candles at the shrine. ('+q.goal()+'/3)');return say('A small stone shrine at the end of the corridor, with two stubs of candle in front of it. You light them. The flames stand straight up in the still air.',[BYE])}
    return say(f['bsuShr'+i]?'The candles at the shrine are burning.':'A small stone shrine at the end of the corridor, with two stubs of candle in front of it. They are unlit.',[BYE])},{sc:1}))}
function bsuPlaceQuests(L,rows,fm,add,light,land,water,info,rnd){
  const O=L._hgdo,W=201,ix=(x,y)=>y*W+x,occ=new Set(L.decor.concat(L.enemies).map(d=>d.x+','+d.y));
  // the boatman: the small island nearest the first dock (a land square with water all round it)
  const dk=O.docks[0],isl=(O.islets||[]).filter(p=>water(p[0]-2,p[1])&&water(p[0]+2,p[1])&&water(p[0],p[1]-2)&&water(p[0],p[1]+2)&&!occ.has(p[0]+','+p[1])).sort((a,b)=>Math.hypot(a[0]-dk.wx,a[1]-dk.wy)-Math.hypot(b[0]-dk.wx,b[1]-dk.wy))[0];
  if(isl){const [x,y]=isl;
    add('fisher',x,y,{npc:'bsu_boatman',sc:1,cat:'npc'});
    for(const [k,dx,dy,o] of [['art_wm_crate',0,1,{ox:.25}],['art_wm_bucket',1,0,{ox:.2,sc:.9}],['art_hgxprop0',-1,0,{sc:1.3}],['art_wm_barrel',1,1,{ox:-.2}]]){if(land(x+dx,y+dy))add(k,x+dx,y+dy,Object.assign({cat:'islet'},o))}
    add('brazier',x,y-1,{block:true,sc:.7,cat:'brazier'});light(x,y,.7);info.boatman={x,y}}
  // the hermit: standing in front of the fourth shrine (a dead end), so that the shrines and the man lie close together; the other three shrines are the ones to light
  const s4=info.shrines[3];if(s4){add('monk',s4.fx,s4.fy,{npc:'bsu_orrin',sc:1,cat:'npc'});info.orrin={x:s4.fx,y:s4.fy}}}
