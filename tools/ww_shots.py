"""Witch's Wood screenshots: python tools/ww_shots.py  (server on 8374) -> _ww_shots/s_*.png"""
import json, time, pathlib
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(__file__).resolve().parent.parent / '_ww_shots'; OUT.mkdir(exist_ok=True)
FIND = """([tx,ty,f])=>{const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));let best=null,bd=1e9;for(let y=1;y<G.grid.length-1;y++)for(let x=1;x<G.grid[0].length-1;x++){if(G.grid[y][x]!==0||blk.has(x+','+y))continue;const d=Math.abs(x-tx)+Math.abs(y-ty);if(d<bd){bd=d;best=[x,y]}}
 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return best}"""
WOOD = [('gate_glade',27,50,0),('gate_looking_out',27,52,2),('graveyard',6,43,0),('graveyard_totem',6,40,0),('hanged_oak',6,25,0),('hanged_tree_side',9,23,3),('stone_circle',48,26,0),('chapel_front',48,41,1),('chapel_rowan',51,41,1),('well',27,34,0),('root_hollow',27,22,0),('abom',27,20,0),('witch_yard',27,9,0),('cottage_near',27,4,0),('cottage_door',27,2,0),('cauldron',25,5,2),('nw_glade',5,12,0),('ne_glade',49,9,0),('brook',30,36,0),('corridor',20,40,0)]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8374/index.html?town=witchwood&lvl=82&v=%d' % time.time()); pg.wait_for_timeout(7000)
    for name, x, y, f in WOOD:
        r = pg.evaluate(FIND, [x, y, f]); pg.wait_for_timeout(700); pg.screenshot(path=str(OUT / ('s_wood_%s.png' % name))); print(name, r)
    # rooms
    for name, lvl, st, extra in [('parlour', 521, (8, 9, 0), "G.flags.wwHostile=0"), ('cellar', 522, (7, 7, 0), ""), ('kitchen', 523, (6, 7, 0), "")]:
        pg.evaluate("([l,s])=>{goToLevel(l,{x:s[0],y:s[1],f:s[2]})}", [lvl, list(st)]); pg.wait_for_timeout(1200); pg.evaluate("()=>{G.msgs=[]}"); pg.screenshot(path=str(OUT / ('s_%s.png' % name))); print(name)
    pg.evaluate("()=>{G.flags.wwFled=1;G.flags.wwHpFrac=.12;goToLevel(523,{x:6,y:7,f:0})}"); pg.wait_for_timeout(1500); pg.evaluate("()=>{G.msgs=[]}"); pg.screenshot(path=str(OUT / 's_kitchen_witch.png'))
    pg.evaluate("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);hurtEnemy(e,e.maxhp);G.msgs=[]}"); pg.wait_for_timeout(1200); pg.screenshot(path=str(OUT / 's_kitchen_cornered.png'))
    pg.evaluate("()=>{startTalk(G.decor.find(q=>q.npc==='wwo_witchc'))}"); pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 's_talk_cornered.png'))
    pg.evaluate("()=>{G.talk=null;G.flags.wwFled=0;G.flags.wwHostile=1;goToLevel(521,{x:8,y:9,f:0})}"); pg.wait_for_timeout(1500); pg.evaluate("()=>{G.msgs=[]}"); pg.screenshot(path=str(OUT / 's_parlour_witch.png'))
    pg.evaluate("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);e.lunge=1;G.msgs=[]}"); pg.wait_for_timeout(120); pg.screenshot(path=str(OUT / 's_parlour_witch_cast.png'))
    pg.evaluate("()=>{goToLevel(496,{x:38,y:5,f:0})}"); pg.wait_for_timeout(9000)
    for name, x, y, f in [('lane_gate', 38, 6, 0), ('lane_marrow', 38, 9, 2), ('lane_back', 38, 4, 2)]:
        pg.evaluate("([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};G.msgs=[];G.lvlBanners.length=0;LEVEL===496||0}", [x, y, f]); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / ('s_wenlock_%s.png' % name))); print(name)
    print('ERRS', errs[:8]); b.close()
