// runs inside the page. window.__pa.measure(clsId, L, N): fresh hero 0 of that class at level L with the level's usual gear,
// every unlocked active power used N times through the real use function (heroSpecial) on three standing dummies of level L.
(function(){
const WT={Warrior:'Sword',Barbarian:'Axe',Paladin:'Mace',Ranger:'Bow',Archer:'Bow',Thief:'Dagger',Assassin:'Dagger',Mage:'Staff',Sorcerer:'Staff',Priest:'Mace',Monk:'Mace',Goat:'Mace'};
function bestWeapon(cls,L,h){
  const t=WT[cls];let best=null,bs=-1;
  for(const id in ITEMDEF){const d=ITEMDEF[id];if(d.k!=='weapon'||d.t!==t||!(d.price>0)||d.lvl===undefined&&t!=='Staff')continue;
    if((d.lvl||0)>L)continue;const r=d.req||{};if((r.str||0)>h.str||(r.dex||0)>h.dex||(r.int||0)>h.int)continue;
    const s=(d.dmg[0]+d.dmg[1])/2+(d.magic||0)*3;if(s>bs){bs=s;best=id}}
  return best;
}
function mkHero(cls,L){
  HERO_DEF[0]=heroDefFrom({app:65,cls,name:'Tester',bs:0,bd:0,bi:0});
  const d=HERO_DEF[0];
  const h={hp:d.hp,max:d.hp,base:d.hp,mp:d.mp,mpMax:d.mp,alive:true,hurt:0,flash:0,lvl:1,xp:0,food:100,powSel:0,learned:[],str:d.str,dex:d.dex,int:d.int,eq:{},spellSel:0,lvlFlash:0,unarmed:d.unarmed};
  G.heroes[0]=h;
  while(h.lvl<L){h.xp=xpNeed(h.lvl);levelUp(0)}
  const w=bestWeapon(d.cls,L,h);if(w)h.eq.main=mkItem(w);
  if(d.caster){h.eq.s0=mkItem('sp_fire');h.eq.s1=mkItem('scrollFrost')}
  h.learned=MX.filter(s=>s.cls===d.cls&&s.lv<=L).map(s=>s.id);
  G.lvlBanners.length=0;recalcMax(0);h.hp=h.max;
  return {h,w};
}
function dummies(L){
  G.enemies.length=0;const out=[];const dir=DIRS[G.P.f];
  for(let k=1;k<=3;k++){const x=G.P.x+dir[0]*k,y=G.P.y+dir[1]*k;
    const e={id:k,t:'rat',lvl:L,x,y,rx:x,ry:y,hp:1e9,maxhp:1e9,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:1,sx:210,sy:100};
    G.enemies.push(e);out.push(e)}
  return out;
}
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function dotOf(e){let t=0;const s=e.st||{};for(const k of ['bleed','poison','burn'])if(s[k]&&s[k].n>0)t+=s[k].n*s[k].d;return t}
function statusOf(e){const s=e.st||{},o=[];for(const k of ['hold','sleep','fear','curse','blind','vuln','slow','confuse'])if(s[k]>0)o.push(k+s[k]);for(const k of ['bleed','poison','burn'])if(s[k]&&s[k].n>0)o.push(k+' '+s[k].n+'x'+s[k].d);if(e.chilled)o.push('stun');if(e.poly)o.push('poly '+e.poly.name);return o.join(',')}
function Uw(h){const r=heroDmgRange(h),w=heroWeapon(h);const crit=weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit');return (r[0]+r[1])/2*(1+pasH(h,'dmgPct'))*(1+.5*crit)}
function Um(h){return (intB(h)+magicBonus(h)+8)*(1+pasH(h,'spellPct'))}
window.__pa={mkHero,dummies,Uw,Um,
measure(cls,L,N,det){
  N=N||30;
  // det: expectation mode. No dice: Math.random is .5 (middle of every range, no double hits) and the double-hit chance is added back as its expected value
  // (x (1 + half the chance)) for the powers that roll the weapon; the real functions still do all the work. Without det the numbers are plain averages of N uses.
  const RR=Math.random,RD=window.rollDmg;
  if(det){Math.random=()=>.5;window.rollDmg=function(h,mult){const r=heroDmgRange(h);return {d:Math.max(1,Math.round((r[0]+r[1])/2*(mult||1)*(1+pasH(h,'dmgPct')))),crit:false}}}
  const {h,w}=mkHero(cls,L);const d=HERO_DEF[0];
  const out={cls:d.cls,level:L,res:d.mpn,weapon:w&&ITEMDEF[w].n,str:h.str,dex:h.dex,int:h.int,mpMax:h.mpMax,hpMax:h.max,Uw:Uw(h),Um:Um(h),rows:[]};
  const msgs=[];const rm=window.msg;window.msg=function(t){msgs.push(String(t))};
  const PW=heroPowers(0);
  const hits={};
  const realHurt=hurtEnemy;
  PW.forEach((P,k)=>{
    const row={k,name:P.name,id:P.mx||P.name,lv:P.lv,act:!!P.act,type:P.type||'passive',cost:P.cost,avail:h.lvl>=P.lv,desc:String(P.d||'')};
    if(!P.act||!row.avail){out.rows.push(row);return}
    if(P.type==='sense'){out.rows.push(row);return}
    h.powSel=k;
    const D=dummies(L);const dmg1=[],dmgT=[],ntg=[],dots=[],tgs=[],spent=[],oks=[],stat=[],buffs=[];
    for(let n=0;n<N;n++){
      D.forEach(e=>{e.hp=1e9;e.maxhp=1e9;e.st=null;e.chilled=0;e.poly=null;e.alert=true});
      G.enemies.length=0;D.forEach(e=>G.enemies.push(e));
      G.buffs=[];h.mpMax=Math.max(h.mpMax,1000);h.mp=1000;G.heroes.forEach((x,j)=>{x.alive=true;if(j)x.hp=x.max});h.hp=Math.max(1,Math.floor(h.max*.5));
      const was=h.mp;const ok=heroSpecial(0);oks.push(ok?1:0);spent.push(was-h.mp);
      const dm=D.map(e=>1e9-e.hp);dmg1.push(dm[0]);dmgT.push(dm[0]+dm[1]+dm[2]);{const dts=D.map(dotOf);ntg.push(D.filter((e,i)=>dm[i]>0||dts[i]>0).length)}dots.push(dotOf(D[0]));
      tgs.push(D.filter(e=>statusOf(e)).length);if(n===0){stat.push(statusOf(D[0]));buffs.push(G.buffs.map(b=>b.b+'+'+b.amt+'x'+b.left+(b.hi<0?' party':'')).join(';'))}
    }
    if(det&&P.dmg===undefined&&['melee','multi','shot','volley','ranged','twin','backstab','butt','aoe'].includes(P.type)){const w=heroWeapon(h);const cr=weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit');const f=1+.5*cr;for(const a of [dmg1,dmgT])for(let q=0;q<a.length;q++)a[q]*=f}
    row.ok=avg(oks);row.spent=avg(spent);row.dmg=avg(dmg1);row.dmgAll=avg(dmgT);row.targets=avg(ntg);row.dot=avg(dots);row.tgStat=avg(tgs);row.status=stat[0]||'';row.buff=buffs[0]||'';
    // refused when resources are short, deducted nothing
    D.forEach(e=>{e.hp=1e9;e.st=null});G.buffs=[];h.mp=P.cost-1;const before=h.mp;const okL=heroSpecial(0);row.lowOk=okL?1:0;row.lowSpent=before-h.mp;
    out.rows.push(row);
  });
  window.msg=rm;h.powSel=0;Math.random=RR;window.rollDmg=RD;
  return out;
}};
})();
