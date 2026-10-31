/* ==========================================================================
   EARLY POLISH (prefix ep / EP). The early game (the crypts below the Abbey, Thornwick, the first woods, roads, caves and Ironhill) and the deserts get the
   second floor's finishing kit, but kept grimy: painted walls and floors, floor decals (straw, droppings, puddles, soot, cracks, bones), soft ambient
   occlusion where floor meets wall, soft irregular borders between floor types, warm pools under torches, contact shadows under props, a few painted
   props, neighbour-aware variety of repeated sprites, and a per-level grade that keeps the dirt and never brightens.
   Everything is opt-in per level through EP_SPEC; a level without an entry looks exactly as before. Layouts, routes, enemies and items never change:
   new pieces are appended to a level's decor (never inserted), never block, and never stand on a square that something else uses.
   Art: assets/ep/ (tools/ep_ingest.py cuts the Gemini sheets kept in ART-HOLD/ep), listed in assets/ep/list.json, loaded only when a level needs it.
   ========================================================================== */
const EP_EXTRA={tex_beams:'assets/ps/tex_beam_ceiling.jpg'};
const EP={list:null,loading:null,img:{},wall:null,walls:{},on:0,lv:0};
/* heights in squares of the painted props */
const EP_H={ep_firewood:.5,ep_haybale:.55,ep_trough:.42,ep_dung:.42,ep_wheel:.6,ep_flour:.55,ep_bench:.42,ep_rainbarrel:.62,ep_veg:.42,ep_sacks:.62,ep_crate:.55,ep_rubble:.4,ep_ratnest:.3,ep_bucket:.34,ep_chair:.42,ep_bonepile:.42,ep_planks:.95,ep_jar:.42};
function epLoad(){if(EP.loading)return EP.loading;
  EP.loading=fetch('assets/ep/list.json?v='+VERSION).then(r=>r.json()).then(L=>{for(const k in EP_EXTRA)L[k]={file:'../../'+EP_EXTRA[k]};EP.list=L;return Promise.all(Object.keys(L).map(k=>new Promise(res=>{const i=new Image();i.onload=()=>{IMG['ep_'+k]=i;if(EP_H['ep_'+k])NPC_H['ep_'+k]=EP_H['ep_'+k];res()};i.onerror=()=>res();i.src=(L[k].file.startsWith('../../')?L[k].file.slice(6):'assets/ep/'+L[k].file)+'?v='+VERSION})))}).then(()=>{EP.ready=1;try{epApply(LEVEL,1)}catch(e){console.error('ep apply',e)}}).catch(e=>{console.error('ep load',e);EP.ready=1});
  return EP.loading}
/* a painted swatch as a 128x128 texture, graded (k: [r,g,b] gain, sat, an optional darker band at the foot of a wall) */
function epTex(key,o){o=o||{};const im=IMG[key];if(!im||!im.width)return null;const c=document.createElement('canvas');c.width=c.height=TS;const x=c.getContext('2d');if(o.flip){x.translate(TS,0);x.scale(-1,1)}x.drawImage(im,0,0,TS,TS);x.setTransform(1,0,0,1,0,0);const d=x.getImageData(0,0,TS,TS),a=d.data,g=o.k||[1,1,1],s=o.sat===undefined?1:o.sat;
  for(let i=0;i<a.length;i+=4){const py=(i>>2)/TS|0;let r=a[i],gg=a[i+1],b=a[i+2];const l=r*.3+gg*.59+b*.11;r=l+(r-l)*s;gg=l+(gg-l)*s;b=l+(b-l)*s;let f=1;if(o.blot){const px=(i>>2)%TS;f*=1-o.blot*Math.max(0,Math.sin(px*.07+o.seed)*Math.sin(py*.05-o.seed*1.7)+Math.sin(px*.19+py*.11+o.seed*3)*.35)}if(o.foot){const t=(py/TS-(1-o.foot[0]))/o.foot[0];if(t>0)f*=1-o.foot[1]*t*t}if(o.top){const t=1-py/TS/o.top[0];if(t>0)f*=1-o.top[1]*t*t}a[i]=r*g[0]*f;a[i+1]=gg*g[1]*f;a[i+2]=b*g[2]*f}
  return a}
/* the stone and brick walls (and their torches) are swapped for painted ones while the party is in a level that asks for it, and put back when it leaves */
function epWallSet(name,stone,brick){if(EP.walls[name])return EP.walls[name];if(!stone)return null;const W={};
  W.stone=addTex(stone);W.tstone=TEX.length;for(const f of torchFrames(stone))addTex(f.d,f.e);W.tstoneR=TEX.length;for(const f of torchFrames(stone,true))addTex(f.d,f.e);
  const b=brick||stone;W.door=addTex(warpTex(doorTex(stone,false),13,3.2));W.lock=addTex(warpTex(doorTex(stone,true),14,3.2));{const ex=exitTex(stone);W.exit=addTex(warpTex(ex.d,15,3.2),warpTex(ex.e,15,3.2))}
  W.brick=addTex(b);W.tbrick=TEX.length;for(const f of torchFrames(b))addTex(f.d,f.e);W.tbrickR=TEX.length;for(const f of torchFrames(b,true))addTex(f.d,f.e);
  return EP.walls[name]=W}
function epSwapWalls(W){
  if(EP.wall&&EP.wall!==W){[T_STONE,T_TORCH_STONE,T_TORCH_STONE_R,T_BRICK,T_TORCH_BRICK,T_TORCH_BRICK_R,T_DOOR,T_LOCK,T_EXIT]=EP.save;EP.wall=null}
  if(W&&!EP.wall){EP.save=[T_STONE,T_TORCH_STONE,T_TORCH_STONE_R,T_BRICK,T_TORCH_BRICK,T_TORCH_BRICK_R,T_DOOR,T_LOCK,T_EXIT];T_DOOR=W.door;T_LOCK=W.lock;T_EXIT=W.exit;T_STONE=W.stone;T_TORCH_STONE=W.tstone;T_TORCH_STONE_R=W.tstoneR;T_BRICK=W.brick;T_TORCH_BRICK=W.tbrick;T_TORCH_BRICK_R=W.tbrickR;EP.wall=W}}
/* soft shadows and warm glows, made in code (light, not props) */
function epBlob(key,col,a0,soft){if(IMG[key])return key;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,`rgba(${col},${a0})`);g.addColorStop(soft||.55,`rgba(${col},${a0*.45})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(0,0,128,128);IMG[key]=c;return key}
/* the floor detail of a level: decals in a grimy palette, contact shadows under pieces, warm pools under torches (the f2 decal format, drawn by the floor pass) */
function epDecals(n,S){const L=LEVELS[n],W=MW,H=MH,hs=(x,y,s)=>hash2(x,y,s+n*13),keys=[],kix={},ki=k=>{if(kix[k]===undefined){kix[k]=keys.length;keys.push(k)}return kix[k]};
  const inst=[],cell=new Int32Array(W*H).fill(-1),cell2=new Int32Array(W*H).fill(-1);
  const add=(k,cx,cy,sz,rot,a,mip)=>{const i=inst.length/8;inst.push(cx,cy,Math.cos(rot),Math.sin(rot),1/sz,ki(k),a===undefined?1:a,mip||7);return i};
  const put=(i,x,y)=>{if(x<0||y<0||x>=W||y>=H)return;const j=y*W+x;if(cell[j]<0){cell[j]=i;cell2[j]=i}else if(cell2[j]===cell[j])cell2[j]=i;else{cell[j]=cell2[j];cell2[j]=i}};
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&G.grid[y][x]===0;
  const D=S.decals,[lo,hi]=D.sz||[.4,.8];
  const fm=G.fmap;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!open(x,y)||(D.keep&&D.keep(x,y)))continue;const fc=fm?fm.charCodeAt(y*W+x)-48:0,list=(D.on&&D.on[fc])||D.keys;if(!list||!list.length)continue;
    let nw=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(!open(x+a,y+b))nw++;const p=(D.p||.4)*(1+(D.wallBias||0)*nw);
    for(let layer=0;layer<2;layer++){if(hs(x,y,301+layer*7)>=p*(layer?.55:1))continue;
      const sz=lo+(hi-lo)*hs(x,y,302+layer*7),rot=hs(x,y,303+layer*7)*6.283,h=sz*.5*(Math.abs(Math.cos(rot))+Math.abs(Math.sin(rot))),cx=x+.15+.7*hs(x,y,304+layer*7),cy=y+.15+.7*hs(x,y,305+layer*7);
      const k='ep_dc_'+list[(hs(x,y,306+layer*7)*list.length)|0];if(!IMG[k])continue;const di=add(k,cx,cy,sz,rot,(D.a||.92)*(.85+.15*hs(x,y,307)));put(di,x,y);for(let yy=Math.floor(cy-h);yy<=Math.floor(cy+h);yy++)for(let xx=Math.floor(cx-h);xx<=Math.floor(cx+h);xx++)if((xx!==x||yy!==y)&&open(xx,yy))put(di,xx,yy)}}
  const big=(k,bx,by,sz,a)=>{const i=add(k,bx,by,sz,0,a,12),R=sz*.71;for(let y=Math.floor(by-R);y<=Math.floor(by+R);y++)for(let x=Math.floor(bx-R);x<=Math.floor(bx+R);x++){if(x<0||y<0||x>=W||y>=H)continue;const j=y*W+x;cell2[j]=cell[j];cell[j]=i}};
  for(const b of S.big||[])big('ep_dc_'+b.k,b.x,b.y,b.sz,b.a);
  return {keys,tx:keys.map(()=>null),cell,cell2,f:new Float32Array(inst),far:D.far||14,g:D.gain||[1,1,1]}}
/* ambient occlusion and soft floor borders: a mask per square of which sides (and corners) touch a wall, read by the floor pass (opt-in: LEVELS[n]._epf) */
function epFloorFx(n,S){const W=MW,H=MH,wb=new Uint8Array(W*H),open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&G.grid[y][x]===0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!open(x,y))continue;let m=0;if(!open(x,y-1))m|=1;if(!open(x+1,y))m|=2;if(!open(x,y+1))m|=4;if(!open(x-1,y))m|=8;
    if(!open(x-1,y-1))m|=16;if(!open(x+1,y-1))m|=32;if(!open(x+1,y+1))m|=64;if(!open(x-1,y+1))m|=128;wb[y*W+x]=m}
  const N=new Float32Array(64*64);for(let j=0;j<64;j++)for(let i=0;i<64;i++){N[j*64+i]=(Math.sin(i*.41+j*.17)*.5+Math.sin(i*.13-j*.37+1.3)*.3+(hash2(i,j,77)-.5)*.5)}
  /* a light map per square, mixed between squares when drawn: soft shade pools under pieces (contact shadows), warm pools under torches and lamps */
  const sh=new Float32Array(W*H*3).fill(1);let any=0;
  const pool=(px,py,r,f)=>{for(let y=Math.max(0,Math.floor(py-r)-1);y<=Math.min(H-1,Math.ceil(py+r));y++)for(let x=Math.max(0,Math.floor(px-r)-1);x<=Math.min(W-1,Math.ceil(px+r));x++){const d=Math.hypot(x+.5-px,y+.5-py)/r;if(d>=1)continue;const t=1-d*d;f(y*W+x,t*t);any=1}};
  if(S.shadow!==0)for(const d of G.decor){if(d.npc||d.pic||d.wd||d.hidden||d.k==='teleporter'||d.roof)continue;const k=(S.shadow||.4)*(d.block?1:.85);pool(d.x+.5+(d.ox||0),d.y+.5+(d.oy||0),(S.shadowSz||1.1)*(d.sc||1),(i,t)=>{const m=1-k*t;sh[i*3]*=m;sh[i*3+1]*=m;sh[i*3+2]*=m})}
  if(S.shadow!==0)for(const it of G.items||[]){if(it.taken)continue;pool(it.x+.5,it.y+.5,.5,(i,t)=>{const m=1-.3*t;sh[i*3]*=m;sh[i*3+1]*=m;sh[i*3+2]*=m})}
  if(S.glow){const gc=S.glowCol||[1.0,.62,.3];for(const l of LIGHTS){if(l.out)continue;pool(l.x,l.y,S.glowSz||2.6,(i,t)=>{sh[i*3]+=S.glow*gc[0]*t;sh[i*3+1]+=S.glow*gc[1]*t;sh[i*3+2]+=S.glow*gc[2]*t})}}
  return {wb,ao:S.ao===undefined?.5:S.ao,aoW:S.aoW||.42,soft:S.soft||0,N,sh:any?sh:null}}
/* the grade: f2Grade's contrast, saturation, tone and vignette, per level */
function epApply(n,late){const S=self.EP_OFF?null:EP_SPEC[n],L=LEVELS[n];
  if(!S){epSwapWalls(null);return}
  if(!EP.ready){epLoad();return}
  if(S.walls){const W=epWallSet(S.walls.name,epTex('ep_tex_'+S.walls.stone,S.walls.so),S.walls.brick?epTex('ep_tex_'+S.walls.brick,S.walls.bo):null);epSwapWalls(W)}else epSwapWalls(null);
  if(S.floor){const nm='ep_'+S.floor.name;if(!FLOORS[nm]){const d=epTex('ep_tex_'+S.floor.tex,S.floor.o);if(d)FLOORS[nm]=d}if(FLOORS[nm])G.fl=FLOORS[nm]}
  if(S.fvar&&!G.fmap){const fl=[];for(const v of S.fvar){const nm='ep_'+v.name;if(!FLOORS[nm]){const d=epTex('ep_tex_'+v.tex,v.o);if(d)FLOORS[nm]=d}fl.push(FLOORS[nm])}
    if(fl.every(Boolean)){const a=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const nz=Math.sin(x*.55+y*.21+n)*.5+Math.sin(y*.47-x*.18+n*2.3)*.35+(hash2(x,y,n*5+11)-.5)*.5;let c=48;for(let j=0;j<S.fvar.length;j++)if(nz>S.fvar[j].at)c=49+j;a.push(String.fromCharCode(c))}
      G.fmap=a.join('');G.fl2=fl[0];G.fl3=fl[1]||fl[0];G.fl4=fl[2]||fl[0]}}
  if(S.ceil){const nm='ep_'+S.ceil.name;if(!CEILS[nm]){const d=epTex(S.ceil.img||('ep_tex_'+S.ceil.tex),S.ceil.o);if(d)CEILS[nm]=d}if(CEILS[nm])G.cl=CEILS[nm]}
  if(S.vary)epVary(n,S.vary);
  if(S.pics&&!G.decor.some(d=>d.epPic))epWallPics(n,S.pics);
  if(S.street&&!G.decor.some(d=>d.epSt))epStreet(n,S.street);
  if(S.decals)L._f2dec=epDecals(n,S);
  L._epf=epFloorFx(n,S);
  if(S.walls&&S.walls.vars&&EP.wall){const W=EP.wall;if(!W.wv){W.wv={};for(const g of [1,2]){const v=S.walls.vars[g];if(!v)continue;const ids=[g===1?W.stone:W.brick];for(const t of v){const d=epTex('ep_tex_'+t.tex,t.o||(g===1?S.walls.so:S.walls.bo));if(d)ids.push(addTex(d))}W.wv[g]=ids}}L._epf.wv=W.wv}
  if(S.grade)F2GRADE[n]=S.grade;
  if(S.amb!==undefined)G.amb=Math.max(G.amb||0,S.amb);
  if(S.warmRed)for(const l of LIGHTS)if(l.red){l.red=false;l.col=S.warmRed}}
/* painted details on the walls (cobwebs high in corners, moss and damp at the foot, chains, soot, a shelf): flush with plain stone or brick faces that have no torch, a door or anything else on them, appended to the decor of this visit only */
function epWallPics(n,P){const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,taken=new Set(G.decor.filter(d=>d.wd).map(d=>d.x+','+d.y+','+d.wd));
  const F=[[0,-1,2],[1,0,3],[0,1,0],[-1,0,1]];let cnt=0;const near=[];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y))continue;for(const [dx,dy,face] of F){const wx=x+dx,wy=y+dy,g=G.grid[wy]&&G.grid[wy][wx];if(!(g===1||g===2||(P.walls&&P.walls.includes(g))))continue;
    if(torchAt.get((wy*MW+wx)*4+face)||taken.has(x+','+y+','+[dx,dy]))continue;const h=hash2(x*4+face,y,n*17+3);if(h>=(P.p||.3))continue;
    let opts=P.keys.filter(k=>IMG['ep_'+k.k]);const side=open(x-dy,y+dx)&&open(x+dy,y-dx)?0:1; // corner pieces want a corner beside them
    opts=opts.filter(k=>!k.corner||side);if(!opts.length)continue;let k=opts[(hash2(x*4+face,y,n*17+4)*opts.length)|0];if(near.some(q=>q[2]===k.k&&Math.abs(q[0]-x)+Math.abs(q[1]-y)<4))k=opts[(opts.indexOf(k)+1)%opts.length];
    near.push([x,y,k.k]);NPC_H['ep_'+k.k]=k.h;G.decor.push({k:'ep_'+k.k,x,y,wd:[dx,dy],pic:1,bob:k.bob,block:false,deco:true,epPic:1,loot:false,shop:false});cnt++}}
  return cnt}
/* street clutter for a town: on grass or dirt beside a house wall (never on the road, never in a lane between two walls, never by a door), turned to the wall, never blocking */
function epStreet(n,P){const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,fm=G.fmap,okF=P.on||'1',used=new Set();
  for(const d of G.decor)used.add(Math.round(d.x)+','+Math.round(d.y));for(const e of G.enemies||[])used.add(e.x+','+e.y);for(const i of G.items||[])used.add(i.x+','+i.y);
  const house=g=>g>=100&&!(typeof KH_DOOR!=='undefined'&&KH_DOOR[g]),door=g=>(g>=3&&g<=5)||(g>=15&&g<100)||(g>=100&&typeof KH_DOOR!=='undefined'&&KH_DOOR[g]);
  const blk=new Set(G.decor.filter(d=>d.block&&!d.npc&&(!P.fenceRe||P.fenceRe.test(d.k))).map(d=>d.x+','+d.y));const placed=[];const ks=P.keys.filter(k=>IMG['ep_'+k]);if(!ks.length)return;
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y)||used.has(x+','+y)||(fm&&!okF.includes(fm[y*MW+x])))continue;
    const g=(a,b)=>G.grid[y+b][x+a],anc=(a,b)=>house(g(a,b))||(P.fence&&blk.has((x+a)+','+(y+b))),N=anc(0,-1),S=anc(0,1),E=anc(1,0),Wt=anc(-1,0);if(!(N||S||E||Wt)||(N&&S)||(E&&Wt))continue;
    let bad=false;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if(door(g(a,b)))bad=true;if(bad)continue;
    if(placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<(P.gap||3)))continue;if(hash2(x,y,n*37+1)>=(P.p||.4))continue;
    const nb=placed.filter(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<8).map(p=>p[2]);let k=ks[(hash2(x,y,n*37+2)*ks.length)|0];for(let t=0;t<ks.length&&nb.includes(k);t++)k=ks[(ks.indexOf(k)+1)%ks.length];
    placed.push([x,y,k]);G.decor.push({k:'ep_'+k,x,y,block:false,deco:true,epSt:1,loot:false,shop:false,ox:E?.28:Wt?-.28:(hash2(x,y,9)-.5)*.3,oy:S?.28:N?-.28:(hash2(x,y,8)-.5)*.3,sc:+(.85+hash2(x,y,n*37+3)*.3).toFixed(2)})}}
/* neighbour-aware variety: a repeated key gets one of its painted variants so that no two neighbours show the same picture (visual only) */
function epVary(n,V){const seen=new Map();for(const d of G.decor){const v=V[d.k];if(!v||d.npc)continue;const near=new Set();for(const e of G.decor){if(e===d||Math.abs(e.x-d.x)>1||Math.abs(e.y-d.y)>1)continue;near.add(e.k)}
  const opts=[d.k].concat(v).filter(k=>IMG[k]);let pick=opts[(hash2(d.x,d.y,n*7+3)*opts.length)|0];for(let t=0;t<opts.length&&near.has(pick);t++)pick=opts[(opts.indexOf(pick)+1)%opts.length];d.k=pick}}
/* new painted props: appended to the level's decor once (so saved decor numbers never move), never blocking */
function epProps(n,S){const L=LEVELS[n];if(self.EP_OFF||!S||L._epProps||(!S.props&&!S.auto))return;L._epProps=1;for(const p of S.props||[])L.decor.push(Object.assign({deco:true,block:false},p,{k:'ep_'+p.k}));if(S.auto)epAutoProps(n,S.auto)}
/* props tucked into room corners: a square with walls on two touching sides, inside a room (not a passage), away from doors, and with nothing else on it */
function epAutoProps(n,A){const L=LEVELS[n],R=L.rows,H=R.length,W=R[0].length,op=A.open||(c=>c==='.'),open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&op(R[y][x]),wallC=A.wall||(c=>c==='#'||c==='%');
  const used=new Set();for(const a of [L.enemies||[],L.items||[],L.decor||[]])for(const o of a)used.add(Math.round(o.x)+','+Math.round(o.y));used.add(L.start.x+','+L.start.y);
  const near=(x,y,r,f)=>{for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){const yy=y+b,xx=x+a;if(yy>=0&&xx>=0&&yy<H&&xx<W&&f(R[yy][xx],xx,yy))return true}return false};
  const placed=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!open(x,y)||used.has(x+','+y))continue;
    const N=!open(x,y-1)&&wallC(R[y-1][x]),S=!open(x,y+1)&&wallC(R[y+1][x]),E=!open(x+1,y)&&wallC(R[y][x+1]),Wt=!open(x-1,y)&&wallC(R[y][x-1]);
    if(!((N||S)&&(E||Wt)))continue;if((N&&S)||(E&&Wt))continue;
    let o=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if(open(x+a,y+b))o++;if(o<4)continue; // a passage, not a room corner
    if(near(x,y,1,c=>!op(c)&&!wallC(c)))continue; // beside a door, stair or gate
    if(near(x,y,1,(c,xx,yy)=>used.has(xx+','+yy)&&!(xx===x&&yy===y)&&(L.items||[]).some(i=>i.x===xx&&i.y===yy)))continue; // never crowd an item
    if(placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<3))continue;
    if(hash2(x,y,n*31+5)>=(A.p||.6))continue;
    const ks=A.keys,nb=placed.filter(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<7).map(p=>p[2]);let k=ks[(hash2(x,y,n*31+6)*ks.length)|0];for(let t=0;t<ks.length&&nb.includes(k);t++)k=ks[(ks.indexOf(k)+1)%ks.length];
    placed.push([x,y,k]);L.decor.push({k:'ep_'+k,x,y,deco:true,block:false,ox:(E?.26:Wt?-.26:0),oy:(S?.26:N?-.26:0),sc:+(.85+hash2(x,y,n*31+7)*.3).toFixed(2)})}}
{const _ll=loadLevel;loadLevel=function(n){try{epProps(n,EP_SPEC[n])}catch(e){console.error('ep props',e)}const r=_ll.apply(this,arguments);try{if(EP_SPEC[n])epLoad();epSwapWalls(null)}catch(e){console.error(e)}return r}}
{const _dw=drawWorld;drawWorld=function(){try{if(typeof LEVEL!=='undefined'&&(EP.cur!==LEVEL||EP.gd!==G.decor||EP.rd!==EP.ready)){EP.cur=LEVEL;EP.gd=G.decor;EP.rd=EP.ready;epApply(LEVEL)}}catch(e){console.error('ep',e)}return _dw.apply(this,arguments)}}
/* a big painted piece right in front of the party thins out instead of filling the view with a blurred close-up (opt-in: S.nearFade) */
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);const S=typeof LEVEL!=='undefined'&&!self.EP_OFF&&EP_SPEC[LEVEL];if(!S||!S.nearFade||!G.C)return L;const a=G.C.a||0,cx=G.C.x+.5-Math.cos(a)*.28,cy=G.C.y+.5-Math.sin(a)*.28;
  for(const s of L){const d=s.decor;if(!d||d.npc||s.e||s.pic||s.hang||!s.img||!s.img.width||/chest|sign|lamp|gate|door/.test(String(d.k)))continue;const h=s.w*s.img.height/s.img.width;if(h<1.05&&s.w<1.1)continue;
    const ds=Math.hypot(s.x-cx,s.y-cy),thr=Math.max(1.5,.5+.45*Math.max(h,s.w));if(ds>=thr)continue;const f=Math.max(.2,Math.min(1,(ds-.55)/(thr-.55)));s.fade=s.fade===undefined?f:Math.min(s.fade,f)}
  return L}}
const EP_GRIME=['straw','droppings','puddle','soot','crack','rubble','bones','damp','shards','rag','grain','mud','pebbles','wax'];
const EP_SPEC={
  /* the crypts below the Abbey: the starting dungeon */
  1:{walls:{name:'crypt',stone:'cryptwall',so:{k:[.7,.66,.6],sat:.78,foot:[.34,.62],top:[.2,.4]},brick:'cellarbrick',bo:{k:[.74,.68,.64],sat:.5,foot:[.34,.65],top:[.2,.4]},
       vars:{1:[{tex:'cryptroots'},{tex:'cryptdamp'},{tex:'cryptwall',o:{k:[.6,.57,.52],sat:.7,foot:[.38,.7],top:[.22,.45],flip:1,blot:.35,seed:1.3}},{tex:'cryptroots',o:{k:[.62,.59,.54],sat:.7,foot:[.36,.66],top:[.2,.4],flip:1,blot:.3,seed:2.1}}],
             2:[{tex:'cellarbrick',o:{k:[.58,.52,.5],sat:.45,foot:[.4,.75],top:[.22,.5],flip:1,blot:.45,seed:.7}},{tex:'cellarbrick',o:{k:[.66,.6,.56],sat:.4,foot:[.34,.6],top:[.2,.4],blot:.4,seed:2.6}}]}},
     fvar:[{name:'cryptearth',tex:'earthfloor',o:{k:[.72,.66,.58],sat:.7},at:.38},{name:'cryptflagdk',tex:'flagfloor',o:{k:[.62,.58,.54],sat:.6,flip:1,blot:.4,seed:1.9},at:.62}],soft:.38,
     ceil:{name:'cryptbeams',img:'ep_tex_beams',o:{k:[.9,.82,.72],sat:.6}},
     floor:{name:'cryptfloor',tex:'flagfloor',o:{k:[.8,.75,.68],sat:.7}},
     decals:{keys:['straw','droppings','soot','crack','rubble','bones','damp','shards','rag','grain','pebbles','straw','wax'],p:.85,wallBias:.5,sz:[.55,1.05],far:14,gain:[1.08,1,.9],a:1},
     shadow:.65,glow:.5,glowSz:3.2,glowCol:[1,.6,.32],ao:.8,aoW:.55,
     grade:{c:1.1,s:.84,b:1.05,tone:[150,110,70,.12],vig:.4,vc:[10,7,4]},amb:.07,warmRed:[1.5,.62,.34],
     pics:{p:.32,keys:[{k:'web_corner',h:.42,bob:.76,corner:1},{k:'web_hang',h:.5,bob:.7},{k:'chains',h:.55,bob:.55},{k:'moss',h:.2,bob:.1},{k:'moss',h:.2,bob:.1},{k:'ring',h:.16,bob:.45},{k:'soot',h:.5,bob:.6},{k:'damp',h:.75,bob:.48},{k:'damp',h:.75,bob:.48},{k:'shelf',h:.3,bob:.5},{k:'planks_x',h:.4,bob:.4}]},
     auto:{keys:['sacks','crate','rubble','ratnest','bucket','bonepile','planks','jar'],p:.75}},
  /* Thornwick: the first town (one main road through a forest clearing) */
  3:{decals:{keys:['leaves','pebbles','droppings'],on:{0:['mud','straw','droppings','puddle','pebbles','leaves','soot'],1:['leaves','pebbles','droppings','straw'],2:['mud','straw','droppings','pebbles','puddle','leaves'],3:['mud','leaves','straw'],4:['mud','straw','soot','droppings'],5:['mud','puddle','straw']},p:.5,sz:[.5,1.0],far:16,gain:[1,.95,.85],a:.95},
     soft:.42,shadow:.42,shadowSz:1.25,ao:.55,aoW:.5,nearFade:1,
     grade:{c:1.08,s:.82,b:1.0,tone:[140,110,80,.12],vig:.36,vc:[12,10,8]},
     street:{keys:['firewood','haybale','dung','wheel','flour','rainbarrel','veg','sacks','crate','bucket'],p:.5,gap:3,on:'12',fence:1,fenceRe:/^(fence|ptree|gtree|pjuniper|pbracken|grocks|gboulder|well)/}}
};
setTimeout(()=>{try{epLoad()}catch(e){}},4000); // the early polish pictures are small: fetch them soon after the start, so every first visit has them
