"""Makes src/desert/armour_fill.js and tools/ARMOUR_FILL_ICONS.md. python tools/gen_armour_fill.py ; python tools/inject.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
# key, name, level, colour, flavour, effects (helm, chest, arms, legs), set bonus, title, piece names, look
S = [
 ("hedge","Hedgewarden",15,"#6a8a4a","Green-dyed leather with brass studs, made for those who guard the hedgerows.",["dodge","regen","crit","hungerSlow"],{"ward":3,"regen":.2},"Hedgewarden Ranger",
  ["Hedgewarden Cap","Hedgewarden Jerkin","Hedgewarden Bracers","Hedgewarden Leggings"],"green-dyed leather with brass studs"),
 ("marsh","Marshscale",25,"#5a8a7a","Overlapping green-grey fish scales on a leather backing.",["ward","dodge","thorns","regen"],{"ward":5,"dodge":.04},"Marshscale Warden",
  ["Marshscale Helm","Marshscale Hauberk","Marshscale Bracers","Marshscale Greaves"],"overlapping green-grey fish scales on dark leather"),
 ("dune","Dunebronze",35,"#c8a050","Sand-polished bronze plate with a wind-worn finish.",["crit","ward","regen","dodge"],{"thorns":5,"regen":.3},"Dunebronze Nomad",
  ["Dunebronze Helm","Dunebronze Cuirass","Dunebronze Bracers","Dunebronze Greaves"],"polished sand-coloured bronze plate with a scarf wrap"),
 ("briar","Briarthorn",45,"#4a7a3a","Dark green plate grown over with thorny briar.",["thorns","regen","critDmg","ward"],{"thorns":10,"regen":.4},"Briarthorn Warden",
  ["Briarthorn Helm","Briarthorn Cuirass","Briarthorn Bracers","Briarthorn Greaves"],"dark green plate wrapped in thorny briar vines"),
 ("bell","Bellfounder",55,"#b08a50","Heavy bell-bronze plate that rings faintly when struck.",["mpRegen","ward","dodge","crit"],{"mpRegen":.3,"ward":6},"Bellfounder Guard",
  ["Bellfounder Helm","Bellfounder Cuirass","Bellfounder Bracers","Bellfounder Greaves"],"heavy golden bell-bronze plate with small bell shapes"),
 ("ash","Ashfold",75,"#7a7a88","Ash-grey iron plate with a black sooty edge.",["ward","lifesteal","regen","critDmg"],{"lifesteal":.05,"ward":7},"Ashfold Warden",
  ["Ashfold Helm","Ashfold Cuirass","Ashfold Bracers","Ashfold Greaves"],"ash-grey iron plate with soot-black edges"),
 ("tide","Tidewrought",85,"#4a9a8a","Green bronze plate worn smooth by the sea, with pearls set in the joints.",["dodge","regen","mpRegen","thorns"],{"dodge":.06,"mpRegen":.4},"Tidewrought Mariner",
  ["Tidewrought Helm","Tidewrought Cuirass","Tidewrought Bracers","Tidewrought Greaves"],"green verdigris bronze plate with pearls and coral"),
 ("blood","Bloodmoon",95,"#a02030","Crimson plate with a small red moon on every piece.",["lifesteal","critDmg","crit","dmgPct"],{"lifesteal":.1,"crit":.05},"Bloodmoon Reaver",
  ["Bloodmoon Helm","Bloodmoon Cuirass","Bloodmoon Bracers","Bloodmoon Greaves"],"deep crimson plate with a small red crescent moon on each piece"),
 ("moon","Moonsilver",105,"#c0d0e8","Pale silver plate that glows faintly at night.",["mpRegen","crit","dodge","critDmg"],{"mpRegen":.6,"dodge":.08,"secondWind":.45},"Moonsilver Warden",
  ["Moonsilver Helm","Moonsilver Cuirass","Moonsilver Bracers","Moonsilver Greaves"],"pale blue-white silver plate with soft glowing moonstone inlays"),
 ("sera","Seraphim",110,"#fff0c0","White and gold plate with folded wings on the shoulders.",["ward","regen","lifesteal","critDmg"],{"secondWind":.5,"dmgPct":.12,"ward":10,"mpRegen":.4},"Seraphim Exemplar",
  ["Seraphim Helm","Seraphim Cuirass","Seraphim Bracers","Seraphim Greaves"],"radiant white and gold plate with feathered wings"),
]
SH = [(15,"Hedgewarden Buckler","small round wooden buckler with a green rim and a brass boss"),(25,"Marshscale Shield","kite shield covered in green-grey scales"),
 (35,"Dunebronze Shield","round bronze shield with a sand-coloured rim and a sun-bleached boss"),(45,"Briarthorn Shield","dark green heater shield wound with thorny briar"),
 (55,"Bellfounder Shield","round bell-bronze shield with a small bell at its centre"),(65,"Chitin Bulwark","tall oval shield of overlapping brown beetle shell"),
 (70,"Stormwall Shield","blue steel tower shield etched with lightning"),(80,"Wyrmscale Shield","ivory dragon-bone shield with ridges and teeth"),
 (90,"Starward Shield","midnight blue shield scattered with silver stars"),(100,"Godward Shield","white and gold shield with a halo and small wings"),
 (110,"Seraphim Bulwark","huge white and gold shield with large folded wings")]
js = open(ROOT/'tools'/'armour_fill_tpl.js', encoding='utf-8').read().replace('/*DATA*/', json.dumps(dict(S=S, SH=SH), separators=(',',':')))
(ROOT/'src'/'desert'/'armour_fill.js').write_text(js, encoding='utf-8')
rows=["# Icons to paint for the new armour (armour_fill.js)","",
 "128 by 128 transparent icons `assets/icn_<id>.png`. Sheet on flat magenta, STRICT FRONT ELEVATION, exactly straight on, symmetrical, no depth, no perspective, no angle. Pieces: helm (front view of a helmet on its own), chest (front view of a breastplate on its own, no body), arms (a pair of vambraces side by side), legs (a pair of greaves side by side), shield (face on).","",
 "| id | name | look |","|---|---|---|"]
for k,n,L,c,f,e,b,t,names,look in S:
    for sx,nm,ty in zip("hcal",names,["Helm","Chest armour","Arm armour","Leg armour"]):
        rows.append(f"| ar_{k}_{sx} | {nm} | {ty}: {look} |")
for L,n,look in SH: rows.append(f"| sh_{L} | {n} | Shield: {look} |")
(ROOT/'tools'/'ARMOUR_FILL_ICONS.md').write_text("\n".join(rows)+"\n",encoding='utf-8')
print(len(rows)-6,'icons')
