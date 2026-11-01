"""Cuts the Gemini sheets of the Thornwick roofs (src/desert/thornwick_roofs.js) into assets/tkr/.
    python tools/tkr_ingest.py
Sheets (ART-HOLD/tkr_sheets, 1024 px, 2 by 2, painted by Gemini in strict front elevation):
  slopes.png   four roof surfaces (slate, shingle, thatch, clay tile), eave at the bottom, ridge at the top -> slope_<name>.webp, made to repeat sideways
  gables.png   four gable triangles on magenta -> gable_<name>.webp (alpha; the colour is spread into the clear part so a sample at the very edge stays painted)
  chimneys.png two chimney stack faces, a church tower face and a spire on magenta -> chim_<name>.webp, tower.webp, spire.webp, spirex.webp (the iron cross)
Code only cuts, keys out the magenta, blends the side seam of the slopes and grades nothing."""
import pathlib
import numpy as np
from PIL import Image, ImageFilter
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'ART-HOLD' / 'tkr_sheets'
OUT = ROOT / 'assets' / 'tkr'; OUT.mkdir(exist_ok=True)

def load(n): return np.asarray(Image.open(SRC / n).convert('RGB')).astype(np.float32)
def magness(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return np.clip(((np.minimum(r, b) - g) - 40) / 60, 0, 1) * (np.abs(r - b) < 120)
def save(arr, alpha, name, q=90):
    rgba = np.dstack([np.clip(arr, 0, 255), np.clip(alpha, 0, 255)]).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(OUT / (name + '.webp'), quality=q, method=6)
    print(name, rgba.shape[1], 'x', rgba.shape[0])
def box(mask, x0, y0, x1, y1, thr=.5):
    sub = mask[y0:y1, x0:x1]; ys = np.where(sub.sum(1) >= 3)[0]; xs = np.where(sub.sum(0) >= 3)[0]
    return x0 + xs[0], y0 + ys[0], x0 + xs[-1] + 1, y0 + ys[-1] + 1
def defringe(rgb, m):
    """the magenta key leaves a pink cast on the edge pixels: there red and blue are held down to the level of green"""
    rgb = rgb.copy(); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    near = np.asarray(Image.fromarray(((m > .02) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0
    cast = near & (r > g + 8) & (b > g + 8)
    lim = g * 1.12 + 10
    rgb[..., 0] = np.where(cast, np.minimum(r, lim), r); rgb[..., 2] = np.where(cast, np.minimum(b, lim), b)
    return rgb
def cutout(A, m, x0, y0, x1, y1):
    rgb = defringe(A[y0:y1, x0:x1], m[y0:y1, x0:x1]); mm = m[y0:y1, x0:x1]
    a = np.where(mm > .12, 0, (1 - mm) * 255)
    return rgb, a
def spread(rgb, a):
    """push the painted colour into the transparent pixels (several blurred passes), so that bilinear or edge samples never pick up magenta"""
    rgb = rgb.copy(); w = (a > 127).astype(np.float32)
    acc = rgb * w[..., None]; ww = w.copy()
    for k in range(40):
        if ww.min() > 0: break
        im = Image.fromarray(np.clip(acc, 0, 255).astype(np.uint8)); iw = Image.fromarray((np.clip(ww, 0, 1) * 255).astype(np.uint8))
        b = np.asarray(im.filter(ImageFilter.BoxBlur(2))).astype(np.float32); bw = np.asarray(iw.filter(ImageFilter.BoxBlur(2))).astype(np.float32) / 255
        nw = (ww <= 0) & (bw > 0.01)
        acc[nw] = b[nw] / np.maximum(bw[nw], 1e-3)[..., None] * 1.0; ww[nw] = 1
        acc = np.where(ww[..., None] > 0, acc, 0)
    out = np.where(w[..., None] > 0, rgb, acc)
    return out

# ---- slopes: swatch boxes, cut above the dark eave band, side seam blended
A = load('slopes.png'); M = magness(A) > .5
for (name, qx, qy, cut) in [('slate', 0, 0, 430), ('shingle', 1, 0, 430), ('thatch', 0, 1, 372), ('tile', 1, 1, 424)]:
    x0, y0, x1, y1 = box(~M, qx * 512, qy * 512, qx * 512 + 512, qy * 512 + 512)
    top = {'thatch': 16}.get(name, 24)   # the dark strip (or magenta) above the ridge row
    s = A[y0 + top:y0 + cut, x0 + 6:x1 - 6]
    h, w = s.shape[:2]; b = int(w * .16)
    t = np.linspace(0, 1, b)[None, :, None]
    left = s[:, :b] * t + s[:, w - b:] * (1 - t)   # the left edge now runs on from the right edge
    out = np.concatenate([left, s[:, b:w - b]], axis=1)
    save(out, np.full(out.shape[:2], 255.), 'slope_' + name)

# ---- gables
A = load('gables.png'); m = magness(A)
for (name, qx, qy) in [('timber', 0, 0), ('stone', 1, 0), ('boards', 0, 1), ('ochre', 1, 1)]:
    x0, y0, x1, y1 = box(m < .5, qx * 512, qy * 512, qx * 512 + 512, qy * 512 + 512)
    rgb, a = cutout(A, m, x0, y0, x1, y1)
    save(spread(rgb, a), a, 'gable_' + name)

# ---- chimneys, tower, spire
A = load('chimneys.png'); m = magness(A)
for (name, qx, qy) in [('chim_brick', 0, 0), ('chim_stone', 1, 0), ('tower', 0, 1), ('spire_all', 1, 1)]:
    x0, y0, x1, y1 = box(m < .5, qx * 512, qy * 512, qx * 512 + 512, qy * 512 + 512)
    rgb, a = cutout(A, m, x0, y0, x1, y1)
    if name != 'spire_all':
        save(spread(rgb, a), a, name); continue
    # the spire: the cross on its iron rod above the slate, and the slate body from the first row as wide as a fifth of the base
    wrow = (a > 127).sum(1); base = wrow.max(); top = int(np.argmax(wrow > base * .07))
    print('spire rows', y1 - y0, 'cross rows', top)
    save(spread(rgb[:top], a[:top]), a[:top], 'spirex')
    save(spread(rgb[top:], a[top:]), a[top:], 'spire')
