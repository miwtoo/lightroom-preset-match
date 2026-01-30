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

export interface ImageAnalysis {
  luminance: {
    mean: number
    median: number
    p5: number
    p95: number
  }
  color: {
    averageSaturation: number
  }
}

export function analyzeImage(pixels: ImageData): ImageAnalysis {
  const data = pixels.data
  const pixelCount = data.length / 4
  const lumValues: number[] = []
  let totalSaturation = 0

  const sampleEvery = Math.max(1, Math.floor(pixelCount / 10000))
  for (let i = 0; i < pixelCount; i += sampleEvery) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    lumValues.push(luminance)

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    const saturation = max === 0 ? 0 : delta / max
    totalSaturation += saturation
  }

  const count = lumValues.length
  if (count === 0) {
    return {
      luminance: { mean: 128, median: 128, p5: 0, p95: 255 },
      color: { averageSaturation: 0 },
    }
  }

  lumValues.sort((a, b) => a - b)

  return {
    luminance: {
      mean: lumValues.reduce((sum, v) => sum + v, 0) / count,
      median: lumValues[Math.floor(count * 0.5)],
      p5: lumValues[Math.floor(count * 0.05)],
      p95: lumValues[Math.floor(count * 0.95)],
    },
    color: {
      averageSaturation: totalSaturation / count,
    },
  }
}

export function generatePresetFromAnalysis(analysis: ImageAnalysis): PresetAdjustments {
  const { mean, p5, p95 } = analysis.luminance
  const { averageSaturation } = analysis.color

  const targetMiddleGray = 128
  const exposure = (targetMiddleGray - mean) / 128

  const standardDynamicRange = 180
  const dynamicRange = p95 - p5
  const contrast = Math.max(-20, Math.min(40, (standardDynamicRange - dynamicRange) / 2))

  const targetSaturation = 0.4
  const saturationAdjustment = Math.round((targetSaturation - averageSaturation) * 100)

  return {
    exposure: Math.max(-2, Math.min(2, exposure)),
    contrast: Math.round(contrast),
    highlights: Math.round(Math.max(-40, Math.min(0, (p95 - 200) * -0.5))),
    shadows: Math.round(Math.max(0, Math.min(40, (50 - p5) * 0.5))),
    whites: 0,
    blacks: 0,
    hue: {},
    saturation: {
      Orange: Math.max(-20, Math.min(20, saturationAdjustment)),
      Blue: Math.max(-20, Math.min(20, saturationAdjustment)),
    },
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
