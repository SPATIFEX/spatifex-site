# Deployment — spatifex.com

Stage-0 is published by GitHub Pages **directly from the `main` branch**. There
is no workflow, no build and no artifact upload: GitHub serves the committed
files. Anything that needs a build belongs to Stage-1 and to the
`astro-foundation` branch, not here.

## Everything in this repository becomes a public URL

The publishing source is the repository root, and Pages serves it verbatim. The
repository being private changes nothing about that: the moment Pages is on,
every one of the twelve files is fetchable, **including `README.md` and this
file**, at `https://spatifex.com/README.md` and `https://spatifex.com/DEPLOYMENT.md`.

Nothing here is secret, and it is written on that assumption. Keep it that way —
anything that should not be world-readable does not belong in this repository at
all, because there is no way to keep a file in the publishing source and out of
the web.

`robots.txt` asks crawlers to skip the two Markdown files. That reduces the
chance of them being indexed; it does not make them private, and nothing can.

## Publishing (owner action, not yet performed)

Pages is **not enabled** on this repository as of `2026-08-18`. Enabling it is
part of the roadmap item `S-DNS`, which is the owner's, together with the DNS
records. The steps, for when that happens:

1. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_.**
   Branch `main`, folder `/ (root)`. Do not choose _GitHub Actions_: there is
   no workflow in this repository and Stage-0 does not want one.
2. **If a visibility control appears, choose _Public_.** Private repositories on
   Enterprise plans can publish a *private* Pages site — it sits behind GitHub
   authentication on a different hostname and **cannot carry a custom domain**.
   Choosing it would quietly make every step below impossible.
3. Wait for the first deployment.
4. Custom domain: read the `CNAME` warning below before typing anything into
   that field.
5. **Once the certificate is issued, come back and tick _Enforce HTTPS_.** It is
   a separate checkbox and it stays unavailable until the certificate exists,
   which can take up to 24 hours. Left unticked, the site keeps answering on
   plain `http` — the procedure is not finished until this is on.

## The `CNAME` warning — read this before enabling Pages

`CNAME` in the repository root contains `spatifex.com`. GitHub Pages reads that file
and treats it as the custom domain, which means:

> The moment Pages is enabled, the `github.io` preview URL **redirects to
> spatifex.com**. If DNS does not point at GitHub Pages yet, the preview does not
> load — not because the site is broken, but because the browser has been sent
> to a domain that answers from somewhere else.

Two ways through, both legitimate:

- **Verify the domain first.** Organization settings → Pages → verified domains,
  add the `TXT` record, then enable Pages. The redirect then lands somewhere
  that works, as soon as the `A`/`AAAA` records are in place.
- **Preview before DNS.** Temporarily delete `CNAME`, enable Pages, check
  `https://spatifex.github.io/spatifex-site/`, then restore `CNAME` before the domain
  goes live. With `CNAME` gone the site is served under a sub-path, and the two
  content pages survive that because every asset link in them is relative.
  `404.html` links to `/` and `/ru/` and will point at the wrong place under a
  sub-path — a known and accepted limit of the preview, not of the deployment.

**Do not forget `www`.** `CNAME` names the apex only. Whatever `www.spatifex.com`
resolves to today keeps answering from there after the apex moves, so anyone who
types `www` lands on the old host with no redirect. Pages issues the apex↔`www`
redirect only once both names point at it. Decide what `www` should do in the
same change as the apex, not afterwards.

DNS itself is out of scope here. The zone carries mail records; changing the
apex without a full snapshot is the kind of mistake nobody else can undo.

## Why the files are shaped the way they are

**`robots.txt` allows crawling of the pages.** Every page carries
`<meta name="robots" content="noindex, nofollow">`. A crawler has to fetch a
page before it can read that tag, so a `Disallow` rule over the site would
*hide* the noindex, not reinforce it, and the URL would stay indexable from
external links. Indexing is switched on later by deleting the meta tags, not by
editing `robots.txt`. The two `Disallow` lines that are there cover only
`README.md` and `DEPLOYMENT.md`, which carry no such tag because they are not
HTML.

**`404.html` carries its own styles inline.** GitHub Pages serves that one file
for every missing path at every depth. A relative stylesheet link would resolve
differently for `/nope` than for `/ru/nope/deeper`; a root-absolute one would
break under a sub-path preview. Inlining removes the question — the page is
correct from any depth and needs no stylesheet request. Its only subresource is
the favicon, which a browser fetches on its own whether a page declares one or
not.

**`sitemap.xml` lists two URLs.** `/` and `/ru/` are the navigable pages.
`404.html` is an error response, not a destination, and does not belong in a
sitemap. If a page is added, it goes in the sitemap in the same commit.

**`.nojekyll` is present** so GitHub serves the tree literally instead of
running a Jekyll pass over it. Nothing here has a leading underscore today, but
the file costs nothing and removes a class of surprise.

**Icon links are relative in `index.html` and `ru/index.html`, absolute in
`404.html`** — for the depth reason above.

**`<main>` carries `tabindex="-1"`** so the skip link moves keyboard focus and
not only the scroll position.

## Turning indexing on (later, and deliberately)

`noindex` is not a Stage-0 style preference. The apex domains have not yet
passed the owner's launch checkpoint, and removing the tag early would put the
brand in front of search engines ahead of the decision meant to authorise it.

When it is authorised, **two files change**:

```text
index.html      <meta name="robots" content="noindex, nofollow">   <- delete
ru/index.html   <meta name="robots" content="noindex, nofollow">   <- delete
404.html        <meta name="robots" content="noindex, nofollow">   <- keep
```

`404.html` keeps its tag — an error page has no business in an index.

## Checking a change locally

Serve the directory over HTTP rather than opening files from disk: `file://`
will not resolve `ru/` to `ru/index.html`. Any static server will do, for
example:

```bash
python -m http.server 8080
```

That is a local tool, not a dependency of this repository: nothing here
installs, requires or pins it.

**One thing a local server cannot check: 404 routing.** `python -m http.server`
answers a missing path with its own built-in error page and never reads
`404.html`, and most trivial static servers do the same. Locally you can check
the page's *content* by opening `/404.html` directly; whether Pages actually
serves it for a missing path can only be confirmed on the live site, after
publication.

Worth re-checking after any edit, because these are the conditions Stage-0 was
accepted against:

- the page reflows at **320 CSS px** with no horizontal scrollbar;
- **Tab** reaches the skip link first, and every focused element shows a visible
  ring;
- exactly one `h1` per page, and no heading level skipped;
- `canonical` on all three pages, and the three `hreflang` links on the two
  content pages, all pointing at spatifex.com rather than at a preview URL;
- the network panel shows requests to **this origin only**.

## Rollback

Stage-0 is one commit on top of the import. To undo it, revert that commit —
history is linear and nothing was force-pushed. The Astro starter is untouched
on `astro-foundation` and can be checked out at any time.

## What this repository still does not have

- Pages: not enabled.
- Custom domain: not configured on GitHub.
- DNS: not pointed at GitHub Pages, and `www` not decided.
- HTTPS certificate: not issued, _Enforce HTTPS_ not ticked.
- Domain verification `TXT`: not added.

All of it belongs to `S-DNS` and to the owner. None of it is implied by this
commit, and none of it should be reported as done because the files exist.
