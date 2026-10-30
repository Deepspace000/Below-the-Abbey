/* ps_wallart.js: the castle's picture hanger. Runs once on every castle level after it is built (after ps_tidy.js).
   Every wall picture (a decor with pic:1 and a wall direction wd: portraits, banners, windows, mirrors, hangings) must
   1. hang on a real wall: the square behind it (in the direction of wd) must be solid wall, or the picture goes;
   2. fit inside its own square of wall: a picture wider than a square is scaled down so it never sticks out past the side of the wall (into a doorway, a corner or the next room);
   3. not overlap another picture: two pictures on the same wall square and the same side keep the first (webs and vine curtains may share with a picture);
   4. not hang over a door or a stair: nothing hangs on a wall square that touches a door tile (those tiles are not plain open floor and not plain wall).
   The report is in LEVELS[id]._wallart. */
const PSW_MAXW=.92;
const PSW_SHARE=/web|vine|ivy|moss|crack|stain|dust|corbel|gargoyle|bracket|sconce|lantern|torch/i;
function pswaHang(id,L){
  if(!L||L._hung||!L.rows)return L;L._hung=1;
  const W=L.rows[0].length,H=L.rows.length,TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null;
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.';
  const ch=(x,y)=>(x>=0&&y>=0&&x<W&&y<H)?L.rows[y][x]:null;
  const isDoor=(x,y)=>{const c=ch(x,y);if(c===null||c==='.')return false;try{const g=L.chars?L.chars[c]:c.charCodeAt(0);return typeof KH_DOOR!=='undefined'&&g!==undefined&&!!KH_DOOR[g]}catch(e){return false}};
  const rep={noWall:0,narrowed:0,dupes:0,door:0};
  const seen=new Map(),out=[];
  for(const d of L.decor||[]){
    if(!d.pic||!d.wd||d.npc){out.push(d);continue}
    const wx=Math.round(d.x),wy=Math.round(d.y),bx=wx+d.wd[0],by=wy+d.wd[1];
    // 1. a real wall behind it
    if(open(bx,by)||ch(bx,by)===null){rep.noWall++;continue}
    // 4. never over a door or a stair: no door tile behind it
    if(isDoor(bx,by)){rep.door++;continue}
    // 3. no two pictures on one wall square (the first one stays)
    const key=wx+','+wy+','+d.wd[0]+','+d.wd[1],prev=seen.get(key);
    if(prev&&!(PSW_SHARE.test(String(d.k))||PSW_SHARE.test(String(prev.k)))){rep.dupes++;continue}
    if(!prev)seen.set(key,d);
    // 2. no wider than the wall square
    const im=IMG[d.k],hh=NPC_H[d.k];
    if(im&&im.width&&im.height&&hh){const sc=d.sc||1,w=hh*sc*im.width/im.height;if(w>PSW_MAXW&&/portrait|(^|_)pt\d*|pshpt|painting|picture|mirror|banner|tapestry|alcove|frame|plaque|shield|crest/i.test(String(d.k))&&!/window|arch|door|gate/i.test(String(d.k))){d.sc=+(sc*(PSW_MAXW/w)).toFixed(3);rep.narrowed++}}
    out.push(d)}
  // webs belong in a corner of a wall: a free web is turned to face the nearest wall, or goes
  rep.webs=0;rep.webGone=0;rep.alcove=0;rep.overlapFix=0;
  const out2=[];
  for(const d of out){
    const k=String(d.k);
    if(/web/i.test(k)&&!(d.pic&&d.wd)&&!d.npc){
      const x=Math.round(d.x),y=Math.round(d.y);let wd=null;
      for(const [a,b] of [[0,-1],[0,1],[-1,0],[1,0]])if(open(x,y)&&!open(x+a,y+b)&&ch(x+a,y+b)!==null&&!isDoor(x+a,y+b)){wd=[a,b];break}
      if(wd){d.pic=1;d.wd=wd;d.block=false;if(d.bob===undefined)d.bob=.9;rep.webs++}else{rep.webGone++;continue}}
    // a statue alcove is a niche in a wall, never a tall slab standing in a room: one that stands free is set into the nearest real wall square beside it (not a door), or goes
    if(/alcove/i.test(k)&&!d.pic&&!d.npc){const x=Math.round(d.x),y=Math.round(d.y);let wd=null;
      for(const [a,b] of [[0,-1],[0,1],[-1,0],[1,0]])if(open(x,y)&&!open(x+a,y+b)&&ch(x+a,y+b)!==null&&!isDoor(x+a,y+b)){wd=[a,b];break}
      if(!wd){rep.alcove++;continue}
      // not in a one-wide passage, where it would be a shelf in the walkway
      const side=(open(x+wd[1],y+wd[0])?1:0)+(open(x-wd[1],y-wd[0])?1:0);if(side<2){rep.alcove++;continue}
      d.pic=1;d.wd=wd;d.block=false;d.sc=.52;rep.alcoveSet=(rep.alcoveSet||0)+1}
    out2.push(d)}
  // a portrait and a mirror (or any two frames) on one wall square: the second goes
  const frameAt=new Map(),out3=[];
  for(const d of out2){
    if(d.pic&&d.wd&&/portrait|mirror|frame|(^|_)pt\d|pshpt|painting|picture/i.test(String(d.k))){
      const key=Math.round(d.x)+','+Math.round(d.y)+','+d.wd[0]+','+d.wd[1];
      if(frameAt.has(key)){rep.overlapFix++;continue}frameAt.set(key,d)}
    out3.push(d)}
  // the Pale Approach: nothing painted on the far walls in line with the Pilgrim Steps (x 30 to 34): the engine draws a far wall picture through the dark stair risers, so a statue seems to float behind the steps
  if(id===9720){const keep=out3.filter(d=>!(d.pic&&d.wd&&/alcove|st_|statue|saint|weep|mourn/i.test(String(d.k))&&Math.abs(Math.round(d.x)-32)<=2&&Math.round(d.y)<46));rep.stairLine=out3.length-keep.length;L.decor=keep}else L.decor=out3;
  L._wallart=rep;return L}
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._pswa)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{pswaHang(id,L)}catch(e){console.error('ps wallart',id,e)}return LEVELS[id]||lv};w._pswa=1;KH_LAZY[id]=w}}
