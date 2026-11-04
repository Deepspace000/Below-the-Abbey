"""Cuts a Gemini sheet of loose beach pieces on flat chroma green into assets/yar_<name>.png (transparent, soft contact shadow kept).
    python tools/yar_beach_cut.py <sheet> names=a,b,c  [rows=2] [k=.00033] [maxpx=300] [merge=16] [kw=world units per sheet px of WIDTH instead of k] [rot=name:90,...] [out=dir] [dry=1]
Pieces are found as connected blobs (merge = dilation in sheet pixels), ordered row by row, left to right.
Prints one line per piece: name, w, h, world height (k * blob height in sheet pixels) for NPC_H in src/desert/yarrim.js."""
import sys, json, pathlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src = sys.argv[1]; o = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
names = o['names'].split(','); rows = int(o.get('rows', 2)); k = float(o.get('k', .00033)); maxpx = int(o.get('maxpx', 300)); mg = int(o.get('merge', 16))
rot = dict((p.split(':')[0], int(p.split(':')[1])) for p in o.get('rot', '').split(',') if p)
OUT = pathlib.Path(o.get('out', str(pathlib.Path(__file__).resolve().parent.parent / 'assets')))
A = np.asarray(Image.open(src).convert('RGB')).astype(np.float32); H, W = A.shape[:2]
r, g, b = A[..., 0], A[..., 1], A[..., 2]
bgg = np.median(np.concatenate([g[:20, :20].ravel(), g[-20:, -20:].ravel(), g[:20, -20:].ravel()]))
green = g - np.maximum(r, b)
bgd = np.median(green[:20, :20])
# 0 = background, 1 = object; shadow = greenish but darker
isbg = (green > bgd * .8) & (g > bgg * .9)
shadow = (green > 40) & ~isbg
alpha = np.where(isbg, 0, 1.0)
alpha = np.where(shadow, np.clip((bgg - g) / bgg * 1.3, 0, .55), alpha)
# partly green edge pixels of the object: soften alpha, despill
edge = (~isbg) & (~shadow) & (green > 12)
alpha = np.where(edge, np.clip(1 - green / (bgd * .8), .25, 1), alpha)
mask = alpha > .45
lab, n = ndi.label(ndi.binary_dilation(mask, iterations=mg))
objs = ndi.find_objects(lab)
cand = []
for i, sl in enumerate(objs):
    m = (lab[sl] == i + 1) & mask[sl]
    if m.sum() < 600: continue
    ys, xs = np.nonzero(m)
    cand.append((sl[0].start + ys.min(), sl[0].start + ys.max() + 1, sl[1].start + xs.min(), sl[1].start + xs.max() + 1, i + 1))
# keep soft shadow just under: expand box a bit
cand.sort(key=lambda c: (int((c[0] + c[1]) / 2 / (H / rows)), c[2]))
print('found', len(cand), 'pieces, names', len(names))
out = A.copy()
gg = np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2]) + 6)
out[..., 1] = np.where(shadow | isbg, out[..., 1], gg)
out[..., 0:3] = np.where(shadow[..., None], np.array([28, 24, 14]), out[..., 0:3])
rgba = np.dstack([out, alpha * 255]).astype(np.uint8)
meta = {}
for (y0, y1, x0, x1, li), nm in zip(cand, names):
    pad = 6; y0 = max(0, y0 - pad); x0 = max(0, x0 - pad); y1 = min(H, y1 + pad + 6); x1 = min(W, x1 + pad)
    piece = rgba[y0:y1, x0:x1].copy()
    keep = ndi.binary_dilation(lab[y0:y1, x0:x1] == li, iterations=mg + 4)
    piece[..., 3] = np.where(keep, piece[..., 3], 0)
    im = Image.fromarray(piece, 'RGBA')
    if nm in rot: im = im.rotate(rot[nm], expand=True, resample=Image.BICUBIC)
    bb = im.getchannel('A').point(lambda v: 255 if v > 14 else 0).getbbox()
    im = im.crop(bb)
    wh = (im.size[1] * k) if 'kw' not in o else (im.size[0] * float(o['kw']) * im.size[1] / im.size[0])
    s = min(1, maxpx / max(im.size)); im = im.resize((max(1, round(im.size[0] * s)), max(1, round(im.size[1] * s))), Image.LANCZOS)
    if not o.get('dry'): im.save(OUT / ('yar_' + nm + '.png'), optimize=True)
    meta[nm] = round(wh, 3)
    print(nm, im.size, round(wh, 3))
print(json.dumps(meta))
