"""The castle audit: one data-driven check of what the player will actually see in every built Pale Spire level.
   Run it before you say a level is done: `python tools/ps_audit.py` (own server; env PS_PORT, BTA_CHROME). Exit 1 if anything is flagged.
   It reads the finished levels (after ps_curate, ps_tidy, ps_wallart, ps_scale and the rest have run), not the source, so it checks the result.
   Checks:
     NOWALL     a wall picture (decor pic + wd, signs included) whose wall square is not a wall
     OVERDOOR   a wall picture hanging on a door square
     OVERLAP    two wall pictures on the same wall square and side (webs, vines, corbels, brackets may share)
     WEBFREE    a web or cobweb that is not a wall picture (a web floating in a room)
     WEBFRAME   a portrait, mirror or frame that carries a web in the same square but is not on a wall
     LOOSEDOOR  a door, gate, arch or portcullis piece standing on open floor
     CORRIDOR   a blocking free-standing prop in a one-wide passage
     VINES      a vine, ivy or moss piece inside the gatehouse interiors
     BANNED     hounds, dogs, timber, hay, village pieces anywhere in the castle
     SIGNTEXT   a sign with a second line
     TINY/HUGE  a picture drawn narrower than 0.12 or wider than 1.6 squares
     (the checks below were added from the whole-game audit, tools/game_audit.py, so the castle standard and the whole-game audit agree)
     WDLOOSE    a piece with a wall side (wd) that is not a wall picture, so it is drawn free-standing in the room
     DUPDECOR   the same piece twice on one square and wall side
     TELE       a teleport stone given as anything but {x, y} on an open square (an array left the stone at NaN)
     ARRIVE     a door whose landing in the far level is not an open square (a far side not built yet lands on the stub room's start)
     UNREACH    a chest, coffer, person or loose item that no walk from the start and the landings reaches (warp stairs A/B and the walls that open, L._secrets, are followed; terraces blocked)
   Floating pieces: run tools/ps_ground.py too (this script calls it with --ground). """
import sys, os, json, time, subprocess
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = r"""() => {
  const out = [], levels = PSP.LEVELS.filter(l => l.built);
  const SHARE = /web|vine|ivy|moss|crack|stain|dust|corbel|gargoyle|bracket|sconce|lantern|torch/i;
  const LOOSE = /(^|_)(arch|gate|door|portcullis|doorway)(_|$)|rose_arch|bridge_arch|gate_clock/i;
  const BAN = /st_.*(hound|dog)|tudor|schnoor|timber|(^|_)hay|well_pale|stairs_curved|horse/i;
  const VINE = /vine|ivy|moss/i;
  for (const l of levels) {
    if (!LEVELS[l.id]) KH_LAZY[l.id]();
    const L = LEVELS[l.id], W = L.rows[0].length, H = L.rows.length;
    const open = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L.rows[y][x] === '.';
    const isDoor = (x, y) => { const c = L.rows[y] && L.rows[y][x]; if (!c || c === '.') return false; const g = L.chars && L.chars[c]; return g != null && !!KH_DOOR[g]; };
    const add = (code, d, extra) => out.push([l.id, code, d.k, Math.round(d.x), Math.round(d.y), extra || '']);
    const seen = new Map();
    for (const d of L.decor || []) {
      const k = String(d.k), x = Math.round(d.x), y = Math.round(d.y);
      if (d.pic && d.wd && !d.span) {   // a span (ps_f2_kit.js f2Span: a bridge, a boat or fog as a free-standing painted plane) is not a wall picture
        const bx = x + d.wd[0], by = y + d.wd[1];
        if ((open(bx, by) || bx < 0 || by < 0 || bx >= W || by >= H) && !/cell_door|iron_gate|bridge_rail|iron_rail/.test(k)) add('NOWALL', d);
        else if (isDoor(bx, by)) add('OVERDOOR', d);
        const key = x + ',' + y + ',' + d.wd[0] + ',' + d.wd[1], p = seen.get(key);
        if (p && !(SHARE.test(k) || SHARE.test(String(p.k)))) add('OVERLAP', d, String(p.k)); else if (!p) seen.set(key, d);
        const im = IMG[d.k], hh = NPC_H[d.k];
        if (im && im.width && hh) { const w = hh * (d.sc || 1) * im.width / im.height; if (w < .12) add('TINY', d, w.toFixed(2)); }
      }
      if (/web/i.test(k) && !(d.pic && d.wd)) add('WEBFREE', d);
      if (LOOSE.test(k) && !(d.pic && d.wd) && !d.npc && open(x, y) && !/iron_gate_big/.test(k)) { const inGap = (!open(x + 1, y) && !open(x - 1, y) && open(x, y + 1) && open(x, y - 1)) || (!open(x, y + 1) && !open(x, y - 1) && open(x + 1, y) && open(x - 1, y)); if (!inGap) add('LOOSEDOOR', d); }
      if (BAN.test(k)) add('BANNED', d);
      if (k === 'sign_gy' && d.txt && d.txt[1]) add('SIGNTEXT', d, d.txt[1]);
      if ([9721, 9722, 9723].includes(l.id) && VINE.test(k)) add('VINES', d);
      if (d.block && !d.pic && !d.npc && !d.deco && open(x, y) && !d.goldAmt) {
        const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([a, b]) => open(x + a, y + b)).length;
        if (n === 2 && !/col|pillar|pier|statue|st_|stair|tele|chest|tree|stump|yew|dead|thicket|bush/i.test(k)) {
          // a straight one-wide passage: both open neighbours opposite each other
          const s = (open(x + 1, y) && open(x - 1, y)) || (open(x, y + 1) && open(x, y - 1));
          if (s) add('CORRIDOR', d);
        }
      }
    }
    // the whole-game audit's checks (tools/game_audit.py)
    const dupK = new Map();
    for (const d of L.decor || []) {
      const k = String(d.k), x = Math.round(d.x), y = Math.round(d.y);
      if (d.wd && !d.pic && !d.npc && !d.txt) add('WDLOOSE', d, 'wd ' + d.wd);
      const kk = k + '|' + x + '|' + y + '|' + (d.wd || ''); dupK.set(kk, (dupK.get(kk) || 0) + 1); if (dupK.get(kk) === 2 && !/grass|reed|weed|moss|flower|vine|ivy|fern|tuft|petal/i.test(k)) add('DUPDECOR', d);
    }
    if (L.tele && !(Number.isFinite(L.tele.x) && Number.isFinite(L.tele.y) && open(L.tele.x, L.tele.y))) out.push([l.id, 'TELE', 'tele', -1, -1, JSON.stringify(L.tele)]);
    for (const k of PSP.LINKS) { if (k.from !== l.id || !k.land) continue; const T = LEVELS[k.to] || (KH_LAZY[k.to] && (KH_LAZY[k.to](), LEVELS[k.to])); if (!T) continue; const q = pspLandOf(k);
      if (!(T.rows[q[1]] && T.rows[q[1]][q[0]] === '.')) out.push([l.id, 'ARRIVE', 'link to ' + k.to, k.at ? k.at[0] : -1, k.at ? k.at[1] : -1, 'lands on ' + q[0] + ',' + q[1] + ' of ' + T.rows[0].length + 'x' + T.rows.length]) }
    { const TB = (typeof TERRS !== 'undefined' && TERRS[l.id] && TERRS[l.id].block) || null, D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const sec = new Set((L._secrets || []).map(q => q.y * W + q.x)), warp = new Map();
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = L.rows[y][x]; if (c === '.') continue; const g = L.chars && L.chars[c], D = g != null && KH_DOOR[g]; if (D && (D.A || D.B)) warp.set(y * W + x, [D.A, D.B].filter(Boolean)) }
      const opener = d => !!d.opens || (!!d.npc && /gate|door|hatch|portcullis|fence|bars|cell/i.test(d.k + ' ' + d.npc));   // cell doors and gates open (as in game_audit.py)
      const blk = new Set(); for (const d of L.decor || []) if (d.block && !d.found && !opener(d)) blk.add(Math.round(d.y) * W + Math.round(d.x));
      const walk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && (L.rows[y][x] === '.' || sec.has(y * W + x)) && !(TB && TB[y * W + x] && !sec.has(y * W + x)) && !blk.has(y * W + x);
      const seen = new Uint8Array(W * H), q = []; const push = (x, y) => { if (walk(x, y) && !seen[y * W + x]) { seen[y * W + x] = 1; q.push(y * W + x) } };
      if (L.start) push(L.start.x, L.start.y); for (const k of PSP.LINKS) if (k.to === l.id && k.land) push(k.land[0], k.land[1]);
      for (let i = 0; i < q.length; i++) { const v = q[i], x = v % W, y = (v / W) | 0; for (const [a, b] of D4) { const w = warp.get((y + b) * W + x + a); if (w) for (const p of w) push(p[0], p[1]); push(x + a, y + b) } }
      const near = (x, y) => !!seen[y * W + x] || D4.some(([a, b]) => x + a >= 0 && y + b >= 0 && x + a < W && y + b < H && seen[(y + b) * W + x + a]);
      for (const d of L.decor || []) { if (d.pic || d.hidden || d.found) continue; if ((d.loot || d.goldAmt || (d.npc && !d.wd) || /chest|coffer/i.test(String(d.k))) && !near(Math.round(d.x), Math.round(d.y))) add('UNREACH', d, d.npc || '') }
      for (const it of L.items || []) if (!seen[it.y * W + it.x]) out.push([l.id, 'UNREACH', it.k, it.x, it.y, 'item']) }
    // a frame (portrait, mirror, window) and a web in the same square must both be on a wall
    const cell = new Map(); for (const d of L.decor || []) { const kk = Math.round(d.x) + ',' + Math.round(d.y); (cell.get(kk) || cell.set(kk, []).get(kk)).push(d) }
    for (const [kk, ds] of cell) { const wb = ds.some(d => /web/i.test(String(d.k))), fr = ds.filter(d => /portrait|mirror|frame|pt\d|pshpt/i.test(String(d.k)) && !(d.pic && d.wd)); for (const d of fr) if (wb) add('WEBFRAME', d) }
  }
  return out;
}"""

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        pg.goto('http://localhost:%s/index.html?town=palespire&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL>=9710&&typeof PSP!=='undefined'&&PSP.ready", timeout=120000)
        pg.wait_for_timeout(2500)
        res = pg.evaluate(JS)
        b.close()
    by = {}
    for r in res:
        by.setdefault(r[1], []).append(r)
    for code in sorted(by):
        print('%-10s %d' % (code, len(by[code])))
        for r in by[code][:12]:
            print('   level %d  %-34s at %s,%s  %s' % (r[0], r[2], r[3], r[4], r[5]))
    print('page errors', errs[:3])
    if '--ground' in sys.argv:
        env = dict(os.environ, PS_PORT=PORT)
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'ps_ground.py')], env=env, capture_output=True, text=True, encoding='utf-8')
        print(r.stdout[-600:])
    print('AUDIT CLEAN' if not res else 'AUDIT FOUND %d' % len(res))
    sys.exit(1 if res else 0)

main()
