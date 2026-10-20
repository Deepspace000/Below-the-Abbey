/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: THE TERRACED ENGINE (prefix hgte / HGT). Levels 480 to 489 are town levels with REAL HEIGHTS.

   DATA CONTRACT FOR LEVEL BUILDERS (read this before building a city)
   ---------------------------------------------------------------------------------------------------------------------
   1. Register a builder. Call, at file load:   hgtRegister(id, build)       (id 480..489; interiors 4850..5499)
        build(id) must RETURN a level object (do not assign LEVELS yourself). It runs lazily the first time the level is entered,
        after the pictures have loaded (KH_READY), with ohAlias/ohArt/ohFloors/ohStyles already done. It also sets LEVEL_NAMES[id].
        The level object is the normal one, plus the terrace:
          { rows:[string x H], chars:{ch:gid}, start:{x,y,f}, enemies:[], items:[], decor:[], lights:[[x,y],..], portals:[],
            terrace:{ h:Float32Array(W*H) },       // REQUIRED for 480..489. Index y*W+x. Optional: roof (number), s (Float32Array shade), rev (bump to rebuild),
                                               // riser (gid of a wall tile: the picture of the vertical face of every step; default is the floor picture, which looks wrong on tall cliffs),
                                               // rg (Int32Array(W*H) of gids: a different riser picture for single cells, 0 = use riser)
            name, label, mapNames:[], fmap:[strings of '0'..'5'], floorSet:[6 FLOORS names], floor, ceil:'tomb', ceilH,
            day:0, outdoor:true, amb:.58, noExtras:true, noTele:true, diff, sky:[...] }
        The look of level 470 (cold light, haze, purple torch tint, rock roof, cold overlay) is applied to 480..489 and 4850..5499 automatically
        (hgtLook). HGTE.cold.add(id) adds any other level id to the look.
   2. HEIGHTS. Unit = one cell width. Eye height is 0.5 above the ground of the cell, a normal wall is ceilH high. terrace.h[y*W+x] is the height of the
        walking surface of that cell, in the same units; negative = sunken. Every cell is ONE flat step (nearest neighbour, no slopes).
        - Open cells ('.') are walked; they are drawn at their height, and a higher neighbour shows a riser face (the front of the step).
        - A WALL cell is any char other than '.' (and 't'). Its terrace.h value is the height of its FOOT; the wall rises from there by its tile height
          (TEX[T_TILE[gid]].wh). So a tower is a block of wall cells whose foot is the ground height they stand on, and a stairwell wall column of height 8
          on ground 3 reaches 11. Set h for wall cells to the ground height of the building foot (the ground beside it), never 0 by default on a raised site.
        - STEP RULE: the party, creatures and walkers can move between two neighbouring cells only when |h1-h0| <= 0.55 (terrStepOK). Stairs of
          0.2 to 0.3 per cell work; cliffs and pit edges block (message: step too high / drop too steep). Only the four neighbours count (no diagonals).
        - Decor, items, enemies and lights stand at the height of the cell they are in (terrFoot). A decor's x,y must be an open cell.
        - The camera eases between cell heights in about a quarter second. The roof (rock ceiling) is at terrace.roof, default max(top of tallest wall + 2.5, 6).
          Do not make any wall taller than the roof.
        - Walls are drawn far to near, so a tall tower shows over a low house in front of it. At most 24 wall hits per screen column are kept.
   3. WALL TILES. A wall char needs a gid: chars[ch]=gid, where T_TILE[gid]=texture id and TEX[id].wh is the wall height in cells (TEX[id].h = pixel height = 128*wh,
        the picture is mapped 1:1 so 128 pixels = 1 cell of height). Two ways:
          a) painted pictures:  const TM=ohTiles(); const gid=TM.make(kind,styleName,wh).gid;   // kind 'plain','door','window','slit','gwin','window2','plain2'
             styleName is a key of OH_STY (the art agent adds styles: OH_STY.name={plain:'imgKey',win:'imgKey',door:..., zoom, contrast, tint:[r,g,b,a]}).
          b) plain placeholder:  const gid=HGTE.tile(wh,[r,g,b]);                     // flat colour, a faint band per cell of height
        HGTE.doorTile(wh,[r,g,b],toLevel,{x,y,f}) makes a placeholder DOOR tile (see 4).
        Several heights = several gids (a house of 2.7, a tower of 8, a stairwell column of 8 are three gids). A wall of height 8 is a tile 1024 px tall.
   4. DOORS AND PORTALS. Both work exactly as in the Hollow Grasslands hives.
        a) Door in a wall: a wall char whose gid is a door tile: KH_DOOR[gid]={lvl:interiorId, at:{x,y,f}} (f: 0 north, 1 east, 2 south, 3 west = the way the party faces
           on arrival). Walking into the door cell from an open neighbour (that passes the step rule) enters the level. The door cell's foot height is its terrace.h,
           so a doorstep is simply an open cell next to it. The door glows softly (wdDoorLevel is true for these levels).
           In the interior, put the matching door tile (KH_DOOR[gid2]={lvl:cityId, at:{x,y,f}} with x,y the street cell in front of the outside door).
        b) Enter-portal decor: decor:[{k:'hg_hive',x,y,block:true,enter:{to:id,x,y,f}}] : walking into a blocking decor with `enter` goes there.
        c) Digit portals ('0'..'9' chars with L.portals[i]) also work as in other levels.
   5. SAVES. A save made in a level 480..489 or 4850..5499 restores through Continue and through Go to area (hgtAny is in every KH_READY / restore range list).
        Keep builders deterministic (same level every time) because only the party position and the usual level state (items taken, decor found) are saved.
   6. TEST: goToLevel(480) from the console, or the link  ?town=hgtest&lvl=34  (level 480 test level: plaza, straight stair, spiral tower, sunken court with a door to 4850).
   7. COVERED TUBES (walk-through passages with a real ceiling). Add to the terrace object:      terrace.lid = Float32Array(W*H)
        lid[y*W+x] = clearance of the ceiling above the FLOOR of that open cell (so the ceiling is at terrace.h + lid). 0 = open to the sky. Typical 2.0 to 2.6; a vault is a wide tube whose
        middle cells have a bigger lid than its edge cells (stepped). The cell stays an ordinary open '.' cell: walking, the step rule, decor, lights and the validator treat it as before.
        - The ceiling picture is the painted tile ds 'hgt_tube_ceiling' (assets/ds_tex_hgt_tube_ceiling.png, or assets/ds_ceil_hgt_tube_ceiling.png); until it exists a placeholder is used.
          A lit seam runs along every cell border of the ceiling. Look keys: tubeSeam [r,g,b] (default [150,235,255]), tubeGlow (self light of the ceiling, default .22).
        - Seen from below the ceiling covers sky, roof and far skyline; a lid that drops (a lower cell after a higher one) shows a face. Walls nearer than a ceiling are drawn over it, walls
          beyond it are cut off by it. Seen from above (the eye higher than the lid, for example on a tower) the lid is a solid slab with a top and edges, drawn with the same picture.
        - THE SIDE WALLS ARE THE BUILDER'S JOB: wall cells beside the tube must be at least as tall as the lid (their foot = the floor beside them), or the sky shows over them. Both ends of the tube are
          open cells (mouths). hgtlTube(B,x0,y0,x1,y1,opts) in hgt_lib.js does all of this (side walls, vault, lights) and hgtlValidate checks it.
   8. POOLS (swim and wade). Add to the terrace object:      terrace.water = Uint8Array(W*H)   0 dry, 1 shallow (wade), 2 deep (swim)
                                                             terrace.wl    = Float32Array(W*H) absolute height of the water SURFACE of every water cell (default if wl is missing: bed+.22 shallow, bed+1.2 deep)
                                                             terrace.dive  = { 'x,y': {to:levelId, x, y, f} }  deep (or any) cells that lead down to another level
        The bed of a water cell is its terrace.h as always, so the step rule is unchanged: keep neighbouring beds within .55 (rim to shallow bed .3, shallow to deep bed .5 are fine).
        - The surface is a luminous translucent sheet with moving ripples and glints; the bed shows through, tinted by depth. Water cells are ordinary open cells: everything walks in them.
        - Shallow: the eye is .08 lower than usual, nothing is slowed. Deep: the eye is .22 under the surface (the party swims), the view turns blue-green with fog and a tint, the surface seen
          from below is a bright moving ceiling, the first step into deep water says so once. Swimming at the surface needs no helm and has no air limit.
        - terrace.dive cells (put on deep cells): going DOWN needs the diving helms (uwSuited() of underwater.js). Without them the cell cannot be entered and the party is told
          'The water is too deep to breathe in. A diving helm would let you go down.' With them, stepping on one goes to that level at x,y,f after a quarter second. A dive entry is
          {to,x,y,f,ret:{x,y,f}}: ret is the shallow cell beside the pool where the rescue brings the party back (stored in G.flags.hgtRet[to] on the way down, so it survives a save). Build the level it leads to with HGTE.wetLook(id) (see 9) and give it a door tile
          that leads back up (KH_DOOR[gid]={lvl:cityId, at:{x,y,f}} with x,y a cell beside the pool). hgtlPool(B,x,y,w,d,{lead:{to,x,y,f}}) fills all of these arrays.
   9. WET ROOMS (a submerged interior). HGTE.wetLook(id) gives an interior level (4850..5499) the under-water look: aqua haze, tint and overlay with drifting light shafts and bubbles. The interior is
        a normal flat room. A look key wet:[r,g,b,alpha] adds the overlay to any look. The same look is used automatically for the eye of a party swimming in a deep pool.
      HGTE.wetLook(id) also makes the room a REAL underwater level (uwLv is true for it): the air counter G.uw counts down, vents refill it, drowning hurts, and the 14 second
        'hauled up' rescue returns the party to ret in the city (see HGTE.wetReturn). Give the room a vent: UWS[id]={vents:[[x,y]],swim:[]}. Walking out through the door back to the city also ends the air counter.
      STAIRS TO NOWHERE need no engine support: hgtlStairsToNowhere(B,x,y,dir,'wall'|'chair'|'arch'|'window'|'loop',opts) in hgt_lib.js builds them (see its comment).
      TEST LEVEL 485 (?town=hgtesttwo&lvl=34): a tube between two towers, a bent vaulted tube, a pool with a deep end leading to the submerged room 4859, and every stairs-to-nowhere variant.
   ========================================================================== */
var HGT=(typeof HGT==='undefined')?{}:HGT; // other files add to it; never redeclare it
HGT.ID0=480;HGT.IDN=489;HGT.INT0=4850;HGT.INTN=5499;
const HGTE={cold:new Set(),builders:{}};
const hgtAny=n=>(n>=480&&n<=489)||(n>=4850&&n<=5499&&!!HGTE.builders[n]); // interior ids count only when a builder of ours is registered for them (Khemetra's house ids run through the same numbers)
const hgtLook=n=>hgtAny(n)||HGTE.cold.has(n); // the look of level 470 (the cold cavern) without being level 470
const hgtIsTown=n=>n>=480&&n<=489;
function hgtPrep(){hgtPanoLoad();ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors()}
function hgtRegister(id,build){
  HGTE.builders[id]=build;
  KH_LAZY[id]=()=>{
    if(LEVELS[id])return;
    if(typeof KH_READY!=='undefined'&&!KH_READY)return;
    hgtPrep();
    const L=build(id);if(!L)return;
    if(hgtIsTown(id)&&!L.terrace){console.error('hgt level '+id+' has no terrace');return}
    if(L.terrace&&!(L.terrace.h instanceof Float32Array))L.terrace.h=Float32Array.from(L.terrace.h);
    if(!L.name)L.name=LEVEL_NAMES[id]||('Level '+id);
    LEVELS[id]=L;LEVEL_NAMES[id]=L.name;if(LEVEL_RATING[id]===undefined)LEVEL_RATING[id]=(typeof HG!=='undefined'?HG.DIFF:66);
  };
}
/* ---------- THE LOOK OF THE CITIES (renderer settings per level) ----------
   Every hgtLook level (480..489, 4850..5499 and HGTE.cold ids) is drawn with HGTE.lookDefaults. A city or an interior tunes its own look with
        HGTE.look[483]={haze:.3,hazeCol:[60,50,120]};      // only the keys you name change; the rest stay at the default. Call it at file load.
   Keys (all optional):
     ambient       0..1   base light level (the old level.amb is ignored for the look). Lower = moodier, lamps stand out more. default .56
     haze          0..1   strongest haze mix reached far away. default .42           hazeRate  haze per cell of distance. default .02
     hazeCol       [r,g,b] 0..255 colour of the far air (deep violet-teal, never white). default [150,122,206]     roofHaze  same for the roof
     tint          [r,g,b] multipliers of the cool ambient light. default [.95,1,1.1]
     lamp          [r,g,b] colour multipliers of lamp light (lights list, hg_lamp); warm amber against the cool ambient. default [1,.75,.4]
     wallGain      brightness of walls (1 = painting as is). default .8     wallSat  colour saturation of walls, keeps pink/aqua/cream. default 1.6
     wallAO        0..1   darkness at the foot of every wall. default .3
     floorGain     brightness of floors and step treads. default .7        floorContrast  texture contrast. default 1.7     floorPivot  grey it pivots on. default 130
     floorTint     [r,g,b] multipliers. default [1,.95,.98]                  floorSat  floor colour saturation (1 = as painted). default 1.3
     riserGain     brightness of step risers (the vertical face). default .8
     lipGain / lipW   brightness and depth (cells) of the light edge on the tread of a step up. default 1.5 / .09
     footAO / edgeW   darkness and size (cells) of the shadow at the foot of a riser and under a step down. default .5 / .12
     roofGain      brightness of the rock roof. default .65                   roofTint [r,g,b]. default [.8,.85,1.25]
     starMask      far points of light in the roof: 511 = sparse, 255 = many, 4095 = very few.    starGain  their brightness. default .9
     motes         number of drifting light motes in the air (0 = none). default 46      moteCol  [r,g,b] default [255,226,170]
     pano          1 = paint the far skyline panorama behind the terrain (0 = plain dark roof). panoGain brightness, panoTint [r,g,b], panoDrift slow drift in pixels per second. defaults 1 / 1 / [1,1,1] / 2
     ambientDay    light level at full day (ambient is the night level). default .8     hazeDay  haze strength by day. default .22
     sun           0..1.5 strength of the north-west cave light: soft ground shadows behind walls and towers (wall faces are lit in render3D). default 1
     sil, silGain, silAlpha, silBase   painted dark rock stacks and spires in front of the backdrop (sil 0 = off), brightness, opacity, rows below the horizon where they stand. defaults 1 / 1.3 / .92 / 20
     sheen, sheenSpeed   animated pearl sheen on walls, strength and speed. default .8 / .5     caustic  ripples of light on floors near water. default 1
     gradient      cool-to-warm sky-to-ground light gradient strength. default .35     shafts  number of light shafts (day: sun, night: moon). default 4     panoNight  brightness of the backdrop at night. default .6
     mist, mistCol strength and colour of the lit mist band at the horizon. default .5 / [170,140,220]
     vignette      0..1   darkening of the view corners. default .4          grade  [r,g,b,alpha] multiply overlay colour over the whole view. default [255,244,252,.18]
     tubeSeam [r,g,b] / tubeGlow   the lit seams and self light of covered-tube ceilings (section 7). defaults [150,235,255] / .22        wet [r,g,b,alpha]  water overlay with light shafts and bubbles (section 9). default none
*/
HGTE.look={};
HGTE.lookDefaults={ambient:.4,haze:.42,hazeRate:.02,hazeCol:[150,122,206],roofHaze:[60,50,110],tint:[.95,1,1.1],lamp:[1.0,.75,.4],wallGain:.8,wallSat:1.6,wallAO:.3,
  floorGain:.7,floorContrast:1.7,floorPivot:130,floorTint:[1,.95,.98],floorSat:1.3,riserGain:.8,lipGain:1.5,lipW:.09,footAO:.5,edgeW:.12,roofGain:.65,roofTint:[.8,.85,1.25],
  starMask:511,starGain:.9,motes:46,moteCol:[255,226,170],vignette:.4,grade:[255,244,252,.18],pano:1,panoGain:1,panoTint:[1,1,1],panoDrift:2,ambientDay:.8,hazeDay:.22,sun:1,mist:.5,mistCol:[170,140,220],sil:1,silGain:1.3,silAlpha:.92,silBase:20,sheen:.8,sheenSpeed:.5,caustic:1,shafts:4,panoNight:.6,gradient:.35,tubeSeam:[150,235,255],tubeGlow:.22,wet:null};
/* the painted far skyline (assets/hgt_pano.jpg, a seamless panorama of far towers with lit windows under the cavern roof). It replaces the roof and the empty far ground on terraced levels. */
HGTE.pano=null;
// painted cave-edge strips (pre-scaled to half size when loaded): far (pale, hazy), mid (terraces with lit windows), near (dark cliffs and a stalactite roof). row0: strip row at the horizon; mult: repeats round the circle; mixf: pull towards the mist colour
HGTE.edgeLayers=[{img:'far',mult:2,off:.2,row0:340,drift:.6,gain:1,alpha:.8,mixf:.45,mistAfter:.22},{img:'mid',mult:2,off:.55,row0:200,drift:1.2,gain:1,alpha:.95,mixf:.12,mistAfter:.2},{img:'near',mult:2,off:.9,row0:175,drift:2.2,gain:1.1,alpha:.8,mixf:0,mistAfter:0}];
HGTE.layersDefault=[{sr:4.6,mult:2,off:.11,base:-4,drift:.9,gain:2.3,alpha:.55,mistAfter:.25},{sr:3,mult:3,off:.37,base:0,drift:1.8,gain:1.3,alpha:.92,mistAfter:0}]; // sr: image rows per screen row, mult: repeats round the circle. When the art agent's near, mid and far strips exist, set HGTE.layers to a list of the same shape.
function hgtPanoLoad(){if(HGTE._pl)return;HGTE._pl=1;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);HGTE.pano={w:im.width,h:im.height,d:x.getImageData(0,0,im.width,im.height).data,hr:190,rs:1.2}};im.src='assets/hgt_pano.jpg';const sl=new Image();sl.onload=()=>{const c=document.createElement('canvas');c.width=sl.width;c.height=sl.height;const x=c.getContext('2d');x.drawImage(sl,0,0);HGTE.sil={w:sl.width,h:sl.height,d:x.getImageData(0,0,sl.width,sl.height).data}};sl.src='assets/hgt_sil.png';HGTE.strips={};for(const nm of ['near','mid','far']){const e=new Image();e.onload=()=>{const c=document.createElement('canvas');c.width=e.width>>1;c.height=e.height>>1;const x=c.getContext('2d');x.drawImage(e,0,0,c.width,c.height);HGTE.strips[nm]={w:c.width,h:c.height,d:x.getImageData(0,0,c.width,c.height).data}};e.src='assets/ds_hgtb_edge_'+nm+'.png'}}
HGTE.bgc=null;
function hgtPanoPaint(D,dX,dY,pX,pY,K,t,day){ // the backdrop depends only on the view angle, the light and a slow drift: it is kept and copied back while none of them changes
  const key=LEVEL+'|'+HH+'|'+dX.toFixed(4)+'|'+dY.toFixed(4)+'|'+(day||0).toFixed(2)+'|'+Math.floor(t*K.panoDrift*.5)+'|'+(HGTE.layers?1:0)+'|'+(HGTE.strips&&HGTE.strips.near?1:0)+'|'+K.sil+K.panoGain+K.mist+K.silGain,B=HGTE.bgc;
  if(B&&B.key===key&&B.d.length===D.length){D.set(B.d);return}
  hgtPanoPaint2(D,dX,dY,pX,pY,K,t,day);
  if(!B||B.d.length!==D.length)HGTE.bgc={key,d:new Uint8ClampedArray(D)};else{B.d.set(D);B.key=key}
}
function hgtPanoPaint2(D,dX,dY,pX,pY,K,t,day){
  const P=HGTE.pano,w=P.w,h=P.h,d=P.d,g=K.panoGain,gd=g*(K.panoNight+(1.15-K.panoNight)*(day||0)),tr=K.panoTint[0]*gd,tg=K.panoTint[1]*gd,tb=K.panoTint[2]*gd,ml=K.mist*(.65+.35*(day||0)),mc=K.mistCol,off=t*K.panoDrift,rows=new Int32Array(VH),mb=new Float32Array(VH);
  for(let y=0;y<VH;y++){const e=(y-HH-5)/13;mb[y]=ml*.5*Math.exp(-e*e)} // a lit mist band along the horizon where the ground melts into the backdrop
  if(!P.avg){let ar=0,ag=0,ab=0;for(let i=0;i<w*4*4;i+=4){ar+=d[i];ag+=d[i+1];ab+=d[i+2]}const n=w*4;P.avg=[ar/n,ag/n,ab/n]}
  const tf=new Float32Array(VH),av=P.avg; // above the top of the picture (looking far up) the roof melts into its average colour instead of smearing the top row
  for(let y=0;y<VH;y++){let r=(P.hr+(y-HH)*P.rs)|0;rows[y]=(r<0?0:r>=h?h-1:r)*w;tf[y]=r<0?Math.min(1,-r/40):0}
  for(let x=0;x<VW;x++){const cm=2*x/VW-1,u=((((Math.atan2(dY+pY*cm,dX+pX*cm)/TAU)%1)+1)%1*w+off)%w|0;
    for(let y=0,o=x*4;y<VH;y++,o+=VW*4){const i=(rows[y]+u)*4,f=tf[y];let r=(d[i]+(av[0]-d[i])*f)*tr,gg=(d[i+1]+(av[1]-d[i+1])*f)*tg,b=(d[i+2]+(av[2]-d[i+2])*f)*tb;if(mb[y]>0){const m=mb[y];r+=mc[0]*m;gg+=mc[1]*m;b+=mc[2]*m}D[o]=r;D[o+1]=gg;D[o+2]=b}}
  if(K.sil>0){ // parallax layers of cave-edge scenery in front of the skyline, back to front, with lit mist between them
    const mcl=K.mistCol,dk=K.panoNight+(1.15-K.panoNight)*(day||0),ST=HGTE.strips,LY=HGTE.layers||((ST&&ST.far&&ST.mid&&ST.near)?HGTE.edgeLayers:HGTE.layersDefault);
    for(const Ly of LY){const S=Ly.img==='sil'||!Ly.img?HGTE.sil:ST[Ly.img];if(!S)continue;const sw=S.w,sh=S.h,sd=S.d,sg=K.silGain*Ly.gain*dk*(Ly.img&&Ly.img!=='sil'?1/1.3:1),so=t*K.panoDrift*Ly.drift,sr=Ly.sr||1,r0=Ly.row0!==undefined?Ly.row0:0,base=Ly.row0!==undefined?HH:HH+K.silBase+Ly.base,mf=Ly.mixf!==undefined?Ly.mixf:0,fade=Ly.row0!==undefined?0:1;
      const rowOf=y=>Ly.row0!==undefined?((r0+(y-HH)*sr)|0):((sh-1)-((base-y)*sr)|0);
      const ya=Ly.row0!==undefined?Math.max(0,Math.ceil(HH+(0-r0)/sr)):Math.max(0,Math.ceil(base-(sh-1)/sr)),yb=Ly.row0!==undefined?Math.min(VH-1,Math.floor(HH+(sh-1-r0)/sr)):Math.min(VH-1,Math.floor(base));
      for(let x=0;x<VW;x++){const cm=2*x/VW-1,u=((((Math.atan2(dY+pY*cm,dX+pX*cm)/TAU)%1)+1)%1*sw*Ly.mult+so+sw*Ly.off)%sw|0;
        for(let y=ya,o=(ya*VW+x)*4;y<=yb;y++,o+=VW*4){const r=rowOf(y);if(r<0||r>=sh)continue;const i=(r*sw+u)*4,a=sd[i+3]/255;if(a<.02)continue;
          const f=mf+(fade?Math.max(0,1-(sh-1-r)/(sh*.35))*.22*K.mist:0),k=a*K.silAlpha*Ly.alpha*(fade?Math.min(1,(sh-1-r)/34):1);
          D[o]+=(sd[i]*sg+mcl[0]*f-D[o])*k;D[o+1]+=(sd[i+1]*sg+mcl[1]*f-D[o+1])*k;D[o+2]+=(sd[i+2]*sg+mcl[2]*f-D[o+2])*k}}
      if(Ly.mistAfter){const ml2=K.mist*Ly.mistAfter*(.6+.4*(day||0)),mb=Ly.row0!==undefined?HH+4:base;for(let y=Math.max(0,(mb-40)|0),ye=Math.min(VH,(mb+24)|0);y<ye;y++){const e=(y-mb+8)/16,m=ml2*Math.exp(-e*e);if(m<.01)continue;for(let x=0,o=y*VW*4;x<VW;x++,o+=4){D[o]+=mcl[0]*m;D[o+1]+=mcl[1]*m;D[o+2]+=mcl[2]*m}}}}}
}
function hgtAmb(K,day){return K.ambient+(K.ambientDay-K.ambient)*day} // light level: night ambient to day ambient
const hgtLookMem={};
function hgtLookFor(id){const o=HGTE.look[id]||null,m=hgtLookMem[id];if(m&&m.o===o&&m.rev===(o&&o._rev||0))return m.v;const v=Object.assign({},HGTE.lookDefaults,o||{});hgtLookMem[id]={o,rev:o&&o._rev||0,v};return v} // cached; set look._rev++ after editing a look object in place
/* the air of a city: soft grade, vignette, and drifting motes of warm light (particles, drawn over the 3D view) */
{const _w=drawWeatherFx;drawWeatherFx=function(){if(!(hgtLook(LEVEL)&&!hgtIsTown(LEVEL)))_w.apply(this,arguments);if(!hgtLook(LEVEL))return; // no rain or cold streaks indoors
  const K=hgtLookFor(LEVEL),t=G.time||0;ctx.save();
  if(K.grade[3]>0){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=K.grade[3];ctx.fillStyle='rgb('+K.grade[0]+','+K.grade[1]+','+K.grade[2]+')';ctx.fillRect(0,0,420,210)}
  {const dy=G.day||0,mk=(typeof HGTG!=='undefined'&&HGTG.moonK)||0;
    if(K.gradient>0){const g=ctx.createLinearGradient(0,0,0,210),dn=1-dy,tc=[205+dy*0-dn*60,222-dn*70,255-dn*20],bc=[255-dn*40+0,238-dn*14+dn*mk*0,205+dn*50];
      g.addColorStop(0,'rgb('+tc.map(v=>v|0).join(',')+')');g.addColorStop(1,'rgb('+bc.map(v=>v|0).join(',')+')');ctx.globalCompositeOperation='multiply';ctx.globalAlpha=K.gradient;ctx.fillStyle=g;ctx.fillRect(0,0,420,210)} // cool light from above, warm from the ground by day; indigo to moon-silver at night
    if(K.shafts>0){ctx.globalCompositeOperation='lighter';const a0=(G.C&&G.C.a)||0,col=dy>.3?'255,240,205':'170,190,255',amp=dy>.05?.05*(.3+dy):.03*mk;
      if(amp>.002)for(let i=0;i<K.shafts;i++){let da=(i*1.37+.4)-a0;da=Math.atan2(Math.sin(da),Math.cos(da));const x0=210+da*326,w=14+(i%3)*9,sk=70+(i%2)*30,fl=amp*(.7+.3*Math.sin(t*.4+i*2));if(x0<-80||x0>500)continue;
        const g=ctx.createLinearGradient(0,0,0,170);g.addColorStop(0,'rgba('+col+','+fl.toFixed(3)+')');g.addColorStop(1,'rgba('+col+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0-w,0);ctx.lineTo(x0+w,0);ctx.lineTo(x0+w+sk,170);ctx.lineTo(x0-w+sk,170);ctx.closePath();ctx.fill()}} // soft light shafts from high openings, fixed in the world
  }
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  if(K.vignette>0){if(!hgtLook.vg){const c=document.createElement('canvas');c.width=420;c.height=210;const x=c.getContext('2d'),g=x.createRadialGradient(210,105,70,210,105,260);g.addColorStop(0,'rgba(8,4,24,0)');g.addColorStop(.6,'rgba(8,4,24,.35)');g.addColorStop(1,'rgba(8,4,24,1)');x.fillStyle=g;x.fillRect(0,0,420,210);hgtLook.vg=c}
    ctx.globalAlpha=K.vignette;ctx.drawImage(hgtLook.vg,0,0);ctx.globalAlpha=1}
  if(K.wet){ // under water: a blue-green wash, slow shafts of light and rising bubbles (light effects only)
    const w=K.wet;ctx.globalAlpha=w[3];ctx.fillStyle='rgb('+w[0]+','+w[1]+','+w[2]+')';ctx.fillRect(0,0,420,210);
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){const x=((i*83+t*(3+i*.9))%500)-40,a=.025+.02*Math.sin(t*.7+i*2.1);ctx.globalAlpha=Math.max(0,a);ctx.fillStyle='rgb(150,240,235)';ctx.fillRect(x,0,10+i*4,210)}
    ctx.globalAlpha=.5;ctx.strokeStyle='rgb(190,250,250)';ctx.lineWidth=.8;
    for(let i=0;i<14;i++){const x=(i*61.7+Math.sin(t*.9+i)*5)%420,y=215-((t*(16+i%5*5)+i*41)%235),r=1+(i%3)*.8;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.stroke()}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(K.motes>0){ctx.globalCompositeOperation='lighter';const mc=K.moteCol;
    for(let i=0;i<K.motes;i++){const sp=.6+(i%5)*.35,x=((i*89.3+t*(2+i%4)+Math.sin(t*.5*sp+i)*9)%440+440)%440-10,y=((i*47.7+t*(1.5+(i%3))*(i%2?-1:1)+Math.cos(t*.4*sp+i*2)*7)%230+230)%230-10,tw=.35+.65*Math.max(0,Math.sin(t*(1.1+i%4*.5)+i*1.7)),r=.6+(i%4)*.45;
      ctx.fillStyle='rgba('+mc[0]+','+mc[1]+','+mc[2]+','+(.5*tw*(1+(G.day||0)*.8)).toFixed(3)+')';ctx.fillRect(x,y,r,r);
      if(i%6===0&&(G.day||0)>.3){ctx.fillStyle='rgba(255,246,225,'+(.45*tw).toFixed(3)+')';ctx.fillRect(x-2.5,y+r/2-.3,5+r,.6);ctx.fillRect(x+r/2-.3,y-2.5,.6,5+r)} // by day the motes glint
      if(i%6===0){ctx.fillStyle='rgba('+mc[0]+','+mc[1]+','+mc[2]+','+(.09*tw).toFixed(3)+')';ctx.fillRect(x-1.4,y-1.4,r+2.8,r+2.8)}}}
  ctx.restore()}}
/* plain placeholder tiles: a flat colour (the art agent supplies the painted shell textures later) */
function hgtTex(wh,rgb,door){
  const Hp=Math.round(128*wh),d=new Uint8ClampedArray(128*Hp*4);
  for(let y=0;y<Hp;y++){const unit=Math.floor((Hp-1-y)/128),k=unit%2?.93:1;
    for(let x=0;x<128;x++){let r=rgb[0]*k,g=rgb[1]*k,b=rgb[2]*k;
      if(door&&unit===0&&x>=36&&x<92&&y>=Hp-100){r=28;g=20;b=14}  // a dark doorway, one cell high
      const o=(y*128+x)*4;d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;return id;
}
HGTE.tile=function(wh,rgb){const gid=KH_NEXT_GID++;T_TILE[gid]=hgtTex(wh,rgb||[200,190,180],false);return gid};
HGTE.doorTile=function(wh,rgb,lvl,at){const gid=KH_NEXT_GID++;T_TILE[gid]=hgtTex(wh,rgb||[200,190,180],true);KH_DOOR[gid]={lvl,at};return gid};
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||hgtAny(n)}}
function hgtGotoList(hd,has,nm,out){
  hd('The strange cities of the Hollow Grasslands');
  for(let n=480;n<=489;n++)if(has(n))out.push({n,name:nm(n)});
  for(let n=4850;n<4870;n++)if(has(n))out.push({n,name:nm(n)});
}
LEVEL_NAMES[480]='The Test Terraces';LEVEL_NAMES[4850]='The Sunken Room';

/* ---------- the test level 480: a plaza, a straight stair of 12 steps up to a platform, a tower with a spiral stair to a lookout, a stair of 6 steps down into a sunken court with a door ---------- */
function hgtBuildTest(){
  const W=48,H=44,N=W*H,I=(x,y)=>y*W+x,h=new Float32Array(N),rows=[];
  for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const wallLow=HGTE.tile(3,[150,150,170]),tower=HGTE.tile(8,[225,190,200]),court=HGTE.tile(2.7,[215,150,150]);
  const door=HGTE.doorTile(2.7,[215,150,150],4850,{x:4,y:2,f:2}); // the room beyond is built below; it arrives at its own door
  const chars={'#':wallLow,'W':tower,'c':court,'d':door};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<1||y<1||x>=W-1||y>=H-1)rows[y][x]='#';
  // the stair: 12 steps of 0.25 going north from the plaza (x 11 to 13, y 33 down to 22) to a platform at 3.0
  for(let k=1;k<=12;k++)for(let x=11;x<=13;x++)h[I(x,34-k)]=.25*k;
  for(let y=15;y<=21;y++)for(let x=8;x<=16;x++)h[I(x,y)]=3;
  // the tower: 3 by 3 wall cells of height 8 at 29..31, 27..29 (foot 0), and a spiral of steps round it: the outer ring first, then the inner ring
  const cx=30,cy=28,rc=d=>{ // clockwise from the south middle: west along the bottom, north up the west side, east along the top, south down the east side, back to the middle
    const o=[];for(let x=cx;x>=cx-d;x--)o.push([x,cy+d]);for(let y=cy+d-1;y>=cy-d;y--)o.push([cx-d,y]);for(let x=cx-d+1;x<=cx+d;x++)o.push([x,cy-d]);for(let y=cy-d+1;y<=cy+d;y++)o.push([cx+d,y]);for(let x=cx+d-1;x>cx;x--)o.push([x,cy+d]);return o};
  for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)rows[y][x]='W';
  const r3=rc(3).slice(0,23),r2=rc(2);let step=0;
  for(const [x,y] of r3){step++;h[I(x,y)]=.18*step}
  // the inner ring starts beside the last outer cell and goes on climbing; the last four cells are the flat lookout
  const last=r3[r3.length-1];let start=0,bd=1e9;r2.forEach(([x,y],i)=>{const d=Math.abs(x-last[0])+Math.abs(y-last[1]);if(d<bd){bd=d;start=i}});
  const ord=[];for(let i=0;i<14;i++)ord.push(r2[(start+i)%r2.length]);
  ord.forEach(([x,y],i)=>{step++;h[I(x,y)]=.18*(i>=10?step-(i-10):step)});
  // the sunken court: open pit at -1.5 (x 41 to 45, y 10 to 20), six steps down from the east end of the plaza lane (x 35 to 40 at y 14 to 16)
  for(let y=10;y<=20;y++)for(let x=41;x<=45;x++)h[I(x,y)]=-1.5;
  for(let k=1;k<=6;k++)for(let y=14;y<=16;y++)h[I(34+k,y)]=-.25*k;
  for(let y=10;y<=20;y++)h[I(46,y)]=-1.5; // the court wall (foot -1.5)
  for(let y=10;y<=20;y++)rows[y][46]='c';rows[15][46]='d';
  for(let x=41;x<=45;x++){rows[9][x]='c';h[I(x,9)]=-1.5;rows[21][x]='c';h[I(x,21)]=-1.5}
  // a few things that stand on the steps
  const decor=[{k:'hg_pillar',x:12,y:18,block:true},{k:'hg_lamp',x:9,y:16,block:false,walk:true,deco:true},{k:'hg_lamp',x:15,y:16,block:false,walk:true,deco:true},{k:'hg_lamp',x:8,y:36,block:false,walk:true,deco:true},{k:'hg_lamp',x:43,y:12,block:false,walk:true,deco:true},{k:'hg_well',x:43,y:18,block:true}];
  const lights=[[9,16],[15,16],[8,36],[43,12],[12,30],[27,31]];
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=(x>=8&&x<=16&&y>=15&&y<=21)||(h[I(x,y)]<0)?'2':((x>=10&&x<=14&&y>=22&&y<=35)?'1':'0');fm.push(r)}
  const L={rows:rows.map(r=>r.join('')),chars,start:{x:12,y:38,f:0},enemies:[],items:[],decor,lights,portals:[],scenery:[],terrace:{h,riser:HGTE.tile(1,[205,195,175])},fmap:fm,
    floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss'],floor:'ohMeadow',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.58,noExtras:true,noTele:true,diff:66,
    name:'The Test Terraces',label:'The Test Terraces',mapNames:[]};
  return L;
}
hgtRegister(480,hgtBuildTest);
// the room behind the court door: a plain flat room with the door back out
hgtRegister(4850,id=>{
  const wall=HGTE.tile(2.7,[215,150,150]),back=HGTE.doorTile(2.7,[215,150,150],480,{x:45,y:15,f:3}),W=9,Hh=7,g=[];
  for(let y=0;y<Hh;y++)g.push(new Array(W).fill('#'));
  for(let y=1;y<Hh-1;y++)for(let x=1;x<W-1;x++)g[y][x]='.';
  g[0][4]='d';
  return {rows:g.map(r=>r.join('')),chars:{'#':wall,'d':back},start:{x:4,y:2,f:2},enemies:[],items:[],decor:[],lights:[[4,3]],portals:[],floor:'wood',day:0,amb:.2,ceilH:2.7,noTele:true,noExtras:true,name:'The Sunken Room',label:'The Sunken Room',mapNames:[]};
});


/* ==========================================================================
   ENGINE2: covered tubes, pools, wet rooms, and the test level 485 (see sections 7 to 9 of the header). Prefix hgte2.
   ========================================================================== */
/* the ceiling picture of a tube. The painted tile ds 'hgt_tube_ceiling' replaces this placeholder when it exists (artpack.js looks the name up in DS_TEXREG). */
if(DS_TEXREG.hgt_tube_ceiling===undefined){
  const d=new Uint8ClampedArray(128*128*4);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){const o=(y*128+x)*4,rib=(x%64<3||y%64<3)?.82:1,n=((x*7+y*13)%11)/110;d[o]=(196+n*60)*rib;d[o+1]=(186+n*60)*rib;d[o+2]=(214+n*60)*rib;d[o+3]=255}
  DS_TEXREG.hgt_tube_ceiling=addTex(d,null);
}
/* a wet room: an interior level with the under-water look (aqua haze, tint, overlay of shafts and bubbles). No air limit: it is only a look. */
HGTE.wet=new Set();                                  // the submerged rooms: real underwater levels (uwLv in underwater.js)
HGTE.wetReturn=function(id){const r=G.flags.hgtRet&&G.flags.hgtRet[id];return r||null};
HGTE.wetLook=function(id,over){HGTE.wet.add(id);HGTE.look[id]=Object.assign({ambient:.6,haze:.72,hazeRate:.05,hazeCol:[30,118,138],roofHaze:[18,64,84],tint:[.8,1,1.12],lamp:[.9,.95,.8],grade:[190,255,255,.25],motes:0,vignette:.45,wet:[16,110,126,.3],pano:0},over||{});return HGTE.look[id]};
/* is the party swimming (standing on a deep cell of the level it is in)? */
HGTE.swimming=function(id){
  if(typeof G==='undefined'||!G.P||id!==LEVEL)return false;
  const L=LEVELS[id],T=L&&L.terrace;if(!T||!T.water)return false;
  return T.water[G.P.y*L.rows[0].length+G.P.x]===2;
};
{ // swimming changes the look of the level: the same keys as a wet room
  const _lf=hgtLookFor,mem=new Map();
  hgtLookFor=function(id){
    const v=_lf(id);if(!HGTE.swimming(id))return v;
    let s=mem.get(v);if(!s){s=Object.assign({},v,{hazeCol:[30,118,138],roofHaze:[18,64,84],haze:.74,hazeRate:.055,tint:[.8,1,1.12],ambient:Math.max(v.ambient,.62),lamp:[.9,.95,.8],grade:[190,255,255,.25],motes:0,vignette:Math.max(v.vignette,.5),wet:[16,110,126,.3]});mem.set(v,s)}
    return s;
  };
}
/* after every step in a city: say so once when the party swims, and follow a dive cell down to its level */
{ const _ds=desertStep;
  desertStep=function(nx,ny){
    _ds.apply(this,arguments);
    if(!hgtAny(LEVEL))return;
    const L=LEVELS[LEVEL],T=L&&L.terrace;if(!T)return;
    if(T.water){const deep=T.water[ny*L.rows[0].length+nx]===2;HGTE._deepLv=deep?LEVEL:0}
    const d=T.dive&&T.dive[nx+','+ny];
    if(d&&typeof uwSuited==='function'&&uwSuited()){const lv=LEVEL;later(250,()=>{if(LEVEL===lv&&G.P.x===nx&&G.P.y===ny){(G.flags.hgtRet=G.flags.hgtRet||{})[d.to]={to:lv,x:d.ret?d.ret.x:nx,y:d.ret?d.ret.y:ny,f:d.ret?d.ret.f:0};sfx('door');goToLevel(d.to,{x:d.x,y:d.y,f:d.f|0})}})}
  };
}

/* ---------- the test level 485: a tube between two towers, a bent vaulted tube, a pool with a deep end that leads to a submerged room, every stairs-to-nowhere variant ---------- */
LEVEL_NAMES[485]='The Covered Terraces';LEVEL_NAMES[4859]='The Submerged Room';
HGTE.look[485]={ambient:.62,haze:.3,hazeRate:.016,motes:40};
const HGTE2={tint:{a:'hgt_wp',b:'hgt_wa',c:'hgt_wc',d:'hgt_wl'},bands:{a:'hgt_wb0',b:'hgt_wb1',c:'hgt_wb2',d:'hgt_wb3'}};
function hgte2Gid(ch){ // a painted wall tile for a library placeholder char
  const role=HGTL_ROLE[ch],wh=HGTL_WH[ch],m=/^nacre_([abcd])/.exec(role);
  if(role==='door_arch')return hgtaDoorTile('hgt_d2','hgt_wl',wh);                       // a closed ornate arch: the door picture without a link
  if(role==='window'||role==='window_mid')return hgtaWallTile('hgt_wa',wh,{base:'hgt_ww1'});            // the window is at eye level
  if(role==='pillar'||role==='pillar_low')return hgtaWallTile('hgt_wc',wh,{mid:'hgt_wb2'});
  const t=m?m[1]:'c';return hgtaWallTile(HGTE2.tint[t],wh,{top:wh>=2.5?HGTE2.bands[t]:HGTE2.tint[t]});
}
hgtRegister(485,id=>{
  const W=64,H=56,B=hgtlNew(W,H,485),C=HGTL_CHARS;
  hgtlBorder(B,C.nacre_a,0);
  // tube A: three cells wide, vaulted, from x 6 to x 42 on y 38, with a round tower on each side of its middle
  hgtlTower(B,24,31,9,9,{shape:'round',chars:hgtlTaper('b').slice(1,4),h:0});
  hgtlTower(B,24,45,9,9,{shape:'round',chars:hgtlTaper('d').slice(1,4),h:0});
  hgtlTube(B,6,38,42,38,{width:3,lid:2.4,peak:3.2});
  // tube B: a narrower flat tube with a bend, in the north-east
  hgtlTube(B,44,10,58,22,{width:2,lid:2.3});
  // the pool, 13 by 9, shallow ring two cells wide, the deep centre leads to the submerged room
  hgtlPool(B,6,6,13,9,{shallow:2,lead:{to:4859,x:6,y:2,f:2,ret:{x:7,y:10,f:1}},lamps:true});
  // stairs that go nowhere
  hgtlStairsToNowhere(B,22,25,0,'wall',{tint:'a'});
  hgtlStairsToNowhere(B,27,25,0,'window',{tint:'b'});
  hgtlStairsToNowhere(B,32,25,0,'arch',{tint:'d'});
  hgtlStairsToNowhere(B,37,25,0,'chair',{tint:'c'});
  hgtlStairsToNowhere(B,44,28,0,'loop',{tint:'b'});
  for(const [x,y] of [[10,46],[4,40],[4,30],[50,40],[60,30]])hgtlLight(B,x,y);
  for(const [x,y] of [[10,48],[12,48],[50,44],[52,44],[40,46],[3,44]])hgtlDecor(B,'hg_lamp',x,y,{walk:true,deco:true});
  hgtlSetStart(B,10,50,0);
  const val=hgtlValidate(B);HGTE.lastValidate485=val;
  const L=hgtlAssemble(B,{name:'The Covered Terraces',label:'The Covered Terraces',start:B.start});
  const map={},chars={};
  for(const row of L.rows)for(const ch of row)if(ch!=='.'&&map[ch]===undefined){const gid=hgte2Gid(ch),nc=hgtaChar(gid);map[ch]=nc;chars[nc]=gid}
  hgtlBindChars(L,map);L.chars=chars;
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){const i=y*W+x,k=B.kind[i];r+=B.water&&B.water[i]?'3':(B.lid&&B.lid[i]>0)?'4':(k===HGTL.K.STAIR||k===HGTL.K.PLAT)?'1':'0'}fm.push(r)}
  Object.assign(L,{fmap:fm,floorSet:['hgt_f0','hgt_f4','hgt_f2','hgt_f3','hgt_f5','hgt_f1'],floor:'hgt_f0',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.72,noExtras:true,noTele:true,diff:66});
  L.terrace.riser=hgtaWallTile('hgt_wc',1);
  return L;
});
hgtRegister(4859,id=>{
  const W=13,Hh=9,wall=hgtaWallTile('hgt_wa',3,{top:'hgt_wb1'}),back=hgtaDoorTile('hgt_d1','hgt_wa',3,{lvl:485,at:{x:7,y:10,f:1}}),g=[];
  for(let y=0;y<Hh;y++)g.push(new Array(W).fill('#'));
  for(let y=1;y<Hh-1;y++)for(let x=1;x<W-1;x++)g[y][x]='.';
  g[0][6]='d';
  const cw=hgtaChar(wall),cd=hgtaChar(back);
  const decor=[3,9].flatMap(x=>[['hgt_reeds',x,5],['hgt_crystalgrass',x+1,6]]).map(([k,x,y])=>({k,x,y,block:false,walk:true,deco:true}));
  HGTE.wetLook(4859);UWS[4859]={vents:[[6,6]],swim:[]};
  return {rows:g.map(r=>r.join('').replace(/#/g,cw).replace(/d/g,cd)),chars:{[cw]:wall,[cd]:back},start:{x:6,y:2,f:2},enemies:[],items:[],decor,lights:[[3,4],[9,4],[6,6]],portals:[],floor:'hgt_f3',day:0,amb:.5,ceilH:3,noTele:true,noExtras:true,name:'The Submerged Room',label:'The Submerged Room',mapNames:[]};
});

/* the painted skyline pictures of a city are feathered at their edges, so no cut-out rectangle shows against the backdrop */
HGTE.feather=new WeakMap();
function hgtFeather(im){
  if(!im||!im.width)return im;let c=HGTE.feather.get(im);if(c)return c;
  c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const w=c.width,h=c.height,m=document.createElement('canvas');m.width=w;m.height=h;const mx=m.getContext('2d');
  const gx=mx.createLinearGradient(0,0,w,0),fx=Math.min(.2,Math.max(.04,10/w));gx.addColorStop(0,'rgba(0,0,0,0)');gx.addColorStop(fx,'#000');gx.addColorStop(1-fx,'#000');gx.addColorStop(1,'rgba(0,0,0,0)');mx.fillStyle=gx;mx.fillRect(0,0,w,h);
  x.globalCompositeOperation='destination-in';x.drawImage(m,0,0);
  const my=document.createElement('canvas');my.width=w;my.height=h;const myx=my.getContext('2d'),gy=myx.createLinearGradient(0,0,0,h),fy=Math.min(.2,Math.max(.04,10/h));gy.addColorStop(0,'rgba(0,0,0,0)');gy.addColorStop(fy,'#000');gy.addColorStop(1-fy*.5,'#000');gy.addColorStop(1,'rgba(0,0,0,.4)');myx.fillStyle=gy;myx.fillRect(0,0,w,h);
  x.drawImage(my,0,0);HGTE.feather.set(im,c);return c;
}
{const _k=khSkyList;khSkyList=function(){const out=_k.apply(this,arguments);if(hgtLook(LEVEL))for(const o of out)if(o.img&&o.sky)o.img=hgtFeather(o.img);return out}}

/* LOOK UP AND DOWN (cities 480..489 and level 470). The view has no true pitch; the horizon row HH is moved (HH=105+climbView in render3D), and the ground tracer, the walls, the sprites, the mesh pass and the backdrop
   all follow HH. Page Up / Page Down (or the right stick) tilt the view, Home levels it. HGTE.pitch is in rows (+ looks up, up to 100 rows = about 36 degrees above the horizon at the top of the picture, 35 down).
   On a high lookout (ground 4 or more above the street) the view tilts up a little by itself. Giants, fliers, planets and the moon above the street canyons can be seen this way. */
HGTE.pitch=0;HGTE.pitchT=0;HGTE.pk=0;HGTE._pt=0;HGTE.pitchOn=n=>n===470||hgtIsTown(n);
addEventListener('keydown',e=>{if(!HGTE.pitchOn(LEVEL)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='PageUp'){HGTE.pk=1;e.preventDefault()}else if(e.key==='PageDown'){HGTE.pk=-1;e.preventDefault()}else if(e.key==='Home'&&!e.repeat){HGTE.pitchT=0;e.preventDefault()}});
addEventListener('keyup',e=>{if(e.key==='PageUp'&&HGTE.pk>0)HGTE.pk=0;else if(e.key==='PageDown'&&HGTE.pk<0)HGTE.pk=0});
{const _cv=climbView;climbView=function(cx,cy,dX,dY){const r=_cv.apply(this,arguments);
  if(!HGTE.pitchOn(LEVEL)){HGTE.pitch=0;HGTE.pitchT=0;return r}
  const now=performance.now(),dt=Math.min(.1,Math.max(0,(now-HGTE._pt)/1000));HGTE._pt=now;
  let k=HGTE.pk;try{const gp=navigator.getGamepads&&navigator.getGamepads();if(gp)for(const p of gp){if(p&&p.axes&&p.axes.length>3&&Math.abs(p.axes[3])>.45){k=-Math.sign(p.axes[3]);break}}}catch(e){}
  if(k)HGTE.pitchT=Math.max(-35,Math.min(100,HGTE.pitchT+k*130*dt));
  let auto=0;try{const T=LEVELS[LEVEL]&&LEVELS[LEVEL].terrace;if(T&&T.h){const W=LEVELS[LEVEL].rows[0].length,i=(G.C.y|0)*W+(G.C.x|0);if(T.h[i]>=4)auto=Math.min(26,(T.h[i]-3)*6)}}catch(e){}
  const tg=Math.max(-35,Math.min(100,HGTE.pitchT+auto));HGTE.pitch+=(tg-HGTE.pitch)*Math.min(1,dt*9);
  return r+Math.round(HGTE.pitch)}}

/* the floor of a room (a level that is not terraced, 4850 and up) is painted by the plain floor loop in render3D. Pale paintings (cream planks, pearl bands) wash to white under the room's lights, so the same treatment as the
   city ground is given: the pattern is kept around the picture's own average colour (floorContrast, at most 1.6), the brightness is cut (floorGain x .8), the colour is raised (floorSat x 1.25). The inlay pictures of the fmap (floorSet) are treated the same way. */
function hgtFloorMean(fdd){let m=fdd.mn;if(m)return m;let r=0,g=0,b=0,c=0;for(let i=0;i<fdd.length;i+=28){r+=fdd[i];g+=fdd[i+1];b+=fdd[i+2];c++}return fdd.mn=[r/c,g/c,b/c]}
function hgtIntFloor(K,fds){
  const o=HGTE._if||(HGTE._if={m:[],con:1,g0:1,g1:1,g2:1,sat:1});
  for(let i=0;i<6;i++)o.m[i]=hgtFloorMean(fds[i]);
  const g=K.floorGain*.8;o.con=Math.min(K.floorContrast,1.6);o.g0=g*K.floorTint[0];o.g1=g*K.floorTint[1];o.g2=g*K.floorTint[2];o.sat=K.floorSat*1.25;return o;
}
