"""Persistent browser for the north zone (port 8330). Queue: north_q/<n>.json = {"op":"eval","js":"()=>..","arg":..} | {"op":"shot","path":"x.png","tx":..,"ty":..,"f":0..3|-1,"wait":700} (returns luminance of the 3D view) | {"op":"reload"}"""
import json, time, pathlib, io
from playwright.sync_api import sync_playwright
from PIL import Image
Q = pathlib.Path(__file__).resolve().parent / 'north_q'
GO = """([x,y,f])=>{const L=LEVELS[475],ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';
 if(f<0){let best=0;f=0;[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],i)=>{let n=0;while(n<12&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>best){best=n;f=i}})}
 G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang;return f}"""
errs = []
def load(pg):
    errs.clear()
    pg.goto('http://localhost:8330/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='domcontentloaded', timeout=90000)
    for k in range(120):
        pg.wait_for_timeout(2000)
        try:
            if pg.evaluate("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL===475"): break
        except Exception: pass
    pg.wait_for_timeout(3000)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}G.mute=true}")
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 560})
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    load(pg); (Q / 'ready').write_text('1')
    while True:
        for f in sorted(Q.glob('*.json')):
            try:
                c = json.loads(f.read_text(encoding='utf-8')); out = None
                if c['op'] == 'reload': (Q / 'ready').unlink(missing_ok=True); load(pg); (Q / 'ready').write_text('1'); out = 'reloaded'
                elif c['op'] == 'eval': out = pg.evaluate(c['js'], c.get('arg'))
                elif c['op'] == 'shot':
                    r = pg.evaluate(GO, [c['tx'], c['ty'], c.get('f', -1)]); pg.wait_for_timeout(c.get('wait', 800)); pg.evaluate("()=>{G.talk=null;G.msgs=[]}")
                    png = pg.screenshot(); 
                    if c.get('path'): open(c['path'], 'wb').write(png)
                    im = Image.open(io.BytesIO(png)).convert('L').crop((40, 10, 760, 360)); h = im.histogram(); out = [r, round(sum(i * v for i, v in enumerate(h)) / sum(h), 1)]
                (Q / (f.stem + '.out')).write_text(json.dumps({'r': out, 'errs': errs[:8]}), encoding='utf-8')
            except Exception as e:
                (Q / (f.stem + '.out')).write_text(json.dumps({'err': str(e)[:500], 'errs': errs[:8]}), encoding='utf-8')
            f.unlink()
        time.sleep(.4)
