/* Helpers pasted into the console of a gemini.google.com/images tab (Claude in Chrome javascript_tool) to make the Wenlock interior art.
   1. python tools/mg_recv.py <outdir> 8380   2. paste this file  3. click the green SEND IMAGES button once with a real click (opens the receiver window)
   4. JOBS.push([name, prompt]); runJobs(0,JOBS.length); then await __push('prefix') sends every new picture to <outdir>/<prefix>_<k>.jpg
   5. python tools/ingest_wl2.py <outdir>/<file>.jpg <name> <tex|comp>   Sheets: 3 x 2 grid on flat magenta, STRICT FRONT ELEVATION in the prompt. */
window.gem=async(prompt)=>{const q=s=>document.querySelector(s);const ed=q('div.ql-editor[contenteditable="true"]')||q('[contenteditable="true"]');if(!ed)return 'no editor';
  const n0=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>=700).length;
  ed.focus();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,prompt);
  let sb=null;for(let i=0;i<24&&!sb;i++){await new Promise(r=>setTimeout(r,500));sb=[...document.querySelectorAll('button')].find(b=>/send message|submit/i.test(b.getAttribute('aria-label')||''))}
  if(!sb)return 'no send';sb.click();
  for(let i=0;i<130;i++){await new Promise(r=>setTimeout(r,1500));const L=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>=700);if(L.length>n0)return 'generated '+L.length;const t=document.body.innerText;if(/limit resets|reached your limit|can.t create more/i.test(t))return 'LIMIT'}
  return 'timeout'};
window.QLOG=[];window.QSTOP=false;window.JOBS=[];
window.runJobs=async(from,to)=>{for(let i=from;i<Math.min(to,JOBS.length);i++){if(QSTOP)break;const t0=Date.now();let r;try{r=await gem(JOBS[i][1])}catch(e){r='err '+e}QLOG.push({i,name:JOBS[i][0],r,t:Math.round((Date.now()-t0)/1000)});if(/LIMIT/.test(r))break;await new Promise(r=>setTimeout(r,2500))}QLOG.push('done')};
window.__sentSrc=new Set();
window.__push=async(prefix,from)=>{const imgs=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>=700);const out=[];
  for(let k=from||0;k<imgs.length;k++){const im=imgs[k];if(__sentSrc.has(im.src))continue;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);
    const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.95));const buf=await b.arrayBuffer();__w.postMessage({name:(prefix||'h')+'_'+k+'.jpg',buf},'*',[buf]);__sentSrc.add(im.src);out.push(k+':'+b.size);await new Promise(r=>setTimeout(r,500))}
  return out.join(' ')};
{const btn=document.createElement('button');btn.textContent='SEND IMAGES';btn.style.cssText='position:fixed;top:8px;left:50%;z-index:99999;background:#0a0;color:#fff;font:bold 16px sans-serif;padding:10px 20px;border:0;border-radius:8px';
btn.onclick=()=>{window.__w=window.open('http://127.0.0.1:8380/','rx','width=420,height=200')};document.body.appendChild(btn)}
