import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None)
    pg.goto('http://localhost:8323/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)
    for i in range(12):
        pg.wait_for_timeout(10000)
        try: print(pg.evaluate("()=>[typeof G!=='undefined'&&G.state,typeof LEVEL!=='undefined'&&LEVEL,typeof LOAD!=='undefined'&&[LOAD.d,LOAD.t]]"),flush=True)
        except Exception as e: print('x',str(e)[:80],flush=True)
    print(errs[:8]); pg.screenshot(path='tools/polish/w4_dbg.png')
