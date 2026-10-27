"""Writes src/desert/ww_list.js from assets/ww/manifest.json (the Witch's Wood pictures that exist on disk): python tools/ww_list.py"""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
man = json.loads((R / 'assets' / 'ww' / 'manifest.json').read_text())
out = {k: [v['file'], v['w'], v['h'], v['kind'][0]] for k, v in sorted(man.items()) if (R / 'assets' / 'ww' / v['file']).exists()}
(R / 'src' / 'desert' / 'ww_list.js').write_text('/* written by tools/ww_list.py from assets/ww/manifest.json: name -> [file, width, height, kind (s sprite, t texture)] */\nconst WW_LIST=' + json.dumps(out, separators=(',', ':')) + ';\n', encoding='utf-8')
print(len(out), 'pictures')
