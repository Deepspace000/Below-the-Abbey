from common import *
def town_side(r,key,town_levels,shop_levels,home,hunt=None,label=''):
    return once(r,'side_'+key,lambda: side_quests(r,town_levels,shop_levels,home,hunt=hunt,label=label))
def st_crypt(r):
    r.res['notes'].append('start area: party level 1 enters the crypts (rating 4); unavoidable, not counted as a rule break')
    return crypt_stage(r)
def st_abbey(r):
    o={'gate':gate(r,2,why='abbey grounds')}
    r.ev("PT.cut()")
    o.update(sweep(r,talk=False,maxen=80))
    o['exit']=r.ev("PT.takeExit()");r.ev("PT.cut()");return o
def st_th_town(r):
    o=st_th_town_base(r)
    return o
def st_th_side(r):
    return town_side(r,'thornwick',[3,4,6,5],[4],3,hunt=[(2,'e=>true'),(7,'e=>true')],label='Thornwick side quests')
def st_th_gandrick(r):
    o={}
    o['gate7']=gate(r,7,why="Gandrick's Wood")
    o['prep']=interior(r,4,3)
    o['to7']=enter(r,7)
    o['sweep7']=sweep(r,talk=True,maxen=80)
    o['gate8']=gate(r,8,why="Gandrick's Cave")
    o['to8']=enter(r,8)
    o['sweep8']=sweep(r,talk=False,maxen=80)
    o['flags']=r.ev("({gd:G.flags.gandrickDead,ledger:G.flags.ledger})")
    return o
def st_th_handin(r):
    o={}
    o['to7']=r.ev("PT.portalOrTravel(7,'walled into Gandrick vault after reload: opened door re-locks, key already used')") if r.ev("LEVEL")==8 else 'n/a'
    r.ev('PT.cut()'); o['route3']=r.ev("PT.goLevel(3)")
    o['mayor']=npc_talk(r,'corbin',5)
    r.ev("PT.cut()")
    o['fightmayor']=play(r,"PT.clearLevel({cap:5})"); r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ().gandrick,iron:PT.snapQ().ironhill})")
    return o
def st_ironhill_road(r):
    o={}
    o['g10']=gate(r,10,why='Ironhill Road')
    o['l7']=once(r,'ir7',lambda: transit(r,7,exit_to=10,cap=20))
    o['g11']=gate(r,11,why='Ironhill Tunnel')
    o['l10']=once(r,'ir10',lambda: transit(r,10,exit_to=11,cap=20))
    o['g13']=gate(r,13,why='Ironhill')
    o['l11']=once(r,'ir11',lambda: transit(r,11,exit_exit=True,cap=20,skip_js="goToLevel(13,{x:IRONJ.town.start.x,y:IRONJ.town.start.y,f:1})"))
    return o
def st_ih_report(r):
    o={'halb':npc_talk(r,'halbrecht',14)}
    o['q']=r.ev("PT.snapQ()")
    return o
def st_ih_side(r):
    return town_side(r,'ironhill',[13,14,15,16,17],[15,17,16],13,hunt=None,label='Ironhill side quests')
def st_ih_mines(r):
    o={'gate':gate(r,18,why='Ironhill Mines (the 64-wipe area of the first run)')}
    o['kill']=once(r,'mines_kill',lambda: kill_until(r,'mines',iters=120,lv=18,wipecap=20))
    o['q']=r.ev("[qReady('mines'),G.flags.mineKills]")
    o['rest']=r.ev("PT.rest()")
    o['halb']=once(r,'mines_report',lambda: npc_talk(r,'halbrecht',14))
    r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ()})")
    return o
def st_ih_escape(r):
    o={'gate':gate(r,21,why='Castle Dungeons')}
    o['jailer']=once(r,'esc_jailer',lambda: npc_talk(r,'jailer',21))
    o['guards']=once(r,'esc_guards',lambda: clear_until(r,'e=>e.t!=="halbrecht"',why='castle guards L27-29',key='guards',wipecap=20))
    o['halb']=once(r,'esc_halb',lambda: clear_until(r,'e=>e.t==="halbrecht"',why='Halbrecht L28',key='halb',wipecap=20))
    r.ev("PT.cut()")
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ().escape})")
    return o
def st_pass(r):
    o={}
    o['shop']=once(r,'pass_shop',lambda: shop_round(r,[15,17,16],13))
    o['rest']=r.ev("PT.rest()")
    o['g19']=gate(r,19,why='Ironhill Moor')
    o['l19']=once(r,'pass19',lambda: transit(r,19,exit_to=22,cap=20))
    o['g22']=gate(r,22,why='Greyfang Pass')
    o['l22']=once(r,'pass22',lambda: transit(r,22,exit_exit=True,cap=20,skip_js="goToLevel(32,{x:2,y:36,f:1})"))
    o['after']=r.ev("({lvl:LEVEL,q:PT.snapQ().pass,st:G.state})")
    return o
def st_th_town_base(r):
    o={}
    o['aldous']=interior(r,4,3)
    o['outside']=talk_all(r)
    o['inn']=interior(r,6,3)
    o['mayor']=interior(r,5,3)
    o['quests']=r.ev("PT.snapQ()")
    return o
ACT1=[('crypt',st_crypt),('abbey',st_abbey),('th_town',st_th_town),('th_side',st_th_side),('th_gandrick',st_th_gandrick),('th_handin',st_th_handin),('ironhill_road',st_ironhill_road),('ih_report',st_ih_report),('ih_side',st_ih_side),('ih_mines',st_ih_mines),('ih_escape',st_ih_escape),('pass',st_pass)]
