/* ==========================================================================
   STONE BUTTONS. Every labelled menu button (btnText) is a painted slab with wrought-iron lettering.
   The slabs are pictures in assets/ui/<style>/ (cut from Gemini sheets by tools/ingest_ui.py, listed in UI_LIST by tools/inject.py). Styles:
   gold (golden sandstone, tapered ends), winged (gold with carved wings), filigree (polished sandstone, pointed ends, metal filigree, sapphires),
   filigreegold (the same in gold, garnets), tapered (polished sandstone), sandstone (refined, square ends), stone (rough grey), round (round
   iron-rimmed buttons for the small square ones), brick (the old code-drawn look).
   Each style has up to three bar families (std: long buttons; slim: shorter ones; small: square ones) in three states (n normal, l lit, p pressed).
   Sharpness: a slab is scaled ONCE to the pixel size it is drawn at (halving, then one last draw), cut into a left cap, a middle and a right cap
   that are copied 1:1 (the middle is cropped when short, and repeated in mirrored pieces, never smeared, when long), sharpened and given a one-pixel rim,
   and is blitted at whole pixels. The buttons are queued while the screen is drawn and painted AFTER the CRT pass (so the phosphor bloom does not
   soften them), with the scanlines laid lightly over them; a veil or a big panel drawn over earlier buttons paints them first, so layers stay right.
   The label is dynamic text, drawn crisp in code as forged iron: dark metal, a thin pale highlight on the upper edge, a small shadow on the stone.
   On the dark colour themes (ruby, green, brown: tools/recolor_ui.py; their manifest says "ink":"light") it is pale forged gold with a darker shadow instead.
   Hit areas are untouched (btn() is called exactly as before). If the pictures are missing the old brick buttons are drawn.
   The style and the lettering font are chosen on the Gameplay page (kept in G.flags.btnStyle / btnFont) or with ?btn=gold|winged|filigree|
   filigreegold|tapered|sandstone|stone|round|brick and ?font=cinzel|... in the address. Names start with stb.
   ========================================================================== */
const STB={styles:{},cache:new Map(),lab:new Map(),sc:{},lv:{},fl:[],mx:-99,my:-99,dx:-99,dy:-99,down:false,pt:'mouse',noise:null,sel:null,err:0,hf:null,last:null,scanA:.4,defer:true};
const STB_DEFAULT_STYLE='ruby',STB_DEFAULT_FONT='imfell';
/* the lettering faces (all Google Fonts, loaded by the <link> in the head); s evens out their sizes, w is the weight used for the iron letters, y nudges them up or down */
const STB_FONTS=[
  {k:'imfell',f:"'IM Fell English SC'",n:'IM Fell English SC',s:1,w:'',y:0,ls:.07},
  {k:'cinzel',f:"'Cinzel'",n:'Cinzel',s:.9,w:'700 ',y:0,ls:.05},
  {k:'cinzeldec',f:"'Cinzel Decorative'",n:'Cinzel Decorative',s:.84,w:'700 ',y:0,ls:.04},
  {k:'almendra',f:"'Almendra SC'",n:'Almendra SC',s:1.02,w:'',y:0,ls:.05,d:1},
  {k:'metamorphous',f:"'Metamorphous'",n:'Metamorphous',s:.9,w:'',y:0,ls:.04,d:1},
  {k:'uncial',f:"'Uncial Antiqua'",n:'Uncial Antiqua',s:.92,w:'',y:0,ls:.04},
  {k:'pirata',f:"'Pirata One'",n:'Pirata One',s:1.1,w:'',y:0,ls:.05},
  {k:'grenze',f:"'Grenze Gotisch'",n:'Grenze Gotisch',s:1.08,w:'600 ',y:0,ls:.04},
  {k:'unifraktur',f:"'UnifrakturCook'",n:'UnifrakturCook',s:1,w:'700 ',y:0,ls:.03},
  {k:'medieval',f:"'MedievalSharp'",n:'MedievalSharp',s:.92,w:'',y:0,ls:.04,d:1},
  {k:'texturina',f:"'Texturina'",n:'Texturina',s:.95,w:'600 ',y:0,ls:.04},
  {k:'unimag',f:"'UnifrakturMaguntia'",n:'UnifrakturMaguntia',s:1,w:'',y:0,ls:.03},
  {k:'almendraplain',f:"'Almendra'",n:'Almendra',s:1,w:'',y:0,ls:.04,d:1},
  {k:'almendradisp',f:"'Almendra Display'",n:'Almendra Display',s:.95,w:'',y:0,ls:.04,d:2},
  {k:'imfelldw',f:"'IM Fell DW Pica SC'",n:'IM Fell DW Pica SC',s:1,w:'',y:0,ls:.07},
  {k:'imfelldp',f:"'IM Fell Double Pica SC'",n:'IM Fell Double Pica SC',s:1,w:'',y:0,ls:.07},
  {k:'imfellfc',f:"'IM Fell French Canon SC'",n:'IM Fell French Canon SC',s:.95,w:'',y:0,ls:.07},
  {k:'imfellgp',f:"'IM Fell Great Primer SC'",n:'IM Fell Great Primer SC',s:1,w:'',y:0,ls:.07},
  {k:'cormunicase',f:"'Cormorant Unicase'",n:'Cormorant Unicase',s:1.08,w:'700 ',y:0,ls:.04},
  {k:'cormsc',f:"'Cormorant SC'",n:'Cormorant SC',s:1.06,w:'700 ',y:0,ls:.05},
  {k:'marcellus',f:"'Marcellus SC'",n:'Marcellus SC',s:.94,w:'',y:0,ls:.05,d:1},
  {k:'forum',f:"'Forum'",n:'Forum',s:1.02,w:'',y:0,ls:.05,d:1},
  {k:'germania',f:"'Germania One'",n:'Germania One',s:.9,w:'',y:0,ls:.04},
  {k:'jacquard',f:"'Jacquard 24'",n:'Jacquard 24',s:1.2,w:'',y:0,ls:.03},
  {k:'kings',f:"'Kings'",n:'Kings',s:1.05,w:'',y:0,ls:.04,d:2},
  {k:'caudex',f:"'Caudex'",n:'Caudex',s:1,w:'700 ',y:0,ls:.04},
  {k:'aladin',f:"'Aladin'",n:'Aladin',s:1.05,w:'',y:0,ls:.04},
  {k:'newrocker',f:"'New Rocker'",n:'New Rocker',s:1,w:'',y:0,ls:.03},
  {k:'cardo',f:"'Cardo'",n:'Cardo',s:1,w:'700 ',y:0,ls:.05},
  {k:'spectral',f:"'Spectral SC'",n:'Spectral SC',s:.95,w:'700 ',y:0,ls:.05}];
const STB_URL=(()=>{try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams('')}})();
STB.ls={};try{STB.ls=JSON.parse(localStorage.getItem('bta_buttons')||'{}')||{}}catch(e){STB.ls={}}
function stbStyleNames(){return UI_LIST.order.concat(['brick'])}
function stbStyleLabel(k){return k==='brick'?'Old brick':(UI_LIST.styles[k]?UI_LIST.styles[k].label:k)}
function stbWantStyle(){
  const ok=k=>k&&(k==='brick'||UI_LIST.styles[k]);
  const k=[G.flags&&G.flags.btnStyle,STB_URL.get('btn'),STB.ls.s,STB_DEFAULT_STYLE].find(ok);
  return k||UI_LIST.order[0]||'brick'}
function stbWantFont(){
  const ok=k=>k&&STB_FONTS.some(f=>f.k===k);
  const k=[G.flags&&G.flags.btnFont,STB_URL.get('font'),STB.ls.f,STB_DEFAULT_FONT].find(ok);
  return STB_FONTS.find(f=>f.k===k)||STB_FONTS[0]}
/* the pictures of a style: the one in use is loaded with the game (loadImg, so the loading bar waits for it), the others when they are first chosen */
function stbStyle(k,boot){
  let S=STB.styles[k];if(S)return S;
  const m=UI_LIST.styles[k];if(!m)return null;
  S=STB.styles[k]={k,m,names:Object.keys(m.files||{}),ready:false,failed:false};
  if(!S.names.length){S.failed=true;return S}
  for(const n of S.names){
    const key='stb_'+k+'_'+n,src='assets/ui/'+k+'/'+m.files[n].file;
    if(boot&&typeof loadImg==='function')loadImg(key,src);
    else{const im=new Image();im.onload=()=>{IMG[key]=im};im.onerror=()=>{S.failed=true};im.decoding='async';im.src=src+'?v='+(typeof VERSION!=='undefined'?VERSION:'1')}}
  if(m.fallback)stbStyle(m.fallback,boot);
  return S}
function stbReady(S){
  if(!S)return false;if(S.ready)return true;if(S.failed)return false;
  for(const n of S.names)if(!IMG['stb_'+S.k+'_'+n])return false;
  S.ready=true;return true}
function stbGet(k){const S=stbStyle(k,false);return S&&stbReady(S)?S:null}
/* where the pointer is: hover lights a slab, holding the button down presses it */
cv.addEventListener('pointermove',e=>{const p=toDesign(e);STB.mx=p[0];STB.my=p[1];STB.pt=e.pointerType||'mouse'},{passive:true});
cv.addEventListener('pointerdown',e=>{const p=toDesign(e);STB.mx=STB.dx=p[0];STB.my=STB.dy=p[1];STB.down=true;STB.pt=e.pointerType||'mouse'},{passive:true});
cv.addEventListener('pointerleave',()=>{STB.mx=STB.my=-99});
addEventListener('pointerup',e=>{STB.down=false;if(e.pointerType==='touch')STB.mx=STB.my=-99});
addEventListener('pointercancel',()=>{STB.down=false;STB.mx=STB.my=-99});
function stbIn(px,py,x,y,w,h){return px>=x&&px<x+w&&py>=y&&py<y+h}
function stbState(id,x,y,w,h){
  const pr=(STB.down&&stbIn(STB.dx,STB.dy,x,y,w,h)&&stbIn(STB.mx,STB.my,x,y,w,h))||(id&&G.presses&&G.presses.some(p=>p.id===id&&G.time-p.t<.14));
  if(pr)return 'p';
  let lit=STB.pt!=='touch'&&stbIn(STB.mx,STB.my,x,y,w,h);
  try{if(!lit&&id&&PAD.name&&PAD.act&&PAD.focus===id)lit=true}catch(e){}
  if(!lit&&id&&STB.sel&&STB.sel(id))lit=true;
  return lit?'l':'n'}
/* ---- the picture: scaled once, cut into caps and a middle, sharpened, rimmed ---- */
function stbSrc(key,im,Hd){ // reduce by halves until the next halving would be shorter than the height wanted
  let c=im,w=im.naturalWidth,h=im.naturalHeight,lv=0;
  while(h/2>=Hd&&h>=4){
    const nk=key+'@'+(lv+1);let n=STB.lv[nk];
    if(!n){n=document.createElement('canvas');n.width=Math.round(w/2);n.height=Math.round(h/2);const x=n.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(c,0,0,n.width,n.height);STB.lv[nk]=n}
    c=n;w=n.width;h=n.height;lv++}
  return c}
function stbScaled(S,fam,st,Hp){ // the whole slab, at the scale where its body (the button rectangle) is Hp tall
  const key='stb_'+S.k+'_'+fam+'_'+st,F=S.m.fam[fam],im=IMG[key],bh=F.bh||im.naturalHeight,k=Hp/bh,ck=key+'#'+Hp;
  let c=STB.sc[ck];if(c)return {c,k};
  const W=Math.max(2,Math.round(im.naturalWidth*k)),H=Math.max(2,Math.round(im.naturalHeight*k));
  const src=stbSrc(key,im,H);c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,0,0,W,H);
  STB.sc[ck]=c;return {c,k}}
/* unsharp mask on the colour (blur weighted by alpha), then a one-pixel dark rim along the outline: the edges stay hard at any size */
function stbCrisp(c,amt){
  const x=c.getContext('2d'),W=c.width,H=c.height,id=x.getImageData(0,0,W,H),d=id.data,o=new Uint8ClampedArray(d);
  for(let y=1;y<H-1;y++)for(let xx=1;xx<W-1;xx++){
    const i=(y*W+xx)*4,a=d[i+3];if(a<20)continue;
    let r=0,g=0,b=0,s=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const j=i+(dy*W+dx)*4,w=(dx===0&&dy===0?2:1)*d[j+3];r+=d[j]*w;g+=d[j+1]*w;b+=d[j+2]*w;s+=w}
    if(s>0){o[i]=d[i]+amt*(d[i]-r/s);o[i+1]=d[i+1]+amt*(d[i+1]-g/s);o[i+2]=d[i+2]+amt*(d[i+2]-b/s)}}
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){
    const i=(y*W+xx)*4;if(d[i+3]<128)continue;
    const edge=xx===0||y===0||xx===W-1||y===H-1||d[i-4+3]<128||d[i+4+3]<128||d[i-W*4+3]<128||d[i+W*4+3]<128;
    if(edge){o[i]=34;o[i+1]=22;o[i+2]=12;o[i+3]=255}}
  id.data.set(o);x.putImageData(id,0,0)}
function stbFace(S,fam,st,Wp,Hp){
  const key=S.k+'|'+fam+'|'+st+'|'+Wp+'|'+Hp;let f=STB.cache.get(key);if(f)return f;
  if(STB.cache.size>260)STB.cache.clear();
  const F=S.m.fam[fam],{c:sc,k}=stbScaled(S,fam,st,Hp),wl=Math.round((F.wl||0)*k),wt=Math.round((F.wt||0)*k),SW=sc.width,SH=sc.height;
  const CW=Wp+2*wl,CH=Math.max(SH,Hp+wt),dy=CH-SH;
  let capD=wl+Math.round(F.cap*Hp);if(capD*2>CW*.94)capD=Math.floor(CW*.47);
  const c=document.createElement('canvas');c.width=CW;c.height=CH;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  x.drawImage(sc,0,0,capD,SH,0,dy,capD,SH);                      // caps: copied pixel for pixel
  x.drawImage(sc,SW-capD,0,capD,SH,CW-capD,dy,capD,SH);
  const midS=SW-2*capD,midD=CW-2*capD;
  if(midD>0){
    if(midS<=0)x.drawImage(sc,0,0,SW,SH,0,dy,CW,SH);               // a round button: the whole picture, stretched a little
    else if(midD<=midS)x.drawImage(sc,capD+Math.floor((midS-midD)/2),0,midD,SH,capD,dy,midD,SH); // short: the centre is cropped
    else{                                                             // long: pieces of the middle, every other one mirrored, each stretched at most 1.3 times
      const n=Math.ceil(midD/(1.3*midS));
      for(let i=0;i<n;i++){
        const a=capD+Math.round(i*midD/n),b=capD+Math.round((i+1)*midD/n),w=b-a;if(w<=0)continue;
        if(i%2){x.save();x.translate(a+w,0);x.scale(-1,1);x.drawImage(sc,capD,0,midS,SH,0,dy,w,SH);x.restore()}
        else x.drawImage(sc,capD,0,midS,SH,a,dy,w,SH)}}}
  stbCrisp(c,.75);
  f={c,ox:wl,oy:CH-Hp};STB.cache.set(key,f);return f}
/* ---- the lettering: forged iron, crisp ---- */
function stbNoise(){
  if(STB.noise)return STB.noise;
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');let s=7;const R=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let i=0;i<260;i++){const v=R();x.fillStyle=v<.55?'rgba(0,0,0,'+(.14+R()*.2)+')':'rgba(180,186,196,'+(.08+R()*.14)+')';x.fillRect(Math.floor(R()*64),Math.floor(R()*64),1,1)}
  STB.noise=c;return c}
/* a lettering face is ready when it has been loaded (it is asked for as soon as it is wanted; until then the game's own face stands in) */
function stbFontOk(F){
  if(F.ok)return true;
  if(!F.req){F.req=true;
    try{document.fonts.load((F.w||'')+'16px '+F.f).then(()=>{F.ok=true;STB.lab.clear()},()=>{F.ok=true;STB.lab.clear()})}catch(e){F.ok=true}}
  return !!F.ok}
function stbFontNow(){
  let F=stbWantFont();
  if(!stbFontOk(F)){const d=STB_FONTS[0];F=stbFontOk(d)?d:{k:'sys',f:'Georgia',n:'Georgia',s:.95,w:'',y:0,ls:.05,sys:1}}
  STB.hf=F.k==='imfell'||F.sys?null:F.f+",Georgia,serif";
  return F}
function stbLabel(s,fsPx,maxWpx,Fo,ink){
  const LI=ink==='light';   // a dark colour theme (manifest "ink":"light"): pale forged metal, a darker shadow; everything else is unchanged
  const key=Fo.k+'|'+s+'|'+Math.round(fsPx*4)+'|'+Math.round(maxWpx)+(LI?'|L':'');let L=Fo.sys?null:STB.lab.get(key);if(L)return L;
  if(STB.lab.size>500)STB.lab.clear();
  const fam=Fo.f+',Georgia,serif',meas=document.createElement('canvas').getContext('2d'),hasLS='letterSpacing' in meas;
  const setf=(x,px)=>{x.font=Fo.w+px+'px '+fam;if(hasLS)x.letterSpacing=(px*Fo.ls).toFixed(2)+'px'};
  setf(meas,fsPx);let tw=meas.measureText(s).width;
  if(tw>maxWpx){fsPx*=maxWpx/tw;setf(meas,fsPx);tw=meas.measureText(s).width}
  const capH=Math.max(4,meas.measureText('H').actualBoundingBoxAscent||fsPx*.68),pad=4,cw=Math.ceil(tw)+pad*2+3,ch=Math.ceil(fsPx*1.3)+pad*2,base=Math.round(ch/2+capH/2+Fo.y*fsPx);
  const od=Fo.d===2?[[0,0],[1,0],[0,1],[1,1]]:Fo.d?[[0,0],[1,0]]:[[0,0]];   // a thin face is struck two or four times, a pixel apart, to give it iron weight
  const mk=()=>{const c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d');setf(x,fsPx);x.textAlign='left';x.textBaseline='alphabetic';return [c,x]};
  const [B,bx]=mk(),g=bx.createLinearGradient(0,base-capH,0,base);       // the iron: dark blue-black, a little paler at the top
  if(LI){g.addColorStop(0,'#fff6d6');g.addColorStop(.5,'#ecd79e');g.addColorStop(1,'#bb9b5c')}else{g.addColorStop(0,'#454850');g.addColorStop(.5,'#26282d');g.addColorStop(1,'#121315')}bx.fillStyle=g;for(const o of od)bx.fillText(s,pad+o[0],base+o[1]);   // a thin face is struck twice, one pixel apart, to give it iron weight
 
  bx.globalCompositeOperation='source-atop';bx.fillStyle=bx.createPattern(stbNoise(),'repeat');bx.globalAlpha=LI?.3:.55;bx.fillRect(0,0,cw,ch);bx.globalAlpha=1;
  const [H,hx]=mk();hx.fillStyle='#000';for(const o of od)hx.fillText(s,pad+o[0],base+o[1]);hx.globalCompositeOperation='destination-out';for(const o of od)hx.fillText(s,pad+o[0],base+o[1]+1);   // the upper edge of every stroke
  hx.globalCompositeOperation='source-in';hx.fillStyle=LI?'rgba(255,253,238,.95)':'rgba(244,206,140,.9)';hx.fillRect(0,0,cw,ch);
  bx.globalCompositeOperation='source-over';bx.drawImage(H,0,0);
  const [F,fx]=mk();fx.fillStyle=LI?'rgba(12,3,5,.85)':'rgba(70,40,12,.5)';for(const o of od){fx.fillText(s,pad+o[0],base+o[1]+1);fx.fillText(s,pad+o[0]+1,base+o[1]+1);if(LI){fx.fillText(s,pad+o[0]+1,base+o[1]);fx.fillText(s,pad+o[0]-1,base+o[1]+1)}}      // a small shadow on the stone, below and to the right
  fx.drawImage(B,0,0);
  L={c:F,w:cw,h:ch,gx:pad+tw/2,gy:base-capH/2};if(!Fo.sys)STB.lab.set(key,L);return L}
/* ---- queue, resolve, paint ---- */
function stbDraw(id,label,x,y,w,h){
  const want=stbWantStyle();if(want==='brick')return false;
  if(!stbGet(want)&&!(STB.last&&stbGet(STB.last)))return false;
  STB.fl.push({id,label:String(label),x,y,w,h,m:ctx.getTransform(),a:ctx.globalAlpha,st:stbState(id,x,y,w,h),want});
  if(!STB.defer)stbFlush(false);
  return true}
/* the two wing strips of a button (left and right of the bar, from the top of the wings to the bottom of the bar), in design units */
function stbStrips(e,F){const k=e.h/F.bh,wl=F.wl*k,wt=F.wt*k;return [[e.x-wl,e.y-wt,wl,e.h+wt],[e.x+e.w,e.y-wt,wl,e.h+wt]]}
function stbHit(a,b,g){return a[0]<b[0]+b[2]+g&&a[0]+a[2]>b[0]-g&&a[1]<b[1]+b[3]+g&&a[1]+a[3]>b[1]-g}
/* wings are drawn only where there is room: inside the screen, clear of every other button and of the wings another bar could have */
function stbWingFit(e,F,list){
  const A=stbStrips(e,F);
  for(const s of A)if(s[0]<1||s[0]+s[2]>DW-1||s[1]<1)return false;
  for(const o of list){if(o===e)continue;
    const body=[o.x,o.y,o.w,o.h];
    for(const s of A){if(stbHit(s,body,.5))return false;
      if(o.w/o.h>=2.4)for(const t of stbStrips(o,F))if(stbHit(s,t,-.5))return false}}
  return true}
/* which style and family draws this button: the style asked for, or its fallback when it has no picture of the right kind or its wings would not fit */
function stbResolve(e,list){
  let S=stbGet(e.want);
  if(S)STB.last=e.want;else S=STB.last&&stbGet(STB.last);
  if(!S)return null;
  for(let hop=0;hop<3&&S;hop++){
    const F=S.m.fam,ar=e.w/e.h,fams=ar>=2.1?(ar>=4.4?['std','slim']:['slim','std']):['round','small','slim','std'];
    const fam=fams.find(f=>F[f]);
    if(fam&&!(F[fam].wl&&(ar<2.4||!stbWingFit(e,F[fam],list))))return {S,fam};
    S=S.m.fallback?stbGet(S.m.fallback):null}
  return null}
function stbPaint(e,list,post){
  const R=stbResolve(e,list);if(!R)return;
  const {S,fam}=R,F=S.m.fam[fam],m=e.m,sx=m.a,sy=m.d,Fo=stbFontNow();
  const Wp=Math.max(8,Math.round(e.w*sx)),Hp=Math.max(8,Math.round(e.h*sy)),dx=Math.round(m.a*e.x+m.e),dy=Math.round(m.d*e.y+m.f);
  const face=stbFace(S,fam,e.st,Wp,Hp),fx=dx-face.ox,fy=dy-face.oy;
  ctx.globalAlpha=e.a;ctx.drawImage(face.c,fx,fy);
  if(e.label){
    const sym=e.label.length===1&&!/[A-Za-z0-9]/.test(e.label),lb=(e.label==='-'||e.label==='−')?'–':e.label;   // a lone sign is drawn big, or it disappears
    const fsL=Math.min(13.6,Math.max(7,e.h*.52))*Fo.s*(sym?1.6:1),padL=F.pad*e.h,availW=Math.max(e.w*.5,e.w-2*padL-3);
    const lab=stbLabel(lb,fsL*1.08*sx,availW*sx,Fo,S.m.ink),off=e.st==='p'?1:0;
    ctx.drawImage(lab.c,Math.round(dx+Wp/2-lab.gx),Math.round(dy+Hp/2+off-lab.gy))}
  if(post&&typeof SCANP!=='undefined'&&SCANP&&GFX.scan&&STB.scanA>0){ctx.globalAlpha=e.a*STB.scanA;ctx.fillStyle=SCANP[GFX.scan];ctx.fillRect(fx,fy,face.c.width,face.c.height)}
  ctx.globalAlpha=1}
function stbFlush(post){
  const fl=STB.fl;if(!fl.length)return;STB.fl=[];
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  for(const e of fl){try{stbPaint(e,fl,post)}catch(err){if(!STB.err){STB.err=1;console.warn('stone buttons',err)}}}
  ctx.restore()}
{const _ui=ui;ui=function(){STB.fl=[];return _ui.apply(this,arguments)}}                 // a new frame: nothing queued
{const _cp=crtPass;crtPass=function(){_cp.apply(this,arguments);stbFlush(true)}}          // painted after the CRT pass
{const _vl=veil;veil=function(){stbFlush(false);return _vl.apply(this,arguments)}}      // a veil or big panel drawn over earlier buttons: they are painted first
{const _bp=bigPanel;bigPanel=function(){stbFlush(false);return _bp.apply(this,arguments)}}
{const _bt=btnText;btnText=function(id,label,x,y,w,h){
  let ok=false;try{ok=stbDraw(id,label,x,y,w,h)}catch(e){ok=false;if(!STB.err){STB.err=1;console.warn('stone buttons',e)}}
  if(ok){btn(id,x,y,w,h);return}
  return _bt.apply(this,arguments)}}
/* a button face and label only (the caller registers the hit area itself): used where a button is drawn by hand; falls back to the old drawing */
function stoneFace(id,label,x,y,w,h,col,size){
  let ok=false;try{ok=stbDraw(id,label,x,y,w,h)}catch(e){ok=false}
  if(!ok){panel(x,y,w,h,false,false);txt(label,x+w/2,y+h/2,size||9,col||'#cdbf94','center',true)}}
function stoneBtn(id,label,x,y,w,h){btnText(id,label,x,y,w,h)}
/* the round style also gives the small square panels (arrows, slots, close) a round iron-rimmed face; the icons are drawn on top as before */
{const _pn=panel;panel=function(x,y,w,h,pressed,glow){
  if(w>=28&&h>=28&&w<=72&&h<=72&&w/h>=.8&&w/h<=1.4&&stbWantStyle()==='round'){
    const S=stbGet('round');
    if(S&&S.m.fam.round){
      const m=ctx.getTransform(),Wp=Math.round(w*m.a),Hp=Math.round(h*m.d),dx=Math.round(m.a*x+m.e),dy=Math.round(m.d*y+m.f),st=pressed?'p':(glow||stbIn(STB.mx,STB.my,x,y,w,h)&&STB.pt!=='touch')?'l':'n';
      const face=stbFace(S,'round',st,Wp,Hp);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(face.c,dx-face.ox,dy-face.oy);ctx.restore();return}}
  return _pn.apply(this,arguments)}}
/* menu headings (gold, centred, bold, large) follow the chosen lettering face; the game's own face stays when it is the default */
{const _tx=txt;txt=function(s,x,y,size,col,align,bold,font,maxW){
  if(STB.hf&&!font&&bold&&size>=12&&align==='center'&&col==='#d8c88e'){font=STB.hf;if(!maxW)maxW=400}
  return _tx.call(this,s,x,y,size,col,align,bold,font,maxW)}}
/* the two switches on the Gameplay page: Button style and Button font (both cycle, both are kept in the save flags and remembered for new games) */
function stbGameplayRows(y,h,step){
  const S=stbWantStyle(),Fo=stbWantFont(),L=stbStyleNames(),si=L.indexOf(S)+1,fi=STB_FONTS.indexOf(Fo)+1;
  txt('Button style  '+si+'/'+L.length,84,y+h/2,8.6,'#d8c9a0','left',false,undefined,96);
  btnText('gp_sprev','<',184,y,24,h);btnText('gp_style',stbStyleLabel(S),212,y,122,h);btnText('gp_snext','>',338,y,24,h);
  txt('Button font  '+fi+'/'+STB_FONTS.length,84,y+step+h/2,8.6,'#d8c9a0','left',false,undefined,96);
  btnText('gp_fprev','<',184,y+step,24,h);btnText('gp_font',Fo.n,212,y+step,122,h);btnText('gp_fnext','>',338,y+step,24,h)}
function stbRemember(){try{localStorage.setItem('bta_buttons',JSON.stringify(STB.ls))}catch(e){}}
{const _hb=handleBtn;handleBtn=function(id){
  if(G.menu==='gameplay'&&/^gp_(style|font|sprev|snext|fprev|fnext)$/.test(id)){
    if(!G.flags)G.flags={};
    if(id==='gp_style'||id==='gp_sprev'||id==='gp_snext'){
      const L=stbStyleNames(),d=id==='gp_sprev'?-1:1,n=L[(L.indexOf(stbWantStyle())+d+L.length)%L.length];
      G.flags.btnStyle=n;STB.ls.s=n;stbStyle(n,false)}
    else{
      const d=id==='gp_fprev'?-1:1,w=stbWantFont(),n=STB_FONTS[(STB_FONTS.indexOf(w)+d+STB_FONTS.length)%STB_FONTS.length];
      G.flags.btnFont=n.k;STB.ls.f=n.k;stbFontOk(n)}
    stbRemember();STB.cache.clear();return}
  return _hb.apply(this,arguments)}}
stbStyle(stbWantStyle(),true);stbFontOk(stbWantFont());stbFontOk(STB_FONTS[0]);
