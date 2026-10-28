"""node --check every <script> block of index.html"""
import re, subprocess, tempfile, os, sys
s = open('index.html', encoding='utf-8').read()
bad = 0
for i, m in enumerate(re.finditer(r'<script(?![^>]*src)[^>]*>(.*?)</script>', s, re.S)):
    f = os.path.join(tempfile.gettempdir(), 'b9s_chk_%d.js' % i); open(f, 'w', encoding='utf-8').write(m.group(1))
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
    if r.returncode: bad += 1; print('block', i, r.stderr[:400])
print('blocks checked, bad =', bad)
