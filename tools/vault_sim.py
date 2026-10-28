"""Boss balance for the Vault of Maldrake: plays N fights of a level 89 party in jump gear against a boss with the game's real heroAttack, heroSpecial, enemyAct and finishRound.
    python tools/vault_sim.py [boss] [fights] [boss level] [party level]      boss: vtmaldrake (default), vtsilver, vtwarden, or a graveyard boss such as gyaldric for comparison
Same method as the graveyard bosses: the party drinks at 38 percent health and a healer heals at 55 percent; the script never wastes a turn, so it is a little harder than a person is.
Prints the win rate, the average number of rounds and how many heroes are lost. Needs your own server (python -m http.server 8473)."""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('VT_PORT', '8473')
CHROME = os.environ.get('BTA_CHROME') or os.environ.get('VT_CHROME') or 'C:/Program Files/Google/Chrome/Application/chrome.exe'
boss = sys.argv[1] if len(sys.argv) > 1 else 'vtmaldrake'
N = int(sys.argv[2]) if len(sys.argv) > 2 else 10
LV = int(sys.argv[3]) if len(sys.argv) > 3 else {'vtmaldrake': 89, 'vtsilver': 89, 'vtwarden': 88}.get(boss, 84)
PL = int(sys.argv[4]) if len(sys.argv) > 4 else LV   # the party's level (default: the boss's)
JS = """async ([boss,N,lv]) => {
  const out = {fights: [], boss, log: []}; const _msg = msg; msg = function(t, c) { if (out.log.length < 400) out.log.push(t); return _msg.apply(this, arguments) }; const wait = ms => new Promise(r => setTimeout(r, ms));
  G.menu = false; G.talk = null; goToLevel(%d, {x:12, y:15, f:0}); await wait(2500); G.talk = null;
  for (let n = 0; n < N; n++) {
    G.enemies = []; G.heroes.forEach((h, i) => { h.alive = true; h.hp = h.max; h.mp = h.mpMax; try { G.aff = [] } catch (e) {} });
    G.P.x = 12; G.P.y = 12; G.P.f = 0; G.buffs = []; G.bag = G.bag.filter(b => true);
    addEnemy(boss, 12, 11, true); const e = G.enemies[G.enemies.length - 1]; e.lvl = lv; e.base = lv; e.fixed = LEVEL; e.maxhp = enemyStat(boss, lv).hp; e.hp = e.maxhp; e.vtPh = 0; e.vtSum = 0;
    const M0 = e.maxhp; let rounds = 0, drinks = 0, healed = 0, lost = 0;
    while (e.hp > 0 && G.heroes.some(h => h.alive && h.hp > 0) && rounds < 150) {
      rounds++;
      for (let i = 0; i < 4; i++) {
        const h = G.heroes[i]; if (!h.alive || h.hp <= 0) continue;
        const P = curPower(i), cls = HERO_DEF[i].cls;
        // heal: the healer when somebody is under 55 percent, anybody drinks under 38 percent
        const hurt = G.heroes.filter(x => x.alive && x.hp > 0 && x.hp / x.max < .55).length;
        let acted = false;
        if (P && (P.type === 'heal' || /heal|prayer|mend|restor/i.test(P.name || '')) && hurt && h.mp >= (specialInfo(i).cost || 1)) { try { acted = heroSpecial(i); healed++ } catch (x) {} }
        if (!acted && h.hp / h.max < .38 && G.bag.some(b => idef(b).heal)) { try { const idx = bestPotionIndex(i); if (idx >= 0) { useHeal(i, idx); acted = true; drinks++ } } catch (x) {} }
        if (!acted) { try { const sp = specialInfo(i); if (P && P.act !== false && h.mp >= (sp.cost || 99) && P.type !== 'heal') acted = heroSpecial(i) } catch (x) {} }
        if (!acted) { try { heroAttack(i) } catch (x) {} }
        if (e.hp <= 0) break;
      }
      if (e.hp <= 0) break;
      for (const q of G.enemies.filter(z => z.hp > 0)) { try { enemyAct(q) } catch (x) { out.err = String(x) } }
      G.rounds++; try { finishRound() } catch (x) {} G.state = 'play';
      for (const h of G.heroes) if (h.hp <= 0 && h.alive) h.alive = false;
    }
    const dead = G.heroes.filter(h => !h.alive || h.hp <= 0).length;
    out.fights.push({ win: e.hp <= 0, rounds, drinks, dead, bossHp: M0, left: Math.round(Math.max(0, e.hp) / M0 * 100) });
    G.state = 'play';
  }
  out.party = G.heroes.map(h => [HERO_DEF[G.heroes.indexOf(h)].cls, h.lvl, h.max, Math.round(heroArmor(h))]);
  return out }""" % 9677
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=CHROME)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=vaultboss&lvl=%d&v=%d' % (PORT, PL, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9670", timeout=150000)
    pg.wait_for_timeout(3000)
    r = pg.evaluate(JS, [boss, N, LV])
    f = r['fights']
    print('party', r.get('party'))
    wins = sum(1 for x in f if x['win'])
    print('%s: %d of %d won; rounds %s; heroes lost %s; potions %s' % (boss, wins, len(f), [x['rounds'] for x in f], [x['dead'] for x in f], [x['drinks'] for x in f]))
    print('boss health left in the lost fights:', [x['left'] for x in f if not x['win']])
    if os.environ.get('VT_LOG'):
        print(chr(10).join(r['log'][:int(os.environ.get('VT_LOG'))]))
    print('errors', errs[:5], r.get('err'))
    b.close()
