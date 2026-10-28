(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows,Z=(x,y)=>M.bio[y*W+x]>=4;const D=[[0,-1],[1,0],[0,1],[-1,0]];
const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);
const out={};
// dead ends per biome
const de={4:[],5:[],6:[],7:[]};
for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!Z(x,y)||!op(x,y))continue;let c=0,o;for(const d of D)if(op(x+d[0],y+d[1])){c++;o=d}if(c!==1)continue;const b=M.bio[y*W+x];if(de[b]&&de[b].length<400)de[b].push([x,y,o])}
out.de=[];for(const b of [4,5,6,7]){const a=de[b];for(const i of [Math.floor(a.length*.2),Math.floor(a.length*.6)]){const [x,y,o]=a[i];let s=3;while(s>0&&!op(x+o[0]*s,y+o[1]*s))s--;out.de.push(['de'+b+'_'+x+'_'+y,x+o[0]*s,y+o[1]*s,fi(-o[0],-o[1])])}}
// waysides: decor with _pbv and ox/oy
const way=L.decor.filter(d=>d._pbv&&!d.pic&&(d.ox||d.oy)&&Z(d.x,d.y));out.way=[];
const seen=new Set();for(const d of way){const key=Math.floor(d.x/10)+','+Math.floor(d.y/10);if(seen.has(key))continue;seen.add(key);if(out.way.length>=8)break;
 for(const o of D){if(!op(d.x+o[0],d.y+o[1]))continue;let s=3;while(s>0&&!op(d.x+o[0]*s,d.y+o[1]*s))s--;const[ax,ay]=[d.x+o[0]*s,d.y+o[1]*s];out.way.push(['way_'+d.x+'_'+d.y+'_'+M.bio[d.y*W+d.x],ax,ay,fi(-o[0],-o[1])]);break}}
// shops and people
const ppl=L.decor.filter(d=>d.npc&&!d.pic&&Z(d.x,d.y)&&!/^hgdb_|note|sign|plaque/.test(d.npc));out.ppl=ppl.length;
out.q=[];const sel=[0.1,0.3,0.5,0.7,0.9].map(f=>ppl[Math.floor(ppl.length*f)]);for(const d of sel){for(const o of D){if(!op(d.x+o[0],d.y+o[1]))continue;let s=2;while(s>0&&!op(d.x+o[0]*s,d.y+o[1]*s))s--;out.q.push(['ppl_'+d.npc+'_'+d.x+'_'+d.y,d.x+o[0]*s,d.y+o[1]*s,fi(-o[0],-o[1])]);break}}
// posts viewed from 2 cells away
out.pv=[];for(const d of L.decor.filter(d=>d.npc==='hgdb_post').slice(0,0)){}
return out})()
