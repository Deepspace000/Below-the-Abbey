"""Wenlock quest and door test: python tools/wl_quest_test.py"""
import time
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8377/index.html?town=wenlock&lvl=80&v=%d' % time.time()
JS = r"""async () => {
  const log = []; const wait = ms => new Promise(r => setTimeout(r, ms));
  let met = 0; const _w = wkMet; wkMet = function (w) { if (w === 'mayor') met++; return _w.apply(this, arguments) };
  const F = G.flags;
  // the mayor: first talk calls wkMet('mayor') once
  const mk = id => NPCS[id].root({k: 'x', x: 1, y: 1});
  mk('wlo_mayor'); mk('wlo_mayor'); log.push('mayor wkMet calls ' + met);
  const step = (id, doit) => { try { doit && doit(); log.push(id + ' ready=' + qReady(id) + ' st=' + qSt(id)); } catch (e) { log.push(id + ' ERR ' + e) } };
  const give = id => { if (qSt(id) === null) qAccept(id) };
  // 1
  give('wlq1'); step('wlq1', () => { NPCS.wlo_crier.root({}) }); qTurnIn('wlq1');
  give('wlq2'); const cat = G.decor.find(d => d.npc === 'wlo_cat'); NPCS.wlo_cat.root(cat); step('wlq2'); qTurnIn('wlq2');
  give('wlq3'); NPCS.wlo_dog1.root({}); const pie = G.decor.find(d => d.npc === 'wlo_pie'); NPCS.wlo_pie.root(pie); step('wlq3'); qTurnIn('wlq3');
  give('wlq4'); NPCS.wlo_girl.root({}); const ring = G.decor.find(d => d.npc === 'wlo_ring'); NPCS.wlo_ring.root(ring); step('wlq4'); qTurnIn('wlq4');
  give('wlq5'); F.k_wlo_hob = 1; step('wlq5'); qTurnIn('wlq5');
  give('wlq6'); bagAdd(mkItem('ale')); bagAdd(mkItem('ale')); bagAdd(mkItem('ale')); step('wlq6'); qTurnIn('wlq6');
  give('wlq7'); for (const n of ['wlo_oldwalt', 'wlo_minstrel', 'wlo_gran']) NPCS[n].root({}); step('wlq7'); qTurnIn('wlq7');
  give('wlq8'); log.push('well open ' + F.wlWellOpen + ' door ' + JSON.stringify(WK.WELLDOOR) + ' back ' + JSON.stringify(WK.WELLBACK));
  const wr = NPCS.wlo_well.root({}); log.push('well opts ' + wr.opts.map(o => o[0]).join('|'));
  F.wlWellDone = true; step('wlq8'); qTurnIn('wlq8'); log.push('key ' + bagCount('wlkey'));
  give('wlq9'); step('wlq9'); qTurnIn('wlq9');
  give('wlq10'); for (const n of ['wlo_judge', 'wlo_crier']) NPCS[n].root({}); step('wlq10'); qTurnIn('wlq10');
  log.push('done: ' + ['wlq1','wlq2','wlq3','wlq4','wlq5','wlq6','wlq7','wlq8','wlq9','wlq10'].map(q => qSt(q)).join(','));
  // every door: enter and come back
  const bad = []; let ok = 0;
  for (const d of WL_DOORS) {
    goToLevel(496, {x: d.front.x, y: d.front.y, f: d.out}); await wait(60);
    if (!LEVELS[d.id] && KH_LAZY[d.id]) { try { KH_LAZY[d.id]() } catch (e) { bad.push(d.id + ' build ' + e); continue } }
    if (!LEVELS[d.id]) { bad.push(d.id + ' none'); continue }
    goToLevel(d.id, KH_DOOR_AT(d)); await wait(60);
    const p = LEVELS[d.id].portals && LEVELS[d.id].portals[0];
    if (!p || p.to !== 496 || p.x !== d.front.x || p.y !== d.front.y) bad.push(d.id + ' back ' + JSON.stringify(p));
    else ok++;
  }
  log.push('doors ok ' + ok + ' of ' + WL_DOORS.length + ' bad ' + JSON.stringify(bad));
  return log;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and '404' not in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(8000)
    pg.evaluate("() => { window.KH_DOOR_AT = d => { const L = LEVELS[d.id]; return {x: L.start.x, y: L.start.y, f: 0} } }")
    for l in pg.evaluate(JS): print(l)
    print('errors', errs[:10]); b.close()
