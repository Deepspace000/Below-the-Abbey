"""Removes stray specks from cut-out sprites: python tools/clean_sprite.py <png...>. Keeps connected parts (joined within 4 px) bigger than 1.2 percent of the biggest part;
turns leftover magenta-ish edge pixels grey-neutral and thins a 1 px magenta fringe."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
for f in sys.argv[1:]:
    im = Image.open(f).convert('RGBA'); a = np.array(im); al = a[..., 3]
    m = al > 24
    lab, n = ndi.label(ndi.binary_dilation(m, iterations=4))
    if n > 1:
        areas = ndi.sum(m, lab, range(1, n + 1)); keep = areas >= areas.max() * .012
        ok = np.isin(lab, np.where(keep)[0] + 1)
        a[~ok, 3] = 0
    rgb = a[..., :3].astype(float); pk = np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1]
    fix = (pk > 30) & (a[..., 3] > 0)
    for c in (0, 2): rgb[..., c][fix] = np.minimum(rgb[..., c][fix], rgb[..., 1][fix] + 30)
    a[..., :3] = rgb.clip(0, 255).astype(np.uint8)
    Image.fromarray(a, 'RGBA').save(f, optimize=True)
