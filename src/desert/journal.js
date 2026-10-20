/* ==========================================================================
   THE JOURNAL. One page in the menu that leads to every record the party keeps: reputation, rumours, afflictions, skills and trades, companions,
   crafting, camp and bonds, luck and omens, weather and the season. Each system registers its own page here with journalPage().
   ========================================================================== */
const JOURNAL=[];
const JORDER=['story','rep','rumour','aff','camp','trade','craft','herbs','pets','wx','luck'];
function journalPage(p){JOURNAL.push(p);JOURNAL.sort((a,b)=>(JORDER.indexOf(a.id)+100)%100-(JORDER.indexOf(b.id)+100)%100)}
const jp=id=>JOURNAL.find(p=>p.id===id);
function drawJournal(){
  BTNS=[];veil(.72);bigPanel(24,8,432,304);
  txt('JOURNAL / ABILITIES',240,25,14,'#d8c88e','center',true);
  const cw=204,ch=46,gx=14,x0=36,y0=38;
  JOURNAL.filter(p=>!p.hide||!p.hide()).forEach((p,k)=>{
    const x=x0+(k%2)*(cw+gx),y=y0+Math.floor(k/2)*(ch+4),note=p.note?p.note():'';
    ctx.save();rrect(ctx,x,y,cw,ch,5);ctx.fillStyle='rgba(44,20,14,.92)';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=note?'#d8b04a':'#7a6440';ctx.stroke();ctx.restore();
    txt(p.title,x+9,y+11,10,note?'#ffe9a0':'#e2d8bc','left',true,undefined,cw-40);
    if(note)txt('!',x+cw-10,y+11,10,'#9ae0a0','center',true);
    wrapText(p.summary(),cw-16,7.4).slice(0,3).forEach((l,i)=>txt(l,x+9,y+23+i*8.6,7.4,'#b8aa88','left'));
    btn('jh_'+p.id,x,y,cw,ch);
  });
  btnText('jhexit','Close',190,290,100,18);
}
function journalBtn(id){
  if(id==='jhexit'){G.menu=false;return}
  const m=/^jh_(.+)$/.exec(id);
  if(m){const p=jp(m[1]);if(p){if(p.direct){p.direct();return}if(p.open)p.open();G.menu='jp:'+p.id}return}
}
function drawJournalPage(pid){
  const p=jp(pid);if(!p){G.menu='journal';return}
  p.draw();
  if(!BTNS.some(b=>b.id==='jpback'))btnText('jpback','Back',190,292,100,16);
}
function journalPageBtn(pid,id){
  if(id==='jpback'){G.menu='journal';return}
  const p=jp(pid);if(p&&p.click)p.click(id);
}
/* shared: a page frame and a bar */
function jFrame(title){BTNS=[];veil(.72);bigPanel(24,8,432,304);txt(title.toUpperCase(),240,25,13,'#d8c88e','center',true)}
function jBar(x,y,w,h,f,col,back){ctx.fillStyle=back||'rgba(0,0,0,.5)';ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.max(0,Math.min(w,w*f)),h);ctx.strokeStyle='rgba(216,200,142,.5)';ctx.lineWidth=.8;ctx.strokeRect(x,y,w,h)}
function journalNote(){return JOURNAL.some(p=>p.note&&p.note())}
