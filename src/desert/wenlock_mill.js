/* ==========================================================================
   WENLOCK: THE MILL, THE WINDMILL, THE BARN AND THE DOVECOTE (prefix wlm). The four painted buildings at the edges of the town used to be a picture on a slab with a door that did
   nothing. Now each door opens into a small room (levels 7092 mill, 7096 windmill, 7093 barn, 7094 dovecote), built with the same room data as every other Wenlock room (WLIR in
   wenlock_in.js). The doors in the town are made by wenlock_walls.js (WLX has the room numbers). The millstone and the stair are composed from the painted wood and stone textures
   of the rooms (wl2_floor_0 and wl2_floor_1), because there is no painted millstone yet.
   ========================================================================== */
Object.assign(WLIN_LOOK,{barn:{wall:'wl2_wall_1',floor:'wl2f4',ff:'floor_4',win:3},mill:{wall:'wl2_wall_3',floor:'wl2f1',ff:'floor_1',win:4},windmill:{wall:'wl2_wall_2',floor:'wl2f1',ff:'floor_1',win:5}});
Object.assign(WLIN_P,{millstone:['mill_0',1.15,0,0,'oven'],stair:['mill_1',1.5,0,0,'wardrobe']});
function wlmPieces(){
  if(IMG.wl2_mill_0||!IMG.wl2_floor_0)return;
  const pat=(x,im,tone)=>{try{return x.createPattern(im,'repeat')}catch(e){return tone}};
  IMG.wl2_mill_0=mkCanvas(256,256,(x,w,h)=>{
    const wood=pat(x,IMG.wl2_floor_0,'#6a4a28'),stone=pat(x,IMG.wl2_floor_1,'#8a8478');
    // the hopper: a wooden funnel that feeds the stones
    x.fillStyle=wood;x.beginPath();x.moveTo(70,14);x.lineTo(186,14);x.lineTo(150,84);x.lineTo(106,84);x.closePath();x.fill();x.strokeStyle='#2a1a0c';x.lineWidth=3;x.stroke();
    x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.moveTo(186,14);x.lineTo(150,84);x.lineTo(166,84);x.lineTo(194,14);x.closePath();x.fill();x.fillStyle='#d8cfa8';x.fillRect(76,14,104,8);
    // the running stone, with the furrows cut in its edge
    x.fillStyle=stone;x.beginPath();x.roundRect?x.roundRect(30,82,196,52,8):x.rect(30,82,196,52);x.fill();x.strokeStyle='#2a2620';x.lineWidth=3;x.stroke();
    const g=x.createLinearGradient(0,82,0,134);g.addColorStop(0,'rgba(255,250,230,.3)');g.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=g;x.fillRect(31,83,194,50);
    x.strokeStyle='rgba(30,26,20,.55)';x.lineWidth=1.4;for(let i=0;i<24;i++){const px=40+i*7.8;x.beginPath();x.moveTo(px,90);x.lineTo(px+6,126);x.stroke()}
    // the wooden casing round the bed stone, banded in iron
    x.fillStyle=wood;x.fillRect(22,130,212,112);x.fillStyle='rgba(30,16,6,.35)';x.fillRect(22,130,212,112);x.fillStyle=wood;x.globalAlpha=.55;x.fillRect(22,130,212,112);x.globalAlpha=1;
    x.strokeStyle='rgba(20,10,4,.6)';x.lineWidth=1.6;for(let i=1;i<9;i++){x.beginPath();x.moveTo(22+i*23.5,130);x.lineTo(22+i*23.5,242);x.stroke()}
    x.strokeStyle='#17140f';x.lineWidth=3;x.strokeRect(22,130,212,112);
    for(const by of [146,224]){x.fillStyle='#26262c';x.fillRect(20,by,216,9);x.fillStyle='#4a4a54';x.fillRect(20,by,216,2);x.fillStyle='#8a8a96';for(let i=0;i<8;i++){x.beginPath();x.arc(34+i*27,by+5,1.8,0,6.3);x.fill()}}
    // the spout and the flour that has come out of it
    x.fillStyle='#2a1a0c';x.fillRect(190,196,46,28);x.fillStyle='#3e2a16';x.fillRect(194,200,38,20);
    x.fillStyle='#f4efe4';x.beginPath();x.ellipse(60,242,52,14,0,Math.PI,0);x.fill();x.fillStyle='#e0d8c4';x.beginPath();x.ellipse(70,242,34,8,0,Math.PI,0);x.fill();
    x.fillStyle='rgba(255,252,240,.5)';for(let i=0;i<40;i++){x.fillRect(30+hash2(i,1,5)*190,100+hash2(i,2,5)*140,2+hash2(i,3,5)*3,2)}
  });
  IMG.wl2_mill_1=mkCanvas(150,256,(x,w,h)=>{
    const wood=pat(x,IMG.wl2_floor_0,'#6a4a28');
    for(const rx of [10,118]){x.fillStyle=wood;x.fillRect(rx,6,22,244);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(rx+16,6,6,244);x.strokeStyle='#17140f';x.lineWidth=2.4;x.strokeRect(rx,6,22,244)}
    for(let i=0;i<8;i++){const y=34+i*27,sh=i*2;x.fillStyle='#17140f';x.fillRect(30,y,90,24);x.fillStyle=wood;x.fillRect(31,y+1,88,13);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(31,y+14,88,9);x.fillStyle='rgba(255,235,190,.2)';x.fillRect(31,y+1,88,2)}
    x.fillStyle='#26262c';for(const by of [60,150,230]){x.fillRect(8,by,26,5);x.fillRect(116,by,26,5)}
  });
}
const WLM_FOLK=[
  ['wlm_miller','Dusty the miller, at his stones','kh_ohfolk4_3',["Mind the stones. They go round all day and do not care who is in the way. They have never once said sorry.","Wheat goes in the top and flour comes out at the bottom, and in between there is a noise like the end of the world. It is lovely.","The brook turns the wheel, the wheel turns the stones, and I turn up in the morning. That is the whole mill."],{sc:1}],
  ['wlm_boy','Wat, the miller\'s boy','wl2_folk1_3',["I carry the sacks. Some days the sacks carry me.","Dusty says a good miller can tell the wheat by the smell. I can tell it by the sneeze.","There is a rat in the loft who has a name, and the name is Gerald."],{sc:.8}],
  ['wlm_cat','The mill cat','wl2_home_2',["Mrr. (She is white with flour to the ears and walks away leaving small prints.)","Miaow. (She has caught nothing today. She has had help with that.)"]],
  ['wlm_cow','Buttercup, a cow','cow',["Moo. (She is chewing a long, slow thought.)","Moo. (She has looked at you for a long time and has decided you are not food.)"],{sc:1}],
  ['wlm_barncat','The barn cat','wl2_home_2',["Mrr. (She sits on the highest bale and judges the mice.)","Miaow. (There is straw in her fur and no worry in her heart.)"]],
  ['wlm_goat','A goat in the barn','kh_anim1_3',["Maaa. (He is eating the corner of a sack and looking at you while he does it.)","Maaa. (He wants it known that this is his barn.)"],{sc:.9}],
  ['wlm_dove1','A dove','kh_anim1_5',["Coo. (She is sitting on one egg and one very small grudge.)","Coo. (She looks at you with one orange eye, then the other.)"],{sc:.8}],
  ['wlm_dove2','A dove','kh_anim1_5',["Coo. (He puffs out his chest and walks in a circle, to show you the shape of the circle.)","Coo, coo. (He has found one seed and is making a speech about it.)"],{sc:.8}],
  ['wlm_dove3','A dove','kh_anim1_5',["Coo. (She is asleep on the ladder.)","Coo. (She opens one eye. It is the wrong eye for you.)"],{sc:.8}],
  ['wlm_stair','A steep wooden stair','wl2_mill_1',null],
  ['wlm_stone','The great millstones','wl2_mill_0',null]
];
for(const [id,n,face,lines,o] of WLM_FOLK){
  if(lines)khNpc(id,n,face,()=>yrLines(id,lines),o);
}
khNpc('wlm_stair','A steep wooden stair','wl2_mill_1',()=>say('A very steep wooden stair up to the loft. A board is nailed across it: LOFT FULL. Under that, in a different hand: RATS TOO. Under that, in a small neat hand: GERALD.',[BYE]),{sc:1});
khNpc('wlm_stone','The great millstones','wl2_mill_0',()=>say('The runner stone turns on the bed stone, and the grain falls between them. The grooves are cut fresh every autumn. A fine white dust lies over everything, and over you, after a minute.',[BYE]),{sc:1});
/* the rooms */
WLIR('mill',{w:11,h:8,look:'mill',amb:.6,lights:[[2,2],[8,2],[5,5]],keeper:[5,3],
  props:[['millstone',3,1,{npc:'wlm_stone'}],['millstone',7,1],['stair',9,1,{npc:'wlm_stair'}],['shelving',1,1],['bakertable',5,6,{h:.55}],['veg',9,5,{h:.55}],['waterbarrel',1,3]],
  folk:[['wlm_boy',8,4],['wlm_cat',3,5]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['sacks',1,5],['sacks',1,6],['sacks',10,3],['sacks',10,2],['sacks',9,6],['crate',1,4],['barrel',10,6]]});
WLIR('windmill',{w:7,h:7,look:'windmill',amb:.62,lights:[[2,2],[4,2],[3,4]],keeper:null,noExtras:0,
  props:[['millstone',2,1],['stair',5,1,{npc:'wlm_stair'}],['waterbarrel',1,4,{h:.55}]],
  folk:[['wlm_cat',4,4]],win:[[3,0],[0,3],[6,3]],raw:[['sacks',1,5],['sacks',2,5],['sacks',5,5],['crate',5,3]]});
WLIR('barn',{w:11,h:8,look:'barn',amb:.62,lights:[[2,2],[8,2],[5,5]],keeper:null,
  props:[['hangstand',2,1],['hangstand',8,1,{h:1.0}],['coopstack',1,5,{h:.8}],['coopstack',10,5,{h:.8}],['bakertable',5,1,{h:.5}]],
  folk:[['wlm_cow',4,4],['wlm_barncat',7,2],['wlm_goat',8,5]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['hay',4,1],['hay',6,1],['hay',1,2],['hay',10,2],['hay',1,6],['hay',10,3],['cart',8,3]]});
WLIR('dovecote',{w:7,h:7,look:'mill',amb:.66,lights:[[2,2],[4,2],[3,4]],keeper:null,
  props:[['shelving',1,1],['shelving',2,1],['shelving',4,1],['shelving',5,1],['stair',5,3,{npc:'wlm_stair',h:1.2}],['coopstack',1,5,{h:.55}]],
  folk:[['wlm_dove1',2,3],['wlm_dove2',3,5],['wlm_dove3',4,5],['wlm_dovestuck',5,4]],win:[[3,0],[0,3],[6,3]],raw:[['sacks',1,4],['crate',5,5]]});
/* one door of the town, one room */
function wlmMake(id,room,name,front,out,keeper){
  wlmPieces();try{wlTrimFoot('wl2_mill_0')}catch(e){}   // the millstone stands on the floor (its picture had empty rows under it)
  const b={id:'wlin'+id,wlin:room,name,room:'home',keeper:keeper||null,floor:'wood',wallImg:'kh_ohwall1_2'};
  const R=khRoom(b,id,{to:WL.ID,x:front[0],y:front[1],f:out});LEVELS[id]=R.level;LEVELS[id].diff=80;LEVEL_NAMES[id]=name;LEVEL_RATING[id]=80;return R.level;
}
KH_LAZY[WLX.MILL]=()=>{if(!LEVELS[WLX.MILL])wlmMake(WLX.MILL,'mill','Wenlock Mill',[79,87],0,'wlm_miller')};
KH_LAZY[WLX.WIND]=()=>{if(!LEVELS[WLX.WIND])wlmMake(WLX.WIND,'windmill','The Windmill',[86,88],0)};
KH_LAZY[WLX.BARN]=()=>{if(!LEVELS[WLX.BARN])wlmMake(WLX.BARN,'barn','The Barn',[63,17],0)};
KH_LAZY[WLX.DOVE]=()=>{if(!LEVELS[WLX.DOVE])wlmMake(WLX.DOVE,'dovecote','The Dovecote',[54,37],0)};
for(const id of [WLX.MILL,WLX.WIND,WLX.BARN,WLX.DOVE,WLX.CHAPEL]){LEVEL_NAMES[id]=LEVEL_NAMES[id]||'Wenlock';LEVEL_RATING[id]=80}
LEVEL_NAMES[WLX.MILL]='Wenlock Mill';LEVEL_NAMES[WLX.WIND]='The Windmill';LEVEL_NAMES[WLX.BARN]='The Barn';LEVEL_NAMES[WLX.DOVE]='The Dovecote';LEVEL_NAMES[WLX.CHAPEL]='The Quiet Chapel';
