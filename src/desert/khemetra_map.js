/* ==========================================================================
   KHEMETRA, THE GOLDEN CITY (level 44): the map. A vast walled city, 400 by 400, of white and gold houses.
   This file only lays out streets, blocks, plazas and the face of every building; the pictures come from
   khemetra_art.js and the people, shops and quests from khemetra_data.js.
   ========================================================================== */
const KH={W:400,H:400,WALL:5,CX:200,CY:200,GATE_X:200};
const KH_FLOOR={sand:'0',herring:'1',gold:'2',market:'3',lawn:'4',mosaic:'5'};
function khRng(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
/* pools of facade pictures by kind. Each entry is {f: name, n: cells wide, wh: wall height}. khemetra_art.js fills this in from the
   pictures; before that a plain stand-in is used so the map can still be built and checked. */
let KH_POOLS=null;
function khStandIn(){
  const mk=(p,k,n,wh)=>{const a=[];for(let i=0;i<k;i++)a.push({f:p+i,n,wh});return a};
  return {house:mk('h',12,2,2),mansion:mk('m',6,3,3),low:mk('l',12,2,1.3),shop:{potion:mk('sp',2,2,1.8),scroll:mk('ss',2,2,1.8),food:mk('sf',2,2,1.8),spice:mk('sx',2,2,1.8),weapon:mk('sw',2,2,1.8),cloth:mk('sc',2,2,1.8),
    inn:mk('in',3,3,2.2),ship:mk('sh',1,3,2.2),quest:mk('qh',1,3,2.2),work:mk('wk',1,3,2.2),map:mk('mp',1,3,2.2)},temple:mk('t',4,3,3),pray:mk('p',6,2,1.6),bath:mk('b',4,3,2),ruin:mk('r',6,2,1.8),palace:mk('pa',4,3,3.4),castle:mk('c',4,4,3.4),
    roofs:[],towers:[]};
}
function khBuild(seed){
  const P=KH_POOLS||(KH_POOLS=khStandIn());
  const W=KH.W,H=KH.H,B=KH.WALL,rng=khRng(seed||4321);
  const idx=(x,y)=>y*W+x;
  const solid=new Uint8Array(W*H);        // 1 = a building or wall, 0 = open ground
  const fl=new Uint8Array(W*H);           // floor kind
  const zone=new Uint8Array(W*H);         // 0 street, 1 market, 2 garden, 3 plaza, 4 temple court, 5 bath court, 6 palace court
  const R=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)f(x,y)};
  // ---- the castle wall round everything ----
  R(0,0,W-1,H-1,(x,y)=>{if(x<B||y<B||x>=W-B||y>=H-B)solid[idx(x,y)]=1});
  // ---- the grid of blocks: streets of every width, blocks of every size ----
  const cuts=(lo,hi)=>{const out=[];let p=lo;while(p<hi){const bw=12+Math.floor(rng()*15),sw=[2,3,3,3,4,4,5][Math.floor(rng()*7)];if(p+bw+sw>hi-9){out.push([p,hi]);break}out.push([p,p+bw-1]);p+=bw+sw}return out};
  const xb=cuts(B+1,W-B-2),yb=cuts(B+1,H-B-2);
  const blocks=[];
  for(let j=0;j<yb.length;j++)for(let i=0;i<xb.length;i++)blocks.push({i,j,x0:xb[i][0],x1:xb[i][1],y0:yb[j][0],y1:yb[j][1]});
  for(const b of blocks){R(b.x0,b.y0,b.x1,b.y1,(x,y)=>{solid[idx(x,y)]=1})}
  // some neighbours merge into one great block, others split by a narrow lane
  for(const b of blocks){
    const r=rng();
    if(r<.10&&b.i+1<xb.length){const n=blocks.find(q=>q.i===b.i+1&&q.j===b.j);if(n)R(b.x1+1,b.y0+2,n.x0-1,b.y1-2,(x,y)=>{solid[idx(x,y)]=1})}
    else if(r<.18&&b.j+1<yb.length){const n=blocks.find(q=>q.i===b.i&&q.j===b.j+1);if(n)R(b.x0+2,b.y1+1,b.x1-2,n.y0-1,(x,y)=>{solid[idx(x,y)]=1})}
  }
  // lanes: a narrow dead-end alley bitten into the bigger blocks
  for(const b of blocks){
    const w=b.x1-b.x0+1,h=b.y1-b.y0+1;if(w<16||h<16||rng()<.35)continue;
    if(rng()<.5){const x=b.x0+4+Math.floor(rng()*(w-8)),len=6+Math.floor(rng()*(h>>1)),top=rng()<.5;R(x,top?b.y0:b.y1-len+1,x+1,top?b.y0+len-1:b.y1,(xx,yy)=>{solid[idx(xx,yy)]=0})}
    else{const y=b.y0+4+Math.floor(rng()*(h-8)),len=6+Math.floor(rng()*(w>>1)),left=rng()<.5;R(left?b.x0:b.x1-len+1,y,left?b.x0+len-1:b.x1,y+1,(xx,yy)=>{solid[idx(xx,yy)]=0})}
  }
  // ---- the great avenues: the south gate to the palace, the ring road, the cross roads ----
  const open=(x0,y0,x1,y1,z,f)=>R(x0,y0,x1,y1,(x,y)=>{if(x<B||y<B||x>=W-B||y>=H-B)return;solid[idx(x,y)]=0;if(z!==undefined){zone[idx(x,y)]=z}if(f!==undefined)fl[idx(x,y)]=f});
  open(KH.CX-4,246,KH.CX+4,H-B-1,0,1);                 // the avenue from the gate (nine wide)
  open(KH.CX-3,B,KH.CX+3,150,0,1);                     // the avenue behind the palace
  open(B,KH.CY-3,150,KH.CY+3,0,1);open(250,KH.CY-3,W-B-1,KH.CY+3,0,1); // east and west cross roads
  open(150,152,250,157,0,1);open(150,243,250,248,0,1); // the ring road round the palace
  open(145,152,150,248,0,1);open(250,152,255,248,0,1);
  // ---- the palace and its court ----
  const PAL={x0:160,y0:162,x1:240,y1:238};
  open(PAL.x0-1,PAL.y0-1,PAL.x1+1,PAL.y1+1,6,2);
  R(PAL.x0,PAL.y0,PAL.x1,PAL.y1,(x,y)=>{if(x<PAL.x0+2||x>PAL.x1-2||y<PAL.y0+2||y>PAL.y1-2)solid[idx(x,y)]=1;else{solid[idx(x,y)]=0;zone[idx(x,y)]=6;fl[idx(x,y)]=KH_FLOOR.gold.charCodeAt(0)-48}});
  open(KH.CX-3,PAL.y1-1,KH.CX+3,PAL.y1+1,6,2);          // the gate through the palace wall
  const PB={x0:176,y0:176,x1:224,y1:204};                // the palace itself
  R(PB.x0,PB.y0,PB.x1,PB.y1,(x,y)=>{solid[idx(x,y)]=1});
  // ---- plazas: markets, gardens, courts ----
  const plazas=[];
  const plaza=(name,cx,cy,w,h,z,f)=>{const x0=cx-(w>>1),y0=cy-(h>>1);open(x0,y0,x0+w-1,y0+h-1,z,f);plazas.push({name,x0,y0,x1:x0+w-1,y1:y0+h-1,z,f})};
  plaza('The Spice Market',112,300,34,26,1,3);plaza('The Cloth Market',288,300,34,26,1,3);plaza('The Grand Bazaar',200,320,30,22,1,3);
  plaza('The Potters Market',108,110,26,22,1,3);plaza('The Fruit Market',292,110,26,22,1,3);
  plaza('The Fountain Garden',100,200,24,20,2,4);plaza('The Palm Garden',300,200,24,20,2,4);plaza('The Moon Garden',200,100,22,16,2,4);
  plaza('The Temple Court',330,60,28,22,4,2);plaza('The Court of Baths',330,340,26,20,5,5);plaza('The Weavers Square',60,330,22,18,3,1);plaza('The Old Square',60,60,24,20,3,0);
  // ---- floors: worn cobbles everywhere, painted tile in the squares and where streets cross ----
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=idx(x,y);if(solid[i]||fl[i])continue;
    const z=zone[i];
    if(z===1)fl[i]=3;else if(z===2)fl[i]=4;else if(z===4)fl[i]=2;else if(z===5)fl[i]=5;else if(z===6)fl[i]=2;
    else{
      let all=true;for(let dy=-2;dy<=2&&all;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H||solid[idx(xx,yy)]){all=false;break}}
      fl[i]=all?2:(((x>>3)*7+(y>>3)*13+((x*y)>>9))%5===0?1:0);
    }
  }
  // ---- districts decide what kind of face a building shows ----
  const dist=(x,y)=>Math.hypot(x-KH.CX,y-KH.CY);
  const kindAt=(x,y,face)=>{ // which pool a facade at this spot is taken from
    const d=dist(x,y);
    // facing a market: shop fronts
    for(const p of plazas)if(p.z===1&&x>=p.x0-3&&x<=p.x1+3&&y>=p.y0-3&&y<=p.y1+3)return 'shop';
    for(const p of plazas)if(p.z===4&&x>=p.x0-4&&x<=p.x1+4&&y>=p.y0-4&&y<=p.y1+4)return rng()<.55?'temple':'pray';
    for(const p of plazas)if(p.z===5&&x>=p.x0-4&&x<=p.x1+4&&y>=p.y0-4&&y<=p.y1+4)return 'bath';
    if(x<125&&y<125&&rng()<.7)return 'ruin';
    if(x<60||x>340)return rng()<.2?'ruin':'low';
    if(d<95)return rng()<.7?'mansion':'house';
    const r=rng();
    return r<.5?'house':r<.75?'low':r<.85?'shop':r<.92?'pray':'mansion';
  };
  // ---- every exposed wall cell gets a slot: (facade, slice) ----
  const slotOf=new Int32Array(W*H).fill(-1);   // index into modules, or -2 for hidden cells
  const modules=[];                              // {f,n,wh,kind,cells:[[x,y]...],face}
  const DIRS=[[0,-1],[0,1],[-1,0],[1,0]];        // faces: north, south, west, east
  const isOpen=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!solid[idx(x,y)];
  const flat=k=>k==='shop'?[].concat(...Object.values(P.shop)):(P[k]||P.house);
  const pickFromPool=(kind,face)=>{
    let pool=null;
    if(kind==='shop'){const ks=Object.keys(P.shop);pool=P.shop[ks[Math.floor(rng()*ks.length)]]}
    else pool=P[kind];
    if(!pool||!pool.length)pool=P.house;
    return pool[Math.floor(rng()*pool.length)];
  };
  for(let d=0;d<4;d++){
    const [dx,dy]=DIRS[d],horiz=d<2;
    const L=horiz?W:H,M=horiz?H:W;
    for(let a=0;a<M;a++){
      let run=[];
      const flush=()=>{
        if(!run.length)return;
        let p=0;
        while(p<run.length){
          const [x,y]=run[p];
          const wallZone=(x<B+1||y<B+1||x>=W-B-1||y>=H-B-1);
          const inPalace=(x>=PAL.x0-1&&x<=PAL.x1+1&&y>=PAL.y0-1&&y<=PAL.y1+1);
          const kind=wallZone?'castle':inPalace?'palace':kindAt(x,y,d);
          let f=pickFromPool(kind,d);
          let n=Math.min(f.n,run.length-p);
          if(n<f.n){const alt=flat(kind).filter(q=>q.n<=run.length-p);f=alt.length?alt[Math.floor(rng()*alt.length)]:{f:'plain',n:1,wh:f.wh};n=Math.min(f.n,run.length-p)}
          const m={f:f.f,n,wh:f.wh,kind,face:d,e:f,cells:run.slice(p,p+n)};
          modules.push(m);const mi=modules.length-1;
          for(const [cx,cy] of m.cells)slotOf[idx(cx,cy)]=mi;
          p+=n;
        }
        run=[];
      };
      for(let b=0;b<L;b++){
        const x=horiz?b:a,y=horiz?a:b,i=idx(x,y);
        if(solid[i]&&slotOf[i]<0&&isOpen(x+dx,y+dy))run.push([x,y]);else flush();
      }
      flush();
    }
  }
  // which open cells can be reached from the city gate at all
  const reach=new Uint8Array(W*H),q=[idx(KH.CX,H-KH.WALL-4)];reach[q[0]]=1;
  while(q.length){const c=q.pop(),x=c%W,y=(c/W)|0;for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const i=idx(nx,ny);if(solid[i]||reach[i])continue;reach[i]=1;q.push(i)}}
  return {W,H,solid,fl,zone,slotOf,modules,plazas,PAL,PB,blocks,xb,yb,idx,rng,reach};
}
