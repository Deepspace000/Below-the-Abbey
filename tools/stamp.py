"""Release stamp: writes version.json (the page checks it, so a stale browser copy reloads itself) and play.html, a copy of index.html under a name no browser has cached yet.
Run after bumping VERSION and before committing."""
import os, re, json, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
v = re.search(r"const VERSION='([0-9.]+)'", html).group(1)
json.dump({'v': v}, open(os.path.join(ROOT, 'version.json'), 'w'))
shutil.copyfile(os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'play.html'))
# the size of every picture, so the loading screen can show megabytes (assetsizes.json)
sizes = {}
for dp, dn, fn in os.walk(os.path.join(ROOT, 'assets')):
    for f in fn:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            full = os.path.join(dp, f)
            sizes[os.path.relpath(full, ROOT).replace(os.sep, '/')] = os.path.getsize(full)
json.dump(sizes, open(os.path.join(ROOT, 'assetsizes.json'), 'w'), separators=(',', ':'))
print('stamped', v, len(sizes), 'pictures')
# the list of content files and hashes the Windows app uses to update itself from GitHub Pages
import subprocess, sys
subprocess.check_call([sys.executable, os.path.join(ROOT, 'tools', 'make_win_manifest.py')])
