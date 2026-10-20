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
fetch('pack.json').then(function(r){return r.json()}).then(function(P){var bl=[];var tot={},got={};function prog(){var T=0,D=0;for(var k in tot){T+=tot[k];D+=got[k]||0}if(!T)return;var pc=Math.max(3,Math.min(97,Math.round(D/T*100)));var f=document.getElementById('ldfill');if(f)f.style.width=pc+'%';var nn=document.getElementById('ldnote');if(nn)nn.innerHTML='Downloading the pictures: '+Math.round(D/1048576)+' of '+Math.round(T/1048576)+' MB. This only happens once, please wait.'}return Promise.all(P.packs.map(function(n,i){return new Promise(function(res,rej){var x=new XMLHttpRequest();x.open('GET',n);x.responseType='blob';x.onprogress=function(e){if(e.lengthComputable){tot[i]=e.total;got[i]=e.loaded;prog()}};x.onload=function(){if(x.status>=200&&x.status<300){bl[i]=x.response;res()}else rej(new Error('download failed: '+n+' '+x.status))};x.onerror=function(){rej(new Error('download failed: '+n))};x.send()})})).then(function(){for(var k in P.files){var f=P.files[k];map[k]=URL.createObjectURL(bl[f[0]].slice(f[1],f[1]+f[2],f[3]))}go()})}).catch(function(e){console.error('pack',e);go()});
})();</script>"""
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
