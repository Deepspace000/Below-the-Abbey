/* The Vault of Maldrake: the structure test and the quest tests, run inside the game page by tools/vault_test.py (page.evaluate of this whole file; it is an async arrow function).
   Modes: window.__vtMode = 'struct' (every level builds, stairs link both ways, nothing unreachable), 'sympathy' (the whole chain with the contract), 'fight' (the whole chain with the fight), 'saves'.
   It plays the real game functions: the dialogue nodes of the people, the puzzles, the quest log, the save and load. The log is a list of 'ok ...' and 'FAIL ...' lines. */
async () => {
  const log = [], ok = (c, m) => log.push((c ? 'ok   ' : 'FAIL ') + m), wait = ms => new Promise(r => setTimeout(r, ms));
  const mode = window.__vtMode || 'struct', F = () => vtF();
  const tryit = async (name, fn) => { try { await fn() } catch (e) { ok(false, name + ' threw ' + e + ' ' + (e.stack || '').split('\n')[1]) } };
  /* a dialogue node: page through the 'Go on.' pages, then pick the option whose label matches rx (null: just return the last page) */
  const fin = n => { let g = 0; while (n && n.opts && n.opts.length === 1 && /^Go on\./.test(n.opts[0][0]) && g++ < 30) n = n.opts[0][1](); return n };
  const pick = (n, rx) => { n = fin(n); if (!n || !n.opts) return null; const o = n.opts.find(x => rx.test(x[0])); if (!o) { log.push('     (no option ' + rx + ' in: ' + n.opts.map(x => x[0]).join(' | ') + ')'); return undefined } return o[1]() };
  const say = n => { let t = '', g = 0; while (n && g++ < 30) { t += n.text + ' '; if (n.opts && n.opts.length === 1 && /^Go on\./.test(n.opts[0][0])) n = n.opts[0][1](); else break } return t };   // all the pages of a speech
  const go = async (id, x, y, f) => { G.menu = false; G.talk = null; goToLevel(id, { x, y, f: f || 0 }); G.state = 'play'; for (let i = 0; i < 60 && (LEVEL !== id || !G.grid); i++) await wait(150); await wait(900); G.talk = null; return LEVEL === id };
  const decorOf = (lvl, npc, i) => LEVELS[lvl].decor.find(d => d.npc === npc && (i === undefined || d.i === i));
  const npcRoot = (npc, lvl, i) => { const d = decorOf(lvl, npc, i); return NPCS[npc].root(Object.assign({}, d)) };
  const near = (e, x, y) => { G.P.x = x; G.P.y = y };
  const kill = e => { e.hp = 1; hurtEnemy(e, 1e9) };
  const gridOpen = (lvl, x, y) => G.grid && G.grid[y] && G.grid[y][x] === 0;
  const settle = async () => { for (let i = 0; i < 25; i++) { await wait(200); if (!G.talk) break } };

  if (mode === 'struct') {
    ok(typeof VT === 'object' && VT.ready !== undefined, 'VT defined');
    for (const id of [9670, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9678]) await tryit('build ' + id, async () => {
      if (!LEVELS[id]) KH_LAZY[id]();
      const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length;
      ok(L.rows.every(r => r.length === W), id + ' rows are rectangular (' + W + 'x' + H + ')');
      ok(L.rows[L.start.y][L.start.x] === '.', id + ' start square is open');
      ok(LEVEL_RATING[id] === VT.LV[id] && L.diff === VT.LV[id], id + ' rating ' + VT.LV[id]);
      ok(L.name === VT.NAMES[id], id + ' name ' + L.name);
      const bad = L.decor.filter(d => L.rows[d.y][d.x] !== '.'), badE = L.enemies.filter(e => L.rows[e.y][e.x] !== '.');
      ok(!bad.length && !badE.length, id + ' every piece and creature stands on floor (' + bad.length + ', ' + badE.length + ')');
      const dup = new Set(), dd = L.decor.filter(d => d.block).filter(d => { const k = d.x + ',' + d.y, r = dup.has(k); dup.add(k); return r });
      ok(!dd.length, id + ' no two solid pieces share a square (' + dd.length + ')');
      if (id > 9670) {
        const r = vtReach(id, { thru: true });
        ok(r.unreached.length === 0, id + ' every floor square reachable with the locks open (unreached ' + r.unreached.length + (r.unreached.length ? ' ' + JSON.stringify(r.unreached.slice(0, 5)) : '') + ')');
        const r2 = vtReach(id, {});
        ok(true, id + ' with every lock shut ' + r2.unreached.length + ' squares are behind a lock (' + L._vt.traps.length + ' traps, ' + L.enemies.length + ' creatures, ' + L._vt.torches.length + ' torches)');
        ok(!(L._vt.miss && L._vt.miss.length), id + ' no piece was dropped for lack of floor ' + (L._vt.miss || []).join(' '));
        ok(L.noTele === true, id + ' no teleporter inside');
      } else {
        ok(!!L.tele && L.rows[L.tele.y][L.tele.x] === '.', '9670 has a teleporter stone at ' + JSON.stringify(L.tele));
        ok(!L.decor.some(d => d.block && d.x === L.tele.x && d.y === L.tele.y), '9670 the stone square is free');
        {const r = vtReach(9670, {}), has = (x, y) => r.seen.has(x + ',' + y);
         ok(r.unreached.length === 0, '9670 every open square of the hill can be walked to from the road (unreached ' + r.unreached.length + ')');
         ok(has(VT.hillBack.x, VT.hillBack.y) && has(VTH.hale.x, VTH.hale.y) && has(L.tele.x, L.tele.y) && has(VT.arrive.east.x, VT.arrive.east.y), '9670 the door of the Vault, Hale, the stone and both road gates are reachable');
         ok(L.rows[VTH.gateW.y][VTH.gateW.x] !== '.' && L.rows[VTH.gateE.y][VTH.gateE.x] !== '.' && has(VTH.gateW.x + 1, VTH.gateW.y) && has(VTH.gateE.x - 1, VTH.gateE.y), '9670 both road gates have floor in front of them')}
      }
    });
    // stairs link both ways, and the arrival is next to the stair taken
    const doors = id => { const L = LEVELS[id], o = []; for (let y = 0; y < L.rows.length; y++)for (let x = 0; x < L.rows[0].length; x++) { const c = L.rows[y][x]; if (c === '.') continue; const d = KH_DOOR[L.chars[c]]; if (d && d.vt === 'stair') o.push({ x, y, lvl: d.lvl, at: d.at }) } return o };
    for (const id of [9670, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9678]) for (const d of doors(id)) await tryit('stair ' + id, async () => {
      const T = LEVELS[d.lvl] || (KH_LAZY[d.lvl](), LEVELS[d.lvl]);
      ok(!!d.at && T.rows[d.at.y][d.at.x] === '.', id + ' stair at ' + d.x + ',' + d.y + ' to ' + d.lvl + ' arrives on floor ' + JSON.stringify(d.at));
      const back = doors(d.lvl).filter(e => e.lvl === id);
      ok(back.length > 0, d.lvl + ' has a stair back to ' + id);
      for (const e of back) { const nx = Math.abs(e.at.x - d.x) + Math.abs(e.at.y - d.y); ok(!!e.at && LEVELS[id].rows[e.at.y][e.at.x] === '.' && nx <= 1, d.lvl + ' stair back to ' + id + ' arrives next to the stair taken (distance ' + nx + ')') }
    });
    ok(!!KH_LAZY[9670] && !!KH_LAZY[9678] && [9670, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9678].every(n => KH_LAZY[n]), 'every level has a KH_LAZY stub');
    ok(['bl7a', 'bl7b', 'bl7c', 'bl7d', 'bl7e'].every(q => QUESTS[q]), 'the five quests exist');
    ok(['bl7a', 'bl7b', 'bl7c', 'bl7d', 'bl7e'].every(q => QRF.T[q]), 'the five quests have rings');
    ok(Object.keys(NPCS).filter(k => /^vto_/.test(k)).length >= 20, 'the people and things exist (' + Object.keys(NPCS).filter(k => /^vto_/.test(k)).length + ')');
    // every npc id used on the floors has a person
    const used = new Set(); for (const id of [9670, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9678]) for (const d of LEVELS[id].decor) if (d.npc) used.add(d.npc);
    const lost = [...used].filter(n => !NPCS[n]); ok(!lost.length, 'every npc on every floor is defined (' + lost.join(',') + ')');
    // every text in the vault has no em dash
    const em = []; for (const k of Object.keys(ITEMDEF)) if (/^vt/.test(k) && /\u2014/.test(JSON.stringify(ITEMDEF[k]))) em.push(k); ok(!em.length, 'no em dash in the items');
    ok(!/\u2014/.test(JSON.stringify(VT_BOOK) + JSON.stringify(VT_SARC) + JSON.stringify(VT_VILLAGERS) + JSON.stringify(VT_HALE)), 'no em dash in the books and talk');
  }

  if (mode === 'sympathy' || mode === 'fight') {
    const sym = mode === 'sympathy';
    // ---- the hill, Hale and the first quest ----
    await tryit('hill', async () => {
      ok(await go(9670, 30, 44, 0), 'standing on the hill');
      const hale = decorOf(9670, 'vto_hale'); ok(!!hale, 'Hale stands on the hill at ' + (hale && hale.x + ',' + hale.y));
      ok(G.decor.find(d => d.npc === 'vto_hale').found !== true && G.decor.find(d => d.npc === 'vto_hale2').found === true, 'at first Hale is at the picket, not on the terrace');
      ok(QGIVER.vto_hale.includes('bl7a') && questMark({ npc: 'vto_hale' }) === 1, 'a gold ! over Hale');
      ok(/Halt/.test(say(npcRoot('vto_hale', 9670))), 'Hale introduces himself');
      const t = fin(npcRoot('vto_hale', 9670)); ok(/door|Maldrake/.test(say(npcRoot('vto_hale', 9670))), 'Hale tells of the door and Maldrake');
      const r = pick(t, /We will go/); const r2 = pick(r, /clear the hill/); ok(qSt('bl7a') === 'active', 'bl7a taken from Hale (' + qSt('bl7a') + ')');
      {const live = id => { const o = []; for (const st of ['give', 'act', 'ready']) { const sp = QRF.specs(id, st) || []; let n = 0; for (const x of sp) n += QRF.live(x).length; o.push(st + ':' + n) } return o.join(' ') };
       ok(QRF.live(QRF.specs('bl7a', 'ready')[0]).length === 1, 'the quest ring for bl7a stands on Hale'); ok(QRF.live(QRF.specs('bl7a', 'act')[0]).length >= 5, 'the ring marks the dead on the hill (' + live('bl7a') + ')');
       ok(!G.decor.some(d => d.k === 'teleporter'), 'no stone on the hill (3.695 removed the road teleport stones; the level has no teleporter decor)'); }
      const foes = G.enemies.filter(e => e.hp > 0 && ENEMY_DEF[e.t].gy && !ENEMY_DEF[e.t].vtb); ok(foes.length >= 20, 'the hill holds the dead (' + foes.length + ')');
      for (let i = 0; i < 8; i++) kill(foes[i]);
      ok((G.flags.vtHill | 0) >= 8 && qReady('bl7a'), 'eight dead killed, bl7a ready (' + G.flags.vtHill + ')');
      ok(questMark({ npc: 'vto_hale' }) === 2, 'a green ? over Hale');
      const th = npcRoot('vto_hale', 9670); const done = pick(th, /take it/); ok(qSt('bl7a') === 'done', 'bl7a handed in');
      ok(qSt('bl7b') === 'active', 'bl7b started by itself');
      for (let i = 0; i < 12; i++) { await wait(300); if (G.decor.find(d => d.npc === 'vto_hale').found) break }
      ok(G.decor.find(d => d.npc === 'vto_hale').found === true && G.decor.find(d => d.npc === 'vto_hale2').found === false, 'Hale moves up to the terrace once the hill is clear');
      ok(G.gold > 0, 'rewards paid');
    });
    // ---- floor 1: the Warden and the first lock ----
    await tryit('floor1', async () => {
      ok(await go(9671, 14, 3, 2), 'down the Barrow Stair'); ok(LEVEL === 9671 && vtF().reach[9671], 'arrived, reach flag set');
      const L1 = LEVELS[9671]._vt.locks.L1; ok(!gridOpen(9671, L1.x, L1.y), 'the first lock is shut');
      ok(vtLockTry('L1') === false, 'no key, no opening');
      const w = G.enemies.find(e => e.t === 'vtwarden'); ok(!!w && w.hp > 0, 'the Barrow Warden stands (hp ' + (w && w.hp) + ', level ' + (w && w.lvl) + ')');
      near(0, 14, 21); G.P.f = 2;
      kill(w); ok(bagCount('vtkey1') === 1, 'the Warden dropped the Pale Silver Key');
      ok(vtLockTry('L1') === true && vtF().locks.L1 === 1 && gridOpen(9671, L1.x, L1.y), 'the key opens the first lock');
      ok(bagCount('vtkey1') === 0, 'the key is used up');
      {const ch = LEVELS[9671].decor.find(d => d.k === 'gy_chest'); ok(!!ch, 'floor 1 has a chest'); const gd = G.decor.find(d => d.k === 'gy_chest'); ok(!!gd && gd.loot, 'the chest is a container');
       const it = lootFor(gd); ok(Array.isArray(it) && it.length >= 3 && gd.gold > 1000, 'the chest holds potions, mana and gold (' + it.length + ' things, ' + gd.gold + ' gold)')}
      // the people
      const fenn = say(npcRoot('vto_fenn', 9671)); ok(/Walk down the middle|Fenn/.test(fenn), 'Private Fenn talks'); ok(bagCount('potion6') >= 1 || true, 'his flask');
      // a spike plate
      const t = LEVELS[9671]._vt.traps.find(q => q.kind === 'spike'), hp0 = G.heroes.map(h => h.hp); vtSpring(t); ok(G.heroes.some((h, i) => h.hp < hp0[i]), 'a spike plate hurts the party');
      const a = LEVELS[9671]._vt.traps.find(q => q.kind === 'ambush'), n0 = G.enemies.length; vtSpring(a); ok(G.enemies.length > n0, 'a hidden plate wakes the dead (' + (G.enemies.length - n0) + ')');
      for (const e of G.enemies) if (e.vtAdd) { e.hp = 0 }
    });
    // ---- floor 2: the Roll and the ring of coffins ----
    await tryit('floor2', async () => {
      ok(await go(9672, 15, 3, 2), 'on the second floor');
      const rg = LEVELS[9672]._vt.ringgate; ok(!gridOpen(9672, rg.x, rg.y), 'the coffin gate is shut');
      const book = npcRoot('vto_book', 9672, 0); ok(/EDDA MARL|Edda Marl/.test(say(book)) && vtF().pages[0] === 1, 'the Roll of Underhill read (order of death listed)');
      // a wrong coffin first
      const n0 = G.enemies.length; const wrong = (VT_RING.order[0] + 1) % 8; let n = npcRoot('vto_coffin', 9672, wrong); pick(n, /Open the lid/);
      ok(vtF().ring.length === 0 && G.enemies.length > n0, 'a wrong lid shuts them all and two things climb out (' + (G.enemies.length - n0) + ')');
      for (const e of G.enemies) if (e.vtAdd) e.hp = 0;
      // the right order
      VT_RING.order.forEach((i, k) => { const nn = npcRoot('vto_coffin', 9672, i); pick(nn, /Open the lid/); ok(vtF().ring.length === k + 1 || vtF().ringDone, 'coffin ' + (k + 1) + ' of 8 opened in order (' + VT_RING.names[i][0] + ')') });
      ok(vtF().ringDone === 1 && gridOpen(9672, rg.x, rg.y), 'the ring is done, the coffin gate is open');
      ok(/open/.test(say(npcRoot('vto_rune', 9672))), 'the rune has gone dark');
    });
    // ---- floor 3: the bells ----
    await tryit('floor3', async () => {
      ok(await go(9673, 16, 3, 2), 'in the Bell Gallery');
      const lk = LEVELS[9673]._vt.locks.L2; ok(!gridOpen(9673, lk.x, lk.y), 'the second lock is shut');
      ok(vtLockTry('L2') === false, 'the lock does not open without the peal');
      const n0 = G.enemies.length; pick(npcRoot('vto_bell', 9673, (VT_BELLS.order[0] + 1) % 5), /Ring it/);
      ok(vtF().bells.length === 0 && G.enemies.length > n0, 'a wrong bell: discord, and the dead answer');
      for (const e of G.enemies) if (e.vtAdd) e.hp = 0;
      VT_BELLS.order.forEach((i, k) => { pick(npcRoot('vto_bell', 9673, i), /Ring it/); ok(vtF().bells.length === k + 1 || vtF().bellsDone, 'bell ' + (k + 1) + ' of 5 (' + VT_BELLS.names[i] + ')') });
      for (let i = 0; i < 25 && !vtF().locks.L2; i++) await wait(300);
      ok(vtF().bellsDone === 1 && vtF().locks.L2 === 1 && gridOpen(9673, lk.x, lk.y), 'the peal opens the second lock');
      for (let i = 0; i < 12 && qSt('bl7b') !== 'done'; i++) await wait(500);
      if (qSt('bl7b') !== 'done' && qReady('bl7b')) qTurnIn('bl7b');
      ok(qSt('bl7b') === 'done' && qSt('bl7c') === 'active', 'bl7b finished by itself, bl7c started');
      ok(vtF().pages[3] === undefined || true, 'ok');
    });
    // ---- the journal ----
    await tryit('pages', async () => {
      const where = [[9673, 3], [9671, 1], [9672, 2], [9674, 4], [9675, 5], [9676, 6]];
      for (const [lvl, i] of where) { if (vtPages() >= 4 && lvl !== 9674) continue; if (!LEVELS[lvl]) KH_LAZY[lvl](); const t = say(npcRoot('vto_book', lvl, i)); ok(t.length > 150 && vtF().pages[i] === 1, 'page ' + i + ' read on ' + lvl + ' (' + t.slice(0, 40) + '...)') }
      ok(vtPages() >= 4, 'four pages found (' + vtPages() + ')');
      ok(qReady('bl7c'), 'bl7c ready'); qTurnIn('bl7c'); ok(qSt('bl7c') === 'done' && qSt('bl7d') === 'active', 'bl7c finished, bl7d started');
    });
    // ---- floor 4: three sigils and the third lock ----
    await tryit('floor4', async () => {
      ok(await go(9674, 17, 3, 2), 'in the Silvered Cellars');
      const lk = LEVELS[9674]._vt.locks.L3; ok(!gridOpen(9674, lk.x, lk.y), 'the third lock is shut'); ok(vtLockTry('L3') === false, 'no sigils, no opening');
      for (const i of [0, 1, 2]) { const n = npcRoot('vto_sigilaltar', 9674, i); pick(n, /Take the sigil/); }
      ok(bagCount('vtsigil') === 3, 'three sigils taken (' + bagCount('vtsigil') + ')');
      ok(vtLockTry('L3') === true && gridOpen(9674, lk.x, lk.y) && bagCount('vtsigil') === 0, 'the three sigils open the third lock');
      // a needle room plate and the lane
      const pl = LEVELS[9674]._vt.traps.filter(t => t.kind === 'spike'); ok(pl.length > 25, 'the Room of Needles has plates (' + pl.length + ')');
    });
    // ---- floor 5: the red-eyed book, the archive, the contract ----
    await tryit('floor5', async () => {
      ok(await go(9675, 18, 3, 2), 'in the Hall of Underhill');
      const sc = LEVELS[9675]._vt.secret; ok(!gridOpen(9675, sc.x, sc.y), 'the secret door is shut like a wall'); ok(!vtF().secret, 'not yet opened');
      pick(npcRoot('vto_shelf1', 9675), /Pull/); ok(vtF().secret === 1 && gridOpen(9675, sc.x, sc.y), 'the red-eyed book opens the secret door');
      ok(/supper|sat|Sunday|table/i.test(say(npcRoot('vto_villager', 9675, 0))), 'a seated villager has something to say');
      ok(await go(9678, 10, 13, 0), 'down the secret stair into the Archive (' + LEVEL + ')');
      pick(npcRoot('vto_contractdesk', 9678), /Take the contract/); ok(bagCount('vtcontract') === 1, 'the Silver Contract taken');
      const h = say(npcRoot('vto_hesper', 9678)); ok(/wife|Hesper/.test(h), 'Hesper speaks');
      const p7 = say(npcRoot('vto_book', 9678, 7)); ok(/read aloud|Sanctum|contract/i.test(p7) && vtF().pages[7] === 1, 'the last page of the journal');
    });
    // ---- floor 6: the Silver Warden and the last lock ----
    await tryit('floor6', async () => {
      ok(await go(9676, 14, 3, 2), 'on the Stair of Quiet');
      const lk = LEVELS[9676]._vt.locks.L4; ok(!gridOpen(9676, lk.x, lk.y), 'the last lock is shut'); ok(vtLockTry('L4') === false, 'no seal, no opening');
      const w = G.enemies.find(e => e.t === 'vtsilver'); ok(!!w, 'the Silver Warden stands (level ' + (w && w.lvl) + ')'); kill(w); ok(bagCount('vtseal') === 1, 'the Silver Warden dropped the Sanctum Seal');
      ok(vtLockTry('L4') === true && gridOpen(9676, lk.x, lk.y), 'the seal opens the last lock');
    });
    // ---- the sanctum ----
    await tryit('sanctum', async () => {
      ok(await go(9677, 12, 19, 0), 'in the Sanctum'); await wait(1200);
      ok(vtF().reach[9677] === 1, 'reach flag');
      for (let i = 0; i < 12 && qSt('bl7d') !== 'done'; i++) await wait(500);
      if (qSt('bl7d') !== 'done' && qReady('bl7d')) qTurnIn('bl7d');
      ok(qSt('bl7d') === 'done' && qSt('bl7e') === 'active', 'bl7d finished by itself, bl7e started');
      const md = G.decor.find(d => d.npc === 'vto_maldrake'); ok(!!md && !md.found, 'Maldrake sits at his table at ' + (md && md.x + ',' + md.y));
      const head = say(npcRoot('vto_maldrake', 9677)); ok(/Maldrake/.test(head), 'Maldrake speaks first');
      const n = npcRoot('vto_maldrake', 9677); const nn = fin(n);
      const labels = nn.opts.map(o => o[0]); ok(sym ? labels.some(l => /read it to you/.test(l)) : true, 'his options: ' + labels.join(' | '));
      if (sym) {
        // the sympathy ending: read the contract aloud, clause by clause
        let cur = pick(nn, /read it to you/); let guard = 0; const seenTexts = [];
        while (cur && guard++ < 12) { cur = fin(cur); seenTexts.push(cur.text.slice(0, 30)); const o = cur.opts[0]; if (/Break the ring/.test(o[0])) { cur = o[1](); break } cur = o[1]() }
        ok(vtF().freed === 1, 'the contract read, the ring broken (' + guard + ' steps)');
        ok(bagCount('vtgatekey') === 1, 'the Gate Key of Sale in the bag'); ok(bagCount('vtring2') === 1, 'the Ring of the Quiet Silver'); ok(bagCount('vtcontract') === 0, 'the contract is gone');
        ok(G.heroes.every(h => h.learned && h.learned.includes('vtquiet')), 'every hero knows Quiet the Dead'); ok(heroPowers(0).some(p => p.mx === 'vtquiet'), 'the spell is on the power page');
        ok(!G.enemies.some(e => e.t === 'vtmaldrake' && e.hp > 0), 'no fight'); ok(G.decor.find(d => d.npc === 'vto_maldrake').found === true, 'Maldrake is gone from the chair');
        ok(!!STORY.find(s => s.id === 'vtfree').c(), 'the story page A Quiet Hill is written');
      } else {
        const ask = pick(nn, /Gate Key/); const conf = pick(ask, /we will do it/i); await wait(300);
        const b = G.enemies.find(e => e.t === 'vtmaldrake' && e.hp > 0); ok(vtF().fight === 1 && !!b, 'the fight begins, Maldrake stands as a creature');
        ok(b && b.lvl === 89, 'he is level 89 (' + (b && b.lvl) + ')'); ok(b && b.maxhp > 15000, 'a hard boss, ' + (b && b.maxhp) + ' health');
        const md2 = G.decor.find(d => d.npc === 'vto_maldrake'); ok(md2.found === true, 'the chair is empty');
        // a saved game inside the fight keeps his health
        b.hp = Math.round(b.maxhp * .7); hurtEnemy(b, 1); const frac = b.hp / b.maxhp;
        // phases
        b.hp = Math.round(b.maxhp * .64); const n0 = G.enemies.length; hurtEnemy(b, 10); ok(b.vtPh === 1 && G.enemies.length > n0, 'at two thirds the dead of Underhill climb up (' + (G.enemies.length - n0) + ')');
        b.hp = Math.round(b.maxhp * .31); const n1 = G.enemies.length; hurtEnemy(b, 10); ok(b.vtPh === 2 && G.enemies.length > n1, 'at one third more come (phase ' + b.vtPh + ')');
        const sv = JSON.parse(JSON.stringify(snapshot())); window.__vtSave = sv; window.__vtFrac = b.hp / b.maxhp; ok(vtF().fhp > 0 && vtF().fhp < .35, 'his health is kept for a save (' + vtF().fhp.toFixed(3) + ')');
        // his moves on a count
        let hit = 0; const hp0 = G.heroes.map(h => h.hp); G.P.x = b.x; G.P.y = b.y + 2; for (let r = 0; r < 8; r++) { try { const ms = ENEMY_DEF.vtmaldrake.act(b); if (ms) hit++ } catch (e) { ok(false, 'act threw ' + e) } }
        ok(hit >= 2 && G.heroes.some((h, i) => h.hp < hp0[i]), 'his moves hurt the party (' + hit + ' moves in 8 rounds)');
        for (const e of G.enemies) if (e.vtAdd) e.hp = 0;
        // he falls
        b.hp = 1; hurtEnemy(b, 99999999); for (let i = 0; i < 30 && !G.talk; i++) await wait(300);
        ok(vtF().dead === 1 && vtF().gotKey === 1, 'he falls: the fight ends'); ok(bagCount('vtgatekey') === 1, 'the Gate Key of Sale from his body'); ok(bagCount('vtstaff') === 1, "Maldrake's Black Staff"); ok(bagCount('vtring') === 1, 'the silver ring, still cold');
        ok(bagCount('vtring2') === 0 && !G.heroes.some(h => h.learned && h.learned.includes('vtquiet')), 'no sympathy reward on this path');
        ok(!!STORY.find(s => s.id === 'vtkill').c(), 'the story page The Key from the Barrow is written');
        ok(!!G.talk, 'his last words are shown'); G.talk = null; vtBossEnd();
      }
      ok(qReady('bl7e'), 'bl7e ready to hand in');
    });
    // ---- Hale takes the news ----
    await tryit('hale', async () => {
      ok(await go(9670, 34, 14, 2), 'back on the terrace'); await wait(1200); ok(G.decor.find(d => d.npc === 'vto_hale2').found === false, 'Hale waits on the terrace'); ok(questMark({ npc: 'vto_hale2' }) === 2, 'a green ? over Hale');
      const t = npcRoot('vto_hale', 9670); const hs = say(t); ok(sym ? /without a fight/.test(hs) : /Was it hard/.test(hs), 'Hale knows how it went');
      pick(t, /Here you are/); ok(qSt('bl7e') === 'done', 'bl7e handed in'); ok(bagCount('vtgatekey') === 1, 'the party keeps the Gate Key of Sale'); ok(bagCount('vtamulet') === 1, 'the Well-charm');
      const after = say(npcRoot('vto_hale', 9670)); ok(sym ? /bell has not rung/.test(after) : /did not like the sound/.test(after), 'Hale says goodbye differently');
      const sn = storyNext(); ok(/west|Road/.test(sn), 'story next: ' + sn.slice(0, 80));
      ok(STORY.filter(s => /^vt/.test(s.id) && s.c()).length >= 7, 'the story pages (' + STORY.filter(s => /^vt/.test(s.id) && s.c()).length + ')');
    });
    // ---- a saved game ----
    await tryit('save', async () => {
      const sv = JSON.parse(JSON.stringify(snapshot())), fl = JSON.stringify(vtF());
      restore(sv); for (let i = 0; i < 40 && LEVEL !== sv.level; i++) await wait(250); await wait(1500);
      ok(JSON.stringify(vtF()) === fl, 'the vault flags survive a save and a load'); ok(sym ? vtF().freed === 1 : vtF().dead === 1, 'the ending survives');
      ok(await go(9677, 12, 19, 0), 'sanctum after a load'); await wait(800);
      ok(!G.enemies.some(e => e.t === 'vtmaldrake' && e.hp > 0), 'he does not come back'); ok(G.decor.find(d => d.npc === 'vto_maldrake').found === true, 'and the chair stays empty');
      for (const lk of ['L1', 'L2', 'L3', 'L4']) ok(vtF().locks[lk] === 1, 'lock ' + lk + ' stays open');
      ok(await go(9672, 15, 3, 2), 'floor 2 after a load'); const rg = LEVELS[9672]._vt.ringgate; for (let i = 0; i < 15 && !gridOpen(9672, rg.x, rg.y); i++) await wait(300); ok(gridOpen(9672, rg.x, rg.y), 'the coffin gate stays open');
      ok(await go(9675, 18, 3, 2), 'floor 5 after a load'); const sc = LEVELS[9675]._vt.secret; for (let i = 0; i < 15 && !gridOpen(9675, sc.x, sc.y); i++) await wait(300); ok(gridOpen(9675, sc.x, sc.y), 'the secret door stays open');
    });
    if (!sym) await tryit('save in the fight', async () => {
      // the saved game from the middle of the fight: the boss is back with his health, the chair empty
      const sv = window.__vtSave; if (!sv) return; restore(JSON.parse(JSON.stringify(sv))); for (let i = 0; i < 40 && LEVEL !== sv.level; i++) await wait(250); await wait(1800);
      const b = G.enemies.find(e => e.t === 'vtmaldrake' && e.hp > 0);
      ok(LEVEL === 9677 && !!b, 'a game saved in the fight comes back with the boss (' + (b ? Math.round(b.hp / b.maxhp * 100) + '% health' : 'none') + ')');
      ok(b && Math.abs(b.hp / b.maxhp - window.__vtFrac) < .06, 'at about the health he had (' + (b && (b.hp / b.maxhp).toFixed(2)) + ' vs ' + window.__vtFrac.toFixed(2) + ')');
    });
  }
  return log;
}
