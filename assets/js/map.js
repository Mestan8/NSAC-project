/* The Map Explorer: globe renderer, markers, popup, world switch and theme. */
(function(){
"use strict";
const {S,link,ITEMS,BY,WORLDS}=window.SLF;
const DEG = Math.PI/180, TAU = Math.PI*2;
const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Map textures ----------
   Each mosaic is decoded to raw pixels once. getImageData needs a same-origin image, so the page has to be
   served over HTTP; on file:// it throws a SecurityError, which is reported in the viewport. */
const TEX={moon:null,mars:null}, TEX_LOADING={};
function loadTexture(w){
  if(TEX[w]) return Promise.resolve(TEX[w]);
  if(TEX_LOADING[w]) return TEX_LOADING[w];
  TEX_LOADING[w]=new Promise((resolve,reject)=>{
    const im=new Image();
    im.onload=()=>whenThemeSettled(()=>{
      try{
        const c=document.createElement('canvas'); c.width=im.naturalWidth; c.height=im.naturalHeight;
        const x=c.getContext('2d',{willReadFrequently:true});
        x.drawImage(im,0,0);
        const d=x.getImageData(0,0,c.width,c.height);
        TEX[w]={w:c.width,h:c.height,data:d.data};
        resolve(TEX[w]);
      }catch(e){ reject(e); }
    });
    im.onerror=()=>reject(new Error('The map file could not be loaded.'));
    im.src=WORLDS[w].file;
  }).finally(()=>{ delete TEX_LOADING[w]; });
  return TEX_LOADING[w];
}

/* ---------- Globe ---------- */
const stage=document.getElementById('stage'), canvas=document.getElementById('globe'), ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'), octx=overlay.getContext('2d');
const pinsEl=document.getElementById('pins'), statusEl=document.getElementById('map-status');
const RF=.92, ZMIN=1, ZMAX=64;
const views={moon:{...WORLDS.moon.view}, mars:{...WORLDS.mars.view}};
const initial=window.SLF.initialMap;
let world=initial.world, pendingObject=initial.object, sel=null, marks=[], cssSize=0, N=0, img=null, dirty=true, tween=null, lastInteract=0, roughDrawn=false, showGrid=false, hoverKey=null, opener=null;

function resize(){
  cssSize=stage.clientWidth||400;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);
  N=Math.min(1100,Math.max(200,Math.round(cssSize*dpr)));
  canvas.width=N; canvas.height=N; overlay.width=N; overlay.height=N;
  img=ctx.createImageData(N,N); dirty=true;
}
const wrapLon=l=>{ const v=((l+180)%360+360)%360-180; return v===-180?180:v; };

function drawGlobe(step){
  const tex=TEX[world]; if(!tex) return;
  const d=img.data, T=tex.data, W=tex.w, H=tex.h, v=views[world];
  const R=N/2*RF*v.zoom, c=N/2, lat0=v.lat*DEG, lon0=v.lon*DEG, sl=Math.sin(lat0), cl=Math.cos(lat0), lim=(1+1/R)*(1+1/R);
  d.fill(0);
  for(let py=0;py<N;py+=step){
    const y=(c-py-step/2)/R;
    for(let px=0;px<N;px+=step){
      const x=(px+step/2-c)/R, r2=x*x+y*y;
      if(r2>lim) continue;
      const r=Math.sqrt(r2);
      const aa=Math.max(0,Math.min(1,(1-r)*R+.5)); if(aa<=0) continue;
      const z=Math.sqrt(Math.max(0,1-Math.min(r2,.9999)));
      let s=z*sl+y*cl; s=s>1?1:s<-1?-1:s;
      const lat=Math.asin(s), lon=lon0+Math.atan2(x,z*cl-y*sl);
      /* Texture column i covers lon (i+.5)/W*360-180, so 0 deg longitude is the raster center. */
      let fu=(lon/TAU+.5)*W-.5; fu-=Math.floor(fu/W)*W;
      let fv=(.5-lat/Math.PI)*H-.5; if(fv<0) fv=0; else if(fv>H-1.001) fv=H-1.001;
      const i0=fu|0, j0=fv|0, du=fu-i0, dv=fv-j0, i1=(i0+1)%W;
      const a=(j0*W+i0)*4, b=(j0*W+i1)*4, e=((j0+1)*W+i0)*4, f=((j0+1)*W+i1)*4;
      const r0=T[a]+(T[b]-T[a])*du, r1=T[e]+(T[f]-T[e])*du, g0=T[a+1]+(T[b+1]-T[a+1])*du, g1=T[e+1]+(T[f+1]-T[e+1])*du, b0=T[a+2]+(T[b+2]-T[a+2])*du, b1=T[e+2]+(T[f+2]-T[e+2])*du;
      const cr=r0+(r1-r0)*dv, cg=g0+(g1-g0)*dv, cb=b0+(b1-b0)*dv, alpha=aa*255;
      for(let yy=py;yy<Math.min(N,py+step);yy++) for(let xx=px;xx<Math.min(N,px+step);xx++){
        const o=(yy*N+xx)*4; d[o]=cr; d[o+1]=cg; d[o+2]=cb; d[o+3]=alpha;
      }
    }
  }
  ctx.putImageData(img,0,0);
}
function project(lat,lon){
  const v=views[world], la=lat*DEG, dl=(lon-v.lon)*DEG, l0=v.lat*DEG;
  return {x:Math.cos(la)*Math.sin(dl), y:Math.cos(l0)*Math.sin(la)-Math.sin(l0)*Math.cos(la)*Math.cos(dl), z:Math.sin(l0)*Math.sin(la)+Math.cos(l0)*Math.cos(la)*Math.cos(dl)};
}
function unproject(cx,cy){
  const v=views[world], Rc=cssSize/2*RF*v.zoom, x=(cx-cssSize/2)/Rc, y=(cssSize/2-cy)/Rc, r2=x*x+y*y;
  if(r2>1) return null;
  const z=Math.sqrt(1-r2), l0=v.lat*DEG, sl=Math.sin(l0), cl=Math.cos(l0);
  return {lat:Math.asin(Math.max(-1,Math.min(1,z*sl+y*cl)))/DEG, lon:wrapLon(v.lon+Math.atan2(x,z*cl-y*sl)/DEG)};
}

/* ---------- Markers ----------
   Every ring is drawn on its true pixel. Markers closer together than a tap target keep their rings where
   they are; only their labels move, joined to the ring by a leader line. */
const CLUSTER_PX=24, ROW_H=26, LEADER_PX=36;
function buildMarks(){
  pinsEl.innerHTML='';
  marks=[];
  ITEMS.filter(it=>it.world===world).forEach(it=>{
    const key=it.id+':0', el=document.createElement('button');
    el.type='button'; el.className='mk'; el.dataset.key=key;
    el.setAttribute('aria-label',it.name);
    el.innerHTML='<span class="lbl">'+it.label+'</span>';
    pinsEl.appendChild(el);
    marks.push({key,id:it.id,lat:it.lat,lon:it.lon,el,w:0});
  });
}
function layoutMarks(){
  const v=views[world], Rc=cssSize/2*RF*v.zoom, c=cssSize/2;
  marks.forEach(m=>{ const p=project(m.lat,m.lon); m.x=c+p.x*Rc; m.y=c-p.y*Rc; m.show=p.z>.02 && m.x>=0 && m.x<=cssSize && m.y>=0 && m.y<=cssSize; m.group=null; m.stacked=false; });
  const groups=[];
  marks.filter(m=>m.show).forEach(m=>{
    let g=groups.find(g=>g.some(o=>Math.hypot(o.x-m.x,o.y-m.y)<CLUSTER_PX));
    if(!g){ g=[]; groups.push(g); }
    g.push(m); m.group=g;
  });
  const rows={'-1':[],'1':[]};
  groups.filter(g=>g.length>1).forEach(g=>{
    const gx=g.reduce((a,m)=>a+m.x,0)/g.length, gy=g.reduce((a,m)=>a+m.y,0)/g.length;
    g.forEach(m=>{ m.stacked=true; m.el.classList.add('stacked'); if(!m.w) m.w=m.el.offsetWidth; });
    const wmax=Math.max(...g.map(m=>m.w));
    let side=gx>=c?1:-1;
    if(side>0 && cssSize-gx<wmax+LEADER_PX+8) side=-1;
    if(side<0 && gx<wmax+LEADER_PX+8) side=1;
    g.forEach((m,i)=>{ m.side=side; m.lx=gx+side*LEADER_PX; m.ly=gy+(i-(g.length-1)/2)*ROW_H; rows[side].push(m); });
  });
  Object.values(rows).forEach(list=>{
    list.sort((a,b)=>a.ly-b.ly);
    for(let i=0;i<list.length;i++){ if(i && list[i].ly<list[i-1].ly+ROW_H) list[i].ly=list[i-1].ly+ROW_H; }
    for(let i=list.length-1;i>=0;i--){ const max=(i===list.length-1?cssSize-14:list[i+1].ly-ROW_H); if(list[i].ly>max) list[i].ly=max; }
  });
  marks.forEach(m=>{
    const el=m.el;
    el.style.visibility=m.show?'visible':'hidden';
    el.tabIndex=m.show?0:-1;
    if(!m.show){ return; }
    /* box: the ring, plus the label of a stacked marker; the popup keeps clear of it. */
    m.box={l:m.x-8,r:m.x+8,t:m.y-8,b:m.y+8};
    if(m.stacked){
      const left=m.side>0?m.lx:m.lx-m.w, x=Math.max(4,Math.min(cssSize-m.w-4,left));
      m.ax=m.side>0?x:x+m.w; m.ay=m.ly;
      el.style.transform='translate('+x.toFixed(1)+'px,'+(m.ly-12).toFixed(1)+'px)';
      m.box={l:Math.min(m.box.l,x),r:Math.max(m.box.r,x+m.w),t:Math.min(m.box.t,m.ly-12),b:Math.max(m.box.b,m.ly+12)};
    } else {
      el.classList.remove('stacked');
      el.style.transform='translate('+m.x.toFixed(2)+'px,'+m.y.toFixed(2)+'px)';
    }
  });
  placePopup();
}
const halo=(fn,w,col)=>{ octx.lineWidth=w+2.2; octx.strokeStyle='rgba(11,20,19,.85)'; fn(); octx.lineWidth=w; octx.strokeStyle=col; fn(); };
const latName=l=>Math.abs(l)+'°'+(l>0?'N':l<0?'S':'');
const lonName=l=>{ const v=wrapLon(l); return Math.abs(v)+'°'+(v>0&&v<180?'E':v<0?'W':''); };
function drawGraticule(){
  const v=views[world], Rc=cssSize/2*RF*v.zoom, c=cssSize/2, step=z=>z<2?30:z<5?10:z<14?5:z<36?2:1;
  const s=step(v.zoom), spanDeg=Math.min(180,(cssSize/2/Rc)/DEG*1.6+s), cosc=Math.max(.15,Math.cos(v.lat*DEG));
  const stroke=pts=>{ octx.beginPath(); let pen=false; pts.forEach(([la,lo])=>{ const p=project(la,lo); if(p.z<=0){ pen=false; return; } const x=c+p.x*Rc, y=c-p.y*Rc; if(pen) octx.lineTo(x,y); else { octx.moveTo(x,y); pen=true; } }); octx.stroke(); };
  const sample=Math.max(s/8,.2);
  octx.lineWidth=.7; octx.strokeStyle='rgba(232,238,236,.42)';
  const latMin=Math.max(-90,v.lat-spanDeg), latMax=Math.min(90,v.lat+spanDeg);
  const lonSpan=Math.min(180,spanDeg/cosc);
  for(let la=Math.ceil(latMin/s)*s;la<=latMax;la+=s){ if(Math.abs(la)>=90) continue; const pts=[]; for(let lo=v.lon-lonSpan;lo<=v.lon+lonSpan;lo+=sample) pts.push([la,lo]); stroke(pts); }
  for(let lo=Math.ceil((v.lon-lonSpan)/s)*s;lo<=v.lon+lonSpan;lo+=s){ const pts=[]; for(let la=latMin;la<=latMax;la+=sample) pts.push([la,lo]); stroke(pts); }
  octx.font='500 10px "IBM Plex Mono",monospace'; octx.textBaseline='middle'; octx.lineWidth=3; octx.lineJoin='round'; octx.strokeStyle='rgba(11,20,19,.9)'; octx.fillStyle='#E8EEEC';
  const put=(t,x,y)=>{ if(x<4||x>cssSize-32||y<8||y>cssSize-8) return; octx.strokeText(t,x,y); octx.fillText(t,x,y); };
  for(let la=Math.ceil(latMin/s)*s;la<=latMax;la+=s){ if(Math.abs(la)>=90) continue; const p=project(la,v.lon); if(p.z>0) put(latName(la),c+p.x*Rc+4,c-p.y*Rc-6); }
  for(let lo=Math.ceil((v.lon-lonSpan)/s)*s;lo<=v.lon+lonSpan;lo+=s){ const p=project(v.lat,lo); if(p.z>0 && wrapLon(lo)!==wrapLon(v.lon)) put(lonName(lo),c+p.x*Rc+4,c-p.y*Rc+8); }
}
function drawOverlay(){
  const scale=N/cssSize;
  octx.setTransform(1,0,0,1,0,0); octx.clearRect(0,0,N,N); octx.setTransform(scale,0,0,scale,0,0);
  if(!TEX[world]) return;
  const theme=getComputedStyle(document.body), activeCol=theme.getPropertyValue('--theme-text').trim(), hotCol=theme.getPropertyValue('--theme-accent').trim();
  if(showGrid) drawGraticule();
  marks.filter(m=>m.show&&m.stacked).forEach(m=>{ halo(()=>{ octx.beginPath(); octx.moveTo(m.x,m.y); octx.lineTo(m.ax,m.ay); octx.stroke(); },.9,'#E8EEEC'); });
  marks.filter(m=>m.show).forEach(m=>{
    const active=sel && sel.id===m.id, hot=hoverKey===m.key;
    const col=active?activeCol:hot?hotCol:'#FFFFFF', w=active?2:1.3, r=active?6.5:5;
    halo(()=>{ octx.beginPath(); octx.arc(m.x,m.y,r,0,TAU); octx.stroke(); },w,col);
  });
}
function refreshSel(){
  marks.forEach(m=>m.el.classList.toggle('active',!!sel && sel.key===m.key));
  document.querySelectorAll('.obj').forEach(b=>b.setAttribute('aria-pressed',String(!!sel && b.dataset.id===sel.id)));
  dirty=true;
}

/* ---------- Popup: name, description and photo ----------
   The popup never covers its marker. Beside the marker when the stage is wide enough, otherwise above or
   below it, whichever has more room; max-height is that room, and the text scrolls inside the popup. */
const popup=document.getElementById('popup');
const popFig=document.getElementById('popup-fig'), popImg=document.getElementById('popup-img');
const POP_GAP=6, POP_EDGE=8, POP_MIN_H=96, NARROW_STAGE=720;
function placePopup(){
  if(!sel||popup.hidden) return;
  const m=marks.find(k=>k.key===sel.key);
  if(!m||!m.show){ popup.style.visibility='hidden'; return; }
  popup.style.visibility='visible';
  const S=cssSize, w=popup.offsetWidth, b=m.box;
  const right=S-POP_EDGE-(b.r+POP_GAP), left=b.l-POP_GAP-POP_EDGE;
  let x, y;
  if(right>=w || left>=w){
    popup.style.maxHeight=(S-2*POP_EDGE)+'px';
    const h=popup.offsetHeight;
    x=right>=w ? b.r+POP_GAP : b.l-POP_GAP-w;
    y=Math.max(POP_EDGE,Math.min(S-POP_EDGE-h,m.y-24));
  } else {
    const below=S-POP_EDGE-(b.b+POP_GAP), above=b.t-POP_GAP-POP_EDGE, useBelow=below>=above;
    popup.style.maxHeight=Math.max(POP_MIN_H,useBelow?below:above)+'px';
    const h=popup.offsetHeight;
    x=Math.max(POP_EDGE,Math.min(S-POP_EDGE-w,m.x-w/2));
    y=useBelow ? Math.min(b.b+POP_GAP,S-POP_EDGE-h) : Math.max(POP_EDGE,b.t-POP_GAP-h);
  }
  popup.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
}
/* A photo that fails to load hides its figure instead of showing a broken image. */
popImg.addEventListener('error',()=>{ popFig.hidden=true; placePopup(); });
function openPopup(id,key){
  sel={id,key};
  const it=BY[id];
  document.getElementById('popup-name').textContent=it.name;
  document.getElementById('popup-desc').textContent=it.desc;
  popFig.hidden=!it.img;
  if(it.img){
    popImg.src=it.img.file; popImg.alt=it.img.alt;
    document.getElementById('popup-cap').textContent=it.img.caption;
    document.getElementById('popup-credit').textContent='Image: '+it.img.credit;
  }
  popup.hidden=false; popup.scrollTop=0;
  refreshSel(); placePopup();
  popup.focus({preventScroll:true});
}
function closePopup(returnFocus){
  if(popup.hidden) return;
  popup.hidden=true; sel=null; refreshSel();
  if(returnFocus && opener && opener.isConnected) opener.focus({preventScroll:true});
  opener=null;
}

/* ---------- Camera ---------- */
function touch(){ lastInteract=performance.now(); dirty=true; }
function setZoom(next,anchor){
  const v=views[world], z=Math.max(ZMIN,Math.min(ZMAX,next));
  if(z===v.zoom) return;
  if(anchor){
    const ll=unproject(anchor.x,anchor.y);
    if(ll){ const k=1-v.zoom/z; v.lat=Math.max(-85,Math.min(85,v.lat+(ll.lat-v.lat)*k)); v.lon=wrapLon(v.lon+wrapLon(ll.lon-v.lon)*k); }
  }
  v.zoom=z; tween=null; touch();
}
function flyTo(lat,lon,zoom){
  const v=views[world], tl=Math.max(-85,Math.min(85,lat)), dl=wrapLon(lon-v.lon);
  if(reduced){ v.lat=tl; v.lon=v.lon+dl; v.zoom=zoom; touch(); return; }
  tween={t0:performance.now(),dur:800,fl:v.lat,fo:v.lon,fz:v.zoom,tl,to:v.lon+dl,tz:zoom};
}
function frame(now){
  const v=views[world];
  if(tween){
    let p=(now-tween.t0)/tween.dur; if(p>=1) p=1;
    const e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
    v.lat=tween.fl+(tween.tl-tween.fl)*e; v.lon=tween.fo+(tween.to-tween.fo)*e;
    v.zoom=tween.fz*Math.pow(tween.tz/tween.fz,e);
    touch(); if(p===1){ tween=null; v.lon=wrapLon(v.lon); }
  }
  const rough=!!tween||!!drag||pinch!==null||now-lastInteract<130;
  if(roughDrawn && !rough) dirty=true;
  if(dirty){
    dirty=false; roughDrawn=rough;
    drawGlobe(rough?2:1); layoutMarks(); drawOverlay(); updateReadouts();
  }
  requestAnimationFrame(frame);
}

/* Pointer input */
let drag=null, pinch=null, moved=false, suppressClick=false;
const pointers=new Map();
const local=e=>{ const r=stage.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; };
stage.addEventListener('pointerdown',e=>{
  if(e.target.closest('.mk')||e.target.closest('#popup')) return;
  pointers.set(e.pointerId,local(e));
  try{ stage.setPointerCapture(e.pointerId); }catch(_){}
  tween=null;
  if(pointers.size===2){ const [a,b]=[...pointers.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y)}; drag=null; }
  else if(pointers.size===1){ drag=local(e); moved=false; stage.classList.add('dragging'); }
});
stage.addEventListener('pointermove',e=>{
  const p=local(e);
  showCursor(unproject(p.x,p.y));
  if(!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId,p);
  if(pinch && pointers.size===2){
    const [a,b]=[...pointers.values()], d=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinch.d>0) setZoom(views[world].zoom*d/pinch.d,{x:(a.x+b.x)/2,y:(a.y+b.y)/2});
    pinch.d=d; moved=true; return;
  }
  if(!drag) return;
  const v=views[world], Rc=cssSize/2*RF*v.zoom, dx=p.x-drag.x, dy=p.y-drag.y;
  if(Math.abs(dx)+Math.abs(dy)>3) moved=true;
  v.lon-=dx/Rc/DEG/Math.max(.2,Math.cos(v.lat*DEG));
  v.lat=Math.max(-85,Math.min(85,v.lat+dy/Rc/DEG));
  drag=p; touch();
});
const endPointer=e=>{
  pointers.delete(e.pointerId);
  if(pointers.size<2) pinch=null;
  if(pointers.size===0){ drag=null; stage.classList.remove('dragging'); suppressClick=moved; lastInteract=performance.now(); dirty=true; }
};
stage.addEventListener('pointerup',endPointer);
stage.addEventListener('pointercancel',endPointer);
stage.addEventListener('pointerleave',()=>showCursor(null));
stage.addEventListener('wheel',e=>{
  if(e.target.closest('#popup')) return;   /* the popup scrolls its own text */
  const v=views[world], zoomingIn=e.deltaY<0;
  if((zoomingIn && v.zoom>=ZMAX)||(!zoomingIn && v.zoom<=ZMIN)) return;
  e.preventDefault();
  setZoom(v.zoom*Math.exp(-e.deltaY*.0016),local(e));
},{passive:false});
stage.addEventListener('keydown',e=>{
  if(e.target!==stage) return;
  const v=views[world], d=10/v.zoom; let used=true;
  if(e.key==='ArrowLeft') v.lon-=d; else if(e.key==='ArrowRight') v.lon+=d;
  else if(e.key==='ArrowUp') v.lat=Math.min(85,v.lat+d); else if(e.key==='ArrowDown') v.lat=Math.max(-85,v.lat-d);
  else if(e.key==='+'||e.key==='=') setZoom(v.zoom*1.5);
  else if(e.key==='-'||e.key==='_') setZoom(v.zoom/1.5);
  else if(e.key==='0') resetView();
  else used=false;
  if(used){ e.preventDefault(); tween=null; touch(); }
});
function resetView(){ const home=WORLDS[world].view; flyTo(home.lat,home.lon,home.zoom); }
document.getElementById('zoom-in').addEventListener('click',()=>setZoom(views[world].zoom*1.8));
document.getElementById('zoom-out').addEventListener('click',()=>setZoom(views[world].zoom/1.8));
document.getElementById('zoom-reset').addEventListener('click',resetView);
const gridBtn=document.getElementById('grid-toggle');
gridBtn.addEventListener('click',()=>{ showGrid=!showGrid; gridBtn.setAttribute('aria-pressed',String(showGrid)); dirty=true; });

pinsEl.addEventListener('click',e=>{
  const b=e.target.closest('.mk'); if(!b) return;
  const m=marks.find(k=>k.key===b.dataset.key); if(!m) return;
  opener=b; openPopup(m.id,m.key);
});
pinsEl.addEventListener('pointerover',e=>{ const b=e.target.closest('.mk'); if(b){ hoverKey=b.dataset.key; dirty=true; } });
pinsEl.addEventListener('pointerout',e=>{ if(e.target.closest('.mk')){ hoverKey=null; dirty=true; } });
document.addEventListener('click',e=>{
  if(suppressClick){ suppressClick=false; return; }
  if(!e.target.closest('#popup,.mk,.obj')) closePopup(false);
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePopup(true); });
new ResizeObserver(resize).observe(stage);

/* ---------- Readouts ---------- */
const rLat=document.getElementById('r-lat'), rLon=document.getElementById('r-lon'), rCenter=document.getElementById('r-center'), rZoom=document.getElementById('r-zoom');
const fmtLat=l=>Math.abs(l).toFixed(3)+'° '+(l>=0?'N':'S');
const fmtLon=l=>Math.abs(l).toFixed(3)+'° '+(l>=0?'E':'W');
function showCursor(ll){ rLat.textContent=ll?fmtLat(ll.lat):'—'; rLon.textContent=ll?fmtLon(ll.lon):'—'; }
function updateReadouts(){
  const v=views[world];
  rCenter.textContent=fmtLat(v.lat)+', '+fmtLon(wrapLon(v.lon));
  rZoom.textContent=v.zoom.toFixed(1)+'×';
}

/* ---------- World switch and object list ---------- */
const listEl=document.getElementById('obj-list'), countEl=document.getElementById('obj-count');
function renderList(){
  const items=ITEMS.filter(it=>it.world===world);
  countEl.textContent=String(items.length);
  listEl.innerHTML=items.map(it=>'<li><button type="button" class="obj" data-id="'+it.id+'" aria-pressed="false">'+it.name+'</button></li>').join('');
}
listEl.addEventListener('click',e=>{ const b=e.target.closest('.obj'); if(b){ opener=b; focusObject(BY[b.dataset.id]); } });
function focusObject(it){
  const z=Math.max(views[world].zoom,6);
  /* On a stage too narrow for the popup to sit beside the marker, the view centers a little south of the object,
     so it lands in the upper part of the globe and the popup gets the room below it. */
  const shift=cssSize<NARROW_STAGE ? Math.asin(Math.min(1,.56/(RF*z)))/DEG : 0;
  flyTo(it.lat-shift,it.lon,z);
  openPopup(it.id,it.id+':0');
}
function setStatus(html){ statusEl.innerHTML=html; }
function ensureLoaded(w){
  if(TEX[w]){ setStatus(''); dirty=true; return; }
  setStatus('Loading the '+WORLDS[w].label+' map…');
  pinsEl.hidden=true;
  loadTexture(w).then(()=>{
    if(w!==world) return;
    setStatus(''); pinsEl.hidden=false; touch();
    if(pendingObject){ const it=BY[pendingObject]; pendingObject=null; focusObject(it); }
    preloadOtherWorld();
  }).catch(err=>{
    if(w!==world) return;
    const why=err && err.name==='SecurityError' ? 'The browser blocked reading the image. Open this page through a local HTTP server, not as a file.' : 'The file '+WORLDS[w].file+' could not be loaded.';
    setStatus('<strong>The '+WORLDS[w].label+' map could not load.</strong><br>'+why+'<button type="button" class="toggle" id="map-retry">Retry</button>');
    document.getElementById('map-retry').addEventListener('click',()=>ensureLoaded(w));
  });
}
/* ---------- Theme switch ---------- */
const THEME_MS=700;
let themeTimer=0, afterTheme=[];
function whenThemeSettled(fn){ if(document.body.classList.contains('theme-switching')) afterTheme.push(fn); else fn(); }
function switchTheme(w){
  /* The class and the new world land in the same style update, so the transition starts on this click. */
  document.body.classList.add('theme-switching');
  document.body.dataset.world=w;
  clearTimeout(themeTimer);
  themeTimer=setTimeout(()=>{
    document.body.classList.remove('theme-switching');
    afterTheme.splice(0).forEach(fn=>fn());
  },THEME_MS+100);
}
function writeWorldToUrl(w){
  const url=new URL(location.href);
  url.searchParams.set('world',w);
  url.searchParams.delete('object');   /* the selection does not carry over to the other world */
  try{ history.replaceState(null,'',url); }catch(e){}
}
const PRELOAD_DELAY_MS=2500;
let preloaded=false;
function preloadOtherWorld(){
  if(preloaded || (navigator.connection && navigator.connection.saveData)) return;
  preloaded=true;
  const go=()=>loadTexture(world==='moon'?'mars':'moon').catch(()=>{});
  /* Decoding a map blocks the main thread, so wait until the opening flight to an object has finished. */
  setTimeout(()=>{ if('requestIdleCallback' in window) requestIdleCallback(go,{timeout:4000}); else go(); },PRELOAD_DELAY_MS);
}
function setWorld(w){
  if(w===world && marks.length) return;
  if(marks.length){ switchTheme(w); writeWorldToUrl(w); pendingObject=null; }
  closePopup(false);
  world=w; tween=null;
  document.querySelectorAll('.world-switch .toggle').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.world===w)));
  document.getElementById('stage-title').textContent=WORLDS[w].label;
  buildMarks(); renderList(); refreshSel(); pinsEl.hidden=!TEX[w]; ensureLoaded(w); touch();
}
document.querySelectorAll('.world-switch .toggle').forEach(t=>t.addEventListener('click',()=>setWorld(t.dataset.world)));


/* ---------- Start ---------- */
document.fonts && document.fonts.ready.then(()=>{ marks.forEach(m=>{ m.w=0; }); dirty=true; });
resize();
setWorld(world);
if(pendingObject) document.getElementById('workbench').scrollIntoView({block:'start'});
requestAnimationFrame(frame);
})();
