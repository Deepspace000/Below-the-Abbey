/* ==========================================================================
   WENLOCK: THE POLISH (prefix wlp). The town builder (wenlock_town.js) calls wlPolish(C) at the end of wlBuild() with everything it has in hand (rows, tiles, decor, sky...).
   This file runs the finishing passes one after another, each in its own file and each guarded so that one failing pass never stops the town from building:
   glass (wenlock_glass.js), names and numbers (wenlock_names.js), chapel (wenlock_chapel.js), mill (wenlock_mill.js), air (wenlock_air.js), meadows (wenlock_meadow.js).
   It also holds the small global fixes: distant roofs and the waystone in the rooms.
   ========================================================================== */
const WLP_PASSES=[
  ['glass',C=>{wlgChurch(C)}],
  ['walls',C=>{if(typeof wlwPass==='function')wlwPass(C)}],
  ['names',C=>{if(typeof wlnPass==='function')wlnPass(C)}],
  ['chapel',C=>{if(typeof wlcPass==='function')wlcPass(C)}],
  ['mill',C=>{if(typeof wlmPass==='function')wlmPass(C)}],
  ['air',C=>{if(typeof wlaPass==='function')wlaPass(C)}],
  ['meadow',C=>{if(typeof wlePass==='function')wlePass(C)}]
];
function wlPolish(C){for(const [n,f] of WLP_PASSES){try{f(C)}catch(e){console.error('wlPolish '+n,e)}}}
/* ==========================================================================
   THE TIDY PASS (the castle standard), modelled on saTidy in sale_ids.js, for the rooms of Wenlock, Old Bracken's Den, the graveyard and its crypts, tombs and mazes, and the
   Deeper Hollow, the Underlevel and the Drowned Maze. Each builder calls wlTidy(L,{id}) once on its finished level (o.only limits it to some rules, o.town for open air):
   1. a free-standing piece in a wall square steps into the room, against that wall, when the square in front is free, else it goes (hidden footprint blocks just go);
      an item lying in a wall square moves to the nearest open square; the same piece twice on one square (same offset) is kept once;
   2. a web is only ever in a real corner: it moves to the nearest open square with two walls and hangs flat on one of them under the top of the wall, or it goes;
   3. a wall picture, note or sign whose own square is solid moves to the open square in front of that wall; one whose wall side is open turns to a real wall of its square
      (or of a square within two), never onto a door or a window, and never onto a wall face that already holds a picture; the Messenger's letters likewise;
   4. a tapestry, notice board, shield board or glass panel standing free beside a wall (hanging in the air in front of it) becomes a flat picture on that wall;
   5. a person boxed in by hidden footprint blocks gets the square in front of them back; 7. a room so full that someone or a chest cannot be reached loses the
      fewest pieces of furniture in the way;
   6. a loose arch on open floor (not in a gap between two walls) goes (o.arches 'remove'), or becomes a flat blind arch on the wall it stands against.
   The pictures it hangs (marked _wlt) are drawn flush on the wall face and at their own scale (the engine sizes a wall picture by NPC_H alone, so a smaller one gets its own key).
   ========================================================================== */
function wlTidy(L,o){
  o=o||{};if(!L||!L.rows||!L.decor||(L._wlt&&!o.again))return L&&L._wlt;
  const on=r=>!o.only||o.only.includes(r);
  const D4=[[0,-1],[1,0],[0,1],[-1,0]],W=L.rows[0].length,H=L.rows.length,rep={moved:0,gone:0,dup:0,item:0,web:0,webGone:0,sign:0,signGone:0,pic:0,npc:0,arch:0,archGone:0};if(o.again)L._wltAgain=rep;else L._wlt=rep;
  const ch=L.chars||{},inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const gid=(x,y)=>{if(!inb(x,y))return -1;const c=L.rows[y][x];return ch[c]!==undefined?ch[c]:(c==='.'||c==='t')?0:c==='D'?3:c==='L'?4:c==='X'?5:c==='%'?2:c==='T'?6:c==='G'?7:c==='C'?8:(typeof WALLCH!=='undefined'&&WALLCH[c]!==undefined)?WALLCH[c]:1};
  const solidT=(x,y)=>!!(o.solid&&inb(x,y)&&o.solid(x,y));   // o.solid: squares that are open in the rows but cannot be stood on (a town's terrain blocks: water, rock); nothing is hung there, and they are no wall either
  const open=(x,y)=>gid(x,y)===0&&!solidT(x,y);
  const isDoorG=g=>g===3||g===4||g===5||g===7||g===8||(g>=15&&g<=19)||(g>=30&&g<100&&!!(L.portals&&L.portals[g-30]))||(g>=200&&g<1000)||(typeof KH_DOOR!=='undefined'&&!!KH_DOOR[g]);
  const isDoor=(x,y)=>isDoorG(gid(x,y));
  const isWall=(x,y)=>inb(x,y)&&gid(x,y)>0&&!isDoor(x,y);
  const winG=new Set();try{if(typeof WLIN_WIN!=='undefined')for(const k in WLIN_WIN)if(WLIN_WIN[k]!==null)winG.add(WLIN_WIN[k])}catch(e){}
  const isWin=(x,y)=>winG.has(gid(x,y));
  let ceil=L.ceilH||2.2;try{if(o.id!==undefined&&typeof ceilFor==='function')ceil=ceilFor(o.id,L)||ceil}catch(e){}
  const wallH=(x,y)=>{try{const t=TEX[T_TILE[gid(x,y)]];if(t&&t.wh)return Math.min(t.wh,o.town?99:ceil)}catch(e){}return ceil};
  const isWeb=d=>/(^|_)web/i.test(String(d.k))&&!d.npc;
  const wallPic=d=>!!(d.wd&&(d.pic||d.txt||d.msgr));
  const KEEP=/^[glp]?tree|tree\d|bush|grass|reed|fern|heather|juniper|bracken|shrub|plant|twig|leaf|leaves|flower|weed|tuft|pebble|petal|clover|moss|crop|corn|wheat|vine|ivy|stump|thicket|hedge|briar|bramble|cupola|chimney|finial|balcony|bunting|roof|spire|dome|gable|eave|chime|bracket|dcity/i;
  // the key a picture is hung with: the same painting with a smaller NPC_H when it is hung smaller
  const keyAt=(k,sc)=>{if(!IMG[k]||!sc||Math.abs(sc-1)<.02)return k;const key='wlt_'+k+'_'+Math.round(sc*100);if(!IMG[key]){IMG[key]=IMG[k];NPC_H[key]=(NPC_H[k]||.6)*sc}return key};
  // 0. a piece set off the middle of its square only north or south (oy without ox) keeps its offset: the engine copies oy only together with ox, so two of a pair
  //    (two candles, two lids) used to land on the same spot
  for(const d of L.decor)if(d.oy!==undefined&&d.ox===undefined)d.ox=0;
  // 1. pieces and items in wall squares, and twins
  if(on(1)){
    const solidAt=new Set();for(const d of L.decor)if(d.block&&!d.pic&&Number.isInteger(d.x)&&Number.isInteger(d.y))solidAt.add(d.x+','+d.y);
    const seen=new Set(),keep=[];
    for(const d of L.decor){
      if(!Number.isInteger(d.x)||!Number.isInteger(d.y)){keep.push(d);continue}
      const key=d.k+'|'+d.x+','+d.y+'|'+(d.pic?1:0)+'|'+(d.wd?d.wd.join(','):'')+'|'+(d.npc||'')+'|'+(d.ox||0)+','+(d.oy||0)+'|'+(d.hidden?1:0);
      if(seen.has(key)&&!d.npc){rep.dup++;continue}seen.add(key);
      if(!wallPic(d)&&!d.wd&&!d.sky&&!d.over&&!d.found&&!KEEP.test(String(d.k))&&inb(d.x,d.y)&&!open(d.x,d.y)&&!isDoor(d.x,d.y)){
        if(d.hidden||isWeb(d)){rep.gone++;continue}
        const n=D4.find(([a,b])=>open(d.x+a,d.y+b)&&!solidAt.has((d.x+a)+','+(d.y+b))&&!keep.some(e=>e.x===d.x+a&&e.y===d.y+b&&!e.pic&&!e.hidden&&e.block));
        if(n){solidAt.delete(d.x+','+d.y);d.x+=n[0];d.y+=n[1];if(d.ox!==undefined||d.oy!==undefined||o.against){d.ox=-n[0]*.3;d.oy=-n[1]*.3}if(d.block)solidAt.add(d.x+','+d.y);rep.moved++}else{rep.gone++;continue}}
      keep.push(d)}
    L.decor=keep;
    for(const it of L.items||[]){if(!Number.isInteger(it.x)||open(it.x,it.y))continue;let f=null;
      for(let r=1;r<=3&&!f;r++)for(let dy=-r;dy<=r&&!f;dy++)for(let dx=-r;dx<=r;dx++)if(open(it.x+dx,it.y+dy)&&!solidAt.has((it.x+dx)+','+(it.y+dy))){f=[it.x+dx,it.y+dy];break}
      if(f){it.x=f[0];it.y=f[1];rep.item++}}}
  // the wall faces that already hold a picture or a sign (webs, vines and the like may share)
  const SHARE=/web|vine|ivy|moss|crack|stain|dust|corbel|gargoyle|bracket|sconce|lantern|torch|lamp|candle|banner|chain|hook|bell|soot|drip|mold|mould|creeper|root|crown|icicle|shadow/i;
  const face=new Set(),fk=(x,y,w)=>x+','+y+','+w[0]+','+w[1];
  const ring=(x,y,r,fn)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const v=fn(x+dx,y+dy);if(v)return v}return null};
  // 3. wall pictures, notes, signs and letters on real walls
  if(on(3)){
    let doors=false;const backing=(x,y)=>isWall(x,y)||(doors&&isDoor(x,y));   // a notice may go on a building's door front when there is no wall near (the town's dovecote and windmill are all door)
    const fix=(d,share)=>{if(fix1(d,share))return true;if(!o.doorOk)return false;doors=true;const r=fix1(d,share);doors=false;return r};
    const fix1=(d,share)=>{const ok=(x,y,q)=>open(x,y)&&backing(x+q[0],y+q[1])&&!isWin(x+q[0],y+q[1])&&(share||!face.has(fk(x,y,q)));
      let x0=d.x,y0=d.y,w0=d.wd;
      if(!open(x0,y0)&&!isDoor(x0,y0)){const n=D4.find(([a,b])=>open(x0+a,y0+b));if(n){x0+=n[0];y0+=n[1];w0=[-n[0],-n[1]]}}   // the picture's square is solid: the open square in front of it, facing it
      if(ok(x0,y0,w0)){d.x=x0;d.y=y0;d.wd=[w0[0],w0[1]];return true}
      let best=null;for(let r=0;r<=2&&!best;r++)best=ring(x0,y0,r,(x,y)=>{const q=[w0].concat(D4.filter(q=>q[0]!==w0[0]||q[1]!==w0[1])).find(q=>ok(x,y,q));return q?[x,y,q]:null});
      if(!best)return false;d.x=best[0];d.y=best[1];d.wd=[best[2][0],best[2][1]];return true};
    const out=[];
    for(const d of L.decor){
      if(!wallPic(d)||!Number.isInteger(d.x)||!Number.isInteger(d.y)||isWeb(d)||(o.keys&&!o.keys.test(String(d.k)))){out.push(d);continue}
      const share=SHARE.test(String(d.k));const good=open(d.x,d.y)&&backing(d.x+d.wd[0],d.y+d.wd[1])&&!isWin(d.x+d.wd[0],d.y+d.wd[1])&&(share||!face.has(fk(d.x,d.y,d.wd)));
      if(good||fix(d,share)){if(!share)face.add(fk(d.x,d.y,d.wd));if(!good)rep.sign++;out.push(d)}else rep.signGone++}
    L.decor=out;
    const M=L._msgr;if(M&&M.letters)for(const l of M.letters){if(open(l.x,l.y)&&isWall(l.x+l.wd[0],l.y+l.wd[1]))continue;const d={x:l.x,y:l.y,wd:l.wd};if(fix(d,true)){l.x=d.x;l.y=d.y;l.wd=d.wd;rep.sign++}}}
  // 2. webs into corners
  if(on(2)){
    const R=o.town?1:2,out=[];let wk='gy_web';
    if(IMG.gy_web&&IMG.gy_web.width){if(!IMG.wlt_web){const im=IMG.gy_web,x0=Math.round(im.width*.2),c=document.createElement('canvas');c.width=im.width-x0;c.height=im.height;c.getContext('2d').drawImage(im,x0,0,c.width,c.height,0,0,c.width,c.height);IMG.wlt_web=c;NPC_H.wlt_web=NPC_H.gy_web||1.2}wk='wlt_web'}   // the graveyard's painted web, cropped so that the stray bone beside it is gone
    else if(IMG.web)wk='web';
    const webAt=new Set();for(const d of L.decor)if(isWeb(d)&&d.pic&&d.wd)webAt.add(fk(d.x,d.y,d.wd));
    for(const d of L.decor){
      if(!isWeb(d)||(d.pic&&d.wd&&isWall(d.x+d.wd[0],d.y+d.wd[1])&&open(d.x,d.y))){out.push(d);continue}
      if(o.noWebs){rep.webGone++;continue}
      let best=null;
      for(let r=0;r<=R&&!best;r++)best=ring(Math.round(d.x),Math.round(d.y),r,(x,y)=>{if(!open(x,y))return null;const w=D4.filter(([a,b])=>isWall(x+a,y+b)&&!isWin(x+a,y+b));
        if(w.length<2||!w.some(q=>q[0])||!w.some(q=>q[1]))return null;const f2=w.filter(q=>!webAt.has(fk(x,y,q)));if(!f2.length)return null;const pick=f2.find(q=>!face.has(fk(x,y,q)))||f2[0];return [x,y,pick]});   // one web to a corner wall
      if(!best||!IMG[wk]){rep.webGone++;continue}
      const [x,y,wd]=best,kk=keyAt(wk,Math.min(d.sc||.55,.6)),h=NPC_H[kk]||.66;delete d.sc;delete d.ox;delete d.oy;
      Object.assign(d,{k:kk,x,y,wd:[wd[0],wd[1]],pic:1,block:false,walk:true,deco:true,_wlt:1,bob:Math.max(.12,Math.min(1.75,wallH(x+wd[0],y+wd[1]))-h-.03)});delete d.solid;delete d.hidden;
      webAt.add(fk(x,y,wd));rep.web++;out.push(d)}
    L.decor=out}
  for(const d of L.decor)if(wallPic(d)&&!isWeb(d)&&!SHARE.test(String(d.k)))face.add(fk(d.x,d.y,d.wd));
  // 4. lifted wall pieces become wall pictures
  const HANGS=o.hangs||/(^|_)(tapestry|banner|portrait|painting|plaque|mirror|noticeboard)$|^wl2_(hall_1|library_5|armour_1|church_2)$/i;
  const hangOn=(d,at)=>{const top=wallH(at[0]+at[2],at[1]+at[3])-.04;let sc=d.sc||1,hh=(NPC_H[d.k]||1)*sc;const im=IMG[d.k],asp=im&&im.width?im.width/im.height:1;
    if(hh>top-.04){sc*=(top-.04)/hh;hh=(NPC_H[d.k]||1)*sc}if(hh*asp>1.15){sc*=1.15/(hh*asp);hh=(NPC_H[d.k]||1)*sc}   // never taller than the wall, never wider than its face
    d.k=keyAt(d.k,sc);delete d.sc;delete d.ox;delete d.oy;delete d.lk;d.x=at[0];d.y=at[1];d.pic=1;d.wd=[at[2],at[3]];d.block=false;d.walk=true;d.deco=true;d._wlt=1;d.bob=Math.max(0,Math.min(d.bob||0,top-hh));
    face.add(fk(d.x,d.y,d.wd))};
  const findFace=(d,dirs)=>{const ok=(x,y,a,b)=>open(x,y)&&isWall(x+a,y+b)&&!isWin(x+a,y+b)&&!face.has(fk(x,y,[a,b]));
    for(const [a,b] of dirs){if(!isWall(d.x+a,d.y+b))continue;for(const t of [0,1,-1,2,-2]){const x=d.x+(a?0:t),y=d.y+(b?0:t);if(ok(x,y,a,b))return [x,y,a,b]}}return null};
  if(on(4))for(const d of L.decor){
    if(d.pic||d.wd||d.hidden||!HANGS.test(String(d.k))||!IMG[d.k]||!Number.isInteger(d.x))continue;
    let at=findFace(d,D4);
    if(!at&&!d.npc){let best=null,bd=1e9;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!open(x,y))continue;const dd=Math.hypot(x-d.x,y-d.y);if(dd>=bd||dd>8)continue;   // standing in the middle of the room: it goes up on the nearest bare wall
        for(const [a,b] of D4)if(isWall(x+a,y+b)&&!isWin(x+a,y+b)&&!isDoor(x+a,y+b)&&!face.has(fk(x,y,[a,b]))){best=[x,y,a,b];bd=dd;break}}at=best}
    if(!at)continue;hangOn(d,at);rep.pic++}
  // 6. loose arches
  if(on(6)){const LOOSE=/(^|_)(arch|doorway)(_|\d|$)/i,out=[];
    for(const d of L.decor){
      if(!LOOSE.test(String(d.k))||d.pic||d.wd||d.npc||!Number.isInteger(d.x)||!open(d.x,d.y)){out.push(d);continue}
      const inGap=(!open(d.x+1,d.y)&&!open(d.x-1,d.y)&&open(d.x,d.y+1)&&open(d.x,d.y-1))||(!open(d.x,d.y+1)&&!open(d.x,d.y-1)&&open(d.x+1,d.y)&&open(d.x-1,d.y));
      if(inGap){out.push(d);continue}
      if(o.arches==='remove'){rep.archGone++;continue}
      const pref=D4.slice().sort((p,q)=>((q[0]*(d.ox||0)+q[1]*(d.oy||0))-(p[0]*(d.ox||0)+p[1]*(d.oy||0))));
      const at=findFace(d,pref);if(at&&IMG[d.k]){hangOn(d,at);rep.arch++;out.push(d)}else rep.archGone++}
    L.decor=out}
  // 5. people boxed in by hidden footprint blocks
  if(on(5)&&L.start){
    const reach=()=>{const bs=new Set();for(const d of L.decor)if((d.block||d.solid)&&!d.pic&&!d.npc&&Number.isInteger(d.x))bs.add(d.x+','+d.y);
      const s=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(s.has(k)||!open(nx,ny)||bs.has(k))continue;s.add(k);q.push([nx,ny])}}return s};
    let S=reach();
    for(const p of L.decor){if(!p.npc||p.pic||p.hidden||!Number.isInteger(p.x))continue;const nb=D4.map(([a,b])=>[p.x+a,p.y+b]);if(S.has(p.x+','+p.y)||nb.some(([x,y])=>S.has(x+','+y)))continue;
      for(const [x,y] of nb){const hid=L.decor.filter(e=>e.hidden&&e.block&&e.x===x&&e.y===y);if(!hid.length)continue;if(!D4.some(([a,b])=>S.has((x+a)+','+(y+b))))continue;
        L.decor=L.decor.filter(e=>!hid.includes(e));rep.npc++;S=reach();break}}}
  // 8. a hanging lamp or candle ring (the inn's chandelier picture) hangs from the ceiling: the top of its chain meets the ceiling
  if(on(8)&&!o.town)for(const d of L.decor){const pk=d.lk&&IMG[d.lk]?d.lk:d.k;if(!/^wl2_inn_4$/.test(String(pk))||d.pic)continue;const im=IMG[pk];if(!im||!im.width)continue;
    let top=0;try{const s=Math.min(1,200/im.height),w=Math.max(1,Math.round(im.width*s)),h=Math.max(1,Math.round(im.height*s)),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h);const a=x.getImageData(0,0,w,h).data;
      for(let y=0;y<h;y++){let n=0;for(let xx=0;xx<w;xx++)if(a[(y*w+xx)*4+3]>40)n++;if(n>=1){top=y/h;break}}}catch(e){}
    const hh=(NPC_H[pk]||.6)*(d.sc||1);d.bob=Math.max(0,ceil-hh*(1-top)-.005);d.hang=1;d.block=false;d.walk=true;   // the party walks under it
   rep.lamp=(rep.lamp||0)+1}
  // 7. a room so full that a person, a chest or a door cannot be reached loses the fewest pieces of furniture that stand in the way
  if(on(7)&&L.start&&W*H<=4000){
    const CONT=typeof CONTAINERS!=='undefined'?CONTAINERS:[];
    const solidL=d=>(d.block||d.solid)&&!d.pic&&!d.npc&&Number.isInteger(d.x)&&Number.isInteger(d.y);
    const keepD=d=>CONT.includes(d.k)||/chest|coffer|sarcoph|coffin/i.test(String(d.k))||d.enter||d.tele||d.opens||d.goldAmt;
    const route=()=>{const cost=new Map();for(const d of L.decor)if(solidL(d)){const k=d.x+','+d.y;cost.set(k,keepD(d)?1e9:Math.min(1e9,(cost.get(k)||0)+1))}
      const dist=new Map(),prev=new Map(),k0=L.start.x+','+L.start.y,dq=[[L.start.x,L.start.y]];dist.set(k0,0);
      while(dq.length){const [x,y]=dq.shift(),dc=dist.get(x+','+y);for(const [a,b] of D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(!open(nx,ny))continue;const c=cost.get(k)||0;if(c>=1e9)continue;const nd=dc+(c?1:0);
        if(dist.has(k)&&dist.get(k)<=nd)continue;dist.set(k,nd);prev.set(k,x+','+y);if(c)dq.push([nx,ny]);else dq.unshift([nx,ny])}}
      return {dist,prev}};
    const targets=()=>{const t=L.decor.filter(d=>Number.isInteger(d.x)&&!d.pic&&!d.hidden&&(d.npc||CONT.includes(d.k))).map(d=>[d.x,d.y]);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(isDoor(x,y))t.push([x,y]);return t};
    for(let guard=0;guard<12;guard++){const {dist,prev}=route();let best=null;
      for(const [tx,ty] of targets()){let bk=null,bd=1e9;for(const [a,b] of [[0,0]].concat(D4)){const k=(tx+a)+','+(ty+b),v=dist.get(k);if(v!==undefined&&v<bd){bd=v;bk=k}}
        if(bd>0&&bd<1e9&&(!best||bd<best.d))best={k:bk,d:bd}}
      if(!best)break;
      const cut=new Set();for(let k=best.k;k;k=prev.get(k))cut.add(k);
      const before=L.decor.length;L.decor=L.decor.filter(d=>!(solidL(d)&&!keepD(d)&&cut.has(d.x+','+d.y)));rep.cleared=(rep.cleared||0)+before-L.decor.length;if(L.decor.length===before)break}}
  return rep}
/* the pictures the tidy pass hung lie flush on the wall face (.497 of a square from the middle, as in the castle) */
{const _sl=spriteList;spriteList=function(){const out=_sl.apply(this,arguments);
  try{for(const s of out){const d=s.decor;if(!d||!d._wlt||!s.pic||!d.wd)continue;s.x=d.x+.5+d.wd[0]*.497;s.y=d.y+.5+d.wd[1]*.497}}catch(e){console.error('wlTidy sprites',e)}
  return out}}
/* a painted piece whose picture has empty rows under its feet is cut to its feet, so that it stands on the floor (the drawn height is kept) */
function wlTrimFoot(k){
  const im=IMG[k];if(!im||!im.width||im._wltf)return;
  try{const w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const d=x.getImageData(0,0,w,h).data;
    const th=Math.max(1,w*.004);let last=-1;for(let y=h-1;y>=0&&last<0;y--){let n=0;for(let xx=0;xx<w;xx++)if(d[(y*w+xx)*4+3]>40)n++;if(n>=th)last=y}
    if(last<0||h-1-last<Math.max(2,h*.01)){im._wltf=1;return}
    const c2=document.createElement('canvas');c2.width=w;c2.height=last+1;c2.getContext('2d').drawImage(im,0,0);c2._wltf=1;
    if(NPC_H[k])NPC_H[k]*=(last+1)/h;IMG[k]=c2}catch(e){im._wltf=1}}
/* distant roofs: a house roof is a separate sky picture, and it used to be dropped past seven squares while the walls under it are drawn out to about thirty-four, so every far house was a roofless slab. Roofs now reach as far as the walls do and melt away over the last six squares (s.fade), so none floats alone beyond them. */
{const _k=khSkyList;khSkyList=function(cx,cy,dX,dY,L,md){const out=_k.apply(this,arguments);if(LEVEL!==496)return out;const far=(G.day||0)>0?34:20,f2=far*far,n2=(far-6)*(far-6);
  return out.filter(s=>{if(!s.smallSky)return true;const d2=(s.x-cx)*(s.x-cx)+(s.y-cy)*(s.y-cy);if(d2>f2)return false;if(d2>n2)s.fade=clamp((far-Math.sqrt(d2))/6,0,1);return true})}}
/* the waystone: every room has one in a corner, which looked like a stray post. In a Wenlock room it is a plain wooden bench (it still wakes and still works, T to travel). */
{const _pt=placeTeleporter;placeTeleporter=function(){const r=_pt.apply(this,arguments);
  try{if(LEVEL>=WL.H0&&LEVEL<=WL.H0+99&&G.tele){const d=G.decor.find(q=>q.tele&&q.k==='teleporter');if(d){d.k='kh_ohgard1_3';d.sc=1.1;d.deco=true;NPC_H.kh_ohgard1_3=NPC_H.kh_ohgard1_3||.62}}}catch(e){console.error(e)}
  return r}}
/* ---- the rooms: touch-ups to the room data of wenlock_in.js ---- */
{const R=WLIN_ROOMS;
  // the widow's parlour: the right wall was bare
  R.home_spartan.props.push(['dresser',7,3,{h:.85}],['tapestry',7,5,{h:.8}]);
  // the smithy: the right wall was bare, and now has racks of tongs and blades
  R.forge.props.push(['hangstand',11,3,{h:1.1}],['weaponrack',11,7,{h:.95}],['shopcounter',9,7,{h:.55}]);R.forge.raw.push(['crate',11,6]);
  // the inn cellar and the old granary: a few more lights, and two hanging candle rings in the cellar
  R.cellar.amb=.46;R.cellar.lights=[[2,2],[12,2],[7,6],[3,8],[11,8],[1,5],[13,5],[7,2],[4,4],[10,4]];R.cellar.props.push(['chandelier',4,5,{free:1}],['chandelier',10,5,{free:1}]);
  R.granary.amb=.48;R.granary.lights=[[2,2],[10,2],[6,5],[2,7],[10,7],[6,2]];
}
/* the pets of the cottages: the same cat on the same cushion was in a dozen rooms; now each cottage picks its household from a longer list by its number */
for(const [id,n,face,lines,o] of [
  ['wli_home_parrot','A parrot in a cage','pet_parrot_0',["Hello. Hello. Hello. (It has said this forty times and it is still pleased.)","Pretty boy. (It is not clear who it is talking to. It is looking at the dog.)"],{sc:.9}],
  ['wli_home_dove','A pet dove','kh_anim1_5',["Coo. (She sits on the back of the chair and watches the room go by.)","Coo, coo. (She has been tame since she fell out of a nest in the spring.)"],{sc:.85}],
  ['wli_home_goat','A house goat','kh_anim1_3',["Maaa. (She is allowed in the kitchen. Nobody remembers agreeing to this.)","Maaa. (She has eaten the end of a rug and is now eating the other end, for balance.)"],{sc:.7}],
  ['wli_home_duck','A duck by the hearth','pet_duck_0',["Quack. (She has settled in front of the fire as if she paid the rent.)","Quack. (She has decided this house is hers and is walking round it to make the point.)"],{sc:.75}]]){
  khNpc(id,n,face,()=>yrLines(id,lines),o)}
{const _wb=wlinBuild;wlinBuild=function(D,name,b,C){
  if(/^home_/.test(name)&&D&&D.folk){const k=+String(b&&b.id||'').replace(/\D/g,'')||0,r=hash2(k,5,91);
    const catAlt=['wli_home_cat','wli_home_cat','wli_home_dog','wli_home_parrot','wli_home_dove','wli_home_goat','wli_home_duck','wli_home_cat'],dogAlt=['wli_home_dog','wli_home_dog','wli_home_cat','wli_home_goat','wli_home_duck','wli_home_dog'];
    if(name!=='home_cats'&&name!=='home_children'){
      D=Object.assign({},D,{folk:D.folk.map(f=>f[0]==='wli_home_cat'?[catAlt[(r*catAlt.length)|0]].concat(f.slice(1)):f[0]==='wli_home_dog'?[dogAlt[(hash2(k,6,92)*dogAlt.length)|0]].concat(f.slice(1)):f)})}}
  const out=_wb.call(this,D,name,b,C);
  // a rolled carpet or a plant in a corner, now and then
  try{if(/^home_/.test(name)){const k=+String(b&&b.id||'').replace(/\D/g,'')||0,w=D.w||9,h=D.h||7;
    const spots=[[1,h-2],[w-2,h-2],[1,3],[w-2,3]],pick=spots[(hash2(k,7,93)*spots.length)|0],r2=hash2(k,8,94);
    if(!C.has(pick[0],pick[1])){if(r2<.35)C.put('rolledcarpets',pick[0],pick[1]);else if(r2<.7&&IMG.flowerpot)C.raw('flowerpot',pick[0],pick[1],{sc:1})}}}catch(e){console.error(e)}
  return out}}
