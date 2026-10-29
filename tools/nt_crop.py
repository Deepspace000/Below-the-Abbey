"""Crop and enlarge part of a screenshot: python tools/nt_crop.py in.png out.png x0 y0 x1 y1 [scale]"""
import sys
from PIL import Image
a = sys.argv
im = Image.open(a[1]).convert('RGB')
box = tuple(int(v) for v in a[3:7])
sc = int(a[7]) if len(a) > 7 else 3
c = im.crop(box)
c = c.resize((c.width * sc, c.height * sc), Image.NEAREST)
c.save(a[2])
print(c.size)
