/* ==========================================================================
   DISEMBARK AND EMBARK. A pier is not needed to explore an island.
   Sailing the open sea, within sight of any island a Disembark button appears. It puts the party ashore on the beach nearest the ship, and
   the Dawn Walker is left riding at anchor just off that beach. Ashore, within a good way of the ship (about thirty cells), an Embark
   button appears and takes the party back aboard, where the ship lay. Ships tied to a pier work the same: the button shows near her.
   ========================================================================== */
const EM={busy:false,near:null,reach:34};
const emIslandLv=n=>!!SN_BY[n]||n===304;
function emNearIsle(){ // the island the ship is close to, if any
  const P=G.P;let best=null,bd=1e9;
  for(const I of SN_ISLES){const d=Math.hypot(P.x-I.x,P.y-I.y),lim=I.r*(I.kind==='forest'||I.kind==='green'?1.5:1.7)+7;if(d<lim&&d<bd){bd=d;best=I}}
  return best;
}
function emBuild(lv){if(LEVELS[lv])return;if(lv>=331)isleBuild(lv);else seaBuild(lv)}
function emLanding(I,P){ // where to come ashore: the outermost land on the line from the island's heart toward the ship, and the water just beyond it
  emBuild(I.lv);const L=LEVELS[I.lv],T=TERRS[I.lv],W=L.rows[0].length,H=L.rows.length;
  const sp=SEA[I.lv],cx=sp?sp.cx:(W>>1),cy=sp?sp.cy:((H>>1)-4);
  const a=Math.atan2(P.y-I.y,P.x-I.x);let last=null,water=null,seen=false;
  for(let r=0;r<Math.max(W,H);r+=.5){
    const x=Math.round(cx+Math.cos(a)*r),y=Math.round(cy+Math.sin(a)*r);if(x<3||y<3||x>=W-3||y>=H-3)break;
    const i=y*W+x,land=!T.block[i]&&L.rows[y][x]==='.'&&T.h[i]>.05;
    if(land){last=[x,y];seen=true}else if(seen&&T.h[i]<-.05){water=[x,y];break}
  }
  if(!last)return null;
  // a free square on the beach, a step or two inland of the last land, and the ship in the water just off it
  const blocked=new Set((L.decor||[]).filter(d=>d.block!==false).map(d=>d.x+','+d.y));
  let at=null;for(let k=0;k<12&&!at;k+=.5){const x=Math.round(last[0]-Math.cos(a)*k),y=Math.round(last[1]-Math.sin(a)*k),i=y*W+x;if(x>2&&y>2&&x<W-3&&y<H-3&&!T.block[i]&&L.rows[y][x]==='.'&&!blocked.has(x+','+y)&&T.h[i]>.05)at=[x,y]}
  if(!at)at=last;
  let ship=water||[Math.round(last[0]+Math.cos(a)*2),Math.round(last[1]+Math.sin(a)*2)];
  const dx=-Math.cos(a),dy=-Math.sin(a),f=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0);   // facing inland
  return {at,ship:[Math.min(W-3,Math.max(3,ship[0]+Math.round(Math.cos(a)*1))),Math.min(H-3,Math.max(3,ship[1]+Math.round(Math.sin(a)*1)))],f};
}
function emShipHome(){ // the ship is back at her pier: the offshore one is gone and the pier one is seen again
  for(const d of G.decor||[]){if(d.npc==='yr_ship')d.hidden=false}
  G.decor=(G.decor||[]).filter(d=>!d.offship);
}
function emDisembark(){
  const I=EM.near;if(!I||LEVEL!==SN.ID)return;
  const F=G.flags,land=emLanding(I,G.P);
  if(!land){msg('There is no beach here to put ashore on.','#d09a80');return}
  F.shipAt={isle:I.lv,sx:land.ship[0],sy:land.ship[1],seaX:G.P.x,seaY:G.P.y,seaF:G.P.f};F.seaFrom=I.lv;
  EM.busy=true;try{goToLevel(I.lv,{x:land.at[0],y:land.at[1],f:land.f})}finally{EM.busy=false}
  msg('You row ashore at '+I.n+'. The Dawn Walker rides at anchor off the beach.','#a8d8ff');sfx('door');
}
function emShipPoint(){ // where the ship lies on this level: offshore, or at her pier
  const S=G.flags.shipAt;if(S&&S.isle===LEVEL)return {x:S.sx,y:S.sy,off:true};
  const d=(G.decor||[]).find(q=>q.npc==='yr_ship'&&!q.hidden);return d?{x:d.x,y:d.y,off:false}:null;
}
function emEmbark(){
  const F=G.flags,S=F.shipAt;
  if(S&&S.isle===LEVEL){delete F.shipAt;F.seaFrom=LEVEL;goToLevel(SN.ID,{x:S.seaX,y:S.seaY,f:S.seaF||0});msg('You climb aboard the Dawn Walker.','#a8d8ff');sfx('door');return}
  sailOpen(LEVEL);
}
function emEnter(n){ // arriving on an island: the ship where she was left
  const S=G.flags.shipAt;
  for(const d of G.decor||[]){if(d.npc==='yr_ship')d.hidden=!!(S&&S.isle===n)}
  if(S&&S.isle===n&&!(G.decor||[]).some(d=>d.offship))G.decor.push({k:'yar_ship_dawn',x:S.sx,y:S.sy,block:false,walk:true,deco:false,npc:'sea_ship_off',offship:true});
}
khNpc('sea_ship_off','The Dawn Walker','yar_ship_dawn',()=>say('The Dawn Walker rides at anchor a little way off the beach, her boat drawn up on the sand.',[['Climb aboard and sail.',()=>{emEmbark();return null}],['Stay ashore.',()=>null]]));
/* the buttons, the key presses and the arrival hooks */
function emHud(){
  if(G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview||TP)return;
  EM.near=null;
  if(LEVEL===SN.ID){const I=emNearIsle();if(I&&!hostileNear()){EM.near=I;btnText('disembark','Disembark  ('+I.n+')',110,168,200,22)}}
  else if(emIslandLv(LEVEL)){const s=emShipPoint();if(s&&Math.hypot(G.P.x-s.x,G.P.y-s.y)<=EM.reach)btnText('embark','Embark',160,168,100,22)}
}
(function(){const _h=uwHud;uwHud=function(){_h();try{emHud()}catch(e){}}})();
(function(){const _b=handleBtn;handleBtn=function(id){
  if((id==='disembark'||id==='embark')&&G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&!TP){if(id==='disembark')emDisembark();else emEmbark();return}
  _b(id)}})();
(function(){const _e=yarEnter;yarEnter=function(n){_e(n);try{emEnter(n)}catch(e){console.error(e)}}})();
