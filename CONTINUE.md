# How to continue (written 29 Oct 2026, after v3.694)

State: v3.694 is on GitHub and Pages. itch (html5) and Windows are at 3.692; push 3.694 to them when the owner says so (CLAUDE.md release steps).

## What exists now
* Wenlock (496) with the main quest chain wk4 to wk8 (the three Warden's Seals open the west gate: src/desert/wenlock_seals.js), six market quests (wenlock_market.js), four thief quests with watchmen and the town cells 7097 (wenlock_thief.js, wenlock_watch.js), Old Bracken's den 7098 (wenlock_den.js), infested houses in seven towns (infested.js).
* The Blighted Road: ten places, ids 9610 to 9709, table BL_ROAD in blight_road.js, notes in tools/BLIGHT_NOTES.md; the Vault of Maldrake (vault_*.js, tools/VAULT_NOTES.md); the town of Sale (level 600, sale_*.js, tools/SALE_NOTES.md; ten barricaded shops, ten trust quests; the Sanctuary door is barred until Wren and Aldous are written). Critic files: tools/polish/blight1to4_CRITIC.md, blight5to8_CRITIC.md, blight9sale_CRITIC.md (with NOTES).
* World map shows the whole west, with unbuilt places greyed (maps_world_blight.js, table WMB_PLACES).
* The plan for the rest is NEXT_PART_PLAN.md.

## Tests (run ONE MODE AT A TIME; the 'all' modes hang)
tools/blight_test.py, blight34_test.py, blight56_test.py, blight8910_test.py (load|links|quests|save...), vault_test.py struct, sale_test.py all (SA_PORT), wenlock_thief_test.py <port>, bracken_den_test.py, wenlock_market_test.py, wenlock_seals_test.py <port>, infest_test.py <port> <town>. Each needs its own `python -m http.server <port>` in the repo root and BTA_CHROME set to an installed Chrome (C:/Program Files/Google/Chrome/Application/chrome.exe).

## Not done
* The Pale Lands (level 100) and the Pale Spire (a big multi-level castle like the Orange Spire): not built. Open design questions are at the end of NEXT_PART_PLAN.md (what the Wren and Aldous pact is, how the Sovereign ends, how the Violet Tower and Orrery are used).
* Painted art, blocked because Claude in Chrome was not connected: Sale's gibbet and ghost villagers, a skull-apple tree, painted tents and battlements for Lanternrest, a ruined Hollowbell church, painted pale-silver locks, painted Maldrake and wardens, a painted sky. Use the gemini-art-pipeline memory when Chrome is connected.
* Known visual gaps from the critics: flat ground in the Rookery and Pale Bridge, lit windows are only light squares, Gallowmere's houses are not on stilts, Lanternrest's wall walk is not walkable.
* Boss balance (Maldrake, Abbot, Crow Queen, Pale Knight, Reaper-Farmer) was set by eye, not playtested.
* Performance: boot and per-frame work were improved in 3.685 and 3.687 (tools/perf/RESULTS_round2.md); the owner's laptop may still feel slow.
