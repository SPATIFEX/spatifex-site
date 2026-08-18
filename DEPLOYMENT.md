# Deployment — spatifex.com

Stage-0 is published by GitHub Pages **directly from the `main` branch**. There
is no workflow, no build and no artifact upload: GitHub serves the committed
files. Anything that needs a build belongs to Stage-1 and to the
`astro-foundation` branch, not here.

## Publishing (owner action, not yet performed)

Pages is **not enabled** on this repository as of `2026-08-18`. Enabling it is
part of the roadmap item `S-DNS`, which is the owner's, together with the DNS
records. The steps, for when that happens:

1. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_.**
   Branch `main`, folder `/ (root)`. Do not choose _GitHub Actions_: there is
   no workflow in this repository and Stage-0 does not want one.
2. Wait for the first deployment.
3. Custom domain: see the warning below before typing anything into that field.

## The `CNAME` warning — read this before enabling Pages

`CNAME` in the repository root contains `spatifex.com`. GitHub Pages reads that
file and treats it as the custom domain, which means:

> The moment Pages is enabled, the `github.io` preview URL **redirects to
> spatifex.com**. If DNS does not point at GitHub Pages yet, the preview does not
> load — not because the site is broken, but because the browser has been sent
> to a domain that answers from somewhere else.

Two ways through, both legitimate:

- **Verify the domain first.** Organization settings → Pages → verified domains,
  add the `TXT` record, then enable Pages. The redirect then lands somewhere
  that works, as soon as the `A`/`AAAA` records are in place.
- **Preview before DNS.** Temporarily delete `CNAME`, enable Pages, check
  `https://spatifex.github.io/spatifex-site/`, then restore `CNAME` before the
  domain goes live. With `CNAME` gone the site is served under a sub-path, and
  the two content pages survive that because every asset link in them is
  relative. `404.html` links to `/` and `/ru/` and will point at the wrong
  place under a sub-path — that is a known and accepted limit of the preview,
  not of the deployment.

DNS itself is out of scope here. The zone carries mail records; changing the
apex without a full snapshot is the kind of mistake nobody else can undo.

## Why the files are shaped the way they are

**`robots.txt` allows crawling.** Every page carries
`<meta name="robots" content="noindex, nofollow">`. A crawler has to fetch a
page before it can read that tag, so a `Disallow` rule would *hide* the
noindex, not reinforce it, and the URL would stay indexable from external links.
Indexing is switched on later by deleting the three meta tags, not by editing
`robots.txt`.

**`404.html` carries its own styles inline.** GitHub Pages serves that one file
for every missing path at every depth. A relative stylesheet link would resolve
differently for `/nope` than for `/ru/nope/deeper`; a root-absolute one would
break under a sub-path preview. Inlining removes the question — the page is
correct from any depth and makes no additional request at all.

**`sitemap.xml` lists two URLs.** `/` and `/ru/` are the navigable pages.
`404.html` is an error response, not a destination, and does not belong in a
sitemap. If a page is added, it goes in the sitemap in the same commit.

**`.nojekyll` is present** so GitHub serves the tree literally instead of
running a Jekyll pass over it. Nothing here has a leading underscore today, but
the file costs nothing and removes a class of surprise.

**Icon links are relative in `index.html` and `ru/index.html`, absolute in
`404.html`** — for the depth reason above.

## Turning indexing on (later, and deliberately)

`noindex` is not a Stage-0 style preference. It is there because the apex
domains have not passed the owner's trademark checkpoint. Removing it before
that checkpoint would publish the brand to search engines ahead of the decision
that is supposed to authorise it.

When it is authorised, three files change:

```text
index.html      <meta name="robots" content="noindex, nofollow">
ru/index.html   <meta name="robots" content="noindex, nofollow">
404.html        <meta name="robots" content="noindex, nofollow">
```

Delete the tag from the first two. **Keep it on `404.html`** — an error page has
no business in an index.

## Checking a change locally

The content pages use relative links, so opening `index.html` from the file
system mostly works, but `file://` will not resolve `ru/` to `ru/index.html`
and will not serve `404.html` for a missing path. For anything you intend to
trust, serve the directory over HTTP with whatever static server is already on
the machine, for example:

```bash
python -m http.server 8080
```

That is a local tool, not a dependency of this repository: nothing here installs,
requires or pins it.

Worth re-checking after any edit, because these are the conditions Stage-0 was
accepted against:

- the page reflows at **320 CSS px** with no horizontal scrollbar;
- **Tab** reaches the skip link first, and every focused element shows a visible
  ring;
- exactly one `h1` per page, and no heading level skipped;
- `canonical` and the three `hreflang` links point at spatifex.com, not at a
  preview URL;
- the network panel shows requests to **this origin only**.

## Rollback

Stage-0 is one commit on top of the import. To undo it, revert that commit —
history is linear and nothing was force-pushed. The Astro starter is untouched
on `astro-foundation` and can be checked out at any time.

## What this repository still does not have

- Pages: not enabled.
- Custom domain: not configured on GitHub.
- DNS: not pointed at GitHub Pages.
- HTTPS certificate: not issued.
- Domain verification `TXT`: not added.

All five belong to `S-DNS` and to the owner. None of them are implied by this
commit, and none of them should be reported as done because the files exist.
