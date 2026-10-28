# The last part of the game: the plan (from the owner, 29 Oct 2026)

Written down so that every later session builds the same thing. Status: design only, nothing below the Wenlock seals is built yet.

## The shape

1. **Wenlock (built, level 80 to 84).** The mayor says the west gate was shut years ago by the Road Wardens. Three Warden's Seals open it: one from under the well, one from the Witch's Wood, one from the graveyard. Each carries the Pale Sovereign's silver mark. Quests wk4 to wk8.
2. **The Blighted Lands (to build, level 90).** Beyond the west gate the Pale Sovereign's influence has blighted the land. Hilly dales, corrupted crypts, gothic farmhouses, unholy churches, undead walking the roads and streets. The party travels through this countryside towards the town of Sale.
3. **Sale (to build, level 90).** A grim, gothic town full of undead. Sheltering in it is a figure who can unlock the dimension of the Pale Sovereign.
4. **The Pale Lands (to build, level 100, the last part).** A dimension further west where the Pale Sovereign lives in the Pale Spire, a vast castle the party must conquer. They climb to the top, face the Pale Sovereign, and heal the Pale Lands and the whole continent of the plague of corruption.

## Blighted Road level ids and conventions (set 29 Oct 2026, shared by every builder)

* Place n (1 to 10 in road order) has its main level id 9600 + 10*n (9610 Toll House, 9620 Ashenfold Farm, 9630 Church of the Hollow Saint, 9640 Gallowmere, 9650 Bone Orchard, 9660 Lanternrest, 9670 Vault of Maldrake, 9680 Hollowbell Abbey, 9690 Rookery Mill, 9700 Pale Bridge and Gate of Sale), and its sub-levels (interiors, cellars, crypt floors) use the ids base+1 to base+9. (9700 to 9709 is the Gate of Sale; Sale town has its own range chosen by its builder.)
* Region name 'The Blighted Lands'. Ratings: 1 Toll House 84, 2 Ashenfold 85, 3 Church 86, 4 Gallowmere 86, 5 Bone Orchard 87, 6 Lanternrest 87, 7 Vault 88 to 89, 8 Hollowbell 88, 9 Rookery 89, 10 Pale Bridge 90.
* Each place is its own map. Each has a west exit leading to the next place on the road and an east exit back to the previous one (the Toll House's east exit leads back to Wenlock's west gate, Wenlock (496) arrival square near its west gate; the Pale Bridge's west exit leads to Sale). Register every level with KH_LAZY stubs so saves load, with one shared table BL_ROAD in src/desert/blight_road.js (id, name, level, east link, west link, built flag) used by the world map and the road.
* Look: gothic and blighted: dead grass and bare trees, grey-green sickly light, fog, black crows, tilted gravestones, ivy-choked walls, pale lamps; sounds: wind, tolling bells, crows (reuse existing samples). The finish must match Wenlock's (named signs, lettering on boards, lamps, props, ambience, quests, NPCs, interiors); a critic pass checks it.

## Decided (owner, 29 Oct 2026)

* The figure sheltering in Sale is Wren and Aldous Wend together: they have formed a pact. (What the pact is, and why they are in Sale, is still to be written.)
* The Blighted Lands are a ROAD OF LINKED AREAS of increasing level (about 84 up to 90), in the style of the Pilgrim's Path: farmhouses, crypts, churches and undead villages as places along the way, ending at Sale.
* The Pale Spire is a BIG MULTI-LEVEL CASTLE like the Orange Spire (many floors, climbed to the top, the Pale Sovereign at the summit).

* Sale has shops, but each is barricaded in. The party must earn each shopkeeper's trust with quests (collect supplies, kill certain creatures, rescue certain people) before the shop opens. Every shop gets its own trust quest(s).

## The Blighted Road: ten places (proposed 29 Oct 2026, awaiting the owner's yes)

A big winding road west from Wenlock's west gate to Sale, in linked areas of rising level (84 up to 90), with side tracks, milestones that count down to Sale, grave markers and a plague cart. The places, in road order:

1. **The Toll House of the Road Wardens (84).** The first blighted ground just outside Wenlock's gate: dead hedges, the Wardens' toll house (ties to the three seals), a ruined wayside shrine.
2. **Ashenfold Farm (85).** A gothic farmhouse where the dead farm family still sit at supper. Scarecrows that walk. Barns and a cellar.
3. **The Church of the Hollow Saint (86).** An unholy church: inverted bells, a choir of the dead, a priest who will not stop preaching.
4. **Gallowmere (86).** A drowned fen village with gibbet trees, bog bodies and wisps, reached by a causeway.
5. **The Bone Orchard (87).** Orchards of white trees fruiting skulls, a field of crypts, and the Reaper-Farmer who keeps the harvest.
6. **Lanternrest Waystation (87).** A walled coaching inn that is the one safe place on the road: living refugees, a teleporter, a shop, quests.
7. **The Necromancer's Crypt: the Vault of Maldrake (88 to 89).** A multi-floor crypt under a hill of barrows; Maldrake, the necromancer who took the Sovereign's silver, keeps the key to Sale's gate.
8. **Hollowbell Abbey (88).** A ruined monastery of undead monks and a plague bell that tolls the dead up (ties to Brother Sevrin).
9. **The Rookery Mill (89).** A windmill and a court of crows that watch the road for the Sovereign; a crow queen.
10. **The Pale Bridge and the Gate of Sale (90).** The last bridge before Sale, held by a pale knight, with Sale's outer wall and gatehouse beyond.

**Decided (owner, 29 Oct 2026):** the ten places are approved. Maldrake (the owner wrote 'Mandrake'; spelling to confirm, we use Maldrake) is a SAD former wizard who was conned by the Pale Sovereign into wreaking havoc on his own people; he is not a plain villain (the party can end it with sympathy as well as a fight). EACH PLACE HAS ITS OWN MAP (separate levels linked along the road, not one long map).

**Added by the owner (29 Oct 2026):** a garrison of soldiers sent from Oldhaven (King Osric's men) is somewhere on the road. Suggested home: Lanternrest Waystation (place 6) as their fort, or a separate Oldhaven Outpost between places 5 and 6. They are cut off, short of supplies, and want help; they can give quests, sell army gear and keep the road clear around them.

**Decided (owner, 29 Oct 2026):** the Oldhaven garrison is Lanternrest Waystation itself (a walled fort: gate, tents in the yard, refugees behind it; army gear shop; supply, rescue and kill quests; the captain knows Wren and says she passed with Aldous Wend towards Sale).

Sale is the furthest town west; beyond it lie the Pale Lands.

## Open design questions (not answered yet)

* What is the pact between Wren and Aldous Wend, and what does Sale's unlocking of the Pale Lands need from the party?
* Is the Sovereign killed, redeemed, or both (heal the land by defeating him, or by restoring him)?
* How are the Violet Tower and the Orrery used?
