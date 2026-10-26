"""Wenlock map shots: python tools/wl_map.py  -> _wl_shots/map_area.png and map_world.png"""
import base64, time, pathlib
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(__file__).resolve().parent.parent / '_wl_shots'; OUT.mkdir(exist_ok=True)
URL = 'http://localhost:8377/index.html?town=wenlock&lvl=80&v=%d' % time.time()
S = 3
JS_AREA = """async (S)=>{G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=false;
 await new Promise(r=>setTimeout(r,2500));
 const w0=cv.width,h0=cv.height; cv.width=w0*S/2; cv.height=h0*S/2; render3D(); ctx.setTransform(S,0,0,S,0,0); ui(.016); const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return d}"""
JS_WORLD = """async (S)=>{G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=true;G.wv=wvDefault();
 await new Promise(r=>setTimeout(r,2500));
 const w0=cv.width,h0=cv.height; cv.width=w0*S/2; cv.height=h0*S/2; render3D(); ctx.setTransform(S,0,0,S,0,0); ui(.016); const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return d}"""
def save(name, d): (OUT / (name + '.png')).write_bytes(base64.b64decode(d.split(',')[1])); print(name)
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader']); pg = b.new_page(viewport={'width': 960, 'height': 640})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and '404' not in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(9000)
    save('map_area', pg.evaluate(JS_AREA, S))
    save('map_world', pg.evaluate(JS_WORLD, S))
    print('errors', errs[:10]); b.close()
