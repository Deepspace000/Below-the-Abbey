/* ==========================================================================
   THORNWICK: THE ROOFS (prefix TKR). Level 3, the first town. The houses stand under the high sky with their walls only one storey tall, and until now nothing
   rose over them. Every house, shop, the inn and the chapel now has its own painted roof, seen from the street looking up (a flat gable or a straight eaves line,
   never the top of a roof), the same way Wenlock does it: a picture in the level's sky list (L.sky, drawn by khSkyList) standing on the wall top.
   - the pictures are Wenlock's roof pieces (assets/wl/roof1_*) and the Oldhaven roof pieces (kh_ohroof1_*), weathered into Thornwick's grim, withered palette:
     greyed and darkened, soot streaks running down from the ridge, moss along the eaves, missing tiles, and a painted chimney (cut from Wenlock's brick roof)
     on some, set on the ridge; each house gets a mirror, a tone and a slightly different width from a hash, and no two neighbours match;
   - the chapel has a grey spire beside its roof (the Oldhaven octagonal tower);
   - visual only: nothing here blocks, moves or hides anything, and the roofs of the houses a party buys (housing.js) are separate entries that are left alone.
   ========================================================================== */
const TKR={ready:false,loading:null,houses:[
  // [id, x0, x1, y0, y1, face (the side the street is on), roof piece, look]
  ['n1',12,14,10,14,'S','wl_roof1_1',{sat:.62,dark:.86,tint:[1.04,.98,.9],soot:.5,moss:.3,holes:2,chim:2}],
  ['n2',16,18,10,15,'S','kh_ohroof1_4',{sat:.7,dark:.84,tint:[1,.98,.92],soot:.6,moss:.6,holes:6,chim:1}],
  ['n3',19,21,10,14,'S','kh_ohroof1_0',{sat:.95,dark:1.02,tint:[.96,1,1.06],soot:.4,moss:.2,holes:1,chim:2}],
  ['n4',23,27,10,15,'S','kh_ohroof1_1',{sat:.85,dark:.98,tint:[.94,.98,1.08],soot:.45,moss:.3,holes:3,chim:3}],
  ['n5',29,31,10,14,'S','wl_roof1_0',{sat:.46,dark:.88,tint:[1.06,.94,.88],soot:.55,moss:.25,holes:3,own:1}],
  ['ch',33,37,10,14,'S','wl_roof1_4',{sat:.75,dark:.88,tint:[.94,.98,1.06],soot:.5,moss:.35,holes:3,steeple:1}],
  ['s1',12,14,21,23,'N','wl_roof1_2',{sat:.75,dark:.84,tint:[1,1,.92],soot:.5,moss:.2,holes:2,own:1}],
  ['s2',16,18,21,23,'N','kh_ohroof1_3',{sat:.95,dark:1.0,tint:[.96,1.02,.96],soot:.4,moss:.25,holes:2}],
  ['s3',19,22,19,22,'N','kh_ohroof1_2',{sat:.5,dark:.74,tint:[1.04,.94,.88],soot:.75,moss:.2,holes:5,chim:2,flip:1}],
  ['s4',24,28,19,22,'N','kh_ohroof1_5',{sat:.85,dark:1.0,tint:[1,.99,.97],soot:.45,moss:.3,holes:3,chim:2}],
  ['s5',30,34,19,22,'N','wl_roof1_5',{sat:.8,dark:.92,tint:[.96,1,.92],soot:.4,moss:.55,holes:4,chim:3}]
]};
function tkrRng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function tkrLoadImg(key,src){return new Promise(res=>{if(IMG[key])return res();const i=new Image();i.onload=()=>{IMG[key]=i;res()};i.onerror=()=>res();i.src=src+'?v='+VERSION})}
function tkrLoad(){
  if(TKR.loading)return TKR.loading;
  const jobs=[];for(let i=0;i<6;i++)jobs.push(tkrLoadImg('wl_roof1_'+i,'assets/wl/roof1_'+i+'.webp'));
  for(let i=0;i<6;i++)jobs.push(tkrLoadImg('kh_ohroof1_'+i,'assets/kh/ohroof1_'+i+'.webp'));
  jobs.push(tkrLoadImg('kh_ohtower1_4','assets/kh/ohtower1_4.webp'));
  return TKR.loading=Promise.all(jobs).then(()=>{TKR.ready=true});
}
/* the painted brick chimney of Wenlock's red roof (it stands on the ridge), cut out: used on other roofs, greyed and sooted */
function tkrChimney(){
  if(TKR.chim!==undefined)return TKR.chim;const s=IMG.wl_roof1_0;if(!s)return null;
  const cw=76,ch=150,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d');x.drawImage(s,178,0,cw,ch,0,0,cw,ch);
  // the lowest rows are where the slope starts to widen: fade the bottom edge so it can sit into any roof
  x.globalCompositeOperation='destination-in';const g=x.createLinearGradient(0,0,0,ch);g.addColorStop(0,'#000');g.addColorStop(.86,'#000');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,cw,ch);
  return TKR.chim=c;
}
/* one weathered roof: a grade (grey, dark, tinted), soot streaks from the ridge, moss along the eaves, missing tiles, and a painted chimney on the ridge */
function tkrRoofVar(k,id,o,flip){
  const key='tkr_'+id+(flip?'f':''),src=IMG[k];if(IMG[key])return key;if(!src)return null;
  const iw=src.width,ih=src.height,rng=tkrRng(id.charCodeAt(0)*131+id.charCodeAt(1)*17+(o.holes|0)*7+3);
  let hasCh=!!(o.chim||o.own);   // own: the piece already carries its chimney
  const cim=o.chim?tkrChimney():null,chW=Math.round(iw*(.19+(o.chim||0)*.012)),chH=cim?Math.round(chW*cim.height/cim.width):0,ext=cim?Math.round(chH*.9):0,H=ih+ext;
  const c=document.createElement('canvas');c.width=iw;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  // the apex of the roof: the first row with some picture in it (a hip roof has a flat top, so the middle of that row)
  let apexY=0,apexX=iw/2;{const t=document.createElement('canvas');t.width=iw;t.height=ih;const tx=t.getContext('2d',{willReadFrequently:true});tx.drawImage(src,0,0);const d=tx.getImageData(0,0,iw,ih).data;
    outer:for(let y=0;y<ih;y++){let a=-1,b=-1;for(let xx=0;xx<iw;xx++)if(d[(y*iw+xx)*4+3]>60){if(a<0)a=xx;b=xx}if(a>=0&&b-a>3){apexY=y;apexX=(a+b)/2;break outer}}}
  if(cim){const cx=apexX+(o.chim===2?-iw*.0:0),by=ext+apexY+chH*.1;x.save();x.drawImage(cim,cx-chW/2,by-chH,chW,chH);x.restore()}
  x.drawImage(src,0,ext);
  // grade
  const d=x.getImageData(0,0,iw,H),a=d.data,t=o.tint,sat=o.sat,dk=o.dark;
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;
    const C=v=>Math.max(0,Math.min(255,(v-105)*1.18+105));a[i]=C((l+(a[i]-l)*sat)*dk*t[0]);a[i+1]=C((l+(a[i+1]-l)*sat)*dk*t[1]);a[i+2]=C((l+(a[i+2]-l)*sat)*dk*t[2])}
  x.putImageData(d,0,0);
  x.globalCompositeOperation='source-atop';
  const top=ext+apexY,bot=ext+ih;
  // soot streaks running down from the ridge and the chimney
  for(let i=0;i<Math.round(9*o.soot)+2;i++){const sx=iw*(.2+rng()*.6),sw=iw*(.012+rng()*.03),sy=top+(rng()*.1)*ih,len=ih*(.35+rng()*.55);
    const g=x.createLinearGradient(0,sy,0,sy+len);g.addColorStop(0,'rgba(12,9,7,'+(.32+rng()*.22)*o.soot+')');g.addColorStop(1,'rgba(12,9,7,0)');x.fillStyle=g;
    x.beginPath();x.moveTo(sx-sw*.4,sy);x.lineTo(sx+sw*.4,sy);x.lineTo(sx+sw*(.9+rng()*.6),sy+len);x.lineTo(sx-sw*(.9+rng()*.6),sy+len);x.closePath();x.fill()}
  // the eaves darken (wet, sooty) along the bottom
  {const g=x.createLinearGradient(0,bot-ih*.22,0,bot);g.addColorStop(0,'rgba(18,14,10,0)');g.addColorStop(1,'rgba(18,14,10,.42)');x.fillStyle=g;x.fillRect(0,bot-ih*.22,iw,ih*.22)}
  // moss along the eaves and in the valleys: soft green-brown blobs
  for(let i=0;i<Math.round(14*o.moss)+1;i++){const mx=iw*rng(),my=bot-ih*(.02+rng()*.42*(.4+o.moss)),mr=iw*(.025+rng()*.05);
    const g=x.createRadialGradient(mx,my,0,mx,my,mr);g.addColorStop(0,'rgba(74,88,40,'+(.42+rng()*.2)+')');g.addColorStop(.6,'rgba(62,76,36,.28)');g.addColorStop(1,'rgba(60,72,34,0)');x.fillStyle=g;x.beginPath();x.ellipse(mx,my,mr*1.5,mr*.8,0,0,6.3);x.fill()}
  // missing tiles and shingles: dark ragged gaps, each with a thin pale edge where the next course shows
  for(let i=0;i<(o.holes|0);i++){const hy=top+ih*(.3+rng()*.55),spread=(hy-top)/ih*iw*.42,hx=iw/2+(rng()*2-1)*spread*.85,hw=iw*(.02+rng()*.03),hh=hw*(.5+rng()*.5);
    x.fillStyle='rgba(14,9,6,.78)';x.beginPath();for(let q=0;q<7;q++){const an=q/7*6.283,rr=.7+rng()*.5;x.lineTo(hx+Math.cos(an)*hw*rr,hy+Math.sin(an)*hh*rr)}x.closePath();x.fill();
    x.strokeStyle='rgba(150,138,118,.22)';x.lineWidth=1;x.beginPath();x.moveTo(hx-hw*.8,hy+hh*.9);x.lineTo(hx+hw*.8,hy+hh*.9);x.stroke()}
  x.globalCompositeOperation='source-over';
  {// a dark painted edge round the whole roof (the thick eave and the barge boards), so it reads crisp against the sky
    const sil=document.createElement('canvas');sil.width=iw;sil.height=H;const sx=sil.getContext('2d');sx.drawImage(c,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='rgba(12,9,7,.9)';sx.fillRect(0,0,iw,H);
    const o2=document.createElement('canvas');o2.width=iw;o2.height=H;const ox=o2.getContext('2d'),r=Math.max(2,Math.round(iw/150));
    for(let q=0;q<10;q++){const an=q/10*6.283;ox.drawImage(sil,Math.cos(an)*r,Math.sin(an)*r+r*.6)}
    ox.drawImage(c,0,0);c.getContext('2d').clearRect(0,0,iw,H);c.getContext('2d').drawImage(o2,0,0)}
  let out=c;if(flip){out=document.createElement('canvas');out.width=iw;out.height=H;const x2=out.getContext('2d');x2.translate(iw,0);x2.scale(-1,1);x2.drawImage(c,0,0)}
  out._tkrR=1;IMG[key]=out;NPC_H[key]=NPC_H[k];return key;
}
/* the steeple of the chapel: the grey octagonal tower of Oldhaven, greyed a little more and soot-stained down from the louvres */
function tkrSteeple(){
  const key='tkr_steeple',src=IMG.kh_ohtower1_4;if(IMG[key])return key;if(!src)return null;
  const iw=src.width,ih=src.height,c=document.createElement('canvas');c.width=iw;c.height=ih;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0);
  const d=x.getImageData(0,0,iw,ih),a=d.data;for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;a[i]=(l+(a[i]-l)*.55)*.74;a[i+1]=(l+(a[i+1]-l)*.55)*.76;a[i+2]=(l+(a[i+2]-l)*.55)*.78}
  x.putImageData(d,0,0);x.globalCompositeOperation='source-atop';
  for(let i=0;i<5;i++){const sx=iw*(.22+i*.14),g=x.createLinearGradient(0,ih*.3,0,ih*.95);g.addColorStop(0,'rgba(12,9,7,.3)');g.addColorStop(1,'rgba(12,9,7,0)');x.fillStyle=g;x.fillRect(sx,ih*.3,iw*.04,ih*.65)}
  const g=x.createLinearGradient(0,ih*.7,0,ih);g.addColorStop(0,'rgba(60,72,34,0)');g.addColorStop(1,'rgba(60,72,34,.3)');x.fillStyle=g;x.fillRect(0,ih*.7,iw,ih*.3);
  c._tkrR=1;IMG[key]=c;NPC_H[key]=NPC_H.kh_ohtower1_4;return key;
}
/* put the roofs into level 3's sky list, once the pictures are in */
function tkrPlace(L){
  if(L._tkr||!TKR.ready)return;L.sky=L.sky||[];const out=[];const WH=1.48;
  TKR.houses.forEach(([id,x0,x1,y0,y1,face,k,o],n)=>{
    const flip=o.flip!==undefined?!!o.flip:hash2(x0,y0,202)<.5,key=tkrRoofVar(k,id,o,flip);if(!key)return;
    const span=x1-x0+1,w=span+.1+(o.wide||0)*0+(hash2(x0,y0,205)-.5)*.3+(span>=5?.3:0),yc=face==='S'?y1+1-.55:y0+.55;
    out.push({x:(x0+x1+1)/2,y:yc,k:key,w,z:WH,tkr:1});
    if(o.steeple){const sk=tkrSteeple();if(sk)out.push({x:x0+1.05,y:yc-.12,k:sk,w:1.35,z:WH,big:1,tkr:1})}
  });
  for(const e of out)L.sky.push(e);L._tkr=out;
}
/* at dusk and night the far haze on a sky picture is a pale grey, which made the roofs glow against the dark walls: from the evening on a darker copy of each roof is drawn */
function tkrDim(img,step){
  if(!step||!img||!img.width)return img;const m=img._tkrM||(img._tkrM={});if(m[step])return m[step];
  const f=[1,.74,.58,.45][step],c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
  x.globalCompositeOperation='source-atop';x.fillStyle='rgba('+((14+8*step)|0)+','+((16+8*step)|0)+','+((26+10*step)|0)+','+(1-f)+')';x.fillRect(0,0,c.width,c.height);return m[step]=c}
{const _k=khSkyList;khSkyList=function(cx,cy,dX,dY,L,md){
  if(LEVEL===3){const L3=LEVELS[3];if(L3&&!L3._tkr){if(!TKR.loading)tkrLoad();else tkrPlace(L3)}}
  const out=_k.apply(this,arguments);
  if(LEVEL===3&&LEVELS[3]&&LEVELS[3]._tkr){const k=(G.day||1)/(G.dayBase||.95),step=k>.95?0:k>.82?1:k>.66?2:3;
    if(step)for(const s of out)if(s.img&&s.img._tkrR)s.img=tkrDim(s.img,step)}
  return out}}
