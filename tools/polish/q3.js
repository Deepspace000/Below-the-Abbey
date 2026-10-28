()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};
for(const [cx,cy] of [[101,158],[176,179],[23,182],[44,194]]){const r=[];for(let y=cy-7;y<=cy+7;y++){let s='';for(let x=cx-9;x<=cx+9;x++){const c=(L.rows[y]||"#")[x]||"#";const d=L.decor.find(d=>d.x===x&&d.y===y&&!d.pic);s+=x===cx&&y===cy?'@':(c!=='.'?'#':(d?(d.block?'B':'d'):'.'))}r.push(s)}o[cx+','+cy]=r;
o[cx+','+cy+'k']=L.decor.filter(d=>Math.abs(d.x-cx)<=3&&Math.abs(d.y-cy)<=3&&!d.pic).map(d=>d.k+'@'+d.x+','+d.y)}
const pr=L._hgdm.prec||null; o.prec=!!pr;
return o}
