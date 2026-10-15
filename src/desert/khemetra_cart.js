/* ==========================================================================
   KHEMETRA: THE DONKEY CARTS. A grey donkey and a canopied cart wait at the foot of the gate stair and in every quarter of
   the city. For a few coins the driver takes the party to any quarter, any park, the palace, the mosque, the church, any shop or the
   markets. The longer the ride, the higher the fare.
   ========================================================================== */
let KH_DEST=[];                     // {n, cat, x, y, f}: every place a cart goes
const KH_CART_FACE='kh_cart1_0';
function khFare(x0,y0,d){
  const dist=Math.abs(d.x-x0)+Math.abs(d.y-y0);
  let p=6+dist*.3;
  if(d.n==='The Palace of Khemetra')p+=40;else if(d.n==='The Great Mosque')p+=20;else if(d.cat==='park')p-=3;else if(d.cat==='quarter')p+=8;
  return Math.max(5,Math.round(p/5)*5);
}
function khRideLines(d){
  const to=d.cat==='park'?'the green trees of '+d.n:d.n;
  return [{text:'The driver clicks his tongue and the donkey sets off at a steady trot, the cart rattling over the cobbles. White walls, gold roofs and palms slide past on both sides.'},
    {text:d.cat==='park'?'The streets fall away and the air smells of cut grass and blossom. The cart pulls up under the palms of '+d.n+'.':d.n==='The Palace of Khemetra'?'The avenue widens. Guards in white and gold stand in rows, and the great spire of the palace climbs the sky. The cart stops at the palace court.':'The cart rolls on through the streets and stops at last in '+d.n+'. "Here you are, friends. Mind the step."'}];
}
let KH_RIDE=null;
CUTS.khRide=()=>khRideLines(KH_RIDE||{n:'the city',cat:'quarter'});
function khRide(d,fare,x0,y0){
  if(G.gold<fare)return say('The fare is '+fare+' gold, and you have too little. Perhaps a cheaper stop?',[BYE]);
  G.gold-=fare;KH_RIDE=d;sfx('key');
  G.talk=null;
  startCut('khRide',()=>{
    G.P.x=d.x;G.P.y=d.y;G.P.f=d.f||0;G.P.angT=(G.P.f-1)*Math.PI/2;G.C.x=d.x;G.C.y=d.y;G.C.a=G.P.angT;
    khCartBehind(d);
    advanceTime(Math.max(5,Math.round((Math.abs(d.x-x0)+Math.abs(d.y-y0))/9)));reveal();
    msg('You step down from the cart in '+d.n+'.','#ffe9a0');
  });
  return null;
}
/* a cart waits on the street just behind the drop-off, so the party can turn round and ride back */
function khCartBehind(d){
  const C=KH_CITY;if(!C)return;
  const px=d.x,py=d.y;
  if(G.decor.some(o=>o.npc==='kh_cart'&&!o.found&&Math.abs(o.x-px)<=3&&Math.abs(o.y-py)<=3))return;
  const f=d.f||0,b=DIRS[(f+2)%4],sd=DIRS[(f+1)%4];
  const cand=[[px+b[0]*2,py+b[1]*2],[px+b[0],py+b[1]],[px+b[0]*2+sd[0],py+b[1]*2+sd[1]],[px+sd[0],py+sd[1]],[px-sd[0],py-sd[1]],[px+b[0]*3,py+b[1]*3]];
  for(const [x,y] of cand){
    if(x<0||y<0||x>=C.W||y>=C.H||!C.reach[y*C.W+x])continue;
    if(G.decor.some(o=>!o.found&&o.block&&o.x===x&&o.y===y))continue;
    G.decor.push({k:khFaceKey(KH_CART_FACE),x,y,block:false,walk:true,npc:'kh_cart',sc:1});
    buildDecorMap();khBucketDecor();return;
  }
}
function khCartMenu(d0){
  const x0=G.P.x,y0=G.P.y,F=G.flags;
  const list=cat=>KH_DEST.filter(d=>d.cat===cat);
  const dist=d=>Math.abs(d.x-x0)+Math.abs(d.y-y0);
  const opt=d=>[d.n+'  ('+khFare(x0,y0,d)+' gold)',()=>khRide(d,khFare(x0,y0,d),x0,y0)];
  const page=(label,arr,pg,backFn)=>{
    const sorted=arr.slice().sort((a,b)=>dist(a)-dist(b)),per=5,slice=sorted.slice(pg*per,pg*per+per);
    const o=slice.map(opt);
    if((pg+1)*per<sorted.length)o.push(['More '+label+'...',()=>page(label,arr,pg+1,backFn)]);
    if(pg>0)o.push(['Back',()=>page(label,arr,pg-1,backFn)]);else o.push(['Back',backFn]);
    return say('Where to? The nearest ones come first.',o);
  };
  const top=()=>say('Where would you like to go? The longer the ride, the higher the fare.',[
    ['To a quarter of the city',()=>page('quarters',list('quarter'),0,top)],
    ['To a park',()=>page('parks',list('park'),0,top)],
    ['To a market',()=>page('markets',list('market'),0,top)],
    ['To a shop',()=>page('shops',list('shop'),0,top)],
    ['To the palace, the mosque or another landmark',()=>page('landmarks',list('landmark'),0,top)],
    ['Never mind.',()=>null]]);
  return top();
}
khNpc('kh_cart','The donkey cart',KH_CART_FACE,d=>say('A grey donkey stands in the shafts of a cart with a striped canopy. The driver tips his turban. "A ride, friends? To any quarter, any park, any market, the palace, the mosque. I know every street in Khemetra, and I go fast."',[['Ask for a ride',()=>khCartMenu(d)],BYE]));
/* put the destinations and the carts into the city (called by khCrowd) */
function khPlaceCarts(C,L,near,add,reachFree){
  const dests=[],H=C.H;
  const spot=(x,y,rad)=>near(x,y,rad,false);
  for(const q of KH_DISTRICTS){const p=spot((q.x0+q.x1)>>1,(q.y0+q.y1)>>1,14);if(p)dests.push({n:q.n,cat:'quarter',x:p[0],y:p[1],f:0})}
  let pi=0;
  for(const pk of C.plazas){if(!pk.park)continue;const nm=KH_PARK_NAMES[(pi++)%KH_PARK_NAMES.length];const p=spot((pk.x0+pk.x1+4)>>1,(pk.y0+pk.y1+4)>>1,6);if(p)dests.push({n:nm,cat:'park',x:p[0],y:p[1],f:0})}
  for(const p of C.plazas){if(p.park||!p.name)continue;const c=spot((p.x0+p.x1)>>1,(p.y0+p.y1)>>1,6);if(c)dests.push({n:p.name,cat:p.z===1?'market':'landmark',x:c[0],y:c[1],f:0})}
  { // the palace stop is on the avenue before the gate, looking up at the palace and its spire
    const pp=near(KH.CX,243,3,false)||[KH.CX,243];dests.push({n:'The Palace of Khemetra',cat:'landmark',x:pp[0],y:pp[1],f:0});
  }
  for(const id of ['mosque','church','temple1','bath1']){const b=KH_BUILDINGS.find(q=>q.id===id);if(b&&b.front)dests.push({n:b.name,cat:'landmark',x:b.front[0],y:b.front[1],f:KH_FACE_F[b.m?b.m.face:1]})}
  for(const b of KH_BUILDINGS){if(b.room==='shop'&&b.front&&b.m)dests.push({n:b.name,cat:'shop',x:b.front[0],y:b.front[1],f:(KH_FACE_F[b.m.face]+2)%4})} // every shop: set down in the street in front of its door, facing it
  dests.push({n:'The Great Gate',cat:'landmark',x:KH.CX,y:H-KH.WALL-4,f:0});
  KH_DEST=dests;L.cartDests=dests;
  // a cart at the foot of the gate stair and one in every quarter
  const stops=[[203,372]].concat(KH_DISTRICTS.map(q=>[((q.x0+q.x1)>>1)+3,((q.y0+q.y1)>>1)+3]));
  for(const [sx,sy] of stops){const p=near(sx,sy,16,true);if(p)add({k:khFaceKey(KH_CART_FACE),x:p[0],y:p[1],block:false,walk:true,npc:'kh_cart',sc:1})}
}
