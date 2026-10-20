/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: PAINTED ART (prefix hgta). Shell-like, pearly houses and glittering plants for the four strange cities (levels 480 to 483).
   All pictures are painted with Gemini and cut with tools/ingest_tex.py (walls, doors, floors) and tools/ingest_sprite.py (sprites). They are files
   assets/ds_*.png, which the game loads at start (DS_PAINTED in artlist.js, written by tools/inject.py). Nothing here is drawn in code.

   HOW TO USE
   - Wall tile for a level's `chars`:   const gid=hgtaWallTile('hgt_wp', 3.2);   chars['#']=gid;       (gid is a tile number, like the other builders use)
       hgtaWallTile(name, wh, {base:'hgt_ww0', mid:'hgt_wp', top:'hgt_wb0'})  stacks pictures: base = the bottom unit, mid = the units between, top = the top unit.
       name is the default for every unit. wh = wall height in game units (a unit is one picture, 128 px tall). Results are cached.
   - Door tile (enter portal):          const dg=hgtaDoorTile('hgt_d0', 'hgt_wp', 3.2, {lvl:4850, at:{x:5,y:9,f:0}});  chars['D']=dg;   it also fills KH_DOOR so the door glows and enters.
   - A map character for a gid:         hgtaChar(gid)   returns a private unused character (from U+1400 up) and records it in hgtaChars (char -> gid), merge that into `chars`.
   - Floor names (L.floor / L.floor2 or any FLOORS[name]) are the names below starting hgt_f. Ceiling is not painted.
   - Sprites: IMG[name] and NPC_H[name] are set; use the name as a decor `k`. Heights are in game units (the eye is 0.5, a normal wall about 2.4).
   - hgtaAll lists every name with its group, size or height.

   NAMES (png files are assets/ds_<name>.png, textures assets/ds_tex_<name>.png, floors assets/ds_floor_<name>.png)
   WALLS (128x128 tile, tiles sideways): see HGTA_WALLS below.
   DOORS (128x128 picture of a door set in a wall, bottom unit): see HGTA_DOORS.
   FLOORS (128x128, tiles both ways): see HGTA_FLOORS.
   PLANTS (sprites, height in game units): see HGTA_PLANTS.
   ORNAMENTS (sprites): see HGTA_ORNS.
   ========================================================================== */
const HGTA_WALLS=[]; // filled below by name: [name, group, description]
const HGTA_DOORS=[];
const HGTA_FLOORS=[];
const HGTA_PLANTS=[]; // [name, height]
const HGTA_ORNS=[];   // [name, height]
HGTA_WALLS.push(
 ['hgt_wp','plain','pale pink nacre'],['hgt_wa','plain','aqua nacre'],['hgt_wc','plain','cream nacre'],['hgt_wl','plain','lavender nacre'],
 ['hgt_ww0','window','pink nacre, one round window'],['hgt_ww1','window','aqua nacre, one arched window'],['hgt_ww2','window','lavender nacre, three tiny round windows'],['hgt_ww3','window','cream nacre, two arched windows'],
 ['hgt_wb0','band','pink nacre, scallop shell band across the middle'],['hgt_wb1','band','aqua nacre, pearl row band'],['hgt_wb2','band','cream nacre, ammonite spiral band'],['hgt_wb3','band','lavender nacre, lit niche arcade band']);
HGTA_DOORS.push(
 ['hgt_d0','pink wall, round scallop shell door, pearl knob'],['hgt_d1','aqua wall, tall arched cream door with step and shell knocker'],
 ['hgt_d2','lavender wall, glowing golden arched doorway with pearl lights (use for enter portals)'],['hgt_d3','cream wall, round aqua bulb door with ammonite spiral and ring handle']);
HGTA_FLOORS.push(
 ['hgt_f0','pearly shell-stone paving slabs with lit pearl edges'],['hgt_f1','mossy lavender cobbles'],['hgt_f2','glittering aqua crystal gravel path'],['hgt_f3','sunken-court diamond tiles, aqua and cream'],
 ['hgt_f4','pale shell-stone stair treads with a bright lit lip (horizontal bands)'],['hgt_f5','cream marble flagstones inlaid with pearls and gold lines'],['hgt_f6','pale shell-stone slabs with moss and glowing specks'],['hgt_f7','cold glowing lawn with firefly sparks']);
HGTA_PLANTS.push(
 ['hgt_fern',1.1],['hgt_bulbflower',1.9],['hgt_mushrooms',.9],['hgt_lightvine',2.4],['hgt_shrub',1],['hgt_fairytree',3.2],['hgt_shellflower',2.1],['hgt_reeds',1.4],
 ['hgt_giantcap',2.6],['hgt_willow',3.8],['hgt_pearlbush',1],['hgt_crystalgrass',.45]);
HGTA_ORNS.push(
 ['hgt_finial',1.3],['hgt_chimney',1.4],['hgt_hanglamp',.8],['hgt_lamppost',2.3],['hgt_balcony',1],['hgt_banner',2.4],['hgt_cupola',1.5],['hgt_chime',1.1],
 ['hgt_obelisk',3.4],['hgt_fountain',1.3],['hgt_gardenlantern',.9]);
const hgtaAll={walls:HGTA_WALLS,doors:HGTA_DOORS,floors:HGTA_FLOORS,plants:HGTA_PLANTS,ornaments:HGTA_ORNS};
for(const [n,h] of HGTA_PLANTS.concat(HGTA_ORNS))NPC_H[n]=h;

/* ---------- wall, door and character helpers ---------- */
const hgtaChars={};let hgtaNextCh=0x1400;const hgtaCharOf=new Map();
function hgtaChar(gid){let c=hgtaCharOf.get(gid);if(!c){c=String.fromCharCode(hgtaNextCh++);hgtaCharOf.set(gid,c);hgtaChars[c]=gid}return c}
const hgtaCache={};
function hgtaPic(name){return IMG['art_tex_'+name]||IMG['art_'+name]||IMG[name]||null} // the painted wall or door picture, or null when its file is missing
function hgtaStack(name,wh,o){
  const base=hgtaPic((o&&o.base)||name),mid=hgtaPic((o&&o.mid)||name),top=hgtaPic((o&&o.top)||name),units=Math.max(1,Math.ceil(wh)),Hp=Math.max(8,Math.round(128*wh));
  const c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#cfc4d6';x.fillRect(0,0,128,Hp);
  for(let u=0;u<units;u++){const im=u===0?base:u===units-1&&units>1?top:mid;if(!im)continue;
    const part=wh-u<1?wh-u:1; // the top unit may be a fraction: draw only the part of the picture that fits
    x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
  return {c,Hp};
}
function hgtaNewTile(name,wh,o){
  const {c,Hp}=hgtaStack(name,wh,o);
  const d=c.getContext('2d').getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;
  const gid=KH_NEXT_GID++;T_TILE[gid]=id;return gid;
}
function hgtaWallTile(name,wh,o){
  const key='w|'+name+'|'+wh+'|'+JSON.stringify(o||{});
  if(hgtaCache[key]!==undefined)return hgtaCache[key];
  return hgtaCache[key]=hgtaNewTile(name,wh,o);
}
function hgtaDoorTile(door,wall,wh,link,o){ // link {lvl,at:{x,y,f}} fills KH_DOOR; every call makes a new tile because each door leads somewhere else
  const gid=hgtaNewTile(wall,wh,Object.assign({base:door},o||{}));
  if(link&&link.lvl!==undefined)KH_DOOR[gid]={lvl:link.lvl,at:link.at};
  return gid;
}
