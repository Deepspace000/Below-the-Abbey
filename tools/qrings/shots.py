"""Screenshots of representative rings into tools/qrings/shots. python tools/qrings/shots.py"""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
flagsx = json.load(open(HERE + '/flags.json')) if os.path.exists(HERE + '/flags.json') else {}
SHOTS = [('gandrick', 'give', 5, '01_gandrick_giver'), ('gandrick', 'act', 8, '02_gandrick_cave'), ('gandrick', 'act', 3, '03_gandrick_door_from_town'), ('mines', 'act', 18, '04_mines_creatures'),
         ('yar4', 'act', 290, '05_yar4_crates'), ('yar5', 'act', 297, '06_yar5_rats_in_loft'), ('vq1', 'act', 300, '07_vq1_marines'), ('kg1', 'act', 330, '08_kg1_sea_island'), ('kg1', 'act', 338, '09_kg1_harpoon'),
         ('sg5', 'act', 305, '10_sg5_pigeon_keepers'), ('oa3', 'act', 311, '11_oa3_acorns'), ('hc1', 'act', 444, '12_hc1_letter_L5'), ('hgsph', 'act', 475, '13_hgsph_spheres'), ('dq11', 'act', 475, '14_dq11_towns'),
         ('wk2', 'act', 496, '15_wk2_wenlock'), ('gyq1', 'act', 532, '16_gyq1_ossuary'), ('wwq6', 'act', 522, '17_wwq6_cages'), ('kh_seal', 'act', 44, '18_kh_seal_city_door'), ('kg0', 'act', 1, '19_kg0_world_map'),
         ('hgb2', 'act', 472, '20_hgb2_book'), ('gyq5', 'act', 530, '21_gyq5_grave')]
only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
with sync_playwright() as p:
    b, pg, errs = boot(p, 960, 640)
    pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=120000)
    pg.add_script_tag(path=HERE + '/qr_page.js')
    for id, st, lvl, name in SHOTS:
        if only and name not in only: continue
        st2 = {'give': 'give', 'act': 'active', 'ready': 'ready'}[st]
        o = pg.evaluate("([i,s,l,f])=>QR.test(i,s,l,f)", [id, st2, lvl, flagsx.get(id)])
        pg.wait_for_timeout(700)
        pg.screenshot(path=os.path.join(OUT, name + '.png'))
        print(name, 'ring' if o.get('ring') else 'wring' if o.get('wring') else 'NONE', o.get('level'))
    print([e for e in errs if '404' not in e][:5]); b.close()
