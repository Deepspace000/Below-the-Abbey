/* ==========================================================================
   THE DEEPER HOLLOW, WRITING ON THE SIGNS (prefix hgt / HGTX). Runs after hgd_polish_signs.js.
   The twelve sign pictures (assets/hp/signs_*.png, art_hs_*) are blank boards, parchments and stones. This pass paints a short LABEL on each
   one that stands in the world: a title taken from the note (or d.label when a decor sets one), drawn on a cached copy of the picture in
   a text rectangle measured for each picture (HGTX_TBL, as fractions of the picture), fitted to size (one to three lines, word wrap, shrink),
   dark ink on paper and wood, cream on stone, slightly rough (small jitter, no blur). One canvas is kept per picture and label.
   The decor's text, click and quest data are untouched: only d.k changes (d.hgtBase keeps the blank one). Idempotent (d.hgt marks a finished entry).
   Exposes hgtList() for the audit, and hgtLabel(d) for tests.
   ========================================================================== */
// text rectangle per picture: [x0,y0,x1,y1] as fractions of the picture, ink (dark paper ink, brass dark engraved, cream stone), face, rot, maxLines
const HGTX_TBL={
  page:{r:[.16,.2,.84,.8],ink:'dark',fam:'t',n:3},
  scroll:{r:[.2,.34,.84,.76],ink:'dark',fam:'u',n:3},
  plaque:{r:[.17,.2,.83,.46],ink:'brass',fam:'u',n:3},
  tablet:{r:[.2,.2,.8,.62],ink:'cream',fam:'u',n:3},
  slate:{r:[.2,.24,.8,.7],ink:'cream',fam:'u',n:3,rot:-.03},
  marker:{r:[.2,.22,.8,.6],ink:'cream',fam:'u',n:3},
  warning:{r:[.15,.14,.85,.44],ink:'dark',fam:'u',n:2},
  runestone:{r:[.22,.83,.78,.95],ink:'gold',fam:'u',n:2},
  waymarker:{r:[.26,.56,.74,.76],ink:'cream',fam:'u',n:3},
  hanging:{r:[.3,.57,.7,.71],ink:'cream',fam:'t',n:2},
  board:{r:[.12,.185,.88,.3],ink:'cream',fam:'u',n:1},
  post:{r:[.22,.3,.86,.42],ink:'cream',fam:'u',n:1,top:[.14,.12,.74,.24]},
  // level 476 (hgd_polish_d.js): the grey notice board gets a lettered plank across its lower third, the rune stone a reading line on its plinth
  hboard:{r:[.2,.66,.8,.86],ink:'cream',fam:'u',n:2,plank:[.1,.6,.9,.9],base:true},
  hrune:{r:[.16,.845,.84,.965],ink:'gold',fam:'u',n:1,base:true}
};
// a few pictures are a little larger so that their writing can be read from three squares (HGS_SET.h is also what hgd_polish_signs.js uses)
HGS_SET.plaque.h=.6;NPC_H.art_hs_plaque=.6;HGS_SET.scroll.h=.7;NPC_H.art_hs_scroll=.7;
const HGTX={cache:{},n:0,fonts:false};
function hgtFam(f){return f==='t'?(typeof FTITLE!=='undefined'?FTITLE:"'UnifrakturCook',Georgia,serif"):(typeof FUI!=='undefined'?FUI:"'IM Fell English SC',Georgia,serif")}
function hgtClean(s){return String(s).replace(/[—–]/g,', ').replace(/\s+/g,' ').trim()}
// the first words of a note as a title: drop "Chalked:" style lead-ins, take the first sentence, cut a long one at a clause or a word
function hgtTitle(txt){
  let s=hgtClean(txt).replace(/^(A |An )?(child's|neat|note|scrap|torn|Carved|Chalked|Scratched|Scribbled|Written|Etched|Painted|Pinned)[^:]{0,40}:\s*/i,'');
  const m=/^(.+?[.!?])(\s|$)/.exec(s);let t=(m?m[1]:s).replace(/[.!?]+$/,'');
  if(t.length>36){const c=t.search(/[,;]| and | but | then | when | until | because | so | though | while /);if(c>=14&&c<=36)t=t.slice(0,c);else{const w=t.split(' ');let o='';for(const x of w){if((o+' '+x).trim().length>26||o.split(' ').length>=5)break;o=(o+' '+x).trim()}t=(o||t.slice(0,24)).replace(/(\s+(a|an|the|of|to|and|or|in|on|at|is|was|for|my|i|me|us|not|as|than|that|with|from|by|has|had|are|be|it|its|this|your|you|we|our))+$/i,'')}}
  return t||'Note';
}
function hgtCase(t){return t.split('|').map(u=>/^[A-Z0-9 ,'!?.-]{6,}$/.test(u)?u.charAt(0)+u.slice(1).toLowerCase():u).join('|')}
// written titles for the older floors' notes (HL_NOTES in hollow.js, HL_VANCE in hollow_haunt.js), by npc id
const HGTX_LAB={hl_vance0:'Letter: the Narrow Sea silver',hl_vance1:"Letter: the chancellor's seal",hl_vance2:"Letter: the Abbot's seal",
  hl_note0:'Diary, day 40',hl_note1:'Do not drink the golden cup',hl_note2:'The Queen smiles all day',hl_note3:'The portraits',hl_note4:'Twenty floors counted',hl_note5:'Hands in the wall',
  hl_note6:'The covered mirrors',hl_note7:'A voice in the dark',hl_note8:'The lights go out',hl_note9:'The witch was a guest',hl_note10:'Duke Aldric buried alive',hl_note11:'A thin man in black',
  hl_note12:'Open coffins',hl_note13:'The wizard at the top',hl_note14:'Names on the wall',hl_note15:'Spikes, darts, plates',hl_note16:'The wrong colour wall',hl_note17:'Five letters in blood'};
function hgtLabel(d){
  if(!d.label&&/^hgpd_(board|rune)/.test(d.k||'')){ // the game copies only some decor fields into G.decor: read the label from the built level's own entry
    try{const L=LEVELS[LEVEL],m=L&&L.decor&&L.decor.find(e=>e.x===d.x&&e.y===d.y&&e.label&&/^hgpd_(board|rune)/.test(e.hgtBase||e.k||''));if(m)d.label=m.label}catch(e){}
    if(!d.label)return ''}
  if(d.label)return hgtClean(d.label);
  if(d.npc&&HGTX_LAB[d.npc])return HGTX_LAB[d.npc];
  const txt=hgsText(d),kind=d.hgs||'page';
  if(kind==='board'){const n=(typeof LEVEL_NAMES!=='undefined'&&d.lvl&&LEVEL_NAMES[d.lvl])||d.town||'';return 'Notices'+(n?', '+n:'')}
  if(kind==='post'){ // a signpost: first two short sentences go on the two arrows
    const s=hgtClean(txt).replace(/^(A |An )?(child's|neat|note)[^:]{0,40}:\s*/i,'').replace(/^(Chalked|Carved|Scratched|Written)[^:]{0,30}:\s*/i,'');
    const p=s.match(/[^.!?]+[.!?]?/g)||[s];
    if(p.length>=2&&p[0].trim().length<=30&&p[1].trim().length<=30)return hgtCase(p[0].trim().replace(/[.!?]$/,'')+'|'+p[1].trim().replace(/[.!?]$/,''));
  }
  const t=hgtTitle(txt);
  return hgtCase(t); // a shouted note is a title in normal case
}
function hgtHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function hgtWrap(x,words,mw){const L=[];let c='';for(const w of words){const t=c?c+' '+w:w;if(x.measureText(t).width<=mw)c=t;else{if(!c)return null;L.push(c);c=w}if(x.measureText(c).width>mw)return null}if(c)L.push(c);return L}
// the biggest size at which the label fits the rectangle in at most n lines
function hgtFit(x,label,rw,rh,fam,n,cap){
  const words=label.split(' ');let best=null;
  for(let k=1;k<=n;k++){for(let fs=Math.min(rh/k/1.12,cap);fs>=10;fs--){x.font=`bold ${fs}px ${fam}`;const L=hgtWrap(x,words,rw);if(L&&L.length<=k){if(!best||fs>best.fs*1.1)best={fs,L};break}}}
  if(!best){let fs=10;x.font=`bold ${fs}px ${fam}`;let t=label;while(x.measureText(t).width>rw*1.15&&t.length>3)t=t.slice(0,-1);best={fs,L:[t.length<label.length?t.replace(/\s+$/,'')+'.':t]}}
  return best;
}
function hgtInk(x,ch,cx,cy,fs,ink,seed){ // one rough letter: tiny jitter in place and tilt, hard edges
  const j=hgtHash(seed);const dx=((j&3)-1.5)*.18,dy=(((j>>2)&3)-1.5)*.22,rot=(((j>>4)&7)-3.5)*.006;
  x.save();x.translate(cx+dx,cy+dy);x.rotate(rot);
  if(ink==='dark'){x.fillStyle='rgba(255,246,214,.35)';x.fillText(ch,.8,.9);x.lineWidth=Math.max(1,fs*.05);x.lineJoin='round';x.strokeStyle='#1d1006';x.strokeText(ch,0,0);x.fillStyle='#1d1006';x.fillText(ch,0,0)}
  else if(ink==='brass'){x.fillStyle='rgba(255,236,150,.55)';x.fillText(ch,.9,1.1);x.lineWidth=Math.max(1,fs*.05);x.lineJoin='round';x.strokeStyle='#241a05';x.strokeText(ch,0,0);x.fillStyle='#241a05';x.fillText(ch,0,0)}
  else if(ink==='gold'){x.lineWidth=Math.max(2.4,fs*.14);x.lineJoin='round';x.strokeStyle='rgba(8,18,26,.92)';x.strokeText(ch,0,0);x.fillStyle='#f2d78a';x.fillText(ch,0,0)}
  else{x.lineWidth=Math.max(3,fs*.22);x.lineJoin='round';x.strokeStyle='rgba(14,10,6,.95)';x.strokeText(ch,0,0);x.fillStyle='#f6edc8';x.fillText(ch,0,0)}
  x.restore();
}
function hgtBlock(x,lines,R,fs,fam,ink,seed){
  x.font=`bold ${fs}px ${fam}`;x.textAlign='left';x.textBaseline='middle';
  const lh=fs*1.12,tot=lines.length*lh,cx=(R[0]+R[2])/2,cy0=(R[1]+R[3])/2-tot/2+lh/2;
  lines.forEach((ln,i)=>{const w=x.measureText(ln).width;let px=cx-w/2;const py=cy0+i*lh;
    for(let k=0;k<ln.length;k++){const ch=ln[k],cw=x.measureText(ch).width;if(ch!==' ')hgtInk(x,ch,px,py,fs,ink,seed+ln+k);px+=cw}});
}
function hgtPaint(kind,label,bk){
  const T=HGTX_TBL[kind],base=bk?IMG[bk]:IMG['art_hs_'+kind];if(!base||!base.width||!T)return null;
  const id=(bk||kind)+'|'+label;if(HGTX.cache[id])return HGTX.cache[id];
  const w=base.width,h=base.height,fam=hgtFam(T.fam);
  const c=mkCanvas(w,h,x=>{
    x.drawImage(base,0,0);
    if(T.plank){const q=T.plank,X=q[0]*w,Y=q[1]*h,PW=(q[2]-q[0])*w,PH=(q[3]-q[1])*h;const g=x.createLinearGradient(0,Y,0,Y+PH);g.addColorStop(0,'#4a3a2a');g.addColorStop(.5,'#3a2c20');g.addColorStop(1,'#2a2018');
      x.fillStyle=g;x.fillRect(X,Y,PW,PH);x.strokeStyle='#14100a';x.lineWidth=Math.max(2,h*.012);x.strokeRect(X,Y,PW,PH);x.fillStyle='#8a8f96';for(const nx of [X+PW*.04,X+PW*.96])for(const ny of [Y+PH*.2,Y+PH*.8]){x.beginPath();x.arc(nx,ny,Math.max(1.5,h*.012),0,7);x.fill()}}
    const parts=label.split('|');
    const draw=(txt,r)=>{const R=[r[0]*w,r[1]*h,r[2]*w,r[3]*h],rw=R[2]-R[0],rh=R[3]-R[1];
      const f=hgtFit(x,txt,rw,rh,fam,T.n,h*.17);
      x.save();if(T.rot){x.translate((R[0]+R[2])/2,(R[1]+R[3])/2);x.rotate(T.rot);x.translate(-(R[0]+R[2])/2,-(R[1]+R[3])/2)}
      hgtBlock(x,f.L,R,f.fs,fam,T.ink,id);x.restore()};
    if(kind==='post'&&parts.length>1){draw(parts[0],T.top);draw(parts[1],T.r)}
    else draw(parts.join(' '),T.r);
  });
  return HGTX.cache[id]=c;
}
function hgtOne(d){
  if(d.hgt||!d.k)return false;
  const hm=/^hgpd_(board|rune)(_m)?$/.exec(d.k);
  if(!hm&&d.k.indexOf('art_hs_')!==0)return false;
  const kind=hm?'h'+hm[1]:d.k.slice(7);if(!HGTX_TBL[kind])return false;
  const label=hgtLabel(d);if(!label)return false;
  const cv=hgtPaint(kind,label,hm?d.k:null);if(!cv)return false; // picture not loaded yet: try again later
  const key='hgt_'+(hm?d.k:kind)+'_'+hgtHash(label).toString(36);
  IMG[key]=cv;NPC_H[key]=NPC_H[hm?d.k:'art_hs_'+kind];
  d.hgtBase=d.k;d.hgt=label;if(!d.label&&(d.npc==='hgd_pa_note'||d.npc==='hgd_note'))d.label=label;if(d.pic&&d.wd)d.lk=key;else d.k=key; // a wall picture keeps its id (maps and quests read it) and shows the lettered copy through d.lk
  HGTX.n++;return true;
}
function hgtApply(L){if(!L||!L.decor)return 0;let n=0;for(const d of L.decor)if(hgtOne(d))n++;return n}
function hgtList(){const o=[];for(const id in LEVELS){const L=LEVELS[id];if(!L||!L.decor)continue;for(const d of L.decor)if(d.hgt||(d.k&&d.k.indexOf('art_hs_')===0))o.push({lvl:+id,x:d.x,y:d.y,kind:(d.hgtBase||d.k).slice(7),label:d.hgt||'',text:hgsText(d)})}return o}
// the older Hollow floors (440 to 460, the cavern 364) used the same blank note: give them the signs and the writing too
try{if(typeof HL!=='undefined'){for(let k=0;k<=HL.N;k++)HGSG.IDS.push(HL.BASE+k);HGSG.IDS.push(HL.CAV)}}catch(e){}
// notes of the older floors keep their words in lists (HL_NOTES, HL_VANCE) and name them only by the npc id
{const _t=hgsText;hgsText=function(d){const r=_t(d);if(r)return r;try{const m=/^hl_(note|vance)(\d+)$/.exec(d.npc||'');if(m){const A=m[1]==='note'?HL_NOTES:HL_VANCE,v=A&&A[+m[2]];return typeof v==='string'?v:(v&&(v.t||v.text||v[0]))||''}}catch(e){}return r}}
{const _a=hgsApply;hgsApply=function(L){const r=_a.apply(this,arguments);try{if(typeof hgdpcCorr==='function')hgdpcCorr(L)}catch(e){console.error('hgdpcCorr',e)}try{hgtApply(L)}catch(e){console.error('hgt',e)}return r}}
{const _sl=setupLights;setupLights=function(){const r=_sl.apply(this,arguments);try{if(typeof LEVEL!=='undefined'&&LEVELS[LEVEL])hgtApply(LEVELS[LEVEL]);if(G&&G.decor)for(const d of G.decor)hgtOne(d)}catch(e){console.error('hgt',e)}return r}}
