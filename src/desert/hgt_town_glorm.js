/* ==========================================================================
   GLORM (level 483), the trading city of the Hollow Grasslands (prefix hgtxglorm). Interiors 4900 to 4919.
   Signature: THE GRAND BAZAAR STAIR, a colossal switchback stair-wall of six shop tiers rising out of the sunken Great Bazaar Court
   to a summit terrace with the Weighmaster's Spire. The court is the sunken counterpart; the Undercroft pit below it is the hidden part.
   Registration: HGTCITIES.glorm. Test link: ?town=glorm&lvl=34
   ========================================================================== */
var HGTCITIES=(typeof HGTCITIES==='undefined')?{}:HGTCITIES;
const HGTXG={ID:483,I0:4900,W:150,H:150,GATE:{x:75,y:148}};
HGTCITIES.glorm={level:483,key:'glorm',name:'Glorm',entry:{x:75,y:144,f:0},exitDoor:{x:75,y:148,face:2,to:470,at:{x:124,y:109,f:2}}};
LEVEL_NAMES[483]='Glorm';
const HGTXG_TINT={p:['hgt_wp','hgt_ww0','hgt_wb0','hgt_d0'],a:['hgt_wa','hgt_ww1','hgt_wb1','hgt_d1'],c:['hgt_wc','hgt_ww3','hgt_wb2','hgt_d3'],l:['hgt_wl','hgt_ww2','hgt_wb3','hgt_d2']};
const HGTXG_DECOR={'hgt_lamp':'hgt_lamppost','hgt_arch':'hg_arch','hgt_fountain':'hgt_fountain','hgt_chest':'chest','hgt_bench':'bench','hgt_urn':'hgt_chimney','hgt_spire':'hgt_finial'};
const HGTXG_PLANTS=['hgt_crystalgrass','hgt_fern','hgt_bulbflower','hgt_shellflower','hgt_pearlbush','hgt_mushrooms','hgt_lightvine','hgt_shrub','hgt_reeds','hgt_giantcap','hgt_crystalgrass','hgt_fern'];
/* the twenty interiors: [id, name, w, d, wall tint, floor, door note] (the rooms are filled in by hgtxglormRoom) */
const HGTXG_ROOMS={
 4900:{n:'The Weighmaster’s Hall',w:13,d:9,t:'c',fl:'hgt_f5',up:4901,deco:'hall'},
 4901:{n:'The Observatory',w:9,d:9,t:'l',fl:'hgt_f3',deco:'observatory'},
 4902:{n:'The Pearl Exchange',w:11,d:8,t:'p',fl:'hgt_f5',deco:'exchange'},
 4903:{n:'Sprell’s Bakery',w:9,d:7,t:'p',fl:'wood',deco:'bakery'},
 4904:{n:'The Carpet Loft',w:11,d:7,t:'a',fl:'wood',up:4905,deco:'carpets'},
 4905:{n:'The Carpet Store',w:7,d:7,t:'a',fl:'wood',deco:'store'},
 4906:{n:'Gruff’s Counting House',w:11,d:8,t:'c',fl:'hgt_f5',deco:'counting'},
 4907:{n:'The Map Room',w:9,d:7,t:'l',fl:'hgt_f0',deco:'maps'},
 4908:{n:'The Lantern Maker',w:9,d:7,t:'a',fl:'hgt_f0',deco:'lanterns'},
 4909:{n:'The Undercroft Vault',w:15,d:11,t:'a',fl:'hgt_f3',up:4910,deco:'vault'},
 4910:{n:'The Hidden Treasury',w:9,d:7,t:'l',fl:'hgt_f5',deco:'treasury'},
 4911:{n:'The Healer’s Cellar',w:9,d:7,t:'c',fl:'wood',deco:'healer'},
 4912:{n:'The Spice Cellar',w:11,d:7,t:'p',fl:'wood',deco:'spice'},
 4913:{n:'The Bell Founder',w:9,d:9,t:'p',fl:'hgt_f0',deco:'bells'},
 4914:{n:'The Glassblower’s Loft',w:9,d:7,t:'a',fl:'hgt_f3',deco:'glass'},
 4915:{n:'The Porters’ Rest',w:13,d:9,t:'c',fl:'wood',deco:'inn'},
 4916:{n:'The Lookout Keeper',w:7,d:7,t:'l',fl:'hgt_f5',deco:'keeper'},
 4917:{n:'The Reed Weavers’ House',w:9,d:7,t:'a',fl:'wood',deco:'weavers'},
 4918:{n:'The Brewer’s House',w:9,d:7,t:'p',fl:'wood',deco:'brewer'},
 4919:{n:'The Hidden Gallery',w:11,d:7,t:'l',fl:'hgt_f3',deco:'gallery'}};
for(const id in HGTXG_ROOMS)LEVEL_NAMES[id]=HGTXG_ROOMS[id].n;

/* the folk of Glorm besides the six quest givers: plain, literal lines (the language filter of the grasslands applies to all of them) */
hgMerchant('hgx_weigher','Weighmaster Brell','hg_npc5','I check every scale in Glorm. A scale that is wrong costs a trader a season.');
hgMerchant('hgx_lantern','Lantern seller','hg_npc1','Lanterns for the stairs. The upper tiers are dark and the steps are narrow.');
hgNative('hgx_porter1','Porter','hg_npc4',['I carry loads up the stair. Six tiers, and no lift.','The porters’ stair in the middle is steep but short. Most traders use the end stairs.']);
hgNative('hgx_porter2','Porter','hg_npc3',['I rest on the landings. The shops on every landing sell food.']);
hgNative('hgx_sweeper','Stair sweeper','hg_npc1',['Dust falls from the upper tiers onto the lower ones. I start at the top.']);
hgNative('hgx_lamper','Lamplighter','hg_npc0',['There are more lamps in Glorm than there are traders. I light them in order, from the gate to the summit.']);
hgNative('hgx_cartwright','Cartwright','hg_npc5',['The caravans arrive by the east road. The carts stay in the yard, the goods go up the stairs.']);
hgNative('hgx_clerk','Clerk of the court','hg_npc0',['The Great Bazaar Court is sunk three units below the street. The market has been held here since before the stairs were built.','Below the court there is a pit with a door. I have never seen it open.']);
hgNative('hgx_keeper','Lookout keeper','hg_npc4',['From the top of the spire you can see the whole city and the gate, and on a clear day the far hills.']);
hgNative('hgx_vault','Vault warden','hg_npc6',['The undercroft holds the guild’s old goods. Nobody is meant to be down here.']);
hgNative('hgx_baker2','Baker’s boy','hg_npc3',['The oven is hot. Keep back from it.']);
hgNative('hgx_innkeep','Porters’ innkeeper','hg_npc1',['Beds are full. Sit and eat if you like.']);
hgNative('hgx_weaver','Reed weaver','hg_npc1',['We weave the reed mats for the stalls. A good mat lasts twenty years.']);
hgNative('hgx_brewer','Brewer','hg_npc5',['Pond-water ale. It glows a little. That is normal.']);
hgNative('hgx_glass','Glassblower','hg_npc6',['Every lantern on the stair has glass from this loft.']);
hgNative('hgx_bell','Bell founder','hg_npc4',['A bell must be cast in one pour. The hall below is for the casting.']);
hgNative('hgx_cartog','Mapmaker','hg_npc0',['I draw the tracks between the five villages. The map of the grassland changes every year.']);
hgNative('hgx_pearl','Pearl dealer','hg_npc5',['Pearls from the deep ponds, graded by colour. Pink is common, aqua is rare.']);
hgNative('hgx_carpet','Carpet seller','hg_npc1',['Every carpet here was woven from pond reeds and dyed with cave moss.']);
hgNative('hgx_spice','Spice trader','hg_npc5',['Cellar spices keep better than shelf spices. The air below the street is cool.']);


/* wall pictures: the painted nacre tiles, stacked as hgt_art.js does, but richer in colour so the pearl survives the cold light of the cavern */
const HGTXG_BOOST='saturate(1.35) contrast(1.1) brightness(.98)';
function hgtxglormTile(name,wh,o){o=o||{};const pic=n=>hgtaPic(n||name),base=pic(o.base),mid=pic(o.mid),top=pic(o.top),units=Math.max(1,Math.ceil(wh)),Hp=Math.max(8,Math.round(128*wh));
  const c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#e8d8ea';x.fillRect(0,0,128,Hp);x.filter=o.boost||HGTXG_BOOST;
  for(let u=0;u<units;u++){const im=u===0?base:u===units-1&&units>1?top:mid;if(!im)continue;const part=wh-u<1?wh-u:1;
    x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
  const d=x.getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return gid}

HGTE.look[483]={hazeCol:[140,120,205],roofHaze:[70,60,130],ambient:.74,lamp:[1,.72,.42],haze:.26,hazeRate:.012,wallSat:1.3,floorGain:.85,riserGain:.9,motes:80};
function hgtxglormBuild(id){
  const W=HGTXG.W,H=HGTXG.H,B=hgtlNew(W,H,483),R=(a,b,k)=>hgtlR(B,a,b,k||0),I=(x,y)=>y*W+x;
  const G=HGTL.K,FL=new Uint8Array(W*H),RES=new Uint8Array(W*H),WS=new Array(W*H).fill(null);
  const cache={};
  const hq=wh=>wh<=3?Math.max(.5,Math.ceil(wh*5-1e-6)/5):Math.ceil(wh*2-1e-6)/2; // heights are rounded up (to a fifth below 3, to a half above) so that few wall pictures are needed
  /* wall pictures: the painted nacre tiles, stacked as hgt_art.js does, but a little brighter and richer in colour so the pearl survives the cold light of the cavern */
  const mkTile=hgtxglormTile;
  const wch=(t,kind,wh)=>{wh=hq(wh);const k=t+kind+wh;if(cache[k])return cache[k];const n=HGTXG_TINT[t];let gid;
    if(kind==='wmid')gid=wh<=1.2?mkTile(n[0],wh):mkTile(n[0],wh,{base:n[0],mid:n[1],top:n[2]});
    else if(kind==='win')gid=wh<=1.2?mkTile(n[1],wh):mkTile(n[0],wh,{base:n[1],mid:n[0],top:n[2]});
    else if(kind==='bandlow')gid=wh<=1.2?mkTile(n[2],wh):mkTile(n[0],wh,{base:n[2],mid:n[0],top:n[2]});
    else if(kind==='band')gid=mkTile(n[0],wh,{base:n[0],mid:n[0],top:n[2]});
    else if(kind==='winall')gid=mkTile(n[1],wh);
    else gid=mkTile(n[0],wh);
    return cache[k]=hgtaChar(gid)};
  const dch=(t,wh,lvl,at)=>{const n=HGTXG_TINT[t],gid=mkTile(n[0],wh,{base:n[3],mid:n[1],top:n[2]});KH_DOOR[gid]={lvl,at};return hgtaChar(gid)};
  const ground=(x,y)=>hgtlH(B,x,y),isO=(x,y)=>hgtlIsOpen(B,x,y),inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  /* a wall column is recorded and made at the end: its foot is the lowest open ground beside it, so nothing ever hangs in the air */
  const wall=(x,y,t,kind,foot,top,o)=>{if(!inb(x,y))return;WS[I(x,y)]=Object.assign({t,kind,top,foot,door:null},o||{});hgtlWall(B,x,y,'#',foot===undefined?ground(x,y):foot);RES[I(x,y)]=1};
  const open=(x,y,h,k,fl)=>{if(!inb(x,y))return;WS[I(x,y)]=null;hgtlOpen(B,x,y,h,k);if(fl!==undefined)FL[I(x,y)]=fl};
  const TS='pacl',tn=(a,b)=>TS[(R(a,b,3)*4)|0];
  const lamp=(x,y)=>{if(!isO(x,y)||B.occ.has(x+','+y))return;B.occ.add(x+','+y);hgtlDecor(B,'hgt_lamppost',x,y,{block:false,walk:true,deco:true});hgtlLight(B,x,y)};
  const plant=(x,y,sc,lp,k)=>{if(!isO(x,y)||B.occ.has(x+','+y))return;hgtlDecor(B,k||HGTXG_PLANTS[(R(x,y,41)*HGTXG_PLANTS.length)|0],x,y,{block:false,walk:true,deco:true,sc:sc||(.8+R(x,y,42)*1.1),ox:(R(x,y,43)-.5)*.6,oy:(R(x,y,44)-.5)*.6});if(R(x,y,45)<(lp===undefined?.3:lp))hgtlLight(B,x,y)};
  const prop=(k,x,y,o)=>{if(!isO(x,y)||B.occ.has(x+','+y))return false;B.occ.add(x+','+y);hgtlDecor(B,k,x,y,Object.assign({block:true},o||{}));return true};
  const deco=(k,x,y,o)=>{if(!isO(x,y))return;hgtlDecor(B,k,x,y,Object.assign({block:false,walk:true,deco:true},o||{}))};
  const light=(x,y)=>hgtlLight(B,x,y);
  const free=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!inb(x,y)||RES[I(x,y)]||!isO(x,y)||Math.abs(ground(x,y))>.01)return false}return true};
  const reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inb(x,y))RES[I(x,y)]=1};
  /* the paving, a little richer in colour than the painted floors */
  const bf=hgtxglormFloor;
  const ROOMS=HGTXG_ROOMS,doorsOut=[],NPCS=[];
  /* an enterable door: wall cell (x,y), tint t, from foot to top, facing face; the party arrives in the room facing north */
  const door=(x,y,t,foot,top,face,rid,name)=>{const r=ROOMS[rid];WS[I(x,y)]={t,kind:'door',top,foot,fixed:true,door:{lvl:rid,at:{x:r.w>>1,y:r.d-2,f:0}}};hgtlWall(B,x,y,'#',foot);RES[I(x,y)]=1;
    const d=HGTL.DIRS[face&3];B.doors.push({x,y,face:face&3,ax:x+d[0],ay:y+d[1],to:rid});doorsOut.push({id:rid,x,y,face:face&3,ax:x+d[0],ay:y+d[1],name:name||r.n,foot})};
  const linkDoor=(x,y,t,foot,top,face,lvl,at,name)=>{WS[I(x,y)]={t,kind:'door',top,foot,fixed:true,door:{lvl,at}};hgtlWall(B,x,y,'#',foot);RES[I(x,y)]=1;const d=HGTL.DIRS[face&3];B.doors.push({x,y,face:face&3,ax:x+d[0],ay:y+d[1],to:lvl});doorsOut.push({id:lvl,x,y,face:face&3,ax:x+d[0],ay:y+d[1],name,foot})};
  const named=(t,x,y,k)=>hgtlName(B,x,y,t,k||'place');
  const npc=(k,x,y,id,sc)=>{if(!isO(x,y))return;B.occ.add(x+','+y);hgtlDecor(B,k,x,y,{block:false,walk:true,npc:id,sc:sc||1})};
  /* ---------- the border: a tall pearl wall two cells thick ---------- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<2||y<2||x>=W-2||y>=H-2)wall(x,y,TS[((x>>3)+(y>>3))&3],'win',0,9+((R(x>>2,y>>2,5)*2)|0));
  /* ---------- the Great Bazaar Court: sunk 3 units, with galleries rising round it ---------- */
  const CD=3.6,CX0=22,CX1=127,CY0=59,CY1=118,FX0=34,FX1=115,FY1=106;
  for(let y=CY0;y<=CY1;y++)for(let x=CX0;x<=CX1;x++){
    if(y<65&&x>=FX0&&x<=FX1){RES[I(x,y)]=1;B.h[I(x,y)]=-CD;continue}
    const d=Math.max(FX0-x,x-FX1,y-FY1,0);open(x,y,-CD+.3*d,d?G.TERRACE:G.COURT,2);RES[I(x,y)]=1}
  for(let x=CX0;x<=CX0+11;x++)for(const xx of [x,CX1-(x-CX0)])wall(xx,CY0-1,TS[(xx>>2)&3],'band',0,2.2);
  /* ---------- THE GRAND BAZAAR STAIR: six tiers of shops, stairs at alternate ends, a porters' stair up the middle ---------- */
  const XW=t=>34+3*t,XE=t=>115-3*t,HT=t=>-CD+1.8*t,WT=t=>65-9*t;
  const shopList=[];
  for(let t=0;t<=5;t++){
    const h=HT(t),wt=WT(t),x0=XW(t),x1=XE(t);
    if(t>0)for(let y=wt;y<=wt+2;y++)for(let x=x0;x<=x1;x++){open(x,y,h,G.PLAT,3);RES[I(x,y)]=1}
    for(let y=wt;y<=wt+2;y++)for(const x of [x0-1,x1+1]){if(t===2&&y===wt+1)continue;wall(x,y,TS[(t+y)&3],'band',undefined,h+1.3)}
    const wl=XW(t+1),we=XE(t+1),sw=5,west=t%2===0,sx0=west?wl:we-sw+1,flankTop=HT(t+1)+2.4;
    for(let y=wt-6;y<=wt-1;y++){
      for(let x=x0;x<wl;x++)wall(x,y,TS[(x+t)&3],'win',undefined,flankTop);
      for(let x=we+1;x<=x1;x++)wall(x,y,TS[(x+t+1)&3],'win',undefined,flankTop)}
    for(let k=1;k<=6;k++)for(let x=sx0;x<sx0+sw;x++){open(x,wt-k,h+.3*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[sx0+2,wt-1-k]),h0:h,rise:.3,kind:'tier'});
    const pc=74;for(let k=1;k<=6;k++)for(const x of [pc,pc+1]){open(x,wt-k,h+.3*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[pc,wt-1-k]),h0:h,rise:.3,kind:'porters'});
    const spans=west?[[sx0+sw,pc-2],[pc+3,we]]:[[wl,pc-2],[pc+3,sx0-1]];
    for(let y=wt-6;y<=wt-1;y++)for(const x of [pc-1,pc+2])wall(x,y,'c','band',h,h+2.6+((y+t)&1)*.4);
    for(const [a,b] of spans){let x=a,bi=0;
      while(x<=b){const bw=Math.min(b-x+1,5+((R(x,t,7)*3)|0));
        if(bw<3){for(let xx=x;xx<=b;xx++)for(let y=wt-6;y<=wt-1;y++)wall(xx,y,'c','band',h,h+1.1);break}
        const tint=TS[(bi+t+(x>>3))&3],sh=[2.6,3.4,3.0,4.2,3.6][((R(x,t,8)*5)|0)];
        for(let y=wt-4;y<=wt-1;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,((xx+y)&1)?'win':'bandlow',h,h+sh);
        for(let y=wt-6;y<=wt-5;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,'band',h,h+1.1+((R(xx,y,9)<.12)?2.4:0));
        if(bw>=5&&R(x,t,10)<.28){const th=h+7+((R(x,t,12)*5)|0);for(let y=wt-6;y<=wt-3;y++)for(let xx=x+1;xx<=x+bw-2;xx++)wall(xx,y,TS[(xx+t)&3],(y===wt-3||xx===x+1||xx===x+bw-2)?'win':'band',h,th-(((y===wt-6)&&(xx===x+1||xx===x+bw-2))?2.2:0))}
        shopList.push({x:x+(bw>>1),y:wt-1,t,tint,sh,h,bw,wt});
        x+=bw;bi++}}
    for(let x=x0+2;x<=x1-2;x+=7)lamp(x,wt+1+(((x>>3)&1)?1:0));
  }
  // the six shop doors, one on each tier, and the banners beside them
  const shopRoom=[4902,4903,4904,4906,4907,4908];
  for(let t=0;t<=5;t++){
    const cands=shopList.filter(s=>s.t===t&&s.bw>=5&&Math.abs(s.x-75)>8&&Math.abs(s.x-75)<30),s=cands[(t*3)%cands.length]||shopList.find(q=>q.t===t);
    door(s.x,s.y,s.tint,s.h,s.h+s.sh,2,shopRoom[t]);
    plant(s.x-1,s.wt+2,1.3,.6);plant(s.x+1,s.wt+2,1.3,.6);deco('hgt_banner',s.x-2,s.wt,{sc:.9});deco('hgt_banner',s.x+2,s.wt,{sc:.9})}
  /* ---------- the summit terrace, the Weighmaster's hall and the spire ---------- */
  const SH=HT(5)+1.8,SX0=52,SX1=97,SY0=2,SY1=13;
  for(let y=SY0;y<=SY1;y++)for(let x=SX0;x<=SX1;x++){open(x,y,SH,G.PLAT,3);RES[I(x,y)]=1}
  for(let y=SY0;y<=SY1+2;y++)for(const x of [SX0-1,SX1+1])wall(x,y,TS[y&3],'band',undefined,SH+1.3);
  // the Weighmaster's hall: a long low block on the west of the plateau
  for(let y=8;y<=12;y++)for(let x=55;x<=63;x++){const edge=y===8||y===12||x===55||x===63;wall(x,y,'c',edge?'win':'band',SH,SH+(edge?4.2:6.4))}
  door(59,12,'c',SH,SH+4.2,2,4900);
  // the spire: a spiral stair climbing inward round a tall core, the stair of the Hall of the Weighmaster
  /* ---------- helpers for towers ---------- */
  const stepTower=(cx,cy,half,tint,tops,round,base)=>{base=base||0;for(let dy=-half;dy<=half;dy++)for(let dx=-half;dx<=half;dx++){if(round&&dx*dx+dy*dy>(half+.5)*(half+.5)){wall(cx+dx,cy+dy,'c','band',undefined,base+4.2);continue}const r=half-Math.max(Math.abs(dx),Math.abs(dy)),top=tops[Math.min(r,tops.length-1)];wall(cx+dx,cy+dy,r===0?tint:TS[(r+(tint==='p'?1:0))&3],r===0||r===2?'wmid':'band',undefined,base+top)}};
  const ringCells=(cx,cy,d,mx)=>{const o=[],X=x=>cx+mx*(x-cx);for(let x=cx;x>=cx-d;x--)o.push([X(x),cy+d]);for(let y=cy+d-1;y>=cy-d;y--)o.push([X(cx-d),y]);for(let x=cx-d+1;x<=cx+d;x++)o.push([X(x),cy-d]);for(let y=cy-d+1;y<=cy+d;y++)o.push([X(cx+d),y]);for(let x=cx+d-1;x>cx;x--)o.push([X(x),cy+d]);return o};
  /* a stall tower: a stepped round tower with a stair winding once round it (21 cells, up to 5.25), a door in the tower wall halfway up the north side, a pad at the top end.
     mx 1: the stair winds clockwise (starts south middle, ends north-east); mx -1: the mirror. Returns the cells. */
  const stallTower=(cx,cy,mx,tint,rid,tops)=>{
    reserve(cx-5,cy-6,cx+5,cy+5);
    stepTower(cx,cy,3,tint,tops||[5,7,9.5,12.5],true);
    const rc=ringCells(cx,cy,4,mx),cells=[];let h=0;
    for(let i=0;i<21;i++){h+=.25;open(rc[i][0],rc[i][1],h,G.STAIR,1);cells.push([rc[i][0],rc[i][1]])}
    B.stairs.push({cells,h0:0,rise:.25,kind:'stall'});
    const dc=rc[16],hd=ground(dc[0],dc[1]);
    if(rid)door(dc[0],dc[1]+1,tint,hd,hd+2.8,0,rid);
    return {cells,end:rc[20],mid:rc[12],pad:null}};
  /* the pad at the end of a stall tower stair, and a sky bridge from it to the stair of the next tower (cells to the next tower's corner) */
  const padAt=(x0,y0,mx,h)=>{for(let j=0;j<3;j++)for(let i=0;i<3;i++)open(x0+mx*i,y0+j,h,G.PLAT,3)};
  const skyBridge=(xa,xb,y,ha,hb)=>{const n=Math.abs(xb-xa)+1,sx=Math.sign(xb-xa),cells=[];for(let i=0;i<n;i++){const x=xa+sx*i,hh=ha+(hb-ha)*(i+1)/(n+1);open(x,y,hh,G.BRIDGE,3);cells.push([x,y]);RES[I(x,y)]=1}B.stairs.push({cells,h0:ha,rise:(hb-ha)/(n+1),kind:'bridge'});return cells};
  /* spiral tower of the library, with a tall core and a door at the top end */
  const spiralTower=(x,y,size,h0,rise,tint,rid,coreTop,wallTint)=>{
    const wc=wch(wallTint||'c','band',2.5),sp=hgtlSpiralStairs(B,x,y,size,h0,rise,{gap:1,wall:wc});
    for(let j=y;j<y+size;j++)for(let i=x;i<x+size;i++){RES[I(i,j)]=1;if(!isO(i,j))WS[I(i,j)]={t:wallTint||'c',kind:'band',top:B.h[I(i,j)]+2.5,foot:B.h[I(i,j)],fixed:true,door:null,pre:true}}
    for(const k of sp.cellH.keys()){const [cx,cy]=k.split(',').map(Number);FL[I(cx,cy)]=1}
    const mx=x+(size>>1),my=y+(size>>1);
    for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const px=mx+i,py=my+j;if(!inb(px,py)||isO(px,py))continue;const cd=Math.max(Math.abs(i),Math.abs(j));
      wall(px,py,tint,cd<=1?'band':'wmid',B.h[I(px,py)],coreTop-cd*1.4,{fixed:true})}
    const e=sp.ends[0];let dr=null;
    if(rid)for(const dd of HGTL.DIRS){const nx=e[0]+dd[0],ny=e[1]+dd[1];if(inb(nx,ny)&&!isO(nx,ny)&&WS[I(nx,ny)]){const face=HGTL.DIRS.findIndex(q=>q[0]===-dd[0]&&q[1]===-dd[1]),hh=B.h[I(e[0],e[1])];door(nx,ny,tint,hh,hh+2.8,face,rid);dr=[nx,ny];break}}
    return {sp,top:sp.top,end:e,door:dr}};
  /* ---------- the summit spire ---------- */
  const spire=spiralTower(69,2,12,SH,.14,'l',4916,SH+9,'c');
  lamp(66,8);lamp(66,12);lamp(84,8);lamp(84,12);
  for(let x=54;x<=96;x+=3){if(x>=67&&x<=82)continue;plant(x,3,1.3,.5);plant(x,13,1.1,.3)}
  for(let x=64;x<=66;x++)for(let y=3;y<=7;y++)if(R(x,y,50)<.5)plant(x,y,1.4,.5);
  for(let x=83;x<=96;x++)for(let y=3;y<=11;y++)if(R(x,y,51)<.22)plant(x,y,null,.5);
  prop('hgt_obelisk',90,7,{sc:1.2});light(90,8);prop('hgt_fountain',60,5,{sc:1.2});light(60,6);
  npc('hg_npc0',65,13,'hgn_mowl');npc('hg_npc5',58,13,'hgx_weigher');npc('hg_npc6',92,12,'hgx_keeper');
  for(let y=2;y<=6;y++)for(let x=53;x<=57;x++){if(x===53||x===57||y===2||y===6){if(!(x===55&&y===6))wall(x,y,'l','wmid',SH,SH+2.8)}}
  prop('hg_chestjelly',55,4,{sc:.9});prop('hg_chestwax',54,3,{sc:.8});lamp(56,5);plant(54,5,1.3,.6);named('Weighers’ closet',55,4,'small');
  named('The Weighmaster’s Spire',75,8,'place');
  /* ---------- the two sky bridges from the summit down to the tower stalls, with the two stall tower rows ---------- */
  const chain=(mx,cx0,cy,dx,rids,tints)=>{
    const towers=rids.map((r,i)=>stallTower(cx0+dx*i,cy,mx,tints[i],r));
    towers.forEach((tw,i)=>{const cx=cx0+dx*i,ex=cx+mx*5;padAt(ex,cy-5,mx,5.5);lamp(ex+mx,cy-5);lamp(ex+mx,cy-3);plant(ex+mx*2,cy-5,1.5,.6);plant(ex+mx*2,cy-3,1.5,.6);deco('hgt_banner',ex+mx*2,cy-4,{sc:1});
      if(i<towers.length-1){const nx=cx0+dx*(i+1),a=ex+mx*3,b=nx-mx*5;skyBridge(a,b,cy-4,5.5,3.25)}});
    return towers};
  const wt0=chain(1,9,14,18,[4913,4914],['p','a']);
  const et0=chain(-1,140,14,-18,[4917,4918],['c','l']);
  // the sky bridges to the summit: from the pad of the nearest tower on each side, a long flat causeway
  {const a=27+5+3,b=SX0-2; // west: pad ends at x=35?  (cx+5..cx+7 = 32..34); the bridge starts at 35
    skyBridge(35,50,10,5.5,SH);open(51,10,SH,G.PLAT,3);
    skyBridge(114,99,10,5.5,SH);open(98,10,SH,G.PLAT,3);void a;void b}
  for(const x of [38,43,47])lamp(x,9);for(const x of [112,107,102])lamp(x,9);
  /* ---------- the lookout spirals ---------- */
  const eLook=spiralTower(134,24,11,0,.17,'p',4915,13,'p');
  const wLook=spiralTower(6,38,11,0,.17,'a',null,13,'a');
  named('Lookout Spire',139,29,'place');named('Lamp Spire',11,43,'place');
  void eLook;void wLook;
  hgtlSetStart(B,75,144,0);
  /* ---------- the south gate, the gate avenue, the plaza ---------- */
  reserve(66,142,84,147);reserve(72,119,78,141);reserve(64,126,86,138);
  stepTower(69,145,2,'c',[7.5,9.8,12.5],true);stepTower(81,145,2,'p',[7.5,9.8,12.5],true);
  linkDoor(75,148,'l',0,5.2,0,470,{x:124,y:109,f:2},'The south gate');
  deco('hg_arch',75,146,{sc:1.25});lamp(73,146);lamp(77,146);lamp(73,143);lamp(77,143);
  for(let y=120;y<=141;y+=3){lamp(72,y);lamp(78,y);if(y%6===0){plant(71,y+1,1.2,.5);plant(79,y+1,1.2,.5)}}
  for(let y=127;y<=137;y++)for(let x=65;x<=85;x++)open(x,y,0,G.PLAZA,3);
  prop('hgt_fountain',75,132,{sc:1.35});light(75,133);
  for(const [x,y] of [[66,127],[84,127],[66,137],[84,137],[70,129],[80,129],[70,135],[80,135]])lamp(x,y);
  for(const [x,y] of [[71,132],[79,132],[75,128],[75,136]])prop('bench',x,y,{sc:1,block:false,walk:true,deco:true});
  for(const [x,y] of [[67,129],[83,129],[67,135],[83,135],[69,127],[81,127]])plant(x,y,1.6,.7);
  npc('hg_npc5',79,134,'hgn_gruff');npc('hg_npc3',71,135,'hgn_sploo',.8);npc('hg_npc4',74,145,'hgn_drub');npc('hg_npc4',76,145,'hgx_porter1');
  named('South gate',75,141);named('Gate plaza',75,130);
  /* ---------- the Great Bazaar Court: pillar, stalls, folk ---------- */
  reserve(66,80,84,108);reserve(72,66,78,108);
  for(let y=80;y<=92;y++)for(let x=69;x<=81;x++){const d=Math.hypot(x-75,y-86);if(d<5.6){open(x,y,-CD,G.PLAZA,3);RES[I(x,y)]=1}}
  prop('hgt_obelisk',75,86,{sc:1.3});light(75,87);
  for(const [x,y] of [[75,81],[75,91],[70,86],[80,86],[72,82],[78,82],[72,90],[78,90]])lamp(x,y);
  // four market towers and a ring of lamps give the court some height
  for(const [x,y,t] of [[44,74,'p'],[106,74,'a'],[44,99,'l'],[106,99,'c'],[58,96,'a'],[92,96,'p']]){stepTower(x,y,1,t,[7,9.5],false,-CD);lamp(x+2,y);lamp(x-2,y);light(x,y+2);plant(x,y+2,1.5,.6)}
  for(let x=40;x<=110;x+=10)for(const y of [70,84,104]){if(x>=66&&x<=84&&y>=80)continue;lamp(x,y)}
  const STALLS=['kh_stall1_0','kh_stall1_2','kh_stall2_1','kh_stall2_3'];
  for(const y of [71,76,81,92,97,102])for(let x=38,i=0;x<=112;x+=4,i++){if(x>=69&&x<=81)continue;if(y>=80&&x>=66&&x<=84)continue;
    if(prop(STALLS[(i+(y>>2))%4],x,y,{sc:1.05,ox:(R(x,y,60)-.5)*.3}))if(i%2===0)light(x,y+1)}
  for(let k=0;k<70;k++){const x=36+((R(k,1,70)*78)|0),y=69+((R(k,2,70)*36)|0);if(x>=66&&x<=84&&y>=79)continue;
    const kk=['barrel','crate','sacks','urn','vase0','vase2','hg_jar','hg_waxbarrel'][(R(k,3,70)*8)|0];prop(kk,x,y,{sc:(/vase|urn|jar/.test(kk)?.55:.8)+R(k,4,70)*.2})}
  for(let k=0;k<26;k++){const x=36+((R(k,5,71)*78)|0),y=68+((R(k,6,71)*38)|0);if(x>=66&&x<=84&&y>=79)continue;plant(x,y,null,.5)}
  for(const [x,y,id,im] of [[45,75,'hgx_carpet','hg_npc1'],[60,81,'hgx_spice','hg_npc5'],[92,75,'hgx_pearl','hg_npc5'],[104,81,'hgx_cartog','hg_npc0'],[70,70,'hgx_porter2','hg_npc3'],[56,70,'hgx_sweeper','hg_npc1'],[80,102,'hgx_lamper','hg_npc0'],[88,89,'hgx_clerk','hg_npc0'],[64,98,'hgx_lantern','hg_npc1'],[50,98,'hgx_cartwright','hg_npc5']])npc(im,x,y,id);
  named('The Great Bazaar Court',75,100);
  /* the Undercroft: a steep stair down from the court, a hall at the bottom, a door */
  {const ST=14,hD=-CD-4.4;
    for(let i=0;i<ST;i++)for(const x of [74,75,76]){open(x,90+i,-CD-(4.4*(i+1)/ST),G.STAIR,1);RES[I(x,90+i)]=1}
    B.stairs.push({cells:[...Array(ST)].map((_,i)=>[75,90+i]),h0:-CD,rise:-4.4/ST,kind:'undercroft'});
    for(let y=90;y<=103;y++)for(const x of [73,77])wall(x,y,'a','band',undefined,-1.4);
    for(let y=104;y<=106;y++)for(let x=68;x<=82;x++)open(x,y,hD,G.COURT,2);
    for(let x=67;x<=83;x++){if(!(x>=74&&x<=76))wall(x,103,TS[x&3],'wmid',undefined,-1.0);wall(x,107,TS[x&3],'wmid',undefined,-1.0)}
    for(let y=104;y<=106;y++)for(const x of [67,83])wall(x,y,TS[y&3],'wmid',undefined,-1.0);
    door(75,107,'a',hD,-1.0,0,4909,'The Undercroft');
    for(const [x,y] of [[69,105],[81,105],[72,106],[78,106]])lamp(x,y);
    plant(69,104,1.5,.7);plant(81,104,1.5,.7);plant(70,106,1.3,.6);plant(80,106,1.3,.6);prop('hgt_fountain',75,105,{sc:.9});
    deco('hg_arch',75,89,{sc:1.1});lamp(73,88);lamp(77,88);
    named('The Undercroft',75,104,'place')}
  /* the galleries: stepped kiosks, lamps and plants on the terraces that rise round the court */
  for(const side of [0,1])for(let y=70;y<=104;y+=7){const x0=side?118:25;let okk=true;for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)if(!isO(x0+i,y+j)||B.occ.has((x0+i)+','+(y+j)))okk=false;if(!okk)continue;
    for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)wall(x0+i,y+j,TS[(y+side)&3],((i+j)&1)?'win':'bandlow',undefined,ground(x0+i,y+j)+2.6);
    lamp(x0+(side?-1:2),y+1);plant(x0+(side?-1:2),y,1.3,.5);plant(x0+(side?-1:2),y+2,1.3,.5)}
  for(let y=62;y<=116;y+=4){lamp(23,y);lamp(126,y)}
  for(let x=30;x<=118;x+=7)lamp(x,117);
  /* ---------- sunken houses: a stair down, a yard, a door ---------- */
  const sunkHouse=(x,y,dir,rid,tint,label)=>{const c=hgtlXf(x,y,dir);
    for(let v=-3;v<12;v++)for(let u=-2;u<7;u++){const [px,py]=c(u,v);if(!free(px,py,px,py))return false}
    for(let v=-3;v<12;v++)for(let u=-2;u<7;u++){const [px,py]=c(u,v);RES[I(px,py)]=1}
    const dp=1.5;
    for(let v=0;v<6;v++){for(const u of [1,2]){const [px,py]=c(u,v);open(px,py,-.25*(v+1),G.STAIR,1)}for(const u of [0,3,4]){const [px,py]=c(u,v);wall(px,py,'a','band',-dp,1.0,{fixed:true})}}
    B.stairs.push({cells:[...Array(6)].map((_,v)=>c(1,v)),h0:0,rise:-.25,kind:'sunken'});
    for(let u=0;u<5;u++){const [px,py]=c(u,6);open(px,py,-dp,G.COURT,2)}
    for(let v=7;v<10;v++)for(let u=0;u<5;u++){const [px,py]=c(u,v);const e=v===7||v===9||u===0||u===4;wall(px,py,tint,e?'wmid':'band',-dp,1.9,{fixed:true})}
    const [dx,dy]=c(2,7);door(dx,dy,tint,-dp,1.9,(dir+2)&3,rid,label);
    const [l1x,l1y]=c(0,6),[l2x,l2y]=c(4,6);lamp(l1x,l1y);lamp(l2x,l2y);const [fx,fy]=c(1,6);plant(fx,fy,1.4,.6);
    const [tx,ty]=c(-1,0),[ux,uy]=c(5,0);lamp(tx,ty);lamp(ux,uy);return {door:[dx,dy],yard:c(2,6),top:c(1,0)}};
  const shH=sunkHouse(10,104,0,4911,'c','The Healer’s Cellar');
  const shS=sunkHouse(135,104,0,4912,'p','The Spice Cellar');
  if(shH){npc('hg_npc6',shH.yard[0]+1,shH.yard[1],'hgn_gleb');named('Healer’s steps',12,100)}
  if(shS)named('Spice steps',137,100);
  /* sunken courts: a broad stair down into a walled garden with a fountain, below the street */
  const sunkCourt=(x,y,dir,w,d,dp,label)=>{const c=hgtlXf(x,y,dir);
    for(let v=-3;v<d+2;v++)for(let u=-2;u<w+2;u++){const [px,py]=c(u,v);if(!free(px,py,px,py))return false}
    for(let v=-3;v<d+2;v++)for(let u=-2;u<w+2;u++){const [px,py]=c(u,v);RES[I(px,py)]=1}
    const n=Math.ceil(dp/.25),su=(w>>1)-1;
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);const stairV=v<n&&(u===su||u===su+1||u===su+2);
      if(stairV)open(px,py,-.25*(v+1),G.STAIR,1);
      else if(v<n)wall(px,py,'c','band',-dp,1.0,{fixed:true});
      else open(px,py,-dp,G.COURT,2)}
    B.stairs.push({cells:[...Array(n)].map((_,v)=>c(su+1,v)),h0:0,rise:-.25,kind:'sunkcourt'});
    for(let u=-1;u<=w;u++){for(const v of [-1,d]){const [px,py]=c(u,v);if(!(v===-1&&u>=su&&u<=su+2))wall(px,py,'c','band',-dp,.9,{fixed:false})}}
    for(let v=0;v<d;v++)for(const u of [-1,w]){const [px,py]=c(u,v);wall(px,py,'c','band',-dp,.9)}
    const [fx,fy]=c(w>>1,n+((d-n)>>1));prop('hgt_fountain',fx,fy,{sc:1.2});light(fx,fy+1);
    for(const [u,v] of [[0,n],[w-1,n],[0,d-1],[w-1,d-1]]){const [px,py]=c(u,v);lamp(px,py)}
    for(let v=n;v<d;v++)for(const u of [1,w-2]){const [px,py]=c(u,v);if(R(px,py,85)<.7)plant(px,py,1.4,.7)}
    const [bx2,by2]=c(2,d-2);deco('bench',bx2,by2,{});
    const [l1,l2]=c(su-1,0),[l3,l4]=c(su+3,0);lamp(l1,l2);lamp(l3,l4);
    named(label||'Sunken court',fx,fy,'small');return true};
  const sunkSpots=[[5,64,0],[130,64,0],[30,125,0],[118,125,0],[6,76,0],[131,80,0]];
  for(const [x,y,dir] of sunkSpots)sunkCourt(x,y,dir,9,14,2.0,'Sunken court');
  /* ---------- the hanging gardens (east) and the lamp garden (west) ---------- */
  const gardenTerrace=(x,yb,w,d,mx0)=>{
    const top=hgtlTerrace(B,x,yb,w,d,0,0,.25);
    for(let j=0;j<d;j++){const y=yb-j,hh=.25*(j+1);for(let i=0;i<w;i++){RES[I(x+i,y)]=1;FL[I(x+i,y)]=5}
      wall(x-1,y,TS[(j>>1)&3],'band',undefined,hh+1.2);wall(x+w,y,TS[(j>>1)&3],'band',undefined,hh+1.2)}
    return top};
  {const x=119,w=13,d=22;gardenTerrace(x,46,w,d);const top=5.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'l','band',undefined,top+1.2);wall(x+w,y,'l','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[i&3],'wmid',undefined,top+3.4);
    open(131,20,top,G.PLAT,3);open(131,19,top,G.PLAT,3);door(131,18,'l',top,top+3.2,2,4919,'The Hidden Gallery');
    for(let j=0;j<d;j++){const y=46-j;for(let i=0;i<w;i++){if(R(x+i,y,80)<.3)plant(x+i,y,null,.55)}if(j%4===1){lamp(x,y);lamp(x+w-1,y)}}
    for(let i=0;i<w;i+=3){plant(x+i,23,1.6,.6)}lamp(123,22);lamp(127,22);lamp(131,23);
    prop('hgt_cupola',125,22,{sc:1.7});prop('hgt_obelisk',129,23,{sc:1.1});light(125,23);
    named('Hanging Gardens',125,36);named('Garden pavilion',125,22)}
  {const x=5,w=13,d=10;gardenTerrace(x,34,w,d);const top=2.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'a','band',undefined,top+1.2);wall(x+w,y,'a','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[(i+1)&3],'wmid',undefined,top+3.2);
    for(let j=0;j<d;j++){const y=34-j;for(let i=0;i<w;i++)if(R(x+i,y,81)<.32)plant(x+i,y,null,.5);if(j%3===1){lamp(x,y);lamp(x+w-1,y)}}
    for(let i=1;i<w;i+=3)plant(x+i,22,1.8,.7);lamp(7,22);lamp(15,22);prop('hgt_fountain',11,23,{sc:1.1});light(11,24);
    named('Lamp Garden',11,29)}
  /* ---------- the caravan yard (south east), carts and the cartwrights ---------- */
  reserve(88,121,112,140);
  for(let k=0;k<9;k++){const x=90+((k%3)*8)+((R(k,1,90)*3)|0),y=123+((k/3|0)*6)+((R(k,2,90)*2)|0);prop('cart',x,y,{sc:1.1})}
  for(let k=0;k<30;k++){const x=89+((R(k,3,91)*22)|0),y=122+((R(k,4,91)*17)|0);prop(['crate','barrel','sacks','hg_waxbarrel'][k&3],x,y,{sc:.9+R(k,5,91)*.3})}
  for(const [x,y] of [[88,121],[112,121],[88,140],[112,140],[100,121],[100,140]])lamp(x,y);
  named('Caravan yard',100,131);
  /* ---------- houses: a loose lattice of pearly houses, pocket courts with a chest, in every free part of the ground ---------- */
  // only ground (h 0, open, not part of a structure) is free for the lattice: RES is rebuilt from the real structures
  RES.fill(0);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!isO(x,y)||Math.abs(ground(x,y))>.01||WS[I(x,y)])RES[I(x,y)]=1}
  reserve(72,119,78,141);reserve(64,126,86,138);reserve(66,142,84,147);reserve(88,121,112,140);
  const TOPS=[2.7,3.2,3.6,4.2,5.0,6.2,8.0,9.5],houseList=[];
  const lattice=(x0,y0,x1,y1)=>{
    for(let by=y0;by+4<=y1;by+=6)for(let bx=x0;bx+5<=x1;bx+=7){
      const w=4+((R(bx,by,11)*2)|0),d=3+((R(bx,by,12)*2)|0),hx=bx+((R(bx,by,13)*2)|0),hy=by+((R(bx,by,14)*2)|0);
      if(!free(hx-1,hy-1,hx+w,hy+d))continue;
      const r=R(bx,by,15),tint=tn(bx,by);
      if(r<.1&&w>=5){ // a pocket court: walls round a little garden, one gap in the wall, a bench, a lamp, plants, now and then a chest
        const gap=((R(bx,by,16)*4)|0),gx=gap===0?hx+(w>>1):gap===1?hx+w-1:gap===2?hx+(w>>1):hx,gy=gap===0?hy:gap===1?hy+(d>>1):gap===2?hy+d-1:hy+(d>>1);
        for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;if(e)wall(hx+i,hy+j,tint,((i+j)&1)?'win':'bandlow',undefined,2.6);else{open(hx+i,hy+j,0,G.PLAZA,5)}}
        open(gx,gy,0,G.ALLEY,4);RES[I(gx,gy)]=1;
        deco('bench',hx+1,hy+1,{});lamp(hx+w-2,hy+1);plant(hx+w-2,hy+d-2,1.5,.8);plant(hx+1,hy+d-2,1.3,.6);
        if(R(bx,by,17)<.5){prop('hg_chestwax',hx+(w>>1),hy+d-2,{sc:.9});named('Hidden court',hx+(w>>1),hy+(d>>1),'small')}
        continue}
      let tp=TOPS[(R(bx,by,18)*TOPS.length)|0];const stupa=R(bx,by,19)<.55;
      if(R(bx,by,22)<.3&&w>=5&&d>=4){ // a roof garden: a stair up the west lane to a doorway in the parapet
        const ph=2.4,n=10;let ok=true;for(let k=0;k<=n;k++)if(!free(hx-1,hy+1+k,hx-1,hy+1+k))ok=false;
        if(ok){for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;if(e)wall(hx+i,hy+j,tint,((i+j)&1)?'win':'bandlow',undefined,ph+1.3);else{open(hx+i,hy+j,ph,G.PLAT,5)}}
          open(hx,hy+1,ph,G.PLAT,3);RES[I(hx,hy+1)]=1;
          for(let k=0;k<n;k++){open(hx-1,hy+1+k,ph-.25*k,G.STAIR,1);RES[I(hx-1,hy+1+k)]=1}
          B.stairs.push({cells:[...Array(n)].map((_,k)=>[hx-1,hy+1+k]),h0:ph,rise:-.25,kind:'roofstair'});
          for(let j=1;j<d-1;j++)for(let i=1;i<w-1;i++)if(R(hx+i,hy+j,86)<.55)plant(hx+i,hy+j,1.3,.6);lamp(hx+w-2,hy+1);lamp(hx+1,hy+d-2);
          if(R(bx,by,23)<.4)prop('hg_chestwax',hx+w-2,hy+d-2,{sc:.8});
          houseList.push({x:hx,y:hy,w,d,tp:ph});continue}}
      for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;
        wall(hx+i,hy+j,tint,e?(((i+j)&1)?'win':'bandlow'):'band',undefined,e?tp:tp+(i>0&&i<w-1&&j>0&&j<d-1&&stupa?(i===(w>>1)&&j===(d>>1)?8.5+(R(hx,hy,98)*4|0):2.8):0.6))}
      houseList.push({x:hx,y:hy,w,d,tp});
      if(R(bx,by,20)<.5)plant(hx-1,hy+d,1.2,.5);if(R(bx,by,21)<.4)plant(hx+w,hy-1,1.1,.5)}};
  lattice(3,51,20,116);lattice(129,51,146,116);
  lattice(3,3,33,49);lattice(117,3,146,49);
  lattice(3,119,70,146);lattice(79,119,146,146);
  lattice(36,3,50,9);lattice(99,3,114,9);
  // lamps at the lattice crossings
  for(let y=3;y<H-3;y+=8)for(let x=3;x<W-3;x+=8)if(isO(x,y)&&!RES[I(x,y)]&&Math.abs(ground(x,y))<.01)lamp(x,y);
  // a few glittering plants along every lane
  for(let k=0;k<500;k++){const x=3+((R(k,1,95)*144)|0),y=3+((R(k,2,95)*144)|0);if(isO(x,y)&&Math.abs(ground(x,y))<.01&&!B.occ.has(x+','+y)&&FL[I(x,y)]===0)plant(x,y,null,.5)}
  named('The Grand Bazaar Stair',75,40);named('Tower Stalls',18,14);named('Tower Stalls',131,14);
  hgtlSetStart(B,75,144,0);
  /* ---------- hovering lamps: pearl lanterns that hang in the air over the avenues, the court and the stair walkways ---------- */
  const hover=(x,y,b,sc)=>{if(!isO(x,y))return;hgtlDecor(B,'hgt_hanglamp',x,y,{block:false,walk:true,deco:true,bob:b,sc:sc||1.3});hgtlLight(B,x,y)};
  for(let y=122;y<=141;y+=4)hover(75,y,2.4);
  for(let x=40;x<=110;x+=10)for(const y of [68,74,89,98,104])if(!(x>=66&&x<=84&&y>=80))hover(x,y,2.2+((x/10)&1)*.5);
  for(let t=1;t<=5;t++)for(let x=XW(t)+8;x<=XE(t)-8;x+=9)hover(x,WT(t)+1,2.0+(t&1)*.4,1.2);
  for(let y=20;y<=110;y+=9){hover(21,y,2.2);hover(128,y,2.2)}
  for(let x=10;x<=140;x+=14)hover(x,119,2.4);
  /* the plaza, the avenue and the court floor: patterns in the paving */
  for(let y=127;y<=137;y++)for(let x=65;x<=85;x++){const d=Math.hypot(x-75,y-132);FL[I(x,y)]=d<3.5?2:(d<6.5&&((x+y)&1)?2:3)}
  for(let y=119;y<=126;y++)for(let x=73;x<=77;x++)FL[I(x,y)]=(y&1)?2:3;
  for(let y=138;y<=146;y++)for(let x=73;x<=77;x++)FL[I(x,y)]=(y&1)?2:3;
  for(let y=80;y<=92;y++)for(let x=69;x<=81;x++){const d=Math.hypot(x-75,y-86);if(d<5.6)FL[I(x,y)]=d<2.5?3:(((x+y)&1)?3:2)}
  /* ---------- every landing of the stair is a market street: stalls, wares, lamps and hanging lanterns ---------- */
  {const ST=['kh_stall1_0','kh_stall1_2','kh_stall2_1','kh_stall2_3'],WARE=['barrel','crate','sacks','vase0','vase2','hg_jar','hg_waxbarrel','urn'];
   for(let t=0;t<=5;t++){const wt=WT(t),x0=XW(t),x1=XE(t);
     let a0=-99,a1=-99;if(t>0){const wl=XW(t),west=(t-1)%2===0;a0=west?wl:XE(t)-4;a1=a0+4}
     for(let x=x0+2,i=0;x<=x1-2;x+=3,i++){if((x>=a0-1&&x<=a1+1)||(x>=72&&x<=77))continue;
       if(i%2===0)prop(ST[(i+t)%4],x,wt+2,{sc:.95});else prop(WARE[(i*3+t)%8],x,wt+2,{sc:/vase|urn|jar/.test(WARE[(i*3+t)%8])?.6:.8});
       if(i%3===0)light(x,wt+1)}
     for(let x=x0+3;x<=x1-3;x+=7){deco('hgt_banner',x,wt,{sc:.8})}
     for(let x=x0+4;x<=x1-4;x+=5)hover(x,wt+1,1.8+((x>>2)&1)*.8,1.1)}}
  /* ---------- the gate plaza: sunken flower beds, stalls, two more fountains ---------- */
  for(const [bx,by] of [[67,129],[81,129],[67,134],[81,134]]){for(let j=0;j<3;j++)for(let i=0;i<3;i++){open(bx+i,by+j,-.4,G.COURT,5);RES[I(bx+i,by+j)]=1;B.occ.delete((bx+i)+','+(by+j))}
    for(let j=0;j<3;j++)for(let i=0;i<3;i++)if(((i+j)&1)===0)plant(bx+i,by+j,1.5,.8)}
  for(const [x,y] of [[70,128],[80,128],[70,136],[80,136]])prop('hgt_fountain',x,y,{sc:.9});
  for(const [x,y,k] of [[66,131,'kh_stall1_0'],[84,131,'kh_stall2_1'],[66,133,'kh_stall2_3'],[84,133,'kh_stall1_2'],[75,127,'kh_stall1_2'],[75,137,'kh_stall2_1']])prop(k,x,y,{sc:.95});
  for(let x=67;x<=83;x+=2){hover(x,130,2+((x>>1)&1)*.6,1.1)}
  /* ---------- lanterns over the whole city: a lit grid so that from any height the city glows ---------- */
  for(let y=6;y<H-4;y+=5)for(let x=6;x<W-4;x+=5){if(!isO(x,y)||B.occ.has(x+','+y))continue;const g=ground(x,y);hgtlDecor(B,'hgt_hanglamp',x,y,{block:false,walk:true,deco:true,bob:2.6,sc:1.5});if(((x+y)%10)===0||g<-1)hgtlLight(B,x,y)}
  /* tall slender spires on the houses: pearl finials stand beside the doorsteps */
  for(const h of houseList)if(R(h.x,h.y,97)<.5&&isO(h.x-1,h.y+h.d)){hgtlDecor(B,'hgt_finial',h.x-1,h.y+h.d,{block:false,walk:true,deco:true,sc:1.5});hgtlLight(B,h.x-1,h.y+h.d)}
  hgtlSetStart(B,75,144,0);
  /* ---------- finish: make the wall pictures ---------- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const s=WS[I(x,y)];if(!s)continue;
    let foot=s.foot===undefined?B.h[I(x,y)]:s.foot;
    if(!s.fixed){for(const dd of HGTL.DIRS){const nx=x+dd[0],ny=y+dd[1];if(inb(nx,ny)&&isO(nx,ny))foot=Math.min(foot,ground(nx,ny))}}
    if(s.pre){continue}
    const top=Math.max(s.top,foot+.6);B.h[I(x,y)]=foot;
    B.rows[y][x]=s.kind==='door'?dch(s.t,top-foot,s.door.lvl,s.door.at):wch(s.t,s.kind,top-foot)}
  for(const d of B.decor)if(HGTXG_DECOR[d.k])d.k=HGTXG_DECOR[d.k];
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){const i=I(x,y),k=B.kind[i];let f=FL[i];if(!f){f=k===G.STAIR?1:k===G.PLAT||k===G.PLAZA?3:k===G.COURT||k===G.TERRACE?2:k===G.ALLEY?4:0}r+=f}fm.push(r)}
  const lv=hgtlAssemble(B,{name:'Glorm',label:'Glorm',diff:HG.DIFF,start:B.start,extra:{fmap:fm,floorSet:['hgt_f0','hgt_f4','hgt_f3','hgt_f5','hgt_f6','hgt_f7'].map(bf),floor:bf('hgt_f0'),ceil:'tomb',ceilH:9,amb:.9,noExtras:true}});
  const chars={};for(const c in hgtaChars)chars[c]=hgtaChars[c];lv.chars=chars;
  {const RB='saturate(1.3) brightness(1.12) contrast(1.05)',rs=['hgt_wp','hgt_wa','hgt_wl','hgt_wc'].map(n=>mkTile(n,1,{boost:RB})),rg=new Int32Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=I(x,y);rg[i]=rs[(B.kind[i]===G.COURT||B.kind[i]===G.TERRACE)?1:((x>>3)+(y>>3)*3)&3]}
    lv.terrace.riser=rs[3];lv.terrace.rg=rg}
  lv.hgtxB=B;lv.hgtxDoors=doorsOut;lv.hgtxShops=shopList;lv.hgtxHouses=houseList;
  return lv;
}
hgtRegister(483,hgtxglormBuild);

/* ---------- the twenty interiors: small rooms with pearl walls, built the same way every time ---------- */
/* what stands in each room: [kind, x, y, extra]; npc entries are [kind, x, y, npcId]. The room is w wide and d deep, walls on the border, the way out is the south wall middle. */
const HGTXG_FIT={
 hall:[['hl_p_lectern',6,2],['hl_p_feast',3,5],['hl_p_feast',9,5],['hgt_banner',3,1,'d'],['hgt_banner',9,1,'d'],['hgt_lamppost',2,3,'d'],['hgt_lamppost',10,3,'d'],['hgt_pearlbush',1,1,'d'],['hgt_pearlbush',11,1,'d'],['hgt_fern',1,7,'d'],['hgt_fern',11,7,'d'],['npc','hg_npc5',4,3,'hgx_weigher'],['npc','hg_npc4',8,2,'hgx_porter1']],
 observatory:[['kh_maptable1_1',4,3],['hl_p_desk',2,2],['hl_p_shelf',6,1],['hl_p_shelf',2,1],['hgt_crystalgrass',7,6,'d'],['hgt_obelisk',1,6],['hgt_lamppost',7,2,'d'],['hgt_lamppost',1,4,'d'],['npc','hg_npc0',6,5,'hgx_keeper']],
 exchange:[['counter',3,2],['counter',7,2],['hgt_chimney',1,1],['hgt_chimney',9,1],['vase0',1,6],['vase2',9,6],['hgt_lamppost',5,2,'d'],['hgt_lamppost',2,5,'d'],['hgt_lamppost',8,5,'d'],['npc','hg_npc5',5,1,'hgx_pearl']],
 bakery:[['counter',4,2],['barrel',1,1],['barrel',7,1],['sacks',1,5],['sacks',7,5],['crate',2,1],['hgt_lamppost',2,3,'d'],['hgt_lamppost',6,3,'d'],['npc','hg_npc1',4,1,'hgn_sprell'],['npc','hg_npc3',6,4,'hgx_baker2']],
 carpets:[['hl_p_banner',2,1,'d'],['hgt_banner',5,1,'d'],['hgt_banner',8,1,'d'],['counter',5,2],['crate',1,5],['crate',9,5],['hgt_lamppost',2,3,'d'],['hgt_lamppost',8,3,'d'],['npc','hg_npc1',3,2,'hgx_carpet']],
 store:[['crate',1,1],['crate',2,1],['crate',5,1],['sacks',1,5],['sacks',5,5],['barrel',5,3],['hgt_lamppost',3,3,'d']],
 counting:[['hl_p_desk',3,2],['hl_p_desk',7,2],['hl_p_shelf',1,1],['hl_p_shelf',9,1],['chest',5,1],['chest',1,6],['hl_p_candle',5,3],['hgt_lamppost',2,4,'d'],['hgt_lamppost',8,4,'d'],['hgt_fern',1,2,'d'],['hgt_fern',9,6,'d']],
 maps:[['kh_maptable1_0',4,3],['hl_p_desk',1,2],['hl_p_shelf',7,1],['hl_p_shelf',1,1],['hgt_lamppost',6,4,'d'],['hgt_lamppost',2,5,'d'],['npc','hg_npc0',5,2,'hgx_cartog']],
 lanterns:[['hgt_gardenlantern',2,1],['hgt_gardenlantern',4,1],['hgt_gardenlantern',6,1],['hgt_hanglamp',1,3],['hgt_hanglamp',7,3],['counter',4,3],['crate',1,5],['hgt_lamppost',7,5,'d'],['npc','hg_npc1',5,2,'hgx_lantern']],
 vault:[['hgt_obelisk',7,5],['chest',2,1],['chest',12,1],['chest',2,8],['chest',12,8],['hg_jar',4,1],['hg_jar',10,1],['hg_waxbarrel',3,6],['hg_waxbarrel',11,6],['hgt_crystalgrass',1,5,'d'],['hgt_crystalgrass',13,5,'d'],['hgt_lamppost',5,3,'d'],['hgt_lamppost',9,3,'d'],['hgt_lamppost',5,7,'d'],['hgt_lamppost',9,7,'d'],['npc','hg_npc6',7,3,'hgx_vault']],
 treasury:[['hg_chestjelly',3,2],['hg_chestjelly',5,2],['hg_chestwax',2,4],['hg_chestweed',6,4],['hgt_obelisk',4,1],['hgt_lamppost',1,2,'d'],['hgt_lamppost',7,2,'d']],
 healer:[['hgt_mushrooms',1,1,'d'],['hgt_mushrooms',7,1,'d'],['hg_jar',2,1],['hg_jar',6,1],['counter',4,2],['hl_p_shelf',1,3],['hgt_lamppost',3,4,'d'],['hgt_lamppost',6,4,'d'],['npc','hg_npc6',4,1,'hgx_vault']],
 spice:[['hg_jar',1,1],['hg_jar',3,1],['hg_jar',5,1],['hg_jar',7,1],['hg_jar',9,1],['sacks',1,5],['sacks',9,5],['barrel',4,3],['barrel',6,3],['hgt_lamppost',2,3,'d'],['hgt_lamppost',8,3,'d'],['npc','hg_npc5',5,2,'hgx_spice']],
 bells:[['hgt_chime',2,1],['hgt_chime',4,1],['hgt_chime',6,1],['hgt_obelisk',4,4],['barrel',1,6],['crate',7,6],['hgt_lamppost',1,3,'d'],['hgt_lamppost',7,3,'d'],['npc','hg_npc4',2,5,'hgx_bell']],
 glass:[['hgt_gardenlantern',1,1],['hgt_gardenlantern',7,1],['vase0',2,1],['vase2',6,1],['counter',4,3],['hgt_hanglamp',1,4],['hgt_hanglamp',7,4],['npc','hg_npc6',4,2,'hgx_glass']],
 inn:[['hl_p_feast',3,3],['hl_p_feast',9,3],['hl_p_feast',3,6],['hl_p_feast',9,6],['counter',6,1],['barrel',1,1],['barrel',11,1],['hgt_lamppost',6,4,'d'],['hgt_lamppost',1,5,'d'],['hgt_lamppost',11,5,'d'],['hgt_fern',1,7,'d'],['hgt_fern',11,7,'d'],['npc','hg_npc1',5,2,'hgx_innkeep'],['npc','hg_npc4',2,2,'hgx_porter1']],
 keeper:[['chest',1,1],['hg_chestjelly',5,1],['hgt_obelisk',3,1],['hl_p_candle',5,4],['hgt_lamppost',1,5,'d'],['hgt_lamppost',5,5,'d'],['npc','hg_npc4',3,3,'hgx_keeper']],
 weavers:[['hgt_reeds',1,1,'d'],['hgt_reeds',3,1,'d'],['hgt_reeds',5,1,'d'],['hgt_reeds',7,1,'d'],['hgt_willow',1,4],['counter',4,3],['sacks',7,5],['hgt_lamppost',2,3,'d'],['hgt_lamppost',7,3,'d'],['npc','hg_npc1',5,2,'hgx_weaver']],
 brewer:[['barrel',1,1],['barrel',2,1],['barrel',3,1],['barrel',7,1],['hg_waxbarrel',1,5],['hg_waxbarrel',7,5],['counter',4,2],['hgt_lamppost',2,3,'d'],['hgt_lamppost',6,3,'d'],['npc','hg_npc5',5,3,'hgx_brewer']],
 gallery:[['hgt_banner',2,1,'d'],['hgt_banner',5,1,'d'],['hgt_banner',8,1,'d'],['hl_p_mirror',1,3],['hl_p_mirror',9,3],['hg_chestjelly',5,3],['hgt_fairytree',2,5],['hgt_fairytree',8,5],['hgt_lamppost',5,5,'d'],['hgt_lamppost',3,3,'d'],['hgt_lamppost',7,3,'d']]};
/* the rooms that hang off another room: parent id -> child id (a door in the north wall of the parent) */
function hgtxglormRoomBuild(rid){
  const r=HGTXG_ROOMS[rid],w=r.w,d=r.d,n=HGTXG_TINT[r.t];
  if(!LEVELS[483])KH_LAZY[483]&&KH_LAZY[483]();
  const city=LEVELS[483],out=city&&city.hgtxDoors?city.hgtxDoors.find(q=>q.id===rid):null;
  let parent=null;for(const k in HGTXG_ROOMS)if(HGTXG_ROOMS[k].up===rid)parent=+k;
  const wallG=hgtxglormTile(n[0],2.7,{base:n[0],mid:n[1],top:n[2]}),wallC=hgtxglormTile(n[0],2.7,{base:n[0],mid:n[0],top:n[2]});
  const chars={},ch=g=>{let c=hgtaChar(g);chars[c]=g;return c};
  const cw=ch(wallG),cb=ch(wallC),rows=[];
  for(let y=0;y<d;y++){let s='';for(let x=0;x<w;x++){const e=x===0||y===0||x===w-1||y===d-1;s+=e?((x+y)%3===0?cb:cw):'.'}rows.push(s.split(''))}
  const exitAt=parent!==null?{x:HGTXG_ROOMS[parent].w>>1,y:1,f:2}:out?{x:out.ax,y:out.ay,f:out.face}:{x:75,y:144,f:0};
  const exitLvl=parent!==null?parent:483;
  const eg=hgtxglormTile(n[0],2.7,{base:n[3],mid:n[1],top:n[2]});KH_DOOR[eg]={lvl:exitLvl,at:exitAt};
  rows[d-1][w>>1]=ch(eg);
  if(r.up){const c=HGTXG_ROOMS[r.up],ug=hgtxglormTile(n[0],2.7,{base:n[3],mid:n[1],top:n[2]});KH_DOOR[ug]={lvl:r.up,at:{x:c.w>>1,y:c.d-2,f:0}};rows[0][w>>1]=ch(ug)}
  const decor=[],lights=[];
  for(const it of HGTXG_FIT[r.deco]||[]){
    if(it[0]==='npc'){decor.push({k:it[1],x:it[2],y:it[3],block:false,walk:true,npc:it[4],sc:1});continue}
    const [k,x,y,f]=it;if(x<=0||y<=0||x>=w-1||y>=d-1)continue;
    decor.push(f==='d'?{k,x,y,block:false,walk:true,deco:true}:{k,x,y,block:true});
    if(/lamppost|hanglamp|gardenlantern|candle|crystal|mushroom/.test(k))lights.push([x,y])}
  lights.push([w>>1,d-2],[w>>1,2]);
  const fmap=[];for(let y=0;y<d;y++)fmap.push('0'.repeat(w));
  return {rows:rows.map(a=>a.join('')),chars,start:{x:w>>1,y:d-2,f:0},enemies:[],items:[],decor,lights,portals:[],floor:r.fl==='wood'?'wood':hgtxglormFloor(r.fl),ceil:'tomb',ceilH:2.7,day:0,amb:.5,torchGap:1e9,noTele:true,noExtras:true,diff:HG.DIFF,name:r.n,label:r.n,mapNames:[]}}
function hgtxglormFloor(n){const k='hglm_'+n;if(FLOORS[k])return k;const s=FLOORS[n];if(!s)return n;const sat=/f4$/.test(n)?1.2:1.7,d=new Uint8ClampedArray(s.length);for(let i=0;i<s.length;i+=4){const r=s[i],g=s[i+1],b=s[i+2],l=.3*r+.59*g+.11*b;d[i]=(l+(r-l)*sat)*1.08;d[i+1]=(l+(g-l)*sat)*1.08;d[i+2]=(l+(b-l)*sat)*1.08;d[i+3]=255}FLOORS[k]=d;return k}
for(const id in HGTXG_ROOMS)hgtRegister(+id,hgtxglormRoomBuild.bind(null,+id));
/* the chests of Glorm hold what the chests of the grassland hold */
{const _lf=lootFor;lootFor=function(d){if(hgtAny(LEVEL)&&d&&/^hg_(chest|waxbarrel|jar)/.test(d.k)){const sv=LEVEL;LEVEL=HG.ID;try{return _lf.apply(this,arguments)}finally{LEVEL=sv}}return _lf.apply(this,arguments)}}

/* ---------- the overview map (M): the whole city painted once from the real level, heights shown by colour ---------- */
const HGTXGM={cv:null,fit:null};
function hgtxglormMapDraw(){
  const L=LEVELS[483];if(!L||!L.rows)return null;
  const W=L.rows[0].length,H=L.rows.length,c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
  mplParchment(x,[-8,-4,10]);
  const f=mplFit(W,H,3),s=f.s,h=L.terrace.h,kind=L.hgtl.kind,ink='#2a1a0c';HGTXGM.fit=f;
  const wh=ch=>{const g=L.chars[ch];const t=g!==undefined?T_TILE[g]:undefined;return t!==undefined&&TEX[t]?TEX[t].wh:2.5};
  const rampOpen=z=>z<-4?'#7f98c8':z<-2.2?'#97aedb':z<-.2?'#b4c6e6':z<.3?'#f2ead6':z<1.8?'#f3dccb':z<3.4?'#f2c8cc':z<5?'#eab4c8':z<6.6?'#e0a0c8':'#cf8fd0';
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const ch=L.rows[j][i],z=h[j*W+i],px=f.X(i),py=f.Y(j);
    if(ch==='.'){x.fillStyle=rampOpen(z);x.fillRect(px,py,s+.15,s+.15);
      if(kind[j*W+i]===1){x.fillStyle='rgba(60,30,50,.35)';x.fillRect(px,py+s*.33,s+.1,s*.14);x.fillRect(px,py+s*.7,s+.1,s*.14)}
      else if(kind[j*W+i]===3){x.fillStyle='rgba(255,255,255,.55)';x.fillRect(px+s*.2,py+s*.2,s*.6,s*.6)}}
    else{const top=z+wh(ch),l=Math.max(28,Math.min(72,72-top*3.2));x.fillStyle='hsl('+(i<2||j<2||i>=W-2||j>=H-2?30:292)+','+(i<2||j<2||i>=W-2||j>=H-2?14:18)+'%,'+l+'%)';x.fillRect(px,py,s+.15,s+.15)}}
  // the doors
  for(const d of L.hgtxDoors||[]){x.fillStyle='#b8321e';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(f.X(d.x+.5),f.Y(d.y+.5),1.5,0,6.3);x.fill();x.stroke()}
  // the names
  for(const n of L.mapNames||[]){const big=n.k==='place';mplText(x,n.t,f.X(n.x+.5),f.Y(n.y+.5),big?6.4:4.6,big?'#2a1a50':'#5a3a1c')}
  mplTitle(x,'Glorm','the market city of stairs',6,6);
  mplCompass(x,452,46,10);
  mplText(x,'Blue: below the street',410,230,5,'#3a4a8a','left');mplText(x,'Pink to violet: higher',410,240,5,'#8a3a6a','left');mplText(x,'Red dot: a door',410,250,5,'#b8321e','left');mplText(x,'Stripes: stairs',410,260,5,'#5a3a1c','left');
  mpmgDraw(x,483);mplBorder(x);
  return c}
function hgtxglormOverview(){
  if(!HGTXGM.cv)HGTXGM.cv=hgtxglormMapDraw();if(!HGTXGM.cv)return;
  const f=HGTXGM.fit;MPL.reveal=false;mplPaint(HGTXGM.cv,MPL.S,MPL.AREA,cx=>f.X(cx),cy=>f.Y(cy),'You are the yellow arrow.')}
{const _do=drawOverview;drawOverview=function(){if(LEVEL===483&&LEVELS[483]&&!G.world&&!G.teleMode){hgtxglormOverview();return}return _do.apply(this,arguments)}}
/* a city map is drawn whole, with no fog of war (as the maps of Oldhaven and Khemetra are) */
{const _f=mplFogOn;mplFogOn=function(L){return L&&L.name==='Glorm'?false:_f.apply(this,arguments)}}
