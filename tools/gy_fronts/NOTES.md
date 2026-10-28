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
Remaining: red, grey and black entry arches still use the composed gyEntryPic (now lit, but not repainted); the dungeon gate could also replace the grey and black ones;
the dungeon gate is not centred exactly (at:.34 is about right); world map, Atlas and area map icons of the tombs were not checked; no save-game check was done;
south and west tomb slice order was not mirrored-tested (the painted pieces are symmetric so it does not show).
