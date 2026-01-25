# PRD: Preset From Reference Image (Web → Lightroom iPad)

**Date:** 2026-01-25

---

## Problem Statement

### What problem are we solving?
Lightroom Mobile users often want to recreate the “look” of a reference photo across other photos, but building presets manually requires expertise and time. A web-first generator that derives a basic preset from a single reference image reduces friction and enables faster iteration on style.

### Why now?
- Preset creation is a repeat pain for creators and small teams.
- A client-side web app can ship quickly, preserve privacy, and avoid server costs for an MVP.

### Who is affected?
- **Primary users:** Lightroom Mobile users on iPad who want to quickly apply a similar look to their own photos.
- **Secondary users:** Lightroom Mobile users on other devices (optional compatibility), creators experimenting with looks before investing in manual presets.

---

## Proposed Solution

### Overview
A web app that accepts a single reference image, generates a “basic adjustments + color” preset representation, and lets the user preview the effect (before/after on the reference image) and adjust an overall intensity slider. The user then exports a preset file intended to be importable into Lightroom on iPad.

### User Experience

#### User Flow: Generate + Export Preset
1. User opens the web app.
2. User uploads a reference image.
3. System extracts metadata (optional) and shows the reference image preview.
4. User clicks “Generate preset”.
5. System generates adjustments (basic + color) client-side and shows a before/after comparison on the reference image.
6. User adjusts “Intensity” to tune strength.
7. User provides a preset name.
8. User exports/downloads the preset file and sees brief “How to import on iPad” instructions.

#### User Flow: Error Handling
1. User uploads an invalid/unsupported/corrupt image.
2. System shows an actionable error message and keeps the app usable.

### Design Considerations
- **Web-first:** Primary UX for desktop and mobile browsers; must be usable on iPad Safari.
- **Lightroom iPad compatibility:** Export target must match Lightroom Mobile on iPad import capabilities (format and workflow must be documented in-app).
- **Accessibility:** WCAG 2.1 AA target for core flows (upload, generate, preview, export).
- **Privacy:** Client-side only by default (no uploads to servers).

---

## End State

When this PRD is complete, the following will be true:

- [ ] Users can upload a reference image in the web app.
- [ ] Users can generate a “basic + color” look derived from the reference image on the client side.
- [ ] Users can preview before/after on the reference image with a clear comparison UI.
- [ ] Users can adjust a single “Intensity” control that affects the exported output.
- [ ] Users can name the preset and export/download a preset file.
- [ ] Users receive clear “How to import on iPad” guidance aligned to the export format.
- [ ] All acceptance criteria pass.
- [ ] Tests cover new functionality where applicable (unit tests for core transforms/serialization).
- [ ] Minimal documentation exists (README or in-app help).

---

## Success Metrics

### Quantitative
| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| Generate success rate | N/A | ≥ 95% | Client-side telemetry (opt-in) or local-only session metrics |
| Export completion rate | N/A | ≥ 80% | Same as above |
| Median generate time | N/A | ≤ TBD seconds | Same as above |

### Qualitative
- Users report the generated look is “close enough” for a starting point without manual editing.
- Users can complete the full flow without needing external support.

---

## Acceptance Criteria

### Feature: Upload Reference Image
- [ ] The app accepts common image formats defined for v1 (see Open Questions).
- [ ] If an image cannot be decoded or is unsupported, the app shows a clear error (reason + next step).
- [ ] The app does not require login.
- [ ] The app does not upload the image to any server in v1.
- [ ] If a device cannot handle the image due to memory constraints, the app fails gracefully with a user-understandable message.

### Feature: Generate Look (Client-side)
- [ ] Given a valid reference image, the user can trigger generation.
- [ ] The generated output is restricted to “basic adjustments + color” (explicitly excluding local adjustments/masks).
- [ ] The app provides visible progress and a recoverable error state (retry) if generation fails.

### Feature: Preview (Reference-only)
- [ ] The preview is based only on the reference image (no external sample images).
- [ ] The UI clearly indicates “Before” vs “After” and supports a comparison interaction (slider or toggle).
- [ ] The preview updates when Intensity changes.

### Feature: Intensity Control
- [ ] The app offers a single Intensity control with a defined range (e.g., 0–100).
- [ ] Changing Intensity updates the preview and affects the exported output.
- [ ] Reset is available (restore default Intensity).

### Feature: Preset Naming
- [ ] The user can set a preset name.
- [ ] Invalid names (empty/too long/unsupported characters) block export and show an actionable validation message.

### Feature: Export for Lightroom iPad
- [ ] The app exports a preset file matching the agreed target format (requested: `.xml`) and download completes successfully.
- [ ] The app provides concise import instructions for Lightroom on iPad aligned to the chosen export format/workflow.
- [ ] The exported preset file is deterministic for the same input + Intensity + name (excluding metadata like timestamps if possible).

### Feature: Privacy & Data Handling
- [ ] No account is required.
- [ ] By default, the app retains no user image/preset data server-side (client-side only).
- [ ] The app provides a “Clear session” action that removes any locally held artifacts (where applicable).

---

## Technical Context

### Existing Patterns
No repository patterns exist yet (project root is currently empty).

### Key Files
To be created; no existing code files are present.

### System Dependencies
- Browser image decoding + rendering (desktop + iPad Safari).
- Optional: on-device model/runtime (must run fully client-side) if ML is required.
- File generation/download mechanism that works on iPadOS Safari.

### Data Model Changes
- None server-side (v1 is client-only).
- Any local persistence (e.g., browser storage) must be optional and user-clearable.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `.xml` preset export is not actually importable on Lightroom iPad | High | High | Validate Lightroom iPad import workflow early; adjust export format requirement based on confirmed compatibility; keep Open Questions explicit |
| Single reference image does not uniquely define a “preset” look | High | Med | Limit scope to basic+color; set expectations in UI; provide Intensity control |
| Preview rendering does not match Lightroom Mobile rendering | Med | High | Communicate “approximate preview”; include calibration notes; validate on representative devices |
| “No limits, any image” causes crashes on iPad | High | High | Define “no explicit UI limit” but require graceful handling; document supported practical limits; downscaling approach is implementation detail |
| Client-only generation too slow on mobile devices | Med | High | Set performance targets; provide cancel/retry; offer “fast vs quality” option as future enhancement |

---

## Alternatives Considered

### Alternative 1: Server-side generation
- **Description:** Upload image to backend; run heavier analysis/ML; return preset.
- **Pros:** More compute, easier model updates, more consistent performance.
- **Cons:** Privacy concerns, ongoing cost, requires auth/storage/infra.
- **Decision:** Rejected for v1 due to client-only requirement and cost control.

### Alternative 2: Require a before/after pair (more accurate)
- **Description:** User provides original photo + edited reference; derive adjustment delta.
- **Pros:** Much better identifiability; closer to “real preset extraction”.
- **Cons:** Higher UX friction; users may not have “before” image.
- **Decision:** Deferred; v1 is single reference image only.

---

## Non-Goals (v1)

Explicitly out of scope:
- User accounts, cloud sync, preset library, or sharing marketplace.
- Local adjustments/masks, healing, subject selection, AI retouching.
- Batch processing of user photo sets.
- “Export to folder” desktop-like behavior (web download only).
- Guaranteeing a perfect match to Lightroom rendering across devices.

---

## Interface Specifications

### UI
- Upload area (drag/drop + file picker)
- Preview panel (before/after comparison)
- Intensity slider + reset
- Preset name input + validation
- Export/download button
- Lightweight “How to import on iPad” panel (format-dependent)
- Clear session action

### API
- No server API in v1.

---

## Documentation Requirements

- [ ] In-app “How to import on iPad” guidance (kept current with export format)
- [ ] Basic README describing supported browsers/devices, privacy posture (client-only), and known limitations
- [ ] Troubleshooting section for common failures (large images, unsupported formats)

---

## Open Questions

| Question | Owner | Due Date | Status |
|----------|-------|----------|--------|
| Is `.xml` the confirmed importable preset format for Lightroom on iPad, or is a different artifact required? | Miw | TBD | Open |
| Which iPadOS versions and Lightroom Mobile versions are supported for “works” claims? | Miw | TBD | Open |
| What image formats must be supported in v1 (JPEG/PNG/HEIC), and should RAW be out of scope? | Miw | TBD | Open |
| What practical performance targets are required (median/p95 generate time) on iPad Safari? | Miw | TBD | Open |
| Should the app store anything locally (e.g., last preset) or be strictly ephemeral per session? | Miw | TBD | Open |
| What exactly is included in “basic adjustments + color” for v1 (e.g., exposure/contrast/highlights/shadows/whites/blacks + HSL)? | Miw | TBD | Open |

---

## Appendix

### Glossary
- **Reference image:** The single image provided by the user to infer a target look.
- **Preset:** A saved set of adjustment parameters intended to be applied to other photos.
- **Intensity:** A single scalar controlling strength of the generated adjustment set.
