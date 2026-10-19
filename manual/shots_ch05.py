import sys
sys.path.insert(0,'C:/Users/mirko/Downloads/workspace/Below-the-Abbey/manual')
from shotlib import Game
ALL=[ # name, level, x, y, f, pre-levels
('crypt',1,7,18,1,[]),('thornwood',2,13,8,3,[]),('thornwick_sign',3,32,16,1,[]),('thornwick_fountain',3,22,17,1,[]),
('thornwick_inn',6,6,7,0,[]),('gandrick_wood',7,22,28,0,[]),('gandrick_cave',8,20,15,3,[]),
('ironhill_road',10,43,25,3,[]),('tunnel',11,16,5,1,[]),('ironhill_town',13,32,20,0,[]),('ironhill_street',13,23,17,1,[]),
('ironhill_castle',14,6,3,1,[]),('ironhill_forge',15,4,4,0,[]),('ironhill_arcana',271,5,6,0,[13]),
('mines',18,28,6,1,[]),('burial',20,6,5,2,[]),('moor',19,30,5,2,[]),('pass',22,53,13,2,[]),('witch',24,1,2,1,[]),
('greendale',32,4,22,1,[]),('anaea',33,37,18,3,[]),('anaea_temple',38,5,9,0,[33]),
('sealed_stair',360,2,19,0,[]),('hollow_abbey',363,21,26,0,[]),('hollow_land',364,35,60,0,[]),('hollow_land2',364,40,32,0,[]),('spire1',440,30,8,0,[364]),
('path_start',400,76,795,0,[]),('path_bench',400,67,475,0,[]),('path_woman',400,74,227,3,[]),
('path_sign',402,73,152,0,[]),('path_shrine',402,72,137,0,[]),('path_lake',422,74,316,1,[]),
('path_cave',401,89,167,1,[]),('path_graves',412,100,607,0,[]),('path_statue',412,76,308,0,[]),
('path_inn',6801,6,7,0,[403]),('path_church',6802,4,6,0,[405]),
('mon_hives',430,45,55,2,[]),('mon_fountain',430,41,33,1,[]),('mon_church_out',430,33,17,1,[]),('mon_monk',430,46,16,3,[]),
('mon_church',6900,7,19,0,[430]),('mon_scriptorium',6902,5,6,0,[430]),('mon_guest',6904,6,7,0,[430]),('mon_lamps',6906,5,13,0,[430]),
('mon_cemetery',431,3,20,1,[]),('mon_cellars',432,21,11,0,[]),('mon_mausoleum',434,1,4,1,[]),
('oakwood_camp',311,21,22,0,[]),('oakwood_oak',311,66,58,1,[]),
('v_sign1',402,73,148,0,[]),('v_sign2',402,74,149,0,[]),('v_stat1',412,74,301,1,[]),('v_stat2',412,75,306,0,[]),('v_stat3',412,73,300,1,[]),
('v_gr1',412,96,600,1,[]),('v_gr2',412,100,606,0,[]),('v_gr3',412,98,594,2,[]),('v_thorn1',2,6,12,1,[]),('v_thorn2',2,19,28,1,[]),
('w_sign1',402,73,143,0,[]),('w_sign2',402,73,141,0,[]),('w_cross',402,75,254,0,[]),('w_stat1',411,75,306,0,[]),('w_stat2',411,76,308,0,[]),('w_stat3',411,73,299,1,[]),
('w_gr1',411,95,600,1,[]),('w_gr2',411,100,606,0,[]),('w_gr3',411,100,594,2,[]),('w_gr4',411,93,597,1,[]),
('x_stat1',411,77,302,0,[]),('x_stat2',411,77,300,0,[]),('x_stat3',411,76,301,0,[]),('x_stat4',411,75,300,1,[]),
]
want=set(sys.argv[1].split(',')) if len(sys.argv)>1 and sys.argv[1]!='all' else None
with Game() as g:
    g.pg.evaluate("khLoadAssets()"); g.pg.wait_for_function("typeof KH_READY!=='undefined'&&KH_READY",timeout=60000)
    for name,n,x,y,f,pre in ALL:
        if want and name not in want: continue
        try:
            for p in pre:
                g.pg.evaluate("goToLevel(%d)"%p); g.pg.wait_for_timeout(1500)
            for attempt in range(3):
                g.pg.evaluate("goToLevel(%d,{x:%d,y:%d,f:%d})"%(n,x,y,f)); g.pg.wait_for_timeout(1800); g.clear()
                if g.js("LEVEL")==n: break
            g.pg.evaluate("G.P.x=%d;G.P.y=%d;G.P.f=%d;G.P.angT=(%d-1)*Math.PI/2;G.C={x:%d,y:%d,a:G.P.angT}"%(x,y,f,f,x,y))
            g.pg.wait_for_timeout(2200); g.js("G.msgs=[]"); g.pg.wait_for_timeout(300)
            g.shot('ch05_'+name); print('ok',name,g.js("LEVEL"),flush=True)
        except Exception as ex: print('ERR',name,str(ex)[:150],flush=True)
