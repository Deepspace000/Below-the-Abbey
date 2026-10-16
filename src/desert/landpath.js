/* ==========================================================================
   THE LAND PATH. A gate in the north wall of Oldhaven opens on a path that runs north up the peninsula for a very long time, with the sea
   on the west and an old oak forest on the east, then turns west over the mountains and south again, and ends at a high cliff above
   Yarrim. It is only a way of walking: no quests and no fights, just flowers, lamps, a few houses, inns and churches, and a quiet that
   lasts about an hour. It goes one way: from Oldhaven to Yarrim. The cliff at the end can only be climbed down.
   24 levels of 72 by 400 cells (400 to 423), built when first reached; the legs: N (coast, going north) 0 to 7, W (the mountains, going
   west) 8 to 15, S (coast, going south, drawn the other way round so the sea is still on the right hand west) 16 to 21, D (the high pass
   and the descent) 22 and 23. Each leg is a stretch of the same kind of country. The 13 buildings are rooms numbered from 6800.
   ========================================================================== */
const LPOV=160,LPT=72; // two neighbouring stretches share their last and first 160 rows exactly, and the party is carried from one to the other 72 rows from the end, where the end cannot be seen
const LP={BASE:400,N:24,ROOM0:6800,W:104,H:800,CX:76,A:10},LPK=LP.H/400;
const LP_LEG_SD={N:1011,W:2022,S:3033,D:4044}; // 24 stretches of 560 rows is about 13,000 steps
const LP_LEG=s=>s<8?'N':s<16?'W':s<22?'S':'D';
const LP_BUILD=[ // [segment, kind, row, name, keeper id]
  [1,'house',250,"The Shepherd’s House",'lp_r0'],[3,'inn',150,'The Last Lamp','lp_inn0'],[5,'church',280,'The Church of the Long Road','lp_pr0'],[6,'house',110,"The Fisherman’s House",'lp_r1'],
  [9,'house',200,"The Hermit’s House",'lp_r2'],[11,'church',300,'The Chapel of the Quiet','lp_pr1'],[13,'inn',160,'The Cold Spring Inn','lp_inn1'],[15,'house',90,"The Charcoal-Burner’s House",'lp_r3'],
  [17,'house',270,"The Gardener’s House",'lp_r4'],[18,'church',200,"Saint Aldric’s by the Sea",'lp_pr2'],[19,'inn',320,"The Wayfarer’s Rest",'lp_inn2'],[20,'house',120,"The Beekeeper’s House",'lp_r5'],[22,'house',300,"The Last House",'lp_r6']
];
const LP_TELE=[3,9,14,19]; // segments with a hidden stone teleporter in the forest (or the mountain rocks)
const LP_ROOM=(i)=>LP.ROOM0+i;
for(let i=0;i<LP_BUILD.length;i++)LEVEL_NAMES[LP_ROOM(i)]=LP_BUILD[i][3];
for(let s=0;s<LP.N;s++)LEVEL_NAMES[LP.BASE+s]=LP_LEG(s)==='W'?'The Land Path, over the mountains':LP_LEG(s)==='D'?'The Land Path, the high pass':'The Land Path';
/* ---- the people ---- */
const LP_RES=[
  ['lp_r0','A shepherd','kh_ohfolk7_0',["Sheep do not care who is king. It is the best thing about them.","I walk the same road every morning, and the sea has never once looked the same.","Stay as long as you like. There is bread, and nobody to tell it to."]],
  ['lp_r1','A fisherman','kh_oqmen_5',["The boats go out from the coast road. I have not been down in years. I like the sound from here.","Forty years of nets, and what I remember best is the quiet before the first cast.","If you walk long enough you will see the whole sea. It is a very large thing, and a kind one."]],
  ['lp_r2','A hermit','kh_ohfolk2_3',["You are the first person this month. Sit. I will say nothing, and you will say nothing, and it will be a fine conversation.","I came here to think. I have thought. I am now thinking about tea.","The path was made so that nobody would have to talk. I think it was a good idea."]],
  ['lp_r3','A charcoal-burner','kh_ohfolk4_3',["The wood is slow. So am I. We get on.","Smoke goes up, and the sky takes it. Nothing here is ever wasted.","A fire is company. You can sit by it for an hour and not say a word."]],
  ['lp_r4','A gardener','kh_ohfolk7_0',["The flowers by the road are mine. I do not mind who picks them, as long as they stand still a moment first.","Every flower is a small decision to be beautiful. Most of them make it.","I plant the same seeds every spring and am surprised each time."]],
  ['lp_r5','A beekeeper','kh_ohfolk3_3',["The bees do not hurry. If you hurry, they notice.","There is no better sound than a hive in the sun. I have tried many.","The honey is for the knights, mostly. They ride by in the afternoon and take a jar and say nothing."]],
  ['lp_r6','The last householder','kh_ohfolk3_3',["Past here the road climbs, and it does not come back down to this side. It is a cliff, and then Yarrim.","I have never gone over. I like to know that the road ends somewhere good.","Go gently. The mountain is very high, and it is very quiet."]]
];
LP_RES.forEach(([id,n,face,lines])=>khNpc(id,n,face,()=>yrLines(id,lines)));
const LP_INNS=[['lp_inn0','Maren, innkeeper of the Last Lamp','kh_ohfolk2_5','The Last Lamp',15,'The Last Lamp. The last lamp on the coast road, and the first you see after the long dark stretch. A room is 15 gold, and there is a fire that never goes out.'],
 ['lp_inn1','Osk, innkeeper of the Cold Spring','kh_oqmen_4','The Cold Spring Inn',15,'The Cold Spring Inn. A spring runs through the cellar, the water is the best on the mountain, and the beds are warm. Fifteen gold.'],
 ['lp_inn2','Hanne, innkeeper of the Wayfarer’s Rest','kh_ohfolk3_4','The Wayfarer’s Rest',15,'The Wayfarer’s Rest. For those who have walked a long way and have a little further to go. Fifteen gold a room, and the soup is free.']];
LP_INNS.forEach(([id,n,face,title,cost,line],i)=>{khInn(id,n,face,title,cost,line);for(const p of ['p1','p2'])khNpc('lp'+(i+3)+'_'+p,p==='p1'?'A walker':'A traveller',p==='p1'?'kh_ohfolk6_3':'kh_ohfolk5_5',()=>yrLines('lp_inn'+p,['The path is quiet.','I have been walking since the morning and I have not met a soul, and it was wonderful.','Tomorrow I walk on. Tonight I sit.']))});
const LP_PRIESTS=[['lp_pr0','Father Elric, of the Long Road','kh_ohfolk2_1','The Church of the Long Road. Stay as long as you like. The bells ring at dawn and dusk, and the rest of the day the church belongs to whoever is quiet in it.'],
 ['lp_pr1','Sister Wynn, of the Quiet','kh_ohfolk5_2','The Chapel of the Quiet. Nobody speaks here, not even the bell. Light a lamp if you like.'],
 ['lp_pr2','Brother Alder, of the sea church','kh_ohfolk1_4','Saint Aldric watched the sea for sixty years, and nothing happened, and he said it was the best sixty years of his life.']];
LP_PRIESTS.forEach(([id,n,face,line])=>khPray(id,n,face,line,15));
khNpc('lp_knight','A knight of the Crown','kh_ohsold1_2',()=>yrLines('lp_knight',["The Crown rides the Land Path twice a day. Nothing ever happens. It is the best post in the kingdom.","I ride from the city gate to the mountains and back. The mountains are far. The horse knows the way.","Do not mind us. We are only here so that you can walk in peace."]));
khNpc('lp_cliff','The edge of the Land Path','gate',()=>say('The path ends here, at the edge of a high cliff. Far below, beyond the last slope of the mountain, lie the roofs and the harbour of Yarrim, and the sea. A steep goat track leads down. It can be climbed down, but it cannot be climbed up again.',[['Go down the goat track.',()=>{G.flags.lpDone=1;msg('The goat track is steep. The land path falls behind and above.','#a8d8ff');goToLevel(290,{x:LPY.x,y:LPY.y,f:LPY.f});return null}],['Stay a while.',()=>null]]));
const LPY={x:56,y:8,f:2}; // where the goat track comes out, north of Yarrim
const LPM={SEG:11,Y:300}; // the gate of the monastery, cut into the rock beside the path, halfway along
let LP_XC={};
function lpXcOf(s){ // the middle of the path, row by row: dead straight, with three slow bends in the part of a stretch that no other stretch shares
  if(LP_XC[s])return LP_XC[s];
  const leg=LP_LEG(s),mount=leg==='W'||leg==='D',PAD=s===LP.N-1?60:0,H=LP.H+PAD,CX=LP.CX,A=(mount?LP.A-1:LP.A)*.8,sd=s*37+11,HH=LP.H,xc=[],rnd=i=>hash2(sd,i,77);
  const bends=[[240+rnd(1)*100,(rnd(3)-.5)*2*A],[420+rnd(2)*100,(rnd(4)-.5)*2*A],[560,0]],L=60,sm=t=>t*t*(3-2*t);
  for(let y=0;y<H;y++){const yy=y-PAD;if(yy<0){xc.push(CX);continue}const u=HH-1-yy;let off=0;
    for(const [c,target] of bends){const t=Math.max(0,Math.min(1,(u-(c-L/2))/L));off=off+(target-off)*sm(t)}
    xc.push(Math.round(CX+off))}
  return LP_XC[s]=xc}
const lpWdG=(gy,sg,leg)=>5+2*tsmooth(gy/7,sg+3,LP_LEG_SD[leg]+7)+9*Math.max(0,tsmooth(gy/50,sg+21,LP_LEG_SD[leg]+9)-.5)*2.2; // the pass is a narrow gorge in places and opens out into green valleys in others, by distance along the whole path so that neighbouring stretches agree
const lpWd=(s,y,sg)=>lpWdG(s*(LP.H-LPOV)+(LP.H-1-y),sg,LP_LEG(s));
function lpMonDoor(){const xc=lpXcOf(LPM.SEG);return {x:xc[LPM.Y]+Math.floor(lpWd(LPM.SEG,LPM.Y,1))+8,y:LPM.Y,c:xc[LPM.Y]}}
/* ---- pilgrims on the way, people resting by the road, and the shrines ---- */
const LP_PILG=[
 ['lp_pg1','A pilgrim','kh_ohfolk5_3',["I am walking to the monastery on the mountain. It is eleven days from the coast, and I have enjoyed all of them.","Every step is a prayer, if you are paying attention. I am usually not, but the road forgives me.","Do not hurry. The road is exactly as long as it needs to be."]],
 ['lp_pg2','A monk on pilgrimage','kh_ohfolk1_4',["Peace to you. I am going to Saint Elen’s. They keep a quiet there that is hard to find anywhere else.","I have taken a vow not to say more than ten words before noon. That was nine.","Leave a little at the shrines, if you can spare it. Someone left a loaf for me once, and I have not forgotten."]],
 ['lp_pg3','A pilgrim sister','kh_ohfolk5_2',["The road is made of small kindnesses. A shrine, a lamp, a bench. Somebody thought of every one.","I like the evenings best, when the sea goes gold and the lamps are lit.","Walk gently. There is nobody to impress."]],
 ['lp_pg4','A traveller','kh_ohfolk6_3',["I am not a pilgrim. I just like the walk. Nobody asks me anything here.","There is a monastery halfway where they sing at dusk. I always plan to be there at dusk and I am always late.","The knights nod to me as they ride by. I nod back. That is the whole of our friendship."]],
 ['lp_pg5','A grey friar','kh_ohfolk2_1',["Salt on the wind, flowers underfoot, oaks overhead. I could not draw a better road.","I carry nothing but a loaf and a blessing. Both are for whoever needs them.","Take the shrine food only if you are truly hungry, and then leave something back."]],
 ['lp_pg6','A pilgrim with a staff','kh_ohfolk3_3',["I am eighty and this is my third time over the mountain. I will do it again, if I am spared.","The cliff at the end is not a danger. It is a promise that the road finishes.","Sit for a moment. The road will wait. It always does."]]
];
LP_PILG.forEach(([id,n,face,lines])=>khNpc(id,n,face,()=>yrLines(id,lines)));
const LP_REST_NPC=[
 ['lp_rs1','A pilgrim, resting','kh_ohfolk2_3',["I have been sitting here since the morning. I think I may stay for the afternoon.","My feet have prayed for me enough. I am letting them rest.","Go on, take the bench next to me. Nobody minds."]],
 ['lp_rs2','A traveller, resting','kh_ohfolk6_3',["If you sit still, the road comes to you. Someone always walks by with a story.","There was a knight here earlier with a very tired horse. We shared an apple.","I will go on once the light changes."]],
 ['lp_rs3','An old woman, resting','kh_ohfolk3_1',["Sit, child. The sea will not mind you looking at it.","I have walked this road with my husband, and then without him. It is still a good road.","I sit by the lamp because it keeps the dark from being lonely."]],
 ['lp_rs4','A monk, resting','kh_ohfolk1_4',["Resting is a part of the walk, not a pause in it. That is the third thing they teach novices.","The shrine here is a kind one. Take only what you need, and leave a little.","I shall sit a while and say nothing. You are welcome to do the same."]]
];
LP_REST_NPC.forEach(([id,n,face,lines])=>khNpc(id,n,face,()=>yrLines(id,lines)));
const LP_FOODS=['bread','cheese','apple','herring','pie','ale'];
const lpEat=()=>{let n=0;for(const h of G.heroes){if(h.alive===false||h.hp<=0||(h.food>=90&&h.hp>=h.max))continue;const f=LP_FOODS.find(x=>ITEMDEF[x]&&ITEMDEF[x].k==='food'&&bagCount(x)>0);if(!f)break;
    bagTake(G.bag.findIndex(b=>b.id===f));const d=ITEMDEF[f];h.hp=Math.min(h.max,h.hp+(d.heal||0));h.food=Math.min(100,(h.food||0)+(d.feed||0));n++}
  msg(n?'The party eats what was left at the shrine, standing in the road.':'Nobody is hungry or hurt.','#a8d8a0');sfx('step');return null};
khNpc('lp_shrine','A roadside shrine','memorial',d=>{
  const F=G.flags,T=F.lpSh||(F.lpSh={}),k=LEVEL+'_'+d.y,opts=[];
  const have=LP_FOODS.find(f=>bagCount(f)>0);
  if(have)opts.push(['Leave something to eat.',()=>{const j=G.bag.findIndex(b=>b.id===have);if(j>=0)bagTake(j);T[k]=0;try{honourAdd(2,'an offering at a shrine')}catch(e){}msg('You leave it on the stone beside the others.','#c8e8b0');return say('The stone is warm, and the flowers are fresh. A small quiet settles over the road.',[BYE])}]);
  if(!T[k])opts.push(['Take.',()=>{T[k]=1;for(let i=0;i<3;i++)bagAdd({id:LP_FOODS[(Math.random()*LP_FOODS.length)|0],n:1});try{honourAdd(-10,'taking from a shrine')}catch(e){}msg('You take what pilgrims left. It does not feel like yours.','#e0a080');return say('You take the loaf and the fruit that other people left for travellers who needed them more. Somewhere behind you, a pilgrim stops walking and says nothing.',[['Eat some now.',lpEat],['Keep it for later.',()=>null]])}]);
  return say(T[k]?'The stone is bare. The flowers are fresh, but there is no food left. Pilgrims will come and leave more, in time.':'A small shrine of grey stone beside the road. Bread, apples, a wedge of cheese and a bunch of flowers have been left here by people who passed before you, for anyone who might need them. Take what you need, and it will be on your conscience. A little candle burns, though nobody is near.',[...opts,['Leave it be.',()=>null]]);
});

/* ---- pictures: an invisible stone to walk into at the ends of each stretch, and the horse ---- */
const LP_KM=96,LP_ROWS_KM=(LP.N*(LP.H-LPOV)+LPOV)/LP_KM; // the whole path is 96 kilometres, a sign at every one
function lpArt(){if(!IMG.lp_gap){const c=document.createElement('canvas');c.width=c.height=8;IMG.lp_gap=c;NPC_H.lp_gap=.1}}
function lpPeak(k,seed){ // a range of far mountains, with snow on the highest, fading into haze at its foot
  if(IMG[k])return k;const w=640,h=260,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),pts=[];
  const N=22;for(let i=0;i<=N;i++){const px=i*w/N,hh=(.28+.6*Math.pow(hash2(i,seed,3),1.3))*(1-.25*Math.abs(Math.sin(i*.7+seed)));pts.push([px,h-hh*h*.95])}
  x.beginPath();x.moveTo(0,h);x.lineTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;x.quadraticCurveTo(pts[i][0],pts[i][1],mx,my)}x.lineTo(w,pts[pts.length-1][1]);x.lineTo(w,h);x.closePath();
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#8196ab');g.addColorStop(.6,'#a3b6c6');g.addColorStop(1,'#c3d3df');x.fillStyle=g;x.fill();
  x.save();x.clip();
  for(let i=1;i<pts.length-1;i++){const p=pts[i];if(p[1]<h*.5&&p[1]<=pts[i-1][1]&&p[1]<=pts[i+1][1]){x.fillStyle='rgba(248,250,254,.92)';x.beginPath();x.moveTo(p[0],p[1]-1);x.quadraticCurveTo(p[0]-18,p[1]+22,p[0]-46,p[1]+50);x.lineTo(p[0]-20,p[1]+38);x.lineTo(p[0]-6,p[1]+62);x.lineTo(p[0]+12,p[1]+40);x.lineTo(p[0]+30,p[1]+58);x.quadraticCurveTo(p[0]+16,p[1]+22,p[0],p[1]-1);x.closePath();x.fill()}
    x.strokeStyle='rgba(70,88,108,.14)';x.lineWidth=4;x.beginPath();x.moveTo(p[0],p[1]+6);x.lineTo(p[0]+24,h);x.stroke()}
  const hz=x.createLinearGradient(0,h*.35,0,h);hz.addColorStop(0,'rgba(208,224,238,0)');hz.addColorStop(1,'rgba(208,224,238,.9)');x.fillStyle=hz;x.fillRect(0,0,w,h);x.restore();
  x.globalCompositeOperation='destination-in';const ed=x.createLinearGradient(0,0,w,0);ed.addColorStop(0,'rgba(0,0,0,0)');ed.addColorStop(.18,'rgba(0,0,0,1)');ed.addColorStop(.82,'rgba(0,0,0,1)');ed.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=ed;x.fillRect(0,0,w,h); // the two ends fade out, so the picture has no hard vertical edge
  IMG[k]=c;return k}
const LP_FALLS=[9,12,14],LP_BRIDGE={}; // the stretches with a waterfall and a rope bridge
function lpFallsKey(){ // a waterfall: a ribbon of white water falling down a dark rock face, with spray at the foot
  const k='lp_falls';if(IMG[k])return k;const w=256,h=768,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const rg=x.createLinearGradient(0,0,0,h);rg.addColorStop(0,'#3d4a46');rg.addColorStop(1,'#2a3330');x.fillStyle=rg;
  x.beginPath();x.moveTo(18,0);for(let y=0;y<=h;y+=24)x.lineTo(14+hash2(y,1,3)*18,y);x.lineTo(40,h);x.lineTo(w-40,h);for(let y=h;y>=0;y-=24)x.lineTo(w-14-hash2(y,2,3)*18,y);x.closePath();x.fill();
  for(let i=0;i<40;i++){x.fillStyle='rgba(20,28,26,'+(.12+hash2(i,4,3)*.2)+')';x.fillRect(20+hash2(i,5,3)*(w-60),hash2(i,6,3)*h,6+hash2(i,7,3)*18,10+hash2(i,8,3)*40)}
  const wg=x.createLinearGradient(0,0,0,h);wg.addColorStop(0,'rgba(210,232,244,.82)');wg.addColorStop(.7,'rgba(240,248,252,.95)');wg.addColorStop(1,'rgba(255,255,255,.98)');x.fillStyle=wg;
  x.beginPath();x.moveTo(w/2-26,0);x.lineTo(w/2+26,0);for(let y=0;y<=h-60;y+=30)x.lineTo(w/2+26+y*.05+Math.sin(y*.05)*3,y);x.lineTo(w/2+62,h-30);x.lineTo(w/2-62,h-30);for(let y=h-60;y>=0;y-=30)x.lineTo(w/2-26-y*.05-Math.sin(y*.05)*3,y);x.closePath();x.fill();
  for(let i=0;i<46;i++){const px=w/2-40+hash2(i,9,3)*80,py=hash2(i,10,3)*(h-90);x.strokeStyle='rgba(255,255,255,'+(.25+hash2(i,11,3)*.4)+')';x.lineWidth=1.5+hash2(i,12,3)*2.5;x.beginPath();x.moveTo(px,py);x.lineTo(px+(hash2(i,13,3)-.5)*4,py+30+hash2(i,14,3)*70);x.stroke();}
  for(let i=0;i<26;i++){x.fillStyle='rgba(255,255,255,'+(.08+hash2(i,15,3)*.12)+')';x.beginPath();x.ellipse(w/2+(hash2(i,16,3)-.5)*170,h-30-hash2(i,17,3)*80,26+hash2(i,18,3)*30,12+hash2(i,19,3)*20,0,0,TAU);x.fill()}
  IMG[k]=c;NPC_H[k]=6.2;return k}
function lpRailKey(){ // a post with a rope looped to the next one, for the rope bridge
  const k='lp_rail';if(IMG[k])return k;const w=128,h=128,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  x.fillStyle='#6a5236';x.fillRect(w/2-7,22,14,100);x.fillStyle='#4a3822';x.fillRect(w/2-7,22,4,100);x.fillStyle='#8a6e48';x.fillRect(w/2-9,18,18,8);
  x.strokeStyle='#c8b080';x.lineWidth=4;for(const [y0,y1] of [[38,52],[64,80]]){x.beginPath();x.moveTo(w/2-7,y0);x.quadraticCurveTo(w/4,y1,2,y0-4);x.stroke();x.beginPath();x.moveTo(w/2+7,y0);x.quadraticCurveTo(w*.75,y1,w-2,y0-4);x.stroke()}
  x.strokeStyle='rgba(60,44,24,.5)';x.lineWidth=1.2;for(let i=0;i<20;i++){x.beginPath();x.moveTo(6+i*5,40+hash2(i,1,4)*4);x.lineTo(9+i*5,44+hash2(i,2,4)*4);x.stroke()}
  IMG[k]=c;NPC_H[k]=.8;return k}
let LP_HAZE=0;
function lpHaze(){ // the far edge of the sea: a wall the colour of the horizon, so that it cannot be seen as a wall
  if(LP_HAZE)return LP_HAZE;const wh=.45,c=mkCanvas(128,Math.round(128*wh),(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#bfd4e6');g.addColorStop(.5,'#cddfec');g.addColorStop(1,'#a9c0d0');x.fillStyle=g;x.fillRect(0,0,w,h)});
  const d=c.getContext('2d').getImageData(0,0,128,Math.round(128*wh)).data,id=addTex(d,null);TEX[id].h=Math.round(128*wh);TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return LP_HAZE=gid}
function lpBoard(k,a,b,bigb){ // a wooden signpost with two lines written on its board
  if(IMG[k])return k;const base=IMG.signblank;if(!base)return null;
  const w=base.width,h=base.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(base,0,0);
  x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  const line=(t,y,fs0,col)=>{let fs=fs0;x.font='bold '+fs+'px Georgia,serif';while(x.measureText(t).width>w*.84&&fs>10){fs-=2;x.font='bold '+fs+'px Georgia,serif'}x.lineWidth=Math.max(4,fs*.2);x.strokeStyle='rgba(14,10,4,.95)';x.strokeText(t,w*.5,y);x.fillStyle=col;x.fillText(t,w*.5,y)};
  line(a,h*.17,h*.085,'#efe4bc');line(b,h*.325,h*(bigb?.135:.09),'#ffe9a8');
  IMG[k]=c;NPC_H[k]=.95;return k}
function lpSignKey(km){return lpBoard('lp_sign_'+km,'TO YARRIM',km+' km',true)}
/* ---- the level ---- */
function lpBuild(s){
  const id=LP.BASE+s;if(LEVELS[id])return;
  if(typeof KH_READY!=='undefined'&&!KH_READY)return;
  ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors();lpArt();
  const PAD=s===LP.N-1?60:0,W=LP.W,H=LP.H+PAD,Y0=PAD,N=W*H,CX=LP.CX,leg=LP_LEG(s),mir=leg==='S',MX=x=>mir?W-1-x:x,hs=(a,b,c)=>hash2(a,b,c),sd=s*37+11,gsd=LP_LEG_SD[leg],OV=LPOV,GY=y=>s*(LP.H-OV)+(LP.H-1-(y-Y0)),safeLo=Y0+OV+20,safeHi=H-OV-20;
  const mount=leg==='W'||leg==='D',coast=!mount,open_=y=>coast||(s===LP.N-1&&y<64+Y0);
  const wet=y=>s===LP.N-1&&y<=Y0+5; // the sea beyond the cliff // the last stretch opens out onto a green terrace above the sea
  const OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'],PINES=['ptree0','ptree5','ptree6','ptree0','ptree5','ptree2','ptree7','ltree2'],FLO=['lflora0','lflora0_1','lflora0_2'];
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const sty=(n,o)=>{OH_STY[n]=Object.assign({},OH_STY.castle2||OH_STY.gold,o)};
  sty('lprock1',{zoom:2.6,contrast:2.8,tint:[132,152,134,.0]});sty('lprock2',{zoom:2.2,contrast:2.4,tint:[128,146,150,.0]});sty('lprock3',{zoom:3,contrast:3,tint:[140,152,128,.0]});
  const rockTiles=[];if(mount)for(const st of ['lprock1','lprock2','lprock3'])for(const wh of [3.6,4.6,5.6,6.8])rockTiles.push(ch(TM.make('plain',st,wh).gid));
  const rockAt=(x,y,sg)=>{const hh=Math.min(3,Math.floor(tsmooth(GY(y)/11,sg+11,gsd+21)*4)),st=Math.min(2,Math.floor(tsmooth(GY(y)/37,sg+17,gsd+23)*3.99));return rockTiles[st*4+hh]},wdist=(y,sg)=>lpWdG(GY(y),sg,leg);
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const fm=new Array(N).fill('0'),h=new Float32Array(N).fill(.3),rk=new Float32Array(N),block=new Uint8Array(N);
  const I=(x,y)=>y*W+MX(x),setC=(x,y,c)=>{rows[y][MX(x)]=c;block[I(x,y)]=1};
  const decor=[],scenery=[],sky=[],lights=[],used=new Set(),carve=new Set();
  const K=(x,y)=>MX(x)+','+y;
  /* the winding centre of the path: 0 at both ends, wandering 10 cells either way in between */
  const xc=lpXcOf(s);
  const fe=y=>xc[y]+5+Math.round(1.2*Math.sin(GY(y)*.09));
  /* ---- ground: sea and shore on one side, forest on the other; or mountains on both ---- */
  for(let y=0;y<H;y++){const c=xc[y];
    for(let x=0;x<W;x++){const i=I(x,y),d=Math.abs(x-c);
      if(open_(y)){
        const wl=c-6+Math.round(2.2*Math.sin(GY(y)*.11)),ws=wl-3;
        if(s===LP.N-1&&y<=Y0+5){fm[i]='4';h[i]=-.2;block[i]=1}
        else if(x<ws){fm[i]='4';h[i]=-.2+.03*(tsmooth(x/6,GY(y)/6,77)-.5);block[i]=1}
        else if(x<wl){fm[i]='3';h[i]=.12}
        else if(d<=1){fm[i]='1';h[i]=.3}
        else if(x>=fe(y)){fm[i]='0';h[i]=.3+.06*tsmooth(x/5,GY(y)/5,gsd)}
        else{fm[i]='0';h[i]=.3+.05*(tsmooth(x/5,GY(y)/5,gsd+3)-.5)}
      }else{
        // the mountains: a pass between tall grey cliffs, with heather, rock and pines in it
        const sg=x<c?-1:1,wd=wdist(y,sg);
        fm[i]=d<=1?'1':d>wd-3?'6':wd>11?'0':'5';h[i]=.3;
        if(d>wd+7){setC(x,y,'T');} // the far slope: a wall of dark forest, not rock
      }
    }
  }
  {const hz=ch(lpHaze());for(let y=0;y<H;y++){setC(0,y,hz);setC(W-1,y,hz)}for(let x=0;x<W;x++){setC(x,0,hz);setC(x,H-1,hz)}} // every edge of the map is a low wall the colour of the horizon, so that none of them ever shows as a great wall
  if(s===LPM.SEG){ // the gate of Saint Elen's Monastery, cut into the rock of the pass: a lane through the cliff and an arched door at the end of it
    const md=lpMonDoor(),Y=md.y,c0=md.c;
    for(let x=c0+2;x<md.x;x++)for(let y=Y-1;y<=Y+1;y++){rows[y][MX(x)]='.';block[I(x,y)]=0;fm[I(x,y)]='1'}
    const dt=TM.make('door','castle',3.8),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:MON.ID,at:{x:MON.GATE_IN[0],y:MON.GATE_IN[1],f:0}};
    for(let y=Y-1;y<=Y+1;y++)setC(md.x,y,y===Y?ch(dgid):rockTiles[5]);
  }
  if(mount){
    // tarns in the wide valleys, and a stream beside the path in some stretches
    for(let q=0;q<4;q++){const y=safeLo+((hs(sd,q,31)*(safeHi-safeLo))|0);if(wet(y))continue;for(const sg of [-1,1]){if(hs(GY(y),sg,gsd+32)<.5)continue;const wd=wdist(y,sg);if(wd<12)continue;const cx0=xc[y]+sg*Math.round(wd*.6),r=Math.min(6,Math.floor((wd-5)*.45));
      for(let yy=y-r*2;yy<=y+r*2;yy++)for(let xx=cx0-r;xx<=cx0+r;xx++){if(yy<2||yy>=H-2||xx<1||xx>=W-1||Math.abs(xx-xc[yy])<4)continue;if(((xx-cx0)/r)**2+((yy-y)/(r*2))**2<=1&&rows[yy][MX(xx)]==='.'){fm[I(xx,yy)]='4';h[I(xx,yy)]=-.2;block[I(xx,yy)]=1}}}}
    if(s%3===1){const sgn=s%2?1:-1;for(let y=safeLo;y<safeHi;y++){if(wet(y))continue;const x=xc[y]+sgn*3+Math.round(1.5*Math.sin(y*.15));if(rows[y][MX(x)]==='.'&&!block[I(x,y)]){fm[I(x,y)]='4';h[I(x,y)]=.05}}}
    // a waterfall at the foot of the slope, a stream running from its pool across the path, and a rope bridge over the stream
    if(LP_FALLS.includes(s)){let by=0,bw=0;for(let y=safeLo+10;y<safeHi-10;y+=2){if(s===LPM.SEG&&Math.abs(y-LPM.Y)<34)continue;const w=wdist(y,1)+wdist(y,-1);if(w>bw){bw=w;by=y}}
      const sg=wdist(by,1)>=wdist(by,-1)?1:-1,c=xc[by],xr=c+Math.floor(wdist(by,1))+2,xl=c-Math.floor(wdist(by,-1))-2,fx=sg>0?xr+1:xl-1,pk=sg>0?xr:xl;
      for(let x=xl;x<=xr;x++)for(let y=by-1;y<=by+2;y++)carve.add(K(x,y));
      for(let x=xl;x<=xr;x++)for(let y=by;y<=by+1;y++){if(rows[y][MX(x)]!=='.')continue;const i=I(x,y),deck=Math.abs(x-c)<=1;fm[i]=deck?'7':'4';h[i]=deck?.3:-.12;block[i]=deck?0:1}
      for(let y=by-2;y<=by+3;y++)for(let x=pk-2;x<=pk+2;x++)if(x>0&&x<W-1&&y>0&&Math.hypot(x-pk,y-by-.5)<=2.6&&rows[y][MX(x)]==='.'){fm[I(x,y)]='4';h[I(x,y)]=-.2;block[I(x,y)]=1;carve.add(K(x,y))}
      const fk=lpFallsKey(),rk=lpRailKey();
      if(fk)decor.push({k:fk,x:MX(fx),y:by,block:true,deco:true,sc:1,kname:'falls'});
      if(rk)for(const dx of [-2,2])for(const dy of [0,1])decor.push({k:rk,x:MX(c+dx),y:by+dy,block:true,deco:true,sc:1});
      used.add(K(fx,by));LP_BRIDGE[s]={y:by,x:c}}
    // far peaks with snow on them, standing behind the cliffs, placed by distance along the whole path
    for(let y=2;y<H-2;y++){const g=GY(y);if(g%75!==37)continue;const q=Math.floor(g/75);for(const sg of [-1,1]){const pk=lpPeak('lp_peak'+((q+(sg>0?1:0))%6),(q+(sg>0?1:0))%6);if(pk)sky.push({x:xc[y]+sg*(52+((hs(g,sg,gsd+41)*26)|0)),y,k:pk,w:96,z:3,big:1})}}
  }
  /* ---- the places cut out of the trees: clearings, building yards, the hidden nook ---- */
  const circle=(cx,cy,r)=>{for(let y=Math.max(1,cy-r);y<=Math.min(H-2,cy+r);y++)for(let x=cx-r;x<=cx+r;x++)if(x>0&&x<W-1&&Math.hypot(x-cx,y-cy)<=r+hs(x,y,5)*.8)carve.add(K(x,y))};
  const lane=(x0,x1,y,hw)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let yy=y-(hw||0);yy<=y+(hw||0);yy++)carve.add(K(x,yy))};
  const clearings=[];
  for(let y=2;y<H-2;y++){const g=GY(y),b=Math.floor(g/92);if(g!==b*92+46+((hs(b,7,gsd)*20)|0))continue;clearings.push({y,side:b%2?-1:1,safe:y>=safeLo&&y<safeHi})}
  const blds=[];LP_BUILD.forEach((b,i)=>{if(b[0]===s)blds.push({i,kind:b[1],y:Math.max(safeLo+12,Math.min(safeHi-12,Math.round(b[2]*LPK))),name:b[3],keeper:b[4]})});
  const taken=y=>blds.some(b=>Math.abs(b.y-y)<22)||(LP_TELE.includes(s)&&Math.abs(teleY-y)<14);
  const teleY=safeLo+30+((hs(sd,9,9)*(safeHi-safeLo-60))|0);
  for(const c of clearings){if(c.safe&&taken(c.y)){c.skip=true;continue}
    if(c.side>0){const cx=xc[c.y]+16;circle(cx,c.y,6);lane(fe(c.y)-1,cx,c.y,1);c.cx=cx}}
  /* ---- buildings ---- */
  const styles=['cottage','timber','golden','cream'];
  for(const b of blds){
    const c=xc[b.y],kind=b.kind,wB=kind==='house'?3:kind==='inn'?5:5,dB=kind==='house'?3:kind==='inn'?4:5,x0=c+13,y0=b.y-((dB-1)>>1),x1=x0+wB-1,y1=y0+dB-1,ym=y0+(dB>>1);
    const wh=kind==='house'?2.2:kind==='inn'?2.7:3.4,ST=kind==='church'?'castle':styles[b.i%4];
    const plain=ch(TM.make('plain',ST,wh).gid),win=ch(TM.make('window',ST,wh).gid),dtile=TM.make('door',ST,wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    const rid=LP_ROOM(b.i),front=[x0-1,ym];
    KH_DOOR[dgid]={lvl:rid,at:kind==='inn'?{x:6,y:7,f:0}:kind==='church'?{x:4,y:6,f:0}:{x:4,y:4,f:0}};
    circle(x0+((wB-1)>>1),b.y,kind==='church'?10:7);lane(fe(b.y)-1,x0-1,ym,1);
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const door=x===x0&&y===ym;setC(x,y,door?ch(dgid):((x+y)%2===0&&x!==x1&&y!==y0)?win:plain);fm[I(x,y)]='2'}
    const cxm=W-(x0+x1+1)/2,cx0=mir?cxm:(x0+x1+1)/2;sky.push({x:cx0,y:(y0+y1+1)/2,k:'kh_ohroof1_'+(b.i%5),w:dB+.7,z:wh-.03});
    if(kind==='church'){sky.push({x:mir?W-(x1+1.5):x1+1.5,y:y0+1,k:'kh_ohtower1_'+(2+(b.i%2)),w:3.4,z:wh-.03});
      // the churchyard behind the church: graves in rows, an iron fence, a few crosses
      for(let gy=y0-1;gy<=y1+1;gy+=2)for(let gx=x1+4;gx<=x1+10;gx+=2){if(hs(gx,gy,sd+8)<.82){const k=hs(gx,gy,sd+9)<.25?'cross':hs(gx,gy,sd+9)<.6?'grave':'grave2';decor.push({k,x:MX(gx),y:gy,block:true,deco:true,sc:1});used.add(K(gx,gy))}}
      for(let gx=x1+3;gx<=x1+11;gx++){if(hs(gx,1,sd+10)<.95){for(const gy of [y0-2,y1+2]){decor.push({k:'ironfence',x:MX(gx),y:gy,block:true,deco:true});used.add(K(gx,gy))}}}
      for(let gy=y0-1;gy<=y1+1;gy++)for(const gx of [x1+3,x1+11]){decor.push({k:'ironfence',x:MX(gx),y:gy,block:true,deco:true});used.add(K(gx,gy))}
    }
    for(let y=y0-1;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++)used.add(K(x,y));
    LEVEL_NAMES[rid]=b.name;
    KH_LAZY[rid]=()=>{if(LEVELS[rid])return;const room=kind==='inn'?'inn':kind==='church'?'prayer':'home',bb={id:'lp'+b.i,name:b.name,room,keeper:b.keeper,scene:kind==='house'?['warm','fisher','scholar','healer','potter','warm','soldier'][b.i%7]:undefined,wallImg:'kh_ohwall1_'+(b.i%3),floor:'wood'};
      const R=khRoom(bb,rid,{to:id,x:MX(front[0]),y:front[1],f:mir?1:3});LEVELS[rid]=R.level};
    // the trail from the door to the path, flowers by the door and a lamp
    decor.push({k:'lamp',x:MX(x0-2),y:y0-1,block:false,walk:true,deco:true});lights.push([MX(x0-2),y0-1]);used.add(K(x0-2,y0-1));
  }
  /* ---- the hidden nook with a teleporter ---- */
  let tele=null;
  if(LP_TELE.includes(s)){
    const c=xc[teleY],ex=c+20;lane(fe(teleY)-1,ex+1,teleY,0);circle(ex,teleY,2);tele={x:MX(ex),y:teleY};
    for(let x=fe(teleY);x<=ex;x++)if(hs(x,teleY,sd+20)<.5&&x%2===0)scenery.push({k:FLO[x%3],wx:MX(x)+.5,wy:teleY+.5,sc:.5,decor:{k:FLO[x%3],walk:true,x:MX(x),y:teleY}});
  }
  /* ---- the forest: a thick wall of oaks (three deep, then a few more), the sea side with a few rocks and a distant ship ---- */
  const ring1=new Set(),ring2=new Set();
  for(const ck of carve){const [cx,cy]=ck.split(',').map(Number);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const k2=(cx+dx)+','+(cy+dy);if(carve.has(k2))continue;(Math.max(Math.abs(dx),Math.abs(dy))<=1?ring1:ring2).add(k2)}}
  for(let y=1;y<H-1;y++){
    if(!open_(y))continue;const f=fe(y);
    for(let x=f;x<W-1;x++){
      const dd=x-f,ck=K(x,y);if(carve.has(ck)||used.has(ck))continue;
      const near1=ring1.has(ck),near2=ring2.has(ck);
      const dens=near1?1:near2?.85:dd<2?1:dd<3?.82:dd<4?.6:dd<7?.3:.22;
      if(hs(x,GY(y),gsd+12)<dens){const o=hs(x,GY(y),gsd+13),a=hs(x,GY(y),gsd+14)-.5,b=hs(x,GY(y),gsd+15)-.5;
        decor.push({k:OAKS[(o*5)|0],x:MX(x),y,block:near1||near2||dd<4,ox:a*.5*(mir?-1:1),oy:b*.5,sc:.8+hs(x,GY(y),gsd+16)*.45})}
    }
  }
  if(mount){ // the pass: wooded slopes of pines on both sides, boulders in the meadows between, and rock only far back where nobody can see it
    for(let y=1;y<H-1;y++){if(open_(y))continue;const c=xc[y];for(const sg of [-1,1]){const wd=Math.floor(wdist(y,sg));
      for(let dx=3;dx<wd+7;dx++){const x=c+sg*dx;if(x<1||x>=W-1||used.has(K(x,y))||carve.has(K(x,y)))continue;
        const slope=dx>=wd,r=hs(x,GY(y),gsd+30),p=slope?(dx<wd+3?1:dx<wd+5?.8:.5):(dx>=wd-3?.2:.04);
        if(r<p){const o=hs(x,GY(y),gsd+31);used.add(K(x,y));const kk=!slope&&o<.22?'boulder':!slope&&o<.34?'rocks':PINES[(hs(x,GY(y),gsd+35)*PINES.length)|0];
          decor.push({k:kk,x:MX(x),y,block:slope&&dx<wd+5||(!slope&&(kk==='boulder'||kk==='rocks')),ox:(hs(x,GY(y),gsd+32)-.5)*.5,oy:(hs(x,GY(y),gsd+33)-.5)*.5,sc:slope?1.0+hs(x,GY(y),gsd+34)*.7:.8+hs(x,GY(y),gsd+34)*.6})}}}}
  }
  /* ---- flowers along the path, lamps, benches, rocks on the shore, clearings with huge oaks ---- */
  const flower=(x,y,sc)=>{if(x<1||x>=W-1||used.has(K(x,y)))return;const k=FLO[(hs(x,GY(y),gsd+40)*3)|0];scenery.push({k,wx:MX(x)+.5,wy:y+.5,sc:sc||.55,decor:{k,walk:true,x:MX(x),y}})};
  for(let y=2;y<H-2;y++){if(wet(y))continue;const c=xc[y];
    for(const sg of [-1,1]){
      if(hs(GY(y),sg+2,gsd+41)<.65)flower(c+sg*2+((hs(GY(y),sg,gsd+42)*2)|0)*sg,y,.5+hs(GY(y),sg,gsd+43)*.25);
      if(hs(GY(y),sg+5,gsd+44)<.45)flower(c+sg*(4+((hs(GY(y),sg,gsd+45)*3)|0)),y,.5+hs(GY(y),sg,gsd+46)*.3);
    }
    if(hs(GY(y),7,gsd+47)<.22)flower(c+((hs(GY(y),8,gsd+48)*12-6)|0),y,.55);
    if(open_(y)&&hs(GY(y),9,gsd+49)<.04){const x=c-6-3+Math.round(2.2*Math.sin(GY(y)*.11))+1;if(!used.has(K(x,y))&&x>1){used.add(K(x,y));decor.push({k:'rocks',x:MX(x),y,block:true,deco:true,sc:.7+hs(GY(y),10,gsd)*.4})}}
  }
  const lamp=(x,y)=>{if(used.has(K(x,y))||x<1||x>=W-1)return;used.add(K(x,y));decor.push({k:'lamp',x:MX(x),y,block:false,walk:true,deco:true});lights.push([MX(x),y])};
  const BENCH=IMG.kh_ohgard1_3?'kh_ohgard1_3':null;
  for(let y=3;y<H-3;y++){if(wet(y))continue;const g=GY(y),c=xc[y];
    if(g%62===31)lamp(c+(Math.floor(g/62)%2?-3:3),y);
    if(g%88===44&&BENCH&&!used.has(K(c-3,y))){used.add(K(c-3,y));decor.push({npc:'lp_bench',k:BENCH,x:MX(c-3),y,block:false,walk:true,deco:true});
      const rk=LP_REST_NPC[(hs(g,3,gsd+90)*LP_REST_NPC.length)|0],rkp=KH_KEEPERS[rk[0]];if(rkp&&hs(g,4,gsd+91)<.7&&!used.has(K(c-3,y+1))){used.add(K(c-3,y+1));decor.push({k:khFaceKey(rkp.face),x:MX(c-3),y:y+1,block:false,walk:true,npc:rk[0],sc:rkp.sc||1})}}
    if(open_(y)&&coast&&g%131===65&&BENCH){const wl=c-6+Math.round(2.2*Math.sin(g*.11)),bx=wl+1;if(!used.has(K(bx,y))&&bx>=3){used.add(K(bx,y));decor.push({npc:'lp_bench',k:BENCH,x:MX(bx),y,block:false,walk:true,deco:true});
      const rk3=LP_REST_NPC[(hs(g,5,gsd+92)*LP_REST_NPC.length)|0],kp3=KH_KEEPERS[rk3[0]];if(kp3&&hs(g,6,gsd+93)<.5&&!used.has(K(bx,y+1))){used.add(K(bx,y+1));decor.push({k:khFaceKey(kp3.face),x:MX(bx),y:y+1,block:false,walk:true,npc:rk3[0],sc:kp3.sc||1})}}}
    if(open_(y)&&coast&&g%47===23&&hs(g,7,gsd+80)>=.3){const wl=c-6+Math.round(2.2*Math.sin(g*.11)),bx=wl-8-((hs(g,8,gsd+81)*14)|0),bk=['yar_boat_fish','yar_boat_row','yar_boat_dhow'][(hs(g,9,gsd+82)*3)|0];if(bx>=4&&IMG[bk]){used.add(K(bx,y));decor.push({k:bk,x:MX(bx),y,block:true,deco:true,sc:.9})}}
    if(g%104===52){const q=Math.floor(g/104),sg=q%2?-1:1,x=c+sg*4;if(!used.has(K(x,y))&&!used.has(K(x,y+1))){used.add(K(x,y));used.add(K(x+sg,y+1));used.add(K(x,y+1));
      decor.push({k:'memorial',x:MX(x),y,block:true,npc:'lp_shrine',sc:.9},{k:'flowerpot',x:MX(x+sg),y:y+1,block:false,walk:true,deco:true,sc:.8},{k:IMG.breadbasket?'breadbasket':'flowerpot',x:MX(x),y:y+1,block:false,walk:true,deco:true,sc:.8})}}
    for(let m=1;m<LP_KM;m++){if(Math.round(m*LP_ROWS_KM)!==g)continue;const sk=lpSignKey(LP_KM-m);if(!sk)continue;const sx=c+(m%2?3:-3);if(used.has(K(sx,y)))continue;used.add(K(sx,y));decor.push({k:sk,x:MX(sx),y,block:false,walk:true,deco:true})} // a signpost at every kilometre: To Yarrim, and how far
  }
  if(s===LPM.SEG){const md=lpMonDoor(),sk=lpBoard('lp_sign_mon','SAINT ELEN’S','monastery 300 m');if(sk){used.add(K(md.c+3,md.y+3));decor.push({k:sk,x:MX(md.c+3),y:md.y+3,block:false,walk:true,deco:true})}lamp(md.x-2,md.y-2);lamp(md.x-2,md.y+2)}
  // (the tall moored ships of the quay are left out here: from far off they only show as grey slabs against the sea)
  for(const cl of clearings){ // the green spaces, with huge oaks
    if(cl.skip)continue;const cy=cl.y,GYc=GY(cy);
    const oaks=cl.side>0?[[cl.cx-2,cy-1],[cl.cx+2,cy+1],[cl.cx,cy-3]]:[[xc[cy]-6,cy-1],[xc[cy]-9,cy+2]];
    oaks.forEach(([x,y],j)=>{if(x<1||used.has(K(x,y)))return;used.add(K(x,y));decor.push({k:OAKS[(j+(GYc%5))%5],x:MX(x),y,block:true,sc:mount?1.3:1.7,ox:0,oy:0})});
    for(let q=0;q<26;q++){const x=(cl.cx||xc[cy]-7)+Math.round((hs(q,GYc,gsd+60)-.5)*9),y=cy+Math.round((hs(q,GYc,gsd+61)-.5)*9);const sc=scenery.length;flower(x,y,.6);void sc}
    const bx=(cl.cx||xc[cy]-7)+3,by=cy+2;if(BENCH&&!used.has(K(bx,by))){used.add(K(bx,by));decor.push({npc:'lp_bench',k:BENCH,x:MX(bx),y:by,block:false,walk:true,deco:true})}
  }
  /* ---- the knights who ride along, and the ends of the stretch ---- */
  const walkers=[],kp=KH_KEEPERS.lp_knight;
  if(kp&&s%2===(leg==='W'?0:1)){const y0=safeLo+20+((hs(sd,70,70)*(safeHi-safeLo-200))|0),y1=Math.min(safeHi-10,y0+110);
    for(const j of [0,1]){const kd={k:khFaceKey(kp.face),x:MX(xc[y0]+2),y:y0,block:false,walk:true,npc:'lp_knight',sc:kp.sc||1,lw:walkers.length,lr:'k'},hd={k:IMG.oh_horse?'oh_horse':'ltree0',x:MX(xc[y0]+3),y:y0,block:false,walk:true,deco:true,sc:1,lw:walkers.length,lr:'h'};
      decor.push(kd,hd);walkers.push({kd,hd,y0,y1,t:j*45,dir:j?1:-1,off:j?2:-2})}}
  // pilgrims and travellers on the way, walking slowly up and down their stretch
  for(let q=0;q<2;q++){const pg=LP_PILG[(hs(s,q,sd+95)*LP_PILG.length)|0],y0=safeLo+10+((hs(s,q+7,sd+96)*(safeHi-safeLo-170))|0),y1=Math.min(safeHi-5,y0+90+((hs(q,s,sd+97)*60)|0));
    if(wet(y0))continue;const kp2=KH_KEEPERS[pg[0]];if(!kp2)continue;const off=q?-2:2,wi=walkers.length,kd2={k:khFaceKey(kp2.face),x:MX(xc[y0]+off),y:y0,block:false,walk:true,npc:pg[0],sc:kp2.sc||1,lw:wi,lr:'k'};
    decor.push(kd2);walkers.push({y0,y1,t:hs(q,s,sd+98)*(y1-y0),dir:q?1:-1,off,sp:.4+hs(q,s,sd+99)*.2})}
  const enter=(x,y,to,tx,ty,f)=>{for(let dx=-4;dx<=4;dx++)decor.push({k:'lp_gap',x:x+dx,y,block:true,enter:{to,x:tx,y:ty,f}})};
  if(s===LP.N-1)decor.push({k:'lp_gap',x:MX(CX),y:Y0+7,block:true,npc:'lp_cliff'});
  if(s===0)enter(MX(CX),H-2,OH.ID,100,7,2);
  function lpId(q){return LP.BASE+q}
  for(let y=H-4;y<H-1;y++)for(let x=CX-6;x<=CX+6;x++)used.add(K(x,y));
  const lv={rows:rows.map(r=>r.join('')),start:{x:MX(CX),y:H-5,f:0},enemies:[],items:[],decor,scenery,sky,fmap:null,floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss','isleSandDk','wood'],floor:'ohMeadow',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:LEVEL_NAMES[id],label:'The Land Path',noExtras:true,diff:25,ceilH:5.2,chars,lights,portals:[],_walk:walkers};
  if(tele)lv.tele=tele;else lv.noTele=true;
  lv.mapNames=[{t:s===0?'The Land Gate':'The Land Path',x:MX(CX),y:H-10,k:'lane'}];
  const fmap=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=fm[y*W+x];fmap.push(r)}lv.fmap=fmap;
  LEVELS[id]=lv;TERRS[id]=yarTerrain(W,H,h,rk,block);
}
// each stretch is built the first time it is reached
for(let s=0;s<LP.N;s++)KH_LAZY[LP.BASE+s]=()=>lpBuild(s);
/* the knights walk the path, up and down their stretch, at the pace of a horse that is in no hurry */
{const _t=seaTick;seaTick=function(dt){_t(dt);
  if(LEVEL<LP.BASE||LEVEL>=LP.BASE+LP.N)return;const L=LEVELS[LEVEL];if(!L||!L._walk)return;
  L._walk.forEach(w=>{w.t+=dt*(w.sp||.7)*w.dir;const len=w.y1-w.y0;if(w.t>=len){w.t=len;w.dir=-1}if(w.t<=0){w.t=0;w.dir=1}
    const y=w.y0+w.t,yi=Math.round(y);w.yy=y;w.yi=yi;w.cc=Math.round(CXOF(L,yi))});
  for(const d of G.decor){if(d.lw===undefined)continue;const w=L._walk[d.lw];if(!w)continue;
    const off=d.lr==='k'?w.off:w.off+(w.off>0?1:-1);d.y=w.yi;d.oy=w.yy-w.yi;d.x=w.cc+off}}}
function CXOF(L,y){ // the middle of the path on row y, read back from the map
  const r=L.rows[y]||'';const m=L._mir;void m;let a=-1,b=-1;for(let x=0;x<r.length;x++){const f=L.fmap[y][x];if(f==='1'){if(a<0)a=x;b=x}}return a<0?LP.CX:(a+b)/2}

/* ---- the cliff, Yarrim at the foot of it, and the journal ---- */
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);const F=G.flags;
  if(n>=LP.BASE&&n<LP.BASE+LP.N&&!F.lpSeen){F.lpSeen=1}
  if(n===290&&F.lpDone&&!G.decor.some(d=>d.k==='lp_sign_up')){const k=lpBoard('lp_sign_up','THE LAND PATH','one way only');if(k)G.decor.push({k,x:LPY.x-2,y:LPY.y-1,block:false,walk:true,deco:true})}}}

/* ---- the air: wind off the sea at times, birdsong, birds flying by, bees at the flowers ---- */
for(let q=0;q<LP.N;q++)WIND_AMT[LP.BASE+q]=LP_LEG(q)==='W'||LP_LEG(q)==='D'?.9:.6; // a breeze from the sea, stronger in the mountains
WIND_AMT[430]=.3;WIND_AMT[431]=.3;
const LPS={nextBird:0,nextBee:0,nextBreeze:60,beeNear:0,flo:[],floAt:''};
const lpOutdoors=()=>(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N)||LEVEL===430||LEVEL===431;
function lpBeeImg(){if(!IMG.lp_bee){const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');x.fillStyle='#e8c030';x.beginPath();x.ellipse(6,6,5,3.4,0,0,TAU);x.fill();x.fillStyle='#2a2010';x.fillRect(4,3,1.6,6);x.fillRect(7.4,3,1.6,6);x.fillStyle='rgba(235,245,255,.7)';x.beginPath();x.ellipse(5,3,2.6,1.6,-.5,0,TAU);x.fill();IMG.lp_bee=c;NPC_H.lp_bee=.07}return IMG.lp_bee}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);
  if(!AC||G.state!=='play'||G.mute||!SNDOPT.amb||!lpOutdoors())return;
  const t=G.time;
  if(t>LPS.nextBird){LPS.nextBird=t+2.5+Math.random()*5;const n=3+((Math.random()*4)|0),f0=2400+Math.random()*1500,v=.035*(SNDOPT.amb||1);for(let k=0;k<n;k++){const f=f0*(1+k*.03*(Math.random()-.3));tone(f,f*1.18,.06+Math.random()*.04,'sine',v,k*.11)}}
  if(LPS.beeNear>0&&t>LPS.nextBee){LPS.nextBee=t+.28;tone(176+Math.random()*14,190,.3,'sawtooth',.012*Math.min(1,LPS.beeNear/2),0);tone(352+Math.random()*20,360,.3,'sine',.004,0)}
  if(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N&&LP_LEG(LEVEL-LP.BASE)!=='W'&&t>LPS.nextBreeze){LPS.nextBreeze=t+150+Math.random()*180;msg('A breeze comes in off the sea, smelling of salt and clover.','#a8d8ff')}}}
{const _y=yrSprites;yrSprites=function(out){_y(out);
  if(!lpOutdoors()||G.state!=='play')return;
  const t=G.time,up=IMG.yar_gull_up,dn=IMG.yar_gull_down,px=G.C.x,py=G.C.y;
  if(up&&dn)for(let i=0;i<7;i++){const sp=.9+hash2(i,1,301)*1.2,span=44,ph=(t*sp+hash2(i,2,301)*span)%span,dir=i%2?1:-1,bx=px+(dir>0?ph-span/2:span/2-ph),by=py-5-hash2(i,3,301)*10+Math.sin(t*.6+i)*1.5,img=((t*4+i)|0)%2?up:dn;
    out.push({x:bx,y:by,img,w:.2,bob:1.5+hash2(i,4,301)*1.2+Math.sin(t*1.3+i)*.2,decor:{walk:true,k:'yar_gull_fly'}})}
  // bees: a few, circling the flowers nearest to the party
  const cell=(px|0)+','+(py|0);if(cell!==LPS.floAt){LPS.floAt=cell;LPS.flo=(G.flora||[]).filter(f=>Math.abs(f.wx-px)<7&&Math.abs(f.wy-py)<7&&/^lflora/.test(f.k)).slice(0,6)}
  LPS.beeNear=0;const bi=lpBeeImg();
  LPS.flo.forEach((f,i)=>{const a=t*(3+i*.4)+i*2,d=Math.hypot(f.wx-px,f.wy-py);if(d<3)LPS.beeNear+=1;out.push({x:f.wx+Math.cos(a)*.3,y:f.wy+Math.sin(a*1.3)*.3,img:bi,w:.07,bob:.32+Math.sin(a*2)*.08,decor:{walk:true,k:'lp_bee'}})})}}

{const _f=forestWallFor;forestWallFor=function(n){if(n>=400&&n<=423&&T_LUSH!==undefined)return T_LUSH;return _f.apply(this,arguments)}}
{const _ys2=yarSoundTick;yarSoundTick=function(){_ys2.apply(this,arguments);
  if(!AC||G.state!=='play'||G.mute||!SNDOPT.amb||!(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N)||!G.P)return;
  const t=G.time;if(t<(LPS.nextFall||0))return;
  const f=G.decor.find(d=>d.kname==='falls'&&Math.abs(d.x-G.P.x)<14&&Math.abs(d.y-G.P.y)<14);if(!f)return;
  LPS.nextFall=t+.22;const near=1-Math.min(1,Math.hypot(f.x-G.P.x,f.y-G.P.y)/14);nz(.34,.05*near*(SNDOPT.amb||1),'bandpass',1100+Math.random()*300,1500,0)}}

/* ---- one unbroken road: when the party gets 72 rows from the end of a stretch, it is carried into the next (or the last) stretch at exactly the same place along the road. The two stretches share 160 rows, so the carrying cannot be seen. ---- */
const LPF={on:0,a:0,go:null,ph:0};
function lpFadeTick(dt){
  if(!LPF.on)return;
  if(!LPF.ph){LPF.a=Math.min(1,LPF.a+dt/.45);if(LPF.a>=1){LPF.ph=1;const g=LPF.go;LPF.go=null;if(g)g()}}
  else{LPF.a=Math.max(0,LPF.a-dt/.7);if(LPF.a<=0){LPF.on=0;LPF.ph=0;G._lpSwap=0}}
}
function lpSwapTick(){
  if(LEVEL<LP.BASE||LEVEL>=LP.BASE+LP.N||G.state!=='play'||G.cut||G.talk||G._lpSwap||!G.P)return;
  if(Math.abs(G.C.x-G.P.x)>.06||Math.abs(G.C.y-G.P.y)>.06)return; // only between steps
  const s=LEVEL-LP.BASE,Y0=s===LP.N-1?60:0,H=LP.H+Y0,ry=G.P.y-Y0;let t=-1;
  if(s<LP.N-1&&ry<=LPT)t=s+1;else if(s>0&&G.P.y>=H-LPT)t=s-1;
  if(t<0)return;
  if(!LEVELS[LP.BASE+t]&&KH_LAZY[LP.BASE+t])KH_LAZY[LP.BASE+t]();
  const T0=t===LP.N-1?60:0,gy=s*(LP.H-LPOV)+(LP.H-1-(G.P.y-Y0)),y2=T0+(LP.H-1)-(gy-t*(LP.H-LPOV));
  const lg=LP_LEG(s)==='S'?LP.W-1-G.P.x:G.P.x,x2=LP_LEG(t)==='S'?LP.W-1-lg:lg;
  G._lpSwap=1;const f=G.P.f,go=()=>{goToLevel(LP.BASE+t,{x:x2,y:Math.round(y2),f});try{G.lvlBanners=[];if(G.msgs)G.msgs.length=0}catch(e){}};
  if(LP_LEG(s)!==LP_LEG(t)){LPF.on=1;LPF.a=0;LPF.go=go;return} // where the country itself changes (coast to mountains and back) the carrying is hidden by a short fade
  go();G._lpSwap=0;
  // get the next stretch ready while the party walks, so that crossing into it is quick
  setTimeout(()=>{const n=LEVEL-LP.BASE+1;if(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N-1&&!LEVELS[LP.BASE+n]&&KH_LAZY[LP.BASE+n])KH_LAZY[LP.BASE+n]()},1500);
}
{const _t=seaTick;seaTick=function(dt){_t.apply(this,arguments);try{lpFadeTick(dt);lpSwapTick()}catch(e){console.error(e)}}}
{const _d=drawTport;drawTport=function(){_d.apply(this,arguments);if(LPF.on&&LPF.a>0){ctx.fillStyle='rgba(0,0,0,'+LPF.a.toFixed(3)+')';ctx.fillRect(0,0,480,320)}}}

/* ---- the benches on the Land Path: the party can sit, and the music of Greendale Forest plays until they stand up ---- */
khNpc('lp_bench','A wooden bench','kh_ohgard1_3',()=>say('A plain wooden bench beside the path. The view is good, and nobody is in a hurry.',[
  ['Sit down.',()=>{G.sit={t:G.time+150};G.clock=(G.clock||0)+20;let healed=0;for(const h of G.heroes)if(h.alive!==false&&h.hp>0&&h.hp<h.max){h.hp=Math.min(h.max,h.hp+Math.ceil(h.max*.15));healed=1}
    msg('The party sits. For a while nobody says anything, and somewhere a gentle tune begins.','#b8e8c0');if(healed)msg('The rest does you good.','#a8d8a8');return null}],
  ['Walk on.',()=>null]]));
{const _dsl=desertStep;desertStep=function(x,y){if(G.sit){G.sit=null;msg('You stand up and walk on.','#c8d8c0')}_dsl.apply(this,arguments)}}

/* ==========================================================================
   THE WHOLE LAND PATH ON ONE MAP. On the path the map screen shows one hand-drawn parchment of the entire 96 km: the sea in the middle, the
   mountains across the top, the forest on the outer sides, the path with a mark at every eight kilometres, every shrine, house, inn and
   church, the waterfalls and rope bridges, Saint Elen's Monastery halfway, and where the party is now. It is drawn from the same numbers
   that build the path, so every mark is where the thing really stands.
   ========================================================================== */
const LP_TOT=LP.N*(LP.H-LPOV)+LPOV;
const LP_MAPV=[[0,385,248],[8/24,385,76],[16/24,105,76],[22/24,105,222],[1,172,250]]; // Oldhaven, the north-east corner, the north-west corner, the foot of the west side, Yarrim
function lpBase(f){f=Math.max(0,Math.min(1,f));for(let i=1;i<LP_MAPV.length;i++){const a=LP_MAPV[i-1],b=LP_MAPV[i];if(f<=b[0]+1e-9){const t=(f-a[0])/(b[0]-a[0]||1);return[a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}}return[LP_MAPV[4][1],LP_MAPV[4][2]]}
function lpPos(f){const [x,y]=lpBase(f),[x2,y2]=lpBase(f+.002),[x1,y1]=lpBase(f-.002);let nx=-(y2-y1),ny=x2-x1;const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;const w=Math.sin(f*70)*2.2+Math.sin(f*23+1)*1.6;return[x+nx*w,y+ny*w]}
const lpGY=(s,row)=>s*(LP.H-LPOV)+(LP.H-1-row);
function lpDrawMap(){
  BTNS=[];veil(.95);
  const ink='#2a1c0e',halo='rgba(236,222,176,.9)',H=hash2;
  const gr=ctx.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#c4b284');gr.addColorStop(1,'#a8966a');ctx.fillStyle=gr;ctx.fillRect(0,0,DW,DH);
  ctx.save();ctx.globalAlpha=.12;for(let i=0;i<120;i++){const a=H(i,1,7),b=H(i,2,7);ctx.fillStyle=i%3?'#5a4630':'#e8dcb0';ctx.beginPath();ctx.ellipse(a*DW,b*DH,6+H(i,3,7)*30,3+H(i,4,7)*14,H(i,5,7)*3,0,TAU);ctx.fill()}ctx.restore();
  const lab=(t,x,y,sz,col,al)=>{ctx.save();ctx.font=`bold ${sz}px ${FUI}`;ctx.textAlign=al||'center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle=halo;ctx.strokeText(t,x,y);ctx.fillStyle=col||ink;ctx.fillText(t,x,y);ctx.restore()};
  // the sea in the middle, with a wavy shore and little waves
  ctx.save();ctx.beginPath();ctx.moveTo(124,300);ctx.lineTo(124,232);ctx.quadraticCurveTo(124,98,150,96);ctx.lineTo(344,96);ctx.quadraticCurveTo(366,98,366,134);ctx.lineTo(366,300);ctx.closePath();
  ctx.fillStyle='rgba(112,156,176,.55)';ctx.fill();ctx.strokeStyle='rgba(40,70,90,.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([]);ctx.clip();
  ctx.strokeStyle='rgba(235,245,250,.55)';ctx.lineWidth=1;for(let i=0;i<46;i++){const x=130+H(i,11,3)*230,y=102+H(i,12,3)*196;ctx.beginPath();ctx.moveTo(x-5,y);ctx.quadraticCurveTo(x-2.5,y-3,x,y);ctx.quadraticCurveTo(x+2.5,y+3,x+5,y);ctx.stroke()}
  ctx.restore();
  lab('The Inner Sea',245,170,13,'#2c4a60');
  // mountains across the top, forest on the outer sides
  for(let i=0;i<20;i++){const x=40+i*21+H(i,1,9)*10,y=48+H(i,2,9)*12,w=14+H(i,3,9)*8,h=16+H(i,4,9)*10;
    ctx.fillStyle='#8a7a66';ctx.beginPath();ctx.moveTo(x-w,y+h*.4);ctx.lineTo(x,y-h*.6);ctx.lineTo(x+w,y+h*.4);ctx.closePath();ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='#f0ece0';ctx.beginPath();ctx.moveTo(x-w*.32,y-h*.15);ctx.lineTo(x,y-h*.6);ctx.lineTo(x+w*.32,y-h*.15);ctx.lineTo(x+w*.1,y-h*.05);ctx.lineTo(x-w*.1,y-h*.12);ctx.closePath();ctx.fill()}
  const tree=(x,y,r)=>{ctx.fillStyle='#4a6a34';ctx.beginPath();ctx.arc(x,y-r*.6,r,0,TAU);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.stroke();ctx.fillStyle='#5a3c20';ctx.fillRect(x-.8,y,1.6,r*.7)};
  for(let i=0;i<46;i++){tree(408+H(i,5,9)*64,100+H(i,6,9)*150,3+H(i,7,9)*2);if(i<38)tree(8+H(i,8,9)*88,104+H(i,9,9)*130,3+H(i,10,9)*2)}
  lab('The Mountains',330,30,12,'#5a4a38');lab('The Oak Forest',446,262,7,'#2c4a20');lab('The Oak Forest',48,246,7,'#2c4a20');
  // the path: solid where the party has walked, dashed where it has not
  const cur=Math.max(0,Math.min(1,(lpGY(LEVEL-LP.BASE,(LEVEL===LP.BASE+LP.N-1?G.C.y-60:G.C.y))+LPOV*0)/LP_TOT)),N=420;
  const trace=(f0,f1,col,w,dash)=>{ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash(dash||[]);ctx.beginPath();for(let i=0;i<=N;i++){const f=f0+(f1-f0)*i/N,p=lpPos(f);if(i)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1])}ctx.stroke();ctx.restore()};
  trace(0,1,'rgba(246,232,190,.9)',6);trace(0,cur,'#5a3c1c',2.6);trace(cur,1,'#5a3c1c',1.8,[4,4]);
  // a mark at every eight kilometres, counted the way the signposts count: to Yarrim
  for(let m=8;m<LP_KM;m+=8){const [x,y]=lpPos(m/LP_KM),f=m/LP_KM,side=f<8/24?[1,0]:f<16/24?[0,-1]:[-1,0];ctx.fillStyle=ink;ctx.beginPath();ctx.arc(x,y,2,0,TAU);ctx.fill();lab(String(LP_KM-m),x+side[0]*9,y+side[1]*8,7,'#5a3c1c')}
  // the shrines: a little grey stone every hundred and four steps, with an offering
  for(let g=52;g<LP_TOT;g+=104){const [x,y]=lpPos(g/LP_TOT),f=g/LP_TOT,sd=(Math.floor(g/104)%2?-1:1)*(f<8/24?1:f<16/24?-1:-1);let ox=0,oy=0;if(f<8/24||f>=16/24)ox=3.2*sd;else oy=3.2*sd;
    ctx.fillStyle='#8a8a8a';ctx.fillRect(x+ox-1.3,y+oy-1.6,2.6,3.2);ctx.fillStyle='#e8a840';ctx.fillRect(x+ox-.6,y+oy-2.4,1.2,1)}
  // the places
  const house=(x,y,kind,s)=>{s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=kind==='church'?'#d8d0c0':'#c8a070';ctx.fillRect(-4,-3,8,6);ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.strokeRect(-4,-3,8,6);
    ctx.fillStyle=kind==='inn'?'#b04030':kind==='church'?'#6a6a78':'#7a4a2a';ctx.beginPath();ctx.moveTo(-5.5,-3);ctx.lineTo(0,-8);ctx.lineTo(5.5,-3);ctx.closePath();ctx.fill();ctx.stroke();
    if(kind==='church'){ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,-12);ctx.moveTo(-2,-10.4);ctx.lineTo(2,-10.4);ctx.stroke()}
    if(kind==='inn'){ctx.fillStyle='#f0d070';ctx.fillRect(-1,0,2,3)}ctx.restore()};
  const SHORT=['Shepherd’s House','The Last Lamp','Long Road Church','Fisherman’s House','Hermit’s House','Quiet Chapel','Cold Spring Inn','Charcoal House','Gardener’s House','St Aldric’s','Wayfarer’s Rest','Beekeeper’s House','The Last House'];
  for(const [seg,kind,row,name] of LP_BUILD){const nm=SHORT[LP_BUILD.findIndex(b=>b[3]===name)]||name;const f=lpGY(seg,row)/LP_TOT,[x,y]=lpPos(f),east=f<8/24,top=f>=8/24&&f<16/24,off=top?[0,15]:east?[-15,0]:[15,0];
    // inland, on the forest side: east of the east side, north (mountain) of the top, west of the west side; the sea side is for the inns' boats
    const sd=east?[16,0]:top?[0,-16]:[-16,0];ctx.strokeStyle='rgba(90,60,30,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+sd[0],y+sd[1]);ctx.stroke();
    house(x+sd[0],y+sd[1],kind);lab(nm,x+sd[0]*1.0+(east?4:top?0:-4),y+sd[1]+(top?-9:east?0:0),7,kind==='inn'?'#7a2418':ink,east?'left':top?'center':'right')}
  // waterfalls and rope bridges
  for(const s of LP_FALLS){const f=lpGY(s,400)/LP_TOT,[x,y]=lpPos(f);ctx.fillStyle='rgba(120,170,200,.95)';ctx.fillRect(x-1.5,y-12,3,9);ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.strokeRect(x-1.5,y-12,3,9);
    ctx.strokeStyle='#5a3c1c';ctx.beginPath();ctx.moveTo(x-6,y+1);ctx.quadraticCurveTo(x,y+4,x+6,y+1);ctx.stroke();lab('Falls and bridge',x,y-17,6,'#2c4a60')}
  // Saint Elen's Monastery, halfway, on the shore below the path
  {const f=lpGY(LPM.SEG,LPM.Y)/LP_TOT,[x,y]=lpPos(f);const mx=x,my=y+34;ctx.strokeStyle='rgba(90,60,30,.7)';ctx.lineWidth=1.5;ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(mx,my-14);ctx.stroke();ctx.setLineDash([]);
    ctx.save();ctx.translate(mx,my);ctx.fillStyle='#dcd0b0';ctx.fillRect(-12,-5,24,12);ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.strokeRect(-12,-5,24,12);ctx.fillStyle='#8a4a2a';ctx.beginPath();ctx.moveTo(-14,-5);ctx.lineTo(-6,-13);ctx.lineTo(2,-5);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#c8bca0';ctx.fillRect(5,-14,6,16);ctx.strokeRect(5,-14,6,16);ctx.fillStyle='#8a4a2a';ctx.beginPath();ctx.moveTo(4,-14);ctx.lineTo(8,-21);ctx.lineTo(12,-14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=ink;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(8,-21);ctx.lineTo(8,-25);ctx.moveTo(6.2,-23.2);ctx.lineTo(9.8,-23.2);ctx.stroke();ctx.restore();
    lab('SAINT ELEN’S MONASTERY',mx,my+15,9,'#6a1a10');lab('halfway: rest, quests and a quiet reward',mx,my+25,6.5,'#6a1a10');ctx.fillStyle='#d03a2a';ctx.beginPath();ctx.arc(x,y,3.2,0,TAU);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke()}
  // the two ends
  {const [x,y]=lpPos(0);ctx.fillStyle='#c8a070';ctx.fillRect(x-9,y+2,18,9);ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.strokeRect(x-9,y+2,18,9);for(let i=0;i<4;i++)ctx.fillRect(x-9+i*5,y-1,3,3);ctx.strokeRect(x-9,y-1,3,3);lab('OLDHAVEN',x,y+19,9,ink);lab('the north gate',x,y+28,7,'#5a3c1c');
   const [x2,y2]=lpPos(1);ctx.fillStyle='#8a7a66';ctx.fillRect(x2-14,y2-10,28,10);ctx.strokeStyle=ink;ctx.strokeRect(x2-14,y2-10,28,10);ctx.fillStyle='#c8a070';for(const dx of [-8,0,8]){ctx.fillRect(x2+dx-2,y2+2,5,5);ctx.strokeRect(x2+dx-2,y2+2,5,5)}lab('YARRIM',x2,y2+17,9,ink);lab('the cliff: a way down, none back',x2,y2+26,6.5,'#6a1a10')}
  // you
  {const [px,py]=lpPos(cur);ctx.save();ctx.translate(px,py);ctx.fillStyle='#ffe36a';ctx.strokeStyle='#2a1c0e';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,5.5,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#d03a2a';ctx.beginPath();ctx.arc(0,0,2,0,TAU);ctx.fill();ctx.restore();
   const km=Math.round(cur*LP_KM);lab('You: '+km+' km from Oldhaven, '+(LP_KM-km)+' to Yarrim',245,228,9,'#6a1a10')}
  // title, note and legend
  ctx.save();ctx.font=`22px ${FTITLE}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#2a1c0e';ctx.fillText('The Land Path',10,16);ctx.restore();
  lab('96 kilometres, Oldhaven to Yarrim',12,33,8,'#5a3c1c','left');
  const ly=DH-14;ctx.fillStyle='rgba(30,20,10,.82)';ctx.fillRect(0,DH-30,DW,30);
  txt('Stay on the path: the shrines leave food for the hungry, the inns have beds, and Saint Elen’s Monastery waits halfway.',240,DH-23,8,'#e8dcb0','center',true);
  const lg=(x,kind,t)=>{house(x,ly-2,kind,.8);txt(t,x+8,ly,7,'#cdbf94','left')};
  lg(18,'house','House');lg(66,'inn','Inn');lg(104,'church','Church');
  ctx.fillStyle='#8a8a8a';ctx.fillRect(152,ly-4,3,5);ctx.fillStyle='#e8a840';ctx.fillRect(152.8,ly-5,1.4,1.2);txt('Shrine (food)',162,ly,7,'#cdbf94','left');
  ctx.fillStyle='rgba(120,170,200,.95)';ctx.fillRect(232,ly-5,3,8);txt('Waterfall',240,ly,7,'#cdbf94','left');txt('Small numbers: km to Yarrim',290,ly,7,'#cdbf94','left');
  btnText('worldmap','World map',328,5,80,20);btnText('ovexit','Exit',414,5,60,20);
}
{const _do=drawOverview;drawOverview=function(){if(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N){lpDrawMap();return}return _do.apply(this,arguments)}}
