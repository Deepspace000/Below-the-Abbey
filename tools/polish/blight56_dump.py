"""python tools/polish/blight56_dump.py town id [id...] : print rows with decor, enemies, items overlaid as a grid"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8603'); town = sys.argv[1]; ids = [int(x) for x in sys.argv[2:]]
JS = """(ids)=>{const o={};for(const id of ids){if(!LEVELS[id])KH_LAZY[id]();const L=LEVELS[id];o[id]={rows:L.rows,start:L.start,dec:L.decor.map(d=>[d.k,d.x,d.y,d.block?1:0,d.npc||'']),en:L.enemies,items:L.items,lights:L.lights,doors:Object.entries(L.chars||{}).filter(([c,g])=>KH_DOOR[g]).map(([c])=>c)}}return o}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe')
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2500)
    d = pg.evaluate(JS, ids)
    for id, L in d.items():
        print('==', id, 'start', L['start'])
        g = [list(r) for r in L['rows']]
        for r in g:
            for i, c in enumerate(r):
                if c != '.': r[i] = '#' if c == 'w' else '+' if c in L['doors'] else '#'
        for k, x, y, bl, n in L['dec']:
            if 0 <= y < len(g) and 0 <= x < len(g[0]): g[y][x] = ('N' if n else 'B' if bl else 'o')
        for e in L['en']:
            t = e if isinstance(e, list) else [e['t'], e['x'], e['y']]
            g[t[2]][t[1]] = 'E' 
        H=len(g);W=len(g[0]);st=(L['start']['x'],L['start']['y']);seen={st};q=[st]
        ok=lambda x,y:0<=x<W and 0<=y<H and g[y][x] in '.oE'
        for (x,y) in q:
            for a,b in ((1,0),(-1,0),(0,1),(0,-1)):
                if ok(x+a,y+b) and (x+a,y+b) not in seen: seen.add((x+a,y+b));q.append((x+a,y+b))
        for y in range(H):
            for x in range(W):
                if g[y][x] in '.oE' and (x,y) not in seen: g[y][x]='?'
        for r in g: print(''.join(r))
        for k, x, y, bl, n in L['dec']: print('  ', k, x, y, 'B' if bl else '-', n)
        print('  en', L['en']); print('  items', L['items'])
    b.close()
