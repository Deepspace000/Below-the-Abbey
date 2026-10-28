import time,json,sys
from playwright.sync_api import sync_playwright
def start(p):
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8335/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=90000);pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t',timeout=120000);pg.wait_for_timeout(3000)
    return b,pg,errs
