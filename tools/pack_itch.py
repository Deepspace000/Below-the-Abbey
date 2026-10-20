"""Build an itch.io upload: index.html + a few big packs of the pictures + the audio. itch.io allows at most 1000 files in an HTML5 zip,
and the game has about 1500 pictures, so the pictures are glued into packs and handed to the page as blob URLs (see the shim below).
Usage: python tools/pack_itch.py   ->  itch-build/ and itch-build.zip"""
import os, sys, json, shutil, zipfile, mimetypes
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'itch-build')
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
TYPES = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}
imgs = []
for r, d, f in os.walk(os.path.join(ROOT, 'assets')):
    if os.sep + 'audio' in r + os.sep: continue
    for x in sorted(f):
        e = os.path.splitext(x)[1].lower()
        if e in TYPES: imgs.append(os.path.join(r, x))
imgs.sort()
# Each picture goes into a pack chosen by a hash of its own path (NB buckets), not by its place in a sorted list. So adding or changing a picture only changes
# the one pack it belongs to, and itch.io (butler) sends a small update instead of re-sending every pack. Packs hold a few MB each.
import zlib
NB = 40
buckets = [[] for _ in range(NB)]
for p in imgs:
    rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
    buckets[zlib.crc32(rel.encode('utf-8')) % NB].append(p)
packs, idx = [], {}
for cur in buckets:
    if not cur: continue
    name = 'pack%02d.bin' % len(packs)
    off = 0
    with open(os.path.join(OUT, name), 'wb') as w:
        for p in sorted(cur):
            b = open(p, 'rb').read()
            rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
            idx[rel] = [len(packs), off, len(b), TYPES[os.path.splitext(p)[1].lower()]]
            w.write(b); off += len(b)
    packs.append(name)
json.dump({'packs': packs, 'sizes': [os.path.getsize(os.path.join(OUT, n)) for n in packs], 'files': idx}, open(os.path.join(OUT, 'pack.json'), 'w'))
# the audio and the manifest stay as they are
for r, d, f in os.walk(os.path.join(ROOT, 'assets')):
    for x in f:
        p = os.path.join(r, x)
        if os.path.splitext(x)[1].lower() in TYPES: continue
        rel = os.path.relpath(p, ROOT)
        os.makedirs(os.path.dirname(os.path.join(OUT, rel)), exist_ok=True)
        shutil.copy2(p, os.path.join(OUT, rel))
SHIM = '<script>' + open(os.path.join(ROOT, 'tools', 'itch_shim.js'), encoding='utf-8').read() + '</script>'
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
i = html.index('<head>') + len('<head>')
html = html[:i] + SHIM + html[i:]
# the itch.io build has no "Go to area" button on the title screen (the debug jump stays on the Pages build)
GO = "items.push(['tgoto','Go to area']);"
assert GO in html
html = html.replace(GO, '')
# the powerful test weapons are for the Pages build only: the itch.io build never hands them out
TW = 'function giveTestWeapons(){'
assert TW in html
html = html.replace(TW, TW + 'return;')
# the manual is a separate download on the itch page, so the menu button for it is hidden in this build
MF = "const MANUAL_FILE='Below-the-Abbey-manual.pdf';"
assert MF in html
WITH_MANUAL = '--manual' in sys.argv   # python tools/pack_itch.py --manual : the manual PDF goes into the zip too (itch-build-with-manual.zip) and the menu button stays
if WITH_MANUAL:
    MAN = os.path.join(ROOT, 'Below-the-Abbey-manual.pdf')
    if os.path.exists(MAN): shutil.copy2(MAN, os.path.join(OUT, 'manual', 'Below-the-Abbey-manual.pdf')) if os.makedirs(os.path.join(OUT, 'manual'), exist_ok=True) is None else None
    html = html.replace(MF, "const MANUAL_FILE='manual/Below-the-Abbey-manual.pdf';")
else:
    html = html.replace(MF, "const MANUAL_FILE='';")
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='').write(html)
n = 0
ZIPNAME = 'itch-build-with-manual.zip' if WITH_MANUAL else 'itch-build.zip'
z = zipfile.ZipFile(os.path.join(ROOT, ZIPNAME), 'w', zipfile.ZIP_STORED)
allf = []
for r, d, f in os.walk(OUT):
    for x in f: allf.append(os.path.join(r, x))
# index.html first, then pack.json, then the packs and assets, the manual PDF last
allf.sort(key=lambda p: (0 if os.path.basename(p) == 'index.html' else 1 if os.path.basename(p) == 'pack.json' else 3 if p.endswith('.pdf') else 2, p))
for p in allf: z.write(p, os.path.relpath(p, OUT)); n += 1
z.close()
print(ZIPNAME, 'files in the zip:', n, 'size MB:', round(os.path.getsize(os.path.join(ROOT, ZIPNAME)) / 1e6))
