# Critic: Blighted Road places 1 to 4 (Toll House, Ashenfold Farm, Church of the Hollow Saint, Gallowmere)

Method: headless Chrome, one browser at a time, `tools/polish/b14_shoot.py` (outdoor positions, list in a JSON file: name, level, x, y, facing 0 N / 1 E / 2 S / 3 W) and `tools/polish/b14_rooms.py` (four views in each room), contact sheets with `tools/polish/b14_sheet.py`. Quality bar: Wenlock (`?town=wenlock`, level 496, shots at 50,50 / 50,60 / 30,50 / 70,40): painted sky, a dozen different house fronts, dense stalls and props, signs, warm lit windows. Bar for the Road: "Wenlock, but gothic and blighted".
Positions are written level@x,y,f. "Before" screenshots were taken at the start of the session (commit 68ac32c8); "fixed" means done in this round (see blight1to4_NOTES.md).

## Faults that every place shared (ranked)

1. **A white picket wall on the horizon** (9610@65,32,3; 9620@73,35,3; 9630@73,35,3; 9640@84,38,3; also 9610@13,22,0). Every first view of every place showed a bright grey band cut into pickets by tree trunks across the whole horizon. Cause: the wall ray in `index.html` stops after 64 grid steps (`guard++<64`), the places are 72 to 90 wide, so the far boundary wall was never drawn and the pale sky showed through. FIXED (core edit, see notes).
2. **Wenlock-cheerful house fronts and roofs**: bright red brick (9620@46,31,0), cream timber (9640@42,40,2 and 31,37,0), flint (9610@44,29,0), thatch and slate roofs in saturated gold and tan (9610@65,32,3; 9620@73,35,3; 9640 all). They read as a holiday village in grey fog. FIXED (dark wall styles, dimmed roofs, darker barn picture).
3. **Empty yards and verges**: the toll yard, the farmyard and the village green were smooth slabs with six props each (9610@36,32,1; 9620@58,30,0; 9640@44,38,3). No carts, no crates, no stocks, no gallows cages, no banners. FIXED (props, see notes).
4. **Bright Wenlock garden pieces left standing**: a pink and green flower barrow in the toll yard and farmyard (9610@36,32,1; 9620@46,36,0), pink pampas reeds in the fen (9640@66,19,0), pale crate and sack pictures. FIXED (dead copies).
5. **Flat lawn ground**: one green texture with orange leaf confetti over fields and churchyards, no bare earth, no mud. FIXED in part (patches of earth and mud; furrows in the farm fields). Still repeats over large stretches.
6. **Bone heaps a metre across**: `gy_bones` at scale .6 to .8 sat in rooms and on the road as a huge skull pile (9621@7,9,0 cellar, 9611 room, 9631 nave corner). FIXED (scale .3).
7. **Plain, warm, tidy interiors**: toll house, kitchen, Osk and Nan houses looked like a cosy Wenlock cottage (no webs, no cold light, nothing dead in the corners). Barn, cellar, belfry and vestry were nearly empty (9623@6,8,0; 9622@5,5,0; 9633@6,8,0; 9634@5,7,0). FIXED in part (webs, bone bits, candle stands, one cold light in every room, furniture in the four empty rooms).
8. **Sky**: flat grey fog dome, no moon or break in the cloud, nothing to give the sky character. NOT FIXED (needs a painted sky panel, Gemini).
9. **Lit windows are only light squares on the ground**; house fronts have no glowing window picture. NOT FIXED (needs painted wall tiles with a lit window).
10. **No wind-driven or ambient life on the ground** (leaves, drifting fog, birds on the roofs). The crow posts are the only life. NOT FIXED.

## Place 1: the Toll House (9610) ranked

1. White far wall (shared 1). Fixed.
2. Toll house front: pale flint, huge flat wall, yellow-tan tile roof (9610@44,29,0 and 44,33,0). Fixed (dark flint, dimmed roof, two lamps at the door).
3. Toll yard empty: no toll bar furniture, no stocks, no cart (9610@52,32,3; 36,32,1). Fixed: stocks, two wrecked carts, grain cart, barrels, crates, sacks, torn banners at the yard gates, caged bones at the bar.
4. Pink flower barrow (kh_ohgard) in the yard. Fixed.
5. Road verges repeat: hedge row, lamp, hedge row for 60 squares (9610@58,32,3). Fixed in part: carts and crates at the verges, bones on the road.
6. Fields north and south are scattered twigs on a lawn (9610@40,48,0). Not fixed (this is the plainest area left).
7. Roadmender hut and lean-to are the same small hut picture twice (9610@13,22,0; 26,32,2). Not fixed.
8. Toll house room: bright and tidy (9611). Fixed in part (webs, bone bits, candle stand, cold light).
9. Nun: well placed and sized (9610@20,45,0). OK.
10. Crows: crow tree good (9610@58,18,0). OK.

## Place 2: Ashenfold Farm (9620) ranked

1. White far wall (shared 1). Fixed.
2. Farmhouse: bright red brick, a ten-wide wall with eight identical windows, tiny door (9620@46,31,0). Fixed (dark brick, dark roof, lamps); the long identical wall remains.
3. Barn picture saturated gold (9620@58,30,0). Fixed (darkened copy).
4. Farmyard mud slab with no props (9620@58,30,0; 52,35,3). Fixed: grain cart, cart, sacks, barrels, crates, pots, washing line, bones, lamps.
5. Fields: a lawn with a few tufts, no rows (9620@20,36,0; 18,28,3). Fixed: ploughed furrows of mud, ridges of stalks. Still plain at long range.
6. Orchard: eight identical dead trees (9620@50,45,2). Not fixed.
7. Pig sty is a fence piece with a talk (9620@62,27,0). Not fixed.
8. Pink flower barrow. Fixed.
9. Scarecrow poles spaced evenly, none near the road (9620@18,16,0). Not fixed.
10. Barn interior: empty floor, one man (9623). Fixed in part (hay, a cart, hearth, crates, barrel).

## Place 3: Church of the Hollow Saint (9630) ranked

1. White far wall. Fixed.
2. Churchyard grass is one flat lawn (9630@32,24,3; 45,28,1). Fixed in part (earth and mud patches).
3. Pilgrims' road bare south of the churchyard: no carts, banners, crates (9630@30,35,3; 73,35,3). Fixed (carts, sacks, barrels, banners, cages with bones, crates).
4. Plague pit is a ring of mounds (9630@54,41,2 from the south side). Fixed in part (bone heaps, tipped cart).
5. The four upside-down bells read as brown trumpets (9630@37,31,0). Not fixed (needs a painted bell).
6. Railings plain: nothing hung on them (9630@52,22,0). Fixed (bone charms).
7. Nave: the checkerboard floor is very bright and busy next to the dim rest (9631). Not fixed (deliberate; a duller floor would help).
8. Belfry and vestry nearly empty (9633, 9634). Fixed (shelves, candle racks, hay, crates).
9. Church picture itself: good, stained glass and door read well (9630@37,25,0). OK.
10. Lych-gate sign boards good (9630@37,38,0). OK.

## Place 4: Gallowmere (9640) ranked

1. **The water drew as mud.** The engine has six floor slots (0 to 5); the builder used char 6 for water, which drew as slot 5, the mud colour, so the whole mere was dark brown bare earth with reeds standing on it (9640@55,40,2; 56,38,3). Fixed: land is slot 0 (wet mud), water is slot 5, a new cold grey-green water floor with long ripples (`b14Mere`). Rookery (place 9) has the same fault, left for its critic: it uses `lv.floorSet[6]` and fm '6'.
2. White far wall. Fixed.
3. Cream timber stilt houses, very bright against the fog (9640@42,40,2; 31,37,0). Fixed (dark timber, dark roofs). They are still plain boxes, not houses on stilts.
4. Pink pampas reeds, huge when close (9640@66,19,0). Fixed (dead copy).
5. Village green sparse: gallows tree, well and a few lamps (9640@44,38,3). Fixed: cages, nets, pots, crates, a cart, torn banners.
6. Causeway: five lamps and a plank path, nothing else for 25 squares (9640@70,38,3). Fixed in part (nets, pots, crates beside it). The path itself still looks like a grey carpet.
7. Jetty: chest, boat and a few posts (9640@47,48,1). Fixed in part (nets, pots, crates).
8. Wisps: pale green ghosts, good (9640@70,38,3). OK.
9. Reeve's flooded hall interior: very good, water floor, chandelier, banners (9642). OK.
10. East and west banks bare (9640@78,40,0; 10,38,3). Fixed in part (carts, barrels, sacks, bones).

## Types of error that keep these places from a AAA gothic crawler (for all critics)

- The far horizon: any open place wider than 64 cells needs the ray limit raised or a wall inside it.
- Floor slot numbers: only six per level (chars 0 to 5). Char 6 silently draws slot 5.
- Warm party light turns every unlit blue and green brown: any cold material (water, ghosts) needs a brighter, bluer base than looks right on a swatch.
- Bright Wenlock pictures (flower barrows, pampas, crates, painted roofs) next to filtered grey ones.
- Props at the wrong scale: a picture without an `NPC_H` entry is drawn at the engine default (a barrow of bones was a metre across).
- Big plain walls: ten-wide fronts with the same window every square.
