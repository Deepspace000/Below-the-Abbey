import sys, json, os, time
sys.path.insert(0, os.path.dirname(__file__))
os.environ['A_PORT']='8345'
from a_boot import boot
from playwright.sync_api import sync_playwright
OUT=os.path.join(os.environ.get('TEMP','.'),'signs_shots'); os.makedirs(OUT,exist_ok=True)
LV=int(sys.argv[1]) if len(sys.argv)>1 else 475
N=int(sys.argv[2]) if len(sys.argv)>2 else 18
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}try{G.mute=true}catch(e){}}")
    if LV!=475:
        print('go',pg.evaluate("(n)=>{try{if(n===477){hgdwBuild();}else{hgduBuild()}hgsAll();const L=LEVELS[n];const d=L.decor.find(q=>q.hgs&&q.wd);goToLevel(n,{x:d.x,y:d.y,f:0});G.cut=null;return 'ok'}catch(e){return String(e)}}",LV))
        pg.wait_for_timeout(4000)
    cands=pg.evaluate("""(lv)=>{const L=LEVELS[lv],by={};for(const d of L.decor)if(d.hgs&&d.wd){(by[d.hgs]=by[d.hgs]||[]).push([d.x,d.y,d.wd[0],d.wd[1],d.hgs,d.npc])}
      const out=[];let more=true,i=0;while(more){more=false;for(const k of Object.keys(by)){const l=by[k];if(l.length>i){out.push(l[Math.floor(l.length*(i+.5)/Math.max(1,3))%l.length]);more=true}}i++;if(i>4)break}return out}""",LV)
    print(len(cands))
    for i,c in enumerate(cands[:N]):
        x,y,wx,wy,kind,npc=c
        r=pg.evaluate("""([x,y,wx,wy,lv])=>{const L=LEVELS[lv===475?475:lv];
          if(LEVEL!==lv)return 'wronglevel';
          const DV=[[0,-1],[1,0],[0,1],[-1,0]];const f=DV.findIndex(v=>v[0]===wx&&v[1]===wy);
          const ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';let px=x,py=y;
          if(ok(x-wx,y-wy)){px=x-wx;py=y-wy;if(ok(x-2*wx,y-2*wy)){px=x-2*wx;py=y-2*wy}}
          G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=px;G.P.y=py;G.P.f=f;G.P.angT=ang;G.C.x=px;G.C.y=py;G.C.a=ang;return 'ok'}""",[x,y,wx,wy,LV])
        if r!='ok': print(r); break
        pg.wait_for_timeout(1300)
        pg.evaluate("()=>{G.talk=null;G.msgs=[]}")
        pg.wait_for_timeout(200)
        path=os.path.join(OUT,'%s_%02d_%s_%d_%d.png'%(LV,i,kind,x,y)); pg.screenshot(path=path); print(path)
    print([e for e in errs if 'Failed to load' not in e][:5]); b.close()
