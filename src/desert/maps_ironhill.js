/* Area map for Ironhill (level 13, the walled mining town): a grey, smoky, industrial hill town drawn from the real level data.
   Names start with mpIronhill. Uses the shared tools in maps_common.js. The interiors (castle, forge, inn, store, church, mines) keep the standard map. */
const mpIronhillH=(a,b,s)=>hash2(a,b,s||11);
/* a wobbly closed blob */
function mpIronhillBlob(x,cx,cy,r,seed,ry){ry=ry||r;x.beginPath();const n=9;for(let k=0;k<n;k++){const an=k/n*6.2832,rr=.84+.3*mpIronhillH(k,seed,3);const px=cx+Math.cos(an)*r*rr,py=cy+Math.sin(an)*ry*rr;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a hand-drawn line: short jittered segments */
function mpIronhillLine(x,a,b,c,d,seed,j){j=j||.5;const n=Math.max(2,Math.round(Math.hypot(c-a,d-b)/4));x.beginPath();x.moveTo(a,b);for(let k=1;k<=n;k++){const t=k/n;x.lineTo(a+(c-a)*t+(mpIronhillH(k,seed,5)-.5)*j,b+(d-b)*t+(mpIronhillH(k,seed,6)-.5)*j)}x.stroke()}
/* a small hatch patch */
function mpIronhillHatch(x,a,b,w,h,seed,col,n,al){x.save();x.strokeStyle=col;x.globalAlpha=al||.5;x.lineWidth=.5;for(let k=0;k<n;k++){const px=a+mpIronhillH(k,seed,1)*w,py=b+mpIronhillH(k,seed,2)*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.6,py+2.2);x.stroke()}x.restore()}
/* smoke rising from a chimney at (a,b): drifting grey puffs, growing and fading */
function mpIronhillSmoke(x,a,b,seed,sz){sz=sz||1;x.save();for(let k=0;k<7;k++){const t=k/6,px=a+t*7*sz+(mpIronhillH(k,seed,1)-.5)*2,py=b-3-t*15*sz,r=(2+t*3.8)*sz;x.globalAlpha=.95-.5*t;x.fillStyle=k%2?'#4e4c4a':'#6a6764';x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.5;mpIronhillBlob(x,px,py,r,seed*7+k);x.fill();x.stroke()}x.restore()}
/* a small dark pine seen as a pen-and-ink icon */
function mpIronhillPine(x,a,b,s,seed){const dead=mpIronhillH(seed,1,9)<.22;x.strokeStyle=MPL.INK;x.lineWidth=.45;if(dead){x.beginPath();x.moveTo(a,b);x.lineTo(a,b-4.4*s);x.moveTo(a,b-2.6*s);x.lineTo(a-1.6*s,b-3.8*s);x.moveTo(a,b-3.2*s);x.lineTo(a+1.5*s,b-4.3*s);x.stroke();return}
  x.fillStyle=mpIronhillH(seed,2,9)<.5?'#3d5a46':'#4a5e44';for(let k=0;k<3;k++){x.beginPath();x.moveTo(a-(2.1-k*.4)*s,b-k*1.5*s);x.lineTo(a,b-(k*1.5+2.4)*s);x.lineTo(a+(2.1-k*.4)*s,b-k*1.5*s);x.closePath();x.fill();x.stroke()}}
/* a slag heap: a dark spoil mound with hatching and a few glowing embers */
function mpIronhillSlag(x,a,b,s,seed){x.save();x.fillStyle='#4a4440';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-9*s,b);x.quadraticCurveTo(a-6*s,b-3*s,a-3*s,b-7*s);x.quadraticCurveTo(a,b-11*s,a+3*s,b-8*s);x.quadraticCurveTo(a+7*s,b-4*s,a+9*s,b);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#1a1410';x.lineWidth=.5;for(let k=0;k<9;k++){const px=a-7*s+k*1.7*s,py=b-1.2*s;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.2*s,py-(3+mpIronhillH(k,seed,1)*4)*s*(1-Math.abs(px-a)/(10*s)));x.stroke()}
  x.fillStyle='#e8742a';for(let k=0;k<3;k++){x.globalAlpha=.85;x.beginPath();x.arc(a+(mpIronhillH(k,seed,2)-.5)*9*s,b-(1.5+mpIronhillH(k,seed,3)*3)*s,.7,0,6.3);x.fill()}x.restore()}
/* a round tower seen from above, with merlon dots */
function mpIronhillTower(x,a,b,r){x.save();x.fillStyle='#bdb7a8';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();x.fillStyle='#8a8478';x.beginPath();x.arc(a,b,r*.62,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.INK;for(let k=0;k<8;k++){const an=k*Math.PI/4;x.fillRect(a+Math.cos(an)*r*.85-.5,b+Math.sin(an)*r*.85-.5,1,1)}x.restore()}
/* a roof seen from above: flat colour, ridge, tile hatching, a soft shadow to the south east */
function mpIronhillRoof(x,a,b,w,h,col,seed,ridgeAlong){x.save();x.fillStyle='rgba(40,30,22,.32)';x.fillRect(a+1.6,b+1.8,w,h);x.fillStyle=col;x.fillRect(a,b,w,h);
  x.strokeStyle='rgba(30,22,16,.42)';x.lineWidth=.45;if(w>=h){for(let k=1;k<h/1.9;k++){x.beginPath();x.moveTo(a,b+k*1.9);x.lineTo(a+w,b+k*1.9);x.stroke()}}else{for(let k=1;k<w/1.9;k++){x.beginPath();x.moveTo(a+k*1.9,b);x.lineTo(a+k*1.9,b+h);x.stroke()}}
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();if(w>=h){x.moveTo(a,b+h/2);x.lineTo(a+w,b+h/2)}else{x.moveTo(a+w/2,b);x.lineTo(a+w/2,b+h)}x.stroke();x.lineWidth=1;x.strokeRect(a,b,w,h);x.restore()}

/* a ruby diamond: the mark of the way into the Ruby Maze */
function mpIronhillRuby(x,a,b,r){x.save();x.beginPath();x.moveTo(a,b-r*1.2);x.lineTo(a+r,b);x.lineTo(a,b+r*1.2);x.lineTo(a-r,b);x.closePath();x.fillStyle='#b01030';x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.7;x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.moveTo(a-r*.2,b-r*.7);x.lineTo(a+r*.15,b-r*.3);x.lineTo(a-r*.35,b-r*.05);x.closePath();x.fill();x.restore()}
mplInstall({name:'ironhill',levels:[13],tint:[-12,-9,-3],foot:'You are the yellow arrow. The walls of Ironhill.',
draw(c,x,L,api){
  const I=api.I,A=MPL.AREA,F=api.fit(L.rows[0].length,L.rows.length),S=F.s,X=F.X,Y=F.Y,H=mpIronhillH,W0=L.rows[0].length,H0=L.rows.length;
  const cell=(cx,cy)=>[X(cx+.5),Y(cy+.5)];
  /* ---- the ground: a grey wash over the framed area, clipped, with ash and soot patches ---- */
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.fillStyle='#b9b49a';x.fillRect(A.x,A.y,A.w,A.h);
  for(let i=0;i<150;i++){const px=A.x+H(i,1,21)*A.w,py=A.y+H(i,2,21)*A.h;x.globalAlpha=.16;x.fillStyle=['#7c7a62','#a9a186','#8b8a78','#6f6a58','#c9c0a0'][i%5];mpIronhillBlob(x,px,py,6+H(i,3,21)*14,i,3+H(i,4,21)*8);x.fill()}
  x.globalAlpha=1;
  /* ---- the hill: contour rings round the walled town with hachures on the steep sides ---- */
  const hx=X(24.5),hy=Y(17.5);
  for(let r=0;r<5;r++){const rx=(15+r*4.1)*S,ry=(11+r*3.2)*S;x.strokeStyle='rgba(88,66,40,'+(.5-r*.07)+')';x.lineWidth=.8;x.beginPath();for(let k=0;k<=56;k++){const an=k/56*6.2832,w=1+.06*Math.sin(an*3+r*1.7)+.04*Math.sin(an*7+r);const px=hx+Math.cos(an)*rx*w,py=hy+Math.sin(an)*ry*w;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.stroke();
    x.lineWidth=.55;for(let k=0;k<40;k++){const an=k/40*6.2832+H(k,r,31)*.1,w=1+.06*Math.sin(an*3+r*1.7)+.04*Math.sin(an*7+r);const px=hx+Math.cos(an)*rx*w,py=hy+Math.sin(an)*ry*w;if(Math.sin(an)>-.35){x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(an)*2.8,py+Math.sin(an)*2.4);x.stroke()}}}
  /* ---- roads: the real floor data, cobbles grey, dirt tracks ochre, drawn as joined blobs with an ink edge ---- */
  const fm=L.fmap,isRd=(cx,cy)=>fm&&fm[cy]&&fm[cy][cx]!=null&&String(fm[cy][cx])!=='1';
  for(let pass=0;pass<2;pass++){for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++){if(!isRd(cx,cy))continue;const d=String(fm[cy][cx])==='2',[px,py]=cell(cx,cy);
    if(pass===0){x.fillStyle='rgba(50,36,24,.55)';mpIronhillBlob(x,px,py,S*.86,cx*7+cy);x.fill()}
    else{x.fillStyle=d?'#c8aa78':'#aeaaa0';mpIronhillBlob(x,px,py,S*.7,cx*5+cy*3);x.fill()}}}
  for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++){if(!isRd(cx,cy))continue;const d=String(fm[cy][cx])==='2',[px,py]=cell(cx,cy);
    if(d)mpIronhillHatch(x,px-S/2,py-S/2,S,S,cx*13+cy,'#7a5a30',3,.5);
    else for(let k=0;k<3;k++){x.strokeStyle='rgba(60,56,50,.7)';x.lineWidth=.5;x.beginPath();x.arc(px+(H(cx,cy,k+40)-.5)*S*.9,py+(H(cx,cy,k+50)-.5)*S*.9,.9,.2,3.4);x.stroke()}}
  /* ---- trees, rocks and heather taken from the level's real objects, thinned out ---- */
  const trees=[],rocks=[];
  for(const d of L.decor||[]){if(/^(ptree|gtree|pjuniper)/.test(d.k)){if(H(d.x,d.y,61)<.4&&!(d.x>=10&&d.x<=39&&d.y>=8&&d.y<=28))trees.push(d)}else if(/^(grocks|gboulder)$/.test(d.k)){if(H(d.x,d.y,62)<.6)rocks.push(d)}else if(/^(pheather|pbracken|greeds)$/.test(d.k)&&H(d.x,d.y,63)<.1){mpIronhillHatch(x,X(d.x)-1,Y(d.y)-1,3,3,d.x*9+d.y,'#5a5a3a',2,.7)}}
  for(const d of rocks){const [px,py]=cell(d.x,d.y);x.fillStyle='#8d8a80';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.ellipse(px,py,1.9,1.3,0,0,6.3);x.fill();x.stroke()}
  trees.sort((a,b)=>a.y-b.y);for(const d of trees){const [px,py]=cell(d.x,d.y);mpIronhillPine(x,px,py+1,.8+H(d.x,d.y,64)*.35,d.x*50+d.y)}
  x.restore();x.save();x.strokeStyle=MPL.INK;x.lineWidth=1.3;x.strokeRect(A.x,A.y,A.w,A.h);x.lineWidth=.5;x.strokeRect(A.x+2,A.y+2,A.w-4,A.h-4);x.restore();
  /* grey crags in the empty strips above and below the town */
  for(let k=0;k<14;k++){const mx=A.x+10+k*20+H(k,1,111)*10;I.mountain(x,mx,A.y+19+H(k,2,111)*6,.8+H(k,3,111)*.5);I.mountain(x,mx+9,A.y+A.h-9-H(k,4,111)*6,.7+H(k,5,111)*.5)}
  /* ---- slag heaps and spoil outside the walls ---- */
  const slag=[[7.5,27.8,1],[46,27.5,.9],[9,32,.8],[41,31,1.1],[6,7,.8],[46,7.5,.9]];for(const [a,b,s] of slag)mpIronhillSlag(x,X(a),Y(b),s*1.35,a*3+b);
  /* ---- the town wall along the fence rectangle, with the gate gap at row 19, merlons and towers ---- */
  const wx0=X(11.5),wx1=X(38.5),wy0=Y(9.5),wy1=Y(27.5),gy0=Y(19),gy1=Y(20);
  const segs=[[wx0,wy0,wx1,wy0],[wx1,wy0,wx1,gy0],[wx1,gy1,wx1,wy1],[wx1,wy1,wx0,wy1],[wx0,wy1,wx0,gy1],[wx0,gy0,wx0,wy0]];
  x.save();x.lineCap='butt';for(const [w,col] of [[3.6,'#2a1a0c'],[2.4,'#b4ae9e']]){x.lineWidth=w;x.strokeStyle=col;for(const s of segs){x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(s[2],s[3]);x.stroke()}}
  x.lineWidth=3.6;x.strokeStyle='#2a1a0c';x.setLineDash([1.1,2.3]);x.globalAlpha=.8;for(const s of segs){x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(s[2],s[3]);x.stroke()}x.restore();
  x.strokeStyle='rgba(60,50,40,.6)';x.lineWidth=.5;for(let k=0;k<28;k++){const px=wx0+(wx1-wx0)*H(k,1,71),py=wy1+1.4;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.5,py+2);x.stroke()}
  for(const [a,b,r] of [[11.5,9.5,2.1],[38.5,9.5,2.1],[11.5,27.5,2.1],[38.5,27.5,2.1],[11.5,18.4,1.6],[11.5,20.6,1.6],[38.5,18.4,1.6],[38.5,20.6,1.6],[11.5,14,1.2],[38.5,14,1.2],[11.5,24,1.2],[38.5,24,1.2],[18,27.5,1.2],[32,27.5,1.2],[18,9.5,1.2],[32,9.5,1.2]])mpIronhillTower(x,X(a),Y(b),r*S*.5+.4);
  /* gate roads: gold-edged arches */
  x.fillStyle=MPL.GOLD;for(const gx of [X(11.5),X(38.5)]){x.fillRect(gx-1.2,gy0+.6,2.4,gy1-gy0-1.2);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(gx-1.2,gy0+.6,2.4,gy1-gy0-1.2)}
  /* ---- the buildings: found from the level's wall characters, one roof per connected block ---- */
  const seen={},comps=[];for(let y=1;y<H0-1;y++)for(let xx=1;xx<W0-1;xx++){if(L.rows[y][xx]==='.'||seen[xx+','+y])continue;const st=[[xx,y]],cs=[];seen[xx+','+y]=1;while(st.length){const [a,b]=st.pop();cs.push([a,b]);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy;if(nx<1||ny<1||nx>=W0-1||ny>=H0-1||L.rows[ny][nx]==='.'||seen[nx+','+ny])continue;seen[nx+','+ny]=1;st.push([nx,ny])}}
    const xs=cs.map(p=>p[0]),ys=cs.map(p=>p[1]);comps.push({x0:Math.min(...xs),y0:Math.min(...ys),x1:Math.max(...xs),y1:Math.max(...ys),n:cs.length})}
  const find=(cx,cy)=>comps.find(b=>cx>=b.x0&&cx<=b.x1&&cy>=b.y0&&cy<=b.y1);
  const smokers=[],labels=[];
  const roofs=['#78767a','#6f7480','#837a74','#706c68','#7c8084'];
  comps.sort((a,b)=>a.y1-b.y1);
  for(const b of comps){const bx=X(b.x0),by=Y(b.y0),bw=(b.x1-b.x0+1)*S,bh=(b.y1-b.y0+1)*S,castle=b.n>60;if(castle)continue;
    if(b.x0===24&&b.y0===21){ /* church and inn share one block: church 24..28, inn 29..33 */
      const cw=5*S;mpIronhillRoof(x,bx,by,cw,bh,'#7a8296',3);mpIronhillRoof(x,bx+cw,by,bw-cw,bh,'#8a6a52',4);
      x.fillStyle='#d8d0b8';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(bx+cw/2-1.6,by-3.4,3.2,3.6);x.strokeRect(bx+cw/2-1.6,by-3.4,3.2,3.6);I.cross(x,bx+cw/2,by-5.6,.8);
      smokers.push([bx+cw+bw*.2,by+1.2,4,1]);continue}
    const forge=(b.x0===12&&b.y0===21)||(b.x0===2&&b.y0===21)||(b.x0===40&&b.y0===21);
    const col=forge?'#7a5a4c':roofs[(b.x0*3+b.y0)%roofs.length];mpIronhillRoof(x,bx,by,bw,bh,col,b.x0+b.y0);
    if(forge){smokers.push([bx+bw*.72,by+bh*.28,b.x0+3,1.15]);x.fillStyle='#3a2e28';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(bx+bw*.72-1.4,by+bh*.28-1.4,2.8,2.8);x.strokeRect(bx+bw*.72-1.4,by+bh*.28-1.4,2.8,2.8)}
    else if(b.n>=12&&H(b.x0,b.y0,81)<.6){smokers.push([bx+bw*.7,by+bh*.3,b.x0+b.y0,.7]);x.fillStyle='#3a2e28';x.fillRect(bx+bw*.7-1,by+bh*.3-1,2,2)}}
  /* doors: the digit cells in the level are the door marks */
  for(let y=1;y<H0-1;y++)for(let xx=1;xx<W0-1;xx++){const ch=L.rows[y][xx];if(/[2-9]/.test(ch)||ch==='ś'||ch==='̃'){const [px,py]=cell(xx,y);x.fillStyle='#e8b830';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(px-1.4,py-1.4,2.8,2.8);x.strokeRect(px-1.4,py-1.4,2.8,2.8)}}
  /* the back door behind Dorn's store (set by ruby_maze.js), marked as a strange door: a ruby diamond on the wall of the lane */
  if(typeof RMZ!=='undefined')for(let y=1;y<H0-1;y++)for(let xx=1;xx<W0-1;xx++)if(L.rows[y][xx]===RMZ.TD){mpIronhillRuby(x,X(xx+.5),Y(y+1)-S*.15,2.2)}
  /* ---- the castle: a stone curtain wall with round corner towers, a keep, a gate and a vermilion banner ---- */
  {const cx0=X(18),cy0=Y(10),cw=14*S,ch=6*S;x.save();x.fillStyle='rgba(40,30,22,.35)';x.fillRect(cx0+2,cy0+2.4,cw,ch);x.fillStyle='#a9a392';x.fillRect(cx0,cy0,cw,ch);x.strokeStyle=MPL.INK;x.lineWidth=1.3;x.strokeRect(cx0,cy0,cw,ch);
    x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.5;for(let k=0;k<70;k++){const px=cx0+H(k,1,91)*cw,py=cy0+H(k,2,91)*ch;x.strokeRect(px,py,2.2,1.2)}
    x.fillStyle='#bdb7a6';x.fillRect(cx0+S*1.4,cy0+S*1.2,cw-S*2.8,ch-S*2.2);x.lineWidth=.8;x.strokeRect(cx0+S*1.4,cy0+S*1.2,cw-S*2.8,ch-S*2.2);
    /* courtyard flags and the keep */
    mpIronhillRoof(x,X(22),Y(10.9),5.6*S,3.6*S,'#4f5b78',7);x.fillStyle='#2a1a0c';x.fillRect(X(24.7)-.5,Y(11.6)-6,1,7);x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(X(24.7)+.5,Y(11.6)-6);x.lineTo(X(24.7)+6,Y(11.6)-4.2);x.lineTo(X(24.7)+.5,Y(11.6)-2.4);x.closePath();x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.stroke();
    x.restore();for(const [a,b] of [[18,10],[32,10],[18,16],[32,16]])mpIronhillTower(x,X(a),Y(b),S*1.15);
    x.fillStyle='#2a1a0c';x.fillRect(X(24)+.8,Y(15)+.4,S-1.6,S*.8);x.strokeStyle=MPL.GOLD;x.lineWidth=.6;for(let k=1;k<4;k++){x.beginPath();x.moveTo(X(24)+.8+k*(S-1.6)/4,Y(15)+.4);x.lineTo(X(24)+.8+k*(S-1.6)/4,Y(15)+S*1.2);x.stroke()}}
  /* ---- town square and street furniture from the level's objects ---- */
  for(const d of L.decor||[]){const [px,py]=cell(d.x,d.y);
    if(d.k==='fountain'){x.fillStyle='#6fa0c0';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(px,py,S*.7,0,6.3);x.fill();x.stroke();x.fillStyle='#e8f2f4';x.beginPath();x.arc(px,py,1,0,6.3);x.fill()}
    else if(d.k==='well'){x.fillStyle='#8a8478';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(px,py,S*.5,0,6.3);x.fill();x.stroke();x.fillStyle='#2a4a6a';x.beginPath();x.arc(px,py,S*.25,0,6.3);x.fill()}
    else if(d.k==='statue'){I.star(x,px,py,.6,'#d8d0b8')}
    else if(d.k==='memorial'){I.cross(x,px,py,.55)}
    else if(d.k==='cart'){x.fillStyle='#7a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(px-2,py-1.2,4,2.4);x.strokeRect(px-2,py-1.2,4,2.4);x.beginPath();x.arc(px-1.4,py+1.4,.8,0,6.3);x.arc(px+1.4,py+1.4,.8,0,6.3);x.stroke()}
    else if(d.k==='lamp'){x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(px,py,.8,0,6.3);x.fill()}
    else if(d.k==='chest'||d.k==='bones'){}
    else if(/^(barrel|crate)$/.test(d.k)){x.fillStyle='#8a6a3c';x.fillRect(px-.9,py-.9,1.8,1.8)}}
  /* a few garden fences are skipped; the cobbled street is the main square line */
  /* ---- smoke over the forges and a soot haze over the roofs ---- */
  for(const s of smokers)mpIronhillSmoke(x,s[0],s[1],s[2],s[3]);
  x.save();x.globalAlpha=.06;x.fillStyle='#3a3836';for(let k=0;k<9;k++){mpIronhillBlob(x,X(9+H(k,1,95)*32),Y(5+H(k,2,95)*20),14+H(k,3,95)*18,k,6+H(k,4,95)*6);x.fill()}x.restore();
  /* crows over the smoke */
  x.strokeStyle=MPL.INK;x.lineWidth=.8;for(const [a,b] of [[X(14),Y(6)],[X(17),Y(4.6)],[X(31),Y(5)],[X(34.6),Y(6.6)],[X(25),Y(3)]]){x.beginPath();x.moveTo(a-3,b);x.quadraticCurveTo(a-1.4,b-2.2,a,b);x.quadraticCurveTo(a+1.4,b-2.2,a+3,b);x.stroke()}
  /* ---- names, placed from the level's buildings and gates ---- */
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6,col||'#2a1a0c');
  T('IRONHILL CASTLE',25,13.4,6.4,'#1a1208');T('Town Square',26,17.9,5.6);T('West Gate',8,20.5,5);T('East Gate',41.5,20.5,5);
  T('Brannoch\'s Forge',14,25.4,5.4);T('Dorn\'s Store',20,26.95,5.4);T('Church',26.5,25.4,5.4);T('The Anvil and Ale',31,26.8,5.4);
  T('Steelhold Blades',4,25.5,5.4);T('Plate and Mail',42,25.5,5.4);T('Corvin\'s Arcana',3.5,8.8,5.4);T('The Cauldron',41.5,8.8,5.4);
  T('Burial Ground',13.5,8.1,5.2);T('Mine Entrance',35.5,8.1,5.2);T('Ironhill Moor',45,17.4,5,'#4a2a10');T('The Tunnel',5,17.4,5,'#4a2a10');
  T('A strange door',20.5,25.75,4.8,'#8a1c10');T('slag heap',8,29.2,4.6,'#4a2a10');T('slag heap',41.5,29.4,4.6,'#4a2a10');
  /* ---- margins: title, notes, key, compass ---- */
  api.title(x,'Ironhill','A walled mining town on a hill');
  api.notes(x,['Ironhill stands on a hill. Its stone wall has gates to the west and the east.','The castle is at the top of the town. The mayor holds court there.','Smoke rises from the forges all day long.','The old mines lie north-east, behind the wall.'],8,58,78,6.4,5);
  api.panel(x,392,38,84,112);api.text(x,'KEY',434,47,7,MPL.VERM);
  const kx=402,ky=[58,70,82,94,106,118,130,142];
  x.save();x.fillStyle='#bdb7a6';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(kx-5,ky[0]-3,10,6);x.strokeRect(kx-5,ky[0]-3,10,6);x.restore();api.text(x,'Castle',kx+9,ky[0],5.6,'#2a1a0c','left');
  x.save();x.lineWidth=3;x.strokeStyle='#2a1a0c';x.beginPath();x.moveTo(kx-5,ky[1]);x.lineTo(kx+5,ky[1]);x.stroke();x.lineWidth=1.8;x.strokeStyle='#b4ae9e';x.stroke();x.restore();api.text(x,'Town wall',kx+9,ky[1],5.6,'#2a1a0c','left');
  x.save();mpIronhillRoof(x,kx-5,ky[2]-3,10,6,'#7a5a4c',2);x.restore();api.text(x,'Forge, smithy',kx+9,ky[2],5.6,'#2a1a0c','left');
  x.save();mpIronhillRoof(x,kx-5,ky[3]-3,10,6,'#78767a',3);x.restore();api.text(x,'House, shop',kx+9,ky[3],5.6,'#2a1a0c','left');
  x.save();x.fillStyle='#aeaaa0';x.fillRect(kx-5,ky[4]-2.5,10,5);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(kx-5,ky[4]-2.5,10,5);x.restore();api.text(x,'Cobbled street',kx+9,ky[4],5.6,'#2a1a0c','left');
  mpIronhillSlag(x,kx,ky[5]+3,.5,5);api.text(x,'Slag heap',kx+9,ky[5],5.6,'#2a1a0c','left');
  x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(kx-1.6,ky[6]-1.6,3.2,3.2);x.strokeRect(kx-1.6,ky[6]-1.6,3.2,3.2);x.restore();api.text(x,'Door',kx+9,ky[6],5.6,'#2a1a0c','left');
  mpIronhillRuby(x,kx,ky[7],2.2);api.text(x,'A strange door',kx+9,ky[7],5.6,'#2a1a0c','left');
  api.compass(x,436,184,13);
  api.notes(x,['Blue is the fountain in the square. Grey clouds are smoke.'],398,212,74,6,4);
}});
