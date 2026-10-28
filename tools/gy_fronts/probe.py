import sys, json
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
with sync_playwright() as p:
    b, pg, errs = boot(p)
    r = pg.evaluate("""() => { const L=LEVELS[530], out={doors:[], keys:{}};
      const ch=L.chars||{}; 
      for(let y=0;y<L.rows.length;y++)for(let x=0;x<L.rows[y].length;x++){const c=L.rows[y][x];const gid=ch[c];if(gid!==undefined&&KH_DOOR[gid])out.doors.push([x,y,gid,KH_DOOR[gid].lvl,KH_DOOR[gid].gy])}
      const cnt={};for(const d of L.decor){cnt[d.k]=(cnt[d.k]||0)+1}
      out.decor=cnt; out.missing=Object.keys(cnt).filter(k=>!IMG[k]&&!NPC_H[k]);
      out.crypts=L.decor.filter(d=>/crypt|tomb|vault|gate|arch|stair|hatch|laid|lych/.test(d.k)).map(d=>[d.k,d.x,d.y,d.sc,!!IMG[d.k],d.npc]);
      return out}""")
    print(json.dumps(r))
    print(errs[:10]); b.close()
