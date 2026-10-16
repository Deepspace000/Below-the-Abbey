/* ==========================================================================
   OLDHAVEN, ACT 1: THE FAIR OF SAINT BRANNOCH AND THE SIX NAMES. After the pardon, Captain Aldwyn asks the party to find six people
   named in the margin of the master ledger. Vance paid each of them, in small favours and one odd brass or glass piece. Each has a
   stall on the fair green. Each is three steps: meet them, do the small job they ask, then decide what to do about what they did
   (mercy or justice). Each hands over one part of a device. Six parts, six quests, and one quest to tie them together.
   ========================================================================== */
const OHF_PARTS={
  dv1:["Weigher's Balance Cog","A small brass cog with a number scratched on every tooth. Hob Tally kept it in his scale-box. Part of something larger."],
  dv2:["Bellringer's Clapper Pin","A heavy steel pin, polished by hands. Ewan Marsh took it from the bell loft. Part of something larger."],
  dv3:["Baker's Bronze Spring","A tight little spring of bronze, as long as a finger. Perrin wound it into her oven latch. Part of something larger."],
  dv4:["Fool's Silver Bell","A small silver bell with no clapper. Pip Jangle sewed it to his cap. Part of something larger."],
  dv5:["Tutor's Ink-Glass Lens","A round lens of dark green glass. Master Quill used it to read small writing. Part of something larger."],
  dv6:["Sister's Moon Dial","A flat disc of pale stone, marked in twelve parts. Sister Ilse prayed over it for years. Part of something larger."]
};
for(const k in OHF_PARTS)ITEMDEF[k]={n:OHF_PARTS[k][0],k:'quest',t:'Quest item',ic:'herb',c:'#c8b070',stack:0,price:0,d:OHF_PARTS[k][1],sw:.3};
const OHF=()=>{const F=G.flags;return F.ohf||(F.ohf={done:{},mercy:{}})};
const OHF_CNT=ids=>()=>ids.reduce((n,[id,c])=>n+Math.min(c,bagCount(id)),0);
const ohq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Oldhaven'};
if(QAREA_ORDER.indexOf('Oldhaven')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'Oldhaven');

/* ---- the six suspects: id, part, name, face, spot on the green, what they ask for, the plain story ---- */
const OHF_SUSP=[
 {n:1,q:'ox1',npc:'oh_x_weigher',part:'dv1',name:'Hob Tally, the weigher',face:'kh_ohfolk1_2',at:[108,80],
  ask:[['bread',1],['cheese',1],['herring',1]],asktxt:'a loaf of bread, a piece of cheese and a herring',
  meet:'I am Hob Tally. I weigh the goods at the fair, and the town trusts my scales. Between us, one of my weights is a little light and I have not told anyone. Vance paid me to let his barrels through without a second look. Today I am hungry and cannot leave my scales. Bring me a loaf of bread, a piece of cheese and a herring and I will tell you everything.',
  accept:'Thank you. I will be here at the scales. I am not going anywhere.',
  remind:'Still waiting for a loaf, a piece of cheese and a herring. The stalls and the Cookshop have them.',
  ready:'That is lunch, and I feel braver. Here it is: I let Vance\'s barrels pass for coin, and he gave me this brass cog as a gift. I did not ask what it was for. What happens to me now?',
  mercy:'Mercy. Keep your scales honest from now on.',mercyR:'Thank you. I will fix every weight in the fair today. Take the cog. It brought me nothing but trouble.',
  justice:'Justice. You take coin to cheat people.',justiceR:'Fair. I will pay it back with a fine. Take the cog, and tell the captain it was me.'},
 {n:2,q:'ox2',npc:'oh_x_ringer',part:'dv2',name:'Ewan Marsh, the bellringer',face:'kh_ohfolk1_4',at:[115,80],
  ask:[['torch',2],['lantern',1]],asktxt:'two torches and a lantern',
  meet:'I am Ewan Marsh, and I ring the bells of Oldhaven. The night before the king was taken ill, I rang the wrong hour on purpose, because Vance asked me to. I did not know why. The bell loft is dark and I am afraid to climb it alone now. Bring me two torches and a lantern, and I will show you what I took from it.',
  accept:'Thank you. Two torches and a lantern. I will wait at the green.',
  remind:'I still need two torches and a lantern before I can face the loft.',
  ready:'Light at last. When I rang the wrong hour, Vance gave me a steel pin from the old clock and told me to keep quiet. Here it is. I am sorry. What will you do?',
  mercy:'Mercy. You were afraid, and you did not know why.',mercyR:'I will ring the true hour every day for the rest of my life. Take the pin.',
  justice:'Justice. Bells are a trust.',justiceR:'I know. I will tell the dean myself. Take the pin.'},
 {n:3,q:'ox3',npc:'oh_x_baker',part:'dv3',name:'Perrin, the baker',face:'kh_ohfolk1_1',at:[122,80],
  ask:[['salve',1],['antidote',1]],asktxt:'a salve and an antidote',
  meet:'I am Perrin, and my oven is the best in Oldhaven. It also has a second door at the back, big enough for a barrel. Vance used it to move goods past the harbour. I burned my hands badly on it last week and the pain is making me stupid. Bring me a salve and an antidote from the apothecary, and I will tell you the rest.',
  accept:'That is kind. A salve and an antidote. I will keep the bread warm for you.',
  remind:'My hands are still burnt. A salve and an antidote, please.',
  ready:'Oh, that is much better. Vance paid me to leave the back door open at night. He also gave me a bronze spring for the latch. I never asked. Now you know everything. What now?',
  mercy:'Mercy. You were not the one making the plan.',mercyR:'Bless you. I will lock the back door tonight and every night. Take the spring.',
  justice:'Justice. You helped smuggle goods.',justiceR:'I deserve that. I will pay the duty I owe. Take the spring and tell the captain.'},
 {n:4,q:'ox4',npc:'oh_x_fool',part:'dv4',name:'Pip Jangle, the fool',face:'kh_ohfolk6_1',at:[108,94],
  ask:[['apple',3]],asktxt:'three apples',
  meet:'Pip Jangle, fool of the green! I juggle, I sing, and I carry messages for rich men who think nobody listens to the fool. Vance gave me a silver bell and a purse to carry a note to the harbour master. I did not read it. Fools do not read, they juggle. Bring me three apples and I will juggle them for you, and then I will tell you the truth.',
  accept:'Three apples! The best price a fool ever paid. I will practise.',
  remind:'Three apples, friend. Juggling is hard on an empty hand.',
  ready:'Apples! Watch: one, two, three, and not one on the ground! There. Now the truth. I carried Vance\'s note, and I kept the bell he gave me. It never rang. What do you do with a fool?',
  mercy:'Mercy. You were only carrying a note.',mercyR:'The kindest thing anyone has said to me in a year. Take the bell. It never made a sound anyway.',
  justice:'Justice. A message can hurt people too.',justiceR:'Ha! A fair cut, and I did not see it coming. Take the bell, and tell the captain what I carried.'},
 {n:5,q:'ox5',npc:'oh_x_tutor',part:'dv5',name:'Master Quill, the tutor',face:'kh_ohfolk5_4',at:[115,94],
  ask:[['scrollFrost',1],['scrollLight',1]],asktxt:'a Frost scroll and a Light scroll',
  meet:'I am Master Quill. I tutor the children of the court, and I copy letters for anyone who pays. Vance paid me well to copy the old king\'s hand into a few new letters. I know it was a forgery. I need two spell scrolls, one of Frost and one of Light, to finish a lesson for a student tomorrow. Bring them and I will tell you where the letters went.',
  accept:'A Frost scroll and a Light scroll. Thank you. I will be at my desk.',
  remind:'I still need a Frost scroll and a Light scroll for tomorrow\'s lesson.',
  ready:'Excellent. Now I can teach and be honest in the same day. I forged three letters in the king\'s hand for Vance. He gave me a green glass lens to read them by. I should never have taken it. What will you do?',
  mercy:'Mercy. You can still teach well.',mercyR:'Then I will teach honesty first. Take the lens. I never want to look through it again.',
  justice:'Justice. A forged letter is a lie with a seal.',justiceR:'It is, and I knew it. I will give the letters back. Take the lens, and tell the captain.'},
 {n:6,q:'ox6',npc:'oh_x_sister',part:'dv6',name:'Sister Ilse, the quiet sister',face:'kh_ohfolk5_2',at:[122,94],
  ask:[['holywater',2]],asktxt:'two flasks of holy water',
  meet:'I am Sister Ilse. I do not speak much. Vance asked me to say a blessing over a stone dial before it went into the chancellor\'s office, and I did. I think it was a weapon. I want to bless the chapel well again, and I need two flasks of holy water for it. Bring them and I will tell you what the dial is.',
  accept:'Thank you. Two flasks of holy water. May you be kept.',
  remind:'Two flasks of holy water, when you can. I will be here, quietly.',
  ready:'May you be kept. Here is the dial, a pale disc marked in twelve parts. Vance said it told the hour of the moon. I do not know what it does. I kept it out of fear. What do you decide?',
  mercy:'Mercy. You were afraid, and you kept it safe.',mercyR:'Then I can rest. Take the dial. I will bless the chapel at dusk for all six of us.',
  justice:'Justice. You blessed something you did not understand.',justiceR:'That is true. I will confess it at the chapel. Take the dial.'}
];

for(const S of OHF_SUSP){
  ohq(S.q,S.name.split(',')[0]+' and '+S.asktxt.replace(/^an? /,''),S.name,S.meet.split('. ').slice(0,2).join('. ')+'. Bring '+S.asktxt+'.',S.ask.reduce((a,[,c])=>a+c,0),OHF_CNT(S.ask),{gold:300,xp:3000,items:[S.part]});
  QUESTS[S.q].title=S.name.split(',')[0];
  khNpc(S.npc,S.name,S.face,()=>{
    const F=G.flags,st=qSt(S.q);
    if(qSt('oq0')===null)return say(`${S.name}. ${S.n===1?'Mind the scales, friend.':S.n===2?'The bells keep time. People do not.':S.n===3?'Fresh rolls, hot from the oven.':S.n===4?'A penny for a song, a joke or a juggle!':S.n===5?'I teach letters and numbers, and some manners.':'Peace be with you.'}`,[BYE]);
    if(st==='done')return say('Thank you again. It is a relief to have it said out loud.',[BYE]);
    if(qReady(S.q))return say(S.ready,[
      ['Mercy.',()=>{OHF().mercy[S.n]=1;OHF().done[S.n]=1;const rw=rewardText(S.q);qTurnIn(S.q);ohfTake(S);msg('You show mercy.','#9fe0a0');return say(S.mercyR+' Reward: '+rw+'.',[BYE])}],
      ['Justice.',()=>{OHF().mercy[S.n]=0;OHF().done[S.n]=1;G.gold+=150;const rw=rewardText(S.q);qTurnIn(S.q);ohfTake(S);msg('You choose justice. 150 gold in forfeit.','#e0b080');return say(S.justiceR+' Reward: '+rw+', and 150 gold in forfeit.',[BYE])}],
      ['Let me think.',()=>null]]);
    if(st==='active')return say(S.remind,[BYE]);
    return say(S.meet,[['We will help.',()=>{qAccept(S.q);return say(S.accept,[BYE])}],['Not now.',()=>null]]);
  },{q:S.q});
}
const ohfTake=S=>S.ask.forEach(([id,c])=>{for(let i=0;i<c;i++){const j=G.bag.findIndex(b=>b.id===id);if(j>=0)bagTake(j)}}); // the things asked for are handed over
const OH_FAIRFOLK=OHF_SUSP.map(S=>[S.npc,S.at[0],S.at[1]]);

/* ---- the quest that ties the six together, from the gate-captain ---- */
ohq('oq0','The Six Names','Captain Aldwyn, of the Gate','The master ledger has six names in its margin, people Vance paid in small favours and odd pieces of brass and glass. Find them on the fair green: Hob Tally the weigher, Ewan Marsh the bellringer, Perrin the baker, Pip Jangle the fool, Master Quill the tutor and Sister Ilse. Hear each one, do the small job they ask, and decide what to do.',6,()=>Object.keys(OHF().done).length,{gold:2000,xp:15000});
repWrap('oh_cap',()=>!!G.flags.pardoned&&qSt('oq0')!=='done','About the six names',()=>qNode('oq0',khQD(
 'Now that the warrant is void, there is something I can ask of you. The master ledger has a margin full of initials, and I have matched six to people at the fair. They were paid by Vance in small favours, and each took an odd brass or glass piece. Not one of them is a villain. Will you find them, hear them out and decide what to do?',
 'Good. They are on the fair green, east of the middle of the city, beyond the east road. Each has a stall. Be kind, be firm and write nothing down.',
 (g,n)=>`Six names, and you have ${g} of ${n}. The fair green is east of the middle of the city.`,
 'That is all six. The king will want to hear it. Here is your reward, and my thanks.',
 'The six pieces are with you. I do not know what they build, but Vance went to a great deal of trouble to collect them.',
 'The six names are done. Thank you. Ask Ishkander about the pieces when you can.',
 'Here are all six names.')));
