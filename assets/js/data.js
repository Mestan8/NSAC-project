/* Shared data for all three pages: sources, objects and world settings. */
(function(){
"use strict";
/* ---------- Sources ---------- */
const S = {
  lroc2016:['LROC Science Operations Team (2016): Coordinates of Lunar Anthropogenic Targets','https://www.lroc.asu.edu/data/support/downloads/2016_LROC_Coordinates_of_Human_Features.pdf'],
  nssdcSites:['NASA NSSDCA: Apollo Landing Site Coordinates','https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html'],
  mars24:['NASA GISS: Mars24 Sunclock, Mars Landers','https://www.giss.nasa.gov/tools/mars24/help/landers.html'],
  hiriseVL1:['HiRISE PSP_001521_2025: Viking Lander 1','https://www.uahirise.org/PSP_001521_2025'],
  hirisePF:['HiRISE PSP_001890_1995: Mars Pathfinder Site','https://www.uahirise.org/PSP_001890_1995'],
  hiriseOpp:['HiRISE ESP_056955_1775: Opportunity Rover in Western Endeavour Crater','https://www.uahirise.org/ESP_056955_1775'],
  piaSpirit:['NASA Photojournal PIA12205: Orbital View of Spirit at Troy','https://science.nasa.gov/photojournal/orbital-view-of-spirit-at-troy/'],
  golombek2020:['Golombek et al. (2020), Earth and Space Science: Location and Setting of the Mars InSight Lander','https://doi.org/10.1029/2020EA001248'],
  mapMoon:['NASA SVS 4720: CGI Moon Kit','https://svs.gsfc.nasa.gov/4720'],
  mapMars:['USGS Astrogeology: Viking MDIM 2.1 Colorized Global Mosaic','https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m'],
  mapMarsCopy:['Wikimedia Commons: Mars_Viking_MDIM21_ClrMosaic_1km.jpg','https://commons.wikimedia.org/wiki/File:Mars_Viking_MDIM21_ClrMosaic_1km.jpg'],
  a11:['NASA: Apollo 11','https://www.nasa.gov/mission/apollo-11/'],
  a12:['NASA: Apollo 12','https://www.nasa.gov/mission/apollo-12/'],
  a14:['NASA: Apollo 14','https://www.nasa.gov/mission/apollo-14/'],
  a15:['NASA: Apollo 15','https://www.nasa.gov/mission/apollo-15/'],
  a16:['NASA: Apollo 16','https://www.nasa.gov/mission/apollo-16/'],
  a17:['NASA: Apollo 17','https://www.nasa.gov/mission/apollo-17/'],
  alsj:['NASA: Apollo Lunar Surface Journal','https://www.hq.nasa.gov/alsj/main.html'],
  sur:['NASA Science: Surveyor 3','https://science.nasa.gov/mission/surveyor-3/'],
  surN:['NASA NSSDCA: Surveyor 3','https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A'],
  vik:['NASA Science: Viking 1','https://science.nasa.gov/mission/viking-1/'],
  pf:['NASA Science: Mars Pathfinder','https://science.nasa.gov/mission/mars-pathfinder/'],
  spi:['NASA Science: Spirit','https://science.nasa.gov/mission/mer-spirit/'],
  opp:['NASA Science: Opportunity','https://science.nasa.gov/mission/mer-opportunity/'],
  pho:['NASA Science: Phoenix','https://science.nasa.gov/mission/phoenix/'],
  ins:['NASA Science: InSight','https://science.nasa.gov/mission/insight/'],
  ing:['NASA Science: Ingenuity Mars Helicopter','https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/']
};
const link=k=>'<a href="'+S[k][1]+'" target="_blank" rel="noopener">'+S[k][0]+'</a>';

/* ---------- Objects ----------
   lat/lon: decimal degrees, east-positive, -180..180. Values published as 0-360 east are converted by
   subtracting 360 (for example Surveyor 3, 336.5820 E = -23.4180). landingLat/landingLon: where a moved
   object landed. Mars values are planetocentric, the spacing of the MDIM raster. */
const SITE_LEVEL='site-level (exact object position not surveyed)';
const LM='measured (Lunar Module, from LRO images)';
const LANDER='landing site (lander did not move)';

/* desc: the object's paragraph from ObjDesMap, verbatim (final copy: do not edit).
   img: the object photo, shown under the description on the map and in Story Mode.
   alt and caption describe the photo; the other img fields are its credit, listed in Scientific References. */
const nasaImg=id=>({imageId:id,source:'https://images.nasa.gov/details/'+id,original:'https://images-assets.nasa.gov/image/'+id+'/'+id+'~orig.jpg'});
const ITEMS = [
 {id:'eagle',world:'moon',name:'Lunar Module “Eagle” descent stage (Apollo 11)',label:'LM Eagle',mission:'Apollo 11',year:1969,lat:0.67416,lon:23.47314,positionType:LM,sourceKey:'lroc2016',src:['a11','alsj'],
  desc:'On July 20, 1969, Eagle carried Neil Armstrong and Buzz Aldrin to the first human landing on the Moon, then served as the launch platform that sent them home. Its lower half still stands in the Sea of Tranquility, next to a laser mirror that scientists are still using today.',
  img:{file:'assets/objects/eagle.webp',...nasaImg('as11-40-5927'),
   alt:'The Apollo 11 Lunar Module standing on the grey lunar surface, with an astronaut beside one of its legs.',
   caption:'Eagle at Tranquility Base on July 20, 1969, with Buzz Aldrin unpacking experiments beside it. The descent stage is the lower half, which stayed behind.',
   credit:'NASA',title:'View Apollo 11 Lunar Module as it rested on lunar surface',by:'Neil Armstrong, Apollo 11, Hasselblad camera, July 20, 1969',
   processing:'Cropped from 4095 × 4095 px to 4095 × 2730 px around the Lunar Module, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'surveyor',world:'moon',name:'Surveyor 3 lander',label:'Surveyor 3',mission:'Surveyor 3 + Apollo 12',year:1967,lat:-3.0162,lon:-23.4180,positionType:'measured (from LRO images)',sourceKey:'lroc2016',src:['sur','surN','a12'],
  desc:'This robotic scout bounced twice when its engine failed to shut off, then dug trenches proving the lunar soil could hold a crewed lander. Two and a half years later, Apollo 12 astronauts walked over to it — the first time humans ever visited a robot on another world — and took its camera and scoop back to Earth.',
  img:{file:'assets/objects/surveyor.webp',...nasaImg('AS12-48-7133'),
   alt:'Surveyor 3, a spindly three-legged lander, with an astronaut standing beside it and a second lander on the horizon.',
   caption:'Surveyor 3 in the Ocean of Storms, visited by the Apollo 12 crew on November 20, 1969. Their Lunar Module stands on the horizon.',
   credit:'NASA',title:'View of two U.S. spacecraft on the surface of the moon',by:'Apollo 12 crew, Hasselblad camera, November 20, 1969',
   processing:'Cropped from 5409 × 5409 px to 5409 × 3606 px, removing black sky, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'golf',world:'moon',name:'Golf balls (Apollo 14)',label:'Golf balls',mission:'Apollo 14',year:1971,lat:-3.64589,lon:-17.47194,positionType:SITE_LEVEL,sourceKey:'lroc2016',src:['a14','alsj'],
  desc:'On February 6, 1971, Alan Shepard fixed a six-iron head to a lunar sampling tool and swung one-handed, his bulky spacesuit allowing nothing more. He joked one ball flew “miles and miles and miles” — image analysis later measured about 24 and 40 yards — making golf the only sport ever played on the Moon.',
  img:{file:'assets/objects/golf.webp',...nasaImg('s71-20784'),
   alt:'A blurry television picture of an astronaut on the Moon lining up a golf shot, another astronaut watching.',
   caption:'No photograph of the golf balls exists. This is the Apollo 14 TV broadcast, photographed from a television monitor: Alan Shepard preparing to swing, Edgar Mitchell looking on.',
   credit:'NASA',title:'Television transmission at end of second extravehicular activity',by:'Apollo 14 TV camera on the lunar surface; frame photographed from a television monitor, February 1971',
   processing:'Cropped from 5124 × 3819 px to the screen (4612 × 3075 px), resized to 1200 × 800 px and saved as WebP.'}},
 {id:'laser',world:'moon',name:'Laser Ranging Retroreflector (Apollo 15)',label:'Retroreflector',mission:'Apollo 15',year:1971,lat:26.13341,lon:3.62850,positionType:'measured (from LRO images)',sourceKey:'nssdcSites',src:['a15','alsj'],
  desc:'A suitcase-sized array of 300 mirrors that needs no batteries, solar panels or moving parts. Laser pulses fired from Earth bounce back in about 2.5 seconds, measuring the Moon’s distance to the millimetre and revealing that it drifts about 3.8 cm farther away each year — measurements still being recorded in 2026.',
  img:{file:'assets/objects/laser.webp',imageId:'AS15-85-11468',source:'https://commons.wikimedia.org/wiki/File:AS15-85-11468_(21688216615).jpg',original:'https://upload.wikimedia.org/wikipedia/commons/e/e9/AS15-85-11468_%2821688216615%29.jpg',
   alt:'A square panel of round reflector cells resting on the lunar soil.',
   caption:'The Apollo 15 retroreflector array at Hadley, photographed by Dave Scott on July 31, 1971.',
   credit:'NASA (public domain); scan by the Project Apollo Archive, via Wikimedia Commons',title:'AS15-85-11468: Apollo 15 Laser Ranging Retroreflector',by:'David Scott, Apollo 15, Hasselblad camera, July 31, 1971',
   processing:'Cropped from 4075 × 3985 px to 4075 × 2717 px around the array, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'photo',world:'moon',name:'Family photograph (Apollo 16)',label:'Photograph',mission:'Apollo 16',year:1972,lat:-8.9734,lon:15.5011,positionType:SITE_LEVEL,sourceKey:'lroc2016',src:['a16','alsj'],
  desc:'On his final moonwalk, Charlie Duke laid a plastic-wrapped portrait of his wife and two sons on the lunar dust, signed on the back: “This is the family of Astronaut Duke from Planet Earth. Landed on the Moon, April 1972.” With no scientific purpose at all, it is one of the most human objects ever left on another world.',
  img:{file:'assets/objects/photo.webp',imageId:'AS16-117-18841',source:'https://commons.wikimedia.org/wiki/File:AS16-117-18841_(21688116471).jpg',original:'https://upload.wikimedia.org/wikipedia/commons/b/b2/AS16-117-18841_%2821688116471%29.jpg',
   alt:'A small family photograph in a clear plastic sleeve lying on grey lunar soil.',
   caption:'The Duke family portrait where Charlie Duke left it on the lunar surface, in his own photograph from April 1972.',
   credit:'NASA (public domain); scan by the Project Apollo Archive, via Wikimedia Commons',title:'AS16-117-18841: Portrait of the family of Charles Duke left on the lunar surface',by:'Charlie Duke, Apollo 16, Hasselblad camera, April 23, 1972',
   processing:'Cropped from 4175 × 4175 px to 2922 × 1948 px around the photograph, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'rover',world:'moon',name:'Lunar Roving Vehicle (Apollo 17)',label:'LRV',mission:'Apollo 17',year:1972,lat:20.1896,lon:30.7769,positionType:'measured (from LRO images)',sourceKey:'lroc2016',src:['a17','alsj'],
  desc:'The last rover ever driven on the Moon covered about 36 km and helped Cernan and Schmitt collect 110.5 kg of samples, including orange volcanic glass from Shorty Crater. It is still parked about 100 m from the lander, its camera facing the spot where the crew lifted off for home.',
  img:{file:'assets/objects/rover.webp',...nasaImg('as17-147-22526'),
   alt:'An astronaut driving the Lunar Roving Vehicle across grey lunar ground, a mountain behind.',
   caption:'Eugene Cernan test-driving the rover at the start of the first Apollo 17 moonwalk, December 11, 1972. This is not its final parking spot.',
   credit:'NASA',title:'Astronaut Eugene Cernan drives the Lunar Roving Vehicle during first EVA',by:'Apollo 17 crew, Hasselblad camera, December 11, 1972',
   processing:'Cropped from 3000 × 3000 px to 3000 × 2000 px around the rover, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'poop',world:'moon',name:'Waste containment bags (Apollo 11)',label:'Waste bags',mission:'Apollo 11',year:1969,lat:0.67416,lon:23.47314,positionType:SITE_LEVEL,sourceKey:'lroc2016',src:['alsj','a11'],
  desc:'To save weight for the precious Moon rocks, the first moonwalkers left their sealed bags of human waste behind at Tranquility Base. The least glamorous artefact on the Moon may yet prove useful: scientists have proposed studying such bags to learn whether microbes can survive decades on the lunar surface.',
  img:{file:'assets/objects/poop.webp',...nasaImg('PIA12909'),
   alt:'A black-and-white view from orbit of cratered ground, with labels marking the Eagle descent stage and the Apollo 11 experiments.',
   caption:'No photograph of the bags exists. This is Tranquility Base from orbit, imaged by NASA’s Lunar Reconnaissance Orbiter in 2009. The bags were left near the Eagle descent stage and are far too small to see.',
   credit:'NASA/GSFC/Arizona State University',title:'Apollo 11: Second Look',by:'Lunar Reconnaissance Orbiter Camera (LROC), Narrow Angle Camera, 2009',
   processing:'Cropped from 800 × 800 px to 800 × 533 px, keeping the labels and scale bar; not enlarged. Saved as WebP.'}},
 {id:'viking',world:'mars',name:'Viking 1 lander',label:'Viking 1',mission:'Viking 1 Lander',year:1976,lat:22.27,lon:-47.95,positionType:LANDER,sourceKey:'mars24',src:['vik','hiriseVL1'],
  desc:'The first successful U.S. Mars lander sent back the first photographs ever taken from the Martian surface and, built for 90 days, kept working for more than six years. Its air readings later proved that certain meteorites on Earth came from Mars — until a faulty software update in 1982 turned its antenna away from home.',
  img:{file:'assets/objects/viking.webp',...nasaImg('PIA00381'),
   alt:'Rocky Martian ground in black and white, with the round footpad of the lander in the lower right corner.',
   caption:'The first photograph taken on the surface of Mars, minutes after Viking 1 landed on July 20, 1976. The lander’s own footpad is at lower right.',
   credit:'NASA/JPL',title:'First Photograph Taken On Mars Surface',by:'Viking 1 lander camera, July 20, 1976',
   processing:'Cropped from 1439 × 512 px to the right-hand 768 × 512 px with the footpad; not enlarged. Saved as WebP.'}},
 {id:'sojourner',world:'mars',name:'Sojourner rover (Mars Pathfinder)',label:'Sojourner',mission:'Mars Pathfinder',year:1997,lat:19.086,lon:-33.237,positionType:'landing site (Pathfinder lander; rover final position not published in lat/lon)',sourceKey:'hirisePF',src:['pf'],
  desc:'Small enough to carry in your arms, Sojourner became the first wheeled vehicle to drive on another planet when it landed in Ares Vallis. Designed for just seven Martian days, it worked for 83, studying rocks and paving the way for every Mars rover since.',
  img:{file:'assets/objects/sojourner.webp',...nasaImg('PIA01122'),
   alt:'A small six-wheeled rover with a flat solar panel on top, on reddish rocky ground.',
   caption:'Sojourner on Mars in 1997, photographed by the camera on the Mars Pathfinder lander.',
   credit:'NASA/JPL',title:'Sojourner Rover Near “The Dice”',by:'Imager for Mars Pathfinder (IMP), on the Pathfinder lander, 1997',
   processing:'Cropped from 1276 × 1175 px to 1276 × 851 px around the rover, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'spirit',world:'mars',name:'Spirit rover (MER-A)',label:'Spirit',mission:'Mars Exploration Rover',year:2004,lat:-14.6,lon:175.5,landingLat:-14.57,landingLon:175.48,positionType:'final position (published to 0.1°)',sourceKey:'piaSpirit',src:['spi','mars24'],
  desc:'Spirit’s biggest discovery was an accident: dragging a broken front wheel through the dirt, it uncovered a mineral that forms around hot springs — proof that Mars was once warm and wet. Built for 90 days, it explored Gusev Crater for over six years before getting stuck in a sand trap engineers nicknamed “Troy”.',
  img:{file:'assets/objects/spirit.webp',...nasaImg('PIA16442'),
   alt:'Looking down on a dusty rover deck and its solar panels, the rover’s shadow on the sand beside it.',
   caption:'Spirit’s own deck and solar panels on Mars, from a self-portrait it assembled from its camera images (the McMurdo panorama).',
   credit:'NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.',title:'Spirit Mars Rover in McMurdo Panorama, Polar Projection',by:'Spirit rover, Panoramic Camera (Pancam)',
   processing:'Cropped from the 12953 × 12953 px polar projection to the rover at its center (6000 × 4000 px), resized to 1200 × 800 px and saved as WebP.'}},
 {id:'opportunity',world:'mars',name:'Opportunity rover (MER-B)',label:'Opportunity',mission:'Mars Exploration Rover',year:2004,lat:-2.335,lon:-5.348,landingLat:-1.95,landingLon:-5.53,positionType:'final position (center of HiRISE image containing the rover)',sourceKey:'hiriseOpp',src:['opp','mars24'],
  desc:'Meant to last three months, Opportunity explored for nearly fifteen years and drove more than 45 km — farther than any rover before it. It found tiny hematite-rich spheres nicknamed “Martian Blueberries”, strong evidence of ancient water, until a planet-wide dust storm cut its power in 2018.',
  img:{file:'assets/objects/opportunity.webp',...nasaImg('PIA17759'),
   alt:'An overhead self-portrait of a dusty rover: solar panels spread out around its camera mast.',
   caption:'Opportunity’s self-portrait on Mars, January 2014, ten years into a mission planned for three months.',
   credit:'NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.',title:'Self-Portrait by Opportunity Mars Rover in January 2014',by:'Opportunity rover, Panoramic Camera (Pancam), January 2014',
   processing:'Cropped from 3408 × 2772 px to 2726 × 1817 px around the rover, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'phoenix',world:'mars',name:'Phoenix lander',label:'Phoenix',mission:'Phoenix Mars Lander',year:2008,lat:68.22,lon:-125.75,positionType:LANDER,sourceKey:'mars24',src:['pho'],
  desc:'Built partly from spare parts and named after the bird that rises from the ashes, Phoenix landed closer to Mars’s north pole than any spacecraft before. It confirmed water ice beneath the surface and even watched snow falling from clouds about four kilometres overhead, before the arctic winter silenced it.',
  img:{file:'assets/objects/phoenix.webp',...nasaImg('PIA10793'),
   alt:'A round, fan-like solar panel in the foreground and a robotic arm with a scoop, over flat reddish ground.',
   caption:'One of Phoenix’s solar panels and its robotic arm on the Martian arctic plain, June 2008.',
   credit:'NASA/JPL-Caltech/University of Arizona/Texas A&M University',title:'Panorama of Phoenix Solar Panel and Robotic Arm',by:'Phoenix lander, Surface Stereo Imager, June 2008',
   processing:'Cropped from 2905 × 1935 px to 2902 × 1935 px, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'insight',world:'mars',name:'InSight lander',label:'InSight',mission:'InSight Lander',year:2018,lat:4.502384,lon:135.623447,positionType:'measured (lander did not move, from HiRISE image)',sourceKey:'golombek2020',src:['ins'],
  desc:'Instead of driving around, InSight stayed put and acted like a doctor checking Mars’s vital signs. It recorded the first marsquakes ever detected — more than 1,300 seismic events — and revealed that Mars has a molten core, until dust slowly smothered its solar panels in 2022.',
  img:{file:'assets/objects/insight.webp',...nasaImg('PIA25287'),
   alt:'A lander with two round solar panels thickly covered in reddish dust, on Martian ground.',
   caption:'InSight’s final selfie, April 24, 2022, its solar panels thick with dust.',
   credit:'NASA/JPL-Caltech',title:'InSight’s Final Selfie',by:'InSight lander, Instrument Deployment Camera on its robotic arm, April 24, 2022',
   processing:'Cropped from 4391 × 2635 px to 2722 × 1815 px around the lander, resized to 1200 × 800 px and saved as WebP.'}},
 {id:'ingenuity',world:'mars',name:'Ingenuity Mars Helicopter',label:'Ingenuity',mission:'Mars Helicopter',year:2021,lat:18.44,lon:77.45,positionType:'landing site (Perseverance; final position not verified)',sourceKey:'mars24',src:['ing'],
  desc:'On April 19, 2021, this 1.8 kg, softball-sized helicopter made the first controlled flight on another planet, its blades spinning about five times faster than an Earth helicopter’s to grip the thin air. Planned for five test flights, it flew 72 — carrying a tiny scrap of fabric from the Wright brothers’ first airplane.',
  img:{file:'assets/objects/ingenuity.webp',...nasaImg('PIA24542'),
   alt:'A small four-legged helicopter standing on the floor of a Martian crater, part of the Perseverance rover at right.',
   caption:'Ingenuity seen by Perseverance on the floor of Jezero Crater, April 6, 2021, before its first flight. This is not where it rests today.',
   credit:'NASA/JPL-Caltech/MSSS',title:'Perseverance’s Selfie with Ingenuity',by:'Perseverance rover, WATSON camera on its robotic arm, April 6, 2021',
   processing:'Cropped from the 12341 × 9076 px mosaic to 5553 × 3702 px around the helicopter, resized to 1200 × 800 px and saved as WebP.'}}
];
const BY = {}; ITEMS.forEach(it=>{ BY[it.id]=it; });

const WORLDS = {
  moon:{label:'Moon',view:{lat:6,lon:2,zoom:1},file:'assets/maps/moon_lroc_color_4096x2048.jpg',frame:'Mean Earth/Polar Axis',kmPerPx:2.665},
  mars:{label:'Mars',view:{lat:14,lon:-30,zoom:1},file:'assets/maps/mars_viking_mdim21_color_4096x2048.jpg',frame:'Planetocentric, east-positive',kmPerPx:5.21}
};

window.SLF={S,link,ITEMS,BY,WORLDS};
})();
