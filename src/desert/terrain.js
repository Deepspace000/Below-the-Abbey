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
function terrRock(){const t=TEX[LEVEL===43?DS_TEXREG.cliffR:DS_TEXREG.cliffY];return {d:t&&t.d,tint:LEVEL===290?[.84,.9,.97]:LEVEL===60?[.8,.92,1.22]:LEVEL===61?[1.22,1.06,.7]:LEVEL===62?[1,.8,1.25]:LEVEL===63?[1.12,1.14,1.2]:[1,1,1]}}
// where a rock or a tree really meets the ground: the lowest point under its width, so it never hangs over a slope
function terrFoot(s,cx,cy){
  const rx=s.x-cx,ry=s.y-cy,dl=Math.hypot(rx,ry)||1,px=-ry/dl,py=rx/dl,hw=(s.w||1)*.4;
  return Math.min(terrH(s.x,s.y),terrH(s.x+px*hw,s.y+py*hw),terrH(s.x-px*hw,s.y-py*hw));
}
function terrH(x,y){
  const T=TERR_NOW;if(!T)return 0;
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
        const shade=(sh[i]*w00+sh[i+1]*w10+sh[i+W]*w01+sh[i+W+1]*w11)*(wv?1+.1*Math.sin(px*3.1+C.tm*2.2)*Math.sin(py*2.7-C.tm*1.7):1);
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
