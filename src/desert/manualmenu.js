/* ==========================================================================
   THE GAME MANUAL. A button on the More page opens the printed booklet (Below-the-Abbey-manual.pdf, beside the game) in a new tab.
   ========================================================================== */
const MANUAL_FILE='Below-the-Abbey-manual.pdf';
(function(){const _d=drawMoreMenu;drawMoreMenu=function(){_d();btnText('manualpdf','Game manual (PDF)',140,212,200,26)}})();
(function(){const _b=handleBtn;handleBtn=function(id){
  if(id==='manualpdf'&&G.menu==='more'){try{window.open(MANUAL_FILE,'_blank')}catch(e){}msg('The manual opens in a new tab.','#a8d8ff');return}
  _b(id)}})();
