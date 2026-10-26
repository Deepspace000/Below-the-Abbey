# The Black Swill and the way west: notes for the next session

Code: `src/desert/blackswill.js` (last in `ORDER` after `padbind.js`; the garden and Wenlock agents add their own files after it). Shared numbers: `src/desert/wk_ids.js` (`WK`, `wkMet`).

## What exists
- Quest `bsw1` (The Black Swill) is given by Cinder (`hgd_cinder`, file `hgd_minis.js`) once `hgsph` is done. His root function is wrapped; `QGIVER.hgd_cinder` is `['hgsph','bsw1']`.
- Boss `bsw` (assets `ds_bsw.png` idle, `ds_bswA.png` attack, both Gemini paintings on magenta cut with `tools/ingest_sprite.py scale=1.0`) and `bswslime` (reuses the darkened Underlevel slime picture `hgu_hgusl2`).
- Chamber: `bswChamber(L)` runs after `hgduBuild` has built the sea (hook on `hgduBuild`). It widens the big central island (`L._hgdo.island`, currently at 137,117) into a round chamber of radius about 9.6 with six pillars, moves the great chest (5,000 gold) to the north shore, puts the boss in the middle, and moors an extra boat at the south shore (`L._bsw.boat`, index `L._bsw.boatIdx` in `L._hgdo.boats`, which `hgoSyncBoat` pairs with the n-th `yar_boat_row` decor). `L._bsw` = `{cx,cy,R,pillars,landing,boat,boatIdx}`.
- Fight: health 850 base, 26,353 at level 80 before the 850 change (about 32,000 now), bite `[5,8]` base (about 160 to 256 per bite at level 80), splits up to 3 slimes at every 10 percent of health lost, spits at heroes 0 and 1 every 4th round (about 1.15 x a bite, 'poisoned'), mends 0.25 percent of its health per round while it is alert. The in-game fight estimate says Deadly, about 55 rounds. Tune `ENEMY_DEF.bsw.hp` and `dmg` at the top of the file.
- Death: `bswDied` sets `G.flags.bswDead` (saved), pays the drop (Swillhide Mantle, 3 x potion6), plays `CUTS.bswDead`, then `bswEnd` turns in `bsw1`, patches the surface (gate and Aldous), clears the vermin within nine squares of the gate and puts the party at the gate foot of level 475. An update hook removes any `bsw` still alive when the flag is set, so it never returns.
- Surface gate: `bswSurface` writes a door tile into the north wall of the top atrium (row 1, `bswGateCell()`), painted `ds_tex_bsw_gate.png`, and places Aldous (`bsw_aldous`, quest wk1). Walking into it asks and then calls `goToLevel(WK.GARDEN, WK.GSTART)`. `bswGateFoot()` is where the party should stand when it comes back from the garden.
- Quests `wk1`, `wk2`, `wk3`; `wkMet('garden'|'wenlock'|'mayor')` completes them in order (and catches up the earlier ones). Flags: `wkGate`, `wkGarden`, `wkWenlock`, `wkMayor`.
- Story pages `bsw`, `bswdead`, `wkgate`, `wkmaze`, `wenlock`, `wkmayor` and the `storyNext` lines are in the same file.
- Map: while `bsw1` is active (or `bswKnown`) the Underlevel overview (view 5) and the mini map show a pulsing gold ring, a skull and, on the overview, a dashed line from the first dock. The overview shows the whole level already (it is not fog of war), so "reveal" means the marks.
- Test link: `?town=blackswill&lvl=80` (island south shore, quest active, potions in the bag), `&dead=1` for the surface at the gate. Edits in `index.html`: the `lvl` clamp in `jumpFromUrl` allows 80 for this link, and `AREAS.blackswill` is a getter calling `bswSpot()`.

## Weak spots
- The Underlevel is nearly black; the boss shows because of its `glow`. A lit chamber (red braziers) would look better but needs art.
- Arrival: a boat must be found first. The nearest boat to the first ladder is the dock boat (`docks[0]`).
- Saves made mid-fight lose the boss's health (the game does not keep enemy health).
