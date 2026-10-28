import sys,time;sys.path.insert(0,'tools/polish')
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page();e=[]
    pg.on('pageerror',lambda x:e.append(str(x)[:300]));pg.on('console',lambda m:e.append(m.text[:200]) if m.type=='error' else None)
    pg.goto('http://localhost:8335/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit');pg.wait_for_timeout(25000)
    print(e[:6],pg.evaluate('typeof LOAD!=="undefined"?[LOAD.t,LOAD.d]:null'));b.close()
