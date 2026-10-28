"""Persistent browser for zone C round 2. Drop c3b_q/<n>.json = {"op":"eval","js":"()=>...","arg":..} | {"op":"shot","path":"x.png","tx":..,"ty":..,"f":0..3} | {"op":"reload"} ; result goes to c2_q/<n>.out"""
import json, time, pathlib, sys
from playwright.sync_api import sync_playwright
Q = pathlib.Path(__file__).resolve().parent / 'c3b_q'
GO = open(pathlib.Path(__file__).resolve().parent / 'c2_go.js', encoding='utf-8').read()
errs = []
def load(pg):
    errs.clear()
    pg.goto('http://localhost:8332/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=90000); pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t', timeout=120000); pg.wait_for_timeout(4000)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    load(pg); (Q / 'ready').write_text('1')
    while True:
        for f in sorted(Q.glob('*.json')):
            try:
                c = json.loads(f.read_text(encoding='utf-8')); out = None
                if c['op'] == 'reload': (Q / 'ready').unlink(missing_ok=True); load(pg); (Q / 'ready').write_text('1'); out = 'reloaded'
                elif c['op'] == 'eval': out = pg.evaluate(c['js'], c.get('arg'))
                elif c['op'] == 'shot':
                    r = pg.evaluate(GO, [c['tx'], c['ty'], c.get('f')]); pg.wait_for_timeout(c.get('wait', 1200)); pg.screenshot(path=c['path']); out = r
                (Q / (f.stem + '.out')).write_text(json.dumps({'r': out, 'errs': errs[:8]}), encoding='utf-8')
            except Exception as e:
                (Q / (f.stem + '.out')).write_text(json.dumps({'err': str(e)[:500], 'errs': errs[:8]}), encoding='utf-8')
            f.unlink()
        time.sleep(.4)
