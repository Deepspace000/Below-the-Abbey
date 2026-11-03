/* ==========================================================================
   THE CREDITS PAGE. A Credits button on the More page opens a paged list (three pages, by section) of every piece of music and sound in the game: its title and who made it (the full list with
   links and licences is assets/audio/CREDITS.txt; keep the two in step when a sound is added). Prev, Next and Back like the Achievements page.
   ========================================================================== */
const CR_PAGES=[   // three pages, one or two sections each ([text,1] a heading, [text,2] the closing line)
  [['MUSIC',1],
   ['Finding Mithral, Geoff Harvey (Pixabay)'],['Wanderer at Night, Zambolino (freetouse.com)'],['Embers on the Flagstone, Kaazoom (Pixabay)'],['RPG Medieval Animated Music, Andorios (Pixabay)'],
   ['Forgotten Deserts, MoodMode (Pixabay)'],['Vibration of the Sand, Dream of a Holy City and Golden Key,'],['   by deepspace (Mirko Ruckels)'],['The tomb music (title and author not recorded)'],
   ['Dungeon music of the desert dungeons (title and author not recorded)'],['Dark Cavern Ambient (001), Paul Wortmann (OpenGameArt)'],['Searching, yd (OpenGameArt)'],['Paranoid Truth, Tsorthan Grove (OpenGameArt)'],
   ['The Old Tower Inn and Medieval Kings Feast, Snabisch (OpenGameArt)'],['Another August, cynicmusic, The Cynic Project (OpenGameArt)'],['Chant, christislord (OpenGameArt)']],
  [['DUNGEON AND NATURE SOUNDSCAPES',1],
   ['Creepy Dungeon Ambience, drminky (Freesound)'],['Dungeon Ambiance, phlair (Freesound)'],['Dark Cave Background 2, solarphasing (Freesound)'],
   ['Forest Rain Atmo (Fantasy), szegvari (Freesound)'],['Rain at the small forest lake in summer, garuda1982 (Freesound)'],['Nature sounds (supplied for the game)'],
   ['AMBIENCE',1],
   ['Dungeon Ambience, Creomoto (OpenGameArt)'],['Village ambience, ramonmineiro (Freesound)'],['Mild Wind Background Noise (OpenGameArt)'],['Amb Rain Loop 1 (OpenGameArt)']],
  [['SOUND EFFECTS',1],
   ['Impact Sounds, Kenney (kenney.nl)'],['20 Sword Sound Effects, StarNinjas (OpenGameArt)'],['Footsteps on wood, stone, leaves, gravel and mud, qubodup (OpenGameArt)'],
   ['Fantozzi\'s Footsteps, Raassh (OpenGameArt)'],['Church bells, Audeption and _CAZAPROD_ (Freesound)'],['Horse trotting, KobatoGames (OpenGameArt)'],['Cart horse, bruno.auzet (Freesound)'],
   ['Goat, TheKingOfGeeks360 (Freesound)'],['Sheep baa (OpenGameArt)'],['Chicken, evsecrets (Freesound)'],['Cow, spurioustransients (Freesound)'],['Dog barking, HaelDB (OpenGameArt)'],
   ['Thank you to everyone who shares their sounds.',2]]
];
function drawCredits(){
  BTNS=[];veil(.7);bigPanel(24,8,432,304);
  const pages=CR_PAGES.length;G.crPage=clamp(G.crPage||0,0,pages-1);
  txt('CREDITS: MUSIC AND SOUND',240,24,13,'#d8c88e','center',true);
  CR_PAGES[G.crPage].forEach((r,i)=>{const y=50+i*14.5;
    if(r[1]===1)txt(r[0],44,y,8.5,'#c8a860','left',true);
    else if(r[1]===2)txt(r[0],240,y+4,8,'#b8aa88','center');
    else txt(r[0],52,y,8,'#e2d8bc','left',false,undefined,380)});
  txt(`Page ${G.crPage+1} of ${pages}`,240,296,8,'#9a8a68','center');
  btnText('cr_prev','Prev',44,284,90,22);btnText('cr_back','Back',195,284,90,22);btnText('cr_next','Next',346,284,90,22);
}
(function(){const _d=drawMoreMenu;drawMoreMenu=function(){_d();btnText('credits','Credits',140,240,200,26)}})();
(function(){const _m=drawMenu;drawMenu=function(){if(G.menu==='credits'){drawCredits();return}_m.apply(this,arguments)}})();
(function(){const _b=handleBtn;handleBtn=function(id){
  if(G.menu==='more'&&id==='credits'){G.menuBack='more';G.menu='credits';G.crPage=0;return}
  if(G.menu==='credits'){if(id==='cr_prev')G.crPage=Math.max(0,(G.crPage||0)-1);else if(id==='cr_next')G.crPage=(G.crPage||0)+1;else if(id==='cr_back'||id==='menuback'||id==='menuclose'||id==='menu')G.menu=menuBack();return}
  _b.apply(this,arguments)}})();
