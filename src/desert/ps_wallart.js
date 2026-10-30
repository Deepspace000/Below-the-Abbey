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
  L.decor=out;L._wallart=rep;return L}
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._pswa)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{pswaHang(id,L)}catch(e){console.error('ps wallart',id,e)}return LEVELS[id]||lv};w._pswa=1;KH_LAZY[id]=w}}
