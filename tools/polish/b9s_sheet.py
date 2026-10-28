"""python tools/polish/b9s_sheet.py <dir> [names...]  -> <dir>/_sheet.png contact sheet (2 columns) of the 3D views"""
import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]
names = sys.argv[2:] or sorted(os.path.basename(f)[:-4] for f in glob.glob(d + '/*.png') if not os.path.basename(f).startswith('_sheet'))
W, H = 550, 235; cols = 2; rows = (len(names) + cols - 1) // cols
s = Image.new('RGB', (W * cols, H * rows))
for i, n in enumerate(names):
    im = Image.open(d + '/' + n + '.png').convert('RGB').crop((25, 0, 940, 460)).resize((W, H))
    ImageDraw.Draw(im).text((6, 4), n, fill=(255, 255, 0)); s.paste(im, ((i % cols) * W, (i // cols) * H))
s.save(d + '/_sheet%s.png' % os.environ.get('SH', ''))
