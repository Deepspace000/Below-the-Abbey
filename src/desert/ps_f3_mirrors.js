/* ==========================================================================
   THE PALE SPIRE, THIRD FLOOR, PART ONE: THE HALL OF MIRRORS (level 9880, 56 x 40, indoor, rating 106; prefix psf3 / PSF3).
   The swirling door of the second floor lands in the Entry (28,36). North of it is the nave of mirrors, a long hall lined with painted mirrors and shades.
   East: the Beam Room. A lamp throws a beam east; three mirror posts (touch one to turn it between / and \) must carry it east, south, east, south to the crystal at (49,23).
   When the crystal is lit the Silver Seal at (45,26) lets go and the Reliquary behind it (a chest) can be reached.
   West: the Court of Glass, with a maiden whose hand mirror shows a room that is not there; the way through it leads to a hidden closet and a chest.
   South-east: a quiet room to rest. North (28,7): the stair to the Observatory Gallery, opened by the crystal (see ps_f3_observatory.js).
   ========================================================================== */
const PSF3={ID:9880,W:56,H:40,WH:3.2,
  LAMP:[41,14],TARGET:[49,23],SEAL:[45,26],SEAL_DIR:[0,0],
  POSTS:{a:[45,14],b:[45,20],c:[49,20],d:[41,20]},SOLVE:{a:'\\',b:'\\',c:'\\'},
  BOX:[40,12,50,24]};
function psf3F(){const P=(G.flags.psp=G.flags.psp||{});return P.f3||(P.f3={m:{a:'/',b:'/',c:'/',d:'/'},beam:0,hidden:0,seen:0})}
/* the beam: from the lamp east, reflected by the posts, until a wall, the crystal or the room's edge */
function psf3Trace(){const F=psf3F(),B=PSF3.BOX;let x=PSF3.LAMP[0],y=PSF3.LAMP[1],dx=1,dy=0,hits=0;const at={};for(const k in PSF3.POSTS)at[PSF3.POSTS[k][0]+','+PSF3.POSTS[k][1]]=k;
  for(let i=0;i<80;i++){x+=dx;y+=dy;if(x<B[0]||x>B[2]||y<B[1]||y>B[3])return {hits,end:'wall'};
    if(x===PSF3.TARGET[0]&&y===PSF3.TARGET[1])return {hits,end:'crystal'};
    const k=at[x+','+y];if(k){hits++;const s=F.m[k];const nx=s==='\\'?dy:-dy,ny=s==='\\'?dx:-dx;dx=nx;dy=ny}}
  return {hits,end:'wall'}}
function psf3Solved(){return !!psf3F().beam}
function psf3Apply(){
  if(LEVEL!==PSF3.ID||!G.decor)return;const F=psf3F();
  for(const d of G.decor){
    if(d.npc==='psf3_seal'){d.hidden=!!F.beam;d.found=!!F.beam;d.block=!F.beam}
    if(d.npc==='psf3_crystal'){/* the crystal stays; its text changes with the beam */}}}
/* ---------- the level ---------- */
function psf3Build(info){
  const W=PSF3.W,H=PSF3.H,id=PSF3.ID;
  try{gyAlias();if(typeof pshPics==='function')pshPics()}catch(e){}
  const C=pspMake({id,W,H,start:{x:28,y:36,f:0},floor:'flag',wh:PSF3.WH,amb:.34,lcol:PSH_COL.cold,kind:'in'});
  const {rows}=C;
  C.room(20,8,36,29,{floor:'flag',name:'The Hall of Mirrors',at:[28,16]});
  C.room(24,30,32,37,{floor:'flag',name:'The Entry',at:[28,34]});
  C.room(40,12,50,24,{floor:'flag',name:'The Beam Room',at:[45,18]});
  C.room(6,12,16,24,{floor:'flag',name:'The Court of Glass',at:[11,18]});
  C.room(38,30,44,35,{floor:'flag',name:'The Silvered Alcove',at:[41,32]});
  C.carve(37,18,39,18);C.carve(17,18,19,18);C.carve(33,33,37,33);
  C.room(3,29,8,33,{floor:'flag',name:'The Hidden Closet',at:[5,31]});
  // the reliquary behind the seal: a passage south of the beam room (45,25), the seal at (45,26), the room below
  C.carve(45,25,45,26);C.room(43,27,47,28,{floor:'flag',name:'The Reliquary',at:[45,28]});
  // ---- links: the swirling door back to the second floor ----
  C.links({});
  const pic=(n,x,y,wd,o)=>{const k=pspPic(n);if(!C.isOpen(x,y))return null;const bx=x+wd[0],by=y+wd[1];if(rows[by][bx]==='.')return null;return C.dec(k,x,y,Object.assign({wd,block:false},o||{}))};
  const cand=(x,y,col)=>{if(!C.free(x,y))return;C.cand(x,y,col||PSH_COL.cold)};
  // ---- the nave: mirrors down both walls, columns, banners ----
  const MIR=['mirror_haunted_a','mirror_haunted_b','mirror_haunted_c'];
  for(let y=10;y<=27;y+=2){pic(MIR[(y>>1)%3],20,y,[-1,0]);pic(MIR[((y>>1)+1)%3],36,y,[1,0])}
  for(const x of [23,26,29,32,35])pic(MIR[x%3],x,8,[0,-1]);
  for(const y of [11,15,19,23]){C.column(22,y,y%2?'twist':'fluted');C.column(34,y,y%2?'fluted':'twist')}
  for(const [x,y] of [[24,12],[32,12],[24,25],[32,25]])cand(x,y,[.75,.9,1.25]);
  C.light(28,10,[.9,1.05,1.4]);C.light(28,18,[1.1,1.1,1.3]);C.light(28,26,[.9,1.0,1.3]);
  // the north stair: shut
  {C.used.delete('28,8');const d=C.dec(pspPic('alcove_knight'),28,8,{block:true,npc:'psf3_stair'});if(d)d.sc=1}
  // a lectern in the nave with the riddle of the beam
  if(C.free(26,22)){C.used.delete('26,22');C.dec(pspPic('lectern'),26,22,{block:true,npc:'psf3_riddle'})}
  // ---- the beam room ----
  {const [lx,ly]=PSF3.LAMP;C.used.delete(lx+','+ly);C.dec(pspPic('candelabra_tall'),lx,ly,{block:true,npc:'psf3_lamp'});C.light(lx,ly,[1.6,1.5,1.2])}
  for(const k in PSF3.POSTS){const [x,y]=PSF3.POSTS[k];C.used.delete(x+','+y);C.column(x,y,'silver',{npc:'psf3_post_'+k});C.light(x,y,[.9,1.0,1.3])}
  {const [x,y]=PSF3.TARGET;C.used.delete(x+','+y);C.dec('gy_urn',x,y,{block:true,npc:'psf3_crystal',sc:1.1});C.light(x,y,[1.1,.9,1.5])}
  {const [x,y]=PSF3.SEAL;C.used.delete(x+','+y);const d=C.dec(pspPic('col_silver'),x,y,{block:true,npc:'psf3_seal',sc:1.15});if(d)d.sc=1.15}
  pic('mirror_haunted_a',40,15,[-1,0]);pic('mirror_haunted_c',50,16,[1,0]);pic('banner_long_a',44,12,[0,-1]);
  // ---- the Court of Glass ----
  for(const [x,y,wd] of [[7,12,[0,-1]],[11,12,[0,-1]],[6,15,[-1,0]],[6,21,[-1,0]],[16,15,[1,0]],[16,21,[1,0]],[8,24,[0,1]],[13,24,[0,1]]])pic(MIR[(x+y)%3],x,y,wd);
  {C.used.delete('11,16');C.dec(pspPic('alcove_maiden'),11,16,{block:true,npc:'psf3_hidden'})}
  cand(8,14,[.8,.95,1.3]);cand(14,22,[.8,.95,1.3]);C.light(11,18,[1.0,1.0,1.3]);
  if(C.free(9,22)){C.used.delete('9,22');C.dec(pspPic('lectern'),9,22,{block:true,npc:'psf3_court'})}
  // ---- the hidden closet and the reliquary: a chest each ----
  C.chest(7,31,{gold:2400,tier:1});C.chest(46,28,{gold:3200,tier:1});C.light(5,31,[1.4,1.1,.7]);C.light(45,28,[1.3,1.1,.8]);
  {C.used.delete('4,31');C.dec(pspPic('alcove_maiden'),4,31,{block:true,npc:'psf3_back'})}
  // the way into the closet: stepping through the maiden's mirror (see psf3_hidden) lands at (4,31)
  // ---- the quiet room ----
  pspRest(C,{x0:38,y0:30,x1:44,y1:35,bed:[40,31],chest:[43,34],name:'The Silvered Alcove',line:'A small quiet alcove with a silvered mirror on the wall. Warm candles burn here, and the shades in the hall cannot come in.'});
  // ---- creatures: shades in the nave and the court, none in the entry or the rest room ----
  pspSafeRect(C,24,30,32,37);
  for(const [t,x,y] of [['f2shadow',24,14],['f2shadow',32,16],['f2shadow',26,22],['f2hound',30,12],['f2shadow',33,26],['f2hands',22,26],['f2shadow',9,14],['f2shadow',14,19],['f2hound',8,22]])pspFoe(C,t,x,y,{lvl:106});
  C.glow(6.5,PSH_COL.cold);
  const lv=C.finish({start:{x:28,y:36,f:0}});
  return lv}
pspRegister(PSF3.ID,psf3Build);
/* ---------- the things to touch ---------- */
khNpc('psf3_stair','The stair to the Observatory','gy_urn',()=>{const F=psf3F(),l=PSP.LINKS.find(k=>k.from===PSF3.ID&&k.to===9881);
  if(!F.beam)return say("A stair of black glass goes up behind a carved door. The door is shut fast with a ring of silver light. Writing on the lintel reads: THE LIGHT THAT OPENS THE SEAL OPENS THIS. The door will open when the crystal in the Beam Room, east of the hall, is lit.",[BYE]);
  return say("The ring of silver light on the door has gone out. A stair of black glass goes up into the dark, toward the Observatory Gallery.",[
    ['Climb the stair.',()=>{G.talk=null;const q=l?pspLandOf(l):[28,40,0];sfx('door');goToLevel(9881,{x:q[0],y:q[1],f:q[2]});return null}],BYE])});
khNpc('psf3_riddle','A lectern in the nave','ps_lectern',()=>say("A heavy page lies open on the lectern, written in a mirror hand. It reads: THE LAMP IN THE EAST ROOM SPEAKS EAST. THE FIRST MIRROR TURNS IT SOUTH. THE SECOND TURNS IT EAST. THE THIRD TURNS IT SOUTH, AND IT RESTS ON THE CRYSTAL. A MIRROR LEANS EITHER \\ OR /. THE FOURTH MIRROR IS A LIAR.",[BYE]));
khNpc('psf3_lamp','The lamp','gy_urn',()=>{const t=psf3Trace();return say("A tall silver lamp burns with a thin white flame. It throws a beam of light east along the middle of the room, straight as a ruled line. "+(t.end==='crystal'?"The beam arrives at the crystal.":(t.hits?"The beam strikes "+t.hits+" mirror"+(t.hits>1?'s':'')+" and then dies against a wall.":"It dies against the first wall it meets.")),[BYE])});
function psf3Post(k){const nm={a:'The first mirror',b:'The second mirror',c:'The third mirror',d:'The fourth mirror'}[k];
  khNpc('psf3_post_'+k,nm,'gy_urn',()=>{const F=psf3F(),cur=F.m[k];return say(nm+" is a tall oval of silver glass on a post. It leans like a "+(cur==='\\'?'backslash, \\':'slash, /')+". You could turn it.",[
    ['Turn the mirror.',()=>{const F=psf3F();F.m[k]=cur==='\\'?'/':'\\';sfx('door');G.talk=null;const t=psf3Trace();
      if(t.end==='crystal'&&!F.beam){F.beam=1;try{f2Chime('open')}catch(e){}msg('The beam leaps from mirror to mirror and strikes the crystal. A deep note rings through the Beam Room, and the Silver Seal lets go.','#e0f0ff');psf3Apply()}
      else if(t.end!=='crystal'&&F.beam){F.beam=0;msg('The beam slips off the crystal. The note dies, and the Silver Seal closes again.','#c8c4e0');psf3Apply()}
      else msg('You turn the mirror to lean like a '+(F.m[k]==='\\'?'backslash, \\':'slash, /')+'. The beam strikes '+t.hits+' mirror'+(t.hits===1?'':'s')+(t.end==='crystal'?' and rests on the crystal.':' and dies against a wall.'),'#c8c4e0');return null}],BYE])})}
for(const k of ['a','b','c','d'])psf3Post(k);
khNpc('psf3_crystal','The crystal','gy_urn',()=>say(psf3Solved()?"The crystal burns with the beam, white and steady. Under it the stone hums.":"A crystal the size of a fist sits on a stone, dark and clear. It waits for the beam.",[BYE]));
khNpc('psf3_seal','The Silver Seal','ps_col_silver',()=>say("A pillar of silver stands in the narrow passage south of the Beam Room, with a seal of light across it. It will not let you by. A line of writing on its base says: LIGHT OPENS WHAT HANDS CANNOT.",[BYE]));
khNpc('psf3_court','The lectern in the Court of Glass','ps_lectern',()=>say("A plaque reads: THE COURT OF GLASS. THE SOVEREIGN COMES HERE TO SEE HERSELF. NOTHING ELSE IN THE ROOM IS EVER WHAT IT LOOKS LIKE. LOOK AT THE MAIDEN'S MIRROR IF YOU DARE.",[BYE]));
khNpc('psf3_hidden',"The maiden's mirror",'ps_alcove_maiden',()=>{const F=psf3F();
  return say("A statue of a maiden holds up a hand mirror. In the glass you see a small room with a chest in it, a room that is not behind this wall. The glass is cold, and it is slightly open, like a door.",[
    [F.hidden?'Step through again.':'Step through the glass.',()=>{G.talk=null;F.hidden=1;sfx('door');f2MoveTo([5,31,0]);msg('You step through the mirror into a small closet of silver mirrors.','#e0f0ff');return null}],BYE])});
/* a way out of the closet: the mirror on the closet wall */
khNpc('psf3_back','The closet mirror','ps_alcove_maiden',()=>say("The mirror on the wall of the closet shows the Court of Glass. It is cold, and slightly open.",[['Step back through.',()=>{G.talk=null;sfx('door');f2MoveTo([12,17,1]);return null}],BYE]));
pspOnArrive(n=>{if(n===PSF3.ID)try{psf3Apply();const F=psf3F();if(!F.seen){F.seen=1;msg('The swirling door closes behind you. The air smells of polished glass, and every wall shows you a hall that is a little longer than this one.','#d8d4f0')}}catch(e){console.error('psf3 arrive',e)}});
/* the links: the swirling door lands in the Entry now that the floor has a real first room */
for(let i=PSP.LINKS.length-1;i>=0;i--){const l=PSP.LINKS[i];if((l.from===9820&&l.to===9880)||(l.from===9880&&l.to===9820))PSP.LINKS.splice(i,1)}
PSP_L(9820,null,9880,[28,36,0],{name:'the swirling door to the Third Floor'});
PSP_L(9880,[28,38],9820,[50,5,3],{name:'back through the swirling door'});
