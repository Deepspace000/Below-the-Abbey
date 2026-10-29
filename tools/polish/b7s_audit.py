"""python tools/polish/b7s_audit.py <before|after> : audits Sale + Vault levels. Port B7_PORT (8605)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
port = os.environ.get('B7_PORT', '8605'); tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
HERE = os.path.dirname(os.path.abspath(__file__))
js = open(os.path.join(HERE, 'b7s_audit.js'), encoding='utf8').read()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('BTA_CHROME', 'C:/Program Files/Google/Chrome/Application/chrome.exe'), args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    out = {}
    only = os.environ.get('B7_ONLY', '')
    for q, ids in tuple(x for x in (('?town=sale&lvl=90', [600, 601, 602, 603] + list(range(7201, 7216)) + [7299]), ('?town=vault&lvl=88', list(range(9670, 9679)))) if only in x[0]):
        pg = b.new_page(viewport={'width': 900, 'height': 600}); errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
        pg.goto('http://localhost:%s/index.html%s&v=%d' % (port, q, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=600", timeout=150000)
        pg.wait_for_timeout(3000)
        pg.evaluate("ids=>{window.__ids=ids}", ids)
        r = pg.evaluate(js)
        out.update(r); out['errs_' + q] = errs[:20]; pg.close()
    json.dump(out, open(os.path.join(HERE, 'b7s_audit_%s.json' % tag), 'w'), indent=1)
    for k, v in out.items():
        if k.startswith('errs'): print(k, v); continue
        if 'err' in v: print(k, v); continue
        s = {kk: vv for kk, vv in v.items() if kk not in ('_tight', 'doors', 'kinds') and vv not in ([], 0, None, False)}
        print(k, json.dumps(s)[:1100])
    b.close()
