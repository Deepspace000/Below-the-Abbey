"""Quest ring harness. python tools/qrings/run_rings.py [out.json] [id,id,...]   (own server: python -m http.server 8359 from the repo root)
Pass 1: from level 1, every main quest at each stage is clicked in the quest panel: the world map must ring its place.
Pass 2: on the level where the stage's business is, the local map must ring the right square."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
ids = [i for v in json.load(open(HERE + '/main_ids.json')).values() for i in v]
if len(sys.argv) > 2: ids = sys.argv[2].split(',')
outp = sys.argv[1] if len(sys.argv) > 1 else HERE + '/results.json'
exp = json.load(open(HERE + '/expect.json')) if os.path.exists(HERE + '/expect.json') else {}
orc = {o['id']: o for o in json.load(open(HERE + '/oracle.json')) if o}

def expected(id, stage):
    """list of {lvl,x,y} where the ring should be: expect.json first, else from the oracle (giver, or target decor)"""
    e = exp.get(id, {})
    key = {'give': 'give', 'active': 'active', 'ready': 'ready'}[stage]
    if key in e: return e[key]
    o = orc.get(id) or {}
    g = [{'lvl': p['lvl'], 'x': p['x'], 'y': p['y']} for p in (o.get('gpos') or o.get('npos') or [])]
    if stage == 'active':
        t = [{'lvl': p['lvl'], 'x': p['x'], 'y': p['y']} for p in o.get('tpos', [])]
        return t or g
    return g

def main():
    res = []
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=120000)
        pg.add_script_tag(path=HERE + '/qr_page.js')
        for id in ids:
            for st in ['give', 'active', 'ready']:
                ex = expected(id, st)
                r = {'id': id, 'stage': st, 'exp': ex}
                # pass 1: off level (level 1 is the crypts: nothing of the main line is there except ad2)
                lv0 = 1
                if not any(e['lvl'] == lv0 for e in ex):
                    r['off'] = pg.evaluate("([i,s])=>QR.test(i,s,1)", [id, st])
                # pass 2
                res.append(r)
        for r in res:
            ex = r['exp']
            if not ex: r['on'] = None; continue
            r['on'] = pg.evaluate("([i,s,l])=>QR.test(i,s,l)", [r['id'], r['stage'], ex[0]['lvl']])
        b.close()
    json.dump({'res': res, 'errs': errs[:40]}, open(outp, 'w'), indent=1)
    print('wrote', outp, len(res))
main()
