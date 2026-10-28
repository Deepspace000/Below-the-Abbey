/* ==========================================================================
   PLACE 3 OF THE BLIGHTED ROAD: THE CHURCH OF THE HOLLOW SAINT (level 9630, rated 86; prefix blc / BLC). 80 by 70.
   Rooms: 9631 the nave (Father Alder at his lectern, the choir of the dead in their stalls, the saint's statue, doors down to the crypt, up to the belfry and into the vestry),
   9632 the crypt (sarcophagi, ossuary niches, the Pale Cantor), 9633 the belfry (three upside-down bells, only one of them true), 9634 the vestry (the Life of the Saint, the offering box).
   The road runs east to west along y 34 to 36 (east gate x 78 back to Ashenfold Farm, west gate x 1 on to Gallowmere, 9640). North of the road a lych-gate and a flagged path lead up through the churchyard
   (a railed yard of leaning graves, six grave boards with the names of the last congregation, the mausoleum, the sexton's hut) to the painted church. Four bells stand mouth upward at the path,
   and toll (an inverted bell tolls the dead up). South of the road: Peggy's lean-to, the plague pit, the poor chapel.
   People: Father Alder (blc_alder), Gideon Mould the sexton (blc_gideon), Precentor Ambrose Lark the ghost (blc_ambrose), Peggy Thripp the almswoman (blc_peggy), the statue of the Hollow Saint (blc_saint).
   Quests: blq7 The True Bell (Gideon), blq8 The Choir's Hymn (Ambrose), blq9 The Last Congregation (Father Alder), blq10 The Saint's Alms Bowl (the statue).
   Flags: G.flags.bl = {trueBell, wrongBells, pg1, pg2, pg3, choirRest, nm (bitmask of grave boards read), namesGiven, bowl, bowlGiven, offer (offering box), cryptChest}.
   ========================================================================== */
const BLC={ID:9630,NAVE:9631,CRYPT:9632,BELFRY:9633,VESTRY:9634,W:80,H:70};
BL_ROAD[2].W=BLC.W;BL_ROAD[2].H=BLC.H;
for(const [id,n] of [[9631,'The Nave of the Hollow Saint'],[9632,'The Crypt of the Hollow Saint'],[9633,'The Belfry'],[9634,'The Vestry']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=86}
const BLC_CH={img:'bl_church',x0:34,x1:41,y0:15,y1:20,w:8.3,wh:2.8,to:BLC.NAVE,door:[37,20]};
/* ---------- things carried ---------- */
ITEMDEF.blalmsbowl={n:"The Hollow Saint's Alms Bowl",k:'quest',t:'Quest item',ic:'ore',c:'#c8c0a8',stack:1,price:0,sw:.4,d:'A shallow wooden bowl, black with age, with a rim worn smooth by a great many thumbs. It is the bowl the Hollow Saint begged with. It belongs in the hands of her statue in the nave.'};
ITEMDEF.blhymnring={n:"Precentor's Tuning Ring",k:'ring',t:'Ring',ic:'ring',c:'#b8c8d8',price:0,lvl:86,pas:{ward:17,dodge:.06,regen:.7,mpRegen:.5},int:6,hp:80,rar:1,sw:.1,d:'A thin silver ring that hums a little when you tap it, the pitch the choir always began on. Adds 6 Intelligence and 80 health, every blow on the wearer is 17 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 86.'};
ITEMDEF.blspade={n:"Gideon's Grave Spade",k:'weapon',t:'Sword',ic:'sword',c:'#a8acac',dmg:[460,560],hit:.2,req:{str:70},lvl:86,price:0,rar:1,eff:{bleed:[.3,6,40],bossdmg:.32},dbl:.2,sw:.5,d:'A long sexton\'s spade with an edge ground sharp, and a handle worn pale by forty years of digging. Wounds bleed, and bosses take 32% more. Needs level 86.'};
ITEMDEF.blsaintcowl={n:'Cowl of the Hollow Saint',k:'head',t:'Helm',ic:'head',c:'#c8c4b4',armor:17,price:0,lvl:86,pas:{dmgPct:.06,dodge:.03,regen:.5},rar:1,gear:1,sw:.3,d:'A plain grey hood of undyed wool, hanging a little empty at the front. Whoever wore it gave everything else away. Armour 17, damage +6%, enemies miss 3% more, and wounds close steadily. Needs level 86.'};
/* ---------- upside-down bells and a darker church (filters over the painted pieces; nothing is drawn) ---------- */
function blcArt(){
  if(BLC._art)return;
  try{if(typeof wlgPaintFront==='function')wlgPaintFront()}catch(e){}
  const mk=(key,src,filter,h,flip)=>{if(!src||!src.width)return false;const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');if(flip){x.translate(0,src.height);x.scale(1,-1)}try{x.filter=filter}catch(e){}x.drawImage(src,0,0);IMG[key]=c;if(h)NPC_H[key]=h;return true};
  mk('bl_church',IMG.wl_bldg1_0,'saturate(.42) brightness(.7) sepia(.15)',null,false);
  mk('bl_ibell',IMG.gy_bell,'saturate(.7) brightness(.85)',1.0,true);
  mk('bl_ibellS',IMG.gy_bell,'saturate(.6) brightness(.78)',.62,true);
  mk('bl_bellbad',IMG.gy_bell,'saturate(.4) brightness(.55)',1.0,true);
  for(const [k,h] of [['mi_altar',1.5],['mi_pew',.8],['mi_saint',1.7],['priest',.9],['gy_ghost0',1.1],['gy_ghost1',1.1],['gy_ghost2',1.1],['gy_banshee',1.0],['hl_p_window',1.9],['hl_p_candle',.7]])if(NPC_H[k]===undefined)NPC_H[k]=h;
  BLC._art=1}
/* ---------- the sound: the bells that toll the dead up, and the choir ---------- */
const BLCS={nextToll:0,nextSing:0};
function blcSing(vol){ // a slow, soft chord of voices: a long attack and a long release, glassy
  if(!AC||!MASTER||G.mute)return;const t=AC.currentTime,roots=[[220,261.6,329.6,440],[196,246.9,293.7,392],[174.6,220,261.6,349.2]],ch=roots[(Math.random()*roots.length)|0];
  ch.forEach((f,i)=>{const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),lf=AC.createOscillator(),lg=AC.createGain();
    o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2.003;lf.frequency.value=4.6+i*.3;lg.gain.value=f*.006;lf.connect(lg);lg.connect(o.frequency);
    const v=.018*vol*(typeof SFXM==='number'?SFXM:1),a=2.6+i*.3,h=a+2.2,end=h+4.2;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+h);g.gain.linearRampToValueAtTime(0,t+end);
    const g2=AC.createGain();g2.gain.value=.25;o2.connect(g2);g2.connect(g);o.connect(g);g.connect(MASTER);
    for(const q of [o,o2,lf]){q.start(t);q.stop(t+end+.1)}})}
function blcToll(vol,low){try{playSmp('church_bell1',vol,low?.5:.62)}catch(e){blsToll(1,vol)}}
function blcTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb)return;
  const now=AC.currentTime,F=blF();
  if(LEVEL===BLC.ID){
    if(now>BLCS.nextToll){BLCS.nextToll=now+30+Math.random()*30;blcToll(.55+Math.random()*.25);setTimeout(()=>blcToll(.35,true),3300);if(Math.random()<.3)try{msg('An upside-down bell tolls, deep in the church, and the ground answers.','#b8d0a8')}catch(e){}}
    if(!F.choirRest&&now>BLCS.nextSing&&Math.hypot(G.P.x-37,G.P.y-20)<22){BLCS.nextSing=now+22+Math.random()*16;blcSing(.4)}}
  else if(LEVEL===BLC.NAVE){
    if(!F.choirRest&&now>BLCS.nextSing){BLCS.nextSing=now+13+Math.random()*10;blcSing(1)}}
  else if(LEVEL===BLC.CRYPT||LEVEL===BLC.BELFRY){
    if(now>BLCS.nextToll){BLCS.nextToll=now+40+Math.random()*30;blcToll(LEVEL===BLC.BELFRY?.7:.3,true)}
    if(LEVEL===BLC.BELFRY&&Math.random()<.01)try{wwsCrow(.6)}catch(e){}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{if(blIs(LEVEL))blcTick()}catch(e){console.error('blc tick',e)}}}
/* ---------- the people ---------- */
const BLC_ALDER_LINES=[
  '...and ninthly, dearly beloved, on the matter of the collection plate. Eighthly I have already said. I am nearly at the end. Nobody leave. Is it still Sunday? I was told this would be a short one.',
  'Where was I? The Saint took a handful of silver for the poor. Then she took another handful. Then, brethren, she could not put it down. A warning to us all, and I have given it forty times, and the front pew has not once told me it was a good one.',
  'I do not mind the choir. I mind that they have only ever learned the one hymn, and that they sing it during the sermon. I have said, in a firm and Christian voice, that there are rules.',
  'Somebody was sitting at the back a while ago. I do believe he was the churchwarden. Very quiet man. I looked again and the bench was empty. People do slip out. I never see them go.',
  'You will have a seat, I hope. There are plenty. The nave is wonderfully full, though if I am honest it has been wonderfully full of the same people for some years.'];
khNpc('blc_alder','Father Alder','priest',()=>yrLines('blc_alder',BLC_ALDER_LINES),{sc:1});
const BLC_GIDEON_LINES=[
  'Gideon Mould, sexton. Forty-one years I have dug this yard, and I have never once buried a man who stayed buried. I stopped taking it personally round about the fortieth.',
  'Father Alder is preaching his last sermon. He has been preaching it since the harvest forty years back, the night the pale riders came. I take him tea. He does not drink it, but I think he likes to be asked.',
  'Mind the bells at the path. They stand with their mouths to the sky, to catch the weather, the old people said. They toll by themselves now, and they toll the dead up out of the ground. I do not like to say how fast I am digging them back in.',
  'The true bell hangs in the belfry, over the nave. It is the small one, with no name cut in it. The Saint cast it from poor men\'s pennies and would not put her own name on it. The other two are greedy, and ring up everything that has ever lain here.'];
khNpc('blc_gideon','Gideon Mould, the sexton','kh_ohfolk7_0',()=>yrLines('blc_gideon',BLC_GIDEON_LINES));
const BLC_AMBROSE_LINES=[
  '(The ghost in the grey surplice lifts one finger and hums a note, and the rest of the stalls find it, and hold it.) Forgive us. We are rather good, and we do not stop. It is the worst thing about being good.',
  'We had a hymn book, once, and a hymn for the very end of things. The pages were taken from the book and hidden. We were not allowed to finish. A choir that cannot finish is a very long evening indeed.',
  'Father Alder is a dear man. A little long. I have been counting the sermon in my head for forty years, and it is somewhere past eight thousand heads.'];
khNpc('blc_ambrose','Precentor Ambrose Lark','gy_ghost2',()=>yrLines('blc_ambrose',BLC_AMBROSE_LINES),{sc:1});
const BLC_CHOIR_LINES=[
  '(The singers sing on, soft and low, with their eyes shut. The words are old and have no ending, and they are about a long road, and somebody waiting at the end of it with a light.)',
  '(One of the singers opens her eyes, and finds you, and for a moment the hymn is sung only to you. Then she shuts them again.)',
  '(A thin boy in the second row waves, very slightly, without losing the note.)',
  '(They go on singing. The same verse. The same turn at the end, and then back to the beginning, as though the page had been torn off right there.)'];
khNpc('blc_choir','A singer of the choir','gy_ghost0',()=>yrLines('blc_choir',BLC_CHOIR_LINES),{sc:1});
const BLC_PEGGY_LINES=[
  'Peggy Thripp. I beg, dear, I always have. The Saint begged too, so I am in good company. There is not much to beg from out here. The dead do not carry purses.',
  'They say the Saint was a poor girl who walked the road and took the Sovereign\'s pale silver for the poor, a handful at first. But the silver wanted more of her every day, and in the end it was all she was. There was nothing inside her but the silver, and that is why they call her Hollow.',
  'Down in the crypt, where they buried the paupers, there is a plain niche with a mark on it, a little bowl. The old women say the Saint hid her begging bowl there so that nobody would ever beg with it for themselves. I never went down to look. I am not so poor as that.'];
khNpc('blc_peggy','Peggy Thripp, almswoman','kh_ohfolk2_0',()=>yrLines('blc_peggy',BLC_PEGGY_LINES));
/* ---------- the quests ---------- */
function blcQ(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
const blcPages=()=>{const F=blF();return (F.pg1?1:0)+(F.pg2?1:0)+(F.pg3?1:0)};
const blcNames=()=>{const F=blF();let n=0;for(let i=0;i<6;i++)if((F.nm|0)&(1<<i))n++;return n};
blcQ('blq7','The True Bell','Gideon Mould, the sexton',[
  ['Climb to the belfry above the nave (the trapdoor in the nave\'s east corner) and ring the true bell. Gideon says it is the small one with no name on it.',()=>!!blF().trueBell,['blc_bellC','blc_belfrydoor']]],
  {gold:3600,xp:30000,items:['blspade','potion6']});
blcQ('blq8',"The Choir's Hymn",'Precentor Ambrose Lark',[
  ['Find the three lost pages of the choir\'s last hymn: one on the sarcophagus in the crypt, one in the belfry, one on a grave in the churchyard.',()=>blcPages()>=3,['blc_page1','blc_page2','blc_page3']],
  ['Give the three pages to Precentor Ambrose in the nave.',()=>!!blF().choirRest,['blc_ambrose']]],
  {gold:3800,xp:32000,items:['blhymnring','potion6']});
blcQ('blq9','The Last Congregation','Father Alder',[
  ['Read the names on the six grave boards in the churchyard, then tell them to Father Alder.',()=>blcNames()>=6,['blc_name']],
  ['Read the names to Father Alder in the nave.',()=>!!blF().namesGiven,['blc_alder']]],
  {gold:3800,xp:31000,items:['potion6','potion6','potion6']});
blcQ('blq10',"The Saint's Alms Bowl",'The statue of the Hollow Saint',[
  ['Find the Hollow Saint\'s begging bowl, hidden in a pauper\'s niche in the crypt.',()=>!!(blF().bowl||blF().bowlGiven),['blc_pauper']],
  ['Set the bowl in the hands of the Saint\'s statue in the nave.',()=>!!blF().bowlGiven,['blc_saint']]],
  {gold:4600,xp:36000,items:['blsaintcowl','potion6']});
wwGive('blc_gideon','blq7',()=>true,{
  offer:'Would you do me a kindness? The bells at the path toll the dead up, and it is the belfry that sets them off. There are three bells up there. Two of them are false, and ring up every sleeper in the yard. One is true, and rings them down. I am too old for the ladder, and I will not guess. Ring the true one for me.',
  accept:'Good. The trapdoor is in the nave, in the east corner by the vestry door. Up the ladder, and you will see them. The true bell is the small one. It has no name cut in it. The Saint would not put her name to it. Do not ring the greedy two.',
  remind:()=>'The belfry is up the ladder from the nave. The true bell is the small one with no name on it. Have you rung it?',
  ready:'I heard it from here. A clean note, and the whole yard went still, like a held breath let go. Thank you.',
  thanks:'Take my spade. I will dig with my hands now. It will be easier on the grief.',
  after:'The path bells have gone quieter. They still toll. They only toll slower, as if they were not sure of it.'});
wwGive('blc_ambrose','blq8',()=>true,{
  offer:'May I ask a great thing? The last hymn was in three pages, and the pages were hidden, one from each of three places, so that we would not finish. We cannot rest until we have sung it to the end. One page lies on a sarcophagus in the crypt. One is up in the belfry. One is on a grave in the churchyard. Would you bring them to me?',
  accept:'Thank you. You will know them by the staves. Four lines of music, and no words, because we have always known the words.',
  remind:()=>blcPages()>=3?'You have all three pages. Give them to me, and we will sing it.':'You have '+blcPages()+' of three pages. The crypt, the belfry and the churchyard.',
  ready:'We have sung it. Right to the end. I do not think I have ever heard a silence like that.',
  thanks:'The choir is gone, all but me, and I will go in a moment. Take my tuning ring. I will not need to find the note again.',
  after:'It is very quiet in the stalls. That is what I wanted. Father Alder is still preaching. He has not noticed. Go well.'});
wwGive('blc_alder','blq9',()=>true,{
  offer:'Dear friend, I am nearly at the end of my sermon, and I find I cannot remember who the last congregation was. I preached to them, you see, the night the pale riders came. Their names are cut on boards in the churchyard, I am told. If you could read them out to me, I could finish. I have to say their names. It is only right.',
  accept:'Six boards, in the yard. Read them all, and come and tell me. I will wait. I am very good at waiting. Ask anybody.',
  remind:()=>blcNames()>=6?'You have read all six boards. Read me the names, and I shall finish.':'You have read '+blcNames()+' of the six boards in the churchyard.',
  ready:'Amen. Amen, amen. It is done. I have said their names, every one, and there was nobody left in the front pew to hear it but you.',
  thanks:'Thank you. It has been forty years. I thought I was preaching to keep them in their seats. I think I was preaching so as not to hear the quiet after. Take this, for your trouble, and for theirs.',
  after:'I shall sit down now. I have not sat down in a very long time. Do you know, it is a wonderfully comfortable pew.'});
/* the hooks that turn the pages in (they run first) */
yrHook('blc_ambrose',d=>{const F=blF();
  if(qSt('blq8')==='active'&&blcPages()>=3&&!F.choirRest)return say('Precentor Ambrose looks at the three pages in your hand, and his whole face changes. Behind him, in the stalls, the singing falters, and stops, and a hush goes round the nave like a drawn breath.',[['Give him the pages.',()=>blcRest()],['Not yet.',()=>null]]);
  if(F.choirRest&&qSt('blq8')!=='done'&&qSt('blq8')!=='active')return yrLines('blc_ambrose_r',['The stalls are empty. I stayed to say thank you.']);
  return null});
function blcRest(){
  const F=blF();F.choirRest=1;sfx('win');
  try{const L=LEVELS[BLC.NAVE];if(L)for(const x of L.decor)if(x.npc==='blc_choir')x.found=true;if(LEVEL===BLC.NAVE&&G.decor)for(const x of G.decor)if(x.npc==='blc_choir')x.found=true}catch(e){console.error(e)}
  try{blcSing(1.6)}catch(e){}
  try{G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}})}catch(e){}
  msg('The choir sings the last hymn to its end, and one by one the singers fade. A calm falls over the party, and every hero is healed.','#ffe9a0');
  return say('They sing it right through, the three pages, the long turn at the end, and the last line that had never been sung. And then the stalls are empty, and the air smells of candle smoke and rain. Precentor Ambrose stays a moment longer, with his head bowed.',[BYE])}
yrHook('blc_alder',d=>{const F=blF();
  if(qSt('blq9')==='active'&&blcNames()>=6&&!F.namesGiven)return say('Father Alder stops, with his mouth open on the word NINTHLY. "You have them?" he says. "Oh. You have them. Read them to me, dear friend. Slowly. I want to hear each one."',[['Read out the six names.',()=>{F.namesGiven=1;sfx('win');msg('You read out the names of the last congregation.','#ffe36a');return say('You read them out, one by one, and Father Alder says each name after you, quietly, as if he were laying it down on a table. Then he is silent for a long moment. "Amen," he says, to nobody in particular.',[BYE])}],['Not yet.',()=>null]]);
  if(F.namesGiven&&qSt('blq9')==='done')return yrLines('blc_alder_d',['I am sitting. I am only sitting. It is very odd. Has the roof always been that colour?','Sexton Mould brings me tea, and I drink it. Yesterday I drank it. It was dreadful. I had two.','I should like to hear the choir. I should like to hear the hymn. They have stopped, I think. How very rude of me not to have noticed. They must have been so tired of my sermon.']);
  return null});
/* ---------- the objects ---------- */
const BLC_NAMES=[
  ['MARGERY TANNER','Baker. Never gave short weight.'],['WILL AND ELSPETH CROSS','Weavers, of the lane. Together.'],['THE HOLLOWAY CHILDREN','Three of them. The youngest, Nan, was four.'],
  ['JOHN DAUNT','Churchwarden. He sat at the back.'],['AGNES FOLLET','Widow. Sang in the second row.'],['OLD TOBIAS PIKE','Bellringer, forty years. Rang the true bell last.']];
khNpc('blc_name','A grave board','bl_slab',d=>{
  const F=blF(),i=d.i|0,t=BLC_NAMES[i]||BLC_NAMES[0],bit=1<<i;
  if(!((F.nm|0)&bit)){F.nm=(F.nm|0)|bit;if(qSt('blq9')==='active')yrStep('You read the name on a grave board ('+blcNames()+' of 6).')}
  return say(t[0]+'. '+t[1]+' Cut under it, smaller: HEARD THE LAST SERMON.',[BYE])});
function blcPage(n,where,flag){return d=>{const F=blF();
  if(F[flag])return say('A bare place where the page lay. There is a ring of dust, and a very faint sound of singing.',[BYE]);
  return say('A single leaf of old paper, brittle and brown, ruled in four-line staves and written all over with notes, and no words. A corner has been torn from the book it came from. '+where,[['Take the page.',()=>{F[flag]=1;d.found=true;d.hidden=true;sfx('key');msg('You take a page of the choir\'s last hymn ('+blcPages()+' of 3).','#ffe36a');return null}],BYE])}}
khNpc('blc_page1','A page of music','gy_book',blcPage(1,'It lies on the lid of the sarcophagus, under a pale thumbprint.','pg1'));
khNpc('blc_page2','A page of music','gy_book',blcPage(2,'It is tucked in under the lip of the nameless bell, where nobody would look.','pg2'));
khNpc('blc_page3','A page of music','gy_book',blcPage(3,'It lies on a low grave, weighted with a stone.','pg3'));
khNpc('blc_sign_church','A churchyard notice','greensign',()=>say('A notice board at the lych-gate. THE CHURCH OF THE HOLLOW SAINT. ALL WELCOME. SERVICES: ALWAYS. SERMON IN PROGRESS: PLEASE ENTER QUIETLY. Under it, in a different hand: PLEASE ENTER. HE IS VERY LONELY.',[BYE]));
khNpc('blc_ibell','An upside-down bell','bl_ibell',()=>say('A great bronze bell set on a stone block with its mouth to the sky, full of rain and drowned leaves. It rings by itself, low, when the wind finds it. Moss is grown over the clapper. Somebody has hung a small tin cup on its rim, for drinking.',[BYE]));
khNpc('blc_mausoleum','The Alder vault','bl_mausoleum',()=>say('A small ivy-black mausoleum. The door is sealed with lead. A plaque reads: THE FAMILY OF ALDER. LET THEM REST, and below it, scratched with a nail: he does not know.',[BYE]));
khNpc('blc_hut','The sexton\'s hut','bl_hut',()=>say('A hut with a kettle on a hook, three spades, a lantern and a very large number of small crosses stacked neatly in the corner, waiting. A chalk tally on the wall counts something in fives, and has been rubbed out and begun again many times.',[BYE]));
khNpc('blc_pit','The plague pit','gy_mound',()=>say('A wide shallow pit, ringed with low mounds, and a board with the single word PAUPERS. The earth has settled a little in the middle. It is not entirely still.',[BYE]));
khNpc('blc_lean','Peggy\'s lean-to','bl_hut',()=>say('A lean-to of planks and sacking, with a blanket, a tin cup and a hand-lettered card that says PLEASE GIVE. Under it somebody has written, in a better hand: THE SAINT GAVE. THE SAINT IS DEAD.',[BYE]));
khNpc('blc_poorchapel','The poor chapel','bl_chapel',()=>say('A tiny ruined chapel, roofless, with its windows gone to ivy. A board on the door says: THE POOR CHAPEL. NO CHARGE. NO PEWS. NO ROOF. The inside is full of nettles and one very clean candle.',[BYE]));
khNpc('blc_belfrydoor','A trapdoor with a ladder','gy_hatch2',()=>say('A trapdoor in the corner of the nave, with a ladder hung down through it. The rungs are polished by forty years of the same sexton, and above them, in the dark, something moves with a slow bronze groan.',[['Climb the ladder to the belfry.',()=>{sfx('door');G.talk=null;goToLevel(BLC.BELFRY,{x:5,y:7,f:0});return null}],BYE]));
khNpc('blc_cryptdoor','Stairs going down','gy_stair',()=>say('A narrow stone stair going down to the crypt of the Hollow Saint. Cold comes up it, and a smell of old stone and candles. Somewhere below, a drip, and the creak of a lid.',[['Go down into the crypt.',()=>{sfx('door');G.talk=null;goToLevel(BLC.CRYPT,{x:10,y:12,f:0});return null}],BYE]));
khNpc('blc_vestrydoor','The vestry door','gy_arch',()=>say('A low arched door beside the chancel, with a brass handle. Behind it the vestry, where the vestments are kept.',[['Go through into the vestry.',()=>{sfx('door');G.talk=null;goToLevel(BLC.VESTRY,{x:5,y:7,f:0});return null}],BYE]));
khNpc('blc_cryptup','The stair up','gy_stair',()=>say('The stair back up to the nave. The sound of singing comes down it, thin and patient.',[['Climb up to the nave.',()=>{sfx('door');G.talk=null;goToLevel(BLC.NAVE,{x:3,y:12,f:0});return null}],BYE]));
khNpc('blc_belfryup','The ladder down','gy_hatch2',()=>say('The ladder down through the trapdoor to the nave.',[['Climb down to the nave.',()=>{sfx('door');G.talk=null;goToLevel(BLC.NAVE,{x:18,y:12,f:0});return null}],BYE]));
khNpc('blc_saint','The statue of the Hollow Saint','mi_saint',()=>{
  const F=blF();
  if(F.bowlGiven)return say('The statue of a young woman in a plain gown, with a bowl in her cupped hands. The stone is cold, and the face is calm. The word cut at her feet still says GIVE.',[BYE]);
  return say('A statue of a young woman in a plain hood, with her hands cupped in front of her, empty. The stone of the face is worn smooth at the cheeks. At her feet is cut the word GIVE. A very old candle burns in front of her, and has not gone down in forty years.',[F.bowl?['Set the bowl in her hands.',()=>{if(bagCount('blalmsbowl')>0)bagRemove('blalmsbowl',1);F.bowlGiven=1;sfx('win');msg('The bowl rests in the statue\'s hands.','#ffe9a0');return say('The bowl settles into the stone hands with a small sound, like a sigh let out. A warm light fills the nave, and every hero is healed.',[BYE])}]:['Look at her face.',()=>say('Her face is young, and tired, and kind. It has no lines. It is entirely empty, like a bowl.',[BYE])],BYE])},{sc:1});
wwGive('blc_saint','blq10',()=>true,{
  offer:'(The statue stands with its hands cupped before it, and they are empty. A word is cut in the stone at its feet. It says: GIVE. Under the word, much smaller, a second line: AND DO NOT KEEP.) A voice that is not a voice says: There was a bowl. I hid it, so that I would not beg with it for myself. It lies where they buried the poor. Bring it back, and put it in my hands.',
  accept:'(The stone says nothing more. The air in the nave is a little warmer.) The crypt, under the stair. A pauper\'s niche with a bowl cut over it.',
  remind:()=>blF().bowl?'You have the bowl. Put it in the hands of the statue.':'The bowl is in a pauper\'s niche in the crypt, under the stair.',
  ready:'(The bowl rests in the stone hands, as if it had never been taken out of them.)',
  thanks:'(A grey hood lies folded at the statue\'s feet. It was not there a moment ago.) Take it. I wore it when there was nothing left in me but the giving.',
  after:'(The stone hands are full, and the face above them is, very slightly, less hollow.)'});
yrHook('blc_saint',d=>{const F=blF();
  if(qSt('blq10')==='active'&&(F.bowl||bagCount('blalmsbowl')>0)&&!F.bowlGiven)return say('A statue of a young woman in a plain hood, with her hands cupped in front of her, empty. You have the bowl.',[['Set the bowl in her hands.',()=>{bagRemove('blalmsbowl',1);F.bowlGiven=1;F.bowl=1;sfx('win');try{G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}})}catch(e){}msg('The bowl rests in the statue\'s hands. Every hero is healed.','#ffe9a0');return say('The bowl settles into the stone hands with a small sound, like a sigh let out. A warm light fills the nave.',[BYE])}],BYE]);
  return null});
/* the crypt: the pauper's niche (the hidden relic) and the sarcophagus chest */
khNpc('blc_pauper',"A pauper's niche",'gy_rune',d=>{
  const F=blF();
  if(F.bowl||F.bowlGiven)return say('A plain niche in the wall, with a small bowl cut over the opening. The shelf inside is empty, and swept.',[BYE]);
  return say('Under the stair, behind the last of the great sarcophagi, a plain niche is let into the wall, with a small bowl cut over the opening. The stone shelf inside is bare, and a flat slab stands before it, with a loose edge.',[['Lift the slab.',()=>{F.bowl=1;if(!bagAdd(mkItem('blalmsbowl')))G.items.push({k:'blalmsbowl',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the Hollow Saint\'s alms bowl.','#ffe36a');return null}],BYE])});
khNpc('blc_cryptchest','A chantry chest','gy_chest',d=>{
  const F=blF();if(F.cryptChest)return say('The chest is open and empty.',[BYE]);
  return say('A small iron-bound chest in a niche, with a candle stub on the lid. The lock was forced long ago.',[['Open it.',()=>{F.cryptChest=1;G.gold+=1600;sfx('win');msg('You take 1600 gold.','#ffe36a');return null}],BYE])});
khNpc('blc_sarc','A sarcophagus','gy_sarc',()=>say('A stone sarcophagus, carved with a sleeping figure in a hood. The inscription reads: SAINT ORLA, CALLED THE HOLLOW. SHE GAVE WHAT SHE TOOK. THEN SHE GAVE WHAT SHE WAS. The lid is not quite closed, and it is very quiet inside.',[BYE]));
khNpc('blc_niche','An ossuary niche','gy_niche',()=>say('A niche stacked neat as firewood with bones, and a card: SKULLS. THIGHS. THE REST. Somebody has taken great care.',[BYE]));
khNpc('blc_bellA','The bell called Great Tom','bl_bellbad',()=>blcBell(0));
khNpc('blc_bellB',"The bell called Saint Orla's Widow",'bl_bellbad',()=>blcBell(1));
khNpc('blc_bellC','The small bell with no name','bl_ibellS',()=>blcBell(2));
function blcBell(i){
  const F=blF(),nm=['GREAT TOM is cut round the shoulder in letters as high as a hand, and a crack the shape of a smile runs from the rim to the crown.',"The words SAINT ORLA'S WIDOW are cut round the shoulder. The widow, the old women say, was a great deal louder than the saint, and rather cheerful about it.",'No name is cut in it at all. On the shoulder there is only a handprint, pressed into the metal when it was cast, small, with the fingers spread. It is a clean, plain, patient bell.'][i];
  if(i===2&&F.trueBell)return say(nm+' You have rung it. The clapper is still, and the metal is still warm from the sound.',[BYE]);
  return say('An upside-down bell, mouth to the sky, hung on a heavy beam. '+nm,[['Ring it.',()=>blcRing(i)],['Leave it be.',()=>null]])}
function blcRing(i){
  const F=blF();
  if(i===2){F.trueBell=1;sfx('win');try{playSmp('church_bell1',.9,1)}catch(e){}try{G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}})}catch(e){}msg('The true bell rings out, clean and low. Every hero is healed.','#ffe9a0');
    return say('The note rolls out over the nave, the yard and the road, and for the length of it nothing in all the churchyard moves. Under your feet the choir in the nave falls silent for a moment, and then, very quietly, goes on.',[BYE])}
  F.wrongBells=(F.wrongBells|0)+1;try{playSmp('church_bell1',.8,.5);playSmp('church_bell2',.6,.45)}catch(e){}
  try{G.heroes.forEach(h=>{if(h.alive)h.hp=Math.max(1,Math.round(h.hp-h.max*.12))})}catch(e){}
  msg('The false bell tolls. The sound goes through your bones, and the dead in the churchyard sit up.','#d09a80');
  try{const L=LEVELS[BLC.ID];if(L&&LEVEL===BLC.ID)null}catch(e){}
  return say('A huge, greedy, swelling note, that goes on long after it should. Far below, and a long way off, you hear something in the yard come up out of the ground. Your bones ache with it. That was not the true bell.',[BYE])}
khNpc('blc_book','The Life of Saint Orla','gy_book',()=>say('A great book on a lectern, open at a page headed THE LIFE OF SAINT ORLA, CALLED THE HOLLOW. "She was a girl of the road, who took the Sovereign\'s pale silver for the poor of the parish, a handful, and then a handful more. It was said that a coin of it never wore, and never warmed, and that she could not set it down. She gave it all away, every piece. And still it came to her hands. In the end she was emptied out by it, like a bowl turned over. She asked to be buried where the poor are buried. She is buried under the high altar. The poor were not told." The next page has been torn out.',[BYE]));
khNpc('blc_offer','The offering box','gy_chest',()=>{
  const F=blF();if(F.offer)return say('The offering box is open, and empty, apart from a single button.',[BYE]);
  return say('A tin offering box, chained to the wall, with a slot in the lid, and a card: FOR THE POOR. It has not been emptied in forty years. It rattles.',[['Take what is in it, for the poor of the road.',()=>{F.offer=1;G.gold+=1100;if(ITEMDEF.potion6&&bagAdd(mkItem('potion6'))){}sfx('win');msg('You take 1100 gold, and a potion somebody left.','#ffe36a');return null}],BYE])});
khNpc('blc_robes','A cupboard of vestments','gy_chest',()=>say('A tall cupboard of folded vestments. Green for Ordinary Time, white for feasts, black for burials. The black has been worn out, and the white is not much used. A note pinned to the black one says: PLEASE BUY MORE.',[BYE]));
khNpc('blc_stall','The choir stalls','mi_pew',()=>say('Two rows of dark oak stalls, with hymn boards above them. The numbers on the board all read the same hymn, and the same verse, and it is always the last one.',[BYE]));
/* the Pale Cantor: the crypt's guardian */
Object.assign(ENEMY_DEF,{blcantor:{name:'The Pale Cantor',hp:380,dmg:[10,16],hit:.9,w:blW('crB_0',1.15),img:'gyi_wraith',xp:700,gold:[0,0],speed:1,verb:'rakes',boss:true,aboveParty:0,bl:1,still:1,glow:.3,wake:'A tall figure in a pale cope lifts its head from the sarcophagus, and opens its mouth, and a note comes out that is a great deal too low for a throat.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blcantor');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blcantor=[3200,4000];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blcantor/,'haunted',.3]);
/* ---------- the level ---------- */
function blcBuild(p){
  blcArt();
  const C=blKit({id:BLC.ID,W:BLC.W,H:BLC.H,name:p.name,lvl:86,start:{x:73,y:35,f:3},wind:.36});
  const {hs}=C,F=blF();
  C.hills(.14);C.boundary();C.setF(2,2,77,67,'0');
  C.pth(2,34,77,36,'1');C.pth(36,21,38,33,'4');C.pth(32,21,42,21,'4');
  C.pth(19,37,20,52,'2');C.pth(44,37,45,48,'2');C.pth(59,31,60,33,'2');
  C.flatten(2,8,77,50);
  C.gate('E',35);C.gate('W',35);
  // the church, painted over a hidden block of wall; the door is in the middle
  C.picHouse(Object.assign({},BLC_CH,{img:IMG.bl_church?'bl_church':'wl_bldg1_0'}));
  C.reserve(30,14,43,22);
  // the railed churchyard: iron fence, the lych-gate at the path
  for(let x=18;x<=62;x++){if(x>=36&&x<=38)continue;C.dec('bl_fence',x,31,{block:true,sc:.9})}
  for(let x=18;x<=62;x++)C.dec('bl_fence',x,10,{block:true,sc:.9});
  for(let y=11;y<=30;y++){C.dec('bl_fence',18,y,{block:true,sc:.9});C.dec('bl_fence',62,y,{block:true,sc:.9})}
  C.dec('gy_lych',37,31,{sc:1.0});C.light(36,30,C.pale);C.light(38,30,C.pale);
  C.post(34,32,'bl_ch_sign',[{n:'THE CHURCH OF THE HOLLOW SAINT',d:0},{n:'THE CHURCHYARD',d:0}],'blc_sign_church','A notice board at the lych-gate. THE CHURCH OF THE HOLLOW SAINT. ALL WELCOME. SERVICES: ALWAYS. SERMON IN PROGRESS: PLEASE ENTER QUIETLY. Under it, in a different hand: PLEASE ENTER. HE IS VERY LONELY.',{i:3});
  // the four upside-down bells on stone blocks beside the path, with lamps
  for(const [x,y] of [[35,24],[39,24],[35,29],[39,29]]){C.dec('bl_ibell',x,y,{block:true,npc:'blc_ibell',sc:1.25})}
  for(const [x,y] of [[35,22],[39,22],[35,27],[39,27]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  C.dec('bl_urn',33,18,{block:true,sc:.9});C.dec('bl_urn',42,18,{block:true,sc:.9});C.light(33,21,C.warm);C.light(42,21,C.warm);
  // the west plot: rows of graves, and the six grave boards of the last congregation
  const WG=[[21,16],[24,16],[27,16],[30,16],[21,20],[24,20],[30,20],[21,24],[27,24],[24,28],[27,28],[30,28],[21,28]];
  for(const [x,y] of WG){C.dec('gy_mound',x,y,{block:true,sc:.75});C.dec(['bl_lean','bl_stone1','bl_wcross','bl_stone2'][(hs(x,y,5)*4)|0],x,y-1,{block:true,sc:.85+hs(x,y,6)*.2})}
  const BLC_SHORT=['M. TANNER','W. AND E. CROSS','HOLLOWAYS','J. DAUNT','A. FOLLET','T. PIKE'];
  BLC_NAMES.forEach((n,i)=>{const pos=[[22,18],[26,18],[22,22],[28,22],[25,26],[29,26]][i],k=blSlab('bl_cg'+i,[BLC_SHORT[i],'LAST SERMON'],{h:.95,top:.2,span:.55});C.dec(k,pos[0],pos[1],{block:true,npc:'blc_name',i})});
  // the east plot: the Alder vault, a page on a low grave, crosses; the sexton's hut and Gideon
  C.dec('bl_mausoleum',52,15,{block:true,npc:'blc_mausoleum',sc:1.0});C.light(50,17,C.pale);C.light(54,17,C.pale);
  for(const [x,y] of [[46,16],[48,19],[56,19],[58,16],[46,23],[52,22],[58,24],[48,27],[54,27]]){C.dec('gy_mound',x,y,{block:true,sc:.75});C.dec(['bl_ccross','bl_lean','bl_wcross','bl_tomb'][(hs(x,y,7)*4)|0],x,y-1,{block:true,sc:.85})}
  if(!F.pg3)C.dec('gy_book',50,25,{block:true,npc:'blc_page3',sc:1,bob:.1});
  C.dec('bl_hut',59,27,{block:true,npc:'blc_hut',sc:.9});C.light(58,29,C.warm);C.dec('gy_bench',56,29,{block:false});
  C.person('blc_gideon',57,30,2);
  for(const [x,y] of [[20,12],[60,12],[20,30],[60,30]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  // the road: milestone, signs, lamps, dead hedges with gaps
  C.milestone(8,33);
  C.post(5,37,'bl_ch_w',[{n:'GALLOWMERE',d:-1}],'blc_signW','A signpost by the west gate. The board reads GALLOWMERE, to the west. Under it somebody has added: KEEP TO THE LIGHTS ON THE CAUSEWAY. THE LIGHTS ARE NOT KIND, BUT THE DARK IS WORSE.',{i:1});
  C.post(74,37,'bl_ch_e',[{n:'ASHENFOLD FARM',d:1}],'blc_signE','A signpost inside the east gate. The board reads ASHENFOLD FARM, to the east. Below it: NO SCARECROWS PAST THIS POINT. SO FAR.',{i:5});
  for(let x=3;x<=76;x++){if([19,20,36,37,38,44,45,59,60].includes(x))continue;
    for(const y of [33,37]){if(hs(x,y,33)<.84&&!(y===33&&x>=33&&x<=43))C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=12;x<=70;x+=9){if(x>30&&x<46)continue;C.dec('gy_lantern',x,38,{block:true});C.light(x,38,C.pale)}
  // south of the road: Peggy's lean-to, the plague pit, the poor chapel
  C.dec('bl_hut',17,43,{block:true,npc:'blc_lean',sc:.6});C.light(18,44,C.warm);C.dec('kh_oqstuff_8',15,43,{block:true,sc:.7});C.person('blc_peggy',20,44,2);
  for(let a=0;a<12;a++){const x=Math.round(54+4.5*Math.cos(a*.5236)),y=Math.round(46+3*Math.sin(a*.5236));C.dec('gy_mound',x,y,{block:true,sc:.7})}
  C.dec('gy_mound',54,46,{block:true,npc:'blc_pit',sc:.9});C.dec('gy_bones',52,47,{});C.dec('gy_bones',56,45,{});C.light(54,42,C.pale);
  C.dec('bl_chapel',36,52,{block:true,npc:'blc_poorchapel',sc:.9});C.dec('gy_candles',36,54,{block:true,sc:.7});C.light(36,54,C.warm);C.pth(35,38,37,50,'2');
  b14ChurchDress(C);
  b14Patches(C,{keep:(x,y)=>x>=17&&x<=63&&y>=9&&y<=32});
  C.dress({trees:130,scrub:240,stones:14,bones:8,posts:6,keep:(x,y)=>(x>=17&&x<=63&&y>=9&&y<=32)||(y>=32&&y<=38)||(x>=33&&x<=39&&y>=38&&y<=56)||(x>=14&&x<=24&&y>=38&&y<=48)||(x>=48&&x<=60&&y>=40&&y<=52)});
  // the creatures: the dead of the churchyard come up when the party draws near
  C.foes([['blghoul',24,18],['blghoul',28,26],['blghoul',48,24],['blhusk',22,24],['blhusk',56,24],['blhusk',30,13],['blbones',26,22],['blbones',46,20],['blbones',54,14],['blbones',58,22],['blshade',44,28],['blshade',24,14],['blhound',38,12],['blhound',60,42],
    ['blghoul',54,44],['blhusk',50,48],['blbones',22,50],['blbones',44,56],['bldeadwarden',30,34],['bldeadwarden',58,35],['blcrow',20,30],['blcrow',60,22],['blcrow',40,44],['blshade',34,58],['blbloat',50,56],['blhusk',66,50],['blghoul',12,48],['blcrowflock',60,14]]);
  for(const [k,x,y] of [['potion6',22,32],['potion6',60,32],['potion6',40,58]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Church of the Hollow Saint',x:37,y:17,k:'place'},{t:'The Lych-Gate',x:37,y:31,k:'place'},{t:'The Upside-Down Bells',x:37,y:26,k:'place'},{t:'The West Graves',x:25,y:21,k:'place'},{t:'The Alder Vault',x:52,y:15,k:'place'},{t:"The Sexton's Hut",x:59,y:27,k:'place'},{t:"Peggy's Lean-To",x:17,y:43,k:'place'},{t:'The Plague Pit',x:54,y:46,k:'place'},{t:'The Poor Chapel',x:36,y:52,k:'place'},{t:'To Ashenfold Farm',x:73,y:33,k:'place'},{t:'To Gallowmere',x:6,y:33,k:'place'});
  const lv=C.finish({start:{x:73,y:35,f:3}});
  lv.tele=undefined;
  return lv}
/* ---------- the rooms ---------- */
const blcFloor=()=>FLOORS.wl2f5?'wl2f5':FLOORS.cobble?'cobble':'wood';
const blcWall=()=>IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0';
function blcNave(){
  const F=blF();
  blRoom({id:BLC.NAVE,name:'The Nave of the Hollow Saint',w:21,h:15,amb:.5,rating:86,floor:blcFloor(),wall:blcWall(),
    back:{to:BLC.ID,x:37,y:21,f:2},
    lights:[[3,2],[10,2],[17,2],[3,8],[17,8],[10,7],[5,12],[15,12]],lcol:{'3,2':[.7,1.1,.95],'10,2':[1.4,1.0,.6],'17,2':[.7,1.1,.95],'3,8':[.75,1.1,.95],'17,8':[.75,1.1,.95],'10,7':[.8,1.1,.95],'5,12':[1.3,.95,.6],'15,12':[1.3,.95,.6]},col:[.9,1.05,.9],
    enemies:[],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('altar',10,1,{h:1.4});P('votive',8,1,{h:1.0});P('votive',12,1,{h:1.0});P('glasswin',5,0,{h:1.3,free:true,block:false});P('glasswin',15,0,{h:1.3,free:true,block:false});
      P('font',17,5,{h:.9});P('chandelier',10,7,{h:1.0,free:true,block:false});
      C.raw('mi_saint',3,2,{npc:'blc_saint',solid:1,deco:false,sc:1.0});
      // the pulpit end: Father Alder at his lectern
      P('lectern',10,3,{h:1.0});C.npc('blc_alder',10,4);
      // pews in two blocks with an aisle between
      for(const y of [8,10,12])for(const x of [3,4,5,6,7,13,14,15,16,17])if(!(y===12&&(x===3||x===17)))C.raw('mi_pew',x,y,{block:true,sc:1});
      // the stalls of the choir: two rows of singers, the precentor in front
      if(!F.choirRest){
        const GK=['gy_ghost0','gy_ghost1','gy_ghost2','gy_banshee'];let n=0;
        for(const [x,y] of [[2,5],[3,5],[4,5],[5,5],[6,5],[2,6],[4,6],[6,6],[14,5],[15,5],[16,5],[17,5],[18,5],[14,6],[16,6],[18,6]])C.raw(GK[(n++)%4],x,y,{npc:'blc_choir',solid:1,deco:false,sc:.95,bob:.08+(n%3)*.04})}
      C.raw('mi_pew',7,5,{npc:'blc_stall',solid:1,deco:false,sc:1});
      C.npc('blc_ambrose',8,6);
      // the three doors: crypt stair (south west), belfry trapdoor (east corner), vestry (east wall)
      C.raw('gy_stair',1,13,{npc:'blc_cryptdoor',solid:1,deco:false,sc:.95});
      C.raw('gy_hatch2',19,13,{npc:'blc_belfrydoor',solid:1,deco:false,sc:1});
      C.raw('gy_arch',19,7,{npc:'blc_vestrydoor',solid:1,deco:false,sc:.9});
      P('candlerack',1,4,{h:1.0});P('candlerack',19,4,{h:1.0});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_web',19,1,{block:false,sc:.5});C.raw('gy_bones',9,11,{block:false,sc:.3});C.raw('gy_bones',12,13,{block:false,sc:.3})}})}
function blcCrypt(){
  const F=blF();
  blRoom({id:BLC.CRYPT,name:'The Crypt of the Hollow Saint',w:21,h:15,amb:.38,rating:86,floor:FLOORS.mosscobble?'mosscobble':'cobble',wall:IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0',
    back:{to:BLC.NAVE,x:3,y:12,f:0},
    lights:[[3,3],[10,2],[17,3],[3,9],[17,9],[10,8],[10,12]],lcol:{'3,3':[.7,1.1,.95],'10,2':[.7,1.1,.95],'17,3':[.75,1.1,.95],'3,9':[1.3,.95,.6],'17,9':[.7,1.1,.95],'10,8':[.75,1.1,.95],'10,12':[1.3,.95,.6]},col:[.72,1.05,.92],
    enemies:[['blbones',5,5],['blbones',15,5],['blghoul',4,9],['blghoul',16,9],['blshade',10,6],['blbones',6,11],['blcantor',10,3]],
    build:C=>{
      // the stair up is the door in the south wall (middle); the stair set into the wall is decoration to match
      for(const [x,y] of [[2,3],[2,5],[18,3],[18,5],[2,9],[18,9]])C.raw('gy_niche',x,y,{npc:'blc_niche',solid:1,deco:false,sc:.9});
      for(const [x,y] of [[5,3],[15,3],[5,8],[15,8],[8,10],[12,10]])C.raw('gy_coffin',x,y,{block:true,sc:.9});
      C.raw('gy_sarc',10,2,{npc:'blc_sarc',solid:1,deco:false,sc:1.2});
      if(!F.pg1)C.raw('gy_book',9,1,{npc:'blc_page1',solid:1,deco:false,sc:.9,bob:.55});
      for(const [x,y] of [[8,1],[12,1],[1,7],[19,7]])C.raw('gy_candles',x,y,{block:true,sc:.85});
      C.raw('gy_chest',18,12,{npc:'blc_cryptchest',solid:1,deco:false,sc:.9});
      C.raw('gy_rune',2,12,{npc:'blc_pauper',solid:1,deco:false,sc:.9});
      C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',19,1,{block:false,sc:.6});C.raw('gy_bones',7,6,{block:false,sc:.3});C.raw('gy_bones',13,7,{block:false,sc:.3});C.raw('gy_bones',10,11,{block:false,sc:.3});
      C.raw('gy_stair',10,13,{npc:'blc_cryptup',solid:1,deco:false,sc:.95})}})}
function blcBelfry(){
  const F=blF();
  blRoom({id:BLC.BELFRY,name:'The Belfry',w:13,h:10,amb:.42,rating:86,floor:'wood',wall:IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0',
    back:{to:BLC.NAVE,x:18,y:12,f:0},
    lights:[[3,2],[10,2],[6,6]],lcol:{'3,2':[.75,1.1,.95],'10,2':[.7,1.1,.95],'6,6':[1.3,.95,.6]},col:[.8,1.05,.9],
    enemies:[['blcrow',3,5],['blcrow',10,5],['blcrow',6,3],['blshade',10,7]],
    build:C=>{
      C.raw('bl_bellbad',3,2,{npc:'blc_bellA',solid:1,deco:false,sc:1.7});C.raw('bl_bellbad',6,2,{npc:'blc_bellB',solid:1,deco:false,sc:1.5});C.raw('bl_ibellS',10,2,{npc:'blc_bellC',solid:1,deco:false,sc:1.3});
      if(!F.pg2)C.raw('gy_book',10,3,{npc:'blc_page2',solid:1,deco:false,sc:.9,bob:.1});
      for(const x of [1,11])C.raw('hl_p_window',x,4,{block:true,sc:1.0});
      C.raw('crate',2,7,{block:true,sc:.9});C.raw('barrel',11,7,{block:true,sc:.9});C.raw('gy_bones',5,5,{block:false,sc:.3});C.raw('gy_bones',8,6,{block:false,sc:.3});C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',11,1,{block:false,sc:.6});
      C.raw('gy_hatch2',5,8,{npc:'blc_belfryup',solid:1,deco:false,sc:1})}})}
function blcVestry(){
  const F=blF();
  blRoom({id:BLC.VESTRY,name:'The Vestry',w:11,h:9,amb:.5,rating:86,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLC.NAVE,x:18,y:7,f:3},
    lights:[[3,2],[8,2],[5,5]],lcol:{'3,2':[1.4,1.0,.6],'8,2':[1.35,.98,.58],'5,5':[1.3,.95,.6]},col:[1.3,.95,.6],
    enemies:[['blbones',8,6]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('bookshelf',2,1,{h:1.1});P('bookshelf',4,1,{h:1.1});P('dresser',9,1,{h:1.1});P('cot',1,6,{h:.7});P('waterbarrel',9,6,{h:.7});P('candlerack',6,1,{h:1.0});P('clock',8,1,{h:1.1});
      P('readdesk',5,3,{h:.85});C.raw('gy_book',5,3,{npc:'blc_book',solid:1,deco:false,bob:.4,sc:1});
      C.raw('gy_chest',9,4,{npc:'blc_offer',solid:1,deco:false,sc:.9});C.raw('gy_chest',1,2,{npc:'blc_robes',solid:1,deco:false,sc:.9});
      C.raw('gy_web',9,1,{block:false,sc:.5});C.raw('gy_bones',4,6,{block:false,sc:.3})}})}
for(const [id,fn] of [[BLC.NAVE,blcNave],[BLC.CRYPT,blcCrypt],[BLC.BELFRY,blcBelfry],[BLC.VESTRY,blcVestry]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLC.ID])KH_LAZY[BLC.ID]();blcArt();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),T=QRF.T;
  T.blq7={give:[N(9630,'blc_gideon')],act:()=>blF().trueBell?[N(9630,'blc_gideon')]:[N(9631,'blc_belfrydoor'),N(9633,'blc_bellC')],ready:[N(9630,'blc_gideon')]};
  T.blq8={give:[N(9631,'blc_ambrose')],act:()=>{const F=blF(),o=[];if(blcPages()>=3)return [N(9631,'blc_ambrose')];if(!F.pg1)o.push(N(9632,'blc_page1'));if(!F.pg2)o.push(N(9633,'blc_page2'));if(!F.pg3)o.push(N(9630,'blc_page3'));return o},ready:[N(9631,'blc_ambrose')]};
  T.blq9={give:[N(9631,'blc_alder')],act:()=>blcNames()>=6?[N(9631,'blc_alder')]:[N(9630,'blc_name')],ready:[N(9631,'blc_alder')]};
  T.blq10={give:[N(9631,'blc_saint')],act:()=>blF().bowl?[N(9631,'blc_saint')]:[N(9632,'blc_pauper')],ready:[N(9631,'blc_saint')]}}
blRegister(3,blcBuild,{fromE:{x:73,y:35,f:3},fromW:{x:4,y:35,f:1},exitY:35,rooms:[9631,9632,9633,9634],names:{9631:'The Nave of the Hollow Saint',9632:'The Crypt of the Hollow Saint',9633:'The Belfry',9634:'The Vestry'},rating:{9631:86,9632:86,9633:86,9634:86}});

/* ---------- polish (round 1 to 4): the road, the churchyard and the pit, dressed ---------- */
function b14ChurchDress(C){
  const cart=b14Dead('b14_cart','cart','saturate(.3) brightness(.62)',1.1),sacks=b14Dead('b14_sacks','sacks','saturate(.3) brightness(.6)',.7),ban=b14Dead('b14_banner','banner','saturate(.5) brightness(.75)',1.6),
    cage=b14Dead('b14_cage','ww_cagefull','saturate(.4) brightness(.7)',1.1),bones=b14Dead('b14_ybones','yar_bones','saturate(.3) brightness(.7)',.7),charm=b14Dead('b14_charm','ww_charm','saturate(.4) brightness(.7)',1.2);
  // the pilgrims' road: a cart at each side, sacks and barrels, torn banners at the lych-gate, cages with bones on the fence posts
  b14Place(C,[[ban,33,32],[ban,41,32],[ban,29,34],[ban,45,34],[cart,24,34],[cart,50,36],[sacks,52,36],['barrel',23,34,{sc:.8}],['barrel',51,36,{sc:.8}],[cage,34,30],[cage,40,30]]);
  // the plague pit: bone heaps around the ring, a cart tipped at its edge
  for(const [x,y] of [[50,45],[58,47],[52,49],[56,49],[54,43],[58,44]])C.dec(bones,x,y,{sc:1});
  C.dec(cart,49,47,{block:true,sc:.9});
  // bone charms hung on the churchyard railings
  for(const [x,y] of [[19,12],[19,22],[61,14],[61,24],[28,11],[46,11]])C.dec(charm,x,y,{block:true,sc:.9});
  for(const [x,y] of [[36,40],[44,40],[56,36],[20,36]])C.dec('crate',x,y,{block:true,sc:.8})}
