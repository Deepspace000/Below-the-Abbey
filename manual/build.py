"""Build the manual:  python build.py   ->  ../Below-the-Abbey-manual.pdf
Chapters are chapters/NN_name.html fragments (one <section class="chapter" id="chNN"> each, sorted by file name).
The cover is cover_front.png (6x9 full bleed, made by make_cover.py); without it cover.png / cover.jpg in this folder (full colour, framed).
The gear catalog pdf is added as an appendix."""
import os, re, glob, html, sys
from playwright.sync_api import sync_playwright
import pymupdf
HERE = os.path.dirname(os.path.abspath(__file__))
OUTPDF = os.path.join(os.path.dirname(HERE), 'Below-the-Abbey-manual.pdf')
CATALOG = os.path.join(os.path.dirname(HERE), 'item_catalog.pdf')
def cover_html():
    _p = open(os.path.join(HERE, 'cover_choice.txt')).read().strip() if os.path.exists(os.path.join(HERE, 'cover_choice.txt')) else ''   # the owner's pick of front cover
    _cf = _p if _p and os.path.exists(os.path.join(HERE, _p)) else 'cover_front.png'
    if os.path.exists(os.path.join(HERE, _cf)):      # the finished front cover is the whole page
        return '<div class="cover cover-full" id="cover"><img src="%s"></div>' % _cf
    for n in ('cover.png', 'cover.jpg', 'cover.jpeg', 'cover.webp'):
        if os.path.exists(os.path.join(HERE, n)):
            return ('<div class="cover" id="cover"><div class="cv-top">Instruction Manual</div><img src="%s"><div class="cv-bot">The Instruction Manual</div><div class="cv-sub">Grid-movement, turn-based RPG</div></div>' % n)
    return '<div class="cover" id="cover" style="display:flex;align-items:center;justify-content:center;color:#fff;font-family:OldEnglish;font-size:48pt;text-align:center">Below the Abbey<br>(cover goes here)</div>'
HEROES = {'ch01': 'img/shots/ch01_pickup.png', 'ch02': 'img/shots/ch02_crit_v.png', 'ch03': 'img/shots/ch03_inv_set.png', 'ch04': 'img/shots/ch04_lv290.png',
          'ch05': 'img/shots/ch05_path_start.png', 'ch06': 'img/shots/ch06_c_yar3.png', 'ch07': 'img/shots/ch07_sea_greenmantle.png', 'ch08': 'img/shots/ch08_b_burn.png'}
ATLAS = {
 'ch05': ('Atlas of the Home Lands', [('world_a','The world map, west.'),('thornwick','Thornwick.'),('abbey','The crypts below the abbey.'),('thornwood','The Thornwood.'),('gwood',"Gandrick's Wood."),('ironroad','The Ironhill Road.'),('ironhill','Ironhill.'),('moor','Ironhill Moor.'),('graves','The Burial Ground.'),('pass','Greyfang Pass.'),('greendale','Greendale.'),('anaea','Anaea.'),('path',"The Pilgrim's Path."),('monasterygate','The Monastery Gate.'),('monastery',"Saint Elen's Monastery."),('hollowgrass','The Hollow Grasslands.'),('hollowland','The Hollow Land and the Orange Spire.'),('spire1','The Orange Spire, first floor.')]),
 'ch06': ('Atlas of the Deserts', [('sandroad','The Sand Road.'),('tomb','The Tomb of Sut.'),('reddunes','The Red Dunes.'),('bluedunes','The Blue Dunes.'),('goldenerg','The Golden Erg.'),('violeterg','The Violet Erg.'),('whitedunes','The White Dunes.'),('flatlands','The Flatlands.'),('khemetra','Khemetra, the Golden City.'),('yarrim','Yarrim, on the Narrow Sea.')]),
 'ch07': ('Atlas of the Seas and the East', [('world_c','The world map, the Narrow Sea.'),('sea','The Narrow Sea.'),('bells','The Isle of Bells.'),('cinder','Cinder Isle.'),('lastlight','Last Light.'),('quay','Oldhaven Quay.'),('oldhaven',"Oldhaven, the king's city.")])}
def atlas_html(cid):
    if cid not in ATLAS: return ''
    title, maps = ATLAS[cid]
    figs = ''.join('<figure class="art map"><img src="img/maps/%s.png"><figcaption>%s</figcaption></figure>' % (f, html.escape(t)) for f, t in maps if os.path.exists(os.path.join(HERE, 'img', 'maps', f + '.png')))
    return '<section class="chapter atlas" id="%s-atlas"><h2 id="%s-atlas-h">%s</h2>%s</section>' % (cid, cid, title, figs)
def plate_html(k, c):
    hero = HEROES.get(c['id'], '')
    img = '<figure class="shot"><img src="%s"></figure>' % hero if hero and os.path.exists(os.path.join(HERE, hero)) else ''
    return ('<section class="plate" id="%s"><div class="pn">Chapter %d</div><div class="orn">&#10086;</div><h1>%s</h1>%s<p class="pd">%s</p><div class="orn">&#10086; &#10086; &#10086;</div></section>'
            % (c['id'], k, html.escape(c['title']), img, c['deck']))
def read_chapters():
    out = []
    for f in sorted(glob.glob(os.path.join(HERE, 'chapters', '*.html'))):
        s = open(f, encoding='utf-8').read()
        cid = re.search(r'<section[^>]*id="([^"]+)"', s)
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
        title = re.sub(r'<span class="no">.*?</span>', '', h1.group(1), flags=re.S) if h1 else os.path.basename(f)
        title = re.sub(r'<[^>]+>', '', title).strip()
        dk = re.search(r'<div class="deck">(.*?)</div>', s, re.S); deck = dk.group(1) if dk else ''
        s = re.sub(r'<h1[^>]*>.*?</h1>\s*', '', s, count=1, flags=re.S); s = re.sub(r'<div class="deck">.*?</div>\s*', '', s, count=1, flags=re.S)
        if cid: s = s.replace('id="%s"' % cid.group(1), 'id="%s-body"' % cid.group(1), 1)
        subs = re.findall(r'<h2[^>]*id="([^"]+)"[^>]*>(.*?)</h2>', s, re.S)
        subs = [(i, re.sub(r'<[^>]+>', '', t).strip()) for i, t in subs]
        if cid and cid.group(1) in ATLAS: subs.append((cid.group(1) + '-atlas-h', ATLAS[cid.group(1)][0]))
        out.append(dict(file=f, html=s, id=cid.group(1) if cid else None, title=title, subs=subs, deck=deck))
    return out
def toc_html(chs, pages):
    rows = []
    for k, c in enumerate(chs, 1):
        rows.append('<a href="#%s"><span class="n">%d</span><span class="t">%s</span><span class="d"></span><span class="p">%s</span></a>' % (c['id'], k, html.escape(c['title']), pages.get(c['id'], '')))
        subs = ''.join('<a href="#%s"><span class="t">%s</span><span class="d"></span><span class="p">%s</span></a>' % (i, html.escape(t), pages.get(i, '')) for i, t in c['subs'])
        if subs: rows.append('<div class="sub">%s</div>' % subs)
    rows.append('<a href="#appendix"><span class="n">+</span><span class="t">Appendix: Weapons, Armour and Rings</span><span class="d"></span><span class="p">%s</span></a>' % pages.get('appendix', ''))
    return ('<section class="chapter" id="contents"><h1><span class="no">Below the Abbey</span>Contents</h1><div class="deck">Click any line to turn to that page.</div><div class="toc">%s</div></section>' % ''.join(rows))
def book_html(chs, pages):
    body = cover_html() + toc_html(chs, pages) + ''.join(plate_html(k, c) + c['html'] + atlas_html(c['id']) for k, c in enumerate(chs, 1))
    body += '<section class="plate" id="appendix"><div class="pn">Appendix</div><div class="orn">&#10086;</div><h1>Weapons, Armour and Rings</h1><p class="pd">Every piece of gear in the game, sorted by colour: white, green, blue, red, purple and orange. The pages that follow are the full catalog.</p><div class="orn">&#10086; &#10086; &#10086;</div></section>'
    return '<!doctype html><html><head><meta charset="utf-8"><title>Below the Abbey: Manual</title><link rel="stylesheet" href="manual.css"></head><body>%s</body></html>' % body
def render(htmlpath, pdfpath):
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.goto('file:///' + htmlpath.replace(chr(92), '/')); pg.wait_for_timeout(2500)
        try: pg.pdf(path=pdfpath, width='6in', height='9in', print_background=True, prefer_css_page_size=True, outline=True, tagged=True)
        except TypeError: pg.pdf(path=pdfpath, width='6in', height='9in', print_background=True, prefer_css_page_size=True)
        b.close()
def find_pages(pdfpath, chs):
    d = pymupdf.open(pdfpath); pages = {}
    names = {}
    try: names = d.resolve_names()
    except Exception: pass
    for k, v in names.items():
        if v and 'page' in v: pages[k] = v['page'] + 1
    return pages, len(d)
def main():
    chs = read_chapters()
    tmp = os.path.join(HERE, 'book.html'); pdf1 = os.path.join(HERE, '_pass1.pdf'); pdf2 = os.path.join(HERE, '_pass2.pdf')
    pages = {}
    for k in range(2):  # two passes: page numbers for the contents need the first pass
        open(tmp, 'w', encoding='utf-8').write(book_html(chs, pages))
        render(tmp, pdf1 if k == 0 else pdf2)
        pages, n = find_pages(pdf1 if k == 0 else pdf2, chs)
    print('pages (no appendix):', n, 'anchors found:', len(pages))
    d = pymupdf.open(pdf2)
    app_page = pages.get('appendix')
    # running header (the title in the black letter face, as on the old manuals), footer page number and a small flourish; not on the cover or the plates
    plate_pages = {pages[k] - 1 for k in list(pages) if re.fullmatch(r'ch0\d|appendix', k)}
    names = {}
    for c in chs: names[pages.get(c['id'], 0) - 1] = c['title']
    cur = ''
    OE = 'C:/Windows/Fonts/OLDENGL.TTF'
    for i, pg in enumerate(d):
        if i in names: cur = names[i]
        if i == 0 or i in plate_pages: continue
        r = pg.rect; num = str(i + 1); even = (i + 1) % 2 == 0
        pg.insert_font(fontname='oe', fontfile=OE)
        title = 'Below the Abbey'
        pg.insert_text((40 if even else r.width - 40 - 92, 33), title, fontname='oe', fontsize=13)
        if cur:
            ct = cur.upper(); w = pymupdf.get_text_length(ct, 'hebo', 6.5) + len(ct) * 0.9
            pg.insert_text((r.width - 40 - w if even else 40, 31), ct, fontname='hebo', fontsize=6.5, color=(.25, .25, .25))
        pg.draw_line((40, 38), (r.width - 40, 38), width=1.2); pg.draw_line((40, 40.5), (r.width - 40, 40.5), width=.4)
        x = 40 if even else r.width - 40 - pymupdf.get_text_length(num, 'hebo', 9)
        pg.insert_text((x, r.height - 28), num, fontname='hebo', fontsize=9)
        pg.draw_line((40, r.height - 40), (r.width - 40, r.height - 40), width=.5)
    # the gear catalog pages, scaled into the booklet page size
    if os.path.exists(CATALOG):
        cat = pymupdf.open(CATALOG)
        for cp in cat:
            np_ = d.new_page(width=d[0].rect.width, height=d[0].rect.height)
            np_.draw_rect(np_.rect, color=(.1, .086, .07), fill=(.1, .086, .07))
            w, h = cp.rect.width, cp.rect.height; s = min(np_.rect.width / w, np_.rect.height / h)
            tw, th = w * s, h * s
            np_.show_pdf_page(pymupdf.Rect((np_.rect.width - tw) / 2, (np_.rect.height - th) / 2, (np_.rect.width + tw) / 2, (np_.rect.height + th) / 2), cat, cp.number)
            num = str(len(d)); np_.insert_text((np_.rect.width - 40 - 8, np_.rect.height - 14), num, fontname='hebo', fontsize=8, color=(.8, .75, .6))
    # back page
    ver = re.search(r"const VERSION='([0-9.]+)'", open(os.path.join(os.path.dirname(HERE), 'index.html'), encoding='utf-8', errors='ignore').read())
    bp = d.new_page(width=d[0].rect.width, height=d[0].rect.height); W, H = bp.rect.width, bp.rect.height
    bp.draw_rect(bp.rect, color=(.05, .05, .05), fill=(.05, .05, .05)); bp.draw_rect(pymupdf.Rect(20, 20, W - 20, H - 20), color=(.85, .85, .85), width=1)
    bp.insert_font(fontname='oe', fontfile='C:/Windows/Fonts/OLDENGL.TTF')
    OEF = pymupdf.Font(fontfile='C:/Windows/Fonts/OLDENGL.TTF')
    def ctext(t, y, fn, fs, col=(.92, .92, .92)):
        w = OEF.text_length(t, fs) if fn == 'oe' else pymupdf.get_text_length(t, fn, fs)
        bp.insert_text(((W - w) / 2, y), t, fontname=fn, fontsize=fs, color=col)
    ctext('Below the Abbey', 250, 'oe', 34); ctext('Grid-movement, turn-based RPG', 285, 'tiit', 13)
    ctext('Bickering Goat Studios', 340, 'oe', 20); ctext('deepspace000.github.io/Below-the-Abbey', 400, 'helv', 9)
    ctext('Manual for game version ' + (ver.group(1) if ver else ''), 420, 'tiit', 10, (.7, .7, .7))
    try: d.rewrite_images(dpi_threshold=150, dpi_target=130, quality=72)
    except Exception as e: print('no image rewrite:', e)
    d.save(OUTPDF, deflate=True, garbage=4)
    print('wrote', OUTPDF, len(d), 'pages')
main()
