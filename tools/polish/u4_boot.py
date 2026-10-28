import sys,time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':960,'height':720});errs=[]
    pg.on('console',lambda m: errs.append(m.text[:200]) if m.type=='error' else None);pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)[:300]))
    pg.goto('http://localhost:8322/index.html?town=deephollow&lvl=34&v=%d'%int(time.time()),wait_until='commit',timeout=60000)
    try:
        pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"',timeout=70000);print('PLAY')
    except Exception as e: print('NOPLAY',str(e)[:80])
    print(errs[:6]); b.close()
