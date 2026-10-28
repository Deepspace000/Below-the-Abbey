(()=>{const L=LEVELS[475];const out={};
out.near=L.decor.filter(d=>Math.abs(d.x-100)<=2&&d.y<=5).map(d=>[d.k,d.npc,d.x,d.y,d.sc,d.wd,d.pic,d.h]);
out.posts=L.decor.filter(d=>d.npc==='hgdb_post').map(d=>[d.x,d.y,d.pbt]).slice(0,30);
const notes=L.decor.filter(d=>d.npc==='hgdb_note');out.noteK=[...new Set(notes.map(d=>d.k))];out.noteN=notes.length;
out.noteTxt=notes.slice(0,8).map(d=>[d.x,d.y,d.k,d.sc,(d.pbt||'').slice(0,60)]);
return out})()
