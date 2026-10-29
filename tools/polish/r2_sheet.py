"""python tools/polish/r2_sheet.py out.png dir name name ... : 2-column contact sheet of the top 400 px of each shot"""
import sys
from PIL import Image
out,d=sys.argv[1],sys.argv[2]; names=sys.argv[3:]
ims=[Image.open('%s/%s.png'%(d,f)).crop((0,0,900,420)).resize((450,210)) for f in names]
s=Image.new('RGB',(900,210*((len(ims)+1)//2)))
for i,im in enumerate(ims): s.paste(im,((i%2)*450,(i//2)*210))
s.save(out)
