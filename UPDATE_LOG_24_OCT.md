# Below the Abbey: today's updates (24 October 2026)

Versions 3.607 to 3.624. Versions 3.608 to 3.622 were made in another session (the balance work) and are described from their commits and files.

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

## 3.624

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

* The creatures of the Hollow Grasslands and the hives are slower: the fast ones (the swarms) take one step instead of two, and every step, blow and shot waits a little longer.

* The Hollow Grasslands have thirty small rock nooks (rock on three sides, open on one) set about the open ground, away from villages and hive doors: stand in one and only one creature at a time can reach you in melee.

* In all four hives the language book now lies on its lectern, which glows gold so that it can be seen down the tunnels. The lectern can be walked onto and the book is taken from it.

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

## 3.625
- The priest's Heal costs 3 mana (it had grown to 9).
- The Gravewarden's Mace is stronger: damage 6 to 11 (was 4 to 8), a little easier to hit with, and the double blow comes 16 percent of the time (was 12).
- A very slow mana trickle is back: every fifth step the party walks gives each living hero one point of mana (or stamina). Only walking gives it; waiting, resting in place and fighting do not.
- Mana potions now lie only in areas that have creatures in them (80 of 207 areas): none in shops, houses or the towns.
- Every area map now shows the quest givers: a gold ! over each person with a quest to take and a green ? over each person a finished quest can be handed to, with their name beside it (names that would overlap are moved). On the Thornwick map this shows Goodwife Edda, who gives the Rat Catcher quest.
- New: Under the Well. A well stands in Thornwick, seven squares west of Goodwife Edda (29,17), kept clear of every door. The well asks "You look into the well and hear scratching sounds far below. Do you descend?" (Descend or Not), whether tapped or stepped on.
- Under the well is a small windy maze of grey-blue brick with the eight rats of the Rat Catcher quest (levels 8, 9 and 10). A chest waits at the dead end that is the longest walk from the stair, and one potion lies in another dead end. It has its own little hand-inked map and is in the Go to area list. Start link: `?town=thornwickwell&lvl=34`.
- Edda now tells the party to go down the well because the rats like water; the quest text says the same.
- Power Move: a character with no mana or stamina for their power now passes the turn to the next character who has not acted, instead of staying stuck.

## 3.626
- Battle buttons moved: Camp is now the top small window to the right of the power move, and Wait is under it. The weapon swap windows that stood there are gone (change weapons in the inventory).
- The second and third potion shortcuts are now on the right-hand side, where Wait and Camp were (keys 6 and 7). The first potion stays below them (key 5).
- Food can go into the three shortcut slots as well as potions (select it in the bag, "Put in shortcut").
- Arriving somewhere by a door or a cave mouth can no longer leave the party walled in: if the party is in a small pocket of trees or rocks, the shortest line of scenery out of it is opened. Nothing is regenerated.

## 3.627
- No two creatures can stand on one square, and none can stand on a person (NPC): a move onto an occupied square is undone, and creatures that spawn or load on one are moved to the nearest free square after every round, on arrival and on loading a save.
- Power Move: the skip to the next character now works whenever the game says the character lacks the mana or stamina, whatever kind of power they have.
- House doors keep away from shops and exits: in Oldhaven and Yarrim, any house door within 4 steps of a shop, inn, hall, chapel or exit is closed up into the plain wall of its building (6 houses in Oldhaven, 5 in Yarrim). Thornwick, Ironhill and Anaea already kept them apart. Khemetra (about 20,000 door squares, interiors built on demand) was not checked.
- The Ruby Maze back door in Ironhill moved from 20,24 (3 squares from Dorn's store) to 33,24, 6 squares from every other door. The STAY OUT sign and the map label moved with it.

## 3.628
- The icons on the world map are bigger (2 times their old size, from 1.2). The layout re-places every name so nothing overlaps.
