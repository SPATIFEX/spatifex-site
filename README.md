# spatifex-site

Stage-0 placeholder for **spatifex.com** — plain HTML and CSS, published straight from
`main` by GitHub Pages. There is no build step, and adding one is a Stage-1
decision, not a maintenance detail.

## What is here

Twelve files, and the count is the specification rather than an accident:

| File | What it is |
|---|---|
| `index.html` | English page |
| `ru/index.html` | Russian page |
| `404.html` | Error page, self-contained (see `DEPLOYMENT.md`) |
| `styles.css` | The only stylesheet the two content pages load |
| `favicon.svg` | Icon, vector |
| `favicon.ico` | Icon, 32×32, for clients that still ask for it |
| `robots.txt` | Allows crawling so the page-level `noindex` can be read |
| `sitemap.xml` | The two navigable pages, and only those |
| `CNAME` | `spatifex.com` — read by GitHub Pages, inert until DNS points here |
| `.nojekyll` | Serve the tree as-is, no Jekyll pass |
| `README.md` | This file |
| `DEPLOYMENT.md` | How it is published, and what is deliberately not switched on |

## What is deliberately absent

No npm, no `package.json`, no lockfile, no Node.js, no Astro, no bundler, no
build step, no GitHub Actions. No runtime JavaScript on any page. No forms, no
analytics, no cookies, no trackers, no web fonts, no external scripts, no
external images, no iframes, no third-party requests of any kind.

The site therefore collects nothing about anyone who visits it. That is not a
policy statement — it is a property of the files, and it is checkable by reading
them.

## Where the Astro starter went

The reviewed Astro starter imported into this repository as `a836519` is
**not deleted**. It lives on the `astro-foundation` branch, unchanged, and it
is the foundation for Stage-1. Stage-0 took `main` because `main` is what
GitHub Pages publishes.

Nothing about the repository identity changed in that move: same repository,
same URL, same history, same future domain.

## Claims policy

Every statement on these pages is limited to `IN_DEVELOPMENT`. No capability
is described as available, no release exists, and no date is announced. When
that stops being true, the pages change first and this line changes with them.

## Editing

Open a file, edit it, commit. Check `DEPLOYMENT.md` before changing anything in
`<head>`, in `robots.txt` or in `CNAME`: those four surfaces carry reasons
that are not obvious from the markup.
