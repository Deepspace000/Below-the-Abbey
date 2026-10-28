import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    pg.on('pageerror',lambda e:print('PAGEERR',str(e)[:300],getattr(e,'stack','')[:600]))
    pg.on('console',lambda m:print('CONSOLE',m.type,m.text[:300]) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8332/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=90000);pg.wait_for_timeout(30000)
    print('done')
