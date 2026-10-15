"""Builds the desert region into index.html.

The game is one big HTML file. The desert code lives in src/desert/*.js; this script pastes those files, in
the order below, between the two marker comments in index.html (it adds the markers on the first run).

    python tools/inject.py
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
SRC = ROOT / 'src' / 'desert'
ORDER = ['artlist.js', 'artpack.js', 'paint.js', 'floors.js', 'sprites_out.js', 'creatures.js', 'sprites_tomb.js', 'teleport.js', 'magic.js', 'road.js', 'tomb.js', 'burrows.js', 'redsands.js', 'bluedunes.js', 'golden.js', 'dungeons.js', 'caravan.js', 'pyramid.js', 'terrain.js', 'khemetra_map.js', 'khemetra_art.js', 'khemetra_city.js', 'khemetra_data.js', 'khemetra_build.js', 'khemetra_people.js', 'khemetra_story.js', 'khemetra_quests.js', 'khemetra_main.js', 'khemetra_quests2.js', 'khemetra_world.js', 'khemetra_crowd.js', 'khemetra_walkers.js', 'khemetra_lights.js', 'khemetra_mapview.js', 'khemetra_cart.js', 'journal.js', 'afflictions.js', 'reputation.js', 'world.js', 'camp.js', 'pets.js', 'rumours.js', 'masks.js', 'yarrim_layout.js', 'yarrim.js', 'yarrim_town.js', 'yarrim_extras.js','yarrim_quests.js','yarrim_sound.js','wanderers.js', 'voyage.js', 'seas.js', 'oldhaven.js', 'oldhaven_quay.js', 'seasound.js', 'underwater.js', 'seanav.js', 'seaquests.js', 'shellquest.js', 'embark.js', 'krakenquest.js', 'story.js', 'spells.js', 'gear.js', 'new_shops.js', 'lockpicks.js', 'passpath.js', 'dunes.js', 'logic.js', 'logic2.js', 'goldcut.js', 'boot.js']
BEGIN = '/*@@DESERT:BEGIN@@*/'
END = '/*@@DESERT:END@@*/'
ANCHOR = '/* ---------- boot ---------- */'

# the list of painted pictures is whatever assets/ds_*.png files exist
names = sorted(p.stem[3:] for p in (ROOT / 'assets').glob('ds_*.png') if not p.stem[3:].startswith(('dune', 'rdune', 'bdune', 'dpeb', 'rpeb', 'bpeb')))  # the flat dune and ripple pictures are no longer used
(SRC / 'artlist.js').write_text('/* written by tools/inject.py */'+chr(10)+'const DS_PAINTED=' + repr(names) + ';'+chr(10), encoding='utf-8')
s = HTML.read_text(encoding='utf-8')
parts = []
for name in ORDER:
    f = SRC / name
    if f.exists():
        parts.append('/* ---- src/desert/%s ---- */\n%s' % (name, f.read_text(encoding='utf-8')))
block = BEGIN + '\n' + '\n'.join(parts) + '\n' + END + '\n'
if BEGIN in s:
    a = s.index(BEGIN); b = s.index(END) + len(END)
    # swallow the newline after END
    if s[b:b + 1] == '\n':
        b += 1
    s = s[:a] + block + s[b:]
else:
    assert s.count(ANCHOR) == 1, 'boot anchor not found'
    s = s.replace(ANCHOR, block + ANCHOR)
HTML.write_text(s, encoding='utf-8')

scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.S)
tmp = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/tmp/chk.js')
try:
    tmp.write_text(max(scripts, key=len), encoding='utf-8')
except Exception:
    pass
print('injected %d files, %d bytes' % (len(parts), len(block)))
