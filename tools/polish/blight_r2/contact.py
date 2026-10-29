import sys, glob, os
from PIL import Image
d = sys.argv[1]; out = sys.argv[2]; names = sys.argv[3:]
fs = [os.path.join(d, n + '.png') for n in names] if names else sorted(glob.glob(d + '/*.png'))
ims = [Image.open(f).convert('RGB').crop((0, 0, 900, 395)).resize((600, 263)) for f in fs]
cols = 2; rows = (len(ims) + 1) // 2
sh = Image.new('RGB', (1200, 263 * rows))
for i, im in enumerate(ims): sh.paste(im, ((i % 2) * 600, (i // 2) * 263))
sh.save(out)
