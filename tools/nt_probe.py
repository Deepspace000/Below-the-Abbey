"""Run a bit of JavaScript in the game and print the whole result: python tools/nt_probe.py "town=neverending&floor=3" file.js [shot.png]
Env: NT_PORT (own server, default 8624), BTA_CHROME. The JS file holds an arrow function (may be async)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('NT_PORT', '8624')
url = sys.argv[1]
js = open(sys.argv[2], encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': int(os.environ.get('NT_W', '900')), 'height': int(os.environ.get('NT_H', '600'))})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, url, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=60000)
    except Exception as e:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(int(os.environ.get('NT_SETTLE', '2500')))
    r = pg.evaluate(js)
    print(json.dumps(r, indent=1))
    if len(sys.argv) > 3:
        pg.screenshot(path=sys.argv[3])
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
