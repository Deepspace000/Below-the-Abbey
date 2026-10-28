"""Screenshot of the priest spell page at level 60 (Restoration card).  python tools/heal_audit/shot_spells.py"""
import os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('HEAL_PORT', '8358'); HERE = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=1&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof heroSpecial==='function'", timeout=120000); pg.wait_for_timeout(2500)
    pg.evaluate("""()=>{const pi=G.heroes.findIndex((h,i)=>HERO_DEF[i].cls==='Priest');const h=G.heroes[pi];while(h.lvl<60){h.xp=xpNeed(h.lvl);levelUp(pi)}G.gold=9000;G.lvlBanners.length=0;G.msgs=[];G.sshero=pi;openSpellShop()}""")
    pg.wait_for_timeout(1200)
    pg.screenshot(path=os.path.join(HERE, 'shot_spells_L60.png'))
    print('errors', errs)
    b.close()
