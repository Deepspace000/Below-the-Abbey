# XP per kill for a level 40 party (version 3.615)

How it works: a kill gives `base XP x creature level`. If the party's average level is above the creature's, it gives 6% less for each level of difference (never below 30%). Every living hero gets the full amount. Going from level 40 to 41 needs 24,600 XP.

A creature that stands 1 below a level 40 party gives 94% of the at-level amount less 2.5% for its lower level, so about 91.5% in total. One at level or above gives full XP.

## Ordinary creatures (112), smallest first

| Creature | Base XP | 1 level below (39) | At level (40) | 1 level above (41) | Kills for one level-up |
|---|---|---|---|---|---|
| Butterfly (`bfly`) | 0 | 1 | 1 | 1 | 24600 |
| Creature (`critter`) | 0 | 1 | 1 | 1 | 24600 |
| Green Slime (`slime`) | 30 | 1,100 | 1,200 | 1,230 | 20.5 |
| Tar Walker (`hgusl0`) | 30 | 1,100 | 1,200 | 1,230 | 20.5 |
| Cave Bat (`bat`) | 32 | 1,173 | 1,280 | 1,312 | 19.2 |
| Eye Puddle (`hgusl1`) | 33 | 1,210 | 1,320 | 1,353 | 18.6 |
| Flesh Maggot Demon (`hguyk0`) | 34 | 1,246 | 1,360 | 1,394 | 18.1 |
| Tentacle Ooze (`hgusl2`) | 36 | 1,320 | 1,440 | 1,476 | 17.1 |
| Chest-Eyed Crawler (`hguyk1`) | 37 | 1,356 | 1,480 | 1,517 | 16.6 |
| Slime Spider (`hgusl3`) | 39 | 1,430 | 1,560 | 1,599 | 15.8 |
| Black Rat (`rat`) | 40 | 1,466 | 1,600 | 1,640 | 15.4 |
| Grey Wolf (`wolf`) | 40 | 1,466 | 1,600 | 1,640 | 15.4 |
| Skinned Hound (`hguyk2`) | 40 | 1,466 | 1,600 | 1,640 | 15.4 |
| Slime Serpent (`hgusl4`) | 42 | 1,540 | 1,680 | 1,722 | 14.6 |
| Faced Centipede (`hguyk3`) | 43 | 1,576 | 1,720 | 1,763 | 14.3 |
| Maw Slime (`hgusl5`) | 45 | 1,650 | 1,800 | 1,845 | 13.7 |
| Split-Jaw Ghoul (`hguyk4`) | 46 | 1,686 | 1,840 | 1,886 | 13.4 |
| Slime Hound (`hgusl6`) | 48 | 1,760 | 1,920 | 1,968 | 12.8 |
| Horned Spider Demon (`hguyk5`) | 49 | 1,796 | 1,960 | 2,009 | 12.6 |
| Bandit Archer (`archer`) | 50 | 1,833 | 2,000 | 2,050 | 12.3 |
| Moth Cloud (`hgswarm1`) | 50 | 1,833 | 2,000 | 2,050 | 12.3 |
| Skull Slime (`hgusl7`) | 51 | 1,870 | 2,040 | 2,091 | 12.1 |
| Tentacled Eye Horror (`hguyk6`) | 52 | 1,906 | 2,080 | 2,132 | 11.8 |
| Many-Armed Horror (`hgusl8`) | 54 | 1,980 | 2,160 | 2,214 | 11.4 |
| Biter Swarm (`hgswarm0`) | 55 | 2,016 | 2,200 | 2,255 | 11.2 |
| Leather Imp (`hguyk7`) | 55 | 2,016 | 2,200 | 2,255 | 11.2 |
| Eye Mass (`hgusl9`) | 57 | 2,090 | 2,280 | 2,337 | 10.8 |
| Skull Pile (`hguyk8`) | 58 | 2,126 | 2,320 | 2,378 | 10.6 |
| Bandit (`bandit`) | 60 | 2,200 | 2,400 | 2,460 | 10.3 |
| Pharaoh's Servant (`pservant`) | 60 | 2,200 | 2,400 | 2,460 | 10.3 |
| Spined Bone Beast (`hguyk9`) | 61 | 2,236 | 2,440 | 2,501 | 10.1 |
| Castle Guard (`guard`) | 70 | 2,566 | 2,800 | 2,870 | 8.8 |
| Desert Wolf (`dwolf`) | 70 | 2,566 | 2,800 | 2,870 | 8.8 |
| Mire Tick (`hgins0`) | 70 | 2,566 | 2,800 | 2,870 | 8.8 |
| Skeleton (`skel`) | 80 | 2,933 | 3,200 | 3,280 | 7.7 |
| Bounty Hunter (`hunter`) | 80 | 2,933 | 3,200 | 3,280 | 7.7 |
| Blackened Swarm (`hgdswarm`) | 80 | 2,933 | 3,200 | 3,280 | 7.7 |
| Brown Bear (`bear`) | 85 | 3,116 | 3,400 | 3,485 | 7.2 |
| Ghost (`ghost`) | 90 | 3,299 | 3,600 | 3,690 | 6.8 |
| Desperate Nomad (`nomad`) | 90 | 3,299 | 3,600 | 3,690 | 6.8 |
| Desperate Nomad (`nomad2`) | 90 | 3,299 | 3,600 | 3,690 | 6.8 |
| Carrion Vulture (`vulture`) | 90 | 3,299 | 3,600 | 3,690 | 6.8 |
| Hive Grub (`hglarva`) | 90 | 3,299 | 3,600 | 3,690 | 6.8 |
| Spectre (`spectre`) | 100 | 3,666 | 4,000 | 4,100 | 6.2 |
| Spectre (`spectre2`) | 100 | 3,666 | 4,000 | 4,100 | 6.2 |
| Cobra (`cobra`) | 100 | 3,666 | 4,000 | 4,100 | 6.2 |
| Hitman (`hitman`) | 110 | 4,033 | 4,400 | 4,510 | 5.6 |
| Skeleton (`dskeleton`) | 110 | 4,033 | 4,400 | 4,510 | 5.6 |
| Giant Scorpion (`scorpion`) | 120 | 4,399 | 4,800 | 4,920 | 5.1 |
| Spiny Puffer (`uwpuffer`) | 120 | 4,399 | 4,800 | 4,920 | 5.1 |
| Reed Skitter (`hgins1`) | 120 | 4,399 | 4,800 | 4,920 | 5.1 |
| Hive Guard (`hgwasp`) | 120 | 4,399 | 4,800 | 4,920 | 5.1 |
| Glow Jelly (`uwjelly`) | 130 | 4,766 | 5,200 | 5,330 | 4.7 |
| Hollowed Grub (`hgdgrub`) | 130 | 4,766 | 5,200 | 5,330 | 4.7 |
| Barracuda (`uwbarra`) | 140 | 5,132 | 5,600 | 5,740 | 4.4 |
| Vine Snake (`hgwsnake`) | 140 | 5,132 | 5,600 | 5,740 | 4.4 |
| Mummy (`mummy`) | 150 | 5,499 | 6,000 | 6,150 | 4.1 |
| Reef Crab (`uwcrab`) | 150 | 5,499 | 6,000 | 6,150 | 4.1 |
| Hollow Slug (`hgdslug`) | 150 | 5,499 | 6,000 | 6,150 | 4.1 |
| Marsh Eel (`hgweel`) | 150 | 5,499 | 6,000 | 6,150 | 4.1 |
| Hollow Jelly (`hgdjelly`) | 160 | 5,866 | 6,400 | 6,560 | 3.8 |
| Pond Stalker (`hgins2`) | 170 | 6,232 | 6,800 | 6,970 | 3.6 |
| Wax Golem (`hggolem`) | 170 | 6,232 | 6,800 | 6,970 | 3.6 |
| Hollowed Guard (`hgdguard`) | 170 | 6,232 | 6,800 | 6,970 | 3.6 |
| Giant Piranha (`hgfpiranha`) | 180 | 6,599 | 7,200 | 7,380 | 3.4 |
| Lantern Beetle (`hgdbeetle`) | 190 | 6,965 | 7,600 | 7,790 | 3.2 |
| Reef Shark (`uwshark`) | 200 | 7,332 | 8,000 | 8,200 | 3.1 |
| Cave Spider (`hgdspider`) | 200 | 7,332 | 8,000 | 8,200 | 3.1 |
| Giant Mosquito (`hgmmosquito`) | 200 | 7,332 | 8,000 | 8,200 | 3.1 |
| Hollow Worm (`hgdworm`) | 210 | 7,699 | 8,400 | 8,610 | 2.9 |
| Barbed Lurker (`hgins3`) | 220 | 8,065 | 8,800 | 9,020 | 2.8 |
| Moray Eel (`uweel`) | 230 | 8,432 | 9,200 | 9,430 | 2.7 |
| Hollowed Golem (`hgdgolem`) | 230 | 8,432 | 9,200 | 9,430 | 2.7 |
| Big Bug (`hgdbug`) | 240 | 8,798 | 9,600 | 9,840 | 2.6 |
| Marsh Water Snake (`hgfsnake`) | 240 | 8,798 | 9,600 | 9,840 | 2.6 |
| Marsh Locust (`hgmlocust`) | 240 | 8,798 | 9,600 | 9,840 | 2.6 |
| Octopus (`uwoctopus`) | 260 | 9,532 | 10,400 | 10,660 | 2.4 |
| Bloodworm (`hgfbloodworm`) | 260 | 9,532 | 10,400 | 10,660 | 2.4 |
| Gulping Mantis (`hgins4`) | 270 | 9,898 | 10,800 | 11,070 | 2.3 |
| Water Scorpion (`hgfscorpion`) | 280 | 10,265 | 11,200 | 11,480 | 2.2 |
| Giant Horsefly (`hgmhorsefly`) | 280 | 10,265 | 11,200 | 11,480 | 2.2 |
| Giant Leech (`hgfleech`) | 300 | 10,998 | 12,000 | 12,300 | 2 |
| Marsh Hornet (`hgmhornet`) | 300 | 10,998 | 12,000 | 12,300 | 2 |
| Bog Cricket (`hgmcricket`) | 300 | 10,998 | 12,000 | 12,300 | 2 |
| Dusk Weaver (`hgins5`) | 320 | 11,731 | 12,800 | 13,120 | 1.9 |
| Diving-Bell Spider (`hgfspider`) | 320 | 11,731 | 12,800 | 13,120 | 1.9 |
| Razor Dragonfly (`hgmdragonfly`) | 340 | 12,464 | 13,600 | 13,940 | 1.8 |
| Clawing Hands (`hlhands`) | 350 | 12,831 | 14,000 | 14,350 | 1.8 |
| Giant Water Beetle (`hgfbeetle`) | 360 | 13,198 | 14,400 | 14,760 | 1.7 |
| Glass-Eyed Hunter (`hgins6`) | 370 | 13,564 | 14,800 | 15,170 | 1.7 |
| Cave Slime (`hlslime`) | 380 | 13,931 | 15,200 | 15,580 | 1.6 |
| Mud Crayfish (`hgfcrayfish`) | 380 | 13,931 | 15,200 | 15,580 | 1.6 |
| Bloated Bog Toad (`hgmtoad`) | 380 | 13,931 | 15,200 | 15,580 | 1.6 |
| Mire Beetle (`hgmbeetle`) | 400 | 14,664 | 16,000 | 16,400 | 1.5 |
| Hollow Crawler (`hgins7`) | 420 | 15,397 | 16,800 | 17,220 | 1.5 |
| Snapping Turtle (`hgfturtle`) | 420 | 15,397 | 16,800 | 17,220 | 1.5 |
| Maze Thief (`hgthief`) | 420 | 15,397 | 16,800 | 17,220 | 1.5 |
| Spindle Tyrant (`hgins8`) | 470 | 17,230 | 18,800 | 19,270 | 1.3 |
| The Great Insectivore (`hgins9`) | 520 | 19,063 | 20,800 | 21,320 | 1.2 |
| Drowned Swimmer (`hgo3`) | 600 | 21,996 | 24,000 | 24,600 | 1 |
| Bone-Fish Swarm (`hgo7`) | 700 | 25,662 | 28,000 | 28,700 | 0.9 |
| Hooked Leech (`hgo9`) | 750 | 27,495 | 30,000 | 30,750 | 0.8 |
| Black Eel (`hgo4`) | 800 | 29,328 | 32,000 | 32,800 | 0.8 |
| Sea Hag (`hgo5`) | 1000 | 36,660 | 40,000 | 41,000 | 0.6 |
| Lure Angler (`hgo1`) | 1100 | 40,326 | 44,000 | 45,100 | 0.6 |
| Blind Abyssal Crab (`hgo6`) | 1200 | 43,992 | 48,000 | 49,200 | 0.5 |
| Black Slime Serpent (`hgo8`) | 1400 | 51,324 | 56,000 | 57,400 | 0.4 |
| Toothed Leviathan (`hgo0`) | 1700 | 62,322 | 68,000 | 69,700 | 0.4 |
| Kraken Horror (`hgo2`) | 2000 | 73,320 | 80,000 | 82,000 | 0.3 |
| The Bogeyman (`hlbogey`) | 2500 | 91,650 | 100,000 | 102,500 | 0.2 |
| The Bogeyman (`hlbogeyw`) | 2500 | 91,650 | 100,000 | 102,500 | 0.2 |
| The Screaming Witch (`hlwitch`) | 3500 | 128,310 | 140,000 | 143,500 | 0.2 |

## Bosses, mini-bosses and named creatures (90)

| Creature | Base XP | 1 level below (39) | At level (40) | 1 level above (41) | Kills for one level-up |
|---|---|---|---|---|---|
| Assassin (`assassin`) | 140 | 5,132 | 5,600 | 5,740 | 4.4 |
| Cinderback, the Fire Lizard (`firelizard`) | 160 | 5,866 | 6,400 | 6,560 | 3.8 |
| Ash Guard (`ashguard`) | 160 | 5,866 | 6,400 | 6,560 | 3.8 |
| The Wandering Cyclops (`cyclops`) | 220 | 8,065 | 8,800 | 9,020 | 2.8 |
| Swamp Crocodile (`hgwcroc`) | 230 | 8,432 | 9,200 | 9,430 | 2.7 |
| Captain of the Hush Hive (`hgboss1`) | 280 | 10,265 | 11,200 | 11,480 | 2.2 |
| Royal Guard (`rguard`) | 300 | 10,998 | 12,000 | 12,300 | 2 |
| Murdered Peasant (`hlvictim`) | 350 | 12,831 | 14,000 | 14,350 | 1.8 |
| Mayor Corbin (`mayor`) | 400 | 14,664 | 16,000 | 16,400 | 1.5 |
| The Undying Pharaoh (`pharaohboss`) | 400 | 14,664 | 16,000 | 16,400 | 1.5 |
| Armoured Goblin (`hlgoblin`) | 420 | 15,397 | 16,800 | 17,220 | 1.5 |
| The Droning Warden (`hgboss2`) | 420 | 15,397 | 16,800 | 17,220 | 1.5 |
| Rat King (`boss`) | 500 | 18,330 | 20,000 | 20,500 | 1.2 |
| Raving Madman (`hlmadman`) | 550 | 20,163 | 22,000 | 22,550 | 1.1 |
| The Mother Grub (`hgboss3`) | 560 | 20,530 | 22,400 | 22,960 | 1.1 |
| Mine Overseer (`overseer`) | 600 | 21,996 | 24,000 | 24,600 | 1 |
| Wailing Ghost (`hlghost`) | 650 | 23,829 | 26,000 | 26,650 | 0.9 |
| Mayor Halbrecht (`halbrecht`) | 700 | 25,662 | 28,000 | 28,700 | 0.9 |
| Mad Jester (`hljester`) | 700 | 25,662 | 28,000 | 28,700 | 0.9 |
| Old Gnaw, the Great Slug (`hgdb_slug`) | 750 | 27,495 | 30,000 | 30,750 | 0.8 |
| The Pale Queen Jelly (`hgdb_jelly`) | 800 | 29,328 | 32,000 | 32,800 | 0.8 |
| Gandrick (`gandrick`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| Cinder Guardian (`cinder`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| Orc Brute (`hlorc`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| Chest Mimic (`hlmimic`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| Sea Serpent (`seaserpent`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| The Hive Queen (`hgboss4`) | 900 | 32,994 | 36,000 | 36,900 | 0.7 |
| The Lantern King (`hgdb_beetle`) | 950 | 34,827 | 38,000 | 38,950 | 0.6 |
| Phantom (`hlphantom`) | 1000 | 36,660 | 40,000 | 41,000 | 0.6 |
| Mother Silk (`hgdb_spider`) | 1000 | 36,660 | 40,000 | 41,000 | 0.6 |
| Grandfather Worm (`hgdb_worm`) | 1050 | 38,493 | 42,000 | 43,050 | 0.6 |
| Sir Wick, the Candle Knight (`w_candleknight`) | 1100 | 40,326 | 44,000 | 45,100 | 0.6 |
| The Glass Stag (`w_glassstag`) | 1100 | 40,326 | 44,000 | 45,100 | 0.6 |
| Wight (`hlwight`) | 1100 | 40,326 | 44,000 | 45,100 | 0.6 |
| Banshee (`hlbanshee`) | 1100 | 40,326 | 44,000 | 45,100 | 0.6 |
| The Wraith (`wraith`) | 1200 | 43,992 | 48,000 | 49,200 | 0.5 |
| The Crown Crab (`w_crowncrab`) | 1200 | 43,992 | 48,000 | 49,200 | 0.5 |
| The Horned Terror (`hgdb_bug`) | 1200 | 43,992 | 48,000 | 49,200 | 0.5 |
| The Hollow Beast (`hgdb_mixed`) | 1200 | 43,992 | 48,000 | 49,200 | 0.5 |
| White-Hot Sphere (`hgmini1`) | 1250 | 45,825 | 50,000 | 51,250 | 0.5 |
| The Weather Hound (`w_weatherhound`) | 1300 | 47,658 | 52,000 | 53,300 | 0.5 |
| Crimson Inferno Sphere (`hgmini2`) | 1300 | 47,658 | 52,000 | 53,300 | 0.5 |
| Blue Flame Sphere (`hgmini3`) | 1350 | 49,491 | 54,000 | 55,350 | 0.5 |
| The Many-Eyed Ox (`w_manyeyedox`) | 1400 | 51,324 | 56,000 | 57,400 | 0.4 |
| Great Molten Sphere (`hgmini0`) | 1400 | 51,324 | 56,000 | 57,400 | 0.4 |
| Green Fire Sphere (`hgmini4`) | 1450 | 53,157 | 58,000 | 59,450 | 0.4 |
| Demented Duke (`hlduke`) | 1500 | 54,990 | 60,000 | 61,500 | 0.4 |
| The Hollowed Warden (`hgdwarden`) | 1500 | 54,990 | 60,000 | 61,500 | 0.4 |
| Cinder-Core Sphere (`hgmini5`) | 1500 | 54,990 | 60,000 | 61,500 | 0.4 |
| Chancellor Vance (`chancellor`) | 1600 | 58,656 | 64,000 | 65,600 | 0.4 |
| Vampire (`hlvampire`) | 1700 | 62,322 | 68,000 | 69,700 | 0.4 |
| Shape Shifter (`hlshifter`) | 1700 | 62,322 | 68,000 | 69,700 | 0.4 |
| Headless Knight (`hlheadless`) | 1800 | 65,988 | 72,000 | 73,800 | 0.3 |
| Mantis Demon (`hgdemon0`) | 1800 | 65,988 | 72,000 | 73,800 | 0.3 |
| Scorpion Demon (`hgdemon1`) | 1860 | 68,188 | 74,400 | 76,260 | 0.3 |
| Werewolf (`hlwerewolf`) | 1900 | 69,654 | 76,000 | 77,900 | 0.3 |
| The Writhing Choir (`hlchoir`) | 1900 | 69,654 | 76,000 | 77,900 | 0.3 |
| Beetle Demon (`hgdemon2`) | 1920 | 70,387 | 76,800 | 78,720 | 0.3 |
| Wasp Demon (`hgdemon3`) | 1980 | 72,587 | 79,200 | 81,180 | 0.3 |
| The Butcher (`hlbutcher`) | 2000 | 73,320 | 80,000 | 82,000 | 0.3 |
| The Reef Warden (`uwgiant`) | 2000 | 73,320 | 80,000 | 82,000 | 0.3 |
| Centipede Demon (`hgdemon4`) | 2040 | 74,786 | 81,600 | 83,640 | 0.3 |
| Spider Demon (`hgdemon5`) | 2100 | 76,986 | 84,000 | 86,100 | 0.3 |
| Moth Demon (`hgdemon6`) | 2160 | 79,186 | 86,400 | 88,560 | 0.3 |
| Locust Demon (`hgdemon7`) | 2220 | 81,385 | 88,800 | 91,020 | 0.3 |
| Fly Demon (`hgdemon8`) | 2280 | 83,585 | 91,200 | 93,480 | 0.3 |
| Cicada Demon (`hgdemon9`) | 2340 | 85,784 | 93,600 | 95,940 | 0.3 |
| Lord Corvane (`corvane`) | 2400 | 87,984 | 96,000 | 98,400 | 0.3 |
| Skeleton Warlord (`hlwarlord`) | 2400 | 87,984 | 96,000 | 98,400 | 0.3 |
| The Abbey Eel (`uweelboss`) | 2400 | 87,984 | 96,000 | 98,400 | 0.3 |
| The Messenger of Death (`w_messenger`) | 2500 | 91,650 | 100,000 | 102,500 | 0.2 |
| The Vent Tyrant (`uwmega`) | 2800 | 102,648 | 112,000 | 114,800 | 0.2 |
| Flesh Abomination (`hlabom`) | 3000 | 109,980 | 120,000 | 123,000 | 0.2 |
| Old Gulper (`uwgulper`) | 3400 | 124,644 | 136,000 | 139,400 | 0.2 |
| Sut, Lord of the Red Desert (`sut`) | 5000 | 183,300 | 200,000 | 205,000 | 0.1 |
| Old Whiskers (`hgfcatfish`) | 5200 | 190,632 | 208,000 | 213,200 | 0.1 |
| The Weeping Brother (`weepingbrother`) | 6000 | 219,960 | 240,000 | 246,000 | 0.1 |
| The Black Leviathan (`hgoboss`) | 9000 | 329,940 | 360,000 | 369,000 | 0.1 |
| The Hollow Abbot (`hollowabbot`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| Hideous Phantom (`hlt0`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Laughing Fool (`hlt1`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Red Butcher (`hlt2`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Weeping Matron (`hlt3`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Pale Lord (`hlt4`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Singing Horror (`hlt5`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Kraken (`kraken`) | 12000 | 439,920 | 480,000 | 492,000 | 0.1 |
| The Gaunt King (`hlboss0`) | 30000 | 1,099,800 | 1,200,000 | 1,230,000 | 0 |
| The Smiling Queen (`hlboss1`) | 30000 | 1,099,800 | 1,200,000 | 1,230,000 | 0 |
| The Poison Duke (`hlboss2`) | 30000 | 1,099,800 | 1,200,000 | 1,230,000 | 0 |
| The Hollow Child-King (`hlboss3`) | 30000 | 1,099,800 | 1,200,000 | 1,230,000 | 0 |
