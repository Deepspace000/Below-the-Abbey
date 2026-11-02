/* ==========================================================================
   THORNWICK: THE ROOFS (prefix TKR). Level 3, the first town, whose houses are one storey (walls 1.55 high) under the open sky.
   Every house, the inn and the chapel has a real pitched roof that stands exactly on its walls, drawn by the same projection as the walls themselves, so it
   cannot slide, lean or hang out over the street as the party walks:
   - after the wall pass of render3D (index.html calls TKR3D_R just before it puts the 3D picture on screen), every screen column (at twice the width of the
     wall picture) sends its own ray through the roofs: each roof is a solid (a gable roof over the exact wall squares of its house, a chimney stack, the
     chapel's tower and spire), the ray finds the first solid it meets at every row above the top of the nearest wall, and that point is painted;
   - so the eaves meet the wall top in every column, the gable triangle is the wall carried up, the slopes rise behind the eaves in true perspective, the
     chimneys stand on the slopes, and a roof behind a nearer house shows only above that house;
   - the pictures are painted (Gemini, strict front elevation, ART-HOLD/tkr_sheets, cut by tools/tkr_ingest.py into assets/tkr): slate, shingle, thatch and
     clay tile slopes (eave at the bottom, ridge row at the top), four gable ends with bargeboards, a brick and a stone chimney stack, the tower face and the
     spire; code only picks the piece and the place in it, and shades it (the slope turned to the light is lighter, the far roofs fade into the haze like the walls);
   - under each roof a dark eave line and a short soft shadow lie on the top of the wall (only where the roof is above it);
   - no roof reaches past its walls (no overhang: the squares beside the houses are all walkable), and the houses a party buys (housing.js) keep their own roofs.
   IRONHILL (level 13, from 3.770) uses the same machinery: TKR.sets holds one house table per level and the wall height the roofs stand on (Thornwick's houses are 1.55
   high, Ironhill's 2.0; the number must match the wall pass in index.html, 'const wh='). Its church has a tower, spire and cross (an option of its table row),
   and the mayor's residence has a castle top instead of a pitched roof: a crenellated parapet (the painted tower stone with the gaps between the merlons cut out,
   tkrMakeCren), a pointed painted spire on each corner turret and a keep with its own crenellated top. No new painting was needed: the pieces are the Thornwick ones.
   TKR3D_B (called from drawWorld) lays the roof picture on the screen before the sprites, so people, lamps and trees in front of a house still stand in front
   of its roof, and lowers wtop (the top of the nearest wall, used by the skyline pictures) to the roof line.
   ========================================================================== */
const TKR={ready:false,loading:null,
  // id, wall squares x0..x1, y0..y1 (inclusive), ridge ('y': the ridge runs north to south and the gables face the street; 'x': it runs east to west, the eaves face the street),
  // rise of the ridge over the wall top, slope picture, gable picture, chimney [along the ridge 0..1, across -1..1 from the ridge], tint [r,g,b] and darkness
  houses:[
    ['n1',12,14,10,14,'y',1.05,'thatch','timber',[.72,.42,'brick'],[1.08,1,.86],1.05],
    ['n2',16,18,10,15,'y',1.1,'slate','stone',[.3,-.4,'stone'],[.95,.98,1.04],.95],
    ['n3',19,21,10,14,'y',1.05,'tile','ochre',[.65,.4,'brick'],[1.08,.95,.88],1],
    ['n4',23,27,10,15,'x',1.15,'shingle','boards',[.22,.36,'stone'],[1,1,1],1],
    ['n5',29,31,10,14,'y',1.05,'slate','timber',[.6,-.42,'brick'],[1,1,1.02],.9],
    ['ch',33,37,10,14,'y',1.6,'slate','stone',null,[.96,.98,1.02],.92],
    ['s1',12,14,21,24,'y',1.05,'tile','boards',[.35,-.4,'stone'],[1.04,.96,.92],.95],
    ['s2',16,18,21,24,'y',1.05,'shingle','ochre',[.7,.4,'brick'],[1,1,1],.95],
    ['s3',19,22,19,22,'y',1.15,'thatch','stone',[.25,.42,'stone'],[1.02,.98,.9],1],
    ['s4',24,28,19,22,'x',1.1,'tile','timber',[.75,-.38,'brick'],[.98,.94,.9],.95],
    ['s5',30,34,19,22,'y',1.25,'slate','boards',[.3,.4,'stone'],[.94,.98,1.08],.98]],
  SLOPEU:{slate:2.1,shingle:2.0,thatch:2.4,tile:2.0},   // world width of one painted slope picture along the ridge
  tex:{},img:{},objs:null,nearIdx:null};
/* the roof sets by level. A row is the Thornwick row plus an optional last field: {chapel:1,north:1,tx,th,sh} (tower and spire; north: the street is at the north end;
   tx: the tower's x; th, sh: how far the tower rises over the ridge and how tall the spire is) or {castle:1} (a castle top, no pitched roof) */
TKR.sets={3:{wh:1.55,houses:TKR.houses},
  13:{wh:2.0,houses:[
    ['a',12,15,10,12,'x',1.2,'slate','stone',[.7,.38,'stone'],[.95,.97,1.02],.9],
    ['b',34,37,10,12,'x',1.2,'shingle','boards',[.3,-.36,'stone'],[1,1,1],.92],
    ['c',12,14,14,16,'y',1.15,'shingle','stone',[.6,.38,'brick'],[1.02,.98,.94],.92],
    ['d',35,37,14,16,'y',1.15,'slate','timber',[.4,-.38,'stone'],[.96,.98,1.04],.9],
    ['castle',18,31,10,15,'y',0,'slate','stone',null,[.9,.92,.98],.9,{castle:1}],
    ['sm',12,16,21,24,'x',1.35,'slate','stone',[.22,.34,'stone'],[.92,.94,1],.88],
    ['st',18,22,21,24,'x',1.35,'shingle','timber',[.75,-.32,'brick'],[1.02,.98,.92],.92],
    ['ch',24,27,21,24,'y',1.7,'slate','stone',null,[.96,.98,1.04],.9,{chapel:1,north:1,tx:26.5,th:1.7,sh:3.4}],
    ['inn',28,33,21,24,'x',1.45,'tile','timber',[.3,.36,'brick'],[1.02,.96,.9],.95],
    ['h9',35,37,23,26,'y',1.15,'thatch','boards',[.5,.36,'stone'],[1,.98,.9],1]]}};
function tkrLoadImg(key,src){return new Promise(res=>{const i=new Image();i.onload=()=>{TKR.img[key]=i;TKR.tex[key]=tkrTex(i);res()};i.onerror=()=>{console.error('tkr art missing',src);res()};i.src=src+'?v='+VERSION})}
/* a picture as RGBA arrays with halved copies (the far roofs read a smaller copy, so they do not shimmer) */
function tkrTex(img){
  // a gentle grade only: more local contrast (the courses of the painting read better at a distance), the colours themselves untouched
  const c0=document.createElement('canvas');c0.width=img.width;c0.height=img.height;const x0=c0.getContext('2d',{willReadFrequently:true});x0.drawImage(img,0,0);
  {const id=x0.getImageData(0,0,c0.width,c0.height),a=id.data;let m=0,n=0;for(let i=0;i<a.length;i+=16)if(a[i+3]>127){m+=a[i]*.3+a[i+1]*.59+a[i+2]*.11;n++}m=n?m/n:110;
    for(let i=0;i<a.length;i+=4){const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;for(let c=0;c<3;c++){const v=l+(a[i+c]-l)*1.25;a[i+c]=Math.max(0,Math.min(255,m+(v-m)*1.45))}}x0.putImageData(id,0,0)}
  const lv=[];let w=img.width,h=img.height,src=c0;
  for(let k=0;k<7&&w>=4&&h>=4;k++){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(src,0,0,w,h);
    lv.push({w,h,d:x.getImageData(0,0,w,h).data});src=c;w=Math.max(1,w>>1);h=Math.max(1,h>>1)}
  return {w:img.width,h:img.height,lv};
}
function tkrLoad(){
  if(TKR.loading)return TKR.loading;const J=[];
  for(const n of ['slate','shingle','thatch','tile'])J.push(tkrLoadImg('slope_'+n,'assets/tkr/slope_'+n+'.webp'));
  for(const n of ['timber','stone','boards','ochre'])J.push(tkrLoadImg('gable_'+n,'assets/tkr/gable_'+n+'.webp'));
  for(const n of ['chim_brick','chim_stone','tower','spire','spirex','lh_wall','lh_lamp','lh_dome'])J.push(tkrLoadImg(n,'assets/tkr/'+n+'.webp'));
  return TKR.loading=Promise.all(J).then(()=>{tkrMakeCren();TKR.ready=true});
}
let TKR_WH=1.55,TKR_GROUND=false;const TKR_TAU=.17,TKR_SUN=(()=>{const v=[-.45,.55,.72],n=Math.hypot(...v);return v.map(a=>a/n)})();
/* the crenellated parapet picture: the plain stone of the painted tower, with the gaps between the merlons cut out of its top (two merlons across) */
function tkrMakeCren(){const im=TKR.img.tower;if(!im)return;const W=256,H=160,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(im,0,Math.round(im.height*.44),im.width,Math.round(im.height*.48),0,0,W,H);
  const id=x.getImageData(0,0,W,H),a=id.data;for(let y=0;y<64;y++)for(let xx=0;xx<W;xx++){const m=xx%128;if(m<22||m>=106)a[(y*W+xx)*4+3]=0}
  x.putImageData(id,0,0);TKR.tex.cren=tkrTex(c)}
/* a castle top over a building: a parapet round the wall top, a turret with a pointed painted spire on each corner and a keep with its own crenellated top.
   Everything stands inside the footprint (no overhang). */
function tkrCastle(objs,hi,id,X0,X1,Y0,Y1,tn){
  const bx=(sid,x0,x1,y0,y1,zb,zt,tex,ex)=>objs.push(Object.assign({t:'box',hid:hi,id:id+sid,X0:x0,X1:x1,Y0:y0,Y1:y1,zb,zt,tex,tn},ex||{}));
  const zb=TKR_WH-.04,zt=TKR_WH+.72,pt=.3,uw=1.6,ring=(k,x0,x1,y0,y1,b,t,w)=>{bx(k+'s',x0,x1,y1-w,y1,b,t,'cren',{uw});bx(k+'n',x0,x1,y0,y0+w,b,t,'cren',{uw});bx(k+'w',x0,x0+w,y0,y1,b,t,'cren',{uw});bx(k+'e',x1-w,x1,y0,y1,b,t,'cren',{uw})};
  ring('p',X0,X1,Y0,Y1,zb,zt,pt);
  const tw=1.1,th=TKR_WH+2.5;   // the four corner turrets
  [[X0,Y0],[X1-tw,Y0],[X0,Y1-tw],[X1-tw,Y1-tw]].forEach((c,i)=>{bx('t'+i,c[0],c[0]+tw,c[1],c[1]+tw,zb,th,'tower',{tn:[tn[0]*1.04,tn[1]*1.04,tn[2]*1.04]});
    const hw=tw/2+.03,cx=c[0]+tw/2,cy=c[1]+tw/2;objs.push({t:'pyr',hid:hi,id:id+'u'+i,X0:cx-hw,X1:cx+hw,Y0:cy-hw,Y1:cy+hw,cx,cy,hw,zb:th,zt:th+2.1,tex:'spire',tn})});
  const kc=[(X0+X1)/2,(Y0+Y1)/2],kh=1.1,kt=TKR_WH+3.6;   // the keep, set back from the front, rising over the parapet
  bx('k',kc[0]-kh,kc[0]+kh,kc[1]-kh,kc[1]+kh,zb,kt,'tower',{tn:[tn[0]*1.06,tn[1]*1.06,tn[2]*1.06]});
  ring('q',kc[0]-kh-.06,kc[0]+kh+.06,kc[1]-kh-.06,kc[1]+kh+.06,kt-.04,kt+.7,.24)}
function tkrShadeV(nx,ny){const d=nx*TKR_SUN[0]+ny*TKR_SUN[1];return clamp(.84+.4*d,.6,1.15)}   // an upright face (gable, chimney, tower): a softer step between light and shade
function tkrShade(nx,ny,nz){const d=nx*TKR_SUN[0]+ny*TKR_SUN[1]+nz*TKR_SUN[2];return clamp(.8+.75*d,.45,1.35)}
/* the solids, from the table and the map (a house whose squares are not all wall is left without a roof and reported) */
function tkrBuild(){
  const objs=[],rep=[],grid=G.grid,W=grid[0].length,H=grid.length,S=TKR.sets[LEVEL];if(!S)return;
  TKR_GROUND=typeof TERR_NOW!=='undefined'&&!!TERR_NOW&&!TERR_NOW.terr;
  if(S.dyn)S.houses=S.dyn();   // a level whose houses come from its plan (Yarrim): the table is made when the level is built
  TKR.houses=S.houses;TKR_WH=S.wh==='ceil'?(G._cb!==undefined?G._cb:CEILH):S.wh;   // the wall height the roofs stand on
  TKR.houses.forEach((h,hi)=>{const [id,x0,x1,y0,y1,ax,R,slope,gable,chim,tint,dark,opt]=h,WH=(opt&&opt.wh)||TKR_WH;   // opt.wh: this house's own wall height (Yarrim's walls differ from house to house)
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(!(grid[y]&&grid[y][x]>0)){rep.push(id+' skipped: square '+x+','+y+' is not wall');return}
    const X0=x0,X1=x1+1,Y0=y0,Y1=y1+1,c=ax==='y'?(X0+X1)/2:(Y0+Y1)/2,half=ax==='y'?(X1-X0)/2:(Y1-Y0)/2,len=ax==='y'?Y1-Y0:X1-X0;
    const tn=[tint[0]*dark,tint[1]*dark,tint[2]*dark];
    if(opt&&opt.castle){tkrCastle(objs,hi,id,X0,X1,Y0,Y1,tn);rep.push(id+' | walls x '+X0+'-'+X1+' y '+Y0+'-'+Y1+' | castle top');return}
    objs.push({t:'house',hid:hi,id,wh:WH,X0,X1,Y0,Y1,ax,c,half,len,R,slope:'slope_'+slope,gable:'gable_'+gable,tn,su:TKR.SLOPEU[slope]||1.3,
      ns:tkrShade(0,0,1),nA:ax==='y'?[tkrShade(R/half,0,1),tkrShade(-R/half,0,1)]:[tkrShade(0,R/half,1),tkrShade(0,-R/half,1)]});
    // the ridge cap: a row of ridge tiles standing a little proud of the ridge, so the top of the roof has a clean edge against the sky
    {const cw2=.08,zr=WH+TKR_TAU+R;objs.push({t:'box',cap:1,hid:hi,id:id+'r',X0:ax==='y'?c-cw2:X0,X1:ax==='y'?c+cw2:X1,Y0:ax==='y'?Y0:c-cw2,Y1:ax==='y'?Y1:c+cw2,zb:zr-.05,zt:zr+.07,tex:'slope_'+slope,uw:(TKR.SLOPEU[slope]||1.3)*.5,vr:[.005,.06],tn})}
    if(chim){const [ua,us,kind]=chim,cw=.5,cd=.46,ca=(ax==='y'?Y0:X0)+len*ua,cs=c+us*half,top=WH+TKR_TAU+R+.62,
        bx0=ax==='y'?cs-cw/2:ca-cd/2,bx1=ax==='y'?cs+cw/2:ca+cd/2,by0=ax==='y'?ca-cd/2:cs-cw/2,by1=ax==='y'?ca+cd/2:cs+cw/2,
        zb=WH+TKR_TAU+R*(1-(Math.abs(us)*half+cw/2)/half)-.05;
      objs.push({t:'box',hid:hi,id:id+'c',X0:bx0,X1:bx1,Y0:by0,Y1:by1,zb,zt:top,tex:'chim_'+kind,ho:objs[objs.length-2],tn:[tn[0]*.95,tn[1]*.95,tn[2]*.95]})}
    if(id==='ch'||(opt&&opt.chapel)){ // the chapel: a square stone bell tower standing through the roof at the street end, with its slate spire and iron cross
      const o2=opt||{},tc=o2.tx!==undefined?o2.tx:(X0+X1)/2,ty=o2.north?Y0+.95:Y1-.95,hw=.62,zt=WH+TKR_TAU+R+(o2.th||.95),zs=zt+(o2.sh||2.5);
      objs.push({t:'box',hid:hi,id:'cht',X0:tc-hw,X1:tc+hw,Y0:ty-hw,Y1:ty+hw,zb:WH+TKR_TAU+R*.3,zt,tex:'tower',tn:[tn[0]*1.05,tn[1]*1.05,tn[2]*1.05]});
      objs.push({t:'pyr',hid:hi,id:'chs',X0:tc-hw-.03,X1:tc+hw+.03,Y0:ty-hw-.03,Y1:ty+hw+.03,cx:tc,cy:ty,hw:hw+.03,zb:zt,zt:zs,tex:'spire',tn});
      const xw=.36,xh=xw*(TKR.tex.spirex?TKR.tex.spirex.h/TKR.tex.spirex.w:.35);
      objs.push({t:'card',hid:hi,id:'chx1',ax0:tc-xw/2,ay0:ty,ax1:tc+xw/2,ay1:ty,zb:zs-.04,zt:zs-.04+xh,tex:'spirex',tn},{t:'card',hid:hi,id:'chx2',ax0:tc,ay0:ty-xw/2,ax1:tc,ay1:ty+xw/2,zb:zs-.04,zt:zs-.04+xh,tex:'spirex',tn})}
    rep.push(id+' | walls x '+X0+'-'+X1+' y '+Y0+'-'+Y1+' | roof x '+X0+'-'+X1+' y '+Y0+'-'+Y1+' (no overhang) | ridge '+ax+' +'+R)});
  if(S.extra)S.extra(objs,(x,y)=>TKR_GROUND?terrH(x,y):0);   // round solids of a level (Yarrim's lighthouse): cylinders and domes, standing free of the wall grid
  TKR.gzOf=TKR.houses.map(h=>TKR_GROUND?terrH((h[1]+h[2]+1)/2,(h[3]+h[4]+1)/2):0);   // the ground the house stands on (uneven ground: Yarrim; flat levels: 0)
  for(const o of objs){if(o.gz===undefined)o.gz=TKR.gzOf[o.hid];o.zmax=o.t==='house'?o.wh+TKR_TAU+o.R:o.zt;if(o.t==='card'){o.X0=Math.min(o.ax0,o.ax1);o.X1=Math.max(o.ax0,o.ax1);o.Y0=Math.min(o.ay0,o.ay1);o.Y1=Math.max(o.ay0,o.ay1)}}
  // which house each wall square belongs to (for the eave line and the shadow on the wall under it)
  const near=new Int16Array(W*H).fill(-1);TKR.houses.forEach((h,hi)=>{if(!objs.some(o=>o.hid===hi))return;for(let y=h[3];y<=h[4];y++)for(let x=h[1];x<=h[2];x++)near[y*W+x]=hi});
  TKR.whOf=TKR.houses.map(h=>(h[12]&&h[12].wh)||TKR_WH);TKR.objs=objs;TKR.near=near;TKR.W=W;TKR.H=H;LEVELS[LEVEL]._tkrRep=rep;
}
/* the screen buffer: as many columns as the wall picture (one ray per wall column, the same rays as the walls) and twice its rows (the height of the screen canvas) */
const HB={fas:0,bt:0,bo:null,bu:0,bv:0,bT:null,bsh:1,bW:1};
const TKR3D={y0:0,y1:VH*2-1,cy0:0,cy1:VH*2-1,RW:VW,RH:VH*2,buf:null,img:null,can:null,cx:null,top:null,bot:null,has:false,wt0:null,on:true};
function tkrSample(T,u,v,lod){const L=T.lv[Math.min(T.lv.length-1,lod)],x=Math.min(L.w-1,Math.max(0,(u*L.w)|0)),y=Math.min(L.h-1,Math.max(0,(v*L.h)|0));return (y*L.w+x)*4}
function tkrLod(T,worldW,t){const tpu=T.w/worldW,f=tpu*t/(F*2)*.7;return f<=1?0:Math.min(6,Math.floor(Math.log2(f)))}
/* the slab of a ray through an axis-aligned rectangle: [t entry, t exit, axis of the entry face] */
const TKR_SL=[0,0,0];
function tkrSlab(ox,oy,rX,rY,o){let t0=-1e9,t1=1e9,ea=0;
  if(Math.abs(rX)<1e-9){if(ox<o.X0||ox>o.X1)return false}else{let a=(o.X0-ox)/rX,b=(o.X1-ox)/rX;if(a>b){const q=a;a=b;b=q}if(a>t0){t0=a;ea=0}if(b<t1)t1=b}
  if(Math.abs(rY)<1e-9){if(oy<o.Y0||oy>o.Y1)return false}else{let a=(o.Y0-oy)/rY,b=(o.Y1-oy)/rY;if(a>b){const q=a;a=b;b=q}if(a>t0){t0=a;ea=1}if(b<t1)t1=b}
  if(t0>t1||t1<=0)return false;TKR_SL[0]=t0;TKR_SL[1]=t1;TKR_SL[2]=ea;return true}
/* the render pass (render3D, before the 3D picture is put on screen) */
function TKR3D_R(cx,cy,dX,dY,pX,pY,hzr,hzmax,hzrate,lbm,tbR,tbG,tbB){
  TKR3D.has=false;if(!TKR.sets[LEVEL]||!TKR3D.on)return;
  if(!TKR.ready){tkrLoad();return}
  if(!TKR.objs||TKR.grid!==G.grid){TKR.grid=G.grid;tkrBuild()}
  const RW=TKR3D.RW,RH=TKR3D.RH;
  if(!TKR3D.buf){TKR3D.can=document.createElement('canvas');TKR3D.can.width=RW;TKR3D.can.height=RH;TKR3D.cx=TKR3D.can.getContext('2d');TKR3D.img=TKR3D.cx.createImageData(RW,RH);TKR3D.buf=TKR3D.img.data;
    TKR3D.top=new Float32Array(RW);TKR3D.bot=new Float32Array(RW);TKR3D.wt0=new Float32Array(VW);TKR3D.own=new Int8Array(RW*RH)}
  const B=TKR3D.buf,OWN=TKR3D.own;if(TKR3D.y1>=TKR3D.y0)B.fill(0,TKR3D.y0*RW*4,(TKR3D.y1+1)*RW*4);let Y0=RH,Y1=-1;   // only the rows painted last frame are cleared
  const cP=TKR3D.cP||(TKR3D.cP=new Float64Array(5*64)),objs=TKR.objs,grid=G.grid,MW=TKR.W,MH=TKR.H,near=TKR.near,Fh=F*2,HHh=HH*2,TX=TKR.tex,cand=[],ct=[],cea=[],ct1=[];
  const day=G.day||0,tb=[tbR,tbG,tbB],TR=typeof TERR_NOW!=='undefined'&&!!TERR_NOW&&!TERR_NOW.terr,FADE=(TKR.sets[LEVEL]&&TKR.sets[LEVEL].fade)||0;let any=false;
  for(let s=0;s<RW;s++){
    TKR3D.top[s]=1e9;TKR3D.bot[s]=-1e9;
    const camX=2*s/RW-1,rX=dX+pX*camX,rY=dY+pY*camX,rl=Math.hypot(rX,rY);
    // the nearest wall in this column (the same grid walk as the wall pass)
    let mx=Math.floor(cx),my=Math.floor(cy);const ddx=Math.abs(1/rX),ddy=Math.abs(1/rY);let stx,sty,sdx,sdy,side=0,g=0,gd=0;
    if(rX<0){stx=-1;sdx=(cx-mx)*ddx}else{stx=1;sdx=(mx+1-cx)*ddx}if(rY<0){sty=-1;sdy=(cy-my)*ddy}else{sty=1;sdy=(my+1-cy)*ddy}
    while(gd++<90){if(sdx<sdy){sdx+=ddx;mx+=stx;side=0}else{sdy+=ddy;my+=sty;side=1}if(mx<0||my<0||mx>=MW||my>=MH){g=1;break}g=grid[my][mx];if(g>0&&!LOWW.has(g))break}
    let zs=side===0?sdx-ddx:sdy-ddy;if(zs<.05)zs=.05;
    const inner=mx>0&&my>0&&mx<MW-1&&my<MH-1,ti=g>=100?T_TILE[g]:-1,nh=inner?near[my*MW+mx]:-1,wh=(ti>=0&&TEX[ti]&&TEX[ti].wh)||(nh>=0?TKR.whOf[nh]:inner?TKR_WH:CEILH);   // (a door square has no tile height of its own: the house's)
    const ylim=HHh-(wh-(TR?CAMZ-terrH(cx+rX*zs,cy+rY*zs):EYE))*Fh/zs;   // (on uneven ground the wall pass stands each wall on the ground under it: Yarrim)
    // the solids this ray passes through, behind the nearest wall or at it
    cand.length=0;ct.length=0;cea.length=0;ct1.length=0;let ytop=1e9,hasFront=false;
    for(let i=0;i<objs.length;i++){const o=objs[i];if(!tkrSlab(cx,cy,rX,rY,o))continue;const t0=TKR_SL[0];if((t0<zs-.02&&!o.front)||t0<.06)continue;if(o.front&&t0<zs-.02)hasFront=true;
      const yo=HHh-(o.zmax-(CAMZ-o.gz))*Fh/t0;if(yo<ytop)ytop=yo;let k=cand.length;cand.push(o);ct.push(t0);ct1.push(TKR_SL[1]);cea.push(TKR_SL[2]);
      while(k>0&&ct[k-1]>ct[k]){[cand[k-1],cand[k]]=[cand[k],cand[k-1]];[ct[k-1],ct[k]]=[ct[k],ct[k-1]];[ct1[k-1],ct1[k]]=[ct1[k],ct1[k-1]];[cea[k-1],cea[k]]=[cea[k],cea[k-1]];k--}}
    // per house, what does not change from row to row: the roof height where the ray enters, at the ridge line and where it leaves
    for(let ci=0;ci<cand.length;ci++){const o=cand[ci];if(o.t!=='house')continue;const t0=ct[ci],t1=ct1[ci],sO=o.ax==='y'?cx:cy,sD=o.ax==='y'?rX:rY,Hs=t=>o.wh+TKR_TAU+o.R*(1-Math.abs(sO+sD*t-o.c)/o.half);
      const tc=Math.abs(sD)>1e-9?(o.c-sO)/sD:-1;cP[ci*5]=Hs(t0);cP[ci*5+1]=tc;cP[ci*5+2]=tc>t0&&tc<t1?Hs(tc):0;cP[ci*5+3]=Hs(t1);cP[ci*5+4]=tc>t0&&tc<t1?1:0}
    if(!cand.length||(ylim<=0&&!hasFront))continue;
    const r0=Math.max(0,Math.floor(ytop)),r1=hasFront?RH-1:Math.min(RH-1,Math.ceil(ylim-.5)-1);   // a free-standing round solid in front of the nearest wall is painted down to its foot
    let lastOwn=-1,lastRow=-1,lastGab=false;
    let sky=true,sky0=-9,fMin=1e9;
    const hit=k=>{HB.fas=0;let bt=1e9,bo=null,bu=0,bv=0,bT=null,bsh=1,bW=1;
      for(let ci=0;ci<cand.length;ci++){const o=cand[ci],t0=ct[ci],t1=ct1[ci];if(t0>=bt)break;const z0=(CAMZ-o.gz)+k*t0;if(k>0&&z0>o.zmax)continue;   // the ray only climbs from here: it passes over this one
        if(o.t==='house'){
          const sO=o.ax==='y'?cx:cy,sD=o.ax==='y'?rX:rY,aO=o.ax==='y'?cy:cx,aD=o.ax==='y'?rY:rX,gab=(o.ax==='y')===(cea[ci]===1);
          const s0=sO+sD*t0,h0=cP[ci*5];
          if(z0<=h0){if(z0<o.wh-.002){bt=t0;bo=null;break} // the wall itself: the wall pass has painted it
            if(gab){ // the gable: the wall carried up as a triangle (the picture's triangle over the eave course, its foot beam along the eave course)
              const T=TX[o.gable];if(!T)continue;const u0=(s0-(o.c-o.half))/(2*o.half),u=(o.ax==='y'?rY>0:rX<0)?1-u0:u0;   // left to right as the viewer sees it
              bt=t0;bo=o;bT=T;bu=u;bv=z0<o.wh+TKR_TAU?.975:.95*(1-(z0-o.wh-TKR_TAU)/o.R);bW=2*o.half;bsh=(o.ax==='y'?tkrShadeV(0,rY>0?-1:1):tkrShadeV(rX>0?-1:1,0));break}
            // the eave edge: the thickness of the roof (the lowest course of the slope and its board) seen straight on along the eave wall
            const T=TX[o.slope];if(!T){bt=t0;bo=null;break}const av=aO+aD*t0;let u=av/(o.su*.5);u-=Math.floor(u);bt=t0;bo=o;bT=T;bu=u;bv=.008+.05*(o.wh+TKR_TAU-z0)/TKR_TAU;bW=o.su*.5;bsh=1;HB.fas=1;break}   // the eave edge: a course of the same tiles (the clean ridge row of the slope picture) seen end on
          // the slopes: the first point where the ray meets the roof surface
          const tc=cP[ci*5+1],two=cP[ci*5+4]===1,ns=two?2:1;let th=-1;
          for(let q=0;q<ns;q++){const ta=q===0?t0:tc,tb2=two&&q===0?tc:t1,fa=(q===0?cP[ci*5]:cP[ci*5+2])-((CAMZ-o.gz)+k*ta),fb=(two&&q===0?cP[ci*5+2]:cP[ci*5+3])-((CAMZ-o.gz)+k*tb2);
            if(fb>=0){th=fa>=0?ta:ta+(tb2-ta)*(-fa)/(fb-fa);break}}
          if(th<0||th>=bt)continue;
          const T=TX[o.slope];if(!T)continue;const sv=sO+sD*th,av=aO+aD*th,side2=sv>=o.c?0:1;
          let u=av/o.su;u-=Math.floor(u);
          bt=th;bo=o;bT=T;bu=u;bv=Math.min(.999,Math.abs(sv-o.c)/o.half);bW=o.su;bsh=o.nA[side2];
        }else if(o.t==='box'){
          if(z0<=o.zt&&z0>=o.zb){const T=TX[o.tex];if(!T)continue;const px=cx+rX*t0,py=cy+rY*t0,ex=cea[ci]===0;
            const nx=ex?(rX>0?-1:1):0,ny=ex?0:(rY>0?-1:1),w=ex?o.Y1-o.Y0:o.X1-o.X0;let u=ex?(py-o.Y0)/w:(px-o.X0)/w;if(ex?rX<0:rY>0)u=1-u;if(o.uw){u=(ex?py:px)/o.uw;u-=Math.floor(u)}   // the picture reads left to right for whoever looks at that face
            let v=(o.zt-z0)/(o.zt-o.zb);if(o.vr)v=o.vr[0]+v*(o.vr[1]-o.vr[0]);const i4=tkrSample(T,u,v,tkrLod(T,w,t0)),L=T.lv[Math.min(T.lv.length-1,tkrLod(T,w,t0))].d;
            if(L[i4+3]<128)continue;bt=t0;bo=o;bT=T;bu=u;bv=v;bW=o.uw||w;bsh=tkrShadeV(nx,ny)*(o.cap?1.15:1)}
        }else if(o.t==='cyl'||o.t==='dome'){ // round solids: a cylinder (wall picture wrapped round it) and a dome (a half ellipsoid, plates from the apex down)
          const EZ=(CAMZ-o.gz),ox=cx-o.cx,oy=cy-o.cy,r=o.r;let th=-1,nx=0,ny=0,nz=0,u=0,v=0,wd=1;
          if(o.t==='cyl'){const a=rX*rX+rY*rY,b=2*(ox*rX+oy*rY),c=ox*ox+oy*oy-r*r,d=b*b-4*a*c;if(d<=0)continue;const tt=(-b-Math.sqrt(d))/(2*a);
            const z=EZ+k*tt;if(tt<=.06||z<o.zb||z>o.zt)continue;th=tt;const px=ox+rX*tt,py=oy+rY*tt;nx=px/r;ny=py/r;
            u=(Math.atan2(py,px)/(2*Math.PI)*o.rep+1000)%1;v=1-(((z-(o.vb!==undefined?o.vb:o.zb))/o.vh)%1);wd=2*Math.PI*r/o.rep}
          else{const h=o.zt-o.zb,sc=r/h,zc=(EZ-o.zb)*sc,ks=k*sc,a=rX*rX+rY*rY+ks*ks,b=2*(ox*rX+oy*rY+zc*ks),c=ox*ox+oy*oy+zc*zc-r*r,d=b*b-4*a*c;if(d<=0)continue;const tt=(-b-Math.sqrt(d))/(2*a);
            const zz=zc+ks*tt;if(tt<=.06||zz<0)continue;th=tt;const px=ox+rX*tt,py=oy+rY*tt;nx=px/r;ny=py/r;nz=zz/r;
            u=(Math.atan2(py,px)/(2*Math.PI)*o.rep+1000)%1;v=Math.min(.999,Math.acos(Math.min(1,nz))/(Math.PI/2));wd=2*Math.PI*r/o.rep;nz=nz*.9+.1}
          if(th>=bt)continue;const T=TX[o.tex];if(!T)continue;bt=th;bo=o;bT=T;bu=u;bv=v;bW=wd;bsh=o.t==='dome'?tkrShade(nx,ny,nz):tkrShadeV(nx,ny);if(o.front&&th<fMin)fMin=th;
        }else if(o.t==='pyr'){
          if(z0<=o.zb)continue;const ox=cx-o.cx,oy=cy-o.cy,bp=[t0,t1];
          const add=t=>{if(t>t0&&t<t1)bp.push(t)};if(Math.abs(rX)>1e-9)add(-ox/rX);if(Math.abs(rY)>1e-9)add(-oy/rY);if(Math.abs(rX-rY)>1e-9)add(-(ox-oy)/(rX-rY));if(Math.abs(rX+rY)>1e-9)add(-(ox+oy)/(rX+rY));bp.sort((a,b)=>a-b);
          const fh=t=>o.zb+(o.zt-o.zb)*(1-Math.max(Math.abs(ox+rX*t),Math.abs(oy+rY*t))/o.hw)-((CAMZ-o.gz)+k*t);let th=-1;
          for(let q=0;q<bp.length-1;q++){const fa=fh(bp[q]),fb=fh(bp[q+1]);if(fb>=0){th=fa>=0?bp[q]:bp[q]+(bp[q+1]-bp[q])*(-fa)/(fb-fa);break}}
          if(th<0||th>=bt)continue;const T=TX[o.tex];if(!T)continue;const dx=ox+rX*th,dy=oy+rY*th,xf=Math.abs(dx)>=Math.abs(dy);
          const v=Math.max(Math.abs(dx),Math.abs(dy))/o.hw;let u=.5+(xf?dy:dx)/(2*o.hw);if(xf?dx>0:dy<0)u=1-u;
          const sl=(o.zt-o.zb)/o.hw;bt=th;bo=o;bT=T;bu=u;bv=Math.min(.999,v);bW=2*o.hw;bsh=xf?tkrShade(Math.sign(dx)*sl,0,1):tkrShade(0,Math.sign(dy)*sl,1);
        }else{ // a card (the iron cross): a thin upright picture
          const ex=o.ax1-o.ax0,ey=o.ay1-o.ay0,den=rX*ey-rY*ex;if(Math.abs(den)<1e-9)continue;const qx=o.ax0-cx,qy=o.ay0-cy,t=(qx*ey-qy*ex)/den,u=(qx*rY-qy*rX)/den;
          if(t<=0||t>=bt||u<0||u>1)continue;const z=(CAMZ-o.gz)+k*t;if(z<o.zb||z>o.zt)continue;const T=TX[o.tex];if(!T)continue;const v=(o.zt-z)/(o.zt-o.zb),lod=tkrLod(T,.36,t),i4=tkrSample(T,u,v,lod);
          if(T.lv[Math.min(T.lv.length-1,lod)].d[i4+3]<128)continue;bt=t;bo=o;bT=T;bu=u;bv=v;bW=.36;bsh=.8}
      }
      HB.bt=bt;HB.bo=bo;HB.bu=bu;HB.bv=bv;HB.bT=bT;HB.bsh=bsh;HB.bW=bW;return bo};
    for(let r=r0;r<=r1;r++){
      const k=(HHh-(r+.5))/Fh;if(!hit(k)){sky=true;continue}
      const bt=HB.bt,bo=HB.bo,bu=HB.bu,bv=HB.bv,bT=HB.bT,bsh=HB.bsh,bW=HB.bW,fas=HB.fas;
      let cov=255;if(sky){let n=0;for(const q of [.125,.375,.625,.875])if(hit((HHh-(r+q))/Fh))n++;cov=Math.round(255*Math.max(1,n)/4);sky0=r+1}sky=false;   // the edge against the sky is smoothed
      // paint: the picture, shaded by its turn to the light, lit and hazed by distance the way the walls are
      const isSl=bo.t==='house'&&bT===TX[bo.slope],VS=isSl?(fas?bv:bv<.05?bv*1.2:.5+(bv-.05)/.95*.5):bv;   // a slope shows the ridge row, then the lower half of its picture: bigger courses, which still read when the slope is seen steeply from the street
      const lod=tkrLod(bT,bW,bt),L=bT.lv[Math.min(bT.lv.length-1,lod)],i4=tkrSample(bT,bu,VS,lod),dist=bt*rl,lb=Math.max(baseL(dist),lbm),sm=Math.min(hzmax,dist*hzrate)*.5,iv=1-sm,hk=(lb*.55+.05)*sm;
      let ao=1;if(isSl&&!fas){if(bv<.93)ao=.72+.28*Math.min(1,(1-bv)*5);if(bv<.03)ao*=1.35;const ea=(bo.ax==='y'?cy+rY*bt-bo.Y0:cx+rX*bt-bo.X0);if(ea<.05||ea>bo.len-.05)ao*=1.25} // the lowest course under the eave is in shade, the ridge catches the light
      if(cov<255||sky0===r)ao*=(bo.t==='house'?1.3:1.1);   // the top edge against the sky catches the light
      if(bo.ho){const H=bo.ho,sv=(H.ax==='y'?cx+rX*bt:cy+rY*bt),zh=H.wh+TKR_TAU+H.R*(1-Math.abs(sv-H.c)/H.half),zz=(CAMZ-bo.gz)+k*bt;if(zz-zh<.08)ao*=.55+.45*Math.max(0,(zz-zh)/.08)}   // the foot of a chimney is in the shade of the slope it stands on
      const o4=(r*RW+s)*4,g2=bsh*lb*iv*ao*1.17,tn=bo.tn;
      if(TKR3D.dbgP&&TKR3D.dbgP[0]===s&&TKR3D.dbgP[1]===r)TKR3D.dbgR={id:bo.id,t:bo.t,gab:bT===TX[bo.gable],fas,bu,bv,VS,bt,lod,bsh,ao,lb,iv,tex:[L.d[i4],L.d[i4+1],L.d[i4+2]]};   // (tests only)
      let q0=L.d[i4],q1=L.d[i4+1],q2=L.d[i4+2];
      if(FADE>0){const lm=q0*.3+q1*.59+q2*.11,ks=1-.7*FADE,kc=1-.45*FADE,lf=FADE*30;   // a faded set (Yarrim): less colour, less contrast, a touch bleached
        q0=118+(lm+(q0-lm)*ks-118)*kc+lf;q1=118+(lm+(q1-lm)*ks-118)*kc+lf;q2=118+(lm+(q2-lm)*ks-118)*kc+lf}
      B[o4]=q0*g2*tb[0]*tn[0]+hzr[0]*hk;B[o4+1]=q1*g2*tb[1]*tn[1]+hzr[1]*hk;B[o4+2]=q2*g2*tb[2]*tn[2]+hzr[2]*hk;B[o4+3]=cov;OWN[r*RW+s]=bo.hid;
      if(r<TKR3D.top[s])TKR3D.top[s]=r;if(r>TKR3D.bot[s])TKR3D.bot[s]=r+1;if(r<Y0)Y0=r;if(r>Y1)Y1=r;lastOwn=bo.hid;lastRow=r;lastGab=bo.t==='house'&&bT===TX[bo.gable]&&!fas;any=true;
    }
    if(fMin<1e8){const xc=s>>1;if(fMin<zbuf[xc])zbuf[xc]=fMin}   // a round solid in front: the sprites behind it stay hidden
    // the eave line and the soft shadow on the wall top under it, where this column's nearest wall carries the roof just painted above it
    // (a gable end is the wall carried up: no line there, only one row of its own colour so no sky shows through at the joint)
    if(nh>=0&&lastOwn===nh&&lastRow>=r1-1){const o4=(lastRow*RW+s)*4;
      if(lastGab){const p=((lastRow+1)*RW+s)*4;if(lastRow+1<RH){B[p]=B[o4];B[p+1]=B[o4+1];B[p+2]=B[o4+2];B[p+3]=255;TKR3D.bot[s]=lastRow+2}}
      else{const ext=1,sh=Math.round(clamp(.06*Fh/zs,2,26));
        for(let j=1;j<=ext&&lastRow+j<RH;j++){const p=((lastRow+j)*RW+s)*4;B[p]=B[o4]*.72;B[p+1]=B[o4+1]*.69;B[p+2]=B[o4+2]*.66;B[p+3]=255}
        TKR3D.bot[s]=lastRow+1+ext;
        for(let j=0;j<sh&&lastRow+ext+1+j<RH;j++){const p=((lastRow+ext+1+j)*RW+s)*4,a=Math.pow(1-j/sh,1.6);B[p]=10;B[p+1]=8;B[p+2]=6;B[p+3]=Math.round(70*a*(day>0?1:.6))}}}
  }
  TKR3D.has=any;
  // steep edges against the sky (the gable verges, the spire) are softened sideways: an edge pixel with sky beside it is drawn half see-through
  if(any){Y1=Math.min(RH-1,Y1+40)}TKR3D.y0=Y0;TKR3D.y1=Y1;   // (the eave line and its shadow reach a little below the last roof row)
  if(any)for(let r=Y0;r<=Y1;r++){const o=r*RW*4;for(let s=1;s<RW-1;s++){const p=o+s*4;if(B[p+3]===255&&(B[p-1]===0||B[p+7]===0))B[p+3]=170}}
  // the skyline pictures (housing roofs, the far abbey) stand behind a house: they show only above its roof
  for(let x=0;x<VW;x++){TKR3D.wt0[x]=wtop[x];if(!any)continue;const SX=TKR3D.RW/VW,a=TKR3D.top[x*SX],b=TKR3D.top[x*SX+SX-1],m=Math.min(a,b);if(m<1e8)wtop[x]=Math.min(wtop[x],m/2)}
  if(any){const a0=Math.min(Y0,TKR3D.cy0),a1=Math.max(Y1,TKR3D.cy1);TKR3D.cx.putImageData(TKR3D.img,0,0,0,a0,RW,a1-a0+1);TKR3D.cy0=Y0;TKR3D.cy1=Y1}   // the rows that changed: this frame's roofs and last frame's, now clear
}
/* drawWorld: the roof picture onto the screen, after the walls and before the sprites */
function TKR3D_B(c){if(!TKR.sets[LEVEL]||!TKR3D.has)return;c.save();c.imageSmoothingEnabled=false;c.drawImage(TKR3D.can,0,0,VW,VH);c.restore()}
/* for the tests: per wall column, the lowest and highest roof pixel drawn (in wall-picture pixels) and the wall top before the roofs lowered it */
TKR3D.cols=function(){const o=[];for(let x=0;x<VW;x++){const SX=TKR3D.RW/VW,b=TKR3D.bot[x*SX],t=TKR3D.top[x*SX];   // the first column of the pair: its ray is exactly the wall pass's ray of column x
  o.push(TKR3D.has&&b>-1e8?{bot:b/2,top:t/2,wt:TKR3D.wt0[x]}:{bot:null,wt:TKR3D.wt0[x]})}return o};
