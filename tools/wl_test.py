"""Wenlock test: python tools/wl_test.py [shots]  (needs a server on port 8377: python -m http.server 8377 from the repo root)
Loads the game at Wenlock, prints console errors, checks the level, and with 'shots' takes screenshots of many places into _wl_shots/."""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / '_wl_shots'; OUT.mkdir(exist_ok=True)
URL = 'http://localhost:8377/index.html?town=wenlock&lvl=80&v=%d' % __import__('time').time()
shots = 'shots' in sys.argv
PLACES = [('church_a', 24, 31, 0), ('church_b', 30, 32, 3), ('hall_a', 21, 35, 1), ('mill_a', 77, 83, 2), ('windmill', 86, 84, 2), ('barn', 62, 14, 2), ('dove', 55, 43, 0), ('cross2', 48, 51, 0), ('maypole', 20, 58, 2), ('stocks', 34, 55, 2), ('tent', 36, 66, 2), ('arrival', 95, 50, 3), ('highstreet', 70, 50, 3), ('square', 52, 50, 3), ('square_w', 46, 50, 3), ('well', 45, 55, 0), ('green', 30, 52, 2), ('church', 24, 40, 0), ('church_front', 24, 33, 0), ('churchyard', 24, 28, 0), ('green_pond', 31, 60, 2), ('square_cross', 48, 52, 0), ('mayor', 24, 36, 0), ('bridge', 72, 80, 2),
          ('backlane', 60, 14, 1), ('mill', 72, 90, 1), ('lane_green', 84, 40, 0), ('east_gate', 90, 50, 1), ('west', 8, 50, 3), ('pond', 31, 63, 2), ('orchard', 76, 56, 1)]
import os
only=os.environ.get('WL_ONLY')
if only: PLACES=[q for q in PLACES if q[0] in only.split(',')]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    logs = []
    pg.on('console', lambda m: logs.append((m.type, m.text)) if m.type=='error' else None)
    pg.on('pageerror', lambda e: logs.append(('pageerror', str(e))))
    pg.on('response', lambda r: logs.append(('404', r.url)) if r.status==404 else None)
    pg.goto(URL)
    pg.wait_for_timeout(9000)
    for t, m in logs[:10]: print('EARLY', t, m[:400])
    st = pg.evaluate("() => ({lv: typeof LEVEL!=='undefined'?LEVEL:null, state: G.state, built: !!LEVELS[496], px: G.P&&G.P.x, py: G.P&&G.P.y, doors: typeof WL_DOORS!=='undefined'?WL_DOORS.length:0, met: G.flags&&G.flags.wlMet})")
    print('state', st)
    if shots:
        for name, x, y, f in PLACES:
            pg.evaluate("([x,y,f]) => { G.P.x=x; G.P.y=y; G.P.f=f; G.P.angT=(f-1)*Math.PI/2; G.C={x,y,a:G.P.angT}; }", [x, y, f])
            pg.evaluate("() => { G.lvlBanners.length=0; G.msgs=[]; }")
            pg.wait_for_timeout(700)
            pg.screenshot(path=str(OUT / (name + '.png')))
    for t, m in logs[:40]:
        print(t, m[:300])
    b.close()
