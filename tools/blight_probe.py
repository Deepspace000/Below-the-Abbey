"""Run a bit of JavaScript in the game: python tools/blight_probe.py "town=blight1&lvl=84" file.js [shot.png]
Env: BL_PORT (own server, default 8391), BTA_CHROME (path of Chrome). The JS file holds an arrow function; its result is printed as JSON."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8391')
url = sys.argv[1]
js = open(sys.argv[2], encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, url, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=120000)
    pg.wait_for_timeout(2500)
    r = pg.evaluate(js)
    print(json.dumps(r, indent=1)[:12000])
    if len(sys.argv) > 3:
        pg.screenshot(path=sys.argv[3])
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
