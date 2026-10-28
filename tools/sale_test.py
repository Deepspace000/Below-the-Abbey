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
    pg.on('console', lambda m: logs.append((m.type, m.text)) if m.type == 'error' and not m.text.startswith('Failed to load resource') else None)   # the old icn_/sp_ 404s are not ours; our own 404s are caught by the response handler
    pg.on('pageerror', lambda e: logs.append(('pageerror', str(e))))
    pg.on('response', lambda r: logs.append(('404', r.url)) if r.status == 404 and ('/assets/sa/' in r.url or 'sale' in r.url) else None)   # only our own missing files; older 404s (icn_, sp_, af_) are not ours
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
    if mode == 'shots2':
        import base64
        # a barricaded shop seen from the street, then the same after the quest, then the inside, the dead, the Sanctuary, the small levels
        setpos(pg, 9, 36, 0); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / 'bar_general.png'))
        setpos(pg, 16, 36, 0); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / 'bar_armour.png'))
        setpos(pg, 7, 36, 0); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / 'bar_street.png'))
        pg.evaluate("() => { const q='sa2'; qAccept(q); G.flags.k_saranulf=1; qTurnIn(q); G.flags.sa_met_armour=1; }")
        setpos(pg, 17, 36, 0); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / 'open_armour.png'))
        pg.evaluate("() => { const h=SA_HOUSES.find(h=>h.spk==='armour'); goToLevel(h.id, KH_DOOR[SA.dgid[h.id].door].at); }")
        pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'in_armour.png'))
        pg.evaluate("() => { const h=SA_HOUSES.find(h=>h.spk==='tavern'); G.flags.sa_open_tavern=1; goToLevel(h.id, KH_DOOR[SA.dgid[h.id].door].at); }")
        pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'in_tavern.png'))
        pg.evaluate("() => goToLevel(600, {x:20,y:44,f:2})"); pg.wait_for_timeout(2500)
        pg.evaluate("() => { const e=G.enemies.find(e=>e.t==='saghoul'); G.P.x=e.x; G.P.y=e.y-2; G.P.f=2; G.P.angT=(2-1)*Math.PI/2; G.C={x:G.P.x,y:G.P.y,a:G.P.angT}; G.msgs=[]; }")
        pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / 'dead_ghoul.png'))
        pg.evaluate("() => { const e=G.enemies.find(e=>e.t==='saranulf'); G.P.x=e.x-1; G.P.y=e.y-3; G.P.f=2; G.P.angT=(2-1)*Math.PI/2; G.C={x:G.P.x,y:G.P.y,a:G.P.angT}; G.msgs=[]; }")
        pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / 'dead_ranulf.png'))
        for lv, x, y, f, nm in [(601, 2, 7, 1, 'cellar'), (602, 2, 7, 1, 'crypt'), (603, 6, 18, 0, 'belfry')]:
            pg.evaluate("([lv,x,y,f]) => goToLevel(lv, {x:x,y:y,f:f})", [lv, x, y, f]); pg.wait_for_timeout(2200); pg.screenshot(path=str(OUT / (nm + '.png')))
            pg.evaluate("() => { G.P.x+= 0; }")
        # the maps
        S = 3
        JS_AREA = """async (S)=>{G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=false;
         await new Promise(r=>setTimeout(r,2500));
         const w0=cv.width,h0=cv.height; cv.width=w0*S/2; cv.height=h0*S/2; render3D(); ctx.setTransform(S,0,0,S,0,0); ui(.016); const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return d}"""
        pg.evaluate("() => { goToLevel(600, {x:36,y:36,f:3}); }"); pg.wait_for_timeout(2500)
        (OUT / 'map_area.png').write_bytes(base64.b64decode(pg.evaluate(JS_AREA, S).split(',')[1]))
        pg.evaluate("() => { G.overview=false; qAccept('sa1'); qAccept('sa3'); }")
        (OUT / 'map_area2.png').write_bytes(base64.b64decode(pg.evaluate(JS_AREA, S).split(',')[1]))
        JS_WORLD = JS_AREA.replace("G.world=false;", "G.world=true;G.wv=wvDefault();G._wvT=G.time;")
        (OUT / 'map_world.png').write_bytes(base64.b64decode(pg.evaluate(JS_WORLD, S).split(',')[1]))
    if mode in ('all', 'quests'):
        exec(open(ROOT / 'tools' / 'sale_checks.py').read())
    for t, m in logs[:40]:
        print('LOG', t, m[:300])
    check('no console errors', not logs, len(logs))
    b.close()
if mode == 'all': print('FAILS:', fails if fails else 'none')
