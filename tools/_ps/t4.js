() => { const out={};
 try{
 ENEMY_DEF.psguard=ENEMY_DEF.psguard||{name:'Pale Guard',hp:56,dmg:[6,10],hit:.85,w:.7,img:'ps_c_psguard',ph:1.8,xp:24,gold:[0,0],speed:1,verb:'cuts'};
 pspRegister(9731,(info)=>{const C=pspMake({id:9731,start:{x:10,y:12,f:0},amb:.25});
   C.room(3,3,16,12,{floor:'flag',name:"The Gardener's Lodge"});C.setFloor(8,3,11,12,'runner');
   C.column(5,5,'fluted');C.column(14,5,'twist');C.picture('pt_king',9,3,[0,-1]);C.sign(6,3,[0,-1],'THE GARDENERS LODGE','Rest here');
   C.links();pspRest(C,{x0:3,y0:3,x1:16,y1:12,bed:[4,4],chest:[15,4]});
   pspFoe(C,'psguard',12,8);
   return C.finish({start:{x:10,y:12,f:0}})});
 goToLevel(9731,{x:10,y:12,f:0});
 out.lvl=LEVEL; out.enemies=LEVELS[9731].enemies.length; out.decor=LEVELS[9731].decor.length;
 }catch(e){out.err=String(e)+' '+(e.stack||'').slice(0,400)}
 return out }
