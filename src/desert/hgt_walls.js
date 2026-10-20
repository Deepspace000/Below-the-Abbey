/* ==========================================================================
   HOLLOW GRASSLANDS WALLS (prefix hgtw / HGTW): healed, sharper wall tiles and vines for the cities 481..484, the test levels and the interiors.
   - Every wall tile of a level in the range is processed once when the level is loaded (loadLevel is wrapped, like hgt_lamps.js), whoever built it:
       hgtwHeal(tex): the stacked 128 px pictures of a tall tile are joined (colour of the two pictures matched over a ramp, then a cross-fade of the rows either side
       of the join using a mirrored continuation of each picture), then a gentle unsharp + contrast step makes the painting crisper without noise.
       The left and right edges of the picture are blended too, so it tiles sideways without a seam (tex.mir = 1 marks a healed tile).
   - Vines (stand-ins made from hgt_lightvine until painted pictures hgt_vine_climb, hgt_vine_hang, hgt_vine_wreath exist, or hgt_vine_<name>_<mode>):
       hgtwVineTile(baseGid, vineName, opts) -> new gid: the wall tile with a vine laid over it.
          opts: mode 'climb' (grows up from the foot) | 'hang' (tendrils from the top) | 'both' | 'wreath' (small clumps round the middle of a unit), seed (number),
          h (climb height in cells, default 2.5), hue (degrees to turn the stand-in, default -105 = leaf green), unit (wreath: which unit).
       hgtwVineWalls(L, opts): swaps chosen wall cells of a built level for vined variants (street edges, more near plants, by district).
          opts: density 0..1 (default .12), seed, max (most new tiles, default 60), hue, only (array of base gids), mode (force a mode).
          Called automatically on load: HGTW.opts[levelId] = {density,...} sets the amount per city (481 heavy, the others light, interiors none).
   Picture names: a painted picture named vineName_<mode>, then vineName, then hgt_vine_<mode>, then the stand-in.
   ========================================================================== */
var HGTW=(typeof HGTW==='undefined')?{}:HGTW;
HGTW.opts={481:{density:.62,max:130,seed:481},482:{density:.1,max:40,seed:482},483:{density:.08,max:40,seed:483},484:{density:.08,max:40,seed:484}};
HGTW.noisy=5;HGTW.off=false;HGTW.stats={};
const hgtwRange=n=>hgtAny(n);
function hgtwHash(a,b,c){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,2147483647))|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296}
function hgtwRng(seed){let s=(seed|0)||1;return()=>{s=Math.imul(s^(s>>>15),2246822519)+1013904242|0;s=Math.imul(s^(s>>>13),3266489917)|0;return ((s^(s>>>16))>>>0)/4294967296}}


/* ---------- minimum detail: plinth, cornice and window/relief units on plain wall faces; bevelled step tiles ---------- */
const hgtwPieces={};
function hgtwPiece(name){ // 128x128 pixel data of a painted wall piece, or null
  if(hgtwPieces[name]!==undefined)return hgtwPieces[name];
  const im=typeof hgtaPic==='function'?hgtaPic(name):null;if(!im)return null; // not cached when missing: the pictures may load later
  const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');x.drawImage(im,0,0,128,128);
  const d=x.getImageData(0,0,128,128).data;let r=0,g=0,b=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2]}
  return hgtwPieces[name]={d,m:[r/16384,g/16384,b/16384]};
}
function hgtwUnitStat(d,y0,y1){let r=0,g=0,b=0,l=0,l2=0;const n=128*(y1-y0);for(let y=y0;y<y1;y++){let o=y*512;for(let x=0;x<128;x++,o+=4){r+=d[o];g+=d[o+1];b+=d[o+2];const v=d[o]*.3+d[o+1]*.59+d[o+2]*.11;l+=v;l2+=v*v}}
  const m=l/n;return {m:[r/n,g/n,b/n],sd:Math.sqrt(Math.max(0,l2/n-m*m))}}
function hgtwBand(d,y0,y1,add,mul){for(let y=Math.max(0,y0);y<Math.min(y1,d.length/512);y++){let o=y*512;for(let x=0;x<128;x++,o+=4){d[o]=d[o]*mul+add;d[o+1]=d[o+1]*mul+add;d[o+2]=d[o+2]*mul+add}}}
HGTW.winNames=['hgt_w2_winpink','hgt_w2_winaqua','hgt_w2_bandjade','hgt_w3_relief_pink','hgt_w3_relief_aqua','hgt_w3_fresco_cream','hgt_w3_fresco_amber','hgt_w3_scroll_aqua','hgt_w3_scroll_pink','hgt_w3_reed_lilac','hgt_w3_arcade_cream','hgt_w3_arcade_lilac','hgt_w3_shutters_lilac'];
function hgtwDetail(tex){
  const d=tex.d,Hp=tex.h,units=Math.floor(Hp/128);if(units<2||(tex.wh||0)<1.9)return;
  const st=[];for(let u=0;u<units;u++)st.push(hgtwUnitStat(d,Hp-128*(u+1),Hp-128*u));
  const plain=u=>st[u].sd<10;let busy=0;for(let u=1;u<units-1;u++)if(!plain(u))busy++;
  // relief units: a painted window or band piece, colour-matched, in the plain units of a face that has little else
  const pcs=HGTW.winNames.map(hgtwPiece).filter(Boolean);
  if(pcs.length&&units>=2){const every=busy>=(units-2)/3?4:3,u0=units>=4?2:1,sig=Math.floor(st[0].m[0]*7+st[0].m[1]*13+st[0].m[2]*29+Hp);
    for(let u=u0;u<units;u+=every){if(!plain(u)||(u===units-1&&units>=4))continue;
      const rk=pcs.map(pc=>[Math.abs(pc.m[0]-st[u].m[0])+Math.abs(pc.m[1]-st[u].m[1])+Math.abs(pc.m[2]-st[u].m[2]),pc]).sort((p,q)=>p[0]-q[0]);const best=rk[(sig+u)%Math.min(3,rk.length)][1]; // one of the three closest in colour, varied from tile to tile
      const y0=Hp-128*(u+1),sh=[0,1,2].map(c=>Math.max(-60,Math.min(60,st[u].m[c]-best.m[c])));
      for(let y=0;y<128;y++){const e=Math.min(1,Math.min(y,127-y)/10),o0=(y0+y)*512;for(let x=0;x<128;x++){const o=o0+x*4,q=(y*128+x)*4;for(let c=0;c<3;c++){const v=best.d[q+c]+sh[c];d[o+c]=d[o+c]*(1-e)+v*e}}}}}
  if(plain(0)){const y=Hp-18;hgtwBand(d,y,y+2,22,1);hgtwBand(d,y+2,Hp-2,0,.9);hgtwBand(d,Hp-2,Hp,-18,.85)} // plinth
  const top=Math.min(128,Hp-128*(units-1)>=64?Hp-128*(units-1):128);
  if(plain(units-1)){hgtwBand(d,0,10,12,1);hgtwBand(d,10,12,-30,1);hgtwBand(d,12,14,16,1)} // cornice
}
function hgtwStep(tex){ // a pearl step tile: light bevel at the top edge, darker joint at the foot, softly shaded sides
  if(!tex||tex._stp||!tex.d)return;const Hp=tex.h|0;if(Hp<16||tex.d.length!==128*Hp*4)return;tex._stp=1;
  if(!(tex.d instanceof Uint8ClampedArray))tex.d=Uint8ClampedArray.from(tex.d);const d=tex.d;
  for(let y=0;y<Hp;y++){const ty=y%128;let k=0;if(ty<3)k=30;else if(ty<10)k=16*(1-(ty-3)/7);else if(ty>=124)k=-46;else if(ty>=117)k=-20*((ty-116)/8);
    let o=y*512;for(let x=0;x<128;x++,o+=4){const ex=Math.min(x,127-x),kx=ex<5?-14*(1-ex/5):0,m=k+kx;d[o]+=m;d[o+1]+=m;d[o+2]+=m}}
}
/* ---------- healing ---------- */
function hgtwHeal(tex){
  if(!tex||tex._hl||!tex.d)return;const Hp=tex.h|0;if(Hp<8||tex.d.length!==128*Hp*4)return;tex._hl=1;
  if(!(tex.d instanceof Uint8ClampedArray))tex.d=Uint8ClampedArray.from(tex.d);
  const d=tex.d,S=512,K=12,RM=40;
  try{hgtwDetail(tex)}catch(e){console.error('hgtw detail',e)}
  for(let J=Hp-128;J>=24;J-=128){ // joins between stacked 128 px units, counted from the bottom
    const mean=(y0,y1)=>{let r=0,g=0,b=0;for(let y=y0;y<y1;y++){let o=y*S;for(let x=0;x<128;x++,o+=4){r+=d[o];g+=d[o+1];b+=d[o+2]}}const n=128*(y1-y0);return [r/n,g/n,b/n]};
    const mu=mean(J-6,J),ml=mean(J,Math.min(Hp,J+6)),dl=[0,1,2].map(c=>Math.max(-34,Math.min(34,(mu[c]-ml[c])*.5)));
    for(let i=0;i<RM;i++){const w=1-(i+.5)/RM,yl=J+i,yu=J-1-i;
      if(yl<Hp){let o=yl*S;for(let x=0;x<128;x++,o+=4){d[o]+=dl[0]*w;d[o+1]+=dl[1]*w;d[o+2]+=dl[2]*w}}
      if(yu>=0){let o=yu*S;for(let x=0;x<128;x++,o+=4){d[o]-=dl[0]*w;d[o+1]-=dl[1]*w;d[o+2]-=dl[2]*w}}}
    const ku=Math.min(K,J,Hp-J);
    for(let i=0;i<ku;i++){const w=.5+.5*(i+.5)/ku,a=(J-1-i)*S,b=(J+i)*S; // the mirrored continuation of each picture fades into the other
      for(let x=0;x<512;x+=4){const ia=a+x,ib=b+x;for(let c=0;c<3;c++){const pa=d[ia+c],pb=d[ib+c];d[ia+c]=pa*w+pb*(1-w);d[ib+c]=pb*w+pa*(1-w)}}}
  }
  const KH=12; // the wrap edge: the two sides of the picture's left and right edges fade into each other the same way, so the picture tiles sideways without a seam
  for(let y=0;y<Hp;y++){const r=y*S;for(let j=0;j<KH;j++){const w=.5+.5*(j+.5)/KH,ia=r+(127-j)*4,ib=r+j*4;for(let c=0;c<3;c++){const pa=d[ia+c],pb=d[ib+c];d[ia+c]=pa*w+pb*(1-w);d[ib+c]=pb*w+pa*(1-w)}}}
  // unsharp (luma only, soft knee so grain is not boosted) and a little contrast around the mean of the tile
  const N=128*Hp,L=new Float32Array(N);let sum=0;
  for(let p=0,o=0;p<N;p++,o+=4){const v=d[o]*.3+d[o+1]*.59+d[o+2]*.11;L[p]=v;sum+=v}
  const mean=sum/N;let CA=2.0,CC=.12,hf=0;
  for(let y=1;y<Hp-1;y+=2)for(let x=1;x<127;x+=2){const c=L[y*128+x];hf+=Math.abs(4*c-L[y*128+x-1]-L[y*128+x+1]-L[y*128-128+x]-L[y*128+128+x])*.125}
  hf/=((Hp>>1)*63);tex.hf=hf;
  if(hf>HGTW.noisy){ // busy small-scale noise (dots, static, cells) turns to pixel noise close up: low-pass it strongly instead of sharpening
    const pass=()=>{const c=d.slice();for(let y=0;y<Hp;y++){const yu=(y?y-1:1)*512,yd=(y<Hp-1?y+1:Hp-2)*512,r=y*512;for(let x=0;x<128;x++){const xl=(x?x-1:1)*4,xr=(x<127?x+1:126)*4,o=r+x*4;for(let k=0;k<3;k++)d[o+k]=(c[o+k]*4+c[r+xl+k]+c[r+xr+k]+c[yu+x*4+k]+c[yd+x*4+k])*.125}}};
    pass();pass();CA=0;CC=.04;tex.lp=1}

  for(let y=0;y<Hp;y++){const yu=y?y-1:1,yd=y<Hp-1?y+1:Hp-2;
    for(let x=0;x<128;x++){const xl=x?x-1:1,xr=x<127?x+1:126,c=L[y*128+x];
      let det=(4*c-L[yu*128+x]-L[yd*128+x]-L[y*128+xl]-L[y*128+xr])*.125;const a=det<0?-det:det;det*=a/(a+1.6);
      const add=det*CA+(c-mean)*CC,o=(y*128+x)*4;d[o]+=add;d[o+1]+=add;d[o+2]+=add}}
  tex.mir=1;
}
function hgtwHealLevel(L){
  const seen=new Set(),t0=performance.now();let n=0;
  const one=g=>{if(g===undefined||g===null||g<100||seen.has(g))return;seen.add(g);const ti=T_TILE[g];if(ti!==undefined&&TEX[ti]&&!TEX[ti]._hl){hgtwHeal(TEX[ti]);n++}};
  for(const k in L.chars)one(L.chars[k]);
  const stp=g=>{if(g){const ti=T_TILE[g];if(ti!==undefined&&TEX[ti])hgtwStep(TEX[ti])}};
  if(L.terrace){stp(L.terrace.riser);if(L.terrace.rg)for(let i=0;i<L.terrace.rg.length;i++)if(L.terrace.rg[i])stp(L.terrace.rg[i])}
  if(L.terrace){one(L.terrace.riser);if(L.terrace.rg)for(let i=0;i<L.terrace.rg.length;i++)if(L.terrace.rg[i])one(L.terrace.rg[i])}
  return {tiles:n,ms:Math.round(performance.now()-t0)};
}

/* ---------- vine pictures ---------- */
const hgtwPics={};
function hgtwKeyed(img){ // a canvas with alpha: real alpha when the picture has any, otherwise the magenta key
  const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0);
  const im=x.getImageData(0,0,w,h),p=im.data;let tr=false;for(let i=3;i<p.length;i+=4)if(p[i]<250){tr=true;break}
  if(!tr){for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],m=Math.min(r,b)-g;if(m>70&&r>150&&b>150)p[i+3]=0;else if(m>35&&r>120&&b>120){p[i+3]=Math.max(0,255-(m-35)*6);p[i]=Math.min(r,g+30);p[i+2]=Math.min(b,g+30)}}x.putImageData(im,0,0)}
  return c;
}
function hgtwVinePic(vineName,mode,hue){
  const key=vineName+'|'+mode+'|'+hue;if(hgtwPics[key]!==undefined)return hgtwPics[key];
  let pic=null;
  for(const n of [vineName+'_'+mode,vineName,'hgt_vine_'+mode]){const im=typeof hgtaPic==='function'?hgtaPic(n):IMG[n];if(im){pic=hgtwKeyed(im);break}}
  if(!pic){ // stand-in from the painted hanging light vine, turned to leaf green; climbing vines are the same picture upside down
    const src=hgtaPic('hgt_lightvine')||IMG['hgt_lightvine'];if(!src)return hgtwPics[key]=null;
    const w=src.naturalWidth||src.width,h=src.naturalHeight||src.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.filter='hue-rotate('+hue+'deg) saturate(1.7) brightness(1) contrast(1.12)';if(mode==='climb'||mode==='wreath'){x.translate(0,h);x.scale(1,-1)}x.drawImage(src,0,0);pic=c}
  return hgtwPics[key]=pic;
}
const hgtwVines=new Map();
function hgtwVineTile(baseGid,vineName,opts){
  opts=opts||{};const mode=opts.mode||'climb',seed=opts.seed|0,hue=opts.hue===undefined?-105:opts.hue,hc=opts.h===undefined?2.5:opts.h;
  const ti=T_TILE[baseGid],base=ti!==undefined?TEX[ti]:null;if(!base||!base.d||(typeof KH_DOOR!=='undefined'&&KH_DOOR[baseGid]))return baseGid;
  const key=baseGid+'|'+vineName+'|'+mode+'|'+seed+'|'+hc+'|'+hue+'|'+(opts.unit||0);if(hgtwVines.has(key))return hgtwVines.get(key);
  const Hp=base.h|0;if(Hp<8||base.d.length!==128*Hp*4){hgtwVines.set(key,baseGid);return baseGid}
  hgtwHeal(base);
  const c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(base.d),128,Hp),0,0);
  const R=hgtwRng(seed*7919+baseGid),units=Math.max(1,Math.floor(Hp/128));
  const put=(pic,cx,y,w,flip,alpha,anchorBottom)=>{ // draw a vine piece about cx, its top (or bottom) edge at y, w px wide; a soft dark copy under it gives it depth
    const h=w*pic.height/pic.width,dy=anchorBottom?y-h:y;
    x.save();x.globalAlpha=alpha*.32;x.filter='brightness(0) blur(1.4px)';x.drawImage(pic,cx-w/2+2,dy+3,w,h);x.restore();
    x.save();x.globalAlpha=alpha;x.drawImage(pic,cx-w/2,dy,w,h);x.restore()};
  const climb=()=>{const pic=hgtwVinePic(vineName,'climb',hue);if(!pic)return;const cols=1+(R()<.55?1:0)+(R()<.2?1:0),H=Math.min(Hp-12,hc*128*(.7+.6*R()));
    for(let k=0;k<cols;k++){const cx=14+R()*100,w=62+R()*44;let y=Hp+8,n=0;const stepY=w*pic.height/pic.width*.6;
      while(Hp-y<H&&n<14){put(pic,cx+(R()-.5)*14,y,w*(1-.05*n),0,Math.max(.25,1-n*.1-(Hp-y)/H*.35),true);y-=stepY;n++}}};
  const hang=(top)=>{const pic=hgtwVinePic(vineName,'hang',hue);if(!pic)return;const k=R()<.5?1:2;for(let i=0;i<k;i++){const w=k===1?96+R()*32:56+R()*20,cx=k===1?64+(R()-.5)*30:36+i*56+R()*14;put(pic,cx,top-3,w,0,.95,false)}};
  if(mode==='climb'||mode==='both')climb();
  if(mode==='hang'||mode==='both'){hang(0);if(units>6&&R()<.5){const u=2+((R()*(units-3))|0);hang(Hp-128*u)}}
  if(mode==='wreath'){const pw=hgtwVinePic(vineName,'wreath',hue),u=opts.unit||(1+((R()*Math.max(1,units-1))|0)),yb=Hp-128*(Math.min(u,units-1))-6;
    if(pw){put(pw,16+R()*8,yb,38+R()*10,1,.95,true);put(pw,112-R()*8,yb,38+R()*10,1,.95,true);hang(yb-110)}}
  const out=x.getImageData(0,0,128,Hp).data,id=addTex(out,base.e||null);TEX[id].h=Hp;TEX[id].wh=base.wh;TEX[id]._hl=1;TEX[id].mir=1;
  const gid=KH_NEXT_GID++;T_TILE[gid]=id;if(LIT_TILES.has(baseGid))LIT_TILES.add(gid);if(TILE_MSG[baseGid]!==undefined)TILE_MSG[gid]=TILE_MSG[baseGid];
  hgtwVines.set(key,gid);return gid;
}

/* ---------- vined walls of a level ---------- */
const hgtwPlantRe=/fern|flower|vine|shrub|bush|tree|willow|reed|grass|cap|mush|plant|garden|bed|pearlbush|hedge/i;
function hgtwVineWalls(L,opts){
  opts=opts||{};const rows=L.rows,H=rows.length,W=rows[0].length,dens=opts.density===undefined?.12:opts.density,seed=opts.seed|0,max=opts.max===undefined?60:opts.max,hue=opts.hue;
  if(!L.terrace||dens<=0)return 0;
  const th=L.terrace.h,plant=new Uint8Array(W*H);
  for(const dc of L.decor||[]){if(!dc||!hgtwPlantRe.test(dc.k||''))continue;const px=Math.floor(dc.x),py=Math.floor(dc.y);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=px+dx,yy=py+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H)plant[yy*W+xx]=1}}
  const gOf=ch=>{const g=L.chars[ch];return g!==undefined&&g>=100?g:undefined};
  const only=opts.only?new Set(opts.only):null,mk=[],variants=new Map(),made={n:0};let swapped=0;
  const nb=[[1,0],[-1,0],[0,1],[0,-1]],edit=rows.map(s=>s.split(''));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=rows[y][x];if(ch==='.')continue;const g=gOf(ch);if(g===undefined||(typeof KH_DOOR!=='undefined'&&KH_DOOR[g]))continue;if(only&&!only.has(g))continue;
    const ti=T_TILE[g],tx=ti!==undefined?TEX[ti]:null;if(!tx||!tx.d||tx.wh<.9)continue;
    let street=false;for(const [dx,dy] of nb){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H||rows[yy][xx]!=='.')continue;if(Math.abs(th[yy*W+xx]-th[y*W+x])<=1.4){street=true;break}}
    if(!street)continue;
    const dn=hgtwHash(x>>3,y>>3,seed+11),dist=.2+1.6*dn*dn+(dn>.8?.6:0); // some districts are thick with vine, some bare
    const p=Math.min(.95,dens*dist*(plant[y*W+x]?2.3:1));
    if(hgtwHash(x,y,seed+3)>=p)continue;
    const m=hgtwHash(y,x,seed+5),mode=opts.mode||(m<.5?'climb':m<.78?'both':m<.9?'hang':'wreath'),vi=Math.floor(hgtwHash(x*3,y*5,seed+9)*3),key=g+'|'+mode+'|'+vi;
    let ng=variants.get(key);
    if(ng===undefined){if(made.n>=max){ng=null}else{ng=hgtwVineTile(g,opts.name||'hgt_vine',{mode,seed:seed*31+vi*977+g,hue,h:1.6+hgtwHash(g,vi,seed)*2.4});made.n++}variants.set(key,ng)}
    if(!ng||ng===g)continue;
    edit[y][x]=hgtaChar(ng);L.chars[hgtaChar(ng)]=ng;swapped++;
  }
  for(let y=0;y<H;y++)rows[y]=edit[y].join('');
  return swapped;
}


/* ---------- tube ceiling: pearl vault with ring ribs and lit round windows (replaces the plain placeholder of hgt_engine.js unless a painted one exists) ---------- */
function hgtwTubeCeiling(){
  if(typeof DS_TEXREG==='undefined'||DS_TEXREG.hgt_tube_ceiling===undefined||HGTW._tc)return;const t=TEX[DS_TEXREG.hgt_tube_ceiling];if(!t||!t.d||t.d.length!==65536||t.h>128)return;HGTW._tc=1;
  const d=t.d;
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){const o=(y*128+x)*4,cx=(x%64)-31.5,cy=(y%64)-31.5,r=Math.hypot(cx,cy),ex=Math.min(x%64,63-x%64),ey=Math.min(y%64,63-y%64),e=Math.min(ex,ey);
    const sw=.5+.5*Math.sin((x*.9+y*.35)*.35+Math.sin(y*.21)*2),curve=1-.22*Math.pow(1-Math.min(ex,31)/31,2)*0+.12*(e/31); // the vault is lighter towards the middle of each panel, darker at the ribs
    let R=226-30*(1-sw)*.6,G=214-26*(1-sw)*.6,B=236-20*(1-sw)*.6,k=.8+.3*(e/31)*curve;
    if(e<2)k*=.55;else if(e<4)k*=1.18;else if(e<6)k*=.8; // rib: dark groove, bright bevel, soft shadow
    if(r<11){const g=1-r/11;R=R*(1-g)+255*g;G=G*(1-g)+226*g;B=B*(1-g)+150*g;k=1+.3*g}else if(r<13){k*=.55} // a lit round window with a dark rim
    d[o]=Math.min(255,R*k);d[o+1]=Math.min(255,G*k);d[o+2]=Math.min(255,B*k);d[o+3]=255}
}
/* ---------- hook: on level build ---------- */
function hgtwApply(L,id){
  if(!L||L._hw||HGTW.off)return;L._hw=1;
  try{hgtwTubeCeiling()}catch(e){console.error('hgtw tube',e)}
  const t0=performance.now(),h=hgtwHealLevel(L);let v=0;const o=HGTW.opts[id];
  if(o&&L.terrace){try{v=hgtwVineWalls(L,o)}catch(e){console.error('hgtw vines',e)}}
  HGTW.stats[id]={heal:h,vines:v,ms:Math.round(performance.now()-t0)};
}
{const _ll=loadLevel;loadLevel=function(n){
  if(hgtwRange(n)&&!HGTW.off){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();if(LEVELS[n])hgtwApply(LEVELS[n],n)}catch(e){console.error('hgtw apply',e)}}
  return _ll.apply(this,arguments)}}
