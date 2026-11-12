/* Runs in <head>, before anything paints.
   The js class is what allows elements to start hidden, so without this script nothing is ever hidden. */
(function(){
"use strict";
const root=document.documentElement;
root.classList.add('js');
/* pagereveal has to be registered before the first frame, which is why it is here and not in reveal.js. */
window.addEventListener('pagereveal',e=>{ if(e.viewTransition) root.classList.add('vt-arrived'); });
/* If reveal.js did not load or threw, nothing would ever show the hidden content. */
window.addEventListener('load',()=>{ if(!window.SLF_REVEAL_READY) root.classList.remove('js'); });
})();
