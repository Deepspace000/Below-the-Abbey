import sys, json, time
from playwright.sync_api import sync_playwright
PORT='8373'
def open_level(p, vw=960, vh=720):
    b = p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width':vw,'height':vh})
    errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('http://localhost:%s/index.html?town=deephollow&lvl=34&v=%d'%(PORT,int(time.time())),wait_until='commit',timeout=280000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"', timeout=280000)
    pg.wait_for_timeout(2500)
    return b,pg,errs
