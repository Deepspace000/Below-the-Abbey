import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600}); errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append(m.type+' '+m.text[:200]))
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    for i in range(6):
        pg.wait_for_timeout(8000)
        print(pg.evaluate("()=>({g:typeof G!=='undefined'&&G.state, lv:typeof LEVEL!=='undefined'&&LEVEL, ready:window.__ready, note:(document.getElementById('ldnote')||{}).innerText})"))
    print(errs[:15]); pg.screenshot(path=SHOTS+'/dbg.png'); b.close()
