# Polish round: Rookery Mill, Pale Bridge, Sale, new Wenlock additions

Branch `worktree-agent-a1901c4b4f4ca4fea` (main merged in first). Not versioned, pushed or sent to itch. Critic list: `blight9sale_CRITIC.md`.

## What changed (all in my files; no level, quest or exit ids changed)
- `sale_art.js`: stand-ins replaced by filters over painted props: gibbet = hanging cage with skeleton (`hl_p_cage`), dead fountain = stone fountain (`fountain`), plague cart = covered cart (`cart`), plus a dead well and plague coffins. Ghosts rebuilt (drained colour, blue light, glow, fade). If real pictures are ever painted into `assets/sa/` (manifest names gibbet, fountain, cart) they win over the filters.
- `sale_town.js`: candle light at 12 doors (`SA.litWindows`), ravens, gravestones and candles in the quiet streets, a dead well, coffins by the cart; four more enterable homes (`SA_HOMES` reeve, midwife, billet, cats = the Wool Merchant's House) on lots TW 46, TE 48, BW 32, BE 24. Their ids follow the lot order (7229, 7233, 7238, 7239); the shops and the existing cottages keep theirs only if no lot before them changed: the lot list gained no new entries, only names, so ids are the same as before.
- `sale_rooms.js`: every home room is dimmer and gets webs, bones and a candle.
- `blight_rookery.js` (holds the shared helpers `b9Art`, `b9Late`, `b9Dim`, `b9Mist`, `b9Boundary` for places 9 and 10): dark roofs, walls, fences, huts, twigs; the plague cart; dark map edge; mist and reeds on the millrace; interior walls dark stone.
- `blight_palebridge.js`: the same, plus a black ravine floor with mist and dead roots, lit gate towers.
- `wenlock_thief.js`: the four houses get four different home types, owner-themed extra props, and are dimmed to .4 (they open at night only).
- `wenlock_den.js`: burrow walls are dark stone (the maze rows now use the room's wall character `w`), dead-end props and webs.
- Tools: `tools/polish/b9s_*.py|json|js` (shots, contact sheets, hide-one-thing, page eval, `b9s_check.py` runs `node --check` over every script block).

## Tests (own port 8791; one at a time)
`blight8910_test.py load`, `links`, `quests`: pass. `wenlock_thief_test.py 8791`: 112 of 112. `bracken_den_test.py` (BDEN_PORT=8791): all passed. `wenlock_market_test.py` (WM_PORT=8398; the default 8391 was taken by another server and failed with a missing quest): all passed. `sale_test.py all`: one failure, "east gate is shut until a road is attached", which is expected now that the Blighted Road attaches the road (it failed before this round too: the test was written before the road existed). `node --check` of every script block: clean.

## Still open (see critic)
- White paling-like strips on the far horizon at the Rookery race and Pale Bridge ravine: not a sprite, not map edge, not terrain; the cause was not found.
- Painted art still wanted (Chrome was not connected): dead-quarter ground variants, a painted gibbet, fountain and plague cart (filters are stand-ins), a ghost villager sheet, painted barricade boards, ravine cliff pictures.
- Sale quiet lanes: shutters, street-crossing lanterns, fog banks. Rookery and Pale Bridge ground is still one flat green.
