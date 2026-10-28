// runs inside the page after audit.js. window.__pf.fight(classIds[4], L, nFoes, reps): the party fights nFoes creatures of level L in a corridor, no enemy attacks (rounds to kill only).
// Policy: every hero uses its highest-level damaging class power it can afford, otherwise a plain attack. Real functions: heroSpecial and heroAttack.
(function(){
const DMGT=['melee','multi','shot','volley','ranged','aoe','drain','backstab','twin','butt','daze','spell'];
function pickFoe(){
  let best=null,bd=1e9;for(const k in ENEMY_DEF){const d=ENEMY_DEF[k];if(!d.hp||d.boss||d.fly||d.ranged||/skel|ghost|spectre|wraith|mummy|zombie|uw/.test(k))continue;const x=Math.abs(d.hp-170);if(x<bd){bd=x;best=k}}
  return best;
}
function party(cls,L){
  const mk=window.__pa.mkHero;
  const hs=[];
  cls.forEach((c,i)=>{ // build into slot i (mkHero builds slot 0): build then move
    const save=HERO_DEF[0];const r=mk(c,L);HERO_DEF[i]=HERO_DEF[0];G.heroes[i]=G.heroes[0];if(i>0){HERO_DEF[0]=save}
  });
}
window.__pf={pickFoe,
fight(cls,L,nFoes,reps,policy){
  reps=reps||10;nFoes=nFoes||3;const foe=pickFoe();const res=[];
  const rm=window.msg;window.msg=function(){};
  const rafl=window.addFloat;
  for(let rep=0;rep<reps;rep++){
    // build four heroes
    const H=[],D=[];
    for(let i=0;i<4;i++){window.__pa.mkHero(cls[i],L);H[i]=G.heroes[0];D[i]=HERO_DEF[0]}
    for(let i=0;i<4;i++){HERO_DEF[i]=D[i];G.heroes[i]=H[i];H[i].mp=H[i].mpMax;H[i].hp=H[i].max;H[i].alive=true;H[i].learned=[]}
    G.buffs=[];G.enemies.length=0;
    const dir=DIRS[G.P.f];let foes=[];
    for(let k=0;k<nFoes;k++){const st=enemyStat(foe,L);foes.push({id:k,t:foe,lvl:L,hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:1,sx:210,sy:100,x:0,y:0,rx:0,ry:0})}
    G.enemies=foes.slice();
    const place=()=>{const live=G.enemies.filter(e=>e.hp>0);live.forEach((e,k)=>{e.x=G.P.x+dir[0]*(k+1);e.y=G.P.y+dir[1]*(k+1);e.rx=e.x;e.ry=e.y})};
    let rounds=0,ownMana=0;
    while(G.enemies.some(e=>e.hp>0)&&rounds<400){
      rounds++;place();
      for(let i=0;i<4;i++){
        if(!G.enemies.some(e=>e.hp>0))break;place();
        const h=G.heroes[i],PW=heroPowers(i);
        let pick=-1;
        if(policy!=='plain'){for(let k=PW.length-1;k>=0;k--){const P=PW[k];if(P.act&&!P.mx&&DMGT.includes(P.type)&&h.lvl>=P.lv&&(P.type==='spell'?false:h.mp>=P.cost)){pick=k;break}}}
        if(pick>=0){h.powSel=pick;const w=h.mp;const ok=heroSpecial(i);ownMana+=w-h.mp;if(!ok)heroAttack(i)}
        else heroAttack(i);
        G.enemies.forEach(e=>{if(e.hp<=0){e.dying=0}});
      }
      // frozen/held foes lose nothing here; remove the dead from play
      G.enemies=G.enemies.filter(e=>e.hp>0);
    }
    res.push(rounds);G.enemies=[];
  }
  window.msg=rm;
  return {foe,L,cls,rounds:res.reduce((a,b)=>a+b,0)/res.length,min:Math.min(...res),max:Math.max(...res),foeHp:enemyStat(foe,L).hp};
}};
})();
