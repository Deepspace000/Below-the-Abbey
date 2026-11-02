# How to continue (rewritten 2 Nov 2026, for v3.768)

State: v3.768 is on GitHub and Pages (index.html, version.json and win-manifest.json all say 3.768).
itch.io (html5) and the Windows app were last pushed at 3.758 (per CHANGES-3.722-3.764.md). Versions 3.759 to 3.768 are not on itch yet. Push them when the owner says so (CLAUDE.md release steps).

I could not see the changes in 3.765 to 3.768 (no notes were written for them and the clone is shallow). Check `git log` on a full clone before relying on this file for those four versions.

## What exists now
* Wenlock (496) with the main quest chain wk4 to wk8 (the three Warden's Seals open the west gate: src/desert/wenlock_seals.js), market quests, thief quests, Old Bracken's den, infested houses in seven towns.
* The Blighted Road: ten places, ids 9610 to 9709, table BL_ROAD in blight_road.js, notes in tools/BLIGHT_NOTES.md; the Vault of Maldrake (vault_*.js); the town of Sale (level 600, sale_*.js, tools/SALE_NOTES.md). The Sanctuary door in Sale is barred until Wren and Aldous are written.
* The Pale Spire is now started: the approach, the Court of Statues, the castle, and the second floor, the Hall of Illusions (ps_f2_*.js, 3.734 to 3.742). It has the Dreamkeeper's quest "The Sleeper's Pieces", seven illusion rooms, seven puzzles, and an area map for each of the eight levels. The Crooked Road and the Never-Ending Tower (nt_*.js) exist too.
* Newer systems (3.735 to 3.754): party cutscenes at key places, Intelligent adjustment (offers help after four falls, raises difficulty for fast winners, switch off in Menu > Gameplay), secret walls with potion chests in 54 mazes and dungeons, fog of war on every maze map, six new mana potion tiers, rain on 15 percent of outdoor visits.
* Roofs (3.770): src/desert/thornwick_roofs.js now serves two towns through TKR.sets (one house table and wall height per level): Thornwick (level 3, walls 1.55) and Ironhill (level 13, walls 3.4, the outdoor height). Ironhill has pitched roofs on its houses, a chapel tower with spire and cross on the church, and a castle top (crenellated parapet, four spired turrets, a keep) on the mayor's residence. It reuses the painted Thornwick pieces (assets/tkr); the crenellated parapet picture is cut from the painted tower stone in code (tkrMakeCren). Roofs on 3.4 high walls only show from far away, because the camera looks level. Not yet roofed: Oldhaven, Yarrim, Wenlock.
* Early game polish (3.743 to 3.764): painted walls, floors and torches in the crypts and early dungeons, Thornwick and Ironhill exteriors, Gandrick's cave rebuilt as a tunnel maze with six halls, Tiki the cat.
* Higher-tier gear in the early towns: src/desert/shop_tiers.js (switched ON), notes in tools/SHOP_TIERS_NOTES.md.
* Full list of changes from 3.723 to 3.764: CHANGES-3.722-3.764.md. The plan for the rest: NEXT_PART_PLAN.md.

## Tests (run ONE MODE AT A TIME; the 'all' modes hang)
tools/blight_test.py, blight34_test.py, blight56_test.py, blight8910_test.py (load|links|quests|save...), vault_test.py struct, sale_test.py all (SA_PORT), wenlock_thief_test.py <port>, bracken_den_test.py, wenlock_market_test.py, wenlock_seals_test.py <port>, infest_test.py <port> <town>. Each needs its own `python -m http.server <port>` in the repo root and BTA_CHROME set to an installed Chrome (C:/Program Files/Google/Chrome/Application/chrome.exe).

## Not done
* The rest of the Pale Spire (floors above the second, the Pale Sovereign at the top) and the Pale Lands (level 100). Open design questions are at the end of NEXT_PART_PLAN.md: what the Wren and Aldous pact is, how the Sovereign ends, how the Violet Tower and Orrery are used.
* Thornwick roofs: the sliding up close is still being fixed, and Wenlock and Oldhaven should match.
* Repainted ground bones, dungeon flower patches grown from the brick joints, and the Oldhaven ground flicker were handed to agents. Check whether they landed.
* Not yet painted or reworked: Ironhill's code-drawn portal doors, the Oldhaven, Yarrim and Wenlock exteriors, the building interiors, and secret rooms in level 39 and the deepest dungeons.
* Shops (TODO.md): rerun the playtest with the shops on, paint icons for the new daggers, staves and chain pieces, decide on stock counts, walk to the hunter in Gandrick's Wood, and look at the later towns (Oldhaven, Wenlock, the Hollow). Also finish the Wenlock graveyard (paused, switched off, tools/GRAVEYARD_NOTES.md) and resume the playtest from Act 1 step 7 (tools/playtest/PLAYTEST_REPORT.md).
* Painted art, blocked when Claude in Chrome was not connected: Sale's gibbet and ghost villagers, a skull-apple tree, painted tents and battlements for Lanternrest, a ruined Hollowbell church, painted pale-silver locks, painted Maldrake and wardens, a painted sky. Use the gemini-art-pipeline memory when Chrome is connected.
* Known visual gaps from the critics: flat ground in the Rookery and Pale Bridge, lit windows are only light squares, Gallowmere's houses are not on stilts, Lanternrest's wall walk is not walkable.
* Boss balance (Maldrake, Abbot, Crow Queen, Pale Knight, Reaper-Farmer) was set by eye, not playtested.
* Performance: improved in 3.685 and 3.687 (tools/perf/RESULTS_round2.md); the owner's laptop may still feel slow.
