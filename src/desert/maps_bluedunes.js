/* Area map for the Blue Dunes (level 60): pale lapis and pearl sand, long wind-carved crests, a small oasis in the middle, the low cave in the west wall. */
const MPB_INK='#1c2236';
function mpBlueDunesDune(x,a,b,w){x.save();x.fillStyle='#d6e4f4';x.strokeStyle='rgba(30,44,90,.7)';x.lineWidth=.5;x.beginPath();x.moveTo(a-w,b+w*.3);x.quadraticCurveTo(a-w*.5,b-w*.5,a,b-w*.45);x.quadraticCurveTo(a+w*.5,b-w*.3,a+w,b+w*.3);x.quadraticCurveTo(a,b+w*.45,a-w,b+w*.3);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(60,84,150,.38)';x.beginPath();x.moveTo(a,b-w*.45);x.quadraticCurveTo(a+w*.5,b-w*.3,a+w,b+w*.3);x.quadraticCurveTo(a+w*.4,b+w*.4,a+w*.1,b+w*.28);x.quadraticCurveTo(a+w*.15,b-w*.1,a,b-w*.45);x.fill();
  x.strokeStyle='rgba(40,60,120,.45)';x.lineWidth=.35;for(let k=1;k<=2;k++){x.beginPath();x.moveTo(a+w*(.15+k*.25),b+w*.28-k*.3);x.lineTo(a+w*(.3+k*.25),b-w*.02+k*.2);x.stroke()}x.restore()}
function mpBlueDunesStone(x,a,b,s){x.save();x.fillStyle='#c4cfe0';x.strokeStyle=MPB_INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1*s,b+1);x.lineTo(a-.8*s,b-4*s);x.lineTo(a+.2*s,b-5*s);x.lineTo(a+1*s,b-3.6*s);x.lineTo(a+1.1*s,b+1);x.closePath();x.fill();x.stroke();x.restore()}
function mpBlueDunesPalm(x,a,b,s){x.save();x.strokeStyle='#3a3a52';x.lineWidth=.9*s;x.beginPath();x.moveTo(a,b+1.5*s);x.quadraticCurveTo(a+1*s,b-2*s,a+.4*s,b-4.6*s);x.stroke();
  x.strokeStyle=MPB_INK;x.fillStyle='#3c8a78';x.lineWidth=.4;const tx=a+.4*s,ty=b-4.6*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.6*s,ty+dy*2.6*s-.6*s,tx+dx*4*s,ty+dy*3*s+1.6*s);x.quadraticCurveTo(tx+dx*2.4*s,ty+dy*2*s+.4*s,tx,ty);x.fill();x.stroke()}x.restore()}
function mpBlueDunesCrescent(x,a,b,r){x.save();x.fillStyle=MPL.GOLD2;x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(a,b,r,.5,5.8);x.arc(a+r*.45,b-r*.15,r*.8,5.7,.6,true);x.closePath();x.fill();x.stroke();x.restore()}
function mpBlueDunesMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),S=f.s,X=f.X,Y=f.Y,R=hash2,cx0=BDN.OX,cy0=BDN.OY;
  const swell=(a,b)=>(Math.sin(a*.07+Math.sin(b*.045)*2.2)+Math.sin(b*.1+a*.03)+Math.sin((a-b)*.045)*.7+2.7)/5.4;
  mpDesertLand(x,f,L,(a,b)=>{const fm=L.fmap[b][a];if(fm==='3')return [74,138,192];if(fm==='2')return [118,170,150];
    const m=Math.max(0,Math.min(1,swell(a,b))),n=R(a>>2,b>>2,960),k=[[0,[100,128,190]],[.5,[148,174,222]],[1,[206,222,244]]];
    const c=mpDesertLerpCol(k,m);return [c[0]-n*10,c[1]-n*10,c[2]-n*6]},{fill:'rgba(50,70,140,.3)',hatch:'rgba(30,44,100,.55)',far:'rgba(70,96,170,.25)'});
  x.save();x.beginPath();x.rect(X(1),Y(1),(W-2)*S,(H-2)*S);x.clip();x.lineCap='round';x.lineJoin='round';
  // long wind-carved crests: a pale lit line with a lapis shadow line under it, wandering across the sand
  for(let i=0;i<150;i++){let a=3+R(i,1,961)*(W-6),b=3+R(i,2,961)*(H-6),an=.35+Math.sin(b*.03)*.4+(R(i,3,961)-.5)*.5;const len=14+R(i,4,961)*34,pts=[];
    for(let t=0;t<len;t+=1.5){pts.push([a,b]);an+=(Math.sin(a*.05+b*.03)*.05)+(R(i,t|0,962)-.5)*.1;a+=Math.cos(an)*1.5;b+=Math.sin(an)*1.5}
    const ok=pts.every(([p,q])=>Math.hypot(p-cx0,q-cy0)>13&&p>3&&q>3&&p<W-3&&q<H-3);if(!ok)continue;
    const path=(dy)=>{x.beginPath();pts.forEach(([p,q],j)=>j?x.lineTo(X(p),Y(q)+dy):x.moveTo(X(p),Y(q)+dy))};
    path(.9);x.strokeStyle='rgba(50,72,140,.5)';x.lineWidth=.7;x.stroke();path(0);x.strokeStyle='rgba(248,250,255,.85)';x.lineWidth=.8;x.stroke()}
  // ripple hatching in drifts, mostly on the shadow side
  for(let i=0;i<1700;i++){const a=2+R(i,5,963)*(W-4),b=2+R(i,6,963)*(H-4);if(Math.hypot(a-cx0,b-cy0)<9)continue;const m=swell(a,b);
    x.strokeStyle=m<.5?'rgba(40,62,130,.5)':'rgba(255,255,255,.7)';x.lineWidth=.45;mpDesertRipple(x,X(a),Y(b),1.6+R(i,7,963)*2.6)}
  x.restore();
  // the real dunes from the level
  // the real dunes of the level (same rule that places them, so the map matches the ground)
  for(let y=2;y<H-2;y++)for(let xx=2;xx<W-2;xx++){if(Math.hypot(xx-cx0,y-cy0)<8.5||(xx<8&&Math.abs(y-cy0)<7))continue;
    if(R(xx,y,20)<.03&&R(xx,y,23)<.3&&xx>4&&y>4&&xx<W-5&&y<H-5)mpBlueDunesDune(x,X(xx+.5+(R(xx,y,3)-.5)*.3),Y(y+.5+(R(xx,y,4)-.5)*.3),2.4+1.8*(.9+R(xx,y,22)*.7))}
  // the oasis
  {const a=X(cx0+.5),b=Y(cy0+.5);x.save();x.fillStyle='rgba(70,140,190,.9)';x.strokeStyle=MPB_INK;x.lineWidth=.8;x.beginPath();x.ellipse(a,b,6.4,5.4,0,0,6.3);x.fill();x.stroke();
    x.strokeStyle='rgba(230,244,255,.8)';x.lineWidth=.4;for(let k=0;k<4;k++)mpDesertRipple(x,a-2+k*1.2,b-2+k*1.5,2.2);x.restore();
    x.save();x.strokeStyle='#3f8a70';x.lineWidth=.5;for(let k=0;k<22;k++){const an=k/22*6.28,rx=a+Math.cos(an)*7.2,ry=b+Math.sin(an)*6.2;x.beginPath();x.moveTo(rx,ry+1);x.lineTo(rx+(R(k,1,964)-.5),ry-2.2-R(k,2,964)*1.2);x.stroke()}x.restore();
    for(const d of L.decor){if(/^dpalm/.test(d.k))mpBlueDunesPalm(x,X(d.x+.5),Y(d.y+.5)+1,.75)}
    for(const d of (L.scenery||[]).filter(s=>/^dshrub/.test(s.k))){x.fillStyle='#6aa88a';x.strokeStyle=MPB_INK;x.lineWidth=.4;x.beginPath();x.arc(X(d.wx),Y(d.wy),1.1,0,6.3);x.fill();x.stroke()}
    for(const it of L.items||[]){x.fillStyle=it.k==='water'?'#2a5aa8':MPL.GOLD;x.strokeStyle=MPB_INK;x.lineWidth=.35;x.beginPath();x.arc(X(it.x+.5),Y(it.y+.5),.8,0,6.3);x.fill();x.stroke()}}
  // creature camps: a small skull each
  {const seen=new Set();for(const e of L.enemies||[]){const key=((e.x/16)|0)+','+((e.y/16)|0);if(seen.has(key))continue;seen.add(key);MPLI.skull(x,X(e.x+.5),Y(e.y+.5),.8)}}
  // the low cave in the west wall
  {const a=X(1),b=Y(cy0+.5);x.save();x.fillStyle='#10131c';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-3,b+3);x.lineTo(a-3,b);x.quadraticCurveTo(a+1,b-4,a+5,b);x.lineTo(a+5,b+3);x.closePath();x.fill();x.stroke();x.restore()}
  // a few standing stones and a small caravan as ink details on the sand
  for(const [a,b] of [[62,96],[66,99],[64,93],[158,150],[161,153]])mpBlueDunesStone(x,X(a),Y(b),.9);
  for(let k=0;k<3;k++)mpDesertCamel(x,X(128+k*7),Y(142-k*3),.75,false);
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz,col||'#1c2a5a');
  T('The Oasis',cx0,cy0+13,6.8,'#1a4a78');T('The Cave to the Sand Road',34,cy0-12,5.8,'#3a2a1c');T('The Still Sands',150,60,7.4);T('The Pale Swells',60,178,6.8);T('The Silver Crests',165,185,6.4);
  mpBlueDunesCrescent(x,46,258,9);
  const kk=mpDesertKeyStd();
  mpDesertMargin(x,api,{title:'Blue Dunes',sub:'level 60',notes:[
    'A low cave in the east wall of the Sand Road leads to this second desert.',
    'The sand is pale blue and lies in long smooth swells. The air is still and almost nothing lives here.',
    'A small oasis in the middle has a pool, palms, and food and water beside it.',
    'Scorpions and wolves keep to camps far from the cave and the oasis.'],
    key:[['Blue dune',(g,a,b)=>mpBlueDunesDune(g,a,b+1,4.5)],['Oasis pool',(g,a,b)=>{g.fillStyle='#4a8cc0';g.strokeStyle=MPB_INK;g.lineWidth=.6;g.beginPath();g.ellipse(a,b,4.5,2.8,0,0,6.3);g.fill();g.stroke()}],['Palm',(g,a,b)=>mpBlueDunesPalm(g,a,b+2,.8)],['Standing stone',(g,a,b)=>mpBlueDunesStone(g,a,b+1,.9)],['Creature camp',kk.skull],['Cave',(g,a,b)=>{g.fillStyle='#10131c';g.strokeStyle=MPL.GOLD;g.lineWidth=.8;g.beginPath();g.moveTo(a-3,b+2);g.lineTo(a-3,b-1);g.quadraticCurveTo(a,b-4,a+3,b-1);g.lineTo(a+3,b+2);g.fill();g.stroke()}]]})}
mplInstall({name:'bluedunes',levels:[60],tint:[-14,-4,18],foot:'You are the yellow arrow.',draw(c,x,L,api){mpBlueDunesMap(x,L,api)}});
