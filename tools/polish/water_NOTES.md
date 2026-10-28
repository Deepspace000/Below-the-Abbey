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
