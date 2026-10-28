# Blight places 5 to 8: polish notes (29 Oct 2026)

Branch `worktree-agent-a3b93fcabf38a6350`. See `blight5to8_CRITIC.md` for the findings.

## What changed
- New file `src/desert/blight58_polish.js` (last in ORDER). It wraps `KH_LAZY` for 9650, 9660, 9680 and adds to the finished level: ground patches (`b58Ground`), ground ravens (`b58Crows`), braziers with warm lights (`b58_brazier`, from `hpb_brazier_4`), light pools, crates and carts in the Lanternrest yard (each blocking prop kept only if the walkable area stays the same, `b58Add`), banners on the outer wall, wall-stair notices (`b58_wallsign`), darker willow and moss oaks (`b58_ww_*`), tomb ceiling for rooms 9652, 9653, 9686.
- `blight_orchard.js`: harvest bell is the painted bronze church bell (`bo_bell`, from `hpb_bell_4`); bleached trees darker; crypt and cellar get cobble floor and stone wall.
- `blight_hollowbell.js`: the silver bell is `hpb_bell_4` greyed.
- `blight_lanternrest.js`: lighter tent interiors, a warm light in every second tent, fog lowered.
- `vault_build.js`: lock tile emissive .3 to .14, gain 1.1 (no more blank bright block above the gates); `vault_floors.js`: floor 5 brick tinted down.
- Tools: `tools/polish/b58_tour.py` (tour with optional JS per shot, split on the first `|`), `b58_sheet.py` (contact sheet), `b58_dump.py` (sheet of IMG keys), `b58_patch*.py` (one-off edit scripts).

## Tests (own port 8631, one mode at a time)
blight56_test: load, quests, shop, rest, save, walk all pass. `links` fails for place 7 only (the Vault 9670 has no kit doors; the test still expects the old stub doors): not caused by this round. blight8910_test: load, links, walk, save, quests pass. vault_test struct: 147 checks, 0 FAIL. `node --check` of all script blocks: clean.

## Remaining (needs painted pictures or a decision)
Skull-apple tree, ruined church, battlemented wall, soldier tent, painted locks and silver figures; the pale palings band at the horizon (engine edge, not found); floor 2 and 3 first foe 5 squares from the stair; giant signpost on the hill; dark tree trunk near the Hollowbell foundry.
