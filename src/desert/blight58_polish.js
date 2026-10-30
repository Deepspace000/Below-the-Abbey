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
    if(L.decor.some(d=>d.k==='gy_raven'&&Math.abs(d.x-x)<=2&&Math.abs(d.y-y)<=2))continue;   // no two ravens side by side
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
  for(const [x,y] of [[41,34],[47,34],[63,33]]){if(b58Add(L,occ,'b58_brazier',x,y,{sc:.9}))b58Light(L,x,y,B58_WARM)}
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
  const bra=[];for(const y of [12,19,26,33,43])bra.push([20,y],[68,y]);for(const x of [26,34,52,60])bra.push([x,8]);for(const [x,y] of [[22,15],[66,15],[22,40],[66,40],[44,9]])bra.push([x+(x<40?1:-1),y]);
  for(const [x,y] of bra)if(b58Add(L,occ,'b58_brazier',x,y,{sc:.9}))b58Light(L,x,y,B58_WARM);
  // the outside of the wall was one blank grey face: banners and braziers on the road side of the south wall, and on the east and west faces
  const ban=IMG.wl2_hall_0?'wl2_hall_0':(IMG.kh_throne1_1?'kh_throne1_1':null);
  for(const x of [22,28,34,38,50,54,60,66]){if(ban)b58Add(L,occ,ban,x,47,{sc:.9});if(x%12===10||x===34||x===60)if(b58Add(L,occ,'b58_brazier',x+2,47,{sc:.9}))b58Light(L,x+2,47,B58_WARM)}
  for(const y of [14,22,30,38]){if(ban){b58Add(L,occ,ban,17,y,{sc:.9});b58Add(L,occ,ban,71,y,{sc:.9})}}
  for(const [x,y] of [[22,15],[66,15],[22,40],[66,40]]){const sx=x+(x<40?2:-2);if(L.rows[y][sx]==='.'&&!occ.has(sx+','+y)){L.decor.push({k:'greensign',x:sx,y,block:true,solid:1,npc:'b58_wallsign',deco:false,sc:.8});occ.add(sx+','+y)}}
  // stores and carts: crates, barrels, sacks by the hall, the stable and the stew
  const clutter=[['kh_oqstuff_8',43,16],['kh_oqstuff_2',45,16],['kh_oqstuff_9',47,17],['kh_oqstuff_2',58,12],['kh_oqstuff_8',59,13],['kh_oqstuff_9',65,12],['kh_oqstuff_2',36,20],['kh_oqstuff_9',37,19],['kh_oqstuff_6',40,24],
    ['kh_oqstuff_8',26,13],['kh_oqstuff_2',25,29],['kh_oqstuff_9',60,28],['kh_oqstuff_6',56,29],['kh_oqstuff_4',50,22],['kh_oqstuff_5',62,33],['kh_oqstuff_2',33,40],['kh_oqstuff_8',66,33],['kh_oqstuff_9',27,36],['kh_oqstuff_6',36,34],['bl_barrow',55,16]];
  for(const [k,x,y] of clutter){if(L._bgrPath&&L._bgrPath.has(x+','+y))continue;b58Add(L,occ,k,x,y,{block:true,sc:.8})}   // nothing on the yard paths
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

/* ==========================================================================
   QA AND ATMOSPHERE PASS FOR PLACES 8 TO 10 (Hollowbell Abbey 9680 to 9686, the Rookery Mill 9690 to 9694, the Pale Bridge 9700 to 9702), 29 Oct 2026. Prefix b891.
   Runs once per level, after the builder (own wrap of KH_LAZY, flag _b891). Fixes: identical crates in one cell, crates in a row, six identical seated skeletons,
   hostile creatures standing in tight spots or beside a living person; adds: notes and signs with writing, litter and trails, candle and lamp light, colder or warmer haze, and sounds.
   Every prop that blocks is only kept when the walkable area stays the same (b58Reach). Plain literal text, no em dashes.
   ========================================================================== */
const B891={};
function b891Wrap(id,fn){const o=KH_LAZY[id];if(!o)return;
  KH_LAZY[id]=function(){const r=o.apply(this,arguments);const L=LEVELS[id];if(L&&!L._b891){L._b891=1;try{fn(L,id)}catch(e){console.error('b891 '+id,e)}}return r}}
function b891Open(L,id,x,y,blk){const W=L.rows[0].length,T=TERRS[id];if(!L.rows[y]||L.rows[y][x]!=='.')return false;if(T&&T.block&&T.block[y*W+x])return false;return !blk.has(x+','+y)}
function b891Blk(L){const s=new Set();for(const d of L.decor)if(d.block&&!d.found)s.add(d.x+','+d.y);return s}
function b891Free2(L,id,x,y,blk){for(const ox of[0,-1])for(const oy of[0,-1]){let ok=true;for(let i=0;i<2&&ok;i++)for(let j=0;j<2;j++)if(!b891Open(L,id,x+ox+i,y+oy+j,blk)){ok=false;break}if(ok)return true}return false}
/* a free, roomy cell near (tx,ty): not on a path, not in a doorway, with most of its neighbours open */
function b891Spot(L,id,occ,tx,ty,r,minOpen){
  const blk=b891Blk(L);
  for(let q=0;q<=r;q++)for(let dy=-q;dy<=q;dy++)for(let dx=-q;dx<=q;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==q)continue;const x=tx+dx,y=ty+dy;
    if(!b891Open(L,id,x,y,blk)||occ.has(x+','+y))continue;const f=L.outdoor&&L.fmap&&L.fmap[y]?L.fmap[y][x]:'0';if(f==='1'||f==='3'||f==='4')continue;
    let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&b891Open(L,id,x+a,y+b,blk)&&!occ.has((x+a)+','+(y+b)))n++;
    if(n>=(minOpen||7))return [x,y]}
  return null}
/* a thing with writing on it: walk up and press */
function b891Note(L,id,occ,k,npcId,tx,ty,r,sc,loose){
  let p=b891Spot(L,id,occ,tx,ty,r||4,7);if(!p&&loose)p=b891Spot(L,id,occ,tx,ty,r||4,5)||b891Spot(L,id,occ,tx,ty,r||4,4);/* a small room is full of furniture: a spot with fewer open squares round it is taken there */if(!p||!IMG[k]){console.warn('b891 no spot for '+npcId);return null}
  const d={k,x:p[0],y:p[1],block:true,solid:1,npc:npcId,deco:false,sc:sc||.8};const a=b58Reach(L);L.decor.push(d);if(b58Reach(L)<a-1){L.decor.pop();return null}
  occ.add(p[0]+','+p[1]);return d}
/* litter: walk-through props, never the same picture within 2 squares */
function b891Litter(L,id,occ,list){for(const [k,tx,ty,sc] of list){if(!IMG[k])continue;const p=b891Spot(L,id,occ,tx,ty,3,6);if(!p)continue;
    if(L.decor.some(d=>d.k===k&&Math.max(Math.abs(d.x-p[0]),Math.abs(d.y-p[1]))<=2))continue;
    L.decor.push({k,x:p[0],y:p[1],block:false,walk:true,deco:true,sc:sc||.7});occ.add(p[0]+','+p[1])}}
/* duplicates: the same picture twice in one cell goes; crates within 2 squares of each other become barrels, hay, sacks */
function b891Dedupe(L){const seen=new Set();L.decor=L.decor.filter(d=>{const key=d.k+'@'+d.x+','+d.y;if(seen.has(key)&&!d.npc)return false;seen.add(key);return true})}
function b891Crates(L){const alts=['barrel','hay','kh_oqstuff_9','kh_oqstuff_2'].filter(k=>IMG[k]);if(!alts.length)return;let n=0;
  const keep=[];for(const d of L.decor){if(d.k!=='crate'||d.npc||d.hidden)continue;
    if(keep.some(c=>Math.max(Math.abs(c.x-d.x),Math.abs(c.y-d.y))<=2)){const near=L.decor.filter(c=>c!==d&&Math.max(Math.abs(c.x-d.x),Math.abs(c.y-d.y))<=2).map(c=>c.k);d.k=alts.find(a=>!near.includes(a))||alts[n%alts.length];n++}else keep.push(d)}}
/* hostile creatures out of tight spots (no free 2x2 square) and away from the living */
function b891Foes(L,id,living,R){
  const blk=b891Blk(L),W=L.rows[0].length,H=L.rows.length;
  for(const e of L.enemies){const near=living.some(([x,y,r])=>Math.hypot(e.x-x,e.y-y)<(r||R));if(!near&&b891Free2(L,id,e.x,e.y,blk))continue;
    let best=null;for(let q=1;q<=8&&!best;q++)for(let dy=-q;dy<=q&&!best;dy++)for(let dx=-q;dx<=q;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==q)continue;const x=e.x+dx,y=e.y+dy;
      if(x<3||y<3||x>=W-3||y>=H-3)continue;if(!b891Open(L,id,x,y,blk)||!b891Free2(L,id,x,y,blk))continue;if(living.some(([a,b,r])=>Math.hypot(x-a,y-b)<(r||R)))continue;
      if(L.decor.some(d=>d.x===x&&d.y===y)||L.enemies.some(o=>o!==e&&Math.abs(o.x-x)<=1&&Math.abs(o.y-y)<=1))continue;if(L._bgrPath&&L._bgrPath.has(x+','+y))continue;best=[x,y];break}   // not on a road or path, not beside another creature
    if(best){e.x=best[0];e.y=best[1]}}}
/* ----- notes and signs ----- */
const B891_NOTES={
 b891_gatenote:['The notice on the gate post',"A board nailed to the gate post, in a careful hand: THE GATE IS OPEN TO PILGRIMS AND TO NO ONE ELSE. THE BELL IS NOT TO BE ANSWERED. Under it, in a hurried hand: Elias has kept the gate. Tell the Prior that Elias kept the gate."],
 b891_pegs:['A row of habit pegs','Eleven pegs along the cloister wall, each with a name burned into the wood above it. Seven still hold a grey habit. Four are empty, and the four dust rings on the stone below them are not the same size.'],
 b891_herbs:['The herb slate','A slate stuck in the herb bed, lettered in chalk: ROSEMARY. FEVERFEW. COMFREY. THE GREY ONE IS NOT FOR THE SICK. Whoever wrote the last line pressed so hard that the chalk broke.'],
 b891_mould:['The cracked bell mould',"A bell mould of baked clay, split open from the lip to the crown. Scratched on the inside in a thin hand: IT RINGS WRONG. WE POURED IT ANYWAY. There is a handprint in the clay, much smaller than a man's."],
 b891_bundle:["A pilgrim's bundle",'A bundle tied in a shirt and left under the cart. A heel of black bread, a wax candle, a tin badge of a bell. The bread is older than the road. The candle has been lit once and put out with two fingers.'],
 b891_candlebook:['A prayer book on the flags','A small prayer book lies face down in the grass. The ribbon marks the Office for the Dying. Somebody has underlined one line and written beside it: sung nine times, it was never answered.'],
 b891_millsign:['The mill board','A board by the mill door: FLOUR, A SACK A WEEK. GRIST TAKEN IN ON TUESDAYS. NO CROWS. The last two words have been cut into the wood with a knife, and the cut is old and the wood has grown a lip around it.'],
 b891_tally:['The tally on the stone','The lowest of the standing stones is scratched in rows of five, hundreds of rows. After the last row there is a small bird, drawn quite carefully, and beside it two letters: W and A.'],
 b891_wheel:['The stopped wheel rope',"A rope runs from the hub of the dead wheel to an iron stake. Tied to the rope, at the height of a child's hand, is a small leather shoe. It has been tied with a good knot, by someone who meant it to stay."],
 b891_scarepole:['The field pole','A pole with a tin plate nailed to it, and on the plate in black paint: THEY ARE NOT FOR THE CROWS. THEY ARE FOR THE FIELD. J. TOLLY. Below it somebody has added, in white: they do not know that.'],
 b891_parapet:['The bridge stone','Cut into the base of the parapet by many hands, none of them neat: THE KNIGHT ASKS FOR A KEY. THE KNIGHT HAS NEVER BEEN WRONG ABOUT A KEY. A coin has been pressed into the mortar under the words, and it is a Sale penny.'],
 b891_cairn:['The stick of days','A forked stick standing in the earth beside a cold fire. Nineteen cuts down its length, the last one not finished. A few paces off lie four bedrolls, tied up, as if someone meant to come back for them.'],
 b891_tollboard:['The toll board','A toll board at the toll yard: ALL COMERS, TWO COPPER. CARTS, SIX. THE DEAD, NOTHING. The last line has been struck through with a nail, and under it, in better ink: THE DEAD DO NOT PAY. THEY ARE NOT ASKED.'],
 b891_ravine:['The ravine rope','Posts and a rope once ran along the edge of the ravine, to keep people from the drop. The rope has been cut every few paces and each end hangs down over the edge, still knotted, as though many people went over holding it.'],
 b891_desk:['The half copied page','On the desk a page lies half copied, the red capital done and the black text stopped in the middle of a word. The ink in the pot is dry, but the pen is wet. It was not put down very long ago.'],
 b891_ropetally:['The rope tally',"Notches cut into the stone by the ropes, three columns of them, one for each rope. The Abbot's column is the longest. At the top somebody has cut a bell, and across the bell a cross."],
 b891_names:['Names on the wall','Names scratched into the plaster by the crypt stair, by candlelight, in a hurry. The first thirty are neat. The last six are not. Under them, small: we are going down to sing for them.'],
 b891_sacks:['The sack tally','Chalk marks on a beam, a stroke for each sack ground. Counted, they come to many thousand. The last line of strokes is crossed with a bar, and beside it somebody has written: ENOUGH.'],
 b891_nest:['A nest in the cap','A very large nest of black sticks, wedged between the timbers. It is lined with ribbon, thread, buttons and a gold curtain tassel. In the middle sits one small silver thimble, polished bright.'],
 b891_table:['The supper table','A table laid for three. Three bowls, three spoons, a loaf cut into three. A fourth chair has been pulled out and turned to the wall. Nothing has been eaten, and nothing has been touched by mice.'],
 b891_roster:['The guard roster','A roster nailed to the beam. Four names for each night, in a neat hand, and a column of ticks beside each name. Every tick stops on the same day. Under the last tick the Captain has written: HOLD THE GATE. SALE WILL ANSWER.'],
 b891_letter:['A letter on the sill','A letter, unfinished, held down with a stone: Dear Mother. They tell us the road is closed and that help is coming. We can see the road. Nothing has come along it for a long time, and the lamp in the window of the chapel is still lit.']};
for(const k in B891_NOTES){const [n,t]=B891_NOTES[k];khNpc(k,n,'gy_book',()=>say(t,[BYE]))}
/* ----- Hollowbell Abbey (outside) ----- */
b891Wrap(9680,(L,id)=>{
  b891Dedupe(L);const occ=b58Occ(L);
  b891Note(L,id,occ,'greensign','b891_gatenote',38,33,4,.8);
  b891Note(L,id,occ,'gy_book','b891_pegs',36,25,5,.7);
  b891Note(L,id,occ,'greensign','b891_herbs',42,29,4,.7);
  b891Note(L,id,occ,'gy_book','b891_mould',64,46,5,.8);
  b891Note(L,id,occ,'kh_oqstuff_6','b891_bundle',44,44,5,.8);
  b891Note(L,id,occ,'gy_book','b891_candlebook',40,22,5,.6);
  // a trail of candle stubs and dropped things from the church door to the gate lodge
  b891Litter(L,id,occ,[['gy_candles',37,16,.5],['gy_bones',34,22,.6],['kh_oqstuff_4',32,28,.6],['gy_candles',29,34,.5],['gy_bones',25,40,.6],['kh_oqstuff_5',22,43,.6],
    ['kh_oqstuff_2',54,26,.6],['gy_bones',58,24,.6],['gy_candles',60,38,.5],['kh_oqstuff_9',50,47,.6],['gy_bones',72,34,.6],['kh_oqstuff_8',20,32,.6]]);
  for(const [x,y] of [[37,16],[25,40],[60,38]])b58Light(L,x,y,[1.2,.95,.6]);
  b891Foes(L,id,[[19,46],[76,38,9.6]],7)});
/* ----- the Rookery Mill (outside) ----- */
b891Wrap(9690,(L,id)=>{
  b891Dedupe(L);const occ=b58Occ(L);
  b891Note(L,id,occ,'greensign','b891_millsign',44,24,4,.8);
  b891Note(L,id,occ,IMG.bl_stone1?'bl_stone1':'gy_book','b891_tally',57,28,4,.7);   // a scratched stone, not a book
  b891Note(L,id,occ,'gy_book','b891_wheel',29,31,4,.7);
  b891Note(L,id,occ,'greensign','b891_scarepole',56,46,5,.8);
  b891Litter(L,id,occ,[['kh_oqstuff_9',46,26,.6],['hay',44,30,.7],['kh_oqstuff_9',41,34,.6],['gy_bones',50,34,.6],['barrel',38,40,.7],['gy_candles',56,32,.5],
    ['gy_bones',62,40,.6],['kh_oqstuff_2',33,38,.6],['hay',60,52,.7],['kh_oqstuff_5',46,56,.6],['gy_bones',30,46,.6],['kh_oqstuff_8',12,30,.6]]);
  b58Light(L,56,32,[1.2,.95,.6]);b58Light(L,44,26,[1.4,1.05,.55]);
  b891Foes(L,id,[[36,33],[61,33],[75,35,9.6]],7)});
/* ----- the Pale Bridge (outside) ----- */
b891Wrap(9700,(L,id)=>{
  b891Dedupe(L);const occ=b58Occ(L);
  b891Note(L,id,occ,'greensign','b891_parapet',60,31,4,.8);
  b891Note(L,id,occ,'gy_book','b891_cairn',21,38,5,.6);
  b891Note(L,id,occ,'greensign','b891_tollboard',3,38,3,.7);
  b891Note(L,id,occ,'gy_book','b891_ravine',43,29,3,.6);
  b891Litter(L,id,occ,[['gy_bones',48,31,.6],['kh_oqstuff_9',33,30,.6],['gy_bones',38,40,.6],['kh_oqstuff_8',27,34,.6],['gy_candles',16,30,.5],['kh_oqstuff_2',30,45,.6],
    ['gy_bones',68,38,.6],['kh_oqstuff_5',66,32,.6],['kh_oqstuff_6',70,40,.6],['gy_bones',23,42,.6]]);
  for(const [x,y] of [[16,30],[30,45]])b58Light(L,x,y,[.9,1.0,1.3]);
  b891Foes(L,id,[[60,33],[15,37],[4,32],[4,34],[75,35,9.6]],8)});
/* ----- the rooms ----- */
const B891_ROOMS={9682:['b891_desk',6,4],9684:['b891_ropetally',3,2],9686:['b891_names',9,3],9691:['b891_sacks',5,4],9693:['b891_nest',5,5],9694:['b891_table',6,3],9701:['b891_roster',4,3],9702:['b891_letter',6,3]};
for(const id of [9681,9682,9683,9684,9685,9686,9691,9692,9693,9694,9701,9702])b891Wrap(id,(L,rid)=>{
  b891Dedupe(L);b891Crates(L);const occ=b58Occ(L);
  const r=B891_ROOMS[rid];if(r)b891Note(L,rid,occ,'gy_book',r[0],r[1],r[2],4,.6,true);
  if(rid===9683){let n=0;for(const d of L.decor)if(d.k==='gy_skel'&&d.npc==='blh_seated'){n++;if(n%2===0&&IMG.bl_g_monk){d.k=n%4===0?'bl_g_monk2':'bl_g_monk';d.sc=.85}}}
  b891Foes(L,rid,[],0)});
/* ----- the air: colder at the bridge, browner at the mill, whiter at the abbey ----- */
{const _w=weatherNow;weatherNow=function(){const r=_w.apply(this,arguments);
  try{if(r&&r.id==='fog'){
    if(LEVEL===9700)return Object.assign({},r,{fog:.021,haze:.4,col:[116,136,150],text:'A cold mist lies in the ravine and creeps up to the bridge. The lamps on the far side of it are the only warm thing in the world.'});
    if(LEVEL===9690)return Object.assign({},r,{haze:.34,col:[132,138,116],text:'A brown haze of old flour and smoke hangs over the stubble. Rooks sit on every post and turn their heads together.'});
    if(LEVEL===9680)return Object.assign({},r,{fog:.019,col:[140,146,140],text:'A pale mist lies between the walls of the abbey, and it smells of wax and cold stone. Far off, many voices are holding one note.'})}}catch(e){}
  return r}}
/* ----- the sound: a slow chant at the abbey, rooks and a creaking sail at the mill, wind in the ravine and a chain at the bridge ----- */
const B891S={chant:0,creak:0,caw:0,wind:0,chain:0,hum:0};
function b891Wind(v){tone(300,420,3.6,'sine',.018*v,0);tone(310,200,3.2,'sine',.014*v,1.6);tone(612,700,2.6,'triangle',.006*v,.4)}
function b891Chain(v){for(let i=0;i<3;i++){const d=i*.17+Math.random()*.05;tone(2100,1800,.14,'triangle',.016*v,d);tone(3300,3000,.07,'sine',.008*v,d)}}
function b891Tick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb)return;const now=AC.currentTime,L=LEVEL;
  if(L===9680||(L>=9681&&L<=9686)){
    if(now>B891S.chant){B891S.chant=now+(L===9680?36:24)+Math.random()*30;if(typeof blcSing==='function')blcSing(L===9680?.3:.45)}
    if(L===9684||L===9685){if(now>B891S.hum){B891S.hum=now+17+Math.random()*20;tone(98,94,3.5,'sine',.035,0);tone(196,190,2.5,'sine',.015,0)}}}
  else if(L===9690||(L>=9691&&L<=9694)){
    if(now>B891S.caw){B891S.caw=now+9+Math.random()*16;if(typeof wwsCrow==='function'){const n=1+((Math.random()*3)|0);for(let i=0;i<n;i++)setTimeout(()=>{try{wwsCrow(.4+Math.random()*.4)}catch(e){}},i*(250+Math.random()*350))}}
    if(now>B891S.creak){B891S.creak=now+11+Math.random()*16;if(typeof wwsCreak==='function'){wwsCreak(L===9690?.7:.5);if(L!==9690)setTimeout(()=>{try{wwsCreak(.4)}catch(e){}},900)}}}
  else if(L===9700||L===9701||L===9702){
    if(now>B891S.wind){B891S.wind=now+14+Math.random()*18;b891Wind(L===9700?1:.5)}
    if(L===9700&&now>B891S.chain){B891S.chain=now+23+Math.random()*30;b891Chain(.8)}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{b891Tick()}catch(e){console.error('b891',e)}}}
/* ==========================================================================
   ROUND 2 (29 Oct 2026, prefix b2r): the critic's ranked fixes for Bone Orchard, Lanternrest, Hollowbell, Rookery Mill and the Pale Bridge.
   - Lanternrest keeps a thin warm haze in the rain: blight_sky.js adds fog, haze and a colour shift per unit of rain on top of whatever weatherNow returned, so this wrapper takes (part of) that back first.
   - A level fix runs once after the level exists (b2rWrap, its own flag: b58Wrap and b891Wrap use another one).
   ========================================================================== */
{const _w=weatherNow;weatherNow=function(){const r=_w.apply(this,arguments);
  try{if(r&&LEVEL===9660&&typeof BKS!=='undefined'&&BKS.rain>0&&r.id==='fog'){const q=BKS.rain,rd=BKS.red||0;
    return Object.assign({},r,{fog:Math.max(.0006,(r.fog||.0055)-.0135*q),haze:Math.max(.02,(r.haze||.13)-.14*q-.04*rd),mix:Math.max(.1,(r.mix||.2)-.08*q),
      col:r.col?[Math.min(255,(r.col[0]-rd*26)/(1-.12*q)),Math.min(255,(r.col[1]+rd*20)/(1-.14*q)),Math.min(255,(r.col[2]+rd*22)/(1-.1*q))]:r.col})}}catch(e){}
  return r}}
function b2rWrap(id,fn){
  const o=KH_LAZY[id];if(!o)return;
  KH_LAZY[id]=function(){const r=o.apply(this,arguments);const L=LEVELS[id];
    if(L&&!L._b2r){L._b2r=1;try{b58Art();fn(L,id)}catch(e){console.error('b2r '+id,e)}}return r}}
/* ----- Lanternrest: the face tree was far too large for its place ----- */
b2rWrap(9660,L=>{
  for(const d of L.decor){if(d.k==='ww_oakface'||d.k==='b58_ww_oakface')d.sc=Math.min(d.sc||1,.7)}});
