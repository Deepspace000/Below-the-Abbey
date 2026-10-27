"""Witch's Wood test: python tools/ww_test.py [shots] (needs a server on port 8374: python -m http.server 8374 from the repo root)
Loads the game at the wood (?town=witchwood&lvl=82), prints console errors and checks, and with 'shots' takes screenshots of many places into _ww_shots/."""
import sys, json, pathlib, os, time
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / '_ww_shots'; OUT.mkdir(exist_ok=True)
URL = 'http://localhost:8374/index.html?town=witchwood&lvl=82&v=%d' % time.time()
shots = 'shots' in sys.argv
def run(pg, js, arg=None):
    return pg.evaluate(js, arg) if arg is not None else pg.evaluate(js)
if __name__ == '__main__':
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
        pg = b.new_page(viewport={'width': 1100, 'height': 760})
        logs = []
        pg.on('console', lambda m: logs.append((m.type, m.text)) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
        pg.on('pageerror', lambda e: logs.append(('pageerror', str(e))))
        pg.on('response', lambda r: logs.append(('404', r.url)) if r.status == 404 and 'icn_' not in r.url and '/sp_' not in r.url else None)
        pg.goto(URL)
        pg.wait_for_timeout(9000)
        st = pg.evaluate("() => ({lv: LEVEL, state: G.state, built: !!LEVELS[520], px: G.P&&G.P.x, py: G.P&&G.P.y, info: LEVELS[520]&&{decor:LEVELS[520]._ww.decor, foes:LEVELS[520]._ww.foes, removed:LEVELS[520]._ww.removed, dead:LEVELS[520]._ww.dead}})")
        print('state', st)
        places = json.loads(os.environ.get('WW_PLACES', 'null')) or [['gate', 27, 52, 0], ['gate2', 27, 49, 0]]
        if shots:
            for name, x, y, f in places:
                pg.evaluate("([x,y,f]) => { G.P.x=x; G.P.y=y; G.P.f=f; G.P.angT=(f-1)*Math.PI/2; G.C={x,y,a:G.P.angT}; G.lvlBanners.length=0; G.msgs=[]; }", [x, y, f])
                pg.wait_for_timeout(900)
                pg.screenshot(path=str(OUT / (name + '.png')))
        for t, m in logs[:40]:
            print(t, m[:300])
        b.close()
