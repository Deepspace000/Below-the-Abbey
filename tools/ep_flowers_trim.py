"""(Run after ep_ingest.py sprite ... fl_0..) Trims the flower patch sprites (assets/ep/fl_*.webp) to sit on their root line: cuts the dangling roots and the drawn crack line so the game can join them to the real brick joint. The foot is cut along a wandering noisy line (never a straight edge), with a feathered ragged alpha, so stems and leaves end at different heights."""
import json, pathlib, numpy as np
from PIL import Image
D = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'
lst = json.loads((D / 'list.json').read_text())
for k in [k for k in lst if k.startswith('fl_')]:
    im = Image.open(D / lst[k]['file']).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    al = a[..., 3] > 128; lum = a[..., :3].mean(2); dark = al & (lum < 45)
    h, w = al.shape; cnt = dark.sum(1)
    lo = int(h * .5); r = lo + int(np.argmax(cnt[lo:]))   # the row with the longest dark run: the crack line
    top = r
    while top > 0 and cnt[top - 1] > cnt[r] * .35: top -= 1   # its upper edge
    rg = np.random.default_rng(int(k[3:]) * 17 + 3)
    base = max(top, 8); H2 = base + 6; a2 = a[:H2].copy()
    xs = np.arange(w); ph = rg.uniform(0, 6.28, 4)
    nz = .5 + .25 * np.sin(xs * .045 + ph[0]) + .15 * np.sin(xs * .13 + ph[1]) + .1 * np.sin(xs * .31 + ph[2]) + .15 * (rg.random(w) - .5)
    nz = np.convolve(nz, np.ones(5) / 5, 'same')
    deep = (rg.random(w) < .1) * rg.uniform(.5, 1, w)          # a few blades and stems reach lower than the rest
    cut = base + 4 - (np.clip(nz, 0, 1) * h * .2) * (1 - deep * .9)   # per-column cut row
    yy = np.arange(H2)[:, None]
    fa = np.clip((cut[None, :] - yy) / 4.0 + rg.random((H2, w)) * .35 - .15, 0, 1)   # ragged feather, no hard line
    a2[..., 3] *= fa
    im2 = Image.fromarray(a2.astype(np.uint8), 'RGBA')
    bb = im2.getbbox(); im2 = im2.crop(bb)
    im2.save(D / lst[k]['file'], quality=90)
    lst[k].update(w=im2.width, h=im2.height); print(k, im2.size, 'crack row', r, 'of', h)
(D / 'list.json').write_text(json.dumps(lst, indent=0))
