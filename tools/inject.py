"""Builds the desert region into index.html.

The game is one big HTML file. The desert code lives in src/desert/*.js; this script pastes those files, in
the order below, between the two marker comments in index.html (it adds the markers on the first run).

    python tools/inject.py
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
SRC = ROOT / 'src' / 'desert'
ORDER = ['artlist.js', 'artpack.js', 'paint.js', 'floors.js', 'sprites_out.js', 'creatures.js', 'sprites_tomb.js', 'teleport.js', 'magic.js', 'road.js', 'tomb.js', 'burrows.js', 'redsands.js', 'bluedunes.js', 'golden.js', 'dungeons.js', 'caravan.js', 'pyramid.js', 'terrain.js', 'khemetra_map.js', 'khemetra_art.js', 'khemetra_city.js', 'khemetra_data.js', 'khemetra_build.js', 'khemetra_people.js', 'khemetra_story.js', 'khemetra_quests.js', 'khemetra_main.js', 'khemetra_quests2.js', 'khemetra_world.js', 'khemetra_crowd.js', 'khemetra_walkers.js', 'khemetra_lights.js', 'khemetra_mapview.js', 'khemetra_cart.js', 'journal.js', 'afflictions.js', 'reputation.js', 'world.js', 'camp.js', 'pets.js', 'rumours.js', 'masks.js', 'yarrim_layout.js', 'yarrim.js', 'yarrim_town.js', 'yarrim_extras.js','yarrim_quests.js','yarrim_sound.js','wanderers.js', 'voyage.js', 'seas.js', 'oldhaven.js', 'oldhaven_quay.js','oldhaven_fair.js','oldhaven_siege.js','oldhaven_oak.js','oldhaven_below.js','landpath.js','monastery.js','monastery_quests.js','monastery_build.js','hollow.js', 'hollow_haunt.js', 'seasound.js', 'underwater.js', 'seanav.js', 'seaquests.js', 'shellquest.js', 'embark.js', 'krakenquest.js', 'difficulty.js', 'story.js', 'spells.js', 'gear.js', 'armour.js', 'pilgrim.js', 'new_shops.js', 'lockpicks.js', 'passpath.js', 'dunes.js', 'logic.js', 'logic2.js', 'goldcut.js', 'manualmenu.js', 'uilist.js', 'stonebuttons.js', 'titlelogo.js', 'boot.js', 'hints.js', 'stats.js', 'controller.js','hovertips.js', 'healcost.js', 'desertchests.js', 'gems.js', 'collect.js', 'herbal.js', 'shrines.js', 'impact.js', 'shortcuts.js', 'powerfx.js', 'hollow_traps.js', 'worldback.js', 'potslots.js', 'monmusic.js', 'gotosearch.js', 'pforest.js', 'wilds.js', 'weight.js', 'hollowgrass.js', 'hollowgrass_land.js', 'hollowgrass_lex.js', 'hollowgrass_talk.js','hollowgrass_gloss.js','hollowgrass_map.js','hollowgrass_story.js','hgt_engine.js','hgt_lib.js','hgt_maze.js','hgt_tanks.js','hgt_mesh.js','hgt_giants.js','hgt_life.js','hgt_art.js','hgt_art2.js','hgt_lamps.js','hgt_walls.js','hgt_narrow.js','hgt_trader.js','hgt_pets.js','hgt_talk.js','hgt_nibb_tower.js','divehelms.js','lookaround.js','hgt_rooms.js','hgt_town_exsce.js','hgt_town_nibb.js','hgt_town_glorm.js','hgt_town_ulb.js','hgt_books_text.js','hgt_books.js','maps_common.js','maps_abbey.js','maps_thornwood.js','maps_thornwick.js','maps_gwood.js','maps_ironroad.js','maps_ironhill.js','maps_gravesmines.js','maps_moorpass.js','maps_greendale.js','maps_anaea.js','maps_desert.js','maps_bluedunes.js','maps_whitedunes.js','maps_flatlands.js','maps_goldenerg.js','maps_violeterg.js','maps_yarrim.js','maps_saltbarrow.js','maps_bells.js','maps_cinder.js','maps_lastlight.js','maps_oldhaven.js','maps_oh_base.js','maps_oh_castle.js','maps_oh_square.js','maps_oh_oldtown.js','maps_oh_fair.js','maps_oh_south.js','maps_oh_quay.js','maps_os440.js','maps_os441.js','maps_os442.js','maps_os443.js','maps_os444.js','maps_os445.js','maps_os446.js','maps_os447.js','maps_os448.js','maps_os449.js','maps_os450.js','maps_os451.js','maps_os452.js','maps_os453.js','maps_os454.js','maps_os455.js','maps_os456.js','maps_os457.js','maps_os458.js','maps_os459.js','maps_os364.js','maps_khemetra.js','maps_pilgrim_monsters.js','maps_pilgrim.js','maps_play.js','wxhud.js','maps_world.js','mglist.js','marginalia_img.js', 'hgt_deeper.js', 'hgd_maze.js', 'hgd_people.js', 'hgd_secrets.js', 'hgd_maps.js', 'hgd_maps2.js', 'hgd_fun.js', 'hgd_under.js', 'hgd_tele.js', 'hgd_thinkers.js', 'hgd_water.js', 'hgd_fresh.js', 'hgd_waterq.js', 'hgd_plates.js', 'hgd_boat.js', 'hgd_quests2.js', 'hgd_flora.js', 'hgd_marsh.js', 'hgd_marshfoes.js', 'hgd_eyes.js', 'hgd_thieves.js', 'hgd_minis.js', 'hgd_shops2.js', 'butterfly_patch.js', 'hgd_ocean.js', 'hgd_oceanfoes.js', 'buried.js', 'hgd_details.js', 'hgd_lakes.js', 'hgd_vermin.js', 'hgd_verminu.js', 'hgd_dark.js', 'hgd_escape.js', 'hgd_stalls.js', 'hgd_highgear.js', 'hgd_balance.js', 'food_health.js']
BEGIN = '/*@@DESERT:BEGIN@@*/'
END = '/*@@DESERT:END@@*/'
ANCHOR = '/* ---------- boot ---------- */'

# the list of painted pictures is whatever assets/ds_*.png files exist
names = sorted(p.stem[3:] for p in (ROOT / 'assets').glob('ds_*.png') if not p.stem[3:].startswith(('dune', 'rdune', 'bdune', 'dpeb', 'rpeb', 'bpeb')))  # the flat dune and ripple pictures are no longer used
(SRC / 'artlist.js').write_text('/* written by tools/inject.py */'+chr(10)+'const DS_PAINTED=' + repr(names) + ';'+chr(10), encoding='utf-8')
# the list of painted marginalia pictures (assets/mg/manifest.json) for src/desert/marginalia_img.js
import json
_mg = ROOT / 'assets' / 'mg' / 'manifest.json'
_man = json.loads(_mg.read_text()) if _mg.exists() else {}
(SRC / 'mglist.js').write_text('/* written by tools/inject.py from assets/mg/manifest.json: name -> [file, width, height] */' + chr(10) + 'const MG_LIST=' + json.dumps({k: [v['file'], v['w'], v['h']] for k, v in _man.items()}, separators=(',', ':')) + ';' + chr(10), encoding='utf-8')
# the painted button slabs, one folder per style (assets/ui/<style>/manifest.json, cut by tools/ingest_ui.py) for src/desert/stonebuttons.js
_uist = {d.parent.name: json.loads(d.read_text()) for d in sorted((ROOT / 'assets' / 'ui').glob('*/manifest.json'))}
_uifirst = ('gold', 'ruby', 'green', 'brown', 'turquoise', 'tapered', 'sandstone', 'stone', 'round',   # the plain bars first (the Gameplay page cycles in this order)
            'winged', 'filigree', 'filigreegold', 'winged_ruby', 'filigree_ruby', 'winged_green', 'filigree_green', 'winged_brown', 'filigree_brown', 'winged_turquoise', 'filigree_turquoise')   # then the fancy ones
_uiorder = [k for k in _uifirst if k in _uist] + [k for k in _uist if k not in _uifirst]
(SRC / 'uilist.js').write_text('/* written by tools/inject.py from the manifest.json in each folder of assets/ui */' + chr(10) + 'const UI_LIST=' + json.dumps({'order': _uiorder, 'styles': {k: _uist[k] for k in _uiorder}}, separators=(',', ':')) + ';' + chr(10), encoding='utf-8')
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
