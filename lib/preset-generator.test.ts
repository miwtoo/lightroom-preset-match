import { scaleAdjustments, generatePresetFromAnalysis, analyzeImage, type PresetAdjustments } from './preset-generator'

describe('analyzeImage', () => {
  it('should compute luminance statistics correctly', () => {
    const data = new Uint8ClampedArray([
      0, 0, 0, 255,
      100, 100, 100, 255,
      200, 200, 200, 255,
      255, 255, 255, 255
    ])
    const pixels = { data, width: 2, height: 2 } as ImageData
    const analysis = analyzeImage(pixels)

    expect(analysis.luminance.mean).toBeCloseTo((0 + 100 + 200 + 255) / 4)
    expect(analysis.zones.length).toBe(11)
    expect(analysis.zones[0]).toBeGreaterThan(0)
    expect(analysis.zones[10]).toBeGreaterThan(0)
    expect(analysis.zoneColors.length).toBe(11)
    expect(analysis.zoneColors[0]).toEqual([0, 0, 0])
    expect(analysis.zoneColors[10]).toEqual([255, 255, 255])
  })
})

describe('generatePresetFromAnalysis', () => {
  it('should increase exposure for dark images', () => {
    const analysis = {
      luminance: {
        mean: 50,
        median: 45,
        p5: 10,
        p95: 100,
      },
      color: {
        averageSaturation: 0.3,
        rgbMean: [60, 50, 40] as [number, number, number],
      },
      zones: new Array(11).fill(0),
      zoneColors: new Array(11).fill([0, 0, 0]) as [number, number, number][],
    }
    const preset = generatePresetFromAnalysis(analysis)
    expect(preset.exposure).toBeGreaterThan(0)
    expect(preset.calibration).toBeDefined()
  })

  it('should decrease exposure for bright images', () => {
    const analysis = {
      luminance: {
        mean: 200,
        median: 210,
        p5: 150,
        p95: 250,
      },
      color: {
        averageSaturation: 0.3,
        rgbMean: [60, 50, 40] as [number, number, number],
      },
      zones: new Array(11).fill(0),
      zoneColors: new Array(11).fill([0, 0, 0]) as [number, number, number][],
    }
    const preset = generatePresetFromAnalysis(analysis)
    expect(preset.exposure).toBeLessThan(0)
  })

  it('should increase contrast for low dynamic range images', () => {
    const analysis = {
      luminance: {
        mean: 128,
        median: 128,
        p5: 100,
        p95: 150,
      },
      color: {
        averageSaturation: 0.3,
        rgbMean: [60, 50, 40] as [number, number, number],
      },
      zones: new Array(11).fill(0),
      zoneColors: new Array(11).fill([0, 0, 0]) as [number, number, number][],
    }
    const preset = generatePresetFromAnalysis(analysis)
    expect(preset.contrast).toBeGreaterThan(0)
  })
})

describe('scaleAdjustments', () => {
  const adjustments: PresetAdjustments = {
    profile: 'Adobe Color',
    exposure: 50,
    contrast: 30,
    highlights: 20,
    shadows: 10,
    whites: 15,
    blacks: 5,
    hue: {},
    saturation: {},
    luminance: {},
    calibration: {
      shadowTint: 10,
      redPrimary: { hue: 20, saturation: 30 },
      greenPrimary: { hue: 0, saturation: 0 },
      bluePrimary: { hue: 0, saturation: 0 },
    },
  }

  it('should scale adjustments by intensity factor', () => {
    const scaled = scaleAdjustments(adjustments, 50)

    expect(scaled.exposure).toBe(25)
    expect(scaled.contrast).toBe(15)
    expect(scaled.highlights).toBe(10)
    expect(scaled.calibration.shadowTint).toBe(5)
    expect(scaled.calibration.redPrimary.hue).toBe(10)
    expect(scaled.calibration.redPrimary.saturation).toBe(15)
  })

  it('should return zero when intensity is 0', () => {
    const scaled = scaleAdjustments(adjustments, 0)

    expect(scaled.exposure).toBe(0)
    expect(scaled.contrast).toBe(0)
    expect(scaled.calibration.shadowTint).toBe(0)
  })

  it('should return original when intensity is 100', () => {
    const scaled = scaleAdjustments(adjustments, 100)

    expect(scaled.exposure).toBe(50)
    expect(scaled.contrast).toBe(30)
    expect(scaled.calibration.shadowTint).toBe(10)
  })
})
