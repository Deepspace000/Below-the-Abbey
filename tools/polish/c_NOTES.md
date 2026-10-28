# Zone C notes: maze towns, enclaves, shops, people, churches

File: src/desert/hgd_polish_c.js (last in tools/inject.py ORDER). It patches the built level 475 once, after every other builder. No generator file was edited.

## What was found (see c_audit.md)
- The boy picture hg_npc2 had no height and was drawn 1.67 high, yet was the priest, armourer and trader in six places. Fixed: height 1.0 x sc 0.8, and he is only used for villagers.
- People had no common scale (0.72 to 1.01). Now one table: frogs 0.90 to 1.00, child 0.80, wizard 1.00.
- Shop greetings were one line in eight towns, warnings and rumours came from three and six shared lines, travellers were all called "A traveller".
- No signs, boards or landmarks in the towns; churches had no sign.
- Groves of identical trees and plaques, 90 clusters of three or more.

## What changed
- People: 97 NPCs rescaled, 81 given a different picture (a town no longer uses one picture where it can be avoided; portraits follow).
- Words: every shop greets with its own line in each town (40 lines), eight church greetings, 24 villager lines, 6 named travellers with their own lines, 48 rumours (six a town, by role), warnings name the nearest real danger zone. Done by wrapping hgdNode and startTalk, so quest text, trade and the Hollow word puzzle all still work.
- 56 shop and church signs with text, 8 notice boards (lost, wanted, notice), 8 signposts with true compass directions and distances to the three nearest towns and the Great Atrium. Armour, magic and signpost boards are lettered in code on the painted blank boards (IMG variants made once when the picture has loaded).
- 18 vignettes (8 town landmarks: Gardener's Rest, Bell of the Lost, Honey Press, Pearl Fountain, Old Well, Lamplighters' Post, Mosaic Corner, Gilder's Bench; 10 enclaves: silence room, lamp clearing, frog pond, reading room, rest stop, sleeper's nook, lantern landing, mossy corner, waiting room, torn journal), 112 props, each with a note that tells a short story, lamps added to L.lights, 4 reward chests (tier 3) with a hint in the note.
- Thinning: 54 flora swapped for other kinds, 32 extras removed, 64 stacked props separated. Shops, people cells, quest objects and chests that exist were not moved. A flood fill shows no prop cuts a corridor.

## What remains
- No new painted pictures were made (the Gemini route was not attempted in this run). Only 7 frog pictures plus the boy exist, so a town of 14 still repeats a picture twice, never adjacent by design. A sheet of 8 to 10 new townsfolk is the best next step.
- Churches and a few shops stand 13 to 20 squares from the town centre (placed by older files).
- Some stacked cells belong to other agents' props (hgx).
- Not run: the quest test scripts (none exist for tools/*hgd*), only the audit, a no-console-error load and screenshots.

# Round 2 (second polish pass, towns zone)

Same file (src/desert/hgd_polish_c.js, last block "ROUND 2"). Tools: c2_daemon.py + c2lib.py (persistent browser on port 8342), c2_audit.js (extended audit: pictures, repeated sentences, NPC adjacency, blocker rows, clusters, height table), c2_quest.js (starts a talk with all 93 zone NPCs), c2_tour.py / c2_tour2.py (screenshots in c2_shots/). Results: c2_audit_before2.json, c2_audit_after.json.

## What changed
- People: 34 different pictures (was 8). Quest givers and priests all differ (15 of 15): frogs, the human villagers (farmer, miner, baker, fisher, waterwoman, old man and woman, monk, priest, guard, smith, innkeeper, merchant), the frog elder and fisher, hooded lantern monk, diver, moths and whale kin. One height table (HGDPC_PH).
- Staging: shops and villagers spread round each square (greedy placement by angle and radius, at least 3 cells from other people), signs follow them, L._hgds2.shops updated. Church signs stand beside the church. Props that stood next to a person or a landmark and hid it were moved away; the plaque of a landmark is never in front of it (Old Well fixed).
- Houses: 4 per town (32), Hollow Grasslands huts and towers chosen per town (beehives in Combwick, shell huts in Nacre Landing, sand huts in Dunewell, tents in Blue Lantern and Tessera, gold domes in Gildmere), blocking but never cutting a corridor (pocket check), each with a lettered door plate that tells a story, a small prop and a warm light.
- Churches: eight silhouettes from existing painted pictures (chapel, wooden shrine, honey dome, pearl shrine, sand bell tower, blue pavilion, lace spire, gold dome), each tinted, brightened and given a window glow (canvas filter on the raster, made once), 2.2 to 3.5 squares tall, a coloured lamp at the door and its own props (bell, lanterns, jars, banner).
- Signs: every shop sign is lettered with the keeper's shop name (56 canvases from the blank hanging board), each town board has its town heading, each vignette plaque its title, each signpost and door plate its words. No sign repeats.
- Words: 44+20 warning templates (each used once or twice), 40 shop openers by kind and town, 8 church greetings and sign endings, 8 signpost endings. No sentence repeats more than twice in the zone (max 2).
- Light: 332 coloured pools (centre of each town, every stall by kind, house windows, junctions within 8 squares of every town and enclave, church doors). Added through setupLights (col, kI, range2) like zone E.
- Scale: see the table below. Clusters of the same prop thinned to under 3 within 3 cells (0 left), stacked props 0, blocker rows 0, duplicate danger signs removed.

## How the engine reads scale
Visible height in squares = NPC_H[kind] x decor.sc (sc defaults to 1). Width follows the picture's aspect. So a "scale" is one number per prop.

## Height table (squares), applied by hgdpcScalePass to every non-person prop of the zone
villager 0.9 to 1.05 (child 0.8, moths and whales 0.55 hovering), door plates 0.8, notice boards 0.8 to 0.9, signposts 1.25, shop signs 1.05, huts 1.05 to 1.5, tower houses 1.9 to 2.1, churches 2.2 to 3.5, statues 1.3 to 1.7, lamps 1.2 to 1.4, lampposts 1.2 to 1.5, plinths 0.5 to 0.8, tables 0.4 to 0.5, benches 0.4 to 0.55, chairs 0.5 to 0.65, chests 0.35 to 0.5, shell flowers 1.3 to 1.6, bulb flowers 1.2 to 1.5, ferns 1.0 to 1.3, fountains 1.2 to 1.5, trees 2.5, 2.9, 3.2 or 3.5 (size classes), banners 1.0 to 1.25, vines 1.0 to 1.25.

## Still weak
- No new painted pictures were made (the Gemini route was not run): churches and houses reuse existing paintings with tint and glow, so two churches share an underlying shape family with other places in the game. A painted sheet of eight distinct chapels and ten more townsfolk is still the best upgrade.
- Churches still stand 13 to 20 squares from some town centres (placed by hgd_church.js).
- Trees in the north zone and a few shelves are rescaled again by hgd_polish_d (not this zone).
- Sprites are only drawn about 20 squares away, so towers cannot be seen from across the maze (engine limit).
- No mist layer was added; the pools carry the atmosphere.
