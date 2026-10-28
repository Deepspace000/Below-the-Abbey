"""python tools/polish/b14_rooms.py outdir id1 id2 ... : shots in each room: from the south wall facing north, from the west facing east, from the north facing south, from the east facing west.
Env BL_PORT (8611), BTA_CHROME, TOWN."""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8611')
out = sys.argv[1]; ids = [int(a) for a in sys.argv[2:]]; os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, os.environ.get('TOWN', 'blight1'), time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2500)
    for lv in ids:
        pg.evaluate("(lv)=>{G.menu=false;G.talk=null;G.cut=null;if(!LEVELS[lv]&&KH_LAZY[lv])KH_LAZY[lv]();const L=LEVELS[lv];goToLevel(lv,{x:L.start.x,y:L.start.y,f:L.start.f||0});G.state='play'}", lv)
        pg.wait_for_timeout(2500)
        dims = pg.evaluate("(lv)=>{const L=LEVELS[lv];return [L.rows[0].length,L.rows.length]}", lv)
        W, H = dims
        views = [('s', W // 2, H - 3, 0), ('w', 2, H // 2, 1), ('n', W // 2, 2, 2), ('e', W - 3, H // 2, 3)]
        for tag, x, y, f in views:
            pg.evaluate("([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT;G.C.x=x;G.C.y=y;G.talk=null;G.msgs=[];G.lvlBanners.length=0}", [x, y, f])
            pg.wait_for_timeout(900)
            pg.evaluate("()=>{G.talk=null;G.msgs=[];G.lvlBanners.length=0}")
            pg.screenshot(path=os.path.join(out, 'r%d_%s.png' % (lv, tag)))
        print(lv, dims)
    print('errs', errs[:5]); b.close()
