/* ==========================================================================
   MAGIC GEAR of the desert: found in the tomb, and in the little dungeons under the mounds of the dunes.
   Their pictures are painted art (assets/icn_<id>.png); until a picture exists the old drawn icon stands in.
   ========================================================================== */
Object.assign(ITEMDEF,{
  sunblade:{n:'Sunforged Scimitar',k:'weapon',t:'Sword',ic:'sword',c:'#f0d070',dmg:[13,19],hit:.08,req:{str:13},price:900,rar:1,d:'A curved blade that holds the heat of noon. It never dulls, and it cuts like light.',sw:.4},
  dunebow:{n:'Bow of the Dunes',k:'weapon',t:'Bow',ic:'bow',c:'#e8c880',dmg:[11,16],hit:.15,ranged:5,req:{dex:13},price:880,rar:1,d:'Bone and sun-bleached wood. Its arrows seem to ride the wind, and they seldom miss.',sw:.42},
  sandstaff:{n:'Staff of Shifting Sands',k:'weapon',t:'Staff',ic:'staff',c:'#e0b868',dmg:[2,5],magic:6,req:{int:12},price:860,rar:1,d:'Fine sand runs endlessly down the inside of its glass head. Adds 6 to the power of spells.',sw:.4},
  jackalhelm:{n:'Helm of the Jackal',k:'head',t:'Helm',ic:'head',c:'#e0b038',armor:5,req:{str:10},price:700,rar:1,d:'Gold, shaped like the head of a jackal. Its wearer hears the dead before they strike.',sw:.38},
  goldmail:{n:'Gilded Cuirass',k:'chest',t:'Chest',ic:'chest',c:'#f0c850',armor:9,req:{str:12},price:1100,rar:1,d:'A breastplate of gold over blue linen. It is light as a shirt, and blows glance off it.',sw:.44},
  sunbracers:{n:'Bracers of the Sun',k:'arms',t:'Arms',ic:'arms',c:'#e8c050',armor:3,price:600,rar:1,d:'Gold bands set with lapis. They stay warm, even in the dark.',sw:.36},
  duneboots:{n:'Greaves of the Dunes',k:'legs',t:'Legs',ic:'legs',c:'#d8a860',armor:4,price:640,rar:1,d:'Soft red leather and gold studs. The sand does not slow the one who wears them.',sw:.4},
  pharaohshield:{n:"Pharaoh's Aegis",k:'shield',t:'Shield',ic:'shield',c:'#e8c050',armor:6,req:{str:11},price:820,rar:1,d:'A round shield of gold and lapis with a winged sun on its face.',sw:.42},
  scarabring:{n:'Scarab Ring',k:'ring',t:'Ring',ic:'ring',c:'#3aa89a',hp:14,price:700,rar:1,d:'A beetle carved from green stone, set in gold. Adds 14 to maximum health.',sw:.2},
  ankhring:{n:'Ring of the Ankh',k:'ring',t:'Ring',ic:'ring',c:'#f0c850',dmgb:3,price:760,rar:1,d:'Gold, with a tiny ankh on its face. Adds 3 to melee damage.',sw:.2},
  eyering:{n:'Eye of Ra',k:'ring',t:'Ring',ic:'ring',c:'#4a7ae0',hitb:.12,price:780,rar:1,d:'A ring with a blue eye that follows the foe. Adds 12% to hit chance.',sw:.2},
  wardring:{n:'Ring of the Tomb Guard',k:'ring',t:'Ring',ic:'ring',c:'#c8b070',armor:3,price:720,rar:1,d:'A heavy ring of old bronze. Adds 3 armor.',sw:.2}
});
const DS_ITEM_IDS=['sunblade','dunebow','sandstaff','jackalhelm','goldmail','sunbracers','duneboots','pharaohshield','scarabring','ankhring','eyering','wardring','sundisc'];
const DS_MAGIC_TOMB=['sunblade','dunebow','sandstaff','jackalhelm','goldmail','sunbracers','duneboots','pharaohshield','scarabring','ankhring','eyering','wardring'];
