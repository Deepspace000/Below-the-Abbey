"""Cuts a sheet of button slabs (flat magenta background, three states of one slab) into assets/ui/<style>/stone_<family>_<state>.webp
and updates assets/ui/<style>/manifest.json (every style folder is read by tools/inject.py, which writes src/desert/uilist.js for src/desert/stonebuttons.js).
Styles so far: stone (rough grey, mossy), sandstone (refined, square ends), tapered (polished sandstone, chamfered ends), gold (golden sandstone, chamfered ends).

    python tools/ingest_ui.py <style> <sheet.png> <family> [cap=<source px>] [pad=<source px>] [maxh=<px>] [label=<name shown to the player>]
                              [wl=<px> wt=<px>] [fallback=<style>]
    families: std (long buttons), slim (short ones), small (square ones)
    Winged slabs: wl is how far the wings stick out to the left and right of the bar, wt how far they rise above it (source px, measured on the cut slab);
    cap and pad are then measured from the slab's own edge, wings included. fallback names the style drawn instead where the wings do not fit.

The sheet holds three slabs of the same size: normal, lit (hover / selected) and pressed. They are found as blobs of non-magenta pixels and put in
order (a stack: top to bottom; a row: left to right). All three are cut to the size of the first. Stored per family in the manifest:
  cap  width of the left and right caps (9-slice: left cap, stretched middle, right cap), as a multiple of the slab height
  pad  how far the label must stay from each end (the end block with its rivet), as a multiple of the slab height
Example:  python tools/ingest_ui.py sheet.png std cap=290 pad=170
"""
import sys, json, pathlib
import numpy as np
from PIL import Image
from collections import deque

ROOT = pathlib.Path(__file__).resolve().parent.parent
style, src, name = sys.argv[1], sys.argv[2], sys.argv[3]
OUT = ROOT / 'assets' / 'ui' / style; OUT.mkdir(parents=True, exist_ok=True)
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text()) if MAN.exists() else {'label': style.capitalize(), 'files': {}, 'fam': {}}
opt = {}
for a in sys.argv[4:]:
    k, v = a.split('=', 1)
    if k == 'label': man['label'] = v
    elif k == 'fallback': man['fallback'] = v
    else: opt[k] = float(v)

im = Image.open(src).convert('RGB'); a = np.array(im).astype(float); H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mm = np.minimum(r, b) - g
edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
MAGC = np.median(edge, axis=0); BGM = float(np.minimum(MAGC[0], MAGC[2]) - MAGC[1])
A = np.clip((BGM * 0.62 - mm) / (BGM * 0.3), 0, 1)                  # matte: 1 on the slab, 0 on the magenta
ATRUE = np.where(mm > 15, np.clip(1 - (mm - 5) / (BGM - 5), 0.08, 1), 1.0)   # how much of an edge pixel is slab (to remove the pink cast)

# blobs of slab pixels (coarse grid to be quick), biggest three
fg = A > 0.5
S = 2; h, w = H // S, W // S
coarse = fg[:h * S, :w * S].reshape(h, S, w, S).mean(axis=(1, 3)) > 0.3
lab = np.zeros((h, w), np.int32); n = 0; comps = {}
for y0 in range(h):
    for x0 in range(w):
        if coarse[y0, x0] and not lab[y0, x0]:
            n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
            while q:
                y, x = q.popleft(); pts.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and coarse[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
            comps[n] = np.array(pts)
big = sorted(comps.items(), key=lambda kv: -len(kv[1]))[:3]
assert len(big) == 3, 'expected three slabs, found %d' % len(big)
boxes = []
for cid, p in big:
    boxes.append((int(p[:, 1].min()) * S, int(p[:, 0].min()) * S, int(p[:, 1].max()) * S + S, int(p[:, 0].max()) * S + S))
stack = np.ptp([(bx[0] + bx[2]) / 2 for bx in boxes]) < np.ptp([(bx[1] + bx[3]) / 2 for bx in boxes])
boxes.sort(key=lambda bx: (bx[1] if stack else bx[0]))
print('slabs', boxes, 'stack' if stack else 'row')

pics = []
for (x0, y0, x1, y1) in boxes:
    x0 = max(0, x0 - 6); y0 = max(0, y0 - 6); x1 = min(W, x1 + 6); y1 = min(H, y1 + 6)
    sub = a[y0:y1, x0:x1]; al = ATRUE[y0:y1, x0:x1][..., None]
    sub = np.clip((sub - (1 - al) * MAGC) / al, 0, 255)
    alpha = A[y0:y1, x0:x1]
    alpha = np.where(alpha > 0.98, 1.0, alpha)
    pic = Image.fromarray(np.dstack([sub.astype(np.uint8), (alpha * 255).astype(np.uint8)]), 'RGBA')
    ys, xs = np.where(alpha > 0.3)
    pics.append(pic.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
rw, rh = pics[0].size
maxh = opt.get('maxh')
if maxh and rh > maxh:
    rw, rh = round(rw * maxh / rh), int(maxh)
STATES = ['n', 'l', 'p']
for st, pic in zip(STATES, pics):
    if pic.size != (rw, rh): pic = pic.resize((rw, rh), Image.LANCZOS)
    fn = 'stone_%s_%s.webp' % (name, st)
    pic.save(OUT / fn, quality=90, method=6, lossless=False)
    man['files']['%s_%s' % (name, st)] = {'file': fn, 'w': rw, 'h': rh}
sc = rh / pics[0].size[1]
wl, wt = round(opt.get('wl', 0) * sc), round(opt.get('wt', 0) * sc); bh = rh - wt     # wings and the body (the button rectangle) in stored px
cap = opt.get('cap', rw * 0.25) * sc; pad = opt.get('pad', rw * 0.15) * sc
man['fam'][name] = {'cap': round((cap - wl) / bh, 3), 'pad': round((pad - wl) / bh, 3), 'ar': round((rw - 2 * wl) / bh, 3), 'wl': wl, 'wt': wt, 'bh': bh}
MAN.write_text(json.dumps(man, indent=1))
print(name, rw, 'x', rh, man['fam'][name])
