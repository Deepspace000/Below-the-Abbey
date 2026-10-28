/* ==========================================================================
   THE DEEPER HOLLOW, WATER ZONE, POLISH ROUND 3 (prefix hgw3 / HGW3). Runs after hgd_polish_e.js and the signage pass; patches the BUILT levels 477 (Drowned Maze) and 475 (boat lakes).
   1. Six lone set pieces (mirror, diver's camp, pearl grotto, scales, rune stone, smugglers' cache) are built out into scenes of 4 to 8 props with a light and a story note.
   2. Moss and tall plants never stand within two squares of a set piece, a sign or the board; moss is capped low.
   3. Landmarks: no square of the maze is more than about ten steps from something worth looking at.
   4. Creatures keep five squares from the warden's chest. Fish keep clear of notes and are capped small.
   5. Old saves: chest state is saved by position and by the old position, so moved chests are found again and opened ones stay opened.
   6. Every note and sign has a label (one to four words) and text.
   7. Fog: a tinted haze band over the viewport, a different colour for each lake and each region of the maze.
   8. The three lakes: own boat colour, size and pose, own beacon straight ahead of each dock, darker lobster pots.
   Exposes LEVELS[477]._hgw3 and LEVELS[475]._hgw3 for the audit (tools/polish/w3_audit.py).
   ========================================================================== */
const HGW3={ID:477,LAKE:475};
const HGW3_N={
  mirror2:'A second card tucked into the frame: Whoever stands in front of this glass sees the lamps lit and the door open. Whoever stands beside it sees only water. Stand beside it.',
  diver2:'Scratched on a tin cup: Hest, if you come back for your share, the lantern is still lit. I did not wait long. I waited as long as the oil lasted.',
  grotto2:'Chalked on the rock: Count the pearls twice. The clams count them too, and they have never once lost count.',
  scales2:'Weights stacked beside the scales, each stamped with a name. The smallest says Kindness. The largest says Gold. They weigh exactly the same.',
  rune2:'Small stones piled at the foot of the tall slab, one for each visitor who read the letters aloud. There are only three. The rest read them quietly.',
  bell2:'Scratched under the bell frame: Cast in the abbey foundry, blessed by seven monks. The water has blessed it since, and the bell has been very quiet about its feelings.',
  ferry2:'A ticket stub stuck to the hull: One crossing, any dawn. Paid in full. Not refundable, not returnable, not afloat.',
  shrine2:'Small offerings crowd the niche: a button, a pearl, a child\'s tooth. The saint has refused none of them.',
  board2:'Pinned under the notice: the names of divers who read this and went on. The list is long and the ink is fresh.',
  nook2:'A fisherman\'s knot tied round the lamp hook: For luck, and for finding the way back.',
  cache2:'A ledger page weighed down with a keg: Forty crates in, thirty nine out. The fortieth is under here somewhere. Do not ask what is in it.'};
const HGW3_LABELS=[ // [first words of the text, title]
  ['The archivist moved','The Archivist'],['Pinned to the shelf','Lent Books'],['Cut into the rim','The Bell'],['A brass plate at the foot','Four Saints'],['Scratched on the boat','The Ferry'],
  ['A diver','Diver\'s Slate'],['Chalked on a crate','Cargo Notice'],['Scratched on a clam','Clam Shell'],['The stone says','The Rune'],['A shrine to the pond','Pond Saint'],
  ['A small brass plate','Fair Measure'],['A fisher','Fisher\'s Note'],['Written on the frame','Mirror Frame'],['Carved at the base','The Owl'],['NOTICE','Warden\'s Notice'],
  ['Cut into the pedestal','The Orb'],['Tied to the rack','Net Rack'],['Scratched on a stone','Anemones'],['A card with wax','Candle Card'],
  ['A second card','Mirror Card'],['Scratched under the bell','Bell Frame'],['A ticket stub','Ferry Ticket'],['Small offerings','Offerings'],['Pinned under the notice','Diver Names'],['A fisherman','Lucky Knot'],['Scratched on a tin','Diver\'s Cup'],['Chalked on the rock','Clam Warning'],['Weights stacked','Stamped Weights'],['Small stones piled','Pilgrim Stones'],['A ledger page','Cargo Ledger'],
  ['Scratched small','Scratched Words'],['Scratched:','Scratched Words'],['Chalked','Chalk Marks'],['A child','A Child\'s Hand'],['Written in oil','Oil Writing']];
function hgw3Label(txt,d){
  txt=String(txt||'');for(const [a,t] of HGW3_LABELS)if(txt.indexOf(a)===0)return t;
  if(/steps|stairs|warden|chamber|north|south|east|west|left|right|turn/i.test(txt))return d&&d.hgs==='waymarker'?'Waymarker':'Signpost';
  return d&&/slate|plaque|tablet/.test(d.hgs||'')?'Old Inscription':'Wall Note'}
// a darkened copy of a picture, and a coloured one, for the boats and pots
const HGW3_IMG=new Map();
function hgw3Tint(k,col,a,name,flip){const im=IMG[k];if(!im||!im.width)return null;const key=name;if(IMG[key]&&IMG[key].width)return key;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');if(flip){x.translate(im.width,0);x.scale(-1,1)}x.drawImage(im,0,0);x.setTransform(1,0,0,1,0,0);
  x.globalCompositeOperation='source-atop';x.globalAlpha=a;x.fillStyle=col;x.fillRect(0,0,c.width,c.height);IMG[key]=c;if(NPC_H[k]!==undefined)NPC_H[key]=NPC_H[k];return key}
function hgw3Maze(L){
  const info=L._hgw3={vig:0,props:0,notes:0,mossCut:0,mossCap:0,tallCut:0,landmarks:0,piranha:0,labels:0,newNotes:0};
  const S=L.rows.length,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]],have=k=>IMG[k]&&IMG[k].width;
  const st=(L._hgdw&&L._hgdw.stairs)||[],E=L._hgdwe||{vignettes:[]};
  const isMoss=d=>/^art_hgwm_moss/.test(d.k),isPlant=d=>/^art_hgwm_|^uw_seagrass|^art_hgdf_plant[0-9]/.test(d.k)&&!d.hgdwe;
  const R=(a,b,c)=>hash2(a,b,c+9300);
  const stSq=new Set();for(const s of st){stSq.add(s.x+','+s.y);if(s.ax!==undefined)stSq.add(s.ax+','+s.ay)}
  // ----- protected squares: set pieces, signs, the board, chests, the ruin arch -----
  const prot=[];for(const v of E.vignettes)prot.push([v.x,v.y]);
  for(const d of L.decor){if(d.k==='uw_shellchest')prot.push([d.x,d.y]);else if(d.hgdwText&&(d.pic||d.npc))prot.push([d.x,d.y]);else if(/arch|noticeboard/.test(d.k)&&!d.pic)prot.push([d.x,d.y])}
  for(const s of st){prot.push([s.x,s.y])}
  const nearProt=(x,y,r)=>prot.some(q=>Math.hypot(q[0]-x,q[1]-y)<=r);
  // ----- 2. moss and tall plants away from the pieces worth seeing -----
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.pic||d.hgdwe)continue;
    if(isMoss(d)&&nearProt(d.x,d.y,2.3)){L.decor.splice(i,1);info.mossCut++;continue}
    if(isPlant(d)&&nearProt(d.x,d.y,2.3)&&hgweHt(d)>.4){L.decor.splice(i,1);info.tallCut++;continue}
    if(isMoss(d)){const h=hgweHt(d);if(h>.25){d.sc=+(d.sc*.25/h).toFixed(3);info.mossCap++}}}
  // ----- 1. scenes -----
  const bfs=(sx,sy,maxd)=>{const dist=new Map([[sx+','+sy,0]]),q=[[sx,sy]];for(let i=0;i<q.length;i++){const [x,y]=q[i],dd=dist.get(x+','+y);if(dd>=maxd)continue;for(const [a,b] of D){const nx=x+a,ny=y+b,k=nx+','+ny;if(open(nx,ny)&&!dist.has(k)){dist.set(k,dd+1);q.push([nx,ny])}}}return q.map(c=>[c[0],c[1],dist.get(c[0]+','+c[1])])};
  const solidAt=new Set(L.decor.filter(d=>d.block&&!d.pic).map(d=>d.x+','+d.y).concat(L.items.map(i=>i.x+','+i.y),L.enemies.map(e=>e.x+','+e.y)));
  const cnt=(x,y)=>L.decor.filter(d=>d.x===x&&d.y===y&&!d.pic&&!isPlant(d)&&!/^art_hgdf_vine|^uw_vent/.test(d.k)).length;
  const add=(k,x,y,h,o)=>{if(!have(k)||!open(x,y))return false;L.decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true,sc:+hgweSc(k,h).toFixed(3),hgdwe:1,hgw3:1},o||{}));info.props++;return true};
  const lamp=(x,y,col,kI,r2)=>HGDWE.lights.push({x,y,col,kI,r2});
  const wallNote=(cells,txt,pref)=>{for(const [x,y] of cells){for(const [a,b] of (pref||D)){if(!L.rows[y+b]||L.rows[y+b][x+a]!=='#')continue;
      if(L.decor.some(d=>d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b&&!/^art_hgdf_vine/.test(d.k)))continue;
      for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b)L.decor.splice(i,1)}
      L.decor.push({k:'hl_p_note',x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,npc:'hgdw_note',hgdwText:txt,bob:.6,hgdwe:1,hgw3:1});info.newNotes++;return true}}return false};
  const AMB=[1,.78,.42],TEAL=[.5,1,.9],VIO=[.8,.55,1];
  const SCENES={
   'Mirror':{col:VIO,note:HGW3_N.mirror2,props:[['art_wm_candelabra',.8],['uw_amphora',.42],['art_hgxprop2',.2],['art_hgxprop9',.3],['art_hgtb_plant_glowshrooms',.34],['art_wm_bucket',.24]]},
   'Diver\'s camp':{col:TEAL,note:HGW3_N.diver2,props:[['art_wm_barrel',.4],['yar_nets',.7],['art_wm_cage_lantern',.5],['art_hgxprop12',.3],['yar_pots',.3],['uw_amphora',.4],['art_wm_skeleton',.3]]},
   'Pearl grotto':{col:TEAL,note:HGW3_N.grotto2,props:[['uw_clam',.28],['art_wm_crystal_teal',.5],['art_wm_crystal_small',.3],['uw_anemone',.3],['art_hgxprop11',.3],['uw_clam',.34]]},
   'The scales':{col:AMB,note:HGW3_N.scales2,props:[['art_hgtb_lantern',.7],['art_wm_crate',.35],['art_wm_barrel',.42],['art_hgxprop6',.24],['art_hgxprop10',.08],['art_wm_bucket',.24]]},
   'Rune stone':{col:VIO,note:HGW3_N.rune2,props:[['art_wm_crystal_small',.3],['art_wm_candelabra',.75],['art_hgxprop9',.3],['art_hgxprop0',.1],['art_hgxprop2',.2],['art_wm_skeleton',.3]]},
   'Sunken Bell':{col:TEAL,note:HGW3_N.bell2,props:[['art_wm_crystal_small',.3],['art_hgxprop6',.24],['uw_clam',.3],['art_wm_bucket',.24],['yar_nets',.7],['art_hgxprop12',.3]]},
   'Wreck of the Ferry':{col:AMB,note:HGW3_N.ferry2,props:[['yar_pots',.3],['art_wm_keg',.4],['yar_nets',.7],['art_wm_bucket',.24],['art_hgxprop2',.2],['art_wm_cage_lantern',.5]]},
   'Saint\'s shrine':{col:VIO,note:HGW3_N.shrine2,props:[['art_wm_candelabra',.75],['uw_clam',.28],['art_wm_crystal_small',.3],['art_hgxprop9',.3],['art_hgxprop2',.2],['uw_anemone',.3]]},
   'Warden\'s board':{col:TEAL,note:HGW3_N.board2,props:[['art_wm_skeleton',.3],['art_wm_bucket',.24],['art_hgxprop12',.3],['art_wm_crystal_teal',.35],['art_hgxprop9',.3]]},
   'Lantern nook':{col:AMB,note:HGW3_N.nook2,props:[['yar_pots',.3],['art_hgxprop12',.3],['uw_anemone',.3],['art_wm_bucket',.24]]},
   'Smugglers\' cache':{col:AMB,note:HGW3_N.cache2,props:[['art_wm_keg',.4],['art_wm_barrel',.42],['yar_pots',.3],['yar_nets',.7],['art_wm_crate_lid',.14],['art_wm_cage_lantern',.5],['uw_amphora',.45]]}};
  for(const v of E.vignettes){const sc=SCENES[v.name];if(!sc)continue;
    const cells=bfs(v.x,v.y,3).filter(c=>!stSq.has(c[0]+','+c[1])&&!solidAt.has(c[0]+','+c[1])).sort((a,b)=>(a[2]===0)-(b[2]===0)||a[2]-b[2]||R(a[0],a[1],1)-R(b[0],b[1],1));
    const near=cells.filter(c=>c[2]>=1);if(!near.length)continue;let placed=0;
    sc.props.forEach((p,i)=>{for(let t=0;t<near.length;t++){const c=near[(i*2+t)%near.length];if(cnt(c[0],c[1])>=2)continue;
      const side=(i%2?1:-1)*(.18+R(c[0],c[1],i)*.15),vert=!open(c[0]+1,c[1])&&!open(c[0]-1,c[1]);
      if(add(p[0],c[0],c[1],p[1],vert?{ox:side,oy:(R(c[0],c[1],i+3)-.5)*.3}:{oy:side,ox:(R(c[0],c[1],i+3)-.5)*.3})){placed++;break}}});
    wallNote(cells.filter(c=>c[2]<=3).map(c=>[c[0],c[1]]),sc.note);
    lamp(v.x,v.y,sc.col,1.3,40);const far=near[near.length-1];lamp(far[0],far[1],sc.col===AMB?TEAL:AMB,1.0,30);
    info.vig++}
  // ----- 3. landmarks: nothing more than 10 steps from something worth looking at -----
  const tall=d=>!d.pic&&!isPlant(d)&&!/^art_hgdf_vine|^uw_vent|^uw_sw/.test(d.k)&&hgweHt(d)>=.7;
  const anchors=()=>{const a=[];for(const d of L.decor){if(d.hgdwText&&(d.pic||d.npc))a.push([d.x,d.y]);else if(tall(d))a.push([d.x,d.y])}for(const v of E.vignettes)a.push([v.x,v.y]);for(const s of st)a.push([s.x,s.y]);return a};
  const LM=[['art_hgtb_lamp_tall',1.2,AMB,'art_hgxprop9',.3],['art_wm_crystal_tall',1.0,TEAL,'art_wm_crystal_small',.3],['art_hgxstat1',1.3,TEAL,'art_hgxprop2',.2],['art_wm_candelabra',.85,AMB,'art_hgxprop0',.1],
    ['art_hgtb_glasspost',1.1,TEAL,'uw_clam',.28],['art_wm_lamp_post',1.1,AMB,'art_hgxprop12',.3],['art_wm_orb_pedestal',.75,VIO,'art_hgxprop8',.2],['art_hgt_gardenlantern',1.0,VIO,'art_wm_bucket',.24]];
  let lmN=0;
  for(let it=0;it<30;it++){
    const dist=new Map(),q=[];for(const [x,y] of anchors()){const k=x+','+y;if(!dist.has(k)){dist.set(k,0);q.push([x,y])}}
    for(let i=0;i<q.length;i++){const [x,y]=q[i],dd=dist.get(x+','+y);for(const [a,b] of D){const nx=x+a,ny=y+b,k=nx+','+ny;if(open(nx,ny)&&!dist.has(k)){dist.set(k,dd+1);q.push([nx,ny])}}}
    let best=null,bd=-1;for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(!open(x,y)||stSq.has(x+','+y)||solidAt.has(x+','+y))continue;const dd=dist.get(x+','+y);if(dd===undefined)continue;
      const deg=D.filter(([a,b])=>open(x+a,y+b)).length,sc=dd+(deg===2?.3:0)+R(x,y,5)*.2;if(sc>bd){bd=sc;best=[x,y,dd]}}
    if(!best||best[2]<=10)break;
    let L0=LM[lmN%LM.length],g=0;while(!have(L0[0])&&g++<8){lmN++;L0=LM[lmN%LM.length]}lmN++;
    const [x,y]=best,vert=!open(x+1,y)&&!open(x-1,y),side=(R(x,y,2)<.5?-1:1)*.3;
    add(L0[0],x,y,L0[1],vert?{ox:side}:{oy:side,ox:0});add(L0[3],x,y,L0[4],vert?{ox:-side*.8,oy:.25}:{oy:-side*.8,ox:.25});
    lamp(x,y,L0[2],1.25,38);info.landmarks++}
  // ----- 3b. every long straight run holds something tall to look at, so a corridor never ends in plain green -----
  {const runs=[];for(let y=1;y<S-1;y++){let x=1;while(x<S-1){if(!open(x,y)){x++;continue}const x0=x;while(open(x,y))x++;if(x-x0>=7)runs.push({a:[x0,y],b:[x-1,y],n:x-x0,h:1})}}
   for(let x=1;x<S-1;x++){let y=1;while(y<S-1){if(!open(x,y)){y++;continue}const y0=y;while(open(x,y))y++;if(y-y0>=7)runs.push({a:[x,y0],b:[x,y-1],n:y-y0,h:0})}}
   runs.sort((p,q)=>q.n-p.n);let made=0;
   for(const r of runs){if(made>=40)break;const cells=[];for(let i=0;i<r.n;i++)cells.push(r.h?[r.a[0]+i,r.a[1]]:[r.a[0],r.a[1]+i]);
     const tallOn=cells.some(c=>L.decor.some(d=>d.x===c[0]&&d.y===c[1]&&(tall(d)||(d.hgdwText&&d.pic))));if(tallOn)continue;
     const picks=[];for(let i=r.n>=11?3:r.n>>1;i<r.n-2;i+=7)picks.push(cells[i]);
     for(const c of picks){if(stSq.has(c[0]+','+c[1])||solidAt.has(c[0]+','+c[1]))continue;let L0=LM[(lmN++)%LM.length],g=0;while(!have(L0[0])&&g++<8)L0=LM[(lmN++)%LM.length];
       const side=(R(c[0],c[1],2)<.5?-1:1)*.3;add(L0[0],c[0],c[1],L0[1],r.h?{oy:side}:{ox:side});add(L0[3],c[0],c[1],L0[4],r.h?{oy:-side*.8,ox:.25}:{ox:-side*.8,oy:.25});lamp(c[0],c[1],L0[2],1.2,36);info.landmarks++;made++}}}
  // ----- 4. the piranha keeps off the warden's chest -----
  {const wc=L.decor.find(d=>d.k==='uw_shellchest'&&d.hgdwTier===3);
   if(wc)for(const e of L.enemies){if(e.t!=='hgfpiranha'||Math.hypot(e.x-wc.x,e.y-wc.y)>=5.5)continue;let best=null,bd=1e9;
     const taken=new Set(L.enemies.map(q=>q.x+','+q.y));
     for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(!open(x,y)||solidAt.has(x+','+y)||taken.has(x+','+y)||Math.hypot(x-wc.x,y-wc.y)<5.5||nearProt(x,y,3))continue;const d=Math.hypot(x-e.x,y-e.y);if(d<bd){bd=d;best=[x,y]}}
     if(best){e.x=best[0];e.y=best[1];info.piranha++}}}
  // ----- fish keep clear of every note and set piece (the sprite pass reads this list) -----
  if(L._hgdweFish)L._hgdweFish.prot=prot.map(q=>[q[0]+.5,q[1]+.5]);
  // ----- 6. labels and text on every note and sign -----
  if(typeof hgsAll==='function')try{hgsAll()}catch(e){}
  for(const d of L.decor){if(!(d.hgdwText!==undefined||d.npc==='hgdw_note'))continue;
    if(!d.hgdwText||!String(d.hgdwText).trim())d.hgdwText=HGDWE_TAIL[Math.floor(R(d.x,d.y,8)*HGDWE_TAIL.length)];
    d.label=hgw3Label(d.hgdwText,d);info.labels++}
  info.prot=prot.length;
}
{const _b=hgdwBuild;hgdwBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGDW.ID];if(L&&L._hgdwe&&!L._hgw3)try{hgw3Maze(L)}catch(e){console.error('hgw3 maze',e)}return r}}
// a little more air in the haze, so that hubs read clearly
try{const lk=HGTE.look[HGDW.ID];if(lk){lk.ambient=Math.max(lk.ambient||0,.58);lk._rev=(lk._rev||0)+1}}catch(e){}
/* the engine copies only a fixed list of fields from the level's scenery into the playing copy (G.decor): the chest tier, the old chest position, a note's text and its label would be lost. Carry them over by index. */
{const _rs=reset;reset=function(){const r=_rs.apply(this,arguments);try{if(G.decor&&typeof DECOR_SPAWNS!=='undefined'&&G.decor.length===DECOR_SPAWNS.length&&(LEVEL===HGDW.ID||LEVEL===HGD.ID))
    for(let i=0;i<G.decor.length;i++){const d=G.decor[i],s=DECOR_SPAWNS[i];if(!s||s.k!==d.k||s.x!==d.x||s.y!==d.y)continue;for(const k of ['hgdwTier','hgdwOrig','hgdwText','label','hgdwe','hgw3'])if(s[k]!==undefined&&d[k]===undefined)d[k]=s[k]}}catch(e){console.error('hgw3 carry',e)}return r}}
/* ---------- 5. saves: chests by position, and by the position they stood on before they were moved ---------- */
{const _sd=sparseDecor;sparseDecor=function(){const o=_sd.apply(this,arguments);
  try{if(LEVEL===HGDW.ID)for(const d of G.decor)if(d.k==='uw_shellchest'&&d.hgdwTier&&(d.contents||d.goldTaken))o['hgw3:'+d.x+','+d.y]={contents:d.contents||null,gold:d.gold||0,goldTaken:!!d.goldTaken,opened:!!d.opened}}catch(e){console.error(e)}
  return o}}
{const _ap=applySparseDecor;applySparseDecor=function(sd){
  if(LEVEL===HGDW.ID){ // the order of the scenery changed since old saves were made, so numbers mean nothing here: keep only the position records
    const keep={};try{if(sd&&!Array.isArray(sd))for(const k in sd)if(k.indexOf('hgw3:')===0)keep[k]=sd[k]}catch(e){}
    _ap.call(this,{});
    try{for(const d of G.decor){if(d.k!=='uw_shellchest'||!d.hgdwTier)continue;const t=keep['hgw3:'+d.x+','+d.y]||(d.hgdwOrig&&keep['hgw3:'+d.hgdwOrig[0]+','+d.hgdwOrig[1]]);if(t){d.contents=t.contents;d.gold=t.gold;d.goldTaken=t.goldTaken;d.opened=t.opened}}}catch(e){console.error(e)}
    return}
  return _ap.apply(this,arguments)}}
// an old save knows only the flag list of opened chests (by their old position): a chest whose old or new position is in it opens empty
{const _ol=openLoot;openLoot=function(d){
  try{if(LEVEL===HGDW.ID&&d&&d.k==='uw_shellchest'&&d.hgdwTier&&!d.contents&&!d.goldTaken){const f=(G.flags&&G.flags.hgdwOpened)||{};
    if(f[d.x+','+d.y]||(d.hgdwOrig&&f[d.hgdwOrig[0]+','+d.hgdwOrig[1]])){d.contents=[];d.gold=0;d.goldTaken=true;d.opened=true}}}catch(e){console.error(e)}
  return _ol.apply(this,arguments)}}
{const _lf=lootFor;lootFor=function(d){try{if(LEVEL===HGDW.ID&&d&&d.hgdwTier&&d.hgdwOrig){G.flags.hgdwOpened=G.flags.hgdwOpened||{};G.flags.hgdwOpened[d.hgdwOrig[0]+','+d.hgdwOrig[1]]=1}}catch(e){}return _lf.apply(this,arguments)}}
/* ---------- 7. fog: a tinted haze band, a colour for each lake and each region of the maze ---------- */
const HGW3_FOG=[[255,200,110],[110,230,205],[190,150,255],[150,200,170]];
function hgw3FogDraw(){
  let r=0,g=0,b=0,a=0;
  if(LEVEL===HGDW.ID){let w=0;for(const q of HGDWE.lights){const d2=(q.x-G.P.x)**2+(q.y-G.P.y)**2,k=1/(1+d2/45);w+=k;r+=q.col[0]*k;g+=q.col[1]*k;b+=q.col[2]*k}
    if(w<=0)return;r=r/w*255;g=g/w*255;b=b/w*255;a=Math.min(1,w/1.4)*.9}
  else if(LEVEL===HGD.ID){const L=LEVELS[HGD.ID];if(!L||!L._hgdl)return;let best=0,bi=0;
    for(const k of L._hgdl.lakes){const dx=Math.max(k.x0-G.P.x,0,G.P.x-k.x1),dy=Math.max(k.y0-G.P.y,0,G.P.y-k.y1),w=Math.max(0,1-Math.hypot(dx,dy)/14);if(w>best){best=w;bi=k.i}}
    if(best<=0)return;const c=HGW3_FOG[bi%HGW3_FOG.length];r=c[0];g=c[1];b=c[2];a=best}
  else return;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation='screen';
  ctx.fillStyle='rgba('+(r|0)+','+(g|0)+','+(b|0)+','+(.05*a).toFixed(3)+')';ctx.fillRect(0,0,420,210);
  const gr=ctx.createLinearGradient(0,55,0,160);const c0='rgba('+(r|0)+','+(g|0)+','+(b|0)+',';gr.addColorStop(0,c0+'0)');gr.addColorStop(.5,c0+(.16*a).toFixed(3)+')');gr.addColorStop(1,c0+'0)');
  ctx.fillStyle=gr;ctx.fillRect(0,55,420,105);ctx.restore()}
{const _dw=drawWorld;drawWorld=function(){const r=_dw.apply(this,arguments);try{hgw3FogDraw()}catch(e){if(!HGW3._fe){HGW3._fe=1;console.error('hgw3 fog',e)}}return r}}
/* ---------- 8. the three lakes ---------- */
const HGW3_BOAT=[{col:'#e08a2a',a:.62,sc:.64,flip:0,ox:-.3},{col:'#2bd0bc',a:.62,sc:1.0,flip:1,ox:.3},{col:'#9a5ae8',a:.62,sc:.8,flip:1,ox:.05},{col:'#4a7a5a',a:.3,sc:.86,flip:0,ox:.1}];
const HGW3_BEACON=[['art_hgtb_lamp_tall',1.5,'#c8863a',[1,.78,.4]],['art_hgtb_deco_shellstatue',1.3,'#3a9aa0',[.45,.95,.95]],['art_wm_crystal_pillar',1.5,'#7a50b8',[.78,.55,1]]];
function hgw3Lakes(L){
  const info=L._hgw3={beacons:0,pots:0,lakes:[]};const M=L._hgdm,W=M.W,m=hgdlMask(L),water=(x,y)=>m[y*W+x]===1,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
  const dec=(k,x,y,h,o)=>{if(!IMG[k]||!IMG[k].width)return false;L.decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true,hgdl:1,hgdwl:1,hgw3:1,sc:hgweSc(k,h)},o||{}));return true};
  for(const k of L._hgdl.lakes){if(k.wm||!k.docks)continue;const B=HGW3_BEACON[k.i%3],d=k.docks.dep,far=k.docks.far;
    // a beacon straight ahead of the departure dock, seen through the arch: a different tall lit shape on each lake
    for(let n=5;n<=9;n++){const x=d.wx+d.dx*n,y=d.wy+d.dy*n;if(!water(x,y))break;if(n<5)continue;
      if(L.decor.some(e=>e.x===x&&e.y===y&&e.block))continue;
      if(dec(B[0],x,y,B[1],{hgdwm:1,ox:0})){const rk=hgweRefl(B[0],B[1],B[2]);if(rk)L.decor.push({k:rk,x,y,block:false,walk:true,deco:true,hgdl:1,hgdwl:1,hgw3:1,bob:-B[1]*.97});HGWL_push(x,y,B[3]);info.beacons++;break}}
    // and one straight ahead of the far dock, the other lake colour
    for(let n=4;n<=8;n++){const x=far.wx+far.dx*n,y=far.wy+far.dy*n;if(!water(x,y))break;
      if(L.decor.some(e=>e.x===x&&e.y===y&&e.block))continue;
      const B2=HGW3_BEACON[(k.i+1)%3];if(dec(B2[0],x,y,B2[1]*.8,{hgdwm:1})){HGWL_push(x,y,B2[3]);info.beacons++;break}}
    info.lakes.push({lake:k.i,beacon:B[0]})}
  // lobster pots: a darker, painted copy
  const pk=hgw3Tint('yar_pots','#1a1208',.5,'hgw3_pots');if(pk)for(const e of L.decor)if(e.k==='yar_pots'){e.k=pk;info.pots++}
}
function HGWL_push(x,y,col){HGDWL.lights.push({x,y,col,kI:1.9,r2:80})}
{const _b=hgdBuild;hgdBuild=function(){const r=_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(L&&L._hgdwl&&!L._hgw3)try{hgw3Lakes(L)}catch(e){console.error('hgw3 lakes',e)}return r}}
// the boats at anchor: each lake paints, sizes and turns its own
{const _s=hgdbSync;hgdbSync=function(){const r=_s.apply(this,arguments);
  try{const L=LEVELS[HGD.ID];if(G.decor&&L&&L._hgdl)for(const d of G.decor)if(d.hgdBoatSpr){let li=0,bd=1e9;for(const k of L._hgdl.lakes){const dd=Math.hypot((k.x0+k.x1)/2-d.x,(k.y0+k.y1)/2-d.y);if(dd<bd){bd=dd;li=k.i}}
    const T=HGW3_BOAT[li%HGW3_BOAT.length],key=hgw3Tint('yar_boat_row',T.col,T.a,'hgw3_boat'+li,T.flip);if(key){d.k=key;d.sc=T.sc;d.ox=T.ox;d.bob=-.14}}}catch(e){}
  return r}}
