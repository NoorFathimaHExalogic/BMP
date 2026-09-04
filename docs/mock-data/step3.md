# Step 3 Mock Data Reference

Source file: `webapp/model/mock/referenceData.json`

## Building Types (L06)
| Key | Text |
|---|---|
| BT-01 | Industrial Building |
| BT-02 | Investment Villa |
| BT-03 | Multi-Storey Building |
| BT-04 | Private Villa |
| BT-05 | Public Building |
| BT-06 | Service Block |
| BT-07 | Story Building |

## Building Shapes (L01)
| Key | Text |
|---|---|
| BS-01 | Regular |
| BS-02 | Irregular |

## Foundation Types (L11)
| Key | Text |
|---|---|
| FT-01 | Isolated Foundation |
| FT-02 | Pile Foundation |
| FT-03 | Raft Foundation |
| FT-04 | Strip Foundation |

## Slab Systems (L07)
| Key | Text | Default |
|---|---|---|
| SS-01 | Other | |
| SS-02 | Post-Tensioned (PT) | |
| SS-03 | Reinforced Concrete (RC) | ✓ |
| SS-04 | Steel | |

## Fence/Wall Types (L08)
| Key | Text |
|---|---|
| FW-01 | Boundary Wall (Reinforced Concrete & Concrete Blocks) |
| FW-02 | Metal Fence (Metal Chain-link, rods and columns) |
| FW-03 | Retaining Wall (Reinforced Concrete Wall) |

Maximum 3 fence records (one per type). Add Fence button is disabled when all types are already used.

## Usage Type Mapping (usageTypesMap)
**Source provenance: FRONTEND_MOCK** — The complete Building Type → Usage Type matrix is not available in the approved BRD or Figma sources. A representative subset is provided. The mapping is stored under `_meta.usageTypesMap.source = "FRONTEND_MOCK"` in referenceData.json.

When backend/OData integration is implemented, this should be replaced with a live lookup against the SAP system's usage type catalog for the selected building type.

## Floor Composition Defaults
| Floor | Default | Notes |
|---|---|---|
| Basement | 0 | |
| Lower Ground | 0 | |
| Ground/Upper | 1 | Read-only |
| Mezzanine | 0 | |
| Typical Floors | 1 | Mandatory, min=1 |
| Unique Floors | 0 | Enabled only when Typical > 2 |
| Roof | 0 | |
| Podium | 0 | |
| Penthouse | 0 | |
| Helipads | 0 | |
| Service Floor | 0 | |

## Floor Summary Formula
Non-zero floors concatenated with "+", count prefix if value > 1:
- `B` = Basement, `LG` = Lower Ground, `G` = Ground/Upper
- `M` = Mezzanine, `F` = Typical Floors, `U` = Unique Floors
- `R` = Roof, `P` = Podium, `Pent` = Penthouse
- `H` = Helipads, `S` = Service Floor

Example: Basement=1, Ground=1, Mezzanine=2, Typical=3, Unique=1, Roof=1 → `B+G+2M+3F+U+R`

## Structural Features (Mandatory group, optional individual selection)
- Transfer Elements
- Floor Non-Typicality
- Frames
- Third-Party Design Involved
- Outriggers / Mega Columns / Connected Bridge

No minimum selection enforced. Group is always rendered. See `STRUCTURAL_FEATURE_MIN_SELECTION` comment in controller.
