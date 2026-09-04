# Step 3 — Fences & Buildings: Visual QA Comparison Notes

## Figma Reference
- File key: `aq5xvEg4AvS44yaZH17ipr`
- Step 3 section node: `136:8647`
- Populated screen nodes found: `136:8661` (1366×679), `136:8662`, `136:8663`
- Delete Building dialog node: `136:8653`
- Add Building dialog frames: NOT DISCOVERABLE via MCP node probing (FIGMA_CONTEXT_LIMITATION documented)

---

## State: Main — Empty (no buildings/fences)

### Match
- RAK header, stepper at Step 3 active (red circle "3"), steps 1+2 green ✓: MATCH
- "Building List" section title, "Add Building" button (red/Emphasized): MATCH
- Table columns: Building Name | Building Type | Types and no. of Floors | actions: MATCH
- "No buildings added yet." noDataText: MATCH
- "Fence/Wall List" section, "Add Fence" button (outlined red/Default): MATCH
- Fence table columns: Type* | Length (m)* | Height (m)* | No. of Gates* | actions: MATCH
- "No fences added." noDataText: MATCH
- Footer: Back (outlined) | Next (red filled): MATCH
- Context bar: Owner | Project | Address: MATCH

### Deviations
- None significant. Content max-width card layout matches Figma 1366px frame.

---

## State: Add Building Dialog — Step 1 (General Information)

### Match (BRD-derived, Figma dialog frames not accessible)
- Dialog title "Add Building": MATCH BRD
- Sub-header step indicator "Step 1 of 3: General Information": IMPLEMENTED per BRD
- Building Type (required Select): IMPLEMENTED
- Usage Type (MultiComboBox, enabled only after Building Type selected): IMPLEMENTED
- No. of Typical Buildings (StepInput, min=1): IMPLEMENTED
- Building Name Optional (Input): IMPLEMENTED
- Buttons: Cancel (outlined) | Previous (disabled at step 1) | Next (emphasized): IMPLEMENTED

### Deviations
- Figma dialog frames not discoverable via node probing; implementation based on BRD spec.
- Dialog design tokens applied from Delete Building dialog reference: navy title, Poppins Medium 18px, red sub-header background.

---

## State: Add Building Dialog — Step 2 (Floor Composition)

### Match
- All 11 floor fields rendered in 2-column layout: MATCH BRD
- Ground/Upper as read-only Input (value=1): MATCH BRD
- Unique Floors disabled when Typical < 3: IMPLEMENTED per BRD
- Previous/Next buttons: MATCH

### Deviations
- None.

---

## State: Add Building Dialog — Step 3 (Structural Details)

### Match
- Building Height (m) required Input: MATCH
- No. of Expansion Joints (StepInput, min=0): MATCH
- Building Shape, Foundation Type, Slab System Selects (required): MATCH
- Slab System defaults to "Reinforced Concrete (RC)" (SS-03): MATCH BRD L07
- 5 CheckBoxes for Structural Features (optional individual): MATCH BRD
- "Save Building" button replaces "Next" on step 3: MATCH

### Deviations
- None.

---

## State: Main — Buildings + Fences Added

### Match
- Building rows in table: displayName | buildingTypeText | floorSummary | kebab menu
- Floor summary format "G+F", "G+2F", "B+G+2M+3F+U+R" (non-zero floors only, count prefix if >1): MATCH Figma formula
- Fence rows: fenceTypeText (full BRD wording) | length | height | numberOfGates | kebab menu
- Add Fence button disabled after 3 fences added: MATCH BRD (max 3 = one per L08 type)

### Deviations
- Figma fence "Type" column shows shortened text in confirmed node 136:8661; full BRD text used in implementation (no abbreviation found in BRD/Figma spec — kept full text).

---

## State: Delete Building Dialog (MSG-C05)

### Figma Reference: node 136:8653 confirmed
- Title: BRD text used ("Are you sure you want to delete this Building?") vs Figma Title Case — BRD wins per Phase 3A decision.
- Confirmed design tokens applied: navy Poppins title, Cancel outlined, Delete/OK emphasized.

---

## Responsive QA Summary

| Breakpoint | Status | Notes |
|---|---|---|
| 1366px | PASS | Full layout, max-width card centered |
| 1024px | PASS | Padding reduced to 32px |
| 768px | PASS | Fence form stacks vertically |
| 390px | PARTIAL | Tables scroll horizontally inside overflow-x container |
| 360px | PARTIAL | Same as 390px |

Mobile breakpoints (390/360): table horizontal scroll works; "Add Building" text may wrap inside button — acceptable given SAPUI5 Emphasized button constraints.

---

## Figma Context Limitations

- `FIGMA_CONTEXT_LIMITATION`: Add Building dialog step frames (General Info / Floor Composition / Structural Details) not discoverable via node probing due to SSE parser truncation at the section level. Implementation is BRD-first, confirmed against available design tokens from Delete Building dialog (node 136:8653).
- Source URLs not embedded in production code per project constraint.
