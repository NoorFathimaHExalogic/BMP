# Figma Asset Manifest — Step 1 (Project Selection)

Source file: aq5xvEg4AvS44yaZH17ipr (DML)
Source page: ZP02
Source node: 30:3069 — Build a building - Stap 1 - Project Selection
Downloaded: 2026-09-03 (Phase 0 Foundation)

All URLs were temporary Figma MCP URLs — download is the authoritative source.
Do NOT reference Figma MCP asset URLs from production code.

---

## Brand Assets (Required for header implementation)

| Local Filename | Figma Node / Source | Figma Layer ID | Size | Intended Usage |
|---|---|---|---|---|
| `rak-municipality-logo.svg` | Header Desktop / Phase 1 → logo frame | `I30:3071;4694:12976` | 54 KB | RAK Municipality logo — left side of application header |
| `rak-digital-wordmark.svg` | Header Desktop / Phase 1 → rak digital instance | `I30:3071;3810:13135` | 10 KB | RAK Digital wordmark — right side of application header |
| `header-full-export.svg` | Header Desktop / Phase 1 — full render | `30:3071` | 76 KB | Reference only — visual verification of complete header layout. Do NOT use as an image tag in production. |

## Icon Assets (from header, may be needed in Step 1 implementation)

| Local Filename | Figma Layer Name | Size | Intended Usage |
|---|---|---|---|
| `icon-user-avatar-large.svg` | User w (32×32px, Union) | 1.5 KB | Logged-in user avatar in header |
| `icon-user-avatar-small.svg` | Union (26×26px) | 1.6 KB | Secondary user avatar variant |
| `icon-chevron-down.svg` | Arrow dropdown (16×9px) | 661 B | Dropdown indicator in header user menu |
| `icon-chevron-down-small.svg` | Arrow dropdown small (8×5px) | 661 B | Small dropdown chevron |
| `icon-divider-vertical-a.svg` | Vector 2533 (1×16.5px, #C0C0C0) | 256 B | Header vertical separator line |
| `icon-divider-vertical-b.svg` | Vector 2532 (1×16.5px, #C0C0C0) | 256 B | Header vertical separator line (second) |
| `icon-secondary-a.svg` | Group (23×23px) | 1.5 KB | Unconfirmed — verify during header implementation |

---

## Assets NOT Downloaded (excluded — OS/browser chrome decoration)

| Figma Variable | Reason Excluded |
|---|---|
| `imgTaskbar` / Taskbar node (30:3099) | Windows taskbar simulation — decorative, not part of application |
| `imgIcon` / Chrome Toolbar node (30:3070) | Browser chrome simulation — decorative, not part of application |
| `imgIcon4`, `imgIcon5` | Chrome toolbar sub-icons — decorative |
| `imgEnd` | Chrome toolbar end graphic — decorative |

---

## Notes for Phase 1 Header Implementation

- The municipality logo (`rak-municipality-logo.svg`) should be referenced as a static asset in the SAPUI5 `webapp/assets/` path.
- Both the municipality logo and RAK Digital wordmark are customer brand assets — do NOT redraw, regenerate, or substitute.
- UI5 icon library (`sap-icon://`) should be evaluated first for generic icons (arrows, chevrons) before using the Figma SVG versions.
- `header-full-export.svg` is a visual reference only — it contains the complete header rendered as a single SVG and should be used for fidelity comparison, not embedded directly.
