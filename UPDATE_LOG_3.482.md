Below the Abbey: changes since update 3.460 (20 October 2026, 10:53) up to 3.482 (21 October 2026, 05:50)

The last update log on GitHub is UPDATE_LOG_3.460.md, committed on 20 October 2026 at 10:53 (commit 376910c, version 3.460). Everything below was added after it, in 22 versions (3.461 to 3.482).

The four cities of the Hollow Grasslands (new)

* Exsce, Ulb, Glorm and Nibb are now four large, strange, shell-like cities with vertical streets, entered through gates in the grassland wall. Each has its own look: Exsce is a spiral of conservatories and fish tanks, Ulb a city of looms and reeds with a long cascade, Glorm a bazaar built around a wide stair, Nibb a bell tower hung with lanterns.
* Towers and stairs to climb, sunken houses and cellars reached by stairs going down, stairs that go nowhere, walk-through tubes, pools you can wade into, and lookouts with views over the roofs. Nothing stands on the narrow stairs.
* Pools are deep water: diving needs Bubble Helms. The way out is always the teleport back to Yarrim.
* More than 100 rooms behind doors in the four cities (Exsce 33 doors, Glorm 52, Nibb 21), each with its own layout, floor and furniture, plus second rooms behind them. Interiors have partitions, windows, inlaid floors and lamps.
* Two mazes in each city (a Grand Maze and a second kind), each with a lit gate and a runner leading in from the street, four tall gold spires round the centre, its own wall style and a reward at the centre. The other mazes were turned into garden courts. HGT_MAZE_ALL=true in hgt_maze.js brings them all back.
* Sphere rooms (a room full of coloured spheres that move when you walk in) and star rooms (dark rooms lit by glowing stars), a Pearl Pool with a vaulted ceiling and chandeliers, a Ball Pit and a Star Stair.
* Large fish tanks with fish swimming in them, including a run of box tanks and a deep tank in Exsce and the Tank Walk fish wall in Ulb.
* Vines grow on the walls of Exsce. New walls with circles, dots and doodles, new floors and inlays, and no visible seams between the textures.
* Round coloured lamps (purple, green, blue, orange, yellow, white) that light up at night and go out at dawn, with wall-mounted lamps, hanging lantern rings, glitter plants and light pools on the stair feet.
* A day look and a night look for each city, a painted far skyline with soft edges, low clouds, and fill lights in dark places.
* Tower tops, balconies and lookouts are furnished with benches, plants, lamps, banners and a roost for a pet.

Life in the cities (new)

* About 100 to 140 people and creatures in each city: people who sweep, garden, read, fish, tend plants and walk the streets, and neutral pet-like creatures (part fish, part insect, part alien) that do not speak. They walk, sit, hover and rest, and never stand on the narrow stairs.
* People and small creatures walk with a bob, a squash, a sway and a mirror swap on each step. The walking and idle animations are slowed to about half speed in the latest version. Small creatures stay readable in the evening.

Giants and the sky (new, 3D)

* A 3D renderer for creatures and objects: tall spindly stilt-walkers, bulk giants as tall as a building with large painted faces and glossy eyes, winged creatures, giant peacocks about five metres tall, dragonflies and moths at eye level, angelfish with trailing fins, and flying leviathans (whale, manta, eel, jellyfish) with painted faces.
* Mini planets and low clouds drift through the cities. A large scorpionfish with ornate fins and leviathans fly across the horizon, visible inside and outside the cities.
* The Hollow Grasslands have their own moon, a vast textured object that comes out at night, comes unnaturally close to the ground and glides very slowly across the grassland. It does not collide with any creature.
* Sleeping giants lie in the plazas with closed eyes, a tilted head and a slow breathing bob.
* The Exsce giant reserve: a large walled lawn south of the spiral (38 by 19 cells) with ponds, terraces with fountains, trees and glowing plants and five wide gateways. Exsce's bulk giants, stilt-walker and peacocks live in it, at least 11 cells apart.
* Look up and down: Page Up and Page Down tilt the view up to about 36 degrees up and 12 down, Home levels it, and the right stick tilts it too. On a lookout the view tilts up a little by itself.
* Peacocks no longer vanish when you walk up to one. Big creatures no longer flash in and out: the hard cut-off distances became smooth fades and the frame-time budget no longer drops whole models.

Orrim's shop and speed shoes (new)

* Orrim, the bubble-seller, stands near the south gate plaza of Exsce. He sells Bubble Helms (big glass bubbles that let you breathe under water for four minutes) and Swift Shoes (+20 percent walking speed in the hollow lands, not cheap).

The grassland tongue (new)

* All dialogue in the Hollow Grasslands and the four cities is gibberish, in the style of the town names (for example "graxc scesx e rcene do xionacn"), until all four of Aldous Wend's book quests are handed in. Villager quests only open once the fourth book is in.
* Common words have fixed hollow words, so "I", "city", "house" and "work" always look the same. 245 words are fixed.
* Ask about a word: once you have met a hollow word twice, people offer "Ask about a word." You pick its meaning from three choices. A learned word is always shown in plain English inside the gibberish from then on.
* A new "Grassland Tongue" page in the menu lists the words you have learned and how many you know.
* The Hollow Grasslands intro text now sends the party to the great shell gate in the wall.

Menu and graphics

* Painted stone menu buttons in 25 styles (sandstone, gold, winged, filigree, ruby, dark green, dark brown, turquoise, rough stone and more) with iron lettering, and 30 medieval fonts. Rough stone is the default.
* The button style and font options moved from the Gameplay page to the Graphics page.
* Water and step messages in the terraced cities are short ("Too deep.", "Too high to climb.", "Too steep to climb down.").

Torches

* The wall torches are now painted, worn and old, in a warm brown, with the flame sitting on the torch head. They replace all the drawn torches. A torch item icon was added. A variant with a long side brace was removed.

Performance and technical

* The terraced floor and wall drawing is 2 to 5 times faster. Sprites narrower than 24 pixels draw with cheaper smoothing, off-screen sprites are skipped before sorting, and meshes that come out empty are not retried every frame. Far floors fade to a coarse copy of their pattern so nothing streaks at the horizon.
* The itch.io browser build packs the pictures into 40 stable packs, so an update only changes the packs it touches (small downloads with butler).
* Windows app (Electron): per-user install with no administrator rights, a first page that explains the Windows protected-your-PC screen, and loading text that shows percent and megabytes.
* New files: butler push scripts (tools/push_itch.py, get_butler.py), ITCH.md and release instructions in CLAUDE.md. Standing rule: every release goes to GitHub, to itch.io html5 and to the Windows channel together.

Known gaps

* The Exsce reserve is smaller than first asked (38 by 19) because a larger one would have removed the spiral and the court.
* Shadow ovals under some prop pictures are part of the painted sprites.
* The peacock fan edge is still a little jagged.
* The cities are heavy: the busiest views cost 13 to 17 ms on the test machine.
