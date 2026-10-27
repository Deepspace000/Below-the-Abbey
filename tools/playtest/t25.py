from common import *
r=Run();r.budget=60000;r.start(False)
print(r.ev("[1,2,3,5,8,10,13,16,19,22,25,28,31,35,40,50,60,70,79].map(l=>l+':'+xpNeed(l)).join(' ')"))
print(r.ev("[4,7,10,13,16,19,22,25,28,31,34,40,50].map(l=>l+':'+enemyStat('skel',l).xp+'/'+enemyStat('wolf',l).xp).join(' ')"))
r.close()
