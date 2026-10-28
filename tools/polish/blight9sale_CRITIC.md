# Critic: Rookery Mill, Pale Bridge, Sale, new Wenlock additions

Method: headless Chrome tours with `tools/polish/b9s_shots.py <spec.json> <outdir>` (spec files `b9s_*.json` list name, x, y, facing, optional level; `b9s_sheet.py` makes contact sheets, `b9s_hide.py` and `b9s_eval.py` take things away or ask the page questions). Facing: 0 north, 1 east, 2 south, 3 west. Claude in Chrome was NOT connected, so no new painted art could be made: every fix below is code and filters over pictures that already exist.
Bar: Wenlock (painted roofs, lit doors, dense yards, signs, furnished rooms) made gothic.

## Kinds of error that stop these places looking like a AAA gothic town
1. Stand-in art that reads as the wrong object (urn for a fountain, post for a gibbet, a cheerful donkey cart for a plague cart).
2. Pale or yellow things that were never blighted (thatch, limestone walls, bright windmill, white palings) next to dark ones.
3. Flat voids: a ravine and a millrace that are one flat colour with no depth, no mist, no edge.
4. Rooms that are copies of each other (three of four thief houses were the same four-cat room), and interiors lit like a bright day when the story says night.
5. Even, unlit darkness: no warm windows or doorway light against the cold fog, so nothing draws the eye.
6. Ghosts that are flat white blobs (flat fill over a painted person) instead of pale see-through people.
7. Mismatched wall material (cream Tudor plaster in a hermit's burrow, limestone inside a plague-watch tower).
8. Too few enterable houses; everything else is a sealed door.
9. Repetition: the same gy_web, bones and dead tree along every street, no wells, coffins, ravens, gravestones in the safe streets.

## SALE (jump `?town=sale&lvl=90`)
Ranked, with screenshot positions (x, y, facing):
1. Gibbet is a brown post stump (38,33 seen from 36,34,1). FIXED: the painted hanging cage with a skeleton, darkened.
2. Dead fountain is a green goblet on a pedestal (35,38 from 35,34,2). FIXED: the real stone fountain, mossed.
3. Plague cart is a donkey cart with a seated rider (32,40 from 35,40,2). FIXED: the covered cart, grey; two plague coffins beside it.
4. Ghost villagers are white blobs (square, 34,33,0). FIXED: drained of colour, cold blue light, glow, fade at the feet.
5. No warm light in any window; every street equally dark (45,36,1; 30,36,3). FIXED: candle light at 12 doors (most shops, a few cottages).
6. Only two enterable cottages. FIXED: four more with their own small rooms (Reeve's House, Midwife's Cottage, Watchman's Billet, Wool Merchant's House), dimmed, webs, bones, candle; ids 7229, 7233, 7238, 7239 (the existing level ids are unchanged).
7. Safe streets have no props beyond webs and bones. FIXED: a dead well, ravens, gravestones and candles in the quiet streets.
8. Dead quarter ground is one brown (20,47,2; 20,54,3). NOT FIXED (needs painted ground variants).
9. Barricade planks are a code-made texture (9,36,0). Acceptable, but a painted board would be better.
10. Houses are plain wall styles with few shutters or signs on the quiet lanes (53,45,2; 57,30,0). NOT FIXED.
11. Sale's quiet lanes have no fog banks or hanging lanterns across the street. NOT FIXED.
12. Shop interiors are Wenlock rooms, dimmed; they keep a warm timber look. NOT FIXED.

## THE ROOKERY MILL (jump `?town=blight9&lvl=90`)
1. A band of white paling-like strips along the whole far horizon from the east gate (77,35,3; 60,35,3). NOT FOUND. It is not a decor sprite, not the map edge and not the terrain height (all tested by taking each away); it is drawn at about the millrace distance. Open item for whoever owns the kit.
2. Windmill and watermill are clean pale stone (45,38,2; 40,30,0). FIXED: darkened and drained.
3. Miller's house thatch is bright orange-yellow (30,35,3). FIXED: dark dead thatch.
4. Iron race-crossing fences and the plague cart. Cart FIXED (it was the donkey cart). Fences darkened.
5. Millrace is a flat dark plane (25,45,2; 22,35,1). FIXED partly: mist banks along the race and dead reeds on both banks; real water floor kept.
6. Interiors are bright limestone, not blighted (4,7,1 in 9691 to 9693). FIXED: dark stone wall in all four rooms.
7. Map edge was a bright bank of leaves; FIXED to dark stone.
8. Ground is one flat green with orange leaf specks (45,20,0; 60,28,0). NOT FIXED.
9. Parliament Stones: seven rooks are good, but stones are bright green moss (60,28,0). Left.

## THE PALE BRIDGE AND GATE OF SALE (jump `?town=blight10&lvl=90`)
1. Ravine is a flat dark slab with a hard edge (50,30,2; 44,25,1). FIXED: near-black floor, mist lying in it, dead roots on the lip.
2. White strips along the ravine in the distance (30,38,1; 77,35,3): same open item as the Rookery.
3. Plague cart beside the bridge is the donkey cart (62,38). FIXED.
4. Huts at the camp (35,35,3; 44,35,3) have a bright straw roof. FIXED: dark thatch.
5. Towers and wall walk interiors are bright limestone (4,7,1 in 9701, 9702). FIXED: dark stone.
6. Gate towers had no light (8,31,0). FIXED: lit windows at both towers.
7. The bridge's gothic pillars and fence read well. The Pale Knight stands flat on the deck; no shadow. Left.
8. East bank and dead land have few graves besides the row at (18..36,44). Left.

## NEW WENLOCK ADDITIONS
1. Thief houses: three of four are one room with four cats (7043, 7054, 7025 from 5,5,0). FIXED: four different homes, each furnished for its owner (pew and tapestry; barrels and lute; spinning wheel and mannequin; clock and bookshelf), lit low because they only open at night.
2. Old Bracken's den maze was cream Tudor plaster (7,13,0 in 7098). FIXED: dark stone, a water barrel, kindling, candle rack and a cat in the dead ends, webs.
3. Market quest givers (44,47,2; 50,53,0; 46,50,1; 53,50,3): well spaced, marks visible, scale right. No change needed.
4. Three-seal gate (12,50,3; 5,50,3): fine. No change needed.
5. Cells (7097): a stone cell with a barred door; fine, a little empty. Left.
6. Watchmen are the existing folk sprite in a uniform; fine at distance.
