import sys
from c2lib import *
j=ev('c2_ascii.js',list(map(int,sys.argv[1:5])));print(j.get('r') or j)
