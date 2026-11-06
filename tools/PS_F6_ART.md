# Pale Tower art (floor 6), rooms 1 to 11

All pieces are in `assets/ps/` and listed in `assets/ps/manifest.json`. Painted by Gemini, ingested with `tools/ingest_ps.py`.

Keys per room N (N = 1..11):

- Textures (256 px jpg): `f6rNtex_0` = wall, `f6rNtex_1` = floor
- Props (webp): `f6rN_centre`, `f6rN_tall`, `f6rN_hang`
- Creature (webp): `f6rN_foe` (idle), `f6rN_foeA` (attack)

Heights (the `h` value in the manifest, in cells):

| Room | Theme | centre | tall | hang | foe / foeA | Creature |
|---|---|---|---|---|---|---|
| 1 | Vestibule of Candles | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Gilded Usher |
| 2 | Bone Organ | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Organist Wraith |
| 3 | Clock Room | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Clock Reaper |
| 4 | Reliquary | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Reliquary Mimic |
| 5 | Tapestry Room | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Weaver |
| 6 | Mirror Cabinet | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Mirror Duchess |
| 7 | Thorn Library | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Thorn Scribe |
| 8 | Weeping Chapel | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Weeping Saint |
| 9 | Crown Armoury | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | Crown Knight |
| 10 | Antechamber of the King | 1.6 | 2.4 | 1.8 | 1.9 / 1.9 | King's Executioner |
| 11 | Throne Room | 3.2 (Great Throne) | 2.4 (pillar candelabra) | 1.8 (royal banner) | 2.6 / 2.6 | Pale King |

## Notes

- Nothing left undone: all 33 sheets are ingested and checked against the manifest (no missing key or file).
- Regenerated: room 7 props sheet once (first lectern had a sloped top seen at an angle). The second sheet's portrait was a recognisable famous painting, so room 7 uses centre and tall from the second sheet and `f6r7_hang` from the first sheet (sheet key `f6r7propsH`; the centre and tall sheet key is `f6r7props`).
- Rooms 5 to 11 came from Gemini on burgundy or pink, so the background was keyed to pure magenta before ingest.
- Props are cut with explicit pixel `cells=` because the pieces' widths differ a lot (equal thirds would cut them).
- Tex sheets: each half already contains a 2x2 repeat of the pattern, so the 256 px tiles show 4 motifs each; they tile cleanly. Floor tiles of rooms 4 and 5 have a thin gold border line that repeats in the grid.
- Possible weak spots (owner's taste): the room 5 loom shows a small gear on its left side; room 7 Thorn Scribe is hunched and turned slightly (not perfectly square on); room 9 Crown Knight attack frame has the sword tip clipped by the sheet's top edge. Regenerate any of these if wanted.
- Attack frames are taller or wider than idle frames at the same h, so they will look a little larger.
