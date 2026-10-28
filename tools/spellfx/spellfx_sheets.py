"""Contact sheets: python tools/spellfx/spellfx_sheets.py [group ...]   (server on 8356). One PNG per group in tools/spellfx/ (6 frames per spell, one row per spell)."""
import sys, io
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from spellfx_lib import *
from PIL import Image, ImageDraw
GROUPS = {
 'fire': ['sp:fire', 'pw:Fireball', 'pw:Meteor', 'pw:Cataclysm', 'z40', 'a10'],
 'frost': ['sp:frost', 'pw:Frost Nova', 'xf1', 'xf2'],
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
 'thief': ['pw:Twin Stab', 'pw:Flurry', 'pw:Death Mark', 'pw:Shadowstrike', 'pw:Moonless Kill', 'pw:Smoke Bomb', 'pw:Fan of Knives', 'pw:Sense Traps'],
 'ranger': ['pw:Aimed Shot', 'pw:Pinning Shot', 'pw:Rapid Fire', 'pw:Heartseeker', 'pw:Arrow Storm', 'pw:Killing Shot', "pw:Hunter's Mark", 'pw:Snare Net'],
 'archer': ['pw:Volley', 'pw:Piercing Shot', 'pw:Triple Shot', 'pw:Arrow Rain', 'pw:Perfect Shot', 'pw:Starfall Shot'],
 'warrior': ['pw:Power Strike', 'pw:Cleave', 'pw:Battle Cry', 'pw:Shield Wall', 'pw:Skullsplitter', "pw:Titan's Fury", 'pw:Worldsplitter'],
 'barbarian': ['pw:Rage Blow', 'pw:Bloodlust', 'pw:Thunderous Roar', 'pw:Whirlwind', 'pw:Skull Cleaver', 'pw:Avatar of Ruin', "pw:Mountain's Wrath"],
 'paladin': ['pw:Smite', 'pw:Divine Shield', 'pw:Righteous Blow', 'pw:Holy Wrath', 'pw:Judgment', 'pw:Sunbrand'],
 'assassin': ['pw:Backstab', 'pw:Vanish', 'pw:Nerve Strike', 'pw:Assassinate', 'pw:Needle in the Dark', "pw:Reaper's Kiss"],
 'monk': ['pw:Palm Strike', 'pw:Flurry of Blows', 'pw:Stunning Fist', 'pw:Dragon Kick', 'pw:Fist of the Mountain', 'pw:Hundred-Fold Palm'],
 'goat': ['pw:Headbutt', 'pw:Charge', 'pw:Rampage', 'pw:Legend of the Mountain', 'pw:Avalanche of Horns'],
 'newcasters': ['pw:Arcane Ruin', 'pw:Starfall', 'pw:Soul Rend', 'pw:Annihilating Ray', 'pw:Hallowed Fire', 'pw:Sunlance', 'pw:Dawn of Judgement'],
}
RANGED = {'ranger', 'archer'}
# powers and spells that do not exist yet, made up to test the fallback (a name and a type decide the look)
FAKE_MX = {'xf1': ['Ice Spikes', 'front', [['dmg', [10, 20]]]], 'xf2': ['Blizzard', ['area', 4], [['dmg', [10, 20]]]]}
FAKE_PW = {'Fan of Knives': ['Thief', 'multi'], 'Snare Net': ['Ranger', 'shot']}
PARTY = {'heal', 'buff', 'rise'}
def foes_for(id, group):
    if group in RANGED: return [['bandit', 3, 0, 5000, 0], ['bandit', 4, 0, 5000, 1], ['wolf', 3, 0, 5000, -1]]
    if group in ('thief', 'warrior', 'barbarian', 'paladin', 'assassin', 'monk', 'goat'): return [['bandit', 1, 0, 5000, 0], ['wolf', 2, 0, 5000, 1], ['bandit', 2, 0, 5000, -1]]
    return [['bandit', 3, 0, 5000, 0], ['bandit', 4, 0, 5000, 1], ['wolf', 2, 0, 5000, -1]]
def setup_fakes(g, id):
    if id in FAKE_MX:
        n, aim, fx = FAKE_MX[id]
        g.ev("([id,n,aim,fx])=>{if(MX_POWER[id])return;mx('Mage',10,id,n,aim,fx,'test','#a0d0ff',1,1);const s=MX[MX.length-1];MX_POWER[id]={lv:s.lv,act:true,cost:s.cost,type:'mx',name:s.name,d:s.d,col:s.col,mx:s.id,aim:s.aim,fx:s.fx,icn:'sp_'+s.id}}", [id, n, aim, fx])
    if id.startswith('pw:') and id[3:] in FAKE_PW:
        c, t = FAKE_PW[id[3:]]
        g.ev("([n,c,t])=>{const C=CLASSES.find(x=>x.name===c);if(C.powers.some(p=>p.name===n))return;C.powers.push({lv:5,name:n,cost:3,type:t,act:true,d:'test',range:t==='shot'?4:undefined,m:1,n:3})}", [id[3:], c, t])
def run(g, id, group):
    party = group in PARTY
    setup_fakes(g, id)
    g.ev("(o)=>__setup(o)", {'foes': [] if party else foes_for(id, group)})
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
        hud = party or g.ev("()=>SPFX.obj.some(o=>o.h)||SPP.some(p=>p.a&&p.h)")
        frames.append(Image.open(io.BytesIO(g.shot('hud' if hud else 'view'))).convert('RGB'))
    return r, frames
def main(groups):
    g = Game()
    try:
      run_groups(g, groups)
    finally:
      g.close()
def run_groups(g, groups):
    for gr in groups:
        rows = []
        for id in GROUPS[gr]:
            r, fr = run(g, id, gr)
            errs = [l for l in g.logs if l[0] in ('error', 'pageerror')]
            print(gr, id, r, 'errors:', errs[:2], flush=True)
            if fr: rows.append((id, fr))
        if not rows: continue
        sc = .34; cw, ch = int(420 * 2.03 * sc), int(300 * 2.03 * sc) if any(fr[0].size[1] > 500 for _, fr in rows) else int(210 * 2.03 * sc)
        S = Image.new('RGB', (cw * 6, ch * len(rows)))
        d = ImageDraw.Draw(S)
        for ri, (id, fr) in enumerate(rows):
            for ci, im in enumerate(fr): S.paste(im.resize((cw, ch)), (ci * cw, ri * ch))
            d.text((4, ri * ch + 3), id, fill=(255, 255, 0))
        S.save(OUT / f'sheet_{gr}.png'); print('wrote', gr, S.size, flush=True)
    print('console errors:', [l for l in g.logs if l[0] in ('error', 'pageerror')])
    print('fx cost', g.ev("()=>SPFX.stat"))
if __name__ == '__main__':
    main(sys.argv[1:] or list(GROUPS))
