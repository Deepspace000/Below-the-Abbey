"""Contact sheets: python tools/spellfx/spellfx_sheets.py [group ...]   (server on 8356). One PNG per group in tools/spellfx/ (6 frames per spell, one row per spell)."""
import sys, io
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from spellfx_lib import *
from PIL import Image, ImageDraw
GROUPS = {
 'fire': ['sp:fire', 'pw:Fireball', 'pw:Meteor', 'pw:Cataclysm', 'z40', 'a10'],
 'frost': ['sp:frost', 'pw:Frost Nova'],
 'lightning': ['pw:Chain Lightning', 'z30b', 'pw:Lightning Storm'],
 'arcane': ['m10', 'm30b', 'm40', 'm50', 'k30', 'k40', 'z30'],
 'poison': ['r30', 'r40', 's40', 't30', 't20'],
 'holy': ['p20', 'p40', 'c20', 'c40', 'c30b', 'a50', 'sp:light'],
 'shadow': ['z10', 'z50', 's30', 'a40', 's50', 'pw:Siphon'],
 'earth': ['b40', 'g40', 'g50', 'r10', 'r50'],
 'physical': ['w30', 'b20', 's10', 's20', 'w10', 'b10', 'w50', 'g10', 'k10', 'k50', 'a20', 'a30'],
 'utility': ['m20', 'z20', 'g30', 't10', 't50'],
 'heal': ['pw:Heal', 'p10', 'c40h', 'pw:Mend', 'pw:Greater Heal', 'k20', 'g20', 'c10'],
 'buff': ['w20', 'w40', 'b30', 'b50', 'p30', 'r20', 'm30', 'pw:Mage Armor', 'c30', 'pw:Blessing'],
 'rise': ['c50', 'pw:Revive', 'pw:Divine Intervention', 'p50'],
}
PARTY = {'heal', 'buff', 'rise'}
def foes_for(id):
    return [['bandit', 3, 0, 5000, 0], ['bandit', 4, 0, 5000, 1], ['wolf', 2, 0, 5000, -1]]
def run(g, id, group):
    party = group in PARTY
    g.ev("(o)=>__setup(o)", {'foes': [] if party else foes_for(id)})
    r = g.ev("([id,h,d])=>__cast(2,id,h,d)", [id, .35 if party else 0, id in ('c50', 'pw:Revive')])
    if r != 'ok': return r, []
    end = g.ev("()=>SPFX.fx.length?SPFX.fx[0].end:0")
    times = [.07, end * .5, end, end + .07, end + .22, end + .5] if end else [.05, .2, .4, .6, .8, 1.0]
    if party: times = [.05, .15, .3, .5, .7, .95]
    frames = []; t = 0
    for tt in times:
        n = max(0, round((tt - t) * 60)); 
        if n: g.step(n)
        t = tt
        frames.append(Image.open(io.BytesIO(g.shot('hud' if party else 'view'))).convert('RGB'))
    return r, frames
def main(groups):
    g = Game()
    for gr in groups:
        rows = []
        for id in GROUPS[gr]:
            r, fr = run(g, id, gr)
            errs = [l for l in g.logs if l[0] in ('error', 'pageerror')]
            print(gr, id, r, 'errors:', errs[:2], flush=True)
            if fr: rows.append((id, fr))
        if not rows: continue
        sc = .34; w, h = rows[0][1][0].size; cw, ch = int(w * sc), int(h * sc)
        S = Image.new('RGB', (cw * 6, ch * len(rows)))
        d = ImageDraw.Draw(S)
        for ri, (id, fr) in enumerate(rows):
            for ci, im in enumerate(fr): S.paste(im.resize((cw, ch)), (ci * cw, ri * ch))
            d.text((4, ri * ch + 3), id, fill=(255, 255, 0))
        S.save(OUT / f'sheet_{gr}.png'); print('wrote', gr, S.size, flush=True)
    print('console errors:', [l for l in g.logs if l[0] in ('error', 'pageerror')])
    print('fx cost', g.ev("()=>SPFX.stat"))
    g.close()
if __name__ == '__main__':
    main(sys.argv[1:] or list(GROUPS))
