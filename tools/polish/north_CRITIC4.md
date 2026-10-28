# North zone (Deeper Hollow level 475, precincts and Warrens) CRITIC review, round 4

Method: own server on port 8340 (stopped by PID at the end), installed Chrome with software GL, one browser (r4_daemon.py, r4lib.py, r4sheet.py, r4_north_lum.py in this folder). 45 zone hubs shot and their mean luminance measured, about 20 looked at in contact sheets (r4_shots/s_n1.png and others). Console errors: none.

## Round 3 leftovers, checked
- Dark Warrens hubs: FIXED. Danger hubs mean 75.9 before this round, 78.4 after (minimum 40.6 at Beetle Row before, 58.1 after). Worm Warrens 65, Pale Burrows 76, Spider Gully 82.
- Bright house at (49,182): not found as a defect in the tour; the hub there reads as a lit room.
- Wasp Alley spawn: the entry square at (101,95) is clear; a nest guard stands in the alley itself, which is by design.
- 7 notes without a label (hgd_pa_note): FIXED. All 72 hgd_pa_note now carry d.label (set when the lettering is made) and all show lettering. Cut titles ending in "..." were 13, now 0 (hgtTitle cuts at a word, 5 words or 26 letters at most, and drops a trailing small word).

## Grades
| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 7 | bosses, lamps, trees sit right; the notice board at Nacre Landing is large from one square, fine from three |
| Signage and text | 7 | every note lettered, titles short; wall notes still best read from 1 to 2 squares |
| Prop placement | 8 | nothing in a corridor, nothing floating |
| Repetition | 7 | honeycomb and hedge sets vary by zone |
| Landmarks and navigation | 7 | lit lamps and crystals on the sight lines |
| Lighting and atmosphere | 7 | all hubs 58 or more after the fix; Beetle Row was 40.6 |
| Bespoke detail | 8 | vignettes tell stories |
| Art quality | 7 | consistent painted set |
| Performance | not measured on a GPU | |
| Console errors | 10 | none |

## Fixed this round
1. Beetle Row (158,55) mean 40.6 and the dark Bug Nest and Blue Bug Nest 2 halls: a hanging lamp with a warm pool added in each (hgd_polish_e4.js, end of file).
2. Note titles and labels (hgd_polish_text.js).

## Remaining
1. Wall notes in corridors are small beyond 3 squares (side wall pictures).
2. Frame rate on a real GPU not measured.

## Verdict: SHIP, with the two remaining items logged.
