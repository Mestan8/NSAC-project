/* Shared header: title, page selector and the one-line description of the current page.
   Loaded directly after the empty <header>, so it is in place before the page first paints. */
(function(){
"use strict";
const PAGES=[
  {id:'map',href:'index.html',label:'The Map Explorer',blurb:'Spin the Moon and Mars and find the hardware NASA left behind, each piece placed at its published location.'},
  {id:'story',href:'story.html',label:'The Story Mode',blurb:'Follow the things NASA left behind, from 1967 to today, one chapter at a time.'},
  {id:'references',href:'references.html',label:'Scientific References',blurb:'Every coordinate, map credit, and source behind this project.'}
];
const current=document.body.dataset.page;
const links=PAGES.map(p=>'<li><a href="'+p.href+'"'+(p.id===current?' aria-current="page"':'')+'>'+p.label+'</a></li>').join('');
const page=PAGES.find(p=>p.id===current);
/* Title-band photos, one band per page. The Map Explorer has one photo per world: map-boot.js has already set
   body[data-world], so CSS shows the right one at once. Each page preloads its photo in <head>. */
const BANDS={
  map:[{cls:'band-moon',src:'assets/title-bands/moon-artemis2-art002e010032.webp'},{cls:'band-mars',src:'assets/title-bands/mars-curiosity-pia19803.webp'}],
  story:[{cls:'band-story band-solo',src:'assets/title-bands/story-earthrise-as08-14-2383.webp'}],
  references:[{cls:'band-references band-solo',src:'assets/title-bands/references-lro-tycho-peak.webp'}]
};
const header=document.getElementById('site-header'), photos=BANDS[current]||[];
if(photos.length) header.classList.add('has-band');
const band=photos.length
  ? '<div class="title-band" aria-hidden="true">'+photos.map(p=>'<img class="band-img '+p.cls+'" src="'+p.src+'" alt="" decoding="sync">').join('')+'</div>'
  : '';
header.innerHTML=band+
  '<div class="wrap"><h1 class="reveal" data-d="1">Space <em>Lost</em> &amp; Found</h1>'+
  '<nav class="page-nav reveal" data-d="2" aria-label="Pages"><ul>'+links+'</ul></nav>'+
  '<p class="sub reveal" data-d="3">'+page.blurb+'</p></div>';
})();
