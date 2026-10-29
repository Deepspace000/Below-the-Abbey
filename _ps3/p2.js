/* ---------- the creatures of the halls (ratings follow the place: 101; the bosses are tuned by eye, see the notes) ---------- */
{const pic=id=>'ps_c_'+id;
Object.assign(ENEMY_DEF,{
  psarmour:{name:'Hollow Suit of Armour',hp:96,dmg:[8,13],hit:.86,w:.62,ph:1.9,img:pic('psarmour'),xp:30,gold:[0,0],speed:1,verb:'cleaves',still:1,ps:1,wake:'The empty armour turns its helm toward you with a grinding sound, and lifts its sword.'},
  psservant:{name:'Pale Servant',hp:56,dmg:[6,10],hit:.85,w:.6,ph:1.7,img:pic('psservant'),xp:26,gold:[0,0],speed:1,ranged:2,verb:'hurls a plate at',ps:1,glow:.2},
  pscourtier:{name:'Pale Courtier',hp:62,dmg:[8,13],hit:.87,w:.6,ph:1.8,img:pic('pscourtier'),xp:28,gold:[0,0],speed:1,ranged:2,verb:'curses',ps:1,glow:.25},
  psdancer:{name:'Whirling Dancer',hp:52,dmg:[7,11],hit:.88,w:.9,ph:1.8,img:pic('psdancer'),xp:27,gold:[0,0],speed:2,verb:'spins into',ps:1,glow:.2},
  psfiend:{name:'Portrait Fiend',hp:72,dmg:[8,13],hit:.88,w:.7,ph:1.8,img:pic('psfiend'),xp:30,gold:[0,0],speed:2,verb:'rakes',ps:1,still:1,glow:.15,wake:'A painted face tears itself out of its frame and drops to the floor.'},
  pscarver:{name:'Spectral Carver',hp:80,dmg:[9,14],hit:.88,w:.8,ph:1.9,img:pic('pscarver'),xp:32,gold:[0,0],speed:1,verb:'carves',ps:1,glow:.15},
  pshhound:{name:'Pale Hunting Hound',hp:54,dmg:[7,11],hit:.87,w:.7,ph:.95,img:pic('pshhound'),xp:27,gold:[0,0],speed:2,verb:'savages',ps:1},
  psstairwarden:{name:'The Stair Warden',hp:500,dmg:[11,17],hit:.9,w:1.4,ph:3.0,img:pic('psstairwarden'),xp:900,gold:[0,0],speed:1,verb:'swings his halberd at',boss:true,aboveParty:0,ps:1,still:1,glow:.3,noFlee:1,wake:'The giant armour on the landing straightens, and a halberd as long as a tree comes down off its shoulder.'},
  psantlered:{name:'The Antlered Lord',hp:450,dmg:[10,16],hit:.9,w:1.6,ph:2.5,img:pic('psantlered'),xp:800,gold:[0,0],speed:1,verb:'gores',boss:true,aboveParty:0,ps:1,still:1,glow:.35,noFlee:1,wake:'The antlered ghost lifts its head from the table, and a horn sounds somewhere under the floor.'}});
for(const t of ['psstairwarden','psantlered']){if(typeof NO_VARY!=='undefined')NO_VARY.push(t);if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push(t)}
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psstairwarden=[5200,6200];BOSS_GOLD.psantlered=[4600,5600]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^ps(armour|stairwarden)/,'shaken',.15],[/^ps(courtier|fiend|dancer)/,'cursed',.15],[/^pscarver/,'bleeding',.2],[/^ps(antlered|hhound)/,'bleeding',.18])}
/* ---------- items of this floor ---------- */
ITEMDEF.pspigment={n:'Pigment Pot',k:'quest',t:'Quest item',ic:'potion',c:'#a890d0',stack:9,price:0,sw:.2,d:"A small clay pot of dry pigment from the painters' closet of the Gallery of Portraits."};
ITEMDEF.pssignet={n:"Isaude's Signet Ring",k:'quest',t:'Quest item',ic:'ring',c:'#d8c070',stack:1,price:0,sw:.1,d:"A gold signet ring cut with a heron. Lady Isaude Marwen hid it behind her own portrait."};
ITEMDEF.pskeyclo={n:"Painters' Closet Key",k:'quest',t:'Key',ic:'key',c:'#c8a860',stack:1,price:0,sw:.1,d:"A small brass key on a loop of string, marked PAINTERS. It opens the closet at the west end of the Gallery of Portraits."};
for(const [i,w] of [[1,'the Music Salon'],[2,'the Gallery of Portraits'],[3,'the Banqueting Hall']])ITEMDEF['pssheet'+i]={n:'Music Sheet '+i,k:'quest',t:'Lore',ic:'book',c:'#e8e0c8',stack:1,price:0,sw:.05,d:'A sheet of music written for the harpsichord, found in '+w+'. The Lutenist in the Music Salon asked for all three.'};
ITEMDEF.pswardhalberd={n:"The Stair Warden's Halberd",k:'weapon',t:'Sword',ic:'sword',c:'#cfd4ee',dmg:[560,660],hit:.2,req:{str:76},lvl:102,price:0,rar:1,eff:{bossdmg:.35,bleed:[.3,6,45]},dbl:.2,sw:.7,d:"A halberd of pale steel as long as a tree, taken from the giant armour on the landing of the Grand Stair. Wounds bleed, and bosses take 35% more. Needs level 102."};
ITEMDEF.psantlerring={n:"The Antlered Lord's Signet",k:'ring',t:'Ring',ic:'ring',c:'#c8d0e0',price:0,lvl:102,pas:{ward:19,dodge:.07,regen:.8,mpRegen:.5},str:7,hp:90,rar:1,sw:.1,d:"A heavy silver ring cut with a stag's head, worn by the hunter who led the Sovereign's hunts. Adds 7 Strength and 90 health, every blow on the wearer is 19 lighter, enemies miss 7% more, and wounds close steadily. Needs level 102."};
ITEMDEF.pslutering={n:"The Lutenist's Ring",k:'ring',t:'Ring',ic:'ring',c:'#d8d0f0',price:0,lvl:101,pas:{ward:18,dodge:.07,regen:.7,mpRegen:.7},int:7,hp:80,rar:1,sw:.1,d:"A thin silver ring set with a violet bead that hums when it is turned. Adds 7 Intelligence and 80 health, every blow on the wearer is 18 lighter, enemies miss 7% more, and tiredness fades steadily. Needs level 101."};
/* ---------- floors, ceiling and wall tiles (code: the graveyard's painted stone, toned cold) ---------- */
function pshFloors(){
  if(PSH._fl)return PSH._fl;
  const N=128,mk=fn=>{const d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,c=fn(x,y);d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}return d};
  const hh=(a,b,c)=>hash2(a,b,c),vn=(x,y,cs,sd)=>{const P=N/cs,u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),g=(a,b)=>hh(((a%P)+P)%P,((b%P)+P)%P,sd);return(g(i,j)*(1-sx)+g(i+1,j)*sx)*(1-sy)+(g(i,j+1)*(1-sx)+g(i+1,j+1)*sx)*sy};
  // marble: white and slate-violet chequer, two by two to the square, soft veins, dark joints
  const marble=(x,y,dark)=>{const v=vn(x,y,32,801)*.5+vn(x,y,16,802)*.3+vn(x,y,8,803)*.2,vein=Math.abs(Math.sin((x*.07+y*.045+vn(x,y,32,804)*5)))<.06?1:0;let b=dark?64+v*38:206+v*38;if(vein)b+=dark?26:-26;return dark?[b*.92,b*.9,b*1.2]:[b*.97,b*.98,b*1.08]};
  FLOORS.psf_chq=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [38,36,52];const dark=((x>>6)+(y>>6))&1;return marble(x,y,dark)});
  FLOORS.psf_chq2=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [30,28,44];const dark=((x>>6)+(y>>6))&1;const m=marble(x,y,!dark);return [m[0]*.8,m[1]*.8,m[2]*.95]});
  FLOORS.psf_flag=mk((x,y)=>{const bx=((x+(((y>>5)&1)*32))>>6),by=y>>5,e=Math.min((x+(((y>>5)&1)*32))%64,y%32,63-(x+(((y>>5)&1)*32))%64,31-y%32);if(e<1.3)return [56,56,70];const v=.55+hh(bx,by,805)*.25+vn(x,y,16,806)*.3;return [150*v,152*v,172*v]});
  // the violet runner: deep violet cloth, silver-gold border, a small lozenge pattern
  FLOORS.psf_run=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<5)return [60,50,96];if(e<9)return [200,184,130];if(e<12)return [60,44,110];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);let v=lx<9?1.18:1;const n=hh(x>>1,y>>1,807)*.1;return [(86*v)*(1+n),(58*v)*(1+n),(150*v)*(1+n)]});
  FLOORS.psf_wood=mk((x,y)=>{const pl=Math.floor(y/16),e=y%16,v=.62+hh(pl,(x>>5)+pl,808)*.28+vn(x,y,16,809)*.14;if(e<1.2)return [30,20,18];return [112*v,78*v,64*v]});
  FLOORS.psf_carpet=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<4)return [150,40,60];if(e<8)return [210,176,96];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);const v=lx<7?1.15:1,n=hh(x,y,810)*.1;return [(176*v)*(1+n),(112*v)*(1+n),(104*v)*(1+n)]});
  FLOORS.psf_dais=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<2)return [60,58,80];const v=vn(x,y,32,811)*.5+vn(x,y,8,812)*.3;return [186+v*40,184+v*40,208+v*40]});
  FLOORS.psf_black=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.4)return [14,12,22];const v=vn(x,y,32,813)*.5+vn(x,y,8,814)*.4,vein=Math.abs(Math.sin(x*.05-y*.06+vn(x,y,32,815)*4))<.05?40:0;return [34+v*26+vein,32+v*24+vein,52+v*34+vein]});
  if(typeof gyFloorTone==='function'&&FLOORS.gyf_grass)gyFloorTone('psf_grass','gyf_grass',.72,[.78,.95,.88]);
  PSH._fl=['psf_chq','psf_flag','psf_run','psf_wood','psf_carpet','psf_dais',FLOORS.psf_grass?'psf_grass':'psf_black'];
  // a ceiling of dark coffers with pale ribs
  if(!CEILS.psc_hall){const base=IMG.gyp_texGrey_0?dsPaintedTex(IMG.gyp_texGrey_0):null,d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,e=Math.min(x%64,y%64,63-x%64,63-y%64),rib=e<4;
      const b=base?base[o]:90,k=rib?.62:.34;d[o]=Math.min(255,b*k*.98);d[o+1]=Math.min(255,(base?base[o+1]:90)*k);d[o+2]=Math.min(255,(base?base[o+2]:96)*k*1.18);d[o+3]=255}CEILS.psc_hall=d}
  return PSH._fl}
/* the wall styles: stone and colour of each room. A tile is the painted stone plus drawn work: a gothic window, an arched bay with a plinth, ivy, silk panels, dark wood. */
const PSH_STYLES={
  hall:{tex:'texGrey_0',rgb:[1.0,1.0,1.2],gain:1.2,trim:'#d8d4ee',band:'rgba(52,44,86,.55)'},
  gallery:{tex:'texBone_0',rgb:[.95,.93,1.12],gain:1.0,trim:'#d8cfe8',band:'rgba(70,52,96,.5)'},
  statues:{tex:'texBone_1',rgb:[.9,.95,1.15],gain:1.0,trim:'#dce2f4',band:'rgba(48,56,96,.5)'},
  banquet:{tex:'texGrey_3',rgb:[1.25,.95,1.55],gain:1.35,trim:'#e0c878',band:'rgba(40,20,70,.6)',silk:'#4a2a7a'},
  salon:{tex:'texBone_0',rgb:[.8,.92,1.25],gain:1.0,trim:'#e8e4f8',band:'rgba(50,70,120,.4)',silk:'#6a7ab0'},
  trophy:{tex:'texGrey_3',rgb:[1.15,1.0,1.0],gain:1.25,trim:'#c8b08a',band:'rgba(70,40,24,.7)',wood:1},
  screens:{tex:'texGrey_3',rgb:[1.1,1.0,.95],gain:1.2,trim:'#b09070',band:'rgba(60,36,22,.75)',wood:1},
  lady:{tex:'texBone_0',rgb:[1.15,1.0,.88],gain:1.05,trim:'#e8d0a0',band:'rgba(110,70,50,.35)',silk:'#c89a84'},
  stair:{tex:'texGrey_0',rgb:[.8,.82,1.12],gain:1.05,trim:'#c4c0e0',band:'rgba(36,30,70,.65)'},
  closet:{tex:'texGrey_3',rgb:[1.1,1.0,.9],gain:1.15,trim:'#a89070',band:'rgba(50,36,24,.5)'}};
function pshTile(style,kind,v){
  const S=PSH_STYLES[style],WH=PSH.WH,key=style+kind+(v||0);PSH._tl=PSH._tl||{};if(PSH._tl[key]!==undefined)return PSH._tl[key];
  const tex=(v&&S.tex==='texGrey_0')?'texGrey_1':(v&&S.tex==='texBone_0')?'texBone_1':S.tex;
  const draw=(x,w,h)=>{
    const wain=h*.3;
    // wainscot band: darker lower part with a trim line
    x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1;
    if(S.wood){x.fillStyle='rgba(40,22,10,.62)';x.fillRect(0,h-wain,w,wain);for(let i=0;i<4;i++){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(i*32+1,h-wain+4,2,wain-8)}x.strokeStyle='rgba(200,160,100,.5)';x.strokeRect(6,h-wain+8,w-12,wain-16)}
    if(S.silk&&kind!=='win'){x.fillStyle=S.silk;x.globalAlpha=.5;x.fillRect(8,h*.12,w-16,h-wain-h*.12-10);x.globalAlpha=1;x.strokeStyle=S.trim;x.lineWidth=2;x.strokeRect(8,h*.12,w-16,h-wain-h*.12-10);x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=1;i<6;i++){x.beginPath();x.moveTo(8+i*(w-16)/6,h*.12);x.lineTo(8+i*(w-16)/6,h-wain-10);x.stroke()}}
    if(kind==='win'||kind==='bay'||kind==='bay2'){
      const cx=w/2,top=h*(kind==='win'?.16:.22),bot=kind==='win'?h*.62:h-wain*.15,hw=kind==='win'?30:44;
      x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.closePath();
      x.save();x.clip();
      if(kind==='win'){const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#c8b8ff');g.addColorStop(.5,'#8c78d8');g.addColorStop(1,'#3e3688');x.fillStyle=g;x.fillRect(0,0,w,h);
        x.strokeStyle='rgba(20,14,50,.9)';x.lineWidth=3;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*hw/2.5,top-20);x.lineTo(cx+i*hw/2.5,bot);x.stroke()}for(let j=0;j<5;j++){x.beginPath();x.moveTo(0,top+20+j*(bot-top)/5);x.lineTo(w,top+20+j*(bot-top)/5);x.stroke()}
        x.fillStyle='rgba(255,255,255,.55)';for(let j=0;j<6;j++){x.fillRect(cx-hw+8+((j*13)%50),top+10+((j*29)%(bot-top-20)),4,10)}}
      else{const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#1c1830');g.addColorStop(1,'#0a0814');x.fillStyle=g;x.fillRect(0,0,w,h);
        // ivy creeping in from the top and the sides of the bay
        x.fillStyle='#2f5a34';for(let i=0;i<46;i++){const px=cx-hw+((i*37)%(hw*2)),py=top+((i*i*11)%((bot-top)*.55));x.beginPath();x.ellipse(px,py,5+((i*3)%4),3+(i%3),((i*7)%6)/2,0,6.3);x.fill()}x.fillStyle='#4a7e46';for(let i=0;i<24;i++){x.beginPath();x.ellipse(cx-hw+((i*53)%(hw*2)),top+((i*29)%((bot-top)*.5)),3,2,i,0,6.3);x.fill()}}
      x.restore();
      x.strokeStyle=S.trim;x.lineWidth=5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.stroke();
      x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()}
    if(kind==='ivy'){x.fillStyle='#2c5632';for(let i=0;i<150;i++){const px=(i*53)%w,py=h*(Math.pow(((i*37)%100)/100,1.5))*.85,r=3+((i*5)%5);x.globalAlpha=.9;x.beginPath();x.ellipse(px,py,r,r*.6,((i*3)%6)/2,0,6.3);x.fill()}
      x.fillStyle='#4c8248';for(let i=0;i<80;i++){x.beginPath();x.ellipse((i*71)%w,h*(((i*41)%100)/100)*.8,3,2,i,0,6.3);x.fill()}x.globalAlpha=1}
    if(kind==='pilaster'){x.fillStyle='rgba(255,255,255,.1)';x.fillRect(w*.3,0,w*.4,h);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(w*.3,0,3,h);x.fillRect(w*.7-3,0,3,h);x.fillStyle=S.trim;x.globalAlpha=.6;x.fillRect(w*.26,0,w*.48,5);x.fillRect(w*.26,h-wain-7,w*.48,6);x.globalAlpha=1}
  };
  return PSH._tl[key]=gyTile(tex,WH,{gain:S.gain,rgb:S.rgb,tag:'psh_'+key,draw});
}
