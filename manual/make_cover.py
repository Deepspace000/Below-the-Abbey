"""Rebuilds both covers of Below the Abbey from the painting and the painted title logo:

    python manual/make_cover.py            the clean covers
    python manual/make_cover.py --grime    the GRIMY covers (never replaces the clean ones), plus the comparison picture

  -> manual/showcase/game_cover.png   1260x1000 (5:4), the itch.io cover image. itch shows it at 630x500 and crops its
                                      thumbnails, so the logo and the four heroes stay in the middle of the picture.
  -> manual/cover_front.png           1800x2700 (6:9, 300 dpi), the front cover of the printed manual, full bleed.
                                      manual/set_cover.py and manual/build.py put it on page 1.
  --grime writes instead
  -> manual/showcase/game_cover_grimy.png   the same cover, dirty, aged and gritty like a battered old dungeon box
  -> manual/cover_front_grimy.png           the same for the manual front cover
  -> manual/showcase/cover_compare.png      clean game cover | grimy game cover | grimy manual cover, labelled
  The grime is all procedural (PIL and numpy, no outside images) with fixed seeds, so every run gives the same covers.
  The tuning knobs are in the GRIME block below (GRIME dict at its top).

Inputs
  assets/ui/title_logo.webp           the painted title logo (transparent). It is loaded fresh on every run and the layout
                                      follows its real shape, so when the title artist enlarges the A just run this again.
  manual/cover_art/landscape.jpg      Gemini painting, 4:3, no lettering anywhere (the heroes of the old cover, new scene).
  manual/cover_art/portrait.jpg       OPTIONAL Gemini painting, 3:4 or 2:3. If it is missing the portrait cover is cut from
                                      landscape.jpg.
Both paintings are laid out by the CONFIG below: 'ph' is the height the painting is drawn at, 'delta' is how many pixels of
sky are synthesised ABOVE it (the painting's own top rows, mirrored, blurred and darkened) to give the logo room. When a
painting is regenerated with real open sky in its top 40 percent, set delta to 0 and ph to the canvas height.

How the landscape painting was made (Gemini, Create image, 4:3, new chat): upload manual/cover.jpg cropped to the four heroes
with the old title text and frame removed (manual/cover_art/ref_heroes.png; the whole old cover makes Gemini copy the old frame
and the baked-in signature),
then ask for a WIDE establishing shot of the same four heroes descending mossy crypt steps, skeletons at their feet, ruined
abbey tower, stormy orange and purple sunset, dead trees, calm empty sky in the top third, no frame, NO TEXT / LETTERS / LOGO.
Better next time: ask for the heroes lower (heads at 55 percent of the height) and the top 45 percent open sky.
"""
import os, sys, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO = os.path.join(ROOT, 'assets', 'ui', 'title_logo.webp')
ART_L = os.path.join(HERE, 'cover_art', 'landscape.jpg')
ART_P = os.path.join(HERE, 'cover_art', 'portrait.jpg')
OUT_GAME = os.path.join(HERE, 'showcase', 'game_cover.png')
OUT_FRONT = os.path.join(HERE, 'cover_front.png')
OUT_GAME_GRIMY = os.path.join(HERE, 'showcase', 'game_cover_grimy.png')
OUT_FRONT_GRIMY = os.path.join(HERE, 'cover_front_grimy.png')
OUT_COMPARE = os.path.join(HERE, 'showcase', 'cover_compare.png')
FONT = 'C:/Windows/Fonts/OLDENGL.TTF'
GOLD_HI, GOLD_LO, GOLD_RULE = (250, 228, 160), (203, 152, 64), (222, 184, 92)

# ---- layout ---------------------------------------------------------------------------------------------------
GAME = dict(W=1260, H=1000,
            ph=941, delta=150, cx=0.575,             # painting drawn 941 px high, 150 px of sky added on top, the bottom 91 px cut off
            logo_w=820, logo_top=32, logo_max_h=342,  # the logo is shrunk if the A makes it taller than logo_max_h
            top_shade=.40, vignette=.30,
            band=(740, 880, .86),                    # dark band: fades in from y=740 to 880 to an opacity of .86
            lines=[('Grid-Movement, Turn-Based RPG', 50, 897), ('Bickering Goat Studios', 30, 953)],
            frame=(13, 22),
            # grime mode only: the heroes (centre x, centre y, radius x, radius y as canvas fractions) stay cleaner, the
            # creases (vertical x, horizontal y as canvas fractions), the finger smudges (x, y as canvas fractions)
            hero=(.55, .62, .33, .34), creases=(.545, .80), tears=5,
            prints=[(.055, .90), (.935, .925), (.915, .19), (.065, .33), (.50, .958), (.80, .60)])
FRONT = dict(W=1800, H=2700,
             ph=2560, delta=140, cx=0.545,
             logo_w=1440, logo_top=104, logo_max_h=660,
             top_shade=.40, vignette=.32,
             band=(2120, 2290, .84),
             lines=[('Grid-Movement, Turn-Based RPG', 74, 2322), ('The Instruction Manual', 118, 2468), ('Bickering Goat Studios', 50, 2566)],
             rule_y=2386, frame=(52, 70),
             hero=(.50, .53, .55, .32), creases=(.665, .80), tears=7,
             prints=[(.075, .935), (.925, .95), (.93, .30), (.065, .21), (.50, .972), (.90, .70), (.10, .60)])


def clamp(v, a, b):
    return max(a, min(b, v))


def extend_top(img, delta):
    """Adds `delta` px of sky above the painting. The extra rows are the painting's own top rows mirrored about the top edge
    (so colour and brightness are continuous at the seam), blurred more and more with distance, darkened toward a stormy
    violet and given a little cloud variation and grain, so nothing in them reads as a copy."""
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    h, w, _ = a.shape
    strip = Image.fromarray(a[:delta].astype(np.uint8))             # row 0 is the painting's top row, i.e. the row next to the seam
    sig = [0, 3, 8, 16, 30]
    stack = [np.asarray(strip.filter(ImageFilter.GaussianBlur(s)) if s else strip).astype(np.float32) for s in sig]
    t = np.linspace(0, 1, delta, dtype=np.float32)                   # distance from the seam, 0..1
    pos = (t ** .8) * (len(sig) - 1)
    i0 = np.floor(pos).astype(int).clip(0, len(sig) - 2)
    f = pos - i0
    out = np.stack([stack[i0[k]][k] * (1 - f[k]) + stack[i0[k] + 1][k] * f[k] for k in range(delta)])
    rng = np.random.default_rng(11)
    cloud = rng.normal(0, 1, (delta // 10 + 3, w // 10 + 3)).astype(np.float32)
    cloud = np.asarray(Image.fromarray(cloud).resize((w, delta), Image.BICUBIC))
    out = out * (1 + .07 * cloud[..., None] * t[:, None, None]) + rng.normal(0, 2.6, (delta, w, 1)).astype(np.float32)
    dark = np.array([20, 14, 30], np.float32)
    k = (.62 * t ** 1.15)[:, None, None]
    out = out * (1 - k) + dark * k
    return Image.fromarray(np.concatenate([out[::-1], a]).clip(0, 255).astype(np.uint8))


def make_art(path, cfg):
    """The painting laid out on the canvas: scaled to ph high, sky added on top, cut to W x H around the heroes."""
    W, H, ph, delta = cfg['W'], cfg['H'], cfg['ph'], cfg['delta']
    art = Image.open(path).convert('RGB')
    pw = round(art.width * ph / art.height)
    assert pw >= W and ph + delta >= H, 'painting too small for the canvas: raise ph'
    art = art.resize((pw, ph), Image.LANCZOS)
    if ph > Image.open(path).height:                           # the painting is being enlarged: keep it from going soft
        art = up_sharpen(art)
    if delta:
        art = extend_top(art, delta)
    x0 = int(clamp(cfg['cx'] * pw - W / 2, 0, pw - W))
    art = art.crop((x0, 0, x0 + W, H))
    return art


def up_sharpen(im):
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=28, threshold=3))


def shade(im, cfg):
    """A storm-dark top (so the logo reads) and a soft vignette."""
    a = np.asarray(im).astype(np.float32)
    H, W, _ = a.shape
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    x = np.linspace(-1, 1, W, dtype=np.float32)[None, :]
    top = 1 - cfg['top_shade'] * np.clip(1 - y / .50, 0, 1) ** 1.4
    r = np.sqrt((x * 1.0) ** 2 + ((y - .5) * 2 * .9) ** 2) / 1.35
    vig = 1 - cfg['vignette'] * np.clip(r, 0, 1) ** 3
    m = (top * vig)[..., None]
    tint = np.array([14, 10, 26], np.float32)
    a = a * m + tint * (1 - m) * .35
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def band(im, cfg):
    """A dark translucent band at the foot of the cover for the lettering."""
    y0, y1, op = cfg['band']
    a = np.asarray(im).astype(np.float32)
    H = a.shape[0]
    y = np.arange(H, dtype=np.float32)
    al = np.clip((y - y0) / max(1, (y1 - y0)), 0, 1)
    al = (al * al * (3 - 2 * al) * op)[:, None, None]
    a = a * (1 - al) + np.array([8, 6, 12], np.float32) * al
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def load_logo():
    for _ in range(12):                                       # the title artist may be writing the file just now
        try:
            im = Image.open(LOGO); im.load(); return im.convert('RGBA')
        except Exception:
            time.sleep(1.0)
    raise SystemExit('cannot read ' + LOGO)


def fit_logo(cfg):
    """The current title logo, scaled to the layout: returns the RGBA image and the (x, y) it is pasted at."""
    logo = load_logo()                                        # always fresh: the A may have been enlarged
    src_w = logo.width
    w = cfg['logo_w']
    h = round(logo.height * w / logo.width)
    if h > cfg['logo_max_h']:
        h = cfg['logo_max_h']; w = round(logo.width * h / logo.height)
    logo = logo.resize((w, h), Image.LANCZOS)                 # Pillow resizes RGBA premultiplied, so no dark fringes
    if w > src_w:                                              # enlarged: sharpen the colour, leave the edge alpha alone
        a = logo.getchannel('A')
        logo = up_sharpen(logo.convert('RGB')).convert('RGBA'); logo.putalpha(a)
    return logo, ((cfg['W'] - w) // 2, cfg['logo_top'])


def put_logo(canvas, cfg):
    logo, (x, y) = fit_logo(cfg)
    w, h = logo.size
    W, H = canvas.size
    al = Image.new('L', (W, H), 0)
    al.paste(logo.getchannel('A'), (x, y))
    # soft dark glow behind the letters: a wide halo and a tight one
    wide = al.filter(ImageFilter.GaussianBlur(w * .06)).point(lambda v: min(255, int(v * 2.1)))
    tight = al.filter(ImageFilter.GaussianBlur(w * .014)).point(lambda v: min(255, int(v * 2.6)))
    halo = np.maximum(np.asarray(wide).astype(np.float32) * .62, np.asarray(tight).astype(np.float32) * .85)
    layer = Image.new('RGBA', (W, H), (10, 7, 14, 0))
    layer.putalpha(Image.fromarray(halo.clip(0, 255).astype(np.uint8)))
    canvas = Image.alpha_composite(canvas, layer)
    top = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    top.paste(logo, (x, y), logo)
    return Image.alpha_composite(canvas, top), (x, y, w, h)


def gold_text(canvas, text, size, cx, cy):
    font = ImageFont.truetype(FONT, size)
    l, t, r, b = font.getbbox(text)
    pad = int(size * .7)
    tw, th = r - l, b - t
    tile = (tw + 2 * pad, th + 2 * pad)
    pos = (pad - l, pad - t)
    fill = Image.new('L', tile, 0); ImageDraw.Draw(fill).text(pos, text, font=font, fill=255)
    sw = max(2, size // 20)
    edge = Image.new('L', tile, 0); ImageDraw.Draw(edge).text(pos, text, font=font, fill=255, stroke_width=sw)
    sh = Image.new('L', tile, 0); sh.paste(edge, (sw, sw))
    sh = sh.filter(ImageFilter.GaussianBlur(size / 12)).point(lambda v: min(255, int(v * 1.5)))
    ys = np.linspace(0, 1, tile[1], dtype=np.float32)[:, None, None]
    lo, hi = np.array(GOLD_LO, np.float32), np.array(GOLD_HI, np.float32)
    g = (hi * (1 - ys) + lo * ys) * np.ones((1, tile[0], 1), np.float32)
    grad = Image.fromarray(g.astype(np.uint8)).convert('RGBA')
    lay = Image.new('RGBA', tile, (0, 0, 0, 0))
    lay = Image.alpha_composite(lay, Image.merge('RGBA', (*[Image.new('L', tile, 0)] * 3, sh)))
    lay = Image.alpha_composite(lay, Image.merge('RGBA', (*[Image.new('L', tile, c) for c in (38, 22, 8)], edge)))
    grad.putalpha(fill)
    lay = Image.alpha_composite(lay, grad)
    px, py = int(cx - tile[0] / 2), int(cy - tile[1] / 2)
    base = canvas.crop((px, py, px + tile[0], py + tile[1]))
    canvas.paste(Image.alpha_composite(base, lay), (px, py))
    return canvas


def frame(canvas, outer, inner):
    W, H = canvas.size
    d = ImageDraw.Draw(canvas)
    s = max(1, round(W / 420))
    d.rectangle((outer - 1, outer - 1, W - outer, H - outer), outline=(10, 7, 12, 255), width=1)
    d.rectangle((outer, outer, W - 1 - outer, H - 1 - outer), outline=GOLD_RULE + (255,), width=s * 2)
    d.rectangle((inner, inner, W - 1 - inner, H - 1 - inner), outline=GOLD_RULE + (255,), width=max(1, s - 1))
    return canvas


def compose(cfg, art_path, rule=False):
    art = make_art(art_path, cfg)
    img = shade(art, cfg)
    img = band(img, cfg).convert('RGBA')
    img, box = put_logo(img, cfg)
    for text, size, cy in cfg['lines']:
        img = gold_text(img, text, size, cfg['W'] / 2, cy)
    if rule:
        W = cfg['W']; d = ImageDraw.Draw(img); y = cfg['rule_y']
        d.line((W / 2 - 330, y, W / 2 + 330, y), fill=GOLD_RULE + (255,), width=4)
        d.line((W / 2 - 330, y + 12, W / 2 + 330, y + 12), fill=GOLD_RULE + (255,), width=2)
    img = frame(img, *cfg['frame'])
    return img.convert('RGB'), box


# =====================================================================================================================
#  GRIME MODE (python manual/make_cover.py --grime)
#  A battered old dungeon box, a worn dark-fantasy book cover. Everything is procedural: multi-octave value noise,
#  Worley (Voronoi) cells, random-walk scratches, all with fixed seeds. Layers, in order:
#    1 grade       desaturate, push contrast, crush the blacks, olive-sepia in the shadows, heavy vignette
#    2 under       mottled stains, sickly wash, water-damage tide marks, soot smears, mildew, foxing, craquelure
#    3 band        the lettering band gets a murky film and streaks
#    4 logo        weathered logo (darker, scuffed, grime in the crevices) with a soft dirty glow
#    5 trim        gold lettering, rules and frame tarnished, chipped and olive-greened
#    6 over        dust, hairline scratches and scuffs, finger smudges and smears, creases, stress cracks,
#                  worn-through edges and corners showing dark board, torn notches, film grain, last tone pass
#  Every layer is weighted by one map (Gw): strong at the edges, the corners and the bottom (the crypt), weak where the
#  heroes stand, and weaker again over the logo and the lettering so they stay readable.
# =====================================================================================================================
GRIME = dict(seed=1031,
             desat=.78, contrast=1.26, crush=.06, gamma=1.14,      # the grade
             vignette=.66,                                          # strength of the heavy vignette
             stains=1.0, tide=1.0, soot=1.0, mildew=1.0, foxing=1.0, craquelure=1.0, band=1.0,
             dust=1.0, scratches=1.0, scuffs=1.0, prints=1.0, creases=1.0, cracks=1.0, edges=1.0, grain=1.0,
             logo_dark=.94, trim_dark=.90)                          # how much the logo / the gold is darkened
LUMA = np.array([.299, .587, .114], np.float32)


def smooth(a, e0, e1):
    t = np.clip((a - e0) / (e1 - e0), 0, 1)
    return (t * t * (3 - 2 * t)).astype(np.float32)


def norm01(a):
    lo, hi = np.percentile(a[::2, ::2], (1.5, 98.5))
    return np.clip((a - lo) / max(float(hi - lo), 1e-6), 0, 1).astype(np.float32)


def _box(a, r, axis):
    n = a.shape[axis]
    pad = [(0, 0)] * a.ndim
    pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(a, pad, mode='edge'), axis=axis, dtype=np.float64)
    def sl(s):
        return tuple(s if i == axis else slice(None) for i in range(a.ndim))
    return ((c[sl(slice(2 * r + 1, 2 * r + 1 + n))] - c[sl(slice(0, n))]) / (2 * r + 1)).astype(np.float32)


def blur(a, sigma):
    """Gaussian blur of a float array (H, W) or (H, W, C), three box passes."""
    if sigma < .45:
        return a
    r = max(1, int(round((np.sqrt(4 * sigma * sigma + 1) - 1) / 2)))
    for _ in range(3):
        for ax in (0, 1):
            a = _box(a, r, ax)
    return a


def fbm(h, w, cx, cy=None, octaves=5, seed=0, gain=.55):
    """Multi-octave value noise, 0..1. cx, cy are the width and height in px of the biggest features."""
    cy = cx if cy is None else cy
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp = 1.0
    for o in range(octaves):
        gx = min(w, max(2, int(w / max(1.5, cx / 2 ** o)) + 3))
        gy = min(h, max(2, int(h / max(1.5, cy / 2 ** o)) + 3))
        g = rng.random((gy, gx), dtype=np.float32)
        acc += amp * np.asarray(Image.fromarray(g).resize((w, h), Image.BICUBIC))
        amp *= gain
    return norm01(acc)


def worley(h, w, cell, seed):
    """Voronoi cells on a jittered grid: distance to the nearest point (f1), to the second nearest (f2), and a random
    value that is constant inside each cell (v1)."""
    rng = np.random.default_rng(seed)
    gh, gw = int(h / cell) + 3, int(w / cell) + 3
    px = (np.arange(gw, dtype=np.float32)[None, :] - 1 + rng.random((gh, gw), dtype=np.float32)) * cell
    py = (np.arange(gh, dtype=np.float32)[:, None] - 1 + rng.random((gh, gw), dtype=np.float32)) * cell
    val = rng.random((gh, gw), dtype=np.float32)
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = (xs // cell).astype(np.int32) + 1
    cy = (ys // cell).astype(np.int32) + 1
    f1 = np.full((h, w), 1e9, np.float32)
    f2 = f1.copy()
    v1 = np.zeros((h, w), np.float32)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            iy, ix = cy + dy, cx + dx
            d = np.hypot(px[iy, ix] - xs, py[iy, ix] - ys)
            near = d < f1
            f2 = np.where(near, f1, np.minimum(f2, d))
            v1 = np.where(near, val[iy, ix], v1)
            f1 = np.where(near, d, f1)
    return f1, f2, v1


def mul_tint(img, a, col):
    """Darken img by alpha a toward the colour col, multiplicatively (stains, soot, mildew)."""
    return img * (1 - a[..., None] * (1 - np.asarray(col, np.float32)))


def mix_tint(img, a, col):
    """Blend img toward the colour col by alpha a (dust, scuffs, rubbed paint)."""
    return img + (np.asarray(col, np.float32) - img) * a[..., None]


def grade_grimy(a):
    """Desaturate a little, push contrast, crush the blacks, go sepia-olive in the shadows and sickly warm in the mids."""
    lum = (a @ LUMA)[..., None]
    a = lum + (a - lum) * GRIME['desat']
    a = (a - .40) * GRIME['contrast'] + .40
    a = np.clip((a - GRIME['crush']) / (1 - GRIME['crush']), 0, 1) ** GRIME['gamma']
    lum = (a @ LUMA)[..., None]
    a = a + (1 - lum) ** 3 * np.array([.050, .058, .012], np.float32)       # shadows: olive-sepia, never pure black
    a = a * (1 + 4 * lum * (1 - lum) * np.array([.07, .03, -.13], np.float32))   # mids: sickly warm, a little yellow-green
    return np.clip(a, 0, 1)


def grime_context(cfg):
    """The size, seed and the weight map Gw (0.22 .. 1): strong at the edges, corners and bottom, weak on the heroes."""
    W, H = cfg['W'], cfg['H']
    S = W / 1260.0
    x = ((np.arange(W, dtype=np.float32) + .5) / W)[None, :]
    y = ((np.arange(H, dtype=np.float32) + .5) / H)[:, None]
    de = np.minimum(np.minimum(x * W, (1 - x) * W), np.minimum(y * H, (1 - y) * H)) / float(min(W, H))
    edge = np.clip(1 - de / .17, 0, 1) ** 1.5
    r = np.sqrt(((x - .5) / .5) ** 2 + ((y - .5) / .5) ** 2) / 1.414
    rad = smooth(r, .35, 1.0) ** 1.3
    bottom = smooth(y, .58, 1.0) ** 1.4
    hx, hy, hrx, hry = cfg['hero']
    hm = (1 - smooth(np.sqrt(((x - hx) / hrx) ** 2 + ((y - hy) / hry) ** 2), .6, 1.1)).astype(np.float32)
    g = np.clip(np.maximum(edge * .95, rad * .85) + .55 * bottom, 0, 1) * (1 - .72 * hm)
    Gw = np.clip(.22 + .78 * g, 0, 1).astype(np.float32)
    sd = GRIME['seed'] + W // 100
    return dict(W=W, H=H, S=S, sd=sd, Gw=Gw, Gtop=Gw, hm=hm, rad=rad.astype(np.float32), area=W * H / 1.26e6,
                nfine=fbm(H, W, 14 * S, 14 * S, 5, sd + 50))


def blob_fields(c, n, rmin, rmax, seed, power):
    """n rough round blotches (radius rmin..rmax px at 1260 wide) scattered where Gw is high: returns the body and a
    fuzzy rim, each 0..1."""
    H, W, S, Gw, nf = c['H'], c['W'], c['S'], c['Gw'], c['nfine']
    rng = np.random.default_rng(seed)
    core = np.zeros((H, W), np.float32)
    rim = np.zeros((H, W), np.float32)
    placed = tries = 0
    while placed < n and tries < n * 80:
        tries += 1
        x, y = rng.random() * W, rng.random() * H
        if rng.random() > Gw[int(y), int(x)] ** power:
            continue
        placed += 1
        r = rmin * (rmax / rmin) ** (rng.random() ** 1.7) * S
        R = int(r * 1.6) + 2
        x0, x1, y0, y1 = max(0, int(x) - R), min(W, int(x) + R + 1), max(0, int(y) - R), min(H, int(y) + R + 1)
        if x1 <= x0 or y1 <= y0:
            continue
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        b = 1 - np.hypot(xx - x, yy - y) / r + (nf[y0:y1, x0:x1] - .5) * .95
        s = rng.uniform(.55, 1)
        core[y0:y1, x0:x1] = np.maximum(core[y0:y1, x0:x1], smooth(b, .04, .55) * s)
        rim[y0:y1, x0:x1] = np.maximum(rim[y0:y1, x0:x1], smooth(b, 0, .12) * (1 - smooth(b, .12, .40)) * s)
    return core, rim


def grime_under(img, c):
    """Layer 2: everything that soaks into the painting, before the logo and the lettering go on."""
    H, W, S, sd, Gw = c['H'], c['W'], c['S'], c['sd'], c['Gw']
    # mottled dirty stains: soft noise patches plus tone patches from Voronoi cells
    m = fbm(H, W, 190 * S, 150 * S, 5, sd + 1)
    _, _, v1 = worley(H, W, 120 * S, sd + 2)
    mot = np.clip(m * .75 + blur(v1, 7 * S) * .45, 0, 1.2)
    sa = smooth(mot, .52, 1.0) * (.22 + .78 * Gw) * GRIME['stains']
    img = mul_tint(img, sa * .85, (.58, .46, .28))
    img = mix_tint(img, sa * .30, (.30, .23, .11))               # a murky tan film, so the stains show on the dark parts too
    m2 = fbm(H, W, 260 * S, 200 * S, 4, sd + 3)
    img = mul_tint(img, smooth(m2, .55, .95) * Gw * .60 * GRIME['stains'], (.78, .86, .48))   # sickly green-yellow wash
    # water damage: tide marks are contour lines of a slow noise field, dark crisp rim outside, soaked fade inside
    F = fbm(H, W, 300 * S, 260 * S, 4, sd + 4)
    wt = smooth(Gw, .3, .8)
    for L, k in ((.40, 1.0), (.58, .8), (.76, .9)):
        ring = np.exp(-((F - L) / .011) ** 2)
        soak = smooth(F, L - .004, L + .004) * np.exp(-np.maximum(F - L, 0) / .05)
        ta = (soak * .40 + ring * .60) * wt * k * GRIME['tide']
        img = mul_tint(img, ta * .65, (.54, .41, .25))
        img = mix_tint(img, ta * .50, (.40, .29, .14))
        img = mix_tint(img, np.exp(-((F - (L - .022)) / .010) ** 2) * .10 * wt * GRIME['tide'], (.74, .67, .48))
    # soot and smoke: tall wisps rising from the bottom, wide smears along the top and bottom, corner soot
    g = Gw ** 1.3
    s = np.maximum(smooth(fbm(H, W, 70 * S, 320 * S, 6, sd + 5), .38, .85) * g,
                   smooth(fbm(H, W, 340 * S, 60 * S, 6, sd + 6), .45, .90) * g * .85)
    s = np.maximum(s, smooth(fbm(H, W, 170 * S, 170 * S, 6, sd + 7), .52, .88) * c['rad'] ** 1.4)
    img = mul_tint(img, np.clip(s * .92, 0, .92) * GRIME['soot'], (.10, .085, .065))
    # mildew blotches (green-black with a pale fuzzy rim) and foxing (small rust-brown spots)
    core, rim = blob_fields(c, int(150 * c['area']), 5, 38, sd + 8, 2.2)
    img = mul_tint(img, core * .85 * GRIME['mildew'], (.32, .40, .19))
    img = mix_tint(img, core * .55 * GRIME['mildew'], (.16, .20, .10))
    img = mix_tint(img, rim * .30 * GRIME['mildew'], (.46, .52, .36))
    core, rim = blob_fields(c, int(560 * c['area']), 1.6, 7, sd + 9, 1.2)
    img = mul_tint(img, core * .70 * GRIME['foxing'], (.52, .30, .13))
    # craquelure: the paint is crazed along Voronoi cell borders, in patches near the edges
    f1, f2, _ = worley(H, W, 46 * S, sd + 10)
    gate = smooth(Gw, .5, .85) * smooth(fbm(H, W, 120 * S, 120 * S, 3, sd + 11), .45, .75)
    img = mul_tint(img, (1 - smooth(f2 - f1, 0, 1.5 * S)) * gate * .85 * GRIME['craquelure'], (.16, .13, .10))
    return img


def vignette_grimy(img, c):
    """A heavy dark vignette (a brown-black, never pure black), lighter over the heroes, darker at the foot."""
    H, W = c['H'], c['W']
    x = ((np.arange(W, dtype=np.float32) + .5) / W)[None, :]
    y = ((np.arange(H, dtype=np.float32) + .5) / H)[:, None]
    r = np.sqrt(((x - .5) / .5) ** 2 + ((y - .46) / .5) ** 2) / 1.30
    v = 1 - GRIME['vignette'] * smooth(r, .28, 1.0) ** 1.15
    v = 1 - (1 - v) * (1 - .45 * c['hm'])
    v = v * (1 - .38 * smooth(y, .72, 1.0))
    return img * v[..., None] + np.array([.035, .030, .020], np.float32) * (1 - v)[..., None] * .5


def band_grimy(img, cfg, c):
    """The dark band under the lettering, with a dirty film: murky mottling and streaks, thinner in patches."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    y0, y1, op = cfg['band']
    ys = np.arange(H, dtype=np.float32)
    al = np.clip((ys - y0) / max(1, y1 - y0), 0, 1)
    al = (al * al * (3 - 2 * al))[:, None]
    mot = fbm(H, W, 150 * S, 50 * S, 5, sd + 12)
    a = al * op * (1 - .22 * smooth(mot, .5, .95))
    img = img * (1 - a[..., None]) + np.array([.036, .031, .023], np.float32) * a[..., None]
    img = mix_tint(img, smooth(mot, .40, .90) * al * .15 * GRIME['band'], (.30, .25, .14))        # murky film
    streak = fbm(H, W, 20 * S, 170 * S, 5, sd + 13)
    img = mix_tint(img, smooth(streak, .52, .88) * al * .14 * GRIME['band'], (.26, .21, .12))    # water streaks
    img = mul_tint(img, smooth(fbm(H, W, 90 * S, 30 * S, 4, sd + 14), .6, .9) * al * .5 * GRIME['band'], (.5, .45, .35))
    return img


def logo_grimy(img, cfg, c):
    """Layer 4: the logo, still readable but weathered. Returns the image and the logo's alpha on the full canvas."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    logo, (x, y) = fit_logo(cfg)
    w, h = logo.size
    L = np.asarray(logo).astype(np.float32) / 255
    rgb, al = L[..., :3], L[..., 3]
    lum = (rgb @ LUMA)[..., None]
    rgb = (lum + (rgb - lum) * .90) * GRIME['logo_dark'] * np.array([1.0, .94, .78], np.float32)
    nl = fbm(h, w, 40 * S, 28 * S, 5, sd + 20)
    nf = fbm(h, w, 6 * S, 6 * S, 4, sd + 21)
    crev = np.clip((al - blur(al, 2.4 * S)) * 3.2, 0, 1)                       # grime packs the crevices along every edge
    rgb = mul_tint(rgb, crev * .62, (.30, .24, .15))
    yy = (np.arange(h, dtype=np.float32) / h)[:, None]
    rgb = mul_tint(rgb, smooth(nl, .42, .95) * (.55 + .7 * yy) * .62, (.42, .34, .20))   # dirt, heavier toward the foot
    rgb = mul_tint(rgb, smooth(fbm(h, w, 70 * S, 60 * S, 4, sd + 22), .70, .93) * .50, (.45, .55, .28))   # mildew
    rgb = mix_tint(rgb, smooth(nf, .72, .93) * .30, (.60, .50, .30))              # scuffed dull patches
    al = al * (1 - .50 * smooth(fbm(h, w, 8 * S, 8 * S, 4, sd + 23), .80, .94))   # tiny chips
    fa = np.zeros((H, W), np.float32)
    fa[y:y + h, x:x + w] = al
    wide = np.clip(blur(fa, w * .06) * 2.1, 0, 1)                              # the old dark halo keeps the letters legible
    tight = np.clip(blur(fa, w * .014) * 2.6, 0, 1)
    img = mix_tint(img, np.maximum(wide * .68, tight * .88), (.035, .030, .040))
    bloom = np.clip(blur(fa, w * .016) * 1.7, 0, 1) * (1 - fa)               # a murky candle-smoke glow around the letters
    img = mix_tint(img, bloom * .22, (.50, .38, .14))
    bloom2 = np.clip(blur(fa, w * .05) * 1.4, 0, 1) * (1 - fa)
    img = mix_tint(img, bloom2 * .06, (.34, .32, .12))
    sub = img[y:y + h, x:x + w]
    img[y:y + h, x:x + w] = sub * (1 - al[..., None]) + rgb * al[..., None]
    return img, fa


def trim_layer(cfg, rule):
    """The gold lettering, rules and frame, alone on a transparent layer so they can be tarnished separately."""
    W, H = cfg['W'], cfg['H']
    t = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for text, size, cy in cfg['lines']:
        t = gold_text(t, text, size, W / 2, cy)
    if rule:
        d = ImageDraw.Draw(t); y = cfg['rule_y']
        d.line((W / 2 - 330, y, W / 2 + 330, y), fill=GOLD_RULE + (255,), width=4)
        d.line((W / 2 - 330, y + 12, W / 2 + 330, y + 12), fill=GOLD_RULE + (255,), width=2)
    return frame(t, *cfg['frame'])


def trim_grimy(img, cfg, c, rule):
    """Layer 5: tarnished, olive-greened, dirty and chipped gold. Returns the image and the trim's alpha."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    a = np.asarray(trim_layer(cfg, rule)).astype(np.float32) / 255
    rgb, al = a[..., :3], a[..., 3]
    n1 = fbm(H, W, 46 * S, 30 * S, 5, sd + 30)
    n2 = fbm(H, W, 7 * S, 7 * S, 4, sd + 31)
    lum = (rgb @ LUMA)[..., None]
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    e = np.minimum(np.minimum(xs, W - 1 - xs), np.minimum(ys, H - 1 - ys))
    fm = (1 - smooth(e, cfg['frame'][1] + 4 * S, cfg['frame'][1] + 9 * S))         # 1 on the frame, 0 on the lettering
    rgb = lum + (rgb - lum) * .86
    dark = (GRIME['trim_dark'] - .10 * fm - .26 * smooth(n1, .30, .85) * (.7 + .5 * fm))[..., None]
    rgb = rgb * dark                                                               # tarnish: darker where it has lain longest
    rgb = mix_tint(rgb, smooth(n1 * .55 + n2 * .60, .60 - .06 * fm, .88) * (.55 + .15 * fm), (.20, .21, .09))   # verdigris
    rgb = mul_tint(rgb, smooth(n2, .55, .88) * (.50 + .20 * fm), (.36, .28, .17))  # dirt in the pits
    rgb = mix_tint(rgb, smooth(c['nfine'] * .45 + n2 * .6, .86, 1.0) * .60, (.55, .50, .36))   # bare, scuffed metal
    al = al * (1 - .60 * smooth(c['nfine'] * .5 + n2 * .6, .90 - .18 * fm, .99))      # chips: many on the frame, few on the small lettering
    img = img * (1 - al[..., None]) + rgb * al[..., None]
    return img, al


def grime_dust(img, c):
    """Speckled dust: dark flecks and pale dust, fine and coarse, thicker where Gw is high."""
    H, W, S, sd, G = c['H'], c['W'], c['S'], c['sd'], c['Gtop']
    rng = np.random.default_rng(sd + 40)
    def specks(dens, sig):
        sig = sig * S
        pts = (rng.random((H, W), dtype=np.float32) < dens * (.10 + G) ** 1.5).astype(np.float32)
        return np.clip(blur(pts, sig) * 2 * np.pi * sig * sig, 0, 1)
    k = GRIME['dust']
    img = mul_tint(img, specks(.0048, .65) * .75 * k, (.07, .055, .04))
    img = mul_tint(img, specks(.00065, 1.5) * .65 * k, (.10, .08, .06))
    img = mix_tint(img, specks(.0030, .6) * .40 * k, (.84, .78, .62))
    img = mix_tint(img, specks(.00040, 1.4) * .38 * k, (.80, .74, .58))
    return img


def _walk(rng, x, y, ang, length, step, wob, W, H):
    pts = [(x, y)]
    for _ in range(max(2, int(length / step))):
        ang += rng.normal(0, wob)
        x += np.cos(ang) * step; y += np.sin(ang) * step
        if not (-4 < x < W + 4 and -4 < y < H + 4):
            break
        pts.append((x, y))
    return pts


def _pick(rng, G, W, H, power):
    x = y = 0.0
    for _ in range(500):
        x, y = rng.random() * W, rng.random() * H
        if rng.random() < G[int(y), int(x)] ** power:
            break
    return x, y


def grime_scratches(img, c):
    """Hairline scratches (pale and dark random walks) and scuffs (clusters of short soft fat strokes)."""
    H, W, S, sd, G = c['H'], c['W'], c['S'], c['sd'], c['Gtop']
    rng = np.random.default_rng(sd + 45)
    light, dark, scuff = (Image.new('L', (W, H), 0) for _ in range(3))
    dl, dd, ds = ImageDraw.Draw(light), ImageDraw.Draw(dark), ImageDraw.Draw(scuff)
    for _ in range(int(340 * c['area'])):
        x, y = _pick(rng, G, W, H, 1.3)
        ang = rng.normal(.45, .55) + (np.pi if rng.random() < .5 else 0) if rng.random() < .75 else rng.uniform(0, 6.283)
        length = float(np.clip(np.exp(rng.normal(np.log(55 * S), .85)), 8 * S, 700 * S))
        pts = _walk(rng, x, y, ang, length, 3 * S, .05, W, H)
        if len(pts) > 1:
            (dl if rng.random() < .6 else dd).line(pts, fill=int(rng.uniform(60, 235)), width=1)
    for _ in range(int(46 * c['area'])):
        x, y = _pick(rng, G, W, H, 2.0)
        ang = rng.normal(.4, .4)
        for _ in range(int(rng.integers(2, 6))):
            ox, oy = rng.normal(0, 7 * S, 2)
            pts = _walk(rng, x + ox, y + oy, ang + rng.normal(0, .08), rng.uniform(18, 70) * S, 3 * S, .03, W, H)
            if len(pts) > 1:
                ds.line(pts, fill=int(rng.uniform(50, 150)), width=max(2, int(rng.uniform(2.5, 6) * S)))
    k = GRIME['scratches']
    lm = np.clip(blur(np.asarray(light, np.float32) / 255, .55 * S) * 1.9, 0, 1)
    dm = np.clip(blur(np.asarray(dark, np.float32) / 255, .55 * S) * 1.9, 0, 1)
    sm = np.clip(blur(np.asarray(scuff, np.float32) / 255, 1.5 * S) * 1.6, 0, 1)
    img = mix_tint(img, lm * .36 * k, (.86, .80, .64))
    img = mul_tint(img, dm * .50 * k, (.22, .18, .13))
    img = mix_tint(img, sm * .34 * GRIME['scuffs'], (.62, .56, .42))
    return img


def grime_cracks(img, c):
    """Stress cracks: pale, thin, jagged lines running inward from the borders, mostly near the corners."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    rng = np.random.default_rng(sd + 48)
    pale, dark = Image.new('L', (W, H), 0), Image.new('L', (W, H), 0)
    dp, dd = ImageDraw.Draw(pale), ImageDraw.Draw(dark)
    for _ in range(int(10 * c['area'] ** .6 * GRIME['cracks'])):
        side = int(rng.integers(0, 4))
        t = rng.random() ** 1.6
        t = t if rng.random() < .5 else 1 - t                  # bunch toward the corners
        x, y, ang = [(t * W, 0, 1.57), (W, t * H, 3.14), (t * W, H, -1.57), (0, t * H, 0.0)][side]
        pts = _walk(rng, x, y, ang + rng.normal(0, .35), rng.uniform(40, 150) * S, 2.2 * S, .22, W, H)
        if len(pts) > 1:
            dp.line(pts, fill=int(rng.uniform(150, 240)), width=max(1, int(S + .3)))
            dd.line([(px + 1.6 * S, py + 1.6 * S) for px, py in pts], fill=200, width=1)
    pm = np.clip(blur(np.asarray(pale, np.float32) / 255, .6 * S) * 1.8, 0, 1)
    dm = np.clip(blur(np.asarray(dark, np.float32) / 255, .6 * S) * 1.8, 0, 1)
    img = mul_tint(img, dm * .55, (.2, .16, .12))
    return mix_tint(img, pm * .50, (.80, .72, .55))


def grime_prints(img, c, cfg):
    """Finger smudges: oval whorl ridges that break up, greasy and dark, plus a few drag smears of the paint."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    nf = c['nfine']
    rng = np.random.default_rng(sd + 60)
    acc = np.zeros((H, W), np.float32)
    lite = np.zeros((H, W), np.float32)
    for fx, fy in cfg['prints']:
        cx, cy = fx * W, fy * H
        rx = rng.uniform(22, 30) * S
        ry = rx * rng.uniform(1.30, 1.65)
        ang = rng.uniform(-.8, .8)
        R = int(max(rx, ry) * 1.8)
        x0, x1, y0, y1 = max(0, int(cx) - R), min(W, int(cx) + R), max(0, int(cy) - R), min(H, int(cy) + R)
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        u0, v0 = xx - cx, yy - cy
        u = (u0 * np.cos(ang) + v0 * np.sin(ang)) / rx
        v = (-u0 * np.sin(ang) + v0 * np.cos(ang)) / ry
        wv = nf[y0:y1, x0:x1] - .5
        r = np.sqrt((u * .85) ** 2 + (v + .45 * u * u - .2) ** 2)
        ridge = .5 + .5 * np.sin(2 * np.pi * r * 4.5 + 11 * wv + 1.4 * u)
        foot = smooth(1 - r + wv * .5, .05, .30)
        a = foot * (.10 + .30 * ridge * smooth(wv + .5, .38, .62)) + smooth(1 - r * .8, 0, .6) * .09
        acc[y0:y1, x0:x1] = np.maximum(acc[y0:y1, x0:x1], a)
        lite[y0:y1, x0:x1] = np.maximum(lite[y0:y1, x0:x1], foot * ridge * .12)
    img = mul_tint(img, acc * GRIME['prints'], (.58, .50, .36))
    img = mix_tint(img, lite * GRIME['prints'], (.80, .74, .58))
    G = c['Gtop']                                              # drag smears: a patch of paint pulled sideways
    for _ in range(int(7 * c['area'] ** .6)):
        x, y = _pick(rng, G, W, H, 2.2)
        w, h = int(rng.uniform(110, 210) * S), int(rng.uniform(24, 55) * S)
        x0, y0 = int(max(0, min(W - w, x - w / 2))), int(max(0, min(H - h, y - h / 2)))
        reg = img[y0:y0 + h, x0:x0 + w]
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        m = np.exp(-(((xx - w / 2) / (w * .42)) ** 2 + ((yy - h / 2) / (h * .42)) ** 2) * 2.0)[..., None] * .75
        smear = _box(_box(reg, max(2, int(w * .12)), 1), max(1, int(h * .08)), 0) * .88
        img[y0:y0 + h, x0:x0 + w] = reg * (1 - m) + smear * m
    return img


def grime_creases(img, c, cfg):
    """Two fold lines (one up, one across), wobbly, fading in and out: a dark line, a pale ridge beside it and whitened,
    cracked paint along it."""
    S, sd = c['S'], c['sd']
    fx, fy = cfg['creases']
    def crease(v, nv, gv, pos, slope, seed):
        A, B = v.shape[:2]
        rng = np.random.default_rng(seed)
        rows = np.arange(A, dtype=np.float32)
        wob = np.interp(rows, np.linspace(0, A, 12), rng.normal(0, 4 * S, 12))
        along = smooth(np.interp(rows, np.linspace(0, A, 9), rng.random(9)), .18, .5)   # breaks along its length
        centre = pos * B + slope * (rows - A / 2) + wob
        x0, x1 = int(max(0, centre.min() - 60 * S)), int(min(B, centre.max() + 60 * S))
        d = np.arange(x0, x1, dtype=np.float32)[None, :] - centre[:, None]
        k = (along[:, None] * (.40 + .60 * gv[:, x0:x1])) * GRIME['creases']
        sub = v[:, x0:x1]
        sub = mul_tint(sub, np.exp(-(d / (1.1 * S)) ** 2) * .58 * k, (.30, .26, .20))
        sub = mix_tint(sub, np.exp(-((d - 2.4 * S) / (1.6 * S)) ** 2) * .26 * k, (.90, .83, .66))
        sub = mix_tint(sub, np.exp(-(d / (2.8 * S)) ** 2) * smooth(nv[:, x0:x1], .48, .78) * .55 * k, (.76, .68, .52))
        side = np.tanh(d / (14 * S)) * np.exp(-np.abs(d) / (40 * S)) * .07 * k
        v[:, x0:x1] = sub * (1 - side)[..., None]
    crease(img, c['nfine'], c['Gtop'], fx, .012, sd + 70)
    crease(img.transpose(1, 0, 2), c['nfine'].T, c['Gtop'].T, fy, -.008, sd + 71)
    return img


def grime_edges(img, cfg, c):
    """Edge wear: the paint rubbed off toward the borders, a pale paper rim, dark board showing where the edges and
    especially the corners have worn through, and a few small torn notches."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    e = np.minimum(np.minimum(xs, W - 1 - xs), np.minimum(ys, H - 1 - ys))
    ne = fbm(H, W, 38 * S, 12 * S, 6, sd + 80)
    nl = fbm(H, W, 220 * S, 220 * S, 4, sd + 81)
    nh = c['nfine']
    cf = np.zeros((H, W), np.float32)
    for cx, cy, amp in ((0, 0, .55), (W - 1, 0, .85), (0, H - 1, 1.0), (W - 1, H - 1, .90)):
        cf = np.maximum(cf, amp * np.clip(1 - np.hypot(xs - cx, ys - cy) / (95 * S), 0, 1) ** 1.3)
    k = GRIME['edges']
    T = (S * (1.2 + 6.5 * smooth(ne * .6 + nl * .6, .55, 1.0)) + S * 42 * cf * (.45 + .9 * ne)) * k
    rng = np.random.default_rng(sd + 82)
    for _ in range(cfg['tears']):                              # torn notches: a jagged wedge bitten out of an edge
        side = int(rng.integers(0, 4))
        t = rng.uniform(.08, .92)
        D, hw = rng.uniform(12, 30) * S * k, rng.uniform(7, 17) * S
        Tv, nv = (T, ne) if side == 0 else (T[::-1], ne[::-1]) if side == 2 else (T.T, ne.T) if side == 1 else (T.T[::-1], ne.T[::-1])
        B = Tv.shape[1]
        xc = t * B
        a0, a1, ds = int(max(0, xc - hw)), int(min(B, xc + hw + 1)), int(D) + 3
        prof = D * np.clip(1 - np.abs(np.arange(a0, a1, dtype=np.float32) - xc) / hw, 0, 1) ** .8
        prof = prof + (nv[:ds, a0:a1].max(axis=0) - .5) * 7 * S * (prof > 0)
        Tv[:ds, a0:a1] = np.maximum(Tv[:ds, a0:a1], prof[None, :])
    board = smooth(T - e, -.6, .8)
    rimw = S * (1.5 + 4 * nh + 9 * cf)
    rim = smooth(T + rimw - e, 0, rimw * .6) * (1 - board) * smooth(ne, .10, .50)
    rub = np.clip(1 - np.maximum(e - T, 0) / (S * (22 + 70 * cf)), 0, 1) ** 1.8 * smooth(nh * .5 + ne * .6, .50, .85)
    rub = rub * (1 - .65 * np.clip(c['trim_a'] * 1.5, 0, 1))      # the gold keeps its own tarnish, the rubbing is on the paint
    img = mix_tint(img, rub * .62 * k, (.44, .38, .29))        # paint rubbed off, light card showing
    img = mix_tint(img, rim * .70, (.56, .50, .38))            # the pale paper edge
    bc = np.array([.115, .095, .075], np.float32) * (.65 + .7 * nh)[..., None]     # the dark board
    return img * (1 - board[..., None]) + bc * board[..., None]


def grime_grain(img, c):
    """Film grain (fine plus a coarser clump), strongest in the mid-tones, and a last tone pass that ties the logo, the
    gold and the painting into one aged print."""
    H, W, S, sd = c['H'], c['W'], c['S'], c['sd']
    rng = np.random.default_rng(sd + 90)
    lum = (img @ LUMA)
    img = (lum[..., None] + (img - lum[..., None]) * .94) + (1 - lum[..., None]) ** 3 * np.array([.010, .012, .002], np.float32)
    coarse = np.asarray(Image.fromarray(rng.normal(0, 1, (H // 2 + 2, W // 2 + 2)).astype(np.float32)).resize((W, H), Image.BICUBIC))
    g = (rng.normal(0, 1, (H, W)).astype(np.float32) * .75 + coarse * .55) * (.030 + .045 * 4 * lum * (1 - lum)) * GRIME['grain']
    img = img + g[..., None] * np.array([1.0, 1.0, .9], np.float32)
    return np.clip(img, 0, 1)


def compose_grime(cfg, art_path, rule=False):
    W, H = cfg['W'], cfg['H']
    c = grime_context(cfg)
    art = make_art(art_path, cfg)
    a = grade_grimy(np.asarray(art).astype(np.float32) / 255)
    a = np.asarray(shade(Image.fromarray((a * 255).astype(np.uint8)), dict(cfg, top_shade=cfg['top_shade'] + .12, vignette=0))).astype(np.float32) / 255
    img = vignette_grimy(a, c)
    img = grime_under(img, c)
    img = band_grimy(img, cfg, c)
    img, logo_a = logo_grimy(img, cfg, c)
    img, trim_a = trim_grimy(img, cfg, c, rule)
    # the later layers go lightly over the logo and the lettering so they stay readable
    keep = np.clip(blur(logo_a, 6 * c['S']) * 1.6, 0, 1) * .50 + np.clip(blur(trim_a, 8 * c['S']) * 3.0, 0, 1) * .66
    c['Gtop'] = (c['Gw'] * (1 - keep)).astype(np.float32)
    c['trim_a'] = trim_a
    img = grime_dust(img, c)
    img = grime_scratches(img, c)
    img = grime_prints(img, c, cfg)
    img = grime_creases(img, c, cfg)
    img = grime_cracks(img, c)
    img = grime_edges(img, cfg, c)
    img = grime_grain(img, c)
    return Image.fromarray((img * 255 + .5).clip(0, 255).astype(np.uint8)), None


def make_compare(clean, grimy_game, grimy_front):
    """clean game cover | grimy game cover | grimy manual cover, labelled, on a dark board."""
    h = 760
    panels = [('Clean game cover', clean), ('Grimy game cover', grimy_game), ('Grimy manual cover', grimy_front)]
    ims = [im.resize((round(im.width * h / im.height), h), Image.LANCZOS) for _, im in panels]
    m, gap, top, bot = 48, 40, 104, 46
    W = m * 2 + gap * 2 + sum(i.width for i in ims)
    H = top + h + bot
    out = Image.new('RGB', (W, H), (20, 17, 14))
    d = ImageDraw.Draw(out)
    font = ImageFont.truetype(FONT, 46)
    x = m
    for (label, _), im in zip(panels, ims):
        out.paste(im, (x, top))
        d.rectangle((x - 1, top - 1, x + im.width, top + h), outline=(120, 100, 60))
        l, t, r, b = font.getbbox(label)
        d.text((x + (im.width - (r - l)) // 2 - l, 24 - t + 8), label, font=font, fill=(226, 192, 112))
        x += im.width + gap
    return out


def front_setup():
    cfg = dict(FRONT)
    src = ART_P if os.path.exists(ART_P) else ART_L
    if src == ART_P:                       # a painting made for the portrait: cover-fit it, headroom is already in it
        im = Image.open(ART_P); cfg.update(delta=0, ph=max(cfg['H'], round(cfg['W'] * im.height / im.width)), cx=.5)
    return cfg, src


def main_grime():
    t0 = time.time()
    os.makedirs(os.path.dirname(OUT_GAME_GRIMY), exist_ok=True)
    g, _ = compose_grime(GAME, ART_L)
    g.save(OUT_GAME_GRIMY, optimize=True)
    print('grimy game cover', g.size, '->', OUT_GAME_GRIMY, '(%.0fs)' % (time.time() - t0))
    cfg, src = front_setup()
    f, _ = compose_grime(cfg, src, rule=True)
    f.save(OUT_FRONT_GRIMY, optimize=True)
    print('grimy front cover', f.size, '->', OUT_FRONT_GRIMY, '(%.0fs)' % (time.time() - t0))
    clean, _ = compose(GAME, ART_L)        # always built fresh, so the comparison uses the current logo
    make_compare(clean, g, f).save(OUT_COMPARE, optimize=True)
    print('comparison ->', OUT_COMPARE, '(%.0fs)' % (time.time() - t0))


def main():
    if '--grime' in sys.argv[1:]:
        return main_grime()
    os.makedirs(os.path.dirname(OUT_GAME), exist_ok=True)
    g, box = compose(GAME, ART_L)
    g.save(OUT_GAME, optimize=True)
    print('game cover', g.size, 'logo box', box, '->', OUT_GAME)
    cfg, src = front_setup()
    f, box = compose(cfg, src, rule=True)
    f.save(OUT_FRONT, optimize=True)
    print('front cover', f.size, 'logo box', box, 'art', os.path.basename(src), '->', OUT_FRONT)


if __name__ == '__main__':
    main()
