"""Stall shops (src/desert/stall_shop.js): table of the stalls of each level, and the live checks.
Run on your OWN server (python -m http.server 8352 from the repo root), ONE browser, closed at the end:
    python -u tools/stall_shop/run.py OUT.json 3,13,496 [test] [shots=DIR]
For every level: builds it, lists every stall decor and the shop it leads to (stlTable), counts stall-like decor that keep their own job.
With 'test': for a bound stall and a decorative one, faces it in the live game and checks that
  - the use key (Enter) opens the shop page of the bound person (G.loot is that person's shop), or shows a flavour line for a decorative stall,
  - a click on the stall picture does the same, the hover tip shows, the person themselves still talk as before,
  - one buy and one sell work on the page that a stall opened.
Screenshots of the shop page opened from a stall go to the folder named by shots=."""
import sys, os, json, time
from playwright.sync_api import sync_playwright

PORT = os.environ.get('STL_PORT', '8352')
args = sys.argv[1:]
OUT = args[0]
LEVELS = [int(x) for x in args[1].split(',') if x]
TEST = 'test' in args[2:]
SHOTS = next((a[6:] for a in args[2:] if a.startswith('shots=')), None)
if SHOTS: os.makedirs(SHOTS, exist_ok=True)

from lib import *
import lib
lib.CFG['shots'] = SHOTS


def main():
    results = []
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        try:
            pg = b.new_page(viewport={'width': 900, 'height': 600})
            pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)[:300]))
            pg.on('console', lambda m: errs.append('CON ' + m.text[:300]) if m.type == 'error' and '404' not in m.text and 'Failed to load resource' not in m.text else None)
            pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=34&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=600000)
            pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof stlTable==='function'", timeout=900000)
            pg.wait_for_timeout(1500)
            pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
            print('loaded', flush=True)
            for lv in LEVELS:
                t0 = time.time()
                try:
                    enter(pg, lv)
                except Exception as e:
                    print(lv, 'noload', str(e)[:120], flush=True); continue
                try:
                    T = pg.evaluate(TABLE)
                except Exception as e:
                    print(lv, 'table error', str(e)[:200], flush=True); continue
                T['lv'] = lv
                T['checks'] = []
                rows = T['rows']
                print(lv, '%.0fs' % (time.time() - t0), T['name'], 'npcs', T['npcs'], 'stalls', len(rows),
                      'bound', sum(1 for r in rows if r['npc']), 'own', json.dumps(T['own']), flush=True)
                if TEST and rows:
                    bound = [r for r in rows if r['npc']]
                    deco = [r for r in rows if not r['npc'] and not r['k'].startswith('hgstall_')]
                    # prefer a bound stall that is not the first in a crowd: the nearest keeper is 0 or 1 away
                    bound.sort(key=lambda r: (r['dist'] if r['dist'] is not None else 9))
                    picks = []
                    if bound: picks.append((bound[0], 'lv%d_a' % lv))
                    if deco: picks.append((deco[0], 'lv%d_d' % lv))
                    for row, nm in picks:
                        try:
                            check_stall(pg, row, nm, T['checks'])
                        except Exception as e:
                            T['checks'].append({'k': row['k'], 'err': str(e)[:200]})
                    for c in T['checks']:
                        print('   check', json.dumps({k: v for k, v in c.items() if k not in ('use', 'click')})[:400], flush=True)
                results.append(T)
                json.dump({'results': results, 'errors': errs}, open(OUT, 'w'), indent=1)
        finally:
            json.dump({'results': results, 'errors': errs}, open(OUT, 'w'), indent=1)
            b.close()
    print('errors:', errs[:8] if errs else 'none', flush=True)


main()
