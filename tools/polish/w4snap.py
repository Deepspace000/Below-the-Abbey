import sys,json,os
sys.path.insert(0,'tools/polish')
import w4lib
n=sys.argv[1]
p=os.path.abspath('tools/polish/w4_shots/%s.png'%n)
# take a screenshot without moving: shot op with tx,ty uses nearest open cell, so use a no-op eval then shot via a 'shotraw'
r=w4lib.run({'op':'shotraw','path':p})
print(r)
