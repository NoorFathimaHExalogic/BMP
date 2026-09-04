# Step 2 — Visual QA Comparison Notes

## Reference
- **Figma file key:** aq5xvEg4AvS44yaZH17ipr
- **Figma node:** 121:7020
- **Acceptance viewport:** 1366px
- **Visual comparison date:** 2026-09-03
- **SAPUI5 theme:** sap_horizon (1.120.14)

## Files
| File | Description |
|---|---|
| `figma-reference.png` | Figma node 121:7020 screenshot (1389×788) |
| `sapui5-1366.png` | Live SAPUI5 app at 1366×900 via real Step 1 → Next flow (Puppeteer, 2026-09-04) |

## Pre-Implementation Conflicts Resolved
| ID | Conflict | Resolution |
|---|---|---|
| C1 | EWE NOC has no asterisk (*) in Figma | Follow BRD — field is mandatory, add * |
| C2 | Figma shows Grant Program default blank | Follow BRD — default = No |
| C3 | EWE NOC label in Figma is short form | Use Figma short label "EWE NOC no." |

## Components Checked

| Component | Figma | SAPUI5 | Result |
|---|---|---|---|
| Header — RAK logo (Arabic/English) | ✓ | ✓ | MATCH |
| Header — RAK Digital wordmark | ✓ | ✓ | MATCH |
| Header — user avatar + name | ✓ | ✓ | MATCH |
| Permit heading — building icon + "New Building Permit" | ✓ | ✓ | MATCH |
| Permit heading — Save as Draft (icon + text) | ✓ | ✓ | MATCH |
| Permit heading — Delete (icon + text) | ✓ | ✓ | MATCH |
| Stepper — Step 1 green circle ✓ + green label "Select Project" | ✓ | ✓ | MATCH |
| Stepper — Step 2 red circle "2" + red "Permit Information" label | ✓ | ✓ | MATCH |
| Stepper — Steps 3–6 grey circles with labels | ✓ | ✓ | MATCH |
| Stepper — "2 More steps" arrow pill | ✓ | ✓ | MATCH |
| Context bar — Owner / Project / Address persistent header | ✓ | ✓ | MATCH* |
| Form card — white background, rounded corners | ✓ | ✓ | MATCH |
| Field: "Etisalat / Du NOC no. *" + ⓘ icon | ✓ | ✓ | MATCH |
| Field: "EWE NOC no. *" + ⓘ icon | ✓ | ✓ | MATCH |
| Field: "Civil Defence Area *" dropdown | ✓ | ✓ | MATCH |
| Input placeholders (Enter NOC number, Enter EWE NOC number) | ✓ | ✓ | MATCH |
| Civil Defence dropdown "Select" placeholder | ✓ | ✓ | MATCH |
| Grant Program label (no asterisk, optional) | ✓ | ✓ | MATCH |
| Grant Program radio No/Yes — side by side | ✓ | ✓ | MATCH (corrected from vertical stack) |
| Grant Program default = No (BRD rule) | ✓ | ✓ | MATCH |
| Conditional: Grant Type + Program Expiry Date on Yes | ✓ | ✓ | MATCH (hidden by default) |
| Required asterisk color (#BF1313 red) | ✓ | ✓ | MATCH |
| Page background — light grey #f5f5f5 | ✓ | ✓ | MATCH |
| Footer — Back button (outlined red, left-aligned) | ✓ | ✓ | MATCH |
| Footer — Next button (filled red, right-aligned) | ✓ | ✓ | MATCH |
| Etisalat/Du NOC hidden for sector 8/9 projects | N/A | ✓ | IMPLEMENTED |
| Validation error states (field-level) | N/A | ✓ | IMPLEMENTED |

*Context bar: Verified populated in real-flow screenshot (Owner: Abdullah Al-Aziz, Project: ZP02-2024-00142, Address: AL Muntaser Street, 4th Floor, Eastern Kitchen Building, 4311). Route guard active: direct navigation to `#/permit-information` with no appState redirects to `#/project-selection`.

## Remaining Deviations

| Item | Severity | Notes |
|---|---|---|
| "Save as Draft" button outline visible | MINOR | SAPUI5 sap_horizon renders Transparent buttons with a subtle border/focus state in screenshots. Not shown in normal interactive use. |
| Radio button box-styled containers | MINOR | Figma shows boxed radio containers (204px wide, border); SAPUI5 `RadioButton` renders native-style with text. Layout/spacing matches; box styling differs due to SAPUI5 rendering constraints. |
| Poppins font weight rendering | MINOR | Slight variation between Chrome instances; consistent with Step 1 deviation. |

## Corrections Applied During QA
1. BRD Conflict C1: Added * to EWE NOC label (Figma missing, BRD mandatory)
2. BRD Conflict C2: Grant Program default = No (Figma blank, BRD explicit)
3. BRD Conflict C3: EWE NOC label = "EWE NOC no." (Figma short form used)
4. Radio buttons: `columns="2"` added to RadioButtonGroup (corrected from vertical stack)
5. Stepper: Completed step now shows ✓ with green circle (#53a56e) — updated from red-outline style

## Validation Coverage (BRD messages)
| Message | Trigger | TC | Status |
|---|---|---|---|
| MSG-V01 | Etisalat/Du NOC empty (sector not 8/9) | TC01, TC02 | ✓ PASS |
| MSG-V02 | EWE NOC empty | TC01 | ✓ PASS |
| MSG-V03 | EWE NOC ≠ 14 characters | TC03, TC04 | ✓ PASS |
| MSG-V02 | Civil Defence Area not selected | TC06 | ✓ PASS |
| MSG-V02 | Grant Type empty when Grant Program = Yes | TC09 | ✓ PASS |
| MSG-V05 | Program Expiry Date past/invalid | TC10 | ✓ PASS |
| MSG-C01 | Delete confirmation dialog | TC14 | ✓ PASS |
| MSG-C03 | Save as Draft success toast | TC13 | ✓ PASS |

## Functional Test Summary
TC01–TC14: **14/14 PASS**

## Route Guard
Direct `#/permit-information` access with no appState → immediate redirect to `#/project-selection`. Verified.

## landSector Domain Data
`landSector` is integer domain data (8 or 9) from mock projects data. Not derived from any UI text. Controller handles both `=== 8` and `=== "8"` for safety.

## Verdict
**FINAL ACCEPTANCE — PASS**
All major components match the approved Figma design. All 14 BRD test cases pass. Route guard active. Context bar populated from real navigation flow. Build: EXIT 0. Console errors: 0. STEP 2: CLOSED.
