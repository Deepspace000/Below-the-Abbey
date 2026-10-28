import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    pg.on('console',lambda m:print('C',m.type,m.text[:150],flush=True))
    pg.on('pageerror',lambda e:print('PE',str(e)[:200],flush=True))
    t=time.time()
    pg.goto('http://localhost:8362/index.html?town=deephollow&lvl=34&v=%d'%t,wait_until='commit',timeout=90000)
    for i in range(40):
        pg.wait_for_timeout(5000)
        try: print(int(time.time()-t),pg.evaluate('()=>typeof LOAD==="undefined"?"nolad":JSON.stringify([LOAD.t,LOAD.d])'),flush=True)
        except Exception as e: print('ex',str(e)[:100],flush=True)
        if i>3 and False: break
    b.close()
