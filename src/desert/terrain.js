/* ==========================================================================
   REAL DUNES. The open desert levels (the Sand Road, the Red Dunes, the Blue Dunes) have a height under every cell, so
   the dunes are hills the party walks up and down, not flat pictures. The ground is drawn by marching along each
   screen column and painting every strip of ground that rises above the one in front of it (the "voxel space"
   method). Walls, doors and cliffs still stand on the ground as before, and creatures and scenery sit at the height of
   the ground beneath them.
   ========================================================================== */
const TFAR=34,YBK=144,YBS=4;           // how far the ground is drawn; how finely hidden-behind-a-hill is remembered for sprites
const YB=new Int16Array(VW*YBK);       // for each screen column and distance: the lowest screen row not yet covered by nearer ground
let TERRS={},TERR_NOW=null,TERR_BLOCK=null,CAMZ=.5,TC=null;
function tsmooth(x,y,seed){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),h=(i,j)=>hash2(i,j,seed);return (h(x0,y0)*(1-sx)+h(x0+1,y0)*sx)*(1-sy)+(h(x0,y0+1)*(1-sx)+h(x0+1,y0+1)*sx)*sy}
function dsDuneShape(x,y,len,seed){ // long gentle windward slope, shorter slip face, crests that wander
  const n1=tsmooth(x/40,y/40,seed)*2-1,n2=tsmooth(x/13,y/13,seed+1)*2-1;
  const ph=(x*.93+y*.37)/len+n1*1.7+n2*.45,f=ph-Math.floor(ph),t=f<.7?f/.7:(1-f)/.3,sm=t*t*(3-2*t);
  return sm*.82+.18*tsmooth(x/7,y/7,seed+2);
}
const TERR_SPEC={
  41:{amp:1.25,len:17,seed:11,peak:6.5,mask:(x,y)=>clamp((rdBiome(x,y)-.45)*2.2,0,1)},
  43:{amp:1.6,len:21,seed:23,peak:7,mask:()=>1},
  60:{amp:1.0,len:19,seed:37,peak:6,mask:()=>1},
  61:{amp:1.5,len:24,seed:53,peak:7,mask:()=>1},
  62:{amp:1.7,len:26,seed:67,peak:7.5,mask:()=>1},
  63:{amp:1.3,len:22,seed:71,peak:6.5,mask:()=>1},
  64:{amp:0,len:22,seed:79,peak:6.5,mask:()=>1}
};
const MTN_BAND=14,MTN_BLOCK=1.7; // mountains rise over the last fourteen cells before a sky wall; above this height they cannot be climbed
function terrFor(n){
  { const L0=LEVELS[n]; if(L0&&L0.terrace)return terrTerraced(n,L0); }   // a terraced town level (see hgt_engine.js): per-cell heights, no dunes
  if(TERRS[n]!==undefined)return TERRS[n];
  const spec=TERR_SPEC[n],L=LEVELS[n];if(!spec||!L)return TERRS[n]=null;
  const rows=L.rows,H=rows.length,W=rows[0].length,h=new Float32Array(W*H),open=new Uint8Array(W*H);
  const flat=[[L.start.x,L.start.y,6]],gates=[[L.start.x,L.start.y]];
  rows.forEach((r,y)=>{for(let x=0;x<W;x++){const c=r[x];if(c==='.')open[y*W+x]=1;else if(c>='0'&&c<='9'){flat.push([x,y,5]);gates.push([x,y])}}});
  for(const d of L.decor||[])if(d.enter||/^(chest|dpillar|danubis|dbastet|dsphinx|dobelisk|dpharaoh|treasure|offering|vase|brazier|dsutstatue|sarcoph|dburrow|teleporter)/.test(d.k))flat.push([d.x,d.y,3.5]);
  if(n===62)flat.push([VER.CX,262,12]);                           // the fire lizard's ground is level
  if(n===61)for(const [ox,oy] of GER.OASES)flat.push([ox,oy,9]);
  if(n===64)for(const [ox,oy] of FLR.OASES)flat.push([ox,oy,9]);
  if(n===63)for(const [ox,oy] of WER.OASES)flat.push([ox,oy,9]);
  if(n===62)for(const [ox,oy] of VER.OASES)flat.push([ox,oy,9]);
  if(n===60)flat.push([BDN.OX,BDN.OY,9]);                       // the oasis lies flat
  if(n===43)for(let y=RS.NORTH;y<130;y+=3)flat.push([rsCentre(y),y,4.5]); // so does the old paved road
  if(n===41)for(let y=0;y<H;y+=4)flat.push([rdCentre(y),y,2.2]);   // and the road through the sand
  const R2=(r)=>(r+4)*(r+4);
  const keep=(x,y)=>{let m=0;for(let i=0;i<flat.length;i++){const p=flat[i],dx=x-p[0],dy=y-p[1],d2=dx*dx+dy*dy;if(d2<R2(p[2])){const k=clamp(1-(Math.sqrt(d2)-p[2])/4,0,1);if(k>m)m=k;if(m>=1)break}}return m};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!open[y*W+x])continue;
    const a=spec.amp*spec.mask(x,y);if(a<.01)continue;
    h[y*W+x]=a*dsDuneShape(x,y,spec.len,spec.seed)*(1-keep(x,y));
  }
  // mountains: along every sky wall the land climbs into a range, so the edge of the level is a mountainside and not a wall;
  // they keep clear of every door, gate and arrival point, which are left in a wide pass
  const dw=new Float32Array(W*H).fill(1e9);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]==='D'||(n===41&&y<147&&rows[y][x]==='T'))dw[y*W+x]=0;   // on the Sand Road the last of the trees give way to mountains too
  const relax=(i,j,c)=>{if(dw[j]+c<dw[i])dw[i]=dw[j]+c};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(x>0)relax(i,i-1,1);if(y>0){relax(i,i-W,1);if(x>0)relax(i,i-W-1,1.41);if(x<W-1)relax(i,i-W+1,1.41)}}
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;if(x<W-1)relax(i,i+1,1);if(y<H-1){relax(i,i+W,1);if(x<W-1)relax(i,i+W+1,1.41);if(x>0)relax(i,i+W-1,1.41)}}
  const rk=new Float32Array(W*H),block=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;if(!open[i]||dw[i]>=MTN_BAND)continue;
    let dm=1e9;for(let k=0;k<gates.length;k++){const dx=x-gates[k][0],dy=y-gates[k][1],d=dx*dx+dy*dy;if(d<dm)dm=d}
    const supp=clamp((Math.sqrt(dm)-8)/10,0,1);if(supp<=0)continue;
    const rg=1-Math.abs(2*tsmooth(x/5.5,y/5.5,spec.seed+6)-1),m=Math.pow(1-dw[i]/MTN_BAND,1.35)*(.5+.8*tsmooth(x/10,y/10,spec.seed+5))*(.62+.62*rg)*supp,hm=spec.peak*m+m*.9*(tsmooth(x/2.5,y/2.5,spec.seed+7)-.5);  // ridges and crags, not smooth humps
    h[i]+=hm;rk[i]=clamp(hm/2,0,1);if(hm>MTN_BLOCK)block[i]=1;
  }
  // the Golden Pyramid: four smooth faces climbing to a point, too steep to walk
  if(n===61&&typeof PYR!=='undefined'){for(let y=PYR.cy-PYR.half;y<=PYR.cy+PYR.half;y++)for(let x=PYR.cx-PYR.half;x<=PYR.cx+PYR.half;x++){const i=y*W+x,d=Math.max(Math.abs(x-PYR.cx),Math.abs(y-PYR.cy));h[i]=PYR.peak*Math.max(0,1-d/(PYR.half+.6));rk[i]=1;block[i]=1}}
  // nothing stands inside a mountain
  const cellOf=(x,y)=>y*W+x;
  for(const list of [L.enemies,L.items,L.decor])if(list)for(let q=list.length-1;q>=0;q--){const e=list[q];if(block[cellOf(e.x,e.y)])list.splice(q,1)}
  if(L.scenery)for(let q=L.scenery.length-1;q>=0;q--){const e=L.scenery[q];if(block[cellOf(e.wx|0,e.wy|0)])L.scenery.splice(q,1)}
  // low foliage round the feet of the mountains
  L.scenery=L.scenery||[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    const i=y*W+x;if(!open[i]||block[i])continue;
    const m=rk[i];if(m<.06||m>.7)continue;
    if(hash2(x,y,707)<.1+.1*m){const k='dshrub'+((hash2(x,y,708)*3)|0);L.scenery.push({k,wx:x+.5+(hash2(x,y,709)-.5)*.8,wy:y+.5+(hash2(x,y,710)-.5)*.8,sc:.8+hash2(x,y,711)*.9,decor:{k,walk:true,x,y}})}
  }
  // walls take the height of the open ground beside them
  const g2=new Float32Array(h);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!open[y*W+x]){let s=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&open[yy*W+xx]){s+=h[yy*W+xx];c++}}g2[y*W+x]=c?s/c:0}
  // one light smoothing pass so no crest is a knife edge
  const sm=new Float32Array(g2);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;sm[i]=(g2[i]*4+g2[i-1]+g2[i+1]+g2[i-W]+g2[i+W])/8}
  // light from the north-west: slopes facing it are bright, the lee side is in shade
  const s=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,hx=(sm[Math.min(W-1,x+1)+y*W]-sm[Math.max(0,x-1)+y*W])*.5,hy=(sm[x+Math.min(H-1,y+1)*W]-sm[x+Math.max(0,y-1)*W])*.5;
    const K=3.4,nl=Math.hypot(hx*K,hy*K,1),dif=(hx*K*.55+hy*K*.35+.76)/nl;   // facing the light is high, the lee side is low
    s[i]=clamp(.18+1.0*dif,.42,1.2);
  }
  return TERRS[n]={W,H,h:sm,s,rk,block};
}
function terrRock(){const t=TEX[LEVEL===43?DS_TEXREG.cliffR:DS_TEXREG.cliffY];return {d:t&&t.d,tint:yarSea(LEVEL)?(SEA_TINT[LEVEL]||[.84,.9,.97]):LEVEL===60?[.8,.92,1.22]:LEVEL===61?[1.22,1.06,.7]:LEVEL===62?[1,.8,1.25]:LEVEL===63?[1.12,1.14,1.2]:[1,1,1]}}
// where a rock or a tree really meets the ground: the lowest point under its width, so it never hangs over a slope
function terrFoot(s,cx,cy){
  if(TERR_NOW&&TERR_NOW.terr)return terrH(s.x,s.y);   // on a terrace a thing stands on the step it is in
  const rx=s.x-cx,ry=s.y-cy,dl=Math.hypot(rx,ry)||1,px=-ry/dl,py=rx/dl,hw=(s.w||1)*.4;
  return Math.min(terrH(s.x,s.y),terrH(s.x+px*hw,s.y+py*hw),terrH(s.x-px*hw,s.y-py*hw));
}
function terrH(x,y){
  const T=TERR_NOW;if(!T)return 0;
  if(T.terr){const ix=x<0?0:x>=T.W?T.W-1:x|0,iy=y<0?0:y>=T.H?T.H-1:y|0;return T.h[iy*T.W+ix]}   // terraced: every cell is one flat step
  const gx=clamp(x-.5,0,T.W-1.001),gy=clamp(y-.5,0,T.H-1.001),ix=gx|0,iy=gy|0,fx=gx-ix,fy=gy-iy,i=iy*T.W+ix,h=T.h;
  return (h[i]*(1-fx)+h[i+1]*fx)*(1-fy)+(h[i+T.W]*(1-fx)+h[i+T.W+1]*fx)*fy;
}
// paints the ground along one screen column, from the camera out to tmax, and remembers how much of the column
// each distance has already covered (so scenery behind a hill can be cut off by it)
function terrMarch(x,rX,rY,tmax){
  const T=TERR_NOW,W=T.W,Hh=T.H,h=T.h,sh=T.s,rkA=T.rk,rock=TC.rock,C=TC,D=C.D,cx=C.cx,cy=C.cy,cz=CAMZ,HHv=HH,fm=C.fmp,fds=C.fds,hz=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm;
  const rl=Math.hypot(rX,rY),base=x*YBK;
  let yb=VH,t=.9,lastK=-1;
  const kR0=lbm*C.tbR,kG0=lbm*C.tbG,kB0=lbm*C.tbB;
  while(t<tmax){
    const px=cx+rX*t,py=cy+rY*t,gx=Math.min(W-1.001,Math.max(0,px-.5)),gy=Math.min(Hh-1.001,Math.max(0,py-.5)),ix=gx|0,iy=gy|0,fx=gx-ix,fy=gy-iy,i=iy*W+ix;
    const w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
    let hg=h[i]*w00+h[i+1]*w10+h[i+W]*w01+h[i+W+1]*w11;
    const cxl=px|0,cyl=py|0,fcc=(fm&&cxl>=0&&cyl>=0&&cxl<W&&cyl<Hh)?fm.charCodeAt(cyl*W+cxl):48,wv=C.wat&&(fcc===52||fcc===51); // the sea moves: the surface rises and falls a little, and the water picture drifts
    if(wv)hg+=(Math.sin(px*1.9+C.tm*1.5)+Math.sin(py*1.5+px*.5-C.tm*1.1))*(fcc===52?.013:.007);
    const ytop=HHv-(hg-cz)*F/t;
    if(ytop<yb){
      const ys=Math.max(0,Math.ceil(ytop)),ye=Math.min(VH,Math.ceil(yb));
      if(ye>ys){
        const shade=(sh[i]*w00+sh[i+1]*w10+sh[i+W]*w01+sh[i+W+1]*w11)*(wv?1+.1*Math.sin(px*3.1+C.tm*2.2)*Math.sin(py*2.7-C.tm*1.7):C.uw?1+.24*Math.sin(px*2.1+C.tm*.7+Math.sin(py*1.3+C.tm*.4)*1.5)*Math.sin(py*2.4-C.tm*.6+Math.cos(px*1.1+C.tm*.3)*1.5):1); // sunlight nets of caustics slide over the seabed
        const fdd=fds[fcc-48]||fds[0];
        const u=wv?((((px-cxl)*TS+C.tm*9)|0)&(TS-1)):((px-cxl)*TS)|0,v=wv?((((py-cyl)*TS+Math.sin(C.tm*.7+px*.3)*6+C.tm*5)|0)&(TS-1)):((py-cyl)*TS)|0,ti=(v*TS+u)*4,dist=t*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv,sk=smv*(lbm*.55+.05);
        let r=fdd[ti]*kR0*shade*iv+hz[0]*sk,g=fdd[ti+1]*kG0*shade*iv+hz[1]*sk,b=fdd[ti+2]*kB0*shade*iv+hz[2]*sk;
        const rkv=rkA[i]*w00+rkA[i+1]*w10+rkA[i+W]*w01+rkA[i+W+1]*w11;
        if(rkv>.03&&rock.d){ // rock on the upper slopes, with strata that follow the height
          const ru=((px*TS*.4)|0)&(TS-1),rv=((hg*TS*.35)|0)&(TS-1),rt=(rv*TS+ru)*4,m=Math.min(1,rkv*1.5),rs=shade*.95+.1;
          const lc=1+1.5*((rock.d[rt]+rock.d[rt+1]+rock.d[rt+2])/765-.5),ivr=1-smv*.6,skr=sk*.5;   // mountains stay readable through the haze
          r=r*(1-m)+(rock.d[rt]*rock.tint[0]*kR0*rs*lc*ivr+hz[0]*skr)*m;g=g*(1-m)+(rock.d[rt+1]*rock.tint[1]*kG0*rs*lc*ivr+hz[1]*skr)*m;b=b*(1-m)+(rock.d[rt+2]*rock.tint[2]*kB0*rs*lc*ivr+hz[2]*skr)*m;
        }
        let o=(ys*VW+x)*4;
        for(let y=ys;y<ye;y++,o+=VW*4){D[o]=r;D[o+1]=g;D[o+2]=b}
      }
      yb=ytop;
    }
    const kb=Math.min(YBK-1,(t*YBS)|0),yv=Math.max(0,Math.min(VH,Math.ceil(yb)));
    for(let k=lastK+1;k<=kb;k++)YB[base+k]=yv;
    lastK=kb;
    t+=.04+t*.02;
  }
  const yv=Math.max(0,Math.min(VH,Math.ceil(yb)));
  for(let k=lastK+1;k<YBK;k++)YB[base+k]=yv;
}

/* ==========================================================================
   TERRACED GROUND (the strange cities of the Hollow Grasslands, levels 480 to 489). A level with L.terrace={h:Float32Array(W*H)}
   has one flat height per cell. Ground is drawn cell by cell along each screen column (an exact grid walk, so every tread is as deep as it
   really is), a cell that is higher than the one in front shows its riser, and walls (any cell that is not '.') stand on the height of
   their own cell and are drawn from far to near, so a tall tower is seen over a low house. See hgt_engine.js for the data contract.
   ========================================================================== */
let TERR_STEP=null;                    // set when the level is terraced: the party and the creatures cannot climb more than TERR_MAXSTEP between two cells
const TERR_MAXSTEP=.55;
function terrDiveBlocked(T,x,y){return !!(T.dive&&T.dive[x+','+y]&&typeof uwSuited==='function'&&!uwSuited())}   // a dive cell needs the diving helms
function terrStepMsg(nx,ny){const T=TERR_STEP;if(terrDiveBlocked(T,nx,ny))return 'Too deep.';return T.h[ny*MW+nx]>T.h[G.P.y*MW+G.P.x]?'Too high to climb.':'Too steep to climb down.'}
function terrStepOK(x0,y0,x1,y1){const T=TERR_STEP;if(!T)return true;if(x1<0||y1<0||x1>=T.W||y1>=T.H||x0<0||y0<0||x0>=T.W||y0>=T.H)return true;if(terrDiveBlocked(T,x1,y1))return false;return Math.abs(T.h[y1*T.W+x1]-T.h[y0*T.W+x0])<=TERR_MAXSTEP+1e-4}
function terrTerraced(n,L){
  const t=L.terrace,c=TERRS[n];if(c&&c.src===t&&c.rev===(t.rev||0))return c;
  const rows=L.rows,H=rows.length,W=rows[0].length,N=W*H,h=t.h instanceof Float32Array?t.h:Float32Array.from(t.h||[]);
  if(h.length!==N){console.error('terrace.h has the wrong size for level '+n);return TERRS[n]=null}
  const chars=L.chars||{},whOf=ch=>{const g=chars[ch];if(g!==undefined&&g>=100&&T_TILE[g]!==undefined&&TEX[T_TILE[g]])return TEX[T_TILE[g]].wh||(L.ceilH||CEILH);return L.ceilH||CEILH};
  const lid=(t.lid&&t.lid.length===N)?t.lid:null,wat=(t.water&&t.water.length===N)?t.water:null;   // covered tubes and pools (see hgt_engine.js)
  let wl=null;if(wat){wl=new Float32Array(N);for(let i=0;i<N;i++)if(wat[i])wl[i]=(t.wl&&t.wl.length===N)?t.wl[i]:h[i]+(wat[i]===2?1.2:.22)}
  let zmax=-1e9;
  for(let y=0;y<H;y++){const r=rows[y];for(let x=0;x<W;x++){const i=y*W+x,wall=r[x]!=='.'&&r[x]!=='t',z=h[i]+(wall?whOf(r[x]):(lid&&lid[i]>0?lid[i]:0));if(z>zmax)zmax=z}}
  const s=new Float32Array(N);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,hc=h[i],hw=x>0?h[i-1]:hc,hn=y>0?h[i-W]:hc;
    // light from the north-west: a tread higher than the ones to its west and north catches it; every other tread is a little darker, so a stair reads as steps
    const v=.84+clamp((hc-(hw+hn)*.5)*.9,-.2,.14)+(((Math.round(hc/.18))&1)?.05:-.03)+clamp(hc*.012,-.08,.08);
    s[i]=clamp(v,.5,1.2);
  }
  if(t.s&&t.s.length===N)for(let i=0;i<N;i++)s[i]=t.s[i];
  // soft shadow map for the cities: the light comes from the north-west and low; a cell is shadowed when something taller stands up to five cells towards the light
  const top=new Float32Array(N),sd=new Float32Array(N);
  for(let y=0;y<H;y++){const r=rows[y];for(let x=0;x<W;x++){const i=y*W+x,wall=r[x]!=='.'&&r[x]!=='t';top[i]=h[i]+(wall?whOf(r[x]):0)}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(rows[y][x]!=='.')continue;let m=0;
    for(let k=1;k<=5;k++){const xa=x-k,ya=y-k;if(xa>=0&&ya>=0){const e=(top[ya*W+xa]-h[i]-1.1*k)/1.2;if(e>0){const v=Math.min(1,e)*(1-k*.12);if(v>m)m=v}}
      if(k<=3){const xb=x-k;if(xb>=0){const e=(top[i-k]-h[i]-.8*k)/1.2;if(e>0){const v=Math.min(1,e)*(1-k*.2)*.8;if(v>m)m=v}}
        const yb=y-k;if(yb>=0){const e=(top[i-k*W]-h[i]-.8*k)/1.2;if(e>0){const v=Math.min(1,e)*(1-k*.2)*.8;if(v>m)m=v}}}}
    sd[i]=m}
  const roof=t.roof!==undefined?t.roof:Math.max(zmax+2.5,6);
  return TERRS[n]={W,H,h,s,sd,rk:new Float32Array(N),block:new Uint8Array(N),terr:true,src:t,rev:t.rev||0,zmax,roof,riser:t.riser,rg:t.rg||null,lid,wat,wl,dive:t.dive||null};
}
// the camera eases between the heights of neighbouring cells (about a quarter of a second)
let TZ=null,TZL=-1,TZT=0;
function terrCam(cx,cy,t){
  let tg=terrH(cx,cy);
  { const T=TERR_NOW;if(T&&T.wat){const ix=cx|0,iy=cy|0;if(ix>=0&&iy>=0&&ix<T.W&&iy<T.H){const k=iy*T.W+ix,w=T.wat[k];
      if(w===1)tg-=.08;                                       // wading: the eye sinks a little
      else if(w===2)tg=Math.max(T.wl[k]-.22-EYE,tg-.1);       // swimming: the eye is just under the surface
    }}}
  if(TZ===null||TZL!==LEVEL||t<TZT||t-TZT>.5)TZ=tg;
  else TZ+=(tg-TZ)*(1-Math.exp(-Math.min(.1,t-TZT)/.09));
  TZL=LEVEL;TZT=t;return TZ;
}
// below the horizon, whatever the ground does not reach is haze
function terrBack(D,hzr,hzmax,lbm){
  const sk=hzmax*(lbm*.55+.05),r=hzr[0]*sk,g=hzr[1]*sk,b=hzr[2]*sk;
  for(let y=Math.max(0,HH-1);y<VH;y++){let o=y*VW*4;for(let x=0;x<VW;x++,o+=4){D[o]=r;D[o+1]=g;D[o+2]=b}}
}
const THN=24,THX=new Int16Array(THN),THC=new Int16Array(THN),THS=new Uint8Array(THN),THG=new Int32Array(THN),THP=new Float32Array(THN),THB=new Float32Array(THN),THF=new Float32Array(THN);
const RCP=new Float64Array(VH+8),GLX=new Float64Array(32),GLY=new Float64Array(32),GLA=new Float64Array(32),GLR=new Float64Array(32),GLG=new Float64Array(32),GLB=new Float64Array(32);
// the warm lights that can add anything to a ground cell (the nearest point of the cell is not so far that a light gives less than about 1/600 of full light); the rest are not summed per pixel
function terrCellLights(nl,nn,ncr,ncg,ncb,mx,my){
  let n=0;
  for(let k=0,j=0;k<nn&&n<32;k+=3,j++){const lx=nl[k],ly=nl[k+1],dx=lx<mx?mx-lx:lx>mx+1?lx-mx-1:0,dy=ly<my?my-ly:ly>my+1?ly-my-1:0;
    if(PERF_EXACT||nl[k+2]>.0017*(1+1.15*(dx*dx+dy*dy+.44))){GLX[n]=lx;GLY[n]=ly;GLA[n]=nl[k+2];GLR[n]=ncr[j];GLG[n]=ncg[j];GLB[n]=ncb[j];n++}}
  return n;
}
const WCL=new Int16Array(THN),WCH=new Int16Array(THN),WLA=new Float64Array(32),WLC=new Float64Array(32),WLR=new Float64Array(32),WLG=new Float64Array(32),WLB=new Float64Array(32),WRA=new Float64Array(32),WRC=new Float64Array(32),VGT=new Float64Array(VH+8);
/* column-major copies of the tall wall pictures. A wall is painted down one screen column, so it reads one column of its picture; in a row-major picture the next pixel is a whole row (512 bytes or far more) away and every
   pixel is a cache miss. In the copy, a column is contiguous. The copy is made a little at a time (WTB bytes a frame); until it exists the plain picture is used, with the same result. */
const WTD=[],WTSD=[],WTR=[],WTE=[],WTSE=[];let WTB=0;
function wallTexT(ti,tex){ // -> the column-major copy of wall picture ti, or null if it is not made yet
  const d=tex.d;if(!d)return null;
  if(WTSD[ti]===d)return WTD[ti];
  if(WTB>600000||PERF_EXACT)return null;
  const rows=d.length/(TS*4);if(rows!==(rows|0)||rows<1)return null;
  const t=new Uint8ClampedArray(d.length);
  for(let v=0;v<rows;v++){let s=v*TS*4;for(let x=0,o=v*4;x<TS;x++,s+=4,o+=rows*4){t[o]=d[s];t[o+1]=d[s+1];t[o+2]=d[s+2];t[o+3]=d[s+3]}}
  WTB+=d.length;WTD[ti]=t;WTSD[ti]=d;WTR[ti]=rows;WTE[ti]=null;WTSE[ti]=null;return t;
}
function wallTexE(ti,te){ // the same for the glow picture (windows lit at night) of a wall picture whose column-major copy exists
  if(WTSE[ti]===te)return WTE[ti];
  if(WTB>600000)return null;
  const rows=WTR[ti];if(te.length!==WTSD[ti].length)return null;
  const t=new Uint8ClampedArray(te.length);
  for(let v=0;v<rows;v++){let s=v*TS*4;for(let x=0,o=v*4;x<TS;x++,s+=4,o+=rows*4){t[o]=te[s];t[o+1]=te[s+1];t[o+2]=te[s+2];t[o+3]=te[s+3]}}
  WTB+=te.length;WTE[ti]=t;WTSE[ti]=te;return t;
}
// one run of rows of one wall hit, painted pixel by pixel. It is its own small function (the parameters are in WSP) so the engine optimises it on its own, and not as part of the huge render3D.
// WSP: 0 y0, 1 stepT, 2 vmode, 3 wall height, 4 texture rows (0 = square), 5 yBot, 6 1/unit, 7 ivw, 8-10 haze r,g,b, 11-13 base light r,g,b, 14-15 red light r,g, 16 warm lights, 17 red lights, 18 corner shade, 19 wallAO, 20 wallSat, 21 look, 22 filtered, 23-25 filter x0,x1,frac, 26 door glow, 27 its strength, 28-30 door n,lf,i, 31 rows of a column-major picture (0 = row-major)
const WSP=new Float64Array(40);
function wallSpan(D,td,te,ya0,yz,x,tx){
  const P=WSP,y0=P[0],stepT=P[1],vmode=P[2]|0,wh=P[3],texH=P[4]|0,yBot=P[5],iu=P[6],ivw=P[7],hz0=P[8],hz1=P[9],hz2=P[10],bR=P[11],bG=P[12],bB=P[13],RLRv=P[14],RLGv=P[15],na=P[16]|0,nra=P[17]|0,fk=P[18],wAO=P[19],wSat=P[20],hasHLK=P[21]!==0,bil=P[22]!==0,bx0=P[23]|0,bx1=P[24]|0,bfx=P[25],dg=P[26]!==0,dgs=P[27],kdn=P[28],kdlf=P[29],kdi=P[30],rowsT=P[31]|0,shn=P[32],shp=P[33],gfr=P[34]|0;
  let tyf=(ya0-y0)*stepT;
  for(let y=ya0;y<=yz;y++,tyf+=stepT){
      const v=vmode===0?(((tyf*CEILH)|0)&(TS-1)):vmode===1?(((tyf*wh/1.55)|0)&(TS-1)):vmode===2?Math.min(texH-1,(tyf*texH/TS)|0):tyf>=TS?TS-1:(tyf|0); // sky walls tile upward instead of stretching
      const i=rowsT?(tx*rowsT+v)*4:(v*TS+tx)*4,o=(y*VW+x)*4;
      const vg=VGT[y],zz=(yBot-y)*iu,dz=zz-.66,dz2=dz*dz;
      let lr=0,lg=0,lb2=0,lpr=0;
      for(let k=0;k<na;k++){const q=WLA[k]/(1+1.15*(WLC[k]+dz2));lr+=q*WLR[k];lg+=q*WLG[k];lb2+=q*WLB[k]}
      for(let k=0;k<nra;k++)lpr+=WRA[k]/(1+1.15*(WRC[k]+dz2));
      const kRp=bR+lr+lpr*RLRv,kGp=bG+lg+lpr*RLGv,kBp=bB+lb2+lpr*.1;
      let tr=td[i],tg=td[i+1],tb=td[i+2];
      if(bil){const vf=tyf*texH/TS-.5,vy0=Math.floor(vf),fy=vf-vy0,ya=(vy0<0?0:vy0>texH-1?texH-1:vy0)*TS,yb=(vy0+1<0?0:vy0+1>texH-1?texH-1:vy0+1)*TS,i00=(ya+bx0)*4,i10=(ya+bx1)*4,i01=(yb+bx0)*4,i11=(yb+bx1)*4,w00=(1-bfx)*(1-fy),w10=bfx*(1-fy),w01=(1-bfx)*fy,w11=bfx*fy;tr=td[i00]*w00+td[i10]*w10+td[i01]*w01+td[i11]*w11;tg=td[i00+1]*w00+td[i10+1]*w10+td[i01+1]*w01+td[i11+1]*w11;tb=td[i00+2]*w00+td[i10+2]*w10+td[i01+2]*w01+td[i11+2]*w11} // close range: filtered magnification instead of blocks
      let R=tr*kRp*vg*ivw+hz0,Gc=tg*kGp*vg*ivw+hz1,B=tb*kBp*vg*ivw+hz2;
      if(hasHLK){const dtp=(y-y0)*iu,ao=(zz<1.3?1-wAO*(1-zz*.77)*(1-zz*.77):1)*(zz<.32?1-.3*(1-zz/.32)*(1-zz/.32):1)*(dtp<.6?1-.22*(1-dtp/.6)*(1-dtp/.6):1)*fk,gk=zz>12?1:zz*.083,lm=R*.3+Gc*.59+B*.11;R=(lm+(R-lm)*wSat)*ao*(1.03-.07*gk);Gc=(lm+(Gc-lm)*wSat)*ao;B=(lm+(B-lm)*wSat)*ao*(.97+.1*gk);
        if(shn>0){const s=Math.sin(tx*.013+shp)-.62;if(s>0){const q=s*2.6*s*2.6*shn*ao*.4;R+=q*62;Gc+=q*54;B+=q*72} // pearl sheen: a slow highlight sweeps along every face
          if(((tx*131+y*197+gfr*53)&1023)===0){R+=shn*150;Gc+=shn*140;B+=shn*160}}} // and the odd glint on the nacre // nacre keeps its pink, aqua and cream; the foot of a wall is in shadow
      if(te){const a=te[i+3]/255;R+=te[i]*a*.95;Gc+=te[i+1]*a*.95;B+=te[i+2]*a*.95}
      if(dg){const vp=Math.max(0,Math.min(1,(y-y0)/(yBot-y0))),u=kdn===2?((kdlf?kdi:1-kdi)+tx/TS)/2:.5+(tx/TS-.5)*.55,hw=(u-.5)/.17,f=dgs*Math.exp(-hw*hw)*(vp<.3?0:Math.min(1,(vp-.3)/.25))*.55;R+=170*f;Gc+=108*f;B+=30*f} // only the doorway itself: a warm pool of light on and round the door
      D[o]=R;D[o+1]=Gc;D[o+2]=B;
  }
}
// the top of one ground step along one screen column of a city (see terrTerrace). Its own small function so the engine optimises it on its own; the parameters are in TPR
const TPR=new Float64Array(40);
function terrTopHK(D,fdd,x,ys,ye){
  const Q=TPR,k1=Q[0],cx=Q[1],cy=Q[2],rX=Q[3],rY=Q[4],mx=Q[5],my=Q[6],rl=Q[7],hzmax=Q[8],hzrate=Q[9],lbm=Q[10],tbR=Q[11],tbG=Q[12],tbB=Q[13],cellShade=Q[14],stUp=Q[15]!==0,stDn=Q[16]!==0,lipT=Q[17],aoT=Q[18],tIn=Q[19],lipGain=Q[20],footAO=Q[21],FP=Q[22],FC=Q[23],FG=Q[24],FS=Q[25],FT0=Q[26],FT1=Q[27],FT2=Q[28],hz0=Q[29],hz1=Q[30],hz2=Q[31],gaN=Q[32]|0,ws=Q[33],cau=Q[34],ctm=Q[35];
  let mn=fdd.mn;if(!mn){let r=0,g=0,b=0,c=0;for(let i=0;i<fdd.length;i+=28){r+=fdd[i];g+=fdd[i+1];b+=fdd[i+2];c++}mn=fdd.mn=[r/c,g/c,b/c];let bn=1;{const rm=new Float64Array(TS),cm=new Float64Array(TS);let tot=0,n=0;for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const i=(y*TS+x)*4,l=fdd[i]*.3+fdd[i+1]*.59+fdd[i+2]*.11;rm[y]+=l;cm[x]+=l}let m=0;for(let i=0;i<TS;i++){rm[i]/=TS;cm[i]/=TS;m+=rm[i]}m/=TS;let vr=0,vc=0;for(let i=0;i<TS;i++){vr+=(rm[i]-m)*(rm[i]-m);vc+=(cm[i]-m)*(cm[i]-m)}let vt=0;for(let y=0;y<TS;y+=2)for(let x=0;x<TS;x+=2){const i=(y*TS+x)*4,l=fdd[i]*.3+fdd[i+1]*.59+fdd[i+2]*.11;vt+=(l-m)*(l-m)}vt=vt/(TS*TS/4);const an=Math.max(vr,vc)/TS/(vt+1e-6);bn=an>.35?.4:1;fdd.bn=bn}} // a banded paving would run on as long streaks: its pattern is flattened // the average colour of the paving, for the far field
  const mn0=mn[0],mn1=mn[1],mn2=mn[2];
  let sb=fdd.sb;if(sb===undefined){const mx2=Math.max(mn[0],mn[1],mn[2]),mi2=Math.min(mn[0],mn[1],mn[2]);sb=fdd.sb=Math.max(1,Math.min(2.4,.22/Math.max(.03,(mx2-mi2)/Math.max(1,mx2))));fdd.dg=(mn[0]*.3+mn[1]*.59+mn[2]*.11)>180?.85:1} // a pale, almost colourless paving (pale waves, cream planks) gets its colour raised and its light lowered, so channels and inlays read
  const FSe=FS*sb,dgn=fdd.dg;
  let mp=fdd.mp;if(!mp){mp=new Float32Array(16*16*4);for(let by=0;by<16;by++)for(let bx=0;bx<16;bx++){let r=0,g=0,b=0;for(let y=0;y<8;y++)for(let x=0;x<8;x++){const i=((by*8+y)*TS+bx*8+x)*4;r+=fdd[i];g+=fdd[i+1];b+=fdd[i+2]}const o=(by*16+bx)*4;mp[o]=r/64;mp[o+1]=g/64;mp[o+2]=b/64}let m2=new Float32Array(4*4*4);for(let by=0;by<4;by++)for(let bx=0;bx<4;bx++){let r=0,g=0,b=0;for(let y=0;y<4;y++)for(let x=0;x<4;x++){const i=((by*4+y)*16+bx*4+x)*4;r+=mp[i];g+=mp[i+1];b+=mp[i+2]}const o=(by*4+bx)*4;m2[o]=r/16;m2[o+1]=g/16;m2[o+2]=b/16}mp.m2=m2;fdd.mp=mp} // a coarse copy of the paving: far away it keeps the colours of the pattern
  const hvv=(Math.imul(mx,73856093)^Math.imul(my,19349663))&3; // each cell turns its paving a different way, so banded pictures do not run on as long streaks across a plaza
  let o=(ys*VW+x)*4;
  for(let y=ys;y<ye;y++,o+=VW*4){
    const t=k1*RCP[y],px=cx+rX*t,py=cy+rY*t;let u=(((px-mx)*TS)|0)&(TS-1),v=(((py-my)*TS)|0)&(TS-1);if(hvv===1){const q=u;u=v;v=q}else if(hvv===2)u=TS-1-u;else if(hvv===3)v=TS-1-v;const ti=(v*TS+u)*4,dist=t*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv,fm=dist<3?0:Math.min(.97,(dist-3)*.11),fk2=fdd.bn||1,mi=((v>>3)*16+(u>>3))*4,mj=((v>>5)*4+(u>>5))*4,fq=dist<8?0:Math.min(1,(dist-8)/10),m2=mp.m2,tg0=mp[mi]+(m2[mj]-mp[mi])*fq,tg1=mp[mi+1]+(m2[mj+1]-mp[mi+1])*fq,tg2=mp[mi+2]+(m2[mj+2]-mp[mi+2])*fq,sa0=fdd[ti]+(tg0-fdd[ti])*fm,sa1=fdd[ti+1]+(tg1-fdd[ti+1])*fm,sa2=fdd[ti+2]+(tg2-fdd[ti+2])*fm; // beyond about 8 cells even the coarse copy is averaged again: no streaks fan out at the horizon // far away one pixel covers many texels: the paving fades to its average colour instead of streaking into lines
    let lt=0,lR=0,lG=0,lB=0;for(let j=0;j<gaN;j++){const ax=px-GLX[j],ay=py-GLY[j],q=GLA[j]/(1+1.15*(ax*ax+ay*ay+.44));lt+=q;lR+=q*GLR[j];lG+=q*GLG[j];lB+=q*GLB[j]}
    const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,kR=(lb*tbR+lR)*cellShade*(1+ws*.3),kG=(lb*tbG+lG)*cellShade*(1+ws*.05),kB=(lb*tbB+lB)*cellShade*(1-ws*.12); // warmer shadows
    const te=t-tIn,ek=(stUp&&te<lipT)?lipGain:(stDn&&te<aoT)?footAO:1,a=((mn0+(sa0-mn0)*fk2)-FP)*FC+FP,b=((mn1+(sa1-mn1)*fk2)-FP)*FC+FP,c=((mn2+(sa2-mn2)*fk2)-FP)*FC+FP,gk=FG*ek*dgn;let a2=a,b2=b,c2=c;if(FSe!==1){const lm=a*.3+b*.59+c*.11;a2=lm+(a-lm)*FSe;b2=lm+(b-lm)*FSe;c2=lm+(c-lm)*FSe}
    D[o]=a2*FT0*gk*kR*iv+hz0*sk;D[o+1]=b2*FT1*gk*kG*iv+hz1*sk;D[o+2]=c2*FT2*gk*kB*iv+hz2*sk;
    if(cau>0){const w=Math.sin(px*7+ctm*1.3+Math.sin(py*5+ctm))*Math.sin(py*6-ctm*1.1+Math.cos(px*4+ctm*.7));if(w>.35){const cc=(w-.35)*cau*iv;D[o]+=cc*70;D[o+1]+=cc*150;D[o+2]+=cc*170}} // caustic ripples of light near water
  }
}
function vgtFill(){for(let y=0;y<VH;y++){const vy=(y-HH)/HH;VGT[y]=1-.28*vy*vy;RCP[y]=1/(y+.5-HH)}}   // the dark edge of the picture above and below the middle, one value per row
// for each wall listed by terrTerrace (nearest first): the rows that walls nearer than it already paint over (WCL..WCH), so a far wall is only painted where it can show
var PERF_EXACT=false;   // true: no shortcuts (every wall is painted whole, every light summed, plain wall pictures) so the faster paths can be compared pixel by pixel
function terrCover(nh,rX,rY,cx,cy){
  let lo=1,hi=0;
  for(let k=0;k<nh;k++){
    WCL[k]=lo;WCH[k]=hi;if(PERF_EXACT)continue;
    const g=THG[k];if(g<100)continue;const ti=T_TILE[g];if(ti===undefined)continue;const tex=TEX[ti];if(!tex||(tex.sky&&SKYPAN))continue;
    let perp=THP[k];if(perp<.05)perp=.05;
    const wh=tex.wh||CEILH,eyeR=CAMZ-THF[k],unit=F/perp,y0=HH-(wh-eyeR)*unit,yBot=HH+eyeR*unit;let yT=y0;
    if(tex.cren){let wx=THS[k]===0?cy+rY*perp:cx+rX*perp;wx-=Math.floor(wx);if(((wx*2)%1)>.55)yT=y0+tex.cren*unit}
    const ds=Math.max(THA[k],Math.ceil(yT)),de=Math.min(Math.ceil(THB[k])-1,Math.floor(yBot));
    if(de<ds)continue;
    if(lo>hi){lo=ds;hi=de}else if(ds<=hi+1&&de>=lo-1){if(ds<lo)lo=ds;if(de>hi)hi=de}
  }
}

/* ---------- covered tubes and pools (see hgt_engine.js): the ceiling plane, the lowered-lid face, the water surface seen from above ---------- */
const THA=new Int16Array(THN);         // for each listed wall: the screen row down to which ceilings already cover this column (the wall is not drawn above it)
let CY_A=0;
function hgtTubeTex(){const c=(typeof CEILS!=='undefined'&&CEILS.hgt_tube_ceiling)||null;if(c)return c;const id=DS_TEXREG.hgt_tube_ceiling;return (id!==undefined&&TEX[id]&&TEX[id].d)||null}
function terrWave(px,py,tm){return Math.sin(px*5.3+tm*1.1)+Math.sin(py*4.6-tm*.8+px*1.1)+.5*Math.sin((px-py)*10.7+tm*2.1)}
// the ceiling of one cell along one screen column. mode 0: the lid of a tube (a picture, with lit seams). mode 1: the underside of the water, seen from below.
// pz: the lid height of the cell just before this one (a lid that drops makes a face)
function terrCeilPaint(mode,x,rX,rY,tIn,tOut,zc,ybL,pz){
  const C=TC,D=C.D,cz=CAMZ,k1=(zc-cz)*F;if(k1<=.001)return;
  const HK=C.HLK,nl=C.nl,nn=C.nn,hz=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm,cx=C.cx,cy=C.cy,rl=Math.hypot(rX,rY),tm=C.tm,TSm=TS-1,ttR=C.ttR,ttG=C.ttG,ttB=C.ttB,tbR=C.tbR,tbG=C.tbG,tbB=C.tbB;
  const lim=Math.min(HH,ybL),yNear=tIn<.002?-1:HH-k1/tIn,yFar=HH-k1/tOut,nearRow=yNear<0?0:Math.ceil(yNear),cd=mode===0?hgtTubeTex():null;
  const seam=HK?HK.tubeSeam:[150,235,255],glow=HK?HK.tubeGlow:.22,gain=HK?HK.wallGain*1.15:1;
  if(mode===0&&!cd)return;
  if(mode===0&&pz>zc+.01&&tIn>.002){ // the lid drops here: the face of the drop looks at the camera
    const yf=Math.max(CY_A,Math.ceil(HH-(pz-cz)*F/tIn)),ye2=Math.min(nearRow,lim);
    if(ye2>yf){
      const px0=cx+rX*tIn,py0=cy+rY*tIn,along=Math.abs(rX)*tIn>Math.abs(rY)*tIn?py0:px0,u=((along-Math.floor(along))*TS)&TSm,dist=tIn*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv;
      let lt=0;for(let k=0;k<nn;k+=3){const ax=px0-nl[k],ay=py0-nl[k+1];lt+=nl[k+2]/(1+1.15*(ax*ax+ay*ay+.5))}
      const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,kR=(lb*tbR+lt*ttR+glow)*gain*.8*iv,kG=(lb*tbG+lt*ttG+glow)*gain*.8*iv,kB=(lb*tbB+lt*ttB+glow)*gain*.8*iv;
      let o=(yf*VW+x)*4;
      for(let y=yf;y<ye2;y++,o+=VW*4){const z=cz+(HH-y-.5)*tIn/F,v=((z*TS)|0)&TSm,ti=(v*TS+u)*4;D[o]=cd[ti]*kR+hz[0]*sk;D[o+1]=cd[ti+1]*kG+hz[1]*sk;D[o+2]=cd[ti+2]*kB+hz[2]*sk}
      CY_A=ye2;
    }
  }
  const ys=Math.max(CY_A,nearRow),ye=Math.min(Math.ceil(yFar),lim);
  if(ye<=ys)return;
  let o=(ys*VW+x)*4;
  for(let y=ys;y<ye;y++,o+=VW*4){
    const t=k1/(HH-y-.5),px=cx+rX*t,py=cy+rY*t,dist=t*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv;
    if(mode===0){
      const u=((px*TS)|0)&TSm,v=((py*TS)|0)&TSm,ti=(v*TS+u)*4;
      let lt=0;for(let k=0;k<nn;k+=3){const ax=px-nl[k],ay=py-nl[k+1];lt+=nl[k+2]/(1+1.15*(ax*ax+ay*ay+.52))}
      const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,kR=(lb*tbR+lt*ttR+glow)*gain,kG=(lb*tbG+lt*ttG+glow)*gain,kB=(lb*tbB+lt*ttB+glow)*gain;
      const fx=px-Math.floor(px),fy=py-Math.floor(py),dd=Math.min(fx,1-fx,fy,1-fy),sm=dd<.05?(1-dd/.05):0,sa=sm*sm*.75*iv;  // a lit seam on every cell border
      D[o]=cd[ti]*kR*iv+hz[0]*sk+seam[0]*sa;D[o+1]=cd[ti+1]*kG*iv+hz[1]*sk+seam[1]*sa;D[o+2]=cd[ti+2]*kB*iv+hz[2]*sk+seam[2]*sa;
    }else{ // the underside of the water: a luminous moving sheet
      const w=terrWave(px,py,tm),br=.62+.2*w+(w>1.5?(w-1.5)*.7:0),sk=smv*.8;
      D[o]=(34+70*br)*iv+hz[0]*sk;D[o+1]=(120+86*br)*iv+hz[1]*sk;D[o+2]=(138+80*br)*iv+hz[2]*sk;
    }
  }
  if(nearRow<=CY_A)CY_A=ye;
}
// the surface of a pool seen from above: the bed shows through (looked up at the point where the ray really reaches it), tinted by depth, with ripples and glints
function terrWaterTop(x,rX,rY,mx,my,zw,hb,ys,ye,fdd){
  const C=TC,D=C.D,cz=CAMZ,ks=(cz-zw)*F,kb=(cz-hb)*F,nl=C.nl,nn=C.nn,hz=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm,cx=C.cx,cy=C.cy,rl=Math.hypot(rX,rY),tm=C.tm,TSm=TS-1,
    ttR=C.ttR,ttG=C.ttG,ttB=C.ttB,tbR=C.tbR,tbG=C.tbG,tbB=C.tbB,dk=Math.exp(-(zw-hb)*1.1),a0=Math.min(.9,.4+.55*(1-dk));
  let o=(ys*VW+x)*4;
  for(let y=ys;y<ye;y++,o+=VW*4){
    const d=y+.5-HH;if(d<=0)continue;
    const t=ks/d,tb=kb/d,px=cx+rX*t,py=cy+rY*t,w=terrWave(px,py,tm),bx=cx+rX*tb+.03*Math.sin(py*5.3+tm*1.3),by=cy+rY*tb+.03*Math.sin(px*4.7-tm*1.1);
    const u=((bx*TS)|0)&TSm,v=((by*TS)|0)&TSm,ti=(v*TS+u)*4,dist=t*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv;
    let lt=0;for(let k=0;k<nn;k+=3){const ax=px-nl[k],ay=py-nl[k+1];lt+=nl[k+2]/(1+1.15*(ax*ax+ay*ay+.44))}
    const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,kR=lb*tbR+lt*ttR,kG=lb*tbG+lt*ttG,kB=lb*tbB+lt*ttB,fr=Math.min(.5,.1+dist*.03),lum=.5+.9*lb+.7*lt,gl=w>1.55?(w-1.55)*1.4:0,rp=.93+.07*w;
    const a=a0,bR=fdd[ti]*kR*dk*.85,bG=fdd[ti+1]*kG*dk*.85,bB=fdd[ti+2]*kB*dk*.85;
    let r=bR*(1-a)+36*lum*a,g=bG*(1-a)+158*lum*a,b=bB*(1-a)+176*lum*a;
    r=(r*(1-fr)+150*fr*(.6+lbm))*rp+4+gl*120;g=(g*(1-fr)+205*fr*(.6+lbm))*rp+14+gl*170;b=(b*(1-fr)+230*fr*(.6+lbm))*rp+18+gl*180;
    D[o]=r*iv+hz[0]*sk;D[o+1]=g*iv+hz[1]*sk;D[o+2]=b*iv+hz[2]*sk;
  }
}
// one screen column: walks the grid, paints the ground, and lists the walls that can be seen (nearest first) in TH*; returns how many
function terrTerrace(x,rX,rY){
  const T=TERR_NOW,W=T.W,Hh=T.H,h=T.h,sh=T.s,C=TC,D=C.D,cx=C.cx,cy=C.cy,cz=CAMZ,grid=G.grid,fm=C.fmp,fds=C.fds,hz=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm,nl=C.nl,nn=C.nn,tbR=C.tbR,tbG=C.tbG,tbB=C.tbB,ttR=C.ttR,ttG=C.ttG,ttB=C.ttB,ncr=C.ncr,ncg=C.ncg,ncb=C.ncb,HHv=HH,Fv=F,TSv=TS,TSm=TS-1;
  const HK=C.HLK,FG=HK?HK.floorGain:1,FC=HK?HK.floorContrast:1,FP=HK?HK.floorPivot:0,FT=HK?HK.floorTint:null,FT0=HK?FT[0]:1,FT1=HK?FT[1]:1,FT2=HK?FT[2]:1,RG=HK?HK.riserGain:1,FS=HK?HK.floorSat*(1+.25*C.day):1,SD=T.sd,SHK=C.shK; // the look of a city (HGTE.look): floors read as stone, risers and stair edges are clear
  const rl=Math.hypot(rX,rY),base=x*YBK;
  let mx=Math.floor(cx),my=Math.floor(cy);
  const ddx=Math.abs(1/rX),ddy=Math.abs(1/rY);
  let stx,sty,sdx,sdy;
  if(rX<0){stx=-1;sdx=(cx-mx)*ddx}else{stx=1;sdx=(mx+1-cx)*ddx}
  if(rY<0){sty=-1;sdy=(cy-my)*ddy}else{sty=1;sdy=(my+1-cy)*ddy}
  const lidA=T.lid,watA=T.wat,wlA=T.wl,TT=lidA?hgtTubeTex():null;
  let yb=VH,tIn=0,itIn=Infinity,side=0,nh=0,lastK=-1,slopeMax=-1e9,tStop=70,hprev=-1e9,first=true,prevZc=-1e9;
  CY_A=0;
  for(let guard=0;guard<150;guard++){
    const tOut=Math.min(sdx,sdy),itO=1/tOut,inside=mx>=0&&my>=0&&mx<W&&my<Hh,i=inside?my*W+mx:(Math.min(Hh-1,Math.max(0,my))*W+Math.min(W-1,Math.max(0,mx)));
    const g=inside?grid[my][mx]:1;
    if(!first&&g>0){ // a wall: remember it if its top could be seen above the walls nearer than it
      const foot=h[i];let wh=CEILH;if(g>=100){const tt=T_TILE[g];if(tt!==undefined&&TEX[tt])wh=TEX[tt].wh||CEILH}
      const slope=(foot+wh-cz)*Math.min(itIn,20);
      if(slope>slopeMax&&nh<THN){THX[nh]=mx;THC[nh]=my;THS[nh]=side;THG[nh]=g;THP[nh]=tIn;THB[nh]=yb;THF[nh]=foot;THA[nh]=CY_A;nh++;slopeMax=slope;
        if(slope>0){const ts=(T.zmax-cz)/slope;if(ts<tStop)tStop=ts}}
      hprev=-1e9;prevZc=-1e9;
    }else{
      const ybIn=yb,zcc=(lidA&&lidA[i]>0)?h[i]+lidA[i]:0,slab=zcc>0&&cz>=zcc,hc0=slab?zcc:h[i],hc=first?Math.min(hc0,cz-.05):hc0;let fdd=null,cellShade=1,gaN=-1;   // fdd, cellShade and the lights near this cell are only worked out if a pixel of the cell is painted
      const wI=(watA&&!slab)?watA[i]:0,zw=wI?wlA[i]:0,wTop=wI>0&&cz>zw+.01;   // wTop: the eye is above the water, so the surface is drawn from above
      if(!first&&hprev>-1e8&&hc>hprev){ // the riser: the face of this step that looks at the camera
        const yTop=HHv-(hc-cz)*Fv*itIn,yBot=HHv-(hprev-cz)*Fv*itIn,ys=Math.max(0,Math.ceil(yTop)),ye=Math.min(Math.ceil(yb),Math.ceil(yBot),VH);
        if(ye>ys){
          if(fdd===null){const fc2=(fm&&inside)?fm.charCodeAt(i):48;fdd=(slab&&TT)?TT:(fds[fc2-48]||fds[0]);cellShade=slab?1:(HK?sh[i]*(1-SD[i]*SHK):sh[i])};if(gaN<0)gaN=terrCellLights(nl,nn,ncr,ncg,ncb,mx,my);
          let rtd=null,rth=TSv;{const rg=(T.rg&&T.rg[i])||T.riser,tt=rg?T_TILE[rg]:undefined,tx=tt!==undefined?TEX[tt]:null;if(tx&&tx.d){rtd=tx.d;rth=tx.h||TSv}} // the face of a step has its own wall picture when the level gives one
          const px=cx+rX*tIn,py=cy+rY*tIn,along=side===0?py:px,u=((along-Math.floor(along))*TSv)&TSm,dist=tIn*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv;
          let lt=0,lR=0,lG=0,lB=0;for(let j=0;j<gaN;j++){const ax=px-GLX[j],ay=py-GLY[j],q=GLA[j]/(1+1.15*(ax*ax+ay*ay+.44));lt+=q;lR+=q*GLR[j];lG+=q*GLG[j];lB+=q*GLB[j]}
          const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,rs=side===0?(stx>0?.9:.58):(sty>0?1:.68),kR=(lb*tbR+lR)*rs*RG,kG=(lb*tbG+lG)*rs*RG,kB=(lb*tbB+lB)*rs*RG;
          let o=(ys*VW+x)*4;const zkR=tIn/Fv;
          for(let y=ys;y<ye;y++,o+=VW*4){
            const z=cz-(y+.5-HHv)*zkR;let v=((hc-z)*TSv)|0,td=fdd;
            if(rtd){v=v%rth;td=rtd}else v&=TSm;
            const ti=(v*TSv+u)*4;let ek=1;
            if(HK){const dn=z-hprev,up=hc-z;ek=dn<HK.edgeW?HK.footAO+(1-HK.footAO)*dn/HK.edgeW:up<.05?HK.lipGain:1} // the foot of a riser is in shadow and its top edge catches the light, so every step reads
            D[o]=td[ti]*kR*ek*iv+hz[0]*sk;D[o+1]=td[ti+1]*kG*ek*iv+hz[1]*sk;D[o+2]=td[ti+2]*kB*ek*iv+hz[2]*sk;
          }
        }
        if(yTop<yb)yb=yTop;
      }
      if(hc<cz){if(!wTop){ // the top of the step
        const k1=(cz-hc)*Fv,yFar=HHv+k1*itO,yNear=HHv+k1*Math.min(itIn,1000),ys=Math.max(0,Math.ceil(yFar)),ye=Math.min(Math.ceil(yb),Math.ceil(yNear),VH);
        if(ye>ys){
          if(fdd===null){const fc2=(fm&&inside)?fm.charCodeAt(i):48;fdd=(slab&&TT)?TT:(fds[fc2-48]||fds[0]);cellShade=slab?1:(HK?sh[i]*(1-SD[i]*SHK):sh[i])};if(gaN<0)gaN=terrCellLights(nl,nn,ncr,ncg,ncb,mx,my);
          let o=(ys*VW+x)*4;
          const stUp=HK&&!first&&hprev>-1e8&&hc>hprev+.02,stDn=HK&&!first&&hprev>-1e8&&hc<hprev-.02,lipT=HK?HK.lipW*(side===0?ddx:ddy):0,aoT=HK?HK.aoW*(side===0?ddx:ddy):0;
          if(HK){const Q=TPR;Q[0]=k1;Q[1]=cx;Q[2]=cy;Q[3]=rX;Q[4]=rY;Q[5]=mx;Q[6]=my;Q[7]=rl;Q[8]=hzmax;Q[9]=hzrate;Q[10]=lbm;Q[11]=tbR;Q[12]=tbG;Q[13]=tbB;Q[14]=cellShade;Q[15]=stUp?1:0;Q[16]=stDn?1:0;Q[17]=lipT;Q[18]=aoT;Q[19]=tIn;Q[20]=HK.lipGain;Q[21]=HK.footAO;Q[22]=FP;Q[23]=FC;Q[24]=FG;Q[25]=FS;Q[26]=FT0;Q[27]=FT1;Q[28]=FT2;Q[29]=hz[0];Q[30]=hz[1];Q[31]=hz[2];Q[32]=gaN;Q[33]=SD[i]*SHK;Q[34]=(watA&&(wI>0||watA[i-1]>0||watA[i+1]>0||watA[i-W]>0||watA[i+W]>0))?HK.caustic:0;Q[35]=C.tm;terrTopHK(D,fdd,x,ys,ye)}
          else for(let y=ys;y<ye;y++,o+=VW*4){
            const t=k1*RCP[y],px=cx+rX*t,py=cy+rY*t,u=(((px-mx)*TSv)|0)&TSm,v=(((py-my)*TSv)|0)&TSm,ti=(v*TSv+u)*4,dist=t*rl,smv=Math.min(hzmax,dist*hzrate),iv=1-smv;
            let lt=0,lR=0,lG=0,lB=0;for(let j=0;j<gaN;j++){const ax=px-GLX[j],ay=py-GLY[j],q=GLA[j]/(1+1.15*(ax*ax+ay*ay+.44));lt+=q;lR+=q*GLR[j];lG+=q*GLG[j];lB+=q*GLB[j]}
            const lb=Math.max(baseL(dist),lbm),sk=(lb*.55+lt*.45+.05)*smv,kR=(lb*tbR+lR)*cellShade,kG=(lb*tbG+lG)*cellShade,kB=(lb*tbB+lB)*cellShade;
            if(HK){ // stone, not snow: darker, more contrast, a little colour; the tread edge of a step up is a light lip, the tread under a step down is in shadow
              const te=t-tIn,ek=(stUp&&te<lipT)?HK.lipGain:(stDn&&te<aoT)?HK.footAO:1,a=(fdd[ti]-FP)*FC+FP,b=(fdd[ti+1]-FP)*FC+FP,c=(fdd[ti+2]-FP)*FC+FP,gk=FG*ek;let a2=a,b2=b,c2=c;if(FS!==1){const lm=a*.3+b*.59+c*.11;a2=lm+(a-lm)*FS;b2=lm+(b-lm)*FS;c2=lm+(c-lm)*FS}
              D[o]=a2*FT0*gk*kR*iv+hz[0]*sk;D[o+1]=b2*FT1*gk*kG*iv+hz[1]*sk;D[o+2]=c2*FT2*gk*kB*iv+hz[2]*sk;
            }else{
            D[o]=fdd[ti]*kR*iv+hz[0]*sk;D[o+1]=fdd[ti+1]*kG*iv+hz[1]*sk;D[o+2]=fdd[ti+2]*kB*iv+hz[2]*sk;}
          }
        }
        if(yFar<yb)yb=yFar;
      }}else{const yT=HHv-(hc-cz)*Fv*Math.min(itIn,1000);if(yT<yb)yb=yT}
      if(wI){
        if(wTop){const k1=(cz-zw)*Fv,yFarS=HHv+k1*itO,yNearS=HHv+k1*Math.min(itIn,1000),ys=Math.max(0,Math.ceil(yFarS)),ye=Math.min(ybIn,Math.ceil(yNearS),VH);if(ye>ys){if(fdd===null){const fc2=(fm&&inside)?fm.charCodeAt(i):48;fdd=(slab&&TT)?TT:(fds[fc2-48]||fds[0]);cellShade=slab?1:(HK?sh[i]*(1-SD[i]*SHK):sh[i])};terrWaterTop(x,rX,rY,mx,my,zw,hc,ys,ye,fdd)}if(yFarS<yb)yb=yFarS}
        else terrCeilPaint(1,x,rX,rY,tIn,tOut,zw,yb,0);          // under the surface: the water is a luminous ceiling
        prevZc=-1e9;
      }else if(zcc>0&&!slab&&cz<zcc){terrCeilPaint(0,x,rX,rY,tIn,tOut,zcc,yb,prevZc);prevZc=zcc}
      else prevZc=-1e9;
      hprev=hc0;
    }
    first=false;
    const kb=Math.min(YBK-1,(tOut*YBS)|0),yv=Math.max(0,Math.min(VH,Math.ceil(yb)));
    for(let k=lastK+1;k<=kb;k++)YB[base+k]=yv;
    if(kb>lastK)lastK=kb;
    if(!inside||yb<=0||tOut>tStop||CY_A>=yb)break;
    if(sdx<sdy){sdx+=ddx;mx+=stx;side=0}else{sdy+=ddy;my+=sty;side=1}
    tIn=tOut;itIn=itO;
  }
  const yv=Math.max(0,Math.min(VH,Math.ceil(yb)));
  for(let k=lastK+1;k<YBK;k++)YB[base+k]=yv;
  return nh;
}
