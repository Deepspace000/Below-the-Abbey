# Underlevel polish notes, round 2 (zone D, level 476)

Files: `src/desert/hgd_polish_d.js` (round 1 and round 2, switch `window.__NOHGPD2` turns round 2 off for comparison), test scripts `tools/polish/d2_*.py` (server port 8343: `python -m http.server 8343`).
`d2_audit.py before|after` (counts, scale table), `d2_vig.py tag "Dig,Wreck"` (set pieces), `d2_walk.py`, `d2_lad.py`, `d2_lamp.py` (beacon from 6 to 34 squares), `d2_func.py` (orb take, signs, minimap, snapshot).
The level layout moves a little from load to load (other builders use random numbers), so scripts read positions from `LEVELS[476]._hgpd.vig` instead of using fixed squares.

## How scale is read (the scheme)
The engine draws a prop `NPC_H[kind] * sc` squares high (a hero is 0.8, a villager 0.84) and as wide as the picture's aspect gives. `sc` is only a multiplier on the picture's own base height, so the same `sc` means different sizes for different pictures. Wall pictures (`pic` with `wd`) ignore `sc`; only `NPC_H` counts, so their sizes were set in `HGPD_ART`.
Round 2 sets heights in squares from one table (`TGT` in section 9) and derives `sc = target * jitter / NPC_H`. Jitter is plus or minus 5 to 20 percent per kind so neighbours differ a little. Boats are set by width.

| class | target height (squares) | note |
|---|---|---|
| villager, monk | 0.84 | unchanged |
| adult statues | 1.10 to 1.15 (about 1.4 villagers) | statue of the chapel monk 1.15, waiting woman 1.10 |
| child statue | 0.75 | was 1.25, taller than the monk |
| lighthouse lamp | 1.4 | landmark |
| dock posts, chain pillars | 0.85 | |
| shrine altars | 0.72 | |
| bell 0.6, ship wheel 0.54 (on a rock), orb cage 0.53 | | wheel was 0.9, taller than the monk |
| barrel 0.5, cart 0.5, tools 0.52, skeleton (seated) 0.5, crate 0.42, crate lid 0.42, chest 0.4, keg 0.38, bucket 0.32 | | chest was 0.48 |
| candle 0.15, lantern 0.24, book 0.23 | | candle was 0.26 |
| rocks, cairns, bones, rubble, roots 0.3 to 0.45 | | |
| beached boats 1.4 wide, wreck 1.4 wide, rowing boats at the docks 1.5 wide | | were 1.2, 1.38 and 1.81 |

## Defects of under_CRITIC.md
1 wheel: 0.9 to 0.54 high. 2 rune with no text: the landmark runes now carry one of eight lines, and a final pass gives any sign without a line one (audit: 0 blank signs of 23). 3 Dig: the "tooth" was a bull skull standing on a painted sand disc (art_dbones); it is gone from the level (the skull pile art_hgxprop0 and an antler art_hgxprop13 replace it, page 12 now says "a horn"). 4 statues and 5 boats and 6 chests and 7 candles: scale table. 8 palette: the violet wm props are grey-blue copies made at run time from the same painted pieces (`hgpdGrey`: violet hue to blue-grey, saturation x0.42; glowing runes and shrine crystals to teal, the lighthouse crystal to amber). 120 violet props to 0. 9 beacon: see lighting. 10 ladder kits: they stood on the foot square beside the player, and a side with no wall dropped the prop; now they stand one and two squares back in the corridor and use whichever side has a wall. 11 sign wording: "The way starts to the west", no arrow claimed. 12 repeats: see repetition. 13 diary: all pages carry a day (12, 14, 17, 22, 30, 41, 47, 55, 63). 14 build time: the polish pass costs 0.4 to 0.6 s here (measured with performance.now, `L._hgpd.ms`), no chunking needed. 15 Glow Orb: checked (partyLight counts it: light 3.2 gives view range 13.5 against 7.8 for a torch) and 11 or 12 orb alcoves added. 16 skeleton on cairn: stones are moved aside whenever a skeleton shares their square.

## Lighting
- 53 coloured lights (teal and ice crystals, blue glow mushrooms, gold wall lanterns, rose coral, green, plus the four orb colours) at junctions, corners, six halls and the docks; the engine takes a colour and range per light, set in a `setupLights` wrap.
- Halos: the engine lights only floor and walls, so a lantern at the end of a corridor was invisible. Every light (163 halos) is also drawn as a soft glow over the view where it stands, hidden by walls (zbuf), within 12 to 14 squares. The lighthouse (46 squares) and the docks (20) are beacons with a hot core and a streak, visible across the sea (checked from 6, 14, 24 and 34 squares).
- A small lift under the lookup table for this level only (+0.03 to 0.05) so props and walls read; the party light still decides how far you see. Average screen brightness 44 of 255, 5 percent pure black in the walk shots.

## Repetition
Mirrored copies of 37 picture kinds (about half of all loose props face the other way), three open-book poses at different spots, 7 more dead-end scenes (bedroll, grave marker, miser, tools, roots, lid and coral, barrel and skeleton), 12 orb alcoves each with its own props, name on the map and a wall note, 11 more map names, rows of three identical props broken up (audit rows of 3 or more: 0).

## Orb alcoves
Eleven or twelve, spread round the level in dead ends and three-by-three halls (`wm_orbframeN` frames made by the well maze's own `wmOrbArt`, cyan, amber, green and one pink): Dunmow's Light, The Spare Light, The Lamp Bearer's Niche, The Shell Shrine, The Captain's Light, The Child's Lantern, The Prior's Gift, The Stone Stack, Pell's Reading Light, The Spare Shelf, The Dig Light, Marta's Ribbon. Taking one calls `orbTake`; the frame stays empty after saves and reloads (flag in `G.flags.orbTaken`). The game copies only some decor fields into G.decor, so an `update` wrap sets `orbFrame` and `emptyK` again whenever the list changes.

## What is still weak
- No new pictures were painted; everything is recoloured, flipped or reused painted art. A grey painted set (tally board, bedroll, a broken boat for the wreck) would still be better than the recolours.
- The wreck is the same picture as the beached boats, only larger.
- Frames are 0.53 high and stand on the floor; a stone plinth under them would read better.
- Enemy sprites in dead ends sometimes hide a set piece.
- Pools of light are strongest near orb alcoves; junction pools are subtle by design.

# Round 3 (zone under, polish file hgd_polish_d.js, port 8333)
Scripts: `u3_audit.py after` (round 2 audit plus kit, label, text, wall-pic duplicates, book size), `u3_lum.py tag N M` (mean luminance of corridor and hub screenshots), `u3_sheet.py` (contact sheet of the hgpd_* pictures), `u3_dbg.py`, `u3_q.py "js"`.
- Grey smear at The Dig: not a halo. A stone demon statue (hgd_dark.js, hgdn_st*) stood in a dead-end nook whose mouth is a junction square, and filled the screen when passed. A wrapper on hgdnPlace drops the 17 of 23 such statues; the horn at the Dig moved to the far end and a windlass added.
- Wreck: `hgpd_wreck`, a bow half with a ragged break, a stern piece and loose planks, cut from the painted boat on a canvas (hgpdWreck). Skeleton poses `hgpd_skelS` (slumped) and `hgpd_skelL` (reclining) made by turning the painted skeleton; lit and cold lanterns by tinting the painted lantern. Painted pieces not used before: pot, broken bucket, coins, tiles, slab, carved stone, pillar, crag, scale, key, windlass, candelabra, cask (grey copies via HGPD_GREY).
- Dead ends: 16 kits (FILL), each dead end takes the kit least used within 40 squares; 53 distinct prop sets among the dead ends, top share 7 percent (was a third). Other builders' seated skeletons are split into seated, slumped and reclining (12 down to 4 seated). Ladder kits all have a tall piece; dock cage lanterns and posts vary by dock; vignettes and orb alcoves use their own dominant props (no repeated skeleton, bucket, lantern pair).
- Book scale 0.14 high (0.38 wide, was 3x the lantern). Wall pictures on the same square as a sign or rune are moved to a free wall square (hooksMoved) so no lantern hides a rune. Captain's Light and Marta's Ribbon orbs are amber and green (no pink orb left).
- Every readable gets d.text and d.label (one to four words: Still here, Five strokes, The way up, The way to a boat, Journal page N, alcove names ...). Audit: noLabel 0, noText 0. Level 476 signs are not art_hs_* pictures, so hgd_polish_text.js labels them only if it reads d.label on these kinds.
- Light: wall tint 248/242/255, RANGE x1.8, LUT lift .17 to .27 for this level only. Measured (screenshots, enemies 2+ squares away, torch): corridors mean 76 (min 68), hubs mean 67 (min 50 when facing a bare wall).
- HGPD.rescale re-runs the scale table once on first play frame (a build before pictures load left some heights unset in the audit page).
- Unchanged by choice: the red watching eyes (hgd_eyes.js, deliberate), the single rock wall tile.
