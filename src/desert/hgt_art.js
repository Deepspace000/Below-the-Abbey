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
/*@@LISTS@@*/
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
