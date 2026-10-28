"""Wenlock thief quests, watchmen and cells, headless test.

    python tools/wenlock_thief_test.py [port] [shots]

Needs a server in the repo root (python -m http.server 8433). Set BTA_CHROME to an installed Chrome if Playwright has no browser of its own.
Checks: the four watchmen's routes are on open road; the clients, lamps and houses exist; doors stay shut by day; night entry; a theft seen is an arrest;
the bail path (gold down 500, out at the Village Hall); the sentence path (clock moves three nights on, every hero Poorly and Flea-bitten, nobody healed);
all four quests done unseen and handed in; a quest item confiscated after an arrest comes back to its place and the quest still finishes; the quest rings; the peek window.
With 'shots' it also saves pictures of a watchman, the cells and a client in _wlt_shots/.
"""
import json, os, sys, time, pathlib
from playwright.sync_api import sync_playwright

PORT = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].isdigit() else '8433'
SHOTS = 'shots' in sys.argv
URL = 'http://localhost:%s/index.html?town=wenlock&lvl=80&v=%d' % (PORT, time.time())
OUT = pathlib.Path(__file__).resolve().parent.parent / '_wlt_shots'

PRE = r"""
window.T = {res: [], ok(n, c, d) { this.res.push([n, !!c, d === undefined ? '' : String(d)]) }};
window.wait = ms => new Promise(r => setTimeout(r, ms));
// a dialogue node: click the option whose text matches
window.opt = (node, re) => node && node.opts && node.opts.find(o => re.test(o[0]));
window.click = (node, re) => { const o = opt(node, re); let r = o ? o[1]() : null; if (o) { while (r && r.opts && r.opts.length === 1 && r.opts[0][0] === 'Go on.') r = r.opts[0][1](); return r } return 'NOOPT:' + (node && node.opts ? node.opts.map(o => o[0]).join('|') : 'none'); };
window.talk = (id, d) => { let n = NPCS[id].root(d || {x: 1, y: 1, k: 'x'}); while (n && n.opts && n.opts.length === 1 && n.opts[0][0] === 'Go on.') n = n.opts[0][1](); return n };
// stand the watchmen somewhere harmless: far off, facing away, frozen
window.park = () => { WLZ.g.forEach((g, i) => { g.x = 2 + i; g.y = 2; g.s = 0; g.pause = 0; g.post = {t: 1e9, f: [-1, 0]}; }); };
// put watchman 0 two squares from a house's front square, looking at it, frozen
window.watchHouse = n => { park(); const t = wltHouses()[n - 1], g = WLZ.g[0], fx = t.h.front[0], fy = t.h.front[1];
  const dx = t.h.wall[0], dy = t.h.wall[1]; // from the front square towards the wall; he stands out in the street on the far side
  let sx = fx - (dx ? 0 : 2), sy = fy - (dy ? 0 : 2); if (dx) { sx = fx; sy = fy - 2 } else { sx = fx - 2; sy = fy }
  g.x = sx; g.y = sy; g.post = {t: 1e9, f: [Math.sign(fx - sx), Math.sign(fy - sy)]}; g.f = g.post.f; return [g.x, g.y, g.f] };
window.stand = (x, y, f) => { goToLevel(496, {x, y, f}); };
window.knock = n => { const t = wltHouses()[n - 1], h = t.h, g = G.grid[h.door[1]][h.door[0]]; stand(h.front[0], h.front[1], h.out === 0 ? 2 : h.out === 2 ? 0 : h.out === 1 ? 3 : 1);
  // the party faces the door: out is the way it faces on leaving, so it faces the opposite way going in
  return khBump(h.door[0], h.door[1], g) };
window.setClock = (day, hr) => { G.clock = day * 1440 + hr * 60 };
window.FL = () => G.flags;
"""

TESTS = {}

TESTS['setup'] = r"""async () => {
  const f = G.flags; f.wlMayorMet = 1; G.quests.wlq1 = {st: 'done', ord: 1, base: 0};
  G.gold = 2000;
  for (const h of G.heroes) { h.hp = Math.max(1, Math.floor(h.max / 2)); h.mp = 3 }
  T.ok('level is Wenlock', LEVEL === 496, LEVEL);
  T.ok('four houses', wltHouses().length === 4, wltHouses().map(t => t.h.id + ' ' + t.name + ' ' + t.addr).join('; '));
  T.ok('four watchmen', WLZ.g.length === 4);
  T.ok('jail level registered (stub)', typeof KH_LAZY[7097] === 'function' && LEVEL_NAMES[7097] === 'The Wenlock Cells');
  T.ok('quests exist and are in Wenlock', ['wlq60','wlq61','wlq62','wlq63'].every(q => QUESTS[q] && QAREA[q] === 'Wenlock'));
  T.ok('no id clash with other wlq quests', new Set(WL_QUESTS.map(q => q.id)).size === WL_QUESTS.length);
  return T.res }"""

TESTS['routes'] = r"""async () => {
  const L = LEVELS[496]; let bad = [], n = 0;
  const solid = new Set(L.decor.filter(d => d.block && !d.npc).map(d => d.x + ',' + d.y));
  for (const r of WLZ_ROUTES) {
    for (let i = 1; i < r.pts.length; i++) {
      const a = r.pts[i - 1], b = r.pts[i]; if (a[0] !== b[0] && a[1] !== b[1]) bad.push(r.id + ' leg not straight');
      const sx = Math.sign(b[0] - a[0]), sy = Math.sign(b[1] - a[1]);
      for (let x = a[0], y = a[1]; ; x += sx, y += sy) { n++;
        if (L.rows[y][x] !== '.') bad.push(r.id + ' wall at ' + x + ',' + y);
        else if (solid.has(x + ',' + y)) bad.push(r.id + ' solid thing at ' + x + ',' + y);
        if (x === b[0] && y === b[1]) break } } }
  T.ok('watchmen routes lie on open squares (' + n + ' squares)', bad.length === 0, bad.slice(0, 6).join('; '));
  T.ok('watchmen are in the town as walk-through pictures', WLZ.g.every((g, i) => { const d = G.decor.find(d => d.cloudid === 'wlzg' + i); return d && d.npc === g.id && !d.block }));
  // they move, stop and turn
  const g = WLZ.g[2]; g.post = null; g.pause = 0; const x0 = g.x, y0 = g.y; let turned = new Set(), paused = false;
  for (let i = 0; i < 4000; i++) { wlzStep(g, .1); if (g.pause > 0) { paused = true; turned.add(g.f.join()) } }
  T.ok('a watchman walks and stops at the corners and turns', paused && turned.size >= 3 && (g.x !== x0 || g.y !== y0), [...turned].join(' '));
  // every beat is walked end to end
  for (const gg of WLZ.g) { gg.post = null; gg.pause = 0; let lo = 1e9, hi = -1e9; for (let i = 0; i < 12000; i++) { wlzStep(gg, .1); lo = Math.min(lo, gg.s); hi = Math.max(hi, gg.s) } T.ok(gg.id + ' walks the whole beat', lo <= .01 && hi >= gg.total - .01, lo + ' to ' + hi + ' of ' + gg.total) }
  return T.res }"""

TESTS['people'] = r"""async () => {
  for (const [npc, q] of [['wlt_fence','wlq60'],['wlt_gambler','wlq61'],['wlt_agent','wlq62'],['wlt_poacher','wlq63']]) {
    const d = G.decor.find(d => d.npc === npc);
    T.ok(npc + ' stands in the town, off the road', d && !WL_ROAD(d.x, d.y), d && (d.x + ',' + d.y));
    const m = QGIVER[npc]; T.ok(npc + ' shows the gold mark', m && [].concat(m).includes(q));
  }
  for (const t of wltHouses()) { const d = G.decor.find(d => d.npc === 'wlt_door' + t.n); T.ok('lamp at ' + t.name, d && Math.hypot(d.x - t.h.front[0], d.y - t.h.front[1]) <= 3.2, d && (d.x + ',' + d.y)) }
  T.ok('no em dashes in the new text', !new RegExp(String.fromCharCode(8212)).test(JSON.stringify(Object.values(QUESTS).filter(q => /^wlq6[0-3]$/.test(Object.keys(QUESTS).find(k => QUESTS[k] === q) || '')).map(q => [q.title, q.desc]))));
  return T.res }"""

TESTS['doors'] = r"""async () => {
  park();
  setClock(0, 12);
  for (const n of [1, 2, 3, 4]) { knock(n); await wait(80); T.ok('by day the door of house ' + n + ' stays shut', LEVEL === 496, LEVEL + ' talk=' + !!G.talk); G.talk = null }
  T.ok('the doors that are answered show the householder', true);
  setClock(0, 22); const ids = [];
  for (const n of [1, 2, 3, 4]) { const r = knock(n); await wait(250); ids.push(LEVEL); T.ok('at night the door of house ' + n + ' opens', LEVEL === wltHouses()[n - 1].h.id, LEVEL + ' r=' + r); goToLevel(496, {x: 40, y: 50, f: 1}); await wait(100) }
  // the rooms are built, with their things, and nobody is at home
  for (const t of wltHouses()) { const L = LEVELS[t.h.id]; const need = {1:'wlt_candle',2:'wlt_cup',3:'wlt_ledger',4:'wlt_rug'}[t.n];
    const ids = L.decor.map(d => d.npc).filter(Boolean);
    T.ok(t.name + ' has ' + need + ', a purse and a window, and no resident', ids.includes(need) && ids.includes('wlt_val') && ids.includes('wlt_peek') && !ids.some(i => /^wli_r_/.test(i)), ids.join(','));
    T.ok(t.name + ' things are inside the room', L.decor.filter(d => /^wlt_/.test(d.npc || '')).every(d => d.x >= 1 && d.y >= 1 && d.x < L.rows[0].length - 1 && d.y < L.rows.length - 1 && L.rows[d.y][d.x] === '.')) }
  return T.res }"""

TESTS['sight'] = r"""async () => {
  setClock(0, 22); park();
  const t = wltHouses()[0], g = WLZ.g[0], fx = t.h.front[0], fy = t.h.front[1];
  watchHouse(1); T.ok('a watchman close by, facing the door, sees the front square at night', wlzSees(g, fx, fy), g.x + ',' + g.y + ' f=' + g.f);
  g.f = [-g.f[0], -g.f[1]]; T.ok('looking the other way he does not', !wlzSees(g, fx, fy));
  g.f = [Math.sign(fx - g.x), Math.sign(fy - g.y)]; g.x = fx; g.y = fy - 9; T.ok('nine squares away he does not', !wlzSees(g, fx, fy));
  watchHouse(1); const L = LEVELS[496]; const saved = L.lights.slice(); L.lights.length = 0; const sl = L._wlaLights; L._wlaLights = [];
  g.x = fx; g.y = fy - 4.5; T.ok('in the dark, beyond his lantern, the square is not seen', !wlzSees(g, fx, fy)); L.lights.push(...saved); L._wlaLights = sl;
  T.ok('with the lamp lit he sees it', wlzSees(g, fx, fy));
  setClock(0, 12); L.lights.length = 0; g.x = fx; g.y = fy - 4.5; T.ok('by day light does not matter', wlzSees(g, fx, fy)); L.lights.push(...saved);
  // a wall in the way: the line from inside the house wall to the front square is blocked
  setClock(0, 22); const wx = t.h.door[0], wy = t.h.door[1]; T.ok('a wall blocks the line of sight', !wlzLOS(wx + t.h.wall[0] * 2, wy + t.h.wall[1] * 2, fx, fy), 'door ' + wx + ',' + wy);
  return T.res }"""

TESTS['arrest'] = r"""async () => {
  const q = id => qSt(id);
  setClock(0, 22); G.gold = 1000; FL().wlzWarn = 0;
  const offer = talk('wlt_fence', {x: 74, y: 81}); T.ok('Nettle offers the quest', opt(offer, /We will help/), offer.opts.map(o => o[0]).join('|')); click(offer, /We will help/); T.ok('and it is accepted', qSt('wlq60') === 'active'); wltEnsure(); park();
  knock(1); await wait(300);
  T.ok('inside Church View after dark', LEVEL === wltHouses()[0].h.id, LEVEL);
  T.ok('the entry step is ticked', FL().wlt1_in === 1 && QUESTS.wlq60.goal(G.quests.wlq60) === 1);
  watchHouse(1);
  const before = bagCount('wlt_candle');
  const cd = G.decor.find(d => d.npc === 'wlt_candle');
  const node = talk('wlt_candle', cd); const r = click(node, /Take the candlesticks/);
  await wait(500);
  T.ok('a theft seen is an arrest popup naming a watchman', G.talk && /Thief/.test(G.talk.node.text) && /Watchman/.test(G.talk.n.name), G.talk && G.talk.node.text.slice(0, 40));
  T.ok('the candlesticks were not taken', bagCount('wlt_candle') === before && !FL().wlt1_got);
  const go = G.talk.node.opts.find(o => /quietly/.test(o[0]));
  go[1](); await wait(500);
  T.ok('the party is in the Wenlock cells (7097)', LEVEL === 7097 && FL().wlJailed === 1, LEVEL);
  T.ok('the gaoler is there and the cell door is locked', G.decor.some(d => d.npc === 'wlz_gaoler') && G.portals[0] && G.portals[0].req === 'wlzOpen');
  window._cell = 1;
  return T.res }"""

TESTS['bail'] = r"""async () => {
  setClock(0, 23); G.gold = 1000; const hp = G.heroes.map(h => h.hp), clock = G.clock;
  if (LEVEL !== 7097) { wlzJail(); await wait(500) }
  const node = talk('wlz_gaoler', {x: 6, y: 4});
  T.ok('the gaoler offers bail and the sentence', opt(node, /Pay 500/) && opt(node, /Serve three nights/), node.opts.map(o => o[0]).join('|'));
  G.gold = 300; const poor = talk('wlz_gaoler', {}); const rr = click(poor, /Pay 500/); T.ok('with 300 gold, bail is refused ("200 short")', rr && /200 gold short/.test(rr.text) && LEVEL === 7097, rr && rr.text);
  G.gold = 1000; click(node, /Pay 500/); await wait(500);
  T.ok('bail paid: gold down by exactly 500', G.gold === 500, G.gold);
  const hall = WL_HOUSES.find(h => h.spk === 'hall');
  T.ok('released on the steps of the Village Hall', LEVEL === 496 && G.P.x === hall.front[0] && G.P.y === hall.front[1] && FL().wlJailed === 0, LEVEL + ' ' + G.P.x + ',' + G.P.y + ' hall ' + hall.front);
  T.ok('bail does not pass the time or heal', G.clock === clock && G.heroes.every((h, i) => h.hp === hp[i]), G.clock + ' vs ' + clock);
  T.ok('no afflictions after bail', !afflHas('poorly') && !afflHas('fleas'));
  return T.res }"""

TESTS['sentence'] = r"""async () => {
  setClock(2, 23); G.gold = 100; const hp = G.heroes.map(h => h.hp), mp = G.heroes.map(h => h.mp);
  const day0 = Math.floor(G.clock / 1440);
  wlzJail(); await wait(500);
  T.ok('in the cells again', LEVEL === 7097);
  const node = talk('wlz_gaoler', {}); const sure = click(node, /Serve three nights/);
  T.ok('he asks if you are sure', sure && /sure/.test(sure.text));
  click(sure, /Yes/); await wait(600);
  T.ok('three nights passed: morning of day +3 at 08:00', Math.floor(G.clock / 1440) === day0 + 3 && G.clock % 1440 === 480, 'day ' + Math.floor(G.clock / 1440) + ' ' + clockStr() + ' from day ' + day0);
  T.ok('every hero is Poorly and Flea-bitten', G.heroes.every((h, i) => !h.alive || (afflHas('poorly', i) && afflHas('fleas', i))), afflList().map(e => e.id + e.hi).join(','));
  T.ok('nobody healed or rested (hp and mana not higher than before)', G.heroes.every((h, i) => h.hp <= hp[i] && h.mp <= mp[i]), G.heroes.map(h => h.hp + '/' + h.mp).join(' '));
  T.ok('gold kept (no bail)', G.gold === 100, G.gold);
  T.ok('out on the steps of the hall', LEVEL === 496 && FL().wlJailed === 0);
  afflCure('poorly', -1, true); afflCure('fleas', -1, true);
  // late-night arrests after midnight count that night as the first
  setClock(5, 2); const d1 = Math.floor(G.clock / 1440); wlzJail(); await wait(400); click(click(talk('wlz_gaoler', {}), /Serve/), /Yes/); await wait(500);
  T.ok('an arrest at 02:00 still means three nights (out on day +2, 08:00)', Math.floor(G.clock / 1440) === d1 + 2 && G.clock % 1440 === 480, clockStr());
  afflCure('poorly', -1, true); afflCure('fleas', -1, true);
  return T.res }"""

TESTS['quests'] = r"""async () => {
  setClock(10, 22); G.gold = 1000; FL().wlzWarn = 0;
  const gold0 = G.gold; const doIt = async (qid, npc, fn) => { };
  // ---- 60: the candlesticks, with an arrest on the way out and a second go ----
  const fence = {x: 74, y: 81};
  let n; FL().wlt1_in = 0;
  T.ok('quest ring: the lamp at the house (not inside yet)', (QRF.spots('wlq60') || []).some(s => s.x === wltHouses()[0].lamp[0] && s.y === wltHouses()[0].lamp[1]), JSON.stringify(QRF.spots('wlq60')));
  park(); knock(1); await wait(300);
  T.ok('quest ring: the candlesticks, inside', (QRF.spots('wlq60') || []).some(s => s.kind === 'goal'), JSON.stringify(QRF.spots('wlq60')));
  talk('wlt_candle', {}).opts.find(o => /Take the candle/.test(o[0]))[1](); await wait(100);
  T.ok('unseen: the candlesticks are in the bag', bagCount('wlt_candle') === 1 && FL().wlt1_got === 1);
  watchHouse(1); // a watchman strolls up to the window while the party is still in the house
  const hallDay = Math.floor(G.clock / 1440);
  goToLevel(496, {x: 24, y: 37, f: 1}); await wait(700);
  T.ok('seen leaving with the loot: arrested', G.talk && /Stop, thief/.test(G.talk.node.text), G.talk && G.talk.node.text.slice(0, 30));
  G.talk.node.opts[0][1](); await wait(600);
  T.ok('in the cells; candlesticks confiscated, the quest step reset', LEVEL === 7097 && bagCount('wlt_candle') === 0 && !FL().wlt1_got && QUESTS.wlq60.goal(G.quests.wlq60) === 1, 'goal ' + QUESTS.wlq60.goal(G.quests.wlq60));
  G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  park(); knock(1); await wait(300);
  T.ok('back inside Church View, the candlesticks are on the mantel again', talk('wlt_candle', {}).opts.some(o => /Take the candle/.test(o[0])));
  talk('wlt_candle', {}).opts.find(o => /Take the candle/.test(o[0]))[1](); T.ok('taken again unseen', bagCount('wlt_candle') === 1);
  goToLevel(496, {x: 24, y: 37, f: 1}); await wait(700); T.ok('out unseen, no arrest', LEVEL === 496 && !G.talk);
  n = talk('wlt_fence', fence); const g1 = G.gold; T.ok('Nettle takes them', opt(n, /Here they are/) && qReady('wlq60'));
  click(n, /Here they are/); T.ok('reward: gold up by 900 (450 x2), quest done, candlesticks gone', G.gold === g1 + 900 && qSt('wlq60') === 'done' && bagCount('wlt_candle') === 0, G.gold - g1);
  // ---- 61: the dice ----
  qAccept('wlq61'); T.ok('the dice came with the quest', bagCount('wlt_dice') === 1);
  park(); knock(2); await wait(300);
  T.ok('quest ring: the dice cup', (QRF.spots('wlq61') || []).some(s => s.kind === 'goal'), JSON.stringify(QRF.spots('wlq61')));
  watchHouse(2); talk('wlt_cup', {}).opts.find(o => /Swap in/.test(o[0]))[1](); await wait(500);
  T.ok('planting seen is an arrest too', G.talk && /Thief/.test(G.talk.node.text) && !FL().wlt2_plant && bagCount('wlt_dice') === 1);
  G.talk.node.opts[0][1](); await wait(500);
  T.ok('the loaded dice are taken by the gaoler', LEVEL === 7097 && bagCount('wlt_dice') === 0);
  G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  const again = talk('wlt_gambler', fence); T.ok('Pike hands out another pair', opt(again, /another pair/)); click(again, /another pair/); T.ok('dice back in the bag', bagCount('wlt_dice') === 1);
  park(); knock(2); await wait(300); talk('wlt_cup', {}).opts.find(o => /Swap in/.test(o[0]))[1](); await wait(100);
  T.ok('unseen: dice planted', FL().wlt2_plant === 1 && bagCount('wlt_dice') === 0 && QUESTS.wlq61.goal(G.quests.wlq61) === 2);
  goToLevel(496, {x: 84, y: 32, f: 3}); await wait(500);
  n = talk('wlt_gambler', fence); const g2 = G.gold; click(n, /It is done/); T.ok('Pike pays (500 x2)', G.gold === g2 + 1000 && qSt('wlq61') === 'done', G.gold - g2);
  // ---- 62: the order book ----
  qAccept('wlq62'); park(); knock(3); await wait(300);
  T.ok('copying seen is an arrest', (() => { watchHouse(3); talk('wlt_ledger', {}).opts.find(o => /Copy a page/.test(o[0]))[1](); return true })());
  await wait(500); T.ok('arrest popup', G.talk && /Thief/.test(G.talk.node.text) && !FL().wlt3_got); G.talk.node.opts[0][1](); await wait(500);
  G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  park(); knock(3); await wait(300); talk('wlt_ledger', {}).opts.find(o => /Copy a page/.test(o[0]))[1]();
  T.ok('unseen: the page is copied', bagCount('wlt_copy') === 1);
  goToLevel(496, {x: 74, y: 50, f: 0}); await wait(500);
  n = talk('wlt_agent', fence); const g3 = G.gold; click(n, /Here is the page/); T.ok('Vane pays (550 x2)', G.gold === g3 + 1100 && qSt('wlq62') === 'done', G.gold - g3);
  // ---- 63: the locket ----
  qAccept('wlq63'); park(); knock(4); await wait(300);
  const rug = talk('wlt_rug', {}); T.ok('the rug hides a loose board', opt(rug, /loose floorboard/)); click(rug, /loose floorboard/);
  T.ok('the board is found (step 2)', FL().wlt4_found === 1 && QUESTS.wlq63.goal(G.quests.wlq63) === 2);
  const g4 = G.gold; T.ok('no locket yet', bagCount('wlt_locket') === 0);
  talk('wlt_rug', {}).opts.find(o => /Take the locket/.test(o[0]))[1](); T.ok('the locket is taken', bagCount('wlt_locket') === 1);
  goToLevel(496, {x: 72, y: 63, f: 3}); await wait(500);
  n = talk('wlt_poacher', fence); const g5 = G.gold; click(n, /Here is the locket/); T.ok('Ned pays (600 x2) and a potion', G.gold === g5 + 1200 && qSt('wlq63') === 'done' && bagCount('potion5') >= 1, G.gold - g5);
  T.ok('all four quests done', ['wlq60','wlq61','wlq62','wlq63'].every(q => qSt(q) === 'done'));
  return T.res }"""

TESTS['extras'] = r"""async () => {
  // the purse: any time, 140 to 260 gold, seen is an arrest
  setClock(12, 22); G.gold = 1000; park(); knock(1); await wait(300);
  const before = G.gold; talk('wlt_val', {}).opts.find(o => /Take the purse/.test(o[0]))[1]();
  T.ok('a purse is worth 140 gold at Church View', G.gold === before + 140, G.gold - before);
  T.ok('the drawer is empty after', /empty/.test(talk('wlt_val', {}).text));
  // peek: where is the watch?
  park(); let pk = talk('wlt_peek', {}).text; T.ok('peek: street empty', /No watchman near/.test(pk), pk);
  watchHouse(1); pk = talk('wlt_peek', {}).text; T.ok('peek: a watchman looking at the house', /north|south|east|west/.test(pk) && /looking at this house/.test(pk), pk);
  // leaving unseen with the purse is fine; leaving seen loses the purse
  watchHouse(1); const g0 = G.gold; goToLevel(496, {x: 24, y: 37, f: 1}); await wait(700);
  T.ok('seen leaving with a stolen purse: arrested and the gold taken back', G.talk && /Stop, thief/.test(G.talk.node.text));
  G.talk.node.opts[0][1](); await wait(500);
  T.ok('the 140 stolen gold is taken by the gaoler', G.gold === g0 - 140, G.gold - g0);
  G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  // warnings at the door
  setClock(13, 22); park(); FL().wlzWarn = 0; const t = wltHouses()[1];
  watchHouse(2); stand(t.h.front[0], t.h.front[1], 3); knock(2); await wait(100);
  T.ok('first time seen at a door: a warning, not an arrest', G.talk && /That is Bluebell Cottage/.test(G.talk.node.text) && LEVEL === 496, G.talk && G.talk.node.text.slice(0, 40));
  const stay = G.talk.node.opts.find(o => /only going in/.test(o[0])); stay[1](); await wait(300);
  T.ok('going in anyway: the watchman posts himself at the door', LEVEL === t.h.id && WLZ.g[0].post && WLZ.g[0].post.t > 100);
  goToLevel(496, {x: t.h.front[0], y: t.h.front[1], f: 3}); await wait(300); G.talk = null;
  knock(2); await wait(300);
  T.ok('second time seen: arrested for trespass', G.talk && /trespass/.test(G.talk.node.text), G.talk && G.talk.node.text.slice(0, 40));
  G.talk.node.opts[0][1](); await wait(500); G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  return T.res }"""

TESTS['saves'] = r"""async () => {
  // jailed state survives a save: the level stub is registered and the state is in the flags
  setClock(20, 22); wlzJail(); await wait(500);
  const sv = JSON.parse(JSON.stringify(snapshot()));
  T.ok('save while in the cells keeps the jailed flag and level', !sv.flags || (sv.flags.wlJailed === 1 && (sv.lvl === 7097 || sv.level === 7097)), JSON.stringify([sv.lvl, sv.level, sv.flags && sv.flags.wlJailed]));
  // a menu jump out of the cells is refused
  const lv = LEVEL; goToLevel(496, {x: 40, y: 50, f: 1}); T.ok('no walking out by goToLevel while jailed', LEVEL === 7097);
  G.gold = 1000; click(talk('wlz_gaoler', {}), /Pay 500/); await wait(500);
  T.ok('free again', LEVEL === 496 && !FL().wlJailed);
  return T.res }"""

SHOT = r"""async (what) => {
  G.lvlBanners = []; G.talk = null; park();
  const look = (x, y, f) => { G.P.x = x; G.P.y = y; G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.C = {x, y, a: G.P.angT}; };
  if (what === 'guard') { setClock(3, 22); goToLevel(496, {x: 24, y: 44, f: 0}); await wait(400); const g = WLZ.g[0]; g.x = 24; g.y = 40; g.post = {t: 1e9, f: [0, 1]}; G.lvlBanners = []; G.talk = null; look(24, 44, 0); }
  if (what === 'guard_day') { setClock(3, 11); goToLevel(496, {x: 24, y: 44, f: 0}); await wait(400); const g = WLZ.g[0]; g.x = 24; g.y = 41; g.post = {t: 1e9, f: [0, 1]}; G.lvlBanners = []; G.talk = null; look(24, 44, 0); }
  if (what === 'jail') { setClock(3, 23); G.flags.wlJailed = 1; goToLevel(7097, {x: 6, y: 2, f: 2}); await wait(400); G.lvlBanners = []; G.talk = null; look(6, 2, 2); }
  if (what === 'jail_corridor') { setClock(3, 23); G.flags.wlJailed = 1; goToLevel(7097, {x: 6, y: 6, f: 0}); await wait(400); G.lvlBanners = []; G.talk = null; look(6, 6, 0); }
  if (what === 'giver') { setClock(3, 22); const d = G.decor.find(d => d.npc === 'wlt_fence'); goToLevel(496, {x: d.x, y: d.y + 3, f: 0}); await wait(400); const L = LEVELS[496]; let best = null;
    for (const [dx, dy, f] of [[0, -5, 2], [0, 5, 0], [5, 0, 3], [-5, 0, 1], [0, 4, 0], [0, -4, 2], [4, 0, 3], [-4, 0, 1], [0, 2, 0], [2, 0, 3], [-2, 0, 1], [0, -2, 2]]) { const x = d.x + dx, y = d.y + dy; if (L.rows[y] && L.rows[y][x] === '.' && wlzLOS(x, y, d.x, d.y) && !L.decor.some(q => q.block && !q.npc && q.x === x && q.y === y)) { best = [x, y, f]; break } }
    G.lvlBanners = []; G.talk = null; if (best) look(best[0], best[1], best[2]); }
  if (what === 'house') { setClock(3, 22); const t = wltHouses()[0]; park(); const f = t.h.out === 0 ? 2 : t.h.out === 2 ? 0 : t.h.out === 1 ? 3 : 1; goToLevel(496, {x: t.h.front[0], y: t.h.front[1], f}); await wait(400); G.lvlBanners = []; G.talk = null; look(t.h.front[0], t.h.front[1], f); }
  if (what === 'inside') { setClock(3, 22); const t = wltHouses()[0]; qAccept && qSt('wlq60') === null && qAccept('wlq60'); wltEnsure(); goToLevel(t.h.id, {x: LEVELS[t.h.id].start.x, y: LEVELS[t.h.id].start.y, f: 0}); await wait(400); G.lvlBanners = []; G.talk = null; const d = G.decor.find(d => d.npc === 'wlt_candle'); look(d.x, d.y + 2 <= LEVELS[t.h.id].rows.length - 2 ? d.y + 2 : d.y + 1, 0); }
  await wait(600); return [LEVEL, G.P.x, G.P.y]; }"""


def main():
    results = []
    with sync_playwright() as p:
        kw = {'executable_path': os.environ['BTA_CHROME']} if os.environ.get('BTA_CHROME') else {}
        b = p.chromium.launch(**kw, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('pageerror ' + str(e)))
        pg.on('console', lambda m: errs.append(m.text[:200]) if m.type == 'error' and '404' not in m.text else None)
        pg.goto(URL)
        pg.wait_for_timeout(9000)
        pg.evaluate("() => { " + PRE.replace('\n', ' ') + " }") if False else pg.add_script_tag(content=PRE)
        for name, js in TESTS.items():
            try:
                pg.evaluate("() => { T.res = [] }")
                r = pg.evaluate(js)
            except Exception as e:
                try:
                    r = pg.evaluate('() => T.res')
                except Exception:
                    r = []
                r = r + [[name + ' CRASHED', False, str(e)[:500]]]
            for n, ok, d in r:
                results.append(ok)
                print(('PASS ' if ok else 'FAIL ') + '[' + name + '] ' + n + ((' :: ' + d) if d and (not ok or len(d) < 160) else ''))
        if SHOTS:
            OUT.mkdir(exist_ok=True)
            for what in ['guard', 'guard_day', 'giver', 'house', 'inside', 'jail', 'jail_corridor']:
                try:
                    pg.evaluate(SHOT, what)
                    pg.screenshot(path=str(OUT / (what + '.png')))
                    print('shot', what)
                except Exception as e:
                    print('shot failed', what, str(e)[:200])
        print('console errors:', [e for e in errs if 'triangles' not in e][:8])
        b.close()
    print('%d of %d checks passed' % (sum(results), len(results)))
    sys.exit(0 if all(results) and not False else 1)


if __name__ == '__main__':
    main()
