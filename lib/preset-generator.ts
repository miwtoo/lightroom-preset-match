export interface PresetAdjustments {
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  hue: { [key: string]: number }
  saturation: { [key: string]: number }
  luminance: { [key: string]: number }
}

export function generatePresetFromImage(
  imageData: ImageData
): PresetAdjustments {
  return {
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    hue: {},
    saturation: {},
    luminance: {},
  }
}

export function scaleAdjustments(
  adjustments: PresetAdjustments,
  intensity: number
): PresetAdjustments {
  const factor = intensity / 100
  return {
    ...adjustments,
    exposure: adjustments.exposure * factor,
    contrast: adjustments.contrast * factor,
    highlights: adjustments.highlights * factor,
    shadows: adjustments.shadows * factor,
    whites: adjustments.whites * factor,
    blacks: adjustments.blacks * factor,
  }
}
