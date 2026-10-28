# Critic: Blighted Road places 5 to 8 (Bone Orchard, Lanternrest, Vault of Maldrake, Hollowbell Abbey)

Method: headless Chrome tour on port 8631 with `tools/polish/b58_tour.py` (set G.P and the facing, clear banners and talk, screenshot), about 90 shots at many squares and distances, Wenlock (level 496, `?town=wenlock&lvl=95`) as the bar. Contact sheets with `tools/polish/b58_sheet.py`. Shots are in `shots58/` (o = Orchard, l = Lanternrest, v = Vault, h = Hollowbell, r = rooms).

Overall: the four places are already close to Wenlock in building scale, roofs, doors and people. What stops them looking like a AAA gothic dungeon-crawler is mood and finish, not layout.

## Types of error that keep a place from looking AAA
1. A prop that is the wrong thing (a hand bell scaled up to stand in for a church bell).
2. Hard-lit white shapes in a dim scene (bleached trees, a pale band of palings at the horizon).
3. No pools of warm light in a cold scene (nothing lit but lamps), so no contrast and no lit windows.
4. One flat ground (a single green with straight roads), no trodden or bare earth.
5. No living detail (no crows on the ground, nothing perched).
6. Interiors that all share the same house beams and planks even when they are crypts or cellars.
7. Big flat faces (a blank grey wall with no banners, torches or rhythm).
8. Code-drawn pieces (the glowing locks, flat tinted pale figures) and over-bright emissive tiles.
9. A prop boxed in so it cannot be read (the bell inside three iron fences).
10. Over-saturated brick colour on a single dungeon floor.

## 5. Bone Orchard (9650), ranked
1. The Harvest Bell was a hand bell, scaled up, seen as a thin pillar behind a fence box (o12 at 44,31; b1 at 44,24). FIXED: the painted bronze church bell, weathered, and the three fences round it removed.
2. White tree rows blow out to pale palings at the horizon (o01 at 79,36; o03; g1 at 60,36). Bleached trees darkened (brightness 2.3 down to .98). A pale band of "palings" at the map horizon is still there (see Unresolved).
3. No warm light in the whole place, only pale lamps (o02, o12). FIXED: braziers in the Harvest Yard, at the lane ends and by the press shed, warm pools in front of the hall, shed and hut, candle light on the crypt path.
4. Flat ground (o05, o06, o07). FIXED: patches of dirt, gravel and mud on the grass.
5. No crows (all shots). FIXED: 23 ravens on the ground, in the orchards and crypt field.
6. Crypt of the Lost Patrol (9653) and Cider Cellar (9652) had plank floor and house beams (r o16, o15). FIXED: cobble floor, stone wall, tomb ceiling.
7. Skull-apple trees are still bleached trees with bones at their feet (o05, t1 at 20,12). REMAINS: needs a painted tree hung with skulls.
8. Houses are pale and unlit on the street side (o07 at 64,34). Light pools added; lit-window pictures would be better.
9. Brown strip across the bottom of the lane shot at 44,36 (o02): the dirt lane tile edge seen at speed; harmless.
10. Harvest Hall and hut interiors are the standard Wenlock rooms: acceptable, repeated planks.

## 6. Lanternrest (9660), ranked
1. The fort wall is one huge blank grey face, inside (l09 at 30,42) and outside (w4 at 20,50). PARTLY FIXED: banners on the south, east and west faces outside, braziers along the inner wall and at every wall stair. REMAINS: no battlements or buttresses (needs a painted wall piece).
2. Wall walk not walkable and nothing said it was closed. FIXED: a notice board at each wall stair says the walk is closed, braziers light the stairs.
3. Tents were black holes (l06 at 54,33). FIXED: lighter interior and a warm light inside every second tent.
4. Yard was an empty flagged field (l02, l04). FIXED: braziers, crates, barrels, sacks, rope, baskets, a net, a barrow in clusters by the hall, stable, stew and tents (each blocking prop checked so the yard stays walkable).
5. Heavy flat grey fog killed contrast (l02). Fog lowered by about a quarter.
6. No crows or life outside (l11). FIXED: ravens by the road.
7. Hall looks small in the big yard (l02 at 44,56). REMAINS (scale of the painted hall).
8. Sentries are only at the gate and stairs; no soldier drilling visible from the gate. REMAINS.
9. Inn, armoury, forge, hall, infirmary, beacon (r l13 to l18): warm and furnished, all the same plank floor and beams. Acceptable for a safe fort.
10. Scout hut, camp and Maw hollow outside the walls are plain; REMAINS.

## 7. Vault of Maldrake (9670 hill, 9671 to 9678), ranked
1. The glowing locks (code-drawn ovals in an ornate frame) sat under a blank, near-white brick block (k3, k4 at floors 3 and 4). FIXED: the block is dimmer (emissive tile .3 to .14, gain 1.5 to 1.1). The ovals are still code-drawn: REMAINS.
2. Floor 5 (texRed) was an over-saturated orange and pink wall (k5). FIXED: tinted down.
3. Floor 2 bone yellow is sickly and the first foe is 5 squares from the stair; floor 3 the same (f2a, f3a). REMAINS (spacing change would touch quests and traps).
4. The Maldrake sanctum and archive are strong (s1, s2: robed figure, candelabra, blue torches). The pale-blue ghost (s3) is a flat tinted figure. REMAINS.
5. Hill: good (gate, cobbles, camp, fog). The giant signpost is huge when you stand on it (h02). REMAINS.
6. Corridor variety: five different wall colours and torch colours, one per floor, good.

## 8. Hollowbell Abbey (9680), ranked
1. The silver plague bell was the same hand bell (belfry shot h19). FIXED: pale silver church bell.
2. The lych gate was pink and flat (h02). FIXED: greyed.
3. Cold, nothing warm; braziers at the gate and pools of light at the chapter house, lodge and tower. FIXED.
4. Plain green ground (h05 and h10). FIXED: dirt and gravel patches.
5. No crows. FIXED: 20 ravens on the graves and road.
6. Crypt of the Brothers had house beams. FIXED: tomb ceiling.
7. The "fallen" church is an intact church picture. REMAINS (needs a painted ruin).
8. A great dark tree trunk fills the view near the foundry (h12). REMAINS (dress tree placed too near the path).
9. Interiors share the same planks; the crypt is good (green flags).

## Unresolved
- A bright band of pale vertical "palings" at the far horizon in every place of the road (o01, o03, w6, h01). Ruled out by experiment: trees, willows, hedges, fences, grass tufts, the dark boundary tiles. Not a decor item. Probably an engine edge effect of the outdoor kit; whoever owns `blight_kit.js` should look at the sky and edge sprites.
- Pictures that need Gemini (Chrome was not connected): skull-apple tree, ruined church, battlemented wall piece, soldier's tent, painted lock plates, silver figures.
