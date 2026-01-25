import { generatePresetXMP } from './preset-export'
import type { PresetAdjustments } from './preset-generator'

describe('generatePresetXMP', () => {
  it('should generate valid XMP with basic adjustments', () => {
    const adjustments: PresetAdjustments = {
      exposure: 0.5,
      contrast: 25,
      highlights: -10,
      shadows: 15,
      whites: 30,
      blacks: -20,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const xmp = generatePresetXMP(adjustments, 'Test Preset')

    expect(xmp).toContain('<?xpacket')
    expect(xmp).toContain('<x:xmpmeta')
    expect(xmp).toContain('<rdf:RDF')
    expect(xmp).toContain('crs:Exposure2012="+0.50"')
    expect(xmp).toContain('crs:Contrast2012="+25"')
    expect(xmp).toContain('crs:Highlights2012="-10"')
    expect(xmp).toContain('crs:Shadows2012="+15"')
    expect(xmp).toContain('crs:Whites2012="+30"')
    expect(xmp).toContain('crs:Blacks2012="-20"')
    expect(xmp).toContain('crs:Name>')
    expect(xmp).toContain('<rdf:li xml:lang="x-default">Test Preset</rdf:li>')
    expect(xmp).toContain('<?xpacket end=')
  })

  it('should include HSL channels', () => {
    const adjustments: PresetAdjustments = {
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      hue: { Red: 10, Orange: -5, Yellow: 0 },
      saturation: { Green: 20 },
      luminance: { Blue: -15 },
    }

    const xmp = generatePresetXMP(adjustments, 'Test')

    expect(xmp).toContain('crs:HueAdjustmentRed="+10"')
    expect(xmp).toContain('crs:HueAdjustmentOrange="-5"')
    expect(xmp).toContain('crs:HueAdjustmentYellow="+0"')
    expect(xmp).toContain('crs:SaturationAdjustmentGreen="+20"')
    expect(xmp).toContain('crs:LuminanceAdjustmentBlue="-15"')
  })

  it('should escape XML special characters in preset name', () => {
    const adjustments: PresetAdjustments = {
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

    const xmp = generatePresetXMP(adjustments, 'Test & <Presets> "Demo"')
    expect(xmp).toContain('Test &amp; &lt;Presets&gt; &quot;Demo&quot;')
    expect(xmp).not.toContain('& < >')
  })

  it('should be deterministic for same input', () => {
    const adjustments: PresetAdjustments = {
      exposure: 0.25,
      contrast: 15,
      highlights: -5,
      shadows: 10,
      whites: 20,
      blacks: -15,
      hue: { Red: 5 },
      saturation: {},
      luminance: {},
    }

    const xmp1 = generatePresetXMP(adjustments, 'Deterministic Test')
    const xmp2 = generatePresetXMP(adjustments, 'Deterministic Test')

    expect(xmp1).toBe(xmp2)
  })

  it('should format Exposure with 2 decimal places', () => {
    const adjustments: PresetAdjustments = {
      exposure: 1.2345,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      hue: {},
      saturation: {},
      luminance: {},
    }

    const xmp = generatePresetXMP(adjustments, 'Test')
    expect(xmp).toContain('crs:Exposure2012="+1.23"')
  })

  it('should use stable UUID for same content', () => {
    const adjustments: PresetAdjustments = {
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

    const xmp1 = generatePresetXMP(adjustments, 'Same Name')
    const xmp2 = generatePresetXMP(adjustments, 'Same Name')

    const uuidMatch1 = xmp1.match(/crs:UUID="([A-Fa-f0-9]+)"/)?.[1]
    const uuidMatch2 = xmp2.match(/crs:UUID="([A-Fa-f0-9]+)"/)?.[1]

    expect(uuidMatch1).toBeDefined()
    expect(uuidMatch2).toBeDefined()
    expect(uuidMatch1).toBe(uuidMatch2)
  })
})
