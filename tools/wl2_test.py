"""Wenlock interiors test: python tools/wl2_test.py [port] [ids...]   screenshots every room into the folder in OUT"""
import sys, json, time, pathlib
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8376'
OUT = pathlib.Path('C:/Users/mirko/AppData/Local/Temp/wl2shots'); OUT.mkdir(exist_ok=True)
only = [int(a) for a in sys.argv[2:]]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 960, 'height': 720})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=wenlock&lvl=80&v=%d' % (PORT, int(time.time())))
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&LEVEL===496', timeout=120000)
    pg.wait_for_timeout(3000)
    info = pg.evaluate('''()=>({houses:WL.houses.map(h=>({id:h.id,spk:h.spk,name:h.name,front:h.front,out:h.out,door:h.door,keeper:h.sp&&h.sp.keeper}))})''')
    json.dump(info, open(OUT / 'houses.json', 'w'))
    print('houses', len(info['houses']))
    ids = only or [7000] + [h['id'] for h in info['houses']]
    for id_ in ids:
        r = pg.evaluate('''async(id)=>{try{G.cut=null;G.talk=null;if(!LEVELS[id]&&KH_LAZY[id])KH_LAZY[id]();const L=LEVELS[id];if(!L)return 'nolevel';goToLevel(id,{x:L.start.x,y:L.start.y,f:0});return 'ok '+(L.wlin||'')+' '+L.rows.length+'x'+L.rows[0].length+' decor '+L.decor.length}catch(e){return 'ERR '+e.message}}''', id_)
        pg.wait_for_timeout(2600)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / ('r%d.png' % id_)))
        print(id_, r)
    print('errors', len(errs)); [print(' ', e[:300]) for e in errs[:15]]
    b.close()
