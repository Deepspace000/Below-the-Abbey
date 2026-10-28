"""Dump the power inventory to inventory_<tag>.json.   python tools/powers_audit/dump_inventory.py before|after   (own server on PORT)"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PA_PORT', '8357')
HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
URL = 'http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time())
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto(URL, wait_until='domcontentloaded', timeout=300000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=420000)
    pg.wait_for_timeout(1500)
    rows = pg.evaluate(open(os.path.join(HERE, 'inventory.js'), encoding='utf-8').read())
    json.dump({'rows': rows, 'errs': errs}, open(os.path.join(HERE, 'inventory_%s.json' % tag), 'w'), indent=1)
    print(len(rows), 'rows; errors', errs[:5])
    b.close()
