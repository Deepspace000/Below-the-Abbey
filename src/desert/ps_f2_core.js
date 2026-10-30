/* ps_f2_core.js: the shared core of the second floor (the Hall of Illusions, 9820, and the seven illusion rooms, 9821 to 9827). See tools/PS_F2_SPEC.md.
   The seven pieces of the Sleeper, the flags, and psf2Give(part). Built by the coordinator; the hub agent and the room agents use it, they do not redefine it. */
const PSF2={PARTS:['hand','foot','face','chest','legs','heart','brain'],
  ROOMS:{hand:9821,foot:9822,face:9823,chest:9824,legs:9825,heart:9826,brain:9827},
  NAMES:{hand:"The Sleeper's Hand",foot:"The Sleeper's Foot",face:"The Sleeper's Face",chest:"The Sleeper's Chest",legs:"The Sleeper's Legs",heart:"The Sleeper's Heart",brain:"The Sleeper's Brain"},
  ITEMS:{hand:'psf_hand',foot:'psf_foot',face:'psf_face',chest:'psf_chest',legs:'psf_legs',heart:'psf_heart',brain:'psf_brain'},
  WHERE:{hand:'perfect forest',foot:'island by the sea',face:'cabin in the snow',chest:'waterways',legs:'desert',heart:'swamp',brain:'nightmare'}};
for(const p of PSF2.PARTS){const id=PSF2.ITEMS[p];if(!ITEMDEF[id])ITEMDEF[id]={n:PSF2.NAMES[p],k:'quest',t:'Quest item',ic:'herb',c:'#d8d0e8',stack:1,price:0,sw:.3,
  d:"One of the seven pieces of the Sleeper, found in the "+PSF2.WHERE[p]+". Take it to the Sleeper's table in the Hall of Illusions."}}
function psf2F(){const P=(G.flags.psp=G.flags.psp||{});return P.f2||(P.f2={got:{},rooms:{},talked:0,placed:{},done:0})}
function psf2Got(part){const F=psf2F();return !!(F.got[part]||bagCount(PSF2.ITEMS[part])>0||F.placed[part])}
function psf2Count(){return PSF2.PARTS.filter(psf2Got).length}
function psf2All(){return psf2Count()===PSF2.PARTS.length}
/* a room's puzzle calls this when it is solved: gives the piece once, whatever else happens */
function psf2Give(part){const F=psf2F();if(!PSF2.ITEMS[part]||F.got[part])return false;F.got[part]=1;
  const it=mkItem(PSF2.ITEMS[part]);if(!bagAdd(it))G.items.push({k:PSF2.ITEMS[part],x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false});
  try{msg('You find '+PSF2.NAMES[part]+'.','#ffe36a');sfx('key')}catch(e){}return true}
