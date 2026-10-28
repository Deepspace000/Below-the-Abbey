"""Follow test: from a level a few doors away from the quest's place, the map must ring the next door at every step, and the last step the target.
python tools/qrings/doors.py [out.json] [id,id,...]"""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
ids = [i for v in json.load(open(HERE + '/main_ids.json')).values() for i in v]
if len(sys.argv) > 2: ids = sys.argv[2].split(',')
outp = sys.argv[1] if len(sys.argv) > 1 else HERE + '/doors.json'
flagsx = json.load(open(HERE + '/flags.json')) if os.path.exists(HERE + '/flags.json') else {}
res = []
with sync_playwright() as p:
    b, pg, errs = boot(p)
    pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=120000)
    pg.add_script_tag(path=HERE + '/qr_page.js')
    pg.evaluate("async()=>{QR.fresh();await QR.goto(44);QR.buildAll()}")
    for id in ids:
        fl = flagsx.get(id)
        for sk, st in [('give', 'give'), ('act', 'active'), ('ready', 'ready')]:
            lv = pg.evaluate("([i,s])=>{QR.fresh();QR.setState(i,s);const sp=QRF.specs(i,QRF.stage(i));return sp?QRF.levels(sp):null}", [id, st])
            if not lv: continue
            T = lv[0]
            dist = pg.evaluate("(t)=>QR.starts(t)", T)
            far = sorted([(d, int(k)) for k, d in dist.items() if d >= 1], reverse=True)
            if not far: res.append({'id': id, 'stage': sk, 'target': T, 'note': 'no door path into the target level (world map only)'}); continue
            d0, S = far[0]
            path = pg.evaluate("([a,b])=>QR.path(a,b)", [S, T])
            if not path: res.append({'id': id, 'stage': sk, 'target': T, 'note': 'no path from %s' % S, 'start': S}); continue
            steps = []
            for i, H in enumerate(path[:-1]):
                o = pg.evaluate("([i,s,l,f])=>QR.test(i,s,l,f)", [id, st, H, fl])
                steps.append({'level': H, 'ring': bool(o.get('ring')), 'door': o.get('door'), 'world': o.get('world'), 'cell': o.get('ring') and [round(o['ring']['cx']), round(o['ring']['cy'])]})
            res.append({'id': id, 'stage': sk, 'target': T, 'path': path, 'steps': steps})
    json.dump({'res': res, 'errs': [e for e in errs if '404' not in e][:20]}, open(outp, 'w'), indent=1)
    b.close()
bad = [r for r in res if 'steps' in r and not all(s['ring'] and s['door'] for s in r['steps'])]
print('walks', sum(1 for r in res if 'steps' in r), 'bad', len(bad))
for r in bad: print(r['id'], r['stage'], r['path'], [(s['level'], s['ring'], s['door'], s['world']) for s in r['steps']])
