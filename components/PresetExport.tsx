'use client'

import { useState } from 'react'
import type { PresetAdjustments } from '@/lib/preset-generator'
import { downloadPresetXMP, generatePresetXMP } from '@/lib/preset-export'

interface PresetExportProps {
  presetName: string
  onPresetNameChange: (name: string) => void
  adjustments: PresetAdjustments
  intensity: number
}

const VALID_CHARS = /^[A-Za-z0-9\s._-]*$/

export default function PresetExport({
  presetName,
  onPresetNameChange,
  adjustments,
  intensity,
}: PresetExportProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [validationError, setValidationError] = useState('')

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Please enter a preset name'
    if (name.length > 100) return 'Preset name must be less than 100 characters'
    if (!VALID_CHARS.test(name)) return 'Use only letters, numbers, spaces, -, _, .'
    return ''
  }

  const handleExport = () => {
    const error = validateName(presetName)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')

    const xmp = generatePresetXMP(adjustments, presetName)
    downloadPresetXMP(xmp, presetName)
    setShowInstructions(true)
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Export Preset (.xmp)</h2>

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
        Download .xmp Preset
      </button>

      {showInstructions && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Import on iPad</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open Lightroom on iPad and open any photo</li>
            <li>Tap <strong>Presets</strong></li>
            <li>Tap <strong>Yours</strong></li>
            <li>Tap the <strong>...</strong> menu</li>
            <li>Choose <strong>Import Presets</strong></li>
            <li>In Files, select the downloaded .xmp file</li>
          </ol>
          <h4 className="font-semibold mt-4 mb-2 text-sm">Troubleshooting</h4>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Import Presets missing?</strong> Open a photo first, then check Presets. Update Lightroom if needed.</li>
            <li><strong>File not found in Files?</strong> Save to Files or check Downloads folder in picker.</li>
            <li><strong>Preset not visible?</strong> Check Presets → Yours (may be under User Presets).</li>
            <li><strong>Partially compatible?</strong> Enable partially compatible presets in Lightroom settings.</li>
          </ul>
          <p className="text-xs text-gray-600 mt-4">
            Note: This is an approximate preset. Fine-tune adjustments in Lightroom for best results.
          </p>
        </div>
      )}
    </div>
  )
}
