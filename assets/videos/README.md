# Match highlight clips

Short match clips that power the "Match tapes" strip at the top of the
Football Highlights section. Cards autoplay muted on a loop; clicking one
opens the lightbox and plays the full clip with sound.

## Adding a clip

1. Drop the MP4 in this folder, following the existing naming:
   `highlight01.mp4`, `highlight02.mp4`, ...
2. Add an entry to `MATCH_TAPES` in `js/main.js`:
   `{ title: 'Match highlight 04', detail: 'Firecrackers FC', src: 'assets/videos/highlight04.mp4' }`
   (`detail` is the caption on the card; `poster` is optional.)

## Format

- **MP4** (H.264 video, AAC audio) so every browser plays them.
- **Short**: roughly 6 to 20 seconds each (goal, skill, assist).
- **Compressed**: aim for under about 5 MB per clip so the page stays quick.
- Landscape (16:9) fits the card crop best; vertical clips get letterboxed.
- Optional: a matching poster image (e.g. `highlight04.webp`) referenced via
  the `poster` field, shown before the clip loads.
