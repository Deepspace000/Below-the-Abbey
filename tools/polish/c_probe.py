import sys, json, time
from playwright.sync_api import sync_playwright
JS = open(sys.argv[1], encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width':1100,'height':760})
    errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8342/index.html?town=deephollow&lvl=34&v=%d'%time.time(), wait_until='commit', timeout=90000); pg.wait_for_timeout(8000); 
    try: pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t',timeout=60000)
    except Exception as e: print('LOADFAIL',errs[:5],pg.evaluate('()=>typeof LOAD!=="undefined"?[LOAD.t,LOAD.d]:"noLOAD"'));b.close();sys.exit(1)
    pg.wait_for_timeout(4000)
    r = pg.evaluate(JS)
    print(json.dumps(r, indent=1) if not isinstance(r,str) else r)
    print('ERRS', errs[:6]); b.close()
