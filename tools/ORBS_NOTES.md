# Glow Orbs, stacking lights and the split chooser (src/desert/orbs.js)

## Glow Orb
- `ITEMDEF.glowOrb`: k:'light', light 3.2 (torch 1, Brass Lantern 2.3), price 30, stack, tint [.62,.95,1.5] (a cool blue-white party light).
  The party's own light colour follows the best light held in a hand (`PARTY_TINT`, eased, applied in the 3D renderer; not outdoors by day or under the sea).
- Picture: painted `assets/icn_glowOrb.png` (128x128, a pale blue-white orb in an ornate iron and bronze cage; Canva generate-image on magenta, keyed with `tools/ingest_icon.py`). `orbs.js` loads it and sets `IMG.icn_/ic_/it_glowOrb`. The old red/blue-swapped lantern (`orbIcons()`) is only a fallback while it loads.
- Sold at: Wenlock general store and chandler (stock 12, torches stock 20), the general trader of each of the eight Deeper Hollow towns, and Marl the Hedgefoot grocer (stock 6 each). Buy price is 30 gold at neutral reputation; the sell-back rule is 40 percent times the shop's sell factor, so about 12 gold.
- Torches stack as well (`ITEMDEF.torch.stack=1`). Single torches already in an old save stay single; the Sort button joins stacks of the same kind.

## Orb frames (for the well maze)
Set `orbFrame:true` on a decor (or use kind `wm_orb`). Facing it and using it (tap, or walking into it if it has `loot:true`) calls
`orbTake(decor)`: one Glow Orb goes into the bag (weight limit respected), message "You lift the glowing orb out of its frame.", and
`orbFrameEmpty(decor)` runs. Optional fields: `emptyK` (the decor kind to switch to once empty, for an empty-frame picture), `orbColor` (unused so far).
- `orbFrameEmpty(decor)` sets `orbTaken`, `lit`, `glow`, `light` to false and switches `k` to `emptyK`, puts out any level light standing on the frame, and stores
  `G.flags.orbTaken[LEVEL+':'+x+','+y]=1`. The flag is saved with the game, and frames are re-emptied whenever a level's scenery is rebuilt or a save is loaded.
- Decor with `npc` is handled too (startTalk is hooked the same way).

## Split chooser
Shift+click on a stack in the bag (any item with `stack`: torches, orbs, potions, food) or the "Split the stack" button on the item card opens a small amount chooser:
minus, plus, 1, Half, All, Take, Cancel. Keyboard while open: arrows or + and - change the amount, Enter takes, Esc cancels, Home 1, End all.
The chosen amount becomes a new stack right after the original and is selected, ready to equip, discard or give. Needs one free pack slot.
Not covered: the loot and shop window (selling still sells one at a time).

## Orb frame art (well maze)
`assets/glow_orb_frame.png` (lit, 392x578) and `assets/glow_orb_frame_empty.png` (392x578, same anchor as the lit one; painted in Gemini from the lit picture as reference: 'same cage, strict front elevation, EMPTY, flat magenta', keyed with `tools/ingest_orbframe.py <src.png> glow_orb_frame_empty`; the older version made by erasing the glass is gone). `orbs.js` wraps `wmOrbArt()`: when both are loaded it builds `IMG.wm_orbframe0..3` by hue-shifting the glow to each floor colour (`WM.ORBS`) and uses the empty picture for `wm_orbframeE0..3`. Behaviour of orbTake / orbFrameEmpty is unchanged.

Checked 29 Oct: orbTake on all four floors (amber, violet pink, cyan blue, emerald green) shows the empty painted cage matching the lit one; the Glow Orb icon shows in the inventory bag. No glow-pulse variants were made (the game does not need them). Gemini receiver tip: fetch from the Gemini page to localhost is blocked, use the postMessage receiver window (tools/mg_recv.py) opened by a real click.
