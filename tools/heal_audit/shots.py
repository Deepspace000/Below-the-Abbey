"""Screenshots of the priest's powers page at level 1 and 60.  python tools/heal_audit/shots.py"""
import os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('HEAL_PORT', '8358'); HERE = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=120000); pg.wait_for_timeout(2500)
    for L in (1, 60):
        pg.evaluate("""(L)=>{const pi=G.heroes.findIndex((h,i)=>HERO_DEF[i].cls==='Priest');const h=G.heroes[pi];h.learned=['c10'];while(h.lvl<L){h.xp=xpNeed(h.lvl);levelUp(pi)}G.lvlBanners.length=0;G.msgs=[];openInv(pi);G.inv.tab='powers'}""", L)
        pg.wait_for_timeout(800)
        pg.screenshot(path=os.path.join(HERE, 'shot_powers_L%d.png' % L))
        print(pg.evaluate("()=>heroPowers(G.heroes.findIndex((h,i)=>HERO_DEF[i].cls==='Priest')).filter(p=>p.act).map(p=>p.name+' ('+p.cost+'): '+p.d)"))
    print('page errors', errs)
    b.close()
