"""Splits a Gemini sheet on magenta into separate sprites (connected blobs, row-major order).
    python tools/split_hgt.py <sheet.png> <prefix> <height> [n=<expected count>] [dry]
Writes assets/ds_<prefix><i>.png (i from 1) via the soft magenta key of ingest_hgt_sprite.py. 'dry' only writes a numbered preview to the scratch folder.
"""
import sys, pathlib, subprocess, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, prefix, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
o = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[4:])
im = Image.open(src).convert('RGB'); a = np.array(im).astype(float)
m = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
fg = m < 90
fg = ndi.binary_opening(fg, iterations=1)
dil = ndi.binary_dilation(fg, iterations=int(o.get('gap', 14)))
lab, n = ndi.label(dil)
objs = ndi.find_objects(lab)
boxes = []
for i, sl in enumerate(objs):
    area = (fg[sl] & (lab[sl] == i + 1)).sum()
    if area > 1500: boxes.append((sl, area))
# row-major: group by row bands
boxes.sort(key=lambda b: (b[0][0].start + b[0][0].stop) / 2)
rows = []; 
for b in boxes:
    cy = (b[0][0].start + b[0][0].stop) / 2
    if rows and abs(cy - rows[-1][0]) < im.height * float(o.get('band', .12)): rows[-1][1].append(b)
    else: rows.append([cy, [b]])
ordered = [b for r in rows for b in sorted(r[1], key=lambda b: b[0][1].start)]
print(len(ordered), 'blobs')
scratch = pathlib.Path(tempfile.gettempdir())
for i, (sl, ar) in enumerate(ordered, 1):
    y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
    print(i, x0, y0, x1 - x0, y1 - y0)
    if 'dry': pass
    crop = im.crop((x0, y0, x1, y1)); tmp = scratch / ('blob%d.png' % i); crop.save(tmp)
    if 'dry' in o and o['dry'] == '1': continue
    subprocess.run([sys.executable, str(pathlib.Path(__file__).parent / 'ingest_hgt_sprite.py'), str(tmp), '%s%d' % (prefix, i), str(height)] + [x for x in sys.argv[4:] if x.startswith(('lo=', 'hi=', 'flip'))], check=True)
