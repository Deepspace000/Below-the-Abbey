# Below the Abbey: update log since 3.599

Covers versions 3.599 to 3.624 (23 to 24 October 2026). Written for the owner. Each version says what a player will notice, then the one or two things that matter when working on the game. Versions 3.608 to 3.622 were made in another session (the balance work); they are described from their commits and files.

## At a glance

* The world map was redrawn by hand: painted places, scenery, dirt paths and winding painted rivers (3.601 to 3.604). The old pen-drawn map is gone.
* New places: the Ruby Maze behind Dorn's store in Ironhill, with Wren the sorceress and Tobin; the Golden Crypt now a level 30 place.
* The wild dungeons in the woods and deserts are hills and rock piles with a door in them (3.601).
* Mana does not come back by itself any more (3.610). It comes back from rings and gear (3.611, 3.613), from mana potions (stronger since 3.615) and now from mana potions lying in every area (3.624).
* Combat balance: creatures stand 1 below, at or 1 above their place (3.614); experience is capped and stepped (3.616 to 3.620); the Black Sea and Hollow creatures are sized like everyone else's (3.621, 3.622).
* iPad: the canvas memory problem that blanked the maps is fixed (3.605); the itch.io page was given safer downloads and a clearer error (3.607).
* Windows: the app now updates its own game files from GitHub Pages (3.606).
* Party screen: type your own hero name (3.623). When the party dies there are now four choices, and every area start is saved (3.624).

---

## 3.599 (23 October)

Prices and levels
* Shovels cost more: Peasant's 300 gold, Farmer's 450, Miner's 650, Gravedigger's 950, Sailor's 1,400, Knight's 2,100, Dwarven 3,100, Silver 4,600, Royal 6,800, King's Golden 10,000. The Butterfly Cage is 500. The chances of finding treasure did not change. The better shovels reach the shops as the party levels (Miner's at level 8, Gravedigger's 15, Sailor's 22, Knight's 30, Dwarven 38, Silver 46, Royal 54, King's Golden 62): each time a trader, general store or peddler's cart is opened after the party has reached the level, the new shovel is added and the cheaper ones stay.
* Every food item costs twice as much and sells for twice as much.
* A level up fills health but not mana: the higher maximum stays as empty as it was.
* Desert levels: Blue Dunes 37, White Dunes 42, Violet Erg 46 (the dungeons in each take their desert's level). The Golden Erg and the Flatlands stay at 45.

The Golden Crypt and Ironhill
* The Golden Crypt under the Ironhill Burial Ground is a level 30 place; its creatures stand at levels 23 to 30 (they were 12 and 13). It has its own place on the world map next to the Burial Ground, joined by a short track, and its own painted local map showing the halls, coffins, statues, chests, levers, the gold door and the stair up.
* The Mine Overseer is level 26 (the mines are 25). The Old Vault in Greyfang Pass is level 32 (it was 34); its six creatures stand at 26 to 32.

World map tidying
* The line "where the road began" under "The Known Lands" is gone. The drifting clouds are smaller and much more see-through. The Deeper Hollow stands north-east of the Hollow Grasslands, "The Hollow Lands" title north of it, and the Grasslands are a bigger, fuller grove.

The Ruby Maze (new)
* Behind Dorn's store in Ironhill, in the back lane, there is a plain wooden door with a sign that says STAY OUT. Tilda, Maren and Ivo say a little about it when asked "Heard anything strange?", and there are two new rumours.
* Behind it is the Ruby Maze: a true maze (about 480 squares, 30 dead ends, one way to any place), ruby red walls with gold bands, red and black tiled floors, lit by the usual torches. It is level 30 (Go to area list, in The Known Lands, and `?town=rubymaze`) and has its own place on the world map, north of Ironhill. About twenty ghosts and undead servants walk it at levels 27 to 30 (made all level 30 in 3.608); a Wraith and two Wights guard the way to the middle. A few potions lie at far dead ends.
* At the heart is a small walled garden with a fountain, flowers, bushes, trees, a bench, urns, braziers and a chest (450 gold and good things for level 30).
* Wren, a sorceress hiding from the people of Ironhill, lives there. If the party promises to keep her secret she gives the Ruby Staff (level 30, damage 58 to 92, adds 42 to spell power, one blow in four dazes). If they refuse, she gives a "gift" Red Apple that is poisoned (30 percent of health lost, poisoned, tastes of bitter almonds). Only one of the two, once. She also asks about Tobin; telling her he misses her moves her but gives no reward.
* Tobin, a young man in a blue tunic near the west end of Ironhill's main street, tells of a girl called Wren who was bullied for her magic and vanished. After the party has met Wren they can go back to him. If the party kept her secret he promises to tell no one and gives a Greater Mana Draught, once.

## 3.600

* The ruby portal: a glowing red rune stone in the maze garden, just south of Wren. Step on it, or tap it and choose Step through, and the party is carried out to Ironhill's back lane.
* The Bogeyman no longer comes on a timer. He is one creature that wanders the Underlevel corridors, drifting toward places the party has walked. He never shows on the mini map and is only a dark shape in 3D. When he is close (behind, beside or ahead) he jumps out with the full-screen scare and the fight starts at the party's level. He cannot scare in the party's first 20 seconds in the level or for 30 seconds after a scare, and waits while the party fights, talks or is in a menu. About 7 squares away behind or beside the party a line says something is breathing and a faint heartbeat plays. If the party gets away he comes back 40 to 90 seconds later, at least 25 squares away. If killed he stays gone until the next entry to the Underlevel.

## 3.601: the hand-painted world map and the wild places

* Every town, castle, abbey, cave, mine, graveyard, crypt, maze, pyramid, tower, island and ruin on the world map is a painted picture, and so are the trees, pines, mountains, hills, dunes, palms, ships and sea creatures, over a washed, hatched land. Nothing overlaps: no picture, name, title or road stands on another. Pictures are no longer faded when unvisited.
* Roads are dirt paths laid from separate painted patches of trodden earth, faint, each different and turned to follow the road.
* Ironhill Moor and the places inside it are level 31. The Burial Ground, the Golden Crypt and the Ruby Maze stand close round Ironhill with no roads drawn to them.
* The wild places (caves and old ruins in the woods) are no longer big wall boxes. Each is a small painted hill with a door set in it (wooden, stone or a dark cave mouth); in the deserts it is a pile of rocks with a stone door. More trees grow round every hill; the dead trees across the door still have to be burned. The two sides of the hill are closed.

## 3.602

* The old pen-drawn world map and its Old look button are removed, with the pen drawings of towns, castles, trees and the rest. The painted map is the only world map.

## 3.603: rivers, names, the Hollow Lands pit

* Painted rivers (made over several steps): long winding rivers with side streams, in watercolour water between hand-inked banks, wooden dams across the narrow stretches, little rowing boats and a sailing boat on the wide ones, groves of trees on the banks, a plank bridge wherever a road crosses. No round lakes, nothing repeated, nothing cut off. Where a side stream meets a bigger river the bank ink no longer runs across the other river's water, and a side stream never crosses a river.
* River colour: greyer and a little darker to match the sea; lighter, thinner ink banks; fainter ripples; the pale wash where a river meets the sea draws.
* Names and levels on the world map are smaller and stand right against their pictures; a name may stand over the faded ground under a picture.
* The Hollow Lands (Deeper Hollow, Hollow Grasslands, Orange Spire and the title) sit in a shadowed pit with a dark rim, to show they are under the ground. "Below the Abbey" stands in small writing under the title.
* All small subtitles under place names are gone, except "the golden city" under Khemetra. The faint oval blotches behind the map are gone.
* The manual PDF with the new cover was pushed to itch.io at this version.

## 3.604

* The dark coast line no longer runs across a river mouth: the river water carries on a short way into the sea and fades.

## 3.605: the iPad and the Ironhill map

* iPad (and Safari generally): after a few minutes the screen redrew, pictures disappeared and flashed and the maps went black. The game kept making new copies of its lit pictures and left the old canvases for Safari to clear later, so it passed the canvas memory limit. The cache of lit pictures now has a fixed size in pixels, and a picture that leaves it is reused or freed at once. Only the three newest area maps are kept, and when the page comes back to the front every cached copy is made again. On the desktop, canvas memory stays near 140 MB instead of growing past 230 MB.
* The Ironhill map shows a ruby diamond on the back wall of Dorn's store, named "A strange door", with a key entry.

## 3.606: the Windows app updates itself

* Five seconds after it starts, the Windows app reads `win-manifest.json` from GitHub Pages. If the version is newer it downloads only the game files whose checksum changed, keeps them, and uses them from the next start (a note on screen says when one is ready). Nothing is half applied; a failed or corrupt download leaves the old files in use; an installed app as new as the download drops the download. Only the game's files update this way; a change to the app itself needs a new build. Players on versions before this have to download this first updater build once. itch.io app users still get butler patches.
* For the owner: `tools/stamp.py` now writes `win-manifest.json`; commit and push it with every release; `desktop/prepare.js` refuses to build if it is for another version. Notes are in `desktop/README.md` and `CLAUDE.md`.

## 3.607: the itch.io page on the iPad

* The itch.io browser build asked for all of its picture packs at once. It now takes five at a time, retries a pack that fails, and names the pack if one cannot be opened. The loading error screen also shows the file, line and first lines of the trace in small writing. This is for an iPad Pro that showed "Something went wrong while loading: Type error" on the itch.io page while the GitHub Pages version loaded. The cause was not reproduced; the next step is a photo of the new error text if it still happens.

## 3.608

* Every creature in the Ruby Maze is level 30. The Undying Pharaoh has 160 health (was 100) and the Pharaoh's Servants 50 (was 30).

## 3.609

* The mini map's + and - zoom buttons hide while the inventory, menu, map or loot window is open.

## 3.610: no regenerating mana

* Mana no longer comes back by itself: the one point per step and per round is gone, and mpRegen does nothing at first. Resting and potions are what refill it.

## 3.611: mana from gear only

* Four dear rings bring mana back: Ring of the Spring (1,400 gold), Ring of the Tide (2,000, adds 10 maximum mana), Ring of the Deep Well (3,000, adds 16 maximum mana), Ring of the Archmage (4,400, adds 3 Intelligence). The Voidglass (level 60) and Godforged (level 100) armour sets give some mana back each round.

## 3.612

* Nothing solid may stand on the door square of a rock or hill wild dungeon. A pillar had blocked one in the Golden Erg even after the thicket was burned.

## 3.613: mage gear

* Eight cloth sets for the magic users, one every ten levels from 10 to 80: Apprentice, Hedge Mage, Magus, Warlock, Sage, Enchanter, Wizard and Archmage, each with a hat, a robe, cuffs and leggings in its own colours. Cloth gives little armour; every piece adds spell damage, hats and robes add healing too, and from level 50 the hats and robes give back a little mana each round (0.1 at 50, 0.15 at 60, 0.2 at 70, 0.3 at 80). Any class may wear them. They are sold in the armouries (sets up to ten levels above the party) and found in chests. The pictures are the Abbot's cloth pieces from the Pilgrim's Path, cleaned and recoloured until they have paintings of their own.
* The mage and sorcerer perks work. A few creatures (about one in nine) stand 1 or 2 levels above their place. Desert wild dungeons have no dead trees.

## 3.614: levels within an area

* In an automatic-scaling world, ordinary creatures stand 1 below, at or 1 above the level of their place (a level 40 area has 39, 40 and 41); in the Underlevel they stand at it or up to 5 above. The pick is made from the creature's own number and the place, so it is the same every time the area loads. Bosses and the great creatures are never moved. A fixed world keeps the general rule.
* The gate from the Oakwood back to Oldhaven works again (a gap in the map edge had been blocked).

## 3.615: mana potions

* Mana Draught restores 40 (was 20), Greater Mana Draught 70 (was 45), Superior Mana Draught fills the whole bar (was 80).

## 3.616 to 3.620: experience

* 3.616: an ordinary creature gives at most 150 base XP (times its level; the Mummy, the richest, was worth 6,000 at level 40 and several Hollow, sea and marsh creatures were worth many times more). A boss, mini-boss or great creature gives at most one level of XP (what the party's average level needs to go up once). Quest and story rewards are untouched.
* 3.617: tough but ordinary creatures (crocodiles, Royal Guard, the Madman and others that stand a level or more above the party) count as ordinary for the cap.
* 3.618: a creature above the party gives 6 percent more XP for each level above (at most 50 percent more), the same step as below (6 percent less per level, never below 30 percent).
* 3.619 and 3.620: the Rat King, the first boss, gave a whole level or more; he first gave about 150 XP, then was set so that a party that reaches him around level 5 gets one full level (450 XP), a party below level 5 also a full level and a party above level 5 a bit less.
* Notes: `XP_AT_LEVEL_40.md` (XP for every creature to a level 40 party) and `DAMAGE_AT_LEVEL_40.md` (damage per hit for every creature and the test party).

## 3.621 and 3.622: creature sizes

* 3.621: the ten Black Sea creatures (Toothed Leviathan, Lure Angler, Kraken Horror and the rest) had 520 to 1,500 health and bit for 24 to 48, so one bite killed a hero. They now have 40 to 100 health, damage 12 to 26 and 80 to 150 base XP, and the balance code sizes their health like any ordinary creature.
* 3.622: the ordinary creatures of the Hollow lands (the Hollow Land, the Grasslands, the Deeper Hollow and its marsh, the Underlevel, the lakes) had 5 to 20 times the health and 2 to 4 times the damage of an ordinary creature of their level. Their health now comes from the balance code and their damage is capped at an average of 13 on the base scale. The crocodiles follow the 1 below, at or 1 above rule. Bosses, mini-bosses, demons and great creatures are not touched.

## 3.623: your own hero name

* On the party screen the name box (top right) is drawn as a box with a small pencil. Click or tap it and type the hero's name, twelve letters at most. Enter or clicking away keeps it, Escape drops the change, and a keyboard comes up on a tablet. This replaces a pop-up question that did nothing in the Windows app.

## 3.624 (made, not yet released)

Mana potions in every area
* Every area now has a few mana draughts lying on the floor: one in a small den, two in a small place, three to six in the rest, by size. They lie on ground that can be walked to from the start, never by a door and never on scenery or a creature's post. The kind goes with the area's level: Mana Draught in the early places, Greater in the middle ones, and in the high places mostly Greater with now and then a Superior. Shops, houses and the open sea get none. The places are the same on every visit and in every save, and a save made before this change keeps everything it knew.

When the party dies
* The screen offers four choices: Start of this area again, Last quicksave, Load another game, and Go to menu. Enter takes the start of the area.
* The start of every area is saved (together with the autosave), and so is the start of a new game. "Start of this area again" returns to that save with the party as it came in. If a game is loaded in the middle of an area, that load counts as the start of the area. Quicksave (F5) is unchanged.

Starting weapons
* The weapons the party finds first are a bit stronger: Old Dagger 3 to 5 (was 2 to 4), Rusty Sword 4 to 7 (3 to 5), Battered Mace 4 to 8 (3 to 6), Short Bow 3 to 6 (2 to 5), Hand Axe 5 to 9 (4 to 7), Gnarled Staff 2 to 4 (1 to 3) and it adds 3 to spell power (was 2).

The Queen's Hive: a map and a rescue
* The Queen's Hive has its own handcrafted map: a honeycomb of solid wax, the chambers and tunnels floored in pale wax with small hexagon tiles and a pool of light in each, smooth hand-inked walls, the eggs, chests, jars and barrels where they stand, the lectern in the Queen's Cell under a gold crown, the way out, a key and a compass.
* New quest, Freed from the Honey: eight villagers of the frogfolk (Pibb, Granny Slomp, Thrup, Little Wibble, Mama Gloop, Old Dreb, Blep and Auntie Quibb) are tied up in honey and rope, one in each of eight chambers of the hive. Walk into one (or tap it, or press attack in front of it) to free it; it thanks the party and goes. The quest comes with the Queen's Dictionary quest from Aldous Wend (taking one takes the other, and the party is also told at the hive's door). When the eighth is free the villagers give the Amberthorn Spear (level 70, damage 88 to 120, one hit in eight stuns, a quarter of the hits bleed), 1,500 gold and 20,000 XP (doubled, as every quest reward is). The pictures are the village frogs coated in honey and roped by `tools/make_bound_frogs.py`; the spear's icon is the Barbed Chitin Spear's, recoloured (`tools/make_frogspear_icon.py`). They can be replaced by painted pictures.

Potion slots
* The two backup potion slots under the frequent use potion (in the inventory) work: clicking one drinks that potion on the chosen hero, and the potion stays in the slot. Before, a click emptied the slot and sent the potion back to the bag. A slot whose potion has run out clears itself, and a potion dragged onto a slot replaces what was there.
* The three potion slots have keys: 5 drinks the frequent use potion (as H and P do), 6 and 7 drink the first and second backup. In play the chosen hero (keys 1 to 4) drinks; with the inventory open it is the hero whose page is open. The keys show on the slots, in the help page and in the hover tip.

* Choosing a potion in the bag shows "Put in shortcut: 1 2 3": shortcut 1 is the frequent use potion, 2 and 3 the backups (an old shortcut 1 potion moves to a backup slot).

Gifts are announced
* Whatever the party is handed (by a person in a talk, in a scene, or by a quest) is printed on the screen: "Received: Antidote x2.", "Received: Ring of Vigor.", "Received: 40 gold." A quest taken also shows what it pays and any item it gives ("It pays: 160 gold, 400 XP, Hand Axe."). A thing that a line already names (a quest's Reward line, "She gives you a Cleansing Salve.") is not said twice. Things picked up off the floor, taken from a chest or bought are left as they were.

Potions
* Every potion now stacks in the bag. Nine did not (the Antidote, Cleansing Salve, Holy Water, Sleeping Tea, the Potions of Red, Blue, Green and Yellow, and the Potion of Escape) and each took a slot of its own. Singles already in a bag stay as they are; new ones join a stack.

Portraits
* The over-long chins on seven elf portraits are shortened (the blond elf with the circlet, the grey elf with the jutting chin, the dark elf, the elf with the leaf crown, the old grey elf, the hooded archer, and a little on the pale elf). The originals are kept in `ART-HOLD/portrait_chin_orig`; `tools/fix_chins.py` redoes it.
