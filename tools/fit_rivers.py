"""Places the painted river systems on the world map where there is room for them.

    python tools/fit_rivers.py

Reads ART-HOLD/map_icons/fit/land_mask.png and world_fit.json (the land, and the rectangles of every place, name and title on the map, exported from the running game),
the sprites assets/wm_river<N>.png and src/desert/maps_world_river_meta.js (tools/cut_rivers.py), and writes src/desert/maps_world_river_fit.js:
    WMR_FIT = { placed: [[sprite index, x, y, rotation in degrees, mirrored, map units per sprite pixel], ...],
                pts: [x, y, x, y, ...]   (points on the rivers, for the scenery to keep clear of),
                lakes: [[x, y, rx, ry], ...]   (the old lakes that are still clear, and a small lake where a river ends inland) }
A river must lie wholly on land, clear of every place, name and title and of the other rivers (its mouth may stand in the sea). The mouth is preferred at a coast; the rivers
are spread out as far apart as the room allows, and the pictures are used in turn so that the same one is not seen again and again nearby.
"""
import os, json, re, math, random
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage
from scipy.signal import fftconvolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIT = os.path.join(ROOT, 'ART-HOLD', 'map_icons', 'fit')
J = json.load(open(os.path.join(FIT, 'world_fit.json')))
U, X0, Y0, W, H = J['U'], J['X0'], J['Y0'], J['W'], J['H']
land = np.array(Image.open(os.path.join(FIT, 'land_mask.png')).convert('L')) > 128
META = json.loads(re.search(r'=(\[.*\]);', open(os.path.join(ROOT, 'src', 'desert', 'maps_world_river_meta.js'), encoding='utf-8').read()).group(1))
META = [m for m in META if m['f'] in ('wm_river%d.png' % i for i in (1, 2, 3, 4, 5))]
random.seed(7); np.random.seed(7)
MAXN = 22; SCALES = [.10, .13, .16]; ROTS = [-30, -10, 10, 30]; MAXUSE = 5

def to_px(x, y): return ((x - X0) / U, (y - Y0) / U)
def rect_mask(rects, grow):
    m = np.zeros((H, W), bool)
    for r in rects:
        x0, y0 = to_px(r[0] - grow, r[1] - grow); x1, y1 = to_px(r[2] + grow, r[3] + grow)
        m[max(0, int(y0)):min(H, int(y1) + 1), max(0, int(x0)):min(W, int(x1) + 1)] = True
    return m
obst = rect_mask(J['obstacles'], 7)
# no rivers in the deserts, nor in the strip north of the part of the land that is shown (the mask ends at y = -500)
desert = rect_mask([[430, -40, 730, 320]], 0)
edge = np.zeros((H, W), bool); edge[:int(30 / U), :] = True; edge[:, :int(20 / U)] = True; edge[:, -int(20 / U):] = True
coast = ~ndimage.binary_erosion(land, iterations=int(10 / U))          # land within 10 units of the sea
invalid = (~land) | obst | desert | edge
sea = ~land

def sprite_alpha(m):
    a = np.array(Image.open(os.path.join(ROOT, 'assets', m['f'])).convert('RGBA').getchannel('A'))
    return a

SPR = []
for m in META:
    a = sprite_alpha(m)
    SPR.append({'m': m, 'a': a, 'img': Image.fromarray(a)})

def disk_img(size, cx, cy, r):
    im = Image.new('L', size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(im).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255); return im

def transform(k, s, rot, flip):
    """the sprite at s map units per pixel, mirrored and turned, as a mask at map-mask resolution; and the mouth mask the same way"""
    sp = SPR[k]; m = sp['m']; w, h = sp['img'].size
    f = s / U; nw, nh = max(2, round(w * f)), max(2, round(h * f))
    al = sp['img'].resize((nw, nh), Image.BILINEAR)
    mo = disk_img((w, h), m['mouth'][0], m['mouth'][1], 90).resize((nw, nh), Image.BILINEAR)
    if flip: al = ImageOps.mirror(al); mo = ImageOps.mirror(mo)
    al = al.rotate(rot, resample=Image.BILINEAR, expand=True); mo = mo.rotate(rot, resample=Image.BILINEAR, expand=True)
    return np.array(al) > 70, np.array(mo) > 128

placed = []; used = [0] * len(SPR)
inv = invalid.copy()
for n in range(MAXN):
    best = None
    order = list(range(len(SPR))); random.shuffle(order)
    for k in order:
        if used[k] >= MAXUSE: continue
        for s in SCALES:
            for rot in ROTS:
                for flip in (0, 1):
                    al, mo = transform(k, s, rot, flip)
                    core = al & ~mo
                    bad = fftconvolve(inv.astype(np.float32), core[::-1, ::-1].astype(np.float32), mode='valid')
                    ok = bad < .5
                    if not ok.any(): continue
                    seaov = fftconvolve(sea.astype(np.float32), mo[::-1, ::-1].astype(np.float32), mode='valid') / max(1, mo.sum())
                    ii, jj = np.nonzero(ok)
                    # the spread: how far from the rivers already placed
                    cx = X0 + (jj + al.shape[1] / 2) * U; cy = Y0 + (ii + al.shape[0] / 2) * U
                    if placed:
                        dmin = np.min([np.hypot(cx - p['cx'], cy - p['cy']) for p in placed], axis=0)
                    else:
                        dmin = np.full(len(cx), 400.0)
                    # where people will see it: close to the places of the map (the rivers go into the gaps between them), and not out at the far edges
                    dpl = np.min([np.hypot(cx - px, cy - py) for _, px, py in J['places']], axis=0)
                    seen = 7.0 * np.exp(-dpl / 170.0)
                    sc = np.minimum(dmin, 300) * .012 + seen + np.where(seaov[ii, jj] > .2, 2.0, 0) + seaov[ii, jj] * 1.0 - used[k] * 2 + np.random.rand(len(cx)) * .5 + s * 8
                    q = int(np.argmax(sc))
                    if best is None or sc[q] > best[0]:
                        best = (sc[q], k, s, rot, flip, int(ii[q]), int(jj[q]), al, mo, float(seaov[ii[q], jj[q]]))
    if best is None: break
    sc, k, s, rot, flip, i, j, al, mo, so = best
    h, w = al.shape
    p = {'k': k, 's': s, 'rot': rot, 'flip': flip, 'cx': X0 + (j + w / 2) * U, 'cy': Y0 + (i + h / 2) * U, 'i': i, 'j': j, 'al': al, 'mo': mo, 'sea': so}
    placed.append(p); used[k] += 1
    # the room it takes, and a margin round it so the next ones keep their distance
    grown = ndimage.binary_dilation(al, iterations=int(14 / U))
    inv[i:i + h, j:j + w] |= grown
    print('placed %d: sprite %d scale %.3f rot %d flip %d at (%.0f, %.0f), mouth in sea %.2f' % (n + 1, k, s, rot, flip, p['cx'], p['cy'], so))

# the points the scenery keeps clear of, and a lake where a river ends inland
pts = []
lakes = []
for p in placed:
    i, j, al = p['i'], p['j'], p['al']
    ys, xs = np.nonzero(al)
    for y, x in zip(ys[::2], xs[::2]):
        if (x + y) % 2 == 0:
            pts.append(round(X0 + (j + x) * U, 1)); pts.append(round(Y0 + (i + y) * U, 1))
    if p['sea'] < .2:
        my, mx = ndimage.center_of_mass(p['mo'])
        lakes.append([round(X0 + (j + mx) * U, 1), round(Y0 + (i + my) * U, 1), 13, 8])
# the old lakes that are still clear of everything
allrivers = np.zeros((H, W), bool)
for p in placed: allrivers[p['i']:p['i'] + p['al'].shape[0], p['j']:p['j'] + p['al'].shape[1]] |= ndimage.binary_dilation(p['al'], iterations=int(10 / U))
for lx, ly, rx, ry in J['lakes']:
    x0, y0 = to_px(lx - rx * 1.3, ly - ry * 1.3); x1, y1 = to_px(lx + rx * 1.3, ly + ry * 1.3)
    sl = (slice(max(0, int(y0)), int(y1) + 1), slice(max(0, int(x0)), int(x1) + 1))
    if not allrivers[sl].any() and not obst[sl].any():
        lakes.append([lx, ly, rx, ry])
out = {'placed': [[p['k'], round(p['cx'], 1), round(p['cy'], 1), p['rot'], p['flip'], p['s']] for p in placed], 'pts': pts, 'lakes': lakes}
open(os.path.join(ROOT, 'src', 'desert', 'maps_world_river_fit.js'), 'w', encoding='utf-8').write(
    '/* Where the painted river systems stand on the world map, found by tools/fit_rivers.py (do not edit): [sprite, x, y, turn in degrees, mirrored, map units per pixel]; the points on them, for the scenery to keep clear of; the lakes. */\nconst WMR_FIT=' + json.dumps(out, separators=(',', ':')) + ';\n')
print(len(placed), 'rivers,', len(pts) // 2, 'points,', len(lakes), 'lakes')
# a picture of the result
prev = np.zeros((H, W, 3), np.uint8); prev[land] = (150, 170, 120); prev[~land] = (90, 120, 150); prev[obst & land] = (200, 120, 100); prev[desert & land] = (210, 190, 130)
for p in placed:
    sl = (slice(p['i'], p['i'] + p['al'].shape[0]), slice(p['j'], p['j'] + p['al'].shape[1])); prev[sl][p['al']] = (20, 40, 200)
Image.fromarray(prev).save(os.path.join(FIT, '_fit_preview.png'))
