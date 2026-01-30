import { scaleAdjustments, generatePresetFromAnalysis } from './preset-generator'

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
      },
    }
    const preset = generatePresetFromAnalysis(analysis)
    expect(preset.exposure).toBeGreaterThan(0)
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
      },
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
      },
    }
    const preset = generatePresetFromAnalysis(analysis)
    expect(preset.contrast).toBeGreaterThan(0)
  })
})

describe('scaleAdjustments', () => {
  it('should scale adjustments by intensity factor', () => {
    const adjustments = {
      exposure: 50,
      contrast: 30,
      highlights: 20,
      shadows: 10,
      whites: 15,
      blacks: 5,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const scaled = scaleAdjustments(adjustments, 50)

    expect(scaled.exposure).toBe(25)
    expect(scaled.contrast).toBe(15)
    expect(scaled.highlights).toBe(10)
  })

  it('should return zero when intensity is 0', () => {
    const adjustments = {
      exposure: 50,
      contrast: 30,
      highlights: 20,
      shadows: 10,
      whites: 15,
      blacks: 5,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const scaled = scaleAdjustments(adjustments, 0)

    expect(scaled.exposure).toBe(0)
    expect(scaled.contrast).toBe(0)
  })

  it('should return original when intensity is 100', () => {
    const adjustments = {
      exposure: 50,
      contrast: 30,
      highlights: 20,
      shadows: 10,
      whites: 15,
      blacks: 5,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const scaled = scaleAdjustments(adjustments, 100)

    expect(scaled.exposure).toBe(50)
    expect(scaled.contrast).toBe(30)
  })
})
