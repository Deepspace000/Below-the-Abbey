/* ==========================================================================
   THE UNDERLEVEL, POLISH PASS D (prefix hgpd / HGPD), level 476. Patches the BUILT level after every other builder has run (it wraps hgduBuild last), so no generator was touched.
   1. proportions: the three great sea horrors are allowed to be bigger than a hero (they were all squeezed to hero height); beached boats match the size of the party's own boat; crates, barrels,
      buckets and posts of the same kind stand within a tenth of one size; the stacked dock clutter is thinned and each dock gets its own set.
   2. the lore trail: thirteen pages of the journal of the Tallow Company (a lost expedition), each one in its own hand-built place: a first camp, a chalk corridor, a crossing post, a cold camp, the
      lighthouse on its rock, a wreck, a drowned chapel, a blue grotto, a reading room, a tally wall, a barricade, a dig, and the company purse. Plus a waiting rock of statues and a wheel on a rock.
   3. every ladder foot has its own small kit of props; scratched signs on the walls of eighteen junctions point the true way to the nearest ladder up or the nearest boat (the number of steps is the
      real walking distance); every dead end that had nothing gets a small scene of its own; long bare stretches of corridor get a landmark every dozen squares or so.
   4. the places are named on the map, a bell tolls in the dark near the chapel.
   Pictures: only painted pieces that already exist (assets/ds_wm_*, ds_hgx*, ds_dbones). Deterministic (hgdmRng 476900). Exposes L._hgpd for testing.
   ========================================================================== */
const HGPD_R2=!window.__NOHGPD2;
const HGPD={ID:476,read:{},seen:0,pages:13,chapel:null,bellT:0};
/* ---------- 1. proportions ---------- */
if(typeof ENEMY_DEF!=='undefined'&&typeof HUGE_FOES!=='undefined'){ // a leviathan, a kraken and a great serpent are bigger than a hero: height 1.5, 1.8 and 1.4 against a hero's 0.8
  for(const [id,w] of [['hgo0',1.98],['hgo2',2.0],['hgo8',1.65]]){if(ENEMY_DEF[id]){ENEMY_DEF[id].w=w;if(!HUGE_FOES.includes(id))HUGE_FOES.push(id)}}}
/* the painted pieces used here, with their height in squares (a hero is 0.8, a hip-high crate 0.45, a statue 1.25) */
const HGPD_ART={book:['art_hgxprop3',.2],candle:['art_hgxprop2',.24],lamp:['art_wm_lamp_post',1.25],bell:['art_wm_bell',.75],shelf:['art_wm_bookshelf',1.1],board:['art_wm_noticeboard',.5],rune:['art_wm_rune',.55],
  blue:['art_hgxprop4',.5],teal:['art_wm_crystal_teal',.55],cart:['art_wm_mine_cart',.5],tools:['art_wm_tools',.7],wheel:['art_wm_crank',.9],lantern:['art_hgxprop7',.2],cairn:['art_hgxrock2',.5],
  coral:['art_hgxprop9',.4],shells:['art_hgxprop8',.22],gold:['art_wm_gold',.2],keg:['art_wm_keg',.4],hook:['art_wm_lantern_gold',.5],skel:['art_wm_skeleton',.5],bones:['art_hgxprop0',.255],
  tooth:['art_hgxprop13',.3],rubble:['art_hgxrock6',.3],root:['art_hgxprop12',.34],crate:['art_wm_crate',.5],barrel:['art_wm_barrel',.58],bucket:['art_wm_bucket',.36],lid:['art_wm_crate_lid',.46],
  post:['art_wm_chain',1.05],cage:['art_wm_cage_lantern',.5],boat:['art_wm_boat',.62],straw:['art_hgxprop15',.25],stone:['art_hgxrock0',.4675],chest:['chest',.48],
  /* round 3: painted pieces that were not used yet, for the dead-end kits */
  pot:['art_hgxprop1',.34],bbucket:['art_hgxprop6',.3],lanternG:['art_hgxprop7',.2],coins:['art_hgxprop10',.14],tiles:['art_hgxprop11',.12],slab:['art_hgxrock1',.34],carved:['art_hgxrock4',.62],pillar:['art_hgxrock5',.6],crag:['art_hgxrock7',.55],
  scale:['art_wm_scale',.5],key:['art_wm_key',.3],windlass:['art_wm_windlass',.64],candel:['art_wm_candelabra',.42],cask:['art_wm_cask',.46],sign:['art_wm_signpost',.6]};
/* grey-blue copies of the violet wm props (the level is grey and teal, the old props were purple), flipped copies (so no two neighbours are the same picture), and the orb frames */
const HGPD_GREY=[['boat'],['crate'],['barrel'],['chain'],['crank'],['lamp_post',40,1],['bell'],['bookshelf'],['noticeboard'],['rune',182],['skeleton'],['tools'],['mine_cart'],['keg'],['bucket'],['crate_lid'],['shrine',182],['gold'],['cask'],['mirror'],['scale'],['key',182],['windlass'],['candelabra'],['signpost']],
  HGPD_MIR=['hgpd_skel','hgpd_candle','hgpd_crate','hgpd_barrel','hgpd_bucket','hgpd_tools','hgpd_bones','hgpd_cairn','hgpd_rubble','hgpd_root','hgpd_book','hgpd_lantern','hgpd_straw','hgpd_shells','hgpd_coral','hgpd_keg','hgpd_cart','hgpd_stone','hgpd_lid','hgpd_tooth','hgpd_board','hgpd_rune','hgq_skeleton','hgq_crate','hgq_barrel','hgq_bucket','hgq_keg','hgq_boat','hgq_crate_lid','art_hgxprop0','art_hgxprop12','art_hgxprop13','art_hgxrock6','art_hgxrock3','art_hgxrock0','art_wm_cage_lantern','art_hgxprop2'];
function hgpdPix(src,fn){try{const w=src.width,h=src.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(src,0,0);const im=x.getImageData(0,0,w,h);fn(im.data,w,h);x.putImageData(im,0,0);return c}catch(e){return null}}
function hgpdHsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
function hgpdRgb(h,s,l){const f=n=>{const k=(n+h/30)%12,a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return [f(0)*255,f(8)*255,f(4)*255]}
function hgpdGrey(src,glow,lift){return hgpdPix(src,d=>{for(let q=0;q<d.length;q+=4){if(d[q+3]<8)continue;let [h,s,l]=hgpdHsl(d[q],d[q+1],d[q+2]);if(h>=225&&h<=352&&s>.04){if(s>.55&&l>.45&&glow!==undefined){h=glow;s=Math.min(1,s*.9);if(lift)l=Math.min(.9,l+.04)}else{h=214+(h-280)*.06;s*=.42}const c=hgpdRgb(h,s,l);d[q]=c[0];d[q+1]=c[1];d[q+2]=c[2]}}})}
function hgpdFlip(src,tint){try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.translate(src.width,0);x.scale(-1,1);x.drawImage(src,0,0);if(tint){x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=tint;x.fillRect(0,0,c.width,c.height)}return c}catch(e){return null}}
function hgpdArt(){for(const k in HGPD_ART){const [src,h]=HGPD_ART[k],im=IMG[src];if(im&&im.width){IMG['hgpd_'+k]=im;NPC_H['hgpd_'+k]=h}}
  if(HGPD.greyDone)return;let ok=true;
  for(const [n,glow,lift] of HGPD_GREY){const src=IMG['art_wm_'+n];if(!src||!src.width){ok=false;continue}if(IMG['hgq_'+n])continue;const c=hgpdGrey(src,glow,lift);if(c){IMG['hgq_'+n]=c;if(NPC_H['art_wm_'+n])NPC_H['hgq_'+n]=NPC_H['art_wm_'+n]}}
  // the painted pieces that the scenes use are the grey ones
  for(const k in HGPD_ART){const [src,h]=HGPD_ART[k],m=/^art_wm_(.+)$/.exec(src);if(m&&IMG['hgq_'+m[1]]){IMG['hgpd_'+k]=IMG['hgq_'+m[1]];NPC_H['hgpd_'+k]=h;NPC_H['hgq_'+m[1]]=NPC_H['hgq_'+m[1]]||h}}
  // open-book poses: the same painted book turned round, and an older darker one
  if(IMG.hgpd_book&&!IMG.hgpd_book2){const f=hgpdFlip(IMG.hgpd_book);if(f){IMG.hgpd_book2=f;NPC_H.hgpd_book2=NPC_H.hgpd_book}const g=hgpdFlip(IMG.hgpd_book,'rgba(40,24,10,.38)');if(g){IMG.hgpd_book3=g;NPC_H.hgpd_book3=NPC_H.hgpd_book}}
  for(const k of HGPD_MIR){const im=IMG[k];if(!im||!im.width||IMG[k+'_m'])continue;const f=hgpdFlip(im);if(f){IMG[k+'_m']=f;NPC_H[k+'_m']=NPC_H[k]}}
  try{if(typeof wmOrbArt==='function'&&!IMG.wm_orbframe0&&IMG.art_wm_cage_lantern&&IMG.art_wm_cage_lantern.width){if(typeof WM!=='undefined')WM.orbArt=false;wmOrbArt()}}catch(e){console.warn('hgpd orb art',e)}
  try{hgpdDerive()}catch(e){console.warn('hgpd derive',e)}
  HGPD.greyDone=ok}
/* ---------- round 3: new poses made from the painted pieces (turned, cut, tinted on a canvas): a lying and a slumped skeleton, a broken hull for the wreck, lit and cold lanterns ---------- */
function hgpdTrim(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data;let x0=w,y0=h,x1=0,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>10){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<x0)return c;const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
function hgpdTurn(src,deg,sy,shade){const w=src.width,h=src.height,m=Math.ceil(Math.hypot(w,h)),c=document.createElement('canvas');c.width=m;c.height=m;const x=c.getContext('2d');x.translate(m/2,m/2);x.rotate(deg*Math.PI/180);x.scale(1,sy||1);x.drawImage(src,-w/2,-h/2);
  if(shade){x.globalCompositeOperation='source-atop';x.fillStyle=shade;x.fillRect(-m,-m,m*2,m*2)}return hgpdTrim(c)}
function hgpdWreck(boat){const w=boat.width,h=boat.height,c=document.createElement('canvas');c.width=Math.round(w*1.25);c.height=Math.round(h*1.15);const x=c.getContext('2d');
  // the bow half: the planking is stove in along a ragged line and the bare ribs stand up out of the break, the whole piece leans over on its keel
  x.save();x.translate(w*.02,h*.96);x.rotate(-.13);x.translate(0,-h*.96);
  const P=[[0,0],[.36,0],[.43,.2],[.5,.13],[.55,.36],[.63,.3],[.69,.52],[.78,.46],[.86,.66],[.95,.6],[1,.7],[1,1],[0,1]];
  x.save();x.beginPath();P.forEach((q,i)=>i?x.lineTo(q[0]*w,q[1]*h):x.moveTo(q[0]*w,q[1]*h));x.closePath();x.clip();x.drawImage(boat,0,0);
  x.fillStyle='rgba(8,10,14,.5)';x.fillRect(w*.4,0,w*.62,h*.2);x.restore(); // the open hold behind the ribs
  for(const [vx,vy,rh] of [[.5,.13,.15],[.58,.34,.17],[.66,.3,.13],[.74,.5,.16],[.82,.46,.12],[.9,.62,.13]]){ // ribs: tapered bare timbers with a lit edge
    const rx=vx*w,ry=vy*h,bw=w*.024,g=x.createLinearGradient(rx-bw,0,rx+bw,0);g.addColorStop(0,'#0e0a06');g.addColorStop(.55,'#281d12');g.addColorStop(1,'#120c07');
    x.fillStyle=g;x.beginPath();x.moveTo(rx-bw,ry+h*.22);x.lineTo(rx-bw*.55,ry-h*rh);x.lineTo(rx-bw*.1,ry-h*rh-h*.02);x.lineTo(rx+bw*.5,ry-h*rh*.9);x.lineTo(rx+bw,ry+h*.22);x.closePath();x.fill();
    x.strokeStyle='rgba(120,96,64,.3)';x.lineWidth=Math.max(1,w*.004);x.beginPath();x.moveTo(rx-bw*.1,ry-h*rh);x.lineTo(rx+bw*.1,ry+h*.2);x.stroke()}
  x.restore();
  // a piece of the stern, thrown a little way off, on its side
  x.save();x.translate(w*1.0,h*1.1);x.rotate(.62);x.scale(.5,.5);x.translate(-w*.4,-h);x.beginPath();
  const Q=[[.46,.12],[1,.0],[1,1],[.5,1],[.62,.8],[.44,.62],[.58,.44],[.4,.3]];Q.forEach((q,i)=>i?x.lineTo(q[0]*w,q[1]*h):x.moveTo(q[0]*w,q[1]*h));x.closePath();x.clip();x.drawImage(boat,0,0);x.restore();
  // loose planks cut from the planking of the same boat
  for(const [sx,sy,sw,sh,dx,dy,r] of [[.12,.5,.5,.1,.72,.92,.2],[.2,.62,.45,.09,.5,1.06,-.12],[.1,.38,.4,.08,.95,.7,.5]]){x.save();x.translate(dx*w,dy*h);x.rotate(r);x.drawImage(boat,sx*w,sy*h,sw*w,sh*h,0,0,sw*w*.9,sh*h*.9);x.restore()}
  x.globalCompositeOperation='source-atop';x.fillStyle='rgba(14,18,24,.34)';x.fillRect(0,0,c.width,c.height);return hgpdTrim(c)}
function hgpdDerive(){
  if(HGPD.derived)return;const sk=IMG.hgpd_skel||IMG.hgq_skeleton,bt=IMG.hgq_boat||IMG.art_wm_boat,lt=IMG.art_hgxprop7;
  if(!sk||!sk.width||!bt||!bt.width||!lt||!lt.width)return;
  const put=(k,c,h)=>{if(c){IMG[k]=c;NPC_H[k]=h}};
  put('hgpd_skelL',hgpdTurn(sk,64,.62),.26);       // lying on its side
  put('hgpd_skelS',hgpdTurn(sk,17,.88,'rgba(10,14,20,.12)'),.44); // slumped against the wall
  put('hgpd_wreck',hgpdWreck(bt),.78);
  // the same lantern lit gold, and cold (sea green)
  const tint=(src,rgba)=>{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=rgba;x.fillRect(0,0,c.width,c.height);return c};
  put('hgpd_lanternW',tint(lt,'rgba(255,196,90,.30)'),.2);put('hgpd_lanternC',tint(lt,'rgba(70,200,170,.34)'),.2);
  for(const k of ['hgpd_skelL','hgpd_skelS','hgpd_pot','hgpd_bbucket','hgpd_candel','hgpd_lanternW','hgpd_lanternC','hgpd_windlass','hgpd_scale','hgpd_key','hgpd_cask','hgpd_crag','hgpd_slab','hgpd_pillar','hgpd_carved']){const im=IMG[k];if(im&&im.width&&!IMG[k+'_m']){const f=hgpdFlip(im);if(f){IMG[k+'_m']=f;NPC_H[k+'_m']=NPC_H[k]}}if(!HGPD_MIR.includes(k))HGPD_MIR.push(k)}
  HGPD.derived=true}
/* ---------- the journal of the Tallow Company ---------- */
const HGPD_RUNES=['The runes on this stone are worn smooth at one corner, as if many hands have rested on it. Scratched below: "Still here."',
 'Glowing runes nobody can read. Someone has scratched a tally of five strokes beneath them, and then no more.',
 'The runes glow a little brighter when you stand close. Below, in charcoal: "It is warm. Do not ask me why it is warm."',
 'Runes, and below them a child\'s drawing of a boat. Somebody has crossed the boat out and drawn a ladder instead.',
 'The stone is cold and the runes are pale blue. Scratched underneath: "Keep the water on your left." It does not say which way to be facing.',
 'A flat stone with runes. Under them: "The ladder is not where the chalk says." The word chalk has been underlined twice.',
 'Under the glowing runes someone has scratched "Brother Pell was here." In a different hand, lower down: "He still is."',
 'Runes nobody can read. Scratched below: "Count your steps. Then count them again. Then do not trust the count."'];
const HGPD_PAGES=[
 ['The Tallow Camp','Page 1. Day 1. Twelve of us went down the ladder with forty torches, a sledge of lamp oil and food for a month. Captain Ysolt means to chart the under-road and find the dry way to the far shore. I am to keep the record, so I am keeping it.'],
 ['The Chalk Corridor','Page 2. Day 4. The corridors do not turn where the chalk says they should. We have marked every junction twice. Brother Pell says the marks are in the wrong places. They are not. The walls have moved.'],
 ['The Crossing Post','Page 3. Day 7. We have found a sea. Nobody told us there was a sea. There is one boat at the dock and twelve of us, so we cross in three trips. The water is black and does not show the torches.'],
 ['The Cold Camp','Page 4. Day 9. We lost the lamp bearer on the second crossing. Nobody heard a splash. Eleven torches left. We sleep in shifts, and whoever is awake watches the water. It is hard to look anywhere else.'],
 ['The Keeper\'s Rock','Page 5. Day 12. We lit a fire on the rock so the ones still rowing can find us. A lamp tells the others that somebody is here. I will keep it burning as long as I can lift the oil.'],
 ['The Wreck','Page 6. Day 14. Our second boat broke on the rocks. The keel is open from end to end. We got three sacks off her and a barrel of oil. We did not get Dunmow.'],
 ['The Drowned Chapel','Page 7. Day 17. There is a small chapel on this rock, half under the water. The bell rings when the water moves. Brother Pell prayed here all night. In the morning he said he had been answered, and would not say how.'],
 ['The Blue Grotto','Page 8. Day 22. The blue mushrooms give the only warm light we have had in a week. They are not safe to eat. Two of us ate them anyway, and sat looking at the ceiling for a day.'],
 ['The Reading Room','Page 9. Day 30. We carried five books down to read by lamplight. We have read each of them until the pages came loose. Someone has begun reading them aloud, to the dark. The dark has not answered yet.'],
 ['The Tally Wall','Page 10. Day 41. These are my stones, one for each day. The captain\'s stones stop at thirty. I have kept hers going for her.'],
 ['The Barricade','Page 11. Day 47. We built a wall of crates across the corridor to keep out what comes at night. It has held for six nights. I no longer think it keeps anything out. I think it keeps us in.'],
 ['The Dig','Page 12. Day 55. We dug sideways for the dry road the Prior swore was here. We found coal, a boot and a horn as long as my arm. We have stopped digging.'],
 ['The Company Purse','Page 13, the last. Day 63. If you have found this, take the money and go back up. It is the purse of the company, kept dry for whoever came after us. Tell the Prior of the Low Stair that we reached the sea.']];
/* ---------- reading things: scratches in walls, journals on the floor ---------- */
function hgpdPrompt(name,text){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name},node:say(text,[['Close.',()=>null]]),t:G.time,btns:[]};G.hold=null;G.queued=null}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGPD.ID){const r=HGPD.read[nx+','+ny];
      if(r&&!(r.once&&r.page&&G.flags.hgpdSeen&&G.flags.hgpdSeen[r.page])){let t=r.t;if(r.page){const F=G.flags;F.hgpdSeen=F.hgpdSeen||{};F.hgpdSeen[r.page]=1;const n=Object.keys(F.hgpdSeen).length;t+=' (You have found '+n+' of '+HGPD.pages+' pages of the journal.)'}
        sfx('equip');hgpdPrompt(r.n,t);return true}}}catch(e){console.warn('hgpd',e)}
  return _db.apply(this,arguments)}}
/* ---------- the build ---------- */
function hgpdBuild(L){
  if(L._hgpd||window.__NOHGPD)return;const O=L._hgdo;if(!O||!L._bsu)return;hgpdArt();
  const W=201,H=201,ix=(x,y)=>y*W+x,rnd=hgdmRng(476900),rows=L.rows,DV=[[0,-1],[1,0],[0,1],[-1,0]],info={vig:[],signs:0,fills:0,marks:0,kits:0,removed:0,names:[]};
  const open=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&rows[y][x]==='.',wat=(x,y)=>O.wm[ix(x,y)]===1,land=(x,y)=>open(x,y)&&!wat(x,y);
  const deg=(x,y)=>DV.filter(d=>land(x+d[0],y+d[1])).length,U=L._hgdu,lad=U.ladders;
  const keep=[].concat(lad.map(l=>[l.ax,l.ay]),(U.letters||[]).map(l=>[l.x,l.y]),L._msgr?[[L._msgr.x,L._msgr.y]]:[],(L._bsu.shrines||[]).map(s=>[s.x,s.y]),L.decor.filter(d=>d.k==='chest'||d.npc).map(d=>[d.x,d.y]),O.docks.map(d=>[d.bx,d.by]),O.landings.map(l=>[l.x,l.y]));
  if(L._bsw)keep.push([L._bsw.cx,L._bsw.cy]);
  const foe=(x,y,r)=>L.enemies.some(e=>Math.abs(e.x-x)<=r&&Math.abs(e.y-y)<=r);
  const MINOR=/web|hgxprop0$|dbones|hgxrock[036]$|hgxprop1[23]$|hgxprop6$|hgxprop1$|hgxprop2$|art_wm_crate|art_wm_barrel|art_wm_bucket|art_wm_chain/;
  const busy=(x,y,r)=>L.decor.some(d=>Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r&&!MINOR.test(d.k));
  const add=(k,x,y,o)=>{o=o||{};const e={k,x,y,hx:1,block:!!o.block,walk:!o.block,deco:true,sc:o.sc||1};if(o.ox)e.ox=+o.ox.toFixed(2);if(o.oy)e.oy=+o.oy.toFixed(2);if(o.bob!==undefined)e.bob=o.bob;
    if(o.wd){e.wd=[o.wd[0],o.wd[1]];e.pic=1;e.block=false;e.walk=true;if(o.read)HGPD.read[(x+o.wd[0])+','+(y+o.wd[1])]=o.read}else if(o.read)HGPD.read[x+','+y]=o.read;
    if(o.gold)e.goldAmt=o.gold;L.decor.push(e);return e};
  const light=(x,y,k,red)=>{(L.lights||(L.lights=[])).push(red?[x,y,1]:[x,y]);if(L._bsu.lk)L._bsu.lk[x+','+y]=k||.4};
  const COL={gold:[1.45,1,.45],teal:[.38,1,1.08],blue:[.42,.72,1.5],amber:[1.5,.85,.3],rose:[1.35,.5,.72],green:[.5,1.3,.62],white:[1.15,1.15,1.2],ice:[.55,.95,1.35],o0:[1.5,1.05,.4],o1:[1.5,.55,1.15],o2:[.45,1,1.55],o3:[.5,1.4,.6]},
    HALO={gold:'255,190,90',teal:'90,235,230',blue:'110,170,255',amber:'255,176,64',rose:'255,110,170',green:'120,255,160',white:'235,235,255',ice:'150,225,255',o0:'255,200,80',o1:'255,110,210',o2:'80,200,255',o3:'90,240,130'};
  const glows=HGPD.glows=[],CL=HGPD.cl={};
  const clight=(x,y,col,k,o)=>{o=o||{};light(x,y,k||.5);CL[x+','+y]=[COL[col],k||.5];glows.push({x:x+.5+(o.ox||0),y:y+.5+(o.oy||0),z:o.z===undefined?.42:o.z,rw:o.rw||.55,c:HALO[col],a:o.a===undefined?.75:o.a,far:o.far||0,ph:rnd()*6.28,fr:o.fr||null});info.glows=(info.glows||0)+1};
  const free=(x,y)=>land(x,y)&&!foe(x,y,0)&&!L.decor.some(d=>d.x===x&&d.y===y&&d.block);
  const nameAt=(t,x,y)=>{info.names.push({t,x,y,k:'place'})};
  /* ---- 0a. the walls: the old tint [4,3,5,.5] multiplied the rock to black and then screened a flat beige over it, so every wall was a smooth blank slab. A plain darkening keeps the cracks and the facets. ---- */
  try{const TM=ohTiles(),chUp=String.fromCharCode(0x331);
    if(OH_STY.hgdu_rock){{const lp=hgpdLit(OH_STY.hgdu_rock.plain);if(IMG[lp]&&IMG[lp].width)OH_STY.hgdu_rock.plain=lp}OH_STY.hgdu_rock.tint=[248,242,255];L.chars['#']=TM.make('plain','hgdu_rock',2.7).gid}
    if(OH_STY.hgdu_up){OH_STY.hgdu_up.tint=[196,186,176];L.chars[chUp]=TM.make('door','hgdu_up',2.7).gid}}catch(e){console.error('hgpd walls',e)}
  /* ---- 0. proportions of the repeated props ---- */
  {const by={};for(const d of L.decor)(by[d.k]=by[d.k]||[]).push(d);
    for(const k of ['art_wm_crate','art_wm_barrel','art_wm_bucket','art_wm_crate_lid','art_wm_chain']){const a=by[k];if(!a||!a.length)continue;const s=a.map(d=>d.sc||1).sort((p,q)=>p-q),m=s[s.length>>1];
      for(const d of a){const v=Math.max(m*.9,Math.min(m*1.1,d.sc||1));if(v!==(d.sc||1)){d.sc=+v.toFixed(2);info.removed++}}}
    for(const d of by.art_wm_boat||[]){if(!d.block&&d.sc<1.3){d.sc=1.3;info.removed++}} // the beached boats are as big as the party's boat (a boat for four heroes)
    // dock clutter: a cell with three props loses the duplicate post; each dock gets its own set
    const cell={};for(const d of L.decor){if(d.pic)continue;(cell[d.x+','+d.y]=cell[d.x+','+d.y]||[]).push(d)}
    for(const k in cell){const a=cell[k];if(a.length>=3){const p=a.find(d=>d.k==='art_wm_chain');if(p&&!a.some(d=>d.k==='art_wm_cage_lantern')){L.decor.splice(L.decor.indexOf(p),1);info.removed++}
      else{const bk=a.find(d=>d.k==='art_wm_bucket');if(bk&&a.some(d=>d.k==='art_wm_crate')){const n=DV.map(v=>[bk.x+v[0],bk.y+v[1]]).find(c=>land(c[0],c[1])&&!L.decor.some(d=>d.x===c[0]&&d.y===c[1]));if(n){bk.x=n[0];bk.y=n[1];info.removed++}}}}}
    const dockBy=O.docks.concat(O.landings.map(l=>({bx:l.x,by:l.y})));
    dockBy.forEach((dk,i)=>{const near=L.decor.filter(d=>!d.pic&&Math.abs(d.x-dk.bx)<=3&&Math.abs(d.y-dk.by)<=3);
      const bar=near.find(d=>d.k==='art_wm_barrel'),cr=near.find(d=>d.k==='art_wm_crate'),bu=near.find(d=>d.k==='art_wm_bucket'),lid=near.find(d=>d.k==='art_wm_crate_lid');
      const cg=near.find(d=>d.k==='art_wm_cage_lantern'),pst=near.find(d=>d.k==='art_wm_chain');
      if(cg&&IMG.hgpd_candel&&IMG.hgpd_lanternW){if(i%4===1)cg.k='hgpd_candel';else if(i%4===2)cg.k='hgpd_lanternW';else if(i%4===3&&IMG.hgpd_windlass)cg.k='hgpd_windlass'}
      if(pst&&i%3===2&&IMG.hgpd_pillar)pst.k='hgpd_pillar';
      if(i%4===1&&bar){bar.k='hgpd_keg';bar.sc=1}else if(i%4===2&&cr&&lid){L.decor.splice(L.decor.indexOf(lid),1);cr.sc=.95;info.removed++}else if(i%4===3&&bu&&lid){bu.k='hgpd_keg';bu.sc=.9;L.decor.splice(L.decor.indexOf(lid),1);info.removed++}})}
  /* ---- 1. sites ---- */
  const dead=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!land(x,y)||O.isle[ix(x,y)])continue;if(deg(x,y)!==1)continue;const n=DV.find(d=>land(x+d[0],y+d[1]));dead.push({x,y,ix:n[0],iy:n[1]})}
  const room=(x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(!land(x+i,y+j)||O.isle[ix(x+i,y+j)])return false;return true};
  const chosen=[];
  const okDead=e=>keep.every(k=>Math.hypot(k[0]-e.x,k[1]-e.y)>=5)&&!busy(e.x,e.y,2)&&!L.decor.some(d=>d.k==='art_wm_skeleton'&&Math.abs(d.x-e.x)<=2&&Math.abs(d.y-e.y)<=2);
  const farPick=(cands,gap)=>{let best=null,bs=-1;for(const c of cands){let m=1e9;for(const q of chosen)m=Math.min(m,Math.hypot(q[0]-c.x,q[1]-c.y));if(m<(gap||16))continue;const s=Math.min(m,70)+rnd()*5;if(s>bs){bs=s;best=c}}
    if(!best&&cands.length){let bm=-1;for(const c of cands){let m=1e9;for(const q of chosen)m=Math.min(m,Math.hypot(q[0]-c.x,q[1]-c.y));if(m>bm&&m>=7){bm=m;best=c}}}
    if(best)chosen.push([best.x,best.y]);return best};
  const nearTo=(cands,px,py)=>{let b=null,bd=1e9;for(const c of cands){const d=Math.hypot(c.x-px,c.y-py);if(d<bd){bd=d;b=c}}if(b)chosen.push([b.x,b.y]);return b};
  const deadC=dead.filter(okDead);info.cand={dead:dead.length,deadOK:deadC.length};
  const roomC=[];for(let y=6;y<H-6;y+=1)for(let x=6;x<W-6;x+=1){if(room(x,y,2)&&keep.every(k=>Math.hypot(k[0]-x,k[1]-y)>=5)&&!busy(x,y,2)&&L.enemies.filter(e=>Math.abs(e.x-x)<=2&&Math.abs(e.y-y)<=2).length<=10)roomC.push({x,y,room:1})}
  const bsx=L.decor.filter(d=>d.npc==='bsu_boatman').map(d=>[d.x,d.y]);
  const isl=(O.islets||[]).filter(p=>!bsx.some(b=>Math.hypot(b[0]-p[0],b[1]-p[1])<4)&&!busy(p[0],p[1],1)).map(p=>({x:p[0],y:p[1]}));
  const cells=(c,r)=>{const o=[];for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const x=c.x+i,y=c.y+j;if(land(x,y)&&O.isle[ix(x,y)])o.push([x,y])}return o};
  const note=(i)=>({n:HGPD_PAGES[i-1][0],t:HGPD_PAGES[i-1][1],page:i});
  const P=(k,x,y,o)=>{if(!land(x,y))return null;return add(k,x,y,o)};
  // clears the little loose bones and rubble round a site, so the scene reads clearly
  const tidy=(x,y,r)=>{for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r&&MINOR.test(d.k)&&!d.pic){L.decor.splice(i,1);info.removed++}}};
  // a few of the creatures that nest in a room are moved to the nearest corridor outside it, so the scene can be walked and read
  const clearFoes=(x,y,r)=>{for(const e of L.enemies){if(Math.abs(e.x-x)>r||Math.abs(e.y-y)>r||/^hgo/.test(e.t))continue;let best=null;for(let q=r+2;q<=r+9&&!best;q++)for(let j=-q;j<=q&&!best;j++)for(let i=-q;i<=q;i++){if(Math.max(Math.abs(i),Math.abs(j))!==q)continue;const nx=x+i,ny=y+j;
        if(land(nx,ny)&&!O.isle[ix(nx,ny)]&&!L.enemies.some(o=>o.x===nx&&o.y===ny)&&!L.decor.some(d=>d.x===nx&&d.y===ny)&&!keep.some(k=>Math.hypot(k[0]-nx,k[1]-ny)<5)){best=[nx,ny];break}}
      if(best){e.x=best[0];e.y=best[1];if(e.rx!==undefined){e.rx=e.x;e.ry=e.y}info.moved=(info.moved||0)+1}}};
  const vig=(title,pageNo,site,fn,lt)=>{if(!site)return;tidy(site.x,site.y,2);clearFoes(site.x,site.y,site.room?2:3);fn(site);info.vig.push({t:title,p:pageNo,x:site.x,y:site.y,ix:site.ix||0,iy:site.iy||0})};
  const at=(E,i)=>[E.x+E.ix*i,E.y+E.iy*i],sd=E=>[-E.iy,E.ix];
  const wallDir=(x,y)=>DV.find(d=>rows[y+d[1]]&&rows[y+d[1]][x+d[0]]==='#');
  /* ---- 2. the thirteen places ---- */
  const lad0=lad[0];
  // 1. the first camp, near the first ladder
  vig('The Tallow Camp',1,nearTo(deadC.filter(e=>Math.hypot(e.x-lad0.ax,e.y-lad0.ay)>=8),lad0.ax,lad0.ay),E=>{const s=sd(E),a1=at(E,1),a2=at(E,2);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(1)});P('hgpd_candle',E.x,E.y,{ox:s[0]*.3,oy:s[1]*.3,sc:1});
    P('hgpd_crate',a1[0],a1[1],{ox:s[0]*.3,oy:s[1]*.3,sc:.9});P('hgpd_crate',a1[0],a1[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:.8});P('hgpd_barrel',a2[0],a2[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:.85});P('hgpd_tools',a2[0],a2[1],{ox:s[0]*.32,oy:s[1]*.32,sc:.9});
    light(a1[0],a1[1],.4);nameAt('The Tallow Camp',E.x,E.y)});
  // 2. the chalk corridor: marks scratched on both walls
  vig('The Chalk Corridor',2,farPick(deadC,24),E=>{const s=sd(E),a1=at(E,1),a2=at(E,2),a3=at(E,3);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(2)});
    for(const [c,sg] of [[a1,1],[a2,-1],[a3,1]]){const w=[sg*s[0],sg*s[1]];if(rows[c[1]+w[1]]&&rows[c[1]+w[1]][c[0]+w[0]]==='#')add('hgpd_hook',c[0],c[1],{wd:w,bob:.45,sc:.9})}
    P('hgpd_candle',a1[0],a1[1],{ox:s[0]*.3,oy:s[1]*.3,sc:.9});P('hgpd_bones',a2[0],a2[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:1.4});light(a2[0],a2[1],.4);light(a1[0],a1[1],.3)});
  // 3. the crossing post, near the second dock
  vig('The Crossing Post',3,nearTo(deadC.filter(e=>Math.hypot(e.x-O.docks[1].bx,e.y-O.docks[1].by)>=6),O.docks[1].bx,O.docks[1].by),E=>{const s=sd(E),a1=at(E,1);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(3)});P('hgpd_post',a1[0],a1[1],{ox:s[0]*.34,oy:s[1]*.34,sc:.8});P('hgpd_cage',a1[0],a1[1],{ox:s[0]*.34,oy:s[1]*.34,sc:1,bob:.5});P('hgpd_pillar',at(E,2)[0],at(E,2)[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:1});light(a1[0],a1[1],.5);nameAt('The Crossing Post',E.x,E.y)});
  // 4. the cold camp: a bedroll's worth of things, no light
  vig('The Cold Camp',4,farPick(deadC,24),E=>{const s=sd(E),a1=at(E,1);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(4),ox:s[0]*.2,oy:s[1]*.2});P('hgpd_skelS',a1[0],a1[1],{ox:-s[0]*.15,oy:-s[1]*.15,sc:1});P('hgpd_candle',E.x,E.y,{ox:-s[0]*.28,oy:-s[1]*.28,sc:.9});
    P('hgpd_straw',a1[0],a1[1],{ox:s[0]*.32,oy:s[1]*.32,sc:1.2});P('hgpd_lid',at(E,2)[0],at(E,2)[1],{ox:s[0]*.2,oy:s[1]*.2,sc:.9});nameAt('The Cold Camp',E.x,E.y)});
  // islets: the lighthouse is the islet nearest the middle of the docks, the others are shuffled
  const cen=O.docks.reduce((a,d)=>[a[0]+d.wx/O.docks.length,a[1]+d.wy/O.docks.length],[0,0]);
  const lh=nearTo(isl,cen[0],cen[1]);let rest=isl.filter(q=>q!==lh);rest.sort(()=>rnd()-.5);
  // 5. the lighthouse
  vig('The Keeper\'s Rock',5,lh,E=>{const c=cells(E,2).filter(q=>!(q[0]===E.x&&q[1]===E.y));
    add('hgpd_lamp',E.x,E.y,{block:true,sc:1});add('brazier',E.x,E.y,{ox:.3,sc:.7,block:false});
    const nc=c.find(q=>free(q[0],q[1]));if(nc)add('hgpd_book',nc[0],nc[1],{block:true,sc:1.15,read:note(5)});const n2=c.filter(q=>free(q[0],q[1]))[1];if(n2)add('hgpd_barrel',n2[0],n2[1],{sc:.8,ox:.2});
    clight(E.x,E.y,'amber',1,{z:1.2,rw:1.7,a:1,far:46,fr:null});light(E.x,E.y,.9);HGPD.lamp=[E.x,E.y];nameAt('The Keeper\'s Rock',E.x,E.y)});
  // 6. the wreck, with the second purse on it
  vig('The Wreck',6,rest.shift(),E=>{const c=cells(E,2).filter(q=>free(q[0],q[1]));
    add(IMG.hgpd_wreck?'hgpd_wreck':'hgpd_boat',E.x,E.y,{sc:1.5,block:true,bob:-.05});const o=c.filter(q=>!(q[0]===E.x&&q[1]===E.y));
    if(o[0])add('hgpd_book',o[0][0],o[0][1],{block:true,sc:1.15,read:note(6)});if(o[1])add(IMG.hgpd_skelL?'hgpd_skelL':'hgpd_skel',o[1][0],o[1][1],{sc:1});if(o[2])add('hgpd_bbucket',o[2][0],o[2][1],{sc:.9,ox:.2});if(o[4])add('hgpd_bones',o[4][0],o[4][1],{sc:1.2});if(o[3])add('chest',o[3][0],o[3][1],{block:true,gold:1000});
    light(E.x,E.y,.4);nameAt('The Wreck',E.x,E.y)});
  // 7. the drowned chapel
  vig('The Drowned Chapel',7,rest.shift(),E=>{const c=cells(E,2).filter(q=>free(q[0],q[1])&&!(q[0]===E.x&&q[1]===E.y));
    add('art_hgxstat6',E.x,E.y,{block:true,sc:1});if(c[0])add('hgpd_bell',c[0][0],c[0][1],{block:true,sc:1});if(c[1])add('hgpd_book',c[1][0],c[1][1],{block:true,sc:1.15,read:note(7)});
    if(c[2]){add('hgpd_candle',c[2][0],c[2][1],{sc:1.1,ox:.2});add('hgpd_candle',c[2][0],c[2][1],{sc:.9,ox:-.2})}if(c[3])add('hgpd_cairn',c[3][0],c[3][1],{sc:1});
    light(E.x,E.y,.5);HGPD.chapel=[E.x,E.y];nameAt('The Drowned Chapel',E.x,E.y)});
  // 8. the blue grotto (a room of glowing mushrooms)
  const rc=roomC.filter(q=>q);info.cand.room=rc.length;vig('The Blue Grotto',8,farPick(rc,22),E=>{
    for(const [i,j,sc] of [[-2,-1,2.0],[1,1,2.5]])P('hgpd_blue',E.x+i,E.y+j,{sc,ox:(i%2?.15:-.12),oy:(j%2?.1:-.15)});P('hgpd_teal',E.x+2,E.y-2,{sc:.8});P('hgpd_cairn',E.x-1,E.y+2,{sc:.9});P('hgpd_stone',E.x+2,E.y+1,{sc:1});P('hgpd_shells',E.x-2,E.y+2,{sc:1.2});
    P('hgpd_teal',E.x-2,E.y+1,{sc:1.2});P('hgpd_stone',E.x+1,E.y-2,{sc:1.1});add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(8)});
    light(E.x-1,E.y,.55);light(E.x+2,E.y+1,.45);nameAt('The Blue Grotto',E.x,E.y)});
  // 9. the reading room (a room with a shelf of books on the wall and a reader who stayed)
  vig('The Reading Room',9,farPick(rc,22),E=>{const w=[-1,0],c=[E.x-2,E.y];
    if(rows[E.y][E.x-3]==='#')add('hgpd_shelf',E.x-2,E.y,{wd:[-1,0],bob:.18,sc:1});else{const wd=wallDir(E.x,E.y);if(wd)add('hgpd_shelf',E.x,E.y,{wd,bob:.18,sc:1})}
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(9)});P('hgpd_skelS_m',E.x+1,E.y,{sc:1,ox:.1});P('hgpd_candel',E.x+1,E.y+1,{sc:1,oy:-.1,ox:.1});P('hgpd_pot',E.x-1,E.y+2,{sc:.9});P('hgpd_scale',E.x+2,E.y-1,{sc:.9});
    light(E.x,E.y,.5);nameAt('The Reading Room',E.x,E.y)});
  // 10. the tally wall: marks on both walls of the last corridor
  vig('The Tally Wall',10,farPick(deadC,24),E=>{const s=sd(E),a1=at(E,1),a2=at(E,2);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(10)});
    for(const [c,sg,sc,k] of [[E,1,1.2,'art_hgxrock3'],[a1,-1,.6,'hgpd_cairn'],[a1,1,1.0,'art_hgxrock3'],[a2,-1,.6,'hgpd_stone'],[a2,1,.5,'hgpd_cairn']])P(k,c[0],c[1],{ox:sg*s[0]*.32,oy:sg*s[1]*.32,sc}); // a row of small stone piles, one for each day
    P('hgpd_carved',a1[0],a1[1],{ox:s[0]*.22,oy:s[1]*.22,sc:1});P('hgpd_slab',a2[0],a2[1],{ox:s[0]*.1,oy:s[1]*.1,sc:1});P('hgpd_coins',a1[0],a1[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:1});light(a1[0],a1[1],.3)});
  // 11. the barricade: crates and barrels along both sides of the way (the way itself stays open)
  vig('The Barricade',11,farPick(deadC,24),E=>{const s=sd(E),a1=at(E,1),a2=at(E,2),a3=at(E,3);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(11)});
    for(const [c,i] of [[a1,0],[a2,1],[a3,2]])for(const sg of [1,-1]){const k=(i+(sg>0?0:1))%3===0?'hgpd_barrel':(i%2?'hgpd_lid':'hgpd_crate');P(k,c[0],c[1],{ox:sg*s[0]*.33,oy:sg*s[1]*.33,sc:k==='hgpd_barrel'?.9:.95})}
    P('hgpd_skelL',E.x,E.y,{sc:1,ox:s[0]*.25,oy:s[1]*.25});P('hgpd_pillar',a3[0],a3[1],{sc:1,ox:-s[0]*.05});light(a2[0],a2[1],.3);nameAt('The Barricade',E.x,E.y)});
  // 12. the dig: a cart, the tools, a great tooth
  vig('The Dig',12,farPick(deadC,24),E=>{const s=sd(E),a1=at(E,1),a2=at(E,2);
    add('hgpd_book',E.x,E.y,{block:true,sc:1.15,read:note(12)});P('hgpd_cart',a1[0],a1[1],{ox:s[0]*.2,oy:s[1]*.2,sc:1});P('hgpd_tools',a1[0],a1[1],{ox:-s[0]*.34,oy:-s[1]*.34,sc:.85});
    P('hgpd_tooth',E.x,E.y,{ox:-s[0]*.3,oy:-s[1]*.3-.1,sc:1.2});P('hgpd_rubble',a2[0],a2[1],{ox:s[0]*.3,oy:s[1]*.3,sc:1.1});P('hgpd_rubble',E.x,E.y,{ox:s[0]*.3,sc:1.1});P('hgpd_windlass',a2[0],a2[1],{ox:-s[0]*.28,oy:-s[1]*.28,sc:1});P('hgpd_tiles',a2[0],a2[1],{sc:1.2});light(a1[0],a1[1],.35)});
  // 13. the company purse, at the far end of the longest dead end
  vig('The Company Purse',13,farPick(deadC.filter(e=>Math.hypot(e.x-100,e.y-100)>45),24),E=>{const s=sd(E),a1=at(E,1);
    add('chest',E.x,E.y,{block:true,gold:1000,read:Object.assign(note(13),{once:1})}); // the first touch reads the last page, the second opens the purse
    P('hgpd_skelS',a1[0],a1[1],{ox:s[0]*.3,oy:s[1]*.3,sc:1});P('hgpd_key',a1[0],a1[1],{ox:-s[0]*.3,oy:-s[1]*.3,sc:1});
    P('hgpd_gold',E.x,E.y,{ox:s[0]*.3,oy:s[1]*.28,sc:1});P('hgpd_lanternW',at(E,2)[0],at(E,2)[1],{oy:.2,ox:-s[0]*.1,sc:1});light(a1[0],a1[1],.45)});
  // the waiting rock: statues set facing the water, and a wheel on a rock with the one who steered
  vig('The Waiting Rock',0,rest.shift(),E=>{const c=cells(E,2).filter(q=>free(q[0],q[1])&&!(q[0]===E.x&&q[1]===E.y));
    add('art_hgxstat7',E.x,E.y,{block:true,sc:.95});if(c[0])add('art_hgxstat3',c[0][0],c[0][1],{block:true,sc:1.0});if(c[1])add('hgpd_coral',c[1][0],c[1][1],{sc:1,ox:.2});if(c[2])add('hgpd_shells',c[2][0],c[2][1],{sc:1,ox:-.2});
    if(c[0])HGPD.read[c[0][0]+','+c[0][1]]={n:'A carved woman',t:'Someone carved two figures and set them on this rock, a child with a lantern and a woman, both turned to face the water. The lantern is empty. They look as if they are waiting for a boat that has not come.'};
    light(E.x,E.y,.4);nameAt('The Waiting Rock',E.x,E.y)});
  vig('The Steersman',0,rest.shift(),E=>{const c=cells(E,2).filter(q=>free(q[0],q[1])&&!(q[0]===E.x&&q[1]===E.y));
    add('hgpd_wheel',E.x,E.y,{block:true,sc:.6});if(c[0])add('hgpd_skelS_m',c[0][0],c[0][1],{sc:1});if(c[1])add('hgpd_keg',c[1][0],c[1][1],{sc:1,ox:.15});if(c[2])add('hgpd_lanternC',c[2][0],c[2][1],{sc:1.2});
    HGPD.read[E.x+','+E.y]={n:'A ship\'s wheel',t:'A ship\'s wheel, bolted to a post of the rock. There is no ship. Whoever stood here steered the dark all the way down to the end, and the rock with them.'};light(E.x,E.y,.35);nameAt('The Steersman',E.x,E.y)});
  /* ---- 2b. ROUND 2: twelve orb alcoves, each a little scene of its own with a note. A Glow Orb sits in an iron cage; lift it out and it is yours. ---- */
  const hsh=(x,y,n)=>{let h=((x*73856093)^(y*19349663)^((n||0)*83492791))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;return ((h^(h>>>16))>>>0)/4294967296};
  const OCOL=[2,0,3,2,0,3,0,2,3,0,2,3];
  const ALC=[
   ['Dunmow\'s Light','A cage of black iron with a glowing orb in it. A scrap tied to the bars says: "Dunmow\'s lantern. He said he would come back for it. Take it, Dunmow, if you can."',[['hgpd_candle',0,.32,.9],['hgpd_skelS',1,.34,1]]],
   ['The Spare Light','An orb in an iron cage, set on a ledge somebody smoothed with a chisel. Scratched under it: "For whoever comes after. The light does not run out. We tried."',[['hgpd_candel',0,.32,1],['hgpd_pot',1,-.34,.9]]],
   ['The Lamp Bearer\'s Niche','A pinned note: "The lamp bearer\'s spare. He lost his lamp on the second crossing, and we found this one too late. It is yours."',[['hgpd_windlass',0,-.34,1],['hgpd_lanternW',1,.34,1]]],
   ['The Shell Shrine','Someone has ringed an orb with shells, like a small shrine. Scratched on the stone: "A light for the water."',[['hgpd_shells',0,.34,1.3],['hgpd_coral',1,-.34,1]]],
   ['The Captain\'s Light','A card hangs from the cage: "Captain Ysolt kept this one under her bunk. She said a true captain keeps one light that nobody knows about."',[['hgpd_cask',0,-.34,1],['hgpd_key',1,.34,1]]],
   ['The Child\'s Lantern','A small cage hangs where a child could reach it. Beside it, in chalk: "Mind the step." There is no step.',[['hgpd_root',0,.34,1.3],['hgpd_coins',1,-.34,1]]],
   ['The Prior\'s Gift','A tag on the cage: "A gift from the Prior. Do not sell it. We sold the first one and the water came to ask for it back."',[['hgpd_keg',0,.34,1],['hgpd_scale',1,-.34,1]]],
   ['The Stone Stack','An orb in a cage on a cairn of white stones. On the nearest stone someone has written: "Take one, leave a stone." There are no stones left to leave.',[['hgpd_cairn',0,-.36,.7],['hgpd_stone',1,.34,1]]],
   ['Pell\'s Reading Light','The orb glows steady and green. A card under it: "Brother Pell\'s. He said it was for reading by. He mostly looked at it."',[['hgpd_straw',0,.34,1.1],['hgpd_bones',1,-.34,1]]],
   ['The Spare Shelf','A note under the cage: "Spare light and spare rope, both on the shelf, just as the Captain left them. Someone has used the rope."',[['hgpd_bbucket',0,.34,1],['hgpd_slab',1,-.34,1]]],
   ['The Dig Light','This orb is set into the wall of the dig itself. Somebody has written FOUND IT on the stone, and a little lower down, NOT WHAT WE WERE LOOKING FOR.',[['hgpd_rubble',0,.34,1.2],['hgpd_tools',1,-.34,.8],['hgpd_tooth',1,.34,1.2]]],
   ['Marta\'s Ribbon','A faded ribbon is tied round the cage. The tag says: "For Marta, when we reach the sea." The ribbon has lost its colour but not its knot.',[['hgpd_shells',0,-.34,1.2],['hgpd_carved',1,.34,1]]]];
  if(HGPD_R2&&IMG.wm_orbframe0&&typeof orbTake==='function'){
    const sites=[],okSite=e=>keep.every(k=>Math.hypot(k[0]-e.x,k[1]-e.y)>=6)&&!busy(e.x,e.y,2)&&!chosen.some(q=>Math.hypot(q[0]-e.x,q[1]-e.y)<8);
    const dd=dead.filter(okSite),rr=[];for(let y=6;y<H-6;y++)for(let x=6;x<W-6;x++)if(room(x,y,1)&&!O.isle[ix(x,y)]&&okSite({x,y}))rr.push({x,y,room:1});
    for(let i=0;i<8;i++){const e=farPick(dd.filter(okSite),11);if(e)sites.push(e)}
    for(let i=0;i<6;i++){const e=farPick(rr.filter(okSite),11);if(e)sites.push(e)}
    for(let i=0;i<2&&rest.length>2;i++){const q=rest.shift();if(q&&!busy(q.x,q.y,1)){sites.push(q);chosen.push([q.x,q.y])}}
    info.cand.alc=[dd.length,rr.length,sites.length,rest.length];
    // spread them: the dead ends and rooms are interleaved so the orbs are not in one corner
    sites.length=Math.min(sites.length,12);
    sites.sort((a,b)=>Math.atan2(a.y-100,a.x-100)-Math.atan2(b.y-100,b.x-100));
    sites.forEach((E,i)=>{const sp=ALC[i%ALC.length],oi=OCOL[i%OCOL.length],isl=!!O.isle[ix(E.x,E.y)];
      vig(sp[0],0,E,E=>{
        const cs=[[E.x,E.y]];if(E.ix||E.iy){for(let n=1;n<=2;n++){const c=[E.x+E.ix*n,E.y+E.iy*n];if(land(c[0],c[1]))cs.push(c)}}
        else for(const v of DV){const c=[E.x+v[0],E.y+v[1]];if(land(c[0],c[1])&&!!O.isle[ix(c[0],c[1])]===isl&&!L.decor.some(d=>d.x===c[0]&&d.y===c[1]&&d.block))cs.push(c)}
        const s=(E.ix||E.iy)?sd(E):[1,0];
        const f=add('wm_orbframe'+oi,E.x,E.y,{block:true,sc:.62});f.npc='wm_orbframe';f.orbFrame=true;f.emptyK='wm_orbframeE'+oi;
        clight(E.x,E.y,'o'+oi,.6,{z:.38,rw:.7,a:.9,fr:E.x+','+E.y});
        for(const [k,ci,o,sc] of sp[2]){const c=cs[Math.min(ci,cs.length-1)];P(k,c[0],c[1],{ox:o*s[0],oy:o*s[1],sc})}
        // the note: scratched on a board on the wall beside the way in, or on a scrap on the floor
        const nc=cs[Math.min(1,cs.length-1)],w=wallDir(nc[0],nc[1]);
        if(w&&!isl&&(nc[0]!==E.x||nc[1]!==E.y))add('hgpd_board',nc[0],nc[1],{wd:w,bob:.22,sc:.8,read:{n:'A note by the orb',t:sp[1]}});
        else{const c2=cs.find((c,j)=>j>0&&!(c[0]===E.x&&c[1]===E.y))||(w?null:null);if(c2)add('hgpd_book',c2[0],c2[1],{block:true,sc:1,read:{n:'A note by the orb',t:sp[1]}});
          else if(w)add('hgpd_board',E.x,E.y,{wd:w,bob:.22,sc:.8,read:{n:'A note by the orb',t:sp[1]}})}
        nameAt(sp[0],E.x,E.y);info.orbs=(info.orbs||0)+1})})}
  // the other islets: one small thing each, different on each
  const IS=[(E,c)=>{add('hgpd_cairn',E.x,E.y,{block:true,sc:1.1});if(c[0])add('hgpd_candle',c[0][0],c[0][1],{sc:1})},(E,c)=>{add('hgpd_coral',E.x,E.y,{sc:1.2});if(c[0])add('hgpd_shells',c[0][0],c[0][1],{sc:1.3});if(c[1])add('hgpd_bones',c[1][0],c[1][1],{sc:1.4})},
    (E,c)=>{add('hgpd_skel',E.x,E.y,{sc:1});if(c[0])add('hgpd_lantern',c[0][0],c[0][1],{sc:1.3})},(E,c)=>{add('hgpd_barrel',E.x,E.y,{sc:.8,ox:.15});if(c[0])add('hgpd_bucket',c[0][0],c[0][1],{sc:1})}];
  rest.forEach((q,i)=>{const c=cells(q,1).filter(p=>free(p[0],p[1])&&!(p[0]===q.x&&p[1]===q.y));IS[i%IS.length](q,c);info.fills++});
  /* ---- 3. the foot of every ladder ---- */
  const KIT=[(a,s)=>[['hgpd_post',.36,.8],['hgpd_pot',-.3,1]],(a,s)=>[['hgpd_crate',.32,.85],['hgpd_candle',-.3,1]],(a,s)=>[['hgpd_barrel',-.32,.85],['hgpd_lanternW',.3,1]],(a,s)=>[['hgpd_cage',.3,.9],['hgpd_candle',-.3,.9]],
    (a,s)=>[['hgpd_tools',.33,.8],['hgpd_bbucket',-.3,.9]],(a,s)=>[['hgpd_skelS',.28,1],['hgpd_crate',-.3,.8]],(a,s)=>[['hgpd_windlass',-.3,1],['hgpd_straw',.3,1]],(a,s)=>[['hgpd_post',.34,.8],['hgpd_bones',-.3,1.4]],
    (a,s)=>[['hgpd_lid',.3,.9],['hgpd_candel',-.32,1]],(a,s)=>[['hgpd_cask',.32,1],['hgpd_coins',-.3,1]],(a,s)=>[['hgpd_scale',.34,.9],['hgpd_rubble',-.3,1.2]],(a,s)=>[['hgpd_pillar',.34,.9],['hgpd_candle',-.3,.9]]];
  // the kit stands in the corridor in front of the ladder (one and two squares back) so it is seen on the way in, not behind the party
  lad.forEach((l,i)=>{const s=[-l.dy,l.dx],cs=[[l.ax-l.dx,l.ay-l.dy],[l.ax,l.ay],[l.ax-2*l.dx,l.ay-2*l.dy]].filter(c=>land(c[0],c[1]));if(!cs.length){info.kits++;return}
    KIT[i%KIT.length]().forEach(([k,o,sc],j)=>{const c=cs[j%cs.length];let oo=o;const wl=(sg)=>rows[c[1]+sg*s[1]]&&rows[c[1]+sg*s[1]][c[0]+sg*s[0]]==='#';
      if(!wl(Math.sign(o))){if(wl(-Math.sign(o)))oo=-o}
      add(k,c[0],c[1],{ox:oo*s[0],oy:oo*s[1],sc})});info.kits++});
  /* ---- 4. scratched signs at the junctions: true directions ---- */
  const dist=(srcs)=>{const d=new Int16Array(W*H).fill(-1),q=[];for(const [x,y] of srcs){if(!land(x,y))continue;d[ix(x,y)]=0;q.push([x,y])}for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const v of DV){const nx=x+v[0],ny=y+v[1];if(land(nx,ny)&&d[ix(nx,ny)]<0){d[ix(nx,ny)]=d[ix(x,y)]+1;q.push([nx,ny])}}}return d};
  const dUp=dist(lad.map(l=>[l.ax,l.ay])),dBoat=dist(O.docks.map(d=>[d.bx,d.by]).concat(O.landings.map(l=>[l.x,l.y])));
  const CN=['north','east','south','west'],dirTo=(d,x,y)=>{const v=d[ix(x,y)];for(let i=0;i<4;i++){const nx=x+DV[i][0],ny=y+DV[i][1];if(land(nx,ny)&&d[ix(nx,ny)]===v-1)return CN[i]}return null};
  {const jc=[];for(let y=5;y<H-5;y++)for(let x=5;x<W-5;x++){if(!land(x,y)||O.isle[ix(x,y)]||deg(x,y)<3||room(x,y,1))continue;if(dUp[ix(x,y)]<6||dBoat[ix(x,y)]<6)continue;
      if(keep.some(k=>Math.hypot(k[0]-x,k[1]-y)<5)||foe(x,y,1)||L.decor.some(d=>d.x===x&&d.y===y&&!MINOR.test(d.k)))continue;const w=wallDir(x,y);if(!w)continue;jc.push({x,y,w})}
    const picked=[];const signs=[];
    for(let n=0;n<18;n++){let best=null,bs=-1;for(const c of jc){let m=1e9;for(const q of picked)m=Math.min(m,Math.hypot(q.x-c.x,q.y-c.y));if(m<20)continue;const s=Math.min(m,60)+rnd()*4;if(s>bs){bs=s;best=c}}if(!best)break;picked.push(best)}
    picked.forEach((c,i)=>{const up=i%2===0,d=up?dUp:dBoat,n=d[ix(c.x,c.y)],dir=dirTo(d,c.x,c.y);if(n<0||!dir)return;
      const text=up?'A flat stone is set into the wall, covered in glowing runes nobody can read. Under them somebody has scratched the word UP. The nearest ladder to the surface is about '+n+' steps from here. The way starts to the '+dir+'.':'A board is nailed to the wall with scraps of paper pinned on it. The top scrap says BOAT. The nearest boat is about '+n+' steps from here. The way starts to the '+dir+'.';
      add(up?'hgpd_rune':'hgpd_board',c.x,c.y,{wd:c.w,bob:.18,sc:up?.95:.9,read:{n:up?'A rune stone':'A notice board',t:text}});info.signs++})}
  /* ---- 5. dead ends that are still empty get a small scene of their own ---- */
  // round 3: sixteen different kits (each has its own main piece, no two share both props); a dead end takes the kit used least in its neighbourhood
  const FILL=[
    ['bone heap',(E,s)=>{P('hgpd_bones',E.x,E.y,{sc:1.5,ox:s[0]*.2});P('hgpd_pot',E.x,E.y,{sc:1,ox:-s[0]*.3})}],
    ['stone stack',(E,s)=>{P('hgpd_cairn',E.x,E.y,{sc:.9,ox:-s[0]*.25});P('hgpd_candle',E.x,E.y,{sc:1,ox:s[0]*.25});light(E.x,E.y,.25)}],
    ['purser',(E,s)=>{P('hgpd_crate',E.x,E.y,{sc:.85,ox:s[0]*.2});P('hgpd_coins',E.x,E.y,{sc:1,ox:-s[0]*.3})}],
    ['webbed bones',(E,s)=>{P('hgpd_skelL',E.x,E.y,{sc:1});const w=wallDir(E.x,E.y);if(w)add('art_wm_web',E.x,E.y,{wd:w,bob:.5})}],
    ['root and horn',(E,s)=>{P('hgpd_root',E.x,E.y,{sc:1.4,ox:s[0]*.2});P('hgpd_tooth',E.x,E.y,{sc:1.3,ox:-s[0]*.3})}],
    ['fallen pillar',(E,s)=>{P('hgpd_pillar',E.x,E.y,{sc:1,ox:s[0]*.15});P('hgpd_rubble',E.x,E.y,{sc:1.2,ox:-s[0]*.3})}],
    ['well winder',(E,s)=>{P('hgpd_windlass',E.x,E.y,{sc:1,ox:-s[0]*.15});P('hgpd_bbucket',E.x,E.y,{sc:1,ox:s[0]*.32,oy:-.1})}],
    ['assayer',(E,s)=>{P('hgpd_scale',E.x,E.y,{sc:1,ox:s[0]*.1});P('hgpd_coins',E.x,E.y,{sc:1.2,ox:-s[0]*.3,oy:.1})}],
    ['key on a slab',(E,s)=>{P('hgpd_slab',E.x,E.y,{sc:1,ox:-s[0]*.1});P('hgpd_key',E.x,E.y,{sc:1,ox:s[0]*.28})}],
    ['bedroll',(E,s)=>{P('hgpd_straw',E.x,E.y,{sc:1.3,ox:s[0]*.1});P('hgpd_candel',E.x,E.y,{sc:1,ox:-s[0]*.3});light(E.x,E.y,.25)}],
    ['grave marker',(E,s)=>{P('hgpd_carved',E.x,E.y,{sc:1,ox:s[0]*.05});P('hgpd_shells',E.x,E.y,{sc:1.2,ox:-s[0]*.3})}],
    ['slumped sentry',(E,s)=>{P('hgpd_skelS',E.x,E.y,{sc:1,ox:-s[0]*.1});P('hgpd_gold',E.x,E.y,{sc:.8,ox:s[0]*.3})}],
    ['digger',(E,s)=>{P('hgpd_tools',E.x,E.y,{sc:.9,ox:s[0]*.3});P('hgpd_tiles',E.x,E.y,{sc:1.2,ox:-s[0]*.25})}],
    ['cask and cup',(E,s)=>{P('hgpd_cask',E.x,E.y,{sc:1,ox:-s[0]*.2});P('hgpd_lanternC',E.x,E.y,{sc:1.1,ox:s[0]*.3,oy:.1});light(E.x,E.y,.25)}],
    ['crag and glow',(E,s)=>{P('hgpd_crag',E.x,E.y,{sc:1,ox:s[0]*.1});P('hgpd_blue',E.x,E.y,{sc:1.3,ox:-s[0]*.3});light(E.x,E.y,.3)}],
    ['drowned coral',(E,s)=>{P('hgpd_lid',E.x,E.y,{sc:.9,ox:s[0]*.2});P('hgpd_coral',E.x,E.y,{sc:1,ox:-s[0]*.3});light(E.x,E.y,.2)}]];
  info.kitNames=FILL.map(f=>f[0]);info.kitUse={};
  {let n=0;const used=[];for(const E of dead){if(n>=200)break;if(!okDead(E)||chosen.some(q=>Math.hypot(q[0]-E.x,q[1]-E.y)<5))continue;const s=sd(E);
      // the kit that has not been seen within 30 squares (fewest uses, nearest use furthest away)
      let best=0,bs=-1;FILL.forEach((f,ki)=>{let m=99,c=0;for(const u of used)if(u[2]===ki){const dd=Math.hypot(u[0]-E.x,u[1]-E.y);if(dd<m)m=dd;if(dd<40)c++}const sc=Math.min(m,60)-c*8+hsh(E.x,E.y,ki+20)*6;if(sc>bs){bs=sc;best=ki}});
      used.push([E.x,E.y,best]);info.kitUse[FILL[best][0]]=(info.kitUse[FILL[best][0]]||0)+1;FILL[best][1](E,s);info.fills++;n++}}
  /* ---- 6. long bare stretches get a landmark about every dozen squares ---- */
  {const marked=(x,y)=>L.decor.some(d=>Math.abs(d.x-x)<=3&&Math.abs(d.y-y)<=3&&!(d.pic&&/web/.test(d.k)))||(L.lights||[]).some(q=>Math.hypot(q[0]-x,q[1]-y)<=5);
    const LM=[(x,y,w)=>{add('hgpd_hook',x,y,{wd:w,bob:.55,sc:1});light(x,y,.4)},(x,y,w)=>{P('hgpd_rubble',x,y,{sc:1.4,ox:w[0]*.3,oy:w[1]*.3});P('hgpd_root',x,y,{sc:1.4,ox:-w[1]*.2,oy:w[0]*.2})},(x,y,w)=>{P('hgpd_crate',x,y,{sc:.85,ox:w[0]*.3,oy:w[1]*.3});P('hgpd_bucket',x,y,{sc:.9,ox:w[0]*.3-w[1]*.0,oy:w[1]*.3})},
      (x,y,w)=>{P('hgpd_bones',x,y,{sc:1.5,ox:w[0]*.25,oy:w[1]*.25});P('hgpd_tooth',x,y,{sc:1.3,ox:w[0]*.3,oy:w[1]*.3})},(x,y,w)=>{P('hgpd_post',x,y,{sc:.8,ox:w[0]*.36,oy:w[1]*.36})},
      (x,y,w)=>{P('hgpd_candle',x,y,{sc:1,ox:w[0]*.3,oy:w[1]*.3});P('hgpd_candle',x,y,{sc:.8,ox:w[0]*.3+.12,oy:w[1]*.3});light(x,y,.25)},(x,y,w)=>{add('hgpd_rune',x,y,{wd:w,bob:.18,sc:.95,read:{n:'A rune stone',t:HGPD_RUNES[ri++%HGPD_RUNES.length]}})}];
    let ri=0;
    let li=0;const run=(x0,y0,dx,dy)=>{let x=x0,y=y0,since=0;while(land(x,y)){const straight=land(x+dx,y+dy)&&land(x-dx,y-dy)&&!land(x+dy,y+dx)&&!land(x-dy,y-dx);
        if(!straight){since=0}else if(marked(x,y))since=0;else{since++;if(since>=14){const w=wallDir(x,y);if(w&&!foe(x,y,0)&&!keep.some(k=>Math.hypot(k[0]-x,k[1]-y)<4)){LM[li++%LM.length](x,y,w);info.marks++;since=0}}}
        x+=dx;y+=dy}};
    for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!land(x,y))continue;if(!land(x-1,y)&&land(x+1,y))run(x,y,1,0);if(!land(x,y-1)&&land(x,y+1))run(x,y,0,1)}}
  /* ---- 6b. ROUND 2: coloured pools of light at the junctions, in a few halls and at the docks, so the way can be read down the dark ---- */
  if(HGPD_R2){const jc=[];for(let y=5;y<H-5;y++)for(let x=5;x<W-5;x++){if(!land(x,y)||O.isle[ix(x,y)]||deg(x,y)<2||room(x,y,1))continue;if(deg(x,y)===2&&(land(x+1,y)&&land(x-1,y)||land(x,y+1)&&land(x,y-1)))continue;
      if(keep.some(k=>Math.hypot(k[0]-x,k[1]-y)<4)||foe(x,y,1)||L.decor.some(d=>Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=1&&!d.pic&&!MINOR.test(d.k)))continue;const w=wallDir(x,y);if(!w)continue;jc.push({x,y,w})}
    info.cand.jc=jc.length;const have=[];let n=0;const TY=['teal','blue','gold','ice','teal','blue','gold','rose'];
    for(let t=0;t<50;t++){let best=null,bs=-1;for(const c of jc){let m=1e9;for(const q of have)m=Math.min(m,Math.hypot(q.x-c.x,q.y-c.y));if(m<8)continue;
        for(const q of (L.lights||[]))m=Math.min(m,Math.hypot(q[0]-c.x,q[1]-c.y)*1.3);if(m<5)continue;const sc=Math.min(m,50)+rnd()*6;if(sc>bs){bs=sc;best=c}}
      if(!best)break;have.push(best);const {x,y,w}=best,ty=TY[n++%TY.length];
      if(ty==='teal')P('hgpd_teal',x,y,{sc:.85+rnd()*.3,ox:w[0]*.32,oy:w[1]*.32});
      else if(ty==='blue')P('hgpd_blue',x,y,{sc:1.4+rnd()*.5,ox:w[0]*.3,oy:w[1]*.3});
      else if(ty==='gold')add('hgpd_hook',x,y,{wd:w,bob:.5,sc:.9});
      else if(ty==='ice'){P('hgpd_teal',x,y,{sc:1.2,ox:w[0]*.3,oy:w[1]*.3});P('hgpd_shells',x,y,{sc:1.1,ox:w[0]*.2-w[1]*.25,oy:w[1]*.2+w[0]*.25})}
      else P('hgpd_coral',x,y,{sc:1.2,ox:w[0]*.3,oy:w[1]*.3});
      clight(x,y,ty,ty==='gold'?.45:.55,{z:ty==='gold'?.7:.4,rw:ty==='gold'?.5:.7,a:.7});info.pools=(info.pools||0)+1}
    // a few halls with a coloured light of their own (a low cold mist hangs over them)
    const rc2=roomC.filter(q=>keep.every(k=>Math.hypot(k[0]-q.x,k[1]-q.y)>=7)&&!busy(q.x,q.y,2)&&!chosen.some(c=>Math.hypot(c[0]-q.x,c[1]-q.y)<8)),HC=['ice','teal','blue','green','rose','teal'];
    for(let t=0;t<6;t++){const q=farPick(rc2.filter(e=>!chosen.some(c=>Math.hypot(c[0]-e.x,c[1]-e.y)<8)),16);if(!q)break;const c=HC[t%HC.length];
      P('hgpd_teal',q.x-1,q.y+1,{sc:1,ox:-.2});P('hgpd_blue',q.x+1,q.y-1,{sc:1.6,ox:.15});P(t%2?'hgpd_stone':'hgpd_cairn',q.x+1,q.y+1,{sc:1});
      clight(q.x,q.y,c,.7,{z:.5,rw:1,a:.8});glows.push({x:q.x+.5,y:q.y+.5,z:.14,rw:1.9,c:HALO[c],a:.2,far:0,rng:12,ph:rnd()*6.28});info.pools++}
    // the docks and the other islets show a lantern or a faint glow from the water
    O.docks.forEach(dk=>{clight(dk.bx,dk.by,'gold',.5,{z:.75,rw:.6,a:.8,far:20})});
    for(const q of rest){glows.push({x:q.x+.5,y:q.y+.5,z:.25,rw:.9,c:HALO.ice,a:.28,far:14,ph:rnd()*6.28})}
    // every other light of the level gets a small halo as well, so a lantern is seen as a lantern
    const key0=new Set(glows.map(g=>Math.floor(g.x)+','+Math.floor(g.y)));
    for(const q of (L.lights||[])){const kk=q[0]+','+q[1];if(key0.has(kk))continue;key0.add(kk);const k=(L._bsu.lk&&L._bsu.lk[kk])||.4,red=q[2]===1;glows.push({x:q[0]+.5,y:q[1]+.5,z:.42,rw:.3+.5*Math.min(1,k),c:red?'255,70,50':'255,186,96',a:red?.5:.55,far:0,rng:12,ph:rnd()*6.28})}}
  /* ---- 9. ROUND 2, the last pass over every prop of the level: grey-blue pieces, no sand disc, rows broken up, one scale table, flipped copies, a line on every sign ---- */
  if(HGPD_R2){const GM={};for(const [n] of HGPD_GREY)GM['art_wm_'+n]='hgq_'+n;GM.art_dbones='art_hgxprop0';
    for(const d of L.decor){const g=GM[d.k];if(g&&IMG[g]){if(!NPC_H[g])NPC_H[g]=NPC_H[d.k]||.5;d.k=g;info.grey=(info.grey||0)+1}}
    // a sign always says something
    for(const d of L.decor){if(!d.pic||!d.wd||!/rune|board/.test(d.k))continue;const kk=(d.x+d.wd[0])+','+(d.y+d.wd[1]);
      if(!HGPD.read[kk]){HGPD.read[kk]=/rune/.test(d.k)?{n:'A rune stone',t:HGPD_RUNES[(d.x*3+d.y)%HGPD_RUNES.length]}:{n:'A notice board',t:'Scraps of paper are pinned to the board, so old that the ink has run. One word can still be made out: WAIT.'};info.signs++}}
    // rows of three of the same thing in a line become a mixed row
    const FAM=['crate','barrel','keg','bucket','lid','candle'],CAN=k=>k.replace(/_m$/,'').replace(/^(hgpd_|hgq_|art_wm_|art_hgx)/,'').replace(/^skeleton$/,'skel').replace(/^crate_lid$/,'lid').replace(/^chain$/,'post').replace(/^prop2$/,'candle').replace(/^rock0$/,'stone').replace(/^rock2$/,'cairn').replace(/^prop0$/,'bones').replace(/^prop13$/,'tooth').replace(/^prop12$/,'root').replace(/^rock6$/,'rubble').replace(/^book[23]$/,'book');
    {const fl=L.decor.filter(d=>!d.pic&&FAM.includes(CAN(d.k)));
      for(const d of fl){const c=CAN(d.k),same=fl.filter(e=>e!==d&&CAN(e.k)===c);
        const row=same.filter(e=>(e.y===d.y&&Math.abs(e.x-d.x)<=2)||(e.x===d.x&&Math.abs(e.y-d.y)<=2));
        if(row.length>=2||same.filter(e=>Math.abs(e.x-d.x)<=1&&Math.abs(e.y-d.y)<=1).length>=1&&hsh(d.x,d.y,5)<.5&&c!=='candle'){
          const alt=FAM.filter(f=>f!==c&&f!=='candle'&&IMG['hgpd_'+f]);const nk='hgpd_'+alt[Math.floor(hsh(d.x,d.y,9)*alt.length)];d.k=nk;info.rows=(info.rows||0)+1}}}
    // the scale table: height in squares (a hero is 0.8, a villager 0.84); the engine reads sc as a multiplier on the picture's own height NPC_H
    const TGT={skel:[.5,.06],chest:[.4,0],crate:[.42,.07],barrel:[.5,.06],keg:[.38,.06],bucket:[.32,.06],lid:[.42,.04],post:[.85,.05],lamp:[1.4,0],bell:[.6,0],wheel:[.54,0],candle:[.15,.2],lantern:[.24,.1],tools:[.52,.08],cart:[.5,0],shrine:[.72,0],stone:[.36,.15],cairn:[.4,.18],stat6:[1.15,0],stat7:[1.1,0],stat3:[.75,0],blue:[.9,.12],teal:[.5,.15],coral:[.4,.1],shells:[.22,.15],bones:[.34,.1],rubble:[.34,.1],root:[.44,.1],tooth:[.4,.1],straw:[.28,.1],cage:[.5,0],book:[.14,0],pot:[.3,.1],bbucket:[.28,.08],lanternW:[.24,.1],lanternC:[.24,.1],coins:[.12,.1],tiles:[.1,.1],slab:[.3,.12],carved:[.55,.1],pillar:[.55,.1],crag:[.5,.1],scale:[.46,.06],key:[.26,.1],windlass:[.6,.04],candel:[.4,.08],cask:[.45,.06],skelL:[.3,.06],skelS:[.46,.06],wreck:[.62,0],sign:[.55,.05]};
    const scaleAll=()=>{for(const d of L.decor){if(d.pic||d.hidden)continue;const c=CAN(d.k),nh=NPC_H[d.k];if(!nh)continue;
      if(c==='boat'||c==='yar_boat_row'){const im=IMG[d.k];if(!im||!im.width)continue;const wt=c==='yar_boat_row'?1.5:1.4;d.sc=+(wt/(im.width/im.height)/nh).toFixed(2);info.scaled=(info.scaled||0)+1;continue}
      const t=TGT[c];if(!t)continue;const j=1+(hsh(d.x,d.y,7)-.5)*2*t[1];d.sc=+Math.max(.2,t[0]*j/nh).toFixed(2);info.scaled=(info.scaled||0)+1}};
    scaleAll();HGPD.rescale=scaleAll; // run again once all pictures are in (a build before a picture has loaded leaves its heights unset)
    // a skeleton does not lie on a heap of stones: the stones are moved aside
    for(const d of L.decor){if(d.pic||CAN(d.k)!=='skel')continue;for(const o of L.decor){if(o===d||o.pic||o.x!==d.x||o.y!==d.y||!/^(cairn|stone|rubble|rock3)$/.test(CAN(o.k)))continue;o.ox=(o.ox||0)-.3;d.ox=(d.ox||0)+.2;info.moved=(info.moved||0)+1}}
    // seated skeletons that other builders put in dead ends: a third keep the seated pose, a third slump, a third lie
    for(const d of L.decor){if(d.pic||CAN(d.k)!=='skel'||/^hgpd_skel[LS]/.test(d.k))continue;const h=hsh(d.x,d.y,12);if(h>=.34&&IMG.hgpd_skelS)d.k=h<.67?'hgpd_skelS':(IMG.hgpd_skelL?'hgpd_skelL':'hgpd_skelS');info.poses=(info.poses||0)+1}
    scaleAll();
    // flipped copies: about half of the loose props face the other way, the open books are in three poses at slightly different places
    for(const d of L.decor){if(d.pic)continue;const h=hsh(d.x,d.y,3);
      if(d.k==='hgpd_book'){const v=Math.floor(hsh(d.x,d.y,4)*3);if(v)d.k='hgpd_book'+(v+1);d.ox=+(((hsh(d.x,d.y,6)-.5)*.3)+(d.ox||0)).toFixed(2);d.oy=+(((hsh(d.x,d.y,8)-.5)*.2)+(d.oy||0)).toFixed(2);continue}
      if(HGPD_MIR.includes(d.k)&&IMG[d.k+'_m']&&h<.5){d.k+='_m';info.mir=(info.mir||0)+1}}}
  /* ---- 10. ROUND 3: one picture per wall square (a lantern never hides a rune), a title and a text on every sign and note, no missing picture ---- */
  if(HGPD_R2){
    const RT=['Still here','Five strokes','It is warm','Boat crossed out','Water on the left','Ladder, not here','Pell was here','Count your steps'];
    // 10a. the lantern hooks and every other wall picture that sits on the same wall square as a sign or rune are moved to the nearest bare wall square
    const sg=L.decor.filter(d=>d.pic&&d.wd&&/rune|board/.test(d.k)&&!/hook/.test(d.k));
    for(const d of L.decor.slice()){if(!d.pic||!d.wd||/rune|board|shelf/.test(d.k))continue;
      if(!L.decor.some(o=>o!==d&&o.pic&&o.wd&&o.x===d.x&&o.y===d.y&&/rune|board|shelf/.test(o.k)))continue;
      const nb=[[1,0],[-1,0],[0,1],[0,-1]];let moved=false;
      for(let r=1;r<=3&&!moved;r++)for(const v of nb){const x=d.x+v[0]*r,y=d.y+v[1]*r;if(land(x,y)&&rows[y+d.wd[1]]&&rows[y+d.wd[1]][x+d.wd[0]]==='#'&&!L.decor.some(o=>o.pic&&o.x===x&&o.y===y)&&!L.decor.some(o=>o.block&&o.x===x&&o.y===y)){d.x=x;d.y=y;moved=true;info.hooksMoved=(info.hooksMoved||0)+1;break}}
      if(!moved){L.decor.splice(L.decor.indexOf(d),1);info.removed++}}
    // 10b. every sign and note: text and a short title (one to four words)
    const ONAME=new Set(ALC.map(a=>a[1]));let ri2=0;
    for(const d of L.decor){const isSign=d.pic&&d.wd&&/rune|board/.test(d.k),rd=isSign?HGPD.read[(d.x+d.wd[0])+','+(d.y+d.wd[1])]:HGPD.read[d.x+','+d.y];
      if(!rd||!(isSign||/book|^art_hgxstat|wheel/.test(d.k)))continue;
      if(!d.text)d.text=rd.t;
      if(!d.label){let lb=rd.n||'';
        if(isSign){const ri=HGPD_RUNES.indexOf(rd.t);
          if(/rune/.test(d.k))lb=ri>=0?RT[ri]:/UP\./.test(rd.t)?'The way up':'Rune stone';
          else lb=/BOAT/.test(rd.t)?'Way to a boat':/WAIT/.test(rd.t)?'Wait':ONAME.has(rd.t)?(ALC.find(a=>a[1]===rd.t)[0]):'Pinned scraps'}
        else if(rd.page)lb='Journal, page '+rd.page;
        else if(ONAME.has(rd.t))lb=ALC.find(a=>a[1]===rd.t)[0];
        else if(/wheel/.test(d.k)||/wheel/.test(rd.t))lb='A ship\'s wheel';
        else if(/carved/i.test(rd.n||''))lb='The waiting figures';
        if(!lb||lb.split(/\s+/).length>4)lb=(lb||'A note').split(/\s+/).slice(0,4).join(' ');
        d.label=lb.replace(/[—–]/g,',')}}
    for(const d of L.decor){if(d.pic&&d.wd&&/rune|board/.test(d.k)&&!d.text){d.text=HGPD_RUNES[ri2++%HGPD_RUNES.length];if(!d.label)d.label='Rune stone'}}
    // 10b2. round 4: every three-by-three hall with no light within four squares gets a standing lantern in one corner and a lit pool (hubs measured 62 of 255, now aimed at 70 or more)
    {const lt=L.lights||[],hubs=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!land(x,y)||O.isle[ix(x,y)])continue;let r=true;for(let j=-1;j<=1&&r;j++)for(let i=-1;i<=1;i++)if(!land(x+i,y+j)||O.isle[ix(x+i,y+j)]){r=false;break}if(r)hubs.push([x,y])}
      const HC=['gold','amber','teal','gold','white'];let hi=0;info.hubLights=0;
      for(const [x,y] of hubs){if(lt.some(q=>Math.hypot(q[0]-x,q[1]-y)<=1.5))continue;if(foe(x,y,2))continue;
        const cx=x+(((x*7+y*3)&1)?1:-1),cy=y+(((x*5+y*11)&1)?1:-1);if(!land(cx,cy)||L.decor.some(d=>!d.pic&&d.x===cx&&d.y===cy&&d.block))continue;
        add('hgpd_lanternW',cx,cy,{sc:1.3,ox:.12});clight(cx,cy,HC[hi++%HC.length],.95,{z:.3,rw:.65,a:.8});info.hubLights++}}
    // 10c. a picture that is missing is swapped for a candle, so the game never draws an empty slot
    for(const d of L.decor)if(/^hgpd_/.test(d.k)&&!IMG[d.k]){d.k=IMG.hgpd_candle?'hgpd_candle':d.k;info.missing=(info.missing||0)+1}
  }
  /* ---- 7. names on the map ---- */
  L.mapNames=(L.mapNames||[]).concat(info.names);
  info.pages=info.vig.filter(v=>v.p).length;L._hgpd=info}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L&&L._hgdo&&L._bsu)try{const t0=performance.now();hgpdBuild(L);try{if(!window.__NOHGPDWV)hgpdWallVar(L)}catch(e){console.error('hgpd wallvar',e)}if(L._hgpd)L._hgpd.ms=Math.round(performance.now()-t0)}catch(e){console.error('hgpdBuild',e)}}}
/* a stone statue in a dead-end nook whose mouth is a junction square fills the whole screen as you pass (the engine scales a sprite by 1/depth): those few are dropped */
if(typeof hgdnPlace==='function'){const _hp=hgdnPlace;hgdnPlace=function(L){const had=!!L._hgdn,r=_hp.apply(this,arguments);
  try{if(!had&&r&&L._hgdo){const O=L._hgdo,rows=L.rows,land=(x,y)=>rows[y]&&rows[y][x]==='.'&&O.wm[y*201+x]!==1,DV=[[0,-1],[1,0],[0,1],[-1,0]],dg=(x,y)=>DV.filter(d=>land(x+d[0],y+d[1])).length;
      for(let i=r.length-1;i>=0;i--){const q=r[i],n=DV.map(v=>[q.x+v[0],q.y+v[1]]).find(c=>land(c[0],c[1]));if(!n)continue;if(dg(n[0],n[1])>=3){const di=L.decor.findIndex(d=>d.x===q.x&&d.y===q.y&&d.k===q.k);if(di>=0)L.decor.splice(di,1);r.splice(i,1);HGPD.statDrop=(HGPD.statDrop||0)+1}}}}catch(e){console.error('hgpd stat',e)}
  return r}}
/* ---------- the bell of the drowned chapel, tolling in the dark ---------- */
{const _u=update;update=function(dt){
  try{if(LEVEL===HGPD.ID&&G.state==='play'&&HGPD.chapel&&G.time>HGPD.bellT){const d=Math.hypot(G.P.x-HGPD.chapel[0],G.P.y-HGPD.chapel[1]);HGPD.bellT=G.time+9+Math.random()*7;
      if(d<16&&AC&&!G.mute&&SNDOPT.amb){const v=Math.max(.012,.06*(1-d/16));tone(196,188,1.6,'sine',v,0);tone(392,380,1.1,'sine',v*.5,.02);tone(588,570,.7,'sine',v*.25,.04)}}}catch(e){}
  return _u.apply(this,arguments)}}
// round 4: a brightened copy of a wall texture (the rock was too dark to lift with light alone: hubs measured 62), cached under key+'_lit'
function hgpdLit(key,f){try{const im=IMG[key];if(!im||!im.width)return key;const k=key+'_lit';if(IMG[k])return k;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.filter='brightness('+(f||1.3)+') contrast(1.04)';x.drawImage(im,0,0);IMG[k]=c;return k}catch(e){return key}}
/* ---------- round 4: the one rock tile is broken up. Three more wall tiles (the second painted brick, a damp green-stained one, a pale chalky one) are scattered over the wall squares that face a
   corridor, in two-by-two patches (about one square in six), done last so no builder that looks for '#' is confused. ---------- */
function hgpdWallVar(L){
  if(!OH_STY.hgdu_rock||L._hgpdWV)return;L._hgpdWV=1;const TM=ohTiles(),W=201,H=201,rows=L.rows;
  const BR=OH_STY.hgdu_rock.plain,BR2=IMG.art_tex_hgdu_brick2&&IMG.art_tex_hgdu_brick2.width?hgpdLit('art_tex_hgdu_brick2'):BR;
  const V=[['hgpd_wv0',BR2,[246,244,252]],['hgpd_wv1',BR,[200,236,216]],['hgpd_wv2',BR2,[255,250,236]]],chs=[];
  V.forEach(([sty,img0,tint],i)=>{const img=IMG[img0]&&IMG[img0].width?img0:(IMG[BR]&&IMG[BR].width?BR:'art_tex_wall_cave');OH_STY[sty]=Object.assign({},OH_STY.hgdu_rock,{plain:img,door:img,win:img,alt:img,tint});const c=String.fromCharCode(0x3d0+i);L.chars[c]=TM.make('plain',sty,2.7).gid;chs.push(c)});
  const h=(x,y)=>{let v=(x*374761393+y*668265263+476)>>>0;v=Math.imul(v^(v>>>13),1274126177)>>>0;return ((v^(v>>>16))>>>0)/4294967296};
  let n=0;const out=rows.map((r,y)=>{if(y<1||y>=H-1)return r;const a=r.split('');
    for(let x=1;x<W-1;x++){if(a[x]!=='#')continue;if(rows[y][x-1]!=='.'&&rows[y][x+1]!=='.'&&rows[y-1][x]!=='.'&&rows[y+1][x]!=='.')continue;
      const q=h(x>>1,y>>1);if(q<.17){a[x]=chs[Math.floor(q/.17*3)%3];n++}}
    return a.join('')});
  for(let y=0;y<H;y++)rows[y]=out[y];if(L._hgpd)L._hgpd.wallVar=n}
/* ==========================================================================
   ROUND 2 (lighting, beacons, orbs)
   - coloured pools: the lights made in hgpdBuild carry a colour; the engine takes a colour per light (LIGHTS[].col) and a range (range2).
   - halos: the engine only lights the floor and the walls, so a lantern far down a corridor is not seen. Every light and a few beacons get a soft glow drawn over the view where it stands,
     hidden when a wall is in the way (zbuf). The lighthouse and the docks can be seen from forty squares across the water.
   - the Underlevel is a little less black (the lift is small: the dark is still the dark) and the Glow Orb already counts (partyLight reads it, 3.2 against a torch's 1).
   - orb frames: the game copies only some decor fields into G.decor, so orbFrame and emptyK are set again whenever the list changes (orbs.js then empties the frames already taken).
   ========================================================================== */
{const _s=setupLights;setupLights=function(){_s.apply(this,arguments);
  try{if(LEVEL!==HGPD.ID||!HGPD.cl)return;for(const l of LIGHTS){if(!l.free||l.lamp)continue;const c=HGPD.cl[(l.x-.5)+','+(l.y-.5)];if(c){l.col=c[0];l.calm=true;l.kI=Math.max(1.05,c[1]*1.7);l.range2=c[1]>=.9?150:c[1]>=.6?80:56}}}catch(e){}}}
{const _sl=setLightLevel;setLightLevel=function(l){_sl.apply(this,arguments);
  if(HGPD_R2&&LEVEL===HGPD.ID){RANGE*=1.8;for(let i=0;i<=1024;i++)LUT[i]+=.27+.1*(i/1024)}}}
function hgpdGlows(){
  if(LEVEL!==HGPD.ID||!HGPD.glows||typeof bsuAirOn!=='function'||!bsuAirOn())return;
  const C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0),dX=Math.cos(LA),dY=Math.sin(LA),pX=-dY*PL,pY=dX*PL,cx=C.x+.5-dX*.28,cy=C.y+.5-dY*.28,T=G.time,taken=(G.flags&&G.flags.orbTaken)||{};
  ctx.save();ctx.beginPath();ctx.rect(0,0,VW,VH);ctx.clip();ctx.globalCompositeOperation='lighter';let drawn=0;
  for(const g of HGPD.glows){
    if(g.fr&&taken[LEVEL+':'+g.fr])continue;
    const rx=g.x-cx,ry=g.y-cy,d2=rx*rx+ry*ry,lim=g.far||g.rng||14;if(d2>lim*lim)continue;
    const tY=(-1/PL)*(-pY*rx+pX*ry);if(tY<.4)continue;const tX=(-1/PL)*(dY*rx-dX*ry);
    const sx=VW/2*(1+tX/tY),sy=HH-(g.z-EYE)*F/tY;if(sx<-100||sx>VW+100)continue;
    const col=Math.floor(sx);let vis=0,nn=0;for(let o=-6;o<=6;o+=3){const c2=col+o;if(c2<0||c2>=VW)continue;nn++;if(zbuf[c2]+.45>=tY)vis++}if(!nn||!vis)continue;
    const dd=Math.sqrt(d2),fade=Math.min(1,(lim-dd)/(g.far?14:4));
    const fl=.9+.1*Math.sin(T*(g.far?2.1:5.3)+g.ph),r=Math.min(150,Math.max(g.far>=30?28:g.far?15:4,g.rw*F/tY*(g.far>=30?1.6:1))),al=Math.min(1,g.a*fl*(vis/nn)*fade*(g.far&&dd>6?1:Math.min(1,dd/2.5)));
    if(al<.02)continue;
    const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,r);gr.addColorStop(0,'rgba('+g.c+','+(.85*al).toFixed(3)+')');gr.addColorStop(.3,'rgba('+g.c+','+(.38*al).toFixed(3)+')');gr.addColorStop(1,'rgba('+g.c+',0)');
    ctx.fillStyle=gr;ctx.fillRect(sx-r,sy-r,r*2,r*2);
    if(g.far>=30){ // a beacon: a hot white core and a long soft streak across the water
      const r2=Math.max(4,r*.25);const g2=ctx.createRadialGradient(sx,sy,0,sx,sy,r2);g2.addColorStop(0,'rgba(255,248,225,'+(.95*al).toFixed(3)+')');g2.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=g2;ctx.fillRect(sx-r2,sy-r2,r2*2,r2*2);
      ctx.save();ctx.translate(sx,sy);ctx.scale(4.5,.16);const g3=ctx.createRadialGradient(0,0,0,0,0,r*.9);g3.addColorStop(0,'rgba('+g.c+','+(.5*al).toFixed(3)+')');g3.addColorStop(1,'rgba('+g.c+',0)');ctx.fillStyle=g3;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore()}
    if(++drawn>26)break}
  ctx.restore()}
{const _h=uwHud;uwHud=function(){_h.apply(this,arguments);try{hgpdGlows()}catch(e){}}}
{let seen=null,seenN=-1;const _u=update;update=function(dt){
  try{if(LEVEL===HGPD.ID&&HGPD.rescale&&!HGPD.rescaled&&G.state==='play'){HGPD.rescaled=1;HGPD.rescale()}}catch(e){}
  try{if(LEVEL===HGPD.ID&&G.decor&&(G.decor!==seen||G.decor.length!==seenN)){seen=G.decor;seenN=G.decor.length;for(const d of G.decor){const m=/^wm_orbframe(\d)$/.exec(d.k||'');if(m&&!d.orbFrame){d.orbFrame=true;d.emptyK='wm_orbframeE'+m[1]}}}}catch(e){}
  return _u.apply(this,arguments)}}
