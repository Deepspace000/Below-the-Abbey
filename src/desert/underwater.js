/* ==========================================================================
   THE UNDERWATER DUNGEONS. A reef under each of the four islands: 320 the Saltbarrow Reef, 321 the Drowned Abbey, 322 the Vent Gardens,
   323 the Last Light Wreck. The party needs a Diving Helm each (it goes in the helmet slot; sold in Yarrim), has four minutes of air at
   a time, and refills at the bubble vents. The seabed is sand; coral, kelp and rock stand where the trees stand in a forest; the sky is
   a sunlit sea that drifts and refracts; fish and schools of fish swim overhead and across the reef. Some creatures bite, some do not.
   A Potion of the Gill gives every hero the dive for good.
   ========================================================================== */
const uwLv=n=>(n>=320&&n<=323)||(typeof HGTE!=='undefined'&&HGTE.wet.has(n)); // the four reefs, and the submerged rooms of the Hollow Grasslands cities (hgt_engine.js)
const UW_MAX=240; // seconds of air
for(const n of ['staghorn','brain','kelp','seafan','anemone','rocks','tubes','clam','seagrass','amphora','softcoral','timber','vent0','vent1','buoy','shellchest','bow'])loadImg('uw_'+n,'assets/uw_'+n+'.png');
for(const n of ['bsard','bgold','btang'])for(const f of [0,1])loadImg('uw_'+n+'_'+f,'assets/uw_'+n+'_'+f+'.png'); // whole schools seen from below
for(const n of ['reef','angel','school','shark','ray','barra','crab','octo','jelly','eel','turtle','puffer','wshark','grouper','nautilus','serp','kraken']){
  loadImg('uw_'+n+'_0','assets/uw_'+n+'_0.png');
  loadImg('uw_'+n+'_1','assets/uw_'+n+'_1.png').then(()=>{IMG['uw_'+n+'_0A']=IMG['uw_'+n+'_1']}); // the second frame is the attack picture
}
Object.assign(NPC_H,{uw_staghorn:.95,uw_brain:.75,uw_kelp:1.7,uw_seafan:1,uw_anemone:.45,uw_rocks:.85,uw_tubes:.62,uw_clam:.5,uw_seagrass:.5,uw_amphora:.6,uw_softcoral:.75,uw_timber:1.3,uw_vent0:.8,uw_vent1:.8,uw_buoy:1.25,uw_shellchest:.55,
  uw_reef_0:.42,uw_reef_1:.42,uw_angel_0:.55,uw_angel_1:.55,uw_school_0:.6,uw_school_1:.6,uw_ray_0:.5,uw_ray_1:.5,uw_turtle_0:.5,uw_turtle_1:.5,uw_puffer_0:.4,uw_puffer_1:.4,uw_wshark_0:1.6,uw_wshark_1:1.6,uw_grouper_0:.95,uw_grouper_1:.95,uw_nautilus_0:.4,uw_nautilus_1:.4,uw_jelly_0:.6,uw_jelly_1:.6});

/* ---- items: the Diving Helm (helmet slot) and the Potion of the Gill ---- */
ITEMDEF.divehelm={n:'Diving Helm',k:'head',t:'Helm',ic:'divehelm',c:'#c8a050',armor:3,price:300,dive:1,d:'A riveted brass helm with a round glass visor and a leather hose. Worn in the helmet slot it lets a hero breathe underwater for four minutes at a time, until air is found at the bubble vents. Every hero in the party needs one to dive.',sw:.5};
ITEMDEF.gillpotion={n:'Potion of the Gill',k:'potion',t:'Potion',ic:'gillpotion',c:'#40c8a8',stack:1,gill:1,price:2500,rar:1,d:'A sea-green draught with a small silver fish turning in it. Whoever drinks it can breathe underwater for the rest of their life. The whole party is changed by one bottle.'};
ITEMDEF.pearl={n:'Pearl',k:'quest',t:'Pearl',ic:'pearl',c:'#f0f0ff',stack:1,price:140,d:'A round white pearl, milky and faintly pink, taken from a giant clam. A priest would pay in blessings. A jeweller would pay in gold.',sw:.2};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('divehelm','gillpotion','pearl');
function gillDrink(hi){const F=G.flags;F.gill=1;sfx('potion');msg(`${HERO_DEF[hi].name} drinks the Potion of the Gill. The whole party feels the sea open to them: from now on they can dive without helms.`,'#80f0d0')}
function uwSuited(){const F=G.flags;if(F.gill)return true;return G.heroes.some(h=>h.alive&&h.eq&&h.eq.head&&idef(h.eq.head).dive)} // somebody wears a helm: enough to go down (a hero without one drowns, see divehelms.js)
function uwWho(){return G.flags.gill?'':G.heroes.filter(h=>h.alive&&!(h.eq&&h.eq.head&&idef(h.eq.head).dive)).map((h,i)=>HERO_DEF[G.heroes.indexOf(h)].name).join(', ')}

/* ---- the creatures that bite, and the big ones ---- */
Object.assign(ENEMY_DEF,{
  uwshark:{name:'Reef Shark',hp:90,dmg:[8,14],hit:.78,w:1.15,img:'uw_shark_0',xp:200,gold:[0,6],speed:2,fly:true,verb:'bites'},
  uwbarra:{name:'Barracuda',hp:60,dmg:[6,11],hit:.8,w:.8,img:'uw_barra_0',xp:140,gold:[0,4],speed:2,fly:true,verb:'snaps at'},
  uwcrab:{name:'Reef Crab',hp:70,dmg:[7,12],hit:.74,w:.85,img:'uw_crab_0',xp:150,gold:[2,10],speed:1,verb:'pinches'},
  uwoctopus:{name:'Octopus',hp:110,dmg:[8,13],hit:.76,w:.8,img:'uw_octo_0',xp:260,gold:[4,14],speed:1,verb:'constricts'},
  uwjelly:{name:'Glow Jelly',hp:50,dmg:[5,10],hit:.82,w:.7,img:'uw_jelly_0',xp:130,gold:[0,0],speed:1,fly:true,verb:'stings'},
  uweel:{name:'Moray Eel',hp:100,dmg:[9,15],hit:.8,w:.95,img:'uw_eel_0',xp:230,gold:[2,12],speed:1,verb:'bites'},
  uwpuffer:{name:'Spiny Puffer',hp:55,dmg:[6,10],hit:.78,w:.6,img:'uw_puffer_0',xp:120,gold:[0,3],speed:1,fly:true,verb:'spikes'},
  uwgiant:{name:'The Reef Warden',hp:420,dmg:[13,20],hit:.84,w:2.4,img:'uw_octo_0',xp:2000,gold:[400,700],speed:1,verb:'crushes',aboveParty:2},
  uweelboss:{name:'The Abbey Eel',hp:460,dmg:[14,22],hit:.85,w:2.3,img:'uw_eel_0',xp:2400,gold:[500,800],speed:1,verb:'savages',aboveParty:2},
  uwmega:{name:'The Vent Tyrant',hp:520,dmg:[15,23],hit:.86,w:2.9,img:'uw_shark_0',xp:2800,gold:[600,900],speed:2,fly:true,verb:'rends',aboveParty:3},
  uwgulper:{name:'Old Gulper',hp:600,dmg:[16,25],hit:.86,w:2.5,img:'uw_grouper_0',xp:3400,gold:[800,1200],speed:1,fly:true,verb:'swallows at',aboveParty:3}
});

/* ---- the sunlit sea for a sky ---- */
let UWPAN=null;
function uwPan(){
  if(UWPAN)return UWPAN;
  const W=1024,H=256,d=new Uint8ClampedArray(W*H*4),top=[110,226,236],mid=[34,146,186],low=[18,84,128];
  const beams=[];for(let k=0;k<9;k++)beams.push({pos:(k/9+.04*Math.sin(k*3.7))*TAU,p:14+((k*37)%5)*18,a:.55+.4*((k*13)%4)/3});
  for(let y=0;y<H;y++){
    const t=clamp((y-45)/105,0,1),tt=Math.pow(t,.8);
    let c0=[0,0,0];for(let i=0;i<3;i++)c0[i]=t<1?top[i]+(mid[i]-top[i])*tt:mid[i]+(low[i]-mid[i])*clamp((y-150)/100,0,1);
    for(let x=0;x<W;x++){
      const u=x/W*TAU;let b=0;
      for(const q of beams)b+=q.a*Math.pow(Math.max(0,Math.cos(u-q.pos+(y/H)*.7)),q.p); // slanted shafts of sun that thin out as they go down
      const fade=1-t*.78,sp=hash2(x,y,311)>.9965?1:0;
      const o=(y*W+x)*4;
      d[o]=c0[0]+(255-c0[0])*b*.7*fade+sp*60*fade;d[o+1]=c0[1]+(246-c0[1])*b*.7*fade+sp*60*fade;d[o+2]=c0[2]+(200-c0[2])*b*.55*fade+sp*40*fade;d[o+3]=255;
    }
  }
  return UWPAN=d;
}

/* ---- the sea overhead: fish and schools of fish drift across the light, and now and then something huge ---- */
function uwSkyFish(){
  const V=SKYV;if(!V||!IMG.uw_reef_0)return;
  const sx=420/V.VW,sy=210/V.VH,t=G.time;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,V.HH*sy-4);ctx.clip();
  const KINDS=['reef','angel','school','school','reef','angel','turtle','ray'];
  const draw=(k,fr,az,el,w,alpha)=>{
    const im=IMG['uw_'+k+'_'+fr];if(!im)return;
    const mx=Math.cos(az),my=Math.sin(az),a=(mx*V.dX+my*V.dY)/(V.dX*V.dX+V.dY*V.dY),b=(mx*V.pX+my*V.pY)/(V.pX*V.pX+V.pY*V.pY);if(a<=.05)return;
    const px=((b/a+1)*V.VW/2)*sx,py=(V.HH-18-el*V.HH*.9)*sy;if(px<-60||px>480||py<-30)return;
    const hh=w*im.height/im.width;ctx.globalAlpha=alpha;ctx.drawImage(im,px-w/2,py-hh/2,w,hh);
  };
  // schools: whole shoals seen from underneath, head to the front of the drift, drawn as if swimming over the viewer
  const SC=[['bsard',74],['bgold',92],['bsard',96]];
  for(let s=0;s<9;s++){
    const [k,w]=SC[s%3],dir=s%2?1:-1,az=(s*.71+t*(.02+.005*(s%4))*dir)%TAU,el=.2+.32*((s*37)%7)/7+Math.sin(t*.3+s)*.015;
    draw(k,((t*2.2+s)|0)&1,az,el,w*(.85+.3*((s*13)%5)/5),.9);
  }
  // singles
  for(let i=0;i<16;i++){
    const az=(i*.39+t*(.03+.008*(i%5))*(i%2?1:-1)+8)%TAU,el=.16+.4*((i*53)%9)/9,k=['reef','angel','turtle','ray','angel','reef'][i%6];
    draw(k,((t*3.5+i)|0)&1,az,el,k==='ray'?34:k==='turtle'?24:15+i%3*3,.9);
  }
  // an occasional giant crossing high above, a dark shape against the light
  for(let g=0;g<2;g++){const az=((t*(.012+.004*g))*(g?-1:1)+g*3.1+5)%TAU;draw(g?'ray':'wshark',((t*1.6)|0)&1,az,.5+.1*g,g?70:100,.45)}
  ctx.restore();
}

/* ---- air: four minutes, refilled at the vents ---- */
function uwBar(){
  if(!G.uw||G.cut||G.talk||G.menu||G.inv.open||G.loot||G.overview)return;
  const a=G.uw.air/UW_MAX,x=135,y=20,w=150,h=11;
  ctx.save();
  ctx.fillStyle='rgba(6,20,30,.78)';rrect(ctx,x-2,y-2,w+4,h+4,4);ctx.fill();
  ctx.fillStyle=a>.5?'#5ac8f0':a>.2?'#e8d060':'#f06050';rrect(ctx,x,y,Math.max(2,w*a),h,3);ctx.fill();
  ctx.lineWidth=1.3;ctx.strokeStyle='#8fd8ff';rrect(ctx,x-2,y-2,w+4,h+4,4);ctx.stroke();
  const m=Math.floor(G.uw.air/60),s=Math.floor(G.uw.air%60);
  txt(`AIR ${m}:${String(s).padStart(2,'0')}`,x+w/2,y+h/2+.5,7.4,'#ffffff','center',true);
  if(G.uw.vent)txt('Breathing from the vent',x+w/2,y+h+8,7,'#b8f0ff','center',true);
  if(G.uw.air<=0)txt('DROWNING! Swim to a vent, or surface',x+w/2,y+h+18,7.6,'#ff8070','center',true);
  ctx.restore();
}
function uwHud(){try{uwBar()}catch(e){}}
function uwTick(dt){
  if(!uwLv(LEVEL)){if(G.uw)G.uw=null;return}
  const F=G.flags;if(!G.uw)G.uw={air:UW_MAX,vent:false,warn:3,drown:0,dmgT:0};
  if(G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot)return;
  const U=G.uw,L=UWS[LEVEL];
  U.vent=false;if(L)for(const v of L.vents){if(Math.abs(v[0]-G.P.x)<=1&&Math.abs(v[1]-G.P.y)<=1){U.vent=true;break}}
  if(U.vent){U.air=Math.min(UW_MAX,U.air+dt*70);if(U.air>=UW_MAX*.98)U.warn=3;if(!U.sip){U.sip=1;msg('The party breathes in the stream of bubbles. Cold air, tasting of metal.','#b8f0ff')}}
  else{U.sip=0;U.air=Math.max(0,U.air-dt);
    const w=U.air<=10?0:U.air<=30?1:U.air<=60?2:3;
    if(w<U.warn){U.warn=w;msg(w===2?'One minute of air left.':w===1?'Thirty seconds of air. Find a vent.':'Ten seconds of air!',w===2?'#8fd8ff':'#ff9070')}}
  if(U.air<=0){
    U.drown+=dt;U.dmgT+=dt;
    if(U.dmgT>=2){U.dmgT=0;for(const h of G.heroes)if(h.alive){h.hp=Math.max(1,h.hp-Math.max(1,Math.round(h.max*.07)))}msg('The party is drowning!','#ff7060');sfx('hurt')}
    if(U.drown>=14){U.drown=0;msg('Gasping, the party is hauled up to the surface by the dive line.','#b8f0ff');uwSurface()}
  }else U.drown=0;
}
function uwSurface(){
  if(typeof HGTE!=='undefined'&&HGTE.wet.has(LEVEL)){const r=HGTE.wetReturn(LEVEL);G.uw=null;if(r)goToLevel(r.to,{x:r.x,y:r.y,f:r.f|0});return}   // a submerged room: back to the pool surface in the city
  const L=UW[LEVEL];if(!L)return;
  G.uw=null;goToLevel(L.island,SEA_ARRIVE(L.island));
}
function uwEnterHook(n){if(uwLv(n)){G.uw={air:UW_MAX,vent:false,warn:3,drown:0,dmgT:0};const L=UW[n];if(L&&!(G.flags.uwSeen&&G.flags.uwSeen[n])){(G.flags.uwSeen=G.flags.uwSeen||{})[n]=1;msg(L.intro,'#b8f0ff')}}else if(G.uw)G.uw=null}

/* ---- the four reefs ---- */
const UW={
  320:{name:'The Saltbarrow Reef',island:300,diff:17,seed:101,theme:'reef',intro:'Light falls through the water in long gold shafts. A reef of staghorn and brain coral lies ahead, alive with colour.',boss:['uwgiant',54,16],prize:'maeve',
    foes:[['uwshark',5],['uwbarra',6],['uwcrab',8],['uwoctopus',3],['uwjelly',5],['uweel',3]]},
  321:{name:'The Drowned Abbey',island:301,diff:19,seed:202,theme:'abbey',intro:'Below the Isle of Bells the abbey still stands, roofless, hung with kelp. A great bronze bell sways in a broken arch, and no sound comes from it.',boss:['uweelboss',54,16],prize:'bells',
    foes:[['uwshark',4],['uwbarra',7],['uwcrab',7],['uwoctopus',3],['uwjelly',6],['uweel',5]]},
  322:{name:'The Vent Gardens',island:302,diff:21,seed:303,theme:'vent',intro:'Black rock and warm water. Columns of bubbles rise from cracks in the seabed, and tube sponges crowd round them like blue organ pipes.',boss:['uwmega',54,16],prize:'vent',
    foes:[['uwshark',7],['uwbarra',6],['uwcrab',8],['uwoctopus',4],['uwjelly',6],['uweel',4],['uwpuffer',4]]},
  323:{name:'The Last Light Wreck',island:303,diff:23,seed:404,theme:'wreck',intro:'A forest of kelp rises to the light. In the middle of it a ship lies on her side with her masts snapped, and something very large is turning slowly among them.',boss:['uwgulper',54,16],prize:'lens',
    foes:[['uwshark',7],['uwbarra',8],['uwcrab',7],['uwoctopus',4],['uwjelly',7],['uweel',5],['uwpuffer',4]]}
};
const UWS={}; // per level: where the vents are, and what swims by
const UW_THEME={
  reef:{big:['staghorn','brain','rocks','tubes'],small:['softcoral','anemone','seafan','seagrass','kelp'],props:['clam','amphora']},
  abbey:{big:['yar_arch','timber','rocks','brain'],small:['kelp','seagrass','softcoral','anemone'],props:['amphora','clam']},
  vent:{big:['rocks','tubes','staghorn','yar_crystals'],small:['anemone','seafan','seagrass','softcoral'],props:['clam','amphora']},
  wreck:{big:['timber','yar_wreck','rocks','brain'],small:['kelp','kelp','seagrass','softcoral','anemone'],props:['amphora','clam']}
};
function uwBuild(id){
  if(LEVELS[id])return;const sp=UW[id];if(!sp)return;
  const W=110,H=110,N=W*H,th=UW_THEME[sp.theme],seed=sp.seed;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('0');
  const start={x:55,y:100,f:0},bossAt=[sp.boss[1],sp.boss[2]];
  // the seabed: low rolling sand, rock walls round the edge, a few rock towers and ridges inside
  const towers=[];for(let i=0;i<14;i++){towers.push([14+hash2(i,1,seed)*82,14+hash2(i,2,seed)*70,3+hash2(i,3,seed)*3.5,2.2+hash2(i,4,seed)*2])}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,e=Math.min(x,y,W-1-x,H-1-y);
    let hh=.2+.35*tsmooth(x/9,y/9,seed)+.12*Math.sin(x*.7+y*.4)*.5+.1*tsmooth(x/3,y/3,seed+1);
    const edge=clamp((15-e)/13,0,1);hh+=Math.pow(edge,1.2)*(4.4+1.2*tsmooth(x/5,y/5,seed+2));
    for(const [tx,ty,tr,tp] of towers){const d=Math.hypot(x-tx,y-ty)/tr;if(d<1&&Math.hypot(x-start.x,y-start.y)>14&&Math.hypot(x-bossAt[0],y-bossAt[1])>14)hh=Math.max(hh,tp*Math.pow(1-d,.9)+.3)}
    // the start and the boss's arena are flat
    const ds=Math.hypot(x-start.x,y-start.y),db=Math.hypot(x-bossAt[0],y-bossAt[1]);
    if(ds<9)hh=.25+(hh-.25)*clamp((ds-5)/4,0,1);if(db<12)hh=.25+(hh-.25)*clamp((db-8)/4,0,1);
    h[i]=hh;rk[i]=clamp((hh-.8)/1.6,0,1);block[i]=hh>1.7?1:0;
    const n=tsmooth(x/6,y/6,seed+7);fm[i]=hh>1.15?'5':n<.3?'0':n<.55?'1':n<.8?'2':'3';
  }
  // a guaranteed corridor from the start to the arena, so no tower can wall the boss in
  const carve=(x0,y0,x1,y1)=>{let x=x0,y=y0;const step=()=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<2||yy<2||xx>=W-2||yy>=H-2)continue;const i=yy*W+xx;if(block[i]){block[i]=0;h[i]=.3;rk[i]=0;fm[i]='0'}}};while(x!==x1||y!==y1){step();if(Math.abs(x-x1)>=Math.abs(y-y1)&&x!==x1)x+=Math.sign(x1-x);else if(y!==y1)y+=Math.sign(y1-y);else x+=Math.sign(x1-x)}step()};
  carve(start.x,start.y,start.x-18,60);carve(start.x-18,60,bossAt[0]-10,40);carve(bossAt[0]-10,40,bossAt[0],bossAt[1]+8);
  const decor=[],scenery=[],used=new Set(),enemies=[],items=[];
  const free=(x,y)=>x>3&&y>3&&x<W-4&&y<H-4&&!block[y*W+x]&&rows[y][x]==='.'&&!used.has(x+','+y);
  const dc=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));used.add(x+','+y)};
  const sc=(k,x,y,s)=>scenery.push({k,wx:x+.5,wy:y+.5,sc:s||1,decor:{k,walk:true,x,y}});
  const R=(a,b,c)=>hash2(a,b,c);
  // coral gardens: clusters of big things with undergrowth between them
  const gardens=[];for(let g=0;g<40;g++)gardens.push([8+R(g,1,seed+9)*94,10+R(g,2,seed+9)*84,3+R(g,3,seed+9)*5]);
  let n=0;
  for(const [gx,gy,gr] of gardens){
    for(let q=0;q<6;q++){const a=R(n,q,5)*TAU,rr=R(n,q,6)*gr,x=Math.round(gx+Math.cos(a)*rr),y=Math.round(gy+Math.sin(a)*rr*.85);if(!free(x,y)||Math.hypot(x-start.x,y-start.y)<8||Math.hypot(x-bossAt[0],y-bossAt[1])<10)continue;const k=th.big[(R(n,q,7)*th.big.length)|0];dc(k.startsWith('yar_')?k:'uw_'+k,x,y,{sc:.9+R(n,q,8)*.4})}
    for(let q=0;q<26;q++){const a=R(n,q+20,5)*TAU,rr=R(n,q+20,6)*gr*1.3,x=Math.round(gx+Math.cos(a)*rr),y=Math.round(gy+Math.sin(a)*rr*.85);if(!free(x,y))continue;const k=th.small[(R(n,q,9)*th.small.length)|0];sc('uw_'+k,x,y,.8+R(n,q,10)*.7)}
    n++;
  }
  for(let q=0;q<700;q++){const x=4+((R(q,31,seed)*(W-8))|0),y=4+((R(q,32,seed)*(H-8))|0);if(!free(x,y))continue;sc('uw_'+(R(q,33,seed)<.6?'seagrass':R(q,34,seed)<.5?'kelp':'anemone'),x,y,.8+R(q,35,seed)*.6)} // undergrowth everywhere
  // props: giant clams (some hold pearls), old pots
  const clams=[];
  for(let q=0;q<10;q++){const x=8+((R(q,41,seed)*(W-16))|0),y=14+((R(q,42,seed)*(H-34))|0);if(!free(x,y)||Math.hypot(x-start.x,y-start.y)<10)continue;clams.push([x,y]);dc('uw_clam',x,y,{npc:'uw_clam',cat:q,deco:false})}
  for(let q=0;q<8;q++){const x=8+((R(q,43,seed)*(W-16))|0),y=14+((R(q,44,seed)*(H-34))|0);if(free(x,y))dc('uw_amphora',x,y)}
  // chests and the vents
  const chests=[[22,82],[88,76],[30,48],[80,42],[18,22],[92,24],[60,64],[44,30]];
  chests.forEach(([cx,cy],q)=>{let s=null;for(let r=0;r<8&&!s;r++)for(let yy=-r;yy<=r&&!s;yy++)for(let xx=-r;xx<=r&&!s;xx++){const x=cx+xx,y=cy+yy;if(free(x,y)&&Math.hypot(x-start.x,y-start.y)>8)s=[x,y]}if(s)dc('uw_shellchest',s[0],s[1],{npc:'uw_chest',cat:q,deco:false})});
  const vents=[],vspots=[[start.x-6,start.y-6],[26,66],[84,60],[54,34]];
  for(const [vx,vy] of vspots){let s=null;for(let r=0;r<8&&!s;r++)for(let yy=-r;yy<=r&&!s;yy++)for(let xx=-r;xx<=r&&!s;xx++){const x=vx+xx,y=vy+yy;if(!block[y*W+x]&&rows[y][x]==='.')s=[x,y]}if(s){vents.push(s);used.add(s[0]+','+s[1])}}
  // a landmark or two ahead of the start, so that each reef opens on its own picture
  {const LM={reef:['staghorn','brain','staghorn'],abbey:['yar_arch','yar_arch','timber'],vent:['tubes','rocks','tubes'],wreck:['yar_wreck','timber','rocks']}[sp.theme]||[];
    LM.forEach((k,i)=>{const x=start.x-7+i*7,y=start.y-8-(i%2)*2;if(free(x,y))dc(k.startsWith('yar_')?k:'uw_'+k,x,y,{sc:1.35+(i%2)*.25})})}
  // the dive line up, the prize, and the boss
  dc('uw_buoy',start.x+2,start.y-1,{npc:'uw_up',cat:id,deco:false});
  for(let q=0;q<4;q++){let s=null;for(let r=0;r<10&&!s;r++)for(let yy=-r;yy<=r&&!s;yy++)for(let xx=-r;xx<=r&&!s;xx++){const x=[30,80,50,70][q]+xx,y=[40,30,60,80][q]+yy;if(free(x,y)&&Math.hypot(x-start.x,y-start.y)>10)s=[x,y]}if(s)dc('uw_timber',s[0],s[1],{npc:'uw_oak',cat:q,deco:false})}
  {const tg={320:[94,18],321:[14,22],322:[92,68],323:[16,64]}[id];let s=null;   // the piece of the singing shell, in a far corner
    if(tg)for(let r=0;r<12&&!s;r++)for(let yy=-r;yy<=r&&!s;yy++)for(let xx=-r;xx<=r&&!s;xx++){const x=tg[0]+xx,y=tg[1]+yy;if(free(x,y))s=[x,y]}
    if(s){carve(60,56,s[0],s[1]);used.delete(s[0]+','+s[1]);dc('uw_clam',s[0],s[1],{npc:'uw_shellpc',cat:id,deco:false})}}
  dc('uw_shellchest',bossAt[0],bossAt[1]-4,{npc:'uw_prize',cat:id,deco:false});
  enemies.push({t:sp.boss[0],x:bossAt[0],y:bossAt[1]});
  for(const [t,cnt] of sp.foes){for(let q=0;q<cnt;q++){let tries=0,x,y;do{x=6+((R(q,t.length+51,seed)*0+Math.random()*(W-12))|0);y=6+((Math.random()*(H-30))|0);tries++}while((!free(x,y)||Math.hypot(x-start.x,y-start.y)<22||Math.hypot(x-bossAt[0],y-bossAt[1])<14)&&tries<80);if(tries<80)enemies.push({t,x,y})}}
  items.push({k:'potion',x:start.x+4,y:start.y-3});
  // what swims by: schools, reef fish, turtles, rays, and the occasional giant
  const swim=[];
  const lane=(k,cnt,hlo,hhi,spd,n0)=>{for(let q=0;q<cnt;q++)swim.push({k,x0:6+R(q,n0,seed)*(W-12),y0:8+R(q,n0+1,seed)*(H-30),dx:(R(q,n0+2,seed)-.5)*60,dy:(R(q,n0+3,seed)-.5)*40,h:hlo+R(q,n0+4,seed)*(hhi-hlo),sp:spd*(.7+R(q,n0+5,seed)*.6),ph:R(q,n0+6,seed)*100,sz:.85+R(q,n0+7,seed)*.3})};
  lane('reef',16,.5,1.8,.9,60);lane('angel',10,.6,2,.8,70);lane('school',9,.8,2.4,1.0,80);lane('turtle',3,.5,1.4,.35,90);lane('ray',3,1,2.4,.5,100);lane('puffer',3,.5,1.4,.4,110);lane('nautilus',3,.4,1,.3,120);lane('wshark',2,2.4,3.2,.25,130);lane('grouper',2,.6,1.2,.3,140);lane('jelly',6,1,2.6,.3,150);
  const lv={rows:rows.map(r=>r.join('')),start,enemies,items,decor,scenery,fmap:null,floorSet:['seabed1','seabed2','seabed3','sand','sand','seabed4'],floor:'seabed1',ceil:'cloud',
    day:.98,outdoor:true,amb:.95,name:sp.name,label:sp.name,noExtras:true,diff:sp.diff,tele:{x:start.x,y:start.y},chars:{D:LEVEL41_DATA.chars.D},lights:[],portals:[]};
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  UWS[id]={vents,swim};
  LEVELS[id]=lv;LEVEL_NAMES[id]=sp.name;TERRS[id]=yarTerrain(W,H,h,rk,block);
}
for(const id in UW){LEVEL_NAMES[+id]=UW[id].name;KH_LAZY[+id]=()=>uwBuild(+id)}
/* swimmers and the vents' bubbles */
function uwSprites(out){
  if(!uwLv(LEVEL)||!UWS[LEVEL])return;
  const t=G.time,S=UWS[LEVEL];
  for(const v of S.vents){const im=IMG['uw_vent'+(((t*2.4)|0)&1)];if(im)out.push({x:v[0]+.5,y:v[1]+.5,img:im,w:NPC_H.uw_vent0*im.width/im.height,bob:0,decor:{walk:true,k:'uw_vent'}})}
  S.swim.forEach((f,i)=>{
    const L=Math.hypot(f.dx,f.dy)||1,ph=(t*f.sp*.35+f.ph)%2,u=ph<1?ph:2-ph; // there and back
    const fr=((t*3.4+i)|0)&1,im=IMG['uw_'+f.k+'_'+fr];if(!im)return;
    const hh=NPC_H['uw_'+f.k+'_0']*f.sz,w=hh*im.width/im.height;
    out.push({x:f.x0+f.dx*u,y:f.y0+f.dy*u,img:im,w,bob:f.h+Math.sin(t*.7+i)*.15,decor:{walk:true,k:'uw_sw'+(i%9)}});
  });
}
/* ---- dive sites on the islands, the helm-maker in Yarrim, and the quests under the sea ---- */
const UW_NAMES={300:'Saltbarrow',301:'the Isle of Bells',302:'Cinder Isle',303:'Last Light'};
for(const id of [300,301,302,303]){
  khNpc('uw_dive_'+id,'A dive line','uw_buoy',()=>{
    const F=G.flags,tg=id+20;
    if(uwSuited())return say(`A weathered line runs from a red-and-white buoy down into the clear water off ${UW_NAMES[id]}. Far below, a reef glitters.${typeof uwBareNames==='function'&&uwBareNames()?' Without a helm, '+uwBareNames()+' would start to drown down there.':''}`,[['Dive.',()=>{G.uw=null;goToLevel(tg,SEA_ARRIVE_UW(tg));return null}],['Not now.',()=>null]]);
    const who=uwWho();
    return say(`A line runs from a buoy down into the water off ${UW_NAMES[id]}, and far below something glitters. To dive, at least one hero must wear a Diving Helm in the helmet slot, which gives four minutes of air at a time. Any hero without a helm will start to drown. They are made by Tam Salvor in Yarrim.${who?' Not yet wearing one: '+who+'.':''}`,[BYE]);
  });
}
function SEA_ARRIVE_UW(id){uwBuild(id);const L=LEVELS[id];return {x:L.start.x,y:L.start.y,f:L.start.f}}
khNpc('uw_up','The dive line','uw_buoy',d=>say('The dive line runs up through the light to the surface.',[['Go up.',()=>{uwSurface();return null}],['Stay.',()=>null]]));
khNpc('uw_clam','A giant clam','uw_clam',d=>{
  const F=G.flags;F.uwClam=F.uwClam||{};const key=LEVEL+':'+d.cat;
  if(F.uwClam[key])return say('The clam has closed. It will not open for you again.',[BYE]);
  F.uwClam[key]=1;d.found=true;sfx('key');
  if(hash2(LEVEL,d.cat,77)<.55){bagAdd(mkItem2('pearl',1));return say('The clam eases open, and a white pearl glows in the lip of its shell. You take it.',[BYE])}
  G.gold+=30+Math.floor(hash2(LEVEL,d.cat,78)*60);return say('The clam opens on nothing but sand and a few old coins. You take the coins.',[BYE])});
khNpc('uw_chest','A shell-clasped chest','uw_shellchest',d=>{
  const F=G.flags;F.uwChest=F.uwChest||{};const key=LEVEL+':'+d.cat;
  if(F.uwChest[key])return say('The chest is open and empty.',[BYE]);
  F.uwChest[key]=1;d.found=true;sfx('key');const tier=UW[LEVEL]?UW[LEVEL].diff:17,gold=Math.round(tier*(4+hash2(LEVEL,d.cat,79)*8));G.gold+=gold;
  const pool=['potion2','potion3','healdraught','manadraught','swiftness','ironskin'],it=pool[(hash2(LEVEL,d.cat,80)*pool.length)|0];
  const got=ITEMDEF[it]&&bagAdd(mkItem2(it,1));giveXP(Math.round(tier*30));
  return say(`The brass clasp is green with age. Inside, under a layer of silt: ${gold} gold${got?' and a '+ITEMDEF[it].n.toLowerCase():''}.`,[BYE])});
khNpc('uw_prize','A great chest','uw_shellchest',d=>{
  const F=G.flags,sp=UW[LEVEL];F.uwPrize=F.uwPrize||{};
  const boss=G.enemies.some(e=>e.hp>0&&sp&&e.t===sp.boss[0]);
  if(boss)return say('A great iron-bound chest sits in the sand, and the creature that guards it has not gone anywhere.',[BYE]);
  if(F.uwPrize[LEVEL])return say('The chest is empty.',[BYE]);
  F.uwPrize[LEVEL]=1;d.found=true;sfx('key');G.gold+=sp.diff*25;giveXP(sp.diff*160);
  const txt={320:'Inside, on a heap of Spanish-looking coin, lies Sable Maeve\'s sunk fortune and her old captain\'s cutlass.',321:'Inside, wrapped in oilcloth, lies the great bell\'s clapper, a heavy tongue of green bronze.',322:'Inside, in a nest of glowing rock, lies the Heart of the Vent: a black crystal that is warm to hold.',323:'Inside lies the ship\'s great lamp lens, a perfect disc of glass in a brass ring, unbroken.'}[LEVEL];
  if(LEVEL===323&&!F.gill&&bagAdd(mkItem2('gillpotion',1)))return say(txt+' Under it, a green glass bottle with a silver fish turning in it: a Potion of the Gill.',[BYE]);
  return say(txt,[BYE])});
