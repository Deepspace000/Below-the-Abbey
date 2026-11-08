/* ==========================================================================
   EARLY POLISH (prefix ep / EP). The early game (the crypts below the Abbey, Thornwick, the first woods, roads, caves and Ironhill) and the deserts get the
   second floor's finishing kit, but kept grimy: painted walls and floors, floor decals (straw, droppings, puddles, soot, cracks, bones), soft ambient
   occlusion where floor meets wall, soft irregular borders between floor types, warm pools under torches, contact shadows under props, a few painted
   props, neighbour-aware variety of repeated sprites, and a per-level grade that keeps the dirt and never brightens.
   Everything is opt-in per level through EP_SPEC; a level without an entry looks exactly as before. Layouts, routes, enemies and items never change:
   new pieces are appended to a level's decor (never inserted), never block, and never stand on a square that something else uses.
   Art: assets/ep/ (tools/ep_ingest.py cuts the Gemini sheets kept in ART-HOLD/ep), listed in assets/ep/list.json, loaded only when a level needs it.
   ========================================================================== */
const EP_EXTRA={tex_beams:'assets/ps/tex_beam_ceiling.jpg',f2_de_palm:'assets/ps/f2_de_palm.webp',f2_dv_doum:'assets/ps/f2_dv_doum.webp',f2_dv_tamarisk:'assets/ps/f2_dv_tamarisk.webp',f2_dv_acacia:'assets/ps/f2_dv_acacia.webp',f2_de_column:'assets/ps/f2_de_column.webp',f2_de_shard:'assets/ps/f2_de_shard.webp',f2_de_pillar:'assets/ps/f2_de_pillar.webp',f2_dx_ribs:'assets/ps/f2_dx_ribs.webp',f2_dx_stele:'assets/ps/f2_dx_stele.webp',f2_dx_oxskull:'assets/ps/f2_dx_oxskull.webp',f2_dx_jars:'assets/ps/f2_dx_jars.webp',f2_de_skull:'assets/ps/f2_de_skull.webp',f2_de_amphora:'assets/ps/f2_de_amphora.webp',f2_de_cairn:'assets/ps/f2_de_cairn.webp',f2_de_shrub:'assets/ps/f2_de_shrub.webp',f2_dv_boulders:'assets/ps/f2_dv_boulders.webp'};
self.EP_TORCH={1:2,501:2,8:2,9:2,11:2,12:2,18:2,23:2,25:2}; // the painted wall torch (engine hook in render3D), opt-in per level
const EP={list:null,loading:null,img:{},wall:null,walls:{},on:0,lv:0};
/* heights in squares of the painted props */
const EP_H={ep_orecart:.6,ep_coalheap:.32,ep_coalsacks:.5,ep_toolrack:.72,ep_anvil:.5,ep_orecrate:.5,ep_brazier:.5,ep_sarc_dk:.55,ep_barrel2:.62,ep_crates2:.85,ep_sarc:.55,ep_candles:.28,ep_lantern:.42,ep_skel_slump:.62,ep_chest_s:.45,ep_potrubble:.32,ep_f2_de_palm:3.8,ep_f2_dv_doum:3.2,ep_f2_dv_tamarisk:2.8,ep_f2_dv_acacia:2.8,ep_f2_de_column:3.0,ep_f2_de_shard:0.5,ep_f2_de_pillar:3.2,ep_f2_dx_ribs:1.4,ep_f2_dx_stele:1.1,ep_f2_dx_oxskull:0.8,ep_f2_dx_jars:1.3,ep_f2_de_skull:0.5,ep_f2_de_amphora:0.6,ep_f2_de_cairn:0.6,ep_f2_de_shrub:0.8,ep_f2_dv_boulders:1.3,ep_firewood:.4,ep_haybale:.55,ep_trough:.42,ep_dung:.42,ep_wheel:.6,ep_flour:.55,ep_bench:.42,ep_rainbarrel:.62,ep_veg:.34,ep_sacks:.62,ep_crate:.55,ep_rubble:.4,ep_ratnest:.3,ep_bucket:.34,ep_chair:.42,ep_bonepile:.42,ep_planks:.95,ep_jar:.42,ep_tw_tiki:.6};
function epLoad(){if(EP.loading)return EP.loading;
  EP.loading=fetch('assets/ep/list.json?v='+VERSION).then(r=>r.json()).then(L=>{for(const k in EP_EXTRA)L[k]={file:'../../'+EP_EXTRA[k]};EP.list=L;return Promise.all(Object.keys(L).map(k=>new Promise(res=>{const i=new Image();i.onload=()=>{IMG['ep_'+k]=i;if(EP_H['ep_'+k])NPC_H['ep_'+k]=EP_H['ep_'+k];res()};i.onerror=()=>res();i.src=(L[k].file.startsWith('../../')?L[k].file.slice(6):'assets/ep/'+L[k].file)+'?v='+VERSION})))}).then(()=>{try{const mo=IMG.ep_moss;if(mo&&mo.width&&!mo._ep){const c=document.createElement('canvas');c.width=mo.width;c.height=mo.height;const x=c.getContext('2d');x.filter='saturate(.3) sepia(.45) hue-rotate(35deg) brightness(.78)';x.drawImage(mo,0,0);c._ep=1;IMG.ep_moss=c}}catch(e){} // the moss band: dull damp grey-green, no pink
  try{for(const [src,dst,f] of [['bones','ep_bones_dk','brightness(.5) sepia(.4) saturate(.75)'],['coffin','ep_coffin_dk','brightness(.58) sepia(.6) saturate(.9)'],['ep_sarc','ep_sarc_dk','brightness(.66) sepia(.55) saturate(.9)']]){if(IMG[src]&&!IMG[dst]){const im=IMG[src],c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.filter=f;x.drawImage(im,0,0);IMG[dst]=c;if(NPC_H[src])NPC_H[dst]=NPC_H[src]}}}catch(e){}EP.ready=1;try{if(G.state==='play'&&G.grid)epApply(LEVEL,1)}catch(e){console.error('ep apply',e)}}).catch(e=>{console.error('ep load',e);EP.ready=1});
  return EP.loading}
/* a painted swatch as a 128x128 texture, graded (k: [r,g,b] gain, sat, an optional darker band at the foot of a wall) */
function epTex(key,o){o=o||{};const im=IMG[key];if(!im||!im.width)return null;const c=document.createElement('canvas');c.width=c.height=TS;const x=c.getContext('2d');if(o.flip){x.translate(TS,0);x.scale(-1,1)}if(o.soft)x.filter=`blur(${o.soft}px) contrast(${o.con||.86})`;x.drawImage(im,0,0,TS,TS);x.filter='none';x.setTransform(1,0,0,1,0,0);const d=x.getImageData(0,0,TS,TS),a=d.data,g=o.k||[1,1,1],s=o.sat===undefined?1:o.sat;
  let mL=0;if(o.match){for(let i=0;i<a.length;i+=4)mL+=a[i]*.3+a[i+1]*.59+a[i+2]*.11;mL/=a.length/4}
  for(let i=0;i<a.length;i+=4){const py=(i>>2)/TS|0;let r=a[i],gg=a[i+1],b=a[i+2];const l=r*.3+gg*.59+b*.11;if(o.match){const q=l/mL,M=o.match;r=M[0]*q*.85+(r-l)*.15+l*.0;gg=M[1]*q*.85+(gg-l)*.15;b=M[2]*q*.85+(b-l)*.15}else{r=l+(r-l)*s;gg=l+(gg-l)*s;b=l+(b-l)*s}let f=1;if(o.blot){const px=(i>>2)%TS;f*=1-o.blot*Math.max(0,Math.sin(px*.07+o.seed)*Math.sin(py*.05-o.seed*1.7)+Math.sin(px*.19+py*.11+o.seed*3)*.35)}if(o.foot){const t=(py/TS-(1-o.foot[0]))/o.foot[0];if(t>0)f*=1-o.foot[1]*t*t}if(o.top){const t=1-py/TS/o.top[0];if(t>0)f*=1-o.top[1]*t*t}a[i]=r*g[0]*f;a[i+1]=gg*g[1]*f;a[i+2]=b*g[2]*f;if(o.win){const px=(i>>2)%TS,W_=o.win,ux=o.flip?1-px/TS:px/TS,vy=py/TS;if(ux>W_[0]&&ux<W_[2]&&vy>W_[1]&&vy<W_[3]&&l<60){const cx_=(ux-(W_[0]+W_[2])/2)/(W_[2]-W_[0]),cy_=(vy-(W_[1]+W_[3])/2)/(W_[3]-W_[1]),w=W_[4]*(1-l/60)*Math.max(0,1-(cx_*cx_+cy_*cy_)*2.2)*(.65+.35*hash2(px,py,5));a[i]+=120*w;a[i+1]+=72*w;a[i+2]+=22*w}}}   // a dim amber glow behind the dark panes
  return a}
/* the stone and brick walls (and their torches) are swapped for painted ones while the party is in a level that asks for it, and put back when it leaves */
function epFlame(id0,t){if(!t)return;for(let f=0;f<FLAME_FRAMES;f++){const T=TEX[id0+f];if(!T||!T.e)continue;const e=T.e;for(let i=0;i<e.length;i+=4){e[i]*=t[0]*t[3];e[i+1]*=t[1]*t[3];e[i+2]*=t[2]*t[3]}}}
function epWallSet(name,stone,brick){if(EP.walls[name])return EP.walls[name];if(!stone)return null;const W={};
  W.stone=addTex(stone);W.tstone=TEX.length;for(const f of torchFrames(stone))addTex(f.d,f.e);W.tstoneR=TEX.length;for(const f of torchFrames(stone,true))addTex(f.d,f.e);
  const b=brick||stone;W.door=addTex(warpTex(doorTex(stone,false),13,3.2));W.lock=addTex(warpTex(doorTex(stone,true),14,3.2));{const ex=exitTex(stone),ee=warpTex(ex.e,15,3.2);if(ee)for(let i=0;i<ee.length;i+=4){ee[i]*=.36;ee[i+1]*=.27;ee[i+2]*=.17}const ed=warpTex(ex.d,15,3.2);for(let i=0;i<ed.length;i+=4){const l=ed[i]*.3+ed[i+1]*.59+ed[i+2]*.11;if(l>60){const k=.32+.4*(60/l);ed[i]*=k;ed[i+1]*=k*.94;ed[i+2]*=k*.82}}W.exit=addTex(ed,null)} // the way out glows warm and dim, not white
  W.brick=addTex(b);W.tbrick=TEX.length;for(const f of torchFrames(b))addTex(f.d,f.e);W.tbrickR=TEX.length;for(const f of torchFrames(b,true))addTex(f.d,f.e);
  return EP.walls[name]=W}
function epSwapWalls(W){
  if(EP.wall&&EP.wall!==W){[T_STONE,T_TORCH_STONE,T_TORCH_STONE_R,T_BRICK,T_TORCH_BRICK,T_TORCH_BRICK_R,T_DOOR,T_LOCK,T_EXIT]=EP.save;EP.wall=null}
  if(W&&!EP.wall){EP.save=[T_STONE,T_TORCH_STONE,T_TORCH_STONE_R,T_BRICK,T_TORCH_BRICK,T_TORCH_BRICK_R,T_DOOR,T_LOCK,T_EXIT];T_DOOR=W.door;T_LOCK=W.lock;T_EXIT=W.exit;T_STONE=W.stone;T_TORCH_STONE=W.tstone;T_TORCH_STONE_R=W.tstoneR;T_BRICK=W.brick;T_TORCH_BRICK=W.tbrick;T_TORCH_BRICK_R=W.tbrickR;EP.wall=W}}

/* little patches of dungeon flowers GROWN out of the brick joints: a few copies of the early wall tiles with a tiny painted tuft (assets/ep/fl_0..9) set into the bottom mortar line, its colours pulled toward the wall's own tone and light, a soft contact shadow and a short dark crack and roots under it */
function epFlowerTile(src,im,i,s){const T=TS,r=k=>hash2(i*7+s,k,1303),out=new Uint8ClampedArray(src),asp=im.width/im.height;
  let hp=T*(.08+.055*r(1)),wp=hp*asp;if(wp>T*.27){wp=T*.27;hp=wp/asp}if(hp<6){hp=6;wp=hp*asp}
  const w=Math.max(4,Math.round(wp)),h=Math.max(4,Math.round(hp));let xc=(s?.5+.4*r(2):.1+.4*r(2))*T;xc=Math.max(w/2+3,Math.min(T-w/2-3,xc));
  const xa=Math.max(0,Math.floor(xc-w/2-4)),xb=Math.min(T-1,Math.ceil(xc+w/2+4)),lum=(x,y)=>{const q=(y*T+x)*4;return out[q]*.3+out[q+1]*.59+out[q+2]*.11};
  const m=[];for(let y=0;y<T;y++){let a=0;for(let x=xa;x<=xb;x++)a+=lum(x,y);m.push(a/(xb-xa+1))}
  let j=Math.round(T*.78),best=-1e9;for(let y=Math.round(T*.6);y<=Math.round(T*.9);y++){let b=0,c=0;for(let k=-6;k<=6;k++)if(m[y+k]!==undefined){b+=m[y+k];c++}const sc=b/c-m[y];if(sc>best){best=sc;j=y}} // the darkest course joint of the lower wall, against its own surroundings
  let cv=document.createElement('canvas'),cw=im.width,ch=im.height;cv.width=cw;cv.height=ch;cv.getContext('2d').drawImage(im,0,0);
  while(cw>w*2){const nw=Math.max(w,cw>>1),nh=Math.max(h,Math.round(ch*nw/cw)),c2=document.createElement('canvas');c2.width=nw;c2.height=nh;const x2=c2.getContext('2d');x2.imageSmoothingQuality='high';x2.drawImage(cv,0,0,nw,nh);cv=c2;cw=nw;ch=nh}
  const c3=document.createElement('canvas');c3.width=w;c3.height=h;const x3=c3.getContext('2d');x3.imageSmoothingQuality='high';x3.filter='blur(.35px)';x3.drawImage(cv,0,0,w,h);const sp=x3.getImageData(0,0,w,h).data;
  let wr=0,wg=0,wb=0,n=0;for(let y=Math.max(0,j-12);y<=Math.min(T-1,j+3);y++)for(let x=xa;x<=xb;x++){const q=(y*T+x)*4;wr+=out[q];wg+=out[q+1];wb+=out[q+2];n++}wr/=n;wg/=n;wb/=n;const wl=wr*.3+wg*.59+wb*.11,kL=Math.max(.8,Math.min(1.15,wl/65)),mix=.28+.12*r(3);
  const x0=Math.round(xc-w/2),y0=j-h+2,dk=(X,Y,f)=>{if(X<0||X>=T||Y<0||Y>=T)return;const q=(Y*T+X)*4;out[q]*=f;out[q+1]*=f;out[q+2]*=f}; // the foot dips a pixel into the joint
  const ph1=r(40)*6.28,ph2=r(41)*6.28;
  for(let y=j-5;y<=j+5;y++)for(let x=Math.floor(xc-w/2-5);x<=Math.ceil(xc+w/2+5);x++){const ang=Math.atan2((y-(j-1))*2.2,x-xc),rad=1+.28*Math.sin(ang*3+ph1)+.18*Math.sin(ang*7+ph2)+.2*(hash2(x,y,17)-.5),d=(((x-xc)/(w/2+5))**2+((y-(j-1))/5.2)**2)/(rad*rad);if(d<1)dk(x,y,1-.3*Math.pow(1-d,1.6)*(.8+.4*hash2(x,y,18)))} // an uneven soft blob of shade, not a band
  {const cr=(sx,len,wd0)=>{let cx=sx,cy=j+1,dir=(r(50+len)-.5)*.9;for(let t=0;t<len&&cy<T-1;t++){dir+=(hash2(t,len,19)-.5)*1.1;dir=Math.max(-1.6,Math.min(1.6,dir));cx+=dir*.7+Math.sin(t*.8+sx)*.45;cy+=(t%2===1?0:1);const wd=Math.max(0,wd0-t*.25+(hash2(t,sx|0,20)-.5)*.9),x=Math.round(cx);dk(x,cy,.66-.1*Math.min(1,wd/2));if(wd>1.3)dk(x+1,cy,.84)}};
    if(self.EP_FLCRACK)cr(xc+(r(4)-.5)*4,5+Math.round(r(5)*8),1.9)} // a cracked, wandering, thinning crack that forks, never a ruled line
  for(let k=0;k<3;k++){let rx=xc+(k-1)*w*(.12+.12*r(20+k)),ry=j+1;const ln=3+Math.round(r(22+k)*4),dr=(r(26+k)-.5)*1.4;for(let t=0;t<ln&&ry<T-1;t++){rx+=dr*.6+Math.sin(t*1.3+k*2)*.5;ry+=(t%2?1:0)+(t===0?1:0);const q=(ry*T+Math.round(rx))*4,f=Math.max(.1,.45-t*.1);out[q]=out[q]*(1-f)+30*f;out[q+1]=out[q+1]*(1-f)+34*f;out[q+2]=out[q+2]*(1-f)+22*f}} // thin curved roots that fade as they go in
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const q0=(y*w+x)*4;let a=sp[q0+3]/255;if(a<.03)continue;a=Math.pow(a,1.25)*.94;if(a<.95)a*=.45+.9*hash2(x*5+i,y*3+s,21);a=Math.min(1,a*(.86+.2*hash2(x+9,y+i,22)));const X=x0+x,Y=y0+y;if(X<0||X>=T||Y<0||Y>=T)continue;
    let R=sp[q0],G=sp[q0+1],B=sp[q0+2];const l=R*.3+G*.59+B*.11;R=l+(R-l)*.86;G=l+(G-l)*.86;B=l+(B-l)*.86;R=(R*(1-mix)+wr*mix)*kL;G=(G*(1-mix)+wg*mix)*kL;B=(B*(1-mix)+wb*mix)*kL;const l2=R*.3+G*.59+B*.11,lo=wl*.78+10,hi=wl*1.5+20;if(l2>hi){const q=hi/l2;R*=q;G*=q;B*=q}else if(l2<lo&&l2>1){const q=Math.min(2.2,lo/l2);R*=q;G*=q;B*=q} // keep the tuft in the wall's own range of light: not glowing, not lost
    const q=(Y*T+X)*4;out[q]=out[q]*(1-a)+R*a;out[q+1]=out[q+1]*(1-a)+G*a;out[q+2]=out[q+2]*(1-a)+B*a}
  return out}
function epFlowerPool(W,g){W.fl=W.fl||{};const pl=self.EP_FLPLAIN?'p':'',KY=pl+g;if(W.fl[KY])return W.fl[KY];const bases=(W.wv&&W.wv[g])||[g===1?W.stone:W.brick],out=[];for(let i=0;i<10;i++){const im=IMG['ep_fl_'+i];if(!im||!im.width)continue;for(let s=0;s<2;s++){const b=bases[(i+s)%bases.length];if(!TEX[b]||!TEX[b].d)continue;out.push(addTex(pl?new Uint8ClampedArray(TEX[b].d):epFlowerTile(TEX[b].d,im,i,s)))}}return W.fl[KY]=out}
function epFlowerPlace(n,L){const W=EP.wall;if(!W||!L._epf||!IMG.ep_fl_0)return;const ct=L._epf.ct=L._epf.ct||new Map(),P={1:epFlowerPool(W,1),2:epFlowerPool(W,2)},put=new Set(),cand=[];let cnt=0;
  const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0;
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){const g=G.grid[y][x];if((g!==1&&g!==2)||!P[g].length)continue;if(!(open(x-1,y)||open(x+1,y)||open(x,y-1)||open(x,y+1)))continue;if(ct.has(y*MW+x)||(self.SR_CT&&SR_CT.has(y*MW+x)))continue;let tq=0;for(let f=0;f<4;f++)if(torchAt.has((y*MW+x)*4+f))tq=1;if(tq)continue;cand.push([hash2(x,y,977+n),x,y,g]);
    if(hash2(x,y,977+n)>1/8)continue;
    let adj=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&put.has((y+dy)*MW+x+dx))adj=1;if(adj)continue;
    const v=P[g],k=(hash2(x,y,978)*v.length)|0;ct.set(y*MW+x,v[k]);put.add(y*MW+x);cnt++}
  if(cnt<2&&cand.length>=4){cand.sort((p,q)=>p[0]-q[0]);for(const [h,x,y,g] of cand){if(cnt>=2)break;let adj=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(put.has((y+dy)*MW+x+dx))adj=1;if(adj)continue;const v=P[g];ct.set(y*MW+x,v[(hash2(x,y,978)*v.length)|0]);put.add(y*MW+x);cnt++}} // a small room still gets a couple
  L._epFl=cnt}
/* soft shadows and warm glows, made in code (light, not props) */
function epBlob(key,col,a0,soft){if(IMG[key])return key;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,`rgba(${col},${a0})`);g.addColorStop(soft||.55,`rgba(${col},${a0*.45})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(0,0,128,128);IMG[key]=c;return key}
/* the floor detail of a level: decals in a grimy palette, contact shadows under pieces, warm pools under torches (the f2 decal format, drawn by the floor pass) */
function epDecals(n,S){const L=LEVELS[n],W=MW,H=MH,hs=(x,y,s)=>hash2(x,y,s+n*13),keys=[],kix={},ki=k=>{if(kix[k]===undefined){kix[k]=keys.length;keys.push(k)}return kix[k]};
  const inst=[],cell=new Int32Array(W*H).fill(-1),cell2=new Int32Array(W*H).fill(-1);
  const add=(k,cx,cy,sz,rot,a,mip)=>{const i=inst.length/8;inst.push(cx,cy,Math.cos(rot),Math.sin(rot),1/sz,ki(k),a===undefined?1:a,mip||7);return i};
  const put=(i,x,y)=>{if(x<0||y<0||x>=W||y>=H)return;const j=y*W+x;if(cell[j]<0){cell[j]=i;cell2[j]=i}else if(cell2[j]===cell[j])cell2[j]=i;else{cell[j]=cell2[j];cell2[j]=i}};
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&G.grid[y][x]===0;
  const D=S.decals,lo=Math.min(.7,(D.sz||[.4,.8])[0]),hi=Math.min(.7,(D.sz||[.4,.8])[1]);
  const fm=G.fmap;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!open(x,y)||(D.keep&&D.keep(x,y)))continue;const fc=fm?fm.charCodeAt(y*W+x)-48:0;let list=(D.on&&D.on[fc])||D.keys;if(!list||!list.length)continue;
    let nw=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(!open(x+a,y+b))nw++;let p=(D.p||.4)*(1+(D.wallBias||0)*nw);
    if(D.path&&fm){const pc=c=>D.path.includes(c),me=pc(fm[y*W+x]);if(me){list=D.pathKeys||list;p=D.pathP||p}else{let near=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const xx=x+a,yy=y+b;if(xx>=0&&yy>=0&&xx<W&&yy<H&&pc(fm[yy*W+xx]))near=1}if(near&&D.verge){list=D.verge;p=D.vergeP||p}}}
    for(let layer=0;layer<(D.big?1:2);layer++){if(hs(x,y,301+layer*7)>=p*(layer?.55:1))continue;
      const sz=lo+(hi-lo)*hs(x,y,302+layer*7),rot=hs(x,y,303+layer*7)*6.283,h=sz*.5*(Math.abs(Math.cos(rot))+Math.abs(Math.sin(rot))),m=Math.min(.5,h),cx=x+m+(1-2*m)*hs(x,y,304+layer*7),cy=y+m+(1-2*m)*hs(x,y,305+layer*7);
      const k='ep_dc_'+list[(hs(x,y,306+layer*7)*list.length)|0];if(!IMG[k])continue;const di=add(k,cx,cy,sz,rot,(D.a||.92)*(.85+.15*hs(x,y,307)));put(di,x,y)}}
  if(D.big){const B=D.big,pl=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!open(x,y)||(D.keep&&D.keep(x,y))||hs(x,y,401)>=B.p)continue;const cx=x+.3+.4*hs(x,y,402),cy=y+.3+.4*hs(x,y,403);if(pl.some(q=>Math.hypot(q[0]-cx,q[1]-cy)<B.gap))continue;
      const sz=B.sz[0]+(B.sz[1]-B.sz[0])*hs(x,y,404),k='ep_dc_'+B.keys[(hs(x,y,405)*B.keys.length)|0];if(!IMG[k])continue;pl.push([cx,cy]);const di=add(k,cx,cy,sz,hs(x,y,406)*6.283,B.a||.95,12),R=sz*.72;
      for(let yy=Math.floor(cy-R);yy<=Math.floor(cy+R);yy++)for(let xx=Math.floor(cx-R);xx<=Math.floor(cx+R);xx++){if(xx<0||yy<0||xx>=W||yy>=H)continue;const j=yy*W+xx;if(cell[j]<0)cell[j]=di;cell2[j]=di}}}
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
  if(S.tintVar){const v=S.tintVar;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3,b=1+(hash2(x,y,91)-.5)*2*v,w=(hash2(x,y,92)-.5)*v;sh[i]*=b*(1+w*.6);sh[i+1]*=b;sh[i+2]*=b*(1-w*.8)}any=1}
  if(S.shadow!==0)for(const d of G.decor){if(d.npc||d.pic||d.wd||d.hidden||d.k==='teleporter'||d.roof)continue;const k=Math.min(.92,(S.shadow||.4)*(d.block?1:.95));pool(d.x+.5+(d.ox||0),d.y+.5+(d.oy||0),(S.shadowSz||1.1)*(d.sc||1),(i,t)=>{const m=1-k*t;sh[i*3]*=m;sh[i*3+1]*=m;sh[i*3+2]*=m})}
  if(S.shadow!==0)for(const it of G.items||[]){if(it.taken)continue;pool(it.x+.5,it.y+.5,.5,(i,t)=>{const m=1-.3*t;sh[i*3]*=m;sh[i*3+1]*=m;sh[i*3+2]*=m})}
  if(S.glow){const gc=S.glowCol||[1.0,.62,.3];for(const l of LIGHTS){if(l.out)continue;pool(l.x,l.y,S.glowSz||2.6,(i,t)=>{sh[i*3]+=S.glow*gc[0]*t;sh[i*3+1]+=S.glow*gc[1]*t;sh[i*3+2]+=S.glow*gc[2]*t})}}
  return {wb,sf:S.softFine?1:0,ao:S.ao===undefined?.5:S.ao,aoW:S.aoW||.42,soft:S.soft||0,N,sh:any?sh:null}}
/* the grade: f2Grade's contrast, saturation, tone and vignette, per level */
function epApply(n,late){const S=self.EP_OFF?null:EP_SPEC[n],L=LEVELS[n];EP._nl=L;
  if(!S){epSwapWalls(null);return}
  if(!EP.ready){epLoad();return}
  if(EP_SECRETS[n])epSecretsApply(n);
  if(S.walls){const W0=EP.walls[S.walls.name],W=epWallSet(S.walls.name,epTex('ep_tex_'+S.walls.stone,S.walls.so),S.walls.brick?epTex('ep_tex_'+S.walls.brick,S.walls.bo):null);if(W&&!W0&&S.flame){epFlame(W.tstone,S.flame);epFlame(W.tbrick,S.flame)}epSwapWalls(W)}else epSwapWalls(null);
  if(S.floor){const nm='ep_'+S.floor.name;if(!FLOORS[nm]){const d=epTex('ep_tex_'+S.floor.tex,S.floor.o);if(d)FLOORS[nm]=d}if(FLOORS[nm])G.fl=FLOORS[nm]}
  if(S.floors){const keys=['fl','fl2','fl3','fl4','fl5','fl6'];for(const i in S.floors){const v=S.floors[i],nm='ep_'+v.name;if(!FLOORS[nm]){const d=epTex('ep_tex_'+v.tex,v.o);if(d)FLOORS[nm]=d}if(FLOORS[nm])G[keys[+i]]=FLOORS[nm]}}
  if(S.fset&&!L._epFsetOn){const fl=[];for(const v of S.fset.tiles){const nm='ep_fs_'+v.tex+(v.tag||'');if(!FLOORS[nm]){const d=epTex('ep_tex_'+v.tex,v.o);if(d)FLOORS[nm]=d}fl.push(FLOORS[nm])}
    if(fl.every(Boolean)){const a=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)a.push(String.fromCharCode(48+S.fset.pick(x,y,n)));G.fmap=a.join('');G.fl=fl[0];G.fl2=fl[1];G.fl3=fl[2];G.fl4=fl[3];G.fl5=fl[4];G.fl6=fl[5];G.fl7=fl[6];L._fl7=fl[6]}}
  if(S.floorTint){L._ftint=L._ftint||{};const keys=['fl','fl2','fl3','fl4','fl5','fl6'];for(const i in S.floorTint){const kk=keys[+i],base=G[kk];if(!base)continue;let c=L._ftint[i];if(c&&base===c.d)continue;if(!c||c.src!==base){const t=S.floorTint[i],d=new Uint8ClampedArray(base);for(let q=0;q<d.length;q+=4){d[q]*=t[0];d[q+1]*=t[1];d[q+2]*=t[2]}c=L._ftint[i]={src:base,d}}G[kk]=c.d}} // the level's own floor, a little lighter (a path that reads), same hue
  if(S.track&&S.track.make&&!G.fmap&&G.fl){const T=S.track,a=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const nz=Math.sin(x*.61+y*.23+n)*.5+Math.sin(y*.53-x*.2+n*2.3)*.35+(hash2(x,y,n*5+11)-.5)*.6;a.push(T.make.rows.includes(y)||(T.make.cols||[]).includes(x)?'6':nz>(T.make.wetAt||.45)?'1':'0')}G.fmap=a.join('');const mk=t=>{const d=new Uint8ClampedArray(G.fl);for(let q=0;q<d.length;q+=4){d[q]*=t[0];d[q+1]*=t[1];d[q+2]*=t[2]}return d};G.fl2=mk(T.wet||[.8,.8,.76]);L._fl7=G.fl7=mk(T.tint)}   // a level with one ground gets a trodden track and darker wet patches
  if(S.track&&G.fmap&&G.fmap.indexOf('6')<0){const T=S.track,fm=G.fmap,W=MW,H=MH,at=(x,y)=>x>=0&&y>=0&&x<W&&y<H?fm[y*W+x]:'',isM=(x,y)=>at(x,y)===T.from,a=fm.split('');
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!isM(x,y))continue;let rx=1,ry=1;for(let k=1;k<4&&isM(x+k,y);k++)rx++;for(let k=1;k<4&&isM(x-k,y);k++)rx++;for(let k=1;k<4&&isM(x,y+k);k++)ry++;for(let k=1;k<4&&isM(x,y-k);k++)ry++;
      if(T.noNear){let nb=0;for(let b2=-1;b2<=1;b2++)for(let a2=-1;a2<=1;a2++)if(T.noNear.includes(at(x+a2,y+b2)))nb=1;if(nb)continue}
      if((T.rows&&T.rows.includes(y))||(T.cols&&T.cols.includes(x)&&rx<=6)||rx<=2||ry<=2)a[y*W+x]='6'}   // the trodden track: the narrow runs and the main road line through the open mud
    G.fmap=a.join('');const b=G[['fl','fl2','fl3','fl4','fl5','fl6'][T.base]];if(b){const t=T.tint,d=new Uint8ClampedArray(b);for(let q=0;q<d.length;q+=4){d[q]*=t[0];d[q+1]*=t[1];d[q+2]*=t[2]}L._fl7=G.fl7=d}}
  if(S.fvar&&!G.fmap){const fl=[];for(const v of S.fvar){const nm='ep_'+v.name;if(!FLOORS[nm]){const d=epTex('ep_tex_'+v.tex,v.o);if(d)FLOORS[nm]=d}fl.push(FLOORS[nm])}
    if(fl.every(Boolean)){const a=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const nz=Math.sin(x*.55+y*.21+n)*.5+Math.sin(y*.47-x*.18+n*2.3)*.35+(hash2(x,y,n*5+11)-.5)*.5;let c=48;for(let j=0;j<S.fvar.length;j++)if(nz>S.fvar[j].at)c=49+j;a.push(String.fromCharCode(c))}
      G.fmap=a.join('');G.fl2=fl[0];G.fl3=fl[1]||fl[0];G.fl4=fl[2]||fl[0]}}
  if(S.ceil){const nm='ep_'+S.ceil.name;if(!CEILS[nm]){const d=epTex(S.ceil.img||('ep_tex_'+S.ceil.tex),S.ceil.o);if(d)CEILS[nm]=d}if(CEILS[nm])G.cl=CEILS[nm]}
  if(S.vary)epVary(n,S.vary);
  if(S.jitter)for(const J of S.jitter)epJitter(n,J);
  if(S.pics&&!G.decor.some(d=>d.epPic))epWallPics(n,S.pics);
  if(S.hides&&!G.decor.some(d=>d.epHide))epHides(n,S.hides);
  if(S.street&&!G.decor.some(d=>d.epSt))epStreet(n,S.street);
  if(S.fixed&&!G.decor.some(d=>d.epFx))for(const [k,x,y,oy] of S.fixed){if(!IMG['ep_'+k]||!G.grid[y]||G.grid[y][x]!==0)continue;G.decor.push({k:'ep_'+k,x,y,block:false,walk:true,deco:true,loot:false,shop:false,epFx:1,oy:oy||0,ox:(hash2(x,y,71)-.5)*.3,sc:.85})}   // a few fixed pieces against the house fronts (never in the middle of the road)
  if(S.tufts&&!G.decor.some(d=>d.epTuft))epTufts(n,S.tufts);
  if(S.desert&&!G.decor.some(d=>d.epDes))epDesert(n,S.desert);
  if(EP_SECRETS[n])S.big=EP_SECRETS[n].map(q=>({k:'rubble',x:q.from[0]+.5+(q.door[0]-q.from[0])*.34,y:q.from[1]+.5+(q.door[1]-q.from[1])*.34,sz:.85,a:1}));
  if(S.decals)L._f2dec=epDecals(n,S);
  L._epf=epFloorFx(n,S);
  if(S.walls&&S.walls.vars&&EP.wall){const W=EP.wall;if(!W.wv){W.wv={};for(const g of [1,2]){const v=S.walls.vars[g];if(!v)continue;const ids=[g===1?W.stone:W.brick];for(const t of v){const d=epTex('ep_tex_'+t.tex,t.o||(g===1?S.walls.so:S.walls.bo));if(d)ids.push(addTex(d))}W.wv[g]=ids}}L._epf.wv=W.wv}
  if(S.walls&&EP.wall&&!self.EP_NOFL)epFlowerPlace(n,L);
  if(S.retile&&EP.wall&&EP.wall.wv&&EP.wall.wv[1]){if(!L._eptmR){L._eptmR=1;L._eptm=L._eptm||new Map();const vv=EP.wall.wv[1];let k=0;const seen=new Set();for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const g=G.grid[y][x];if(g<100||seen.has(g)||(typeof KH_DOOR!=='undefined'&&KH_DOOR[g]))continue;seen.add(g);const ti=T_TILE[g];if(ti!==undefined)L._eptm.set(ti,vv[1+(k++%(vv.length-1))])}}L._epf.tm=L._eptm}
  if(S.grime){if(!L._eptm||!L._eptmG){L._eptmG=1;L._eptm=L._eptm||new Map();const seen=new Set();for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const g=G.grid[y][x];if(seen.has(g))continue;seen.add(g);const por=g>=30&&g<100,ti=S.grime.only==='portal'?(por?(T_DOORS[(G.portals[g-30]||{}).tex]||T_DOORS.house):undefined):g>=100?(typeof KH_DOOR!=='undefined'&&KH_DOOR[g]?undefined:T_TILE[g]):(g>=9&&g<=14)||(g>=20&&g<=22)?T_WALL[g]:(g===7&&S.grime.gate)?T_GATE:(por&&S.grime.gate)?(T_DOORS[(G.portals[g-30]||{}).tex]||T_DOORS.house):undefined;if(ti===undefined||L._eptm.has(ti)||!TEX[ti]||!TEX[ti].d)continue;const nt=epGrime(ti,S.grime,g);if(nt!==null)L._eptm.set(ti,nt)}}L._epf.tm=L._eptm}
  if(S.night&&!L._epnD){L._epnD=1;L._eptm=L._eptm||new Map();for(const nm of Object.keys(EP_NDOOR)){const ti=T_DOORS[nm];if(ti===undefined||L._eptm.has(ti)||!TEX[ti]||!TEX[ti].d||!(G.portals||[]).some(q=>q.tex===nm))continue;const T=TEX[ti],nt=addTex(T.d,null);for(const k of Object.keys(T))if(k!=='d'&&k!=='e')TEX[nt][k]=T[k];L._eptm.set(ti,nt);epNightReg(L,nt,null,epNightTv(T.d,EP_NDOOR[nm],0),0)}L._epf.tm=L._eptm} // the lit panes of the shop, inn and hall doors
  if(S.tv){if(!L._eptv){const D=n===3?LEVEL3_DATA:n===13?LEVEL13_DATA:null,m=new Map();if(D&&D.chars)for(const q of S.tv){const ids=[],nwin=[];q.keys.forEach((k,i)=>{for(const fl of (q.keys.length>1?[0,1]:[0])){const d=epTex('ep_tex_'+k,Object.assign({seed:i*1.7+fl*5,flip:fl,win:q.win&&q.win[k]},q.o||{}));if(d){const id=addTex(d);ids.push(id);if(S.night&&EP_NWIN[k])nwin.push([ids.length-1,id,d,EP_NWIN[k],fl])}}});
      if(ids.length&&nwin.length){const l0=ids.length,all=ids.concat(ids,ids);for(const [j,id,d,W,fl] of nwin){const ne=epNightTv(d,W.slice(0,4),fl,W[4]);epNightReg(L,id,null,ne,0);const id2=addTex(d);all[2*l0+j]=id2;epNightReg(L,id2,null,ne,1)}ids.length=0;for(const v of all)ids.push(v)} // three runs of the same panels: the first two lit at night, the third dark, so a third of the windows stay unlit and the picture by day is unchanged (the pick is hash % length)
      if(ids.length)for(const c of q.chars){const g=D.chars[c];if(g!==undefined)m.set(g,ids)}}L._eptv=m}L._epf.tv=L._eptv}   // painted house walls (several panels, one picked per square)
  if(S.grade)F2GRADE[n]=S.grade;
  if(S.amb!==undefined)G.amb=Math.max(G.amb||0,S.amb);
  if(S.xlights)for(let k=0;k<S.xlights.length;k++){const q=S.xlights[k];if(!LIGHTS.some(l=>l.epX===k+1))LIGHTS.push({x:q[0],y:q[1],ph:k*1.7,key:-6000-k,taken:false,red:false,free:true,lamp:true,col:q[2],kI:q[3],range2:40,epX:k+1})}
  if(S.lightK)for(const l of LIGHTS)if(!l.epK){l.epK=1;l.kI=(l.kI||1)*S.lightK}
  if(S.lk)for(const d of G.decor){const v=S.lk[d.k];if(v&&!d.lk){const k=typeof v==='function'?v(d):v;if(k&&IMG[k])d.lk=k}}
  if(EP_SECRETS[n])epSecretsApply(n);
  if(S.warmRed)for(const l of LIGHTS)if(l.red){l.red=false;l.col=S.warmRed}}
/* the moss piece (greenish, hung at the wall foot) is never hung: the owner dislikes it. painted details on the walls (cobwebs high in corners, moss and damp at the foot, chains, soot, a shelf): flush with plain stone or brick faces that have no torch, a door or anything else on them, appended to the decor of this visit only */
function epWallPics(n,P){if(P.fixed)for(const [x,y,wd,k,h,bob] of P.fixed){if(k==='moss'||!IMG['ep_'+k])continue;NPC_H['ep_'+k]=h;G.decor.push({k:'ep_'+k,x,y,wd,pic:1,bob,block:false,deco:true,epPic:1,loot:false,shop:false})}const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,taken=new Set(G.decor.filter(d=>d.wd).map(d=>d.x+','+d.y+','+d.wd));
  const F=[[0,-1,2],[1,0,3],[0,1,0],[-1,0,1]];let cnt=0;const near=[];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y))continue;for(const [dx,dy,face] of F){const wx=x+dx,wy=y+dy,g=G.grid[wy]&&G.grid[wy][wx];if(!(g===1||g===2||(P.walls&&P.walls.includes(g))))continue;
    if(torchAt.get((wy*MW+wx)*4+face)||taken.has(x+','+y+','+[dx,dy])||(EP_SECRETS[n]&&EP_SECRETS[n].some(q=>q.door[0]===wx&&q.door[1]===wy)))continue;const h=hash2(x*4+face,y,n*17+3);if(h>=(P.p||.3))continue;
    let opts=P.keys.filter(k=>k.k!=='moss'&&IMG['ep_'+k.k]);const side=open(x-dy,y+dx)&&open(x+dy,y-dx)?0:1; // corner pieces want a corner beside them
    opts=opts.filter(k=>!k.corner||side);if(!opts.length)continue;let k=opts[(hash2(x*4+face,y,n*17+4)*opts.length)|0];if(near.some(q=>q[2]===k.k&&Math.abs(q[0]-x)+Math.abs(q[1]-y)<4))k=opts[(opts.indexOf(k)+1)%opts.length];
    near.push([x,y,k.k]);let kk=k.k,kh=k.h;if(kk==='web_hang'&&IMG.ep_web2_0){kk='web2_'+(hash2(x*4+face,y,n*17+5)<.5?0:1);kh=.58}else if(kk==='web_corner'&&IMG.ep_web2_2)kk='web2_2'; // the painted cobwebs: fine silk threads, not grey cloth
    NPC_H['ep_'+kk]=kh;G.decor.push({k:'ep_'+kk,x,y,wd:[dx,dy],pic:1,bob:k.bob,block:false,deco:true,epPic:1,loot:false,shop:false});cnt++}}
  return cnt}
/* hanging animal hides and pelts (Gandrick's cave, a bandit den): long flat pieces nailed to the wall of the halls, a few in the tunnels. Same wall-picture mechanism as epWallPics
   (flush on the wall, true perspective). Deterministic by hash. Never on a door, torch or secret-wall square, never two on neighbouring squares, never the same piece twice in a row. */
function epHides(n,P){const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,names=P.names.filter(k=>IMG['ep_'+k]);if(!names.length)return 0;
  const taken=new Set(G.decor.filter(d=>d.wd).map(d=>d.x+','+d.y+','+d.wd)),F=[[0,-1,2],[1,0,3],[0,1,0],[-1,0,1]],placed=[];let cnt=0;
  const hallAt=(x,y)=>{for(const k in P.halls){const r=P.halls[k];if(x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3])return k}return null};
  const doorNear=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const g=G.grid[y+dy]&&G.grid[y+dy][x+dx];if(g===3||g===4||g===5)return true}return false};
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y)||doorNear(x,y))continue;const hall=hallAt(x,y);
    for(const [dx,dy,face] of F){const wx=x+dx,wy=y+dy,g=G.grid[wy]&&G.grid[wy][wx];if(!(g===1||g===2))continue;
      if(torchAt.get((wy*MW+wx)*4+face)||taken.has(x+','+y+','+[dx,dy])||(EP_SECRETS[n]&&EP_SECRETS[n].some(q=>q.door[0]===wx&&q.door[1]===wy)))continue;
      if(G.decor.some(d=>d.x===x&&d.y===y&&d.block))continue;
      let p;if(hall)p=P.halls[hall][4];else{const tx=-dy,ty=dx;   // a tunnel: only where the wall is long and the tunnel is one square wide
        p=[-2,-1,1,2].every(k=>{const a=G.grid[wy+ty*k],b=G.grid[y+ty*k];return a&&a[wx+tx*k]!==0&&b&&b[x+tx*k]===0})?P.tunnel:0}
      if(hash2(x*4+face,y,n*19+7)>=p)continue;
      if(placed.some(q=>Math.abs(q[0]-x)<=1&&Math.abs(q[1]-y)<=1))continue;   // never on neighbouring squares
      const last=placed.length?placed[placed.length-1][3]:'';let i=(hash2(x*4+face,y,n*19+8)*names.length)|0;if(names[i]===last)i=(i+1)%names.length;
      const k=names[i],h=P.h[k]||1,bob=P.bob+(hash2(x,y*3+face,n*19+9)-.5)*.1;
      placed.push([x,y,face,k]);NPC_H['ep_'+k]=h;G.decor.push({k:'ep_'+k,x,y,wd:[dx,dy],pic:1,bob,block:false,deco:true,epPic:1,epHide:1,loot:false,shop:false});cnt++}}
  EP.hideCount=cnt;return cnt}
/* street clutter for a town: on grass or dirt beside a house wall (never on the road, never in a lane between two walls, never by a door), turned to the wall, never blocking */
function epStreet(n,P){const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,fm=G.fmap,okF=P.on||'1',used=new Set();
  for(const d of G.decor)used.add(Math.round(d.x)+','+Math.round(d.y));for(const e of G.enemies||[])used.add(e.x+','+e.y);for(const i of G.items||[])used.add(i.x+','+i.y);
  const house=g=>g>=100&&!(typeof KH_DOOR!=='undefined'&&KH_DOOR[g]),door=g=>(g>=3&&g<=5)||(g>=15&&g<100)||(g>=100&&typeof KH_DOOR!=='undefined'&&KH_DOOR[g]);
  const blk=new Set(G.decor.filter(d=>d.block&&!d.npc&&(!P.fenceRe||P.fenceRe.test(d.k))).map(d=>d.x+','+d.y));const placed=[];const ks=P.keys.filter(k=>IMG['ep_'+k]);if(!ks.length)return;
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y)||used.has(x+','+y)||(fm&&!okF.includes(fm[y*MW+x])))continue;
    const g=(a,b)=>G.grid[y+b][x+a],anc=(a,b)=>house(g(a,b))||(P.fence&&blk.has((x+a)+','+(y+b))),N=anc(0,-1),S=anc(0,1),E=anc(1,0),Wt=anc(-1,0);if(!(N||S||E||Wt)||(N&&S)||(E&&Wt))continue;
    let bad=false;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){if(door(g(a,b)))bad=true;if(P.notNear&&fm&&(a===0||b===0)&&P.notNear.includes(fm[(y+b)*MW+x+a]))bad=true}if(bad)continue; // never beside the road
    if(placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<(P.gap||3)))continue;if(hash2(x,y,n*37+1)>=(P.p||.4))continue;
    const nb=placed.filter(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<8).map(p=>p[2]);let k=ks[(hash2(x,y,n*37+2)*ks.length)|0];for(let t=0;t<ks.length&&nb.includes(k);t++)k=ks[(ks.indexOf(k)+1)%ks.length];
    placed.push([x,y,k]);G.decor.push({k:'ep_'+k,x,y,block:false,deco:true,epSt:1,loot:false,shop:false,ox:(E?.28:Wt?-.28:(hash2(x,y,9)-.5)*.3)*(k==='crate'?.4:1),oy:(S?.28:N?-.28:(hash2(x,y,8)-.5)*.3)*(k==='crate'?.4:1),sc:+((.85+hash2(x,y,n*37+3)*.3)*(k==='crate'?.6:1)).toFixed(2)})}}
/* windows that follow the time of day (opt-in: S.night, used by Thornwick and Ironhill). Each lit window picture gets a glow picture (T.e) for every
   step of the day: dim by day (as the grime pass left it), warm amber with a soft halo from dusk, fully lit 19:00 to 05:00, dimming again 05:00 to 07:00.
   A step is one eighth of the way; the pictures are made once, the first time a step is needed, and swapped in only when the step changes. */
function epNightK(){const hr=(((G.clock||0)%1440)+1440)%1440/60;let k=hr>=19||hr<5?1:hr>=7&&hr<17?0:hr>=17?(hr-17)/2:1-(hr-5)/2;return k*k*(3-2*k)}
function epHalo(a,rad,gain){const W=TS,t=new Float32Array(W*W),u=new Float32Array(W*W);for(let i=0;i<W*W;i++)t[i]=a[i];
  for(let p=0;p<2;p++){for(let y=0;y<W;y++){for(let x=0;x<W;x++){let q=0,c=0;for(let d=-rad;d<=rad;d++){const xx=x+d;if(xx>=0&&xx<W){q+=t[y*W+xx];c++}}u[y*W+x]=q/c}}
    for(let x=0;x<W;x++){for(let y=0;y<W;y++){let q=0,c=0;for(let d=-rad;d<=rad;d++){const yy=y+d;if(yy>=0&&yy<W){q+=u[yy*W+x];c++}}t[y*W+x]=q/c}}}
  for(let i=0;i<W*W;i++)t[i]=Math.min(1,t[i]*gain);return t}
/* a lit pane in a door or window tile: its own picture, with a soft amber halo spilling onto the wall round it */
function epNightE(e){const o=new Uint8ClampedArray(e),m=new Float32Array(TS*TS);let any=0;for(let i=0;i<TS*TS;i++){m[i]=e[i*4+3]>40?1:0;any+=m[i]}if(!any)return o;const h=epHalo(m,Math.max(2,TS/24|0),2.6);
  for(let i=0;i<TS*TS;i++){const j=i*4;if(e[j+3]>40){o[j]=255;o[j+1]=Math.min(255,e[j+1]*1.08);o[j+2]=e[j+2]*.95;o[j+3]=255}else{const a=h[i]*.34;o[j]=255;o[j+1]=172;o[j+2]=70;o[j+3]=a*255}}return o}
/* a painted house window (dark leaded panes): the pane lights up amber, the lead stays darker, a halo spills onto the plaster */
function epNightTv(d,W,fl,pre){const o=new Uint8ClampedArray(TS*TS*4),m=new Float32Array(TS*TS),ins=.018,sf=.012;
  for(const R of Array.isArray(W[0])?W:[W]){const x0=fl?1-R[2]:R[0],x1=fl?1-R[0]:R[2],y0=R[1],y1=R[3];
    for(let py=0;py<TS;py++)for(let px=0;px<TS;px++){const ux=px/TS,vy=py/TS,i=py*TS+px;const a=Math.min((ux-x0-ins)/sf,(x1-ins-ux)/sf,(vy-y0-ins)/sf,(y1-ins-vy)/sf);m[i]=Math.max(m[i],Math.max(0,Math.min(1,a+.5)))}}
  const h=epHalo(m,Math.max(2,TS/20|0),1.7);
  for(let i=0;i<TS*TS;i++){const j=i*4,l=(d[j]*.3+d[j+1]*.59+d[j+2]*.11),pane=pre?m[i]*.5*(.55+.45*Math.min(1,l/120)):m[i]*(.62+.38*(1-Math.min(1,l/150))); // a picture that is already lit by candles gets only a warm lift, so its curtains and panes stay readable
    const hv=Math.max(0,h[i]-m[i])*.42;const a=Math.max(pane,hv);
    o[j]=255;o[j+1]=pane>hv?168:150;o[j+2]=pane>hv?66:52;o[j+3]=a*(pane>hv?.92:1)*255}return o}
function epNightReg(L,ti,day,night,dark){(L._epn=L._epn||[]).push({ti,day,night,dark,c:{}});L._epnStep=-1}
function epNightTick(L){const st=Math.round(epNightK()*8);if(L._epnStep===st)return;L._epnStep=st;const k=st/8;
  for(const r of L._epn){const T=TEX[r.ti];if(!T)continue;let e=r.c[st];if(e===undefined){const A=r.day,B=r.night;
      if(r.dark&&!A)e=null;else{e=new Uint8ClampedArray(B.length);for(let i=0;i<e.length;i++){const a=A?A[i]:0;e[i]=r.dark?a*(1-.6*k):a+(B[i]-a)*k}}r.c[st]=e}
    T.e=e;for(let j=0;j<8;j++)delete T['he'+j]}}
/* a grimed copy of a painted wall picture: darker, sootier foot, a dirty top, faint damp streaks and blotches, a little less colour (processing of the painted art, never new drawing) */
function epGrime(ti,o,seed){const T=TEX[ti],d=T.d;if(!d||d.length!==TS*TS*4)return null;const a=new Uint8ClampedArray(d);const e=T.e;
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const i=(y*TS+x)*4;if(e&&e[i+3]>40){if(o.paneK){a[i]*=o.paneK;a[i+1]*=o.paneK*.97;a[i+2]*=o.paneK*.9}continue}let r=a[i],g=a[i+1],b=a[i+2];const l=r*.3+g*.59+b*.11,sa=o.sat||.8;r=l+(r-l)*sa;g=l+(g-l)*sa;b=l+(b-l)*sa;
    const v=y/TS;let f=o.k||.9;const ft=(v-(1-(o.foot||.28)))/(o.foot||.28);if(ft>0)f*=1-(o.footK||.5)*ft*ft;const tp=1-v/.16;if(tp>0)f*=1-.25*tp*tp;
    const st=Math.sin(x*.9+seed*1.7)*Math.sin(x*.23+seed)*.5+.5,stk=st>.82?(st-.82)/.18*(o.streak||.25)*Math.min(1,v*1.6):0;f*=1-stk;
    const bl=Math.sin(x*.11+y*.07+seed)*Math.sin(y*.13-x*.05+seed*2.2);if(bl>.45)f*=1-(bl-.45)*(o.blot||.4);
    if(o.emis!==undefined){const L0=d[i]*.3+d[i+1]*.59+d[i+2]*.11;if(L0>175&&d[i]>=d[i+2]){const q=o.emis+(1-o.emis)*(175/L0);f*=q}} // pale lit window panes, dimmer by day
    a[i]=r*f*(o.tint?o.tint[0]:1);a[i+1]=g*f*(o.tint?o.tint[1]:1);a[i+2]=b*f*(o.tint?o.tint[2]:1)}
  let ee=T.e;if(ee&&o.emis!==undefined){ee=new Uint8ClampedArray(T.e);for(let i=0;i<ee.length;i+=4){ee[i]*=o.emis;ee[i+1]*=o.emis*.92;ee[i+2]*=o.emis*.78}} // lit windows dimmer and warmer by day
  const n=addTex(a,ee);for(const k of Object.keys(T))if(k!=='d'&&k!=='e')TEX[n][k]=T[k];if(o.night&&T.e&&ee&&EP._nl)epNightReg(EP._nl,n,ee,epNightE(T.e),hash2(n,seed,311)<o.night.dark?1:0);return n}
/* small per-piece variety for repeated pieces: a mirrored copy on some, a slightly different size (visual only) */
function epJitter(n,J){for(const d of G.decor){if(d.npc||d.epJ||!J.re.test(String(d.k)))continue;d.epJ=1;const h=hash2(d.x,d.y,n*41+9);if(h<.5&&typeof f2Flip==='function'){const fk=f2Flip(d.k);if(IMG[fk]){if(NPC_H[d.k]&&!NPC_H[fk])NPC_H[fk]=NPC_H[d.k];d.k=fk}}if(J.sc)d.sc=+((d.sc||1)*(1-J.sc+2*J.sc*hash2(d.x,d.y,n*41+10))).toFixed(2)}}
/* the deserts stay very sparse: a few painted palms beside the oases that are already there, one or two broken pieces at the old ruins,
   and a handful of lone bones and stones far apart in the open sand. Never on a used square, never near the arrival, never blocking. */
function epDesert(n,P){const open=(x,y)=>x>=1&&y>=1&&x<MW-1&&y<MH-1&&G.grid[y][x]===0&&!(TERR_BLOCK&&TERR_BLOCK[y*MW+x]),used=new Set(),placed=[];
  for(const d of G.decor)used.add(Math.round(d.x)+','+Math.round(d.y));for(const e of G.enemies||[])used.add(e.x+','+e.y);for(const i of G.items||[])used.add(i.x+','+i.y);
  const st=LEVELS[n].start,far=(x,y,r)=>!placed.some(p=>Math.hypot(p[0]-x,p[1]-y)<r),free=(x,y)=>{if(!open(x,y)||Math.hypot(x-st.x,y-st.y)<=5)return false;for(let b=-2;b<=2;b++)for(let a=-2;a<=2;a++)if(used.has((x+a)+','+(y+b)))return false;return true};
  const put=(k,x,y,o)=>{P.sc=P.sc||{f2_de_palm:.72,f2_dx_oxskull:.65,f2_de_skull:.8,f2_de_amphora:.85,f2_de_cairn:.9};const key=IMG['ep_'+k]?'ep_'+k:IMG[k]?k:null;if(!key)return false;used.add(x+','+y);placed.push([x,y,k]);G.decor.push(Object.assign({k:key,x,y,block:false,walk:true,deco:true,epDes:1,loot:false,shop:false,ox:(hash2(x,y,n*53+1)-.5)*.5,oy:(hash2(x,y,n*53+2)-.5)*.5,sc:+(((P.sc&&P.sc[k])||1)*(.8+hash2(x,y,n*53+3)*.2)).toFixed(2)},o||{}));return true};
  const near=(ax,ay,cnt,keys,r0,r1,seed)=>{let c=0;for(let t=0;t<40&&c<cnt;t++){const a=hash2(ax,ay,seed+t*3)*6.283,r=r0+(r1-r0)*hash2(ax,ay,seed+t*3+1),x=Math.round(ax+Math.cos(a)*r),y=Math.round(ay+Math.sin(a)*r);if(!free(x,y)||!far(x,y,1.6))continue;const nb=placed.filter(p=>Math.hypot(p[0]-x,p[1]-y)<5).map(p=>p[2]);let k=keys[(hash2(x,y,seed+7)*keys.length)|0];for(let q=0;q<keys.length&&nb.includes(k);q++)k=keys[(keys.indexOf(k)+1)%keys.length];if(put(k,x,y))c++}};
  const groups=(re,gap)=>{const g=[];for(const d of G.decor){if(d.epDes||!re.test(String(d.k)))continue;if(g.some(q=>Math.hypot(q[0]-d.x,q[1]-d.y)<gap))continue;g.push([d.x,d.y])}return g};
  let oi=0;for(const [x,y] of groups(P.oasisRe||/^dpalm/,P.oasisGap||8)){if(hash2(x,y,n*53+9)>=(P.oasisP||.7))continue;if(P.palms.length)near(x,y,Math.max(1,((hash2(x,y,n*53+10)*(P.oasisN||3))|0)),P.palms,2,3.5,n*53+100+oi*17);oi++}
  let ri=0;for(const [x,y] of groups(P.ruinRe||/^(dpillar|dobelisk|dsphinx|druinstairs|dcrypt)/,P.ruinGap||10)){if(hash2(x,y,n*53+11)>=(P.ruinP||.5))continue;near(x,y,Math.max(1,((hash2(x,y,n*53+12)*(P.ruinN||2))|0)),P.ruins,2,3.5,n*53+500+ri*13);ri++}
  for(let t=0,c=0;t<4000&&c<(P.lone||8);t++){const x=1+((hash2(t,n,n*53+20)*(MW-2))|0),y=1+((hash2(n,t,n*53+21)*(MH-2))|0);if(!free(x,y)||!far(x,y,P.loneGap||24))continue;if(put(P.bones[(hash2(x,y,n*53+22)*P.bones.length)|0],x,y))c++}
  return placed.length}
/* ---------- secret rooms behind a suspicious wall (level 1). The rooms are carved into the solid rock when this file loads; each is sealed by one
   wall square with a slightly odd painted face. Walking into it (or pressing forward at it) opens it for good: G.flags.ep_sec[id]. ---------- */
const EP_SECRETS={1:[
  {id:'a',door:[4,12],from:[3,12],cells:[[5,11],[6,11],[5,12],[6,12]],chest:[6,12],pots:3,lamp:[5,12],props:[['web_corner',6,11,[0,-1]],['skel_slump',5,11,null],['candles',5,12,null]]},
  {id:'b',door:[12,13],from:[13,13],cells:[[9,13],[10,13],[11,13],[9,14],[10,14],[11,14]],chest:[9,14],pots:3,lamp:[10,13],props:[['web_hang',10,14,[0,1]],['bonepile',11,14,null],['candles',10,13,null]]},
  {id:'c',door:[15,10],from:[16,10],cells:[[13,10],[14,10],[13,11],[14,11]],chest:[13,10],pots:2,lamp:[14,10],props:[['web_corner',13,11,[-1,0]],['lantern',14,10,null],['potrubble',13,11,null]]},
  {id:'d',door:[25,3],from:[24,3],cells:[[26,3],[26,4],[26,5]],chest:[26,3],pots:4,lamp:[26,5],props:[['skel_hang',26,4,[1,0]],['candles',26,5,null],['web_corner',26,5,[0,1]],['bonepile',26,4,null]]}]};
/* the rooms stay solid in the level's rows (so the torches, the map and every route are exactly as before) and are hollowed out of G.grid on each visit; only the chests are listed in the level's decor */
{const L=LEVELS[1];if(L&&L.decor&&!L._epSecD){L._epSecD=1;for(const s of EP_SECRETS[1])L.decor.push({k:'chest',x:s.chest[0],y:s.chest[1],block:true,kname:'epsec_'+s.id})}}
const epSecF=()=>{const F=G.flags;return F.ep_sec=F.ep_sec||{}};
function epSecretsApply(n){const list=EP_SECRETS[n],F=epSecF();
  for(const s of list){const [dx,dy]=s.door;for(const [x,y] of s.cells)if(G.grid[y]&&G.grid[y][x]===1)G.grid[y][x]=0;if(F[s.id]&&G.grid[dy]&&G.grid[dy][dx]!==0)G.grid[dy][dx]=0;
    const ch=G.decor.find(d=>d.kname==='epsec_'+s.id);if(ch){if(!ch.contents)ch.contents=[{id:'potion',n:s.pots}];ch.gold=0;ch.loot=true;if(IMG.ep_chest_s)ch.lk='ep_chest_s'}
    if(!G.decor.some(d=>d.epSecP===s.id))for(const [k,x,y,wd] of s.props){if(!IMG['ep_'+k])continue;const d={k:'ep_'+k,x,y,block:false,deco:true,loot:false,shop:false,epSecP:s.id};if(wd){d.wd=wd;d.pic=1;d.bob=k==='skel_hang'?.5:.72;NPC_H['ep_'+k]=k==='skel_hang'?.95:.45}else{d.ox=(x===s.chest[0]?.2:-.2);d.oy=.15;d.sc=k==='lantern'?.8:k==='candles'?.7:.9}G.decor.push(d)}
    if(!F[s.id]&&IMG.ep_candles&&!G.decor.some(d=>d.epSecC===s.id)){const [fx,fy]=s.from,dx=s.door[0]-fx,dy=s.door[1]-fy;G.decor.push({k:'ep_candles',x:fx,y:fy,ox:dx*.36+(dy?.18:0),oy:dy*.36+(dx?.18:0),sc:.55,block:false,deco:true,loot:false,shop:false,epSecC:s.id})}
    if(!F[s.id]&&!LIGHTS.some(l=>l.epSecC===s.id)){const [fx,fy]=s.from,dx=s.door[0]-fx,dy=s.door[1]-fy;LIGHTS.push({x:fx+.5+dx*.4,y:fy+.5+dy*.4,ph:hash2(fx,fy,7)*6.28,key:-6000-LIGHTS.length,taken:false,red:false,free:true,lamp:true,calm:false,kI:.42,col:[1.25,.9,.55],range2:5,epSecC:s.id})} // the stub's own small warm glow on the loose stones // a guttered candle stub left at the foot of the sealed wall
    if(s.lamp&&!LIGHTS.some(l=>l.epSec===s.id))LIGHTS.push({x:s.lamp[0]+.5,y:s.lamp[1]+.5,ph:hash2(s.lamp[0],s.lamp[1],3)*6.28,key:-5000-LIGHTS.length,taken:false,red:false,free:true,lamp:true,calm:false,kI:.5,col:[1.2,.86,.56],range2:30,epSec:s.id})}
  const L=LEVELS[n];if(L._epf){const m=L._epf.ct=L._epf.ct||new Map();for(const s of list)if(!F[s.id]){const t=epSusTex(s);if(t!==null)m.set(s.door[1]*MW+s.door[0],t)}}}
/* the suspicious face: the crypt's own painted wall with one ragged block of stones a little out of line and a hairline gap round it, dust at its foot */
function epSusTex(s){const key='sus'+s.id;EP.sus=EP.sus||{};if(EP.sus[key]!==undefined)return EP.sus[key];const W=EP.wall;if(!W||!TEX[W.stone])return null;
  const [mx,my]=s.door,[fx,fy]=s.from,face=fx>mx?1:fx<mx?3:fy>my?2:0,vv=W.wv&&W.wv[1];let src=W.stone;if(vv)src=vv[((Math.imul(mx,73856093)^Math.imul(my,19349663)^Math.imul(face,83492791))>>>4)%vv.length]; // the same painted face the engine would draw here
  return EP.sus[key]=addTex(epSusData(TEX[src].d,40,90,46,104))}
/* the odd block, the crack and the dust, made from any wall picture's pixels (o); the same for level 1 and for the secret walls of the mazes (secret_rooms.js) */
function epSusData(o,x0,x1,y0,y1,HH,P){HH=HH||TS;P=P||{};const d=new Uint8ClampedArray(o),N=TS;
  const jg=(a,sd)=>Math.round((Math.sin(a*.83+sd)*1.6+Math.sin(a*2.31+sd*3)*1.1+(hash2(a>>1,sd|0,41)-.5)*2.4)),inB=(x,y)=>x>=x0+jg(y,1)&&x<x1+jg(y,7)&&y>=y0+jg(x,3)&&y<y1+jg(x,5);   // a ragged outline that wanders and chips like a real crack
  for(let y=y0-5;y<y1+5;y++)for(let x=x0-5;x<x1+5;x++){if(x<0||y<0||x>=N||y>=HH||!inB(x,y))continue;const sx=Math.max(0,Math.min(N-1,x+Math.round((P.dx===undefined?4:P.dx)*.6))),sy=Math.max(0,Math.min(HH-1,y+Math.round((P.dy===undefined?-3:P.dy)*.6))),i=(y*N+x)*4,j=(sy*N+sx)*4;d[i]=Math.min(255,o[j]*1.05+5);d[i+1]=Math.min(255,o[j+1]*1.04+4);d[i+2]=Math.min(255,o[j+2]*1.01+3)}   // one block of stones a little out of line
  for(let y=y0-7;y<y1+7;y++)for(let x=x0-7;x<x1+7;x++){if(x<0||y<0||x>=N||y>=HH||inB(x,y))continue;let near=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[2,0],[0,2],[-2,0],[0,-2]])if(inB(x+a,y+b)){near=Math.abs(a)+Math.abs(b);break}if(!near)continue;const i=(y*N+x)*4,top=inB(x+1,y+1)&&!inB(x-1,y+1)&&y<y0+4||inB(x,y+1)&&y<y0+4,k=(f=>1+(f-1)*(P.soft===undefined?1:P.soft)*.55)(near===1?(top?1.25:.25+.1*hash2(x,y,9)):(top?1.1:.62));d[i]=Math.min(255,d[i]*k);d[i+1]=Math.min(255,d[i+1]*k);d[i+2]=Math.min(255,d[i+2]*k)}   // a continuous crack round it, lit along its upper lip
  for(let y=y1+2;y<HH;y++)for(let x=x0-8;x<x1+8;x++){if(x<0||x>=N)continue;const t=(y-y1)/(HH-y1);if(hash2(x,y,31)<.3*(P.dust||1)*(1-t*.3)){const i=(y*N+x)*4;d[i]=Math.min(255,d[i]*1.35+22);d[i+1]=Math.min(255,d[i+1]*1.32+20);d[i+2]=Math.min(255,d[i+2]*1.25+16)}}   // pale dust where the stones were moved
  return d}

/* opening is forgiving: any move into the sealed wall (W, Up, the on-screen arrow, the pad), the attack or use key while facing it, or a click while facing it */
/* the secret walls of a level: level 1's own four (EP_SECRETS) or the ones secret_rooms.js plans for the mazes and dungeons (SR_ROOMS) */
const epSecList=n=>EP_SECRETS[n]||(self.SR_ROOMS&&SR_ROOMS[n])||null;
function epSecretAt(nx,ny){const list=!self.EP_OFF&&epSecList(LEVEL);if(!list)return null;const s=list.find(q=>q.door[0]===nx&&q.door[1]===ny);return s&&!epSecF()[s.id]?s:null}
function epSecretOpen(s){const F=epSecF();if(F[s.id])return false;const [nx,ny]=s.door;F[s.id]=1;G.grid[ny][nx]=0;{const li=LIGHTS.findIndex(l=>l.epSecC===s.id);if(li>=0)LIGHTS.splice(li,1)}const L=LEVELS[LEVEL];if(L._epf&&L._epf.ct)L._epf.ct.delete(ny*MW+nx);if(self.SR_CT)SR_CT.delete(ny*MW+nx);if(s.sr&&typeof srOpened==='function')srOpened(s);sfx('door');G.shake=.3;msg('The stones here are loose. A hidden door swings open.','#ffe9a0');EP.cur=-1;return true}
function epFacing(){if(!G.P)return null;const d=DIRS[G.P.f];return epSecretAt(G.P.x+d[0],G.P.y+d[1])}
{const _dm=doMove;doMove=function(rel){try{if(G.state==='play'&&!G.cut&&!G.talk){const d=DIRS[(G.P.f+rel)%4],s=epSecretAt(G.P.x+d[0],G.P.y+d[1]);if(s&&epSecretOpen(s))return}}catch(e){console.error('ep secret',e)}return _dm.apply(this,arguments)}}
{const _ac=act;act=function(id){try{if(G.state==='play'&&!G.cut&&!G.talk&&!G.loot&&!G.menu&&(id==='attack'||id==='special'||id==='use'||id==='fwd')){const s=epFacing();if(s&&epSecretOpen(s))return}}catch(e){console.error('ep secret',e)}return _ac.apply(this,arguments)}}
addEventListener('pointerdown',()=>{try{if(G.state==='play'&&!G.cut&&!G.talk&&!G.loot&&!G.menu&&!(G.inv&&G.inv.open)&&!G.map&&!G.overview){const s=epFacing();if(s)setTimeout(()=>{if(epFacing()===s)epSecretOpen(s)},0)}}catch(e){}},true);
/* a hint for those who pass by: standing beside a sealed wall for a moment, the party feels a draught (once per wall and visit) */
function epSecretHint(){const list=!self.EP_OFF&&epSecList(LEVEL);if(!list||!G.P||G.state!=='play')return;const F=epSecF(),now=G.time||0;EP.hint=EP.hint||{};
  for(const s of list){if(F[s.id]||EP.hint[LEVEL+s.id])continue;const [dx,dy]=s.door,near=Math.abs(G.P.x-dx)+Math.abs(G.P.y-dy)===1;if(!near){if(EP.hintAt&&EP.hintAt.id===s.id)EP.hintAt=null;continue}
    if(!EP.hintAt||EP.hintAt.id!==s.id)EP.hintAt={id:s.id,t:now};else if(now-EP.hintAt.t>1.2){EP.hint[LEVEL+s.id]=1;const d=DIRS[G.P.f],ahead=G.P.x+d[0]===dx&&G.P.y+d[1]===dy;msg(ahead?'A cold draught seeps through a crack in the stones in front of you.':'A cold draught seeps from a crack in the wall beside you.','#c8d4e0')}}}
{const _sb=secretBump;secretBump=function(nx,ny){try{const list=!self.EP_OFF&&epSecList(LEVEL);if(list){const s=list.find(q=>q.door[0]===nx&&q.door[1]===ny);const F=epSecF();
    if(s&&!F[s.id]&&epSecretOpen(s))return true}}catch(e){console.error('ep secret',e)}
  return _sb.apply(this,arguments)}}
/* low clumps of dull damp grass and weeds in the mud: beside the path or a fence, thinning away from it, never on the path itself (the game's own grass pictures, dulled) */
function epTufts(n,T){const fm=G.fmap;if(!fm)return;const open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&G.grid[y][x]===0,used=new Set();for(const d of G.decor)used.add(Math.round(d.x)+','+Math.round(d.y));for(const e of G.enemies||[])used.add(e.x+','+e.y);for(const i of G.items||[])used.add(i.x+','+i.y);
  const ks=[];for(let i=0;i<4;i++){const src=IMG['pgrass'+i];if(!src||!src.width)continue;const k='ep_tuft'+i+(T.tuftF?'b':'');if(!IMG[k]){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.filter=T.tuftF||'saturate(.45) brightness(.72) sepia(.35)';x.drawImage(src,0,0);IMG[k]=c;NPC_H[k]=NPC_H['pgrass'+i]||.3}ks.push(k)}if(!ks.length)return;
  let c=0;const isP=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&T.path.includes(fm[y*MW+x]);
  for(let y=1;y<MH-1&&c<T.n;y++)for(let x=1;x<MW-1&&c<T.n;x++){if(!open(x,y)||used.has(x+','+y))continue;const fc=fm[y*MW+x];if(T.edgeOn&&T.edgeOn.includes(fc)){let o=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const c2=fm[(y+b)*MW+x+a];if(c2!==fc&&!(G.grid[y+b]&&G.grid[y+b][x+a]>0))o++}if(o&&hash2(x,y,n*61+9)<(T.edgeP||.5)){const k=ks[(hash2(x,y,n*61+2)*ks.length)|0];G.decor.push({k,x,y,block:false,walk:true,deco:true,epTuft:1,loot:false,shop:false,ox:(hash2(x,y,n*61+3)-.5)*.6,oy:(hash2(x,y,n*61+4)-.5)*.6,sc:+(.55+hash2(x,y,n*61+5)*.35).toFixed(2)});c++}continue}if(!T.on.includes(fc))continue;let d=9;const R=T.far||2;for(let b=-R;b<=R;b++)for(let a=-R;a<=R;a++)if(isP(x+a,y+b))d=Math.min(d,Math.max(Math.abs(a),Math.abs(b)));if(d>R){if(!(T.base&&hash2(x,y,n*61+7)<T.base))continue}
    else if(hash2(x,y,n*61+1)>=T.p*(d===1?1:d===2?.55:.3))continue;const k=ks[(hash2(x,y,n*61+2)*ks.length)|0];
    G.decor.push({k,x,y,block:false,walk:true,deco:true,epTuft:1,loot:false,shop:false,ox:(hash2(x,y,n*61+3)-.5)*.6,oy:(hash2(x,y,n*61+4)-.5)*.6,sc:+((T.big?.75:.55)+hash2(x,y,n*61+5)*(T.big?.5:.35)).toFixed(2)});c++}}
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
{const _ll=loadLevel;loadLevel=function(n){try{epSwapWalls(null);epProps(n,EP_SPEC[n])}catch(e){console.error('ep props',e)}const r=_ll.apply(this,arguments);try{if(EP_SPEC[n])epLoad()}catch(e){console.error(e)}return r}} // our walls are put back before the level's own swaps (the well's, the ruby maze's) run, so theirs keep the true originals
if(typeof hgdbFloor==='function'){const _hf=hgdbFloor;hgdbFloor=function(){_hf.apply(this,arguments);try{const L=!self.EP_OFF&&LEVELS[LEVEL];if(L&&L._fl7&&!G.fl7)G.fl7=L._fl7}catch(e){}}}   // keep this level's seventh floor (char 6) when the Grasslands' floor hook clears it
{const _dw=drawWorld;drawWorld=function(){try{epSecretHint()}catch(e){}try{if(typeof LEVEL!=='undefined'&&(EP.cur!==LEVEL||EP.gd!==G.decor||EP.rd!==EP.ready)){EP.cur=LEVEL;EP.gd=G.decor;EP.rd=EP.ready;epApply(LEVEL)}const Lq=!self.EP_OFF&&LEVELS[LEVEL];if(Lq&&Lq._fl7&&G.fl7!==Lq._fl7)G.fl7=Lq._fl7;if(Lq&&Lq._epn)epNightTick(Lq)}catch(e){console.error('ep',e)}return _dw.apply(this,arguments)}}   // the seventh floor (char 6) is cleared each tick elsewhere, so it is set again before every frame
/* a big painted piece right in front of the party thins out instead of filling the view with a blurred close-up (opt-in: S.nearFade) */
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);const S=typeof LEVEL!=='undefined'&&!self.EP_OFF&&EP_SPEC[LEVEL];if(!S||!S.nearFade||!G.C)return L;const a=G.C.a||0,cx=G.C.x+.5-Math.cos(a)*.28,cy=G.C.y+.5-Math.sin(a)*.28;
  for(const s of L){const d=s.decor;if(!d||d.npc||s.e||s.pic||s.hang||!s.img||!s.img.width||/chest|sign|lamp|gate|door/.test(String(d.k)))continue;const h=s.w*s.img.height/s.img.width;if(h<1.05&&s.w<1.1)continue;
    const ds=Math.hypot(s.x-cx,s.y-cy),thr=Math.max(1.5,.5+.45*Math.max(h,s.w));if(ds>=thr)continue;const f=Math.max(.2,Math.min(1,(ds-.55)/(thr-.55)));s.fade=s.fade===undefined?f:Math.min(s.fade,f)}
  return L}}
/* a dungeon finish like the crypts' (level 1), on crypt stone, cave rock or a timbered mine wall */
function epDungeon(kind,n,o){o=o||{};const W={crypt:{name:'crypt',stone:'cryptwall',so:{k:[.7,.66,.6],sat:.78,foot:[.34,.62],top:[.2,.4]},brick:'cellarbrick',bo:{k:[.74,.68,.64],sat:.5,foot:[.34,.65],top:[.2,.4]},
      vars:{1:[{tex:'cryptroots'},{tex:'cryptdamp'},{tex:'cryptwall',o:{k:[.6,.57,.52],sat:.7,foot:[.38,.7],top:[.22,.45],flip:1,blot:.35,seed:1.3}}],2:[{tex:'cellarbrick',o:{k:[.58,.52,.5],sat:.45,foot:[.4,.75],top:[.22,.5],flip:1,blot:.45,seed:.7}}]}},
    cave:{name:'cave',stone:'caverock',so:{k:[.72,.68,.62],sat:.75,foot:[.34,.6],top:[.24,.5]},brick:'caverock',bo:{k:[.6,.56,.52],sat:.7,foot:[.34,.6],top:[.24,.5],flip:1},
      vars:{1:[{tex:'caverock',o:{k:[.62,.6,.55],sat:.7,foot:[.36,.66],top:[.24,.5],flip:1,blot:.4,seed:1.1}},{tex:'caverock',o:{k:[.68,.64,.58],sat:.72,foot:[.34,.6],top:[.24,.5],blot:.35,seed:2.7}}]}},
    mine:{name:'mine',stone:'minewall',so:{k:[.72,.68,.62],sat:.75,foot:[.34,.6],top:[.24,.5]},brick:'caverock',bo:{k:[.66,.62,.56],sat:.7,foot:[.34,.6],top:[.24,.5]},
      vars:{1:[{tex:'caverock',o:{k:[.66,.62,.56],sat:.72,foot:[.36,.64],top:[.24,.5],blot:.3,seed:1.6}},{tex:'caverock',o:{k:[.6,.57,.52],sat:.7,foot:[.36,.66],top:[.24,.5],flip:1,blot:.4,seed:2.2}},{tex:'minewall',o:{k:[.64,.6,.55],sat:.7,foot:[.36,.66],top:[.24,.5],flip:1}}]}}}[kind];
  const S={walls:W,decals:{keys:kind==='crypt'?['straw','droppings','soot','crack','rubble','bones','damp','shards','rag','grain','pebbles','straw','wax']:kind==='cave'?['rubble','pebbles','bones','damp','crack','droppings','mud','leaves','pebbles']:['rubble','pebbles','crack','soot','mud','shards','straw','pebbles'],p:.85,wallBias:.5,sz:[.5,.7],far:14,gain:[1.08,1,.9],a:1},
    shadow:.65,glow:.5,glowSz:3.2,glowCol:[1,.6,.32],ao:.8,aoW:.55,amb:.07,
    grade:{c:1.1,s:.84,b:1.05,tone:[150,110,70,.12],vig:.4,vc:[10,7,4]},
    pics:{p:.3,keys:(kind==='mine'?[{k:'chains',h:.55,bob:.55},{k:'soot',h:.5,bob:.6},{k:'damp',h:.75,bob:.48},{k:'web_hang',h:.5,bob:.7},{k:'planks_x',h:.4,bob:.4},{k:'ring',h:.16,bob:.45}]:
      kind==='cave'?[{k:'moss',h:.16,bob:.035},{k:'moss',h:.16,bob:.035},{k:'damp',h:.75,bob:.48},{k:'web_corner',h:.42,bob:.76,corner:1},{k:'web_hang',h:.5,bob:.7}]:
      [{k:'web_corner',h:.42,bob:.76,corner:1},{k:'web_hang',h:.5,bob:.7},{k:'chains',h:.55,bob:.55},{k:'moss',h:.16,bob:.035},{k:'ring',h:.16,bob:.45},{k:'soot',h:.5,bob:.6},{k:'damp',h:.75,bob:.48},{k:'shelf',h:.3,bob:.5},{k:'planks_x',h:.4,bob:.4}])},
    auto:{keys:kind==='mine'?['rubble','planks','bucket','crate','sacks','jar']:kind==='cave'?['rubble','bonepile','ratnest','rubble','jar']:['sacks','crate','rubble','ratnest','bucket','bonepile','planks','jar'],p:.7}};
  if(!o.nofloor){S.floor={name:kind+'floor',tex:kind==='crypt'?'flagfloor':'earthfloor',o:{k:[.8,.75,.68],sat:.7}};S.fvar=[{name:kind+'earth',tex:'earthfloor',o:{k:[.72,.66,.58],sat:.7,flip:1},at:.38},{name:kind+'flagdk',tex:kind==='crypt'?'flagfloor':'earthfloor',o:{k:[.62,.58,.54],sat:.6,flip:1,blot:.4,seed:1.9},at:.62}];S.soft=.38}
  S.ceil=kind==='cave'?{name:'caveceil',tex:'caverock',o:{k:[.55,.52,.48],sat:.6,flip:1}}:{name:'cryptbeams',img:'ep_tex_beams',o:{k:[.9,.82,.72],sat:.6}};
  S.grime={k:.84,sat:.85,foot:.34,footK:.6,streak:.35,blot:.45,tint:[1,1,1],gate:1}; // grime in the level's own colours: never shift its hue
  return S}
/* the five great deserts share one sparse dressing */
function epDes(n){return {desert:{palms:['f2_de_palm'],ruins:['f2_de_amphora','f2_de_skull','f2_de_cairn'],bones:['f2_dx_oxskull','f2_de_skull','f2_de_cairn','f2_de_amphora'],oasisP:.45,oasisN:1,oasisGap:12,ruinP:.3,ruinN:1,ruinGap:16,lone:7,loneGap:40}}}
/* the finish of an early outdoor level: painted forest floor, mud track and grass, leaf and mud decals, shade under the trees, lamp pools, mirrored repeats */
function epWood(n,o){const S={decals:{keys:['leaves','pebbles','mud','droppings'],on:{0:o.town?['mud','straw','droppings','puddle','pebbles','leaves','soot']:['leaves','leaves','pebbles','mud','bones','droppings'],1:['mud','puddle','straw','pebbles','droppings','leaves'],2:['mud','straw','droppings','pebbles','puddle','leaves'],3:['mud','leaves','straw'],4:['mud','straw','soot','droppings'],5:['mud','puddle','straw']},p:.6,wallBias:.3,sz:[.5,.7],far:16,gain:[1,.95,.88],a:1},
    soft:.45,shadow:.6,shadowSz:1.4,ao:o.town?.6:.3,aoW:o.town?.55:.35,nearFade:1,glow:.6,glowSz:2.6,glowCol:[1,.7,.42],
    grade:{c:1.08,s:.82,b:1.03,tone:[130,110,80,.12],vig:.34,vc:[10,10,6]},
    jitter:[{re:/^fence$/,sc:0},{re:/^(pjuniper|pheather|pbracken|greeds|gfungus|gbramble|bush|flora)/,sc:.14},{re:/^(ptree|gtree|tree)/,sc:.1}]};
  if(o.keepFloor){}
  else if(o.town)S.floors={0:{name:'ih_cob',tex:'wetcobble',o:{k:[1.45,1.4,1.32],sat:.85}},1:{name:'tw_grass2',tex:'villgrass',o:{k:[.98,1.0,.84],sat:.85}},2:{name:'tw_path2',tex:'mudtrack',o:{k:[2.25,2.02,1.7],sat:.66}},3:{name:'tw_cobm',tex:'wetcobble',o:{k:[1.12,1.18,1.02],sat:.85,flip:1}},4:{name:'tw_cobs',tex:'wetcobble',o:{k:[1.1,1.05,1],sat:.75,blot:.4,seed:2}},5:{name:'tw_cobw',tex:'wetcobble',o:{k:[1.05,1.08,1.1],sat:.75,flip:1,blot:.3,seed:3}}};
  else if(o.road)S.floors={0:{name:'rd_mud',tex:'mudtrack',o:{k:[1.05,1.0,.92],sat:.85}},1:{name:'rd_trail',tex:'villgrass',o:{k:[1.05,1.08,.95],sat:.9,flip:1}}};
  else{S.tufts={on:'0',path:'1',p:.5,n:80};Object.assign(S.decals,{p:.3,path:'1',pathKeys:['stones','paledirt','gravel','paledirt'],pathP:.3,verge:['leaves','bracken','leaves'],vergeP:.25});S.decals.on=Object.assign({},S.decals.on,{0:['leaves','leaves','pebbles','bracken']});S.floorTint={0:[.8,.8,.76],1:[1.3,1.22,1.08]};S.soft=.6;S.decals.p=.2;S.shadow=.4;S.ao=.3;S.grade={c:1.06,s:.92,b:1.06,tone:[150,120,80,.08],vig:.26,vc:[10,10,6]};S.tufts.p=.85;S.tufts.n=240;S.tufts.far=3}
  return S}
/* Under the Well (501) keeps its own cold blue-grey stone, floor and ceiling (thornwick_well.js): only grime in its own cool palette, wet shade and pools */
const EP_WELL={lightK:.66,tintVar:.06,grime:{only:'portal',k:.66,sat:.12,foot:.3,footK:.5,streak:.3,blot:.4,tint:[.78,.94,1.22]},flame:[.92,.82,.72,.72],walls:{name:'well',stone:'cryptwall',so:{match:[66,100,160],foot:[.42,.72],top:[.25,.5]},
    vars:{1:[{tex:'cryptdamp',o:{match:[76,106,144],foot:[.42,.74],top:[.25,.5]}},{tex:'cryptwall',o:{match:[60,102,156],foot:[.44,.76],top:[.25,.5],flip:1,blot:.35,seed:1.7}},{tex:'cryptroots',o:{match:[70,99,150],foot:[.42,.74],top:[.25,.5],blot:.3,seed:2.9}},{tex:'cryptdamp',o:{match:[63,97,155],foot:[.44,.76],top:[.25,.5],flip:1,blot:.3,seed:3.3}}]}},retile:1,
  decals:{keys:['damp','crack','pebbles','rubble','bones','damp','droppings'],p:.6,wallBias:.5,sz:[.45,.7],far:14,gain:[1.05,1.12,1.25],a:1,big:{keys:['damp','damp','rubble','crack','pebbles'],p:.26,sz:[1.1,1.7],gap:2.4,a:.9}},
  shadow:.7,shadowSz:1.25,glow:.3,glowSz:3.0,glowCol:[.86,.82,.74],ao:.8,aoW:.58,amb:.06,
  grade:{c:1.1,s:1.04,b:1.02,tone:[70,105,165,.2],vig:.42,vc:[4,7,12]},
  pics:{p:.55,keys:[{k:'soot',h:.5,bob:.6},{k:'shelf',h:.3,bob:.5},{k:'web_corner',h:.42,bob:.76,corner:1},{k:'web_hang',h:.5,bob:.7},{k:'chains',h:.55,bob:.55},{k:'ring',h:.16,bob:.45}]},
  auto:{keys:['rubble','bonepile','bucket','jar','rubble'],p:.6}};
/* the Ironhill Tunnel (11) was sandy tan masonry: the crypt finish, lighter and warmer, so it keeps its colour */
const EP_TUNNEL=(()=>{const S=epDungeon('crypt',11);S.walls=JSON.parse(JSON.stringify(S.walls));S.walls.name='tunnel';const tan=o=>Object.assign({},o||{},{k:[.98,.88,.72],sat:.85});S.walls.so=tan(S.walls.so);S.walls.bo=tan(S.walls.bo);
  S.walls.vars={1:[{tex:'cryptdamp',o:tan({foot:[.34,.6],top:[.2,.4]})},{tex:'cryptwall',o:tan({foot:[.36,.62],top:[.2,.4],flip:1,blot:.3,seed:1.3})},{tex:'cryptroots',o:tan({foot:[.34,.6],top:[.2,.4],blot:.25,seed:2.1})}]};
  S.floor={name:'tunnelfloor',tex:'earthfloor',o:{k:[.95,.86,.72],sat:.8}};S.amb=.1;S.grade={c:1.08,s:.88,b:1.04,tone:[160,125,85,.12],vig:.36,vc:[10,7,4]};return S})();
/* where the glass is in each painted house picture that has a lit-able window: x0,y0,x1,y1 as a fraction of the picture (unflipped) */
const EP_NWIN={tww1:[.35,.27,.65,.55],tww3:[.35,.27,.65,.55],ihw1:[.36,.2,.62,.52],ihw3:[.33,.18,.65,.52],ihw2:[.34,.2,.62,.56],tst1:[.33,.22,.68,.58,1],tst2:[.08,.19,.9,.62,1],tst5:[.33,.14,.67,.48,1],tst8:[.32,.1,.68,.72],tst9:[.34,.12,.68,.58],tst10:[.28,.14,.74,.5,1]};
/* the lit windows in the door pictures of the town (T_DOORS name): the same, one or two panes each */
const EP_NDOOR={hall:[[.17,.15,.33,.32],[.63,.15,.8,.32]],shop:[[.09,.5,.37,.7],[.4,.5,.67,.7]],inn:[[.22,.18,.34,.37],[.72,.18,.84,.37]]};
const EP_GRIME=['straw','droppings','puddle','soot','crack','rubble','bones','damp','shards','rag','grain','mud','pebbles','wax'];
/* Gandrick's cave is a bandit den: hung hides and pelts are its wall dressing; no damp stains, no tangled web pieces (only corner cobwebs). */
const EP_GANDRICK={pics:{p:.07,keys:[{k:'moss',h:.16,bob:.035},{k:'web_corner',h:.42,bob:.76,corner:1}]},
  hides:{names:['hide_0','hide_2','hide_7','hide_1','hide_5','hide_0','hide_8','hide_2','hide_10','hide_7','hide_9','hide_3'],h:{hide_0:1.2,hide_1:1.2,hide_2:1.2,hide_3:1.2,hide_5:1.15,hide_6:1.2,hide_7:1.2,hide_8:1.25,hide_9:1.25,hide_10:1.15},bob:.12,tunnel:.1,
    halls:{entry:[1,15,7,20,.3],coffin:[12,13,21,20,.2],cavern:[10,2,21,8,.4],guard:[26,2,30,9,.5],stolen:[16,31,27,40,.4],gandrick:[47,30,59,41,.5]}}};
const EP_SPEC={
  /* the crypts below the Abbey: the starting dungeon */
  1:{walls:{name:'crypt1',stone:'cryptwall',so:{k:[.8,.72,.6],sat:.86,foot:[.5,.85],top:[.3,.62]},brick:'cellarbrick',bo:{k:[.5,.46,.44],sat:.22,foot:[.5,.85],top:[.3,.62]},
       vars:{1:[{tex:'cryptdamp',o:{k:[.68,.64,.58],sat:.74,foot:[.5,.85],top:[.3,.62]}},{tex:'cryptdamp',o:{k:[.64,.61,.56],sat:.72,foot:[.5,.85],top:[.3,.62],flip:1,blot:.3,seed:2.4}},{tex:'cryptwall',o:{k:[.6,.57,.52],sat:.7,foot:[.5,.85],top:[.3,.62],flip:1,blot:.35,seed:1.3}},{tex:'cryptwall',o:{k:[.66,.62,.56],sat:.74,foot:[.5,.85],top:[.3,.62],blot:.45,seed:3.7}},{tex:'cryptroots',o:{k:[.62,.59,.54],sat:.7,foot:[.5,.85],top:[.3,.62],blot:.3,seed:2.1}}],
             2:[{tex:'cellarbrick',o:{k:[.48,.44,.42],sat:.22,foot:[.5,.85],top:[.3,.62],flip:1,blot:.45,seed:.7}},{tex:'cellarbrick',o:{k:[.52,.48,.45],sat:.22,foot:[.5,.85],top:[.3,.62],blot:.4,seed:2.6}}]}},
     fset:{tiles:[{tex:'cf_plain',o:{soft:.55,con:.84,k:[.86,.8,.72],sat:.75}},{tex:'cf_crack',o:{soft:.55,con:.84,k:[.86,.8,.72],sat:.75}},{tex:'cf_damp',o:{soft:.55,con:.84,k:[.84,.8,.74],sat:.8}},{tex:'flagfloor',tag:'big',o:{k:[.8,.75,.68],sat:.72}},{tex:'cf_broken',o:{soft:.55,con:.84,k:[.84,.78,.7],sat:.75}},{tex:'earthfloor',tag:'c1',o:{k:[.66,.6,.52],sat:.7}},{tex:'cf_drain',o:{soft:.55,con:.84,k:[.86,.8,.72],sat:.75}}],
       pick:(x,y,n)=>{const h=hash2(x,y,71),nz=Math.sin(x*.61+y*.23)*.5+Math.sin(y*.53-x*.17+1.7)*.35+(hash2(x,y,72)-.5)*.4,nz2=Math.sin(x*.37-y*.41+.6)*.5+Math.sin(y*.29+x*.47+2.2)*.35+(hash2(x,y,73)-.5)*.4;if(h<.035)return 6;if(nz>.52)return 2;if(nz<-.5)return 5;if(nz2>.55)return 3;const r=hash2(x,y,74);return r<.5?0:r<.75?1:4}},soft:.3,
     ceil:{name:'cryptbeams',img:'ep_tex_beams',o:{k:[.9,.82,.72],sat:.6}},
     decals:{keys:['straw','droppings','soot','rubble','bones','shards','rag','grain','pebbles','wax'],p:.55,wallBias:.5,sz:[.45,.7],far:14,gain:[1.05,.98,.88],a:1,big:{keys:['soot','damp','rubble','bones','droppings','rag','straw','rubble','pebbles','damp','soot'],p:.46,sz:[1.1,1.8],gap:2.2,a:.95}},
     shadow:.82,shadowSz:1.35,tintVar:.09,glow:.62,glowSz:3.9,glowCol:[1,.6,.3],ao:.9,aoW:.64,lightK:1.3,
     lk:{barrel:d=>hash2(d.x,d.y,5)<.6?'ep_barrel2':null,coffin:d=>hash2(d.x,d.y,6)<.5?'ep_sarc_dk':'ep_coffin_dk',bones:'ep_bones_dk'},
     xlights:[[4.5,19.4,[1.3,.8,.45],.45],[16.5,16,[.85,.8,.82],.95],[15.5,18.5,[.85,.8,.82],.5],[15.5,16.3,[1.3,.8,.45],.62],[17.5,15.7,[1.3,.8,.45],.62],[16.5,18.3,[1.3,.8,.45],.45]],
     props:[{k:'candles',x:4,y:19,oy:.3,sc:.62},{k:'candles',x:15,y:16,ox:-.3,sc:.62},{k:'candles',x:17,y:16,ox:.3,sc:.62},{k:'candles',x:16,y:14,oy:-.3,sc:.7},{k:'candles',x:16,y:18,oy:.3,sc:.7},{k:'bonepile',x:13,y:19,ox:-.25,oy:.25},{k:'skel_slump',x:19,y:13,ox:.25,oy:-.25,sc:.9}],
     grade:{c:1.1,s:.88,b:1.08,tone:[160,115,70,.14],vig:.4,vc:[10,7,4]},amb:.14,flame:[.95,.7,.42,.85],warmRed:[1.3,.72,.44],
     pics:{p:.56,fixed:[[17,7,[1,0],'chains',.55,.55],[3,19,[0,1],'chains',.55,.55],[2,19,[0,1],'web_hang',.5,.7],[4,19,[0,1],'shelf',.3,.5],[13,3,[0,-1],'web_corner',.42,.76]],keys:[{k:'web_corner',h:.42,bob:.76,corner:1},{k:'web_hang',h:.5,bob:.7},{k:'chains',h:.55,bob:.55},{k:'ring',h:.16,bob:.45},{k:'soot',h:.5,bob:.6},{k:'shelf',h:.3,bob:.5}]},
     auto:{keys:['sacks','crate','rubble','ratnest','bucket','bonepile','planks','jar'],p:.75}},
  /* Thornwick: the first town (one main road through a forest clearing) */
  3:{night:1,tv:[{chars:'ABEFHI',keys:['tws1','tws2','tws3','tst12','twh3'],o:{sat:.8,k:[.92,.92,.9],foot:[.3,.45]}},{chars:'JKMNO',win:{tww1:[.34,.36,.66,.6,.9],tww3:[.38,.36,.62,.6,.9]},keys:['twh1','twh2','twh3','tww1','tww2','tww3'],o:{sat:.8,k:[.9,.9,.87],foot:[.3,.45]}},{chars:'k',keys:['tst1'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'l',keys:['tst2'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'m',keys:['tst3'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'n',keys:['tst4'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'o',keys:['tst5'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'q',keys:['tst6'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'r',keys:['tst7'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'s',keys:['tst8'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'u',keys:['tst9'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'v',keys:['tst10'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'ĉ',keys:['tst11'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'Ċ',keys:['tst12'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'ă',keys:['tst2'],o:{sat:.85,k:[.9,.9,.88],foot:[.3,.4]}},{chars:'PefwxyzĀāĂĄąĆćĈ',win:{tww1:[.34,.36,.66,.6,.9],tww3:[.38,.36,.62,.6,.9]},keys:['tww1','tww2','tww3','twh2','tww1','tww3'],o:{sat:.8,k:[.9,.9,.87],foot:[.3,.45]}}],
     track:{from:'2',rows:[17],cols:[5,45],base:2,tint:[1.32,1.3,1.38]},
     decals:{path:'6',pathKeys:['ruts','rutpuddle','hoof','ruts','paledirt','ruts'],pathP:.75,verge:['grass1','grass2','grass3','grass4','weeds1','weeds2','weeds3','bracken','grass2'],vergeP:.75,keys:['leaves','pebbles','droppings'],on:{0:['mud','straw','droppings','puddle','pebbles','leaves','soot'],1:['grass1','grass2','grass3','grass4','weeds1','weeds2','weeds4','strawmud','mud','leaves','grass3'],2:['grass1','grass2','weeds1','puddle','mud','strawmud','grass3','weeds2','droppings','grass4'],3:['mud','leaves','straw'],4:['mud','straw','soot','droppings'],5:['mud','puddle','straw']},p:.48,wallBias:.3,sz:[.5,.7],far:16,gain:[1,.95,.88],a:1},
     floorTint:{1:[.8,.84,.74],2:[1.12,1.06,.95]},soft:.75,softFine:1,shadow:.55,shadowSz:1.3,ao:.5,aoW:.5,nearFade:1,glow:.75,glowSz:2.6,glowCol:[1,.7,.42],
     grime:{k:.8,sat:.7,foot:.36,footK:.7,streak:.45,blot:.55,tint:[1,.96,.9],emis:.3,paneK:.62,night:{dark:.3}},jitter:[{re:/^fence$/,sc:0},{re:/^(pjuniper|pheather|pbracken|greeds|gfungus|bush)/,sc:.14},{re:/^(ptree|gtree)/,sc:.1}],
     grade:{c:1.06,s:.9,b:1.06,tone:[140,115,80,.08],vig:.26,vc:[12,10,8]},
     tufts:{on:'12',path:'6',tuftF:'sepia(.55) saturate(.9) hue-rotate(28deg) brightness(.6)',p:.9,n:420,far:2,base:.1,big:1,edgeOn:'603',edgeP:.45},street:{keys:['firewood','haybale','dung','wheel','flour','rainbarrel','veg','sacks','crate','bucket'],p:.5,gap:3,on:'12',notNear:'03456',fence:1,fenceRe:/^(fence|ptree|gtree|pjuniper|pbracken|grocks|gboulder|well)/}},
  /* the other early dungeons share the crypts' finish, each with its own stone (see epDungeon) */
  8:Object.assign(epDungeon('cave',8),EP_GANDRICK),23:epDungeon('cave',23),25:epDungeon('cave',25),9:epDungeon('crypt',9),12:epDungeon('crypt',12,{nofloor:1}),501:EP_WELL,11:EP_TUNNEL,18:epDungeon('mine',18),
  /* the deserts: a few painted palms by the oases, broken pieces at the ruins, lone bones far apart; the dunes themselves are not touched */
  41:{desert:{palms:[],ruins:['f2_de_amphora','f2_de_skull','f2_de_cairn'],bones:['f2_dx_oxskull','f2_de_skull','f2_de_cairn','f2_de_amphora'],oasisP:0,oasisN:1,ruinP:.35,ruinN:1,lone:8,loneGap:26}},
  43:{desert:{palms:[],ruins:['f2_de_amphora','f2_de_skull','f2_de_cairn'],bones:['f2_dx_oxskull','f2_de_skull','f2_de_cairn','f2_de_amphora'],oasisP:0,ruinP:.35,ruinN:1,lone:8,loneGap:26}},
  60:epDes(60),61:epDes(61),62:epDes(62),63:epDes(63),64:epDes(64),
  /* the early woods and roads */
  2:epWood(2,{}),7:epWood(7,{keepFloor:1}),10:epWood(10,{keepFloor:1}),
  /* Ironhill: the second town, a mining town (Thornwick's finish, sootier) */
  13:{night:1,tv:[{chars:'ABEFHI',keys:['ihs1','ihs2','ihs3','ihw3','ihh2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'vzĀćĈĉĊďĐđ,;:',win:{ihw1:[.38,.36,.62,.58,1.1],ihw3:[.38,.36,.62,.58,1.1]},keys:['ihh1','ihh2','ihh3','ihw1','ihw3'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'e',keys:['ihw2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'r',keys:['ihw2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'y',keys:['ihw2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'Ą',keys:['ihw2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'f',keys:['tst5'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'q',keys:['tst5'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'u',keys:['tst1'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'ā',keys:['tst5'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'ą',keys:['tst1'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'h',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'j',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'k',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'m',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'Ď',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'Ē',keys:['tst2'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'g',keys:['tst1'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'i',keys:['tst3'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'l',keys:['tst3'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'n',keys:['tst4'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'o',keys:['tst11'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'Ć',keys:['tst6'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'s',keys:['ihs1'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'Ă',keys:['ihs2'],o:{sat:.8,k:[1.3,1.26,1.2],foot:[.3,.35]}},{chars:'w',keys:['tst12'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'ă',keys:['tst12'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'ċ',keys:['tst8'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'Č',keys:['tst10'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},{chars:'č',keys:['tst7'],o:{sat:.8,k:[1.08,1.03,.96],foot:[.35,.45]}},],
     fixed:[['orecart',19,16,-.3],['coalsacks',27,16,-.3],['anvil',31,16,-.3],['coalheap',16,20,.3],['orecrate',22,20,.3],['toolrack',28,20,.32]],
     track:{from:'2',noNear:'0345',rows:[19],cols:[6,45],base:2,tint:[1.62,1.58,1.62]},
     decals:{path:'6',pathKeys:['ruts','rutpuddle','hoof','ruts','paledirt','hoof'],pathP:.7,verge:['grass1','grass2','weeds1','weeds2','grass4','weeds3','grass3'],vergeP:.7,keys:['leaves','pebbles','droppings'],on:{0:['mud','straw','droppings','puddle','soot','soot','pebbles'],1:['grass1','grass2','grass3','weeds1','weeds4','strawmud','mud','soot','grass4'],2:['grass1','grass2','weeds1','puddle','mud','soot','strawmud','droppings'],3:['mud','soot','straw'],4:['mud','straw','soot','droppings'],5:['mud','puddle','straw']},p:.45,wallBias:.3,sz:[.5,.7],far:16,gain:[1,.95,.88],a:1},
     floorTint:{1:[.8,.8,.72],2:[.9,.86,.8]},soft:.75,softFine:1,shadow:.6,shadowSz:1.3,ao:.6,aoW:.55,nearFade:1,glow:.75,glowSz:2.6,glowCol:[1,.7,.42],
     grime:{k:.82,sat:.62,foot:.4,footK:.75,streak:.55,blot:.6,tint:[.98,.95,.9],emis:.3,paneK:.6,night:{dark:.3}},jitter:[{re:/^fence$/,sc:0},{re:/^(pjuniper|pheather|pbracken|greeds|gfungus|bush|flora)/,sc:.14},{re:/^(ptree|gtree|tree)/,sc:.1}],
     grade:{c:1.08,s:.76,b:1.05,tone:[150,115,80,.14],vig:.36,vc:[12,10,8]},
     tufts:{on:'12',path:'6',tuftF:'sepia(.6) saturate(.7) hue-rotate(24deg) brightness(.52)',p:.85,n:520,far:2,base:.12,big:1,edgeOn:'603',edgeP:.4},
     street:{keys:['orecart','coalheap','coalsacks','toolrack','anvil','orecrate','brazier','coalheap','firewood','rubble','planks','sacks','crate','bucket','rainbarrel','wheel'],p:.6,gap:3,on:'12',notNear:'03456',fence:1,fenceRe:/^(fence|ptree|gtree|pjuniper|pbracken|grocks|gboulder|well)/}}
};
setTimeout(()=>{try{epLoad()}catch(e){}},4000); // the early polish pictures are small: fetch them soon after the start, so every first visit has them
/* the crate picture is wide and was pushed into the wall corner, so it was cut off: every ep_crate is smaller and kept near the middle of its square (done once per level load) */
{let _lastD=null;const _u=update;update=function(dt){try{if(G.decor&&G.decor!==_lastD){_lastD=G.decor;for(const d of G.decor)if(d.k==='ep_crate'&&!d._cf){d._cf=1;d.sc=Math.min(d.sc||1,.62);d.ox=(d.ox||0)*.35;d.oy=(d.oy||0)*.35}}}catch(e){}return _u.apply(this,arguments)}}
