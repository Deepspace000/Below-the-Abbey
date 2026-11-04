/* ==========================================================================
   OLDHAVEN: THE NIGHT. As in Thornwick and Ironhill, the windows light up from dusk to dawn and the street lamps shine at night.
   - Windows: the painted window pictures of the walls (kh_ohwall*) each have a pane rectangle (OH_PANE: x0,y0,x1,y1 as fractions of the picture, and 1 for an arched top).
     When a wall tile is made (ohTiles in oldhaven.js) every window unit in it gets an amber glow picture: the pane lit (the leading stays darker, so the panes still read) with a soft
     halo on the wall round it. The glow is dim by day (none), fades in from 17:00, is full from 19:00 to 05:00 and fades out by 07:00 (epNightK of early_polish.js). The pictures
     are swapped in only when the eighth-step of the day changes, the same way as Thornwick (epNightTick).
   - Lamps: the street lamps of the city and the quay shine like those of Khemetra (range and strength); the engine already dims lamps by day.
   ========================================================================== */
const OH_PANE={
  kh_ohwall1_4:[.35,.17,.65,.78,1],
  kh_ohwall2_2:[.30,.22,.67,.44],kh_ohwall2_3:[.13,.30,.87,.71],kh_ohwall2_5:[.27,.37,.70,.68],
  kh_ohwall3_2:[.27,.20,.73,.64],kh_ohwall3_3:[.18,.29,.82,.73],kh_ohwall3_5:[.37,.30,.60,.62,1],
  kh_ohwall4_2:[.30,.11,.72,.70],kh_ohwall4_3:[.10,.25,.88,.70],kh_ohwall4_5:[.39,.26,.63,.53,1],
  kh_ohwall5_2:[.34,.27,.70,.55],kh_ohwall5_5:[.39,.14,.57,.40],
  kh_ohwall6_3:[.40,.25,.62,.58,1]};
const OHN={list:[],step:-1};
function ohNightReg(ti,d,wins,Hp){
  const W=128,e=new Uint8ClampedArray(W*Hp*4),HALO=7;
  for(const [u,nm] of wins){const P=OH_PANE[nm];if(!P)continue;
    const x0=P[0]*W,x1=P[2]*W,y0=P[1]*128,y1=P[3]*128,top=Hp-(u+1)*128,arch=P[4],rw=(x1-x0)/2,cx=(x0+x1)/2;
    for(let py=0;py<128;py++){const Y=top+py;if(Y<0||Y>=Hp)continue;
      for(let px=0;px<W;px++){
        let dx=Math.max(x0-px,0,px-x1),dy=Math.max(y0-py,0,py-y1);
        if(arch&&py<y0+rw){const ey=(y0+rw-py)/rw,ex=(px-cx)/rw;const r=Math.sqrt(ex*ex+ey*ey);if(r>1&&py>=y0){dx=(r-1)*rw;dy=0}else if(py<y0){dx=Math.max(dx,0);}}
        const dist=Math.hypot(dx,dy),j=(Y*W+px)*4;
        if(dist<=0){const l=d[j]*.3+d[j+1]*.59+d[j+2]*.11,a=Math.min(1,.62+.38*(1-Math.min(1,l/150)));
          e[j]=255;e[j+1]=172;e[j+2]=66;e[j+3]=a*235}
        else if(dist<HALO&&e[j+3]<80){const a=(1-dist/HALO);e[j]=255;e[j+1]=165;e[j+2]=62;e[j+3]=a*a*.4*255}}}}
  OHN.list.push({ti,e});OHN.step=-1}
function ohNightTick(){
  const st=Math.round(epNightK()*8);if(OHN.step===st)return;OHN.step=st;const k=st/8;
  for(const r of OHN.list){const T=TEX[r.ti];if(!T)continue;
    if(st===0)T.e=null;else{r.c=r.c||{};let e=r.c[st];if(!e){e=new Uint8ClampedArray(r.e.length);for(let i=0;i<e.length;i+=4){e[i]=r.e[i];e[i+1]=r.e[i+1];e[i+2]=r.e[i+2];e[i+3]=r.e[i+3]*k}r.c[st]=e}T.e=e}
    for(let j=0;j<8;j++)delete T['he'+j]}}
{const _dw=drawWorld;let lampLv=null;
  drawWorld=function(){
    try{if(LEVEL===305||LEVEL===304){ohNightTick();
      if(lampLv!==G.decor){lampLv=G.decor;for(const l of LIGHTS)if(l.lamp&&!l.fire&&!l.red){l.range2=100;l.kI=2.3}}}}catch(e){console.error('ohnight',e)}
    return _dw.apply(this,arguments)}}
