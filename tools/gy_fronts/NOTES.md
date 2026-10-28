# Wenlock Graveyard fronts: notes (updated 28 Oct)

Cause of the "blank" fronts (AUDIT.md): dark pieces, no self light. Fixes made:
1. gyTile (src/desert/gy_art.js) gives every tile that carries a front picture an emissive layer (a 42 percent copy of the tile, option emit:0 turns it off,
   emit:k sets the share), so fronts stay readable in the storm and at dusk. Also new fac option fit:1 (fit a whole piece by height across n tiles, optional at:0..1
   to centre a point of the piece), used for the painted pieces.
2. Four new painted pieces from Gemini (front elevation, magenta, keyed by tools/gy_fronts/ingest.py after the sheet's purple was keyed to pure magenta):
   assets/gy2/f_gothic, f_classical, f_vault, f_dungeongate (.webp). Loaded by gyLoad (GY_FRONTS list in gy_art.js) as IMG['gyp_f_<name>'].
3. Wired: plaza crypt = gothic; tombs 536 gothic, 537 classical, 538 vault, 539 gothic, 540 classical, 541 vault (gy_tombs.js GY_TSTYLE, only a light tint,
   plaque lower on the gothic and vault door, on the architrave of the classical); Avenue of Vaults = blocks of three tiles cycling vault, classical, gothic, the north end
   vault; Pale Catacombs entry = the dungeon gate (GY_ENTRY pale is now 3 wide, 2.6 high). Door tiles keep their KH_DOOR registration (checked: crypt, pale, red, stair).
Checked with shoot.py (BTA_CHROME + GY_PORT env): no console errors, fronts readable at 3 squares.
29 Oct update: all four maze entries are now painted. Red = new Gemini piece assets/gy2/f_redgate.webp (red sandstone dungeon gate, ingest with up=0.45, raw in tools/gy_fronts/raw/redgate.jpg);
grey and black = f_dungeongate (black tinted dark blue-violet); pale unchanged. All use at:.5 so the gate is exactly centred on the door tile (the old at:.34 was off).
gyEntryPic is still used for the lych-gate only. Door tiles keep KH_DOOR (untouched). Greendale fishing: see fishing_places_areas.js (lake moved east of the for-sale plots).
Remaining: world map, Atlas and area map icons of the tombs were not checked; no save-game check; south and west tomb slice order not mirrored-tested.
