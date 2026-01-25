'use client'

import ImageUpload from '@/components/ImageUpload'
import PresetPreview from '@/components/PresetPreview'
import PresetControls from '@/components/PresetControls'
import PresetExport from '@/components/PresetExport'
import { useState } from 'react'
import type { PresetAdjustments } from '@/lib/preset-generator'

interface ImageData {
  src: string
  file: File
  width: number
  height: number
}

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [adjustments, setAdjustments] = useState<PresetAdjustments | null>(null)
  const [intensity, setIntensity] = useState(100)
  const [presetName, setPresetName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonMode, setComparisonMode] = useState<'split' | 'side-by-side'>('split')

  const handleImageUpload = (data: ImageData) => {
    setImageData(data)
    setAdjustments(null)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setAdjustments({
        exposure: 0,
        contrast: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        hue: {},
        saturation: {},
        luminance: {},
      })
      setIsGenerating(false)
    }, 1000)
  }

  const handleClear = () => {
    setImageData(null)
    setAdjustments(null)
    setIntensity(100)
    setPresetName('')
  }

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Lightroom Preset Generator</h1>
        <p className="text-gray-600">Generate Lightroom presets from reference images</p>
      </div>

      <div className="space-y-6">
        <ImageUpload
          onImageUpload={handleImageUpload}
          onError={(error) => console.error('Upload error:', error)}
        />

        {imageData && !adjustments && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Preset'}
          </button>
        )}

        {adjustments && imageData && (
          <>
            <PresetPreview
              imageData={imageData}
              adjustments={adjustments}
              intensity={intensity}
              comparisonMode={comparisonMode}
            />

            <PresetControls
              intensity={intensity}
              onIntensityChange={setIntensity}
              onReset={() => setIntensity(100)}
              onClear={handleClear}
            />

            <PresetExport
              presetName={presetName}
              onPresetNameChange={setPresetName}
              adjustments={adjustments}
              intensity={intensity}
            />
          </>
        )}
      </div>
    </main>
  )
}
