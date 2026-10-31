"""The whole-game audit: the castle method (tools/ps_audit.py, ps_ground.py) applied to EVERY level of Below the Abbey.

It boots the game once in Chrome, visits every area the way the jump links do (so each package loads its pictures), builds every
lazily built level (KH_LAZY, again and again until nothing new appears), and then loads each level with the game's own reset(id)
(the same G.grid, G.decor, cellBlocked, TERR_BLOCK and terrStepOK the party walks on) and checks the FINISHED data, not the source.

   python tools/game_audit.py [--all | --area NAME | --levels A-B[,C-D]] [--json out.json] [--report out.md] [--resume] [--quiet]
Env: GA_PORT (default 9011; run your OWN `python -m http.server <port>` from the repo root), BTA_CHROME (Chrome path),
     GA_CHUNK (levels per call, default 150), GA_TOL (float tolerance in squares, default 0.05)
Exit code 1 when a finding of a 'fix' code is not covered by tools/game_audit_allow.json (review codes never fail).

Codes (fix unless marked review):
  wall pictures   NOWALL (picture/sign whose wall square is open or off the map), OVERDOOR (picture on a door square),
                  OVERLAP (two pictures on one wall face; webs, vines, brackets may share), PICINWALL (the picture's own square is
                  not open), TINY / HUGE (picture under 0.12 wide, or wider than 1.2 or taller than the ceiling),
                  WEBFREE (a web that is not on a wall), WDLOOSE (a piece with a wall side, wd, that is drawn free-standing anyway)
  doors           LOOSEDOOR (door, gate, arch or portcullis piece on open floor, not in a gap between walls)
  route           CORRIDOR (blocking prop in a straight one-wide passage), ROUTEBLOCK (a prop that cuts a door or exit off from
                  the arrivals: without solid decor the door is reached, with it not), DOOR_UNREACH (a door or exit no arrival
                  reaches even without decor), START_BLOCKED (the start square is not walkable)
  grounding       FLOAT / SINK (free-standing piece whose drawn feet are above / below the floor by more than GA_TOL),
                  FOE_FLOAT (a walking creature that floats), FOE_CUT (a creature taller than the fight window),
                  NPC_TALL / NPC_SHORT (a person drawn over 1.4 or under 0.4 squares high, visible part)
  names           NAMEPIC review (a clickable piece whose name says one thing and whose picture key another), NPCDEF (npc id with
                  no NPCS entry: clicking does nothing)
  links           DEST_MISSING (door/portal/mound to a level that does not exist), DEST_UNBUILT (to a lazy level that cannot be
                  built), ARRIVE_WALL (the landing square in the far level is not open), ONEWAY review (a door to a level that
                  has no door, portal or mound back), DEST_SHARED review (a generated house entered from two different areas)
  terraces        TERRBLOCK (a creature, item, chest or person on a cell the party can never step on)
  signs           SIGNTEXT (a castle sign with a second line; castle areas only)
  placement       FOE_BLOCKED (creature in a wall, solid prop or blocked cell), FOE_STACK (two creatures on one cell),
                  ITEM_BLOCKED, ITEM_UNREACH, LOOT_UNREACH (chest or barrel no reachable square touches), NPC_UNREACH,
                  DUPDECOR (same piece twice on one cell), OUTSIDE (off the map), NAN (NaN position, scale or lift), INWALL (a
                  free-standing piece inside a wall square), LIGHT_BAD (a light off the map or NaN)
  pictures        MISSINGPIC (decor or creature key with no picture), ITEMDEF / FOEDEF (unknown item or creature type)
  build           BUILDFAIL (a lazy level threw while building), UNBUILT review (a lazy level that never builds and that no door uses),
                  CONSOLE_ERR / CONSOLE_WARN (console errors and warnings logged while the level was built or loaded),
                  LOAD404 (an asset request that failed; attributed to 'global'), LEVELFAIL (the level threw inside the audit)
What it cannot see is listed in tools/GAME_AUDIT_REPORT.md.
"""
import sys, os, json, time, re, argparse, tempfile
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = os.environ.get('GA_PORT', '9011')
CHUNK = int(os.environ.get('GA_CHUNK', '150'))
TOL = float(os.environ.get('GA_TOL', '0.05'))
ALLOW = os.path.join(ROOT, 'tools', 'game_audit_allow.json')
PROGRESS = os.path.join(tempfile.gettempdir(), 'game_audit_progress_%s.json' % PORT)
REVIEW = {'NAMEPIC', 'ONEWAY', 'DEST_SHARED', 'UNBUILT'}
NOISE = re.compile(r'willReadFrequently|hgtm model .* triangles|Download the React DevTools')

INIT = r"""(() => {
  window.__AL = []; window.__ALV = 'boot';
  const wrap = (t) => { const o = console[t].bind(console); console[t] = (...a) => { try { window.__AL.push([window.__ALV, t, a.map(x => x && x.stack ? String(x.stack).slice(0, 300) : String(x)).join(' ').slice(0, 300)]) } catch (e) {} return o(...a) } };
  wrap('error'); wrap('warn');
  window.addEventListener('error', e => { try { window.__AL.push([window.__ALV, 'error', 'uncaught ' + String(e.message).slice(0, 300)]) } catch (x) {} });
})()"""

PREP = r"""async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms)), info = {visits: [], buildErr: {}, notes: []};
  const idle = async max => { const t0 = performance.now(); while (performance.now() - t0 < max) { if (typeof LOAD === 'undefined' || LOAD.d >= LOAD.t) return true; await sleep(120) } return false };
  window.writeAreaSaves = () => {};   // the audit never saves over the player's game
  window.__ALV = 'prep';
  try { await khLoadAssets() } catch (e) { info.notes.push('khLoadAssets ' + e) }
  try { if (typeof khPrepare === 'function') await khPrepare() } catch (e) { info.notes.push('khPrepare ' + e) }
  // the jump table of jumpFromUrl, plus the areas the packages add (Pale Spire, Blighted Road, the tower, the Vault, the Black Swill)
  let AR = {};
  try { const s = jumpFromUrl.toString(); const m = s.match(/const AREAS=(\{[\s\S]*?\});\s*\n/); if (m) AR = (new Function('return ' + m[1]))() } catch (e) { info.notes.push('AREAS ' + e) }
  for (const f of ['pspAreas', 'blAreas', 'ntAreas']) try { if (typeof window[f] === 'function') window[f](AR) } catch (e) { info.notes.push(f + ' ' + e) }
  const extra = {blackswill: () => bswSpot(), vault: () => vtSpot('vault'), vaultboss: () => vtSpot('vaultboss'),
    deephollow: () => { hgBuild(); hgdBuild(); const L = LEVELS[475]; return [475, L.start.x, L.start.y, L.start.f || 0] }};
  const areaLv = {};
  for (const k of Object.keys(AR)) { window.__ALV = 'area ' + k; try { const v = AR[k]; if (Array.isArray(v)) areaLv[k] = v.slice(0, 4) } catch (e) { info.notes.push('area ' + k + ' ' + e) } }
  for (const k in extra) { window.__ALV = 'area ' + k; try { const v = extra[k](); if (Array.isArray(v)) areaLv[k] = v.slice(0, 4) } catch (e) { info.notes.push('area ' + k + ' ' + e) } }
  // visit every area once with the real goToLevel (some packages load their pictures and finish building on the first visit)
  const vis = []; const seenV = new Set();
  for (const k in areaLv) { const [lv, x, y, f] = areaLv[k]; if (!seenV.has(lv)) { seenV.add(lv); vis.push([lv, x, y, f, k]) } }
  if (typeof WORLD_LOCS !== 'undefined') for (const loc of WORLD_LOCS) for (const lv of (loc.lv || []).slice(0, 1)) if (!seenV.has(lv)) { seenV.add(lv); vis.push([lv, null, null, null, loc.k]) }
  for (const [lv, x, y, f, k] of vis) {
    window.__ALV = lv; const t0 = performance.now();
    try { if (!LEVELS[lv] && KH_LAZY[lv]) KH_LAZY[lv]() } catch (e) {}
    try { const L = LEVELS[lv]; const st = (x !== null && x !== undefined) ? {x, y, f: f || 0} : (L && L.start ? {x: L.start.x, y: L.start.y, f: L.start.f || 0} : undefined);
      G.state = 'play'; G.cut = null; G.talk = null; goToLevel(lv, st) } catch (e) { info.notes.push('visit ' + lv + ' ' + String(e).slice(0, 120)) }
    for (let i = 0; i < 100 && LEVEL !== lv; i++) await sleep(100);
    // a package may start its picture loads a moment after the party arrives
    await sleep(400); await idle(15000); await sleep(200); await idle(15000); G.cut = null; G.talk = null; G.lst = {};
    info.visits.push([k, lv, LEVEL === lv, Math.round(performance.now() - t0)]);
  }
  // build every lazy level, again until nothing new appears (a builder may register more rooms)
  for (let pass = 0; pass < 8; pass++) { let n = 0;
    for (const k of Object.keys(KH_LAZY)) { if (LEVELS[k]) continue; window.__ALV = +k; try { KH_LAZY[k](); if (LEVELS[k]) n++ } catch (e) { info.buildErr[k] = String(e).slice(0, 200) } }
    await idle(20000); await sleep(300); info.notes.push('lazy pass ' + pass + ' built ' + n); if (!n && pass > 0) break }
  await idle(30000);
  window.__ALV = 'prep';
  info.areaLv = areaLv; info.nLevels = Object.keys(LEVELS).length;
  info.unbuilt = Object.keys(KH_LAZY).filter(k => !LEVELS[k]).map(Number);
  return info }"""

# links, arrivals and the area of every level
GRAPH = r"""() => {
  const ids = Object.keys(LEVELS).map(Number).sort((a, b) => a - b), links = {}, arrive = {};
  const gmap = L => { const m = {}, ch = L.chars || {}; return c => { if (c in m) return m[c]; return m[c] = ch[c] !== undefined ? ch[c] : (c === '.' || c === 't') ? 0 : c === 'D' ? 3 : c === 'L' ? 4 : c === 'X' ? 5 : c === '%' ? 2 : c === 'T' ? 6 : c === 'G' ? 7 : c === 'C' ? 8 : WALLCH[c] !== undefined ? WALLCH[c] : 1 } };
  for (const id of ids) { const L = LEVELS[id]; if (!L || !L.rows) continue; const g = gmap(L), out = links[id] = [];
    for (let y = 0; y < L.rows.length; y++) { const r = L.rows[y]; for (let x = 0; x < r.length; x++) { const c = r[x]; if (c === '.') continue; const v = g(c);
      if (v >= 1000 && KH_DOOR[v]) { const d = KH_DOOR[v]; if (d.lvl !== undefined) out.push([x, y, d.lvl, d.at ? d.at.x : null, d.at ? d.at.y : null, 'door']) }
      else if (v >= 30 && v < 100 && L.portals && L.portals[v - 30]) { const p = L.portals[v - 30]; out.push([x, y, p.to, p.x, p.y, 'portal']) } } }
    for (const d of L.decor || []) if (d.enter && d.enter.to !== undefined) out.push([d.x, d.y, d.enter.to, d.enter.x, d.enter.y, 'mound']);
    for (const l of out) if (l[3] !== null && l[3] !== undefined) (arrive[l[2]] || (arrive[l[2]] = [])).push([l[3], l[4]]) }
  // areas: the world map's places first, then the packages by number, then every room takes the area of the nearest one it is linked to
  const area = {}, q = [];
  const seed = (id, nm, k) => { if (LEVELS[id] && !area[id]) { area[id] = [nm, k]; q.push(id) } };
  if (typeof WORLD_LOCS !== 'undefined') for (const loc of WORLD_LOCS) for (const lv of loc.lv || []) seed(lv, loc.name || loc.n || loc.k, loc.k);
  const house = id => /^(A|An) [A-Za-z' -]*(House|Shop|Room|Billet|Office|Cottage|Hut)$/i.test(String(LEVELS[id].name || '')) || /^An unfinished room/.test(String(LEVELS[id].name || ''));
  if (typeof PSP !== 'undefined') for (const l of PSP.LEVELS) if (!house(l.id)) seed(l.id, 'The Pale Spire', 'palespire');
  for (const id of ids) { if (house(id)) continue;
    if (id >= 600 && id <= 619) seed(id, 'Sale', 'sale'); else if (id >= 9610 && id <= 9709) seed(id, 'The Blighted Lands', 'blightroad');
    else if (id >= 9710 && id <= 9998) seed(id, 'The Pale Spire', 'palespire'); else if (id >= 1000000000) seed(id, 'The Never-Ending Tower', 'neverending') }
  const nb = {}; for (const id in links) for (const l of links[id]) { (nb[id] || (nb[id] = [])).push(l[2]); (nb[l[2]] || (nb[l[2]] = [])).push(+id) }
  for (let i = 0; i < q.length; i++) { const a = q[i]; for (const b of nb[a] || []) if (LEVELS[b] && !area[b]) { area[b] = area[a]; q.push(b) } }
  for (const id of ids) if (!area[id]) area[id] = ['Unlinked levels', 'unlinked'];
  const names = {}; for (const id of ids) names[id] = String(LEVELS[id].name || LEVEL_NAMES[id] || '');
  // a generated house entered from two different areas (a number shared by two builders)
  const shared = []; const from = {};
  for (const id in links) for (const l of links[id]) { if (!LEVELS[l[2]] || +id === l[2]) continue; (from[l[2]] || (from[l[2]] = new Set())).add(area[id] ? area[id][0] : '?') }
  for (const t in from) if (from[t].size > 1 && LEVELS[t] && house(+t)) shared.push([+t, [...from[t]].join(' / ')]);
  window.__GA = {links, arrive, area};
  return {ids, area, names, shared} }"""

AUDIT = r"""([ids, tol, castleKeys]) => {
  const out = [], D4 = [[0, -1], [1, 0], [0, 1], [-1, 0]], GA = window.__GA;
  const pc = window.__PADC || (window.__PADC = new Map());
  // the transparent padding of a picture: [bottom pad, base pad (widest row), top pad] as fractions of its height (a copy at most 200 rows high is scanned)
  const pad = im => { if (!im || !im.width) return null; if (pc.has(im)) return pc.get(im); let r = null;
    try { const s = Math.min(1, 200 / im.height), w = Math.max(1, Math.round(im.width * s)), h = Math.max(1, Math.round(im.height * s));
      const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(im, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data, cnt = []; let mx = 0;
      for (let y = 0; y < h; y++) { let n = 0; for (let xx = 0; xx < w; xx++) if (d[(y * w + xx) * 4 + 3] > 40) n++; cnt.push(n); if (n > mx) mx = n }
      const th = Math.max(1, w * .004); let last = -1, base = -1, first = -1;
      for (let y = h - 1; y >= 0 && last < 0; y--) if (cnt[y] >= th) last = y;
      for (let y = h - 1; y >= 0 && base < 0; y--) if (cnt[y] >= mx * .4) base = y;
      for (let y = 0; y < h && first < 0; y++) if (cnt[y] >= th) first = y;
      r = last < 0 ? null : [(h - 1 - last) / h, (h - 1 - base) / h, first / h] } catch (e) { r = null }
    pc.set(im, r); return r };
  const SHARE = /web|vine|ivy|moss|crack|stain|dust|corbel|gargoyle|bracket|sconce|lantern|torch|lamp|candle|banner|chain|hook|bell|soot|drip|mold|mould|creeper|root|crown|icicle|shadow/i;
  const LOOSE = /(^|_)(arch|gate|door|portcullis|doorway)(_|\d|$)|rose_arch|bridge_arch|gate_clock/i;
  const HANG = /lantern|chandel|banner|cobweb|web_|^ps_web|web\d|vine|bracket|window|sconce|mirror|portrait|tapestry|clock_face|bell|moon|bat_|sign_|corbel|ledge|hanging|pans_hanging|chains$|plaque|candles_glow|lantern_red|rose_arch|flame|torch|glow|mark|rune|cloud|star|hlant|chime|bunting|balcony|cupola|finial|(^|_)bee\d*$|mote|algae|jelly|(^|_)ray|fish|bubble|(^|_)win(_|\d|$)|bird|crow|raven|butterfl|moth|fly|firefl|wisp|smoke|steam|mist|fog|rain|snow|sky|roof|spire|dcity|kroof|leaf|leaves|canopy|hang|lamp_post|ghost|spirit|orb/i;
  const FLORA = /^[glp]?tree|tree\d|bush|grass|reed|fern|heather|juniper|bracken|shrub|plant|twig|leaf|leaves|flower|weed|tuft|pebble|petal|clover|moss|crop|corn|wheat|vine|ivy|stump|thicket|hedge|briar|bramble/i;
  const ROOFY = /cupola|chimney|finial|balcony|bunting|roof|spire|dome|gable|eave|chime|banner|bracket|dcity/i;
  const CORX = /col|pillar|pier|statue|st_|stair|tele|chest|tree|stump|yew|dead|thicket|bush|rock|boulder|fern|reed|grass|hedge|wall|fence|post|lamp|crop|corn|wheat|cactus|palm|pine|oak|willow|birch|fir|shrub|stalag|crystal|coral|kelp|weed|mush|fung/i;
  const OBJ = /shr_|scare|suit_armour|st_judge|angel|twist|grow|hut|trunk|branch|thorn|briar|bramble|ruin|shed|tower|house|wall|arch|sign|door|gate|board|lever|chest|box|book|altar|well|stone|statue|grave|tree|bell|cart|boat|ship|crate|barrel|cauldron|table|shelf|mirror|portrait|pile|plaque|cage|pillar|post|stall|anvil|forge|bench|bed|throne|coffin|sarcoph|urn|vase|pot|lamp|lantern|fire|brazier|shrine|idol|tele|orb|crystal|map|notice|tomb|skeleton|bones|skull|corpse|body|flower|rose|plant|bush|rock|cairn|machine|wheel|loom|organ|harp|piano|clock|desk|lectern|font|basin|fountain|trough|cart|wagon|pump|net|trap|nest|hive|egg|web|chain|banner|flag|fish|frog|cat|dog|goat|horse|cow|sheep|crow|raven|rat|pig|hen|bird|owl|bat|toad|snake|spider|beetle|ox|mule|donkey|deer|fox|wolf|bear|boar|swan|duck|goose|eel|crab|dragon|statue|bust|mask|hatch|ladder|stair|rope|bucket|sack|bag|basket|jar|bottle|keg|cask|scale|candle|chandel|mill|press|ward|seal|rune|circle|pool|pond|spring|stump|log|hay|cart|tent|camp|kiln|oven|vat|still|cauldron|mural|tapestry|window|bookcase|wardrobe|cupboard|dresser|chair|stool|rack|stand|dummy|target|totem|obelisk|pyre|grave|stele|marker|milestone|monolith|plinth|pedestal|ghost|spirit|wisp|shade|wraith|slime|ooze|egg|cocoon/i;
  const CATS = [['flower', /^(rose|flower|bloom|lily|lilies|tulip|blossom|posy|bouquet|daisy|violet|orchid|poppy|poppies)s?$/], ['stone', /^(stone|rock|boulder|pebble|rubble|cairn)s?$/], ['chest', /^(chest|strongbox|coffer|casket|trunk|box)e?s?$/],
    ['book', /^(book|tome|ledger|scroll|diary|journal|letter|note|page)s?$/], ['bones', /^(skeleton|bones|skull|corpse|body|remains)s?$/], ['grave', /^(grave|tomb|headstone|gravestone|memorial)s?$/], ['tree', /^(tree|oak|yew|willow|stump|birch|pine)s?$/],
    ['statue', /^(statue|idol|bust)s?$/], ['well', /^(well|fountain)s?$/], ['animal', /^(cat|dog|goat|horse|cow|sheep|crow|raven|rat|pig|hen|chicken|bird|owl|frog|toad|fox|wolf|deer|mule|donkey|ox|swan|duck|goose|hound)s?$/],
    ['bell', /^bells?$/], ['barrel', /^(barrel|cask|keg)s?$/], ['altar', /^(altar|shrine)s?$/], ['weapon', /^(sword|axe|spear|bow|shield|blade)s?$/], ['lamp', /^(lamp|lantern|candle|torch|brazier)s?$/], ['boat', /^(boat|ship|skiff|raft)s?$/], ['cart', /^(cart|wagon)s?$/]];
  const cats = s => { const o = new Set(); for (const w of String(s).toLowerCase().split(/[^a-z]+/)) if (w) for (const [c, re] of CATS) if (re.test(w)) o.add(c); return o };
  for (const id of ids) {
    const add = (code, k, x, y, extra) => out.push([id, code, String(k === undefined || k === null ? '' : k), x === undefined ? null : x, y === undefined ? null : y, extra === undefined ? '' : String(extra)]);
    window.__ALV = id;
    try {
      reset(id);
      const L = LEVELS[id], W = MW, H = MH, grid = G.grid, TB = TERR_BLOCK, TS = TERR_STEP, area = (GA.area[id] || ['', ''])[1];
      const castle = castleKeys.includes(area) || (typeof PSP !== 'undefined' && PSP.LEVELS.some(l => l.id === id));
      const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H, gv = (x, y) => inb(x, y) ? grid[y][x] : -1, tb = (x, y) => !!(TB && TB[y * W + x]);
      const isDoorG = g => g === 3 || g === 4 || g === 5 || g === 7 || g === 8 || (g >= 15 && g <= 19) || (g >= 30 && g < 100 && !!(G.portals && G.portals[g - 30])) || (g >= 200 && g < 1000) || !!KH_DOOR[g];
      const open = (x, y) => gv(x, y) === 0;
      const blk = new Map(); for (const d of G.decor) if (d.block && !d.found) { const kk = Math.round(d.y) * W + Math.round(d.x); if (!blk.has(kk)) blk.set(kk, d) }
      const opener = d => !!d.opens || (!!d.npc && /gate|door|hatch|portcullis|fence|bars|cell/i.test(d.k + ' ' + d.npc));
      const solidAt = (x, y) => { const d = blk.get(y * W + x); return d && !opener(d) ? d : null };
      // walls that open: lever targets, the hidden doors of the castles (L._secrets, L.secrets)
      const sec = new Set(); for (const d of G.decor) if (Array.isArray(d.opens)) for (const o of d.opens) if (Array.isArray(o)) sec.add(o[1] * W + o[0]);
      for (const q of [].concat(L._secrets || [], L.secrets || [])) if (q && q.x !== undefined) sec.add(q.y * W + q.x);
      const walkable = (x, y, nodecor) => { if (!inb(x, y)) return false; const g = grid[y][x]; return (g === 0 || g === 3 || g === 4 || (g >= 200 && g < 1000) || sec.has(y * W + x)) && !tb(x, y) && (nodecor || !solidAt(x, y)) };
      // the doors of this level: [x, y, kind, to]
      const doors = []; const selfWarp = new Map();
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = grid[y][x]; if (g === 0) continue;
        if (KH_DOOR[g]) { const d = KH_DOOR[g]; if (d.lvl === id && d.at) selfWarp.set(y * W + x, [d.at.x, d.at.y]); doors.push([x, y, 'door', d.lvl]) }
        else if (g >= 30 && g < 100 && G.portals && G.portals[g - 30]) doors.push([x, y, 'portal', G.portals[g - 30].to]);
        else if (g === 5 || g === 7) doors.push([x, y, 'exit', null]) }
      for (const d of G.decor) if (d.enter && d.enter.to !== undefined) doors.push([d.x, d.y, 'mound', d.enter.to]);
      // reach: from the start and every landing of a door into this level, with the real step rules (terraces walked with terrStepOK), warps inside the level joined
      const starts = []; if (L.start) starts.push([L.start.x, L.start.y]); for (const a of GA.arrive[id] || []) starts.push(a);
      const bfs = nodecor => { const seen = new Uint8Array(W * H), q = [];
        const push = (x, y) => { if (inb(x, y) && walkable(x, y, nodecor) && !seen[y * W + x]) { seen[y * W + x] = 1; q.push([x, y]) } };
        for (const s of starts) push(s[0], s[1]);
        for (let i = 0; i < q.length; i++) { const [x, y] = q[i];
          for (const [a, b] of D4) { const nx = x + a, ny = y + b; if (!inb(nx, ny) || seen[ny * W + nx]) continue;
            const w = selfWarp.get(ny * W + nx); if (w) push(w[0], w[1]);
            if (walkable(nx, ny, nodecor) && (!TS || terrStepOK(x, y, nx, ny))) { seen[ny * W + nx] = 1; q.push([nx, ny]) } } }
        return seen };
      const R = bfs(false); let R0 = null;
      const near = (S, x, y) => (inb(x, y) && S[y * W + x]) || D4.some(([a, b]) => inb(x + a, y + b) && S[(y + b) * W + x + a]);
      if (L.start && !walkable(L.start.x, L.start.y, false)) add('START_BLOCKED', '', L.start.x, L.start.y, 'g=' + gv(L.start.x, L.start.y));
      const reported = new Set();
      for (const [x, y, kind, to] of doors) { if (near(R, x, y) || (kind === 'door' && to === undefined)) continue; /* a door with no level is a closet, niche or sealed door that opens by its own rule */ R0 = R0 || bfs(true);
        if (near(R0, x, y)) { // a prop cuts it off: find the solid pieces on the shortest decor-free path from an arrival
          const prev = new Map(), q = []; for (const s of starts) if (walkable(s[0], s[1], true)) { q.push(s); prev.set(s[1] * W + s[0], -1) }
          let hit = -1; for (let i = 0; i < q.length && hit < 0; i++) { const [cx, cy] = q[i]; for (const [a, b] of D4) { const nx = cx + a, ny = cy + b; if (nx === x && ny === y) { hit = cy * W + cx; break } if (!inb(nx, ny) || prev.has(ny * W + nx) || !walkable(nx, ny, true) || (TS && !terrStepOK(cx, cy, nx, ny))) continue; prev.set(ny * W + nx, cy * W + cx); q.push([nx, ny]) } }
          const bl = []; for (let c = hit; c >= 0; c = prev.get(c)) { const d = solidAt(c % W, (c / W) | 0); if (d) bl.push(d) }
          for (const d of bl) { const kk = d.x + ',' + d.y; if (reported.has(kk)) continue; reported.add(kk); add('ROUTEBLOCK', d.k, d.x, d.y, kind + ' at ' + x + ',' + y + (to !== null ? ' to ' + to : '')) }
          if (!bl.length) add('DOOR_UNREACH', kind, x, y, 'to ' + to + ' (blocked by decor, not found on the path)') }
        else add('DOOR_UNREACH', kind, x, y, to !== null ? 'to ' + to : '') }
      // destinations: every door, portal and mound leads to a level that exists, lands on an open square, and has a way back
      const back = new Set(); for (const l of GA.links[id] || []) { if (l[2] === id) continue; const key = l[2];
        if (!LEVELS[key]) { if (back.has('m' + key)) continue; back.add('m' + key); add(KH_LAZY[key] ? 'DEST_UNBUILT' : 'DEST_MISSING', l[5], l[0], l[1], 'to ' + key); continue }
        const T = LEVELS[key];
        if (l[3] !== null && l[3] !== undefined) { const r = T.rows[l[4]]; const c = r && r[l[3]]; const ch = T.chars || {}; const g = c === undefined ? -1 : ch[c] !== undefined ? ch[c] : (c === '.' || c === 't') ? 0 : c === 'D' ? 3 : c === 'L' ? 4 : WALLCH[c] !== undefined ? WALLCH[c] : 1;
          if (g !== 0 && g !== 3 && g !== 4 && !back.has('w' + key + ',' + l[3] + ',' + l[4])) { back.add('w' + key + ',' + l[3] + ',' + l[4]); add('ARRIVE_WALL', l[5], l[0], l[1], 'to ' + key + ' lands on ' + l[3] + ',' + l[4] + (c === undefined ? ' (off the map of ' + T.rows[0].length + 'x' + T.rows.length + ')' : ' (' + JSON.stringify(c) + ')')) } }
        if (!back.has('o' + key)) { back.add('o' + key); if (!(GA.links[key] || []).some(q => q[2] === id)) add('ONEWAY', l[5], l[0], l[1], 'to ' + key + ' ' + String(T.name || '').slice(0, 40) + ', no way back') } }
      // decor: measured from the game's own sprite list (after every package's wrapper has resized, lifted or flattened it), the camera walked over big maps
      const wallPic = d => !!(d.wd && (d.pic || d.msgr || d.txt || d.k === 'lever' || String(d.k).startsWith('branch')));
      const spr = new Map();
      try { const C0 = G.C; if (LEVEL === 44 && typeof khBucketDecor === 'function') khBucketDecor();
        const step = G.decor.length <= 250 ? 1e9 : 40;
        for (let cy = Math.min(step / 2, H / 2); cy < H + step / 2; cy += step) for (let cx = Math.min(step / 2, W / 2); cx < W + step / 2; cx += step) {
          G.C = {x: Math.min(W - 1, cx), y: Math.min(H - 1, cy), a: 0}; try { sprNear.c = null } catch (e) {}
          for (const s of spriteList()) if (s.decor && !spr.has(s.decor)) spr.set(s.decor, s) }
        G.C = C0 } catch (e) { add('LEVELFAIL', 'spriteList', null, null, String(e).slice(0, 160)) }
      const seenPic = new Map(), dup = new Map(), pictureless = k => /^hgtk_/.test(k) || (typeof HGTM !== 'undefined' && HGTM.models && HGTM.models[k]);
      for (const d of G.decor) {
        const k = String(d.k), x = d.x, y = d.y;
        if (![x, y, d.sc === undefined ? 1 : d.sc, d.bob || 0].every(Number.isFinite)) { add('NAN', k, x, y, 'sc ' + d.sc + ' bob ' + d.bob); continue }
        if (!inb(Math.round(x), Math.round(y))) { add('OUTSIDE', k, x, y); continue }
        const rx = Math.round(x), ry = Math.round(y), dk = k + '|' + rx + '|' + ry + '|' + (d.wd || ''); dup.set(dk, (dup.get(dk) || 0) + 1);
        if (dup.get(dk) === 2 && !FLORA.test(k)) add('DUPDECOR', k, rx, ry);
        const wp = wallPic(d), sky = SKYLINE.test(k) || d.over || d.sky, s = spr.get(d), im = s && s.img;
        if (s && !im && !pictureless(k)) add('MISSINGPIC', k, rx, ry, d.npc ? 'npc ' + d.npc : '');
        if (d.npc && !d.goat && typeof NPCS !== 'undefined' && !NPCS[d.npc]) add('NPCDEF', k, rx, ry, 'npc ' + d.npc);
        const f2x = d.kname && LEVELS[id] && LEVELS[id]._f2x && LEVELS[id]._f2x[d.kname];   // the second floor keeps the extra fields of its planes and flyers by name
        if (f2x && f2x.fly) d.fly = 1;
        if (wp && (d.span || (f2x && f2x.span))) { /* a free-standing painted plane of the second floor (ps_f2_kit.js f2Span: a bridge, boat, fog or plaque): not a wall picture */ }
        else if (wp) {
          const bx = rx + d.wd[0], by = ry + d.wd[1], g = gv(bx, by);
          if (g <= 0 && !/cell_door|iron_gate/.test(k)) add('NOWALL', k, rx, ry, 'wall side ' + d.wd + (g < 0 ? ' off the map' : ' is open'));
          else if (g > 0 && isDoorG(g) && (castle || !d.txt)) add('OVERDOOR', k, rx, ry, 'door ' + g);
          if (!open(rx, ry) && !isDoorG(gv(rx, ry))) add('PICINWALL', k, rx, ry, 'g=' + gv(rx, ry));
          const key = rx + ',' + ry + ',' + d.wd[0] + ',' + d.wd[1], p = seenPic.get(key);
          if (p && !(SHARE.test(k) || SHARE.test(String(p.k)))) add('OVERLAP', k, rx, ry, String(p.k)); else if (!p) seenPic.set(key, d);
          if (s && s.pic && im && im.width) { const w = s.w, hh = w * im.height / im.width; if (w < .12) add('TINY', k, rx, ry, 'w ' + w.toFixed(2)); else if (!/door|gate|portcullis|stair/i.test(k) && (w > (SHARE.test(k) ? 2.0 : 1.3) || hh > CEILH)) add('HUGE', k, rx, ry, 'drawn ' + w.toFixed(2) + ' wide, ' + hh.toFixed(2) + ' high (ceiling ' + (+CEILH).toFixed(2) + ')') }
        } else {
          if (d.wd && !d.npc) add('WDLOOSE', k, rx, ry, 'wd ' + d.wd + ' but drawn free-standing');
          if (/web/i.test(k)) add('WEBFREE', k, rx, ry);
          if (!sky && gv(rx, ry) !== 0 && !isDoorG(gv(rx, ry)) && !d.found && !FLORA.test(k) && !ROOFY.test(k)) add('INWALL', k, rx, ry, 'g=' + gv(rx, ry));
          if (LOOSE.test(k) && !d.npc && open(rx, ry) && !/iron_gate_big/.test(k)) { const inGap = (!open(rx + 1, ry) && !open(rx - 1, ry) && open(rx, ry + 1) && open(rx, ry - 1)) || (!open(rx, ry + 1) && !open(rx, ry - 1) && open(rx + 1, ry) && open(rx - 1, ry)); if (!inGap) add('LOOSEDOOR', k, rx, ry) }
          if (d.block && !d.found && !d.npc && !d.deco && open(rx, ry) && !d.goldAmt && !CORX.test(k)) {
            const o = (a, b) => open(rx + a, ry + b) && !tb(rx + a, ry + b);
            const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([a, b]) => o(a, b)).length;
            if (n === 2 && ((o(1, 0) && o(-1, 0)) || (o(0, 1) && o(0, -1)))) add('CORRIDOR', k, rx, ry) }
          // grounding (the ps_ground method on the drawn sprite): padding under the feet times the drawn height, plus the lift, minus the engine's drop
          const hang = !s || s.hang || s.flat || s.pic || s.mount || HANG.test(k) || sky || d.fly || (d.walk && d.deco && (d.bob || 0) <= .12) || d.hidden || d.found;
          if (im && im.width && !hang) { const pp = pad(im); if (pp) {
            const Hh = s.w * im.height / im.width, bob = s.bob || 0, drop = s.drop || 0;
            const gap = (pp[0] - drop - (TS ? .06 : 0)) * Hh + bob;
            const onTop = bob > 0 && (pp[0] - drop) * Hh <= tol && G.decor.some(q => q !== d && Math.round(q.x) === rx && Math.round(q.y) === ry && !wallPic(q) && !HANG.test(String(q.k)));   // a book on a table, a candle on a chest
            const byWall = D4.some(([a, b]) => gv(rx + a, ry + b) > 0);
            if (gap > tol && !onTop) add(bob > tol && (pp[0] - drop) * Hh <= tol && byWall ? 'HOVER' : 'FLOAT', k, rx, ry, 'gap ' + gap.toFixed(2) + ' (pad ' + pp[0].toFixed(2) + ', h ' + Hh.toFixed(2) + ', bob ' + (+bob).toFixed(2) + ')');
            else if (pp[0] * Hh + bob < -Math.max(tol, .08) && !FLORA.test(k) && !/water|pool|puddle|rug|carpet|floor|grate|hole|pit|stain|blood|rubble/i.test(k)) add('SINK', k, rx, ry, 'gap ' + (pp[0] * Hh + bob).toFixed(2) + ' (pad ' + pp[0].toFixed(2) + ', h ' + Hh.toFixed(2) + ', bob ' + (+bob).toFixed(2) + ')');
            // people (tall and narrow pictures that are not objects): their visible height
            if (d.npc && !d.goat && !OBJ.test(k) && !OBJ.test(String(d.npc)) && im.height / im.width >= 1.5) { const vis = Hh * (1 - pp[0] - pp[2]); if (vis > 1.4) add('NPC_TALL', k, rx, ry, 'h ' + vis.toFixed(2) + ' npc ' + d.npc); else if (vis < .4) add('NPC_SHORT', k, rx, ry, 'h ' + vis.toFixed(2) + ' npc ' + d.npc) } } }
        }
        if (castle && d.txt && d.txt[1]) add('SIGNTEXT', k, rx, ry, String(d.txt[1]).slice(0, 60));
        // a clickable piece whose name and picture disagree (for a person to look at)
        if (d.npc && typeof NPCS !== 'undefined' && NPCS[d.npc]) { const nm = d.kname || NPCS[d.npc].name || ''; const a = cats(nm), b = cats(k);
          if (a.size && b.size && ![...a].some(c => b.has(c))) add('NAMEPIC', k, rx, ry, '"' + String(nm).slice(0, 40) + '" is ' + [...a].join('/') + ', picture is ' + [...b].join('/')) }
        if (d.loot && !d.found && !near(R, rx, ry)) add('LOOT_UNREACH', k, rx, ry);
        else if (d.npc && !d.found && !d.hidden && !opener(d) && !near(R, rx, ry) && !wp && !/boat|ship|skiff|raft/i.test(k)) add('NPC_UNREACH', k, rx, ry, 'npc ' + d.npc);
      }
      // creatures
      const fc = new Map();
      for (const e of G.enemies) { const def = ENEMY_DEF[e.t];
        if (!def) { add('FOEDEF', e.t, e.x, e.y); continue }
        if (![e.x, e.y].every(Number.isFinite)) { add('NAN', e.t, e.x, e.y); continue }
        if (!inb(e.x, e.y)) { add('OUTSIDE', e.t, e.x, e.y); continue }
        const kk = e.y * W + e.x; fc.set(kk, (fc.get(kk) || 0) + 1); if (fc.get(kk) === 2) add('FOE_STACK', e.t, e.x, e.y);
        if (gv(e.x, e.y) !== 0 || solidAt(e.x, e.y)) add('FOE_BLOCKED', e.t, e.x, e.y, gv(e.x, e.y) !== 0 ? 'g=' + gv(e.x, e.y) : 'on ' + solidAt(e.x, e.y).k);
        else if (tb(e.x, e.y) && !def.fly && !def.swim) add('TERRBLOCK', e.t, e.x, e.y, 'creature');
        const base = IMG[def.img]; if (!base) { add('MISSINGPIC', e.t, e.x, e.y, 'creature picture ' + def.img); continue }
        const pp = pad(base); if (!pp) continue; const fs = fitScale(e.t, def, base), Hh = def.w * fs * base.height / base.width, fl = def.fly ? (def.floatH !== undefined ? def.floatH : .3) : 0;
        if (!def.fly && !def.float && !def.hover && pp[0] * Hh > tol) add('FOE_FLOAT', e.t, e.x, e.y, 'gap ' + (pp[0] * Hh).toFixed(2) + ' (pad ' + pp[0].toFixed(2) + ')');
        if (Hh * (1 - pp[2]) + fl > 1.0 && !HUGE_FOES.includes(e.t)) add('FOE_CUT', e.t, e.x, e.y, 'top at ' + (Hh * (1 - pp[2]) + fl).toFixed(2) + ' (window about 1.0)') }
      // items
      for (const it of G.items) { if (!ITEMDEF[it.k] && !/^sundisc/.test(it.k) && it.k !== 'key') add('ITEMDEF', it.k, it.x, it.y);
        if (!inb(it.x, it.y)) { add('OUTSIDE', it.k, it.x, it.y); continue }
        if (!walkable(it.x, it.y, false)) add(tb(it.x, it.y) ? 'TERRBLOCK' : 'ITEM_BLOCKED', it.k, it.x, it.y, tb(it.x, it.y) ? 'item' : 'g=' + gv(it.x, it.y));
        else if (!R[it.y * W + it.x]) add('ITEM_UNREACH', it.k, it.x, it.y) }
      for (const l of L.lights || []) { const x = l.x !== undefined ? l.x : l[0], y = l.y !== undefined ? l.y : l[1]; if (x === undefined) continue; if (!Number.isFinite(x) || !Number.isFinite(y) || !inb(Math.floor(x), Math.floor(y))) add('LIGHT_BAD', 'light', x, y) }
    } catch (e) { add('LEVELFAIL', '', null, null, String(e).slice(0, 160) + ' ' + String(e.stack || '').split('\n').slice(1, 3).join(' | ').slice(0, 200)) }
  }
  window.__ALV = 'idle';
  return out }"""

CASTLE_KEYS = ['palespire', 'orangecastle', 'violettower', 'neverending']


def parse_args():
    ap = argparse.ArgumentParser(description='Whole-game audit of the finished level data (see the module docstring).')
    g = ap.add_mutually_exclusive_group()
    g.add_argument('--all', action='store_true', help='every level (the default)')
    g.add_argument('--area', help='only levels whose area name or area key contains this (case does not matter)')
    g.add_argument('--levels', help='only these level ids, e.g. 9600-9709,600-619')
    ap.add_argument('--json', help='write every finding to this JSON file')
    ap.add_argument('--report', help='write the counts and top findings per area as Markdown to this file')
    ap.add_argument('--resume', action='store_true', help='continue an interrupted run (progress in %s)' % PROGRESS)
    ap.add_argument('--quiet', action='store_true', help='print only the summary table')
    return ap.parse_args()


def ranges(s):
    out = []
    for part in s.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-', 1); out.append((int(a), int(b)))
        else:
            out.append((int(part), int(part)))
    return out


def load_allow():
    if not os.path.exists(ALLOW):
        return []
    with open(ALLOW, encoding='utf-8') as f:
        data = json.load(f)
    ents = data.get('entries', data) if isinstance(data, dict) else data
    for e in ents:
        if not e.get('reason'):
            raise SystemExit('game_audit_allow.json: every entry needs a reason: %r' % e)
        if e.get('key'):
            e['_re'] = re.compile(e['key'])
        if isinstance(e.get('level'), str) and e['level'] != '*':
            e['_lv'] = ranges(e['level'])
        elif isinstance(e.get('level'), int):
            e['_lv'] = [(e['level'], e['level'])]
    return ents


def allowed(f, ents):
    for e in ents:
        if e.get('code') not in (None, '*', f['code']):
            continue
        if e.get('area') and e['area'].lower() not in (f['area'] + ' ' + f['areakey']).lower():
            continue
        if '_lv' in e and not any(a <= f['level'] <= b for a, b in e['_lv']):
            continue
        if '_re' in e and not e['_re'].search(f['key']):
            continue
        if 'x' in e and e['x'] != f['x']:
            continue
        if 'y' in e and e['y'] != f['y']:
            continue
        return e['reason']
    return None


class Page:
    def __init__(self, p):
        self.p = p; self.b = None; self.pg = None; self.net = []; self.cur = 'boot'

    def open(self):
        if self.b:
            try:
                self.b.close()
            except Exception:
                pass
        self.b = self.p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        self.pg = self.b.new_page(viewport={'width': 900, 'height': 600})
        self.pg.add_init_script(INIT)
        self.pg.on('response', lambda r: self.net.append([self.cur, r.status, r.url]) if r.status >= 400 else None)
        self.pg.on('requestfailed', lambda r: self.net.append([self.cur, 0, r.url]) if not re.search(r'\.(mp3|ogg|wav|m4a)(\?|$)', r.url) else None)   # an aborted sound stream is not a missing file
        t = time.time()
        self.pg.goto('http://127.0.0.1:%s/index.html?town=oldhaven&lvl=34&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=120000)
        self.pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVELS!=='undefined'", timeout=180000)
        self.pg.wait_for_timeout(1500)
        log('booted in %.1fs; visiting every area and building every level' % (time.time() - t))
        t = time.time()
        self.pg.set_default_timeout(900000)
        self.prep = self.pg.evaluate(PREP)
        log('prepared in %.1fs: %d levels, %d visits, %d build errors, %d lazy levels never built' % (time.time() - t, self.prep['nLevels'], len(self.prep['visits']), len(self.prep['buildErr']), len(self.prep['unbuilt'])))
        bad = [v for v in self.prep['visits'] if not v[2]]
        if bad:
            log('  areas the visit did not enter (built from KH_LAZY instead):', ', '.join('%s %s' % (v[0], v[1]) for v in bad))
        for n in self.prep['notes']:
            if not n.startswith('lazy pass'):
                log('  note:', n)
        self.graph = self.pg.evaluate(GRAPH)

    def logs(self):
        try:
            return self.pg.evaluate("() => { const a = window.__AL; window.__AL = []; return a }")
        except Exception:
            return []


QUIET = False


def log(*a):
    if not QUIET:
        print(*a, flush=True)


def main():
    global QUIET
    args = parse_args(); QUIET = args.quiet
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    ents = load_allow()
    prog = None
    if args.resume and os.path.exists(PROGRESS):
        prog = {'done': [], 'findings': []}
        with open(PROGRESS, encoding='utf-8') as f:
            for line in f:
                try:
                    r = json.loads(line)
                except ValueError:
                    continue   # a line cut off by the interruption
                prog['done'] += r['done']; prog['findings'] += r['findings']
        log('resuming: %d levels already done' % len(prog['done']))
    elif os.path.exists(PROGRESS):
        os.remove(PROGRESS)
    findings = prog['findings'] if prog else []
    done = set(prog['done']) if prog else set()
    t0 = time.time()
    with sync_playwright() as p:
        P = Page(p); P.open()
        G = P.graph
        area = {int(k): v for k, v in G['area'].items()}; names = {int(k): v for k, v in G['names'].items()}
        ids = G['ids']
        if args.levels:
            rr = ranges(args.levels); ids = [i for i in ids if any(a <= i <= b for a, b in rr)]
        elif args.area:
            s = args.area.lower(); ids = [i for i in ids if s in (area[i][0] + ' ' + area[i][1]).lower()]
        idset = set(ids)
        log('auditing %d levels' % len(ids))

        def F(lv, code, key, x, y, extra):
            a = area.get(lv, ['global', 'global']) if lv is not None else ['global', 'global']
            return {'area': a[0], 'areakey': a[1], 'level': lv if lv is not None else -1, 'name': names.get(lv, ''), 'code': code, 'key': key, 'x': x, 'y': y, 'extra': extra}

        if not prog:   # what the preparation found: build errors, levels that never build, houses shared by two areas, console noise while booting
            for k, e in P.prep['buildErr'].items():
                if int(k) in idset or not args.levels and not args.area:
                    findings.append(F(int(k), 'BUILDFAIL', '', None, None, e))
            used = set()
            for s in P.pg.evaluate("() => Object.values(window.__GA.links).flat().map(l => l[2])"):
                used.add(s)
            run = []   # lazy levels that never build and that no door uses, reported as runs of numbers (one a door leads to is reported at the door, DEST_UNBUILT)
            for k in sorted(P.prep['unbuilt']) + [None]:
                if k is not None and (str(k) in P.prep['buildErr'] or k in used or not ((not args.levels and not args.area) or k in idset)):
                    continue
                if k is not None and run and k == run[-1] + 1:
                    run.append(k); continue
                if run:
                    findings.append(F(run[0], 'UNBUILT', '', None, None, 'KH_LAZY never builds %s and no door leads there' % ('%d to %d (%d levels)' % (run[0], run[-1], len(run)) if len(run) > 1 else run[0])))
                run = [k] if k is not None else []
            for t, src in G['shared']:
                if t in idset:
                    findings.append(F(t, 'DEST_SHARED', '', None, None, 'entered from ' + src))
            for v, t, m in P.logs():
                if NOISE.search(m):
                    continue
                lv = v if isinstance(v, int) else None
                if lv is None or lv in idset or (not args.levels and not args.area):
                    findings.append(F(lv, 'CONSOLE_ERR' if t == 'error' else 'CONSOLE_WARN', '', None, None, ('[%s] ' % v if lv is None else '') + m))
            with open(PROGRESS, 'a', encoding='utf-8') as f:
                f.write(json.dumps({'done': [], 'findings': findings}) + '\n')
        todo = [i for i in ids if i not in done]
        n = 0
        while n < len(todo):
            chunk = todo[n:n + CHUNK]
            P.cur = chunk[0]
            try:
                res = P.pg.evaluate(AUDIT, [chunk, TOL, CASTLE_KEYS])
            except Exception as ex:
                if 'SyntaxError' in str(ex) or 'ReferenceError' in str(ex):
                    raise SystemExit('the audit script itself is broken: ' + str(ex)[:300])
                log('chunk from %d failed (%s); going one level at a time' % (chunk[0], str(ex)[:120]))
                res = []
                for one in chunk:
                    try:
                        P.pg.set_default_timeout(60000)
                        res += P.pg.evaluate(AUDIT, [[one], TOL, CASTLE_KEYS])
                    except Exception as ex2:   # a level that hangs or kills the page: record it, open a fresh page and go on
                        res.append([one, 'LEVELFAIL', '', None, None, 'audit timed out or crashed: ' + str(ex2)[:160]])
                        P.open()
                P.pg.set_default_timeout(900000)
            new = [F(*r) for r in res]
            for v, t, m in P.logs():
                if NOISE.search(m):
                    continue
                new.append(F(v if isinstance(v, int) else None, 'CONSOLE_ERR' if t == 'error' else 'CONSOLE_WARN', '', None, None, m))
            findings += new
            done.update(chunk); n += len(chunk)
            with open(PROGRESS, 'a', encoding='utf-8') as f:   # one line per chunk, so a long run never rewrites a big file
                f.write(json.dumps({'done': chunk, 'findings': new}) + '\n')
            log('  %d / %d levels, %d findings, %.0fs' % (n, len(todo), len(findings), time.time() - t0))
        seen404 = set()
        for v, st, url in P.net:
            u = url.split('?')[0]
            if u in seen404:
                continue
            seen404.add(u)
            findings.append(F(None, 'LOAD404', '', None, None, '%s %s' % (st or 'failed', u.replace('http://127.0.0.1:%s/' % PORT, ''))))
        P.b.close()
    if os.path.exists(PROGRESS):
        os.remove(PROGRESS)
    for f in findings:
        f['allowed'] = allowed(f, ents)
    summarize(findings, len(ids), time.time() - t0, args)


def summarize(findings, nlev, secs, args):
    codes = sorted({f['code'] for f in findings})
    by = {}
    for f in findings:
        if f['allowed']:
            continue
        by.setdefault(f['area'], {}).setdefault(f['code'], 0)
        by[f['area']][f['code']] += 1
    print('\nGAME AUDIT: %d levels in %.0fs, %d findings (%d allowed)' % (nlev, secs, len(findings), sum(1 for f in findings if f['allowed'])))
    tot = {}
    for a in sorted(by, key=lambda a: -sum(by[a].values())):
        print('  %-44s %6d   %s' % (a[:44], sum(by[a].values()), ', '.join('%s %d' % (c, n) for c, n in sorted(by[a].items(), key=lambda q: -q[1]))))
        for c, n in by[a].items():
            tot[c] = tot.get(c, 0) + n
    print('  by check: ' + ', '.join('%s %d' % (c, n) for c, n in sorted(tot.items(), key=lambda q: -q[1])))
    if args.json:
        with open(args.json, 'w', encoding='utf-8') as f:
            json.dump(findings, f, indent=0, ensure_ascii=False)
        print('wrote', args.json)
    if args.report:
        write_report(findings, nlev, secs, args.report)
        print('wrote', args.report)
    fix = [f for f in findings if not f['allowed'] and f['code'] not in REVIEW]
    print('AUDIT CLEAN' if not fix else 'AUDIT FOUND %d to fix (plus %d for review)' % (len(fix), sum(1 for f in findings if not f['allowed'] and f['code'] in REVIEW)))
    sys.exit(1 if fix else 0)


ORDER = ['NOWALL', 'OVERDOOR', 'OVERLAP', 'PICINWALL', 'WEBFREE', 'LOOSEDOOR', 'ROUTEBLOCK', 'CORRIDOR', 'DOOR_UNREACH', 'START_BLOCKED', 'DEST_MISSING', 'DEST_UNBUILT', 'ARRIVE_WALL',
         'FOE_BLOCKED', 'ITEM_BLOCKED', 'TERRBLOCK', 'ITEM_UNREACH', 'LOOT_UNREACH', 'NPC_UNREACH', 'NPCDEF', 'FOEDEF', 'ITEMDEF', 'MISSINGPIC', 'SIGNTEXT', 'NPC_TALL', 'NPC_SHORT',
         'FOE_CUT', 'FOE_FLOAT', 'FLOAT', 'HOVER', 'SINK', 'TINY', 'HUGE', 'INWALL', 'WDLOOSE', 'DUPDECOR', 'FOE_STACK', 'OUTSIDE', 'NAN', 'LIGHT_BAD', 'BUILDFAIL', 'LEVELFAIL', 'CONSOLE_ERR',
         'CONSOLE_WARN', 'LOAD404', 'ONEWAY', 'DEST_SHARED', 'NAMEPIC', 'UNBUILT']


REGIONS = [('The Blighted Lands', ['Toll House', 'Ashenfold Farm', 'Church of the Hollow Saint', 'Gallowmere', 'Bone Orchard', 'Lanternrest Waystation', 'Vault of Maldrake', 'Hollowbell Abbey', 'Rookery Mill', 'Pale Bridge', 'The Blighted Lands', 'Sale']),
           ('The Pale Lands', ['The Pale Spire', 'The Never-Ending Tower']),
           ('Below the Abbey', ['Hollow Grasslands', 'The Deeper Hollow', 'The Underlevel', 'The Drowned Maze', 'The Orange Spire', 'The Violet Tower', 'Below the Abbey']),
           ('Wenlock', ['Wenlock', 'Wenlock Graveyard', 'The Red Ossuary', 'The Grey Charnel', 'The Black Barrow', 'The Pale Catacombs', 'The Well Maze', 'Under the Well', 'The Maze of Gardens', 'Blackbriar Wood', 'The Ruby Maze']),
           ('Oldhaven and the road', ['Oldhaven', 'The Oakwood', 'The Pilgrim’s Path', 'Saint Elen’s']),
           ('Khemetra, Yarrim and the sea', ['Khemetra', 'Yarrim', 'Saltbarrow', 'The Isle of Bells', 'Cinder Isle', 'Last Light', 'The Open Sea']),
           ('The deserts', ['The Sand Road', 'Tomb of Sut', 'The Red Dunes', 'The Blue Dunes', 'The White Dunes', 'The Flatlands', 'The Golden Erg', 'The Violet Erg', 'The Golden Pyramid'])]


def region(a):
    for r, l in REGIONS:
        if a in l:
            return r
    return 'global' if a == 'global' else 'The Known Lands'


def write_report(findings, nlev, secs, path):
    live = [f for f in findings if not f['allowed']]
    areas = {}
    for f in live:
        areas.setdefault(f['area'], []).append(f)
    codes = [c for c in ORDER if any(f['code'] == c for f in live)] + sorted({f['code'] for f in live} - set(ORDER))
    L = ['<!-- generated by tools/game_audit.py --report; the notes below the tables are written by hand -->', '',
         '## Counts per area', '', '%d levels audited in %.0f s (plus about 95 s to visit every area and build every level). %d findings, %d of them allowed in tools/game_audit_allow.json. Review codes (%s) are for a person to look at and never fail the run.' % (nlev, secs, len(findings), len(findings) - len(live), ', '.join(sorted(REVIEW))), '',
         '| Region | Area | Levels with findings | Fix | Review | Checks |', '|---|---|---|---|---|---|']
    for a in sorted(areas, key=lambda a: (region(a), -len(areas[a]))):
        fs = areas[a]; cnt = {}
        for f in fs:
            cnt[f['code']] = cnt.get(f['code'], 0) + 1
        L.append('| %s | %s | %d | %d | %d | %s |' % (region(a), a, len({f['level'] for f in fs}), sum(1 for f in fs if f['code'] not in REVIEW), sum(1 for f in fs if f['code'] in REVIEW), ', '.join('%s %d' % (c, cnt[c]) for c in codes if c in cnt)))
    L.append('| **All** | | %d | %d | %d | |' % (len({f['level'] for f in live}), sum(1 for f in live if f['code'] not in REVIEW), sum(1 for f in live if f['code'] in REVIEW)))
    L += ['', '## Counts per check', '', '| Check | Findings | Areas |', '|---|---|---|']
    for c in codes:
        fs = [f for f in live if f['code'] == c]
        L.append('| %s%s | %d | %d |' % (c, ' (review)' if c in REVIEW else '', len(fs), len({f['area'] for f in fs})))
    L += ['', '## Top 40 findings per area', '', 'Ordered by check (wall pictures, doors and routes first, cosmetic last), then level and position.', '']
    rank = {c: i for i, c in enumerate(ORDER)}
    for a in sorted(areas, key=lambda a: -len(areas[a])):
        fs = sorted(areas[a], key=lambda f: (rank.get(f['code'], 99), f['level'], f['y'] if f['y'] is not None else -1, f['x'] if f['x'] is not None else -1))
        # spread the 40 over the checks: at most 8 of one check first, then fill
        pick, per = [], {}
        for f in fs:
            if per.get(f['code'], 0) < 8 and len(pick) < 40:
                pick.append(f); per[f['code']] = per.get(f['code'], 0) + 1
        for f in fs:
            if len(pick) >= 40:
                break
            if f not in pick:
                pick.append(f)
        pick.sort(key=lambda f: (rank.get(f['code'], 99), f['level'], f['y'] if f['y'] is not None else -1, f['x'] if f['x'] is not None else -1))
        L += ['### %s (%d findings in %d levels)' % (a, len(fs), len({f['level'] for f in fs})), '', '| Code | Level | Name | Key | x,y | Extra |', '|---|---|---|---|---|---|']
        for f in pick:
            L.append('| %s | %s | %s | %s | %s | %s |' % (f['code'], f['level'] if f['level'] >= 0 else '', str(f['name']).replace('|', '/')[:40], f['key'].replace('|', '/')[:40], '' if f['x'] is None else '%s,%s' % (f['x'], f['y']), str(f['extra']).replace('|', '/').replace('\n', ' ')[:110]))
        L.append('')
    allowed_ = [f for f in findings if f['allowed']]
    if allowed_:
        L += ['## Allowed (recorded, not hidden)', '', '| Reason | Count |', '|---|---|']
        cnt = {}
        for f in allowed_:
            cnt[f['allowed']] = cnt.get(f['allowed'], 0) + 1
        for r, n in sorted(cnt.items(), key=lambda q: -q[1]):
            L.append('| %s | %d |' % (r, n))
        L.append('')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))


if __name__ == '__main__':
    main()
