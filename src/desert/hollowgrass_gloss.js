/* ==========================================================================
   THE GLOSSARY OF THE GRASSLAND TONGUE. A page of the journal. It lists the words the party has learned so far (learned by asking, or all of them once the four books are handed in),
   as "hollow word = English word", in alphabetical order by the English word. Unlearned words are only counted.
   The page appears once the party has reached the Hollow Grasslands or has learned any of the tongue.
   ========================================================================== */
const hgGlossReached=()=>{const F=G.flags||{};if(F.hgLang)return true;const s=F.lvSeen||{};for(const k in s){const n=+k;if(n>=470&&n<=474||(typeof hgtAny==='function'&&hgtAny(n)))return true}return false};
function hgGlossKnown(){return Object.keys(HG_LEX).filter(hgLearned).sort()}
const HGG_COLS=3,HGG_ROWS=18,HGG_PER=HGG_COLS*HGG_ROWS;
journalPage({id:'hglex',title:'Grassland Tongue',
  hide:()=>!hgGlossReached(),
  summary:()=>`Words known: ${hgGlossKnown().length} of ${Object.keys(HG_LEX).length}. Ask the people of the grassland about words they have said twice.`,
  note:()=>0,
  open(){G.hgPg=0},
  draw(){
    jFrame('Grassland tongue');
    const list=hgGlossKnown(),total=Object.keys(HG_LEX).length+(typeof HGDP_WORDS!=='undefined'?HGDP_WORDS.length:0),pages=Math.max(1,Math.ceil(list.length/HGG_PER));
    G.hgPg=clamp(G.hgPg||0,0,pages-1);
    txt(`Words known: ${list.length} of ${total}`,240,42,10,'#e8d890','center',true);
    if(!list.length)txt('No words yet. Listen to the people, then ask about a word.',240,150,9,'#a89878','center');
    const cw=136,x0=36,y0=60;
    list.slice(G.hgPg*HGG_PER,(G.hgPg+1)*HGG_PER).forEach((w,i)=>{
      const col=Math.floor(i/HGG_ROWS),row=i%HGG_ROWS,x=x0+col*(cw+6),y=y0+row*12.6;
      txt(HG_LEX[w]||(typeof HGD_LEX!=='undefined'&&HGD_LEX[w])||'',x,y,8.4,'#e8d890','left',false,undefined,66);
      txt('= '+w,x+68,y,8.4,'#d2c9b2','left',false,undefined,cw-68)});
    txt(`Page ${G.hgPg+1} of ${pages}`,240,285,8,'#9a8a68','center');
    if(pages>1){btnText('hg_prev','Prev',60,278,90,16);btnText('hg_next','Next',330,278,90,16)}
  },
  click(id){const pages=Math.max(1,Math.ceil(hgGlossKnown().length/HGG_PER));
    if(id==='hg_prev')G.hgPg=(G.hgPg+pages-1)%pages;if(id==='hg_next')G.hgPg=(G.hgPg+1)%pages}
});
cv.addEventListener('wheel',e=>{if(G.menu!=='jp:hglex')return;const now=performance.now();if(now-(G._hgW||0)<180)return;G._hgW=now;
  const pages=Math.max(1,Math.ceil(hgGlossKnown().length/HGG_PER));G.hgPg=clamp((G.hgPg||0)+(e.deltaY>0?1:-1),0,pages-1);e.preventDefault()});
