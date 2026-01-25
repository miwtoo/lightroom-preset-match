# Lightroom Preset Generator

Generate Lightroom presets from a single reference image with a fast, client-side web app that exports a Lightroom-friendly preset file for iPad.

## Features

- Upload reference images (JPEG, PNG, WebP)
- Generate preset adjustments client-side
- Preview before/after with intensity control
- Export presets for Lightroom on iPad
- No account required, client-only processing

## Quick Start

```bash
bun install
bun dev
```

Open http://localhost:3000

## Usage

1. Upload a reference image
2. Click "Generate Preset"
3. Adjust intensity slider
4. Name your preset and download
5. Import into Lightroom on iPad

## Supported Browsers

- Chrome/Edge 111+
- Safari 16.4+
- Firefox 109+

## Privacy

This app runs entirely client-side. Your images are never uploaded to any server.

## Known Limitations

- Preview is approximate and may not match Lightroom Mobile rendering exactly
- Large images may be downscaled for performance
- Basic+color adjustments only (no local adjustments or masks)
- Performance depends on device capabilities

## Scripts

```bash
bun dev          # start dev server
bun run build    # production build
bun run typecheck
bun test
```

## Contributing

- Keep changes client-only (no server/API in v1)
- Add or update tests for new behavior
- Run the full sanity check before submitting changes:
  `bun test`, `bun run build`, `bun run typecheck`

If you add new presets or export formats, update the usage instructions and known limitations.

## License

MIT
