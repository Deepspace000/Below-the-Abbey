import sys, json
sys.path.insert(0,'tools/polish')
from d2_load import *
JS=sys.argv[1]
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();}')
    r=pg.evaluate(JS)
    print(json.dumps(r)[:6000])
    print('errors',[e for e in errs if 'Failed to load' not in e][:6]); b.close()
