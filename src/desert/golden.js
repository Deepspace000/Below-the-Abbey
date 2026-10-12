/* ==========================================================================
   THE GOLDEN ERG (level 61) and THE VIOLET ERG (level 62): two huge deserts, 300 by 300 cells each, in great swells of
   sand and ringed by mountains. The Blue Dunes lead east into the Golden Erg through a low cave; the Golden Erg leads
   south into the Violet Erg through a second one. Each has three small oases, rings of old ruins, bones, and a lot of
   creatures a long way apart.
   ========================================================================== */
const GER={W:300,H:300,CY:150,CX:150,OASES:[[70,70],[225,95],[140,225]]};
const VER={W:300,H:300,CY:150,CX:150,OASES:[[80,215],[230,200],[150,80]]};
const FLR={W:250,H:250,CY:125,CX:125,OASES:[[70,70],[180,170]]};
const WER={W:250,H:250,CY:125,CX:125,OASES:[[60,60],[190,80],[125,170]]};
function buildErg(E,seed,rk){
  const W=E.W,H=E.H,rows=[],fm=[],R=(x,y,k)=>hash2(x,y,k+seed);
  const od=(x,y)=>{let m=1e9;for(const [ox,oy] of E.OASES)m=Math.min(m,Math.hypot(x-ox,(y-oy)*1.1));return m};
  for(let y=0;y<H;y++){let row='',fr='';for(let x=0;x<W;x++){
    if(x===0||y===0||x===W-1||y===H-1){row+='D';fr+='0';continue}
    row+='.';const d=od(x,y);
    fr+=d<=2.4?'4':d<=4.6?'3':(R(x>>3,y>>3,5)<.3?'1':R(x>>4,y>>4,6)<.25?'2':'0');
  }rows.push(row);fm.push(fr)}
  const decor=[],scen=[],items=[],enemies=[],taken=new Set();
  const sc=(k,x,y,o)=>scen.push(Object.assign({k,wx:x+.5+((o&&o.ox)||0),wy:y+.5+((o&&o.oy)||0),sc:(o&&o.sc)||1,decor:{k,walk:true,x,y}}));
  const put=(k,x,y,o)=>{taken.add(x+','+y);decor.push(Object.assign({k,x,y,block:false},o||{}))};
  const inland=(x,y)=>x>16&&y>16&&x<W-17&&y<H-17&&Math.abs(y-E.CY)+(x<30?0:99)>14&&od(x,y)>9;
  E.OASES.forEach(([cx,cy],n)=>{ // a ring of reeds, palms and shrubs, and food and water beside the pool
    for(let a=0;a<14;a+=2){const r=2.9+R(a,n,40)*.5;sc('greeds',Math.round(cx+Math.cos(a/14*TAU)*r),Math.round(cy+Math.sin(a/14*TAU)*r*.9),{sc:.8+R(a,n,41)*.5})}
    for(let a=0;a<6;a++){const r=5.6+R(a,n,42)*1.1;put('dpalm'+((a+n)%4),Math.round(cx+Math.cos(a/6*TAU+.3)*r),Math.round(cy+Math.sin(a/6*TAU+.3)*r*.9),{block:true,sc:.9+R(a,n,43)*.35})}
    for(let a=0;a<7;a++){const r=4.8+R(a,n,44)*2.4;sc('dshrub'+(a%3),Math.round(cx+Math.cos(a*1.9)*r),Math.round(cy+Math.sin(a*1.9)*r*.9),{ox:(R(a,n,45)-.5)*.6,oy:(R(a,n,46)-.5)*.6,sc:.8+R(a,n,47)*.5})}
    [[0,-4.4,'dates'],[2.4,-4,'water'],[-2.6,-3.9,'dates'],[4.2,-1.6,'water'],[-4.3,-1.2,'dates'],[1.6,4.4,'water'],[-1.9,4.3,n?'apple':'bread']].forEach(([dx,dy,k])=>items.push({k,x:Math.round(cx+dx),y:Math.round(cy+dy)}));
  });
  for(let y=18;y<H-18;y+=2)for(let x=18;x<W-18;x+=2){ // the empty land
    if(!inland(x,y))continue;const r=R(x,y,20),ox=(R(x,y,3)-.5)*1.4,oy=(R(x,y,4)-.5)*1.4;
    if(r<.02)put('drock'+((R(x,y,21)*3)|0),x,y,{block:true,sc:.9+R(x,y,22)*.7});
    else if(r<.04)sc('dcactus',x,y,{ox,oy,sc:.8+R(x,y,23)*.6});
    else if(r<.055)sc('ddead',x,y,{ox,oy,sc:.8+R(x,y,24)*.5});
    else if(r<.075)sc('dbones',x,y,{ox,oy,sc:.8+R(x,y,25)*.5});
    else if(r<.1)sc('dshrub'+((R(x,y,26)*3)|0),x,y,{ox,oy,sc:.7+R(x,y,27)*.5});
  }
  const ruins=[];for(let i=0;i<11;i++)ruins.push([30+((R(i,1,90)*(W-60))|0),30+((R(i,2,90)*(H-60))|0)]);
  ruins.forEach(([cx,cy],n)=>{ // old ruins in rings, one chest or a pile of plain gold inside
    if(od(cx,cy)<14||(cx<40&&Math.abs(cy-E.CY)<20))return;
    for(let a=0;a<8;a++){const x=Math.round(cx+Math.cos(a/8*TAU)*4),y=Math.round(cy+Math.sin(a/8*TAU)*4);if(a%2||n%3===0)put('dpillar'+(a%2),x,y,{block:true})}
    if(n%2===0)put('chest',cx,cy,{block:true,magic:DS_MAGIC_TOMB[(n*5+seed)%DS_MAGIC_TOMB.length],goldAmt:380+n*30});
    else put('treasure',cx,cy,{block:true,plain:true});
    items.push({k:'potion',x:cx+2,y:cy+1});
  });
  const camp=(t,x,y,n,lvl)=>{let p=0;for(let k=0;k<n*10&&p<n;k++){const ex=x+Math.round((R(x,y,100+k)*2-1)*4),ey=y+Math.round((R(x,y,160+k)*2-1)*4);if(!taken.has(ex+','+ey)&&!enemies.some(e=>e.x===ex&&e.y===ey)&&!items.some(i=>i.x===ex&&i.y===ey)&&ex>14&&ey>14&&ex<W-15&&ey<H-15&&od(ex,ey)>8){enemies.push({t,x:ex,y:ey,lvl});p++}}};
  const T=['scorpion','dwolf','vulture','nomad','mummy','scorpion'];
  for(let gy=0;gy<5;gy++)for(let gx=0;gx<5;gx++){const x=36+gx*57+((R(gx,gy,7)-.5)*24|0),y=36+gy*57+((R(gx,gy,8)-.5)*24|0);if(x<50&&Math.abs(y-E.CY)<30)continue;camp(T[(gx+gy*2+((R(gx,gy,9)*3)|0))%6],x,y,2+((R(gx,gy,10)*2)|0),rk+((R(gx,gy,11)*3)|0))}
  return {rows,fm,decor,scen,enemies,items};
}
const GOLDEN=buildErg(GER,0,17),VIOLET=buildErg(VER,500,20),WHITE=buildErg(WER,900,16),FLAT=buildErg(FLR,1300,18);
FLAT.start={x:FLR.W-3,y:FLR.CY,f:3};WHITE.start={x:WER.CX,y:WER.H-3,f:0};GOLDEN.start={x:2,y:GER.CY,f:1};VIOLET.start={x:VER.CX,y:2,f:2};
const erdata=(B,name,label,diff,floors)=>({rows:B.rows,start:B.start,enemies:B.enemies,items:B.items,decor:B.decor,scenery:B.scen,fmap:B.fm,outdoor:true,day:1,floor:floors[0],
  floorSet:floors.concat(['bluegrass','bluewater']),ceil:'cloud',noExtras:true,name,label,diff});
const LEVEL61_DATA=erdata(GOLDEN,'The Golden Erg','Golden Erg',18,['goldsand','goldsand2','goldsand3']);
const LEVEL62_DATA=erdata(VIOLET,'The Violet Erg','Violet Erg',21,['vioSand','vioSand2','vioSand3']);
// the doors: Blue Dunes east wall -> Golden Erg west wall; Golden Erg south wall -> Violet Erg north wall
LEVEL60_DATA.rows[BDN.OY]=LEVEL60_DATA.rows[BDN.OY].slice(0,BDN.W-1)+'1';
LEVEL60_DATA.portals[1]={to:61,x:2,y:GER.CY,f:1,tex:'bluecave'};
LEVEL61_DATA.rows[GER.CY]='0'+LEVEL61_DATA.rows[GER.CY].slice(1);
LEVEL61_DATA.rows[GER.H-1]=LEVEL61_DATA.rows[GER.H-1].slice(0,GER.CX)+'1'+LEVEL61_DATA.rows[GER.H-1].slice(GER.CX+1);
LEVEL61_DATA.portals=[{to:60,x:BDN.W-3,y:BDN.OY,f:3,tex:'bluecave'},{to:62,x:VER.CX,y:2,f:2,tex:'bluecave'}];
LEVEL62_DATA.rows[0]=LEVEL62_DATA.rows[0].slice(0,VER.CX)+'0'+LEVEL62_DATA.rows[0].slice(VER.CX+1);
LEVEL62_DATA.portals=[{to:61,x:GER.CX,y:GER.H-3,f:0,tex:'bluecave'}];
const LEVEL63_DATA=erdata(WHITE,'The White Dunes','White Dunes',17,['whiteSand','whiteSand2','whiteSand3']);
// the White Dunes lie north of the Blue Dunes: a low cave in the Blue Dunes' north wall leads to their south wall
LEVEL60_DATA.rows[0]=LEVEL60_DATA.rows[0].slice(0,BDN.OX)+'2'+LEVEL60_DATA.rows[0].slice(BDN.OX+1);
LEVEL60_DATA.portals[2]={to:63,x:WER.CX,y:WER.H-3,f:0,tex:'bluecave'};
LEVEL63_DATA.rows[WER.H-1]=LEVEL63_DATA.rows[WER.H-1].slice(0,WER.CX)+'0'+LEVEL63_DATA.rows[WER.H-1].slice(WER.CX+1);
LEVEL63_DATA.portals=[{to:60,x:BDN.OX,y:2,f:2,tex:'bluecave'}];
const LEVEL64_DATA=erdata(FLAT,'The Flatlands','Flatlands',18,['pebA','pebB','pebC']);
// the Flatlands lie west of the White Dunes: a low cave in the White Dunes' west wall leads to their east wall
LEVEL63_DATA.rows[WER.CY]=LEVEL63_DATA.rows[WER.CY].slice(0,0)+'1'+LEVEL63_DATA.rows[WER.CY].slice(1);
LEVEL63_DATA.portals[1]={to:64,x:FLR.W-3,y:FLR.CY,f:3,tex:'bluecave'};
LEVEL64_DATA.rows[FLR.CY]=LEVEL64_DATA.rows[FLR.CY].slice(0,FLR.W-1)+'0';
LEVEL64_DATA.portals=[{to:63,x:2,y:WER.CY,f:1,tex:'bluecave'}];
LEVELS[64]=LEVEL64_DATA;LEVEL_NAMES[64]=LEVEL64_DATA.name;
LEVELS[63]=LEVEL63_DATA;LEVEL_NAMES[63]=LEVEL63_DATA.name;
LEVELS[61]=LEVEL61_DATA;LEVEL_NAMES[61]=LEVEL61_DATA.name;LEVELS[62]=LEVEL62_DATA;LEVEL_NAMES[62]=LEVEL62_DATA.name;
function makeGoldenArt(ydune,ycl){
  FLOORS.goldsand=dsRidges([246,208,64],[222,176,34],3,1,401);
  FLOORS.goldsand2=dsRidges([244,205,60],[220,172,30],4,-1,411);
  FLOORS.goldsand3=dsRidges([248,211,70],[224,180,40],3,-2,421);
  FLOORS.vioSand=dsRidges([186,146,236],[146,104,206],3,1,431);
  FLOORS.vioSand2=dsRidges([180,140,230],[140,98,200],4,-1,441);
  FLOORS.vioSand3=dsRidges([192,152,240],[152,110,212],3,-2,451);
  FLOORS.whiteSand=dsRidges([252,252,254],[216,224,238],3,1,501);
  FLOORS.whiteSand2=dsRidges([250,251,254],[212,221,236],4,-1,511);
  FLOORS.whiteSand3=dsRidges([254,254,255],[220,228,240],3,-2,521);
  FLOORS.pebA=dsPebbles(0,.05,601);FLOORS.pebB=dsPebbles(1,.07,611);FLOORS.pebC=dsPebbles(2,.04,621);
  LEVEL64_DATA.chars={D:ydune,C:ycl};
  LEVEL63_DATA.chars={D:ydune,C:ycl};
  LEVEL61_DATA.chars={D:ydune,C:ycl};LEVEL62_DATA.chars={D:ydune,C:ycl};
}
// smooth wind ridges and nothing else: a long crest with a gentle windward side and a short lee side, no grains or specks
function dsRidges(light,shade,n,tilt,seed){
  return dsFloor((x,y)=>{
    const w=dsNoise(x,y,2,seed)*.9+dsNoise(x,y,4,seed+1)*.25;                 // slow bends in the crest lines
    const t=((n*(x+tilt*y)/TS+w*.6)%1+1)%1;
    const p=t<.72?Math.pow(t/.72,1.4):Math.pow(1-(t-.72)/.28,1.2);            // slow rise, quicker fall
    const k=.9+.1*p;
    return [shade[0]+(light[0]-shade[0])*p,shade[1]+(light[1]-shade[1])*p,shade[2]+(light[2]-shade[2])*p].map(v=>v*(k+.0));
  });
}
// perfectly level ground: pale sand strewn with tiny pebbles, no ridges and no hollows
function dsPebbles(v,dens,seed){
  const base=[[214,192,150],[208,186,146],[218,196,156]][v];
  return dsFloor((x,y)=>{
    const n=dsNoise(x,y,4,seed)*.5+dsNoise(x,y,8,seed+1)*.5,k=.97+.06*(n-.5);
    let c=[base[0]*k,base[1]*k,base[2]*k];
    // each pebble is a little disc, one to two texels wide, in greys and browns
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const px=((x+dx)%TS+TS)%TS,py=((y+dy)%TS+TS)%TS,h=hash2(px,py,seed+7);
      if(h<dens){const r=h<dens*.25?1.3:.8,ox=(hash2(px,py,seed+8)-.5)*.6,oy=(hash2(px,py,seed+9)-.5)*.6;
        if(Math.hypot(dx-ox,dy-oy)<r){const t=hash2(px,py,seed+10),tone=t<.4?[132,122,110]:t<.7?[160,140,112]:[104,92,80],lit=dy<0||dx<0?1.12:.9;c=[tone[0]*lit,tone[1]*lit,tone[2]*lit]}}
    }
    return c;
  });
}

// vultures wheel over the older deserts too: a few singly or in pairs, well away from where you arrive
for(const [n,cnt] of [[41,8],[43,10],[60,6]]){
  const L=LEVELS[n],rows=L.rows,H=rows.length,W=rows[0].length;let p=0;
  for(let k=0;k<400&&p<cnt;k++){
    const x=12+((hash2(k,n,801)*(W-24))|0),y=12+((hash2(k,n,802)*(H-24))|0);
    if(n===41&&y>150)continue;
    if(rows[y][x]!=='.'||Math.hypot(x-L.start.x,y-L.start.y)<30)continue;
    if(L.enemies.some(e=>Math.abs(e.x-x)+Math.abs(e.y-y)<6)||L.items.some(i=>i.x===x&&i.y===y)||(L.decor||[]).some(d=>d.x===x&&d.y===y))continue;
    L.enemies.push({t:'vulture',x,y,lvl:n===60?16:n===43?15:14});p++;
  }
}
