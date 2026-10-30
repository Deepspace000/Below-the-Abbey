/* ps_flush.js: castle wall pictures lie flush on the wall (Pale Spire, every level of PSP.LEVELS).
   The engine draws a wall picture (decor pic:1 with wd) as a flat plane at .47 of a cell from the middle of its square, 0.03 in front of the wall face, floating at bob .45 by default, as wide as its
   painting. In the castle that read as a card hovering in front of the wall: the painted ledge of an alcove hung half a cell above the floor, and a wide picture spilled over the next wall square.
   Here, for castle levels only, after the engine has listed the sprites:
   1. the plane is moved to .497, on the wall face (the depth test hides a picture only when the wall is nearer by more than .02, so nothing z-fights);
   2. a floor-standing alcove or statue picture (alcove_*, st_*, suit_armour, furn_*, fireplace, trophy) sits on the floor (bob 0) so its ledge is a plinth, not a shelf in mid air;
   3. no picture is wider than its wall square (.96; height follows the painting's aspect), so none overlaps the next square or a doorway;
   The true cause of the oversized look: the engine's spriteList sizes a picture as NPC_H times its aspect and ignores decor.sc, so ps_wallart.js's narrowing (which sets sc) never took effect; an alcove (h 2.6) was 1.78 cells wide and overlapped its neighbours. */
const PSF_FLOOR=/alcove|(^|_)st_|suit_armour|furn_|fireplace|trophy|statue|plinth/i;
const PSF_STAND=/alcove|(^|_)st_|statue|plinth/i;
const PSF_FIXED=/door|gate|arch_stair|stair/i;
const PSF_MAXW=.96;
function psfOn(){return typeof LEVEL!=='undefined'&&typeof PSP!=='undefined'&&PSP.LEVELS&&PSP.LEVELS.some(l=>l.id===LEVEL)}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  if(!psfOn()||window.PSF_OFF)return L;
  for(const s of L){const d=s.decor;if(!s.pic||!d||!d.wd||!s.flat)continue;
    try{const k=String(d.k);
      s.x=d.x+.5+d.wd[0]*.497;s.y=d.y+.5+d.wd[1]*.497;
      if(PSF_STAND.test(k)||(PSF_FLOOR.test(k)&&d.bob===undefined))s.bob=0;
      if(!PSF_FIXED.test(k)&&s.w>PSF_MAXW)s.w=PSF_MAXW;
    }catch(e){console.error('ps flush',e)}}
  return L}}
