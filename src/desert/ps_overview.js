/* ps_overview.js: a small plan of the whole Pale Spire castle estate on the middle left of the 3D view, with the current local map highlighted
   and a dot for where the party stands in it. Only in the castle levels (PSP.LEVELS, built ones). The static plan is cached on an offscreen canvas;
   only the highlight, the dot and the caption are drawn each frame. The small +/- button collapses it (localStorage, never in the save). */
const PSOV={on:true,cache:null,key:'',U:3,PW:28,PH:35,tog:null,
 /* hand-set plan: id -> [x, y, w, h, short label, tier] in plan units (north is up). tier 1 = below ground (dashed, darker) */
 B:{
  9750:[0,0,5,7,'Kitchens',0],9740:[5,0,12,7,'Great Halls',0],9760:[17,0,5,7,'Cloister',0],
  9730:[3,8,16,9,'Court of Statues',0],9731:[0,12,3,4,'Lodge',0],9732:[19,12,3,4,'Mews',0],
  9715:[23,1,4,12,'Crooked Road',0],
  9723:[4,18,4,3,'Porter',0],9721:[8,18,6,3,'Gatehouse',0],9722:[14,18,4,3,'Winch',0],
  9720:[8,22,6,12,'Approach',0],
  9780:[16,23,8,4,'Gaols',1],9790:[19,28,9,3,'Deep Cells',1],9800:[16,32,6,3,'Oubliette',1]}};
try{PSOV.on=localStorage.getItem('abbeyPsOv')!=='0'}catch(e){}
function psovOpenList(){return Object.keys(PSOV.B).map(Number).filter(id=>{const l=pspLevel(id);return l&&l.built})}
function psovEdge(b,tx,ty){ /* where the line from the block centre to (tx,ty) leaves the block */
  const cx=b[0]+b[2]/2,cy=b[1]+b[3]/2,dx=tx-cx,dy=ty-cy;if(!dx&&!dy)return[cx,cy];
  const k=Math.min(dx?(b[2]/2)/Math.abs(dx):1e9,dy?(b[3]/2)/Math.abs(dy):1e9);return[cx+dx*k,cy+dy*k]}
function psovBuild(ids){
  const S=2,U=PSOV.U,PW=PSOV.PW*U,PH=PSOV.PH*U,cv=document.createElement('canvas');cv.width=Math.ceil(PW*S);cv.height=Math.ceil(PH*S);
  const c=cv.getContext('2d');c.scale(S,S);c.lineJoin='round';
  const set=new Set(ids),B=PSOV.B;
  for(const id of ids){const b=B[id],x=b[0]*U,y=b[1]*U,w=b[2]*U,h=b[3]*U,low=b[5];
    c.save();
    c.fillStyle=low?'rgba(40,34,50,.85)':(id===9720||id===9730||id===9715?'rgba(84,78,60,.78)':'rgba(120,108,84,.82)');
    c.fillRect(x,y,w,h);c.lineWidth=.8;c.strokeStyle=low?'rgba(170,160,196,.7)':'rgba(214,196,150,.85)';
    if(low)c.setLineDash([2,1.5]);c.strokeRect(x+.4,y+.4,w-.8,h-.8);c.restore()}
  /* door ticks where PSP.LINKS join two blocks */
  const seen={};
  for(const l of PSP.LINKS){const a=B[l.from],b=B[l.to];if(!a||!b||!set.has(l.from)||!set.has(l.to))continue;const k=Math.min(l.from,l.to)+'_'+Math.max(l.from,l.to);if(seen[k])continue;seen[k]=1;
    const ac=[a[0]+a[2]/2,a[1]+a[3]/2],bc=[b[0]+b[2]/2,b[1]+b[3]/2],pa=psovEdge(a,bc[0],bc[1]),pb=psovEdge(b,ac[0],ac[1]),low=a[5]||b[5];
    c.save();c.strokeStyle=low?'rgba(190,180,220,.8)':'#f0e0a8';c.lineWidth=1.1;
    if(Math.hypot(pa[0]-pb[0],pa[1]-pb[1])>1.2){c.setLineDash([1.4,1.2]);c.beginPath();c.moveTo(pa[0]*U,pa[1]*U);c.lineTo(pb[0]*U,pb[1]*U);c.stroke();c.setLineDash([])}
    const mx=(pa[0]+pb[0])/2*U,my=(pa[1]+pb[1])/2*U;c.fillStyle=low?'#c8bce8':'#ffe9a0';c.fillRect(mx-1.3,my-1.3,2.6,2.6);c.restore()}
  c.save();c.fillStyle='#d8ccaa';c.font='bold 3.6px '+FUI;c.textAlign='center';c.textBaseline='middle';
  if(set.has(9720)){const b=B[9720];c.fillText('v to Sale',(b[0]+b[2]/2)*U,(b[1]+b[3])*U+3)}
  if(set.has(9715)){const b=B[9715];c.fillText('^ to the',(b[0]+b[2]/2)*U,b[1]*U-5);c.fillText('Tower',(b[0]+b[2]/2)*U,b[1]*U-1.4)}
  if(set.has(9780)){const b=B[9780];c.fillStyle='#b4a8d8';c.fillText('BELOW',(b[0]+b[2]/2)*U,b[1]*U-3)}
  c.font='bold 3.9px '+FUI;c.textBaseline='middle';
  for(const id of ids){const b=B[id],cx=(b[0]+b[2]/2)*U,cy=(b[1]+b[3]/2)*U;
    c.fillStyle=b[5]?'#cfc6ea':'#f2e8c8';c.strokeStyle='rgba(0,0,0,.8)';c.lineWidth=1.4;
    const words=id===9715?['Crooked','Road']:id===9730?['Court of','Statues']:[b[4]];
    const wmax=b[2]*U-1.5,wid=Math.max(...words.map(s=>c.measureText(s).width)),fs=Math.max(2.7,3.9*Math.min(1,wmax/wid));c.font='bold '+fs+'px '+FUI;
    words.forEach((s,i)=>{const yy=cy+(i-(words.length-1)/2)*4.2;c.strokeText(s,cx,yy);c.fillText(s,cx,yy)});c.font='bold 3.9px '+FUI}
  c.restore();return cv}
function psovDraw(){
  const id=LEVEL;if(!PSOV.B[id]||G.state!=='play'||G.cut||G.talk||G.overview)return;
  const lv=pspLevel(id);if(!lv||!lv.built)return;
  const ids=psovOpenList(),key=ids.join(',')+'|'+PSP.LINKS.length;
  if(PSOV.key!==key||!PSOV.cache){PSOV.cache=psovBuild(ids);PSOV.key=key}
  const U=PSOV.U,PW=PSOV.PW*U,PH=PSOV.PH*U,pad=4,capH=11,w=PW+pad*2,h=PH+pad*2+capH+11,x0=3,y0=Math.round((210-h)/2)+1;
  if(!PSOV.on){ /* collapsed: a small tab */
    ctx.save();ctx.fillStyle='rgba(14,10,6,.82)';rrect(ctx,x0,97,36,16,2.5);ctx.fill();ctx.lineWidth=.8;ctx.strokeStyle='#a8863a';rrect(ctx,x0,97,36,16,2.5);ctx.stroke();ctx.restore();
    txt('Plan',x0+14,105,6,'#d8ccaa','center',true);txt('+',x0+29,105,8,'#f0e4b4','center',true);PSOV.tog=[x0,97,36,16];return}
  ctx.save();
  ctx.fillStyle='rgba(14,10,6,.80)';rrect(ctx,x0,y0,w,h,3);ctx.fill();
  ctx.lineWidth=.9;ctx.strokeStyle='#a8863a';rrect(ctx,x0,y0,w,h,3);ctx.stroke();
  ctx.lineWidth=.4;ctx.strokeStyle='rgba(216,204,170,.35)';rrect(ctx,x0+1.5,y0+1.5,w-3,h-3,2);ctx.stroke();
  const ox=x0+pad,oy=y0+pad+capH;
  ctx.drawImage(PSOV.cache,ox,oy,PW,PH);
  const b=PSOV.B[id],bx=ox+b[0]*U,by=oy+b[1]*U,bw=b[2]*U,bh=b[3]*U,pl=.5+.5*Math.sin(G.time*4);
  ctx.fillStyle='rgba(255,240,170,'+(.34+.1*pl)+')';ctx.fillRect(bx,by,bw,bh);
  ctx.lineWidth=1.3;ctx.strokeStyle='#fff3b8';ctx.strokeRect(bx+.5,by+.5,bw-1,bh-1);
  const px=bx+clamp((G.P.x+.5)/lv.W,0,1)*bw,py=by+clamp((G.P.y+.5)/lv.H,0,1)*bh,a=(G.P.f|0)*Math.PI/2;
  ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.fillStyle='#ff5a3c';ctx.strokeStyle='#1a0604';ctx.lineWidth=.9;
  ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(2.6,1.6);ctx.lineTo(0,.2);ctx.lineTo(-2.6,1.6);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
  ctx.beginPath();ctx.arc(px,py,1.1,0,TAU);ctx.fillStyle='#fff';ctx.fill();
  txt('CASTLE PLAN',x0+pad,y0+5,4.6,'#c9ba8e','left',true);
  const nm=lv.name.replace(/^The Ground Floor: /,'').replace(/^The /,'');
  txt(nm,x0+w/2,y0+h-6,4.3,'#f0e4b4','center',true,undefined,w-6);
  {const bs=8,tx=x0+w-bs-3,ty=y0+3;ctx.fillStyle='rgba(40,28,14,.95)';rrect(ctx,tx,ty,bs,bs,2);ctx.fill();ctx.lineWidth=.7;ctx.strokeStyle='#a8863a';rrect(ctx,tx,ty,bs,bs,2);ctx.stroke();
   txt('-',tx+bs/2,ty+bs/2+.3,7,'#f0e4b4','center',true);PSOV.tog=[tx-2,ty-2,bs+4,bs+4]}
  ctx.restore()}
/* drawn first in the 3D play view, so messages and plates draw over it */
{const _p=drawEnemyPlate;drawEnemyPlate=function(){try{PSOV.tog=null;if(pspIs(LEVEL))psovDraw()}catch(e){}return _p.apply(this,arguments)}}
{const _h=hudRight;hudRight=function(){const r=_h.apply(this,arguments);try{if(PSOV.tog)btn('psovtog',PSOV.tog[0],PSOV.tog[1],PSOV.tog[2],PSOV.tog[3])}catch(e){}return r}}
{const _hb=handleBtn;handleBtn=function(id){if(id==='psovtog'){PSOV.on=!PSOV.on;try{localStorage.setItem('abbeyPsOv',PSOV.on?'1':'0')}catch(e){}try{sfx('equip')}catch(e){}return}return _hb.apply(this,arguments)}}
