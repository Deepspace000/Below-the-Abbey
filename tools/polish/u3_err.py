import sys,time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':960,'height':720}); errs=[]
    pg.on('console',lambda m: errs.append(m.text[:200]) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)[:300]))
    pg.goto('http://localhost:8333/index.html?town=deephollow&lvl=34&v=%d'%int(time.time()),wait_until='commit')
    pg.wait_for_timeout(60000)
    print(pg.evaluate('typeof G!=="undefined"?G.state:"noG"'));print(errs[:10]);b.close()
