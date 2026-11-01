"""Trims the flower patch sprites (assets/ep/fl_*.webp) to sit on their root line: cuts the dangling roots and the drawn crack line so the game can join them to the real brick joint."""
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
    a2 = a[:max(top, 8)]; im2 = Image.fromarray(a2.astype(np.uint8), 'RGBA')
    bb = im2.getbbox(); im2 = im2.crop(bb)
    im2.save(D / lst[k]['file'], quality=90)
    lst[k].update(w=im2.width, h=im2.height); print(k, im2.size, 'crack row', r, 'of', h)
(D / 'list.json').write_text(json.dumps(lst, indent=0))
