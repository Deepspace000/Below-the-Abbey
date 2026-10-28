(()=>{const out={};for(const id of ['hgdgem_amber','hgdgem_amethyst','hgdgem_emerald','hgdgem_pearl','hgdgem_ruby','hgdgem_sapphire','hgdkey_blue','hgdkey_gold','hgdkey_green','hgdkey_red','hgdlantern','hgdshard']){const a=IMG['icn_'+id],b=IMG['it_'+id],c=IMG['ic_'+id];out[id]=[a&&a.width,b&&b.width,b===a,c===a,b&&b.src&&b.src.slice(-26)]}
out.ore=IMG.icn_ore&&IMG.icn_ore.width;return out})()
