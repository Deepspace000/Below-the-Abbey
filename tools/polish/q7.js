()=>{const L=LEVELS[475],M=L._hgdm,W=M.W;const o={};o.a=JSON.stringify(L.decor.find(d=>d.pic&&d.k==='art_hgdf_wsym1'));o.b=JSON.stringify(L.decor.find(d=>d.pic&&d.k==='art_hgdf_vine1'));o.c=JSON.stringify(L.decor.find(d=>d.pic&&d.k==='hpb_cage'));
o.nh=NPC_H.art_hgdf_wsym1; o.ih=[IMG.art_hgdf_wsym1.width,IMG.art_hgdf_wsym1.height];
o.sh=L.decor.filter(d=>d.pic&&M.bio[d.y*W+d.x]===2).reduce((a,d)=>{a[d.k]=(a[d.k]||0)+1;return a},{});
o.waxw=[IMG.hg_wax.width,IMG.hg_wax.height,IMG.hg_wax.constructor.name];
return o}
