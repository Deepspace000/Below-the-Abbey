/* ==========================================================================
   THE GRAVEYARD, THE CRYPT AND THE FOUR MAZES: parchment area maps (levels 530 to 535), the Go to area rows, the test links. Names start with gym / GYMP.
   One drawing for all six sheets, made from the real level rows, fmap and decor: walls inked in the mean colour of their painted tile, floors in the colour of their ground, the stones as small marks,
   the large pieces as the game's own little pictures, the places numbered and listed in the right margin. Quest marks come from mpplDraw (maps_questmarks.js) like everywhere else.
   Test links: ?town=graveyard&lvl=84 (the graveyard at the lych-gate; &k=1..4 a maze, &crypt=1 the crypt, &relics=1 the four relics in the bag, &q=1..5 the quests done up to that one, gear as for every jump link).
   ========================================================================== */
const GYMP={ground:{'0':'#a9b894','1':'#b9a07c','2':'#d2cab8','3':'#bdb8ae','4':'#e8e2cc','5':'#8c919c'},ink:'#241812'};
function gyMapDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,yard=LEVEL===GY.ID;
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.'),col=(cx,cy)=>{const g=L.chars[R[cy][cx]],q=GY.col&&GY.col[g];return q||[110,108,104]};
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a2418';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(wall(cx,cy)){const k=col(cx,cy),v=hash2(cx,cy,5)*12-6;x.fillStyle=`rgb(${Math.max(0,Math.min(255,k[0]*.8+v))|0},${Math.max(0,Math.min(255,k[1]*.8+v))|0},${Math.max(0,Math.min(255,k[2]*.8+v))|0})`}
    else{const f=L.fmap[cy][cx];x.fillStyle=((L._gy&&L._gy.ground)||GYMP.ground)[f]||'#cfc8b6'}
    x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  // the edge of every wall in ink
  x.strokeStyle=GYMP.ink;x.lineWidth=yard?.5:.7;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  // the pieces
  const D=(typeof G!=='undefined'&&gyIs(LEVEL)&&G.decor&&G.decor.length?G.decor:L.decor).slice().sort((a,b)=>a.y-b.y);
  const BIG=/^gy_(crypt|chapel|hut|igate2|stair|arch|hatch2|mausoleum|angel|yew|dead|altar|sarc|coffin|candles|niche|lych|edmund|obelisk|column|ccross|tomb|urn|chest|lever|mound|barrow)$/;
  for(const d of D){if(d.found||d.hidden)continue;const k=d.k||'';
    if(BIG.test(k)&&IMG[k]){const im=IMG[k],big=/crypt|chapel|mausoleum|hut|igate2|stair|arch|hatch2|lych/.test(k),hh=Math.max(2.4,Math.min(big?14:8,(NPC_H[k]||1)*s*(d.sc||1)*(big?1.5:1.3))),ww=hh*im.width/im.height;x.drawImage(im,X(d.x+.5)-ww/2,Y(d.y+1)-hh+s*.3,ww,hh)}
    else if(yard&&/^gy_(stone1|stone2|lean|slab|wcross|rpost)$/.test(k)){x.fillStyle='#7a766c';x.strokeStyle=GYMP.ink;x.lineWidth=.25;x.fillRect(X(d.x+.2),Y(d.y+.1),s*.6,s*.8);x.strokeRect(X(d.x+.2),Y(d.y+.1),s*.6,s*.8)}
    else if(/^gy_lantern$/.test(k)){x.fillStyle='#e8c050';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),s*.4,0,6.3);x.fill()}}
  for(const l of (L.lights||[])){if(yard){x.fillStyle='rgba(255,210,90,.85)';x.beginPath();x.arc(X(l[0]+.5),Y(l[1]+.5),Math.max(.7,s*.28),0,6.3);x.fill()}}
  // the wall torches of a maze, in the colour of its flame
  if(L._gy&&L._gy.torches&&L._gy.torch){x.fillStyle=L._gy.torch.css;x.strokeStyle=GYMP.ink;x.lineWidth=.3;for(const t of L._gy.torches){const dx=GYM_D[t[2]][0],dy=GYM_D[t[2]][1];x.beginPath();x.arc(X(t[0]+.5+dx*.6),Y(t[1]+.5+dy*.6),Math.max(1,s*.34),0,6.3);x.fill();x.stroke()}}
  x.restore();
  // numbered places and the list of them
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,200,.92)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,GY.NAMES[LEVEL]||'The Graveyard','',12,5);   // the name only, no caption
  api.compass(x,50,262,15);
  {const a=392,b=40,w=82,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'Places',a+w/2,b+8,6.6,'#6a1a0e');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.2,INK,'left')})}
  {const a=6,b=46,w=84,h=yard?72:(L._gy&&L._gy.torch?72:58);api.panel(x,a,b,w,h);api.text(x,'Key',a+w/2,b+8,6.6,'#6a1a0e');
    const rows=yard?[['Grass',GYMP.ground['0']],['Gravel',GYMP.ground['2']],['Flags',GYMP.ground['3']],['Bare earth',GYMP.ground['1']]]:[['Floor',((L._gy&&L._gy.ground)||GYMP.ground)[(L.fmap[1]||'0')[1]]||'#cfc8b6'],['Wall',(()=>{const k=col(0,0);return `rgb(${k[0]*.8|0},${k[1]*.8|0},${k[2]*.8|0})`})()]];
    if(L._gy&&L._gy.torch)rows.push([L._gy.torch.name.replace(/^./,m=>m.toUpperCase())+' torch',L._gy.torch.css]);
    rows.forEach(([t,cc],i)=>{x.fillStyle=cc;x.strokeStyle=INK;x.lineWidth=.5;if(/ torch$/.test(t)){x.beginPath();x.arc(a+11,b+19+i*13,3,0,6.3);x.fill();x.stroke()}else{x.fillRect(a+6,b+16+i*13,10,6);x.strokeRect(a+6,b+16+i*13,10,6)}api.text(x,t,a+22,b+19+i*13,6,INK,'left')})}
}
mplInstall({name:'graveyard',levels:[530,531,532,533,534,535,536,537,538,539,540,541,542],draw:gyMapDraw,tint:[2,6,0],foot:'You are the yellow arrow. The numbers on the map are listed on the right.'});
/* the Go to area list */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(GY_ENABLED&&!out.some(r=>r.n===GY.ID)){out.push({h:'The Wenlock Graveyard, west of Wenlock'});for(const n of [GY.ID,GY.CRYPT].concat(GY.M))out.push({n,name:GY.NAMES[n]})}}catch(e){console.error(e)}
  return out}}
/* the party that goes to the graveyard from the list is a level 84 party (the mazes 85 to 87 need more, and the list's own + button goes on up to 87) */
{const _jt=jumpToLevel;jumpToLevel=function(n,target){if(gyIs(n)&&target<84)target=Math.max(target,84);return _jt.call(this,n,target)}}
/* ?town=graveyard&lvl=84 */
{const _j=jumpFromUrl;jumpFromUrl=function(){
  const q=new URLSearchParams(location.search),town=(q.get('town')||'').toLowerCase().replace(/[^a-z]/g,'');
  if(!GY_ENABLED||(town!=='graveyard'&&town!=='wenlockgraveyard'&&town!=='crypt'))return _j.apply(this,arguments);
  const orig=location.pathname+location.search+location.hash,target=Math.max(1,Math.min(87,parseInt(q.get('lvl')||'84',10)||84));
  q.set('town','ironhill');q.set('lvl','40');
  try{history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}catch(e){}
  try{_j.apply(this,arguments)}finally{try{history.replaceState(null,'',orig)}catch(e){}}
  G.heroes.forEach((h,i)=>{while(h.lvl<target){h.xp=xpNeed(h.lvl);levelUp(i)}h.alive=true;h.hp=h.max;h.mp=h.mpMax;h.food=Math.max(h.food||0,100)});
  if(q.get('gear')!=='0')try{giveJumpGear(target)}catch(e){console.error(e)}
  const F=G.flags,Q=parseInt(q.get('q')||'0',10)||0,gf=gyF();
  if(q.get('relics')||Q>=1){for(const id of ['gyring','gyname','gylocket','gybook'].slice(0,q.get('relics')?4:Math.min(4,Q)))if(!bagCount(id))bagAdd(mkItem(id))}
  for(let i=1;i<=Math.min(4,Q);i++){gf.dead[i-1]=1;G.quests['gyq'+i]={st:'done',base:0}}
  if(Q>=4){gf.met=1;if(!G.quests.gyq5)qAccept('gyq5')}
  if(q.get('keys')){for(const id of ['gykey','gyseal'])bagAdd(mkItem(id))}
  const k=parseInt(q.get('k')||'0',10)||0;let id=GY.ID,at=WK.GRAVESTART;
  if(town==='crypt'||q.get('crypt')){id=GY.CRYPT;at=GY_C.start}
  else if(k>=1&&k<=4){id=GY.M[k-1];KH_LAZY[id]&&!LEVELS[id]&&(gyAlias(),KH_LAZY[id]());at=LEVELS[id].start}
  G.state='play';G.menu=false;
  const go=()=>{goToLevel(id,{x:at.x,y:at.y,f:at.f});G.state='play';G.menu=false;msg('Your party stands at '+GY.NAMES[id]+', at level '+target+'.','#ffe36a')};
  if(GY.ready)go();else gyLoad().then(go)}}
/* Wenlock: the lane joins the town's map, and the first arrival after the ending rings the bell */
{const _a=gyTownArrive;gyTownArrive=function(){try{const L=LEVELS[WL.ID];if(L&&L.mapNames&&!L.mapNames.some(n=>n.t==='Churchyard Lane')){L.mapNames.push({t:'Churchyard Lane',x:12,y:29,k:'lane'});if(typeof MPL!=='undefined')MPL.CACHE={}}}catch(e){}return _a.apply(this,arguments)}}
