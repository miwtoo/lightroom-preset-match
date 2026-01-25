# Lightroom Preset Generator

Generate Lightroom presets from a single reference image with a fast, client-side web app that exports a Lightroom-compatible XMP preset file.

## Features

- Upload reference images (JPEG, PNG, WebP)
- Generate preset adjustments client-side
- Preview before/after with intensity control
- Export XMP presets for Lightroom on iPad
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
4. Name your preset and download the `.xmp` file
5. Import into Lightroom on iPad

### iPad Import Workflow

1. Open Lightroom on iPad and open any photo
2. Tap **Presets**
3. Tap **Yours**
4. Tap **...** menu
5. Choose **Import Presets**
6. In Files, select the downloaded `.xmp` file
7. Find your preset under **Yours** (User Presets)

## Supported Browsers

- Chrome/Edge 111+
- Safari 16.4+
- Firefox 109+

Note: Requires Lightroom iPad that supports importing XMP presets.

## Supported Input Formats

- JPEG
- PNG
- WebP

Large images may be downscaled for performance. Corrupt or unsupported images will show an error message.

## Privacy

This app runs entirely client-side. Your images are never uploaded to any server, and no login is required.

## Known Limitations

- Preview is approximate and may not match Lightroom Mobile rendering exactly
- Large images may be downscaled for performance
- Basic adjustments + HSL color only (no local adjustments or masks)
- Performance depends on device capabilities
- Not all Lightroom/iPad versions have been tested

## Troubleshooting

### Preset Import Issues

- **Import Presets menu missing**: Open a photo first, then check the Presets panel. Update Lightroom if the menu is still missing.
- **File not found in Files**: Ensure the download completed and is in your Files app or Downloads folder when importing.
- **Preset imported but not visible**: Check under **Presets → Yours → User Presets**.
- **Preset looks greyed out or missing**: Enable partially compatible presets in Lightroom settings if needed.
- **Partially compatible**: If Lightroom warns about partial compatibility, enable partially compatible presets in settings.

### Upload Issues

- **Unsupported file type**: The app only accepts JPEG, PNG, and WebP files.
- **Corrupt image**: If the app shows an error, the image file may be damaged. Try a different file.
- **Large image crashes tab**: Very large images may exceed iPad memory limits. Try a smaller image or reload the page.

### General

- **Preview doesn't match Lightroom**: The preview is an approximation and may differ slightly from Lightroom Mobile rendering. Fine-tune adjustments in Lightroom for best results.
- **Export blocked**: Ensure your preset name contains only letters, numbers, spaces, hyphens, underscores, or periods.

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
