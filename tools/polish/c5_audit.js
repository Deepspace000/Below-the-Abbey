()=>{const L=LEVELS[475],open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const zs=L._hgdp.zones.filter(z=>z.type==='safe');
const zoneOf=d=>zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
const people=L.decor.filter(d=>d.npc&&/^hgd_(q\d+|s2_[a-z]+\d|shop\d|church\d)$/.test(d.npc)&&zoneOf(d));
const clr=(p,x,y)=>{const dx=Math.sign(x-p.x),dy=Math.sign(y-p.y),n=Math.max(Math.abs(x-p.x),Math.abs(y-p.y));for(let i=1;i<n;i++)if(!open(p.x+dx*i,p.y+dy*i))return false;return true};
const hidden=[];for(const p of people)for(const d of L.decor){if(d===p||d.npc||d.pic||d.hs||d.hgdTier||!NPC_H[d.k]||!zoneOf(d))continue;const h=NPC_H[d.k]*(d.sc||1);if(h<.3||/lamp|lantern|candle|brazier|chest|teleporter/.test(d.k))continue;
 const c=Math.max(Math.abs(d.x-p.x),Math.abs(d.y-p.y));const lin=(d.x===p.x||d.y===p.y)&&c<=2&&c>=1&&clr(p,d.x,d.y);
 if(c<=1&&!d.skind||lin&&h>=.35&&!(d.block&&/tree|statue|well|fountain|plinth|hgxstat|hgxrock|stall/.test(d.k)))hidden.push([p.npc,p.x,p.y,d.k,d.x,d.y,+h.toFixed(2)].join('|'))}
const nts=L.decor.filter(d=>d.npc&&/^(hgd_note|hgd_pa_note|hgdb_note)$/.test(d.npc)&&zoneOf(d));const hiddenNotes=[];
for(const p of nts)for(const d of L.decor){if(d===p||d.npc||d.pic||d.hs||!NPC_H[d.k]||/lantern|candle|chest|teleporter|^hgdpc_/.test(d.k))continue;const h=NPC_H[d.k]*(d.sc||1);if(h<.3&&!/hanglamp/.test(d.k))continue;
 const c=Math.max(Math.abs(d.x-p.x),Math.abs(d.y-p.y));if(c>=1&&c<=2&&(d.x===p.x||d.y===p.y)&&clr(p,d.x,d.y)||c<=1&&c>=0&&!/hanglamp/.test(d.k)&&h>=.3&&d!==p)hiddenNotes.push([p.x,p.y,d.k,d.x,d.y].join('|'))}
const ss=L.decor.filter(d=>/^hgdpc_ss/.test(d.k||'')).map(d=>+(NPC_H[d.k]*d.sc).toFixed(2));
const notes=L.decor.filter(d=>d.hgs&&zoneOf(d));const wallNotes=notes.filter(d=>d.pic).length;
const nolabel=L.decor.filter(d=>/^(hgd_note|hgd_pa_note|hgdb_note|hgdb_post|hgd_sign)$/.test(d.npc||'')&&zoneOf(d)&&!(d.label||d.hgt)).map(d=>d.x+','+d.y);
const outl={};for(const d of L.decor){if(!zoneOf(d)||d.npc||!NPC_H[d.k]||d.pic)continue;const h=NPC_H[d.k]*(d.sc||1);if(!/tree|house|hut|statue|vine|fountain|stall|shelf|banner|lamp|post|bookshelf|clock|bunk|hgxstat|shellstatue|crys|plinth|spire/.test(d.k)&&h>1.05&&!/^hgdpc_/.test(d.k))outl[d.k]=Math.max(outl[d.k]||0,+h.toFixed(2))}
const dash=L.decor.filter(d=>/[—–]/.test(JSON.stringify([d.label,d.text,d.txt,d.pbt]))).length;
const blockedNpc=people.filter(p=>![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>open(p.x+a,p.y+b)&&!L.decor.some(d=>d.block&&d.x===p.x+a&&d.y===p.y+b))).map(p=>p.npc);
return {people:people.length,hidden,hiddenNotes,ss:[Math.min(...ss),Math.max(...ss),ss.length],notes:notes.length,wallNotes,standNotes:notes.length-wallNotes,nolabel,outl,dash,blockedNpc,stats:L._hgdpc2.stats&&{hid:L._hgdpc2.stats.hidersMoved}}}
