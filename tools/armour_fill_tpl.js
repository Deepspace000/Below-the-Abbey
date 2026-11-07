/* ==========================================================================
   ARMOUR FILL (made by tools/gen_armour_fill.py). Ten more great sets (helm, chest, arms, legs) at levels 15, 25, 35, 45, 55, 75, 85, 95, 105 and 110, so a better set turns up about every five levels
   instead of every ten, and eleven shields (the shields stopped at level 60). Same rules as the sets in armour.js: set bonus for four pieces, sold in the armouries up to ten levels ahead, found in chests.
   ========================================================================== */
const AF_IDS=[];
{
  const D=/*DATA*/;
  D.S.forEach(([key,name,lv,col,fl,keys,bonus,title,names])=>{
    const t=lv/10,A=Math.round(5+lv*.38),pr=Math.round(400*Math.pow(t,1.7)),btxt=Object.keys(bonus).map(k=>ARM_TXT[k](bonus[k])).join(' ');
    ARM_SET_OF[key]={name:title,bonus,btxt,lv,key};
    ARM_SETS.push([key,name,lv,col,fl,keys,bonus,title]);
    ARM_SLOTS.forEach(([sx,slot,ty,ic,f],i)=>{
      const id='ar_'+key+'_'+sx,k=keys[i],v=ARM_VAL[k](t),pas={};pas[k]=v;
      ITEMDEF[id]={n:names[i],k:slot,t:ty,ic,c:col,armor:Math.max(2,Math.round(A*f)),price:Math.max(30,Math.round(pr*f)),lvl:lv,pas,set:key,tier:lv,
        d:`${ARM_TXT[k](v)} Set: ${title}. All four pieces give: ${btxt} Needs level ${lv}.`,sw:slot==='head'?.38:slot==='chest'?.46:.4,gear:1};
      GEAR.push(id);ARM_IDS.push(id);AF_IDS.push(id)})});
  D.SH.forEach(([lv,n])=>{const t=lv/10,id='sh_'+lv,pas={dodge:+(.012*t+.02).toFixed(3),thorns:Math.round(1.2*t)};
    ITEMDEF[id]={n,k:'shield',t:'Shield',ic:'shield',c:'#a0a8b8',armor:Math.round(2+lv*.17),price:Math.round(180*t*t/10)*10,lvl:lv,pas,tier:lv,
      d:`A shield. Enemies miss ${Math.round(pas.dodge*100)}% more and take ${pas.thorns} damage for every blow they land. Needs level ${lv}.`,sw:.42,gear:1};
    GEAR.push(id);AF_IDS.push(id)});
  if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...AF_IDS);
}
