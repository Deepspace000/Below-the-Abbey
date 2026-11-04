// Oldhaven quest audit: talks to every person of Oldhaven (city, quay, court, houses, Oakwood) at four stages of the story and reports a gold ! with no offer, or an offer with no mark.
// Run: python -m http.server 8765 (in the repo root), then node tools/qaudit/oh_quest_audit.js   (needs playwright). No output after 'people checked' means all is well.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 await p.goto('http://localhost:8765/index.html?town=oldhaven&lvl=34',{waitUntil:'load'});await p.waitForTimeout(30000);
 const res=await p.evaluate(()=>{
  const out={givers:[],rows:[]};
  // build every Oldhaven level
  const ids=[304,305,306,307,308,309,310,311,6700,6701,6702,6703,6704,6705];for(let n=6000;n<6320;n++)ids.push(n);
  const T0=performance.now();
  for(const n of ids){try{if(!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n]()}catch(e){}}
  const seen={};
  for(const n of ids){const L=LEVELS[n];if(!L||!L.decor)continue;for(const d of L.decor){if(!d.npc||!QGIVER[d.npc])continue;const k=n+':'+d.npc;if(seen[k])continue;seen[k]=1;out.givers.push({lvl:n,npc:d.npc,q:[].concat(QGIVER[d.npc])})}}
  out.ms=Math.round(performance.now()-T0);
  // stubs
  const oa=qAccept,sc=startCut,gl=goToLevel;let calls=[];
  qAccept=function(id){calls.push(id);return oa.apply(this,arguments)};startCut=()=>{};goToLevel=()=>{};
  const explore=(node,dep)=>{if(!node||typeof node!=='object'||!node.opts||dep>5)return;for(const o of node.opts){try{const r=o[1]();explore(r,dep+1)}catch(e){}}};
  const base={pardoned:1,courtSeen:1,courtFight:1,courtOpen:1,oldhavenSeen:1,oldhavenOpen:1,act3:1};
  const STATES={
   S0_arrived:{f:{oldhavenSeen:1,oldhavenOpen:1,act3:1},q:{}},
   S1_pardoned:{f:base,q:{vq6:'done',oq0:'active'}},
   S2_names_done:{f:Object.assign({},base,{siege:1}),q:{vq6:'done',oq0:'done'}},
   S3_siege_won:{f:Object.assign({},base,{siege:1,siegeWon:1,oak:{metHale:1}}),q:{vq6:'done',oq0:'done',sg1:'done'}}};
  const keepF=JSON.parse(JSON.stringify(G.flags)),keepQ=JSON.parse(JSON.stringify(G.quests));
  // every person of the levels, not only the registered givers
  const people=[];const seen2={};for(const n of ids){const L=LEVELS[n];if(!L||!L.decor)continue;for(const d of L.decor){if(!d.npc||!NPCS[d.npc])continue;const k=n+':'+d.npc;if(seen2[k])continue;seen2[k]=1;people.push({lvl:n,npc:d.npc})}}
  out.people=people.length;
  for(const [sn,S] of Object.entries(STATES)){
   for(const g of people){
    const d=(LEVELS[g.lvl].decor||[]).find(x=>x.npc===g.npc);if(!d)continue;
    G.flags=Object.assign(JSON.parse(JSON.stringify(keepF)),JSON.parse(JSON.stringify(S.f)));G.quests=JSON.parse(JSON.stringify(keepQ));for(const [q,st] of Object.entries(S.q))G.quests[q]={st,ord:1};
    d.hidden=false;d.found=false;
    const marked=QGIVER[g.npc]?questMark(d):0;const mq=QGIVER[g.npc]?[].concat(QGIVER[g.npc]).find(z=>qSt(z)!=='done'):null;
    calls=[];try{startTalk(d);if(G.talk)explore(G.talk.node,0)}catch(e){}
    G.talk=null;
    const acc=[...new Set(calls)].filter(c=>QUESTS[c]);
    // the quests this person offered that were not started before the talk
    const offered=acc.filter(c=>!S.q[c]);
    const miss=[];
    if(marked===1&&!(mq&&offered.includes(mq)))miss.push('MARK but no offer of '+mq);
    for(const c of offered)if(!(QGIVER[g.npc]&&[].concat(QGIVER[g.npc]).includes(c)))miss.push('OFFERS '+c+' but not a registered giver');
    else if(marked!==1&&!G.quests[c])miss.push('OFFERS '+c+' but no mark');
    if(miss.length)out.rows.push({state:sn,lvl:g.lvl,npc:g.npc,marked,mq,offered:offered.join(','),miss:miss.join('; ')});
   }}
  qAccept=oa;startCut=sc;goToLevel=gl;G.flags=keepF;G.quests=keepQ;
  return out});
 console.log('levels built in',res.ms,'ms; quest givers found:',res.givers.length);
 
 console.log('people checked:',res.people);for(const r of res.rows)console.log(r.state+' L'+r.lvl+' '+r.npc+' | mark='+r.marked+' giver-of='+r.mq+' | offered: '+(r.offered||'-')+' | '+r.miss);
 console.log(errs.join('\n')||'no errors');await b.close()})();
