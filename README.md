# Shegx — Olusegun Adewole

Personal portfolio website for Olusegun Adewole (Shegx): sports and media professional,
operations leader, talent scout and Firecrackers FC captain, based in Lagos, Nigeria.

Static site — no build step, no framework, no dependencies.

## Structure

```
├── index.html        Single-page site (hero, roles, expertise, best fit, writing, contact)
├── css/
│   └── styles.css    Design tokens + all styling (Anton/Archivo, neo-brutalist system)
├── js/
│   └── main.js       Interactivity: hero slideshow, role filter, audience tabs,
│                     Substack feed, copy-to-clipboard
└── assets/           Photography (JPEG, max 1920px wide)
```

## Run locally

Any static file server works, e.g.:

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly also works, but the Substack feed fetch needs an
http(s) origin in some browsers.

## Writing section

The "Notes from Shegx" section pulls the four latest posts from
[shegx07.substack.com](https://shegx07.substack.com) via the public
[rss2json](https://rss2json.com) API. Responses are cached in `localStorage`;
if the feed is unreachable, the bundled fallback posts in `js/main.js`
(`DEFAULT_POSTS`) are shown instead.

## Deploying

Push to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
No configuration needed — the site is the repository root.
