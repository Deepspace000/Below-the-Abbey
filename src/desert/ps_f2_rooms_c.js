/* ==========================================================================
   ps_f2_rooms_c.js: the illusion rooms 6 and 7 of the Hall of Illusions. See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md. Built with f2Room (ps_f2_kit.js).
   9826 The Swamp (the heart): the witch's note by her cauldron asks for a toadstool, an eel and a clump of marsh moss; each lies at a spot marked with a red rag
        out in the swamp; put all three in the cauldron and the heart rises from the pot.
   9827 The Nightmare (the brain): four lanterns in a ring round a jar; the jar shows a sequence of four (the lanterns flare one after another, and say so);
        touch them in the same order. A wrong touch brings shadows and the sequence is shown again. Then the jar opens.
   ========================================================================== */
/* ---------- 6. THE SWAMP (9826): the heart ---------- */
const F2_SWAMP={HUT:[21,4,27,6],CAUL:[24,9],NOTE:[27,9],ING:[['toad','f2_toadstool',8,18,'a clump of red toadstools','The toadstool'],['eel','f2_eelpost',40,20,'a dead eel hanging from a hook on a post','The eel'],['moss','f2_moss',9,31,'a clump of bright green marsh moss on a flat stone','The marsh moss']]};
function f2SwampBuild(){
  const C=f2Room({id:9826,ground:'mud',path:'wl2f0',band:[1,4],wh:3.2,
    routes:[[[24,35],[24,27],[16,23],[16,14],[24,12],[24,10]],[[24,27],[34,24],[39,20]],[[16,18],[9,18]],[[22,31],[10,31]]],
    clear:[[17,3,31,11,'wwf_moss','The Witch\'s Hut',1],[4,14,12,22,'blf_mud','The Toadstool Ring',1],[35,15,43,24,'blf_mud','The Eel Pool',1],[5,27,14,34,'wwf_moss','The Moss Bank',1]],
    edge:(C,x,y)=>{if(C.E[y*48+x]<=8){C.water(x,y,'bogwater');return true}return false}});
  // the witch's hut (a painted front over a block of wall; its door is barred), the cauldron and the note before it
  const [hx0,hy0,hx1,hy1]=F2_SWAMP.HUT;
  try{pspDefringe('ps_f2_witchhut')}catch(e){}
  if(IMG.ps_f2_witchhut&&IMG.ps_f2_witchhut.width&&!IMG.ps_f2_witchhut._ps)C.picHouse({img:'ps_f2_witchhut',x0:22,y0:hy0,x1:26,y1:hy1,w:5.6,door:[24,hy1],wh:2.6});
  else C.house({x0:hx0,y0:hy0,x1:hx1,y1:hy1,face:'S',sty:'black',roof:'thatch2',wh:2.4});
  {const g=C.chars[C.rows[hy1][24]];if(g!==undefined)KH_DOOR[g]={psf2:'hutdoor'}}
  {const [cx,cy]=F2_SWAMP.CAUL;C.used.delete(cx+','+cy);C.dec('ww_cauldron',cx,cy,{block:true,npc:'f2m_cauldron',sc:1.1});C.light(cx,cy,[.7,1.4,.6])}
  {const [nx,ny]=F2_SWAMP.NOTE;C.used.delete(nx+','+ny);C.dec(pspPic('f2_notepost'),nx,ny,{block:true,npc:'f2m_note'})}
  for(const [x,y] of [[20,8],[28,8]])if(C.free(x,y))C.dec('ww_totem',x,y,{block:true,sc:.9});
  // the three marked spots
  for(const [k,pic,x,y] of F2_SWAMP.ING){C.used.delete(x+','+y);C.dec(pspPic(pic),x,y,{block:true,npc:'f2m_'+k});const sx=x+1,sy=y;if(C.open(sx,sy)){C.used.delete(sx+','+sy);C.dec(pspPic('f2_stake'),sx,sy,{block:false})}}
  // the swamp: dead trees hung with moss, willows, reeds, stumps; toadstool rings
  C.fill([pspPic('f2_swamptree'),'ww_willow','ww_oakmoss','f2i_bogwillow',pspPic('f2_swamptree'),pspPic('f2_stump')],{p1:.18,p2:.5,p3:.8});
  C.scrub([pspPic('f2_reeds'),'logm',pspPic('f2_reeds')],.05);
  C.capTrees(/swamptree|willow|oakmoss/,2.4);
  pspSafeZone(C,24,35,6);
  C.foes(['f2frog','f2leech','f2wisp'],[4,14,12,22],1);
  C.foes(['f2leech','f2leech','f2hag','f2troll'],[35,15,43,24],2);
  C.foes(['f2frog','f2wisp','f2hag'],[5,27,14,34],3);
  C.foes(['f2troll','f2wisp'],[28,26,44,36],4);
  for(const [x,y] of [[5,15],[42,16],[13,33]])C.chestAt(x,y,1);
  C.ret();
  return C.done({glow:7})}
pspRegister(9826,f2SwampBuild);
const f2SwampHas=k=>{const R=f2S(9826);return !!(R.got&&R.got[k])};
const f2SwampIn=k=>{const R=f2S(9826);return !!(R.in&&R.in[k])};
for(const [k,pic,x,y,desc,nm] of F2_SWAMP.ING)khNpc('f2m_'+k,nm,'ps_'+pic,()=>{const R=f2S(9826);R.got=R.got||{};
  if(R.got[k])return say('A red rag tied to a stake marks the place. There is nothing else here now.',[BYE]);
  return say('A red rag tied to a stake marks the place. Here is '+desc+'.',[['Take it.',()=>{R.got[k]=1;try{sfx('key')}catch(e){}msg('You take '+nm.toLowerCase()+'.','#ffe36a');f2SwampApply();G.talk=null;return null}],BYE])});
khNpc('f2m_note',"The witch's note",'ps_f2_notepost',()=>say("A note is nailed to a post beside the cauldron, in a crabbed hand: FOR THE HEART. ONE TOADSTOOL FROM THE RING. ONE EEL FROM THE POOL. ONE CLUMP OF MOSS FROM THE BANK. PUT ALL THREE IN THE POT. I HAVE MARKED EACH PLACE WITH A RED RAG.",[BYE]));
khNpc('f2m_cauldron',"The witch's cauldron",'ww_cauldron',()=>{const R=f2S(9826);R.in=R.in||{};
  if(R.solved&&psf2F().got.heart)return say('The cauldron has gone cold. The green broth at the bottom smells of nothing at all.',[BYE]);
  if(R.solved)return say('A pale heart floats on top of the green broth, beating slowly.',[["Take the Sleeper's Heart.",()=>{psf2Give('heart');G.talk=null;return null}],BYE]);
  const put=F2_SWAMP.ING.filter(([k])=>f2SwampHas(k)&&!f2SwampIn(k));
  const left=F2_SWAMP.ING.filter(([k])=>!f2SwampIn(k)).map(q=>q[5].toLowerCase().replace('the ',''));
  const opts=put.map(([k,,,,,nm])=>['Put in '+nm.toLowerCase()+'.',()=>{f2SwampPut(k);G.talk=null;return null}]);opts.push(BYE);
  return say('A black iron cauldron bubbles over a low fire, full of thin green broth. '+(left.length===3?'It needs three things, if the note on the post is right.':'Still needed: '+left.join(', ')+'.'),opts)});
function f2SwampPut(k){const R=f2S(9826);R.in=R.in||{};if(R.in[k]||!f2SwampHas(k)||R.solved)return;R.in[k]=1;f2Chime('ok',Object.keys(R.in).length);msg('You drop it into the pot. The broth hisses and turns a darker green.','#d0f0c0');
  if(F2_SWAMP.ING.every(([q])=>R.in[q])){R.solved=1;f2Chime('open');msg('The broth boils up green and white, then goes still. A pale heart rises to the top of the pot, beating slowly.','#ffe36a')}}
function f2SwampApply(){if(LEVEL!==9826)return;const R=f2S(9826);for(const [k,pic,x,y] of F2_SWAMP.ING)if(R.got&&R.got[k])f2Hide(pspPic(pic),x,y,true)}
f2OnArrive(9826,()=>f2SwampApply());
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='hutdoor'){sfx('locked');msg('The door of the hut is barred from the inside. The witch is not at home, and she does not want visitors.','#c8d0c0');return true}
  if(d&&d.psf2==='nightdoor'){sfx('locked');msg('The eyes on the door all turn to look at you. The door does not open. Behind it, something holds its breath.','#e0b0b0');return true}
  return _k.apply(this,arguments)}}
/* ---------- 7. THE NIGHTMARE (9827): the brain ---------- */
const F2_NIGHT={JAR:[24,7],LAMP:[[21,5,'north-west'],[27,5,'north-east'],[27,9,'south-east'],[21,9,'south-west']]};
function f2NightBuild(){
  const C=f2Room({id:9827,ground:'tombdark',path:'wl2f5',band:[1,4],wh:3.4,
    routes:[[[24,35],[24,27],[31,23],[31,15],[24,13],[24,11]],[[24,27],[14,25],[9,20]],[[31,19],[40,19]],[[22,31],[11,31]]],
    clear:[[17,2,31,12,'blood','The Ring of Lanterns',1],[4,15,13,24,'ash','The Doll Room',1],[35,14,44,24,'ash','The Hall of Eyes',1],[5,27,15,34,'blood','The Broken Clocks',1]],
    edge:(C,x,y)=>{const e=C.E[y*48+x];if(e<=5){const h=C.hs2(x,y,77);C.solid(x,y,C.ch(pspWallGid(h<.5?'dark':'moss',(h*7)|0,3.4)));return true}return false}});
  // the jar on its pedestal and the four lanterns round it
  {const [jx,jy]=F2_NIGHT.JAR;C.used.delete(jx+','+jy);C.dec(pspPic('f2_brainjar'),jx,jy,{block:true,npc:'f2n_jar'});C.light(jx,jy,[.6,1.1,.6])}
  F2_NIGHT.LAMP.forEach(([x,y],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_lantern_off'),x,y,{block:true,npc:'f2n_lamp'+i})});
  // the dark: dead trees full of eyes, warped clocks, dolls
  C.fill([pspPic('f2_eyetree'),'f2i_nightoak','f2i_nightthorn',pspPic('f2_eyetree'),'f2i_nightthorn'],{p1:.12,p2:.45,p3:.75});
  for(const [x,y] of [[6,16],[11,17],[8,22],[12,21],[5,20]])if(C.free(x,y))C.dec(pspPic('f2_doll'),x,y,{block:true});
  for(const [x,y] of [[7,28],[13,29],[10,33],[6,32]])if(C.free(x,y))C.dec(pspPic('f2_clock'),x,y,{block:true});
  C.scrub(['gy_bones',pspPic('f2_doll')],.02);
  C.capTrees(/eyetree|nightoak|nightthorn/,2.4);
  pspSafeZone(C,24,35,6);
  C.foes(['f2doll','f2doll','f2hands'],[4,15,13,24],1);
  C.foes(['f2horror','f2hound','f2shadow'],[35,14,44,24],2);
  C.foes(['f2shadow','f2hands','f2hound'],[5,27,15,34],3);
  C.foes(['f2shadow','f2horror'],[28,26,44,36],4);
  for(const [x,y] of [[5,16],[43,15],[14,33]])C.chestAt(x,y,1);
  C.ret();
  const lv=C.done({glow:9});
  // staring doors: a few black wall squares that face a square the party can stand on become doors covered in eyes (they never open)
  {const f=f2FacGid('ps_f2_eyedoor',0,1,3.4,{tex:'texBlack_1',fit:false,rgb:[.95,.9,.9]}),TB=TERRS[9827]&&TERRS[9827].block,bs=new Set(lv.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
   const stand=(x,y)=>lv.rows[y]&&lv.rows[y][x]==='.'&&!bs.has(x+','+y)&&!(TB&&TB[y*48+x]);
   if(f!=null)for(let y=3;y<37;y++)for(let x=3;x<45;x++){const c=lv.rows[y][x];if(c==='.'||C.hs2(x,y,77)>=.16||!(C.E[y*48+x]<=5))continue;const g0=lv.chars[c];if(g0!==undefined&&KH_DOOR[g0])continue;
     if(![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>stand(x+a,y+b)))continue;
     const g=KH_NEXT_GID++;T_TILE[g]=T_TILE[f];if(GY.col&&GY.col[f])GY.col[g]=GY.col[f];KH_DOOR[g]={psf2:'nightdoor'};const ch=C.ch(g);lv.chars[ch]=g;lv.rows[y]=lv.rows[y].slice(0,x)+ch+lv.rows[y].slice(x+1)}}
  for(const [x,y] of F2_NIGHT.LAMP){lv.lights.push([x,y]);lv._ps.lcol[x+','+y]=[.5,.25,.25]}
  return lv}
pspRegister(9827,f2NightBuild);
/* the sequence: four lanterns, drawn at random when the jar is asked, kept in the room's state; R.pos is how many have been touched back right */
function f2NightNew(){const R=f2S(9827),a=[0,1,2,3];for(let i=3;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}R.seq=a;R.pos=0;return a}
function f2NightLamp(i,on){if(LEVEL!==9827)return;const [x,y]=F2_NIGHT.LAMP[i];for(const d of G.decor||[])if(d.npc==='f2n_lamp'+i)d.k=pspPic(on?'f2_lantern_on':'f2_lantern_off');
  for(const l of LIGHTS||[])if(Math.floor(l.x)===x&&Math.floor(l.y)===y){l.col=on?[1.9,.5,.4]:[.5,.25,.25];l.kI=on?2.2:1.0}}
function f2NightShow(){const R=f2S(9827);if(R.solved)return;if(!R.seq)f2NightNew();R.pos=0;R.showing=1;const seq=R.seq.slice(),t0=Date.now();
  msg('Watch the lanterns.','#e0b0b0');
  seq.forEach((i,k)=>{setTimeout(()=>{f2NightLamp(i,true);f2Chime('ok',i);msg((k+1)+': the '+F2_NIGHT.LAMP[i][2]+' lantern flares red.','#f0c0c0')},900+k*1400);setTimeout(()=>f2NightLamp(i,false),900+k*1400+1000)});
  setTimeout(()=>{R.showing=0;msg('The lanterns are dark again. Touch them in the same order.','#e0b0b0')},900+seq.length*1400)}
khNpc('f2n_jar','A jar on a pedestal','ps_f2_brainjar',()=>{const R=f2S(9827);
  if(R.solved&&!psf2F().got.brain)return say('The lid of the jar has come loose. A pale brain floats in the murky water.',[["Take the Sleeper's Brain.",()=>{psf2Give('brain');G.talk=null;return null}],BYE]);
  if(R.solved)return say('An empty jar of murky water on a stone pedestal.',[BYE]);
  return say('A tall glass jar on a stone pedestal, full of murky green water. Something pale floats inside. The lid is held down by a ring of four iron clasps, one turned toward each of the four lanterns round it. Words are scratched on the pedestal: WATCH THE LANTERNS, THEN TOUCH THEM IN THE SAME ORDER.',[['Watch the lanterns.',()=>{f2NightShow();G.talk=null;return null}],BYE])});
F2_NIGHT.LAMP.forEach(([x,y,nm],i)=>khNpc('f2n_lamp'+i,'A lantern','ps_f2_lantern_off',()=>{const R=f2S(9827);
  if(R.solved)return say('An iron lantern on a tall black pole. It is cold and dark.',[BYE]);
  return say('The '+nm+' lantern: an iron lantern on a tall black pole, its glass dark.',[['Touch the lantern.',()=>{f2NightTouch(i);G.talk=null;return null}],BYE])}));
function f2NightTouch(i){const R=f2S(9827);if(R.solved)return;if(R.showing){msg('Wait until the lanterns are dark.','#e0b0b0');return}
  if(!R.seq){msg('The lantern stays dark. Ask the jar first: it shows the order.','#e0b0b0');return}
  if(R.seq[R.pos]===i){R.pos++;f2Chime('ok',i);f2NightLamp(i,true);setTimeout(()=>f2NightLamp(i,false),700);msg('The '+F2_NIGHT.LAMP[i][2]+' lantern flares. ('+R.pos+' of 4.)','#f0c0c0');
    if(R.pos>=4){R.solved=1;f2Chime('open');msg('All four lanterns blaze up at once, then go out. The clasps on the jar spring open.','#ffe36a')}}
  else{R.pos=0;f2Chime('bad');msg('The lantern gutters out. The dark between the trees moves, and shadows step out of it. The lanterns will show the order again.','#e0a0a0');
    const [x,y]=F2_NIGHT.LAMP[i];f2Release('f2shadow',2,x,y);f2NightNew();setTimeout(()=>{try{if(LEVEL===9827)f2NightShow()}catch(e){}},3500)}}
f2OnArrive(9827,()=>{const R=f2S(9827);R.showing=0;R.pos=0;if(!R.solved)R.seq=null;for(let i=0;i<4;i++)f2NightLamp(i,false)});
/* any illusion room not built by its file yet is a plain stretch of its world with the way back (so the hub doors always lead somewhere) */
for(const id of F2.ROOMS)if(!pspLevel(id).built)pspRegister(id,()=>{const C=f2Room({id,ground:'lush',route:[[24,35],[24,8]],clear:[[18,4,30,12,null,null,1]]});C.ret();return C.done()});
