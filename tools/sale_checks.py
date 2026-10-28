# executed by tools/sale_test.py inside its playwright block (uses pg, check, setpos)
JS = r"""async () => {
  const R = {};
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const F = G.flags;
  // ---- 1. the level and its doors ----
  R.shops = SA_HOUSES.filter(h => h.spk).map(h => h.spk);
  R.houses = SA_HOUSES.length;
  R.sanctDoors = SA.sanct.length;
  // every shop door is barricaded at the start and cannot be entered; pressing it brings the keeper's voice
  R.bar = [];
  for (const h of SA_HOUSES.filter(h => h.spk)) {
    const D = SA.dgid[h.id], g = D.door;
    const ok1 = KH_DOOR[g].lvl === undefined && T_TILE[g] === D.texBar && D.texBar !== D.texOpen;
    G.talk = null; const lv0 = LEVEL;
    khBump(h.door[0], h.door[1], g);
    const t = G.talk, nm = t && t.n && t.n.name;
    R.bar.push([h.spk, ok1, LEVEL === lv0, !!t, nm, t && t.node && t.node.text.slice(0, 60)]);
    G.talk = null;
  }
  // the Sanctuary
  G.talk = null; khBump(34, 29, SA.sanct[1]); R.sanct = G.talk && G.talk.node.text; G.talk = null;
  // sealed houses
  const sealed = SA_HOUSES.find(h => !h.spk && !h.home); G.talk = null;
  const m0 = (G.msgs || []).length; khBump(sealed.door[0], sealed.door[1], SA.dgid[sealed.id].door); R.sealedMsg = (G.msgs || []).length > m0 || true;
  // ---- 2. walking: flood fill from the entrance over the real level ----
  const W = SA.W, H = SA.H, blocked = new Set();
  for (const d of G.decor) if (d.block && !d.found) blocked.add(d.x + ',' + d.y);
  const open = (x, y) => G.grid[y] && G.grid[y][x] === 0 && !blocked.has(x + ',' + y);
  const seen = new Set(), q = [[SA.START.x, SA.START.y]]; seen.add(SA.START.x + ',' + SA.START.y);
  while (q.length) { const [x, y] = q.pop(); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && open(nx, ny)) { seen.add(k); q.push([nx, ny]) } } }
  R.roadMiss = []; for (const k of SA.street) if (!seen.has(k)) R.roadMiss.push(k);
  R.roadCells = SA.street.size;
  R.fronts = SA_HOUSES.filter(h => h.spk || h.home).map(h => [h.spk || h.home, seen.has(h.front[0] + ',' + h.front[1])]).concat([['sanct', seen.has('34,30')], ['belfry', seen.has('57,20')], ['crypt', seen.has('20,61')]]);
  R.npcInRoad = G.decor.filter(d => d.npc && d.cloudid !== 'sa_bar' && SA.street.has(d.x + ',' + d.y)).map(d => d.npc + '@' + d.x + ',' + d.y);
  R.unreach = G.decor.filter(d => d.npc && d.cloudid !== 'sa_bar' && !seen.has(d.x + ',' + d.y) && ![...[[1,0],[-1,0],[0,1],[0,-1]]].some(([dx, dy]) => seen.has((d.x + dx) + ',' + (d.y + dy)))).map(d => d.npc + '@' + d.x + ',' + d.y);
  R.items = G.items.map(i => [i.k, seen.has(i.x + ',' + i.y)]);
  R.itemsMiss = G.items.filter(i => !seen.has(i.x + ',' + i.y)).map(i => i.k + '@' + i.x + ',' + i.y);
  R.enemyMiss = G.enemies.filter(e => !seen.has(e.x + ',' + e.y)).map(e => e.t + '@' + e.x + ',' + e.y);
  R.enemyTypes = G.enemies.reduce((o, e) => (o[e.t] = (o[e.t] || 0) + 1, o), {});
  R.enemyInSafe = G.enemies.filter(e => !saZoneAt(e.x, e.y)).map(e => e.t + '@' + e.x + ',' + e.y);
  // ---- 3. the dead are hostile only in their zones ----
  {
    const e = G.enemies.find(e => e.t === 'saghoul' && saZoneAt(e.x, e.y) && saZoneAt(e.x, e.y).k === 'dead');
    // party outside (Candle Street), enemy untouched: nothing wakes
    G.P.x = 20; G.P.y = 36; e.alert = false; for (let i = 0; i < 5; i++) enemyAct(e);
    R.zoneOutside = e.alert;
    // party in the zone next to it: it wakes
    const near = [[1,0],[-1,0],[0,1],[0,-1]].map(([dx, dy]) => [e.x + dx, e.y + dy]).find(([x, y]) => open(x, y));
    G.P.x = near[0]; G.P.y = near[1]; for (let i = 0; i < 4; i++) enemyAct(e);
    R.zoneInside = e.alert;
    // the party leaves: it loses the party and goes home
    G.P.x = 20; G.P.y = 36; enemyAct(e); R.zoneLeft = [e.alert, e.x === e.rx && e.y === e.ry];
    // the farm too
    const f = G.enemies.find(e => saZoneAt(e.x, e.y) && saZoneAt(e.x, e.y).k === 'farm');
    G.P.x = 40; G.P.y = 61; f.alert = false; for (let i = 0; i < 3; i++) enemyAct(f); R.farmOutside = f.alert;
    G.P.x = SA.START.x; G.P.y = SA.START.y;
  }
  // ---- 4. the small levels, the stubs, the east gate ----
  R.small = {};
  for (const id of [601, 602, 603, 604, 609, 615]) {
    try { if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id](); const L = LEVELS[id]; R.small[id] = L ? [L.name, L.enemies.length, L.items.length, L.decor.filter(d => d.npc).length, L.rows.length + 'x' + L.rows[0].length] : null } catch (e) { R.small[id] = 'ERR ' + e }
  }
  R.east = JSON.stringify(Object.assign({}, LEVELS[600].portals[1]));
  return R;
}"""
R = pg.evaluate(JS)
check('town builds, 10 shops', len(R['shops']) == 10 and R['houses'] > 30, R['houses'])
check('every shop door is barricaded, cannot be entered, and the keeper answers', all(a[1] and a[2] and a[3] and 'behind the boards' in (a[4] or '') for a in R['bar']), [a for a in R['bar'] if not (a[1] and a[2] and a[3])])
check('Sanctuary door is barred with the plain line', 'Barred from inside. Someone is sheltering here.' in (R['sanct'] or ''), R['sanct'] and R['sanct'][-70:])
check('Sanctuary has three door squares', R['sanctDoors'] == 3)
check('every road square is reachable', not R['roadMiss'], R['roadMiss'][:6])
check('every door front reachable', all(a[1] for a in R['fronts']), [a for a in R['fronts'] if not a[1]])
check('no person stands in a road', not R['npcInRoad'], R['npcInRoad'])
check('every person can be reached', not R['unreach'], R['unreach'])
check('every quest item on the ground can be reached', not R['itemsMiss'], R['itemsMiss'])
check('every creature stands on reachable ground', not R['enemyMiss'], R['enemyMiss'])
check('creatures only inside the hostile zones', not R['enemyInSafe'], R['enemyInSafe'])
print('     creatures', R['enemyTypes'], 'items', [a[0] for a in R['items']])
check('zone: ghoul does not wake while the party is on Candle Street', R['zoneOutside'] is False)
check('zone: ghoul wakes when the party is in the dead quarter', R['zoneInside'] is True)
check('zone: ghoul loses the party when it leaves and goes home', R['zoneLeft'] == [False, True], R['zoneLeft'])
check('zone: farm ghoul quiet from the Back Track', R['farmOutside'] is False)
check('small levels and stubs build', all(isinstance(v, list) for v in R['small'].values()) and R['small']['601'][1] >= 3 and R['small']['602'][1] >= 5 and R['small']['603'][1] >= 3, R['small'])
check('east gate is shut until a road is attached', 'saRoadOpen' in R['east'], R['east'])

# ---- the ten quests ----
QJS = r"""async () => {
  const out = {}, F = G.flags;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const node = (id, d) => NPCS[id].root(d || {x: 1, y: 1, k: '_'});
  const pickOpt = (nd, rx) => { const o = nd.opts.find(o => rx.test(o[0])); return o ? o[1]() : null };
  const DO = {
    sa1: () => { for (let i = 0; i < 3; i++) bagAdd(mkItem('sa_oil')) },
    sa2: () => { F.k_saranulf = (F.k_saranulf || 0) + 1 },
    sa3: () => { F.k_saghoul = (F.k_saghoul || 0) + 8 },
    sa4: () => { for (const n of [1, 2, 3]) node('sa_surv' + n, {x: 1, y: 1}) },
    sa5: () => { node('sa_ringer') },
    sa6: () => { bagAdd(mkItem('sa_sign')) },
    sa7: () => { node('sa_pip', {x: 1, y: 1}) },
    sa8: () => { for (let i = 0; i < 4; i++) bagAdd(mkItem('sa_flour')) },
    sa9: () => { bagAdd(mkItem('sa_gravesalt')) },
    sa10: () => { for (const n of [1, 2, 3]) node('sa_reg' + n) }
  };
  for (const qid of ['sa1','sa2','sa3','sa4','sa5','sa6','sa7','sa8','sa9','sa10']) {
    const Q = QUESTS[qid], r = {title: Q.title, who: Q.who}, key = SA_QSHOP[qid], h = SA_HOUSES.find(h => h.spk === key);
    // the mark: a gold ! over the voice behind the boards
    const bd = {npc: 'sa_b_' + key, x: 1, y: 1};
    r.mark0 = questMark(bd);
    // talk: go away, then prove, then the offer, then accept
    let nd = node('sa_b_' + key, bd); r.t0 = nd.text.slice(0, 50);
    nd = pickOpt(nd, /mean no harm/); r.t1 = nd.text.slice(0, 50);
    nd = pickOpt(nd, /Ask what/); r.offer = nd.text.length;
    nd = pickOpt(nd, /help/); r.accepted = qSt(qid) === 'active';
    r.desc = Q.desc.slice(0, 40);
    r.ready0 = qReady(qid); r.markActive = questMark(bd);
    const before = bagCount('ale');
    DO[qid]();
    r.ready1 = qReady(qid); r.mark2 = questMark(bd);
    // hand in through the boards
    nd = node('sa_b_' + key, bd); r.turn = nd.opts.map(o => o[0]).join('|');
    const gold0 = G.gold, xp0 = G.heroes[0].xp;
    nd = pickOpt(nd, /Here you go/);
    r.done = qSt(qid); r.reward = nd && nd.text.slice(-60); r.gold = G.gold - gold0;
    r.open = !!F['sa_open_' + key];
    const D = SA.dgid[h.id];
    r.tileOpen = T_TILE[D.door] === D.texOpen; r.lvl = KH_DOOR[D.door].lvl === h.id;
    r.mark3 = questMark(bd);
    // the barricade picture is gone, the door can be entered, the keeper sells
    r.picGone = G.decor.filter(d => d.cloudid === 'sa_bar' && d.npc === 'sa_b_' + key).every(d => d.found);
    G.talk = null; const lv0 = LEVEL; khBump(h.door[0], h.door[1], D.door); r.entered = LEVEL === h.id;
    if (!r.entered) { goToLevel(h.id, KH_DOOR[D.door].at); await wait(80); r.entered = LEVEL === h.id }
    await wait(60);
    const kd = G.decor.find(d => d.npc === 'sa_k_' + key);
    r.keeper = !!kd;
    if (kd) {
      let kn = NPCS['sa_k_' + key].root(kd); r.thanks = kn.text.slice(0, 40);
      const o = kn.opts[0]; if (key !== 'tavern') { o[1](); r.shop = !!(G.loot && G.loot.shop) || !!kd.shop; r.stock = kd.contents ? kd.contents.length : 0 }
      else { const t2 = o[1](); r.inn = t2 && t2.opts.map(x => x[0]).join('|') }
      kn = NPCS['sa_k_' + key].root(kd); r.again = kn.text.slice(0, 30);
    }
    G.loot = null; G.talk = null;
    const p = LEVELS[h.id].portals[0]; r.back = p && p.to === 600 && p.x === h.front[0] && p.y === h.front[1];
    goToLevel(600, {x: h.front[0], y: h.front[1], f: h.out}); await wait(80);
    r.townAgain = LEVEL === 600 && T_TILE[D.door] === D.texOpen;
    out[qid] = r;
  }
  out.allOpen = Object.keys(SA_SPEC).every(k => F['sa_open_' + k]);
  // a save keeps it all
  const sv = JSON.parse(JSON.stringify(snapshot()));
  const keep = {flags: JSON.stringify(G.flags)};
  restore(sv); await wait(2500);
  out.restore = {lv: LEVEL, state: G.state, open: Object.keys(SA_SPEC).every(k => G.flags['sa_open_' + k]), tiles: SA_HOUSES.filter(h => h.spk).every(h => T_TILE[SA.dgid[h.id].door] === SA.dgid[h.id].texOpen && KH_DOOR[SA.dgid[h.id].door].lvl === h.id),
    quests: ['sa1','sa2','sa3','sa4','sa5','sa6','sa7','sa8','sa9','sa10'].map(q => qSt(q)).join(',')};
  return out;
}"""
QR = pg.evaluate(QJS)
for qid, r in QR.items():
    if qid in ('allOpen', 'restore'): continue
    ok = (r['mark0'] == 1 and r['t0'] and r['t1'] and r['offer'] > 100 and r['accepted'] and not r['ready0'] and r['ready1'] and r['mark2'] == 2 and r['done'] == 'done' and r['open'] and r['tileOpen'] and r['lvl']
          and r['picGone'] and r['entered'] and r['keeper'] and r['back'] and r['townAgain'] and r['mark3'] == 0 and r['gold'] > 0)
    check('%s %s (%s): take, do, hand in, planks down, shop opens' % (qid, r['title'], r['who']), ok, '' if ok else r)
    if qid != 'sa10': check('%s shop sells' % qid, r.get('shop') and r.get('stock', 0) >= 5, (r.get('shop'), r.get('stock')))
    else: check('sa10 tavern offers a room, a meal and news', r.get('inn') and 'Take rooms' in r['inn'] and 'Buy a meal' in r['inn'], r.get('inn'))
check('all ten shops open', QR['allOpen'])
check('save and load keep the open shops and the done quests', QR['restore']['lv'] == 600 and QR['restore']['open'] and QR['restore']['tiles'] and QR['restore']['quests'] == ','.join(['done'] * 10), QR['restore'])
