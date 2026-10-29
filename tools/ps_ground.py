"""Grounding audit for the Pale Spire levels: finds sprites that float above the floor or sink into it, by data (not by screenshots).
   For every decor piece, and every creature, of every built castle level it scans the alpha of the picture actually used, finds the lowest
   visible row (the bottom transparent padding), and adds the piece's own lift (bob) and drop. The gap in world units is
       gap = padRows / pictureRows * pieceHeight + bob - drop - sink            (piece height = NPC_H * sc)
   A piece that is meant to hang is skipped (wall-mounted pictures pic:1 / wd, texts, lanterns, chandeliers, banners, webs, bells, flyers,
   things drawn 'over'). Anything else with gap > TOL floats, with gap < -TOL sinks.
   Env: PS_PORT (default 8621), BTA_CHROME, PS_TOL (default 0.05), PS_BODYTOL (default 0.14, the lift of the widest part of the picture, which catches a sitting figure whose feet touch but whose seat and wall float), PS_ONLY=9750,9780 to limit the levels, PS_ALL=1 to also list skipped hangers.
   Run on your own server from the repo root:  python -m http.server 8621 ; python tools/ps_ground.py
   Exit code 1 when anything is flagged."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
TOL = float(os.environ.get('PS_TOL', '0.05'))
BODYTOL = float(os.environ.get('PS_BODYTOL', '0.14'))   # the widest part of the picture (the base of a sitting figure or a plinth) must stand within this of the floor too
ONLY = [int(a) for a in os.environ.get('PS_ONLY', '').split(',') if a]

JS = """([id, tol, bodytol]) => {
  if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], out = [], cache = {};
  const HANG = /lantern|chandel|banner|cobweb|web_|^ps_web|vine|bracket|window|sconce|mirror|portrait|tapestry|clock_face|bell|moon|bat_|sign_|corbel|ledge|hanging|pans_hanging|chains$|plaque|candles_glow|lantern_red|rose_arch|flame|torch|glow|mark|rune/;
  const pad = k => { if (k in cache) return cache[k]; const im = IMG[k]; let r = null;
    try { if (im && im.width) { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data; let last = -1, mx = 0; const cnt = [];
      for (let y = 0; y < c.height; y++) { let n = 0; for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 40) n++; cnt.push(n); if (n > mx) mx = n }
      for (let y = c.height - 1; y >= 0 && last < 0; y--) if (cnt[y] >= Math.max(2, c.width * .004)) last = y;
      let base = -1; for (let y = c.height - 1; y >= 0 && base < 0; y--) if (cnt[y] >= mx * .4) base = y;
      r = last < 0 ? null : [(c.height - 1 - last) / c.height, (c.height - 1 - base) / c.height] } } catch (e) {} return cache[k] = r };
  for (const d of L.decor) {
    const k = d.k, why = d.pic || d.wd ? 'wall-mounted' : (d.walk && d.deco && (d.bob || 0) <= .12) ? 'ghost hovering' : d.over ? 'over' : HANG.test(k) ? 'hanger by name' : d.fly ? 'flyer' : null;
    const pp = pad(k); if (pp === null) continue; const p = pp[0];
    const H = (NPC_H[k] || 1) * (d.sc || 1), gap = p * H + (d.bob || 0), body = pp[1] * H + (d.bob || 0);
    if (why) { if (typeof PS_ALL !== 'undefined') out.push({k, x: d.x, y: d.y, gap: +gap.toFixed(3), skip: why}); continue }
    if (Math.abs(gap) > tol) out.push({k, x: d.x, y: d.y, gap: +gap.toFixed(3), pad: +p.toFixed(3), H: +H.toFixed(2), bob: d.bob || 0, sc: d.sc || 1, ghost: !!d.walk && !!d.deco})
    else if (body > bodytol && /skeleton|slump|seated|corpse|shackled|prisoner|sitting|dead/.test(k)) out.push({k, x: d.x, y: d.y, gap: +body.toFixed(3), pad: +pp[1].toFixed(3), H: +H.toFixed(2), bob: d.bob || 0, sc: d.sc || 1, soft: 1})
  }
  for (const e of L.enemies) { const def = ENEMY_DEF[e.t || e.type || e.k]; const k = def && def.img; if (!k) continue; const pp = pad(k); if (pp === null) continue; const p = pp[0];
    const H = NPC_H[k] || (def && def.ph) || 1.6, gap = p * H; if (def.fly || def.float || def.hover) continue; if (Math.abs(gap) > tol) out.push({k, x: e.x, y: e.y, gap: +gap.toFixed(3), pad: +p.toFixed(3), H: +H.toFixed(2), creature: 1}) }
  return out }"""


def main():
    bad = 0
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        pg.goto('http://localhost:%s/index.html?town=palespire&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9710&&typeof PSP!=='undefined'&&PSP.ready", timeout=90000)
        pg.wait_for_timeout(1500)
        if os.environ.get('PS_ALL'): pg.evaluate("() => { window.PS_ALL = 1 }")
        built = pg.evaluate("() => PSP.LEVELS.filter(l => l.built).map(l => l.id)")
        for id_ in [i for i in built if not ONLY or i in ONLY]:
            r = pg.evaluate(JS, [id_, TOL, BODYTOL])
            flagged = [o for o in r if 'skip' not in o]
            print('level %d: %d flagged' % (id_, len(flagged)))
            for o in sorted(flagged, key=lambda o: -abs(o['gap'])):
                print('   %-34s %3d,%-3d gap %+.2f (pad %.2f, h %.2f, bob %.2f, sc %.2f)%s' % (o['k'], o['x'], o['y'], o['gap'], o['pad'], o['H'], o['bob'], o['sc'], (' CREATURE' if o.get('creature') else '') + (' BASE-FLOATS (body base, not the feet)' if o.get('soft') else '')))
            bad += len(flagged)
        b.close()
    print('TOTAL flagged', bad)
    sys.exit(1 if bad else 0)


main()
