You are working on **Space Lost & Found**, a static three-page site (plain HTML/CSS/JS, no build step, no frameworks) in this repository. Read `README.md` first: it lists every file and what it does. I want four upgrades. The two source documents are:

- `ObjDesMap.pdf` (repo root): short object descriptions for the Map Explorer popups.
- `C:\Users\jakub\OneDrive\Desktop\StoModInf.pdf`: long story texts for Story Mode.

Read both PDFs in full before you plan anything.

## Ground rules (apply to everything)

1. **The text in both PDFs is final copy.** Reproduce it word for word: same words, numbers, units, quotes, dashes, italics and bold. Do not summarise, shorten, reword, "improve" or add facts. Do not add citations, source links or "references" to any text taken from these files.
   - You MAY fix only PDF-extraction artifacts and pure spacing/punctuation slips: words split by line-break hyphenation (`onehanded` → `one-handed`, `laserranging` → `laser-ranging`, `nuclearpowered` → `nuclear-powered`), missing spaces (`planet.Originally`, `Launch:July`, `impact:The`, `surface.This`, `Now?Over`) and doubled stops (`Mars. .`, `detected. .`).
   - Anything else that looks wrong (for example "A ultra-sensitive") stays as written. List it in your final report as a question for me.
   - Every fix you make goes in a list in your final report.
2. You may do background research (NASA pages, mission facts) **only** to decide which text belongs to which object. Research never changes the text.
3. Keep the site's existing conventions: shared data lives in `assets/js/data.js` (`window.SLF`), the header is built by `assets/js/site-header.js`, colours and fonts are the tokens in `assets/css/site.css` (Newsreader / Public Sans / IBM Plex Mono, square corners, `--viridian` accent, `--crimson` for Mars, `--night` hero), and motion goes through `reveal.js` / `motion-boot.js` with `prefers-reduced-motion` respected. No new libraries, no CDN scripts.
4. Do not commit or push. I will review the diff.

## Step 0: plan first, then wait

Before editing any file, show me a plan containing:

- **Table A**: every ObjDesMap entry → the `id` in `ITEMS` (`assets/js/data.js`) it belongs to.
- **Table B**: every StoModInf section → the `id` it belongs to, or "not a map object".
- **The 6 chapters**: name, the 2 object ids in each, and the order.
- **The object left out of Story Mode** and why (see Upgrade 3).
- **The 2 photos** you propose for Upgrade 1, with their NASA source pages.
- **Table C** (Upgrade 5): for each of the 14 objects, the photo you propose, with:
  - its image ID and source page,
  - what it actually shows (the object on the surface, an orbital view of the site, or a pre-launch or test photo),
  - its licence or credit.

Then stop and wait for my approval.

## Upgrade 4 (do first): only the Apollo 11 waste bags remain

In `ITEMS` (`assets/js/data.js`) the `poop` object has a `sites` array with six Apollo sites, `mission:'Apollo 11 to 17'` and `yearLabel:'1969–1972'`. Turn it into a single Apollo 11 object:

- Remove `sites` and `yearLabel`.
- Set `mission:'Apollo 11'`, `year:1969`, and keep the Apollo 11 coordinates (`0.67416, 23.47314`).
- Trim `src` to the Apollo 11 sources (`alsj`, `a11`).
- Make `name` read like the other objects, e.g. `Waste containment bags (Apollo 11)`.

Then search the whole repo for leftovers: `sites`, `six Apollo sites`, `96`, `Apollo 11 to 17`, `1969–1972`, `a whole-disc view` (the comment and branch in `focusObject` in `assets/js/map.js`), the story text for `poop`, and the rows `references.js` builds from `it.sites`. Keep the generic `it.sites||[it]` handling in code only if it is still harmless; update comments so nothing describes six sites.

Note: the bags now sit on the exact same coordinates as the Eagle. Check that the marker-stacking logic (`CLUSTER_PX`, leader lines in `map.js`) shows both labels legibly.

## Upgrade 2: real descriptions in the Map Explorer popups

Today every popup shows the word "Description": `DESCRIPTION_PLACEHOLDER` in `assets/js/map.js`, used in `openPopup()`.

1. Add a `desc` field to each object in `ITEMS` (`data.js`), holding the matching ObjDesMap paragraph. The data stays in one place; the order of ObjDesMap already follows `ITEMS`, but match on name and mission, not position.
2. Make `openPopup()` show `BY[id].desc`. Delete `DESCRIPTION_PLACEHOLDER` and update the README line that mentions it.
3. Do **not** copy the italic note under the waste-bag entry ("Not covered in StoModInf …"). Use the waste-bag paragraph itself, but list in your report that ObjDesMap flags it as unverified.
4. The popup is `width:min(250px,…)` in `assets/css/map.css` and was sized for one word. Re-size it for ~60-word paragraphs, e.g. wider on desktop with a sensible `max-height` and internal scroll. Check that `placePopup()` still keeps it inside the stage at 375 px and 1280 px widths, on both worlds, including objects near the globe's edge.
5. Keep using `textContent`, not `innerHTML`, unless you need markup (you shouldn't).

## Upgrade 3: redesign Story Mode as 6 named chapters × 2 objects

Files: `story.html`, `assets/js/story.js`, `assets/css/story.css`.

Today Story Mode has 16 screens: intro, 14 objects in `STORY_ORDER`, outro. Each object is narrated by a first-person `VOICE` text. Replace that with:

- **6 chapters, each with exactly 2 objects, each chapter with a name you write** (short, evocative, in the site's tone, e.g. "Chapter 3 · …"). Group objects so each pair makes sense together (same world, theme or era) and the chapters read in a sensible order (roughly chronological, Moon then Mars, unless your plan argues otherwise). Chapter names are the only new copy you may write.
- **Object text = the StoModInf section for that object, verbatim** (Ground rule 1), replacing `VOICE` entirely.
  - Keep the section's structure: headline, italic tagline when there is one, intro paragraphs, the "at a Glance" / "What made them special?" list as a list, and the "A lasting … impact", "An unexpected ending" / "How it ended", "A memorable moment", "Note" and "Where is it now?" blocks as labelled blocks.
  - Store this text as structured data (e.g. a `STORY_TEXT` object keyed by `id`), not as one HTML blob, so it can be styled and read aloud.
- **Mapping notes from me:**
  - The Apollo 11 section belongs to `eagle`. Use the whole section, including its bullets on the retroreflector and the seismic experiment.
  - The golf section has no headline in the PDF. It starts "On February 6, 1971…". Use the object's `name` from `data.js` as its title; do not invent a headline. Do the same wherever a section lacks one.
  - The line "Lasers mirrors apollo 15" is a working note, not a heading. Ignore it.
  - The ALSEP section is not a map object. Leave it out and say so in the report.
- **12 slots, 13 candidates.** StoModInf covers 13 map objects; the waste bags have no StoModInf text and are not in Story Mode. You choose which one object to leave out of Story Mode and justify it in the Step 0 plan. One strong candidate is the Apollo 15 retroreflector, whose science overlaps the Apollo 11 text. The left-out object stays on the map with its popup.
- **Keep what works:**
  - "Show on map" per object (`index.html?world=…&object=…`)
  - the per-object "Sources:" line built from `it.src` (existing, not new references)
  - Back / Next / Start again
  - read-aloud, which must now read the object's StoModInf text, as plain text with labels
  - stopping speech on `pagehide`
- Replace the 14-dot timeline (`.timeline`, `repeat(14,…)`) with a 6-chapter progress navigation. Name each chapter in its `aria-label` and keep `aria-current="step"`.
- The intro/outro texts in `STORY`, the lede in `story.html` ("One chapter per object, in chronological order.") and the Story blurb in `site-header.js` now describe the old structure. Change only what has become false, keep the rest of the wording, and show me those diffs.
- **Make it visually striking, but on-brand:**
  - Each chapter as a full-width section, with a mono eyebrow ("Chapter 02 of 06"), the chapter name in Newsreader, and the two objects side by side on wide screens, stacked on mobile.
  - "At a glance" facts as a clean definition grid.
  - The italic tagline as a pull quote.
  - Moon vs Mars accents from the existing tokens.
  - Subtle reveal motion through the existing `reveal` classes.
  - It must work at 375 px with no horizontal scroll, be fully keyboard navigable, and keep AA contrast. Whether one chapter shows at a time (current pager model) or all chapters scroll with a sticky chapter nav is your call; justify it in the plan.

## Upgrade 1: title-band photos on Story Mode and Scientific References

The Map Explorer already has photo title bands: `BANDS` in `assets/js/site-header.js`, rendered only when `current==='map'`, styled in `assets/css/map.css` (`.title-band`, `.band-img`, inline base64 blur placeholders, a 74 % tinted scrim in `.title-band::after`). `story.html` and `references.html` still show the plain `--night` background.

1. Pick **two different real photographs**: one for Story Mode, one for Scientific References.
   - Each must be relevant to the page, NASA / public domain, landscape, dark enough to carry white text, and different from the two existing Moon/Mars bands.
   - Suggestions: Earthrise (Apollo 8) or an Apollo surface photo for Story; an orbiter or observatory image for References. Use only `images.nasa.gov` / `photojournal.jpl.nasa.gov` originals.
2. Process them exactly like the existing bands. See the "Processing" rows in `references.html` → "Title band imagery": crop to the subject, resize to 2560 px wide at a similar aspect, save as WebP in `assets/title-bands/` with a descriptive name, and make a tiny base64 blur placeholder. First check which tool is available (Pillow, `cwebp`, ImageMagick); if none is, ask me rather than installing anything system-wide.
3. Generalise the band code instead of duplicating it:
   - Move the shared `.title-band` / `.band-img` / scrim rules from `map.css` into `site.css`.
   - Keep the map-only theme tinting in `map.css`.
   - Let `site-header.js` render one band per page.
   - Add a `<link rel="preload" as="image">` in each page's `<head>` like `index.html` has.
   - Check that the heading, nav and blurb keep AA contrast over the brightest part of each photo.
4. Add both photos to the "Title band imagery" section of `references.html` in the same format as the existing two (Title, Image ID, Taken by, Source, Original file, Credit, Processing). Update that section's lede, which currently says the photos are only on The Map Explorer.

## Upgrade 5: a photo of every object, in the Map Explorer and Story Mode

Search the internet for a real photograph of each of the 14 objects in `ITEMS`. Show it **under the object's description** in two places: the Map Explorer popup (below the ObjDesMap text) and Story Mode (below the object's StoModInf text, above "Show on map").

1. **Sources.** Search in this order of preference:
   - NASA image libraries: `images.nasa.gov`, `photojournal.jpl.nasa.gov`, the Apollo Lunar Surface Journal / Project Apollo Archive (AS-numbered frames), and LROC / HiRISE for orbital views.
   - Only if none of those has a photo of the object, a Wikimedia Commons file that is explicitly public domain or CC BY / CC BY-SA. Record its author and licence.
   - Never use stock-photo sites, AI-generated images, renders presented as photos, or anything without a clear licence.
2. **Accuracy beats beauty.** A photo of the object itself on the Moon or Mars comes first, then an orbital photo of it or its site, then a pre-launch, test or replica photo.
   - Anything that isn't the real object in place must be labelled honestly in the caption, e.g. "Spirit during pre-launch testing" or "Ingenuity seen by Perseverance".
   - Some objects have no direct photo (likely the golf balls and the waste bags). For those, use the most honest related image, e.g. a still from the Apollo 14 TV broadcast or the Tranquility Base site photo. Say clearly in the caption what it shows. If nothing honest exists, show no image for that object and tell me.
3. **Processing.** Download the originals, then crop to the subject and resize to ~1200 px on the long side.
   - Save as WebP in `assets/objects/<id>.webp` and keep the files small, roughly under 200 KB each.
   - Use the same tool you checked for in Upgrade 1.
4. **Data.** Add an `img` field to each object in `ITEMS` (`data.js`):
   - `{file, alt, caption, credit, imageId, source, original}`
   - `alt` and `caption` are the only new text you may write here: short, factual, describing what the image shows.
   - The description text from Ground rule 1 is untouched.
5. **Map popup** (`openPopup()` in `map.js` and `.popup` in `map.css`).
   - Render a `<figure>` with the image and a small caption plus credit line below the description.
   - Give the image a fixed aspect-ratio box, and use `loading="lazy"` and `decoding="async"`, so the popup does not jump while it loads.
   - Re-check the Upgrade 2 sizing: the popup with image must still fit inside the stage at 375 px and must not cover the selected marker. Use internal scroll if needed.
   - If an image fails to load, hide the figure instead of showing a broken icon.
6. **Story Mode.** Use the same `<figure>` pattern below each object's text, styled to match the chapter design. On wide screens the two objects in a chapter should have images of matching height.
   - The object left out of Story Mode still gets its image on the map.
7. **Credits.** Add a new "Object photographs" section to `references.html`, after "Title band imagery", in the same format: Title, Image ID, Taken by, Source, Original file, Credit, Processing.
   - These are image credits for the photos, not references attached to the ObjDesMap or StoModInf text, so they are allowed. Do not put links into the descriptions themselves.
   - Add `assets/objects/` to the README file table.

## Verification (do all of it, report results)

1. Serve with `python -m http.server 8000` and open all three pages. There must be no console errors.
2. Check each page at 375 px and 1280 px, and with reduced motion on.
3. Map: open every object's popup on both worlds. Each shows its ObjDesMap paragraph. The Moon list shows 7 objects with one waste-bag marker.
4. Story: go through all 6 chapters forward, back and via the chapter nav. Test "Show on map" from one Moon and one Mars object, and read-aloud.
5. **Verbatim check**: write a small throwaway script (not committed) that extracts the PDF text, normalises whitespace and the allowed artifact fixes, and compares it with the strings now in `data.js` / `story.js`. Paste its pass/fail summary.
6. References: the site table no longer has six waste-bag rows, and the two new title-band credits and all object-photo credits render.
7. Images: every `img.file` exists, every image loads (check the Network panel, no 404s), every image has `alt` text, and the total size of `assets/objects/` is reported.

## Final report

- What changed, per upgrade, with file paths.
- The chapter list.
- The object left out of Story Mode and why.
- Every text fix you made under Ground rule 1.
- Every suspected error you left untouched.
- For every object photo: what it shows and whether it is the real object in place.
- Any object you left without a photo.
- Anything you could not verify.
