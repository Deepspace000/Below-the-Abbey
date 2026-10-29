# Icons for the Pale Spire gear (for the art agent; not painted yet)

Each item shows a painted icon from `assets/icn_<id>.png` if it exists, else its class icon (`ic`) tinted with its colour. Make 128 by 128 transparent icons the usual way: a sheet on flat magenta, STRICT FRONT ELEVATION, exactly straight on, symmetrical, no depth, no perspective, no angle, then `python tools/ingest_icon.py <sheet> <id> [col,row,cols,rows]`, then `python tools/inject.py` (it rebuilds ICN_FILES). `ps_gear.js` already lists every id in `ART_ITEM_IDS`, so no code change is needed. Palette: dark violet, black, antique brass, verdigris, bone. Gothic: pointed arches, tracery, roses, bells, candles, ravens, cobwebs.

| File | Item | One line |
|---|---|---|
| icn_pg_tollblade.png | Tollbell Greatsword | Upright greatsword with a bell-bronze blade, a small bell hung under the crossguard. |
| icn_pg_weepingedge.png | Blade of the Weeping Saint | Thin black sword, hilt carved as a weeping saint's face with green tears. |
| icn_pg_tearmaul.png | Tearstone Maul | Grey stone hammer head dripping clear drops, on a bone-pale haft. |
| icn_pg_reckoning.png | The Steward's Reckoning | Iron mace on a chain, brass head cast as a bunch of keys. |
| icn_pg_gargcleaver.png | Gargoyle-Wing Cleaver | Broad axe whose blade is a verdigris stone gargoyle wing on a black haft. |
| icn_pg_gaolheadsman.png | Drowned Gaoler's Headsman | Black headsman's axe streaked with green cistern slime. |
| icn_pg_falconbow.png | Falconer's Last Bow | Pale horn bow tied with black raven feathers, a leather falcon cuff on the grip. |
| icn_pg_winchbow.png | Portcullis-Wire Bow | Black iron bow strung with thick brass wire. |
| icn_pg_briarstaff.png | Briarwood Rood Staff | Twisting green briar staff, one pale white rose at the tip. |
| icn_pg_candlestaff.png | Staff of the Last Candle | Tall black staff topped with a tall candle and a small violet flame. |
| icn_pg_keyblade.png | Porter's Keyblade | Brass dagger whose blade is the toothed bit of an old key, ring-shaped pommel. |
| icn_pg_questioner.png | The Questioner's Hook | Short black hook-knife with a curved blade and a worn dark handle. |
| icn_pg_ravenhelm.png | Raven-Beak Helm | Black helm drawn forward into a long raven beak, two narrow eye slits. |
| icn_pg_candlecrown.png | Crown of a Hundred Candles | Brass crown ringed with small cups of black melted candle wax. |
| icn_pg_cathedralplate.png | Plate of the Black Cathedral | Black breastplate with pointed arches and a violet rose window over the heart. |
| icn_pg_pitplate.png | Reliquary Plate of the Pit | Bone-pale plate ribbed like a cage, small brass reliquary boxes on the chest. |
| icn_pg_harrowarms.png | Road Warden's Vambraces | Pair of grey vambraces gone green at the seams, one brass buckle. |
| icn_pg_falconarms.png | Falconer's Mourning Gauntlets | Black gauntlets, thick leather cuff on the left, a single black feather. |
| icn_pg_pilgrimlegs.png | Pilgrim's Mourning Greaves | Dark violet greaves worn through at the knees, a cord of small tin tags. |
| icn_pg_cobweblegs.png | Cobweb-Mail Leggings | Silver ring-mail leggings covered in fine grey spider silk. |
| icn_pg_votiveshield.png | Votive Shield of the Nine Tokens | Tall pointed brass-bound shield with nine small tokens hanging on chains. |
| icn_pg_dawnshield.png | Bulwark of the Last Dawn | Black heater shield with a pale half sunrise cut into its face. |
| icn_pg_cairnring.png | Cairn-Stone Band | Plain grey stone ring with a tiny carved cairn on the face. |
| icn_pg_briarring.png | Briar Rose Band | Ring of twisted green wire with one small white rose. |
| icn_pg_silencering.png | Ring of the Silent Question | Heavy plain black ring, smooth, with a single brass dot. |
| icn_pg_bellring.png | Drowned Bell Ring | Ring band holding a tiny green bronze bell. |
