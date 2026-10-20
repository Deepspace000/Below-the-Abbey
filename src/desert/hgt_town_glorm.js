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
const HGTXG_TINT={p:['hgt_w2_ringbubbles','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],a:['hgt_w2_bubbles','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],c:['hgt_w2_loopsmint','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d3'],l:['hgt_w2_wavylilac','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2'],
 /* the trading city's wall characters: calm painted patterns, shop fronts, reliefs, arcades (hgt_art2.js) */
 m:['hgt_w3_fresco_cream','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],t:['hgt_w3_scroll_aqua','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d3'],f:['hgt_w3_arcade_lilac','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2'],
 k:['hgt_w3_relief_aqua','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],r:['hgt_w3_reed_lilac','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2'],d:['hgt_w3_fresco_amber','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],
 s:['hgt_w2_scales','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2'],o:['hgt_w2_medallions','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d3'],g:['hgt_w2_polkaaqua','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d1'],q:['hgt_w2_quilt','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],
 x:['hgt_w3_shop_pink','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],y:['hgt_w3_shop_cream','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d3'],u:['hgt_w3_relief_pink','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],v:['hgt_w3_relief_aqua','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],
 j:['hgt_w3_arcade_cream','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d3'],h:['hgt_w3_balcony_cream','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d3'],w:['hgt_w3_fresco_cream','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],e:['hgt_w3_fresco_amber','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],
 n:['hgt_w3_shutters_lilac','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2'],b:['hgt_w3_scroll_aqua','hgt_w2_winaqua','hgt_w3_cornice_cream','hgt_d1'],i:['hgt_w3_scroll_pink','hgt_w2_winpink','hgt_w3_cornice_cream','hgt_d0'],z:['hgt_w3_arcade_lilac','hgt_w2_portlilac','hgt_w3_cornice_cream','hgt_d2']};
const HGTXG_DECOR={'hgt_lamp':'hgt_lamppost','hgt_arch':'hg_arch','hgt_fountain':'hgt_fountain','hgt_chest':'chest','hgt_bench':'bench','hgt_urn':'hgt_chimney','hgt_spire':'hgt_finial'};
const HGTXG_PLANTS=['hgtb_plant_belltree','hgtb_plant_spiralfern','hgtb_plant_orbbush','hgtb_plant_lacecoral','hgtb_plant_tealgrass','hgtb_plant_lupin','hgtb_plant_potvine','hgtb_plant_glowshrooms','hgt_crystalgrass','hgt_fern','hgt_bulbflower','hgt_shellflower','hgt_pearlbush','hgt_mushrooms','hgt_lightvine','hgt_shrub','hgt_reeds','hgt_giantcap','hgt_crystalgrass','hgt_fern'];
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
const HGTXG_BOOST='saturate(1.05)';
function hgtxglormTile(name,wh,o){o=o||{};const pic=n=>hgtaPic(n||name),base=pic(o.base),mid=pic(o.mid),top=pic(o.top),units=Math.max(1,Math.ceil(wh)),Hp=Math.max(8,Math.round(128*wh));
  const c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#e8d8ea';x.fillRect(0,0,128,Hp);x.filter=o.boost||HGTXG_BOOST;
  for(let u=0;u<units;u++){const im=u===0?base:u===units-1&&units>1?top:mid;if(!im)continue;const part=wh-u<1?wh-u:1;
    x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
  const d=x.getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return gid}

HGTE.look[483]={ambient:.74,lamp:[1,.72,.42],haze:.26,hazeRate:.012,wallSat:1.3,floorGain:.8,floorContrast:1.15,riserGain:.9,motes:80};

/* traders and townsfolk of the stair canyon: plain lines */
for(const [id,nm,img,l] of [['hgx_t1','Basket trader','hgtb_basket','Baskets by the dozen. The reed is cut on the east road.'],['hgx_t2','Jar carrier','hgtb_jar','These jars go to the Spice Cellar. They are full, so do not push.'],['hgx_t3','Traveller','hgtb_walk','I came in by the south gate and I am still looking for the way up.'],['hgx_t4','Old trader','hgtb_elder','I have kept a stall on the third landing for forty years.'],['hgx_t5','Landing watcher','hgtb_watch','I watch the landing. Nobody takes anything from it.'],['hgx_t6','Lantern bearer','hgtb_lantern','I carry light up to the upper tiers. The landings are not lit well enough.'],['hgx_t7','Lamp polisher','hgtb_polish','A clean lamp is brighter. This one is not clean yet.'],['hgx_t8','Plant waterer','hgtb_water','The plants on the landings need water every day.']])hgtbNpc(id,nm,img,[l]);
function hgtbNpc(id,nm,img,chat){if(typeof hgNative==='function')hgNative(id,nm,img,chat)}

const HGTXG_STALL=['hgtb_stall_coral_fruit','hgtb_stall_aqua_jars','hgtb_stall_lilac_cloth','hgtb_stall_yellow_bread','hgtb_stall_pink_flowers','hgtb_stall_teal_fish','hgtb_stall_orange_pottery','hgtb_stall_sage_herbs','hgtb_stall_navy_books','hgtb_stall_rose_lanterns'];
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
  const TS='sogxyuvjhq',TS2='sogxyuvjhqwenbizsogxyuvjhq',tn=(a,b)=>TS2[(R(a,b,3)*TS2.length)|0];
  const inMz=(x,y)=>x>=88&&x<=116&&y>=86&&y<=106&&!window.__mzOpen;
  const lamp=(x,y)=>{if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y))return;B.occ.add(x+','+y);hgtlDecor(B,'hgt_lamppost',x,y,{block:false,walk:true,deco:true});hgtlLight(B,x,y)};
  const plant=(x,y,sc,lp,k)=>{if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y))return;hgtlDecor(B,k||HGTXG_PLANTS[(R(x,y,41)*HGTXG_PLANTS.length)|0],x,y,{block:false,walk:true,deco:true,sc:sc||(.8+R(x,y,42)*1.1),ox:(R(x,y,43)-.5)*.6,oy:(R(x,y,44)-.5)*.6});if(R(x,y,45)<(lp===undefined?.3:lp))hgtlLight(B,x,y)};
  const prop=(k,x,y,o)=>{if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y))return false;B.occ.add(x+','+y);hgtlDecor(B,k,x,y,Object.assign({block:true},o||{}));return true};
  const deco=(k,x,y,o)=>{if(!isO(x,y)||inMz(x,y))return;hgtlDecor(B,k,x,y,Object.assign({block:false,walk:true,deco:true},o||{}))};
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
  const npc=(k,x,y,id,sc)=>{if(!isO(x,y)||inMz(x,y))return;B.occ.add(x+','+y);hgtlDecor(B,k,x,y,{block:false,walk:true,npc:id,sc:sc||1})};
  /* ---------- the border: a tall pearl wall two cells thick ---------- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<2||y<2||x>=W-2||y>=H-2)wall(x,y,TS[(((((x>>3)+(y>>3)))%10)+10)%10],'win',0,((x%8===0||y%8===0||x%8===1&&x>1&&x<W-2||y%8===1&&y>1&&y<H-2)?14:9+((R(x>>2,y>>2,5)*2)|0)));
  /* ---------- the Great Bazaar Court: sunk 3 units, with galleries rising round it ---------- */
  const CD=3.6,CX0=22,CX1=127,CY0=59,CY1=118,FX0=34,FX1=115,FY1=106;
  for(let y=CY0;y<=CY1;y++)for(let x=CX0;x<=CX1;x++){
    if(y<65&&x>=FX0&&x<=FX1){RES[I(x,y)]=1;B.h[I(x,y)]=-CD;continue}
    const d=Math.max(FX0-x,x-FX1,y-FY1,0);open(x,y,-CD+.3*d,d?G.TERRACE:G.COURT,(((x>>2)+(y>>2))&1)?3:2);RES[I(x,y)]=1}
  for(let x=CX0;x<=CX0+11;x++)for(const xx of [x,CX1-(x-CX0)])wall(xx,CY0-1,TS[((((xx>>2))%10)+10)%10],'band',0,2.2);
  /* ---------- THE GRAND BAZAAR STAIR: six tiers of shops, stairs at alternate ends, a porters' stair up the middle ---------- */
  const XW=t=>34+3*t,XE=t=>115-3*t,HT=t=>-CD+1.8*t,WT=t=>65-9*t;
  const shopList=[],alcove=[];
  for(let t=0;t<=5;t++){
    const h=HT(t),wt=WT(t),x0=XW(t),x1=XE(t);
    if(t>0)for(let y=wt;y<=wt+2;y++)for(let x=x0;x<=x1;x++){open(x,y,h,G.PLAT,3);RES[I(x,y)]=1}
    for(let y=wt;y<=wt+2;y++)for(const x of [x0-1,x1+1]){if(t===2&&y===wt+1)continue;wall(x,y,TS[((((t+y))%10)+10)%10],'band',undefined,h+1.3)}
    const wl=XW(t+1),we=XE(t+1),sw=5,west=t%2===0,sx0=west?wl:we-sw+1,flankTop=HT(t+1)+2.4;
    for(let y=wt-6;y<=wt-1;y++){
      for(let x=x0;x<wl;x++)wall(x,y,TS[((((x+t))%10)+10)%10],'win',undefined,flankTop);
      for(let x=we+1;x<=x1;x++)wall(x,y,TS[((((x+t+1))%10)+10)%10],'win',undefined,flankTop)}
    for(let k=1;k<=6;k++)for(let x=sx0;x<sx0+sw;x++){open(x,wt-k,h+.3*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[sx0+2,wt-1-k]),h0:h,rise:.3,kind:'tier'});
    const pc=74;for(let k=1;k<=6;k++)for(const x of [pc,pc+1]){open(x,wt-k,h+.3*k,G.STAIR,1);RES[I(x,wt-k)]=1}
    B.stairs.push({cells:[...Array(6)].map((_,k)=>[pc,wt-1-k]),h0:h,rise:.3,kind:'porters'});
    const spans=west?[[sx0+sw,pc-2],[pc+3,we]]:[[wl,pc-2],[pc+3,sx0-1]];
    for(let y=wt-6;y<=wt-1;y++)for(const x of [pc-1,pc+2]){if(y>=wt-5&&y<=wt-2){open(x,y,h+.3*(wt-y),G.STAIR,1);RES[I(x,y)]=1;alcove.push({x,y,t,k:wt-y})}else wall(x,y,'m','band',h,h+2.6+((y+t)&1)*.4)}
    for(const [a,b] of spans){let x=a,bi=0;
      while(x<=b){const bw=Math.min(b-x+1,5+((R(x,t,7)*3)|0));
        if(bw<3){for(let xx=x;xx<=b;xx++)for(let y=wt-6;y<=wt-1;y++)wall(xx,y,'m','band',h,h+1.1);break}
        const tint=TS[((((bi+t+(x>>3)))%10)+10)%10],sh=[2.6,3.4,3.0,4.2,3.6][((R(x,t,8)*5)|0)];
        for(let y=wt-4;y<=wt-1;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,((xx+y)&1)?'win':'bandlow',h,h+sh);
        for(let y=wt-6;y<=wt-5;y++)for(let xx=x;xx<x+bw;xx++)wall(xx,y,tint,'band',h,h+1.1+((R(xx,y,9)<.12)?2.4:0));
        if(bw>=5&&R(x,t,10)<.28){const th=h+7+((R(x,t,12)*5)|0);for(let y=wt-6;y<=wt-3;y++)for(let xx=x+1;xx<=x+bw-2;xx++)wall(xx,y,TS[((((xx+t))%10)+10)%10],(y===wt-3||xx===x+1||xx===x+bw-2)?'win':'band',h,th-(((y===wt-6)&&(xx===x+1||xx===x+bw-2))?2.2:0))}
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
  for(let y=SY0;y<=SY1+2;y++)for(const x of [SX0-1,SX1+1])wall(x,y,TS[(((y)%10)+10)%10],'band',undefined,SH+1.3);
  // the Weighmaster's hall: a long low block on the west of the plateau
  for(let y=8;y<=12;y++)for(let x=55;x<=63;x++){const edge=y===8||y===12||x===55||x===63;wall(x,y,'c',edge?'win':'band',SH,SH+(edge?4.2:6.4))}
  door(59,12,'c',SH,SH+4.2,2,4900);
  // the spire: a spiral stair climbing inward round a tall core, the stair of the Hall of the Weighmaster
  /* ---------- helpers for towers ---------- */
  const stepTower=(cx,cy,half,tint,tops,round,base)=>{base=base||0;for(let dy=-half;dy<=half;dy++)for(let dx=-half;dx<=half;dx++){if(round&&dx*dx+dy*dy>(half+.5)*(half+.5)){wall(cx+dx,cy+dy,'m','band',undefined,base+4.2);continue}const r=half-Math.max(Math.abs(dx),Math.abs(dy)),top=tops[Math.min(r,tops.length-1)];wall(cx+dx,cy+dy,r===0?tint:TS[((((r+(tint==='p'?1:0)))%10)+10)%10],r===0||r===2?'wmid':'band',undefined,base+top)}};
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
  /* a covered tube between two towers: the floor climbs or falls in small steps, a lid over it, walls beside it that stand on the ground */
  const skyBridge=(xa,xb,y,ha,hb)=>{const n=Math.abs(xb-xa)+1,sx=Math.sign(xb-xa),cells=[],LD=hgtlEnsureLid(B);
    for(let i=0;i<n;i++){const x=xa+sx*i,hh=ha+(hb-ha)*(i+1)/(n+1);open(x,y,hh,G.BRIDGE,4);cells.push([x,y]);RES[I(x,y)]=1;LD[I(x,y)]=2.7;
      for(const dy of [-1,1])wall(x,y+dy,'m','band',undefined,hh+3.3);if(i%3===1)hgtlLight(B,x,y)}
    B.stairs.push({cells,h0:ha,rise:(hb-ha)/(n+1),kind:'bridge'});return cells};
  /* spiral tower of the library, with a tall core and a door at the top end */
  const ROOST=[];
  const spiralTower=(x,y,size,h0,rise,tint,rid,coreTop,wallTint)=>{
    const wc=wch(wallTint||'c','band',2.5),sp=hgtlSpiralStairs(B,x,y,size,h0,rise,{gap:1,wall:wc});
    for(let j=y;j<y+size;j++)for(let i=x;i<x+size;i++){RES[I(i,j)]=1;if(!isO(i,j))WS[I(i,j)]={t:wallTint||'c',kind:'band',top:B.h[I(i,j)]+2.5,foot:B.h[I(i,j)],fixed:true,door:null,pre:true}}
    for(const k of sp.cellH.keys()){const [cx,cy]=k.split(',').map(Number);FL[I(cx,cy)]=1}
    const mx=x+(size>>1),my=y+(size>>1);
    for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const px=mx+i,py=my+j;if(!inb(px,py)||isO(px,py))continue;const cd=Math.max(Math.abs(i),Math.abs(j));
      wall(px,py,tint,cd<=1?'band':'wmid',B.h[I(px,py)],coreTop-cd*1.4,{fixed:true})}
    const e=sp.ends[0],he=B.h[I(e[0],e[1])];let dr=null;
    // the top: a square lookout platform of 5 by 5, a low rail round it, a door on one side, and furniture
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const px=e[0]+dx,py=e[1]+dy;if(!inb(px,py)||sp.cellH.has(px+','+py))continue;open(px,py,he,G.PLAT,3);RES[I(px,py)]=1}
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==3)continue;const px=e[0]+dx,py=e[1]+dy;if(!inb(px,py)||isO(px,py)||!WS[I(px,py)])continue;const w=WS[I(px,py)];w.top=Math.min(w.top,he+.9);w.fixed=true;w.foot=B.h[I(px,py)];w.pre=false;w.door=null}
    if(rid)for(const [dx,dy,fc] of [[0,3,0],[3,0,3],[-3,0,1],[0,-3,2]]){const px=e[0]+dx,py=e[1]+dy;if(inb(px,py)&&!isO(px,py)&&WS[I(px,py)]){door(px,py,tint,he,he+2.8,fc,rid);dr=[px,py];break}}
    for(const [dx,dy] of [[-2,-2],[2,-2],[-2,2],[2,2]])lamp(e[0]+dx,e[1]+dy);
    prop('bench',e[0]-1,e[1]-2,{sc:1.1,block:false,walk:true,deco:true});prop('hgtb_chair',e[0]+1,e[1]+1,{sc:1,block:false,walk:true,deco:true});
    for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[-1,2],[1,-1]])plant(e[0]+dx,e[1]+dy,1.6,.8,['hgtb_plant_orbbush','hgtb_plant_glowshrooms','hgtb_plant_lacecoral','hgtb_plant_lupin','hgtb_plant_potvine'][(dx+dy+5)%5]);
    deco('hgtb_deco_banner',e[0]+2,e[1]-1,{sc:.9});hgtlDecor(B,['hgtb_lilacmoth','hgtb_jadefinmoth','hgtb_creamjelly'][(e[0]+e[1])%3],e[0]+1,e[1]-2,{block:false,walk:true,deco:true,bob:.8});hgtlDecor(B,'hgtb_deco_lanterns',e[0],e[1]-1,{block:false,walk:true,deco:true,bob:1.6,sc:1.2});hgtlLight(B,e[0],e[1]);
    ROOST.push({x:e[0],y:e[1],h:he});
    return {sp,top:sp.top,end:e,door:dr}};
  /* ---------- the summit spire ---------- */
  const spire=spiralTower(69,2,12,SH,.14,'f',4916,SH+9,'m');
  lamp(66,8);lamp(66,12);lamp(84,8);lamp(84,12);
  for(let x=54;x<=96;x+=3){if(x>=67&&x<=82)continue;plant(x,3,1.3,.5);plant(x,13,1.1,.3)}
  for(let x=64;x<=66;x++)for(let y=3;y<=7;y++)if(R(x,y,50)<.5)plant(x,y,1.4,.5);
  for(let x=83;x<=96;x++)for(let y=3;y<=11;y++)if(R(x,y,51)<.22)plant(x,y,null,.5);
  prop('hgt_obelisk',90,7,{sc:1.2});light(90,8);prop('hgt_fountain',60,5,{sc:1.2});light(60,6);
  npc('hg_npc0',65,13,'hgn_mowl');npc('hg_npc5',58,13,'hgx_weigher');npc('hg_npc6',92,12,'hgx_keeper');
  for(let y=2;y<=6;y++)for(let x=53;x<=57;x++){if(x===53||x===57||y===2||y===6){if(!(x===55&&y===6))wall(x,y,'f','wmid',SH,SH+2.8)}}
  prop('hg_chestjelly',55,4,{sc:.9});prop('hg_chestwax',54,3,{sc:.8});lamp(56,5);plant(54,5,1.3,.6);named('Weighers’ closet',55,4,'small');
  named('The Weighmaster’s Spire',75,8,'place');
  /* ---------- the two sky bridges from the summit down to the tower stalls, with the two stall tower rows ---------- */
  const chain=(mx,cx0,cy,dx,rids,tints)=>{
    const towers=rids.map((r,i)=>stallTower(cx0+dx*i,cy,mx,tints[i],r));
    towers.forEach((tw,i)=>{const cx=cx0+dx*i,ex=cx+mx*5;padAt(ex,cy-5,mx,5.5);lamp(ex+mx,cy-5);lamp(ex+mx,cy-3);plant(ex+mx*2,cy-5,1.5,.6);plant(ex+mx*2,cy-3,1.5,.6);deco('hgt_banner',ex+mx*2,cy-4,{sc:1});
      if(i<towers.length-1){const nx=cx0+dx*(i+1),a=ex+mx*3,b=nx-mx*5;skyBridge(a,b,cy-4,5.5,3.25)}});
    return towers};
  const wt0=chain(1,9,14,18,[4913,4914],['o','t']);
  const et0=chain(-1,140,14,-18,[4917,4918],['m','f']);
  // the sky bridges to the summit: from the pad of the nearest tower on each side, a long flat causeway
  {const a=27+5+3,b=SX0-2; // west: pad ends at x=35?  (cx+5..cx+7 = 32..34); the bridge starts at 35
    skyBridge(35,50,10,5.5,SH);open(51,10,SH,G.PLAT,3);
    skyBridge(114,99,10,5.5,SH);open(98,10,SH,G.PLAT,3);void a;void b}
  for(const x of [38,43,47])lamp(x,9);for(const x of [112,107,102])lamp(x,9);
  /* ---------- the lookout spirals ---------- */
  const eLook=spiralTower(134,24,11,0,.17,'o',4915,13,'o');
  const wLook=spiralTower(6,38,11,0,.17,'t',null,13,'t');
  named('Lookout Spire',139,29,'place');named('Lamp Spire',11,43,'place');
  void eLook;void wLook;
  hgtlSetStart(B,75,144,0);
  /* ---------- the grand maze under the bazaar: a sunken maze cut into the south east of the court floor ---------- */
  const W2=['rings','scales','quilt','medallions','polkapink','loopsmint','wavylilac','bubbles','ringbubbles','polkaaqua'];
  const mazeTile=(role,wh,info)=>{if(role==='wall'||role==='border'||role==='post'||role==='rail'||role==='lit'||role==='chamber'||role==='pillar'){const nm=W2[(((info&&info.band)||0)%W2.length+W2.length)%W2.length];return hgtaChar(hgtaWallTile('hgt_w2_'+nm,Math.max(.5,Math.round(wh*5)/5)))}return undefined};
  const MZ=[];
  const grand=hgtzMaze(B,90,88,25,17,{algo:'backtracker',kind:'sunken',side:'W',base:-CD,depth:2.4,seed:4831,reward:'chest',braid:.12,secret:true,tile:mazeTile});
  MZ.push(grand);reserve(88,86,116,106);
  named('The Grand Maze',102,86,'place');
  /* ---------- the south gate, the gate avenue, the plaza ---------- */
  reserve(66,142,84,147);reserve(72,119,78,141);reserve(64,126,86,138);
  stepTower(69,145,2,'m',[7.5,9.8,12.5],true);stepTower(81,145,2,'o',[7.5,9.8,12.5],true);
  linkDoor(75,148,'l',0,5.2,0,470,{x:124,y:109,f:2},'The south gate');
  deco('hg_arch',75,146,{sc:1.25});lamp(73,146);lamp(77,146);lamp(73,143);lamp(77,143);
  for(let y=120;y<=141;y+=3){lamp(72,y);lamp(78,y);if(y%6===0){plant(71,y+1,1.2,.5);plant(79,y+1,1.2,.5)}}
  for(let y=127;y<=137;y++)for(let x=65;x<=85;x++)open(x,y,0,G.PLAZA,3);
  prop('hgtb_deco_fountain',75,132,{sc:1.7});light(75,133);
  for(const [x,y] of [[66,127],[84,127],[66,137],[84,137],[70,129],[80,129],[70,135],[80,135]])lamp(x,y);
  for(const [x,y] of [[71,132],[79,132],[75,128],[75,136]])prop('bench',x,y,{sc:1,block:false,walk:true,deco:true});
  for(const [x,y] of [[67,129],[83,129],[67,135],[83,135],[69,127],[81,127]])plant(x,y,1.6,.7);
  npc('hg_npc5',79,134,'hgn_gruff');npc('hg_npc3',71,135,'hgn_sploo',.8);npc('hg_npc4',74,145,'hgn_drub');npc('hg_npc4',76,145,'hgx_porter1');
  named('South gate',75,141);named('Gate plaza',75,130);
  /* ---------- the Great Bazaar Court: pillar, stalls, folk ---------- */
  reserve(66,80,84,108);reserve(72,66,78,108);
  for(let y=80;y<=92;y++)for(let x=69;x<=81;x++){const d=Math.hypot(x-75,y-86);if(d<5.6){open(x,y,-CD,G.PLAZA,3);RES[I(x,y)]=1}}
  prop('hgtb_deco_fountain',75,86,{sc:1.9});light(75,87);
  for(const [x,y] of [[75,81],[75,91],[70,86],[80,86],[72,82],[78,82],[72,90],[78,90]])lamp(x,y);
  // four market towers and a ring of lamps give the court some height
  for(const [x,y,t] of [[44,74,'o'],[106,74,'t'],[44,99,'f'],[106,99,'m'],[58,96,'t'],[92,96,'o']]){if(inMz(x,y))continue;stepTower(x,y,1,t,[7,9.5],false,-CD);lamp(x+2,y);lamp(x-2,y);light(x,y+2);plant(x,y+2,1.5,.6)}
  for(let x=40;x<=110;x+=10)for(const y of [70,84,104]){if(x>=66&&x<=84&&y>=80)continue;lamp(x,y)}
  const STALLS=HGTXG_STALL;
  for(const y of [71,76,81,92,97,102])for(let x=38,i=0;x<=112;x+=4,i++){if(x>=69&&x<=81)continue;if(y>=80&&x>=66&&x<=84)continue;
    if(prop(STALLS[(i+(y>>2))%10],x,y,{sc:1.05,ox:(R(x,y,60)-.5)*.3}))if(i%2===0)light(x,y+1)}
  const ANCH=['counter','counter2','hgtb_table','kh_maptable1_0','hl_p_feast','hgtb_bench'],SMALL=['sacks','barrel','vase0','vase2','hg_jar','urn','crate','hg_waxbarrel','hgt_pearlbush','flowerpot'];
  for(let k=0;k<34;k++){const x=37+((R(k,1,70)*76)|0),y=69+((R(k,2,70)*36)|0);if(x>=66&&x<=84&&y>=79||inMz(x,y))continue;
    const a=ANCH[(R(k,3,70)*6)|0];if(!prop(a,x,y,{sc:a==='hgtb_bench'?1.2:(a==='kh_maptable1_0'?.8:.9)}))continue;
    const n=2+((R(k,4,70)*3)|0);for(let m=0;m<n;m++){const s=SMALL[((R(k,10+m,70)*10)|0)],dx=[-1,1,0,2,-2][m%5],dy=[0,0,1,1,1][m%5];prop(s,x+dx,y+dy,{sc:/vase|jar|urn|flowerpot/.test(s)?.5:.7})}
    if(k%3===0)light(x,y+1)}
  for(let k=0;k<26;k++){const x=36+((R(k,5,71)*78)|0),y=68+((R(k,6,71)*38)|0);if(x>=66&&x<=84&&y>=79)continue;plant(x,y,null,.5)}
  for(const [x,y,id,im] of [[45,75,'hgx_carpet','hg_npc1'],[60,81,'hgx_spice','hg_npc5'],[92,75,'hgx_pearl','hg_npc5'],[104,81,'hgx_cartog','hg_npc0'],[70,70,'hgx_porter2','hg_npc3'],[56,70,'hgx_sweeper','hg_npc1'],[80,102,'hgx_lamper','hg_npc0'],[88,89,'hgx_clerk','hg_npc0'],[64,98,'hgx_lantern','hg_npc1'],[50,98,'hgx_cartwright','hg_npc5']])npc(im,x,y,id);
  named('The Great Bazaar Court',75,100);
  /* the Undercroft: a steep stair down from the court, a hall at the bottom, a door */
  {const ST=14,hD=-CD-4.4;
    for(let i=0;i<ST;i++)for(const x of [73,74,75,76,77]){open(x,90+i,-CD-(4.4*(i+1)/ST),G.STAIR,1);RES[I(x,90+i)]=1}
    B.stairs.push({cells:[...Array(ST)].map((_,i)=>[75,90+i]),h0:-CD,rise:-4.4/ST,kind:'undercroft'});
    for(let y=90;y<=103;y++)for(const x of [72,78])wall(x,y,'v','wmid',undefined,-.6);
    for(let y=104;y<=106;y++)for(let x=68;x<=82;x++)open(x,y,hD,G.COURT,2);
    for(let x=67;x<=83;x++){if(!(x>=73&&x<=77))wall(x,103,TS[(((x)%10)+10)%10],'wmid',undefined,-1.0);wall(x,107,TS[(((x)%10)+10)%10],'wmid',undefined,-1.0)}
    for(let y=104;y<=106;y++)for(const x of [67,83])wall(x,y,TS[(((y)%10)+10)%10],'wmid',undefined,-1.0);
    door(75,107,'a',hD,-1.0,0,4909,'The Undercroft');
    for(const [x,y] of [[69,105],[81,105],[72,106],[78,106]])lamp(x,y);
    plant(69,104,1.5,.7);plant(81,104,1.5,.7);plant(70,106,1.3,.6);plant(80,106,1.3,.6);prop('hgt_fountain',75,105,{sc:.9});
    deco('hg_arch',75,89,{sc:1.1});lamp(73,88);lamp(77,88);
    named('The Undercroft',75,104,'place')}
  /* the galleries: stepped kiosks, lamps and plants on the terraces that rise round the court */
  for(const side of [0,1])for(let y=70;y<=104;y+=7){const x0=side?118:25;let okk=true;for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)if(!isO(x0+i,y+j)||B.occ.has((x0+i)+','+(y+j)))okk=false;if(!okk)continue;
    for(let j=0;j<=2;j++)for(let i=0;i<=1;i++)wall(x0+i,y+j,TS[((((y+side))%10)+10)%10],((i+j)&1)?'win':'bandlow',undefined,ground(x0+i,y+j)+2.6);
    lamp(x0+(side?-1:2),y+1);plant(x0+(side?-1:2),y,1.3,.5);plant(x0+(side?-1:2),y+2,1.3,.5)}
  for(let y=62;y<=116;y+=4){lamp(23,y);lamp(126,y)}
  for(let x=30;x<=118;x+=7)lamp(x,117);
  /* ---------- sunken houses: a stair down, a yard, a door ---------- */
  const sunkHouse=(x,y,dir,rid,tint,label)=>{const c=hgtlXf(x,y,dir);
    for(let v=-3;v<12;v++)for(let u=-2;u<7;u++){const [px,py]=c(u,v);if(!free(px,py,px,py))return false}
    for(let v=-3;v<12;v++)for(let u=-2;u<7;u++){const [px,py]=c(u,v);RES[I(px,py)]=1}
    const dp=1.5;
    for(let v=0;v<6;v++){for(const u of [1,2]){const [px,py]=c(u,v);open(px,py,-.25*(v+1),G.STAIR,1)}for(const u of [0,3,4]){const [px,py]=c(u,v);wall(px,py,'t','band',-dp,1.0,{fixed:true})}}
    B.stairs.push({cells:[...Array(6)].map((_,v)=>c(1,v)),h0:0,rise:-.25,kind:'sunken'});
    for(let u=0;u<5;u++){const [px,py]=c(u,6);open(px,py,-dp,G.COURT,2)}
    for(let v=7;v<10;v++)for(let u=0;u<5;u++){const [px,py]=c(u,v);const e=v===7||v===9||u===0||u===4;wall(px,py,tint,e?'wmid':'band',-dp,1.9,{fixed:true})}
    const [dx,dy]=c(2,7);door(dx,dy,tint,-dp,1.9,(dir+2)&3,rid,label);
    const [l1x,l1y]=c(0,6),[l2x,l2y]=c(4,6);lamp(l1x,l1y);lamp(l2x,l2y);const [fx,fy]=c(1,6);plant(fx,fy,1.4,.6);
    const [tx,ty]=c(-1,0),[ux,uy]=c(5,0);lamp(tx,ty);lamp(ux,uy);return {door:[dx,dy],yard:c(2,6),top:c(1,0)}};
  const shH=sunkHouse(10,104,0,4911,'m','The Healer’s Cellar');
  const shS=sunkHouse(135,104,0,4912,'o','The Spice Cellar');
  if(shH){npc('hg_npc6',shH.yard[0]+1,shH.yard[1],'hgn_gleb');named('Healer’s steps',12,100)}
  if(shS)named('Spice steps',137,100);
  /* sunken courts: a broad stair down into a walled garden with a fountain, below the street */
  const sunkCourt=(x,y,dir,w,d,dp,label)=>{const c=hgtlXf(x,y,dir);
    for(let v=-3;v<d+2;v++)for(let u=-2;u<w+2;u++){const [px,py]=c(u,v);if(!free(px,py,px,py))return false}
    for(let v=-3;v<d+2;v++)for(let u=-2;u<w+2;u++){const [px,py]=c(u,v);RES[I(px,py)]=1}
    const n=Math.ceil(dp/.25),su=(w>>1)-1;
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);const stairV=v<n&&(u===su||u===su+1||u===su+2);
      if(stairV)open(px,py,-.25*(v+1),G.STAIR,1);
      else if(v<n)wall(px,py,'m','band',-dp,1.0,{fixed:true});
      else open(px,py,-dp,G.COURT,2)}
    B.stairs.push({cells:[...Array(n)].map((_,v)=>c(su+1,v)),h0:0,rise:-.25,kind:'sunkcourt'});
    for(let u=-1;u<=w;u++){for(const v of [-1,d]){const [px,py]=c(u,v);if(!(v===-1&&u>=su&&u<=su+2))wall(px,py,'m','band',-dp,.9,{fixed:false})}}
    for(let v=0;v<d;v++)for(const u of [-1,w]){const [px,py]=c(u,v);wall(px,py,'m','band',-dp,.9)}
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
      wall(x-1,y,TS[((((j>>1))%10)+10)%10],'band',undefined,hh+1.2);wall(x+w,y,TS[((((j>>1))%10)+10)%10],'band',undefined,hh+1.2)}
    return top};
  {const x=119,w=13,d=22;gardenTerrace(x,46,w,d);const top=5.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'f','band',undefined,top+1.2);wall(x+w,y,'f','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[(((i)%10)+10)%10],'wmid',undefined,top+3.4);
    open(131,20,top,G.PLAT,3);open(131,19,top,G.PLAT,3);door(131,18,'l',top,top+3.2,2,4919,'The Hidden Gallery');
    for(let j=0;j<d;j++){const y=46-j;for(let i=0;i<w;i++){if(R(x+i,y,80)<.3)plant(x+i,y,null,.55)}if(j%4===1){lamp(x,y);lamp(x+w-1,y)}}
    for(let i=0;i<w;i+=3){plant(x+i,23,1.6,.6)}lamp(123,22);lamp(127,22);lamp(131,23);
    prop('hgt_cupola',125,22,{sc:1.7});prop('hgt_obelisk',129,23,{sc:1.1});light(125,23);
    named('Hanging Gardens',125,36);named('Garden pavilion',125,22)}
  {const x=5,w=13,d=10;gardenTerrace(x,34,w,d);const top=2.5;
    for(let y=21;y<=24;y++)for(let i=0;i<w;i++){open(x+i,y,top,G.PLAT,3);RES[I(x+i,y)]=1}
    for(let y=21;y<=24;y++){wall(x-1,y,'t','band',undefined,top+1.2);wall(x+w,y,'t','band',undefined,top+1.2)}
    for(let i=-1;i<=w;i++)wall(x+i,20,TS[((((i+1))%10)+10)%10],'wmid',undefined,top+3.2);
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
  /* ---------- features placed on free ground before the houses: pools, tanks, mazes, stairs that go nowhere ---------- */
  const where=(w,h,x0,y0,x1,y1,step)=>{for(let y=y0;y+h<=y1;y+=(step||2))for(let x=x0;x+w<=x1;x+=(step||2))if(free(x-1,y-1,x+w,y+h))return {x,y};return null};
  const take=(p,w,h)=>{if(p)reserve(p.x-1,p.y-1,p.x+w,p.y+h);return p};
  const REG=[[3,52,21,116],[129,52,146,116],[3,3,33,49],[117,3,146,49],[3,119,64,146],[113,119,146,146]];
  const spot=(w,h,order)=>{for(const k of order){const r=REG[k],p=where(w,h,r[0],r[1],r[2],r[3]);if(p)return take(p,w,h)}return null};
  /* mazes of different kinds on the free ground of the districts */
  const MZS=[['hedge','prim',17,17,[0,2,4],'chest'],['tall','kruskal',17,17,[1,3,5],'view'],['tube','wilson',15,15,[2,5,3],'lamp'],['raised','prim',17,15,[3,4,1],'creature'],['shell','circular',17,17,[0,1,2,3],'shrine'],['tall','chartres',17,17,[4,5,2],'chest']];
  MZS.forEach(([kind,algo,w,h,ord,reward],i)=>{const p=spot(w,h,ord);if(!p)return;const side=['S','N','W','E'][i&3];
    try{const m=hgtzMaze(B,p.x,p.y,w,h,{kind,algo,side,seed:4840+i,reward,secret:i%2===0,tile:mazeTile,wallH:kind==='tall'?4.2:undefined});MZ.push(m);named((kind==='hedge'?'Hedge maze':kind==='tube'?'Tube maze':kind==='raised'?'Raised maze':kind==='shell'?'Shell maze':'Tall maze'),p.x+(w>>1),p.y-1,'small')}catch(e){console.error('maze',kind,e)}});
  /* pools: wade at the rim, swim in the middle */
  const POOLS=[];
  for(const [ord,w,d] of [[[4,5],12,8],[[5,4],12,8],[[0,1],10,7],[[1,0],10,7]]){const p=spot(w,d,ord);if(!p)continue;
    const pl=hgtlPool(B,p.x,p.y,w,d,{shallow:2,bath:true,lamps:true});POOLS.push(Object.assign({x:p.x,y:p.y,w,d},pl));
    for(let i=0;i<w;i+=3){plant(p.x+i,p.y-1,1.4,.7);plant(p.x+i,p.y+d,1.4,.7)}hgtlDecor(B,'bench',p.x+(w>>1),p.y+d+1,{block:false,walk:true,deco:true});named('Pool',p.x+(w>>1),p.y+(d>>1),'small')}
  /* fish tanks: a tower at the bazaar rim, a round tank, a run of tanks in a wall */
  const TANKS=[];
  {const p=spot(3,3,[0,4]);if(p){TANKS.push(hgtkTank(B,p.x,p.y,3,3,{type:'tower',seed:11,theme:'reef'}));named('Tank Tower',p.x+1,p.y+1,'place');lamp(p.x-1,p.y+3);lamp(p.x+3,p.y+3)}}
  {const p=spot(3,3,[5,1]);if(p){TANKS.push(hgtkTank(B,p.x,p.y,3,3,{type:'round',seed:12,theme:'lagoon'}));named('Plaza tank',p.x+1,p.y+1,'small');lamp(p.x-1,p.y+3)}}
  {const p=spot(9,3,[4,5]);if(p){TANKS.push(hgtkTank(B,p.x,p.y,9,3,{type:'wall',face:'S',seed:13,theme:'deep',wh:3.6}));named('Tank run',p.x+4,p.y+1,'small');for(let i=0;i<9;i+=4)lamp(p.x+i,p.y+3)}}
  {const p=spot(4,3,[5,4]);if(p){TANKS.push(hgtkTank(B,p.x,p.y,4,3,{type:'box',seed:14,theme:'violet'}))}}
  /* stairs that go nowhere: every kind */
  [['wall',[3,2]],['window',[2,3]],['arch',[4,5]],['chair',[5,4]],['loop',[0,1]]].forEach(([v,ord],i)=>{const w=v==='loop'?8:5,h=v==='loop'?8:(v==='chair'?19:17),p=spot(w,h,ord);if(!p)return;
    try{hgtlStairsToNowhere(B,v==='loop'?p.x+1:p.x+1,v==='loop'?p.y+1:p.y+h-2,0,v,{tint:'abcd'[i%4],len:10,width:2})}catch(e){console.error('nowhere',v,e)}});
  /* terraced boundary architecture: steps rise toward the great wall on every side, with planters and lamps, in front of the skyline */
  {const sides=[['N',(i)=>[i,3],(i,k)=>[i,3+k]],['S',(i)=>[i,146],(i,k)=>[i,146-k]],['W',(i)=>[3,i],(i,k)=>[3+k,i]],['E',(i)=>[146,i],(i,k)=>[146-k,i]]];
   for(const [nm,base,cell] of sides)for(let i=6;i<=144;i++){let ok=true;for(let k=0;k<5;k++){const [x,y]=cell(i,k);if(!free(x,y,x,y)){ok=false;break}}
     if(!ok)continue;for(let k=0;k<5;k++){const [x,y]=cell(i,k);open(x,y,.3*(5-k),G.TERRACE,5);RES[I(x,y)]=1}
     if(i%4===0){const [x,y]=cell(i,0);plant(x,y,1.8,.7)}if(i%10===0){const [x,y]=cell(i,2);lamp(x,y)}}}
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
          houseList.push({x:hx,y:hy,w,d,tp:ph,patio:1});continue}}
      for(let j=0;j<d;j++)for(let i=0;i<w;i++){const e=i===0||j===0||i===w-1||j===d-1;
        wall(hx+i,hy+j,e?TS2[((((hx+i+hy+j)/3)|0)+((R(bx,by,24)*24)|0))%TS2.length]:tint,e?(((i+j)&1)?'win':'bandlow'):'band',undefined,e?tp+(((((hx+i+hy+j)/3)|0)&1)?.5:0):tp+(i>0&&i<w-1&&j>0&&j<d-1&&stupa?(i===(w>>1)&&j===(d>>1)?8.5+(R(hx,hy,98)*4|0):2.8):0.6))}
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
  const hover=(x,y,b,sc)=>{if(!isO(x,y)||inMz(x,y))return;hgtlDecor(B,'hgt_hanglamp',x,y,{block:false,walk:true,deco:true,bob:b,sc:sc||1.3});hgtlLight(B,x,y)};
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
  {const ST=HGTXG_STALL,WARE=['counter','sacks','hgtb_table','vase2','hg_jar','hl_p_feast','kh_maptable1_0','hgt_pearlbush'];
   for(let t=0;t<=5;t++){const wt=WT(t),x0=XW(t),x1=XE(t);
     let a0=-99,a1=-99;if(t>0){const wl=XW(t),west=(t-1)%2===0;a0=west?wl:XE(t)-4;a1=a0+4}
     for(let x=x0+2,i=0;x<=x1-2;x+=3,i++){if((x>=a0-1&&x<=a1+1)||(x>=72&&x<=77))continue;
       if(i%2===0)prop(ST[(i+t)%10],x,wt+2,{sc:.95});else prop(WARE[(i*3+t+((x>>2)&3))%8],x,wt+2,{sc:/vase|jar|bush/.test(WARE[(i*3+t+((x>>2)&3))%8])?.6:.8});
       if(i%3===0)light(x,wt+1)}
     for(let x=x0+3;x<=x1-3;x+=7){deco('hgt_banner',x,wt,{sc:.8})}
     for(let x=x0+4;x<=x1-4;x+=5)hover(x,wt+1,1.8+((x>>2)&1)*.8,1.1)}}
  /* ---------- the gate plaza: sunken flower beds, stalls, two more fountains ---------- */
  for(const [bx,by] of [[67,129],[81,129],[67,134],[81,134]]){for(let j=0;j<3;j++)for(let i=0;i<3;i++){open(bx+i,by+j,-.4,G.COURT,5);RES[I(bx+i,by+j)]=1;B.occ.delete((bx+i)+','+(by+j))}
    for(let j=0;j<3;j++)for(let i=0;i<3;i++)if(((i+j)&1)===0)plant(bx+i,by+j,1.5,.8)}
  for(const [x,y] of [[70,128],[80,128],[70,136],[80,136]])prop('hgtb_deco_fountain',x,y,{sc:1.0});
  for(const [x,y,k] of [[66,131,'hgtb_stall_coral_fruit'],[84,131,'hgtb_stall_teal_fish'],[66,133,'hgtb_stall_yellow_bread'],[84,133,'hgtb_stall_navy_books'],[75,127,'hgtb_stall_navy_books'],[75,137,'hgtb_stall_teal_fish']])prop(k,x,y,{sc:.95});
  for(let x=67;x<=83;x+=2){hover(x,130,2+((x>>1)&1)*.6,1.1)}
  /* ---------- lanterns over the whole city: a lit grid so that from any height the city glows ---------- */
  for(let y=6;y<H-4;y+=5)for(let x=6;x<W-4;x+=5){if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y))continue;const g=ground(x,y);hgtlDecor(B,'hgt_hanglamp',x,y,{block:false,walk:true,deco:true,bob:2.6,sc:1.5});if(((x+y)%10)===0||g<-1)hgtlLight(B,x,y)}
  /* tall slender spires on the houses: pearl finials stand beside the doorsteps */
  for(const h of houseList)if(R(h.x,h.y,97)<.5&&isO(h.x-1,h.y+h.d)){hgtlDecor(B,'hgt_finial',h.x-1,h.y+h.d,{block:false,walk:true,deco:true,sc:1.5});hgtlLight(B,h.x-1,h.y+h.d)}
  /* the canyon of the porters' stair: a stall in every alcove beside the steps, wares between them, and the traders' folk on every landing */
  {const ST=HGTXG_STALL,WARE=['counter','sacks','hgtb_table','hg_jar','kh_maptable1_0','vase0'];
   alcove.forEach((c,i)=>{const side=c.x<75?0:1;if((c.k+side)%2===0)prop(ST[(i+c.t)%10],c.x,c.y,{sc:.7,ox:side?-.12:.12});else prop(WARE[(i+c.t)%6],c.x,c.y,{sc:/vase|jar/.test(WARE[(i+c.t)%6])?.5:.65});if(c.k===3)light(c.x,c.y)});
   const FOLK=[['hgtb_basket','hgx_t1'],['hgtb_jar','hgx_t2'],['hgtb_walk','hgx_t3'],['hgtb_elder','hgx_t4'],['hgtb_watch','hgx_t5'],['hgtb_lantern','hgx_t6'],['hgtb_polish','hgx_t7'],['hgtb_water','hgx_t8']];
   for(let t=0;t<=5;t++){const wt=WT(t),f=FOLK[t],g=FOLK[(t+3)%8];npc(f[0],72,wt+1,f[1],1);npc(g[0],78,wt+1,g[1],1)}}
  hgtlSetStart(B,75,144,0);
  /* ---------- more enterable houses: shop doors on every tier, and doors in the houses of the districts ---------- */
  {const SHARED=[4965,4966,4974,4975],OWN=[];for(let i=5160;i<=5203;i++)OWN.push(i);let oi=0;
   // a second shop door on every tier of the stair
   for(let t=0;t<=5;t++){const cands=shopList.filter(s=>s.t===t&&s.bw>=5&&Math.abs(s.x-75)>8&&Math.abs(s.x-75)<34&&!doorsOut.some(d=>d.x===s.x&&d.y===s.y)&&!doorsOut.some(d=>d.y===s.y&&Math.abs(d.x-s.x)<9));
     const s=cands[(t*5+1)%Math.max(1,cands.length)];if(s&&oi<OWN.length){const rid=OWN[oi++];door(s.x,s.y,s.tint,s.h,s.h+s.sh,2,rid);deco('hgt_banner',s.x-2,s.wt,{sc:.8});plant(s.x+2,s.wt+2,1.3,.6)}
     const s2=cands[(t*5+3)%Math.max(1,cands.length)];if(s2&&s2!==s&&Math.abs(s2.x-(s&&s.x))>8&&oi<OWN.length){const rid=OWN[oi++];door(s2.x,s2.y,s2.tint,s2.h,s2.h+s2.sh,2,rid)}}
   // houses of the districts
   const hs=houseList.filter(h=>!h.patio&&h.w>=4),want=SHARED.length+(OWN.length-oi);let k=0;
   for(let i=0;i<hs.length&&k<want;i++){const h=hs[i],x=h.x+(h.w>>1),y=h.y+h.d-1,ay=h.y+h.d;
     if(!isO(x,ay)||Math.abs(ground(x,ay))>.01||B.occ.has(x+','+ay)||doorsOut.some(d=>Math.hypot(d.x-x,d.y-y)<3.5))continue;
     const ws=WS[I(x,y)];if(!ws)continue;
     if(k<SHARED.length){const id=SHARED[k],r=(typeof HGTROOMS!=='undefined')&&HGTROOMS.find(q=>q.id===id),at=r?{x:r.entry.x,y:r.entry.y,f:r.entry.f}:{x:1,y:1,f:0};
       linkDoor(x,y,ws.t,0,h.tp,2,id,at,r?r.name:'A round room');if(typeof hgtrSetReturn==='function')hgtrSetReturn(id,483,{x,y:ay,f:2})}
     else{const rid=OWN[oi++];door(x,y,ws.t,0,h.tp,2,rid)}
     plant(x-1,ay,1.2,.6);hgtlDecor(B,'hgt_lamppost',x+1,ay,{block:false,walk:true,deco:true});k++
     // a second door on the far side of the same house, to a different room
     const ny=h.y,nay=h.y-1;if(k>=SHARED.length&&oi<OWN.length&&isO(x,nay)&&Math.abs(ground(x,nay))<.01&&!B.occ.has(x+','+nay)&&WS[I(x,ny)]&&!doorsOut.some(d=>Math.hypot(d.x-x,d.y-ny)<2.5)){door(x,ny,WS[I(x,ny)].t,0,h.tp,0,OWN[oi++]);plant(x+1,nay,1.2,.6)}}}
  hgtlSetStart(B,75,144,0);
  /* ---------- the south gallery of the court: stalls on the terraces, so the approach from the avenue is a market, not an empty floor ---------- */
  {const ST=HGTXG_STALL,WARE=['barrel','crate','sacks','hg_jar','vase0','hg_waxbarrel'];
   for(const y of [108,111,114,117])for(let x=36,i=0;x<=113;x+=4,i++){if(x>=70&&x<=80)continue;if(i%3===2)prop(WARE[(i+y)%6],x,y,{sc:.7});else prop(ST[(i+(y>>1))%10],x,y,{sc:.95});if(i%3===0)light(x,y+1)}
   for(let x=38;x<=112;x+=6)for(const y of [110,116])if(x<70||x>80)deco('hgt_banner',x,y,{sc:.8});
   for(let x=40;x<=110;x+=8)hover(x,113,2.1)
   for(let y=119;y<=125;y+=3)for(const x of [40,48,56,94,102,110]){plant(x,y,1.5,.7);lamp(x+1,y)}}
  /* ---------- the painted pets: in nooks, by the pools, on pads and in gardens ---------- */
  {const pet=(k,xs,o)=>{for(const [x,y] of xs){if(!isO(x,y)||B.occ.has(x+','+y)||inMz(x,y))continue;B.occ.add(x+','+y);hgtlDecor(B,k,x,y,Object.assign({block:false,walk:true,deco:true},o||{}));return true}return false};
   const around=(x,y)=>[[x,y],[x+1,y],[x-1,y],[x,y+1],[x,y-1],[x+1,y+1],[x-1,y-1],[x+2,y],[x-2,y]];
   pet('hgtb_aquawhale',around(70,140),{sc:1});pet('hgtb_peachwhale',around(82,140),{sc:1});pet('hgtb_aquawhale',around(46,88),{sc:.9});pet('hgtb_peachwhale',around(104,76),{sc:.9});
   const KINDS=['hgtb_pearlslug','hgtb_creammoth','hgtb_pinkbulb','hgtb_amberpup','hgtb_pups','hgtb_jadeeel','hgtb_lanternbeetle','hgtb_spindleray','hgtb_fishbeetle','hgtb_spindlespider'],FLY=['hgtb_lilacmoth','hgtb_jadefinmoth','hgtb_creamjelly','hgtb_fishfly'];
   let n=0;for(const p of POOLS){pet(KINDS[n%10],around(p.x+2,p.y-1));pet(KINDS[(n+3)%10],around(p.x+p.w-3,p.y+p.d));pet(FLY[n%4],around(p.x+(p.w>>1),p.y+p.d+1),{bob:.7});n++}
   for(const [x,y] of [[33,10],[117,10],[10,10],[140,10],[60,4],[90,4],[88,12],[56,12],[125,30],[125,40],[11,28],[8,30],[45,30],[105,30],[20,70],[130,90],[50,125],[100,125],[75,100],[60,90],[90,80]])pet((n++%3===0)?FLY[n%4]:KINDS[n%10],around(x,y),n%3===0?{bob:.8}:{});
   for(const m of MZ)if(m&&m.approach)pet(KINDS[(n++)%10],around(m.approach.x,m.approach.y))}
  /* ---------- people at work: sweepers on the landings, readers and fishers at the pools, walkers on routes ---------- */
  {const AG=[],sw=['I sweep the landing every morning. The dust comes down from the tiers above.','Mind the steps. They are swept, not dried.'],tiers=[0,1,2,3,4,5];
   for(const t of tiers){const wt=WT(t),y=wt+1;AG.push({kind:'npc',sprite:'hgtb_sweep',name:'Stair sweeper',lines:sw,home:{x:XW(t)+10,y},spots:[{x:XW(t)+10,y},{x:XW(t)+24,y},{x:XE(t)-24,y}],task:'clean',zone:16})}
   for(const t of [1,3,5]){const wt=WT(t),y=wt+1;AG.push({kind:'npc',sprite:'hgtb_polish',name:'Lamp polisher',lines:['A clean lamp is brighter. These are not clean yet.'],home:{x:75+8,y},spots:[{x:83,y},{x:92,y},{x:68,y}],task:'tend',zone:14})}
   AG.push({kind:'npc',sprite:'hgtb_walk',name:'Walker',lines:['I walk the court from end to end every day. It is longer than it looks.'],home:{x:40,y:69},route:[{x:40,y:69,wait:3},{x:110,y:69,wait:3},{x:110,y:70},{x:40,y:70}],zone:50});
   AG.push({kind:'npc',sprite:'hgtb_walk',name:'Walker',lines:['The gate avenue is the straightest road in the grassland.'],home:{x:75,y:121},route:[{x:75,y:121,wait:2},{x:75,y:141,wait:2}],zone:30});
   POOLS.forEach((p,i)=>{AG.push({kind:'npc',sprite:'hgtb_fisher',name:'Fisher',lines:['Nothing bites at the pool. I come for the quiet.'],home:{x:p.x+2,y:p.y-1},spots:[{x:p.x+2,y:p.y-1},{x:p.x+p.w-3,y:p.y-1}],task:'fish',zone:8});
     AG.push({kind:'npc',sprite:'hgtb_read',name:'Reader',lines:['I read the price lists. They change every season.'],home:{x:p.x+(p.w>>1),y:p.y+p.d+1},spots:[{x:p.x+(p.w>>1)-2,y:p.y+p.d+1}],task:'read',zone:4})});
   for(const [x,y] of [[125,40],[125,30],[11,30],[9,26]])AG.push({kind:'npc',sprite:'hgtb_plantbed',name:'Garden tender',lines:['The gardens need tending every day. The light plants do not last without it.'],home:{x,y},spots:[{x,y},{x:x+3,y}],task:'tend',zone:8});
   if(typeof hgtlfRegister==='function')hgtlfRegister(483,{agents:AG})}
  /* more creatures spread over the quiet streets, one about every 8 cells */
  {const KINDS=['hgtb_pearlslug','hgtb_creammoth','hgtb_pinkbulb','hgtb_amberpup','hgtb_pups','hgtb_jadeeel','hgtb_lanternbeetle','hgtb_spindleray','hgtb_fishbeetle','hgtb_spindlespider','hgtb_lilacmoth','hgtb_jadefinmoth','hgtb_creamjelly','hgtb_fishfly'];let n=0;
   for(let gy=7;gy<142;gy+=8)for(let gx=7;gx<142;gx+=8){if(R(gx,gy,120)<.25)continue;let done=false;
     for(let r=0;r<=3&&!done;r++)for(let dy=-r;dy<=r&&!done;dy++)for(let dx=-r;dx<=r&&!done;dx++){const x=gx+dx,y=gy+dy;if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y)||Math.abs(ground(x,y))>3.2||B.kind[I(x,y)]===G.STAIR)continue;
       const k=KINDS[n++%14];B.occ.add(x+','+y);hgtlDecor(B,k,x,y,Object.assign({block:false,walk:true,deco:true},n%14>9?{bob:.8}:{}));done=true}}}
  hgtlSetStart(B,75,144,0);
  /* ---------- edges: pillars and hanging plants along the summit, vines and lamps along the great wall ---------- */
  for(let x=53;x<=91;x+=3){if((x>=56&&x<=62)||(x>=66&&x<=82))continue;wall(x,13,'m','band',SH,SH+3.4);plant(x,12,1.8,.5,'hgt_willow');plant(x+1,12,1.4,.6,'hgt_lightvine')}
  for(let x=53;x<=96;x+=2){plant(x,3,1.9,.5,x%4?'hgt_lightvine':'hgt_willow');if(x%8===1)hover(x,6,2.6)}
  for(let k=3;k<=146;k+=3){for(const [x,y] of [[k,3],[k,146],[3,k],[146,k]]){if(isO(x,y)&&!B.occ.has(x+','+y)&&Math.abs(ground(x,y))<.01)plant(x,y,1.7,.5,k%6?'hgt_lightvine':'hgt_willow')}}
  for(let k=8;k<=144;k+=12){for(const [x,y] of [[k,4],[k,145],[4,k],[145,k]])lamp(x,y)}
  /* ---------- a focal point every 15 to 20 cells on the open ground ---------- */
  {const FOC=['hgt_fairytree','hgt_fountain','hgt_obelisk','hgt_willow','hgt_giantcap','hgt_cupola'];let fi=0;
   for(let gy=10;gy<140;gy+=16)for(let gx=10;gx<142;gx+=16){let done=false;
     for(let r=0;r<=6&&!done;r++)for(let dy=-r;dy<=r&&!done;dy++)for(let dx=-r;dx<=r&&!done;dx++){const x=gx+dx,y=gy+dy;if(!free(x-2,y-2,x+2,y+2)||B.occ.has(x+','+y))continue;
       const k=FOC[fi++%6];prop(k,x,y,{sc:k==='hgt_fountain'?1.3:k==='hgt_obelisk'?1.4:1.7});light(x,y+1);
       for(const [a,b] of [[-2,0],[2,0]])lamp(x+a,y+b);for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])plant(x+a,y+b,1.3,.7);deco('bench',x,y+2,{});named('Garden',x,y-1,'small');
       for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)RES[I(x+a,y+b)]=1;done=true}}}
  /* the Undercroft stair is five wide, so its edges can carry lamps, glow plants and hanging lanterns */
  for(let y=91;y<=102;y+=2){for(const x of [73,77]){if((y/2|0)%2)lamp(x,y);else plant(x,y,1.3,.9,'hgtb_plant_glowshrooms')}hover(75,y,1.5+((y>>1)&1)*.4,1.3)}
  for(let y=92;y<=102;y+=3)for(const x of [73,77])hgtlLight(B,x,y);
  /* night: lamps and glitter in the dark zones (the Undercroft hall, the hanging gardens, the court floor), and lanterns hung high so the city glows from above */
  for(let x=68;x<=82;x+=2){lamp(x,104);lamp(x,106);plant(x,105,1.2,.9,'hgtb_plant_glowshrooms')}
  for(let k=0;k<7;k++)hover(69+k*2,105,1.5+(k&1)*.5,1.3);
  for(let j=0;j<22;j++){const y=46-j;if(j%2===0){lamp(119,y);lamp(131,y)}for(const x of [122,125,128])if(R(x,y,130)<.35)plant(x,y,1.3,.9,'hgtb_plant_glowshrooms');if(j%3===1)hover(125,y,1.8,1.3)}
  for(let y=21;y<=24;y++)for(let x=120;x<=130;x+=2){hover(x,y,1.6+((x+y)&1)*.5,1.2);if(R(x,y,131)<.5)plant(x,y,1.3,.9,'hgtb_plant_lacecoral')}
  for(let y=70;y<=104;y+=6)for(let x=38;x<=112;x+=12){if(x>=66&&x<=84&&y>=80)continue;lamp(x,y+1);plant(x+1,y+1,1.3,.8,'hgtb_plant_glowshrooms')}
  for(let gy=8;gy<142;gy+=9)for(let gx=8;gx<142;gx+=9){const x=gx+((R(gx,gy,140)*4)|0),y=gy+((R(gx,gy,141)*4)|0);if(!isO(x,y)||inMz(x,y))continue;hgtlDecor(B,'hgtb_deco_lanterns',x,y,{block:false,walk:true,deco:true,bob:6+R(x,y,142)*7,sc:2.2});hgtlLight(B,x,y)}
  /* big plain floors: plant clusters, benches and creatures every few cells */
  for(let gy=6;gy<144;gy+=6)for(let gx=6;gx<144;gx+=6){const x=gx+((R(gx,gy,150)*3)|0),y=gy+((R(gx,gy,151)*3)|0);if(!isO(x,y)||inMz(x,y)||B.occ.has(x+','+y)||Math.abs(ground(x,y))>.01||B.kind[I(x,y)]===G.STAIR||R(x,y,152)<.45)continue;
    plant(x,y,1.5,.7);plant(x+1,y,1.1,.6);plant(x,y+1,1.2,.6);if(R(x,y,153)<.3)deco('bench',x+2,y,{})}
  /* the stairs of the bazaar court and every tier: bracket lamps on the walls, hanging lanterns and window glow along the flights */
  for(let t=0;t<=5;t++){const wt=WT(t),west=t%2===0,sx0=west?XW(t+1):XE(t+1)-4;
    for(let k=1;k<=6;k++){const y=wt-k;for(const x of [sx0,sx0+4]){hgtlDecor(B,'hgtb_lamp_bracket',x,y,{block:false,walk:true,deco:true,bob:1.5,sc:1.1});if(k%2===0)hgtlLight(B,x,y)}
      if(k%2===1){hgtlDecor(B,'hgtb_lamp_hanging',sx0+2,y,{block:false,walk:true,deco:true,bob:1.9,sc:1.3});hgtlLight(B,sx0+2,y)}}
    for(const x of [sx0-1,sx0+5]){lamp(x,wt+1);hgtlLight(B,x,wt)}
    for(let k=1;k<=6;k+=2){for(const x of [72,77]){hgtlDecor(B,'hgtb_lamp_bracket',x,wt-k,{block:false,walk:true,deco:true,bob:1.4,sc:1.1});hgtlLight(B,x,wt-k)}}}
  /* the foot of every flight: lamp pools, a bright mushroom glow on the lowest treads and landings */
  for(let t=0;t<=5;t++){const wt=WT(t),west=t%2===0,sx0=west?XW(t+1):XE(t+1)-4,GL=['hgtb_plant_glowshrooms','hgtb_plant_lacecoral','hgtb_plant_orbbush'];
    for(let k=1;k<=3;k++)for(const x of [sx0,sx0+1,sx0+3,sx0+4]){if((x+k)%2===0)plant(x,wt-k,1.6,1,GL[(x+k+t)%3]);hgtlLight(B,x,wt-k);hgtlLight(B,x,wt-k)}
    for(let x=sx0-2;x<=sx0+6;x+=2){plant(x,wt+1,1.7,1,GL[(x+t)%3]);plant(x,wt+2,1.4,1,GL[(x+t+1)%3]);hgtlLight(B,x,wt+1);hgtlLight(B,x,wt+1)}
    for(const x of [sx0-1,sx0+5]){lamp(x,wt+2);lamp(x,wt);hgtlLight(B,x,wt+1);hgtlLight(B,x,wt+1)}
    for(const x of [73,76,72,77]){plant(x,wt+1,1.5,1,GL[(x+t)%3]);hgtlLight(B,74,wt+1)}}
  hgtlSetStart(B,75,144,0);
  /* ---------- finish: walls made by the library (placeholder characters) become my wall columns, standing on the ground ---------- */
  {const TM={a:'p',b:'a',c:'c',d:'l'};
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=B.rows[y][x];if(c==='.'||WS[I(x,y)]||!HGTL_ROLE[c])continue;const role=HGTL_ROLE[c],m=/^nacre_([abcd])/.exec(role),i=I(x,y);
     const kind=/window/.test(role)?'win':/band|pillar|door|roof|hedge|rail/.test(role)?'band':'wmid';
     WS[i]={t:m?TM[m[1]]:(role==='hedge'?'a':'c'),kind,top:B.h[i]+(HGTL_WH[c]||2.4),foot:B.h[i],door:null}}}
  if(B.fm)for(let i=0;i<W*H;i++)if(B.fm[i]&&!FL[i])FL[i]=B.fm[i];
  /* ---------- finish: make the wall pictures ---------- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const s=WS[I(x,y)];if(!s)continue;
    let foot=s.foot===undefined?B.h[I(x,y)]:s.foot;
    if(!s.fixed){for(const dd of HGTL.DIRS){const nx=x+dd[0],ny=y+dd[1];if(inb(nx,ny)&&isO(nx,ny))foot=Math.min(foot,ground(nx,ny))}}
    if(s.pre){continue}
    if(!HGTXG_TINT[s.t]){console.error('bad tint',x,y,s.t,s.kind);s.t='c'}
    const top=Math.max(s.top,foot+.6);B.h[I(x,y)]=foot;
    B.rows[y][x]=s.kind==='door'?dch(s.t,top-foot,s.door.lvl,s.door.at):wch(s.t,s.kind,top-foot)}
  for(const d of B.decor)if(HGTXG_DECOR[d.k])d.k=HGTXG_DECOR[d.k];
  {const LV=['hgtb_lamp_tall','hgtb_lamp_vine','hgt_lamppost','hgtb_lamp_bare','hgtb_lamp_short','hgtb_lamp_tall'],HV=['hgt_hanglamp','hgtb_lamp_hanging','hgtb_deco_lanterns','hgt_hanglamp'];
   for(const d of B.decor){const hv=R(d.x,d.y,99);if(d.k==='hgt_lamppost')d.k=LV[(hv*LV.length)|0];else if(d.k==='hgt_hanglamp')d.k=HV[(hv*HV.length)|0]}}
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){const i=I(x,y),k=B.kind[i];let f=FL[i];if(!f){f=k===G.STAIR?1:k===G.PLAT||k===G.PLAZA?3:k===G.COURT||k===G.TERRACE?2:k===G.ALLEY?4:(((x/6)|0)+((y/6)|0))%3===0?3:((((x/6)|0)+((y/6)|0))%3===1&&((x%6===0||y%6===0))?4:0)}r+=f}fm.push(r)}
  const lv=hgtlAssemble(B,{name:'Glorm',label:'Glorm',diff:HG.DIFF,start:B.start,extra:{fmap:fm,floorSet:['hgtb_f_terrazzo','hgt_f4','hgtb_f_diamonds','hgtb_f_marble','hgtb_f_shellflags','hgtb_f_mossy'],floor:'hgtb_f_terrazzo',ceil:'tomb',ceilH:9,amb:.9,noExtras:true}});
  const chars={};for(const c in hgtaChars)chars[c]=hgtaChars[c];lv.chars=chars;
  {const RB='saturate(1.3) brightness(1.12) contrast(1.05)',rs=['hgt_wp','hgt_wa','hgt_wl','hgt_wc'].map(n=>mkTile(n,1,{boost:RB})),rg=new Int32Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=I(x,y);rg[i]=rs[(B.kind[i]===G.COURT||B.kind[i]===G.TERRACE)?1:((x>>3)+(y>>3)*3)&3]}
    lv.terrace.riser=rs[3];lv.terrace.rg=rg}
  lv.hgtxB=B;lv.hgtxDoors=doorsOut;lv.hgtxShops=shopList;lv.hgtxHouses=houseList;lv.hgtxMz=MZ;lv.hgtxRoost=ROOST;
  return lv;
}
hgtRegister(483,hgtxglormBuild);

/* ---------- the twenty interiors: small rooms with pearl walls, built the same way every time ---------- */
/* what stands in each room: [kind, x, y, extra]; npc entries are [kind, x, y, npcId]. The room is w wide and d deep, walls on the border, the way out is the south wall middle. */
const HGTXG_FIT={
 hall:[['hgtb_furn_books_globe',6,2],['hgtb_furn_table_chairs',3,5],['hgtb_furn_table_chairs',9,5],['hgt_banner',3,1,'d'],['hgt_banner',9,1,'d'],['hgt_lamppost',2,3,'d'],['hgt_lamppost',10,3,'d'],['hgt_pearlbush',1,1,'d'],['hgt_pearlbush',11,1,'d'],['hgt_fern',1,7,'d'],['hgt_fern',11,7,'d'],['npc','hg_npc5',4,3,'hgx_weigher'],['npc','hg_npc4',8,2,'hgx_porter1']],
 observatory:[['kh_maptable1_1',4,3],['hgtb_table',2,2],['hgtb_furn_bookshelf',6,1],['hgtb_furn_bookshelf',2,1],['hgt_crystalgrass',7,6,'d'],['hgt_obelisk',1,6],['hgt_lamppost',7,2,'d'],['hgt_lamppost',1,4,'d'],['npc','hg_npc0',6,5,'hgx_keeper']],
 exchange:[['counter',3,2],['counter',7,2],['hgt_chimney',1,1],['hgt_chimney',9,1],['vase0',1,6],['vase2',9,6],['hgt_lamppost',5,2,'d'],['hgt_lamppost',2,5,'d'],['hgt_lamppost',8,5,'d'],['npc','hg_npc5',5,1,'hgx_pearl']],
 bakery:[['counter',4,2],['barrel',1,1],['barrel',7,1],['sacks',1,5],['sacks',7,5],['crate',2,1],['hgt_lamppost',2,3,'d'],['hgt_lamppost',6,3,'d'],['npc','hg_npc1',4,1,'hgn_sprell'],['npc','hg_npc3',6,4,'hgx_baker2']],
 carpets:[['hgtb_deco_banner',2,1,'d'],['hgt_banner',5,1,'d'],['hgt_banner',8,1,'d'],['counter',5,2],['crate',1,5],['crate',9,5],['hgt_lamppost',2,3,'d'],['hgt_lamppost',8,3,'d'],['npc','hg_npc1',3,2,'hgx_carpet']],
 store:[['crate',1,1],['crate',2,1],['crate',5,1],['sacks',1,5],['sacks',5,5],['barrel',5,3],['hgt_lamppost',3,3,'d']],
 counting:[['hgtb_table',3,2],['hgtb_table',7,2],['hgtb_furn_bookshelf',1,1],['hgtb_furn_bookshelf',9,1],['chest',5,1],['chest',1,6],['hgtb_lamp_short',5,3],['hgt_lamppost',2,4,'d'],['hgt_lamppost',8,4,'d'],['hgt_fern',1,2,'d'],['hgt_fern',9,6,'d']],
 maps:[['kh_maptable1_0',4,3],['hgtb_table',1,2],['hgtb_furn_bookshelf',7,1],['hgtb_furn_bookshelf',1,1],['hgt_lamppost',6,4,'d'],['hgt_lamppost',2,5,'d'],['npc','hg_npc0',5,2,'hgx_cartog']],
 lanterns:[['hgt_gardenlantern',2,1],['hgt_gardenlantern',4,1],['hgt_gardenlantern',6,1],['hgt_hanglamp',1,3],['hgt_hanglamp',7,3],['counter',4,3],['crate',1,5],['hgt_lamppost',7,5,'d'],['npc','hg_npc1',5,2,'hgx_lantern']],
 vault:[['hgt_obelisk',7,5],['chest',2,1],['chest',12,1],['chest',2,8],['chest',12,8],['hg_jar',4,1],['hg_jar',10,1],['hg_waxbarrel',3,6],['hg_waxbarrel',11,6],['hgt_crystalgrass',1,5,'d'],['hgt_crystalgrass',13,5,'d'],['hgt_lamppost',5,3,'d'],['hgt_lamppost',9,3,'d'],['hgt_lamppost',5,7,'d'],['hgt_lamppost',9,7,'d'],['npc','hg_npc6',7,3,'hgx_vault']],
 treasury:[['hg_chestjelly',3,2],['hg_chestjelly',5,2],['hg_chestwax',2,4],['hg_chestweed',6,4],['hgt_obelisk',4,1],['hgt_lamppost',1,2,'d'],['hgt_lamppost',7,2,'d']],
 healer:[['hgt_mushrooms',1,1,'d'],['hgt_mushrooms',7,1,'d'],['hg_jar',2,1],['hg_jar',6,1],['counter',4,2],['hgtb_furn_bookshelf',1,3],['hgt_lamppost',3,4,'d'],['hgt_lamppost',6,4,'d'],['npc','hg_npc6',4,1,'hgx_vault']],
 spice:[['hg_jar',1,1],['hg_jar',3,1],['hg_jar',5,1],['hg_jar',7,1],['hg_jar',9,1],['sacks',1,5],['sacks',9,5],['barrel',4,3],['barrel',6,3],['hgt_lamppost',2,3,'d'],['hgt_lamppost',8,3,'d'],['npc','hg_npc5',5,2,'hgx_spice']],
 bells:[['hgt_chime',2,1],['hgt_chime',4,1],['hgt_chime',6,1],['hgt_obelisk',4,4],['barrel',1,6],['crate',7,6],['hgt_lamppost',1,3,'d'],['hgt_lamppost',7,3,'d'],['npc','hg_npc4',2,5,'hgx_bell']],
 glass:[['hgt_gardenlantern',1,1],['hgt_gardenlantern',7,1],['vase0',2,1],['vase2',6,1],['counter',4,3],['hgt_hanglamp',1,4],['hgt_hanglamp',7,4],['npc','hg_npc6',4,2,'hgx_glass']],
 inn:[['hgtb_furn_table_chairs',3,3],['hgtb_furn_table_chairs',9,3],['hgtb_furn_table_chairs',3,6],['hgtb_furn_table_chairs',9,6],['counter',6,1],['barrel',1,1],['barrel',11,1],['hgt_lamppost',6,4,'d'],['hgt_lamppost',1,5,'d'],['hgt_lamppost',11,5,'d'],['hgt_fern',1,7,'d'],['hgt_fern',11,7,'d'],['npc','hg_npc1',5,2,'hgx_innkeep'],['npc','hg_npc4',2,2,'hgx_porter1']],
 keeper:[['chest',1,1],['hg_chestjelly',5,1],['hgt_obelisk',3,1],['hgtb_lamp_short',5,4],['hgt_lamppost',1,5,'d'],['hgt_lamppost',5,5,'d'],['npc','hg_npc4',3,3,'hgx_keeper']],
 weavers:[['hgt_reeds',1,1,'d'],['hgt_reeds',3,1,'d'],['hgt_reeds',5,1,'d'],['hgt_reeds',7,1,'d'],['hgt_willow',1,4],['counter',4,3],['sacks',7,5],['hgt_lamppost',2,3,'d'],['hgt_lamppost',7,3,'d'],['npc','hg_npc1',5,2,'hgx_weaver']],
 brewer:[['barrel',1,1],['barrel',2,1],['barrel',3,1],['barrel',7,1],['hg_waxbarrel',1,5],['hg_waxbarrel',7,5],['counter',4,2],['hgt_lamppost',2,3,'d'],['hgt_lamppost',6,3,'d'],['npc','hg_npc5',5,3,'hgx_brewer']],
 gallery:[['hgt_banner',2,1,'d'],['hgt_banner',5,1,'d'],['hgt_banner',8,1,'d'],['hgtb_furn_clock',1,3],['hgtb_furn_clock',9,3],['hg_chestjelly',5,3],['hgt_fairytree',2,5],['hgt_fairytree',8,5],['hgt_lamppost',5,5,'d'],['hgt_lamppost',3,3,'d'],['hgt_lamppost',7,3,'d']]};

/* forty-four more houses and workshops, ids 5160 to 5203, built from the same themes */
{const NM=['Rope Maker','Sail Loft','Cooper','Potter','Dyer','Saddle Maker','Net Maker','Tallow Chandler','Scale Maker','Ledger Hall','Messenger House','Customs Office','Guild Hall','Water Seller','Reed Cutter','Salt Store','Coin Changer','Weigher’s Lodge','Caravan Inn','Stairwarden’s Room','Rug Beater','Bone Carver','Shell Polisher','Wick Store','Key Maker','Cheese Cellar','Cloth Stall','Spice Stall','Pearl Stall','Lantern Stall','Basket Stall','Map Stall','Bell Cutter','Coin Weigher','Hide Dealer','Tile Maker','Oil Seller','Wax Maker','Bread Oven','Tea House','Tool Smith','Wool Store','Dye Works','Seal Cutter'];
 const TH=Object.keys(HGTXG_FIT).filter(k=>!['vault','treasury','gallery','hall'].includes(k)),FOLK=['hgtb_sweep','hgtb_basket','hgtb_water','hgtb_polish','hgtb_read','hgtb_fisher','hgtb_watch','hgtb_walk','hgtb_plantbed','hgtb_jar','hgtb_lantern','hgtb_elder'];
 NM.forEach((n,i)=>{const id=5160+i;if(i%3===0){const cid=5210+(i/3|0);HGTXG_ROOMS[cid]={n:n+' Back Room',w:7,d:7,t:'pacl'[(i+1)%4],fl:'hgt_f5',deco:TH[(i+5)%TH.length],extra:'hgx_h'+i+'b'};LEVEL_NAMES[cid]=n+' Back Room';hgtbNpc('hgx_h'+i+'b','Assistant',FOLK[(i+5)%12],['This room holds the stock. Ask in the front room if you want something.'])}
  HGTXG_ROOMS[id]={up:i%3===0?5210+(i/3|0):undefined,n,w:[7,9,11][i%3],d:[7,9][(i>>1)%2],t:'pacl'[i%4],fl:['wood','hgt_f0','hgt_f5','hgt_f3'][i%4],deco:TH[i%TH.length],extra:'hgx_h'+i};LEVEL_NAMES[id]=n;
  hgtbNpc('hgx_h'+i,n.replace(/ (Stall|Hall|Store|Loft)$/,'')+' keeper',FOLK[i%12],['This is the '+n.toLowerCase()+'. It opens early and closes when the lamps on the stair are lit.','Trade here goes up the stair in baskets. Take care on the steps with a load.'])});
}
/* the rooms that hang off another room: parent id -> child id (a door in the north wall of the parent) */
function hgtxglormRoomBuild(rid){
  const r=HGTXG_ROOMS[rid],w=r.w,d=r.d,n=HGTXG_TINT[r.t];
  if(!LEVELS[483])KH_LAZY[483]&&KH_LAZY[483]();
  const city=LEVELS[483],out=city&&city.hgtxDoors?city.hgtxDoors.find(q=>q.id===rid):null;
  let parent=null;for(const k in HGTXG_ROOMS)if(HGTXG_ROOMS[k].up===rid)parent=+k;
  const PAT=['hgt_w3_relief_pink','hgt_w3_fresco_cream','hgt_w3_scroll_aqua','hgt_w3_balcony_cream','hgt_w3_arcade_cream','hgt_w3_shop_pink','hgt_w3_relief_aqua','hgt_w3_fresco_amber','hgt_w3_scroll_pink','hgt_w3_arcade_lilac','hgt_w3_reed_lilac','hgt_w3_shop_cream'],p1=PAT[(rid*7+(rid>>3))%PAT.length],p2=PAT[(rid*5+3)%PAT.length];
  const wallG=hgtxglormTile(p1,2.7,{base:p1,mid:p1,top:'hgt_w3_cornice_cream'}),wallC=hgtxglormTile(p2,2.7,{base:p2,mid:p2,top:'hgt_w3_cornice_cream'}),wallW=hgtxglormTile('hgt_w2_winpink',2.7,{base:'hgt_w2_winpink',mid:p1,top:'hgt_w3_cornice_cream'});
  const chars={},ch=g=>{let c=hgtaChar(g);chars[c]=g;return c};
  const cw=ch(wallG),cb=ch(wallC),cwin=ch(wallW),rows=[];
  for(let y=0;y<d;y++){let s='';for(let x=0;x<w;x++){const e=x===0||y===0||x===w-1||y===d-1;s+=e?((x+y)%3===0?cb:((x+y)%3===1&&x>0&&x<w-1?cwin:cw)):'.'}rows.push(s.split(''))}
  const SOL=[],solid=(x,y)=>{if(x>0&&y>0&&x<w-1&&y<d-1&&!(x===(w>>1)&&(y===d-2||y===1))){rows[y][x]=cb;SOL.push(x+','+y)}};
  if(rid>=5160){const v=rid%6;
    if(v%2===0){solid(2,2);solid(w-3,2);solid(2,d-3);solid(w-3,d-3)}                                  // corner pillars
    if(v%3===1){for(let x=1;x<=3;x++)solid(x,d-4);solid(3,d-3);solid(3,d-2)}                         // a recess in the south west corner
    if(v===2||v===5){for(let y=2;y<=((d>>1)-1);y++)solid(w-4,y)}                                       // a half partition on the east
    if(v===3){for(let x=w-4;x<w-1;x++)solid(x,d-4);solid(w-4,d-3);solid(w-4,d-2)}                     // a recess in the south east corner
  }
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
  if(r.extra)decor.push({k:'hg_npc1',x:Math.max(1,(w>>1)+1),y:d-3,block:false,walk:true,npc:r.extra,sc:1});
  {const rnd=k=>hash2(rid,k,917),used=new Set(decor.map(q=>q.x+','+q.y).concat(SOL)),cx=w>>1,cy=d>>1;
   const RC={},put=(k,x,y,f,sc)=>{if(x<=0||y<=0||x>=w-1||y>=d-1||used.has(x+','+y)||(x===cx&&(y===1||y>=d-2))||(!f&&(RC[y]||0)>=3))return false;used.add(x+','+y);if(!f)RC[y]=(RC[y]||0)+1;decor.push(f?{k,x,y,block:false,walk:true,deco:true,sc:sc||1}:{k,x,y,block:true,sc:sc||.85});return true};
   const CENTER=['hgtb_furn_table_chairs','hgtb_deco_fountain','hgtb_furn_stage','hgtb_deco_pearlplinth','hgtb_deco_shellstatue','hgtb_furn_books_globe','counter','hgtb_furn_loom','hgtb_table','kh_maptable1_0','hgtb_stall_aqua_jars','hgtb_stall_navy_books','hgtb_stall_lilac_cloth','hgtb_stall_sage_herbs','hgtb_stall_orange_pottery','hgtb_stall_pink_flowers'];
   const WALLP=['hgtb_furn_bookshelf','hgtb_furn_cabinet','hgtb_furn_clock','hgtb_furn_hearth','hgtb_furn_loom','hgtb_furn_bed','hgtb_furn_bunk','hgtb_deco_banner','hgtb_plant_belltree','hgtb_plant_spiralfern','hgtb_lamp_tall','hgtb_lamp_vine','vase0','vase2','hg_jar','barrel','crate','sacks','urn','hgtb_deco_lanterns','hgtb_deco_pearlplinth','counter2'];
   const SMALL=['barrel','crate','hg_jar','sacks','vase0','vase2','urn','hgtb_plant_orbbush','hgtb_plant_potvine','hgtb_plant_glowshrooms','hgtb_plant_lupin','hgtb_plant_lacecoral','hgtb_plant_tealgrass','hgtb_bench','hgtb_chair'];
   const pick=(L,k)=>L[((rnd(k)*L.length)|0)];
   let last='';const wp=(k)=>{let a=pick(WALLP,k),n=0;while(a===last&&n++<6)a=pick(WALLP,k+n*17);last=a;return a};
   // centrepiece (one per room, different from room to room) and a second feature
   const c1=pick(CENTER,1);put(c1,cx+(rnd(2)<.5?-1:1),cy,0,/stall/.test(c1)?.9:1);const c2=pick(CENTER,3);if(c2!==c1)put(c2,cx+(rnd(4)<.5?-2:2),cy+((rnd(5)*2|0)-1),0,/stall/.test(c2)?.8:.9);
   // wall props on the three walls: a different run on each, with gaps
   for(let x=2;x<w-2;x+=2+(rnd(x)<.4?1:0))if(rnd(x+60)<.8)put(wp(x),x,1,0);
   for(let y=2;y<d-2;y+=2+(rnd(y+9)<.4?1:0)){if(rnd(y+70)<.7)put(wp(y+100),1,y,0);if(rnd(y+80)<.6)put(wp(y+200),w-2,y,0)}
   for(let k=0;k<4+(rid%3);k++)put(pick(SMALL,300+k),1+((rnd(k+400)*(w-2))|0),2+((rnd(k+410)*(d-4))|0),0,.6);
   // corners: plants and lamps; windows: lamps in brackets and bunting hung across
   for(const [x,y] of [[1,1],[w-2,1],[1,d-2],[w-2,d-2]])put(pick(['hgtb_plant_belltree','hgtb_plant_spiralfern','hgtb_lamp_tall','hgtb_plant_lupin','hgtb_lamp_vine'],x*7+y),x,y,1,1.2);
   put('hgtb_lamp_bracket',2,1,1);put('hgtb_lamp_bracket',w-3,1,1);lights.push([2,2],[w-3,2],[cx,d-3]);
   decor.push({k:'hgtb_deco_bunting',x:cx,y:2,block:false,walk:true,deco:true,bob:1.5,sc:1.4});
   const PETS=['hgtb_pearlslug','hgtb_creammoth','hgtb_pinkbulb','hgtb_amberpup','hgtb_pups','hgtb_jadeeel','hgtb_lanternbeetle','hgtb_fishbeetle','hgtb_spindleray','hgtb_lilacmoth','hgtb_jadefinmoth','hgtb_creamjelly','hgtb_fishfly','hgtb_creammoth','hgtb_spindlespider','hgtb_amberpup'];
   put(PETS[(rid*7+3)%16],w-2,d-2,1);if(rid%3===0)put('hg_chestjelly',1,d-2,0);
   decor.push({k:['hgtb_furn_chandelier','hgtb_furn_chandelier_lantern','hgt_hanglamp'][rid%3],x:cx,y:Math.max(2,cy-1),block:false,walk:true,deco:true,bob:1.4,sc:1.2});lights.push([cx,cy]);
   const FOLKI=['hgtb_sweep','hgtb_basket','hgtb_water','hgtb_polish','hgtb_read','hgtb_fisher','hgtb_watch','hgtb_walk','hgtb_plantbed','hgtb_jar','hgtb_lantern','hgtb_elder'],fi=FOLKI[rid%12];for(const q of decor)if(q.npc===r.extra)q.k=fi}
  {const cnt={};for(const q of decor){if(!q.block||q.npc)continue;(cnt[q.y]=cnt[q.y]||[]).push(q)}
   for(const y in cnt){const L=cnt[y];if(L.length>3){const occ=new Set(decor.map(q=>q.x+','+q.y));L.slice(3).forEach((q,i)=>{for(const dy of [2,-2,3,-3]){const ny=q.y+dy;if(ny>0&&ny<d-2&&!occ.has(q.x+','+ny)&&rows[ny][q.x]==='.'){occ.delete(q.x+','+q.y);q.y=ny;occ.add(q.x+','+ny);break}}})}}}
  lights.push([w>>1,d-2],[w>>1,2]);
  const fmap=[];for(let y=0;y<d;y++){let s='';for(let x=0;x<w;x++)s+=(Math.abs(x-(w>>1))<=2&&y>=(d>>1)-1&&y<=(d>>1)+1)?'1':'0';fmap.push(s)}
  return {rows:rows.map(a=>a.join('')),chars,start:{x:w>>1,y:d-2,f:0},enemies:[],items:[],decor,lights,portals:[],floor:r.fl==='wood'?'wood':hgtxglormFloor(r.fl),fmap,floorSet:[['hgtb_f_planks','hgtb_f_terrazzo','hgtb_f_marble','hgtb_f_reed'][rid%4],['hgtb_f_floral','hgtb_f_lotus','hgtb_f_mandala','hgtb_f_rosette','hgtb_f_star','hgtb_f_circles','hgtb_f_petals','hgtb_f_sunburst'][rid%8],'pale','dirt','mosscobble','stainedcobble'],ceil:'tomb',ceilH:2.7,day:0,amb:.5,torchGap:1e9,noTele:true,noExtras:true,diff:HG.DIFF,name:r.n,label:r.n,mapNames:[]}}
function hgtxglormFloor(n){return n}
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
/* ---------- motion over the open spans: schools of fish and winged creatures drift over the plazas, the court and the gardens ---------- */
const HGTXGM_MOTION={on:0};
function hgtxglormMotion(){
  if(typeof hgtgSchool!=='function'||typeof hgtgSpawn!=='function')return;const L=LEVEL===483&&LEVELS[483];
  const ring=(cx,cy,r,z)=>[[cx-r,cy-r,z],[cx+r,cy-r,z+.4],[cx+r,cy+r,z],[cx-r,cy+r,z+.4]];
  hgtgSchool(483,{route:ring(75,132,8,2.4),n:7,scale:.9,tints:['pearl','rose','gold','aqua'],seed:5,speed:.5});
  hgtgSchool(483,{route:ring(75,86,12,2.8),n:6,scale:1,tints:['violet','pearl','glow'],seed:6,speed:.45});
  hgtgSchool(483,{route:ring(125,35,9,3.4),n:5,scale:.9,tints:['gold','rose'],seed:7,speed:.4});
  hgtgSchool(483,{route:ring(75,112,16,2.6),n:6,scale:1,tints:['aqua','pearl'],seed:8,speed:.5});
  for(const [x,y,n] of [[60,126,'hgtg_butterfly'],[90,126,'hgtg_moth'],[50,80,'hgtg_butterfly'],[100,80,'hgtg_dragonfly'],[30,100,'hgtg_moth'],[120,100,'hgtg_butterfly'],[75,20,'hgtg_bellmoth']])
    try{hgtgSpawn(n,{level:483,x,y,scale:1.2,speed:.7,route:ring(x,y,6,2.2)})}catch(e){console.error('motion',e)}
  if(L&&L.hgtxRoost)for(const r of L.hgtxRoost)try{hgtgSpawn('hgtg_peacock',{level:483,x:r.x+1.9,y:r.y-1.6,scale:.7})}catch(e){}
}
{const _u=update;update=function(dt){if(LEVEL===483&&G.state==='play'&&!HGTXGM_MOTION.on&&LEVELS[483]){HGTXGM_MOTION.on=1;try{hgtxglormMotion()}catch(e){console.error('hgtxMotion',e)}}else if(LEVEL!==483)HGTXGM_MOTION.on=0;return _u.apply(this,arguments)}}
