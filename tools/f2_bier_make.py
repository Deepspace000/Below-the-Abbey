"""The Sleeper's bier of the Hall of Illusions (9820), made from painted pieces:
   f2_bier2           the new plinth (ART-HOLD/f2r3/hub_bier.jpg: black carved stone, seven silver-ringed sockets, a pale cloth on top), keyed out of the magenta
   f2_sleeper2        the Sleeper lying on it: the body of f2_sleeper (above its old plinth) and the hair and gown that hang over the side (light pixels only), set on the new plinth
   f2_sleeper2_nh     the same without the hair over the side (when her head is not on the bier yet)
   f2_sock_<part>     the painted item icon (assets/icn_psf_<part>.png) in a round, for a filled socket
   python tools/f2_bier_make.py   (writes assets/ps and assets/ps/manifest.json; prints the socket centres as fractions of f2_sleeper2)"""
import json, pathlib
import numpy as np
from PIL import Image, ImageFilter
R = pathlib.Path(__file__).resolve().parent.parent; PS = R / 'assets' / 'ps'
man = json.loads((PS / 'manifest.json').read_text())
src = Image.open(R / 'ART-HOLD' / 'f2r3' / 'hub_bier.jpg').convert('RGB'); a = np.asarray(src).astype(np.float32)
mg = np.clip(((np.minimum(a[..., 0], a[..., 2]) - a[..., 1]) - 40) / 70, 0, 1)
ys, xs = np.nonzero(mg < .5); box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
al = Image.fromarray(((1 - mg) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
b2 = Image.merge('RGBA', (*src.split(), al)).crop(box)
old = Image.open(PS / 'f2_sleeper.webp').convert('RGBA'); W, H = old.size
pl = b2.resize((W, round(W * b2.height / b2.width)), Image.LANCZOS)
BODY = 104            # the old plinth's top surface in f2_sleeper (rows above are the body)
CLOTH = round(pl.height * .085)   # the cloth surface of the new plinth
dy = 0; top_new = BODY
Hn = BODY + pl.height - CLOTH
can = Image.new('RGBA', (W, Hn), (0, 0, 0, 0)); can.alpha_composite(pl, (0, Hn - pl.height))
o = np.asarray(old).astype(np.float32); lum = o[..., :3].mean(2); sat = o[..., :3].max(2) - o[..., :3].min(2)
yy, xx = np.mgrid[0:H, 0:W]
keep = (yy < BODY) | ((lum > 118) & (sat < 60) & (yy < H - 20))
def body(hair):
    k = keep.copy()
    if not hair: k &= ~((yy >= BODY) & (xx < W * .27))
    m = o.copy(); m[..., 3] *= k
    m = Image.fromarray(m.astype(np.uint8), 'RGBA').crop((0, 0, W, min(H, Hn)))
    c = can.copy(); c.alpha_composite(m, (0, 0)); return c
for nm, img in (('f2_sleeper2', body(True)), ('f2_sleeper2_nh', body(False)), ('f2_bier2', can)):
    img.save(PS / (nm + '.webp'), quality=92)
    man[nm] = {'file': nm + '.webp', 'w': img.width, 'px_h': img.height, 'h': round(.9 * img.height / H, 3) if nm != 'f2_bier2' else round(.9 * img.height / H, 3), 'kind': 'sprite', 'sheet': 'f2r3'}
    print(nm, img.size)
for p in ['hand', 'foot', 'face', 'chest', 'legs', 'heart', 'brain']:
    f = R / 'assets' / ('icn_psf_%s.png' % p)
    if not f.exists():
        print('no icon', p); continue
    ic = Image.open(f).convert('RGBA').resize((96, 96), Image.LANCZOS); m = np.zeros((96, 96), np.float32)
    yy2, xx2 = np.mgrid[0:96, 0:96]; d = np.hypot(yy2 - 47.5, xx2 - 47.5); m = np.clip((46 - d) / 4, 0, 1)
    x = np.asarray(ic).astype(np.float32); x[..., 3] *= m
    nm = 'f2_sock_' + p; Image.fromarray(x.astype(np.uint8), 'RGBA').save(PS / (nm + '.webp'), quality=92)
    man[nm] = {'file': nm + '.webp', 'w': 96, 'px_h': 96, 'h': .2, 'kind': 'sprite', 'sheet': 'f2r3'}
(PS / 'manifest.json').write_text(json.dumps(man, indent=0))
# socket centres: found as the bright silver rings in the plinth
print('plinth top in f2_sleeper2 rows', Hn - pl.height, 'height', Hn)
