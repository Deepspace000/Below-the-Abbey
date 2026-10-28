"""Infested houses test: python tools/infest_test.py [port] [oldhaven,khemetra]   (needs a server: python -m http.server 8176, and Playwright with Chrome)
For each town: builds the houses, checks that about one ordinary house in ten is infested (and which are not), that houses that are not infested are unchanged (no stair, no creatures, no bodies),
then walks into infested houses: 1 to 5 low level creatures, bodies on the floor and nobody standing, the stair down in the north wall; goes down the stair into the cellar: rooms, corridor, creatures,
chests and barrels with gold and a few low tier items, every chest and creature reachable; kills everything, goes up and down again (nothing comes back), saves, reloads the page, loads the save.
Prints 'RESULT OK' or 'RESULT FAIL' for each town and the script errors seen in the page."""
import sys, time
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8176'
want = sys.argv[2].split(',') if len(sys.argv) > 2 else ['oldhaven', 'khemetra']
ENTER = {'oldhaven': "goToLevel(305,{x:108,y:50,f:0})", 'khemetra': "khEnter(()=>{goToLevel(44,{x:195,y:316,f:0});G.state='play'})"}
# every home id of the town that could be asked about
IDS = {'oldhaven': "(()=>{const o=[];for(let i=OH.HOME;i<OH.HOME+OH_SPECIAL.length+640;i++)o.push(i);return o})()",
       'khemetra': "(()=>{const o=[];for(let i=1000;i<10000;i++)if(KH_LAZY[i]&&!(i>=6000&&i<7000)&&INF.kind[i]!==undefined)o.push(i);return o})()"}
SURVEY = r'''(ids)=>{
  const inf=[],plain=[],hit=[],n={built:0};
  for(const id of ids){
    try{if(!LEVELS[id]&&KH_LAZY[id])KH_LAZY[id]()}catch(e){continue}
    const L=LEVELS[id];if(!L||L.infest===undefined&&L.stub)continue;
    if(!L.rows)continue;n.built++;
    if(L.infest)inf.push(id);else plain.push(id);
    if(infPick(id))hit.push(id);
    if(plain.length>400)break;
  }
  const bad=[];
  for(const id of plain){const L=LEVELS[id];
    if(L.infestCellar||(L.portals||[]).length>1||(L.rows[0]||'').includes('1')||(L.enemies||[]).length||(L.decor||[]).some(d=>d.infBody)||L.diff===undefined)bad.push(id)}
  return {built:n.built,infested:inf,plainN:plain.length,hits:hit.length,hitInf:hit.filter(i=>LEVELS[i].infest).length,hitNot:hit.filter(i=>!LEVELS[i].infest),bad}}'''
def run(p, town):
    b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 720}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=80&v=%d' % (PORT, int(time.time())))
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"', timeout=180000); pg.wait_for_timeout(2500)
    pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
    pg.evaluate(ENTER[town]); pg.wait_for_timeout(11000 if town == 'khemetra' else 8000)
    ok = True
    def chk(name, cond, extra=''):
        nonlocal ok
        ok = ok and bool(cond); print('  %-62s %s %s' % (name, 'ok' if cond else 'FAIL', extra))
    ids = pg.evaluate(IDS[town])
    s = pg.evaluate(SURVEY, ids)
    print('==', town, 'homes built', s['built'], 'infested', len(s['infested']), 'ordinary kept', s['plainN'], 'hash hits', s['hits'])
    chk('some houses are infested', len(s['infested']) > 0)
    chk('ordinary houses are unchanged (no stair, no creatures, no bodies)', not s['bad'], s['bad'][:5])
    chk('infested share is about 1 in 10 of the houses', 0.03 <= len(s['infested']) / max(1, s['built']) <= 0.14, '%d of %d' % (len(s['infested']), s['built']))
    print('   hash hits that were left alone (shops, quest givers, hoards):', len(s['hitNot']))
    first = s['infested'][:2]
    for hid in first:
        pg.evaluate("(id)=>{G.cut=null;G.talk=null;goToLevel(id,{x:LEVELS[id].start.x,y:LEVELS[id].start.y,f:0})}", hid); pg.wait_for_timeout(2500)
        h = pg.evaluate("""(id)=>{const L=LEVELS[id];const alive=G.enemies.filter(e=>e.hp>0);
          return {lvl:LEVEL,n:alive.length,types:alive.map(e=>e.t),bodies:LEVELS[LEVEL].decor.filter(d=>d.infBody&&/^corpse/.test(d.k)).length,
            people:G.decor.filter(d=>d.npc&&d.npc!=='kh_gold'&&!d.hidden).map(d=>d.npc),stair:G.portals[1]&&G.portals[1].to,stairCell:L.rows[0].indexOf('1'),scene:!!L.scene,
            reach:(()=>{const r=infReach(L,L.start);const sx=L.rows[0].indexOf('1');return r.has(sx+',1')&&alive.every(e=>r.has(e.x+','+e.y))})(),name:L.name}}""", hid)
        print('  house', hid, h['name'], h)
        chk('house %d: 1 to 5 creatures' % hid, h['lvl'] == hid and 1 <= h['n'] <= 5)
        chk('house %d: creatures are low types' % hid, all(t in ('rat', 'bat', 'skel', 'bandit') for t in h['types']))
        chk('house %d: a body on the floor, nobody standing' % hid, h['bodies'] >= 1 and not h['people'])
        chk('house %d: stair down to cellar %d and no room picture' % (hid, hid + 20000), h['stair'] == hid + 20000 and h['stairCell'] > 0 and not h['scene'])
        chk('house %d: creatures and stair reachable' % hid, h['reach'])
        pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(1)}"); pg.wait_for_timeout(2500)
        c = pg.evaluate("""(hid)=>{const L=LEVELS[LEVEL];const alive=G.enemies.filter(e=>e.hp>0);const r=infReach(L,L.start);
          const ch=G.decor.filter(d=>d.k==='chest'),bx=G.decor.filter(d=>d.k==='barrel'||d.k==='crate');
          const tot={gold:0,items:0};const g0=G.gold;for(const d of ch){G.loot=null;d.contents=null;openLoot(d);tot.items+=d.contents.length;}G.loot=null;
          return {lvl:LEVEL,rooms:LEVEL_NAMES[LEVEL],n:alive.length,types:[...new Set(alive.map(e=>e.t))],chests:ch.length,boxes:bx.length,items:tot.items,gold:G.gold-g0,floor:G.items.length,
            reach:ch.every(d=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>r.has((d.x+a)+','+(d.y+b))))&&alive.every(e=>r.has(e.x+','+e.y)),up:G.portals[0]&&G.portals[0].to,mapRooms:(L.mapNames||[]).length,
            tough:Math.max(...alive.map(e=>e.lvl))}}""", hid)
        print('  cellar', hid + 20000, c)
        chk('cellar %d: reached by the stair, a few rooms' % hid, c['lvl'] == hid + 20000 and c['mapRooms'] >= 5)
        chk('cellar %d: 4 to 7 mostly low creatures' % hid, 4 <= c['n'] <= 7)
        chk('cellar %d: 2 or 3 chests, barrels, gold and a few items' % hid, 2 <= c['chests'] <= 3 and c['boxes'] >= 1 and c['gold'] > 0 and c['items'] >= 4 and c['floor'] >= 1)
        chk('cellar %d: everything reachable, way back up' % hid, c['reach'] and c['up'] == hid)
        # clear the cellar, go up, clear the house, come down again: nothing returns
        pg.evaluate("()=>{G.enemies.forEach(e=>{e.hp=0;e.dying=0})}")
        pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(0)}"); pg.wait_for_timeout(2500)
        pg.evaluate("()=>{G.enemies.forEach(e=>{e.hp=0;e.dying=0})}")
        pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(1)}"); pg.wait_for_timeout(2000)
        n1 = pg.evaluate("()=>G.enemies.filter(e=>e.hp>0).length")
        pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(0)}"); pg.wait_for_timeout(2000)
        n2 = pg.evaluate("()=>({lvl:LEVEL,n:G.enemies.filter(e=>e.hp>0).length,bodies:LEVELS[LEVEL].decor.filter(d=>d.infBody).length})")
        for _ in range(2):
            pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(1)}"); pg.wait_for_timeout(1500); pg.evaluate("()=>{G.cut=null;G.talk=null;usePortal(0)}"); pg.wait_for_timeout(1500)
        n3 = pg.evaluate("()=>G.enemies.filter(e=>e.hp>0).length")
        chk('house %d: cleared stays cleared (cellar %d, house %s/%d, later %d)' % (hid, n1, n2['n'], n2['bodies'], n3), n1 == 0 and n2['n'] == 0 and n3 == 0 and n2['bodies'] >= 1)
    # save in the cellar of the first house, reload the page, load the save: still cleared, and a fresh cellar of a second house is still full
    if len(s['infested']) > 2:
        pg.evaluate("(id)=>{G.cut=null;G.talk=null;goToLevel(id+20000,{x:1,y:8,f:1})}", s['infested'][2]); pg.wait_for_timeout(2500)
        left = pg.evaluate("()=>G.enemies.filter(e=>e.hp>0).length"); pg.evaluate("()=>{G.enemies.slice(0,2).forEach(e=>{e.hp=0})}")
        pg.evaluate("()=>writeSave('inf_test')")
        pg.goto('http://localhost:%s/index.html?v=%d' % (PORT, int(time.time()))); pg.wait_for_timeout(5000)
        pg.evaluate("()=>{restore(readSave('inf_test'))}"); pg.wait_for_timeout(11000 if town == 'khemetra' else 8000)
        r = pg.evaluate("()=>({lvl:LEVEL,n:G.enemies.filter(e=>e.hp>0).length})")
        chk('saved in a cellar, page reloaded, save loaded: back in the cellar with 2 fewer creatures (%d -> %d)' % (left, r['n']), r['lvl'] == s['infested'][2] + 20000 and r['n'] == left - 2)
        pg.evaluate("(id)=>{G.cut=null;G.talk=null;usePortal(0)}"); pg.wait_for_timeout(2500)
        back = pg.evaluate("(id)=>({lvl:LEVEL,decor:LEVELS[LEVEL].decor.filter(d=>d.infBody).length})", s['infested'][2])
        chk('and up the stair into the house again', back['lvl'] == s['infested'][2] and back['decor'] >= 1)
    print('  RESULT', 'OK' if ok else 'FAIL', '| errors', errs[:6]); b.close()
    return ok
if __name__ == '__main__':
    with sync_playwright() as p:
        for t in want: run(p, t)
