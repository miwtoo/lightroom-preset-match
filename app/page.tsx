'use client'

import ImageUpload, { type ImageData } from '@/components/ImageUpload'
import PresetPreview from '@/components/PresetPreview'
import PresetExport from '@/components/PresetExport'
import Histogram from '@/components/Histogram'
import ColorMixer from '@/components/ColorMixer'
import Calibration from '@/components/Calibration'
import { useState, useCallback } from 'react'
import {
  generatePresetFromAnalysis,
  type PresetAdjustments,
  type ImageAnalysis,
  SUPPORTED_PROFILES,
} from '@/lib/preset-generator'
import type { HistogramData } from '@/lib/histogram'

const EMPTY_ADJUSTMENTS: PresetAdjustments = {
  profile: 'Adobe Color',
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  hue: {},
  saturation: {},
  luminance: {},
  calibration: {
    shadowTint: 0,
    redPrimary: { hue: 0, saturation: 0 },
    greenPrimary: { hue: 0, saturation: 0 },
    bluePrimary: { hue: 0, saturation: 0 },
  },
}

const BASIC_TONE_FIELDS = [
  { label: 'Exposure', key: 'exposure' },
  { label: 'Contrast', key: 'contrast' },
  { label: 'Highlights', key: 'highlights' },
  { label: 'Shadows', key: 'shadows' },
  { label: 'Whites', key: 'whites' },
  { label: 'Blacks', key: 'blacks' },
] as const

const PARAMETRIC_FIELDS = ['Highlights', 'Lights', 'Darks', 'Shadows'] as const

const TONE_STRIP = [
  { label: 'Z0', color: '#0d0d0d' },
  { label: 'ZI', color: '#171717' },
  { label: 'ZII', color: '#24211a' },
  { label: 'ZIII', color: '#302515' },
  { label: 'ZIV', color: '#3f2f18' },
  { label: 'ZV', color: '#4f3a1f' },
  { label: 'ZVI', color: '#6a4e2b' },
  { label: 'ZVII', color: '#8b6a44' },
  { label: 'ZVIII', color: '#b4946e' },
  { label: 'ZIX', color: '#d3c2ad' },
  { label: 'ZX', color: '#e6e6e6' },
]

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes)) return '-'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [adjustments, setAdjustments] = useState<PresetAdjustments | null>(null)
  const [intensity, setIntensity] = useState(60)
  const [presetName, setPresetName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  const [histogramBefore, setHistogramBefore] = useState<HistogramData | null>(null)
  const [histogramAfter, setHistogramAfter] = useState<HistogramData | null>(null)

  const handleHistogramUpdate = useCallback((histogram: HistogramData, target: 'before' | 'after') => {
    if (target === 'before') {
      setHistogramBefore(histogram)
    } else {
      setHistogramAfter(histogram)
    }
  }, [])

  const handleImageUpload = (data: ImageData) => {
    setImageData(data)
    setAdjustments(null)
    setUploadError('')
    setAnalysis(data.analysis)
    setHistogramBefore(null)
    setHistogramAfter(null)
    setIsProcessing(false)
  }

  const handleGenerate = () => {
    if (!analysis) return
    setAdjustments(generatePresetFromAnalysis(analysis))
  }

  const handleProfileChange = (profile: string) => {
    if (!adjustments) return
    setAdjustments({ ...adjustments, profile })
  }

  const handleClear = () => {
    setImageData(null)
    setAdjustments(null)
    setIntensity(60)
    setPresetName('')
    setUploadError('')
    setAnalysis(null)
    setHistogramBefore(null)
    setHistogramAfter(null)
  }

  const toneAdjustments = adjustments ?? EMPTY_ADJUSTMENTS
  const activeHistogram = adjustments ? histogramAfter ?? histogramBefore : histogramBefore
  const histogramLabel = adjustments ? 'After' : 'Before'

  return (
    <main className="min-h-screen px-6 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-base uppercase tracking-[0.3em] font-semibold">Lightroom Preset Generator</h1>
          <p className="text-xs text-[var(--muted)]">Private client-side workflow. Images never leave your device.</p>
        </div>
        <div className="flex items-center gap-4">
          {imageData && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-white"
            >
              Clear Session
            </button>
          )}
          <div className="text-xs text-[var(--muted)]">v1 editor shell</div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[320px_minmax(0,1fr)_360px]">
        <section
          aria-labelledby="panel-left-heading"
          className="panel p-5 order-3 md:col-span-2 lg:col-span-1 lg:order-1"
        >
          <h2 id="panel-left-heading" className="text-sm font-semibold uppercase tracking-[0.2em]">
            Histogram & Curves
          </h2>
          <div className="panel-divider my-4" />
          <div className="space-y-6">
            <Histogram data={activeHistogram} label={activeHistogram ? histogramLabel : undefined} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label htmlFor="intensity" className="panel-title">
                    Lift Intensity
                  </label>
                  {adjustments && intensity !== 60 && (
                    <button
                      type="button"
                      onClick={() => setIntensity(60)}
                      className="text-[10px] text-[var(--accent)] hover:underline tracking-widest uppercase"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <span className="text-xs text-[var(--accent)]">{intensity}%</span>
              </div>
              <input
                type="range"
                id="intensity"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="range-track range-accent"
                disabled={!adjustments}
                aria-disabled={!adjustments}
              />
              {!adjustments && (
                <p className="text-xs text-[var(--muted)]">Generate a preset to enable intensity.</p>
              )}
            </div>

            <div className="space-y-3">
              <span className="panel-title">Basic Tone</span>
              <div className="space-y-3">
                {BASIC_TONE_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs text-[var(--text)]" htmlFor={`tone-${field.key}`}>
                      {field.label}
                    </label>
                    <input
                      id={`tone-${field.key}`}
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={toneAdjustments[field.key] ?? 0}
                      className="range-track"
                      disabled
                      aria-disabled="true"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="panel-title">RGB Curve Preview</span>
              <div className="panel-inset p-3">
                <svg viewBox="0 0 120 70" className="w-full h-24" aria-hidden="true">
                  <rect x="0" y="0" width="120" height="70" fill="transparent" stroke="rgba(255,255,255,0.08)" />
                  <path d="M0 60 C 25 55, 45 40, 120 10" stroke="rgba(255, 78, 78, 0.8)" strokeWidth="2" fill="none" />
                  <path d="M0 62 C 35 55, 55 32, 120 8" stroke="rgba(105, 255, 131, 0.8)" strokeWidth="2" fill="none" />
                  <path d="M0 64 C 30 52, 65 28, 120 6" stroke="rgba(90, 160, 255, 0.8)" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <span className="panel-title">Parametric Curve</span>
              <div className="space-y-3">
                {PARAMETRIC_FIELDS.map((label) => (
                  <div key={label} className="space-y-1">
                    <label className="text-xs text-[var(--text)]" htmlFor={`curve-${label}`}>
                      {label}
                    </label>
                    <input
                      id={`curve-${label}`}
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={0}
                      className="range-track"
                      disabled
                      aria-disabled="true"
                    />
                  </div>
                ))}
              </div>
            </div>

            <ColorMixer
              hue={toneAdjustments.hue}
              saturation={toneAdjustments.saturation}
              luminance={toneAdjustments.luminance}
            />

            <Calibration calibration={toneAdjustments.calibration} />
          </div>
        </section>

        <section aria-labelledby="panel-center-heading" className="panel p-5 order-1 lg:order-2">
          <h2 id="panel-center-heading" className="text-sm font-semibold uppercase tracking-[0.2em]">
            Preview
          </h2>
          <div className="panel-divider my-4" />
          <div className="space-y-4">
            {imageData ? (
              <PresetPreview
                imageData={imageData}
                adjustments={adjustments}
                intensity={intensity}
                onHistogramUpdate={handleHistogramUpdate}
              />
            ) : (
              <div className="panel-inset p-6 text-center text-sm text-[var(--muted)]">
                Upload a reference image to start the preview.
              </div>
            )}

            <div className="grid grid-cols-11 gap-1 text-[10px] uppercase tracking-[0.2em]">
              {TONE_STRIP.map((tone, idx) => {
                const zoneWeight = analysis?.zones[idx] ?? 0
                return (
                  <div key={tone.label} className="text-center group relative">
                    {zoneWeight > 0 && (
                      <div
                        className="absolute bottom-full left-0 right-0 bg-[var(--accent)] opacity-40 transition-all duration-500 rounded-t-sm"
                        style={{ height: `${Math.min(40, zoneWeight * 2)}px` }}
                      />
                    )}
                    <div
                      className="h-10 rounded-sm border border-[rgba(255,255,255,0.08)] relative z-10"
                      style={{ backgroundColor: tone.color }}
                    />
                    <span className="text-[9px] text-[var(--muted)]">{tone.label}</span>
                  </div>
                )
              })}
            </div>

            {imageData && !adjustments && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!analysis}
                className="button-cta w-full py-3 text-xs tracking-[0.3em]"
                data-testid="generate-preset"
                data-analysis-ready={!!analysis}
              >
                Generate Preset
              </button>
            )}
          </div>
        </section>

        <section aria-labelledby="panel-right-heading" className="panel p-5 order-2 lg:order-3">
          <h2 id="panel-right-heading" className="text-sm font-semibold uppercase tracking-[0.2em]">
            Preset & Export
          </h2>
          <div className="panel-divider my-4" />
          <div className="space-y-5">
            <div className="panel-inset p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Reference image</span>
                {imageData ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="button-ghost px-2 py-1 text-[10px] tracking-[0.2em]"
                    aria-label="Clear session"
                  >
                    X
                  </button>
                ) : null}
              </div>
              {imageData ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--accent)]">{imageData.file.name}</span>
                </div>
              ) : (
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onError={(error) => setUploadError(error)}
                  onProcessingChange={setIsProcessing}
                />
              )}
              {isProcessing && (
                <p className="text-xs text-[var(--muted)] animate-pulse">Processing image...</p>
              )}
              {uploadError && (
                <p className="text-xs text-red-400" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            <div className="panel-inset p-4 space-y-4">
              <div className="space-y-3">
                <label className="panel-title" htmlFor="profile-select">
                  Color Profile
                </label>
                <select
                  id="profile-select"
                  className="input-dark w-full px-2 py-2 text-sm bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-sm"
                  value={adjustments?.profile ?? 'Adobe Color'}
                  onChange={(e) => handleProfileChange(e.target.value)}
                  disabled={!adjustments}
                >
                  {SUPPORTED_PROFILES.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </select>
                {!adjustments && (
                  <p className="text-[10px] text-[var(--muted)]">Generate a preset to change profiles.</p>
                )}
              </div>

              {adjustments && imageData ? (
                <PresetExport
                  presetName={presetName}
                  onPresetNameChange={setPresetName}
                  adjustments={adjustments}
                  intensity={intensity}
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">Export Preset</h3>
                    <span className="text-[11px] text-[var(--muted)]">.xmp</span>
                  </div>
                  <label className="panel-title" htmlFor="presetNameDisabled">
                    Preset Name
                  </label>
                  <input
                    id="presetNameDisabled"
                    type="text"
                    disabled
                    className="input-dark w-full px-3 py-2 text-sm"
                    placeholder="Generate a preset to enable export"
                  />
                  <button type="button" disabled className="button-cta w-full py-3 text-sm tracking-[0.2em]">
                    Export Preset
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <span className="panel-title">Camera settings (EXIF data)</span>
              {imageData ? (
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Filename</dt>
                    <dd>{imageData.file.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Dimensions</dt>
                    <dd>
                      {imageData.width} x {imageData.height}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Type</dt>
                    <dd>{imageData.file.type || 'image/*'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Size</dt>
                    <dd>{formatFileSize(imageData.file.size)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-xs text-[var(--muted)]">Upload a reference image to see file info.</p>
              )}
            </div>

            <div className="panel-divider my-2" />
            <div className="space-y-2">
              <span className="panel-title">Privacy</span>
              <p className="text-[10px] leading-relaxed text-[var(--muted)]">
                This application processes images entirely in your browser. No image data,
                presets, or metadata are ever uploaded to a server.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
