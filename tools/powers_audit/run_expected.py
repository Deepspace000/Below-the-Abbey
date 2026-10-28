"""Dice-free expected rounds to kill (see fight.js, __pf.expected).  python tools/powers_audit/run_expected.py before|after"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PA_PORT', '8357')
HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
URL = 'http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time())
PARTIES = {'Warrior/Thief/Mage/Priest': [0, 5, 7, 9], 'Barbarian/Archer/Sorcerer/Paladin': [1, 4, 8, 2], 'Ranger/Assassin/Monk/Goat': [3, 6, 10, 11]}
LEVELS = [10, 20, 30, 40, 50, 60, 70, 80]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto(URL, wait_until='domcontentloaded', timeout=300000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=420000)
    pg.wait_for_timeout(1500)
    pg.evaluate(open(os.path.join(HERE, 'audit.js'), encoding='utf-8').read())
    pg.evaluate(open(os.path.join(HERE, 'fight.js'), encoding='utf-8').read())
    out = []
    for nm, cl in PARTIES.items():
        for L in LEVELS:
            for foes in (1, 3, 6):
                r = pg.evaluate("([c,L,n])=>window.__pf.expected(c,L,n)", [cl, L, foes])
                r['party'] = nm; r['foes'] = foes
                out.append(r)
    json.dump({'res': out, 'errs': errs}, open(os.path.join(HERE, 'expected_%s.json' % tag), 'w'), indent=0)
    print('errors', errs[:5])
    b.close()
