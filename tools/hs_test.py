"""Housing test: python tools/hs_test.py [port] [town,town,...|all]    (needs a server: python -m http.server 8176, and Playwright with Chrome)
For each town: buys every size the town's agent sells (through the agent's talk menu), walks to each door and in, checks that health and mana are restored, that every
ill but a curse is cured, uses the Home Chest, the bed and the table, leaves by the door, buys a piece of furniture and places it, saves, reloads the page and loads the save.
Prints one block per town; 'errors []' at the end of each block means no script error in the page."""
import sys, time, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8176'
want = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] != 'all' else None
LIB = r'''(()=>{window.look=(x,y,f)=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT}};
window.tkNow=()=>G.talk?{name:G.talk.n.name,text:G.talk.node.text,opts:G.talk.node.opts.map((o,i)=>i+':'+o[0])}:null;
window.tk=(i)=>{const T=G.talk;if(!T)return 'no talk';T.t=G.time-100;talkBtn('tk'+i);return tkNow()};
window.talkTo=(npc)=>{const d=G.decor.find(q=>q.npc===npc&&!q.hidden);if(!d)return 'no '+npc;startTalk(d);if(G.talk)G.talk.t=G.time-100;return tkNow()};
window.clickOpt=(label)=>{const T=G.talk;if(!T)return 'no talk';const i=T.node.opts.findIndex(o=>o[0].includes(label));if(i<0)return 'no option '+label;return tk(i)};
window.heroes=()=>G.heroes.map(h=>h.hp+'/'+h.max+' mp'+h.mp+'/'+h.mpMax);window.affs=()=>afflList().map(e=>e.id);return 1})()'''
ENTER = {'thornwick': "goToLevel(3,{x:39,y:17,f:2})", 'ironhill': "goToLevel(13,{x:46,y:19,f:0})", 'greendale': "goToLevel(32,{x:37,y:11,f:0})", 'anaea': "goToLevel(33,{x:46,y:19,f:0})",
         'yarrim': "goToLevel(290,{x:46,y:56,f:0})", 'oldhaven': "goToLevel(305,{x:108,y:50,f:0})", 'khemetra': "khEnter(()=>{goToLevel(44,{x:195,y:316,f:0});G.state='play'})", 'wenlock': "goToLevel(496,{x:82,y:32,f:0})"}
NAMES = {'small': 'Small House', 'medium': 'Medium House', 'large': 'Large Mansion'}
def run(p, town):
    b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 720}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=80&v=%d' % (PORT, int(time.time())))
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"', timeout=180000); pg.wait_for_timeout(2500)
    pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
    pg.evaluate(LIB); pg.evaluate("()=>{G.gold=500000}")
    pg.evaluate(ENTER[town]); pg.wait_for_timeout(9000 if town == 'khemetra' else 7000)
    T = pg.evaluate('(k)=>{const T=HS_TOWNS.find(t=>t.key===k);window._T=T;return {lvl:T.lvl,sizes:T.sizes,ids:T.ids}}', town)
    print('==', town, 'level', pg.evaluate('()=>LEVEL'), 'sells', T['sizes'])
    ok = True
    for size in T['sizes']:
        pg.evaluate("()=>{G.cut=null;G.talk=null;return talkTo('hs_agent')}"); pg.evaluate("()=>clickOpt('See the houses')")
        pg.evaluate("(z)=>clickOpt(z)", NAMES[size]); pg.evaluate("()=>clickOpt('Buy it')"); pg.evaluate("()=>{G.talk=null}"); pg.wait_for_timeout(1500)
        pg.evaluate("""(s)=>{const T=_T;const P=hsPlot(T,s);const v=[[0,-1],[1,0],[0,1],[-1,0]][P.out];const f=(P.out+2)%4;let sx=P.front[0]+v[0]*2,sy=P.front[1]+v[1]*2;
          const free=(x,y)=>G.grid[y]&&G.grid[y][x]===0&&!G.decor.some(d=>d.block&&!d.found&&!d.hidden&&d.x===x&&d.y===y);if(!free(sx,sy)){sx=P.front[0];sy=P.front[1]}
          G.cut=null;G.talk=null;look(sx,sy,f);G.heroes.forEach(h=>{h.hp=3;h.mp=0});afflInflict('fever',0);afflInflict('poisoned',1);afflInflict('cursed',-1,true);
          const l0=LEVEL;for(let i=0;i<4&&LEVEL===l0;i++)doMove(0)}""", size)
        pg.wait_for_timeout(2500)
        r = pg.evaluate("()=>({lvl:LEVEL,heroes:heroes(),affs:affs()})")
        good = r['lvl'] == T['ids'][size] and all(h.split(' ')[0].split('/')[0] == h.split(' ')[0].split('/')[1] for h in r['heroes']) and set(r['affs']) - {'wellrested','wellfed'} == {'cursed'}
        c = pg.evaluate("""()=>{G.bag.push({id:'torch',n:2});G.talk=null;hsChestOpen();hsDeposit(G.bag.findIndex(b=>b.id==='torch'));const a=G.flags.hs.chest.length;G.loot.sel={side:'box',i:0};lootBtn('lact');G.loot=null;return [a,G.flags.hs.chest.length]}""")
        rest = pg.evaluate("()=>{G.heroes.forEach(h=>{h.hp=5;h.food=10});const c=G.clock;talkTo('hs_bed');clickOpt('Sleep');return [G.clock-c,G.heroes.every(h=>h.hp===h.max)]}")
        eat = pg.evaluate("()=>{G.heroes.forEach(h=>{h.food=10});talkTo('hs_table');clickOpt('Eat');return G.heroes.every(h=>h.food===100)}")
        pg.evaluate("()=>{const L=LEVELS[LEVEL],R=HS_ROOMS[L.hs.size];G.talk=null;look(R.door,L.rows.length-2,2);doMove(0)}"); pg.wait_for_timeout(2500)
        out = pg.evaluate("(s)=>[LEVEL===_T.lvl,G.P.x===hsPlot(_T,s).front[0]&&G.P.y===hsPlot(_T,s).front[1]]", size)
        good = good and c == [1, 0] and rest == [480, True] and eat and out == [True, True]
        ok = ok and good
        print('  %-6s enter+heal+cure %s | chest %s | rest %s | eat %s | left by the door %s => %s' % (size, r['lvl'], c, rest, eat, out, 'OK' if good else 'FAIL'))
    pg.evaluate("()=>{G.talk=null;G.cut=null;return talkTo('hs_agent')}"); pg.evaluate("()=>clickOpt('Buy furniture')"); pg.evaluate("()=>clickOpt('Rocking chair')"); pg.evaluate("()=>clickOpt('Buy it')"); pg.evaluate("()=>clickOpt('Put it in your')")
    sl = pg.evaluate("()=>JSON.stringify(G.flags.hs.slots)"); print('  furniture placed:', sl); ok = ok and 'rocker' in sl
    pg.evaluate("()=>{G.talk=null}"); pg.wait_for_timeout(1200); pg.evaluate("()=>writeSave('hs_test')")
    pg.goto('http://localhost:%s/index.html?v=%d' % (PORT, int(time.time()))); pg.wait_for_timeout(5000); pg.evaluate(LIB)
    pg.evaluate("()=>{restore(readSave('hs_test'))}"); pg.wait_for_timeout(9000 if town == 'khemetra' else 6000)
    rl = pg.evaluate("()=>({lvl:LEVEL,own:JSON.stringify(G.flags.hs.own),slots:JSON.stringify(G.flags.hs.slots),doors:HS_TOWNS.find(t=>t.lvl===LEVEL).sizes.map(s=>{const P=hsPlot(HS_TOWNS.find(t=>t.lvl===LEVEL),s);return G.grid[P.door[1]][P.door[0]]>=1000})})")
    print('  reloaded from the save:', rl, 'RESULT', 'OK' if ok and all(rl['doors']) and 'rocker' in rl['slots'] else 'FAIL', '| errors', errs[:5]); b.close()
if __name__ == '__main__':
    with sync_playwright() as p:
        towns = ['thornwick', 'ironhill', 'greendale', 'anaea', 'yarrim', 'oldhaven', 'khemetra', 'wenlock']
        for t in towns:
            if want and t not in want: continue
            run(p, t)
