# Flying crows: notes (work PAUSED by the owner, art still to make)

## Every crow found

Creatures (all fly:true, all drawn as a crow STANDING with feet on nothing, so they hang in the air):
- `wwcrows` Crow Swarm, Blackbriar Wood (src/desert/ww_art.js, picture guardA_4, a swirl of crows with one standing crow). Also in ww_wood.js (WW_FOES, TIER).
- `wwcrow` Carrion Crow, Blackbriar Wood (ww_art.js, picture guardB_4, a crow standing with its wings half open). Also summoned by ww_quests.js (totem fight, witch fight in the cottage).
- `gyraven` Carrion Raven, graveyard and Pale Catacombs (gy_art.js, picture crB_6, a side-on perched raven). Placed in gy_yard.js FOES and gy_mazes.js.

Perched and fine, left alone because they stand on a surface:
- `ww_crowtree` decor (propsB_4): crows on the branches of a dead tree.
- `gy_rpost` decor (sceneB_5): a raven standing on a wooden post (graveyard, and wenlock_river.js).
- Parchment maps and marginalia (maps_*.js, marginalia_*.js) are drawings in books and maps, not game sprites.
- No ambient crows exist (WD_KIND in the wanderers code has squirrel, rabbit, deer, bee only).

## What is done

- `src/desert/crows.js` (added to tools/inject.py ORDER just before jump_ready.js, injected, parses with node --check). It loads
  `assets/crow/crow_0..2`, `flock_0..2`, `carrion_0..3` (webp) and, once a set is loaded, switches the three creature kinds to it
  (kind ids and stats unchanged, so old saves work): new picture key, width, and floatH computed from the body height.
  A wrapper on `spriteList` swaps the picture for the wing beat (up, level, down, level, each crow out of step; the fourth carrion
  picture is a dive pose shown while it lunges; a dying crow shows wings down) and adds a soft ground shadow under each flyer (the
  engine draws none for flyers). Until the pictures exist nothing changes: the old pictures stay. Hit flash, the red wash near death,
  fade and spell targeting use the same sprite path and are untouched.
- `tools/crows/ingest_crows.py`: cuts a sheet on flat magenta into frames on one common canvas (tested on a thumbnail), writes
  `assets/crow/<name>_<k>.webp` and `assets/crow/manifest.json`.
- `tools/crows/crow_test.py`: one-browser Playwright script (port 8354, files go to `_crow_shots/`); NOT yet run.

## What remains

1. The art. Canva `generate-image` works (one sheet made: three front-on flying crows on magenta, wings up, level, down, looked
   good) but returns only a 200 px thumbnail, so it cannot be used. Gemini and ChatGPT tabs in Chrome froze every time because the laptop
   was at 100 percent CPU with about 36 headless Chrome processes. When the machine is quiet: make with Gemini (helpers in
   tools/kh_gemini_helpers.js, receiver tools/mg_recv.py) three sheets on flat magenta, STRICT FRONT ELEVATION: crow in three
   wing poses (3 pictures side by side); flock of 5 to 7 crows at different sizes (3 pose variants, 3 pictures); a larger, scruffier
   Carrion Crow in four pictures (wings up, level, down, dive with wings wide). Look at each. Then
   `python tools/crows/ingest_crows.py <sheet> crow 3`, `... flock 3 split=cols`, `... carrion 4`.
2. Check sizes in `CROW_KIND` (span, body, rise) in crows.js against screenshots at 2, 4 and 6 squares; set `body` to the
   bodyY value printed by the ingest (manifest.json).
3. Run `python tools/crows/crow_test.py` on your own server (python -m http.server 8354), look at all pictures, no console errors.
4. Pictures go in assets/crow (pack_itch.py packs everything under assets/). Do not commit, push or bump the version (owner's rule for this task).
