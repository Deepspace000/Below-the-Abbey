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

## Package 2 redesign: the Court of Statues as a schnoor (ps_court.js)
64 x 56 canyon lanes (walls 4.8 to 9.6 high, stepped gables), clock tower with a one-wide walk-under passage (x 32, y 20 to 26) over the fountain square, stream y 37 to 38 with a stone bridge (32) and two footbridges (20, 44), undercroft alleys, 12 nooks, 6 recesses with statues, lanterns, vines, wall alcoves and banners hung along every lane. Palette follows ref15 (charcoal, slate, teal moonlight, brass banners; verdigris only as accents). Own palette table PSC_K until PSP_PAL lands.
Code-made walls and floors only (houses, brick, castle front, tower, doors, water). Code-made STAND-INS (replaced when a painted piece exists): ps_arch_high/low/ivy/iron/stair and ps_rose_arch (pscArchStands); other stand-ins are only darkened and tinted (pscDarkStands, banners orange).
Art wanted from the art agent (names exist in PSP_PICS or are added in ps_court.js head): arch_* and rose_arch (transparent opening, 2.1 wide, h3.4), alcove_*, vine_a/b, lantern_bracket, bridge_rail, iron_rail, banner_long_a/b (added here, h3.6), bat_flock and moon_crescent (added here, not placed yet: package 1 owns the sky), st_hand and st_hound stand-ins are bone piles and too big.
Needs from ps_kit: nothing. Contract squares unchanged. Quest text locations were updated for the new geometry.
