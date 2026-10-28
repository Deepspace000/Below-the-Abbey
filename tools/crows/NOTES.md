# Flying crows: notes (finished 28 Oct)

Creatures changed (all fly:true; kind ids and stats unchanged so old saves work): wwcrows (Crow Swarm), wwcrow (Carrion Crow), gyraven (Carrion Raven).
Perched crows (ww_crowtree, gy_rpost) and the crows on parchment maps are left alone.

Art (Gemini, painterly, STRICT FRONT ELEVATION, flat magenta, each sheet looked at): assets/crow/crow_0..2 (wings up, level, down), flock_0..2 (six crows,
three wing poses; the sheet came with a ghost row that was cropped away), carrion_0..3 (ragged crow, three poses and a dive; a ghost smudge was painted out).
Cut with tools/crows/ingest_crows.py (needs opencv-python-headless). src/desert/crows.js swaps the frames for the wing beat, adds a ground shadow, and
uses the body heights from manifest.json (flock .576, carrion .71, crow .709).

Test: tools/crows/crow_test.py (own server on 8354; set BTA_CHROME to a headless shell exe if playwright's own browser is missing). The test used to
freeze the foe with e.chilled, which tints it blue; that was removed. Checked at 2, 4, 6 squares, wing cycle, hurt: no console errors, crows read as
front-on flying birds with a shadow below. Black on the dark wood fog they are faint at 6 squares (expected).
Not done: sizes were not tuned further (span 1.55, 1.4, .8 squares).
