# Audit of the fronts in the Wenlock Graveyard (level 530), 28 Oct

Screenshots: tools/gy_fronts/shots/before_<site>_d1|d3|d5.png (900 x 600, party at level 84, stormclouds). Pictures all load: no missing IMG key, no 404, no console error. The fronts are drawn, but read as blank.

| id | position | what is wrong | probable cause |
|---|---|---|---|
| plaza crypt (door to 531) | 34..36, 30 | near black slab, doors not readable at 1 or 3 squares | gatesC_4 is a dark grey mausoleum, drawn 3.4 high (door about 1.9 squares, three persons) and multiplied by the foot gradient, level light and fog; no emissive layer |
| tombs 536, 537, 538, 539, 540, 541 | N 22,2 and 48,2; S 22,67 and 48,67; W 2,20 and 2,50 | same murk, all six look alike (gatesC_4 for 536 537 538 541, stairFix_1 for 539, gatesC_3 for 540) | same, plus only a tint and a plate differ |
| avenue vaults | x 50 and 54, y 11..33 | a long dark wall of repeated gatesC_4 slices; stair door at 50,22 is a tiny dim arch | same; slices cycle (y+x)%3 so the fronts are cut in the wrong places |
| avenue north end | 51..53, 9 | plain dark stone front | same |
| mazes 532 to 535 | doors 58,6 / 58,63 / 12,63 / 12,6 | red gate nearly invisible, grey and black dim; pale (Pale Catacombs) is only a grassy mound with doors, no gate, weak against a bare dark tile | gyEntryPic composites at 3.0 to 3.4 high (arch 3 squares tall), no emissive; pale kind is a transparent canvas over a bare dark tile |
| lych-gate | 68, 33..37 | readable but dim | same pipeline |

Details of the pipeline (why it is dim): fronts are wall tiles (gyTile, 128 px wide slices of a canvas, 128 px per height unit) and wallSpan multiplies the picture by light, fog and a foot gradient; nothing is self lit (TEX[id].e is null; the engine adds e after lighting). Tile height 3.4 stretches a 299 x 279 piece to 358 px. South and west tomb fronts take slices in world order, so they are mirrored from the viewer's side (to be confirmed by a test with an asymmetric picture).

Not yet checked: world map and Atlas rows for the graveyard and mazes (maps_world_west.js, gy_maps.js), the area map icons of the six tombs (they have no marker decor, only wall colour), saves.
