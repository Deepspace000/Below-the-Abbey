# Pale Spire floor 4: the Floor of the Moon

Design (from the owner): floor 4 is ONE level (hub 9890) with four rooms, each with a big floating 3D planet. Touching a planet enters its maze, played from ABOVE (top-down, same grid, rounds and fights, UI unchanged). Pick up objects, fight, reach the exit to finish the planet. All four done opens the way up to floor 5; before it hangs a floating Moon boss, level 110.

Built at 3.845: `src/desert/topdown.js` (engine: TD.levels, tdDraw, tdAct, line of sight, medieval map look, zones) and `src/desert/ps_f4_planets.js` (maze maker psf4Maze, psf4Planet builder, planet 1 = 9891 The Stone Planet, flag G.flags.psp.f4.done[id]).
Gotchas: the level kit only treats squares 2 to size-3 as floor, so the maze is offset by 1; props go only on a room's inside (a prop on a room's border ring can block a passage and the kit then deletes every prop); walls are tile ids >= 1000, doors/portals are in KH_DOOR.
Next: planets 9892 ice, 9893 growth, 9894 fire (own TD.look, foes, zones); the hub 9890 with four rooms and 3D planets (real stair from the Observatory replaces the prov stub); Moon boss; new enemies per planet with idle + attack art; the Orrery Staff of the Pale Moon (tools/PALE_SPIRE_GEAR.md).

## Status at 3.847
Built: hub 9890 (src/desert/ps_f4_moon.js), planets 9891 to 9894 (ps_f4_planets.js, topdown.js), boss The Pale Moon (psmoon), pg_moonstaff, painted planets and Moon in assets/ps (planet_*, moon_boss, moon_bossA). Stair to floor 5 is a stub link to 9900 (prov).
Still wanted: planet-specific creatures with their own painted idle and attack pictures (the planets reuse existing Pale Spire creatures), ranged attack arrows from above, tap-to-move on the map, painted gear icon for the staff, a first-planet intro for the other planets if wanted.
