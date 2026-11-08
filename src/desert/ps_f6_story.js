/* ==========================================================================
   THE PALE TOWER: THE STORY (prefix psf6). Two scenes.
   1. The confrontation: the first time the party enters the Throne Room, the Pale King speaks with them before the fight and ties the whole story together (the Rat King, Vance and Corvane,
      the Road Wardens, the six pieces of the Orrery, Maldrake's contract, Wren and Aldous Wend). Plays once (flag psf6S().talk).
   2. The ending: when the Pale King dies, four painted slides (assets/end_*.jpg) show the Blighted Lands healed, Sale freed, the corrupt officials in gaol and King Osric ruling a happy land.
   ========================================================================== */
CUTS.psf6King=()=>[
  {text:'The doors at the top of the stair stand open. A red runner leads the whole length of a black hall to a gilded throne. The Pale King does not stand. He has had a very long time to wait.'},
  {who:'The Pale King',text:'Ten rooms, and you are still walking. Come closer. I would like to see the faces of the people who finished my work for me.'},
  {who:hn(0),text:'Finished your work?'},
  {who:'The Pale King',text:'Under the Abbey there was a tomb, and at its door I set a king of rats to keep it shut. You killed him. That was the first door.'},
  {who:hn(1),text:'Vance\'s ledger. The silver. Corvane\'s ships.'},
  {who:'The Pale King',text:'Mine. I paid in silver because silver is what keeps me. Vance wrote my letters and Corvane carried my coin. The Road Wardens kept the west gate shut and were paid to forget what they guarded. And six small people, each with one small piece, built a machine for me.'},
  {who:hn(2),text:'The Orrery of Hours. It opened the sealed door under the Abbey. We carried every piece to the clockmaker ourselves.'},
  {who:'The Pale King',text:'And so my tomb was opened by honest hands, which is the only kind that can. But a tomb is only a door. I needed blood to stand in it. Osric is old. His granddaughter wears the oak crown. She is blood of my blood, eleven hundred years down.'},
  {who:hn(3),text:'Wren. She went west with Aldous Wend. They are in the Sanctuary at Sale, and they have made a pact.'},
  {who:'The Pale King',text:'I know it. Aldous Wend was my court wizard once, and he ran. Now he teaches the girl to unmake me with my own blood. I let them go. I wanted to see if she would be worthy. She is. That is the worst of it.'},
  {who:hn(2),text:'Wystan Maldrake signed your paper and read one clause. We read him the rest, and his ring broke.'},
  {who:'The Pale King',text:'A kindness. I have worn many silver rings, and each one was a village. The Blight is nothing but my silver running through the land, and I have forgotten how to stop it. I forgot how to be anything but a king who does not die.'},
  {who:hn(0),text:'Then we will stop it for you.'},
  {who:'The Pale King',text:'Yes. If I fall, every ring breaks and every dead man on the Road lies down. Osric\'s men will find every mayor and clerk who sold a town to me. I will not go quietly. I have not forgotten how to be a king.'},
  {who:hn(1),text:'There is a teleport stone by the stair, if anyone wants potions first.'},
  {text:'The Pale King rises from his throne. The candles lean towards him.'}];
/* the ending: four slides over painted pictures, then a last line */
const PSF6_END=[
  ['end_land','The Blighted Lands',['The Pale King is gone, and the silver rings break one by one all along the Blighted Road. The dead lie down in their own graves. The grey fever leaves the dales, and by spring the orchards of the Bone Orchard are in blossom.','The farms of Ashenfold are worked again. The bells of the Church of the Hollow Saint ring the right way up. The fen at Gallowmere drains, and the causeway is a road.']],
  ['end_sale','Sale',['The gates of Sale are opened from the inside. The shops unbar their doors and the lamps are lit for living people. Wren and Aldous Wend come out of the Sanctuary into the square, and the children of the town run to meet them.','Wystan Maldrake goes home to Underhill. He plants a garden on the barrow and tends it for the rest of his life.']],
  ['end_prison','The Gaol of Oldhaven',['King Osric\'s men find every name in the ledger. The corrupt mayors, clerks and paymasters who took the Pale Sovereign\'s silver are brought to Oldhaven in chains. Every one of them sits in the gaol, waiting for the judge, and none of them has a coin left.']],
  ['end_king','King Osric',['King Osric rules for many more years, in a land at peace. His granddaughter Wren sits beside him, and the oak crown on her head does not wilt. The party\'s names are written at the top of the book of Oldhaven, as friends of the crown.','The Abbey is quiet. The crypts are empty. Somewhere far to the west, the sun comes up over green hills.','THE END. Thank you for playing Below the Abbey.']]];
/* the first slide: the Pale King lies slumped on the floor of his hall, then vanishes (frames end_pk0 to end_pk7: the same hall, the king dissolving block by block into dust) */
const PSF6_KING_FRAMES=['end_pk0','end_pk1','end_pk2','end_pk3','end_pk4','end_pk5','end_pk6','end_pk7'],PSF6_FRAME_T=.7;
PSF6_END.unshift(['end_pk0','The Pale King',['The Pale King lies where he fell. The candles that leaned towards him stand straight again.','The dust lifts from him, a little at a time, until the floor is bare. A crown and a sceptre are all that is left.'],PSF6_KING_FRAMES]);
{const _da=drawScenePic;drawScenePic=function(){const C=G.cut;
  if(C&&C.frames){ // the picture sits in the upper part of the screen with the caption below it, so the king and the crown are not hidden behind the text
    const key=C.i===0?C.frames[0]:C.frames[Math.min(C.frames.length-1,Math.floor((G.time-C.t)/PSF6_FRAME_T))],keep=C.pic;C.pic='__none';
    try{_da.apply(this,arguments)}finally{C.pic=keep}
    const im=IMG[key];if(im&&im.width){const h=240,w=h*im.width/im.height;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(im,(DW-w)/2,0,w,h);ctx.strokeStyle='#8a7448';ctx.lineWidth=1.5;ctx.strokeRect((DW-w)/2+.5,.5,w-1,h-1);ctx.restore()}
    return}
  return _da.apply(this,arguments)}}
{const _ca=cutAdvance;cutAdvance=function(){const C=G.cut;if(C&&C.frames&&C.i===1&&(G.time-C.t)<C.frames.length*PSF6_FRAME_T+.6)return;return _ca.apply(this,arguments)}}
function psf6Slide(i){
  const s=PSF6_END[i];if(!s){G.cut=null;try{ngOffer()}catch(e){console.error(e)}return}
  for(const f of (s[3]||[s[0]]))if(typeof loadImg==='function'&&!IMG[f])loadImg(f,'assets/'+f+'.jpg');
  G.cut={id:'psf6end'+i,pic:s[0],i:0,t:G.time,lines:s[2].map(t=>({text:t,title:s[1]})),frames:s[3]||null,end:()=>psf6Slide(i+1)};G.hold=null;G.queued=null}
function psf6Ending(){try{for(const f of PSF6_KING_FRAMES)if(typeof loadImg==='function'&&!IMG[f])loadImg(f,'assets/'+f+'.jpg')}catch(e){}let n=0;const go=()=>{if(G.cut||G.talk||G.state!=='play'){if(n++<30)later(1500,go);return}psf6Slide(0)};later(2500,go)}   // waits (up to about 45 s) while another scene, a talk or a menu state is open, instead of dropping the ending
/* the first time in the Throne Room: the talk */
pspOnArrive(n=>{if(n!==PSF6.THRONE)return;try{const F=psf6S();if(!F.talk&&F.king!==2){F.talk=1;later(900,()=>{if(!G.cut)startCut('psf6King')})}}catch(e){console.error('psf6 story',e)}});

/* ---------- the main goal in the journal: quest psq50 (no giver: taken on the first arrival at the Pale Approach, paid once when the Pale King dies), the Story So Far chapters and the storyNext ladder ---------- */
const psmGot=()=>{try{return !!pspF().key2||bagCount('pskey2')>0||!!pshF().stairOpen}catch(e){return false}};
const psmTower=()=>{try{const F=psf6S();return [1,2,3,4,5,6,7,8,9,10].filter(n=>F.boss[n]===2).length}catch(e){return 0}};
const psmS=[
  ()=>{try{return psf6S().king===2}catch(e){return false}},
  ()=>psmTower()>=10,
  ()=>{try{return psf4F().moon===2}catch(e){return false}},
  ()=>{try{return psf3oF().reflect===2}catch(e){return false}},
  ()=>{try{return psf2F().dream===2}catch(e){return false}},
  psmGot];
const psmDone=i=>{for(let k=0;k<=i;k++)if(psmS[k]())return true;return false};   // a step counts as done when it, or any later step, is done (so a jump ahead cannot block the reward)
yrQ('psq50','The Pale King','Wren and Aldous Wend, in Sale',[
  ['Take the west gate of Sale to the Pale Spire. Find the Second Floor Key in the Oubliette under the castle, and climb the Grand Stair.',()=>psmDone(5)],
  ['Find the seven pieces of the Sleeper in the Hall of Illusions, wake her, and break the Sovereign\'s Dream.',()=>psmDone(4)],
  ['On the third floor, light the crystal in the Beam Room and break the Sovereign\'s Reflection in the Observatory.',()=>psmDone(3)],
  ['On the Floor of the Moon, take the four little planets and kill the Pale Moon.',()=>psmDone(2)],
  ['Cross the Ramparts and climb the ten rooms of the Pale Tower. '+'Kill the guardian of each room.',()=>psmDone(1)],
  ['Kill the Pale King in the Throne Room at the top of the Pale Tower.',()=>psmDone(0)]],
  {gold:60000,xp:400000,items:['elixir','elixir','supermana']});
QAREA.psq50=PSP.REGION;
pspOnArrive(n=>{try{if(n>=9720&&qSt('psq50')===null)qAccept('psq50')}catch(e){console.error('psq50 accept',e)}});
function psq50Done(){try{if(qSt('psq50')===null)qAccept('psq50');if(qSt('psq50')==='active')qTurnIn('psq50')}catch(e){console.error('psq50 done',e)}}
STORY.push(
  {id:'pspire',c:()=>{try{return !!(G.flags.psp&&G.flags.psp.last)}catch(e){return false}},t:'The Pale Spire',x:'The west gate of Sale opened on a road to the Pale Spire, the castle of the Pale Sovereign. The party passed the Great Gatehouse and the Gate Captain, crossed the Court of Statues and went into the Great Halls. A tall silver key opens the Grand Stair, and the key lies in the Oubliette at the bottom of the dungeons.'},
  {id:'pspfloors',c:()=>psmDone(4),t:'The Climb',x:'With the Second Floor Key the party climbed through the Hall of Illusions, the Hall of Mirrors and the Observatory, and on to the Floor of the Moon and the Ramparts. Above the Ramparts stands the Pale Tower.'},
  {id:'pspking',c:()=>psmTower()>=1||psmDone(1),t:'The Pale Tower',x:'The Pale Tower has ten small rooms, one above the other. A guardian stands in each, and the stair up stays shut until it is dead. The Throne Room of the Pale King lies at the top.'},
  {id:'pspend',c:()=>psmDone(0),t:'The End of the Pale King',x:'The Pale King fell from his throne in the Throne Room, and every silver ring on the Blighted Road broke. The Pale Lands are healed, and the Pale Spire is empty.'});
{const _sn=storyNext;storyNext=function(){try{const F=G.flags,P=F.psp;
  if(P&&P.last){
    if(psmDone(0))return 'The Pale King is dead and the Pale Spire is empty. The land is healed.';
    if(psmDone(1))return 'Go up the stair to the Throne Room of the Pale King, and kill him. There is a teleport stone by the stair if you need potions first.';
    if(psmDone(2))return 'Cross the Ramparts, go in at the foot of the Pale Tower and climb its ten rooms. Kill the guardian of each room to open its stair. '+psmTower()+' of 10 are dead.';
    if(psmDone(3))return 'On the Floor of the Moon, carry the four little planets to open the iron gate, and kill the Pale Moon.';
    if(psmDone(4))return 'On the third floor, light the crystal in the Beam Room with the mirrors, then break the Sovereign\'s Reflection in the Observatory Gallery.';
    if(psmDone(5))return 'Climb the Grand Stair to the Hall of Illusions. Find the seven pieces of the Sleeper, wake her, and break the Sovereign\'s Dream.';
    return 'You are in the Pale Spire, the castle of the Pale Sovereign. A tall silver key opens the Grand Stair. It lies in the Oubliette at the bottom of the dungeons. Ask the porter, the librarian and the prisoners.'}
  if(F.saMet)return 'Take the west gate at the end of Candle Street in Sale, and go up the road to the Pale Spire. The Pale Sovereign is at the top.';
}catch(e){}return _sn.apply(this,arguments)}}

/* ==========================================================================
   ROBUSTNESS (long-run audit). All small guards, each one wrapping an existing function.
   1. hurtEnemy on a creature that is already dead paid gold, XP and the kill count again (the core has no guard): now ignored.
   2. A save in the middle of a boss fight lost the _kid mark of the helper copies (and the phase): after loading, killing a helper copy marked the real boss's room as cleared.
   3. A cutscene with no line left (or a line that throws) could never be closed: the cut is dropped instead of locking every key.
   4. A full browser store made autosaves fail without a word: the two oldest backups ('prev2', then 'prev') are removed to make room, and one plain warning is shown if it still fails.
   5. A quest reward that does not fit in a full bag was lost: it is kept in G.flags.owed and handed over when there is room.
   ========================================================================== */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){if(e&&e.hp<=0)return;return _h.apply(this,arguments)}}
{const _s=snapshot;snapshot=function(){const s=_s.apply(this,arguments);try{if(s.enemies&&s.enemies.length===G.enemies.length)s.enemies.forEach((o,i)=>{const e=G.enemies[i];if(e&&e._kid)o.kid=1;if(e&&e._ph)o.ph=e._ph})}catch(x){}return s}}
{const _r=restoreNow;restoreNow=function(sv){const r=_r.apply(this,arguments);try{if(sv&&sv.enemies&&sv.enemies.length===G.enemies.length)sv.enemies.forEach((o,i)=>{const e=G.enemies[i];if(e&&o){if(o.kid)e._kid=1;if(o.ph)e._ph=o.ph}})}catch(x){console.error(x)}return r}}
{const _c=cutAdvance;cutAdvance=function(){const C=G.cut;if(!C)return;
  if(!C.lines||!C.lines[C.i]){G.cut=null;if(C.end)try{C.end()}catch(x){console.error(x)}return}
  try{return _c.apply(this,arguments)}catch(x){console.error('cutAdvance',x);if(G.cut===C)G.cut=null}}}
{let warnT=-1e9;
 const freeOne=()=>{for(const k of ['prev2','prev']){try{if(localStorage.getItem('abbeySave_'+k)!==null){localStorage.removeItem('abbeySave_'+k);return true}}catch(e){}}return false};
 const storeOpen=()=>{try{localStorage.setItem('abbeyProbe','1');localStorage.removeItem('abbeyProbe');return true}catch(e){return false}};
 const guard=fn=>function(k){let ok=fn.apply(this,arguments);if(ok||k==='prev'||k==='prev2')return ok;
   try{JSON.stringify(snapshot())}catch(e){return ok}   // a bug in the snapshot is not a full store
   let freed=0;while(!ok&&freed<2&&freeOne()){freed++;ok=fn.apply(this,arguments)}
   if(ok&&freed){try{msg('The browser store was nearly full, so the oldest backup save was removed.','#e8c870')}catch(e){}}
   else if(!ok&&G.time-warnT>300){warnT=G.time;try{msg('The game could not be saved: the browser store is full or blocked. Free some space by clearing an old save slot.','#e8a090')}catch(e){}}
   return ok};
 writeSave=guard(writeSave);writeAreaSaves=guard(writeAreaSaves);}
{const _q=qTurnIn;qTurnIn=function(id){const ob=bagAdd,lost=[];
  bagAdd=function(it){const r=ob.apply(this,arguments);if(!r&&it&&it.id){lost.push({id:it.id,n:it.n||1});return true}return r};
  let r;try{r=_q.apply(this,arguments)}finally{bagAdd=ob}
  if(lost.length){const F=G.flags;F.owed=(F.owed||[]).concat(lost);try{msg('Your bag is full. The rest of the reward will be handed over as soon as there is room.','#d09a80')}catch(x){}}
  return r}}
{let t=0;const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{t+=dt||.016;if(t>1){t=0;const F=G.flags,O=F&&F.owed;if(O&&O.length&&G.state==='play'&&!G.cut&&!G.talk&&!G.loot&&G.bag.length<BAGCAP){
    while(O.length&&G.bag.length<BAGCAP){const o=O[0],it=mkItem(o.id);if(o.n>1)it.n=o.n;if(!bagAdd(it))break;O.shift();msg('Handed over: '+((ITEMDEF[o.id]&&ITEMDEF[o.id].n)||o.id)+'.','#9ae0a0')}
    if(!O.length)delete F.owed}}}catch(x){console.error('owed',x)}
  return r}}
