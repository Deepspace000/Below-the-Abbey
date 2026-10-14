/* ==========================================================================
   THE OPEN SEA. Level 330 is the Vaast Sea itself: 640 by 640 cells of water with the four islands you know, six tiny islands, three bare
   rocky ones and three big forest ones, and about a hundred cells of open water between most of them. The party pilots the Dawn Walker: you
   see the sea over her bow rail, and walking is sailing. Sea serpents hunt in the open water. In the far east, past a line nobody has
   crossed in living memory, the Kraken waits. Landing buoys mark the way into every island.
     330 the open sea   331..345 the islands nobody lives on (built as you reach them)
   ========================================================================== */
const SN={W:640,H:640,ID:330,KRAKEN_X:545,FIRST:331};
const SN_ISLES=[ // key, name, centre, radius, kind, level (0 = built from the table below)
  {k:'saltbarrow',n:'Saltbarrow',x:150,y:420,r:26,kind:'sand',lv:300},
  {k:'bells',n:'the Isle of Bells',x:300,y:160,r:28,kind:'green',lv:301},
  {k:'cinder',n:'Cinder Isle',x:420,y:470,r:24,kind:'volcano',lv:302},
  {k:'lastlight',n:'Last Light',x:520,y:250,r:22,kind:'rock',lv:303},
  {k:'tern',n:'Tern Rock',x:80,y:200,r:5,kind:'tiny',lv:331},
  {k:'pebble',n:'Pebble Cay',x:235,y:325,r:6,kind:'tiny',lv:332},
  {k:'gannet',n:'Gannet Spit',x:385,y:55,r:5,kind:'tiny',lv:333},
  {k:'sunk',n:'The Sunk Key',x:565,y:430,r:4,kind:'tiny',lv:334},
  {k:'lonely',n:'Lonely Sands',x:330,y:590,r:5,kind:'tiny',lv:335},
  {k:'cormorant',n:'Cormorant Ledge',x:115,y:565,r:6,kind:'tiny',lv:336},
  {k:'kelpgate',n:'Kelpgate Rock',x:215,y:500,r:14,kind:'rock',lv:337},
  {k:'redcliff',n:'Redcliff',x:505,y:345,r:15,kind:'rock',lv:338},
  {k:'wrack',n:'Wrack Point',x:60,y:60,r:12,kind:'rock',lv:339},
  {k:'greenmantle',n:'Greenmantle',x:380,y:350,r:36,kind:'forest',lv:340},
  {k:'hollow',n:'The Hollow Isle',x:180,y:250,r:30,kind:'forest',lv:341},
  {k:'ashwood',n:'Ashwood',x:480,y:100,r:32,kind:'forest',lv:342},
  {k:'leviathan',n:"Leviathan's Rest",x:612,y:330,r:10,kind:'tiny',lv:343}
];
const SN_BY=Object.fromEntries(SN_ISLES.map(i=>[i.lv,i]));
const SN_PORTS={}; // where the ship sits in the open water when she leaves an island
for(const i of SN_ISLES)SN_PORTS[i.lv]={x:i.x,y:Math.min(SN.H-8,i.y+i.r+6),f:2};
SN_PORTS[290]={x:30,y:322,f:1};
const SN_BUOY=i=>({x:i.x,y:Math.min(SN.H-6,i.y+i.r+3)});
for(const n of ['yar_palms'])loadImg(n,'assets/'+n+'.png');

/* ---- the creatures of the open sea ---- */
Object.assign(ENEMY_DEF,{
  seaserpent:{name:'Sea Serpent',hp:240,dmg:[12,19],hit:.84,w:1.9,img:'uw_serp_0',xp:900,gold:[40,120],speed:1,verb:'strikes',aboveParty:1},
  kraken:{name:'The Kraken',hp:1500,dmg:[18,28],hit:.9,w:4.2,img:'uw_kraken_0',xp:12000,gold:[2000,3000],speed:1,verb:'crushes',aboveParty:5}
});

function snHeight(x,y){ // contribution of the islands at this cell, and the rock tint
  let best=-.2,isl=null;
  for(const I of SN_ISLES){
    const R=I.r*(I.kind==='forest'||I.kind==='green'?1.5:1.7);if(Math.abs(x-I.x)>R||Math.abs(y-I.y)>R)continue;
    const d=Math.hypot(x-I.x,y-I.y)/(I.r*(1+.3*(tsmooth(x/6,y/6,I.lv)-.5))),t=1-d;if(t<-.14)continue;
    let h;
    if(t>0){
      const peak=I.kind==='volcano'?5.2:I.kind==='rock'?2.9:I.kind==='green'?1.5:I.kind==='forest'?1.15:I.kind==='sand'?1.9:.6;
      h=Math.min(.5,.5*Math.min(1,t/.2))-.05+peak*Math.pow(Math.max(0,t-.22),I.kind==='volcano'?1.05:1.3)+.1*(tsmooth(x/5,y/5,I.lv+3)-.4)*Math.min(1,t*4);
    }else h=-.2+(t+.14)/.14*.15;
    if(h>best){best=h;isl=I}
  }
  return {h:best,isl};
}
function seaBuildOpen(){
  if(LEVELS[SN.ID])return;
  const W=SN.W,H=SN.H,N=W*H;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;let hh=-.2+.03*(tsmooth(x/8,y/8,9)-.5),land=false;
    const r=snHeight(x,y);if(r.h>hh){hh=r.h;land=r.h>-.06}
    // the coast of the mainland, in the west: Yarrim's shore
    if(x<24){const cx=18+4*Math.sin(y*.05)+2*Math.sin(y*.17);const t=cx-x;if(t>0){hh=Math.max(hh,Math.min(.5,t*.07)-.05);land=true}else if(t>-3){hh=Math.max(hh,-.2+(t+3)/3*.15)}}
    h[i]=hh;rk[i]=clamp((hh-.7)/1.6,0,1);block[i]=(land&&(hh>1.7||hh>-.05))?1:0;
    fm[i]=hh>1.2?'5':hh>.1?(r.isl&&(r.isl.kind==='forest'||r.isl.kind==='green')?'1':'0'):hh>-.06?'3':(hh>-.18?'3':'4');
  }
  // the sea is open: land is solid, water is not
  for(let i=0;i<N;i++)block[i]=h[i]>-.05?1:0;
  const decor=[],scenery=[],enemies=[],used=new Set();
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));used.add(x+','+y)};
  // landing buoys at every island, and the buoy for Yarrim on the west shore
  for(const I of SN_ISLES){let b=SN_BUOY(I);let g=0;while(g++<10&&(b.y>=H-3||block[b.y*W+b.x]))b.y=Math.min(H-3,b.y+1);put('uw_buoy',b.x,b.y,{npc:'sea_land_'+I.lv,deco:false});SN_PORTS[I.lv]={x:b.x,y:Math.min(H-3,b.y+2),f:2}}
  put('uw_buoy',28,322,{npc:'sea_land_290',deco:false});SN_PORTS[290]={x:31,y:322,f:1};
  // floating wrecks, for the sea quests and for the look of the thing
  const wrecks=[[110,330],[260,230],[350,480],[470,200],[300,380],[200,440],[440,400]];
  wrecks.forEach(([x,y],q)=>{if(!block[y*W+x]){put('yar_wreck',x,y,{npc:'sea_wreck',cat:q,deco:false})}});
  // serpents in the open water, away from the shore and from the ports
  const spots=[];for(let q=0;q<400&&spots.length<18;q++){const x=60+((hash2(q,3,501)*(SN.KRAKEN_X-70))|0),y=30+((hash2(q,4,501)*(H-60))|0);if(block[y*W+x])continue;let ok=true;for(const I of SN_ISLES)if(Math.hypot(x-I.x,y-I.y)<I.r+16)ok=false;for(const s of spots)if(Math.hypot(x-s[0],y-s[1])<50)ok=false;if(ok)spots.push([x,y])}
  for(const [x,y] of spots)enemies.push({t:'seaserpent',x,y});
  // gulls over the islands are made on the fly; here only the level
  const start={x:31,y:322,f:1};
  const lv={rows:rows.map(r=>r.join('')),start,enemies,items:[],decor,scenery,fmap:null,floorSet:['sand','dgrass','wood','bluesand','bluewater','pebA'],floor:'sand',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:'The Vaast Sea',label:'The Vaast Sea',noExtras:true,diff:22,tele:{x:start.x,y:start.y},chars:{D:LEVEL41_DATA.chars.D},lights:[],portals:[]};
  const fmapR=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmapR.push(s)}lv.fmap=fmapR;
  LEVELS[SN.ID]=lv;LEVEL_NAMES[SN.ID]='The Vaast Sea';TERRS[SN.ID]=yarTerrain(W,H,h,rk,block);
}
KH_LAZY[SN.ID]=seaBuildOpen;LEVEL_NAMES[SN.ID]='The Vaast Sea';
function sailOpen(from){seaBuildOpen();const P=SN_PORTS[from]||SN_PORTS[290];G.flags.seaFrom=from;goToLevel(SN.ID,{x:P.x,y:P.y,f:P.f})}
function arriveNearNpc(id,npc){
  KH_LAZY[id]&&!LEVELS[id]&&KH_LAZY[id]();const L=LEVELS[id];if(!L)return null;
  const d=L.decor.find(q=>q.npc===npc);if(!d)return {x:L.start.x,y:L.start.y,f:L.start.f};
  const T=TERRS[id];
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1],[0,-2],[-2,0],[2,0],[0,2]]){const x=d.x+dx,y=d.y+dy;if(L.rows[y]&&L.rows[y][x]==='.'&&!(T&&T.block[y*T.W+x]))return {x,y,f:0}}
  return {x:L.start.x,y:L.start.y,f:L.start.f};
}
for(const I of SN_ISLES){
  khNpc('sea_land_'+I.lv,'A landing buoy','uw_buoy',()=>{
    const go=()=>{const t=I.lv;G.flags.seaFrom=t;const to=t<=343&&t>=331?SEA_ARRIVE_ISLE(t):SEA_ARRIVE(t);goToLevel(t,to);return null};
    return say(`A red-and-white buoy marks the way in to ${I.n}.`,[[`Row ashore at ${I.n}.`,go],['Sail on.',()=>null]]);
  });
}
khNpc('sea_land_290','A landing buoy','uw_buoy',()=>say('The buoy marks the harbour of Yarrim, and the smoke of its chimneys over the western hills.',[['Sail in to Yarrim.',()=>{G.flags.seaFrom=290;const a=arriveNearNpc(290,'yr_ship')||{x:3,y:40,f:1};goToLevel(290,a);return null}],['Sail on.',()=>null]]));
khNpc('sea_wreck','A drifting wreck','yar_wreck',d=>say('The hull of a wrecked ship rides low in the water, broken-masted and weed-hung. Whatever she was, nothing is left aboard but a few ropes and gulls.',[BYE]));

/* ---- the bow of the ship, and the kraken line ---- */
function seaHud(){
  if(LEVEL!==SN.ID||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview)return;
  const im=IMG.uw_bow;if(!im)return;
  const t=G.time,w=420,hh=w*im.height/im.width,bob=Math.sin(t*1.1)*1.6+Math.sin(t*.37)*1.2,sway=Math.sin(t*.8)*.8;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  ctx.drawImage(im,sway-2,210-hh*.72+bob+8,w+4,hh*.9);
  ctx.restore();
}
(function(){const _h=uwHud;uwHud=function(){_h();try{seaHud()}catch(e){}}})();
const SN_T={k:0,warn:0,last:null,clock:0};
function seaTick(dt){
  if(LEVEL!==SN.ID)return;
  const F=G.flags,P=G.P;
  // sailing takes time: a few minutes of the day for every cell
  if(SN_T.last&&(SN_T.last[0]!==P.x||SN_T.last[1]!==P.y)&&G.state==='play')advanceTime(1.2);
  SN_T.last=[P.x,P.y];
  if(F.krakenSlain||G.state!=='play')return;
  if(P.x>=SN.KRAKEN_X-30&&!SN_T.warn){SN_T.warn=1;msg('The water ahead is flat and cold. No gulls fly east of here.','#9ad0e8')}
  if(P.x<SN.KRAKEN_X-45)SN_T.warn=0;
  const kr=G.enemies.find(e=>e.t==='kraken'&&e.hp>0);
  if(P.x>=SN.KRAKEN_X&&!kr&&!G.cut&&!G.talk){
    // the sea goes dark under the ship and the Kraken rises ahead of her
    let c=null;for(let i=0;i<60&&!c;i++){const a=Math.random()*TAU,d=4+Math.random()*3,x=Math.round(P.x+Math.cos(a)*d),y=Math.round(P.y+Math.sin(a)*d);if(x<2||y<2||x>=SN.W-2||y>=SN.H-2)continue;if(G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y))continue;c=[x,y]}
    if(c){addEnemy('kraken',c[0],c[1],true);F.krakenSeen=1;msg('The sea turns black. Something vast rises beside the ship, and a thousand suckers break the surface at once.','#ff8a7a');sfx('screech')}
  }
  if(kr&&P.x<SN.KRAKEN_X-12&&Math.hypot(kr.x-P.x,kr.y-P.y)>14){kr.hp=0;kr.dying=.55;msg('The ship slips back west and the great shape sinks into the dark. It will wait.','#9ad0e8')}
}
function seaEnterHook(n){
  const F=G.flags;
  if(n===SN.ID){SN_T.last=null;SN_T.warn=0;if(!F.seaSeen){F.seaSeen=1;msg('The Vaast Sea. Water to every horizon, and the Dawn Walker answering the helm. Walk forward to sail.','#a8d8ff')}}
  if(n===SN.ID&&F.krakenSlain&&!F.seaClear)F.seaClear=1;
}
/* serpents that have died give a scale: the sea quests count them */
/* the ship at an island: take the helm */
(function(){
  const _sc=seaChart;
  seaChart=function(){
    const n=_sc();if(!G.flags.voyage||!n||!n.opts)return n;
    if(LEVEL===SN.ID)return n;
    n.opts.splice(Math.max(0,n.opts.length-1),0,['Take the helm and sail the open sea.',()=>{sailOpen(LEVEL);return null}]);
    return n;
  };
})();
/* ---- the islands nobody lives on ---- */
const SN_SPEC={
  331:{w:56,h:50,fe:['bones','chest','sign'],tier:1,foes:[['uwcrab',2]],note:'A scrap of sand with a dead palm, a pile of weathered bones and a rotted sign.'},
  332:{w:56,h:50,fe:['palms','chest','camp'],tier:1,foes:[['uwcrab',3]],note:'A little cay of white pebbles. Someone has camped here, and left in a hurry.'},
  333:{w:56,h:50,fe:['bones','wreck','chest'],tier:1,foes:[['uwcrab',2]],note:'A thin spit of sand. Gannets wheel over it, screaming, and the wind smells of fish.'},
  334:{w:56,h:50,fe:['palms','wreck','chest'],tier:2,foes:[['uwcrab',3]],note:'A low sandbar that the tide nearly covers. Half a ship\'s ribs stick out of it.'},
  335:{w:56,h:50,fe:['palms','bones','camp'],tier:1,foes:[['uwcrab',2]],note:'A palm and a pile of sand. Whoever chose this island for a camp was desperate.'},
  336:{w:56,h:50,fe:['bones','chest','arch'],npcs:[['sn_wren','fisher']],tier:2,foes:[['uwcrab',3]],note:'A ledge of black rock, whitened with bird droppings. A stone arch stands on it that nobody built.'},
  337:{w:84,h:70,fe:['wreck','arch','chest','bones','stones'],tier:2,foes:[['skel',5],['uwcrab',4]],note:'A rocky island of kelp-hung cliffs. A broken ship lies on the rocks, and nothing grows.'},
  338:{w:84,h:70,fe:['stones','altar','chest','bones','camp'],tier:3,foes:[['skel',6],['scorpion',4]],note:'Red cliffs and red sand. Some old people built an altar here, and it still smells of smoke.'},
  339:{w:84,h:70,fe:['arch','wreck','bones','chest'],tier:2,foes:[['skel',5],['uwcrab',5]],note:'A hump of black stone at the north-west of the sea, its beaches heaped with wrack.'},
  340:{w:150,h:130,forest:1,fe:['stones','chest','chest','camp','arch','bones'],tier:3,foes:[['wolf',8],['bandit',6],['archer',3]],note:'A big green island, thick with forest. Birds sing in it, and not all the birdsong is birds.'},
  341:{w:140,h:120,forest:1,fe:['arch','chest','stones','camp','bones','altar'],npcs:[['sn_tobin','peasantM']],tier:3,foes:[['wolf',7],['skel',6],['ghost',3]],note:'A hollow island: forest on the rim and a ring of standing stones in the middle.'},
  342:{w:140,h:120,forest:1,fe:['camp','chest','chest','stones','bones','arch','nest'],tier:4,foes:[['wolf',9],['bandit',7],['archer',4],['spectre',3]],note:'A great island of ash trees and tangled paths. The paths are too straight to be natural.'},
  343:{w:60,h:54,fe:['altar','chest','bones','arch'],tier:5,foes:[['skel',6]],note:'A tiny island of black glass sand and bleached bone. The sea beyond it is silent.'}
};
function SEA_ARRIVE_ISLE(id){isleBuild(id);const L=LEVELS[id];return {x:L.start.x,y:L.start.y,f:L.start.f}}
function isleBuild(id){
  if(LEVELS[id])return;const I=SN_BY[id],S=SN_SPEC[id];if(!I||!S)return;
  const W=S.w,H=S.h,N=W*H,cx=W>>1,cy=(H>>1)-4,seed=id*7,rx=Math.min(W/2-10,I.kind==='forest'?58:I.kind==='rock'?32:14),ry=Math.min(H/2-12,I.kind==='forest'?48:I.kind==='rock'?26:11);
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  const peak=I.kind==='rock'?2.9:I.kind==='forest'?1.1:.5;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,d=Math.hypot((x-cx)/rx,(y-cy)/ry)*(1+.28*(tsmooth(x/5,y/5,seed)-.5)),t=1-d;
    let hh=-.2+.03*(tsmooth(x/4,y/4,seed+1)-.5);
    if(t>-.12)hh=t>0?Math.min(.5,.5*Math.min(1,t/.2))-.05+peak*Math.pow(Math.max(0,t-.22),1.25)+.1*(tsmooth(x/6,y/6,seed+2)-.4)*Math.min(1,t*4):-.2+(t+.12)/.12*.15;
    h[i]=hh;rk[i]=clamp((hh-.7)/1.6,0,1);block[i]=(hh<-.06||hh>1.7)?1:0;fm[i]=hh>1.2?'5':hh>.12?(S.forest?'1':'0'):hh>-.06?'3':(t>-.2?'3':'4');
  }
  let sy=-1;for(let y=H-2;y>0;y--)if(!block[y*W+cx]&&h[y*W+cx]>-.06){sy=y;break}
  const plank=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*W+x;block[i]=0;h[i]=.08;rk[i]=0;fm[i]='2'}};
  plank(cx,sy-1,cx+1,sy+4);
  const decor=[],scenery=[],enemies=[],used=new Set();
  const free=(x,y)=>x>2&&y>2&&x<W-3&&y<H-3&&!block[y*W+x]&&rows[y][x]==='.'&&!used.has(x+','+y)&&h[y*W+x]>.0;
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));used.add(x+','+y)};
  put('yar_ship_dawn',cx,sy+6,{npc:'yr_ship',deco:false});
  const spot=()=>{for(let q=0;q<200;q++){const a=Math.random()*TAU,r=Math.sqrt(Math.random())*.8,x=Math.round(cx+Math.cos(a)*rx*r),y=Math.round(cy+Math.sin(a)*ry*r);if(free(x,y)&&Math.hypot(x-cx,y-(sy-2))>9)return [x,y]}return null};
  let ci=0;
  for(const f of S.fe){const s=spot();if(!s)continue;
    if(f==='chest')put('uw_shellchest',s[0],s[1],{npc:'isle_chest',cat:ci++,deco:false});
    else if(f==='bones')put('yar_bones',s[0],s[1]);
    else if(f==='wreck')put('yar_wreck',s[0],s[1],{npc:'isle_wreck',cat:id*10+ci++,deco:false});
    else if(f==='camp'){put('yar_tent',s[0],s[1]);put('yar_bones',s[0]+1,s[1]+1)}
    else if(f==='arch')put('yar_arch',s[0],s[1]);
    else if(f==='stones'){put('yar_runestone',s[0],s[1]);}
    else if(f==='altar')put('yar_altar',s[0],s[1],{npc:'isle_altar',cat:id,deco:false});
    else if(f==='palms')put('yar_palms',s[0],s[1]);
    else if(f==='sign')put('yar_driftwood',s[0],s[1]);
    else if(f==='nest')put('yar_driftwood',s[0],s[1],{npc:'sn_nest',deco:false});
  }
  for(const [npc,face] of S.npcs||[]){const s=spot();if(s)put(face,s[0],s[1],{npc,deco:false})}
  // trees, bushes and shells
  const dens=S.forest?.14:.012;
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){
    if(!free(x,y)||h[y*W+x]<.12)continue;const r=hash2(x,y,seed+11);
    if(r<dens&&Math.hypot(x-cx,y-(sy-2))>7){const k=S.forest?'ltree'+((hash2(x,y,seed+12)*20)|0):'dpalm'+((hash2(x,y,seed+13)*4)|0);put(k,x,y,{sc:.85+hash2(x,y,seed+14)*.45})}
    else if(r>.9&&S.forest)scenery.push({k:'lbush0',wx:x+.5,wy:y+.5,sc:.8+hash2(x,y,seed+15)*.6,decor:{k:'lbush0',walk:true,x,y}});
    else if(r>.985)scenery.push({k:hash2(x,y,seed+16)<.5?'yar_shells':'yar_driftwood',wx:x+.5,wy:y+.5,sc:.8,decor:{k:'yar_shells',walk:true,x,y}});
  }
  for(let q=0;q<S.w/3;q++){const s=spot();if(s)scenery.push({k:'yar_gull_stand',wx:s[0]+.5,wy:s[1]+.5,sc:.9,decor:{k:'yar_gull_stand',walk:true,x:s[0],y:s[1]}})}
  for(const [t,n] of S.foes)for(let q=0;q<n;q++){const s=spot();if(s)enemies.push({t,x:s[0],y:s[1]})}
  const start={x:cx,y:sy-2,f:0};
  const lv={rows:rows.map(r=>r.join('')),start,enemies,items:[{k:'potion',x:cx+3,y:sy-5}],decor,scenery,floorSet:['sand','dgrass','wood','bluesand','bluewater','pebA'],floor:'sand',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:I.n[0].toUpperCase()+I.n.slice(1),label:I.n,noExtras:true,diff:18+S.tier*2,tele:{x:start.x,y:start.y},chars:{D:LEVEL41_DATA.chars.D},lights:[],portals:[]};
  const fm2=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fm2.push(s)}lv.fmap=fm2;
  LEVELS[id]=lv;LEVEL_NAMES[id]=lv.name;TERRS[id]=yarTerrain(W,H,h,rk,block);
}
for(const I of SN_ISLES)if(I.lv>=331){LEVEL_NAMES[I.lv]=I.n[0].toUpperCase()+I.n.slice(1);KH_LAZY[I.lv]=()=>isleBuild(I.lv)}
/* what is on the islands: chests, wrecks and altars give gold, and the sea quests hook into the wrecks and altars */
khNpc('isle_chest','A sea-bleached chest','uw_shellchest',d=>{
  const F=G.flags;F.isleChest=F.isleChest||{};const key=LEVEL+':'+d.cat;
  if(F.isleChest[key])return say('The chest is open and empty.',[BYE]);
  F.isleChest[key]=1;d.found=true;sfx('key');const S=SN_SPEC[LEVEL]||{tier:1},gold=Math.round(120*(S.tier+1)*(.7+hash2(LEVEL,d.cat,91)*.8));G.gold+=gold;giveXP(S.tier*200+100);
  const pool=['potion2','potion3','healdraught','manadraught','swiftness','ironskin','antidote','holywater'],it=pool[(hash2(LEVEL,d.cat,92)*pool.length)|0];
  const got=ITEMDEF[it]&&bagAdd(mkItem2(it,1));
  return say(`Salt has eaten the lock. Inside: ${gold} gold${got?' and a '+ITEMDEF[it].n.toLowerCase():''}, and a smell of old seas.`,[BYE])});
khNpc('isle_wreck','A wrecked hull','yar_wreck',d=>say('The ribs of a wrecked ship stand out of the sand, hung with weed. Cracked barrels, a rusted lantern and a broken oar lie in her shadow.',[BYE]));
khNpc('isle_altar','An old altar','yar_altar',d=>say('A weathered stone altar. Someone burned something here long ago, and the stone still remembers the heat.',[BYE]));
