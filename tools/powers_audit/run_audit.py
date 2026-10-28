"""Powers audit. Own server: python -m http.server 8357 (repo root).   python tools/powers_audit/run_audit.py before|after [N]"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PA_PORT', '8357')
HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
N = int(sys.argv[2]) if len(sys.argv) > 2 else 3
LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80]
URL = 'http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time())
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' and 'ERR_CONNECTION' not in m.text else None)
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=120000)
    pg.wait_for_timeout(1500)
    pg.evaluate(open(os.path.join(HERE, 'audit.js'), encoding='utf-8').read())
    ncls = pg.evaluate("()=>CLASSES.length")
    res = []
    for ci in range(ncls):
        for L in LEVELS:
            res.append(pg.evaluate("([c,L,N])=>window.__pa.measure(c,L,N,true)", [ci, L, N]))
        print('class', ci, 'done', flush=True)
    json.dump({'res': res, 'errs': errs}, open(os.path.join(HERE, 'raw_%s.json' % tag), 'w'), indent=0)
    print('errors', errs[:10])
    b.close()
