/* ==========================================================================
   THE PALE TOWER: THE STORY (prefix psf6). Two scenes.
   1. The confrontation: the first time the party enters the Throne Room, the Pale King speaks with them before the fight and ties the whole story together (the Rat King, Vance and Corvane,
      the Road Wardens, the six pieces of the Orrery, Maldrake's contract, Wren and Aldous Wend). Plays once (flag psf6S().talk).
   2. The ending: when the Pale King dies, four painted slides (assets/end_*.jpg) show the Blighted Lands healed, Sale freed, the corrupt officials in gaol and King Osric ruling a happy land.
   ========================================================================== */
CUTS.psf6King=()=>[
  {text:'The doors at the top of the stair stand open. A red runner leads the whole length of a black hall to a gilded throne. The Pale King does not stand. He has had a very long time to wait.'},
  {who:'The Pale King',text:'Ten rooms, and you are still walking. Come closer. I would like to see the faces of the people who finished my work for me.'},
  {who:hn(0),text:'Finished your work?'},
  {who:'The Pale King',text:'Under the Abbey there was a tomb, and at its door I set a king of rats to keep it shut. You killed him. That was the first door.'},
  {who:hn(1),text:'Vance\'s ledger. The silver. Corvane\'s ships.'},
  {who:'The Pale King',text:'Mine. I paid in silver because silver is what keeps me. Vance wrote my letters and Corvane carried my coin. The Road Wardens kept the west gate shut and were paid to forget what they guarded. And six small people, each with one small piece, built a machine for me.'},
  {who:hn(2),text:'The Orrery of Hours. It opened the sealed door under the Abbey. We carried every piece to the clockmaker ourselves.'},
  {who:'The Pale King',text:'And so my tomb was opened by honest hands, which is the only kind that can. But a tomb is only a door. I needed blood to stand in it. Osric is old. His granddaughter wears the oak crown. She is blood of my blood, eleven hundred years down.'},
  {who:hn(3),text:'Wren. She went west with Aldous Wend. They are in the Sanctuary at Sale, and they have made a pact.'},
  {who:'The Pale King',text:'I know it. Aldous Wend was my court wizard once, and he ran. Now he teaches the girl to unmake me with my own blood. I let them go. I wanted to see if she would be worthy. She is. That is the worst of it.'},
  {who:hn(2),text:'Wystan Maldrake signed your paper and read one clause. We read him the rest, and his ring broke.'},
  {who:'The Pale King',text:'A kindness. I have worn many silver rings, and each one was a village. The Blight is nothing but my silver running through the land, and I have forgotten how to stop it. I forgot how to be anything but a king who does not die.'},
  {who:hn(0),text:'Then we will stop it for you.'},
  {who:'The Pale King',text:'Yes. If I fall, every ring breaks and every dead man on the Road lies down. Osric\'s men will find every mayor and clerk who sold a town to me. I will not go quietly. I have not forgotten how to be a king.'},
  {who:hn(1),text:'There is a teleport stone by the stair, if anyone wants potions first.'},
  {text:'The Pale King rises from his throne. The candles lean towards him.'}];
/* the ending: four slides over painted pictures, then a last line */
const PSF6_END=[
  ['end_land','The Blighted Lands',['The Pale King is gone, and the silver rings break one by one all along the Blighted Road. The dead lie down in their own graves. The grey fever leaves the dales, and by spring the orchards of the Bone Orchard are in blossom.','The farms of Ashenfold are worked again. The bells of the Church of the Hollow Saint ring the right way up. The fen at Gallowmere drains, and the causeway is a road.']],
  ['end_sale','Sale',['The gates of Sale are opened from the inside. The shops unbar their doors and the lamps are lit for living people. Wren and Aldous Wend come out of the Sanctuary into the square, and the children of the town run to meet them.','Wystan Maldrake goes home to Underhill. He plants a garden on the barrow and tends it for the rest of his life.']],
  ['end_prison','The Gaol of Oldhaven',['King Osric\'s men find every name in the ledger. The corrupt mayors, clerks and paymasters who took the Pale Sovereign\'s silver are brought to Oldhaven in chains. Every one of them sits in the gaol, waiting for the judge, and none of them has a coin left.']],
  ['end_king','King Osric',['King Osric rules for many more years, in a land at peace. His granddaughter Wren sits beside him, and the oak crown on her head does not wilt. The party\'s names are written at the top of the book of Oldhaven, as friends of the crown.','The Abbey is quiet. The crypts are empty. Somewhere far to the west, the sun comes up over green hills.','THE END. Thank you for playing Below the Abbey.']]];
function psf6Slide(i){
  const s=PSF6_END[i];if(!s){G.cut=null;return}
  if(typeof loadImg==='function'&&!IMG[s[0]])loadImg(s[0],'assets/'+s[0]+'.jpg');
  G.cut={id:'psf6end'+i,pic:s[0],i:0,t:G.time,lines:s[2].map(t=>({text:t,title:s[1]})),end:()=>psf6Slide(i+1)};G.hold=null;G.queued=null}
function psf6Ending(){later(2500,()=>{if(!G.cut)psf6Slide(0)})}
/* the first time in the Throne Room: the talk */
pspOnArrive(n=>{if(n!==PSF6.THRONE)return;try{const F=psf6S();if(!F.talk&&F.king!==2){F.talk=1;later(900,()=>{if(!G.cut)startCut('psf6King')})}}catch(e){console.error('psf6 story',e)}});
