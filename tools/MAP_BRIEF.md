# Brief for the area-map artists (Below the Abbey)

You are making ONE area's local map look hand-drawn, illuminated and beautiful, in the style of a medieval manuscript. The game is a single-file HTML canvas dungeon crawler in
`C:\Users\mirko\Downloads\NIGHTFLYER RADIO SUBSPACE\RAT-CELLARS`. The player opens the area map with the M key; today most areas show a plain grid of coloured squares, which is ugly.
The owner loves the Hollow Grasslands map (`src/desert/hollowgrass_map.js`, a finished example of the quality wanted, though in a cooler older style) and the Pilgrim's Path map
(`lpDrawMap` in `src/desert/landpath.js`). Make yours that good: a full painted parchment drawn from the REAL level data (the map must match the ground the player walks), not a copy of the grid.

## Style (all maps share it)
Aged vellum, gold leaf, lapis blue, vermilion and verdigris green. Illuminated border with corner medallions, a title in an illuminated initial, a compass rose, tiny pen-and-ink
icons (trees, houses, churches, towers, mountains, water waves, graves...), roads as inked or dirt-coloured ribbons, hand-lettered place names with a pale halo, a short key and 3 or 4
notes in the side margins (plain literal sentences about the place, no em dashes, nothing cryptic), and small flourishes (ships, birds, banners, sea monsters, cattle) where they fit the area.
It must look drawn, not generated: wobbly outlines, hatching, soft washes, hundreds of small marks; vary sizes and add detail. Use `hash2(a,b,seed)` for repeatable randomness.

## Shared tools: `src/desert/maps_common.js` (read it first, about 100 lines)
`mplInstall({name, levels:[ids], draw(c,x,L,api), fit(L), foot, tint})`. `draw` paints onto the 480x320 context `x` once per level (cached; the border is added for you afterwards). `api` has
`parchment, title(x,'Title','subtitle'), compass(x,cx,cy,r), text(x,t,a,b,size,col,align), notes(x,[lines],a,b,w), panel, fit(W,H), wrap, I` where `I` = icons
(`tree,pine,mountain,house,church,tower,castle,wave,skull,cross,star`). The framed drawing area is `MPL.AREA={x:92,y:30,w:296,h:262}` (left margin 0..92 and right margin 388..480 are for title/notes/key).
`mplFit(W,H)` gives a scale and origin to map level cells to screen (`X(cell)`, `Y(cell)`); pass the SAME fit as `cfg.fit` if you use a different one, so the yellow party arrow lands correctly.
If an area has several levels (town + interiors), do the OUTDOOR/TOWN levels listed in your assignment properly; levels that are rooms or dungeons keep the standard map unless your assignment says otherwise.
Level data: `LEVELS[id]` has `rows` (array of strings; '.' open, other chars walls/doors), `fmap` (floor-type digit per cell on terrain levels), `decor` (objects: `{k,x,y,block,npc,enter...}`), `portals`, `mapNames` (named places: `{t,x,y,k}`), `lights`,
`start`. Use `mapNames` for labels, and read `decor`/`rows` to place trees, houses, walls, water, roads. Many levels are built lazily: call `KH_LAZY[id]()` first if `LEVELS[id]` is undefined.

## Rules
- Edit ONLY your own file `src/desert/maps_<yourarea>.js` (it already exists as a stub and is already listed in `tools/inject.py`). Do not edit `index.html`, `maps_common.js`, or any other file (if you truly need a change in maps_common.js, say so in your final report instead). Other sessions are working on other areas at the same time.
- All names in your file must start with your area prefix (e.g. `mpThornwood...`) to avoid clashes: every src file shares one global scope.
- Never use em dashes anywhere. Plain literal wording. No code-drawn creatures; small ink icons on a map are fine.
- Do not commit, push or bump the version; the owner's main session does that.
- Do not kill python processes by name; only stop a process you started, by PID.
- Keep your final report to under 120 words: what you drew, anything that did not work.

## Test loop
1. After each edit run: `python tools/inject.py` (rebuilds index.html from src; safe to run concurrently).
2. Start your own screenshot receiver once, in the background, on YOUR port: `python C:\Users\mirko\AppData\Local\Temp\claude\C--Users-mirko-Downloads-NIGHTFLYER-RADIO-SUBSPACE\6395aa69-0c9e-4a19-b1b5-473991e122b8\scratchpad\recv2.py <port>`. It saves POSTed images to `scratchpad\shots_<port>\<name>.jpg`; look at them with the Read tool.
3. The dev server is already running at http://localhost:8070 (do not start another). Use the Browser pane tools (`mcp__Claude_Browser__*`) but FIRST create your own tab with `tabs_create` and pass its `tabId` to every call (other artists share the pane). Navigate to `http://localhost:8070/index.html`.
4. In the page (javascript_tool), wait for the game: `for(let i=0;i<40&&!(G&&G.lst);i++)await new Promise(r=>setTimeout(r,500)); await khLoadAssets();` then go to a level and draw the map:
   `goToLevel(<id>,{x:<cx>,y:<cy>,f:0}); G.state='play'; G.menu=false; G.overview=true; render3D(); ctx.setTransform(2,0,0,2,0,0); ui(.016); await fetch('http://localhost:<port>/name.jpg',{method:'POST',body:ctx.canvas.toDataURL('image/jpeg',.92))` (fix the paren). Use the level's `LEVELS[id].start` for x,y. The pane may be hidden, so screenshots of the pane can be stale; this canvas POST is reliable.
5. After editing, reload the page (navigate again) because the map is cached; wait for `G.lst` again. Iterate until it looks beautiful, check text is readable and nothing important overlaps, and check the party arrow sits in the right place.
6. Check the console for errors (`read_console_messages`, only errors).
