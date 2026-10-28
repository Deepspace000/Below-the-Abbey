()=>{const L=LEVELS[475],rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';const zs=L._hgdp.zones.filter(z=>z.type==='safe'),towns=zs.filter(z=>z.town!==undefined);
const R={};R.churchDist=L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)).map(d=>{const z=towns.find(q=>q.town===+d.npc.slice(-1));return d.npc.slice(-1)+':'+Math.round(Math.hypot(d.x-z.x,d.y-z.y))}).join(' ');
const hs=L.decor.filter(d=>d.hs==='hgdpc_house');let inStreet=0;for(const h of hs)if(hs.some(g=>g!==h&&((g.x===h.x&&Math.abs(g.y-h.y)===2)||(g.y===h.y&&Math.abs(g.x-h.x)===2))))inStreet++;R.houses=hs.length;R.housesInStreet=inStreet;
const ch=L.decor.filter(d=>/^hgd_church\d$/.test(d.npc));R.churchDoorBlockers=[];
for(const c of ch)for(const d of L.decor){if(d===c||d.cp||!d.k||d.pic)continue;if(d.npc&&NPCS[d.npc]&&!/hgdpc_text/.test(d.npc))continue;const cb=Math.max(Math.abs(d.x-c.x),Math.abs(d.y-c.y));if(cb<=1&&NPC_H[d.k])R.churchDoorBlockers.push(d.k+'@'+d.x+','+d.y+' of '+c.npc);else if(cb===2&&(d.x===c.x||d.y===c.y)&&d.block&&NPC_H[d.k]&&!d.skind)R.churchDoorBlockers.push('line:'+d.k+'@'+d.x+','+d.y+' of '+c.npc)}
const inA=d=>zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
const nn=L.decor.filter(d=>d.npc&&/^(hgd_note|hgd_pa_note|hgdb_note|hgdb_post|hgd_sign|hgdpc_text)$/.test(d.npc)&&inA(d));
R.notesSigns=nn.length;R.noLabel=nn.filter(d=>!d.label).map(d=>d.npc+'@'+d.x+','+d.y+':'+String(d.pbt||d.text||d.txt||'').slice(0,30));
const txt=d=>String(d.txt||d.pbt||d.text||(d.npc==='hgd_note'&&typeof HGDF_NOTES!=='undefined'?HGDF_NOTES[(d.note||0)%HGDF_NOTES.length]:'')||(d.npc==='hgd_sign'?'sign':''));
R.emptyText=nn.filter(d=>!txt(d)).map(d=>d.npc+'@'+d.x+','+d.y);R.longLabels=nn.filter(d=>d.label&&d.label.split(/\s+/).length>5).map(d=>d.label);
R.dupLabelsNear=0;R.pocket=0;
// landmark readable: plaques
R.plaques=L.decor.filter(d=>d.kname==='Landmark plaque').length;R.corridorLamps=L.decor.filter(d=>d.cl).length;
// em dash anywhere in zone text
R.emDash=L.decor.filter(d=>inA(d)&&/[—–]/.test(txt(d)+String(d.label||''))).length;
return R}
