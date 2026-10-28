import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
with sync_playwright() as p:
    b,pg,errs=boot(p,700,450)
    r=pg.evaluate("""()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,bio=M.bio,o=[];const seen={};
      for(const e of L.enemies){if(bio[e.y*W+e.x]>=4)continue;const k=e.t;if(seen[k])continue;seen[k]=1;const d=ENEMY_DEF[k]||{};const im=IMG[d.img||d.k||k]||IMG[k];
        o.push([k,d.w,d.img,d.hp,d.name,im?im.width+'x'+im.height:'noimg',im&&d.w?Math.round(d.w*im.height/im.width*100)/100:null,Object.keys(d).join(',')])}
      return o}""")
    for x in r: print(x)
    b.close()
