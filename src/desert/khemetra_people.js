/* ==========================================================================
   KHEMETRA: THE PEOPLE. Every enterable building (shops, inns, prayer houses, temples, baths, work houses, quest halls, the
   ship shop, derelict houses, the palace), the room inside it, who stands there, and the crowd in the streets and markets.
   ========================================================================== */
const KH_NAMES=['Amun','Bastet','Cheops','Dedi','Eset','Faiza','Gebu','Hapi','Imhotep','Jabari','Kenna','Layla','Merit','Nebet','Omari','Paser','Qadir','Rashida','Sennet','Tarek','Usi','Vashti','Wahid','Xena','Yasmin','Zahra','Ahmose','Banu','Cyra','Djet','Emre','Farah','Gamal','Hana','Idris','Jamila','Karim','Lina','Mahir','Nadia','Osiri','Pia','Rami','Sabah','Tuya','Umar','Wenis','Yara','Zaki','Anuket','Baqet','Dalila','Eman','Fahim','Ghada','Hasan','Inas','Jelani','Khaled','Leila','Mona','Nour','Orsa','Qamar','Rania','Samir','Talia'];
const KH_TITLES=['the water seller','the weaver','the potter','the scribe','the carpenter','the dyer','the fisher','the baker','the glassblower','the mason','the lamp maker','the sandal maker','the date seller','the barber','the rope maker','the porter','the tanner','the incense seller','the jeweller','the shepherd'];
const KH_GOSSIP=[
 'Khemetra was built when the Red God was bound beneath the dunes. Everything you see stands on his chains, they say.',
 'Mind the noon sun. The white stone throws it back at you, and the gold throws it back twice.',
 'The grand vizier has not smiled in a year. Some say it is the missing seal. Some say it is the king.',
 'My cousin walked the Sand Road once and came back with a scorpion in his shoe and a tale for every tavern.',
 'You can buy anything in the Grand Bazaar if you know whom to ask, and whom not to.',
 'The bathhouses are the only place in the city where the guards leave their spears at the door.',
 'There is a wizard somewhere in Khemetra. Nobody agrees where. Everyone agrees he is old.',
 'I sell dates to the palace kitchens. They pay late, but they pay well, and the dates are the best in the world.',
 'Never haggle with a spice seller before noon. They are grumpy until their second cup of mint tea.',
 'They say the golden spire of the palace can be seen from three deserts away. I believe it. I have seen it from the roof.',
 'The old quarter in the north-west is falling down. The owners left, and the sand moved in.',
 'A ship in a city this far from the sea sounds like a joke, but the shipwright takes it very seriously.',
 'The temple bells ring at dawn, noon and dusk. If they ring at any other time, bar your door.',
 'The palm trees were planted by the first queen, one for every child born in the city. We have a lot of palm trees.',
 'Cats own this city. The people only rent it.',
 'The carpet sellers and the cloth sellers have been feuding for forty years. Nobody remembers why.',
 'If you hear singing from under the Potters Market, ignore it. It is only the cistern.',
 'The night watch sings out the hours. The one in the east gets every note wrong. We love him for it.',
 'You look like adventurers. We get a lot of those. Most go out the south gate and come back poorer, and wiser if lucky.',
 'The market opens at dawn. By noon the best of everything is gone, and by dusk the rest is cheap.',
 'My grandmother says the city has a heartbeat, if you stand on the palace steps at midnight. I have never dared.',
 'The vizier keeps the city. The cartographer keeps the maps. The wizard, they say, keeps the secrets.',
 'Wear white and gold and nobody asks questions. Wear grey and everybody does.',
 'There used to be a fountain in every square. Half of them have gone dry. We do not talk about it.',
 'A traveller told me there is an ocean beyond the eastern desert. I told him I had never heard of an ocean. He laughed.',
 'The bathhouse on the court is warm all year, even in the cold nights. The old stones remember the sun.',
 'The Moon Garden is the best place to be in the evening. Bring a friend, or a lantern, or both.',
 'We are very proud of our walls. Four hundred cells a side and not one crack. Well, one. We do not mention it.',
 'Beware of pickpockets near the Fruit Market. They are small, quick, and polite.',
 'I would give a month of wages for a single tin of the red ink that the scribes use. They hide it like gold.',
];
const KH_FACES={ // which painted person stands for which kind of citizen
  men:['kh_npc1_0','kh_npc1_2','kh_npc5_2','kh_npc5_3','kh_npc5_4','kh_npc5_5','kh_npc2_0'],
  women:['kh_npc1_1','kh_npc1_3','kh_npc1_5','kh_npc2_1','kh_npc2_4'],
  kids:['kh_npc1_4','kh_npc5_1'],
  poor:['kh_npc5_0'],
  guards:['kh_npc3_0','kh_npc3_0','kh_npc3_2'],
};
const KH_NPC_H={kh_npc1_4:.6,kh_npc5_1:.62,kh_npc1_2:.76,kh_npc3_1:.92,kh_npc3_0:.88,kh_npc3_2:.9,kh_npc3_5:.88};
