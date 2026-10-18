/* ==========================================================================
   THE WOODS OF THE PILGRIM'S PATH. The trees along the path are real woods you can walk into: narrow trails wind off the road between the trunks, for no reason but to
   explore. Squirrels and rabbits run about, deer step through the trees, bees drift over the flowers, and now and then a wolf waits on a trail and attacks.
   Twenty small, dark caves are hidden in the trees at the back, each with a rock face and a door. Some hold treasure, some gems, some wolves, some outcasts, and
   three hold a fugitive with a quest.
   ========================================================================== */
const PF_CAVE0=7100,PF_CAVES=20;
const PF_SEGS=[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21]; // the stretch of the path that hides each cave
const PF_KINDS=['wolves','treasure','outcast','gems','fugitive','treasure','wolves','gems','outcast','fugitive','treasure','wolves','gems','outcast','treasure','fugitive','gems','wolves','outcast','treasure'];
const PF_NAMES=['The Wolf Hollow','The Root Cellar','The Outcast’s Den','The Glittering Crack','The Fugitive’s Cave','The Old Smuggler’s Hole','The Grey Den','The Gem Crack','The Hermit’s Burrow','The Runaway’s Cave','The Buried Hoard','The Howling Cave','The Crystal Hollow','The Ragged Man’s Cave','The Moss Chest Cave','The Hunted Man’s Cave','The Glimmer Pocket','The Wolf Mother’s Den','The Beggar’s Cave','The Forgotten Strongbox'];
PF_NAMES.forEach((n,i)=>LEVEL_NAMES[PF_CAVE0+i]=n);
if(QAREA_ORDER.indexOf('The Pilgrim’s Path')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'The Pilgrim’s Path');
const PF_ENT={}; // cave index -> where its door stands on the path: {n,x,y}
/* ---------- the trails ---------- */
function pfSet(L,x,y,c){const r=L.rows[y];if(r&&x>=0&&x<r.length)L.rows[y]=r.slice(0,x)+c+r.slice(x+1)}
function pfPrep(n){
  const L=LEVELS[n];if(!L||L._pf||!L.rows||!L.decor)return;L._pf=1;
  const W=L.rows[0].length,H=L.rows.length,s=n-LP.BASE,hs=hash2;
  const isTree=d=>!d.npc&&/^[lp]tree\d/.test(d.k),trees=new Map(); // blocking trees and the soft, walk-through ones that fill out the woods
  for(const d of L.decor)if(isTree(d)){const k=d.x+','+d.y;if(!trees.has(k))trees.set(k,[]);trees.get(k).push(d)}
  if(trees.size<400)return;
  {L.chars=L.chars||{};const cc=String.fromCharCode(0x2c2);L.chars[cc]=pfSlopeGid(.06); // the east edge still stops the party, but is so low it cannot be seen: the woods simply run into the mountains
   for(let y=0;y<H;y++)for(let x=W-3;x<W;x++)pfSet(L,x,y,cc)}
  if(L.sky)L.sky=L.sky.filter(e=>!/^lp_peak/.test(e.k)); // the old flat peak pictures stood out from the edge of the map like cards: the painted mountains in the sky replace them
  const blk=new Set(L.decor.filter(d=>d.block&&isTree(d)).map(d=>d.x+','+d.y));
  {const keys=[...new Set(L.decor.filter(d=>d.block&&isTree(d)).map(d=>d.k))]; // a line of solid trees runs along the east edge: it explains why the party cannot go on, and the mountains rise over it
   if(keys.length)for(let y=2;y<H-2;y++)for(const [x,ph] of [[W-5,0],[W-4,1]]){
     if(L.rows[y][x]!=='.')continue;if(ph&&((y+((hs(x,y,680)*2)|0))%2))continue;
     L.decor.push({k:keys[(hs(x,y,681)*keys.length)|0],x,y,block:true,pfEdge:1,sc:.3+hs(x,y,682)*.14,ox:(hs(x,y,683)-.5)*.5,oy:(hs(x,y,684)-.5)*.4})}} // kept low, so the mountains show over the tops
  const walk=(x,y)=>x>=3&&y>=3&&x<W-6&&y<H-3&&L.rows[y][x]==='.';
  const clear=new Set(),trails=[],st=L.start||{x:0,y:0};
  const dense=/^[NS]$/.test(LP_LEG(s)),zs=dense?pfZone(L):null,elig=dense?pfElig(L,zs):null; // along the sea the whole east side is thick forest (pfDense): trails there are made of trees you can walk through, so nothing is cut away
  const cut=dense?()=>{}:(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const l=trees.get((x+dx)+','+(y+dy));if(l)for(const d of l)clear.add(d)}};
  const carve=(x0,y0,dx,dy,len,seed,cells)=>{ // a winding trail, two squares wide, that stops at rock or water
    let x=x0,y=y0;
    for(let i=0;i<len;i++){
      if(!walk(x,y)||!walk(x,y+1))break;
      cells.push([x,y]);cut(x,y);cut(x,y+1);
      if(i%3===2){const r=hs(seed,i,610);if(dx!==0)y+=r<.3?-1:r<.6?1:0;else x+=r<.3?-1:r<.6?1:0}
      x+=dx;y+=dy;
    }};
  for(let y=150,k=0;y<H-150;k++,y+=15+((hs(s,k,601)*9)|0)){ // a way into the woods about every 100 metres
    if(Math.abs(y-st.y)<8)continue;
    let e=-1;
    if(dense){const z=zs[y];if(z>=60&&elig(z,y)&&elig(z,y+1))e=z}
    else for(let x=56;x<W-8;x++){if(blk.has(x+','+y)){e=x;break}}
    if(e<60||!walk(e-1,y))continue;
    const cells=[];carve(e-1,y,1,0,14+((hs(s,k,602)*24)|0),s*1000+k,cells);
    if(cells.length<6)continue;
    trails.push({y,cells});
    if(hs(s,k,603)<.5&&cells.length>12){ // a side trail
      const m=cells[(cells.length*.55)|0],sgn=hs(s,k,604)<.5?-1:1,c2=[];carve(m[0],m[1]+(sgn>0?2:-1),0,sgn,6+((hs(s,k,605)*8)|0),s*1000+k+500,c2);if(c2.length)trails.push({y:m[1],cells:c2,side:1})}
  }
  // a weaving network: clearings through the depth of the woods, joined to each other and to the trails by winding paths, so the whole forest can be wandered
  const cellsAll=new Set();for(const t of trails)for(const c of t.cells){cellsAll.add(c[0]+','+c[1]);cellsAll.add(c[0]+','+(c[1]+1))}
  const weave=(ax,ay,bx,by,seed)=>{
    let x=ax,y=ay;
    for(let i=0;i<520&&(Math.abs(bx-x)>1||Math.abs(by-y)>1);i++){
      if(!walk(x,y)){break}
      cellsAll.add(x+','+y);cut(x,y);if(walk(x,y+1)){cellsAll.add(x+','+(y+1));cut(x,y+1)}
      const dx=bx-x,dy=by-y,r=hs(seed,i,620);let mx=0,my=0;
      if(Math.abs(dx)>=Math.abs(dy)){mx=Math.sign(dx);if(r<.3&&dy)my=Math.sign(dy);else if(r<.45)my=r<.375?-1:1}else{my=Math.sign(dy);if(r<.3&&dx)mx=Math.sign(dx);else if(r<.45)mx=r<.375?-1:1}
      if(!walk(x+mx,y+my)){ // blocked: try going round
        if(mx&&walk(x,y+Math.sign(dy||1))){mx=0;my=Math.sign(dy||1)}else if(my&&walk(x+Math.sign(dx||1),y)){my=0;mx=Math.sign(dx||1)}else break}
      x+=mx;y+=my}
    return true};
  const deepNodes=[];
  const nodes=trails.filter(t=>!t.side).flatMap(t=>dense?[t.cells[t.cells.length-1]]:[t.cells[t.cells.length-1],t.cells[(t.cells.length*.5)|0]]);
  for(let y=150,k=0;!dense&&y<H-150;y+=16,k++)for(let q=0;q<2;q++){ // clearings deep in the trees (in the thick woods the open places come from pfDense)
    const x=(W*.72+hs(s,k*3+q,630)*(W*.22))|0,yy=y+((hs(s,k*3+q,631)*10)|0);
    if(walk(x,yy)&&walk(x+1,yy+1)&&(blk.has(x+','+yy)||trees.has(x+','+yy)||[[2,0],[-2,0],[0,2],[0,-2]].some(([a,b])=>blk.has((x+a)+','+(yy+b))))){nodes.push([x,yy]);deepNodes.push([x,yy]);cellsAll.add(x+','+yy);cut(x,yy);cut(x+1,yy+1);cut(x-1,yy);cut(x,yy-1)}}
  const trailNodes=trails.filter(t=>!t.side).map(t=>t.cells[t.cells.length-1]),dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const done=new Set();
  nodes.forEach((a,i)=>{
    const near=nodes.map((b,j)=>[j,dist(a,b)]).filter(([j,d])=>j!==i&&d>3&&d<36).sort((p,q)=>p[1]-q[1]).slice(0,dense?1:2);
    const tn=trailNodes.filter(b=>b!==a).map(b=>[b,dist(a,b)]).sort((p,q)=>p[1]-q[1])[0];
    const targets=near.map(([j])=>nodes[j]);if(tn&&tn[1]<60)targets.push(tn[0]);
    for(const b of targets){const key=Math.min(i,nodes.indexOf(b))+'-'+Math.max(i,nodes.indexOf(b));if(done.has(key))continue;done.add(key);weave(a[0],a[1],b[0],b[1],s*7000+i*13+nodes.indexOf(b))}});
  const fmS=Array.isArray(L.fmap)?L.fmap:null,nearRoad=(x,y)=>{if(!fmS)return false;for(let dy=-3;dy<=3;dy++){const r=fmS[y+dy];if(!r)continue;for(let dx=-3;dx<=3;dx++){const f=r[x+dx];if(f==='1'||f==='3')return true}}return false}; // the road is the floor type '1', and its edge '3'
  const edgeMemo=new Map(),edgeAt=y=>{if(edgeMemo.has(y))return edgeMemo.get(y);let m=W;for(let dy=-2;dy<=2;dy++)for(let x=56;x<m;x++)if(blk.has(x+','+(y+dy))){m=x;break}edgeMemo.set(y,m);return m}; // where the trees begin on a row
  // each clearing is a round of open ground about 6 squares across, about a third full of trees: solid ones, and soft ones you can walk through (never on a path)
  for(const [cx,cy] of deepNodes){const OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'],disc=[],mine=[];
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){if(dx*dx+dy*dy>11)continue;const x=cx+dx,y=cy+dy;if(!walk(x,y))continue;cut(x,y);if(!cellsAll.has(x+','+y))disc.push([x,y])}
    const want=Math.round(disc.length*.32);let placed=0;
    for(let t=0;t<disc.length*3&&placed<want;t++){const q=disc[(hs(cx*7+t,cy,640+t)*disc.length)|0],x=q[0],y=q[1];
      if(x<edgeAt(y)+4||nearRoad(x,y))continue; // never out on the road or its verge: only back in the forest
      if(Math.abs(x-cx)+Math.abs(y-cy)<1||cellsAll.has(x+','+y)||cellsAll.has((x+1)+','+y)&&cellsAll.has((x-1)+','+y))continue; // keep the middle and the paths clear
      if(mine.some(m=>Math.abs(m[0]-x)<=1&&Math.abs(m[1]-y)<=1))continue; // spaced out: no two trees side by side
      mine.push([x,y]);
      const soft=hs(x,y,670)<.4;L.decor.push({k:soft?(hs(x,y,671)<.5?'pt_birch':'pt_willow'):OAKS[(hs(x,y,672)*5)|0],x,y,block:!soft,walk:soft||undefined,pfNew:1,sc:soft?.8+hs(x,y,673)*.3:.85+hs(x,y,674)*.4});placed++}}
  L._pfTools={cells:cellsAll,weave,walk,cut};L._pfPaths=cellsAll; // the squares of every trail and weaving path: pfDense fills them with trees you can walk through
  // wolves: now and then one waits deep on a trail
  L.enemies=L.enemies||[];
  trails.forEach((t,i)=>{if(t.side||i%8!==3||t.cells.length<16)return;const c=t.cells[(t.cells.length*.8)|0];if(Math.abs(c[1]-st.y)>30)L.enemies.push({t:'wolf',x:c[0],y:c[1]})});
  // a cave hidden at the end of one trail in this stretch
  const ci=PF_SEGS.indexOf(s);
  if(ci>=0){
    const rock=pfRock(L);
    placing:for(const t of trails.filter(t=>!t.side).sort((a,b)=>b.cells.length-a.cells.length)){
      for(let i=t.cells.length-1;i>=5;i--){const [xe,ye]=t.cells[i];if(xe>W-12)continue;
        let ok=walk(xe,ye);for(let dy=-1;dy<=1&&ok;dy++)for(let dx=1;dx<=3;dx++)if(!walk(xe+dx,ye+dy)||L.decor.some(d=>d.npc&&Math.abs(d.x-(xe+dx))<2&&Math.abs(d.y-(ye+dy))<2))ok=false;
        if(!ok)continue;
        for(let dy=-1;dy<=1;dy++)for(let dx=1;dx<=3;dx++){cut(xe+dx,ye+dy);cut(xe+dx+1,ye+dy)}
        for(let dy=-1;dy<=1;dy++)for(let dx=1;dx<=3;dx++)pfSet(L,xe+dx,ye+dy,rock);
        pfSet(L,xe+1,ye,pfDoor(L,ci));PF_ENT[ci]={n,x:xe,y:ye};L._cave=ci;if(typeof wdThicket==='function')wdThicket(L,n,xe,ye,PF_CAVE0+ci);break placing}
    }
  }
  for(const d of clear){d.block=false;d.sc=.0001;d.pfCut=1} // the trees on a trail are made invisible, not removed, so saved decor keeps its places in the list
  L.enemies=L.enemies.filter(e=>e.t!=='wolf'||(L.rows[e.y]&&L.rows[e.y][e.x]==='.'));
}
/* ---------- the thick woods along the sea: the whole east side is forest, with only a sliver of it open ---------- */
function pfZone(L){ // the first column of the woods on every row: four squares east of the middle of the road (the first road square is the one west of the middle)
  if(L._pfZs)return L._pfZs;
  const H=L.rows.length,W=L.rows[0].length,zs=new Int16Array(H).fill(-1);
  for(let y=0;y<H;y++){const a=L.fmap[y].indexOf('1');if(a>=0&&a+5<=W-8)zs[y]=a+5}
  return L._pfZs=zs}
function pfElig(L,zs){const W=L.rows[0].length,H=L.rows.length,cv=L._carve;return (x,y)=>y>=2&&y<H-3&&zs[y]>=0&&x>=zs[y]&&x<=W-6&&L.rows[y][x]==='.'&&L.fmap[y][x]==='0'&&!(cv&&cv.has(x+','+y))}
const PF_OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'],PF_FIRS=['ltree2','ltree6','ltree10','ltree14'],PF_ODDS=['ltree20','ltree21','ltree17','ltree18','ltree16'],
  PF_WILLOWS=['ltree3','ltree7','ltree11','ltree15','pt_willow'],PF_BUSHES=['lbush0','lbush0_1','lbush0_2'],PF_FLO=['lflora0','lflora0_1','lflora0_2'];
const PF_BLOB=.84,PF_SOLID=.3,PF_OAKPASS=.5,PF_FIRPASS=.8; // PF_OAKPASS: the share of oaks you can walk through // how many little clearings, and how many of the trees deep in the woods are solid
function pfBarkAll(){ // the firs are painted with a pink trunk: it is made bark brown, once, the first time the thick woods are built
  if(pfBarkAll.done)return;pfBarkAll.done=1;
  for(const k of ['ltree2','ltree6','ltree10','ltree14']){try{
    const im=IMG[k];if(!im||!im.width||im._bark)continue;
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
    const d=x.getImageData(0,0,c.width,c.height),p=d.data;
    for(let i=0;i<p.length;i+=4){if(p[i+3]<40)continue;const r=p[i],g=p[i+1],b=p[i+2];if(r>130&&b>80&&g<120&&r-g>60&&b-g>25){const l=r*.3+g*.59+b*.11;p[i]=Math.min(255,l*1.05+14);p[i+1]=l*.74+7;p[i+2]=l*.5+3}}
    x.putImageData(d,0,0);c._bark=1;IMG[k]=c;
  }catch(e){}}}
/* Every square of the woods is a clearing (about one in seven), a trunk that stops the party, or a tree it can walk through: willows, birches and bushes you push through, while oaks and firs stand fast.
   The trails are made of walk-through trees too, so no tree is ever cut away. */
function pfDense(n){
  const L=LEVELS[n];if(!L||L._pfD||!L.rows||!L.decor||!Array.isArray(L.fmap))return;
  const s=n-LP.BASE;if(!/^[NS]$/.test(LP_LEG(s)))return;L._pfD=1;pfBarkAll();
  const W=L.rows[0].length,H=L.rows.length,hs=hash2,zs=pfZone(L),elig=pfElig(L,zs),cv=L._carve||new Set(),paths=L._pfPaths||new Set(),gyOf=y=>lpGY(s,y);
  const isTree=d=>!d.npc&&/^([lp]tree\d|pt_)/.test(d.k),pool=new Map(),occ=new Set(),occB=new Set();
  for(const d of L.decor){const k=d.x+','+d.y;if(isTree(d)){let l=pool.get(k);if(!l)pool.set(k,l=[]);l.push(d)}else if(!d.pfCut){occ.add(k);if(d.block)occB.add(k)}}
  for(const e of L.enemies||[])occ.add(e.x+','+e.y);for(const i of L.items||[])occ.add(i.x+','+i.y);
  {const st=L.start||{x:0,y:0};occ.add(st.x+','+st.y);if(L.tele)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)occ.add((L.tele.x+dx)+','+(L.tele.y+dy))}
  const keep=new Set(),yards=[]; // the little open yards in front of hidden doors
  for(const q of L._wd||[]){const yd=[];for(let dy=-1;dy<=4;dy++)for(let dx=-3;dx<=3;dx++){const k=(q.x+dx)+','+(q.y+dy);keep.add(k);if(dy>=3)yd.push([q.x+dx,q.y+dy])}yards.push(yd)}
  {const ci=PF_SEGS.indexOf(s);if(ci>=0&&PF_ENT[ci]&&PF_ENT[ci].n===n)keep.add(PF_ENT[ci].x+','+PF_ENT[ci].y)} // the square in front of a cave door stays clear
  const pick=(a,r)=>a[Math.min(a.length-1,(r*a.length)|0)];
  const blob=(x,gy)=>{ // a little round clearing, three to five squares across, ragged at the edge
    const bx=Math.floor(x/8),by=Math.floor(gy/8);
    for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const X=bx+i,Y=by+j;if(hs(X,Y,9201)>=PF_BLOB)continue;
      const cx=(X+hs(X,Y,9202))*8,cy=(Y+hs(X,Y,9203))*8,r=1.2+hs(X,Y,9204)*1.8,d=Math.hypot(x+.5-cx,(gy+.5-cy)*(.75+hs(X,Y,9205)*.5))+(hs(x,gy,9206)-.5)*1.1;
      if(d<r)return true}
    return false};
  const nearCarve=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&cv.has((x+dx)+','+(y+dy)))return true;return false};
  const cls=(x,y,gy)=>{ // 0 open, 1 a trunk that blocks the way, 2 a tree to walk through
    const k=x+','+y,depth=x-zs[y];
    if(paths.has(k))return 2;
    const hedge=nearCarve(x,y);
    if(!hedge&&depth>=3&&x<=W-10&&blob(x,gy))return 0;
    let pS=hedge?.85:depth<1?.85:depth<2?.78:depth<3?.66:depth<4?.52:depth<5?.42:PF_SOLID; // a wall of trunks along the road, loosening as it goes deeper
    if(!hedge&&depth>=5)pS=Math.max(.1,Math.min(.72,pS+(tsmooth(x/6,gy/6,9301)-.5)*.9)); // thickets and airy stretches
    return hs(x,gy,9302)<pS?1:2};
  { // straight east from each cross: a row of walk-through trees and short grass runs from the road to the cave or wild dungeon, so walking straight on always arrives
    const ci=PF_SEGS.indexOf(s),runs=[];
    if(ci>=0&&PF_ENT[ci]&&PF_ENT[ci].n===n)runs.push([PF_ENT[ci].y,PF_ENT[ci].x-1]);
    for(const q of L._wd||[])runs.push([q.y+3,q.x-4]);
    for(const [y,x1] of runs)for(let dy=-1;dy<=1;dy++)for(let x=zs[y+dy]>=0?zs[y+dy]:zs[y];x<=x1;x++)if(elig(x,y+dy))paths.add(x+','+(y+dy))} // three squares wide, so the cross itself never stands in the way
  const flo=L.scenery||(L.scenery=[]);
  const flower=(x,y,gy,seed,sc,set)=>{const a=set||PF_FLO,k=pick(a,hs(x,gy,seed+1));flo.push({k,wx:x+.12+hs(x,gy,seed+2)*.76,wy:y+.12+hs(x,gy,seed+3)*.76,sc,decor:{k,walk:true,x,y}})};
  const dress=(d,x,y,gy,soft)=>{ // what grows on this square
    const r1=hs(x,gy,9310),r2=hs(x,gy,9311),r3=hs(x,gy,9312),r4=hs(x,gy,9313);let k,sc;
    if(soft){k=r1<.10?pick(PF_BUSHES,r2):r1<.56?pick(PF_WILLOWS,r2):'pt_birch';sc=k==='pt_birch'?.85+r4*.35:k[1]==='b'?.85+r4*.35:.8+r4*.35}
    else{const stand=tsmooth(x/5,gy/5,9320);k=r1<.06?pick(PF_ODDS,r2):stand<.5?pick(PF_OAKS,r2):r3<.75?pick(PF_FIRS,r2):pick(PF_OAKS,r2);sc=(PF_FIRS.indexOf(k)>=0?.85:.75)+r4*.3}
    const pass=soft||(PF_OAKS.indexOf(k)>=0&&hs(x,gy,9314)<PF_OAKPASS)||(PF_FIRS.indexOf(k)>=0&&hs(x,gy,9315)<PF_FIRPASS); // some oaks can be walked through too
    d.k=k;d.x=x;d.y=y;d.block=!pass;d.walk=pass?true:undefined;d.sc=sc;d.ox=(r2-.5)*.5;d.oy=(r3-.5)*.5;d.pfD=1;delete d.hidden;delete d.pfCut;return d};
  const gone=d=>{d.block=false;d.hidden=true;d.pfCut=1;d.walk=undefined};
  const cellD=new Map(),add=[];let nOpen=0,nSolid=0,nSoft=0;
  for(let y=2;y<H-3;y++){const z=zs[y];if(z<0)continue;const gy=gyOf(y);
    for(let x=z;x<=W-6;x++){
      const k=x+','+y,pl=pool.get(k),el=elig(x,y)&&!occ.has(k)&&!keep.has(k),c=el?cls(x,y,gy):0;
      if(c===0){
        if(pl)for(const d of pl)gone(d);
        if(el){nOpen++;if(hs(x,gy,9330)<.75)flower(x,y,gy,9330,.6+hs(x,gy,9334)*.45);if(hs(x,gy,9335)<.45)flower(x,y,gy,9335,.55+hs(x,gy,9339)*.4);if(hs(x,gy,9340)<.1)flower(x,y,gy,9340,.9+hs(x,gy,9344)*.3,PF_BUSHES)}
        else if(!pl&&!occ.has(k)&&keep.has(k)&&L.rows[y][x]==='.'&&hs(x,gy,9330)<.45)flower(x,y,gy,9330,.6+hs(x,gy,9334)*.4); // flowers in the yards of the hidden doors
        continue}
      let d=pl&&pl[0];if(d){for(let i=1;i<pl.length;i++)gone(pl[i])}else{d={};add.push(d)}
      dress(d,x,y,gy,c===2);cellD.set(k,d);if(c===2)nSoft++;else nSolid++;
      const p=paths.has(k);
      if(hs(x,gy,9350)<(p?.4:c===2?.18:.08))flower(x,y,gy,9350,.6+hs(x,gy,9354)*.4);
      if(c===2&&d.k[1]!=='b'&&hs(x,gy,9360)<.07)flower(x,y,gy,9360,.9+hs(x,gy,9364)*.3,PF_BUSHES);
    }}
  // every little door in the woods can be reached: where the trees are too thick, a way of walk-through trees is made to it
  const heap=[],push=(c,i)=>{heap.push([c,i]);let a=heap.length-1;while(a>0){const p=(a-1)>>1;if(heap[p][0]<=heap[a][0])break;const t=heap[p];heap[p]=heap[a];heap[a]=t;a=p}},
    pop=()=>{const t=heap[0],l=heap.pop();if(heap.length){heap[0]=l;let a=0;for(;;){let b=a*2+1;if(b>=heap.length)break;if(b+1<heap.length&&heap[b+1][0]<heap[b][0])b++;if(heap[a][0]<=heap[b][0])break;const q=heap[a];heap[a]=heap[b];heap[b]=q;a=b}}return t};
  let nMade=0;
  const connect=(srcs,cy)=>{
    const y0=Math.max(2,cy-70),y1=Math.min(H-4,cy+70),hh=y1-y0+1,dist=new Int32Array(W*hh).fill(1e9),prev=new Int32Array(W*hh).fill(-1);heap.length=0;
    for(const [sx,sy] of srcs){if(sy<y0||sy>y1||L.rows[sy][sx]!=='.')continue;const i=(sy-y0)*W+sx;dist[i]=0;push(0,i)}
    let goal=-1;
    while(heap.length){const [c,i]=pop();if(c>dist[i])continue;const x=i%W,y=y0+((i/W)|0),k=x+','+y;
      if((x<zs[y]||paths.has(k))&&!keep.has(k)){goal=i;break}
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<3||nx>W-7||ny<y0||ny>y1||L.rows[ny][nx]!=='.')continue;
        const nk=nx+','+ny;if(occB.has(nk)&&!keep.has(nk))continue;const d=cellD.get(nk),ni=(ny-y0)*W+nx,nc=c+(d&&d.block?6:1);if(nc<dist[ni]){dist[ni]=nc;prev[ni]=i;push(nc,ni)}}}
    if(goal<0)return;
    for(let i=goal;i>=0;i=prev[i]){const x=i%W,y=y0+((i/W)|0),k=x+','+y,d=cellD.get(k);paths.add(k);if(d&&d.block){dress(d,x,y,gyOf(y),true);nMade++;nSolid--;nSoft++}if(!keep.has(k)&&hs(x,gyOf(y),9370)<.3)flower(x,y,gyOf(y),9370,.6+hs(x,gyOf(y),9374)*.4)}};
  for(const yd of yards)connect(yd,yd[0][1]-4);
  for(const d of add)L.decor.push(d);
  { // the trails and weaving paths are short grass, without the meadow's flowers, so they can be followed with the eye: a grassy way in among the trunks
    const byRow=new Map();
    for(const k of paths){const i=k.indexOf(','),x=+k.slice(0,i),y=+k.slice(i+1);if(L.fmap[y]&&L.fmap[y][x]==='0'){let a=byRow.get(y);if(!a)byRow.set(y,a=[]);a.push(x)}}
    for(const [y,xs] of byRow){const r=L.fmap[y].split('');for(const x of xs)r[x]='2';L.fmap[y]=r.join('')}}
  L._pfDStat={open:nOpen,solid:nSolid,soft:nSoft,made:nMade,paths:paths.size};
}
loadImg('pf_rock','assets/pf_rock.jpg');loadImg('pf_slope','assets/pf_slope.jpg');loadImg('pf_range0','assets/pf_range0.png');loadImg('pf_range1','assets/pf_range1.png');
function pfRockGid(wh,inside){ // a rough, dark, painted cave rock wall of the given height
  const k=inside?'pfrockin':'pfrock';
  if(!OH_STY[k])OH_STY[k]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'pf_rock',zoom:1,contrast:1.25,tint:inside?[190,186,182,0]:[250,246,240,0]});
  return ohTiles().make('plain',k,wh).gid}
function pfSlopeGid(wh){ // the forested mountainside that closes the east end of the woods
  if(!OH_STY.pfslope)OH_STY.pfslope=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'pf_slope',zoom:1,contrast:1.1,tint:[236,240,236,0]});
  return ohTiles().make('plain','pfslope',wh).gid}
function pfRock(L){ // the rough rock face of a cave mouth
  L.chars=L.chars||{};if(L._pfRock)return L._pfRock;
  const gid=pfRockGid(L.ceilH||5.2),c=String.fromCharCode(0x2c0);L.chars[c]=gid;return L._pfRock=c}
function pfDoor(L,ci){ // the door into the cave: a dark opening in the rock
  L.chars=L.chars||{};const dgid=KH_NEXT_GID++;T_TILE[dgid]=T_DOORS.cave;KH_DOOR[dgid]={lvl:PF_CAVE0+ci,at:{x:8,y:12,f:0}};
  const c=String.fromCharCode(0x2d0+ci);L.chars[c]=dgid;return c}
{const _ll=loadLevel;loadLevel=function(n){try{if(n>=LP.BASE&&n<LP.BASE+LP.N){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();pfPrep(n)}}catch(x){console.error(x)}return _ll.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(n,e){try{if(n>=LP.BASE&&n<LP.BASE+LP.N-0){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();pfPrep(n)}}catch(x){console.error(x)}return _g.apply(this,arguments)}}
/* ---------- the caves ---------- */
const PF_OUTCAST=[ // [name, face, what they say, gift]
 ['A ragged hermit','kh_ohfolk6_3','Shh. I came here when the village decided I was bad luck. It is warm enough, and nobody asks about the goat. Mind the wolves, they like the pilgrims better than they like me.','potion'],
 ['An outcast','kh_ohfolk7_1','I was a tax-collector, once. Now I collect mushrooms, and I am much better liked. If you are looking for gems, try the cracks in the rock. The wolves guard the best ones.','bread'],
 ['A lonely woman','kh_ohfolk1_0','They say I am a witch because the cat talks to me. The cat does not talk. The cat is rude. You are welcome to sit, if you do not mind a lot of cat.','cheese'],
 ['A man in rags','kh_ohfolk5_3','Do not look at me like that, I was a respectable man. A bad winter, a bad harvest, a bad word to the wrong lord. Walk on, friend, and be kind to the next one you find in a cave.','apple']];
PF_OUTCAST.forEach(([nm,face,line,gift],i)=>khNpc('pf_out'+i,nm,face,()=>{const F=G.flags;if(!F['pfg'+i]){F['pfg'+i]=1;try{bagAdd(mkItem(gift));msg(`${nm} presses something into your hand.`,'#ffe9a0')}catch(e){}}return say(line,[BYE])}));
const PF_FUG=[
 {id:'pf1',who:'Wulf, a runaway',face:'kh_ohfolk3_3',title:'Bread for the Fugitive',need:3,item:'bread',what:'loaves of bread',reward:{gold:450,xp:4500},
  offer:'Quiet. Please. I have run from the lord’s men for six days, and I have not eaten since the river. I cannot go out to the road. If you could bring me three loaves of bread, I would be in your debt for life.',accept:'Three loaves. Bless you. I will be here. I am always here.',
  thanks:'Bread! Real bread! Take this, it is all I have left, and tell nobody about me.',after:'I will sleep tonight. Thank you.'},
 {id:'pf2',who:'Mara, a runaway',face:'kh_ohfolk2_3',title:'Medicine for the Runaway',need:2,item:'potion',what:'healing potions',reward:{gold:500,xp:5000},
  offer:'My brother was hurt getting us out of the keep. He is in the back of the cave, and he will not wake. I have no money, only a name I cannot give you. Two healing potions would save him.',accept:'Two potions. I will wait with him. Please be quick.',
  thanks:'He opened his eyes! Thank you, thank you. I will remember this.',after:'He is sitting up and complaining about the soup. That is a good sign.'},
 {id:'pf3',who:'Old Brannic, a prisoner escaped',face:'kh_ohfolk5_2',title:'A Pick for the Prisoner',need:2,item:'lockpick',what:'lock picks',reward:{gold:550,xp:5500},
  offer:'I got out of the lord’s cells with a bent nail. There is still a chain on my leg, and the lock is a clever one. Two lock picks and I could be walking free by morning. I would pay if I had a coin. I have a story, which is worth less.',accept:'Two lock picks. A trader on the road will sell you them.',
  thanks:'Click. Click. There! Free of it. Here, take what I have, and walk well.',after:'I am walking tomorrow, with no chain at all.'}];
PF_FUG.forEach(f=>{
  monq(f.id,f.title,f.who,`${f.who.split(',')[0]} hides in a cave in the woods of the Pilgrim’s Path. Bring ${f.need} ${f.what}.`,f.need,()=>Math.min(f.need,bagCount(f.item)),f.reward,{take:{[f.item]:f.need}});QAREA[f.id]='The Pilgrim’s Path';
  khNpc('pf_f'+f.id,f.who,f.face,()=>qNode(f.id,khQD(f.offer,f.accept,(g,n)=>`${g} of ${n} ${f.what}.`,`You have the ${f.what}? Oh, thank you.`,f.thanks,f.after,'Here they are.')),{q:f.id});
});
function pfCaveBuild(ci){
  const W=17,H=15,kind=PF_KINDS[ci],hs=hash2,sd=ci*17+5,g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  let x=8,y=H-3;const cells=[];
  const carve=(a,b)=>{if(a>=2&&b>=2&&a<=W-3&&b<=H-3&&g[b][a]==='#'){g[b][a]='.';cells.push([a,b])}};
  carve(x,y);
  for(let i=0;i<190;i++){const r=hs(sd,i,701);if(r<.45)y--;else if(r<.6)y++;else if(r<.8)x--;else x++;x=Math.max(2,Math.min(W-3,x));y=Math.max(2,Math.min(H-3,y));carve(x,y);if(hs(sd,i,702)<.1){carve(x+1,y);carve(x,y+1);carve(x+1,y+1)}}
  const door=String.fromCharCode(0x2f0);g[H-2][8]=door;g[H-3][8]='.';
  const d=new Int16Array(W*H).fill(-1),q=[8+(H-3)*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],cx=c%W,cy=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  const open=cells.filter(([a,b])=>d[b*W+a]>3).sort((a,b)=>d[b[1]*W+b[0]]-d[a[1]*W+a[0]]);
  const used=new Set(['8,'+(H-3)]),pick=i=>{for(let t=0;t<open.length;t++){const c=open[(i*7+t*3)%open.length];if(!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const far=open[0]||[8,H-4],decor=[],enemies=[],items=[];used.add(far[0]+','+far[1]);
  const seg=LEVELS[LP.BASE+PF_SEGS[ci]],diff=(seg&&seg.diff)||25;
  {const bc=pick(1)||[9,10];decor.push({k:'bones',x:bc[0],y:bc[1],block:false})}
  const gold=220+ci*30;
  if(kind==='treasure'){decor.push({k:'chest',x:far[0],y:far[1],block:true,goldAmt:gold});const c=pick(2);if(c)items.push({k:'potion',x:c[0],y:c[1]});const b=pick(3);if(b)decor.push({k:'barrel',x:b[0],y:b[1],block:true})}
  else if(kind==='gems'){const base=Math.min(34,6+Math.round(diff*.35));for(let i=0;i<6;i++){const c=pick(10+i);if(!c)break;const gm=GEM_BY_VALUE[Math.min(39,base+((hs(sd,i,710)*6)|0))];items.push({k:'gem_'+gm[0],x:c[0],y:c[1]})}}
  else if(kind==='wolves'){for(let i=0;i<4;i++){const c=pick(20+i);if(c)enemies.push({t:'wolf',x:c[0],y:c[1]})}const c=pick(30);if(c)items.push({k:'potion',x:c[0],y:c[1]});decor.push({k:'bones',x:far[0],y:far[1],block:false})}
  else if(kind==='outcast'){const oi=PF_KINDS.slice(0,ci).filter(k=>k==='outcast').length%4,kp=KH_KEEPERS['pf_out'+oi];if(kp)decor.push({k:khFaceKey(kp.face),x:far[0],y:far[1],block:false,walk:true,npc:'pf_out'+oi,sc:1});const c=pick(40);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
  else if(kind==='fugitive'){const fi=PF_KINDS.slice(0,ci).filter(k=>k==='fugitive').length%3,id='pf_f'+PF_FUG[fi].id,kp=KH_KEEPERS[id];if(kp)decor.push({k:khFaceKey(kp.face),x:far[0],y:far[1],block:false,walk:true,npc:id,sc:1});const c=pick(50);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
  if(!PF_ENT[ci]){const sn=LP.BASE+PF_SEGS[ci];try{if(!LEVELS[sn]&&KH_LAZY[sn])KH_LAZY[sn]();pfPrep(sn)}catch(e){console.error(e)}}
  const ent=PF_ENT[ci]||{n:LP.BASE+PF_SEGS[ci],x:80,y:300};
  const rk=pfRockGid(2.6,true),dgid=KH_NEXT_GID++;T_TILE[dgid]=wdExitTile(2.6);KH_DOOR[dgid]={lvl:ent.n,at:{x:ent.x,y:ent.y,f:3}};
  const chars={'#':rk};chars[door]=dgid;
  return {rows:g.map(r=>r.join('')),start:{x:8,y:H-3,f:0},enemies,items,decor,chars,day:0,name:PF_NAMES[ci],label:PF_NAMES[ci],diff,ceilH:2.6,torchGap:1e9,noTele:true,portals:[],lights:[],
    mapNames:[{t:PF_NAMES[ci],x:8,y:H-1,k:'place'}]};
}
for(let i=0;i<PF_CAVES;i++)KH_LAZY[PF_CAVE0+i]=((ci)=>()=>{if(!LEVELS[PF_CAVE0+ci]){const lv=pfCaveBuild(ci);LEVELS[PF_CAVE0+ci]=lv}})(i);
/* ---------- creatures of the woods: squirrels and rabbits dart about, deer step through the trees, bees drift ---------- */
for(const n of ['sq0','sq1','rb0','rb1','doe','stag','bee0','bee1'])loadImg('cr_'+n,'assets/cr_'+n+'.png');
ENEMY_DEF.critter={name:'Creature',hp:1,dmg:[0,0],hit:0,w:.3,img:'',xp:0,gold:[0,0],speed:1};
const WDC=[];
const WD_KIND={ // h: height in the world, spd: squares a second, flee: how close the party can come
  squirrel:{f:['sq0','sq1'],h:.34,spd:2.6,flee:3.4,wt:2},rabbit:{f:['rb0','rb1'],h:.36,spd:2.2,flee:3.6,wt:2,hop:1},
  deer:{f:['doe','stag'],h:1.0,spd:1.5,flee:5,wt:1},bee:{f:['bee0','bee1'],h:.075,spd:1.1,flee:0,wt:2,fly:1}};
const wdFree=(x,y,kind)=>{const c=Math.floor(x),d=Math.floor(y);const L=LEVELS[LEVEL];if(!(L&&L.rows[d]&&L.rows[d][c]==='.'&&!cellBlocked(c,d)))return false;
  const fm=G.fmap;if(typeof fm==='string'){const f=fm[d*MW+c];if(kind==='bee')return f!=='4'; // bees may cross the road, but not the water
    return f==='0'||f==='2'} // animals keep to the grass and the woods (and the grassy trails): not the road, the shore or the water
  return true};
function wdTick(dt){
  const L=LEVELS[LEVEL];
  if(!L||LEVEL<LP.BASE||LEVEL>=LP.BASE+LP.N||G.state!=='play'||G.cut){WDC.length=0;return}
  const px=G.P.x+.5,py=G.P.y+.5;
  for(let i=WDC.length-1;i>=0;i--){const c=WDC[i];if(c.lvl!==LEVEL||Math.hypot(c.x-px,c.y-py)>22)WDC.splice(i,1)}
  G._wdT=(G._wdT||0)+dt;
  if(G._wdT>.9&&WDC.length<9){G._wdT=0;
    const kinds=Object.keys(WD_KIND),tot=kinds.reduce((a,k)=>a+WD_KIND[k].wt,0);let u=Math.random()*tot,kind=kinds[0];for(const k of kinds){u-=WD_KIND[k].wt;if(u<=0){kind=k;break}}
    for(let t=0;t<24;t++){const a=Math.random()*Math.PI*2,r=6+Math.random()*7,x=px+Math.cos(a)*r,y=py+Math.sin(a)*r;
      if(wdFree(x,y,kind)){const K=WD_KIND[kind];WDC.push({lvl:LEVEL,kind,x,y,tx:x,ty:y,t:Math.random()*2,ph:Math.random()*6.28,e:{t:'critter',x:Math.floor(x),y:Math.floor(y),hp:1},fi:kind==='deer'?(Math.random()<.5?0:1):0});break}}}
  for(const c of WDC){const K=WD_KIND[c.kind];c.t-=dt;c.ph+=dt*(K.fly?30:K.hop?9:7);
    const dp=Math.hypot(c.x-px,c.y-py);let fleeing=false;
    if(K.flee&&dp<K.flee){fleeing=true;const a=Math.atan2(c.y-py,c.x-px)+(Math.random()-.5)*.8;c.tx=c.x+Math.cos(a)*3;c.ty=c.y+Math.sin(a)*3;c.t=.5}
    else if(c.t<=0||Math.hypot(c.tx-c.x,c.ty-c.y)<.2){c.t=(K.fly?.6:1.2)+Math.random()*2.2;const rest=!K.fly&&Math.random()<.45;if(rest){c.tx=c.x;c.ty=c.y}else{const a=Math.random()*Math.PI*2,r=1+Math.random()*(K.fly?3:4);c.tx=c.x+Math.cos(a)*r;c.ty=c.y+Math.sin(a)*r}}
    const dx=c.tx-c.x,dy=c.ty-c.y,dl=Math.hypot(dx,dy);c.moving=dl>.15;
    if(c.moving){const sp=K.spd*(fleeing?1.7:1)*dt,nx=c.x+dx/dl*sp,ny=c.y+dy/dl*sp;if(wdFree(nx,ny,c.kind)){c.x=nx;c.y=ny}else c.t=0}
    c.e.x=Math.floor(c.x);c.e.y=Math.floor(c.y)}
}
{const _sl=spriteList;let last=performance.now();spriteList=function(){const L=_sl.apply(this,arguments);try{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;wdTick(dt);
  for(const c of WDC){const K=WD_KIND[c.kind];let key,bob=0;
    if(c.kind==='squirrel')key=c.moving?K.f[Math.floor(c.ph*.6)%2]:K.f[0];
    else if(c.kind==='rabbit'){const hop=c.moving?Math.max(0,Math.sin(c.ph)):0;bob=hop*.16;key=hop>.15?K.f[1]:K.f[0]}
    else if(c.kind==='deer')key=K.f[c.fi];
    else{key=K.f[Math.floor(c.ph/3.14)%2];bob=.5+Math.sin(c.ph*.13)*.14+Math.sin(c.ph*.07+1)*.1}
    const im=IMG['cr_'+key];if(!im||!im.width)continue;
    L.push({x:c.x,y:c.y,img:im,w:K.h*im.width/im.height,bob,e:c.e,fade:1})}}catch(e){console.error(e)}return L}}
/* ---------- the older forests (Thornwood, Gandrick's Wood, the Ironhill Road, the Moor, Greendale): their walls of trees are cut through by winding paths ---------- */
const PF_OLD=[2,7,10,19,32];
function pfOld(n){
  const L=LEVELS[n];if(!L||L._pfOld||!L.rows)return;L._pfOld=1;
  const W=L.rows[0].length,H=L.rows.length,hs=hash2;
  const ch=(x,y)=>(L.rows[y]||'')[x];
  const can=(x,y)=>x>=3&&y>=3&&x<W-3&&y<H-3&&(ch(x,y)==='T'||ch(x,y)==='.');
  const nearDoor=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const c=ch(x+dx,y+dy);if(c&&c!=='.'&&c!=='T'&&/[0-9]/.test(c))return true}return false};
  const dug=new Set(),open=[];
  const dig=(x,y)=>{if(!can(x,y)||nearDoor(x,y))return false;if(ch(x,y)==='T')pfSet(L,x,y,'.');dug.add(x+','+y);return true};
  const weave=(ax,ay,bx,by,seed)=>{let x=ax,y=ay;
    for(let i=0;i<300&&(Math.abs(bx-x)>0||Math.abs(by-y)>0);i++){
      if(!dig(x,y))break;
      const dx=bx-x,dy=by-y,r=hs(seed,i,810);let mx=0,my=0;
      if(Math.abs(dx)>=Math.abs(dy)){mx=Math.sign(dx);if(r<.3&&dy)my=Math.sign(dy);else if(r<.42)my=r<.36?-1:1}else{my=Math.sign(dy);if(r<.3&&dx)mx=Math.sign(dx);else if(r<.42)mx=r<.36?-1:1}
      if(!can(x+mx,y+my)){if(mx&&can(x,y+Math.sign(dy||1))){mx=0;my=Math.sign(dy||1)}else if(my&&can(x+Math.sign(dx||1),y)){my=0;mx=Math.sign(dx||1)}else break}
      x+=mx;y+=my}};
  // ways in: open squares at the edge of the trees, a little over 100 metres apart
  const ent=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(ch(x,y)!=='.')continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(ch(x+dx,y+dy)==='T'&&ch(x+2*dx,y+2*dy)==='T'&&hs(x,y,801)<.35&&!ent.some(e=>Math.abs(e[0]-x)+Math.abs(e[1]-y)<10)){ent.push([x,y,dx,dy]);break}}
  // clearings deep in the trees
  const nodes=[];for(let y=5;y<H-5;y+=7)for(let x=5;x<W-5;x+=7){const nx=x+((hs(x,y,802)*5)|0)-2,ny=y+((hs(x,y,803)*5)|0)-2;let all=true;for(let dy=-1;dy<=1&&all;dy++)for(let dx=-1;dx<=1;dx++)if(ch(nx+dx,ny+dy)!=='T'){all=false;break}if(all)nodes.push([nx,ny])}
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),all=[...nodes];
  for(const e of ent){const near=nodes.map(b=>[b,dist(e,b)]).filter(([b,d])=>d<22).sort((p,q)=>p[1]-q[1])[0];if(near)weave(e[0],e[1],near[0][0],near[0][1],e[0]*31+e[1])}
  nodes.forEach((a,i)=>{const near=nodes.map((b,j)=>[j,dist(a,b)]).filter(([j,d])=>j!==i&&d<16).sort((p,q)=>p[1]-q[1]).slice(0,2);for(const [j] of near)if(j>i||!nodes[j])weave(a[0],a[1],nodes[j][0],nodes[j][1],i*17+j)});
  for(const a of nodes)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)dig(a[0]+dx,a[1]+dy); // each clearing is a little round of open ground
  L._pfOldCells=dug;
}
/* ---------- the mountains at the east end of the woods: two painted ranges laid on the sky, behind the land, fixed to the compass so they never drift or swell ---------- */
let PF_MT=null;
function pfMtData(){
  if(PF_MT)return PF_MT;const out=[];
  for(const k of ['pf_range0','pf_range1']){const im=IMG[k];if(!im||!im.width)return null;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const id=x.getImageData(0,0,im.width,im.height),d=id.data;for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2];if(r>g+14&&b>g+14){d[i]=Math.min(r,g+8);d[i+2]=Math.min(b,g+12)}} // take the last pink of the keyed-out background out of the mist
    out.push({w:im.width,h:im.height,d})}
  const sl=IMG.pf_slope;if(sl&&sl.width){const c=document.createElement('canvas');c.width=sl.width;c.height=sl.height;const x=c.getContext('2d');x.drawImage(sl,0,0);out.slope={w:sl.width,h:sl.height,d:x.getImageData(0,0,sl.width,sl.height).data}}
  return PF_MT=out}
function pfMountains(D,dX,dY,pX,pY,hzr,lbm){
  if(!(typeof LP!=='undefined'&&LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N))return;
  const M=pfMtData();if(!M)return;
  const Hm=Math.round(VH*.44),br=Math.min(1,.8*(lbm||1)+.08),hz=hzr||[200,214,228];
  for(let x=0;x<VW;x++){
    const cm=2*x/VW-1,a=Math.atan2(dY+pY*cm,dX+pX*cm);let ang=((a%TAU)+TAU)%TAU;if(ang>Math.PI)ang-=TAU; // 0 is due east, the deep end of the woods
    if(ang<-1.45||ang>1.45)continue;
    const e=Math.abs(ang),sm=e<.85?1:Math.max(0,1-(e-.85)/.6),tp=sm*sm*(3-2*sm),Hx=Math.max(4,Math.round(Hm*(.3+.7*tp))); // the range tapers down and fades out at its north and south ends, instead of stopping at a straight edge
    const wt0=Math.max(0,Math.min(1,(ang+.4)/.8)),wt=wt0*wt0*(3-2*wt0); // the two ranges are crossfaded over the middle, so there is no seam where they meet
    const u0=Math.min(M[0].w-1,Math.max(0,((ang+1.45)/1.45*(M[0].w-1))|0)),u1=Math.min(M[1].w-1,Math.max(0,(ang/1.45*(M[1].w-1))|0));
    for(let yy=0;yy<Hx;yy++){const y=HH-Hx+yy;if(y<0||y>=VH)continue;
      const r0=Math.min(M[0].h-1,(yy/Hx*M[0].h)|0),r1=Math.min(M[1].h-1,(yy/Hx*M[1].h)|0),i0=(r0*M[0].w+u0)*4,i1=(r1*M[1].w+u1)*4,a0=M[0].d[i0+3]/255*(1-wt),a1=M[1].d[i1+3]/255*wt,at=a0+a1;
      const al=Math.min(1,at*Math.min(1,tp*1.6)*1.08);if(al<.02)continue;
      const cr=(M[0].d[i0]*a0+M[1].d[i1]*a1)/at,cg=(M[0].d[i0+1]*a0+M[1].d[i1+1]*a1)/at,cb=(M[0].d[i0+2]*a0+M[1].d[i1+2]*a1)/at;
      const o=(y*VW+x)*4,f=al; // a little haze over the far range
      D[o]=D[o]*(1-f)+(cr*br*.8+hz[0]*.2)*f;D[o+1]=D[o+1]*(1-f)+(cg*br*.8+hz[1]*.2)*f;D[o+2]=D[o+2]*(1-f)+(cb*br*.8+hz[2]*.2)*f}
    // below the horizon the mountains stand on forest: wherever the land ends at the edge of the map, painted woods fill the gap, so it never reads as water
    const S=M.slope,tb=Math.min(1,tp*1.6);
    if(S&&tb>.02){const u=((((ang+1.6)/.34)%1+1)%1*S.w)|0;
      for(let y=HH;y<VH;y++){const dy=y-HH,v=(((dy*1.7+6*Math.sin(ang*9))%S.h)+S.h)%S.h|0,i=(v*S.w+u)*4,ramp=Math.min(1,.4+dy/9)*tb,haze=Math.max(.06,.5-dy/48),o=(y*VW+x)*4;
        D[o]=D[o]*(1-ramp)+(S.d[i]*br*.95*(1-haze)+hz[0]*haze)*ramp;D[o+1]=D[o+1]*(1-ramp)+(S.d[i+1]*br*.95*(1-haze)+hz[1]*haze)*ramp;D[o+2]=D[o+2]*(1-ramp)+(S.d[i+2]*br*.95*(1-haze)+hz[2]*haze)*ramp}}
  }}
/* ---------- the mossy crosses: every cave and wild dungeon on the Pilgrim's Path has a moss-covered stone cross beside the road, on the same row as its entrance, so
   going straight east from the cross leads to it. Nothing tells the player; an old soldier in Oldhaven knows. ---------- */
function pfMossCross(){
  if(IMG.lpcross||!IMG.cross||!IMG.cross.width)return;
  const im=IMG.cross,w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0);
  x.globalCompositeOperation='source-atop';
  for(let i=0;i<260;i++){const a=hash2(i,1,911),b=hash2(i,2,911),low=Math.pow(b,.6); // moss gathers low down and on the upper arms
    x.fillStyle=`rgba(${50+((hash2(i,3,911)*40)|0)},${92+((hash2(i,4,911)*50)|0)},${36+((hash2(i,5,911)*24)|0)},${.35+hash2(i,6,911)*.35})`;
    x.beginPath();x.ellipse(a*w,low*h,3+hash2(i,7,911)*(w*.07),2+hash2(i,8,911)*(h*.03),hash2(i,9,911)*3,0,6.283);x.fill()}
  IMG.lpcross=c;NPC_H.lpcross=1.5}
function pfCrosses(n){
  const L=LEVELS[n];if(!L||L._pfX||!L.rows||!L.fmap)return;L._pfX=1;pfMossCross();if(!IMG.lpcross)return;
  const s=n-LP.BASE,rows=[];
  const ci=PF_SEGS.indexOf(s);if(ci>=0&&PF_ENT[ci]&&PF_ENT[ci].n===n)rows.push(PF_ENT[ci].y);
  for(const q of L._wd||[])rows.push(q.y+3);
  for(const y of rows){const a=L.fmap[y]&&L.fmap[y].indexOf('1');if(!(a>=0))continue;
    for(const x of [a+4,a+3,a+5]){if(L.rows[y][x]!=='.'||L.fmap[y][x]==='1')continue;
      if(L.decor.some(d=>d.x===x&&d.y===y&&!d.hidden&&!d.pfCut&&!/^(l|p|pt_)/.test(d.k)))continue;
      for(const d of L.decor)if(d.x===x&&d.y===y&&/^([lp]tree\d|pt_)/.test(d.k)){d.block=false;d.hidden=true;d.pfCut=1}
      L.decor.push({k:'lpcross',x,y,block:true,deco:true,sc:1});break}}}
