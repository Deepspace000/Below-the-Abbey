async () => {
  const log = [], ok = (c, m) => log.push((c ? 'ok   ' : 'FAIL ') + m);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const F = () => gyF();
  const go = async (id, x, y, f) => { G.talk = null; goToLevel(id, {x, y, f: f || 0}); await wait(900); G.state = 'play'; };
  const talkTo = (npc, nth) => { const ds = G.decor.filter(q => q.npc === npc && !q.found); const d = ds[nth || 0]; if (!d) return null; startTalk(d); return G.talk };
  const pick = i => { const T = G.talk, o = T.node.opts[i]; const next = o[1](); if (G.talk === T) { if (next) { T.node = next } else G.talk = null } return G.talk };
  const optText = () => G.talk ? G.talk.node.opts.map(o => o[0]).join(' | ') : '(closed)';
  const bag = id => bagCount(id);
  const lvl0 = G.heroes[0].lvl; window.__mlog = []; { const _m = msg; msg = function (t, c) { window.__mlog.push(t); return _m.apply(this, arguments) } }
  // ---- the crypt: meet her, accept the first quest ----
  await go(531, 12, 17, 0);
  ok(LEVEL === 531, 'in the crypt');
  let T = talkTo('gyo_ghost'); ok(!!T, 'the ghost can be spoken to'); ok(/Aldith/.test(T.node.text), 'her first words: ' + T.node.text.slice(0, 40)); ok(optText().includes('We will help'), 'offer: ' + optText());
  pick(0); ok(qSt('gyq1') === 'active', 'quest 1 accepted'); G.talk = null;
  ok(QGIVER.gyo_ghost.length === 5, 'quest marks list');
  for (let k = 0; k < 4; k++) {
    const id = GY.M[k];
    if (!LEVELS[id]) KH_LAZY[id]();
    const L = LEVELS[id], M = L._gy.M, d = M.door;
    await go(id, L.start.x, L.start.y, 1);
    ok(LEVEL === id && G.enemies.some(e => ENEMY_DEF[e.t].gyb === k), 'maze ' + (k + 1) + ' entered, boss present (' + G.enemies.length + ' creatures)');
    const doorG = L.chars[L.rows[d.y][d.x]];
    ok(G.grid[d.y][d.x] !== 0, 'boss door closed');
    khBump(d.x, d.y, doorG); ok(G.grid[d.y][d.x] !== 0, 'door still shut without its answer: ' + (G.msgs[G.msgs.length - 1] || {}).text);
    if (k === 0) {
      const kd = G.decor.find(q => q.npc === 'gyo_keychest'); startTalk(kd); ok(optText().includes('Take the key'), 'key chest: ' + optText()); pick(0); ok(bag('gykey') === 1, 'key in the bag'); G.talk = null;
      ok(qGoal('gyq1') >= 1, 'quest 1 step 1 done');
      khBump(d.x, d.y, doorG); ok(G.grid[d.y][d.x] === 0 && !bag('gykey'), 'the key opens the door and is used up');
    } else if (k === 1) {
      const lev = [0, 1, 2].map(i => { const s0 = L.decor.find(z => z.npc === 'gyo_lever' && z.i === i); return G.decor.find(z => z.x === s0.x && z.y === s0.y) });
      const pull = i => { startTalk(lev[i]); pick(0); G.talk = null };
      pull(1); ok(F().seq.length === 0, 'wrong lever resets'); pull(0); pull(2); ok(F().seq.length === 2, 'levers 0 and 2 down'); pull(1);
      ok(!!F().lev && G.grid[d.y][d.x] === 0, 'three levers in order open the gate');
      const rd = G.decor.find(q => q.npc === 'gyo_riddle'); startTalk(rd); ok(/CROSS COMES FIRST/.test(G.talk.node.text), 'the riddle stone reads'); G.talk = null;
    } else if (k === 2) {
      const spirits = G.enemies.filter(e => /^gy(wraith|shade|banshee)$/.test(e.t)); ok(spirits.length >= 10, 'spirits in the barrow: ' + spirits.length);
      for (let i = 0; i < 8; i++) hurtEnemy(spirits[i], spirits[i].hp + 1);
      ok((F().k3 | 0) === 8 && G.grid[d.y][d.x] === 0, 'eight spirits at peace open the door');
      G.spiritsN = spirits.length;
    } else {
      const ch = G.decor.find(q => q.npc === 'gyo_trapchest'); startTalk(ch); ok(optText().includes('Cut the wire'), 'trapped chest: ' + optText()); pick(1); ok(bag('gyseal') === 1, 'seal taken (forced: trap sprung, rats: ' + G.enemies.filter(e => e.t === 'gyrats' && e.hp > 0).length + ')'); G.talk = null;
      khBump(d.x, d.y, doorG); ok(G.grid[d.y][d.x] === 0 && !bag('gyseal'), 'the seal opens the door and is used up');
    }
    // walk: the boss room must be reachable from the arrival through the open door
    const W = GYM.W, H = GYM.H, seen = new Set([L.start.x + ',' + L.start.y]), q = [[L.start.x, L.start.y]];
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, kk = nx + ',' + ny; if (seen.has(kk) || nx < 0 || ny < 0 || nx >= W || ny >= H || G.grid[ny][nx] !== 0) continue; if (G.decor.some(z => z.block && !z.found && z.x === nx && z.y === ny)) continue; seen.add(kk); q.push([nx, ny]) } }
    ok(seen.has(((M.boss.x0 + M.boss.x1) >> 1) + ',' + ((M.boss.y0 + M.boss.y1) >> 1)), 'boss room reachable on foot (' + seen.size + ' squares)');
    // the fight: the boss acts, calls helpers, dies
    const boss = G.enemies.find(e => ENEMY_DEF[e.t].gyb === k); G.P.x = M.door.ix; G.P.y = M.door.iy;
    ok(boss.maxhp > 14000 && boss.maxhp < 21000 && boss.lvl === 84 + k, 'boss ' + boss.t + ' hp ' + boss.maxhp + ' level ' + boss.lvl);
    boss.alert = true; let acts = 0; const hurt0 = G.heroes.reduce((n, h) => n + h.hp, 0);
    for (let i = 0; i < 24; i++) { acts += ENEMY_DEF[boss.t].act(boss) ? 1 : 0 }
    const hurt1 = G.heroes.reduce((n, h) => n + h.hp, 0); ok(acts >= 4 && hurt1 < hurt0, 'special moves fired ' + acts + ' times, party lost ' + (hurt0 - hurt1) + ' health over 24 rounds');
    G.heroes.forEach(h => { h.alive = true; h.hp = h.max });
    const n0 = G.enemies.length; hurtEnemy(boss, Math.round(boss.maxhp * .4)); hurtEnemy(boss, Math.round(boss.maxhp * .35)); ok(G.enemies.length > n0, 'helpers arrived at the thresholds (' + (G.enemies.length - n0) + ')');
    hurtEnemy(boss, boss.hp + 5); ok(F().dead[k] === 1, 'boss dead flag'); ok(bag(['gyring','gyname','gylocket','gybook'][k]) === 1, 'relic in the bag');
    for (let i = 0; i < 60 && !G.talk; i++) await wait(300); ok(!!G.talk && /Climb out/.test(optText()), 'last words, then: ' + optText());
    pick(0); await wait(1500); ok(LEVEL === GY.ID, 'back in the graveyard'); G.talk = null;
    // no respawn: go back in, the boss is gone, the dead stay dead
    await go(id, L.start.x, L.start.y, 1); ok(!G.enemies.some(e => ENEMY_DEF[e.t].gyb !== undefined && e.hp > 0), 'boss does not come back'); ok(G.grid[d.y][d.x] === 0, 'the opened door stays open');
    if (k === 2) ok(G.enemies.filter(e => /^gy(wraith|shade|banshee)$/.test(e.t) && e.hp > 0).length <= G.spiritsN - 8, 'fallen spirits stay down (' + G.enemies.filter(e => /^gy(wraith|shade|banshee)$/.test(e.t) && e.hp > 0).length + ' left of ' + G.spiritsN + ')');
  }
  // ---- hand in the four, in order ----
  await go(531, 12, 17, 0); G.heroes.forEach(h => { h.alive = true; h.hp = h.max });
  const rew = [];
  for (let i = 1; i <= 4; i++) {
    const g0 = G.gold; T = talkTo('gyo_ghost');
    if (qSt('gyq' + i) === null) { ok(true, 'quest ' + i + ' offered: ' + optText()); pick(0); ok(qSt('gyq' + i) === 'active', 'quest ' + i + ' accepted'); T = talkTo('gyo_ghost') }
    ok(qReady('gyq' + i), 'quest ' + i + ' ready'); ok(/Here/.test(optText()), 'hand-in option: ' + optText()); pick(0);
    ok(qSt('gyq' + i) === 'done', 'quest ' + i + ' done'); rew.push(G.gold - g0); G.talk = null;
  }
  ok(bag('gyring') && bag('gyname') && bag('gylocket') && bag('gybook'), 'the four relics are still in the bag');
  // ---- the last quest ----
  T = talkTo('gyo_ghost'); ok(qSt('gyq5') === null, 'quest 5 offered: ' + T.node.text.slice(0, 30)); pick(0); ok(qSt('gyq5') === 'active', 'quest 5 accepted'); G.talk = null;
  await go(GY.ID, 36, 48, 2);
  const g1 = G.gold;
  T = talkTo('gyo_grave'); ok(optText().includes('Lay them down'), 'the grave: ' + optText());
  pick(0); ok(/kneel/.test(G.talk.node.text), 'cutscene 1'); pick(0); ok(/Go gently/.test(G.talk.node.text) && G.decor.some(q => q.gyCut && q.k === 'gy_ghost1'), 'cutscene 2, the ghost appears'); pick(0); ok(/ALDITH/.test(G.talk.node.text), 'cutscene 3');
  pick(0); ok(/sword/.test(G.talk.node.text), 'cutscene 4'); pick(0);
  ok(!!F().peace && qSt('gyq5') === 'done', 'peace; quest 5 done'); ok(!bag('gyname') && !bag('gyring') && !bag('gylocket') && !bag('gybook'), 'the four things are left on the grave');
  ok(bag('gylantern') && bag('gysword') && bag('gyring2') && bag('gyrose'), 'rewards in the bag: lantern, sword, ring, rose'); ok(G.gold - g1 >= 24000, 'final gold ' + (G.gold - g1));
  ok(G.decor.some(q => q.k === 'gy_nameplate') && !G.decor.some(q => q.gyCut && !q.found), 'the stone carries a name, the ghost has faded'); G.talk = null;
  // ---- the crypt and the town afterwards ----
  await go(531, 12, 17, 0); ok(G.decor.find(d => d.npc === 'gyo_ghost').found === true, 'the ghost is gone from the crypt'); ok(G.decor.some(d => d.gyShrine), 'the crypt is a lit shrine');
  await go(WL.ID, 12, 31, 3); for (let i = 0; i < 60 && !window.__mlog.some(t => /one stroke of the old cracked bell/.test(t)); i++) await wait(300); ok(!!F().bellRung, 'the bell rang in Wenlock'); ok(window.__mlog.some(t => /one stroke of the old cracked bell/.test(t)), 'bell message');
  const mayor = G.decor.find(d => d.npc === 'wlo_mayor'); if (mayor) { startTalk(mayor); ok(/bell/.test(G.talk.node.text), 'the mayor has new words: ' + G.talk.node.text.slice(0, 50)); G.talk = null }
  // ---- the lane, both ways ----
  const L496 = LEVELS[WL.ID]; const gateRow = L496.rows[31][2]; ok(gateRow !== '.', 'the gate tile stands in the west wall'); const gid = L496.chars[gateRow]; ok(KH_DOOR[gid] && KH_DOOR[gid].lvl === GY.ID, 'the lane gate leads to the graveyard');
  khBump(2, 31, gid); await wait(1800); ok(LEVEL === GY.ID, 'through the gate to the graveyard'); const L530 = LEVELS[GY.ID]; const g2 = L530.chars[L530.rows[35][68]]; khBump(68, 35, g2); await wait(1800); ok(LEVEL === WL.ID && Math.abs(G.P.x - 4) <= 1 && G.P.y === 31, 'back out to Churchyard Lane at ' + G.P.x + ',' + G.P.y);
  log.push('rewards per quest: ' + rew.join(', ') + '; level ' + lvl0 + ' -> ' + G.heroes[0].lvl);
  return log }
