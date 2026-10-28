import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
js=sys.argv[1]
with sync_playwright() as p:
    b,pg,errs=boot(p,700,450)
    r=pg.evaluate(js)
    print(json.dumps(r)[:6000]);print([e for e in errs if 'Failed to load' not in e][:3]);b.close()
