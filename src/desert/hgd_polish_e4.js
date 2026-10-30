/* ==========================================================================
   THE DEEPER HOLLOW, WATER ZONE, POLISH ROUND 4 (prefix hgw4 / HGW4). Runs after hgd_polish_e3.js; patches the built levels 477 (Drowned Maze) and 475 (boat lakes).
   1. Shell Chests quest (wq4): exactly one flag per distinct chest, moved chests included (old saves are folded onto the chest's original position).
   2. Creatures: at least 6 squares from every set piece, never in a straight line of sight within 8 of one, off the approach squares.
   3. Writing: every note has an explicit short title (no cut sentences, never "Note"); signs are re-lettered after the text arrives; signs are a little larger.
   4. Docks: each of the six lake docks has its own painted-stone arch, sky, water, beacon and moorings (the arch tile is wall geometry, so it is made per dock); boats are smaller, lifted and tinted lightly.
   5. Proportions: props near a set piece never outgrow it; net racks are capped; big fish keep 2.6 squares from the camera.
   6. Variety: no repeated candelabra, crystal cluster, barrel or lantern inside one set piece; variants rotate between the 13 pieces.
   7. Landmarks: every straight run of 8 or more squares has a lit tall landmark on the sight line at least every 6 squares.
   Exposes LEVELS[477]._hgw4 and LEVELS[475]._hgw4 for tools/polish/w4_audit.js.
   ========================================================================== */
const HGW4={ID:477,LAKE:475,map:{}};
/* ---------- 1. the Shell Chests quest ---------- */
function hgw4Moved(){ // position now -> position it stood on before it was moved (kept in the save as a flag so that any level can count)
  const F=G.flags;if(!F)return {};F.hgdwMoved=F.hgdwMoved||{};for(const k in HGW4.map)F.hgdwMoved[k]=HGW4.map[k];return F.hgdwMoved}
function hgw4Norm(){ // one flag for each chest: the original position
  try{const F=G.flags;if(!F||!F.hgdwOpened)return;const m=hgw4Moved();for(const pos in m){if(F.hgdwOpened[pos]){F.hgdwOpened[m[pos]]=1;delete F.hgdwOpened[pos]}}}catch(e){console.error('hgw4 norm',e)}}
function hgw4Opened(){const F=G.flags||{},f=F.hgdwOpened||{},m=Object.assign({},F.hgdwMoved||{},HGW4.map),s=new Set();for(const k in f)if(f[k])s.add(m[k]||k);return s.size}
try{if(QUESTS.wq4){QUESTS.wq4.goal=()=>Math.min(hgw4Opened(),12);if(typeof HGDQ_DEF!=='undefined'&&HGDQ_DEF.wq4)HGDQ_DEF.wq4.goal=QUESTS.wq4.goal}}catch(e){console.error('hgw4 wq4',e)}
{const _lf=lootFor;lootFor=function(d){const r=_lf.apply(this,arguments);try{if(LEVEL===HGDW.ID&&d&&d.hgdwTier)hgw4Norm()}catch(e){}return r}}
/* ---------- 3. titles: written by hand, matched by the first words of the note ---------- */
const HGW4_TITLES=[ // [first words, title of one to four words]
  ['A brass plate at the foot','Four Saints'],['The archivist moved','Archivist\'s Note'],['Cut into the rim of the bell','Bell Rim'],['Scratched on the boat','Ferry Hull'],['A shrine to the pond saint','Pond Saint'],
  ['Written on the frame','Mirror Frame'],['A diver\'s slate','Hest\'s Slate'],['Scratched on a clam shell','Clam Shell'],['A small brass plate','Fair Measure'],['Chalked on a crate','Cargo Notice'],
  ['A fisher\'s note: I hung','Three Lanterns'],['The stone says','Rune Words'],['Scratched small: A dead end','A Dead End'],['Chalked: Turn back','Turn Back'],['Written in oil: Two lefts','Two Lefts'],
  ['Scratched: Somebody sat','Someone Sat Here'],['Carved: I counted forty','Forty Breaths'],['A fisher\'s mark','Eel Mark'],['Chalked: My brother','Green Walls'],['NOTICE','Warden\'s Notice'],
  ['Carved in the wall at the crossing','Steps 22 East'],['A lantern-maker','Out 46 West'],['Painted on the stone in fading','Land 56 North'],['Scratched with a spoon handle','Steps 86 North'],
  ['A ferryman\'s tally','Air 42 South'],['Chiselled in neat capitals','Stairs 46 West'],['Written in lamp oil','Stairs 97 East'],['A sailor\'s rhyme','Light 59 South'],
  ['Scratched under the bell','Bell Foundry'],['A ticket stub','Ferry Ticket'],['Small offerings','Offerings'],['A second card','Mirror Card'],['Scratched on a tin cup','Tin Cup'],
  ['Chalked on the rock','Count Twice'],['Weights stacked','Stamped Weights'],['A ledger page','Cargo Ledger'],['A fisherman\'s knot','Lucky Knot'],['Small stones piled','Pilgrim Stones'],['Pinned under the notice','Diver Names']];
function hgw4Title(d){const t=String(d.hgdwText||'');for(const [a,b] of HGW4_TITLES)if(t.indexOf(a)===0)return b;return null}
function hgw4Relabel(d){ // a sign whose lettering is missing, was made before its title existed, or came out as a blank "Note"
  try{if(!d||!d.k)return false;
    if(d.hgdwText&&!d.hgw4t){const t=hgw4Title(d);if(t){d.label=t;d.hgw4t=1}}
    if(!d.hgt&&!d.hgtBase){if(d.label&&typeof hgtOne==='function')hgtOne(d);return false}
    const want=hgtClean(d.label||'');if(!want||d.hgt===want)return false;
    if(d.hgtBase){if(d.pic&&d.wd)d.lk=undefined;else d.k=d.hgtBase}
    d.hgt=undefined;return hgtOne(d)}catch(e){return false}}
function hgw4Fill(d){ // a playing copy that lost its words (the engine copies a fixed list of fields): take them from the level's own scenery
  try{if(d.npc!=='hgdw_note'||d.hgdwText)return;const L=LEVELS[LEVEL];if(!L||!L.decor)return;
    const s=L.decor.find(q=>q.hgdwText&&q.npc===d.npc&&q.x===d.x&&q.y===d.y&&(!d.wd||!q.wd||(q.wd[0]===d.wd[0]&&q.wd[1]===d.wd[1])));if(s){d.hgdwText=s.hgdwText;if(s.label)d.label=s.label}}catch(e){}}
function hgw4Signs(list){let n=0;for(const d of list||[]){if(!d)continue;hgw4Fill(d);if(d.hgdwText!==undefined||d.hgtBase||d.hgt)if(hgw4Relabel(d))n++;
    // signs are a little bigger, so that the lettering reads from three squares (true height 0.62 or more)
    if((d.hgtBase||d.hgt)&&!d.pic&&!d.hgw4s){try{const h=hgweHt(d);if(h>0&&h<.62){d.sc=+(d.sc*.62/h).toFixed(3)}d.hgw4s=1}catch(e){}}}return n}
/* ---------- 2, 5, 6, 7: the maze ---------- */
const HGW4_VAR={ // families of props that are swapped so that no set piece repeats one: [kind, height]
  candle:[['art_wm_candelabra',.8],['art_wm_orb_pedestal',.7],['art_hgtb_glasspost',1.0]],
  crystal:[['art_wm_crystal_small',.3],['art_wm_crystal_teal',.4],['art_wm_crystal_tall',.65]],
  barrel:[['art_wm_barrel',.4],['art_wm_keg',.36],['art_wm_crate',.38],['uw_amphora',.44]],
  lantern:[['art_hgtb_lamp_tall',1.1],['art_hgt_gardenlantern',.95],['art_wm_lamp_post',1.05]]};
const HGW4_FAM={art_wm_candelabra:'candle',art_wm_orb_pedestal:'candle',art_wm_crystal_small:'crystal',art_wm_crystal_teal:'crystal',art_wm_crystal_tall:'crystal',art_wm_barrel:'barrel',art_wm_keg:'barrel',uw_amphora:'barrel',art_hgtb_lamp_tall:'lantern',art_hgt_gardenlantern:'lantern'};
function hgw4Maze(L){
  const info=L._hgw4={moved:0,swapped:0,landmarks:0,capped:0,labels:0,chestsMoved:0,enemies:0};
  const S=L.rows.length,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]],have=k=>IMG[k]&&IMG[k].width;
  const E=L._hgdwe||{vignettes:[]},st=(L._hgdw&&L._hgdw.stairs)||[],far=(L._hgdw&&L._hgdw.far)||{x:-9,y:-9};
  const R=(a,b,c)=>hash2(a,b,c+9400);
  // ----- the chests that were moved: remember them for the quest and for the saves -----
  for(const d of L.decor)if(d.k==='uw_shellchest'&&d.hgdwOrig){HGW4.map[d.x+','+d.y]=d.hgdwOrig[0]+','+d.hgdwOrig[1];info.chestsMoved++}
  // ----- titles for every note -----
  for(const d of L.decor)if(d.hgdwText!==undefined||d.npc==='hgdw_note'){const t=hgw4Title(d);if(t){d.label=t;d.hgw4t=1;info.labels++}}
  // ----- creatures keep well away from every set piece, its straight lines of sight and the stairs -----
  {const P=E.vignettes.map(v=>[v.x,v.y]);
   const lineSeen=(x,y,px,py)=>{if(x!==px&&y!==py)return false;const dx=Math.sign(px-x),dy=Math.sign(py-y);let cx=x,cy=y;while(cx!==px||cy!==py){cx+=dx;cy+=dy;if(!open(cx,cy))return false}return true};
   const dist=(x,y)=>{let m=1e9;for(const q of P){let d=Math.hypot(q[0]-x,q[1]-y);if(d<8&&lineSeen(x,y,q[0],q[1]))d-=2;if(d<m)m=d}return m};
   const other=[];for(const d of L.decor)if(d.k==='uw_shellchest')other.push([d.x,d.y,3]);else if(d.hgdwText&&(d.pic||d.npc))other.push([d.x,d.y,2]);for(const i of L.items)other.push([i.x,i.y,2]);for(const s of st){other.push([s.ax,s.ay,3]);other.push([s.x,s.y,3])}
   const solid=new Set(L.decor.filter(d=>d.block&&!d.pic).map(d=>d.x+','+d.y));
   const isFar=e=>Math.abs(e.x-far.x)<=2&&Math.abs(e.y-far.y)<=2;
   const okAt=(x,y,self)=>open(x,y)&&!solid.has(x+','+y)&&dist(x,y)>=6&&other.every(q=>Math.hypot(q[0]-x,q[1]-y)>=q[2])&&L.enemies.every(e=>e===self||Math.hypot(e.x-x,e.y-y)>=1.6);
   for(const e of L.enemies){if(isFar(e)||okAt(e.x,e.y,e))continue;let best=null,bd=1e9;
     for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(isFar({x,y})||!okAt(x,y,e))continue;const d=Math.hypot(x-e.x,y-e.y);if(d<bd){bd=d;best=[x,y]}}
     if(best){e.x=best[0];e.y=best[1];info.moved++}}
   info.enemies=L.enemies.length}
  // ----- proportions: props near a set piece never outgrow it, net racks are capped -----
  for(const v of E.vignettes){const piece=L.decor.filter(d=>!d.pic&&d.x===v.x&&d.y===v.y&&d.block)[0];const ph=piece?hgweHt(piece):.9;const cap=Math.max(.26,Math.min(.5,ph*.55));
    for(const d of L.decor){if(d.pic||d===piece||d.hgdwText||!d.k||d.hgdwm||Math.hypot(d.x-v.x,d.y-v.y)>3.2)continue;if(!/^art_wm_barrel|^art_wm_keg|^art_wm_crate$|^yar_nets|^yar_pots|^uw_amphora|^art_wm_bucket/.test(d.k))continue;const h=hgweHt(d);if(h>cap){d.sc=+(d.sc*cap/h).toFixed(3);info.capped++}}}
  // the squares from which a set piece is looked at (up to four squares out along each straight line): nothing big stands in the way of the view
  {const ap=new Map();for(const v of E.vignettes)for(const D4 of D){for(let k=2;k<=4;k++){const x=v.x+D4[0]*k,y=v.y+D4[1]*k;if(!open(x,y))break;ap.set(x+','+y,D4)}}
   for(const d of L.decor){if(d.pic||d.hgdwText||d.hgdwm||!d.k||!/^art_wm_(barrel|keg|crate|bucket|cage_lantern|candelabra|orb_pedestal|skeleton)|^uw_amphora|^yar_|^art_hgxprop/.test(d.k))continue;const D4=ap.get(d.x+','+d.y);if(!D4)continue;
     const h=hgweHt(d);if(h>.28&&h<.9){if(d.block){d.block=false;d.walk=true}d.sc=+(d.sc*.28/h).toFixed(3);if(D4[0])d.oy=(d.oy||0)>=0?.34:-.34;else d.ox=(d.ox||0)>=0?.34:-.34;info.capped++}}}
  for(const d of L.decor)if(!d.pic&&/^yar_nets/.test(d.k)){const h=hgweHt(d);if(h>.55){d.sc=+(d.sc*.55/h).toFixed(3);info.capped++}}
  // ----- variety inside each set piece, and between them -----
  E.vignettes.forEach((v,vi)=>{const seen=new Set(),zone=L.decor.filter(d=>!d.pic&&!d.hgdwText&&!d.hgdwm&&HGW4_FAM[d.k]&&Math.hypot(d.x-v.x,d.y-v.y)<=3.2).sort((a,b)=>a.x-b.x||a.y-b.y);
    for(const d of zone){const fam=HGW4_VAR[HGW4_FAM[d.k]];let start=fam.findIndex(f=>f[0]===d.k);if(start<0)start=0;start=(start+vi)%fam.length;let pick=null;
      for(let i=0;i<fam.length;i++){const f=fam[(start+i)%fam.length];if(!seen.has(f[0])&&have(f[0])){pick=f;break}}
      if(pick&&pick[0]!==d.k){const oh=hgweHt(d);d.k=pick[0];d.sc=+hgweSc(pick[0],Math.min(pick[1],Math.max(.2,oh*(pick[1]>.9?1:1.15)))).toFixed(3);info.swapped++}
      seen.add(d.k)}});
  // ----- landmarks on the sight line of every long straight run -----
  const AMB=[1,.78,.42],TEAL=[.5,1,.9],VIO=[.8,.55,1];
  const LM=[['art_hgtb_lamp_tall',1.2,AMB],['art_wm_crystal_tall',1.0,TEAL],['art_hgxstat1',1.3,TEAL],['art_wm_candelabra',.85,AMB],['art_hgtb_glasspost',1.1,TEAL],['art_wm_lamp_post',1.1,AMB],['art_hgt_gardenlantern',1.0,VIO],['art_wm_orb_pedestal',.8,VIO]];
  const tallOn=d=>!d.pic&&!/^art_hgwm_|^uw_seagrass|^art_hgdf_|^uw_vent|^uw_sw|^ltree/.test(d.k)&&hgweHt(d)>=.8;
  {const runs=[];for(let y=1;y<S-1;y++){let x=1;while(x<S-1){if(!open(x,y)){x++;continue}const x0=x;while(open(x,y))x++;if(x-x0>=8)runs.push({h:1,c:y,a:x0,n:x-x0})}}
   for(let x=1;x<S-1;x++){let y=1;while(y<S-1){if(!open(x,y)){y++;continue}const y0=y;while(open(x,y))y++;if(y-y0>=8)runs.push({h:0,c:x,a:y0,n:y-y0})}}
   const solid=new Set(L.decor.filter(d=>d.block&&!d.pic).map(d=>d.x+','+d.y));const stSq=new Set();for(const s of st){stSq.add(s.x+','+s.y);stSq.add(s.ax+','+s.ay)}
   let lm=0;
   for(const r of runs){const cell=i=>r.h?[r.a+i,r.c]:[r.c,r.a+i];
     const on=new Array(r.n).fill(false);for(let i=0;i<r.n;i++){const c=cell(i);if(L.decor.some(d=>d.x===c[0]&&d.y===c[1]&&(tallOn(d)||(d.hgdwText&&d.pic))))on[i]=true}
     for(const side of [1,-1]){ // looking along the run from each end, something tall within 6 squares and never a gap of 9
       let last=side>0?-1:r.n;for(let step=0;step<r.n;step++){const i=side>0?step:r.n-1-step;if(on[i]){last=i;continue}
         if(Math.abs(i-last)>=6&&Math.abs(i-last)>=6){ // place it here, or on the nearest free square
           let pi=-1;for(let k=0;k<4&&pi<0;k++){for(const j of [i-side*k,i+side*k]){if(j<1||j>=r.n-1)continue;const c=cell(j);if(!solid.has(c[0]+','+c[1])&&!stSq.has(c[0]+','+c[1])&&!on[j]&&!L.items.some(t=>t.x===c[0]&&t.y===c[1])){pi=j;break}}}
           if(pi<0)continue;const c=cell(pi);let L0=LM[(lm++)%LM.length],g=0;while(!have(L0[0])&&g++<8)L0=LM[(lm++)%LM.length];
           L.decor.push({k:L0[0],x:c[0],y:c[1],block:false,walk:true,deco:true,sc:+hgweSc(L0[0],L0[1]).toFixed(3),hgdwe:1,hgw4:1,ox:r.h?0:(R(c[0],c[1],1)<.5?-.14:.14),oy:r.h?(R(c[0],c[1],1)<.5?-.14:.14):0});
           HGDWE.lights.push({x:c[0],y:c[1],col:L0[2],kI:1.3,r2:40});on[pi]=true;last=pi;info.landmarks++}}}}}
  // ----- the writing: relabel the signs of the built level -----
  info.relabelled=hgw4Signs(L.decor);
}
{const _b=hgdwBuild;hgdwBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGDW.ID];if(L&&L._hgw3&&!L._hgw4)try{hgw4Maze(L)}catch(e){console.error('hgw4 maze',e)}return r}}
// the playing copy of the scenery is made from the level's, and loses the labels on the way: letter the signs again once it is there
{const _rs=reset;reset=function(){const r=_rs.apply(this,arguments);try{if(LEVEL===HGDW.ID||LEVEL===HGD.ID){if(LEVEL===HGDW.ID){hgw4Moved();hgw4Norm()}hgw4Signs(G.decor)}}catch(e){console.error('hgw4 reset',e)}return r}}
{const _sl=setupLights;setupLights=function(){const r=_sl.apply(this,arguments);try{if(LEVEL===HGDW.ID||LEVEL===HGD.ID)hgw4Signs(G.decor)}catch(e){}return r}}
/* ---------- 4. the docks of the three lakes ---------- */
const HGW4_DOCK=[ // per lake: shape of the arch, light, water, stone
  {shape:'round',sky:['#2b1b0e','#c98b3a'],water:['#7a5420','#1f1408'],stone:[255,228,186],post:'#ffcf7a'},
  {shape:'point',sky:['#0b2a2c','#46b8ac'],water:['#1f7a74','#062321'],stone:[196,240,236],post:'#9ff2e4'},
  {shape:'flat',sky:['#1a1030','#8a5ad0'],water:['#52368f','#130b28'],stone:[226,206,255],post:'#c9a2ff'}];
function hgw4DockTex(li,role){
  const key='hgw4_dock'+li+role;if(IMG[key]&&IMG[key].width)return key;
  const T=HGW4_DOCK[li%3],B=HGW3_BEACON[(li+(role==='far'?1:0))%3],bi=IMG[B[0]],wall=IMG.tex_abbeywall;if(!bi||!bi.width)return null;
  const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');
  if(wall)x.drawImage(wall,0,0,128,128);else{x.fillStyle='#4a4638';x.fillRect(0,0,128,128)}
  x.globalCompositeOperation='multiply';x.fillStyle='rgb('+T.stone.join(',')+')';x.fillRect(0,0,128,128);x.globalCompositeOperation='source-over';
  const arch=()=>{x.beginPath();if(T.shape==='round'){x.moveTo(16,128);x.lineTo(16,58);x.arc(64,58,48,Math.PI,0);x.lineTo(112,128)}
    else if(T.shape==='point'){x.moveTo(18,128);x.lineTo(18,70);x.quadraticCurveTo(20,34,64,6);x.quadraticCurveTo(108,34,110,70);x.lineTo(110,128)}
    else{x.moveTo(14,128);x.lineTo(14,34);x.lineTo(114,34);x.lineTo(114,128)}x.closePath()};
  x.save();arch();x.clip();
  const hz=T.shape==='flat'?66:72;let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,T.sky[0]);g.addColorStop(1,T.sky[1]);x.fillStyle=g;x.fillRect(0,0,128,hz);
  g=x.createLinearGradient(0,hz,0,128);g.addColorStop(0,T.water[0]);g.addColorStop(1,T.water[1]);x.fillStyle=g;x.fillRect(0,hz,128,128-hz);
  x.fillStyle='rgba(8,14,16,.78)';x.beginPath();x.moveTo(0,hz);for(let i=0;i<=16;i++)x.lineTo(i*8,hz-3-((hash2(li,i,role==='far'?7:3)*9)|0));x.lineTo(128,hz);x.closePath();x.fill(); // the far shore
  x.fillStyle=T.sky[1];x.globalAlpha=.35;x.fillRect(0,hz-1,128,2);x.globalAlpha=1;
  const bh=T.shape==='flat'?32:38,bw=bi.width*bh/bi.height,bx=64+(role==='far'?-12:8)-bw/2,by=hz+6-bh;
  x.drawImage(bi,bx,by,bw,bh);
  x.save();x.beginPath();x.rect(0,hz,128,60);x.clip();x.translate(0,hz*2+12);x.scale(1,-1);x.globalAlpha=.28;x.drawImage(bi,bx,by,bw,bh*.55,bx,by+bh*.45,bw,bh*.55);x.restore();x.globalAlpha=1;
  if(role==='dep'){const bk=hgw3Tint('yar_boat_row',HGW4_BOAT[li%3].col,.3,'hgw4_tb'+li,HGW4_BOAT[li%3].flip),bm=bk&&IMG[bk];if(bm){const bw2=[46,60,40][li%3],bh2=bw2*bm.height/bm.width,bx2=[44,56,60][li%3]-bw2/2+20;x.drawImage(bm,bx2,104-bh2,bw2,bh2)}} // the boat at its mooring
  x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=1;for(let i=0;i<7;i++){const yy=hz+8+i*7,xx=20+((hash2(li,i,5)*50)|0);x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+26+i*4,yy);x.stroke()}
  x.restore();
  x.lineJoin='round';arch();x.strokeStyle='#0d1315';x.lineWidth=5;x.stroke();arch();x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1;x.stroke();
  x.strokeStyle='rgba(8,10,12,.55)';x.lineWidth=2; // stones of the arch ring
  if(T.shape==='round'){for(let a=0;a<=8;a++){const t=Math.PI+a*Math.PI/8;x.beginPath();x.moveTo(64+Math.cos(t)*48,58+Math.sin(t)*48);x.lineTo(64+Math.cos(t)*58,58+Math.sin(t)*58);x.stroke()}}
  else if(T.shape==='point'){for(let a=0;a<6;a++){const yy=70-a*10;x.beginPath();x.moveTo(18+a*2,yy);x.lineTo(8+a*1.5,yy-2);x.stroke();x.beginPath();x.moveTo(110-a*2,yy);x.lineTo(120-a*1.5,yy-2);x.stroke()}}
  else{for(let a=0;a<6;a++){x.beginPath();x.moveTo(16+a*20,34);x.lineTo(16+a*20,22);x.stroke()}x.fillStyle='#1b1b1e';x.fillRect(10,26,108,8)}
  // jetty: planks across the front, two posts with a lamp each (the far dock has a rope and one lamp)
  x.fillStyle='#6a4a28';x.fillRect(10,112,108,12);x.strokeStyle='#241406';x.lineWidth=1.4;x.strokeRect(10,112,108,12);for(let i=1;i<7;i++){x.beginPath();x.moveTo(10+i*15.4,112);x.lineTo(10+i*15.4,124);x.stroke()}
  for(const px of (role==='far'?[24]:[22,106])){x.fillStyle='#4a3018';x.fillRect(px-3,86,6,28);x.strokeRect(px-3,86,6,28);const lg=x.createRadialGradient(px,82,1,px,82,12);lg.addColorStop(0,T.post);lg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=lg;x.fillRect(px-12,70,24,24);x.fillStyle=T.post;x.beginPath();x.arc(px,82,3.2,0,7);x.fill()}
  if(role==='far'){x.strokeStyle='#cbb68a';x.lineWidth=1.6;x.beginPath();x.moveTo(24,96);x.quadraticCurveTo(64,112,104,98);x.stroke()}
  x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,125,125);
  IMG[key]=c;return key}
function hgw4Docks(L){ // the pictures may still be loading when the level is built: whatever is not done yet is tried again until it is
  if(!L||!L.chars||!L._hgdl)return 0;const info=L._hgw4=L._hgw4||{docks:0},TM=ohTiles(),chD=String.fromCharCode(0x360);let pending=0;
  L._hgw4done=L._hgw4done||{};
  L._hgdl.lakes.forEach(k=>{if(k.wm||!k.docks)return;for(const role of ['dep','far']){const id=k.i+role;if(L._hgw4done[id])continue;const d=k.docks[role];if(!d)continue;
    const tex=hgw4DockTex(k.i,role);if(!tex){pending++;continue}
    const ch=String.fromCharCode(0x370+k.i*2+(role==='far'?1:0));OH_STY['hgw4_'+tex]=Object.assign({},OH_STY.hgdb_dock||{},{door:tex});const gid=TM.make('door','hgw4_'+tex,2.7).gid;
    L.chars[ch]=gid;const row=L.rows[d.y];if(row&&row[d.x]===chD)L.rows[d.y]=row.slice(0,d.x)+ch+row.slice(d.x+1);
    try{if(LEVEL===HGD.ID&&G.grid&&G.grid[d.y])G.grid[d.y][d.x]=gid}catch(e){}
    L._hgw4done[id]=1;info.docks++}});
  return pending}
function hgw4DockLoop(){let n=0;const t=setInterval(()=>{n++;try{const L=LEVELS[HGD.ID];if(!L||!L._hgdl||n>80){clearInterval(t);return}if(hgw4Docks(L)===0)clearInterval(t)}catch(e){clearInterval(t)}},1500)}
{const _b=hgdBuild;hgdBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(L&&L._hgw3&&!L._hgw4){L._hgw4={docks:0};try{if(hgw4Docks(L)>0)hgw4DockLoop()}catch(e){console.error('hgw4 docks',e)}}return r}}
// the boats at anchor: lighter paint, smaller, lifted off the bottom of the screen, one pose for each lake
const HGW4_BOAT=[{col:'#e08a2a',a:.3,sc:.5,flip:0,ox:-.22,bob:.03},{col:'#2bd0bc',a:.3,sc:.62,flip:1,ox:.2,bob:.02},{col:'#9a5ae8',a:.3,sc:.44,flip:1,ox:.0,bob:.04},{col:'#4a7a5a',a:.2,sc:.55,flip:0,ox:.1,bob:.03}];
{const _s=hgdbSync;hgdbSync=function(){const r=_s.apply(this,arguments);
  try{const L=LEVELS[HGD.ID];if(G.decor&&L&&L._hgdl)for(const d of G.decor)if(d.hgdBoatSpr){let li=0,bd=1e9;for(const k of L._hgdl.lakes){const dd=Math.hypot((k.x0+k.x1)/2-d.x,(k.y0+k.y1)/2-d.y);if(dd<bd){bd=dd;li=k.i}}
    const T=HGW4_BOAT[li%HGW4_BOAT.length],key=hgw3Tint('yar_boat_row',T.col,T.a,'hgw4_boat'+li,T.flip);if(key){d.k=key;d.sc=T.sc;d.ox=T.ox;d.bob=T.bob}}}catch(e){}
  return r}}
/* ---------- 5b. big fish keep their distance from the camera (the fish themselves are drawn in hgd_polish_e.js) ---------- */
HGW4.fishMin=2.6;

/* ---------- round 4 critic fixes (zones north and towns): the three darkest danger halls get a hanging lamp each, with a warm pool ---------- */
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];const r=_b.apply(this,arguments);const L=LEVELS[HGD.ID];
  if(!had&&L&&L._hgdp&&L.decor&&!L._hgr4)try{L._hgr4=1;const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
    for(const nm of ['Beetle Row','The Bug Nest','Blue Bug Nest 2','The Lamp Clearing']){const z=L._hgdp.zones.find(q=>q.name===nm);if(!z)continue;let n=0;
      for(let rr=0;rr<=6&&n<2;rr+=2)for(let dy=-rr;dy<=rr&&n<2;dy+=2)for(let dx=-rr;dx<=rr&&n<2;dx+=2){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||L.decor.some(d=>d.x===x&&d.y===y&&(d.block||d.npc)))continue;
        if(HGDPC.lights.some(q=>Math.hypot(q.x-x,q.y-y)<3))continue;
        L.decor.push({k:'hgt_hanglamp',x,y,block:false,walk:true,deco:true,sc:1,cl:1});L.lights=L.lights||[];L.lights.push([x,y]);HGDPC.lights.push({x,y,col:[1,.78,.45],kI:.95,r2:64});n++}}}
  catch(e){console.error('hgr4 lights',e)}
  return r}}
/* ---------- the castle standard (the tidy pass of wenlock_polish.js, wlTidy), run last on the finished maze and the Underlevel ----------
   475: the set-piece props and items that later passes walled in step back out against their wall; wall decals and notes that were left on solid squares, on open
   water or on a face already taken move to a real wall face; the Unfinished Arch, a doorway standing in the air at the end of a dead end, is taken away (the mason's cart and barrel stay).
   476: the Messenger's five letters and the hooks are on real walls. The huts of the maze villages are cut to their feet so that they stand on the ground. */
{const _b=hgdBuild;hgdBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGD.ID];
  if(L&&L.decor&&!L._wlt)try{for(let i=0;i<8;i++)wlTrimFoot('icn_hgdi_hut'+i);wlTidy(L,{id:HGD.ID,only:[1,3,6],arches:'remove'})}catch(e){console.error('hgd tidy',e)}
  return r}}
{const _b=hgduBuild;hgduBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGDU.ID];
  if(L&&L.decor&&!L._wlt)try{wlTidy(L,{id:HGDU.ID,only:[1,3]})}catch(e){console.error('hgdu tidy',e)}
  return r}}
/* the fishing places (fishing_places.js) open some lake walls into water when the maze is first loaded: the pictures on those walls are hung again on real walls,
   before the level's pieces are read (the fishing pass is run first here, it runs once) */
{const _ll=loadLevel;loadLevel=function(n){
  if(n===HGD.ID){const L=LEVELS[n];if(L&&L._wlt&&!L._wltAgain)try{if(typeof fplPrep==='function')fplPrep(n);wlTidy(L,{id:n,only:[3],again:1})}catch(e){console.error('hgd tidy on load',e)}}
  return _ll.apply(this,arguments)}}
{const _b=hgdwBuild;hgdwBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGDW.ID];
  if(L&&L.decor&&!L._wlt)try{wlTidy(L,{id:HGDW.ID,only:[0]})}catch(e){console.error('hgdw tidy',e)}   // the Drowned Maze: pairs of pieces keep their offsets
  return r}}
