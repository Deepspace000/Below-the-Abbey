/* ==========================================================================
   YARRIM: THE PLAN OF THE VILLAGE. Pure arithmetic, no pictures: where the little cobbled lanes run, where each tiny house stands
   (nearly all of them two squares across and two deep), which of them are the inn, the ship dealer, the trader and the other
   buildings whose doors open, where the little park is, and which cells are yards. yarrim.js turns the plan into walls, floors,
   people and props. The whole village is about twenty squares across: a hamlet by the harbour, not a town.
   Test it in a terminal:  node tools/yar_layout_test.js
   ========================================================================== */
const YP={W:112,H:80};
YP.coast=y=>64+5*Math.sin(y*.11)+3*Math.sin(y*.27+1);          // where the water starts (the same line the terrain uses)
YP.shore=y=>Math.floor(YP.coast(y));
YP.GORGE={x0:17,x1:25,y:40};                                    // the short rocky way from the tunnel mouth (a door in the rock at x0) into the village
function yarMulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* the buildings whose doors open: a little larger than a plain house (three squares across), still tiny */
const YP_SPECIAL=[
  {id:'inn',     band:'A',x0:26,w:3,d:2,name:'The Drowned Lantern',hue:3,wh:1.5,roof:1},
  {id:'harbour', band:'A',x0:44,w:3,d:2,name:"The Harbourmaster's Office",hue:5,wh:1.45,roof:2},
  {id:'chandler',band:'D',x0:27,w:3,d:2,name:'Brine and Rope',hue:1,wh:1.45,roof:4},
  {id:'trader',  band:'D',x0:34,w:3,d:2,name:"Wen's Trading Post",hue:4,wh:1.5,roof:0},
  {id:'dealer',  band:'D',x0:44,w:3,d:2,name:"Selk's Ship Dealing",hue:0,wh:1.5,roof:3},
  {id:'maren',   band:'E',x0:28,w:2,d:2,name:"Old Maren's House",hue:2,wh:1.3,roof:5},
  {id:'chapel',  band:'B',x0:34,w:3,d:2,name:'The Chapel of the Tides',hue:5,wh:1.6,roof:3},
  {id:'loft',    band:'E',x0:36,w:3,d:2,name:'The Net Loft',hue:1,wh:1.4,roof:2}
];
/* the bands of houses: each is a row two squares deep along a lane. face: which way the doors look; lane: the lane they open on */
const YP_BANDS={
  A:{y:38,d:2,face:'S',lane:40,x0:26,x1:48},     // north side of the main lane, doors on the south face
  B:{y:35,d:2,face:'S',lane:37,x0:26,x1:42},     // behind them, facing the back lane
  D:{y:41,d:2,face:'N',lane:40,x0:26,x1:48},     // south side of the main lane, doors on the north face
  E:{y:44,d:2,face:'N',lane:43,x0:26,x1:46}
};
const YP_LANES_EW=[ // [y, x from, x to]
  [40,25,56],[40+1,49,56],[37,26,48],[43,26,48]
];
const YP_LANES_NS=[ // [x, y from, y to]
  [32,34,46],[43,34,46]
];
const YP_HARBOUR={x0:49,y0:39,x1:54,y1:41};              // the little harbour square at the root of the pier
const YP_PARK={x0:44,y0:31,x1:51,y1:36,gate:[47,37]};    // a lawn north of the harbour, open to the back lane
const YP_LIGHT={x0:57,y0:23,x1:59,y1:25,door:[57,24],front:[56,24]};   // the lighthouse on the north point

function yarPlan(seed){
  const W=YP.W,H=YP.H,rng=yarMulberry(seed||90210),R=(a,b)=>a+Math.floor(rng()*(b-a+1)),pick=a=>a[Math.floor(rng()*a.length)];
  const street=new Uint8Array(W*H),house=new Int16Array(W*H).fill(-1),yard=new Uint8Array(W*H);
  const inB=(x,y)=>x>=1&&y>=1&&x<W-1&&y<H-1;
  const st=(x,y)=>{if(inB(x,y))street[y*W+x]=1};
  // ---- streets: every one of them a lane, one square wide, except the quay that runs out to the pier ----
  for(const [y,x0,x1] of YP_LANES_EW)for(let x=x0;x<=x1;x++)st(x,y);
  for(const [x,y0,y1] of YP_LANES_NS)for(let y=y0;y<=y1;y++)st(x,y);
  for(let y=YP_HARBOUR.y0;y<=YP_HARBOUR.y1;y++)for(let x=YP_HARBOUR.x0;x<=YP_HARBOUR.x1;x++)st(x,y);
  const conn=new Set(YP_LANES_NS.map(l=>l[0]));
  const free=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!inB(x,y)||street[y*W+x]||house[y*W+x]>=0||yard[y*W+x])return false}return true};
  const houses=[];
  const put=h=>{h.i=houses.length;houses.push(h);for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++)house[y*W+x]=h.i;return h};
  const make=(band,x0,w,d,opt)=>{
    const B=YP_BANDS[band];let y0,y1,door,front;
    if(B.face==='S'){y1=B.y+B.d-1;y0=y1-d+1;door=[x0+(opt.doorAt!==undefined?opt.doorAt:(w>>1)),y1];front=[door[0],y1+1]}
    else{y0=B.y;y1=y0+d-1;door=[x0+(opt.doorAt!==undefined?opt.doorAt:(w>>1)),y0];front=[door[0],y0-1]}
    return Object.assign({band,x0,x1:x0+w-1,y0,y1,w,d,face:B.face,door,front},opt);
  };
  // ---- the buildings with doors that open go in first ----
  const special={};
  for(const s of YP_SPECIAL){
    const h=make(s.band,s.x0,s.w,s.d,{doorAt:s.w===2?(rng()<.5?0:1):1,hue:s.hue,wh:s.wh,roof:s.roof,sp:s});
    if(free(h.x0,h.y0,h.x1,h.y1)&&street[h.front[1]*W+h.front[0]]){put(h);special[s.id]=h}
  }
  // ---- then the tiny houses along every band, with gaps, so no two rows look alike ----
  const hues=[0,1,2,3,4,5];
  for(const band of Object.keys(YP_BANDS)){
    const B=YP_BANDS[band];
    let x=B.x0,last=-1;
    while(x<B.x1-1){
      const w=pick([2,2,2,2,2,2,3]),d=2;
      const h=make(band,x,w,d,{});
      let blocked=false;for(let xx=h.x0;xx<=h.x1;xx++)if(conn.has(xx))blocked=true;
      const okLane=street[h.front[1]*W+h.front[0]]&&street[h.front[1]*W+h.x1];
      if(!blocked&&okLane&&free(h.x0,h.y0,h.x1,h.y1)&&h.x1<=B.x1&&rng()<.88){
        let hue=pick(hues);if(hue===last)hue=(hue+1+R(0,4))%6;last=hue;
        h.hue=hue;h.wh=pick([1.15,1.2,1.25,1.3,1.35,1.4]);h.roof=R(0,5);
        h.doorAt=w===2?R(0,1):pick([0,1,2]);h.door=[h.x0+h.doorAt,h.door[1]];h.front=[h.door[0],h.front[1]];
        put(h);x=h.x1+1+pick([0,0,1,1,2]);
      }else x++;
    }
  }
  // ---- the little park: a lawn with a well, trees and benches; no house stands on it ----
  const park=YP_PARK;
  const keep=houses.filter(h=>!(h.x1>=park.x0&&h.x0<=park.x1&&h.y1>=park.y0&&h.y0<=park.y1+1));
  for(let i=0;i<W*H;i++)house[i]=-1;
  houses.length=0;for(const h of keep){h.i=houses.length;houses.push(h);for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++)house[y*W+x]=h.i}
  for(let y=park.y0;y<=park.y1;y++)for(let x=park.x0;x<=park.x1;x++)yard[y*W+x]=2;
  for(const k of Object.keys(special))special[k]=houses.find(h=>h.sp&&h.sp.id===k)||null;
  return {W,H,street,house,yard,houses,special,park,rng,light:YP_LIGHT,harbour:YP_HARBOUR};
}

/* a picture of the plan for the terminal: o tiny house, uppercase letter a building with a door that opens, D a door, . lane, p park */
function yarAscii(P,x0,y0,x1,y1){
  const out=[];
  for(let y=y0;y<=y1;y++){let s='';for(let x=x0;x<=x1;x++){const i=y*P.W+x;
    if(P.house[i]>=0){const h=P.houses[P.house[i]];const door=(x===h.door[0]&&y===h.door[1]);s+=door?'D':h.sp?h.sp.id[0].toUpperCase():(h.w*h.d>=6?'#':'o')}
    else if(P.street[i])s+='.';else if(P.yard[i]===2)s+='p';else s+=' ';}
    out.push(String(y).padStart(2)+' '+s)}
  return out.join('\n');
}
if(typeof module!=='undefined')module.exports={YP,yarPlan,yarAscii,YP_SPECIAL,YP_LIGHT};
