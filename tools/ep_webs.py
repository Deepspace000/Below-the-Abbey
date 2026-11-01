"""Cuts the cobweb sheet (3 x 2, Gemini, flat magenta) into assets/ep/web2_<n>.webp: fine threads keep their softness (no erosion), colour defringed to pale grey.
    python tools/ep_webs.py <sheet> cells=3,4,5 names=0,1,2"""
import sys, json, pathlib
import numpy as np
from PIL import Image
src = sys.argv[1]; o = dict(a.split('=', 1) for a in sys.argv[2:])
cells = [int(v) for v in o['cells'].split(',')]; names = o['names'].split(',')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'; LST = OUT / 'list.json'; lst = json.loads(LST.read_text())
A = np.asarray(Image.open(src).convert('RGB')).astype(np.float32); H, W = A.shape[:2]
for c, nm in zip(cells, names):
    j, i = divmod(c, 3)
    cell = A[int(j * H / 2) + 6:int((j + 1) * H / 2) - 6, int(i * W / 3) + 6:int((i + 1) * W / 3) - 6]
    r, g, b = cell[..., 0], cell[..., 1], cell[..., 2]
    # the background colour of this sheet: median of the border
    bg = np.median(np.concatenate([cell[:20].reshape(-1, 3), cell[:, :20].reshape(-1, 3)]), 0)
    d = np.sqrt(((cell - bg) ** 2).sum(-1))
    a = np.clip((d - 30) / 120, 0, 1)
    # thread colour: lift toward pale grey so dark pink mixes disappear; keep the dark spider
    lum = cell.mean(-1, keepdims=True)
    col = np.where(a[..., None] > .5, cell, np.repeat(np.clip(lum * 0 + 215, 0, 255), 3, -1)); col = np.minimum(col, 235)
    col = cell * .0 + np.clip(np.minimum(cell, 235), 0, 255)
    col[..., 1] = np.maximum(col[..., 1], col[..., 0] * .93); col[..., 2] = np.minimum(col[..., 2], col[..., 1] * 1.04 + 4); col[..., 0] = np.minimum(col[..., 0], col[..., 1] * 1.04 + 4)
    gr = cell.mean(-1, keepdims=True); dark = (gr < 120)
    col = np.where(dark, col, np.minimum(gr * 1.0 + 25, 236) * np.array([1.0, .98, .93]))
    ys, xs = np.nonzero(a > .25)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    im = Image.fromarray(np.dstack([col, a * 255])[y0:y1, x0:x1].astype(np.uint8), 'RGBA')
    if im.height > 512: im = im.resize((round(im.width * 512 / im.height), 512), Image.LANCZOS)
    k = 'web2_' + nm; im.save(OUT / (k + '.webp'), quality=92)
    lst[k] = {'file': k + '.webp', 'w': im.width, 'h': im.height, 'kind': 'sprite', 'sheet': pathlib.Path(src).stem}
    print(k, im.size)
LST.write_text(json.dumps(lst, indent=0))
