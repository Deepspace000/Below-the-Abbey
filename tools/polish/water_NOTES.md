# Polish notes, zone water (Drowned Maze 477, the three boat lakes of 475), round 2

Files: src/desert/hgd_polish_e.js (all code), tools/polish/e2_run.py (one browser session, many steps), e2_audit.py (true heights, table outliers, sight lines, creature distance, light coverage), e2_*.js probes, shots in tools/polish/shots/e2_*.png.
Server for tests: python -m http.server 8344 (pid in tools/polish/e2_server.pid).

## Scale scheme (read from the engine, not guessed)
A decor picture is drawn with width = NPC_H[k] * (picture ratio) * d.sc, or 0.7 * d.sc when the kind has no NPC_H, and height = width / ratio.
So true height = NPC_H[k] * sc, or 0.7 * sc / ratio. Round 1 treated the second case as 0.6, so mirror (1.9 tall), shelves, rune, scales were wrong. hgweSc(k,h) and hgweHt(d) in the file now convert both ways.
A person is about 0.9, walls of 477 are 2.6 (CEILH). Enemies are capped at 0.8 high by the engine (FIT_MAX), so the "worm taller than the wall" was only a creature standing next to the camera.
Table (HGDWE_TBL, applied by hgweFixScale to every solid prop): statues 1.3 to 1.5 (owl, scarab 1.0 to 1.35), shelves 1.0 to 1.2, cabinet .75 to .95, bell .7 to .8, boat .8 to .95 (about 1.25 wide), chest .4 to .5,
barrel, crate, keg .35 to .5, bucket .22 to .35, skeleton .25 to .4, pearl lamps 1.0 to 1.4, pedestal .5 to .9, shrine .9 to 1.1, mirror 1.1 to 1.3, scales .6 to .8, rune .7 to .95, small props .08 to .55, moss .18 to .36, rocks .26 to .5, grass .3 to .72, reeds .45 to .85, algae .45 to .9.
Lake landmarks are deliberately taller (1.35 to 1.9) so they are seen from across the water.

## Critic issues, one by one
1. One note sprite: the signage agent (hgd_polish_signs.js) swaps hl_p_note by text; on top of that seven notes now ride on the object itself (bell, boat, shrine, mirror, scales, rune stone, crate, clam), 28 carriers with distinct text, none empty, none repeated, no dashes. Four new stories (orb, nets, anemones, candles) and 8 sign voices.
2. Round-leaf vine: all 15 removed (they were 2.2 tall, pale, and hid the note at (13,37)).
3. Bell .75, shelves 1.12 / cabinet .82 / shelf 1.1 (three different pieces, no identical row), mirror 1.2.
4. Creatures: every creature outside the warden's core is at least 3 squares from every set piece, chest and stairs (1 left, the warden's guard). Moved by script (see info.enemiesMoved).
5. Shrine moved to a dead end with a straight sight line (spots are sorted by how far the prop can be seen along its passage); audit counts solid props with less than 3 squares of straight view (1 left, the rune stone in a corner).
6. Fish: the maze's own lanes (which ran through walls) and the sea fish overlay (reef fish, angelfish, a shark drawn over the player's head, wrong for a pond) are gone. 119 individual carp, perch, trout, goldfish, bream, pike, tench in shoals of 1 to 5 swim back and forth along real straight passages at .08 to .5 high, each flipped to face the way it swims.
7. Lakes (475): each lake has its own colour of light over the water (amber, teal, violet; 8 to 10 lights each), its own landmark in open water with a faded upside-down reflection (a tall pearl lamp, a shell statue beside a ruined arch, a crystal spire beside a crystal pillar),
   its own jetty details at both docks (pilings, lamp with reflection, buoy, nets and pots / clams and shells / crystals and crates), its own shore life (gulls on pilings, clams and coral, basking turtles), the same pearly reed in front of every landing removed, boats drawn at .82.
8. Corridors: 81 lights (was 16) with a source each (wall lanterns, glow mushrooms, crystals, pearl lamp posts), plus 59 small unique things in the long passages, no two in a row alike.
9. Dead ends all hold something; the one barrel in a corridor moved into its room. 10. Old save chests: not migrated (see below). 11. Eight sign voices, with real path lengths and the first turn to take.

## Not done / still weak
- Fog on the water: the engine has no fog layer; the colour pools and the haze have to carry it. No water floor variant per lake (the floor texture is shared); the tint comes from the lights.
- Reflections are static upside-down copies, they do not ripple.
- No new paintings were made (no Gemini/Canva session): everything reuses existing front-on art. A heron colony, a painted jetty and lily pad rafts are still worth painting.
- The big marsh lake (Flooded Quarter) got no new look.
- Old saves: the seven moved chests may be offered again once. No migration written.
- The rune stone sits in a corner (sight line 2). One piranha still stands 3 squares from the warden chest.
- Another agent's error appears on every load: hgdpc ReferenceError hgdpcH is not defined (hgd_polish_c.js), not in this zone.

# Round 3 (hgd_polish_e3.js, loaded just before jump_ready.js)

Files: src/desert/hgd_polish_e3.js (all new code), small edits in hgd_polish_e.js (fish capped at .35 high and hidden within 1.3 squares of the camera or 1.6 of a note or set piece; moved chests remember hgdwOrig).
Tools: tools/polish/w3_all.py (one browser session: audit of 477, save tests, about 40 full size shots with mean luminance of the 3D view, JSON in w3_result_<tag>.json, shots in w3_shots/), w3_run.py and w3_dump.py (copies of the e2 tools on port 8334).

## What changed, critic issue by issue
1. Lone set pieces: mirror, diver's camp, pearl grotto, scales, rune stone, smugglers' cache each got 6 to 7 supporting props (own kinds, offsets at the sides of the passage, none blocking), two light pools and a new story note; the bell, ferry, shrine, board and lantern nook were thin too and got the same. Every one of the 13 pieces now has 9 or more props within 3 squares (audit table in w3_result_*.json).
2. Moss within 2.3 squares of any set piece, sign, chest, stairs, arch or board is removed (53), and all other moss is capped at .25 high (37). Tall plants (over .4) within 2.3 squares of those are removed too.
3. Lakes: boat colour, size, flip and offset per lake (amber 0.64, teal 1.0 flipped, violet .8 flipped), a different tall lit beacon straight ahead of each departure dock (lamp, shell statue, crystal pillar, with reflection and a strong light) and one ahead of each far dock in the next lake's style, darker pots. The dock ARCH itself is wall geometry made by the engine and cannot be changed from a decor pass. Lake 3's docks do face the water (checked with the party facing the dock direction: dep (97,65) faces east f=1, far (123,43) faces south f=2); the critic shot them facing the wrong way.
4. Long runs: every straight run of 7 or more squares gets a tall lit landmark every 7 squares (8 kinds, rotating, each with a small companion and its own colour of light), after a path-distance pass that puts a landmark wherever the nearest one is more than 10 steps away. Audit: no open square is more than 10 steps from a landmark, sign, set piece or tall prop.
5. Fish: capped .35 high, never drawn within 1.3 of the camera or 1.6 of a note or set piece.
6. Fog and second light colour: drawWorld is wrapped; a screen-blended tinted haze and a horizon band are drawn over the 3D view. In the maze the colour is the distance-weighted mix of the nearby light colours (so gardens go teal, camps amber, shrines violet); on the lakes it is the lake colour (amber, teal, violet) fading out 14 squares from the shore. Maze ambient raised from .5 to .58.
7. Piranha: moved to at least 5.5 squares from the warden chest.
8. Old saves: the engine copies only a fixed list of fields from the level scenery into the playing copy G.decor, so hgdwTier (chest tier) and hgdwText were LOST in play: chests gave generic loot and never recorded the opened flag, so the Shell Chests quest (wq4) could not be completed. A wrapper on reset() now carries hgdwTier, hgdwOrig, hgdwText, label back by index. Saves: chest state is stored by position ("hgw3:x,y"), numbered scenery records from older saves are ignored for 477 (the order changed in rounds 1 to 3); an old save whose opened-chest flag list holds either the old or the new position of a chest gets that chest back opened and empty. Tested in w3_all.py (oldSaveOpensEmpty, newSaveRestored, indexIgnored all true).
9. Labels: every note and sign carries d.label (one to four words, e.g. Mirror Frame, Signpost, Scratched Words); none empty, none with a dash.
10. Luminance (mean of the 3D view, 5..955 x 5..485): see the table in the result JSON; corridors 54 or more, hubs 60 or more.

## Not done
- The pale flat fish of (19,17) was not found in the fish list (all seven species are painted); the old screenshot object may be a sea creature from another module.
- No new paintings (no Gemini session); everything reuses existing front-on art.
- The arch and planks at the three departure docks are still engine geometry and look alike; the lakes differ by boat, beacon, light, haze and landing props.

# Round 4 (hgd_polish_e4.js, ORDER right after hgd_polish_e3.js; small edit in hgd_polish_e.js: big fish hidden within 2.6 squares)

Tools: tools/polish/w4_daemon.py (one persistent browser on port 8323, queue in w4_q), w4lib.py, w4ev.py (run a js file), w4shot.py (shot at x y f), w4_audit.js (set piece distances, titles, quest counting, run gaps), shots in tools/polish/w4_shots/.

## What changed, issue by issue
1. Creatures: every creature (the warden's core excepted) is at least 6 squares from every set piece, at least 8 when a straight open line joins them, at least 3 from chests and stairs, 2 from signs. 59 moved. Audit: 0 within 6, 0 on any approach square (the four squares straight out from each set piece).
2. Shell Chests (wq4): the quest counted a moved chest twice (quests2 wrote "x,y", e3 wrote the old position). Now the goal counts distinct chests through a map position->original position (kept in the save as flags.hgdwMoved so any level can count), lootFor folds the position key onto the original one, reset folds old saves. Tested: opening all 12 in order gives 1..12, the 7 moved chests alone give 1..7, an old save with both keys of one chest counts 1.
3. Writing: the real cause of the blank "Note": the playing copy G.decor loses the label, so the sign was lettered with no text at setupLights; and the level copy was lettered before e3 gave it a label, so it carried the cut sentence. hgw4Relabel re-letters on reset and setupLights. 39 notes have a hand written title of 1 to 4 words in HGW4_TITLES (e.g. Stairs 46 West, Hest's Slate, Ferry Ticket), none cut, none "Note", none repeated. Standing signs are raised to a true height of at least .62.
4. Docks: the dock arch is an engine wall tile; each of the six docks now gets its own tile (own char and gid, made after the build): lake 1 round arch with amber sky and a lamp beacon, lake 2 pointed arch, teal, shell statue, lake 3 square lintel, violet, crystal pillar; far docks show the next lake's beacon and one lamp with a rope; departure docks show the lake's boat. Boats at anchor are lighter, smaller and lifted.
5. Proportions: props within 3.2 squares of a set piece are capped at .55 of its height (barrels, kegs, crates, nets, pots, buckets); anything small standing on the four approach squares is shrunk to .28 and pushed against the wall (blocking ones become walk through); net racks capped at .55.
6. Variety: candelabra, crystal clusters, barrels, lamps rotate through three or four variants, never the same twice inside one set piece.
7. Landmarks: every straight run of 8 or more squares gets a lit tall landmark on the sight line (centred, not beside it) wherever there would be more than 6 squares without one (65 added).
