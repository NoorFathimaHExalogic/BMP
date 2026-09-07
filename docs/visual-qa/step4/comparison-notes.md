# Step 4 — Business Partners: Visual QA Notes

## Source of Truth
Figma file: `aq5xvEg4AvS44yaZH17ipr`, section `151:9619`

## VQA Status: PENDING SCREENSHOT EVIDENCE

Screenshot capture was attempted (initial state at 1366px, populated state at 1366px) but failed
consistently due to the Claude desktop app window being behind another window during both sessions.
The browser screenshot tool timed out; this is a rendering environment limitation, not a page error.

Do not interpret this as visual acceptance. A human reviewer must bring the browser pane to the
foreground and capture the screenshots before this section can be marked ACCEPTED.

---

## Functional Sub-State Verification (structural, not screenshot comparison)

All 7 sub-states verified via SAPUI5 control registry inspection and functional test suite (45/45 PASS).

### State: initial/
**Figma frame**: Empty state — Architect* and Structural* rows, no engineer selected
**Structural check**: ✅ CONFIRMED
- Two required rows in engineer table (grid with column headers)
- `isRequired=true` on both rows; no delete control on required rows
- Name column: Select placeholder; Mobile column: placeholder text
- Add Engineer button present (top-right of section)
- Contractor: search form visible with Identification Type + Search Value + Find
- EWE: search input + Same as Applicant checkbox + Search button
- Footer: Back + Next buttons present
- Stepper: 5+ list items present (Select Project, Permit Information, Fences & Buildings, Business Partners, Attachments, Summary)

### State: engineers-populated/
**Figma frame**: Engineers assigned for all required specialities
**Structural check**: ✅ CONFIRMED
- Architect row: ENG001 selected, mobile auto-filled "971 50 0000000"
- Structural row: ENG002 selected, mobile auto-filled "971 55 1234567"
- Mobile inputs: 2 sap.m.Input controls with binding context /engineers/0 and /engineers/1
- Button label observed as "Add another Engineer" (Add Engineer before first optional row)

### State: contractor-search/
**Figma frame**: Contractor search form in use
**Structural check**: ✅ CONFIRMED
- Default type: Trade Licence
- L09 contains both CONTRACTOR_NAME and TRADE_LICENSE
- Find button fires onFindContractor
- No-match for TRADE_LICENSE → exact MSG-F02 text verified

### State: contractor-populated/
**Figma frame**: Contractor found — result display
**Structural check**: ✅ CONFIRMED
- contractorResultVisible=true when result found
- contractorSearchVisible=false
- 2 Resume Search links found in registry (contractor + EWE)

### State: ewe-search/
**Figma frame**: EWE search form with results list
**Structural check**: ✅ CONFIRMED
- eweSearchVisible=true initially
- Same as Applicant checkbox conditional on applicantAvailableInEwe
- Search returns results (eweResults.length > 0)

### State: ewe-populated/
**Figma frame**: EWE consultant selected
**Structural check**: ✅ CONFIRMED
- eweResultVisible=true after selection
- eweSearchVisible=false
- Resume Search link present

### State: completed/
**Figma frame**: All sections complete, Next enabled
**Structural check**: ✅ CONFIRMED
- _isStep4Valid() returns true when: Architect assigned + valid mobile, Structural assigned + valid mobile, EWE selected
- Contractor is optional (Next passes without contractor)
- Next navigates to "attachments" route; Step 5 placeholder loads (no 404)
- Back navigates to "fences-buildings"

---

## Responsive QA — Populated State (5 Viewports)

Verified via browser resize + `document.documentElement.scrollWidth` overflow check + SAPUI5
control registry inspection. Screenshot not available (see VQA Status above).

| Breakpoint | docWidth | No Overflow | Eng Rows | Mobile Inputs | Contractor | EWE | Resume Search | Back/Next | Stepper |
|------------|----------|-------------|----------|---------------|------------|-----|---------------|-----------|---------|
| 1366px | 1366 | ✅ | ✅ | 2 | ✅ | ✅ | 2 links | ✅ | ✅ |
| 1024px | 1024 | ✅ | ✅ | 2 | ✅ | ✅ | 2 links | ✅ | ✅ |
| 768px  | 768  | ✅ | ✅ | 2 | ✅ | ✅ | 2 links | ✅ | ✅ |
| 390px  | 390  | ✅ | ✅ | 2 | ✅ | ✅ | 2 links | ✅ | ✅ |
| 360px  | 360  | ✅ | ✅ | 2 | ✅ | ✅ | 2 links | ✅ | ✅ |

---

## Deviations from Figma

Cannot confirm zero deviations without screenshot evidence. Known structural alignment:
1. Mobile: sap.m.Input (editable, auto-fill from mock) ✓
2. Contractor L09: CONTRACTOR_NAME + TRADE_LICENSE both supported ✓
3. MSG-F02 exact text for no trade licence result ✓
4. Same speciality allowed; same engineerId blocked via EngineerService ✓
5. Resume Search: HBox + sap.ui.core.Icon + sap.m.Link ✓
6. EWE Same as Applicant: conditional on applicantAvailableInEwe=true ✓
7. Next validation: Architect + Structural + EWE required; Contractor optional ✓
8. MSG-V01 mapping corrected: msgV01Required="This field is required." (was incorrectly using msgV02Required) ✓

Visual pixel-level comparison against Figma frames: **PENDING HUMAN REVIEW**
