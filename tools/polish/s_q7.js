(()=>{const L=LEVELS[475],o={};o.moved=(L._hgpb.log.p2.movedList||[]).slice(0,3);const q=L.decor.filter(d=>/^hgd_q\d+$/.test(d.npc));o.givers=q.map(d=>d.npc);
const res=[];for(const d of G.decor.filter(x=>/^hgd_q\d+$/.test(x.npc)||/^hgd_hermit|hgd_think|hgd_shop\d$/.test(x.npc))){try{startTalk(d);res.push([d.npc,(G.talk&&G.talk.node&&G.talk.node.text||'?').slice(0,40)])}catch(e){res.push([d.npc,'ERR '+e])}G.talk=null}
o.talks=res;o.err=res.filter(r=>/ERR|\?$/.test(r[1])).length;
o.minimap=typeof drawMinimap;o.save=typeof saveGame;return o})()
