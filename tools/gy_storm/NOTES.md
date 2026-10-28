# Stormclouds over the Wenlock graveyard (level 530): notes

Code: src/desert/gy_storm.js (header comment explains the design). Done and verified on 28 Oct: three parallax cloud banks in the sky panorama
(GYS_PAN read by the engine's sky code), greenish dusk weather ("Stormclouds"), double-flicker lightning every 6 to 20 s with optional fork and
delayed rolling thunder, a rain cycle (130 s calm, 150 s rain), rain loop sound, drifting leaves. Active only when LEVEL===530 and G.state==='play'.

Verification (tools/gy_storm/shoot.py, results.json, sheet.png): no console errors; frame cost with the effect on or off is the same within noise
(pano step about 1.3 ms); leaving to the crypt (531) or Wenlock clears rain, strike, thunder queue and light boost; flash returns the light to normal after.
Known and accepted: the sky is only seen when the view is clear of trees and walls; close up to a hedge the screen is just the hedge.
Test hooks: GYS.force (1 rain, -1 none), GYS.hold (freeze flash at a ms), GYS.off.
