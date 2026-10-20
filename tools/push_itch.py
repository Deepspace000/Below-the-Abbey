"""Push the browser build (and the manual) to itch.io with butler, so only the changed parts are uploaded.

    python tools/push_itch.py user/game preview     builds itch-build/ and lists what would change (nothing is uploaded)
    python tools/push_itch.py user/game push        builds itch-build/ and pushes it to the channel 'html5' (goes live in that channel at once)
    python tools/push_itch.py user/game manual      pushes the manual PDF alone to the channel 'manual' (a plain download on the page)

user/game is the itch.io project, all lower case (for https://name.itch.io/game it is name/game).
One-time setup: run  butler login  yourself (it opens a browser), then on the game's Edit page set the 'html5' file to 'This file will be played in the browser'.
Butler is at C:/Users/mirko/tools/butler-dl/butler.exe (set BUTLER to use another copy)."""
import os, re, subprocess, sys, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUTLER = os.environ.get('BUTLER', 'C:/Users/mirko/tools/butler-dl/butler.exe')
if len(sys.argv) < 3 or '/' not in sys.argv[1]:
    sys.exit(__doc__)
target, mode = sys.argv[1], sys.argv[2]
ver = re.search(r"const VERSION='([0-9.]+)'", open(os.path.join(ROOT, 'index.html'), encoding='utf-8', errors='ignore').read()).group(1)
def run(*a):
    print('>', ' '.join(a)); return subprocess.call(list(a))
if mode in ('preview', 'push'):
    subprocess.check_call([sys.executable, os.path.join(ROOT, 'tools', 'pack_itch.py')])      # builds itch-build/ (no manual inside)
    folder = os.path.join(ROOT, 'itch-build')
    if mode == 'preview': sys.exit(run(BUTLER, 'push-preview', '--changes-only', folder, target + ':html5'))
    sys.exit(run(BUTLER, 'push', folder, target + ':html5', '--userversion', ver))
if mode == 'manual':
    d = os.path.join(ROOT, 'itch-manual'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    shutil.copy2(os.path.join(ROOT, 'Below-the-Abbey-manual.pdf'), d)
    sys.exit(run(BUTLER, 'push', d, target + ':manual', '--userversion', ver))
sys.exit(__doc__)
