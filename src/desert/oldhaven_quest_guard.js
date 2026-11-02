/* ==========================================================================
   OLDHAVEN: QUESTS ARE ALWAYS ADDED, AND A GOLD ! ONLY SHOWS WHERE A QUEST CAN BE TAKEN.
   Found by talking to every person of Oldhaven (the city, the quay, the court, the houses and the Oakwood) at each stage of the story and comparing what the mark said with what the
   dialogue did: (1) the six people at the fair, the mason and the cats guild, Hale's second quest, Ysolt's, and Aldwyn for the court showed a gold ! at stages when they offered nothing;
   (2) Captain Aldwyn's later quests (the east gate, the pigeon post, retaking the gate), Sergeant Cade's two and the baker's tunnel were offered with no mark at all;
   (3) the Court of King Osric was only added when the party walked into the court, and The Six Names only when the party spoke to Aldwyn after the pardon, so after the king's scene the
   quest list did not say what to do.
   Here: who gives which quests (QGIVER), when each becomes available (OHQ_GATE: a mark shows for a quest that is not started and is available, a green ? for one that is ready), and the
   quests the story hands out itself are added by the story: the court on arrival (also for a party that arrived before this, see the check on entering), The Six Names at the pardon
   (oldhaven.js, ohSixQuest). The tool for this check is tools/qaudit/oh_quest_audit.js.
   ========================================================================== */
QGIVER.oh_cap=['vq6','oq0','sg1','sg5','sg8','oa1'];QGIVER.oh_sergeant=['sg2','sg6'];QGIVER.oh_x_baker=['ox3','sg7'];
const OHQ_GATE={
  ox1:()=>qSt('oq0')==='active',ox2:()=>qSt('oq0')==='active',ox3:()=>qSt('oq0')==='active',ox4:()=>qSt('oq0')==='active',ox5:()=>qSt('oq0')==='active',ox6:()=>qSt('oq0')==='active',
  vq6:()=>false,   // the court quest is added by the story (on arrival), nobody hands it out
  oq0:()=>!!G.flags.pardoned,
  sg1:()=>qSt('oq0')==='done',sg2:()=>qSt('sg1')==='done',sg5:()=>qSt('sg1')==='done',sg6:()=>qSt('sg1')==='done',
  sg3:()=>!!G.flags.siege,sg4:()=>!!G.flags.siege,
  sg7:()=>qSt('sg1')==='done'&&qSt('ox3')==='done',sg8:()=>qSt('sg1')==='done'&&qSt('sg7')==='done',
  oa1:()=>qSt('sg8')==='done',oa6:()=>qSt('oa2')==='done',oa7:()=>qSt('oa3')==='done',
  oa9:()=>qSt('oa8')==='done',
  oa8:()=>{const O=typeof OAKF==='function'?OAKF():{};return !!O.heir&&!O.crowned}
};
{const _qm=questMark;questMark=function(d){
  const qv=QGIVER[d.npc];if(!qv||d.found||d.hidden)return 0;
  const arr=[].concat(qv).filter(q=>QUESTS[q]);
  if(!arr.some(q=>OHQ_GATE[q]))return _qm(d);   // a giver outside this list: as before
  let best=0;
  for(const q of arr){const st=qSt(q);if(st==='done')continue;if(st==='active'){if(qReady(q))return 2;continue}const g=OHQ_GATE[q];if(!g||g())best=1}
  return best}}
/* the court is the next thing to do once the party is in Oldhaven (the quay cutscene adds it; a party that arrived before this gets it here) */
{const _oe=ohEnter;ohEnter=function(n){
  const r=_oe.apply(this,arguments),F=G.flags;
  try{if(n>=304&&n<=311&&F.oldhavenSeen&&!F.pardoned&&!G.cut&&qSt('vq6')===null&&QUESTS.vq6)qAccept('vq6')}catch(e){console.error('ohquestguard',e)}
  return r}}
