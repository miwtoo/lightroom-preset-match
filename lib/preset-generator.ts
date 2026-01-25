const HSL_CHANNELS = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'] as const

export type HslChannel = (typeof HSL_CHANNELS)[number]

export interface PresetAdjustments {
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  hue: Partial<Record<HslChannel, number>>
  saturation: Partial<Record<HslChannel, number>>
  luminance: Partial<Record<HslChannel, number>>
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

function scaleMap(
  map: Partial<Record<HslChannel, number>>,
  factor: number
): Partial<Record<HslChannel, number>> {
  const result: Partial<Record<HslChannel, number>> = {}
  for (const channel of HSL_CHANNELS) {
    if (map[channel] !== undefined) {
      result[channel] = map[channel]! * factor
    }
  }
  return result
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
    hue: scaleMap(adjustments.hue, factor),
    saturation: scaleMap(adjustments.saturation, factor),
    luminance: scaleMap(adjustments.luminance, factor),
  }
}
