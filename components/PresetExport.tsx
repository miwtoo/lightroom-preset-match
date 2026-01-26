'use client'

import { useState } from 'react'
import type { PresetAdjustments } from '@/lib/preset-generator'
import { downloadPresetXMP, generatePresetXMPWithIntensity } from '@/lib/preset-export'

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

    const xmp = generatePresetXMPWithIntensity(adjustments, presetName, intensity)
    downloadPresetXMP(xmp, presetName)
    setShowInstructions(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">Export Preset</h3>
        <span className="text-[11px] text-[var(--muted)]">.xmp</span>
      </div>

      <div className="space-y-2">
        <label htmlFor="presetName" className="panel-title">
          Preset Name
        </label>
        <input
          type="text"
          id="presetName"
          value={presetName}
          onChange={(e) => onPresetNameChange(e.target.value)}
          className="input-dark w-full px-3 py-2 text-sm"
          placeholder="Enter preset name"
        />
        {validationError && (
          <p className="text-xs text-red-400" role="alert">
            {validationError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <span className="panel-title">Export To</span>
        <div className="flex gap-2">
          <input
            type="text"
            disabled
            className="input-dark w-full px-3 py-2 text-xs"
            placeholder="No folder selected..."
          />
          <button type="button" disabled className="button-ghost px-3 text-xs">
            ...
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">Folder export is disabled on iPad Safari.</p>
      </div>

      <button
        type="button"
        onClick={handleExport}
        className="button-cta w-full py-3 text-sm tracking-[0.2em]"
      >
        Export Preset
      </button>

      {showInstructions && (
        <div className="panel-inset p-4 text-sm">
          <h4 className="font-semibold mb-2 text-sm">How to Import on iPad</h4>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[var(--text)]">
            <li>Open Lightroom on iPad and open any photo</li>
            <li>Tap <strong>Presets</strong></li>
            <li>Tap <strong>Yours</strong></li>
            <li>Tap the <strong>...</strong> menu</li>
            <li>Choose <strong>Import Presets</strong></li>
            <li>In Files, select the downloaded .xmp file</li>
          </ol>
          <h5 className="font-semibold mt-4 mb-2 text-xs">Troubleshooting</h5>
          <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)]">
            <li><strong>Import Presets missing?</strong> Open a photo first, then check Presets. Update Lightroom if needed.</li>
            <li><strong>File not found in Files?</strong> Save to Files or check Downloads folder in picker.</li>
            <li><strong>Preset not visible?</strong> Check Presets → Yours (may be under User Presets).</li>
            <li><strong>Partially compatible?</strong> Enable partially compatible presets in Lightroom settings.</li>
          </ul>
          <p className="text-xs text-[var(--muted)] mt-4">
            Note: This is an approximate preset. Fine-tune adjustments in Lightroom for best results.
          </p>
        </div>
      )}
    </div>
  )
}
