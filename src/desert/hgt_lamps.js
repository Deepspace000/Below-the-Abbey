/* ==========================================================================
   HOLLOW GRASSLANDS LAMPS (prefix hgtlm / HGTLM): night lamps in many colours for level 470, the cities 480..489 and their interiors 4850..5499.
   - The game clock (G.clock, hour = (G.clock%1440)/60) drives it: night is about 20:00 to 06:00 with a dusk fade from 18:30 and a dawn fade to 07:30.
     By day lamps are unlit (a dim picture, no light); at night they glow with a coloured light pool on the ground and walls and a halo over the lamp.
     In the cities (480..489) the ambient light, haze, roof and grade also go darker at night, so the lamps are the main light. Interiors keep their lamps lit.
   - Colours: a decor carrying lc:'purple' (or a number, an index of HGTLM.names) gets that colour. Colours are raster hue copies of the painted lamp pictures
     (hg_lamp_purple, hgt_lamppost_green, hgt_gardenlantern_orange, ... and their _off copies for the day), made at load time from IMG.
   - hgtlmColourise(L, seed) gives every lamp decor of a built level a colour by district; hgtlmApply(L) does that once. Both are called automatically when a level
     in the range is loaded (loadLevel is wrapped), so the city files need no change.
   - Extra: lamp lights are 'calm' (slow pulse, no flame flicker), light motes drift round lit lamps at night, and window pictures of the wall tiles glow at night.
   Core support in index.html: LIGHTS entries may carry col:[r,g,b] (absolute colour multipliers) and calm:true; the light loops of floors, walls and terrain.js use them.
   ========================================================================== */
const HGTLM={bases:['hg_lamp','hgt_lamppost','hgt_gardenlantern','hgt_hanglamp'],force:null,gain:.7,maxLights:5,cur:null,wins:new Map(),done:new Set(),winQ:[],winLv:-1,eState:0};
// glass: height of the lit glass as a fraction of the picture; hs: halo size; li: light strength
HGTLM.info={hg_lamp:{glass:.86,hs:1,li:1},hgt_lamppost:{glass:.9,hs:1.1,li:1},hgt_gardenlantern:{glass:.6,hs:.8,li:.8},hgt_hanglamp:{glass:.28,hs:.8,li:.9}};
/* colours: h0 top hue, h1 bottom hue (degrees), s saturation scale (0 = white). The light colour is made from the hue. */
HGTLM.defs=[['purple',275,275,1],['green',135,135,1],['blue',215,215,1],['orange',28,28,1],['yellow',52,52,1],['white',40,40,0],['pink',330,330,1],['aqua',178,178,1],
  ['sunset',28,338,1],['ocean',215,150,1],['dusk',275,215,1],['lime',55,125,1],['rose',0,330,.45],['ember',8,40,1]];
HGTLM.names=HGTLM.defs.map(d=>d[0]);HGTLM.COL={};
function hgtlmHsl(h,s,l){h=((h%360)+360)%360/360;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return [f(h+1/3),f(h),f(h-1/3)]}
for(const [name,h0,h1,sat] of HGTLM.defs){
  const a=hgtlmHsl(h0,Math.max(sat,.08)<.2?0:1,.5),b=hgtlmHsl(h1,sat<.2?0:1,.5),m=a.map((v,i)=>(v+b[i])/2),w=sat<.2?.9:.2; // white light for white; a little white mixed into colours
  HGTLM.COL[name]={name,i:HGTLM.names.indexOf(name),h0,h1,sat,rgb:m.map(v=>(v*(1-w)+w)*1.25),halo:m.map(v=>Math.round(255*(v*.75+.25)))};
}
const hgtlmIsLamp=k=>HGTLM.info[k]!==undefined;
function hgtlmColOf(lc){if(lc===undefined||lc===null)return null;return typeof lc==='number'?HGTLM.COL[HGTLM.names[((lc%HGTLM.names.length)+HGTLM.names.length)%HGTLM.names.length]]:(HGTLM.COL[lc]||null)}
const hgtlmId=n=>(n===470||hgtAny(n));
const hgtlmInterior=n=>n>=4850&&hgtAny(n);
const hgtlmTown=n=>n>=480&&n<=489;
/* ---------- the clock ---------- */
function hgtlmNight(){
  if(HGTLM.force!==null)return HGTLM.force;
  const h=((((G.clock||0)%1440)+1440)%1440)/60;let n;
  if(h>=20||h<6)n=1;else if(h>=18.5)n=(h-18.5)/1.5;else if(h<7.5)n=1-(h-6)/1.5;else n=0;
  return n*n*(3-2*n);
}
/* ---------- hue copies of the painted lamps (raster copies, made once, on first use) ---------- */
function hgtlmVariant(base,col,off){
  const name=base+'_'+col.name+(off?'_off':'');
  if(IMG[name])return name;
  const src=IMG[base];if(!src||!src.width)return null;
  const c=document.createElement('canvas'),W=c.width=src.width,H=c.height=src.height,x=c.getContext('2d');x.drawImage(src,0,0);
  const id=x.getImageData(0,0,W,H),D=id.data;let y0=H,y1=0;
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++)if(D[(y*W+xx)*4+3]>40){if(y<y0)y0=y;if(y>y1)y1=y}
  const span=Math.max(1,y1-y0);
  for(let y=0;y<H;y++){const t=Math.min(1,Math.max(0,(y-y0)/span)),hue=col.h0+((((col.h1-col.h0)%360)+540)%360-180)*t;
    for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4;if(D[i+3]<6)continue;
      const r=D[i]/255,g=D[i+1]/255,b=D[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,dl=mx-mn;let s=0;if(dl>0)s=l>.5?dl/(2-mx-mn):dl/(mx+mn);
      let s2,l2=l;
      if(col.sat<.2){s2=s*.12;l2=Math.min(1,l+.05)}else{s2=Math.min(1,Math.max(s*1.1,.3)*col.sat);if(l>.8)s2=Math.max(s2,.5*col.sat)}
      if(off){s2*=.5;l2=l2*.85}else if(l>.9)l2=Math.min(1,l2+.03);
      const o=hgtlmHsl(hue,s2,l2);D[i]=o[0]*255;D[i+1]=o[1]*255;D[i+2]=o[2]*255}}
  x.putImageData(id,0,0);IMG[name]=c;NPC_H[name]=NPC_H[base];
  if(base==='hg_lamp')IMG['hgt_lamp_'+col.name+(off?'_off':'')]=c; // the shorter name used in the brief
  return name;
}
/* ---------- colours by district ---------- */
const hgtlmPals=[['purple','blue','white','pink'],['green','aqua','yellow','white'],['orange','yellow','white','sunset'],['blue','purple','dusk','ocean'],['green','lime','yellow','orange'],['pink','rose','purple','white'],['aqua','white','blue','green'],['yellow','orange','ember','white']];
function hgtlmHash(a,b,c){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,2147483647))|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296}
function hgtlmColourise(L,seed){
  if(!L||!L.decor)return 0;seed=seed|0;let n=0;const count={};
  for(const d of L.decor){
    if(!hgtlmIsLamp(d.k))continue;
    if(d.lc!==undefined&&d.lc!==null){n++;continue}
    const bx=Math.floor(d.x/16),by=Math.floor(d.y/16),key=bx+','+by,pal=hgtlmPals[Math.floor(hgtlmHash(bx,by,seed+7)*hgtlmPals.length)];
    const k=count[key]=(count[key]||0)+1; // lamps of a lane come one after another in the list: the palette runs along the lane
    d.lc=hgtlmHash(d.x,d.y,seed)<.14?pal[Math.floor(hgtlmHash(d.y,d.x,seed+3)*pal.length)]:pal[(k+Math.floor(hgtlmHash(bx,by,seed)*pal.length))%pal.length];n++;
  }
  return n;
}
function hgtlmApply(L,id){
  if(!L||L._lm)return;L._lm=1;
  hgtlmColourise(L,id||L._id||0);
  const seen=new Set();for(const d of L.decor||[]){if(!hgtlmIsLamp(d.k))continue;const col=hgtlmColOf(d.lc);if(!col)continue;const key=d.k+col.name;if(seen.has(key))continue;seen.add(key);hgtlmVariant(d.k,col,false);hgtlmVariant(d.k,col,true)}
}
{ // build the level colours before a level in the range is loaded (the level is built first when it is a lazy one)
  const _ll=loadLevel;loadLevel=function(n){
    if(hgtlmId(n)){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();if(LEVELS[n])hgtlmApply(LEVELS[n],n)}catch(e){console.error('hgtlm apply',e)}}
    return _ll.apply(this,arguments)}
}
/* ---------- lights ---------- */
{const _sl=setupLights;setupLights=function(){_sl.apply(this,arguments);HGTLM.cur=null;if(hgtlmId(LEVEL)){try{hgtlmLights()}catch(e){console.error('hgtlm lights',e)}}}}
function hgtlmLights(){
  const items=[],at=new Map();
  for(const l of LIGHTS)if(l.free&&!l.lamp)at.set(Math.round(l.x*2)+','+Math.round(l.y*2),l);
  for(let di=0;di<G.decor.length;di++){const d=G.decor[di],sp=DECOR_SPAWNS[di]; // G.decor is a copy of the level decor without lc: read it from the spawn at the same index
    if(!hgtlmIsLamp(d.k))continue;if(sp&&sp.k===d.k&&sp.x===d.x&&sp.y===d.y&&sp.lc!==undefined)d.lc=sp.lc;const col=hgtlmColOf(d.lc);if(!col)continue;
    const kx=Math.round((d.x+.5)*2)+','+Math.round((d.y+.5)*2);let l=at.get(kx);
    if(!l){l={x:d.x+.5,y:d.y+.5,ph:hgtlmHash(d.x,d.y,5)*6.28,key:-7000-LIGHTS.length,taken:false,red:false,free:true};LIGHTS.push(l);at.set(kx,l)}
    const inf=HGTLM.info[d.k];l.col=col.rgb;l.calm=true;l.range2=130;l.hgtlm=1;
    items.push({d,l,col,base:HGTLM.gain*inf.li,ph:l.ph,lit:-1});
  }
  HGTLM.cur={lv:LEVEL,items,others:LIGHTS.filter(l=>!l.hgtlm&&l.free)};
}
function hgtlmTick(t){
  const C=HGTLM.cur;if(!C||C.lv!==LEVEL)return;
  const lvl=hgtlmInterior(LEVEL)?1:hgtlmNight(),lamp=.04+.96*lvl,on=lvl>.3;
  if(hgtlmTown(LEVEL))for(const l of C.others)l.kI=1-.6*lvl; // the glitter and other lights of the city fade at night so the lamps are the main light
  for(const it of C.items){
    const l=it.l;l.out=lvl<.03;l.kI=it.base*lamp*(1+.12*Math.sin(t*.9+it.ph)+.05*Math.sin(t*2.3+it.ph*1.7));
    if(it.lit!==on){it.lit=on;const nm=hgtlmVariant(it.d.k,it.col,!on);if(nm)it.d.lk=nm}
  }
}
/* ---------- the look of the city at night ---------- */
{const _hf=hgtLookFor;hgtLookFor=function(id){
  const v=_hf.apply(this,arguments);
  if(hgtlmTown(id)){
    if(!v._b)v._b={ambient:v.ambient,tint:v.tint.slice(),hazeCol:v.hazeCol.slice(),roofHaze:v.roofHaze.slice(),wallGain:v.wallGain,floorGain:v.floorGain,riserGain:v.riserGain,roofGain:v.roofGain,panoGain:v.panoGain,motes:v.motes,grade:v.grade.slice(),vignette:v.vignette};
    const b=v._b,n=hgtlmNight();
    if(v._n!==n){v._n=n;
      v.ambient=b.ambient*(1-.58*n);v.wallGain=b.wallGain*(1-.1*n);v.floorGain=b.floorGain*(1-.08*n);v.riserGain=b.riserGain*(1-.1*n);v.roofGain=b.roofGain*(1-.5*n);v.panoGain=b.panoGain*(1-.3*n);
      v.tint=[b.tint[0]*(1-.25*n),b.tint[1]*(1-.1*n),b.tint[2]*(1+.1*n)];
      v.hazeCol=[b.hazeCol[0]*(1-.7*n),b.hazeCol[1]*(1-.7*n),b.hazeCol[2]*(1-.5*n)];v.roofHaze=[b.roofHaze[0]*(1-.6*n),b.roofHaze[1]*(1-.6*n),b.roofHaze[2]*(1-.4*n)];
      v.grade=[b.grade[0]*(1-.35*n),b.grade[1]*(1-.3*n),b.grade[2]*(1-.1*n),b.grade[3]*(1+.8*n)];v.motes=Math.round(b.motes*(1+n));v.vignette=Math.min(1,b.vignette*(1+.25*n))}
  }
  return v}}
/* ---------- windows that light up at night: the glowing glass of the painted wall pictures becomes an emissive layer ---------- */
function hgtlmWindows(id){ // find the lit glass in each 128 px unit of a tile: warm bright pixels joined to a bright seed, row-filled; returns {full,half} RGBA arrays or null
  const T=TEX[id];if(!T||!T.d||T.e)return null;const d=T.d,Hp=T.h||(d.length/512),W=128,N=W*Hp,mask=new Uint8Array(N);let any=0;
  for(let u0=0;u0<Hp;u0+=128){const u1=Math.min(Hp,u0+128),hist=new Int32Array(512);
    for(let y=u0;y<u1;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;hist[d[i]-d[i+2]+255]++}
    let acc=0,ref=0;const half=(u1-u0)*W/2;for(let k=0;k<512;k++){acc+=hist[k];if(acc>=half){ref=k-255;break}}
    const loose=new Uint8Array(N),stack=[];
    for(let y=u0;y<u1;y++)for(let x=0;x<W;x++){const p=y*W+x,i=p*4,r=d[i],g=d[i+1],b=d[i+2];if(r>195&&r-b>ref+20){loose[p]=1;if(r>225&&r-b>55&&g>185)stack.push(p)}}
    const comp=new Uint8Array(N);
    for(const s0 of stack){if(comp[s0])continue;const q=[s0];comp[s0]=1;const cells=[];
      while(q.length){const p=q.pop();cells.push(p);const x=p%W,y=(p/W)|0;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=W||ny<u0||ny>=u1)continue;const np=ny*W+nx;if(loose[np]&&!comp[np]){comp[np]=1;q.push(np)}}}
      if(cells.length>2200)continue; // a whole glowing doorway has its own glow
      const lo=new Int32Array(Hp).fill(1e9),hi=new Int32Array(Hp).fill(-1);
      for(const p of cells){const x=p%W,y=(p/W)|0;if(x<lo[y])lo[y]=x;if(x>hi[y])hi[y]=x}
      for(let y=u0;y<u1;y++)if(hi[y]>=0)for(let x=lo[y];x<=hi[y];x++){mask[y*W+x]=1;any++}}
  }
  if(any<20)return null;
  const tints=[[1,.92,.72],[1,.74,.5],[1,.66,.78],[.84,.74,1],[.72,1,.9],[1,1,.8]],tn=tints[(id*7+3)%tints.length],full=new Uint8ClampedArray(N*4),half=new Uint8ClampedArray(N*4);
  for(let p=0;p<N;p++)if(mask[p]){const i=p*4,lum=(d[i]+d[i+1]+d[i+2])/3,k=1.15;full[i]=Math.min(255,d[i]*tn[0]*k);full[i+1]=Math.min(255,d[i+1]*tn[1]*k);full[i+2]=Math.min(255,d[i+2]*tn[2]*k);full[i+3]=255;
    half[i]=full[i];half[i+1]=full[i+1];half[i+2]=full[i+2];half[i+3]=110}
  return {full,half};
}
function hgtlmWinTick(){
  const n=hgtlmInterior(LEVEL)?1:hgtlmNight(),st=n<.12?0:n<.6?1:2;
  if(HGTLM.winLv!==LEVEL){HGTLM.winLv=LEVEL;const L=LEVELS[LEVEL],ch=L&&L.chars||{},seen=new Set();HGTLM.winQ.length=0; // the wall tiles this level uses
    for(const k in ch){const g=ch[k],id=g>=100?T_TILE[g]:undefined;if(id!==undefined&&!seen.has(id)&&!HGTLM.done.has(id)){seen.add(id);HGTLM.winQ.push(id)}}}
  if(st>0){const tw=performance.now();for(let k=0;k<6&&HGTLM.winQ.length&&(k===0||performance.now()-tw<1.5);k++){const id=HGTLM.winQ.pop();HGTLM.done.add(id);const w=hgtlmWindows(id);if(w){HGTLM.wins.set(id,w);if(HGTLM.eState===st)TEX[id].e=st===2?w.full:w.half}}} // time budget: a heavy tile never shares its frame with others
  if(HGTLM.eState!==st){HGTLM.eState=st;for(const [id,w] of HGTLM.wins)TEX[id].e=st===0?null:st===2?w.full:w.half}
}
/* ---------- halos and light motes over lit lamps (screen space, over the 3D view) ---------- */
HGTLM.haloImg={};
function hgtlmHalo(col){
  let c=HGTLM.haloImg[col.name];if(c)return c;
  c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32),r=col.halo;
  g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.12,'rgba('+r[0]+','+r[1]+','+r[2]+',.8)');g.addColorStop(.4,'rgba('+r[0]+','+r[1]+','+r[2]+',.22)');g.addColorStop(1,'rgba('+r[0]+','+r[1]+','+r[2]+',0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);return HGTLM.haloImg[col.name]=c;
}
function hgtlmHalos(){
  const C=HGTLM.cur;if(!C||C.lv!==LEVEL||!G._spr)return;
  const lvl=hgtlmInterior(LEVEL)?1:hgtlmNight();if(lvl<.05)return;
  const [cx,cy,dX,dY,pX,pY]=G._spr,inv=-1/PL,t=G.time||0,list=[];
  for(const it of C.items){
    const d=it.d;if(d.found||d.hidden)continue;const rx=d.x+.5-cx,ry=d.y+.5-cy,d2=rx*rx+ry*ry;if(d2>520)continue;
    const tX=inv*(dY*rx-dX*ry),tY=inv*(-pY*rx+pX*ry);if(tY<.5)continue;
    const inf=HGTLM.info[d.k],hgt=(NPC_H[d.k]||2)*(d.sc||1),foot=TERR_NOW?terrH(d.x+.5,d.y+.5):0,sx=VW/2*(1+tX/tY),
      sy=HH+(CAMZ-foot)*F/tY-((d.bob||0)+inf.glass*hgt)*F/tY,col=Math.floor(sx);
    if(col<-40||col>=VW+40)continue;if(col>=0&&col<VW&&zbuf[col]<tY-.3)continue;
    list.push({it,sx,sy,tY,d2,r:Math.max(5,F*inf.hs*hgt*.3/tY)})}
  if(!list.length)return;
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const o of list){const it=o.it,pu=.82+.18*Math.sin(t*.9+it.ph),fade=Math.min(1,(o.tY-.5)/1.2)*Math.min(1,Math.max(0,(520-o.d2)/200)),a=lvl*pu*fade*.8;if(a<.02)continue;
    ctx.globalAlpha=Math.min(1,a);const r=Math.min(110,o.r)*(1+.06*Math.sin(t*1.3+it.ph));ctx.drawImage(hgtlmHalo(it.col),o.sx-r,o.sy-r,r*2,r*2)}
  // motes: small bright specks that drift round the nearest lit lamps
  list.sort((a,b)=>a.d2-b.d2);
  for(let k=0;k<Math.min(8,list.length);k++){const o=list[k],it=o.it,rr=o.r,col=it.col.halo;
    for(let m=0;m<5;m++){const ph=it.ph+m*1.9,ang=t*(.25+m*.07)+ph,rad=rr*(.55+.5*Math.sin(t*.4+ph*2)),x=o.sx+Math.cos(ang)*rad*1.1,y=o.sy+Math.sin(ang*.8)*rad*.9-((t*(3+m)+ph*9)%20)*.4*(rr/14),tw=.3+.7*Math.max(0,Math.sin(t*2.2+ph*3));
      ctx.globalAlpha=Math.min(1,lvl*.8*tw*Math.min(1,(o.tY-.5)/1.5));ctx.fillStyle='rgb('+col[0]+','+col[1]+','+col[2]+')';const s=Math.max(.7,rr*.05);ctx.fillRect(x,y,s,s)}}
  ctx.restore();
}
{const _w=drawWeatherFx;drawWeatherFx=function(){_w.apply(this,arguments);if(hgtlmId(LEVEL)){try{hgtlmHalos()}catch(e){if(!HGTLM._e){HGTLM._e=1;console.error('hgtlm halos',e)}}}}}
/* the tick runs before every 3D picture: lamp light levels, lamp pictures (lit or dim), windows */
{const _r=render3D;render3D=function(){if(hgtlmId(LEVEL)){try{hgtlmTick(G.time||0);if(hgtlmTown(LEVEL)||hgtlmInterior(LEVEL))hgtlmWinTick()}catch(e){if(!HGTLM._e2){HGTLM._e2=1;console.error('hgtlm tick',e)}}}return _r.apply(this,arguments)}}
