import sys
from PIL import Image
names = sys.argv[2:]
ims = [Image.open('assets/ps/%s.webp' % n).convert('RGBA') for n in names]
H = 500; W = sum(int(i.width * H / i.height) for i in ims)
c = Image.new('RGBA', (W, H), (40, 40, 50, 255)); x = 0
for i in ims:
    j = i.resize((int(i.width * H / i.height), H)); c.alpha_composite(j, (x, 0)); x += j.width
c.convert('RGB').save(sys.argv[1])
