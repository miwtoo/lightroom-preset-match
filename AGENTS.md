# AGENTS.md

## Project

- Client-only Next.js 16 App Router app.
- Static export enabled (`output: 'export'`).
- Use Bun for all package and script commands (no npm/yarn).

## Commands

- Install: `bun install`
- Dev: `bun dev`
- Build: `bun run build`
- Typecheck: `bun run typecheck`
- Tests: `bun test`

## Required Skills

- `nextjs` for App Router + static export patterns
- `playwright` for BDD-style E2E tests

## Skill Installation

- Use skill-discovery to install: `nextjs` and `playwright` (`webapp-testing`).

## Locations

- App entry: `app/page.tsx`
- Global styles: `app/globals.css`
- Core logic: `lib/preset-generator.ts`, `lib/preset-export.ts`
- Tests: `lib/*.test.ts`
- PRD source: `plans/prd-[feature name].md`

## Quality Gates

- Project should always have test coverage.
- After changes, always run the sanity check: `bun test`, `bun run build`, `bun run typecheck`.
- When starting implementation, use Behaviour-Driven Development (BDD) style and Playwright tests. Reference: https://cucumber.io/docs/bdd/.

## Notes

- No server/API in v1; all processing stays client-side.
