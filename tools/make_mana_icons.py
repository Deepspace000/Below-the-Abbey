"""Makes the icons of the higher mana draughts (assets/icn_mana*.png) from the painted Mana Draught icons by shifting the colour of the blue liquid:
   strong (blue), very strong (violet blue), ultra (silver), supreme (cyan), mythic (violet), divine (gold). Raster in, raster out; nothing drawn in code.
   python tools/make_mana_icons.py"""
import colorsys, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TIERS = {  # id: (source, target hue in turns, target saturation, value factor)
    'manastrong': ('greatermana', .56, .78, 1.12),
    'manavery': ('greatermana', .78, .80, 1.0),
    'manaultra': ('supermana', .60, .04, 1.12),
    'manasupreme': ('supermana', .50, .55, 1.0),
    'manamythic': ('supermana', .85, .60, .98),
    'manadivine': ('supermana', .12, .85, 1.05),
}
def shift(src, th, ts, kv):
    im = Image.open(os.path.join(ROOT, 'assets', 'icn_%s.png' % src)).convert('RGBA'); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0: continue
            h, s, v = colorsys.rgb_to_hsv(r / 255., g / 255., b / 255.)
            if s > .1 and .5 < h < .95:   # the coloured liquid and crystal only, not the cork, the metal or the outline
                k = min(1, s / .35)       # keep the faint tints of the glass faint
                h = th; s = s * (1 - k) + ts * k * min(1, s * 2.2 + .35); v = max(0, min(1, v * kv))
                r, g, b = [int(c * 255) for c in colorsys.hsv_to_rgb(h, max(0, min(1, s)), v)]
                px[x, y] = (r, g, b, a)
    return im
for k, (src, th, ts, kv) in TIERS.items():
    shift(src, th, ts, kv).save(os.path.join(ROOT, 'assets', 'icn_%s.png' % k))
sheet = Image.new('RGBA', (128 * 9, 128), (60, 50, 40, 255))
for i, n in enumerate(['manadraught', 'greatermana', 'manastrong', 'manavery', 'supermana', 'manaultra', 'manasupreme', 'manamythic', 'manadivine']):
    sheet.alpha_composite(Image.open(os.path.join(ROOT, 'assets', 'icn_%s.png' % n)).convert('RGBA'), (128 * i, 0))
sheet.save(os.path.join(os.environ.get('TEMP', '.'), 'mana_sheet.png'))
print('done')
