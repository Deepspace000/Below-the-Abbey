"""Dump levels 9680-9702 (my zone) to JSON for analysis. python tools/polish/blight8910_dump.py out.json"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8604')
ALL = [9680,9681,9682,9683,9684,9685,9686,9690,9691,9692,9693,9694,9700,9701,9702]
JS = """() => { const out = {};
 for (const id of %s) { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, T = TERRS[id];
  const wet = []; if (T && T.block) for (let i = 0; i < W*H; i++) if (T.block[i]) wet.push(i);
  const doors = []; for (let y=0;y<H;y++) for (let x=0;x<W;x++){ const g=L.chars[L.rows[y][x]]; if (g!==undefined && KH_DOOR[g]) doors.push([x,y,String(g)]) }
  out[id] = {name:L.name, W, H, rows:L.rows, fmap:L.fmap, start:L.start, wet,
   decor:L.decor.map(d=>({k:d.k,x:d.x,y:d.y,block:!!d.block,npc:d.npc||null,walk:!!d.walk,deco:!!d.deco,found:!!d.found,sc:d.sc||1})),
   enemies:L.enemies.map(e=>({t:e.t,x:e.x,y:e.y})), lights:(L.lights||[]).length, portals:(L.portals||[]).map(p=>({x:p.x,y:p.y})), doors, chars:Object.keys(L.chars).length,
   hts: L.heights ? 1 : 0, keys:Object.keys(L).join(',') } }
 return out }""" % json.dumps(ALL)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width':900,'height':600})
    errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGE '+str(e)))
    pg.on('console', lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight8&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2000)
    r = pg.evaluate(JS)
    json.dump(r, open(sys.argv[1],'w'))
    print('errs', [e for e in errs if 'Failed to load' not in e][:10])
    b.close()
