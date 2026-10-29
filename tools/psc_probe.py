"""Courtyard probe: python tools/psc_probe.py file.js [shot.png] (arrow function in file; runs after the game booted in the blight 1 jump). Env PSC_PORT (8623), BTA_CHROME."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PSC_PORT', '8623')
js = open(sys.argv[1], encoding='utf-8').read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': int(os.environ.get('BL_W','900')), 'height': int(os.environ.get('BL_H','600'))})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight1&lvl=84&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=40000)
    except Exception as e:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(2500)
    r = pg.evaluate(js)
    if isinstance(r, str) and r.startswith('WAIT'):
        try:
            pg.wait_for_function("()=>LEVEL>=9730&&LEVEL<9740&&G.state==='play'", timeout=90000)
        except Exception as e:
            print('WAIT FAILED', errs[:6])
        pg.wait_for_timeout(2500)
        if os.environ.get('PSC_AFTER'):
            r2 = pg.evaluate(open(os.environ['PSC_AFTER'], encoding='utf-8').read())
            print(json.dumps(r2, indent=1)[:14000])
            pg.wait_for_timeout(800)
    print(json.dumps(r, indent=1)[:14000])
    if len(sys.argv) > 2:
        pg.screenshot(path=sys.argv[2])
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
