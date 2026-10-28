()=>{const L=LEVELS[477];return L.decor.filter(d=>d.hgdwText!==undefined||d.npc==='hgdw_note').map(d=>d.x+','+d.y+' ['+d.label+'] '+d.hgdwText).join('\n')}
