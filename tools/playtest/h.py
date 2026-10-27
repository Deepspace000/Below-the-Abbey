import time,json,os,sys,threading,collections
from playwright.sync_api import sync_playwright
URL='http://localhost:8398/index.html'
class H:
    def __init__(s,headless=True):
        s.pw=sync_playwright().start()
        s.b=s.pw.chromium.launch(channel=os.environ.get("BTA_CHANNEL") or None,args=["--mute-audio","--disable-gpu","--js-flags=--max-old-space-size=4096"])
        s.pg=s.b.new_page(viewport={'width':800,'height':600});s.pg.set_default_timeout(150000);s.pg.set_default_navigation_timeout(150000)
        s.pg.add_init_script("(()=>{const mk=()=>new Proxy(function(){},{get:(t,k)=>k==='currentTime'?0:k==='sampleRate'?44100:k==='state'?'running':k===Symbol.toPrimitive?()=>0:mk(),apply:()=>mk(),construct:()=>mk(),set:()=>true});window.AudioContext=mk();window.webkitAudioContext=window.AudioContext;window.OfflineAudioContext=window.AudioContext;window.Audio=function(){return mk()}})()")
        s.errs=[];s.trace=collections.deque(maxlen=60);s.busy=0;s.busy_what=''
        s.pg.on('console',lambda m: s.trace.append(m.text[:200]) if m.text.startswith('TR ') else None)
        threading.Thread(target=s._dog,daemon=True).start()
        s.pg.on('console',lambda m: s.errs.append(m.text[:300]) if m.type=='error' else None)
        s.pg.on('pageerror',lambda e: s.errs.append('PAGEERR '+str(e)[:300]))
        s.pg.on('response',lambda r: s.errs.append('HTTP%d %s'%(r.status,r.url[-80:])) if r.status>=400 else None)
    def _pids(s):
        import subprocess
        o=subprocess.run(['tasklist','/FI','IMAGENAME eq chrome.exe','/FO','CSV','/NH'],capture_output=True,text=True).stdout
        d={}
        for l in o.splitlines():
            p=[x.strip('"') for x in l.split('","')]
            if len(p)>4:
                try: d[int(p[1])]=int(p[4].replace(',','').replace(' K','').replace(' K','').strip('" K') or 0)
                except Exception: pass
        return d
    def _dog(s):
        s.pre=s._pids();last=0
        while True:
            time.sleep(5)
            try:
                if os.environ.get('BTA_MEM') and time.time()-last>4:
                    last=time.time();cur=s._pids();new={k:v for k,v in cur.items() if k not in s.pre}
                    open('mem.log','a').write(time.strftime('%H:%M:%S')+' total_new_MB='+str(sum(new.values())//1024)+' top='+str(sorted(new.values())[-3:])+chr(10))
            except Exception as e: pass
            if s.busy and time.time()-s.busy>150:
                open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'hang.log'),'a',encoding='utf8').write('HANG in '+s.busy_what+chr(10)+chr(10).join(s.trace)+chr(10))
                print('WATCHDOG hang',s.busy_what[:80],flush=True)
                os._exit(3)
    def load(s):
        t=time.time();s.pg.goto(URL);s.pg.wait_for_function('window.__ready===true',timeout=180000)
        s.loadtime=time.time()-t;return s.loadtime
    def ev(s,js,arg=None):
        if not js.startswith('PT.deaths') and 'PT.humanSec' not in js and 'G.' not in js[:2]: s.pg.evaluate("PT.dl=performance.now()+%d"%getattr(s,'budget',90000))
        s.busy=time.time();s.busy_what=js[:100]
        try: return s.pg.evaluate(js,arg) if arg is not None else s.pg.evaluate(js)
        finally: s.busy=0
    def lib(s):
        s.pg.evaluate(open(os.path.join(os.path.dirname(__file__),'lib.js'),encoding='utf8').read())
    def close(s):
        s.b.close();s.pw.stop()

STATE=os.environ.get('BTA_STATE') or os.path.join(os.path.dirname(os.path.abspath(__file__)),'state.json')
class Run(H):
    """resumable run: state.json holds localStorage, PT counters, results"""
    def __init__(s):
        super().__init__();s.res={'stages':[],'wall':0.0,'loadtimes':[],'bugs':[],'notes':[]};s.t0=time.time()
    def start(s,resume=True):
        s.load();s.lib()
        if resume and os.path.exists(STATE):
            d=json.load(open(STATE,encoding='utf8'));s.res=d['res']
            s.pg.evaluate("ls=>{for(const k in ls)localStorage.setItem(k,ls[k])}",d['ls'])
            s.pg.evaluate("p=>{Object.assign(PT.stats,p.stats);PT.deaths=p.deaths;PT.wipes=p.wipes;PT.purchases=p.purchases;PT.events=p.events;PT.qlog=p.qlog;PT.talklog=p.talklog;PT.dmg=p.dmg;PT.fallbacks=p.fallbacks||[];PT.xp=p.xp||{}}",d['pt'])
            s.pg.evaluate("handleBtn('tcont')");s.pg.evaluate("PT.pump(20)")
            s.res['notes'].append('resumed at %s'%time.strftime('%H:%M:%S'))
            return True
        s.ev("act()");s.ev("crBtn('cr_pick_def')");s.res['notes'].append('fresh new game, default party');return False
    def snapshot_state(s,stage):
        s.ev("(()=>{PT.autosaveNow();writeSave('1')})()")
        ls=s.pg.evaluate("(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('abbeySave_auto')||k==='abbeyParty'||k==='abbeySave_1')o[k]=localStorage.getItem(k)}return o})()")
        pt=s.pg.evaluate("({xp:PT.xp,fallbacks:PT.fallbacks,stats:PT.stats,deaths:PT.deaths,wipes:PT.wipes,purchases:PT.purchases,events:PT.events,qlog:PT.qlog,talklog:PT.talklog,dmg:PT.dmg})")
        s.res['wall']+=time.time()-s.t0;s.t0=time.time()
        json.dump({'res':s.res,'ls':ls,'pt':pt,'stage':stage},open(STATE,'w',encoding='utf8'))
        SD=os.path.join(os.path.dirname(STATE),'saves' if os.path.basename(STATE)=='state.json' else 'saves_'+os.path.basename(STATE)[:-5]);os.makedirs(SD,exist_ok=True)
        json.dump({'res':s.res,'ls':ls,'pt':pt,'stage':stage},open(os.path.join(SD,'after_%s.json'%stage),'w',encoding='utf8'))
    def stage(s,name,fn):
        ss=s.res.setdefault('ss',{})
        if name not in ss:
            ss[name]={'h':s.ev("PT.humanSec()"),'d':s.ev("PT.deaths.length"),'w':s.ev("PT.wipes.length"),'l':s.ev("G.heroes.map(h=>h.lvl)"),'wall0':s.res['wall']+(time.time()-s.t0),'gold':s.ev("G.gold"),'lvl':s.ev("LEVEL")}
        st=ss[name];w0=time.time()
        s.stage_wipe0=s.res.setdefault('sw0',{}).setdefault(name,st['w'])
        try: out=fn()
        except GiveUp as g: out={'giveup':str(g)}
        st['wall']=s.res['wall']+(time.time()-s.t0)-st['wall0']
        l1=s.ev("G.heroes.map(h=>h.lvl)")
        rec={'giveup':isinstance(out,dict) and 'giveup' in out,'name':name,'wall':round(st['wall'],1),'human_s':round(s.ev("PT.humanSec()")-st['h']),'hero_deaths':s.ev("PT.deaths.length")-st['d'],'wipes':s.ev("PT.wipes.length")-st['w'],'lvl_start':st['l'],'lvl_end':l1,'gold_start':st['gold'],'gold':s.ev("G.gold"),'area_start':st['lvl'],'area_end':s.ev("LEVEL"),'out':out}
        s.res['stages'].append(rec);print(json.dumps(rec)[:600],flush=True)
        s.snapshot_state(name);return rec

class Crash(Exception): pass
class GiveUp(Exception): pass
def safe(r,name,fn,tries=1):
    """run a stage; on a browser crash exit with code 3 so the wrapper script restarts from the last saved state"""
    try:
        return r.stage(name,fn)
    except Exception as e:
        msg=str(e)
        if 'crash' in msg.lower() or 'closed' in msg.lower() or 'Target' in msg or 'Timeout' in msg:
            print('CRASH in stage',name,msg[:300],list(r.trace)[-8:],flush=True)
            try:
                d=json.load(open(STATE,encoding='utf8'));d['res']['notes'].append('browser crash in stage %s (%s), resumed from last save'%(name,msg[:40]));json.dump(d,open(STATE,'w',encoding='utf8'))
            except Exception: pass
            os._exit(3)
        raise
