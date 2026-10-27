"""Writes src/desert/gy_list.js from assets/gy/manifest.json (the Graveyard pictures that exist on disk): python tools/gy_list.py
The file also holds GY_ENABLED, the master switch of the whole graveyard (see tools/GRAVEYARD_NOTES.md); set ENABLED below to True to turn it on."""
import json, pathlib
ENABLED = False
R = pathlib.Path(__file__).resolve().parent.parent
man = json.loads((R / 'assets' / 'gy' / 'manifest.json').read_text())
out = {k: [v['file'], v['w'], v['h'], v['kind'][0]] for k, v in sorted(man.items()) if (R / 'assets' / 'gy' / v['file']).exists()}
head = ('/* written by tools/gy_list.py from assets/gy/manifest.json: name -> [file, width, height, kind (s sprite, t texture)] */\n'
        '/* THE MASTER SWITCH of the Wenlock Graveyard (work in progress, see tools/GRAVEYARD_NOTES.md). false: no gate in Wenlock, no Go to area rows, no jump link, no pictures loaded with the town. true: all of it. */\n')
(R / 'src' / 'desert' / 'gy_list.js').write_text(head + 'const GY_ENABLED=' + ('true' if ENABLED else 'false') + ';\nconst GY_LIST=' + json.dumps(out, separators=(',', ':')) + ';\n', encoding='utf-8')
print(len(out), 'pictures; GY_ENABLED =', ENABLED)
