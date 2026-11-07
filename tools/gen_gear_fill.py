"""Makes src/desert/gear_fill.js and tools/GEAR_FILL_ICONS.md (the paint list) from the tables below.
   python tools/gen_gear_fill.py        then   python tools/inject.py
"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
LV = list(range(44, 113, 4))
# [dagger name, dagger effect, dagger extras, dagger look, wand name, wand effect, wand extras, wand look]
T = [
 ("Brigand's Stiletto", {"bleed":[.4,12,5]}, {}, "long thin steel stiletto with a plain leather-wrapped grip and a small round guard",
  "Hazel Wand", {"daze":.2}, {}, "slim hazel-wood wand with a bark-ringed handle and a small brass cap at the tip"),
 ("Pilgrim's Misericorde", {"exec":[.3,2.5]}, {}, "plain grey misericorde dagger with a cross-shaped guard and a pewter pommel",
  "Silverring Wand", {"daze":.25}, {}, "pale ash wand with three thin silver rings around the shaft"),
 ("Gravedigger's Spike", {"poison":[.35,12,5]}, {}, "black iron spike dagger, a little green grave-mould on the blade, wooden handle",
  "Bone Wand", {"curse":[.25,5]}, {}, "wand carved from a yellowed finger bone, knuckle joints visible, a small black bead at the tip"),
 ("Saltwind Dirk", {"slow":[.3,3]}, {}, "pale bronze dirk with a rope-wrapped grip and a small shell set in the pommel",
  "Saltglass Wand", {"slow":[.3,3]}, {}, "wand of pale blue sea-glass twisted like a corkscrew, a rope grip"),
 ("Thornfang", {"bleed":[.45,14,5]}, {}, "green dagger with a blade curved like a long thorn and a handle of twisted briar",
  "Briar Wand", {"poison":[.3,12,5]}, {}, "twisting green briar wand with tiny thorns and one white flower bud at the tip"),
 ("Lantern Knife", {"burn":[.3,12,4]}, {}, "brass dagger whose guard is a tiny lantern cage with an orange flame inside",
  "Candle Wand", {"burn":[.3,12,4]}, {}, "slim black wand ending in a short white candle with a small flame"),
 ("Blightcutter", {"curse":[.3,5]}, {}, "rust-brown dagger with a pitted blade and a grip wrapped in grey rags",
  "Raven Wand", {"fear":[.25,3]}, {}, "black wand with a small carved raven head at the tip and a few black feathers tied to the grip"),
 ("Cinder Kris", {"burn":[.4,14,5]}, {}, "kris dagger with a wavy black blade glowing orange along its cracks",
  "Cinder Wand", {"burn":[.4,14,5],"shock":.1}, {}, "charred black wand glowing orange inside cracks, a small ember at the tip"),
 ("Mirrorshard", {"blind":[.3,3]}, {}, "dagger whose blade is a shard of silvery mirror glass, a black iron handle",
  "Mirror Wand", {"blind":[.3,3],"daze":.2}, {}, "wand with a small round silver mirror at the tip, black handle"),
 ("Wyrmtooth Dagger", {"bleed":[.4,16,6],"bossdmg":.3}, {}, "ivory dagger made from a dragon tooth, curved, with a bone handle",
  "Wyrmbone Wand", {"bossdmg":.35,"burn":[.2,12,4]}, {}, "ivory wand of dragon bone ridged like a spine with a small curved tooth at the tip"),
 ("Emberglass Stiletto", {"burn":[.4,14,5]}, {}, "stiletto of translucent orange glass with a glowing core and a black grip",
  "Amber Wand", {"slow":[.35,3],"manaleech":2}, {}, "wand with a large teardrop of amber at the tip with a tiny insect inside, brass handle"),
 ("Starsliver", {"chain":[.4,3]}, {}, "slim midnight-blue dagger scattered with tiny stars and a silver hilt",
  "Starlight Wand", {"chain":[.4,3]}, {}, "dark blue wand set with tiny white stars and a bright four-point star at the tip"),
 ("Bloodmoon Kris", {"bleed":[.45,18,6]}, {"lifesteal":.05}, "crimson kris with a wavy red blade and a black grip with a small red moon on the pommel",
  "Bloodmoon Wand", {"curse":[.3,5]}, {"lifesteal":.04}, "deep red wand with a small crescent moon at the tip and a black grip"),
 ("Voidglass Knife", {"fear":[.3,3]}, {"crit":.06}, "knife of black obsidian glass with violet light in its veins",
  "Voidglass Wand", {"fear":[.3,3],"curse":[.25,5]}, {"critDmg":.15}, "wand of black obsidian glass with violet light inside and a small dark crystal at the tip"),
 ("Sunsteel Poniard", {"blind":[.3,3],"bossdmg":.4}, {"regen":.2}, "golden poniard with a triangular blade and a small sun engraved on the guard",
  "Sunsteel Wand", {"blind":[.3,3],"bossdmg":.4}, {"regen":.2}, "golden wand with a small sun disc at the tip and gold rays"),
 ("Tidal Kris", {"poison":[.4,14,5],"slow":[.3,3]}, {}, "green bronze kris with a wavy blade and a pearl on the pommel, dripping seawater",
  "Tidal Wand", {"poison":[.4,14,5],"slow":[.3,3]}, {}, "green bronze wand with a coral branch and a pearl at the tip"),
 ("Moonsilver Dirk", {"exec":[.35,4]}, {"crit":.08}, "pale silver-blue dirk with a thin crescent moon cut in the blade and a white grip",
  "Moonstone Wand", {"bossdmg":.45,"daze":.3}, {"mpRegen":.6}, "silver wand with a glowing white moonstone at the tip"),
 ("Godforged Stiletto", {"exec":[.35,4],"bossdmg":.5}, {"lifesteal":.07,"crit":.1}, "radiant white-gold stiletto with a tiny pair of feathered wings forming the guard",
  "Godforged Wand", {"bossdmg":.55,"chain":[.5,4],"manaleech":4}, {"mpRegen":.9}, "radiant white-gold wand with small wings and a halo ring at the tip"),
]
# swords and bows to fill: level, name, effect, look
SW = [(42,"Ironwood Falchion",{"bleed":[.3,10,4]},"single-edged falchion with a wide curved blade and a wooden grip"),
      (46,"Marshwarden Blade",{"slow":[.25,3]},"straight green-grey blade with a leather grip and a small reed pattern on the guard"),
      (54,"Bellfounder's Sword",{"stun":.15},"broad bronze-hilted sword with a small bell hung at the crossguard"),
      (58,"Rookery Broadsword",{"fear":[.2,3]},"black broadsword with a raven's wing carved into the guard")]
BW = [(42,"Reedwood Longbow",{"pierce":1},"tall pale reed-wood bow with a green cord grip"),
      (46,"Marshhawk Bow",{"bossdmg":.2},"curved brown bow with a hawk feather tied to the grip"),
      (54,"Briarstring Bow",{"bleed":[.3,10,4]},"dark bow whose limbs are twisted briar with thorns"),
      (58,"Rookfeather Bow",{"pierce":1,"double":.15},"black bow with raven feathers along the limbs")]
AXMC = [("ax",54,"Hollowmark Axe",{"cleave":1}),("ax",58,"Bellguard Axe",{"daze":.15,"cleave":1}),
        ("mc",54,"Chantry Mace",{"vuln":[.25,4]}),("mc",58,"Vigil Mace",{"stun":.15}),
        ("mc",10,"Parish Mace",{}),("mc",30,"Ironwarden Mace",{"stun":.1}),("mc",40,"Gravebell Mace",{"vuln":[.2,4]})]
data = dict(LV=LV, T=T, SW=SW, BW=BW, AXMC=AXMC)
js = open(ROOT/'tools'/'gear_fill_tpl.js').read().replace('/*DATA*/', json.dumps(data, separators=(',',':')))
(ROOT/'src'/'desert'/'gear_fill.js').write_text(js, encoding='utf-8')
rows = ["# Icons to paint for the new weapons (gear_fill.js)", "",
 "Each needs a 128 by 128 transparent icon `assets/icn_<id>.png`: sheet on flat magenta, STRICT FRONT ELEVATION, exactly straight on, symmetrical, no depth, no perspective, no angle, the item upright, then `python tools/ingest_icon.py <sheet> <id> col,row,cols,rows`.", "",
 "| id | name | look |", "|---|---|---|"]
for L, t in zip(LV, T):
    rows.append(f"| gf_dg{L} | {t[0]} | Dagger, point up: {t[3]} |")
for L, t in zip(LV, T):
    rows.append(f"| gf_wd{L} | {t[4]} | Magic wand, tip up: {t[7]} |")
for L, n, e, lk in SW: rows.append(f"| gf_sw{L} | {n} | Sword, point up: {lk} |")
for L, n, e, lk in BW: rows.append(f"| gf_bw{L} | {n} | Bow, upright: {lk} |")
(ROOT/'tools'/'GEAR_FILL_ICONS.md').write_text("\n".join(rows)+"\n", encoding='utf-8')
print(len(rows)-6, 'icons listed')
