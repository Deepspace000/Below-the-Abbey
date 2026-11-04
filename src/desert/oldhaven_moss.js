/* The three dungeons under Oldhaven get the crypts' painted finish (epDungeon on crypt stone) with a colour of their own, by pulling every wall, floor and ceiling colour:
   the Sewers (6710) wet and green, with moss low along the foot of the wall and damp streaks above it; the Crypt (6711) reddish; Crowe's Hideaway (6712) much darker, lit by painted
   wall torches. Layout, enemies and items are not touched. */
{const dress=(id,name,mul,satK,o)=>{
    const tintK=x=>{if(!x)return x;const r=Object.assign({},x);if(r.k)r.k=r.k.map((v,i)=>v*mul[i]);if(r.sat)r.sat=Math.min(1,r.sat*satK);return r};
    const S=epDungeon('crypt',id),W=S.walls;W.name=name;W.so=tintK(W.so);W.bo=tintK(W.bo);
    for(const g in W.vars)W.vars[g]=W.vars[g].map(v=>Object.assign({},v,{o:tintK(v.o||(g==='1'?W.so:W.bo))}));
    if(S.floor)S.floor=Object.assign({},S.floor,{name:name+'floor',tex:o.floorTex||S.floor.tex,o:tintK(S.floor.o)});
    if(S.fvar)S.fvar=S.fvar.map((v,i)=>Object.assign({},v,{name:name+'f'+i,tex:o.floorTex||v.tex,o:tintK(v.o)}));
    S.ceil=Object.assign({},S.ceil,{name:name+'ceil',o:tintK(S.ceil.o)});
    S.decals=Object.assign({},S.decals,{keys:o.decals,p:o.decalP||.85,gain:o.gain});
    if(o.pics)S.pics=o.pics;if(o.auto)S.auto=o.auto;
    S.grade=o.grade;S.grime=Object.assign({},S.grime,{tint:o.grimeTint});if(o.glowCol)S.glowCol=o.glowCol;if(o.amb!==undefined)S.amb=o.amb;if(o.lightK)S.lightK=o.lightK;if(o.shadow)S.shadow=o.shadow;
    EP_SPEC[id]=S};
  dress(6710,'sewer',[.95,1.3,.85],1.15,{floorTex:'wetcobble',decals:['damp','droppings','rubble','damp','pebbles','shards','damp','crack'],decalP:.9,gain:[.9,1.06,.86],
    pics:{p:.8,keys:[{k:'moss',h:.3,bob:.035},{k:'moss',h:.3,bob:.035},{k:'moss',h:.4,bob:.035},{k:'damp',h:.75,bob:.48},{k:'moss',h:.3,bob:.035},{k:'web_corner',h:.42,bob:.76,corner:1},{k:'damp',h:.75,bob:.48},{k:'chains',h:.55,bob:.55}]},
    auto:{keys:['rubble','ratnest','bonepile','bucket','planks','rubble','jar'],p:.6},grade:{c:1.1,s:.95,b:1.14,tone:[60,130,55,.22],vig:.34,vc:[4,9,4]},amb:.24,lightK:1.7,grimeTint:[.86,1.06,.84],glowCol:[.95,.7,.4]});
  dress(6711,'oldcrypt',[1.45,.8,.74],1.15,{decals:['soot','droppings','rubble','bones','damp','shards','rag','pebbles','wax','crack'],gain:[1.1,.92,.88],
    grade:{c:1.1,s:.92,b:1.1,tone:[160,45,40,.22],vig:.36,vc:[10,3,3]},grimeTint:[1.08,.9,.88],glowCol:[1,.5,.34],amb:.2,lightK:1.5});
  dress(6712,'hideaway',[.62,.58,.54],.9,{decals:['soot','droppings','rubble','straw','pebbles','shards','rag','crack'],gain:[.95,.9,.84],amb:.05,lightK:1.5,shadow:.78,
    grade:{c:1.14,s:.82,b:.84,tone:[90,60,35,.12],vig:.62,vc:[3,2,1]},grimeTint:[.94,.9,.84],glowCol:[1,.62,.3]});
  EP_TORCH[6712]=2}
