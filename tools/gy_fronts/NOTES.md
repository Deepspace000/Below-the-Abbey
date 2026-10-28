# Wenlock Graveyard fronts: notes (PAUSED, nothing in the game changed yet)

Work was stopped on the owner's order. NO file in src/desert or index.html was edited by this task (python tools/inject.py and the parse check were run at the end, game loads). Nothing committed, versioned or pushed.

## Done
- Reproduced the report with Playwright (own server, port 8353, now stopped). 42 screenshots at 1, 3 and 5 squares of 14 fronts are in tools/gy_fronts/shots/ (before_*.png). Reading them: the fronts are NOT missing, they are drowned (see AUDIT.md).
- Found how the fronts are built and rendered (see AUDIT.md), and the fix plan below.
- Tools: lib.py (boot + go + shot, persistent browser profile so the 230 MB of pictures load once), sites.py (the 14 front positions), shoot.py (`python tools/gy_fronts/shoot.py <tag> <site,site|all> <1,3,5>`), probe.py and dbg.py (small probes), ingest.py (cuts a picture on magenta into assets/gy2/<name>.webp with a soft key and a 2x enlarge).
- Two new painted fronts made with the Canva connector (generate-image, front on, magenta): a Gothic crypt and a classical marble mausoleum. Cut to assets/gy2/f_gothic.webp and f_classical.webp (not used by the game yet). Raw 200 px previews in tools/gy_fronts/raw/. The Canva connector only returns a 200 px preview (the real image is 1264 px but its link is signed for 200 px), so detail is soft; Gemini in Chrome would give full size.
- Gemini in the owner's Chrome did not work: the tabs froze (laptop out of memory) and tab ids were shared and renamed by other agents. Canva also hit a "credit usage is cooling down" limit after two images (only one generate call at a time works).

## Still to do (the plan)
1. src/desert/gy_fronts.js (new, put in tools/inject.py ORDER just before jump_ready.js): builds each front as one canvas (backdrop of dark leaf bank or pale stone, painted piece scaled so the door is about 1.2 squares tall, name plate, lamp glow) and registers it as IMG['gyp_f_<name>']; list of assets/gy2 pieces (GYF_LIST).
2. gy_art.js: gyLoad also loads GYF_LIST from assets/gy2 (so the fronts are there on first arrival); gyTile gets two options: `emit` (an emissive layer, TEX[id].e, so the front stays readable in storm and dusk, the Abbey's tx.e=tx.d trick) and `flat` (no foot darkening).
3. Wire them: gy_yard.js (plaza crypt line 135, six tombs 151, avenue 178, mazes 190), gy_tombs.js gyTombTile, gy_entries.js (GY_ENTRY sizes and gyEntryPic), at wall height 2.6 like the leaf boundary.
4. Fix the mirrored slice order on the south and west tomb fronts (slice index = lateral offset to the viewer's right, plus 1). Test with the lantern on the Gothic crypt.
5. More painted pieces when a generator works: iron-barred vault door, mossy barrow door, sunken stair gate, family tomb with an angel, and four dungeon gates (wrought iron, stone posts, skull arch) for the mazes incl. a proper gate for the Pale Catacombs.
6. World map, Atlas and area map check for the graveyard rows (not looked at yet). Then the 20+ screenshots, enter and return of each door, console errors, save check.
