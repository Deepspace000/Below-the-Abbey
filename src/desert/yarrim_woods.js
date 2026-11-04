/* ==========================================================================
   YARRIM: THE WOODS. Green woods round the village to the north and north-west, the west (along the back track) and the south-west. Called by yarBuild (yarrim_town.js)
   just before the level is made, with the village's own tables. The trees are the painted oaks, spruces, a cypress and a willow that the other woods use, and they are solid
   trunks with room between them: no tree stands where three of its four neighbours are trees, so the woods can always be walked round. Three trails of packed earth run through
   them from the back track, each ending in a clearing with a chest; wolves and bandits wander the woods and keep near the clearings. Nothing stands within two squares of a
   house, one of a road, or in the park and round the lighthouse. Everything is chosen by hash, so a saved game finds it as it was.
   ========================================================================== */
const YW_ZONES=[[27,7,53,28,'n'],[26,29,33,52,'w'],[26,53,47,72,'sw']];                       // x0,y0,x1,y1, name
const YW_TRAILS=[
  [[29,40],[29,26],[36,26],[36,20],[44,20],[44,14],[50,14],[50,11]],                         // north: up from the back track, east through the wood to the clearing at the top
  [[31,41],[31,53],[36,53],[36,61],[30,61],[30,67],[38,67]],                                 // south-west: down from the track to the clearing by the southern shore
  [[26,40],[26,30]],[[29,28],[27,28]],                                                         // west: a way along the foot of the hills, and a short spur to a small clearing
  [[50,8],[50,11]]                                                                              // the end of the Pilgrim's Path: its goat track comes out here (LPY in landpath.js) and runs down to the north clearing
];
const YW_CLEARINGS=[[51,11,'n'],[39,67,'s'],[27,28,'w']];                                      // each holds a chest
const YW_OAK=['ltree0','ltree4','ltree8','ltree0','ltree4','ltree8','ltree19'],YW_SPRUCE=['ltree16'];   // (the painted spruces have magenta trunks: slim green cypresses instead)
function yarWoods(c){
  const {W,H,P,rows,block,fm,h,rk,decor,items,used,hs,enemies}=c;
  if(typeof NPC_H!=='undefined'){const set=(k,v)=>{if(NPC_H[k]===undefined)NPC_H[k]=v};set('ltree0',3.6);set('ltree4',3.8);set('ltree8',3.4);set('ltree19',3.2);set('ltree16',3.6);set('ltree7',3.6)}
  const I=(x,y)=>y*W+x,K=(x,y)=>x+','+y;
  const land=(x,y)=>{if(x<2||y<2||x>=W-2||y>=H-2)return false;const i=I(x,y);return rows[y][x]==='.'&&!block[i]&&h[i]>-.05&&h[i]<.7&&rk[i]<.08&&(fm[i]==='0'||fm[i]==='5'||fm[i]==='6')&&!P.street[i]&&P.house[i]<0&&P.yard[i]!==2};
  const nearHouse=(x,y,r)=>P.houses.some(q=>x>=q.x0-r&&x<=q.x1+r&&y>=q.y0-r&&y<=q.y1+r);
  const park=P.park,LH=P.light,keep=(x,y)=>nearHouse(x,y,2)||(x>=park.x0-2&&x<=park.x1+2&&y>=park.y0-2&&y<=park.y1+3)||(x>=LH.x0-4&&x<=LH.x1+4&&y>=LH.y0-4&&y<=LH.y1+4)||(()=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(P.street[I(x+dx,y+dy)])return true;return false})();
  // the trails: straight stretches between the waypoints, one square wide, packed earth
  const path=new Set(),trail=[];
  for(const t of YW_TRAILS)for(let k=0;k+1<t.length;k++){let [x,y]=t[k];const [x1,y1]=t[k+1];
    while(x!==x1||y!==y1){path.add(I(x,y));trail.push([x,y]);if(x!==x1)x+=Math.sign(x1-x);else y+=Math.sign(y1-y)}path.add(I(x1,y1));trail.push([x1,y1])}
  const clear=new Set();   // the clearings: a disc of open ground round each chest
  for(const [cx,cy] of YW_CLEARINGS)for(let y=cy-3;y<=cy+3;y++)for(let x=cx-3;x<=cx+3;x++)if(Math.hypot(x-cx,y-cy)<=2.6+hs(x,y,82)*.6)clear.add(I(x,y));
  const nearPath=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(path.has(I(x+dx,y+dy)))return true;return false};
  // the ground: green under the trees, packed earth on the trails
  const inZone=(x,y)=>YW_ZONES.find(z=>x>=z[0]&&x<=z[2]&&y>=z[1]&&y<=z[3]);
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!inZone(x,y)||!land(x,y)||keep(x,y))continue;fm[I(x,y)]=path.has(I(x,y))?'6':'5'}
  for(const i of clear){const x=i%W,y=(i/W)|0;if(land(x,y)&&!keep(x,y))fm[i]='5'}
  // the trees
  const tree=new Set(),trees=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    const z=inZone(x,y);if(!z||!land(x,y)||keep(x,y)||used.has(K(x,y))||path.has(I(x,y))||nearPath(x,y)||clear.has(I(x,y)))continue;
    const p=.2+.55*tsmooth(x/6,y/6,81);if(hs(x,y,83)>p)continue;
    let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(tree.has(I(x+dx,y+dy)))nb++;if(nb>=2)continue;
    const r=hs(x,y,84);let k;
    if(z[4]==='sw')k=r<.5?YW_OAK[(hs(x,y,85)*YW_OAK.length)|0]:r<.82?YW_SPRUCE[(hs(x,y,85)*YW_SPRUCE.length)|0]:'ltree16';
    else if(z[4]==='n'&&x<38)k=r<.8?YW_OAK[(hs(x,y,85)*YW_OAK.length)|0]:r<.92?'ltree7':YW_SPRUCE[(hs(x,y,85)*YW_SPRUCE.length)|0];
    else k=r<.78?YW_OAK[(hs(x,y,85)*YW_OAK.length)|0]:YW_SPRUCE[(hs(x,y,85)*YW_SPRUCE.length)|0];
    tree.add(I(x,y));used.add(K(x,y));trees.push([x,y,k]);
    decor.push({k,x,y,block:true,ox:(hs(x,y,86)-.5)*.5,oy:(hs(x,y,87)-.5)*.5,sc:.85+hs(x,y,88)*.35});
  }
  // bushes between the forest and the beach: a loose strip just outside the east edge of the woods, and a thinner one behind the sand; walk-through, never near a house, a road, the park, the lighthouse or a trail
  {const BUSH=['lbush0','lbush0_1','lbush0_2'];let nb=0;
   for(let y=8;y<H-9;y++){const sh=typeof YP!=='undefined'?YP.shore(y):62;
     for(let x=30;x<sh-3;x++){
       if(!land(x,y)||keep(x,y)||used.has(K(x,y))||path.has(I(x,y))||tree.has(I(x,y))||inZone(x,y))continue;
       const z=YW_ZONES.find(q=>y>=q[1]-1&&y<=q[3]+1&&x>q[2]&&x<=q[2]+7);          // just outside a zone's east edge
       const nearSand=x>=sh-10&&x<=sh-4;                                           // behind the beach
       const p=z?.07:nearSand?.045:0;if(!p||hs(x,y,95)>p)continue;
       const key=BUSH[(hs(x,y,96)*BUSH.length)|0];used.add(K(x,y));nb++;
       decor.push({k:key,x,y,block:false,walk:true,deco:true,ox:(hs(x,y,97)-.5)*.7,oy:(hs(x,y,98)-.5)*.5,sc:.85+hs(x,y,99)*.45})}}
   if(typeof NPC_H!=='undefined')for(const k of BUSH)if(NPC_H[k]===undefined)NPC_H[k]=.8;
   c.yarBushes=nb}
  // the squares that can be walked to from the back track (a creature or a chest is never put in a pocket the trees have closed off)
  const reach=new Set(),pass=(x,y)=>P.street[I(x,y)]||(land(x,y)&&!tree.has(I(x,y))),q0=[I(...YW_TRAILS[0][0])];reach.add(q0[0]);
  for(let a=0;a<q0.length;a++){const i=q0[a],x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<2||Y<2||X>=W-2||Y>=H-2)continue;const j=I(X,Y);if(reach.has(j)||!pass(X,Y))continue;reach.add(j);q0.push(j)}}
  // a free square near a place, for a creature, a chest or an item
  const spot=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const X=x+dx,Y=y+dy;if(land(X,Y)&&reach.has(I(X,Y))&&!used.has(K(X,Y))&&!tree.has(I(X,Y)))return [X,Y]}return null};
  const chests=[],foes=[];
  for(const [cx,cy,n] of YW_CLEARINGS){const q=spot(cx,cy,2);if(!q)continue;used.add(K(q[0],q[1]));decor.push({k:'chest',x:q[0],y:q[1],block:true,goldAmt:300+Math.floor(hs(cx,cy,89)*400)});chests.push(q)}
  // wolves in the woods, bandits keeping the clearings
  const WOLVES=[[33,22],[41,17],[28,34],[33,57],[44,69]],BANDITS=[[49,12,'bandit'],[40,68,'bandit'],[28,29,'bandit']];   // 5 wolves and 3 bandits (it was 10 and 5)
  for(const [x,y] of WOLVES){const q=spot(x,y,3);if(q){used.add(K(q[0],q[1]));enemies.push({t:'wolf',x:q[0],y:q[1]});foes.push(q)}}
  for(const [x,y,t] of BANDITS){const q=spot(x,y,2);if(q){used.add(K(q[0],q[1]));enemies.push({t,x:q[0],y:q[1]});foes.push(q)}}
  // herbs and a few draughts along the trails
  const lootAt=[[29,34,'herb'],[33,26,'herb'],[40,20,'potion'],[47,14,'herb'],[31,46,'herb'],[36,57,'potion'],[30,64,'herb'],[26,34,'herb']];
  for(const [x,y,k] of lootAt){const q=spot(x,y,1);if(q){used.add(K(q[0],q[1]));items.push({k,x:q[0],y:q[1]})}}
  YR.woods={trees:trees.length,trail:trail,chests,foes,path};
}

/* the woods' creatures stay in the woods: they wander only within a few squares of where they stand, and a step that would take one out of the wooded zones is undone, so a wolf never walks into the village */
const ywInWoods=(x,y)=>YW_ZONES.some(z=>x>=z[0]&&y>=z[1]&&x<=z[2]&&y<=z[3]);
{const _pat=patrolStep;patrolStep=function(e,def){
  if(LEVEL!==290||typeof ywInWoods!=='function'||!ywInWoods(e.hx!==undefined?e.hx:e.x,e.hy!==undefined?e.hy:e.y))return _pat.apply(this,arguments);
  const ox=e.x,oy=e.y,r=_pat.call(this,e,Object.assign({},def,{roam:9}));
  if(!ywInWoods(e.x,e.y)){e.x=ox;e.y=oy;e.tgt=null}
  return r}}
