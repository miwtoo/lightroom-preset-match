import { PresetAdjustments } from './preset-generator'

export function generatePresetXML(
  adjustments: PresetAdjustments,
  presetName: string
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<preset name="${presetName}">
  <adjustments>
    <exposure>${adjustments.exposure}</exposure>
    <contrast>${adjustments.contrast}</contrast>
    <highlights>${adjustments.highlights}</highlights>
    <shadows>${adjustments.shadows}</shadows>
    <whites>${adjustments.whites}</whites>
    <blacks>${adjustments.blacks}</blacks>
  </adjustments>
</preset>`
}

export function downloadPreset(xmlContent: string, presetName: string): void {
  const blob = new Blob([xmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${presetName.replace(/\s+/g, '-')}.lrtemplate`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
