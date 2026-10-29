"""Cuts one Gemini sheet (pictures on flat magenta) into the separate pieces of the Pale Spire (assets/ps/). A copy of ingest_gy.py with names.

    extra: names=a,b,c  gives each piece its own key (the PSP_PICS name, without ps_), hs=2.4,2,3.2  the picture height in cells (written as "h" in assets/ps/manifest.json, read by pspLoadOwn in ps_glue.js)
    example: python tools/ingest_ps.py sheet_s1.jpg s1 sprite cols=4 rows=3 names=st_mourners,st_chimera,... hs=2.4,2,...

    python tools/ingest_gy.py <sheet.jpg> <name> <sprite|tex> [cols=<n> rows=<n>] [maxh=<px>] [alpha=<0..1>] [fade=<0..1>] [seam=xy|x|none] [cells=x0,y0,x1,y1;...]

sprite  the sheet is split into cols x rows equal cells (or the given cells); in each cell the magenta is keyed out, a ground line and captions are dropped (only the big pieces are kept),
        and the picture is saved as assets/gy/<name>_<k>.webp (reading order). alpha= makes a ghost see-through, fade= fades the bottom part of it into mist.
tex     the sheet is cut into a cols x rows grid of seamless squares (256 px, edges blended), saved as assets/gy/<name>_<k>.jpg
assets/gy/manifest.json lists every piece with its size; tools/gy_list.py turns it into src/desert/gy_list.js.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, name, kind = sys.argv[1], sys.argv[2], sys.argv[3]
opts = dict(a.split('=') for a in sys.argv[4:] if '=' in a)
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ps'
OUT.mkdir(parents=True, exist_ok=True)
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text()) if MAN.exists() else {}
im = Image.open(src).convert('RGB')
cols, rows = int(opts.get('cols', 1)), int(opts.get('rows', 1))


def magmask(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (np.minimum(r, b) > 140) & (np.minimum(r, b) - g > 75) & (np.abs(r - b) < 100)


def kill_ground_lines(a):
    """a long thin dark line under a figure (the generator likes to draw one) is painted back to magenta"""
    mag = magmask(a); H, W = mag.shape
    for y in range(7, H - 7):
        fgr = ~mag[y]; x = 0
        while x < W:
            if not fgr[x]: x += 1; continue
            x0 = x
            while x < W and fgr[x]: x += 1
            if x - x0 >= 150:
                seg = slice(x0, x)
                if mag[y - 6][seg].mean() > .8 or mag[y + 6][seg].mean() > .8:
                    blk = a[max(0, y - 2):y + 3, x0:x]
                    m2 = ~magmask(blk)
                    blk[m2] = (255, 0, 255)
    return a


def components(fg, k=4, grow=2):
    """bounding boxes of the blobs of foreground (found on a coarse grid so that letters and flames join up), with their pixel counts"""
    Hh, Ww = fg.shape[0] // k, fg.shape[1] // k
    sm = fg[:Hh * k, :Ww * k].reshape(Hh, k, Ww, k).any(axis=(1, 3))
    sm = np.array(Image.fromarray((sm * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * grow + 1))) > 0
    seen = np.zeros(sm.shape, bool); out = []
    for sy in range(Hh):
        for sx in range(Ww):
            if not sm[sy, sx] or seen[sy, sx]: continue
            st = [(sy, sx)]; seen[sy, sx] = True; y0 = y1 = sy; x0 = x1 = sx; n = 0
            while st:
                cy, cx = st.pop(); n += 1; y0 = min(y0, cy); y1 = max(y1, cy); x0 = min(x0, cx); x1 = max(x1, cx)
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < Hh and 0 <= nx < Ww and sm[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True; st.append((ny, nx))
            out.append((x0 * k, y0 * k, (x1 + 1) * k, (y1 + 1) * k, n))
    return out


def sprite_from(cell, unpink=False, unmix=False):
    a = np.array(cell).astype(int)
    a = kill_ground_lines(a)
    fg = ~magmask(a)
    # captions: rows of the cell are split wherever there is an empty gap, and only the heaviest band (the figure) is kept
    prof = fg.sum(axis=1); spans = []; st = None; gap = 0
    for i, v in enumerate(prof):
        if v > 1:
            if st is None: st = i
            gap = 0; last = i
        elif st is not None:
            gap += 1
            if gap >= 5: spans.append((st, last)); st = None
    if st is not None: spans.append((st, last))
    if len(spans) > 1:
        best = max(spans, key=lambda sp: prof[sp[0]:sp[1] + 1].sum())
        keepy = np.zeros(fg.shape[0], bool); keepy[:best[1] + 1] = True   # the figure and anything above it (candles, flames); captions hang below
        fg &= keepy[:, None]
    comps = components(fg)
    if not comps: return None
    big = max(c[4] for c in comps)
    keep = [c for c in comps if c[4] >= .004 * big and (c[2] - c[0]) > 16 and (c[3] - c[1]) > 30]
    bg = max(keep, key=lambda c: c[4])
    near = lambda c: not (c[0] > bg[2] + 40 or c[2] < bg[0] - 40 or c[1] > bg[3] + 40 or c[3] < bg[1] - 40)
    keep = [c for c in keep if near(c)]
    x0 = min(c[0] for c in keep); y0 = min(c[1] for c in keep); x1 = max(c[2] for c in keep); y1 = max(c[3] for c in keep)
    # everything outside the kept boxes is background (captions, lines)
    m = np.zeros(fg.shape, bool)
    for c in keep: m[c[1]:c[3], c[0]:c[2]] = True
    fg &= m
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # soft alpha: the more magenta an edge pixel is, the less opaque
    mg = np.minimum(r, b) - g
    key = ~fg
    edge = np.array(Image.fromarray((key * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))) == 0
    edge &= fg
    alpha = np.where(fg, 255, 0).astype(float)
    ghost = 'alpha' in opts or unmix
    if ghost:
        # unmix: p = a*c + (1-a)*magenta, with c a light colour: a = 1 - (r-g)/255, c = g / a
        mm = np.maximum(r - g, b - g) if False else (r + b) / 2.0 - g
        aa = np.clip(1 - mm / 255.0, .12, 1)
        alpha = np.where(fg, 255 * aa, 0)
        cg = np.clip(g / aa, 0, 255)
        sc = np.where(aa > .99, 1.0, 1.0)
        # recolour from the green channel: blue-white ghost, keep the tint by the ratio of the pixel's own channels
        nr = np.clip(r - (1 - aa) * 255, 0, 255) / aa
        nb = np.clip(b - (1 - aa) * 255, 0, 255) / aa
        a[..., 0] = np.clip(nr, 0, 255); a[..., 1] = cg; a[..., 2] = np.clip(nb, 0, 255)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
    elif opts.get('soft'):
        alpha = np.where(fg, 255, 0).astype(float)
        edge2 = np.array(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))) == 0
        edge2 &= fg
        alpha[edge2] = np.clip(255 * (1 - (mg[edge2] - 20) / 100.0), 0, 255)
    else:
        er = np.array(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))) > 0
        alpha = np.where(er, 255, 0).astype(float)
    al = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    # take the magenta out of the colour of the edge pixels
    cap = np.maximum(g, 60) + (60 if ghost else 100)
    if not ghost:
        band = np.array(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7))) == 0   # within 3 px of the edge
        use = np.ones(fg.shape, bool) if unpink else band
        capx = np.maximum(g, 40) + (45 if unpink else 35)
        a[..., 0] = np.where(use, np.minimum(r, capx), r); a[..., 2] = np.where(use, np.minimum(b, capx), b)
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA'); out.putalpha(al)
    out = out.crop((x0, y0, x1, y1))
    bb = out.getchannel('A').point(lambda v: 255 if v > 90 else 0).getbbox()
    if bb: out = out.crop(bb)
    if ghost:
        A = np.array(out).astype(float)
        mult = float(opts.get('alpha', 1)); f = float(opts.get('fade', 0))
        h = A.shape[0]
        ramp = np.ones(h)
        if f > 0:
            s = int(h * (1 - f)); ramp[s:] = np.linspace(1, .08, h - s)
        A[..., 3] *= mult * ramp[:, None]
        out = Image.fromarray(A.clip(0, 255).astype(np.uint8))
    return out


def tex_from(cell):
    m = int(cell.width * .03)
    crop = cell.crop((m, m, cell.width - m, cell.height - m)).resize((256, 256), Image.LANCZOS)
    seam = opts.get('seam', 'xy')
    if seam != 'none':
        a = np.array(crop).astype(float); u = np.linspace(0, 1, 256)
        wx = (1 - np.abs(2 * u - 1))[None, :]; wy = (1 - np.abs(2 * u - 1))[:, None]
        if seam == 'xy': r_ = np.roll(a, (128, 128), (0, 1)); wm = (wx * wy)[..., None]
        else: r_ = np.roll(a, 128, 1); wm = np.broadcast_to(wx, (256, 256))[..., None]
        crop = Image.fromarray((a * wm + r_ * (1 - wm)).clip(0, 255).astype(np.uint8))
    return crop


def runs(profile, mingap):
    spans = []; st = None; gap = 0; last = 0
    for i, v in enumerate(profile):
        if v:
            if st is None: st = i
            gap = 0; last = i
        elif st is not None:
            gap += 1
            if gap >= mingap: spans.append((st, last)); st = None
    if st is not None: spans.append((st, last))
    return spans


def auto_cells(im):
    """rows of pieces by the empty gaps between them, then the pieces of each row by the gaps between columns; bands that are only a caption are dropped"""
    a = np.array(im).astype(int); a = kill_ground_lines(a); fg = ~magmask(a)
    bands = runs(fg.sum(axis=1) > 2, 8)
    mass = [fg[y0:y1 + 1].sum() for (y0, y1) in bands]
    out = []
    for (y0, y1), m in zip(bands, mass):
        if m < .12 * max(mass): continue
        sub = fg[y0:y1 + 1]
        for (x0, x1) in runs(sub.sum(axis=0) > 2, int(opts.get('gap', 12))):
            if x1 - x0 < 24: continue
            out.append((max(0, x0 - 6), max(0, y0 - 6), min(im.width, x1 + 7), min(im.height, y1 + 7)))
    return out


W, H = im.size
if opts.get('auto'):
    cells = auto_cells(im)
elif opts.get('cells'):
    cells = [tuple(int(v) for v in c.split(',')) for c in opts['cells'].split(';')]
else:
    cells = [(ci * W // cols, rj * H // rows, (ci + 1) * W // cols, (rj + 1) * H // rows) for rj in range(rows) for ci in range(cols)]
maxh = int(opts.get('maxh', 512))
NAMES = opts.get('names', '').split(',') if opts.get('names') else []
HS = [float(v) for v in opts.get('hs', '').split(',')] if opts.get('hs') else []
def key(n): return NAMES[n] if n < len(NAMES) else '%s_%d' % (name, n)
n = 0
for c in cells:
    cell = im.crop(c)
    if kind == 'tex':
        t = tex_from(cell); t.save(OUT / (key(n) + '.jpg'), quality=90)
        man[key(n)] = {'file': key(n) + '.jpg', 'w': 256, 'h': 256, 'kind': 'tex', 'sheet': name}
    else:
        s = sprite_from(cell, str(n) in opts.get('unpink', '').split(','), str(n) in opts.get('unmix', '').split(','))
        if s is None: n += 1; continue
        if s.height > maxh: s = s.resize((round(s.width * maxh / s.height), maxh), Image.LANCZOS)
        s.save(OUT / (key(n) + '.webp'), quality=88, method=4)
        man[key(n)] = {'file': key(n) + '.webp', 'w': s.width, 'px_h': s.height, 'h': (HS[n] if n < len(HS) else None), 'kind': 'sprite', 'sheet': name}
    n += 1
MAN.write_text(json.dumps(man, indent=0))
print(name, kind, n, 'cells')
