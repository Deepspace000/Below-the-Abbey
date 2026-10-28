import sys, os, json, time
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8357/index.html?town=thornwick&lvl=1&v=%d' % time.time()
js = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=120000)
    pg.wait_for_timeout(1500)
    print(json.dumps(pg.evaluate(open(js).read()), indent=0)[:6000])
    print(errs[:5])
    b.close()
