# Oldhaven Tales: notes

Code: `src/desert/oldhaven_tales.js` (quests, people), `src/desert/oldhaven_under.js` (dungeons, hatches, quest items). Small hooks in `oldhaven.js`, `oldhaven_quay.js`, `oldhaven_bells.js`, `tools/inject.py` and the `AREAS` table in `index.html`. State is in `G.flags.oht`. Quests open once `G.flags.pardoned` is set.

## Quests (all area Oldhaven)
| id | title | giver and place | chain |
|---|---|---|---|
| ot1 | The Noon Bells | Verger Alma, Chapel Close (city) | A |
| ot2 | Mending the Bell | Bellfounder Tolliver, quay plaza (after ot1) | A |
| ot3 | The True Twelve | Verger Alma (after ot2); hear 12 true strokes at noon and midnight | A |
| ot4 | The Sewer Survey | Mistress Corvane, lanes (city) | B |
| ot5 | A Chart for the Woodwardens | Mistress Corvane (after ot4 and the siege); handed in to Hale in the Oakwood | B |
| ot6 | The Herald's Hat | the herald on the quay; clues from oh_w1 and oh_m2; hat in the crypt | C |
| ot7 | Three Pies | Dame Tansy, great square; pies to the herald, Captain Aldwyn, Sister Ilse | none |
| ot8 | The Lost Lad | Bess, near the manhole; Pip is in the sewer | none |
| ot9 | The Name on the Tomb | Odo Thane, Lantern Street; tomb in the crypt | none |
| ot10 | Wat Crowe | Constable Harl, castle ward; boss of the hideaway | none |

## Dungeons
- 6710 The Sewers of Oldhaven (rating 55): manhole in the city south of the great square, or the grating on the quay. Hidden door (press the loose brick in the Bricked Landing, north-east) leads to 6712.
- 6711 The Crypt Under the Chapel (56): hatch in Chapel Close.
- 6712 Crowe's Hideaway (57): through the hidden door in the sewer.
Bosses: The Grate King, The Crypt Warden, Wat Crowe (each with a chest). Quest destinations: ot2, ot4, ot6, ot8, ot9, ot10.

Jump links: `?town=ohsewer`, `?town=ohcrypt`, `?town=ohhide`.
