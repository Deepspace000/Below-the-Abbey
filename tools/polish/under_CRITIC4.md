# Underlevel (476) CRITIC review, round 4

Method: same harness (port 8340). Luminance of 14 corridors and 5 hubs before and after, about 20 frames looked at (boards, runes, hubs, wreck, barricade). Console errors: none.

## Luminance (mean of 3D view)
Before this round: corridors 75.3 (min 60.5), hubs 61.1 (min 52.8). After raising the level lift (LUT +0.27 to +0.60 in hgd_polish_d.js, range unchanged): corridors 86.9 (min 68.8), hubs 71.8 (min 63.8). Target hubs 70: met. Corridors are brighter than needed but still read as stone with dark far ends.

## Round 3 leftovers, checked
1. Labels in the world: FIXED (earlier round 4 work). Boards show a lettered plank ("Dunmow's Light", "The Spare Light").
2. Single rock wall tile: FIXED (earlier round 4 work). 868 wall squares use three more tiles (pale brick, damp green, chalky) in 2x2 patches; visible in every corridor frame. They are not chalk-drawn marks.
3. Twin chests at The Barricade: not reproducible. The Barricade is now at (173,24) and has one crate or barrel per side, alternating pieces. Audit for identical adjacent chests, crates or barrels: one pair left on 476 (barrels at 89,150 and 90,150).
4. Wreck (154,81): still a cut boat picture with a ragged break.
5. Hub brightness: FIXED (above).

## Grades
Proportions 8, Signage 7, Placement 7, Repetition 7, Landmarks 8, Lighting 7, Detail 8, Art 7, Performance not measured on a GPU (192 ms build pass here), Console 10.

## Remaining
- The wreck is still cut from the intact boat picture.
- One pair of barrels side by side at (89,150).

## Verdict: SHIP.
