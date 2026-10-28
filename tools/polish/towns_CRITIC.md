# Towns critic review (zone C: maze towns, enclaves, shops, people, churches)

Method: own server on port 8382 (stopped by PID afterwards), link ?town=deephollow&lvl=34, 37 full-size screenshots in tools/polish/towns_critic_shots/ (all looked at), audit rerun with tools/polish/c_probe.py + c_audit.js, plus probes of decor, text and NPC cells. Console errors: none. Load: about 20 to 30 s in software GL (swiftshader, 6 to 9 fps, not a fair frame-rate test).

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 7 | People share one scale (npc0 0.98, npc6 0.95, npc3 0.95, wizard 1.0, child 0.8 effective squares). No stretched sprites. Props on the floor line. Weak: church hut only about 1.5 frog heights (02, 06, 16, 30); town notice board 0.77 vs lamp 2.2 vs plaque boards reading oversize next to the landmark they label (15) |
| Signage and text | 7 | 56 shop signs, 8 boards, 8 signposts; text is good, no em dashes, no placeholders. But sign pictures are generic (same "General Goods" art in every town), board text is only readable on click (board in 17, 18 shows blank scraps), duplicate sign text in Tessera |
| Prop placement | 7 | No corridor cutting (flood fill 0), nothing on walls, 13 stacked cells. Weak: landmark hidden behind its own plaque (Dunewell 15), vignette props hide quest givers (27, 25) |
| Repetition | 5 | Still 13 clusters of 3+; same frog art for all 8 quest givers and 8 priests (hg_npc0 x15); same church hut in 8 towns; Hedgefoot (01) and Gildmere (22) centres show the same General Goods stall dead centre; Cairnhold (05), Combwick (08), Nacre (11) squares all quest board + two stalls in a row |
| Landmarks and navigation | 6 | 8 named landmarks exist as props but read as one barrel, bench or plinth (09, 23). Signposts true. Churches 15 to 20 squares from centre with no way to know |
| Lighting and atmosphere | 6 | Plazas lit nicely (05, 11, 14), churches and enclave corridors nearly black (02, 06, 10, 16, 24, 30), no lamp at any church door |
| Bespoke detail and storytelling | 7 | 18 vignettes and notes are charming (reading room 27, quiet room 25, bell 07). Towns are plazas, not towns: no houses at all (CLAUDE.md asks for tiny roofed houses on a street) |
| Art quality and consistency | 7 | Painted raster throughout, consistent. Frog set of 7 repeats |
| Performance and loading | 7 | No stalls found, 1152 zone decor, 271 lights level wide. Load 20 to 30 s |
| Console errors | 10 | none on load or during 37 jumps |

## Defects

1. HIGH, repetition. The eight churches are one identical hut with the same frog in the doorway. Repro: ?town=deephollow, stand at (120,163), (16,165), (54,150), (77,107), (52,81), (124,19) face north, shots 02, 06, 10, 13, 16, 30. Fix: three or four painted church variants (bell tower, round, mossy, gilded) or at least differently tinted and scaled with a per-town bell or window glow; give each a unique prop beside it.
2. HIGH, repetition and staging. Quest giver and priest use the same sprite hg_npc0 in all 8 towns and 7 enclaves (15 uses); only 7 frogs exist. Fix: paint 8 to 10 new townsfolk, give each quest giver a distinct hat or tool.
3. HIGH, composition. Shops line up shoulder to shoulder. Tessera has six blockers in a row at y=16, x=119 to 124 (shot 34, ASCII dump in this review); Gildmere three at (141..143,28); Hedgefoot centre stacks stall, statue, board, quest giver within 3 squares (01, 03). 12 NPC pairs are in adjacent cells (q6+armour6+magic6 at 121,16; q5+magic5+trader5 at 28,45). Fix: spread shops round the square, one per side, minimum 2 cells between NPCs.
4. MEDIUM, CLAUDE.md. No houses, roofs or lanes in any maze town (kinds list has zero house props; only well:1). Towns read as open plazas with stalls. Fix: add 3 to 5 painted tiny houses per town along one lane.
5. MEDIUM, dialogue. Sentence-level repetition: "Well met." x15, "Welcome, traveller." x14, "They said it before they went in." x9, "Come in, come in." x9, "quiet is how it starts" x7, "same number of boots" x6, "Believe the cgnox" x5 (cgnox is the Hollow cipher, intended). Whole-line duplicates are 0, but players meet the same warnings in every town. Fix: 3 more variants per warning template and one unique opener per shop.
6. MEDIUM, lighting. Church fronts and enclave approaches nearly black (02, 06, 16, 24, 30). Repro as in 1. Fix: add a warm lamp to L.lights 1 square from each church door.
7. MEDIUM, signage. Town notice board and plaques show unreadable paper scraps (17 at (28,48), 18 at (30,54)); the text exists only when clicked. Shop signs are generic art with the same words in 8 towns (sign_store, sign_smith). Fix: letter the board picture with the town name in code like the armour sign, and the shop name on each stall board.
8. MEDIUM, landmarks. Dunewell Old Well plaque (41,95) stands 2 squares in front of the well (41,93) and hides it from the south (15); Honey Press (65,142) is a barrel beside a stall (09); Gilder's Bench is a plain vase and stall (23). Fix: move plaques beside the landmark, give the press and fountain their own painted prop.
9. LOW, staging. Vignette props hide quest givers: reading room globe and books at (14,72) cover the giver at (14,70) (27); quiet room urn at (52,170) puts the giver "on" the urn (25). Fix: shift props one cell sideways.
10. LOW, duplicate text. Tessera has two hgd_sign props with identical text ("Glarxr. The Black Hall lies ahead...") at (114,9) and (113,16). Fix: vary the second.
11. LOW, tooling. c_probe.py and the other probes hard code port 8362; if that port is free they work, otherwise edit. Quest-giver audit still untested without quest state, and no quest or stuck-state test was run by the polish agent.

## Verdict: FIX FIRST (defects 1, 2, 3 are the ones a player sees in the first minute; the rest can follow).
