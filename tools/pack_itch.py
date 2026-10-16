"""Build an itch.io upload: index.html + a few big packs of the pictures + the audio. itch.io allows at most 1000 files in an HTML5 zip,
and the game has about 1500 pictures, so the pictures are glued into packs and handed to the page as blob URLs (see the shim below).
Usage: python tools/pack_itch.py   ->  itch-build/ and itch-build.zip"""
import os, json, shutil, zipfile, mimetypes
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
packs, cur, size, idx = [], [], 0, {}
LIMIT = 40 * 1024 * 1024
def flush():
    global cur, size
    if not cur: return
    name = 'pack%d.bin' % len(packs)
    off = 0
    with open(os.path.join(OUT, name), 'wb') as w:
        for p in cur:
            b = open(p, 'rb').read()
            rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
            idx[rel] = [len(packs), off, len(b), TYPES[os.path.splitext(p)[1].lower()]]
            w.write(b); off += len(b)
    packs.append(name); cur = []; size = 0
for p in imgs:
    s = os.path.getsize(p)
    if size + s > LIMIT: flush()
    cur.append(p); size += s
flush()
json.dump({'packs': packs, 'files': idx}, open(os.path.join(OUT, 'pack.json'), 'w'))
# the audio and the manifest stay as they are
for r, d, f in os.walk(os.path.join(ROOT, 'assets')):
    for x in f:
        p = os.path.join(r, x)
        if os.path.splitext(x)[1].lower() in TYPES: continue
        rel = os.path.relpath(p, ROOT)
        os.makedirs(os.path.dirname(os.path.join(OUT, rel)), exist_ok=True)
        shutil.copy2(p, os.path.join(OUT, rel))
SHIM = """<script>(function(){var map={},ready=false,q=[];var d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
function norm(v){if(typeof v!=='string')return null;var s=v.split('?')[0].split('#')[0],i=s.indexOf('assets/');return i>=0?s.slice(i):null}
Object.defineProperty(HTMLImageElement.prototype,'src',{configurable:true,enumerable:true,get:function(){return d.get.call(this)},set:function(v){var k=norm(v);if(!k||k.indexOf('assets/audio/')===0){d.set.call(this,v);return}if(!ready){q.push([this,v,k]);return}d.set.call(this,map[k]||v)}});
function go(){ready=true;for(var i=0;i<q.length;i++)d.set.call(q[i][0],map[q[i][2]]||q[i][1]);q=[]}
fetch('pack.json').then(function(r){return r.json()}).then(function(P){var bl=[];return Promise.all(P.packs.map(function(n,i){return fetch(n).then(function(r){return r.blob()}).then(function(b){bl[i]=b})})).then(function(){for(var k in P.files){var f=P.files[k];map[k]=URL.createObjectURL(bl[f[0]].slice(f[1],f[1]+f[2],f[3]))}go()})}).catch(function(e){console.error('pack',e);go()});
})();</script>"""
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
i = html.index('<head>') + len('<head>')
html = html[:i] + SHIM + html[i:]
# the itch.io build has no "Go to area" button on the title screen (the debug jump stays on the Pages build)
GO = "items.push(['tgoto','Go to area']);"
assert GO in html
html = html.replace(GO, '')
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='').write(html)
n = 0
z = zipfile.ZipFile(os.path.join(ROOT, 'itch-build.zip'), 'w', zipfile.ZIP_STORED)
for r, d, f in os.walk(OUT):
    for x in f:
        p = os.path.join(r, x); z.write(p, os.path.relpath(p, OUT)); n += 1
z.close()
print('files in the zip:', n, 'size MB:', round(os.path.getsize(os.path.join(ROOT, 'itch-build.zip')) / 1e6))
