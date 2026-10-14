/* ==========================================================================
   LOCK PICKS. Every house door in the towns opens, but about one in three is locked. A locked door needs a real set of lock
   picks (from any trader), and picks can bend or snap. The Lockpicking skill still decides the odds.
   ========================================================================== */
ITEMDEF.lockpick={n:'Lock Picks',k:'tool',t:'Tool',ic:'lockpick',c:'#b8b0a0',stack:1,price:25,d:'A little roll of tension wrenches and hooked picks. Needed to open a locked door. A pick can bend or snap, so buy a few.',sw:.1};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('lockpick','potion','antidote','salve','holywater','sleeptea','healdraught','greaterheal','superiorheal','elixir','manadraught','greatermana','supermana','might','swiftness','ironskin','keeneye'); // painted bottles: each its own colour, bigger and finer glass as the draught gets stronger; the salve is a jar
SHOP_STOCK.push(['lockpick',6]);MERCHANT_STOCK.push(['lockpick',6]);
for(const k of ['general','trader','seagoods']){const f=KH_STOCK[k];if(f)KH_STOCK[k]=()=>f().concat([['lockpick',8]])}
const picksHave=()=>bagCount('lockpick');
function pickSpend(){const i=G.bag.findIndex(b=>b&&b.id==='lockpick');if(i>=0)bagTake(i)}
let doorIsLocked=(lv,x,y)=>hash2(x*3+lv,y*5,41)<.34;

/* ==========================================================================
   BATHHOUSES. Every town has one. In Khemetra the baths already stood; Yarrim (a cottage by the square) and Oldhaven (one of the
   lots) now have one built in, and in Thornwick, Ironhill and Anaea one house door near the middle of the town opens on a bathhouse
   with a sign beside it. The door is never locked. Inside: warm water, and every bath cure in the game.
   ========================================================================== */
const BATH_TOWN={3:{name:'The Thornwick Bathhouse',keeper:'th_bath',who:'Ada, bath keeper'},13:{name:'The Ironhill Steam Baths',keeper:'ih_bath',who:'Gunnar, bath keeper'},33:{name:'The Anaea Springs',keeper:'an_bath',who:'Sylvie, bath keeper'}};
khBath('th_bath','Ada, the bath keeper','kh_npc6_3','Welcome to the Thornwick Bathhouse. Hot water from the abbey spring, soap that smells of lavender, and a rule that boots stay at the door. Cold, tired or mucky, we deal with all three.');
khBath('ih_bath','Gunnar, the bath keeper','kh_npc6_3','Ironhill Steam Baths. Forge workers come in black and leave pink. The stones are hot, the water hotter, and the towels are only a little scratchy.');
khBath('an_bath','Sylvie, the bath keeper','kh_npc6_3','The Springs have run warm since before Anaea had a name. Sit, soak, and let the forest go out of your bones.');
khBath('yr_bath','Merrin, the bath keeper','kh_npc6_3','The Steam House. Kettles on the stove, salt in the water, and a tub for every sailor who smells of the sea. We take all comers.');
khBath('oh_bath','Marta, the bath keeper','kh_npc6_3','The Oldhaven Baths, fit for a king, though the king himself has never once been seen in them. Steam, oils, hot stones. Ten gold and the whole kingdom\'s dust comes off.');
function bathScan(lv){
  const F=G.flags,B=F.bathDoors2||(F.bathDoors2={});if(B[lv])return B[lv];
  if(LEVEL!==lv||!G.grid||!BATH_TOWN[lv])return null;
  const cx=MW/2,cy=MH/2;let best=null,bd=1e9;
  for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){
    const g=G.grid[y][x];if(!((g>=15&&g<=19)||(g>=200&&g<1000&&TILE_MSG[g])))continue;
    for(const [dx,dy,f] of [[0,1,0],[0,-1,2],[1,0,3],[-1,0,1]]){ // the street cell is at (x+dx,y+dy); the party faces back at the door
      const ox=x+dx,oy=y+dy;if(G.grid[oy][ox]!==0||G.decor.some(d=>d.block&&d.x===ox&&d.y===oy))continue;
      if(!(G.grid[y-dy][x-dx]>0))continue; // wall behind the door
      let run=0;while(run<10){const qx=ox+dx*(run+1),qy=oy+dy*(run+1);if(qx<1||qy<1||qx>=MW-1||qy>=MH-1||G.grid[qy][qx]!==0)break;run++} // how far down the street the door can be seen from
      const d=Math.abs(x-cx)+Math.abs(y-cy)-Math.min(run,8)*6;if(d<bd){bd=d;best={x,y,ox,oy,wd:[-dx,-dy],f}}
    }
  }
  if(best)B[lv]=best;return best;
}
function bathEnter(n){
  const T=BATH_TOWN[n];if(!T||LEVEL!==n)return;
  const b=bathScan(n);if(!b)return;
  if(G.decor.some(d=>d.k==='sign_bath'))return;
  // a big board standing in the street in front of the door, flat to anyone walking up to it
  G.decor.push({k:'sign_bath',x:b.ox,y:b.oy,block:false,wd:[Math.abs(b.wd[1]),Math.abs(b.wd[0])],sc:2,txt:[T.name.toUpperCase(),'Hot baths, 10 gold']});
  // and one hung out over the street from the wall beside the door, for anyone walking along it
  const p0=Math.abs(b.wd[1]),p1=Math.abs(b.wd[0]);
  for(const [qx,qy] of [[b.ox+p0,b.oy+p1],[b.ox-p0,b.oy-p1]])if(G.grid[qy][qx]===0&&!G.decor.some(d=>d.block&&d.x===qx&&d.y===qy)&&G.grid[qy+b.wd[1]][qx+b.wd[0]]>0){G.decor.push({k:'sign_bath',x:qx,y:qy,block:false,wd:b.wd,sc:1.4,txt:[T.name.toUpperCase(),T.who]});break}
}
function bathBuild(n,lv,fx,fy,ff){ // a locked-house number that is really the bathhouse door
  const T=BATH_TOWN[lv],b=G.flags.bathDoors2&&G.flags.bathDoors2[lv];if(!T||!b||lockedKey(lv,b.x,b.y)!==n)return false;
  LEVELS[n]=khRoom({id:'bh'+n,name:T.name,room:'bath',keeper:T.keeper,scene:'bath_grand'},n,{to:lv,x:fx,y:fy,f:ff}).level;LEVEL_NAMES[n]=T.name;return true;
}
const _doorIsLocked=doorIsLocked;
doorIsLocked=(lv,x,y)=>{const b=G.flags.bathDoors2&&G.flags.bathDoors2[lv];if(b&&b.x===x&&b.y===y)return false;return _doorIsLocked(lv,x,y)};
