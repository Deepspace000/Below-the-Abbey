import sys,os
from PIL import Image,ImageDraw
H=os.path.dirname(os.path.abspath(__file__))
# usage: r4sheet.py out.png name1 name2 ... (names in r4_shots, no .png); 2 columns of 3D view crops at 600x306
out=sys.argv[1];names=sys.argv[2:];cw,ch=600,306;cols=2;rows=(len(names)+1)//2
S=Image.new('RGB',(cw*cols,ch*rows))
for i,n in enumerate(names):
    im=Image.open(os.path.join(H,'r4_shots',n+'.png')).convert('RGB').crop((0,0,960,490)).resize((cw,ch))
    ImageDraw.Draw(im).text((6,4),n,fill=(255,255,0))
    S.paste(im,((i%cols)*cw,(i//cols)*ch))
S.save(os.path.join(H,'r4_shots',out))
