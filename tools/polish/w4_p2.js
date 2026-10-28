()=>{const L=LEVELS[477];const o=[];const hs=d=>d.k&&(d.k.indexOf('art_hs_')===0||d.k.indexOf('hgt_')===0||d.hgtBase);
for(const d of L.decor){if(!(hs(d)||d.hgdwText!==undefined||d.npc==='hgdw_note'))continue;const g=G.decor.find(q=>q.x===d.x&&q.y===d.y&&(q.k===d.k||q.hgtBase===d.hgtBase));
o.push([d.x,d.y,d.k.slice(0,22),d.hgt||'-',d.label||'-',g?(g.k.slice(0,22)+'|'+(g.hgt||'')):'noG',(d.hgdwText||'').slice(0,28)])}
return {fonts:HGTX.fonts,n:o.length,o}}
