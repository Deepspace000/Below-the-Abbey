import sys,time,json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':1000,'height':700})
    logs=[]
    pg.on('console',lambda m:logs.append(m.text) if m.type=='error' and 'ERR_CONNECTION' not in m.text else None)
    pg.on('pageerror',lambda e:logs.append(str(e)))
    pg.goto('http://localhost:8356/index.html?v=%d'%time.time(),wait_until='commit',timeout=120000)
    pg.wait_for_function('window.__ready',timeout=120000)
    print(pg.evaluate("""()=>{const d=DIRS[G.P.f];const a=[];for(let k=1;k<9;k++)a.push(cellBlocked(G.P.x+d[0]*k,G.P.y+d[1]*k)?1:0);
      return {P:[G.P.x,G.P.y,G.P.f],a,ens:G.enemies.length,eds:Object.keys(ENEMY_DEF).slice(0,12),slots:typeof SPELL_SLOTS!=='undefined'&&SPELL_SLOTS,eq:G.heroes[2].eq,mpk:Object.keys(G.heroes[2]),pw:heroPowers(2).map(p=>p.name+':'+p.type),itm:Object.keys(ITEMDEF).filter(k=>/sp_|scroll/.test(k))}}"""))
    print(logs[:10])
    b.close()
