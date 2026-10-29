# Blighted Road places 3 and 4: QA and atmosphere pass (29 Oct 2026)

Zone: Church of the Hollow Saint (9630, rooms 9631 to 9634) and Gallowmere (9640, rooms 9641 to 9643).
New file `src/desert/blight_polish34.js` (added to ORDER in `tools/inject.py` right after `blight_polish14.js`). Hooks in `blight_polish14.js`, edits in `blight_church.js` and `blight_gallowmere.js`. `blight_kit.js` untouched.

## Tools (tools/polish/blight34/)
`dump.py` writes `levels.json` (grid, decor, foes, doors, wet cells, own server on 8602). `audit.py` (duplicates within 2 squares, props next to doors and people, tight foes, 1-wide pinch cells), `wide.py` (flood fill that only walks through cells in an open 2x2 square: lists targets reachable only through a 1-wide gap, and unreached islands), `ascii.py id [x0 y0 x1 y1]` (map print). Shots in `tools/polish/blight34/shots/` (32 pngs, e.g. c11_nave.png, c12_nave_choir.png, c09_pit.png, g06_jetty.png).

## Found and fixed
- Nave: the left and right pew blocks left only a 1-wide strip (y 7) to the crypt stair, belfry hatch and vestry door, under the choir. Removed pew row y 8 on both sides: now 2 wide.
- Choir: 16 singers used 4 pictures in a row (same key next to each other). Now 8 pictures (4 mirrored and tinted copies), assigned so that no two within 2 squares match.
- Gallowmere piers: the jetty (49 to 50, 48), Heron pier (62, 17 to 18) and Reeve pier (28, 17 to 18) were 1 wide, and the party must cross them to reach the boats. All three are now 2 wide.
- Reeve's Isle: two trees at 23,12 and 22,13 cut off the west half of the isle from the landing. Removed (B34_CLEAR).
- Vestry: bookshelf (2,1), second bookshelf (4,1), and two more from the shared room dress stood side by side; two candle racks stood next to each other. Now one bookshelf, one scroll rack, one candle rack. Belfry: crates side by side now crate and barrel.
- Churchyard: crates stood on the two side tracks (36,40 and 44,40); moved. Bone heaps in the pit: one swapped.
- Same-key neighbours in the wild (dead trees, grass, hedges, reeds): `b34Vary` swaps a neighbour for a cousin key. Room bones and candles: second of a kind within 2 squares is mirrored, a third dropped.
- Checked and fine: quest dead ends (all of blq7 to blq14 run), unreachable doors/people/foes (none), quest rings, console errors (none), boats (out and back both ways, tested), nothing on road centre line y 35 or the causeway.

## Added
- Readable boards and slabs with plain writing: church (tally board, bell warning, pit board, poor chapel card, cloth on the road, three coffin notes, hymn board, sermon pages, collection plate, hymnal, tally in the crypt, floor slab, bell log, burial register) and Gallowmere (jetty board that explains the boat, causeway board, the roll of 212 names, peat pegs, Tam's reed bundles, two landing boards, tide slate, toll roll, salting list).
- A dark wreck boat, a coffin by the sexton's hut, a trail of bone fragments and candle stubs, grave candle lights, cold light on the church front, green lights over the pit and bog bodies, lights at the gibbet and isles.
- Fog colour: Gallowmere thick green (haze .4), churchyard cold blue grey.
- Sound (`b34Tick`): churchyard wind and rustle and rope creak by the bells; nave creaks; crypt drips, a knock in the dark; belfry wind and timber groans; vestry creaks; fen frogs, plops, reed rustle, gibbet rope, heron call on the north isles; Osk's house and the Reeve's hall plops and knocks; Nan's cottage knock (Hob).

## Left alone on purpose, and open points
- Lantern pairs flank the two gates and the boat posts flank the boat: kept (framing, not clutter). Wall niches in the crypt come in pairs for the same reason.
- Rooms: foes spawn inside small rooms by design; the nave, crypt and belfry have no foes at the arrival square.
- Wisp at 23,13, crow at 25,31 and shade at 16,16 have few free neighbours but fly or stand on a shore; left.
- Gemini: not used. The coordinator's message arrived late and the pass was finished with filtered existing paintings. Most valuable new pieces if wanted: a stilt house, a hanged figure, an upside-down bell (all currently stand-ins, see BLIGHT_NOTES.md).
- Not run: save and shots tests were run only as `load links walk quests shots` (all pass, no console errors); `save` not re-run.

## Round 2 (29 Oct 2026): Church and Gallowmere
- New painted art (Gemini, 2 sheets, front elevation, cut with tools/polish/blight_r2/cut.py): `assets/ds_bl_stilt1.png` (small stilt house), `ds_bl_stilt2.png` (wide stilt house with lit windows), `ds_bl_ibell2.png` (cracked bronze bell, mouth up, on a stone base; made from an upright bell flipped), `ds_bl_hang1.png`, `ds_bl_hang2.png` (gallows with one and two hanged). Max of 5 pieces; the first bell and house drawings were slightly angled and were redone.
- Gallowmere: Nan's and Osk's houses and the four shut houses are now the painted stilt houses, as pictures over a hidden low block (`C.picHouse`, wh .2 so the block does not show between the stilts). `picHouse` got two additive options in blight_kit.js: `up` (door faces north) and `sy` (picture y). The Gallows Tree has the two painted gallows (hanged text rewritten). Wisp is 30 percent smaller. Water floor brighter. Reeves' hall stays stone.
- Church: the four bells by the path are the painted bell (scale .85); nave floor darkened (`blc_nave`) to lower the checker glare. Stones and trees vary in size.
- Fixes: a talking growth on the strip north of the Reeve's hall (31,7) is a plain growth; the walk test had flagged it as unreachable.
- Checks: reach script clean for all 9630 to 9643 (known false positives only), blight34_test load, links, quests, walk pass; 30 shots in tools/polish/blight_r2/after looked at.
- Open: plague pit view still cut by the skull tree trunk; belfry bells are still the flipped Wenlock bell; church front has no steps.
