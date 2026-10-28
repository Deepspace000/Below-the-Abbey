#!/usr/bin/env python3
"""Makes assets/hg_bh1_0..4.png (villagers wrapped in silk cocoons, the Droning Hive) and assets/hg_bh2_0..4.png (villagers sealed in a wax cell, the Amber Hive).
The Hush Hive (honey, clover) and the Queen's Hive (honey, buckwheat) captives come from tools/make_bound_frogs.py. All are the painted villagers (hg_npc0, 1, 3, 5, 6)
with a coat over them, in the same canvas size as the honey ones. Run from the game folder: python tools/make_hive_captives.py"""
import os, random, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = [0, 1, 3, 5, 6]

def base_of(n):
    im = Image.open(os.path.join(ROOT, 'assets', 'hg_npc%d.png' % n)).convert('RGBA')
    pad = 26
    b = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad + 14), (0, 0, 0, 0)); b.paste(im, (pad, pad), im)
    body = b.getchannel('A').point(lambda v: 255 if v > 40 else 0)
    return b, body, body.getbbox()

def cocoon(i, n):
    base, body, bb = base_of(n)
    W, H = base.size; rnd = random.Random(100 + i)
    h = bb[3] - bb[1]; neck = bb[1] + h * .26
    wrap = body.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(4)).point(lambda v: 255 if v > 100 else 0).filter(ImageFilter.GaussianBlur(1.3))
    wa = np.asarray(wrap).astype(float) / 255
    ys = np.arange(H)[:, None] * np.ones((1, W))
    # the head stays mostly free, the wrap thickens below the neck
    ramp = np.clip((ys - neck) / (h * .1), 0, 1)
    silk = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(silk)
    for k in range(260):  # strands criss-crossing the body
        x0 = rnd.randint(bb[0] - 14, bb[2] + 14); y0 = rnd.randint(int(neck) - 6, bb[3] + 8)
        a = rnd.uniform(-1.2, 1.2) + (math.pi / 2 if rnd.random() < .5 else 0); L = rnd.randint(40, 120)
        c = rnd.choice([(244, 238, 226, 215), (226, 216, 198, 200), (255, 252, 244, 230), (190, 178, 160, 170)])
        d.line([(x0, y0), (x0 + math.cos(a) * L, y0 + math.sin(a) * L)], fill=c, width=rnd.choice([1, 2, 2, 3]))
    sa = np.asarray(silk).astype(float)
    m = (wa * ramp)
    fill = np.zeros((H, W, 4)); fill[..., :3] = [232, 224, 206]; fill[..., 3] = m * 150
    sa[..., 3] = np.where(m > .05, np.maximum(sa[..., 3] * m, 0), 0)
    out = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8), 'RGBA')
    res = base.copy(); res.alpha_composite(out)
    res.alpha_composite(Image.fromarray(np.clip(sa, 0, 255).astype(np.uint8), 'RGBA'))
    # a darker band of wrap at the waist and ankles, and the thread it hangs from
    d2 = ImageDraw.Draw(res)
    for fy in (.42, .62, .84):
        y = bb[1] + h * fy
        d2.line([(bb[0] - 4, y - 5), (bb[2] + 4, y + 5)], fill=(120, 108, 92, 190), width=3)
    cx = (bb[0] + bb[2]) // 2
    d2.line([(cx, 0), (cx, bb[1] + 6)], fill=(236, 230, 214, 255), width=3)
    d2.line([(cx + 2, 0), (cx + 2, bb[1] + 6)], fill=(150, 140, 124, 200), width=1)
    p = os.path.join(ROOT, 'assets', 'hg_bh1_%d.png' % i); res.save(p, optimize=True); return p

def waxcell(i, n):
    base, body, bb = base_of(n)
    W, H = base.size
    pad = 14
    L, R, T, B = bb[0] - pad, bb[2] + pad, bb[1] - pad, bb[3] + 6
    cx = (L + R) / 2; q = (B - T) * .12
    hexp = [(cx, T), (R, T + q), (R, B - q), (cx, B), (L, B - q), (L, T + q)]
    fillimg = Image.new('RGBA', (W, H), (0, 0, 0, 0)); df = ImageDraw.Draw(fillimg)
    df.polygon(hexp, fill=(226, 112, 36, 92))
    arr = np.asarray(fillimg).astype(float)
    yy = np.linspace(0, 1, H)[:, None]
    arr[..., 0] = np.where(arr[..., 3] > 0, 240 - 40 * yy, 0); arr[..., 1] = np.where(arr[..., 3] > 0, 130 - 50 * yy, 0); arr[..., 2] = np.where(arr[..., 3] > 0, 40 - 20 * yy, 0)
    res = base.copy(); res.alpha_composite(Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA'))
    d = ImageDraw.Draw(res)
    d.polygon(hexp, outline=(120, 52, 12, 255), width=12)
    d.polygon([(x * .985 + cx * .015, y) for x, y in hexp], outline=(214, 108, 34, 255), width=6)
    inner = [(cx + (x - cx) * .93, T + (y - T) * .97 + 5) for x, y in hexp]
    d.line(inner[5:] + inner[:1], fill=(255, 214, 140, 210), width=3)       # the shine along the upper left and top
    d.line([hexp[0], hexp[1]], fill=(255, 214, 140, 160), width=2)
    # wax drips under the cell, and a pool
    rnd = random.Random(300 + i)
    for k in range(4):
        x = rnd.randint(int(L) + 16, int(R) - 16); y = int(B) - 2; Ln = rnd.randint(8, 18)
        d.rectangle([x - 2, y - 2, x + 2, y + Ln], fill=(214, 108, 34, 240)); d.ellipse([x - 3, y + Ln - 3, x + 3, y + Ln + 3], fill=(214, 108, 34, 240))
    p = os.path.join(ROOT, 'assets', 'hg_bh2_%d.png' % i); res.save(p, optimize=True); return p

if __name__ == '__main__':
    for i, n in enumerate(SRC):
        print(cocoon(i, n)); print(waxcell(i, n))
