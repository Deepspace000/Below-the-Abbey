# Pale Spire, third floor: plan for the Observatory Gallery and the boss

Status at 3.839: the Hall of Mirrors (9880), the Observatory Gallery (9881) and the boss, The Sovereign's Reflection, are BUILT in `src/desert/ps_f3_observatory.js` (star-chart pin puzzle, telescope, Astronomer quest psq41, Shield of the Last Reflection, stub stair to the Moon Tower 9890). The text below was the original brief. Still wanted: painted art (see the last section; stand-in pictures are used now). Read it, then `src/desert/ps_f3_mirrors.js` and `src/desert/ps_f2_dream.js` (the floor 2 boss, the model to copy).

## What exists

- `src/desert/ps_f3_mirrors.js`, injected after `ps_f2_dream.js` (see `ORDER` in `tools/inject.py`). Level 9880, 56 x 40, indoor, rating 106, built with `pspMake`. Flags in `G.flags.psp.f3` (`psf3F()`): `m` (mirror states a to d), `beam` (crystal lit), `hidden`, `seen`.
- Rooms: Entry (arrival at 28,36), Hall of Mirrors (nave, x20..36, y8..29), Beam Room (east), Court of Glass (west, hidden closet through the maiden's mirror), Silvered Alcove (rest room), Reliquary behind the Silver Seal.
- The stair at (28,8) is an `alcove_knight` decor with the npc `psf3_stair`. It only says "THE OBSERVATORY GALLERY IS NOT OPEN YET". This is the hook for the next part.
- Links: `PSP_L(9820,null,9880,[28,36,0])` (the swirling door of floor 2) and `PSP_L(9880,[28,38],9820,[50,5,3])` (the way back). Both are real (no `prov`).
- Party positions in a level must be WHOLE squares. `f2MoveTo([x,y,f])` with a fractional x or y crashes `cellBlocked`.

## Part A: the Observatory Gallery

Theme: floor 2 was dreaming, the Hall of Mirrors is about looking at yourself, the Observatory is about looking OUT: star charts, brass instruments, a telescope. Plain, literal text only (see the user's "plain game text" rule): no cryptic or poetic descriptions. No em dashes anywhere.

Level: a new id. Check `src/desert/ps_ids.js` (`PSP_LV` rows, `F3:9880`, `MOON:9890`) and use a free id near 9880, for example 9881, rating 106 to 108, indoor, about 60 x 44. Add it with `PSP_LV(...)`, register it with `pspRegister(id, builder)`, and add the links:

- Hall of Mirrors north stair (28,8) to the Observatory (replace the `psf3_stair` decor with a real door via `pspPortal`, gated by a flag, see below).
- Observatory south door back to the Hall.
- Observatory boss-room door onward (see Part B) and a stub for the fourth floor (`prov:1` links get the "not open yet" cairn room for free).

Contents (all of these are suggestions, pick what is fun):

1. The Star Chart puzzle. A gallery of star maps and brass instruments. Reading constellations in the right order unlocks the way on, like the body parts on floor 2. Make it a real mechanism, like the beam puzzle (`psf3Trace`): a pure function from flags to "solved", with plain text feedback that says what changed.
2. The Telescope. Looking through it shows the Sovereign's tower from outside and reveals doors that cannot be seen without it. Implement as an npc on a prop that sets a flag, then `psf3Apply`-style code that unhides a decor/door (copy the `psf3_seal` pattern: `d.hidden`, `d.found`, `d.block`).
3. The Astronomer: a ghostly NPC (`khNpc`) who explains what the Sovereign has been watching for and gives a quest. Use `yrQ('psq4x', ...)` and `blGiveOpt` like `psq40` in `ps_f2_hub.js` (quest area is `QAREA`/`PSP.REGION`, add a `QRF.T` entry so the green ? and gold ! marks work).
4. A cutscene when the telescope is first used (`CUTS.psScope` + `startCut('psScope')`, see `ps_f2_dream.js`).
5. Four to six new enemy types: mirror shades, star wraiths, a brass clockwork guardian. Define with `pscE(id, {...})` (see `ps_court.js`), add to `NO_VARY` if they are unique, `AFFL_HITS` if they curse. Reuse `f2shadow`, `f2hound`, `f2hands` where art is missing. Keep counts modest, as in the Hall (8 creatures).
6. Two or three small side rooms with lore plaques and one optional chest each. A rest room (`pspRest`) near the entrance.

## Part B: the boss, The Sovereign's Reflection

Model it on The Sovereign's Dream in `ps_f2_dream.js`. Read that file first; the pieces are:

- Enemy: `ENEMY_DEF.psreflect = pscE('psreflect', {img:'ps_psreflect', ph:2.5, name:"The Sovereign's Reflection", hp:..., dmg:[..], hit:.9, xp:..., boss:true, aboveParty:0, gold:[0,0]})`. Also `NO_VARY.push('psreflect')`, `BOSS_GOLD.psreflect=[...]`, `AFFL_HITS`.
- Art: the Dream used a tinted Sleeper sprite (`f2Tint(newKey, srcKey, filter, overlay)`). The Reflection should have proper painted art (Gemini, STRICT FRONT ELEVATION, full length, see CLAUDE.md). A mirrored, silver-and-glass copy of the Sovereign. Interim: tint an existing Sovereign or court sprite.
- Idea from the brainstorm: it fights using the party's own abilities. Simple, safe version: it copies the current front hero's class look and its attacks hit that hero harder; or it has three phases that each mimic a role (fighter, caster, thief) and need a different answer. Do not invent new combat engine hooks if `bl3Hit` phases (summon, message, buff) are enough.
- Phases: `bl3Hit('psreflect', e => {...})` with the 75/50/25 percent pattern, summoning kids (cap 4 live, `m._kid=1`), `msg(...)` for each phase.
- Death: `bl3Kill('psreflect', e => {...})` sets a flag (`F.reflect=2`), gives the gear once (`bl3Give(id)` guarded by a `got` flag), plays a closing line, and opens the way up (the door to the fourth floor stub).
- Spawn: `bl3Add('psreflect', x, y, lvl)` (lvl about 108), triggered from the arena door or a switch, with the same respawn-on-arrival guard as the Dream (an `update` wrapper that re-spawns if the flag says it is live and none exists, see `psf2` in `ps_f2_dream.js`). Cutscene before it with `CUTS.psReflect` and `startCut`.
- HP and damage: the Dream's `hp:650, dmg:[12,18]` scaled to about 29k effective HP at level 104. Court bosses are 22 to 25k. Aim the Reflection a little above the Dream. The in-game estimate can read "deadly" for the test party, so judge it with a real level 105 party if possible.
- Gear drop: a second Pale Spire piece, level 100 to 106 requirement, using `pgrItem('pg_...', {n, k, t, ic, c:PGR_C.vio, armor, pas:{...}, sw, d})` (see `pg_dreamweave` for a chest piece and `pg_dreamcrown` for a head piece; `ps_gear.js` adds "Needs level 100."). Pick a different slot from the Mantle (chest) and the Circlet (head), for example a weapon, shield, boots or gloves. Add it to `ART_ITEM_IDS` if it has painted art, and give it a plain description with exact numbers.

## Part C: wiring and release checklist

1. New code goes in new files after `ps_f3_mirrors.js` in `ORDER` in `tools/inject.py` (for example `ps_f3_observatory.js`, `ps_f3_boss.js`). Never edit the injected block in `index.html` by hand; edit `src/desert` and run `python tools/inject.py`.
2. Register the new level in `PSP_LV` (`ps_ids.js`), with `pspRegister`, links via `PSP_L`, and `LEVEL_NAMES`/`LEVEL_RATING` (`pspRegister` does these).
3. Update the stair at (28,8) in `psf3Build` and the `psf3_stair` npc text. Update `psf2` Sleeper lines only if the story changes.
4. Add `?town=` jump support only if the user asks (the existing `?town=palespire9&lvl=104` jump restores the last save at the wrong level; use `goToLevel(id,{x,y,f})` for tests instead).
5. Test in the preview (own server on port 8913, clear `abbeySave_*` localStorage first): reach the level with `goToLevel(9820,{x:28,y:38,f:0})` then the swirling door link, check puzzles by calling the npc handlers (`NPCS[id].root()`, then `G.talk.node.opts[i][1]()`), check reachability with a flood fill, force boss phases and the kill with `bl3Hit`/`bl3Kill`, and check the console for errors. Hidden-pane screenshots can be torn: re-enter the level and wait.
6. Release: bump `VERSION` in `index.html`, `python tools/inject.py`, `python tools/stamp.py`, commit (end the message with the Co-Authored-By line), push, then the itch.io `html5` push and the Windows `windows` push (scratchpad `rel2.sh <version> <scratchpad>` does both). Never kill python by name. Ask before deleting anything.

## Art wanted (painted, Gemini, STRICT FRONT ELEVATION)

- The Sovereign's Reflection (boss), full length.
- Mirror shade, star wraith, brass clockwork guardian (enemies, with an attack frame each, the user likes attack animations).
- A telescope, an orrery or star chart table, a brass astrolabe, a star-map wall panel.
- Proper mirror posts for the Beam Room (the current ones reuse the silver column) and a drawn beam of light.
- Optional: a painted gear icon for the new Pale Spire item.
