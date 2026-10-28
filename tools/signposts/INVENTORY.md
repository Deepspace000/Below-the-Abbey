# Signposts: inventory and what was done

Found by loading every level in the earlier game in a browser and listing every decor piece (and every NPC id) whose picture, id or name contains sign, post, board, arrow or finger. Code: `src/desert/signposts_towns.js` (uses and extends `wlnPostPic` in `src/desert/wenlock_names.js`).

## Signs that point to a town or place (changed: names now lettered on the boards)

| Level | x,y | Was | Said | Points to (compass) | Now |
|---|---|---|---|---|---|
| 32 Greendale Forest | 14,29 | greensign / gsign | ANAEA and THE OLD GROVE (one text for all three posts) | Anaea east, Old Grove north east | boards ANAEA and THE OLD GROVE, brown, own examine text |
| 32 Greendale Forest | 33,13 | greensign / gsign | same | Anaea east, Old Grove north east | teal boards, own text |
| 32 Greendale Forest | 56,10 | greensign / gsign | same | Anaea east (a few steps), Old Grove north | green boards, own text |
| 496 Wenlock | 4,49 | greensign / wlo_signpost | west TO THE WESTERN KINGDOMS (not yet open), east TO THE GARDENS | west, east | boards THE WESTERN KINGDOMS (ahead) and THE GARDENS (behind) |
| 496 Wenlock | 39,5 | greensign / wwo_lanesign | BLACKBRIAR, NO CHILDREN joke | Blackbriar Wood north | board BLACKBRIAR WOOD |
| 496 Wenlock | 5,30 | greensign / gyo_lanesign | CHURCHYARD LANE, to the old churchyard | west | board CHURCHYARD LANE |

Arrows: left or right of the viewer for a place to the side, a rounded board with a triangle up for straight ahead, down for behind, worked out for the way the party usually walks up (the `f` of each post). The game has no distances for these roads, so the text gives only the name and the compass point.

## Signs that already show a name lettered on the board (left alone)

| Level | Signs | Text |
|---|---|---|
| 400 to 423 Pilgrim's Path | one per km (`lp_sign_N`), `lp_sign_mon` at 411 (76,303) | TO YARRIM, N km; SAINT ELEN'S, monastery 300 m |
| 290 Yarrim | `lp_sign_up` (added when the path is done) | THE LAND PATH, one way only |
| 3 Thornwick, 13 Ironhill | `sign_thornwick` (33,16), `sign_ironhill` (15,14) | the town's own name at its gate (not pointing anywhere) |

## Signs that point to nothing (left alone)

- Shop, inn, church and house hanging signs: Thornwick (3), Ironhill (13), Anaea (33), Yarrim (290), Oldhaven (305), Oldhaven Quay (304), Wenlock houses and street plates (already lettered by wenlock_names.js).
- `sign_rubymaze` STAY OUT (13, 34,25), `sign_hsown` YOUR HOUSE.
- Notice boards: Thornwick and Ironhill `notice`, Harbourmaster's office `noticeboard`.
- Blackbriar Wood `wwo_sign` and `wwo_plaque` joke signs (520), graveyard `gyo_sign` and `sign_gy` (530 to 535), Under the Wenlock Well wm_signpost notes, Deeper Hollow signs and posts (475 to 477): hints and jokes, not roads to a town.
- `yar_driftwood` post on the Yarrim pier (290, 85,43), cairns and prayer-flag poles on the Greyfang Pass (22), standing stones.

## Nothing found

No signposts at all in the abbey grounds and Thornwood (2), Gandrick's Wood (7), the Ironhill Road (10), Ironhill Moor (19), the Greyfang Pass (22), the Overgrown Hollow (39), the Sand Road (41), the Red Dunes (43), Oldhaven's streets (305) or Saint Elen's Monastery (430 onward).
