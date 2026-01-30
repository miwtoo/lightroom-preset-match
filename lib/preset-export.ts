import { PresetAdjustments, scaleAdjustments, type HslChannel } from './preset-generator'

const HSL_CHANNELS = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'] as const

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatSignedInt(n: number): string {
  const rounded = Math.round(n)
  return rounded >= 0 ? `+${rounded}` : `${rounded}`
}

function formatSignedFloat2(n: number): string {
  const formatted = n.toFixed(2)
  return parseFloat(formatted) >= 0 ? `+${formatted}` : formatted
}

function sanitizeFilenameBase(name: string): string {
  const base = name
    .trim()
    .replace(/[^A-Za-z0-9\s._-]/g, '')
    .replace(/\s+/g, '-')
  return base || 'preset'
}

function stableUuidHex32(payload: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0xcafebabe
  let h3 = 0xfeedface
  let h4 = 0xbadcaffe

  for (let i = 0; i < payload.length; i++) {
    const c = payload.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761) + h2
    h2 = Math.imul(h2 ^ c, 2654435761) + h3
    h3 = Math.imul(h3 ^ c, 2654435761) + h4
    h4 = Math.imul(h4 ^ c, 2654435761) + h1
  }

  const toHex = (n: number) => {
    const v = n >>> 0
    return v.toString(16).padStart(8, '0')
  }

  return `${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`
}

function clampRange(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(val)))
}

export function generatePresetXMP(
  adjustments: PresetAdjustments,
  presetName: string
): string {
  const safeName = escapeXml(presetName)
  const uuid = stableUuidHex32(JSON.stringify(adjustments) + presetName)

  const formatHue = (channel: string) => {
    const val = channel in adjustments.hue ? (adjustments.hue as Record<string, number>)[channel] : 0
    return `crs:HueAdjustment${channel}="${formatSignedInt(val)}"`
  }

  const formatSat = (channel: string) => {
    const val = channel in adjustments.saturation ? (adjustments.saturation as Record<string, number>)[channel] : 0
    return `crs:SaturationAdjustment${channel}="${formatSignedInt(val)}"`
  }

  const formatLum = (channel: string) => {
    const val = channel in adjustments.luminance ? (adjustments.luminance as Record<string, number>)[channel] : 0
    return `crs:LuminanceAdjustment${channel}="${formatSignedInt(val)}"`
  }

  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000 1.000000, 0000/00/00-00:00:00        ">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
   crs:PresetType="Normal"
   crs:Cluster=""
   crs:UUID="${uuid}"
   crs:SupportsAmount2="True"
   crs:SupportsAmount="True"
   crs:SupportsColor="True"
   crs:SupportsMonochrome="True"
   crs:SupportsHighDynamicRange="True"
   crs:SupportsNormalDynamicRange="True"
   crs:SupportsSceneReferred="True"
   crs:SupportsOutputReferred="True"
   crs:RequiresRGBTables="False"
   crs:ShowInPresets="True"
   crs:ShowInQuickActions="False"
   crs:CameraModelRestriction=""
   crs:Copyright=""
   crs:ContactInfo=""
   crs:Version="18.1"
   crs:ProcessVersion="15.4"
   crs:LookName="${escapeXml(adjustments.profile)}"
   crs:WhiteBalance="Custom"
   crs:IncrementalTemperature="0"
   crs:IncrementalTint="0"
   crs:Exposure2012="${formatSignedFloat2(adjustments.exposure)}"
   crs:Contrast2012="${formatSignedInt(adjustments.contrast)}"
   crs:Highlights2012="${formatSignedInt(adjustments.highlights)}"
   crs:Shadows2012="${formatSignedInt(adjustments.shadows)}"
   crs:Whites2012="${formatSignedInt(adjustments.whites)}"
    crs:Blacks2012="${formatSignedInt(adjustments.blacks)}"
    crs:ShadowTint="${formatSignedInt(adjustments.calibration.shadowTint)}"
    crs:RedHue="${formatSignedInt(adjustments.calibration.redPrimary.hue)}"
    crs:RedSaturation="${formatSignedInt(adjustments.calibration.redPrimary.saturation)}"
    crs:GreenHue="${formatSignedInt(adjustments.calibration.greenPrimary.hue)}"
    crs:GreenSaturation="${formatSignedInt(adjustments.calibration.greenPrimary.saturation)}"
    crs:BlueHue="${formatSignedInt(adjustments.calibration.bluePrimary.hue)}"
    crs:BlueSaturation="${formatSignedInt(adjustments.calibration.bluePrimary.saturation)}"
    ${HSL_CHANNELS.map(formatHue).join('\n    ')}
   ${HSL_CHANNELS.map(formatSat).join('\n    ')}
   ${HSL_CHANNELS.map(formatLum).join('\n    ')}>
   <crs:Name>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${safeName}</rdf:li>
    </rdf:Alt>
   </crs:Name>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`
}

export function generatePresetXMPWithIntensity(
  adjustments: PresetAdjustments,
  presetName: string,
  intensity: number
): string {
  const scaled = scaleAdjustments(adjustments, intensity)
  return generatePresetXMP(scaled, presetName)
}

export function downloadPresetXMP(xmp: string, presetName: string): void {
  const blob = new Blob([xmp], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const baseName = sanitizeFilenameBase(presetName)
  a.download = `${baseName}.xmp`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
