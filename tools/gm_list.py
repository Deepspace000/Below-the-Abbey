"""Writes src/desert/garden_list.js from assets/gm/manifest.json (the Maze of Gardens pictures): python tools/gm_list.py"""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
man = json.loads((R / 'assets' / 'gm' / 'manifest.json').read_text())
out = {k: [v['file'], v['w'], v['h'], v['kind'][0]] for k, v in sorted(man.items())}
(R / 'src' / 'desert' / 'garden_list.js').write_text('/* written by tools/gm_list.py from assets/gm/manifest.json: name -> [file, width, height, kind (s sprite, t texture)] */\nconst GM_LIST=' + json.dumps(out, separators=(',', ':')) + ';\n', encoding='utf-8')
print(len(out), 'pictures')
