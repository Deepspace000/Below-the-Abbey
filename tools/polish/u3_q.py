import sys
sys.path.insert(0,'tools/polish')
from d2_load import *
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]()}')
    for js in sys.argv[1:]:
        print(js[:60],'=>',pg.evaluate(js))
    print(errs[:5]); b.close()
