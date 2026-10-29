"""python tools/polish/blight56_run.py [town] : runs blight56_check.js (reachability, duplicates, tight spots) on places 5 and 6. Own server BL_PORT (8603)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8603'); town = sys.argv[1] if len(sys.argv) > 1 else 'blight5'
js = open(sys.argv[2] if len(sys.argv)>2 else 'tools/polish/blight56_check.js', encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or 'C:/Program Files/Google/Chrome/Application/chrome.exe')
    pg = b.new_page(viewport={'width': 900, 'height': 600}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2500)
    d = pg.evaluate(js)
    if isinstance(d, str): print(d); d = {}
    for k, v in d.items():
        print(k)
        for x in v: print('  ', x[:600])
    print('errs', [e for e in errs if 'Failed to load' not in e and 'assets/sp_' not in e][:8])
    b.close()
