()=>{const L=LEVELS[475];const out=[];const errs=[];
const ids=L.decor.filter(d=>d.npc&&/^hgd_(q\d+|s2_[a-z]+\d|shop\d|church\d|vill\d+|rest\d)$/.test(d.npc));
for(const d of ids){try{G.talk=null;startTalk(d);const t=G.talk;const txt=t&&t.node&&t.node.text||(t&&t.text)||'';out.push([d.npc,!!t,(txt||'').slice(0,40),t&&t.node&&t.node.opts?t.node.opts.length:-1]);G.talk=null}catch(e){errs.push(d.npc+': '+e.message)}}
let bad=out.filter(o=>!o[1]);return {n:ids.length,noTalk:bad.map(b=>b[0]),errs,sample:out.slice(0,4)}}
