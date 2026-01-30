# Lib AGENTS.md

- Use `crs:LookName` attribute in XMP description to specify standard Adobe color profiles.
- XMP `crs:UUID` must be deterministic; use `stableUuidHex32` with content-derived payload.
- `CalibrationAdjustments` (Shadow Tint + RGB Primaries) mapping requires `rgbMean` from `ImageAnalysis`.
- `bun test` provides global test functions; ignore LSP "Cannot find name" errors in `.test.ts` if `bun test` succeeds.
