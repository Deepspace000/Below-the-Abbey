"""Cuts a Gemini sheet on flat magenta into pieces of assets/<dir>: python tools/polish/b7s_cut.py <sheet.jpg> <dir> <cols> <name:h_cells[:fade]> ... ; writes <name>.webp and merges manifest.json.
A piece is the largest blob in its column, keyed from magenta with a despill, cropped, scaled to max 520 px tall. fade=1 fades the last 12 percent into mist."""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, d, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]); specs = [a.split(':') for a in sys.argv[4:]]
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'assets' / d; OUT.mkdir(exist_ok=True, parents=True)
MAN = OUT / 'manifest.json'; man = json.loads(MAN.read_text()) if MAN.exists() else {}
im = Image.open(src).convert('RGB'); W, H = im.size
_a = np.array(im).astype(float); _fg = ((np.minimum(_a[..., 0], _a[..., 2]) - _a[..., 1]) < 90).sum(axis=0) > 6
runs = []; x = 0
while x < W:
    if not _fg[x]: x += 1; continue
    x0 = x
    while x < W and (_fg[x] or (x + 1 < W and _fg[min(W - 1, x + 12)])): x += 1
    runs.append((x0, x))
runs = sorted(sorted(runs, key=lambda r: r[0] - r[1])[:cols]); print('runs', runs)
for i, sp in enumerate(specs):
    name, hc = sp[0], float(sp[1]); fade = len(sp) > 2 and sp[2] == '1'
    c = im.crop((max(0, runs[i][0] - 6), 0, min(W, runs[i][1] + 6), H))
    a = np.array(c).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = np.clip(((np.minimum(r, b) - g) - 50) / 70.0, 0, 1); alpha = 1 - mag
    sp_ = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 1)
    a[..., 0] = np.where(alpha < 1, r - sp_ * .85, r); a[..., 2] = np.where(alpha < 1, b - sp_ * .85, b)
    al = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)))
    pic = Image.fromarray(np.dstack([a.clip(0, 255), al]).astype(np.uint8), 'RGBA')
    bb = pic.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox(); pic = pic.crop(bb)
    if pic.height > 520: pic = pic.resize((max(1, round(pic.width * 520 / pic.height)), 520), Image.LANCZOS)
    if fade:
        arr = np.array(pic); h = arr.shape[0]; ramp = np.ones(h); k0 = int(h * .88); ramp[k0:] = np.linspace(1, .25, h - k0); arr[..., 3] = (arr[..., 3] * ramp).astype(np.uint8); pic = Image.fromarray(arr, 'RGBA')
    pic.save(OUT / (name + '.webp'), quality=90, method=6); man[name] = {'file': name + '.webp', 'h_cells': hc}; print(name, pic.size)
MAN.write_text(json.dumps(man, indent=1))
