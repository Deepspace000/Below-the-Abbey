# Castle coherence pass: shared brief

Owner's words: "All the objects in the whole castle area need to be stylistically coherent. No graphics that are jarring. No doors off walls, no objects that look like clutter." And: run a SECOND critic round, much more harsh.

Standard: AAA gothic dungeon crawler. One visual language: black weathered stone, verdigris green, pale silver light, wrought iron, dead ivy, dark wood, candle gold, red lantern accents. Painted-raster pieces only, strict front elevation.

Rubric for the critic (be merciless, list every offender with level, x,y, key):
1. Style mismatch: any piece whose palette, line weight, rendering style or era differs from the castle's (bright/saturated/cartoon, village, Egyptian, desert, farm, nautical, modern, cute, Tudor/timber, domestic knick-knacks, pottery, terracotta, wicker). Includes pieces borrowed from other areas (gy_*, kh_*, ww_*, hl_p_*, mw_*) that were not retoned to the castle palette.
2. Doors/arches/windows/portraits/mirrors/signs hanging off walls: anything wall-mounted (pic:1, wd) whose cell is not an actual wall, floats in open floor, sits on the wrong side, is mid-air, is cut by a wall edge, or a door-looking piece that is not a real door.
3. Clutter: props scattered with no composition; repeated identical pieces in a row more than 3; things in the middle of floors for no reason; pairs not symmetrical; props crowded closer than 2 squares apart without being a deliberate group; anything on or beside the walking route.
4. Scale: pieces too big/small versus the player and the 1-cell grid; floating or sunk pieces; cut-off or half-visible textures, clipped sprites, hard seams.
5. Wrong place: objects that do not belong to the room's purpose.
Fix method: remove first; replace with a painted piece that fits only if the space needs it; retint borrowed pieces with the kit's tint helpers (pspStand / pspTint patterns) only if they then look right; never code-drawn art for props. Prefer fewer, better placed pieces: a composed room has 1 focal point, symmetry or rhythm, and breathing space. Keep reach/walk/links/key tests green (tools/ps_test.py).
Method: Playwright screenshots (patterns in tools/ps_test.py, tools/ps_tour.py; note facing = (f-1)*PI/2 in the game, so prefer goToLevel(id,{x,y,f}) over setting angles; own `python -m http.server <unique port>` from your worktree root; BTA_CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe"; never kill python by name). Also dump decor lists via page JS and audit by key. Spawn a harsh critic subagent (Agent tool, model sonnet) on at least 12 viewpoints per level you own, fix everything it finds, then a SECOND critic round on fresh screenshots, fix again. Report remaining issues honestly.
