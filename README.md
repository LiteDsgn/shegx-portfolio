# Shegx: Olusegun Adewole

Personal portfolio website for Olusegun Adewole (Shegx): active footballer and
personal football trainer, team captain at Firecrackers FC, creative director,
operations specialist, brand-builder and writer, based in Lagos, Nigeria.

Static site with no build step, no framework, and no dependencies.

## Structure

```
├── index.html        Single-page site (hero, profile, highlights, roles,
│                     brands, journey, best fit, writing, philosophy, contact)
├── css/
│   └── styles.css    Design tokens + all styling (Anton/Archivo, neo-brutalist
│                     collage system: hard borders, tape, torn-paper dividers)
├── js/
│   └── main.js       Interactivity: hero slideshow, role filter, audience tabs,
│                     Substack feed, match-tapes video cards, lightbox,
│                     copy-to-clipboard
├── assets/           Photography (WebP), favicon
│   ├── logos/        Brand marks (see its README)
│   └── videos/       Match highlight clips (see its README)
├── data/
│   └── posts.json    Committed snapshot of the latest Substack posts
├── scripts/
│   ├── fetch_substack_posts.py   Refreshes data/posts.json (stdlib only)
│   └── generate_torn_paper.py    Generates the torn-paper divider SVG paths
└── .github/workflows/
    └── substack-posts.yml        Scheduled Action that keeps posts.json current
```

## Run locally

Any static file server works, e.g.:

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly also works, but the writing-feed fetches need an
http(s) origin in some browsers.

## Writing section

The "Notes from Shegx" section shows the latest posts from
[shegx07.substack.com](https://shegx07.substack.com). Freshness comes in
layers: a `localStorage` cache renders instantly, then the committed snapshot
`data/posts.json` (kept current every 6 hours by the GitHub Action) refreshes
it, with the public [rss2json](https://rss2json.com) API as a network fallback.
If everything is unreachable, the bundled `DEFAULT_POSTS` in `js/main.js` show
instead.

## Deploying

Push to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
No configuration needed. The site is the repository root.
