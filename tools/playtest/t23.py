from common import *
r=Run();r.budget=60000;r.start(True)
run_stages(r,[('ih_report',st_ih_report),('ih_mines',st_ih_mines),('ih_escape',st_ih_escape),('pass',st_pass)])
print(r.ev("PT.talklog.slice(-2)"))
print(r.ev("PT.msgs.slice(-8)"))
print(r.ev("[LEVEL,G.state,!!G.cut]"))
r.close()
