"""Witch's Wood quest-flow test: python tools/ww_flow.py  (server on port 8374). Runs the eight quests of 'Into the Oven' with the real game functions, the boss fight, the oven and the aftermath."""
import json, time, sys
from playwright.sync_api import sync_playwright
HELP = r"""
window.$n=(id,d)=>{const n=NPCS[id];return n.root(d||G.decor.find(q=>q.npc===id)||{})};
window.$pick=(node,label)=>{const o=node.opts.find(o=>(typeof o[0]==='string')&&o[0].toLowerCase().includes(label.toLowerCase()));if(!o)throw new Error('no option '+label+' in '+JSON.stringify(node.opts.map(o=>o[0]))+' :: '+node.text.slice(0,60));return o[1]()};
window.$d=id=>G.decor.find(q=>q.npc===id);
window.$q=()=>Object.keys(G.quests).filter(k=>/^wwq/.test(k)).map(k=>k+':'+G.quests[k].st).join(' ');
window.$give=(giver,qid,prevOk)=>{const node=$n(giver);if(!node)throw new Error('no node '+giver);const r=$pick(node,'help');return $q()};
window.$turn=(giver,qid)=>{const node=$n(giver);const r=$pick(node,'here');return qSt(qid)};
;0
"""
steps = []
def run(pg, js):
    r = pg.evaluate(js)
    return r
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8374/index.html?town=witchwood&lvl=82&v=%d' % time.time())
    pg.wait_for_timeout(7000)
    pg.evaluate(HELP)
    def J(js):
        try:
            return pg.evaluate(js)
        except Exception as e:
            print('FAIL', js[:150], str(e)[:300]); errs.append('FAIL'); return None
    pg.evaluate("()=>{goToLevel(496,{x:38,y:5,f:0})}"); pg.wait_for_timeout(8000)
    # Wenlock: the lane, the gate, Marrow
    print('wenlock', J("()=>{goToLevel(496,{x:38,y:5,f:0});return [LEVEL,!!$d('wwo_marrow'),!!$d('wwo_lanesign'),QGIVER.wwo_marrow]}"))
    print('gate tile', J("()=>{const g=LEVELS[496];const c=g.chars[g.rows[2][38]];return [c,!!KH_DOOR[c],KH_DOOR[c]&&KH_DOOR[c].lvl,KH_DOOR[c]&&JSON.stringify(KH_DOOR[c].at)]}"))
    print('walk to gate', J("()=>{G.P.x=38;G.P.y=3;G.P.f=0;doMove(0);return new Promise(r=>setTimeout(()=>r([LEVEL,G.P.x,G.P.y]),1500))}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q1 offer', J("()=>{const n=$n('wwo_marrow');return n.text.slice(0,50)+'|'+n.opts.map(o=>o[0])}"))
    print('Q1 accept', J("()=>{$pick($n('wwo_marrow'),'help');return $q()}"))
    # the wood clues
    J("()=>{goToLevel(520,{x:27,y:52,f:0})}")
    print('clues', J("()=>{for(const id of ['wwo_boot','wwo_ribbon','wwo_crumbs'])$n(id);return [G.flags.wwBoot,G.flags.wwRibbon,G.flags.wwCrumbs,qGoal('wwq1'),qReady('wwq1')]}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q1 turn in', J("()=>{$pick($n('wwo_marrow'),'found');return $q()+' gold '+G.gold+' xp '+G.heroes[0].xp}"))
    # Q2 Goody Prue
    print('Q2 offer', J("()=>{const n=$n('wlo_gran');return n.text.slice(0,40)+'|'+n.opts.map(o=>o[0])}"))
    print('Q2 accept', J("()=>{$pick($n('wlo_gran'),'help');return $q()}"))
    print('Q2 gifts', J("()=>{$n('wlo_friar');$n('wlo_smith');return [G.flags.wwSalt,G.flags.wwIron,bagCount('wwsalt'),bagCount('wwhorseshoe'),qReady('wwq2')]}"))
    print('Q2 turn in', J("()=>{$pick($n('wlo_gran'),'both');return $q()}"))
    # Q3 Moss: first the wood
    print('Q3 accept', J("()=>{$pick($n('wlo_gravedigger'),'help');return $q()}"))
    J("()=>{goToLevel(520,{x:27,y:52,f:0})}")
    print('Q3 items', J("()=>{$n('wwo_hagstone');$n('wwo_rowan');return [bagCount('wwhagstone'),bagCount('wwrowan'),qReady('wwq3')]}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q3 turn in', J("()=>{$pick($n('wlo_gravedigger'),'four');return $q()+' charm '+G.flags.wwCharm+' bag '+bagCount('wwcharm')}"))
    # Q4 Tuck
    print('Q4 accept', J("()=>{$pick($n('wlo_friar'),'help');return $q()}"))
    J("()=>{goToLevel(520,{x:27,y:52,f:0})}")
    print('Q4 totems', J("()=>{const out=[];for(const i of [1,2,3]){const n=$n('wwo_totem'+i);out.push($pick(n,'smash').text.slice(0,30))}return [out.length,G.flags.wwT1,G.flags.wwT2,G.flags.wwT3,G.enemies.filter(e=>e.t==='wwcrow').length,qReady('wwq4')]}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q4 turn in', J("()=>{$pick($n('wlo_friar'),'down');return $q()}"))
    # Q5 Fudge
    print('Q5 accept', J("()=>{$pick($n('wlo_watch'),'help');return $q()}"))
    J("()=>{goToLevel(520,{x:27,y:20,f:0})}")
    print('Q5 kill abom', J("()=>{const e=G.enemies.find(q=>q.t==='wwabom');if(!e)return 'none';hurtEnemy(e,e.hp+1);return [e.hp,G.flags.wwKeyGot,bagCount('wwkey'),G.flags.wwCellarOpen,qReady('wwq5')]}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q5 turn in', J("()=>{$pick($n('wlo_watch'),'key');return $q()}"))
    # Q6 Marrow cages
    print('Q6 accept', J("()=>{$pick($n('wwo_marrow'),'help');return $q()}"))
    print('cottage door locked? (wards down so open)', J("()=>{goToLevel(520,{x:27,y:1,f:0});const g=LEVELS[520].chars[LEVELS[520].rows[0][27]];const ok=KH_DOOR[g].lvl;goToLevel(521,KH_DOOR[g].at);return [LEVEL,ok,JSON.stringify(G.P)]}"))
    print('witch NPC in parlour', J("()=>[!!$d('wwo_grisselda'),$d('wwo_grisselda').found,G.enemies.length]"))
    print('cellar via portal', J("()=>{const p=G.portals[1];return [JSON.stringify(p),G.flags.wwCellarOpen]}"))
    J("()=>{goToLevel(522,{x:7,y:7,f:0})}")
    print('cages', J("()=>{const o=[];for(const i of [1,2,3]){const n=$n('wwo_cage'+i);o.push($pick(n,'open').text.slice(0,20))}return [o.length,G.flags.wwFreedN,G.flags.wwHostile,qReady('wwq6')]}"))
    print('button', J("()=>{$pick($n('wwo_button'),'untie');return G.flags.wwButton}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q6 turn in', J("()=>{$pick($n('wwo_marrow'),'open');return $q()+' pip visible '+!$d('wwo_pip').found}"))
    # Q7 mayor
    print('Q7 accept', J("()=>{const n=$n('wlo_mayor');return n.text.slice(0,40)+'|'+n.opts.map(o=>o[0])}"))
    print('Q7 accept2', J("()=>{$pick($n('wlo_mayor'),'help');return $q()}"))
    # the fight: parlour
    J("()=>{goToLevel(521,{x:8,y:9,f:0})}")
    print('witch hostile in parlour', J("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);return e?[e.lvl,e.maxhp,e.hp,$d('wwo_grisselda').found]:'no witch'}"))
    print('witch acts', J("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);const out=[];e.alert=true;for(let i=0;i<12;i++){e.x=8;e.y=6;out.push(enemyAct(e))}return [out.join(','),G.enemies.filter(q=>q.summoned&&q.hp>0).length,JSON.stringify(Object.keys(G.aff||{}).length)]}"))
    print('witch hurt to flee', J("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);hurtEnemy(e,Math.floor(e.maxhp*.3));const a=[e.hp,e.maxhp,G.flags.wwFled];hurtEnemy(e,Math.floor(e.maxhp*.3));return a.concat([e.hp,e.hp<=0,G.flags.wwFled,G.flags.wwHpFrac])}"))
    J("()=>{goToLevel(523,{x:6,y:7,f:0})}")
    print('kitchen witch', J("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);return e?[e.hp/e.maxhp,e.x,e.y]:'none'}"))
    print('kitchen hurt', J("()=>{const e=G.enemies.find(q=>q.t==='wwwitch'&&q.hp>0);hurtEnemy(e,e.maxhp);return [e.hp,G.flags.wwCornered,$d('wwo_witchc').found,qGoal('wwq7')]}"))
    print('oven dialog cornered', J("()=>{const n=$n('wwo_oven');return n.text.slice(0,40)}"))
    print('push', J("()=>{let n=$n('wwo_witchc');n=$pick(n,'push her');n=$pick(n,'push');n=$pick(n,'listen');const r=$pick(n,'leave');return [r,G.flags.wwDead,$d('wwo_witchc').found,qReady('wwq7'),!$d('wwo_recipe').found]}"))
    print('no respawn', J("()=>{goToLevel(521,{x:8,y:9,f:0});const a=G.enemies.some(q=>q.t==='wwwitch'&&q.hp>0);goToLevel(523,{x:6,y:7,f:0});return [a,G.enemies.some(q=>q.t==='wwwitch'&&q.hp>0),!$d('wwo_witchc').found?'hidden':'shown']}"))
    print('recipe', J("()=>{$n('wwo_recipe');return [G.flags.wwRecipe,bagCount('wwrecipe')]}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('Q7 turn in', J("()=>{const xp0=G.gold;$pick($n('wlo_mayor'),'oven');return $q()+' ring '+bagCount('wwring')+' gold '+G.gold}"))
    print('Q8 accept', J("()=>{$pick($n('wlo_gran'),'help');return $q()}"))
    print('Q8 turn in', J("()=>{$pick($n('wlo_gran'),'book');return $q()+' stall '+G.flags.wwStall+' hat '+bagCount('wwhat')}"))
    J("()=>{goToLevel(496,{x:38,y:5,f:0})}")
    print('after', J("()=>[!$d('wwo_gingerstall').found,!$d('wwo_pip').found,$n('wlo_boy').text.slice(0,40),$n('wwo_gingerstall').text.slice(0,30)]"))
    print('xp total', J("()=>{let t=0;for(const k of Object.keys(WW_REW)){t+=WW_REW[k].xp*2}return t}"))
    print('ERRS', errs[:12])
    b.close()
