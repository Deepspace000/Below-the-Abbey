from playwright.sync_api import sync_playwright
import sys,time
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page()
    errs=[]
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)[:400]))
    pg.on('console',lambda m: errs.append(m.text[:300]) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8343/index.html?town=deephollow&lvl=34&v=%d'%int(time.time()),wait_until='commit')
    pg.wait_for_timeout(int(sys.argv[1]) if len(sys.argv)>1 else 30000)
    print(errs[:8]); print(pg.evaluate('typeof G!=="undefined"?G.state:"noG"'))
    b.close()
