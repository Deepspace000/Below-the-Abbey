/* ==========================================================================
   THE SIX SMALL TOMBS (levels 536 to 541, prefix gy / GY). Family tombs built into the edge of the Wenlock Graveyard (see GY_TOMBS in gy_yard.js: four along the north and south sides, two on the west).
   Each is a small vaulted room (11 by 11) that you walk into from the yard: sarcophagi, candle stands, cobwebs, bones, a cold blue-green glow in the corners, and in some a little treasure.
   Nothing here fights. The door in the south wall leads back out to the lane beside the tomb's front.
   ========================================================================== */
/* The fronts of the six tombs in the yard are all different: each has its own stone and tint, its own ivy, a name plaque over the door, a pair of statues or urns (stat: left, right), a lamp colour, and a few extras (ext: [piece, along, deep, solid, scale]).
   The picture used for the front is the mausoleum (gatesC_4), the grassy barrow with its dark arch (stairFix_1) or the grassy mound with wooden doors (gatesC_3). */
const GY_TSTYLE={
  536:{tex:'texGrey_0',rgb:[.92,1,1.12],img:'gatesC_4',ivy:26,stat:['angel','angel'],sc:.95,lamp:[.5,1.05,1.45],pl:'VANE',ext:[['rose',-1,2,false,.55],['rose',1,2,false,.55],['bench',-3,3]]},
  537:{tex:'texGrey_2',rgb:[1.12,1.02,.84],img:'gatesC_4',ivy:70,stat:['urn','urn'],sc:1,lamp:[1.55,1.0,.45],pl:'ASHBY',ext:[['bench',-2,3],['bench',2,3],['rose',-1,2,false,.55],['rose',1,2,false,.55]]},
  538:{tex:'texBlack_1',rgb:[1.35,1.35,1.5],img:'gatesC_4',ivy:8,stat:['obelisk','obelisk'],sc:.9,lamp:[.85,.6,1.5],pl:'THORNE',ext:[['urn',-1,3,true],['urn',1,3,true]]},
  539:{tex:'texBone_2',rgb:[.78,.92,.8],img:'stairFix_1',ivy:90,stat:['ccross','ccross'],sc:.95,lamp:[.45,1.3,.7],pl:'MARSH',ext:[['mound',-2,2,true,.8],['mound',2,2,true,.8],['web',-1,2]]},
  540:{tex:'texRed_0',rgb:[1,.84,.78],img:'gatesC_3',ivy:44,stat:['column','column'],sc:.95,lamp:[1.55,.5,.34],pl:'COBB',ext:[['bench',2,3],['rose',-1,2,false,.55],['rose',1,2,false,.55]]},
  541:{tex:'texGrey_4',rgb:[1,.94,1.14],img:'gatesC_4',ivy:56,stat:['angel','ccross'],sc:.9,lamp:[1.35,1.25,.95],pl:'FELL',ext:[['rose',-1,2,false,.55],['bench',-2,3],['urn',2,3,true]]}};
/* one tile of a tomb front (0 left, 1 door, 2 right): the stone, the front picture, ivy hanging from the top and growing from the foot, and over the door the name plaque */
function gyTombTile(T,st,i){
  return gyTile(st.tex,3.4,{fac:{img:st.img,i,n:3},gain:1.0,rgb:st.rgb,tag:'tomb'+T.id+'_'+i,draw:(x,w,h)=>{
    const G=['#2a5a26','#3b7f31','#58a03e','#244c24','#6fb04a'],hs=(a,b,c)=>hash2(a,b,c+T.id*3+i*11);
    const nv=Math.round(st.ivy/3);
    for(let k=0;k<nv;k++){const edge=i===0?hs(k,1,1)*.55:i===2?1-hs(k,1,1)*.55:hs(k,1,1),px=edge*w,top=hs(k,2,1)<.5,len=h*(top?(.08+hs(k,3,1)*.28):(.1+hs(k,3,1)*.3));
      let qx=px,qy=top?0:h;x.strokeStyle='#27481f';x.lineWidth=1.3+hs(k,4,1)*1.4;x.beginPath();x.moveTo(qx,qy);
      for(let t=1;t<=6;t++){qx+=(hs(k,t+5,2)-.5)*8;qy+=(top?1:-1)*len/6;x.lineTo(qx,qy)}x.stroke();
      for(let t=0;t<7;t++){x.fillStyle=G[(hs(k,t+9,3)*5)|0];x.beginPath();x.ellipse(px+(hs(k,t+20,4)-.5)*12,top?len*t/7:h-len*t/7,2.5+hs(k,t+30,5)*3.5,2+hs(k,t+40,5)*2,hs(k,t+50,6)*3,0,6.3);x.fill()}}
    if(i===1){const pw=84,ph=17,px=(w-pw)/2,py=h*(st.img==='gatesC_4'?.405:.56);x.fillStyle='#24211d';x.fillRect(px,py,pw,ph);x.strokeStyle='#9a8858';x.lineWidth=1.4;x.strokeRect(px+1.5,py+1.5,pw-3,ph-3);
      x.fillStyle='#e0d08e';x.font='bold 12px '+(typeof FTITLE!=='undefined'?FTITLE:'serif');x.textAlign='center';x.textBaseline='middle';x.fillText(st.pl,w/2,py+ph/2+.5)}}})}
const GY_TOMB_NAMES={536:'The Vane Tomb',537:'The Ashby Vault',538:'The Thorne Mausoleum',539:'The Marsh Crypt',540:'The Cobb Vault',541:'The Fell Tomb'};
function gyTombBuild(id){
  if(LEVELS[id])return LEVELS[id];
  gyAlias();
  const W=11,H=11,hs=(a,b,c)=>hash2(a,b,c),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(let y=2;y<=8;y++)for(let x=2;x<=8;x++)g[y][x]='.';
  g[9][5]='.';
  const T=GY_TOMBS.find(t=>t.id===id)||GY_TOMBS[0];
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const WH=3.0,open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const V=[0,3,0,5,0,1,3,0,2].map(v=>ch(gyTile('texGrey_'+v,WH,{rgb:[.92,.95,1]})));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){s+=open(x,y)?'.':near(x,y)?V[(hs(x,y,9)*V.length)|0]:V[0]}rows.push(s)}
  {const gid=gyTile('texGrey_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1,rgb:[1,1,1+id*.00001]});
   KH_DOOR[gid]={lvl:GY.ID,get at(){const f=T.front||[T.x,T.y];return {x:f[0],y:f[1],f:T.side==='N'?2:T.side==='S'?0:1}},gy:'tombexit'};
   rows[10]=rows[10].slice(0,5)+ch(gid)+rows[10].slice(6)}
  const decor=[],lights=[],lcol={},occ=new Set();
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!open(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.goldAmt)d.goldAmt=o.goldAmt;decor.push(d);occ.add(x+','+y);return d};
  const light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  // sarcophagi along the side walls, candle stands, a cold glow in every corner
  for(const [x,y] of [[3,3],[7,3],[3,6],[7,6]])dec('sarc',x,y,{block:true,sc:.9});
  for(const [x,y] of [[5,2],[2,5],[8,5]]){dec('candles',x,y,{block:true,sc:.75});light(x,y,[1.5,1.0,.5])}
  for(const [x,y] of [[2,2],[8,2],[2,8],[8,8],[5,5]])light(x,y,[.45,1.05,.95]);
  for(const [x,y] of [[2,3],[8,3],[2,7],[8,7],[4,2],[6,2]])dec('web',x,y,{sc:.5});
  for(const [x,y] of [[4,7],[6,7],[3,8]])dec('bones',x,y,{sc:.9});
  // some hold a little treasure on the floor at the back
  if(id%2===0)dec('chest',5,4,{block:true,goldAmt:2500+(id%7)*400});
  const fm=[];for(let y=0;y<H;y++)fm.push('3'.repeat(W));
  const L={rows,chars,fmap:fm,floorSet:gyCryptFloors(),floor:gyCryptFloors()[3],ceil:'gyc_crypt',ceilH:WH+1,start:{x:5,y:9,f:0},enemies:[],items:[],decor,lights,portals:[],day:0,amb:.05,torchGap:1e9,noTele:true,noExtras:true,
    name:GY_TOMB_NAMES[id],label:GY_TOMB_NAMES[id],diff:84,mapNames:[{t:GY_TOMB_NAMES[id],x:5,y:5,k:'place'}],peaceful:true,_gy:{kind:'crypt',lcol}};
  LEVELS[id]=L;LEVEL_NAMES[id]=GY_TOMB_NAMES[id];LEVEL_RATING[id]=84;
  return L}
for(const id of [536,537,538,539,540,541])KH_LAZY[id]=((i)=>()=>gyTombBuild(i))(id);
