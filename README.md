# Space Lost & Found

A three-page atlas of hardware NASA left on the Moon and Mars, drawn on an orthographic globe with real orbital mosaics. It is plain HTML, CSS and JavaScript with no build step, and all links are relative, so it runs on any static host.

| Page | Purpose |
| --- | --- |
| `index.html` | The Map Explorer: the globe, world switch and object list |
| `story.html` | The Story Mode: six chapters of two objects each, with read-aloud |
| `references.html` | Scientific References: coordinates, map details and sources |

The Map Explorer opens a specific object from the URL: `index.html?world=<moon|mars>&object=<id>`.

## Running it

The site must be served over HTTP. Opening `index.html` directly (`file://`) will not work: the globe reads map pixels with `getImageData`, which the browser blocks for `file://` images, and the page shows an error in the viewport.

```
python -m http.server 8000
```

Then open <http://localhost:8000/>. All testing was done through a local HTTP server.

Web fonts load from Google Fonts. Everything else is local.

## Files

| Path | Purpose |
| --- | --- |
| `assets/js/data.js` | Shared data: sources, objects and world settings |
| `assets/js/site-header.js` | Shared header, title-band photo, page selector and page descriptions |
| `assets/js/map-boot.js` | Reads the URL and sets the Map Explorer theme before first paint |
| `assets/js/map.js` | Globe renderer, markers, popup and world switch |
| `assets/js/story.js` | Story text, the six chapters, chapter navigation and read-aloud |
| `assets/js/references.js` | Sortable site table, object-photo credits and source list |
| `assets/js/motion-boot.js` | Runs in `<head>`: enables reveals and detects view-transition arrivals |
| `assets/js/reveal.js` | One-time load and scroll reveals |
| `assets/css/site.css` | Shared styles, color tokens, title band, object photo figure, reveal and page-transition motion |
| `assets/css/map.css` | Map Explorer styles and the Moon and Mars themes |
| `assets/css/story.css` | Story Mode styles |
| `assets/css/references.css` | Scientific References styles |
| `assets/maps/moon_lroc_color_4096x2048.jpg` | Moon mosaic |
| `assets/maps/mars_viking_mdim21_color_4096x2048.jpg` | Mars mosaic |
| `assets/title-bands/` | Title-band photos for all three pages; sources and credits are in Scientific References |
| `assets/objects/` | One photo per object (`<id>.webp`, 3:2), shown in the map popup and Story Mode; credits are in Scientific References |

## Map files

**Moon.** NASA Scientific Visualization Studio, CGI Moon Kit, <https://svs.gsfc.nasa.gov/4720>, file `lroc_color_16bit_srgb_4k.tif` (2025 version, 4096 × 2048). Converted to 8-bit JPEG, quality 88, with no resize. Please credit NASA's Scientific Visualization Studio.

**Mars.** Viking MDIM 2.1 colorized global mosaic, <https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m>. The copy used is the public-domain 1 km/px JPEG on Wikimedia Commons, `Mars_Viking_MDIM21_ClrMosaic_1km.jpg` (21339 × 10670), resampled to 4096 × 2048 with a Lanczos filter and saved as JPEG, quality 88.

Both rasters are equirectangular and centered on 0° longitude. The renderer takes their size from the decoded image.

## Editing the data

- Objects are in the `ITEMS` array in `assets/js/data.js`. `lat` and `lon` are decimal degrees, east-positive, −180 to 180. Mars latitudes are planetocentric. Each entry names its source through `sourceKey`, a key of the `S` table.
- Popup text is each object's `desc` field in `ITEMS` (the ObjDesMap paragraph), and its photo is the `img` field: `{file, alt, caption, credit, imageId, source, original}` plus `title`, `by` and `processing` for the credits.
- Story Mode text is `STORY_TEXT` in `assets/js/story.js` (the StoModInf sections, verbatim), grouped into chapters by `CHAPTERS`.
- Map Explorer colors are the `--theme-*` tokens at the top of `assets/css/map.css`. Text on the light page background uses the `--theme-page-*` tokens, and control outlines use `--theme-control`.
