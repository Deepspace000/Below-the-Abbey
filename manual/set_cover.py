"""Put the colour cover on page 1 of the finished manual without rebuilding the whole book:
    python set_cover.py            (uses manual/cover_front.png, the full-bleed 6x9 front cover made by make_cover.py;
                                    if that does not exist, the old framed landscape manual/cover.png or cover.jpg)
Then re-run make_showcase.py to refresh the pictures."""
import os, sys, pymupdf
HERE = os.path.dirname(os.path.abspath(__file__)); PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(HERE), 'Below-the-Abbey-manual.pdf')
_ch = os.path.join(HERE, 'cover_choice.txt')   # the owner's pick: the file name of the front cover to use (cover_front.png, cover_front_grimy.png, cover_front_ingame.png ...)
_pick = open(_ch).read().strip() if os.path.exists(_ch) else ''
FRONT = os.path.join(HERE, _pick) if _pick and os.path.exists(os.path.join(HERE, _pick)) else os.path.join(HERE, 'cover_front.png')
img = FRONT if os.path.exists(FRONT) else next((os.path.join(HERE, n) for n in ('cover.png', 'cover.jpg', 'cover.jpeg', 'cover.webp') if os.path.exists(os.path.join(HERE, n))), None)
if not img: sys.exit('no cover_front.png / cover.png / cover.jpg in the manual folder')
d = pymupdf.open(PDF); old = d[0]; W, H = old.rect.width, old.rect.height
new = d.new_page(0, width=W, height=H)
if img == FRONT:                 # the finished portrait cover (6:9): the picture is the whole page, full bleed
    new.insert_image(new.rect, filename=img)
    d.delete_page(1)             # the old cover
    d.save(PDF + '.tmp', deflate=True, garbage=3); d.close(); os.replace(PDF + '.tmp', PDF); print('cover set (full bleed)'); sys.exit(0)
new.draw_rect(new.rect, color=(.043, .043, .043), fill=(.043, .043, .043))
gold = (.85, .71, .35)
new.draw_rect(pymupdf.Rect(16, 16, W - 16, H - 16), color=gold, width=1.2); new.draw_rect(pymupdf.Rect(21, 21, W - 21, H - 21), color=gold, width=.5)
iw, ih = pymupdf.Pixmap(img).width, pymupdf.Pixmap(img).height
pw = W - 60; ph = pw * ih / iw; y0 = 62
new.draw_rect(pymupdf.Rect(30 - 2, y0 - 2, 30 + pw + 2, y0 + ph + 2), color=gold, width=2.2)
new.insert_image(pymupdf.Rect(30, y0, 30 + pw, y0 + ph), filename=img)
oe = pymupdf.Font(fontfile='C:/Windows/Fonts/OLDENGL.TTF'); new.insert_font(fontname='oe', fontfile='C:/Windows/Fonts/OLDENGL.TTF')
def ctext(t, y, fn, fs, col):
    w = oe.text_length(t, fs) if fn == 'oe' else pymupdf.get_text_length(t, fn, fs)
    new.insert_text(((W - w) / 2, y), t, fontname=fn, fontsize=fs, color=col)
ty = y0 + ph + 70
ctext('The Instruction Manual', ty, 'oe', 34, (.95, .86, .63))
new.draw_line((W / 2 - 70, ty + 16), (W / 2 + 70, ty + 16), color=gold, width=1); new.draw_line((W / 2 - 70, ty + 19), (W / 2 + 70, ty + 19), color=gold, width=.4)
ctext('Grid-movement, turn-based RPG', ty + 44, 'tiit', 13, (.85, .82, .72))
ctext('Bickering Goat Studios', H - 62, 'oe', 20, (.95, .86, .63))
d.delete_page(1)   # the placeholder cover
d.save(PDF + '.tmp', deflate=True, garbage=3); d.close(); os.replace(PDF + '.tmp', PDF); print('cover set')
