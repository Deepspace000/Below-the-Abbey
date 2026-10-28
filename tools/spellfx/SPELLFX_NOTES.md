# Spell animations (src/desert/spellfx.js)

Every spell of the magic users (and every other class that has a spell list) has its own animation. The damage and the turn flow are not touched:
`heroSpecial` is wrapped, the cast is read afterwards (who lost health, who gained a status, who was healed, which buffs were added) and the pictures
are played from that. Healing and buffs glow on the portraits; foes get a charge, a projectile (or strike, wave, beam, stream, rain), an impact and a tint.

## What is covered

* The base spells of the Mage and Sorcerer (`sp:fire` Firebolt, `sp:frost` Frost Shard, `sp:light`).
* The class powers of Mage, Sorcerer and Priest (`pw:Fireball`, `pw:Chain Lightning`, `pw:Meteor`, `pw:Mage Armor`, `pw:Siphon`, `pw:Frost Nova`,
  `pw:Lightning Storm`, `pw:Cataclysm`, `pw:Blessing`, `pw:Mend`, `pw:Revive`, `pw:Greater Heal`, `pw:Divine Intervention`, `pw:Heal`).
* All 64 spells in `MX` (spells.js), keyed by their id (`m10`, `z40`, `c50`, ...), including the grand spells `m30b`, `z30b`, `c30b`, `c40h`.

## The registry: `SPREG`

`SPREG[id] = [element, delivery, buffStyle]`. Party-only spells (buffs, heals) have `0, 0, style`.

* element: `fire ruin frost bolt arcane poison holy shadow earth nature blood shout smoke gold disint chaos wind` (colours in `SPPAL`, impact look in `SPIMP`).
* delivery: how it reaches the foe (timings `SPDL = [charge, travel, stagger]`):
  `ball` (charge glow at the caster, projectile with trail, grows towards the foe), `meteor`, `arrow`, `lance`, `drain`, `beam`, `breath` (a stream),
  `rain`, `sky` (strike from above: bolt, light shaft), `chain` (strike plus arcs from foe to foe), `wave` (rings from the party), `burst`, `slash`
  (claw marks), `roots`, `swarm`, `chains`, `rift`, `poly` (smoke and stars), `steal` (coins fly to the purse), `punch`, `flurry`, `sleep`, `time`, `mark`, `light`.
* buff style (for what lands on the portraits): `ward` (rising rings), `rage` (flames), `mirror` (ghost copies), `bless` (golden shaft), `bark` (leaves),
  `banner` (gold chevron rings), `heal`, `cleanse`, `rise`. A heal always shows rising sparkles on whoever really gained health.

Marks on the foe (hold, sleep, fear, curse, blind, confuse, exposed, slow, bleeding) are shown automatically when the status really was applied.

## How to add an effect for a new spell

1. Nothing at all: a spell without an entry gets a look from `spAuto` (its name, its effects and its aim choose element and delivery; heals and buffs
   are recognised from the effect list). Spells of the `mx()` list and powers of Mage, Sorcerer and Priest are picked up automatically.
2. To choose the look: add a line to `SPREG` (`'xx1':['fire','ball']` or `'xx2':[0,0,'bless']`). For a power of another class, add `'pw:Name'` and the power
   is picked up for that class too (`spInfo`).
3. A new element: add colours to `SPPAL`, an impact function `SPIMP.name=(x,y,z,big,fx,tg,main)=>{...}` and, if wanted, a sound in `SPSND`.
   Helpers: `spFlash` (screen flash), `spRing`, `sObj` (painted bursts, bolts, shafts, tendrils, slashes, roots...), `pAdd`/`sBurst` (pooled particles),
   `spShake`, `spStop` (hit-stop, at most 0.1 s), `SPFX.tint.set(enemy,{m:mode,t:0,d:seconds})` (a tint on the creature: fire frost bolt arcane poison holy shadow disint).
4. A new delivery: add its timing to `SPDL`, a projectile drawing in `spProj` (if it has one) and, if it has extras at the impact, an entry in `SPDLX`.

## The moment of impact

The spell's damage is applied at once (as before), but the creature's picture waits for the impact moment: the white/red hit flash, the damage number
(it pops bigger for big hits), the thump of the blow and, for a kill, the fall. Held pictures are kept in `SPFX.held` and are released by `spRelease`.
Nothing blocks the turn: the only delay is the 0.3 to 0.5 s the picture takes to arrive. Hit-stop slows the world to 7 percent for 50 to 90 ms at the impact.

## Settings and performance

* `localStorage.abbeySpellFx` = `off`, `low` or `full` (also `SPFX.set('low')`). `low` uses 45 percent of the particles; the system also drops to 65 percent
  by itself when the frame time stays above 36 ms and recovers below 26 ms.
* A fixed pool of 620 particles (no allocation while a spell plays), at most about 150 per effect, at most 60 objects, sprites (glows, tongues, stars,
  vignettes, painted pictures with faded edges) are drawn once into small canvases and reused. Everything is drawn with `lighter` (additive) over the view, the smoke and
  rocks with normal blending, so it works in the dark Underlevel too.
* The old power animations of powerfx.js and the old blast and ice bursts of impact.js are silenced for the spells covered here (their sounds too).
* `SPFX.stat` = `{ms, n, max}`: the time spent in the effect code (milliseconds in total, frames, worst frame).

## Testing

`python -m http.server 8356` from the repo root, then `python tools/spellfx/spellfx_sheets.py [group ...]` writes a contact sheet per group
(`sheet_fire.png`, `sheet_frost.png`, ...: one row per spell, six frames across the effect). The game loop is stepped by hand
(`tools/spellfx/spellfx_lib.py`), so frames are captured at exact times after the cast.

## Class animations added (28 Oct, later pass)

* New object kinds in spObjDraw: dagger (a point-down dagger drops onto the foe and stays in for a moment; used by SPIMP.steel and SPIMP.deep for Thief and Assassin), vcut (a great sword chopping straight down; used by SPIMP.smash for Warrior, Barbarian and the big smash powers), icecase (white and blue crystals close round the foe and crack apart; used by SPIMP.frost on big hits and for blizzards).
* Ranger and Archer arrows are larger with a glowing head and big fletching; Arrow Rain and Arrow Storm drop seven arrows; long shots (Heartseeker, Killing Shot, Piercing, Perfect) add a shock ring and streaks on impact.

## Paladin, Monk and Goat (elements hallow, ki, goat)

Paladin: hammer slam (Smite, Righteous Blow twice), cross of light (Judgment), sun burst (Sunbrand). Monk: ki fists (palm, stun with dizzy stars, flurry hits via SPIMP.kihit), kick arcs, giant fist (Fist of the Mountain). Goat: ram horns and BONK/CRASH burst, hoof stomp, rock fall. The registry 4th field carries the variant (o.v). Check: python tools/spellfx/spellfx_sheets.py paladin monk goat. Objects added to spObjDraw: hammer rays cross fist hoof horns pow dizzy speed.
