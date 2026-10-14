"""Cuts the Oldhaven sheets (made in Gemini, on flat magenta) into pieces for the city.

    python tools/ingest_oh.py <folder with the oh_*.jpg sheets>

Text labels that Gemini wrote beside the figures are painted out first (small detached specks of dark on the magenta), the black
baseline drawn under towers and props is shaved off, and the portcullis picture gets a dark space behind its bars.
Each sheet goes through tools/ingest_kh.py, so the pieces end up in assets/kh and in its manifest.
"""
import sys, glob, os, subprocess, json, pathlib
import numpy as np
from PIL import Image
from collections import deque

root = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1]); only = sys.argv[2:]   # optional: the names of the sheets to redo
tmp = root / '_oh_tmp'; tmp.mkdir(exist_ok=True)

def magenta(a):
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    return (r > 140) & (b > 140) & (g < 125) & (np.abs(r - b) < 90)

def clean(path, out, minarea=1800, maxh=60):
    im = Image.open(path).convert('RGB'); a = np.array(im)
    fg = ~magenta(a); H, W = fg.shape
    lab = np.zeros((H, W), np.int32); n = 0
    comps = []
    for y in range(H):
        for x in range(W):
            if fg[y, x] and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n; pts = []
                while q:
                    cy, cx = q.popleft(); pts.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and fg[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n; q.append((ny, nx))
                ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
                comps.append((n, len(pts), max(ys) - min(ys) + 1, max(xs) - min(xs) + 1, pts))
    removed = 0
    for (k, area, h, w, pts) in comps:
        text = area < minarea and h < maxh
        line = h <= 4 and w >= 150                      # a baseline drawn under an object
        if text or line:
            for (y, x) in pts: a[y, x] = (255, 0, 255)
            removed += 1
    Image.fromarray(a).save(out, quality=95)
    return removed

def shave_base(f):
    im = Image.open(f).convert('RGBA'); a = np.array(im); al = a[..., 3] > 20
    ys = np.where(al.any(axis=1))[0]
    if len(ys) == 0: return
    bw = al.any(axis=0).sum()
    cut = 0
    while True:
        row = al[ys[-1] - cut]
        dark = a[ys[-1] - cut, :, :3][row].mean() < 70 if row.any() else False
        if row.sum() >= .9 * bw and dark and cut < 8: cut += 1
        else: break
    if cut:
        a[ys[-1] - cut + 1: ys[-1] + 1, :, 3] = 0
        out = Image.fromarray(a); out.crop(out.getbbox()).save(f, quality=92, method=6)

def ingest(name, sheet, kind, extra=()):
    subprocess.run([sys.executable, str(root / 'tools' / 'ingest_kh.py'), str(sheet), name, kind, *extra], check=True)

def find(tag):
    r = glob.glob(str(src / ('oh_' + tag + '_*.jpg')))
    return sorted(r)[-1] if r else None

for tag, kind, extra in [('ohroof1', 'sprite', ['rows=2']), ('ohtower1', 'sprite', ['rows=2']), ('ohkeep1', 'sprite', ['rows=1']),
                         ('ohprops1', 'sprite', ['rows=2', 'soft=1']), ('ohsold1', 'sprite', ['rows=2']), ('ohcourt1', 'sprite', ['rows=2']),
                         ('ohfolk1', 'sprite', ['rows=2']), ('ohfolk2', 'sprite', ['rows=2'])]:
    if only and tag not in only: continue
    f = find(tag)
    if not f: print('missing', tag); continue
    c = tmp / (tag + '.jpg'); n = clean(f, c, minarea=(0 if tag in ('ohprops1','ohtower1','ohkeep1') else 1800)); print(tag, 'cleaned', n)
    ingest(tag, c, kind, extra)
    if tag in ('ohtower1', 'ohkeep1', 'ohprops1'):
        for p in glob.glob(str(root / 'assets' / 'kh' / (tag + '_*.webp'))): shave_base(p)
f = find('ohwall1') if (not only or 'ohwall1' in only) else None
if f: ingest('ohwall1', f, 'tex', ['cols=3', 'rows=2', 'seam=none'])
# the portcullis and the open doors: opaque pictures with a dark space behind
f = find('ohgate1') if (not only or 'ohgate1' in only) else None
if f:
    im = Image.open(f).convert('RGB'); a = np.array(im); mg = magenta(a)
    W = a.shape[1]; half = W // 2
    for k, (x0, x1) in enumerate(((0, half), (half, W))):
        sub = a[:, x0:x1]; m = mg[:, x0:x1]
        cols = np.where((~m).sum(axis=0) > 40)[0]; rows = np.where((~m).sum(axis=1) > 40)[0]
        c = Image.fromarray(sub[rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1].copy())
        ca = np.array(c); cm = magenta(ca); ca[cm] = (16, 12, 10)
        out = Image.fromarray(ca).resize((256, 256), Image.LANCZOS); fn = 'ohgate1_%d.jpg' % k
        out.save(root / 'assets' / 'kh' / fn, quality=92)
        mp = root / 'assets' / 'kh' / 'manifest.json'; man = json.loads(mp.read_text())
        man['ohgate1_%d' % k] = {'file': fn, 'w': 256, 'h': 256, 'kind': 'tex', 'sheet': 'ohgate1'}; mp.write_text(json.dumps(man, indent=0))
import shutil; shutil.rmtree(tmp, ignore_errors=True)
print('done')
