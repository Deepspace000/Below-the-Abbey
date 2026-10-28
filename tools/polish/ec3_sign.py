"""Round 3 water zone: one session. audit + shots + luminance + save tests.  python tools/polish/w3_all.py [tag]"""

import sys,time,pathlib,json,io

from PIL import Image,ImageStat

from playwright.sync_api import sync_playwright

TAG=sys.argv[1] if len(sys.argv)>1 else 'a'

OUT=pathlib.Path('tools/polish/shots_ecritic3'); OUT.mkdir(parents=True,exist_ok=True)

SNAP="""([x,y,f])=>{const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));const op=(a,b)=>G.grid[b]&&G.grid[b][a]===0&&!blk.has(a+','+b);let best=null,bd=1e9;for(let yy=1;yy<G.grid.length-1;yy++)for(let xx=1;xx<G.grid[0].length-1;xx++){if(!op(xx,yy))continue;const d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bd){bd=d;best=[xx,yy]}}

 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners&&(G.lvlBanners.length=0);G.msgs=[];G.talk=null;if(G.uw&&G.uw.air!==undefined)G.uw.air=240;return best}"""

LOOK="""([tx,ty])=>{const op=(x,y)=>G.grid[y]&&G.grid[y][x]===0;for(let dist=3;dist>=1;dist--)for(let f=0;f<4;f++){const d=DIRS[f];let ok=true;for(let k=1;k<=dist;k++)if(!op(tx-d[0]*k,ty-d[1]*k))ok=false;if(ok)return [tx-d[0]*dist,ty-d[1]*dist,f]}

 return [tx,ty,0]}"""

GO="""(l)=>{G.heroes.forEach(h=>{h.hp=h.max=9999});(KH_LAZY[l]&&KH_LAZY[l]());const s=LEVELS[l].start;goToLevel(l,{x:s.x,y:s.y,f:0});return LEVEL}"""



AUD="""()=>{const L=LEVELS[477],E=L._hgdwe,op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';

 const prot=E.vignettes.map(v=>[v.x,v.y]);

 const moss=L.decor.filter(d=>/hgwm_moss/.test(d.k));const mossNear=moss.filter(d=>prot.some(q=>Math.hypot(q[0]-d.x,q[1]-d.y)<=2.3)).length;

 const wc=L.decor.find(d=>d.k==='uw_shellchest'&&d.hgdwTier===3);

 const pir=L.enemies.filter(e=>e.t==='hgfpiranha').map(e=>[e.x,e.y,wc?+Math.hypot(e.x-wc.x,e.y-wc.y).toFixed(1):null]);

 const vig=E.vignettes.map(v=>({n:v.name,x:v.x,y:v.y,props:L.decor.filter(d=>!d.pic&&Math.abs(d.x-v.x)<=3&&Math.abs(d.y-v.y)<=3&&!/hgwm_|seagrass|hgdf_vine|uw_vent/.test(d.k)).length}));

 const notes=L.decor.filter(d=>d.hgdwText!==undefined||d.npc==='hgdw_note');

 const noLabel=notes.filter(d=>!d.label).length,empty=notes.filter(d=>!d.hgdwText||!String(d.hgdwText).trim()).length;

 const dash=notes.filter(d=>/[–—]/.test(d.hgdwText||'')).length;

 const anch=[];for(const d of L.decor){if((d.hgdwText&&(d.pic||d.npc))||(!d.pic&&!/hgwm_|seagrass|hgdf_|uw_vent|uw_sw/.test(d.k)&&hgweHt(d)>=.7))anch.push([d.x,d.y])}for(const v of prot)anch.push(v);

 const dist=new Map(),q=[];for(const a of anch){const k=a.join(',');if(!dist.has(k)){dist.set(k,0);q.push(a)}}for(let i=0;i<q.length;i++){const [x,y]=q[i],dd=dist.get(x+','+y);for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const k=(x+a)+','+(y+b);if(op(x+a,y+b)&&!dist.has(k)){dist.set(k,dd+1);q.push([x+a,y+b])}}}

 let mx=0,mxc=null;for(const [k,v] of dist)if(v>mx){mx=v;mxc=k}

 const fishNear=L._hgdweFish&&L._hgdweFish.prot?1:0;

 return {w3:L._hgw3,mossNear,mossMax:Math.max(0,...moss.map(d=>hgweHt(d))),pir,vig,noLabel,empty,dash,notes:notes.length,maxAnchorDist:mx,at:mxc,fishProt:fishNear,lights:HGDWE.lights.length,decor:L.decor.length}}"""

SAVE="""()=>{const L=LEVELS[477];const ch=G.decor.filter(d=>d.k==='uw_shellchest'&&d.hgdwTier);const moved=ch.filter(d=>d.hgdwOrig);

 const r={chests:ch.length,moved:moved.length};

 // old save: only the flag list, keyed by the OLD position of a moved chest

 const m=moved[0];if(m){G.flags.hgdwOpened={};G.flags.hgdwOpened[m.hgdwOrig[0]+','+m.hgdwOrig[1]]=1;m.contents=null;m.goldTaken=false;openLoot(m);r.oldSaveOpensEmpty=(m.contents&&m.contents.length===0)&&m.goldTaken===true;G.loot=null}

 // new save: position record round trip

 const o=ch.find(d=>!d.hgdwOrig)||ch[0];o.contents=[{id:'pearl',n:1}];o.goldTaken=true;const sd=sparseDecor();r.keys=Object.keys(sd).filter(k=>k.indexOf('hgw3:')===0).length;

 o.contents=null;o.goldTaken=false;applySparseDecor(sd);r.newSaveRestored=!!(o.contents&&o.contents.length===1)&&o.goldTaken===true;

 // old index-keyed save must not mark random decor

 const bad={};bad[5]={contents:null,gold:0,goldTaken:false,found:true,opened:false,ambushed:false};const before=L.decor.filter(d=>d.found).length;applySparseDecor(bad);r.indexIgnored=L.decor.filter(d=>d.found).length===before;

 o.contents=null;o.goldTaken=false;G.flags.hgdwOpened={};return r}"""

def lum(png,crop=(5,5,955,485)):

    return ImageStat.Stat(Image.open(io.BytesIO(png)).convert('L').crop(crop)).mean[0]

with sync_playwright() as p:

    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])

    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]

    pg.on('pageerror',lambda e:errs.append(str(e)))

    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)

    pg.goto('http://localhost:8364/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)

    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=420000,polling=1000); pg.wait_for_timeout(8000)

    res={'shots':{}}

    def shot(name,x,y,f,cat):

        r=pg.evaluate(SNAP,[x,y,f]); pg.wait_for_timeout(900); pg.evaluate("()=>{G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max})}")

        png=pg.screenshot(path=str(OUT/('%s_%s.png'%(TAG,name))));l=lum(png); res['shots'][name]={'pos':r,'f':f,'cat':cat,'lum':round(l,1)}; print(name,r,f,cat,round(l,1),flush=True)

    def look(name,tx,ty,cat):

        x,y,f=pg.evaluate(LOOK,[tx,ty]); shot(name,x,y,f,cat)


    pg.evaluate(GO,477); pg.wait_for_timeout(3000)
    QT="""()=>{const ch=G.decor.filter(d=>d.k==='uw_shellchest'&&d.hgdwTier);G.flags.hgdwOpened={};const r={chests:ch.length,moved:ch.filter(d=>d.hgdwOrig).length,steps:[]};let n=0;for(const d of ch){d.contents=null;d.goldTaken=false;try{openLoot(d)}catch(e){r.err=String(e)}G.loot=null;n++;r.steps.push([n,!!d.hgdwOrig,Object.keys(G.flags.hgdwOpened).length]);if(n>=6)break}
      const q=HGDQ_DEF.wq4;r.goal=q.goal();r.keys=Object.keys(G.flags.hgdwOpened);G.flags.hgdwOpened={};return r}"""
    try: res['quest']=pg.evaluate(QT)
    except Exception as e: res['quest']=str(e)[:300]
    print('quest',json.dumps(res['quest']),flush=True)
    NEAR="""()=>{const o=[];for(const [n,x,y] of [['board',31,22],['bell',17,20],['diver',21,36],['hub2',17,18]]){o.push([n,(G.enemies||[]).filter(e=>Math.hypot(e.x-x,e.y-y)<=4).map(e=>[e.t||e.type||e.name,+e.x.toFixed(1),+e.y.toFixed(1),e.dead||0,e.home?e.home.join?e.home.join(','):'':''])])}return o}"""
    print('near',json.dumps(pg.evaluate(NEAR)),flush=True)
    # sign closeups: first 12 signs, shot at 3 squares and 1 square
    sg=pg.evaluate("()=>hgtList().filter(o=>o.lvl===477).map(o=>[o.x,o.y,o.kind])")
    for i,(x,y,k) in enumerate(sg[:30]):
        if i%3: continue
        for dist in (3,1):
            r=pg.evaluate("""([tx,ty,dist])=>{const op=(x,y)=>G.grid[y]&&G.grid[y][x]===0;for(let f=0;f<4;f++){const d=DIRS[f];let ok=true;for(let k=1;k<=dist;k++)if(!op(tx-d[0]*k,ty-d[1]*k))ok=false;if(ok)return [tx-d[0]*dist,ty-d[1]*dist,f]}return null}""",[x,y,dist])
            if r: shot('sign_%s_%d_%d_d%d'%(k,x,y,dist),r[0],r[1],r[2],'sign')
    res['errs']=errs[:10]; print('errs',errs[:10])
    json.dump(res,open('tools/polish/ec3_sign.json','w'),indent=1)
    b.close()
