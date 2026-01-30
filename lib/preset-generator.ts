const HSL_CHANNELS = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'] as const

export type HslChannel = (typeof HSL_CHANNELS)[number]

export const SUPPORTED_PROFILES = [
  'Adobe Color',
  'Adobe Standard',
  'Adobe Portrait',
  'Adobe Landscape',
  'Adobe Vivid',
  'Adobe Monochrome',
  'Camera Standard',
] as const

export type ColorProfile = (typeof SUPPORTED_PROFILES)[number]

export interface CalibrationPrimary {
  hue: number
  saturation: number
}

export interface CalibrationAdjustments {
  shadowTint: number
  redPrimary: CalibrationPrimary
  greenPrimary: CalibrationPrimary
  bluePrimary: CalibrationPrimary
}

export interface PresetAdjustments {
  profile: string
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  hue: Partial<Record<HslChannel, number>>
  saturation: Partial<Record<HslChannel, number>>
  luminance: Partial<Record<HslChannel, number>>
  calibration: CalibrationAdjustments
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
    rgbMean: [number, number, number]
  }
  zones: number[]
  zoneColors: [number, number, number][]
}

export function analyzeImage(pixels: ImageData): ImageAnalysis {
  const data = pixels.data
  const pixelCount = data.length / 4
  const lumValues: number[] = []
  let totalSaturation = 0
  let totalR = 0
  let totalG = 0
  let totalB = 0
  const zones = new Array(11).fill(0)
  const zoneR = new Array(11).fill(0)
  const zoneG = new Array(11).fill(0)
  const zoneB = new Array(11).fill(0)
  const zoneCounts = new Array(11).fill(0)

  const sampleEvery = Math.max(1, Math.floor(pixelCount / 10000))
  for (let i = 0; i < pixelCount; i += sampleEvery) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    totalR += r
    totalG += g
    totalB += b
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    lumValues.push(luminance)

    const zoneIdx = Math.max(0, Math.min(10, Math.floor(luminance / 23.2)))
    zones[zoneIdx] += 1
    zoneR[zoneIdx] += r
    zoneG[zoneIdx] += g
    zoneB[zoneIdx] += b
    zoneCounts[zoneIdx] += 1

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
      color: { averageSaturation: 0, rgbMean: [128, 128, 128] },
      zones: new Array(11).fill(0),
      zoneColors: new Array(11).fill([128, 128, 128]),
    }
  }

  lumValues.sort((a, b) => a - b)

  const zoneColors: [number, number, number][] = zoneCounts.map((zoneCount, i) => {
    if (zoneCount === 0) {
      const gray = Math.round(i * 25.5)
      return [gray, gray, gray]
    }
    return [
      Math.round(zoneR[i] / zoneCount),
      Math.round(zoneG[i] / zoneCount),
      Math.round(zoneB[i] / zoneCount),
    ]
  })

  return {
    luminance: {
      mean: lumValues.reduce((sum, v) => sum + v, 0) / count,
      median: lumValues[Math.floor(count * 0.5)],
      p5: lumValues[Math.floor(count * 0.05)],
      p95: lumValues[Math.floor(count * 0.95)],
    },
    color: {
      averageSaturation: totalSaturation / count,
      rgbMean: [totalR / count, totalG / count, totalB / count],
    },
    zones: zones.map((v) => (v / count) * 100),
    zoneColors,
  }
}

export function generatePresetFromAnalysis(analysis: ImageAnalysis): PresetAdjustments {
  const { mean, p5, p95 } = analysis.luminance
  const { averageSaturation, rgbMean } = analysis.color

  const targetMiddleGray = 128
  const exposure = (targetMiddleGray - mean) / 128

  const standardDynamicRange = 180
  const dynamicRange = p95 - p5
  const contrast = Math.max(-20, Math.min(40, (standardDynamicRange - dynamicRange) / 2))

  const targetSaturation = 0.4
  const saturationAdjustment = Math.round((targetSaturation - averageSaturation) * 100)

  return {
    profile: 'Adobe Color',
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
    calibration: {
      shadowTint: Math.round(Math.max(-10, Math.min(10, (rgbMean[1] - (rgbMean[0] + rgbMean[2]) / 2) * 0.1))),
      redPrimary: { hue: 0, saturation: Math.round(Math.max(-10, Math.min(10, (rgbMean[0] - mean) * 0.1))) },
      greenPrimary: { hue: 0, saturation: Math.round(Math.max(-10, Math.min(10, (rgbMean[1] - mean) * 0.1))) },
      bluePrimary: { hue: 0, saturation: Math.round(Math.max(-10, Math.min(10, (rgbMean[2] - mean) * 0.1))) },
    },
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
    profile: adjustments.profile,
    exposure: adjustments.exposure * factor,
    contrast: adjustments.contrast * factor,
    highlights: adjustments.highlights * factor,
    shadows: adjustments.shadows * factor,
    whites: adjustments.whites * factor,
    blacks: adjustments.blacks * factor,
    hue: scaleMap(adjustments.hue, factor),
    saturation: scaleMap(adjustments.saturation, factor),
    luminance: scaleMap(adjustments.luminance, factor),
    calibration: {
      shadowTint: adjustments.calibration.shadowTint * factor,
      redPrimary: {
        hue: adjustments.calibration.redPrimary.hue * factor,
        saturation: adjustments.calibration.redPrimary.saturation * factor,
      },
      greenPrimary: {
        hue: adjustments.calibration.greenPrimary.hue * factor,
        saturation: adjustments.calibration.greenPrimary.saturation * factor,
      },
      bluePrimary: {
        hue: adjustments.calibration.bluePrimary.hue * factor,
        saturation: adjustments.calibration.bluePrimary.saturation * factor,
      },
    },
  }
}
