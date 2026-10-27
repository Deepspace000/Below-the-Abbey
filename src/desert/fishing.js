/* ==========================================================================
   FISHING (prefix fsh / FSH). Data is in fishing_data.js (5 rods, 40 fish, 6 baits, a bottle with a message). The rules:
   - Water next to the shore has darker patches (fishing spots), drawn on the water in the 3D view. They can be clicked.
   - With a rod in the bag, stand at the shore facing a patch and press G, Space or Enter (or click the patch, or press the Fish button).
   - A cast: the rod swings, the bobber lands on the patch, there is a wait, a bite, and then a line game: a cursor runs along a bar and one press
     while it is over the gold zone pulls the line in. A miss lets the fish go. A good pull must then beat the odds: the rod's chance (20, 32, 45, 58, 70 percent)
     plus the bait's. Then: about 6 percent an old boot, 3 percent a bottle with a message, 1 percent a jewel (rods nudge the jewel), otherwise a fish by rarity.
   - Esc reels in at any time. One bait is used per cast (pick it with the Bait button on the fishing prompt).

   API FOR MORE SPOTS (any level, call at load time from any file loaded after this one; the level need not be built yet):
     fshAddSpots(levelId, [ {x,y}, {x,y,dx,dy}, ... ], {water:'fresh'|'salt'|'deep'});
        {x,y}          the WATER square that is a fishing spot (a dark patch is drawn on it).
        {x,y,dx,dy}    (x,y) is the square the party STANDS on (shore, pier end, quay edge); the patch goes on the two water squares (x+dx,y+dy) and
                       (x+2dx,y+2dy). (dx,dy) is the direction toward the water: (0,-1) north, (1,0) east, (0,1) south, (-1,0) west.
        These squares need not be water in the level's floor data (use it for lakes drawn as scenery, quays, piers). They are drawn as patches, can be clicked,
        and are fished by pressing G / Space / Enter when the party faces them within three squares.
     fshSetWater(levelId, 'fresh'|'salt'|'deep');   the kind of water of a whole level (default: fresh; salt for the sea levels, deep for the Deeper Hollow)
     fshAuto(levelId, false);                       switch off the automatic patches found along every shore of the level's water floors (default on)
   FISH BY HABITAT (letter in the 12th field of FSH_FISH: f fresh, s salt, d deep). Every habitat has every rarity.
     FRESH  Common: Minnow, Bleak, Roach, Gudgeon, Rudd, Stickleback, Perch, Bream, Tench, Crucian Carp. Uncommon: Brown Trout, Chub, Dace, Grayling, River Eel, Flounder, River Crayfish, Pike.
            Rare: Salmon, Wels Catfish, River Ray, Striped Angelfish, Sturgeon, Red Piranha. Very rare: Golden Carp. Legendary: Moonscale Pike, Emberscale Koi.
     SALT   (10 salt-only) Common: Sardine, Herring, Sand Goby. Uncommon: Mackerel, Plaice, Sea Bream. Rare: Cod, Sea Bass. Very rare: Swordfish. Legendary: Giant Bluefin Tuna.
            Shared with other water: Stickleback, River Eel, Flounder, Salmon, River Ray, Striped Angelfish, Sturgeon, Lantern Angler, Leaf Dragon, Pearl Pufferfish, Moonscale Pike.
     DEEP   (the Hollow's dark waters) Common: Minnow, Tench, Stickleback. Uncommon: River Eel, River Crayfish. Rare: Wels Catfish, River Ray, Red Piranha.
            Very rare: Lantern Angler, Leaf Dragon, Pearl Pufferfish. Legendary: Moonscale Pike.
   ========================================================================== */
const FSH_WATER=['bluewater','wmwater','water','hgo_water']; // floors that are water (the Deeper Hollow lakes are floor 6, handled below)
const FSHV={hits:[],cache:{},t:0};
const FSH_ADD={},FSH_LW={},FSH_NOAUTO={};let FSH_VER=0;
for(const n of [290,300,301,302,303,304,330,331,332,333,334,335,336,337,338,339,340,341,342,343])FSH_LW[n]='salt'; // Yarrim, the sea isles, Oldhaven Quay
for(const n of [475,476])FSH_LW[n]='deep';                                                                         // the Deeper Hollow and the Underlevel
function fshAddSpots(lv,list,opts){const w=(opts&&opts.water)||FSH_LW[lv]||'fresh',A=FSH_ADD[lv]||(FSH_ADD[lv]=[]);for(const q of list)A.push({x:q.x,y:q.y,dx:q.dx||0,dy:q.dy||0,water:w});FSH_VER++;delete FSHV.cache[lv]}
function fshSetWater(lv,w){FSH_LW[lv]=w;FSH_VER++;delete FSHV.cache[lv]}
function fshAuto(lv,on){FSH_NOAUTO[lv]=!on;FSH_VER++;delete FSHV.cache[lv]}
fshAddSpots(496,[[67,84],[68,84],[69,84],[70,84],[75,84],[76,84],[77,84],[66,85],[67,85],[68,85],[69,85],[70,85],[75,85],[76,85],[77,85]].map(q=>({x:q[0],y:q[1]})),{water:'fresh'}); // Wenlock brook beside the old bridge (72,84)
function fshWaterAt(L,n,x,y){
  const r=L.fmap&&L.fmap[y];if(!r)return false;const ch=r[x];if(ch===undefined)return false;
  if(typeof HGD!=='undefined'&&HGD&&n===HGD.ID)return ch==='6';
  const fs=L.floorSet;if(!fs)return false;return FSH_WATER.includes(fs[ch.charCodeAt(0)-48])}
function fshPierKey(){try{return typeof WLR_PIER!=='undefined'&&WLR_PIER?WLR_PIER.x+','+WLR_PIER.y+','+WLR_PIER.dx+','+WLR_PIER.dy:''}catch(e){return ''}}
function fshSpots(n){
  const L=LEVELS[n];if(!L||!L.rows)return new Map();
  const pk=(n===496?fshPierKey():'')+'|'+FSH_VER+'|'+(L.fmap?1:0),c=FSHV.cache[n];if(c&&c.pk===pk)return c.m;
  const m=new Map(),H=L.rows.length,W=L.rows[0].length,lw=FSH_LW[n]||'fresh',key=(x,y)=>x+','+y,add=(x,y,w)=>{if(x>0&&y>0&&x<W-1&&y<H-1)m.set(key(x,y),{x,y,water:w||lw})};
  if(W*H>200000){FSHV.cache[n]={pk,m};return m} // the open Narrow Sea is sailed, not fished from the shore
  const fs=L.floorSet,isHgd=typeof HGD!=='undefined'&&HGD&&n===HGD.ID;
  if(L.fmap&&!FSH_NOAUTO[n]&&(isHgd||(fs&&fs.some(f=>FSH_WATER.includes(f))))){
    const stand=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&L.rows[y][x]==='.'&&!fshWaterAt(L,n,x,y);
    for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
      if(!fshWaterAt(L,n,x,y))continue;
      let near=false;for(let dy=-3;dy<=3&&!near;dy++)for(let dx=-3;dx<=3;dx++){if(Math.abs(dx)+Math.abs(dy)>3)continue;if(stand(x+dx,y+dy)){near=true;break}}
      if(near&&hash2(x>>1,y>>1,771+n)<.3)add(x,y)}}
  for(const q of (FSH_ADD[n]||[])){if(q.dx||q.dy){for(let k=1;k<=2;k++)add(q.x+q.dx*k,q.y+q.dy*k,q.water)}else if(!L.fmap||fshWaterAt(L,n,q.x,q.y)||q.water)add(q.x,q.y,q.water)}
  if(pk.split('|')[0]){const P=WLR_PIER,px=-P.dy,py=P.dx;for(const [a,b] of [[1,0],[2,0],[1,1],[1,-1],[0,1],[0,-1],[2,1],[2,-1]]){const x=P.x+P.dx*a+px*b,y=P.y+P.dy*a+py*b;if(fshWaterAt(L,n,x,y))add(x,y,'fresh')}}
  FSHV.cache[n]={pk,m};return m}
const fshFaced=()=>{if(G.state!=='play'||!G.P||!G.grid)return null;const d=DIRS[G.P.f],sp=fshSpots(LEVEL);if(!sp.size)return null; // the nearest spot in the three squares ahead (the near water is below the bottom of the view)
  for(let k=1;k<=3;k++){const x=G.P.x+d[0]*k,y=G.P.y+d[1]*k;if(!G.grid[y]||G.grid[y][x]>0)return null;const s=sp.get(x+','+y);if(s)return s}return null};
const fshBestRod=()=>{let b=null;for(const r of FSH_RODS)if(bagCount(r[0])>0)b=r;return b};
const fshFree=()=>G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&!G.inv.open&&!G.loot&&!G.overview&&!G.saves&&!G.map&&!TP;
/* ---------- the view: projecting a water square onto the screen ---------- */
function fshCam(){const C=G.C,LA=C.a+(typeof LKYAW==='number'?LKYAW:0),dX=Math.cos(LA),dY=Math.sin(LA);return {dX,dY,pX:-dY,pY:dX,cx:C.x+.5-dX*.28,cy:C.y+.5-dY*.28}}
function fshGroundZ(x,y){try{if(typeof TERR_NOW!=='undefined'&&TERR_NOW&&typeof terrH==='function')return terrH(x,y)}catch(e){}return 0}
function fshProj(cam,wx,wy,z){const vx=wx-cam.cx,vy=wy-cam.cy,dep=vx*cam.dX+vy*cam.dY;if(dep<.12)return null;
  const lat=vx*cam.pX+vy*cam.pY;return {x:(lat/(dep*PL)+1)*VW/2,y:HH+((typeof CAMZ==='number'?CAMZ:EYE)-z)*F/dep,d:dep}}
function fshRing(cam,s,r,z,n){const o=[];for(let k=0;k<n;k++){const a=k/n*6.2832,p=fshProj(cam,s.x+.5+Math.cos(a)*r,s.y+.5+Math.sin(a)*r,z);if(!p)return null;o.push(p)}return o}
function fshPoly(ctx2,P){ctx2.beginPath();P.forEach((p,i)=>i?ctx2.lineTo(p.x,p.y):ctx2.moveTo(p.x,p.y));ctx2.closePath()}
function fshClipCols(P,dep){ // keep only the screen columns where no wall stands in front of the patch
  let a=1e9,b=-1e9;for(const p of P){if(p.x<a)a=p.x;if(p.x>b)b=p.x}a=Math.max(0,Math.floor(a));b=Math.min(VW-1,Math.ceil(b));
  const hill=typeof TERR_NOW!=='undefined'&&TERR_NOW&&typeof YB!=='undefined',kb=Math.max(0,Math.min(YBK-1,((dep*YBS)|0)-1));
  ctx.beginPath();for(let x=a;x<=b;x++){if(zbuf[x]&&zbuf[x]<=dep-.3)continue;const cut=hill?YB[x*YBK+kb]:VH;if(cut>0)ctx.rect(x,0,1,cut)}ctx.clip()}
function fshDrawSpots(){
  FSHV.hits=[];if(G.state!=='play'||!G.C||!LEVELS[LEVEL])return;
  const sp=fshSpots(LEVEL);if(!sp.size)return;const cam=fshCam(),t=G.time;
  for(const s of sp.values()){
    const vx=s.x+.5-cam.cx,vy=s.y+.5-cam.cy,dep=vx*cam.dX+vy*cam.dY;if(dep<.35||dep>9||Math.abs(vx*cam.pX+vy*cam.pY)>dep*PL*1.3+1)continue;
    const z=fshGroundZ(s.x+.5,s.y+.5),outer=fshRing(cam,s,1.0,z,18);if(!outer)continue;
    const fade=Math.max(.25,1-dep/10);
    ctx.save();fshClipCols(outer,dep);
    for(const [r,a] of [[1.0,.5],[.78,.5],[.55,.5]]){const P=fshRing(cam,s,r,z,18);if(!P)continue;ctx.fillStyle=`rgba(4,18,32,${a*Math.max(.55,fade)*1.1})`;fshPoly(ctx,P);ctx.fill()}
    const ph=((t*.45+hash2(s.x,s.y,5))%1),P=fshRing(cam,s,.25+ph*.6,z,18);if(P){ctx.strokeStyle=`rgba(225,240,255,${.28*(1-ph)*fade})`;ctx.lineWidth=1;fshPoly(ctx,P);ctx.stroke()}
    {const a=t*.5+hash2(s.x,s.y,9)*6.3,r=.3,h1=fshProj(cam,s.x+.5+Math.cos(a)*r+Math.cos(a+1.57)*.08,s.y+.5+Math.sin(a)*r+Math.sin(a+1.57)*.08,z),t1=fshProj(cam,s.x+.5+Math.cos(a-.5)*r,s.y+.5+Math.sin(a-.5)*r,z);
     if(h1&&t1){ctx.lineCap='round';ctx.strokeStyle=`rgba(0,8,18,${.55*fade})`;ctx.lineWidth=Math.max(1.5,F/dep*.09);ctx.beginPath();ctx.moveTo(t1.x,t1.y);ctx.lineTo(h1.x,h1.y);ctx.stroke()}}
    ctx.restore();
    const pc=fshProj(cam,s.x+.5,s.y+.5,z);let seen=false;if(pc&&pc.x>=6&&pc.x<VW-6&&pc.y>=HH&&pc.y<VH-4){const xi=Math.max(0,Math.min(VW-1,Math.round(pc.x))),kb=Math.max(0,Math.min(YBK-1,((dep*YBS)|0)-1));seen=(!zbuf[xi]||zbuf[xi]>dep-.3)&&(!(typeof TERR_NOW!=='undefined'&&TERR_NOW)||YB[xi*YBK+kb]>pc.y)}
    if(seen)FSHV.hits.push({s,dep,poly:fshRing(cam,s,1.05,z,12)})}
}
const fshInPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){if(((P[i].y>y)!==(P[j].y>y))&&x<(P[j].x-P[i].x)*(y-P[i].y)/(P[j].y-P[i].y)+P[i].x)c=!c}return c};
/* where the bobber lands on the screen: the middle of the patch being fished */
function fshTarget(s){const p=fshProj(fshCam(),s.x+.5,s.y+.5,fshGroundZ(s.x+.5,s.y+.5));return p?{x:Math.max(40,Math.min(380,p.x)),y:Math.max(HH+6,Math.min(190,p.y))}:{x:210,y:140}}
/* ---------- casting ---------- */
function fshNeedRod(){msg('You need a fishing rod to fish here. Any general merchant sells the Simple Rod for 300 gold.','#d0c090')}
function fshHelpOnce(){const F0=G.flags;if(F0.fishHelp)return;F0.fishHelp=1;
  msg('To fish, face a dark patch of water and press G or Space. When a fish bites, press again with the cursor in the gold zone.','#a8d8f0')}
/* the bait chosen on the fishing prompt (G.flags.fishBait), if the bag still has one */
const fshBaitOwned=()=>FSH_BAITS.filter(b=>bagCount(b[0])>0);
function fshBaitNow(){const id=G.flags&&G.flags.fishBait;if(!id||!ITEMDEF[id]||bagCount(id)<1)return null;return FSH_BAITS.find(b=>b[0]===id)||null}
function fshBaitFit(b,water){return b[5]==='any'||(b[5]==='salt'?water==='salt':water!=='salt')}
function fshOdds(rod,bait,water){const fit=bait?(fshBaitFit(bait,water)?1:.5):0,bonus=bait?bait[3]*fit:0;return {rod:rod[2],bonus,total:Math.min(95,rod[2]+bonus),bias:bait?Math.pow(bait[4],fit||1):1}}
function fshBaitCycle(){const own=fshBaitOwned(),cur=fshBaitNow(),i=cur?own.findIndex(b=>b[0]===cur[0]):-1;
  if(!own.length){msg('You have no bait. A bait seller or a general merchant may sell some.','#c8b898');G.flags.fishBait='';return}
  const nx=own[i+1];G.flags.fishBait=nx?nx[0]:'';msg(nx?'Bait: '+nx[1]+'.':'Bait: none.','#bfe0f4')}
function fshStart(s){
  if(!s)return false;if(!fshFree())return false;
  const rod=fshBestRod();if(!rod){fshNeedRod();return false}
  if(hostileNear()){msg('You cannot fish with enemies close by.','#d09a80');return false}
  const w=.16+.04*Math.random(),water=s.water||'fresh';let bait=fshBaitNow();
  if(G.flags.fishBait&&!bait){G.flags.fishBait='';msg('You are out of that bait.','#c8b898')}
  const od=fshOdds(rod,bait,water);if(bait){bagRemove(bait[0],1);if(!fshBaitFit(bait,water))msg(bait[1]+' work only half as well in '+(water==='salt'?'salt':'fresh')+' water.','#c8b898')}
  G.fishing={phase:'cast',t:0,cell:s,water,rod,id:rod[0],bait,odds:od,chance:od.total,zone:{c:.22+Math.random()*.56,w},cur:0,dir:1,spd:1.0+Math.random()*.35,wait:1.6+Math.random()*2.6,res:null,show:null,tgt:fshTarget(s)};
  G.menu='fishing';G.hold=null;G.queued=null;advanceTime(10);sfx('step');fshHelpOnce();return true}
/* the fish of one kind of water, by rarity: common much likelier; a better rod and a better bait lean towards the rarer tiers */
function fshPick(rodIdx,water,bias){
  const pool=FSH_POOL[water]||FSH_POOL.fresh,bs=bias||1;
  const w=FSH_TIERS.map((T,i)=>pool.some(f=>f[2]===i)?T[2]*(1+.14*rodIdx*i)*Math.pow(bs,i):0);let tot=0;for(const v of w)tot+=v;let u=Math.random()*tot,tier=0;for(let i=0;i<w.length;i++){u-=w[i];if(u<=0){tier=i;break}}
  const L=pool.filter(f=>f[2]===tier);return L[Math.floor(Math.random()*L.length)]}
function fshGive(F0,id,extra){const it=mkItem(id);if(extra)Object.assign(it,extra);F0.bag=bagAdd(it);if(!F0.bag)G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false,m:extra&&extra.m})}
/* what comes up on a good pull: a boot, a bottle, a jewel, or a fish */
function fshCatch(F0){
  const ri=Math.max(0,FSH_RODS.findIndex(r=>r[0]===F0.id)),r=Math.random(),pBoot=.06,pBottle=.03,pJewel=.01+.003*ri,fl=G.flags;F0.res='catch';
  if(r<pBoot){fshGive(F0,'odd_boot');const d=ITEMDEF.odd_boot;F0.show={id:'odd_boot',name:'An Old Boot',tag:'Junk',col:'#a89878',l1:'Worth almost nothing.',l2:'',desc:d.d};sfx('miss');return}
  if(r<pBoot+pBottle){const m=Math.floor(Math.random()*FSH_NOTES.length);fshGive(F0,'fish_bottle',{m});F0.show={id:'fish_bottle',name:'Bottle with a Message',tag:'Message',col:'#a8d8c8',l1:'There is a note inside.',l2:'Select it in the bag and press Read.',desc:ITEMDEF.fish_bottle.d};sfx('level');return}
  if(r<pBoot+pBottle+pJewel){const g=GEM_BY_VALUE[Math.min(GEM_BY_VALUE.length-1,Math.floor(GEM_BY_VALUE.length*.55+Math.random()*GEM_BY_VALUE.length*.45))],id='gem_'+g[0];fshGive(F0,id);try{collFound(id)}catch(e){}
    F0.show={id,name:g[1],tag:'Jewel',col:'#ffd76a',l1:'A jewel, worth about '+g[2]+' gold.',l2:'',desc:ITEMDEF[id].d};fl.fishJewels=(fl.fishJewels||0)+1;sfx('level');return}
  const f=fshPick(ri,F0.water,F0.odds.bias),id=f[0];fl.fishCaught=fl.fishCaught||{};fl.fishCaught[id]=(fl.fishCaught[id]||0)+1;fl.fishTotal=(fl.fishTotal||0)+1;
  fshGive(F0,id);F0.fish=f;F0.show={id,name:f[1],tag:FSH_TIERS[f[2]][0],col:FSH_TIERS[f[2]][1],l1:'Fills '+f[7]+' hunger',l2:'Heals '+f[8]+' percent of max health',desc:f[10]};sfx(f[2]>=3?'level':'potion')}
function fshPress(){
  const F0=G.fishing;if(!F0)return;
  if(F0.phase==='wait'){F0.res='early';F0.phase='flick';F0.t=0;msg('You pulled in too soon. Nothing was on the line.','#c8b898');sfx('miss');return}
  if(F0.phase==='bite'){F0.phase='line';F0.t=0;F0.cur=0;F0.dir=1}
  else if(F0.phase==='line'){
    const hit=Math.abs(F0.cur-F0.zone.c)<=F0.zone.w/2;F0.phase='flick';F0.t=0;
    if(!hit){F0.res='miss';msg('The cursor was off the gold zone. The fish got away.','#c8b898');sfx('miss');return}
    if(Math.random()*100<F0.chance)fshCatch(F0);
    else{F0.res='slip';msg('A good pull, but the hook slipped and the fish was gone.','#c8b898');sfx('miss')}}
}
function fshEnd(){G.fishing=null;if(G.menu==='fishing')G.menu=false}
function fshTick(dt){
  const F0=G.fishing;if(!F0)return;
  if(G.menu!=='fishing'||G.state!=='play'||F0.lvl!==undefined&&F0.lvl!==LEVEL){G.fishing=null;return}
  F0.t+=dt;
  if(F0.phase==='cast'&&F0.t>=1.0){F0.phase='wait';F0.t=0}
  else if(F0.phase==='wait'&&F0.t>=F0.wait){F0.phase='bite';F0.t=0;msg('Something bites!','#ffe36a');sfx('hit')}
  else if(F0.phase==='bite'&&F0.t>=.8){F0.phase='line';F0.t=0;F0.cur=0;F0.dir=1}
  else if(F0.phase==='line'){F0.cur+=F0.dir*F0.spd*dt;if(F0.cur>=1){F0.cur=1;F0.dir=-1}else if(F0.cur<=0){F0.cur=0;F0.dir=1}
    if(F0.t>9){F0.res='miss';F0.phase='flick';F0.t=0;msg('The fish spat the hook and got away.','#c8b898')}}
  else if(F0.phase==='flick'&&F0.t>=.95){if(F0.res==='catch'){F0.phase='result';F0.t=0}else fshEnd()}
}
{let icT=0;const _u=update;update=function(dt){try{icT+=dt;if(icT>1){icT=0;fshIcons()}fshTick(dt)}catch(e){console.error('fsh',e);G.fishing=null}return _u.apply(this,arguments)}}
/* ---------- the rod, drawn at the bottom of the view ---------- */
const fshEase=u=>u<0?0:u>1?1:u*u*(3-2*u);
function fshRod(F0){
  const col=ITEMDEF[F0.id].c||'#9a7a4a',B={x:352,y:226},T0={x:262,y:112};let T={x:T0.x,y:T0.y},bend=.06,u=F0.t,bob=null,lineSag=16,dip=0,spl=0;
  const tg=F0.tgt;
  if(F0.phase==='cast'){u=F0.t/1.0;
    if(u<.4){const k=fshEase(u/.4);T={x:T0.x+(392-T0.x)*k,y:T0.y+(58-T0.y)*k};bend=.06-.18*k}
    else if(u<.62){const k=fshEase((u-.4)/.22);T={x:392+(228-392)*k,y:58+(96-58)*k};bend=-.12+.34*k}
    else{const k=fshEase((u-.62)/.38);T={x:228+(T0.x-228)*k,y:96+(T0.y-96)*k};bend=.22-.16*k}
    if(u>=.5){const k=fshEase((u-.5)/.5),ax=T.x+(tg.x-T.x)*k,ay=T.y+(tg.y-T.y)*k-Math.sin(k*Math.PI)*44;bob={x:ax,y:ay};lineSag=10*(1-k)+4;if(k>=1)spl=1}
    else{bob={x:T.x-4,y:T.y+22};lineSag=2}}
  else{
    bob={x:tg.x,y:tg.y};
    if(F0.phase==='wait'){bob.y+=Math.sin(F0.t*2.6)*1.2;T={x:T0.x+Math.sin(F0.t*.9)*1.5,y:T0.y+Math.sin(F0.t*1.3)*1.5}}
    else if(F0.phase==='bite'){const s=Math.min(1,F0.t/.8);dip=Math.sin(s*Math.PI*3)*(1-s*.4);bob.y+=Math.max(0,dip)*6;T={x:T0.x,y:T0.y+Math.abs(dip)*12};bend=.06+.08*Math.abs(dip);spl=1}
    else if(F0.phase==='line'){const ph=F0.t*17;bob.x+=Math.sin(ph)*5;bob.y+=Math.abs(Math.sin(ph*.7))*3;T={x:T0.x-14+Math.sin(ph*.5)*3,y:T0.y+30};bend=.34;lineSag=1;spl=1}
    else if(F0.phase==='flick'||F0.phase==='result'){const k=F0.phase==='result'?1:Math.min(1,F0.t/.95),up=Math.sin(Math.min(1,k*1.5)*Math.PI);T={x:T0.x+(300-T0.x)*up,y:T0.y+(34-T0.y)*up};bend=-.1*up+.05;
      if(F0.res==='catch'){const q=fshEase(Math.min(1,k*1.15));bob={x:tg.x+(T.x-tg.x)*q,y:tg.y+(T.y+30-tg.y)*q-Math.sin(q*Math.PI)*30};lineSag=3}
      else{bob={x:tg.x+(T.x+4-tg.x)*fshEase(k),y:tg.y+(T.y+24-tg.y)*fshEase(k)-Math.sin(k*Math.PI)*26};lineSag=8}}}
  // ripples where the bobber floats
  if((spl||F0.phase==='wait')&&F0.phase!=='flick'&&F0.phase!=='result'){const a=(F0.t*(F0.phase==='bite'||F0.phase==='line'?1.6:.6))%1;ctx.save();ctx.strokeStyle=`rgba(230,242,255,${.45*(1-a)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(tg.x,tg.y+3,5+a*16,1.6+a*5,0,0,6.3);ctx.stroke();ctx.restore()}
  // the line
  const mx=(T.x+bob.x)/2,my=(T.y+bob.y)/2+lineSag;ctx.save();ctx.strokeStyle='rgba(240,240,230,.8)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(T.x,T.y);ctx.quadraticCurveTo(mx,my,bob.x,bob.y);ctx.stroke();
  // the bobber
  ctx.fillStyle='#e8e4d6';ctx.beginPath();ctx.arc(bob.x,bob.y,3.2,Math.PI,6.3);ctx.fill();ctx.fillStyle='#d83a2c';ctx.beginPath();ctx.arc(bob.x,bob.y,3.2,0,Math.PI);ctx.fill();ctx.strokeStyle='#120c08';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(bob.x,bob.y,3.2,0,6.3);ctx.stroke();
  // a caught fish rises with the line
  if(F0.phase!=='cast'&&F0.res==='catch'&&F0.show&&(F0.phase==='flick'||F0.phase==='result')){const im=IMG['ic_'+F0.show.id];if(im)ctx.drawImage(im,bob.x-14,bob.y-6,28,28)}
  // the rod: a tapering curve from the hand to the tip
  const len=Math.hypot(T.x-B.x,T.y-B.y),nx=-(T.y-B.y)/len,ny=(T.x-B.x)/len,cxp=(B.x+T.x)/2+nx*bend*len,cyp=(B.y+T.y)/2+ny*bend*len,N=14;
  let px=B.x,py=B.y;ctx.lineCap='round';
  for(let i=1;i<=N;i++){const k=i/N,x=(1-k)*(1-k)*B.x+2*(1-k)*k*cxp+k*k*T.x,y=(1-k)*(1-k)*B.y+2*(1-k)*k*cyp+k*k*T.y,w=9-7*k;
    ctx.strokeStyle='#120c08';ctx.lineWidth=w+1.8;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();
    ctx.strokeStyle=k<.22?'#5a3a1a':col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();px=x;py=y}
  // the reel and the hand
  const rk=.16,rx=(1-rk)*(1-rk)*B.x+2*(1-rk)*rk*cxp+rk*rk*T.x,ry=(1-rk)*(1-rk)*B.y+2*(1-rk)*rk*cyp+rk*rk*T.y;
  ctx.fillStyle='#8a8a92';ctx.strokeStyle='#120c08';ctx.lineWidth=1;ctx.beginPath();ctx.arc(rx-5,ry+2,4.5,0,6.3);ctx.fill();ctx.stroke();
  ctx.fillStyle='#d8b890';ctx.beginPath();ctx.roundRect(B.x-11,B.y-26,22,26,6);ctx.fill();ctx.stroke();
  ctx.fillStyle='#4a3a28';ctx.fillRect(B.x-13,B.y-6,26,14);
  ctx.restore()}
{const _dw=drawWorld;drawWorld=function(){const r=_dw.apply(this,arguments);try{fshDrawSpots();if(G.fishing&&G.state==='play')fshRod(G.fishing)}catch(e){console.error('fsh draw',e)}return r}}
/* ---------- the line game and the result, drawn over the view ---------- */
function fshHud(){
  const F0=G.fishing;if(!F0)return;
  BTNS.length=0;
  const rodN=ITEMDEF[F0.id].n;
  if(F0.phase!=='result'){
    btn('fishpress',0,0,DW,DH);btnText('fishquit','Reel in (Esc)',330,193,84,16);
    const msgs={cast:'You cast the line...',wait:'Waiting for a bite...',bite:'SOMETHING BITES!',line:'Press Space, Enter or click when the cursor is over the gold zone.',flick:F0.res==='catch'?'You pull the fish in!':'...'};
    txtS(msgs[F0.phase]||'',210,30,9,F0.phase==='bite'?'#ffe36a':'#f0e8c8','center',true);
    txtS(F0.bait?`${rodN} ${F0.odds.rod} percent + ${F0.bait[1]} ${Math.round(F0.odds.bonus*10)/10} percent = ${Math.round(F0.chance)} percent to land a catch after a good pull`:`${rodN}: ${F0.chance} percent to land a catch after a good pull (no bait)`,210,42,7.4,'#bfd8ea','center',true);
    if(F0.phase==='line'||F0.phase==='bite'){
      const x=90,y=54,w=240,h=13;ctx.save();ctx.fillStyle='rgba(8,6,4,.82)';rrect(ctx,x-4,y-4,w+8,h+8,5);ctx.fill();ctx.strokeStyle='#8a7448';ctx.lineWidth=1.4;rrect(ctx,x-4,y-4,w+8,h+8,5);ctx.stroke();
      ctx.fillStyle='#2a3a4a';ctx.fillRect(x,y,w,h);
      const zx=x+(F0.zone.c-F0.zone.w/2)*w,zw=F0.zone.w*w;ctx.fillStyle='#e8c040';ctx.fillRect(zx,y,zw,h);ctx.fillStyle='rgba(255,255,200,.5)';ctx.fillRect(zx,y,zw,3);
      if(F0.phase==='line'){const cx2=x+F0.cur*w;ctx.fillStyle='#fff';ctx.fillRect(cx2-1.5,y-4,3,h+8);ctx.beginPath();ctx.moveTo(cx2-4,y-6);ctx.lineTo(cx2+4,y-6);ctx.lineTo(cx2,y);ctx.closePath();ctx.fill()}
      ctx.restore()}
  } else {
    const sh=F0.show;
    btn('fishnone',0,0,DW,DH);
    ctx.save();ctx.fillStyle='rgba(4,3,2,.55)';ctx.fillRect(0,0,420,210);ctx.restore();
    bigPanel(100,28,220,150);txt(sh.tag==='Junk'||sh.tag==='Message'||sh.tag==='Jewel'?'YOU CAUGHT SOMETHING':'YOU CAUGHT A FISH',210,44,11,'#d8c88e','center',true);
    const im=IMG['ic_'+sh.id];panel(118,56,64,64,false,false);if(im)ctx.drawImage(im,120,58,60,60);
    txt(sh.name,250,66,12,'#f0e8c8','center',true,undefined,120);txt(sh.tag,250,82,10,sh.col,'center',true);
    txt(sh.l1,250,98,8.5,'#e8c890','center',false,undefined,130);txt(sh.l2,250,110,8.5,'#9ae0a0','center',false,undefined,130);
    const t2=String(sh.desc||'');txt(t2.length>56?t2.slice(0,t2.lastIndexOf(' ',56)):t2,210,134,7.6,'#c8bc98','center',false,undefined,200);if(t2.length>56)txt(t2.slice(t2.lastIndexOf(' ',56)+1),210,144,7.6,'#c8bc98','center',false,undefined,200);
    txt(F0.bag?(F0.fish?'It is in your bag. Eat it from the bag (select it, then Eat).':'It is in your bag.'):'Your bag is full: it lies on the ground.',210,156,7.4,'#a89878','center',false,undefined,200);
    btnText('fishagain','Cast again',112,163,92,18);btnText('fishdone','Done',216,163,92,18)}
}
{const _dm=drawMenu;drawMenu=function(){if(G.menu==='fishing'&&G.fishing){try{fshHud()}catch(e){console.error('fsh hud',e)}return}return _dm.apply(this,arguments)}}
{const _hb=handleBtn;handleBtn=function(id){
  if(G.menu==='fishing'&&G.fishing){
    if(id==='fishpress')fshPress();else if(id==='fishquit'||id==='fishdone'||id==='menu'||id==='menuclose')fshEnd();
    else if(id==='fishagain'){const c=G.fishing.cell;G.fishing=null;G.menu=false;if(!fshStart(c))fshEnd()}
    return}
  if(id==='fishbait'){fshBaitCycle();return}
  if(id==='fishcast'){const s=fshFaced();if(s)fshStart(s);else msg('Face a dark patch of water at the shore first.','#c8b898');return}
  return _hb.apply(this,arguments)}}
addEventListener('keydown',e=>{
  if(!G.fishing||G.menu!=='fishing'||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key,lk=k.length===1?k.toLowerCase():k;if(!(k==='Escape'||k===' '||k==='Enter'||lk==='g'))return;
  e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
  if(k==='Escape'){fshEnd();return}
  if(G.fishing.phase==='result'){const c=G.fishing.cell;G.fishing=null;G.menu=false;if(!fshStart(c))fshEnd();return}
  fshPress()},true);
/* ---------- starting a cast: the interact key, G, a click on the patch, and the Fish button ---------- */
{const _a=act;act=function(id){
  try{if(id==='attack'&&fshFree()&&!hostileNear()&&canAct()){const s=fshFaced();if(s){if(fshStart(s))return;return}}}catch(e){console.error(e)}
  return _a.apply(this,arguments)}}
{const _cd=canDigHere;canDigHere=function(){return _cd.apply(this,arguments)||(fshFree()&&!!fshFaced())}}
{const _dd=doDig;doDig=function(){const s=fshFaced();if(s&&fshFree()){fshStart(s);return}return _dd.apply(this,arguments)}}
{const _vt=viewTap;viewTap=function(x,y){
  try{if(fshFree()){for(const h of FSHV.hits.slice().sort((a,b)=>a.dep-b.dep)){if(!h.poly||!fshInPoly(h.poly,x,y))continue;
    if(!fshBestRod()){fshNeedRod();return}
    if(h.dep>5.2){msg('Too far away. Step closer to the water.','#d09a80');return}
    fshStart(h.s);return}}}catch(e){console.error(e)}
  return _vt.apply(this,arguments)}}
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);try{
  if(!fshFree())return;const s=fshFaced();
  if(s){const bt=fshBaitNow();btnText('fishcast','Fish',24,192,52,20);btnText('fishbait','Bait: '+(bt?bt[1]+' x'+bagCount(bt[0]):'none'),300,168,114,18);txtS(fshBestRod()?'A fishing spot. Press G, Space or click it.':'A fishing spot. You need a rod.',210,196,7.6,'#bfe0f4','center',true)}
}catch(e){}}}
/* ---------- the better rods come to the shops as the party's level rises; the first-time help line ---------- */
{const _ol=openLoot;openLoot=function(d){const r=_ol.apply(this,arguments);
  try{if(d&&d.shop&&d.contents&&(d.fishSeen||d.contents.some(x=>x.id==='lockpick'||x.id==='butterflycage'||/^(shovel_|fishrod_)/.test(x.id)))){
    const L=partyLevel(),seen=d.fishSeen||(d.fishSeen={});
    for(const rd of FSH_RODS){if(seen[rd[0]])continue;if(d.contents.some(x=>x.id===rd[0])){seen[rd[0]]=1;continue}if(L>=rd[4]){d.contents.push({id:rd[0],n:rd[0]==='fishrod_1'?2:1});seen[rd[0]]=1}}}}catch(e){console.error(e)}
  return r}}
{const _ba=bagAdd;bagAdd=function(it){const r=_ba.apply(this,arguments);try{if(r&&it&&/^fishrod_/.test(it.id)&&G.flags&&!G.flags.fishHelp){fshHelpOnce();msg('You have a fishing rod. Dark patches near the water edge are fishing spots.','#a8d8f0')}}catch(e){}return r}}
if(typeof SHORTCUTS!=='undefined')for(const s of SHORTCUTS)if(s[1]==='G')s[2]='Dig with a shovel, or fish at a dark patch of water';
/* a test link: ?town=wenlock&lvl=34&fish=1 stands on the north bank of the brook by the old bridge, facing the water, with 1000 gold */
{const _j=jumpFromUrl;jumpFromUrl=function(){const r=_j.apply(this,arguments);try{const q=new URLSearchParams(location.search);
  if(q.get('fish')&&(q.get('town')||'').toLowerCase().startsWith('wenlock')){let n=0;const t=setInterval(()=>{n++;try{
    if(LEVEL===496&&G.state==='play'&&!G.cut&&!G.talk&&G.P&&G.P.x===95&&G.P.y===50){clearInterval(t);G.gold+=1000;goToLevel(496,{x:69,y:81,f:2});G.state='play';G.menu=false;msg('Fishing test spot: the brook by the old bridge. Buy a rod at the general store, or walk on.','#a8d8f0')}}catch(e){}
    if(n>60)clearInterval(t)},1000)}}catch(e){console.error(e)}return r}}
/* ---------- reading a bottle's message from the bag ---------- */
function fshNoteText(it){const i=it&&typeof it.m==='number'?it.m:0;return FSH_NOTES[i%FSH_NOTES.length]}
{const _di=drawInventory;drawInventory=function(){const r=_di.apply(this,arguments);
  try{const I=G.inv;if(I.open&&I.sel&&I.sel.src==='bag'&&I.tab!=='powers'){const it=selItem(),d=it&&ITEMDEF[it.id];if(d&&d.fread&&I.dropKey!=='b'+I.sel.i)btnText('fshread','Read',338,141,112,26)}}catch(e){}
  return r}}
{const _hb=handleBtn;handleBtn=function(id){
  if(id==='fshread'){const it=selItem();if(it&&ITEMDEF[it.id]&&ITEMDEF[it.id].fread){G.inv.open=false;G.talk={d:{},n:{name:'A message in a bottle'},node:say('You pull the cork and unroll the note. It says: "'+fshNoteText(it)+'"',[BYE]),t:G.time,btns:[]};G.hold=null;G.queued=null}return}
  return _hb.apply(this,arguments)}}
/* ---------- the bait seller on the Wenlock brook (north bank, west of the old bridge) ---------- */
KH_STOCK.fsh_bait=()=>[['bait_crumbs',30],['bait_worms',30],['bait_maggots',20],['bait_shrimp',15],['bait_silver',8],['bait_gold',4],['fishrod_1',2]];
khNpc('fsh_baitseller','Old Reg, the bait seller','kh_ohfolk3_5',d=>say('Worms, maggots and lures, dug and tinned this morning. Bread crumbs for the quiet fish, shrimp for the salty ones, and a golden lure for the fish that has seen everything. I also keep a few rods, in case you came without one.',
  [['Browse the wares',()=>{openShop(d,KH_STOCK.fsh_bait(),"Reg's Bait and Tackle");return null}],['How do I fish?',()=>say('Face a dark patch of water on the bank, press G or Space, and wait. When the fish bites, press again while the cursor is on the gold zone. Choose your bait with the Bait button first. A better rod and a better bait both help.',[BYE])],BYE]),{sc:1});
{const _g=goToLevel;goToLevel=function(n,e){
  try{if(n===496){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();const L=LEVELS[n];if(L&&L.decor&&!L.decor.some(d=>d.npc==='fsh_baitseller'))L.decor.push({k:'kh_ohfolk3_5',x:66,y:82,block:false,walk:true,npc:'fsh_baitseller',sc:1})}}catch(x){console.error('fsh seller',x)}
  return _g.apply(this,arguments)}}

