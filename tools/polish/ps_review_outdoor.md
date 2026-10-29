# Pale Spire outdoors: independent art direction and level design review

Branch review-outdoor (from pale-redesign), no src or asset file edited. About 190 screenshots taken at 790 x 392 (Approach 54, Court 70, small rooms 8 to 10 each). Key frames: `tools/polish/review_outdoor/` (37 jpg, names carry level and x_y). Scripts: `tools/polish/ro_*.py`. Target: `tools/ref_spire/ref15_owner_castle_target.jpg`.

## The three owner questions, short answers
1. AAA dungeon crawler? In the interiors and the Court lanes, nearly: the painted props (statues, alcoves, iron gates, fountain, roses, gargoyles) are genuinely good and the fog and colour grade hold together. The Approach does not get there: it is a fence corridor, and its two promised wow moments (the castle view and the Great Gate) do not land.
2. Gothic, beautiful and threatening at once? Gothic and beautiful: yes in the Court and the Gatehouse. Threatening: only through the creature list, not through the picture. There is no looming vertical mass anywhere (nothing like ref15's towers, spires and clock arch seen up the canyon).
3. Balanced? No. See the defect list: the entry to the Court sits between two mini bosses, every foe is "Deadly" or "Hard" with no ramp, over half of all Pale Spire gear is in these seven levels, and 9731 and 9732 are big open rooms that break the owner's own rule.

## Scores (1 to 10)

| Level | AAA look | Gothic beauty | Threat | Balance |
|---|---|---|---|---|
| 9720 Pale Approach | 5 | 6 | 5 | 4 |
| 9721 Great Gatehouse | 7 | 6 | 6 | 5 |
| 9722 Winch Loft | 7 | 6 | 6 | 6 |
| 9723 Porter's Lodge | 8 | 6 | 2 (deliberate, rest room) | 7 |
| 9730 Court of Statues | 7 | 7 | 6 | 5 |
| 9731 Gardener's Lodge | 5 | 4 | 1 | 5 |
| 9732 Mews and Stable | 6 | 5 | 4 | 5 |

**9720 Approach.** The kit pieces are painted and lovely close up (skull-topped iron fences, white roses, alcoves with weeping and hooded saints, gargoyles, red lanterns, mossy stairs), but the level is five near-identical 2-wide legs (y 51, 44, 37, 30, 23) each with the same fence, rose, vine, lantern and buttress rhythm, and from most lanes you look at a fence or a blank wall (first sight from the Sale gate, A01, is a fence and a hedge). The painted castle exists (castle_view.webp is superb) but in the sky buffer it is about 90 px of 1024 wide, sits at the bottom of the strip and is hidden by 4.4 high walls: in 54 screenshots I never saw it (A00). The "near" castle is the gate-arch picture, which is fine, but it too only shows as a sliver. The Long Bridge reads as a black slab (A02). The Great Gate is a flat brown plank rectangle with a clipped sign (A03). Very dark in many spots (A12). Threat is only the 19 guards.

**9721 Gatehouse.** Convincing: cobwebbed gate under a raised portcullis, guardrooms, caged skeleton, spider, murder holes. The wall tint swings violet, red and brown from room to room and some walls are flat brick with no detail. Good threat pacing with the Captain in a 3-wide passage.

**9722 Winch Loft.** Strong little set (spinning wheel, chains, red lantern, webs, the Murder Holes sign). Twisted pillars and slit windows give the vertical feel. Only four foes: fine.

**9723 Porter's Lodge.** Best room in the set: warm, timber, red runner, candles, a human NPC with a quest mark. Intentionally off the cold palette because it is a rest room.

**9730 Court.** The real success: tall brick and timber canyon lanes, hanging ivy, banners, arches, a fountain square, stone doors, statues in alcoves, a Judge standing in the lane. It reads as a schnoor. Weak points: the clock tower, the stated centrepiece, is invisible (no dial or tower seen from the fountain, C05, and no skyline because walls hide the sky), ivy blobs and vine sprites are blurry blown-up leaves at close range (C06), the rose garden lawn is a saturated bright green that breaks the palette (C09), several lanes are near black (C13), and there is a flat brown slab door or panel stand-in look (C11).

**9731 Gardener's Lodge.** A 14 x 10 open room of scattered furniture, brown plank walls and a giant spider on an urn. It does not match the rest of the castle and violates the "no open room bigger than 6 x 6" rule (largest open rectangle 10 x 5 = 50 cells).

**9732 Mews.** A 18 x 13 stable yard of mostly empty cobbles (largest open rectangle 14 x 3 plus a big hall), good ravens and iron gate art, but a plain thick stone wall block, sparse props, little to look at.

## Ranked defect list

Severity 1 (worst) to n. Coordinates are x,y (column,row). Screenshot names are in `tools/polish/review_outdoor/`.

1. **9720, whole level: the castle view is not seen (owner's headline request).** Castle drawn about 90 px wide in a 1024 px sky strip, mostly below the wall line, behind 4.4 high walls and hedges; never visible from any leg. Walls over 4 high hide the sky on every leg except over the bridge, and there it is a sliver. `A00_sky_buffer_castle_tiny_4_positions.jpg`, `A01`, `A11`.
2. **9730 entry, balance: two mini bosses flank the arrival.** Court start (32,49). The Thorn Warden loops from (28,43) and Ossian from (36,44), distances about 7.2 and 6.4; guards at (31,43) and (31,45), Hedger at (28,50) and (48,50), thorn sprites at (24,43),(26,47). The waystone is 24 squares away at (8,44). The player arrives in the middle of two level 102 bosses and 5 level 101 foes, 8 to 10 rounds each ("Deadly").
3. **All levels, balance: no difficulty ramp.** Every foe is level 99 to 102 against a level 100 party; guards show "Hard", halberdiers and statue creatures show "Deadly" (3300 to 3900 hp vs the party's 4638). 19 foes on the Approach, 11 in the Gatehouse, 44 plus 5 bosses in the Court, with no rest, waystone or retreat between the Sale gate and the Lodge except back to Sale. The Barbican forecourt stacks 4 archers (26,10),(38,10),(26,13),(38,13), 2 halberdiers and a guard around the Great Gate with no cover.
3b. **Gear front-loading.** 14 of the 26 `pg_*` pieces (all lvl 100, 31 to 40 percent above the best elsewhere) are in these seven levels: 9720 two, 9721 two, 9722 two, 9723 two, 9730 two (plus 9731 two, 9732 two via Court bosses and quests). Chests sit in the alcoves (gy_chest at (42,50),(50,35),(23,28),(41,45),(22,28),(25,12)) and the Approach has no gear until the riddle chest. Every other loot item outdoors is the same: `greatermana` ×4 to 5 per level, plus herbs. Reward variety is nil.
4. **9731 and 9732: big open floors.** 9731: 14 x 10 room, open rectangle 10 x 5 at (3,7)-(12,11). 9732: 18 x 13 yard with open rectangles 14 x 3 at (3,3)-(16,5) and wide empty cobbles. Violates the redesign brief. `L01`, `M02`. 9731 palette (brown plank, copper) does not match, and its ps_web_spider on the urn at about 2 times vase height is out of scale.
5. **9730 clock tower is not a landmark.** Passage x32, y20 to 26 is a 1-wide tunnel; from the square (30,28),(31,27) the tower front is a bare moss-green wall (dial and belfry not visible), and no tower stands against the sky. The bell appears only at the end of the passage (`C04`, `C05`). Compare ref15's clock gate with banners.
6. **9720 Long Bridge (32,16 to 21) reads as a black slab.** Deck is dark, rails (ps_bridge_rail) are too small to read, the ravine on both sides is flat dark with no depth; no sense of a drop. `A02`.
7. **9720 Great Gate (32,8).** Flat brown vertical plank rectangle with a pale stripe (code-drawn door) at the end of the whole route; the painted gate_clock arch is shown as a small ps_gate_clock sprite at scale 0.6 near the door, wrong scale for the finale. The sign "THE GREAT GATE" at (31,7) is cut by the screen edge when you arrive (`A03`). The web curtain at (32,9) fills the view from (32,10) in black (`A04`).
8. **9720 repeated legs.** y 51, 44, 37, 30, 23 use the same fence (76 + 74 pieces), 59 rose bushes, 18 buttress_b and 5 buttress_a at regular steps (x 10, 14, 24 / 10, 18, 26, 36, 42, 48 / 14, 22, 30, 50 / 14, 20, 26, 32, 44), 48 lanterns. Fence-wall view dominates (`A01`, `A10`). The buttress pieces are still stand-ins (`ps_buttress_a/b` listed as stand-ins by my in-page check).
9. **Ivy blob walls everywhere.** The painted ivy wall texture is stretched to huge blurry green blobs (`A06`, `A15`, Court lanes `C02`, `C06`), reads as a camouflage filter, not ivy, and repeats on every lane of 9720 and 9730.
10. **Close-range vine sprites.** vine_a/b hang in the lane and, near the player, become giant blurred leaves that fill the screen (`C06`). 115 such pieces in 9730.
11. **9730 missing painted names.** `urn_big`, `well_pale`, `cart_old`, `bell_frame` (without `ps_` prefix) are not loaded: they are used at (32,47),(43,29) urns; wells (5,22),(20,29); carts (59,17),(44,30); bell_frame (59,28). The Court also has `teleporter` with no image at (8,44) area (the waystone). Check that those spots are not empty or showing a placeholder.
12. **9720 and Court, flat unreadable wall patches.** Blue-framed white window on an otherwise bare wall, with a dark rectangle next to it (`A07` at 22,25 f1; `A08` at 51,38). Looks like a stand-in glass pane. The 7 `sign_gy` signs show with no loaded image of their own (they draw as parchment boards: fine) but the Court's stone plaque signs ("THE COURT / OF STATUES", "THE MEWS / AND STABLE", "THE GREAT DOOR") use a rough stone block with widely spaced text (`C01`).
13. **Giant chests.** gy_chest sc 1.1 and 0.95 standing in alcoves hides the statue (42,50: `A05`), and in the Court a chest beside a dog statue is as big as the dog. Scale is about 1.5 times what a chest should be.
14. **Too dark or unreadable.** `A12` (33,7 f2), `A04`, `C13` (58,11 f2), several Court lanes. Ambient 0.82 to 0.86 plus heavy mist, no light pools in these spots.
15. **Palette breaks.** Bright saturated green lawn and hedges with cream flowers in the Court rose garden at (24,46) and the Waystone Nook (`C09`, `C08`); violet, red and brown walls in the Gatehouse (`G02`); the warm Lodge is justified. Orange banner pairs and red lanterns are consistent accents (keep).
16. **Mews and Gardener's sparse props.** 9732 has a plain stone wall block through the room near (1,11)-(1,13) and mostly empty floor (`M02`). 9731 has no sky or window view.
17. **Statues in the lane centre.** Court (31,43),(31,45): guards stand on the centre line of the entry lane; thorn sprites etc. add noise. Not wrong, but part of defect 2.
18. **UI.** The top-bar T button and Menu overlap nothing. The enemy info panel (top-left, 280 px) covers the left quarter of the view whenever a foe is within 4 tiles (`A14`, `G01`), which hides content in these narrow lanes; not a bug but heavy.
19. **Cut-off pockets.** `ps_test.py reach` passes for all seven levels (0 cut off), and my own flood fill (walkable = open, not blocked by decor or terrain) reached every open cell on all seven maps. 9720 has about 14 dead ends (e.g. (23,27),(26,11),(29,53),(30,15),(34,15),(35,51),(36,52),(40,48),(40,50),(44,50),(47,35)); most hold a prop, not a reward.

## Route flow Sale gate to Great Door
Start (32,52), leg 1 west along y 51 to x 6, stairs north at x 6 to leg 2 (y 44) east to x 51, north to leg 3 (y 37) west to x 12, north to leg 4 (y 30) east to x 47, north to leg 5 (y 23) west to x 32, Long Bridge north to the forecourt (32,13) and Great Gate (32,8). It is a pure zigzag of about 250 squares with the destination off-screen north for most of it; there is no landmark that changes between legs (the only beats are the gully bridge, three hidden nooks and the cairn), pacing is flat, the pay-off at the Great Gate is weak (defect 7), and the foes are evenly spread so there is no quiet beat. The Court is better: lanes with views ending in a statue, door or bell, loops and a hub. Its Great Door at (32,12) is reached through the clock passage; the waystone and rest doors are all at the south edge, the north half has the 5 bosses and no rest.

## What is genuinely good (keep)
- Painted props: skull-topped iron fences, white roses, saints in arched alcoves (weeper, monk, maiden, knight), gargoyles, hand statues, kneeling knights at the Waystone Nook, the fountain, the Horned Judge in the lane, the Hound-Lion, the wrought iron gate doors. `A09`, `A13`, `C03`, `C12`, `C14`.
- Court layout: canyon lanes, banners, arches, undercroft passage, schnoor feel, hub with the bell passage. `C02`, `C04`, `C10`.
- Interiors: the Gatehouse portcullis and cobwebs, Winch Loft wheel and chains, Porter's Lodge. `G01`, `W01`, `P01`.
- Moon, bats, teal overcast sky and the colour grade; red lanterns and orange banners as accents.
- Reachability: everything is walkable and connected.
- The unused painted castle_view.webp and gate_clock.webp are excellent and match ref15; they just need to be shown large (see below).

## Suggested fixes in priority order (not done, review only)
1. Show the castle: make it 3 to 4 times larger in the sky, lift it, lower wall height on the legs that face north or cut sky windows (a 2-high retaining wall with a fence on top at the leg ends), or add a one-off full-width billboard at (32,20) and at the bridge head.
2. Move Thorn Warden and Ossian loops and the entry guards out of 8 squares of (32,49); put a waystone or rest at the entry or the middle of the Approach; ramp foe levels (96 to 100 on the Approach, 98 to 102 inside).
3. Spread gear: move four or five pg pieces to the later levels or lower their level; add rare drops and real chests in the Approach dead ends.
4. Break the legs: vary the fence (alternate with wall, arcade, ruin), kill the ivy blob texture, add a ruined tower, a bridge to nowhere, a pilgrim camp, one lit window.
5. Redraw the Great Gate from the painted gate_clock at full size (5 cells tall) with banners; clock face on the Court tower from clock_face.webp; give the Court tower a south-face front.
6. Redo 9731 and 9732 with partitions (stall rows, hay lofts, stairs) and the Court palette.
