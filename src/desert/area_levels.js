/* ==========================================================================
   AREA LEVELS (prefix alv / ALV). Some areas were never given a level on the ladder (LEVEL_RATING), so their creatures stood at the level they were first built at, far below the place around them: the 52 desert dungeons
   stood at 14 to 21 inside deserts rated 36 to 45, and Saint Elen's Monastery (its grounds, buildings, cellars and crypts) stood at 16 to 33 on the level 55 Pilgrim's Path. Each now takes the level of its surroundings:
   a dungeon the level of its desert, the Golden Pyramid the level of the deserts, and the monastery the level of the Pilgrim's Path. (With autoscaling on, levels come from the party, as before.)
   ========================================================================== */
{const DES={'The Sand Road':41,'The Red Dunes':43,'The Blue Dunes':60,'The Golden Erg':61,'The Violet Erg':62,'The White Dunes':63,'The Flatlands':64};
  if(typeof DNG_INFO!=='undefined')for(const k of Object.keys(DNG_INFO)){const n=+k,d=DNG_INFO[k],main=DES[d.desert];if(main!==undefined&&LEVEL_RATING[main]&&LEVEL_RATING[n]===undefined)LEVEL_RATING[n]=LEVEL_RATING[main]}
  if(LEVEL_RATING[65]===undefined&&LEVEL_RATING[60])LEVEL_RATING[65]=LEVEL_RATING[60]; // the Golden Pyramid
  const path=LEVEL_RATING[400]||55;for(const n of [430,431,432,433,434,6900,6901,6902,6903,6904,6905,6906])if(LEVEL_RATING[n]===undefined)LEVEL_RATING[n]=path}
