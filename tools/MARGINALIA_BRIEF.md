# Brief for the marginalia artists (Below the Abbey)

Game: single-file HTML canvas dungeon crawler in `C:\Users\mirko\Downloads\NIGHTFLYER RADIO SUBSPACE\RAT-CELLARS`. The area maps (M key) are painted as illuminated medieval manuscript pages
(see `tools/MAP_BRIEF.md` and `src/desert/maps_common.js` first). Your job: add **marginalia** to the maps in your assignment: small pen-and-ink drolleries in the margins, like the
doodles in the margins of real medieval manuscripts (Luttrell Psalter, Gorleston Psalter, the Smithfield Decretals).

## What marginalia is
Tiny scenes and creatures that sit in the white space around the main drawing, often funny, strange or slightly rude, and often relevant to the page. Examples to draw from:
a knight fighting a giant snail; a rabbit army attacking a castle; a monk riding a pig; an ape playing bagpipes; a hare with a hunting horn; a bishop-headed fish; a wyvern or
dragon curling its tail around the border; a fox preaching to geese; a man shooting an arrow at a bird; a cat with a mouse; hybrids (bird with a human head); a jester; a scribe
at a desk; bees and a skep; bells with a tiny ringer. Make them **relevant to the area** (its creatures, its trades, its stories, its hazards, its history) and keep a medieval, witty,
plain-literal feel. No text longer than 2 or 3 words (small ink captions only if truly useful). Never use em dashes. No modern things.

## How it is drawn
Pen and ink, in the map's own ink (`MPL.INK`), with thin washes of the manuscript colours (`MPL.GOLD`, `MPL.LAPIS`, `MPL.VERM`, `MPL.VERD`, soft earth tones). Drawn in code on the 480x320 sheet
context, small (about 10 to 28 units across), wobbly outlines, hatching, tiny details. Because the sheet is rendered at 3x (Khemetra 8x) it stays sharp when the player zooms in, so the details
matter: eyes, feathers, scales, stitches, tiny faces. Use `hash2(a,b,seed)` for repeatable wobble. Aim for 4 to 8 marginalia per map, varied in size, each a little different. They
should look hand-placed: some in the top and bottom strips, some peeking round the edges of panels, a creature climbing the border, a tiny vignette with a ground line. Do not cover the
title, notes, key, compass, labels or the main map drawing. Look at a rendered map first and find the empty parchment (the areas left and right of the main drawing are filled with
the title, notes and key in many maps; look for gaps, the top strip above the drawing area, the bottom strip below it, and the corners). Check text is still readable.

## How to register
In your own file `src/desert/marginalia_<letter>.js` (it exists as a stub, already listed in `tools/inject.py`; all names start with `mpmg<letter>`):

```js
mpmgAdd([1], function(x,L){ /* x is the 480x320 sheet context, paint your marginalia here */ });
```
`mpmgAdd(levelIds, fn)` is defined in `maps_common.js`; the game calls `mpmgDraw(x, level)` for you just before the border is painted, for every map installed with `mplInstall` and for the Pilgrim's Path.
Maps that do not use `mplInstall` (Khemetra, Hollow Grasslands: see your assignment) need one line added: `mpmgDraw(x,<level>);` just before their border is drawn.
You may build shared helpers inside your file (a rabbit, a snail, a knight...) and reuse them across your maps with different poses and sizes.
Maps with several levels sharing one sheet (like the Pilgrim's Path, or the Oldhaven quay) get one drawing per level id registered, so register them all.

## Rules
- Edit ONLY your own `marginalia_<letter>.js` (plus the single `mpmgDraw` line named in your assignment, if any). Do not edit `index.html`, `maps_common.js` or other artists' files. Other artists work at the same time.
- Creatures are small ink drawings on the map only; do not add them anywhere else in the game.
- Do not commit, push, or bump the version. Do not kill python processes by name; only stop a process you started, by PID.
- Final report under 100 words: which maps, what you drew, anything that did not work.

## Test loop (same as the map artists)
1. After each edit: `python tools/inject.py` (rebuilds index.html; safe to run concurrently).
2. Start your own screenshot receiver once in the background on YOUR port: `python C:\Users\mirko\AppData\Local\Temp\claude\C--Users-mirko-Downloads-NIGHTFLYER-RADIO-SUBSPACE\6395aa69-0c9e-4a19-b1b5-473991e122b8\scratchpad\recv2.py <port>`. It saves POSTed images to `scratchpad\shots_<port>\<name>.jpg`; view them with the Read tool.
3. The dev server is already running at http://localhost:8070 (do not start another). Use the Browser tools `mcp__Claude_Browser__*`, but FIRST create your own tab with `tabs_create` and pass its `tabId` to every call. Navigate to `http://localhost:8070/index.html`.
4. In the page (javascript_tool): `for(let i=0;i<60&&!(G&&G.lst);i++)await new Promise(r=>setTimeout(r,500)); await khLoadAssets(); await khPrepare(); G.flags.noFog=1;` then for each level `if(!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n](); const st=LEVELS[n]._start||LEVELS[n].start; goToLevel(n,{x:st.x,y:st.y,f:0}); G.state='play'; G.menu=false; G.overview=true; await new Promise(r=>setTimeout(r,300));` then render big: `const cv=ctx.canvas; cv.width=1440; cv.height=960; ctx.setTransform(3,0,0,3,0,0); drawOverview(); const u=cv.toDataURL('image/jpeg',.92); cv.width=960; cv.height=640; await fetch('http://localhost:<port>/name.jpg',{method:'POST',body:u});`
   (reveal-mode dungeon maps cover unexplored parts with parchment; set `G.seen` to everything or accept that the margins still show.) Crop with PIL to inspect details.
5. After editing, reload the page (navigate again) because sheets are cached. Iterate until it looks beautiful and funny, nothing important is covered, and the console has no errors (`read_console_messages`, errors only).
