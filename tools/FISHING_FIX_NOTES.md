# Fishing fix notes (rod in the hand, bait on the rod, spots through objects)

Status: PAUSED on the owner's word. No game file has been changed yet. Only the investigation is done.

## Owner's reports
1. "the rod isn't equipping on a member. And the bait should have an option to 'add to the rod'"
2. "the fishing spots are appearing through objects, like the pier. make sure it is only on the water and doesn't appear through other items."

## Done: the cause of report 1 (reproduced in the live game, Wenlock, Hazel Rod)
- The rods are ITEMDEF kind `k:'tool'` (fishing_data.js line 58). The core `slotFits()` (index.html, top part) accepts no 'tool' in any slot, and `autoSlot()` returns null for it.
- What the player sees:
  - Equip button on the rod's card, or the E key: "Only a Mage or Sorcerer can use spell scrolls." (the `iequip` branch of `invBtn` prints that whenever autoSlot is null).
  - Tap the main or off hand slot with the rod chosen, or drag it to a slot: "That does not fit there."
  - Drag it onto another hero's portrait: nothing happens and no message.
- Baits are `k:'quest'`, so their card has no action button at all (only Discard and Store). E on a bait also says the spell scroll message.
- Fishing itself only looks in the bag: `fshBestRod()` in fishing.js (a const arrow, so it must be edited in place, it cannot be wrapped from another file).

## Done: the cause of report 2
- fishing.js draws the spots in a `drawWorld` wrapper AFTER `drawSprites`, as a screen overlay. Its column clip only knows walls (zbuf) and hills (YB), not sprites, so every boat, post, crate and person in front is painted over.
- Each spot is three dark rings of radius 1.0, .78 and .55 squares round the water square, so it spills two squares wide onto the bank and the pier.
- The Wenlock list `fshAddSpots(496, [[67,84],[68,84],[69,84],...])` predates the pier: (68,84) and (69,84) are now pier planks (wenlock_river.js, floor slot 5) and (67,84) is under the rowing boat. In `fshSpots`, a plain `{x,y}` spot skips the water test because of `||q.water` (q.water is always set), so these spots stay on the planks.

## Remaining: planned fix (not started)
1. New file `src/desert/fishing_rod.js`, added to tools/inject.py ORDER just before `jump_ready.js`:
   - wrap `slotFits` (a rod fits only 'main'), `autoSlot` (a rod goes to 'main'), `equipTo` (a clear message for a wrong slot; remember the replaced main hand item in `G.flags` so Unequip can put it back), `unequip` (restore that item if it is still in the bag).
   - A hero holding a rod fights bare-handed (heroWeapon is null, so unarmed damage and 10 percent less to hit, as with a torch); wrap `heroAttack` so the line reads "swats the X with the Hazel Rod".
   - Bait card: an 'Add to the rod' button (same place and size as the bottle's Read button, about 338,140,112,22), also on E. It sets `G.flags.fishBait` (what `fshBaitNow` and the Bait button already use), message "You fix a worm to the line of the Hazel Rod.", and "You need a fishing rod first." when no rod is held or carried. A second press could offer 'Take off the rod'.
   - Show the rod: the paper doll's main hand slot already shows it once it can be equipped; add a small rod badge on the portraits and a line on the character page.
2. fishing.js line 58: `fshBestRod` returns the best rod held by a hero (any hand slot), else the best in the bag as before.
3. Spots: draw them as custom sprites in `spriteList` (pattern: `hltCustom` and `hltDrawDecal` in hollow_traps.js, injected near index.html line 23036), so the depth sort and zbuf apply; small ripple ring and bubbles kept inside the one water square; keep the YB hill clip; let `viewTap` skip a spot when a nearer decor hit covers the click; remove the overlay call from the `drawWorld` wrapper (keep `fshRod`).
4. In `fshSpots`, check every spot: water floor (FSH_WATER or HGD '6'), open square, no visible decor on it; otherwise move it to the nearest open water square next to a standable square, or drop it. Find how the sea levels (yarSea, 290, 304, 330 to 343) mark water before applying the check there.
5. Saves need nothing new: the held rod is in `h.eq`, the bait is `G.flags.fishBait`.
6. Verify (one browser at a time, own server on 8351): all five rods on different heroes, unequip, each bait, a cast and a catch, save and reload, no console errors; screenshots of the Wenlock pier and three other places. Note: the game takes about four minutes to load here, and the plain http.server refuses some picture requests under load (ERR_CONNECTION_REFUSED in the console; these come from the test server, not the game).

## Test script
The reproduction script is in the session scratchpad (`repro.py`); it adds `fishrod_2`, tries Equip, slot taps, drags and E, and prints the messages above.
