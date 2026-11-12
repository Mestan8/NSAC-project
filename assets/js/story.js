/* The Story Mode: six chapters of two objects each, chapter navigation and read-aloud. */
(function(){
"use strict";
const {S,link,ITEMS,BY,WORLDS}=window.SLF;

/* ---------- Story text ----------
   Each object's section from StoModInf, verbatim (final copy: do not edit). Kept as structured data so it can
   be styled and read aloud: title, the italic tagline if there is one, then the parts in their original order:
     P(text)            a paragraph
     F(heading,items)   an "at a Glance" style list of [label, text] pairs; heading null when the PDF has none
     B(label,text)      a labelled block such as "Where is it now?"
   Inline: *italic* and **bold**, only where the PDF has them. title null: the PDF section has no headline,
   so the object's name from data.js is used. The Apollo 15 retroreflector is not in Story Mode (its science
   is told in the Apollo 11 section), and the waste bags have no StoModInf section. */
const P=x=>({t:'p',x}), F=(h,items)=>({t:'facts',h,items}), B=(l,x)=>({t:'block',l,x});
const STORY_TEXT={
  eagle:{title:`Apollo 11: The Mission That Left Its Mark on the Moon`,
    tagline:`The first rocks from another world, and a mirror that’s still answering.`,
    parts:[
      P(`On July 20, 1969, Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon. But when they climbed back into their spacecraft and departed, they left behind more than footprints. The landing site became home to a collection of equipment that continues to tell the story of lunar exploration long after the astronauts returned to Earth.`),
      F(`What Was Left Behind?`,[
        [`Eagle’s descent stage:`,`The lower section of the lunar module, which carried the astronauts down to the surface and then served as the launch platform for their return. It remains at the landing site.`],
        [`Laser ranging retroreflector:`,`An array of special mirrors that reflects laser pulses from Earth, allowing scientists to measure the exact distance to the Moon.`],
        [`Moonquake detector (Passive Seismic Experiment):`,`An instrument designed to detect moonquakes and study the Moon’s internal structure.`]]),
      B(`A lasting scientific impact:`,`The laser ranging retroreflector remains especially valuable. By timing how long laser pulses take to bounce back from its mirrors, scientists can measure the Moon's distance to within millimeters. These measurements show that the Moon is drifting away from Earth by about 3.8 centimeters per year. Meanwhile, the seismic experiment laid the foundation for understanding moonquakes and the Moon’s interior, which later Apollo missions investigated further.`),
      B(`Where are they now?`,`These artifacts remain at the Apollo 11 landing site in the Sea of Tranquility. Most are inactive historical remains, but the laser ranging retroreflector continues to serve scientific research. More than five decades after the first Moon landing, these objects remain an extraordinary connection between humanity's first steps on the Moon and the science still being conducted today.`)]},
  surveyor:{title:`Surveyor 3: The Robot Lander the Astronauts Came to Visit`,
    parts:[
      P(`On April 20, 1967, NASA’s Surveyor 3 landed on the Moon, a robotic scout sent to find out whether the surface was safe for astronauts. About two and a half years later, Apollo 12 astronauts walked up to it, the first time humans had ever visited a robotic spacecraft on another world. Surveyor 3 was left on the Moon to do its job, and it ended up becoming a time capsule.`),
      F(`Surveyor 3 at a Glance`,[
        [`Landing date:`,`April 20, 1967`],
        [`Landing site:`,`Ocean of Storms, Moon`],
        [`Scientific equipment:`,`A television camera and a robotic soil-digging scoop`],
        [`Key achievement:`,`Captured over 6,300 photographs and dug trenches to test the strength of lunar soil`],
        [`A difficult landing:`,`Its descent engine failed to shut down at the intended moment, causing the spacecraft to bounce twice before finally settling on the surface.`]]),
      B(`A lasting scientific impact:`,`Surveyor 3's soil tests proved the Moon's surface could safely support a heavy crewed lander, giving Apollo the confidence to land. In November 1969, Apollo 12 astronauts landed nearby, walked over to the silent scout, and removed its camera and soil scoop to bring back to Earth. Studying those parts after 31 months on the Moon revealed how lunar dust, radiation, and rocket exhaust wear down spacecraft—lessons engineers still use to design new lunar landers today.`),
      B(`Where is it now?`,`Surveyor 3 remains standing at its original landing site in the Ocean of Storms, silent since May 1967. While its camera and scoop are back on Earth in museums, the rest of the three-legged scout remains on the Moon—a lasting reminder of the small robot that paved the way for human explorers and waited for them to arrive.`)]},
  golf:{title:null,
    parts:[
      P(`On February 6, 1971, Apollo 14 astronaut Alan Shepard made history by hitting two golf balls on the lunar surface. Using a makeshift club, made by attaching a six-iron head to the handle of a lunar sampling tool, he performed the first golf shots on another world.`),
      F(`What made them special?`,[
        [`Left by:`,`Alan Shepard, Apollo 14 commander.`],
        [`Location:`,`Fra Mauro region, Moon.`],
        [`Date:`,`February 6, 1971.`],
        [`Quantity:`,`Two golf balls.`],
        [`Unique detail:`,`Shepard had to swing one-handed because his bulky spacesuit restricted his movement.`]]),
      B(`A memorable moment:`,`Shepard famously joked that one ball travelled "miles and miles and miles." Modern image analysis later estimated that the two balls travelled approximately 24 and 40 yards.`),
      B(`Note:`,`With this swing, golf officially became the **first—and so far, only—sport ever played on the Moon**. (Moments later, fellow astronaut Edgar Mitchell playfully tossed a tool handle like a javelin, making Apollo 14 the site of the only "Lunar Olympics" in history.)`)]},
  photo:{title:`Apollo 16 Family Photograph — A Piece of Home Left on the Moon`,
    parts:[
      P(`During Apollo 16's final moonwalk on April 23, 1972, astronaut Charlie Duke pulled a small, plastic-wrapped portrait of his family from his pocket and placed it gently onto the lunar dust. Showing Duke alongside his wife and two young sons, this personal keepsake became one of the most touching objects ever left behind on another world.`),
      F(`The Photograph at a Glance`,[
        [`Left by:`,`Charlie Duke (Apollo 16)`],
        [`Date:`,`April 23, 1972`],
        [`Location:`,`Descartes Highlands, Moon`],
        [`Details:`,`A color family portrait sealed in protective plastic, signed by his wife and sons with a handwritten note on the back: *"This is the family of Astronaut Duke from Planet Earth. Landed on the Moon, April 1972."*`]]),
      B(`A lasting human connection:`,`Unlike the rovers, landers, and science stations scattered across the Moon, this photograph had no scientific purpose. Before leaving it behind, Duke snapped a picture of the portrait resting in the gray lunar soil—capturing a quiet, deeply human moment in the middle of a historic spaceflight.`)]},
  rover:{title:`Apollo 17 Moon Buggy — The Last Rover Driven on the Moon`,
    parts:[
      P(`On December 11, 1972, astronauts Eugene Cernan and Harrison Schmitt deployed the Lunar Roving Vehicle (LRV) at the Taurus–Littrow valley on the Moon. It was the third and final lunar rover used during the Apollo missions, designed to carry astronauts, scientific equipment and collected samples across the lunar surface.`),
      F(`Moon Buggy at a Glance`,[
        [`Location:`,`Taurus–Littrow valley, Moon`],
        [`Deployed:`,`December 11, 1972`],
        [`Design:`,`Lightweight, foldable four-wheeled electric vehicle with springy wire-mesh tires and a T-shaped steering handle`],
        [`Power source:`,`Two non-rechargeable batteries`],
        [`Distance driven:`,`About 36 km (22 miles) across three drives`]]),
      B(`A lasting scientific impact:`,`The rover allowed astronauts to explore geological sites that would have been difficult to reach on foot. It helped them collect 110.5 kg of lunar samples, including orange volcanic glass discovered near Shorty Crater. These samples provided evidence of ancient volcanic activity on the Moon, approximately 3.6 billion years ago.`),
      B(`Where is it now?`,`The Apollo 17 Moon buggy remains parked about 100 meters from the lander in the Taurus–Littrow valley, its remote-controlled camera still facing the spot where the crew lifted off for home. Because the Moon has no wind or rain to erase them, the rover and its tire tracks remain preserved in the lunar dust—a silent monument to humanity's last drive on another world.`)]},
  viking:{title:`Viking 1 — The Lander That Brought Mars Within Reach`,
    parts:[
      P(`On July 20, 1976, NASA's Viking 1 lander touched down on Chryse Planitia (Golden Plain) on Mars. It became the first successful U.S. spacecraft to land on the planet and transmit images directly from its surface. Its mission was to study the Martian environment, examine its soil and search for possible signs of life. Built to work for 90 days, it kept going for more than six years.`),
      F(`Viking 1 at a Glance`,[
        [`Landing date:`,`July 20, 1976`],
        [`Landing site:`,`Chryse Planitia, Mars`],
        [`Scientific equipment:`,`Cameras, a soil-scooping robotic arm, weather sensors, and a miniature biology lab`],
        [`Power source:`,`Two nuclear generators`]]),
      B(`A lasting scientific impact:`,`Viking 1 snapped the very first photographs from the Martian surface and scooped up soil to test for microscopic life. While its experiments found unexpected chemical reactions rather than clear proof of life, its measurements of Mars's thin atmosphere proved priceless—years later, scientists matched those exact gas readings to air trapped inside meteorites on Earth, proving those rocks had come from Mars.`),
      B(`Where is it now?`,`Viking 1 remains silent on Chryse Planitia, where its landing site was renamed the Thomas Mutch Memorial Station. Communication ended in November 1982 after a faulty software update accidentally pointed its antenna away from Earth—leaving behind a nuclear-powered pioneer that opened the door to modern Mars exploration.`)]},
  spirit:{title:`Spirit Rover — The Explorer That Refused to Give Up`,
    tagline:`Even when a broken wheel slowed it down, Spirit continued uncovering clues about Mars' watery past.`,
    parts:[
      F(null,[
        [`Mission:`,`Mars Exploration Rover (MER-A)`],
        [`Launch:`,`June 10, 2003`],
        [`Landing:`,`January 3, 2004`],
        [`Landing site:`,`Gusev Crater, Mars`],
        [`Instruments:`,`Cameras, a microscopic imager, a rock abrasion tool, and three spectrometers`],
        [`Distance travelled:`,`Approximately 7.73 km.`]]),
      P(`About the size of a golf cart, this solar-powered, six-wheeled robot was built to examine Martian rocks and soil for signs that liquid water once existed on the planet. Originally designed to operate for just 90 Martian days, it continued exploring for more than six years. Its biggest discovery happened by accident. When one of its front wheels broke and stopped turning, Spirit dragged it through the dirt, uncovering bright patches of a rare mineral. On Earth, this mineral forms around hot springs and steam vents—proving that Mars was once warm and wet enough to support life.`),
      B(`An unexpected ending:`,`In April 2009, Spirit became trapped in a patch of soft sand that engineers nicknamed Troy. Months of careful attempts could not free it. Its solar panels could no longer catch enough winter sunlight, and Spirit’s power ran low. It last contacted Earth on March 22, 2010, and NASA ended its recovery efforts on May 25, 2011.`),
      B(`Where is it now?`,`Spirit remains inactive at Gusev Crater on Mars. Although its journey ended in the Martian soil, its discoveries helped shape our understanding of the planet and paved the way for future explorers like Curiosity and Perseverance. A golf-cart-sized robot with an enormous legacy, Spirit proved just how far mobile exploration could go.`)]},
  opportunity:{title:`Opportunity: The Rover That Outlived Its Mission`,
    tagline:`An engineering miracle meant to last only three months, Opportunity spent nearly fifteen years uncovering secrets of ancient, habitable Mars.`,
    parts:[
      F(null,[
        [`Mission:`,`Mars Exploration Rover (MER-B)`],
        [`Launch:`,`July 7, 2003`],
        [`Landing:`,`January 24, 2004`],
        [`Landing site:`,`Meridiani Planum, Mars`],
        [`Scientific instruments:`,`Cameras and an Alpha Proton X-ray Spectrometer (APXS).`]]),
      P(`On January 24, 2004, NASA landed Opportunity on Mars as part of its Mars Exploration Rover mission. Its goal was to search for evidence of ancient water. Originally designed to operate for just 90 Martian days, Opportunity continued exploring for nearly 15 years.`),
      P(`Opportunity discovered tiny, round mineral formations nicknamed *Martian Blueberries*. Rich in hematite, these formations provided strong evidence that liquid water had once existed on Mars. It also explored several craters, uncovering clues about the planet's geological past.`),
      B(`How it ended:`,`In June 2018, a massive dust storm covered Mars, blocking sunlight from reaching Opportunity's solar panels. Without power, the rover stopped communicating with Earth. After months of repeated attempts to restore contact, NASA officially ended the mission in February 2019.`),
      B(`Where is it now?`,`Opportunity remains inactive near Endeavour Crater on Mars. Although its journey ended in a dust storm, it traveled farther than any previous rover on another world—covering more than 28 miles (45 kilometers) across the Martian surface and leaving behind an extraordinary legacy.`)]},
  phoenix:{title:`Phoenix: The Lander That Touched Ice on Mars`,
    parts:[
      P(`On May 25, 2008, NASA’s Phoenix lander touched down in the Martian arctic—closer to the north pole than any spacecraft had ever landed before. Built partly from spare parts of earlier missions and named after the mythical bird that rises from the ashes, this solar-powered robot used a long digging arm to test whether the frozen ground could ever have supported life.`),
      F(`Phoenix at a Glance`,[
        [`Landing date:`,`May 25, 2008`],
        [`Landing site:`,`Northern arctic plains, Mars`],
        [`Scientific equipment:`,`A 2.35-meter digging arm, miniature ovens, microscopes, cameras, and a weather station`],
        [`Power source:`,`Solar panels`],
        [`Mission duration:`,`Over five months (exceeding its 90-day goal)`]]),
      B(`A lasting scientific impact:`,`Phoenix directly confirmed water ice beneath the Martian surface by analysing samples with its onboard instruments. It also discovered perchlorate salts in the soil, providing important clues about Martian soil chemistry and its potential habitability. Its weather station even detected snow falling from clouds approximately four kilometres above the lander.`),
      B(`Where is it now?`,`Phoenix remains silent in the Martian arctic. When winter arrived in November 2008, fading sunlight drained its solar panels, and heavy winter frost likely damaged them in the months that followed. Though inactive, this three-legged lander proved that Mars is a world of ice as well as dust—pointing future explorers toward water they could one day use.`)]},
  insight:{title:`InSight: The Lander That Listened to Mars`,
    parts:[
      P(`On November 26, 2018, NASA’s InSight lander touched down on a flat plain near the Martian equator. Unlike rovers built to drive around, this three-legged, car-sized robot stayed in one spot to act as a doctor checking Mars’s vital signs—listening for marsquakes and measuring heat escaping from deep underground. And it recorded the first marsquakes ever detected.`),
      F(`InSight at a Glance`,[
        [`Landing date:`,`November 26, 2018`],
        [`Landing site:`,`Elysium Planitia, Mars`],
        [`Scientific tools:`,`A ultra-sensitive marsquake detector, a self-hammering heat probe ("the mole"), cameras, and weather sensors`],
        [`Power source:`,`Two circular solar panels`],
        [`Mission duration:`,`Over four years (doubling its two-year goal)`]]),
      B(`A lasting scientific impact:`,`InSight detected more than 1,300 seismic events, providing the first detailed information about Mars' internal layers — its crust, mantle and core. Its measurements revealed that Mars has a molten core and helped scientists understand how rocky planets form and evolve. Although its heat probe struggled to dig into the unexpectedly clumpy soil, it still collected useful information about the Martian surface. This data is still being studied, and it helps explain how Mars formed and why it changed so much from Earth.`),
      B(`Where Are They Now?`,`Over the years, dust piled onto InSight’s solar panels, and its power slowly faded. As its energy dropped, the team turned off its instruments one by one to keep the lander going as long as possible. In December 2022, after InSight missed two scheduled contacts with orbiting spacecraft, NASA declared the mission complete. InSight remains where it landed, quiet and dusty, a lander that spent its life listening for the pulse of another world.`)]},
  ingenuity:{title:`Ingenuity — The First Helicopter to Fly on Another World`,
    parts:[
      P(`Hitching a ride to Mars beneath the Perseverance rover, NASA's Ingenuity helicopter was built to test whether powered flight was possible in Mars's extremely thin air. On April 19, 2021, this softball-sized aircraft lifted off in Jezero Crater—making history with the very first controlled flight on another planet.`),
      F(`Ingenuity at a Glance`,[
        [`Location:`,`Jezero Crater, Mars`],
        [`First flight:`,`April 19, 2021`],
        [`Weight & Size:`,`Only 1.8 kg, with a body the size of a softball and 1.2-meter carbon-fiber blades`],
        [`Power source:`,`Top-mounted solar panel and rechargeable batteries`],
        [`Original goal:`,`Five test flights over 30 days`],
        [`Actual achievement:`,`72 flights over nearly three years, traveling 17 km`]]),
      B(`A lasting technological impact:`,`Because Mars's atmosphere is only about one percent as thick as Earth's, Ingenuity's blades had to spin roughly five times faster than a normal helicopter just to lift off. Carrying no scientific tools—just cameras and a postage-stamp-sized scrap of fabric from the Wright brothers' first airplane—it quickly evolved from a test craft into an aerial scout, snapping photos from above to help Perseverance find safe routes. Its success proved that flying robots can explore other worlds, paving the way for future planetary aircraft.`),
      B(`Where is it now?`,`Ingenuity remains upright on the floor of Jezero Crater. Its 72nd and final flight ended in January 2024 when a hard landing damaged its rotor blades, bringing its flying days to a close. Though grounded and out of radio range, this tiny helicopter forever changed how humanity explores the skies of other planets.`)]},
  sojourner:{title:`Sojourner — The Dawn of Humanity’s Wheels on Another World`,
    tagline:`It was small enough to fit into a person's arms, but it opened the door to generations of Mars exploration.`,
    parts:[
      F(null,[
        [`Mission:`,`Mars Pathfinder`],
        [`Launch:`,`December 4, 1996`],
        [`Landing:`,`July 4, 1997`],
        [`Landing site:`,`Ares Vallis, Mars`],
        [`Scientific instruments:`,`Cameras and an Alpha Proton X-ray Spectrometer (APXS).`]]),
      P(`Sojourner became the first wheeled vehicle to successfully operate on another planet when it landed on Mars.`),
      P(`Sojourner explored several rocks studying their chemical composition and providing valuable clues about Mars's geological past. Its six-wheel design allowed it to navigate the rocky Martian terrain, demonstrating that mobile robotic exploration was possible beyond Earth.`),
      B(`An unexpected ending:`,`Sojourner was designed for just seven Martian days but continued operating for 83. Its journey ended when communication with the Pathfinder lander was lost in September 1997, cutting off its connection to Earth.`),
      B(`Where is it now?`,`Sojourner remains inactive at its original landing site on Mars. Although silent, it helped pave the way for future explorers like Spirit, Opportunity, Curiosity and Perseverance. A small rover with an enormous legacy, Sojourner proved that the exploration of Mars had only just begun.`)]}
};

/* ---------- Chapters ----------
   Chapter names are this site's own. Roughly chronological; Sojourner closes the story beside Ingenuity,
   the first wheels and the first wings on another planet. */
const CHAPTERS=[
  {name:'The Scout and the Eagle',ids:['surveyor','eagle']},
  {name:'Souvenirs in the Dust',ids:['golf','photo']},
  {name:'Last Drive, First Landing',ids:['rover','viking']},
  {name:'The Twins of 2004',ids:['spirit','opportunity']},
  {name:'The Ones That Stayed Put',ids:['phoenix','insight']},
  {name:'First Wheels, First Wings',ids:['sojourner','ingenuity']}
];
const STORY={
  intro:{title:'Travel through time with the things NASA left behind',text:'Since 1967, NASA has left robots, rovers and all kinds of other things on the Moon and on Mars. In every chapter, two lost items tell their stories, and “Show on map” flies the globe to the spot where it is. Ready?'},
  outro:{title:'Abandoned, but not forgotten',text:'That’s the end of our journey through time, from a bouncing robot in 1967 to a helicopter on Mars. All these things were left behind. But they are not forgotten, because now you know their stories.'}
};
/* Pages: the introduction, the six chapters, the ending. */
const PAGES=[{type:'intro'}].concat(CHAPTERS.map((c,i)=>({type:'chapter',n:i})),[{type:'outro'}]);

/* ---------- Text helpers ---------- */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
/* Escapes, then turns the two inline marks into <strong> and <em>. */
const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
const plain=s=>String(s).replace(/\*\*?/g,'');
const titleOf=id=>STORY_TEXT[id].title||BY[id].name;
const pad=n=>String(n).padStart(2,'0');
const worldOf=ids=>{ const w=[...new Set(ids.map(id=>BY[id].world))]; return w.length>1?'both':w[0]; };

/* ---------- Read aloud ----------
   One object at a time: its StoModInf text as plain text, with the labels read out. */
const canSpeak=('speechSynthesis' in window) && typeof SpeechSynthesisUtterance!=='undefined';
let speakingId=null;
function updateReadBtns(){
  document.querySelectorAll('[data-act="read"]').forEach(b=>{
    const on=b.dataset.id===speakingId;
    b.setAttribute('aria-pressed',String(on)); b.textContent=on?'Stop reading':'Read aloud';
  });
}
function stopSpeech(){ if(canSpeak){ try{ speechSynthesis.cancel(); }catch(e){} } speakingId=null; updateReadBtns(); }
function readText(id){
  const st=STORY_TEXT[id], out=[titleOf(id)+'.'];
  if(st.tagline) out.push(st.tagline);
  st.parts.forEach(p=>{
    if(p.t==='p') out.push(p.x);
    else if(p.t==='block') out.push(p.l+' '+p.x);
    else { if(p.h) out.push(p.h+'.'); p.items.forEach(([l,x])=>out.push(l+' '+x+(/[.!?]["”]?$/.test(x)?'':'.'))); }
  });
  return plain(out.join(' ')).replace(/[“”]/g,'"');
}
function speak(id){
  if(!canSpeak) return;
  const was=speakingId; stopSpeech();
  if(was===id) return;
  try{
    const u=new SpeechSynthesisUtterance(readText(id)); u.lang='en-US'; u.rate=.95; u.pitch=1.05;
    u.onend=u.onerror=()=>{ if(speakingId===id){ speakingId=null; updateReadBtns(); } };
    speechSynthesis.speak(u); speakingId=id; updateReadBtns();
  }catch(e){ speakingId=null; updateReadBtns(); }
}

/* ---------- Rendering ---------- */
function renderPart(p){
  if(p.t==='p') return '<p class="st-p">'+inline(p.x)+'</p>';
  if(p.t==='block') return '<p class="st-block"><strong class="st-label">'+inline(p.l)+'</strong> '+inline(p.x)+'</p>';
  return (p.h?'<h5 class="facts-h">'+inline(p.h)+'</h5>':'')+
    '<dl class="facts">'+p.items.map(([l,x])=>'<div><dt>'+inline(l)+'</dt><dd>'+inline(x)+'</dd></div>').join('')+'</dl>';
}
function renderObject(id,d){
  const it=BY[id], st=STORY_TEXT[id], img=it.img;
  return '<article class="obj-story w-'+it.world+' reveal" data-d="'+d+'" aria-labelledby="st-'+id+'">'+
    '<p class="story-meta">'+it.year+' · '+esc(it.mission)+' · '+WORLDS[it.world].label+'</p>'+
    '<h4 class="story-title" id="st-'+id+'">'+inline(titleOf(id))+'</h4>'+
    (st.tagline?'<p class="pull">'+inline(st.tagline)+'</p>':'')+
    '<div class="st-body">'+st.parts.map(renderPart).join('')+'</div>'+
    (img?'<figure class="obj-fig"><img src="'+img.file+'" alt="'+esc(img.alt)+'" width="1200" height="800" loading="lazy" decoding="async">'+
      '<figcaption>'+esc(img.caption)+' <span class="fig-credit">Image: '+esc(img.credit)+'</span></figcaption></figure>':'')+
    '<div class="obj-actions"><a class="btn" href="index.html?world='+it.world+'&amp;object='+it.id+'">Show on map</a>'+
      (canSpeak?'<button type="button" class="btn" data-act="read" data-id="'+id+'" aria-pressed="false">Read aloud</button>':'')+'</div>'+
    '<p class="story-sources">Sources: '+it.src.map(link).join(' · ')+'</p>'+
  '</article>';
}
const storyEl=document.getElementById('story');
let page=0;
function renderStory(){
  stopSpeech();
  const pg=PAGES[page], n=PAGES.length;
  const nav='<nav class="ch-nav" aria-label="Chapters"><ol>'+CHAPTERS.map((c,i)=>{
      const cur=pg.type==='chapter' && pg.n===i;
      return '<li><button type="button" class="ch-step w-'+worldOf(c.ids)+'" data-act="jump" data-i="'+(i+1)+'" aria-label="Chapter '+(i+1)+': '+esc(c.name)+'"'+(cur?' aria-current="step"':'')+'>'+
        '<span class="ch-step-num">'+pad(i+1)+'</span><span class="ch-step-name">'+esc(c.name)+'</span></button></li>';
    }).join('')+'</ol></nav>';
  let body;
  if(pg.type==='chapter'){
    const c=CHAPTERS[pg.n], years=c.ids.map(id=>BY[id].year), worlds=[...new Set(c.ids.map(id=>WORLDS[BY[id].world].label))];
    const span=years[0]===years[1]?String(years[0]):Math.min(...years)+'–'+Math.max(...years);
    body='<section class="chapter w-'+worldOf(c.ids)+'" aria-labelledby="ch-title">'+
      '<header class="ch-head reveal" data-d="1">'+
        '<p class="ch-eyebrow">Chapter '+pad(pg.n+1)+' of '+pad(CHAPTERS.length)+'</p>'+
        '<h3 class="ch-title" id="ch-title" tabindex="-1">'+esc(c.name)+'</h3>'+
        '<p class="ch-meta">'+span+' · '+worlds.join(' → ')+'</p>'+
        '<span class="ch-big" aria-hidden="true">'+pad(pg.n+1)+'</span>'+
      '</header>'+
      '<div class="ch-objects">'+c.ids.map((id,k)=>renderObject(id,k+2)).join('')+'</div>'+
    '</section>';
  } else {
    const t=STORY[pg.type];
    body='<div class="story-intro reveal" data-d="1"><h3 class="story-title" id="ch-title" tabindex="-1">'+esc(t.title)+'</h3><p class="voice">'+esc(t.text)+'</p></div>';
  }
  const next=page<n-1
    ? '<button type="button" class="btn primary" data-act="next">'+(page===0?'Start the journey':'Next chapter')+'</button>'
    : '<button type="button" class="btn primary" data-act="restart">Start again</button>';
  storyEl.innerHTML=nav+body+
    '<div class="story-nav"><button type="button" class="btn" data-act="prev"'+(page===0?' disabled':'')+'>Back</button>'+next+'</div>';
  /* Content rendered after load goes through reveal.js like everything else. */
  if(window.SLF_reveal) window.SLF_reveal(storyEl);
}
function goStory(i){
  page=Math.max(0,Math.min(PAGES.length-1,i)); renderStory();
  /* Keyboard and screen-reader users land on the new chapter's heading; the top of the story comes into view. */
  const h=document.getElementById('ch-title'); if(h) h.focus({preventScroll:true});
  if(storyEl.getBoundingClientRect().top<0) storyEl.scrollIntoView({block:'start'});
}
storyEl.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b) return;
  const act=b.dataset.act;
  if(act==='read') speak(b.dataset.id);
  else if(act==='next') goStory(page+1);
  else if(act==='prev') goStory(page-1);
  else if(act==='restart') goStory(0);
  else if(act==='jump') goStory(+b.dataset.i);
});
/* A photo that fails to load hides its figure instead of showing a broken image. */
storyEl.addEventListener('error',e=>{ const f=e.target.closest && e.target.closest('.obj-fig'); if(f) f.hidden=true; },true);
window.addEventListener('pagehide',stopSpeech);   /* do not keep talking after leaving for the map */

renderStory();
})();
