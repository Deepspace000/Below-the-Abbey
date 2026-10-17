/* ==========================================================================
   HERBAL REMEDIES. Sixteen remedies brewed from the herbs picked off the ground (see collect.js). Recipes are taught at the herbarium of most towns (the herbwife,
   the apothecary, the healers and the potion sellers) for a small fee, and a recipe is also found by mixing herbs on the Herbal Remedies page of the journal.
   Most cure an affliction, for much less than a church asks. Brewing is done at camp, as the other crafting is.
   ========================================================================== */
const HERBAL=[ // [id, name, ingredients, makes, cures (affliction ids), whole party?, heal, recipe price]
 ['rem_feverfew','Feverfew Tea',{herb_chamomile:1,herb_mint:1},2,['fever','poorly','hangover'],0,0,30],
 ['rem_poultice','Comfrey Poultice',{herb_comfrey:1,herb_yarrow:1},2,['bleeding','stung'],0,0,30],
 ['rem_antivenom','Wolfsbane Tonic',{herb_wolfsbane:1,herb_sage:1},2,['poisoned','stung','foodpoison'],0,0,45],
 ['rem_calm','Lavender Calming Tea',{herb_lavender:1,herb_chamomile:1},2,['sleepless','shaken'],0,0,35],
 ['rem_steam','Thyme Steam Balm',{herb_thyme:1,herb_mint:1,herb_nettle:1},2,['tomblung','graverot','poorly'],0,0,45],
 ['rem_tonic','Marigold Healing Tonic',{herb_marigold:1,herb_yarrow:1,herb_comfrey:1},1,[],0,120,40],
 ['rem_eyewash','Ghostcap Eyewash',{herb_ghostcap:1,herb_dandelion:1},2,['sandblind'],0,0,50],
 ['rem_bloodmoss','Bloodmoss Salve',{herb_bloodmoss:1,herb_comfrey:1},2,['bleeding','graverot','fleas'],0,0,55],
 ['rem_cooling','Frostbloom Cooling Tonic',{herb_frostbloom:1,herb_mint:1},2,['sunstroke','dehydrated'],0,0,70],
 ['rem_warming','Emberroot Warming Draught',{herb_emberroot:1,herb_rosemary:1},2,['frostbitten'],0,0,70],
 ['rem_vigour','Sunleaf Vigour Tonic',{herb_sunleaf:1,herb_marigold:1},1,['exhausted'],1,0,60],
 ['rem_ward','Moonpetal Ward Tincture',{herb_moonpetal:1,herb_lavender:1},1,['haunted','cursed'],1,0,80],
 ['rem_dream','Dreamthistle Draught',{herb_dreamthistle:1,herb_chamomile:1},1,['sleepless','exhausted','hangover'],1,0,90],
 ['rem_cleanse','Dragon’s Tongue Cleanser',{herb_dragonstongue:1,herb_nettle:1},1,['poisoned','foodpoison','tomblung','fever'],1,0,100],
 ['rem_elixir','Silverleaf Healing Elixir',{herb_silverleaf:1,herb_sunleaf:1,herb_yarrow:1},1,[],0,300,110],
 ['rem_mandrake','Mandrake Restorative',{herb_mandrake:1,herb_bloodmoss:1,herb_sage:1},1,[],1,500,150]];
for(const [id,n,inn,mk,cures,all,heal] of HERBAL){
  const names=cures.map(c=>AFFL[c]?AFFL[c].n:c);
  ITEMDEF[id]=Object.assign({n,k:'potion',t:'Potion',ic:'potion',c:all?'#c8e8a0':'#7ac060',stack:1,price:25,sw:.3,
    d:(cures.length?`A herbal remedy. Cures ${names.join(', ')}${all?' in the whole party':''}. `:'')+(heal?`Restores ${heal} health${all?' to every hero':''}. `:'')+'Brewed from picked herbs: far cheaper than a church.'},cures.length?{cures:1,all:all?1:0}:{},heal?{heal}:{});
  for(const c of cures)if(AFFL[c]){AFFL[c].cureItem=AFFL[c].cureItem||[];if(!AFFL[c].cureItem.includes(id))AFFL[c].cureItem.push(id)}
  RECIPES.push({id:'h_'+id,herb:1,n,in:inn,out:[id,mk],from:'The herbarium',price:HERBAL.find(h=>h[0]===id)[7]});
}
const HERBAL_RECIPES=()=>RECIPES.filter(r=>r.herb);
const herbComboKey=ids=>ids.slice().sort().join('+');
const HERBAL_COMBOS={};for(const r of HERBAL_RECIPES())HERBAL_COMBOS[herbComboKey(Object.keys(r.in))]=r;
/* a hero who drinks a whole-party tonic with a heal value shares it round */
{const _use=typeof useHeal==='function'?useHeal:null;}
/* the herbarium: teachers in most towns */
const HERBARIUMS=['oh_herbs','oh_apoth','kh_healer','kh_nefer','kh_greenflask','kh_senet','kh_alchemist','ih_alchemist','mon_herb','mon_infirm','ab_healer','yr_herbs','yr_healer'];
for(const npc of HERBARIUMS){if(!NPCS[npc])continue;
  repWrap(npc,()=>HERBAL_RECIPES().some(r=>!recData()[r.id]),'Learn herbal remedies (the herbarium)',()=>herbariumTalk(npc));}
function herbariumTalk(npc){
  const unk=HERBAL_RECIPES().filter(r=>!recData()[r.id]);
  if(!unk.length)return say('You know every remedy I know. Go and pick herbs, and brew at camp. It is much cheaper than a church.',[BYE]);
  const opts=unk.slice(0,4).map(r=>[`${r.n} (${r.price} gold)`,()=>{if(G.gold<r.price)return say(`That costs ${r.price} gold.`,[BYE]);G.gold-=r.price;recData()[r.id]=1;sfx('key');msg(`You learn the ${r.n.toLowerCase()}. It is on the Herbal Remedies page of the journal.`,'#ffe9a0');return say(`${r.n}: ${Object.keys(r.in).map(k=>ITEMDEF[k].n).join(' and ')}. Brew it at camp. It is on your Herbal Remedies page.`,[BYE])}]);
  return say('A herbarium teaches remedies for most of what ails a party, at a fraction of what the church asks. I can teach you these, if you have the coin. You can also try herbs together on your own page, and see what happens.',[...opts,BYE]);
}
/* ---------- the Herbal Remedies page of the journal, with the mixing table ---------- */
const HBS={sel:[],pg:0,note:''};
function hbHerbs(){const o=[];for(const [k,n] of HERBS.map(h=>['herb_'+h[0],h[1]]))if(bagCount(k)>0)o.push([k,n,bagCount(k)]);return o}
journalPage({id:'herbs',title:'Herbal Remedies',
  summary:()=>{const k=HERBAL_RECIPES().filter(r=>recData()[r.id]).length;return k?`${k} of ${HERBAL.length} remedies known. Mix herbs here, brew at camp.`:'No remedies yet. A herbarium teaches them, or mix herbs here and see.'},
  note:()=>0,
  draw(){
    jFrame('Herbal remedies');
    txt('Pick up to three herbs, press Mix, and see what they make. Brewing needs a quiet moment. A remedy costs far less than the church.',40,40,7.4,'#a89878','left',false,undefined,400);
    const hs=hbHerbs();
    if(!hs.length)txt('No herbs in the bag. Herbs lie on the ground in the open lands: walk over one to pick it.',40,60,8,'#8a7a60','left');
    hs.slice(0,12).forEach(([k,n,c],i)=>{const x=36+(i%4)*103,y=52+Math.floor(i/4)*17,on=HBS.sel.includes(k);
      ctx.fillStyle=on?'rgba(80,60,20,.95)':'rgba(24,18,14,.85)';rrect(ctx,x,y,99,15,3);ctx.fill();ctx.lineWidth=on?1.8:1;ctx.strokeStyle=on?'#ffe36a':'#5a4a2c';rrect(ctx,x,y,99,15,3);ctx.stroke();
      const im=IMG['icn_'+k];if(im)ctx.drawImage(im,x+1,y,15,15);txt(`${n} x${c}`,x+19,y+8,7.4,'#e8dcb4','left',false,undefined,78);btn('hb_h'+k,x,y,99,15)});
    const mix=HBS.sel.map(k=>ITEMDEF[k].n).join(' + ')||'(nothing chosen)';
    txt('Mixture: '+mix,40,108,8.6,'#e8d890','left',true,undefined,300);
    btnText('hb_mix','Mix',350,100,46,18);btnText('hb_clear','Clear',398,100,46,18);
    if(HBS.note)txt(HBS.note,40,121,7.6,'#a8d890','left',false,undefined,400);
    const rec=HERBAL_RECIPES(),per=4,pages=Math.max(1,Math.ceil(rec.length/per));HBS.pg=Math.max(0,Math.min(pages-1,HBS.pg));
    rec.slice(HBS.pg*per,HBS.pg*per+per).forEach((r,k)=>{const known=recData()[r.id],ok=canCraft(r),y=130+k*30;
      ctx.save();rrect(ctx,36,y,408,27,4);ctx.fillStyle=known?'rgba(40,28,18,.92)':'rgba(24,18,14,.8)';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle=ok?'#9ac870':known?'#a88a48':'#4a4034';ctx.stroke();ctx.restore();
      txt(known?r.n:'???',44,y+9,9,known?'#ecdca8':'#6a6050','left',true);
      if(known){const d=ITEMDEF[r.out[0]];txt(`Makes ${r.out[1]>1?r.out[1]+' ':''}${d.n}`,44,y+20,6.8,'#9ac8ff','left');let x=170;for(const k2 in r.in){const have=bagCount(k2),need=r.in[k2];txt(`${ITEMDEF[k2].n} ${have}/${need}`,x,y+10,7,have>=need?'#a8d880':'#e08060','left',false,undefined,90);x+=92}
        const cu=HERBAL.find(h=>h[0]===r.out[0]);txt(cu[4].length?'Cures: '+cu[4].map(c=>AFFL[c].n).join(', '):('Heals '+cu[6]),170,y+20,6.6,'#c8b890','left',false,undefined,210);btnText('hb_b'+r.id,'Brew',392,y+4,46,19)}
      else txt(`Taught at the herbarium (${r.price} gold), or found by mixing`,44,y+20,6.8,'#8a7a60','left')});
    btnText('hb_prev','Prev',150,254,60,18);btnText('hb_next','Next',270,254,60,18);txt(`${HBS.pg+1}/${pages}`,240,264,8,'#9a8a68','center');
  },
  click(id){
    if(id==='hb_prev'){HBS.pg--;return}if(id==='hb_next'){HBS.pg++;return}
    if(id==='hb_clear'){HBS.sel=[];HBS.note='';return}
    let m=/^hb_h(.+)$/.exec(id);if(m){const k=m[1],i=HBS.sel.indexOf(k);if(i>=0)HBS.sel.splice(i,1);else if(HBS.sel.length<3)HBS.sel.push(k);HBS.note='';return}
    m=/^hb_b(.+)$/.exec(id);if(m){const r=RECIPES.find(x=>x.id===m[1]);if(r)craft(r);return}
    if(id==='hb_mix'){
      if(HBS.sel.length<2){HBS.note='Choose at least two herbs.';return}
      const r=HERBAL_COMBOS[herbComboKey(HBS.sel)];
      if(!r){HBS.note='Nothing good comes of that mixture. Nothing was used.';sfx('miss');return}
      if(!recData()[r.id]){recData()[r.id]=1;msg(`You discover a remedy: ${r.n}!`,'#ffe9a0');sfx('level')}
      HBS.note=`${r.n}: known. Press Brew below to make it.`;HBS.sel=[];
      HBS.pg=Math.max(0,Math.floor(HERBAL_RECIPES().indexOf(r)/4));
    }
  }
});
/* ---------- the Treasure page of the Collection: everything dug up ---------- */
