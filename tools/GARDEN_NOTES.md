# The Maze of Gardens (level 490): notes for the next session

Jump: `?town=gardens&lvl=80` (a level 80 party at the gate; also in the Go to area list). Level id 490 (rooms 491 to 495 are free, unused). Rated 80. Never commit the version bump from here; the main session does that.

## Files (all new, prefix gm / GM / gmg / mpGm / gms)
- `src/desert/garden_gen.js` the maze, pure code (runs in node: `node tools/gm_test.js`). 45 by 45 lattice = 91 by 91 squares, 19 rooms cut out as blocks, three hedge banks (rows 16, 24, 33) with one gap each at alternate ends so the way winds from the south gate to the north gate (about 760 steps), the far court is joined last at the end of the longest walk. `gmgPick()` takes the first seed whose walk is 700 to 1000 steps (seed 2 today). Change `GMG.ROOMS` for the rooms (node units).
- `src/desert/garden_art.js` loads the pictures (`gmLoad`, when the garden is first needed: goToLevel, jumpToLevel and restore are wrapped to wait for it), alias table `GMA` (name -> picture, height), `GM_FW` (hedges with flowers pressed in, made in code from painted swatches and flower sprites), `gmTile` (stands a swatch up into a wall tile), `gmWeeds` (flowers in the cracks of the paving), the creatures (ENEMY_DEF gmknight, gmhound, gmgargoyle, gmlion, gmbriar, gmtrap, gmwarden), the wkMet('garden') call when the party leaves for Wenlock.
- `src/desert/garden_maze.js` the builder (`gmBuild`, KH_LAZY[490]): hedge precincts, room by room dressing, corridors (dead end pieces, tufts, lamps, plaques, trellises), checks (every open square reachable; blockers that cut anything off are removed), the two gates, creatures wake when the party is within 3 squares (warning at 5), wandering peacocks, ducks, rabbits, bees and butterflies, chest loot (lootFor), Go to area entry. Sets `WK.GSTART={x:45,y:87,f:0}` and `WK.GBACK={x:45,y:3,f:2}`.
- `src/desert/maps_garden.js` the illuminated map (hedges in their real mean colour, painted pieces as small icons, numbered room list, key, compass, the gates).
- `src/desert/garden_sound.js` synthesized birdsong, peacock, bees, trickling water near fountains.
- `src/desert/garden_list.js` is written by `python tools/gm_list.py` after every ingest.
- Core edits in index.html (single entries): `LEVEL===490||` in `desertLv` and in `dsl` (real sky and the day cycle), `gardens:[490,45,87,0]` in AREAS, `||town==='gardens'` in the level 80 cap of jumpFromUrl. ORDER in tools/inject.py ends with the garden files.

## Pictures (assets/gm, 124 files, listed in manifest.json and garden_list.js; packed automatically by tools/pack_itch.py)
Gemini sheets (14 used): hedge swatches A (boxwood, yew, holly, privet, laurel, copper beech, hawthorn, ivy on stone, hedgerow) and B (red and pink roses, jasmine, wisteria, honeysuckle, lavender, hydrangea, clematis, nasturtium), ground (brick, gravel, flagstone, lawn, cobble, petals), props 1 (benches, fountain, birdbath, sundial, urn, rose arbour, trellis, lamp, well, skep, table), props 2 (roses, beds, delphiniums, hydrangea, lily tub, herbs, cabbages, sunflowers, pumpkins), topiary (12), stone (statues, ruin pieces, lion, gargoyle), animals (peacocks, duck, rabbit, hedgehog, robin, frog, cat, butterfly, bee, swan), trees (8), buildings (gazebo, wisteria pergola, folly, hedge theatre, bower seat, moon gate, vine pergola, steps), gates (lych-gate with WENLOCK, iron gate, hedge arch, signpost), guardians (knight, hound, gargoyle, lion, briar beast, snapjaw plant), the Hedge Warden, wildflower tufts in cracked paving (12).
The source sheets are in `tools/gm_sheets/`. Cut with `python tools/ingest_gm.py <sheet.jpg> <name> <sprite|tex> order=rows matte=1` (sprites; `matte=1` un-mixes the magenta edge, no purple fringe) or `tex cols=3 rows=3 margin=0.085 seam=x` (swatches), then `python tools/gm_list.py`. Cells with a drawn frame or labels need the frame painted magenta first (see how trees_clean.jpg and bldg_clean.jpg were made).
Sprite numbering follows the manifest order (not always reading order): see `GMA` in garden_art.js for what each file is.

## Tests
`node tools/gm_test.js` (maze). In the browser: `goToLevel(490,{x:45,y:87,f:0})`. Checked: builds, walk 768 steps start to far gate over the real blockers, every open square reachable, chests reachable, the gate calls wkMet('garden') and arrives in Wenlock, WK.GBACK brings the party back, the creatures warn and wake, killed creatures stay dead in the same visit (the game's own rule brings some back on a later visit), save and Continue inside the level, the map draws, no console errors.

## Weak, and to add when art allows
- Hedge wall textures are 256 pixel swatches stretched to 128 wide; close up they are soft. Wisteria, clematis and honeysuckle swatches have a cream backing.
- The hidden bower door is a wisteria arch at a dead end (not truly hidden). Only a few notes and plaques; most are wall signs made by the game's sign painter.
- Creature pictures are single poses (no attack variants). The Warden is one picture 3 squares high.
- Lamps give light only through `lights` (night); there is no lantern flicker.
- More pictures that would help: more flowering hedge swatches with arches, a ground sheet with petals on brick, a hedge arch for the walls of the rooms, a few more statue poses, a stone bridge.
