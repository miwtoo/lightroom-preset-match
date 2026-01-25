'use client'

import { useState } from 'react'

interface PresetAdjustments {
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  hue: { [key: string]: number }
  saturation: { [key: string]: number }
  luminance: { [key: string]: number }
}

interface PresetExportProps {
  presetName: string
  onPresetNameChange: (name: string) => void
  adjustments: PresetAdjustments
  intensity: number
}

export default function PresetExport({
  presetName,
  onPresetNameChange,
  adjustments,
  intensity,
}: PresetExportProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleExport = () => {
    if (!presetName.trim()) {
      setValidationError('Please enter a preset name')
      return
    }

    if (presetName.length > 100) {
      setValidationError('Preset name must be less than 100 characters')
      return
    }

    setValidationError('')

    const factor = intensity / 100
    const scaledAdjustments = {
      exposure: adjustments.exposure * factor,
      contrast: adjustments.contrast * factor,
      highlights: adjustments.highlights * factor,
      shadows: adjustments.shadows * factor,
      whites: adjustments.whites * factor,
      blacks: adjustments.blacks * factor,
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<preset name="${presetName}">
  <adjustments>
    <exposure>${scaledAdjustments.exposure}</exposure>
    <contrast>${scaledAdjustments.contrast}</contrast>
    <highlights>${scaledAdjustments.highlights}</highlights>
    <shadows>${scaledAdjustments.shadows}</shadows>
    <whites>${scaledAdjustments.whites}</whites>
    <blacks>${scaledAdjustments.blacks}</blacks>
  </adjustments>
</preset>`

    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${presetName.replace(/\s+/g, '-')}.lrtemplate`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setShowInstructions(true)
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Export Preset</h2>

      <div className="mb-4">
        <label htmlFor="presetName" className="block text-sm font-medium mb-2">
          Preset Name
        </label>
        <input
          type="text"
          id="presetName"
          value={presetName}
          onChange={(e) => onPresetNameChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="My Awesome Preset"
        />
        {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
      </div>

      <button
        type="button"
        onClick={handleExport}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
      >
        Download Preset
      </button>

      {showInstructions && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Import on iPad</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open Lightroom on your iPad</li>
            <li>Go to Presets panel (bottom-right)</li>
            <li>Tap the + icon to add new preset</li>
            <li>Choose "Import Presets"</li>
            <li>Select the downloaded .lrtemplate file</li>
          </ol>
          <p className="text-xs text-gray-600 mt-4">
            Note: This is an approximate preset. Fine-tune adjustments in Lightroom for best results.
          </p>
        </div>
      )}
    </div>
  )
}
