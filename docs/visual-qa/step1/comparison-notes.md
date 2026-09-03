# Step 1 — Visual QA Comparison Notes

## Reference
- **Figma file key:** aq5xvEg4AvS44yaZH17ipr
- **Figma node:** 30:3069
- **Acceptance viewport:** 1366px
- **Visual comparison date:** 2026-09-03
- **SAPUI5 theme:** sap_horizon (1.120.14)

## Files
| File | Description |
|---|---|
| `figma-reference.png` | Figma node 30:3069 screenshot (1265×1600, source 1389×1758) |
| `sapui5-1366.png` | Live SAPUI5 app at 1366×900 via Playwright (system Chrome) |

## Components Checked

| Component | Figma | SAPUI5 | Result |
|---|---|---|---|
| Header — RAK logo (Arabic/English) | ✓ | ✓ | MATCH |
| Header — "rak digital" wordmark | ✓ | ✓ | MATCH |
| Header — user avatar + "Abdullah Al-Aziz" | ✓ | ✓ | MATCH |
| Permit heading — building icon + "New Building Permit" | ✓ | ✓ | MATCH |
| Permit heading — Save as Draft (icon + text) | ✓ | ✓ | MATCH |
| Permit heading — Delete (icon + text) | ✓ | ✓ | MATCH |
| Stepper — Step 1 red circle "Select Project" active | ✓ | ✓ | MATCH |
| Stepper — Steps 2–6 grey circles with labels | ✓ | ✓ | MATCH |
| Stepper — "2 More steps" arrow pill | ✓ | ✓ | MATCH |
| Section title "Select Project" | ✓ | ✓ | MATCH |
| Section description text | ✓ | ✓ | MATCH |
| Filter — "Project Role" placeholder | ✓ | ✓ | MATCH |
| Filter — "Status" placeholder | ✓ | ✓ | MATCH (corrected from "All Statuses") |
| Filter — "Creation Date" placeholder | ✓ | ✓ | MATCH |
| Search field with magnifying glass icon | ✓ | ✓ | MATCH |
| Result count format "N of M Projects found" | ✓ | ✓ | MATCH |
| Card row 1: "Project no. X \| Date" (pipe separator) | ✓ | ✓ | MATCH (corrected from spaces) |
| Card row 1: status badge — right-aligned | ✓ | ✓ | MATCH |
| Card row 2: "Parcel ID X \| Owner Y" inline | ✓ | ✓ | MATCH |
| Card row 3: address left-aligned | ✓ | ✓ | MATCH |
| Card row 3: "Full Details" with document icon | ✓ | ✓ | MATCH (corrected — sap.m.Link replaced with HBox+Icon+Link) |
| Status badge "Opened" — blue | ✓ | ✓ | MATCH |
| Status badge "Permit Issued" — purple | ✓ | ✓ | MATCH |
| Status badge "Under Construction" — orange | ✓ | ✓ | MATCH |
| Status badge "Partially Completed" — lavender | ✓ | ✓ | MATCH |
| Status badge "Complete" — green (text corrected from "Completed") | ✓ | ✓ | MATCH |
| Selected card — red border | ✓ | ✓ | MATCH (#eb3642, applied via .rakCardSelected) |
| Pagination controls | ✓ | ✓ | MATCH |
| Footer bar | ✓ | ✓ | MATCH |
| Next button — right-aligned, emphasized | ✓ | ✓ | MATCH |

## Remaining Deviations

| Item | Severity | Notes |
|---|---|---|
| Content max-width | MINOR | Figma design uses a constrained content column (~1100px); SAPUI5 implementation fills viewport with padding. Not specified in BRD. |
| Card shadow depth | MINOR | Figma cards show a subtle box-shadow; SAPUI5 renders a 1px border. Consistent with sap_horizon theme defaults. |
| Poppins font weight precision | MINOR | Poppins is loaded via Google Fonts. Exact weight rendering varies slightly between Chrome instances. |

## Corrections Applied During QA
1. MSG-C01: "application" → "request" (BRD exact wording)
2. MSG-C03: exact BRD wording — "Your request has been saved as a draft."
3. Status filter placeholder: "All Statuses" → "Status"
4. COMPLETED badge display text: "Completed" → "Complete"
5. "Full Details": `sap.m.Link` (no icon) → `HBox + sap.ui.core.Icon(detail-view) + sap.m.Link`
6. Card date separator: invisible spaces → visible " | " pipe character
7. `.rakCard__date-sep` CSS: `color: transparent` → `color: var(--rak-color-text-mid)`

## Verdict
**PASS** — All major components match the approved Figma design.
Remaining deviations are MINOR and do not affect functional correctness or BRD compliance.
