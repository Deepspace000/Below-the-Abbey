"""Cuts a marginalia sheet (vignettes on flat magenta) into transparent webp pictures in assets/mg.

    python tools/ingest_mg.py <sheet.png> <prefix> [tags]        ->  assets/mg/<prefix>_<k>.webp, updates assets/mg/manifest.json
Pieces are found as connected blobs of non-magenta pixels (blobs closer than ~10 px are merged, so lances and ropes stay with their
figure); pieces are numbered in reading order (rows, then columns). Pictures are scaled to at most 360 px wide.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image
from collections import deque
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'mg'; OUT.mkdir(exist_ok=True)
MAN = OUT / 'manifest.json'; man = json.loads(MAN.read_text()) if MAN.exists() else {}
src, prefix = sys.argv[1], sys.argv[2]; tags = sys.argv[3].split(',') if len(sys.argv) > 3 else []
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int); H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mm = np.minimum(r, b) - g
edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
MAGC = np.median(edge, axis=0); BGM = float(np.minimum(MAGC[0], MAGC[2]) - MAGC[1])
ATRUE = np.where(mm > 15, np.clip(1 - (mm - 5) / (BGM - 5), 0.1, 1), 1.0)          # how much of the pixel is picture (for removing the pink cast)
A = np.clip((BGM * 0.6 - mm) / (BGM * 0.25), 0, 1)             # steep matte: opaque unless mostly background
mag = A < 0.5
fg = ~mag
S = 2; h, w = H // S, W // S
coarse = fg[:h * S, :w * S].reshape(h, S, w, S).mean(axis=(1, 3)) > 0.2
d = coarse.copy()
for dy in (-1, 0, 1):
    for dx in (-1, 0, 1): d |= np.roll(np.roll(coarse, dy, 0), dx, 1)
lab = np.zeros((h, w), np.int32); n = 0; comps = {}
for y0 in range(h):
    for x0 in range(w):
        if d[y0, x0] and not lab[y0, x0]:
            n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
            while q:
                y, x = q.popleft(); pts.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and d[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
            comps[n] = np.array(pts)
COLS, ROWS = int(sys.argv[4]) if len(sys.argv) > 4 else 3, int(sys.argv[5]) if len(sys.argv) > 5 else 3
big = {c: p for c, p in comps.items() if len(p) >= 600}
cell = {}
for c, p in big.items():
    # the ground line (lowest wide part) decides the cell: use the x-centre of the lowest 8 rows of the blob
    ymax = p[:, 0].max(); low = p[p[:, 0] >= ymax - 6]
    cell[c] = (int((p[:, 0].mean()) * S * ROWS / H), min(COLS - 1, int(low[:, 1].mean() * S * COLS / W)))
for c, p in comps.items():
    if c in big or len(p) < 6: continue
    cy, cx = p.mean(axis=0); best = None
    for bc, bp in big.items():
        dist = min(np.hypot(bp[:, 0] - cy, bp[:, 1] - cx)) if len(bp) < 4000 else min(np.hypot(bp[::4, 0] - cy, bp[::4, 1] - cx))
        if best is None or dist < best[0]: best = (dist, bc)
    if best and best[0] < 40: cell[c] = cell[best[1]]
groups = {}
for c, cl in cell.items(): groups.setdefault(cl, []).append(c)
order = []
for cl in sorted(groups):
    ids = groups[cl]; pts = np.vstack([comps[c] for c in ids])
    order.append((ids, int(pts[:, 0].min()) * S, int(pts[:, 0].max()) * S + S, int(pts[:, 1].min()) * S, int(pts[:, 1].max()) * S + S))
for k in [k for k in man if k.startswith(prefix + '_')]:
    (OUT / man[k]['file']).unlink(missing_ok=True); del man[k]
for k, (ids, y0, y1, x0, x1) in enumerate(order):
    y0 = max(0, y0 - 6); x0 = max(0, x0 - 6); y1 = min(H, y1 + 6); x1 = min(W, x1 + 6)
    sub = a[y0:y1, x0:x1].copy(); m = mag[y0:y1, x0:x1]
    keepfull = np.zeros((H, W), bool)
    for cid in ids:
        pts = comps[cid]; keepfull[pts[:, 0] * S, pts[:, 1] * S] = True
    kb = np.kron(np.isin(lab, ids), np.ones((S, S), bool)); kb = np.pad(kb, ((0, H - kb.shape[0]), (0, W - kb.shape[1])))
    kd = kb[y0:y1, x0:x1].copy()
    for dy in range(-4, 5):
        for dx in range(-4, 5): kd |= np.roll(np.roll(kb[y0:y1, x0:x1], dy, 0), dx, 1)
    Ab = A[y0:y1, x0:x1] * kd
    al = ATRUE[y0:y1, x0:x1][..., None]
    sub = np.clip((sub - (1 - al) * MAGC) / al, 0, 255)
    alpha = Ab > 0.02
    sub = sub.copy()
    pic = Image.fromarray(np.dstack([sub.astype(np.uint8), (Ab * 255).astype(np.uint8)]), 'RGBA')
    ys, xs = np.where(Ab > 0.3)
    if len(ys) < 200: continue
    pic = pic.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    if pic.width > 360: pic = pic.resize((360, round(pic.height * 360 / pic.width)), Image.LANCZOS)
    fn = '%s_%d.webp' % (prefix, k); pic.save(OUT / fn, quality=92, method=6)
    man['%s_%d' % (prefix, k)] = {'file': fn, 'w': pic.width, 'h': pic.height, 'tags': tags}
MAN.write_text(json.dumps(man, indent=1)); print(prefix, len(order), 'pieces')
