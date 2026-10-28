# Powers retune: where it stands (work paused by the owner)

Nothing is committed, no version bump. The game loads: `python tools/inject.py` was run last, `node --check` passes on `src/desert/powers_scaling.js` and on the main script of `index.html`. My http server (port 8357) is stopped and no browser of mine is open.

## What is done

- `src/desert/powers_scaling.js` (listed in `tools/inject.py` ORDER just before `jump_ready.js`) retunes every damaging power of the 12 classes and the bought spells with one rule
  (damage = cost x e x U x g, see the header of the file). Parameters now: K .002, KL .001, GT .4 (area per foe), GE .75, TAPER .15, E per class, CM per class (small correction from the fight simulations).
- 23 new powers (all learned by level, kept in the ladder by level): Warrior Skullsplitter 50, Worldsplitter 80; Barbarian Skull Cleaver 50, Mountain's Wrath 80; Paladin Righteous Blow 50, Sunbrand 80;
  Ranger Heartseeker 60, Killing Shot 80; Archer Starfall Shot 80; Thief Shadowstrike 70, Moonless Kill 80; Assassin Needle in the Dark 70, Reaper's Kiss 80; Mage Arcane Ruin 60, Starfall 80;
  Sorcerer Soul Rend 60, Annihilating Ray 80; Priest Hallowed Fire 50, Sunlance 65, Dawn of Judgement 80; Monk Fist of the Mountain 70, Hundred-Fold Palm 80; Goat Avalanche of Horns 80.
  The Barbarian class stun "Savage Roar" (level 40) became "Thunderous Roar" (fear and curse). Warrior class Shield Wall is stronger (+8 armor, 10 rounds, cost 18); costs of Battle Standard, Blood Frenzy, Avatar of the Bear lowered to fit their lines.
- Saves: the Special power selection is moved to the new list order once, flag `powOrder` (saved in G.flags). Tested with a save made in the old order.
- Cards now say the real number ("About N damage for Hero at level L."); the spell shop uses the shop hero; with a long ladder the Powers page now shows the cost at the right end of each active row (wrapper of `drawPowerLadder`).
- Harness in `tools/powers_audit/`: `audit.js` + `run_audit.py` (expectation mode, no dice), `analyse.py` (rules and flags), `fight.js` + `run_fight.py` (dice) and `run_expected.py` (smooth), `cmp_fight.py`, `cmp_expected.py`, `shots.py`, `report.py`, `inventory.js` + `dump_inventory.py`, `run_before_fights.sh` (builds without the patch for the "before" numbers), `run_all_after.sh`.
- Results so far: the old numbers had 314 flags (bargain 142, trap 115, later power not dearer 20, later power weaker 17, ladder ends early 12, description mismatch 7, no level scaling 1). The last full audit of the new numbers had 0 flags (it was run before the CM and KL change).
- `POWERS_BEFORE.md` was written (regenerate with `report.py` after the steps below; the method paragraph changed).
- Smooth balance check with the final parameters (`expected_after.json` is current): mean change in rounds to kill -4.9 percent, shortest -36, longest +20. Level 60: Warrior/Thief/Mage/Priest -20/-16/+7 percent for 1/3/6 foes, Barbarian/Archer/Sorcerer/Paladin -32/-18/-17, Ranger/Assassin/Monk/Goat -8/-8/0. Outliers: level 50 of the second party (-31, -26) and level 80 (-35 to -16, but fights there last about one round already).

## What remains

1. Start `python -m http.server 8357` in the repo root, then `sh tools/powers_audit/run_all_after.sh` (audit, inventory, expected, screenshots, one browser at a time) to confirm 0 flags with the final CM and KL numbers. `raw_after.json`, `inventory_after.json`, `fight_after.json` and the shots in `shots_after/` are from earlier parameters and are stale. Optionally `python tools/powers_audit/run_fight.py after` (dice, slow) and `python tools/powers_audit/cmp_fight.py`.
2. If the level 50 and level 80 outliers matter: lower GE a little or the efficiency of the top rungs. The flatness band is nearly used up at level 80 (worst line deviation +18.7 percent, the limit is 20), so TAPER cannot grow.
3. Write `tools/powers_audit/balance_note.md` (report.py appends it): what was tried (GE 1 gave -19 percent mean, -50 worst; TAPER .25 broke the 20 percent rule; final GE .75, TAPER .15, CM per class) and the outliers above. Then `cd tools/powers_audit && python report.py` writes `POWERS_BEFORE.md` and `POWERS_AFTER.md`.
4. Look at the new screenshots: the icons of the new spell-type powers (made by `pwTintIcons`, depends on `mxTintIcons` running after the pictures load) and the cost at the end of each ladder row.
5. Delete scratch files: `explore.py`, `fight_after_ge100.json`, `fight_after_ge1_oldpolicy.json`.
6. Not touched on purpose: heal powers and spells (`heal_scaling.js`), the scroll "Spell" of the mage and sorcerer, no cooldowns exist in this game.
