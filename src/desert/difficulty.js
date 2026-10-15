/* ==========================================================================
   GAMEPLAY: AUTOSCALING AND THE LADDER OF LEVELS.
   By default the world scales to the party (see rebalanceEnemies). In Menu > Gameplay autoscaling can be turned off. Then every place has
   a fixed level, a ladder that rises by about two levels for each place the story leads to, creatures stand at that level (with the usual
   mix of some lower), the great creatures stand a few levels above it, and the world map shows each place's level.
   The ladder only applies with autoscaling off; with it on, the places keep their old difficulty and the party is met by scaled creatures.
   ========================================================================== */
const LEVEL_LADDER=[ // [levels of the game that make up a place, its level]
  [[1],1],[[2,23],3],[[3,4,5,6,9,12,29],3],[[7,25],5],[[8],7],[[10,24],9],[[11],11],
  [[13,14,15,16,17,30],13],[[18],15],[[21],17],[[20],19],[[19,26,28],21],[[22,27],23],
  [[32],25],[[33,34,35,36,37,38],25],
  [[41],27],[[50,51,52,53,54,55,56,57,58,59],28],[[42],29],[[43],29],[[64],31],[[60],31],[[63],33],[[61],35],[[62],37],
  [[44,199,261],39],[[260],41],[[266],43],[[289],45],[[290,291,292,293,294,295,296,297,298,299],45],
  [[300],47],[[320],48],[[301],49],[[321],50],[[302],51],[[322],52],[[303],53],[[323],54],[[330],55],
  [[331,332,333,335],56],[[334,336,337,339],57],[[338,340,341],58],[[342],59],[[343],60],
  [[304],61],[[305,307,308,309,310],62],[[306],63]
];
const LEVEL_RATING={};
for(const [ls,r] of LEVEL_LADDER)for(const l of ls)LEVEL_RATING[l]=r+3;   // the whole ladder stands three levels higher than the table below
const autoscaleOn=()=>!G.flags.noScale;
// the level of a place on the world map: the lowest and highest of its levels that have one
function locRating(loc){let lo=1e9,hi=-1;for(const v of loc.lv){const r=LEVEL_RATING[v];if(r!==undefined){lo=Math.min(lo,r);hi=Math.max(hi,r)}}return hi<0?null:(lo===hi?String(lo):lo+'-'+hi)}
function drawGameplay(){
  BTNS=[];veil(.6);bigPanel(70,24,340,272);
  txt('GAMEPLAY',240,44,14,'#d8c88e','center',true);
  const on=autoscaleOn();
  btnText('gp_scale','Autoscaling:  '+(on?'ON':'OFF'),140,64,200,28);
  const lines=on?[
    'Creatures scale to the party. A party that has outgrown a place meets its creatures raised to within a few levels of itself, and the great creatures always stand above the party.',
    'Turn autoscaling off for a fixed world: every place has its own level, rising as the story goes on, and each level is shown on the world map. You will meet creatures that are too strong for you, and too weak.'
  ]:[
    'The world is fixed. Every place has its own level, rising by about two for each place the story leads to, and the level of each place is shown on the world map.',
    'Creatures stand at the level of the place (some a little lower, as ever), and the great creatures a few levels above it. If a place is too hard for the party, go elsewhere and come back stronger.'
  ];
  let y=110;for(const p of lines){for(const l of wrapText(p,300,8.4)){txt(l,240,y,8.4,'#cdbf94','center');y+=11}y+=8}
  const r=LEVEL_RATING[LEVEL];
  txt(on?'Autoscaling is on.':(r?'This place is level '+r+'.':'This place has no fixed level.'),240,y+6,9,'#e8c878','center',true);
  btnText('gp_back','Back',190,260,100,24);
}
(function(){const _b=handleBtn;handleBtn=function(id){
  if(G.menu==='gameplay'){if(id==='gp_back'||id==='menu')G.menu=true;else if(id==='gp_scale'){G.flags.noScale=G.flags.noScale?0:1;try{rebalanceEnemies()}catch(e){}msg(G.flags.noScale?'Autoscaling is off. The world is fixed.':'Autoscaling is on.','#e8d8a0')}return}
  _b(id)}})();
