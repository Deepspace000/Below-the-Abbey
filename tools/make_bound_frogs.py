#!/usr/bin/env python3
"""Makes assets/hg_bound0..4.png: the villager frogs (hg_npc0, 1, 3, 5, 6) tied up in honey, for the rescue in the Queen's Hive.
Each is the painted villager with a glossy amber honey coat over it (a see-through layer thicker at the rim, with a bright highlight and a darker edge),
rope wound round the chest, waist and legs, a pool under the feet and a few drips. Run from the game folder: python tools/make_bound_frogs.py"""
import os, math, random
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = [0, 1, 3, 5, 6]

def rope(draw_img, mask, y, tilt, w, seed):
    """a band of twisted rope across the body at height y, tilted, clipped to the mask"""
    rnd = random.Random(seed)
    W, H = mask.size
    band = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(band)
    x0, x1 = -10, W + 10
    for t in range(0, W + 20, 5):
        xa = x0 + t
        ya = y + tilt * (xa / W - .5)
        d.line([(xa, ya - w / 2), (xa + 4, ya + w / 2)], fill=(122, 84, 44, 255), width=4)
        d.line([(xa + 2, ya - w / 2), (xa + 6, ya + w / 2)], fill=(168, 122, 68, 255), width=2)
    # dark edges of the band
    d.line([(x0, y - w / 2 - tilt / 2), (x1, y - w / 2 + tilt / 2)], fill=(60, 38, 18, 255), width=2)
    d.line([(x0, y + w / 2 - tilt / 2), (x1, y + w / 2 + tilt / 2)], fill=(60, 38, 18, 255), width=2)
    a = np.asarray(band).copy(); m = np.asarray(mask) > 40
    a[..., 3] = np.where(m, a[..., 3], 0)
    draw_img.alpha_composite(Image.fromarray(a))

def make(i, n):
    im = Image.open(os.path.join(ROOT, 'assets', 'hg_npc%d.png' % n)).convert('RGBA')
    pad = 26
    base = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad + 14), (0, 0, 0, 0)); base.paste(im, (pad, pad), im)
    W, H = base.size
    alpha = base.getchannel('A')
    body = alpha.point(lambda v: 255 if v > 40 else 0)
    # the honey blob: the body grown by a few pixels and softened, with a pool at the feet
    blob = body.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(5)).point(lambda v: 255 if v > 90 else 0)
    bb = body.getbbox()
    pool = Image.new('L', (W, H), 0); ImageDraw.Draw(pool).ellipse([bb[0] - 14, bb[3] - 16, bb[2] + 14, bb[3] + 12], fill=255)
    blob = Image.fromarray(np.maximum(np.asarray(blob), np.asarray(pool.filter(ImageFilter.GaussianBlur(3)).point(lambda v: 255 if v > 100 else 0))))
    blob = blob.filter(ImageFilter.GaussianBlur(1.2))
    bm = np.asarray(blob).astype(float) / 255
    ys = np.linspace(0, 1, H)[:, None]
    # amber colour, lighter at the top and darker below
    col = np.zeros((H, W, 3)); col[..., 0] = 248 - 50 * ys; col[..., 1] = 168 - 80 * ys; col[..., 2] = 30 - 20 * ys
    inner = np.asarray(blob.filter(ImageFilter.MinFilter(11)).filter(ImageFilter.GaussianBlur(4))).astype(float) / 255
    rim = np.clip(bm - inner, 0, 1)                      # the thick edge of the coat
    a = bm * .52 + rim * .55                              # see-through in the middle, thicker at the rim
    a = np.where(np.asarray(body) > 40, a, bm * .78)    # off the body the honey is nearly solid
    out = np.asarray(base).astype(float) / 255
    A0 = out[..., 3:4]
    cov = np.clip(a[..., None], 0, 1)
    rgb = out[..., :3] * (1 - cov) + (col / 255) * cov
    alpha_out = np.clip(np.maximum(A0, bm[..., None]) , 0, 1)
    comp = np.concatenate([rgb, alpha_out], axis=2)
    res = Image.fromarray((comp * 255).astype(np.uint8), 'RGBA')
    mask = Image.fromarray((np.maximum(bm, np.asarray(body) / 255) * 255).astype(np.uint8))
    # ropes
    h = bb[3] - bb[1]
    rope(res, mask, bb[1] + h * .36, 18, 12, i * 3 + 1)
    rope(res, mask, bb[1] + h * .56, -14, 12, i * 3 + 2)
    rope(res, mask, bb[1] + h * .80, 10, 11, i * 3 + 3)
    # darker amber edge and the shine along the top left of the coat
    arr = np.asarray(res).astype(float)
    edge = np.clip(rim, 0, 1)[..., None]
    arr[..., :3] = arr[..., :3] * (1 - edge * .28) + np.array([120, 60, 8]) * edge * .28
    gx = np.asarray(blob.filter(ImageFilter.GaussianBlur(3))).astype(float) / 255
    sh = np.clip(gx - np.roll(np.roll(gx, 5, 0), 5, 1), 0, 1)
    sh = np.clip(sh * 2.2, 0, 1)[..., None] * (np.asarray(blob)[..., None] > 0)
    arr[..., :3] = arr[..., :3] * (1 - sh * .8) + 255 * sh * .8
    res = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')
    # a few drips hanging from the pool
    d = ImageDraw.Draw(res)
    rnd = random.Random(i + 9)
    for k in range(4):
        x = rnd.randint(bb[0] + 10, bb[2] - 10); y = bb[3] - 6
        L = rnd.randint(8, 16)
        d.ellipse([x - 3, y + L - 3, x + 3, y + L + 3], fill=(214, 138, 30, 235))
        d.rectangle([x - 2, y - 2, x + 2, y + L], fill=(214, 138, 30, 235))
        d.ellipse([x - 1, y + L - 2, x + 0, y + L], fill=(255, 235, 170, 255))
    out_p = os.path.join(ROOT, 'assets', 'hg_bound%d.png' % i)
    res.save(out_p, optimize=True)
    return out_p

if __name__ == '__main__':
    for i, n in enumerate(SRC):
        print(make(i, n))
