/* ==========================================================================
   THE LAND PATH. A gate in the north wall of Oldhaven opens on a path that runs north up the peninsula for a very long time, with the sea
   on the west and an old oak forest on the east, then turns west over the mountains and south again, and ends at a high cliff above
   Yarrim. It is only a way of walking: no quests and no fights, just flowers, lamps, a few houses, inns and churches, and a quiet that
   lasts about an hour. It goes one way: from Oldhaven to Yarrim. The cliff at the end can only be climbed down.
   24 levels of 72 by 400 cells (400 to 423), built when first reached; the legs: N (coast, going north) 0 to 7, W (the mountains, going
   west) 8 to 15, S (coast, going south, drawn the other way round so the sea is still on the right hand west) 16 to 21, D (the high pass
   and the descent) 22 and 23. Each leg is a stretch of the same kind of country. The 13 buildings are rooms numbered from 6800.
   ========================================================================== */
const LP={BASE:400,N:24,ROOM0:6800,W:96,H:560,CX:64,A:10},LPK=LP.H/400; // 24 stretches of 560 rows is about 13,000 steps
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
function lpXcOf(s){ // the winding middle of the path, row by row, for stretch s
  if(LP_XC[s])return LP_XC[s];
  const leg=LP_LEG(s),mount=leg==='W'||leg==='D',PAD=s===LP.N-1?60:0,H=LP.H+PAD,CX=LP.CX,A=mount?LP.A-1:LP.A,sd=s*37+11,ph1=hash2(sd,1,2),ph2=hash2(sd,3,4),xc=[];
  for(let y=0;y<H;y++){const yy=y-PAD,HH=LP.H;if(yy<0){xc.push(CX);continue}const t=(HH-1-yy)/(HH-1),env=Math.max(0,Math.min(1,Math.min(yy,HH-1-yy)/44));xc.push(Math.round(CX+env*A*(.62*Math.sin(TAU*(t*6.3+ph1))+.38*Math.sin(TAU*(t*11.7+ph2)))))}
  return LP_XC[s]=xc}
const lpWd=(s,y,sg)=>6.5+3*tsmooth(y/7,sg+3,s*37+11+7);
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
khNpc('lp_shrine','A roadside shrine','memorial',d=>{
  const F=G.flags,T=F.lpSh||(F.lpSh={}),k=LEVEL+'_'+d.y,opts=[];
  const have=LP_FOODS.find(f=>bagCount(f)>0);
  if(have)opts.push(['Leave something to eat.',()=>{const j=G.bag.findIndex(b=>b.id===have);if(j>=0)bagTake(j);T[k]=0;try{honourAdd(2,'an offering at a shrine')}catch(e){}msg('You leave it on the stone beside the others.','#c8e8b0');return say('The stone is warm, and the flowers are fresh. A small quiet settles over the road.',[BYE])}]);
  if(!T[k])opts.push(['Take the food. (It is not yours.)',()=>{T[k]=1;for(let i=0;i<3;i++)bagAdd({id:LP_FOODS[(Math.random()*LP_FOODS.length)|0],n:1});try{honourAdd(-10,'taking from a shrine')}catch(e){}msg('You take what pilgrims left. It does not feel like yours.','#e0a080');return say('You take the loaf and the fruit that other people left for travellers who needed them more. Somewhere behind you, a pilgrim stops walking and says nothing.',[BYE])}]);
  return say(T[k]?'The stone is bare. The flowers are fresh, but there is no food left. Pilgrims will come and leave more, in time.':'A small shrine of grey stone beside the road. Bread, apples, a wedge of cheese and a bunch of flowers have been left here by people who passed before you, for anyone who might need them. A little candle burns, though nobody is near.',[...opts,['Leave it be.',()=>null]]);
});

/* ---- pictures: an invisible stone to walk into at the ends of each stretch, and the horse ---- */
const LP_KM=96,LP_ROWS_KM=(LP.N*LP.H)/LP_KM; // the whole path is 96 kilometres, a sign at every one
function lpArt(){if(!IMG.lp_gap){const c=document.createElement('canvas');c.width=c.height=8;IMG.lp_gap=c;NPC_H.lp_gap=.1}}
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
  const PAD=s===LP.N-1?60:0,W=LP.W,H=LP.H+PAD,Y0=PAD,N=W*H,CX=LP.CX,leg=LP_LEG(s),mir=leg==='S',MX=x=>mir?W-1-x:x,hs=(a,b,c)=>hash2(a,b,c),sd=s*37+11;
  const mount=leg==='W'||leg==='D',coast=!mount,open_=y=>coast||(s===LP.N-1&&y<64+Y0);
  const wet=y=>s===LP.N-1&&y<=Y0+5; // the sea beyond the cliff // the last stretch opens out onto a green terrace above the sea
  const OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'],PINES=['ptree0','ptree1','ptree3','ptree4','ptree9','pjuniper'],FLO=['lflora0','lflora0_1','lflora0_2'];
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rock=[3.8,4.6,5.4].map(wh=>ch(TM.make('plain','grey',wh).gid)),wdist=(y,sg)=>lpWd(s,y,sg);
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const fm=new Array(N).fill('0'),h=new Float32Array(N).fill(.3),rk=new Float32Array(N),block=new Uint8Array(N);
  const I=(x,y)=>y*W+MX(x),setC=(x,y,c)=>{rows[y][MX(x)]=c;block[I(x,y)]=1};
  const decor=[],scenery=[],sky=[],lights=[],used=new Set(),carve=new Set();
  const K=(x,y)=>MX(x)+','+y;
  /* the winding centre of the path: 0 at both ends, wandering 10 cells either way in between */
  const xc=lpXcOf(s);
  const fe=y=>xc[y]+7+Math.round(1.4*Math.sin(y*.09+s*2));
  /* ---- ground: sea and shore on one side, forest on the other; or mountains on both ---- */
  for(let y=0;y<H;y++){const c=xc[y];
    for(let x=0;x<W;x++){const i=I(x,y),d=Math.abs(x-c);
      if(open_(y)){
        const wl=c-9+Math.round(2.2*Math.sin(y*.11+s)),ws=wl-3;
        if(s===LP.N-1&&y<=Y0+5){fm[i]='4';h[i]=-.2;block[i]=1}
        else if(x<ws){fm[i]='4';h[i]=-.2+.03*(tsmooth(x/6,y/6,77)-.5);block[i]=1}
        else if(x<wl){fm[i]='3';h[i]=.12}
        else if(d<=1){fm[i]='1';h[i]=.3}
        else if(x>=fe(y)){fm[i]='0';h[i]=.3+.06*tsmooth(x/5,y/5,sd)}
        else{fm[i]='0';h[i]=.3+.05*(tsmooth(x/5,y/5,sd+3)-.5)}
      }else{
        // the mountains: a pass between tall grey cliffs, with heather, rock and pines in it
        const sg=x<c?-1:1,wd=wdist(y,sg);
        fm[i]=d<=1?'1':d>wd-3?'6':'5';h[i]=.3;
        if(d>wd){setC(x,y,rock[((x*7+y*3+(hs(x,y,sd+4)*3)|0))%3]);}
      }
    }
  }
  if(coast){const hz=ch(lpHaze());for(let y=0;y<H;y++)setC(0,y,hz)} // the sea's far edge fades into the horizon
  if(s===LPM.SEG){ // the gate of Saint Elen's Monastery, cut into the rock of the pass: a lane through the cliff and an arched door at the end of it
    const md=lpMonDoor(),Y=md.y,c0=md.c;
    for(let x=c0+2;x<md.x;x++)for(let y=Y-1;y<=Y+1;y++){rows[y][MX(x)]='.';block[I(x,y)]=0;fm[I(x,y)]='1'}
    const dt=TM.make('door','castle',3.8),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:MON.ID,at:{x:MON.GATE_IN[0],y:MON.GATE_IN[1],f:0}};
    for(let y=Y-1;y<=Y+1;y++)setC(md.x,y,y===Y?ch(dgid):rock[1]);
  }
  /* ---- the places cut out of the trees: clearings, building yards, the hidden nook ---- */
  const circle=(cx,cy,r)=>{for(let y=Math.max(1,cy-r);y<=Math.min(H-2,cy+r);y++)for(let x=cx-r;x<=cx+r;x++)if(x>0&&x<W-1&&Math.hypot(x-cx,y-cy)<=r+hs(x,y,5)*.8)carve.add(K(x,y))};
  const lane=(x0,x1,y,hw)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let yy=y-(hw||0);yy<=y+(hw||0);yy++)carve.add(K(x,yy))};
  const clearings=[];
  for(let k=0;k<6;k++){const y=70+k*92+((hs(sd,k,6)*30)|0);if(y<30||y>H-40)continue;const side=(k+s)%2?-1:1;clearings.push({y,side})}
  const blds=[];LP_BUILD.forEach((b,i)=>{if(b[0]===s)blds.push({i,kind:b[1],y:Math.round(b[2]*LPK),name:b[3],keeper:b[4]})});
  const taken=y=>blds.some(b=>Math.abs(b.y-y)<22)||(LP_TELE.includes(s)&&Math.abs(teleY-y)<14);
  const teleY=Math.round((120+hs(sd,9,9)*150)*LPK);
  for(const c of clearings){if(taken(c.y)||c.side<0){c.skip=c.side<0?false:true}
    if(c.skip&&c.side>0)continue;
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
      if(hs(x,y,sd+12)<dens){const o=hs(x,y,sd+13),a=hs(x,y,sd+14)-.5,b=hs(x,y,sd+15)-.5;
        decor.push({k:OAKS[(o*5)|0],x:MX(x),y,block:near1||near2||dd<4,ox:a*.5*(mir?-1:1),oy:b*.5,sc:.8+hs(x,y,sd+16)*.45})}
    }
  }
  if(mount){ // the pass: pines and boulders against the cliffs, a few rocks beside the path
    for(let y=1;y<H-1;y++){if(open_(y))continue;const c=xc[y];for(const sg of [-1,1]){const wd=Math.floor(wdist(y,sg));for(let dx=3;dx<wd;dx++){const x=c+sg*dx;if(x<1||x>=W-1||used.has(K(x,y)))continue;
      const r=hs(x,y,sd+30),near=dx>=wd-3,p=near?.34:.045;
      if(r<p){used.add(K(x,y));const b2=r<p*.2?'boulder':r<p*.35?'rocks':PINES[(hs(x,y,sd+31)*PINES.length)|0];decor.push({k:b2,x:MX(x),y,block:near,ox:(hs(x,y,sd+32)-.5)*.5,oy:(hs(x,y,sd+33)-.5)*.5,sc:.8+hs(x,y,sd+34)*.6})}}}}
  }
  /* ---- flowers along the path, lamps, benches, rocks on the shore, clearings with huge oaks ---- */
  const flower=(x,y,sc)=>{if(x<1||x>=W-1||used.has(K(x,y)))return;const k=FLO[(hs(x,y,sd+40)*3)|0];scenery.push({k,wx:MX(x)+.5,wy:y+.5,sc:sc||.55,decor:{k,walk:true,x:MX(x),y}})};
  for(let y=2;y<H-2;y++){if(wet(y))continue;const c=xc[y];
    for(const sg of [-1,1]){
      if(hs(y,sg+2,sd+41)<.65)flower(c+sg*2+((hs(y,sg,sd+42)*2)|0)*sg,y,.5+hs(y,sg,sd+43)*.25);
      if(hs(y,sg+5,sd+44)<.45)flower(c+sg*(4+((hs(y,sg,sd+45)*3)|0)),y,.5+hs(y,sg,sd+46)*.3);
    }
    if(hs(y,7,sd+47)<.22)flower(c+((hs(y,8,sd+48)*12-6)|0),y,.55);
    if(open_(y)&&hs(y,9,sd+49)<.04){const x=c-9-3+Math.round(2.2*Math.sin(y*.11+s))+1;if(!used.has(K(x,y))&&x>1){used.add(K(x,y));decor.push({k:'rocks',x:MX(x),y,block:true,deco:true,sc:.7+hs(y,10,sd)*.4})}}
  }
  const lamp=(x,y)=>{if(used.has(K(x,y))||x<1||x>=W-1)return;used.add(K(x,y));decor.push({k:'lamp',x:MX(x),y,block:false,walk:true,deco:true});lights.push([MX(x),y])};
  for(let y=34+((hs(sd,50,50)*26)|0);y<H-34;y+=62)if(!wet(y))lamp(xc[y]+(Math.floor(y/62)%2?-3:3),y);
  // a signpost at every kilometre: To Yarrim, and how far
  for(let m=1;m<LP_KM;m++){const done=m*LP_ROWS_KM,y=Math.round(H-1-(done-s*LP.H));if(y<6||y>H-8||wet(y))continue;if(done<s*LP.H||done>=(s+1)*LP.H)continue;const sk=lpSignKey(LP_KM-m);if(!sk)continue;const sx=xc[y]+(m%2?3:-3);if(used.has(K(sx,y)))continue;used.add(K(sx,y));decor.push({k:sk,x:MX(sx),y,block:false,walk:true,deco:true})}
  const BENCH=IMG.kh_ohgard1_3?'kh_ohgard1_3':null;
  for(let y=60+((hs(sd,51,51)*40)|0);y<H-40;y+=88)if(BENCH&&!wet(y)&&!used.has(K(xc[y]-3,y))){used.add(K(xc[y]-3,y));decor.push({k:BENCH,x:MX(xc[y]-3),y,block:false,walk:true,deco:true});
    const rk=LP_REST_NPC[(hs(y,s,sd+90)*LP_REST_NPC.length)|0],rkp=KH_KEEPERS[rk[0]];if(rkp&&hs(y,s,sd+91)<.7&&!used.has(K(xc[y]-3,y+1))){used.add(K(xc[y]-3,y+1));decor.push({k:khFaceKey(rkp.face),x:MX(xc[y]-3),y:y+1,block:false,walk:true,npc:rk[0],sc:rkp.sc||1})}}
  // benches on the shore, looking out over the sea, with someone sitting on one now and then
  if(coast)for(let y=100,q=0;y<H-60;y+=131,q++){if(wet(y)||!BENCH)continue;const wl=xc[y]-9+Math.round(2.2*Math.sin(y*.11+s)),bx=wl+1;if(used.has(K(bx,y))||bx<3)continue;used.add(K(bx,y));decor.push({k:BENCH,x:MX(bx),y,block:false,walk:true,deco:true});
    const rk3=LP_REST_NPC[(q+s)%LP_REST_NPC.length],kp3=KH_KEEPERS[rk3[0]];if(kp3&&hs(y,s,sd+92)<.5&&!used.has(K(bx,y+1))){used.add(K(bx,y+1));decor.push({k:khFaceKey(kp3.face),x:MX(bx),y:y+1,block:false,walk:true,npc:rk3[0],sc:kp3.sc||1})}}
  // boats sitting on the water
  if(coast||s===LP.N-1)for(let y=30;y<H-30;y+=47){if(wet(y)||!open_(y)||hs(y,s,sd+80)<.3)continue;const wl=xc[y]-9+Math.round(2.2*Math.sin(y*.11+s)),bx=wl-8-((hs(y,s,sd+81)*14)|0);if(bx<4)continue;const bk=['yar_boat_fish','yar_boat_row','yar_boat_dhow'][(hs(y,s,sd+82)*3)|0];if(!IMG[bk])continue;used.add(K(bx,y));decor.push({k:bk,x:MX(bx),y,block:true,deco:true,sc:.9})}
  // roadside shrines, with flowers and food left by pilgrims
  for(let y=70+((hs(sd,52,52)*40)|0),q=0;y<H-60;y+=104,q++){if(wet(y))continue;const sg=(q+s)%2?-1:1,x=xc[y]+sg*5;if(used.has(K(x,y))||used.has(K(x,y+1)))continue;
    used.add(K(x,y));used.add(K(x+sg,y+1));used.add(K(x,y+1));
    decor.push({k:'memorial',x:MX(x),y,block:true,npc:'lp_shrine',sc:.9},{k:'flowerpot',x:MX(x+sg),y:y+1,block:false,walk:true,deco:true,sc:.8},{k:IMG.breadbasket?'breadbasket':'flowerpot',x:MX(x),y:y+1,block:false,walk:true,deco:true,sc:.8})}
  if(s===LPM.SEG){const md=lpMonDoor(),sk=lpBoard('lp_sign_mon','SAINT ELEN’S','monastery 300 m');if(sk){used.add(K(md.c+3,md.y+3));decor.push({k:sk,x:MX(md.c+3),y:md.y+3,block:false,walk:true,deco:true})}lamp(md.x-2,md.y-2);lamp(md.x-2,md.y+2)}
  // (the tall moored ships of the quay are left out here: from far off they only show as grey slabs against the sea)
  for(const cl of clearings){ // the green spaces, with huge oaks
    if(cl.skip)continue;const cy=cl.y;
    const oaks=cl.side>0?[[cl.cx-2,cy-1],[cl.cx+2,cy+1],[cl.cx,cy-3]]:[[xc[cy]-6,cy-1],[xc[cy]-9,cy+2]];
    oaks.forEach(([x,y],j)=>{if(x<1||used.has(K(x,y)))return;used.add(K(x,y));decor.push({k:OAKS[(j+s)%5],x:MX(x),y,block:true,sc:mount?1.3:1.7,ox:0,oy:0})});
    for(let q=0;q<26;q++){const x=(cl.cx||xc[cy]-7)+Math.round((hs(q,cy,sd+60)-.5)*9),y=cy+Math.round((hs(q,cy,sd+61)-.5)*9);const sc=scenery.length;flower(x,y,.6);void sc}
    const bx=(cl.cx||xc[cy]-7)+3,by=cy+2;if(BENCH&&!used.has(K(bx,by))){used.add(K(bx,by));decor.push({k:BENCH,x:MX(bx),y:by,block:false,walk:true,deco:true})}
  }
  /* ---- the knights who ride along, and the ends of the stretch ---- */
  const walkers=[],kp=KH_KEEPERS.lp_knight;
  if(kp&&s%2===(leg==='W'?0:1)){const y0=Math.round((100+hs(sd,70,70)*160)*LPK),y1=Math.min(H-30,y0+110);
    for(const j of [0,1]){const kd={k:khFaceKey(kp.face),x:MX(xc[y0]+2),y:y0,block:false,walk:true,npc:'lp_knight',sc:kp.sc||1,lw:walkers.length,lr:'k'},hd={k:IMG.oh_horse?'oh_horse':'ltree0',x:MX(xc[y0]+3),y:y0,block:false,walk:true,deco:true,sc:1,lw:walkers.length,lr:'h'};
      decor.push(kd,hd);walkers.push({kd,hd,y0,y1,t:j*45,dir:j?1:-1,off:j?2:-2})}}
  // pilgrims and travellers on the way, walking slowly up and down their stretch
  for(let q=0;q<2;q++){const pg=LP_PILG[(hs(s,q,sd+95)*LP_PILG.length)|0],y0=Math.round(40+hs(s,q+7,sd+96)*(H-240)),y1=Math.min(H-30,y0+90+((hs(q,s,sd+97)*60)|0));
    if(wet(y0))continue;const kp2=KH_KEEPERS[pg[0]];if(!kp2)continue;const off=q?-2:2,wi=walkers.length,kd2={k:khFaceKey(kp2.face),x:MX(xc[y0]+off),y:y0,block:false,walk:true,npc:pg[0],sc:kp2.sc||1,lw:wi,lr:'k'};
    decor.push(kd2);walkers.push({y0,y1,t:hs(q,s,sd+98)*(y1-y0),dir:q?1:-1,off,sp:.4+hs(q,s,sd+99)*.2})}
  const enter=(x,y,to,tx,ty,f)=>{for(let dx=-4;dx<=4;dx++)decor.push({k:'lp_gap',x:x+dx,y,block:true,enter:{to,x:tx,y:ty,f}})};
  const north=s<LP.N-1?lpId(s+1):null;
  const mxq=(q,x)=>LP_LEG(q)==='S'?LP.W-1-x:x,hq=q=>LP.H+(q===LP.N-1?60:0);
  if(north!==null)enter(MX(CX),1,north,mxq(s+1,CX),hq(s+1)-5,0);
  else{decor.push({k:'lp_gap',x:MX(CX),y:Y0+7,block:true,npc:'lp_cliff'})}
  enter(MX(CX),H-2,s>0?lpId(s-1):OH.ID,s>0?mxq(s-1,CX):100,s>0?4:7,2);
  function lpId(q){return LP.BASE+q}
  for(let y=H-4;y<H-1;y++)for(let x=CX-6;x<=CX+6;x++)used.add(K(x,y));
  const lv={rows:rows.map(r=>r.join('')),start:{x:MX(CX),y:H-5,f:0},enemies:[],items:[],decor,scenery,sky,fmap:null,floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss','isleSandDk'],floor:'ohMeadow',ceil:'cloud',
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
