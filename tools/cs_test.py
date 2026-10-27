"""Store and sort test: python tools/cs_test.py [port]   (server: python -m http.server 8178; Playwright with Chrome). Shots go to the scratchpad folder given by CS_SHOTS."""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8178'
OUT = os.environ.get('CS_SHOTS', '.')
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 720}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=wenlock&lvl=34&estate=1&v=%d' % (PORT, int(time.time())))
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"', timeout=180000); pg.wait_for_timeout(3000)
    pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
    pg.evaluate("()=>{G.gold=500000;G.flags.hs=G.flags.hs||{own:{},slots:{},stock:{},chest:[],tro:{},slain:{}};const T=HS_TOWNS.find(t=>t.key==='wenlock');G.flags.hs.own[T.lvl]={small:1};window._T=T;window._ids=['fishx']}")
    ids = pg.evaluate("""()=>{const all=Object.keys(ITEMDEF);const pick=f=>all.find(i=>f(ITEMDEF[i]));
      return {weapon:pick(d=>d.k==='weapon'&&d.price>100),potion:pick(d=>d.k==='potion'&&d.heal),fish:pick(d=>d.fish),quest:pick(d=>d.k==='quest'&&d.t==='Quest item'),gem:pick(d=>d.gem),herb:pick(d=>d.k==='quest'&&d.t==='Herb'),armour:pick(d=>d.k==='chest')}}""")
    print(ids)
    # outside: Store says only at home
    pg.evaluate("(ids)=>{G.bag.length=0;for(const k of ['weapon','potion','fish','quest','gem','armour'])bagAdd({id:ids[k],n:k==='potion'?3:1});G.inv.open=true;G.inv.tab='bag';G.inv.sel={src:'bag',i:0}}", ids)
    pg.wait_for_timeout(600); pg.screenshot(path=OUT + '/inv_away.png')
    print('away store:', pg.evaluate("()=>{invBtn('istore');return [G.bag.length,G.flags.hs.chest.length]}"))
    # go home
    pg.evaluate("()=>{G.inv.open=false;const T=_T;goToLevel(HS_BASE+3*HS_TOWNS.indexOf(T)+0,{x:5,y:5,f:0})}"); pg.wait_for_timeout(4000)
    print('level home?', pg.evaluate("()=>[LEVEL,!!hsHouseAt(LEVEL)]"))
    pg.evaluate("()=>{G.inv.open=true;G.inv.tab='bag';G.inv.sel={src:'bag',i:0}}"); pg.wait_for_timeout(600); pg.screenshot(path=OUT + '/inv_home.png')
    pg.evaluate("()=>{G.inv.dropKey='b0'}"); pg.wait_for_timeout(500); pg.screenshot(path=OUT + '/inv_drop.png'); pg.evaluate("()=>{G.inv.dropKey=null}")
    q = pg.evaluate("(ids)=>{const i=G.bag.findIndex(b=>b.id===ids.quest);G.inv.sel={src:'bag',i};invBtn('istore');return [G.bag.length,G.flags.hs.chest.length,G.msgs[G.msgs.length-1].text]}", ids)
    print('quest store:', q)
    pg.evaluate("(ids)=>{for(const k of ['weapon','potion','fish','gem','armour']){const i=G.bag.findIndex(b=>b.id===ids[k]);G.inv.sel={src:'bag',i};invBtn(k==='potion'?'istoreall':'istore')}}", ids)
    print('after storing: bag', pg.evaluate("()=>G.bag.map(b=>b.id+'x'+b.n)"), 'chest', pg.evaluate("()=>G.flags.hs.chest.map(b=>b.id+'x'+b.n+'#'+b.a)"))
    # equipped: equip then store
    pg.evaluate("(ids)=>{bagAdd({id:ids.armour,n:1});G.inv.hero=0;const i=G.bag.findIndex(b=>b.id===ids.armour);invBtn('ibag'+i);invBtn('iequip');}", ids)
    pg.evaluate("()=>invBtn('istore')"); print('equipped store -> chest', pg.evaluate("()=>[G.flags.hs.chest.length,JSON.stringify(G.heroes[0].eq.chest||null)]"))
    pg.evaluate("()=>{G.inv.open=false}")
    # chest with a mix, open and sort
    pg.evaluate("(ids)=>{hsChestOpen();for(const id of [ids.quest,ids.herb,ids.fish]){if(id)bagAdd({id,n:1})};for(const id of [ids.quest,ids.herb])if(id){const i=G.bag.findIndex(b=>b.id===id);if(i>=0)hsDeposit(i)}}", ids)
    nm = "()=>G.flags.hs.chest.map(b=>ITEMDEF[b.id].k+':'+ITEMDEF[b.id].n+'('+ITEMDEF[b.id].price+')#'+b.a)"
    print('chest order', pg.evaluate(nm))
    pg.wait_for_timeout(500); pg.screenshot(path=OUT + '/chest.png')
    for step in ['lsortbox', 'lsortdir', 'lsortbox', 'lsortbox', 'lsortdir', 'lsortbox']:
        pg.evaluate("(s)=>lootBtn(s)", step)
        print(step, pg.evaluate("()=>csState().m+' '+csState().up"), pg.evaluate(nm))
        pg.wait_for_timeout(300); pg.screenshot(path=OUT + '/chest_%s_%d.png' % (step, int(time.time() * 10) % 1000))
    pg.evaluate("()=>{G.loot=null}")
    pg.evaluate("()=>writeSave('cs_test')"); order = pg.evaluate(nm)
    pg.goto('http://localhost:%s/index.html?v=%d' % (PORT, int(time.time()))); pg.wait_for_timeout(5000)
    pg.evaluate("()=>{restore(readSave('cs_test'))}"); pg.wait_for_timeout(6000)
    print('reload keeps order:', pg.evaluate(nm) == order, '| sort mode', pg.evaluate("()=>JSON.stringify(G.flags.csort)"), '| acq', pg.evaluate("()=>G.flags.acq"))
    print('errors', errs[:6]); b.close()
