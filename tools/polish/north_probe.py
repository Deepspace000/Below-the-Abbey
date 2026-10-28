import sys,os,time; sys.path.insert(0,os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader']); pg=b.new_page(viewport={'width':900,'height':560})
    errs=[]; pg.on('pageerror',lambda e:errs.append('PAGE '+str(e))); pg.on('console',lambda m:errs.append('CON '+m.text[:150]) if m.type=='error' else None)
    pg.goto('http://localhost:8340/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='domcontentloaded',timeout=90000)
    for i in range(12):
        pg.wait_for_timeout(5000)
        print(i,pg.evaluate("()=>typeof G!=='undefined'?[G.state,typeof LEVEL!=='undefined'?LEVEL:-1]:'noG'"))
    print([e for e in errs if 'Failed to load' not in e][:8]); b.close()
