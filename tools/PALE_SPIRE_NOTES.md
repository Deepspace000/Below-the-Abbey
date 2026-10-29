# The Pale Spire: handover notes (package 6, shared glue)

Other builders append their own sections below; re-read before writing.

## Owner references (tools/PALE_SPIRE_REFERENCES.md, pictures tools/ref_spire/ref8 to ref14)
What package 6 takes from them (walls, doors, floors, silhouette, Gemini prompts):
* Walls: pale ashlar, and an `ivy` wall style (pale stone hung with dark cold ivy, in the kit as style 'ivy') for cloisters, the courtyard facade and arcades. Pointed arches, carved windows with tracery (style 'win'), balustrades with urns.
* Floors: pale flagstones, wet dark cobbles (ref14, floor 'cobble' and 'wet'), gravel, clipped pale lawn beside paths, black and white marble in halls, violet runner.
* Castle silhouette (for the S9 gate and fronts sheet and the map picture): many conical dark-slate towers of different heights with banners, steep gables, tiers of terraces, a lower bastion with three arched tunnel gateways and stairs climbing both sides to the terrace (ref9); a wide stepped approach to an arched double door under a carved rose window (ref8).
* Gate mood (ref11): iron gate at the end of a cobbled path between low parapets, roses climbing the walls, glowing windows, storm sky; in the Pale Spire pale silver and violet, red only as accent.
* Nooks (ref13, ref14): statues on plinths in each arch, mossy benches, stream into a lily pond, curved stairs, pale wrong flowers (white, bruise purple, one red).
* Gemini prompt additions for sheet S8: "pale grey ashlar, cold, hung with dark green ivy", "wet dark cobbles with puddles reflecting violet light", "flagstones pale silver grey", always STRICT FRONT ELEVATION, magenta ground.


## Package 6: shared glue (built 29 Oct 2026)
Files: `ps_ids.js` (contract), `ps_core.js` (PSP_PICS stand-in table, PSP_CREATURES, PSP_ITEMS, pspF, pspPic, pspStand, pspPics, pspRegister), `ps_kit.js` (pspMake and the helpers; signatures in its top comment), `ps_glue.js` (PSP_REG, stubs for all ids 9710 to 9998, art loading, arrival hooks, key and sealed doors, Go to rows, jump links, filler items), `ps_maps.js` (parchment maps, world map hooks), `ps_sound.js` (pspTick). Tools: `tools/ps_test.py`, `tools/ingest_ps.py`.
Core edits in index.html (all small): jumpFromUrl town regex and level cap 115 / default 100 for palespire*, the call `pspAreas(AREAS)`, the ray limit of the wall loop and the sky list include 9710 to 9998. No edit of maps_world_*.js: ps_maps.js unshifts the interior row and gives the `palespire` WMB_PLACES entry a live `ids` getter (built ids only, so the padlock goes once a level is built).
Hooks: `pspOnArrive(fn)` for builders; `pspKeyBump(link)` is called (if defined) when a locked stair door is bumped without the key (psq10 offer).
Painted art: none yet. All pictures are stand-ins (`PSP_PICS`, pale filtered copies of existing pieces); drop painted pieces in `assets/ps/` with `assets/ps/manifest.json` {name:{file,h}} and they replace the stand-ins with no code change. Walls, doors and floors (S8) are made in code (styles ash ivy win dun bone panel pier arch dark; doors oak great iron dungeon stair gate; floors flag marble runner wet straw lawn gravel cobble flagdark dirt). The Gemini sheets S1 to S9 were NOT generated (no Chrome session used): this is the main gap. Prompts: see section B7 of the plan plus the reference additions above.
Test: `python tools/ps_test.py <mode>` on your own server (PS_PORT, BTA_CHROME). Modes load links reach key quests walk save dash shots. Page loading the art takes 10 to 15 s, tests wait for PSP.ready.
Flags: `G.flags.psp` (pspF()): `last` (last level reached), `seenNNNN`, builders add their own (key2, sacristyOpen, framePainted, sovereignLore ...).
Known test notes at the time of writing: reach 9760 reports the sacristy as cut off (hidden door is solid until the lever, expected); package 4's stair doors use their own door code (not KH_DOOR.psp) and pass the key test by behaviour.


## Package 3: Great Halls, redesign (9740, 64 x 48)
Rebuilt as a chain of tall rooms (wall height 3.2): Entrance Hall, Great Nave (columns every two squares, staggered candelabra and urns in the centre aisle, aisles with statues and alcoves), Gallery of Portraits (3 wide, hidden alcoves with creepy statues, Painters' Closet, secret niche), Dining Hall, Music Salon (column ring), Lady's Withdrawing Room (rest, warm), Screens Passage (link to 9750 at 2,30), Minstrels' Gallery and Lower Vault (two narrow stairs, in-level warps), Banqueting Hall (link to 9760 at 61,30), Trophy and Hunting Hall, Hall of Statues, Winter Bay, Grand Stair Hall (two flights of step walls, landing, Stair Warden, link 32,5). All gameplay content kept (psq10 to psq12, items, sheets, signet, frame, banquet trigger, bosses). Palette: black stone, verdigris green, sickly green-white light; own tile kinds (steps, iron, face, blind arcades, carved wainscot). Indoor floor heights are not used; stairs are drawn flights plus warp stairs.
Text change: the statue niche now opens beside the turning statue (behind it was unreachable). Chests: bow chest (59,19), secret chests (15,41) and (42,39).
Asks: PSP_PAL when it lands (tints here are local); painted pieces wanted: st_gargoyle, alcove_*, vine_*, iron_rail, window_great, trophy_stag, face reliefs. ps_test boots into 9720 (old package 1 code); use town=palespire3 for this level. Weak: stand-in props are filtered copies; the upper wall (above 2.4) is rarely in view so high windows only show from afar; hall of statues are hooded stand-ins.
