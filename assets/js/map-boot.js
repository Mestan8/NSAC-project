/* Runs as the first thing in <body>, before any themed content exists, so the correct planet's colors
   are in place for the first paint. */
(function(){
"use strict";
const {BY,WORLDS}=window.SLF;
const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const params=new URLSearchParams(location.search);
const askedWorld=params.get('world'), askedObject=params.get('object');
const objectKnown=has(BY,askedObject);
/* A valid world always wins. An object on its own still identifies its world. */
const world=has(WORLDS,askedWorld) ? askedWorld : objectKnown ? BY[askedObject].world : 'moon';
const object=objectKnown && BY[askedObject].world===world ? askedObject : null;

document.body.dataset.world=world;
if(!(window.CSS && CSS.registerProperty)) document.documentElement.classList.add('no-at-property');
window.SLF.initialMap={world,object};
})();
