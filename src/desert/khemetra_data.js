/* ==========================================================================
   KHEMETRA: how the engine meets the city (skyline drawing, doors, entering). The people, shops and quests are in
   khemetra_people.js.
   ========================================================================== */
const KH_SKYD={k:'kroof'};
/* the roofs, towers, palace and church that rise over the walls: only those in front of the camera and in range */
function khSkyList(cx,cy,dX,dY){
  const L=LEVELS[44],out=[],sk=L.sky;
  for(let i=0;i<sk.length;i++){
    const e=sk[i],rx=e.x-cx,ry=e.y-cy,d2=rx*rx+ry*ry,lim=e.big?58000:2500;
    if(d2>lim||d2<4)continue;
    const dot=rx*dX+ry*dY;if(dot<=0)continue;
    if(Math.abs(rx*dY-ry*dX)>dot*1.1+e.w*.6)continue;
    const img=IMG[e.k];if(!img)continue;
    out.push({x:e.x,y:e.y,img,w:e.w,bob:e.z,decor:KH_SKYD,sky:true});
  }
  return out;
}
/* walking into a door tile of the city */
function khBump(nx,ny,g){
  const d=KH_DOOR[g];if(!d)return false;
  if(d.gate){sfx('door');const L=LEVELS[43],gx=Math.max(1,L.rows[6].indexOf('1'));goToLevel(43,{x:gx,y:8,f:2});return true}
  if(d.lvl!==undefined){sfx("door");goToLevel(d.lvl,d.at);return true}
  return false;
}
function khEnter(then){
  msg('The great gates of Khemetra swing open...','#ffe9a0');
  khPrepare().then(then).catch(e=>{console.error(e);msg('The city is not ready yet.','#d09a80')});
}
function khMakeFloors2(){return khMakeFloors()}
