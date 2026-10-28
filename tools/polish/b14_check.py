"""node --check every <script> block of index.html and every src/desert/blight_*.js: python tools/polish/b14_check.py"""
import re, subprocess, tempfile, os, glob
bad = 0
src = open('index.html', encoding='utf-8').read()
blocks = re.findall(r'<script[^>]*>(.*?)</script>', src, re.S)
tmp = tempfile.mkdtemp()
files = []
for i, b in enumerate(blocks):
    if len(b.strip()) < 5: continue
    p = os.path.join(tmp, 'b%d.js' % i); open(p, 'w', encoding='utf-8').write(b); files.append(p)
for f in glob.glob('src/desert/blight_*.js'): files.append(f)
for p in files:
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
    if r.returncode: bad += 1; print('BAD', p, r.stderr[:400])
print('checked', len(files), 'bad', bad)
