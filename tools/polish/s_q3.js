(()=>{const o={};const d=G.decor.find(q=>q.npc==='hgdb_post');startTalk(d);o.t=G.talk&&G.talk.node&&G.talk.node.text;o.bob=d.bob;o.lift=d.lift;
const dn=G.decor.filter(q=>q.npc==='hgd_note');o.n=dn.length;o.nn=dn.slice(0,3).map(q=>[q.note,q.pbt&&q.pbt.slice(0,30)]);const sg=G.decor.find(q=>q.npc==='hgd_sign');o.sign=sg&&sg.zone;
const pn=G.decor.filter(q=>q.npc==='hgdb_note');o.pn=pn.length+' '+pn.filter(q=>q.pbt).length;return o})()
