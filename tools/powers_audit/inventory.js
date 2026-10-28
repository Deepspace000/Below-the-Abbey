// runs in the page: lists every class power (CLASSES[].powers) and every purchasable spell (MX) as plain rows
(()=>{
  const rows=[];
  CLASSES.forEach((c,ci)=>{
    c.powers.forEach((p,k)=>{
      const o={cls:c.name,res:c.mpn,src:'class',k,id:p.name,lv:p.lv,act:!!p.act,cost:p.act?p.cost:null,type:p.type||'passive',d:p.d||''};
      for(const f of ['m','a','n','dmg','amt','pct','range','daze','undead','b','rounds','party','all','bonus']) if(p[f]!==undefined)o[f]=p[f];
      if(p.pas)o.pas=p.pas;
      rows.push(o);
    });
  });
  for(const s of MX){
    const c=CLASSES.find(x=>x.name===s.cls);
    rows.push({cls:s.cls,res:c.mpn,src:'spell',k:-1,id:s.id,name:s.name,lv:s.lv,act:true,cost:s.cost,price:s.price,type:'mx',aim:JSON.stringify(s.aim),fx:JSON.stringify(s.fx),d:s.d});
  }
  return rows;
})()
