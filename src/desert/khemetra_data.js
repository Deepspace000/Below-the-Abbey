/* ==========================================================================
   KHEMETRA: how the engine meets the city (skyline drawing, doors, entering). The people, shops and quests are in
   khemetra_people.js.
   ========================================================================== */
const KH_SKYD={k:'kroof'};
/* the roofs, towers, palace and church that rise over the walls: only those in front of the camera and in range */
function khSkyList(cx,cy,dX,dY){
  const L=LEVELS[44],out=[],sk=L.sky;
  for(let i=0;i<sk.length;i++){
    const e=sk[i],rx=e.x-cx,ry=e.y-cy,d2=rx*rx+ry*ry,lim=e.big?58000:1600;
    if(d2>lim||d2<4)continue;
    const dot=rx*dX+ry*dY;if(dot<=0)continue;
    if(Math.abs(rx*dY-ry*dX)>dot*1.1+e.w*.6)continue;
    const img=IMG[e.k];if(!img)continue;
    out.push({x:e.x,y:e.y,img,w:e.w,bob:e.z,decor:KH_SKYD,sky:true,smallSky:!e.big});
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
/* run something once the city is ready (its pictures loaded and its rooms built) */
function khThen(then){khPrepare().then(then).catch(e=>{console.error(e);msg('The city is not ready yet.','#d09a80')})}

/* a line of news the first time the party enters a quarter of the city */
function khStory(){
  const F=G.flags,x=G.P.x,y=G.P.y;
  if(khInPQ(x,y)&&!F.zPQ){F.zPQ=1;msg("The Beggars' Quarter. The houses lean together, rubbish lies in the doorways, and eyes watch from the shadows. Thieves and brigands lurk here.",'#e8a090')}
  else if(x<125&&y<125&&!F.zOld){F.zOld=1;msg('The Old Quarter. Half the houses have fallen in. Dogs and the restless dead keep it now.','#d8c8a0')}
  if(x>=160&&x<=240&&y>=162&&y<=238&&!F.zCourt){F.zCourt=1;msg('The court of the palace. White marble, gold leaf, and guards who do not blink.','#ffe9a0')}
}

/* the terrace inside the gate: the party arrives on a high platform and walks down a long stair into the avenue */
function khEyeAt(x,y){return 0}

/* only the part of the city the party is in is worked on: decor is kept in 32 by 32 squares and just the squares near the camera are looked at */
function khBucketDecor(){
  const B=new Map();
  for(const d of G.decor){const k=(d.x>>5)+','+(d.y>>5),l=B.get(k);if(l)l.push(d);else B.set(k,[d])}
  G.khB=B;
}
const KH_NEARBUF=[];
function khNearDecor(cx,cy){
  const out=KH_NEARBUF;out.length=0;
  const x0=Math.max(0,(cx-30)>>5),x1=(cx+30)>>5,y0=Math.max(0,(cy-30)>>5),y1=(cy+30)>>5;
  for(let by=y0;by<=y1;by++)for(let bx=x0;bx<=x1;bx++){const l=G.khB.get(bx+','+by);if(l)for(let i=0;i<l.length;i++)out.push(l[i])}
  return out;
}
