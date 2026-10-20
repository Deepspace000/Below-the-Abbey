"""Makes a COLOUR THEME of a painted button style: assets/ui/<newstyle>/ gets all the slab pictures of a source style, recoloured,
and a manifest copied from the source with a new label (the manifest is written last, so tools/inject.py never sees a half-made style).

    python tools/recolor_ui.py <source-folder> <theme> [--out <folder>] [--label <text>] [--debug]
    python tools/recolor_ui.py --all                     # the twelve themes of the three bases below
    bases:   gold (plain tapered bars), filigree_gold (pointed ends with jewels), winged_gold (carved wings)
    themes:  ruby, green (dark green), brown (dark brown), turquoise

Not a flat hue shift. Every slab is split into TRIM (the frame, the end blocks with their rivets, the filigree, the wings: gold, brass or silver
metal) and PLATE (the recessed middle, found with a hand-measured outline per slab family, feathered). The luminance of the plate is
separated into a smooth part (the lit / pressed shading and the glow of a state) and a fine part (grain, cracks, chips); both are kept, rescaled,
and mapped through a 5 stop colour ramp of the theme, so the carving still shows. Each theme adds what its material has:
  ruby       cut facets (8 directions, from the distance to the plate's rim) with light from the upper left, an inner glow, a glassy streak,
             deep garnet shadows and pinkish-white highlights
  green      malachite bands and a polished sheen
  brown      long walnut grain
  turquoise  mottling and a web of dark matrix veins
The trim goes through a gold (or brass, or silver) ramp with the original shading, so the bevels stay crisp. The rivets and the jewels keep their own colours.
The manifest gets "ink":"light" where the slab is dark (the lettering is then pale forged metal, see stbLabel in src/desert/stonebuttons.js),
and a winged style falls back to the matching plain colour style. Run python tools/inject.py afterwards.
"""
import sys, json, pathlib, argparse
import numpy as np, cv2
from PIL import Image, ImageDraw
cv2.setNumThreads(2)

ROOT = pathlib.Path(__file__).resolve().parent.parent
UI = ROOT / 'assets' / 'ui'
STATES = ['n', 'l', 'p']

# ------------------------------------------------------------------ outlines of the plate (the recessed middle), measured on the source slabs
def _poly_mask(w, h, pts, ss=4):
    im = Image.new('L', (w * ss, h * ss), 0)
    ImageDraw.Draw(im).polygon([(x * ss, y * ss) for x, y in pts], fill=255)
    return np.asarray(im.resize((w, h), Image.BOX), np.float32) / 255

def _rrect_mask(w, h, x0, y0, x1, y1, r, ss=4):
    im = Image.new('L', (w * ss, h * ss), 0)
    ImageDraw.Draw(im).rounded_rectangle([x0 * ss, y0 * ss, x1 * ss, y1 * ss], radius=r * ss, fill=255)
    return np.asarray(im.resize((w, h), Image.BOX), np.float32) / 255

def _chaikin(pts, n=3):
    for _ in range(n):
        q = []
        for i in range(len(pts) - 1):
            (ax, ay), (bx, by) = pts[i], pts[i + 1]
            q += [(.75 * ax + .25 * bx, .75 * ay + .25 * by), (.25 * ax + .75 * bx, .25 * ay + .75 * by)]
        pts = [pts[0]] + q + [pts[-1]]
    return pts

def _symm(left, w):   # the left half of an outline (top to bottom) mirrored about the middle of the slab
    left = _chaikin(left)
    return left + [(w - x, y) for x, y in reversed(left)]

def plate_mask(base, fam, w, h):
    if base == 'gold':
        return _rrect_mask(w, h, 127, 26, w - 126, 236, 14)
    if base == 'winged_gold':
        if fam == 'std':
            c = 18; x0, y0, x1, y1 = 194, 63, w - 194, 277
        else:
            c = 20; x0, y0, x1, y1 = 33, 33, w - 33, 241
        return _poly_mask(w, h, [(x0 + c, y0), (x1 - c, y0), (x1, y0 + c), (x1, y1 - c), (x1 - c, y1), (x0 + c, y1), (x0, y1 - c), (x0, y0 + c)])
    if base == 'filigree_gold':
        if fam == 'std':
            L = [(172, 17), (158, 21), (146, 31), (136, 45), (126, 62), (117, 80), (112, 100), (117, 120), (126, 138), (136, 155), (146, 169), (158, 179), (172, 183)]
        else:
            L = [(98, 17), (86, 22), (76, 34), (68, 50), (62, 68), (59, 84), (58, 100), (59, 116), (62, 132), (68, 150), (76, 166), (86, 178), (98, 183)]
        return _poly_mask(w, h, _symm(L, w))
    raise SystemExit('no plate outline for ' + base)

def keep_mask(base, fam, w, h, rgb):
    """pixels that keep their own colour: the iron rivets of the gold base, the red jewels of the filigree base"""
    k = np.zeros((h, w), np.float32)
    if base == 'gold':
        yy, xx = np.mgrid[0:h, 0:w]
        for cx in (72, w - 73):
            d = np.hypot(xx - cx, yy - 130)
            k = np.maximum(k, np.clip((27 - d) / 3, 0, 1))
    if base == 'filigree_gold':
        hsv = cv2.cvtColor((rgb * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
        hue, sat, val = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
        red = ((hue > 335) | (hue < 14)) & (sat > .55) & (val > .12)
        red = cv2.dilate(red.astype(np.uint8), np.ones((5, 5), np.uint8))
        k = cv2.GaussianBlur(red.astype(np.float32), (0, 0), 1.2)
        k[:, int(w * .33):int(w * .67)] = 0       # the jewels are at the ends only
    return k

# ------------------------------------------------------------------ colour ramps
def ramp(stops, n=1024):
    p = np.array([s[0] for s in stops]); c = np.array([s[1] for s in stops], np.float32) / 255
    t = np.linspace(0, 1, n)
    return np.stack([np.interp(t, p, c[:, i]) for i in range(3)], -1).astype(np.float32)

def lookup(lut, v):
    return lut[np.clip((v * (len(lut) - 1)).astype(np.int32), 0, len(lut) - 1)]

GOLD = [(0, (34, 18, 5)), (.28, (108, 72, 18)), (.55, (190, 142, 46)), (.8, (236, 200, 104)), (1, (252, 240, 188))]
BRASS = [(0, (26, 14, 6)), (.28, (84, 54, 20)), (.55, (150, 106, 44)), (.8, (208, 164, 92)), (1, (240, 216, 158))]
SILVER = [(0, (22, 26, 32)), (.28, (82, 92, 102)), (.55, (156, 166, 176)), (.8, (208, 216, 224)), (1, (246, 249, 252))]

THEMES = {
    'ruby': dict(label='Ruby', plain='ruby', ink='light', trim=GOLD,
                 plate=[(0, (28, 2, 10)), (.2, (80, 5, 24)), (.42, (158, 10, 40)), (.62, (204, 22, 52)), (.8, (240, 72, 92)), (.92, (255, 168, 176)), (1, (255, 238, 238))]),
    'green': dict(label='Dark green', plain='green', ink='light', trim=GOLD,
                  plate=[(0, (4, 16, 9)), (.25, (11, 42, 24)), (.5, (26, 80, 42)), (.75, (56, 122, 64)), (.92, (122, 170, 118)), (1, (204, 224, 196))]),
    'brown': dict(label='Dark brown', plain='brown', ink='light', trim=BRASS,
                  plate=[(0, (14, 8, 5)), (.25, (38, 22, 13)), (.5, (80, 49, 28)), (.75, (124, 82, 48)), (.92, (176, 132, 86)), (1, (222, 188, 142))]),
    'turquoise': dict(label='Turquoise', plain='turquoise', ink=None, trim=SILVER,
                      plate=[(0, (6, 50, 54)), (.25, (16, 104, 108)), (.5, (46, 176, 168)), (.75, (108, 222, 206)), (.92, (186, 244, 232)), (1, (236, 255, 250))]),
}
# the facets of the ruby reach 60 source px in from the rim, so on the plain bars the caps (copied 1:1, the middle is cropped or repeated mirrored) must be wider
# than in the source, or a facet corner would be cut by the seam; every other slab already has caps that are wide enough
CAP = {('gold', 'ruby'): .76}
LABELS = {'gold': '', 'filigree_gold': 'Filigree ', 'winged_gold': 'Winged '}
THEME_LABEL = {'ruby': 'ruby', 'green': 'green', 'brown': 'brown', 'turquoise': 'turquoise'}
BASES = {'gold': '', 'filigree_gold': 'filigree_', 'winged_gold': 'winged_'}

# ------------------------------------------------------------------ textures (deterministic)
def fbm(h, w, sigmas, seed, weights=None, aniso=None):
    rs = np.random.RandomState(seed); out = np.zeros((h, w), np.float32); weights = weights or [1] * len(sigmas)
    for i, s in enumerate(sigmas):
        n = rs.randn(h, w).astype(np.float32)
        sx, sy = (s, s) if aniso is None else (s * aniso, s)
        n = cv2.GaussianBlur(n, (0, 0), sigmaX=sx, sigmaY=sy)
        n /= n.std() + 1e-6
        out += weights[i] * n
    return out / (np.sqrt(sum(x * x for x in weights)) + 1e-6)

def blur(a, s):
    return cv2.GaussianBlur(a, (0, 0), s)

def sym(a):
    """mirror-symmetric about the middle of the slab (the left and right cap then agree where they meet the middle, which flat() makes constant)"""
    return (a + a[:, ::-1]) / np.sqrt(2)

def flat(a, capx):
    """stbFace cuts a slab into two caps and a middle that is cropped or repeated (mirrored): whatever varies smoothly along x in the middle shows as a
    step where the middle meets a cap. So every smooth quantity is made constant along x between the two caps (the average of the columns where the caps end)."""
    cc = int(round(capx)); h, w = a.shape
    if cc <= 0 or w - 2 * cc < 2: return a
    a = a.copy(); a[:, cc:w - cc] = ((a[:, cc] + a[:, w - 1 - cc]) / 2)[:, None]
    return a

# ------------------------------------------------------------------ the recolouring
def recolour(base, fam, st, rgb, alpha, theme, ref, seed, capx=0):
    T = THEMES[theme]; h, w = alpha.shape
    Y = rgb @ np.array([.299, .587, .114], np.float32)
    pm = blur(plate_mask(base, fam, w, h), 1.3)                    # the plate, feathered
    pb = pm > .5
    km = keep_mask(base, fam, w, h, rgb)
    # --- trim: the original shading through a metal ramp
    lo, hi = (.22, .90) if base != 'winged_gold' else (.30, .98)
    Yt = np.clip((Y - lo) / (hi - lo), 0, 1)
    Yt = np.clip(.5 + (Yt - .5) * 1.18, 0, 1)
    trim = lookup(ramp(T['trim']), Yt)
    # --- plate: smooth shading + fine grain, rescaled around the reference level of the normal state
    low12 = blur(Y, 12); base_low = (low12 + low12[:, ::-1]) / 2             # the shading, mirrored so that the two ends agree (the source is lit a little from the right)
    fine = blur(Y, 1.4) - low12                                             # grain, cracks, chips (the pixel noise of the stone is left out)
    gl = 1.25
    gh = {'ruby': .55, 'green': 1.0, 'brown': .9, 'turquoise': .9}[theme] * (1.35 if base == 'winged_gold' else 1.0)
    Yn = .5 + flat((base_low - ref) * gl, capx) + fine * gh + {'ruby': -.08, 'green': -.06, 'brown': -.08, 'turquoise': 0}[theme]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ys, xs = np.where(pb)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    hw, hh = (xs.max() - xs.min()) / 2, (ys.max() - ys.min()) / 2
    dist = cv2.distanceTransform(pb.astype(np.uint8), cv2.DIST_L2, 5)        # how far inside the plate
    top = np.exp(-((yy - (cy - hh * .62)) / (hh * .15)) ** 2) * (dist > 26)  # a polished sheen along the upper part
    if theme == 'ruby':
        # inner glow: light coming through, brightest a little above and left of the middle
        rr = ((xx - cx) / (hw * .9)) ** 2 + ((yy - cy + hh * .12) / (hh * 1.0)) ** 2
        Yn += flat(.20 * np.exp(-rr * 1.3) - .03, capx) - .08 * (yy - cy) / hh        # glow, and the light dies away towards the bottom
        Yn = np.where(Yn > .6, .6 + (Yn - .6) * .5, Yn)                         # the lit state glows but stays red, so the lettering keeps its contrast
        # cut facets: the rim of the plate is a step cut in 8 directions, lit from the upper left
        ds = blur(dist, 2.5); gy, gx = np.gradient(ds)
        ang = np.arctan2(-gy, -gx)                                              # direction of the outward normal
        q = np.round(ang / (np.pi / 4)) * (np.pi / 4)
        lx, ly = -.42, -.91; ln = np.hypot(lx, ly); lx, ly = lx / ln, ly / ln
        shade = np.cos(q) * lx + np.sin(q) * ly
        fw = hh * .30
        qb = (np.round((ang + np.pi / 8) / (np.pi / 4)) - .5) * (np.pi / 4)
        shade2 = np.cos(qb) * lx + np.sin(qb) * ly
        rowA = dist < fw * .5; rowB = (dist >= fw * .5) & (dist < fw)
        fac = np.where(rowA, .46 * shade - .04, np.where(rowB, .30 * shade2, 0.0)).astype(np.float32)
        Yn += fac
        edge = np.exp(-((dist - fw) / 2.6) ** 2) + .6 * np.exp(-((dist - fw * .5) / 2.2) ** 2)    # bright arrises between the facets
        Yn += .11 * edge * (1 - .5 * (dist < fw * .5))
        # a soft glassy streak across the table
        dgl = np.abs(xx - cx) * .55 + (yy - cy)
        Yn += flat(.08 * np.exp(-((dgl + hh * .55) / (hh * .22)) ** 2), capx) * (dist > fw * .6)
        Yn += .04 * top + .10 * np.exp(-((yy - (cy - hh * .5)) / (hh * .07)) ** 2) * (dist > fw * .55)    # the window reflected in a polished stone
    elif theme == 'green':
        n1 = sym(fbm(h, w, [60, 26], seed + 1, [1, .5]))
        bands = np.sin((n1 * 1.5 + (np.abs(xx - cx) * .5 + yy) / 120.0) * 2 * np.pi) * .5 + .5   # malachite: wide wavy bands
        Yn += .13 * flat(bands - .5, capx) + .03 * fbm(h, w, [5, 2.5], seed + 2, [1, .6])
        Yn += .05 * top
    elif theme == 'brown':
        gr = flat(sym(fbm(h, w, [5, 2.5], seed + 3, [1, .6], aniso=26)), capx)       # long grain: the same rows all along the middle
        gs = fbm(h, w, [3, 1.5], seed + 9, [1, .6], aniso=5)                          # short flecks on top, so the rows are not ruled lines
        Yn += .085 * gr + .045 * gs + .03 * flat(sym(fbm(h, w, [30], seed + 4, aniso=5)), capx)
        Yn += .04 * top
    elif theme == 'turquoise':
        Yn += .06 * flat(sym(fbm(h, w, [36, 18], seed + 5, [1, .7])), capx) + .06 * fbm(h, w, [10, 5], seed + 10, [1, .7])
        Yn += .04 * top
    Yn = np.clip(Yn, 0, 1)
    plate = lookup(ramp(T['plate']), Yn)
    if theme == 'turquoise':    # matrix: a web of thin dark veins
        v1 = fbm(h, w, [20], seed + 6); v2 = fbm(h, w, [10], seed + 7)
        web = np.exp(-(v1 / .05) ** 2) * .8 + np.exp(-(v2 / .035) ** 2) * .4
        web *= np.clip(blur(fbm(h, w, [60], seed + 8), 8) * .6 + .55, 0, 1.0)      # the web is thick in some places and gone in others
        web = np.clip(web, 0, 1)[..., None]
        vein = np.array([58, 52, 40], np.float32) / 255
        plate = plate * (1 - .45 * web) + vein * .45 * web
    # --- put the two together, bring back rivets and jewels
    pm3 = pm[..., None]
    out = trim * (1 - pm3) + plate * pm3
    if km.any():
        out = out * (1 - km[..., None]) + rgb * km[..., None]
    return np.clip(out, 0, 1)

def refs(base, fam, rgb, alpha, capx=0):
    h, w = alpha.shape
    pm = plate_mask(base, fam, w, h) > .5
    Y = rgb @ np.array([.299, .587, .114], np.float32)
    bl = blur(Y, 12); bl = (bl + bl[:, ::-1]) / 2
    return float(flat(bl, capx)[pm].mean())

def debug_overlay(src, base, out):
    """the outline of the plate in magenta on the normal pictures of both families, for checking the measurements"""
    tiles = []
    for fam in ('std', 'small'):
        fn = src / ('stone_%s_n.webp' % fam)
        if not fn.exists(): continue
        im = Image.open(fn).convert('RGBA'); w, h = im.size
        m = plate_mask(base, fam, w, h); a = np.array(Image.new('RGBA', im.size, (40, 30, 26, 255)))
        bg = Image.new('RGBA', im.size, (40, 30, 26, 255)); bg.alpha_composite(im); a = np.array(bg.convert('RGB'))
        e = (cv2.dilate((m > .5).astype(np.uint8), np.ones((3, 3), np.uint8)) - cv2.erode((m > .5).astype(np.uint8), np.ones((3, 3), np.uint8))) > 0
        a[e] = (255, 0, 255); tiles.append(Image.fromarray(a))
    W = max(t.width for t in tiles); H = sum(t.height + 6 for t in tiles)
    sh = Image.new('RGB', (W, H), (0, 0, 0)); y = 0
    for t in tiles: sh.paste(t, (0, y)); y += t.height + 6
    sh.save(out)

def make(src_name, theme, out_name=None, label=None, only=None):
    src = UI / src_name
    base = src_name
    if base not in BASES: raise SystemExit('source must be one of ' + ', '.join(BASES))
    out_name = out_name or BASES[base] + THEMES[theme]['plain']
    man = json.loads((src / 'manifest.json').read_text())
    dst = UI / out_name; dst.mkdir(parents=True, exist_ok=True)
    T = THEMES[theme]
    seed0 = sum(ord(c) for c in out_name) * 7
    for key, ent in man['files'].items():
        if only and key not in only: continue
        fam, st = key.split('_')
        im = Image.open(src / ent['file']).convert('RGBA'); a = np.asarray(im, np.float32) / 255
        rgb, al = a[..., :3], a[..., 3]
        nrm = np.asarray(Image.open(src / man['files'][fam + '_n']['file']).convert('RGBA'), np.float32) / 255
        Fm = man['fam'][fam]; capx = CAP.get((base, theme), Fm['cap']) * Fm['bh'] + Fm['wl']   # where the left cap ends, in source px
        ref = refs(base, fam, nrm[..., :3], nrm[..., 3], capx)
        res = recolour(base, fam, st, rgb, al, theme, ref, seed0 + (1 if fam == 'std' else 2) * 101, capx)
        pic = np.dstack([(res * 255 + .5).astype(np.uint8), (al * 255 + .5).astype(np.uint8)])
        Image.fromarray(pic, 'RGBA').save(dst / ent['file'], quality=92, method=6, lossless=False)
        print(out_name, key, im.size)
    write_manifest(base, theme, out_name, label)

def write_manifest(base, theme, out_name=None, label=None):
    """the manifest of a theme style: the source manifest with a new label, the ink, and (winged) the matching plain colour as fallback"""
    T = THEMES[theme]; out_name = out_name or BASES[base] + T['plain']
    man = json.loads((UI / base / 'manifest.json').read_text())
    man['label'] = label or (T['label'] if base == 'gold' else LABELS[base] + THEME_LABEL[theme])
    if T['ink']: man['ink'] = T['ink']
    else: man.pop('ink', None)
    if man.get('fallback'): man['fallback'] = T['plain']
    if (base, theme) in CAP:
        for f in man['fam'].values(): f['cap'] = CAP[(base, theme)]
    (UI / out_name / 'manifest.json').write_text(json.dumps(man, indent=1))
    print('wrote', UI / out_name / 'manifest.json', man['label'])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source', nargs='?'); ap.add_argument('theme', nargs='?')
    ap.add_argument('--out'); ap.add_argument('--label'); ap.add_argument('--debug', action='store_true'); ap.add_argument('--all', action='store_true')
    ap.add_argument('--themes'); ap.add_argument('--bases'); ap.add_argument('--only'); ap.add_argument('--manifests', action='store_true')
    a = ap.parse_args()
    if a.debug:
        for b in (a.bases.split(',') if a.bases else BASES):
            debug_overlay(UI / b, b, a.out or ('plate_%s.png' % b))
        return
    if a.manifests:
        for b in BASES:
            for t in THEMES: write_manifest(b, t)
        return
    if a.all:
        for b in (a.bases.split(',') if a.bases else BASES):
            for t in (a.themes.split(',') if a.themes else THEMES):
                make(b, t, only=a.only.split(',') if a.only else None)
        return
    if not a.source or a.theme not in THEMES: raise SystemExit(__doc__)
    make(a.source, a.theme, a.out, a.label, only=a.only.split(',') if a.only else None)

if __name__ == '__main__':
    main()
