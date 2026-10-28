p = 'src/desert/blight58_polish.js'
s = open(p, encoding='utf-8').read()
a = "if(a>(o.mud||.7)){fm[y][x]='5';n++}else if(b<(o.bare||.2)){fm[y][x]=(hash2(x,y,seed)<.5)?'1':'2';n++}}"
assert a in s
s = s.replace(a, "if(a>(o.mud||.7)+.1){fm[y][x]='5';n++}else if(a>(o.mud||.7)){fm[y][x]='1';n++}else if(b<(o.bare||.2)){fm[y][x]=(hash2(x,y,seed)<.6)?'2':'1';n++}}")
s = s.replace("{mud:.68,bare:.16}", "{mud:.74,bare:.14}").replace("{mud:.7,bare:.16}", "{mud:.76,bare:.14}")
open(p, 'w', encoding='utf-8').write(s)
