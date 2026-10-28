# Below the Abbey: update log, 3.631 to 3.682

Everything added since the last itch update (v3.631), in the order of the story. Version numbers are the ones pushed to GitHub. Items marked NEXT are built but not yet pushed.

## The new western kingdoms (levels 80 to 87)

| Area | Level | What it is |
|---|---|---|
| The Black Swill | 80 | Cinder sends you down to the Underlevel to kill a huge black jelly on the central island of the Black Sea. About 30,000 health, splits off slimes, spits corrosion, no respawn. Killing it opens a new gate in the Deeper Hollow and a new main quest. |
| Maze of Gardens | 80 | A hedge maze of sixteen painted hedge kinds, flowers, bees, butterflies, fountains, stone guardians and the Hedge Warden. Five small folk give four quests. The map fills in as you explore. |
| Wenlock | 80 | A peaceful English market town: 63 enterable buildings, a church with stained glass, a mill, a pier on the brook, market stalls that are real shops, a mayor and townsfolk, ten linked town quests. Sells every gear tier, white to orange. Town bells and village noises. |
| The Well Maze under Wenlock's well | 80 to 83 | Four floors of purple brick maze. Three named keys, switches that open treasure rooms, four puzzles (weights and bucket, mirror hall, bell code, colour lanterns), a boss (the Well-Warden), and a secret button door near the Bell Vaults whose teleport takes you up to Wenlock. A digger's note hints at it. |
| Blackbriar Wood | 82 | A dark maze of trees with a gingerbread cottage and a malevolent witch. Eight chained quests ending with pushing her into the oven, plus side quests (The Lost Washing, Hobb's Lunch). |
| The Wenlock Graveyard | 84 | Cobbled paths, autumn trees, ivy, walk-in tombs, the Vaults Beneath the Avenue, a crypt with the ghost Lady Aldith, and four brick mazes (each its own brick, creatures and mini-boss) rated 84 to 87. She finds peace at the end of the chain. Each maze entrance is its own built front with its own torch colour. |

## New items and inventory

- **Glow Orb:** a new lantern. Steady cool blue light, a wider radius than the Brass Lantern. 30 gold. Sold in Wenlock and in the Deeper Hollow maze towns. Found in ornate iron frames in the well maze.
- **Stacking:** torches and orbs now stack.
- **Split chooser:** shift+click a stack, or use the Split button, to pick how many to take out.
- **Inventory Store button, chest Sort button, acquisition stamps.**
- **Houses and real estate:** agents in eight towns sell small, medium and large houses, furniture, a home chest and boss trophies.
- **Fishing:** five rods, 40 fish, baits, a bait seller, fishing spots across the world, a line game and a rod animation.

## Hollow Grasslands

- The four book hives are about three quarters of their old size per side, and the Amber book can now be reached.
- Three new rescue quests (Hush, Droning, Amber), eight captives each, joining the Queen's. Each hive has its own honey hue.
- Every book is on a glowing lectern with a pulsing halo and a map star.

## Deeper Hollow polish

- Signs and notes have new painted sprites (twelve), and zero missing pictures on load.
- Bosses, statues, lamps and shop signs rescaled to a consistent scheme.
- Vignettes, lighting and landmarks added in all five zones. Churches, houses and quest givers varied across the eight towns.
- Underlevel: dark wet water, island floors and lights, 230 pieces of corridor decor, two small quests, lamps at the ladders.

## Balance and systems

- **Priest heals** are fixed amounts, like heal potions: the lesser heals become nearly useless as heroes level, each stronger spell heals more and costs proportionally more mana. Spell cards show the real amount. NEXT: a new single heal, Restoration (level 50, 3,000 gold at the Wizard's spell shop).
- **No teleporting during a fight:** stones, maze stones and the Potion of Escape refuse.
- **Mercy:** a beaten bandit begs for mercy about one time in eight, and a bandit who has surrendered and is struck fights on instead of blocking the way.
- **Shops:** higher-tier gear in Thornwick, Ironhill and Greendale.
- **Teleport stones** now stand only in important places (none in houses, cottages, cellars, sheds or player houses).

## Maps

- The world map has a new western region: Wenlock, the gardens, the wood, the graveyard with its four mazes, the well maze, the road west that is not yet open.
- An Atlas of Mazes and Dungeons lists every area, with a been-there box and a finished box on every row, and a sort by level. Names stay scrambled and faint until you have been there, and become bold when found.
- The graveyard mazes are drawn as small isometric brick mazes with torch glow, each its own layout.

## Fixes

- Dig and Fish buttons no longer cover Embark or Disembark.
- Level changes now run in order. The test links for the well maze and graveyard had been landing in Ironhill.
- Wenlock's room ids moved to 7000 to 7062, so they no longer clash with the Pilgrim woods caves.
- NEXT: the Exsce map no longer crashes when a wall has an unlisted tint.
- The Gandrick vault door re-locking on reload and the walled-in portal to the Ironhill Road were found by the playtest and are still open.

## Playtest findings (partial)

An automated new-game run reached the Castle Dungeons in Act 1 (about 6 hours of estimated human play, 52 wipes in range). The Ironhill Tunnel dropped from 64 wipes to 0 once the bot used the heal powers and potions like a person. Castle Dungeons (Mayor Halbrecht) took 43 wipes. Acts 2 to 8 are still untested. The full report is `tools/playtest/PLAYTEST_REPORT.md`.

## Known gaps

- Six Wenlock townsfolk and the duck, goose, dog and cat sprites are still missing.
- The Black Swill's chamber is almost black and the first boat is far from the ladders.
- The orb icon is a recoloured lantern.
