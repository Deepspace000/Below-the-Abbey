# Deeper Hollow polish B: notes

Zone: surface maze (level 475), precincts 13 to 24 (biomes 4 to 7), the great atrium, the gate plaque, the signposts and long ways. File: `src/desert/hgd_polish_b.js` (last in `tools/inject.py` ORDER). It wraps `hgdBuild` last and patches the built level only; `?hgpb=0` switches the patch off for before/after comparison. Test server port 8361. Tools: `b_audit.js`, `b_probe.py`, `b_shots.py` (screenshots of vignettes, signposts, lamps, atrium, towns, clearings, rooms, dialogs). Counts and the PROPORTIONS table are in `b_audit.md`.

## What changed
- Proportions: one scale (villager 0.9). Fixed hg_npc2 (no height, drew 1.7), petal clouds (1.3 max width), plinths and shell statues in niches, warning signs, chests (about knee height). Every picture keeps its own aspect ratio.
- Clutter: 117 cosmetic pieces scaled, about 125 identical or stacked pieces and 28 repeated wall pictures removed (never people, items, quest objects, chests with keys). No more than 3 of a kind within 4 squares (props 2, marsh reeds 7).
- Twelve vignettes, one per precinct, each with props, a light and a note: The Keeper's Cache (chest, owl statue), The Cold Camp, The Dry Well, The Last Lamplighter, The Waiting Bench, The Scribe's Corner, The Tile Counter, The Barricade, The Mortar Mistake, The Trophy Wall (banner, antlers), The Gilder's Hoard (coin trail to a chest), The Little Shrine.
- 26 true signposts at T junctions (precinct name, then the nearest named place through each way and its distance in paces, computed by flood fill), 11 lamps (one at the end of the longest straight way of each precinct, two flanking the gate plaque), small touches and scratched lines in empty dead ends.
- Old bug fixed: the scratched notes and warning signs read `G.talk.d` before startTalk set it, so every note showed note 0 and signs had no place name.
- The atrium plaque tells the truth before and after the Black Swill (the gate to the Maze of Gardens).

## What remains
- No new painted pictures were made (everything reuses existing painted art); a hand-painted lamplighter's ladder, a bedroll, a barricade and a trophy banner would raise the vignettes further.
- Light colours: the engine takes only positions for L.lights, so the vignette lights are the standard warm light.
- Long climbs: no shortcuts or ladders added (not verified safe for saves).
- Creatures stay as they are (jelly 1.64 tall and wasps 1.32 are taller than a villager by design).
- Notes still pass through the Hollow word lexicon (hgdSay), so some nouns read as Hollow words until learned; signposts are plain.
