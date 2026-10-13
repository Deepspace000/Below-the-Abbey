/* ==========================================================================
   KHEMETRA: THE LIGHTS. Arabian lanterns on posts and pedestals along every street and round the great square before the
   palace, some of them red, hardly any in the Beggars' Quarter (a few red ones and fires on the ground there), copper
   braziers at the palace gate, and strings of lanterns hung across the narrow streets and the great avenue. Each one is a
   painted picture (assets/kh lant1, lant2, fire1, hang1); the game lights the streets from them at night (setupLights).
   ========================================================================== */
// [picture, height in cells, glow centre across (fraction of the width, from the middle), glow centre down (fraction of the height)]
const KH_LANT_AMBER=[['kh_lant1_0',1.55,0,.19],['kh_lant1_1',1.35,0,.2],['kh_lant1_2',1.05,0,.3],['kh_lant1_3',1.5,0,.19],['kh_lant1_4',1.6,.26,.4],['kh_lant1_5',1.0,0,.5]];
const KH_LANT_RED=[['kh_lant2_0',1.5,.15,.33],['kh_lant2_1',1.55,.34,.48],['kh_lant2_2',1.05,0,.22],['kh_lant2_3',1.5,0,.2],['kh_lant2_4',1.5,.23,.29],['kh_lant2_5',1.35,0,.3]];
// barrel, logs, stone ring, copper brazier, pot on a tripod, burning crates: [picture, height in cells, where the flames are, down the picture]
const KH_FIRES=[['kh_fire1_0',.8,.14],['kh_fire1_1',.5,.3],['kh_fire1_2',.45,.35],['kh_fire1_3',.85,.28],['kh_fire1_4',.8,.78],['kh_fire1_5',.55,.45]];
const KH_HANG_H=.62;     // a hanging lantern with its cord, in cells
const KH_HANG_RED=new Set([3,4]);   // which of the hanging pictures are the red ones (hang1_5, a ball with no chain, is not used)

function khPlaceLights(C,L,E){
  const W=C.W,H=C.H,idx=C.idx,occ=E.occ,open=E.open,d3=E.d3,run=E.run,add=E.add,decor=L.decor;
  const rng=khRng(4242);
  const have=a=>a.filter(p=>IMG[p[0]]);
  const amber=have(KH_LANT_AMBER),red=have(KH_LANT_RED);
  for(const p of amber.concat(red))NPC_H[p[0]]=p[1];
  for(const p of KH_FIRES)if(IMG[p[0]])NPC_H[p[0]]=p[1];
  const wallNear=(x,y)=>KH_DIRS.some(([a,b])=>!open(x+a,y+b));
  const inYard=(x,y)=>x>=KH.CX-15&&x<=KH.CX+15&&y>=236&&y<=252;     // the great square before the palace gate
  const redBlock=(x,y)=>khHash(x>>5,y>>5,71)<.13;                    // a few districts are lit red
  // ---- where a lantern may stand: spacing is kept with a grid of the ones already placed ----
  const BS=32,grid=new Map();
  const tooClose=(x,y,S)=>{
    const gx=(x/BS)|0,gy=(y/BS)|0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const l=grid.get((gx+dx)+','+(gy+dy));if(l)for(const q of l){const ax=q[0]-x,ay=q[1]-y;if(ax*ax+ay*ay<S*S)return true}}
    return false;
  };
  const note=(x,y)=>{const k=((x/BS)|0)+','+((y/BS)|0);const l=grid.get(k);if(l)l.push([x,y]);else grid.set(k,[[x,y]])};
  const pickFrom=(arr,x,y,seed,sub)=>{const a=sub?sub.map(k=>arr[k]).filter(Boolean):arr;return a.length?a[(khHash(x,y,seed)*a.length)|0]:null};
  const lantern=(x,y,isRed,sub)=>{
    const list=isRed&&red.length?red:amber;
    const p=pickFrom(list,x,y,81,sub&&sub.filter(k=>k<list.length));
    const d={k:'lamp',x,y,block:false,walk:true,red:!!isRed};
    if(p){d.lk=p[0];d.glow=[p[2],p[3]]}
    return add(d);
  };
  // ---- candidates, in a scattered order so the lanterns do not fall into a grid ----
  const cand=[];
  for(let y=5;y<H-5;y++)for(let x=5;x<W-5;x++){const i=idx(x,y);if(open(x,y)&&C.reach[i]&&!occ[i])cand.push(i)}
  const order=cand.map(i=>[khHash(i%W,(i/W)|0,83),i]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
  const passes=[ // [name, which cells, spacing]
    ['yard',(x,y,i)=>inYard(x,y)&&(wallNear(x,y)||d3[i]),5],
    ['palace',(x,y,i)=>C.zone[i]===6&&!inYard(x,y)&&d3[i],8],
    ['plaza',(x,y,i)=>(C.zone[i]===1||C.zone[i]===3||C.zone[i]===4||C.zone[i]===5)&&d3[i]&&!khInPQ(x,y),8],
    ['park',(x,y,i)=>C.zone[i]===2&&wallNear(x,y)&&!khInPQ(x,y),11],
    ['street',(x,y,i)=>C.zone[i]===0&&!inYard(x,y)&&!khInPQ(x,y)&&wallNear(x,y),8.5],
    ['poor',(x,y,i)=>khInPQ(x,y)&&wallNear(x,y),26]
  ];
  let nL=0,nR=0;
  for(const [name,ok,S] of passes){
    for(const i of order){
      if(occ[i])continue;
      const x=i%W,y=(i/W)|0;
      if(!ok(x,y,i)||tooClose(x,y,S))continue;
      const wd=Math.min(run[i*2],run[i*2+1]);
      let isRed=false,sub=null;
      if(name==='poor'){isRed=true;sub=[0,3,4]}
      else{
        const bazaar=C.plazas.some(p=>(p.name==='The Grand Bazaar'||p.name==='The Court of Baths'||p.name==='The Spice Market')&&x>=p.x0-2&&x<=p.x1+2&&y>=p.y0-2&&y<=p.y1+2);
        isRed=(bazaar&&khHash(x,y,84)<.55)||redBlock(x,y);
        if(name==='yard'||name==='palace')sub=[2,1,5,3];
        else if(name==='plaza')sub=[2,5,1,4];
        else if(name==='park')sub=[1,5,2];
        else sub=wd<=3?[0,1,3,4]:[0,1,3,4,2];
      }
      lantern(x,y,isRed,sub);note(x,y);if(isRed)nR++;else nL++;
    }
  }
  // ---- copper braziers at the corners of the great square and either side of the palace gate ----
  const brz=IMG.kh_fire1_3?KH_FIRES[3]:null;
  if(brz)for(const [bx,by] of [[KH.CX-8,241],[KH.CX+8,241],[KH.CX-8,245],[KH.CX+8,245],[KH.CX-4,240],[KH.CX+4,240]]){
    let q=null;for(let r=0;r<=2&&!q;r++)for(let dy=-r;dy<=r&&!q;dy++)for(let dx=-r;dx<=r;dx++){const xx=bx+dx,yy=by+dy,i=idx(xx,yy);if(open(xx,yy)&&C.reach[i]&&!occ[i]){q=[xx,yy];break}}
    if(q)add({k:'cfire',lk:brz[0],x:q[0],y:q[1],block:true,deco:true,glow:[0,brz[2]]});
  }
  // ---- fires on the ground in the Beggars' Quarter: barrels, logs, a ring of stones, a pot, burning crates ----
  let nF=0;
  const fires=[0,1,2,4,5,0,1].filter(k=>IMG[KH_FIRES[k][0]]);
  if(fires.length){
    const fcand=cand.filter(i=>{const x=i%W,y=(i/W)|0;return khInPQ(x,y)&&d3[i]&&!occ[i]}).map(i=>[khHash(i%W,(i/W)|0,85),i]).sort((a,b)=>a[0]-b[0]);
    const fgrid=[];
    for(const [,i] of fcand){
      if(nF>=9)break;
      const x=i%W,y=(i/W)|0;
      if(fgrid.some(q=>(q[0]-x)**2+(q[1]-y)**2<15*15))continue;
      const k=fires[nF%fires.length];
      add({k:'cfire',lk:KH_FIRES[k][0],x,y,block:true,deco:true,glow:[0,KH_FIRES[k][2]]});
      fgrid.push([x,y]);nF++;
    }
  }
  L.khLights={lanterns:nL,red:nR,fires:nF};
  khPlaceHanging(C,L,E);
}

/* strings of lanterns hung across the narrow streets and the great avenue */
function khPlaceHanging(C,L,E){
  const W=C.W,H=C.H,idx=C.idx,open=E.open,run=E.run,decor=L.decor;
  const pics=[0,1,2,3,4].filter(k=>IMG['kh_hang1_'+k]);
  if(!pics.length)return;
  for(const k of pics)NPC_H['kh_hang1_'+k]=KH_HANG_H;
  const amberP=pics.filter(k=>!KH_HANG_RED.has(k)),redP=pics.filter(k=>KH_HANG_RED.has(k));
  const wallH=(x,y)=>{const ch=L.rows[y]&&L.rows[y][x],g=ch!==undefined?L.chars[ch]:undefined,ti=g!==undefined?T_TILE[g]:undefined;return ti!==undefined&&TEX[ti]&&TEX[ti].wh?TEX[ti].wh:2.4};
  const BS=32,grid=new Map();
  const tooClose=(x,y,S)=>{const gx=(x/BS)|0,gy=(y/BS)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const l=grid.get((gx+dx)+','+(gy+dy));if(l)for(const q of l){const ax=q[0]-x,ay=q[1]-y;if(ax*ax+ay*ay<S*S)return true}}return false};
  const note=(x,y)=>{const k=((x/BS)|0)+','+((y/BS)|0);const l=grid.get(k);if(l)l.push([x,y]);else grid.set(k,[[x,y]])};
  let strings=0,count=0;
  const hangString=(cells,across,main)=>{ // cells: the squares across the street, in order; across: [dx,dy] of the street's side walls
    const n=cells.length,first=cells[0],last=cells[n-1];
    const wA=wallH(first[0]-across[0],first[1]-across[1]),wB=wallH(last[0]+across[0],last[1]+across[1]);
    const top=Math.max(1.75,Math.min(2.4,Math.min(wA,wB)-.1));   // above the heads of the people in the street, whatever the height of the houses
    const isRed=!main&&khHash(first[0]>>5,first[1]>>5,71)<.13;
    const mid=(n-1)/2;
    cells.forEach(([x,y],k)=>{
      const sag=.22*(1-Math.pow((k-mid)/Math.max(1,mid+.5),2));    // the string sags in the middle
      const pool=isRed&&redP.length?redP:amberP.length?amberP:pics;
      const pk=pool[(khHash(x,y,86)*pool.length)|0];
      const d={k:'hlant',lk:'kh_hang1_'+pk,x,y,block:false,bob:Math.max(.9,top-KH_HANG_H-sag),red:KH_HANG_RED.has(pk)};
      if(Math.abs(k-mid)<=.5||(main&&(k===1||k===n-2)))d.lit=true;
      decor.push(d);count++;
    });
    strings++;
  };
  for(let y=8;y<H-8;y++)for(let x=8;x<W-8;x++){
    const i=idx(x,y);if(!C.reach[i]||!open(x,y)||C.zone[i]!==0||khInPQ(x,y))continue;
    const rh=run[i*2],rv=run[i*2+1];
    const avenue=x>=KH.CX-4&&x<=KH.CX+4&&y>=250&&y<=H-14;
    // a north-south street: narrow across, long along; this square is the west end of its row
    if(!open(x-1,y)&&((rh>=2&&rh<=3&&rv>=8)||(avenue&&rh===9))){
      const cells=[];let ok=true;for(let k=0;k<rh;k++){const j=idx(x+k,y);if(!C.reach[j]||run[j*2+1]<8){ok=false;break}cells.push([x+k,y])}
      const main=avenue&&rh===9;
      if(ok&&!tooClose(x+rh/2,y,main?11:15)&&khHash(x,y,87)<(main?1:.8)){hangString(cells,[1,0],main);note(x+rh/2,y)}
    }
    // an east-west street: narrow across, long along; this square is the north end of its column
    else if(!open(x,y-1)&&rv>=2&&rv<=3&&rh>=8){
      const cells=[];let ok=true;for(let k=0;k<rv;k++){const j=idx(x,y+k);if(!C.reach[j]||run[j*2]<8){ok=false;break}cells.push([x,y+k])}
      if(ok&&!tooClose(x,y+rv/2,15)&&khHash(x,y,88)<.8){hangString(cells,[0,1],false);note(x,y+rv/2)}
    }
  }
  if(L.khLights)L.khLights.strings=strings,L.khLights.hung=count;
}
