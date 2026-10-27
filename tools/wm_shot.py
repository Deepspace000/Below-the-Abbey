"""World map shots on port 8372: python tools/wm_shot.py name:z:cx:cy ...  (cx,cy are WORLD coordinates to centre on; z zoom) -> _wm_shots/name.png (3x)"""
import base64, time, pathlib, sys
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(__file__).resolve().parent.parent / '_wm_shots'; OUT.mkdir(exist_ok=True)
URL = 'http://localhost:8372/index.html?town=wenlock&lvl=80&v=%d' % time.time()
JS = """async ([S,z,cx,cy])=>{G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=true;G.wv=wvDefault();
 G._wvT=G.time+1e9; G.wv={z:z,x:-(cx-240)*z,y:-(cy-160)*z}; 
 await new Promise(r=>setTimeout(r,1200));
 const w0=cv.width,h0=cv.height; cv.width=w0*S/2; cv.height=h0*S/2; render3D(); ctx.setTransform(S,0,0,S,0,0); ui(.016); if(window.__grid){const V=G.wv;ctx.save();ctx.font='5px sans-serif';ctx.lineWidth=.3;for(let wx=-700;wx<=100;wx+=20){const sx=240+V.x+(wx-240)*V.z;ctx.strokeStyle=wx%100?'rgba(255,0,0,.25)':'rgba(255,0,0,.7)';ctx.beginPath();ctx.moveTo(sx,14);ctx.lineTo(sx,306);ctx.stroke();ctx.fillStyle='#c00';ctx.fillText(wx,sx+1,20)}for(let wy=0;wy<=400;wy+=20){const sy=160+V.y+(wy-160)*V.z;ctx.strokeStyle=wy%100?'rgba(0,0,255,.25)':'rgba(0,0,255,.7)';ctx.beginPath();ctx.moveTo(14,sy);ctx.lineTo(466,sy);ctx.stroke();ctx.fillStyle='#00c';ctx.fillText(wy,16,sy-1)}ctx.restore()} const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return d}"""
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader']); pg = b.new_page(viewport={'width': 960, 'height': 640})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and '404' not in m.text else None)
    import os
    pg.goto(URL, timeout=90000, wait_until='domcontentloaded'); pg.wait_for_function('()=>typeof LEVEL!=="undefined"&&LEVEL===496', timeout=90000); pg.wait_for_timeout(2500)
    if os.environ.get('GRID'): pg.evaluate('window.__grid=1')
    for a in sys.argv[1:]:
        n, z, cx, cy = a.split(':')
        d = pg.evaluate(JS, [3, float(z), float(cx), float(cy)])
        (OUT / (n + '.png')).write_bytes(base64.b64decode(d.split(',')[1])); print(n)
    print('errors', errs[:10]); b.close()
