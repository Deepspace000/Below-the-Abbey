"""Push the browser build (and the manual) to itch.io with butler, so only the changed parts are uploaded.

    python tools/push_itch.py preview     builds itch-build/ and lists what would change (nothing is uploaded)
    python tools/push_itch.py push        builds itch-build/ and pushes it to the channel 'html5' (goes live in that channel at once)
    python tools/push_itch.py manual      pushes the manual PDF alone to the channel 'manual' (a plain download on the page)

The project is bickering-goat/below-the-abbey (https://bickering-goat.itch.io/below-the-abbey); give another one as a last argument if needed.
One-time setup on a new computer: python tools/get_butler.py  (downloads butler into tools/butler), then run  butler login  yourself (it opens a browser),
then on the game's Edit page set the 'html5' file to 'This file will be played in the browser'. See ITCH.md."""
import os, re, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = next((a for a in sys.argv[2:] if '/' in a), 'bickering-goat/below-the-abbey')
def find_butler():
    exe = 'butler.exe' if os.name == 'nt' else 'butler'
    for c in (os.environ.get('BUTLER'), shutil.which('butler'), os.path.join(ROOT, 'tools', 'butler', exe), 'C:/Users/mirko/tools/butler-dl/butler.exe'):
        if c and os.path.exists(c): return c
    sys.exit('butler not found: run  python tools/get_butler.py  first')
if len(sys.argv) < 2 or sys.argv[1] not in ('preview', 'push', 'manual'): sys.exit(__doc__)
mode = sys.argv[1]; BUTLER = find_butler()
ver = re.search(r"const VERSION='([0-9.]+)'", open(os.path.join(ROOT, 'index.html'), encoding='utf-8', errors='ignore').read()).group(1)
def run(*a):
    print('>', ' '.join(a)); return subprocess.call(list(a))
if mode in ('preview', 'push'):
    subprocess.check_call([sys.executable, os.path.join(ROOT, 'tools', 'pack_itch.py')])      # builds itch-build/ (no manual inside)
    folder = os.path.join(ROOT, 'itch-build')
    if mode == 'preview': sys.exit(run(BUTLER, 'push-preview', '--changes-only', folder, TARGET + ':html5'))
    sys.exit(run(BUTLER, 'push', folder, TARGET + ':html5', '--userversion', ver))
d = os.path.join(ROOT, 'itch-manual'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
shutil.copy2(os.path.join(ROOT, 'Below-the-Abbey-manual.pdf'), d)
sys.exit(run(BUTLER, 'push', d, TARGET + ':manual', '--userversion', ver))
