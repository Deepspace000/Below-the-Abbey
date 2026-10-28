# Stormclouds over the Wenlock Graveyard (level 530 only)

Owner's request: "stormclouds over the wenlock graveyard please". Work was PAUSED by the owner before the pictures were looked at. Nothing is committed, versioned or pushed.

## What it does (all in `src/desert/gy_storm.js`, keyed on `LEVEL===530` and `G.state==='play'`)
- **Sky**: a 1024 by 256 panorama of three parallax cloud banks (bruise purple far, slate middle, blue-black near, lit upper edges, a greenish glow low down). The banks are baked once on the first visit (about 0.3 s) and slid past each other with a slow billow and shear. A slice of the next panorama is painted each frame into a back buffer and swapped in whole (no seams). Measured 1.3 ms a frame, the slice size adapts to the machine (`GYS.cpf`).
- **Light**: `weatherNow` gives a greenish-grey dusk (`Stormclouds`), a cool multiply wash goes over the 3D view, ambient light is 10 percent lower. Mean luminance of the yard in the test: 53 to 58 (calm), 45 in the rain frame (limit was 45), before the storm 55 to 70.
- **Lightning**: every 6 to 20 seconds (random). A double flicker of about 245 ms (measured 1 to 244 ms), additive cold wash, sheet glow inside the clouds at the strike's bearing, a jagged fork in about half of the strikes (fixed in the sky by bearing, so it slides as the party turns). The flash lifts the ambient light and every lamp (crypt doors, ghost-lights) for those frames and puts them back (render3D wrapper, nothing is saved).
- **Thunder**: 1 to 3 seconds after the flash (later and quieter for far strikes). A rolling rumble made of three low-passed noise layers and a sub tone with a slow start (0.45 s), through `MASTER`, scaled by the Ambient sound setting (`SNDOPT.amb`), silent when muted. Test: one strike made 1 thunder, 1 `gysRumble` call, 3 audio sources.
- **Rain**: only in the brewing stretch of a 330 s cycle (130 s calm, 150 s rain with 20 s fades, 50 s calm). Thin slanted streaks, at most 76, no splashes, plus the game's `rain_loop` sample at a soft gain (0.1 at most), faded in and out. No gameplay effect.
- **Wind and leaves**: `WIND_AMT[530]=.55` (the game's wind loop, light), and up to 6 dry leaves blown across the view now and then.
- **Reduced motion**: with `prefers-reduced-motion` the flash is a single soft pulse at 35 to 50 percent, fewer streaks and leaves. The game has no reduced effects setting of its own.
- Stops when the party leaves 530 (crypt 531, mazes 532 to 535, Wenlock 496): rain, strike and thunder queue are cleared, the rain loop fades out. Wenlock and Blackbriar Wood are untouched (every hook tests `LEVEL===530`). The minimap and parchment maps do not use the 3D sky or `drawWorld`.

## Edits outside the new file
- `tools/inject.py` ORDER: `'gy_storm.js'` added just before `'jump_ready.js'`.
- `index.html`, the sky line in `render3D` (the one with `ovcLv`): `||LEVEL===530` added to `ovcLv`, and `SKP` takes `self.GYS_PAN` for level 530 (falls back to the old sky if the panorama is not built yet). Nothing else.

## Test (tools/gy_storm/shoot.py; ONE browser, closed at the end; `GY_PORT`, `GY_BOOT_S`)
Run on your own server (`python -m http.server 8355` from the repo root). It boots once, takes 8 frames (calm, rain, two held flash frames, four directions), the thunder and rain-sound checks, frame time, and the walk out to the crypt and back. Writes `results.json`, `sheet.png` and the frames here. `base0..3.png` are the pictures from before the storm (same places, for the luminance comparison).
Last run (machine at 100 percent CPU, about 3 fps, so times are inflated): no console errors, no page errors (the 918 resource errors are the pre-existing missing sprite files), frame with storm 61.6 ms against 61.5 ms with it switched off (the storm is lost in the noise), panorama slice 1.28 ms.
Test hooks on `GYS`: `force` (1 rain, -1 none), `hold` (freeze the flash at a number of ms), `off` (whole effect off), `strikes`, `thunders`, `sounds`. `gysStrike({far,fork,az,delay})` makes a strike.

## NOT done (the owner paused the work)
1. **The screenshots have not been looked at.** Open `sheet.png` and `f5_FLASH_fork_south.png`, `f7_FLASH_first_flicker_west.png`, `f3_rows_west_rain.png` at full size and judge: how much sky shows over the yard (the yard is full of trees and walls, so the sky may be a thin band), the cloud colours, whether the fork reads, whether the flash is too strong (luminance 88.7 at the held peak of the second flicker, 58 at the first), whether the rain is visible but light. Tune in `gysOverlay` (alphas), `GYS_SPEC` / `GYS_BASE` (palette is written as screen colour), and `render3D` wrapper (`G.amb` factor .9, flash gain .4).
2. The first look at the sky was only done in a node preview of the panorama (three views, looked good: slate, purple, blue-black, green horizon), not in the game.
3. The walk to Wenlock (496) did not complete in the test (it stayed in the crypt after 6 s on the slow machine): repeat it with a longer wait. The crypt and the return to the yard were fine.
4. Natural lightning was not seen in the test (game time ran very slowly, no natural strike in 48 s); the strikes in the sheet were forced. The scheduler is a plain timer on `G.time` (6 to 20 s).
5. Rain loop after the rain stops: it fades with a 1.5 s time constant on game time, so on this slow machine it was still running 9 s later; it did stop after the walk to the crypt. Check once on a normal machine.
6. Thunder loudness was reasoned (low-passed noise needs a x4 gain), not listened to. Adjust `gysRumble` (the `*4` and the `.2` in `gysStrike`).
7. Version bump, commit, push and the itch zip: not done on purpose (the owner's call).
