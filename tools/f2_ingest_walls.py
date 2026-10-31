"""Cuts a Gemini sheet of tall wall panels (side by side, split by magenta gaps) into the painted wall tiles of the Hall of Illusions (9820).
   python tools/f2_ingest_walls.py <sheet.jpg> <name,name,...> [w=256] [h=819] [bot=<row>]
   bot=: the panels end at this row of the sheet (doors: Gemini kept a plinth course under every door, so the door panels are cut at the foot of the door and the door then stands on the floor)
   Each panel is found between the magenta columns, trimmed, scaled to w x h (256 x 819 = one square of a 3.2 high wall at the engine's
   opt-in tex.tw=256 width) and saved as assets/ps/f2_wp_<name>.jpg (kind tex in assets/ps/manifest.json). Used by f2PanelGid in ps_f2_kit.js."""
import sys, json, pathlib
import numpy as np
from PIL import Image

src, names = sys.argv[1], sys.argv[2].split(',')
opts = dict(a.split('=') for a in sys.argv[3:] if '=' in a)
W, H = int(opts.get('w', 256)), int(opts.get('h', 819))
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ps'
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text())
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = (np.minimum(r, b) > 150) & (np.minimum(r, b) - g > 90)
colm = mag.mean(axis=0) > .5
rowm = mag.mean(axis=1) > .5
ys = np.where(~rowm)[0]; y0, y1 = ys.min(), ys.max() + 1
if 'bot' in opts: y1 = int(opts['bot'])
segs, x = [], 0
while x < len(colm):
    if colm[x]: x += 1; continue
    s = x
    while x < len(colm) and not colm[x]: x += 1
    if x - s > 60: segs.append((s, x))
print('panels found:', len(segs), segs, 'rows', y0, y1)
if len(segs) != len(names): sys.exit('expected %d panels' % len(names))
for (s, e), n in zip(segs, names):
    if n == '-': continue
    # trim the pink fringe: step in until a column has no magenta-ish pixels
    def tinted(cx): c = a[y0:y1, cx]; return ((np.minimum(c[:, 0], c[:, 2]) - c[:, 1]) > 40).mean() > .02
    while tinted(s): s += 1
    while tinted(e - 1): e -= 1
    p = im.crop((s + 2, y0, e - 2, y1)).resize((W, H), Image.LANCZOS)
    fn = 'f2_wp_%s.jpg' % n
    p.save(OUT / fn, quality=90)
    man['f2_wp_' + n] = {'file': fn, 'w': W, 'h': H, 'kind': 'tex', 'sheet': pathlib.Path(src).stem}
    print('saved', fn, e - s, 'x', y1 - y0)
MAN.write_text(json.dumps(man, indent=0))
