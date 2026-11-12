/* Scientific References: sortable site table and full source list. */
(function(){
"use strict";
const {S,link,ITEMS,BY,WORLDS}=window.SLF;

/* ---------- Site reference table ---------- */
const ROWS=[];
ITEMS.forEach(it=>ROWS.push({name:it.name,body:WORLDS[it.world].label,mission:it.mission,year:it.year,lat:it.lat,lon:it.lon,type:it.positionType,frame:WORLDS[it.world].frame,src:it.sourceKey,landing:it.landingLat===undefined?'':'landed at '+it.landingLat+', '+it.landingLon}));
const rowsEl=document.getElementById('site-rows'), ths=[...document.querySelectorAll('#site-table th')];
let sortKey='body', sortDir=1;
function renderRows(){
  const k=sortKey, sorted=[...ROWS].sort((a,b)=>{
    const x=a[k], y=b[k];
    return (typeof x==='number' ? x-y : String(k==='src'?S[x][0]:x).localeCompare(String(k==='src'?S[y][0]:y)))*sortDir;
  });
  rowsEl.innerHTML=sorted.map(r=>'<tr><td>'+r.name+'</td><td>'+r.body+'</td><td>'+r.mission+'</td><td class="num">'+r.year+'</td><td class="num">'+r.lat+'</td><td class="num">'+r.lon+'</td><td>'+r.type+(r.landing?'<small>'+r.landing+'</small>':'')+'</td><td>'+r.frame+'</td><td>'+link(r.src)+'</td></tr>').join('');
  ths.forEach(th=>{ if(th.dataset.key===k) th.setAttribute('aria-sort',sortDir>0?'ascending':'descending'); else th.removeAttribute('aria-sort'); });
}
ths.forEach(th=>th.querySelector('.sort').addEventListener('click',()=>{
  const k=th.dataset.key;
  if(sortKey===k) sortDir=-sortDir; else { sortKey=k; sortDir=1; }
  renderRows();
}));

/* ---------- Object photographs ----------
   Credits for the photo under each object's description, in the same format as the title-band credits. */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const url=u=>'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(u)+'</a>';
document.getElementById('photo-credits').innerHTML=ITEMS.filter(it=>it.img).map((it,i)=>{
  const m=it.img, row=(k,v)=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>';
  return '<article class="panel refblock reveal" data-d="'+(i%2+1)+'"><h4 class="panel-title">'+esc(it.name)+'</h4><dl>'+
    row('Title',esc(m.title))+row('Image ID',esc(m.imageId))+row('Taken by',esc(m.by))+row('Shows',esc(m.caption))+
    row('Source',url(m.source))+row('Original file',url(m.original))+row('Credit',esc(m.credit))+row('Processing',esc(m.processing))+
    '</dl></article>';
}).join('');

/* ---------- Full source list ---------- */
document.getElementById('src-list').innerHTML=Object.keys(S).map(k=>'<li>'+link(k)+'</li>').join('');

renderRows();
})();
