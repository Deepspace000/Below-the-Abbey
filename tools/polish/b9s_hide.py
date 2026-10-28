"""python tools/polish/b9s_hide.py <query> x y f key1,key2 ...  : one shot per key with that decor key removed (to find what draws something).
special keys: flat (terrain heights set flat), noblock (clear TERRS.block), nofog"""
import sys, os, time
from playwright.sync_api import sync_playwright
port = os.environ.get('B9S_PORT', '8791')
q, x, y, f = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]); keys = sys.argv[5:]
JS = """([x,y,f,k]) => { if(k==='flat'){const T=TERRS[LEVEL];T.h.fill(.3)} else if(k==='nofm'){const L=LEVELS[LEVEL];L.fmap=L.fmap.map(r=>r.replace(/[56]/g,'0'));try{G.fmap=L.fmap}catch(e){}} else if(k==='alldecor'){G.decor=[]} else if(k==='nosky'){G.sky=[];LEVELS[LEVEL].sky=[]} else if(k==='noblock'){const T=TERRS[LEVEL];T.block=new Uint8Array(T.W*T.H)} else G.decor=G.decor.filter(d=>d.k!==k);
 G.talk=null; G.P.x=x; G.P.y=y; G.P.f=f; G.P.angT=(f-1)*Math.PI/2; G.C={x:x,y:y,a:G.P.angT}; G.lvlBanners.length=0; G.msgs=[]; }"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 700})
    pg.goto('http://localhost:%s/index.html%s&v=%d' % (port, q, time.time()))
    pg.wait_for_function("() => typeof G!=='undefined' && G.state==='play' && typeof LEVEL!=='undefined'", timeout=120000)
    pg.wait_for_timeout(2500)
    for k in keys:
        pg.evaluate(JS, [x, y, f, k])
        pg.wait_for_timeout(900); pg.screenshot(path='_b9s/hide_%s.png' % k)
    b.close()
