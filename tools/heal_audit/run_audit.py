"""Heal audit. Own server:  python -m http.server 8358 (repo root).   python tools/heal_audit/run_audit.py before|after"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('HEAL_PORT', '8358')
HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80]
URL = 'http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time())
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=120000)
    pg.wait_for_timeout(2500)
    pg.evaluate(open(os.path.join(HERE, 'audit.js')).read())
    res = [pg.evaluate("(L)=>window.__healAudit(L,30)", L) for L in LEVELS]
    json.dump({'res': res, 'errs': errs}, open(os.path.join(HERE, 'raw_%s.json' % tag), 'w'), indent=1)
    print('errors', errs[:10])
    b.close()
