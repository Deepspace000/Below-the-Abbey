/* ==========================================================================
   WENLOCK: THE QUIET CHAPEL (prefix WLCH). A little stone chapel in the quiet north-west corner of the town, three squares by three (x 7 to 9, y 20 to 22), with its door on the south
   at (8,22) and a footpath of gravel from Churchyard Lane (8,31) up to the door (8,23). Inside (room 7095, WLX.CHAPEL): an altar, two stained glass panels, a stand of votive candles
   that glow, a few pews, a bookstand, and Sister Agnes, who keeps it. She has one small quest (wlq15, A Candle for Saint Wenna): fetch the chapel candle from Wick the chandler in
   Mill Lane, and light it on the votive stand.
   ========================================================================== */
const WLCH={x0:7,x1:9,y0:20,y1:22,door:[8,22],front:[8,23]};
/* ---- the outside ---- */
function wlcPass(C){
  const {rows,ch,TM,hs}=C,sty='flint',wh=2.6,mk=k=>TM.make(k,sty,wh);
  // clear the ground: the block, a margin round it, and the footpath
  const clear=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(d.x===x&&d.y===y&&!/^sign_/.test(d.k))C.decor.splice(i,1)}
    for(let i=C.scenery.length-1;i>=0;i--){const s=C.scenery[i];if(Math.floor(s.wx)===x&&Math.floor(s.wy)===y)C.scenery.splice(i,1)}}};
  clear(5,18,11,24);clear(8,23,8,31);C.used.delete('8,31');
  // walls: stone, stained glass in the sides, a rose over the back, and the door
  const plain=mk('plain').gid,glass=(s,k)=>wlgTile(plain,'cw'+s+k,(x,w,h)=>{wlgBand(x,w,h);wlgWindow(x,64,h-84,44,150,s,k,s+k)});
  const rose=wlgTile(plain,'cr',(x,w,h)=>{wlgBand(x,w,h);wlgRose(x,64,h-190,36,2,7)});
  const butt=wlgTile(plain,'cb',(x,w,h)=>{wlgBand(x,w,h);wlgButtress(x,w,h,40)});
  const dt=mk('door'),dg=wlwDoorGid(dt.tex,WLX.CHAPEL);
  const put=(x,y,g)=>{rows[y][x]=ch(g);C.block[y*C.W+x]=1};
  for(let y=WLCH.y0;y<=WLCH.y1;y++)for(let x=WLCH.x0;x<=WLCH.x1;x++)put(x,y,plain);
  put(7,22,glass(1,1));put(8,22,dg);put(9,22,glass(4,2));put(7,21,glass(0,0));put(9,21,glass(3,1));put(8,21,butt);put(7,20,butt);put(8,20,rose);put(9,20,butt);
  C.sky.push({x:8.5,y:21.5,k:wlRoofFor('slate'),w:3.7,z:wh-.03});
  // the footpath of gravel, lamps, yews, flowers and a bench
  C.setF(8,23,8,30,'3');
  for(const [x,y] of [[7,25],[9,28]])C.lamp(x,y);
  for(const [x,y] of [[6,21],[10,21],[6,24],[10,24]])C.tree(x,y,'ltree12');
  for(const [x,y] of [[7,24],[9,24],[7,27],[9,26],[7,29],[9,30]])C.flowers(x,y,1.15);
  C.tryDc('kh_ohgard1_3',9,23);for(let y=23;y<=30;y++)C.used.add('8,'+y);
  C.decor.push({k:'sign_wlst',x:7,y:23,block:false,wd:[0,-1],txt:['THE QUIET CHAPEL','All are welcome'],sc:.85});
  wlnPost(C,9,31,[[[-1,0],'TO THE QUIET CHAPEL','The footpath north'],[[0,1],'CHURCHYARD LANE','East to Church Lane']],'A signpost at the start of a footpath. TO THE QUIET CHAPEL, north up the gravel. Churchyard Lane runs on east to Church Lane.');
  // on the map
  C.houses.push({x0:WLCH.x0,x1:WLCH.x1,y0:WLCH.y0,y1:WLCH.y1,face:'S',door:WLCH.door,front:WLCH.front,wall:[0,-1],out:2,sty:'flint',rk:'slate',sp:null,id:WLX.CHAPEL,w:3,num:0});
  WL_MAPX.push({t:'The Quiet Chapel',x:8,y:18,k:'place'});
}
const WL_MAPX=[];
/* ---- the inside ---- */
WLIR('chapel',{w:7,h:7,look:'church',amb:.46,lights:[[3,2],[1,3],[5,3],[3,5]],keeper:[3,2],
  props:[['altar',3,1],['glasswin',1,1],['glasswin',5,1],['votive',1,3,{npc:'wlc_votive'}],['votive',5,3,{npc:'wlc_votive2'}],['pew',2,4],['pew',4,4],['pew',2,5],['pew',4,5],['lectern',5,5,{npc:'wlc_book',h:.8}]],
  folk:[['wli_church_cat',1,5]],win:[[2,0],[4,0],[0,3],[6,3]],raw:[]});
khNpc('wlc_sister','Sister Agnes, keeper of the chapel','wl2_folk2_3',()=>yrLines('wlc_sister',[
  "Peace to you. It is a very small chapel and very quiet. People come in to be quiet, and I stay to make sure it stays that way.",
  "I have kept this chapel for thirty years. In that time two people have shouted in it. One of them was a goose.",
  "Saint Wenna was a shepherdess who sat in a field for a week without saying a word, and a spring came up where she sat. We take the hint."]),{sc:1});
KH_LAZY[WLX.CHAPEL]=()=>{if(!LEVELS[WLX.CHAPEL])wlmMake(WLX.CHAPEL,'chapel','The Quiet Chapel',[8,23],2,'wlc_sister')};
khNpc('wlc_votive','A stand of votive candles','wl2_church_5',d=>{const F=wlF();
  if(qSt('wlq15')==='active'&&F.wlq15a&&!F.wlq15b){F.wlq15b=1;yrStep('You have lit the candle on the votive stand.');return say("You set the chapel candle in the middle of the dark stand and light it from the one beside. The flame leans, steadies, and stands up straight. The whole chapel goes a little warmer, and a little quieter, which you would not have thought possible.",[BYE])}
  return say(F.wlq15b?'A stand of little flames. In the middle one burns the chapel candle, bright and steady.':'A stand of votive candles. Most are lit. A gap in the middle row is waiting for a candle.',[BYE])},{sc:1});
khNpc('wlc_votive2','Votive candles','wl2_church_5',()=>say('Little flames in a row, each one somebody\'s quiet wish. They smell of warm wax.',[BYE]),{sc:1});
khNpc('wlc_book','A hymn book on its stand','wl2_church_4',()=>say("A hymn book, open at the harvest hymn. Someone has marked a verse in pencil and written beside it: too fast. Beside that, in another hand: you try it.",[BYE]),{sc:1});
/* ---- the quest ---- */
Object.assign(WL_REW,{wlq15:{gold:900,xp:9000,items:['potion5']}});
WL_QUESTS.push({id:'wlq15',giver:'Sister Agnes',title:'A Candle for Saint Wenna',desc:'The votive stand in the quiet chapel has gone dark. Fetch the chapel candle from Wick the chandler in Mill Lane and light it.'});
const WLD15=khQD("Peace to you. I have a small trouble, and a small chapel to go with it. The stand of votive candles has gone dark, all but the one in the middle row, which has a gap in it, because the candle that stood there has burned down to a puddle. Wick the chandler in Mill Lane makes the only candles that burn without sulking. Would you fetch one for me? Ask him for the chapel candle. And then light it yourself, if you would. My knees are not what they were, and the stand is a long way down.",
  "Thank you. Mill Lane, the chandlery, the door with the fan of coloured glass over it. Tell him it is for the chapel and he will charge you only twice what it is worth.",
  (n,m)=>wlF().wlq15a?'Wick has given you the chapel candle. Light it on the stand of votive candles, to the left of the altar.':'Ask Wick the chandler in Mill Lane for the chapel candle, then light it on the votive stand in the chapel.',
  "It is lit? I could feel it from here. A chapel can tell, you know. It goes a little less cold.",
  "Thank you. It is a very small thing and I shall not forget it. Take this, with the thanks of Saint Wenna, who said nothing for a week and meant it.",
  "The candle burns, the chapel is warm, and I have not had to climb the steps. You are always welcome here.","The candle is lit.");
wlQ('wlq15','Sister Agnes',[["Ask Wick the chandler, in Mill Lane, for the chapel candle.",()=>wlF().wlq15a,['wli_k_chandler']],["Light the chapel candle on the votive stand in the Quiet Chapel.",()=>wlF().wlq15b,['wlc_votive']]]);
wlGive('wlc_sister','wlq15','wlq1',WLD15);
wlTalk('wli_k_chandler','wlq15','wlq15a','Wick has given you the chapel candle.',"The chapel candle? For Sister Agnes? Of course. Here, the one with the very straight wick, wrapped in cloth. Tell her I did not charge her twice. Tell her I only thought about it.");
