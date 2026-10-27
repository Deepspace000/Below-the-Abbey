/* ==========================================================================
   FISHING PLACES (prefix fpl / FPL): fishing spots and little lakes in the older areas (see fishing.js for the spot API).
   Every area has a recipe, fplDef(levelId, c => {...}), run ONCE on the built level just before the level is loaded (loadLevel is wrapped at the bottom), so lazy levels are built first.
   The recipe gets a context c with these tools (all of them keep the walkable ground connected; the test tools/fishing_places_test.py asserts it):
     c.lake(cells, {slot})     turn the squares into water: the floor becomes water, the square is blocked (an invisible blocker in a plain level, T.block in a terrain level, and the ground dips),
                               trees, grass and other plants on it are hidden. Nothing else (people, doors, chests, signs) may stand on it, or the lake is refused and logged.
     c.ellipse(cx,cy,rx,ry,seed)   an irregular ellipse of squares.     c.clear(x0,y0,x1,y1)   hide the trees and plants in a rectangle (a glade).
     c.jetty(x,y,dx,dy,len)    planks laid from (x,y) going (dx,dy) over squares that would be water, so the party can walk out on them.
     c.bank(cells, opts)       reeds, grass, flowers and willows round a lake (never on a stand square), c.deco(k,x,y,o) one prop.
     c.stand(x,y,dx,dy,water)  a fishing spot: the party stands on (x,y) and fishes the two squares in direction (dx,dy). Refused unless (x,y) can be reached on foot and the next square is water.
     c.shore({...})            scans the shore of existing water (terrain levels, seas) and adds spots at stand squares spaced out along it.
   FPL.rep[levelId] = what was done (lakes, spots, refused things), for the test.
   ========================================================================== */
const FPL={cfg:{},rep:{},done:{}};
function fplDef(n,fn){FPL.cfg[n]=fn}
const FPL_VEG=/^(l?tree\d|[lgp]tree\d|pt_|lbush|lflora|flora\d|bush$|pgrass|pflw|hgwm_|reeds?$|greeds|pbracken|pheather|pjuniper|grocks|gboulder|rocks$|boulder$|stump|logm|pstump|wd_hill|lavender|hg_grass|dpalm|hg_reed|yar_wtree|yar_olive)/;
function fplCtx(n){
  const L=LEVELS[n],W=L.rows[0].length,H=L.rows.length,T=(typeof TERRS!=='undefined'&&TERRS[n])||null,I=(x,y)=>y*W+x;
  const c={n,L,W,H,T,I,wset:new Set(),stands:[],lakes:[],refused:[],props:0,planks:new Set()};
  if(!Array.isArray(L.fmap))L.fmap=L.fmap?String(L.fmap).match(new RegExp('.{'+W+'}','g')):null;
  c.hasFm=!!L.fmap;
  // ---- decor lookup, kept up to date as we add and hide things
  const dm=new Map();const dAdd=d=>{const k=I(Math.round(d.x),Math.round(d.y));let a=dm.get(k);if(!a)dm.set(k,a=[]);a.push(d)};
  for(const d of L.decor)if(d)dAdd(d);
  c.decAt=(x,y)=>(dm.get(I(x,y))||[]).filter(d=>!d.hidden&&!d.pfCut||d.block);
  c.isWall=(x,y)=>x<0||y<0||x>=W||y>=H||L.rows[y][x]!=='.'||!!(T&&T.block[I(x,y)]&&!c.wset.has(I(x,y)));
  c.blocked=(x,y)=>{if(x<0||y<0||x>=W||y>=H||L.rows[y][x]!=='.')return true;if(c.wset.has(I(x,y)))return true;if(T&&T.block[I(x,y)])return true;
    const a=dm.get(I(x,y));if(a)for(const d of a)if(d.block&&!d.hidden)return true;return false};
  c.walk=(x,y)=>!c.blocked(x,y);
  c.hide=d=>{c._v++;d.block=false;d.sc=.0001;d.hidden=true;d.pfCut=1;if(d.walk)d.walk=undefined};
  c.add=(d)=>{L.decor.push(d);dAdd(d);c._v++;return d};
  // ---- the floor slot of a named floor (find it, or take an unused digit, or the least used one)
  c.slot=(name,notIn,into)=>{
    if(!L.floorSet){L.floorSet=[L.floor||'grass',L.floor2||'grass','dirt','mosscobble','stainedcobble','wetcobble'].map((f,i)=>FLOORS[f]?f:(i?'dirt':'grass'));c._madeFs=1}
    const fs=L.floorSet=L.floorSet.slice();const names=Array.isArray(name)?name:[name];
    for(const nm of names){const i=fs.indexOf(nm);if(i>=0&&i<6)return String(i)}
    const nm=names[0];if(!FLOORS[nm])return null;
    const cnt=new Array(8).fill(0);if(L.fmap)for(const r of L.fmap)for(const ch of r){const v=ch.charCodeAt(0)-48;if(v>=0&&v<8)cnt[v]++}
    let best=-1;for(let i=5;i>=1;i--){if(notIn&&notIn.includes(i))continue;if(i>=fs.length&&!cnt[i]){best=i;break}}
    if(best<0)for(let i=5;i>=1;i--){if(notIn&&notIn.includes(i))continue;if(!cnt[i]&&i<fs.length){best=i;break}}
    if(best<0){let m=1e9;for(let i=5;i>=1;i--){if(notIn&&notIn.includes(i))continue;if(cnt[i]<m){m=cnt[i];best=i}}
      const old=String(best);for(let y=0;y<H;y++)if(L.fmap[y].includes(old))L.fmap[y]=L.fmap[y].split(old).join(into||'0')}  // the few squares that used it become another floor (into, or the main floor)
    while(fs.length<=best)fs.push(fs[0]);fs[best]=nm;return String(best)};
  c.setFloor=(x,y,ch)=>{const r=L.fmap[y];L.fmap[y]=r.slice(0,x)+ch+r.slice(x+1)};
  // ---- an irregular ellipse
  c.ellipse=(cx,cy,rx,ry,seed)=>{const o=[];const s=seed||7;for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++)for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++){
      const dx=(x-cx)/rx,dy=(y-cy)/ry,d=dx*dx+dy*dy,w=1+(hash2(x,y,s)-.5)*.34;if(d<=w)o.push([x,y])}return o};
  // ---- a clearing
  c.clear=(x0,y0,x1,y1,extra)=>{let bad=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){for(const d of (dm.get(I(x,y))||[])){if(d.hidden)continue;
      if((FPL_VEG.test(d.k)||(extra&&extra.test(d.k)))&&!d.npc&&!d.enter&&!d.shop&&!d.loot)c.hide(d);else if(d.block||d.npc||d.enter||d.shop||d.loot)bad.push(d.k+'@'+x+','+y)}}
    if(bad.length)c.refused.push('clear '+bad.join(' '));return !bad.length};
  // ---- the lake itself
  c.tried=[];
  const canHide=d=>!d.npc&&!d.enter&&!d.shop&&!d.loot&&!d.contents&&(FPL_VEG.test(d.k)||(d.walk&&!d.block)||d.deco);
  c.lake=(cells,o)=>{o=o||{};
    const wname=o.floor||'water',fail=m=>{(o.quiet?c.tried:c.refused).push(m);return false};
    for(const [x,y] of cells){
      if(x<2||y<2||x>=W-2||y>=H-2||L.rows[y][x]!=='.')return fail('lake wall '+x+','+y);
      for(const d of (dm.get(I(x,y))||[])){if(d.hidden)continue;if(!canHide(d))return fail('lake decor '+d.k+'@'+x+','+y)}
      for(const p of (L.portals||[]))if(p&&p.x===x&&p.y===y)return fail('lake portal '+x+','+y);
      for(const q of (L.items||[]))if(q&&q.x===x&&q.y===y)return fail('lake item '+x+','+y);
      for(const q of (L.enemies||[]))if(q&&q.x===x&&q.y===y)return fail('lake enemy '+x+','+y);
      if(L.start&&L.start.x===x&&L.start.y===y)return fail('lake start');
      if(c.planks.has(I(x,y)))return fail('lake plank')}
    {const r0=c.reachSet(),ids=cells.map(([x,y])=>I(x,y));let n0=0;for(let i=0;i<r0.length;i++)if(r0[i])n0++;
     let inLake=0;for(const i of ids)if(r0[i])inLake++;
     for(const i of ids)c.wset.add(i);const r1=c.reachSet();let n1=0;for(let i=0;i<r1.length;i++)if(r1[i])n1++;for(const i of ids)c.wset.delete(i);
     if(n1!==n0-inLake)return fail('lake would cut off ground ('+(n0-inLake-n1)+')')}
    const ch=c.slot(wname,o.notIn,o.into);if(ch===null)return fail('no floor '+wname);
    const avg=(()=>{if(!T)return 0;let s=0,k=0;for(const [x,y] of cells)for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]){const xx=x+dx,yy=y+dy;if(xx>0&&yy>0&&xx<W&&yy<H&&!T.block[I(xx,yy)]){s+=T.h[I(xx,yy)];k++}}return k?s/k:0})();
    for(const [x,y] of cells){
      for(const d of (dm.get(I(x,y))||[]))if(!d.hidden)c.hide(d);
      c.setFloor(x,y,ch);c.wset.add(I(x,y));if(L.khWalkOK){L.khWalkOK[I(x,y)]=0;if(L.khWalkQuiet)L.khWalkQuiet[I(x,y)]=0}
      if(T){T.block[I(x,y)]=1;T.h[I(x,y)]=Math.min(T.h[I(x,y)],avg-.32)}
      else c.add({k:'pstump',x,y,block:true,sc:.0001,wdh:1,hidden:false,fplWater:1})}
    if(T){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const [x,y] of cells){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
      for(let y=y0-3;y<=y1+3;y++)for(let x=x0-3;x<=x1+3;x++){const i=I(x,y);if(x<1||y<1||x>=W-1||y>=H-1||c.wset.has(i)||T.block[i])continue;T.h[i]=avg+(T.h[i]-avg)*.35}   // the banks are levelled so the lake lies in a shallow dish
      for(const [x,y] of cells){for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,i=I(xx,yy);if(!c.wset.has(i)&&xx>0&&yy>0&&xx<W&&yy<H&&!T.block[i])T.h[i]=Math.min(T.h[i],avg-.08)}}}
    c._v++;c.lakes.push(cells.length);return true};
  c.isWater=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return false;const i=I(x,y);return c.wset.has(i)||(typeof fshWaterAt==='function'&&fshWaterAt(L,n,x,y))||!!(T&&T.block[i]&&T.h[i]<-.05&&L.rows[y][x]==='.')}; // water floor, or a blocked square of a sea terrain lying below the waterline
  // ---- planks
  c.jetty=(x,y,dx,dy,len,name)=>{const ch=c.slot(name||'wood');if(ch===null)return false;const o=[];
    for(let k=0;k<len;k++){const xx=x+dx*k,yy=y+dy*k;if(c.wset.has(I(xx,yy)))return false;o.push([xx,yy])}
    for(const [xx,yy] of o){c.setFloor(xx,yy,ch);c.planks.add(I(xx,yy));for(const d of (dm.get(I(xx,yy))||[]))if(!d.hidden&&FPL_VEG.test(d.k))c.hide(d)}return o};
  // ---- props
  c.deco=(k,x,y,o)=>{if(!IMG[k]||c.blocked(x,y)&&!(o&&o.force))return false;c.props++;return c.add(Object.assign({k,x,y,block:false,walk:true,deco:true,sc:1},o||{}))};
  c.reachSet=()=>{const L2=L.start,seen=new Uint8Array(W*H),q=[];if(!L2)return seen;const s=I(L2.x,L2.y);seen[s]=1;q.push(L2.x,L2.y);
    while(q.length){const y=q.pop(),x=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const i=I(xx,yy);if(seen[i]||c.blocked(xx,yy))continue;seen[i]=1;q.push(xx,yy)}}return seen};
  c._v=0;c.reachC=()=>{if(c._rc&&c._rcv===c._v)return c._rc;c._rcv=c._v;return c._rc=c.reachSet()};
  c.before=c.reachSet();
  // ---- a fishing spot
  c.stand=(x,y,dx,dy,water)=>{
    const rf=m=>(c.quietStands?c.tried:c.refused).push(m);
    if(c.blocked(x,y)){rf('stand blocked '+x+','+y);return false}
    if(!c.reachC()[I(x,y)]){rf('stand unreachable '+x+','+y);return false}
    if(c.isWater(x,y)){rf('stand in water '+x+','+y);return false}
    let k=0;for(let j=1;j<=3;j++)if(c.isWater(x+dx*j,y+dy*j)){k=j;break}
    if(!k){rf('stand no water '+x+','+y+' '+dx+','+dy);return false}
    for(let j=1;j<k;j++)if(c.walk(x+dx*j,y+dy*j)&&!c.isWater(x+dx*j,y+dy*j)){rf('stand far from water '+x+','+y);return false}
    for(let j=1;j<=3;j++){const xx=x+dx*j,yy=y+dy*j;if(xx>=0&&yy>=0&&xx<W&&yy<H&&L.rows[yy][xx]!=='.'&&j<=k+0){rf('stand wall before water '+x+','+y);return false}}  // the game looks along the row: a wall square in the way hides the patch
    c.stands.push({x,y,dx,dy,k,water:water||null});return true};
  // ---- finding room for lakes in open country: a lake needs flat ground and nothing important near it
  const imp=[],impS=[];for(const d of L.decor)if(d&&(d.npc||d.enter||d.shop||d.loot||d.contents||d.block&&!FPL_VEG.test(d.k)))((/rock|frog|stone|boulder|stump|log/.test(d.k)&&!d.npc&&!d.enter)?impS:imp).push([d.x,d.y]);
  for(const p of (L.portals||[]))if(p)imp.push([p.x,p.y]);const impM=[];for(const q of (L.items||[]))if(q)impS.push([q.x,q.y]);for(const q of (L.enemies||[]))if(q)impM.push([q.x,q.y]);
  c.roomFor=(cells,margin,tol,pathDigit)=>{
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const [x,y] of cells){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
    for(const [x,y] of imp)if(x>=x0-margin&&x<=x1+margin&&y>=y0-margin&&y<=y1+margin)return false;
    for(const [x,y] of impM)if(x>=x0-4&&x<=x1+4&&y>=y0-4&&y<=y1+4)return false;
    for(const [x,y] of impS)if(x>=x0-1&&x<=x1+1&&y>=y0-1&&y<=y1+1)return false;
    if(T&&tol){let lo=1e9,hi=-1e9;for(let y=y0-2;y<=y1+2;y++)for(let x=x0-2;x<=x1+2;x++){const v=T.h[I(x,y)];lo=Math.min(lo,v);hi=Math.max(hi,v)}if(hi-lo>tol)return false}
    if(L.fmap&&pathDigit)for(let y=y0-2;y<=y1+2;y++)for(let x=x0-2;x<=x1+2;x++)if(L.fmap[y]&&L.fmap[y][x]===pathDigit)return false;
    for(let y=y0-1;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++){if(x<2||y<2||x>=W-2||y>=H-2||L.rows[y][x]!=='.')return false}
    return true};
  // ---- sand or pebbles round a lake: the floor of the ring of walkable squares round the water becomes the named floor (never a road square)
  c.rim=(name,keepDigit)=>{const ch=c.slot(name);if(ch===null)return;for(const i of c.wset){const x=i%W,y=(i/W)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,j=I(xx,yy);if(c.wset.has(j)||c.planks.has(j)||c.isWall(xx,yy))continue;if(keepDigit&&L.fmap[yy][xx]===keepDigit)continue;c.setFloor(xx,yy,ch)}}};
  // ---- a spot on one side of a lake given as a list of cells: side N S E W, along = the x (N, S) or y (E, W) of the line to look along
  c.edgeStand=(cells,side,along,water)=>{
    const col=side==='N'||side==='S',sel=cells.filter(q=>col?q[0]===along:q[1]===along);if(!sel.length){c.refused.push('edge none '+side+along);return false}
    if(side==='N'){const y=Math.min(...sel.map(q=>q[1]));return c.stand(along,y-1,0,1,water)}
    if(side==='S'){const y=Math.max(...sel.map(q=>q[1]));return c.stand(along,y+1,0,-1,water)}
    if(side==='W'){const x=Math.min(...sel.map(q=>q[0]));return c.stand(x-1,along,1,0,water)}
    const x=Math.max(...sel.map(q=>q[0]));return c.stand(x+1,along,-1,0,water)};
  // ---- windows: where a lake lies behind a wall (one or two squares thick) from a walkable corridor, cut the wall through so the party can stand at the water
  c.windows=(o)=>{
    const reach=c.reachC(),cand=[],D=[[1,0],[-1,0],[0,1],[0,-1]];
    const open=(x,y)=>x>=2&&y>=2&&x<W-2&&y<H-2&&L.rows[y][x]==='.'&&!c.isWater(x,y)&&reach[I(x,y)];
    const solid=(x,y)=>x>=3&&y>=3&&x<W-3&&y<H-3&&L.rows[y][x]!=='.'&&!c.isWater(x,y)&&!c.decAt(x,y).some(d=>d.block||d.enter||d.npc);
    const box=o.box||[2,2,W-3,H-3];
    for(let y=box[1];y<=box[3];y++)for(let x=box[0];x<=box[2];x++){
      if(!c.isWater(x,y)||L.rows[y][x]!=='.')continue;
      for(const [dx,dy] of D){const w2x=x-dx,w2y=y-dy;if(!c.isWater(w2x,w2y))continue;   // two water squares in a row behind the opening
        const p1=[x+dx,y+dy],p2=[x+dx*2,y+dy*2],p3=[x+dx*3,y+dy*3];
        if(!solid(p1[0],p1[1]))continue;
        let cut=null;
        if(open(p2[0],p2[1]))cut=[p1];else if(solid(p2[0],p2[1])&&open(p3[0],p3[1]))cut=[p1,p2];
        if(cut)cand.push({cut,x:p1[0],y:p1[1],dx:-dx,dy:-dy,h:hash2(x,y,o.seed||9)})}}
    cand.sort((p,q)=>p.h-q.h);const got=[];
    for(const p of cand){if(got.length>=(o.max||8))break;if(got.some(g=>Math.max(Math.abs(g.x-p.x),Math.abs(g.y-p.y))<(o.step||12)))continue;
      for(const [x,y] of p.cut){for(const d of c.decAt(x,y))if(d.block)c.hide(d);const r=L.rows[y];L.rows[y]=r.slice(0,x)+'.'+r.slice(x+1);if(c.hasFm&&o.floor){const ch=c.slot(o.floor);if(ch!==null)c.setFloor(x,y,ch)}}
      c._v++;
      if(c.stand(p.x,p.y,p.dx,p.dy,o.water)){got.push(p);c.windowCells=(c.windowCells||[]).concat(p.cut)}}
    return got};
  // ---- scanning a shore
  c.shore=(o)=>{
    const reach=c.reachC(),want=o.max||20,step=o.step||6,box=o.box||[2,2,W-3,H-3],dirs=o.dirs||[[1,0],[-1,0],[0,1],[0,-1]],cand=[];
    for(let y=box[1];y<=box[3];y++)for(let x=box[0];x<=box[2];x++){const i=I(x,y);if(!reach[i]||c.isWater(x,y))continue;
      if(c.decAt(x,y).some(d=>d.block))continue;
      for(const [dx,dy] of dirs){let k=0;for(let j=1;j<=3;j++){const bx=x+dx*j,by=y+dy*j;if(bx<2||by<2||bx>=W-2||by>=H-2)break;if(c.isWater(bx,by)){k=j;break}}
        if(!k)continue;
        let ok=true;for(let j=1;j<k;j++)if(c.walk(x+dx*j,y+dy*j)||L.rows[y+dy*j][x+dx*j]!=='.'){ok=false;break}  // the squares before the water must be shore that cannot be walked but is not a wall
        if(!ok)continue;
        // two water squares in a row at least, so the patch has room
        if(!c.isWater(x+dx*(k+1),y+dy*(k+1)))continue;
        cand.push({x,y,dx,dy,h:hash2(x,y,o.seed||5)})}}
    cand.sort((p,q)=>p.h-q.h);const got=[];
    for(const p of cand){if(got.length>=want)break;if(got.some(g=>Math.max(Math.abs(g.x-p.x),Math.abs(g.y-p.y))<step))continue;
      if(o.min&&Math.abs(p.x-L.start.x)+Math.abs(p.y-L.start.y)<o.min)continue;
      if(c.stand(p.x,p.y,p.dx,p.dy,o.water))got.push(p)}
    return got};
  return c}
/* the shared bank planting: reeds and grass round the water, a willow or two, flowers; never on a stand square, a plank or the square in front of a stand */
function fplBank(c,o){
  o=o||{};const keep=new Set(),W=c.W;for(const s of c.stands){keep.add(c.I(s.x,s.y))}
  const ring=new Map();for(const i of c.wset){const x=i%W,y=(i/W)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,j=c.I(xx,yy);if(!c.wset.has(j)&&!c.planks.has(j)&&!keep.has(j)&&c.walk(xx,yy))ring.set(j,[xx,yy])}}
  const reeds=['reeds','hgwm_reed0','greeds'].filter(k=>IMG[k]),grass=['pgrass1','pgrass0','pgrass2'].filter(k=>IMG[k]),flw=['pflw0_0','pflw3_0','lflora0'].filter(k=>IMG[k]);
  let n=0;for(const [j,[x,y]] of ring){const h=hash2(x,y,o.seed||31);
    if(c.decAt(x,y).some(d=>d.block))continue;
    if(h<(o.reedP||.45)&&reeds.length){c.deco(reeds[(hash2(x,y,3)*reeds.length)|0],x,y,{sc:.9+hash2(x,y,4)*.5,ox:(hash2(x,y,5)-.5)*.5,oy:(hash2(x,y,6)-.5)*.4});n++}
    else if(h<.75&&grass.length){c.deco(grass[(hash2(x,y,7)*grass.length)|0],x,y,{sc:1+hash2(x,y,8)*.5,ox:(hash2(x,y,9)-.5)*.6,oy:(hash2(x,y,10)-.5)*.5});n++}
    else if(h<.88&&flw.length){c.deco(flw[(hash2(x,y,11)*flw.length)|0],x,y,{sc:1.1,ox:(hash2(x,y,12)-.5)*.5,oy:(hash2(x,y,13)-.5)*.5});n++}}
  return n}
function fplFinish(c){
  const after=c.reachSet(),lost=[];
  for(let i=0;i<c.W*c.H;i++)if(c.before[i]&&!after[i]&&!c.wset.has(i))lost.push((i%c.W)+','+((i/c.W)|0));
  const spots=[];for(const s of c.stands){spots.push({x:s.x,y:s.y,dx:s.dx,dy:s.dy});}
  const byW={};for(const s of c.stands){const w=s.water||'';(byW[w]=byW[w]||[]).push(s.k===1?{x:s.x,y:s.y,dx:s.dx,dy:s.dy}:{x:s.x+s.dx*s.k,y:s.y+s.dy*s.k})}
  for(const w in byW)fshAddSpots(c.n,byW[w],w?{water:w}:undefined);
  FPL.rep[c.n]={lakes:c.lakes.slice(),water:c.wset.size,stands:c.stands.slice(),refused:c.refused.slice(),lost,props:c.props,prepared:true};
  if(lost.length||c.refused.length)console.error('fishing places',c.n,'lost',lost.slice(0,6),'refused',c.refused.slice(0,6));
  return FPL.rep[c.n]}
function fplPrep(n){
  const fn=FPL.cfg[n];if(!fn||FPL.done[n])return;
  if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();
  const L=LEVELS[n];if(!L||L.stub||!L.rows)return;
  FPL.done[n]=1;
  const c=fplCtx(n);try{fn(c)}catch(e){console.error('fishing places',n,e);c.refused.push('exception '+e)}
  fplFinish(c)}
{const _ll=loadLevel;loadLevel=function(n){try{fplPrep(n)}catch(e){console.error('fishing places prep',n,e)}return _ll.apply(this,arguments)}}
