/* ==========================================================================
   TWISTED TREES AND BLIGHT GROWTHS for the Blighted Road (the ten places, ids 9610 to 9709), the Barrow Hill outside the Vault of Maldrake (9670) and the town of Sale (level 600). Prefix bgr.
   Painted pictures (Gemini, strict front elevation, assets/ds_bl_twist_1..6.png and ds_bl_grow_1..6.png, loaded at start through DS_PAINTED) are scattered over a level AFTER its own builder has run:
   a wrap of KH_LAZY of each place (the last wrap, so it runs after every polish pass) and of saBuild (Sale). Nothing in the zone files is edited; the pass runs once per level (flag L._bgr) and is seeded by the level id.
   Rules (checked here and again by tools/polish/bgr_test.py): never on a path, a door or gate, a milestone, a person, a quest piece or an item, or within 2 squares of one; spawns stay clear (1 square);
   the same picture is never within 2 squares of itself; a solid piece is only kept when every cell beside it that had a free 2 by 2 square still has one (no corridor narrower than 2 is made where there was none);
   after the pass a flood fill from every entry must still reach everything it reached before, and a piece that cut something off is taken away. At most BGR.MAX pieces per level. Plain literal text, no em dashes.
   Set window.__BGR_OFF=true before a level is built to leave it as it was (for timing).
   ========================================================================== */
const BGR={MAX:240,stats:{},KEEP:{},winCy:1.5,winLo:.65};
/* key, height in squares, solid, kind (t tree, g growth), weight */
const BGR_PIECES=[
  ['bl_twist_1',2.15,1,'t',1.0],['bl_twist_2',1.8,1,'t',1.1],['bl_twist_3',2.25,1,'t',.8],['bl_twist_4',2.2,1,'t',1.0],['bl_twist_5',1.55,1,'t',1.0],['bl_twist_6',2.0,1,'t',.9],
  ['bl_grow_1',.85,1,'g',.5],['bl_grow_2',.8,1,'g',1.1],['bl_grow_3',1.15,1,'g',1.0],['bl_grow_4',.62,0,'g',1.3],['bl_grow_5',1.75,1,'t',.7],['bl_grow_6',1.25,0,'g',.9],['bl_grow_ring',.5,0,'g',.8],['bl_canker',.65,1,'g',.9]];
for(const p of BGR_PIECES)NPC_H[p[0]]=p[1];
NPC_H.bl_arch=2.0;NPC_H.bl_moss=.3;NPC_H.bl_win_a=.5;NPC_H.bl_win_b=.85;NPC_H.bl_win_c=.38;
const BGR_TEXT={
  bl_twist_1:['A bent white tree','A bleached tree bent over like a finger beckoning. The bark is smooth and pale as bone, and cold to the touch even at midday.'],
  bl_twist_2:['A tree with a face','A screaming face has grown into the bark. The mouth is a hollow you could put your arm into. It is damp inside, and warm, like a breath.'],
  bl_twist_3:['A split tree','The trunk has split from root to crown and the two halves have bent apart. The wood inside is black and smooth, as if it burned a long time ago and is still thinking about it.'],
  bl_twist_4:['A wrung tree','The trunk winds round and round on itself like a rope being wrung out. Wherever it was wrung hardest the bark has split and shows pale wood.'],
  bl_twist_5:['A hunched tree','A bent old tree with a grim face in its knots. Grey moss hangs from it like a beard. It looks as though it is listening to you walk.'],
  bl_twist_6:['A tree with hands','The branches end in long fingers, and the fingers are closed round nothing. The tree seems to be holding that nothing very firmly.'],
  bl_grow_1:['Swollen bulbs','Pale swollen bulbs on fleshy stalks. They pulse slowly, a little slower than a heartbeat. One has split, and something dark shows inside.'],
  bl_grow_2:['A knot of roots','Roots as thick as a man\'s arm, pulled up out of the ground and tied into a tangle. The white tips all point back along the road.'],
  bl_grow_3:['A fungus stump','Shelves of pale fungus climb a rotten stump. They give off a cold smell of cellars. Do not eat them.'],
  bl_canker:['A canker','Knots and burls swollen on one another, grey as old tongues. Where the bark has split the wood inside is wet. It is not sap.'],
  bl_grow_5:['A skull pod tree','Small pods shaped like skulls hang from the white branches, each the size of a fist. They are not skulls. They are very nearly skulls.']};
function bgrNpcs(){
  for(const k in BGR_TEXT){const id='bgr_x_'+k;if(NPCS[id])continue;const t=BGR_TEXT[k];khNpc(id,t[0],k,()=>say(t[1],[BYE]))}}
/* a pale copy of a painted fungus picture, for the rings and clusters on the ground */
/* variants of the painted trees and growths (made once, in code, from the pictures): mirrored (a second silhouette), dark (the thick of a wood) and pale (rim-lit, at the edge of a wood or beside a path);
   the pink bulbs of the first pass are recoloured to a sickly bruise and bone tone */
function bgrVariants(){
  const mk=(src,flip,filt)=>{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');try{if(filt)x.filter=filt}catch(e){}
    if(flip){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(src,0,0);return c};
  const bulb=IMG.bl_grow_1;if(bulb&&bulb.width&&!bulb._bgrTone){const c=mk(bulb,false,'hue-rotate(-62deg) saturate(.42) brightness(.8) contrast(1.06)');c._bgrTone=1;IMG.bl_grow_1=c}
  // lit windows: the painted window on a soft warm halo (made once; the picture is 2.2 times as big as the window, which stays centred)
  for(const [k,h] of [['bl_win_a',.5],['bl_win_b',.85],['bl_win_c',.38]]){const raw=IMG['bl_win_raw_'+k]||IMG[k];if(!raw||!raw.width||raw._halo)continue;IMG['bl_win_raw_'+k]=raw;
    const W=Math.round(raw.width*2.2),H=Math.round(raw.height*2.2),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),g=x.createRadialGradient(W/2,H/2,Math.min(raw.width,raw.height)*.25,W/2,H/2,Math.max(W,H)*.5);
    g.addColorStop(0,'rgba(255,196,110,.55)');g.addColorStop(.45,'rgba(255,170,80,.2)');g.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=g;x.fillRect(0,0,W,H);x.drawImage(raw,(W-raw.width)/2,(H-raw.height)/2);c._halo=1;IMG[k]=c;NPC_H[k]=h*2.2}
  BGR.vars={};
  for(const p of BGR_PIECES){const k=p[0],im=IMG[k];if(!im||!im.width||p[3]!=='t'&&k!=='bl_grow_3'&&k!=='bl_grow_2')continue;
    IMG[k+'_f']=mk(im,true);IMG[k+'_d']=mk(im,false,'brightness(.5) contrast(1.18) saturate(.8)');IMG[k+'_df']=mk(im,true,'brightness(.46) contrast(1.2) saturate(.75)');IMG[k+'_p']=mk(im,false,'brightness(1.32) saturate(.55) contrast(.95)');IMG[k+'_pf']=mk(im,true,'brightness(1.3) saturate(.55) contrast(.95)');
    for(const sx of ['_f','_d','_df','_p','_pf'])NPC_H[k+sx]=NPC_H[k];BGR.vars[k]=1}}
function bgrArt(){
  if(BGR._art)return;BGR._art=1;try{bgrVariants()}catch(e){console.error('bgr variants',e)}
  const s=IMG.wm_mush_cluster||IMG.hgt_mushrooms;if(s&&s.width){const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');try{x.filter='saturate(.25) brightness(1.15) sepia(.2)'}catch(e){}x.drawImage(s,0,0);IMG.bl_grow_ring=c}
  bgrNpcs()}
/* which wall tiles are windows: every ohTiles() set is wrapped so that make() remembers the kind of each tile (gid -> kind) */
const BGR_WIN={};
/* painted buildings: where the windows are in the picture, [across 0..1, height 0..1 from the foot, key, scale] */
const BGR_BWIN={
  bl_church:[[.14,.6,'bl_win_b',.9],[.14,.18,'bl_win_b',.9],[.57,.18,'bl_win_b',.9],[.72,.17,'bl_win_b',.9],[.87,.17,'bl_win_b',.9]],
  bl_hall:[[.18,.19,'bl_win_a',1.1],[.82,.19,'bl_win_a',1.1]]};
BGR_BWIN.wl_bldg1_0=BGR_BWIN.bl_church;BGR_BWIN.wl_bldg1_1=BGR_BWIN.bl_hall;
if(typeof ohTiles==='function'){const _ot=ohTiles;ohTiles=function(){const T=_ot.apply(this,arguments);try{if(T&&T.make&&!T._bw){T._bw=1;const m=T.make;T.make=function(kind){const r=m.apply(this,arguments);try{if(r&&r.gid!==undefined&&(kind==='window'||kind==='window2'||kind==='gwin'))BGR_WIN[r.gid]=kind}catch(e){}return r}}}catch(e){}return T}}
/* LIT WINDOWS. blWindowGlow(L,o) adds a warm lit window picture to level L (call it from any zone file after the level exists).
   On a wall face: o={x,y,wd:[dx,dy]} where (x,y) is the OPEN cell in front of the wall and wd points from it to the wall; optional k ('bl_win_a' casement, 'bl_win_b' tall church window, 'bl_win_c' round), bob (height of the centre in squares, default 1.5).
   On a painted building (a picture, not wall cells): o={x,y,ox,oy,k,bob,sc} with no wd: a picture that stands in front, x+.5+ox, y+.5+oy. Returns the decor. */
function blWindowGlow(L,o){
  const k=o.k||'bl_win_a';if(!IMG[k]||!L||!L.decor)return null;
  const d=o.wd?{k,x:o.x,y:o.y,wd:[o.wd[0],o.wd[1]],pic:1,hx:1,block:false,walk:true,deco:true,bob:o.bob!==undefined?o.bob:(o.cy===undefined?BGR.winCy:o.cy)-(NPC_H[k]||.5)/2,_win:1}
    :{k,x:o.x,y:o.y,block:false,walk:true,deco:true,bob:o.bob!==undefined?o.bob:(o.cy===undefined?1.2:o.cy)-(NPC_H[k]||.5)/2*(o.sc||1),sc:o.sc||1,ox:o.ox||0,oy:o.oy||0,_win:1};
  L.decor.push(d);return d}
const bgrRng=seed=>{let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}};
const bgrVn=(x,y,cs,sd)=>{const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(hash2(i,j,sd)*(1-sx)+hash2(i+1,j,sd)*sx)*(1-sy)+(hash2(i,j+1,sd)*(1-sx)+hash2(i+1,j+1,sd)*sx)*sy};
/* the paths of a level: kit levels remember theirs (see the wrap of blKit.finish below); the hill and Sale are read from their ground and street tables */
function bgrPaths(L,id,W,H){
  const s=new Set(L._bgrPath||[]);
  if(!L._bgrPath){
    if(id===9670){for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.fmap[y][x];if(c==='2'||c==='3'||c==='4')s.add(x+','+y)}}
    else if(typeof SA!=='undefined'&&id===SA.ID){if(SA.street)for(const k of SA.street)s.add(k);if(typeof SA_SQ!=='undefined')for(let y=SA_SQ.y0-1;y<=SA_SQ.y1+1;y++)for(let x=SA_SQ.x0-1;x<=SA_SQ.x1+1;x++)s.add(x+','+y)}
    else for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.fmap[y][x];if(c==='3'||c==='4')s.add(x+','+y)}}
  return s}
function bgrEntries(L,id){
  const e=[[L.start.x,L.start.y]];
  const p=typeof blPlaceOf==='function'&&blIs(id)?blPlaceOf(id):null;if(p&&p.id===id){if(p.fromE)e.push([p.fromE.x,p.fromE.y]);if(p.fromW)e.push([p.fromW.x,p.fromW.y])}
  if(id===9670&&typeof VT!=='undefined'&&VT.arrive){for(const k of ['east','west'])if(VT.arrive[k])e.push([VT.arrive[k].x,VT.arrive[k].y])}
  if(typeof SA!=='undefined'&&id===SA.ID&&SA.ROAD)e.push([SA.ROAD.x,SA.ROAD.y]);
  return e}
const BGR_STRUCT=/fence|stone|lean|cross|tomb|crypt|chapel|hut|urn|obelisk|column|angel|slab|rail|bench|cart|barrel|crate|tent|well|post|sign|bell|barrow|hatch|mound|brazier|fountain|gibbet|coffin|hay|oqstuff|mile|lych|banner/;
/* rectangles kept clear of growths: [x0,y0,x1,y1] */
const BGR_CLEAR={9660:[[17,5,71,47]],9700:[[44,0,58,200]]};
const BGR_CFG={default:{dens:1,solidPath:1},9670:{dens:.9,solidPath:2},600:{dens:.5,solidPath:2,budget:170},9660:{dens:1,solidPath:2},9650:{dens:1.05,solidPath:1}};
function bgrScatter(L,id){
  const W=L.rows[0].length,H=L.rows.length,T=TERRS[id],cfg=Object.assign({},BGR_CFG.default,BGR_CFG[id]||{}),rnd=bgrRng(id*131+17);
  const N=W*H,idx=(x,y)=>y*W+x;
  const base=new Uint8Array(N);   // walkable ground (no wall, no water)
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]==='.'&&!(T&&T.block&&T.block[idx(x,y)]))base[idx(x,y)]=1;
  const blk=new Uint8Array(N);for(const d of L.decor)if(d.block&&!d.found&&d.x>=0&&d.y>=0&&d.x<W&&d.y<H)blk[idx(d.x,d.y)]=1;
  const pass=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&base[idx(x,y)]&&!blk[idx(x,y)];
  const wide=(x,y)=>{if(!pass(x,y))return false;
    for(let ox=-1;ox<=0;ox++)for(let oy=-1;oy<=0;oy++){const a=x+ox,b=y+oy;if(pass(a,b)&&pass(a+1,b)&&pass(a,b+1)&&pass(a+1,b+1))return true}return false};
  const flood=entries=>{const seen=new Uint8Array(N),q=[];for(const [x,y] of entries){if(pass(x,y)&&!seen[idx(x,y)]){seen[idx(x,y)]=1;q.push(idx(x,y))}}
    for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[idx(nx,ny)]||!pass(nx,ny))continue;seen[idx(nx,ny)]=1;q.push(idx(nx,ny))}}return seen};
  const entries=bgrEntries(L,id),R0=flood(entries);
  const wide0=new Uint8Array(N);for(let y=0;y<H;y++)for(let x=0;x<W;x++)wide0[idx(x,y)]=wide(x,y)?1:0;
  // what is protected: doors and gates (and 2 squares round), people and every talking or wall picture, items, entries, spawns (1 square)
  const prot=new Uint8Array(N),occ=new Uint8Array(N),targets=[],gates=[];
  const stamp=(x,y,r)=>{for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<W&&ny<H)prot[idx(nx,ny)]=1}};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.rows[y][x];if(c==='.')continue;const g=L.chars&&L.chars[c];if(g!==undefined&&(KH_DOOR[g]||(typeof g==='number'&&g>=30&&g<100))){stamp(x,y,2);targets.push([x,y]);if(KH_DOOR[g])gates.push([x,y])}}
  for(const d of L.decor){if(d.x<0||d.y<0||d.x>=W||d.y>=H)continue;occ[idx(d.x,d.y)]=1;if(d.npc||d.deco===false||d.wd||d.pic||d.cloudid){stamp(d.x,d.y,2);targets.push([d.x,d.y])}}
  for(const it of L.items||[])if(it&&it.x!==undefined){stamp(it.x,it.y,2);occ[idx(it.x,it.y)]=1;targets.push([it.x,it.y])}
  for(const e of L.enemies||[]){stamp(e.x,e.y,1);occ[idx(e.x,e.y)]=1}
  for(const [x,y] of entries){stamp(x,y,2);occ[idx(x,y)]=1;gates.push([x,y])}
  const gateD=(x,y)=>{let m=99;for(const g of gates){const d=Math.max(Math.abs(g[0]-x),Math.abs(g[1]-y));if(d<m)m=d}return m};
  // paths and the distance from them
  const paths=bgrPaths(L,id,W,H),pd=new Uint8Array(N).fill(99),q=[];
  for(const k of paths){const [x,y]=k.split(',').map(Number);if(x>=0&&y>=0&&x<W&&y<H){pd[idx(x,y)]=0;q.push(idx(x,y))}}
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0,dd=pd[c];if(dd>=6)continue;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H)continue;if(pd[idx(nx,ny)]>dd+1){pd[idx(nx,ny)]=dd+1;q.push(idx(nx,ny))}}}
  // ground that can take a plant
  const isSale=typeof SA!=='undefined'&&id===SA.ID;
  const okFm=c=>isSale?(c==='2'||c==='3'):id===9670?(c==='0'||c==='1'):(c==='0'||c==='1'||c==='2'||c==='5');
  const clear=BGR_CLEAR[id]||[];
  // spatial index of decor for the structure test
  const sidx=new Map();for(const d of L.decor)if(d.block&&BGR_STRUCT.test(d.k)){const k=(d.x>>2)+','+(d.y>>2);(sidx.get(k)||sidx.set(k,[]).get(k)).push(d)}
  const structCount=(x,y)=>{let n=0;for(let a=(x-2)>>2;a<=(x+2)>>2;a++)for(let b=(y-2)>>2;b<=(y+2)>>2;b++){const l=sidx.get(a+','+b);if(l)for(const d of l)if(Math.abs(d.x-x)<=2&&Math.abs(d.y-y)<=2)n++}return n};
  const cand=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=idx(x,y);if(!base[i]||blk[i]||prot[i]||occ[i]||pd[i]===0)continue;if(!okFm(L.fmap[y][x]))continue;
    let inClear=false;for(const r of clear)if(x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3])inClear=true;if(inClear)continue;
    const D=bgrVn(x,y,8,id)*.65+bgrVn(x,y,3.2,id+5)*.35,pf=pd[i]===1?.55:pd[i]===2?.85:1;
    const pr=Math.max(0,Math.min(1,(D-.42)/.3))*pf*cfg.dens;if(rnd()<pr)cand.push([x,y,D,rnd()])}
  cand.sort((a,b)=>a[3]-b[3]);
  const budget=Math.min(cfg.budget||BGR.MAX,BGR.MAX),mine=new Map(),added=[];let nS=0,nW=0;
  const pieces=BGR_PIECES.filter(p=>IMG[p[0]]);if(!pieces.length)return;
  const nearKey=(k,x,y)=>{for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(mine.get((x+a)+','+(y+b))===k)return true;return false};
  for(const [x,y,D] of cand){
    if(added.length>=budget)break;const i=idx(x,y);if(blk[i]||occ[i])continue;
    if(structCount(x,y)>=2)continue;
    // pick a piece: trees in the thick of a wood, growths at its edge
    const wantT=D>.6?.72:.4;let list=pieces.filter(p=>!nearKey(p[0],x,y)&&!(p[0]==='bl_grow_1'&&gateD(x,y)<=12));if(!list.length)continue;
    const pool=list.filter(p=>(p[3]==='t')===(rnd()<wantT));const use=pool.length?pool:list;let tot=0;for(const p of use)tot+=p[4];let r=rnd()*tot,pc=use[0];for(const p of use){r-=p[4];if(r<=0){pc=p;break}}
    const solid=!!pc[2];
    if(solid){
      if(pd[i]<cfg.solidPath)continue;
      // no corridor narrower than 2 is made: every cell beside this one that had a free 2x2 square must still have one
      const before=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)before.push(wide(x+a,y+b));
      blk[i]=1;let ok=true,n=0;for(let a=-1;a<=1&&ok;a++)for(let b=-1;b<=1;b++){if(!(a||b))continue;if(before[n++]&&!wide(x+a,y+b)){ok=false;break}}
      if(!ok){blk[i]=0;continue}}
    let key=pc[0];
    if(BGR.vars&&BGR.vars[key]){const tone=bgrVn(x,y,5,id+9),v=(tone>.56&&D>.45)?'d':(tone<.32||(pd[i]<=2&&rnd()<.4))?'p':'',fl=rnd()<.5;if(v||fl)key=key+'_'+v+(fl?'f':'')}
    const rs=rnd(),sc=pc[3]==='t'?(rs<.12?.62+rnd()*.15:rs>.86?1.3+rnd()*.3:.85+rnd()*.35):.85+rnd()*.35,d={k:key,x,y,block:solid,sc:+sc.toFixed(2),ox:+((rnd()-.5)*.2).toFixed(2),oy:+((rnd()-.5)*.2).toFixed(2),_bgr:1};
    if(!solid){d.walk=true;d.deco=true}
    else if(BGR_TEXT[pc[0]]&&rnd()<.2){d.k=pc[0];d.npc='bgr_x_'+pc[0];d.solid=1;d.deco=false}
    L.decor.push(d);added.push(d);mine.set(x+','+y,pc[0]);occ[i]=1;if(solid)nS++;else nW++}
  const fixAll=()=>{
    // no walled-in tree: a blocking piece (ours or the level's) with all four neighbours blocked is a pocket nobody can stand beside; one of OUR pieces round it goes (or the piece itself if it is ours)
    for(let ps=0;ps<60&&!window.__BGR_NOPOCKET;ps++){let fix=null;
      for(const d of L.decor){if(!d.block||d.found||d.x<0||d.y<0||d.x>=W||d.y>=H)continue;
        const nb=[[1,0],[-1,0],[0,1],[0,-1]];if(nb.some(([a,b])=>pass(d.x+a,d.y+b)))continue;
        // only a piece that is not already off the map edge counts as a pocket
        const mineN=added.filter(m=>m.block&&nb.some(([a,b])=>m.x===d.x+a&&m.y===d.y+b));
        if(mineN.length)fix=mineN[(mineN.length*rnd())|0];else if(d._bgr)fix=d;
        if(fix)break}
      if(!fix)break;
      blk[idx(fix.x,fix.y)]=0;L.decor.splice(L.decor.indexOf(fix),1);const j=added.indexOf(fix);if(j>=0)added.splice(j,1);nS--}

  // the flood fill: nothing that could be reached before may be cut off; a piece beside a lost square or a lost target is taken away
  for(let ps=0;ps<8;ps++){
    const R1=flood(entries);let bad=[];
    for(let c=0;c<N;c++)if(R0[c]&&!R1[c]&&base[c]&&!blk[c])bad.push(c);
    for(const [x,y] of targets){const c=idx(x,y);if(!R0[c]&&![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>x+a>=0&&y+b>=0&&x+a<W&&y+b<H&&R0[idx(x+a,y+b)]))continue;
      if(!(R1[c]||[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>x+a>=0&&y+b>=0&&x+a<W&&y+b<H&&R1[idx(x+a,y+b)])))bad.push(c)}
    if(!bad.length)break;
    const kill=new Set();for(const c of bad){const x=c%W,y=(c/W)|0;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)kill.add((x+a)+','+(y+b))}
    let gone=0;for(let j=added.length-1;j>=0;j--){const d=added[j];if(d.block&&kill.has(d.x+','+d.y)){blk[idx(d.x,d.y)]=0;L.decor.splice(L.decor.indexOf(d),1);added.splice(j,1);nS--;gone++}}
    if(!gone)break}
  // a piece taken away above can leave a neighbour that was accepted because of it: every square that had a free 2 by 2 square at the start must still have one
  for(let ps=0;ps<40;ps++){let hit=null;
    for(let y=0;y<H&&!hit;y++)for(let x=0;x<W;x++)if(wide0[idx(x,y)]&&pass(x,y)&&!wide(x,y)){hit=[x,y];break}
    if(!hit)break;let gone=false;
    for(let j=added.length-1;j>=0&&!gone;j--){const d=added[j];if(d.block&&Math.abs(d.x-hit[0])<=1&&Math.abs(d.y-hit[1])<=1){blk[idx(d.x,d.y)]=0;L.decor.splice(L.decor.indexOf(d),1);added.splice(j,1);nS--;gone=true}}
    if(!gone)break}
  };
  fixAll();fixAll();fixAll();
  // ---- extras that never block anything: undergrowth round the trees, bramble arches over the road, moss on walls, lit windows
  let nU=0,nA=0,nM=0,nWn=0;
  try{if(window.__BGR_NOEXTRA)throw 0;
    const under=['bl_grass0','bl_grass1','bl_grass2','bl_grass3','ww_twig2','bl_grow_4','bl_grow_ring'].filter(k=>IMG[k]),took=new Set();
    if(under.length&&!isSale)for(const t of added.slice()){if(!t.block||!/bl_twist|bl_grow_5|bl_canker/.test(t.k)||rnd()>.62)continue;
      for(let n=1+(rnd()<.4?1:0);n>0&&nU<120;n--){const a=((rnd()*3)|0)-1,b=((rnd()*3)|0)-1;if(!a&&!b)continue;const x=t.x+a,y=t.y+b;if(x<1||y<1||x>=W-1||y>=H-1)continue;const i=idx(x,y),tk=x+','+y;
        if(!base[i]||blk[i]||prot[i]||pd[i]===0||took.has(tk)||!okFm(L.fmap[y][x]))continue;took.add(tk);
        L.decor.push({k:under[(rnd()*under.length)|0],x,y,block:false,walk:true,deco:true,sc:+(.7+rnd()*.6).toFixed(2),ox:+((rnd()-.5)*.5).toFixed(2),oy:+((rnd()-.5)*.5).toFixed(2),_bgru:1});nU++}}
    // a bramble arch or two over the straight road, far from every gate, door and person
    if(IMG.bl_arch&&[9610,9620,9630,9640,9650,9680,9690].includes(id)){
      const cells=[...paths].map(k=>k.split(',').map(Number)).filter(([x,y])=>x>6&&y>6&&x<W-7&&y<H-7);
      const has=(x,y)=>paths.has(x+','+y),tgt=(x,y)=>{for(const g of targets)if(Math.abs(g[0]-x)<=7&&Math.abs(g[1]-y)<=7)return true;return false};
      const ok=cells.filter(([x,y])=>(has(x-2,y)&&has(x-1,y)&&has(x+1,y)&&has(x+2,y))&&gateD(x,y)>=10&&!tgt(x,y)&&!blk[idx(x,y)]&&!prot[idx(x,y)]&&!L.decor.some(d=>d.x===x&&d.y===y));
      const pick=[];for(let n=0;n<ok.length*3&&pick.length<2;n++){const c=ok[(rnd()*ok.length)|0];if(!pick.some(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])<22))pick.push(c)}
      for(const [x,y] of pick){L.decor.push({k:'bl_arch',x,y,block:false,walk:true,deco:true,sc:1,_bgru:1});nA++}}
    // moss on the foot of walls and lit windows in the wall tiles
    const wallG=(x,y)=>{const c=L.rows[y][x];return c==='.'?undefined:(L.chars&&L.chars[c])};
    const faces=[[1,0],[-1,0],[0,1],[0,-1]],wp=new Set();
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const g=wallG(x,y);if(g===undefined)continue;
      const wk=BGR_WIN[g],isDoor=!!KH_DOOR[g];
      for(const [a,b] of faces){const nx=x+a,ny=y+b,i=idx(nx,ny),fk=nx+','+ny+','+a+','+b;
        if(!base[i]||blk[i]||wp.has(fk))continue;
        if(wk&&IMG.bl_win_a){const lit=(id===9630||id===9680)?.8:.55;if(rnd()<lit){const k=(id===9630||id===9680)&&IMG.bl_win_b?'bl_win_b':'bl_win_a';
          if(nWn<110){blWindowGlow(L,{x:nx,y:ny,wd:[-a,-b],k,cy:BGR.winCy});wp.add(fk);nWn++;if(wk==='gwin'&&IMG.bl_win_c&&rnd()<.25){blWindowGlow(L,{x:nx,y:ny,wd:[-a,-b],k:'bl_win_c',cy:BGR.winLo});nWn++}}}}
        else if(!isDoor&&IMG.bl_moss&&nM<46&&!prot[i]&&rnd()<.09){L.decor.push({k:'bl_moss',x:nx,y:ny,wd:[-a,-b],pic:1,hx:1,block:false,walk:true,deco:true,bob:.22,_bgru:1});wp.add(fk);nM++}}}
    // painted buildings (a picture over a hidden block: the churches, the chapter house): lit windows standing in front of the picture, at the painted windows
    for(const e of (L.sky||[])){if(!e.big)continue;const m=BGR_BWIN[e.k],im=IMG[e.k];if(!m||!im||!im.width)continue;const hh=e.w*im.height/im.width;
      for(const q of m){if(!IMG[q[2]])continue;const wx=e.x+(q[0]-.5)*e.w,wy=e.y+.15,x=Math.floor(wx),y=Math.floor(wy);if(blWindowGlow(L,{x,y,ox:wx-x-.5,oy:wy-y-.5,k:q[2],cy:q[1]*hh,sc:q[3]||1}))nWn++}}
  }catch(e){console.error('bgr extras',e)}
  BGR.stats[id]={under:nU,arch:nA,moss:nM,win:nWn,n:added.length,solid:nS,walk:nW,cand:cand.length};L._bgrStats=BGR.stats[id];return added.length}
function bgrEnsure(id){
  const L=LEVELS[id];if(!L||L._bgr||!L.rows||!L.decor)return;
  if(window.__BGR_OFF){L._bgr=2;return}
  L._bgr=1;try{bgrArt();bgrScatter(L,id)}catch(e){console.error('bgr '+id,e)}}
/* ---------- the hooks ---------- */
// the kit remembers the paths of each level it builds (C.path is the set that C.pth and the gates fill)
{const _bk=blKit;blKit=function(){const C=_bk.apply(this,arguments);try{const f=C.finish;C.finish=function(){const lv=f.apply(this,arguments);try{lv._bgrPath=new Set(C.path)}catch(e){}return lv}}catch(e){console.error('bgr kit',e)}return C}}
// the ten main places and the Barrow Hill: wrapped last, so that every other pass (polish, notes, quest pieces) has run before the growths are scattered round what they put there
for(const id of [9610,9620,9630,9640,9650,9660,9670,9680,9690,9700]){const o=KH_LAZY[id];if(o)KH_LAZY[id]=function(){const r=o.apply(this,arguments);try{bgrEnsure(id)}catch(e){console.error(e)}return r}}
// Sale (its builder is called again until its pictures are ready, and it returns true once the level exists)
if(typeof saBuild==='function'){const _sb=saBuild;saBuild=function(){const r=_sb.apply(this,arguments);try{if(typeof SA!=='undefined')bgrEnsure(SA.ID)}catch(e){console.error(e)}return r}}
