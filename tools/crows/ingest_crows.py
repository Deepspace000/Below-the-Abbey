"""Cuts a sheet of painted flying crows (flat magenta background, FRONT view) into the flap frames the game uses.

    python tools/crows/ingest_crows.py <sheet.png|jpg> <name> <count> [anchor=body|none] [maxw=<px>]

The sheet holds <count> pictures side by side (wings up, wings level, wings down; or three flocks). They are keyed out of the
magenta, split at the widest empty column gaps, and every frame is put on ONE common canvas so the body of the crow stays in
the same place from frame to frame (the engine only swaps the picture). Saved as assets/crow/<name>_<k>.webp, listed in
assets/crow/manifest.json as [file, width, height, bodyY] where bodyY is the body centre as a fraction of the height.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image

src, name, count = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=') for a in sys.argv[4:] if '=' in a)
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'assets' / 'crow'
OUT.mkdir(parents=True, exist_ok=True)
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text()) if MAN.exists() else {}

im = Image.open(src).convert('RGB')
a = np.array(im).astype(np.float32)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
mg = np.minimum(R, B) - G                      # how magenta a pixel is
alpha = np.clip(1 - (mg - 55) / 110, 0, 1)     # 0 on the flat magenta, 1 on the bird, a short ramp at the edge
# take the purple fringe off the soft edge: pull red and blue down to the green level where the pixel is partly magenta
fr = (alpha < 1) & (alpha > 0)
lim = G + 0.35 * np.maximum(0, np.minimum(R, B) - G) * alpha
R2 = np.where(fr, np.minimum(R, np.maximum(lim, G)), R); B2 = np.where(fr, np.minimum(B, np.maximum(lim, G)), B)
rgba = np.dstack([R2, G, B2, alpha * 255]).clip(0, 255).astype(np.uint8)

# drop loose specks: keep only the big connected pieces of the picture
import cv2
binm = (alpha > .3).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(binm, connectivity=8)
keep = np.zeros(n, bool)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] > 0.0008 * alpha.size: keep[i] = True
mask = cv2.dilate(keep[lab].astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
rgba[..., 3] = np.where(mask, rgba[..., 3], 0)
alpha = rgba[..., 3] / 255.0

# split into <count> pictures. split=comp (default): the <count> biggest connected pieces are the birds, loose bits join the nearest bird.
# split=cols: the widest empty column gaps (for sheets of flocks, where one picture is many separate birds)
mode = opts.get('split', 'comp')
frames = []
def body_of(crop):
    w = crop.shape[1]; mid = crop[:, int(w * .375):int(w * .625)]
    al = mid[..., 3] > 128
    return float(np.average(np.where(al)[0])) if al.any() else crop.shape[0] / 2
if mode == 'cols':
    cols = (alpha > .2).any(axis=0); runs = []; start = None
    for i in range(len(cols)):
        if cols[i] and start is None: start = i
        if (not cols[i]) and start is not None: runs.append([start, i - 1]); start = None
    if start is not None: runs.append([start, len(cols) - 1])
    while len(runs) > count:
        g = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
        k = int(np.argmin(g)); runs[k] = [runs[k][0], runs[k + 1][1]]; del runs[k + 1]
    if len(runs) < count: sys.exit('only %d pieces found, wanted %d' % (len(runs), count))
    groups = [(x0, x1, None) for x0, x1 in runs]
else:
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats((alpha > .2).astype(np.uint8), connectivity=8)
    ids = [i for i in range(1, n2) if st2[i, cv2.CC_STAT_AREA] > 0.0008 * alpha.size]
    ids.sort(key=lambda i: -st2[i, cv2.CC_STAT_AREA])
    seeds = ids[:count]
    if len(seeds) < count: sys.exit('only %d pieces found, wanted %d' % (len(seeds), count))
    own = {}
    for i in ids:
        if i in seeds: own[i] = i; continue
        x, y, w, h = st2[i, 0], st2[i, 1], st2[i, 2], st2[i, 3]; cx, cy = x + w / 2, y + h / 2
        own[i] = min(seeds, key=lambda s_: np.hypot(cx - (st2[s_, 0] + st2[s_, 2] / 2), cy - (st2[s_, 1] + st2[s_, 3] / 2)))
    seeds.sort(key=lambda i: st2[i, 0] + st2[i, 2] / 2)
    groups = []
    for sd in seeds:
        m = np.zeros(alpha.shape, bool)
        for i, o in own.items():
            if o == sd: m |= (lab2 == i)
        m = cv2.dilate(m.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
        xs_ = np.where(m.any(axis=0))[0]
        groups.append((xs_[0], xs_[-1], m))
for x0, x1, m in groups:
    sub = rgba[:, x0:x1 + 1].copy()
    if m is not None: sub[..., 3] = np.where(m[:, x0:x1 + 1], sub[..., 3], 0)
    rows = (sub[..., 3] > 50).any(axis=1); ys = np.where(rows)[0]
    crop = sub[ys[0]:ys[-1] + 1]
    frames.append((crop, body_of(crop)))

maxw = int(opts.get('maxw', 0))
if maxw:
    big = max(f[0].shape[1] for f in frames)
    if big > maxw:
        k = maxw / big
        frames = [(np.array(Image.fromarray(c).resize((max(1, int(c.shape[1] * k)), max(1, int(c.shape[0] * k))), Image.LANCZOS)), by * k) for c, by in frames]

up = int(max(by for c, by in frames)) + 4
down = int(max(c.shape[0] - by for c, by in frames)) + 4
W = max(c.shape[1] for c, by in frames) + 8
H = up + down
for k, (c, by) in enumerate(frames):
    cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    cv.alpha_composite(Image.fromarray(c), ((W - c.shape[1]) // 2, int(up - by)))
    f = '%s_%d.webp' % (name, k)
    cv.save(OUT / f, 'WEBP', quality=92, method=6)
    man['%s_%d' % (name, k)] = [f, W, H, round(up / H, 3)]
    print('saved', f, W, H, 'bodyY', round(up / H, 3))
MAN.write_text(json.dumps(man, indent=1))
