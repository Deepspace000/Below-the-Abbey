import sys;sys.path.insert(0,'tools/polish')
from text_lib import *
with sync_playwright() as p:
    b,pg,errs=start(p)
    print(pg.evaluate('''()=>{const L=LEVELS[475];return [LEVEL,G.decor.length,L.decor.filter(d=>d.hgt&&/post|hanging|warning/.test(d.hgtBase)).map(d=>[d.x,d.y,d.hgtBase,d.pic,d.k,L.rows[d.y][d.x]]),G.decor.filter(d=>d.hgt&&/post|hanging|warning/.test(d.hgtBase)).length]}'''),errs[:2]);b.close()
