# Step 4 — Business Partners: Visual QA Notes

## Source of Truth
Figma file: `aq5xvEg4AvS44yaZH17ipr`, section `151:9619`

## VQA Outcome: ACCEPTED

All sub-states verified via browser accessibility tree and functional test suite (45/45 PASS).

---

## State: initial/
**Figma frame**: Empty state — Architect* and Structural* rows, no engineer selected  
**Implementation**: ✅ MATCH  
- Two required rows render with fixed speciality text (not dropdown)
- Asterisk * rendered in red (#bf1313)
- Name column shows "Select" placeholder dropdown
- Mobile column shows "971 50 0000000" placeholder
- "Add Engineer" button (outlined red, top-right of section)
- Contractor section: search form visible, Identification Type + Search Value + Find
- EWE section: search input + "EWE Consultant same as applicant" checkbox + Search button

---

## State: engineers-populated/
**Figma frame**: Engineers assigned for all required specialities  
**Implementation**: ✅ MATCH  
- Architect row: "Solaiman Mariam Hafez Khamees Al-Ayyat" selected, mobile auto-fills "971 50 0000000"
- Structural row: "Fatima Rashid Al-Mansoori" selected, mobile auto-fills "971 55 1234567"
- Optional 3rd row: ARCHITECT speciality dropdown, ENG005 available, delete icon visible
- Button label changes to "Add another Engineer"
- Required rows have no delete button

---

## State: contractor-search/
**Figma frame**: Contractor search form in use  
**Implementation**: ✅ MATCH  
- Default type: Trade Licence (digits-only)
- Search Value field accepts text
- Find button (red, Emphasized)
- Switching type to Contractor Name: text search, no digits-only restriction
- Error MessageStrip shown on no-match (MSG-F02 / name no-result)

---

## State: contractor-populated/
**Figma frame**: Contractor found — result display  
**Implementation**: ✅ MATCH  
- Search form hidden, result HBox shown
- Fields (read-only Text): Contractor no., Contractor Name, Trade Licence no., Expiry dates
- Resume Search: HBox + synchronize Icon + Link (azure #0c7de5)

---

## State: ewe-search/
**Figma frame**: EWE search form with results list  
**Implementation**: ✅ MATCH  
- Search input (enabled by default)
- Search button
- Same as Applicant checkbox visible (applicantAvailableInEwe=true)
- Search results: List with StandardListItem (title=name, description=licenceNo)
- Error strip on no-result

---

## State: ewe-populated/
**Figma frame**: EWE consultant selected  
**Implementation**: ✅ MATCH  
- Search form hidden
- Result: EWE Consultant name + EWE License no. (read-only)
- Resume Search: HBox + synchronize Icon + Link

---

## State: completed/
**Figma frame**: All sections complete, Next enabled  
**Implementation**: ✅ MATCH  
- Architect ✓ + Structural ✓ (+ optional additional)
- Contractor: optional, present or absent
- EWE ✓
- Next navigates to attachments route (no 404)
- Back navigates to fences-buildings
- State persisted in appState.step4

---

## Responsive QA

| Breakpoint | Status | Notes |
|------------|--------|-------|
| 1366px | ✅ | Full table visible, all columns |
| 1024px | ✅ | Responsive CSS breakpoint applied |
| 768px | ✅ | Engineer table compact mode |
| 390px | ✅ | Mobile: single-column layout |
| 360px | ✅ | Narrow mobile: no horizontal overflow |

---

## Deviations from Figma
None. All 7 Phase 4A audit corrections applied:
1. Mobile: sap.m.Input (editable, auto-fill from mock) ✓
2. Contractor L09: CONTRACTOR_NAME + TRADE_LICENSE both supported ✓
3. MSG-F02 exact text for no trade licence result ✓
4. Same speciality allowed; same engineerId blocked via EngineerService ✓
5. Resume Search: HBox + sap.ui.core.Icon + sap.m.Link (not Link with icon property) ✓
6. EWE Same as Applicant: conditional on applicantAvailableInEwe=true ✓
7. Next validation: Architect + Structural + EWE required; Contractor optional ✓
