/* ==========================================================================
   blight_tidy.js: the Blighted Lands' housekeeper (prefix bltd). The castle standard of ps_wallart.js, ps_tidy.js and ps_curate.js, for the ten places of the
   Blighted Road and their rooms (ids 9600 to 9709). Runs once on every level of a place, after its builder and every polish and growths pass (it is the last
   wrap of KH_LAZY, so it must stay last in the ORDER of tools/inject.py). Only moves, re-hangs or removes; it never adds anything.
   1. webs belong on a wall: a free-standing web is hung on the nearest wall of its square (pic with wd), or goes when there is no wall beside it;
   2. wall pictures hang on a real wall: a picture whose wall square is open is turned to a wall side of its square, or goes;
   3. pieces that hang on a wall (stained glass, tapestries, notice boards, shields) but were set free-standing, lifted, or inside the wall row, are hung flush on the wall;
   4. one picture per wall face: a second picture on the same face goes (webs and moss may share); the low round window under a lit casement goes;
   5. the same piece twice on one square: the copy goes;
   6. a loose arch or gate standing on open ground (not in a gap between walls) goes;
   7. a free-standing piece inside a wall square: a hidden blocker goes, anything else moves to the nearest open square or goes;
   8. a small loose thing (a book, a candle stub, bones) lifted with nothing under it is set on the floor;
   9. out of doors, creatures are not stacked on the main road: of two creatures on the road within 3 squares of each other, the second moves off the road.
   The report is in LEVELS[id]._bltd.
   ========================================================================== */
const BLTD={done:new Set(),rep:{}};
const bltdIs=id=>id>=9600&&id<=9709;
const BLTD_SHARE=/web|vine|ivy|moss|crack|stain/i;
const BLTD_WALLKEY=/^(wl2_church_2|wl2_hall_1|wl2_library_5|wl2_armour_1)$/;
const BLTD_ARCH=/(^|_)(arch|gate|door|portcullis)(_|\d|$)/i;
const BLTD_SMALL=/^(gy_book|gy_candles|gy_bones|ww_crumbs|ww_boot|kh_oqstuff_\d)$/;
const BLTD_TABLE=/table|desk|lectern|altar|sarc|coffin|shelf|counter|dresser|chest|barrel|crate|stall|tomb|bench|pew|bell/i;
function bltdTidy(id,L){
  if(!L||!L.rows||!L.decor||L._bltd)return L;
  const W=L.rows[0].length,H=L.rows.length,inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const open=(x,y)=>inb(x,y)&&L.rows[y][x]==='.';
  const isDoor=(x,y)=>{if(!inb(x,y))return false;const c=L.rows[y][x];if(c==='.')return false;try{const g=L.chars?L.chars[c]:c.charCodeAt(0);return g!==undefined&&!!KH_DOOR[g]}catch(e){return false}};
  const wall=(x,y)=>inb(x,y)&&!open(x,y)&&!isDoor(x,y);
  const SIDES=[[0,-1],[-1,0],[1,0],[0,1]];
  const wallSide=(x,y,pref)=>{if(pref&&wall(x+pref[0],y+pref[1]))return pref;for(const s of SIDES)if(wall(x+s[0],y+s[1]))return s;return null};
  const rep={webs:0,webGone:0,rehung:0,picGone:0,hung:0,overlap:0,dup:0,arch:0,inwall:0,inwallMoved:0,grounded:0,foeMoved:0};
  const gone=new Set();
  let CE=1.22;try{if(typeof ceilFor==='function')CE=ceilFor(id,L)||CE}catch(e){}
  const hOf=d=>(NPC_H[d.k]||1)*(d.sc||1),fit=(d,b)=>Math.max(.05,Math.min(b,CE-.04-hOf(d)));   // the top of a wall picture stays under the ceiling
  // 1 to 3: webs, wall pictures, wall pieces
  for(const d of L.decor){
    const k=String(d.k),x=Math.round(d.x),y=Math.round(d.y);
    if(/web/i.test(k)&&!d.npc&&!(d.pic&&d.wd)){
      if(!open(x,y)){gone.add(d);rep.webGone++;continue}
      const s=wallSide(x,y,[0,-1]);if(!s){gone.add(d);rep.webGone++;continue}
      d.pic=1;d.wd=[s[0],s[1]];d.block=false;d.walk=true;d.deco=true;delete d.ox;delete d.oy;d.bob=fit(d,L.outdoor?.9:.6);rep.webs++;continue}
    if(d.pic&&d.wd&&!d.npc){
      if(!open(x,y)){gone.add(d);rep.picGone++;continue}
      if(!wall(x+d.wd[0],y+d.wd[1])){const s=wallSide(x,y);if(s){d.wd=[s[0],s[1]];rep.rehung++}else{gone.add(d);rep.picGone++}}
      continue}
    if(BLTD_WALLKEY.test(k)&&!d.pic){
      let cx=x,cy=y;
      if(!open(x,y)){let c=null;for(const s of [[0,1],[1,0],[-1,0],[0,-1]])if(open(x+s[0],y+s[1])){c=[x+s[0],y+s[1]];break}if(!c){gone.add(d);rep.picGone++;continue}cx=c[0];cy=c[1]}
      const s=wallSide(cx,cy,[0,-1]);if(!s){gone.add(d);rep.picGone++;continue}
      d.x=cx;d.y=cy;d.pic=1;d.wd=[s[0],s[1]];d.block=false;d.walk=true;if(!d.npc)d.deco=true;delete d.ox;delete d.oy;
      // the centre of the piece stays where it was drawn, about level with a head or a little higher
      if(hOf(d)>CE-.1)d.sc=+((d.sc||1)*(CE-.1)/hOf(d)).toFixed(3);d.bob=fit(d,d.bob>.05?d.bob:.15);rep.hung++}}
  // 4. one picture per wall face (the first stays); a low round window goes when the face has another window
  {const face=new Map();
   const pics=L.decor.filter(d=>!gone.has(d)&&d.pic&&d.wd);
   for(const d of pics){if(String(d.k)!=='bl_win_c')continue;const key=Math.round(d.x)+','+Math.round(d.y)+','+d.wd;if(pics.some(o=>o!==d&&/^bl_win_/.test(o.k)&&Math.round(o.x)+','+Math.round(o.y)+','+o.wd===key)){gone.add(d);rep.overlap++}}
   for(const d of pics){if(gone.has(d)||d.npc||BLTD_SHARE.test(String(d.k)))continue;const key=Math.round(d.x)+','+Math.round(d.y)+','+d.wd;if(face.has(key)){gone.add(d);rep.overlap++}else face.set(key,d)}}
  // 5. the same piece twice on one square
  {const seen=new Set();for(const d of L.decor){if(gone.has(d)||d.npc)continue;const key=d.k+'|'+Math.round(d.x)+','+Math.round(d.y)+'|'+(d.wd||'');if(seen.has(key)){gone.add(d);rep.dup++}else seen.add(key)}}
  // 5b. a wall picture is drawn at the height of its key (NPC_H; the engine ignores sc on a wall picture): a picture asked for at another size, or taller than the
  //     room, or wider than its square, gets a sized copy of its key (the same painting, its own height), and its top stays under the ceiling
  for(const d of L.decor){if(gone.has(d)||!d.pic||!d.wd||d.npc)continue;const k=String(d.k),im=IMG[k];if(!im||!im.width||!im.height)continue;
    const asp=im.width/im.height,h0=NPC_H[k]||.6,share=BLTD_SHARE.test(k);
    const want=+Math.min(h0*(d.sc||1),CE-.1,(share?1.9:1.15)/asp).toFixed(3);
    if(Math.abs(want-h0)>.01){const a=k+'_bltd'+Math.round(want*100);if(!IMG[a]){IMG[a]=im;NPC_H[a]=want}d.k=a;d.sc=1;rep.sized=(rep.sized||0)+1}
    const top=CE-.04-want;if(!(d.bob>=0))d.bob=.45;if(d.bob>top)d.bob=Math.max(0,+top.toFixed(3))}
  // 6. loose arches and gates
  for(const d of L.decor){if(gone.has(d)||d.npc||d.pic||!BLTD_ARCH.test(String(d.k)))continue;const x=Math.round(d.x),y=Math.round(d.y);
    if(open(x,y)&&!((wall(x-1,y)&&wall(x+1,y))||(wall(x,y-1)&&wall(x,y+1)))){gone.add(d);rep.arch++}}
  // 6b. nothing solid in a straight passage one square wide (walls, water or the boundary on both sides)
  {const TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null,shut=(x,y)=>!open(x,y)||!!(TB&&TB[y*W+x]);
   for(const d of L.decor){if(gone.has(d)||d.npc||d.pic||!d.block||d.hidden)continue;const x=Math.round(d.x),y=Math.round(d.y);if(!open(x,y))continue;
     if((!shut(x-1,y)&&!shut(x+1,y)&&shut(x,y-1)&&shut(x,y+1))||(!shut(x,y-1)&&!shut(x,y+1)&&shut(x-1,y)&&shut(x+1,y))){gone.add(d);rep.corridor=(rep.corridor||0)+1}}}
  // 7. free-standing pieces inside a wall square
  {const taken=new Set();for(const d of L.decor)if(!gone.has(d)&&!d.pic)taken.add(Math.round(d.x)+','+Math.round(d.y));for(const e of L.enemies||[])taken.add(Math.round(e.x)+','+Math.round(e.y));
   const st=L.start||{};
   for(const d of L.decor){if(gone.has(d)||d.pic)continue;const x=Math.round(d.x),y=Math.round(d.y);if(open(x,y)||!inb(x,y))continue;
     if(d.hidden&&!d.npc){gone.add(d);rep.inwall++;continue}
     let best=null;for(const s of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=x+s[0],ny=y+s[1];if(open(nx,ny)&&!taken.has(nx+','+ny)&&!(nx===st.x&&ny===st.y)){best=[nx,ny];break}}
     if(best){d.x=best[0];d.y=best[1];taken.add(best[0]+','+best[1]);rep.inwallMoved++}else if(!d.npc){gone.add(d);rep.inwall++}}}
  // 8. small things lifted over nothing are set on the floor
  {const at=new Map();for(const d of L.decor){if(gone.has(d)||d.pic)continue;const key=Math.round(d.x)+','+Math.round(d.y);(at.get(key)||at.set(key,[]).get(key)).push(d)}
   for(const d of L.decor){if(gone.has(d)||d.pic||!(d.bob>0)||!BLTD_SMALL.test(String(d.k)))continue;const key=Math.round(d.x)+','+Math.round(d.y);
     if((at.get(key)||[]).some(o=>o!==d&&BLTD_TABLE.test(String(o.lk||o.k))))continue;d.bob=0;rep.grounded++}}
  if(gone.size)L.decor=L.decor.filter(d=>!gone.has(d));
  // 9. creatures on the main road, out of doors
  if(L.outdoor&&L._bgrPath&&(L.enemies||[]).length){
    const P=L._bgrPath,onP=(x,y)=>P.has(x+','+y);
    const occ=new Set();for(const d of L.decor)if(d.block||d.solid)occ.add(Math.round(d.x)+','+Math.round(d.y));for(const e of L.enemies)occ.add(Math.round(e.x)+','+Math.round(e.y));
    const T=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null;
    const freeAt=(x,y)=>open(x,y)&&!onP(x,y)&&!occ.has(x+','+y)&&!(T&&T[y*W+x]);
    const kept=[];
    for(const e of L.enemies){const ex=Math.round(e.x),ey=Math.round(e.y),D=ENEMY_DEF[e.t]||{};
      if(!onP(ex,ey)||D.boss||D.still||e.boss){if(onP(ex,ey))kept.push(e);continue}
      if(!kept.some(o=>Math.max(Math.abs(Math.round(o.x)-ex),Math.abs(Math.round(o.y)-ey))<=3)){kept.push(e);continue}
      let best=null;for(let r=1;r<=5&&!best;r++)for(let b=-r;b<=r&&!best;b++)for(let a=-r;a<=r;a++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;if(freeAt(ex+a,ey+b)){best=[ex+a,ey+b];break}}
      if(best){occ.delete(ex+','+ey);e.x=best[0];e.y=best[1];occ.add(best[0]+','+best[1]);rep.foeMoved++}else kept.push(e)}}
  L._bltd=rep;BLTD.rep[id]=rep;return L}
/* every level of a place is tidied after the place (and its rooms) are built: the main level's lazy builder, and every room's */
function bltdPlace(id){const b=Math.floor(id/10)*10;for(let k=b;k<=b+9;k++){const L=LEVELS[k];if(L&&!L._bltd)try{bltdTidy(k,L)}catch(e){console.error('bltd',k,e)}}}
for(let id=9600;id<=9709;id++){const o=KH_LAZY[id];if(!o||o._bltd)continue;const w=function(){const r=o.apply(this,arguments);try{bltdPlace(id)}catch(e){console.error('bltd',id,e)}return r};w._bltd=1;KH_LAZY[id]=w}
/* a room built straight by its place's builder (not through KH_LAZY) is tidied before the party first goes in (nothing is built here: the road's own goToLevel waits for the pictures) */
{const _g=goToLevel;goToLevel=function(n){try{if(bltdIs(n)&&LEVELS[n]&&!LEVELS[n]._bltd)bltdPlace(n)}catch(e){console.error('bltd go',e)}return _g.apply(this,arguments)}}
