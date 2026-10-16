"""Release stamp: writes version.json (the page checks it, so a stale browser copy reloads itself) and play.html, a copy of index.html under a name no browser has cached yet.
Run after bumping VERSION and before committing."""
import os, re, json, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
v = re.search(r"const VERSION='([0-9.]+)'", html).group(1)
json.dump({'v': v}, open(os.path.join(ROOT, 'version.json'), 'w'))
shutil.copyfile(os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'play.html'))
print('stamped', v)
