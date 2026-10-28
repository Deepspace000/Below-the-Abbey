import sys, json, time
from playwright.sync_api import sync_playwright
js=open(sys.argv[1]).read()
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8344/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=240000); pg.wait_for_timeout(12000)
    print(json.dumps(pg.evaluate(js))[:6000]); print('errs',errs[:5]); b.close()
