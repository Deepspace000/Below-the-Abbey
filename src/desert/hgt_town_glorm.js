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

function hgtxglormBuild(id){
  const W=HGTXG.W,H=HGTXG.H,B=hgtlNew(W,H,483),R=(a,b,k)=>hgtlR(B,a,b,k||0),I=(x,y)=>y*W+x;
  const G=HGTL.K,FL=new Uint8Array(W*H),RES=new Uint8Array(W*H),WS=new Array(W*H).fill(null);
  const cache={};
  const hq=wh=>wh<=3?Math.max(.5,Math.ceil(wh*5-1e-6)/5):Math.ceil(wh*2-1e-6)/2; // heights are rounded up (to a fifth below 3, to a half above) so that few wall pictures are needed
  /* wall pictures: the painted nacre tiles, stacked as hgt_art.js does, but a little brighter and richer in colour so the pearl survives the cold light of the cavern */
  const BOOST='saturate(1.9) contrast(1.18) brightness(.93)';
  const mkTile=(name,wh,o)=>{o=o||{};const pic=n=>hgtaPic(n||name),base=pic(o.base),mid=pic(o.mid),top=pic(o.top),units=Math.max(1,Math.ceil(wh)),Hp=Math.max(8,Math.round(128*wh));
    const c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#e8d8ea';x.fillRect(0,0,128,Hp);x.filter=BOOST;
    for(let u=0;u<units;u++){const im=u===0?base:u===units-1&&units>1?top:mid;if(!im)continue;const part=wh-u<1?wh-u:1;
      x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
    const d=x.getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return gid};
  const wch=(t,kind,wh)=>{wh=hq(wh);const k=t+kind+wh;if(cache[k])return cache[k];const n=HGTXG_TINT[t];let gid;
    if(kind==='win')gid=wh<=1.2?mkTile(n[0],wh):mkTile(n[0],wh,{base:n[0],mid:n[1],top:n[2]});
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
  const bf=n=>{const k='hglm_'+n;if(FLOORS[k])return k;const s=FLOORS[n];if(!s)return n;const d=new Uint8ClampedArray(s.length);for(let i=0;i<s.length;i+=4){const r=s[i],g=s[i+1],b=s[i+2],l=.3*r+.59*g+.11*b,v=1.7;d[i]=(l+(r-l)*v)*1.08;d[i+1]=(l+(g-l)*v)*1.08;d[i+2]=(l+(b-l)*v)*1.08;d[i+3]=255}FLOORS[k]=d;return k};
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
  const CX0=22,CX1=127,CY0=59,CY1=118,FX0=34,FX1=115,FY1=106;
  for(let y=CY0;y<=CY1;y++)for(let x=CX0;x<=CX1;x++){
    if(y<65&&x>=FX0&&x<=FX1){RES[I(x,y)]=1;B.h[I(x,y)]=-3;continue}
    const d=Math.max(FX0-x,x-FX1,y-FY1,0);open(x,y,-3+.25*d,d?G.TERRACE:G.COURT,2);RES[I(x,y)]=1}
  for(let x=CX0;x<=CX0+11;x++)for(const xx of [x,CX1-(x-CX0)])wall(xx,CY0-1,TS[(xx>>2)&3],'band',0,2.2);
  /* ---------- THE GRAND BAZAAR STAIR: six tiers of shops, stairs at alternate ends, a porters' stair up the middle ---------- */
  const XW=t=>34+3*t,XE=t=>115-3*t,HT=t=>-3+1.5*t,WT=t=>65-9*t;
  const shopList=[];
  for(let t=0;t<=5;t++){
    const h=HT(t),wt=WT(t),x0=XW(t),x1=XE(t);
    if(t>0)for(let y=wt;y<=wt+2;y++)for(let x=x0;x<=x1;x++){open(x,y,h,G.PLAT,3);RES[I(x,y)]=1}
    for(let y=wt;y<=wt+2;y++)for(const x of [x0-1,x1+1]){if(t===2&&y===wt+1)continue;wall(x,y,TS[(t+y)&3],'band',undefined,h+1.3)}
    const wl=XW(t+1),we=XE(t+1),sw=5,west=t%2===0,sx0=west?wl:we-sw+1,flankTop=HT(t+1)+2.4;
    for(let y=wt-6;y<=wt-1;y++){
      for(let x=x0;x<wl;x++)wall(x,y,TS[(x+t)&3],'win',undefined,flankTop);
      for(let x=we+1;x<=x1;x++)wall(x,y,TS[(x+t+1)&3],'win',undefined,flankTop)}
    for(let k=1;k<=6;k++)for(let x=sx0;x<sx0+sw;x++){open(x,wt-k,h+.25*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[sx0+2,wt-1-k]),h0:h,rise:.25,kind:'tier'});
    const pc=74;for(let k=1;k<=6;k++)for(const x of [pc,pc+1]){open(x,wt-k,h+.25*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[pc,wt-1-k]),h0:h,rise:.25,kind:'porters'});
    const spans=west?[[sx0+sw,pc-2],[pc+3,we]]:[[wl,pc-2],[pc+3,sx0-1]];
    for(let y=wt-6;y<=wt-1;y++)for(const x of [pc-1,pc+2])wall(x,y,'c','band',h,h+2.6+((y+t)&1)*.4);
    for(const [a,b] of spans){let x=a,bi=0;
      while(x<=b){const bw=Math.min(b-x+1,5+((R(x,t,7)*3)|0));
        if(bw<3){for(let xx=x;xx<=b;xx++)for(let y=wt-6;y<=wt-1;y++)wall(xx,y,'c','band',h,h+1.1);break}
        const tint=TS[(bi+t+(x>>3))&3],sh=[2.6,3.4,3.0,4.2,3.6][((R(x,t,8)*5)|0)];
        for(let y=wt-4;y<=wt-1;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,'win',h,h+sh);
        for(let y=wt-6;y<=wt-5;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,'band',h,h+1.1+((R(xx,y,9)<.12)?2.4:0));
        shopList.push({x:x+(bw>>1),y:wt-1,t,tint,sh,h,bw,wt});
        x+=bw;bi++}}
    for(let x=x0+2;x<=x1-2;x+=7)lamp(x,wt+1+(((x>>3)&1)?1:0));
  }
  // the six shop doors, one on each tier, and the banners beside them
  const shopRoom=[4902,4903,4904,4906,4907,4908];
  for(let t=0;t<=5;t++){
    const cands=shopList.filter(s=>s.t===t&&s.bw>=5&&Math.abs(s.x-75)>8&&Math.abs(s.x-75)<30),s=cands[(t*3)%cands.length]||shopList.find(q=>q.t===t);
    door(s.x,s.y,s.tint,s.h,s.h+s.sh,2,shopRoom[t]);
    plant(s.x-1,s.wt+1,1.3,.6);plant(s.x+1,s.wt+1,1.3,.6);if(isO(s.x,s.wt))deco('hgt_banner',s.x,s.wt+1,{sc:1})}
  /* ---------- the summit terrace, the Weighmaster's hall and the spire ---------- */
  const SH=6,SX0=52,SX1=97,SY0=2,SY1=13;
  for(let y=SY0;y<=SY1;y++)for(let x=SX0;x<=SX1;x++){open(x,y,SH,G.PLAT,3);RES[I(x,y)]=1}
  for(let y=SY0;y<=SY1+2;y++)for(const x of [SX0-1,SX1+1])wall(x,y,TS[y&3],'band',undefined,SH+1.3);
  // the Weighmaster's hall: a long low block on the west of the plateau
  for(let y=8;y<=12;y++)for(let x=55;x<=63;x++){const edge=y===8||y===12||x===55||x===63;wall(x,y,'c',edge?'win':'band',SH,SH+(edge?4.2:6.4))}
  door(59,12,'c',SH,SH+4.2,2,4900);
  // the spire: a spiral stair climbing inward round a tall core, the stair of the Hall of the Weighmaster
  /* ---------- helpers for towers ---------- */
  const stepTower=(cx,cy,half,tint,tops,round)=>{for(let dy=-half;dy<=half;dy++)for(let dx=-half;dx<=half;dx++){if(round&&dx*dx+dy*dy>(half+.5)*(half+.5)){wall(cx+dx,cy+dy,'c','band',0,4.2);continue}const r=half-Math.max(Math.abs(dx),Math.abs(dy)),top=tops[Math.min(r,tops.length-1)];wall(cx+dx,cy+dy,r===0?tint:TS[(r+(tint==='p'?1:0))&3],r===0||r===2?'win':'band',0,top)}};
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
      wall(px,py,tint,cd<=1?'band':'win',B.h[I(px,py)],coreTop-cd*1.4,{fixed:true})}
    const e=sp.ends[0];let dr=null;
    if(rid)for(const dd of HGTL.DIRS){const nx=e[0]+dd[0],ny=e[1]+dd[1];if(inb(nx,ny)&&!isO(nx,ny)&&WS[I(nx,ny)]){const face=HGTL.DIRS.findIndex(q=>q[0]===-dd[0]&&q[1]===-dd[1]),hh=B.h[I(e[0],e[1])];door(nx,ny,tint,hh,hh+2.8,face,rid);dr=[nx,ny];break}}
    return {sp,top:sp.top,end:e,door:dr}};
  /* ---------- the summit spire ---------- */
  const spire=spiralTower(69,2,12,SH,.2,'l',4916,SH+17.5,'c');
  lamp(66,8);lamp(66,12);lamp(84,8);lamp(84,12);
  for(let x=54;x<=96;x+=3){if(x>=67&&x<=82)continue;plant(x,3,1.3,.5);plant(x,13,1.1,.3)}
  for(let x=64;x<=66;x++)for(let y=3;y<=7;y++)if(R(x,y,50)<.5)plant(x,y,1.4,.5);
  for(let x=83;x<=96;x++)for(let y=3;y<=11;y++)if(R(x,y,51)<.22)plant(x,y,null,.5);
  prop('hgt_obelisk',90,7,{sc:1.2});light(90,8);prop('hgt_fountain',60,5,{sc:1.2});light(60,6);
  npc('hg_npc0',65,13,'hgn_mowl');npc('hg_npc5',58,13,'hgx_weigher');npc('hg_npc6',92,12,'hgx_keeper');
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
    skyBridge(35,50,10,5.5,6);open(51,10,6,G.PLAT,3);
    skyBridge(114,99,10,5.5,6);open(98,10,6,G.PLAT,3);void a;void b}
  for(const x of [38,43,47])lamp(x,9);for(const x of [112,107,102])lamp(x,9);
  /* ---------- the lookout spirals ---------- */
  const eLook=spiralTower(134,24,11,0,.2,'p',4915,15,'p');
  const wLook=spiralTower(6,38,11,0,.2,'a',null,14,'a');
  named('Lookout Spire',139,29,'place');named('Lamp Spire',11,43,'place');
  void eLook;void wLook;
  hgtlSetStart(B,75,144,0);
  /* ---------- the south gate, the gate avenue, the plaza ---------- */
  reserve(66,142,84,147);reserve(72,119,78,141);reserve(64,126,86,138);
  stepTower(69,145,2,'c',[7.5,9.8,12.5],true);stepTower(81,145,2,'p',[7.5,9.8,12.5],true);
  linkDoor(75,148,'l',0,5.2,2,470,{x:124,y:109,f:2},'The south gate');
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
  for(let y=80;y<=92;y++)for(let x=69;x<=81;x++){const d=Math.hypot(x-75,y-86);if(d<5.6){open(x,y,-3,G.PLAZA,3);RES[I(x,y)]=1}}
  prop('hgt_obelisk',75,86,{sc:1.3});light(75,87);
  for(const [x,y] of [[75,81],[75,91],[70,86],[80,86],[72,82],[78,82],[72,90],[78,90]])lamp(x,y);
  const STALLS=['kh_stall1_0','kh_stall1_2','kh_stall2_1','kh_stall2_3'];
  for(const y of [72,77,95,100])for(let x=38,i=0;x<=112;x+=6,i++){if(x>=69&&x<=81)continue;if(y>=80&&x>=66&&x<=84)continue;
    if(prop(STALLS[(i+(y>>2))%4],x,y,{sc:1.05,ox:(R(x,y,60)-.5)*.3}))if(i%2===0)light(x,y+1)}
  for(let k=0;k<70;k++){const x=36+((R(k,1,70)*78)|0),y=69+((R(k,2,70)*36)|0);if(x>=66&&x<=84&&y>=79)continue;
    const kk=['barrel','crate','sacks','urn','vase0','vase2','hg_jar','hg_waxbarrel'][(R(k,3,70)*8)|0];prop(kk,x,y,{sc:.9+R(k,4,70)*.3})}
  for(let k=0;k<26;k++){const x=36+((R(k,5,71)*78)|0),y=68+((R(k,6,71)*38)|0);if(x>=66&&x<=84&&y>=79)continue;plant(x,y,null,.5)}
  for(const [x,y,id,im] of [[45,75,'hgx_carpet','hg_npc1'],[60,81,'hgx_spice','hg_npc5'],[92,75,'hgx_pearl','hg_npc5'],[104,81,'hgx_cartog','hg_npc0'],[70,70,'hgx_porter2','hg_npc3'],[56,70,'hgx_sweeper','hg_npc1'],[80,102,'hgx_lamper','hg_npc0'],[88,89,'hgx_clerk','hg_npc0'],[64,98,'hgx_lantern','hg_npc1'],[50,98,'hgx_cartwright','hg_npc5']])npc(im,x,y,id);
  named('The Great Bazaar Court',75,100);
  /* the Undercroft: a steep stair down from the court, a hall at the bottom, a door */
  {const ST=12,hD=-7;
    for(let i=0;i<ST;i++)for(const x of [74,75,76]){open(x,90+i,-3-(4*(i+1)/ST),G.STAIR,1);RES[I(x,90+i)]=1}
    B.stairs.push({cells:[...Array(ST)].map((_,i)=>[75,90+i]),h0:-3,rise:-4/ST,kind:'undercroft'});
    for(let y=90;y<=101;y++)for(const x of [73,77])wall(x,y,'a','band',undefined,-1.4);
    for(let y=102;y<=106;y++)for(let x=68;x<=82;x++)open(x,y,hD,G.COURT,2);
    for(let x=67;x<=83;x++){for(const y of [101,107])if(!(y===101&&x>=74&&x<=76))wall(x,y,TS[x&3],'win',undefined,-1.0)}
    for(let y=102;y<=106;y++)for(const x of [67,83])wall(x,y,TS[y&3],'win',undefined,-1.0);
    for(const y of [101])for(const x of [73,77])wall(x,y,'a','band',undefined,-1.4);
    door(75,107,'a',hD,-1.0,0,4909,'The Undercroft');
    for(const [x,y] of [[69,103],[81,103],[69,106],[81,106],[75,103]])lamp(x,y);
    plant(71,102,1.5,.7);plant(79,102,1.5,.7);plant(72,106,1.3,.6);plant(78,106,1.3,.6);prop('hgt_fountain',75,104,{sc:.9});
    deco('hg_arch',75,89,{sc:1.1});lamp(73,88);lamp(77,88);
    named('The Undercroft',75,104,'place')}
  /* the galleries: stepped kiosks, lamps and plants on the terraces that rise round the court */
  for(const side of [0,1])for(let y=70;y<=104;y+=7){const x0=side?118:25;let okk=true;for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)if(!isO(x0+i,y+j)||B.occ.has((x0+i)+','+(y+j)))okk=false;if(!okk)continue;
    for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)wall(x0+i,y+j,TS[(y+side)&3],'win',undefined,ground(x0+i,y+j)+2.6);
    lamp(x0+(side?-1:2),y+1);plant(x0+(side?-1:2),y,1.3,.5);plant(x0+(side?-1:2),y+2,1.3,.5)}
  for(let y=62;y<=116;y+=4){lamp(23,y);lamp(126,y)}
  for(let x=30;x<=118;x+=7)lamp(x,117);
  /* ---------- sunken houses: a stair down, a yard, a door ---------- */
  const sunkHouse=(x,y,dir,rid,tint,label)=>{const c=hgtlXf(x,y,dir);
    for(let v=0;v<10;v++)for(let u=0;u<5;u++){const [px,py]=c(u,v);if(!free(px,py,px,py))return false}
    for(let v=0;v<10;v++)for(let u=0;u<5;u++){const [px,py]=c(u,v);RES[I(px,py)]=1}
    const dp=1.5;
    for(let v=0;v<6;v++){for(const u of [1,2]){const [px,py]=c(u,v);open(px,py,-.25*(v+1),G.STAIR,1)}for(const u of [0,3,4]){const [px,py]=c(u,v);wall(px,py,'a','band',-dp,1.0,{fixed:true})}}
    B.stairs.push({cells:[...Array(6)].map((_,v)=>c(1,v)),h0:0,rise:-.25,kind:'sunken'});
    for(let u=0;u<5;u++){const [px,py]=c(u,6);open(px,py,-dp,G.COURT,2)}
    for(let v=7;v<10;v++)for(let u=0;u<5;u++){const [px,py]=c(u,v);const e=v===7||v===9||u===0||u===4;wall(px,py,tint,e?'win':'band',-dp,1.9,{fixed:true})}
    const [dx,dy]=c(2,7);door(dx,dy,tint,-dp,1.9,(dir+2)&3,rid,label);
    const [l1x,l1y]=c(0,6),[l2x,l2y]=c(4,6);lamp(l1x,l1y);lamp(l2x,l2y);const [fx,fy]=c(1,6);plant(fx,fy,1.4,.6);
    const [tx,ty]=c(-1,0),[ux,uy]=c(5,0);lamp(tx,ty);lamp(ux,uy);return {door:[dx,dy],yard:c(2,6),top:c(1,0)}};
  const shH=sunkHouse(10,104,0,4911,'c','The Healer’s Cellar');
  const shS=sunkHouse(135,104,0,4912,'p','The Spice Cellar');
  if(shH){npc('hg_npc6',shH.yard[0]+1,shH.yard[1],'hgn_gleb');named('Healer’s steps',12,100)}
  if(shS)named('Spice steps',137,100);
  /* ---------- the hanging gardens (east) and the lamp garden (west) ---------- */
  const gardenTerrace=(x,yb,w,d,mx0)=>{
    const top=hgtlTerrace(B,x,yb,w,d,0,0,.25);
    for(let j=0;j<d;j++){const y=yb-j,hh=.25*(j+1);for(let i=0;i<w;i++){RES[I(x+i,y)]=1;FL[I(x+i,y)]=5}
      wall(x-1,y,TS[(j>>1)&3],'band',undefined,hh+1.2);wall(x+w,y,TS[(j>>1)&3],'band',undefined,hh+1.2)}
    return top};
  {const x=119,w=13,d=22;gardenTerrace(x,46,w,d);const top=5.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'l','band',undefined,top+1.2);wall(x+w,y,'l','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[i&3],'win',undefined,top+3.4);
    open(131,20,top,G.PLAT,3);open(131,19,top,G.PLAT,3);door(131,18,'l',top,top+3.2,2,4919,'The Hidden Gallery');
    for(let j=0;j<d;j++){const y=46-j;for(let i=0;i<w;i++){if(R(x+i,y,80)<.3)plant(x+i,y,null,.55)}if(j%4===1){lamp(x,y);lamp(x+w-1,y)}}
    for(let i=0;i<w;i+=3){plant(x+i,23,1.6,.6)}lamp(123,22);lamp(127,22);lamp(131,23);
    prop('hgt_cupola',125,22,{sc:1.7});prop('hgt_obelisk',129,23,{sc:1.1});light(125,23);
    named('Hanging Gardens',125,36);named('Garden pavilion',125,22)}
  {const x=5,w=13,d=10;gardenTerrace(x,34,w,d);const top=2.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'a','band',undefined,top+1.2);wall(x+w,y,'a','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[(i+1)&3],'win',undefined,top+3.2);
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
  const TOPS=[2.7,3.2,3.6,4.2,5.0,6.2,8.0],houseList=[];
  const lattice=(x0,y0,x1,y1)=>{
    for(let by=y0;by+4<=y1;by+=6)for(let bx=x0;bx+5<=x1;bx+=7){
      const w=4+((R(bx,by,11)*2)|0),d=3+((R(bx,by,12)*2)|0),hx=bx+((R(bx,by,13)*2)|0),hy=by+((R(bx,by,14)*2)|0);
      if(!free(hx-1,hy-1,hx+w,hy+d))continue;
      const r=R(bx,by,15),tint=tn(bx,by);
      if(r<.1&&w>=5){ // a pocket court: walls round a little garden, one gap in the wall, a bench, a lamp, plants, now and then a chest
        const gap=((R(bx,by,16)*4)|0),gx=gap===0?hx+(w>>1):gap===1?hx+w-1:gap===2?hx+(w>>1):hx,gy=gap===0?hy:gap===1?hy+(d>>1):gap===2?hy+d-1:hy+(d>>1);
        for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;if(e)wall(hx+i,hy+j,tint,'win',undefined,2.6);else{open(hx+i,hy+j,0,G.PLAZA,5)}}
        open(gx,gy,0,G.ALLEY,4);RES[I(gx,gy)]=1;
        deco('bench',hx+1,hy+1,{});lamp(hx+w-2,hy+1);plant(hx+w-2,hy+d-2,1.5,.8);plant(hx+1,hy+d-2,1.3,.6);
        if(R(bx,by,17)<.5){prop('hg_chestwax',hx+(w>>1),hy+d-2,{sc:.9});named('Hidden court',hx+(w>>1),hy+(d>>1),'small')}
        continue}
      const tp=TOPS[(R(bx,by,18)*TOPS.length)|0],stupa=R(bx,by,19)<.4;
      for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;
        wall(hx+i,hy+j,tint,e?'win':'band',undefined,e?tp:tp+(i>0&&i<w-1&&j>0&&j<d-1&&stupa?2.8:0.6))}
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
  lv.terrace.riser=mkTile('hgt_wp',1);
  lv.hgtxB=B;lv.hgtxDoors=doorsOut;lv.hgtxShops=shopList;
  return lv;
}
hgtRegister(483,hgtxglormBuild);
