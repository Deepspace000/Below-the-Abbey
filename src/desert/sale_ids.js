/* ==========================================================================
   SALE: THE NUMBERS (prefix sa / SA). A grim gothic town of the dead, rated 90, at the end of the (future) Blighted Lands road, west of Wenlock.
   Level ids (all free ranges; see tools/SALE_NOTES.md):
     600        Sale, the town (72 by 72)
     601        The Hollow Cellar (survivors; quest sa4)          602 The Sale Crypt (relic; quest sa9)          603 The Belfry (the boy; quest sa7)
     604 to 619 reserved. 604 to 609 are stubs ("the Blighted Road, not built yet", a way back to Sale) so that a save or a link to them loads; the real road may replace them with
                `saAttachRoad(toLevel, x, y, f)` (see sale_town.js), which makes the east gate of Sale lead there.
     7200 to 7299  rooms behind the doors of Sale (the ten shops, two cottages; 7299 is the Sanctuary, which stays barred, Wren and Aldous Wend will live there later).
   SA.START is where the party arrives from the east gate (the entrance square); SA.EAST is the gate tile itself.
   ========================================================================== */
const SA={ID:600,W:72,H:72,CELLAR:601,CRYPT:602,BELFRY:603,STUBS:[604,605,606,607,608,609],RESERVED:[610,619],H0:7200,H1:7299,SANCT:7299,RATING:90,
  START:{x:67,y:36,f:3},EAST:{x:69,y:36},ROAD:null,ready:false,loading:null};
const saIs=n=>n>=600&&n<=619||n>=7200&&n<=7299;
for(let i=600;i<=619;i++)LEVEL_RATING[i]=90;for(let i=7200;i<=7299;i++)LEVEL_RATING[i]=90;
Object.assign(LEVEL_NAMES,{600:'Sale',601:'The Hollow Cellar',602:'The Sale Crypt',603:'The Belfry of Sale'});
for(const i of SA.STUBS)LEVEL_NAMES[i]='The Blighted Road';
/* the stubs: one small bare room with a way back to the east gate of Sale, built when first asked for (a saved game or a link that names one of these levels) */
function saStubBuild(id){
  if(LEVELS[id])return LEVELS[id];
  const R=khRoom({id:'sastub'+id,name:'The Blighted Road',room:'ruin',keeper:null,enemies:[]},id,{to:SA.ID,x:SA.START.x,y:SA.START.y,f:3});
  const L=R.level;L.diff=90;L.noExtras=true;L.decor=L.decor.filter(d=>!d.npc);L.decor.push({k:'cairn',x:5,y:4,block:true,npc:'sa_stub'});
  LEVELS[id]=L;return L}
for(const i of SA.STUBS)KH_LAZY[i]=()=>saStubBuild(i);
for(let i=SA.RESERVED[0];i<=SA.RESERVED[1];i++)KH_LAZY[i]=()=>saStubBuild(i);
