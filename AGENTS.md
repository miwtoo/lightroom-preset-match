# AGENTS.md

## Project

- Client-only Next.js 16 App Router app.
- Static export enabled (`output: 'export'`).
- Use Bun for all package and script commands (no npm/yarn).

## Commands

- Install: `bun install` (also runs `husky prepare` to install git hooks)
- Dev: `bun dev`
- Build: `bun run build`
- Typecheck: `bun run typecheck`
- Tests: `bun test`
- Gate: `bun run gate` (runs tests + typecheck + build)

## Required Skills

- `nextjs` for App Router + static export patterns
- `playwright` for BDD-style E2E tests
- Use skill-discovery to find appropriate skills when needed

## Locations

- App entry: `app/page.tsx`
- Global styles: `app/globals.css`
- Core logic: `lib/preset-generator.ts`, `lib/preset-export.ts`
- Tests: `lib/*.test.ts`
- PRD source: `plans/prd-[feature name].md`

## Quality Gates

- Project should always have test coverage.
- Quality gates enforced via Husky `pre-commit` hook: runs `bun run gate` (tests + typecheck + build) before each commit.
- When starting implementation, use Behaviour-Driven Development (BDD) style and Playwright tests. Reference: https://cucumber.io/docs/bdd/.

## Notes

- No server/API in v1; all processing stays client-side.
- Image analysis happens during upload to ensure data is ready for the "Generate" button.
- Use `MAX_WORKING_DIMENSION = 1200` for downscaled bitmaps to avoid iPad Safari tab crashes.
- Use `{ willReadFrequently: true }` in canvas contexts when extracting pixel data for analysis.
- Use `window` event listeners for dragging to track cursor movement outside the preview container.
- Avoid Playwright `getByRole('alert')` directly; use specific text or attributes to avoid Next.js route announcer collisions.

## Component Patterns

- Import `HslChannel` type from `lib/preset-generator.ts` - don't redefine the 8 channels locally.
- Display-only panels (vNext scope) use disabled sliders, not read-only inputs - maintains editor shell aesthetic.
- ColorMixer shows only channels with values; empty channels are hidden to keep UI clean.
- Left sidebar panel order: Histogram → Intensity → Basic Tone → RGB Curve → Parametric Curve → Color Mixer.
