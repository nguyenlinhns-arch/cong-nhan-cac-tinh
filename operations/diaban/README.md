# Địa bàn v2

Published route: `/diaban/`. Source files: `tuyen-tho-mo/diaban/`.

The public site starts with artificial demonstration data clearly labelled throughout the page, detail dialog and CSV export. Real summaries are opened from a local JSON file via the browser File API. No network upload, data API, tracking, browser storage, credentials or source spreadsheet IDs are included.

The 12 province names describe the intended coverage. All demo counts and commune names are synthetic. Do not copy the demo counts into reports.

Data validation reconciles commune + unmapped groups with province totals, and yearly student totals with province totals. Historical removal, leave and graduation events are independent; removal must not be interpreted as a verified dropout or current status.

Run checks:

```
node --test operations/diaban/model.test.cjs
node tools/validate-diaban.cjs
```

Deployment keeps this standalone app out of recruitment branding/SEO transforms, then restores the unchanged source before publishing. No private JSON, CSV, imported HTML, raw roster or contact research belongs in the public site tree.
