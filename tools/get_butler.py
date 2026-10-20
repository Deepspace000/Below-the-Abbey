"""Download itch.io's butler (the official build from broth.itch.zone) into tools/butler/ :  python tools/get_butler.py
Then log in once yourself:  tools/butler/butler login   (windows: tools\butler\butler.exe login)"""
import io, os, platform, sys, urllib.request, zipfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
osn = {'Windows': 'windows', 'Darwin': 'darwin', 'Linux': 'linux'}[platform.system()]
arch = 'arm64' if platform.machine().lower() in ('arm64', 'aarch64') else 'amd64'
url = 'https://broth.itch.zone/butler/%s-%s/LATEST/archive/default' % (osn, arch)
out = os.path.join(ROOT, 'tools', 'butler'); os.makedirs(out, exist_ok=True)
print('downloading', url)
data = urllib.request.urlopen(url).read()
zipfile.ZipFile(io.BytesIO(data)).extractall(out)
exe = os.path.join(out, 'butler.exe' if osn == 'windows' else 'butler')
if osn != 'windows': os.chmod(exe, 0o755)
print('butler is in', out); os.system('"%s" -V' % exe)
