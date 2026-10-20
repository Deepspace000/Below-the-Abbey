/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: PAINTED ART, PART 2 (prefix hgtb). Neutral creatures, townsfolk at work, tube and pool textures, props, new walls,
   creature skins and feathers, fish and tank pieces, vines, planets, clouds, rings. All pictures are painted with Gemini and cut with
   tools/split_hgt.py (soft magenta key via ingest_hgt_sprite.py) and tools/ingest_tex.py. Files are assets/ds_<name>.png, assets/ds_tex_<name>.png,
   assets/ds_floor_<name>.png, assets/ds_ceil_<name>.png; DS_PAINTED (artlist.js) loads them at start, so every sprite below is IMG[<name>] and every
   wall is IMG['art_tex_'+<name>] (use hgtaWallTile). Nothing is drawn in code. Heights are game units (eye 0.5, wall 2.4, cell about 3 m).

   SPRITES (IMG[name], NPC_H[name]; strict front elevation unless noted; transparent background):
   NEUTRAL CREATURES (16 species, pet-like fish/insect/alien blends; size S pet, M, L gentle bulk):
     hgtb_pinkbulb .45 S pink jelly-bulb on thin insect legs, antennae   hgtb_lilacmoth .75 S lilac moth-fish with wing-fins (floats)
     hgtb_lanternbeetle .55 S amber lantern-beetle-eel, glowing sac       hgtb_pearlslug .4 S cream pearl-slug with fins
     hgtb_aquawhale 1.5 L aqua bulb-whale on four legs                    hgtb_jadefinmoth .8 M jade fin-moth (floats)
     hgtb_spindleray .75 M pink spindle-spider-ray                        hgtb_amberpup .35 S amber shell-puppy
     hgtb_fishbeetle .8 M lilac fish-beetle, whiskered snout              hgtb_creamjelly .9 M cream jelly with lights inside (floats)
     hgtb_jadeeel .6 S jade lantern-eel                                   hgtb_fishfly .7 M pink and aqua winged fish-fly (floats)
     hgtb_peachwhale 1.9 L peach bulb-whale on six legs                   hgtb_creammoth .5 S cream moth-fish
     hgtb_pups .4 S two lilac shell-puppies together                      hgtb_spindlespider .7 M aqua spindle-spider
   TOWNSFOLK AT WORK (fishfolk, 12 poses, height 1.15 like hg_npc*): hgtb_sweep (broom, teal apron) hgtb_basket (rose tunic) hgtb_water (watering can, lilac)
     hgtb_polish (polishing a lamp, mustard) hgtb_read (sitting on a stool reading, sage) hgtb_fisher (fishing rod, sky blue, straw hat)
     hgtb_watch (arms folded, orange cloak) hgtb_walk (bundle on a stick, plum) hgtb_plantbed (kneeling, green apron) hgtb_jar (jar on shoulder, coral)
     hgtb_lantern (lantern on a pole, teal cloak) hgtb_elder (white whiskers, cream robe, stick)
   PROPS: hgtb_bench .6 (round shell bench) hgtb_chair .9 (empty chair) hgtb_shrine 1.1 (tiny shrine) hgtb_lampwhite 1.2 (round globe lamp, WHITE, tint it
     by code) hgtb_glasspost 2.3 (glass lamp-post) hgtb_table .7 (round table with teapot)
   FISH (side view facing left, for tanks): hgtb_fish_neon angel eel lanternfish jelly snailfish seahorse pearlray insectfish puffer nautilus crabfish
     seadragon flounder octopus starfish clam glassfish (18). Draw about 0.25 to 0.5 high in a tank (glassfish is long, 391x160 px).
   TANK PIECES: hgtb_tank_seagrass kelp coral rock anemone ruinarch (plants and rocks), hgtb_tank_bubbles (small rising bubbles), hgtb_tank_bubbles3,
     hgtb_tank_tall (empty tall glass tank front, 316x400 px), hgtb_tank_round (round bowl on a pedestal, 325x400 px).
   CREATURE PICTURES FOR 3D MODELS: hgtb_eye1..6 (front-on glossy eyes: gold slit, aqua round, violet star, pearl green ring, amber bar, black rainbow
     compound), hgtb_wing_insect, hgtb_wing_bat, hgtb_wing_butterfly (translucent wing flat, attachment on the left), hgtb_feather_peacock1,
     hgtb_feather_peacock2 (eyed feathers), hgtb_feather_iridescent, hgtb_feather_down, hgtb_peacockfan (full eyed tail fan, 597x512 px).
   VINES (decals over a wall; tall ones about 1 cell wide, 2 to 4 cells high): hgt_vine_ivy creeper wisteria tendril roundleaf stars (tall);
     hgt_vine_cornerTL hgt_vine_cornerBR (corner pieces), hgt_vine_wreathround hgt_vine_wreatharch (window frames, hollow in the middle),
     hgt_vine_curtain (hangs from the top), hgt_vine_garland (horizontal band).
   PLANETS (IMG[name] is a 1024x512 equirectangular map, seamless left-right, RGB): hgt_planet_orange ocean gas pearl jade violet ice lava desert
     cratered crystal coral. (orange and ocean were painted at half width and stretched.)
   CLOUDS (soft pictures on BLACK, no alpha: use brightness as alpha): hgt_cloud_pink1 aqua1 aqua2 lilac1 lilac2 cream1 cream2 pinkstreak.
     RINGS (strips on black, radius runs down the picture): hgt_ring_gold hgt_ring_pastel.

   TEXTURES (128x128; IMG['art_tex_'+name], use hgtaWallTile(name, wh) or hgtbWall(x, wh)):
   WALLS W2, names 'hgt_w2_<x>', tile sideways and vertically (edges blended):
     circles: rings bubbles portholes scales ringbubbles medallions; dots: polkapink polkaaqua dotsyellow pointillist confetti constellation;
     scribbles: scribblepink doodleaqua crayon wavylilac crosshatch loopsmint; very detailed: mosaic filigree tessel quilt map script;
     feature tiles (one window, door or band, centred): winpink (arched window) winaqua (shuttered window) portlilac (gold porthole) doorteal (arched door)
     doorblue (round door) bandjade (gold scallop band with tiny window).
   TUBE wall: tex 'hgtb_tube' (ribbed shell passage). TUBE CEILING: CEILS['hgtb_tubeceil'].
   CREATURE SKINS (tile): tex hgtb_limbs (bone and shell limbs), hgtb_skinpink, hgtb_skinaqua, hgtb_skinlilac, hgtb_skinamber (mottled bulk skin), hgtb_scales
     (leg and beak scales); water backgrounds hgtb_tankbg1..4 (light rays; IMG['art_tex_hgtb_tankbgN']).
   POOL FLOORS (FLOORS[name], L.floor): hgtb_pool (still luminous water surface), hgtb_deep (deep water), hgtb_uwsand, hgtb_uwcobble, hgtb_uwslab,
     hgtb_uwglass (underwater floors).
   MASSIVE SKY SCORPIONFISH (for 3D models): tiles tex hgtb_scorp_body (mottled camouflage), hgtb_scorp_warts, hgtb_scorp_belly, hgtb_scorp_tassels (fringed flaps);
     cut-outs IMG: hgtb_scorp_dorsal (fan spiny dorsal fin, base along the bottom), hgtb_scorp_pectoral and hgtb_scorp_tail (attachment on the left),
     hgtb_scorp_smallfins, hgtb_scorp_eye (eye and gill cover), hgtb_scorp_mouth (front-on), hgtb_scorp_barbels (hanging, top attached), hgtb_scorp_spine,
     reference paintings hgtb_scorp_ref_side and hgtb_scorp_ref_front (whole fish).
   FLYING LEVIATHANS (tex tiles; cut-out faces front-on): whale: tex hgtb_levi_whale_body, hgtb_levi_whale_fin, IMG hgtb_levi_whale_face; manta: tex
     hgtb_levi_manta_body (top), hgtb_levi_manta_wing (underside), IMG hgtb_levi_manta_face; eel-dragon: tex hgtb_levi_eel_body (scales), hgtb_levi_eel_fin
     (ridge fin membrane), IMG hgtb_levi_eel_face (head, side-on); jelly-whale: tex hgtb_levi_jelly_body (translucent bell), hgtb_levi_jelly_fin (frill membrane),
     IMG hgtb_levi_jelly_face (bell with eyes and tendrils).
   THE MOON OF THE HOLLOW LANDS: IMG hgt_moon_main (2048x1024 equirectangular, seamless left-right: pale nacre and stone moon with craters, violet and teal seas,
     veins of light), hgt_moon_glow (2048x1024, the same map's emissive parts on black: add it with 'lighter'), hgt_moon_halo (1024x1024 round halo and corona on black).
   ROUND 2 (creature critic): all folk, pet, fish, tank and prop cut-outs were re-cleaned with tools/clean_sprite.py (specks removed, magenta fringe cleaned).
     BULK GIANTS: cut-out faces IMG hgtb_bulk_face_pink, _aqua, _lilac, _amber (front view, two huge glossy eyes); non-repeating bulk skins IMG hgtb_bulk_skin_pink,
     _aqua, _lilac, _amber (2048x1024, large soft mottling, only left-right edges blended, NOT tiles: map once across the body).
     STILT-WALKER: cut-outs IMG hgtb_stilt_body (small armoured shell body), hgtb_stilt_head (long neck, big eyes), hgtb_stilt_knee (knee joint cap), hgtb_stilt_foot (foot pad);
     tex hgtb_stilt_armour (shell plates), hgtb_stilt_leg (jointed bone and shell leg segments, 128 px, old), hgtb_stilt_leg512 (512x512, painted pale lacquered bone leg,
     seamless both ways: use tex:'art_tex_hgtb_stilt_leg512', texMax:512 in a mesh part).
     OTHER TILES: tex hgtb_eel_thick (thick eel-dragon body with fins and light lines), hgtb_whale_contrast (high contrast whale skin with glowing rows), hgtb_scorp_belly2 (pale
     belly), hgtb_angel_banded (clean monochrome banded angelfish body). SCORPIONFISH: IMG hgtb_scorp_pectoral_ruffle1 and _ruffle2 (ruffled frilled pectoral fins, attachment left).
   AESTHETIC ROUND 2 (all painted; large calm motifs, no fine noise):
     FLOORS (FLOORS['hgtb_f_<x>'], 128 px, 'tile' ones tile both ways; 'motif' ones carry one big centred motif): tile: pearlbands terrazzo shellflags reed stained hex planks
       diamonds waves marble checker gutter(stair landing gutter along one edge) mossy; motif: mandala rosette lotus star scales spiral circles floral fish petals sunburst.
       DARK night variants: hgtb_f_pearlbands_dark terrazzo_dark shellflags_dark mandala_dark checker_dark mossy_dark. BIG MEDALLION: 16 floor tiles hgtb_med_<r><c> (r,c = 0..3, 4x4 cells),
       lay them as a 4x4 block: row r, column c gives the picture of the whole grand rosette.
     WALLS W3 ('hgt_w3_<x>', hgtbWall(x,wh) finds w2 then w3; standard 128 px tiles, tile sideways; top-aligned or bottom-aligned where noted): relief_pink relief_aqua fresco_cream
       fresco_amber scroll_aqua scroll_pink reed_lilac balcony_cream balcony2_cream shop_pink shop_cream (awnings) bunting_aqua (bunting and lantern cable at top)
       arcade_cream arcade_lilac shutters_lilac buttress_amber dado_pink (dark carved base band at the bottom: use as base unit) cornice_cream (cornice at the top: use as top unit).
     LAMPS (sprites, front elevation): hgtb_lamp_tall 2.3, lamp_short 1.0, lamp_bare 2.3 (no globe), lamp_vine 2.3, lamp_hanging .9, lamp_bracket 1.0 (wall brackets).
     STALLS (market stall fronts with awnings, 1.6 high): hgtb_stall_coral_fruit aqua_jars lilac_cloth yellow_bread pink_flowers teal_fish orange_pottery sage_herbs navy_books rose_lanterns.
     DECOR: hgtb_deco_banner 2.4, deco_bunting 1.2, deco_lanterns 1.8 (festival lantern cluster), deco_fountain 1.8 (central tiered fountain), deco_shellstatue 2.0 (coiled shell on plinth),
       deco_pearlplinth 1.8 (giant pearl).
     NEW PLANTS: hgtb_plant_belltree 3.0, plant_spiralfern 1.6, plant_orbbush .9, plant_lacecoral 1.0, plant_tealgrass 1.4, plant_lupin 1.1, plant_barrel .6, plant_potvine .8, plant_glowshrooms .6.
     INTERIOR: rugs seen from above (flat decals): hgtb_rug_pink_round rug_aqua_fish rug_cream_mandala rug_lilac_runner rug_amber rug_green_oval; furniture: hgtb_furn_table_chairs 1.0,
       furn_hearth 2.0, furn_clock 2.0, furn_loom 1.5, furn_books_globe .8, furn_stage 1.6, furn_bed 1.1, furn_bunk 1.6, furn_bookshelf 2.0, furn_cabinet 1.0, furn_chandelier 1.2 (pearl),
       furn_chandelier_lantern 1.0 (hangs from the ceiling).
     EDGE SCENERY (2048x868 RGBA, seamless left-right, parallax strips, bottom filled solid): hgtb_edge_near (dark indigo terraced cliffs, a cave ceiling with stalactites on top, rim light),
       hgtb_edge_mid (dusky violet terraces and spires with many small lit windows), hgtb_edge_far (pale hazy, little detail). Sky above the rock is transparent.
   ROUND 9 STILT-WALKER SHELL SET (painted pearl and lacquer shell, same family as the w3 shell walls; 512x512 tex, seamless both ways): hgtb_stilt_leg_shell (long vertical nacre ridges with gold lines
     and pearl studs, for the legs), hgtb_stilt_joint_shell (horizontal carved scallop and pearl bands, for joint rings), hgtb_stilt_knee_shell (overlapping iridescent shell plates for knee caps),
     hgtb_stilt_foot_shell (carved radiating shell fans for the foot pads). Use as tex:'art_tex_<name>', texMax:512. hgt_giants.js uses leg_shell on the legs and foot_shell on the feet.
   ========================================================================== */
const HGTB_PETS=[['hgtb_pinkbulb',.45],['hgtb_lilacmoth',.75],['hgtb_lanternbeetle',.55],['hgtb_pearlslug',.4],['hgtb_aquawhale',1.5],['hgtb_jadefinmoth',.8],['hgtb_spindleray',.75],['hgtb_amberpup',.35],
  ['hgtb_fishbeetle',.8],['hgtb_creamjelly',.9],['hgtb_jadeeel',.6],['hgtb_fishfly',.7],['hgtb_peachwhale',1.9],['hgtb_creammoth',.5],['hgtb_pups',.4],['hgtb_spindlespider',.7]];
const HGTB_FOLK=['hgtb_sweep','hgtb_basket','hgtb_water','hgtb_polish','hgtb_read','hgtb_fisher','hgtb_watch','hgtb_walk','hgtb_plantbed','hgtb_jar','hgtb_lantern','hgtb_elder'];
const HGTB_PROPS=[['hgtb_bench',.6],['hgtb_chair',.9],['hgtb_shrine',1.1],['hgtb_lampwhite',1.2],['hgtb_glasspost',2.3],['hgtb_table',.7]];
const HGTB_FISH=['neon','angel','eel','lanternfish','jelly','snailfish','seahorse','pearlray','insectfish','puffer','nautilus','crabfish','seadragon','flounder','octopus','starfish','clam','glassfish'].map(n=>'hgtb_fish_'+n);
const HGTB_WALLS=['rings','bubbles','portholes','scales','ringbubbles','medallions','polkapink','polkaaqua','dotsyellow','pointillist','confetti','constellation','scribblepink','doodleaqua','crayon','wavylilac','crosshatch','loopsmint','mosaic','filigree','tessel','quilt','map','script'];
const HGTB_WALLFEATURE=['winpink','winaqua','portlilac','doorteal','doorblue','bandjade'];
const HGTB_VINES=['ivy','creeper','wisteria','tendril','roundleaf','stars','cornerTL','cornerBR','wreathround','wreatharch','curtain','garland'].map(n=>'hgt_vine_'+n);
const HGTB_PLANETS=['orange','ocean','gas','pearl','jade','violet','ice','lava','desert','cratered','crystal','coral'].map(n=>'hgt_planet_'+n);
const HGTB_CLOUDS=['pink1','aqua1','aqua2','lilac1','lilac2','cream1','cream2','pinkstreak'].map(n=>'hgt_cloud_'+n);
for(const [n,h] of HGTB_PETS.concat(HGTB_PROPS))NPC_H[n]=h;
for(const n of HGTB_FOLK)NPC_H[n]=1.15;
for(const n of HGTB_FISH)NPC_H[n]=.35;
for(const n of ['tank_seagrass','tank_kelp','tank_coral','tank_rock','tank_anemone','tank_ruinarch'])NPC_H['hgtb_'+n]=.6;
for(const n of ['hgtb_tank_bubbles','hgtb_tank_bubbles3'])NPC_H[n]=.5;
NPC_H.hgtb_tank_tall=2.2;NPC_H.hgtb_tank_round=1.2;
for(const n of HGTB_VINES)NPC_H[n]=/ivy|creeper|wisteria|tendril|roundleaf|stars/.test(n)?4.5:2.4;
for(let i=1;i<=6;i++)NPC_H['hgtb_eye'+i]=.3;
for(const n of ['wing_insect','wing_bat','wing_butterfly','feather_peacock1','feather_peacock2','feather_iridescent','feather_down'])NPC_H['hgtb_'+n]=1;
NPC_H.hgtb_peacockfan=1.7;
const hgtbAll={pets:HGTB_PETS,folk:HGTB_FOLK,props:HGTB_PROPS,fish:HGTB_FISH,walls:HGTB_WALLS,wallFeature:HGTB_WALLFEATURE,vines:HGTB_VINES,planets:HGTB_PLANETS,clouds:HGTB_CLOUDS};
function hgtbWall(name,wh,o){const w3=!IMG['art_tex_hgt_w2_'+name]&&IMG['art_tex_hgt_w3_'+name];return hgtaWallTile((w3?'hgt_w3_':'hgt_w2_')+name,wh,o)} // w2 first, then w3
const HGTB_W3=['relief_pink','relief_aqua','fresco_cream','fresco_amber','scroll_aqua','scroll_pink','reed_lilac','balcony_cream','balcony2_cream','shop_pink','shop_cream','bunting_aqua','arcade_cream','arcade_lilac','shutters_lilac','buttress_amber','dado_pink','cornice_cream'];
const HGTB_FLOORS=['pearlbands','terrazzo','shellflags','reed','stained','hex','planks','diamonds','waves','marble','checker','gutter','mossy','mandala','rosette','lotus','star','scales','spiral','circles','floral','fish','petals','sunburst'].map(n=>'hgtb_f_'+n);
const HGTB_FLOORS_DARK=['pearlbands','terrazzo','shellflags','mandala','checker','mossy'].map(n=>'hgtb_f_'+n+'_dark');
const HGTB_MEDALLION=[0,1,2,3].map(r=>[0,1,2,3].map(c=>'hgtb_med_'+r+c)); // [row][col] floor names
for(const [n,h] of [['lamp_tall',2.3],['lamp_short',1],['lamp_bare',2.3],['lamp_vine',2.3],['lamp_hanging',.9],['lamp_bracket',1],['deco_banner',2.4],['deco_bunting',1.2],['deco_lanterns',1.8],['deco_fountain',1.8],['deco_shellstatue',2],['deco_pearlplinth',1.8],
  ['plant_belltree',3],['plant_spiralfern',1.6],['plant_orbbush',.9],['plant_lacecoral',1],['plant_tealgrass',1.4],['plant_lupin',1.1],['plant_barrel',.6],['plant_potvine',.8],['plant_glowshrooms',.6],
  ['furn_table_chairs',1],['furn_hearth',2],['furn_clock',2],['furn_loom',1.5],['furn_books_globe',.8],['furn_stage',1.6],['furn_bed',1.1],['furn_bunk',1.6],['furn_bookshelf',2],['furn_cabinet',1],['furn_chandelier',1.2],['furn_chandelier_lantern',1]])NPC_H['hgtb_'+n]=h;
for(const n of ['coral_fruit','aqua_jars','lilac_cloth','yellow_bread','pink_flowers','teal_fish','orange_pottery','sage_herbs','navy_books','rose_lanterns'])NPC_H['hgtb_stall_'+n]=1.6;
for(const n of ['pink_round','aqua_fish','cream_mandala','lilac_runner','amber','green_oval'])NPC_H['hgtb_rug_'+n]=1;
