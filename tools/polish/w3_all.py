"""Round 3 water zone: one session. audit + shots + luminance + save tests.  python tools/polish/w3_all.py [tag]"""

import sys,time,pathlib,json,io

from PIL import Image,ImageStat

from playwright.sync_api import sync_playwright

TAG=sys.argv[1] if len(sys.argv)>1 else 'a'

OUT=pathlib.Path('tools/polish/w3_shots'); OUT.mkdir(parents=True,exist_ok=True)

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

    pg.goto('http://localhost:8334/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)

    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=420000,polling=1000); pg.wait_for_timeout(8000)

    res={'shots':{}}

    def shot(name,x,y,f,cat):

        r=pg.evaluate(SNAP,[x,y,f]); pg.wait_for_timeout(900); pg.evaluate("()=>{G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max})}")

        png=pg.screenshot(path=str(OUT/('%s_%s.png'%(TAG,name))));l=lum(png); res['shots'][name]={'pos':r,'f':f,'cat':cat,'lum':round(l,1)}; print(name,r,f,cat,round(l,1),flush=True)

    def look(name,tx,ty,cat):

        x,y,f=pg.evaluate(LOOK,[tx,ty]); shot(name,x,y,f,cat)

    pg.evaluate(GO,477); pg.wait_for_timeout(3000)

    res['audit']=pg.evaluate(AUD); print(json.dumps(res['audit'])[:3000],flush=True)

    res['save']=pg.evaluate(SAVE); print('save',res['save'],flush=True)

    A=res['audit']

    for v in A['vig']: look('v_'+v['n'].replace(' ','_').replace("'",''),v['x'],v['y'],'vig')

    rooms=pg.evaluate("()=>LEVELS[477]._hgdw.roomList.map(r=>[r.cx,r.cy,r.x,r.y,r.w,r.h])")

    for i,r in enumerate(rooms[:6]): shot('hub%d'%i,r[0],r[1],i%4,'hub')

    cor=pg.evaluate("""()=>{const L=LEVELS[477],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const o=[];for(let y=1;y<42;y++)for(let x=1;x<42;x++){if(!op(x,y))continue;for(let f=0;f<4;f++){const d=DIRS[f];let n=0;while(op(x+d[0]*(n+1),y+d[1]*(n+1)))n++;const bk=op(x-d[0],y-d[1]);if(n>=5&&bk&&!op(x+d[1],y+d[0])&&!op(x-d[1],y-d[0]))o.push([x,y,f,n,hash2(x,y,77)])}}o.sort((a,b)=>a[4]-b[4]);const out=[];for(const c of o){if(out.every(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])>7))out.push(c)}return out.slice(0,10)}""")

    for i,c in enumerate(cor): shot('cor%d'%i,c[0],c[1],c[2],'corridor')

    for nm,x,y,f in [('c7',41,36,0),('c11',27,9,1),('c9',7,33,0),('arch',1,6,0)]: shot(nm,x,y,f,'corridor')

    pg.evaluate(GO,475); pg.wait_for_timeout(3000)

    for nm,x,y,f in [('l0d',39,137,0),('l0f',19,137,0),('l1d',147,97,0),('l1f',147,71,2),('l2d',97,65,1),('l2f',123,43,2)]: shot(nm,x,y,f,'lake')

    for nm,x,y,f in [('l0w',39,135,0),('l1w',147,95,0),('l2w',99,65,1)]: shot(nm,x,y,f,'lake')

    res['errs']=errs[:10]; print('errs',errs[:10])

    json.dump(res,open('tools/polish/w3_result_%s.json'%TAG,'w'),indent=1)

    b.close()

