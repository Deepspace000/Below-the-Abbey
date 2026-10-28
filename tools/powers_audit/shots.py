"""Screenshots of the Powers page for every class at levels 1, 40 and 80 (ladder with costs).  python tools/powers_audit/shots.py [tag]
Own server: python -m http.server 8357 (repo root)."""
import os, sys, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PA_PORT', '8357')
HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1] if len(sys.argv) > 1 else 'after'
OUT = os.path.join(HERE, 'shots_' + tag)
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    failed = []
    pg.on('requestfailed', lambda r: failed.append(r.url))
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' and 'ERR_CONNECTION' not in m.text else None)
    pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=300000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=420000)
    pg.wait_for_timeout(2500)
    pg.evaluate(open(os.path.join(HERE, 'audit.js'), encoding='utf-8').read())
    names = pg.evaluate("()=>CLASSES.map(c=>c.name)")
    for ci, nm in enumerate(names):
        for L in (1, 40, 80):
            pg.evaluate("([c,L])=>{window.__pa.mkHero(c,L);G.msgs=[];openInv(0);G.inv.tab='powers';G.inv.pw=0}", [ci, L])
            pg.wait_for_timeout(500)
            pg.screenshot(path=os.path.join(OUT, '%02d_%s_L%d.png' % (ci, nm, L)))
        print(nm, flush=True)
    print('page errors', errs[:10])
    print('failed requests (not errors in the game):', sorted(set(failed))[:6])
    b.close()
