# Service Layer — rak.zp02

## Architecture

```
View (XML)
  ↓
Controller (.controller.js)
  ↓
Service (service/*.js)          ← domain logic, independent of backend technology
  ↓
Adapter (service/adapter/*.js)  ← backend protocol boundary
  ↓
Mock data (model/mock/*.json)   ← Phase 0/1 only
```

## Adapter replacement contract

Each adapter file exports a plain object satisfying a defined interface.
When the project transitions to a live backend, only the adapter files change.
The service layer and all controllers remain unchanged.

## Current adapter: MockAdapter

Reads static JSON files from `model/mock/`.
No network requests are made.

## Future adapters (not yet implemented)

- `ODataAdapter.js`  — sap.ui.model.odata.v4.ODataModel / ODataV4
- `RestAdapter.js`   — sap.ui.core.service.Service / fetch-based

## Rule

Controllers MUST NOT reference adapter files directly.
Controllers call service methods.
Services call adapter methods.
