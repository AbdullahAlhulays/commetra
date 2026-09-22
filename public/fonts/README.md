# Thmanyah Sans (خط ثمانية)

The Arabic face for the whole product. The `@font-face` rules live in
`src/styles/globals.css`; **the font files themselves are not in this
repository** and have to be added here by hand.

## What to add

Download **Thmanyah Sans** from <https://font.thmanyah.com>, convert each
weight to `woff2`, and save them in this folder under exactly these names:

| Weight            | File                      |
| ----------------- | ------------------------- |
| رفيع — Light      | `thmanyah-sans-300.woff2` |
| عادي — Regular    | `thmanyah-sans-400.woff2` |
| متوسط — Medium    | `thmanyah-sans-500.woff2` |
| سميك — Bold       | `thmanyah-sans-700.woff2` |
| ثقيل — Heavy      | `thmanyah-sans-800.woff2` |

Nothing else needs changing. Until the files exist the rules simply fail to
resolve and Arabic renders in IBM Plex Sans Arabic, exactly as it did before —
the site is not broken by their absence, it just is not using Thmanyah yet.

Only the Sans family is wired. The Serif Display and Serif Text families are
not used anywhere in the product.

## Why Latin is unaffected

Each `@font-face` is scoped with `unicode-range` to Arabic codepoints, so
Latin always falls through to IBM Plex whatever glyphs the Thmanyah files turn
out to contain. Platform names, handles and numerals therefore keep rendering
in the Latin face on purpose rather than by accident.

## Licence

The font is free and the licence permits commercial use on websites, but it
forbids redistributing, sharing, uploading or hosting the font files
independently — embedding is allowed only as part of a packaged product. See
<https://font.thmanyah.com/licenses>.

Two consequences worth knowing:

- **This repository is public.** Committing the `woff2` files here puts them
  at a public URL as files rather than as part of a built product, which is
  the case the licence is most pointed about. If that matters, add
  `public/fonts/*.woff2` to `.gitignore` and upload the files to the host
  directly instead.
- **Do not install a third-party npm package for this font.** One exists
  (`@dawod/thmanyah-font-web`), but it is an unofficial repackaging by a
  single maintainer — which is exactly the redistribution the licence
  prohibits, on top of being a supply-chain dependency for a typeface.
