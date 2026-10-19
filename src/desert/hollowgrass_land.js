/* ==========================================================================
   THE HOLLOW GRASSLANDS, part two: the grassland itself (level 470), its five villages, the creatures on the hills, and the way in from the Hollow Land.
   ========================================================================== */
function hgBuild(){
  if(LEVELS[HG.ID])return;
  if(typeof KH_READY!=='undefined'&&!KH_READY)return;
  ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors();
  const W=HG.W,H=HG.H,N=W*H,hs=hash2,sd=4701,I=(x,y)=>y*W+x,K=(x,y)=>x+','+y;
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  if(!IMG.hg_dark)IMG.hg_dark=mkCanvas(128,128,(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#0c110c');gr.addColorStop(1,'#1a2218');x.fillStyle=gr;x.fillRect(0,0,w,h);for(let i=0;i<260;i++){x.fillStyle=`rgba(${30+hash2(i,1,5)*30|0},${44+hash2(i,2,5)*34|0},${30+hash2(i,3,5)*24|0},.35)`;x.fillRect(hash2(i,4,5)*w,hash2(i,5,5)*h,2+hash2(i,6,5)*7,3+hash2(i,7,5)*12)}});
  OH_STY.hgrock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'hg_dark',win:'hg_dark',alt:'hg_dark',door:'hg_dark',zoom:1,contrast:1,tint:[255,255,255,0]});
  const rock=[ch(TM.make('plain','hgrock',5.4).gid)];
  const rows=[],fm=new Array(N).fill('0'),h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N);
  for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const decor=[],enemies=[],items=[],lights=[],used=new Set();
  const near=(x,y,list,r)=>list.some(p=>Math.hypot(x-p[0],y-p[1])<r);
  const towns=HG_TOWNS.map(t=>[t.x,t.y]),hives=HG_HIVE_AT,keepOut=[...towns,...hives,[HG.START.x,HG.START.y]];
  // the land: low rolling hills, flat round the villages, a rock wall all round
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=I(x,y);
    if(x<2||y<2||x>=W-2||y>=H-2){rows[y][x]=rock[0];block[i]=1;h[i]=.5;continue}
    let v=.3+tsmooth(x/17,y/17,sd)*.75+tsmooth(x/6,y/6,sd+3)*.16;
    for(const t of towns){const d=Math.hypot(x-t[0],y-t[1]);if(d<16)v=v*Math.max(0,(d-12)/4)+.38*(1-Math.max(0,(d-12)/4))}
    for(const p of [[HG.START.x,HG.START.y],...hives]){const d=Math.hypot(x-p[0],y-p[1]);if(d<7)v=v*Math.max(0,(d-4)/3)+.38*(1-Math.max(0,(d-4)/3))}
    h[i]=v;fm[i]=tsmooth(x/9,y/9,sd+7)>.72?'5':tsmooth(x/7,y/7,sd+9)>.7?'2':'0'}
  // the dirt tracks that join the villages and the hives
  const track=(a,b)=>{let x=a[0],y=a[1];const w=hs(a[0],b[1],sd+11);while(Math.abs(x-b[0])+Math.abs(y-b[1])>0){const dx=b[0]-x,dy=b[1]-y;if(dx!==0&&(dy===0||Math.abs(dx)>Math.abs(dy)*(.6+w)&&hs(x,y,sd+12)<.7))x+=Math.sign(dx);else y+=Math.sign(dy);
      for(const [ox,oy] of [[0,0],[1,0]]){const xx=x+ox;if(xx>2&&xx<W-3&&y>2&&y<H-3&&fm[I(xx,y)]!=='1')fm[I(xx,y)]='1'}}};
  const T=HG_TOWNS;track([HG.START.x,HG.START.y-3],[T[0].x,T[0].y+10]);track([T[0].x,T[0].y-10],[T[1].x+10,T[1].y]);track([T[0].x,T[0].y-10],[T[2].x-10,T[2].y]);track([T[1].x,T[1].y-10],[T[3].x,T[3].y+10]);track([T[2].x,T[2].y-10],[T[4].x,T[4].y+10]);track([T[3].x+10,T[3].y],[T[4].x-10,T[4].y]);
  hives.forEach((p,i)=>track([p[0],p[1]+3],[[T[1].x,T[1].y+10],[T[2].x,T[2].y+10],[T[0].x,T[0].y-10],[T[4].x,T[4].y-10]][i]));
  // the villages: a loose grid of lanes, white round houses between them, a spiked wooden fence all round with a gap at the north and the south
  const R=10;
  towns.forEach(([cx,cy],ti)=>{
    for(let d=-R;d<=R;d++)for(const l of [-5,0,5]){for(const [x,y] of [[cx+l,cy+d],[cx+d,cy+l]])if(x>2&&y>2&&x<W-3&&y<H-3)fm[I(x,y)]='1'}
    for(const [x,y] of [[cx,cy-R-1],[cx,cy-R-2],[cx,cy+R+1],[cx,cy+R+2]])fm[I(x,y)]='1';
    for(let t=-R;t<=R;t++)for(const [x,y,gap] of [[cx+t,cy-R,Math.abs(t)<=1],[cx+t,cy+R,Math.abs(t)<=1],[cx-R,cy+t,false],[cx+R,cy+t,false]]){if(gap)continue;used.add(K(x,y));decor.push({k:'hg_palisade',x,y,block:true,sc:1,ox:(hs(x,y,sd+20)-.5)*.3})}
    for(const [x,y] of [[cx-2,cy-R+1],[cx+2,cy-R+1],[cx-2,cy+R-1],[cx+2,cy+R-1]]){decor.push({k:'hg_lamp',x,y,block:false,walk:true,deco:true});lights.push([x,y]);used.add(K(x,y))}
    // houses in the blocks between the lanes, apart from the four round the little square
    for(const bx of [-8,-3,2,7])for(const by of [-8,-3,2,7]){
      if((bx===-3||bx===2)&&(by===-3||by===2))continue;
      if(hs(cx+bx,cy+by,sd+21)<.18)continue;const x=cx+bx,y=cy+by,k='hg_house'+((hs(x,y,sd+22)*3)|0);
      decor.push({k,x,y,block:true,ox:.5,sc:1+(hs(x,y,sd+23)-.5)*.12},{k,x:x+1,y,block:true,sc:.0001});used.add(K(x,y));used.add(K(x+1,y))}
    decor.push({k:'hg_arch',x:cx,y:cy-R,block:false,walk:true,deco:true},{k:'hg_arch',x:cx,y:cy+R,block:false,walk:true,deco:true},{k:'hg_pillar',x:cx-2,y:cy+2,block:true},{k:'hg_well',x:cx+2,y:cy+2,block:true});used.add(K(cx-2,cy+2));used.add(K(cx+2,cy+2));lights.push([cx+2,cy+2]);
    // the people of the village (see hollowgrass_talk.js), and the rest of the square
    try{hgPopulate(ti,cx,cy,decor,used)}catch(e){console.error(e)}
  });
  // the rocks on the low hills
  let nr=0;for(let t=0;t<900&&nr<46;t++){const x=6+((hs(t,1,sd+30)*(W-12))|0),y=6+((hs(t,2,sd+30)*(H-12))|0);
    if(used.has(K(x,y))||near(x,y,keepOut,18)||h[I(x,y)]<.7)continue;used.add(K(x,y));nr++;const pin=hs(x,y,sd+34)<.5;decor.push({k:pin?'hg_tower'+((hs(x,y,sd+35)*4)|0):'hg_rock'+(hs(x,y,sd+31)<.55?0:1),x,y,block:true,sc:pin?.8+hs(x,y,sd+32)*.5:.9+hs(x,y,sd+32)*.9,ox:(hs(x,y,sd+33)-.5)*.6})}
  // the insectivores: they sit on the hills and wait; the further from the start, the bigger
  const place=(t,x,y)=>{used.add(K(x,y));enemies.push({t,x,y})};
  let ni=0;for(let t=0;t<2600&&ni<80;t++){const x=6+((hs(t,3,sd+40)*(W-12))|0),y=6+((hs(t,4,sd+40)*(H-12))|0);
    if(used.has(K(x,y))||near(x,y,towns,17)||near(x,y,[[HG.START.x,HG.START.y]],14)||h[I(x,y)]<(t<1400?.78:.5))continue;
    const d=Math.hypot(x-HG.START.x,(y-HG.START.y)*.9),u=Math.pow(Math.min(1,Math.max(0,d/140+(hs(x,y,sd+41)-.5)*.35)),1.4),tier=Math.min(9,Math.floor(u*10));
    if(ni%9===8&&tier<8)continue;place('hgins'+tier,x,y);ni++}
  // by every hive entrance, a big one sits and guards it
  hives.forEach((p,i)=>{for(const [dx,dy] of [[-5,4],[5,4]]){const x=p[0]+dx,y=p[1]+dy;if(!used.has(K(x,y)))place('hgins'+(5+i),x,y)}});
  // swarms drift over the open grass
  let ns=0;for(let t=0;t<600&&ns<18;t++){const x=8+((hs(t,5,sd+50)*(W-16))|0),y=8+((hs(t,6,sd+50)*(H-16))|0);if(used.has(K(x,y))||near(x,y,keepOut,15))continue;place(ns%2?'hgswarm1':'hgswarm0',x,y);ns++}
  // the gentle frog-whales graze about and do no harm
  let nf=0;for(let t=0;t<600&&nf<30;t++){const x=6+((hs(t,7,sd+60)*(W-12))|0),y=6+((hs(t,8,sd+60)*(H-12))|0);if(used.has(K(x,y))||near(x,y,keepOut,10))continue;used.add(K(x,y));nf++;
    decor.push({k:'hg_frog'+(nf%2),x,y,block:true,npc:'hg_frogbeast',sc:.9+hs(x,y,sd+61)*.5,bob:.2})}
  // grass, bracken and things to pick
  const GR=['pgrass0','pgrass1','pgrass2','pgrass3'].filter(k=>IMG[k]);let ng=0;
  if(GR.length)for(let t=0;t<2400&&ng<760;t++){const x=3+((hs(t,9,sd+70)*(W-6))|0),y=3+((hs(t,10,sd+70)*(H-6))|0);if(used.has(K(x,y))||fm[I(x,y)]==='1')continue;ng++;
    decor.push({k:GR[(hs(x,y,sd+71)*GR.length)|0],x,y,block:false,walk:true,deco:true,sc:1+hs(x,y,sd+72)*1.5,ox:(hs(x,y,sd+73)-.5)*.8,oy:(hs(x,y,sd+74)-.5)*.8})}
  const pickable=(id,n,seed)=>{let c=0;for(let t=0;t<2000&&c<n;t++){const x=6+((hs(t,11,seed)*(W-12))|0),y=6+((hs(t,12,seed)*(H-12))|0);if(used.has(K(x,y))||near(x,y,towns,13)||fm[I(x,y)]==='1')continue;used.add(K(x,y));items.push({k:id,x,y});c++}};
  pickable('hgreed',36,sd+80);pickable('hgroot',30,sd+81);pickable('hgpond',14,sd+82);pickable('hgkelp',16,sd+83);pickable('hgegg',6,sd+84);
  // wax chests lie out in the grass here and there
  for(let t=0,c=0;t<800&&c<10;t++){const x=8+((hs(t,13,sd+90)*(W-16))|0),y=8+((hs(t,14,sd+90)*(H-16))|0);if(used.has(K(x,y))||near(x,y,towns,14)||near(x,y,[[HG.START.x,HG.START.y]],12))continue;used.add(K(x,y));c++;decor.push({k:['hg_chestweed','hg_chestwax','hg_chestjelly'][c%3],x,y,block:true})}
  // the hives
  hives.forEach((p,i)=>{decor.push({k:'hg_hive',x:p[0],y:p[1],block:true,enter:{to:HG.HIVES[i],x:0,y:0,f:0},sc:1.05});used.add(K(p[0],p[1]));lights.push([p[0],p[1]+2]);fm[I(p[0],p[1]+1)]='1';fm[I(p[0],p[1]+2)]='1'});
  // the gate in the south, back to the Hollow Land
  decor.push({k:'hg_gate',x:HG.START.x,y:HG.H-4,block:true,enter:{to:HL.CAV,x:61,y:57,f:3}});
  // the wizard, a little way up the track, who will come to meet the party (see hollowgrass_talk.js)
  decor.push({k:'hg_wizard',x:HG.START.x,y:HG.START.y-9,block:false,walk:true,npc:'hg_aldous0',sc:1,hgIntro:1});
  const fmap=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=fm[I(x,y)];fmap.push(r)}
    // tall strange towers stand all round the edge of the land, far off, fading into the mist
  const sky=[];for(let i=0;i<34;i++){const f=(i+hs(i,1,sd+95)*.6)/34*4,e=Math.floor(f),u=f-e,m=6+hs(i,2,sd+96)*6,x=e===0?3+u*(W-6):e===2?W-3-u*(W-6):e===1?W-m:m,y=e===0?m:e===2?H-m:e===1?3+u*(H-6):H-3-u*(H-6),k='hg_tower'+(hs(i,3,sd+97)<.4?(hs(i,4,sd+98)*4)|0:4+((hs(i,5,sd+99)*4)|0));sky.push({x,y,k,w:7+hs(i,6,sd+100)*9,z:0,big:1})}
  const lv={rows:rows.map(r=>r.join('')),start:{x:HG.START.x,y:HG.START.y,f:0},enemies,items,decor,scenery:[],sky,fmap,floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss','isleSandDk','wood'],floor:'ohMeadow',ceil:'cloud',
    day:.16,outdoor:true,amb:.5,name:LEVEL_NAMES[HG.ID],label:'The Hollow Grasslands',noExtras:true,diff:HG.DIFF,ceilH:5.2,chars,lights,portals:[],noTele:true,
    mapNames:[...HG_TOWNS.map(t=>({t:t.n,x:t.x,y:t.y-R-2,k:'place'})),...HG_HIVE_NAMES.map((n,i)=>({t:n,x:HG_HIVE_AT[i][0],y:HG_HIVE_AT[i][1]-3,k:'place'}))]};
  LEVELS[HG.ID]=lv;TERRS[HG.ID]=yarTerrain(W,H,h,rk,block);
  // the doors of the hives know where they stand
  hives.forEach((p,i)=>{hgHive(i);const hv=LEVELS[HG.HIVES[i]],d=decor.find(q=>q.enter&&q.k==='hg_hive'&&q.x===p[0]&&q.y===p[1]);if(d){d.enter.x=hv.start.x;d.enter.y=hv.start.y;d.enter.f=0}});
}
KH_LAZY[HG.ID]=hgBuild;HG.HIVES.forEach((id,i)=>{KH_LAZY[id]=()=>{hgBuild();hgHive(i)}});
/* the way in: a spiked gate at the east end of the high ledge in the Hollow Land. The grassland is built the first time the ledge is, so the gate opens at once. */
{const _hc=hlCavern;hlCavern=function(){_hc.apply(this,arguments);const L=LEVELS[HL.CAV];if(L&&!L._hg){L._hg=1;L.decor.push({k:'hg_gate',x:63,y:57,block:true,enter:{to:HG.ID,x:HG.START.x,y:HG.START.y,f:0}});L.mapNames.push({t:'The Gate to the Grasslands',x:61,y:58,k:'lane'});try{hgBuild()}catch(e){console.error(e)}}}}
/* the cold: a blue-grey grade over the whole view, bands of mist drifting along the horizon, and a few pale motes of light that hang in the air */
{const _w=drawWeatherFx;drawWeatherFx=function(){_w.apply(this,arguments);if(LEVEL!==HG.ID)return;
  const t=G.time||0;ctx.save();
  ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.62;ctx.fillStyle='rgb(150,184,228)';ctx.fillRect(0,0,420,210);
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=1;ctx.fillStyle='rgba(60,92,134,.17)';ctx.fillRect(0,0,420,210);
  for(let i=0;i<5;i++){const y=88+i*10,a=.05+.03*Math.sin(t*.3+i),x=((t*(4+i*1.5)+i*97)%560)-130,g=ctx.createLinearGradient(x,0,x+340,0);
    g.addColorStop(0,'rgba(190,215,240,0)');g.addColorStop(.5,'rgba(190,215,240,'+(a*1.7).toFixed(3)+')');g.addColorStop(1,'rgba(190,215,240,0)');ctx.fillStyle=g;ctx.fillRect(x,y,340,8)}
  ctx.fillStyle='rgba(205,232,255,.5)';for(let i=0;i<26;i++){const x=((i*53+t*(3+i%4))%440)-10,y=70+((i*37)%120)+Math.sin(t*.7+i)*5,r=.7+(i%3)*.4;ctx.fillRect(x,y,r,r)}
  ctx.restore()}}
