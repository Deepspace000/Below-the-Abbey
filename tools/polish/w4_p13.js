()=>{G.heroes.forEach(h=>{h.hp=h.max});return G.decor.filter(d=>Math.abs(d.x-3)<=1&&d.y>=21&&d.y<=26&&!d.pic).map(d=>[d.k.slice(0,22),d.x,d.y,d.block?1:0,+hgweHt(d).toFixed(2),d.ox||0,d.oy||0])}
