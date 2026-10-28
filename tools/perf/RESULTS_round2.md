# Performance round 2 (28 Oct 2026)

Headless Chrome shell, software GL (swiftshader), 960x640, unloaded laptop, one browser at a time. `prof.py` / `prof2.py` now honour `BTA_CHROME`.
Software GL makes "(program)" (raster) about 70 percent of every play scene, so frame rate there barely moves; the gains are in boot and in per-input work.

| Measure | Before | After |
|---|---|---|
| Boot to ready (prof.py) | 6.6 s | 4.4 s (4.2 s in a second run) |
| Boot: wmgBuild (well maze, 4 floors) | 271 ms | 0 (built on first use) |
| Boot: hgdpcLetter (Deeper Hollow lettering) | 340 ms | 0 (done on first entry to level 475) |
| Boot long tasks (count / total) | 5 / 3126 ms | 4 / 2395 ms |
| getImageData per frame at runtime (Oldhaven, Deeper Hollow, Wenlock, Gardens, walking) | 0 | 0 |
| Oldhaven arrival | 5.5 s | 4.1 s |
| Play fps (swiftshader): Wenlock / Deeper Hollow / Oldhaven | 21.7 / 20.7 / 17.3 | 22.7 / 20.5 / 21.1 |
| Oldhaven long tasks while walking | 142 (8380 ms) | 32 (1783 ms) |
| Oldhaven crtPass readback (prof2) | 17.9 percent of samples | unchanged (1 frame in 4; kept as is) |

## What was done
- (3) getImageData: hooked the prototype with stack traces for 30 frames, standing and walking, in five levels: zero calls per frame now (the old 9 per frame went with the CRT readback fix). Nothing left to cache.
- (4) `audioUnlock` ran on every key press and tap (resume plus silent audio element). It now returns at once when the context is running and the silent element is playing, and is throttled to once per 400 ms otherwise.
- (5) Lazy: the four well mazes (`src/desert/wellmaze_specs.js`, now built on first read of `WM.M` or `WK.WELLSTART`, same seeds so identical mazes) and the Deeper Hollow sign lettering (`hgd_polish_c.js`, runs only while in level 475). Not made lazy: `applyAITextures`, `makeTudorSet`, `makeBespokeTiles`, `makeItemSprites` (about 0.4 to 0.8 s each, needed by every level; unsafe to defer).
- (6) `spriteList`: new `sprNear()` keeps the decor within 41 squares of the camera (refreshed every 0.5 s, after 4 squares of movement, or when decor changes), so the Deeper Hollow loop walks a few hundred decor instead of 7,900. The 56 `update` and 19 `ui` wrappers measured under 1 percent each of a frame (inclusive `update` is about 9 percent of the frame, almost all real game logic), so they were left alone.

## Checks
Jump links wenlock, wellmaze (floors 1, 2, 4), graveyard, gardens, oldhaven, infested, deephollow: all load with zero console errors. `tools/infest_test.py`: RESULT OK. `node --check` clean on all script blocks. Sign lettering confirmed (`IMG.hgdpc_sg_armour` present, `HGDPC.lettered` 1) after entering level 475.
