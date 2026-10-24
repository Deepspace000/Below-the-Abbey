# Damage per hit at level 40 (version 3.619)

Creature damage is `enemyStat(type, 40).dmg`: a random number between the two values for each hit that lands. Armour does not reduce it (only a "ward" effect does). The chance to hit is the creature's own value, lowered by 2.5% per point of the hero's armour and by dodge effects (never below 35% or above 95%).

The heroes below are the game's test party at level 40 with its strong rare weapons, so their damage is on the high side. Average hero health 473, average damage per hit 122.

| Hero | Class | Health | Armour | Weapon | Damage per hit |
|---|---|---|---|---|---|
| Sigrid | Warrior | 646 | 11 | Crownbreaker | 124-172 (average 148) |
| Gruff | Thief | 449 | 5 | Veilpiercer | 105-151 (average 128) |
| Sorcha | Mage | 307 | 6 | Hollow Scepter | 50-80 (average 65) |
| Wulfric | Priest | 490 | 12 | The Duke's Gavel | 124-174 (average 149) |

## Ordinary creatures (119), weakest first

| Creature | Damage per hit | Average | Chance to hit (before armour) | Health | Hits to kill an average hero | Average hero hits to kill it |
|---|---|---|---|---|---|---|
| Butterfly (`bfly`) | 2-2 | 2 | 0% | 1,021 | 236.5 | 8 |
| Creature (`critter`) | 2-2 | 2 | 0% | 1,233 | 236.5 | 10 |
| Cave Bat (`bat`) | 26-65 | 46 | 62% | 1,563 | 10.4 | 13 |
| Green Slime (`slime`) | 26-65 | 46 | 62% | 1,332 | 10.4 | 11 |
| Moth Cloud (`hgswarm1`) | 39-65 | 52 | 68% | 1,058 | 9.1 | 9 |
| Pharaoh's Servant (`pservant`) | 39-65 | 52 | 72% | 1,852 | 9.1 | 15 |
| Bandit Archer (`archer`) | 39-77 | 58 | 66% | 1,346 | 8.2 | 11 |
| Biter Swarm (`hgswarm0`) | 39-77 | 58 | 70% | 1,057 | 8.2 | 9 |
| Grey Wolf (`wolf`) | 39-77 | 58 | 72% | 1,384 | 8.2 | 11 |
| Mire Tick (`hgins0`) | 39-77 | 58 | 72% | 1,339 | 8.2 | 11 |
| Bandit (`bandit`) | 39-89 | 64 | 72% | 2,002 | 7.4 | 16 |
| Black Rat (`rat`) | 39-89 | 64 | 70% | 2,188 | 7.4 | 18 |
| Reed Skitter (`hgins1`) | 51-89 | 70 | 73% | 1,696 | 6.8 | 14 |
| Desert Wolf (`dwolf`) | 51-104 | 78 | 74% | 1,429 | 6.1 | 12 |
| Blackened Swarm (`hgdswarm`) | 65-116 | 90 | 72% | 1,435 | 5.2 | 12 |
| Bounty Hunter (`hunter`) | 65-116 | 90 | 70% | 2,091 | 5.2 | 17 |
| Carrion Vulture (`vulture`) | 65-116 | 90 | 74% | 1,507 | 5.2 | 12 |
| Cobra (`cobra`) | 65-116 | 90 | 80% | 1,131 | 5.2 | 9 |
| Desperate Nomad (`nomad`) | 65-116 | 90 | 72% | 2,085 | 5.2 | 17 |
| Desperate Nomad (`nomad2`) | 65-116 | 90 | 72% | 1,569 | 5.2 | 13 |
| Ghost (`ghost`) | 65-116 | 90 | 70% | 2,251 | 5.2 | 18 |
| Hive Grub (`hglarva`) | 65-116 | 90 | 72% | 2,059 | 5.2 | 17 |
| Pond Stalker (`hgins2`) | 65-116 | 90 | 74% | 2,143 | 5.2 | 17 |
| Glow Jelly (`uwjelly`) | 65-130 | 98 | 82% | 2,337 | 4.9 | 19 |
| Spectre (`spectre`) | 65-130 | 98 | 70% | 2,317 | 4.9 | 19 |
| Spectre (`spectre2`) | 65-130 | 98 | 70% | 2,498 | 4.9 | 20 |
| Castle Guard (`guard`) | 77-130 | 104 | 74% | 2,093 | 4.6 | 17 |
| Mummy (`mummy`) | 77-130 | 104 | 76% | 1,918 | 4.6 | 16 |
| Skeleton (`dskeleton`) | 77-130 | 104 | 86% | 2,017 | 4.6 | 16 |
| Spiny Puffer (`uwpuffer`) | 77-130 | 104 | 78% | 2,451 | 4.6 | 20 |
| Barbed Lurker (`hgins3`) | 77-142 | 110 | 76% | 2,679 | 4.3 | 22 |
| Barracuda (`uwbarra`) | 77-142 | 110 | 80% | 2,503 | 4.3 | 20 |
| Giant Scorpion (`scorpion`) | 77-142 | 110 | 74% | 1,570 | 4.3 | 13 |
| Hive Guard (`hgwasp`) | 77-142 | 110 | 78% | 2,492 | 4.3 | 20 |
| Murdered Peasant (`hlvictim`) | 77-142 | 110 | 72% | 2,088 | 4.3 | 17 |
| Maze Thief (`hgthief`) | 77-154 | 116 | 70% | 3,246 | 4.1 | 26 |
| Skeleton (`skel`) | 77-154 | 116 | 84% | 2,400 | 4.1 | 20 |
| Reef Crab (`uwcrab`) | 89-154 | 122 | 74% | 2,905 | 3.9 | 24 |
| Brown Bear (`bear`) | 89-169 | 129 | 78% | 2,820 | 3.7 | 23 |
| Cave Slime (`hlslime`) | 89-169 | 129 | 70% | 2,666 | 3.7 | 22 |
| Gulping Mantis (`hgins4`) | 89-169 | 129 | 77% | 3,002 | 3.7 | 25 |
| Ash Guard (`ashguard`) | 104-169 | 136 | 76% | 2,088 | 3.5 | 17 |
| Hitman (`hitman`) | 104-169 | 136 | 76% | 2,357 | 3.5 | 19 |
| Octopus (`uwoctopus`) | 104-169 | 136 | 76% | 2,653 | 3.5 | 22 |
| Hollowed Grub (`hgdgrub`) | 104-181 | 142 | 76% | 2,975 | 3.3 | 24 |
| Reef Shark (`uwshark`) | 104-181 | 142 | 78% | 2,859 | 3.3 | 23 |
| The Screaming Witch (`hlwitch`) | 104-181 | 142 | 70% | 2,645 | 3.3 | 22 |
| Assassin (`assassin`) | 116-181 | 148 | 80% | 1,624 | 3.2 | 13 |
| Dusk Weaver (`hgins5`) | 104-193 | 148 | 78% | 3,002 | 3.2 | 25 |
| Royal Guard (`rguard`) | 116-181 | 148 | 78% | 2,783 | 3.2 | 23 |
| Wax Golem (`hggolem`) | 104-193 | 148 | 74% | 2,673 | 3.2 | 22 |
| Clawing Hands (`hlhands`) | 116-193 | 154 | 82% | 2,756 | 3.1 | 22 |
| Moray Eel (`uweel`) | 116-193 | 154 | 80% | 2,697 | 3.1 | 22 |
| Hollow Slug (`hgdslug`) | 116-207 | 162 | 74% | 2,749 | 2.9 | 22 |
| Hollowed Guard (`hgdguard`) | 116-207 | 162 | 80% | 2,542 | 2.9 | 21 |
| Vine Snake (`hgwsnake`) | 116-207 | 162 | 82% | 3,015 | 2.9 | 25 |
| Lantern Beetle (`hgdbeetle`) | 116-220 | 168 | 76% | 2,428 | 2.8 | 20 |
| Armoured Goblin (`hlgoblin`) | 130-220 | 175 | 74% | 2,783 | 2.7 | 23 |
| Hollow Jelly (`hgdjelly`) | 130-220 | 175 | 78% | 2,804 | 2.7 | 23 |
| Cave Spider (`hgdspider`) | 130-232 | 181 | 80% | 3,167 | 2.6 | 26 |
| Glass-Eyed Hunter (`hgins6`) | 130-232 | 181 | 79% | 3,003 | 2.6 | 25 |
| Marsh Eel (`hgweel`) | 130-232 | 181 | 80% | 3,479 | 2.6 | 28 |
| Giant Piranha (`hgfpiranha`) | 130-258 | 194 | 80% | 4,638 | 2.4 | 38 |
| Hollow Worm (`hgdworm`) | 142-246 | 194 | 78% | 2,716 | 2.4 | 22 |
| Raving Madman (`hlmadman`) | 104-285 | 194 | 75% | 2,783 | 2.4 | 23 |
| Hollow Crawler (`hgins7`) | 142-258 | 200 | 80% | 3,004 | 2.4 | 25 |
| Big Bug (`hgdbug`) | 154-270 | 212 | 80% | 2,688 | 2.2 | 22 |
| Hollowed Golem (`hgdgolem`) | 154-270 | 212 | 78% | 2,903 | 2.2 | 24 |
| Giant Mosquito (`hgmmosquito`) | 154-309 | 232 | 80% | 5,101 | 2.0 | 42 |
| Spindle Tyrant (`hgins8`) | 169-297 | 233 | 82% | 3,005 | 2.0 | 25 |
| Marsh Locust (`hgmlocust`) | 181-335 | 258 | 82% | 6,029 | 1.8 | 49 |
| Marsh Water Snake (`hgfsnake`) | 181-335 | 258 | 84% | 6,029 | 1.8 | 49 |
| Swamp Crocodile (`hgwcroc`) | 193-335 | 264 | 80% | 6,956 | 1.8 | 57 |
| Tar Walker (`hgusl0`) | 193-335 | 264 | 82% | 8,348 | 1.8 | 68 |
| Bloodworm (`hgfbloodworm`) | 181-362 | 272 | 80% | 7,420 | 1.7 | 61 |
| Bog Cricket (`hgmcricket`) | 181-362 | 272 | 80% | 8,348 | 1.7 | 68 |
| Giant Leech (`hgfleech`) | 181-362 | 272 | 78% | 8,811 | 1.7 | 72 |
| Eye Puddle (`hgusl1`) | 207-348 | 278 | 82% | 8,996 | 1.7 | 73 |
| The Great Insectivore (`hgins9`) | 193-362 | 278 | 83% | 3,006 | 1.7 | 25 |
| Flesh Maggot Demon (`hguyk0`) | 207-362 | 284 | 82% | 8,811 | 1.7 | 72 |
| Giant Horsefly (`hgmhorsefly`) | 207-362 | 284 | 82% | 6,956 | 1.7 | 57 |
| Marsh Hornet (`hgmhornet`) | 207-362 | 284 | 84% | 6,493 | 1.7 | 53 |
| The Bogeyman (`hlbogey`) | 207-362 | 284 | 86% | 8,811 | 1.7 | 72 |
| The Bogeyman (`hlbogeyw`) | 207-362 | 284 | 86% | 8,811 | 1.7 | 72 |
| Tentacle Ooze (`hgusl2`) | 220-362 | 291 | 82% | 9,646 | 1.6 | 79 |
| Chest-Eyed Crawler (`hguyk1`) | 220-374 | 297 | 82% | 9,508 | 1.6 | 78 |
| Diving-Bell Spider (`hgfspider`) | 207-388 | 298 | 82% | 7,884 | 1.6 | 64 |
| Water Scorpion (`hgfscorpion`) | 207-388 | 298 | 82% | 6,956 | 1.6 | 57 |
| Slime Spider (`hgusl3`) | 232-374 | 303 | 82% | 10,295 | 1.6 | 84 |
| Bloated Bog Toad (`hgmtoad`) | 232-388 | 310 | 82% | 11,130 | 1.5 | 91 |
| Razor Dragonfly (`hgmdragonfly`) | 232-388 | 310 | 86% | 7,884 | 1.5 | 64 |
| Skinned Hound (`hguyk2`) | 232-388 | 310 | 82% | 10,203 | 1.5 | 83 |
| Slime Serpent (`hgusl4`) | 246-388 | 317 | 82% | 10,945 | 1.5 | 89 |
| Giant Water Beetle (`hgfbeetle`) | 232-413 | 322 | 84% | 9,739 | 1.5 | 80 |
| Faced Centipede (`hguyk3`) | 246-400 | 323 | 82% | 10,899 | 1.5 | 89 |
| Mire Beetle (`hgmbeetle`) | 258-388 | 323 | 84% | 10,666 | 1.5 | 87 |
| Maw Slime (`hgusl5`) | 258-400 | 329 | 82% | 11,594 | 1.4 | 95 |
| Mud Crayfish (`hgfcrayfish`) | 258-413 | 336 | 84% | 10,203 | 1.4 | 83 |
| Split-Jaw Ghoul (`hguyk4`) | 258-413 | 336 | 82% | 11,594 | 1.4 | 95 |
| Slime Hound (`hgusl6`) | 270-413 | 342 | 82% | 12,243 | 1.4 | 100 |
| Horned Spider Demon (`hguyk5`) | 270-427 | 348 | 82% | 12,290 | 1.4 | 100 |
| Snapping Turtle (`hgfturtle`) | 285-413 | 349 | 86% | 11,130 | 1.4 | 91 |
| Skull Slime (`hgusl7`) | 285-427 | 356 | 82% | 12,893 | 1.3 | 105 |
| Tentacled Eye Horror (`hguyk6`) | 285-439 | 362 | 82% | 12,985 | 1.3 | 106 |
| Many-Armed Horror (`hgusl8`) | 297-439 | 368 | 82% | 13,541 | 1.3 | 111 |
| Leather Imp (`hguyk7`) | 297-451 | 374 | 82% | 13,681 | 1.3 | 112 |
| Eye Mass (`hgusl9`) | 309-451 | 380 | 82% | 14,191 | 1.2 | 116 |
| Skull Pile (`hguyk8`) | 309-466 | 388 | 82% | 14,376 | 1.2 | 117 |
| Spined Bone Beast (`hguyk9`) | 323-478 | 400 | 82% | 15,073 | 1.2 | 123 |
| Black Eel (`hgo4`) | 309-620 | 464 | 85% | 16,231 | 1.0 | 132 |
| Black Slime Serpent (`hgo8`) | 309-620 | 464 | 85% | 25,506 | 1.0 | 208 |
| Blind Abyssal Crab (`hgo6`) | 309-620 | 464 | 85% | 23,188 | 1.0 | 189 |
| Bone-Fish Swarm (`hgo7`) | 309-620 | 464 | 85% | 13,913 | 1.0 | 114 |
| Drowned Swimmer (`hgo3`) | 309-620 | 464 | 85% | 12,058 | 1.0 | 98 |
| Hooked Leech (`hgo9`) | 309-620 | 464 | 85% | 15,073 | 1.0 | 123 |
| Kraken Horror (`hgo2`) | 309-620 | 464 | 85% | 34,781 | 1.0 | 284 |
| Lure Angler (`hgo1`) | 309-620 | 464 | 85% | 20,869 | 1.0 | 170 |
| Sea Hag (`hgo5`) | 309-620 | 464 | 85% | 18,550 | 1.0 | 151 |
| Toothed Leviathan (`hgo0`) | 309-620 | 464 | 85% | 30,144 | 1.0 | 246 |

## Bosses, mini-bosses and named creatures (83), weakest first

| Creature | Damage per hit | Average | Chance to hit (before armour) | Health | Hits to kill an average hero | Average hero hits to kill it |
|---|---|---|---|---|---|---|
| Cinderback, the Fire Lizard (`firelizard`) | 77-130 | 104 | 80% | 1,624 | 4.6 | 13 |
| The Wandering Cyclops (`cyclops`) | 77-130 | 104 | 78% | 2,088 | 4.6 | 17 |
| The Undying Pharaoh (`pharaohboss`) | 89-142 | 116 | 82% | 3,710 | 4.1 | 30 |
| Mayor Corbin (`mayor`) | 89-154 | 122 | 75% | 3,015 | 3.9 | 25 |
| Sir Wick, the Candle Knight (`w_candleknight`) | 104-169 | 136 | 76% | 1,739 | 3.5 | 14 |
| Sut, Lord of the Red Desert (`sut`) | 104-169 | 136 | 82% | 2,551 | 3.5 | 21 |
| The Glass Stag (`w_glassstag`) | 104-169 | 136 | 78% | 1,275 | 3.5 | 10 |
| Wailing Ghost (`hlghost`) | 104-181 | 142 | 76% | 3,246 | 3.3 | 26 |
| Mayor Halbrecht (`halbrecht`) | 116-181 | 148 | 78% | 4,290 | 3.2 | 35 |
| The Crown Crab (`w_crowncrab`) | 116-181 | 148 | 78% | 2,551 | 3.2 | 21 |
| The Weather Hound (`w_weatherhound`) | 116-181 | 148 | 80% | 1,391 | 3.2 | 11 |
| Rat King (`boss`) | 116-193 | 154 | 80% | 5,194 | 3.1 | 42 |
| Gandrick (`gandrick`) | 130-193 | 162 | 78% | 3,710 | 2.9 | 30 |
| Mad Jester (`hljester`) | 116-207 | 162 | 80% | 3,479 | 2.9 | 28 |
| Mine Overseer (`overseer`) | 130-207 | 168 | 78% | 4,870 | 2.8 | 40 |
| The Many-Eyed Ox (`w_manyeyedox`) | 130-207 | 168 | 80% | 3,479 | 2.8 | 28 |
| The Messenger of Death (`w_messenger`) | 130-207 | 168 | 80% | 1,624 | 2.8 | 13 |
| Banshee (`hlbanshee`) | 130-232 | 181 | 85% | 4,870 | 2.6 | 40 |
| Captain of the Hush Hive (`hgboss1`) | 130-232 | 181 | 82% | 4,638 | 2.6 | 38 |
| Chancellor Vance (`chancellor`) | 142-220 | 181 | 82% | 6,956 | 2.6 | 57 |
| Cinder Guardian (`cinder`) | 142-220 | 181 | 80% | 6,029 | 2.6 | 49 |
| The Wraith (`wraith`) | 142-220 | 181 | 80% | 2,088 | 2.6 | 17 |
| Lord Corvane (`corvane`) | 154-246 | 200 | 84% | 7,884 | 2.4 | 64 |
| Sea Serpent (`seaserpent`) | 154-246 | 200 | 84% | 5,565 | 2.4 | 45 |
| Phantom (`hlphantom`) | 154-258 | 206 | 80% | 4,638 | 2.3 | 38 |
| The Droning Warden (`hgboss2`) | 154-270 | 212 | 82% | 6,956 | 2.2 | 57 |
| The Reef Warden (`uwgiant`) | 169-258 | 214 | 84% | 9,739 | 2.2 | 80 |
| Old Gnaw, the Great Slug (`hgdb_slug`) | 154-285 | 220 | 74% | 11,826 | 2.2 | 97 |
| The Lantern King (`hgdb_beetle`) | 154-297 | 226 | 76% | 15,768 | 2.1 | 129 |
| The Abbey Eel (`uweelboss`) | 181-285 | 233 | 85% | 10,666 | 2.0 | 87 |
| The Mother Grub (`hgboss3`) | 169-297 | 233 | 82% | 8,348 | 2.0 | 68 |
| The Pale Queen Jelly (`hgdb_jelly`) | 181-297 | 239 | 78% | 8,673 | 2.0 | 71 |
| Mother Silk (`hgdb_spider`) | 181-309 | 245 | 80% | 13,403 | 1.9 | 109 |
| The Vent Tyrant (`uwmega`) | 193-297 | 245 | 86% | 12,058 | 1.9 | 98 |
| The Writhing Choir (`hlchoir`) | 181-309 | 245 | 80% | 12,058 | 1.9 | 98 |
| Wight (`hlwight`) | 181-309 | 245 | 82% | 5,565 | 1.9 | 45 |
| Chest Mimic (`hlmimic`) | 181-335 | 258 | 85% | 6,493 | 1.8 | 53 |
| Demented Duke (`hlduke`) | 181-335 | 258 | 80% | 7,884 | 1.8 | 64 |
| Grandfather Worm (`hgdb_worm`) | 193-335 | 264 | 78% | 14,979 | 1.8 | 122 |
| Old Gulper (`uwgulper`) | 207-323 | 265 | 86% | 13,913 | 1.8 | 114 |
| The Weeping Brother (`weepingbrother`) | 207-335 | 271 | 80% | 16,231 | 1.7 | 132 |
| Shape Shifter (`hlshifter`) | 207-362 | 284 | 85% | 8,811 | 1.7 | 72 |
| The Hive Queen (`hgboss4`) | 207-362 | 284 | 85% | 11,130 | 1.7 | 91 |
| The Hollow Beast (`hgdb_mixed`) | 207-362 | 284 | 80% | 18,133 | 1.7 | 148 |
| The Horned Terror (`hgdb_bug`) | 207-362 | 284 | 80% | 18,133 | 1.7 | 148 |
| The Laughing Fool (`hlt1`) | 207-362 | 284 | 88% | 10,435 | 1.7 | 85 |
| Vampire (`hlvampire`) | 207-362 | 284 | 85% | 9,275 | 1.7 | 76 |
| Orc Brute (`hlorc`) | 220-362 | 291 | 78% | 7,420 | 1.6 | 61 |
| The Kraken (`kraken`) | 232-362 | 297 | 90% | 34,781 | 1.6 | 284 |
| Crimson Inferno Sphere (`hgmini2`) | 232-388 | 310 | 78% | 23,188 | 1.5 | 189 |
| Hideous Phantom (`hlt0`) | 232-388 | 310 | 88% | 11,594 | 1.5 | 95 |
| The Hollowed Warden (`hgdwarden`) | 232-388 | 310 | 86% | 15,073 | 1.5 | 123 |
| The Weeping Matron (`hlt3`) | 232-388 | 310 | 88% | 11,594 | 1.5 | 95 |
| Werewolf (`hlwerewolf`) | 232-388 | 310 | 85% | 10,203 | 1.5 | 83 |
| White-Hot Sphere (`hgmini1`) | 258-413 | 336 | 82% | 17,623 | 1.4 | 144 |
| The Butcher (`hlbutcher`) | 258-439 | 348 | 82% | 12,058 | 1.4 | 98 |
| Green Fire Sphere (`hgmini4`) | 270-439 | 354 | 80% | 22,029 | 1.3 | 180 |
| Headless Knight (`hlheadless`) | 285-439 | 362 | 82% | 10,666 | 1.3 | 87 |
| Great Molten Sphere (`hgmini0`) | 285-466 | 376 | 80% | 20,869 | 1.3 | 170 |
| Cinder-Core Sphere (`hgmini5`) | 297-466 | 382 | 80% | 25,506 | 1.2 | 208 |
| Blue Flame Sphere (`hgmini3`) | 309-490 | 400 | 84% | 16,231 | 1.2 | 132 |
| Skeleton Warlord (`hlwarlord`) | 309-490 | 400 | 83% | 14,376 | 1.2 | 117 |
| The Pale Lord (`hlt4`) | 309-490 | 400 | 88% | 19,710 | 1.2 | 161 |
| Flesh Abomination (`hlabom`) | 309-516 | 412 | 84% | 22,029 | 1.1 | 180 |
| The Singing Horror (`hlt5`) | 309-516 | 412 | 88% | 23,188 | 1.1 | 189 |
| Mantis Demon (`hgdemon0`) | 335-543 | 439 | 84% | 27,825 | 1.1 | 227 |
| The Hollow Abbot (`hollowabbot`) | 335-543 | 439 | 86% | 60,288 | 1.1 | 492 |
| The Red Butcher (`hlt2`) | 335-543 | 439 | 88% | 16,231 | 1.1 | 132 |
| The Smiling Queen (`hlboss1`) | 335-567 | 451 | 90% | 14,376 | 1.0 | 117 |
| Scorpion Demon (`hgdemon1`) | 348-555 | 452 | 84% | 29,449 | 1.0 | 240 |
| Beetle Demon (`hgdemon2`) | 362-567 | 464 | 84% | 31,071 | 1.0 | 254 |
| The Hollow Child-King (`hlboss3`) | 335-594 | 464 | 88% | 15,304 | 1.0 | 125 |
| Wasp Demon (`hgdemon3`) | 374-581 | 478 | 84% | 32,695 | 1.0 | 267 |
| The Poison Duke (`hlboss2`) | 362-594 | 478 | 84% | 19,014 | 1.0 | 155 |
| Centipede Demon (`hgdemon4`) | 388-594 | 491 | 84% | 34,318 | 1.0 | 280 |
| Spider Demon (`hgdemon5`) | 400-606 | 503 | 84% | 35,941 | 0.9 | 293 |
| The Gaunt King (`hlboss0`) | 388-620 | 504 | 86% | 16,231 | 0.9 | 132 |
| Moth Demon (`hgdemon6`) | 413-620 | 516 | 84% | 37,564 | 0.9 | 307 |
| Locust Demon (`hgdemon7`) | 427-632 | 530 | 84% | 39,188 | 0.9 | 320 |
| Old Whiskers (`hgfcatfish`) | 388-671 | 530 | 88% | 97,388 | 0.9 | 795 |
| Fly Demon (`hgdemon8`) | 439-646 | 542 | 84% | 40,810 | 0.9 | 333 |
| Cicada Demon (`hgdemon9`) | 451-659 | 555 | 84% | 42,434 | 0.9 | 346 |
| The Black Leviathan (`hgoboss`) | 516-905 | 710 | 88% | 139,125 | 0.7 | 1136 |
