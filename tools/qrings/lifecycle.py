"""Checks that a ring goes away when its quest is done or the map is left. python tools/qrings/lifecycle.py"""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
CASES = [('gandrick', 5), ('mines', 18), ('yar4', 290), ('vq1', 300), ('oa2', 311), ('hc1', 444), ('hgsph', 475), ('gyq5', 530)]
with sync_playwright() as p:
    b, pg, errs = boot(p)
    pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=120000)
    pg.add_script_tag(path=HERE + '/qr_page.js')
    bad = 0
    for id, lvl in CASES:
        r = pg.evaluate("""async([id,lvl])=>{const o={id};QR.fresh();QR.setState(id,'act');await QR.goto(lvl);QR.click(id);await QR.sleep(300);
          const spots=()=>questSpots().filter(s=>s.q===id).length;o.before=spots();o.focus=!!G.qFocus;
          G.quests[id].st='done';await QR.sleep(300);o.afterDone=spots();o.focusAfterDone=!!G.qFocus;
          QR.setState(id,'act');QR.click(id);await QR.sleep(200);G.quests[id].st='active';handleBtn('ovexit');o.afterExit=!!G.qFocus;return o}""", [id, lvl])
        ok = r['before'] > 0 and r['afterDone'] == 0 and not r['focusAfterDone'] and not r['afterExit']
        bad += 0 if ok else 1
        print('OK  ' if ok else 'FAIL', r)
    print('failures', bad, [e for e in errs if '404' not in e][:3])
    b.close()
