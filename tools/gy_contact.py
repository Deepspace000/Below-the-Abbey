"""python tools/gy_contact.py <prefix> : montage of assets/gy/<prefix>_*.webp on grey, saved to the temp folder"""
import sys, glob, os
from PIL import Image
pre = sys.argv[1]
fs = sorted(glob.glob('assets/gy/%s_*.*' % pre), key=lambda p: int(os.path.splitext(p)[0].rsplit('_', 1)[1]))
ims = [Image.open(f).convert('RGBA') for f in fs]
h = 300; ims = [i.resize((max(1, round(i.width * h / i.height)), h)) for i in ims]
W = sum(i.width + 10 for i in ims) + 10
if W > 1800:
    k = 1800 / W; ims = [i.resize((round(i.width * k), round(i.height * k))) for i in ims]; W = 1800; h = round(h * k)
c = Image.new('RGB', (W, h + 20), (110, 110, 118)); x = 10
for i in ims:
    c.paste(i, (x, 10), i); x += i.width + 10
out = os.environ.get('TEMP', '.') + '/gy_contact_%s.png' % pre
c.save(out); print(out)
