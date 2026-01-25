import { scaleAdjustments } from './preset-generator'

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
