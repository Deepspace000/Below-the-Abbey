/* ==========================================================================
   KHEMETRA: THE WORLD AROUND THE STORY. The palace inside, the cisterns beneath the city and the wizard's study, the tunnel
   to the Narrow Sea, the crowd, the markets and the gardens, and how the city reacts to what the party has done.
   ========================================================================== */
const KH_PALACE=199,KH_CISTERN=260,KH_STUDY=261,KH_SEATUNNEL=266;
/* ---- the palace: three rooms behind a great hall ---- */
function khBuildPalace(back){
  const W=33,H=23,g=[];
  for(let y=0;y<H;y++){g.push(new Array(W).fill('w'))}
  const room=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  room(1,1,10,12);room(12,1,20,12);room(22,1,31,12);   // the map room, the throne room, the vizier's study
  room(1,14,31,21);                                    // the great hall
  for(const x of [5,16,26])g[13][x]='.';               // three doorways
  g[22][16]='0';
  const rows=g.map(r=>r.join(''));
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const npc=(id,x,y,extra)=>{const kp=KH_KEEPERS[id];if(!kp)return;decor.push(Object.assign({k:khFaceKey(kp.face),x,y,block:true,npc:id,sc:kp.sc||1},extra||{}))};
  // the throne room
  put('throne',16,2);put('banner',13,2);put('banner',19,2);put('candle',14,4);put('candle',18,4);put('statue',12,6);put('statue',20,6);
  put('brazier',13,9);put('brazier',19,9);
  npc('kh_guardA',14,11);npc('kh_guardB',18,11);
  // the map room
  put('maptable',3,3);put('maptable',7,3);put('maptable',3,7);put('maptable',7,7);put('bookcase',1,5);put('bookcase',10,5);put('bookcase',1,9);put('bookcase',10,9);put('candle',5,1);
  npc('kh_neferet',5,5);
  // the study
  put('bookcase',23,1);put('bookcase',24,1);put('bookcase',29,1);put('bookcase',30,1);put('table',27,4);put('chair',27,6);put('candle',22,5);put('candle',31,5);put('brazier',27,10);put('chest',31,9);
  npc('kh_vizier',27,3);
  // the great hall: guards, pages, petitioners and statues
  for(const x of [3,9,15,17,23,29]){put('statue',x,15);}
  for(const x of [5,11,21,27]){put('brazier',x,20)}
  npc('kh_guardC',8,16);npc('kh_guardD',24,16);npc('kh_page',13,17);npc('kh_herald',19,17);
  for(const [i,x,y] of [[1,4,18],[2,12,19],[3,20,19],[4,28,18]])npc('kh_noble'+i,x,y);
  return {rows,start:{x:16,y:21,f:0},decor,lights:[[5,3],[16,4],[27,3],[8,16],[16,17],[24,16],[5,9],[16,9],[27,9]]};
}
for(let i=1;i<=4;i++)khNpc('kh_noble'+i,['Lady Meret','Lord Sobek','Lady Tiye','Lord Anen'][i-1],['kh_npc1_1','kh_npc2_5','kh_npc1_3','kh_npc1_2'][i-1],()=>say(KH_GOSSIP[(i*9+4)%KH_GOSSIP.length],[BYE]));
khNpc('kh_guardA','A palace guard','kh_npc3_1',()=>say('The throne room is closed to the public. The king is away at his summer court. The vizier receives visitors in his study, to the east. The cartographer is in the map room, to the west.',[BYE]),{sc:1});
khNpc('kh_guardB','A palace guard','kh_npc3_1',()=>say('Whatever you came to say to the king, say it to the vizier instead. He answers for him.',[BYE]));
khNpc('kh_guardC','A palace guard','kh_npc3_0',()=>say('Welcome to the palace of Khemetra. Mind the statues. Some of them are real kings, and the kings do not like being touched.',[BYE]));
khNpc('kh_guardD','A palace guard','kh_npc3_0',()=>say('I have stood in this hall for nine years. I have counted the tiles. There are eleven thousand three hundred and six.',[BYE]));
khNpc('kh_page','A palace page','kh_npc6_5',()=>say('The grand vizier is in the east room. The cartographer is in the west. If you want the king, he is out of town, and I am not allowed to say where.',[BYE]));
khNpc('kh_herald','The royal herald','kh_npc3_4',()=>say('I announce the arrival of important persons. At the moment, I am announcing nothing, because nobody is important. Please wait.',[BYE]));
/* ---- the cisterns beneath the city, and the wizard's study ---- */
function khBuildCisterns(){
  const W=41,H=31,g=[],rng=khRng(909);
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const seen=new Set(['1,1']),stack=[[1,1]];g[1][1]='.';
  while(stack.length){
    const [cx,cy]=stack[stack.length-1],nb=[[2,0],[-2,0],[0,2],[0,-2]].map(([a,b])=>[cx+a,cy+b,a,b]).filter(([x,y])=>x>0&&y>0&&x<W-1&&y<H-1&&!seen.has(x+','+y));
    if(!nb.length){stack.pop();continue}
    const [nx,ny,a,b]=nb[(rng()*nb.length)|0];g[cy+b/2][cx+a/2]='.';g[ny][nx]='.';seen.add(nx+','+ny);stack.push([nx,ny]);
  }
  // chambers cut into the maze
  const rooms=[[3,5,7,8],[15,3,19,7],[27,9,33,13],[5,17,10,21],[19,19,25,24],[31,21,37,27]];
  for(const [x0,y0,x1,y1] of rooms)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.';
  // the way in is at the bottom, the way on to the study at the far top corner
  for(let y=H-2;y<H;y++)g[y][1]='.';
  g[H-1][1]='0';
  g[1][W-2]='.';g[0][W-2]='1';
  const rows=g.map(r=>r.join('').replace(/#/g,'w'));
  const decor=[],enemies=[],items=[];
  const free=(x,y)=>rows[y][x]==='.';
  const cell=(x,y)=>({k:'bones',x,y,block:false,walk:true});
  for(let i=0;i<40;i++){const x=1+((rng()*(W-2))|0),y=1+((rng()*(H-2))|0);if(free(x,y)&&Math.abs(x-1)+Math.abs(y-H+2)>6)decor.push(cell(x,y))}
  const types=['skel','skel','ghost','scorpion','bat','skel','ghost','mummy'];
  for(let i=0;i<13;i++){let x,y,t=0;do{x=1+((rng()*(W-2))|0);y=1+((rng()*(H-4))|0);t++}while((!free(x,y)||Math.abs(x-1)+Math.abs(y-H+2)<10)&&t<80);if(free(x,y))enemies.push({t:types[i%types.length],x,y,lvl:16})}
  for(const [x,y] of [[5,6],[17,5],[30,11],[7,19],[22,22],[34,24]])if(free(x,y))decor.push({k:'chest',x,y,block:true,deco:false});
  for(const [x,y] of [[3,8],[19,3],[27,13],[10,21],[25,24],[37,27]])if(free(x,y))items.push({k:'potion',x,y});
  return {rows,start:{x:1,y:H-2,f:0},decor,enemies,items,W,H};
}
function khBuildStudy(){
  const W=15,H=11,g=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=(y===0||x===0||x===W-1||y===H-1)?'w':'.';g.push(r)}
  g[H-1]=g[H-1].slice(0,7)+'0'+g[H-1].slice(8);
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  for(const x of [1,2,3,11,12,13])put('bookcase',x,1);
  put('table',7,4);put('chair',6,4);put('chair',8,4);put('candle',2,5);put('candle',12,5);put('brazier',3,8);put('brazier',11,8);put('chest',13,8);put('cushions',1,6);put('maptable',12,3);
  decor.push({k:khFaceKey('kh_npc6_4'),x:7,y:2,block:true,npc:'kh_ishkander',sc:1});
  return {rows:g,start:{x:7,y:H-2,f:0},decor,lights:[[3,2],[11,2],[7,5],[3,8],[11,8]]};
}
/* ---- the tunnel to the Narrow Sea: a short, bright cave ending at the shore ---- */
function khBuildSeaTunnel(){
  const W=31,H=19,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const cut=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  cut(14,15,16,17);cut(14,11,24,13);cut(22,6,24,13);cut(10,4,24,6);cut(6,2,10,8);cut(2,1,8,3);cut(1,1,3,10);
  g[H-1][15]='0';
  const rows=g.map(r=>r.join('').replace(/#/g,'w'));
  const decor=[{k:'dbones',x:12,y:5,block:false,walk:true},{k:'dbones',x:23,y:9,block:false,walk:true},{k:'dobelisk',x:3,y:8,block:true,deco:true,sc:.7}];
  return {rows,start:{x:15,y:H-2,f:0},decor,lights:[[15,16],[18,12],[23,8],[16,5],[8,3],[2,5]],W,H};
}
let KH_WORLD_DONE=false;
function khBuildWorld(){
  if(KH_WORLD_DONE)return;KH_WORLD_DONE=true;
  const wall=khInteriorWall('palace'),back=(to,x,y,f)=>({to,x,y,f,tex:'in'});
  const pal=khBuildPalace();
  LEVELS[KH_PALACE]={rows:pal.rows,start:pal.start,enemies:[],items:[],decor:pal.decor,day:0,amb:.72,floor:'kh2',ceil:'beam',name:'The Palace of Khemetra',label:'Palace',lights:pal.lights,portals:[back(44,KH_PALACE_FRONT.x,KH_PALACE_FRONT.y,KH_PALACE_FRONT.f)],diff:16,chars:wall?{w:wall}:undefined};
  const cis=khBuildCisterns();
  LEVELS[KH_CISTERN]={rows:cis.rows,start:cis.start,enemies:cis.enemies,items:cis.items,decor:cis.decor,day:0,amb:.28,floor:'kh3',ceil:'beam',name:'The Cisterns beneath Khemetra',label:'Cisterns',lights:[[1,28],[11,27],[21,16],[31,5],[39,2]],portals:[back(44,KH_HATCH.x,KH_HATCH.y+1,2),back(KH_STUDY,7,9,0)],diff:17,noExtras:true,chars:{w:khInteriorWall('cellar')||undefined}};
  if(!LEVELS[KH_CISTERN].chars.w)delete LEVELS[KH_CISTERN].chars;
  const st=khBuildStudy();
  LEVELS[KH_STUDY]={rows:st.rows,start:st.start,enemies:[],items:[],decor:st.decor,day:0,amb:.7,floor:'kh2',ceil:'beam',name:"Ishkander's Study",label:'The Wizards Study',lights:st.lights,portals:[back(KH_CISTERN,KH_CIST_END.x,KH_CIST_END.y,2)],diff:17,chars:wall?{w:wall}:undefined};
  const tn=khBuildSeaTunnel();
  LEVELS[KH_SEATUNNEL]={rows:tn.rows,start:tn.start,enemies:[],items:[],decor:tn.decor,day:.55,amb:.55,floor:'sand',ceil:'cloud',name:'The Tunnel to the Narrow Sea',label:'Sea Tunnel',lights:tn.lights,portals:[back(62,KH_SEA_MOUTH.x,KH_SEA_MOUTH.y+1,2)],diff:20,noExtras:true,seaTunnel:true};
}
const KH_PALACE_FRONT={x:200,y:206,f:2},KH_HATCH={x:108,y:112},KH_CIST_END={x:39,y:2},KH_SEA_MOUTH={x:292,y:150};
// the mouth of the tunnel to the sea stands in the east of the Violet Erg from the start
(function(){const V=LEVELS[62];if(V){V.decor=V.decor||[];V.decor.push({k:'dburrow',x:KH_SEA_MOUTH.x,y:KH_SEA_MOUTH.y,block:true,enter:{to:KH_SEATUNNEL,x:15,y:17,f:0}})}})();
