import sys, json, os
sys.path.insert(0, os.path.dirname(__file__))
os.environ['A_PORT']='8345'
from a_boot import boot
from playwright.sync_api import sync_playwright
js = open(sys.argv[1]).read()
with sync_playwright() as p:
    b, pg, errs = boot(p)
    r = pg.evaluate(js)
    print(json.dumps(r, indent=1)[:int(sys.argv[2]) if len(sys.argv)>2 else 6000])
    print('ERRS', len(errs), errs[:5])
    b.close()
