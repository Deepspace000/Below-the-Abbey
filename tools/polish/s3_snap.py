"""python tools/polish/s3_snap.py OUTDIR PLAN.json [query]   (server 8331). Plan: [[name,x,y,f],...]. Prints mean luminance of the 3D view of every shot."""
import sys, json, time, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image, ImageStat
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
SET = "([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};if(G.lvlBanners)G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [x,y,f]}"
pl = json.load(open(sys.argv[2]))
q = sys.argv[3] if len(sys.argv) > 3 else ''
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8331/index.html?town=deephollow&lvl=34&v=%d%s' % (time.time(), q), wait_until='commit', timeout=400000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&typeof LEVEL!=="undefined"&&LEVEL===475&&G.grid&&LEVELS[475]._hgpb', timeout=400000)
    pg.wait_for_timeout(3000)
    DEAD = "([cx,cy])=>{const L=LEVELS[475],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]];let ob=null;for(let i=0;i<4;i++)if(op(cx+D[i][0],cy+D[i][1])){ob=i;break}if(ob===null)return null;let k=0;for(let s=1;s<=3;s++){if(op(cx+D[ob][0]*s,cy+D[ob][1]*s))k=s;else break}return [cx+D[ob][0]*k,cy+D[ob][1]*k,(ob+2)%4]}"
    for name, x, y, f in pl:
        if name.startswith('v_'):
            r = pg.evaluate(DEAD, [x, y])
            if not r: print('nodead', name); continue
            x, y, f = r
        pg.evaluate(SET, [x, y, f]); pg.wait_for_timeout(1400)
        fp = OUT / ('%s.png' % name); pg.screenshot(path=str(fp))
        im = Image.open(fp).convert('L'); w, h = im.size
        lum = ImageStat.Stat(im.crop((int(w*.2), int(h*.1), int(w*.8), int(h*.75)))).mean[0]
        res[name] = round(lum, 1); print(name, x, y, f, 'lum', res[name])
    print('ERRS', errs[:10]); b.close()
json.dump(res, open(str(OUT / 'lum.json'), 'w'))
