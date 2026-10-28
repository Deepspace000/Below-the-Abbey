/* ==========================================================================
   STALL SHOPS (prefix stl / STL). In a town a market stall is mostly scenery, so pressing on one used to do nothing. Now pressing a stall (a click on its picture,
   the hover tip over it, or the use key and the pad button while facing it) goes straight to the SHOP PAGE of the nearest shopkeeper, the person who stands at or
   behind it (within six steps on foot, the one directly behind it first), the same page that the Trade button of that person opens. A stall with nobody to mind it
   says a short line about itself. Anything that already does something keeps it: people, chests, doors, and stalls that are shops of their own.
   A person is a shopkeeper when the first page of their talk has a trade button that opens a shop. That is tried quietly (the shop window is held back and
   nothing is spent), and the answer is kept for the level. The painted stalls behind the keepers of the Deeper Hollow (hgd_stalls.js) are pictures with no decor
   of their own, so they get a click area that leads to their keeper's shop. tools/stall_shop/BINDINGS.md lists every binding. Loads late, just before jump_ready.js.
   ========================================================================== */
const STL={cap:null,src:null,probe:new Map(),list:null,listN:-1,hgSrc:null,hg:null,hgKeep:null,hv:{d:null,t0:0,txt:null,at:0},
  towns:new Set([3,13,32,33,44,290,304,305,311,364,430,470,475,481,482,483,484,490,496,520]),reach:6,
  flav:{
    stall:['The stall is empty. Nobody is minding it.','Nobody is minding this stall. The boards are bare and a little dusty.','The stall is shut for now. A folded cloth and an empty crate are all that is left.'],
    tent:['The tent flap is tied shut. Nobody is inside.','Nobody is home. The tent smells of damp canvas and old rope.'],
    cart:['The cart is empty. Whoever owns it has wandered off.','Nothing on the cart but loose straw and a bent nail.'],
    counter:['The counter is bare. Nobody is serving.','Nobody is behind the counter.'],
    barrow:['The barrow is empty. Nobody is selling anything from it.'],
    wagon:['The wagon is empty. Nobody is selling anything from it.']}};
const STL_STRONG=/stall|market|booth|awning|kiosk|canopy|pavilion/i,STL_WEAK=/(^|_)(cart|tent|barrow|wagon|counter)/i,STL_NOT=/cross|fountain|pump|statue|sign|bench|well|banner|stallion/i;
const STL_OPT=/^(trade|browse|buy|shop)\b|\b(wares|goods|for sale)\b/i,STL_OPT_NO=/\b(room|bed|sleep|rest|stay|lodg)/i;
/* the shop window is held back while a shopkeeper is being tried out */
{const _os=openShop;openShop=function(d,stock,name){if(STL.cap){STL.cap.push([d,stock,name]);return}return _os.apply(this,arguments)}}
/* what kind of stall a piece of decor is ('' if none). A stall by name counts anywhere; a cart, tent, barrow, wagon or counter counts in a town, or anywhere a person stands close by */
function stlKind(d){
  if(d._stlK!==undefined)return d._stlK;
  let r='';const k=String(d.k||'');
  if(k&&!STL_NOT.test(k)){
    if(STL_STRONG.test(k))r=/tent|canopy|pavilion/i.test(k)?'tent':'stall';
    else{const m=STL_WEAK.exec(k);
      if(m){r=m[2].toLowerCase();
        if(!STL.towns.has(LEVEL)&&!(G.decor||[]).some(o=>o.npc&&NPCS[o.npc]&&Math.abs(o.x-d.x)<=3&&Math.abs(o.y-d.y)<=3))r=''}}}
  d._stlK=r;return r}
/* a stall that does nothing of its own: not a person, chest, shop, door or lever */
function stlIsStall(d){
  if(!d||d.npc||d.loot||d.shop||d.contents||d.enter||d.door||d.exitDoor||d.found||d.k==='lever'||d.pfCut||(d.sc!==undefined&&d.sc<.05))return false;
  return !!(d._stlPseudo||stlKind(d))}
function stlStalls(){
  if(STL.list&&STL.src===G.decor&&STL.listN===G.decor.length)return STL.list;
  STL.src=G.decor;STL.listN=G.decor.length;STL.probe.clear();STL.list=G.decor.filter(stlIsStall);return STL.list}
/* the people within `max` steps on foot of a stall, nearest first (walking over open floor; solid things do not stop the count, a wall or a door does) */
function stlNear(d,max,side){
  const W=MW,sx=d.x|0,sy=d.y|0,by=new Map();
  for(const o of G.decor){if(!o.npc||o.found||!NPCS[o.npc]||(o.sc!==undefined&&o.sc<.05))continue;const c=Math.round(o.y)*W+Math.round(o.x),l=by.get(c);if(l)l.push(o);else by.set(c,[o])}
  const seen=new Set([sy*W+sx]),out=[];let cur=[[sx,sy]];
  for(let step=0;step<=max&&cur.length;step++){
    const nxt=[];
    for(const [x,y] of cur){
      const l=by.get(y*W+x);if(l)for(const o of l)out.push({o,dist:step});
      if(step===max)continue;
      for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=MH)continue;const c=ny*W+nx;if(seen.has(c)||G.grid[ny][nx]!==0)continue;seen.add(c);nxt.push([nx,ny])}}
    cur=nxt}
  // ties: the one standing behind the stall (on the far side from the party) first, then beside it
  const vx=side?Math.sign(sx-G.P.x):0,vy=side?Math.sign(sy-G.P.y):0;
  for(const c of out){const dx=Math.round(c.o.x)-sx,dy=Math.round(c.o.y)-sy;c.beh=dx*vx+dy*vy;c.e=dx*dx+dy*dy}
  return out.sort((a,b)=>a.dist-b.dist||b.beh-a.beh||a.e-b.e)}
/* the trade button of a first page of talk, or -1 */
function stlPick(node){return node&&node.opts?node.opts.findIndex(o=>o&&typeof o[0]==='string'&&typeof o[1]==='function'&&STL_OPT.test(o[0])&&!STL_OPT_NO.test(o[0])):-1}
/* try a person out on the quiet: does the trade button open a shop, and what is it called? ({title}, or null) */
function stlTry(o){
  const n=NPCS[o.npc];if(!n||typeof n.root!=='function')return null;
  const prevTalk=G.talk,prevCap=STL.cap,g0=G.gold,cap=[];let res=null;
  STL.cap=cap;
  try{
    const node=n.root(o);
    if(cap.length)res={title:cap[0][2]||''};
    else{const i=stlPick(node);
      if(i>=0){G.talk={d:o,n,node,t:G.time,btns:[]};const r=node.opts[i][1]();if(cap.length&&!r)res={title:cap[0][2]||node.opts[i][0]}}}
  }catch(e){console.warn('stl try',e)}
  finally{STL.cap=prevCap;G.talk=prevTalk;if(G.gold!==g0){G.gold=g0;res=null}}
  return res}
function stlShopOf(o){
  if(STL.src!==G.decor){STL.src=G.decor;STL.probe.clear();STL.list=null}
  const c=STL.probe.get(o.npc);if(c&&(c.r||G.time-c.t<30))return c.r;
  const r=stlTry(o);STL.probe.set(o.npc,{r,t:G.time});return r}
/* open the shop page of a person, exactly as their Trade button does (their talk is not shown first) */
function stlOpen(o){
  const n=NPCS[o.npc];if(!n||typeof n.root!=='function')return false;
  const node=n.root(o);if(G.loot)return true; // a person who opens the shop at once
  const i=stlPick(node);if(i<0)return false;
  const T={d:o,n,node,t:G.time,btns:[]};G.talk=T;G.hold=null;G.queued=null;
  const r=node.opts[i][1]();
  if(G.talk===T){if(r){T.node=r;T.t=G.time}else G.talk=null}
  return true}
/* the shopkeeper a stall leads to: {o, title, dist} or null */
function stlBind(d,side){
  if(d._stlNpc){const s=stlShopOf(d._stlNpc);if(s)return {o:d._stlNpc,title:s.title,dist:0}}
  for(const c of stlNear(d,STL.reach,side)){const s=stlShopOf(c.o);if(s)return {o:c.o,title:s.title,dist:c.dist}}
  return null}
function stlLine(d){const a=STL.flav[stlKind(d)]||STL.flav.stall;return a[Math.floor(hash2(d.x|0,d.y|0,23)*a.length)%a.length]}
function stlBusy(){return G.state!=='play'||G.talk||G.loot||G.cut||G.menu||G.map||(G.inv&&G.inv.open)}
/* press on a stall: the shop page of the keeper, or a line about the stall */
function stlPress(d){
  if(stlBusy())return false;
  let b=null;try{b=stlBind(d,true)}catch(e){console.warn('stl bind',e)}
  if(b){const t=(b.title||'').replace(/^The /,'the ');msg(t?'You step over to '+t+'.':'You step over to the stall.','#e8dcc0');
    if(stlOpen(b.o))return true}
  msg(stlLine(d),'#d8c8a0');return true}
/* the stall the party is facing, one or two steps ahead (or underfoot) */
function stlAhead(){
  const f=DIRS[G.P.f],L=stlStalls();
  for(const k of [1,2,0]){
    const x=G.P.x+f[0]*k,y=G.P.y+f[1]*k,d=L.find(q=>q.x===x&&q.y===y&&stlIsStall(q));
    if(d)return d;
    if(k>0&&cellBlocked(x,y))return null}
  return null}
/* the use key and the pad button are the attack button: with nothing to hit and nobody to talk to, a stall in front is used */
{const _ha=heroAttack;heroAttack=function(i){
  try{
    if(!stlBusy()&&!(typeof hostileNear==='function'&&hostileNear())){
      const h=G.heroes[i],w=h&&heroWeapon(h),range=(w&&w.ranged)||1;
      if(!frontEnemy(range)){
        const d0=DIRS[G.P.f],s=stlAhead();let person=false;
        // a person nearer than the stall (or underfoot) is talked to as before; a keeper standing behind the stall does not take the press away from it
        const ks=s?(s.x===G.P.x&&s.y===G.P.y?0:Math.abs(s.x-G.P.x)+Math.abs(s.y-G.P.y)):9;
        for(const k of [1,0,2]){if(s&&k>=ks&&ks>0)continue;const x=G.P.x+d0[0]*k,y=G.P.y+d0[1]*k;if(G.decor.some(d=>d.npc&&d.walk&&!d.found&&d.x===x&&d.y===y)){person=true;break}}
        if(!person&&s){stlPress(s);return false}}}
  }catch(e){console.error('stl use',e)}
  return _ha.apply(this,arguments)}}
/* a click on a stall: the sprite hits that the renderer gathers (see the line after the item hits in the sprite loop) */
function stlHitRef(s){const d=s.decor;if(d)return stlIsStall(d)?d:null;return s.stlRef||null}
function stlHitAt(x,y){
  for(const h of G.hits.slice().sort((a,b)=>a.ty-b.ty)){
    if(h.type!=='decor'&&h.type!=='item')continue;
    if(x<h.x0||x>h.x1||y<h.y0||y>h.y1)continue;
    return h.stl?h:null}
  return null}
{const _vt=viewTap;viewTap=function(x,y){
  try{if(!stlBusy()){const h=stlHitAt(x,y);if(h){if(h.ty>(h.ref._stlPseudo?3.6:2.6)){msg('Too far away. Step closer.','#d09a80');return}stlPress(h.ref);return}}}catch(e){console.error('stl tap',e)}
  return _vt.apply(this,arguments)}}
/* the painted stalls behind the keepers of the Deeper Hollow: no decor of their own, so each picture is given its keeper's click area */
{const _sl=spriteList;spriteList=function(){
  const L=_sl.apply(this,arguments);
  try{if(G.state==='play'&&G.decor&&typeof hgdstKind==='function'){
    const ims=new Map();for(const k of ['general','arms','armour','magic','trader']){const im=IMG['art_hgstall_'+k];if(im)ims.set(im,k)}
    if(ims.size){
      if(STL.hgSrc!==G.decor){STL.hgSrc=G.decor;STL.hg=new Map();STL.hgKeep=G.decor.filter(d=>d.npc&&hgdstKind(d.npc)&&hgdstKind(d.npc)!=='church'&&hgdstKind(d.npc)!=='inn').map(d=>({d,k:hgdstKind(d.npc)}))}
      for(const s of L){
        if(s.decor||!s.img)continue;const k=ims.get(s.img);if(!k)continue;
        let best=null,bd=1.6;for(const q of STL.hgKeep){if(q.k!==k)continue;const dx=q.d.x+.5-s.x,dy=q.d.y+.5-s.y,e=dx*dx+dy*dy;if(e<bd){bd=e;best=q}}
        if(!best)continue;
        let p=STL.hg.get(best.d);if(!p){p={k:'hgstall_'+k,x:best.d.x,y:best.d.y,_stlPseudo:1,_stlK:'stall',_stlNpc:best.d};STL.hg.set(best.d,p)}
        s.stlRef=p}}}}catch(e){console.error('stl hg',e)}
  return L}}
/* a small tip when the mouse rests on a stall (the same look as the button tips of hovertips.js) */
function stlTip(){
  const S=typeof STB!=='undefined'?STB:null,hv=STL.hv;
  if(!S||S.pt!=='mouse'||S.mx<0||S.mx>=420||S.my>=210||stlBusy()||(typeof TP!=='undefined'&&TP)||topBtn(S.mx,S.my)){hv.d=null;return}
  const h=stlHitAt(S.mx,S.my);if(!h||h.ty>(h.ref._stlPseudo?3.6:2.6)){hv.d=null;return}
  const now=performance.now();if(hv.d!==h.ref){hv.d=h.ref;hv.t0=now;hv.txt=null;return}
  if(now-hv.t0<380)return;
  if(hv.txt===null||now-hv.at>2500){let b=null;try{b=stlBind(h.ref,true)}catch(e){}hv.txt=b?'Trade at '+(b.title||'the stall'):'Market stall';hv.at=now}
  const tip=[hv.txt,'Click'];
  ctx.save();ctx.setTransform(ctx.canvas.width/DW,0,0,ctx.canvas.height/DH,0,0);
  ctx.font='8px '+FUI;const lw=ctx.measureText(tip[0]).width;ctx.font='bold 7.5px '+FUI;const kw=ctx.measureText(tip[1]).width+8;
  const w=lw+kw+18,ht=16;let x=S.mx+10,y=S.my+14;if(x+w>DW-4)x=DW-4-w;if(y+ht>DH-4)y=S.my-ht-8;if(x<4)x=4;
  ctx.globalAlpha=.97;rrect(ctx,x,y,w,ht,4);ctx.fillStyle='rgba(14,10,6,.94)';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#8a7448';ctx.stroke();
  ctx.font='8px '+FUI;ctx.fillStyle='#e8dcb4';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(tip[0],x+6,y+ht/2+.5);
  const kx=x+10+lw;rrect(ctx,kx,y+3,kw,ht-6,3);ctx.fillStyle='rgba(70,52,24,.98)';ctx.fill();ctx.lineWidth=.8;ctx.strokeStyle='#c8a860';ctx.stroke();
  ctx.font='bold 7.5px '+FUI;ctx.fillStyle='#ffe9a0';ctx.textAlign='center';ctx.fillText(tip[1],kx+kw/2,y+ht/2+.5);
  ctx.restore()}
{const _cp=crtPass;crtPass=function(){_cp.apply(this,arguments);try{stlTip()}catch(e){}}}
/* for the report (tools/stall_shop/BINDINGS.md): every stall of this level and the shop it leads to */
function stlTable(){
  const rows=[];
  for(const d of stlStalls()){const b=stlBind(d,false);rows.push({k:d.k,kind:stlKind(d),x:d.x,y:d.y,npc:b?b.o.npc:null,who:b?String((NPCS[b.o.npc]||{}).name||''):null,title:b?b.title:null,dist:b?b.dist:null,at:b?[b.o.x,b.o.y]:null})}
  if(typeof hgdstKind==='function')for(const d of G.decor){const k=d.npc&&hgdstKind(d.npc);if(!k||k==='church'||k==='inn')continue;const s=stlShopOf(d);rows.push({k:'hgstall_'+k,kind:'painted stall',x:d.x,y:d.y,npc:d.npc,who:String((NPCS[d.npc]||{}).name||''),title:s?s.title:null,dist:0,at:[d.x,d.y]})}
  return rows}
