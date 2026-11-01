"""Cuts the bone-remains sheets (ART-HOLD/ep/bones_*.jpg, Gemini, flat magenta) into assets/ep/ep names bn_<name>.

    python tools/bn_ingest.py <sheet> names=a,b,c,...   (pieces found by connected blobs, read row by row, left to right; use - to skip one)
    python tools/bn_ingest.py <sheet> list=1             (only prints the blobs)
Same keying as tools/ep_ingest.py sprite; the bottom edge of every piece is kept; the piece keeps its size (max 640 px wide).
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
src = sys.argv[1]
opts = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'
LST = OUT / 'list.json'
lst = json.loads(LST.read_text())
A = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)

def magness(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    return np.clip((m - 40) / 70, 0, 1) * (np.abs(r - b) < 110)

def defringe(c, m):
    fr = (m < .97)[..., None]
    neu = c.copy(); neu[..., 0] = np.minimum(c[..., 0], c[..., 1] * 1.15 + 10); neu[..., 2] = np.minimum(c[..., 2], c[..., 1] * 1.15 + 10)
    return np.where(fr, neu, c)

fg = magness(A) < .5
lab, n = ndi.label(ndi.binary_dilation(fg, iterations=int(opts.get('gap', 28))))
objs = []
for i, sl in enumerate(ndi.find_objects(lab)):
    area = (fg[sl] & (lab[sl] == i + 1)).sum()
    if area < 4000: continue
    objs.append((sl, area))
# rows: group by vertical centre
objs.sort(key=lambda o: (o[0][0].start + o[0][0].stop) / 2)
rows = []
for o in objs:
    cy = (o[0][0].start + o[0][0].stop) / 2
    if rows and abs(rows[-1][0] - cy) < 150: rows[-1][1].append(o)
    else: rows.append([cy, [o]])
ordered = [o for r in rows for o in sorted(r[1], key=lambda o: o[0][1].start)]
for k, (sl, area) in enumerate(ordered):
    print(k, 'x', sl[1].start, sl[1].stop, 'y', sl[0].start, sl[0].stop, 'w', sl[1].stop - sl[1].start, 'h', sl[0].stop - sl[0].start)
if 'names' not in opts: sys.exit()
names = opts['names'].split(',')
for k, ((sl, area), nm) in enumerate(zip(ordered, names)):
    if nm == '-': continue
    pad = 6
    y0, y1 = max(0, sl[0].start - pad), min(A.shape[0], sl[0].stop + pad); x0, x1 = max(0, sl[1].start - pad), min(A.shape[1], sl[1].stop + pad)
    c = A[y0:y1, x0:x1].copy(); m = 1 - magness(c); c = defringe(c, m)
    # drop other blobs that fell inside the box
    keep = ndi.binary_dilation(fg[y0:y1, x0:x1] & (lab[y0:y1, x0:x1] == lab[sl][lab[sl] > 0][0]), iterations=3)
    m = m * keep
    band = (ndi.binary_erosion(m > .5, iterations=14) == 0)[..., None]   # the rim: take the magenta glow out of it
    neu = c.copy(); neu[..., 0] = np.minimum(c[..., 0], c[..., 1] * 1.08 + 4); neu[..., 2] = np.minimum(c[..., 2], c[..., 1] * 1.08 + 4)
    c = np.where(band, neu, c)
    mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.0))
    out = Image.fromarray(np.dstack([np.clip(c, 0, 255), np.asarray(mi)]).astype(np.uint8), 'RGBA')
    bb = out.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox(); out = out.crop(bb)
    if out.width > 640: out = out.resize((640, round(out.height * 640 / out.width)), Image.LANCZOS)
    key = 'bn_' + nm; fn = key + '.webp'; out.save(OUT / fn, quality=90)
    lst[key] = {'file': fn, 'w': out.width, 'h': out.height, 'kind': 'sprite', 'sheet': pathlib.Path(src).stem}
    print(key, out.width, out.height)
LST.write_text(json.dumps(lst, indent=0))
