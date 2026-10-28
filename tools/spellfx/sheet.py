import sys
from PIL import Image
def sheet(files,out,cols=3,scale=.6):
    ims=[Image.open(f).convert('RGB') for f in files]
    w,h=ims[0].size;cw,ch=int(w*scale),int(h*scale);rows=(len(ims)+cols-1)//cols
    S=Image.new('RGB',(cw*cols,ch*rows))
    for i,im in enumerate(ims):S.paste(im.resize((cw,ch)),((i%cols)*cw,(i//cols)*ch))
    S.save(out);return S.size
if __name__=='__main__':
    out=sys.argv[1];cols=int(sys.argv[2]);sc=float(sys.argv[3]);print(sheet(sys.argv[4:],out,cols,sc))
