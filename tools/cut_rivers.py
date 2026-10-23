"""Cuts the painted river systems (Gemini pictures on flat magenta, ART-HOLD/map_icons/r<N>_river.jpg) into sprites for the world map.

    python tools/cut_rivers.py [N ...]

For each picture: the magenta is keyed out (fringe cleaned as in tools/ingest_sprite.py); the wide water at the mouth (the sea or bay the river runs into) is cut off with a soft fade,
so that the river ends where it meets the sea; the sprite is cropped and reduced to at most 1100 pixels; the place where the river ends (its mouth) is found.
Writes assets/wm_river<N>.png and src/desert/maps_world_river_meta.js (const WMR_META = [{f, w, h, mouth:[x,y], ...}], in sprite pixels).
"""
import os, sys, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'ART-HOLD', 'map_icons')
OUT = os.path.join(ROOT, 'assets')
MAXSIDE = 1100

def key_rgba(im):
    a = np.array(im.convert('RGB')).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    key = (r > 110) & (b > 110) & (r - g > 45) & (b - g > 45)
    mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    # the magenta that bled into the edge pixels: take it out of the colour
    a[..., 0] = np.minimum(r, np.maximum(g, 40) + 100); a[..., 2] = np.minimum(b, np.maximum(g, 40) + 100)
    rgb = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    inner = mask.filter(ImageFilter.MinFilter(5))
    arr = np.array(rgb).astype(float); w = (np.array(inner).astype(float) / 255)[..., None]
    blur = Image.fromarray((arr * w).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
    den = np.maximum(np.array(inner.filter(ImageFilter.GaussianBlur(4))).astype(float) / 255, .02)[..., None]
    fill = np.array(blur).astype(float) / den
    ring = (np.array(mask) > 0) & (np.array(inner) < 128)
    arr[ring] = fill[ring]
    return Image.merge('RGBA', (*Image.fromarray(arr.clip(0, 255).astype(np.uint8)).split(), mask))

def disk(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]; return (x * x + y * y) <= r * r

def process(n):
    im = Image.open(os.path.join(SRC, 'r%d_river.jpg' % n))
    rgba = key_rgba(im)
    al = np.array(rgba.getchannel('A')) > 128
    # the wide water: what is left of the picture's water after opening it with a disk wider than the river (done at a quarter of the size)
    sm = np.array(Image.fromarray((al * 255).astype(np.uint8)).resize((al.shape[1] // 4, al.shape[0] // 4), Image.BILINEAR)) > 128
    bay = ndimage.binary_opening(sm, structure=disk(19))
    bay = ndimage.binary_dilation(bay, structure=disk(7))
    bay_full = np.array(Image.fromarray((bay * 255).astype(np.uint8)).resize((al.shape[1], al.shape[0]), Image.BILINEAR)) > 128
    # the distance of every pixel from the bay, for a soft end
    d = ndimage.distance_transform_edt(~bay_full)
    fade = np.clip(d / 28.0, 0, 1)
    fade = fade * fade * (3 - 2 * fade)
    a_arr = np.array(rgba.getchannel('A')).astype(float) * fade
    # the picture's own edge: a river that ran off the picture fades out instead of ending in a straight cut
    yy, xx = np.mgrid[0:a_arr.shape[0], 0:a_arr.shape[1]]
    bd = np.minimum(np.minimum(xx, a_arr.shape[1] - 1 - xx), np.minimum(yy, a_arr.shape[0] - 1 - yy)) / 70.0
    bf = np.clip(bd, 0, 1); a_arr = a_arr * (bf * bf * (3 - 2 * bf))
    # keep the river: the biggest piece and whatever is joined to it (or lies close by); the rim of the bay that was left over at the edges goes
    lab, nl = ndimage.label(a_arr > 100)
    sizes = ndimage.sum(np.ones_like(lab), lab, index=np.arange(1, nl + 1))
    main = 1 + int(np.argmax(sizes))
    near_main = ndimage.binary_dilation(lab == main, structure=disk(26), iterations=1)
    keep_ids = [i + 1 for i, sz in enumerate(sizes) if (i + 1 == main) or (sz > 1500 and near_main[lab == i + 1].any())]
    keep = ndimage.binary_dilation(np.isin(lab, keep_ids), structure=disk(3))
    a_arr = np.where(keep, a_arr, 0)
    rgba.putalpha(Image.fromarray(a_arr.clip(0, 255).astype(np.uint8)))
    # the mouth: the part of the river that meets the bay
    near = (d < 90) & (a_arr > 100)
    ys, xs = np.nonzero(near)
    mouth = (float(xs.mean()), float(ys.mean())) if len(xs) else None
    bb = rgba.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    rgba = rgba.crop(bb)
    s = min(1.0, MAXSIDE / max(rgba.size))
    rgba = rgba.resize((round(rgba.width * s), round(rgba.height * s)), Image.LANCZOS)
    if mouth: mouth = ((mouth[0] - bb[0]) * s, (mouth[1] - bb[1]) * s)
    f = 'wm_river%d.png' % n
    rgba.save(os.path.join(OUT, f), optimize=True)
    return {'f': f, 'w': rgba.width, 'h': rgba.height, 'mouth': [round(mouth[0], 1), round(mouth[1], 1)] if mouth else None, 'scale': round(s, 4)}

if __name__ == '__main__':
    ids = [int(a) for a in sys.argv[1:]] or sorted(int(f[1]) for f in os.listdir(SRC) if f.startswith('r') and f.endswith('_river.jpg') and f[1].isdigit())
    meta = []
    for n in ids:
        m = process(n); meta.append(m); print(m)
    open(os.path.join(ROOT, 'src', 'desert', 'maps_world_river_meta.js'), 'w', encoding='utf-8').write(
        '/* The painted river systems of the world map: file, size and the place where the river ends (its mouth), in pixels of the picture. Written by tools/cut_rivers.py, do not edit. */\nconst WMR_META=' + json.dumps(meta, separators=(',', ':')) + ';\n')
