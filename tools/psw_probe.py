"""Run JS (an async arrow function in a file) in the game on your own server: python tools/psw_probe.py file.js [out.png]. A returned 'url' (data URL) is saved as the png."""
import sys, os, json, time, base64
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PSW_PORT', '8625')
js = open(sys.argv[1], encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, os.environ.get('PSW_Q', 'town=vault&lvl=88'), time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9670", timeout=150000)
    pg.wait_for_timeout(2000)
    r = pg.evaluate(js)
    if isinstance(r, dict) and 'url' in r and len(sys.argv) > 2:
        open(sys.argv[2], 'wb').write(base64.b64decode(r.pop('url').split(',')[1]))
    print(json.dumps(r, indent=1)[:6000]); print('errs', errs[:5]); b.close()
