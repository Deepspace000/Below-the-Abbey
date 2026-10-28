()=>{const o=[];for(const d of G.decor)if(d.x>=38&&d.x<=40&&d.y>=124&&d.y<=138)o.push([d.k.slice(0,26),d.x,d.y,d.sc,d.ox||0,d.bob||0,d.hgdBoatSpr?1:0,d.block?1:0]);
return {o,P:[G.P.x,G.P.y,G.P.f],grid:[0,1,2,3].map(i=>G.grid[137-i][39])}}
