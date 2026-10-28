"""Sale test: python tools/sale_test.py [smoke|all|shots|quests]   (needs a server: python -m http.server 8433 from the repo root; set BTA_CHROME to an installed Chrome if wanted)
smoke  loads the game at Sale and prints console errors and the state of the level
all    the checks below, printed as ok / FAIL lines:
         the town builds with zero errors; every shop door is barricaded at the start and cannot be entered; the Sanctuary is barred;
         every road square and every door front can be walked to from the entrance (flood fill over the real level); no person stands in a road;
         each of the ten trust quests can be taken and completed, the planks come down, the shop opens, sells and can be entered; saves keep it;
         the dead are hostile only in their zones; the three small levels build; the stubs and the east gate work
shots  screenshots of the square, a barricaded shop, an opened shop, a street with the dead, the Sanctuary door, the quarter, the farm -> _sale_shots/
"""
import sys, os, json, pathlib, time
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / '_sale_shots'; OUT.mkdir(exist_ok=True)
PORT = os.environ.get('SA_PORT', '8433')
URL = 'http://localhost:%s/index.html?town=sale&lvl=90&v=%d' % (PORT, time.time())
mode = sys.argv[1] if len(sys.argv) > 1 else 'smoke'
fails = []
def check(name, ok, extra=''):
    print(('ok   ' if ok else 'FAIL ') + name + ((' ' + str(extra)) if extra != '' else ''))
    if not ok: fails.append(name)
def launch(p):
    kw = {'args': ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required']}
    if os.environ.get('BTA_CHROME'): kw['executable_path'] = os.environ['BTA_CHROME']
    return p.chromium.launch(**kw)
def setpos(pg, x, y, f):
    pg.evaluate("([x,y,f]) => { G.talk=null; G.P.x=x; G.P.y=y; G.P.f=f; G.P.angT=(f-1)*Math.PI/2; G.C={x:x,y:y,a:G.P.angT}; G.lvlBanners.length=0; G.msgs=[]; }", [x, y, f])

SHOTS = [('arrival', 67, 36, 3), ('square', 36, 36, 3), ('square_n', 34, 33, 0), ('sanctuary', 34, 31, 0), ('street_w', 28, 36, 3), ('shop_general', 9, 36, 0), ('shop_armour', 17, 36, 0), ('shop_tavern', 44, 36, 2),
         ('bell_lane', 57, 30, 0), ('belfry', 57, 22, 0), ('charnel_row', 20, 40, 2), ('dead_quarter', 20, 47, 2), ('quarter_b', 20, 54, 2), ('farm', 56, 61, 0), ('tanners', 53, 42, 2), ('backtrack', 38, 61, 3), ('gibbet', 36, 34, 1), ('fountain', 35, 36, 2)]

with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    logs = []
    pg.on('console', lambda m: logs.append((m.type, m.text)) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: logs.append(('pageerror', str(e))))
    pg.on('response', lambda r: logs.append(('404', r.url)) if r.status == 404 and 'icn_' not in r.url and 'sp_' not in r.url else None)
    pg.goto(URL)
    pg.wait_for_function("() => typeof G!=='undefined' && G.state==='play' && typeof LEVEL!=='undefined' && LEVEL===600", timeout=120000)
    pg.wait_for_timeout(2500)
    st = pg.evaluate("() => ({lv: LEVEL, state: G.state, built: !!LEVELS[600], px: G.P.x, py: G.P.y, f: G.P.f, houses: SA_HOUSES.length, decor: G.decor.length, enemies: G.enemies.length, items: G.items.length})")
    print('state', st)
    if mode == 'smoke':
        pg.screenshot(path=str(OUT / 'smoke.png'))
    if mode == 'shots':
        for name, x, y, f in SHOTS:
            setpos(pg, x, y, f); pg.wait_for_timeout(900)
            pg.screenshot(path=str(OUT / (name + '.png')))
    if mode in ('all', 'quests'):
        exec(open(ROOT / 'tools' / 'sale_checks.py').read())
    for t, m in logs[:40]:
        print('LOG', t, m[:300])
    check('no console errors', not logs, len(logs))
    b.close()
if mode == 'all': print('FAILS:', fails if fails else 'none')
