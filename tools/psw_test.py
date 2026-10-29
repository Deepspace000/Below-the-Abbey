"""Pale Spire package 4 (9750, 9760) tests on your OWN server (python -m http.server 8625 from the repo root).
   python tools/psw_test.py struct   builds, reachability (BFS from every link, NPC, stair, key), duplicates, gaps, corridor widths, link twins
   python tools/psw_test.py key      the key flow: lever, sacristy, boss, key, the three stair doors, save and load
   python tools/psw_test.py shots    screenshots into %TEMP%/psw_shots
Env: PSW_PORT (8625), BTA_CHROME."""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PSW_PORT', '8625')
CHROME = os.environ.get('BTA_CHROME') or 'C:/Program Files/Google/Chrome/Application/chrome.exe'
SHOTS = os.environ.get('PSW_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'psw_shots'))
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
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, query, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9670", timeout=150000)
    pg.wait_for_timeout(2500)
    pg.evaluate("async()=>{await pswLoad()}")
    return b, pg, errs

def clean(errs):
    return [e for e in errs if not any(n in e for n in NOISE)]

def go(pg, lv, x, y, f, wait=3500):
    pg.evaluate("([lv,x,y,f])=>{G.menu=false;G.talk=null;G.cut=null;goToLevel(lv,{x,y,f});G.state='play';setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300)}", [lv, x, y, f])
    pg.wait_for_timeout(wait)
    pg.evaluate("()=>{G.talk=null;G.msgs=[];G.enemies=(G.enemies||[]).filter(e=>Math.hypot(e.x-G.P.x,e.y-G.P.y)>3.2)}")
    pg.wait_for_timeout(300)

PLACES = [
 ('50_arrive_kitchen_door', 9750, 66, 40, 3), ('51_spine_south', 9750, 62, 20, 2), ('52_kitchen', 9750, 52, 28, 3), ('53_kitchen_hearth', 9750, 41, 22, 0), ('54_armoury', 9750, 20, 9, 3), ('55_guardroom', 9750, 32, 8, 1),
 ('56_bakehouse', 9750, 48, 10, 0), ('57_maids_loft', 9750, 8, 55, 0), ('58_stair_room', 9750, 30, 53, 2), ('59_steward_office', 9750, 42, 54, 0), ('60_servants_hall', 9750, 52, 55, 0),
 ('61_larder', 9750, 8, 24, 0), ('62_scullery', 9750, 8, 38, 0), ('63_west_turret', 9750, 8, 11, 0), ('64_buttery', 9750, 20, 38, 0),
 ('70_pilgrims_hall', 9760, 5, 50, 1), ('71_hall_runner', 9760, 7, 55, 0), ('72_cloister_walk', 9760, 26, 35, 2), ('73_garth', 9760, 20, 48, 1), ('74_garth_grotto', 9760, 30, 50, 1),
 ('75_library', 9760, 27, 26, 0), ('76_library_stacks', 9760, 27, 16, 0), ('77_chapter_house', 9760, 50, 14, 0), ('78_almonry', 9760, 54, 20, 0), ('79_chapel_door', 9760, 43, 47, 1),
 ('80_chapel_nave', 9760, 52, 47, 1), ('81_chapel_altar', 9760, 63, 47, 1), ('82_bracket', 9760, 44, 36, 1), ('83_sacristy', 9760, 62, 31, 0), ('84_east_turret', 9760, 66, 9, 0), ('85_passage', 9760, 45, 17, 2)]

def run_shots(only=None):
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for name, lv, x, y, f in PLACES:
            if only and not any(o in name for o in only): continue
            go(pg, lv, x, y, f)
            path = os.path.join(SHOTS, name + '.png'); pg.screenshot(path=path); print('shot', path)
        print('errors', clean(errs)[:10]); b.close()

if what == 'shots':
    run_shots(sys.argv[2:] or None)

if what == 'struct':
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        log = pg.evaluate(open(os.path.join(HERE, 'psw_qtest.js'), encoding='utf-8').read())
        for l in log: print(l)
        bad = [l for l in log if l.startswith('FAIL')]
        print('---', len(log), 'lines,', len(bad), 'FAIL'); print('console errors:', clean(errs)[:8]); b.close()
