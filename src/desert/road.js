/* ==========================================================================
   THE SAND ROAD (level 41). From Anaea's east gate the road runs east through a narrow forest like Greendale's,
   turns north, and as the party walks the forest thins, palms take over, then even the palms give out and the
   party is in a vast desert of dunes. At the far north is a cliff, and in it the tomb of Sut.
   The map is made by code, the same way every time.
   ========================================================================== */
const RD={W:168,H:224,CY:210,CX0:84,NORTH:6};
const BURROW_N=10,BURROW_BASE=50,BURROW_START={x:10,y:14,f:0}; // the mounds in the dunes lead to levels 50 to 59
const DPLANT_FOOT=[0,0,.5*.117,.45*.065]; // dplant0..3: the empty rows under the stem (fraction of the picture) times the drawn height (NPC_H), sunk so the plant stands on the sand
const rdStep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
function rdCentre(y){return RD.CX0+7*Math.sin(y/19)+9*Math.sin(y/47+1.3)}      // the road's middle once it has turned north
function rdHalf(y){const t=clamp((RD.CY-y)/(RD.CY-RD.NORTH),0,1);return 4+74*rdStep(.14,.62,t)}   // half the width of the land: a funnel
function rdBiome(x,y){ // 0 = lush forest, 1 = open desert: it depends on how far along the road a place is
  const s=(y>=RD.CY-6&&x<RD.CX0+8)?clamp(x/280,0,.2):.2+.8*clamp((RD.CY-y)/(RD.CY-RD.NORTH),0,1);
  return clamp(rdStep(.3,.86,s)+(hash2(x>>2,y>>2,41)-.5)*.14,0,1);
}
function buildSandRoad(){
  const W=RD.W,H=RD.H,rows=[],fm=[],open=new Uint8Array(W*H),edge=new Int16Array(W*H),band=new Uint8Array(W*H);
  const idx=(x,y)=>y*W+x;
  // ---- carve the land ----
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    let on=false,e=0;
    if(y>=RD.NORTH&&x>=1&&x<=W-2&&y<=H-2){
      const hh=4+((hash2(x>>1,7,5)*2)|0);
      if(y>=RD.CY-hh&&y<=RD.CY+hh&&x<=RD.CX0+6){on=true;e=Math.min(y-(RD.CY-hh),RD.CY+hh-y,x)}
      if(y<=RD.CY+4){const cx=rdCentre(y),hw=rdHalf(y)+(hash2(x>>1,y>>1,9)-.5)*2.2;const d=hw-Math.abs(x-cx);if(d>=0){on=true;e=Math.max(e,d|0)}}
    }
    if(on){open[idx(x,y)]=1;edge[idx(x,y)]=Math.max(0,e)}
  }
  // the road itself: a band three wide along the middle
  const bandAt=(x,y)=>{if(y>=RD.CY-1&&y<=RD.CY+1&&x<=RD.CX0)return true;if(y<=RD.CY+1){const c=Math.round(rdCentre(y));return Math.abs(x-c)<=1}return false};
  const bandWide=(x,y)=>{if(y>=RD.CY-3&&y<=RD.CY+3&&x<=RD.CX0+2)return true;if(y<=RD.CY+3){const c=Math.round(rdCentre(y));return Math.abs(x-c)<=3}return false};
  for(let y=0;y<H;y++){
    let row='',fr='';
    for(let x=0;x<W;x++){
      const b=rdBiome(x,y),i=idx(x,y);
      if(!open[i]){row+=y<RD.NORTH?'C':(b<.45?'T':'D');fr+='0';continue}
      row+='.';
      if(bandAt(x,y)){band[i]=1}
      const v=b+(hash2(x,y,43)-.5)*.14;
      let ch=v<.2?'0':v<.45?'2':v<.72?'3':'4';
      if(band[i]&&b<.3)ch='1';else if(band[i]&&b<.92)ch='5';
      fr+=ch;
    }
    rows.push(row);fm.push(fr);
  }
  // the gate back to Anaea at the west end, and the way into the tomb at the north
  const cxN=Math.round(rdCentre(RD.NORTH+3));
  const setc=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  setc(0,RD.CY,'0');setc(cxN,RD.NORTH-1,'1');
  for(let dx=-2;dx<=2;dx++){setc(cxN+dx,RD.NORTH,'.');open[idx(cxN+dx,RD.NORTH)]=1;if(dx&&Math.abs(dx)<=2)setc(cxN+dx,RD.NORTH-1,'C')}
  // ---- scenery ----
  const decor=[],scen=[],occ=new Set(),dunes=new Set();
  const put=(k,x,y,o)=>{const d=Object.assign({k,x,y,block:false},o||{});decor.push(d);if(d.block)occ.add(x+','+y);return d};
  const sc=(k,x,y,o)=>scen.push(Object.assign({k,wx:x+.5+((o&&o.ox)||0),wy:y+.5+((o&&o.oy)||0),sc:(o&&o.sc)||1,decor:{k,walk:true,x,y}}));
  const R=(x,y,k)=>hash2(x,y,k);
  const nearDune=(x,y)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dunes.has((x+dx)+','+(y+dy)))return true;return false};
  const FOREST_FLORA=['lflora0','lflora0_1','lflora0_2','lavender','reeds'];
  for(let y=RD.NORTH+2;y<H-1;y++)for(let x=1;x<W-1;x++){
    const i=idx(x,y);if(!open[i])continue;
    const b=rdBiome(x,y),inBand=bandWide(x,y),e=edge[i];
    const oX=(R(x,y,3)-.5)*.7,oY=(R(x,y,4)-.5)*.7;
    if(inBand)continue;
    // forest: trees crowd the sides, fewer inside
    const fp=1-rdStep(.2,.5,b);
    if(fp>0){
      const tp=(e<=1?.6:e<=2?.38:e<=4?.2:.07)*fp;
      if(R(x,y,5)<tp)put('ltree'+((R(x,y,6)*22)|0),x,y,{block:true,ox:oX*.6,oy:oY*.6});
      else if(R(x,y,7)<.05*fp)sc('lbush0'+(['','_1','_2'][(R(x,y,8)*3)|0]),x,y,{ox:oX,oy:oY,sc:.9+R(x,y,9)*.5});
      else if(fp>.5&&R(x,y,10)<.07*fp)sc(FOREST_FLORA[(R(x,y,11)*5)|0],x,y,{ox:oX,oy:oY,sc:.6+R(x,y,12)*.9});
    }
    // palms take over from the forest, then thin out and stop
    const pp=.075*rdStep(.18,.44,b)*(1-rdStep(.74,.9,b));
    if(pp>0&&R(x,y,13)<pp){const v=(R(x,y,14)*4)|0;put('dpalm'+v,x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.85+R(x,y,15)*.35})}
    else if(b>.3&&b<.8&&R(x,y,16)<.06)sc('dshrub'+((R(x,y,17)*3)|0),x,y,{ox:oX,oy:oY,sc:.8+R(x,y,18)*.7});
    // the desert: big dunes with ripples between, rocks, cacti, dead trees, bones
    const dp=rdStep(.6,.86,b);
    if(dp>0){
      if(DUNE_SPRITES&&R(x,y,20)<.06*dp&&!nearDune(x,y)){dunes.add(x+','+y);put('dune'+((R(x,y,21)*3)|0),x,y,{block:true,ox:oX*.4,oy:oY*.3,sc:.95+R(x,y,22)*.7})}
      else if(R(x,y,23)<.011*dp)put('drock'+((R(x,y,24)*3)|0),x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.9+R(x,y,25)*.5});
      else if(R(x,y,26)<.008*dp){const v=(R(x,y,29)*4)|0,s=.9+R(x,y,27)*.4;put('dplant'+v,x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:s,bob:-DPLANT_FOOT[v]*s})} // dplant2 and dplant3 have empty rows under the stem: sink them by that much so they stand on the sand
      else if(R(x,y,28)<.005*dp)put('ddead',x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.9+R(x,y,29)*.5});
      else if(R(x,y,30)<.045*dp)sc('dshrub'+((R(x,y,31)*3)|0),x,y,{ox:oX,oy:oY,sc:.8+R(x,y,32)*.7});
      else if(R(x,y,33)<.003*dp)sc('dbones',x,y,{ox:oX,oy:oY,sc:.9+R(x,y,34)*.4});
      if(DUNE_SPRITES&&R(x,y,35)<.16*dp)sc('dpeb'+((R(x,y,36)*3)|0),x,y,{ox:(R(x,y,37)-.5)*.9,oy:(R(x,y,38)-.5)*.9,sc:.8+R(x,y,39)*.8}); // low ripples of sand
    }
  }
  // ---- landmarks ----
  // pairs of obelisks beside the road; where the land is narrow they stand a little closer in, never inside the trees
  for(const yy of [192,146,98]){const c=Math.round(rdCentre(yy));for(const s of [1,-1])for(let d=5;d>=3;d--){const x=c+s*d;if(open[idx(x,yy)]&&!occ.has(x+','+yy)){put('dobelisk',x,yy,{block:true});break}}}
  { // an oasis
    const oy=122,ox=Math.round(rdCentre(oy))+12;
    put('well',ox,oy,{block:true});
    for(let k=0;k<9;k++){const a=k/9*TAU,px=Math.round(ox+Math.cos(a)*3.2),py=Math.round(oy+Math.sin(a)*3.2);if(open[idx(px,py)]&&!occ.has(px+','+py))put('dpalm'+(k%2),px,py,{block:true,sc:1.05})}
    for(let k=0;k<12;k++)sc(['reeds','lflora0_1','lavender'][k%3],ox+((k*5)%7)-3,oy+((k*3)%6)-2,{sc:.8,ox:(k%3-1)*.3,oy:(k%2)*.3-.15});
    put('chest',ox+1,oy+2,{block:true});
  }
  { // a wrecked caravan on the road
    const cy=168,c=Math.round(rdCentre(cy));
    put('barrel',c+3,cy,{block:true});put('crate',c+4,cy+1,{block:true});put('barrel',c+5,cy-1,{block:true});put('chest',c+3,cy-2,{block:true});
    sc('dbones',c+2,cy+1,{sc:1.2});sc('dbones',c+4,cy-2,{sc:.9});sc('dbones',c-3,cy,{sc:1.1});
  }
  { // the tomb's guardians: two sphinxes and four obelisks
    put('dsphinx',cxN-4,RD.NORTH+3,{block:true});put('dsphinx',cxN+4,RD.NORTH+3,{block:true,flip:true});
    for(const dx of [-7,7,-10,10])put('dobelisk',cxN+dx,RD.NORTH+(Math.abs(dx)>8?6:4),{block:true});
  }
  for(let k=0;k<12;k++){ // treasure out in the dunes
    for(let t=0;t<30;t++){const x=6+((R(k,t,50)*(W-12))|0),y=14+((R(k,t,51)*90)|0),i=idx(x,y);
      if(open[i]&&!bandWide(x,y)&&!occ.has(x+','+y)&&rdBiome(x,y)>.7){put('chest',x,y,{block:true});sc('dbones',x+1,y,{sc:1});break}}
  }
  // ---- ten little mounds with a door in the side, low and quiet, each the way into a small dungeon ----
  const burrows=[];
  for(let k=0;k<BURROW_N;k++){
    const yy=[134,122,110,98,88,78,66,54,42,30][k];
    for(let t=0;t<160;t++){
      const c=Math.round(rdCentre(yy)),hw=rdHalf(yy)-4,side=(k+t)%2?1:-1;
      const x=clamp(Math.round(c+side*hw*(.25+.6*R(k,t,80))),5,W-6),y=yy+((R(k,t,81)*14)|0)-7;
      if(!open[idx(x,y)]||bandWide(x,y)||rdBiome(x,y)<.34||burrows.some(b=>Math.hypot(b.x-x,b.y-y)<14))continue;
      let clear=true;for(let dy=-2;dy<=2&&clear;dy++)for(let dx=-2;dx<=2;dx++)if(!open[idx(x+dx,y+dy)])clear=false;
      if(!clear)continue;
      for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(Math.abs(d.x-x)<=1&&d.y>=y-1&&d.y<=y+2){occ.delete(d.x+','+d.y);decor.splice(i,1)}}
      put('dburrow',x,y,{block:true,enter:{to:BURROW_BASE+k,x:BURROW_START.x,y:BURROW_START.y,f:BURROW_START.f}});
      burrows.push({x,y});break;
    }
  }
  // ---- the creatures ----
  const enemies=[];
  const free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&open[idx(x,y)]&&!occ.has(x+','+y)&&!enemies.some(e=>e.x===x&&e.y===y);
  const spawn=(t,x,y,lvl)=>{if(free(x,y))enemies.push({t,x,y,lvl})};
  // creatures live in camps with open sand between them, not scattered everywhere
  const camp=(t,cx,cy,n,lvl,spread)=>{let placed=0;for(let k=0;k<n*8&&placed<n;k++){const x=cx+Math.round((R(cx,cy,100+k)*2-1)*spread),y=cy+Math.round((R(cx,cy,160+k)*2-1)*spread);if(free(x,y)){enemies.push({t:typeof t==='function'?t(x,y):t,x,y,lvl});placed++}}};
  for(let gy=0;gy<H;gy+=24)for(let gx=0;gx<W;gx+=24){
    const x=gx+4+((R(gx,gy,60)*16)|0),y=gy+4+((R(gx,gy,61)*16)|0);if(!open[idx(x,y)])continue;
    if(y>RD.CY-30)continue; // the first stretch out of Anaea is quiet
    const b=rdBiome(x,y),r=R(gx,gy,62);
    if(r>.5)continue; // many stretches of the road are empty
    if(b>.58&&r<.18)camp('scorpion',x,y,5,15,3);
    else if(b>.4&&r<.34)camp('dwolf',x,y,4,14,3);
    else if(b>.45)camp('nomad',x,y,4,14,3);
  }
  // ---- things to pick up ----
  const items=[];
  for(let k=0;k<14;k++)for(let t=0;t<20;t++){const x=3+((R(k,t,70)*(W-6))|0),y=20+((R(k,t,71)*180)|0);if(free(x,y)&&!enemies.some(e=>Math.abs(e.x-x)+Math.abs(e.y-y)<4)){items.push({k:'potion',x,y});break}}
  return {rows,fm,decor,scen,enemies,items,start:{x:2,y:RD.CY,f:1},cxN,burrows};
}
const SANDROAD=buildSandRoad();
const LEVEL41_DATA={rows:SANDROAD.rows,start:SANDROAD.start,enemies:SANDROAD.enemies,items:SANDROAD.items,decor:SANDROAD.decor,scenery:SANDROAD.scen,fmap:SANDROAD.fm,outdoor:true,day:.97,floor:'lush',
  floorSet:['lush','trail','dgrass','scrub','sand','sandpath'],ceil:'cloud',noExtras:true,name:'The Sand Road',label:'Sand Road',diff:15,
  portals:[{to:33,x:48,y:18,f:3,tex:'tgate'},{to:42,x:0,y:0,f:0,tex:'tomb',req:'tombOpen',lock:'Drifts of sand have sealed the gate. (The tomb is still being dug out.)'}],trailChars:'1'}; // the tomb's arrival and its unsealing are set once it is built
LEVELS[41]=LEVEL41_DATA;
