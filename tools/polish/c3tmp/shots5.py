import sys, json
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    r=pg.evaluate('''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476];const ch={};const pos={};
      L.rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=r[x];if(c!=='.'&&c!=='#'){ch[c]=(ch[c]||0)+1;(pos[c]=pos[c]||[]).push([x,y])}}});
      const lads=L._hgdu.ladders.map(a=>({a:[a.ax,a.ay],ch:L.rows[a.ay][a.ax],foot:L.rows[a.y][a.x],ex:Object.keys(L).filter(k=>/up|down|exit|stair|lad/i.test(k))}));
      return {ch,pos:Object.fromEntries(Object.entries(pos).map(([k,v])=>[k,v.slice(0,14)])),lads:lads.slice(0,3),exits:Object.keys(L)}}''')
    print(json.dumps(r)[:2500]); b.close()
