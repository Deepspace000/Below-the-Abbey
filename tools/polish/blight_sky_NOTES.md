# Blighted Lands storm skies and rain (src/desert/blight_sky.js)

Applies to levels 9610 to 9709 (road places, Vault of Maldrake surface 9670) and Sale 600, only when `LEVELS[LEVEL].outdoor` (interiors untouched). The Wenlock graveyard storm (gy_storm.js) is untouched; only its helpers gysNoise, gysP, gysSm, gysFork, gysPulse and gysRumble are reused.

## Pieces
- ORDER in tools/inject.py: `blight_sky.js` added after `blight58_polish.js` (the end of the blight files; jump_ready.js is not last in the current ORDER, it sits earlier).
- index.html: one edit on the `ovcLv` line: `||self.BKSKY_LV===LEVEL` and the panorama choice `LEVEL===530?self.GYS_PAN:self.BKSKY_LV===LEVEL?self.BKSKY_PAN:SKYOVC` (two places on that line).
- Sky: three parallax cloud banks, density noise made once (a few hundred ms on the first arrival), coloured per place (looks: 0 grey overcast, 1 dark thunderheads, 2 bruised grey-purple), `BKS_RED` table: places 3, 5, 7 (vault), 9 are red, others by seed (a third overall). Red = dusk glow low on the horizon, red-brown cloud, red flash and fog colour.
- Weather: `bksArrive` rolls the dice at each arrival (50 percent starts wet); wet and dry spells last 40 to 150 s, so about half the time it rains; strength drizzle (.2 to .45) in 40 percent of wet spells, else rain to downpour. Fade about 15 s. Rain also thickens `weatherNow` fog and haze (wrapper after the kit's) and darkens G.amb a little.
- Lightning with delayed thunder (gysRumble) in all weathers, more often in rain and for thunderheads; flash lifts ambient and lamps.
- Rain picture (bksOverlay/bksRain): wet-ground multiply wash, sky sheen, horizon mist, three streak layers (240/120/26 at full) each drawn as dim tail plus bright head, wind slant with gusts (density and speed rise in a gust), ground ripples with crowns (90 at most), shimmer dashes; near streaks go warm and brighter close to a lamp (level lights list). All particles live in typed arrays made once; no per-frame allocation except template-string colours.
- Sound: SMP.rain_loop (rate follows strength) plus a highpassed noise hiss, volume scaled by SNDOPT.amb and kept low (.07 and .05 at most); no explicit music ducking (modest level instead).
- Test hooks: `BKS.force=[1,strength]` (set `BKS.wet` too for an instant start), `BKS.hold` (flash ms), `BKS.off`, `bksStrike({fork:true})`.

## Rain drawing (second version, after critic rounds 3 to 5)
All streaks, ring and crown frames (atlas 8 x 26x14), puddles, lamp glow, gust sheet and horizon spray are drawn once per arrival into small offscreen canvases (`bksSprites`) and only blitted with drawImage. One canvas shear transform per streak layer gives the wind slant. Counts at full rain: far 190, middle 110, near 14 (9x96 with halo, warm variant near lamps), ripples 90, puddles 22, spray 18. A gust (every 5 to 8 s) swings the slant, raises density 40 percent and speed 15 percent and sweeps a soft rain sheet across the view. The lamp glow sits at the lamp's bearing (nearest lamp within 8 tiles, from LIGHTS and the level's `lights` list). Red places get red-tinted streak, ring and puddle sprites.

## Measured (headless swiftshader, so only relative)
Panorama slice 1.2 ms per frame (adaptive). Overlay in isolation with software rasterising about 24 ms for 90 percent rain, but whole frames were 110 to 157 ms with or without rain in that renderer, so the rain was lost in the noise; on a real GPU the roughly 500 drawImage calls of small canvases should cost well under 1 ms of JS. NOT measured on the owner's laptop: if frames drop in heavy rain, lower BKS_NF, BKS_NM and BKS_NR at the top of the rain section.

## Critic rounds
Five rounds in all (tools/polish/blight_rain_CRITIC1..5.md): 4, 4, 5, 6, 5 out of 10. The critic judges stills of a 420x210 retro view against AAA rain; the 7 target was not reached. Weakest marks stayed wet road sheen (3) and lamp interaction (3 to 4).

## Known gaps
No lamp reflection in the road, no roof or prop splashes, no muffled rain sound indoors, Sale 600 was only checked by eye in rain (walled street, little sky visible). Rain mist band, puddles and ripples are screen-space (they do not slide with the walls when you turn). Test server on port 8607 may still be running.

## Round 2 (29 Oct 2026)
- Thinner air in rain (critic fix 1): rain adds fog .005 (was .014), haze .04 (was .14, capped .5), mix .025; colour shift and ambient dip halved; storm tint, wet wash and sheen lighter; mist band weaker. Silhouettes now read at 6 to 10 squares in rain and the grey storm mood stays.
- Wet road extras (`bksWetExtras`, about 90 small blits, all from offscreen sprites): 16 glints (pale dashes) on the road; a warm vertical smear under each of the 4 nearest lamps in view (5 slices, shimmer, widening, fades with distance); splash crowns on the tops of up to 7 solid props and on the eaves of up to 5 roofs (from `LEVELS[id].sky`). `BKS.xOff=true` switches them off. Lamps, props and roofs are rescanned a few times a second (`bksScan`).
- Indoors: a room of the road above ground (not the Vault floors 9671 to 9678, not names with cellar, crypt, vault, tomb, pit, ossuary) keeps the weather clock running and plays the rain loop through a 520 Hz lowpass at 70 percent volume, no hiss (`BKS.in`). Weather of the last 25 seconds is kept across a door (no new dice), so rain heard indoors is still falling when you step out.
- Not measured on the owner's laptop; headless frame time is noise. Cost estimate: about 90 extra drawImage calls per wet frame. If it matters, drop the props and roofs loops first.
