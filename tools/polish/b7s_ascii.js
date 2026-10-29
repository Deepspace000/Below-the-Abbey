(()=>{
const out={};
for(const id of window.__ids){
 let L=LEVELS[id];if(!L&&KH_LAZY[id]){try{KH_LAZY[id]();L=LEVELS[id]}catch(e){continue}}if(!L)continue;
 const rows=L.rows.map(r=>r.split('').map(c=>c==='.'?'.':(L.chars&&L.chars[c]!==undefined&&KH_DOOR[L.chars[c]]?'D':'#')));
 const put=(x,y,c)=>{if(rows[y]&&rows[y][x]!==undefined&&rows[y][x]!=='#'&&rows[y][x]!=='D')rows[y][x]=c};
 for(const d of L.decor){if(d.pic)continue;put(d.x,d.y,d.npc?'N':d.block&&!d.walk?'o':'-')}
 for(const i of L.items)put(i.x,i.y,'i');
 for(const e of L.enemies)put(e.x,e.y,'e');
 put(L.start.x,L.start.y,'S');
 out[id]=rows.map((r,y)=>String(y).padStart(2)+' '+r.join('')).join('\n');
}
return out})()
