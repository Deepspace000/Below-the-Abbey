"""Builds deaths.json and PLAYTEST_REPORT.md from state.json (+ bugs.json, notes.json kept by hand)."""
import json,os,collections,time
D=os.path.dirname(os.path.abspath(__file__))
st=json.load(open(os.path.join(D,'state.json'),encoding='utf8'))
res,pt=st['res'],st['pt']
bugs=json.load(open(os.path.join(D,'bugs.json'),encoding='utf8')) if os.path.exists(os.path.join(D,'bugs.json')) else []
notes=json.load(open(os.path.join(D,'notes.json'),encoding='utf8')) if os.path.exists(os.path.join(D,'notes.json')) else {}
names=json.load(open(os.path.join(D,'areanames.json'),encoding='utf8')) if os.path.exists(os.path.join(D,'areanames.json')) else {}
# ---- deaths per area
per=collections.OrderedDict()
for d in pt['deaths']:
    a=per.setdefault(d['area'],{'area':d['area'],'name':d.get('areaName',''),'hero_deaths':0,'wipes':0,'killers':collections.Counter(),'avg':[]})
    a['hero_deaths']+=1;a['killers'][f"{d['killer']} L{d['killerLvl']}"]+=1;a['avg'].append(d['avgLvl'])
for w in pt['wipes']:
    a=per.setdefault(w['area'],{'area':w['area'],'name':w.get('areaName',''),'hero_deaths':0,'wipes':0,'killers':collections.Counter(),'avg':[]})
    a['wipes']+=1
rows=[]
for a in per.values():
    rows.append({'area':a['area'],'name':a['name'],'hero_deaths':a['hero_deaths'],'wipes':a['wipes'],'top_killers':a['killers'].most_common(4),'party_avg_level_range':[min(a['avg']),max(a['avg'])] if a['avg'] else None})
rows.sort(key=lambda r:(-r['wipes'],-r['hero_deaths']))
json.dump({'deaths':pt['deaths'],'wipes':pt['wipes'],'per_area':rows},open(os.path.join(D,'deaths.json'),'w',encoding='utf8'),indent=1)
def hms(s):
    s=int(s);return '%dh %02dm'%(s//3600,(s%3600)//60) if s>=3600 else '%dm %02ds'%(s//60,s%60)
out=[]
w=out.append
w('# Below the Abbey, automated playtest report\n')
w('Game version %s. Playtester: Python Playwright harness in `tools/playtest/` (`lib.js` bot, `common.py` stages, `h.py` runner, `state.json` resumable save, `deaths.json`, `report.py`).\n'%notes.get('version','3.640'))
w('## Starting conditions\n')
for l in notes.get('start',['A true new game: default party (Sigrid warrior, Gruff thief, Sorcha mage, Wulfric priest), no cheats, no god mode, no free gold, xp or items, fixed (non scaling) world, no jump links.']): w('- '+l)
w('\n## Summary numbers\n')
tot_h=pt['stats'];stages=res['stages']
human=sum(s['human_s'] for s in stages)
w('| | |\n|---|---|')
w('| Stages completed | %d |'%len(stages))
w('| Total wall clock of the harness (sum over all processes, headless, game clock driven directly) | %s |'%hms(res.get('wall',0)))
w('| Estimated human playing time (new game to the furthest point reached) | %s |'%hms(human))
w('| Hero deaths | %d |'%len(pt['deaths']))
w('| Party wipes (game reloaded from its autosave) | %d |'%len(pt['wipes']))
w('| Combat rounds played | %d |'%tot_h['rounds'])
w('| Steps walked | %d |'%tot_h['steps'])
w('| Dialogue pages | %d (%d characters) |'%(tot_h['talkNodes'],tot_h['talkChars']))
w('| Shop transactions | %d |'%tot_h['shopTx'])
w('| Kills | %d |'%tot_h['kills'])
w('\nHuman time estimate: 1 s per step walked, 0.5 s per turn, 3 s per combat round, dialogue read at 15 characters per second plus 1.5 s per page, 12 s per shop transaction, 4 s per rest. Retries after a wipe count in full (a player repeats them too). Time spent in `skipped` steps is not counted.\n')
w('## Stages (in play order)\n')
w('| # | Stage | Area start > end | Hero lv start > end | Hero deaths | Wipes | Gold end | Wall | Human est. | Notes |\n|---|---|---|---|---|---|---|---|---|---|')
for i,s in enumerate(stages,1):
    n=s.get('out')
    flag=''
    if s.get('giveup'): flag='GAVE UP'
    w('| %d | %s | %s > %s | %s > %s | %d | %d | %d | %s | %s | %s |'%(i,s['name'],s.get('area_start','?'),s.get('area_end','?'),'/'.join(map(str,s['lvl_start'])),'/'.join(map(str,s['lvl_end'])),s['hero_deaths'],s['wipes'],s['gold'],hms(s['wall']),hms(s['human_s']),flag))
w('\n## Deaths per area (worst first)\n')
w('| Area | Name | Wipes | Hero deaths | Party avg level | Top killers |\n|---|---|---|---|---|---|')
for r in rows:
    w('| %s | %s | %d | %d | %s | %s |'%(r['area'],r['name'],r['wipes'],r['hero_deaths'],('%s to %s'%tuple(r['party_avg_level_range'])) if r['party_avg_level_range'] else '-',', '.join('%s x%d'%k for k in r['top_killers'])))
w('\n## Fallbacks, skips and unreachable steps (every one is a finding)\n')
for f in pt.get('fallbacks',[]): w('- area %s: %s %s'%(f.get('lvl'),f.get('reason'),('('+f['fallback']+')') if f.get('fallback') else ''))
w('\n## Purchases\n')
w('| Area | Party avg lvl | Item | For | Price | Gold left |\n|---|---|---|---|---|---|')
for p in pt['purchases']:
    if ITEM_IS_GEAR(p) if False else True: w('| %s | %s | %s | %s | %s | %s |'%(p.get('area'),p.get('avg'),p.get('it'),p.get('for','party'),p.get('price'),p.get('goldLeft')))
w('\n## Quest log (accepted, handed in)\n')
w('| Quest | Change | Area | Given by or to | Party avg lvl | Gold after |\n|---|---|---|---|---|---|')
for q in pt['qlog']: w('| %s | %s | %s | %s | %s | %s |'%(q['q'],q['change'],q['lvl'],q.get('who'),q.get('avg'),q.get('gold')))
w('\n## Bugs and findings\n')
for i,b in enumerate(bugs,1):
    w('### %d. [%s] %s\n'%(i,b['sev'],b['title']));w(b['text']+'\n')
if 'analysis' in notes:
    w('\n## Levelling analysis\n');w(notes['analysis'])
open(os.path.join(D,'PLAYTEST_REPORT.md'),'w',encoding='utf8').write('\n'.join(out))
print('report written',len(out),'lines')
