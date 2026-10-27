import time,json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-gl=swiftshader","--mute-audio"])
    pg=b.new_page(viewport={'width':800,'height':600})
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    t=time.time()
    pg.goto('http://localhost:8398/index.html')
    pg.wait_for_function('window.__ready===true',timeout=120000)
    print('load',time.time()-t)
    print(pg.evaluate('({s:G.state,ready:window.__ready,heroes:G.heroes.length,lvl:typeof LEVEL!=="undefined"?LEVEL:null,ver:typeof VERSION!=="undefined"?VERSION:null})'))
    print(errs[:10])
    b.close()
