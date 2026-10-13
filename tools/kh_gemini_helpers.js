/* Helpers that were pasted into the console of a gemini.google.com tab (Claude in Chrome javascript_tool) to make the Khemetra art.
   1. Attach style reference images to the chat (file_upload on the hidden file input after clicking the + button).
   2. Paste this file's functions. Start a receiver on the PC:  python recv3.py <outdir>   (serves /rx and accepts POST /save/<name>, port 8314)
   3. Click the injected green SEND IMAGES button once with a real mouse click (it opens the receiver window, which a script may not do).
   4. runJobs(from,to) makes the sheets one after another; __push('h') then sends every new picture to the receiver as <prefix>_<k>.jpg.
   5. python tools/ingest_kh.py <outdir>/h_<k>.jpg <name> <fac|sprite|tex> ...
   Gemini stops after about thirty pictures per window ("Your limit resets at ..."). */
window.gem=async(prompt)=>{const q=s=>document.querySelector(s);const ed=q('div.ql-editor[contenteditable="true"]')||q('[contenteditable="true"]');if(!ed)return 'no editor';
  const n0=[...document.querySelectorAll('img.image')].filter(i=>i.naturalWidth>=900).length;
  ed.focus();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,prompt);
  let sb=null;for(let i=0;i<24&&!sb;i++){await new Promise(r=>setTimeout(r,500));sb=[...document.querySelectorAll('button')].find(b=>/send message/i.test(b.getAttribute('aria-label')||''))}
  if(!sb)return 'no send';sb.click();
  for(let i=0;i<130;i++){await new Promise(r=>setTimeout(r,1500));const L=[...document.querySelectorAll('img.image')].filter(i=>i.naturalWidth>=900);if(L.length>n0)return 'generated '+L.length}
  return 'timeout'};
window.runJobs=async(from,to)=>{for(let i=from;i<Math.min(to,JOBS.length);i++){if(QSTOP)break;const t0=Date.now();let r;try{r=await gem(JOBS[i][1])}catch(e){r='err '+e}QLOG.push({i,name:JOBS[i][0],r,t:Math.round((Date.now()-t0)/1000)});await new Promise(r=>setTimeout(r,2500))}QLOG.push('done')};
window.__sentSrc=new Set();
window.__push=async(prefix)=>{const imgs=[...document.querySelectorAll('img.image')].filter(i=>i.naturalWidth>=900);const out=[];
  for(let k=0;k<imgs.length;k++){const im=imgs[k];if(__sentSrc.has(im.src))continue;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);
    const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.95));const buf=await b.arrayBuffer();__w.postMessage({name:(prefix||'h')+'_'+k+'.jpg',buf},'*',[buf]);__sentSrc.add(im.src);out.push(k+':'+b.size);await new Promise(r=>setTimeout(r,500))}
  return out.join(' ')};
