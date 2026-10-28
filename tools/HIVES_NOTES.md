# The four hives: smaller, a rescue in each, honey hues, glowing books

Files: src/desert/hollowgrass.js (hgHive: size, seed, honey hues, safe blockers), src/desert/hg_rescue.js (HGRS: the four rescues), src/desert/hg_hives.js (new, last in tools/inject.py ORDER:
floors, light colours, glowing books, map marks), src/desert/hollowgrass_map.js (hive icons tinted), src/desert/hollowgrass_talk.js (hints in Aldous Wend's offers),
tools/make_bound_frogs.py (honey captives, two palettes), tools/make_hive_captives.py (cocoons, wax cells), MAIN_QUEST_LINE.md (53a to 53c).
One small edit outside the injected block in index.html: the sprite light line (`if(s.decor&&s.decor.lift)lum=...`) so a decor picture can carry its own light.

## Sizes (levels 471 to 474, shortest walk from the door, measured with a flood fill that respects blocking decor)
| Hive | Grid before | Grid after | Open squares before | after | Walk to book before | after | Farthest square before | after |
|---|---|---|---|---|---|---|---|---|
| Hush (471) | 62x62 | 47x47 | 1658 | 956 | 84 | 59 (70%) | 85 | 60 |
| Droning (472) | 62x62 | 47x47 | 1487 | 997 | 76 | 54 (71%) | 81 | 60 |
| Amber (473) | 62x62 | 47x47 | 1197 | 1061 | book NOT reachable (848 of 1197 squares reachable) | 56 | 76 | 60 |
| Queen's (474) | 62x62 | 47x47 | 1322 | 957 | 88 | 52 (59%) | 90 | 62 |
Grid 47/62 is 76% per side (58% of the area). The lattice of chambers went from 6x7 to 5x6, spacing 9x8.2 to 8x7.2, a seed shift per hive (HG_SDX) was chosen from a scan of 30 seeds so the walk to the book is short.
Walks to the captives: 12 to 54 squares (all 32 captives walked to for real with doMove, enemies removed).
Counts (before, after): chests 4+i same, jars+barrels 9 same, loose eggs 26 same (placed), pick-ups (honeycomb 6, jelly 3, grubs 3) same, boss, lectern and book same. Creatures about 0.6x
(Hush 12 to 7, Droning 16 to 11, Amber 20 to 13, Queen 24 to 15, boss included in neither count), same kinds. Chamber eggs (walk-through) follow the chamber count; the boss chamber no longer has one in front of the book.
The old Amber Hive had an unreachable pocket (book included): chests, jars and eggs are now only placed where a flood fill says every square stays reachable.

## The rescues (Aldous Wend, in Exsce, gives all of them; each is taken with the hive's book quest and offered again as the party enters the hive)
| Quest | Hive | Captors | Reward (base, the game doubles quest pay) |
|---|---|---|---|
| hgrescue1 Caught in the Clover Honey | Hush | pale honey and rope | 1,100 gold, 14,000 xp |
| hgrescue2 Wrapped in Silk | Droning | grey silk cocoons hanging by a thread | 1,300 gold, 17,000 xp |
| hgrescue3 Sealed in the Wax | Amber | hexagonal wax cells | 1,400 gold, 18,500 xp |
| hgrescue Freed from the Honey | Queen's | dark honey and rope | 1,500 gold, 20,000 xp, Amberthorn spear (unchanged) |
State: G.flags.hgFreed1, hgFreed2, hgFreed3 (Queen's keeps hgFreed); the freed captives are saved with the level's decor (checked with snapshot and restore). Eight names and eight lines per hive, all different.
The aids are placed at chamber centres, 8 apart (relaxed to 4 if needed), out of reach of the door and boss, only on squares the party can walk to. Freed by walking into one, tapping it, or attack in front, as before.

## Honey hues (HG_HONEY in hollowgrass.js)
Hush clover (cream gold), Droning heather (orange brown), Amber deep amber (red gold), Queen's buckwheat (dark brown, rich gold light). Each has its own wax texture (hg_wax0 to 3, drawn in code), wooden
floor in the hue (hgfloor0 to 3), light colour, door glow, captive honey, map colour, hive icon on the grassland map, and the book halo colour.

## The books
Were already on a glowing lectern (painted). Now: a bigger pulsing halo with rays in the hive's hue (six frames built at load from the painted lectern), the lectern 1.2x, lit by its own light
(not dimmed by distance), the boss chamber is clear of eggs, a message at first sight within 8 squares and line of sight ("A book glows on its lectern: The Primer of Ripples. This is the book Aldous wants."),
the same line when taken, and a gold star on the minimap and map (once seen, or while its book quest is open); villagers still to free get a green ring (once seen).

## Weak spots
- The captives are the painted villagers with a coat laid over them in code (honey, silk, wax): fine at a glance, but not new painted art. Real paintings by Gemini would be better.
- The book itself is still the small open book on the lectern (plus the small closed icon at its foot as the pick-up); a new large painted book was not made.
- The halo is a soft glow inside the sprite, not a true light on the walls; at 7 squares it reads clearly in a straight corridor, around corners it does not.
- The grassland map icons and the plain map keep one parchment colour; only the hive icons are tinted. The Queen's local map plan (maps_queenshive.js) was not re-tinted.
- Guards at the captives were not added: the hive's own creatures roam among them.
- Hue differences are clear but subdued, because the hives are dark and the game's mist greys them.
