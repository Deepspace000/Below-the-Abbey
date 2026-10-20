/* ==========================================================================
   MARGINALIA, painted. Small manuscript drolleries (goats, llamas and ducks, with a few trees and trefoil flowers) painted in the style of the
   Luttrell Psalter, kept in assets/mg (cut from Gemini sheets by tools/ingest_mg.py, listed in MG_LIST by tools/inject.py).
   They replace the old code-drawn marginalia (marginalia_a..e.js): mpmgDraw is taken over here and ignores everything registered with mpmgAdd.
   Each map gets two or three pictures, chosen by the map's theme and a hash of its level number, put into EMPTY parchment in the margins:
   the finished sheet is read back, a map of busy squares is made (ink, text, drawing), and a picture is only put where its box is empty.
   Names start with mpmgi.
   ========================================================================== */
const MPMGI={img:{},ready:false,pending:0,done:0,started:false};
/* which pictures suit which kind of map (names are the keys of MG_LIST) */
const MPMGI_POOL={
  sea:['theme_0','theme_1','scene_5','duck_1','duck_4','goat_3','llama_2','deco_6','deco_7'],
  desert:['theme_2','theme_3','scene_1','llama_0','llama_4','goat_0','goat_2','duck_3','deco_4','deco_6'],
  town:['theme_6','theme_7','scene_0','scene_3','llama_5','llama_4','goat_5','goat_2','duck_5','duck_4','llama_2','duck_2','deco_8'],
  dungeon:['theme_4','theme_5','scene_4','scene_2','goat_1','goat_4','llama_1','llama_3','duck_0','duck_2','duck_3'],
  land:['scene_6','scene_7','scene_8','scene_3','scene_2','goat_0','goat_1','goat_3','goat_4','duck_0','duck_1','duck_3','llama_0','llama_1','llama_3','deco_1','deco_2','deco_5','deco_8','deco_0','theme_8']
};
function mpmgiKind(lv){
  if([300,301,302,303,304,320,322].includes(lv))return 'sea';
  if([41,42,43,44,60,61,62,63,64,290].includes(lv)||(lv>=311&&lv<=316&&false))return 'desert';
  if(lv===1||lv===18||lv===20||(lv>=440&&lv<=459))return 'dungeon';
  if([3,13,32,33,305,364,411,430].includes(lv))return 'town';
  return 'land'}
function mpmgiSpecies(n){return n.replace(/_\d+$/,'')}
/* the pictures are loaded once, at start-up; when the last one is in, every cached map sheet is thrown away so it is drawn again with them */
function mpmgiLoad(){
  if(MPMGI.started||typeof MG_LIST==='undefined')return;MPMGI.started=true;const names=Object.keys(MG_LIST);MPMGI.pending=names.length;
  for(const k of names){const im=new Image();im.onload=im.onerror=()=>{MPMGI.done++;if(MPMGI.done>=MPMGI.pending){MPMGI.ready=true;mpmgiInvalidate()}};
    im.decoding='async';im.src='assets/mg/'+MG_LIST[k][0]+'?v='+(typeof VERSION!=='undefined'?VERSION:'1');MPMGI.img[k]=im}}
function mpmgiInvalidate(){
  try{for(const k of Object.keys(MPL.CACHE))delete MPL.CACHE[k]}catch(e){}
  try{if(typeof MPPILG!=='undefined')MPPILG.cv=null}catch(e){}
  try{if(typeof HGM!=='undefined')HGM.cv=null}catch(e){}
  try{if(typeof MPKH!=='undefined')MPKH.cache=null}catch(e){}}
/* a map of the busy squares of the finished sheet: 1 where there is ink, text, a panel edge or a strong colour change, 0 on plain parchment */
function mpmgiBusy(x){
  const cv=x.canvas,S=cv.width/DW,W=cv.width,H=cv.height;let d;try{d=x.getImageData(0,0,W,H).data}catch(e){return null}
  const bw=DW,bh=DH,busy=new Uint8Array(bw*bh),lum=i=>d[i]*.3+d[i+1]*.59+d[i+2]*.11;
  for(let by=0;by<bh;by++)for(let bx=0;bx<bw;bx++){
    let mn=255,mx=0,sum=0,n=0,dark=0;const x0=Math.floor(bx*S),y0=Math.floor(by*S),x1=Math.floor((bx+1)*S),y1=Math.floor((by+1)*S),st=Math.max(1,Math.floor(S/3));
    for(let yy=y0;yy<y1;yy+=st)for(let xx=x0;xx<x1;xx+=st){const l=lum((yy*W+xx)*4);if(l<mn)mn=l;if(l>mx)mx=l;sum+=l;n++;if(l<105)dark++}
    busy[by*bw+bx]=(mx-mn>34||dark>0)?1:0}
  /* integral image for fast box counts */
  const I=new Int32Array((bw+1)*(bh+1));for(let y=0;y<bh;y++){let r=0;for(let x2=0;x2<bw;x2++){r+=busy[y*bw+x2];I[(y+1)*(bw+1)+x2+1]=I[y*(bw+1)+x2+1]+r}}
  return {I,bw,bh,box(a,b,w,h){a=Math.max(0,Math.floor(a));b=Math.max(0,Math.floor(b));const a2=Math.min(bw,Math.ceil(a+w)),b2=Math.min(bh,Math.ceil(b+h));return I[b2*(bw+1)+a2]-I[b*(bw+1)+a2]-I[b2*(bw+1)+a]+I[b*(bw+1)+a]}}}
/* the places a picture may not go whatever the sheet shows: the border, the World map and Exit buttons, the foot bar and the buttons under the map */
const MPMGI_NO=[[0,0,480,12],[0,0,12,320],[468,0,12,320],[324,2,152,26],[0,300,480,20]];
/* maps whose sheet cannot be read for empty parchment (a textured ground, or a scenic side panel): the only places pictures may go, in sheet units [x,y,w,h]; none = no pictures */
const MPMGI_ONLY={44:[],470:[[14,70,76,226],[374,226,92,70]]};
function mpmgiPick(lv){
  const kind=mpmgiKind(lv),pool=MPMGI_POOL[kind].filter(n=>MG_LIST[n]),out=[];let s=lv*97+13;const rnd=()=>{s=Math.imul(s^(s>>>15),2246822519)>>>0;s=Math.imul(s^(s>>>13),3266489917)>>>0;return((s^(s>>>16))>>>0)/4294967296};
  const used={};const take=(lst)=>{const c=lst.filter(n=>!used[mpmgiSpecies(n)]);const l=c.length?c:lst;const n=l[Math.floor(rnd()*l.length)];used[mpmgiSpecies(n)]=1;out.push(n)};
  take(pool.filter(n=>/^(theme|scene)/.test(n)).length?pool.filter(n=>/^(theme|scene)/.test(n)):pool);
  take(pool.filter(n=>/^(goat|llama|duck)/.test(n)&&!used[mpmgiSpecies(n)]));
  take(pool.filter(n=>/^(goat|llama|duck|deco)/.test(n)&&!used[mpmgiSpecies(n)]));
  return out}
function mpmgiDraw(x,lv){
  if(!MPMGI.started)mpmgiLoad();if(!MPMGI.ready)return;
  const Z=MPMGI_ONLY[lv];if(Z&&!Z.length)return;const B=mpmgiBusy(x);if(!B)return;const picks=mpmgiPick(lv),placed=[],A=MPL.AREA;
  const free=(a,b,w,h)=>{if(a<12||b<12||a+w>468||b+h>300)return false;for(const r of MPMGI_NO)if(a<r[0]+r[2]&&a+w>r[0]&&b<r[1]+r[3]&&b+h>r[1])return false;
    for(const p of placed)if(a<p[0]+p[2]+4&&a+w>p[0]-4&&b<p[1]+p[3]+4&&b+h>p[1]-4)return false;
    if(Z)return Z.some(r=>a>=r[0]&&b>=r[1]&&a+w<=r[0]+r[2]&&b+h<=r[1]+r[3]);
    return B.box(a-1.5,b-1.5,w+3,h+3)===0};
  let want=3,n=0;
  for(const name of picks){
    if(n>=want)break;const im=MPMGI.img[name],m=MG_LIST[name];if(!im||!im.complete||!im.naturalWidth)continue;
    let hit=null;
    for(const k of [.19,.16,.13]){
      const w=m[1]*k,h=m[2]*k;
      /* the best-scoring free spot over the whole sheet: near an outer edge, away from the other pictures, never inside the framed drawing area unless nothing else is free */
      let all=null;for(let b=12;b+h<=300;b+=3)for(let a=12;a+w<=468;a+=3){if(!free(a,b,w,h))continue;
        const edge=Math.min(a-12,468-(a+w),b-12,300-(b+h)),inA=a+w>A.x&&a<A.x+A.w&&b+h>A.y&&b<A.y+A.h;if(inA&&!Z)continue;let sc=edge+(inA?200:0)+((a*7+b*13+lv*5)%23);
        for(const p of placed){const dx=(a+w/2)-(p[0]+p[2]/2),dy=(b+h/2)-(p[1]+p[3]/2),dd=Math.hypot(dx,dy);if(dd<150)sc+=(150-dd)*.8}
        if(!all||sc<all.sc)all={a,b,w,h,sc}}
      if(all){hit=all;break}}
    if(!hit)continue;
    x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.globalAlpha=.97;
    x.drawImage(im,hit.a,hit.b,hit.w,hit.h);x.restore();placed.push([hit.a,hit.b,hit.w,hit.h]);n++}}
/* take over mpmgDraw: the old code-drawn marginalia registered with mpmgAdd stay silent */
mpmgDraw=function(x,lv){try{x.save();mpmgiDraw(x,lv);x.restore()}catch(e){console.error('marginalia_img',lv,e)}};
mpmgiLoad();
