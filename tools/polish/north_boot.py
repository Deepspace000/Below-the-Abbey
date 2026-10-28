import os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('A_PORT', '8320')
def boot(p, w=1000, h=640, extra=''):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=deephollow&lvl=34&v=%d%s' % (PORT, time.time(), extra), wait_until='domcontentloaded', timeout=90000)
    ok=False
    for k in range(90):
        pg.wait_for_timeout(2000)
        try:
            if pg.evaluate("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL===475"):ok=True;break
        except Exception as e: pass
    if not ok: raise Exception('boot timeout: '+str(errs[:4]))
    pg.wait_for_timeout(3000)
    return b, pg, errs
