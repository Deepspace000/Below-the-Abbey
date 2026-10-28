"""The Vault of Maldrake: headless tests on your OWN server (python -m http.server 8473 from the repo root; stop only that process by its PID).
    python tools/vault_test.py struct      every level builds, stairs link both ways, nothing is unreachable, the people and quests exist
    python tools/vault_test.py sympathy    the whole chain with the Silver Contract: hill, five floors, archive, sanctum, the ring broken, Hale, a save and a load
    python tools/vault_test.py fight       the same with the fight (boss health low for the test), phases, the key from his body, a save in the middle of the fight
    python tools/vault_test.py shots       screenshots of the hill, a corridor, the coffin ring, the sanctum and the boss (into %TEMP%/vault_shots)
    python tools/vault_test.py maps        the parchment maps of all nine levels
    python tools/vault_test.py all         struct, sympathy, fight
Environment: VT_PORT (8473), BTA_CHROME or VT_CHROME (the path of an installed Chrome), VT_SHOTS (the screenshot folder).
Exit code 0 when no line starts with FAIL. Pages take 20 to 40 seconds to start; sympathy and fight take two to four minutes each.
"""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('VT_PORT', '8473')
CHROME = os.environ.get('BTA_CHROME') or os.environ.get('VT_CHROME') or 'C:/Program Files/Google/Chrome/Application/chrome.exe'
SHOTS = os.environ.get('VT_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'vault_shots'))
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'struct'
NOISE = ('assets/sp_', 'assets/icn_', 'Failed to load resource', 'hgtm model', 'willReadFrequently')


def boot(p, query='town=vault&lvl=88', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=CHROME)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 and 'assets/sp_' not in r.url and 'assets/icn_' not in r.url else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, query, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9670", timeout=150000)
    pg.wait_for_timeout(3000)
    return b, pg, errs


def clean(errs):
    return [e for e in errs if not any(n in e for n in NOISE)]


def run_js(mode, query='town=vault&lvl=88'):
    js = open(os.path.join(HERE, 'vault_qtest.js'), encoding='utf-8').read()
    with sync_playwright() as p:
        b, pg, errs = boot(p, query)
        pg.evaluate("m=>{window.__vtMode=m}", mode)
        log = pg.evaluate(js)
        for l in log:
            print(l)
        bad = [l for l in log if l.startswith('FAIL')]
        print('---', mode, ': %d checks, %d FAIL' % (len(log), len(bad)))
        print('console errors:', clean(errs)[:12])
        b.close()
        return len(bad) + len(clean(errs))


def shot(pg, name):
    path = os.path.join(SHOTS, name + '.png')
    pg.screenshot(path=path)
    print('shot', path)


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('01_hill_picket', 9670, 30, 44, 0), ('02_hill_road', 9670, 10, 45, 3), ('03_hill_path', 9670, 34, 36, 0), ('04_hill_terrace', 9670, 34, 18, 0), ('05_hill_front', 9670, 34, 14, 0),
    ('06_stair_vestibule', 9671, 14, 2, 2), ('07_hall_of_guards', 9671, 14, 9, 2), ('08_warden', 9671, 14, 19, 2), ('09_corridor_plates', 9671, 14, 16, 2),
    ('10_ring_of_coffins', 9672, 15, 16, 2), ('11_ring_rune', 9672, 15, 21, 0), ('12_bell_gallery', 9673, 12, 9, 0), ('13_bells_far', 9673, 7, 11, 1),
    ('14_needles', 9674, 7, 12, 3), ('15_hall_of_underhill', 9675, 18, 8, 2), ('16_chapel', 9675, 9, 23, 0), ('17_stair_of_quiet', 9676, 14, 5, 2), ('18_hall_of_plates', 9676, 14, 16, 2),
    ('19_sanctum', 9677, 12, 15, 0), ('20_archive', 9678, 10, 13, 0)]


def run_shots():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for name, lv, x, y, f in PLACES:
            pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
            pg.wait_for_timeout(4000)
            pg.evaluate("() => { G.talk=null; G.msgs=[]; }")
            pg.wait_for_timeout(300)
            shot(pg, name)
        # the boss: the sanctum with Maldrake as a creature, in front of him
        pg.evaluate("() => { G.menu=false; G.talk=null; goToLevel(9677,{x:12,y:11,f:0}); G.state='play'; }")
        pg.wait_for_timeout(3500)
        pg.evaluate("() => { G.talk=null; vtMaldrakeFight(); G.P.x=12; G.P.y=10; G.P.f=0; G.P.angT=-Math.PI/2; G.C.a=G.P.angT; G.msgs=[]; }")
        pg.wait_for_timeout(2500)
        pg.evaluate("() => { G.talk=null; G.msgs=[]; }")
        shot(pg, '21_boss_maldrake')
        print('errors', clean(errs)[:10])
        b.close()


def run_maps():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for lv in range(9670, 9679):
            pg.evaluate("([lv]) => { G.menu=false; G.talk=null; if(!LEVELS[lv]&&KH_LAZY[lv])KH_LAZY[lv](); const st=LEVELS[lv].start; goToLevel(lv,{x:st.x,y:st.y,f:st.f||0}); G.state='play'; }", [lv])
            pg.wait_for_timeout(3200)
            pg.evaluate("() => { G.talk=null; G.flags.noFog=true; G.overview=true; }")
            pg.wait_for_timeout(1800)
            shot(pg, 'map_%d' % lv)
            pg.evaluate("() => { G.overview=false; delete G.flags.noFog; }")
        print('errors', clean(errs)[:10])
        b.close()


rc = 0
if what in ('struct', 'all'):
    rc += run_js('struct')
if what in ('sympathy', 'all'):
    rc += run_js('sympathy')
if what in ('fight', 'all'):
    rc += run_js('fight')
if what == 'shots':
    run_shots()
if what == 'maps':
    run_maps()
sys.exit(1 if rc else 0)
