(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};for(const d of L.decor){if(M.bio[d.y*W+d.x]<4)continue;if(/wm_|hgwm/.test(d.k)){o[d.k]=(o[d.k]||0)+1}}
o._h={};for(const k in o)if(k[0]!=='_')o._h[k]=NPC_H[k];
const loc={};for(const d of L.decor){if(M.bio[d.y*W+d.x]<4)continue;if(/wm_/.test(d.k)&&!loc[d.k])loc[d.k]=[d.x,d.y,d.sc,!!d.pic]}o._loc=loc;return o})()
