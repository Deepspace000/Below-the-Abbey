# South zone (precincts 13 to 24, atrium, gate): polish round 2

File: `src/desert/hgd_polish_b.js` (round 1 notes: `b_NOTES.md`). Tools: `s_audit.js` (run with `s_probe.py`), `s_snap.py` (screenshots), `s_dump.js`, `s_plan*.js`. Test port 8341.

## How scale is read (engine)
A picture's height in squares is `NPC_H[k] * decor.sc`; width follows the picture's own aspect. A villager is 0.9. The walls of this maze are `ceilH` 2.7 high, so a hall is three villagers tall (the brief's "wall about 1.0" does not apply here). Everything is sized against the villager.

## Scale table (applied by script to all zone decor, `hgpbPolish2`)
villager 0.9 to 0.98, pickpocket 0.8, door/plaque gate 1.5 (the gate to the Maze of Gardens is the tallest thing near it), statues 1.4 (shell) and at most 1.35 (art_hgxstat), plinths 0.65, lamps 1.3 (1.5 beside the plaque), shop signs 0.6, notice boards 0.75, bookcases 1.2, houses 1.9, chests at most 0.5, table 0.5, chair 0.55, bench 0.5, trees by size class 1.5 / 1.9 / 2.3 / 2.6, spiral fern 0.75 to 0.95, bulb flower 1.0 to 1.2, shell flower 1.1 to 1.3, petal clouds at most 0.9 high and 1.2 wide.

## Fixed (critic list)
1 statues, plinths, lamps rescaled. 2 shop signs 0.6. 3 bookcases 1.2 (the wizard's own awning is part of his painting and was left). 4 houses 1.9. 5 signposts are now the painted signpost with the precinct and two directions lettered on the board (made at run time), notes keep the paper. 6 Blue Quarter and Mosaic Halls lit (see below). 7 lamp at quest giver 75,25 removed, horsefly moved away from the hermit (all creatures within 4.6 squares of a named person are moved at least 6 away; tall props beside any person are removed). 8 long climbs: 21 waysides (bench and cage lantern, pack, statue and candelabrum, brazier, cart, bell, crate and cask) with a pace stone each. 9 every dead end gets a prop on the corridor axis, a lantern, a light and its own line of text. 10 vignettes rebuilt with distinct props (windlass and bucket, brazier, ladder, scale, tools, ore cart, shrine, antlers and shields on the wall instead of the odd banner). 11 ferns, flowers, gate rescaled. 12 notes that mention hedges, honeycomb or trees are replaced by lines for the biome where they stand; 24 new lines, no line repeats in the zone. 14 petal clouds capped. 13 (404 icons) left to the other agent.

## Bug found and fixed
The game copies only a fixed list of fields from level decor to `G.decor`. `pbt` (the text of notes and signposts), `note`, `zone`, `lift` and a picture height of 0 were dropped, so in real play every note and signpost said the worn-away line and warning signs had no place name. Round 1 tested by passing level decor to `startTalk`. `hgpbCopyDecor` now copies them back when the level is set up.

## Lighting
`hgpbLights` runs at level set-up (some wall pieces open after the build, so it must see the final maze). Greedy path-distance coverage: no open cell is farther than 8 (sandstone), 6 (blue, mosaic) or 7 (gilded) squares from a light. 641 lights in the zone, each with a colour (amber, cold blue, lilac, gold) and strength 1.5 to 2.3, through `L.col` / `kI` on the live light. Hung lantern pictures show many of the sources. Props that must be read (statues, signs, chests, people, notes) carry a small `lift` so they are never black.

## Audit (s_audit.js)
Before (round 1, estimated from its proportion table): lamps out of scheme 48, shell statues 14, plinths 13, signs 28, houses 2, bookcases 2, trees over 2.7 about 166, plants 82, people 8, chests 17, lights in zone 86, notes/signposts with live text 0 of 103.
After: all of those 0, cells far from a light 0 (was about 940), duplicate texts 0, hedge or honeycomb texts 0, creatures near people 0, tall props near people 0, identical clusters 0, rows of three 0, long runs with a gap over 16 squares 0, empty dead ends 1 of 123, patch time about 340 ms plus lighting at load.

## Still weak
No new painted art was made: waysides and vignettes borrow the Well Maze (purple) pictures, which clash a little with the pastel Mosaic Halls. Wall lanterns are one picture per biome pair. Walls are still the old textures. The hung lanterns are not animated. Creatures were not rescaled.
