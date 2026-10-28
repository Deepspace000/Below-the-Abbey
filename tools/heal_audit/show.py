import json,sys
d=json.load(open(sys.argv[1]))
for r in d['res']:
    print('L',r['level'],r['maxes'])
    for w in r['rows']:
        if not w['avail']: continue
        print('  %-20s cost %s mana %.1f tg %.1f avg %.0f pct %.1f p2030 %s cap %s shown %s gain %s capMana %s full %s/%s low %s/%s dead %s mana %s rev %s desc %s'%(w['name'],w['listed'],w['mana'],w['targets'],w['avgHeal'],w['avgPct'],w.get('pct2030') and round(w['pct2030'],1),w['capOk'],w.get('capShown'),w.get('capGain'),w['capMana'],w['fullCast'],w['fullMana'],w['lowCast'],w['lowMana'],w['deadHealed'],w.get('deadMana'),w['reviveWorked'],w['descPct']))
