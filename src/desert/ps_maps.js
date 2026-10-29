/* ==========================================================================
   THE PALE SPIRE: PARCHMENT MAPS (package 6). One area map per level in the style of the Blighted Road and the Vault maps (drawn from the real rows, rooms numbered from mapNames, key at the right;
   no hidden doors and no bosses show: doors are drawn as plain gaps, only link doors as small marks). World map hooks: the rooms belong to the Pale Spire, and its padlock goes once a level is built.
   ========================================================================== */
const PSMP={floor:{flag:'#d4cfdc',marble:'#e0dcea',runner:'#a890c8',wet:'#9c98ac',straw:'#c8b888',lawn:'#b6bea8',gravel:'#e2e0e4',cobble:'#a6a4b4',flagdark:'#aaa6b8',dirt:'#b8a888'},ink:'#241830'};
function pspMapDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,P=L._ps||{},fn=P.floorNames||[];
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.');
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a2430';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(wall(cx,cy)){const v=hash2(cx,cy,5)*10-5;x.fillStyle=`rgb(${96+v|0},${90+v|0},${118+v|0})`}
    else{const f=L.fmap&&L.fmap[cy]?+L.fmap[cy][cx]:0;x.fillStyle=PSMP.floor[fn[f]]||'#d4cfdc'}
    x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  x.strokeStyle=PSMP.ink;x.lineWidth=.6;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  // doors that lead somewhere: a small gold mark
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const ch=R[cy][cx];if(ch==='.')continue;const g=L.chars&&L.chars[ch],d=g!==undefined&&KH_DOOR[g];if(d&&d.psp){x.fillStyle='#d8b050';x.fillRect(X(cx)+s*.1,Y(cy)+s*.1,s*.8,s*.8)}}
  for(const d of L.decor){if(d.found||d.hidden)continue;const k=d.k||'';
    if(/^ps_col_/.test(k)){x.fillStyle='rgba(120,112,150,.9)';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(.6,s*.3),0,6.3);x.fill()}
    else if(/^ps_st_/.test(k)){x.fillStyle='rgba(150,146,170,.9)';x.fillRect(X(d.x+.25),Y(d.y+.25),s*.5,s*.5)}
    else if(/hedge|lbush|bl_hedge/.test(k)){x.fillStyle='rgba(110,130,104,.9)';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(.6,s*.36),0,6.3);x.fill()}}
  x.restore();
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,220,.94)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,LEVEL_NAMES[LEVEL]||L.name||'The Pale Spire','',12,5);api.compass(x,50,262,15);
  if(names.length){const a=392,b=40,w=92,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'Places',a+w/2,b+8,6.6,'#4a2a6a');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.2,INK,'left')})}
  {const a=6,b=46,w=84,h=22;api.panel(x,a,b,w,h);api.text(x,'The Pale Spire',a+w/2,b+8,5.6,'#4a2a6a');api.text(x,'Rating '+(LEVEL_RATING[LEVEL]||100),a+w/2,b+17,5.2,INK)}}
{const ids=[];for(let n=PSP.LO;n<=PSP.HI;n++)ids.push(n);mplInstall({name:'palespire',levels:ids,draw:pspMapDraw,tint:[3,2,6],foot:'You are the yellow arrow. The numbers on the map are listed on the right; gold squares are doors to other parts of the castle.'})}
if(typeof mpmgiKind==='function'){const _k=mpmgiKind;mpmgiKind=function(lv){return pspIs(lv)?(((pspLevel(lv)||{}).kind==='in')?'dungeon':'land'):_k.apply(this,arguments)}}
/* the world map: rooms of the Spire belong to it; its padlock goes when the first level is built */
if(typeof WMW_INTERIOR!=='undefined'&&!WMW_INTERIOR.some(r=>r[0]===9710))WMW_INTERIOR.unshift([9710,9998,'palespire','rooms of the Pale Spire']);
if(typeof WMB_PLACES!=='undefined'){const P=WMB_PLACES.find(p=>p.k==='palespire');if(P)Object.defineProperty(P,'ids',{enumerable:true,configurable:true,get(){return PSP.LEVELS.filter(l=>l.built).map(l=>l.id)}})}
