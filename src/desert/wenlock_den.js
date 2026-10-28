/* ==========================================================================
   WENLOCK: OLD BRACKEN'S DEN (prefix wld / WLD). The hermit's den in the north-east corner of the town (the painted rock mound at (89,6), Old Bracken stands in front of it at (88,7))
   now has a real door in it, behind the painted picture (a hidden block of rock, as under the mill). The door leads into room 7097 (a free number in the Wenlock room range 7000 to 7099):
   a tiny maze, 15 by 15 squares, lit by a few candle lights, with one room at the end. In the room a book stands on a lectern. Reading it teaches Intelligence: the book asks
   "Add 1 Intelligence point. Which character gets the point?" and the party picks one hero, who gains +1 INT for good (h.int is saved with the game and level-ups only add to it).
   The book is used up (G.flags.wldBook = 1, so it works with old saves) and crumbles. If the party walks away without choosing, the book stays.
   The maze has no enemies. Bracken stays outside and never blocks the door (he stands one square to the left of the way in).
   Test link: ?town=brackenden&lvl=34 (outside the den). Tests: tools/bracken_den_test.py.
   ========================================================================== */
const WLD={ID:7097,door:[89,6],x0:89,x1:89,y0:5,y1:6,front:[89,7],W:15,H:15};
/* the maze: # wall, . floor, 0 the door out. The way in is at the bottom, the book room at the top (x 5 to 9, y 1 to 3, reached from the square (7,4)). Several dead ends. */
const WLD_MAZE=[
  '###############',
  '#...#.....#...#',
  '#.###.....#.###',
  '#.#.#.....#...#',
  '#.#.###.###.###',
  '#...#...#.#...#',
  '#.###.#.#.#.###',
  '#.....#.....#.#',
  '###.#####.###.#',
  '#...#.#.#.....#',
  '###.#.#.#######',
  '#...#...#.#.#.#',
  '###.#.###.#.#.#',
  '#.............#',
  '#######0#######'];
const WLD_LIGHTS=[[7,13],[3,13],[11,13],[1,13],[13,13],[7,11],[5,11],[1,11],[3,9],[1,7],[3,7],[5,5],[1,5],[3,5],[9,7],[11,7],[11,5],[9,9],[13,9],[7,7],[7,5],[7,2],[5,1],[9,1],[5,3],[9,3]];
const WLD_ROOM={x0:5,x1:9,y0:1,y1:3,book:[7,1]};
function wldF(){return G.flags||(G.flags={})}
/* ---- the outside: the rock mound gets a door. The picture stays; a hidden block of rock stands under it, with the door in its front. ---- */
function wldPass(C){
  const {rows,ch,TM}=C;
  const im=IMG.wd_rock0;if(!im)return;
  // take the old plain rock off the ground, and keep the ground in front of the door clear
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(d.k==='wd_rock0'&&d.x===89&&d.y===6)C.decor.splice(i,1)}
  // the hidden block: a rock face cut from the painted mound itself, low enough to stay behind the picture
  const wh=.9;
  const rock=wlwNew('denrock',wh,(x,w,h)=>{const iw=im.width,ih=im.height;x.fillStyle='#6c6454';x.fillRect(0,0,w,h);x.drawImage(im,iw*.08,ih*.42,iw*.22,ih*.5,0,0,w,h)});
  const dg=wlwDoorGid(T_TILE[rock],WLD.ID);
  for(let y=WLD.y0;y<=WLD.y1;y++)for(let x=WLD.x0;x<=WLD.x1;x++){
    if(C.block[y*C.W+x]&&rows[y][x]!=='.')continue;
    rows[y][x]=ch(x===WLD.door[0]&&y===WLD.door[1]?dg:rock);C.block[y*C.W+x]=1}
  C.sky.push({x:89.5,y:7.2,k:'wd_rock0',w:2.1,z:0,big:1});
  for(let y=WLD.y0-1;y<=WLD.y1+3;y++)for(let x=WLD.x0-1;x<=WLD.x1+1;x++)if(!(x===88&&y===7))C.used.add(x+','+y);
  if(typeof WL_MAPX!=='undefined')WL_MAPX.push({t:"Old Bracken's Den",x:89,y:4,k:'place'});
}
WLP_PASSES.push(['den',C=>wldPass(C)]);
/* ---- the book ---- */
const WLD_PAGE="A thick old book lies open on the lectern. It is a hermit's notebook about thinking slowly: how to sit still until a hard problem makes sense, how to hold a long list in your head, and how to remember a lesson after hearing it once. Whoever studies it properly will be wiser for the rest of their life. The pages are so old that the book can only be used once.";
function wldBookRoot(){
  const F=wldF();
  if(F.wldBook)return say('The lectern is bare. A little grey dust lies on it where the book was. Its pages have crumbled away.',[BYE]);
  return say(WLD_PAGE,[['Read on.',()=>wldPrompt()],['Close the book for now.',()=>null]]);
}
function wldPrompt(){
  const F=wldF();if(F.wldBook)return wldBookRoot();
  const opts=G.heroes.map((h,i)=>[HERO_DEF[i].name,()=>wldGive(i)]);
  opts.push(['Not yet.',()=>null]);
  return say('Add 1 Intelligence point. Which character gets the point?',opts);
}
function wldGive(i){
  const F=wldF();if(F.wldBook)return wldBookRoot();
  const h=G.heroes[i];if(!h)return null;
  F.wldBook=1;h.int=(h.int||0)+1;
  try{sfx('level')}catch(e){}
  msg(`${HERO_DEF[i].name} gains 1 Intelligence (now ${h.int}).`,'#ffe36a');
  return say(`${HERO_DEF[i].name} studies the book from the first page to the last, and gains 1 Intelligence. It is now ${h.int}. When ${HERO_DEF[i].name} closes the cover, the old pages crumble to dust.`,[BYE]);
}
khNpc('wld_book',"The hermit's book",'wl2_church_4',()=>wldBookRoot(),{sc:1});
/* ---- the rooms ---- */
function wldMake(){
  const b={id:'wldden',name:"Old Bracken's Den",room:'cellar',keeper:null,floor:FLOORS.wl2f1?'wl2f1':'wood',wallImg:IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0'};
  b.tpl=()=>({w:WLD.W,h:WLD.H,floor:b.floor,amb:.3,noExtras:true,lights:WLD_LIGHTS.map(p=>[p[0],p[1]]),build:C=>{
    for(const [x,y] of [[5,1],[9,1],[5,3],[9,3]])wlinProp(C,'votive',x,y,{npc:undefined});
    wlinProp(C,'lectern',WLD_ROOM.book[0],WLD_ROOM.book[1],{npc:'wld_book',h:.95});
  }});
  const R=khRoom(b,WLD.ID,{to:WL.ID,x:WLD.front[0],y:WLD.front[1],f:2});
  const L=R.level;
  L.rows=WLD_MAZE.slice();L.start={x:7,y:13,f:0};L.ceil='tomb';L.diff=80;L.noTele=true;
  LEVELS[WLD.ID]=L;LEVEL_NAMES[WLD.ID]="Old Bracken's Den";LEVEL_RATING[WLD.ID]=80;
  return L;
}
KH_LAZY[WLD.ID]=()=>{if(!LEVELS[WLD.ID])wldMake()};
LEVEL_NAMES[WLD.ID]="Old Bracken's Den";LEVEL_RATING[WLD.ID]=80;
