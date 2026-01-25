import { generatePresetXML } from './preset-export'

describe('generatePresetXML', () => {
  it('should generate valid XML with adjustments', () => {
    const adjustments = {
      exposure: 25,
      contrast: 15,
      highlights: 10,
      shadows: 5,
      whites: 7,
      blacks: 2,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const xml = generatePresetXML(adjustments, 'Test Preset')

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<preset name="Test Preset">')
    expect(xml).toContain('<exposure>25</exposure>')
    expect(xml).toContain('<contrast>15</contrast>')
    expect(xml).toContain('</preset>')
  })

  it('should be deterministic for same input', () => {
    const adjustments = {
      exposure: 25,
      contrast: 15,
      highlights: 10,
      shadows: 5,
      whites: 7,
      blacks: 2,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const xml1 = generatePresetXML(adjustments, 'Test Preset')
    const xml2 = generatePresetXML(adjustments, 'Test Preset')

    expect(xml1).toBe(xml2)
  })
})
