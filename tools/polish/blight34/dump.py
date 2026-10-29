"""dump levels 9630-9643 to JSON for the audit: python tools/polish/blight34/dump.py"""
import sys, os, json, time
sys.path.insert(0, 'tools')
from playwright.sync_api import sync_playwright
IDS=[9630,9631,9632,9633,9634,9640,9641,9642,9643]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'],executable_path=os.environ.get('BTA_CHROME') or None)
    pg=b.new_page(viewport={'width':900,'height':600}); errs=[]
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)))
    pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8602/index.html?town=blight3&v=%d'%time.time(),wait_until='domcontentloaded',timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000",timeout=90000)
    pg.wait_for_timeout(2500)
    r=pg.evaluate("""()=>{const out={};for(const id of %s){if(!LEVELS[id])KH_LAZY[id]();const L=LEVELS[id],W=L.rows[0].length,H=L.rows.length,T=TERRS[id];
      const doors=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=L.chars[L.rows[y][x]];if(g!==undefined&&KH_DOOR[g])doors.push({x,y,lvl:KH_DOOR[g].lvl,side:KH_DOOR[g].side})}
      out[id]={W,H,rows:L.rows,start:L.start,wet:T&&T.block?Array.from({length:W*H},(_,i)=>T.block[i]?1:0).join(''):'',
      decor:L.decor.map(d=>({k:d.k,x:d.x,y:d.y,block:!!d.block,found:!!d.found,npc:d.npc||null,sc:d.sc,hidden:!!d.hidden})),enemies:L.enemies.map(e=>({t:e.t,x:e.x,y:e.y})),doors,
      npcs:Object.keys(NPCS).filter(k=>/^bl[cg]_/.test(k))}}return out}"""%json.dumps(IDS))
    json.dump(r,open('tools/polish/blight34/levels.json','w'))
    print('errors',errs[:10]); b.close()
