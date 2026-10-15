"""Cuts a Gemini sheet of objects on flat magenta into an even cols x rows grid, one picture per cell (for sheets whose pieces touch
or sit close together, where ingest_kh.py would join them).

    python tools/ingest_grid.py <sheet.jpg> <name> <cols> <rows>      ->  assets/kh/<name>_<k>.webp  and manifest entries
"""
import sys, json, pathlib
import numpy as np
from PIL import Image
src, name, cols, rows = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'kh'
MAN = OUT / 'manifest.json'; man = json.loads(MAN.read_text())
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int); H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = (r > 140) & (b > 140) & (g < 125) & (np.abs(r - b) < 90)
for k in [k for k in man if k.startswith(name + '_')]:
    (OUT / man[k]['file']).unlink(missing_ok=True); del man[k]
# label every connected piece of the sheet, then give each piece to the grid cell its middle is in
from collections import deque
fg = ~mag; lab = np.zeros((H, W), np.int32); comps = []; n = 0
for y0 in range(H):
    for x0 in range(W):
        if fg[y0, x0] and not lab[y0, x0]:
            n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
            while q:
                cy_, cx_ = q.popleft(); pts.append((cy_, cx_))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy_ + dy, cx_ + dx
                        if 0 <= ny < H and 0 <= nx < W and fg[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
            comps.append((n, pts))
cell_of = {}
for (cid, pts) in comps:
    if len(pts) < 60: continue
    ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
    cell_of[cid] = (min(rows - 1, int(np.mean(ys) * rows / H)), min(cols - 1, int(np.mean(xs) * cols / W)))
k = 0
for cy in range(rows):
    for cx in range(cols):
        ids = [c for c, v in cell_of.items() if v == (cy, cx)]
        keep = np.isin(lab, ids) if ids else np.zeros((H, W), bool)
        ys, xs = np.where(keep)
        if len(ys) < 40: k += 1; continue
        sub = a.copy(); m = ~keep
        t = m.copy(); near = np.zeros_like(m)
        for dy in range(-2, 3):
            for dx in range(-2, 3): near |= np.roll(np.roll(t, dy, 0), dx, 1)
        edge = near & keep
        rr, gg, bb = sub[..., 0], sub[..., 1], sub[..., 2]
        cast = edge & (rr - gg > 25) & (bb - gg > 25)
        sub[..., 0] = np.where(cast, gg, rr); sub[..., 2] = np.where(cast, gg, bb)
        rgba = np.dstack([sub.astype(np.uint8), keep.astype(np.uint8) * 255])
        pic = Image.fromarray(rgba, 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        fn = '%s_%d.webp' % (name, k); pic.save(OUT / fn, quality=92, method=6)
        man['%s_%d' % (name, k)] = {'file': fn, 'w': pic.width, 'h': pic.height, 'kind': 'sprite', 'sheet': name}
        k += 1
MAN.write_text(json.dumps(man, indent=0)); print(name, k, 'cells')
