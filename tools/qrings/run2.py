"""Quest ring harness v2 (checks the ring against the specs in src/desert/quest_rings_fix.js and the quest's own giver).
python tools/qrings/run2.py [out.json] [id,id,...]    own server: python -m http.server 8359 from the repo root."""
import sys, json, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
ids = [i for v in json.load(open(HERE + '/main_ids.json')).values() for i in v]
if len(sys.argv) > 2: ids = sys.argv[2].split(',')
outp = sys.argv[1] if len(sys.argv) > 1 else HERE + '/results2.json'
flagsx = json.load(open(HERE + '/flags.json')) if os.path.exists(HERE + '/flags.json') else {}
STAGES = [('give', 'give'), ('act', 'active'), ('ready', 'ready')]

def save(res, errs):
    json.dump({'res': res, 'errs': [e for e in errs if '404' not in e][:40]}, open(outp, 'w'), indent=1)

def main():
    res = []
    done = set()
    if os.path.exists(outp) and not os.environ.get('QR_FRESH'):  # resume: ids already in the file are skipped, so a long run can be done in short pieces
        try:
            res = json.load(open(outp))['res']; done = {r['id'] for r in res}
        except Exception: res = []
    todo = [i for i in ids if i not in done]
    print('to do', len(todo), 'of', len(ids))
    with sync_playwright() as p:
        b, pg, errs = boot(p, 640, 427)  # a small window: the game draws the same 480 x 320 picture, and the laptop has little to spare
        pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=300000)
        pg.add_script_tag(path=HERE + '/qr_page.js')
        if os.environ.get('QR_BEFORE'): pg.evaluate('()=>QRF.disable()')  # the game without quest_rings_fix.js: the 'before' run
        t0 = time.time(); budget = float(os.environ.get('QR_SECONDS', '420'))  # stop cleanly after this many seconds; run again to go on
        for id in todo:
            if time.time() - t0 > budget: print('time is up, run again'); break
            fl = flagsx.get(id)
            for sk, st in STAGES:
                r = {'id': id, 'stage': sk, 'on': [], 'off': None}
                lv = pg.evaluate("([i,s,f])=>{QR.fresh(f);QR.setState(i,s);const sp=QRF.specs(i,QRF.stage(i));return sp?QRF.levels(sp):null}", [id, st, fl])
                r['levels'] = lv
                if lv is None: res.append(r); continue
                for L in lv[:3]:
                    r['on'].append(pg.evaluate("([i,s,l,f])=>QR.test(i,s,l,f)", [id, st, L, fl]))
                s0 = 1 if 1 not in lv else 2
                r['off'] = pg.evaluate("([i,s,l,f])=>QR.test(i,s,l,f)", [id, st, s0, fl])
                res.append(r)
            save(res, errs)
        b.close()
    save(res, errs)
    print('wrote', outp, len(res))
main()
