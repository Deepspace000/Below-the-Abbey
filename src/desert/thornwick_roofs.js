/* ==========================================================================
   THORNWICK: THE ROOFS (prefix TKR). Level 3, the first town. The houses stand under the high sky with their walls only one storey tall, and until now nothing
   rose over them. Every house, shop, the inn and the chapel now has its own painted roof, seen from the street looking up (a flat gable or a straight eaves line,
   never the top of a roof): a picture in the level's sky list (L.sky, drawn by khSkyList) standing on the wall top, the same way Wenlock does it.
   - size: each roof is exactly as wide as the wall run of its house, corner to corner (read from the map), plus a 6 percent eave each side (hash variation at most 3 percent);
     its height is a believable gable (about .42 of its width, never more than 1.0 square above the wall top);
   - seat: centred on the house, on the wall top (z 1.53, the wall is 1.55), on the plane of the street wall; a house whose wall run does not match the table gets no roof;
   - the pictures are Wenlock's roof pieces (assets/wl/roof1_*) and the Oldhaven roof pieces (kh_ohroof1_*), weathered into Thornwick's grim palette: greyed, darkened, soot
     streaks, moss along the eaves, missing tiles; a chimney is painted INTO the roof picture (cut from Wenlock's brick roof, cut along the slope line so its base is inside the
     roof), small, on the slope; each house gets a mirror and a tone, and no two neighbours match;
   - the chapel has a small grey spire at its front corner (the Oldhaven octagonal tower);
   - visual only: nothing here blocks, moves or hides anything, and the roofs of the houses a party buys (housing.js) are separate entries that are left alone.
   ========================================================================== */
const TKR={ready:false,loading:null,houses:[
  // [id, x0, x1 (the wall run, corner to corner), y0, y1, face (the side the street is on), roof piece, look]
  ['n1',12,14,10,14,'S','wl_roof1_1',{sat:.28,dark:.52,tint:[1.04,.98,.9],soot:.5,moss:.3,holes:2,chim:-1}],
  ['n2',16,18,10,15,'S','kh_ohroof1_4',{sat:.8,dark:.58,tint:[1.12,.95,.8],soot:.6,moss:.6,holes:6,chim:1}],
  ['n3',19,21,10,14,'S','kh_ohroof1_0',{sat:.55,dark:.95,tint:[1.02,1,.96],soot:.4,moss:.2,holes:1,chim:-1}],
  ['n4',23,27,10,15,'S','kh_ohroof1_1',{cap:1.0,sat:1.05,dark:1.1,tint:[.9,.97,1.1],soot:.45,moss:.3,holes:3,chim:1}],
  ['n5',29,31,10,14,'S','kh_ohroof1_4',{sat:.6,dark:.85,tint:[1.05,.96,.9],soot:.55,moss:.25,holes:3,chim:-1}],
  ['ch',33,37,10,14,'S','kh_ohroof1_0',{cap:1.3,steeple:1,chim:-1,sat:.75,dark:1.3,tint:[.95,.98,1.06],soot:.6,moss:.5,holes:5}],
  ['s1',12,14,21,23,'N','wl_roof1_4',{sat:.6,dark:.55,tint:[1.1,.95,.8],soot:.5,moss:.2,holes:2,chim:1}],
  ['s2',16,18,21,23,'N','wl_roof1_1',{sat:.3,dark:.6,tint:[.94,1,.94],soot:.4,moss:.25,holes:2,chim:-1}],
  ['s3',19,22,19,22,'N','wl_roof1_5',{sat:.55,dark:.76,tint:[1.04,.94,.88],soot:.75,moss:.3,holes:5,chim:1,flip:1}],
  ['s4',24,28,19,22,'N','kh_ohroof1_0',{sat:.8,dark:1.25,tint:[1.04,.99,.94],soot:.45,moss:.3,holes:3,chim:-1,flip:1}],
  ['s5',30,34,19,22,'N','kh_ohroof1_2',{cap:1.0,sat:.9,dark:.78,tint:[1.05,.82,.72],soot:.45,moss:.5,holes:4,chim:1,flip:1}]
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
  return TKR.chim=c;
}
/* one weathered roof: a grade (grey, dark, tinted), soot streaks from the ridge, moss along the eaves, missing tiles, a painted chimney set ON the slope (the stack is cut
   along the slope line so its base is inside the roof), a dark painted edge; the picture is then given a believable gable height (never tall) */
function tkrRoofVar(k,id,o,flip,widthSq){
  const key='tkr_'+id+(flip?'f':''),src=IMG[k];if(IMG[key])return key;if(!src)return null;
  const iw=src.width,ih=src.height,rng=tkrRng(id.charCodeAt(0)*131+id.charCodeAt(1)*17+(o.holes|0)*7+3);
  // the slope profile: the first picture row of every column
  const t=document.createElement('canvas');t.width=iw;t.height=ih;const tx=t.getContext('2d',{willReadFrequently:true});tx.drawImage(src,0,0);const sd=tx.getImageData(0,0,iw,ih).data;
  const prof=new Array(iw).fill(ih);let apexY=ih;for(let xx=0;xx<iw;xx++){for(let y=0;y<ih;y++)if(sd[(y*iw+xx)*4+3]>60){prof[xx]=y;break}if(prof[xx]<apexY)apexY=prof[xx]}
  // the chimney: about 13 percent of the roof width, standing about a quarter of the roof height clear of the slope where it stands
  const cim=null,chW=Math.round(iw*.17),chH=Math.round(ih*.4),side=(o.chim||1)>0?1:-1,
    ccx=Math.round(iw/2+side*iw*.17),cbase=prof[Math.max(0,Math.min(iw-1,ccx))]+Math.round(ih*.03),ctop=cbase-chH,ext=cim?Math.max(0,-ctop):0,H=ih+ext;
  const c=document.createElement('canvas');c.width=iw;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(src,0,ext);
  const chimneyDraw=()=>{if(!cim)return; // the stack, drawn over the slope but cut along the slope line (plus a little) so the base sits inside the roof
    const stH=chH+Math.round(ih*.1),st=document.createElement('canvas');st.width=chW;st.height=stH;const sx=st.getContext('2d',{willReadFrequently:true});sx.drawImage(cim,0,10,cim.width,cim.height-30,0,0,chW,stH);
    const dd=sx.getImageData(0,0,chW,stH),da=dd.data,left=ccx-chW/2;
    for(let q=0;q<chW;q++){const colBase=(prof[Math.max(0,Math.min(iw-1,Math.round(left+q)))]+Math.round(ih*.03))-ctop;for(let y=Math.max(0,colBase);y<stH;y++)da[(y*chW+q)*4+3]=0}
    sx.putImageData(dd,0,0);for(let i=0;i<da.length;i+=4){const l=da[i]*.3+da[i+1]*.59+da[i+2]*.11;da[i]=(l+(da[i]-l)*.65)*.78;da[i+1]=(l+(da[i+1]-l)*.65)*.74;da[i+2]=(l+(da[i+2]-l)*.65)*.7}sx.putImageData(dd,0,0);x.drawImage(st,left,ext+ctop);x.fillStyle="rgba(8,6,5,.9)";x.fillRect(left-chW*.08,ext+ctop-3,chW*1.16,5)};
  // grade
  const d=x.getImageData(0,0,iw,H),a=d.data,tn=o.tint,sat=o.sat,dk=o.dark;
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;
    const C=v=>Math.max(0,Math.min(255,(v-105)*1.18+105));a[i]=C((l+(a[i]-l)*sat)*dk*tn[0]);a[i+1]=C((l+(a[i+1]-l)*sat)*dk*tn[1]);a[i+2]=C((l+(a[i+2]-l)*sat)*dk*tn[2])}
  x.putImageData(d,0,0);chimneyDraw();
  x.globalCompositeOperation='source-atop';
  const top=ext+apexY,bot=ext+ih;
  for(let i=0;i<Math.round(9*o.soot)+2;i++){const sx0=iw*(.2+rng()*.6),sw=iw*(.012+rng()*.03),sy=top+(rng()*.1)*ih,len=ih*(.35+rng()*.55);
    const g=x.createLinearGradient(0,sy,0,sy+len);g.addColorStop(0,'rgba(12,9,7,'+(.32+rng()*.22)*o.soot+')');g.addColorStop(1,'rgba(12,9,7,0)');x.fillStyle=g;
    x.beginPath();x.moveTo(sx0-sw*.4,sy);x.lineTo(sx0+sw*.4,sy);x.lineTo(sx0+sw*(.9+rng()*.6),sy+len);x.lineTo(sx0-sw*(.9+rng()*.6),sy+len);x.closePath();x.fill()}
  {const g=x.createLinearGradient(0,bot-ih*.22,0,bot);g.addColorStop(0,'rgba(18,14,10,0)');g.addColorStop(1,'rgba(18,14,10,.42)');x.fillStyle=g;x.fillRect(0,bot-ih*.22,iw,ih*.22)}
  for(let i=0;i<Math.round(14*o.moss)+1;i++){const mx=iw*rng(),my=bot-ih*(.02+rng()*.42*(.4+o.moss)),mr=iw*(.025+rng()*.05);
    const g=x.createRadialGradient(mx,my,0,mx,my,mr);g.addColorStop(0,'rgba(74,88,40,'+(.42+rng()*.2)+')');g.addColorStop(.6,'rgba(62,76,36,.28)');g.addColorStop(1,'rgba(60,72,34,0)');x.fillStyle=g;x.beginPath();x.ellipse(mx,my,mr*1.5,mr*.8,0,0,6.3);x.fill()}
  for(let i=0;i<(o.holes|0);i++){const hy=top+ih*(.3+rng()*.55),spread=(hy-top)/ih*iw*.42,hx=iw/2+(rng()*2-1)*spread*.85,hw=iw*(.02+rng()*.03),hh=hw*(.5+rng()*.5);
    x.fillStyle='rgba(14,9,6,.78)';x.beginPath();for(let q=0;q<7;q++){const an=q/7*6.283,rr=.7+rng()*.5;x.lineTo(hx+Math.cos(an)*hw*rr,hy+Math.sin(an)*hh*rr)}x.closePath();x.fill();
    x.strokeStyle='rgba(150,138,118,.22)';x.lineWidth=1;x.beginPath();x.moveTo(hx-hw*.8,hy+hh*.9);x.lineTo(hx+hw*.8,hy+hh*.9);x.stroke()}
  x.globalCompositeOperation='source-over';
  // a dark painted edge (inside the picture's own box, so the width stays exactly the roof's width)
  {const sil=document.createElement('canvas');sil.width=iw;sil.height=H;const sx=sil.getContext('2d');sx.drawImage(c,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='rgba(12,9,7,.9)';sx.fillRect(0,0,iw,H);
    const o2=document.createElement('canvas');o2.width=iw;o2.height=H;const ox=o2.getContext('2d'),r=Math.max(1,Math.round(iw/200));
    for(let q=0;q<10;q++){const an=q/10*6.283;ox.drawImage(sil,Math.cos(an)*r,Math.sin(an)*r)}
    ox.drawImage(c,0,0);c.getContext('2d').clearRect(0,0,iw,H);c.getContext('2d').drawImage(o2,0,0)}
  // the gable height: a pitched roof about .42 of its width, never more than about 1.0 square above the wall top; a low roof keeps its own pitch. The chimney scales with the roof.
  const natural=ih/iw,target=Math.min(natural,.33,(o.cap||.8)/widthSq),sy=target/natural,FH=Math.max(8,Math.round(H*sy));
  const out=document.createElement('canvas');out.width=iw;out.height=FH;{const ox=out.getContext('2d');if(flip){ox.translate(iw,0);ox.scale(-1,1)}ox.imageSmoothingQuality='high';ox.drawImage(c,0,0,iw,FH)}
  out._tkrR=1;out._pre=c;out._body=target;IMG[key]=out;NPC_H[key]=NPC_H[k];return key;
}
/* ---- the solid roof, from the exact wall squares of the map. Each house gets a pitched roof built of true-perspective planes (the plane3d mechanism of the second floor's bridges):
   - two gable ends, flat symmetrical triangles seen straight on (the painted roof picture, the chimney painted into it), one over the street wall and one over the back wall;
   - the two long slopes, each a staircase of narrow vertical bands of painted tile that climb from the eave (the wall top) to the ridge, so the roof is solid from every side;
   all of it stands on the wall top, is as wide as the wall run plus a small eave (none on a side where the next house touches), and is centred on the house. ---- */
/* the steeple of the chapel: the grey octagonal tower of Oldhaven, greyed a little more and soot-stained down from the louvres */
function tkrSteeple(){
  const key='tkr_steeple',src=IMG.kh_ohtower1_4;if(IMG[key])return key;if(!src)return null;
  const iw=src.width,ih=src.height,c=document.createElement('canvas');c.width=iw;c.height=ih;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0);
  const d=x.getImageData(0,0,iw,ih),a=d.data;for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;a[i]=Math.min(255,(l+(a[i]-l)*.6)*1.05);a[i+1]=Math.min(255,(l+(a[i+1]-l)*.6)*1.05);a[i+2]=Math.min(255,(l+(a[i+2]-l)*.6)*1.08)}
  x.putImageData(d,0,0);x.globalCompositeOperation='source-atop';
  for(let i=0;i<5;i++){const sx=iw*(.22+i*.14),g=x.createLinearGradient(0,ih*.3,0,ih*.95);g.addColorStop(0,'rgba(12,9,7,.3)');g.addColorStop(1,'rgba(12,9,7,0)');x.fillStyle=g;x.fillRect(sx,ih*.3,iw*.04,ih*.65)}
  const g=x.createLinearGradient(0,ih*.7,0,ih);g.addColorStop(0,'rgba(60,72,34,0)');g.addColorStop(1,'rgba(60,72,34,.3)');x.fillStyle=g;x.fillRect(0,ih*.7,iw,ih*.3);
  c._tkrR=1;IMG[key]=c;NPC_H[key]=NPC_H.kh_ohtower1_4;return key;
}
function tkrStep(src,id,k,n,lenSq,bandSq,alt,side){
  const key="tkr_"+id+"_s"+k+(alt?"a":"")+(side?"R":"L");if(IMG[key])return key;
  const PPS=80,W=Math.max(8,Math.round(lenSq*PPS)),H=Math.max(6,Math.round(bandSq*PPS)),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const sw=src.width,sh=src.height,cx0=Math.round(sw*.12),cw=Math.round(sw*.76),cy0=Math.round(sh*(.42+.5*(k/n)*.8)),ch=Math.round(sh*.2);
  const tileW=Math.max(1.4,Math.min(2.4,lenSq/2))*PPS;let px=0,fl=!!alt;
  while(px<W){x.save();if(fl){x.translate(px+tileW,0);x.scale(-1,1)}else x.translate(px,0);x.drawImage(src,cx0,cy0,cw,ch,0,0,tileW,H);x.restore();px+=tileW;fl=!fl}
  // courses: each band is lit at its top and in shade at its foot, with a dark joint between the courses
  let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(225,215,185,.20)');g.addColorStop(.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,6,4,.5)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(8,6,4,.55)';x.fillRect(0,H-2,W,2);x.fillStyle='rgba(8,6,4,.3)';x.fillRect(0,Math.round(H*.5),W,1);
  for(let q=0;q<W;q+=Math.round(PPS*.42)){x.fillStyle='rgba(8,6,4,.18)';x.fillRect(q+((k*17)%11),0,1,Math.round(H*.5));x.fillRect(q+Math.round(PPS*.21)+((k*7)%9),Math.round(H*.5),1,H)}
  if(k===0){g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(2,2,1,.75)');x.fillStyle=g;x.fillRect(0,0,W,H)}   // the eave in shadow
  if(k===n-1){x.fillStyle='rgba(238,228,198,.85)';x.fillRect(0,0,W,Math.max(3,Math.round(H*.16)))}   // the ridge catches the light
  x.fillStyle=side?"rgba(255,240,205,.16)":"rgba(0,0,0,.42)";x.fillRect(0,0,W,H);   // one slope lit, the other in shade
  c._tkrR=1;IMG[key]=c;return key;
}
/* a chimney stack: the face texture (dark sooty brick cut from Wenlock's painted chimney, a lighter stone cap, a pale rim at the edges so it reads against the sky) */
function tkrChimFace(key,wSq,hSq,seed){
  if(IMG[key])return key;const cim=tkrChimney();if(!cim)return null;
  const PPS=90,W=Math.max(8,Math.round(wSq*PPS)),H=Math.max(8,Math.round(hSq*PPS)),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  const capH=Math.round(H*.16);x.drawImage(cim,6,22,cim.width-12,cim.height-60,0,capH-2,W,H-capH+2);
  const d=x.getImageData(0,0,W,H),a=d.data;for(let i=0;i<a.length;i+=4){const l=a[i]*.3+a[i+1]*.59+a[i+2]*.11;a[i]=(l+(a[i]-l)*.95)*.78;a[i+1]=(l+(a[i+1]-l)*.8)*.66;a[i+2]=(l+(a[i+2]-l)*.7)*.58;a[i+3]=255}x.putImageData(d,0,0);
  let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(6,5,4,.55)');x.fillStyle=g;x.fillRect(0,capH,W,H-capH);
  for(let i=0;i<5;i++){const sx=W*((seed*37+i*61)%100)/100;g=x.createLinearGradient(0,capH,0,H);g.addColorStop(0,'rgba(8,6,4,.5)');g.addColorStop(1,'rgba(8,6,4,0)');x.fillStyle=g;x.fillRect(sx,capH,Math.max(2,W*.05),H*.6)}
  x.fillStyle='#8c8678';x.fillRect(0,0,W,capH);x.fillStyle='#a8a291';x.fillRect(0,0,W,Math.max(2,capH*.3));x.fillStyle='#2a2620';x.fillRect(0,capH-3,W,3);   // the stone cap and its shadow
  x.fillStyle="rgba(10,8,6,.85)";x.fillRect(0,0,3,H);x.fillRect(W-3,0,3,H);   // a pale rim at both edges
  c._tkrR=1;IMG[key]=c;return key;
}
function tkrPlace(L){
  if(L._tkr||!TKR.ready)return;L.sky=L.sky||[];const planes=[],rep=[];
  const solid=(x,y)=>L.rows[y]&&L.rows[y][x]!==undefined&&L.rows[y][x]!=='.';
  TKR.houses.forEach(h=>{const [id,x0,x1,ty0,ty1,face,k,o]=h,row=face==='S'?ty1:ty0;let y0=ty0,y1=ty1;
    const allSolid=y=>L.rows[y]&&L.rows[y].slice(x0,x1+1).split('').every(c=>c!=='.');
    if(!allSolid(row)){rep.push(id+' skipped: wall run has a gap');return}
    // the depth comes from the map, not the table: walk back from the street wall for as long as the whole width is wall, and make sure the street side does not go on
    if(face==='S'){while(y0>0&&allSolid(y0-1))y0--;if(allSolid(y1+1)){rep.push(id+' skipped: wall goes on past the street row');return}}
    else{while(allSolid(y1+1))y1++;if(allSolid(y0-1)){rep.push(id+' skipped: wall goes on past the street row');return}}
    if(y0!==ty0||y1!==ty1)rep.push(id+' table depth y '+ty0+'-'+ty1+' corrected to the map: y '+y0+'-'+y1);
    const W=x1-x0+1,D=y1-y0+1;let touchL=false,touchR=false;for(let y=y0;y<=y1;y++){if(solid(x0-1,y))touchL=true;if(solid(x1+1,y))touchR=true}
    const ovL=0,ovR=0,xL=x0-ovL,xR=x1+1+ovR,Wr=xR-xL,xc=(xL+xR)/2,flip=o.flip!==undefined?!!o.flip:hash2(x0,y0,202)<.5,key=tkrRoofVar(k,id,o,flip,Wr);if(!key)return;
    const gab=IMG[key],H=Wr*gab._body,ovF=.02,yF=face==='S'?y1+1-ovF:y0+ovF,yB=face==='S'?y0+ovF:y1+1-ovF,sg=face==='S'?1:-1,nF=[0,sg],nB=[0,-sg],zt=1.53,n=4;
    planes.push({x:xc,y:yF,k:key,w:Wr,bob:zt,flat:nF,id:id+'F'},{x:xc,y:yB,k:key,w:Wr,bob:zt,flat:nB,id:id+'B'});
    const yMin=Math.min(yF,yB),yMax=Math.max(yF,yB),len=yMax-yMin,band=H/n,pre=gab._pre||gab;
    for(let q=0;q<n;q++){const d=(q+.5)/n*(Wr/2),skL=tkrStep(pre,id,q,n,len,band,flip,0),skR=tkrStep(pre,id,q,n,len,band,flip,1);
      planes.push({x:xL+d,y:(yMin+yMax)/2,k:skL,w:len,bob:zt+q*band,flat:[-1,0],id:id+'L'+q},{x:xR-d,y:(yMin+yMax)/2,k:skR,w:len,bob:zt+q*band,flat:[1,0],id:id+'R'+q})}
    // the chimney: a stack of four faces standing on the upper slope and rising clear of the ridge (a quarter of the roof width wide, at least .3 of the roof height above the ridge)
    if(o.chim){const s=o.chim>0?1:-1,cw=Math.max(.42,Wr*.18),cd=cw*.8,off=Wr*.2,cx=xc+s*off,cy=yF-sg*Math.max(.7,len*.14),zBase=zt+H*(1-2*off/Wr)-.28,zTop=zt+H+.45,ht=zTop-zBase,
        ff=tkrChimFace('tkr_'+id+'_cf',cw,ht,id.charCodeAt(1)),sf=tkrChimFace('tkr_'+id+'_cs',cd,ht,id.charCodeAt(0)+3);
      if(ff&&sf)planes.push({x:cx,y:cy+cd/2,k:ff,w:cw,bob:zBase,flat:[0,1],id:id+'c1'},{x:cx,y:cy-cd/2,k:ff,w:cw,bob:zBase,flat:[0,-1],id:id+'c2'},{x:cx-cw/2,y:cy,k:sf,w:cd,bob:zBase,flat:[-1,0],id:id+'c3'},{x:cx+cw/2,y:cy,k:sf,w:cd,bob:zBase,flat:[1,0],id:id+'c4'})}
    // the church spire: the grey octagonal tower of Oldhaven as four faces, standing on the ridge at the front of the roof
    if(o.steeple){const sk=tkrSteeple();if(sk){const sw=.8,sh=sw*IMG[sk].height/IMG[sk].width,cy=yF-sg*1.0,zb=zt+H*.6;
      planes.push({x:xc,y:cy+sw/2,k:sk,w:sw,bob:zb,flat:[0,1],id:id+'t1'},{x:xc,y:cy-sw/2,k:sk,w:sw,bob:zb,flat:[0,-1],id:id+'t2'},{x:xc-sw/2,y:cy,k:sk,w:sw,bob:zb,flat:[-1,0],id:id+'t3'},{x:xc+sw/2,y:cy,k:sk,w:sw,bob:zb,flat:[1,0],id:id+'t4'});rep.push(id+' spire h '+sh.toFixed(2)+' base z '+zb.toFixed(2))}}
    rep.push([id,'wall x '+x0+'-'+(x1+1)+' y '+y0+'-'+(y1+1),'roof x '+xL.toFixed(2)+'-'+xR.toFixed(2),'centre '+xc.toFixed(2)+' vs '+((x0+x1+1)/2),'w '+Wr.toFixed(2)+' (wall '+W+')','ridge +'+H.toFixed(2),'gables y '+yF.toFixed(2)+' / '+yB.toFixed(2)].join(' | '))});
  L._tkr=planes;L._tkrRep=rep;
}
/* a plane seen almost edge-on (the camera nearly in the plane of the picture) is stretched by the engine into a huge slab: roof planes are not drawn then */
function tkrGraze(p,cx,cy){const rx=p.x-cx,ry=p.y-cy,d=Math.hypot(rx,ry)||1e-6,dot=Math.abs(rx*p.flat[0]+ry*p.flat[1]);return dot<.3||dot/d<.3}
/* at dusk and night the far haze on a sky picture is a pale grey, which made the roofs glow against the dark walls: from the evening on a darker copy of each roof is drawn */
function tkrDim(img,step){
  if(!step||!img||!img.width)return img;const m=img._tkrM||(img._tkrM={});if(m[step])return m[step];
  const f=[1,.74,.58,.45][step],c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
  x.globalCompositeOperation='source-atop';x.fillStyle='rgba('+((14+8*step)|0)+','+((16+8*step)|0)+','+((26+10*step)|0)+','+(1-f)+')';x.fillRect(0,0,c.width,c.height);return m[step]=c}
{const _k=khSkyList;khSkyList=function(cx,cy,dX,dY,L,md){
  if(LEVEL===3){const L3=LEVELS[3];if(L3&&!L3._tkr){if(!TKR.loading)tkrLoad();else tkrPlace(L3)}}
  const out=_k.apply(this,arguments);
  if(LEVEL===3&&LEVELS[3]&&LEVELS[3]._tkr){const k=(G.day||1)/(G.dayBase||.95),step=k>.95?0:k>.82?1:k>.66?2:3;
    for(const p of LEVELS[3]._tkr){const dx=p.x-cx,dy=p.y-cy;if(dx*dx+dy*dy>1500||tkrGraze(p,cx,cy))continue;let img=IMG[p.k];if(!img)continue;if(step)img=tkrDim(img,step);
      out.push({x:p.x,y:p.y,img,w:p.w,bob:p.bob,pic:1,plane3d:1,flat:p.flat,sky:!!window.TKR_SKY,smallSky:true,decor:KH_SKYD})}}
  return out}}
