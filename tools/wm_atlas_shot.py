"""Atlas page shots on port 8372: python tools/wm_atlas_shot.py  -> _wm_shots/atlas_N.png"""
import base64, time, pathlib, os
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(__file__).resolve().parent.parent / '_wm_shots'; OUT.mkdir(exist_ok=True)
URL = 'http://localhost:8372/index.html?town=wenlock&lvl=80&v=%d' % time.time()
JS = """async (pg)=>{G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=true;G.wv=wvDefault();G._wvT=G.time+1e9;G.wAtlas=true;G.wAtlasPage=pg;
 await new Promise(r=>setTimeout(r,700));
 const w0=cv.width,h0=cv.height; cv.width=w0*3/2; cv.height=h0*3/2; render3D(); ctx.setTransform(3,0,0,3,0,0); ui(.016); const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return [d,wmwAtlasPages().length]}"""
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=os.environ.get('BTA_CHROME') or None, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader']); pg = b.new_page(viewport={'width': 960, 'height': 640})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_CONNECTION' not in m.text and '404' not in m.text else None)
    pg.goto(URL, timeout=90000, wait_until='domcontentloaded'); pg.wait_for_function('()=>typeof LEVEL!=="undefined"&&LEVEL===496', timeout=90000); pg.wait_for_timeout(2500)
    n = 1; i = 0
    while i < n:
        d, n = pg.evaluate(JS, i)
        (OUT / ('atlas_%d.png' % i)).write_bytes(base64.b64decode(d.split(',')[1])); print('atlas', i, 'of', n); i += 1
    print('errors', errs[:10]); b.close()
