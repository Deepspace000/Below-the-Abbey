from h import *
def rec(r):
    w=r.ev("PT.recover()")
    if w:
        print('WIPE',json.dumps(w)[:300]); r.res.setdefault('wipelog',[]).append(w)
        r.wipes_this_process=getattr(r,'wipes_this_process',0)+1
        n=r.ev("PT.wipes.length")-getattr(r,'stage_wipe0',0)
        if r.wipes_this_process>=4:
            r.snapshot_state('mid'); print('restarting browser after repeated reloads',flush=True); os._exit(3)
    return w
def play(r,expr,tries=30):
    """run an expression (a PT call) repeatedly, recovering from wipes; returns last result"""
    out=None
    for i in range(tries):
        out=r.ev(expr)
        if r.ev("G.state")=='play' and not rec(r): return out
        rec(r)
    return out
def crypt_stage(r):
    r.ev("(()=>{PT.lootNoCoffin=()=>{for(const d of G.decor.filter(d=>d.loot&&!d.shop&&!d.looted&&d.k!=='coffin')){const r=PT.openDecor(d);if(r!=='open')continue;PT.takeAll();d.looted=true}};})()")
    r.ev("PT.lootNoCoffin()");r.ev("PT.gearUp()")
    for it in range(40):
        play(r,"PT.clearLevel({cap:3,filter:e=>/rat|bat/.test(e.t)})")
        if not r.ev("G.enemies.some(e=>e.hp>0&&/rat|bat/.test(e.t))"):break
    r.ev("(()=>{PT.avoid=e=>/skel|boss/.test(e.t)})()")
    if r.ev("(()=>{const d=G.decor.find(d=>d.shop);return PT.openDecor(d)})()")=='open': r.ev("PT.shop()")
    r.ev("G.loot=null;PT.avoid=null")
    for it in range(60):
        o=play(r,"PT.clearLevel({cap:2})")
        if o==[]: break
        if r.ev("PT.needRest()"): r.ev("PT.rest()")
    r.ev("PT.collect({skip:i=>0})");r.ev("PT.gearUp()")
    for it in range(30):
        o=play(r,"PT.clearLevel({cap:2})")
        if o==[]: break
    return r.ev("PT.takeExit()")

def sweep(r,clear=True,loot=True,collect=True,talk=True,maxen=60,skipnpc=r'^(epitaph|shr_|grave|thornwell|urn|lockedgate)'):
    out={}
    import re
    if loot: out['loot']=play(r,"PT.lootAll({})")
    if collect: out['collect']=play(r,"PT.collect({})")
    r.ev("PT.gearUp()")
    if clear:
        n=0
        for i in range(maxen):
            o=play(r,"PT.clearLevel({cap:2})")
            if o==[] or o is None or 'timeout' in o or r.ev("G.state")!='play': break
            if r.ev("PT.needRest()"): r.ev("PT.rest()")
        r.ev("PT.gearUp()")
    if talk:
        out['talk']=play(r,"PT.talkAllNpcs({filter:d=>!/%s/.test(d.npc)})"%skipnpc)
    return out

def run_stages(r,stages):
    done={s['name'] for s in r.res['stages']}
    for name,fn in stages:
        if name in done: continue
        safe(r,name,lambda fn=fn: fn(r))
def st_crypt(r): return crypt_stage(r)
def st_abbey(r):
    r.ev("PT.cut()")
    o=sweep(r,talk=False,maxen=80)
    o['exit']=r.ev("PT.takeExit()");r.ev("PT.cut()");return o

def enter(r,lv):
    o=r.ev("(()=>{const r=PT.takePortal(%d);return r==='noportal'?PT.goLevel(%d).join(','):r})()"%(lv,lv))
    r.ev("PT.cut()")
    return o
def talk_all(r,filt=r"^(epitaph|shr_|grave|thornwell|urn|lockedgate)",again=False,shop=True):
    r.ev("PT.shopTag++")
    return play(r,"PT.talkAllNpcs({again:%s,filter:d=>!/%s/.test(d.npc)})"%('true' if again else 'false',filt))
def interior(r,lv,back,again=False):
    o={'enter':enter(r,lv)}
    o['talk']=talk_all(r,again=again)
    r.ev("PT.gearUp()")
    o['back']=enter(r,back)
    return o
def st_th_town(r):
    o={}
    o['aldous']=interior(r,4,3)
    o['outside']=talk_all(r)
    o['inn']=interior(r,6,3)
    o['mayor']=interior(r,5,3)
    o['quests']=r.ev("PT.snapQ()")
    return o

def st_th_gandrick(r):
    o={}
    if r.ev('LEVEL')==501: r.ev("goToLevel(3,{x:29,y:18,f:1})"); r.ev('PT.pump(5)'); o['note']='left the well maze by travel'
    o['prep']=interior(r,4,3)
    o['to7']=enter(r,7)
    o['sweep7']=sweep(r,talk=True,maxen=80)
    o['portals']=r.ev("G.portals.map(p=>p.to)")
    o['to8']=enter(r,8)
    o['sweep8']=sweep(r,talk=False,maxen=80)
    o['flags']=r.ev("({gd:G.flags.gandrickDead,ledger:G.flags.ledger,bag:G.bag.map(b=>b.id)})")
    return o

def st_th_handin(r):
    o={}
    o['to7']=r.ev("PT.portalOrTravel(7,'walled into Gandrick vault after reload: opened door re-locks, key already used')"); r.ev('PT.cut()'); o['to3']=enter(r,3)
    o['mayor']=play(r,"(()=>{PT.shopTag++;const o=[];const r1=PT.takePortal(5);PT.cut();o.push(r1);const d=PT.npcs().find(d=>d.npc==='corbin');o.push(d?PT.talkTo(d):'nocorbin');return o})()")
    r.ev("PT.cut()")
    o['fightmayor']=play(r,"PT.clearLevel({cap:5})"); r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,st:G.state,q:PT.snapQ().gandrick,cut:!!G.cut,en:G.enemies.filter(e=>e.hp>0).map(e=>e.t+e.lvl)})")
    return o

def visit(r,lv,exit_to=None,exit_exit=False,clear=True,talk=True,enter_from=None,loot=True,collect=True,maxen=80):
    o={}
    if r.ev("LEVEL")!=lv:
        o['enter']=r.ev("PT.goLevel(%d)"%lv); r.ev("PT.cut()")
    o['sweep']=sweep(r,clear=clear,talk=talk,loot=loot,collect=collect,maxen=maxen)
    if exit_to is not None:
        o['exit']=r.ev("PT.portalOrTravel(%d,'exit to %d')"%(exit_to,exit_to)); r.ev("PT.cut()")
    elif exit_exit:
        o['exit']=r.ev("PT.takeExit()"); r.ev("PT.cut()")
    o['lvl']=r.ev("LEVEL")
    return o
def go_exit(r,expr,cap=8,skip_js=None,why=''):
    """run an exit expression (portal or exit tile) with wipe recovery; after `cap` wipes in this call, log a BUG and skip"""
    lv0=r.ev("LEVEL");o=None;w0=r.res.setdefault('goexit',{}).setdefault(str(lv0)+':'+expr[:30],r.ev("PT.wipes.length"))
    for i in range(cap+1):
        o=play(r,expr,tries=3); r.ev("PT.cut()")
        if r.ev("LEVEL")!=lv0:
            r.res['goexit'].pop(str(lv0)+':'+expr[:30],None); return o
        if r.ev("PT.wipes.length")-w0>=cap: break
    if skip_js:
        r.ev("(()=>{PT.fallbacks.push({lvl:LEVEL,reason:%s,time:Math.round(G.time)});PT.events.push({t:'skip',lvl:LEVEL,reason:%s})})()"%(json.dumps('IMPOSSIBLE GRIND? '+why+' after %d wipes'%cap),json.dumps(why)))
        r.ev(skip_js);r.ev("PT.pump(10)");r.ev("PT.cut()")
        r.res['goexit'].pop(str(lv0)+':'+expr[:30],None)
        return 'skipped'
    return o
def transit(r,lv,exit_to=None,exit_exit=False,cap=8,skip_js=None):
    """cross an area as a cautious player does: keep away from every creature, fight only when caught"""
    r.ev("(()=>{PT.avoid=e=>true})()")
    o={}
    if r.ev("LEVEL")!=lv:
        o['enter']=r.ev("PT.goLevel(%d)"%lv); r.ev("PT.cut()")
    if exit_to is not None:
        o['exit']=go_exit(r,"PT.portalOrTravel(%d,'transit %d')"%(exit_to,lv),cap=cap,skip_js=skip_js or "goToLevel(%d,{x:LEVELS[%d].start.x,y:LEVELS[%d].start.y,f:1})"%(exit_to,exit_to,exit_to),why='transit area %d'%lv)
    elif exit_exit:
        o['exit']=go_exit(r,"PT.takeExit()",cap=cap,skip_js=skip_js,why='transit area %d'%lv)
    r.ev("(()=>{PT.avoid=null})()")
    o['lvl']=r.ev("LEVEL")
    return o
def once(r,key,fn):
    """run a sub-step once; its result is remembered in the saved state so a restarted stage does not repeat it"""
    m=r.res.setdefault('marks',{})
    if key in m: return m[key]
    o=fn(); m[key]=o if isinstance(o,(str,int,float,list,dict,type(None))) else str(o)
    r.snapshot_state('mark')
    return m[key]
def st_ironhill_road(r):
    o={}
    o['l7']=once(r,'ir7',lambda: transit(r,7,exit_to=10))
    o['l10']=once(r,'ir10',lambda: transit(r,10,exit_to=11))
    o['l11']=once(r,'ir11',lambda: transit(r,11,exit_exit=True,skip_js="goToLevel(13,{x:IRONJ.town.start.x,y:IRONJ.town.start.y,f:1})"))
    return o

def npc_talk(r,npc,lv=None,pick=None,opts=''):
    """go to the level holding npc (if given) and talk to it with the default policy"""
    if lv is not None and r.ev("LEVEL")!=lv:
        r.ev("PT.goLevel(%d)"%lv); r.ev("PT.cut()")
    r.ev("PT.shopTag++")
    o=play(r,"(()=>{const d=PT.npcs().find(d=>d.npc===%s);if(!d)return {err:'npc not found'};const r=PT.talkTo(d,%s);if(G.loot&&G.loot.shop){PT.shop();G.loot=null}return r})()"%(json.dumps(npc),opts or '{}'))
    r.ev("PT.cut()")
    return o
def st_ih_report(r):
    o={}
    o['town']=r.ev("(()=>{PT.shopTag++;return 'ok'})()")
    o['halb']=npc_talk(r,'halbrecht',14)
    o['q']=r.ev("PT.snapQ()")
    return o

def kill_until(r,qid,filt='()=>true',iters=80,lv=None,wipecap=12):
    """fight (one creature at a time, resting between) until quest qid is ready; wipes are recovered by the game's own reload.
    After wipecap wipes the goal is skipped by setting the counter, logged as an impossible grind."""
    if lv is not None and r.ev("LEVEL")!=lv:
        r.ev("PT.goLevel(%d)"%lv); r.ev("PT.cut()")
    key='kill:'+qid;w0=r.res.setdefault('goexit',{}).setdefault(key,r.ev("PT.wipes.length"))
    for i in range(iters):
        if r.ev("qReady(%s)"%json.dumps(qid)) : return 'ready'
        if r.ev("PT.wipes.length")-w0>=wipecap:
            r.ev("PT.skipQuestGoal(%s,%s)"%(json.dumps(qid),json.dumps('impossible grind: %d wipes before the goal was met (party avg level vs creature level)'%wipecap)))
            return 'SKIPPED-by-counter'
        o=play(r,"PT.clearLevel({cap:1,filter:%s})"%filt)
        if o==[]:
            r.ev("PT.collect({})")
            if not r.ev("PT.nearestEnemy(%s)"%filt): return 'noenemy'
    return 'iters'
def st_ih_mines(r):
    o={}
    o['kill']=once(r,'mines_kill',lambda: kill_until(r,'mines',iters=80,lv=18))
    o['q']=r.ev("[qReady('mines'),G.flags.mineKills]")
    o['rest']=r.ev("PT.rest()")
    o['halb']=once(r,'mines_report',lambda: npc_talk(r,'halbrecht',14))
    r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ(),cut:!!G.cut})")
    return o

def clear_until(r,filt='()=>true',iters=60,wipecap=12,key='',why=''):
    """kill every creature matching filt in this area, resting between pulls. After wipecap wipes: kill them through the game's damage routine and log it."""
    lv=r.ev("LEVEL");key='clear:%d:%s'%(lv,key or filt);w0=r.res.setdefault('goexit',{}).setdefault(key,r.ev("PT.wipes.length"))
    for i in range(iters):
        if not r.ev("PT.nearestEnemy(%s)||G.enemies.some(e=>e.hp>0&&(%s)(e))"%(filt,filt)): return 'cleared'
        if r.ev("PT.wipes.length")-w0>=wipecap:
            r.ev("PT.killForSkip(%s,%s)"%(filt,json.dumps('IMPOSSIBLE GRIND: %s (%d wipes)'%(why,wipecap))))
            return 'SKIPPED-by-kill'
        o=play(r,"PT.clearLevel({cap:1,filter:%s})"%filt)
        if o==[] and not r.ev("G.enemies.some(e=>e.hp>0&&!e.surr&&(%s)(e))"%filt): return 'cleared'
        if o==[]: r.ev("PT.collect({})")
    return 'iters'
def st_ih_escape(r):
    o={}
    o['jailer']=once(r,'esc_jailer',lambda: npc_talk(r,'jailer',21))
    o['guards']=once(r,'esc_guards',lambda: clear_until(r,'e=>e.t!=="halbrecht"',why='castle guards L27-29',key='guards'))
    o['halb']=once(r,'esc_halb',lambda: clear_until(r,'e=>e.t==="halbrecht"',why='Halbrecht L28',key='halb'))
    r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ().escape,flags:G.flags.halDown,cut:!!G.cut})")
    return o

def shop_round(r,levels,home):
    o={}
    for lv in levels:
        r.ev("PT.goLevel(%d)"%lv); r.ev("PT.cut()")
        r.ev("PT.shopTag++")
        o[lv]=play(r,"PT.talkAllNpcs({again:true,filter:d=>!/^(epitaph|shr_|grave|urn|lockedgate|well)/.test(d.npc)})")
    r.ev("PT.goLevel(%d)"%home)
    r.ev("PT.gearUp()")
    return {k:(len(v) if isinstance(v,list) else v) for k,v in o.items()}
def st_pass(r):
    o={}
    o['shop']=once(r,'pass_shop',lambda: shop_round(r,[15,17,16],13))
    o['rest']=r.ev("PT.rest()")
    o['l19']=once(r,'pass19',lambda: transit(r,19,exit_to=22))
    o['l22']=once(r,'pass22',lambda: transit(r,22,exit_exit=True,skip_js="goToLevel(32,{x:2,y:36,f:1})"))
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ().pass,st:G.state,cut:!!G.cut,passDone:G.flags.passDone})")
    return o

def shop_dump(r,levels):
    """read-only: list what the shops in these levels sell (used for the gear report)"""
    out={}
    for lv in levels:
        out[lv]=r.ev("""(()=>{PT.shopTag++;const lv=%d;const o=[];const keep=LEVEL;const sv=PT.snap();goToLevel(lv,LEVELS[lv].start);PT.pump(5);
          for(const d of PT.npcs()){d._shopped=0;const T=PT.talkTo(d,{pick:(t,op)=>op.findIndex(x=>/^(trade|buy|shop|browse)/i.test(x))});if(G.loot&&G.loot.shop){o.push(d.npc+': '+G.loot.decor.contents.map(c=>c.id+'x'+c.n+'$'+buyPrice(c.id)).join(' '));G.loot=null}}
          return o})()"""%lv)
    return out

def side_quests(r,town_levels,shop_levels,home,hunt=None,passes=3,wipecap=6,label=''):
    """sensible-human side quest round: accept everything the town offers, buy or fetch the items, hunt the counters nearby, hand in. Logs xp and gold gained."""
    snap0=r.ev("({xp:G.heroes.map(h=>h.xp+0),lv:G.heroes.map(h=>h.lvl),gold:G.gold,q:Object.keys(G.quests).filter(k=>G.quests[k].st==='done').length,w:PT.wipes.length,h:PT.humanSec()})")
    log={'label':label,'passes':[]}
    for p in range(passes):
        pl={}
        for lv in town_levels:
            r.ev("PT.goLevel(%d)"%lv);r.ev("PT.cut()")
            pl['talk%d'%lv]=len(play(r,"PT.talkAllNpcs({again:true,filter:d=>!/^(epitaph|shr_|grave|urn|lockedgate|well|thornwell|memorial|notice|fountain)/.test(d.npc)})") or [])
        aq=r.ev("PT.activeQuests()")
        pl['active']=[(a['id'],a['prog'],a['need'],a['ready']) for a in aq]
        for a in aq:
            if a['ready']: continue
            if a['take']:
                for it,n in a['take'].items():
                    if r.ev("PT.bagN(%s)"%json.dumps(it))>=n: continue
                    for sl in shop_levels:
                        r.ev("PT.goLevel(%d)"%sl);r.ev("PT.cut()");r.ev("PT.shopTag++")
                        got=r.ev("""(()=>{let g=0;for(const d of PT.npcs()){d._shopped=0;const T=PT.talkTo(d,{pick:(t,op)=>op.findIndex(x=>/^(trade|buy|shop|browse)/i.test(x))});if(G.loot&&G.loot.shop){g+=PT.buyId(%s,%d-PT.bagN(%s));G.loot=null}if(PT.bagN(%s)>=%d)break}return g})()"""%(json.dumps(it),n,json.dumps(it),json.dumps(it),n))
                        if r.ev("PT.bagN(%s)"%json.dumps(it))>=n: break
            if a['id']=='goats':
                r.ev("PT.goLevel(3)");r.ev("PT.findGoats()")
        if hunt:
            for lv,filt in hunt:
                if not any((not a['ready']) and (a['cnt'] or a['id'] in ('wolves','bandits','rats','ghosts')) for a in r.ev("PT.activeQuests()")): break
                r.ev("PT.goLevel(%d)"%lv);r.ev("PT.cut()")
                w0=r.ev("PT.wipes.length")
                for i in range(25):
                    if r.ev("PT.wipes.length")-w0>=wipecap: break
                    if all(a['ready'] or not (a['cnt'] or a['id'] in ('wolves','bandits','rats','ghosts')) for a in r.ev("PT.activeQuests()")): break
                    o=play(r,"PT.clearLevel({cap:1,filter:%s})"%filt)
                    if o==[]: break
        r.ev("PT.collect({})")
        log['passes'].append(pl)
    r.ev("PT.goLevel(%d)"%home)
    snap1=r.ev("({xp:G.heroes.map(h=>h.xp+0),lv:G.heroes.map(h=>h.lvl),gold:G.gold,q:Object.keys(G.quests).filter(k=>G.quests[k].st==='done').length,w:PT.wipes.length,h:PT.humanSec()})")
    log.update({'gold_gain':snap1['gold']-snap0['gold'],'quests_done':snap1['q']-snap0['q'],'lv_before':snap0['lv'],'lv_after':snap1['lv'],'wipes':snap1['w']-snap0['w'],'human_s':round(snap1['h']-snap0['h'])})
    r.res.setdefault('side',[]).append(log)
    return log

def region_of(lv):
    if lv in (1,2,3,4,5,6,7,8,9,10,11,12,23,24,25,29): return ([4],3)
    if lv in (13,14,15,16,17,18,19,20,21,22,26,27,28,30,31): return ([15,17,16],13)
    if lv in (32,33,34,35,36,37,38,39,40,41): return ([36,37],33)
    return None
def maybe_restock(r,min_pots=4,min_gold=120):
    reg=region_of(r.ev("LEVEL"))
    if reg and r.ev("PT.pots()")<min_pots and r.ev("G.gold")>=min_gold:
        r.ev("PT.goLevel(%d)"%reg[1]) if r.ev("LEVEL")!=reg[1] and not r.ev("LEVEL") in reg[0] else None
        for sl in reg[0]:
            r.ev("PT.goLevel(%d)"%sl);r.ev("PT.cut()");r.ev("PT.shopTag++")
            play(r,"PT.talkAllNpcs({again:true,filter:d=>!/^(epitaph|shr_|grave|urn|lockedgate|well|thornwell)/.test(d.npc)})")
            if r.ev("PT.pots()")>=min_pots*2: break
        r.res.setdefault('restocks',[]).append({'area':r.ev("LEVEL"),'pots':r.ev("PT.pots()"),'gold':r.ev("G.gold")})
        return True
    return False
def grind_area(r,lv,wipecap=4):
    maybe_restock(r)
    """enter area lv fresh (creatures respawn on entry), kill everything reachable one pull at a time, loot, rest. Returns xp gained."""
    x0=r.ev("PT.xpTotal()")
    r.ev("PT.goLevel(%d)"%lv);r.ev("PT.cut()")
    w0=r.ev("PT.wipes.length")
    for i in range(40):
        if r.ev("PT.wipes.length")-w0>=wipecap: break
        o=play(r,"PT.clearLevel({cap:2})")
        if o==[] or o is None: break
    r.ev("PT.collect({})");r.ev("PT.gearUp()")
    if r.ev("PT.needRest(.9)"): r.ev("PT.rest()")
    return r.ev("PT.xpTotal()")-x0
def gate(r,area,margin=1,max_cycles=25,why=''):
    """the owner's entry rule: do not enter an area rated more than `margin` levels above the party average; grind lower areas (respawning creatures) until the party is there. Everything is logged."""
    rating=r.ev("gotoRate(%d)||LEVEL_RATING[%d]||0"%(area,area))
    avg=r.ev("PT.avgLvl()")
    if avg>=rating-margin: return {'needed':False,'rating':rating,'avg':avg}
    key='gate:%d'%area
    g=r.res.setdefault('gates',{}).setdefault(key,{'area':area,'why':why,'rating':rating,'avg_start':avg,'cycles':0,'xp':0,'human0':r.ev("PT.humanSec()"),'wall0':r.res['wall']+(time.time()-r.t0),'wipes0':r.ev("PT.wipes.length"),'areas':{},'log':[]})
    low=0
    while True:
        avg=r.ev("PT.avgLvl()")
        if avg>=rating-margin: g['result']='reached level'; break
        if g['cycles']>=max_cycles: g['result']='WALL: cycle cap reached'; break
        c=[x for x in r.ev("PT.grindCands(%f,%f)"%(avg-10,avg+1)) if g.setdefault('awipes',{}).get(str(x['n']),0)<12]
        if not c: g['result']='WALL: no safe area to grind (nothing within one level of the party)'; break
        # rotate among the best candidates so a drained area is not repeated forever
        pick=c[g['cycles']%min(len(c),2)] if len(c)>1 and low>=2 else c[0]
        wpb=r.ev("PT.wipes.length");xp=grind_area(r,pick['n']);g.setdefault('awipes',{})[str(pick['n'])]=g.setdefault('awipes',{}).get(str(pick['n']),0)+r.ev("PT.wipes.length")-wpb
        g['cycles']+=1;g['xp']+=xp
        a=g['areas'].setdefault(str(pick['n']),{'name':pick['name'],'rating':pick['r'],'visits':0,'xp':0});a['visits']+=1;a['xp']+=xp
        g['log'].append([pick['n'],round(xp),round(avg,1)])
        low=low+1 if xp<xpNeedPy(avg)/8 else 0
        if low>=5: g['result']='WALL: xp per cycle too small to catch up'; break
        r.snapshot_state('gate')
    g['avg_end']=r.ev("PT.avgLvl()");g['human_s']=r.ev("PT.humanSec()")-g['human0'];g['wall']=r.res['wall']+(time.time()-r.t0)-g['wall0'];g['wipes']=r.ev("PT.wipes.length")-g['wipes0']
    r.res['gates'][key]=g
    return g
def xpNeedPy(l): return 30*l*(l+1)/2
