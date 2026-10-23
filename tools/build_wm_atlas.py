"""Packs the hand-painted world map pictures into two atlas sheets and writes the table the game reads.

    python tools/build_wm_atlas.py

Reads the cut pieces from ART-HOLD/map_icons/cut (place icons, tools/ingest_sprite.py) and ART-HOLD/map_icons/cut2
(scenery, tools/cut_components.py), picks and sizes them as listed below, and writes
    assets/wm_a.png   the place icons, landmarks and sea creatures (big)
    assets/wm_s.png   trees, pines, mountains, hills, dunes in six tints, palms (small)
    src/desert/maps_world_atlas.js   const WMN_RECTS={name:[page,x,y,w,h]}
Sizes are in pixels in the atlas; the game scales them to map units.
"""
import os, sys, json
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C1 = os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'cut')
C2 = os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'cut2')

def load(p): return Image.open(p).convert('RGBA')
def fit(im, w=None, h=None):
    s = (w / im.width) if w else (h / im.height)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)

def tint(im, rgb, lift=1.0):
    """Recolours a sand dune: the luminance of the painting is kept, the colour becomes rgb."""
    a = np.array(im).astype(float)
    g = a[..., :3].mean(axis=2)
    k = np.clip(g / 205.0, 0, 1.25)[..., None]
    out = np.array(rgb, float)[None, None, :] * k * lift
    mix = .86
    a[..., :3] = np.clip(out * mix + a[..., :3] * (1 - mix), 0, 255)
    return Image.fromarray(a.astype(np.uint8))

A = {}   # big
S = {}   # small
# ---- place icons (stage 1) ----
ICON_H = 260
for nm in ['town', 'seaside', 'castle', 'desertcity', 'cave', 'mine', 'graves', 'crypt', 'rubymaze', 'pyramid', 'spire', 'abbey', 'oaks', 'pines', 'mountains']:
    im = load(os.path.join(C1, nm + '.png'))
    A['i_' + nm] = fit(im, w=ICON_H) if im.width > im.height * 1.2 else fit(im, h=ICON_H)
# the Deeper Hollow's maze: the ruby maze in stone grey
mz = A['i_rubymaze'].copy(); arr = np.array(mz).astype(float); t = np.clip(arr[..., :3].mean(axis=2) / 255 * 1.25, 0, 1)[..., None]
dk, md, lt = np.array([40, 34, 28.]), np.array([128, 118, 100.]), np.array([214, 204, 180.])
col = np.where(t < .5, dk + (md - dk) * (t * 2), md + (lt - md) * ((t - .5) * 2)); arr[..., :3] = col; A['i_stonemaze'] = Image.fromarray(arr.astype(np.uint8))
# ---- landmarks (cut2 lm_NN) ----
LM = {'moor': 0, 'drowned': 1, 'lighthouse': 2, 'volcano': 3, 'monastery': 4, 'grove': 5, 'cloud': 6, 'storm': 7, 'hamlet': 8, 'ruin': 9, 'waves': 10}
for nm, i in LM.items():
    im = load(os.path.join(C2, 'lm_%02d.png' % i)); A['l_' + nm] = fit(im, w=ICON_H) if nm in ('moor', 'cloud', 'storm', 'waves', 'grove') else fit(im, h=ICON_H)
# ---- sea creatures (cut2 seab_NN) ----
SEA = {'caravel': 0, 'galleon': 2, 'boat': 3, 'serpent': 4, 'kraken': 5, 'kraken2': 6, 'whale': 7, 'whale2': 8, 'dolphins': 9, 'stack': 11, 'rowboat': 12}
for nm, i in SEA.items():
    im = load(os.path.join(C2, 'seab_%02d.png' % i)); A['c_' + nm] = fit(im, w=190)
# ---- scenery ----
OAK = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12]      # 08 is a loose bush, left out; 00 was a fragment
for k, i in enumerate(OAK):
    im = load(os.path.join(C2, 'oak_%02d.png' % i)); S['oak%d' % k] = fit(im, h=round(im.height * .5))
PINE = [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14]
for k, i in enumerate(PINE):
    im = load(os.path.join(C2, 'pine_%02d.png' % i)); S['pine%d' % k] = fit(im, h=round(im.height * .5))
for k in range(12):
    im = load(os.path.join(C2, 'mtnb_%02d.png' % k)); S['mtn%d' % k] = fit(im, w=round(im.width * .66))
HILL = [0, 1, 2, 4, 6, 8, 9, 12, 3, 14, 5]    # the first eight are green hills, then a rocky mound, a heather mound, a red rock hill
for k, i in enumerate(HILL):
    im = load(os.path.join(C2, 'hill_%02d.png' % i)); S['hill%d' % k] = fit(im, w=round(im.width * .72))
DUNE = [4, 5, 6, 7, 8, 9, 10, 11]
TINTS = {'sand': None, 'red': (214, 128, 86), 'blue': (150, 176, 206), 'white': (240, 236, 224), 'gold': (232, 184, 62), 'violet': (170, 140, 192)}
for tn, rgb in TINTS.items():
    for k, i in enumerate(DUNE):
        im = fit(load(os.path.join(C2, 'des_%02d.png' % i)), w=round(load(os.path.join(C2, 'des_%02d.png' % i)).width * .69))
        S['dune_%s%d' % (tn, k)] = tint(im, rgb) if rgb else im
for k in range(4):
    im = load(os.path.join(C2, 'des_%02d.png' % k)); S['palm%d' % k] = fit(im, h=round(im.height * .7))
for k, i in enumerate([12, 13]):
    im = load(os.path.join(C2, 'des_%02d.png' % i)); S['rock%d' % k] = fit(im, w=round(im.width * .69))

# ---- dirt path patches: straightened along their long axis, the pink fringe taken out of the edge, the edge softened ----
from PIL import ImageFilter
def straighten(im):
    a = np.array(im).astype(float); al = a[..., 3] > 128
    ys, xs = np.nonzero(al); cx, cy = xs.mean(), ys.mean()
    cov = np.cov(np.vstack([xs - cx, ys - cy])); w, v = np.linalg.eigh(cov); ang = np.degrees(np.arctan2(v[1, -1], v[0, -1]))
    im2 = im.rotate(ang, resample=Image.BICUBIC, expand=True)
    bb = im2.getchannel('A').point(lambda t: 255 if t > 128 else 0).getbbox(); return im2.crop(bb)
def defringe(im):
    r, g, b, al = [np.array(c).astype(float) for c in im.split()]
    m = np.array(al) > 0
    b2 = np.where(m, np.minimum(b, g * .96), b); r2 = np.where(m, np.minimum(r, g + 52), r)
    al = Image.fromarray(np.array(al).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
    out = Image.merge('RGBA', (Image.fromarray(r2.astype(np.uint8)), Image.fromarray(g.astype(np.uint8)), Image.fromarray(b2.astype(np.uint8)), al)); return out
for k in range(16):
    im = load(os.path.join(C2, 'path_%02d.png' % k)); im = defringe(straighten(im)); S['path%d' % k] = fit(im, w=112)

# ---- the details laid on the rivers (cut by tools/cut_components.py into ART-HOLD/map_icons/cut3: boat_NN, dam_NN, grove_NN) ----
C3 = os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'cut3')
for k in range(8):
    S['rb%d' % k] = fit(load(os.path.join(C3, 'boat_%02d.png' % k)), w=100)       # rowing boats, seen from above, pointing right
for k in range(4):
    S['sb%d' % k] = fit(load(os.path.join(C3, 'boat_%02d.png' % (8 + k))), w=140)  # sailing boats, from the side, pointing right
for k, i in enumerate([3, 6, 7, 9, 10, 12]):
    S['dam%d' % k] = fit(load(os.path.join(C3, 'dam_%02d.png' % i)), w=200)        # wooden dams, lying across
for k in range(20):
    S['grv%d' % k] = fit(load(os.path.join(C3, 'grove_%02d.png' % k)), h=100)      # little groves
def pack(items, W, out, pad=6):
    names = sorted(items, key=lambda n: -items[n].height)
    x = y = rowh = 0; rects = {}
    for n in names:
        im = items[n]
        if x + im.width + pad > W: x = 0; y += rowh + pad; rowh = 0
        rects[n] = [x, y, im.width, im.height]; x += im.width + pad; rowh = max(rowh, im.height)
    H = y + rowh + pad
    H2 = 1
    while H2 < H: H2 *= 2
    sheet = Image.new('RGBA', (W, H2), (0, 0, 0, 0))
    for n, (rx, ry, rw, rh) in rects.items(): sheet.paste(items[n], (rx, ry))
    sheet.save(out, optimize=True)
    return rects, (W, H2)

ra, sza = pack(A, 2048, os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'atlas', 'wm_a.png'))
rs, szs = pack(S, 1536, os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'atlas', 'wm_s.png'))
R = {}
for n, r in ra.items(): R[n] = ['a'] + r
for n, r in rs.items(): R[n] = ['s'] + r
js = '/* The hand-painted world map pictures: where each one sits in assets/wm_a.png (big) and assets/wm_s.png (small). Written by tools/build_wm_atlas.py, do not edit. */\nconst WMN_RECTS=' + json.dumps(R, separators=(',', ':')) + ';\n'
open(os.path.join(ROOT, 'src', 'desert', 'maps_world_atlas.js'), 'w', encoding='utf-8').write(js)
print('A', len(A), sza, os.path.getsize(os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'atlas', 'wm_a.png')) // 1024, 'KB;  S', len(S), szs, os.path.getsize(os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'atlas', 'wm_s.png')) // 1024, 'KB')
