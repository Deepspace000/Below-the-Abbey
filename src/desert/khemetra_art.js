/* ==========================================================================
   KHEMETRA: THE PICTURES. Every house front, rooftop, tower, stall and townsperson is a painted picture (assets/kh,
   made with Gemini and cut by tools/ingest_kh.py). They are loaded the first time the city is needed. A house front
   is cut into one slice per street cell, and houses come in one, two and three storeys.
   ========================================================================== */
let KH_MAN=null,KH_LOADING=null,KH_READY=false,KH_NEXT_GID=1000;
const KH_DOOR={};   // door tile number -> where it leads
function khLoadAssets(){
  if(KH_LOADING)return KH_LOADING;
  KH_LOADING=(async()=>{
    try{KH_MAN=await (await fetch('assets/kh/manifest.json?v='+VERSION)).json()}catch(e){KH_MAN={}}
    const names=Object.keys(KH_MAN);
    await Promise.all(names.map(k=>loadImg('kh_'+k,'assets/kh/'+KH_MAN[k].file)));
    khShrinkBig();
    KH_READY=true;
  })();
  return KH_LOADING;
}
const khImg=k=>IMG['kh_'+k];
/* the house-front sheets: only needed to cut the wall tiles, so they are let go once the city is built (khFreeSheets) */
const KH_SHEETS=/^kh_(fac[1-5]|shop[12]|temple1|bath1|palace1|castle1|pray1|ruin1)_/;
/* a picture larger than it is ever drawn is kept at the largest size a sprite copy uses, 512 pixels on its longest side */
function khShrinkBig(){
  for(const k in IMG){
    if(!k.startsWith('kh_')||KH_SHEETS.test(k))continue;
    const im=IMG[k];if(!im||!im.width)continue;
    const m=Math.max(im.width,im.height);if(m<=512)continue;
    const w=Math.max(1,Math.round(im.width*512/m)),h=Math.max(1,Math.round(im.height*512/m));
    IMG[k]=mkCanvas(w,h,x=>{x.imageSmoothingQuality='high';x.drawImage(im,0,0,w,h)});
  }
}
function khFreeSheets(){for(const k in IMG)if(KH_SHEETS.test(k))delete IMG[k]}
/* the strips of a facade picture that make up one, two or three storeys: [from, to] as fractions of the picture height */
const KH_LV={1:[[0,.12],[.5,1]],2:[[0,1]],3:[[0,.12],[.12,.5],[.12,.5],[.5,1]]};
/* Where to cut a front to leave out its upper storey (or repeat it). The cut goes along a row of plain wall, found by looking for the quietest row
   of the picture, so that no door, window or cornice is ever sliced in two. */
const KH_SEAM_CACHE={};
function khSeams(key){
  if(KH_SEAM_CACHE[key])return KH_SEAM_CACHE[key];
  const im=khImg(key),def={top:.12,mid:.5};
  if(!im||!im.width)return KH_SEAM_CACHE[key]=def;
  const w=96,h=Math.max(24,Math.round(96*im.height/im.width)),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data,L=(i,j)=>{const o=(j*w+i)*4;return .3*d[o]+.59*d[o+1]+.11*d[o+2]};
  const row=new Float32Array(h);
  for(let j=1;j<h;j++){let a=0;for(let i=1;i<w-1;i++){a+=Math.abs(L(i,j)-L(i,j-1))*1.0+Math.abs(L(i,j)-L(i+1,j))*1.3;if(L(i,j)<60)a+=14}row[j]=a/w}
  const sm=new Float32Array(h);for(let j=0;j<h;j++){let a=0,n=0;for(let k=-1;k<=1;k++){const q=j+k;if(q>=1&&q<h){a+=row[q];n++}}sm[j]=a/Math.max(1,n)}
  const best=(lo,hi,pref)=>{let bj=Math.round(pref*h),bv=1e9;for(let j=Math.max(2,Math.floor(lo*h));j<=Math.min(h-3,Math.ceil(hi*h));j++){const v=sm[j]+Math.abs(j/h-pref)*12;if(v<bv){bv=v;bj=j}}return bj/h};
  const top=best(.05,.2,.12),mid=best(Math.max(top+.15,.36),.62,.5),med=[...sm.slice(1)].sort((p,q)=>p-q)[(h-1)>>1]||1;
  // only a front with a really quiet band of wall at both cuts may lose or repeat a storey; every other front is always shown whole
  return KH_SEAM_CACHE[key]={top,mid,ok:sm[Math.round(top*h)]/med<.4&&sm[Math.round(mid*h)]/med<.4};
}
function khStrips(key,lv){
  if(lv===2||(lv!==1&&lv!==3))return [[0,1]];
  const {top,mid,ok}=khSeams(key);
  if(!ok)return [[0,1]];
  return lv===1?[[0,top],[mid,1]]:[[0,top],[top,mid],[top,mid],[mid,1]];
}
function khFacadeEntry(key,n,lv,kindOf){
  const m=KH_MAN[key];if(!m)return null;
  const strips=khStrips(key,lv),hh=strips.reduce((a,s)=>a+(s[1]-s[0]),0),wh=Math.round(n*hh*m.h/m.w*20)/20;
  return {f:key,n,wh,lv,strips};
}
function khBuildPools(){
  const P={house:[],mansion:[],low:[],shop:{},temple:[],pray:[],bath:[],ruin:[],palace:[],palaceDoor:[],castle:[],roofs:[],towers:[]};
  const piece=(sheet,k)=>sheet+'_'+k;
  const has=key=>!!(KH_MAN&&KH_MAN[key]);
  const add=(arr,key,n,lvs)=>{if(!has(key))return;for(const lv of lvs){const e=khFacadeEntry(key,n,lv);if(e)arr.push(e)}};
  for(let k=0;k<6;k++){add(P.house,piece('fac1',k),2,[1,2,3]);add(P.house,piece('fac2',k),2,[1,2,3]);add(P.mansion,piece('fac3',k),2,[2,3]);add(P.low,piece('fac4',k),2,[1,1,2]);add(P.low,piece('fac5',k),2,[1,1,2]);add(P.pray,piece('pray1',k),2,[2]);add(P.ruin,piece('ruin1',k),2,[1,2])}
  const SH1=['potion','scroll','food','spice','weapon','cloth'],SH2=['inn','inn2','ship','quest','work','map'];
  P.shop={potion:[],scroll:[],food:[],spice:[],weapon:[],cloth:[],inn:[],inn2:[],ship:[],quest:[],work:[],map:[]};
  SH1.forEach((s,k)=>add(P.shop[s],piece('shop1',k),2,[2]));SH2.forEach((s,k)=>add(P.shop[s],piece('shop2',k),2,[2]));
  for(let k=0;k<4;k++){add(P.temple,piece('temple1',k),3,[2]);add(P.bath,piece('bath1',k),3,[2]);if(k===0||k===2)add(P.palace,piece('palace1',k),3,[2]);else add(P.palaceDoor,piece('palace1',k),3,[2])}
  for(let k=0;k<4;k++)add(P.castle,piece('castle1',k),5,[2]);
  for(const s of ['roof1','roof2'])for(let k=0;k<6;k++)if(has(piece(s,k)))P.roofs.push(piece(s,k));
  for(const s of ['tow1','tow2'])for(let k=0;k<6;k++)if(has(piece(s,k)))P.towers.push(piece(s,k));
  // narrow fronts, one square wide, for the odd square left at the end of a stretch of wall (so no front is ever cut off short, nor left as a blank slab)
  P.narrow={house:[],mansion:[],low:[],shop:[],temple:[],pray:[],bath:[],ruin:[]};
  for(let k=0;k<6;k++){add(P.narrow.house,piece('fac1',k),1,[2]);add(P.narrow.house,piece('fac2',k),1,[2]);add(P.narrow.mansion,piece('fac3',k),1,[2]);add(P.narrow.low,piece('fac4',k),1,[2]);add(P.narrow.low,piece('fac5',k),1,[2]);add(P.narrow.pray,piece('pray1',k),1,[2]);add(P.narrow.ruin,piece('ruin1',k),1,[2])}
  for(let k=0;k<6;k++){add(P.narrow.shop,piece('shop1',k),1,[2])}
  for(const k of ['temple','bath'])P.narrow[k]=P.narrow.house;
  // when a kind has nothing painted yet, a neighbour stands in
  for(const k of ['house','mansion','low','temple','pray','bath','ruin','palace','castle'])if(!P[k].length)P[k]=P.house.length?P.house:[{f:'plain',n:2,wh:1.6,lv:2,strips:[[0,1]]}];
  for(const s of Object.keys(P.shop))if(!P.shop[s].length)P.shop[s]=P.house;
  return P;
}
/* one picture, cut into n tiles of 128 by (128*wh): the walls of the city */
const KH_TILE_CACHE={};
function khTileSet(e){
  const key=e.f+'|'+e.n+'|'+e.lv;if(KH_TILE_CACHE[key])return KH_TILE_CACHE[key];
  const im=khImg(e.f),W=128*e.n,Hp=Math.max(64,Math.round(128*e.wh));
  const full=mkCanvas(W,Hp,(x,w,h)=>{
    if(!im){x.fillStyle='#d8c8a0';x.fillRect(0,0,w,h);return}
    const iw=im.width,ih=im.height,k=w/iw,tot=e.strips.reduce((a,s)=>a+(s[1]-s[0]),0)*ih*k;let y=0;
    for(const s of e.strips){const sh=(s[1]-s[0])*ih,dh=sh*k*(h/tot);x.drawImage(im,0,s[0]*ih,iw,sh,0,y,w,dh+1);y+=dh}
  });
  const tiles=[];
  for(let s=0;s<e.n;s++){
    const c=mkCanvas(128,Hp,(x)=>{x.drawImage(full,s*128,0,128,Hp,0,0,128,Hp)});
    const d=c.getContext('2d').getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=e.wh;
    const gid=KH_NEXT_GID++;T_TILE[gid]=id;tiles.push({gid,tex:id});
  }
  return KH_TILE_CACHE[key]=tiles;
}
/* floors: the painted paving sheets, cut into seamless squares */
function khMakeFloors(){
  const names=[];
  // a picture drawn at the size of one cell; zoom takes the middle part of it, so fine patterns read at game scale
  const put=(n,key,zoom)=>{const im=khImg(key);if(!im)return false;const [c,x]=tcv(),sw=im.width/zoom,sh=im.height/zoom,sx=(im.width-sw)/2,sy=(im.height-sh)/2;x.drawImage(im,sx,sy,sw,sh,0,0,TS,TS);FLOORS[n]=pix(c);names.push(n);return true};
  // 0 cobbles, 1 slabs, 2 painted tile, 3 market setts, 4 lawn, 5 mosaic
  const want=[[['floor2_0'],1],[['floor2_2','floor2_1'],1],[['floor3_3','floor3_0','floor2_4'],1],[['floor2_5','floor2_3'],1],[['floor1_4'],1],[['floor3_2','floor2_4'],2]];
  const base=['#c9b48a','#d4c09a','#c8b890','#b89c70','#6e8f4a','#7aa0b8'];
  want.forEach(([keys,zoom],i)=>{
    if(keys.some(k=>put('kh'+i,k,zoom)))return;
    const [c,x]=tcv();x.fillStyle=base[i];x.fillRect(0,0,TS,TS);
    for(let k=0;k<70;k++){x.fillStyle='rgba('+(k%2?'255,245,220':'80,60,30')+',.18)';x.beginPath();x.ellipse(hash2(k,i,3)*TS,hash2(k,i,4)*TS,6+hash2(k,i,5)*10,5+hash2(k,i,6)*7,0,0,TAU);x.fill()}
    FLOORS['kh'+i]=pix(c);names.push('kh'+i);
  });
  return names;
}
