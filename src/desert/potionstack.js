/* ==========================================================================
   ALL POTIONS STACK. Healing, mana, life and the other draughts already stacked in the bag; nine did not (the Antidote, the Cleansing Salve, Holy Water, Sleeping Tea, the Potions of
   Red, Blue, Green and Yellow, and the Potion of Escape), so each took a slot of its own. Now every potion stacks. Bags that already hold single ones keep them as they are;
   new ones join a stack. Last in the injection order, so it sees every potion that the other files define.
   ========================================================================== */
for(const id in ITEMDEF){const d=ITEMDEF[id];if(d&&(d.k==='potion'||d.t==='Potion'))d.stack=1}
