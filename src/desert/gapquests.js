/* ==========================================================================
   GAP QUESTS gap1 to gap8: the optional side quests that lead into the eight gap dungeons (gapdungeons.js). Each is given by a new named person in a nearby town,
   asks for one named boss to be killed, and pays gold and a modest amount of experience (about a third of a level for a party at that rating after the doubling of QREW_MUL).
   None of them is a main quest, nothing is gated behind them.
   ========================================================================== */
const gapXP=r=>Math.round(xpNeed(r)/6/50)*50;
const GAP_Q=[
 {q:'gap1',npc:'gap_hale',name:'Mason Hale',face:'peasantM',town:13,hint:[31,21],area:'Ironhill',gold:600,
  title:"Hale's Quarry",desc:'Kill Garrick Slate, the Quarry Captain, who holds the old quarry beside the Ironhill Road (a hill with a door in it), and tell Mason Hale in Ironhill.',
  greet:'A stonemason with grey dust in his beard is staring at the road.',
  offer:"\"Mason Hale. I cut stone at the old quarry beside the Ironhill Road until a gang of deserters moved in and put a captain over it, Garrick Slate. They sit in the pit and take a toll from every cart. I cannot get my stone out. Kill Slate, and the rest will scatter.\"",
  accept:"\"The quarry is a hill with a door in it, off the road, east of the tunnel mouth. There are skeletons in there from the old rock falls too. Mind them.\"",
  remind:'"Slate is still in the quarry. The hill with the door in it, off the Ironhill Road."',
  ready:'"Is it done? Tell me he is dead."',thanks:'"Good. Now the carts can move. Take this for it."',after:'"The road is quiet. Thank you."'},
 {q:'gap2',npc:'gap_tarn',name:'Brother Tarn',face:'monk',town:13,hint:[19,21],area:'Ironhill',gold:650,
  title:'The Widow in the Well',desc:'Lay the Drowned Widow to rest in the Weeping Well, a hill with a door in it on Ironhill Moor, and tell Brother Tarn in Ironhill.',
  greet:'A monk in a muddy habit is counting the names on the memorial.',
  offer:"\"Brother Tarn, sexton of Ironhill. There is an old well on the moor, long dry, and a ghost in it. She drowned her children there in a hard winter and then herself. She calls to travellers. Three have not come back. Lay the Drowned Widow to rest.\"",
  accept:"\"The Weeping Well is a hill with a door in it, on Ironhill Moor. Her servants are the restless dead of the moor. Bring light, and healing.\"",
  remind:'"The Drowned Widow still calls from the well, on Ironhill Moor."',
  ready:'"The moor is quiet tonight. Is she at rest?"',thanks:'"Then her troubles are over. Thank you. The church gives you this."',after:'"I said a prayer for her. And for you."'},
 {q:'gap3',npc:'gap_tilda',name:'Tilda Reef',face:'fisher',town:300,hint:[53,46],area:'The Narrow Sea',gold:1800,
  title:'The Smugglers of the Hold',desc:'Kill Gorse Blackwater, the Smuggler Captain, in the Smugglers\' Hold (a rock pile with a door in it, on Saltbarrow), and tell Tilda Reef.',
  greet:'A net-mender looks up from her work.',
  offer:"\"Tilda Reef. I mend nets here. A man called Gorse Blackwater has dug a hold under the rocks and moved his smugglers in. He takes a share of every catch, and sells what he likes to whoever he likes. The pirates will not touch him, because he pays them. You are not the pirates. Kill him.\"",
  accept:"\"The hold is a rock pile with a door in it, on the island. His men are bandits, archers and hired knives. Blackwater is at the far end.\"",
  remind:'"Blackwater is still in his hold, under the rocks on Saltbarrow."',
  ready:'"You have a look about you. Is it done?"',thanks:'"The nets are my own again. Take this, and my thanks."',after:'"The catch is ours now. Thank you."'},
 {q:'gap4',npc:'gap_corwen',name:'Brother Corwen',face:'monk',town:301,hint:[44,38],area:'The Narrow Sea',gold:1900,
  title:'The Last Bellfounder',desc:'Lay the Last Bellfounder to rest in the Bellfounders\' Cellar (a rock pile with a door in it, on the Isle of Bells), and tell Brother Corwen.',
  greet:'A monk is listening to the bells, with his head on one side.',
  offer:"\"Brother Corwen. One of our bells rings by itself at night, from under the ground. Below the chapel is the old bell cellar, where the founders cast their bells. The last founder was drowned in his own mould, and he still works there. His ringing keeps the brothers from sleep. Please quiet him.\"",
  accept:"\"The cellar is a rock pile with a door in it, up the hill. Spectres and restless dead keep the place. He stands at the far end, by the old furnace.\"",
  remind:'"The Last Bellfounder is still at his work, in the cellar on the hill."',
  ready:'"The night bell has stopped. Is it you?"',thanks:'"Peace at last, for him and for us. The brothers give you this."',after:'"We sleep through the night now. Thank you."'},
 {q:'gap5',npc:'gap_ivo',name:'Ivo Dray',face:'peasantM',town:9660,hint:[44,46],area:'The Blighted Lands',gold:2400,
  title:'The Sexton Beneath',desc:'Kill the Sexton Beneath in the Sexton\'s Burrow (a rock pile with a door in it, on Barrow Hill), and tell Ivo Dray at Lanternrest.',
  greet:'The quartermaster is tallying lamp oil by the gate.',
  offer:"\"Ivo Dray, quartermaster. Every patrol that goes by Barrow Hill loses a man or two. Under the hill is the old sexton's burrow, and the sexton did not stop digging when he died. He pulls the dead down into it and sends them out again. Put him down, and our patrols will keep their numbers.\"",
  accept:"\"The burrow is a rock pile with a door in it, on the Barrow Hill. Bones and ghouls fill it. The sexton is at the far end, with his spade.\"",
  remind:'"The Sexton Beneath is still digging. Barrow Hill, the rock pile with the door."',
  ready:'"Not a body has come out of the hill since last night. Is it done?"',thanks:'"The patrols will sleep tonight. Take this, from the garrison stores."',after:'"The hill is quiet. Thank you."'},
 {q:'gap6',npc:'gap_agnes',name:'Sister Agnes Thorne',face:'peasantW',town:9680,hint:[41,31],area:'The Blighted Lands',gold:2500,
  title:'Prior Anselm the Silent',desc:'Kill Prior Anselm the Silent in the Ringers\' Undercroft (a rock pile with a door in it, at Hollowbell Abbey), and tell Sister Agnes Thorne.',
  greet:'A nun in a grey habit is washing the infirmary steps.',
  offer:"\"Sister Agnes Thorne. Under the abbey is the ringers' undercroft, where the bell ropes were once kept. The Prior went down to keep the vigil there and took a vow of silence. He did not come up again. He has been down there ever since, and he is not quiet any more. Free him, and free us.\"",
  accept:"\"The undercroft is a rock pile with a door in it, beside the abbey. The brothers who went with him are there still, and the crows. The Prior is at the far end.\"",
  remind:'"Prior Anselm is still below the abbey. The rock pile with the door in it."',
  ready:'"The abbey feels lighter. Is it done?"',thanks:'"Rest, Anselm. Thank you. The abbey would like you to have this."',after:'"The bells ring true again. Thank you."'},
 {q:'gap7',npc:'gap_orla',name:'Reeve Orla Pike',face:'peasantW',town:9700,hint:[19,35],area:'The Blighted Lands',gold:2600,
  title:"The Miller's Wife",desc:"Kill the Miller's Wife in the Mill Race (a rock pile with a door in it, at the Rookery Mill), and tell Reeve Orla Pike at the Pale Bridge.",
  greet:'A reeve with a tally stick is watching the road to the west.',
  offer:"\"Reeve Orla Pike. The Rookery Mill sends no flour any more. The miller's wife went into the mill race tunnel to look for her husband and came out a different thing. She wears his clothes and walks the mill with the crows. The road to the mill is shut until she is gone. Will you go?\"",
  accept:"\"The mill race tunnel is a rock pile with a door in it, near the mill. Scarecrows, husks and crows keep her company. She is at the far end.\"",
  remind:"\"The Miller's Wife is still in the mill race. Past the Rookery Mill.\"",
  ready:'"The crows have gone quiet. Is it done?"',thanks:'"The mill will grind again. Take this for your trouble."',after:'"The road is open. Thank you."'},
 {q:'gap8',npc:'gap_fenn',name:'Gatewarden Fenn',face:'peasantM',town:600,hint:[64,36],area:'The Blighted Lands',gold:2800,
  title:'The Tollmaster Below',desc:'Kill the Tollmaster Below in the Toll Vaults (a rock pile with a door in it, at the Pale Bridge), and tell Gatewarden Fenn in Sale.',
  greet:'A gatewarden stands very straight, as if still on duty.',
  offer:"\"Gatewarden Fenn. Below the Pale Bridge are the toll vaults, where the tolls of a hundred years were counted. The tollmaster kept counting after he died, and he still wants his toll from everyone who goes by. The road dead take him as their master. Take him out, and they will lose heart.\"",
  accept:"\"The vaults are a rock pile with a door in it, at the Pale Bridge. Wardens, hounds and shades. The tollmaster sits at the far end, behind his scales.\"",
  remind:'"The Tollmaster is still counting. The Toll Vaults, at the Pale Bridge."',
  ready:'"No one has asked for a toll in an hour. Is it done?"',thanks:'"Paid in full. Take this, from the old toll chest."',after:'"The bridge is free. Thank you."'}
];
for(const g of GAP_Q){
  const spec=GAP_SPECS.find(s=>s.q===g.q),r=spec.r,bt=spec.boss.t;
  QUESTS[g.q]={title:g.title,who:g.name,desc:g.desc,need:1,cnt:'k_'+bt,goal:cq('k_'+bt),reward:{gold:g.gold,xp:gapXP(r)}};
  QAREA[g.q]=g.area;
  const o=khQD(g.offer,g.accept,()=>g.remind,g.ready,g.thanks,g.after,'It is done.');
  g.o=o;
  khNpc(g.npc,g.name,g.face,()=>{
    if(qSt(g.q)===null)return say(g.greet,[['Ask if you can help.',()=>qNode(g.q,o)],BYE]);
    return qNode(g.q,o)},{q:[g.q]});
}
/* the person stands in the town, placed when the town is built */
function gapPlacePerson(L,n,g){
  if((L._gapP=L._gapP||{})[g.npc])return;
  const sp=gapSpot(L,n,g.hint,{clear:1});if(!sp){console.error('gap: no place for',g.name,'in',n);return}
  L._gapP[g.npc]=sp;L.decor=L.decor||[];
  L.decor.push({k:g.face,x:sp.x,y:sp.y,block:false,walk:true,npc:g.npc,sc:1});g.at={town:n,x:sp.x,y:sp.y};
}
for(const n of [...new Set(GAP_Q.map(g=>g.town))]){
  const put=()=>{const L=LEVELS[n];if(L)for(const g of GAP_Q)if(g.town===n)gapPlacePerson(L,n,g)};
  if(LEVELS[n])put();else if(KH_LAZY[n]){const o=KH_LAZY[n];KH_LAZY[n]=function(){const r=o.apply(this,arguments);try{put()}catch(e){console.error('gap town',n,e)}return r}}
}
