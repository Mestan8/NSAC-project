/* Reveals .reveal elements once: the header on load, everything else as it scrolls into view.
   Only static containers carry the class, so content re-rendered inside them never animates again. */
(function(){
"use strict";
const DURATION_MS=900, MAX_DELAY_MS=320, SPARE_MS=200;
const THRESHOLD=.12, BOTTOM_MARGIN_PX=60;

/* Removing the classes returns the element to its plain state, with no animation left filling. */
function settle(el){ el.classList.remove('reveal','reveal-fade','is-in'); }
function show(el){
  if(el.classList.contains('is-in')) return;
  const finish=e=>{ if(!e || e.target===el) settle(el); };
  el.addEventListener('animationend',finish);
  el.addEventListener('animationcancel',finish);
  /* Covers the cases where no animation runs, such as the title after a view transition. */
  setTimeout(finish,DURATION_MS+MAX_DELAY_MS+SPARE_MS);
  el.classList.add('is-in');
}

/* For content a page renders after load, such as a Story Mode chapter: reveals its .reveal elements the
   same way, or with reduced motion simply clears the classes. */
window.SLF_reveal=root=>root.querySelectorAll('.reveal').forEach(settle);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io='IntersectionObserver' in window ? new IntersectionObserver((entries,obs)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ obs.unobserve(en.target); show(en.target); } });
  },{threshold:THRESHOLD,rootMargin:'0px 0px -'+BOTTOM_MARGIN_PX+'px 0px'}) : null;
  /* An element so tall that 12% of it cannot fit on screen would never reach the threshold. */
  const tooTall=el=>el.offsetHeight*THRESHOLD>innerHeight-BOTTOM_MARGIN_PX;
  const reveal=el=>{ if(!io || el.closest('.hero') || tooTall(el)) show(el); else io.observe(el); };
  document.querySelectorAll('.reveal').forEach(reveal);
  window.SLF_reveal=root=>root.querySelectorAll('.reveal').forEach(reveal);
  /* The bottom margin excludes the last strip of the viewport, so something at the very end of a page,
     like the footer, could never cross it. Reaching the end shows whatever is left. */
  const flushAtEnd=()=>{
    if(scrollY+innerHeight<document.documentElement.scrollHeight-BOTTOM_MARGIN_PX) return;
    removeEventListener('scroll',flushAtEnd);
    removeEventListener('load',flushAtEnd);
    document.querySelectorAll('.reveal:not(.is-in)').forEach(el=>{ if(io) io.unobserve(el); show(el); });
  };
  addEventListener('scroll',flushAtEnd,{passive:true});
  addEventListener('load',flushAtEnd);
}
window.SLF_REVEAL_READY=true;
})();
