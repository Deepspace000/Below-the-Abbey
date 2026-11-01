"""Cuts the hanging-hide sheet (Gemini, flat magenta) into assets/ep/hide_<n>.webp by connected pieces (the sheet is not a clean grid).
    python tools/ep_hides.py <sheet> [stretch=1.3] [px=640]
Each piece is keyed, defringed, cropped, stretched taller so the hides read long (up to aspect 1:2.4), listed in assets/ep/list.json as kind sprite."""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
src = sys.argv[1]; opts = dict(a.split('=', 1) for a in sys.argv[2:])
DARK = set(int(v) for v in opts.get('dark', '').split(',') if v); SKIP = set(int(v) for v in opts.get('skip', '').split(',') if v)
STR = float(opts.get('stretch', 1.3)); PX = int(opts.get('px', 640))
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'; LST = OUT / 'list.json'
lst = json.loads(LST.read_text())
A = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
m = np.clip((np.minimum(r, b) - g - 40) / 70, 0, 1) * (np.abs(r - b) < 110)
fg = m < .5
lab, n = ndi.label(ndi.binary_dilation(fg, iterations=5))
objs = ndi.find_objects(lab)
pieces = []
for i, sl in enumerate(objs):
    mask = fg & (lab == i + 1)
    if mask.sum() < 20000: continue
    pieces.append((sl[0].start // 600, sl[1].start, sl, mask))
pieces.sort(key=lambda p: (p[0], p[1]))
for k, (_, _, sl, mask) in enumerate(pieces):
    if k in SKIP: continue
    ys, xs = np.nonzero(mask)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    c = A[y0:y1, x0:x1].copy(); mm = 1 - m[y0:y1, x0:x1]
    mm = mm * mask[y0:y1, x0:x1]
    fr = (mm < .97)[..., None]
    neu = c.copy(); neu[..., 0] = np.minimum(c[..., 0], c[..., 1] * 1.15 + 10); neu[..., 2] = np.minimum(c[..., 2], c[..., 1] * 1.15 + 10)
    c = np.where(fr, neu, c)
    if k in DARK:   # pale leather reads as cloth against the wall: darker and more contrast
        c = np.clip((c * .66 - 128 * .66) * 1.25 + 128 * .66, 0, 255)
    # a dark ragged rim so every hide has a readable silhouette on the wall (hide edges are dark and greasy)
    inner = np.asarray(Image.fromarray((mm * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7))).astype(np.float32) / 255
    rim = np.clip(mm - inner, 0, 1)[..., None]
    c = c * (1 - rim * .55) + np.array([28, 20, 14]) * rim * .55
    mi = Image.fromarray((mm * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
    im = Image.fromarray(np.dstack([np.clip(c, 0, 255), np.asarray(mi)]).astype(np.uint8), 'RGBA')
    w, h = im.size; asp = h / w
    f = min(STR, 2.4 / asp) if asp < 2.4 else 1.0
    H = round(h * f); W = w
    if H > PX: W = round(W * PX / H); H = PX
    im = im.resize((max(1, W), H), Image.LANCZOS)
    nm = 'hide_%d' % k; fn = nm + '.webp'; im.save(OUT / fn, quality=90)
    lst[nm] = {'file': fn, 'w': im.width, 'h': im.height, 'kind': 'sprite', 'sheet': pathlib.Path(src).stem}
    print(nm, (x0,y0,x1,y1), im.width, im.height, round(im.height / im.width, 2))
LST.write_text(json.dumps(lst, indent=0))
