"""Round 4 critic daemon for the towns zone. Port 8361 (own server). Queue dir tc4_q.
Drop tc4_q/<n>.json = {"op":"eval","js":"()=>...","arg":..} | {"op":"shot","path":"x.png","tx":..,"ty":..,"f":0..3|null,"wait":ms,"dist":3} | {"op":"place","x":..,"y":..,"f":..} | {"op":"reload"}
Result goes to tc4_q/<n>.out"""
import json, time, pathlib, sys
from playwright.sync_api import sync_playwright
H = pathlib.Path(__file__).resolve().parent
Q = H / 'tc4_q'
GO = open(H / 'c2_go.js', encoding='utf-8').read()
PLACE = """([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:x,y:y,a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [x,y,f]}"""
errs = []
def load(pg):
    errs.clear()
    pg.goto('http://localhost:8361/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=90000); pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t', timeout=300000); pg.wait_for_timeout(4000)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    load(pg); (Q / 'ready').write_text('1')
    while True:
        for f in sorted(Q.glob('*.json')):
            try:
                c = json.loads(f.read_text(encoding='utf-8')); out = None
                if c['op'] == 'reload': (Q / 'ready').unlink(missing_ok=True); load(pg); (Q / 'ready').write_text('1'); out = 'reloaded'
                elif c['op'] == 'eval': out = pg.evaluate(c['js'], c.get('arg'))
                elif c['op'] == 'place':
                    out = pg.evaluate(PLACE, [c['x'], c['y'], c['f']])
                elif c['op'] == 'shot':
                    r = pg.evaluate(GO, [c['tx'], c['ty'], c.get('f')]); pg.wait_for_timeout(c.get('wait', 1200)); pg.screenshot(path=c['path']); out = r
                elif c['op'] == 'shotat':
                    r = pg.evaluate(PLACE, [c['x'], c['y'], c['f']]); pg.wait_for_timeout(c.get('wait', 1200)); pg.screenshot(path=c['path']); out = r
                elif c['op'] == 'key':
                    pg.keyboard.press(c['key']); pg.wait_for_timeout(c.get('wait', 600)); out = 'ok'
                elif c['op'] == 'snap':
                    pg.wait_for_timeout(c.get('wait', 600)); pg.screenshot(path=c['path']); out = 'ok'
                (Q / (f.stem + '.out')).write_text(json.dumps({'r': out, 'errs': errs[:12]}), encoding='utf-8')
            except Exception as e:
                (Q / (f.stem + '.out')).write_text(json.dumps({'err': str(e)[:500], 'errs': errs[:12]}), encoding='utf-8')
            f.unlink()
        time.sleep(.4)
