# How to continue (work paused on 28 Oct 2026)

All work was paused by the owner mid-way and pushed as-is. Several agents were told to stop at a safe point; some may have stopped mid-task. First step for the next session: `git pull`, run `python tools/inject.py`, check that the game loads with no console errors (jump links: `?town=wenlock&lvl=80`, `?town=wellmaze&lvl=80`, `?town=graveyard&lvl=84`, `?town=gardens&lvl=80`, `?town=witchwood&lvl=82`), then pick up the items below. Release rules are in CLAUDE.md (bump VERSION, `python tools/stamp.py`, commit, push, `python tools/pack_itch.py`; never push to itch without the owner saying "push to itch").

## 1. Performance (the owner's last request: "it's slowing down a lot and freezing in the browser")

Measured on 28 Oct (profiles in `tools/perf/profile_2026-10-28.txt` and `tools/perf/canvas_callers_2026-10-28.txt`; scripts `tools/perf/prof.py <port>` and `tools/perf/prof2.py <port> "?town=oldhaven&lvl=34"`).

Setup cause (not the game): while the agents ran, the laptop was at 100 percent CPU with 0 GB free RAM, mostly from the agents' headless test browsers (32 to 41 headless Chrome processes, about 6.7 GB). Run fewer agents at once, one browser each, and close browsers after each check.

Game causes found, in order of size, with the fix to make:

1. **The CRT glow reads back the whole screen every frame.** `crtPass()` in index.html does `crtX.drawImage(cv,0,0,240,160)` (the 960x640 main canvas into a small canvas) in every level except the Hollow terrace cities. This was 60.7 percent of all CPU in the Oldhaven profile; on a real GPU it forces a GPU readback each frame (the code's own comment notes 25 to 60 ms stalls). Fix: always take the glow from `LOWC` (the 3D picture canvas, as the `hgtLook` branch already does), or update the glow only every few frames.
2. **No frame cap.** `frame()` redraws on every requestAnimationFrame, which is 144 times a second on the owner's 144 Hz laptop screen. Add a 60 fps cap (skip the frame if less than about 16 ms since the last drawn frame; keep `last` for dt) and a Frame rate option (30, 60, unlimited) on the Graphics page.
3. **getImageData about 9 times per frame** (callers not yet found: hook `CanvasRenderingContext2D.prototype.getImageData` with a stack trace for 30 frames). Each readback of a GPU canvas stalls; cache the result or use `willReadFrequently` CPU canvases.
4. **audioInit runs during play** (3 to 5 percent of CPU while walking, index.html `audioInit`): make its heavy setup run once.
5. **Boot does too much at once**: 28 long tasks, the longest 15 s in the (overloaded) test. Boot builds the well maze (`wmgBuild`, about 3 s), lettering for the Deeper Hollow polish (`hgdpcLetter`) and many procedural textures (`wornSprite`, `vnoise`, `hash2`, `fbm`, `warpTex`). Make the level builders lazy (build when the level is first entered, as `KH_LAZY` does).
6. **Per frame work that grows with content**: `spriteList()` loops over every decor (7,355 in the Deeper Hollow) and allocates a new object per visible decor each frame; 56 wrappers around `update()` and 19 around `ui()` run every frame. Bucket decor by area and throttle wrappers that do not need every frame.
7. Already fixed (in this push): the red near-death tint no longer creates a canvas every frame (it reuses `HURT_SCR`).

Measure again after each fix (same scripts) and in the owner's real Chrome if possible (see the memory note on the presenting setup: Chrome renders on the Intel GPU).

## 2. Work that was running when paused (each has notes; read them first)

- **Deeper Hollow polish, round 4** (north, towns, under, water): stopped mid-run. Read `tools/polish/<zone>_CRITIC3.md` (north: `_CRITIC2.md`) and `<zone>_NOTES.md`. South already passed ("SHIP"). Remaining blockers: towns (sacks over the Hedgefoot giver, lantern cluster at Nacre Landing, oversized shop signs, dark corridors), under (boards and rune stones in 476 show no lettering because `hgd_polish_text.js` skips `hgpd_board`/`hgpd_rune`; the wreck is still a whole boat), water (creatures on set-piece approach squares; the Shell Chests quest double-counts moved chests: a real logic bug; titles reading just "Note"; identical lake docks), north (dark Warrens hubs, Wasp Alley spawn at 101,95, bright house at 49,182). The workflow scripts are in `tools/polish/workflows/`.
- **Power ladders for every class** (`src/desert/powers_scaling.js`, `tools/powers_audit/`): each later power must hit harder and cost more; check the notes for how far it got.
- **Spell and power animations** (`src/desert/spellfx.js`, `tools/spellfx/SPELLFX_NOTES.md`): fire and the other elements are done; the frost white and blue version and the thief dagger, ranger arrow, warrior and other class animations were in progress.
- **Stormclouds over the Wenlock graveyard** (`src/desert/gy_storm.js`, `tools/gy_storm/NOTES.md`).
- **Flying front-on crows** replacing crows that stand in the air (`assets/crow/`, `tools/crows/NOTES.md`).
- **Blank crypt fronts in the Wenlock graveyard** and a gate for the dungeon (`assets/gy2/`, `tools/gy_fronts/`).
- **Market stalls open the nearby shopkeeper's shop page** (`src/desert/stall_shop.js`, `tools/stall_shop/BINDINGS.md`).
- **Quest rings on the local map for every main quest** (`src/desert/quest_rings_fix.js`, `tools/qrings/QRINGS_REPORT.md`).
- **Fishing**: the rod would not equip on a hero, bait needs an "Add to the rod" action, and fishing spots show through the pier (must draw only on water, behind nearer objects). Notes: `tools/FISHING_FIX_NOTES.md` (if written).

## 3. Decisions waiting for the owner

- Restoration (new single heal, level 50) heals about twice Greater Heal, but Greater Heal unlocks later (level 60). Either move Greater Heal earlier or Restoration to about level 62.
- Itch and Windows releases: the update log is `UPDATE_LOG_3.682.md` (refresh it with everything since); push to itch only on the owner's word.
