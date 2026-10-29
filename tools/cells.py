"""print a cells= argument: python tools/cells.py W H cols rows [inset]"""
import sys
W,H,c,r=map(int,sys.argv[1:5]);m=int(sys.argv[5]) if len(sys.argv)>5 else 14
print(';'.join('%d,%d,%d,%d'%(i*W//c+m,j*H//r+m,(i+1)*W//c-m,(j+1)*H//r-m) for j in range(r) for i in range(c)))
