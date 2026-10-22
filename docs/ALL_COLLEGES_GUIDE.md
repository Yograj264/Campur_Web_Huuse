# All Colleges page

The directory follows the supplied reference with a college discovery hero, catalogue counts, search, quick filters, filter sidebar, cards, grid/list controls, location links and a comparison panel. It uses the existing college API and preserves college details navigation.

## Editing files

- `src/screens/CollegesScreen.jsx`: layout, search, filtering, sorting, shortlist and comparison.
- `src/screens/CollegesScreen.css`: purple theme, card layout and responsive breakpoints.
- The existing Django College records provide names, locations, programmes, annual fees, institution types, accreditation, entrance examinations and images. Edit these through Django admin.
- `public/landing/campus-future.png`: reused existing hero artwork. No new illustration was generated for this page.

## Controls

Search matches all entered words across name, location, programmes and type. Checkbox filters use OR within a section and AND across sections. Options and counts come from available catalogue values. Fee ranges use annual fees in lakh INR. Clear All also clears search and saved-only mode. Sort supports relevance (images first), name, and fee ascending/descending.

Save uses browser local storage (`campus-college-shortlist`), shared with home and college details. It is device-local, not account synchronised. Grid/List changes the result layout. Compare checkboxes select up to five colleges; Quick Compare adds the card and opens a native dialog. The dialog supports Escape and its Close button, and displays missing values as Not listed.

The right panel uses Google Maps search links for actual catalogue locations. Its decorative location graphic is not an interactive map. Campus coordinates are not currently supplied. The reference's unverified ratings, student review totals and fabricated catalogue counts were not copied. Colleges to Explore reflects current results rather than an unsupported ranking.

## Validation and preview

`npm run lint` and `npm run build` passed. Browser checks verified location filtering, grid/list switching, text search and a two-college comparison. The 1280px layout has no horizontal overflow. Screenshot: `docs/all-colleges-preview.png`.

To view, open the running application and click Colleges. After future frontend edits run `npm run build`; restart Django if using `--noreload`, then refresh. No database migration is needed for this redesign.
