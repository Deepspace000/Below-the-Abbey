/* ==========================================================================
   YARRIM: THE PLAN OF THE VILLAGE. Pure arithmetic, no pictures. A hamlet that grew up by itself: one little cobbled road runs from
   the back of the village down to the harbour square, three even smaller lanes go off it (two north, one south) and end at a door,
   a tiny park lies behind the inn, and a dirt track runs out at the back past a couple of outlying cottages to the gorge and the
   tunnel. Every road is one square wide and runs straight north to south or east to west, but nothing lines up with anything else:
   no blocks, no grid. Nearly all the houses are two squares across and two deep; the inn, the shops and the chapel are three across.
   Test it in a terminal:  node tools/yar_layout_test.js
   ========================================================================== */
const YP={W:112,H:80};
YP.coast=y=>64+5*Math.sin(y*.11)+3*Math.sin(y*.27+1);          // where the water starts (the same line the terrain uses)
YP.shore=y=>Math.floor(YP.coast(y));
YP.GORGE={x0:17,x1:25,y:40};                                    // the short rocky way from the tunnel mouth (a door in the rock at x0) out into the open
function yarMulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* the buildings whose doors open (the same names and colours as ever) */
const YP_SPECIAL=[
  {id:'inn',     name:'The Drowned Lantern',          hue:3,wh:1.5, roof:1},
  {id:'harbour', name:"The Harbourmaster's Office",   hue:5,wh:1.45,roof:2},
  {id:'chandler',name:'Brine and Rope',               hue:1,wh:1.45,roof:4},
  {id:'trader',  name:"Wen's Trading Post",           hue:4,wh:1.5, roof:0},
  {id:'dealer',  name:"Selk's Ship Dealing",          hue:0,wh:1.5, roof:3},
  {id:'maren',   name:"Old Maren's House",            hue:2,wh:1.3, roof:5},
  {id:'chapel',  name:'The Chapel of the Tides',      hue:5,wh:1.6, roof:3},
  {id:'loft',    name:'The Net Loft',                 hue:1,wh:1.4, roof:2}
];
/* the roads: [surface, x from, y from, x to, y to], each a straight line */
const YP_ROADS=[
  ['cobble',33,40,47,40],      // the main road, from the back of the village to the harbour square
  ['cobble',36,33,36,39],      // Net Lane, north, ending at the Net Loft
  ['cobble',45,35,45,39],      // Chapel Lane, north, ending at the chapel
  ['cobble',46,35,47,35],      // the little path from the chapel's lane into the park
  ['cobble',41,41,41,47],      // Gull Lane, south, ending at Old Maren's door
  ['dirt',18,40,32,40],        // the track at the back: out past the cottages to the gorge and the tunnel
  ['cobble',54,40,56,41]       // the quay, down to the pier
];
const YP_SQUARE={x0:48,y0:38,x1:53,y1:42};                      // the little main square at the front, by the beach
/* the houses: [id, x0, y0, width, depth, face, which square of that face the door is in]. A face is the side the door looks out of. */
const YP_HOUSES=[
  // north side of the main road
  ['n1',34,38,2,2,'S',1],['n2',38,38,2,2,'S',0],['n3',41,38,3,2,'S',1],
  // south side of the main road
  ['s1',34,41,2,2,'N',0],['s2',37,41,3,2,'N',1],['chandler',43,41,3,2,'N',1],['s4',46,41,2,2,'N',1],
  // Net Lane
  ['w1',34,35,2,2,'E',1],['e1',37,35,2,2,'W',0],['loft',35,31,3,2,'S',1],
  // Gull Lane
  ['g1',39,43,2,2,'E',1],['g2',39,46,2,2,'E',0],['g3',42,43,2,2,'W',0],['g4',42,46,2,2,'W',1],['maren',40,48,2,2,'N',1],
  // Chapel Lane
  ['c1',43,36,2,2,'E',0],['c2',46,36,2,2,'W',1],['chapel',44,33,3,2,'S',1],
  // the square: the inn and the trader on the north side, the harbourmaster and the ship dealer on the south
  ['inn',48,36,3,2,'S',1],['trader',51,36,3,2,'S',1],['harbour',48,43,3,2,'N',1],['dealer',51,43,3,2,'N',1],
  // two cottages out on the track
  ['o1',30,38,2,2,'S',0],['o2',27,41,2,2,'N',1]
];
const YP_PARK={x0:48,y0:30,x1:54,y1:35,gate:[47,35]};          // a lawn behind the inn, entered by a path from Chapel Lane
const YP_LIGHT={x0:57,y0:23,x1:59,y1:25,door:[57,24],front:[56,24]};   // the lighthouse on the north point
/* iron lamp posts stand beside the road, never on it, so the lanes stay open: the square, the road junctions, the ends of the lanes */
const YP_LAMPS=[[48,38],[53,38],[48,42],[53,42],[47,39],[37,39],[40,39],[44,39],[36,41],[40,41],[42,41],[35,33],[44,35],[42,48],[33,41],[29,41]];
/* the names of the ways, where the area map writes them */
const YP_NAMES=[{t:'Quay Road',x:40,y:39.4,k:'lane'},{t:'Net Lane',x:35,y:34.5,k:'lane',v:1},{t:'Chapel Lane',x:46.6,y:37.8,k:'lane'},{t:'Gull Lane',x:42.9,y:44.9,k:'lane'},
  {t:'The Back Track',x:25,y:39.2,k:'lane'},{t:'The Harbour',x:50.5,y:40.2,k:'place'},{t:'The Little Green',x:51,y:32.8,k:'place'}];

function yarPlan(seed){
  const W=YP.W,H=YP.H,rng=yarMulberry(seed||90210),R=(a,b)=>a+Math.floor(rng()*(b-a+1)),pick=a=>a[Math.floor(rng()*a.length)];
  const street=new Uint8Array(W*H),dirt=new Uint8Array(W*H),house=new Int16Array(W*H).fill(-1),yard=new Uint8Array(W*H);
  const inB=(x,y)=>x>=1&&y>=1&&x<W-1&&y<H-1;
  const st=(x,y,d)=>{if(inB(x,y)){street[y*W+x]=1;if(d)dirt[y*W+x]=1}};
  for(const [kind,x0,y0,x1,y1] of YP_ROADS)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)st(x,y,kind==='dirt');
  for(let y=YP_SQUARE.y0;y<=YP_SQUARE.y1;y++)for(let x=YP_SQUARE.x0;x<=YP_SQUARE.x1;x++)st(x,y,false);
  const houses=[],special={};
  const hues=[0,1,2,3,4,5];let last=-1;
  for(const [id,x0,y0,w,d,face,di] of YP_HOUSES){
    const x1=x0+w-1,y1=y0+d-1;
    const door=face==='S'?[x0+di,y1]:face==='N'?[x0+di,y0]:face==='E'?[x1,y0+di]:[x0,y0+di];
    const front=face==='S'?[door[0],y1+1]:face==='N'?[door[0],y0-1]:face==='E'?[x1+1,door[1]]:[x0-1,door[1]];
    const sp=YP_SPECIAL.find(s=>s.id===id)||null;
    const h={id,x0,x1,y0,y1,w,d,face,door,front,sp,outlying:id[0]==='o'&&!sp};
    if(sp){h.hue=sp.hue;h.wh=sp.wh;h.roof=sp.roof}
    else{let hue=pick(hues);if(hue===last)hue=(hue+1+R(0,4))%6;last=hue;h.hue=hue;h.wh=pick([1.15,1.2,1.25,1.3,1.35,1.4]);h.roof=R(0,5)}
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!inB(x,y)||street[y*W+x]||house[y*W+x]>=0)throw new Error('house '+id+' overlaps a road or a house at '+x+','+y)}
    if(!street[front[1]*W+front[0]])throw new Error('house '+id+' has no road at its door: '+front);
    h.i=houses.length;houses.push(h);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)house[y*W+x]=h.i;
    if(sp)special[id]=h;
  }
  const park=YP_PARK;
  for(let y=park.y0;y<=park.y1;y++)for(let x=park.x0;x<=park.x1;x++){if(house[y*W+x]>=0||street[y*W+x])throw new Error('the park overlaps a house or a road at '+x+','+y);yard[y*W+x]=2}
  for(const [x,y] of YP_LAMPS)if(street[y*W+x]&&!(x>=YP_SQUARE.x0&&x<=YP_SQUARE.x1&&y>=YP_SQUARE.y0&&y<=YP_SQUARE.y1))throw new Error('a lamp stands in the road at '+x+','+y);
  return {W,H,street,dirt,house,yard,houses,special,park,rng,light:YP_LIGHT,harbour:YP_SQUARE,square:YP_SQUARE,lamps:YP_LAMPS,names:YP_NAMES};
}

/* a picture of the plan for the terminal: o tiny house, uppercase letter a building with a door that opens, D a door, . cobbles, : dirt, p park */
function yarAscii(P,x0,y0,x1,y1){
  const out=[];
  for(let y=y0;y<=y1;y++){let s='';for(let x=x0;x<=x1;x++){const i=y*P.W+x;
    if(P.house[i]>=0){const h=P.houses[P.house[i]];const door=(x===h.door[0]&&y===h.door[1]);s+=door?'D':h.sp?h.sp.id[0].toUpperCase():(h.w*h.d>=6?'#':'o')}
    else if(P.lamps.some(l=>l[0]===x&&l[1]===y))s+='*';
    else if(P.street[i])s+=P.dirt[i]?':':'.';else if(P.yard[i]===2)s+='p';else s+=' ';}
    out.push(String(y).padStart(2)+' '+s)}
  return out.join('\n');
}
if(typeof module!=='undefined')module.exports={YP,yarPlan,yarAscii,YP_SPECIAL,YP_LIGHT,YP_HOUSES,YP_ROADS};
