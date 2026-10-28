"""Full-size frames of one spell: python tools/spellfx/spellfx_frames.py <id> <group> t1 t2 ... (seconds after the cast); writes tools/spellfx/frame_<n>.png"""
import sys, io
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from spellfx_lib import *
import spellfx_sheets as S
id, group = sys.argv[1], sys.argv[2]; times = [float(x) for x in sys.argv[3:]]
g = Game()
try:
    S.setup_fakes(g, id)
    party = group in S.PARTY
    g.ev("(o)=>__setup(o)", {'foes': [] if party else S.foes_for(id, group)})
    print(g.ev("([id,h,d])=>__cast(2,id,h,d)", [id, .35 if party else 0, False]))
    t = 0
    for i, tt in enumerate(times):
        n = max(0, round((tt - t) * 60))
        if n: g.step(n)
        t = tt
        hud = party or g.ev("()=>SPFX.obj.some(o=>o.h)||SPP.some(p=>p.a&&p.h)")
        open(OUT / f'frame_{i}.png', 'wb').write(g.shot('hud' if hud else 'view'))
    print('errors', [l for l in g.logs if l[0] in ('error', 'pageerror')])
finally:
    g.close()
