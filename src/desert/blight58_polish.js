/* ==========================================================================
   POLISH FOR PLACES 5 TO 8 OF THE BLIGHTED ROAD (critic round, 29 Oct 2026): the Bone Orchard 9650, Lanternrest 9660, the Vault of Maldrake 9670 to 9678, Hollowbell Abbey 9680.
   Everything here is added to a level after its own builder has run (wrap of KH_LAZY), so the place files stay as they were: ground variety (mud and bare patches), crows on the ground,
   braziers and lit pools, crates and carts in the Lanternrest yard, tomb ceilings in the crypts. Pictures are painted pieces of the game (the bell, the brazier, the raven) with filters.
   Prefix b58. No prop that blocks is added unless the check below shows the walkable area is the same afterwards.
   ========================================================================== */
const B58={};
function b58Mk(key,src,filter,h){const s=IMG[src];if(!s||!s.width)return false;const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');try{x.filter=filter}catch(e){}x.drawImage(s,0,0);IMG[key]=c;if(h)NPC_H[key]=h;return true}
function b58Art(){
  if(B58._a)return;
  if(!b58Mk('b58_brazier','hpb_brazier_4','hue-rotate(42deg) saturate(1.25) brightness(.95)',1.25)){IMG.b58_brazier=IMG.brazier0||IMG.gy_lantern;NPC_H.b58_brazier=NPC_H.brazier0||NPC_H.gy_lantern}
  if(!b58Mk('b58_lych','gy_lych','saturate(.3) brightness(.72) sepia(.15)',NPC_H.gy_lych)){}
  for(const k of ['ww_willow','ww_oakmoss','ww_oakface'])b58Mk('b58_'+k,k,'brightness(.66) saturate(.75)',NPC_H[k]);
  B58._a=1}
const b58vn=(x,y,cs,sd)=>{const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(hash2(i,j,sd)*(1-sx)+hash2(i+1,j,sd)*sx)*(1-sy)+(hash2(i,j+1,sd)*(1-sx)+hash2(i+1,j+1,sd)*sx)*sy};
/* ground: patches of mud and bare earth on open grass (only cells that are grass now), so that the dead grass is not one flat green */
function b58Ground(L,seed,o){
  o=o||{};const W=L.rows[0].length,H=L.rows.length,fm=L.fmap.map(s=>s.split(''));let n=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(L.rows[y][x]!=='.')continue;const c=fm[y][x];
    if(c==='0'){const a=b58vn(x,y,6,seed),b=b58vn(x,y,4,seed+9);
      if(a>(o.mud||.7)+.1){fm[y][x]='5';n++}else if(a>(o.mud||.7)){fm[y][x]='1';n++}else if(b<(o.bare||.2)){fm[y][x]=(hash2(x,y,seed)<.6)?'2':'1';n++}}
    else if(c==='4'&&o.cobbleMud&&o.cobbleMud(x,y)){fm[y][x]='5';n++}}
  L.fmap=fm.map(r=>r.join(''));return n}
function b58Reach(L,extra){
  const W=L.rows[0].length,H=L.rows.length,bs=new Set(extra||[]);for(const d of L.decor)if(d.block)bs.add(d.x+','+d.y);
  const seen=new Uint8Array(W*H),q=[L.start.y*W+L.start.x];seen[q[0]]=1;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[ny*W+nx]||L.rows[ny][nx]!=='.'||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}
  return q.length}
/* add a prop to a built level; a blocking prop is only kept when the walkable area stays the same size (minus its own cell) */
function b58Add(L,occ,k,x,y,o){
  o=o||{};if(!k||!L.rows[y]||L.rows[y][x]!=='.'||occ.has(x+','+y))return null;
  const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;
  if(o.block){const a=b58Reach(L);L.decor.push(d);if(b58Reach(L)<a-1){L.decor.pop();return null}}else L.decor.push(d);
  occ.add(x+','+y);return d}
const b58Occ=L=>{const s=new Set();for(const d of L.decor)s.add(d.x+','+d.y);for(const e of L.enemies)s.add(e.x+','+e.y);for(const p of L.portals||[])s.add(p.x+','+p.y);return s};
function b58Light(L,x,y,col){L.lights.push([x,y]);if(col&&L._bl)L._bl.lcol[x+','+y]=col}
const B58_WARM=[1.5,1.05,.55];
/* crows on the ground: n ravens at random open cells of the given region that are free, not on a path of flags (so that none stands in a doorway) */
function b58Crows(L,occ,seed,n,reg,sc){
  let put=0;for(let t=0;t<n*40&&put<n;t++){const x=reg[0]+((hash2(t,1,seed)*(reg[2]-reg[0]+1))|0),y=reg[1]+((hash2(t,2,seed)*(reg[3]-reg[1]+1))|0);
    if(L.fmap[y][x]==='3'||L.fmap[y][x]==='1')continue;
    if(b58Add(L,occ,'gy_raven',x,y,{sc:sc||.3}))put++}
  return put}
/* ---------- wrap a level builder: the fix runs once, after the level exists ---------- */
function b58Wrap(id,fn){
  const o=KH_LAZY[id];if(!o)return;
  KH_LAZY[id]=function(){const had=!!LEVELS[id];const r=o.apply(this,arguments);const L=LEVELS[id];
    if(L&&!L._b58){L._b58=1;try{b58Art();fn(L)}catch(e){console.error('b58 '+id,e)}}return r}}
/* the wall stairs of Lanternrest lead up to a wall walk that is closed: a board says so, so that nobody looks for a way up */
khNpc('b58_wallsign','Notice at the wall stair','greensign',()=>say('A board nailed above the wall stair: WALL WALK. SENTRIES ONLY. BY ORDER OF CAPT. MARSH. The stair is chained shut at the top, and a sentry stands guard at the foot.',[BYE]));
/* ----- the Bone Orchard ----- */
b58Wrap(9650,L=>{
  b58DarkTrees(L);
  b58Ground(L,50,{mud:.74,bare:.14});
  // the bell stood inside a box of three iron fences and could not be seen: the bell now stands in the open on its own
  L.decor=L.decor.filter(d=>!(d.k==='bl_fence'&&d.x>=43&&d.x<=45&&d.y>=28&&d.y<=29));
  const occ=b58Occ(L);
  // braziers in the Harvest Yard: warm pools in the cold, round the bell
  for(const [x,y] of [[38,24],[50,24],[41,30],[47,30]]){if(b58Add(L,occ,'b58_brazier',x,y,{sc:1})){b58Light(L,x,y,B58_WARM)}}
  // a lit brazier at each end of the lane, and by the press shed
  for(const [x,y] of [[43,35],[45,35],[63,33]]){if(b58Add(L,occ,'b58_brazier',x,y,{sc:.9}))b58Light(L,x,y,B58_WARM)}
  b58Crows(L,occ,7,9,[6,6,32,30],.3);b58Crows(L,occ,8,6,[56,6,78,22],.3);b58Crows(L,occ,9,8,[6,42,56,66],.3);
  for(const [x,y] of [[38,23],[42,23],[62,28],[66,28],[70,15],[72,15]])b58Light(L,x,y,[1.5,1.0,.5]);
  b58Wheel(L,occ,[[60,30],[66,33]]);
  // the crypt field has no warm light at all: two candle lights on the crypt path
  b58Light(L,24,45,[1.3,.95,.6]);b58Light(L,24,58,[1.3,.95,.6])});
/* the willows and moss oaks of the dress are pale at a distance and read as white fences: darker copies */
function b58DarkTrees(L){for(const d of L.decor)if(IMG['b58_'+d.k])d.k='b58_'+d.k}
function b58Wheel(L,occ,cells){for(const [x,y] of cells)if(b58Add(L,occ,'bl_barrow',x,y,{block:false,sc:.8}))break}
/* ----- Lanternrest ----- */
b58Wrap(9660,L=>{
  b58DarkTrees(L);
  const occ=b58Occ(L);
  // braziers along the inside of the wall and beside every wall stair: a lit wall is a wall you can read
  const bra=[];for(const y of [12,19,26,33,43])bra.push([20,y],[68,y]);for(const x of [26,34,52,60])bra.push([x,8]);for(const [x,y] of [[22,15],[66,15],[22,40],[66,40],[44,9]])bra.push([x+(x<40?1:-1),y],[x,y+1]);
  for(const [x,y] of bra)if(b58Add(L,occ,'b58_brazier',x,y,{sc:.9}))b58Light(L,x,y,B58_WARM);
  // the outside of the wall was one blank grey face: banners and braziers on the road side of the south wall, and on the east and west faces
  const ban=IMG.wl2_hall_0?'wl2_hall_0':(IMG.kh_throne1_1?'kh_throne1_1':null);
  for(const x of [22,28,34,38,50,54,60,66]){if(ban)b58Add(L,occ,ban,x,47,{sc:.9});if(x%12===10||x===34||x===60)if(b58Add(L,occ,'b58_brazier',x+2,47,{sc:.9}))b58Light(L,x+2,47,B58_WARM)}
  for(const y of [14,22,30,38]){if(ban){b58Add(L,occ,ban,17,y,{sc:.9});b58Add(L,occ,ban,71,y,{sc:.9})}}
  for(const [x,y] of [[22,15],[66,15],[22,40],[66,40]]){const sx=x+(x<40?2:-2);if(L.rows[y][sx]==='.'&&!occ.has(sx+','+y)){L.decor.push({k:'greensign',x:sx,y,block:true,solid:1,npc:'b58_wallsign',deco:false,sc:.8});occ.add(sx+','+y)}}
  // stores and carts: crates, barrels, sacks by the hall, the stable and the stew
  const clutter=[['kh_oqstuff_8',43,16],['kh_oqstuff_2',45,16],['kh_oqstuff_9',47,17],['kh_oqstuff_2',58,12],['kh_oqstuff_8',59,13],['kh_oqstuff_9',65,12],['kh_oqstuff_2',36,20],['kh_oqstuff_9',37,19],['kh_oqstuff_6',40,24],
    ['kh_oqstuff_8',26,13],['kh_oqstuff_2',25,29],['kh_oqstuff_9',60,28],['kh_oqstuff_6',56,29],['kh_oqstuff_4',50,22],['kh_oqstuff_5',62,33],['kh_oqstuff_2',33,40],['kh_oqstuff_8',66,33],['kh_oqstuff_9',27,36],['kh_oqstuff_6',36,34],['bl_barrow',55,16]];
  for(const [k,x,y] of clutter)b58Add(L,occ,k,x,y,{block:true,sc:.8});
  for(const [x,y] of [[38,30],[50,30],[44,36]])if(b58Add(L,occ,'b58_brazier',x,y,{sc:.95}))b58Light(L,x,y,B58_WARM);
  // crows on the road side only (the fort is kept clear of them)
  b58Crows(L,occ,11,10,[3,53,87,65],.3)});
/* ----- Hollowbell Abbey ----- */
b58Wrap(9680,L=>{
  b58DarkTrees(L);
  b58Ground(L,80,{mud:.76,bare:.14});
  const occ=b58Occ(L);
  for(const d of L.decor)if(d.k==='gy_lych'&&IMG.b58_lych){d.k='b58_lych'}
  for(const [x,y] of [[53,22],[56,22],[21,46],[23,46],[24,16],[28,16]])b58Light(L,x,y,[1.4,1.05,.6]);
  for(const [x,y] of [[39,30],[43,30],[39,26],[43,26]])if(b58Add(L,occ,'b58_brazier',x,y,{sc:.95}))b58Light(L,x,y,[1.25,1.1,.8]);
  b58Crows(L,occ,13,12,[16,6,68,30],.3);b58Crows(L,occ,14,8,[4,41,80,68],.3)});
/* ----- crypts and cellars get a tomb ceiling instead of house beams ----- */
for(const id of [9652,9653,9686]){const o=KH_LAZY[id];if(!o)continue;
  KH_LAZY[id]=function(){const r=o.apply(this,arguments);const L=LEVELS[id];if(L&&!L._b58c){L._b58c=1;L.ceil='tomb'}return r}}
